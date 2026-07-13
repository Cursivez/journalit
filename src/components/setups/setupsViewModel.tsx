import React from 'react';
import { Component, Modal, TFile } from 'obsidian';
import { createRoot, type Root } from 'react-dom/client';

import type JournalitPlugin from '../../main';
import { normalizeSetupLinkedNotePath } from '../../services/setup/linkedNotePaths';
import type {
  Setup,
  SetupMetrics,
  SetupRule,
  SetupRuleCategory,
  SetupRuleGroup,
  SetupStatus,
} from '../../services/setup/types';
import { t } from '../../lang/helpers';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Globe,
  Image,
  ScanSearch,
  TrendingDown,
  TrendingUp,
} from '../shared/icons/ObsidianIcon';
import { NoteFilePicker } from '../shared/NoteFilePicker';
import { PercentValue, RMultipleValue } from '../shared/display';
import type {
  PnLChartDataPoint,
  TradesChartDataPoint,
} from '../../utils/chartUtils';
import { prepareDrawdownChartData } from '../../utils/chartUtils';
import type { Trade as DashboardTrade } from '../dashboard/utils/dataUtils';
import { formatDateDisplay } from '../../utils/dateUtils';
import type { AnalyticsDateBasis } from '../../settings/types';
import { inferStoredTradeType } from '../../utils/tradeTypeRouting';
import {
  getEffectivePnL,
  getResolvedWeightedAverageExitPrice,
  getWeightedAverageEntryPrice,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';
import { getTradeAnalyticsDate } from '../../utils/tradeAnalyticsDate';
import { calculateEffectiveRMultiple } from '../../utils/formatting';
import { calculateDirectionalPriceDiff } from '../../utils/pnlCalculation';
import { calculateWinRateExcludingBreakeven } from '../../utils/breakEvenRange';
import { getTradeDirectionDisplayLabel } from '../../utils/tradeDirectionDisplay';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import type {
  MetricKey,
  SetupAttentionItem,
  SetupCardHealth,
  SetupCardTone,
  SetupCompareBreakdown,
  SetupCompareChartMetric,
  SetupCompareEdgeReason,
  SetupCompareEdgeSummary,
  SetupCompareMetricKey,
  SetupCompareMetrics,
  SetupCompareViewModel,
  SetupDetailMetricTone,
  SetupDetailPerformancePoint,
  SetupLinkedTrade,
  SetupOverviewChartSettings,
  SetupOverviewChartSettingsAction,
  SetupOverviewPnlChartModel,
  SetupOverviewPnlPoint,
  SetupPairMetricKey,
  SetupPairSummary,
  SetupPairTrendPoint,
  SetupPairViewModel,
  SetupRuleGroupViewModel,
  SetupSparklineModel,
  SetupTradeIndex,
  SetupViewModel,
  TradePnlCompareInput,
  TradeRecordForSetups,
} from './setupsViewTypes';

const OVERVIEW_R_METRIC_KEYS = new Set<MetricKey>([
  'cumulativeR',
  'expectedR',
  'totalR',
]);
const SETUP_RULE_CATEGORY_ORDER: SetupRuleCategory[] = [
  'context',
  'entry',
  'risk',
  'management',
  'exit',
  'invalidation',
  'psychology',
];

const CompareSignedDeltaValue: React.FC<{
  kind: 'pnl' | 'metric';
  value: number;
  precision?: number;
}> = ({ kind, value, precision }) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isMasked = shouldMask(kind);
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  const displayValue = formatValue({
    kind,
    value: Math.abs(value),
    precision,
  });

  return (
    <span className="journalit-setups-compare-edge-delta">
      {isMasked ? displayValue : `${sign}${displayValue}`}
    </span>
  );
};

CompareSignedDeltaValue.displayName = 'CompareSignedDeltaValue';

export function getCompletenessBadges(setup: Setup): string[] {
  const badges: string[] = [];
  if (!hasSetupPlaybook(setup)) {
    badges.push(t('setups.view.completeness.incomplete-playbook'));
  }
  if (setup.rules.length === 0) {
    badges.push(t('setups.view.completeness.no-rules'));
  }
  if (setup.linkedNotes.length === 0) {
    badges.push(t('setups.view.completeness.no-linked-notes'));
  }
  return badges;
}

interface SetupScreenshot {
  key: string;
  imagePath: string;
  sourcePath: string;
}

export function getRecentSetupScreenshots(
  linkedTrades: SetupLinkedTrade[]
): SetupScreenshot[] {
  return Array.from(linkedTrades)
    .sort(
      (a, b) => getTradeSortTime(b).getTime() - getTradeSortTime(a).getTime()
    )
    .flatMap((trade) =>
      trade.images.map((imagePath, imageIndex) => ({
        key: JSON.stringify([trade.path, imagePath, imageIndex]),
        imagePath,
        sourcePath: trade.path,
      }))
    );
}

export function getSetupBriefHealthItems(
  setup: Setup,
  linkedTradeCount: number,
  screenshotCount: number
): Array<{ key: string; label: string; value: string; complete: boolean }> {
  const hasPlaybook = hasSetupPlaybook(setup);

  return [
    {
      key: 'playbook',
      label: t('setups.view.detail.brief.health.playbook'),
      value: hasPlaybook
        ? t('setups.view.detail.brief.status.complete')
        : t('setups.view.detail.brief.status.missing'),
      complete: hasPlaybook,
    },
    {
      key: 'rules',
      label: t('setups.view.detail.brief.health.rules'),
      value: t('setups.view.detail.brief.count.rules', {
        count: String(setup.rules.length),
      }),
      complete: setup.rules.length > 0,
    },
    {
      key: 'notes',
      label: t('setups.view.detail.brief.health.notes'),
      value: t('setups.view.detail.brief.count.notes', {
        count: String(setup.linkedNotes.length),
      }),
      complete: setup.linkedNotes.length > 0,
    },
    {
      key: 'screenshots',
      label: t('setups.view.detail.brief.health.screenshots'),
      value: t('setups.view.detail.brief.count.images', {
        count: String(screenshotCount),
      }),
      complete: screenshotCount > 0,
    },
    {
      key: 'trades',
      label: t('setups.view.detail.brief.health.trades'),
      value: t('setups.view.detail.brief.count.trades', {
        count: String(linkedTradeCount),
      }),
      complete: linkedTradeCount > 0,
    },
  ];
}

function hasSetupPlaybook(setup: Setup): boolean {
  return (
    setup.playbookMarkdown.trim().length > 0 || setup.linkedNotes.length > 0
  );
}

export function buildSetupAttentionItems(
  viewModel: SetupViewModel,
  linkedTrades: SetupLinkedTrade[],
  screenshotCount: number,
  isPerformanceMasked: boolean
): SetupAttentionItem[] {
  const { setup, metrics } = viewModel;
  const items: SetupAttentionItem[] = [];
  const hasPlaybook = hasSetupPlaybook(setup);
  const hasRules = setup.rules.length > 0;

  if (!hasPlaybook) {
    items.push({
      key: 'no-playbook-note',
      severity: 'warning',
      icon: BookOpen,
      title: t('setups.view.detail.attention.no-playbook-title'),
      detail: t('setups.view.detail.attention.no-playbook-detail'),
    });
  }

  if (!hasRules) {
    items.push({
      key: 'no-rules',
      severity: 'warning',
      icon: ClipboardCheck,
      title: t('setups.view.detail.attention.no-rules-title'),
      detail: t('setups.view.detail.attention.no-rules-detail'),
    });
  }

  if (linkedTrades.length === 0) {
    items.push({
      key: 'no-live-trades',
      severity: 'info',
      icon: ScanSearch,
      title: t('setups.view.detail.attention.no-trades-title'),
      detail: t('setups.view.detail.attention.no-trades-detail'),
    });
  }

  if (linkedTrades.length > 0 && screenshotCount === 0) {
    items.push({
      key: 'no-screenshots',
      severity: 'info',
      icon: Image,
      title: t('setups.view.detail.attention.no-screenshots-title'),
      detail: t('setups.view.detail.attention.no-screenshots-detail'),
    });
  }

  if (metrics.inactivityStreak >= 30 && metrics.totalTrades > 0) {
    items.push({
      key: 'stale-setup',
      severity: 'info',
      icon: Calendar,
      title: t('setups.view.detail.attention.stale-title'),
      detail: t('setups.view.detail.attention.stale-detail', {
        count: String(metrics.inactivityStreak),
      }),
    });
  }

  if (!isPerformanceMasked && metrics.totalTrades >= 5) {
    if (metrics.profitFactor > 0 && metrics.profitFactor < 1) {
      items.push({
        key: 'profit-factor-below-one',
        severity: 'critical',
        icon: AlertTriangle,
        title: t('setups.view.detail.attention.profit-factor-title'),
        detail: t('setups.view.detail.attention.profit-factor-detail'),
      });
    } else if (metrics.expectedValue < 0) {
      items.push({
        key: 'negative-expectancy',
        severity: 'warning',
        icon: TrendingDown,
        title: t('setups.view.detail.attention.expectancy-title'),
        detail: t('setups.view.detail.attention.expectancy-detail'),
      });
    }
  }

  return items;
}

export function getSetupBriefProfileRows(
  setup: Setup
): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string }> = [];

  if (setup.direction) {
    rows.push({
      label: t('setups.view.detail.brief.profile.direction'),
      value: getSetupDirectionLabel(setup.direction),
    });
  }
  if (setup.preferredSessions.length > 0) {
    rows.push({
      label: t('setups.view.detail.brief.profile.sessions'),
      value: setup.preferredSessions.join(', '),
    });
  }
  if (setup.preferredTimeframes.length > 0) {
    rows.push({
      label: t('setups.view.detail.brief.profile.timeframes'),
      value: setup.preferredTimeframes.join(', '),
    });
  }
  if (setup.preferredTickers.length > 0) {
    rows.push({
      label: t('setups.view.detail.brief.profile.tickers'),
      value: setup.preferredTickers.join(', '),
    });
  }

  return rows;
}

