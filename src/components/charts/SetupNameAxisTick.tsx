import React, { useMemo } from 'react';

const MAX_NAME_LINES = 2;
const ELLIPSIS = '…';


const DEFAULT_TICK_SIZE = 6;

export const SETUP_NAME_AXIS_TICK_MARGIN = 8;

const COMPACT_CHART_WIDTH = 560;
const NAME_AXIS_WIDTH = 160;
const COMPACT_NAME_AXIS_WIDTH = 110;


export function setupNameAxisWidth(chartWidth: number): number {
  return chartWidth < COMPACT_CHART_WIDTH
    ? COMPACT_NAME_AXIS_WIDTH
    : NAME_AXIS_WIDTH;
}

const HALF_CAP_HEIGHT_EM = 0.355;

type MeasureText = (text: string) => number;

interface SetupNameAxisTickProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  tickSize?: number;
  textAnchor?: 'start' | 'middle' | 'end' | 'inherit';
  fill?: string;
  className?: string;
  payload?: { value?: unknown };
}


export const SetupNameAxisTick: React.FC<SetupNameAxisTickProps> = ({
  x,
  y,
  width,
  tickSize = DEFAULT_TICK_SIZE,
  textAnchor,
  fill,
  className,
  payload,
}) => {
  const name = typeof payload?.value === 'string' ? payload.value : '';
  const availableWidth = Number(width) - tickSize - SETUP_NAME_AXIS_TICK_MARGIN;
  const lines = useMemo(
    () => wrapAxisLabel(name, availableWidth, MAX_NAME_LINES, measureTickText),
    [name, availableWidth]
  );
  const firstLineDy = -(lines.length - 1) / 2 + HALF_CAP_HEIGHT_EM;

  return (
    <g>
      <title>{name}</title>
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill={fill}
        className={className}
      >
        {lines.map((line, index) => (
          <tspan
            
            key={index}
            x={x}
            dy={index === 0 ? `${firstLineDy}em` : '1em'}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

SetupNameAxisTick.displayName = 'SetupNameAxisTick';


function wrapAxisLabel(
  text: string,
  maxWidth: number,
  maxLines: number,
  measure: MeasureText
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!Number.isFinite(maxWidth) || maxWidth <= 0 || words.length === 0) {
    return [text];
  }

  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (measure(candidate) <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    while (current.length > 1 && measure(current) > maxWidth) {
      const fit = longestFittingPrefix(current, maxWidth, measure, '');
      lines.push(current.slice(0, fit));
      current = current.slice(fit);
    }
  }
  lines.push(current);

  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines - 1);
  const rest = lines[maxLines - 1];
  const fit = longestFittingPrefix(rest, maxWidth, measure, ELLIPSIS);
  return [...kept, `${rest.slice(0, fit).trimEnd()}${ELLIPSIS}`];
}


function longestFittingPrefix(
  text: string,
  maxWidth: number,
  measure: MeasureText,
  suffix: string
): number {
  let low = 1;
  let high = text.length;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (measure(`${text.slice(0, middle)}${suffix}`) <= maxWidth) {
      low = middle;
    } else {
      high = middle - 1;
    }
  }
  return low;
}



const TICK_FONT_SIZE = 11;
const TICK_FONT_WEIGHT = 500;

let measuringContext: CanvasRenderingContext2D | null | undefined;
let tickFont: string | undefined;


function measureTickText(value: string): number {
  measuringContext ??= createEl('canvas').getContext('2d');
  if (!measuringContext) {
    
    return value.length * TICK_FONT_SIZE * 0.55;
  }
  tickFont ??= `${TICK_FONT_WEIGHT} ${TICK_FONT_SIZE}px ${getComputedStyle(activeDocument.body).fontFamily}`;
  measuringContext.font = tickFont;
  return measuringContext.measureText(value).width;
}
