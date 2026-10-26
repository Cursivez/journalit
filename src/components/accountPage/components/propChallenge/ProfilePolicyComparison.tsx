import React, { useState } from 'react';
import type {
  PropChallengePhase,
  PropChallengeRule,
  ExecutablePropChallengeRule,
} from '../../../../services/propChallenge/types';
import { sameProfileContent } from '../../../../services/propChallenge/PropChallengePolicyHistory';
import { isExecutableRule } from '../../../../services/propChallenge/PropChallengeRuleReview';
import { t } from '../../../../lang/helpers';
import { RuleEditor } from './RuleEditor';
import { PayoutPolicyEditor } from './PayoutPolicyEditor';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { Tooltip } from '../../../shared/Tooltip';
import { HelpTooltipContent } from '../../../shared/HelpTooltipContent';
import { propChallengeRuleDescription } from './propChallengeRuleHelp';

function AmountChange({
  before,
  after,
  currencyCode,
}: {
  before: PropChallengeRule;
  after: PropChallengeRule;
  currencyCode: string;
}) {
  const { formatValue } = useDisplayFormatter();
  const format = (rule: PropChallengeRule) =>
    'amount' in rule
      ? formatValue({
          kind:
            rule.kind === 'profit_target' && rule.targetType === 'percentage'
              ? 'percentage'
              : 'money',
          value: rule.amount,
          currencyCode,
          showCents: false,
        })
      : '';
  return (
    <div className="journalit-profile-amount-change">
      <span>{format(before)}</span>
      <span aria-hidden="true">→</span>
      <strong>{format(after)}</strong>
    </div>
  );
}

function amountOnly(before: PropChallengeRule[], after: PropChallengeRule[]) {
  if (
    [...before, ...after].some(
      (rule) =>
        rule.kind === 'daily_loss_limit' &&
        (rule.profitThresholdPercent !== undefined ||
          rule.scaleAtBalance !== undefined ||
          rule.lossTiers !== undefined)
    )
  )
    return false;
  if (
    before.length !== 1 ||
    after.length !== 1 ||
    !['daily_loss_limit', 'drawdown', 'profit_target'].includes(before[0].kind)
  )
    return false;
  const strip = (rule: PropChallengeRule) =>
    'amount' in rule ? { ...rule, id: '', amount: 0 } : rule;
  return sameProfileContent(strip(before[0]), strip(after[0]));
}

const noChange = () => {};
function ruleDefinitions(rules: readonly PropChallengeRule[]) {
  return rules.map(({ id: _id, enabled: _enabled, ...rule }) => rule);
}

function ReadOnlyRule({
  rule,
  index,
  phase,
  currencyCode,
}: {
  rule: ExecutablePropChallengeRule;
  index: number;
  phase: PropChallengePhase;
  currencyCode: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <RuleEditor
      rule={rule}
      ordinal={index + 1}
      currencyCode={currencyCode}
      startingBalance={phase.startingBalance}
      expanded={expanded}
      disabled
      toggleRef={noChange}
      onToggle={() => setExpanded(!expanded)}
      onChange={noChange}
      onRemove={noChange}
    />
  );
}

function ReadOnlyPayout({ phase }: { phase: PropChallengePhase }) {
  const [expanded, setExpanded] = useState(false);
  return phase.payoutPolicy ? (
    <PayoutPolicyEditor
      policy={phase.payoutPolicy}
      startingBalance={phase.startingBalance}
      expanded={expanded}
      disabled
      toggleRef={noChange}
      onToggle={() => setExpanded(!expanded)}
      onChange={noChange}
      onRemove={noChange}
    />
  ) : (
    <span className="journalit-profile-policy-empty">
      {t('account.profiles.not-configured')}
    </span>
  );
}


