


export const JOURNALIT_TOKEN_STYLES = `
  [class*="journalit-"] {
    
    --journalit-accent-default: var(--interactive-accent);
    --journalit-accent-hover: var(--interactive-accent-hover);
    --journalit-accent-text: var(--text-accent);
    --journalit-accent-on: var(--text-on-accent);
    --journalit-accent-subtle: color-mix(in oklch, var(--interactive-accent) 15%, transparent);
    
    --journalit-pnl-positive: var(--color-green);
    --journalit-pnl-negative: var(--color-red);
    --journalit-pnl-neutral: var(--text-muted);
    --journalit-pnl-open: var(--color-blue);
    --journalit-pnl-positive-surface: color-mix(in srgb, var(--color-green) 12%, transparent);
    --journalit-pnl-negative-surface: color-mix(in srgb, var(--color-red) 12%, transparent);
    
    --journalit-status-success: var(--text-success);
    --journalit-status-warning: var(--text-warning);
    --journalit-status-error: var(--text-error);
    --journalit-status-info: var(--color-blue);
    
    --journalit-chart-series-1: var(--color-blue);
    --journalit-chart-series-2: var(--color-purple);
    --journalit-chart-series-3: var(--color-orange);
    --journalit-chart-series-4: var(--color-cyan);
    --journalit-chart-series-5: var(--color-pink);
    --journalit-chart-series-6: var(--color-yellow);
    --journalit-chart-series-7: var(--color-green);
    --journalit-chart-series-8: var(--text-muted);
    
    --journalit-surface-base: var(--background-primary);
    --journalit-surface-raised: var(--background-secondary);
    --journalit-surface-sunken: var(--background-primary-alt);
    --journalit-surface-border: var(--background-modifier-border);
    --journalit-surface-hover: var(--background-modifier-hover);
    
    --journalit-text-normal: var(--text-normal);
    --journalit-text-muted: var(--text-muted);
    --journalit-text-faint: var(--text-faint);
    
    --journalit-font-size-caption: var(--font-ui-smaller);
    --journalit-font-size-body: var(--font-ui-small);
    --journalit-font-size-label: var(--font-ui-small);
    --journalit-font-size-heading: var(--font-ui-medium);
    --journalit-font-size-title: var(--font-ui-large);
    --journalit-font-size-display: calc(var(--font-ui-large) * 1.4);
    
    --journalit-font-weight-medium: var(--font-medium);
    --journalit-font-weight-semibold: var(--font-semibold);
    
    --journalit-font-numeric: tabular-nums;
    
    --journalit-space-1: var(--size-2-1);
    --journalit-space-2: var(--size-4-1);
    --journalit-space-3: var(--size-4-2);
    --journalit-space-4: var(--size-4-3);
    --journalit-space-5: var(--size-4-4);
    --journalit-space-6: var(--size-4-6);
    --journalit-space-7: var(--size-4-8);
    
    --journalit-radius-sm: var(--radius-s);
    --journalit-radius-md: var(--radius-m);
    --journalit-radius-lg: var(--radius-l);
    
    --journalit-shadow-popover: var(--shadow-s);
    --journalit-shadow-modal: var(--shadow-l);
    
    --journalit-motion-fast: var(--anim-duration-fast);
    --journalit-motion-moderate: var(--anim-duration-moderate);
    
    --journalit-easing-standard: var(--anim-motion-smooth);
  }
`;
