

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
import { usePlugin } from '../../../../hooks/usePlugin';
import { useViewportThreshold } from '../../../../hooks/useResizeObserver';
import { Button } from '../../../../components/ui/Button';
import type { UnifiedFilters } from '../../../shared/filters/types';
import {
  FilterMenuButton,
  type LoadedFilterMenuOptions,
} from '../../../shared/filters/menu/FilterMenu';
import { loadTradeFilterMenuOptions } from '../../../shared/filters/menu/loadTradeFilterMenuOptions';
import {
  type CustomFieldDefinition,
  isDiscreteCustomFieldFilterable,
} from '../../../../types/customFields';
import { TradeLogService } from '../../../../services/tradelog/TradeLogService';
import { useDashboardData } from '../../context/DashboardDataContext';
import { useGuideTarget } from '../../../../guides/GuideRuntimeLayer';
import { useFilterMenuWhatsNewTour } from '../../../../guides/useFilterMenuWhatsNewTour';
import {
  DASHBOARD_ADD_WIDGET_BUTTON_TARGET_ID,
  DASHBOARD_EDIT_LAYOUT_BUTTON_TARGET_ID,
  DASHBOARD_FILTER_BUTTON_TARGET_ID,
} from '../../../../guides/dashboardGuideIds';
import {
  normalizeAccountLookupKey,
  normalizeTradeAccountIdentity,
} from '../../../../services/trade/core/TradeAccountIdentity';
import { sanitizeFilterCustomFields } from '../../../shared/filters/sanitizeCustomFieldFilters';






export const FilterControls = React.memo<FilterControlsProps>(
  ({
    filters,
    onFilterChange,
    isEditing = false,
    onToggleEditMode,
    onOpenAddWidget,
    modeToggle,
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
    const filterMenuWhatsNew = useFilterMenuWhatsNewTour();

    
    const isCompactView = useViewportThreshold(1300);

    const tradeLogServiceRef = useRef<TradeLogService | null>(null);

    useEffect(() => {
      if (plugin && !tradeLogServiceRef.current) {
        tradeLogServiceRef.current = new TradeLogService(plugin);
        tradeLogServiceRef.current.connect();
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

    
    
    const sanitizedFilters = useMemo(
      () => sanitizeFilterCustomFields(filters, discreteCustomFields),
      [filters, discreteCustomFields]
    );

    useEffect(() => {
      if (!plugin || sanitizedFilters === filters) {
        return;
      }

      onFilterChange(sanitizedFilters);
      void saveLastUsedFilters(plugin, sanitizedFilters);
    }, [plugin, filters, onFilterChange, sanitizedFilters]);

    
    const availableAccounts = useMemo(() => {
      if (!dashboardData?.trades) return [];
      const accountByLookupKey = new Map<string, string>();
      const accountSourceTrades = [
        ...dashboardData.trades,
        ...(dashboardData.unrealizedTrades ?? []),
      ];
      accountSourceTrades.forEach((trade) => {
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
      dashboardData?.unrealizedTrades,
      plugin?.settings?.backendIntegration?.accountMapping,
    ]);

    

    
    const handleDateRangeChange = useCallback(
      (dateRange: [Date | null, Date | null]) => {
        const mergedFilters = { ...sanitizedFilters, dateRange };
        onFilterChange(mergedFilters);

        
        if (plugin) {
          void saveLastUsedFilters(plugin, mergedFilters);
        }
      },
      [onFilterChange, plugin, sanitizedFilters]
    );

    const loadFilterMenuOptions =
      useCallback(async (): Promise<LoadedFilterMenuOptions> => {
        const tradeLogService = tradeLogServiceRef.current;
        if (!plugin || !tradeLogService) {
          return { accounts: availableAccounts };
        }
        
        return loadTradeFilterMenuOptions({
          plugin,
          tradeLogService,
          fallbackAccounts: availableAccounts,
          logPrefix: '[DashboardFilterControls]',
        });
      }, [availableAccounts, plugin]);

    const handleFilterMenuChange = useCallback(
      (menuFilters: UnifiedFilters) => {
        
        
        const mergedFilters = sanitizeFilterCustomFields(
          { ...filters, ...menuFilters },
          discreteCustomFields
        );
        onFilterChange(mergedFilters);
        if (plugin) {
          void saveLastUsedFilters(plugin, mergedFilters);
        }
      },
      [discreteCustomFields, filters, onFilterChange, plugin]
    );

    const filterMenuButton = plugin ? (
      <div ref={registerFilterButtonTarget}>
        <FilterMenuButton
          plugin={plugin}
          context="dashboard"
          filters={sanitizedFilters}
          onChange={handleFilterMenuChange}
          loadOptions={loadFilterMenuOptions}
          className="journalit-dashboard-filter-button"
          onOpenChange={filterMenuWhatsNew.onOpenChange}
          guideTour={filterMenuWhatsNew.guideTour}
        />
      </div>
    ) : null;

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
              {filterMenuButton}
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
              {modeToggle}
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
              {filterMenuButton}
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
              {modeToggle}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FilterControls.displayName = 'FilterControls';
