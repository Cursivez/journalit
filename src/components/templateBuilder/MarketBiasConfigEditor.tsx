

import React from 'react';
import { t } from '../../lang/helpers';
import type JournalitPlugin from '../../main';
import { OptionType } from '../../services/options/CustomOptionsService';
import { ComboBox } from '../core/ComboBox';
import { SegmentedControl } from '../shared/SegmentedControl';
import type { WidgetPlacement } from '../../types/reviewV2';
import {
  parseMarketBiasTickers,
  toMarketBiasWidgetConfig,
  type MarketBiasFor,
} from '../../services/reviews/marketBias';

interface MarketBiasConfigEditorProps {
  index: number;
  widget: WidgetPlacement;
  plugin: JournalitPlugin;
  onConfigChange: (index: number, config: Record<string, unknown>) => void;
}

export const MarketBiasConfigEditor: React.FC<MarketBiasConfigEditorProps> = ({
  index,
  widget,
  plugin,
  onConfigChange,
}) => {
  
  const instruments = plugin.optionsService.getOptions(OptionType.INSTRUMENT);
  const config = toMarketBiasWidgetConfig(widget.config);
  const tickers = parseMarketBiasTickers(config.tickers);
  const update = (updates: Record<string, unknown>) =>
    onConfigChange(index, { ...widget.config, ...updates });

  const setTickers = (values: string[]) =>
    update({ tickers: parseMarketBiasTickers(values.join(',')).join(',') });

  return (
    <div className="template-review-context-config">
      <div className="template-review-context-config-row">
        <div className="template-review-context-config-label">
          {t('templateEditor.widget.market-bias.bias-for')}
        </div>
        <div className="template-review-context-config-control template-review-context-pills">
          <SegmentedControl<MarketBiasFor>
            options={[
              {
                value: 'overall',
                label: t('templateEditor.widget.market-bias.bias-for.overall'),
              },
              {
                value: 'tickers',
                label: t('templateEditor.widget.market-bias.bias-for.tickers'),
              },
            ]}
            value={config.biasFor ?? 'overall'}
            size="small"
            ariaLabel={t('templateEditor.widget.market-bias.bias-for')}
            onChange={(biasFor) => update({ biasFor })}
          />
        </div>
      </div>

      {config.biasFor === 'tickers' && (
        <div className="template-review-context-config-row template-review-context-config-row--stacked">
          <ComboBox
            isMulti
            allowCreate
            label={t('templateEditor.widget.market-bias.tickers')}
            options={instruments}
            value={tickers}
            placeholder={t(
              'templateEditor.widget.market-bias.tickers-placeholder'
            )}
            onChange={setTickers}
          />
          {tickers.length === 0 && (
            <div className="template-widget-config-help">
              {t('templateEditor.widget.market-bias.tickers-empty')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
