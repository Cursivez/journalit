

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { t } from '../../../../lang/helpers';
import { AccountFilterProps } from './types';


export const AccountFilter: React.FC<AccountFilterProps> = React.memo(
  ({ accounts, selectedAccounts, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    
    const combinedAccounts = useMemo(() => {
      return [...new Set([...accounts, ...selectedAccounts])];
    }, [accounts, selectedAccounts]);

    
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

    
    const handleAccountChange = useCallback(
      (accountId: string) => {
        if (accountId === 'select-all') {
          
          if (selectedAccounts.length === combinedAccounts.length) {
            onChange([]);
          } else {
            onChange([...combinedAccounts]);
          }
        } else {
          
          if (selectedAccounts.includes(accountId)) {
            onChange(selectedAccounts.filter((a) => a !== accountId));
          } else {
            onChange([...selectedAccounts, accountId]);
          }
        }
      },
      [selectedAccounts, combinedAccounts, onChange]
    );

    
    const accountSummary = useMemo(() => {
      if (selectedAccounts.length === 0)
        return t('dashboard.filter.accounts.all');
      if (selectedAccounts.length === combinedAccounts.length)
        return t('dashboard.filter.accounts.all');
      if (selectedAccounts.length === 1) return selectedAccounts[0];
      return t('dashboard.filter.accounts.n-selected', {
        count: selectedAccounts.length.toString(),
      });
    }, [selectedAccounts, combinedAccounts]);

    
    const hasAccounts = combinedAccounts.length > 0;

    
    const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

    const selectedAccountsSet = new Set(selectedAccounts);
    return (
      <div
        className="journalit-dashboard-account-filter journalit-responsive-account-filter"
        ref={dropdownRef}
      >
        <div className="journalit-dashboard-account-dropdown">
          <button
            type="button"
            className="journalit-native-button journalit-native-button--unstyled journalit-dashboard-account-summary"
            onClick={toggleDropdown}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
              }
            }}
          >
            <span className="journalit-dashboard-summary-text">
              {accountSummary}
            </span>
            <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
          </button>

          {isOpen && (
            <div className="journalit-dashboard-account-options-dropdown">
              {hasAccounts ? (
                <>
                  <div
                    className="journalit-dashboard-account-option-item select-all"
                    onClick={() => handleAccountChange('select-all')}
                    role="checkbox"
                    aria-checked={
                      selectedAccounts.length === combinedAccounts.length
                    }
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleAccountChange('select-all');
                      }
                    }}
                  >
                    <span
                      className={`journalit-dashboard-account-checkbox${selectedAccounts.length === combinedAccounts.length ? ' checked' : ''}`}
                      aria-hidden="true"
                    >
                      {selectedAccounts.length === combinedAccounts.length
                        ? '✓'
                        : ''}
                    </span>
                    <span>{t('dashboard.filter.accounts.select-all')}</span>
                  </div>
                  <div className="journalit-dashboard-account-divider"></div>
                  {combinedAccounts.map((account) => (
                    <div
                      key={account}
                      className="journalit-dashboard-account-option-item"
                      onClick={() => handleAccountChange(account)}
                      role="checkbox"
                      aria-checked={selectedAccountsSet.has(account)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleAccountChange(account);
                        }
                      }}
                    >
                      <span
                        className={`journalit-dashboard-account-checkbox${selectedAccountsSet.has(account) ? ' checked' : ''}`}
                        aria-hidden="true"
                      >
                        {selectedAccountsSet.has(account) ? '✓' : ''}
                      </span>
                      <span>{account}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="journalit-dashboard-no-accounts">
                  {t('dashboard.filter.accounts.none-found')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

AccountFilter.displayName = 'AccountFilter';
