

import { t, type TranslationKey } from '../../../../lang/helpers';
import type { ObsidianIconComponent } from '../../icons/ObsidianIcon';
import { FILTER_MENU_ICONS } from './filterMenuIcons';
import type {
  AccountPhaseScope,
  AvailableCustomFieldFilter,
  UnifiedFilters,
} from '../types';
import {
  type AccountPhaseOptionGroup,
  offersPhaseList,
} from '../accountPhaseScope';
import { normalizeAccountLookupKey } from '../../../../services/trade/core/TradeAccountIdentity';
import type {
  DirectionFilter,
  ImageAnnotationStatusFilter,
  ReviewStatusFilter,
  TradeStatus,
  TradeType,
} from '../../../../services/tradelog/types';
import {
  CustomFieldType,
  type DropdownOption,
} from '../../../../types/customFields';
import {
  FILTER_MATCH_MODES,
  type FilterMatchMode,
  type MatchModeListKey,
  getCustomFieldMatchMode,
} from '../filterMatchModes';
import { formatDateDisplay } from '../../../../utils/dateUtils';
import {
  type ExcludableFilterField,
  type MatchModeField,
  clearFieldValues,
  setFieldMatchMode,
  getExcludedValues,
  getIncludedValues,
  toggleFieldValue,
} from './filterMenuUpdates';
import {
  type FilterMenuEntry,
  type FilterMenuNode,
  type FilterMenuOption,
  type FilterMenuValuesNode,
  bindEntries,
} from './menuModel';

export type FilterMenuContext = 'dashboard' | 'tradelog' | 'review';

type ValuesDraft = FilterMenuValuesNode<UnifiedFilters>;
type NodeDraft = FilterMenuNode<UnifiedFilters>;
type EntryDraft = FilterMenuEntry<UnifiedFilters>;

export interface FilterMenuSources {
  context: FilterMenuContext;
  accounts: string[];
  accountPhaseGroups: AccountPhaseOptionGroup[];
  tickers: string[];
  setups: string[];
  tags: string[];
  mistakes: string[];
  
  sessionLogTags: FilterMenuOption[] | null;
  customFields: AvailableCustomFieldFilter[];
  
  optionsLoading: boolean;
  
  imageTags: DropdownOption[] | null;
  
  resolveTradeTypes: (tradeTypes: TradeType[]) => TradeType[];
  normalizeTradeTypes: (tradeTypes: TradeType[]) => TradeType[];
  availableTradeTypes: TradeType[];
  
  countActiveTradeTypes: (tradeTypes: TradeType[]) => number;
  dateFormat: string;
}

function uniqueOptions(
  values: readonly string[],
  selected: readonly string[],
  labelFor: (value: string) => string = (value) => value
): FilterMenuOption[] {
  const seen = new Set<string>();
  const options: FilterMenuOption[] = [];
  for (const value of [...values, ...selected]) {
    if (seen.has(value)) continue;
    seen.add(value);
    options.push({ value, label: labelFor(value) });
  }
  return options;
}

function dropdownOptionValues(options: readonly DropdownOption[]): {
  values: string[];
  labelFor: (value: string) => string;
} {
  const labels = new Map<string, string>();
  for (const option of options) labels.set(option.value, option.label);
  return {
    values: [...labels.keys()],
    labelFor: (value) => labels.get(value) ?? value,
  };
}

function excludableNode(
  filters: UnifiedFilters,
  field: ExcludableFilterField,
  base: {
    id: string;
    label: string;
    icon?: ObsidianIconComponent;
    options: FilterMenuOption[];
    emptyLabel?: string;
  },
  match: { field: MatchModeField; mode: FilterMatchMode } | null,
  noValueOption?: string
): ValuesDraft {
  return {
    kind: 'values',
    ...base,
    included: new Set(getIncludedValues(filters, field)),
    excluded: new Set(getExcludedValues(filters, field)),
    matchMode: match ? match.mode : null,
    matchChild: match
      ? matchModeNode(filters, base.id, match, noValueOption)
      : undefined,
    noValueOption,
    onToggle: (value, mode) => toggleFieldValue(filters, field, value, mode),
    onClear: () => clearFieldValues(filters, field),
  };
}

const MATCH_MODE_LABEL_KEYS: Record<FilterMatchMode, TranslationKey> = {
  any: 'filter.menu.match.any',
  all: 'filter.menu.match.all',
  only: 'filter.menu.match.only',
  exact: 'filter.menu.match.exact',
};