function RuleChangeHeading({ rule }: { rule: ExecutablePropChallengeRule }) {
  const title = t(`account.prop-challenge.rule.${rule.kind}`);
  return (
    <div className="journalit-profile-policy-change__heading">
      <Tooltip
        content={
          <HelpTooltipContent
            title={title}
            description={propChallengeRuleDescription(rule)}
          />
        }
        delay={200}
        preferredPosition="bottom"
        triggerClassName="journalit-prop-challenge-rule-help"
      >
        <strong>{title}</strong>
      </Tooltip>
    </div>
  );
}

function ComparisonSide({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  
  return (
    <>
      <span className="journalit-profile-policy-column-label">{label}</span>
      <div className="journalit-profile-policy-side__rules">{children}</div>
    </>
  );
}

function ReadOnlyRules({
  rules,
  phase,
  currencyCode,
}: {
  rules: ExecutablePropChallengeRule[];
  phase: PropChallengePhase;
  currencyCode: string;
}) {
  return rules.length ? (
    <>
      {rules.map((rule, index) => (
        <ReadOnlyRule
          key={rule.id}
          rule={rule}
          index={index}
          phase={phase}
          currencyCode={currencyCode}
        />
      ))}
    </>
  ) : (
    <span className="journalit-profile-policy-empty">
      {t('account.profiles.not-configured')}
    </span>
  );
}


export function ProfilePolicyComparison({
  current,
  incoming,
  currencyCode,
  currentLabel = t('account.profiles.current'),
  incomingLabel = t('account.profiles.incoming'),
}: {
  current: PropChallengePhase;
  incoming: PropChallengePhase;
  currencyCode: string;
  currentLabel?: string;
  incomingLabel?: string;
}) {
  const currentRules = current.rules.filter(isExecutableRule);
  const incomingRules = incoming.rules.filter(isExecutableRule);
  const kinds = new Set(
    [...currentRules, ...incomingRules].map((rule) => rule.kind)
  );
  const changes = Array.from(kinds).flatMap((kind) => {
    const before = currentRules.filter((rule) => rule.kind === kind);
    const after = incomingRules.filter((rule) => rule.kind === kind);
    return sameProfileContent(ruleDefinitions(before), ruleDefinitions(after))
      ? []
      : [{ kind, before, after }];
  });
  const payoutChanged = !sameProfileContent(
    current.payoutPolicy,
    incoming.payoutPolicy
  );
  return (
    <div className="journalit-profile-policy-diff">
      {changes.map(({ kind, before, after }) => (
        <section className="journalit-profile-policy-change" key={kind}>
          <RuleChangeHeading rule={after[0] ?? before[0]} />
          {amountOnly(before, after) ? (
            <AmountChange
              before={before[0]}
              after={after[0]}
              currencyCode={currencyCode}
            />
          ) : (
            <div className="journalit-profile-policy-change__columns">
              <ComparisonSide label={currentLabel}>
                <ReadOnlyRules
                  rules={before}
                  phase={current}
                  currencyCode={currencyCode}
                />
              </ComparisonSide>
              <ComparisonSide label={incomingLabel}>
                <ReadOnlyRules
                  rules={after}
                  phase={incoming}
                  currencyCode={currencyCode}
                />
              </ComparisonSide>
            </div>
          )}
        </section>
      ))}
      {payoutChanged && (
        <section className="journalit-profile-policy-change">
          <div className="journalit-profile-policy-change__heading">
            <strong>{t('account.prop-challenge.payout-rules.title')}</strong>
          </div>
          <div className="journalit-profile-policy-change__columns">
            <ComparisonSide label={currentLabel}>
              <ReadOnlyPayout phase={current} />
            </ComparisonSide>
            <ComparisonSide label={incomingLabel}>
              <ReadOnlyPayout phase={incoming} />
            </ComparisonSide>
          </div>
        </section>
      )}
      {!changes.length && !payoutChanged && (
        <p>{t('account.profiles.no-rule-changes')}</p>
      )}
    </div>
  );
}
