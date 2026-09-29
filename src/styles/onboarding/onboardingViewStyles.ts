

export const ONBOARDING_VIEW_STYLES = `
  
  .journalit-onboarding-view-container button,
  .journalit-onboarding-view-container .feature-card,
  .journalit-onboarding-view-container .skip-button,
  .journalit-onboarding-view-container .skip-activation-button,
  .journalit-onboarding-view-container .link-button,
  .journalit-onboarding-view-container .upgrade-button,
  .journalit-onboarding-view-container .resource-button {
    cursor: pointer !important;
  }

  
  
  .theme-light .journalit-onboarding-view-container,
  .theme-dark .journalit-onboarding-view-container {
    background-image: none !important;
  }

  
  .journalit-onboarding-view-container .onboarding-link-fallback {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
  }

  .journalit-onboarding-view-container .onboarding-link-fallback .onboarding-link-fallback-url {
    flex: 1;
    min-width: 0;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    padding: 6px 10px;
    color: var(--text-accent);
    text-decoration: underline;
    text-align: left;
    font-size: 12px;
    line-height: 1.2;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-shadow: none;
  }

  .journalit-onboarding-view-container .onboarding-link-fallback-copy {
    flex: 0 0 auto;
  }

  
  .theme-light .journalit-onboarding-view-container .feature-card {
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .theme-light .journalit-onboarding-view-container .feature-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }

  .theme-light .journalit-onboarding-view-container .next-steps-card {
    border-color: rgba(0, 0, 0, 0.12);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .theme-light .journalit-onboarding-view-container .next-step-item {
    border-color: rgba(0, 0, 0, 0.1);
  }

  .theme-light .journalit-onboarding-view-container .upgrade-callout {
    border-color: rgba(255, 165, 0, 0.4);
    box-shadow: 0 2px 8px rgba(255, 165, 0, 0.1);
  }

  .theme-light .journalit-onboarding-view-container .success-glow {
    background: radial-gradient(circle, rgba(76, 175, 80, 0.25) 0%, transparent 70%);
  }

  .theme-light .journalit-onboarding-view-container .activation-graphic-glow {
    background: radial-gradient(circle, rgba(109, 120, 172, 0.2) 0%, transparent 70%);
  }

  .theme-light .journalit-onboarding-view-container .graphic-placeholder {
    opacity: 0.4;
  }

  .theme-light .journalit-onboarding-view-container .success-checkmark-large {
    opacity: 0.5;
  }

  .theme-light .journalit-onboarding-view-container .device-code-box {
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .theme-light .journalit-onboarding-view-container .feature-checkbox {
    border-color: rgba(0, 0, 0, 0.2);
  }

  .theme-light .journalit-onboarding-view-container .activation-success-header {
    background: linear-gradient(135deg,
      rgba(76, 175, 80, 0.15) 0%,
      rgba(76, 175, 80, 0.08) 100%);
    border-color: rgba(76, 175, 80, 0.4);
  }

  .theme-light .journalit-onboarding-view-container .trade-card-mini {
    border-color: rgba(0, 0, 0, 0.12);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .theme-light .journalit-onboarding-view-container .step-number {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .theme-light .journalit-onboarding-view-container .coming-soon-badge {
    background: rgba(0, 0, 0, 0.08);
    color: var(--text-muted);
  }

  .theme-light .journalit-onboarding-view-container .resource-button {
    border-color: rgba(0, 0, 0, 0.15);
  }

  .theme-light .journalit-onboarding-view-container .resource-button:hover {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.2);
  }

  .theme-light .journalit-onboarding-view-container .success-resources {
    border-color: rgba(0, 0, 0, 0.1);
  }

  .journalit-onboarding-view-container {
    width: 100%;
    height: 100%;
    overflow: hidden !important;
    padding: 0;
    background-color: var(--background-primary);
    background-size: 20px 20px !important;
    background-position: 0 0 !important;

    
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  
  .journalit-onboarding-view-container .view-header {
    flex: 0 0 auto;
  }

  .journalit-onboarding-view-container .journalit-react-view-root {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .journalit-onboarding-view-container .journalit-onboarding-container {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    container-type: inline-size;

    
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
  }

  
  .journalit-onboarding-view-container .welcome-step-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100%;
    padding: 0;
    position: relative;
  }

  .journalit-onboarding-view-container .welcome-content {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 6rem;
    align-items: center;
    max-width: 1400px;
    width: 100%;
  }

  .journalit-onboarding-view-container .welcome-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    padding: 2rem;
    background: transparent;
    border-radius: 0;
  }

  .journalit-onboarding-view-container .welcome-left h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-normal);
    margin: 0;
    line-height: 1.2;
  }

  .journalit-onboarding-view-container .welcome-subtitle {
    font-size: 1rem;
    color: var(--text-normal);
    line-height: 1.6;
    margin: 0;
  }

  .journalit-onboarding-view-container .welcome-right {
    display: flex;
    flex-direction: column;
    height: 500px;
    padding: 2rem;
    background: transparent;
    border-radius: 0;
    border: none;
  }

  .journalit-onboarding-view-container .chart-container {
    flex: 1;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .journalit-onboarding-view-container .chart-container canvas {
    max-width: 100%;
    max-height: 100%;
  }

  .journalit-onboarding-view-container .welcome-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .journalit-onboarding-view-container .welcome-actions button {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-weight: 500;
  }

  .journalit-onboarding-view-container .welcome-actions button:first-child {
    background: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-onboarding-view-container .welcome-actions button:first-child:hover {
    background: var(--interactive-accent-hover);
    color: var(--text-on-accent);
    transform: translateY(-1px);
  }

  .journalit-onboarding-view-container .welcome-step-container .skip-button {
    position: absolute !important;
    bottom: 2rem;
    right: 2rem;
    padding: 0.5rem 1rem;
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: auto;
  }

  .journalit-onboarding-view-container .welcome-step-container .skip-button:hover {
    background: var(--background-secondary);
    color: var(--text-normal);
  }

  
  .journalit-onboarding-view-container .feature-selection-step {
    display: flex;
    flex-direction: column;
    padding: 2rem;

    
    min-height: 100%;

    justify-content: center;
  }

  .journalit-onboarding-view-container .feature-content-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10rem;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  .journalit-onboarding-view-container .feature-left {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .journalit-onboarding-view-container .step-header {
    margin-bottom: 1rem;
    text-align: center;
  }

  .journalit-onboarding-view-container .step-header h2 {
    font-size: 1.75rem;
    font-weight: 500;
    color: var(--text-normal);
    margin: 0;
    line-height: 1.4;
  }

  .journalit-onboarding-view-container .step-subtitle {
    margin: 0.35rem 0 0;
    font-size: 0.95rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .journalit-onboarding-view-container .feature-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .journalit-onboarding-view-container .feature-section-header {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .journalit-onboarding-view-container .feature-section-title {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
  }

  .journalit-onboarding-view-container .feature-section-subtitle {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .journalit-onboarding-view-container .features-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .journalit-onboarding-view-container .explore-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .journalit-onboarding-view-container .feature-card {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: var(--background-secondary);
    border: 2px solid var(--background-modifier-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .journalit-onboarding-view-container .feature-card:hover {
    border-color: var(--interactive-accent);
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .journalit-onboarding-view-container .journalit-onboarding-choice-card {
    width: 100%;
    height: auto;
    min-height: 72px;
    color: var(--text-normal);
    font: inherit;
    text-align: left;
    white-space: normal;
  }

  .journalit-onboarding-view-container .journalit-onboarding-choice-card:disabled {
    cursor: wait;
    opacity: 0.65;
    transform: none;
  }

  .journalit-onboarding-view-container .onboarding-choice-arrow {
    flex: 0 0 auto;
    color: var(--text-muted);
    font-size: 1.15rem;
    line-height: 1;
    transition: transform 0.2s ease, color 0.2s ease;
  }

  .journalit-onboarding-view-container .journalit-onboarding-choice-card:hover .onboarding-choice-arrow {
    color: var(--text-accent);
    transform: translateX(2px);
  }

  .journalit-onboarding-view-container .feature-card.static {
    cursor: default;
  }

  .journalit-onboarding-view-container .feature-card.static:hover {
    border-color: var(--background-modifier-border);
    transform: none;
    box-shadow: none;
  }

  .journalit-onboarding-view-container .feature-card.selected {
    border-color: var(--interactive-accent);
    background: var(--background-primary);
    box-shadow: 0 0 0 1px var(--interactive-accent);
  }

  .journalit-onboarding-view-container .feature-card.explore-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1.25rem;
    min-height: 180px;
  }

  .journalit-onboarding-view-container .explore-card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  .journalit-onboarding-view-container .explore-card-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-accent);
  }

  .journalit-onboarding-view-container .explore-card-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-normal);
    flex: 1;
  }

  .journalit-onboarding-view-container .explore-card-description {
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .journalit-onboarding-view-container .explore-card-actions {
    margin-top: auto;
  }

  .journalit-onboarding-view-container .feature-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .journalit-onboarding-view-container .feature-card.selected .feature-checkbox {
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    border-color: var(--interactive-accent);
  }

  .journalit-onboarding-view-container .checkmark {
    display: none;
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  .journalit-onboarding-view-container .feature-card.selected .checkmark {
    display: block;
  }

  .journalit-onboarding-view-container .feature-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .journalit-onboarding-view-container .feature-label {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-normal);
    margin: 0;
    line-height: 1.4;
  }

  .journalit-onboarding-view-container .feature-description {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.4;
    margin: 0;
  }

  .journalit-onboarding-view-container .premium-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: var(--background-primary);
    color: var(--text-accent);
    border: 1px solid var(--text-accent);
    box-shadow: none;
    font-size: 0.7rem;
    font-weight: 600;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;
  }

  .journalit-onboarding-view-container .coming-soon-badge {
    display: flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    background: var(--background-modifier-border);
    color: var(--text-muted);
    font-size: 0.7rem;
    font-weight: 600;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;
  }

  .journalit-onboarding-view-container .feature-card.disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
  }

  .journalit-onboarding-view-container .feature-card.disabled:hover {
    border-color: var(--background-modifier-border) !important;
    transform: none !important;
    box-shadow: none !important;
  }

  .journalit-onboarding-view-container .feature-card.disabled .feature-checkbox {
    opacity: 0.5;
  }

  .journalit-onboarding-view-container .feature-right {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .journalit-onboarding-view-container .feature-graphic {
    width: 100%;
    max-width: 600px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-onboarding-view-container .explore-kicker {
    font-size: 0.8rem;
    font-weight: 650;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-accent);
    margin-bottom: 0.5rem;
  }

  .journalit-onboarding-view-container .explore-step .feature-content-wrapper {
    gap: 6rem;
  }

  .journalit-onboarding-view-container .step-header.explore-header {
    margin-bottom: 0.75rem;
    text-align: left;
  }

  .journalit-onboarding-view-container .explore-step .step-header h2 {
    font-size: 2.25rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.2;
  }

  .journalit-onboarding-view-container .explore-step .step-subtitle {
    font-size: 1.05rem;
    line-height: 1.7;
    max-width: 56ch;
  }

  .journalit-onboarding-view-container .explore-step .step-header .step-subtitle {
    margin-top: 0.6rem;
  }

  .journalit-onboarding-view-container .explore-step .step-header .step-subtitle.explore-tagline {
    margin-top: 0.85rem;
    font-weight: 600;
    color: var(--text-normal);
  }

  .journalit-onboarding-view-container .explore-step .step-actions {
    justify-content: flex-start;
    margin-top: 1.5rem;
  }

  .journalit-onboarding-view-container .choose-path-step .feature-content-wrapper {
    gap: 6rem;
  }

  .journalit-onboarding-view-container .choose-path-step .step-header h2 {
    font-size: 2.25rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.2;
  }

  .journalit-onboarding-view-container .choose-path-step .step-subtitle {
    font-size: 1.05rem;
    line-height: 1.7;
    max-width: 56ch;
  }

  .journalit-onboarding-view-container .choose-path-step .step-header .step-subtitle {
    margin-top: 0.6rem;
  }

  .journalit-onboarding-view-container .choose-path-step .step-actions {
    justify-content: flex-start;
    margin-top: 0.9rem;
  }

  .journalit-onboarding-view-container .journalit-onboarding-progress {
    width: min(100%, 460px);
    margin: 28px auto 0;
    text-align: left;
  }

  .journalit-onboarding-view-container .journalit-onboarding-progress__track {
    position: relative;
    height: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: var(--background-modifier-border);
  }

  .journalit-onboarding-view-container .journalit-onboarding-progress__fill {
    height: 100%;
    width: calc(var(--journalit-progress, 0) * 100%);
    border-radius: inherit;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    transition: width 180ms ease-out;
  }

  .journalit-onboarding-view-container
    .journalit-onboarding-progress__track--indeterminate
    .journalit-onboarding-progress__fill {
    position: absolute;
    width: 35%;
    animation: journalit-onboarding-progress-slide 1.2s ease-in-out infinite;
  }

  @keyframes journalit-onboarding-progress-slide {
    from {
      left: -35%;
    }
    to {
      left: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .journalit-onboarding-view-container .broker-request-panel {
      animation: none;
    }
    .journalit-onboarding-view-container
      .journalit-onboarding-progress__track--indeterminate
      .journalit-onboarding-progress__fill {
      animation: none;
      left: 0;
      width: 100%;
      opacity: 0.6;
    }
  }

  .journalit-onboarding-view-container .journalit-onboarding-progress__meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 10px;
    color: var(--text-muted);
    font-size: 13px;
  }

  .journalit-onboarding-view-container
    .journalit-onboarding-progress__meta
    strong {
    color: var(--text-normal);
    font-variant-numeric: tabular-nums;
  }

  .journalit-onboarding-view-container .journalit-onboarding-progress__hint {
    margin: 14px 0 0;
    color: var(--text-faint);
    font-size: 12px;
  }

  .journalit-onboarding-view-container .manual-entry-step {
    min-height: 100%;
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-onboarding-view-container .manual-entry-content {
    width: min(880px, 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    text-align: center;
  }

  .journalit-onboarding-view-container .manual-entry-header h1 {
    margin: 0;
    font-size: 2.6rem;
    font-weight: 650;
    letter-spacing: -0.02em;
    color: var(--text-normal);
  }

  .journalit-onboarding-view-container .manual-entry-header p {
    margin: 0.65rem 0 0;
    color: var(--text-muted);
    font-size: 1rem;
    line-height: 1.6;
  }

  .journalit-onboarding-view-container .manual-entry-hero {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    width: 100%;
  }

  .journalit-onboarding-view-container .manual-entry-glow {
    position: absolute;
    width: 420px;
    height: 240px;
    border-radius: 50%;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    opacity: 0.08;
    filter: blur(48px);
    pointer-events: none;
  }

  .journalit-onboarding-view-container .manual-entry-hint {
    position: relative;
    margin: 0;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .journalit-onboarding-view-container .manual-entry-hotkey-keys {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.85rem;
    flex-wrap: wrap;
  }

  .journalit-onboarding-view-container .manual-entry-hotkey-key {
    min-width: 64px;
    padding: 0.95rem 1.35rem;
    border-radius: 14px;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    box-shadow:
      0 10px 28px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    color: var(--text-normal);
    font-size: 1.05rem;
    font-weight: 600;
    text-align: center;
  }

  .journalit-onboarding-view-container .manual-entry-hotkey-plus {
    color: var(--text-muted);
    font-size: 0.95rem;
    font-weight: 700;
  }

  .journalit-onboarding-view-container .manual-entry-change-hotkey {
    color: var(--text-accent);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .journalit-onboarding-view-container .manual-entry-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .journalit-onboarding-view-container .manual-entry-actions button {
    padding: 0.7rem 1.5rem;
    min-width: 110px;
    font-size: 0.95rem;
  }

  .journalit-onboarding-view-container .awaiting-step-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .journalit-onboarding-view-container .awaiting-step-actions .journalit-button {
    width: min(100%, 18rem);
  }

  .journalit-onboarding-view-container .preparing-sample-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .journalit-onboarding-view-container .explore-step .button-icon-left {
    margin-right: 8px;
  }


  .journalit-onboarding-view-container .explore-feature-grid {
    width: 100%;
    max-width: 760px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
    gap: 0.9rem;
  }

  .journalit-onboarding-view-container .feature-card.explore-feature-tile {
    align-items: flex-start;
    padding: 1rem;
  }

  .journalit-onboarding-view-container .explore-feature-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-accent);
    flex-shrink: 0;
  }

  .journalit-onboarding-view-container .explore-feature-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .journalit-onboarding-view-container .explore-feature-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-normal);
    line-height: 1.35;
  }

  .journalit-onboarding-view-container .explore-feature-description {
    font-size: 0.82rem;
    color: var(--text-muted);
    line-height: 1.45;
  }

  @container (max-width: 1200px) {
    .journalit-onboarding-view-container .explore-step .feature-content-wrapper {
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: stretch;
      max-width: 760px;
    }

    .journalit-onboarding-view-container .explore-step .feature-left {
      max-width: 100%;
    }

    .journalit-onboarding-view-container .explore-step .step-header h2 {
      font-size: clamp(1.75rem, 6cqw, 2.25rem);
    }

    .journalit-onboarding-view-container .explore-step .step-subtitle {
      font-size: 1rem;
      line-height: 1.6;
    }

    .journalit-onboarding-view-container .explore-right {
      width: 100%;
    }

    .journalit-onboarding-view-container .explore-feature-grid {
      max-width: none;
    }
  }


  .journalit-onboarding-view-container .graphic-placeholder {
    color: var(--text-muted);
    opacity: 0.3;
  }

  
  .journalit-onboarding-view-container .syncing-trades-graphic {
    width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .journalit-onboarding-view-container .sync-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--background-primary);
    border-radius: 8px;
    border: 1px solid var(--background-modifier-border);
  }

  .journalit-onboarding-view-container .sync-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-accent);
    transition: transform 0.3s ease;
  }

  .journalit-onboarding-view-container .sync-icon.syncing {
    animation: journalit-spin 2s linear infinite;
  }

  .journalit-onboarding-view-container .sync-icon.complete {
    color: var(--color-green);
  }

  .journalit-onboarding-view-container .sync-status {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-normal);
  }

  .journalit-onboarding-view-container .trade-cards-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .journalit-onboarding-view-container .trade-card-mini {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    transition-delay: var(--journalit-sync-card-delay, 0ms);
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    padding: 0.875rem;
  }

  .journalit-onboarding-view-container .trade-card-mini.reduced-motion {
    transition: none;
    transition-delay: 0ms;
  }

  .journalit-onboarding-view-container .trade-card-mini.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .journalit-onboarding-view-container .trade-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .journalit-onboarding-view-container .trade-ticker {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-normal);
  }

  .journalit-onboarding-view-container .trade-direction {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .journalit-onboarding-view-container .trade-direction.long {
    background: rgba(76, 175, 80, 0.15);
    color: var(--color-green);
  }

  .journalit-onboarding-view-container .trade-direction.short {
    background: rgba(244, 67, 54, 0.15);
    color: var(--color-red);
  }

  .journalit-onboarding-view-container .trade-card-body {
    display: flex;
    flex-direction: column;
  }

  .journalit-onboarding-view-container .trade-pnl-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .journalit-onboarding-view-container .trade-pnl {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .journalit-onboarding-view-container .trade-pnl.win {
    color: var(--color-green);
  }

  .journalit-onboarding-view-container .trade-pnl.loss {
    color: var(--color-red);
  }

  .journalit-onboarding-view-container .trade-status-badge {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .journalit-onboarding-view-container .trade-status-badge.win {
    background: rgba(76, 175, 80, 0.15);
    color: var(--color-green);
  }

  .journalit-onboarding-view-container .trade-status-badge.loss {
    background: rgba(244, 67, 54, 0.15);
    color: var(--color-red);
  }

  .journalit-onboarding-view-container .trial-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    color: var(--text-muted);
    font-size: 0.875rem;
  }

  .journalit-onboarding-view-container .step-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }

  .journalit-onboarding-view-container .step-actions button {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-weight: 500;
  }

  .journalit-onboarding-view-container .step-actions button:first-child {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--background-modifier-border);
  }

  .journalit-onboarding-view-container .step-actions button:first-child:hover {
    background: var(--background-secondary);
    color: var(--text-normal);
  }

  .journalit-onboarding-view-container .step-actions button:last-child {
    background: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  
  .journalit-onboarding-view-container .step-actions button:last-child:only-child {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--background-modifier-border);
  }

  .journalit-onboarding-view-container .step-actions button:last-child:only-child:hover {
    background: var(--background-secondary);
    color: var(--text-normal);
    transform: none;
  }

  .journalit-onboarding-view-container .step-actions button:last-child:hover {
    background: var(--interactive-accent-hover);
    color: var(--text-on-accent);
    transform: translateY(-1px);
  }

  .journalit-onboarding-view-container .step-actions button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
    transform: none;
  }

  
  .journalit-onboarding-view-container .create-account-step {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    min-height: 500px;
  }

  .journalit-onboarding-view-container .auth-container {
    max-width: 500px;
    margin: 2rem auto;
    width: 100%;
  }

  
  .journalit-onboarding-view-container .success-step-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    padding: 2rem;
    animation: journalit-onboarding-fade-in-up 0.4s ease-out 0.1s both;
  }

  .journalit-onboarding-view-container .success-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
    max-width: 1400px;
    width: 100%;
  }

  .journalit-onboarding-view-container .success-left {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .journalit-onboarding-view-container .success-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }

  .journalit-onboarding-view-container .success-icon-wrapper {
    position: relative;
    color: var(--color-green);
    animation: journalit-onboarding-scale-in 0.5s ease-out 0.2s both;
  }

  .journalit-onboarding-view-container .success-sparkle {
    position: absolute;
    top: -8px;
    right: -8px;
    color: var(--text-accent);
    animation: journalit-onboarding-sparkle 2s ease-in-out infinite;
  }

  .journalit-onboarding-view-container .success-header h1 {
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--text-normal);
    margin: 0;
    line-height: 1.2;
  }

  .journalit-onboarding-view-container .success-subtitle {
    font-size: 1.125rem;
    color: var(--text-muted);
    line-height: 1.6;
    margin: 0;
  }

  .journalit-onboarding-view-container .next-steps-card {
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .journalit-onboarding-view-container .next-steps-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-onboarding-view-container .next-steps-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-normal);
    margin: 0;
  }

  .journalit-onboarding-view-container .steps-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .journalit-onboarding-view-container .next-steps-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .journalit-onboarding-view-container .next-step-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
  }

  .journalit-onboarding-view-container .step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    border-radius: 50%;
    font-size: 0.875rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  .journalit-onboarding-view-container .step-text {
    flex: 1;
    font-size: 0.95rem;
    color: var(--text-normal);
    line-height: 1.5;
  }

  .journalit-onboarding-view-container .step-arrow {
    color: var(--text-muted);
    opacity: 0.3;
    flex-shrink: 0;
  }

  .journalit-onboarding-view-container .upgrade-callout {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.25rem 1.5rem;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 215, 0, 0.02) 100%);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 12px;
  }

  .journalit-onboarding-view-container .upgrade-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }

  .journalit-onboarding-view-container .upgrade-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    border-radius: 50%;
    flex-shrink: 0;
  }

  .journalit-onboarding-view-container .upgrade-content {
    flex: 1;
  }

  .journalit-onboarding-view-container .upgrade-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-normal);
    margin: 0 0 0.25rem 0;
  }

  .journalit-onboarding-view-container .upgrade-description {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.4;
    margin: 0;
  }

  .journalit-onboarding-view-container .upgrade-button {
    padding: 0.75rem 1.75rem;
    font-size: 0.9rem;
    font-weight: 600;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    border: none;
    border-radius: 8px;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .journalit-onboarding-view-container .upgrade-button:hover {
    background: var(--interactive-accent-hover);
    color: var(--text-on-accent);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .journalit-onboarding-view-container .success-actions {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

  .journalit-onboarding-view-container .success-actions button {
    padding: 1rem 2.5rem;
    font-size: 1.125rem;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  .journalit-onboarding-view-container .success-actions button:hover {
    background: var(--interactive-accent-hover);
    color: var(--text-on-accent);
    transform: translateY(-1px);
  }

  .journalit-onboarding-view-container .success-resources {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-onboarding-view-container .resources-label {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0;
  }

  .journalit-onboarding-view-container .resource-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .journalit-onboarding-view-container .resource-button {
    background: var(--background-secondary);
    color: var(--text-muted);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .journalit-onboarding-view-container .resource-button:hover {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
    border-color: var(--background-modifier-border-hover);
  }

  .journalit-onboarding-view-container .resource-button-icon {
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-onboarding-view-container .success-right {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .journalit-onboarding-view-container .success-visual {
    position: relative;
    width: 500px;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-onboarding-view-container .success-glow {
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(76, 175, 80, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    animation: journalit-onboarding-pulse 3s ease-in-out infinite;
  }

  .journalit-onboarding-view-container .success-checkmark-large {
    position: relative;
    color: var(--color-green);
    opacity: 0.6;
  }

  
  @media (max-height: 800px), (max-width: 1024px) {
    .journalit-onboarding-view-container .journalit-onboarding-container {
      overflow-y: auto;
      overflow-x: hidden;
    }

    
    .journalit-onboarding-view-container .journalit-onboarding-container::-webkit-scrollbar {
      width: 8px;
    }

    .journalit-onboarding-view-container .journalit-onboarding-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .journalit-onboarding-view-container .journalit-onboarding-container::-webkit-scrollbar-thumb {
      background: var(--background-modifier-border);
      border-radius: 4px;
    }

    .journalit-onboarding-view-container .journalit-onboarding-container::-webkit-scrollbar-thumb:hover {
      background: var(--background-modifier-border-hover);
    }

    
    .journalit-onboarding-view-container .welcome-step-container,
    .journalit-onboarding-view-container .success-step-container,
    .journalit-onboarding-view-container .device-activation-step {
      padding: 2rem 1rem;
    }

    .journalit-onboarding-view-container .feature-selection-step {
      padding: 2rem 1rem;
      min-height: auto;

      
      justify-content: flex-start;
    }
  }

  
  @media (max-width: 1024px) and (min-width: 769px) {
    .journalit-onboarding-view-container .feature-content-wrapper,
    .journalit-onboarding-view-container .welcome-content,
    .journalit-onboarding-view-container .success-content,
    .journalit-onboarding-view-container .activation-content {
      gap: 3rem;
    }

    .journalit-onboarding-view-container .feature-graphic,
    .journalit-onboarding-view-container .welcome-right,
    .journalit-onboarding-view-container .success-right,
    .journalit-onboarding-view-container .activation-right {
      max-width: 400px;
    }

    .journalit-onboarding-view-container .welcome-left h1,
    .journalit-onboarding-view-container .success-header h1,
    .journalit-onboarding-view-container .activation-left h2 {
      font-size: 2rem;
    }

    .journalit-onboarding-view-container .step-header h2 {
      font-size: 1.5rem;
    }
  }

  
  @media (max-width: 768px) {
    .journalit-onboarding-view-container {
      padding: 0;
    }

    .journalit-onboarding-view-container .journalit-onboarding-container {
      padding: 0;
    }

    
    .journalit-onboarding-view-container .welcome-content {
      grid-template-columns: 1fr !important;
      gap: 2rem;
      padding: 1rem;
    }

    .journalit-onboarding-view-container .welcome-left {
      padding: 1rem;
    }

    .journalit-onboarding-view-container .welcome-left h1 {
      font-size: 1.75rem;
    }

    .journalit-onboarding-view-container .welcome-subtitle {
      font-size: 1rem;
    }

    .journalit-onboarding-view-container .welcome-right {
      height: 250px;
      padding: 1rem;
    }

    .journalit-onboarding-view-container .chart-container {
      min-height: 180px;
    }

    
    .journalit-onboarding-view-container .welcome-step-container .skip-button {
      position: static !important;
      align-self: center;
      margin: 0 0 1.5rem;
      font-size: 0.75rem;
      padding: 0.4rem 0.8rem;
    }

    .journalit-onboarding-view-container .skip-button {
      bottom: 1rem;
      right: 1rem;
      font-size: 0.75rem;
      padding: 0.4rem 0.8rem;
    }

    
    .journalit-onboarding-view-container .feature-content-wrapper {
      grid-template-columns: 1fr !important;
      gap: 2rem;
      padding: 1rem;
    }

    .journalit-onboarding-view-container .feature-left {
      width: 100%;
    }

    .journalit-onboarding-view-container .feature-right {
      display: none !important; 
    }

    

    .journalit-onboarding-view-container .features-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .journalit-onboarding-view-container .explore-grid {
      grid-template-columns: 1fr;
    }

    .journalit-onboarding-view-container .explore-feature-grid {
      grid-template-columns: 1fr;
    }

    .journalit-onboarding-view-container .feature-card {
      padding: 0.875rem 1rem;
    }

    .journalit-onboarding-view-container .step-header h2 {
      font-size: 1.5rem;
      text-align: left;
    }

    .journalit-onboarding-view-container .trial-notice {
      font-size: 0.75rem;
    }

    .journalit-onboarding-view-container .welcome-actions,
    .journalit-onboarding-view-container .step-actions {
      flex-direction: column;
      gap: 0.75rem;
    }

    .journalit-onboarding-view-container .welcome-actions button,
    .journalit-onboarding-view-container .step-actions button {
      width: 100%;
    }

    
    .journalit-onboarding-view-container .activation-content {
      grid-template-columns: 1fr !important;
      gap: 2rem;
      padding: 1rem;
    }

    .journalit-onboarding-view-container .activation-left {
      width: 100%;
    }

    .journalit-onboarding-view-container .activation-left h2 {
      font-size: 1.75rem;
    }

    .journalit-onboarding-view-container .activation-subtitle {
      font-size: 1rem;
    }

    .journalit-onboarding-view-container .activation-right {
      display: none !important; 
    }

    .journalit-onboarding-view-container .device-code {
      font-size: 1.5rem;
      letter-spacing: 0.2em;
    }

    .journalit-onboarding-view-container .device-code-box {
      padding: 1rem;
    }

    .journalit-onboarding-view-container .activation-steps {
      gap: 0.75rem;
    }

    .journalit-onboarding-view-container .step-item {
      padding: 0.75rem;
    }

    .journalit-onboarding-view-container .skip-activation-button {
      bottom: 1rem;
      right: 1rem;
      font-size: 0.75rem;
      padding: 0.4rem 0.8rem;
    }

    
    .journalit-onboarding-view-container .success-content {
      grid-template-columns: 1fr !important;
      gap: 2rem;
      padding: 1rem;
    }

    .journalit-onboarding-view-container .success-left {
      width: 100%;
    }

    .journalit-onboarding-view-container .success-header h1 {
      font-size: 1.75rem;
    }

    .journalit-onboarding-view-container .success-subtitle {
      font-size: 1rem;
    }

    .journalit-onboarding-view-container .success-right {
      display: none !important; 
    }

    .journalit-onboarding-view-container .next-steps-card {
      padding: 1.25rem;
    }

    .journalit-onboarding-view-container .next-steps-header h3 {
      font-size: 1rem;
    }

    .journalit-onboarding-view-container .step-text {
      font-size: 0.875rem;
    }

    .journalit-onboarding-view-container .upgrade-callout {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 1.25rem;
    }

    .journalit-onboarding-view-container .upgrade-left {
      width: 100%;
    }

    .journalit-onboarding-view-container .upgrade-button {
      width: 100%;
    }

    .journalit-onboarding-view-container .upgrade-title {
      font-size: 0.875rem;
    }

    .journalit-onboarding-view-container .upgrade-description {
      font-size: 0.75rem;
    }

    .journalit-onboarding-view-container .resource-buttons {
      flex-direction: row;
      width: 100%;
      justify-content: center;
      gap: 6px;
    }

    .journalit-onboarding-view-container .resource-button {
      font-size: 11px;
      padding: 5px 10px;
    }

    .journalit-onboarding-view-container .resources-label {
      font-size: 0.75rem;
    }
  }

  
  @media (max-width: 480px) {
    
    .journalit-onboarding-view-container
      .personalise-options.personalise-options-two-columns {
      grid-template-columns: minmax(0, 1fr);
    }

    .journalit-onboarding-view-container .welcome-left h1,
    .journalit-onboarding-view-container .success-header h1,
    .journalit-onboarding-view-container .activation-left h2 {
      font-size: 1.5rem;
    }

    .journalit-onboarding-view-container .step-header h2 {
      font-size: 1.25rem;
    }

    .journalit-onboarding-view-container .welcome-subtitle,
    .journalit-onboarding-view-container .success-subtitle,
    .journalit-onboarding-view-container .activation-subtitle {
      font-size: 0.9rem;
    }

    .journalit-onboarding-view-container .feature-card {
      padding: 0.75rem 0.875rem;
    }

    .journalit-onboarding-view-container .feature-label {
      font-size: 0.875rem;
    }

    .journalit-onboarding-view-container .feature-description {
      font-size: 0.75rem;
    }

    .journalit-onboarding-view-container .premium-badge,
    .journalit-onboarding-view-container .coming-soon-badge {
      font-size: 0.65rem;
      padding: 0.2rem 0.4rem;
    }

    .journalit-onboarding-view-container .next-step-item {
      padding: 0.75rem;
    }

    .journalit-onboarding-view-container .step-number {
      width: 24px;
      height: 24px;
      font-size: 0.75rem;
    }

    .journalit-onboarding-view-container .device-code {
      font-size: 1.25rem;
    }

    .journalit-onboarding-view-container .resource-buttons {
      flex-direction: column;
      gap: 6px;
    }

    .journalit-onboarding-view-container .resource-button {
      width: 100%;
    }

    
    .journalit-onboarding-view-container .choose-path-step .step-header h2 {
      font-size: 1.6rem;
    }

    .journalit-onboarding-view-container .choose-path-step .step-subtitle {
      font-size: 0.95rem;
    }

    .journalit-onboarding-view-container .choose-path-step .features-grid {
      gap: 0.65rem;
    }

    .journalit-onboarding-view-container .choose-path-step .step-actions {
      margin-top: 0.75rem;
    }
  }

  
  @keyframes journalit-onboarding-fade-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .journalit-onboarding-view-container .welcome-step-container,
  .journalit-onboarding-view-container .feature-selection-step,
  .journalit-onboarding-view-container .create-account-step,
  .journalit-onboarding-view-container .success-step-container,
  .journalit-onboarding-view-container .device-activation-step {
    animation: journalit-onboarding-fade-in-up 0.4s ease-out 0.1s both;
  }

  
  .journalit-onboarding-view-container .device-activation-step {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    padding: 2rem;
  }

  .journalit-onboarding-view-container .activation-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    width: 100%;
    max-width: 1600px;
    align-items: center;
  }

  .journalit-onboarding-view-container .activation-left {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .journalit-onboarding-view-container .activation-left h2 {
    font-size: 2.5rem;
    font-weight: 500;
    color: var(--text-normal);
    margin: 0;
    line-height: 1.2;
  }

  .journalit-onboarding-view-container .activation-subtitle {
    font-size: 1.125rem;
    color: var(--text-muted);
    line-height: 1.6;
    margin: 0;
  }

  .journalit-onboarding-view-container .activation-success-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    background: linear-gradient(135deg,
      rgba(76, 175, 80, 0.1) 0%,
      rgba(76, 175, 80, 0.05) 100%);
    border-radius: 12px;
    border: 2px solid var(--color-green);
  }

  .journalit-onboarding-view-container .activation-success-header .success-icon {
    color: var(--color-green);
    flex-shrink: 0;
  }

  .journalit-onboarding-view-container .activation-success-header h3 {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--text-normal);
    margin: 0 0 0.25rem 0;
  }

  .journalit-onboarding-view-container .activation-success-header p {
    font-size: 1rem;
    color: var(--text-muted);
    margin: 0;
  }

  .journalit-onboarding-view-container .activated-features {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .journalit-onboarding-view-container .activated-features h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-normal);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.875rem;
  }

  .journalit-onboarding-view-container .feature-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .journalit-onboarding-view-container .feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--background-secondary);
    border-radius: 8px;
    border: 1px solid var(--background-modifier-border);
  }

  .journalit-onboarding-view-container .feature-item svg {
    color: var(--color-green);
    flex-shrink: 0;
  }

  .journalit-onboarding-view-container .feature-item span {
    font-size: 0.95rem;
    color: var(--text-normal);
    line-height: 1.4;
  }

  .journalit-onboarding-view-container .trial-info {
    padding: 1.25rem;
    background: var(--background-secondary);
    border-radius: 8px;
    border-left: 3px solid var(--interactive-accent);
  }

  .journalit-onboarding-view-container .trial-info p {
    font-size: 0.95rem;
    color: var(--text-muted);
    margin: 0;
    line-height: 1.5;
  }

  .journalit-onboarding-view-container .activation-loading {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    background: var(--background-secondary);
    border-radius: 12px;
  }

  .journalit-onboarding-view-container .activation-loading p {
    font-size: 1rem;
    color: var(--text-normal);
    margin: 0;
  }

  .journalit-onboarding-view-container .activation-error {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    background: rgba(244, 67, 54, 0.05);
    border: 1px solid var(--color-red);
    border-radius: 12px;
  }

  .journalit-onboarding-view-container .activation-error h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-red);
    margin: 0;
  }

  .journalit-onboarding-view-container .activation-error p {
    font-size: 0.95rem;
    color: var(--text-muted);
    margin: 0;
  }

  .journalit-onboarding-view-container .device-code-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .journalit-onboarding-view-container .device-code-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .journalit-onboarding-view-container .device-code-box {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--background-secondary);
    border: 2px solid var(--background-modifier-border);
    border-radius: 12px;
  }

  .journalit-onboarding-view-container .device-code {
    flex: 1;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.3em;
    color: var(--text-accent);
    text-align: center;
  }

  .journalit-onboarding-view-container .copy-button {
    padding: 0.75rem;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    position: relative;
  }

  .journalit-onboarding-view-container .copy-button:hover {
    background: var(--interactive-accent-hover);
    color: var(--text-on-accent);
    transform: scale(1.05);
  }

  .journalit-onboarding-view-container .copy-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .journalit-onboarding-view-container .copy-button.copied {
    background: var(--color-green);
  }

  .journalit-onboarding-view-container .copy-button.copied:hover {
    background: var(--color-green);
    transform: scale(1);
  }

  .journalit-onboarding-view-container .activation-primary-action {
    margin-top: 1rem;
  }

  .journalit-onboarding-view-container .activation-primary-action button {
    width: 100%;
    justify-content: center;
    font-size: 1.125rem;
    padding: 1rem 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .journalit-onboarding-view-container .activation-primary-action button:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .journalit-onboarding-view-container .activation-steps {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .journalit-onboarding-view-container .step-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--background-secondary);
    border-radius: 8px;
  }

  .journalit-onboarding-view-container .step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    border-radius: 50%;
    font-size: 0.875rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  .journalit-onboarding-view-container .step-text {
    font-size: 0.95rem;
    color: var(--text-normal);
    line-height: 1.4;
  }

  .journalit-onboarding-view-container .activation-waiting {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: var(--background-secondary);
    border-radius: 8px;
    border: 1px dashed var(--background-modifier-border);
  }

  .journalit-onboarding-view-container .waiting-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .journalit-onboarding-view-container .waiting-text p {
    font-size: 0.95rem;
    color: var(--text-normal);
    margin: 0;
    font-weight: 500;
  }

  .journalit-onboarding-view-container .status-hint {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-style: italic;
  }

  .journalit-onboarding-view-container .activation-right {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .journalit-onboarding-view-container .activation-graphic {
    position: relative;
    width: 500px;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-onboarding-view-container .activation-graphic-glow {
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(109, 120, 172, 0.12) 0%, transparent 70%);
    border-radius: 50%;
    animation: journalit-onboarding-pulse 3s ease-in-out infinite;
  }

  .journalit-onboarding-view-container .graphic-placeholder {
    position: relative;
    color: var(--text-accent);
    opacity: 0.6;
  }

  @keyframes journalit-onboarding-pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.05); }
  }

  @keyframes journalit-onboarding-scale-in {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes journalit-onboarding-sparkle {
    0%, 100% {
      opacity: 0.6;
      transform: scale(1) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1.1) rotate(10deg);
    }
  }

  @keyframes journalit-onboarding-float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  .journalit-onboarding-view-container .skip-activation-button {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    transition: color 0.2s ease;
  }

  .journalit-onboarding-view-container .skip-activation-button:hover {
    color: var(--text-normal);
    text-decoration: underline;
  }

  .journalit-onboarding-view-container .continue-action {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    z-index: 10;
  }

  .journalit-onboarding-view-container .continue-action button {
    padding: 1rem 3rem;
    font-size: 1.125rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .journalit-onboarding-view-container .continue-action button:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  .journalit-onboarding-view-container .auto-advance-hint {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin: 0;
    font-style: italic;
  }

  
  .journalit-onboarding-view-container .upgrade-notice {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    font-size: 0.95rem;
    color: var(--text-muted);
    margin-top: 1rem;
  }

  .journalit-onboarding-view-container .link-button {
    background: none;
    border: none;
    color: var(--text-accent);
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    font-size: inherit;
  }

  .journalit-onboarding-view-container .link-button:hover {
    color: var(--text-accent-hover);
  }

  
  
  
  .journalit-onboarding-view-container .onboarding-status-text {
    margin: 0.75rem 0 0;
    color: var(--text-muted);
    font-size: 0.85rem;
  }

  .journalit-onboarding-view-container .orientation-cards {
    list-style: none;
    margin: 0.5rem 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .journalit-onboarding-view-container .orientation-card {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .journalit-onboarding-view-container .orientation-card-number {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    margin-top: 0.1rem;
    border-radius: 50%;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    font-size: 0.9rem;
    font-weight: 600;
  }

  .journalit-onboarding-view-container .orientation-card-body {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    min-width: 0;
  }

  .journalit-onboarding-view-container .orientation-card-title {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--text-normal);
    line-height: 1.3;
  }

  .journalit-onboarding-view-container .orientation-card-text {
    color: var(--text-muted);
    font-size: 1rem;
    line-height: 1.6;
    max-width: 58ch;
  }

  .journalit-onboarding-view-container .orientation-card-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .journalit-onboarding-view-container .orientation-card-hint {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .journalit-onboarding-view-container .personalise-rows {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    margin-top: 0.25rem;
  }

  .journalit-onboarding-view-container .personalise-row {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .journalit-onboarding-view-container .personalise-question {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-normal);
  }

  .journalit-onboarding-view-container .personalise-options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 0.45rem;
  }

  .journalit-onboarding-view-container .personalise-options-two-columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .journalit-onboarding-view-container .journalit-onboarding-option {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.7rem;
    height: auto;
    padding: 0.6rem 0.85rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    background: var(--background-secondary);
    color: var(--text-normal);
    font: inherit;
    font-size: 0.95rem;
    line-height: 1.3;
    text-align: left;
    white-space: normal;
    box-shadow: none;
    transition:
      border-color 0.15s ease,
      background-color 0.15s ease;
  }

  .journalit-onboarding-view-container .journalit-onboarding-option:hover {
    border-color: var(--interactive-accent);
  }

  .journalit-onboarding-view-container .journalit-onboarding-option.is-selected {
    border-color: var(--interactive-accent);
    background: var(--background-primary);
  }

  .journalit-onboarding-view-container .journalit-onboarding-option:focus-visible {
    outline: 2px solid var(--interactive-accent);
    outline-offset: 2px;
  }

  .journalit-onboarding-view-container .journalit-onboarding-option-radio {
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid var(--background-modifier-border);
    background: transparent;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .journalit-onboarding-view-container .journalit-onboarding-option.is-selected .journalit-onboarding-option-radio {
    border-color: var(--interactive-accent);
    box-shadow: inset 0 0 0 3px var(--background-primary), inset 0 0 0 8px var(--interactive-accent);
  }

  
  @keyframes journalit-broker-request-in {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  .journalit-onboarding-view-container .broker-request-panel {
    animation: journalit-broker-request-in 220ms ease-out;
    scroll-margin: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem 1rem;
    margin-top: 1rem;
    padding: 0.9rem 1rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: 12px;
    background: var(--background-secondary);
  }

  @media (prefers-reduced-motion: reduce) {
    .journalit-onboarding-view-container .broker-request-panel {
      animation: none;
    }
  }

  .journalit-onboarding-view-container .broker-request-panel__text {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
    flex: 1 1 18rem;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .journalit-onboarding-view-container .broker-request-panel__text strong {
    color: var(--text-normal);
  }

  .journalit-onboarding-view-container .broker-request-panel__actions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    flex: 0 0 auto;
    min-width: 15rem;
  }

  .journalit-onboarding-view-container .broker-request-panel__actions button {
    justify-content: center;
  }

  @media (max-width: 768px) {
    .journalit-onboarding-view-container .orientation-card {
      padding: 0.75rem 0.9rem;
    }

    .journalit-onboarding-view-container .first-trade-actions .journalit-button {
      width: 100%;
    }

    .journalit-onboarding-view-container .preparing-sample-actions {
      flex-direction: column;
      width: 100%;
    }
  }

  .journalit-onboarding-view-container .choose-path-step-no-graphic .feature-content-wrapper {
    grid-template-columns: minmax(0, 880px);
    justify-content: center;
  }

  
  .journalit-onboarding-view-container .broker-step {
    justify-content: flex-start;
  }

`;
