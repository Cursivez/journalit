import React, { useMemo, useRef, useState } from 'react';
import { Menu, Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import { t, tPlural } from '../../lang/helpers';
import {
  buildTradeOperationPeriodDistribution,
  type AffectedPeriod,
  type ReviewPeriodLevel,
} from '../../services/tradeOperations/periodGrouping';
import { openReviewPeriod } from '../../services/tradeOperations/reviewNavigation';
import type { TradeOperationResult } from '../../services/tradeOperations/types';
import { useEventBus } from '../../hooks/useEventBus';
import {
  AlertTriangle,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  ListFilter,
  X,
} from '../shared/icons/ObsidianIcon';

type TradeOperationResultPresentation = 'toast' | 'inline' | 'inline-compact';

interface TradeOperationResultCardProps {
  plugin: JournalitPlugin;
  result: TradeOperationResult;
  presentation: TradeOperationResultPresentation;
  externalHeadingId?: string;
  onDismiss?: () => void;
  onBeforeNavigate?: () => void;
}

const PERIOD_LEVELS: ReviewPeriodLevel[] = [
  'days',
  'weeks',
  'months',
  'quarters',
  'years',
];
const MAX_PERIODS_PER_MENU_LEVEL = 5;
const MAX_REVIEW_MENU_OPTIONS = 12;

function periodLevelName(level: ReviewPeriodLevel): string {
  switch (level) {
    case 'days':
      return t('common.days');
    case 'weeks':
      return t('common.weeks');
    case 'months':
      return t('common.months');
    case 'quarters':
      return t('common.quarters');
    case 'years':
      return t('common.years');
  }
}

function periodKey(period: AffectedPeriod): string {
  return `${period.level}:${period.id}`;
}

function uniqueLabelSummary(labels: readonly string[]): string {
  const seen = new Set<string>();
  return labels
    .filter((label) => {
      const normalized = label.trim().toLocaleLowerCase();
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    })
    .join(', ');
}

export function getTradeOperationResultTitle(
  result: TradeOperationResult
): string {
  if (result.kind === 'sync') {
    const { created, updated } = result.counts;
    if (created > 0 && updated > 0) {
      return t(
        result.partial
          ? 'trade-handoff.summary.mixed-partial'
          : 'trade-handoff.summary.mixed-complete',
        {
          imported: tPlural('trade-handoff.trade-count', created),
          updated: tPlural('trade-handoff.trade-count', updated),
        }
      );
    }
    if (updated > 0) {
      return t(
        result.partial
          ? 'trade-handoff.summary.update-partial'
          : 'trade-handoff.summary.update-complete',
        { trades: tPlural('trade-handoff.trade-count', updated) }
      );
    }
  }
  return t(
    result.partial
      ? 'trade-handoff.summary.import-partial'
      : 'trade-handoff.summary.import-complete',
    {
      trades: tPlural('trade-handoff.trade-count', result.trades.length),
    }
  );
}

function toPeriodOption(period: AffectedPeriod): {
  period: AffectedPeriod;
  value: string;
  label: string;
} {
  return {
    period,
    value: periodKey(period),
    label: `${periodLevelName(period.level)} — ${period.label}`,
  };
}

export const TradeOperationResultCard: React.FC<
  TradeOperationResultCardProps
> = ({
  plugin,
  result,
  presentation,
  externalHeadingId,
  onDismiss,
  onBeforeNavigate,
}) => {
  const [, setCalendarSettingsVersion] = useState(0);
  useEventBus('settings:changed', (payload) => {
    if (
      payload.section === undefined ||
      payload.section === 'all' ||
      payload.section === 'trade'
    ) {
      setCalendarSettingsVersion((version) => version + 1);
    }
  });
  const distribution = buildTradeOperationPeriodDistribution(
    result.trades,
    plugin
  );
  const recommendedPeriods =
    distribution.groupsByLevel[distribution.recommendedLevel];
  const recommendedPeriod = recommendedPeriods[recommendedPeriods.length - 1];
  const periodOptions = useMemo(() => {
    const orderedLevels = [
      distribution.recommendedLevel,
      ...PERIOD_LEVELS.filter(
        (level) => level !== distribution.recommendedLevel
      ),
    ];
    const options: Array<{
      period: AffectedPeriod;
      value: string;
      label: string;
    }> = [];
    for (const level of orderedLevels) {
      const periods = distribution.groupsByLevel[level];
      if (
        periods.length === 0 ||
        periods.length > MAX_PERIODS_PER_MENU_LEVEL ||
        options.length + periods.length > MAX_REVIEW_MENU_OPTIONS
      ) {
        continue;
      }
      for (const period of periods) {
        options.push(toPeriodOption(period));
      }
    }
    if (options.length === 0) {
      for (const period of recommendedPeriods.slice(
        -MAX_PERIODS_PER_MENU_LEVEL
      )) {
        options.push(toPeriodOption(period));
      }
    }
    return options;
  }, [distribution, recommendedPeriods]);
  const isInline = presentation !== 'toast';
  const accountSummary =
    result.accountNames.length <= 1
      ? result.accountNames.join('')
      : `${result.accountNames[0]} +${result.accountNames.length - 1}`;
  const title = getTradeOperationResultTitle(result);
  const brokerSummary = uniqueLabelSummary(result.brokerLabels);
  const subtitleParts = [
    recommendedPeriod?.label,
    accountSummary,
    result.kind === 'import' ? brokerSummary : '',
  ].filter(Boolean);
  const subtitle = subtitleParts.join(' · ');
  const visibleRecommendedPeriods =
    isInline && recommendedPeriods.length <= MAX_PERIODS_PER_MENU_LEVEL
      ? recommendedPeriods
      : [];
  const navigationInFlightRef = useRef(false);

  const runNavigation = async (navigate: () => Promise<void>) => {
    if (navigationInFlightRef.current) return;
    navigationInFlightRef.current = true;
    try {
      onBeforeNavigate?.();
      await navigate();
    } finally {
      navigationInFlightRef.current = false;
    }
  };

  const openReview = async (period: AffectedPeriod) => {
    await runNavigation(async () => {
      const outcome = await openReviewPeriod(
        plugin,
        period.level,
        period.anchorDate
      );
      if (outcome === 'creation-disabled') {
        new Notice(t('trade-handoff.review.creation-disabled'));
      } else if (outcome === 'failed') {
        new Notice(t('trade-handoff.review.open-failed'));
      }
    });
  };

  const openReviewMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    const menu = new Menu();
    for (const option of periodOptions) {
      menu.addItem((item) =>
        item
          .setTitle(option.label)
          .setIcon(
            recommendedPeriod && option.value === periodKey(recommendedPeriod)
              ? 'calendar-check'
              : 'calendar-range'
          )
          .onClick(() => void openReview(option.period))
      );
    }
    const card = event.currentTarget.closest<HTMLElement>(
      '.journalit-trade-operation-result'
    );
    const rect =
      presentation === 'toast' && card
        ? card.getBoundingClientRect()
        : event.currentTarget.getBoundingClientRect();
    menu.showAtPosition(
      {
        x: presentation === 'toast' ? rect.right + 4 : rect.right,
        y: rect.bottom,
      },
      window.activeDocument
    );
  };

  const openScopedTradeLog = async () => {
    await runNavigation(async () => {
      try {
        await plugin.viewManager.openTradeLogView();
        plugin.ensureTradeOperationResultService().openTradeLogScope(result);
      } catch {
        new Notice(t('trade-handoff.trades.open-failed'));
      }
    });
  };

  const titleId =
    externalHeadingId ?? `trade-operation-result-title-${result.id}`;

  return (
    <section
      className={`journalit-trade-operation-result journalit-trade-operation-result--${presentation}${externalHeadingId ? ' journalit-trade-operation-result--external-heading' : ''}${result.partial ? ' journalit-trade-operation-result--partial' : ''}`}
      aria-labelledby={titleId}
      role={isInline && !externalHeadingId ? 'status' : undefined}
      aria-live={isInline && !externalHeadingId ? 'polite' : undefined}
      aria-atomic={isInline && !externalHeadingId ? 'true' : undefined}
    >
      {onDismiss ? (
        <button
          type="button"
          className="journalit-trade-operation-result__dismiss clickable-icon"
          aria-label={t('trade-handoff.action.dismiss')}
          onClick={onDismiss}
        >
          <X size={15} aria-hidden="true" />
        </button>
      ) : null}

      {externalHeadingId ? (
        <>
          <span
            className="journalit-sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {title}
          </span>
          {subtitle ? (
            <p className="journalit-trade-operation-result__external-subtitle">
              {subtitle}
            </p>
          ) : null}
        </>
      ) : (
        <div className="journalit-trade-operation-result__header">
          <span className="journalit-trade-operation-result__status-icon">
            {result.partial ? (
              <AlertTriangle size={18} aria-hidden="true" />
            ) : (
              <CheckCircle2 size={18} aria-hidden="true" />
            )}
          </span>
          <div className="journalit-trade-operation-result__heading-copy">
            <h3 id={titleId}>{title}</h3>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </div>
      )}

      <div className="journalit-trade-operation-result__actions">
        {recommendedPeriod ? (
          <div className="journalit-trade-operation-result__review-split">
            <button
              type="button"
              className="journalit-trade-operation-result__review-button mod-cta"
              onClick={() => void openReview(recommendedPeriod)}
            >
              <CalendarRange size={15} aria-hidden="true" />
              {t('trade-handoff.action.review-now')}
            </button>
            {periodOptions.length > 1 ? (
              <button
                type="button"
                className="journalit-trade-operation-result__review-menu-button mod-cta"
                aria-label={t('trade-handoff.periods.choose')}
                aria-haspopup="menu"
                onClick={openReviewMenu}
              >
                <ChevronDown size={14} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        ) : null}
        <button
          type="button"
          className="journalit-trade-operation-result__trades-button"
          onClick={() => void openScopedTradeLog()}
        >
          <ListFilter size={15} aria-hidden="true" />
          {tPlural(
            'trade-handoff.action.view-trades-count',
            result.trades.length
          )}
        </button>
      </div>

      {visibleRecommendedPeriods.length > 1 ? (
        <div className="journalit-trade-operation-result__recommended">
          <span className="journalit-trade-operation-result__recommended-label">
            {t('trade-handoff.periods.recommended')}
          </span>
          <div className="journalit-trade-operation-result__period-chips">
            {visibleRecommendedPeriods.map((period) => (
              <button
                key={periodKey(period)}
                type="button"
                className="journalit-trade-operation-result__period-chip"
                aria-label={t('trade-handoff.action.open-period', {
                  period: period.label,
                })}
                onClick={() => void openReview(period)}
              >
                <CalendarRange size={14} aria-hidden="true" />
                {period.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};
