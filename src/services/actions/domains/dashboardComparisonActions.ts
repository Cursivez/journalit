import {
  type DashboardComparisonFilters,
  type SavedDashboardComparison,
  SAVED_COMPARISON_NAME_MAX_LENGTH,
  createSavedComparisonId,
} from '../../../components/dashboard/compare/dashboardComparison';
import { describeComparisonFilters } from '../../../components/dashboard/compare/describeComparisonFilters';
import { t } from '../../../lang/helpers';
import { dashboardComparisonRevision } from '../../agent/configuration/dashboardComparisonConfiguration';
import { canonicalizeConfigurationValue } from '../../agent/configuration/configurationPrimitives';
import {
  type DashboardFilterIdentities,
  DashboardFilterError,
  type WireComparisonFilters,
  type WireFilterResolver,
  dashboardSideFromWire,
  wireSideFromDashboard,
  withSetupNamesResolved,
} from '../../agent/dashboard/dashboardFilters';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionDefinitions,
  type ActionInput,
  type ActionPlanContext,
  type ActionSummary,
} from '../ActionTypes';
import { throwIfAborted } from './tradeActionSupport';

type DashboardComparisonActionId =
  | 'dashboard_comparison.create'
  | 'dashboard_comparison.update'
  | 'dashboard_comparison.delete';
type ComparisonFields = ActionInput<'dashboard_comparison.update'>['fields'];
type ChangedField =
  ActionSummary<'dashboard_comparison.update'>['changed_fields'][number];

const CHANGED_FIELD_ORDER: readonly ChangedField[] = ['name', 'a', 'b'];

interface DashboardComparisonActionDependencies {
  getSaved(): readonly SavedDashboardComparison[];
  save(next: SavedDashboardComparison[]): Promise<void>;
  
  ids: WireFilterResolver & DashboardFilterIdentities;
}


function nameKey(name: string): string {
  return name.toLowerCase();
}

function sameValue(left: unknown, right: unknown): boolean {
  return (
    JSON.stringify(canonicalizeConfigurationValue(left)) ===
    JSON.stringify(canonicalizeConfigurationValue(right))
  );
}

function changedFields(
  before: SavedDashboardComparison,
  after: SavedDashboardComparison
): ChangedField[] {
  const changed: Record<ChangedField, boolean> = {
    name: before.name !== after.name,
    a: !sameValue(before.a, after.a),
    b: !sameValue(before.b, after.b),
  };
  return CHANGED_FIELD_ORDER.filter((field) => changed[field]);
}

function trimmedName(name: string): string {
  return name.trim().slice(0, SAVED_COMPARISON_NAME_MAX_LENGTH);
}

function assertUniqueName(
  saved: readonly SavedDashboardComparison[],
  name: string,
  except: string | undefined,
  field: string
): void {
  const key = nameKey(name);
  if (
    saved.some(
      (comparison) =>
        comparison.id !== except && nameKey(comparison.name) === key
    )
  ) {
    throw new ActionPlanError('conflict', field);
  }
}

async function sideFromWire(
  wire: WireComparisonFilters,
  resolver: WireFilterResolver,
  field: 'a' | 'b' | 'fields.a' | 'fields.b'
): Promise<DashboardComparisonFilters> {
  try {
    return await dashboardSideFromWire(wire, resolver);
  } catch (error) {
    if (error instanceof DashboardFilterError) {
      throw new ActionPlanError(error.code, `${field}.${error.field}`);
    }
    throw error;
  }
}


function settledValue<T>(result: PromiseSettledResult<T>): T {
  if (result.status === 'rejected') throw result.reason;
  return result.value;
}

function comparisonLabel(comparison: {
  a: DashboardComparisonFilters;
  b: DashboardComparisonFilters;
}): string {
  return t('dashboard.compare.name-suggestion', {
    a: describeComparisonFilters(comparison.a),
    b: describeComparisonFilters(comparison.b),
  });
}


async function restoringUpdate(
  previous: SavedDashboardComparison,
  written: SavedDashboardComparison,
  revision: string,
  deps: DashboardComparisonActionDependencies
): Promise<ActionInput<'dashboard_comparison.update'> | null> {
  try {
    const fields: ComparisonFields = {};
    const restored: SavedDashboardComparison = { ...written };
    for (const field of changedFields(written, previous)) {
      if (field === 'name') {
        fields.name = previous.name;
        restored.name = previous.name;
        continue;
      }
      const side = await wireSideFromDashboard(previous[field], deps.ids);
      if (side.unrepresented_criteria) return null;
      fields[field] = side.filters;
      restored[field] = await dashboardSideFromWire(side.filters, deps.ids);
    }
    return (await dashboardComparisonRevision(restored)) ===
      (await dashboardComparisonRevision(previous))
      ? { comparison_id: previous.id, expected_revision: revision, fields }
      : null;
  } catch (error) {
    console.warn('[Journalit] Could not capture a comparison change:', error);
    return null;
  }
}


