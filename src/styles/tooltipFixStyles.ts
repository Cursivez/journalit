

export const TOOLTIP_FIX_STYLES = `
  
  .journalit-icon-button,
  .journalit-button {
    position: relative !important;
  }
  
  
  .journalit-icon-button .tooltip,
  .journalit-icon-button + .tooltip,
  .journalit-button .tooltip,
  .journalit-button + .tooltip,
  .journalit-no-tooltip-button .tooltip,
  .journalit-no-tooltip-button + .tooltip {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  
  .drc-container .tooltip {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    z-index: -1 !important;
  }

  
`;
