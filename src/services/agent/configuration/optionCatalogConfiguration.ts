import type { AccountCatalogEntry } from '../../accountPage/types';
import type { Setup, SetupStatus } from '../../setup/types';
import { normalizeOptionKey } from '../../../utils/stringNormalization';
import type { AgentToolContracts } from '../protocol';
import {
  compareCodePoints,
  configurationRevision,
  isBoundedString,
  isOpaqueId,
  isRecord,
} from './configurationPrimitives';

const ENTRY_LIMIT = 200;
const MALFORMED_LIMIT = 50;
const TOTAL_LIMIT = 100_000;
const OPTION_NAME_LIMIT = 120;
const EVENT_NOTES_LIMIT = 1_000;
const RESERVED_ACCOUNT_TYPE = 'Archived';
const CUSTOM_SPEC_KEYS = [
  'commissionRules',
  'futuresData',
  'forexData',
  'cfdData',
] as const;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;
const TAG_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

type InspectConfigurationSuccess = Extract<
  AgentToolContracts['inspect_configuration']['result'],
  { status: 'ok' }
>;
type OptionCatalogConfiguration = NonNullable<
  InspectConfigurationSuccess['configuration']['option_catalogs']
>;
type MalformedSummary =
  OptionCatalogConfiguration['tags']['malformed_entries'][number];
type MalformedIssue = MalformedSummary['issues'][number];
type EventColor =
  OptionCatalogConfiguration['events']['entries'][number]['color'];
type SetupSource = Pick<Setup, 'agentEntityId' | 'name' | 'status'>;
type AccountSource = Pick<
  AccountCatalogEntry,
  'name' | 'accountType' | 'currency' | 'archived'
>;

export type AccountTypeAssignmentSource = Pick<
  AccountCatalogEntry,
  'name' | 'accountType'
>;

type OptionCatalogName = keyof OptionCatalogConfiguration;
const EVENT_COLORS = {
  red: true,
  orange: true,
  yellow: true,
  gray: true,
} satisfies Record<EventColor, true>;

export class OptionCatalogProjectionLimitError extends Error {
  constructor(readonly catalog: OptionCatalogName) {
    super('Option catalog exceeds the projection limit.');
    this.name = 'OptionCatalogProjectionLimitError';
  }
}

interface OptionCatalogConfigurationInput {
  rawOptions: unknown;
  rawAccountSettings: unknown;
  setups: readonly SetupSource[];
  accounts: readonly AccountSource[];
}

interface ClassifiedCatalog<Entry> {
  entries: Entry[];
  malformed_entries: MalformedSummary[];
  total_count: number;
  omitted_count: number;
}

function safeIdentity(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  
  
  if (value.includes('/') || value.includes('\\')) return undefined;
  return Array.from(value).slice(0, OPTION_NAME_LIMIT).join('');
}

function malformed(
  issue: MalformedIssue,
  identity?: unknown
): MalformedSummary {
  const safe = safeIdentity(identity);
  return safe === undefined
    ? { issues: [issue] }
    : { identity: safe, issues: [issue] };
}

function isTrimmedBoundedName(value: unknown): value is string {
  return isBoundedString(value, OPTION_NAME_LIMIT) && value === value.trim();
}

function isCustomIdentity(value: unknown): value is string {
  if (!isTrimmedBoundedName(value) || value.includes('/')) return false;
  return (
    !value.startsWith("'") &&
    !value.startsWith('"') &&
    !value.endsWith("'") &&
    !value.endsWith('"')
  );
}

function isCurrency(value: unknown): value is string {
  return typeof value === 'string' && CURRENCY_PATTERN.test(value);
}

function isEventColor(value: unknown): value is EventColor {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(EVENT_COLORS, value) === true
  );
}

function isSetupStatus(value: unknown): value is SetupStatus {
  return value === 'testing' || value === 'active' || value === 'archived';
}

function catalogValues(rawOptions: unknown, key: string): unknown {
  return isRecord(rawOptions) ? rawOptions[key] : undefined;
}

export function tagOptionCatalogRevision(rawOptions: unknown): Promise<string> {
  return configurationRevision({
    values: catalogValues(rawOptions, 'tag'),
    colors: catalogValues(rawOptions, 'tagColors'),
  });
}

export function mistakeOptionCatalogRevision(
  rawOptions: unknown
): Promise<string> {
  return configurationRevision({
    values: catalogValues(rawOptions, 'mistake'),
  });
}

