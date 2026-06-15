

export const METRIC_CARD_SKELETON_STYLES = `
.metric-card-skeleton {
  background: transparent;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid rgba(var(--background-modifier-border-rgb, 0, 0, 0), 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.metric-cards-skeleton {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  gap: 8px;
  padding: 10px 0;
}


@media (max-width: 768px) {
  .metric-card-skeleton {
    padding: 12px;
  }

  .metric-cards-skeleton {
    gap: 6px;
  }
}
`;
