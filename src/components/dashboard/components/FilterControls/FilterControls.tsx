

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Grid2x2Plus, Check, Plus } from '../../../shared/icons/ObsidianIcon';
import { t } from '../../../../lang/helpers';
import { DateRangeFilter } from './DateRangeFilter';
import { FilterControlsProps } from './types';
import { saveLastUsedFilters } from '../../utils/filterUtils';
import { usePlugin, useViewportThreshold } from '../../../../hooks';
import { Button } from '../../../../components/ui/Button';
import { FilterButton } from '../../../shared/FilterButton';
import { openFilterModal, UnifiedFilters } from '../../../shared/filters';
import type { AvailableCustomFieldFilter } from '../../../shared/filters/types';
import { SELECTABLE_STATUSES_COUNT } from '../../../../services/tradelog/types';
import {
  type CustomFieldDefinition,
  type CustomFieldFilterSelections,
  isDiscreteCustomFieldFilterable,
} from '../../../../types/customFields';
import { TradeLogService } from '../../../../services/tradelog';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  createDashboardFilters,
  getTradeTypeFilterActiveCount,
} from '../../../../settings/viewFiltersDefaults';
import { useGuideTarget } from '../../../../guides/GuideRuntimeLayer';
import {
  DASHBOARD_ADD_WIDGET_BUTTON_TARGET_ID,
  DASHBOARD_EDIT_LAYOUT_BUTTON_TARGET_ID,
  DASHBOARD_FILTER_BUTTON_TARGET_ID,
} from '../../../../guides/dashboardGuideIds';
import {
  normalizeAccountLookupKey,
  normalizeTradeAccountIdentity,
} from '../../../../services/trade/core/TradeAccountIdentity';

const sanitizeCustomFieldFilters = (
  customFieldFilters: CustomFieldFilterSelections | undefined,
  customFields: CustomFieldDefinition[]
): CustomFieldFilterSelections => {
  const filterableFieldIds = new Set(
    customFields
      .filter((field) => isDiscreteCustomFieldFilterable(field))
      .map((field) => field.id)
  );

  return Object.fromEntries(
    Object.entries(customFieldFilters || {}).flatMap(([fieldId, values]) => {
      if (!filterableFieldIds.has(fieldId) || !Array.isArray(values)) {
        return [];
      }

      const sanitizedValues = [...new Set(values.filter(Boolean))];
      return sanitizedValues.length > 0 ? [[fieldId, sanitizedValues]] : [];
    })
  );
};






