

import React, { useId } from 'react';
import { t } from '../../../../lang/helpers';
import { cssVars } from '../../../../styles/inlineStylePolicy';
import {
  AlertTriangle,
  Check,
  Circle,
  Info,
  X,
} from '../../../shared/icons/ObsidianIcon';
import { ExplanationTooltipContent } from '../../../shared/ExplanationTooltipContent';
import { HelpTooltipContent } from '../../../shared/HelpTooltipContent';
import { SegmentedProgress } from '../../../shared/SegmentedProgress';
import { Tooltip } from '../../../shared/Tooltip';
import type {
  PropChallengeLedgerEntry,
  PropChallengeLedgerTone,
} from './propChallengeLedgerModel';


const STATE_GLYPH_PROPS = { 'aria-hidden': true as const, size: 13 };

const StateGlyph: React.FC<{ tone: PropChallengeLedgerTone }> = ({ tone }) => {
  if (tone === 'positive') return <Check {...STATE_GLYPH_PROPS} />;
  if (tone === 'negative') return <X {...STATE_GLYPH_PROPS} />;
  if (tone === 'warning') return <AlertTriangle {...STATE_GLYPH_PROPS} />;
  return <Circle {...STATE_GLYPH_PROPS} size={8} />;
};


const MAX_SEGMENTS = 20;

const LedgerRow: React.FC<{ row: PropChallengeLedgerEntry }> = ({ row }) => {
  
  
  const ruleId = useId();
  const percent = Math.round(row.progressRatio * 100);
  const count =
    row.count !== undefined &&
    row.count.target >= 1 &&
    row.count.target <= MAX_SEGMENTS
      ? row.count
      : undefined;

  return (
    <div
      className={`journalit-prop-ledger-row is-${row.tone} is-${row.state}`}
      role="row"
    >
      <span className="journalit-prop-ledger-cell is-state" role="cell">
        <span className={`journalit-prop-ledger-glyph is-${row.tone}`}>
          <StateGlyph tone={row.tone} />
        </span>
        <span className="journalit-account-page-sr-only">
          {t(`account.prop-challenge.ledger.state.${row.state}`)}
        </span>
      </span>

      <span className="journalit-prop-ledger-cell is-rule" role="cell">
        <Tooltip
          content={
            <HelpTooltipContent
              description={row.help.description}
              example={row.help.example}
              title={row.label}
            />
          }
          delay={200}
          disclosureLabel={t('account.prop-challenge.ledger.help.open', {
            rule: row.label,
          })}
          preferredPosition="bottom"
          triggerClassName="journalit-prop-ledger-rule-trigger"
        >
          <span id={ruleId}>{row.label}</span>
        </Tooltip>
      </span>

      <span className="journalit-prop-ledger-cell is-value" role="cell">
        
        <span className="journalit-prop-ledger-value-text">
          {row.progressText}
        </span>
        {row.explanation ? (
          <Tooltip
            content={
              <ExplanationTooltipContent
                calculations={row.explanation.calculations}
                description={row.explanation.description}
                formula={row.explanation.formula}
                title={row.explanation.title}
              />
            }
            delay={200}
            disclosureLabel={row.explanation.disclosureLabel}
            preferredPosition="bottom"
            triggerClassName="journalit-prop-ledger-info-trigger"
          >
            <Info
              aria-hidden="true"
              className="journalit-prop-ledger-info-icon"
              size={10}
            />
          </Tooltip>
        ) : null}
      </span>

      <span className="journalit-prop-ledger-cell is-progress" role="cell">
        
        <span
          aria-labelledby={ruleId}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={percent}
          aria-valuetext={row.progressText}
          className={`journalit-prop-ledger-progress-track${count ? ' is-segmented' : ''}`}
          data-has-limit={row.limitRatio !== undefined}
          role="progressbar"
        >
          {count ? (
            <SegmentedProgress
              completed={count.current}
              total={count.target}
              tone={row.tone}
            />
          ) : (
            <>
              {row.limitRatio !== undefined ? (
                <span
                  aria-hidden="true"
                  className="journalit-prop-ledger-progress-limit"
                  style={cssVars({
                    '--journalit-prop-challenge-limit': `${Math.round(row.limitRatio * 100)}%`,
                  })}
                />
              ) : null}
              
              <span
                className="journalit-prop-ledger-progress-fill"
                data-is-zero={percent <= 0}
                style={cssVars({
                  '--journalit-prop-challenge-progress': `${percent}%`,
                })}
              />
            </>
          )}
        </span>
      </span>

      <span className="journalit-prop-ledger-cell is-requirement" role="cell">
        {row.requirementText}
      </span>
    </div>
  );
};

export const PropChallengeRuleLedger: React.FC<{
  caption: string;
  rows: readonly PropChallengeLedgerEntry[];
  payoutSection?: {
    label: string;
    rows: readonly PropChallengeLedgerEntry[];
  };
}> = ({ caption, rows, payoutSection }) => {
  
  
  
  const captionId = useId();

  return (
    
    
    <div
      aria-labelledby={captionId}
      className="journalit-prop-ledger"
      role="table"
    >
      <span className="journalit-account-page-sr-only" id={captionId}>
        {caption}
      </span>
      {rows.map((row) => (
        <LedgerRow key={row.ruleId} row={row} />
      ))}
      {payoutSection && payoutSection.rows.length > 0 ? (
        <>
          <div className="journalit-prop-ledger-section" role="row">
            <span className="journalit-prop-ledger-section-label" role="cell">
              {payoutSection.label}
            </span>
          </div>
          {payoutSection.rows.map((row) => (
            <LedgerRow key={row.ruleId} row={row} />
          ))}
        </>
      ) : null}
    </div>
  );
};
