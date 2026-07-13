

import React, { useState } from 'react';
import { AUMChartProps, AUMChartDataPoint } from './types';
import { EmptyState } from '../../shared/EmptyState';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  TooltipProps,
  Area,
  DotItemDotProps,
} from 'recharts';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { CurrencyCode } from '../../../utils/currencyConfig';
import { ChartBase } from '../../charts/ChartBase';
import { RechartsPortalTooltip } from '../../charts/RechartsPortalTooltip';
import { generateNiceAxis } from '../../../utils/chartUtils';

const POSITIVE_AUM_COLOR = 'var(--chart-positive, #43a047)';
const NEGATIVE_AUM_COLOR = 'var(--chart-negative, #e53935)';
let aumChartIdCounter = 0;

interface AUMDotProps extends Omit<DotItemDotProps, 'payload'> {
  payload?: AUMChartDataPoint;
}

const asAUMDotProps = (props: DotItemDotProps): AUMDotProps => props;


interface CustomTooltipContentProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: ReadonlyArray<{
    value: number;
    name: string;
    dataKey: string;
    payload: AUMChartDataPoint;
  }>;
  currency: CurrencyCode;
  displayRMultiples?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

const isAUMTooltipPayloadEntry = (
  value: unknown
): value is NonNullable<CustomTooltipContentProps['payload']>[number] => {
  if (!isRecord(value)) {
    return false;
  }

  const entry = value;
  return (
    typeof entry.value === 'number' &&
    typeof entry.name === 'string' &&
    typeof entry.dataKey === 'string' &&
    Boolean(entry.payload) &&
    typeof entry.payload === 'object' &&
    !Array.isArray(entry.payload)
  );
};

const asAUMTooltipPayload = (
  payload: readonly unknown[] | undefined
): CustomTooltipContentProps['payload'] =>
  payload?.filter(isAUMTooltipPayloadEntry);

