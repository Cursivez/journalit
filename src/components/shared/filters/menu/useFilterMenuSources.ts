

import { useEffect, useMemo, useState } from 'react';
import type JournalitPlugin from '../../../../main';
import { useEventBus } from '../../../../hooks/useEventBus';
import { OptionType } from '../../../../services/options/CustomOptionsService';
import type { TradeType } from '../../../../services/tradelog/types';
import { getSessionLogTags } from '../../../sessionLog/sessionLogUtils';
import {
  createDashboardFilters,
  createReviewFilters,
  createTradeLogFilters,
  getTradeTypeFilterActiveCount,
  normalizeDashboardTradeTypes,
  normalizeReviewFilters,
  normalizeTradeLogTradeTypes,
} from '../../../../settings/viewFiltersDefaults';
import {
  type CustomFieldDefinition,
  type DropdownOption,
  isDiscreteCustomFieldFilterable,
} from '../../../../types/customFields';
import { listAccountPhaseOptions } from '../accountPhaseScope';
import { createFilterExclusions } from '../filterExclusions';
import { createFilterMatchModes } from '../filterMatchModes';
import type { AvailableCustomFieldFilter, UnifiedFilters } from '../types';
import type { FilterMenuContext, FilterMenuSources } from './filterMenuNodes';
import type { FilterMenuAsyncOptions } from './filterMenuState';

interface TradeTypeRules {
  available: ReadonlySet<TradeType>;
  ordered: TradeType[];
  defaults: () => TradeType[];
  normalize: (tradeTypes: TradeType[]) => TradeType[];
}

function tradeTypeRules(
  ordered: TradeType[],
  defaults: () => TradeType[],
  normalize: (tradeTypes: TradeType[]) => TradeType[]
): TradeTypeRules {
  return { available: new Set(ordered), ordered, defaults, normalize };
}

const TRADE_TYPE_RULES: Record<FilterMenuContext, TradeTypeRules> = {
  dashboard: tradeTypeRules(
    ['regular', 'backtest'],
    () => createDashboardFilters().tradeTypes,
    normalizeDashboardTradeTypes
  ),
  review: tradeTypeRules(
    ['regular', 'backtest'],
    () => createReviewFilters().tradeTypes,
    (tradeTypes) => normalizeReviewFilters({ tradeTypes }).tradeTypes
  ),
  tradelog: tradeTypeRules(
    ['regular', 'missed', 'backtest'],
    () => createTradeLogFilters().tradeTypes,
    normalizeTradeLogTradeTypes
  ),
};

export function resetMenuFilters(
  filters: UnifiedFilters,
  context: FilterMenuContext
): UnifiedFilters {
  return {
    ...filters,
    accounts: [],
    accountPhases: [],
    tickers: [],
    setups: [],
    tags: [],
    mistakes: [],
    tradeTypes: TRADE_TYPE_RULES[context].normalize([]),
    statuses: [],
    reviewStatus: [],
    directions: [],
    sessionLogTags: [],
    customFieldFilters: {},
    exclusions: createFilterExclusions(),
    matchModes: createFilterMatchModes(),
    imageAnnotationStatus: [],
    imageTags: [],
  };
}


function filterableCustomFields(
  fields: CustomFieldDefinition[],
  loaded: AvailableCustomFieldFilter[] | undefined
): AvailableCustomFieldFilter[] {
  const loadedOptions = new Map<string, DropdownOption[]>();
  for (const entry of loaded ?? []) {
    loadedOptions.set(entry.field.id, entry.options);
  }
  const result: AvailableCustomFieldFilter[] = [];
  for (const field of fields) {
    if (isDiscreteCustomFieldFilterable(field)) {
      result.push({ field, options: loadedOptions.get(field.id) ?? [] });
    }
  }
  return result;
}

interface UseFilterMenuSourcesInput {
  plugin: JournalitPlugin;
  context: FilterMenuContext;
  asyncOptions: FilterMenuAsyncOptions | null;
  showSessionLogFilters: boolean;
  showImageFilters: boolean;
}


export function useFilterMenuSources({
  plugin,
  context,
  asyncOptions,
  showSessionLogFilters,
  showImageFilters,
}: UseFilterMenuSourcesInput): FilterMenuSources {
  const [optionsRevision, setOptionsRevision] = useState(0);
  
  
  const bumpRevision = () => setOptionsRevision((rev) => rev + 1);
  useEventBus('options:changed', bumpRevision);
  useEventBus('account:changed', bumpRevision);
  useEffect(() => {
    const workspace = plugin.app.workspace;
    const onCustomFieldsChanged = () => setOptionsRevision((rev) => rev + 1);
    workspace.on('journalit-custom-fields-changed', onCustomFieldsChanged);
    return () => {
      workspace.off('journalit-custom-fields-changed', onCustomFieldsChanged);
    };
  }, [plugin]);

  return useMemo<FilterMenuSources>(() => {
    void optionsRevision;
    const optionsService = plugin.optionsService;
    const rules = TRADE_TYPE_RULES[context];
    return {
      context,
      accounts: asyncOptions?.accounts ?? [],
      accountPhaseGroups: listAccountPhaseOptions(
        plugin.settings.account?.accountMetadata
      ),
      tickers: optionsService?.getOptions(OptionType.INSTRUMENT) ?? [],
      setups: optionsService?.getOptions(OptionType.SETUP) ?? [],
      tags: optionsService?.getOptions(OptionType.TAG) ?? [],
      mistakes: optionsService?.getOptions(OptionType.MISTAKE) ?? [],
      sessionLogTags: showSessionLogFilters
        ? getSessionLogTags(plugin).map((tag) => ({
            value: tag.id,
            label: tag.label,
          }))
        : null,
      
      
      
      customFields: filterableCustomFields(
        plugin.customFieldsService.getFields(),
        asyncOptions?.customFields
      ),
      optionsLoading: asyncOptions === null,
      imageTags: showImageFilters ? (asyncOptions?.imageTags ?? []) : null,
      resolveTradeTypes: (tradeTypes) =>
        rules
          .normalize(tradeTypes)
          .filter((tradeType) => rules.available.has(tradeType)),
      normalizeTradeTypes: rules.normalize,
      availableTradeTypes: rules.ordered,
      countActiveTradeTypes: (tradeTypes) =>
        getTradeTypeFilterActiveCount(tradeTypes, rules.defaults()),
      dateFormat: plugin.settings.trade.dateFormat,
    };
  }, [
    asyncOptions,
    context,
    optionsRevision,
    plugin,
    showImageFilters,
    showSessionLogFilters,
  ]);
}