const MATCH_MODE_HINT_KEYS: Record<FilterMatchMode, TranslationKey> = {
  any: 'filter.menu.match.hint.any',
  all: 'filter.menu.match.hint.all',
  only: 'filter.menu.match.hint.only',
  exact: 'filter.menu.match.hint.exact',
};

export function matchModeLabel(mode: FilterMatchMode): string {
  return t(MATCH_MODE_LABEL_KEYS[mode]);
}

function matchModeHint(mode: FilterMatchMode): string {
  return t(MATCH_MODE_HINT_KEYS[mode]);
}


function matchModeNode(
  filters: UnifiedFilters,
  parentId: string,
  match: { field: MatchModeField; mode: FilterMatchMode },
  noValueOption: string | undefined
): ValuesDraft {
  const pick = (mode: FilterMatchMode) =>
    setFieldMatchMode(filters, match.field, mode, noValueOption);
  return {
    kind: 'values',
    id: `${parentId}/match`,
    label: t('filter.menu.match.label'),
    options: FILTER_MATCH_MODES.map((mode) => ({
      value: mode,
      label: matchModeLabel(mode),
      description: matchModeHint(mode),
    })),
    included: new Set<string>([match.mode]),
    excluded: null,
    matchMode: null,
    singleChoice: true,
    onToggle: (value) => {
      const mode = FILTER_MATCH_MODES.find((candidate) => candidate === value);
      return mode ? pick(mode) : filters;
    },
    onClear: () => pick('any'),
  };
}

function listMatch(
  filters: UnifiedFilters,
  key: MatchModeListKey
): { field: MatchModeField; mode: FilterMatchMode } {
  return { field: { kind: 'list', key }, mode: filters.matchModes[key] };
}

function includeOnlyNode<T extends string>(
  filters: UnifiedFilters,
  base: {
    id: string;
    label: string;
    icon?: ObsidianIconComponent;
    options: Array<{ value: T; label: string }>;
    emptyLabel?: string;
  },
  selected: readonly T[],
  apply: (next: T[]) => UnifiedFilters
): ValuesDraft {
  const optionValues = new Map(
    base.options.map((option): [string, T] => [option.value, option.value])
  );
  return {
    kind: 'values',
    ...base,
    included: new Set<string>(selected),
    excluded: null,
    matchMode: null,
    onToggle: (value) => {
      const typed = optionValues.get(value);
      if (typed === undefined) return filters;
      return apply(
        selected.includes(typed)
          ? selected.filter((current) => current !== typed)
          : [...selected, typed]
      );
    },
    onClear: () => apply([]),
  };
}

function sameAccount(a: string, b: string): boolean {
  return normalizeAccountLookupKey(a) === normalizeAccountLookupKey(b);
}

