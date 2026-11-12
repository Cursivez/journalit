

import React, { useState } from 'react';
import { BaseWidget, type BaseWidgetProps } from './BaseWidget';
import { RollingBiasWinRateChart as SharedRollingBiasWinRateChart } from '../../../charts/RollingBiasWinRateChart';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useTradeMarketBiasResolver } from '../../../../hooks/useTradeMarketBiasResolver';
import { t } from '../../../../lang/helpers';
import { getAnalyticsDateBasis } from '../../../../utils/tradeAnalyticsDate';
import {
  ROLLING_BIAS_PERIODS,
  calculateRollingBiasWinRate,
  parseRollingBiasPeriod,
  type RollingBiasPeriod,
} from '../../../../services/marketBias/rollingBiasWinRate';
import {
  getBreakEvenSettings,
  toRollingBiasTrades,
} from '../../../../services/marketBias/rollingBiasTrades';
import { DropdownSelect } from '../../../shared/DropdownSelect';

export const RollingBiasWinRateChart = React.memo<BaseWidgetProps>(
  ({ dateFormat }) => {
    const plugin = usePlugin();
    const resolveBias = useTradeMarketBiasResolver();
    const [period, setPeriod] = useState<RollingBiasPeriod>(20);

    return (
      <BaseWidget dateFormat={dateFormat} skeletonType="line-chart">
        {(data) => {
          const points = resolveBias
            ? calculateRollingBiasWinRate(
                toRollingBiasTrades(
                  data.trades,
                  resolveBias,
                  getBreakEvenSettings(plugin),
                  getAnalyticsDateBasis(plugin?.settings)
                ),
                period
              )
            : [];
          return (
            <div className="journalit-chart-widget">
              <div className="journalit-chart-widget__header">
                <div className="journalit-chart-widget__title">
                  {t('dashboard.rolling_bias.title')}
                </div>
                <div className="journalit-chart-widget__selector">
                  <DropdownSelect
                    variant="button"
                    menuWidth="content"
                    showOptionTooltips={false}
                    ariaLabel={t('dashboard.rolling_win_loss.period_aria')}
                    value={String(period)}
                    options={ROLLING_BIAS_PERIODS.map((option) => ({
                      value: String(option),
                      label: t('dashboard.rolling_bias.last_trades', {
                        count: String(option),
                      }),
                    }))}
                    onChange={(nextValue) => {
                      const next = parseRollingBiasPeriod(nextValue);
                      if (next) setPeriod(next);
                    }}
                  />
                </div>
              </div>
              {points.length === 0 ? (
                <div className="journalit-dashboard-directional-chart-empty">
                  {t('dashboard.rolling_bias.empty', {
                    count: String(period),
                  })}
                </div>
              ) : (
                <SharedRollingBiasWinRateChart
                  points={points}
                  period={period}
                  xAxis="tradeNumber"
                />
              )}
            </div>
          );
        }}
      </BaseWidget>
    );
  }
);

RollingBiasWinRateChart.displayName = 'RollingBiasWinRateChart';
