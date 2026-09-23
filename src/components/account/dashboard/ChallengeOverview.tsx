import React, { useId, useMemo, useRef, useState } from 'react';
import { Info } from '../../shared/icons/ObsidianIcon';
import { ExplanationTooltipContent } from '../../shared/ExplanationTooltipContent';
import { Tooltip } from '../../shared/Tooltip';
import { Button } from '../../ui/Button';
import { t } from '../../../lang/helpers';
import {
  aggregatePropChallengeStats,
  aggregatePropFirmStats,
  aggregatePropPhaseStats,
} from '../../../services/propChallenge/PropChallengeAggregation';
import type { AccountPageData } from '../../../services/accountPage/types';
import {
  useChallengeScorecards,
  type ScorecardMetric,
} from './useChallengeScorecards';

const DEFAULT_VISIBLE_INSIGHT_ROWS = 4;
const MIN_HIDDEN_PHASE_ROWS_FOR_DISCLOSURE = 2;

type InsightTab = 'phases' | 'firms';

const ScorecardMetrics: React.FC<{
  className: string;
  metrics: ScorecardMetric[];
}> = ({ className, metrics }) => (
  <div className={className}>
    {metrics.map((metric) => (
      <div className="journalit-account-challenge-metric" key={metric.key}>
        <span className="journalit-account-challenge-metric-label">
          {metric.label}
          {metric.explanation && (
            <Tooltip
              content={
                <ExplanationTooltipContent
                  title={metric.label}
                  {...metric.explanation}
                />
              }
              delay={200}
              disclosureLabel={t(
                'account-dashboard.prop.tooltip.open-explanation',
                { metric: metric.label }
              )}
              preferredPosition="bottom"
              triggerClassName="journalit-account-challenge-info-trigger"
            >
              <Info
                aria-hidden="true"
                className="journalit-account-challenge-info-icon"
                size={10}
              />
            </Tooltip>
          )}
        </span>
        <strong
          className={`journalit-account-challenge-metric-value${metric.valueClassName ?? ''}`}
        >
          {metric.value}
        </strong>
      </div>
    ))}
  </div>
);

