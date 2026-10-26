


export const MONTHLY_RETURNS_STYLES = `
  .journalit-monthly-returns {
    
    --journalit-monthly-returns-surface: var(--journalit-detail-card-surface, var(--background-primary));
    min-width: 0;
    overflow: hidden;
    margin: 0;
    background: var(--journalit-monthly-returns-surface);
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
  }
  
  .journalit-account-dashboard .journalit-monthly-returns {
    margin-bottom: 24px;
  }
  
  .journalit-account-dashboard .journalit-monthly-returns-scroll {
    margin-top: 4px;
  }
  
  .journalit-monthly-returns .journalit-monthly-returns-title {
    margin: 0;
    padding: 12px 16px 8px;
    color: var(--text-normal);
    font-size: var(--font-ui-small);
    font-weight: 600;
    line-height: 1.3;
  }
  .journalit-monthly-returns .journalit-monthly-returns-footnote {
    margin: 0;
    padding: 0 16px 12px;
    font-size: var(--font-ui-smaller);
    color: var(--text-muted);
  }
  .journalit-monthly-returns .journalit-monthly-returns-empty {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 8px;
    margin: 0;
    padding: 4px 16px 12px;
    font-size: 13px;
    color: var(--text-muted);
  }
  .journalit-monthly-returns-empty-hint { color: var(--text-faint); }
  .journalit-monthly-returns-loading {
    height: 120px;
    margin: 4px 16px 16px;
    border-radius: var(--radius-s);
    background: var(--background-modifier-hover);
  }
  .journalit-monthly-returns-scroll {
    container: journalit-monthly-returns / inline-size;
    overflow-x: auto;
    
    margin: 0 8px 8px;
  }
  .journalit-monthly-returns table {
    width: 100%;
    min-width: 1000px;
    border-collapse: separate;
    border-spacing: 0;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .journalit-monthly-returns th,
  .journalit-monthly-returns td {
    padding: 7px 8px;
    text-align: center;
    border: none;
    border-bottom: 1px solid var(--background-modifier-border);
  }
  .journalit-monthly-returns thead th {
    background: var(--journalit-monthly-returns-surface);
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .journalit-monthly-returns tbody tr:last-child > * { border-bottom: none; }
  .journalit-monthly-returns td { font-size: 13px; color: var(--text-normal); }
  .journalit-monthly-returns tr > :first-child {
    width: 1%;
    padding-inline-end: 12px;
    position: sticky;
    inset-inline-start: 0;
    background: var(--journalit-monthly-returns-surface);
    text-align: start;
  }
  .journalit-monthly-returns thead tr > :first-child { z-index: 2; }
  .journalit-monthly-returns tbody th { font-size: 13px; font-weight: 600; color: var(--text-normal); }
  
  .journalit-monthly-returns td {
    --journalit-monthly-returns-tint: transparent;
    background: linear-gradient(var(--journalit-monthly-returns-tint), var(--journalit-monthly-returns-tint));
  }
  .journalit-monthly-returns td.is-positive {
    --journalit-monthly-returns-tint: color-mix(in srgb, var(--color-green) 8%, transparent);
    color: var(--color-green);
  }
  .journalit-monthly-returns td.is-negative {
    --journalit-monthly-returns-tint: color-mix(in srgb, var(--color-red) 8%, transparent);
    color: var(--color-red);
  }
  .journalit-monthly-returns .is-total {
    --journalit-monthly-returns-tint: color-mix(in srgb, var(--background-modifier-hover) 60%, transparent);
    position: sticky;
    inset-inline-end: 0;
    font-weight: 600;
    background:
      linear-gradient(var(--journalit-monthly-returns-tint), var(--journalit-monthly-returns-tint)),
      var(--journalit-monthly-returns-surface);
  }
  .journalit-monthly-returns thead th.is-total { z-index: 2; }
  .journalit-monthly-returns td.is-total.is-positive {
    --journalit-monthly-returns-tint: color-mix(in srgb, var(--color-green) 14%, transparent);
  }
  .journalit-monthly-returns td.is-total.is-negative {
    --journalit-monthly-returns-tint: color-mix(in srgb, var(--color-red) 14%, transparent);
  }
  .journalit-monthly-returns td.is-flat { color: var(--text-muted); }
  .journalit-monthly-returns td.is-empty { color: var(--text-faint); }
  
  .journalit-monthly-returns tbody td:has(> .journalit-monthly-returns-cell),
  .journalit-monthly-returns tbody th:has(> .journalit-monthly-returns-cell) { padding: 2px; }
  .journalit-monthly-returns .journalit-monthly-returns-cell {
    appearance: none;
    display: block;
    width: 100%;
    height: auto;
    margin: 0;
    padding: 5px 6px;
    border: none;
    border-radius: var(--radius-s);
    box-shadow: none;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: inherit;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }
  .journalit-monthly-returns .journalit-monthly-returns-cell:hover { background-color: var(--background-modifier-hover); }
  .journalit-monthly-returns .journalit-monthly-returns-cell:focus-visible {
    outline: 2px solid var(--interactive-accent);
    outline-offset: -2px;
  }
  
  @container journalit-monthly-returns (max-width: 1040px) {
    .journalit-monthly-returns table { min-width: 0; }
    .journalit-monthly-returns th,
    .journalit-monthly-returns td { padding: 6px 3px; }
    .journalit-monthly-returns thead th { font-size: 11px; letter-spacing: 0; }
    .journalit-monthly-returns td,
    .journalit-monthly-returns tbody th { font-size: 11px; }
    .journalit-monthly-returns .journalit-monthly-returns-cell { padding: 4px 3px; }
    .journalit-monthly-returns tr > :first-child { padding-inline-end: 6px; }
  }
`;
