

import type { FilterState } from '../../../components/dashboard/dashboardTypes';
import type { DashboardComparisonFilters } from '../../../components/dashboard/compare/dashboardComparison';
import { toComparisonFilters } from '../../../components/dashboard/compare/dashboardComparison';
import {
  createDashboardFilters,
  normalizeDashboardFilters,
} from '../../../settings/viewFiltersDefaults';
import {
  CustomFieldType,
  type CustomFieldDefinition,
} from '../../../types/customFields';
import type { ImageAnnotationStatusFilter } from '../../tradelog/types';
import type {
  DashboardComparisonFilters as WireComparisonFilters,
  DashboardFilters as WireDashboardFilters,
} from '../protocol/generated/navigate_journalit.request.generated';
import type { AgentToolContracts } from '../protocol';

type Configuration = Extract<
  AgentToolContracts['inspect_configuration']['result'],
  { status: 'ok' }
>['configuration'];
type WireComparison = NonNullable<
  Configuration['dashboard_comparisons']
>['comparisons'][number];
export type WireComparisonSide = WireComparison['a'];
type Criterion = NonNullable<
  WireComparisonSide['unrepresented_criteria']
>[number];
type WireDashboardStatus = NonNullable<WireComparisonFilters['status']>[number];
type WireImageStatus = NonNullable<
  WireComparisonFilters['image_annotation_status']
>[number];

export type { WireComparisonFilters, WireDashboardFilters };


export class DashboardFilterError extends Error {
  constructor(
    public readonly code: 'not_found' | 'unsupported_capability',
    
    public readonly field: string
  ) {
    super('Agent filters cannot be applied to the Dashboard.');
    this.name = 'DashboardFilterError';
  }
}


export interface WireFilterResolver {
  
  accountName(accountId: string): Promise<string | null>;
  
  setupNames(
    setupIds: readonly string[]
  ): Promise<ReadonlyMap<string, string | null>>;
  customField(fieldId: string): CustomFieldDefinition | undefined;
}


export interface DashboardFilterIdentities {
  
  accountId(name: string): Promise<string | null>;
  
  setupIds(
    names: readonly string[]
  ): Promise<ReadonlyMap<string, string | null>>;
  customField(fieldId: string): CustomFieldDefinition | undefined;
}

const CRITERIA_ORDER: readonly Criterion[] = [
  'excluded_values',
  'match_modes',
  'account_phases',
  'missing_values',
  'custom_field_alternatives',
  'unresolved_values',
  'unsupported_values',
];


const DASHBOARD_STATUSES: ReadonlySet<string> = new Set<WireDashboardStatus>([
  'open',
  'win',
  'loss',
  'breakeven',
  'cancelled',
]);

const isDashboardStatus = (status: string): status is WireDashboardStatus =>
  DASHBOARD_STATUSES.has(status);


const MAX_WIRE_VALUES = 100;
const MAX_WIRE_VALUE_LENGTH = 100;
const MAX_CUSTOM_FIELD_CLAUSES = 50;
const MAX_CUSTOM_FIELD_VALUE_LENGTH = 500;

const NO_SETUP = '__NO_SETUP__';
const NO_TAGS = '__NO_TAGS__';
const NO_MISTAKES = '__NO_MISTAKES__';

const IMAGE_STATUS_FROM_WIRE: Record<
  WireImageStatus,
  ImageAnnotationStatusFilter
> = {
  tagged: 'tagged',
  untagged: 'untagged',
  has_notes: 'hasNotes',
  no_notes: 'noNotes',
};
const IMAGE_STATUS_TO_WIRE: Record<
  ImageAnnotationStatusFilter,
  WireImageStatus
> = {
  tagged: 'tagged',
  untagged: 'untagged',
  hasNotes: 'has_notes',
  noNotes: 'no_notes',
};


function isDashboardCustomField(field: CustomFieldDefinition): boolean {
  return (
    field.type === CustomFieldType.DROPDOWN ||
    field.type === CustomFieldType.MULTISELECT
  );
}

function parseDate(value: string | undefined): Date | null {
  return value === undefined ? null : new Date(value);
}


