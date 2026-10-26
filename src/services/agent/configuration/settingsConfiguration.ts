import { ECONOMIC_CALENDAR_CURRENCIES } from '../../economicCalendar/economicCalendarScope';
import { ECONOMIC_CALENDAR_IMPACTS } from '../../../settings/types';
import { getBaseCurrencyOptions } from '../../../utils/currencyConfig';
import type { InspectConfigurationResult } from '../protocol/generated/inspect_configuration.result.generated';
import { configurationRevision } from './configurationPrimitives';
import type {
  SettingsChange,
  SettingsChangeSummary,
} from './configurationChangeTypes';

type InspectSuccess = Extract<InspectConfigurationResult, { status: 'ok' }>;
type SettingsConfigurationProjection = NonNullable<
  InspectSuccess['configuration']['settings']
>;
type SettingsGroupKey = Exclude<
  keyof SettingsConfigurationProjection,
  'revision'
>;
type SettingsKind = SettingsChange['kind'];


export type RawOwnedSettings = Readonly<Record<string, unknown>>;

type Values = Readonly<Record<string, unknown>>;


interface SettingsField {
  readonly field: string;
  readonly path: string;
  readonly defaultValue: unknown;
  
  read(stored: unknown): unknown;
  
  valid(value: unknown): boolean;
  
  normalize?(value: unknown, stored: unknown): unknown;
  
  store?(value: unknown, stored: unknown): unknown;
}

interface SettingsGroup {
  readonly kind: SettingsKind;
  readonly key: SettingsGroupKey;
  readonly noOpMessage: string;
  readonly updatedMessage: string;
  readonly fields: readonly SettingsField[];
}

type SettingsConfigurationErrorCode = 'conflict' | 'invalid_request';