const CustomTooltip: React.FC<CustomTooltipContentProps> = ({
  active,
  payload,
  currency,
  displayRMultiples: _displayRMultiples,
}) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isMoneyMasked = shouldMask('money');

  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="journalit-account-chart-tooltip">
      <div className="journalit-account-chart-tooltip-date">{data.date}</div>
      <div className="journalit-account-chart-tooltip-value">
        AUM:{' '}
        {formatValue({
          kind: 'balance',
          value: data.balance,
          currencyCode: currency,
          notation: 'compact',
        })}
      </div>

      
      {(data.isDeposit ||
        data.isWithdrawal ||
        data.accountCreated ||
        data.accountArchived) && (
        <div className="journalit-account-chart-tooltip-section">
          {data.isDeposit && (
            <div
              className={`journalit-account-chart-tooltip-row ${isMoneyMasked ? 'journalit-account-chart-tooltip-row--neutral' : 'journalit-account-chart-tooltip-row--deposit'}`}
            >
              {isMoneyMasked ? 'Cashflow: ' : 'Deposit: '}
              {formatValue({
                kind: 'money',
                value: data.depositAmount,
                currencyCode: currency,
                notation: 'compact',
              })}
            </div>
          )}

          {data.isWithdrawal && (
            <div
              className={`journalit-account-chart-tooltip-row ${isMoneyMasked ? 'journalit-account-chart-tooltip-row--neutral' : 'journalit-account-chart-tooltip-row--withdrawal'}`}
            >
              {isMoneyMasked ? 'Cashflow: ' : 'Withdrawal: '}
              {formatValue({
                kind: 'money',
                value: data.withdrawalAmount,
                currencyCode: currency,
                notation: 'compact',
              })}
            </div>
          )}

          {data.accountCreated && (
            <div className="journalit-account-chart-tooltip-row journalit-account-chart-tooltip-row--positive">
              {t('account.chart.event.added')}
            </div>
          )}

          {data.accountArchived && (
            <div className="journalit-account-chart-tooltip-row journalit-account-chart-tooltip-row--negative">
              {t('account.chart.event.archived')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AUMChartDefs: React.FC<{
  chartId: string;
  positiveColor: string;
  negativeColor: string;
  aumTransitionOffset: number;
  strokeTransitionOffset: number;
}> = ({
  chartId,
  positiveColor,
  negativeColor,
  aumTransitionOffset,
  strokeTransitionOffset,
}) => (
  <defs>
    <linearGradient id={`${chartId}-gradient`} x1="0" y1="0" x2="0" y2="1">
      {aumTransitionOffset <= 0.1 ? (
        <>
          <stop offset="0%" stopColor={negativeColor} stopOpacity={0.4} />
          <stop offset="100%" stopColor={negativeColor} stopOpacity={0.1} />
        </>
      ) : aumTransitionOffset >= 99.9 ? (
        <>
          <stop offset="0%" stopColor={positiveColor} stopOpacity={0.4} />
          <stop offset="100%" stopColor={positiveColor} stopOpacity={0.1} />
        </>
      ) : (
        <>
          <stop offset="0%" stopColor={positiveColor} stopOpacity={0.4} />
          <stop
            offset={`${aumTransitionOffset}%`}
            stopColor={positiveColor}
            stopOpacity={0.1}
          />
          <stop
            offset={`${aumTransitionOffset}%`}
            stopColor={negativeColor}
            stopOpacity={0.1}
          />
          <stop offset="100%" stopColor={negativeColor} stopOpacity={0.4} />
        </>
      )}
    </linearGradient>
    <linearGradient
      id={`${chartId}-stroke-gradient`}
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      {strokeTransitionOffset <= 0.1 ? (
        <>
          <stop offset="0%" stopColor={negativeColor} />
          <stop offset="100%" stopColor={negativeColor} />
        </>
      ) : strokeTransitionOffset >= 99.9 ? (
        <>
          <stop offset="0%" stopColor={positiveColor} />
          <stop offset="100%" stopColor={positiveColor} />
        </>
      ) : (
        <>
          <stop offset="0%" stopColor={positiveColor} />
          <stop
            offset={`${Math.max(0.1, strokeTransitionOffset - 0.1)}%`}
            stopColor={positiveColor}
          />
          <stop
            offset={`${Math.min(99.9, strokeTransitionOffset + 0.1)}%`}
            stopColor={negativeColor}
          />
          <stop offset="100%" stopColor={negativeColor} />
        </>
      )}
    </linearGradient>

    <filter id="aumShadow" height="120%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
    </filter>

    <filter id="aumGlow" height="130%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
      <feColorMatrix
        in="blur"
        mode="matrix"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
        result="glow"
      />
      <feComposite in="SourceGraphic" in2="glow" operator="over" />
    </filter>
  </defs>
);


export const AUMChart: React.FC<AUMChartProps> = ({
  data,
  height = 300,
  plugin: _plugin,
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartIdRef = React.useRef(`aum-chart-${++aumChartIdCounter}`);
  const chartId = chartIdRef.current;
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isBalanceMasked = shouldMask('balance');
  const positiveColor = isBalanceMasked
    ? 'var(--text-muted)'
    : POSITIVE_AUM_COLOR;
  const negativeColor = isBalanceMasked
    ? 'var(--text-muted)'
    : NEGATIVE_AUM_COLOR;

  const dataSignature = data
    .map((point) => `${point.date}:${point.balance}`)
    .join('|');
  const [dotsReadyForSignature, setDotsReadyForSignature] = useState('');
  const showDots = dotsReadyForSignature === dataSignature;

  
  if (!data || data.length === 0) {
    return (
      <div
        className="journalit-account-chart-empty"
        style={cssVars({ '--account-chart-empty-height': `${height}px` })}
      >
        <EmptyState
          message={t('account.aum-chart.empty')}
          subMessage={t('account.aum-chart.empty-sub')}
        />
      </div>
    );
  }

  const chartData = isBalanceMasked
    ? data.map((point) => ({ ...point, displayBalance: 1 }))
    : data.map((point) => ({ ...point, displayBalance: point.balance }));

  
  const balanceValues = chartData.map((point) => point.displayBalance);
  const minValue = Math.min(...balanceValues);
  const maxValue = Math.max(...balanceValues);
  const baselineValue = chartData[0].displayBalance;

  
  const { domain, ticks } = isBalanceMasked
    ? { domain: [0, 2] as [number, number], ticks: [1] }
    : generateNiceAxis(minValue, maxValue, 6, true, false);

  const aumTransitionOffset =
    minValue >= baselineValue
      ? 100
      : maxValue <= baselineValue
        ? 0
        : Math.max(
            0,
            Math.min(
              100,
              ((maxValue - baselineValue) / (maxValue - domain[0])) * 100
            )
          );

  const strokeTransitionOffset =
    minValue >= baselineValue
      ? 100
      : maxValue <= baselineValue
        ? 0
        : Math.max(
            0,
            Math.min(
              100,
              ((maxValue - baselineValue) / (maxValue - minValue)) * 100
            )
          );

  return (
    <div className="aum-chart">
      <ChartBase height={height} width="100%" chartRef={chartRef}>
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
        >
          <AUMChartDefs
            chartId={chartId}
            positiveColor={positiveColor}
            negativeColor={negativeColor}
            aumTransitionOffset={aumTransitionOffset}
            strokeTransitionOffset={strokeTransitionOffset}
          />
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--background-modifier-border)"
            strokeOpacity={0.5}
          />
          <XAxis dataKey="date" tickMargin={8} tickLine={false} />
          <YAxis
            tickFormatter={(value: number) =>
              formatValue({
                kind: 'balance',
                value,
                currencyCode: currency,
                notation: 'compact',
              })
            }
            domain={domain}
            allowDataOverflow={false}
            width={85}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            ticks={ticks}
          />
          <RechartsPortalTooltip
            chartRef={chartRef}
            cursor={{
              fill: 'var(--interactive-hover)',
              fillOpacity: 0.1,
              strokeOpacity: 0.3,
              strokeWidth: 1,
              stroke: 'var(--interactive-accent)',
            }}
          >
            {(tooltipProps) => (
              <CustomTooltip
                active={tooltipProps.active}
                payload={asAUMTooltipPayload(tooltipProps.payload)}
                currency={currency}
                displayRMultiples={false}
              />
            )}
          </RechartsPortalTooltip>

          
          <ReferenceLine
            y={baselineValue}
            stroke="var(--text-muted)"
            strokeOpacity={0.5}
            strokeDasharray="3 3"
            strokeWidth={1}
          />

          
          <Area
            type="monotone"
            dataKey="displayBalance"
            stroke="none"
            fill={`url(#${chartId}-gradient)`}
            fillOpacity={1}
            dot={false}
            activeDot={false}
            baseValue={domain[0]}
            filter="url(#aumShadow)"
          />

          
          <Line
            type="monotone"
            dataKey="displayBalance"
            stroke={`url(#${chartId}-stroke-gradient)`}
            strokeWidth={2.5}
            onAnimationEnd={() => setDotsReadyForSignature(dataSignature)}
            dot={(props: DotItemDotProps) => {
              const { cx, cy, payload } = asAUMDotProps(props);
              if (!payload || cx == null || cy == null)
                return <circle cx={0} cy={0} r={0} opacity={0} />;

              
              if (!showDots) return <circle cx={0} cy={0} r={0} opacity={0} />;

              
              if (payload.accountCreated) {
                return (
                  <g>
                    <line
                      x1={cx}
                      y1={cy - 15}
                      x2={cx}
                      y2={cy + 15}
                      stroke="var(--text-success)"
                      strokeWidth="2"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5"
                      fill="var(--background-primary)"
                      stroke="var(--text-success)"
                      strokeWidth="2"
                    />
                  </g>
                );
              }

              
              if (payload.accountArchived) {
                return (
                  <g>
                    <line
                      x1={cx}
                      y1={cy - 15}
                      x2={cx}
                      y2={cy + 15}
                      stroke="var(--text-error)"
                      strokeWidth="2"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5"
                      fill="var(--background-primary)"
                      stroke="var(--text-error)"
                      strokeWidth="2"
                    />
                  </g>
                );
              }

              
              if (payload.isDeposit) {
                return (
                  <g>
                    <line
                      x1={cx}
                      y1={cy - 15}
                      x2={cx}
                      y2={cy + 15}
                      stroke="var(--interactive-accent)"
                      strokeWidth="2"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5"
                      fill="var(--background-primary)"
                      stroke="var(--interactive-accent)"
                      strokeWidth="2"
                    />
                  </g>
                );
              }

              
              if (payload.isWithdrawal) {
                return (
                  <g>
                    <line
                      x1={cx}
                      y1={cy - 15}
                      x2={cx}
                      y2={cy + 15}
                      stroke="var(--text-warning, gold)"
                      strokeWidth="2"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5"
                      fill="var(--background-primary)"
                      stroke="var(--text-warning, gold)"
                      strokeWidth="2"
                    />
                  </g>
                );
              }

              
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r="3"
                  fill="var(--text-muted)"
                  stroke="var(--background-primary)"
                  strokeWidth="1"
                />
              );
            }}
            activeDot={{
              r: 7,
              stroke: 'var(--background-primary)',
              strokeWidth: 1,
              fill: 'var(--interactive-accent)',
              filter: 'url(#aumGlow)',
            }}
            name="AUM Balance"
          />
        </ComposedChart>
      </ChartBase>
    </div>
  );
};
