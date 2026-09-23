
export const SESSION_INDICATOR_STYLES = `
  [data-session-phase='live'] .journalit-session-indicator-icon {
    color: var(--color-red);
  }

  [data-session-phase='preparation'] .journalit-session-indicator-icon {
    color: var(--color-orange);
  }

  
  [data-session-phase='live'] .journalit-session-indicator-icon svg {
    animation: journalit-session-live-heartbeat 2.2s ease-in-out infinite;
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes journalit-session-live-heartbeat {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
  }

  
  body[data-journalit-session-phase='live']
    .workspace-tab-header[data-type='journalit-session-mode-view']
    .workspace-tab-header-inner-icon
    svg {
    stroke: var(--color-red);
    animation: journalit-session-live-heartbeat 2.2s ease-in-out infinite;
    transform-box: fill-box;
    transform-origin: center;
  }

  body[data-journalit-session-phase='preparation']
    .workspace-tab-header[data-type='journalit-session-mode-view']
    .workspace-tab-header-inner-icon
    svg {
    stroke: var(--color-orange);
  }

  @media (prefers-reduced-motion: reduce) {
    [data-session-phase='live'] .journalit-session-indicator-icon svg,
    body[data-journalit-session-phase='live']
      .workspace-tab-header[data-type='journalit-session-mode-view']
      .workspace-tab-header-inner-icon
      svg {
      animation: none;
    }
  }
`;
