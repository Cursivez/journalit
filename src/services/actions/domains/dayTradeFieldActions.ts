import type { TFile } from 'obsidian';
import { t, tPlural } from '../../../lang/helpers';
import type { CustomFieldDefinition } from '../../../types/customFields';
import {
  customFieldRef,
  diffDayTradeFieldRules,
  planDayTradeFieldUpdate,
  readDayTradeFieldRules,
  resolveDayTradeField,
  type DayTradeFieldChange,
  type DayTradeFieldRef,
  type DayTradeFieldRule,
} from '../../drc/dayTradeFields';
import {
  hasTradeJournalChanges,
  type TradeJournalValues,
} from '../../trade/core/TradeJournalFields';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import type {
  ActionDefinition,
  ActionDefinitions,
  ActionInput,
  ActionPlanContext,
  ActionSummary,
} from '../ActionTypes';
import {
  catalogMistakes,
  catalogTags,
  throwIfAborted,
} from './tradeActionSupport';
import {
  resolveCustomFieldChanges,
  type CustomFieldCatalog,
} from './tradeCustomFieldValues';

type Input = ActionInput<'review.set_day_trade_fields'>;
type ChangedField =
  ActionSummary<'review.set_day_trade_fields'>['changed_fields'][number];

const CHANGED_FIELD_ORDER: readonly ChangedField[] = [
  'setup_ids',
  'mistakes',
  'tags',
  'custom_fields',
];


interface DayTradeFieldActionDependencies {
  
  resolveDayReview(
    review: Input['review'],
    signal: AbortSignal
  ): Promise<TFile | null>;
  readFrontmatter(file: TFile): Record<string, unknown> | undefined;
  customFields: CustomFieldCatalog & {
    getFields(): CustomFieldDefinition[];
  };
  getAvailableTags(): readonly string[];
  getAvailableMistakes(): readonly string[];
  
  resolveSetupId(setupId: string): Promise<string | null>;
  getDayTradePaths(day: string): string[];
  
  readTradeJournalValues(path: string): TradeJournalValues | null;
  saveRules(
    file: TFile,
    rules: DayTradeFieldRule[],
    guard: (current: Record<string, unknown>) => void
  ): Promise<void>;
  applyRuleChanges(
    day: string,
    tradePaths: string[],
    changes: DayTradeFieldChange[]
  ): Promise<{ changed: number; failedPaths: string[] }>;
}


class DayTradeFieldsConflictError extends Error {}

function changedField(ref: DayTradeFieldRef): ChangedField {
  if (ref === 'setup') return 'setup_ids';
  if (ref === 'mistake') return 'mistakes';
  if (ref === 'tags') return 'tags';
  return 'custom_fields';
}