export async function dashboardSideFromWire(
  wire: WireComparisonFilters,
  ids: WireFilterResolver
): Promise<DashboardComparisonFilters> {
  const filters = createDashboardFilters();
  const setupIds = wire.setup_ids ?? [];
  const [accountNames, setupNames] = await Promise.all([
    Promise.all((wire.account_ids ?? []).map((id) => ids.accountName(id))),
    setupIds.length > 0
      ? ids.setupNames(setupIds)
      : new Map<string, string | null>(),
  ]);
  const accounts: string[] = [];
  for (const name of accountNames) {
    if (name === null)
      throw new DashboardFilterError('not_found', 'account_ids');
    accounts.push(name);
  }
  const setups: string[] = [];
  for (const id of setupIds) {
    const name = setupNames.get(id) ?? null;
    if (name === null) throw new DashboardFilterError('not_found', 'setup_ids');
    setups.push(name);
  }
  const customFieldFilters: Record<string, string[]> = {};
  for (const clause of wire.custom_fields ?? []) {
    const field = ids.customField(clause.field_id);
    if (field === undefined) {
      throw new DashboardFilterError('not_found', 'custom_fields');
    }
    const value = typeof clause.value === 'string' ? clause.value.trim() : '';
    
    
    const supported =
      isDashboardCustomField(field) &&
      clause.operator === 'equals' &&
      value !== '' &&
      customFieldFilters[field.id] === undefined;
    if (!supported) {
      throw new DashboardFilterError('unsupported_capability', 'custom_fields');
    }
    customFieldFilters[field.id] = [value];
  }
  return toComparisonFilters(
    normalizeDashboardFilters({
      ...filters,
      accounts,
      setups,
      tickers: [...(wire.tickers ?? [])],
      tags: [...(wire.tags ?? [])],
      mistakes: [...(wire.mistakes ?? [])],
      directions: [...(wire.directions ?? [])],
      statuses: [...(wire.status ?? [])],
      tradeTypes: wire.trade_types ? [...wire.trade_types] : filters.tradeTypes,
      reviewStatus: [...(wire.review_status ?? [])],
      ratings: [...(wire.ratings ?? [])],
      marketBias: [...(wire.market_bias ?? [])],
      customFieldFilters,
      imageAnnotationStatus: (wire.image_annotation_status ?? []).map(
        (status) => IMAGE_STATUS_FROM_WIRE[status]
      ),
      imageTags: [...(wire.image_tags ?? [])],
    })
  );
}


export async function dashboardFiltersFromWire(
  wire: WireDashboardFilters,
  ids: WireFilterResolver
): Promise<FilterState> {
  const { date, ...side } = wire;
  return normalizeDashboardFilters({
    ...(await dashboardSideFromWire(side, ids)),
    dateRange: [parseDate(date?.from), parseDate(date?.to)],
  });
}

function nonEmpty<T>(values: readonly T[]): T[] | undefined {
  return values.length > 0 ? [...new Set(values)] : undefined;
}


export async function withSetupNamesResolved(
  sides: ReadonlyArray<WireComparisonFilters | undefined>,
  ids: WireFilterResolver
): Promise<WireFilterResolver> {
  const setupIds = [...new Set(sides.flatMap((side) => side?.setup_ids ?? []))];
  const resolved =
    setupIds.length > 0
      ? await ids.setupNames(setupIds)
      : new Map<string, string | null>();
  return {
    ...ids,
    setupNames: async (requested) =>
      new Map(requested.map((id) => [id, resolved.get(id) ?? null])),
  };
}


const fitsWire = (values: readonly string[], maxLength: number): boolean =>
  values.length <= MAX_WIRE_VALUES &&
  values.every((value) => value.length > 0 && value.length <= maxLength);


