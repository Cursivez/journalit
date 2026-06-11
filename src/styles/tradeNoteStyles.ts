



const TRADE_NOTE_STYLES = `
  

  
  .journalit-trade-view,
  .trade-form-view-container .journalit-trade-view {
    margin-top: 0;
    margin-bottom: 0;
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
  
  
  .journalit-trade-note-wrapper {
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

  
  .markdown-source-view.is-live-preview.is-readable-line-width .journalit-trade-view {
    max-width: var(--file-line-width, 700px);
    margin-left: auto;
    margin-right: auto;
  }
  
  .trade-note-container {
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

  .trade-note-loading-placeholder {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trade-note-loading-text {
    color: var(--text-muted);
    font-size: 12px;
  }
  
  
  .trade-note-header {
    padding: 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background: linear-gradient(to right, var(--background-secondary), var(--background-primary));
  }
  
  .trade-note-header.profit {
    background: linear-gradient(to right, rgba(102, 187, 106, 0.1), var(--background-primary));
    border-left: 4px solid var(--color-success, #43a047);
  }

  .trade-note-header.loss {
    background: linear-gradient(to right, rgba(229, 57, 53, 0.1), var(--background-primary));
    border-left: 4px solid var(--color-error, #e53935);
  }

  .trade-note-header.open {
    background: linear-gradient(to right, rgba(33, 150, 243, 0.1), var(--background-primary));
    border-left: 4px solid var(--status-open-color);
  }

  .trade-note-header.breakeven {
    background: linear-gradient(to right, rgba(128, 128, 128, 0.1), var(--background-primary));
    border-left: 4px solid var(--text-muted);
  }

  .trade-note-header.privacy-masked {
    background: linear-gradient(to right, var(--background-secondary), var(--background-primary));
    border-left: 4px solid var(--text-muted);
  }

  .trade-instrument {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--text-normal);
    display: flex;
    align-items: center;
  }
  
  .trade-direction-icon {
    margin-right: 0.5rem;
    font-size: 1.3rem;
    line-height: 1;
  }
  
  
  .trade-header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  
  .trade-edit-button {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background-color: var(--interactive-accent);
    color: var(--text-on-accent, white);
    border: none;
    border-radius: 4px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .trade-edit-button:hover {
    background-color: var(--interactive-accent-hover, var(--interactive-accent));
    opacity: 0.9;
  }
  
  .trade-edit-button svg {
    width: 14px;
    height: 14px;
  }

  .trade-pnl {
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  .profit-text {
    color: var(--color-success, #43a047);
  }
  
  .loss-text {
    color: var(--color-error, #e53935);
  }

  .breakeven-text {
    color: var(--text-muted);
  }

  .open-text {
    color: var(--status-open-color);
    font-weight: 600;
  }
  
  
  .missed-trade-badge {
    background-color: var(--color-orange, #ff9800);
    color: var(--text-on-accent, white);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    margin-left: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  
  .open-trade-badge {
    background-color: var(--status-open-color);
    color: var(--text-on-accent, white);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    margin-left: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  
  .backtest-trade-badge {
    background-color: var(--color-purple, #6f42c1);
    color: var(--text-on-accent, white);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    margin-left: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  
  
  
  .trade-note-content {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem; 
  }
  
  
  .trade-overview-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0;
    position: relative;
    margin-bottom: 0;
  }

  
  .trade-metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.8rem;
    margin-bottom: 0;
  }
  
  .journalit-trade-view .metric-card {
    background-color: var(--background-primary);
    padding: 0.7rem;
    border-radius: var(--border-radius-md, 4px);
    border: 1px solid var(--background-modifier-border);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }
  
  .journalit-trade-view .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
    border-color: var(--interactive-accent-hover);
  }
  
  .journalit-trade-view .metric-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 0.2rem;
    letter-spacing: 0.5px;
  }
  
  .journalit-trade-view .metric-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-normal);
    margin-bottom: 0.2rem;
    max-width: 100%;
    line-height: 1.2;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  
  .metric-subtitle {
    font-size: 0.7rem;
    color: var(--text-muted);
  }

  
  .trade-metadata-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    padding: 0.2rem 0;
  }

  .metadata-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .metadata-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .metadata-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }
  
  
  .trade-broker-metadata-section {
    margin: 0;
  }

  .trade-broker-metadata-card {
    width: 100%;
  }

  .trade-broker-metadata-value {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-normal);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .trade-tags-container {
    margin: 0;
  }
  
  .tags-row {
    display: flex;
    gap: 1rem;
    width: 100%;
  }
  
  .tags-section {
    flex: 1;
    margin-bottom: 0;
    background-color: var(--background-primary);
    border-radius: var(--border-radius-md, 4px);
    padding: 0.7rem;
    border: 1px solid var(--background-modifier-border);
  }
  
  .tags-section h4 {
    font-size: 0.85rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: var(--text-normal);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  
  .setup-section h4::before {
    content: '✓'; 
    color: var(--color-secondary, var(--text-accent));
    font-weight: bold;
  }

  .mistake-section h4::before {
    content: '⚠'; 
    color: var(--color-error, #e53935);
    font-weight: bold;
  }
  
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  
  .journalit-trade-view .tag,
  .journalit-missed-trade-view .tag {
    padding: 0.35rem 0.7rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    transition: transform 0.15s ease;
    color: var(--text-normal);
  }

  .journalit-trade-view .tag:hover,
  .journalit-missed-trade-view .tag:hover {
    transform: translateY(-1px);
  }
  
  .setup-tag {
    background-color: rgba(66, 133, 244, 0.15);
    color: rgba(66, 133, 244, 1);
    border: 1px solid rgba(66, 133, 244, 0.3);
  }
  
  .mistake-tag {
    background-color: rgba(229, 57, 53, 0.15);
    color: var(--color-error, #e53935);
    border: 1px solid rgba(229, 57, 53, 0.3);
  }

  .account-tag {
    padding: 0.35rem 0.7rem;
    color: var(--text-accent);
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    transition: transform 0.15s ease, color 0.15s ease;
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 3px;
  }
  
  .account-tag:hover {
    transform: translateY(-1px);
    color: var(--text-accent-hover, var(--text-accent));
  }
  
  
  .trade-notes-preview {
    background-color: var(--background-secondary);
    padding: 1rem;
    border-radius: var(--border-radius-md, 4px);
    margin-top: 1.5rem;
  }
  
  .trade-notes-preview h4 {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
    color: var(--text-normal);
  }
  
  .trade-notes-preview p {
    color: var(--text-normal);
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
  }
  
  
  .trade-details-footer {
    margin-top: 0;
  }
  
  .details-card {
    background-color: var(--background-primary);
    padding: 1rem;
    border-radius: var(--border-radius-md, 6px);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--background-modifier-border);
    margin-bottom: 0;
    transition: box-shadow 0.2s ease;
  }

  .details-card:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  }
  
  .details-card.expanded-details {
    width: 100%;
  }

  .trade-custom-fields-section {
    margin-top: 0;
  }

  .trade-custom-fields-card {
    width: 100%;
  }

  .trade-custom-fields-rows {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .trade-custom-fields-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 1.75rem;
    align-items: start;
  }

  .trade-custom-fields-row--full {
    grid-template-columns: 1fr;
  }

  .trade-custom-field-item {
    min-width: 0;
  }

  .trade-custom-field-item--inline {
    display: grid;
    grid-template-columns: minmax(100px, auto) minmax(0, 1fr);
    column-gap: 0.9rem;
    align-items: baseline;
  }

  .trade-custom-field-item--empty {
    visibility: hidden;
  }

  .trade-custom-field-label {
    color: var(--text-muted);
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: none;
    letter-spacing: normal;
    margin-bottom: 0.3rem;
  }

  .trade-custom-field-item--inline .trade-custom-field-label {
    margin-bottom: 0;
  }

  .trade-custom-field-value {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-normal);
    line-height: 1.45;
    word-break: break-word;
  }

  .trade-custom-field-text {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-normal);
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .trade-custom-field-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    min-width: 0;
  }

  .trade-custom-field-tooltip-anchor {
    display: flex;
    justify-content: flex-start;
    min-width: 0;
  }

  .journalit-trade-view .tag.trade-custom-field-pill {
    background-color: var(--background-secondary);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
    transition: none !important;
    transform: none !important;
  }

  .journalit-trade-view .tag.trade-custom-field-pill:hover {
    transform: none !important;
  }

  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--background-modifier-border);
  }
  
  .details-card h4 {
    font-size: 1rem;
    margin: 0;
    color: var(--text-normal);
  }
  
  
  .trade-main-content {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  
  .thesis-section {
    background-color: var(--background-primary);
    padding: 1rem 1.2rem;
    border-radius: var(--border-radius-md, 6px);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--background-modifier-border);
    margin: 0;
    position: relative;
  }
  
  
  .thesis-section h4 {
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--text-normal);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--background-modifier-border);
    position: relative;
  }
  
  .thesis-content {
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-normal);
    white-space: pre-wrap;
    padding: 0 0.2rem;
  }
  
  .details-card h4 {
    font-size: 0.9rem;
    margin-top: 0;
    margin-bottom: 0.8rem;
    color: var(--text-normal);
    
    padding-bottom: 0;
  }
  
  .details-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  
  .details-table td {
    padding: 0.6rem 0.5rem;
    font-size: 0.9rem;
    text-overflow: ellipsis;
    overflow: hidden;
    border-bottom: none;
  }
  
  
  .details-table tr:nth-child(2) td {
    border-bottom: 1px solid var(--background-modifier-border-hover, rgba(0, 0, 0, 0.04));
    padding-bottom: 0.8rem;
  }
  
  .details-table tr:nth-child(3) td {
    padding-top: 0.8rem;
  }
  
  .details-table tr:nth-child(4) td {
    border-bottom: 1px solid var(--background-modifier-border-hover, rgba(0, 0, 0, 0.04));
    padding-bottom: 0.8rem;
  }
  
  .details-table tr:nth-child(5) td {
    padding-top: 0.8rem;
  }
  
  .details-table td:nth-child(odd) {
    color: var(--text-muted);
    width: 20%;
    font-weight: 500;
  }
  
  .details-table td:nth-child(even) {
    color: var(--text-normal);
    font-weight: 500;
    width: 30%;
  }
  
  .details-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .details-list li {
    padding: 0.4rem 0;
    font-size: 0.9rem;
    color: var(--text-normal);
    border-bottom: 1px solid var(--background-modifier-border-hover, var(--background-modifier-border));
  }
  
  
  .accounts-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.2rem 0;
  }
  
  
  .account-tag {
    padding: 0.4rem 0.8rem;
    background-color: var(--background-secondary-alt, var(--background-secondary));
    color: var(--text-normal);
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    display: inline-block;
    cursor: pointer; 
    transition: background-color 0.2s;
  }
  
  .account-tag:hover {
    background-color: var(--background-modifier-hover);
  }
  
  .notes-content {
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--text-normal);
    white-space: pre-wrap;
  }
  
  
  .trade-images-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--background-secondary);
    border-radius: var(--border-radius-md, 4px);
    padding: 0.6rem 0; 
    margin: 0; 
    width: 100%; 
  }
  
  
  .trade-images-section[data-image-count="1"] {
    padding: 0; 
    margin: 0;
  }
  
  
  .trade-images-section .journalit-image-carousel {
    margin-bottom: 0;
    background-color: transparent;
    box-shadow: none;
    padding: 0;
  }

  
  .trade-images-section .journalit-carousel-main {
    justify-content: center;
  }

  .trade-images-section .journalit-carousel-image-container {
    display: flex;
    justify-content: center;
  }

  .trade-images-section .journalit-carousel-image {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }
  
  
  .trade-images-section .journalit-image-carousel[data-single-image="true"],
  .trade-images-section[data-image-count="1"] .journalit-image-carousel {
    padding: 0;
    margin: 0;
  }
  
  
  .trade-images-section .journalit-image-carousel[data-single-image="true"] .image-container,
  .trade-images-section[data-image-count="1"] .image-container,
  .trade-images-section[data-image-count="1"] .journalit-carousel-image-container {
    margin: 0;
    padding: 0;
  }
  
  
  .trade-images-section[data-image-count="1"] * {
    margin-top: 0;
    margin-bottom: 0;
  }
  
  
  .single-image-carousel,
  .single-image-carousel .journalit-carousel-main,
  .single-image-carousel .journalit-carousel-image-container {
    padding: 0 !important;
    margin: 0 !important;
  }
  
  
  .trade-images-section[data-image-count="1"] + .trade-metrics-grid {
    margin-top: 0;
  }
  
  
  .trade-empty-images {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--background-secondary);
    border-radius: var(--border-radius-md, 4px);
    padding: 0.8rem 0; 
    margin: 0; 
    width: 100%; 
  }
  
  .image-carousel {
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  
  .trade-images-section[data-image-count="1"] .image-carousel,
  .trade-images-section[data-image-count="1"] .journalit-carousel-main {
    margin: 0;
    padding: 0;
  }
  
  .image-container {
    width: 100%;
    max-height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: var(--background-secondary-alt, var(--background-secondary));
    border-radius: var(--border-radius-md, 4px);
  }
  
  .image-container img {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
  }
  
  .carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--background-secondary);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    opacity: 0.7;
    transition: opacity 0.2s, background-color 0.2s;
    z-index: 10;
  }
  
  .carousel-button:hover {
    opacity: 1;
    background-color: var(--background-primary);
  }
  
  .carousel-button.prev {
    left: 10px;
  }
  
  .carousel-button.next {
    right: 10px;
  }
  
  .image-counter {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 0.3rem;
  }
  
  
  .trade-images-section[data-image-count="1"] .image-counter {
    display: none;
  }
  
  .image-thumbnails {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 100%;
    margin-top: 0.3rem;
  }
  
  .journalit-trade-view .thumbnail {
    width: 60px;
    height: 60px;
    border-radius: var(--border-radius-sm, 2px);
    overflow: hidden;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    border: 2px solid transparent;
  }
  
  .journalit-trade-view .thumbnail:hover {
    opacity: 1;
  }
  
  .journalit-trade-view .thumbnail.active {
    opacity: 1;
    border-color: var (--color-primary, var(--interactive-accent));
  }
  
  .journalit-trade-view .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  
  @media (max-width: 900px) {
    .trade-metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .details-table {
      table-layout: auto;
    }

    .details-table td:nth-child(odd) {
      width: auto;
      min-width: 100px;
    }

    .details-table td:nth-child(even) {
      width: auto;
    }
  }

  @media (max-width: 768px) {
    .trade-note-content {
      padding: 0;
      gap: 0.6rem;
    }

    .trade-custom-fields-row {
      grid-template-columns: 1fr;
      row-gap: 0.7rem;
    }

    .trade-custom-field-item--inline {
      grid-template-columns: minmax(90px, auto) minmax(0, 1fr);
      column-gap: 0.7rem;
    }
    
    .tags-row {
      flex-direction: column;
      gap: 0.8rem;
    }

    .details-table {
      display: block;
      overflow-x: auto;
    }
    
    .details-table td {
      padding: 0.5rem 0.3rem;
      word-break: break-word;
    }

    .thesis-section {
      padding: 0.8rem;
    }

    .thesis-section h4 {
      font-size: 0.9rem;
      margin-bottom: 0.7rem;
    }

    .thesis-content {
      font-size: 0.85rem;
      line-height: 1.5;
    }
  }

  @media (max-width: 480px) {
    .trade-metrics-grid {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .metadata-section {
      flex-direction: column;
      align-items: flex-start;
    }

    .setup-section h4::before,
    .mistake-section h4::before {
      display: none; 
    }
  }
  
  
  .trade-navigation-container {
    display: flex;
    flex-direction: column;
    padding: 0.2rem 0.8rem 0.6rem 0.8rem; 
    background-color: var(--background-secondary);
    border-bottom: 1px solid var(--background-modifier-border);
  }
  
  
  .trade-navigation-with-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.8rem;
    border-bottom: 1px solid var(--background-modifier-border);
    padding-bottom: 0.8rem;
  }
  
  
  .edit-button-container {
    display: flex;
    align-items: center;
    height: auto;
    padding-top: 0;
  }
  
  
  .trade-timeline-container {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 0.3rem; 
  }
  
  .trade-timeline {
    display: flex;
    align-items: center;
  }
  
  .timeline-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-normal);
    margin-right: 0.8rem;
    white-space: nowrap;
    min-width: 70px;
  }
  
  .timeline-label.active-ticker {
    font-weight: 600;
    color: var(--interactive-accent);
  }
  
  .timeline-items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  
  .timeline-item {
    padding: 0.3rem 0.6rem;
    background-color: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .timeline-item:hover {
    background-color: var(--background-modifier-hover);
    color: var(--text-normal);
  }
  
  
  .timeline-item.profit {
    background-color: rgba(102, 187, 106, 0.15);
    color: var(--color-success, #43a047);
    border-color: rgba(102, 187, 106, 0.3);
  }
  
  .timeline-item.loss {
    background-color: rgba(229, 57, 53, 0.15);
    color: var(--color-error, #e53935);
    border-color: rgba(229, 57, 53, 0.3);
  }
  
  .timeline-item.open {
    background-color: rgba(33, 150, 243, 0.15);
    color: var(--color-info, #2196f3);
    border-color: rgba(33, 150, 243, 0.3);
  }
  
  .timeline-item.profit:hover {
    background-color: rgba(102, 187, 106, 0.25);
  }
  
  .timeline-item.loss:hover {
    background-color: rgba(229, 57, 53, 0.25);
  }
  
  .timeline-item.open:hover {
    background-color: rgba(33, 150, 243, 0.25);
  }
  
  
  .timeline-item.backtest-trade {
    background-color: rgba(138, 43, 226, 0.15);
    color: var(--color-purple, #8a2be2);
    border-color: rgba(138, 43, 226, 0.3);
    font-weight: 500;
  }

  .timeline-item.backtest-trade:hover {
    background-color: rgba(138, 43, 226, 0.25);
    transform: translateY(-1px);
  }

  .timeline-item.backtest-trade.active {
    border: 2px solid var(--color-purple, #8a2be2);
    background-color: rgba(138, 43, 226, 0.2);
    font-weight: 600;
  }
  
  
  .timeline-item.active {
    border: 2px solid var(--interactive-accent);
    font-weight: 600;
  }
  
  .timeline-item.active.profit {
    border-color: var(--interactive-accent);
  }
  
  .timeline-item.active.loss {
    border-color: var(--interactive-accent);
  }
  
  
  .trade-review-navigation {
    flex: 1;
    margin-bottom: 0;
    margin-right: 0.8rem;
  }
  
  
  .trade-nav-edit-button {
    width: auto;
    min-width: 36px;
    border-radius: 4px;
    border: 1px solid var(--interactive-accent);
    background-color: var(--interactive-accent);
    color: var(--text-on-accent, white);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
    padding: 6px 8px; 
    margin: 0;
    box-sizing: border-box;
    font-size: 14px; 
    line-height: 1.15; 
  }
  
  .trade-nav-edit-button:hover {
    background-color: var(--interactive-accent-hover, var(--interactive-accent));
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  .trade-nav-edit-button svg {
    width: 14px;
    height: 14px;
  }
  
  .journalit-trade-view .trade-review-navigation-links,
  .journalit-missed-trade-view .trade-review-navigation-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    width: 100%;
  }
  
  .journalit-trade-view .trade-review-navigation-button,
  .journalit-missed-trade-view .trade-review-navigation-button {
    flex: 1;
    min-width: 120px;
    text-align: center;
    padding: 8px 14px;
    font-size: 14px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .journalit-trade-view .trade-review-navigation-button:hover,
  .journalit-missed-trade-view .trade-review-navigation-button:hover {
    background-color: var(--background-modifier-hover);
    transform: translateY(-1px);
  }

  .journalit-trade-view .trade-review-navigation-button:disabled,
  .journalit-missed-trade-view .trade-review-navigation-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  
  .workspace-split.mod-vertical .journalit-trade-view {
    
    max-width: 100%;
    flex-shrink: 1;
  }
  
  
  .workspace-leaf-content .journalit-trade-view .trade-metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  
  .workspace-leaf-content .journalit-trade-view .trade-note-tabs {
    flex-wrap: wrap;
  }
  
  
  .workspace-leaf-content .journalit-trade-view .trade-note-container {
    min-width: 0;
  }
  
  
  @media (max-width: 576px) {
    .trade-timeline {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 0.6rem;
    }
    
    .timeline-label {
      margin-bottom: 0.4rem;
      margin-right: 0;
      font-weight: 600;
    }
    
    .trade-timeline-container {
      gap: 1rem;
    }
    
    
    .trade-navigation-with-edit {
      align-items: center;
    }
    
    .edit-button-container {
      padding-top: 0;
    }
    
    .trade-nav-edit-button {
      padding: 5px 6px; 
      min-width: 32px;
    }
    
    .trade-nav-edit-button svg {
      width: 16px;
      height: 16px;
    }
  }

  
  
  
  .trade-review-container,
  .loss-review-container {
    margin-top: 2rem;
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 1.5rem;
  }

  .trade-review-accordion,
  .loss-review-accordion {
    background: var(--background-secondary);
    border-radius: 8px;
    overflow: hidden;
  }

  
  .trade-review-sections,
  .loss-review-sections {
    padding: 1.5rem;
  }

  .trade-review-section,
  .loss-review-section {
    margin-bottom: 1.5rem;
  }

  .trade-review-section:last-child,
  .loss-review-section:last-child {
    margin-bottom: 0;
  }

  
  .trade-review-header h3,
  .loss-review-header h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-normal);
  }

  .trade-review-content,
  .loss-review-content {
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .trade-review-content p,
  .loss-review-content p {
    margin: 0.5rem 0;
  }

  
  .trade-review-checkbox,
  .trade-review-checkbox-list,
  .loss-review-checkbox,
  .loss-review-checkbox-list {
    margin: 0.5rem 0;
  }

  .trade-review-checkbox-list h3,
  .loss-review-checkbox-list h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .checkbox-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-label input[type="checkbox"] {
    margin-top: 0.25rem;
    cursor: pointer;
    flex-shrink: 0;
  }

  .checkbox-label span {
    flex: 1;
    line-height: 1.5;
  }

  .checkbox-label span strong {
    color: var(--text-normal);
  }

  
  .trade-review-textarea h3,
  .loss-review-textarea h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .trade-review-textarea-input,
  .loss-review-textarea-input {
    width: 100%;
    min-height: 100px;
    padding: 0.75rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
    color: var(--text-normal);
    font-family: inherit;
    font-size: 16px;
    line-height: 1.5;
    resize: vertical;
    transition: border-color 0.15s ease;
  }

  .trade-review-textarea-input:focus,
  .loss-review-textarea-input:focus {
    outline: none;
    border-color: var(--interactive-accent);
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2);
  }

  .trade-review-textarea-input::placeholder,
  .loss-review-textarea-input::placeholder {
    color: var(--text-muted);
    opacity: 0.7;
  }

  
  .trade-review-footer,
  .loss-review-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--background-modifier-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .reviewed-timestamp {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  
  @media (max-width: 768px) {
    .trade-review-sections,
    .loss-review-sections {
      padding: 1rem;
    }

    .trade-review-footer,
    .loss-review-footer {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
  }

  
  .theme-dark .journalit-trade-view .trade-review-textarea-input,
  .theme-dark .journalit-trade-view .loss-review-textarea-input {
    background: var(--background-secondary-alt);
  }

  .theme-dark .journalit-trade-view .trade-review-accordion,
  .theme-dark .journalit-trade-view .loss-review-accordion {
    background: var(--background-secondary-alt);
  }

  
  .trade-review-container .cmdr-accordion,
  .loss-review-container .cmdr-accordion {
    margin-bottom: 16px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    overflow: hidden;
    transition: box-shadow 0.2s ease;
  }

  .trade-review-container .cmdr-accordion:hover,
  .loss-review-container .cmdr-accordion:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .trade-review-container .cmdr-accordion .cmdr-accordion-header,
  .loss-review-container .cmdr-accordion .cmdr-accordion-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
    padding: 12px 16px;
    cursor: pointer;
    background-color: var(--background-secondary);
    transition: background-color 0.15s ease;
  }

  .trade-review-container .cmdr-accordion .cmdr-accordion-header:hover,
  .loss-review-container .cmdr-accordion .cmdr-accordion-header:hover {
    background-color: var(--background-modifier-hover);
  }

  .trade-review-container .cmdr-accordion .cmdr-accordion-chevron > svg,
  .loss-review-container .cmdr-accordion .cmdr-accordion-chevron > svg {
    transition: transform 0.3s ease-in-out;
  }

  .trade-review-container .cmdr-accordion .cmdr-accordion-content,
  .loss-review-container .cmdr-accordion .cmdr-accordion-content {
    max-height: 5000px;
    transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out, margin 0.3s ease-in-out;
    overflow: hidden;
    background-color: var(--background-primary);
    padding: 16px;
  }

  
  .trade-review-container .cmdr-accordion[aria-expanded="false"] .cmdr-accordion-chevron > svg,
  .loss-review-container .cmdr-accordion[aria-expanded="false"] .cmdr-accordion-chevron > svg {
    transform: rotate(-90deg);
  }

  .trade-review-container .cmdr-accordion[aria-expanded="false"] .cmdr-accordion-content,
  .loss-review-container .cmdr-accordion[aria-expanded="false"] .cmdr-accordion-content {
    max-height: 0 !important;
    transition: max-height 0.2s ease-out;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    overflow: hidden;
  }

  
  @media (max-width: 600px) {
    .journalit-trade-view .trade-review-textarea-input,
    .journalit-trade-view .loss-review-textarea-input {
      font-size: 18px !important;
    }
  }

  
  .theme-light .journalit-trade-view .trade-note-header.open {
    background: linear-gradient(to right, rgba(33, 150, 243, 0.2), var(--background-primary));
  }

  .theme-light .journalit-trade-view .trade-note-header.profit {
    background: linear-gradient(to right, rgba(var(--color-green-rgb), 0.2), var(--background-primary));
  }

  .theme-light .journalit-trade-view .trade-note-header.loss {
    background: linear-gradient(to right, rgba(var(--color-red-rgb), 0.2), var(--background-primary));
  }

  .theme-light .journalit-trade-view .trade-note-header.breakeven {
    background: linear-gradient(to right, rgba(128, 128, 128, 0.15), var(--background-primary));
  }

  .theme-light .journalit-trade-view .open-trade-badge {
    background-color: rgba(33, 150, 243, 0.15);
    color: #1976d2;
    border: 1px solid rgba(33, 150, 243, 0.3);
  }
`;


function injectTradeNoteStyles(): void {
  return;
}


export function ensureTradeNoteStyles(): void {}
