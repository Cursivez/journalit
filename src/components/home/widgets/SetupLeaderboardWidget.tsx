

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Check, X } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { useEventBus } from '../../../hooks/useEventBus';
import { eventBus } from '../../../services/events';
import { useDashboardData } from '../../dashboard/context/DashboardDataContext';
import { useFilteredByPeriod } from '../context/HomePeriodContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { t } from '../../../lang/helpers';
import { Trade } from '../../dashboard/utils/dataUtils';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import {
  calculateWinRateExcludingBreakeven,
  classifyPnLWithBreakEvenSettings,
} from '../../../utils/breakEvenRange';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import {
  TopBreakdownConfig,
  TopBreakdownDimension,
  TopBreakdownValueMode,
} from '../../../settings/types';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { Tooltip } from '../../shared/Tooltip';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../shared/display/CurrencyConversionInfo';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';

interface SetupLeaderboardWidgetProps {
  plugin: JournalitPlugin;
  instanceId: string;
}

interface TopBreakdownStats {
  key: string;
  displayName: string;
  totalPnL: number;
  tradeCount: number;
  winCount: number;
  lossCount: number;
  winRate: number;
}

interface TopBreakdownConfigPanelProps {
  title: string;
  draftDimension: TopBreakdownDimension;
  draftValueMode: TopBreakdownValueMode;
  onDraftDimensionChange: (dimension: TopBreakdownDimension) => void;
  onDraftValueModeChange: (valueMode: TopBreakdownValueMode) => void;
  onSave: () => void;
  onCancel: () => void;
}

interface TopBreakdownEmptyStateProps {
  title: string;
  customizeLabel: string;
  onOpenModal: () => void;
}

interface TopBreakdownRowProps {
  setup: TopBreakdownStats;
  index: number;
  valueMode: TopBreakdownValueMode;
  maxValue: number;
  effectiveCurrency: string;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
  shouldMask: ReturnType<typeof useDisplayFormatter>['shouldMask'];
}

interface BuildTopBreakdownStatsOptions {
  trades: Trade[] | undefined;
  dimension: TopBreakdownDimension;
  valueMode: TopBreakdownValueMode;
  breakEvenSettings: Parameters<typeof classifyPnLWithBreakEvenSettings>[1];
}

const DEFAULT_CONFIG: TopBreakdownConfig = {
  dimension: 'setups',
  valueMode: 'currency',
  createdAt: '',
};

const ASSET_TYPE_ALIASES: Record<string, string> = {
  stock: 'stock',
  stocks: 'stock',
  option: 'options',
  options: 'options',
  future: 'futures',
  futures: 'futures',
  forex: 'forex',
  fx: 'forex',
  crypto: 'crypto',
  cryptocurrency: 'crypto',
  cfd: 'cfd',
  cfds: 'cfd',
};

const getDimensionLabel = (dimension: TopBreakdownDimension): string => {
  switch (dimension) {
    case 'setups':
      return t('tradelog.column.setups');
    case 'assetTypes':
      return t('form.field.asset-type');
    case 'tags':
      return t('tradelog.column.tags');
    case 'tickers':
      return t('tradelog.column.ticker');
    default:
      return t('tradelog.column.setups');
  }
};

const getAssetTypeDisplayName = (value: string): string => {
  switch (value) {
    case 'stock':
      return t('form.field.asset-type.stock');
    case 'options':
      return t('form.field.asset-type.options');
    case 'futures':
      return t('form.field.asset-type.futures');
    case 'forex':
      return t('form.field.asset-type.forex');
    case 'crypto':
      return t('form.field.asset-type.crypto');
    case 'cfd':
      return t('form.field.asset-type.cfd');
    default:
      return value;
  }
};

const normalizeText = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim();
  }

  return '';
};