function getSetupDirectionLabel(
  direction: NonNullable<Setup['direction']>
): string {
  switch (direction) {
    case 'long':
      return t('setups.view.detail.brief.direction.long');
    case 'short':
      return t('setups.view.detail.brief.direction.short');
    case 'both':
      return t('setups.view.detail.brief.direction.both');
  }
}

export function triggerSetupLinkedNoteHover({
  plugin,
  event,
  hoverParent,
  targetEl,
  linktext,
  sourcePath,
}: {
  plugin: JournalitPlugin;
  event: MouseEvent;
  hoverParent: Component;
  targetEl: HTMLElement;
  linktext: string;
  sourcePath: string;
}): void {
  plugin.app.workspace.trigger('hover-link', {
    event,
    source: 'preview',
    hoverParent,
    targetEl,
    linktext,
    sourcePath,
  });
}

export async function openSetupLinkedNote(
  plugin: JournalitPlugin,
  event: React.MouseEvent<HTMLAnchorElement>,
  notePath: string,
  sourcePath: string
): Promise<void> {
  event.preventDefault();

  await openSetupLinkedNotePath(plugin, notePath, sourcePath);
}

export async function openSetupLinkedNotePath(
  plugin: JournalitPlugin,
  notePath: string,
  sourcePath: string
): Promise<void> {
  const linkedFile = plugin.app.metadataCache.getFirstLinkpathDest(
    notePath,
    sourcePath
  );
  if (linkedFile instanceof TFile) {
    await plugin.openFile(linkedFile.path, true);
    return;
  }

  if (plugin.app.vault.getAbstractFileByPath(notePath)) {
    await plugin.openFile(notePath, true);
    return;
  }

  await plugin.app.workspace.openLinkText(notePath, sourcePath, true);
}

class SetupLinkedNotesModal extends Modal {
  constructor(
    private plugin: JournalitPlugin,
    private setupName: string,
    private setupSourcePath: string,
    private linkedNotes: string[]
  ) {
    super(plugin.app);
    this.titleEl.setText(
      t('setups.view.detail.brief.linked-notes-modal.title')
    );
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass('journalit-setups-linked-notes-modal');

    contentEl.createEl('p', {
      cls: 'journalit-setups-linked-notes-modal__subtitle',
      text: t('setups.view.detail.brief.linked-notes-modal.subtitle', {
        count: String(this.linkedNotes.length),
        name: this.setupName,
      }),
    });

    const list = contentEl.createEl('ul', {
      cls: 'journalit-setups-linked-notes-modal__list',
    });

    this.linkedNotes.forEach((note) => {
      const item = list.createEl('li');
      const link = item.createEl('a', {
        attr: { href: note },
        text: note,
      });
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this.close();
        void openSetupLinkedNotePath(this.plugin, note, this.setupSourcePath);
      });
    });
  }
}

class SetupPlaybookNoteModal extends Modal {
  private root: Root | null = null;

  constructor(
    private plugin: JournalitPlugin,
    private setup: Setup,
    private onSelectPlaybookNote: (filePath: string) => void
  ) {
    super(plugin.app);
    this.titleEl.setText(t('home.widget.embedded-note.select-note'));
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass('journalit-setups-playbook-note-modal');

    const rootEl = contentEl.createDiv({
      cls: 'journalit-setups-playbook-note-modal__picker',
    });
    this.root = createRoot(rootEl);
    this.root.render(
      <NoteFilePicker
        files={this.getCandidateFiles()}
        title={t('home.widget.embedded-note.select-note')}
        showHeader={false}
        emptyMessage={t('setups.view.detail.playbook-note-modal.empty')}
        onSelectFile={(file) => void this.linkPlaybookNote(file.path)}
      />
    );
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
  }

  private getCandidateFiles(): TFile[] {
    return this.plugin.app.vault
      .getFiles()
      .filter(
        (file) => file.extension === 'md' || file.extension === 'excalidraw'
      )
      .sort((a, b) => a.path.localeCompare(b.path));
  }

  private async linkPlaybookNote(filePath: string): Promise<void> {
    this.onSelectPlaybookNote(filePath);
    this.close();

    try {
      const setupService = await this.plugin.serviceManager.getSetupService();
      await setupService.updateSetup(this.setup.id, {
        linkedNotes: prioritizeSetupLinkedNote(
          this.setup.linkedNotes,
          filePath
        ),
      });
    } catch (error) {
      console.error('Failed to link setup playbook note:', error);
    }
  }
}

export function prioritizeSetupLinkedNote(
  linkedNotes: string[],
  playbookNotePath: string
): string[] {
  const playbookNoteKey = normalizeSetupLinkedNotePath(playbookNotePath);
  return [
    playbookNotePath,
    ...linkedNotes.filter(
      (notePath) => normalizeSetupLinkedNotePath(notePath) !== playbookNoteKey
    ),
  ];
}

export function openSetupPlaybookNoteModal(
  plugin: JournalitPlugin,
  setup: Setup,
  onSelectPlaybookNote: (filePath: string) => void
): void {
  new SetupPlaybookNoteModal(plugin, setup, onSelectPlaybookNote).open();
}

export function openSetupLinkedNotesModal(
  plugin: JournalitPlugin,
  setupName: string,
  setupSourcePath: string,
  linkedNotes: string[]
): void {
  new SetupLinkedNotesModal(
    plugin,
    setupName,
    setupSourcePath,
    linkedNotes
  ).open();
}

export function getMetricValue(
  metrics: SetupMetrics,
  key: MetricKey,
  rMetrics?: SetupCompareMetrics
): number {
  switch (key) {
    case 'cumulativePnl':
    case 'totalPnL':
      return metrics.totalPnL;
    case 'cumulativeR':
    case 'totalR':
      return rMetrics?.totalR ?? 0;
    case 'expectedR':
      return rMetrics?.expectancyR ?? 0;
    case 'expectedValue':
      return metrics.expectedValue;
    case 'winRate':
      return metrics.winRate;
    case 'profitFactor':
      return metrics.profitFactor;
    case 'totalTrades':
      return metrics.totalTrades;
  }
}

export function buildSetupRankingChartData(
  viewModels: SetupViewModel[],
  metricKey: MetricKey,
  isChartMasked: boolean,
  rMetricsBySetupId: Map<string, SetupCompareMetrics>
) {
  const profitFactorChartCap = getProfitFactorChartCap(
    viewModels.map(({ metrics }) => metrics.profitFactor)
  );
  return viewModels
    .flatMap(({ setup, metrics }) => {
      const rMetrics = rMetricsBySetupId.get(setup.id);
      if (OVERVIEW_R_METRIC_KEYS.has(metricKey) && !hasRMetrics(rMetrics)) {
        return [];
      }
      const rawValue = getMetricValue(metrics, metricKey, rMetrics);
      const chartValue =
        metricKey === 'profitFactor'
          ? getProfitFactorChartValue(rawValue, profitFactorChartCap)
          : rawValue;
      return [
        {
          id: setup.id,
          name: setup.name,
          value: isChartMasked ? 1 : chartValue,
          rawValue,
          trades: metrics.totalTrades,
          winRate: metrics.winRate,
          profitFactor: metrics.profitFactor,
        },
      ];
    })
    .sort((a, b) => {
      if (isChartMasked) return a.name.localeCompare(b.name);
      return b.rawValue - a.rawValue;
    });
}

export function buildSetupPairRankingChartData(
  sortedPairModels: SetupPairViewModel[],
  metricKey: SetupPairMetricKey,
  isChartMasked: boolean
) {
  const pairChartModels = getSetupPairChartModels(sortedPairModels, metricKey);
  const profitFactorChartCap = getProfitFactorChartCap(
    pairChartModels.map((pair) => pair.metrics.profitFactor)
  );
  return pairChartModels.map((pair) => {
    const rawValue = getSetupPairMetricValue(pair, metricKey);
    const chartValue =
      metricKey === 'profitFactor'
        ? getProfitFactorChartValue(rawValue, profitFactorChartCap)
        : rawValue;
    return {
      id: pair.key,
      name: formatSetupPairChartLabel(pair.setupNames),
      value: isChartMasked ? 1 : chartValue,
      rawValue,
      trades: pair.metrics.totalTrades,
      winRate: pair.metrics.winRate,
      profitFactor: pair.metrics.profitFactor,
    };
  });
}

function getProfitFactorChartCap(values: number[]): number {
  let maxFiniteValue = 2;
  for (const value of values) {
    if (Number.isFinite(value)) {
      maxFiniteValue = Math.max(maxFiniteValue, value);
    }
  }
  return maxFiniteValue;
}

function getProfitFactorChartValue(
  profitFactor: number,
  chartCap: number
): number {
  const finiteProfitFactor = Number.isFinite(profitFactor)
    ? profitFactor
    : chartCap;
  return finiteProfitFactor - 1;
}

const SETUP_MONITOR_EXPECTANCY_R_THRESHOLD = 0.25;

export function getSetupCardHealth(viewModel: SetupViewModel): SetupCardHealth {
  const hasPerformanceSample = viewModel.metrics.totalTrades > 0;
  if (
    (hasPerformanceSample &&
      (viewModel.metrics.expectedValue < 0 ||
        viewModel.metrics.profitFactor < 1)) ||
    viewModel.completenessBadges.length > 1
  ) {
    return 'review';
  }

  if (
    viewModel.setup.status === 'testing' ||
    viewModel.metrics.expectedValue < SETUP_MONITOR_EXPECTANCY_R_THRESHOLD ||
    viewModel.metrics.winRate < 50
  ) {
    return 'monitor';
  }

  return 'good';
}

export function getSetupCardExpectancyTone(
  expectedValue: number | null,
  isMasked: boolean
): SetupCardTone {
  if (isMasked || expectedValue === null || expectedValue === 0)
    return 'neutral';
  return expectedValue > 0 ? 'positive' : 'negative';
}

