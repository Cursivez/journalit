

const ACCOUNT_PAGE_SKELETON_STYLES = `
.journalit-account-page-view .account-page-skeleton {
  width: 100%;
  flex: 1 1 0;
  min-height: 0;
  max-height: 100%;
  height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.journalit-account-page-view .account-page-skeleton-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-secondary);
}

.journalit-account-page-view .account-page-skeleton-chart {
  width: 100%;
}

.journalit-account-page-view .account-page-skeleton-chart .dashboard-widget-skeleton-chart {
  height: 320px;
}

.journalit-account-page-view .account-page-skeleton-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.journalit-account-page-view .skeleton-metric-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
}

.journalit-account-page-view .account-page-skeleton-risk {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.journalit-account-page-view .skeleton-risk-visualizations {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.journalit-account-page-view .account-page-skeleton-transactions,
.journalit-account-page-view .account-page-skeleton-trades {
  width: 100%;
}

.journalit-account-page-view .account-page-skeleton-transactions .dashboard-widget-skeleton,
.journalit-account-page-view .account-page-skeleton-trades .dashboard-widget-skeleton {
  padding: 16px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-secondary);
}

@media (max-width: 768px) {
  .journalit-account-page-view .account-page-skeleton {
    padding: 1rem;
    gap: 1.5rem;
  }

  .journalit-account-page-view .account-page-skeleton-metrics {
    grid-template-columns: 1fr;
  }

  .journalit-account-page-view .skeleton-risk-visualizations {
    grid-template-columns: 1fr;
  }
}
`;


const referenceCount = 0;

export function injectAccountPageSkeletonStyles(): void {
  return;
}

export function removeAccountPageSkeletonStyles(): void {
  return;
}
