

import React, { useMemo, useState } from 'react';
import { Network, Repeat2 } from '../../shared/icons/ObsidianIcon';
import { Tooltip } from '../../shared/Tooltip';
import { t } from '../../../lang/helpers';
import { usePlugin } from '../../../hooks/usePlugin';
import { useEventBus } from '../../../hooks/useEventBus';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { getActiveCopyTradingPeriod } from '../../../utils/accountCopyTrading';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';
import type { AccountData } from '../../../services/account/types';

interface CopyingAccount {
  account: string;
  multiplier: number;
}


export function useCopiedByAccounts(accountName: string): CopyingAccount[] {
  const plugin = usePlugin();
  
  
  
  const accountMetadata = plugin?.settings?.account?.accountMetadata;
  
  
  
  const [metadataRevision, setMetadataRevision] = useState(0);
  useEventBus('account:changed', () =>
    setMetadataRevision((revision) => revision + 1)
  );

  return useMemo(() => {
    const accountLookupKey = normalizeAccountLookupKey(accountName);

    const copiers = Object.values(accountMetadata ?? {}).reduce<
      CopyingAccount[]
    >((acc, metadata) => {
      const activeCopyPeriod = getActiveCopyTradingPeriod(metadata);
      if (
        activeCopyPeriod &&
        normalizeAccountLookupKey(activeCopyPeriod.baseAccount) ===
          accountLookupKey
      ) {
        acc.push({
          account: metadata.name,
          multiplier: activeCopyPeriod.multiplier,
        });
      }
      return acc;
    }, []);

    
    
    
    return copiers.sort(
      (left, right) =>
        right.multiplier - left.multiplier ||
        left.account.localeCompare(right.account)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- metadataRevision is the mutation signal for accountMetadata, whose own identity never changes when an entry is replaced.
  }, [accountName, accountMetadata, metadataRevision]);
}

export function AccountCopyBadges({
  account,
  copiedByAccounts,
  leading,
}: {
  account: AccountData;
  copiedByAccounts: CopyingAccount[];
  
  leading?: React.ReactNode;
}) {
  const activeCopyPeriod = getActiveCopyTradingPeriod(account);
  const isBaseAccount = copiedByAccounts.length > 0;
  
  
  
  const { shouldMask } = useDisplayFormatter();
  const sizeMasked = shouldMask('positionSize');

  if (!leading && !activeCopyPeriod && !isBaseAccount) {
    return null;
  }

  return (
    <div className="account-card-badges">
      {leading}
      {isBaseAccount && (
        <Tooltip
          content={
            <div className="account-copy-badge-tooltip">
              <div className="account-copy-badge-tooltip-title">
                {t('account-dashboard.copy-badge.copied-by')}
              </div>
              {copiedByAccounts.map((copyAccount) => (
                <div
                  key={copyAccount.account}
                  className="account-copy-badge-tooltip-row"
                >
                  <span>{copyAccount.account}</span>
                  {sizeMasked ? null : <span>{copyAccount.multiplier}x</span>}
                </div>
              ))}
            </div>
          }
          delay={0}
          preferredPosition="top"
        >
          <div className="account-base-badge">
            <Network size={12} aria-hidden="true" />
            {t('account-dashboard.copy-badge.base')}
          </div>
        </Tooltip>
      )}
      {activeCopyPeriod && (
        <Tooltip
          content={
            sizeMasked
              ? t('account-dashboard.copy-badge.copies-tooltip-masked', {
                  account: activeCopyPeriod.baseAccount,
                })
              : t('account-dashboard.copy-badge.copies-tooltip', {
                  account: activeCopyPeriod.baseAccount,
                  multiplier: String(activeCopyPeriod.multiplier),
                })
          }
          delay={0}
          preferredPosition="top"
        >
          <div className="account-copy-badge">
            <Repeat2 size={12} aria-hidden="true" />
            {t('account-dashboard.copy-badge.copy')}
          </div>
        </Tooltip>
      )}
    </div>
  );
}
