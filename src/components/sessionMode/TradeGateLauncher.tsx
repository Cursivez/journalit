import React from 'react';
import { t } from '../../lang/helpers';
import type { TradeGateRun } from '../../types/sessionMode';
import { ChevronDown, Play } from '../shared/icons/ObsidianIcon';

interface TradeGateLauncherProps {
  controlRef: React.RefObject<HTMLDivElement | null>;
  disabled: boolean;
  isOpen: boolean;
  menu: React.ReactNode;
  onToggle: () => void;
  onStart: () => void;
  run: TradeGateRun | null;
  workflowName: string;
}

export const TradeGateLauncher: React.FC<TradeGateLauncherProps> = ({
  controlRef,
  disabled,
  isOpen,
  menu,
  onToggle,
  onStart,
  run,
  workflowName,
}) => {
  const showPickerChevron =
    (!run || run.answers.length === 0) && run?.status !== 'completed';

  return (
    <div className="journalit-trade-gate-workflow-launcher">
      <div className="journalit-trade-gate-workflow-launcher__label">
        {t('trade-gate.workflow')}
      </div>
      <div
        ref={controlRef}
        className={`journalit-trade-gate-workflow-control${run ? ' is-running' : ''}${isOpen ? ' is-open' : ''}`}
      >
        <button
          type="button"
          className="journalit-trade-gate-workflow-trigger"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={onToggle}
        >
          <span>{workflowName}</span>
          {showPickerChevron && (
            <ChevronDown
              className={
                isOpen
                  ? 'journalit-trade-gate-workflow-trigger__chevron is-open'
                  : 'journalit-trade-gate-workflow-trigger__chevron'
              }
              size={16}
              aria-hidden="true"
            />
          )}
        </button>
        {!run && (
          <button
            type="button"
            className="journalit-trade-gate-start-button"
            onClick={onStart}
          >
            <Play size={17} aria-hidden="true" />
            <span>{t('trade-gate.action.start-short')}</span>
          </button>
        )}
        {isOpen && menu}
      </div>
    </div>
  );
};
