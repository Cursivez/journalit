

import React from 'react';
import { t } from '../../../lang/helpers';
import { Button } from '../../ui/Button';
import { GitMerge, Plus, Trophy } from '../../shared/icons/ObsidianIcon';

export const ChallengeEmptyState: React.FC<{
  onCreateChallenge: () => void;
  
  onSetUpExisting?: () => void;
}> = ({ onCreateChallenge, onSetUpExisting }) => (
  <div className="journalit-challenge-empty">
    <Trophy size={28} className="journalit-challenge-empty__icon" />
    <div className="journalit-challenge-empty__title">
      {t('account-dashboard.challenges.empty.title')}
    </div>
    <div className="journalit-challenge-empty__message">
      {t('account-dashboard.challenges.empty.message')}
    </div>
    <div className="journalit-challenge-empty__actions">
      <Button variant="primary" onClick={onCreateChallenge}>
        <Plus size={14} />
        {t('account-dashboard.challenges.empty.create')}
      </Button>
      {onSetUpExisting && (
        <Button variant="secondary" onClick={onSetUpExisting}>
          <GitMerge size={14} />
          {t('account-dashboard.challenges.empty.setup')}
        </Button>
      )}
    </div>
  </div>
);
