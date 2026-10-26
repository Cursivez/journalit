import { t, tPlural } from '../../../lang/helpers';
import {
  OptionCatalogMutationError,
  type MaterializedOptionChange,
} from '../../agent/configuration/optionCatalogMutation';
import { isEventRewritePlan } from '../../agent/configuration/noteRewritePlan';
import type { OptionCatalogPlanner } from '../../agent/configuration/OptionCatalogPlanner';
import type {
  OptionAffectedEntry,
  OptionCatalogChange,
  OptionChangeSummary,
} from '../../agent/configuration/optionChangeTypes';
import {
  ActionExecutionError,
  ActionPlanError,
  ActionPlanInUseError,
} from '../ActionErrors';
import type {
  ActionDefinition,
  ActionDefinitions,
  ActionDisplay,
  ActionInput,
  ActionPlan,
  ActionSummary,
} from '../ActionTypes';

type CreateId =
  | 'tag.create'
  | 'mistake.create'
  | 'account_type.create'
  | 'event.create';
type SingleId =
  | 'tag.set_color'
  | 'tag.clear_color'
  | 'tag.rename'
  | 'tag.merge'
  | 'tag.delete'
  | 'mistake.rename'
  | 'mistake.merge'
  | 'mistake.delete'
  | 'account_type.rename'
  | 'account_type.move'
  | 'account_type.delete'
  | 'event.update_style'
  | 'event.rename'
  | 'event.merge'
  | 'event.delete';
type CreateChange = Extract<
  OptionCatalogChange,
  {
    kind:
      | 'create_tag'
      | 'create_mistake'
      | 'create_account_type'
      | 'create_event';
  }
>;

type OptionActionDefinitions = Pick<ActionDefinitions, CreateId | SingleId>;

type Planner = Pick<
  OptionCatalogPlanner,
  'plan' | 'planCreates' | 'execute' | 'executeCreates'
>;

function planError(error: unknown): never {
  if (error instanceof OptionCatalogMutationError) {
    switch (error.code) {
      case 'conflict':
        if (error.inUse) throw new ActionPlanInUseError();
        throw new ActionPlanError(error.code);
      case 'invalid_request':
      case 'not_found':
      case 'limit_exceeded':
        throw new ActionPlanError(error.code);
      case 'internal_error':
        break;
    }
  }
  throw error;
}

function executionError(error: unknown): never {
  if (error instanceof OptionCatalogMutationError) {
    switch (error.code) {
      case 'conflict':
        throw new ActionExecutionError('conflict', false);
      case 'not_found':
        throw new ActionExecutionError('not_found', false);
      case 'invalid_request':
      case 'limit_exceeded':
        throw new ActionExecutionError('invalid_request', false);
      case 'internal_error':
        
        throw new ActionExecutionError('write_failed', true);
    }
  }
  throw error;
}


function catalogWrites(catalog: OptionChangeSummary['catalog']): {
  writes?: readonly string[];
} {
  return catalog === 'account_types' ? { writes: ['account:'] } : {};
}


function rewriteAccess(materialized: MaterializedOptionChange): {
  writes?: readonly string[];
  dependsOn?: readonly string[];
} {
  const plan = materialized.plan;
  if (!plan) return catalogWrites(materialized.catalog);
  const mutationPaths = new Set(
    plan.mutations.map((mutation) => mutation.path)
  );
  const writes = [
    ...(catalogWrites(materialized.catalog).writes ?? []),
    ...[...mutationPaths].map((path) => `note:${path}`),
  ];
  const readOnly = new Set<string>();
  if (isEventRewritePlan(plan)) {
    for (const reference of plan.references) {
      if (!mutationPaths.has(reference.path)) {
        readOnly.add(`note:${reference.path}`);
      }
    }
  }
  const dependsOn = [...readOnly];
  return {
    ...(writes.length > 0 ? { writes } : {}),
    ...(dependsOn.length > 0 ? { dependsOn } : {}),
  };
}

function catalogTarget(summary: OptionChangeSummary): string {
  return t(`actions.options.catalog.${summary.catalog}`);
}

function entryLabel(entry: OptionAffectedEntry): string {
  return 'name' in entry ? entry.name : entry.value;
}


