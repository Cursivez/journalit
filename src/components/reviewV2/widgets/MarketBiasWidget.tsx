

import React, { useState } from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { Tooltip } from '../../shared/Tooltip';
import {
  Info,
  Minus,
  TrendingDown,
  TrendingUp,
  type ObsidianIconComponent,
} from '../../shared/icons/ObsidianIcon';
import { InvalidContextMessage } from './InvalidContextMessage';
import { useReviewReadOnly } from '../ReviewReadOnlyContext';
import { useNoteFrontmatter } from '../hooks/useNoteFrontmatter';
import { mergeClassNames } from '../../../utils/classNames';
import {
  MARKET_BIAS_DIRECTIONS,
  findMarketBias,
  marketBiasUpdate,
  readMarketBias,
  resolveMarketBiasDisplayRows,
  withMarketBias,
  type MarketBiasDirection,
  type MarketBiasEntry,
  type MarketBiasWidgetConfig,
} from '../../../services/reviews/marketBias';

type MarketBiasPeriod = 'day' | 'week';

interface MarketBiasWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: MarketBiasWidgetConfig;
  
  preview?: boolean;
  previewPeriod?: MarketBiasPeriod;
  previewEntries?: readonly MarketBiasEntry[];
}

const DIRECTION_ICONS: Record<MarketBiasDirection, ObsidianIconComponent> = {
  long: TrendingUp,
  neutral: Minus,
  short: TrendingDown,
};

function directionLabel(direction: MarketBiasDirection): string {
  switch (direction) {
    case 'long':
      return t('widget.market-bias.long');
    case 'neutral':
      return t('widget.market-bias.neutral');
    case 'short':
      return t('widget.market-bias.short');
  }
}

function rowLabel(ticker: string | undefined, period: MarketBiasPeriod) {
  if (ticker !== undefined) return ticker;
  return period === 'day'
    ? t('widget.market-bias.overall.day')
    : t('widget.market-bias.overall.week');
}

function periodFromNoteType(value: unknown): MarketBiasPeriod | null {
  if (value === 'drc') return 'day';
  if (value === 'weekly-review') return 'week';
  return null;
}

const MarketBiasHeader: React.FC<{ period: MarketBiasPeriod }> = ({
  period,
}) => {
  const tooltip = t('widget.market-bias.tooltip');
  return (
    <div className="journalit-market-bias-header">
      <span className="journalit-market-bias-title">
        {period === 'day'
          ? t('widget.market-bias.title.day')
          : t('widget.market-bias.title.week')}
      </span>
      <Tooltip
        content={
          <div className="journalit-market-bias-tooltip-content">{tooltip}</div>
        }
        preferredPosition="bottom"
        disclosureLabel={tooltip}
        triggerClassName="journalit-market-bias-tooltip-trigger"
      >
        <Info size={12} aria-hidden="true" />
      </Tooltip>
    </div>
  );
};

const MarketBiasChoice: React.FC<{
  label: string;
  value: MarketBiasDirection | null;
  readOnly: boolean;
  onChange: (bias: MarketBiasDirection | null) => void;
}> = ({ label, value, readOnly, onChange }) => (
  <div
    className="journalit-market-bias-choice"
    role="group"
    aria-label={t('widget.market-bias.row-aria', { row: label })}
  >
    {MARKET_BIAS_DIRECTIONS.map((direction) => {
      const Icon = DIRECTION_ICONS[direction];
      const selected = value === direction;
      return (
        <button
          key={direction}
          type="button"
          className={mergeClassNames(
            'journalit-market-bias-option',
            selected && `is-selected is-${direction}`
          )}
          aria-pressed={selected}
          disabled={readOnly}
          
          onClick={() => onChange(selected ? null : direction)}
        >
          <Icon size={12} aria-hidden="true" />
          {directionLabel(direction)}
        </button>
      );
    })}
  </div>
);

