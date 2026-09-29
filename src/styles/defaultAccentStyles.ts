

export const DEFAULT_ACCENT_STYLES = `
  body.journalit-default-accent [class*="journalit-"] {
    
    --accent-h: 76;
    --accent-s: 90%;
    --accent-l: 42%;
    
    --text-on-accent: hsl(var(--accent-h), 80%, 10%);

    --color-accent-hsl: var(--accent-h), var(--accent-s), var(--accent-l);
    --color-accent: hsl(var(--accent-h), var(--accent-s), var(--accent-l));
    --text-accent: var(--color-accent);
    --text-accent-hover: var(--color-accent-2);
    --interactive-accent: var(--color-accent-1);
    --interactive-accent-hover: var(--color-accent-2);
    --interactive-accent-hsl: var(--color-accent-hsl);
    --text-selection: color-mix(in oklch, var(--interactive-accent) 20%, transparent);

    --checkbox-color: var(--interactive-accent);
    --checkbox-color-hover: var(--interactive-accent-hover);
    --link-color: var(--text-accent);
    --link-color-hover: var(--text-accent-hover);
    --link-external-color: var(--text-accent);
    --link-external-color-hover: var(--text-accent-hover);
    --link-unresolved-color: var(--text-accent);
    --link-unresolved-decoration-color: color-mix(in oklch, var(--interactive-accent) 30%, transparent);
    --tag-color: var(--text-accent);
    --tag-color-hover: var(--text-accent);
    --tag-background: color-mix(in oklch, var(--interactive-accent) 10%, transparent);
    --tag-background-hover: color-mix(in oklch, var(--interactive-accent) 20%, transparent);
    --tag-border-color: color-mix(in oklch, var(--interactive-accent) 15%, transparent);
    --tag-border-color-hover: color-mix(in oklch, var(--interactive-accent) 15%, transparent);
    --slider-fill-background: var(--interactive-accent);
    --icon-color-active: var(--text-accent);
    --nav-item-color-highlighted: var(--text-accent);
    --nav-item-background-selected: color-mix(in oklch, var(--color-accent) 15%, transparent);
    --background-modifier-active-hover: color-mix(in oklch, var(--interactive-accent) 10%, transparent);
    --blockquote-border-color: var(--interactive-accent);
    --collapse-icon-color-collapsed: var(--text-accent);
    --list-marker-color-collapsed: var(--text-accent);
    --divider-color-hover: var(--interactive-accent);
    --embed-border-start: 2px solid var(--interactive-accent);
    --table-selection: color-mix(in oklch, var(--color-accent) 10%, transparent);
    --table-selection-border-color: var(--interactive-accent);
    --pill-color-remove-hover: var(--text-accent);
  }

  body.theme-light.journalit-default-accent [class*="journalit-"] {
    --color-accent-1: hsl(calc(var(--accent-h) - 1), calc(var(--accent-s) * 1.01), calc(var(--accent-l) * 1.075));
    --color-accent-2: hsl(calc(var(--accent-h) - 3), calc(var(--accent-s) * 1.02), calc(var(--accent-l) * 1.15));
    
    --text-accent: hsl(var(--accent-h), var(--accent-s), 24%);
    --text-accent-hover: hsl(var(--accent-h), var(--accent-s), 20%);
  }

  body.theme-dark.journalit-default-accent [class*="journalit-"] {
    --color-accent-1: hsl(calc(var(--accent-h) - 3), calc(var(--accent-s) * 1.02), calc(var(--accent-l) * 1.15));
    --color-accent-2: hsl(calc(var(--accent-h) - 5), calc(var(--accent-s) * 1.05), calc(var(--accent-l) * 1.29));
    --text-accent: var(--color-accent-1);
    --interactive-accent: var(--color-accent);
    --interactive-accent-hover: var(--color-accent-1);
    --text-selection: color-mix(in oklch, var(--interactive-accent) 33%, transparent);
  }
`;
