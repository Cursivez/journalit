export const INSTALLED_UPDATE_POPUP_STYLES = `
.journalit-update-popup-host {
  position: fixed;
  inset: 0;
  z-index: var(--layer-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  pointer-events: none;
}

.journalit-update-popup {
  position: relative;
  box-sizing: border-box;
  width: 420px;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--background-primary);
  color: var(--text-normal);
  border: 1px solid var(--background-modifier-border-hover);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15);
  font-family: var(--font-interface);
  overflow: hidden;
  pointer-events: auto;
}

.journalit-update-popup .journalit-update-popup__close {
  position: absolute;
  top: 12px;
  inset-inline-end: 12px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 1px solid var(--background-modifier-border);
  border-radius: 50%;
  background: var(--background-secondary);
  color: var(--text-muted);
  box-shadow: none;
  cursor: pointer;
}

.journalit-update-popup .journalit-update-popup__close:hover {
  color: var(--text-normal);
  background: var(--background-modifier-hover);
}

.journalit-update-popup__close svg {
  display: block;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.journalit-update-popup__scroll {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.journalit-update-popup .journalit-update-popup__media {
  display: block;
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  overflow: hidden;
  cursor: zoom-in;
}

.journalit-update-popup .journalit-update-popup__media[hidden] {
  display: none;
}

.journalit-update-popup__media img {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: min(260px, 35vh);
  margin: 0 auto;
}

.journalit-update-popup__content {
  padding: 20px;
}

.journalit-update-popup__eyebrow {
  padding-inline-end: 22px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
}

.journalit-update-popup__title {
  margin: 4px 0 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.journalit-update-popup__description {
  margin: 14px 0 0;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.journalit-update-popup__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid var(--background-modifier-border);
  background: var(--background-primary);
}

.journalit-update-popup .journalit-update-popup__dismiss {
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
}

.journalit-update-popup .journalit-update-popup__dismiss:hover {
  color: var(--text-normal);
}

.journalit-update-popup .journalit-update-popup__more {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: var(--interactive-accent);
  box-shadow: none;
  color: var(--text-on-accent);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.01em;
  transition: background 0.2s ease;
  cursor: pointer;
}

.journalit-update-popup .journalit-update-popup__more:hover {
  background: var(--interactive-accent-hover);
  color: var(--text-on-accent);
}

.journalit-update-popup__more-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
}

.journalit-update-popup__more-icon svg {
  width: 14px;
  height: 14px;
}

.journalit-update-popup button:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
}
`;