function buildAccountsNode(
  filters: UnifiedFilters,
  sources: FilterMenuSources
): ValuesDraft {
  const accounts = uniqueOptions(sources.accounts, filters.accounts);
  
  
  for (const scope of filters.accountPhases) {
    if (!accounts.some((option) => sameAccount(option.value, scope.account))) {
      accounts.push({ value: scope.account, label: scope.account });
    }
  }
  const optionChildren = new Map<string, NodeDraft>();
  const partialAccounts = new Set<string>();

  for (const group of sources.accountPhaseGroups) {
    if (!offersPhaseList(group)) continue;
    const account = accounts.find((option) =>
      sameAccount(option.value, group.account)
    );
    if (!account) continue;

    const selectedPhaseIds: string[] = [];
    for (const scope of filters.accountPhases) {
      if (sameAccount(scope.account, group.account)) {
        selectedPhaseIds.push(scope.phaseId);
      }
    }
    
    
    
    
    const wholeAccountSelected = filters.accounts.some((selected) =>
      sameAccount(selected, group.account)
    );
    const allPhaseIds = group.phases.map((phase) => phase.id);
    const shownPhaseIds = wholeAccountSelected ? allPhaseIds : selectedPhaseIds;
    if (!wholeAccountSelected && selectedPhaseIds.length > 0) {
      partialAccounts.add(account.value);
    }
    const withoutThisAccount = () => ({
      accounts: filters.accounts.filter(
        (selected) => !sameAccount(selected, group.account)
      ),
      accountPhases: filters.accountPhases.filter(
        (scope) => !sameAccount(scope.account, group.account)
      ),
    });

    optionChildren.set(account.value, {
      kind: 'values',
      id: `accounts/${account.value}`,
      label: account.label,
      options: group.phases.map((phase) => ({
        value: phase.id,
        label: phase.name,
        description: `${formatDateDisplay(phase.startedAt, sources.dateFormat)} – ${
          phase.completedAt
            ? formatDateDisplay(phase.completedAt, sources.dateFormat)
            : t('dashboard.filter.accounts.phase-now')
        }`,
      })),
      included: new Set(shownPhaseIds),
      
      appliedCount: wholeAccountSelected ? 0 : selectedPhaseIds.length,
      excluded: null,
      matchMode: null,
      onToggle: (phaseId) => {
        
        const nextPhaseIds = shownPhaseIds.includes(phaseId)
          ? shownPhaseIds.filter((id) => id !== phaseId)
          : [...shownPhaseIds, phaseId];
        const rest = withoutThisAccount();
        const nextPhaseIdSet = new Set(nextPhaseIds);
        const accountPhases: AccountPhaseScope[] = [...rest.accountPhases];
        
        for (const id of allPhaseIds) {
          if (nextPhaseIdSet.has(id)) {
            accountPhases.push({ account: group.account, phaseId: id });
          }
        }
        return { ...filters, accounts: rest.accounts, accountPhases };
      },
      onClear: () => ({ ...filters, ...withoutThisAccount() }),
    });
  }

  return {
    kind: 'values',
    id: 'accounts',
    label: t('filter.menu.accounts'),
    icon: FILTER_MENU_ICONS.accounts,
    options: accounts,
    included: new Set(filters.accounts),
    partial: partialAccounts,
    excluded: null,
    matchMode: null,
    optionChildren,
    emptyLabel: sources.optionsLoading
      ? t('common.loading')
      : t('dashboard.filter.accounts.none-found'),
    onToggle: (account) => {
      if (filters.accounts.includes(account)) {
        return {
          ...filters,
          accounts: filters.accounts.filter((current) => current !== account),
        };
      }
      
      return {
        ...filters,
        accounts: [...filters.accounts, account],
        accountPhases: filters.accountPhases.filter(
          (scope) => !sameAccount(scope.account, account)
        ),
      };
    },
    onClear: () => ({ ...filters, accounts: [], accountPhases: [] }),
  };
}

const TRADE_TYPE_OPTIONS: Array<{
  value: TradeType;
  labelKey: TranslationKey;
}> = [
  { value: 'regular', labelKey: 'tradelog.type.regular' },
  { value: 'missed', labelKey: 'tradelog.type.missed' },
  { value: 'backtest', labelKey: 'tradelog.type.backtest' },
];

const STATUS_OPTIONS: Array<{ value: TradeStatus; labelKey: TranslationKey }> =
  [
    { value: 'open', labelKey: 'tradelog.filter.open' },
    { value: 'win', labelKey: 'tradelog.filter.winners' },
    { value: 'loss', labelKey: 'tradelog.filter.losers' },
    { value: 'breakeven', labelKey: 'tradelog.filter.breakeven' },
    { value: 'cancelled', labelKey: 'filter.menu.status.cancelled' },
  ];

const DIRECTION_OPTIONS: Array<{
  value: DirectionFilter;
  labelKey: TranslationKey;
}> = [
  { value: 'long', labelKey: 'filter.modal.direction.long-call' },
  { value: 'short', labelKey: 'filter.modal.direction.short-put' },
];

const REVIEW_STATUS_OPTIONS: Array<{
  value: ReviewStatusFilter;
  labelKey: TranslationKey;
}> = [
  { value: 'reviewed', labelKey: 'filter.modal.review-status.reviewed' },
  { value: 'unreviewed', labelKey: 'filter.modal.review-status.unreviewed' },
];

const IMAGE_ANNOTATION_OPTIONS: Array<{
  value: ImageAnnotationStatusFilter;
  labelKey: TranslationKey;
}> = [
  { value: 'tagged', labelKey: 'filter.modal.image.status.tagged' },
  { value: 'untagged', labelKey: 'filter.modal.image.status.untagged' },
  { value: 'hasNotes', labelKey: 'filter.modal.image.status.has-notes' },
  { value: 'noNotes', labelKey: 'filter.modal.image.status.no-notes' },
];

