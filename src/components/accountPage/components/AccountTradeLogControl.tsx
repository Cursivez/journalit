

import React from 'react';
import { usePlugin } from '../../../hooks/usePlugin';
import { t } from '../../../lang/helpers';
import type { PropChallengePhase } from '../../../services/propChallenge/types';
import { openTradeLogWithFilters } from '../../../utils/openTradeLogWithFilters';
import { ScanSearch } from '../../shared/icons/ObsidianIcon';
import { IconButton } from '../../ui/IconButton';

export const AccountTradeLogControl: React.FC<{
  accountName: string;
  
  selectedPhase?: PropChallengePhase;
}> = ({ accountName, selectedPhase }) => {
  const plugin = usePlugin();

  const openTrades = () => {
    if (!plugin) return;
    if (selectedPhase) {
      void openTradeLogWithFilters(plugin, {
        dateRange: [null, null],
        accounts: [],
        accountPhases: [{ account: accountName, phaseId: selectedPhase.id }],
      });
      return;
    }
    void openTradeLogWithFilters(plugin, {
      dateRange: [null, null],
      accounts: [accountName],
      accountPhases: [],
    });
  };

  return (
    <IconButton
      onClick={openTrades}
      variant="toolbar"
      className="view-trades-btn"
      ariaLabel={
        selectedPhase
          ? t('account.prop-challenge.view-trades', {
              phase: selectedPhase.name,
            })
          : t('account.header.view-trades.aria')
      }
      disabled={selectedPhase?.status === 'pending'}
    >
      <ScanSearch size={16} />
    </IconButton>
  );
};
