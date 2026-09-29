

import React, { useEffect, useId, useRef } from 'react';
import { t } from '../../../../lang/helpers';
import type { PropChallengePhase } from '../../../../services/propChallenge/types';
import { observeSelectedPhaseStep } from './phaseTimelineScroll';

interface Props {
  phases: PropChallengePhase[];
  selectedPhaseId: string | undefined;
  currentPhaseId: string | undefined;
  disabled: boolean;
  onSelect: (phaseId: string) => void;
}

export const PhaseTimeline: React.FC<Props> = ({
  phases,
  selectedPhaseId,
  currentPhaseId,
  disabled,
  onSelect,
}) => {
  const timelineRef = useRef<HTMLElement>(null);
  const labelId = useId();

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    return observeSelectedPhaseStep(timeline);
  }, [selectedPhaseId, phases.length]);

  return (
    <>
      
      <span id={labelId} className="journalit-sr-only">
        {t('account.prop-challenge.title')}
      </span>
      <nav
        ref={timelineRef}
        className="journalit-prop-challenge-phase-timeline"
        aria-labelledby={labelId}
      >
        {phases.map((phase) => {
          const selected = phase.id === selectedPhaseId;
          const current = phase.id === currentPhaseId;
          return (
            <button
              key={phase.id}
              type="button"
              className={`journalit-prop-challenge-phase-step${selected ? ' is-selected' : ''}${current ? ' is-current' : ''}`}
              aria-pressed={selected}
              aria-current={current ? 'step' : undefined}
              onClick={() => onSelect(phase.id)}
              disabled={disabled}
            >
              <span className="journalit-prop-challenge-phase-step-marker" />
              <span className="journalit-prop-challenge-phase-step-label">
                {phase.name || t('account.prop-challenge.unnamed-phase')}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
