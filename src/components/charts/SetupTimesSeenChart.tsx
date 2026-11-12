
import React from 'react';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { t } from '../../lang/helpers';
import { ChartBase } from './ChartBase';
import { RechartsPortalTooltip } from './RechartsPortalTooltip';
import { useTwoStageTouchNavigation } from './useTwoStageTouchNavigation';
import { handleRovingChartMarkKeyDown } from './chartKeyboardNavigation';
import { useChartAnimationActive } from './chartAnimation';
import { SVG_LABEL_TOOLTIP_PROPS } from './svgLabelTooltip';
import {
  SETUP_NAME_AXIS_TICK_MARGIN,
  SetupNameAxisTick,
  setupNameAxisWidth,
} from './SetupNameAxisTick';

const SVG_TEXT_ANCHOR_START = 'start';

export interface SetupTimesSeenPoint {
  id: string;
  name: string;
  
  taken: number;
  
  missed: number;
  seen: number;
}

const TIMES_SEEN_TAKEN_FILL = 'var(--chart-neutral, var(--text-muted))';
const TIMES_SEEN_MISSED_FILL = 'var(--interactive-accent)';
const TIMES_SEEN_MISSED_OPACITY = 0.55;
const TIMES_SEEN_LABEL_CHAR_WIDTH = 6.5;

function timesSeenEndLabel(point: SetupTimesSeenPoint): string {
  const seen = t('setups.view.times-seen.seen-count', {
    count: String(point.seen),
  });
  return point.missed > 0
    ? `${seen} · ${t('setups.view.times-seen.missed-count', { count: String(point.missed) })}`
    : seen;
}

interface SetupTimesSeenBarShapeProps {
  index?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: SetupTimesSeenPoint;
}


const SetupTimesSeenBarShape: React.FC<
  SetupTimesSeenBarShapeProps & {
    isInteractive: boolean;
    onKeyboardActivate: (
      point: SetupTimesSeenPoint,
      event: React.KeyboardEvent<SVGGElement>
    ) => void;
  }
> = ({
  index,
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  isInteractive,
  onKeyboardActivate,
}) => {
  if (!payload) return null;
  const barWidth = Math.max(width, 0);
  const takenWidth =
    payload.seen > 0 ? (barWidth * payload.taken) / payload.seen : 0;
  const missedWidth = barWidth - takenWidth;
  return (
    <g
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? (index === 0 ? 0 : -1) : undefined}
      cursor={isInteractive ? 'pointer' : undefined}
      data-journalit-chart-mark={isInteractive ? 'true' : undefined}
      {...SVG_LABEL_TOOLTIP_PROPS}
      aria-label={
        isInteractive
          ? `${t('setups.view.card.open-named', { name: payload.name })}: ${timesSeenEndLabel(payload)}`
          : undefined
      }
      onKeyDown={
        isInteractive
          ? (event) =>
              handleRovingChartMarkKeyDown(event, () =>
                onKeyboardActivate(payload, event)
              )
          : undefined
      }
    >
      {takenWidth > 0 ? (
        <rect
          x={x}
          y={y}
          width={takenWidth}
          height={Math.max(height, 0)}
          fill={TIMES_SEEN_TAKEN_FILL}
          rx={2}
          ry={2}
        />
      ) : null}
      {missedWidth > 0 ? (
        <rect
          x={x + takenWidth}
          y={y}
          width={missedWidth}
          height={Math.max(height, 0)}
          fill={TIMES_SEEN_MISSED_FILL}
          fillOpacity={TIMES_SEEN_MISSED_OPACITY}
          rx={2}
          ry={2}
        />
      ) : null}
    </g>
  );
};

SetupTimesSeenBarShape.displayName = 'SetupTimesSeenBarShape';

interface SetupTimesSeenEndLabelProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  index?: number;
}


const TIMES_SEEN_COMPACT_WIDTH = 560;


export const SetupTimesSeenChart: React.FC<{
  data: SetupTimesSeenPoint[];
  height?: number;
  onPointClick?: (pointId: string) => void;
}> = ({ data, height, onPointClick }) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartHeight = height ?? Math.max(240, data.length * 30 + 48);
  return (
    <ChartBase height={chartHeight} width="100%" chartRef={chartRef}>
      <SetupTimesSeenBars
        chartRef={chartRef}
        data={data}
        onPointClick={onPointClick}
      />
    </ChartBase>
  );
};


