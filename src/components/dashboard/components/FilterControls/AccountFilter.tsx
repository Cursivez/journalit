

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { t } from '../../../../lang/helpers';
import { formatDateDisplay } from '../../../../utils/dateUtils';
import { normalizeAccountLookupKey } from '../../../../services/trade/core/TradeAccountIdentity';
import type { AccountPhaseOption } from '../../../shared/filters/accountPhaseScope';
import { AccountFilterProps } from './types';
import { AnchoredMenu } from '../../../shared/menus/AnchoredMenu';

function formatPhaseWindow(
  phase: AccountPhaseOption,
  dateFormat: string
): string {
  const start = formatDateDisplay(phase.startedAt, dateFormat);
  const end = phase.completedAt
    ? formatDateDisplay(phase.completedAt, dateFormat)
    : t('dashboard.filter.accounts.phase-now');
  return `${start} – ${end}`;
}


export const AccountFilter: React.FC<AccountFilterProps> = React.memo(
  ({
    accounts,
    selectedAccounts,
    onChange,
    phaseOptions,
    selectedPhases,
    onPhasesChange,
    dateFormat = 'DDMMYY',
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    
    const combinedAccounts = useMemo(() => {
      return [...new Set([...accounts, ...selectedAccounts])];
    }, [accounts, selectedAccounts]);

    
    const phasesByAccount = useMemo(() => {
      const map = new Map<string, AccountPhaseOption[]>();
      if (!phaseOptions) {
        return map;
      }
      for (let i = 0; i < phaseOptions.length; i++) {
        const group = phaseOptions[i];
        const key = normalizeAccountLookupKey(group.account);
        if (key) {
          map.set(key, group.phases);
        }
      }
      return map;
    }, [phaseOptions]);

    const selectedPhaseKeys = useMemo(() => {
      const keys = new Set<string>();
      if (!selectedPhases) {
        return keys;
      }
      for (let i = 0; i < selectedPhases.length; i++) {
        const scope = selectedPhases[i];
        const key = normalizeAccountLookupKey(scope.account);
        if (key) {
          keys.add(`${key}\u0000${scope.phaseId}`);
        }
      }
      return keys;
    }, [selectedPhases]);

    const handlePhaseToggle = useCallback(
      (account: string, phaseId: string) => {
        if (!onPhasesChange) {
          return;
        }
        const current = selectedPhases || [];
        const accountKey = normalizeAccountLookupKey(account);
        const isSelected = current.some(
          (scope) =>
            scope.phaseId === phaseId &&
            normalizeAccountLookupKey(scope.account) === accountKey
        );

        if (isSelected) {
          onPhasesChange(
            current.filter(
              (scope) =>
                scope.phaseId !== phaseId ||
                normalizeAccountLookupKey(scope.account) !== accountKey
            )
          );
          return;
        }

        onPhasesChange([...current, { account, phaseId }]);
      },
      [onPhasesChange, selectedPhases]
    );

    
    const handleAccountChange = useCallback(
      (accountId: string) => {
        if (accountId === 'select-all') {
          
          if (selectedAccounts.length === combinedAccounts.length) {
            onChange([]);
          } else {
            onChange([...combinedAccounts]);
          }
          if (onPhasesChange && selectedPhases && selectedPhases.length > 0) {
            onPhasesChange([]);
          }
        } else {
          
          if (selectedAccounts.includes(accountId)) {
            onChange(selectedAccounts.filter((a) => a !== accountId));
          } else {
            onChange([...selectedAccounts, accountId]);
            
            
            
            
            if (onPhasesChange && selectedPhases && selectedPhases.length > 0) {
              const accountKey = normalizeAccountLookupKey(accountId);
              const remaining = selectedPhases.filter(
                (scope) =>
                  normalizeAccountLookupKey(scope.account) !== accountKey
              );
              if (remaining.length !== selectedPhases.length) {
                onPhasesChange(remaining);
              }
            }
          }
        }
      },
      [
        selectedAccounts,
        combinedAccounts,
        onChange,
        onPhasesChange,
        selectedPhases,
      ]
    );

    
    const accountSummary = useMemo(() => {
      const phaseCount = selectedPhases ? selectedPhases.length : 0;
      const totalCount = selectedAccounts.length + phaseCount;

      if (totalCount === 0) return t('dashboard.filter.accounts.all');
      if (phaseCount === 0) {
        if (selectedAccounts.length === combinedAccounts.length)
          return t('dashboard.filter.accounts.all');
        if (selectedAccounts.length === 1) return selectedAccounts[0];
      }

      if (totalCount === 1 && selectedPhases && selectedPhases.length === 1) {
        const scope = selectedPhases[0];
        const phases = phasesByAccount.get(
          normalizeAccountLookupKey(scope.account)
        );
        const phase = phases
          ? phases.find((option) => option.id === scope.phaseId)
          : undefined;
        return `${scope.account} · ${phase ? phase.name : scope.phaseId}`;
      }

      return t('dashboard.filter.accounts.n-selected', {
        count: totalCount.toString(),
      });
    }, [selectedAccounts, combinedAccounts, selectedPhases, phasesByAccount]);

    
    const hasAccounts = combinedAccounts.length > 0;

    
    const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

    const selectedAccountsSet = new Set(selectedAccounts);
    return (
      <div
        className={`journalit-dashboard-account-filter journalit-responsive-account-filter${phasesByAccount.size > 0 ? ' has-phases' : ''}`}
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

          <AnchoredMenu
            isOpen={isOpen}
            triggerRef={dropdownRef}
            onClose={() => setIsOpen(false)}
            className="journalit-dashboard-account-options-dropdown"
            width={phasesByAccount.size > 0 ? 'content' : 'trigger'}
            minWidth={phasesByAccount.size > 0 ? 260 : 150}
            maxWidth={phasesByAccount.size > 0 ? 360 : undefined}
          >
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
                {combinedAccounts.map((account) => {
                  const isAccountSelected = selectedAccountsSet.has(account);
                  const accountKey = normalizeAccountLookupKey(account);
                  const accountPhases = isAccountSelected
                    ? undefined
                    : phasesByAccount.get(accountKey);

                  return (
                    <React.Fragment key={account}>
                      <div
                        className="journalit-dashboard-account-option-item"
                        onClick={() => handleAccountChange(account)}
                        role="checkbox"
                        aria-checked={isAccountSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleAccountChange(account);
                          }
                        }}
                      >
                        <span
                          className={`journalit-dashboard-account-checkbox${isAccountSelected ? ' checked' : ''}`}
                          aria-hidden="true"
                        >
                          {isAccountSelected ? '✓' : ''}
                        </span>
                        <span>{account}</span>
                      </div>
                      {accountPhases?.map((phase) => {
                        const isPhaseSelected = selectedPhaseKeys.has(
                          `${accountKey}\u0000${phase.id}`
                        );

                        return (
                          <div
                            key={`${account}-${phase.id}`}
                            className="journalit-dashboard-account-option-item journalit-dashboard-account-phase-item"
                            onClick={() => handlePhaseToggle(account, phase.id)}
                            role="checkbox"
                            aria-checked={isPhaseSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handlePhaseToggle(account, phase.id);
                              }
                            }}
                          >
                            <span
                              className={`journalit-dashboard-account-checkbox${isPhaseSelected ? ' checked' : ''}`}
                              aria-hidden="true"
                            >
                              {isPhaseSelected ? '✓' : ''}
                            </span>
                            <span className="journalit-dashboard-account-phase-name">
                              {phase.name}
                            </span>
                            <span className="journalit-dashboard-account-phase-window">
                              {formatPhaseWindow(phase, dateFormat)}
                            </span>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              <div className="journalit-dashboard-no-accounts">
                {t('dashboard.filter.accounts.none-found')}
              </div>
            )}
          </AnchoredMenu>
        </div>
      </div>
    );
  }
);

AccountFilter.displayName = 'AccountFilter';