function translated<T extends string>(
  options: Array<{ value: T; labelKey: TranslationKey }>
): Array<{ value: T; label: string }> {
  return options.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  }));
}

function buildTradeTypeNode(
  filters: UnifiedFilters,
  sources: FilterMenuSources
): ValuesDraft {
  const effective = sources.resolveTradeTypes(filters.tradeTypes);
  const available = new Set(sources.availableTradeTypes);
  return {
    kind: 'values',
    id: 'tradeTypes',
    label: t('filter.menu.trade-type'),
    icon: FILTER_MENU_ICONS.tradeType,
    options: translated(TRADE_TYPE_OPTIONS).filter((option) =>
      available.has(option.value)
    ),
    included: new Set<string>(effective),
    excluded: null,
    matchMode: null,
    appliedCount: sources.countActiveTradeTypes(filters.tradeTypes),
    onToggle: (value) => {
      const tradeType = sources.availableTradeTypes.find(
        (candidate) => candidate === value
      );
      if (!tradeType) return filters;
      const next = effective.includes(tradeType)
        ? effective.filter((current) => current !== tradeType)
        : [...effective, tradeType];
      return { ...filters, tradeTypes: sources.normalizeTradeTypes(next) };
    },
    onClear: () => ({
      ...filters,
      tradeTypes: sources.normalizeTradeTypes([]),
    }),
  };
}


export function buildFilterMenuEntries(
  filters: UnifiedFilters,
  sources: FilterMenuSources,
  onChange: (filters: UnifiedFilters) => void
): FilterMenuEntry[] {
  return bindEntries(buildFilterMenuDrafts(filters, sources), onChange);
}