export function accountTypeOptionCatalogRevision(
  rawOptions: unknown,
  rawAccountSettings: unknown,
  accounts?: readonly AccountTypeAssignmentSource[]
): Promise<string> {
  const account = isRecord(rawAccountSettings) ? rawAccountSettings : {};
  return configurationRevision({
    values: catalogValues(rawOptions, 'account_type'),
    order: account.accountTypeOrder,
    excludedAccountTypes: account.excludedAccountTypes,
    includeWithdrawalsFromExcluded: account.includeWithdrawalsFromExcluded,
    defaultAccountType: account.defaultAccountType,
    assignments: projectAccountTypeAssignments(accounts),
  });
}

export function eventOptionCatalogRevision(
  rawOptions: unknown
): Promise<string> {
  return configurationRevision({
    values: catalogValues(rawOptions, 'event'),
  });
}

function classifyArray<Entry extends object>(
  raw: unknown,
  classify: (value: unknown, index: number) => Entry | MalformedSummary,
  compare?: (left: Entry, right: Entry) => number
): ClassifiedCatalog<Entry> {
  if (!Array.isArray(raw)) {
    return {
      entries: [],
      malformed_entries: [malformed('invalid_content')],
      total_count: 1,
      omitted_count: 0,
    };
  }
  const total_count = raw.length;
  const valid: Entry[] = [];
  const invalid: MalformedSummary[] = [];
  for (let index = 0; index < total_count; index += 1) {
    const classified = classify(raw[index], index);
    if ('issues' in classified) invalid.push(classified);
    else valid.push(classified);
  }
  if (compare) valid.sort(compare);
  const entries = valid.slice(0, ENTRY_LIMIT);
  const malformed_entries = invalid.slice(0, MALFORMED_LIMIT);
  return {
    entries,
    malformed_entries,
    total_count,
    omitted_count: total_count - entries.length - malformed_entries.length,
  };
}

function projectIdentityCatalog(
  raw: unknown,
  reservedAccountType: boolean
): ClassifiedCatalog<{ value: string; reserved?: true }> {
  const seen = new Set<string>();
  return classifyArray(raw, (value) => {
    if (!isCustomIdentity(value)) return malformed('invalid_identity', value);
    const key = normalizeOptionKey(value);
    if (seen.has(key)) return malformed('duplicate_identity', value);
    seen.add(key);
    return reservedAccountType &&
      key === normalizeOptionKey(RESERVED_ACCOUNT_TYPE)
      ? { value, reserved: true }
      : { value };
  });
}

function projectTags(
  rawOptions: unknown
): ClassifiedCatalog<{ value: string; color?: string }> {
  const raw = catalogValues(rawOptions, 'tag');
  const colorsValue = catalogValues(rawOptions, 'tagColors');
  const colors = isRecord(colorsValue) ? colorsValue : undefined;
  const colorsByKey = new Map<string, unknown[]>();
  if (colors) {
    for (const [storedKey, storedColor] of Object.entries(colors)) {
      const key = normalizeOptionKey(storedKey);
      const matches = colorsByKey.get(key);
      if (matches) matches.push(storedColor);
      else colorsByKey.set(key, [storedColor]);
    }
  }
  const seen = new Set<string>();
  return classifyArray(raw, (value) => {
    if (!isCustomIdentity(value)) return malformed('invalid_identity', value);
    const key = normalizeOptionKey(value);
    if (seen.has(key)) return malformed('duplicate_identity', value);
    seen.add(key);
    const matchingColors = colorsByKey.get(key) ?? [];
    const color = matchingColors[matchingColors.length - 1];
    if (
      matchingColors.length > 1 ||
      matchingColors.some(
        (candidate) =>
          typeof candidate !== 'string' || !TAG_COLOR_PATTERN.test(candidate)
      )
    ) {
      return malformed('invalid_content', value);
    }
    return typeof color === 'string' ? { value, color } : { value };
  });
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  keys: readonly string[]
): boolean {
  const allowed = new Set(keys);
  return Object.keys(value).every((key) => allowed.has(key));
}