export function describeOptionRename(
  source: string,
  target: string,
  count: number,
  unit: 'notes' | 'accounts' = 'notes'
): string {
  if (count === 0) return t('actions.options.rename-none', { source, target });
  return tPlural(
    unit === 'notes'
      ? 'actions.options.rename'
      : 'actions.options.rename-account-type',
    count,
    { source, target }
  );
}

function describeOptionMerge(
  source: string,
  target: string,
  count: number
): string {
  if (count === 0) return t('actions.options.merge-none', { source, target });
  return tPlural('actions.options.merge', count, { source, target });
}

export function describeOptionDelete(value: string, count: number): string {
  if (count === 0) return t('actions.options.delete-entry', { value });
  return tPlural('actions.options.delete', count, { value });
}


function describeChange(summary: OptionChangeSummary): string {
  switch (summary.action) {
    case 'create_tag':
    case 'create_mistake':
    case 'create_account_type':
      return summary.value;
    case 'create_event':
      return summary.name;
    case 'set_tag_color':
      return t('actions.options.set-color', { value: summary.value });
    case 'clear_tag_color':
      return t('actions.options.clear-color', { value: summary.value });
    case 'update_event_style':
      return t('actions.options.update-style', { value: summary.name });
    case 'rename_tag':
    case 'rename_mistake':
      return describeOptionRename(
        summary.source_value,
        summary.target_value,
        summary.affected_note_count
      );
    case 'rename_event':
      return describeOptionRename(
        summary.source_name,
        summary.target_name,
        summary.affected_note_count
      );
    case 'rename_account_type':
      return describeOptionRename(
        summary.source_value,
        summary.target_value,
        summary.affected_account_count,
        'accounts'
      );
    case 'merge_tags':
    case 'merge_mistakes':
      return describeOptionMerge(
        summary.source_value,
        summary.target_value,
        summary.affected_note_count
      );
    case 'merge_events':
      return describeOptionMerge(
        summary.source_name,
        summary.target_name,
        summary.affected_note_count
      );
    case 'delete_tag':
    case 'delete_mistake':
      return describeOptionDelete(summary.value, summary.affected_note_count);
    case 'delete_event':
      return t('actions.options.delete-entry', { value: summary.name });
    case 'delete_account_type':
      return t('actions.options.delete-entry', { value: summary.value });
    case 'move_account_type':
      return summary.before_value === undefined
        ? t('actions.options.move-last', { value: summary.value })
        : t('actions.options.move', {
            value: summary.value,
            before: summary.before_value,
          });
    default: {
      const exhaustive: never = summary;
      return exhaustive;
    }
  }
}


function singleSummary<Id extends SingleId>(
  materialized: MaterializedOptionChange
): ActionSummary<Id> {
  return {
    base_revision: materialized.baseRevision,
    resulting_revision: materialized.resultingRevision,
    change: structuredClone(materialized.summary),
    affected_entry: structuredClone(materialized.affectedEntry),
  } as ActionSummary<Id>;
}

function single<Id extends SingleId>(
  planner: Planner,
  toChange: (input: ActionInput<Id>) => OptionCatalogChange
): ActionDefinition<Id> {
  return {
    async plan(input, context): Promise<ActionPlan<Id>> {
      let materialized: MaterializedOptionChange;
      try {
        materialized = await planner.plan(toChange(input), context.signal);
      } catch (error) {
        if (context.signal.aborted) throw context.signal.reason;
        return planError(error);
      }
      const summary = singleSummary<Id>(materialized);
      const display: ActionDisplay = {
        target: catalogTarget(materialized.summary),
        changes: [describeChange(materialized.summary)],
      };
      return {
        target: `catalog:${materialized.catalog}`,
        ...rewriteAccess(materialized),
        summary,
        affectedNotes: materialized.plan?.affectedNoteCount ?? 0,
        ...(materialized.discardsUserSettings
          ? { discardsUserSettings: true }
          : {}),
        display,
        execute: async (signal) => {
          try {
            await planner.execute(materialized, signal);
          } catch (error) {
            if (signal.aborted) throw signal.reason;
            return executionError(error);
          }
          return summary;
        },
      };
    },
  };
}

