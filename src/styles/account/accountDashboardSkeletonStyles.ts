

export const ACCOUNT_DASHBOARD_SKELETON_STYLES = `
.journalit-account-dashboard .account-dashboard-skeleton {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--account-dashboard-space-xl, 24px);
}

.journalit-account-dashboard .account-dashboard-skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px var(--account-dashboard-content-gutter, 20px);
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
}

.journalit-account-dashboard .account-dashboard-skeleton-header-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.journalit-account-dashboard .skeleton-header-actions {
  display: flex;
  gap: 0.5rem;
}

.journalit-account-dashboard .account-dashboard-skeleton-aum,
.journalit-account-dashboard .account-dashboard-skeleton-weights {
  width: 100%;
}

.journalit-account-dashboard .account-dashboard-skeleton-aum .dashboard-widget-skeleton-chart {
  height: 320px;
}

.journalit-account-dashboard .account-dashboard-skeleton-weights .dashboard-widget-skeleton-chart {
  height: 120px;
}

.journalit-account-dashboard .account-dashboard-skeleton-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--account-dashboard-space-md, 16px);
}

.journalit-account-dashboard .skeleton-metric-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--background-secondary);
}

.journalit-account-dashboard .account-dashboard-skeleton-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.journalit-account-dashboard .skeleton-account-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.journalit-account-dashboard .skeleton-account-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: 8px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
}

.journalit-account-dashboard .skeleton-account-card-metrics {
  display: flex;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--background-modifier-border-hover);
}

@media (max-width: 768px) {
  .journalit-account-dashboard .account-dashboard-skeleton {
    gap: 1.5rem;
  }

  .journalit-account-dashboard .account-dashboard-skeleton-metrics {
    grid-template-columns: 1fr;
  }

  .journalit-account-dashboard .skeleton-account-cards {
    grid-template-columns: 1fr;
  }
}
`;
