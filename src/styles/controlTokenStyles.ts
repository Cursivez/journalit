

export const CONTROL_TOKEN_STYLES = `
  [class*="journalit-"] {
    --journalit-control-height: 28px;
    --journalit-control-radius: 6px;
    --journalit-control-inner-radius: 5px;
    --journalit-control-switch-thumb-radius: 3px;
    --journalit-control-curve: cubic-bezier(0.3, 0.9, 0.4, 1);
    --journalit-control-focus: color-mix(in oklch, var(--interactive-accent) 55%, var(--text-normal));
    --journalit-control-strip: color-mix(in srgb, var(--text-normal) 5%, transparent);
    --journalit-control-field-fill: color-mix(in srgb, var(--text-normal) 6%, transparent);
    --journalit-control-field-fill-hover: color-mix(in srgb, var(--text-normal) 9%, transparent);
    --journalit-control-field-ring: inset 0 0 0 1px color-mix(in srgb, var(--text-normal) 12%, transparent);
    --journalit-control-overlay-hover: color-mix(in srgb, black 4%, transparent);
    --journalit-control-contrast-hover: color-mix(in srgb, white 12%, transparent);
    --journalit-control-ring: color-mix(in srgb, black 14%, transparent);
    --journalit-control-primary-fill:
      linear-gradient(180deg, color-mix(in srgb, white 20%, transparent), transparent),
      linear-gradient(var(--interactive-accent), var(--interactive-accent));
    --journalit-control-primary-fill-hover:
      linear-gradient(var(--journalit-control-contrast-hover), var(--journalit-control-contrast-hover)),
      var(--journalit-control-primary-fill);
    --journalit-control-primary-shadow:
      0 1px 1.5px color-mix(in srgb, black 20%, transparent),
      0 0 0 0.5px color-mix(in srgb, var(--interactive-accent) 72%, black),
      inset 0 1px 2px color-mix(in srgb, white 14%, transparent),
      inset 0 -1px 2px color-mix(in srgb, black 6%, transparent);
    --journalit-control-secondary-solid: var(--background-primary);
    --journalit-control-secondary-fill: var(--journalit-control-secondary-solid);
    --journalit-control-secondary-fill-hover:
      linear-gradient(var(--journalit-control-overlay-hover), var(--journalit-control-overlay-hover)),
      linear-gradient(var(--journalit-control-secondary-solid), var(--journalit-control-secondary-solid));
    --journalit-control-secondary-shadow:
      0 1px 1.5px color-mix(in srgb, black 10%, transparent),
      0 0 0 0.5px var(--journalit-control-ring);
    --journalit-control-thumb-shadow: 0 1px 2px color-mix(in srgb, black 30%, transparent);
    
    --journalit-control-selected-fill: var(--journalit-control-secondary-fill);
    --journalit-control-selected-shadow: var(--journalit-control-secondary-shadow);
    --journalit-control-selected-text: var(--text-normal);
    
    --journalit-control-menu-fill: var(--journalit-control-secondary-solid);
    --journalit-control-switch-off: color-mix(in srgb, var(--text-normal) 48%, var(--background-primary));
    --journalit-control-switch-shadow:
      inset 0 1px 1px color-mix(in srgb, black 8%, transparent),
      inset 0 0 0 0.5px color-mix(in srgb, black 10%, transparent);
    --journalit-control-danger-text: color-mix(in oklch, var(--text-error) 72%, var(--text-normal));
  }

  
  [class*="journalit-"]:not(body, .journalit-dashboard-calendar, .journalit-dashboard-calendar *) {
    font-variant-numeric: var(--journalit-font-numeric);
  }

  .journalit-dashboard-calendar {
    font-variant-numeric: normal;
  }

  .theme-dark [class*="journalit-"] {
    --journalit-control-overlay-hover: color-mix(in srgb, white 6%, transparent);
    --journalit-control-contrast-hover: color-mix(in srgb, black 24%, transparent);
    --journalit-control-ring: color-mix(in srgb, white 16%, transparent);
    --journalit-control-primary-shadow:
      0 1px 2px color-mix(in srgb, black 40%, transparent),
      0 0 0 0.5px color-mix(in srgb, white 40%, transparent),
      0 -0.5px 0 color-mix(in srgb, white 30%, transparent);
    --journalit-control-secondary-solid: color-mix(in srgb, white 6%, var(--background-primary));
    --journalit-control-secondary-shadow:
      0 1px 2px color-mix(in srgb, black 40%, transparent),
      0 0 0 0.5px color-mix(in srgb, white 20%, transparent),
      0 -0.5px 0 color-mix(in srgb, white 10%, transparent);
    --journalit-control-switch-off: color-mix(in srgb, white 12%, var(--background-primary));
    --journalit-control-switch-shadow:
      inset 0 -0.5px 0 color-mix(in srgb, white 10%, transparent),
      inset 0 0 0 0.5px color-mix(in srgb, white 16%, transparent);
  }
`;