export const FilterControls = React.memo<FilterControlsProps>(
  ({
    filters,
    onFilterChange,
    isEditing = false,
    onToggleEditMode,
    onOpenAddWidget,
  }) => {
    const plugin = usePlugin();
    const { dashboardData } = useDashboardData();
    const registerFilterButtonTarget = useGuideTarget(
      DASHBOARD_FILTER_BUTTON_TARGET_ID
    );
    const registerEditLayoutTarget = useGuideTarget(
      DASHBOARD_EDIT_LAYOUT_BUTTON_TARGET_ID
    );
    const registerAddWidgetTarget = useGuideTarget(
      DASHBOARD_ADD_WIDGET_BUTTON_TARGET_ID
    );

    
    const isCompactView = useViewportThreshold(1300);

    const tradeLogServiceRef = useRef<TradeLogService | null>(null);

    useEffect(() => {
      if (plugin && !tradeLogServiceRef.current) {
        tradeLogServiceRef.current = new TradeLogService(plugin);
      }

      return () => {
        tradeLogServiceRef.current?.destroy();
        tradeLogServiceRef.current = null;
      };
    }, [plugin]);

    const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(
      () => plugin?.customFieldsService?.getFields() || []
    );

    useEffect(() => {
      if (!plugin) {
        return;
      }

      const handleCustomFieldsChanged = () => {
        setCustomFields(plugin.customFieldsService?.getFields() || []);
      };

      handleCustomFieldsChanged();
      plugin.app.workspace.on(
        'journalit-custom-fields-changed',
        handleCustomFieldsChanged
      );

      return () => {
        plugin.app.workspace.off(
          'journalit-custom-fields-changed',
          handleCustomFieldsChanged
        );
      };
    }, [plugin]);

    const discreteCustomFields = useMemo(
      () => customFields.filter(isDiscreteCustomFieldFilterable),
      [customFields]
    );

    const sanitizedCustomFieldFilters = useMemo(
      () =>
        sanitizeCustomFieldFilters(
          filters.customFieldFilters,
          discreteCustomFields
        ),
      [filters.customFieldFilters, discreteCustomFields]
    );

    useEffect(() => {
      if (!plugin) {
        return;
      }

      if (
        JSON.stringify(filters.customFieldFilters || {}) ===
        JSON.stringify(sanitizedCustomFieldFilters)
      ) {
        return;
      }

      const mergedFilters = {
        ...filters,
        customFieldFilters: sanitizedCustomFieldFilters,
      };

      onFilterChange(mergedFilters);
      void saveLastUsedFilters(plugin, mergedFilters);
    }, [plugin, filters, onFilterChange, sanitizedCustomFieldFilters]);

    
    const availableAccounts = useMemo(() => {
      if (!dashboardData?.trades) return [];
      const accountByLookupKey = new Map<string, string>();
      dashboardData.trades.forEach((trade) => {
        const accountNames =
          trade.accountNamesNormalized &&
          trade.accountNamesNormalized.length > 0
            ? trade.accountNamesNormalized
            : normalizeTradeAccountIdentity(
                Object.fromEntries(Object.entries(trade)),
                {
                  resolveAccountIdDisplayName: (accountId) =>
                    plugin?.settings?.backendIntegration?.accountMapping?.[
                      accountId
                    ],
                }
              ).accountNames;

        accountNames.forEach((accountName) => {
          const lookupKey = normalizeAccountLookupKey(accountName);
          if (!lookupKey || accountByLookupKey.has(lookupKey)) {
            return;
          }
          accountByLookupKey.set(lookupKey, accountName);
        });
      });
      return Array.from(accountByLookupKey.values()).sort();
    }, [
      dashboardData?.trades,
      plugin?.settings?.backendIntegration?.accountMapping,
    ]);

    

    
    const handleDateRangeChange = useCallback(
      (dateRange: [Date | null, Date | null]) => {
        const mergedFilters = {
          ...filters,
          dateRange,
          customFieldFilters: sanitizedCustomFieldFilters,
        };
        onFilterChange(mergedFilters);

        
        if (plugin) {
          void saveLastUsedFilters(plugin, mergedFilters);
        }
      },
      [filters, onFilterChange, plugin, sanitizedCustomFieldFilters]
    );

    
    const getActiveFilterCount = (): number => {
      let count = 0;
      if (filters.accounts.length > 0) count++;
      if (filters.tickers?.length > 0) count++;
      if (filters.setups?.length > 0) count++;
      if (filters.tags?.length > 0) count++;
      if (filters.mistakes?.length > 0) count++;
      if (
        getTradeTypeFilterActiveCount(
          filters.tradeTypes,
          createDashboardFilters().tradeTypes
        ) > 0
      )
        count++;
      if (
        filters.statuses &&
        filters.statuses.length > 0 &&
        filters.statuses.length < SELECTABLE_STATUSES_COUNT
      )
        count++;
      if (
        Object.values(sanitizedCustomFieldFilters).some(
          (values) => values.length > 0
        )
      ) {
        count += Object.values(sanitizedCustomFieldFilters).filter(
          (values) => values.length > 0
        ).length;
      }
      return count;
    };

    
    const handleOpenFilterModal = useCallback(async () => {
      if (!plugin || !plugin.app) return;

      let availableCustomFieldFilters: AvailableCustomFieldFilter[] = [];

      const tradeLogService = tradeLogServiceRef.current;

      try {
        if (tradeLogService) {
          availableCustomFieldFilters =
            await tradeLogService.getAvailableCustomFieldFilters(
              discreteCustomFields
            );
        }
      } catch (error) {
        console.error(
          '[DashboardFilterControls] Failed to load custom field filter options:',
          error
        );
      }

      openFilterModal({
        app: plugin.app,
        plugin,
        context: 'dashboard',
        currentFilters: {
          accounts: filters.accounts,
          tickers: filters.tickers || [],
          setups: filters.setups || [],
          tags: filters.tags || [],
          mistakes: filters.mistakes || [],
          tradeTypes: filters.tradeTypes || [],
          statuses: filters.statuses || [],
          customFieldFilters: sanitizedCustomFieldFilters,
        },
        availableAccounts,
        availableCustomFieldFilters,
        onApply: (newFilters: UnifiedFilters) => {
          const mergedFilters = {
            ...filters,
            accounts: newFilters.accounts,
            tickers: newFilters.tickers,
            setups: newFilters.setups,
            tags: newFilters.tags,
            mistakes: newFilters.mistakes,
            tradeTypes: newFilters.tradeTypes,
            statuses: newFilters.statuses,
            customFieldFilters: sanitizeCustomFieldFilters(
              newFilters.customFieldFilters,
              discreteCustomFields
            ),
          };
          onFilterChange(mergedFilters);
          void saveLastUsedFilters(plugin, mergedFilters);
        },
        onClose: () => {},
      });
    }, [
      plugin,
      filters,
      onFilterChange,
      availableAccounts,
      discreteCustomFields,
      sanitizedCustomFieldFilters,
    ]);

    return (
      <div
        className={`journalit-dashboard-filter-controls ${isCompactView ? 'compact-view' : ''}`}
      >
        {isCompactView ? (
          
          <div className="journalit-dashboard-header-compact">
            <div className="journalit-dashboard-primary-filters">
              <DateRangeFilter
                dateRange={filters.dateRange}
                onChange={handleDateRangeChange}
              />
            </div>

            <div className="journalit-dashboard-filter-actions">
              <div ref={registerFilterButtonTarget}>
                <FilterButton
                  onClick={() => void handleOpenFilterModal()}
                  activeFilterCount={getActiveFilterCount()}
                />
              </div>
              {isEditing && onOpenAddWidget && (
                <div ref={registerAddWidgetTarget}>
                  <Button
                    className="journalit-dashboard-add-widget-button"
                    onClick={onOpenAddWidget}
                    variant="plain"
                    aria-label={t('dashboard.button.add-widget')}
                  >
                    <Plus size={16} />
                    <span>{t('dashboard.button.add-widget')}</span>
                  </Button>
                </div>
              )}
              {onToggleEditMode && (
                <div ref={registerEditLayoutTarget}>
                  <Button
                    className={`journalit-dashboard-edit-mode-button ${isEditing ? 'active' : ''}`}
                    onClick={onToggleEditMode}
                    variant="plain"
                    aria-label={
                      isEditing
                        ? t('dashboard.button.save-layout')
                        : t('dashboard.button.edit-layout')
                    }
                  >
                    {isEditing ? (
                      <Check size={16} />
                    ) : (
                      <Grid2x2Plus size={16} />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          
          <div className="journalit-dashboard-header">
            <div className="journalit-dashboard-primary-filters">
              <DateRangeFilter
                dateRange={filters.dateRange}
                onChange={handleDateRangeChange}
              />
            </div>

            <div className="journalit-dashboard-filter-actions">
              <div ref={registerFilterButtonTarget}>
                <FilterButton
                  onClick={() => void handleOpenFilterModal()}
                  activeFilterCount={getActiveFilterCount()}
                />
              </div>
              {isEditing && onOpenAddWidget && (
                <div ref={registerAddWidgetTarget}>
                  <Button
                    className="journalit-dashboard-add-widget-button"
                    onClick={onOpenAddWidget}
                    variant="plain"
                    aria-label={t('dashboard.button.add-widget')}
                  >
                    <Plus size={16} />
                    <span>{t('dashboard.button.add-widget')}</span>
                  </Button>
                </div>
              )}
              {onToggleEditMode && (
                <div ref={registerEditLayoutTarget}>
                  <Button
                    className={`journalit-dashboard-edit-mode-button ${isEditing ? 'active' : ''}`}
                    onClick={onToggleEditMode}
                    variant="plain"
                    aria-label={
                      isEditing
                        ? t('dashboard.button.save-layout')
                        : t('dashboard.button.edit-layout')
                    }
                  >
                    {isEditing ? (
                      <Check size={16} />
                    ) : (
                      <Grid2x2Plus size={16} />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FilterControls.displayName = 'FilterControls';
