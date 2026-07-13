export const imageGalleryStyles = `
.journalit-image-gallery-page {
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 16px 16px;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: auto;
}

.journalit-image-gallery-empty-state {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
}

.journalit-image-gallery-empty-state__card {
  width: min(440px, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 30px 28px;
  border: 1px dashed var(--background-modifier-border);
  border-radius: 18px;
  background: transparent;
  text-align: center;
}

.journalit-image-gallery-empty-state__icon {
  width: 98px;
  height: 98px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(var(--interactive-accent-rgb), 0.42);
  border-radius: 22px;
  background: transparent;
  color: var(--text-accent);
}

.journalit-image-gallery-empty-state__copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.journalit-image-gallery-empty-state__copy h2 {
  margin: 0;
  color: var(--text-normal);
  font-size: 19px;
  font-weight: 700;
  line-height: 1.25;
}

.journalit-image-gallery-empty-state__copy p {
  max-width: 34em;
  margin: 0;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.45;
}

.journalit-image-gallery-empty-state__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
}

.journalit-image-gallery-empty-state__actions .journalit-image-gallery-empty-state__button.journalit-button {
  min-height: 32px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: none !important;
}

.journalit-image-gallery-empty-state__actions .journalit-image-gallery-empty-state__button.journalit-button--primary {
  border-color: var(--interactive-accent) !important;
  background: var(--interactive-accent) !important;
  color: var(--text-on-accent) !important;
}

.journalit-image-gallery-empty-state__actions .journalit-image-gallery-empty-state__button.journalit-button--primary:hover:not(:disabled) {
  border-color: var(--interactive-accent-hover) !important;
  background: var(--interactive-accent-hover) !important;
  color: var(--text-on-accent) !important;
}

.journalit-image-gallery-empty-state__actions .journalit-image-gallery-empty-state__button.journalit-button--secondary {
  border-color: var(--background-modifier-border) !important;
  background: transparent !important;
  color: var(--text-muted) !important;
}

.journalit-image-gallery-empty-state__actions .journalit-image-gallery-empty-state__button.journalit-button--secondary:hover:not(:disabled) {
  border-color: var(--background-modifier-border-hover) !important;
  background: var(--background-modifier-hover) !important;
  color: var(--text-normal) !important;
}

.journalit-image-gallery-header {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: nowrap;
  min-width: 0;
}

.journalit-image-gallery-header__title-group {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.journalit-image-gallery-header__copy {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 0;
  white-space: nowrap;
}

.journalit-image-gallery-header__title {
  display: block;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  color: var(--text-normal);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.18;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-image-gallery-header__subtitle {
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  white-space: nowrap;
}

.journalit-image-gallery-header__subtitle::before {
  content: '·';
  margin-right: 10px;
  color: var(--text-faint);
}

.journalit-image-gallery-toolbar {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  gap: 10px;
  align-items: center;
  flex: 0 0 auto;
}

.journalit-image-gallery-toolbar button.journalit-toolbar-button {
  background: var(--background-secondary);
  border-color: var(--background-modifier-border);
  color: var(--text-muted);
  overflow: visible;
}

.journalit-image-gallery-toolbar button.journalit-toolbar-button:hover:not(:disabled),
.journalit-image-gallery-toolbar button.journalit-toolbar-button:focus-visible:not(:disabled) {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-image-gallery-toolbar button.journalit-toolbar-button--active,
.journalit-image-gallery-toolbar button.journalit-toolbar-button--active:hover:not(:disabled),
.journalit-image-gallery-toolbar button.journalit-toolbar-button--active:focus-visible:not(:disabled) {
  background: var(--background-secondary);
  border-color: var(--interactive-accent);
  color: var(--text-accent);
}

.journalit-image-gallery-filter-menu {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  z-index: 40;
  overflow: visible;
}

.journalit-image-gallery-filter-dropdown {
  min-width: 136px;
  padding: 0;
  background: var(--background-primary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px;
  box-shadow: none !important;
  z-index: 1000;
}

.journalit-image-gallery-filter-dropdown .journalit-home-period-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 26px;
  padding: 4px 8px;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
  appearance: none;
}

.journalit-image-gallery-filter-dropdown .journalit-home-period-option:hover,
.journalit-image-gallery-filter-dropdown .journalit-home-period-option:focus-visible {
  background: var(--background-modifier-hover) !important;
}

.journalit-image-gallery-filter-dropdown .journalit-home-period-option__check {
  width: 13px;
  height: 13px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 2px;
  background: transparent;
  color: var(--text-on-accent);
  font-size: 10px;
  line-height: 1;
}

.journalit-image-gallery-filter-dropdown .journalit-home-period-option--active .journalit-home-period-option__check {
  background: var(--interactive-accent);
  border-color: var(--interactive-accent);
}

.journalit-image-gallery-size-toggle {
  display: inline-flex;
  align-items: center;
}

.journalit-image-gallery-size-toggle {
  gap: 0;
}

.journalit-image-gallery-size-toggle .journalit-toolbar-button {
  position: relative;
  z-index: 1;
  border-radius: 0;
  margin-left: -1px;
  color: var(--text-normal);
}

.journalit-image-gallery-size-toggle .journalit-toolbar-button--active {
  z-index: 4;
  color: var(--text-normal);
}

.journalit-image-gallery-size-toggle .journalit-toolbar-button:hover,
.journalit-image-gallery-size-toggle .journalit-toolbar-button:focus-visible {
  z-index: 2;
}

.journalit-image-gallery-size-toggle .journalit-toolbar-button--active:hover,
.journalit-image-gallery-size-toggle .journalit-toolbar-button--active:focus-visible {
  z-index: 5;
}

.journalit-image-gallery-size-toggle .journalit-toolbar-button:first-child {
  margin-left: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.journalit-image-gallery-size-toggle .journalit-toolbar-button:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.journalit-image-gallery-sort {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  z-index: 40;
}

.journalit-image-gallery-sort-trigger {
  min-width: 108px;
  justify-content: space-between;
  gap: 12px;
}

.journalit-image-gallery-sort-dropdown {
  min-width: 136px;
}

.journalit-image-gallery-grid {
  display: grid;
  gap: 12px;
  align-items: start;
}

.journalit-image-gallery-virtual-spacer {
  grid-column: 1 / -1;
  height: var(--journalit-image-gallery-spacer-height, 0);
  min-height: var(--journalit-image-gallery-spacer-height, 0);
  pointer-events: none;
}

.journalit-image-gallery-grid--small {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 238px), 1fr));
}

.journalit-image-gallery-grid--medium {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
}

.journalit-image-gallery-grid--large {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 460px), 1fr));
}

.journalit-image-gallery-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--background-modifier-border);
  border-radius: 12px;
  background: var(--background-primary);
  box-shadow: none;
  contain: layout paint style;
  isolation: isolate;
  transition: transform 0.14s ease;
}

.journalit-image-gallery-card:hover,
.journalit-image-gallery-card:focus-within {
  box-shadow: none;
  transform: translateY(-1px);
}

.journalit-image-gallery-card__open {
  position: relative;
  z-index: 2;
  display: block;
  width: 100%;
  height: auto;
  min-height: 0;
  padding: 0;
  border: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
  color: inherit;
  line-height: normal;
  text-align: left;
  cursor: pointer;
}

.journalit-image-gallery-card__open:hover,
.journalit-image-gallery-card__open:focus-visible,
.journalit-image-gallery-card__open:active {
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.journalit-image-gallery-card button.journalit-image-gallery-card__open,
.journalit-image-gallery-card button.journalit-image-gallery-card__open:hover,
.journalit-image-gallery-card button.journalit-image-gallery-card__open:focus-visible,
.journalit-image-gallery-card button.journalit-image-gallery-card__open:active {
  background: transparent;
  background-color: transparent;
  box-shadow: none;
}

.journalit-image-gallery-card__ticker {
  min-width: 0;
  overflow: hidden;
  color: var(--text-accent);
  text-overflow: ellipsis;
  font-weight: 800;
  white-space: nowrap;
}

.journalit-image-gallery-card__date {
  min-width: 0;
  overflow: hidden;
  color: var(--text-muted);
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-image-gallery-card__image-frame {
  position: relative;
  z-index: 1;
  overflow: hidden;
  margin: 0;
  border: 0;
  border-radius: 12px 12px 0 0;
  background: var(--background-primary);
  background-clip: border-box;
}

.journalit-image-gallery-card--small .journalit-image-gallery-card__image-frame {
  aspect-ratio: 16 / 9;
}

.journalit-image-gallery-card--medium .journalit-image-gallery-card__image-frame {
  aspect-ratio: 16 / 9;
}

.journalit-image-gallery-card--large .journalit-image-gallery-card__image-frame {
  aspect-ratio: 16 / 9;
}

.journalit-image-gallery-card__image,
.journalit-image-gallery-card__image .lazy-image-img,
.journalit-image-gallery-card__image .lazy-image-placeholder,
.journalit-image-gallery-card__image .lazy-image-error {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.journalit-image-gallery-card__image .lazy-image-img {
  display: block;
  object-fit: contain;
}

.journalit-image-gallery-card__image--excalidraw,
.journalit-image-gallery-card__image--excalidraw .journalit-excalidraw-media,
.journalit-image-gallery-card__image--excalidraw .journalit-excalidraw-media__embed {
  width: 100%;
  height: 100%;
}

.journalit-image-gallery-card__image--excalidraw .journalit-excalidraw-media__embed {
  display: flex;
  align-items: center;
  justify-content: center;
}

.journalit-image-gallery-card__image--excalidraw .journalit-excalidraw-media__embed img,
.journalit-image-gallery-card__image--excalidraw .journalit-excalidraw-media__embed svg {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.journalit-image-gallery-card__image-frame--blurred .journalit-image-gallery-card__image,
.journalit-image-gallery-card__image-frame--blurred .lazy-image-img {
  filter: blur(10px);
  transform: scale(1.04);
}

.journalit-image-gallery-card__privacy-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.18);
  color: var(--text-on-accent);
  font-size: var(--font-ui-smaller);
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

.journalit-image-gallery-card__annotation-marker {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--background-primary) 72%, transparent);
  color: var(--text-muted);
  opacity: 0.9;
}

.journalit-image-gallery-card__hover-panel {
  position: absolute;
  right: 8px;
  bottom: 8px;
  left: 8px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: calc(100% - 16px);
  padding: 10px 124px 10px 10px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--background-primary) 92%, transparent);
  color: var(--text-normal);
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.journalit-image-gallery-card:hover .journalit-image-gallery-card__hover-panel,
.journalit-image-gallery-card:focus-within .journalit-image-gallery-card__hover-panel {
  opacity: 1;
  transform: translateY(0);
}

.journalit-image-gallery-card__hover-footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  min-width: 0;
}

.journalit-image-gallery-card__hover-tags {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
}

.journalit-image-gallery-card__hover-tags-icon {
  flex: 0 0 auto;
  color: var(--text-muted);
}

.journalit-image-gallery-card__hover-tag {
  min-width: 0;
  overflow: hidden;
  color: var(--text-accent);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-image-gallery-card__hover-notes {
  margin: 0;
  overflow: hidden;
  color: var(--text-muted);
  display: -webkit-box;
  font-size: 12px;
  font-style: italic;
  line-height: 1.3;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.journalit-image-gallery-card__hover-footer {
  color: var(--text-muted);
  font-size: 12px;
}

.journalit-image-gallery-card__hover-footer span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.journalit-image-gallery-card__reviewed-icon {
  color: var(--color-green);
}


.journalit-image-gallery-card__footer {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  min-width: 0;
  align-items: center;
  gap: 10px;
  min-height: 32px;
  padding: 0 10px;
  overflow: hidden;
  border-radius: 0 0 12px 12px;
  background: var(--background-primary);
  font-size: 13px;
}

.journalit-image-gallery-card__tag,
.journalit-image-gallery-card__outcome {
  display: inline-flex;
  min-width: 0;
  justify-content: center;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border: 1px solid rgba(var(--mono-rgb-100), 0.1);
  border-radius: 14px;
  background: rgba(var(--mono-rgb-100), 0.04);
  box-shadow:
    inset 0 1px 0 rgba(var(--mono-rgb-100), 0.05),
    0 1px 2px rgba(0, 0, 0, 0.12);
  font-size: 12px;
  font-weight: 600;
  line-height: 28px;
  white-space: nowrap;
}

.journalit-image-gallery-card__tag {
  background: rgba(250, 209, 66, 0.26);
  color: rgba(244, 238, 210, 0.92);
}

.journalit-image-gallery-card__value {
  display: inline-flex;
  min-width: 0;
  justify-content: flex-end;
  align-items: center;
  min-height: 24px;
  padding: 0 2px;
  font-size: 12px;
  font-weight: 700;
  line-height: 24px;
  white-space: nowrap;
}

.journalit-image-gallery-card__value--positive {
  color: var(--text-success, var(--color-green));
}

.journalit-image-gallery-card__value--negative {
  color: var(--text-error, var(--color-red));
}

.journalit-image-gallery-card__value--neutral,
.journalit-image-gallery-card__value--masked {
  color: var(--text-muted);
}

.journalit-image-gallery-card__meta-spacer,
.journalit-image-gallery-card__source {
  min-width: 0;
  overflow: hidden;
  justify-self: end;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-image-gallery-card__meta-spacer {
  display: block;
}

.journalit-image-gallery-card__outcome--winner {
  background: rgba(64, 180, 105, 0.14);
  color: var(--text-success, var(--color-green));
}

.journalit-image-gallery-card__outcome--loser {
  background: rgba(220, 72, 72, 0.14);
  color: var(--text-error, var(--color-red));
}

.journalit-image-gallery-card__outcome--breakeven,
.journalit-image-gallery-card__outcome--unknown,
.journalit-image-gallery-card__outcome--masked {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(224, 229, 238, 0.76);
}

.journalit-image-gallery-card__annotation-state {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-height: 28px;
  margin-left: auto;
  padding: 0;
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: rgba(224, 229, 238, 0.58);
  cursor: pointer;
  transition:
    color 0.14s ease,
    transform 0.14s ease;
}

.journalit-image-gallery-card__annotation-state--tagged {
  color: var(--color-green);
}

.journalit-image-gallery-card__annotation-state:hover,
.journalit-image-gallery-card__annotation-state:focus-visible {
  background: transparent !important;
  box-shadow: none !important;
  color: var(--text-normal);
  transform: scale(1.04);
}

.journalit-image-gallery-card__annotation-state--tagged:hover,
.journalit-image-gallery-card__annotation-state--tagged:focus-visible {
  color: var(--color-green);
}

.journalit-image-gallery-card__source-link {
  position: absolute;
  right: 18px;
  bottom: 45px;
  z-index: 7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: auto;
  height: 28px;
  padding: 0;
  border: 0 !important;
  border-radius: var(--radius-s, 6px);
  background: transparent !important;
  box-shadow: none !important;
  color: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease,
    background-color 0.16s ease,
    color 0.16s ease;
}

.journalit-image-gallery-card:hover .journalit-image-gallery-card__source-link,
.journalit-image-gallery-card__source-link:focus-visible {
  color: var(--text-accent);
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.journalit-image-gallery-card__source-link:hover,
.journalit-image-gallery-card__source-link:focus-visible {
  background: transparent !important;
  box-shadow: none !important;
  color: var(--text-accent);
}

.journalit-image-gallery-card button.journalit-image-gallery-card__source-link,
.journalit-image-gallery-card button.journalit-image-gallery-card__source-link:hover,
.journalit-image-gallery-card button.journalit-image-gallery-card__source-link:focus-visible,
.journalit-image-gallery-card button.journalit-image-gallery-card__source-link:active {
  border: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.journalit-image-gallery-card--small .journalit-image-gallery-card__hover-panel {
  gap: 5px;
  padding: 8px 112px 8px 8px;
}

.journalit-image-gallery-card--empty-hover .journalit-image-gallery-card__source-link {
  bottom: 37px;
}

.journalit-image-gallery-card--small.journalit-image-gallery-card--empty-hover .journalit-image-gallery-card__source-link {
  bottom: 34px;
}

.theme-light .journalit-image-gallery-card {
  box-shadow: none;
}

.theme-light .journalit-image-gallery-card:hover,
.theme-light .journalit-image-gallery-card:focus-within {
  box-shadow: none;
}

.theme-light .journalit-image-gallery-card__tag,
.theme-light .journalit-image-gallery-card__outcome {
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.12);
}

.journalit-image-gallery-fullscreen--privacy .journalit-fullscreen-zoomable-image,
.journalit-image-gallery-fullscreen--privacy .journalit-fullscreen-zoomable-media {
  filter: blur(16px);
}

.journalit-image-gallery-fullscreen-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.journalit-image-gallery-fullscreen-layout--annotating .journalit-fullscreen-viewer {
  width: 100vw;
  margin-right: 0;
}

.journalit-image-gallery-fullscreen-layout--annotating .journalit-fullscreen-image-wrapper {
  width: 100%;
  margin-right: 0;
}

.journalit-image-gallery-fullscreen-layout--annotating .journalit-fullscreen-zoomable-image,
.journalit-image-gallery-fullscreen-layout--annotating .journalit-fullscreen-zoomable-media {
  max-width: 88vw;
  max-height: 86vh;
}

.journalit-image-gallery-fullscreen-actions {
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 3;
  display: flex;
  gap: 8px;
}

.journalit-image-gallery-fullscreen-actions .journalit-image-gallery-open-source-button.journalit-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 8px;
  background: var(--background-secondary) !important;
  color: var(--text-normal) !important;
  box-shadow: var(--shadow-s) !important;
  font-size: var(--font-ui-small);
  font-weight: 700;
}

.journalit-image-gallery-fullscreen-actions .journalit-image-gallery-open-source-button.journalit-button:hover:not(:disabled),
.journalit-image-gallery-fullscreen-actions .journalit-image-gallery-open-source-button.journalit-button:focus-visible:not(:disabled) {
  border-color: var(--interactive-accent) !important;
  background: var(--background-modifier-hover) !important;
  color: var(--text-normal) !important;
}

.journalit-image-gallery-fullscreen-actions .journalit-image-gallery-open-source-button.journalit-button svg {
  color: var(--text-muted);
}

.journalit-image-annotation-panel {
  position: absolute;
  top: 92px;
  right: 24px;
  z-index: 4;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(360px, calc(100vw - 48px));
  max-height: calc(100vh - 132px);
  overflow: auto;
  padding: 16px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 12px;
  background: var(--background-secondary);
  box-shadow: var(--shadow-l);
  cursor: default;
}

@media (max-width: 760px) {
  .journalit-image-gallery-fullscreen-layout--annotating .journalit-fullscreen-viewer {
    width: 100vw;
    height: 46vh;
    margin-right: 0;
  }

  .journalit-image-gallery-fullscreen-layout--annotating .journalit-fullscreen-image-wrapper {
    width: 100%;
    height: 46vh;
  }

  .journalit-image-gallery-fullscreen-layout--annotating .journalit-fullscreen-zoomable-image,
  .journalit-image-gallery-fullscreen-layout--annotating .journalit-fullscreen-zoomable-media {
    max-width: calc(100vw - 20px);
    max-height: 42vh;
  }

  .journalit-image-annotation-panel {
    top: auto;
    left: 10px;
    right: 10px;
    bottom: 10px;
    width: auto;
    max-height: 48vh;
    padding: 14px;
    border-radius: 12px;
  }

  .journalit-image-gallery-fullscreen-actions {
    right: 10px;
    bottom: calc(48vh + 20px);
  }
}


.journalit-image-gallery-page {
  padding: 12px 16px 16px;
}

.journalit-image-gallery-header__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  background: var(--background-secondary);
  color: var(--text-accent);
}

.journalit-image-gallery-source {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  z-index: 40;
}

.journalit-image-gallery-source-dropdown {
  min-width: 170px;
}

.journalit-image-gallery-card__source {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
  min-height: 24px;
  color: rgba(224, 229, 238, 0.76);
  font-size: 12px;
  font-weight: 700;
  line-height: 24px;
  white-space: nowrap;
}

.journalit-image-gallery-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 10px 10px;
  background: rgba(18, 20, 24, 0.94);
}

.journalit-image-gallery-card__notes {
  margin: 0;
  padding: 0 10px 12px;
  overflow: hidden;
  background: rgba(18, 20, 24, 0.94);
  color: rgba(224, 229, 238, 0.76);
  display: -webkit-box;
  font-size: 12px;
  line-height: 1.35;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}



.journalit-image-annotation-editor {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.journalit-image-annotation-editor__backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: rgba(0, 0, 0, 0.45);
  box-shadow: none;
  cursor: default;
}

.journalit-image-annotation-editor__panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(560px, 100%);
  max-height: min(760px, calc(100vh - 48px));
  overflow: auto;
  padding: 18px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 16px;
  background: var(--background-primary);
  box-shadow: var(--shadow-l);
}

.journalit-image-annotation-editor__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.journalit-image-annotation-editor__header span {
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.journalit-image-annotation-editor__header h2 {
  margin: 0;
  color: var(--text-normal);
  font-size: 18px;
  line-height: 1.25;
}

.journalit-image-annotation-editor__fields-section button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 9px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-secondary);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

.journalit-image-annotation-editor__fields-section button:hover {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-image-annotation-editor__field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.journalit-image-annotation-editor__field > span,
.journalit-image-annotation-editor__section-label {
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 700;
}

.journalit-image-annotation-editor__field input,
.journalit-image-annotation-editor__field textarea {
  width: 100%;
  min-height: 34px;
  padding: 7px 9px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-secondary);
  color: var(--text-normal);
}

.journalit-image-annotation-editor__field textarea {
  min-height: 112px;
  resize: vertical;
}

.journalit-image-annotation-editor__fields-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.journalit-image-annotation-panel .custom-fields-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.journalit-image-annotation-panel .custom-field-wrapper {
  display: block;
}

.journalit-image-annotation-panel .custom-field-order {
  display: none;
}

.journalit-image-annotation-panel .custom-field-control {
  width: 100%;
}

.journalit-image-annotation-panel .custom-fields-empty {
  padding: 10px 12px;
  border: 1px dashed var(--background-modifier-border);
  border-radius: 10px;
  color: var(--text-muted);
}

.journalit-image-annotation-editor__error {
  margin: 0;
  color: var(--text-error, var(--color-red));
  font-size: 12px;
}

.journalit-image-annotation-editor__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 2px;
}

`;