export function createDayTradeFieldActions(
  deps: DayTradeFieldActionDependencies
): Pick<ActionDefinitions, 'review.set_day_trade_fields'> {
  
  const requestedRules = async (
    fields: Input['fields'],
    definitions: CustomFieldDefinition[],
    signal: AbortSignal
  ): Promise<Map<DayTradeFieldRef, unknown>> => {
    const requested = new Map<DayTradeFieldRef, unknown>();
    if (fields.setup_ids !== undefined) {
      
      
      const resolved = await Promise.allSettled(
        fields.setup_ids.map((setupId) => deps.resolveSetupId(setupId))
      );
      throwIfAborted(signal);
      const names: string[] = [];
      for (const outcome of resolved) {
        if (outcome.status === 'rejected') throw outcome.reason;
        if (outcome.value === null) {
          throw new ActionPlanError('not_found', 'fields.setup_ids');
        }
        names.push(outcome.value);
      }
      requested.set('setup', names);
    }
    if (fields.mistakes !== undefined) {
      requested.set(
        'mistake',
        fields.mistakes.length === 0
          ? []
          : catalogMistakes(
              fields.mistakes,
              deps.getAvailableMistakes(),
              'fields.mistakes'
            )
      );
    }
    if (fields.tags !== undefined) {
      requested.set(
        'tags',
        fields.tags.length === 0
          ? []
          : catalogTags(fields.tags, deps.getAvailableTags(), 'fields.tags')
      );
    }
    const seen = new Set<string>();
    for (const change of fields.custom_fields ?? []) {
      const ref = customFieldRef(change.field_id);
      if (seen.has(ref)) {
        throw new ActionPlanError('invalid_request', 'fields.custom_fields');
      }
      seen.add(ref);
      
      if (!resolveDayTradeField(ref, definitions)) {
        throw new ActionPlanError('not_found', 'fields.custom_fields');
      }
      if (change.value === null) {
        
        requested.set(ref, undefined);
        continue;
      }
      const [resolved] = resolveCustomFieldChanges(
        [change],
        deps.customFields,
        'fields.custom_fields'
      );
      if (resolved.createdOptions.length > 0) {
        
        throw new ActionPlanError('invalid_request', 'fields.custom_fields');
      }
      requested.set(ref, resolved.value);
    }
    return requested;
  };

  const set: ActionDefinition<'review.set_day_trade_fields'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      if (input.review.period !== 'day') {
        throw new ActionPlanError('unsupported_capability', 'review');
      }
      const day = input.review.period_start;
      const file = await deps.resolveDayReview(input.review, signal);
      throwIfAborted(signal);
      if (!file) throw new ActionPlanError('not_found', 'review');

      const definitions = deps.customFields.getFields();
      const requested = await requestedRules(input.fields, definitions, signal);
      const base = readDayTradeFieldRules(deps.readFrontmatter(file));
      const draft: DayTradeFieldRule[] = base.map((rule) =>
        requested.has(rule.field)
          ? { field: rule.field, value: requested.get(rule.field) }
          : rule
      );
      for (const [field, value] of requested) {
        if (!base.some((rule) => rule.field === field)) {
          draft.push({ field, value });
        }
      }
      const { nextRules, changes } = diffDayTradeFieldRules(
        base,
        draft,
        definitions
      );
      const changed = CHANGED_FIELD_ORDER.filter((field) =>
        changes.some((change) => changedField(change.ref) === field)
      );

      
      const resolved = changes.flatMap((change) => {
        const field = resolveDayTradeField(change.ref, definitions);
        return field ? [{ ...change, field }] : [];
      });
      const touched = resolved.length
        ? deps.getDayTradePaths(day).filter((path) => {
            const current = deps.readTradeJournalValues(path);
            return (
              current !== null &&
              hasTradeJournalChanges(
                planDayTradeFieldUpdate(day, resolved, current)
              )
            );
          })
        : [];
      const baseKey = JSON.stringify(base);

      return {
        target: `review:day:${day}:day_trade_fields`,
        writes: [`note:${file.path}`, ...touched.map((path) => `note:${path}`)],
        summary: {
          review: structuredClone(input.review),
          changed_fields: changed,
          trade_count: touched.length,
        },
        
        affectedNotes: changes.length > 0 ? 1 + touched.length : 0,
        display: {
          target: t('actions.review.target.day', { date: day }),
          changes:
            changes.length === 0
              ? []
              : [
                  tPlural(
                    'actions.review.day-trade-fields.set',
                    touched.length
                  ),
                ],
        },
        
        
        
        
        
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          const result = {
            review: structuredClone(input.review),
            updated_trade_count: 0,
            failed_trade_count: 0,
          };
          if (changes.length === 0) return result;
          try {
            await deps.saveRules(file, nextRules, (current) => {
              if (JSON.stringify(readDayTradeFieldRules(current)) !== baseKey) {
                throw new DayTradeFieldsConflictError();
              }
            });
          } catch (error) {
            if (error instanceof DayTradeFieldsConflictError) {
              throw new ActionExecutionError('conflict', false);
            }
            throw new ActionExecutionError('write_failed', true);
          }
          
          
          const applied = await deps.applyRuleChanges(
            day,
            deps.getDayTradePaths(day),
            changes
          );
          return {
            ...result,
            updated_trade_count: applied.changed,
            failed_trade_count: applied.failedPaths.length,
          };
        },
      };
    },
  };

  return { 'review.set_day_trade_fields': set };
}