function buildFilterMenuDrafts(
  filters: UnifiedFilters,
  sources: FilterMenuSources
): EntryDraft[] {
  const entries: EntryDraft[] = [
    buildAccountsNode(filters, sources),
    excludableNode(
      filters,
      { kind: 'list', key: 'tickers' },
      {
        id: 'tickers',
        label: t('filter.menu.tickers'),
        icon: FILTER_MENU_ICONS.tickers,
        options: uniqueOptions(sources.tickers, [
          ...filters.tickers,
          ...filters.exclusions.tickers,
        ]),
        emptyLabel: t('dashboard.filter.tickers.none-found'),
      },
      
      null
    ),
    excludableNode(
      filters,
      { kind: 'list', key: 'setups' },
      {
        id: 'setups',
        label: t('filter.menu.setups'),
        icon: FILTER_MENU_ICONS.setups,
        options: uniqueOptions(
          ['__NO_SETUP__', ...sources.setups],
          [...filters.setups, ...filters.exclusions.setups],
          (value) =>
            value === '__NO_SETUP__' ? t('filter.modal.no-setup') : value
        ),
      },
      listMatch(filters, 'setups'),
      '__NO_SETUP__'
    ),
    excludableNode(
      filters,
      { kind: 'list', key: 'tags' },
      {
        id: 'tags',
        label: t('filter.menu.tags'),
        icon: FILTER_MENU_ICONS.tags,
        options: uniqueOptions(
          ['__NO_TAGS__', ...sources.tags],
          [...filters.tags, ...filters.exclusions.tags],
          (value) =>
            value === '__NO_TAGS__' ? t('filter.modal.no-tags') : value
        ),
      },
      listMatch(filters, 'tags'),
      '__NO_TAGS__'
    ),
    excludableNode(
      filters,
      { kind: 'list', key: 'mistakes' },
      {
        id: 'mistakes',
        label: t('filter.menu.mistakes'),
        icon: FILTER_MENU_ICONS.mistakes,
        options: uniqueOptions(
          ['__NO_MISTAKES__', ...sources.mistakes],
          [...filters.mistakes, ...filters.exclusions.mistakes],
          (value) =>
            value === '__NO_MISTAKES__' ? t('filter.modal.no-mistakes') : value
        ),
      },
      listMatch(filters, 'mistakes'),
      '__NO_MISTAKES__'
    ),
  ];

  if (sources.sessionLogTags) {
    const sessionLogTags = filters.sessionLogTags ?? [];
    entries.push(
      includeOnlyNode(
        filters,
        {
          id: 'sessionLogTags',
          label: t('filter.modal.session-tags.placeholder'),
          icon: FILTER_MENU_ICONS.sessionLogTags,
          options: sources.sessionLogTags,
          emptyLabel: t('filter.modal.session-tags.none-found'),
        },
        sessionLogTags,
        (next) => ({ ...filters, sessionLogTags: next })
      )
    );
  }

  entries.push({ kind: 'divider', id: 'divider-criteria' });
  entries.push(buildTradeTypeNode(filters, sources));
  entries.push(
    includeOnlyNode(
      filters,
      {
        id: 'statuses',
        label: t('filter.menu.status'),
        icon: FILTER_MENU_ICONS.status,
        options: translated(STATUS_OPTIONS),
      },
      filters.statuses,
      (next) => ({ ...filters, statuses: next })
    ),
    includeOnlyNode(
      filters,
      {
        id: 'directions',
        label: t('filter.menu.direction'),
        icon: FILTER_MENU_ICONS.direction,
        options: translated(DIRECTION_OPTIONS),
      },
      filters.directions,
      (next) => ({ ...filters, directions: next })
    )
  );

  if (sources.context === 'tradelog') {
    entries.push(
      includeOnlyNode(
        filters,
        {
          id: 'reviewStatus',
          label: t('filter.menu.review-status'),
          icon: FILTER_MENU_ICONS.reviewStatus,
          options: translated(REVIEW_STATUS_OPTIONS),
        },
        filters.reviewStatus,
        (next) => ({ ...filters, reviewStatus: next })
      )
    );
  }

  const trailing: NodeDraft[] = [];

  if (sources.customFields.length > 0) {
    trailing.push({
      kind: 'branch',
      id: 'customFields',
      label: t('filter.modal.section.custom-fields'),
      icon: FILTER_MENU_ICONS.customFields,
      children: sources.customFields.map((definition) => {
        const { values, labelFor } = dropdownOptionValues(definition.options);
        return excludableNode(
          filters,
          { kind: 'customField', fieldId: definition.field.id },
          {
            id: `customFields/${definition.field.id}`,
            label:
              definition.field.tradeLog?.columnLabel || definition.field.label,
            options: uniqueOptions(
              values,
              [
                ...(filters.customFieldFilters[definition.field.id] ?? []),
                ...(filters.exclusions.customFieldFilters[
                  definition.field.id
                ] ?? []),
              ],
              labelFor
            ),
            emptyLabel: sources.optionsLoading
              ? t('common.loading')
              : t('filter.modal.custom-field.none-available'),
          },
          
          definition.field.type === CustomFieldType.MULTISELECT
            ? {
                field: { kind: 'customField', fieldId: definition.field.id },
                mode: getCustomFieldMatchMode(
                  filters.matchModes,
                  definition.field.id
                ),
              }
            : null
        );
      }),
    });
  }

  if (sources.imageTags) {
    const imageTagOptions = dropdownOptionValues(sources.imageTags);
    const imageTags = filters.imageTags ?? [];
    const imageAnnotationStatus = filters.imageAnnotationStatus ?? [];
    trailing.push({
      kind: 'branch',
      id: 'gallery',
      label: t('filter.modal.section.image-gallery'),
      icon: FILTER_MENU_ICONS.gallery,
      children: [
        includeOnlyNode(
          filters,
          {
            id: 'gallery/annotationStatus',
            label: t('filter.modal.image.annotation-status'),
            icon: FILTER_MENU_ICONS.annotationStatus,
            options: translated(IMAGE_ANNOTATION_OPTIONS),
          },
          imageAnnotationStatus,
          (next) => ({ ...filters, imageAnnotationStatus: next })
        ),
        includeOnlyNode(
          filters,
          {
            id: 'gallery/imageTags',
            label: t('filter.modal.image.tags'),
            icon: FILTER_MENU_ICONS.mediaTags,
            options: uniqueOptions(
              ['__NO_IMAGE_TAGS__', ...imageTagOptions.values],
              imageTags,
              (value) =>
                value === '__NO_IMAGE_TAGS__'
                  ? t('filter.modal.no-tags')
                  : imageTagOptions.labelFor(value)
            ),
          },
          imageTags,
          (next) => ({ ...filters, imageTags: next })
        ),
      ],
    });
  }

  if (trailing.length > 0) {
    entries.push({ kind: 'divider', id: 'divider-extra' }, ...trailing);
  }

  return entries;
}
