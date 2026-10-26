
export const DRAWER_STYLES = `
  .journalit-drawer-overlay {
    position: fixed;
    inset: 0;
    z-index: var(--layer-modal);
    display: flex;
    justify-content: flex-end;
    background-color: rgba(0, 0, 0, 0.28);
    animation: journalit-drawer-fade-in 160ms ease-out;
  }
  .journalit-drawer-panel {
    box-sizing: border-box;
    width: min(640px, calc(100vw - 48px));
    height: 100%;
    min-width: 0;
  }
  .journalit-drawer-inner {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--background-primary);
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    border-left: 1px solid var(--background-modifier-border);
    box-shadow: var(--shadow-l);
    animation: journalit-drawer-slide-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  @keyframes journalit-drawer-slide-in {
    from { transform: translateX(32px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes journalit-drawer-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .journalit-drawer-header {
    display: flex;
    flex-shrink: 0;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 20px 12px;
  }
  .journalit-drawer-heading { min-width: 0; }
  .journalit-drawer-panel .journalit-drawer-title {
    margin: 0 0 4px;
    font-size: var(--font-ui-large);
    font-weight: 600;
    line-height: 1.3;
    color: var(--text-normal);
  }
  .journalit-drawer-panel .journalit-drawer-subtitle {
    margin: 0;
    font-size: var(--font-ui-small);
    line-height: 1.45;
    color: var(--text-muted);
  }
  .journalit-drawer-panel .journalit-drawer-close {
    flex: 0 0 auto;
    color: var(--text-muted);
  }
  @media (prefers-reduced-motion: reduce) {
    .journalit-drawer-overlay, .journalit-drawer-inner { animation: none; }
  }
  @media (max-width: 600px) {
    .journalit-drawer-panel { width: 100vw; }
    .journalit-drawer-inner { border-left: none; }
  }
  @media (max-height: 500px) {
    .journalit-drawer-header { padding: 12px 20px 8px; }
    .journalit-drawer-panel .journalit-drawer-subtitle { display: none; }
  }
`;
