

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { OptionType } from '../../../../services/options/CustomOptionsService';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useEventBus } from '../../../../hooks';
import { t } from '../../../../lang/helpers';


interface TickerFilterProps {
  
  tickers: string[];

  
  selectedTickers: string[];

  
  onChange: (tickers: string[]) => void;
}


export const TickerFilter: React.FC<TickerFilterProps> = React.memo(
  ({ tickers, selectedTickers, onChange }) => {
    const plugin = usePlugin();
    const [customTickers, setCustomTickers] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
      if (plugin && plugin.optionsService) {
        
        const optionsTickers = plugin.optionsService.getOptions(
          OptionType.INSTRUMENT
        );
        setCustomTickers(optionsTickers);
      }
    }, [plugin]);

    
    useEventBus('options:changed', () => {
      if (plugin && plugin.optionsService) {
        const updatedTickers = plugin.optionsService.getOptions(
          OptionType.INSTRUMENT
        );
        setCustomTickers(updatedTickers);
      }
    });

    
    const combinedTickers = useMemo(() => {
      return [...new Set([...customTickers, ...tickers])]; 
    }, [tickers, customTickers]);

    
    const hasTickers = combinedTickers.length > 0;

    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target;
        if (
          dropdownRef.current &&
          (!(target instanceof Node) || !dropdownRef.current.contains(target))
        ) {
          setIsOpen(false);
        }
      };

      window.activeDocument.addEventListener('mousedown', handleClickOutside);
      return () => {
        window.activeDocument.removeEventListener(
          'mousedown',
          handleClickOutside
        );
      };
    }, []);

    
    const handleTickerChange = useCallback(
      (tickerId: string) => {
        if (tickerId === 'select-all') {
          
          if (selectedTickers.length === combinedTickers.length) {
            onChange([]);
          } else {
            onChange([...combinedTickers]);
          }
        } else {
          
          if (selectedTickers.includes(tickerId)) {
            onChange(selectedTickers.filter((t) => t !== tickerId));
          } else {
            onChange([...selectedTickers, tickerId]);
          }
        }
      },
      [selectedTickers, combinedTickers, onChange]
    );

    
    const tickerSummary = useMemo(() => {
      if (selectedTickers.length === 0)
        return t('dashboard.filter.tickers.all');
      if (selectedTickers.length === combinedTickers.length)
        return t('dashboard.filter.tickers.all');
      if (selectedTickers.length === 1) return selectedTickers[0];
      return t('dashboard.filter.tickers.n-selected', {
        count: selectedTickers.length.toString(),
      });
    }, [selectedTickers, combinedTickers]);

    
    const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

    
    const handleSelectAllClick = useCallback(
      () => handleTickerChange('select-all'),
      [handleTickerChange]
    );

    
    const getTickerClickHandler = useCallback(
      (ticker: string) => {
        return () => handleTickerChange(ticker);
      },
      [handleTickerChange]
    );

    return (
      <div
        className="journalit-dashboard-ticker-filter journalit-responsive-ticker-filter"
        ref={dropdownRef}
      >
        <div className="journalit-dashboard-ticker-dropdown">
          <div
            className="journalit-dashboard-ticker-summary"
            onClick={toggleDropdown}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
              }
            }}
          >
            <span className="journalit-dashboard-summary-text">
              {tickerSummary}
            </span>
            <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
          </div>

          {isOpen && (
            <div className="journalit-dashboard-ticker-options-dropdown">
              {hasTickers ? (
                <>
                  <div
                    className="journalit-dashboard-ticker-option-item select-all"
                    onClick={handleSelectAllClick}
                    role="checkbox"
                    aria-checked={
                      selectedTickers.length === combinedTickers.length
                    }
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectAllClick();
                      }
                    }}
                  >
                    <span
                      className={`journalit-dashboard-ticker-checkbox${selectedTickers.length === combinedTickers.length ? ' checked' : ''}`}
                      aria-hidden="true"
                    >
                      {selectedTickers.length === combinedTickers.length
                        ? '✓'
                        : ''}
                    </span>
                    <span>{t('dashboard.filter.tickers.select-all')}</span>
                  </div>
                  <div className="journalit-dashboard-ticker-divider"></div>
                  {combinedTickers.map((ticker) => (
                    <div
                      key={ticker}
                      className="journalit-dashboard-ticker-option-item"
                      onClick={getTickerClickHandler(ticker)}
                      role="checkbox"
                      aria-checked={selectedTickers.includes(ticker)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleTickerChange(ticker);
                        }
                      }}
                    >
                      <span
                        className={`journalit-dashboard-ticker-checkbox${selectedTickers.includes(ticker) ? ' checked' : ''}`}
                        aria-hidden="true"
                      >
                        {selectedTickers.includes(ticker) ? '✓' : ''}
                      </span>
                      <span>{ticker}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="journalit-dashboard-no-tickers">
                  {t('dashboard.filter.tickers.none-found')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TickerFilter.displayName = 'TickerFilter';