export class SettingsConfigurationError extends Error {
  constructor(readonly code: SettingsConfigurationErrorCode) {
    super('Settings configuration request failed.');
    this.name = 'SettingsConfigurationError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const TIME_OF_DAY = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;

function isTimeOfDay(value: unknown): value is string {
  return typeof value === 'string' && TIME_OF_DAY.test(value);
}

function oneOf(...allowed: readonly string[]) {
  return (stored: unknown): unknown =>
    typeof stored === 'string' && allowed.includes(stored) ? stored : undefined;
}

function boolean(stored: unknown): unknown {
  return typeof stored === 'boolean' ? stored : undefined;
}

function numberIn(minimum: number, maximum: number) {
  return (stored: unknown): unknown =>
    typeof stored === 'number' &&
    Number.isFinite(stored) &&
    stored >= minimum &&
    stored <= maximum
      ? stored
      : undefined;
}

function timeOfDay(stored: unknown): unknown {
  return isTimeOfDay(stored) ? stored : undefined;
}


function field(
  name: string,
  path: string,
  defaultValue: unknown,
  read: (stored: unknown) => unknown
): SettingsField {
  return {
    field: name,
    path,
    defaultValue,
    read,
    valid: (value) => read(value) !== undefined,
  };
}


function canonicalSet(
  name: string,
  path: string,
  canonical: readonly string[],
  defaultValue: readonly string[]
): SettingsField {
  const canonicalSet: ReadonlySet<unknown> = new Set(canonical);
  const order = (values: readonly unknown[]): string[] => {
    const present = new Set(values);
    return canonical.filter((value) => present.has(value));
  };
  return {
    field: name,
    path,
    defaultValue,
    read: (stored) => (Array.isArray(stored) ? order(stored) : undefined),
    valid: (value) =>
      Array.isArray(value) &&
      new Set(value).size === value.length &&
      value.every(
        (item: unknown) => typeof item === 'string' && canonicalSet.has(item)
      ),
    normalize: (value) => order(Array.isArray(value) ? value : []),
  };
}

interface SessionWindow {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
}

const SESSION_WINDOW_KEYS = ['id', 'name', 'start_time', 'end_time'];


function windowOf(
  id: unknown,
  name: unknown,
  start: unknown,
  end: unknown
): SessionWindow | null {
  return typeof id === 'string' &&
    typeof name === 'string' &&
    typeof start === 'string' &&
    typeof end === 'string'
    ? { id, name, start_time: start, end_time: end }
    : null;
}


function schedulable(window: SessionWindow): boolean {
  return (
    window.id.length > 0 &&
    window.id.length <= 100 &&
    Array.from(window.name).length <= 200 &&
    isTimeOfDay(window.start_time) &&
    isTimeOfDay(window.end_time) &&
    window.start_time !== window.end_time
  );
}


function listedSessionWindows(
  stored: readonly unknown[]
): (SessionWindow | null)[] {
  const ids = new Set<string>();
  return stored.map((item) => {
    if (!isRecord(item)) return null;
    const window = windowOf(item.id, item.name, item.startTime, item.endTime);
    if (window === null || !schedulable(window) || ids.has(window.id)) {
      return null;
    }
    ids.add(window.id);
    return window;
  });
}

function readSessionWindows(stored: unknown): unknown {
  if (!Array.isArray(stored)) return undefined;
  return listedSessionWindows(stored).filter((window) => window !== null);
}


function validSessionWindows(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  const ids = new Set<string>();
  return value.every((item) => {
    if (!isRecord(item)) return false;
    const keys = Object.keys(item);
    const window = windowOf(item.id, item.name, item.start_time, item.end_time);
    if (
      keys.length !== SESSION_WINDOW_KEYS.length ||
      window === null ||
      !schedulable(window) ||
      ids.has(window.id)
    ) {
      return false;
    }
    ids.add(window.id);
    return true;
  });
}


function unlistedWindowIds(stored: unknown): Set<string> {
  if (!Array.isArray(stored)) return new Set();
  const listed = listedSessionWindows(stored);
  const listedIds = new Set(listed.map((window) => window?.id));
  const ids = new Set<string>();
  stored.forEach((item, index) => {
    if (listed[index] !== null || !isRecord(item)) return;
    if (typeof item.id === 'string' && !listedIds.has(item.id)) {
      ids.add(item.id);
    }
  });
  return ids;
}


function normalizeSessionWindows(
  value: unknown,
  stored: unknown
): SessionWindow[] {
  if (!Array.isArray(value)) {
    throw new SettingsConfigurationError('invalid_request');
  }
  const unlisted = unlistedWindowIds(stored);
  const given = new Set<string>();
  for (const item of value) {
    if (!isRecord(item))
      throw new SettingsConfigurationError('invalid_request');
    if (item.start_time === item.end_time) {
      throw new SettingsConfigurationError('invalid_request');
    }
    if (typeof item.id === 'string') {
      if (given.has(item.id) || unlisted.has(item.id)) {
        throw new SettingsConfigurationError('invalid_request');
      }
      given.add(item.id);
    }
  }
  const taken = new Set([...given, ...unlisted]);
  let next = 1;
  const freshId = (): string => {
    while (taken.has(`window-${next}`)) next += 1;
    const id = `window-${next}`;
    taken.add(id);
    return id;
  };
  return value.map((item: Record<string, unknown>) => {
    const { name, start_time: start, end_time: end } = item;
    if (typeof name !== 'string' || !isTimeOfDay(start) || !isTimeOfDay(end)) {
      throw new SettingsConfigurationError('invalid_request');
    }
    return {
      id: typeof item.id === 'string' ? item.id : freshId(),
      name,
      start_time: start,
      end_time: end,
    };
  });
}


function storeSessionWindows(value: unknown, stored: unknown): unknown {
  
  if (!Array.isArray(value)) return value;
  const windows = value.map((window: SessionWindow) => ({
    id: window.id,
    name: window.name,
    startTime: window.start_time,
    endTime: window.end_time,
  }));
  if (!Array.isArray(stored)) return windows;
  const listed = listedSessionWindows(stored);
  const merged: unknown[] = [];
  let next = 0;
  stored.forEach((item: unknown, index) => {
    if (listed[index] === null) merged.push(item);
    else if (next < windows.length) merged.push(windows[next++]);
  });
  merged.push(...windows.slice(next));
  return merged;
}

const DATE_FORMATS = ['DDMMYY', 'MMDDYY', 'YYMMDD'] as const;
const WEEK_START_DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

const BASE_CURRENCIES: readonly string[] = getBaseCurrencyOptions().map(
  (option) => option.value
);
const MAX_AMOUNT = 1_000_000_000_000;


const SETTINGS_GROUPS: readonly SettingsGroup[] = [
  {
    kind: 'set_analytics_calculation',
    key: 'analytics_calculation',
    noOpMessage: 'No analytics calculation changes.',
    updatedMessage: 'Updated analytics calculation.',
    fields: [
      field(
        'analytics_date_basis',
        'trade.analyticsDateBasis',
        'entry',
        oneOf('entry', 'exit')
      ),
      field(
        'include_unrealized_pnl',
        'trade.includeUnrealizedPnLInCalculations',
        false,
        boolean
      ),
      field(
        'include_copy_accounts',
        'trade.includeCopyAccountsInAllAccountsAnalytics',
        false,
        boolean
      ),
    ],
  },
  {
    kind: 'set_date_time_display',
    key: 'date_time_display',
    noOpMessage: 'No date and time display changes.',
    updatedMessage: 'Updated date and time display.',
    fields: [
      field(
        'date_format',
        'trade.dateFormat',
        'DDMMYY',
        oneOf(...DATE_FORMATS)
      ),
      field('use_24_hour_time', 'trade.use24HourTime', false, boolean),
      field('show_seconds', 'trade.showSeconds', false, boolean),
      field(
        'week_start_day',
        'trade.weekStartDay',
        'monday',
        oneOf(...WEEK_START_DAYS)
      ),
    ],
  },
  {
    kind: 'set_display_preferences',
    key: 'display_preferences',
    noOpMessage: 'No display preference changes.',
    updatedMessage: 'Updated display preferences.',
    fields: [
      field('currency', 'general.currency', 'USD', oneOf(...BASE_CURRENCIES)),
      field(
        'accent_color_source',
        'general.accentColorSource',
        'journalit',
        oneOf('journalit', 'obsidian')
      ),
      field('privacy_mode', 'display.privacyMode', false, boolean),
    ],
  },
  {
    kind: 'set_trading_day',
    key: 'trading_day',
    noOpMessage: 'No trading day changes.',
    updatedMessage: 'Updated trading day.',
    fields: [
      field(
        'trading_day_cutoff_time',
        'trade.tradingDayCutoffTime',
        '23:59',
        timeOfDay
      ),
      field('skip_weekends', 'trade.skipWeekends', true, boolean),
    ],
  },
  {
    kind: 'set_risk_display',
    key: 'risk_display',
    noOpMessage: 'No risk and display changes.',
    updatedMessage: 'Updated risk and display.',
    fields: [
      field(
        'default_risk_amount',
        'trade.defaultRiskAmount',
        0,
        numberIn(0, MAX_AMOUNT)
      ),
      field('display_r_multiples', 'trade.displayRMultiples', false, boolean),
      field(
        'hide_dollar_amounts_in_shares',
        'display.hideDollarAmountsInShares',
        false,
        boolean
      ),
      field(
        'mae_mfe_input_mode',
        'trade.maeMfeInputMode',
        'dollar',
        oneOf('price', 'dollar')
      ),
      field(
        'mae_mfe_display_unit',
        'trade.maeMfeDisplayUnit',
        'dollar',
        oneOf('dollar', 'ticks')
      ),
    ],
  },
  {
    kind: 'set_break_even',
    key: 'break_even',
    noOpMessage: 'No break-even changes.',
    updatedMessage: 'Updated break-even threshold.',
    fields: [
      field(
        'mode',
        'trade.breakEvenThresholdMode',
        'fixed',
        oneOf('fixed', 'percentage_current_balance')
      ),
      field(
        'range_min',
        'trade.breakEvenRangeMin',
        0,
        numberIn(-MAX_AMOUNT, 0)
      ),
      field('range_max', 'trade.breakEvenRangeMax', 0, numberIn(0, MAX_AMOUNT)),
      field(
        'threshold_percent',
        'trade.breakEvenThresholdPercent',
        0.05,
        numberIn(0, Number.POSITIVE_INFINITY)
      ),
    ],
  },
  {
    kind: 'set_trade_entry',
    key: 'trade_entry',
    noOpMessage: 'No trade entry changes.',
    updatedMessage: 'Updated trade entry preferences.',
    fields: [
      field(
        'auto_open_created_trades',
        'trade.autoOpenCreatedTrades',
        true,
        boolean
      ),
      field(
        'use_dollar_value_input',
        'trade.useDollarValueInput',
        false,
        boolean
      ),
      field(
        'take_profit_unit',
        'trade.tradeFormLayout.takeProfitUnit',
        'percent',
        oneOf('percent', 'size')
      ),
      field(
        'stop_loss_unit',
        'trade.tradeFormLayout.stopLossUnit',
        'percent',
        oneOf('percent', 'size')
      ),
    ],
  },
  {
    kind: 'set_review_automation',
    key: 'review_automation',
    noOpMessage: 'No review automation changes.',
    updatedMessage: 'Updated review automation.',
    fields: [
      field('global_auto_create', 'reviews.globalAutoCreate', true, boolean),
      field(
        'auto_create_day_on_navigation',
        'drc.autoCreateDRCOnNavigation',
        true,
        boolean
      ),
      field(
        'auto_create_week_on_navigation',
        'weekly.autoCreateWeeklyReviewOnNavigation',
        true,
        boolean
      ),
      field(
        'auto_create_month_on_navigation',
        'monthly.autoCreateMonthlyReviewOnNavigation',
        true,
        boolean
      ),
      field(
        'auto_create_quarter_on_navigation',
        'quarterly.autoCreateQuarterlyReviewOnNavigation',
        true,
        boolean
      ),
      field(
        'auto_create_year_on_navigation',
        'yearly.autoCreateYearlyReviewOnNavigation',
        true,
        boolean
      ),
      field(
        'open_note_links_in_new_tab',
        'reviewV2.openNoteLinksInNewTab',
        true,
        boolean
      ),
    ],
  },
  {
    kind: 'set_economic_calendar',
    key: 'economic_calendar',
    noOpMessage: 'No economic calendar changes.',
    updatedMessage: 'Updated economic calendar import.',
    fields: [
      field('auto_import', 'economicCalendar.autoImport', false, boolean),
      canonicalSet(
        'currencies',
        'economicCalendar.defaultCurrencies',
        ECONOMIC_CALENDAR_CURRENCIES,
        []
      ),
      canonicalSet(
        'impacts',
        'economicCalendar.impacts',
        ECONOMIC_CALENDAR_IMPACTS,
        ['low', 'medium', 'high']
      ),
      field(
        'include_holidays',
        'economicCalendar.includeHolidays',
        true,
        boolean
      ),
    ],
  },
  {
    kind: 'set_session_schedule',
    key: 'session_schedule',
    noOpMessage: 'No session schedule changes.',
    updatedMessage: 'Updated session schedule.',
    fields: [
      {
        field: 'session_windows',
        path: 'sessionMode.sessionWindows',
        defaultValue: [],
        read: readSessionWindows,
        valid: validSessionWindows,
        normalize: normalizeSessionWindows,
        store: storeSessionWindows,
      },
      field(
        'preparation_lead_time_minutes',
        'sessionMode.preparationLeadTimeMinutes',
        30,
        numberIn(0, Number.POSITIVE_INFINITY)
      ),
      field(
        'show_trade_executions_in_session_log',
        'sessionMode.showTradeExecutionsInSessionLog',
        true,
        boolean
      ),
    ],
  },
];

const GROUP_BY_KIND = new Map<SettingsKind, SettingsGroup>(
  SETTINGS_GROUPS.map((group) => [group.kind, group])
);

function groupOf(kind: SettingsKind): SettingsGroup {
  const group = GROUP_BY_KIND.get(kind);
  if (!group) throw new SettingsConfigurationError('invalid_request');
  return group;
}


export const SETTINGS_OWNED_PATHS: readonly string[] = SETTINGS_GROUPS.flatMap(
  (group) => group.fields.map((descriptor) => descriptor.path)
);


export function settingsFieldPaths(
  kind: SettingsKind
): ReadonlyMap<string, string> {
  return new Map(
    groupOf(kind).fields.map((descriptor) => [
      descriptor.field,
      descriptor.path,
    ])
  );
}

function effectiveValue(raw: RawOwnedSettings, descriptor: SettingsField) {
  const value = descriptor.read(raw[descriptor.path]);
  return value === undefined ? structuredClone(descriptor.defaultValue) : value;
}

function effectiveGroup(
  raw: RawOwnedSettings,
  group: SettingsGroup
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const descriptor of group.fields) {
    values[descriptor.field] = effectiveValue(raw, descriptor);
  }
  return values;
}

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function groupsEqual(left: Values, right: Values, group: SettingsGroup) {
  return group.fields.every((descriptor) =>
    sameValue(left[descriptor.field], right[descriptor.field])
  );
}

function groupRevision(values: Values, group: SettingsGroup): Promise<string> {
  return configurationRevision({ group: group.key, values });
}

export function copyOwnedSettings(raw: RawOwnedSettings): RawOwnedSettings {
  const next: Record<string, unknown> = {};
  for (const path of SETTINGS_OWNED_PATHS) {
    if (Object.prototype.hasOwnProperty.call(raw, path)) next[path] = raw[path];
  }
  return next;
}


export function selectChangedSettings(
  next: RawOwnedSettings,
  kind: SettingsKind,
  changedFields: readonly string[]
): RawOwnedSettings {
  const selected: Record<string, unknown> = {};
  const changed = new Set(changedFields);
  for (const descriptor of groupOf(kind).fields) {
    if (changed.has(descriptor.field)) {
      selected[descriptor.path] = next[descriptor.path];
    }
  }
  return selected;
}


export function effectiveSettingsGroup(
  raw: RawOwnedSettings,
  kind: SettingsKind
): Record<string, unknown> {
  return effectiveGroup(raw, groupOf(kind));
}

export function settingsGroupsEqual(
  left: Values,
  right: Values,
  kind: SettingsKind
): boolean {
  return groupsEqual(left, right, groupOf(kind));
}


export function settingsGroupRevision(
  raw: RawOwnedSettings,
  kind: SettingsKind
): Promise<string> {
  const group = groupOf(kind);
  return groupRevision(effectiveGroup(raw, group), group);
}

interface AppliedValues {
  next: RawOwnedSettings;
  changedFields: string[];
  
