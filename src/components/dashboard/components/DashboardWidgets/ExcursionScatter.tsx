import React from 'react';
import {
  CartesianGrid,
  Legend,
  ReferenceLine,
  Scatter,
  ScatterChart,
  Symbols,
  XAxis,
  YAxis,
} from 'recharts';
import { BaseWidget, type BaseWidgetProps } from './BaseWidget';
import { ChartBase } from '../../../charts/ChartBase';
import { RechartsPortalTooltip } from '../../../charts/RechartsPortalTooltip';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { t } from '../../../../lang/helpers';
import {
  prepareExcursionScatterData,
  type ExcursionScatterDataPoint,
  type ExcursionSide,
} from '../../utils/excursionScatterData';
import { EmptyState } from '../../../shared/EmptyState';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../../shared/display/CurrencyConversionInfo';
import { cssVars } from '../../../../styles/inlineStylePolicy';
import {
  calculateYAxisWidth,
  generateNiceAxis,
  getTradeNotePath,
} from '../../../../utils/chartUtils';
import { useTwoStageTouchNavigation } from '../../../charts/useTwoStageTouchNavigation';
import { handleRovingChartMarkKeyDown } from '../../../charts/chartKeyboardNavigation';

interface ExcursionMarkerShapeProps {
  cx?: number;
  cy?: number;
  fill?: string;
  name?: string;
  payload?: ExcursionScatterDataPoint;
  isInitialTabStop?: boolean;
  onKeyboardActivate?: (
    point: ExcursionScatterDataPoint,
    event: React.KeyboardEvent<SVGGElement>
  ) => void;
}

