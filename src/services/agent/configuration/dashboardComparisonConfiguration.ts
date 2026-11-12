import type { SavedDashboardComparison } from '../../../components/dashboard/compare/dashboardComparison';
import type { AgentToolContracts } from '../protocol';
import {
  type DashboardFilterIdentities,
  wireSideFromDashboard,
} from '../dashboard/dashboardFilters';
import { configurationRevision } from './configurationPrimitives';

type Configuration = Extract<
  AgentToolContracts['inspect_configuration']['result'],
  { status: 'ok' }
>['configuration'];
type DashboardComparisonsProjection = NonNullable<
  Configuration['dashboard_comparisons']
>;
type WireComparison = DashboardComparisonsProjection['comparisons'][number];

const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const MAX_COMPARISONS = 100;


export function dashboardComparisonRevision(
  comparison: SavedDashboardComparison
): Promise<string> {
  return configurationRevision({
    name: comparison.name,
    a: comparison.a,
    b: comparison.b,
  });
}

async function wireComparison(
  comparison: SavedDashboardComparison,
  ids: DashboardFilterIdentities
): Promise<WireComparison> {
  const [a, b, revision] = await Promise.all([
    wireSideFromDashboard(comparison.a, ids),
    wireSideFromDashboard(comparison.b, ids),
    dashboardComparisonRevision(comparison),
  ]);
  return {
    comparison_id: comparison.id,
    name: comparison.name,
    a,
    b,
    revision,
  };
}


async function withSetupIdsResolved(
  comparisons: readonly SavedDashboardComparison[],
  ids: DashboardFilterIdentities
): Promise<DashboardFilterIdentities> {
  const names = [
    ...new Set(
      comparisons.flatMap((comparison) => [
        ...comparison.a.setups,
        ...comparison.b.setups,
      ])
    ),
  ];
  const resolved =
    names.length > 0
      ? await ids.setupIds(names)
      : new Map<string, string | null>();
  return {
    ...ids,
    setupIds: async (requested) =>
      new Map(requested.map((name) => [name, resolved.get(name) ?? null])),
  };
}


export async function projectDashboardComparisonConfiguration(
  saved: readonly SavedDashboardComparison[],
  ids: DashboardFilterIdentities
): Promise<DashboardComparisonsProjection> {
  const projected = saved
    .filter((comparison) => ID_PATTERN.test(comparison.id))
    .slice(0, MAX_COMPARISONS);
  const resolvedIds = await withSetupIdsResolved(projected, ids);
  const comparisons = await Promise.all(
    projected.map((comparison) => wireComparison(comparison, resolvedIds))
  );
  return { comparisons, omitted_count: saved.length - comparisons.length };
}