const getGroupingValues = (
  trade: Trade,
  dimension: TopBreakdownDimension
): string[] => {
  if (dimension === 'setups') {
    const setups = Array.isArray(trade.setup) ? trade.setup : [];
    return Array.from(
      new Set(
        setups.flatMap((setup) => {
          const normalized = normalizeText(setup);
          return normalized ? [normalized] : [];
        })
      )
    );
  }

  if (dimension === 'tags') {
    const rawTags =
      trade.customTags && trade.customTags.length > 0
        ? trade.customTags
        : trade.tags || [];

    return Array.from(
      new Set(
        rawTags.flatMap((tag) => {
          const normalized = normalizeText(tag);
          return normalized ? [normalized] : [];
        })
      )
    );
  }

  if (dimension === 'tickers') {
    const ticker = normalizeText(trade.instrument).toUpperCase();
    return ticker ? [ticker] : [];
  }

  const rawAssetType = normalizeText(trade.assetType).toLowerCase();
  const normalizedAssetType = ASSET_TYPE_ALIASES[rawAssetType] || rawAssetType;
  return normalizedAssetType ? [normalizedAssetType] : [];
};

const getDisplayNameForValue = (
  value: string,
  dimension: TopBreakdownDimension
): string => {
  if (dimension === 'assetTypes') {
    return getAssetTypeDisplayName(value);
  }

  return value;
};

const getTopBreakdownValue = (
  stat: TopBreakdownStats,
  valueMode: TopBreakdownValueMode
): number => {
  return valueMode === 'currency' ? Math.abs(stat.totalPnL) : stat.winRate;
};

const DIMENSION_OPTIONS: Array<{
  value: TopBreakdownDimension;
  label: string;
}> = [
  { value: 'setups', label: t('tradelog.column.setups') },
  { value: 'assetTypes', label: t('form.field.asset-type') },
  { value: 'tags', label: t('tradelog.column.tags') },
  { value: 'tickers', label: t('tradelog.column.ticker') },
];

const VALUE_MODE_OPTIONS: Array<{
  value: TopBreakdownValueMode;
  label: string;
}> = [
  { value: 'currency', label: t('form.field.value-dollar') },
  {
    value: 'percentage',
    label: t('home.widget.goals-progress.type.win-rate'),
  },
];

const SKELETON_ROWS = [
  { key: 'first', width: '75%' },
  { key: 'second', width: '50%' },
  { key: 'third', width: '25%' },
];

const getBarOpacity = (index: number): number => {
  const opacities = [1, 0.85, 0.7];
  return opacities[index] ?? 0.7;
};