  previous: Values;
}

function applyValues(
  raw: RawOwnedSettings,
  group: SettingsGroup,
  values: object
): AppliedValues {
  const current = effectiveGroup(raw, group);
  const next: Record<string, unknown> = { ...copyOwnedSettings(raw) };
  const changedFields: string[] = [];
  const previous: Record<string, unknown> = {};
  for (const descriptor of group.fields) {
    if (!Object.prototype.hasOwnProperty.call(values, descriptor.field)) {
      continue;
    }
    const given: unknown = Reflect.get(values, descriptor.field);
    if (given === undefined) continue;
    const stored = raw[descriptor.path];
    const value = descriptor.normalize
      ? descriptor.normalize(given, stored)
      : given;
    if (sameValue(value, current[descriptor.field])) continue;
    next[descriptor.path] = descriptor.store
      ? descriptor.store(value, stored)
      : value;
    changedFields.push(descriptor.field);
    previous[descriptor.field] = current[descriptor.field];
  }
  return { next, changedFields, previous };
}


function restoresExactly(
  raw: RawOwnedSettings,
  group: SettingsGroup,
  applied: AppliedValues
): boolean {
  const restored = applyValues(applied.next, group, applied.previous).next;
  const changed = new Set(applied.changedFields);
  return group.fields.every((descriptor) => {
    if (!descriptor.store || !changed.has(descriptor.field)) return true;
    const before = Object.prototype.hasOwnProperty.call(raw, descriptor.path)
      ? raw[descriptor.path]
      : descriptor.store(descriptor.defaultValue, undefined);
    return sameValue(restored[descriptor.path], before);
  });
}

interface AppliedSettingsChange {
  next: RawOwnedSettings;
  summary: SettingsChangeSummary;
  
