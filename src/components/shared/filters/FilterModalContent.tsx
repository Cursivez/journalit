

import React, { useState, useCallback, useMemo } from 'react';
import { hasTranslation, t } from '../../../lang/helpers';
import { Button } from '../../ui/Button';
import { AccountFilter } from '../../dashboard/components/FilterControls/AccountFilter';
import { TickerFilter } from '../../dashboard/components/FilterControls/TickerFilter';
import { SetupFilter } from '../../dashboard/components/FilterControls/SetupFilter';
import { TagFilter } from '../../dashboard/components/FilterControls/TagFilter';
import { MistakeFilter } from '../../dashboard/components/FilterControls/MistakeFilter';
import { TradeTypeFilter } from '../../tradelog/TradeTypeFilter';
import { StatusFilter } from '../../tradelog/StatusFilter';
import { ReviewStatusFilter } from '../../tradelog/ReviewStatusFilter';
import { DirectionFilter } from '../../tradelog/DirectionFilter';
import { FilterChip } from '../FilterChip';
import { CollapsibleSection } from '../CollapsibleSection';
import {
  UnifiedFilters,
  FilterModalProps,
  AvailableCustomFieldFilter,
} from './types';
import {
  TradeType,
  TradeStatus,
  type DirectionFilter as DirectionFilterValue,
  type ReviewStatusFilter as ReviewStatusFilterValue,
} from '../../../services/tradelog/types';
import { CustomFieldOptionsFilter } from './CustomFieldOptionsFilter';
import {
  createDashboardFilters,
  createReviewFilters,
  createTradeLogFilters,
  getActiveTradeTypeSelection,
  getTradeTypeFilterActiveCount,
  normalizeDashboardTradeTypes,
  normalizeReviewFilters,
  normalizeTradeLogTradeTypes,
} from '../../../settings/viewFiltersDefaults';

interface FilterModalContentProps extends FilterModalProps {
  onModalClose: () => void;
}

export function mergeRenderableCustomFieldFilters(
  availableCustomFieldFilters: AvailableCustomFieldFilter[],
  customFieldFilters: UnifiedFilters['customFieldFilters']
): AvailableCustomFieldFilter[] {
  const optionMaps = new Map<string, Map<string, string>>(
    availableCustomFieldFilters.map((definition) => [
      definition.field.id,
      new Map(definition.options.map((option) => [option.value, option.label])),
    ])
  );

  return availableCustomFieldFilters
    .map((definition) => {
      const selectedValues = customFieldFilters?.[definition.field.id] || [];
      const options = [...definition.options];
      const seen = new Set(options.map((option) => option.value));
      const labelMap =
        optionMaps.get(definition.field.id) ?? new Map<string, string>();

      selectedValues.forEach((value) => {
        if (!seen.has(value)) {
          seen.add(value);
          options.push({ value, label: labelMap.get(value) || value });
        }
      });

      return {
        ...definition,
        options,
      } satisfies AvailableCustomFieldFilter;
    })
    .filter(
      (definition) =>
        definition.options.length > 0 ||
        (customFieldFilters?.[definition.field.id] || []).length > 0
    );
}