export function buildSetupSparklineModel(
  linkedTrades: SetupLinkedTrade[],
  useRMultiples: boolean
): SetupSparklineModel {
  const contributingTrades = linkedTrades.filter((trade) => {
    if (!trade.pnlContributing) return false;
    return useRMultiples
      ? typeof trade.rMultiple === 'number' && Number.isFinite(trade.rMultiple)
      : Number.isFinite(trade.pnl);
  });
  const values = [0];
  let cumulative = 0;

  for (const trade of contributingTrades) {
    const rawValue = useRMultiples ? trade.rMultiple : trade.pnl;
    if (typeof rawValue !== 'number' || !Number.isFinite(rawValue)) continue;
    cumulative += rawValue;
    values.push(cumulative);
  }

  if (values.length === 1) {
    return buildEmptySetupSparklineModel();
  }

  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(0, ...values);
  const span = maxValue - minValue;
  const padding = span === 0 ? Math.max(Math.abs(maxValue), 1) : span * 0.14;
  const domainMin = minValue - padding;
  const domainMax = maxValue + padding;
  const chartTop = 8;
  const chartBottom = 60;
  const xPadding = 8;
  const denominator = Math.max(1, values.length - 1);
  const coordinates = values.map((value, index): SparklinePoint => {
    const x = xPadding + ((320 - xPadding * 2) * index) / denominator;
    const normalized =
      domainMax === domainMin
        ? 0.5
        : (value - domainMin) / (domainMax - domainMin);
    const y = chartBottom - normalized * (chartBottom - chartTop);
    return { x, y, value };
  });
  const zeroY = mapSparklineValueToY(
    0,
    domainMin,
    domainMax,
    chartTop,
    chartBottom
  );
  return {
    tradeCount: values.length - 1,
    zeroY,
    positiveAreaPaths: buildSignedSparklineAreaPaths(
      coordinates,
      'positive',
      zeroY
    ),
    negativeAreaPaths: buildSignedSparklineAreaPaths(
      coordinates,
      'negative',
      zeroY
    ),
    positivePaths: buildSignedSparklinePaths(coordinates, 'positive'),
    negativePaths: buildSignedSparklinePaths(coordinates, 'negative'),
    neutralPaths: buildSignedSparklinePaths(coordinates, 'neutral'),
    finalValue: values[values.length - 1],
  };
}

interface SparklinePoint {
  x: number;
  y: number;
  value: number;
}

function buildEmptySetupSparklineModel(): SetupSparklineModel {
  const zeroY = 34;
  return {
    tradeCount: 0,
    zeroY,
    positiveAreaPaths: [],
    negativeAreaPaths: [],
    positivePaths: [],
    negativePaths: [],
    neutralPaths: [],
    finalValue: 0,
  };
}

function mapSparklineValueToY(
  value: number,
  domainMin: number,
  domainMax: number,
  chartTop: number,
  chartBottom: number
): number {
  const normalized =
    domainMax === domainMin
      ? 0.5
      : (value - domainMin) / (domainMax - domainMin);
  return chartBottom - normalized * (chartBottom - chartTop);
}

function pointsToLinePath(points: SparklinePoint[]): string {
  if (points.length === 0) return '';
  return points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
    )
    .join(' ');
}

