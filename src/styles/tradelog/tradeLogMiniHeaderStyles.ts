

const TRADE_LOG_MINI_HEADER_STYLES = `


.trade-log-mini-header {
  display: flex;
  align-items: center;
  min-height: 32px;
  padding: 6px 0;
  opacity: 0.7;
  pointer-events: none;
}

.tree-indicator-cell-header {
  
}

.mini-header-row {
  display: grid;
  grid-template-columns: var(--journalit-tradelog-mini-grid-template);
  margin-left: calc(-1 * var(--journalit-tree-structure-width, 0px));
  padding-left: var(--journalit-tree-structure-width, 0px);
  gap: 6px;
  align-items: center;
  padding-right: 16px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  width: 100%;
}

.mini-header-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
`;

const refCount = 0;

export function ensureTradeLogMiniHeaderStyles(): void {
  return;
}

export function removeTradeLogMiniHeaderStyles(): void {
  return;
}