export function createDashboardComparisonActions(
  deps: DashboardComparisonActionDependencies
): Pick<ActionDefinitions, DashboardComparisonActionId> {
  const requireComparison = (id: string): SavedDashboardComparison => {
    const comparison = deps.getSaved().find((saved) => saved.id === id);
    if (!comparison) throw new ActionPlanError('not_found', 'comparison_id');
    return comparison;
  };

  
  const currentAt = async (
    id: string,
    baseRevision: string
  ): Promise<SavedDashboardComparison> => {
    const current = deps.getSaved().find((saved) => saved.id === id);
    if (!current) throw new ActionExecutionError('not_found', false);
    if ((await dashboardComparisonRevision(current)) !== baseRevision) {
      throw new ActionExecutionError('conflict', false);
    }
    return current;
  };

  const save = async (next: SavedDashboardComparison[]): Promise<void> => {
    try {
      await deps.save(next);
    } catch {
      throw new ActionExecutionError('write_failed', true);
    }
  };

  const create: ActionDefinition<'dashboard_comparison.create'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      const name = trimmedName(input.name);
      if (!name) throw new ActionPlanError('invalid_request', 'name');
      assertUniqueName(deps.getSaved(), name, undefined, 'name');
      const ids = await withSetupNamesResolved([input.a, input.b], deps.ids);
      const [aResult, bResult] = await Promise.allSettled([
        sideFromWire(input.a, ids, 'a'),
        sideFromWire(input.b, ids, 'b'),
      ]);
      const a = settledValue(aResult);
      const b = settledValue(bResult);
      throwIfAborted(context.signal);
      return {
        target: `dashboard_comparison:new:${nameKey(input.name)}`,
        summary: { name: input.name },
        affectedNotes: 0,
        display: {
          target: name,
          changes: [
            t('actions.dashboard-comparison.create', {
              comparison: comparisonLabel({ a, b }),
            }),
          ],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          const saved = deps.getSaved();
          try {
            assertUniqueName(saved, name, undefined, 'name');
          } catch {
            throw new ActionExecutionError('conflict', false);
          }
          const comparison: SavedDashboardComparison = {
            id: createSavedComparisonId(),
            name,
            a,
            b,
          };
          await save([...saved, comparison]);
          return {
            comparison_id: comparison.id,
            revision: await dashboardComparisonRevision(comparison),
          };
        },
      };
    },
  };

  const update: ActionDefinition<'dashboard_comparison.update'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      const comparison = requireComparison(input.comparison_id);
      const baseRevision = await dashboardComparisonRevision(comparison);
      if (baseRevision !== input.expected_revision) {
        throw new ActionPlanError('conflict', 'expected_revision');
      }
      const after: SavedDashboardComparison = { ...comparison };
      if (input.fields.name !== undefined) {
        after.name = trimmedName(input.fields.name);
        if (!after.name) {
          throw new ActionPlanError('invalid_request', 'fields.name');
        }
        assertUniqueName(
          deps.getSaved(),
          after.name,
          comparison.id,
          'fields.name'
        );
      }
      const { a: wireA, b: wireB } = input.fields;
      const ids = await withSetupNamesResolved([wireA, wireB], deps.ids);
      const [aResult, bResult] = await Promise.allSettled([
        wireA === undefined ? undefined : sideFromWire(wireA, ids, 'fields.a'),
        wireB === undefined ? undefined : sideFromWire(wireB, ids, 'fields.b'),
      ]);
      after.a = settledValue(aResult) ?? after.a;
      after.b = settledValue(bResult) ?? after.b;
      throwIfAborted(context.signal);
      const changed = changedFields(comparison, after);
      return {
        target: `dashboard_comparison:${comparison.id}`,
        summary: {
          comparison_id: comparison.id,
          base_revision: baseRevision,
          changed_fields: changed,
        },
        affectedNotes: 0,
        display: {
          target: comparison.name,
          changes:
            changed.length === 0
              ? []
              : [
                  t('actions.setup.update', {
                    fields: changed
                      .map((field) =>
                        t(`actions.dashboard-comparison.field.${field}`)
                      )
                      .join(', '),
                  }),
                ],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          const current = await currentAt(comparison.id, baseRevision);
          
          if (input.fields.name !== undefined) {
            try {
              assertUniqueName(
                deps.getSaved(),
                after.name,
                comparison.id,
                'fields.name'
              );
            } catch {
              throw new ActionExecutionError('conflict', false);
            }
          }
          if (changed.length === 0) {
            return new ActionExecution(
              { comparison_id: comparison.id, revision: baseRevision },
              { restoreInput: 'unchanged' }
            );
          }
          await save(
            deps
              .getSaved()
              .map((saved) => (saved.id === comparison.id ? after : saved))
          );
          const revision = await dashboardComparisonRevision(after);
          return new ActionExecution(
            { comparison_id: comparison.id, revision },
            {
              restoreInput:
                context.origin === 'agent'
                  ? await restoringUpdate(current, after, revision, deps)
                  : null,
            }
          );
        },
      };
    },
  };

  const remove: ActionDefinition<'dashboard_comparison.delete'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      const comparison = requireComparison(input.comparison_id);
      
      
      const baseRevision = await dashboardComparisonRevision(comparison);
      throwIfAborted(context.signal);
      return {
        target: `dashboard_comparison:${comparison.id}`,
        summary: { comparison_id: comparison.id, name: comparison.name },
        affectedNotes: 0,
        baseRevision,
        display: {
          target: comparison.name,
          changes: [t('actions.dashboard-comparison.delete')],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          await currentAt(comparison.id, baseRevision);
          await save(
            deps.getSaved().filter((saved) => saved.id !== comparison.id)
          );
          return { comparison_id: comparison.id };
        },
      };
    },
  };

  return {
    'dashboard_comparison.create': create,
    'dashboard_comparison.update': update,
    'dashboard_comparison.delete': remove,
  };
}
