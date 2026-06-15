

import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { isDiscreteCustomFieldFilterable } from '../../types/customFields';
import { App, Modal, WorkspaceLeaf } from 'obsidian';
import {
  ViewLevel,
  TradeLogFilters,
  SELECTABLE_TRADE_TYPES_COUNT,
  SELECTABLE_STATUSES_COUNT,
} from '../../services/tradelog/types';
import { DateRangeFilter } from '../dashboard/components/FilterControls/DateRangeFilter';
import { FilterButton } from '../shared/FilterButton';
import { openFilterModal, UnifiedFilters } from '../shared/filters';
import type { AvailableCustomFieldFilter } from '../shared/filters/types';
import { TradeLogService } from '../../services/tradelog';
import JournalitPlugin from '../../main';
import {
  openTradeLogSettingsModal,
  TradeLogSettingsModal,
} from './TradeLogSettingsModal';
import {
  SlidersHorizontal,
  Square,
  SquareCheckBig,
} from '../shared/icons/ObsidianIcon';
import { t } from '../../lang/helpers';
import {
  useGuideAction,
  useGuideBackHandler,
  useGuideTarget,
} from '../../guides/GuideRuntimeLayer';
import {
  TRADE_LOG_COLUMN_SETTINGS_BUTTON_TARGET_ID,
  TRADE_LOG_COLUMN_SETTINGS_OPENED_ACTION_ID,
  TRADE_LOG_FILTER_BUTTON_TARGET_ID,
  TRADE_LOG_FILTER_MODAL_CLOSED_ACTION_ID,
  TRADE_LOG_FILTER_MODAL_OPENED_ACTION_ID,
  TRADE_LOG_MULTI_SELECT_BUTTON_TARGET_ID,
  TRADE_LOG_VIEW_SELECTOR_TARGET_ID,
} from '../../guides/tradeLogGuideIds';
import { useEventBus } from '../../hooks/useEventBus';

const VIEW_LEVELS: ReadonlySet<string> = new Set([
  'years',
  'quarters',
  'months',
  'weeks',
  'days',
  'trades',
]);

const isViewLevel = (value: string): value is ViewLevel =>
  VIEW_LEVELS.has(value);

interface TradeLogHeaderProps {
  app: App;
  plugin: JournalitPlugin;
  leaf: WorkspaceLeaf;
  filters: TradeLogFilters;
  onFilterChange: (filters: Partial<TradeLogFilters>) => void;
  onSettingsChange: () => void;
  isMultiSelectMode?: boolean;
  onToggleMultiSelectMode?: () => void;
}

