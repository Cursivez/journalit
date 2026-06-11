


export function injectChartStyles(): void {
  return;
}


export function removeChartStyles(): void {
  return;
}


export function ensureChartStyles(): void {
  return;
}


const CHART_STYLES = `

.journalit-chart-container {
  
  --chart-positive: var(--text-success, #43a047) !important;
  --chart-negative: var(--text-error, #e53935) !important;
  --chart-neutral: var(--text-muted, #888888) !important;

  
  --chart-positive-bg: rgba(67, 160, 71, 0.2) !important;
  --chart-negative-bg: rgba(229, 57, 53, 0.2) !important;

  
  --chart-animation-duration: 0.8s;
  --chart-animation-function: cubic-bezier(0.19, 1, 0.22, 1);
}


.journalit-chart-container {
  width: var(--journalit-chart-width, 100%);
  height: var(--journalit-chart-height, 100%);
  min-height: var(--journalit-chart-min-height, auto);
  overflow: visible;
  border-radius: 8px;
  background-color: transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 4px;
}

.journalit-chart-loading-container {
  width: 100%;
  height: 100%;
  min-height: 100px;
  padding: 8px;
  box-sizing: border-box;
}

.journalit-chart-skeleton {
  position: relative;
  width: 100%;
  height: var(--journalit-chart-skeleton-height, 100%);
  min-height: 100px;
}

.journalit-chart-skeleton-axis {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 25px;
  width: 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.journalit-chart-skeleton-bars {
  margin-left: 40px;
  height: calc(100% - 25px);
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: var(--journalit-chart-skeleton-bar-gap, 4px);
}

.journalit-chart-skeleton-xline {
  position: absolute;
  bottom: 20px;
  left: 40px;
  right: 0;
  height: 1px;
  background: var(--background-modifier-border);
}

.journalit-chart-skeleton-xlabels {
  position: absolute;
  bottom: 0;
  left: 40px;
  right: 0;
  display: flex;
  justify-content: space-around;
}

.journalit-chart-skeleton-xlabels--between {
  justify-content: space-between;
}

.journalit-chart-skeleton-xlabels--wide {
  left: 45px;
}

.journalit-chart-skeleton-wave {
  margin-left: 40px;
  height: 100%;
  padding-bottom: 20px;
}

.journalit-chart-skeleton-wave--wide {
  margin-left: 45px;
}

.journalit-chart-skeleton-wave-fill {
  fill: var(--background-modifier-border);
  opacity: 0.3;
}

.journalit-chart-skeleton-wave-line {
  fill: none;
  stroke: var(--background-modifier-border);
  stroke-width: 2;
  opacity: 0.6;
}

.journalit-chart-empty-container {
  width: 100%;
  height: var(--journalit-chart-empty-height, 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}


.journalit-chart-widget {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.journalit-chart-widget__header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  position: relative;
  opacity: 0.8;
}

.journalit-chart-widget__title {
  font-weight: 500;
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 0.3px;
  text-align: center;
}

.journalit-chart-widget__selector {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
}

.journalit-chart-widget__select {
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background-color: var(--background-primary);
  color: var(--text-normal);
  cursor: pointer;
  outline: none;
}

.journalit-chart-widget__body {
  flex: 1;
  min-height: 0;
}

.journalit-dashboard-view .recharts-cartesian-grid-horizontal line:first-of-type {
  display: none;
}

.journalit-chart-widget__legend {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.journalit-chart-widget__legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-normal);
}

.journalit-chart-widget__legend-swatch {
  width: 12px;
  height: 2px;
  border-radius: 1px;
  background-color: var(--legend-color);
}


.journalit-chart-tooltip {
  background-color: var(--background-primary);
  border-radius: 10px;
  padding: 14px 18px;
  min-width: 140px;
  max-width: min(320px, calc(100vw - 48px));
  border: 1px solid var(--background-modifier-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-4px);
  position: relative;
  animation: tooltipFadeIn 0.2s var(--chart-animation-function);
  z-index: 1000;
  overflow-wrap: anywhere;
  white-space: normal;
}


.journalit-chart-tooltip-date {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-normal);
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid var(--background-modifier-border);
  padding-bottom: 6px;
}


.journalit-chart-tooltip-value {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}

.journalit-chart-tooltip-value.positive {
  color: var(--chart-positive);
}

.journalit-chart-tooltip-value.negative {
  color: var(--chart-negative);
}


.journalit-chart-tooltip-info {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 8px;
  text-align: center;
  font-style: italic;
  line-height: 1.45;
}

.journalit-chart-tooltip-info--positive {
  color: var(--chart-positive);
}

.journalit-chart-tooltip-info--negative {
  color: var(--chart-negative);
}

.journalit-chart-tooltip-info--tight {
  margin-top: 4px;
}

.journalit-chart-tooltip--compact {
  border-radius: 8px;
  padding: 12px;
  min-width: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.journalit-chart-tooltip-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.journalit-chart-tooltip-row {
  font-size: 13px;
  font-weight: 500;
}

.journalit-chart-tooltip-row--spaced {
  margin-bottom: 4px;
}

.journalit-chart-tooltip-row--positive {
  color: var(--chart-positive);
}

.journalit-chart-tooltip-row--negative {
  color: var(--chart-negative);
}

.journalit-chart-tooltip-row--neutral {
  color: var(--text-normal);
}


@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(-4px);
  }
}


.journalit-chart-container .recharts-cartesian-grid-horizontal line,
.journalit-chart-container .recharts-cartesian-grid-vertical line {
  stroke: var(--background-modifier-border);
  stroke-opacity: 0.4;
  stroke-dasharray: 3;
}

.journalit-chart-container .recharts-reference-line line {
  stroke: var(--text-normal);
  stroke-opacity: 0.4;
  stroke-dasharray: 3;
  stroke-width: 1.5;
}


.journalit-chart-container .recharts-reference-line.profit-target-line line {
  stroke: var(--chart-positive, var(--text-success, #00b300)) !important;
  stroke-opacity: 1 !important;
  stroke-dasharray: 5 5 !important;
  stroke-width: 2 !important;
}


.journalit-chart-container .recharts-reference-line.profit-target-line text {
  fill: var(--chart-positive, var(--text-success, #00b300)) !important;
}

.journalit-chart-container .recharts-reference-line.profit-target-line.profit-target-line--masked line {
  stroke: var(--text-muted) !important;
  stroke-opacity: 0.5 !important;
}


.journalit-chart-container .recharts-xAxis .recharts-cartesian-axis-line,
.journalit-chart-container .recharts-yAxis .recharts-cartesian-axis-line {
  stroke: var(--background-modifier-border);
  stroke-opacity: 0.5;
}

.journalit-chart-container .recharts-cartesian-axis-tick-value {
  font-size: 11px;
  font-weight: 500;
  fill: var(--text-muted);
}


.journalit-chart-container .recharts-active-dot circle,
.journalit-chart-container .recharts-active-dot {
  fill: var(--interactive-accent, #4299e1);
  filter: drop-shadow(0 0 3px rgba(66, 153, 225, 0.6));
}


.journalit-chart-container .recharts-tooltip-wrapper {
  pointer-events: none;
  z-index: 1000;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
  max-width: min(320px, calc(100vw - 48px));
}

.journalit-chart-tooltip-portal-root {
  --chart-positive: var(--text-success, #43a047);
  --chart-negative: var(--text-error, #e53935);
  --chart-neutral: var(--text-muted, #888888);
  position: fixed;
  inset: 0;
  z-index: var(--journalit-chart-tooltip-z-index, 999999);
  pointer-events: none;
}

.journalit-chart-tooltip-portal {
  position: fixed;
  left: var(--journalit-chart-tooltip-left, 0px);
  top: var(--journalit-chart-tooltip-top, 0px);
  z-index: var(--journalit-chart-tooltip-z-index, 999999);
  pointer-events: none;
  max-width: min(320px, calc(100vw - 48px));
  box-sizing: border-box;
}

.journalit-chart-tooltip-portal--measuring {
  visibility: hidden;
}

.journalit-chart-tooltip-portal .journalit-chart-tooltip {
  max-width: min(320px, calc(100vw - 48px));
  transform: none;
  pointer-events: none;
  box-sizing: border-box;
}

.journalit-chart-tooltip-portal .journalit-chart-tooltip-info {
  max-width: 100%;
  overflow-wrap: anywhere;
  white-space: normal;
  line-height: 1.45;
}


.journalit-chart-container .recharts-bar {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.journalit-chart-container .recharts-bar-rectangle {
  transition: filter 0.3s ease, transform 0.2s ease;
}

.journalit-chart-container .recharts-bar-rectangle:hover {
  filter: brightness(1.1) drop-shadow(0 0 3px rgba(0, 0, 0, 0.2));
  transform: translateY(-2px);
}


.journalit-chart-container .recharts-bar-rectangle path {
  border-radius: 2px 2px 0 0;
}


.journalit-chart-container .recharts-bar-rectangle[fill^="var(--chart-positive)"] path {
  fill: var(--chart-positive) !important;
}

.journalit-chart-container .recharts-bar-rectangle[fill^="var(--chart-negative)"] path {
  fill: var(--chart-negative) !important;
}


.journalit-chart-container .recharts-bar-rectangle.recharts-active {
  filter: brightness(1.2) drop-shadow(0 0 6px rgba(0, 0, 0, 0.3));
}


.journalit-chart-container .recharts-layer.recharts-bar-graphical {
  cursor: pointer;
}


@keyframes barFadeIn {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

.journalit-chart-container .recharts-bar-rectangle {
  
}


@keyframes calendarFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseBorder {
  0% {
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2), 0 4px 12px rgba(var(--interactive-accent-rgb), 0.25);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(var(--interactive-accent-rgb), 0.3), 0 4px 15px rgba(var(--interactive-accent-rgb), 0.35);
  }
  100% {
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2), 0 4px 12px rgba(var(--interactive-accent-rgb), 0.25);
  }
}


.journalit-dashboard-calendar-day.today {
  animation: pulseBorder 2s infinite ease-in-out;
  border: 2px solid var(--interactive-accent) !important;
  z-index: 2 !important;
}


.journalit-dashboard-calendar-day:hover,
.journalit-dashboard-calendar-weekly-pnl:hover {
  transform: scale(1.05) !important;
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, opacity 0.2s ease-out !important;
  opacity: 1 !important;
  z-index: 5 !important;
}
`;
