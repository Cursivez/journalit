

export const SKELETON_STYLES = `
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton-shimmer {
  width: var(--journalit-skeleton-width, 100%);
  height: var(--journalit-skeleton-height, 20px);
  border-radius: var(--journalit-skeleton-radius, 4px);
  background: linear-gradient(
    90deg,
    var(--background-secondary) 0%,
    var(--background-modifier-border) 50%,
    var(--background-secondary) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
  pointer-events: none;
  user-select: none;
}

.journalit-skeleton-screenreader-status {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;
