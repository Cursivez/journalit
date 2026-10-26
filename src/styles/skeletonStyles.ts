

export const SKELETON_STYLES = `

@keyframes journalit-skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

.journalit-skeleton-shimmer {
  width: var(--journalit-skeleton-width, 100%);
  height: var(--journalit-skeleton-height, 20px);
  border-radius: var(--journalit-skeleton-radius, 4px);
  background: var(--background-modifier-border);
  animation: journalit-skeleton-pulse 1.6s ease-in-out infinite;
  pointer-events: none;
  user-select: none;
}

@media (prefers-reduced-motion: reduce) {
  .journalit-skeleton-shimmer {
    animation: none;
  }
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
