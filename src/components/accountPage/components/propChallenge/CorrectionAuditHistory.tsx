import React from 'react';
import type { PropChallengeConfig } from '../../../../services/propChallenge/types';
import { policyAt } from '../../../../services/propChallenge/PropChallengePolicyHistory';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { t } from '../../../../lang/helpers';
import { correctionHistoryDiff } from './correctionHistoryDiff';

type Audit = NonNullable<PropChallengeConfig['correctionHistory']>[number];

function CorrectionEntry({ audit }: { audit: Audit }) {
  const { formatValue } = useDisplayFormatter();
  const boundaries = new Set([
    audit.after.startedAt ?? audit.appliedAt,
    ...(audit.before.policyHistory ?? []).map(
      (revision) => revision.effectiveAt
    ),
    ...(audit.after.policyHistory ?? []).map(
      (revision) => revision.effectiveAt
    ),
  ]);
  const periods = Array.from(boundaries)
    .sort((a, b) => Date.parse(a) - Date.parse(b))
    .flatMap((at) => {
      const date = new Date(at);
      const changes = correctionHistoryDiff(
        { ...audit.before, ...policyAt(audit.before, date) },
        { ...audit.after, ...policyAt(audit.after, date) },
        audit.currencyCode,
        formatValue
      );
      return changes.length ? [{ at, changes }] : [];
    });
  return (
    <article className="journalit-correction-entry">
      <h4>
        <time dateTime={audit.appliedAt}>
          {new Date(audit.appliedAt).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </time>
        {' · '}
        {audit.before.name}
      </h4>
      {periods.map((period) => (
        <section className="journalit-correction-period" key={period.at}>
          {periods.length > 1 && (
            <p>
              {t('account.profiles.correction-period')} ·{' '}
              <time dateTime={period.at}>
                {new Date(period.at).toLocaleDateString()}
              </time>
            </p>
          )}
          {period.changes.map((change) => (
            <p className="journalit-correction-change" key={change.key}>
              <span>{change.group}</span> · <span>{change.label}</span>:{' '}
              <span>
                <span className="journalit-sr-only">
                  {t('account.profiles.correction-before')}:{' '}
                </span>
                {change.before}
              </span>
              <span aria-hidden="true"> → </span>
              <span>
                <span className="journalit-sr-only">
                  {t('account.profiles.correction-after')}:{' '}
                </span>
                {change.after}
              </span>
            </p>
          ))}
        </section>
      ))}
      {!periods.length && <p>{t('account.profiles.no-rule-changes')}</p>}
      <p>
        <a
          href={audit.correction.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('account.profiles.correction-source')}
        </a>
      </p>
    </article>
  );
}


export function CorrectionAuditHistory({
  config,
  phaseId,
}: {
  config: PropChallengeConfig;
  phaseId?: string;
}) {
  const { shouldMask } = useDisplayFormatter();
  const audits =
    config.correctionHistory?.filter(
      (audit) => phaseId === undefined || audit.before.id === phaseId
    ) ?? [];
  if (!audits.length) return null;
  if (shouldMask('money')) return <p>{t('settings.general.privacy-mode')}</p>;
  return (
    <div className="journalit-correction-history">
      {audits
        .slice()
        .reverse()
        .map((audit) => (
          <CorrectionEntry key={audit.id} audit={audit} />
        ))}
    </div>
  );
}
