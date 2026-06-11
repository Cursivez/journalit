



const MISSED_TRADE_NOTE_STYLES = `
  

  
  .journalit-missed-trade-view,
  .missed-trade-form-view-container .journalit-missed-trade-view {
    margin: 0;
    border-bottom: none;
    padding: 0;
    display: block !important;
    width: 100% !important;
    z-index: 1;
    position: relative;
    box-sizing: border-box;
    contain: content;
    isolation: isolate;
  }
  
  
  .journalit-missed-trade-note-wrapper {
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    contain: content;
    isolation: isolate;
    position: relative;
    box-sizing: border-box;
  }

  
  .markdown-source-view.is-live-preview.is-readable-line-width .journalit-missed-trade-view {
    max-width: var(--file-line-width, 700px);
    margin-left: auto;
    margin-right: auto;
  }
  
  .missed-trade-note-container {
    background-color: var(--background-primary);
    border-radius: var(--border-radius-lg, 8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin: 0;
    overflow: hidden;
    position: relative;
    font-family: var(--font-interface);
    isolation: isolate;
    contain: layout style paint;
    width: 100%;
    align-self: flex-start;
    transition: box-shadow 0.2s ease-in-out;
  }

  .missed-trade-note-loading-placeholder {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .missed-trade-note-loading-text {
    color: var(--text-muted);
    font-size: 12px;
  }

  
  
  
  .trade-header-actions .missed-trade-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-orange, #ff9500);
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 4px rgba(255, 149, 0, 0.3);
    margin-right: 0.75rem;
  }

  

  
  
  .missed-trade-reason-section {
    margin-top: 1rem;
  }

  .missed-trade-reason-section .details-card {
    background-color: var(--background-secondary);
    border-left: 4px solid var(--color-orange, #ff9500);
  }

  .missed-trade-reason-section h4 {
    color: var(--color-orange, #ff9500);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .missed-trade-reason-section h4::before {
    content: '❌';
    font-size: 1rem;
  }

  .missed-trade-reason-content {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-normal);
    white-space: pre-wrap;
    padding: 0.5rem 0;
    background-color: var(--background-secondary-alt, var(--background-secondary));
    border-radius: 4px;
    padding: 0.75rem;
    margin-top: 0.5rem;
  }

  

  
  .missed-trades-timeline-section {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--background-modifier-border);
  }

  .missed-trades-label {
    color: var(--color-orange, #ff9500);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  
  .timeline-item.missed-trade {
    background-color: rgba(255, 149, 0, 0.15);
    color: var(--color-orange, #ff9500);
    border-color: rgba(255, 149, 0, 0.3);
    font-weight: 500;
  }

  .timeline-item.missed-trade:hover {
    background-color: rgba(255, 149, 0, 0.25);
    transform: translateY(-1px);
  }

  .timeline-item.missed-trade.active {
    border: 2px solid var(--color-orange, #ff9500);
    background-color: rgba(255, 149, 0, 0.2);
    font-weight: 600;
  }


  
  
  .missed-trade-note-content {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  
  
  .missed-trade-note-review-section {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--background-modifier-border);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  
  
  
  .journalit-missed-trade-view .field .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--text-normal);
    transition: color 0.2s ease;
  }

  .journalit-missed-trade-view .field .checkbox-label:hover {
    color: var(--interactive-accent);
  }

  .journalit-missed-trade-view .field .checkbox-label input[type="checkbox"] {
    cursor: pointer;
    transform: scale(1.1);
  }

  .journalit-missed-trade-view .field .checkbox-label span {
    font-weight: 500;
  }

  
  .journalit-missed-trade-view .field .textarea {
    width: 100%;
    min-height: 80px;
    padding: 0.75rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
    color: var(--text-normal);
    font-family: inherit;
    font-size: 0.9rem;
    line-height: 1.5;
    resize: vertical;
    transition: border-color 0.15s ease;
  }

  .journalit-missed-trade-view .field .textarea:focus {
    outline: none;
    border-color: var(--interactive-accent);
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2);
  }

  .journalit-missed-trade-view .field .textarea::placeholder {
    color: var(--text-muted);
    opacity: 0.7;
  }

  
  
  @media (max-width: 768px) {
    .missed-trade-badge {
      font-size: 0.7rem;
      padding: 0.2rem 0.4rem;
      margin-right: 0.5rem;
    }
    
    .missed-trade-reason-content {
      font-size: 0.85rem;
      padding: 0.5rem;
    }
  }

  @media (max-width: 480px) {
    .missed-trades-timeline-section {
      margin-top: 0.75rem;
      padding-top: 0.5rem;
    }
    
    .missed-trades-label {
      font-size: 0.85rem;
    }
  }

  
  
  
  
  .theme-dark .journalit-missed-trade-view .missed-trade-reason-content {
    background-color: var(--background-secondary-alt);
  }
  
  .theme-dark .journalit-missed-trade-view .timeline-item.missed-trade {
    background-color: rgba(255, 149, 0, 0.2);
  }
  
  .theme-dark .journalit-missed-trade-view .timeline-item.missed-trade:hover {
    background-color: rgba(255, 149, 0, 0.3);
  }

  
  
  .workspace-split.mod-vertical .journalit-missed-trade-view {
    max-width: 100%;
    flex-shrink: 1;
  }
  
  .workspace-leaf-content .journalit-missed-trade-view .trade-metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  .workspace-leaf-content .journalit-missed-trade-view .missed-trade-note-container {
    min-width: 0;
  }
`;


function injectMissedTradeNoteStyles(): void {
  return;
}


export function ensureMissedTradeNoteStyles(): void {}
