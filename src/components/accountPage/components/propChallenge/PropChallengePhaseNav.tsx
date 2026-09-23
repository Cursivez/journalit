

import React, { useId } from 'react';
import { useMenuDisclosure } from '../../../../hooks/useMenuDisclosure';
import { t } from '../../../../lang/helpers';
import type { PropChallengePhaseEvaluationStatus } from '../../../../services/propChallenge/PropChallengeRuleEngine';
import type {
  PropChallengeConfig,
  PropChallengePhase,
} from '../../../../services/propChallenge/types';
import { Check, ChevronDown } from '../../../shared/icons/ObsidianIcon';
import {
  PropChallengeActionsMenu,
  type PropChallengeManualAction,
  type PropChallengeMenuAction,
} from './PropChallengeActionsMenu';


export const PhaseSelector: React.FC<{
  challenge: PropChallengeConfig;
  selectedPhase: PropChallengePhase;
  onSelectPhase: (phaseId: string) => void;
}> = ({ challenge, selectedPhase, onSelectPhase }) => {
  const { isOpen, setIsOpen, close, containerRef, triggerRef, menuProps } =
    useMenuDisclosure({ initialFocus: 'checked' });
  const menuId = useId();
  const selectedIndex = challenge.phases.findIndex(
    (phase) => phase.id === selectedPhase.id
  );

  return (
    <div className="journalit-prop-phase-selector" ref={containerRef}>
      <button
        aria-controls={isOpen ? menuId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="journalit-prop-phase-selector-trigger"
        onClick={() => setIsOpen((open) => !open)}
        ref={triggerRef}
        type="button"
      >
        <span className="journalit-account-page-sr-only">
          {`${t('account.prop-challenge.view-phase')}: ${selectedPhase.name}, ${
            selectedIndex + 1
          }/${challenge.phases.length}`}
        </span>
        <span aria-hidden="true" className="journalit-prop-phase-selector-name">
          {selectedPhase.name}
        </span>
        <span
          aria-hidden="true"
          className="journalit-prop-phase-selector-count"
        >
          {`${selectedIndex + 1}/${challenge.phases.length}`}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={isOpen ? 'is-open' : undefined}
          size={13}
        />
      </button>
      {isOpen ? (
        <div
          aria-label={t('account.prop-challenge.view-phase')}
          className="journalit-prop-phase-menu journalit-home-period-menu"
          id={menuId}
          {...menuProps}
        >
          {challenge.phases.map((phase) => {
            const selected = phase.id === selectedPhase.id;
            return (
              <button
                aria-checked={selected}
                className="journalit-prop-phase-option journalit-home-period-option"
                key={phase.id}
                onClick={() => {
                  onSelectPhase(phase.id);
                  close(true);
                }}
                role="menuitemradio"
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="journalit-prop-phase-option-check"
                >
                  {selected ? <Check size={12} /> : null}
                </span>
                <span className="journalit-home-period-option__label">
                  {phase.name}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export const PropChallengePhaseNav: React.FC<{
  challenge: PropChallengeConfig;
  selectedPhase: PropChallengePhase;
  status?:
    | PropChallengeConfig['status']
    | PropChallengePhase['status']
    | PropChallengePhaseEvaluationStatus;
  actions: readonly PropChallengeMenuAction[];
  onAction: (action: PropChallengeManualAction) => void;
}> = ({ challenge, selectedPhase, status, actions, onAction }) => {
  const selectedIndex = challenge.phases.findIndex(
    (phase) => phase.id === selectedPhase.id
  );
  const nextPhase = challenge.phases[selectedIndex + 1];

  return (
    <div className="journalit-prop-phase-nav">
      <div className="journalit-prop-phase-title">
        <h3 className="journalit-prop-phase-heading">{selectedPhase.name}</h3>
        {status ? (
          <span
            className={`journalit-prop-phase-status is-${status}`}
            role="status"
          >
            {t(`account.prop-challenge.summary.status.${status}`)}
          </span>
        ) : null}
      </div>
      <div className="journalit-prop-phase-controls">
        {nextPhase ? (
          <span className="journalit-prop-phase-next">
            {t('account.prop-challenge.next-phase', {
              phase: nextPhase.name,
            })}
          </span>
        ) : null}
        
        <PropChallengeActionsMenu actions={actions} onSelect={onAction} />
      </div>
    </div>
  );
};
