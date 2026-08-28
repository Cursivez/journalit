

import React from 'react';
import type { NewsEventImpact } from '../../services/weekly/types';
import { t } from '../../lang/helpers';
import { useGuideTarget } from '../../guides/GuideRuntimeLayer';
import { ECONOMIC_CALENDAR_FILTERS_TARGET_ID } from '../../guides/economicCalendarGuideIds';
import { getImpactLabel } from './EconomicCalendarEventRow';

interface EconomicCalendarFiltersProps {
  currencies: readonly string[];
  selectedCurrencies: ReadonlySet<string>;
  onToggleCurrency: (currency: string) => void;
  impacts: readonly NewsEventImpact[];
  selectedImpacts: ReadonlySet<NewsEventImpact>;
  onToggleImpact: (impact: NewsEventImpact) => void;
  selectAllChecked: boolean;
  selectAllDisabled: boolean;
  onToggleSelectAll: () => void;
}

export const EconomicCalendarFilters: React.FC<
  EconomicCalendarFiltersProps
> = ({
  currencies,
  selectedCurrencies,
  onToggleCurrency,
  impacts,
  selectedImpacts,
  onToggleImpact,
  selectAllChecked,
  selectAllDisabled,
  onToggleSelectAll,
}) => {
  const registerFiltersTarget = useGuideTarget(
    ECONOMIC_CALENDAR_FILTERS_TARGET_ID
  );

  return (
    <div className="journalit-econ-filters">
      <div
        className="journalit-econ-filter-controls"
        ref={registerFiltersTarget}
      >
        {currencies.length > 0 && (
          <div className="journalit-econ-filter-group">
            <span className="journalit-econ-filter-group__label">
              {t('view.economic-calendar.filter.currency')}
            </span>
            <div className="journalit-econ-chips">
              {currencies.map((currency) => (
                <button
                  key={currency}
                  type="button"
                  className="journalit-econ-chip"
                  aria-pressed={selectedCurrencies.has(currency)}
                  onClick={() => onToggleCurrency(currency)}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="journalit-econ-filter-group">
          <span className="journalit-econ-filter-group__label">
            {t('view.economic-calendar.filter.impact')}
          </span>
          <div className="journalit-econ-chips">
            {impacts.map((impact) => (
              <button
                key={impact}
                type="button"
                className={`journalit-econ-chip journalit-econ-chip--impact-${impact}`}
                aria-pressed={selectedImpacts.has(impact)}
                onClick={() => onToggleImpact(impact)}
              >
                <span
                  className={`journalit-econ-impact journalit-econ-impact--${impact}`}
                  aria-hidden="true"
                />
                {getImpactLabel(impact)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <label
        className={`journalit-econ-select-all${
          selectAllDisabled ? ' journalit-econ-select-all--disabled' : ''
        }`}
        aria-disabled={selectAllDisabled}
      >
        <input
          type="checkbox"
          checked={selectAllChecked}
          disabled={selectAllDisabled}
          onChange={onToggleSelectAll}
        />
        {t('view.economic-calendar.select-all')}
      </label>
    </div>
  );
};

EconomicCalendarFilters.displayName = 'EconomicCalendarFilters';
