
export const WIDGET_PREVIEW_DRAWER_STYLES = `
  .journalit-wpd-overlay {
    position: fixed;
    inset: 0;
    z-index: var(--layer-modal);
    display: flex;
    justify-content: flex-end;
    background-color: rgba(0, 0, 0, 0.28);
    animation: journalit-wpd-fade-in 160ms ease-out;
  }

  .journalit-wpd-panel {
    box-sizing: border-box;
    width: min(640px, calc(100vw - 48px));
    height: 100%;
  }

  .journalit-wpd-panel-inner {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--background-primary);
    border-left: 1px solid var(--background-modifier-border);
    box-shadow: -16px 0 48px rgba(0, 0, 0, 0.22);
    animation: journalit-wpd-slide-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  @keyframes journalit-wpd-slide-in {
    from { transform: translateX(32px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes journalit-wpd-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .journalit-wpd-overlay,
    .journalit-wpd-panel-inner {
      animation: none;
    }
  }

  @media (max-width: 600px) {
    .journalit-wpd-panel {
      width: 100vw;
    }

    .journalit-wpd-panel-inner {
      border-left: none;
    }

    
    .journalit-wpd-panel .journalit-wpd-tabs-row {
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
      
      scroll-padding-inline: 48px;
    }

    .journalit-wpd-panel .journalit-wpd-tab-button {
      flex: 0 0 auto;
      white-space: nowrap;
    }
  }

  .journalit-wpd-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 20px 12px;
  }

  
  @media (max-height: 500px) {
    .journalit-wpd-header {
      padding: 12px 20px 8px;
    }

    .journalit-wpd-panel .journalit-wpd-subtitle {
      display: none;
    }
  }

  .journalit-wpd-heading {
    min-width: 0;
  }

  .journalit-wpd-panel .journalit-wpd-title {
    margin: 0 0 4px;
    font-size: var(--font-ui-large);
    font-weight: 600;
    line-height: 1.3;
    color: var(--text-normal);
  }

  .journalit-wpd-panel .journalit-wpd-subtitle {
    margin: 0;
    font-size: var(--font-ui-small);
    line-height: 1.45;
    color: var(--text-muted);
  }

  .journalit-wpd-panel .journalit-wpd-close {
    flex: 0 0 auto;
    color: var(--text-muted);
  }

  
  .journalit-wpd-header,
  .journalit-wpd-tabs,
  .journalit-wpd-search {
    flex-shrink: 0;
  }

  .journalit-wpd-tabs-row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 0 20px 12px;
  }

  .journalit-wpd-tabs {
    position: relative;
  }

  .journalit-wpd-panel .journalit-wpd-tabs-arrow {
    position: absolute;
    top: 0;
    bottom: 12px;
    display: flex;
    align-items: center;
    width: 48px;
    height: auto;
    padding: 0 12px;
    border: none;
    border-radius: 0;
    box-shadow: none;
    color: var(--text-normal);
    cursor: var(--cursor);
  }

  .journalit-wpd-panel .journalit-wpd-tabs-arrow:hover {
    color: var(--text-accent);
  }

  .journalit-wpd-panel .journalit-wpd-tabs-arrow.is-left {
    left: 0;
    justify-content: flex-start;
    background: linear-gradient(
      to right,
      var(--background-primary) 55%,
      transparent
    );
  }

  .journalit-wpd-panel .journalit-wpd-tabs-arrow.is-right {
    right: 0;
    justify-content: flex-end;
    background: linear-gradient(
      to left,
      var(--background-primary) 55%,
      transparent
    );
  }

  .journalit-wpd-panel .journalit-wpd-tab-button {
    height: auto;
    padding: 5px 10px;
    border: none;
    border-radius: var(--radius-s);
    background: transparent;
    box-shadow: none;
    font-size: var(--font-ui-small);
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
  }

  .journalit-wpd-panel .journalit-wpd-tab-button:hover {
    background-color: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .journalit-wpd-panel .journalit-wpd-tab-button.is-active {
    background-color: var(--background-modifier-active-hover);
    color: var(--text-normal);
  }

  .journalit-wpd-search {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 20px 8px;
    padding: 0 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m);
    background-color: var(--background-secondary);
    color: var(--text-faint);
    cursor: text;
    transition: background-color 120ms ease;
  }

  
  .journalit-wpd-search:hover,
  .journalit-wpd-search:focus-within {
    background-color: var(--background-modifier-form-field);
  }

  .journalit-wpd-search:focus-within {
    border-color: var(--interactive-accent);
  }

  
  .journalit-wpd-panel .journalit-wpd-search .journalit-wpd-search-input,
  .journalit-wpd-panel .journalit-wpd-search .journalit-wpd-search-input:hover,
  .journalit-wpd-panel .journalit-wpd-search .journalit-wpd-search-input:focus,
  .journalit-wpd-panel .journalit-wpd-search .journalit-wpd-search-input:active {
    flex: 1;
    min-width: 0;
    height: 34px;
    padding: 0;
    border: none;
    background-color: transparent;
    box-shadow: none;
    font-size: var(--font-ui-small);
    color: var(--text-normal);
  }

  
  .journalit-wpd-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 4px 20px 24px;
    background-color: var(--background-primary);
  }

  .journalit-wpd-section {
    margin-top: 14px;
  }

  .journalit-wpd-panel .journalit-wpd-section-title {
    margin: 0 0 10px;
    font-size: var(--font-ui-smaller);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  
  .journalit-wpd-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(calc(var(--font-ui-smaller) * 14), 1fr)
    );
    gap: 18px 14px;
  }

  

  .journalit-wpd-panel .journalit-wpd-card {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 4px;
    height: auto;
    min-width: 0;
    padding: 0;
    border: none;
    border-radius: var(--radius-m);
    background: transparent;
    box-shadow: none;
    text-align: left;
    font-weight: normal;
    white-space: normal;
    color: var(--text-normal);
    cursor: pointer;
  }

  .journalit-wpd-panel .journalit-wpd-card--in-use {
    cursor: default;
  }

  .journalit-wpd-panel .journalit-wpd-card:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .journalit-wpd-preview {
    position: relative;
    box-sizing: border-box;
    aspect-ratio: 16 / 10;
    margin-bottom: 4px;
    overflow: hidden;
    border-radius: var(--radius-m);
    background-color: var(--background-secondary);
    container-type: inline-size;
    transition: background-color 120ms ease;
  }

  .journalit-wpd-preview--compact {
    aspect-ratio: 16 / 8;
  }

  .journalit-wpd-panel .journalit-wpd-card:hover .journalit-wpd-preview {
    background-color: var(--background-secondary-alt);
  }

  .journalit-wpd-panel .journalit-wpd-card:focus-visible .journalit-wpd-preview {
    outline: 2px solid var(--interactive-accent);
    outline-offset: 2px;
  }

  .journalit-wpd-panel .journalit-wpd-card--in-use:hover .journalit-wpd-preview {
    background-color: var(--background-secondary);
  }

  .journalit-wpd-card--in-use .journalit-wpd-preview {
    opacity: 0.55;
  }

  
  .journalit-wpd-preview-wrap {
    position: relative;
  }

  .journalit-wpd-panel .journalit-wpd-remove {
    position: absolute;
    z-index: 1;
    top: calc(50% - 2px);
    left: 50%;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: auto;
    padding: 6px 14px;
    border: none;
    border-radius: var(--radius-m);
    background-color: var(--interactive-accent);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
    font-size: var(--font-ui-small);
    font-weight: 600;
    color: var(--text-on-accent);
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: opacity 120ms ease;
    cursor: pointer;
  }

  .journalit-wpd-panel .journalit-wpd-remove:hover {
    background-color: var(--interactive-accent-hover);
    color: var(--text-on-accent);
  }

  .journalit-wpd-panel .journalit-wpd-card--in-use:hover .journalit-wpd-remove,
  .journalit-wpd-panel .journalit-wpd-remove:focus-visible {
    opacity: 1;
    pointer-events: auto;
  }

  .journalit-wpd-panel .journalit-wpd-remove:focus-visible {
    outline: 2px solid var(--text-on-accent);
    outline-offset: 2px;
  }

  
  .journalit-wpd-card--in-use:hover .journalit-wpd-preview,
  .journalit-wpd-remove:focus-visible + .journalit-wpd-preview {
    opacity: 0.35;
  }

  @media (hover: none) {
    .journalit-wpd-panel .journalit-wpd-remove {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .journalit-wpd-card-meta {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    min-width: 0;
  }

  
  .journalit-wpd-card-name {
    flex: 1 1 auto;
    min-width: 0;
    overflow-wrap: anywhere;
    font-size: var(--font-ui-small);
    font-weight: 600;
    line-height: 1.35;
  }

  .journalit-wpd-panel .journalit-wpd-card:hover .journalit-wpd-card-name {
    color: var(--text-accent);
  }

  .journalit-wpd-panel .journalit-wpd-card--in-use:hover .journalit-wpd-card-name {
    color: var(--text-normal);
  }

  .journalit-wpd-card-badge {
    position: absolute;
    right: 6px;
    bottom: 6px;
    padding: 0 5px;
    border-radius: var(--radius-s);
    background-color: var(--background-primary);
    font-size: 10px;
    line-height: 16px;
    color: var(--text-muted);
  }

  .journalit-wpd-card-action {
    display: inline-flex;
    flex: 0 0 auto;
    margin-top: 2px;
    color: var(--text-faint);
  }

  .journalit-wpd-panel .journalit-wpd-card:hover .journalit-wpd-card-action,
  .journalit-wpd-panel .journalit-wpd-card:focus-visible .journalit-wpd-card-action {
    color: var(--text-accent);
  }

  .journalit-wpd-card--in-use .journalit-wpd-card-action,
  .journalit-wpd-panel .journalit-wpd-card--in-use:hover .journalit-wpd-card-action {
    color: var(--color-green);
  }

  .journalit-wpd-card-description {
    font-size: var(--font-ui-smaller);
    line-height: 1.4;
    color: var(--text-muted);
  }

  .journalit-wpd-card-detail {
    overflow-wrap: anywhere;
    font-size: var(--font-ui-smaller);
    font-weight: 500;
    color: var(--text-normal);
  }

  

  .journalit-wpd-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .journalit-wpd-panel .journalit-wpd-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: auto;
    padding: 6px 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m);
    background-color: var(--background-secondary);
    box-shadow: none;
    font-size: var(--font-ui-small);
    font-weight: 500;
    color: var(--text-normal);
    cursor: pointer;
  }

  .journalit-wpd-panel .journalit-wpd-pill .journalit-obsidian-icon {
    display: inline-flex;
    color: var(--text-muted);
  }

  .journalit-wpd-panel .journalit-wpd-pill:hover,
  .journalit-wpd-panel .journalit-wpd-pill:focus-visible {
    border-color: var(--interactive-accent);
    background-color: var(--background-modifier-hover);
  }

  .journalit-wpd-panel .journalit-wpd-pill--add {
    border-style: dashed;
    background-color: transparent;
    color: var(--text-muted);
  }

  .journalit-wpd-empty {
    padding: 40px 0;
    text-align: center;
    font-size: var(--font-ui-small);
    color: var(--text-muted);
  }

  

  .journalit-wpd-tone--pos { color: var(--color-green); }
  .journalit-wpd-tone--neg { color: var(--color-red); }
  .journalit-wpd-tone--accent { color: var(--text-accent); }
  .journalit-wpd-tone--muted { color: var(--text-muted); }
  .journalit-wpd-tone--warn { color: var(--color-orange); }

  .journalit-wpd-mini {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 0.6em;
    height: 100%;
    padding: 1.1em 1.3em;
    overflow: hidden;
    font-size: 3.75cqw;
    line-height: 1.3;
    color: var(--text-normal);
  }

  .journalit-wpd-mini .journalit-obsidian-icon {
    display: inline-flex;
    flex: 0 0 auto;
  }

  .journalit-wpd-mini--centered {
    align-items: center;
    justify-content: center;
    gap: 0.35em;
  }

  
  .journalit-wpd-mini--large {
    font-size: 5.2cqw;
  }

  .journalit-wpd-eyebrow-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    flex: 0 0 auto;
    color: var(--text-faint);
  }

  .journalit-wpd-eyebrow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.8em;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .journalit-wpd-eyebrow-aside {
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
    font-size: 0.8em;
  }

  .journalit-wpd-chevron {
    display: inline-block;
    width: 0.4em;
    height: 0.4em;
    margin: 0 0.2em;
    border-top: 1px solid var(--text-faint);
    border-right: 1px solid var(--text-faint);
    transform: rotate(45deg);
  }

  .journalit-wpd-title-text { font-size: 1.05em; font-weight: 700; }
  .journalit-wpd-text { font-size: 1em; }
  .journalit-wpd-text--lg { font-size: 1.15em; }
  .journalit-wpd-strong { font-weight: 600; }
  .journalit-wpd-muted { color: var(--text-muted); }
  .journalit-wpd-faint { font-size: 0.85em; color: var(--text-faint); }
  .journalit-wpd-align-end { align-items: flex-end; }
  .journalit-wpd-grow { flex: 1 1 auto; min-width: 0; }

  .journalit-wpd-ellipsis {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-wpd-hero {
    font-size: 2.6em;
    font-weight: 700;
    line-height: 1.05;
    font-variant-numeric: tabular-nums;
  }

  .journalit-wpd-hero--sm {
    font-size: 1.8em;
  }

  .journalit-wpd-center {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3em;
    min-height: 0;
    text-align: center;
  }

  .journalit-wpd-center--wide {
    align-items: stretch;
  }

  .journalit-wpd-row-split {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
  }

  .journalit-wpd-row-split--end {
    align-items: flex-end;
  }

  .journalit-wpd-stack-col {
    display: flex;
    flex-direction: column;
    gap: 0.15em;
  }

  .journalit-wpd-inline {
    display: inline-flex;
    align-items: center;
    gap: 0.45em;
  }

  .journalit-wpd-icon-pair {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
  }

  .journalit-wpd-dot-marker {
    flex: 0 0 auto;
    width: 0.55em;
    height: 0.55em;
    border-radius: 50%;
    background-color: currentColor;
  }

  .journalit-wpd-list {
    display: flex;
    flex-direction: column;
    gap: 0.55em;
    min-height: 0;
  }

  .journalit-wpd-list-row {
    display: flex;
    align-items: center;
    gap: 0.6em;
  }

  .journalit-wpd-list-body {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .journalit-wpd-check-item {
    display: flex;
    align-items: flex-start;
    gap: 0.6em;
    padding: 0.55em 0.7em;
    border: 1px solid var(--background-modifier-border);
    border-radius: 0.5em;
    background-color: var(--background-primary);
  }

  .journalit-wpd-event-row,
  .journalit-wpd-alert-row {
    display: flex;
    align-items: center;
    gap: 0.55em;
  }

  .journalit-wpd-alert-row {
    padding-bottom: 0.45em;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-wpd-rail {
    flex: 0 0 auto;
    width: 0.22em;
    height: 1.25em;
    border-radius: 0.11em;
    background-color: currentColor;
  }

  

  .journalit-wpd-progress {
    position: relative;
    height: 0.5em;
    overflow: hidden;
    border-radius: 0.25em;
    background-color: var(--background-modifier-border);
  }

  .journalit-wpd-progress-fill {
    position: absolute;
    inset: 0 auto 0 0;
    width: var(--journalit-wpd-fill, 0%);
    border-radius: 0.25em;
    background-color: currentColor;
  }

  .journalit-wpd-segments {
    display: flex;
    gap: 0.22em;
  }

  .journalit-wpd-segment {
    flex: 1 1 0;
    height: 0.5em;
    border-radius: 0.1em;
    background-color: var(--background-modifier-border);
  }

  .journalit-wpd-segment--on {
    background-color: currentColor;
  }

  .journalit-wpd-limit-rows {
    display: flex;
    flex-direction: column;
    gap: 0.9em;
  }

  .journalit-wpd-limit-row {
    display: flex;
    flex-direction: column;
    gap: 0.35em;
  }

  .journalit-wpd-rank-rows {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: center;
    gap: 0.75em;
  }

  .journalit-wpd-rank-row {
    display: grid;
    grid-template-columns: 6.5em 1fr auto;
    align-items: center;
    gap: 0.6em;
  }

  .journalit-wpd-weekbars {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: 4em;
    flex: 0 0 auto;
  }

  .journalit-wpd-weekbar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 0.3em;
    height: 100%;
  }

  .journalit-wpd-weekbar-fill {
    width: 1.8em;
    height: calc(var(--journalit-wpd-fill, 0%) * 0.7);
    min-height: 0.45em;
    border-radius: 0.2em;
    background-color: currentColor;
  }

  

  .journalit-wpd-heatmap {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4em;
    font-size: 0.7em;
    color: var(--text-muted);
  }

  .journalit-wpd-heatmap-months {
    display: flex;
    justify-content: space-between;
    align-self: stretch;
    padding-left: 4em;
  }

  .journalit-wpd-heatmap-body {
    display: flex;
    gap: 0.6em;
  }

  .journalit-wpd-heatmap-days {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 3.4em;
    font-size: 0.85em;
    line-height: 1;
    text-align: right;
    text-transform: uppercase;
  }

  .journalit-wpd-heatmap-grid {
    display: grid;
    grid-template-rows: repeat(7, 1em);
    grid-auto-flow: column;
    grid-auto-columns: 1em;
    gap: 0.3em;
  }

  .journalit-wpd-heat {
    display: inline-block;
    width: 1em;
    height: 1em;
    border-radius: 0.2em;
    background-color: var(--background-modifier-border);
  }

  .journalit-wpd-heat--1 { background-color: rgba(var(--color-green-rgb), 0.25); }
  .journalit-wpd-heat--2 { background-color: rgba(var(--color-green-rgb), 0.42); }
  .journalit-wpd-heat--3 { background-color: rgba(var(--color-green-rgb), 0.65); }
  .journalit-wpd-heat--4 { background-color: rgba(var(--color-green-rgb), 0.95); }
  .journalit-wpd-heat--neg { background-color: rgba(var(--color-red-rgb), 0.35); }

  .journalit-wpd-heatmap-legend {
    display: flex;
    align-items: center;
    gap: 0.35em;
  }

  .journalit-wpd-timeline {
    display: flex;
    gap: 1px;
    height: 0.9em;
    overflow: hidden;
    border-radius: 0.45em;
  }

  .journalit-wpd-timeline .journalit-wpd-heat {
    flex: 1 1 0;
    height: 100%;
    border-radius: 0;
  }

  

  .journalit-wpd-segmented {
    display: flex;
    gap: 0.25em;
  }

  .journalit-wpd-segmented-option {
    flex: 1 1 0;
    padding: 0.35em 0;
    border-radius: 0.3em;
    background-color: var(--background-modifier-border);
    font-size: 0.8em;
    text-align: center;
    color: var(--text-muted);
  }

  .journalit-wpd-segmented-option--active {
    box-shadow: inset 0 -0.15em 0 var(--interactive-accent);
    color: var(--text-normal);
  }

  .journalit-wpd-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5em 0.9em;
  }

  .journalit-wpd-field {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    min-width: 0;
  }

  .journalit-wpd-input {
    padding: 0.35em 0.5em;
    border-radius: 0.3em;
    background-color: var(--background-modifier-border);
    font-size: 0.9em;
  }

  .journalit-wpd-note {
    display: flex;
    flex-direction: column;
    gap: 0.35em;
    min-height: 0;
  }

  .journalit-wpd-note-h1 {
    font-size: 1.35em;
    font-weight: 700;
    line-height: 1.2;
  }

  .journalit-wpd-note-h2 {
    margin-top: 0.25em;
    font-size: 1.05em;
    font-weight: 600;
  }

  .journalit-wpd-note-text {
    font-size: 0.9em;
    color: var(--text-muted);
  }

  .journalit-wpd-task {
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-size: 0.9em;
  }

  .journalit-wpd-task-box {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 1em;
    height: 1em;
    border: 1px solid var(--text-faint);
    border-radius: 0.2em;
  }

  .journalit-wpd-task--done {
    color: var(--text-faint);
  }

  .journalit-wpd-task--done .journalit-wpd-task-box {
    border-color: var(--interactive-accent);
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  

  .journalit-wpd-score {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 0;
  }

  .journalit-wpd-score .journalit-wpd-hero {
    font-size: 2.2em;
  }

  .journalit-wpd-radar {
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
  }

  .journalit-wpd-radar-ring {
    fill: none;
    stroke: var(--background-modifier-border-hover);
    stroke-width: 0.6;
  }

  .journalit-wpd-radar-shape {
    fill: currentColor;
    fill-opacity: 0.35;
    stroke: currentColor;
    stroke-width: 1.4;
  }

  .journalit-wpd-aum {
    justify-content: space-between;
  }

  .journalit-wpd-aum-spark {
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
  }

  .journalit-wpd-roi {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    gap: 1.2em;
  }

  .journalit-wpd-roi-gauge {
    position: relative;
    display: flex;
    flex: 0 0 42%;
    flex-direction: column;
    align-items: center;
  }

  .journalit-wpd-roi-gauge .journalit-wpd-strong {
    position: absolute;
    bottom: 0;
    font-size: 1.3em;
  }

  .journalit-wpd-gauge {
    width: 100%;
  }

  .journalit-wpd-gauge-track,
  .journalit-wpd-gauge-fill {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
  }

  .journalit-wpd-gauge-track {
    stroke: var(--background-modifier-border);
  }

  .journalit-wpd-gauge-fill {
    stroke: currentColor;
  }

  .journalit-wpd-gauge-tick {
    stroke: var(--text-muted);
    stroke-width: 1.5;
  }

  .journalit-wpd-ledger {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 0.45em;
  }

  .journalit-wpd-ledger-net {
    padding-top: 0.45em;
    border-top: 1px solid var(--background-modifier-border);
    font-weight: 600;
  }

  

  .journalit-wpd-chartframe {
    gap: 0.35em;
    padding: 0.8em 1em 0.7em;
  }

  .journalit-wpd-chart-head {
    position: relative;
    flex: 0 0 auto;
    text-align: center;
  }

  .journalit-wpd-chart-title {
    font-size: 0.95em;
    color: var(--text-muted);
  }

  .journalit-wpd-chart-control {
    position: absolute;
    top: -0.15em;
    right: 0;
    padding: 0.1em 0.5em;
    border: 1px solid var(--background-modifier-border);
    border-radius: 0.3em;
    font-size: 0.75em;
    color: var(--text-muted);
  }

  .journalit-wpd-chart-legend {
    display: flex;
    justify-content: center;
    gap: 0.9em;
    font-size: 0.75em;
    color: var(--text-muted);
  }

  .journalit-wpd-chart-legend-item {
    display: inline-flex;
    align-items: center;
    gap: 0.35em;
  }

  .journalit-wpd-chart-legend-dot {
    width: 0.6em;
    height: 0.6em;
    border-radius: 50%;
    background-color: currentColor;
  }

  .journalit-wpd-chart-body {
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr auto;
    gap: 0.2em 0.45em;
    min-height: 0;
  }

  .journalit-wpd-chart-body--no-y {
    grid-template-columns: 1fr;
  }

  .journalit-wpd-chart-y {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 0.7em;
    line-height: 1;
    text-align: right;
    color: var(--text-faint);
  }

  .journalit-wpd-chart-plot {
    position: relative;
    min-height: 0;
  }

  .journalit-wpd-chart-plot svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .journalit-wpd-chart-x {
    display: flex;
    justify-content: space-between;
    font-size: 0.7em;
    color: var(--text-faint);
  }

  .journalit-wpd-chart-body .journalit-wpd-chart-x {
    grid-column: -2;
  }

  .journalit-wpd-gridline {
    stroke: var(--background-modifier-border);
    stroke-width: 1;
    stroke-dasharray: 2 3;
  }

  .journalit-wpd-baseline {
    stroke: var(--text-faint);
    stroke-width: 1;
  }

  .journalit-wpd-baseline--dashed {
    stroke-dasharray: 3 3;
  }

  .journalit-wpd-line {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .journalit-wpd-area {
    fill: currentColor;
    fill-opacity: 0.16;
    stroke: none;
  }

  .journalit-wpd-bar,
  .journalit-wpd-dot {
    fill: currentColor;
  }

  .journalit-wpd-hbars {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: space-around;
    gap: 0.5em;
    min-height: 0;
  }

  .journalit-wpd-hbar-row {
    display: grid;
    grid-template-columns: 6em 1fr;
    align-items: center;
    gap: 0.5em;
  }

  .journalit-wpd-hbar-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.75em;
    text-align: right;
    color: var(--text-muted);
  }

  .journalit-wpd-hbar-track {
    position: relative;
    height: 1.2em;
    border-left: 1px dashed var(--text-faint);
  }

  .journalit-wpd-hbar-fill {
    position: absolute;
    inset: 0 auto 0 0;
    width: var(--journalit-wpd-fill, 0%);
    border-radius: 0 0.15em 0.15em 0;
    background-color: currentColor;
  }

  .journalit-wpd-hbar-row--axis .journalit-wpd-chart-x {
    padding-top: 0.2em;
  }

  

  .journalit-wpd-calendar {
    gap: 0.4em;
    padding: 0.8em 0.9em;
  }

  .journalit-wpd-calendar-head {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
    color: var(--text-muted);
  }

  .journalit-wpd-calendar-head .journalit-wpd-strong {
    color: var(--text-normal);
  }

  .journalit-wpd-calendar-grid {
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: auto repeat(4, 1fr);
    gap: 0.25em;
    min-height: 0;
  }

  .journalit-wpd-calendar-dow {
    font-size: 0.6em;
    font-weight: 600;
    text-align: center;
    color: var(--text-muted);
  }

  .journalit-wpd-calendar-pill {
    border-radius: 0.3em;
    background-color: var(--interactive-accent);
    font-size: 0.6em;
    font-weight: 600;
    text-align: center;
    color: var(--text-on-accent);
  }

  .journalit-wpd-calendar-cell {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 0;
    padding: 0.15em 0.3em;
    border: 1px solid var(--background-modifier-border);
    border-radius: 0.3em;
    font-size: 0.6em;
    font-weight: 600;
    overflow: hidden;
  }

  .journalit-wpd-calendar-cell--pos {
    border-color: rgba(var(--color-green-rgb), 0.5);
    background-color: rgba(var(--color-green-rgb), 0.18);
    color: var(--color-green);
  }

  .journalit-wpd-calendar-cell--neg {
    border-color: rgba(var(--color-red-rgb), 0.5);
    background-color: rgba(var(--color-red-rgb), 0.2);
    color: var(--color-red);
  }

  .journalit-wpd-calendar-value {
    font-size: 1.25em;
    text-align: center;
  }

  .journalit-wpd-calendar-week {
    color: var(--text-faint);
  }

  

  .journalit-wpd-table {
    gap: 0;
    padding: 0.7em 0.9em;
  }

  .journalit-wpd-table-row {
    display: grid;
    grid-template-columns: 1.15fr 0.8fr 0.8fr 1fr;
    gap: 0.4em;
    padding: 0.42em 0;
    border-bottom: 1px solid var(--background-modifier-border);
    font-size: 0.8em;
  }

  .journalit-wpd-table-row > :last-child {
    text-align: right;
  }

  .journalit-wpd-table-head {
    font-size: 0.68em;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  

  .journalit-wpd-metric-row {
    position: relative;
    height: 100%;
  }

  .journalit-wpd-metric-card {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 170px;
    transform: translate(-50%, -50%) scale(0.72);
  }

  
  .journalit-wpd-metric-card .journalit-dashboard-metric-card {
    flex: 1 1 auto;
    min-width: 100%;
    min-height: 98px;
    margin-bottom: 0;
    padding: 14px;
  }
`;