export const TradeLogHeader = memo<TradeLogHeaderProps>(
  ({
    app,
    plugin,
    leaf,
    filters,
    onFilterChange,
    onSettingsChange,
    isMultiSelectMode,
    onToggleMultiSelectMode,
  }) => {
    const [accounts, setAccounts] = useState<string[]>([]);
    const [guideVersion, setGuideVersion] = useState(0);

    
    const tradeLogServiceRef = useRef<TradeLogService | null>(null);
    if (!tradeLogServiceRef.current) {
      tradeLogServiceRef.current = new TradeLogService(plugin);
    }
    const tradeLogService = tradeLogServiceRef.current;
    const activeFilterModalRef = useRef<Modal | null>(null);
    const activeSettingsModalRef = useRef<TradeLogSettingsModal | null>(null);
    const isClosingGuideFilterModalRef = useRef(false);
    const isOpeningGuideFilterModalRef = useRef(false);
    const emitGuideAction = useGuideAction();
    const registerViewSelectorTarget = useGuideTarget(
      TRADE_LOG_VIEW_SELECTOR_TARGET_ID
    );
    const registerFilterButtonTarget = useGuideTarget(
      TRADE_LOG_FILTER_BUTTON_TARGET_ID
    );
    const registerMultiSelectButtonTarget = useGuideTarget(
      TRADE_LOG_MULTI_SELECT_BUTTON_TARGET_ID
    );
    const registerColumnSettingsTarget = useGuideTarget(
      TRADE_LOG_COLUMN_SETTINGS_BUTTON_TARGET_ID
    );

    const loadAccounts = useCallback(async () => {
      if (!tradeLogService) {
        return;
      }

      const availableAccounts = await tradeLogService.getUniqueAccounts();
      setAccounts(availableAccounts);
    }, [tradeLogService]);

    
    useEffect(() => {
      let isMounted = true;

      const loadAccountsSafely = async () => {
        if (!tradeLogService) {
          return;
        }

        const availableAccounts = await tradeLogService.getUniqueAccounts();
        if (isMounted) {
          setAccounts(availableAccounts);
        }
      };

      void loadAccountsSafely();

      return () => {
        isMounted = false;
        if (tradeLogServiceRef.current) {
          tradeLogServiceRef.current.destroy();
        }
      };
    }, [tradeLogService]);

    useEffect(() => {
      if (!plugin.viewGuideService) {
        return;
      }

      return plugin.viewGuideService.subscribe(() => {
        setGuideVersion((prev) => prev + 1);
      });
    }, [plugin]);

    useEventBus('trade:changed', () => {
      void loadAccounts();
    });
    useEventBus('backtest-trade:changed', () => {
      void loadAccounts();
    });
    useEventBus('account:changed', () => {
      void loadAccounts();
    });

    
    const getActiveFilterCount = (): number => {
      let count = 0;
      
      if (
        filters.tradeTypes &&
        filters.tradeTypes.length > 0 &&
        filters.tradeTypes.length < SELECTABLE_TRADE_TYPES_COUNT
      )
        count++;
      if (
        filters.statuses &&
        filters.statuses.length > 0 &&
        filters.statuses.length < SELECTABLE_STATUSES_COUNT
      )
        count++;
      if (filters.accounts && filters.accounts.length > 0) count++;
      if (filters.tickers && filters.tickers.length > 0) count++;
      if (filters.setups && filters.setups.length > 0) count++;
      if (filters.tags && filters.tags.length > 0) count++;
      if (filters.mistakes && filters.mistakes.length > 0) count++;
      if (
        filters.customFieldFilters &&
        Object.values(filters.customFieldFilters).some(
          (values) => values.length > 0
        )
      ) {
        count += Object.values(filters.customFieldFilters).filter(
          (values) => values.length > 0
        ).length;
      }
      return count;
    };

    
    const handleOpenFilterModal = useCallback(async () => {
      if (
        activeFilterModalRef.current ||
        isOpeningGuideFilterModalRef.current
      ) {
        return;
      }

      isOpeningGuideFilterModalRef.current = true;

      let availableCustomFieldFilters: AvailableCustomFieldFilter[] = [];

      try {
        availableCustomFieldFilters =
          await tradeLogService.getAvailableCustomFieldFilters(
            (plugin.customFieldsService?.getFields() || []).filter(
              isDiscreteCustomFieldFilterable
            )
          );
      } catch (error) {
        console.error(
          '[TradeLogHeader] Failed to load custom field filter options:',
          error
        );
      }

      if (activeFilterModalRef.current) {
        isOpeningGuideFilterModalRef.current = false;
        return;
      }

      const modal = openFilterModal({
        app,
        plugin,
        context: 'tradelog',
        currentFilters: {
          accounts: filters.accounts || [],
          tickers: filters.tickers || [],
          setups: filters.setups || [],
          tags: filters.tags || [],
          mistakes: filters.mistakes || [],
          tradeTypes: filters.tradeTypes || [],
          statuses: filters.statuses || [],
          customFieldFilters: filters.customFieldFilters || {},
        },
        availableAccounts: accounts,
        availableCustomFieldFilters,
        onApply: (newFilters: UnifiedFilters) => {
          onFilterChange({
            tradeTypes: newFilters.tradeTypes,
            statuses: newFilters.statuses,
            accounts: newFilters.accounts,
            tickers: newFilters.tickers,
            setups: newFilters.setups,
            tags: newFilters.tags,
            mistakes: newFilters.mistakes,
            customFieldFilters: newFilters.customFieldFilters,
          });
        },
        onClose: () => {
          activeFilterModalRef.current = null;
          isOpeningGuideFilterModalRef.current = false;
          if (isClosingGuideFilterModalRef.current) {
            isClosingGuideFilterModalRef.current = false;
            return;
          }
          emitGuideAction(TRADE_LOG_FILTER_MODAL_CLOSED_ACTION_ID);
        },
      });

      activeFilterModalRef.current = modal;
      isOpeningGuideFilterModalRef.current = false;
      emitGuideAction(TRADE_LOG_FILTER_MODAL_OPENED_ACTION_ID);
    }, [
      accounts,
      app,
      emitGuideAction,
      filters,
      onFilterChange,
      plugin,
      tradeLogService,
    ]);

    useEffect(() => {
      void guideVersion;

      const guideService = plugin.viewGuideService;
      if (!guideService) {
        return;
      }

      const activeLeaf = guideService.getActiveLeaf();
      if (!activeLeaf) {
        return;
      }

      if (activeLeaf !== leaf) {
        return;
      }

      const session = guideService.getSessionForLeaf(
        activeLeaf,
        'journalit-trade-log-view'
      );
      if (!session || session.guideId !== 'tradelog.main') {
        return;
      }

      if (session.currentStepId === 'filter-modal') {
        if (!activeFilterModalRef.current) {
          void handleOpenFilterModal();
        }
        return;
      }

      if (activeFilterModalRef.current) {
        isClosingGuideFilterModalRef.current = true;
        activeFilterModalRef.current.close();
        activeFilterModalRef.current = null;
      }
    }, [guideVersion, handleOpenFilterModal, leaf, plugin]);

    const handleOpenSettingsModal = useCallback(() => {
      if (activeSettingsModalRef.current?.modalEl.isConnected) {
        return;
      }

      const modal = openTradeLogSettingsModal({
        app,
        plugin,
        onSave: () => {
          onSettingsChange();
        },
        onClose: () => {
          activeSettingsModalRef.current = null;
        },
      });
      activeSettingsModalRef.current = modal;
      emitGuideAction(TRADE_LOG_COLUMN_SETTINGS_OPENED_ACTION_ID);
    }, [app, emitGuideAction, plugin, onSettingsChange]);

    useEffect(() => {
      void guideVersion;

      const guideService = plugin.viewGuideService;
      if (!guideService) {
        return;
      }

      const activeLeaf = guideService.getActiveLeaf();
      if (!activeLeaf || activeLeaf !== leaf) {
        return;
      }

      const session = guideService.getSessionForLeaf(
        activeLeaf,
        'journalit-trade-log-view'
      );
      if (!session || session.guideId !== 'tradelog.main') {
        return;
      }

      const shouldHaveSettingsModal =
        session.currentStepId === 'active-columns' ||
        session.currentStepId === 'available-columns';

      if (shouldHaveSettingsModal) {
        if (!activeSettingsModalRef.current?.modalEl.isConnected) {
          handleOpenSettingsModal();
        }
        return;
      }

      activeSettingsModalRef.current?.closeWithoutUnsavedChangesCheck();
      activeSettingsModalRef.current = null;
    }, [guideVersion, handleOpenSettingsModal, leaf, plugin]);

    const handleGuideBack = useCallback(
      ({ toStepId }: { toStepId: string }) => {
        if (toStepId === 'filter-modal') {
          activeSettingsModalRef.current?.closeWithoutUnsavedChangesCheck();
          activeSettingsModalRef.current = null;
          if (!activeFilterModalRef.current) {
            void handleOpenFilterModal();
          }
          return;
        }

        if (toStepId === 'active-columns' || toStepId === 'available-columns') {
          activeFilterModalRef.current?.close();
          activeFilterModalRef.current = null;
          if (!activeSettingsModalRef.current?.modalEl.isConnected) {
            handleOpenSettingsModal();
          }
          return;
        }

        activeSettingsModalRef.current?.closeWithoutUnsavedChangesCheck();
        activeSettingsModalRef.current = null;
      },
      [handleOpenFilterModal, handleOpenSettingsModal]
    );

    useGuideBackHandler(handleGuideBack);

    return (
      <div className="trade-log-header">
        <div className="trade-log-controls">
          <div
            className="trade-log-view-selector"
            ref={registerViewSelectorTarget}
          >
            <label>{t('tradelog.view.selector.label')}:</label>
            <select
              value={filters.viewLevel}
              onChange={(e) => {
                const nextViewLevel = e.target.value;
                if (isViewLevel(nextViewLevel)) {
                  onFilterChange({ viewLevel: nextViewLevel });
                }
              }}
              className="trade-log-view-dropdown"
            >
              <option value="trades">{t('common.trades')}</option>
              <option value="years">{t('common.years')}</option>
              <option value="quarters">{t('common.quarters')}</option>
              <option value="months">{t('common.months')}</option>
              <option value="weeks">{t('common.weeks')}</option>
              <option value="days">{t('common.days')}</option>
            </select>
          </div>

          <DateRangeFilter
            dateRange={filters.dateRange}
            onChange={(newRange) =>
              onFilterChange({
                dateRange: newRange,
              })
            }
          />

          <div className="trade-log-filter-actions">
            <div ref={registerFilterButtonTarget}>
              <FilterButton
                onClick={() => {
                  void handleOpenFilterModal();
                }}
                activeFilterCount={getActiveFilterCount()}
              />
            </div>
            {filters.viewLevel === 'trades' && (
              <div
                className="journalit-filter-button-container"
                ref={registerMultiSelectButtonTarget}
              >
                <button
                  className={`journalit-filter-button clickable-icon ${isMultiSelectMode ? 'active' : ''}`}
                  onClick={() => {
                    onToggleMultiSelectMode?.();
                  }}
                  aria-label={
                    isMultiSelectMode
                      ? t('tradelog.batch.disable-multi-select')
                      : t('tradelog.batch.enable-multi-select')
                  }
                >
                  {isMultiSelectMode ? (
                    <SquareCheckBig size={16} />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </div>
            )}
            <div className="journalit-filter-button-container">
              <button
                ref={registerColumnSettingsTarget}
                className="journalit-filter-button clickable-icon"
                onClick={handleOpenSettingsModal}
                aria-label={t('tradelog.batch.column-settings')}
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TradeLogHeader.displayName = 'TradeLogHeader';