function projectEvents(raw: unknown): ClassifiedCatalog<{
  name: string;
  color: EventColor;
  notes?: string;
}> {
  const seen = new Set<string>();
  return classifyArray(raw, (value) => {
    let name: unknown;
    let color: unknown;
    let notes: unknown;
    if (typeof value === 'string') {
      name = value;
      color = 'gray';
    } else if (isRecord(value)) {
      name = value.name;
      color = value.color;
      notes = value.notes;
      if (!hasOnlyKeys(value, ['name', 'color', 'notes'])) {
        return malformed('invalid_content', name);
      }
    } else {
      return malformed('invalid_content');
    }
    if (!isTrimmedBoundedName(name)) return malformed('invalid_identity', name);
    const key = name.toLowerCase();
    if (seen.has(key)) return malformed('duplicate_identity', name);
    seen.add(key);
    if (!isEventColor(color)) {
      return malformed('invalid_content', name);
    }
    if (
      notes !== undefined &&
      !isBoundedString(notes, EVENT_NOTES_LIMIT, true)
    ) {
      return malformed('invalid_content', name);
    }
    return notes === undefined ? { name, color } : { name, color, notes };
  });
}

function projectInstruments(raw: unknown): ClassifiedCatalog<{
  name: string;
  asset_type: string;
  currency?: string;
  has_custom_spec: boolean;
}> {
  const seen = new Set<string>();
  return classifyArray(raw, (value) => {
    let name: unknown;
    let assetType: unknown;
    let currency: unknown;
    let hasCustomSpec = false;
    if (typeof value === 'string') {
      name = value;
      assetType = 'stock';
    } else if (isRecord(value)) {
      name = value.name;
      assetType = value.assetType;
      currency = value.currency;
      if (
        !hasOnlyKeys(value, [
          'name',
          'assetType',
          'currency',
          ...CUSTOM_SPEC_KEYS,
        ])
      ) {
        return malformed('invalid_content', name);
      }
      hasCustomSpec = CUSTOM_SPEC_KEYS.some((key) => value[key] !== undefined);
    } else {
      return malformed('invalid_content');
    }
    if (!isTrimmedBoundedName(name)) return malformed('invalid_identity', name);
    if (
      !isTrimmedBoundedName(assetType) ||
      (currency !== undefined && !isCurrency(currency))
    ) {
      return malformed('invalid_content', name);
    }
    const key = `${name.toLowerCase()}\u0000${assetType.toLowerCase()}`;
    if (seen.has(key)) return malformed('duplicate_identity', name);
    seen.add(key);
    return currency === undefined
      ? { name, asset_type: assetType, has_custom_spec: hasCustomSpec }
      : {
          name,
          asset_type: assetType,
          currency,
          has_custom_spec: hasCustomSpec,
        };
  });
}

export function isSetupIdentityCandidate(setup: SetupSource): boolean {
  return isTrimmedBoundedName(setup.name) && isSetupStatus(setup.status);
}

function projectSetups(
  setups: readonly SetupSource[]
): ClassifiedCatalog<{ id: string; name: string; status: SetupStatus }> {
  const seenNames = new Set<string>();
  const seenIds = new Set<string>();
  return classifyArray(
    setups,
    (value) => {
      if (!isRecord(value)) return malformed('invalid_content');
      const name = value.name;
      const status = value.status;
      const id = value.agentEntityId;
      if (!isTrimmedBoundedName(name))
        return malformed('invalid_identity', name);
      if (!isSetupStatus(status)) {
        return malformed('invalid_content', name);
      }
      if (!isOpaqueId(id)) return malformed('invalid_identity', name);
      const nameKey = name.toLowerCase();
      if (seenNames.has(nameKey) || seenIds.has(id)) {
        return malformed('duplicate_identity', name);
      }
      seenNames.add(nameKey);
      seenIds.add(id);
      return { id, name, status };
    },
    (left, right) =>
      compareCodePoints(left.name, right.name) ||
      compareCodePoints(left.id, right.id)
  );
}

function projectAccounts(
  accounts: readonly AccountSource[]
): ClassifiedCatalog<{
  name: string;
  account_type?: string;
  currency?: string;
  archived: boolean;
}> {
  const seen = new Set<string>();
  return classifyArray(
    accounts,
    (value) => {
      if (!isRecord(value)) return malformed('invalid_content');
      const name = value.name;
      const accountType = value.accountType;
      const currency = value.currency;
      if (!isTrimmedBoundedName(name))
        return malformed('invalid_identity', name);
      const key = name.toLowerCase();
      if (seen.has(key)) return malformed('duplicate_identity', name);
      seen.add(key);
      if (
        (accountType !== undefined && !isTrimmedBoundedName(accountType)) ||
        typeof value.archived !== 'boolean' ||
        (currency !== undefined && !isCurrency(currency))
      ) {
        return malformed('invalid_content', name);
      }
      return {
        name,
        ...(accountType === undefined ? {} : { account_type: accountType }),
        ...(currency === undefined ? {} : { currency }),
        archived: value.archived,
      };
    },
    (left, right) => compareCodePoints(left.name, right.name)
  );
}

