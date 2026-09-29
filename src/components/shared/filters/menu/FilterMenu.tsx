

import React, { useCallback, useMemo, useRef, useState } from 'react';
import type JournalitPlugin from '../../../../main';
import type { UnifiedFilters } from '../types';
import {
  type FilterMenuContext,
  buildFilterMenuEntries,
} from './filterMenuNodes';
import type {
  FilterMenuAsyncOptions,
  LoadedFilterMenuOptions,
} from './filterMenuState';
import {
  CascadingFilterMenu,
  type FilterMenuTriggerState,
} from './CascadingFilterMenu';
import {
  type FilterMenuEntry,
  type FilterMenuGuideTour,
  type FilterMenuValuesNode,
  findChildNode,
} from './menuModel';
import { resetMenuFilters, useFilterMenuSources } from './useFilterMenuSources';
import { offersPhaseList } from '../accountPhaseScope';
import { useGuideContextValue } from '../../../../guides/GuideRuntimeLayer';
import { FILTER_MENU_PHASED_ACCOUNTS_CONTEXT_KEY } from '../../../../guides/filterMenuWhatsNewGuideIds';

export type { LoadedFilterMenuOptions } from './filterMenuState';


export type TradeFilterMenuTourStop = 'exclude' | 'match' | 'phases';

export interface TradeFilterMenuTour {
  stop: TradeFilterMenuTourStop;
  registerTarget: (element: HTMLElement | null) => void;
}


const TOURED_LIST_IDS = ['tags', 'setups', 'mistakes'] as const;
const ACCOUNTS_NODE_ID = 'accounts';


function tourPanelIds(entries: FilterMenuEntry[]): {
  listId: string | null;
  listMatchId: string | null;
  firstPhasesId: string | null;
} {
  
  
  const lists = TOURED_LIST_IDS.map((id) => findChildNode(entries, id)).filter(
    (node): node is FilterMenuValuesNode =>
      node?.kind === 'values' && node.matchChild !== undefined
  );
  const list =
    lists.find((node) =>
      node.options.some((option) => option.value !== node.noValueOption)
    ) ?? lists[0];
  const accounts = findChildNode(entries, ACCOUNTS_NODE_ID);
  
  const firstPhases =
    accounts?.kind === 'values' && accounts.optionChildren
      ? Array.from(accounts.optionChildren.values())[0]
      : undefined;
  return {
    listId: list?.id ?? null,
    listMatchId: list?.matchChild?.id ?? null,
    firstPhasesId: firstPhases?.id ?? null,
  };
}

interface FilterMenuButtonProps {
  plugin: JournalitPlugin;
  context: FilterMenuContext;
  filters: UnifiedFilters;
  onChange: (filters: UnifiedFilters) => void;
  
  loadOptions: () => Promise<LoadedFilterMenuOptions>;
  className?: string;
  showSessionLogFilters?: boolean;
  showImageFilters?: boolean;
  
  renderTrigger?: (trigger: FilterMenuTriggerState) => React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  
  guideTour?: TradeFilterMenuTour | null;
}


export const FilterMenuButton: React.FC<FilterMenuButtonProps> = ({
  plugin,
  context,
  filters,
  onChange,
  loadOptions,
  className,
  showSessionLogFilters = false,
  showImageFilters = false,
  renderTrigger,
  onOpenChange,
  guideTour = null,
}) => {
  const loadGenerationRef = useRef(0);
  const [asyncOptions, setAsyncOptions] =
    useState<FilterMenuAsyncOptions | null>(null);

  const sources = useFilterMenuSources({
    plugin,
    context,
    asyncOptions,
    showSessionLogFilters,
    showImageFilters,
  });
  
  const entries = useMemo(
    () => buildFilterMenuEntries(filters, sources, onChange),
    [filters, onChange, sources]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      onOpenChange?.(open);
      
      const generation = loadGenerationRef.current + 1;
      loadGenerationRef.current = generation;
      if (!open) return;
      loadOptions()
        .then((options) => {
          if (loadGenerationRef.current !== generation) return;
          
          setAsyncOptions((previous) => ({
            accounts: options.accounts ?? previous?.accounts ?? [],
            customFields: options.customFields ?? previous?.customFields ?? [],
            imageTags: options.imageTags ?? previous?.imageTags,
          }));
        })
        .catch((error: unknown) => {
          console.error('[FilterMenu] Failed to load filter options:', error);
        });
    },
    [loadOptions, onOpenChange]
  );

  
  
  const tourStop = guideTour?.stop ?? null;
  const registerTourTarget = guideTour?.registerTarget ?? null;
  const { listId, listMatchId, firstPhasesId } = tourPanelIds(entries);
  
  
  
  useGuideContextValue(
    FILTER_MENU_PHASED_ACCOUNTS_CONTEXT_KEY,
    sources.optionsLoading
      ? sources.accountPhaseGroups.some(offersPhaseList)
      : firstPhasesId !== null
  );
  const menuGuideTour = useMemo<FilterMenuGuideTour | null>(() => {
    if (!tourStop || !registerTourTarget) return null;
    let path: string[] | null = null;
    if (tourStop === 'exclude' && listId) {
      path = [listId];
    } else if (tourStop === 'match' && listId && listMatchId) {
      path = [listId, listMatchId];
    } else if (tourStop === 'phases' && firstPhasesId) {
      path = [ACCOUNTS_NODE_ID, firstPhasesId];
    }
    
    
    return {
      path,
      target: tourStop === 'exclude' ? 'option' : 'panel',
      registerTarget: registerTourTarget,
    };
  }, [firstPhasesId, listId, listMatchId, registerTourTarget, tourStop]);

  return (
    <CascadingFilterMenu
      app={plugin.app}
      entries={entries}
      onReset={() => onChange(resetMenuFilters(filters, context))}
      className={className}
      onOpenChange={handleOpenChange}
      renderTrigger={renderTrigger}
      guideTour={menuGuideTour}
    />
  );
};