const InsightTabs: React.FC<{
  value: InsightTab;
  onChange: (value: InsightTab) => void;
  labelledBy: string;
  phaseTabId: string;
  firmTabId: string;
  phasePanelId: string;
  firmPanelId: string;
}> = ({
  value,
  onChange,
  labelledBy,
  phaseTabId,
  firmTabId,
  phasePanelId,
  firmPanelId,
}) => {
  const phaseRef = useRef<HTMLButtonElement>(null);
  const firmRef = useRef<HTMLButtonElement>(null);
  const tabs = [
    {
      value: 'phases' as const,
      label: t('account-dashboard.prop.tabs.phases'),
      id: phaseTabId,
      panelId: phasePanelId,
      ref: phaseRef,
    },
    {
      value: 'firms' as const,
      label: t('account-dashboard.prop.tabs.firms'),
      id: firmTabId,
      panelId: firmPanelId,
      ref: firmRef,
    },
  ];

  const selectTab = (next: InsightTab): void => {
    onChange(next);
    (next === 'phases' ? phaseRef : firmRef).current?.focus();
  };

  return (
    <div
      aria-labelledby={labelledBy}
      className="journalit-account-challenge-insight-tabs"
      role="tablist"
    >
      {tabs.map((tab, index) => (
        <button
          aria-controls={tab.panelId}
          aria-selected={value === tab.value}
          className={`journalit-account-challenge-insight-tab${value === tab.value ? ' is-active' : ''}`}
          id={tab.id}
          key={tab.value}
          onClick={() => onChange(tab.value)}
          onKeyDown={(event) => {
            let nextIndex: number | undefined;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
              nextIndex = (index + 1) % tabs.length;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
              nextIndex = (index - 1 + tabs.length) % tabs.length;
            } else if (event.key === 'Home') {
              nextIndex = 0;
            } else if (event.key === 'End') {
              nextIndex = tabs.length - 1;
            }
            if (nextIndex === undefined) return;
            event.preventDefault();
            selectTab(tabs[nextIndex].value);
          }}
          ref={tab.ref}
          role="tab"
          tabIndex={value === tab.value ? 0 : -1}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

type PhaseNameStats = ReturnType<
  typeof aggregatePropPhaseStats
>['phaseNames'][number];
type FirmNameStats = ReturnType<typeof aggregatePropFirmStats>['firms'][number];


function collapsePhaseRows(
  phaseNames: readonly PhaseNameStats[],
  elevatedName: string | undefined
): PhaseNameStats[] {
  const visible = phaseNames.slice(0, DEFAULT_VISIBLE_INSIGHT_ROWS);
  const elevatedIndex =
    elevatedName === undefined
      ? -1
      : phaseNames.findIndex((phase) => phase.name === elevatedName);

  return elevatedIndex < DEFAULT_VISIBLE_INSIGHT_ROWS
    ? visible
    : [...visible.slice(0, -1), phaseNames[elevatedIndex]];
}

const PhaseInsightsTable: React.FC<{
  rows: readonly PhaseNameStats[];
  mostFailedPhaseName: string | undefined;
  tableId: string;
  hiddenCount: number;
  expanded: boolean;
  onToggle: () => void;
  formatPercent: (value: number | undefined) => string;
  formatDuration: (days: number | undefined) => string;
}> = ({
  rows,
  mostFailedPhaseName,
  tableId,
  hiddenCount,
  expanded,
  onToggle,
  formatPercent,
  formatDuration,
}) => {
  if (rows.length === 0) {
    return (
      <p className="journalit-account-challenge-phase-empty">
        {t('account-dashboard.prop.phases.empty')}
      </p>
    );
  }

  return (
    <>
      <div className="journalit-account-challenge-phase-table" id={tableId}>
        <div className="journalit-account-challenge-phase-header">
          <span>{t('account-dashboard.prop.phases.phase')}</span>
          <span>{t('account-dashboard.prop.metrics.pass-rate')}</span>
          <span>{t('account-dashboard.prop.phases.average-duration')}</span>
        </div>
        {rows.map((phase) => (
          <div
            className="journalit-account-challenge-phase-row"
            key={phase.name}
          >
            <span className="journalit-account-challenge-phase-name">
              <strong>{phase.name}</strong>
              {phase.name === mostFailedPhaseName && (
                <span className="journalit-account-challenge-phase-badge">
                  {t('account-dashboard.prop.phases.most-failed')}
                </span>
              )}
            </span>
            <span>
              <span className="journalit-account-challenge-phase-inline-label">
                {t('account-dashboard.prop.metrics.pass-rate')}
              </span>
              {formatPercent(phase.passRate)}
            </span>
            <span>
              <span className="journalit-account-challenge-phase-inline-label">
                {t('account-dashboard.prop.phases.average-duration')}
              </span>
              {formatDuration(phase.averageDurationDays)}
            </span>
          </div>
        ))}
      </div>
      {hiddenCount > 0 && (
        <div className="journalit-account-challenge-phase-toggle-row">
          <Button
            aria-controls={tableId}
            aria-expanded={expanded}
            className="journalit-account-challenge-phase-toggle"
            onClick={onToggle}
            size="small"
            variant="plain"
          >
            {expanded
              ? t('account-dashboard.prop.phases.show-fewer')
              : t('account-dashboard.prop.phases.show-more', {
                  count: String(hiddenCount),
                })}
          </Button>
        </div>
      )}
    </>
  );
};

const FirmInsightsTable: React.FC<{
  rows: readonly FirmNameStats[];
  tableId: string;
  hiddenCount: number;
  expanded: boolean;
  onToggle: () => void;
  formatCount: (value: number) => string;
  formatPercent: (value: number | undefined) => string;
  formatNet: (firm: FirmNameStats) => string;
}> = ({
  rows,
  tableId,
  hiddenCount,
  expanded,
  onToggle,
  formatCount,
  formatPercent,
  formatNet,
}) => (
  <>
    <div className="journalit-account-challenge-firm-table" id={tableId}>
      <div className="journalit-account-challenge-firm-header">
        <span>{t('account-dashboard.prop.firms.firm')}</span>
        <span>{t('account-dashboard.prop.firms.attempts')}</span>
        <span>{t('account-dashboard.prop.metrics.pass-rate')}</span>
        <span>{t('account-dashboard.prop.metrics.net')}</span>
      </div>
      {rows.map((firm) => (
        <div className="journalit-account-challenge-firm-row" key={firm.name}>
          <span className="journalit-account-challenge-firm-name">
            <strong>{firm.name}</strong>
          </span>
          <span>
            <span className="journalit-account-challenge-firm-inline-label">
              {t('account-dashboard.prop.firms.attempts')}
            </span>
            {formatCount(firm.total)}
          </span>
          <span>
            <span className="journalit-account-challenge-firm-inline-label">
              {t('account-dashboard.prop.metrics.pass-rate')}
            </span>
            {formatPercent(firm.passRate)}
          </span>
          <span>
            <span className="journalit-account-challenge-firm-inline-label">
              {t('account-dashboard.prop.metrics.net')}
            </span>
            {formatNet(firm)}
          </span>
        </div>
      ))}
    </div>
    {hiddenCount > 0 && (
      <div className="journalit-account-challenge-phase-toggle-row">
        <Button
          aria-controls={tableId}
          aria-expanded={expanded}
          className="journalit-account-challenge-phase-toggle"
          onClick={onToggle}
          size="small"
          variant="plain"
        >
          {expanded
            ? t('account-dashboard.prop.phases.show-fewer')
            : t('account-dashboard.prop.phases.show-more', {
                count: String(hiddenCount),
              })}
        </Button>
      </div>
    )}
  </>
);

const ChallengeInsightsPanel: React.FC<{
  phaseStats: ReturnType<typeof aggregatePropPhaseStats>;
  firmStats: ReturnType<typeof aggregatePropFirmStats>;
  hideFailureSignal: boolean;
  formatCount: (value: number) => string;
  formatPercent: (value: number | undefined) => string;
  formatDuration: (days: number | undefined) => string;
  formatFirmNet: (firm: FirmNameStats) => string;
}> = ({
  phaseStats,
  firmStats,
  hideFailureSignal,
  formatCount,
  formatPercent,
  formatDuration,
  formatFirmNet,
}) => {
  const [showAllPhases, setShowAllPhases] = useState(false);
  const [showAllFirms, setShowAllFirms] = useState(false);
  const [selectedTab, setSelectedTab] = useState<InsightTab>('phases');
  const phaseTableId = useId();
  const firmTableId = useId();
  const headingId = useId();
  const phaseTabId = useId();
  const firmTabId = useId();
  const phasePanelId = useId();
  const firmPanelId = useId();
  const hasFirmTabs = firmStats.firms.length > 1;
  const activeTab = hasFirmTabs ? selectedTab : 'phases';
  const mostFailedPhaseName = hideFailureSignal
    ? undefined
    : phaseStats.mostFailedPhase?.name;
  const overflowPhaseCount = Math.max(
    0,
    phaseStats.phaseNames.length - DEFAULT_VISIBLE_INSIGHT_ROWS
  );
  const hiddenPhaseCount =
    overflowPhaseCount >= MIN_HIDDEN_PHASE_ROWS_FOR_DISCLOSURE
      ? overflowPhaseCount
      : 0;
  const phaseRows =
    showAllPhases || hiddenPhaseCount === 0
      ? phaseStats.phaseNames
      : collapsePhaseRows(phaseStats.phaseNames, mostFailedPhaseName);
  const hiddenFirmCount = Math.max(
    0,
    firmStats.firms.length - DEFAULT_VISIBLE_INSIGHT_ROWS
  );
  const firmRows = showAllFirms
    ? firmStats.firms
    : firmStats.firms.slice(0, DEFAULT_VISIBLE_INSIGHT_ROWS);

  return (
    <section
      aria-labelledby={headingId}
      className="journalit-account-challenge-panel"
    >
      <h3 className="journalit-account-challenge-panel-heading" id={headingId}>
        {t(
          hasFirmTabs
            ? 'account-dashboard.prop.insights.title'
            : 'account-dashboard.prop.phases.title'
        )}
      </h3>
      {hasFirmTabs && (
        <InsightTabs
          firmPanelId={firmPanelId}
          firmTabId={firmTabId}
          labelledBy={headingId}
          onChange={setSelectedTab}
          phasePanelId={phasePanelId}
          phaseTabId={phaseTabId}
          value={activeTab}
        />
      )}
      {activeTab === 'phases' ? (
        <div
          aria-labelledby={hasFirmTabs ? phaseTabId : undefined}
          id={phasePanelId}
          role={hasFirmTabs ? 'tabpanel' : undefined}
          tabIndex={hasFirmTabs ? 0 : undefined}
        >
          <PhaseInsightsTable
            expanded={showAllPhases}
            formatDuration={formatDuration}
            formatPercent={formatPercent}
            hiddenCount={hiddenPhaseCount}
            mostFailedPhaseName={mostFailedPhaseName}
            onToggle={() => setShowAllPhases((current) => !current)}
            rows={phaseRows}
            tableId={phaseTableId}
          />
        </div>
      ) : (
        <div
          aria-labelledby={firmTabId}
          id={firmPanelId}
          role="tabpanel"
          tabIndex={0}
        >
          <FirmInsightsTable
            expanded={showAllFirms}
            formatCount={formatCount}
            formatNet={formatFirmNet}
            formatPercent={formatPercent}
            hiddenCount={hiddenFirmCount}
            onToggle={() => setShowAllFirms((current) => !current)}
            rows={firmRows}
            tableId={firmTableId}
          />
        </div>
      )}
    </section>
  );
};

export const ChallengeOverview: React.FC<{
  accounts: readonly Pick<AccountPageData, 'account'>[];
}> = ({ accounts }) => {
  const economicsHeadingId = useId();
  const accountData = useMemo(
    () => accounts.map(({ account }) => account),
    [accounts]
  );
  const stats = useMemo(
    () => aggregatePropChallengeStats(accountData),
    [accountData]
  );
  const phaseStats = useMemo(
    () => aggregatePropPhaseStats(accountData),
    [accountData]
  );
  const firmStats = useMemo(
    () => aggregatePropFirmStats(accountData),
    [accountData]
  );
  const {
    summaryMetrics,
    economicsMetrics,
    formatCount,
    formatPercent,
    formatDuration,
    formatFirmNet,
    hideFailureSignal,
  } = useChallengeScorecards(stats, firmStats);

  return (
    <section className="journalit-account-challenge-overview">
      <ScorecardMetrics
        className="journalit-account-challenge-summary"
        metrics={summaryMetrics}
      />
      <div className="journalit-account-challenge-insights">
        <section
          aria-labelledby={economicsHeadingId}
          className="journalit-account-challenge-panel journalit-account-challenge-economics-panel"
        >
          <h3
            className="journalit-account-challenge-panel-heading"
            id={economicsHeadingId}
          >
            {t('account-dashboard.prop.economics.title')}
          </h3>
          <ScorecardMetrics
            className="journalit-account-challenge-economics"
            metrics={economicsMetrics}
          />
        </section>
        <ChallengeInsightsPanel
          firmStats={firmStats}
          formatCount={formatCount}
          formatDuration={formatDuration}
          formatFirmNet={formatFirmNet}
          formatPercent={formatPercent}
          hideFailureSignal={hideFailureSignal}
          phaseStats={phaseStats}
        />
      </div>
    </section>
  );
};