export const FilterModalContent = React.memo<FilterModalContentProps>(
  ({
    plugin,
    context,
    currentFilters,
    onApply,
    onModalClose,
    availableAccounts = [],
    availableCustomFieldFilters = [],
  }) => {
    
    const [filters, setFilters] = useState<UnifiedFilters>(currentFilters);

    const defaultTradeTypes = useMemo(() => {
      if (context === 'tradelog') {
        return createTradeLogFilters().tradeTypes;
      }

      if (context === 'review') {
        return createReviewFilters().tradeTypes;
      }

      return createDashboardFilters().tradeTypes;
    }, [context]);

    const availableTradeTypes = useMemo(() => {
      if (context === 'tradelog') {
        return ['regular', 'missed', 'backtest'] as TradeType[];
      }

      return ['regular', 'backtest'] as TradeType[];
    }, [context]);

    
    const handleAccountChange = useCallback((accounts: string[]) => {
      setFilters((prev) => ({ ...prev, accounts }));
    }, []);

    const handleTickerChange = useCallback((tickers: string[]) => {
      setFilters((prev) => ({ ...prev, tickers }));
    }, []);

    const handleSetupChange = useCallback((setups: string[]) => {
      setFilters((prev) => ({ ...prev, setups }));
    }, []);

    const handleTagChange = useCallback((tags: string[]) => {
      setFilters((prev) => ({ ...prev, tags }));
    }, []);

    const handleMistakeChange = useCallback((mistakes: string[]) => {
      setFilters((prev) => ({ ...prev, mistakes }));
    }, []);

    const handleTradeTypeChange = useCallback((tradeTypes: TradeType[]) => {
      setFilters((prev) => ({ ...prev, tradeTypes }));
    }, []);

    const handleStatusChange = useCallback((statuses: TradeStatus[]) => {
      setFilters((prev) => ({ ...prev, statuses }));
    }, []);

    const handleReviewStatusChange = useCallback(
      (reviewStatus: ReviewStatusFilterValue[]) => {
        setFilters((prev) => ({ ...prev, reviewStatus }));
      },
      []
    );

    const handleDirectionChange = useCallback(
      (directions: DirectionFilterValue[]) => {
        setFilters((prev) => ({ ...prev, directions }));
      },
      []
    );

    const handleCustomFieldChange = useCallback(
      (fieldId: string, values: string[]) => {
        setFilters((prev) => {
          const nextCustomFieldFilters = { ...(prev.customFieldFilters || {}) };
          if (values.length === 0) {
            delete nextCustomFieldFilters[fieldId];
          } else {
            nextCustomFieldFilters[fieldId] = values;
          }

          return {
            ...prev,
            customFieldFilters: nextCustomFieldFilters,
          };
        });
      },
      []
    );

    
    const handleReset = useCallback(() => {
      const resetTradeTypes =
        context === 'tradelog'
          ? normalizeTradeLogTradeTypes([])
          : context === 'review'
            ? normalizeReviewFilters({ tradeTypes: [] }).tradeTypes
            : normalizeDashboardTradeTypes([]);

      setFilters({
        accounts: [],
        tickers: [],
        setups: [],
        tags: [],
        mistakes: [],
        tradeTypes: resetTradeTypes,
        statuses: [],
        reviewStatus: [],
        directions: [],
        customFieldFilters: {},
      });
    }, [context]);

    
    const handleApply = useCallback(() => {
      const normalizedTradeTypes =
        context === 'tradelog'
          ? normalizeTradeLogTradeTypes(filters.tradeTypes)
          : context === 'review'
            ? normalizeReviewFilters({ tradeTypes: filters.tradeTypes })
                .tradeTypes
            : normalizeDashboardTradeTypes(filters.tradeTypes);

      void onApply({
        ...filters,
        tradeTypes: normalizedTradeTypes,
      });
      onModalClose();
    }, [context, filters, onApply, onModalClose]);

    
    const handleCancel = useCallback(() => {
      onModalClose();
    }, [onModalClose]);

    const mergedCustomFieldFilters = useMemo(
      () =>
        mergeRenderableCustomFieldFilters(
          availableCustomFieldFilters,
          filters.customFieldFilters
        ),
      [availableCustomFieldFilters, filters.customFieldFilters]
    );

    
    const activeFilterChips = useMemo(() => {
      const chips: Array<{ key: string; label: string; onRemove: () => void }> =
        [];

      
      if (filters.accounts.length > 0) {
        filters.accounts.forEach((account) => {
          chips.push({
            key: `account-${account}`,
            label: account,
            onRemove: () => {
              setFilters((prev) => ({
                ...prev,
                accounts: prev.accounts.filter((a) => a !== account),
              }));
            },
          });
        });
      }

      
      if (filters.tickers.length > 0) {
        filters.tickers.forEach((ticker) => {
          chips.push({
            key: `ticker-${ticker}`,
            label: ticker,
            onRemove: () => {
              setFilters((prev) => ({
                ...prev,
                tickers: prev.tickers.filter((t) => t !== ticker),
              }));
            },
          });
        });
      }

      
      if (filters.setups.length > 0) {
        filters.setups.forEach((setup) => {
          chips.push({
            key: `setup-${setup}`,
            label:
              setup === '__NO_SETUP__' ? t('filter.modal.no-setup') : setup,
            onRemove: () => {
              setFilters((prev) => ({
                ...prev,
                setups: prev.setups.filter((s) => s !== setup),
              }));
            },
          });
        });
      }

      
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach((tag) => {
          chips.push({
            key: `tag-${tag}`,
            label: tag === '__NO_TAGS__' ? t('filter.modal.no-tags') : tag,
            onRemove: () => {
              setFilters((prev) => ({
                ...prev,
                tags: prev.tags ? prev.tags.filter((t) => t !== tag) : [],
              }));
            },
          });
        });
      }

      
      if (filters.mistakes && filters.mistakes.length > 0) {
        filters.mistakes.forEach((mistake) => {
          chips.push({
            key: `mistake-${mistake}`,
            label:
              mistake === '__NO_MISTAKES__'
                ? t('filter.modal.no-mistakes')
                : mistake,
            onRemove: () => {
              setFilters((prev) => ({
                ...prev,
                mistakes: prev.mistakes
                  ? prev.mistakes.filter((m) => m !== mistake)
                  : [],
              }));
            },
          });
        });
      }

      
      const activeTradeTypes = getActiveTradeTypeSelection(
        filters.tradeTypes,
        defaultTradeTypes
      );
      if (activeTradeTypes.length > 0) {
        activeTradeTypes.forEach((type) => {
          const key = `filter.modal.type.${type}`;

          chips.push({
            key: `tradetype-${type}`,
            label: hasTranslation(key) ? t(key) : key,
            onRemove: () => {
              setFilters((prev) => ({
                ...prev,
                tradeTypes: prev.tradeTypes.filter((t) => t !== type),
              }));
            },
          });
        });
      }

      
      if (filters.statuses.length > 0) {
        filters.statuses.forEach((status) => {
          const key = `filter.modal.status.${status}`;

          chips.push({
            key: `status-${status}`,
            label: hasTranslation(key) ? t(key) : key,
            onRemove: () => {
              setFilters((prev) => ({
                ...prev,
                statuses: prev.statuses.filter((s) => s !== status),
              }));
            },
          });
        });
      }

      if (context === 'tradelog' && filters.reviewStatus.length > 0) {
        filters.reviewStatus.forEach((status) => {
          chips.push({
            key: `review-status-${status}`,
            label:
              status === 'reviewed'
                ? t('filter.modal.review-status.reviewed')
                : t('filter.modal.review-status.unreviewed'),
            onRemove: () => {
              setFilters((prev) => ({
                ...prev,
                reviewStatus: prev.reviewStatus.filter((s) => s !== status),
              }));
            },
          });
        });
      }

      if (filters.directions.length > 0) {
        filters.directions.forEach((direction) => {
          chips.push({
            key: `direction-${direction}`,
            label:
              direction === 'long'
                ? t('filter.modal.direction.long-call')
                : t('filter.modal.direction.short-put'),
            onRemove: () => {
              setFilters((prev) => ({
                ...prev,
                directions: prev.directions.filter(
                  (current) => current !== direction
                ),
              }));
            },
          });
        });
      }

      
      const customFieldOptionMaps = new Map<string, Map<string, string>>(
        mergedCustomFieldFilters.map((definition) => [
          definition.field.id,
          new Map(
            definition.options.map((option) => [option.value, option.label])
          ),
        ])
      );

      Object.entries(filters.customFieldFilters || {}).forEach(
        ([fieldId, values]) => {
          if (!Array.isArray(values) || values.length === 0) {
            return;
          }

          const fieldDefinition = mergedCustomFieldFilters.find(
            (definition) => definition.field.id === fieldId
          );
          if (!fieldDefinition) {
            return;
          }

          const optionLabels = customFieldOptionMaps.get(fieldId) || new Map();
          const fieldLabel =
            fieldDefinition.field.tradeLog?.columnLabel ||
            fieldDefinition.field.label;

          values.forEach((value) => {
            chips.push({
              key: `custom-field-${fieldId}-${value}`,
              label: `${fieldLabel}: ${optionLabels.get(value) || value}`,
              onRemove: () => {
                setFilters((prev) => {
                  const nextCustomFieldFilters = {
                    ...(prev.customFieldFilters || {}),
                  };
                  const nextValues = (
                    nextCustomFieldFilters[fieldId] || []
                  ).filter((selectedValue) => selectedValue !== value);

                  if (nextValues.length === 0) {
                    delete nextCustomFieldFilters[fieldId];
                  } else {
                    nextCustomFieldFilters[fieldId] = nextValues;
                  }

                  return {
                    ...prev,
                    customFieldFilters: nextCustomFieldFilters,
                  };
                });
              },
            });
          });
        }
      );

      return chips;
    }, [context, defaultTradeTypes, filters, mergedCustomFieldFilters]);

    
    const tradingDataBadgeCount =
      filters.accounts.length + filters.tickers.length;

    const classificationBadgeCount = useMemo(() => {
      return (
        filters.setups.length +
        (filters.tags?.length || 0) +
        (filters.mistakes?.length || 0)
      );
    }, [filters.setups, filters.tags, filters.mistakes]);

    const tradeCriteriaBadgeCount = useMemo(() => {
      return (
        getTradeTypeFilterActiveCount(filters.tradeTypes, defaultTradeTypes) +
        filters.statuses.length +
        (context === 'tradelog' ? filters.reviewStatus.length : 0) +
        filters.directions.length
      );
    }, [
      context,
      defaultTradeTypes,
      filters.tradeTypes,
      filters.statuses.length,
      filters.reviewStatus.length,
      filters.directions.length,
    ]);

    const customFieldsBadgeCount = useMemo(() => {
      return Object.values(filters.customFieldFilters || {}).filter(
        (values) => values.length > 0
      ).length;
    }, [filters.customFieldFilters]);

    return (
      <>
        <div className="filter-modal-scroll-area">
          
          <div className="filter-modal-active-filters">
            <div className="filter-modal-active-filters-header">
              <span className="filter-modal-active-filters-label">
                {activeFilterChips.length > 0
                  ? t('filter.modal.active-filters', {
                      count: activeFilterChips.length.toString(),
                    })
                  : t('filter.modal.no-active-filters')}
              </span>
              {activeFilterChips.length > 0 && (
                <button
                  className="filter-modal-clear-all"
                  onClick={handleReset}
                  type="button"
                >
                  {t('filter.modal.clear-all')}
                </button>
              )}
            </div>
            {activeFilterChips.length > 0 && (
              <div className="filter-modal-chips">
                {activeFilterChips.map((chip) => (
                  <FilterChip
                    key={chip.key}
                    label={chip.label}
                    onRemove={chip.onRemove}
                  />
                ))}
              </div>
            )}
          </div>

          
          <div className="filter-modal-sections">
            
            <CollapsibleSection
              title={t('filter.modal.section.trading-data')}
              badge={tradingDataBadgeCount}
              defaultOpen={true}
            >
              <div className="filter-modal-section-grid-2col">
                <div className="filter-modal-controls">
                  <AccountFilter
                    accounts={availableAccounts}
                    selectedAccounts={filters.accounts}
                    onChange={handleAccountChange}
                    useOnlyProvidedAccounts={false}
                  />
                </div>
                <div className="filter-modal-controls">
                  <TickerFilter
                    tickers={filters.tickers}
                    selectedTickers={filters.tickers}
                    onChange={handleTickerChange}
                  />
                </div>
              </div>
            </CollapsibleSection>

            
            <CollapsibleSection
              title={t('filter.modal.section.classification')}
              badge={classificationBadgeCount}
              defaultOpen={true}
            >
              <div className="filter-modal-section-grid-3col-auto">
                <div className="filter-modal-controls">
                  {plugin.optionsService && (
                    <SetupFilter
                      selected={filters.setups}
                      onChange={handleSetupChange}
                      optionsService={plugin.optionsService}
                    />
                  )}
                </div>
                <div className="filter-modal-controls">
                  {plugin.optionsService && (
                    <TagFilter
                      tags={[]}
                      selectedTags={filters.tags || []}
                      onChange={handleTagChange}
                    />
                  )}
                </div>
                <div className="filter-modal-controls">
                  {plugin.optionsService && (
                    <MistakeFilter
                      mistakes={[]}
                      selectedMistakes={filters.mistakes || []}
                      onChange={handleMistakeChange}
                    />
                  )}
                </div>
              </div>
            </CollapsibleSection>

            
            <CollapsibleSection
              title={t('filter.modal.section.trade-criteria')}
              badge={tradeCriteriaBadgeCount}
              defaultOpen={true}
            >
              <div className="filter-modal-section-grid-3col">
                <div className="filter-modal-controls">
                  <TradeTypeFilter
                    selectedTradeTypes={filters.tradeTypes}
                    defaultTradeTypes={defaultTradeTypes}
                    availableTradeTypes={availableTradeTypes}
                    showImplicitDefaultAsChecked={context !== 'tradelog'}
                    onChange={handleTradeTypeChange}
                  />
                </div>
                <div className="filter-modal-controls">
                  <StatusFilter
                    selectedStatuses={filters.statuses}
                    onChange={handleStatusChange}
                  />
                </div>
                <div className="filter-modal-controls">
                  <DirectionFilter
                    selectedDirections={filters.directions}
                    onChange={handleDirectionChange}
                  />
                </div>
                {context === 'tradelog' && (
                  <>
                    <div className="filter-modal-controls">
                      <ReviewStatusFilter
                        selectedReviewStatus={filters.reviewStatus}
                        onChange={handleReviewStatusChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </CollapsibleSection>

            {mergedCustomFieldFilters.length > 0 && (
              <CollapsibleSection
                title={t('filter.modal.section.custom-fields')}
                badge={customFieldsBadgeCount}
                defaultOpen={true}
              >
                <div className="filter-modal-section-grid-3col-auto">
                  {mergedCustomFieldFilters.map((definition) => (
                    <div
                      key={definition.field.id}
                      className="filter-modal-controls"
                    >
                      <CustomFieldOptionsFilter
                        label={
                          definition.field.tradeLog?.columnLabel ||
                          definition.field.label
                        }
                        options={definition.options}
                        selectedValues={
                          filters.customFieldFilters?.[definition.field.id] ||
                          []
                        }
                        onChange={(values) =>
                          handleCustomFieldChange(definition.field.id, values)
                        }
                      />
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}
          </div>
        </div>

        <div className="filter-modal-buttons">
          <Button variant="secondary" onClick={handleCancel}>
            {t('button.cancel')}
          </Button>
          <Button variant="primary" onClick={handleApply}>
            {t('button.apply')}
          </Button>
        </div>
      </>
    );
  }
);

FilterModalContent.displayName = 'FilterModalContent';
