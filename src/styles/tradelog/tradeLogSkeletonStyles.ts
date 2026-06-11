

const TRADE_LOG_SKELETON_STYLES = `
.trade-log-skeleton {
  width: 100%;
  height: 100%;
  min-height: 400px;
  overflow: hidden;
  background: var(--background-primary);
  display: flex;
  flex-direction: column;
  transition: height 0.2s ease-out;
}

.skeleton-header-row {
  display: grid;
  grid-template-columns: var(--journalit-tradelog-skeleton-grid-template);
  gap: 8px;
  align-items: center;
  padding: 12px 16px;
  min-height: 48px;
  background: var(--background-secondary);
  border-bottom: 1px solid var(--background-modifier-border);
  font-weight: 500;
  position: sticky;
  top: 0;
  z-index: 5;
}

.skeleton-data-row {
  display: grid;
  grid-template-columns: var(--journalit-tradelog-skeleton-grid-template);
  gap: 8px;
  align-items: center;
  padding: 8px 16px;
  min-height: 48px;
  border-bottom: 1px solid var(--background-modifier-border-hover);
}

.skeleton-header-cell,
.skeleton-data-cell {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
}


@media (max-width: 768px) {
  .skeleton-header-row,
  .skeleton-data-row {
    padding: 8px 12px;
    gap: 6px;
  }
}
`;

export function injectTradeLogSkeletonStyles(): void {
  return;
}

export function removeTradeLogSkeletonStyles(): void {
  return;
}
