

import React from 'react';
import { cssVars } from '../../../styles/inlineStylePolicy';

export type PreviewTone = 'pos' | 'neg' | 'accent' | 'muted' | 'warn';

export const toneClass = (tone: PreviewTone): string =>
  `journalit-wpd-tone--${tone}`;


export const Mini: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`journalit-wpd-mini${className ? ` ${className}` : ''}`}>
    {children}
  </div>
);


export const Eyebrow: React.FC<{
  children: React.ReactNode;
  aside?: React.ReactNode;
}> = ({ children, aside }) => (
  <div className="journalit-wpd-eyebrow-row">
    <span className="journalit-wpd-eyebrow">{children}</span>
    {aside !== undefined && (
      <span className="journalit-wpd-eyebrow-aside">{aside}</span>
    )}
  </div>
);

export const Chevron: React.FC = () => (
  <span className="journalit-wpd-chevron" aria-hidden="true" />
);


export const SegmentedBar: React.FC<{
  segments: number;
  filled: number;
  tone: PreviewTone;
}> = ({ segments, filled, tone }) => (
  <div className="journalit-wpd-segments">
    {Array.from({ length: segments }, (_, index) => (
      <span
        key={index}
        className={`journalit-wpd-segment${index < filled ? ` journalit-wpd-segment--on ${toneClass(tone)}` : ''}`}
      />
    ))}
  </div>
);

export const ProgressBar: React.FC<{ pct: number; tone: PreviewTone }> = ({
  pct,
  tone,
}) => (
  <div className="journalit-wpd-progress">
    <span
      className={`journalit-wpd-progress-fill ${toneClass(tone)}`}
      style={cssVars({ '--journalit-wpd-fill': `${pct}%` })}
    />
  </div>
);





const PLOT_W = 100;
const PLOT_H = 60;

type Point = [number, number];

const fmt = (value: number): string => value.toFixed(2);


