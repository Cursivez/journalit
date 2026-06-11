

const ACCOUNT_WEIGHT_BAR_STYLES = `



.account-weight-bar-container {
  width: 100%;
  margin: 0 0 var(--account-dashboard-space-xl, 24px) 0;
  padding: 0;
  box-sizing: border-box;
}


.account-weight-bar {
  display: flex;
  width: 100%;
  height: 12px;
  background-color: transparent;
  border-radius: 0;
  overflow: visible;
  margin-bottom: 12px;
  gap: 5px;
  padding: 0;
}


.account-weight-segment {
  height: 100%;
  width: auto;
  flex: var(--journalit-account-weight-segment-ratio, 0) 1 0;
  background-color: var(
    --journalit-account-weight-segment-color,
    var(--interactive-accent)
  );
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-width: 3px; 
  border-radius: 4px;
}


.account-weight-segment:hover {
  opacity: 0.8 !important;
  transform: scaleY(1.1) !important;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}


.account-weight-segment:focus {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
}


.account-weight-tooltip {
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 0;
  max-width: 280px;
  min-width: 220px;
  font-size: 14px;
  line-height: 1.4;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.account-weight-tooltip .weight-tooltip-content {
  padding: 12px 16px;
}

.account-weight-tooltip .tooltip-header {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--background-modifier-border);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-normal);
}

.account-weight-tooltip .tooltip-metrics {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.account-weight-tooltip .tooltip-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  line-height: 1.3;
}

.account-weight-tooltip .tooltip-metric .metric-label {
  color: var(--text-muted);
  font-weight: 500;
  flex-shrink: 0;
  margin-right: 12px;
}

.account-weight-tooltip .tooltip-metric .metric-value {
  color: var(--text-normal);
  font-weight: 600;
  text-align: right;
  flex: 1;
}

.account-weight-tooltip .tooltip-metric .metric-value.positive {
  color: var(--text-success);
}

.account-weight-tooltip .tooltip-metric .metric-value.negative {
  color: var(--text-error);
}


.account-weight-legend-container {
  width: 100%;
  margin-top: 0px;
  padding-top: 0px;
}

.account-weight-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 0;
  align-items: center;
  justify-content: flex-start;
}

.account-weight-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  line-height: 1.3;
  color: var(--text-normal);
  transition: opacity 0.2s ease;
  cursor: default;
  width: 100%;
  max-width: 200px; 
}

.account-weight-legend-item:hover {
  opacity: 0.8;
}

.account-weight-legend .legend-dot {
  width: var(--journalit-account-weight-legend-dot-size, 12px);
  height: var(--journalit-account-weight-legend-dot-size, 12px);
  background-color: var(
    --journalit-account-weight-legend-dot-color,
    var(--interactive-accent)
  );
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.account-weight-legend .account-weight-legend-item:hover .legend-dot {
  transform: scale(1.1);
}

.account-weight-legend .legend-text {
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
  min-width: 0; 
  flex: 1;
}

.account-weight-legend .legend-type-name {
  font-weight: 500;
  color: var(--text-normal);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.account-weight-legend .legend-percentage {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}




@media (max-width: 599px) {
  .account-weight-legend-item {
    font-size: 12px;
  }
  
  .account-weight-legend .legend-type-name {
    font-size: 12px;
  }
  
  .account-weight-legend .legend-percentage {
    font-size: 11px;
  }
  
  .account-weight-bar-container {
    padding: 0;
  }
  
  .account-weight-bar {
    height: 10px; 
  }
}


@media (max-width: 400px) {
  .account-weight-legend {
    gap: 6px 12px;
  }
  
  .account-weight-legend .legend-text {
    flex-direction: row;
    gap: 4px;
    align-items: center;
    width: 100%;
  }
}


.theme-dark .account-weight-tooltip {
  background-color: var(--background-primary);
  border-color: var(--background-modifier-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.theme-dark .account-weight-legend .legend-dot {
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}


.theme-light .account-weight-tooltip {
  background-color: rgba(255, 255, 255, 0.95);
  border-color: var(--background-modifier-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.theme-light .account-weight-legend .legend-dot {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}


.account-weight-bar .account-weight-segment {
  animation: segment-grow 0.6s ease-out;
  animation-fill-mode: both;
}

@keyframes segment-grow {
  from {
    clip-path: inset(0 100% 0 0 round 4px);
    opacity: 0;
  }
  to {
    clip-path: inset(0 0 0 0 round 4px);
    opacity: 1;
  }
}


.account-weight-segment:nth-child(1) { animation-delay: 0.1s; }
.account-weight-segment:nth-child(2) { animation-delay: 0.2s; }
.account-weight-segment:nth-child(3) { animation-delay: 0.3s; }
.account-weight-segment:nth-child(4) { animation-delay: 0.4s; }
.account-weight-segment:nth-child(5) { animation-delay: 0.5s; }
.account-weight-segment:nth-child(6) { animation-delay: 0.6s; }
.account-weight-segment:nth-child(7) { animation-delay: 0.7s; }
.account-weight-segment:nth-child(8) { animation-delay: 0.8s; }
.account-weight-segment:nth-child(9) { animation-delay: 0.9s; }
.account-weight-segment:nth-child(10) { animation-delay: 1.0s; }


@media (prefers-reduced-motion: reduce) {
  .account-weight-segment,
  .account-weight-legend .legend-dot {
    animation: none !important;
    transition: none !important;
  }
  
  .account-weight-segment:hover {
    transform: none !important;
  }
}


@media (prefers-contrast: high) {
  .account-weight-bar {
    border: 2px solid var(--text-normal);
  }
  
  .account-weight-segment {
    border-right: 2px solid var(--background-primary);
  }
  
  .account-weight-legend .legend-dot {
    border: 2px solid var(--text-normal);
  }
}


.account-weight-bar:focus-within .account-weight-segment:focus {
  outline: 3px solid var(--interactive-accent);
  outline-offset: 2px;
  z-index: 10;
}
`;


export function injectAccountWeightBarStyles(): void {
  return;
}


export function removeAccountWeightBarStyles(): void {
  return;
}


export function ensureAccountWeightBarStyles(): void {
  return;
}