const TopBreakdownConfigPanel: React.FC<TopBreakdownConfigPanelProps> = ({
  title,
  draftDimension,
  draftValueMode,
  onDraftDimensionChange,
  onDraftValueModeChange,
  onSave,
  onCancel,
}) => (
  <div className="journalit-home-setups journalit-home-setups--modal">
    <div className="journalit-home-widget__eyebrow journalit-home-setups__header">
      <span>{title}</span>
      <div className="journalit-home-setups__actions">
        <button
          className="clickable-icon journalit-home-setups__save-button"
          onClick={onSave}
          aria-label={t('button.save')}
        >
          <Check size={14} />
        </button>
        <button
          className="clickable-icon journalit-home-setups__cancel-button"
          onClick={onCancel}
          aria-label={t('button.cancel')}
        >
          <X size={14} />
        </button>
      </div>
    </div>

    <div className="journalit-home-setups__chip-list">
      {DIMENSION_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onDraftDimensionChange(option.value)}
          className={`journalit-home-setups__chip ${
            draftDimension === option.value
              ? 'journalit-home-setups__chip--active'
              : ''
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>

    <div className="journalit-home-setups__chip-list journalit-home-setups__chip-list--compact">
      {VALUE_MODE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onDraftValueModeChange(option.value)}
          className={`journalit-home-setups__chip ${
            draftValueMode === option.value
              ? 'journalit-home-setups__chip--active'
              : ''
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const TopBreakdownLoadingState: React.FC = () => (
  <div className="journalit-home-setups journalit-home-setups--loading">
    <SkeletonText width="80px" height="11px" />

    <div className="journalit-home-setups__skeleton-list">
      {SKELETON_ROWS.map((row) => (
        <div key={row.key} className="journalit-home-setups__skeleton-row">
          <div className="journalit-home-setups__skeleton-name">
            <SkeletonText width="80px" height="12px" />
          </div>
          <div className="journalit-home-setups__skeleton-bar">
            <SkeletonBox width={row.width} height={8} borderRadius="0px" />
          </div>
          <div className="journalit-home-setups__skeleton-pnl">
            <SkeletonText width="60px" height="12px" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TopBreakdownEmptyState: React.FC<TopBreakdownEmptyStateProps> = ({
  title,
  customizeLabel,
  onOpenModal,
}) => (
  <div
    className="journalit-home-setups journalit-home-setups--empty"
    onClick={onOpenModal}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onOpenModal();
      }
    }}
    aria-label={customizeLabel}
  >
    <div className="journalit-home-widget__eyebrow journalit-home-setups__header">
      {title}
    </div>

    <div className="journalit-home-setups__empty">
      <span className="journalit-home-setups__empty-message">
        {t('widget.empty.no-data')}
      </span>
    </div>
  </div>
);

const TopBreakdownRow: React.FC<TopBreakdownRowProps> = ({
  setup,
  index,
  valueMode,
  maxValue,
  effectiveCurrency,
  formatValue,
  shouldMask,
}) => {
  const isPercentageMode = valueMode === 'percentage';
  const hasDecidedTrades = setup.winCount + setup.lossCount > 0;
  const isValueMasked = isPercentageMode
    ? shouldMask('returnPercent')
    : shouldMask('pnl');
  const barColor = isValueMasked
    ? 'var(--text-muted)'
    : isPercentageMode
      ? hasDecidedTrades
        ? 'var(--text-normal)'
        : 'var(--text-muted)'
      : setup.totalPnL >= 0
        ? 'var(--color-green)'
        : 'var(--color-red)';
  const barWidth = Math.max(
    8,
    (getTopBreakdownValue(setup, valueMode) / maxValue) * 100
  );
  const valueText = isPercentageMode
    ? formatValue({
        kind: 'returnPercent',
        value: setup.winRate,
        signed: false,
        precision: 1,
      })
    : formatValue({
        kind: 'pnl',
        value: setup.totalPnL,
        currencyCode: effectiveCurrency,
      });

  return (
    <Tooltip
      content={
        <div className="journalit-home-setups__tooltip">
          <span className="journalit-home-setups__tooltip-text">
            {t('home.widget.setups.trades-count', {
              count: String(setup.tradeCount),
            })}
          </span>
          {valueMode === 'currency' && (
            <>
              <span className="journalit-home-setups__tooltip-separator">
                ·
              </span>
              <span className="journalit-home-setups__tooltip-text">
                {shouldMask('returnPercent')
                  ? `${formatValue({
                      kind: 'returnPercent',
                      value: setup.winRate,
                      signed: false,
                      precision: 0,
                    })} ${t('dashboard.metrics.winRate')}`
                  : t('home.widget.setups.win-rate', {
                      rate: setup.winRate.toFixed(0),
                    })}
              </span>
            </>
          )}
        </div>
      }
      delay={200}
    >
      <div
        className="journalit-home-setups__row"
        style={cssVars({
          '--journalit-home-setups-row-color': barColor,
          '--journalit-home-setups-row-bar-width': isValueMasked
            ? '8%'
            : `${barWidth}%`,
          '--journalit-home-setups-row-bar-opacity': isValueMasked
            ? '0.25'
            : String(getBarOpacity(index)),
        })}
      >
        <span className="journalit-home-setups__name">{setup.displayName}</span>
        <div className="journalit-home-setups__bar">
          <div className="journalit-home-setups__bar-fill" />
        </div>
        <span className="journalit-home-setups__pnl">{valueText}</span>
      </div>
    </Tooltip>
  );
};

const buildTopBreakdownStats = ({
  trades,
  dimension,
  valueMode,
  breakEvenSettings,
}: BuildTopBreakdownStatsOptions): TopBreakdownStats[] => {
  const pnlContributingTrades = (trades || []).filter((trade) =>
    isPnlContributingTrade(trade)
  );

  if (pnlContributingTrades.length === 0) return [];

  const statsMap = new Map<
    string,
    {
      displayName: string;
      totalPnL: number;
      tradeCount: number;
      winCount: number;
      lossCount: number;
    }
  >();

  for (const trade of pnlContributingTrades) {
    const values = getGroupingValues(trade, dimension);
    if (values.length === 0) continue;

    const pnl = getEffectivePnL(trade);
    const outcome = classifyPnLWithBreakEvenSettings(
      pnl,
      breakEvenSettings,
      trade.breakEvenAccountCurrentBalance
    );

    for (const value of values) {
      const existing = statsMap.get(value) || {
        displayName: getDisplayNameForValue(value, dimension),
        totalPnL: 0,
        tradeCount: 0,
        winCount: 0,
        lossCount: 0,
      };

      existing.totalPnL += pnl;
      existing.tradeCount += 1;

      if (outcome === 'win') {
        existing.winCount += 1;
      } else if (outcome === 'loss') {
        existing.lossCount += 1;
      }

      statsMap.set(value, existing);
    }
  }

  const stats = Array.from(statsMap.entries(), ([key, value]) => ({
    key,
    displayName: value.displayName,
    totalPnL: value.totalPnL,
    tradeCount: value.tradeCount,
    winCount: value.winCount,
    lossCount: value.lossCount,
    winRate:
      calculateWinRateExcludingBreakeven(value.winCount, value.lossCount) * 100,
  }));

  stats.sort((a, b) => {
    if (valueMode === 'currency') {
      if (b.totalPnL !== a.totalPnL) return b.totalPnL - a.totalPnL;
    } else if (b.winRate !== a.winRate) {
      return b.winRate - a.winRate;
    }

    if (b.tradeCount !== a.tradeCount) return b.tradeCount - a.tradeCount;
    return b.totalPnL - a.totalPnL;
  });

  return stats;
};

const SetupLeaderboardWidgetComponent: React.FC<
  SetupLeaderboardWidgetProps
> = ({ plugin, instanceId }) => {
  const { dashboardData, forceRefreshData } = useDashboardData();
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();

  useEffect(() => {}, []);

  const existingConfig = plugin.settings.home?.topBreakdowns?.[instanceId];
  const resolvedConfig = existingConfig || DEFAULT_CONFIG;

  const [draftDimension, setDraftDimension] =
    useState<TopBreakdownDimension | null>(null);
  const [draftValueMode, setDraftValueMode] = useState<TopBreakdownValueMode>(
    resolvedConfig.valueMode
  );

  const [, setSettingsVersion] = useState(0);

  const handleSettingsChanged = useCallback(
    (payload?: { section?: string }) => {
      if (payload?.section === 'trade') {
        setSettingsVersion((prev) => prev + 1);
      }
    },
    []
  );

  useEventBus('settings:changed', handleSettingsChanged);

  const filteredTrades = useFilteredByPeriod(dashboardData?.trades);
  const currencyConversion = buildCurrencyConversionMetadata(
    dashboardData?.metrics
  );
  const effectiveCurrency =
    dashboardData?.metrics.conversionBaseCurrency || currency;

  const breakEvenSettings = useMemo(
    () => ({
      breakEvenRangeMin: plugin.settings.trade?.breakEvenRangeMin,
      breakEvenRangeMax: plugin.settings.trade?.breakEvenRangeMax,
      breakEvenThresholdMode:
        plugin.settings.trade?.breakEvenThresholdMode ?? 'fixed',
      breakEvenThresholdPercent:
        plugin.settings.trade?.breakEvenThresholdPercent,
    }),
    [
      plugin.settings.trade?.breakEvenRangeMin,
      plugin.settings.trade?.breakEvenRangeMax,
      plugin.settings.trade?.breakEvenThresholdMode,
      plugin.settings.trade?.breakEvenThresholdPercent,
    ]
  );

  const setupStats = useMemo(
    (): TopBreakdownStats[] =>
      buildTopBreakdownStats({
        trades: filteredTrades,
        dimension: resolvedConfig.dimension,
        valueMode: resolvedConfig.valueMode,
        breakEvenSettings,
      }),
    [
      filteredTrades,
      resolvedConfig.dimension,
      resolvedConfig.valueMode,
      breakEvenSettings,
    ]
  );

  const maxValue = useMemo(() => {
    if (setupStats.length === 0) return 1;

    return Math.max(
      ...setupStats.map((stat) =>
        getTopBreakdownValue(stat, resolvedConfig.valueMode)
      ),
      1
    );
  }, [setupStats, resolvedConfig.valueMode]);

  const displayedSetups = setupStats.slice(0, 3);

  const handleOpenModal = useCallback(() => {
    setDraftDimension(resolvedConfig.dimension);
    setDraftValueMode(resolvedConfig.valueMode);
  }, [resolvedConfig.dimension, resolvedConfig.valueMode]);

  const handleCancelModal = useCallback(() => {
    setDraftDimension(null);
    setDraftValueMode(resolvedConfig.valueMode);
  }, [resolvedConfig.valueMode]);

  const handleSaveConfig = useCallback(async () => {
    if (draftDimension === null) return;

    if (!plugin.settings.home) {
      plugin.settings.home = {
        layouts: { Default: { lg: [], md: [], sm: [], xs: [], xxs: [] } },
        activeLayout: 'Default',
      };
    }

    if (!plugin.settings.home.topBreakdowns) {
      plugin.settings.home.topBreakdowns = {};
    }

    plugin.settings.home.topBreakdowns[instanceId] = {
      dimension: draftDimension,
      valueMode: draftValueMode,
      createdAt: existingConfig?.createdAt || new Date().toISOString(),
    };

    try {
      await plugin.saveSettings();
      eventBus.publish('settings:changed', {
        component: 'home',
        section: 'home',
        source: 'setup-leaderboard-config',
      });
      await forceRefreshData();
      setDraftDimension(null);
    } catch (error) {
      console.error('Failed to save top breakdown settings:', error);
    }
  }, [
    plugin,
    instanceId,
    draftDimension,
    draftValueMode,
    existingConfig?.createdAt,
    forceRefreshData,
  ]);

  const widgetTitle = t('home.widget.top-breakdown.title', {
    dimension: getDimensionLabel(resolvedConfig.dimension),
  });

  const widgetCustomizeLabel = t('home.widget.top-breakdown.aria.customize', {
    dimension: getDimensionLabel(resolvedConfig.dimension),
  });

  const widgetConfigureTitle = t('home.widget.top-breakdown.configure-title', {
    dimension: getDimensionLabel(draftDimension ?? resolvedConfig.dimension),
  });

  if (draftDimension !== null) {
    return (
      <TopBreakdownConfigPanel
        title={widgetConfigureTitle}
        draftDimension={draftDimension}
        draftValueMode={draftValueMode}
        onDraftDimensionChange={setDraftDimension}
        onDraftValueModeChange={setDraftValueMode}
        onSave={() => void handleSaveConfig()}
        onCancel={handleCancelModal}
      />
    );
  }

  if (!dashboardData) {
    return <TopBreakdownLoadingState />;
  }

  if (setupStats.length === 0) {
    return (
      <TopBreakdownEmptyState
        title={widgetTitle}
        customizeLabel={widgetCustomizeLabel}
        onOpenModal={handleOpenModal}
      />
    );
  }

  return (
    <div
      className="journalit-home-setups journalit-home-setups--active"
      onClick={() => void handleOpenModal()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleOpenModal();
        }
      }}
      aria-label={widgetCustomizeLabel}
    >
      <div className="journalit-home-widget__eyebrow journalit-home-setups__header">
        <span className="journalit-home-setups__title">{widgetTitle}</span>
        {resolvedConfig.valueMode === 'currency' && (
          <CurrencyConversionInfo
            metadata={currencyConversion}
            trades={(filteredTrades || []).filter((trade) =>
              isPnlContributingTrade(trade)
            )}
          />
        )}
      </div>

      <div className="journalit-home-setups__list">
        {displayedSetups.map((setup, index) => (
          <TopBreakdownRow
            key={setup.key}
            setup={setup}
            index={index}
            valueMode={resolvedConfig.valueMode}
            maxValue={maxValue}
            effectiveCurrency={effectiveCurrency}
            formatValue={formatValue}
            shouldMask={shouldMask}
          />
        ))}
      </div>
    </div>
  );
};

export const SetupLeaderboardWidget = memo(SetupLeaderboardWidgetComponent);