function smoothPath(points: Point[]): string {
  let path = `M${fmt(points[0][0])},${fmt(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const low = Math.min(p1[1], p2[1]);
    const high = Math.max(p1[1], p2[1]);
    const clampY = (y: number) => Math.min(high, Math.max(low, y));
    path +=
      ` C${fmt(p1[0] + (p2[0] - p0[0]) / 6)},${fmt(clampY(p1[1] + (p2[1] - p0[1]) / 6))}` +
      ` ${fmt(p2[0] - (p3[0] - p1[0]) / 6)},${fmt(clampY(p2[1] - (p3[1] - p1[1]) / 6))}` +
      ` ${fmt(p2[0])},${fmt(p2[1])}`;
  }
  return path;
}

const yFor = (value: number, min: number, max: number): number =>
  PLOT_H - ((value - min) / (max - min || 1)) * PLOT_H;


export const ChartFrame: React.FC<{
  title: string;
  control?: string;
  legend?: Array<{ label: string; tone: PreviewTone }>;
  yLabels?: string[];
  xLabels?: string[];
  children: React.ReactNode;
}> = ({ title, control, legend, yLabels = [], xLabels = [], children }) => (
  <Mini className="journalit-wpd-chartframe">
    <div className="journalit-wpd-chart-head">
      <span className="journalit-wpd-chart-title">{title}</span>
      {control && (
        <span className="journalit-wpd-chart-control">{control}</span>
      )}
    </div>
    {legend && (
      <div className="journalit-wpd-chart-legend">
        {legend.map((item) => (
          <span key={item.label} className="journalit-wpd-chart-legend-item">
            <span
              className={`journalit-wpd-chart-legend-dot ${toneClass(item.tone)}`}
            />
            {item.label}
          </span>
        ))}
      </div>
    )}
    <div
      className={`journalit-wpd-chart-body${yLabels.length ? '' : ' journalit-wpd-chart-body--no-y'}`}
    >
      {yLabels.length > 0 && (
        <div className="journalit-wpd-chart-y">
          {yLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
      <div className="journalit-wpd-chart-plot">
        <svg
          viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {(yLabels.length ? yLabels : ['', '', '', '']).map(
            (_, index, all) => {
              const y = (index / Math.max(1, all.length - 1)) * PLOT_H;
              return (
                <line
                  key={index}
                  className="journalit-wpd-gridline"
                  x1="0"
                  x2={PLOT_W}
                  y1={y}
                  y2={y}
                  vectorEffect="non-scaling-stroke"
                />
              );
            }
          )}
          {children}
        </svg>
      </div>
      {xLabels.length > 0 && (
        <div className="journalit-wpd-chart-x">
          {xLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
    </div>
  </Mini>
);


export const PlotLine: React.FC<{
  values: number[];
  min: number;
  max: number;
  tone: PreviewTone;
  area?: boolean;
  baselineAt?: number;
}> = ({ values, min, max, tone, area = false, baselineAt }) => {
  const step = PLOT_W / (values.length - 1);
  const points: Point[] = values.map((value, index) => [
    index * step,
    yFor(value, min, max),
  ]);
  const line = smoothPath(points);
  const baseY = yFor(baselineAt ?? min, min, max);
  return (
    <g className={toneClass(tone)}>
      {baselineAt !== undefined && (
        <line
          className="journalit-wpd-baseline journalit-wpd-baseline--dashed"
          x1="0"
          x2={PLOT_W}
          y1={baseY}
          y2={baseY}
          vectorEffect="non-scaling-stroke"
        />
      )}
      {area && (
        <path
          className="journalit-wpd-area"
          d={`${line} L${PLOT_W},${fmt(baseY)} L0,${fmt(baseY)} Z`}
        />
      )}
      <path
        className="journalit-wpd-line"
        d={line}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
};


export const PlotBars: React.FC<{
  values: number[];
  min: number;
  max: number;
  tone?: PreviewTone;
  gap?: number;
}> = ({ values, min, max, tone, gap = 0.3 }) => {
  const slot = PLOT_W / values.length;
  const zeroY = yFor(Math.max(min, 0), min, max);
  
  const barPaths = new Map<PreviewTone, string>();
  values.forEach((value, index) => {
    if (value === 0) return;
    const y = yFor(value, min, max);
    const top = Math.min(y, zeroY);
    const height = Math.max(0.6, Math.abs(zeroY - y));
    const barTone = tone ?? (value >= 0 ? 'pos' : 'neg');
    const x = index * slot + (slot * gap) / 2;
    barPaths.set(
      barTone,
      `${barPaths.get(barTone) ?? ''}M${fmt(x)},${fmt(top)}h${fmt(slot * (1 - gap))}v${fmt(height)}h${fmt(-slot * (1 - gap))}Z`
    );
  });
  return (
    <g>
      {min < 0 && (
        <line
          className="journalit-wpd-baseline journalit-wpd-baseline--dashed"
          x1="0"
          x2={PLOT_W}
          y1={zeroY}
          y2={zeroY}
          vectorEffect="non-scaling-stroke"
        />
      )}
      {[...barPaths].map(([barTone, d]) => (
        <path
          key={barTone}
          className={`journalit-wpd-bar ${toneClass(barTone)}`}
          d={d}
        />
      ))}
    </g>
  );
};

export const PlotScatter: React.FC<{
  points: Array<[number, number, PreviewTone]>;
  zeroY: number;
}> = ({ points, zeroY }) => (
  <g>
    <line
      className="journalit-wpd-baseline journalit-wpd-baseline--dashed"
      x1="0"
      x2={PLOT_W}
      y1={zeroY}
      y2={zeroY}
      vectorEffect="non-scaling-stroke"
    />
    {points.map(([x, y, tone], index) => (
      <ellipse
        key={index}
        className={`journalit-wpd-dot ${toneClass(tone)}`}
        cx={x}
        cy={y}
        rx="0.9"
        ry="1.5"
      />
    ))}
  </g>
);


export const HBarChart: React.FC<{
  title: string;
  control?: string;
  
  rows: Array<{ category: string; value: number }>;
  xLabels: string[];
}> = ({ title, control, rows, xLabels }) => {
  const max = Math.max(...rows.map((row) => Math.abs(row.value)));
  return (
    <Mini className="journalit-wpd-chartframe">
      <div className="journalit-wpd-chart-head">
        <span className="journalit-wpd-chart-title">{title}</span>
        {control && (
          <span className="journalit-wpd-chart-control">{control}</span>
        )}
      </div>
      <div className="journalit-wpd-hbars">
        {rows.map((row) => (
          <div key={row.category} className="journalit-wpd-hbar-row">
            <span className="journalit-wpd-hbar-label">{row.category}</span>
            <span className="journalit-wpd-hbar-track">
              <span
                className={`journalit-wpd-hbar-fill ${toneClass(row.value >= 0 ? 'pos' : 'neg')}`}
                style={cssVars({
                  '--journalit-wpd-fill': `${Math.round((Math.abs(row.value) / max) * 100)}%`,
                })}
              />
            </span>
          </div>
        ))}
        <div className="journalit-wpd-hbar-row journalit-wpd-hbar-row--axis">
          <span className="journalit-wpd-hbar-label" />
          <span className="journalit-wpd-chart-x">
            {xLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </span>
        </div>
      </div>
    </Mini>
  );
};


export const Radar: React.FC<{ values: number[] }> = ({ values }) => {
  const center = 50;
  const radius = 44;
  const pointAt = (index: number, ratio: number): Point => {
    const angle = (Math.PI * 2 * index) / values.length - Math.PI / 2;
    return [
      center + Math.cos(angle) * radius * ratio,
      center + Math.sin(angle) * radius * ratio,
    ];
  };
  const ring = (ratio: number): string =>
    values
      .map((_, index) => pointAt(index, ratio).map(fmt).join(','))
      .join(' ');
  return (
    <svg
      className="journalit-wpd-radar journalit-wpd-tone--pos"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      {[1, 0.75, 0.5, 0.25].map((ratio) => (
        <polygon
          key={ratio}
          className="journalit-wpd-radar-ring"
          points={ring(ratio)}
        />
      ))}
      {values.map((_, index) => {
        const [x, y] = pointAt(index, 1);
        return (
          <line
            key={index}
            className="journalit-wpd-radar-ring"
            x1={center}
            y1={center}
            x2={x}
            y2={y}
          />
        );
      })}
      <polygon
        className="journalit-wpd-radar-shape"
        points={values
          .map((value, index) => pointAt(index, value).map(fmt).join(','))
          .join(' ')}
      />
    </svg>
  );
};

const gaugeArc = (to: number): string => {
  const angle = Math.PI * (1 - to);
  return `M10,50 A40,40 0 0 1 ${fmt(50 + Math.cos(angle) * 40)},${fmt(50 - Math.sin(angle) * 40)}`;
};


export const Gauge: React.FC<{ ratio: number; tone: PreviewTone }> = ({
  ratio,
  tone,
}) => {
  return (
    <svg
      className="journalit-wpd-gauge"
      viewBox="0 0 100 56"
      aria-hidden="true"
    >
      <path className="journalit-wpd-gauge-track" d={gaugeArc(1)} />
      <path
        className={`journalit-wpd-gauge-fill ${toneClass(tone)}`}
        d={gaugeArc(ratio)}
      />
      <line
        className="journalit-wpd-gauge-tick"
        x1="50"
        y1="4"
        x2="50"
        y2="14"
      />
    </svg>
  );
};
