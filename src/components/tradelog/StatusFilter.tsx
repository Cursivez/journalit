

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { TradeStatus } from '../../services/tradelog/types';
import { t } from '../../lang/helpers';

interface StatusFilterProps {
  selectedStatuses: TradeStatus[];
  onChange: (statuses: TradeStatus[]) => void;
}

const CLOSED_STATUSES: TradeStatus[] = ['win', 'loss', 'breakeven'];
const ALL_SELECTABLE_STATUSES: TradeStatus[] = ['open', ...CLOSED_STATUSES];

const getStatusOptions = (): Array<{
  value: TradeStatus;
  label: string;
  description: string;
}> => [
  {
    value: 'all',
    label: t('tradelog.filter.all'),
    description: t('tradelog.filter.all.desc'),
  },
  {
    value: 'open',
    label: t('tradelog.filter.open'),
    description: t('tradelog.filter.open.desc'),
  },
  {
    value: 'closed',
    label: t('tradelog.filter.closed'),
    description: t('tradelog.filter.closed.desc'),
  },
  {
    value: 'win',
    label: t('tradelog.filter.winners'),
    description: t('tradelog.filter.winners.desc'),
  },
  {
    value: 'loss',
    label: t('tradelog.filter.losers'),
    description: t('tradelog.filter.losers.desc'),
  },
  {
    value: 'breakeven',
    label: t('tradelog.filter.breakeven'),
    description: t('tradelog.filter.breakeven.desc'),
  },
];


export const StatusFilter: React.FC<StatusFilterProps> = React.memo(
  ({ selectedStatuses, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          event.target instanceof Node &&
          !dropdownRef.current.contains(event.target)
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

    
    const handleStatusChange = useCallback(
      (status: TradeStatus) => {
        if (status === 'all') {
          
          if (selectedStatuses.length === 4) {
            
            onChange([]);
          } else {
            
            onChange(ALL_SELECTABLE_STATUSES);
          }
        } else if (status === 'closed') {
          
          const hasAllClosed = CLOSED_STATUSES.every((s) =>
            selectedStatuses.includes(s)
          );

          if (hasAllClosed) {
            
            onChange(
              selectedStatuses.filter((s) => !CLOSED_STATUSES.includes(s))
            );
          } else {
            
            const newStatuses = [
              ...new Set([
                ...selectedStatuses.filter((s) => s !== 'closed'),
                ...CLOSED_STATUSES,
              ]),
            ];
            onChange(newStatuses);
          }
        } else {
          
          if (selectedStatuses.includes(status)) {
            onChange(selectedStatuses.filter((s) => s !== status));
          } else {
            onChange([
              ...selectedStatuses.filter((s) => s !== 'closed'),
              status,
            ]);
          }
        }
      },
      [selectedStatuses, onChange]
    );

    
    const statusSummary = useMemo(() => {
      if (selectedStatuses.length === 0) return t('tradelog.filter.all');
      if (selectedStatuses.length === 4) return t('tradelog.filter.all'); 
      if (selectedStatuses.length === 1) {
        const selectedOption = getStatusOptions().find(
          (opt) => opt.value === selectedStatuses[0]
        );
        return selectedOption?.label || selectedStatuses[0];
      }

      
      const hasAllClosed = CLOSED_STATUSES.every((s) =>
        selectedStatuses.includes(s)
      );
      if (hasAllClosed && selectedStatuses.length === 3) {
        return t('tradelog.filter.closed');
      }

      return `${selectedStatuses.length} ${t('common.statuses')}`;
    }, [selectedStatuses]);

    
    const allStatusesSelected = selectedStatuses.length === 4; 

    
    const closedSelected = CLOSED_STATUSES.every((s) =>
      selectedStatuses.includes(s)
    );

    
    const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        action();
      }
    };

    return (
      <div className="journalit-tradelog-status-filter" ref={dropdownRef}>
        <div className="journalit-tradelog-status-dropdown">
          <div
            className="journalit-tradelog-status-summary"
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={toggleDropdown}
            onKeyDown={(e) => handleKeyDown(e, toggleDropdown)}
          >
            {statusSummary}
            <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
          </div>

          {isOpen && (
            <div className="journalit-tradelog-status-options-dropdown">
              <div
                className="journalit-tradelog-status-option-item select-all"
                onClick={() => handleStatusChange('all')}
                role="checkbox"
                tabIndex={0}
                aria-checked={allStatusesSelected}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => handleStatusChange('all'))
                }
              >
                <span
                  className={`journalit-tradelog-checkbox journalit-tradelog-status-checkbox${
                    allStatusesSelected ? ' checked' : ''
                  }`}
                  aria-hidden="true"
                >
                  {allStatusesSelected ? '✓' : ''}
                </span>
                <span>{t('common.select-all')}</span>
              </div>

              <div className="journalit-tradelog-status-divider"></div>

              {getStatusOptions()
                .slice(1)
                .map((option) => {
                  if (option.value === 'closed') {
                    
                    return (
                      <div
                        key={option.value}
                        className="journalit-tradelog-status-option-item"
                        onClick={() => handleStatusChange(option.value)}
                        aria-description={option.description}
                        role="checkbox"
                        tabIndex={0}
                        aria-checked={closedSelected}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () =>
                            handleStatusChange(option.value)
                          )
                        }
                      >
                        <span
                          className={`journalit-tradelog-checkbox journalit-tradelog-status-checkbox${
                            closedSelected ? ' checked' : ''
                          }`}
                          aria-hidden="true"
                        >
                          {closedSelected ? '✓' : ''}
                        </span>
                        <span>{option.label}</span>
                      </div>
                    );
                  } else if (
                    ['win', 'loss', 'breakeven'].includes(option.value)
                  ) {
                    
                    return (
                      <div
                        key={option.value}
                        className="journalit-tradelog-status-option-item sub-option"
                        onClick={() => handleStatusChange(option.value)}
                        aria-description={option.description}
                        role="checkbox"
                        tabIndex={0}
                        aria-checked={selectedStatuses.includes(option.value)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () =>
                            handleStatusChange(option.value)
                          )
                        }
                      >
                        <span
                          className={`journalit-tradelog-checkbox journalit-tradelog-status-checkbox${
                            selectedStatuses.includes(option.value)
                              ? ' checked'
                              : ''
                          }`}
                          aria-hidden="true"
                        >
                          {selectedStatuses.includes(option.value) ? '✓' : ''}
                        </span>
                        <span>{option.label}</span>
                      </div>
                    );
                  } else {
                    
                    return (
                      <div
                        key={option.value}
                        className="journalit-tradelog-status-option-item"
                        onClick={() => handleStatusChange(option.value)}
                        aria-description={option.description}
                        role="checkbox"
                        tabIndex={0}
                        aria-checked={selectedStatuses.includes(option.value)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () =>
                            handleStatusChange(option.value)
                          )
                        }
                      >
                        <span
                          className={`journalit-tradelog-checkbox journalit-tradelog-status-checkbox${
                            selectedStatuses.includes(option.value)
                              ? ' checked'
                              : ''
                          }`}
                          aria-hidden="true"
                        >
                          {selectedStatuses.includes(option.value) ? '✓' : ''}
                        </span>
                        <span>{option.label}</span>
                      </div>
                    );
                  }
                })}
            </div>
          )}
        </div>
      </div>
    );
  }
);

StatusFilter.displayName = 'StatusFilter';