  previous: Values;
  
  restorable: boolean;
}

export function applySettingsChange(
  raw: RawOwnedSettings,
  change: SettingsChange
): AppliedSettingsChange {
  const group = groupOf(change.kind);
  const applied = applyValues(raw, group, change.values);
  const { changedFields } = applied;
  return {
    next: applied.next,
    previous: applied.previous,
    restorable: restoresExactly(raw, group, applied),
    
    summary: {
      action: group.kind,
      changed_fields: changedFields,
      message:
        changedFields.length === 0 ? group.noOpMessage : group.updatedMessage,
    } as SettingsChangeSummary,
  };
}


export const SETTINGS_KINDS: readonly SettingsKind[] = SETTINGS_GROUPS.map(
  (group) => group.kind
);


export function isValidSettingsValue(
  kind: SettingsKind,
  fieldName: string,
  value: unknown
): boolean {
  const descriptor = groupOf(kind).fields.find(
    (candidate) => candidate.field === fieldName
  );
  return descriptor !== undefined && descriptor.valid(value);
}

export async function projectSettingsConfiguration(
  raw: RawOwnedSettings
): Promise<SettingsConfigurationProjection> {
  const effective: Record<string, Values> = {};
  const projection: Record<string, unknown> = {};
  
  const revisions = await Promise.all(
    SETTINGS_GROUPS.map((group) => {
      const values = effectiveGroup(raw, group);
      effective[group.key] = values;
      return groupRevision(values, group);
    })
  );
  SETTINGS_GROUPS.forEach((group, index) => {
    projection[group.key] = {
      revision: revisions[index],
      ...effective[group.key],
    };
  });
  
  
  return {
    revision: await configurationRevision(effective),
    ...projection,
  } as SettingsConfigurationProjection;
}