export async function wireSideFromDashboard(
  side: DashboardComparisonFilters,
  ids: DashboardFilterIdentities
): Promise<WireComparisonSide> {
  const unrepresented = new Set<Criterion>();

  if (side.setups.includes(NO_SETUP)) unrepresented.add('missing_values');
  const setupNames = side.setups.filter((name) => name !== NO_SETUP);
  const [accountIdsByPosition, setupIdsByName] = await Promise.all([
    Promise.all(side.accounts.map((name) => ids.accountId(name))),
    setupNames.length > 0
      ? ids.setupIds(setupNames)
      : new Map<string, string | null>(),
  ]);

  const accountIds: string[] = [];
  for (const id of accountIdsByPosition) {
    if (id === null) unrepresented.add('unresolved_values');
    else accountIds.push(id);
  }
  const setupIds: string[] = [];
  for (const name of setupNames) {
    const id = setupIdsByName.get(name) ?? null;
    if (id === null) unrepresented.add('unresolved_values');
    else setupIds.push(id);
  }

  if (side.tags.includes(NO_TAGS) || side.mistakes.includes(NO_MISTAKES)) {
    unrepresented.add('missing_values');
  }
  const tags = side.tags.filter((tag) => tag !== NO_TAGS);
  const mistakes = side.mistakes.filter((mistake) => mistake !== NO_MISTAKES);

  const { exclusions, matchModes } = side;
  if (
    exclusions.tickers.length > 0 ||
    exclusions.setups.length > 0 ||
    exclusions.tags.length > 0 ||
    exclusions.mistakes.length > 0 ||
    Object.values(exclusions.customFieldFilters).some(
      (values) => values.length > 0
    )
  ) {
    unrepresented.add('excluded_values');
  }
  
  if (
    (matchModes.setups !== 'any' && side.setups.length > 0) ||
    (matchModes.tags !== 'any' && side.tags.length > 0) ||
    (matchModes.mistakes !== 'any' && side.mistakes.length > 0) ||
    Object.entries(matchModes.customFieldFilters).some(
      ([fieldId, mode]) =>
        mode !== 'any' && (side.customFieldFilters[fieldId]?.length ?? 0) > 0
    )
  ) {
    unrepresented.add('match_modes');
  }
  if (side.accountPhases.length > 0) unrepresented.add('account_phases');

  const customFields: NonNullable<WireComparisonFilters['custom_fields']> = [];
  for (const [fieldId, values] of Object.entries(side.customFieldFilters)) {
    if (values.length === 0) continue;
    const field = ids.customField(fieldId);
    if (!field || !isDashboardCustomField(field)) {
      unrepresented.add('unresolved_values');
      continue;
    }
    if (values.length > 1) {
      unrepresented.add('custom_field_alternatives');
      continue;
    }
    if (
      !fitsWire(values, MAX_CUSTOM_FIELD_VALUE_LENGTH) ||
      customFields.length === MAX_CUSTOM_FIELD_CLAUSES
    ) {
      unrepresented.add('unsupported_values');
      continue;
    }
    customFields.push({
      field_id: field.id,
      operator: 'equals',
      value: values[0],
    });
  }

  const filters: WireComparisonFilters = {};
  const set = <K extends keyof WireComparisonFilters>(
    key: K,
    value: WireComparisonFilters[K] | undefined
  ) => {
    if (value !== undefined) filters[key] = value;
  };
  
  
  const setValues = (
    key:
      | 'account_ids'
      | 'setup_ids'
      | 'tickers'
      | 'tags'
      | 'mistakes'
      | 'image_tags',
    values: readonly string[]
  ) => {
    const distinct = nonEmpty(values);
    if (distinct === undefined) return;
    const maxLength =
      key === 'account_ids' || key === 'setup_ids'
        ? Number.POSITIVE_INFINITY
        : MAX_WIRE_VALUE_LENGTH;
    if (fitsWire(distinct, maxLength)) filters[key] = distinct;
    else unrepresented.add('unsupported_values');
  };
  setValues('account_ids', accountIds);
  setValues('setup_ids', setupIds);
  setValues('tickers', side.tickers);
  setValues('tags', tags);
  setValues('mistakes', mistakes);
  set('directions', nonEmpty(side.directions));
  const statuses = side.statuses.filter((status) => status !== 'all');
  const dashboardStatuses = statuses.filter(isDashboardStatus);
  if (dashboardStatuses.length < statuses.length) {
    unrepresented.add('unsupported_values');
  }
  set('status', nonEmpty(dashboardStatuses));
  
  
  set(
    'trade_types',
    nonEmpty(side.tradeTypes.filter((type) => type !== 'all'))
  );
  set('review_status', nonEmpty(side.reviewStatus));
  set('ratings', nonEmpty(side.ratings));
  set('market_bias', nonEmpty(side.marketBias));
  set(
    'image_annotation_status',
    nonEmpty(
      (side.imageAnnotationStatus ?? []).map(
        (status) => IMAGE_STATUS_TO_WIRE[status]
      )
    )
  );
  setValues('image_tags', side.imageTags ?? []);
  if (customFields.length > 0) filters.custom_fields = customFields;

  const criteria = CRITERIA_ORDER.filter((criterion) =>
    unrepresented.has(criterion)
  );
  return criteria.length > 0
    ? { filters, unrepresented_criteria: criteria }
    : { filters };
}