function projectAccountTypeAssignments(
  accounts: readonly AccountTypeAssignmentSource[] | undefined
): readonly { name: string; account_type?: string }[] {
  if (accounts === undefined) return [];
  const unique = new Map<string, { name: string; account_type?: string }>();
  for (let index = 0; index < accounts.length; index += 1) {
    const account = accounts[index];
    if (!isRecord(account) || typeof account.name !== 'string') continue;
    const accountType = account.accountType;
    const projected =
      accountType === undefined
        ? { name: account.name }
        : { name: account.name, account_type: accountType };
    const key = account.name.toLowerCase();
    const existing = unique.get(key);
    if (existing === undefined) {
      unique.set(key, projected);
      continue;
    }
    if (
      compareCodePoints(projected.name, existing.name) < 0 ||
      (projected.name === existing.name &&
        compareCodePoints(
          projected.account_type ?? '',
          existing.account_type ?? ''
        ) < 0)
    ) {
      unique.set(key, projected);
    }
  }
  return Array.from(unique.values()).sort(
    (left, right) =>
      compareCodePoints(left.name, right.name) ||
      compareCodePoints(left.account_type ?? '', right.account_type ?? '')
  );
}

export function assertOptionCatalogProjectionLimits(
  input: OptionCatalogConfigurationInput
): void {
  const catalogs: readonly [OptionCatalogName, unknown][] = [
    ['tags', catalogValues(input.rawOptions, 'tag')],
    ['mistakes', catalogValues(input.rawOptions, 'mistake')],
    ['account_types', catalogValues(input.rawOptions, 'account_type')],
    ['events', catalogValues(input.rawOptions, 'event')],
    ['instruments', catalogValues(input.rawOptions, 'instrument')],
    ['setups', input.setups],
    ['accounts', input.accounts],
  ];
  for (const [catalog, value] of catalogs) {
    if (Array.isArray(value) && value.length > TOTAL_LIMIT) {
      throw new OptionCatalogProjectionLimitError(catalog);
    }
  }
  const tagColors = isRecord(input.rawOptions)
    ? input.rawOptions.tagColors
    : undefined;
  if (isRecord(tagColors) && Object.keys(tagColors).length > TOTAL_LIMIT) {
    throw new OptionCatalogProjectionLimitError('tags');
  }
  const accountTypeOrder = isRecord(input.rawAccountSettings)
    ? input.rawAccountSettings.accountTypeOrder
    : undefined;
  if (
    Array.isArray(accountTypeOrder) &&
    accountTypeOrder.length > TOTAL_LIMIT
  ) {
    throw new OptionCatalogProjectionLimitError('account_types');
  }
}

export async function projectOptionCatalogConfiguration(
  input: OptionCatalogConfigurationInput
): Promise<OptionCatalogConfiguration> {
  assertOptionCatalogProjectionLimits(input);
  const rawAccount = isRecord(input.rawAccountSettings)
    ? input.rawAccountSettings
    : {};
  const tags = projectTags(input.rawOptions);
  const mistakes = projectIdentityCatalog(
    catalogValues(input.rawOptions, 'mistake'),
    false
  );
  const accountTypes = projectIdentityCatalog(
    catalogValues(input.rawOptions, 'account_type'),
    true
  );
  const events = projectEvents(catalogValues(input.rawOptions, 'event'));
  const instruments = projectInstruments(
    catalogValues(input.rawOptions, 'instrument')
  );
  const [tagRevision, mistakeRevision, accountTypeRevision, eventRevision] =
    await Promise.all([
      tagOptionCatalogRevision(input.rawOptions),
      mistakeOptionCatalogRevision(input.rawOptions),
      accountTypeOptionCatalogRevision(
        input.rawOptions,
        rawAccount,
        input.accounts
      ),
      eventOptionCatalogRevision(input.rawOptions),
    ]);
  return {
    tags: { revision: tagRevision, ...tags },
    mistakes: { revision: mistakeRevision, ...mistakes },
    account_types: { revision: accountTypeRevision, ...accountTypes },
    events: { revision: eventRevision, ...events },
    instruments,
    setups: projectSetups(input.setups),
    accounts: projectAccounts(input.accounts),
  };
}