const MarketBiasRows: React.FC<{
  period: MarketBiasPeriod;
  config: MarketBiasWidgetConfig | undefined;
  entries: readonly MarketBiasEntry[];
  readOnly: boolean;
  onChange?: (
    ticker: string | undefined,
    bias: MarketBiasDirection | null
  ) => void;
}> = ({ period, config, entries, readOnly, onChange }) => (
  <div className="journalit-market-bias-widget">
    <MarketBiasHeader period={period} />
    <div className="journalit-market-bias-rows">
      {resolveMarketBiasDisplayRows(config, entries).map((ticker) => {
        const label = rowLabel(ticker, period);
        return (
          <div key={ticker ?? ''} className="journalit-market-bias-row">
            <span
              className={mergeClassNames(
                'journalit-market-bias-row-label',
                ticker === undefined && 'is-overall'
              )}
            >
              {label}
            </span>
            <MarketBiasChoice
              label={label}
              value={findMarketBias(entries, ticker)}
              readOnly={readOnly}
              onChange={(bias) => onChange?.(ticker, bias)}
            />
          </div>
        );
      })}
    </div>
  </div>
);

export const MarketBiasWidget: React.FC<MarketBiasWidgetProps> = React.memo(
  ({ filePath, plugin, config, preview, previewPeriod, previewEntries }) => {
    if (preview) {
      return (
        <MarketBiasRows
          period={previewPeriod ?? 'day'}
          config={config}
          entries={previewEntries ?? []}
          readOnly
        />
      );
    }
    return (
      <MarketBiasWidgetBody
        filePath={filePath}
        plugin={plugin}
        config={config}
      />
    );
  }
);

MarketBiasWidget.displayName = 'MarketBiasWidget';


interface PendingChoice {
  ticker: string | undefined;
  bias: MarketBiasDirection | null;
}

const MarketBiasWidgetBody: React.FC<
  Pick<MarketBiasWidgetProps, 'filePath' | 'plugin' | 'config'>
> = ({ filePath, plugin, config }) => {
  const readOnly = useReviewReadOnly();
  const frontmatter = useNoteFrontmatter(plugin, filePath);
  const [pending, setPending] = useState<PendingChoice[]>([]);
  const period = periodFromNoteType(frontmatter?.type);

  if (!frontmatter || !period) {
    return (
      <InvalidContextMessage
        widgetType={t('widget.market-bias.name')}
        reason={t('widget.market-bias.invalid-context')}
      />
    );
  }

  const saved = readMarketBias(frontmatter);
  const entries = pending.reduce<MarketBiasEntry[]>(
    (current, choice) => withMarketBias(current, choice.ticker, choice.bias),
    saved
  );

  const setBias = async (
    ticker: string | undefined,
    bias: MarketBiasDirection | null
  ) => {
    const choice: PendingChoice = { ticker, bias };
    setPending((current) => [...current, choice]);
    const compute = (current: Readonly<Record<string, unknown>>) =>
      marketBiasUpdate(current, ticker, bias);
    try {
      if (period === 'day') {
        await plugin.drcService.updateDRCFrontmatterWith(
          filePath,
          compute,
          'market-bias-widget'
        );
      } else {
        const weeklyReviewService = plugin.serviceManager
          ? await plugin.serviceManager.getWeeklyReviewService()
          : plugin.weeklyReviewService;
        await weeklyReviewService.updateWeeklyReviewFrontmatterWith(
          filePath,
          compute
        );
      }
    } catch (error) {
      console.error('[MarketBiasWidget] Failed to save market bias:', error);
      new Notice(t('widget.market-bias.save-failed'));
    } finally {
      setPending((current) => current.filter((item) => item !== choice));
    }
  };

  return (
    <MarketBiasRows
      period={period}
      config={config}
      entries={entries}
      readOnly={readOnly}
      onChange={(ticker, bias) => void setBias(ticker, bias)}
    />
  );
};
