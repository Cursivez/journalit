import React, { useState } from 'react';
import type {
  PropChallengePhase,
  PropChallengeRule,
} from '../../../../services/propChallenge/types';
import { sameProfileContent } from '../../../../services/propChallenge/PropChallengePolicyHistory';
import { t } from '../../../../lang/helpers';
import { RuleEditor } from './RuleEditor';
import { PayoutPolicyEditor } from './PayoutPolicyEditor';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';

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
  rule: PropChallengeRule;
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
    <span>{t('account.profiles.not-configured')}</span>
  );
}


export function ProfilePolicyComparison({
  current,
  incoming,
  currencyCode,
}: {
  current: PropChallengePhase;
  incoming: PropChallengePhase;
  currencyCode: string;
}) {
  const kinds = new Set(
    [...current.rules, ...incoming.rules].map((rule) => rule.kind)
  );
  const changes = Array.from(kinds).flatMap((kind) => {
    const before = current.rules.filter((rule) => rule.kind === kind);
    const after = incoming.rules.filter((rule) => rule.kind === kind);
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
          <div className="journalit-profile-policy-change__heading">
            <strong>{t(`account.prop-challenge.rule.${kind}`)}</strong>
          </div>
          {amountOnly(before, after) ? (
            <AmountChange
              before={before[0]}
              after={after[0]}
              currencyCode={currencyCode}
            />
          ) : (
            <div className="journalit-profile-policy-change__columns">
              <div>
                <span className="journalit-profile-policy-column-label">
                  {t('account.profiles.current')}
                </span>
                {before.length ? (
                  before.map((rule, index) => (
                    <ReadOnlyRule
                      key={rule.id}
                      rule={rule}
                      index={index}
                      phase={current}
                      currencyCode={currencyCode}
                    />
                  ))
                ) : (
                  <span>{t('account.profiles.not-configured')}</span>
                )}
              </div>
              <div>
                <span className="journalit-profile-policy-column-label">
                  {t('account.profiles.incoming')}
                </span>
                {after.length ? (
                  after.map((rule, index) => (
                    <ReadOnlyRule
                      key={rule.id}
                      rule={rule}
                      index={index}
                      phase={incoming}
                      currencyCode={currencyCode}
                    />
                  ))
                ) : (
                  <span>{t('account.profiles.not-configured')}</span>
                )}
              </div>
            </div>
          )}
        </section>
      ))}
      {payoutChanged && (
        <section className="journalit-profile-policy-change">
          <strong>{t('account.prop-challenge.payout-rules.title')}</strong>
          <div className="journalit-profile-policy-change__columns">
            <div>
              <span className="journalit-profile-policy-column-label">
                {t('account.profiles.current')}
              </span>
              <ReadOnlyPayout phase={current} />
            </div>
            <div>
              <span className="journalit-profile-policy-column-label">
                {t('account.profiles.incoming')}
              </span>
              <ReadOnlyPayout phase={incoming} />
            </div>
          </div>
        </section>
      )}
      {!changes.length && !payoutChanged && (
        <p>{t('account.profiles.no-rule-changes')}</p>
      )}
    </div>
  );
}