function pointsToSmoothPath(points: SparklinePoint[]): string {
  if (points.length <= 2) return pointsToLinePath(points);

  return points.reduce((path, point, index, allPoints) => {
    if (index === 0) return `M ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;

    const previous = allPoints[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX.toFixed(1)} ${previous.y.toFixed(1)}, ${controlX.toFixed(1)} ${point.y.toFixed(1)}, ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }, '');
}

function buildSignedSparklinePaths(
  points: SparklinePoint[],
  tone: SetupCardTone
): string[] {
  if (points.length < 2) return [];
  const paths: string[] = [];
  let currentRun: SparklinePoint[] = [];

  const flushRun = () => {
    if (currentRun.length >= 2) {
      paths.push(pointsToSmoothPath(currentRun));
    }
    currentRun = [];
  };

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const segmentPoints = splitSparklineSegmentAtZero(previous, current);

    for (
      let segmentIndex = 1;
      segmentIndex < segmentPoints.length;
      segmentIndex += 1
    ) {
      const start = segmentPoints[segmentIndex - 1];
      const end = segmentPoints[segmentIndex];
      if (getSparklineSegmentTone(start.value, end.value) !== tone) {
        flushRun();
        continue;
      }

      if (currentRun.length === 0) {
        currentRun = [start, end];
      } else {
        currentRun.push(end);
      }
    }
  }

  flushRun();
  return paths;
}

function buildSignedSparklineAreaPaths(
  points: SparklinePoint[],
  tone: SetupCardTone,
  zeroY: number
): string[] {
  return buildSignedSparklineRuns(points, tone).map((run) =>
    buildSparklineAreaPath(run, zeroY)
  );
}

function buildSignedSparklineRuns(
  points: SparklinePoint[],
  tone: SetupCardTone
): SparklinePoint[][] {
  if (points.length < 2) return [];
  const runs: SparklinePoint[][] = [];
  let currentRun: SparklinePoint[] = [];

  const flushRun = () => {
    if (currentRun.length >= 2) runs.push(currentRun);
    currentRun = [];
  };

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const segmentPoints = splitSparklineSegmentAtZero(previous, current);

    for (
      let segmentIndex = 1;
      segmentIndex < segmentPoints.length;
      segmentIndex += 1
    ) {
      const start = segmentPoints[segmentIndex - 1];
      const end = segmentPoints[segmentIndex];
      if (getSparklineSegmentTone(start.value, end.value) !== tone) {
        flushRun();
        continue;
      }

      if (currentRun.length === 0) {
        currentRun = [start, end];
      } else {
        currentRun.push(end);
      }
    }
  }

  flushRun();
  return runs;
}

function buildSparklineAreaPath(
  points: SparklinePoint[],
  zeroY: number
): string {
  if (points.length < 2) return '';
  const line = pointsToSmoothPath(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${line} L ${last.x.toFixed(1)} ${zeroY.toFixed(1)} L ${first.x.toFixed(1)} ${zeroY.toFixed(1)} Z`;
}

function splitSparklineSegmentAtZero(
  start: SparklinePoint,
  end: SparklinePoint
): SparklinePoint[] {
  if (
    start.value === 0 ||
    end.value === 0 ||
    Math.sign(start.value) === Math.sign(end.value)
  ) {
    return [start, end];
  }

  const ratio =
    Math.abs(start.value) / (Math.abs(start.value) + Math.abs(end.value));
  const zeroPoint: SparklinePoint = {
    x: start.x + (end.x - start.x) * ratio,
    y: start.y + (end.y - start.y) * ratio,
    value: 0,
  };
  return [start, zeroPoint, end];
}

function getSparklineSegmentTone(
  startValue: number,
  endValue: number
): SetupCardTone {
  const midpoint = (startValue + endValue) / 2;
  if (midpoint > 0) return 'positive';
  if (midpoint < 0) return 'negative';
  if (endValue > startValue) return 'positive';
  if (endValue < startValue) return 'negative';
  return 'neutral';
}

export function getSetupSparklineTone(
  model: SetupSparklineModel
): SetupCardTone {
  if (model.tradeCount === 0 || model.finalValue === 0) return 'neutral';
  return model.finalValue > 0 ? 'positive' : 'negative';
}

export function buildSetupDetailPerformancePoints(
  linkedTrades: SetupLinkedTrade[],
  useRMultiples: boolean
): SetupDetailPerformancePoint[] {
  const contributingTrades = linkedTrades.filter((trade) => {
    if (!trade.pnlContributing) return false;
    return useRMultiples
      ? typeof trade.rMultiple === 'number' && Number.isFinite(trade.rMultiple)
      : Number.isFinite(trade.pnl);
  });

  if (contributingTrades.length > 0) {
    let cumulativePnl = 0;
    let cumulativeR = 0;
    return contributingTrades.map((trade, index) => {
      cumulativePnl += trade.pnl;
      cumulativeR += trade.rMultiple ?? 0;
      return {
        index: index + 1,
        label: trade.instrument,
        value: useRMultiples ? cumulativeR : cumulativePnl,
        pnl: cumulativePnl,
        rMultiple: cumulativeR,
      };
    });
  }

  return [];
}

export function getSetupDetailPerformanceSummary(
  points: SetupDetailPerformancePoint[],
  useRMultiples: boolean,
  pnlMetrics: { totalPnL: number; expectedValue: number }
): { total: number | null; expectancy: number | null } {
  const finalPoint = points.length > 0 ? points[points.length - 1] : undefined;
  if (useRMultiples) {
    return {
      total: finalPoint?.value ?? null,
      expectancy: finalPoint ? finalPoint.value / points.length : null,
    };
  }
  return {
    total: finalPoint?.value ?? pnlMetrics.totalPnL,
    expectancy: pnlMetrics.expectedValue,
  };
}

export function buildSetupDetailPnlChartData(
  points: SetupDetailPerformancePoint[]
): PnLChartDataPoint[] {
  return points.map((point) => ({
    date: String(point.index),
    dateKey: String(point.index),
    pnl: point.value,
    tradePnL:
      point.index === 1
        ? point.value
        : point.value - points[point.index - 2].value,
    cumulativeR: point.rMultiple,
    tradeR:
      point.rMultiple === undefined
        ? undefined
        : point.index === 1
          ? point.rMultiple
          : point.rMultiple - (points[point.index - 2].rMultiple ?? 0),
  }));
}

export function buildSetupDetailTradesChartData(
  linkedTrades: SetupLinkedTrade[],
  useRMultiples: boolean
): TradesChartDataPoint[] {
  const chartData: TradesChartDataPoint[] = [];
  for (const trade of linkedTrades) {
    if (!trade.pnlContributing) continue;
    const value = useRMultiples ? trade.rMultiple : trade.pnl;
    if (typeof value !== 'number' || !Number.isFinite(value)) continue;
    chartData.push({
      tradeIndex: chartData.length,
      pnl: value,
      fill: value >= 0 ? 'var(--chart-positive)' : 'var(--chart-negative)',
      instrument: trade.instrument,
      direction: trade.direction,
      entryTime: trade.entryTime ? new Date(trade.entryTime) : undefined,
      exitTime: trade.exitTime ? new Date(trade.exitTime) : undefined,
      path: trade.path,
      rMultiple: useRMultiples ? value : trade.rMultiple,
    });
  }
  return chartData;
}

export function buildSetupDetailDrawdownChartData(
  linkedTrades: SetupLinkedTrade[],
  dateFormat: string,
  defaultRiskAmount: number | undefined,
  plugin: JournalitPlugin
) {
  const drawdownTrades: DashboardTrade[] = [];
  for (const trade of linkedTrades) {
    if (!trade.pnlContributing || !Number.isFinite(trade.pnl)) continue;
    const entryTime = trade.entryTime ? new Date(trade.entryTime) : new Date();
    const exitTime = trade.exitTime ? new Date(trade.exitTime) : entryTime;

    drawdownTrades.push({
      path: trade.path,
      entryTime,
      exitTime,
      entryPrice: 0,
      exitPrice: 0,
      positionSize: 0,
      direction: trade.direction,
      pnl: trade.pnl,
      rMultiple: trade.rMultiple,
      riskAmount: defaultRiskAmount,
      tradeStatus: 'closed',
      instrument: trade.instrument,
      assetType: trade.assetType,
      optionType: trade.optionType,
    });
  }

  return prepareDrawdownChartData(
    drawdownTrades,
    dateFormat,
    defaultRiskAmount,
    'combined',
    plugin
  );
}

export function getMetricTone(value: number): SetupDetailMetricTone {
  if (!Number.isFinite(value) || value === 0) return 'neutral';
  return value > 0 ? 'positive' : 'negative';
}

function formatDateLabel(value: string, dateFormat?: string): string {
  if (!value) return t('setups.view.date.never');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  if (dateFormat) return formatDateDisplay(date, dateFormat);
  return date.toLocaleDateString();
}

export function formatRelativeDateLabel(value: string): string {
  if (!value) return t('setups.view.date.never');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const daysAgo = Math.max(
    0,
    Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  );

  if (daysAgo === 0) return t('setups.view.date.today');
  if (daysAgo === 1) return t('setups.view.date.yesterday');
  if (daysAgo < 30)
    return t('setups.view.date.days-ago', { count: String(daysAgo) });

  return formatDateLabel(value);
}

export function getStatusLabel(status: SetupStatus): string {
  switch (status) {
    case 'active':
      return t('setups.view.status.active');
    case 'testing':
      return t('setups.view.status.testing');
    case 'archived':
      return t('setups.view.status.archived');
  }
}

export function toggleSelectedSetupId(
  selectedSetupIds: string[],
  setupId: string
): string[] {
  if (selectedSetupIds.includes(setupId)) {
    return selectedSetupIds.filter((selectedId) => selectedId !== setupId);
  }
  if (selectedSetupIds.length >= 2) {
    return selectedSetupIds;
  }
  return [...selectedSetupIds, setupId];
}

export function setupOverviewChartSettingsReducer(
  state: SetupOverviewChartSettings,
  action: SetupOverviewChartSettingsAction
): SetupOverviewChartSettings {
  switch (action.type) {
    case 'metric':
      return { ...state, metricKey: action.metricKey };
    case 'mode':
      return { ...state, chartMode: action.chartMode };
    case 'pairMetric':
      return { ...state, pairMetricKey: action.pairMetricKey };
    case 'selectedSetups':
      return { ...state, selectedSetupIds: action.selectedSetupIds };
  }
}

export function buildSetupTradeIndex(
  setups: Setup[],
  tradeData: unknown[],
  defaultRiskAmount: number | undefined,
  analyticsDateBasis: AnalyticsDateBasis
): SetupTradeIndex {
  const setupIds = new Set(setups.map((setup) => setup.id));
  const legacyLabels = collectLegacySetupLabelsFromTrades(tradeData);
  const resolvedLegacyLabels = resolveSetupLabelsFromLoadedSetups(
    setups,
    legacyLabels
  );

  const index: SetupTradeIndex = { primary: new Map(), any: new Map() };
  for (const setup of setups) {
    index.primary.set(setup.id, []);
    index.any.set(setup.id, []);
  }

  for (const rawTrade of tradeData) {
    const trade = toSetupTradeRecord(rawTrade);
    if (!isRegularSetupRecord(trade)) continue;
    const anySetupIds = getAnySetupIdsForTrade(
      trade,
      setupIds,
      resolvedLegacyLabels
    );
    if (anySetupIds.length === 0) continue;

    const primarySetupIds = getPrimarySetupIdsForTrade(
      trade,
      anySetupIds,
      setupIds,
      resolvedLegacyLabels
    );
    const linkedTrade = toSetupLinkedTrade(
      trade,
      defaultRiskAmount,
      analyticsDateBasis
    );

    for (const setupId of anySetupIds) {
      index.any.get(setupId)?.push(linkedTrade);
    }
    for (const setupId of primarySetupIds) {
      index.primary.get(setupId)?.push(linkedTrade);
    }
  }

  sortSetupTradeIndex(index.primary);
  sortSetupTradeIndex(index.any);
  return index;
}

function resolveSetupLabelsFromLoadedSetups(
  setups: Setup[],
  labels: string[]
): Map<string, string> {
  const setupIdsByToken = new Map<string, Set<string>>();
  for (const setup of setups) {
    for (const token of [setup.id, setup.name, ...setup.aliases]) {
      const normalized = normalizeSetupReferenceToken(token);
      if (!normalized) continue;
      const candidates = setupIdsByToken.get(normalized) ?? new Set<string>();
      candidates.add(setup.id);
      setupIdsByToken.set(normalized, candidates);
    }
  }

  const resolved = new Map<string, string>();
  for (const label of labels) {
    const candidates = setupIdsByToken.get(normalizeSetupReferenceToken(label));
    if (candidates?.size === 1) {
      const [setupId] = candidates;
      if (setupId) resolved.set(label, setupId);
    }
  }
  return resolved;
}

function normalizeSetupReferenceToken(value: string): string {
  return value
    .trim()
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

function collectLegacySetupLabelsFromTrades(tradeData: unknown[]): string[] {
  const labels = new Set<string>();
  for (const rawTrade of tradeData) {
    const trade = toSetupTradeRecord(rawTrade);
    for (const label of getSetupLabelsForTrade(trade)) labels.add(label);
  }
  return [...labels];
}

function toSetupTradeRecord(rawTrade: unknown): TradeRecordForSetups {
  return isRecord(rawTrade) ? rawTrade : {};
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isRegularSetupRecord(trade: TradeRecordForSetups): boolean {
  return (
    inferStoredTradeType({
      filePath: typeof trade.path === 'string' ? trade.path : undefined,
      type: trade.type,
      isMissedTrade: trade.isMissedTrade,
      isBacktestTrade: trade.isBacktestTrade,
    }) === 'regular'
  );
}

function getAnySetupIdsForTrade(
  trade: TradeRecordForSetups,
  setupIds: Set<string>,
  resolvedLegacyLabels: Map<string, string>
): string[] {
  const ids = new Set<string>();

  for (const label of getSetupLabelsForTrade(trade)) {
    const resolvedId = setupIds.has(label)
      ? label
      : resolvedLegacyLabels.get(label);
    if (resolvedId && setupIds.has(resolvedId)) ids.add(resolvedId);
  }

  return [...ids];
}

function getPrimarySetupIdsForTrade(
  trade: TradeRecordForSetups,
  anySetupIds: string[],
  setupIds: Set<string>,
  resolvedLegacyLabels: Map<string, string>
): string[] {
  const anySetupIdSet = new Set(anySetupIds);
  for (const label of getSetupLabelsForTrade(trade)) {
    const setupId = setupIds.has(label)
      ? label
      : resolvedLegacyLabels.get(label);
    if (setupId && anySetupIdSet.has(setupId)) return [setupId];
  }
  return anySetupIds.length === 1 ? anySetupIds : [];
}

function toSetupLinkedTrade(
  trade: TradeRecordForSetups,
  defaultRiskAmount: number | undefined,
  analyticsDateBasis: AnalyticsDateBasis
): SetupLinkedTrade {
  const entryTime = stringifyDateLike(trade.entryTime);
  const exitTime = stringifyDateLike(trade.exitTime) || entryTime;
  const pnlInput = toTradePnlContributionInput(trade, exitTime);
  const pnlContributing = isPnlContributingTrade(pnlInput);
  const pnl = pnlContributing ? calculateTradePnlForCompare(pnlInput) : 0;
  const analyticsDate = getTradeAnalyticsDate(pnlInput, analyticsDateBasis);
  return {
    path: typeof trade.path === 'string' ? trade.path : '',
    analyticsTime:
      analyticsDate?.toISOString() ||
      entryTime ||
      exitTime ||
      new Date(0).toISOString(),
    instrument:
      typeof trade.instrument === 'string'
        ? trade.instrument
        : t('setups.view.trade.unknown-instrument'),
    account: getSetupTradeAccountLabel(trade.account),
    direction: typeof trade.direction === 'string' ? trade.direction : '',
    assetType:
      typeof trade.assetType === 'string' ? trade.assetType : undefined,
    optionType:
      typeof trade.optionType === 'string' ? trade.optionType : undefined,
    entryTime,
    exitTime,
    images: getStringArray(trade.images),
    pnl,
    rMultiple: calculateEffectiveRMultiple(
      pnl,
      getOptionalNumber(trade.rMultiple) ?? undefined,
      getOptionalNumber(trade.riskAmount) ?? undefined,
      defaultRiskAmount
    ),
    pnlContributing,
    reviewed: trade.reviewed === true,
  };
}

function getSetupTradeAccountLabel(account: unknown): string | null {
  if (typeof account === 'string') {
    const trimmed = account.trim();
    return trimmed || null;
  }
  const firstAccount = getStringArray(account)[0]?.trim();
  return firstAccount || null;
}

function toTradePnlContributionInput(
  trade: TradeRecordForSetups,
  exitTime: string
): TradePnlCompareInput {
  return {
    tradeStatus: trade.tradeStatus,
    exitTime: exitTime || null,
    exitPrice: getOptionalNumber(trade.exitPrice),
    pnl: typeof trade.pnl === 'number' ? trade.pnl : null,
    _originalPnlWasNull: trade._originalPnlWasNull === true,
    useDirectPnLInput: trade.useDirectPnLInput,
    directPnL: typeof trade.directPnL === 'number' ? trade.directPnL : null,
    dividends: trade.dividends,
    commission: trade.commission,
    swap: trade.swap,
    fees: trade.fees,
    rebate: trade.rebate,
    entries: getTradeExecutions(trade.entries),
    exits: getTradeExecutions(trade.exits),
    entryPrice: getOptionalNumber(trade.entryPrice),
    positionSize: getOptionalNumber(trade.positionSize) ?? 0,
    direction:
      typeof trade.direction === 'string' ? trade.direction : undefined,
    assetType:
      typeof trade.assetType === 'string' ? trade.assetType : undefined,
    optionType:
      typeof trade.optionType === 'string' ? trade.optionType : undefined,
    hasExplicitExitPrice: trade.hasExplicitExitPrice === true,
  };
}

function calculateTradePnlForCompare(trade: TradePnlCompareInput): number {
  const hasStoredOrDirectPnL =
    (trade.pnl !== undefined &&
      trade.pnl !== null &&
      Number.isFinite(trade.pnl)) ||
    (trade.useDirectPnLInput === true &&
      trade.directPnL !== undefined &&
      trade.directPnL !== null);

  if (hasStoredOrDirectPnL) {
    return getEffectivePnL(trade);
  }

  const entryPrice = getWeightedAverageEntryPrice(trade);
  const exitPrice = getResolvedWeightedAverageExitPrice(trade);
  const priceDiff = calculateDirectionalPriceDiff(
    {
      assetType: trade.assetType,
      direction: trade.direction || 'long',
    },
    entryPrice,
    exitPrice
  );

  return priceDiff === null ? 0 : priceDiff * trade.positionSize;
}

function getTradeExecutions(value: unknown): TradePnlCompareInput['entries'] {
  if (!Array.isArray(value)) return undefined;
  return value.flatMap((execution) =>
    isRecord(execution)
      ? [
          {
            time:
              execution.time instanceof Date ||
              typeof execution.time === 'string'
                ? execution.time
                : null,
            price: getOptionalNumber(execution.price),
            size: getOptionalNumber(execution.size),
            ...(typeof execution.hasExplicitPrice === 'boolean' && {
              hasExplicitPrice: execution.hasExplicitPrice,
            }),
          },
        ]
      : []
  );
}

function getOptionalNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function buildSetupPairViewModels(
  viewModels: SetupViewModel[],
  tradeIndex: SetupTradeIndex
): SetupPairViewModel[] {
  const pairs: SetupPairViewModel[] = [];

  for (let firstIndex = 0; firstIndex < viewModels.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < viewModels.length;
      secondIndex += 1
    ) {
      const firstSetup = viewModels[firstIndex].setup;
      const secondSetup = viewModels[secondIndex].setup;
      const firstTrades = getSetupTrades(tradeIndex.any, firstSetup.id);
      const secondTrades = getSetupTrades(tradeIndex.any, secondSetup.id);
      const pairTrades = intersectSetupTrades(firstTrades, secondTrades);
      if (pairTrades.length === 0) continue;

      const pairPathSet = new Set(pairTrades.map((trade) => trade.path));
      const firstSoloTrades = firstTrades.filter(
        (trade) => !pairPathSet.has(trade.path)
      );
      const secondSoloTrades = secondTrades.filter(
        (trade) => !pairPathSet.has(trade.path)
      );
      const metrics = calculateCompareMetrics(pairTrades);
      const firstSoloMetrics = calculateCompareMetrics(firstSoloTrades);
      const secondSoloMetrics = calculateCompareMetrics(secondSoloTrades);
      const soloBaseline = Math.max(
        firstSoloMetrics.expectancyR,
        secondSoloMetrics.expectancyR
      );

      pairs.push({
        key: createSetupPairKey(firstSetup.id, secondSetup.id),
        setupIds: [firstSetup.id, secondSetup.id],
        setupNames: [firstSetup.name, secondSetup.name],
        trades: pairTrades,
        metrics,
        firstSoloMetrics,
        secondSoloMetrics,
        edgeR: metrics.expectancyR - soloBaseline,
      });
    }
  }

  return pairs;
}

function createSetupPairKey(
  firstSetupId: string,
  secondSetupId: string
): string {
  return JSON.stringify([firstSetupId, secondSetupId].sort());
}

function intersectSetupTrades(
  firstTrades: SetupLinkedTrade[],
  secondTrades: SetupLinkedTrade[]
): SetupLinkedTrade[] {
  const secondTradePaths = new Set(
    secondTrades.flatMap((trade) => (trade.path ? [trade.path] : []))
  );
  return firstTrades.filter(
    (trade) => trade.path && secondTradePaths.has(trade.path)
  );
}

export function sortSetupPairViewModels(
  pairs: SetupPairViewModel[],
  metricKey: SetupPairMetricKey,
  isMasked: boolean
): SetupPairViewModel[] {
  return [...pairs].sort((first, second) => {
    if (isMasked) {
      return first.setupNames
        .join(' + ')
        .localeCompare(second.setupNames.join(' + '));
    }
    const metricOrder = compareSetupPairMetricDescending(
      getSetupPairMetricValue(first, metricKey),
      getSetupPairMetricValue(second, metricKey)
    );
    return (
      metricOrder ||
      second.metrics.totalTrades - first.metrics.totalTrades ||
      first.setupNames.join(' + ').localeCompare(second.setupNames.join(' + '))
    );
  });
}

function compareSetupPairMetricDescending(
  first: number,
  second: number
): number {
  if (first === second) return 0;
  return second > first ? 1 : -1;
}

export function getSetupPairMetricValue(
  pair: SetupPairViewModel,
  metricKey: SetupPairMetricKey
): number {
  switch (metricKey) {
    case 'edgeR':
      return pair.edgeR;
    case 'expectancyR':
      return pair.metrics.expectancyR;
    case 'totalR':
      return pair.metrics.totalR;
    case 'totalPnL':
      return pair.metrics.totalPnL;
    case 'winRate':
      return pair.metrics.winRate;
    case 'profitFactor':
      return pair.metrics.profitFactor;
    case 'totalTrades':
      return pair.metrics.totalTrades;
  }
}

export function getSetupPairBarValue(
  pair: SetupPairViewModel,
  metricKey: SetupPairMetricKey
): number {
  const value = getSetupPairMetricValue(pair, metricKey);
  return metricKey === 'profitFactor' ? value - 1 : value;
}

export function getSetupPairChartModels(
  sortedPairs: SetupPairViewModel[],
  metricKey: SetupPairMetricKey
): SetupPairViewModel[] {
  if (metricKey !== 'edgeR') return sortedPairs.slice(0, 10);

  const bestPairs = sortedPairs.slice(0, 5);
  const worstPairs = [...sortedPairs]
    .sort(
      (first, second) =>
        first.edgeR - second.edgeR ||
        second.metrics.totalTrades - first.metrics.totalTrades ||
        first.setupNames
          .join(' + ')
          .localeCompare(second.setupNames.join(' + '))
    )
    .slice(0, 5);
  const seen = new Set<string>();
  return [...bestPairs, ...worstPairs].filter((pair) => {
    if (seen.has(pair.key)) return false;
    seen.add(pair.key);
    return true;
  });
}

export function getWorstSetupPair(
  pairs: SetupPairViewModel[],
  metricKey: SetupPairMetricKey
): SetupPairViewModel | null {
  let worstPair: SetupPairViewModel | null = null;
  for (const pair of pairs) {
    if (!worstPair) {
      worstPair = pair;
      continue;
    }

    const pairValue = getSetupPairMetricValue(pair, metricKey);
    const worstValue = getSetupPairMetricValue(worstPair, metricKey);
    if (
      pairValue < worstValue ||
      (pairValue === worstValue &&
        pair.setupNames
          .join(' + ')
          .localeCompare(worstPair.setupNames.join(' + ')) < 0)
    ) {
      worstPair = pair;
    }
  }
  return worstPair;
}

export function buildSetupPairSummary(
  pairs: SetupPairViewModel[]
): SetupPairSummary {
  const sortedByEdge = sortSetupPairViewModels(pairs, 'edgeR', false);
  return {
    pairCount: pairs.length,
    bestPair: sortedByEdge[0] ?? null,
    worstPair: sortedByEdge[sortedByEdge.length - 1] ?? null,
    needsReviewCount: pairs.filter((pair) => pair.edgeR < 0).length,
  };
}

function formatSetupPairChartLabel(setupNames: [string, string]): string {
  return setupNames.map((name) => truncateText(name, 18)).join(' + ');
}

export function formatSetupPairSummaryLabel(
  setupNames: [string, string]
): string {
  return setupNames.map((name) => truncateText(name, 28)).join(' + ');
}

function truncateText(value: string, maxLength: number): string {
  return value.length <= maxLength
    ? value
    : `${value.slice(0, Math.max(0, maxLength - 1))}…`;
}

export function getMetricLeader(
  viewModels: SetupViewModel[],
  metricKey: MetricKey,
  rMetricsBySetupId: Map<string, SetupCompareMetrics>
): SetupViewModel | null {
  let leader: SetupViewModel | null = null;

  for (const viewModel of viewModels) {
    if (viewModel.metrics.totalTrades <= 0) continue;
    const rMetrics = rMetricsBySetupId.get(viewModel.setup.id);
    if (OVERVIEW_R_METRIC_KEYS.has(metricKey) && !hasRMetrics(rMetrics)) {
      continue;
    }
    const value = getMetricValue(viewModel.metrics, metricKey, rMetrics);
    const leaderValue = leader
      ? getMetricValue(
          leader.metrics,
          metricKey,
          rMetricsBySetupId.get(leader.setup.id)
        )
      : Number.NEGATIVE_INFINITY;
    if (
      !leader ||
      value > leaderValue ||
      (value === leaderValue &&
        viewModel.metrics.totalTrades > leader.metrics.totalTrades)
    ) {
      leader = viewModel;
    }
  }

  return leader;
}

export function getSetupTradeLogFilterLabels(setup: Setup): string[] {
  return [
    ...new Set([setup.name, ...setup.aliases].map((label) => label.trim())),
  ].filter(Boolean);
}

export function sortSetupCardsByRecentActivity(
  viewModels: SetupViewModel[]
): SetupViewModel[] {
  return Array.from(viewModels).sort((first, second) => {
    const firstArchivedRank = first.setup.status === 'archived' ? 1 : 0;
    const secondArchivedRank = second.setup.status === 'archived' ? 1 : 0;
    if (firstArchivedRank !== secondArchivedRank) {
      return firstArchivedRank - secondArchivedRank;
    }

    const firstHasTrades = first.metrics.totalTrades > 0 ? 0 : 1;
    const secondHasTrades = second.metrics.totalTrades > 0 ? 0 : 1;
    if (firstHasTrades !== secondHasTrades) {
      return firstHasTrades - secondHasTrades;
    }

    const firstLastTradeTime = getSetupLastTradeSortTime(first.metrics);
    const secondLastTradeTime = getSetupLastTradeSortTime(second.metrics);
    if (firstLastTradeTime !== secondLastTradeTime) {
      return secondLastTradeTime - firstLastTradeTime;
    }

    const firstStatusRank = getSetupCardSortStatusRank(first.setup.status);
    const secondStatusRank = getSetupCardSortStatusRank(second.setup.status);
    if (firstStatusRank !== secondStatusRank) {
      return firstStatusRank - secondStatusRank;
    }

    return first.setup.name.localeCompare(second.setup.name);
  });
}

export function buildSetupOverviewPnlChartModel(
  viewModels: SetupViewModel[],
  tradeIndex: SetupTradeIndex,
  includesAllSetups: boolean,
  metricKind: 'pnl' | 'rMultiple'
): SetupOverviewPnlChartModel {
  const metricViewModels =
    metricKind === 'pnl'
      ? viewModels
      : viewModels.filter(({ setup }) =>
          hasRMetrics(
            calculateCompareMetrics(tradeIndex.any.get(setup.id) ?? [])
          )
        );
  const setupNameById = new Map(
    metricViewModels.map((viewModel) => [
      viewModel.setup.id,
      viewModel.setup.name,
    ])
  );
  const setupTotals = new Map(
    metricViewModels.map(({ setup }) => [setup.id, 0])
  );
  const eventsByTradeKey = new Map<
    string,
    { trade: SetupLinkedTrade; setupIds: Set<string> }
  >();
  let fallbackIndex = 0;

  for (const [setupId, trades] of tradeIndex.any.entries()) {
    if (!setupNameById.has(setupId)) continue;
    for (const trade of trades) {
      if (!trade.pnlContributing) continue;
      const value = getSetupCumulativeTradeValue(trade, metricKind);
      if (value === null) continue;
      const key = trade.path || `${setupId}-trade-${fallbackIndex++}`;
      const existing = eventsByTradeKey.get(key);
      if (existing) {
        existing.setupIds.add(setupId);
      } else {
        eventsByTradeKey.set(key, { trade, setupIds: new Set([setupId]) });
      }
    }
  }

  const events = [...eventsByTradeKey.values()].sort(
    (first, second) =>
      getTradeSortTime(first.trade).getTime() -
      getTradeSortTime(second.trade).getTime()
  );
  if (events.length === 0) return { data: [], series: [] };

  let combinedTotal = 0;
  const baselinePoint: SetupOverviewPnlPoint = {
    index: 0,
    label: t('setups.view.overview.pnl-chart.start'),
    combined: 0,
  };
  for (const setupId of setupNameById.keys()) {
    baselinePoint[getSetupOverviewSeriesKey(setupId)] = 0;
  }

  const data = events.map(({ trade, setupIds }, index) => {
    const value = getSetupCumulativeTradeValue(trade, metricKind) ?? 0;
    combinedTotal += value;
    for (const setupId of setupIds) {
      setupTotals.set(setupId, (setupTotals.get(setupId) ?? 0) + value);
    }

    const point: SetupOverviewPnlPoint = {
      index: index + 1,
      label: formatSetupOverviewPnlPointLabel(trade, index),
      combined: combinedTotal,
    };
    for (const setupId of setupNameById.keys()) {
      point[getSetupOverviewSeriesKey(setupId)] = setupTotals.get(setupId) ?? 0;
    }
    return point;
  });

  const setupSeries = metricViewModels
    .flatMap(({ setup }, index) => {
      if ((tradeIndex.any.get(setup.id) ?? []).length === 0) return [];
      return [
        {
          key: getSetupOverviewSeriesKey(setup.id),
          label: setup.name,
          color:
            SETUP_OVERVIEW_SETUP_COLORS[
              index % SETUP_OVERVIEW_SETUP_COLORS.length
            ],
          isCombined: false,
          totalAbs: Math.abs(setupTotals.get(setup.id) ?? 0),
        },
      ];
    })
    .sort((first, second) =>
      second.totalAbs === first.totalAbs
        ? first.label.localeCompare(second.label)
        : second.totalAbs - first.totalAbs
    )
    .map(({ totalAbs: _totalAbs, ...series }) => series);

  return {
    data: [baselinePoint, ...data],
    series: [
      {
        key: 'combined',
        label:
          includesAllSetups && metricViewModels.length === viewModels.length
            ? t('setups.view.overview.pnl-chart.combined')
            : t('setups.view.overview.pnl-chart.selected-combined'),
        color: 'var(--chart-positive, var(--text-success, #43a047))',
        isCombined: true,
      },
      ...setupSeries,
    ],
  };
}

function getSetupCumulativeTradeValue(
  trade: SetupLinkedTrade,
  metricKind: 'pnl' | 'rMultiple'
): number | null {
  const value = metricKind === 'rMultiple' ? trade.rMultiple : trade.pnl;
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

const SETUP_OVERVIEW_SETUP_COLORS = [
  'var(--color-purple, #6f42c1)',
  'var(--color-orange, #ff9800)',
  'var(--color-blue, #42a5f5)',
  'var(--color-yellow, #fbc02d)',
  'var(--color-cyan, #26c6da)',
  'var(--color-pink, #ec407a)',
  'var(--text-accent)',
  'var(--text-muted)',
];

function getSetupOverviewSeriesKey(setupId: string): string {
  const encodedId = [...setupId]
    .map((character) => character.codePointAt(0)?.toString(36) ?? '')
    .join('_');
  return `setup_${encodedId}`;
}

function formatSetupOverviewPnlPointLabel(
  trade: SetupLinkedTrade,
  index: number
): string {
  const date = stringifyDateLike(trade.exitTime || trade.entryTime);
  if (!date) return String(index + 1);
  return formatDateDisplay(date, 'YYYY-MM-DD');
}

function getSetupCardSortStatusRank(status: SetupStatus): number {
  switch (status) {
    case 'active':
      return 0;
    case 'testing':
      return 1;
    case 'archived':
      return 2;
  }
}

function getSetupLastTradeSortTime(metrics: SetupMetrics): number {
  if (metrics.totalTrades <= 0 || !metrics.lastTradeDate) return 0;
  const timestamp = new Date(metrics.lastTradeDate).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  return typeof value === 'string' ? [value] : [];
}

function getSetupLabelsForTrade(trade: TradeRecordForSetups): string[] {
  return getStringArray(trade.setup);
}

function stringifyDateLike(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return typeof value === 'string' ? value : '';
}

function sortSetupTradeIndex(index: Map<string, SetupLinkedTrade[]>): void {
  for (const trades of index.values()) {
    trades.sort(
      (a, b) => getTradeSortTime(a).getTime() - getTradeSortTime(b).getTime()
    );
  }
}

function getTradeSortTime(trade: SetupLinkedTrade): Date {
  const date = new Date(trade.analyticsTime);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

export function getSetupTrades(
  setupTradeMap: Map<string, SetupLinkedTrade[]>,
  setupId: string
): SetupLinkedTrade[] {
  return setupTradeMap.get(setupId) ?? [];
}

export function calculateCompareMetrics(
  trades: SetupLinkedTrade[]
): SetupCompareMetrics {
  const contributingTrades = trades.filter((trade) => trade.pnlContributing);
  const results = contributingTrades.map((trade) => trade.pnl);
  const rResults = contributingTrades.flatMap((trade) =>
    typeof trade.rMultiple === 'number' && Number.isFinite(trade.rMultiple)
      ? [trade.rMultiple]
      : []
  );
  const winners = results.filter((pnl) => pnl > 0);
  const losers = results.filter((pnl) => pnl < 0);
  const totalLoss = Math.abs(losers.reduce((sum, pnl) => sum + pnl, 0));
  const totalWin = winners.reduce((sum, pnl) => sum + pnl, 0);
  const totalR = rResults.reduce((sum, value) => sum + value, 0);

  return {
    totalTrades: contributingTrades.length,
    rMultipleCount: rResults.length,
    winRate:
      calculateWinRateExcludingBreakeven(winners.length, losers.length) * 100,
    totalPnL: results.reduce((sum, pnl) => sum + pnl, 0),
    totalR,
    expectancyR: rResults.length ? totalR / rResults.length : 0,
    profitFactor: totalLoss ? totalWin / totalLoss : totalWin ? Infinity : 0,
  };
}

function hasRMetrics(
  metrics: SetupCompareMetrics | undefined
): metrics is SetupCompareMetrics {
  return Boolean(metrics && metrics.rMultipleCount > 0);
}

export function getAveragePnl(metrics: SetupCompareMetrics): number {
  return metrics.totalTrades > 0 ? metrics.totalPnL / metrics.totalTrades : 0;
}

export function getValueTone(value: number): SetupDetailMetricTone {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

export function buildSetupPairEvidenceTrend(
  pair: SetupPairViewModel,
  metricKey: SetupPairMetricKey
): SetupPairTrendPoint[] {
  let cumulativePnl = 0;
  let cumulativeR = 0;
  let rMultipleCount = 0;
  let winners = 0;
  let losers = 0;
  let totalWin = 0;
  let totalLoss = 0;
  const baselineExpectancy = Math.max(
    pair.firstSoloMetrics.expectancyR,
    pair.secondSoloMetrics.expectancyR
  );
  const points: SetupPairTrendPoint[] =
    metricKey === 'profitFactor' ? [] : [{ index: 0, value: 0 }];
  pair.trades
    .filter((trade) => trade.pnlContributing)
    .sort(
      (first, second) =>
        getTradeSortTime(first).getTime() - getTradeSortTime(second).getTime()
    )
    .forEach((trade, index) => {
      cumulativePnl += trade.pnl;
      const rMultiple =
        typeof trade.rMultiple === 'number' && Number.isFinite(trade.rMultiple)
          ? trade.rMultiple
          : null;
      if (rMultiple !== null) {
        cumulativeR += rMultiple;
        rMultipleCount += 1;
      }

      if (trade.pnl > 0) {
        winners += 1;
        totalWin += trade.pnl;
      } else if (trade.pnl < 0) {
        losers += 1;
        totalLoss += Math.abs(trade.pnl);
      }

      const tradeCount = index + 1;
      if (metricKey === 'profitFactor' && totalLoss === 0) return;

      const value = (() => {
        switch (metricKey) {
          case 'totalPnL':
            return cumulativePnl;
          case 'totalR':
            return cumulativeR;
          case 'totalTrades':
            return tradeCount;
          case 'winRate':
            return calculateWinRateExcludingBreakeven(winners, losers) * 100;
          case 'profitFactor':
            return totalWin / totalLoss;
          case 'expectancyR':
            return rMultipleCount > 0 ? cumulativeR / rMultipleCount : 0;
          case 'edgeR':
            return (
              (rMultipleCount > 0 ? cumulativeR / rMultipleCount : 0) -
              baselineExpectancy
            );
        }
      })();

      points.push({ index: tradeCount, value });
    });
  return points;
}

export function calculateAverageRMultiple(
  trades: SetupLinkedTrade[]
): number | null {
  const rResults = trades.flatMap((trade) =>
    trade.pnlContributing &&
    typeof trade.rMultiple === 'number' &&
    Number.isFinite(trade.rMultiple)
      ? [trade.rMultiple]
      : []
  );
  if (rResults.length === 0) return null;
  return rResults.reduce((sum, value) => sum + value, 0) / rResults.length;
}

export function buildCompareEdgeSummary(
  models:
    | [SetupCompareViewModel, SetupCompareViewModel]
    | SetupCompareViewModel[],
  displayRMultiples: boolean
): SetupCompareEdgeSummary {
  const [first, second] = models;
  const useRExpectancy =
    displayRMultiples &&
    first.metrics.rMultipleCount > 0 &&
    second.metrics.rMultipleCount > 0;
  const firstExpectancy = getCompareExpectancy(first.metrics, useRExpectancy);
  const secondExpectancy = getCompareExpectancy(second.metrics, useRExpectancy);
  const hasComparableExpectancy =
    firstExpectancy !== null && secondExpectancy !== null;
  const expectancyDelta = hasComparableExpectancy
    ? firstExpectancy - secondExpectancy
    : 0;
  const edgeStrengthDelta = useRExpectancy
    ? Math.abs(expectancyDelta)
    : Math.abs(expectancyDelta) /
      Math.max(
        Math.abs(firstExpectancy ?? 0),
        Math.abs(secondExpectancy ?? 0),
        1
      );
  const winner =
    !hasComparableExpectancy || expectancyDelta === 0
      ? null
      : expectancyDelta > 0
        ? first
        : second;
  const [winnerModel, otherModel] = winner
    ? ([winner, winner.setup.id === first.setup.id ? second : first] as const)
    : ([first, second] as const);
  const firstSampleCount = useRExpectancy
    ? first.metrics.rMultipleCount
    : first.metrics.totalTrades;
  const secondSampleCount = useRExpectancy
    ? second.metrics.rMultipleCount
    : second.metrics.totalTrades;
  const minTrades = Math.min(firstSampleCount, secondSampleCount);
  const maxTrades = Math.max(firstSampleCount, secondSampleCount);
  const sampleRatio = maxTrades === 0 ? 0 : minTrades / maxTrades;
  const confidence: SetupCompareEdgeSummary['confidence'] =
    minTrades >= 50 && sampleRatio >= 0.5
      ? 'high'
      : minTrades >= 20 && sampleRatio >= 0.35
        ? 'moderate'
        : 'low';
  const winnerSampleCount = useRExpectancy
    ? winnerModel.metrics.rMultipleCount
    : winnerModel.metrics.totalTrades;
  const otherSampleCount = useRExpectancy
    ? otherModel.metrics.rMultipleCount
    : otherModel.metrics.totalTrades;

  return {
    winner,
    expectancyDelta: Math.abs(expectancyDelta),
    expectancyKind: useRExpectancy ? 'rMultiple' : 'pnl',
    confidence,
    sampleDescription: `${winnerSampleCount} vs ${otherSampleCount}`,
    edgeStrength: getCompareEdgeStrength(edgeStrengthDelta),
    reasons: hasComparableExpectancy
      ? buildCompareEdgeReasons(winnerModel, otherModel, useRExpectancy)
      : [],
  };
}

function getCompareExpectancy(
  metrics: SetupCompareMetrics,
  useRExpectancy: boolean
): number | null {
  if (useRExpectancy) {
    return metrics.rMultipleCount > 0 ? metrics.expectancyR : null;
  }
  return metrics.totalTrades > 0
    ? metrics.totalPnL / metrics.totalTrades
    : null;
}

function getCompareEdgeStrength(
  delta: number
): SetupCompareEdgeSummary['edgeStrength'] {
  if (delta >= 0.5) return 'strong';
  if (delta >= 0.15) return 'clear';
  return 'slight';
}

export function getCompareEdgeStrengthLabel(
  strength: SetupCompareEdgeSummary['edgeStrength']
): string {
  switch (strength) {
    case 'strong':
      return t('setups.view.compare.edge-strength.strong');
    case 'clear':
      return t('setups.view.compare.edge-strength.clear');
    case 'slight':
      return t('setups.view.compare.edge-strength.slight');
  }
}

function buildCompareEdgeReasons(
  first: SetupCompareViewModel,
  second: SetupCompareViewModel,
  displayRMultiples: boolean
): SetupCompareEdgeReason[] {
  const firstExpectancy = getCompareExpectancy(
    first.metrics,
    displayRMultiples
  );
  const secondExpectancy = getCompareExpectancy(
    second.metrics,
    displayRMultiples
  );
  const performanceReason = displayRMultiples
    ? buildCompareEdgeReason(
        first.metrics.totalR,
        second.metrics.totalR,
        'total-r',
        (value) => <RMultipleValue value={value} precision={2} tone="none" />
      )
    : buildCompareEdgeReason(
        first.metrics.totalPnL,
        second.metrics.totalPnL,
        'net-pnl',
        (value) => <CompareSignedDeltaValue kind="pnl" value={value} />
      );
  const expectancyReason =
    firstExpectancy === null || secondExpectancy === null
      ? null
      : buildCompareEdgeReason(
          firstExpectancy,
          secondExpectancy,
          'expectancy',
          (value) =>
            displayRMultiples ? (
              <RMultipleValue value={value} precision={2} tone="none" />
            ) : (
              <CompareSignedDeltaValue kind="pnl" value={value} />
            )
        );
  return [
    performanceReason,
    buildCompareEdgeReason(
      first.metrics.winRate,
      second.metrics.winRate,
      'win-rate',
      (value) => (
        <PercentValue
          kind="percentage"
          value={value}
          precision={1}
          signed
          tone="none"
        />
      )
    ),
    expectancyReason,
    buildCompareEdgeReason(
      first.metrics.profitFactor,
      second.metrics.profitFactor,
      'profit-factor',
      (value) => (
        <CompareSignedDeltaValue kind="metric" value={value} precision={2} />
      )
    ),
  ].filter((reason): reason is SetupCompareEdgeReason => reason !== null);
}

function buildCompareEdgeReason(
  firstValue: number,
  secondValue: number,
  metric: 'net-pnl' | 'total-r' | 'win-rate' | 'expectancy' | 'profit-factor',
  renderValue: (value: number) => React.ReactNode
): SetupCompareEdgeReason | null {
  const delta = firstValue - secondValue;
  if (!Number.isFinite(delta)) return null;
  return {
    label: getCompareEdgeReasonLabel(metric, delta),
    value: renderValue(delta),
    tone: delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral',
  };
}

function getCompareEdgeReasonLabel(
  metric: 'net-pnl' | 'total-r' | 'win-rate' | 'expectancy' | 'profit-factor',
  delta: number
): string {
  const direction = delta > 0 ? 'higher' : delta < 0 ? 'lower' : 'similar';
  return t(`setups.view.compare.reason.${direction}.${metric}`);
}

export function getCompareConfidenceLabel(
  confidence: SetupCompareEdgeSummary['confidence']
): string {
  switch (confidence) {
    case 'high':
      return t('setups.view.compare.confidence.high');
    case 'moderate':
      return t('setups.view.compare.confidence.moderate');
    case 'low':
      return t('setups.view.compare.confidence.low');
  }
}

export function getCompareMetricWinnerId(
  models: SetupCompareViewModel[],
  metric: SetupCompareMetricKey
): string | null {
  if (models.length !== 2) return null;
  const values = models.map((model) =>
    getCompareMetricNumericValue(model, metric)
  );
  if (!values.every(Number.isFinite) || values[0] === values[1]) return null;
  return values[0] > values[1] ? models[0].setup.id : models[1].setup.id;
}

function getCompareMetricNumericValue(
  model: SetupCompareViewModel,
  metric: SetupCompareMetricKey
): number {
  switch (metric) {
    case 'trades':
      return model.metrics.totalTrades;
    case 'winRate':
      return model.metrics.winRate;
    case 'totalPnL':
      return model.metrics.totalPnL;
    case 'totalR':
      return model.metrics.totalR;
    case 'expectancyR':
      return model.metrics.expectancyR;
    case 'profitFactor':
      return model.metrics.profitFactor;
  }
}

export function getCompareMetricDelta(
  models: SetupCompareViewModel[],
  metric: SetupCompareMetricKey
): number {
  if (models.length !== 2) return 0;
  const firstValue = getCompareMetricNumericValue(models[0], metric);
  const secondValue = getCompareMetricNumericValue(models[1], metric);
  return firstValue === secondValue ? 0 : Math.abs(firstValue - secondValue);
}

export function getCompareMetricDisplayKind(
  metric: SetupCompareMetricKey
): 'count' | 'percentage' | 'pnl' | 'rMultiple' | 'metric' {
  switch (metric) {
    case 'trades':
      return 'count';
    case 'winRate':
      return 'percentage';
    case 'totalPnL':
      return 'pnl';
    case 'totalR':
    case 'expectancyR':
      return 'rMultiple';
    case 'profitFactor':
      return 'metric';
  }
}

export function buildCumulativeCompareChartSeries(
  compareModels: SetupCompareViewModel[],
  metric: SetupCompareChartMetric
): Array<{ id: string; key: string; name: string; values: number[] }> {
  return compareModels.map(({ setup, trades }, index) => {
    let cumulative = 0;
    return {
      id: setup.id,
      key: `setupCompareSeries${index + 1}`,
      name: setup.name,
      values: trades.flatMap((trade) => {
        if (!trade.pnlContributing) return [];
        const value = metric === 'r' ? trade.rMultiple : trade.pnl;
        if (typeof value !== 'number' || !Number.isFinite(value)) return [];
        cumulative += value;
        return [cumulative];
      }),
    };
  });
}

export function buildCompareBreakdowns(
  winnerModel: SetupCompareViewModel,
  otherModel: SetupCompareViewModel,
  expectancyKind: SetupCompareEdgeSummary['expectancyKind']
): SetupCompareBreakdown[] {
  return [
    buildCompareBreakdown(
      t('form.field.instrument'),
      Globe,
      winnerModel,
      otherModel,
      expectancyKind,
      (trade) => trade.instrument
    ),
    buildCompareBreakdown(
      'Weekday',
      Calendar,
      winnerModel,
      otherModel,
      expectancyKind,
      (trade) => getWeekdayLabel(trade.exitTime || trade.entryTime)
    ),
    buildCompareBreakdown(
      t('form.field.direction'),
      TrendingUp,
      winnerModel,
      otherModel,
      expectancyKind,
      getCompareDirectionBreakdownLabel
    ),
  ].filter((breakdown) => breakdown.rows.length > 0);
}

function buildCompareBreakdown(
  label: string,
  Icon: typeof Globe,
  winnerModel: SetupCompareViewModel,
  otherModel: SetupCompareViewModel,
  expectancyKind: SetupCompareEdgeSummary['expectancyKind'],
  getGroup: (trade: SetupLinkedTrade) => string
): SetupCompareBreakdown {
  const groups = new Set<string>();
  const winnerValues = buildCompareBreakdownValues(
    winnerModel,
    expectancyKind,
    getGroup
  );
  const otherValues = buildCompareBreakdownValues(
    otherModel,
    expectancyKind,
    getGroup
  );

  for (const group of winnerValues.keys()) groups.add(group);
  for (const group of otherValues.keys()) groups.add(group);

  const rows = [...groups]
    .map((group) => {
      const winnerValue = winnerValues.get(group) ?? 0;
      const otherValue = otherValues.get(group) ?? 0;
      const value = winnerValue - otherValue;
      return {
        id: `${label}-${group}`,
        label: group,
        value,
        winnerValue,
        otherValue,
        winnerName: winnerModel.setup.name,
        otherName: otherModel.setup.name,
        magnitude: Math.abs(value),
      };
    })
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 5)
    .map(({ magnitude: _magnitude, ...row }) => row);

  return { label, Icon, rows };
}

function buildCompareBreakdownValues(
  model: SetupCompareViewModel,
  expectancyKind: SetupCompareEdgeSummary['expectancyKind'],
  getGroup: (trade: SetupLinkedTrade) => string
): Map<string, number> {
  const values = new Map<string, number>();
  for (const trade of model.trades) {
    if (!trade.pnlContributing) continue;
    const value = expectancyKind === 'rMultiple' ? trade.rMultiple : trade.pnl;
    if (typeof value !== 'number' || !Number.isFinite(value)) continue;
    const group = getGroup(trade) || t('common.unknown');
    values.set(group, (values.get(group) ?? 0) + value);
  }
  return values;
}

function getCompareDirectionBreakdownLabel(trade: SetupLinkedTrade): string {
  return getTradeDirectionDisplayLabel(
    {
      direction: trade.direction,
      assetType: trade.assetType,
      optionType: trade.optionType,
    },
    t('common.unknown')
  ).toLocaleUpperCase();
}

function getWeekdayLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t('common.unknown');
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

export function getSetupCardHealthLabel(health: SetupCardHealth): string {
  switch (health) {
    case 'good':
      return t('setups.view.card.status.active');
    case 'monitor':
      return t('setups.view.card.status.monitor');
    case 'review':
      return t('setups.view.card.status.review');
  }
}

export function buildSetupRuleGroups(setup: Setup): SetupRuleGroupViewModel[] {
  const groups = buildEditableRuleGroups(setup);
  const groupById = new Map(groups.map((group) => [group.id, group]));
  const rulesByGroupId = new Map<string, SetupRule[]>();
  for (const rule of Array.from(setup.rules).sort(
    (a, b) => a.order - b.order
  )) {
    const groupId = rule.groupId ?? getFallbackRuleGroupId(rule.category);
    const groupRules = rulesByGroupId.get(groupId) ?? [];
    groupRules.push(rule);
    rulesByGroupId.set(groupId, groupRules);

    if (!groupById.has(groupId)) {
      const group = getFallbackSetupRuleGroup(rule.category);
      groups.push(group);
      groupById.set(group.id, group);
    }
  }

  return Array.from(groups)
    .sort((a, b) => a.order - b.order)
    .flatMap((group) => {
      const rules = rulesByGroupId.get(group.id) ?? [];
      return rules.length > 0
        ? [
            {
              id: group.id,
              label: group.name,
              order: group.order,
              rules,
            },
          ]
        : [];
    });
}

export function buildEditableRuleGroups(setup: Setup): SetupRuleGroup[] {
  if (setup.ruleGroups.length > 0) {
    return Array.from(setup.ruleGroups).sort((a, b) => a.order - b.order);
  }

  const categories = new Set(setup.rules.map((rule) => rule.category));
  return SETUP_RULE_CATEGORY_ORDER.flatMap((category) =>
    categories.has(category) ? [getFallbackSetupRuleGroup(category)] : []
  );
}

export function getFallbackSetupRuleGroup(
  category: SetupRuleCategory
): SetupRuleGroup {
  return {
    id: getFallbackRuleGroupId(category),
    name: getSetupRuleCategoryLabel(category),
    order: getSetupRuleCategoryOrder(category),
  };
}

export function getFallbackRuleGroupId(category: SetupRuleCategory): string {
  return `group_${category}`;
}

export function getCategoryForRuleGroupId(groupId: string): SetupRuleCategory {
  return groupId.startsWith('group_')
    ? normalizeSetupRuleCategory(groupId.slice('group_'.length))
    : 'entry';
}

function getSetupRuleCategoryOrder(category: SetupRuleCategory): number {
  const index = SETUP_RULE_CATEGORY_ORDER.indexOf(category);
  return index === -1 ? SETUP_RULE_CATEGORY_ORDER.length : index;
}

function normalizeSetupRuleCategory(value: string): SetupRuleCategory {
  switch (value) {
    case 'context':
    case 'entry':
    case 'exit':
    case 'risk':
    case 'management':
    case 'invalidation':
    case 'psychology':
      return value;
    default:
      return 'entry';
  }
}

function getSetupRuleCategoryLabel(category: SetupRuleCategory): string {
  switch (category) {
    case 'context':
      return t('setups.view.detail.rule.category.context');
    case 'entry':
      return t('setups.view.detail.rule.category.entry');
    case 'exit':
      return t('setups.view.detail.rule.category.exit');
    case 'risk':
      return t('setups.view.detail.rule.category.risk');
    case 'management':
      return t('setups.view.detail.rule.category.management');
    case 'invalidation':
      return t('setups.view.detail.rule.category.invalidation');
    case 'psychology':
      return t('setups.view.detail.rule.category.psychology');
  }
}
