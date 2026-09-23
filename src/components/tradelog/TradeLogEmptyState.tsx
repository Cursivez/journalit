import React from 'react';
import { t } from '../../lang/helpers';
import { EmptyState } from '../shared/EmptyState';
import { Import, RotateCcw } from '../shared/icons/ObsidianIcon';
import { SampleJournalEntryButton } from '../shared/SampleJournalControls';

interface TradeLogEmptyStateProps {
  isFilteredEmpty: boolean;
  onImportTrades: () => void;
  onAddTradeManually: () => void;
  onClearFilters: () => void;
}

export const TradeLogEmptyState: React.FC<TradeLogEmptyStateProps> = ({
  isFilteredEmpty,
  onImportTrades,
  onAddTradeManually,
  onClearFilters,
}) => {
  if (isFilteredEmpty) {
    return (
      <EmptyState
        message={t('tradelog.empty')}
        subMessage={t('dashboard.empty.filter-hint')}
        iconSize={56}
        actionButtonText={t('imageGallery.empty.action.clear-filters')}
        actionIcon={
          <RotateCcw size={16} className="journalit-empty-state-action-icon" />
        }
        onActionButtonClick={onClearFilters}
      />
    );
  }

  return (
    <EmptyState
      message={t('dashboard.empty.message')}
      subMessage={t('dashboard.empty.submessage')}
      iconSize={56}
      actionButtonText={t('dashboard.empty.import-action')}
      actionIcon={
        <Import size={16} className="journalit-empty-state-action-icon" />
      }
      onActionButtonClick={onImportTrades}
      secondaryActionButtonText={t('dashboard.empty.manual-action')}
      onSecondaryActionButtonClick={onAddTradeManually}
      additionalAction={<SampleJournalEntryButton />}
      actionsLayout="stacked"
    />
  );
};
