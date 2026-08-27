

export const TOOLTIP_FIX_STYLES = `
  
  .journalit-icon-button,
  .journalit-button,
  .drc-note-grade-dropdown select {
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

  
  .drc-note-grade-dropdown::before,
  .drc-note-grade-dropdown::after,
  .drc-note-grade-dropdown select::before,
  .drc-note-grade-dropdown select::after {
    content: none !important;
    display: none !important;
  }

  
  .drc-container .tooltip,
  .drc-note-grade-dropdown .tooltip,
  .drc-note-grade-value .tooltip {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    z-index: -1 !important;
  }

  
  .drc-note-grade-value,
  select.drc-note-grade-value {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    width: 60px !important;
    height: 60px !important;
    border-radius: 50% !important;
    margin: 0 auto !important;
    font-size: 18px !important;
    
    padding: 0 0 4px 0 !important; 
    overflow: visible !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    line-height: 1 !important; 
    vertical-align: middle !important;
  }

  
  .drc-note-grade-value,
  .drc-note-grade-dropdown select,
  .drc-note-grade-dropdown option {
    text-align: center !important;
    text-align-last: center !important;
  }

  
`;
