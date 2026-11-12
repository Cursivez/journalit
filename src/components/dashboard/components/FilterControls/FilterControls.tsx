

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Grid2x2Plus, Check, Plus } from '../../../shared/icons/ObsidianIcon';
import { t } from '../../../../lang/helpers';
import { DateRangeFilter, type DateRangeFilterValue } from './DateRangeFilter';
import { FilterControlsProps } from './types';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useViewportThreshold } from '../../../../hooks/useResizeObserver';
import { Button } from '../../../../components/ui/Button';
import type { UnifiedFilters } from '../../../shared/filters/types';
import type { LoadedFilterMenuOptions } from '../../../shared/filters/menu/FilterMenu';
import { CompareFilterControl } from '../../compare/CompareFilterControl';
import { useDashboardCompareControls } from '../../compare/DashboardCompareControls';
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





const EditLayoutButton: React.FC<{
  isEditing: boolean;
  onClick: () => void;
}> = ({ isEditing, onClick }) => (
  <Button
    className={`journalit-dashboard-edit-mode-button journalit-view-actions__save ${isEditing ? 'active' : ''}`}
    onClick={onClick}
    variant="plain"
    aria-label={
      isEditing
        ? t('dashboard.button.save-layout')
        : t('dashboard.button.edit-layout')
    }
  >
    {isEditing ? <Check size={16} /> : <Grid2x2Plus size={16} />}
  </Button>
);


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
    const compare = useDashboardCompareControls();
    const compareFilters = compare?.compareFilters ?? null;
    const onCompareFilterChange = compare?.onCompareFilterChange;
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
      if (sanitizedFilters === filters) {
        return;
      }

      onFilterChange(sanitizedFilters);
    }, [filters, onFilterChange, sanitizedFilters]);

    
    const sanitizedCompareFilters = useMemo(
      () =>
        compareFilters
          ? sanitizeFilterCustomFields(compareFilters, discreteCustomFields)
          : null,
      [compareFilters, discreteCustomFields]
    );

    useEffect(() => {
      if (
        !sanitizedCompareFilters ||
        sanitizedCompareFilters === compareFilters ||
        !onCompareFilterChange
      ) {
        return;
      }
      onCompareFilterChange(sanitizedCompareFilters);
    }, [compareFilters, onCompareFilterChange, sanitizedCompareFilters]);

    
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
            : normalizeTradeAccountIdentity(trade).accountNames;

        accountNames.forEach((accountName) => {
          const lookupKey = normalizeAccountLookupKey(accountName);
          if (!lookupKey || accountByLookupKey.has(lookupKey)) {
            return;
          }
          accountByLookupKey.set(lookupKey, accountName);
        });
      });
      return Array.from(accountByLookupKey.values()).sort();
    }, [dashboardData?.trades, dashboardData?.unrealizedTrades]);

    

    
    const handleDateRangeChange = useCallback(
      ({ dateRange, datePreset, recentPeriod }: DateRangeFilterValue) => {
        onFilterChange({
          ...sanitizedFilters,
          dateRange,
          datePreset,
          recentPeriod,
        });
      },
      [onFilterChange, sanitizedFilters]
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
      },
      [discreteCustomFields, filters, onFilterChange]
    );

    const handleCompareFilterMenuChange = useCallback(
      (menuFilters: UnifiedFilters) => {
        if (!compareFilters || !onCompareFilterChange) return;
        onCompareFilterChange(
          sanitizeFilterCustomFields(
            { ...compareFilters, ...menuFilters },
            discreteCustomFields
          )
        );
      },
      [compareFilters, discreteCustomFields, onCompareFilterChange]
    );

    const filterMenuButton = plugin ? (
      <div ref={registerFilterButtonTarget}>
        <CompareFilterControl
          plugin={plugin}
          filters={sanitizedFilters}
          onFilterMenuChange={handleFilterMenuChange}
          compareFilters={sanitizedCompareFilters}
          onCompareFilterMenuChange={handleCompareFilterMenuChange}
          compare={compare}
          loadOptions={loadFilterMenuOptions}
          onOpenChange={filterMenuWhatsNew.onOpenChange}
          guideTour={filterMenuWhatsNew.guideTour}
        />
      </div>
    ) : null;

    return (
      <div
        className={`journalit-dashboard-filter-controls ${isCompactView ? 'compact-view' : ''}`}
      >
        <div
          className={
            isCompactView
              ? 'journalit-dashboard-header-compact'
              : 'journalit-dashboard-header'
          }
        >
          <div className="journalit-dashboard-primary-filters">
            <DateRangeFilter
              dateRange={filters.dateRange}
              datePreset={filters.datePreset}
              recentPeriod={filters.recentPeriod}
              onChange={handleDateRangeChange}
            />
          </div>

          <div
            className={`journalit-dashboard-filter-actions journalit-view-actions${isEditing ? ' is-editing-layout' : ''}`}
          >
            {filterMenuButton}
            {isEditing && onOpenAddWidget && (
              <div
                className="journalit-view-actions__tool"
                ref={registerAddWidgetTarget}
              >
                <Button
                  className="journalit-dashboard-add-widget-button"
                  onClick={onOpenAddWidget}
                  variant="plain"
                  aria-label={t('dashboard.button.add-widget')}
                >
                  <Plus size={16} />
                  {t('dashboard.button.add-widget')}
                </Button>
              </div>
            )}
            {onToggleEditMode && (
              <div
                className="journalit-view-actions__save-slot"
                ref={registerEditLayoutTarget}
              >
                <EditLayoutButton
                  isEditing={isEditing}
                  onClick={onToggleEditMode}
                />
              </div>
            )}
            {modeToggle}
          </div>
        </div>
      </div>
    );
  }
);

FilterControls.displayName = 'FilterControls';
