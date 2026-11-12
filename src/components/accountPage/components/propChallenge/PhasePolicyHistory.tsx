

import React from 'react';
import { t } from '../../../../lang/helpers';
import { formatLocalizedDateTime } from '../../../../utils/localizedDateTime';
import { useHourCycle } from '../../../../hooks/useHourCycle';
import type { PropChallengePhase } from '../../../../services/propChallenge/types';
import { CollapsibleSection } from '../../../shared/CollapsibleSection';
import { PhaseEditor } from './PhaseEditor';

interface Props {
  phase: PropChallengePhase;
  phases: PropChallengePhase[];
  currencyCode: string;
}

export const PhasePolicyHistory: React.FC<Props> = ({
  phase,
  phases,
  currencyCode,
}) => {
  useHourCycle();
  if (!phase.policyHistory) return null;
  return (
    <CollapsibleSection
      className="journalit-profile-history"
      title={t('account.profiles.history')}
      defaultOpen={false}
    >
      <div className="journalit-profile-history__entries">
        <p>{t('account.profiles.history-help')}</p>
        {phase.policyHistory.map((revision) => (
          <CollapsibleSection
            key={revision.effectiveAt}
            title={formatLocalizedDateTime(revision.effectiveAt, 'medium')}
            defaultOpen={false}
            className="journalit-profile-history__entry"
          >
            <div className="journalit-profile-history__entries">
              {revision.transition?.basis === 'custom' && (
                <p>
                  {t('account.profiles.custom-transition')}:{' '}
                  {revision.transition.source}
                </p>
              )}
              <PhaseEditor
                phase={{
                  ...phase,
                  rules: revision.rules,
                  payoutPolicy: revision.payoutPolicy,
                }}
                phases={phases}
                currencyCode={currencyCode}
                disabled
                onChange={() => {}}
              />
            </div>
          </CollapsibleSection>
        ))}
      </div>
    </CollapsibleSection>
  );
};