function create<Id extends CreateId>(
  planner: Planner,
  toChange: (value: ActionInput<Id>['values'][number]) => CreateChange
): ActionDefinition<Id> {
  return {
    async plan(input, context): Promise<ActionPlan<Id>> {
      const changes = input.values.map(toChange);
      let sequence: Awaited<ReturnType<Planner['planCreates']>>;
      try {
        sequence = await planner.planCreates(changes, context.signal);
      } catch (error) {
        if (context.signal.aborted) throw context.signal.reason;
        return planError(error);
      }
      
      const summary = {
        base_revision: sequence.baseRevision,
        resulting_revision: sequence.resultingRevision,
        created: sequence.entries.map((entry) => ({
          change: structuredClone(entry.summary),
          affected_entry: structuredClone(entry.affectedEntry),
        })),
      } as ActionSummary<Id>;
      return {
        target: `catalog:${sequence.entries[0].catalog}`,
        ...catalogWrites(sequence.entries[0].catalog),
        summary,
        affectedNotes: 0,
        display: {
          target: catalogTarget(sequence.entries[0].summary),
          changes: [
            t('actions.options.create', {
              labels: sequence.entries
                .map((entry) => entryLabel(entry.affectedEntry))
                .join(', '),
            }),
          ],
        },
        execute: async (signal) => {
          try {
            await planner.executeCreates(sequence, changes, signal);
          } catch (error) {
            if (signal.aborted) throw signal.reason;
            return executionError(error);
          }
          return summary;
        },
      };
    },
  };
}


export function createOptionActions(planner: Planner): OptionActionDefinitions {
  return {
    'tag.create': create<'tag.create'>(planner, (value) => ({
      kind: 'create_tag',
      ...value,
    })),
    'tag.set_color': single<'tag.set_color'>(planner, (input) => ({
      kind: 'set_tag_color',
      ...input,
    })),
    'tag.clear_color': single<'tag.clear_color'>(planner, (input) => ({
      kind: 'clear_tag_color',
      ...input,
    })),
    'tag.rename': single<'tag.rename'>(planner, (input) => ({
      kind: 'rename_tag',
      ...input,
    })),
    'tag.merge': single<'tag.merge'>(planner, (input) => ({
      kind: 'merge_tags',
      ...input,
    })),
    'tag.delete': single<'tag.delete'>(planner, (input) => ({
      kind: 'delete_tag',
      ...input,
    })),
    'mistake.create': create<'mistake.create'>(planner, (value) => ({
      kind: 'create_mistake',
      ...value,
    })),
    'mistake.rename': single<'mistake.rename'>(planner, (input) => ({
      kind: 'rename_mistake',
      ...input,
    })),
    'mistake.merge': single<'mistake.merge'>(planner, (input) => ({
      kind: 'merge_mistakes',
      ...input,
    })),
    'mistake.delete': single<'mistake.delete'>(planner, (input) => ({
      kind: 'delete_mistake',
      ...input,
    })),
    'account_type.create': create<'account_type.create'>(planner, (value) => ({
      kind: 'create_account_type',
      ...value,
    })),
    'account_type.rename': single<'account_type.rename'>(planner, (input) => ({
      kind: 'rename_account_type',
      ...input,
    })),
    'account_type.move': single<'account_type.move'>(planner, (input) => ({
      kind: 'move_account_type',
      ...input,
    })),
    'account_type.delete': single<'account_type.delete'>(planner, (input) => ({
      kind: 'delete_account_type',
      ...input,
    })),
    'event.create': create<'event.create'>(planner, (value) => ({
      kind: 'create_event',
      ...value,
    })),
    'event.update_style': single<'event.update_style'>(planner, (input) => ({
      kind: 'update_event_style',
      ...input,
    })),
    'event.rename': single<'event.rename'>(planner, (input) => ({
      kind: 'rename_event',
      ...input,
    })),
    'event.merge': single<'event.merge'>(planner, (input) => ({
      kind: 'merge_events',
      ...input,
    })),
    'event.delete': single<'event.delete'>(planner, (input) => ({
      kind: 'delete_event',
      ...input,
    })),
  };
}