const ExcursionMarkerShape: React.FC<ExcursionMarkerShapeProps> = ({
  cx = 0,
  cy = 0,
  fill,
  name,
  payload,
  isInitialTabStop = false,
  onKeyboardActivate,
}) => {
  const isInteractive = Boolean(payload && onKeyboardActivate);
  return (
    <g
      cursor={isInteractive ? 'pointer' : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? (isInitialTabStop ? 0 : -1) : undefined}
      data-journalit-chart-mark={isInteractive ? 'true' : undefined}
      aria-label={
        isInteractive && payload
          ? `${t('widget.trade-review.open-trade-note')} ${payload.observationIndex}`
          : undefined
      }
      onKeyDown={
        payload && onKeyboardActivate
          ? (event) =>
              handleRovingChartMarkKeyDown(event, () =>
                onKeyboardActivate(payload, event)
              )
          : undefined
      }
    >
      <circle cx={cx} cy={cy} r={7} fill="transparent" />
      <Symbols
        cx={cx}
        cy={cy}
        name={name}
        size={Math.PI * 9}
        fill={fill}
        fillOpacity={0.75}
      />
    </g>
  );
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const getExcursionScatterPoint = (
  value: unknown
): ExcursionScatterDataPoint | null => {
  if (!isRecord(value)) return null;
  const candidate = isRecord(value.payload) ? value.payload : value;
  if (
    typeof candidate.observationId === 'string' &&
    typeof candidate.observationIndex === 'number' &&
    typeof candidate.path === 'string' &&
    typeof candidate.excursion === 'number' &&
    typeof candidate.realized === 'number' &&
    (candidate.outcome === 'win' ||
      candidate.outcome === 'loss' ||
      candidate.outcome === 'breakeven' ||
      candidate.outcome === 'unknown')
  ) {
    return {
      observationId: candidate.observationId,
      observationIndex: candidate.observationIndex,
      path: candidate.path,
      excursion: candidate.excursion,
      realized: candidate.realized,
      outcome: candidate.outcome,
    };
  }
  return null;
};

const EXCURSION_COPY = {
  mfe: {
    title: () => t('widget.mfeScatter.name'),
    axis: () => t('widget.trade-review.field.mfe'),
    empty: () => t('widget.mfeScatter.empty'),
  },
  mae: {
    title: () => t('widget.maeScatter.name'),
    axis: () => t('widget.trade-review.field.mae'),
    empty: () => t('widget.maeScatter.empty'),
  },
} satisfies Record<ExcursionSide, Record<string, () => string>>;

type ExcursionScatterProps = BaseWidgetProps & { excursion: ExcursionSide };


const ExcursionScatterComponent: React.FC<ExcursionScatterProps> = ({
  excursion,
  ...props
}) => {
  const copy = EXCURSION_COPY[excursion];
  const plugin = usePlugin();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const chartRef = React.useRef<HTMLDivElement>(null);
  const { handleClick, handleKeyDown, recordTouch } =
    useTwoStageTouchNavigation<string>();
  const unit = plugin?.settings.trade.maeMfeDisplayUnit ?? 'dollar';
  const currency = plugin?.settings.general?.currency ?? 'USD';
  const unitLabel = unit === 'ticks' ? t('common.ticks') : currency;
  const xLabel = `${copy.axis()} (${unitLabel})`;
  const yLabel = t('widget.excursionScatter.y', { unit: unitLabel });
  const format = (value: number) =>
    formatValue({
      kind: unit === 'ticks' ? 'metric' : 'money',
      value,
      currencyCode: currency,
      precision: 2,
    });
  const masked = shouldMask('pnl');

  return (
    <BaseWidget
      {...props}
      tradeSource="excursionTrades"
      skeletonType="scatter-chart"
    >
      {(data) => {
        const points = prepareExcursionScatterData(
          data.excursionTrades ?? [],
          excursion,
          unit,
          currency,
          plugin?.settings.trade
        );
        const extent = points.reduce(
          (range, point) => ({
            xMax: Math.max(range.xMax, point.excursion),
            yMin: Math.min(range.yMin, point.realized),
            yMax: Math.max(range.yMax, point.realized),
          }),
          { xMax: 0, yMin: 0, yMax: 0 }
        );
        
        const xAxis = generateNiceAxis(0, extent.xMax === 0 ? 1 : extent.xMax);
        const yAxis = generateNiceAxis(extent.yMin, extent.yMax);
        const handlePointClick = (
          pointLike: unknown,
          event: { stopPropagation(): void }
        ) => {
          const point = getExcursionScatterPoint(pointLike);
          if (!point || !plugin) return;
          handleClick(point.observationId, event, () => {
            void plugin.openFile(getTradeNotePath(point.path));
          });
        };
        const handlePointTouchStart = (pointLike: unknown) => {
          const point = getExcursionScatterPoint(pointLike);
          if (point) recordTouch(point.observationId);
        };
        const renderSeries = (
          name: string,
          outcome: ExcursionScatterDataPoint['outcome'],
          fill: string
        ) => (
          <Scatter
            key={outcome}
            name={name}
            data={points.filter((point) => point.outcome === outcome)}
            fill={fill}
            isAnimationActive={false}
            shape={(shapeProps: ExcursionMarkerShapeProps) => (
              <ExcursionMarkerShape
                {...shapeProps}
                isInitialTabStop={
                  shapeProps.payload?.observationId === points[0]?.observationId
                }
                onKeyboardActivate={(point, event) =>
                  handleKeyDown(event, () => {
                    if (plugin) {
                      void plugin.openFile(getTradeNotePath(point.path));
                    }
                  })
                }
              />
            )}
            onClick={(point, _index, event) => handlePointClick(point, event)}
            onTouchEnd={(point) => handlePointTouchStart(point)}
          />
        );
        return (
          <div className="journalit-dashboard-trades-chart journalit-dashboard-excursion-scatter">
            <div className="journalit-dashboard-trades-chart__header">
              <div className="journalit-dashboard-trades-chart__title">
                {copy.title()}
                {unit === 'dollar' && (
                  <CurrencyConversionInfo
                    metadata={buildCurrencyConversionMetadata({
                      ...data.metrics,
                      
                      
                      conversionBaseCurrency: currency,
                    })}
                  />
                )}
              </div>
            </div>
            <div className="journalit-dashboard-trades-chart__body">
              {masked ? (
                <EmptyState message={formatValue({ kind: 'pnl', value: 0 })} />
              ) : points.length === 0 ? (
                <EmptyState message={copy.empty()} />
              ) : (
                <ChartBase chartRef={chartRef} skeletonVariant="scatter">
                  <ScatterChart
                    margin={{ top: 0, right: 22, bottom: 25, left: 25 }}
                  >
                    <CartesianGrid
                      stroke="var(--background-modifier-border)"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      type="number"
                      dataKey="excursion"
                      name={xLabel}
                      domain={xAxis.domain}
                      ticks={xAxis.ticks}
                      tickFormatter={format}
                      label={{
                        value: xLabel,
                        position: 'bottom',
                        fill: 'var(--text-muted)',
                        fontSize: 10,
                        fontWeight: 400,
                      }}
                      tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="realized"
                      name={yLabel}
                      domain={yAxis.domain}
                      ticks={yAxis.ticks}
                      tickFormatter={format}
                      width={calculateYAxisWidth(yAxis.ticks, format)}
                      label={{
                        value: yLabel,
                        angle: -90,
                        position: 'insideLeft',
                        textAnchor: 'middle',
                        fill: 'var(--text-muted)',
                        fontSize: 10,
                        fontWeight: 400,
                      }}
                      tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    />
                    <ReferenceLine y={0} stroke="var(--text-muted)" />
                    <Legend
                      verticalAlign="top"
                      height={24}
                      content={({ payload }) => (
                        <div className="journalit-chart-widget__legend journalit-chart-widget__legend--top">
                          {payload?.map((entry) => (
                            <div
                              key={entry.value}
                              className="journalit-chart-widget__legend-item"
                            >
                              <div
                                className="journalit-chart-widget__legend-swatch journalit-chart-widget__legend-swatch--dot"
                                aria-hidden="true"
                                style={cssVars({
                                  '--legend-color': entry.color,
                                })}
                              />
                              <span>{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    <RechartsPortalTooltip
                      chartRef={chartRef}
                      cursor={{
                        stroke: 'var(--text-muted)',
                        strokeOpacity: 0.5,
                        strokeWidth: 1,
                        
                        
                        shapeRendering: 'crispEdges',
                      }}
                    >
                      {({ active, payload }) => {
                        if (!active || !payload) return null;
                        return (
                          <div className="journalit-chart-tooltip">
                            {payload.map((item) => {
                              if (
                                !item ||
                                typeof item !== 'object' ||
                                !('value' in item) ||
                                typeof item.value !== 'number' ||
                                !('name' in item) ||
                                typeof item.name !== 'string'
                              )
                                return null;
                              return (
                                <div key={item.name}>
                                  {item.name}: {format(item.value)}
                                </div>
                              );
                            })}
                          </div>
                        );
                      }}
                    </RechartsPortalTooltip>
                    {renderSeries(
                      t('widget.excursionScatter.winners'),
                      'win',
                      'var(--color-green)'
                    )}
                    {renderSeries(
                      t('widget.excursionScatter.losers'),
                      'loss',
                      'var(--color-red)'
                    )}
                    {renderSeries(
                      t('widget.excursionScatter.breakeven'),
                      'breakeven',
                      'var(--text-muted)'
                    )}
                    {points.some((p) => p.outcome === 'unknown') &&
                      renderSeries(
                        t('common.unknown'),
                        'unknown',
                        'var(--text-muted)'
                      )}
                  </ScatterChart>
                </ChartBase>
              )}
            </div>
          </div>
        );
      }}
    </BaseWidget>
  );
};


export const ExcursionScatter = React.memo(ExcursionScatterComponent);