const SetupTimesSeenBars: React.FC<{
  chartRef: React.RefObject<HTMLDivElement | null>;
  data: SetupTimesSeenPoint[];
  onPointClick?: (pointId: string) => void;
  width?: number;
  height?: number;
}> = ({ chartRef, data, onPointClick, width = 0, height = 0 }) => {
  const isAnimationActive = useChartAnimationActive();
  const touchResetKey = React.useMemo(
    () => data.map((point) => point.id).join('\u0000'),
    [data]
  );
  const { handleClick, handleKeyDown, recordTouch } =
    useTwoStageTouchNavigation<string>(touchResetKey);
  const canNavigate = Boolean(onPointClick);
  const isCompact = width < TIMES_SEEN_COMPACT_WIDTH;
  const labels = React.useMemo(
    () =>
      data.map((point) =>
        isCompact ? String(point.seen) : timesSeenEndLabel(point)
      ),
    [data, isCompact]
  );
  const labelWidth =
    Math.max(0, ...labels.map((label) => label.length)) *
      TIMES_SEEN_LABEL_CHAR_WIDTH +
    12;
  const maxSeen = Math.max(1, ...data.map((point) => point.seen));

  return (
    <BarChart
      width={width}
      height={height}
      data={data}
      layout="vertical"
      margin={{ top: 4, right: labelWidth, bottom: 0, left: 0 }}
      barCategoryGap={10}
    >
      <XAxis type="number" domain={[0, maxSeen]} hide />
      <YAxis
        type="category"
        dataKey="name"
        width={setupNameAxisWidth(width)}
        tickLine={false}
        axisLine={false}
        tick={<SetupNameAxisTick fill="var(--text-muted)" />}
        tickMargin={SETUP_NAME_AXIS_TICK_MARGIN}
      />
      <RechartsPortalTooltip
        chartRef={chartRef}
        placementMode="bar"
        cursor={{
          fill: 'var(--interactive-hover)',
          fillOpacity: 0.1,
          strokeOpacity: 0.3,
          strokeWidth: 1,
          stroke: 'var(--interactive-accent)',
        }}
      >
        {(props) => (
          <SetupTimesSeenTooltip
            active={props.active}
            payload={props.payload}
          />
        )}
      </RechartsPortalTooltip>
      <Bar
        dataKey="seen"
        barSize={16}
        minPointSize={0}
        isAnimationActive={isAnimationActive}
        animationDuration={700}
        animationEasing="ease-out"
        onClick={(point, _index, event) => {
          if (!canNavigate || !isSetupTimesSeenPoint(point)) return;
          handleClick(point.id, event, () => onPointClick?.(point.id));
        }}
        onTouchEnd={(point) => {
          if (canNavigate && isSetupTimesSeenPoint(point)) {
            recordTouch(point.id);
          }
        }}
        shape={(props: SetupTimesSeenBarShapeProps) => (
          <SetupTimesSeenBarShape
            {...props}
            isInteractive={canNavigate}
            onKeyboardActivate={(point, event) =>
              handleKeyDown(event, () => onPointClick?.(point.id))
            }
          />
        )}
      >
        <LabelList
          dataKey="seen"
          content={(props: SetupTimesSeenEndLabelProps) => {
            const label =
              props.index === undefined ? undefined : labels[props.index];
            if (!label) return null;
            return (
              <text
                x={Number(props.x ?? 0) + Number(props.width ?? 0) + 6}
                y={Number(props.y ?? 0) + Number(props.height ?? 0) / 2}
                dominantBaseline="middle"
                fill="var(--text-muted)"
                fontSize={11}
                textAnchor={SVG_TEXT_ANCHOR_START}
              >
                {label}
              </text>
            );
          }}
        />
      </Bar>
    </BarChart>
  );
};

SetupTimesSeenBars.displayName = 'SetupTimesSeenBars';

SetupTimesSeenChart.displayName = 'SetupTimesSeenChart';

const SetupTimesSeenTooltip: React.FC<{
  active?: boolean;
  payload?: unknown;
}> = ({ active, payload }) => {
  const { formatValue } = useDisplayFormatter();
  if (!active || !isUnknownArray(payload)) return null;
  const first = payload[0];
  const point = isRecord(first) ? first.payload : null;
  if (!isSetupTimesSeenPoint(point)) return null;

  return (
    <div className="journalit-chart-tooltip">
      <div className="journalit-chart-tooltip-date">{point.name}</div>
      <div className="journalit-chart-tooltip-value">
        {formatValue({ kind: 'count', value: point.seen, precision: 0 })}
      </div>
      <div className="journalit-chart-tooltip-info journalit-chart-tooltip-info--tight">
        {t('setups.view.metric.times-seen')}
      </div>
      <div className="journalit-chart-tooltip-info journalit-chart-tooltip-info--tight">
        {t('setups.view.times-seen.breakdown', {
          taken: formatValue({
            kind: 'count',
            value: point.taken,
            precision: 0,
          }),
          missed: formatValue({
            kind: 'count',
            value: point.missed,
            precision: 0,
          }),
        })}
      </div>
    </div>
  );
};

SetupTimesSeenTooltip.displayName = 'SetupTimesSeenTooltip';

function isSetupTimesSeenPoint(value: unknown): value is SetupTimesSeenPoint {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.taken === 'number' &&
    typeof value.missed === 'number' &&
    typeof value.seen === 'number'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
