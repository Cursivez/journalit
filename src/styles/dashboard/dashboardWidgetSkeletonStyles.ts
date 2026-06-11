

const DASHBOARD_WIDGET_SKELETON_STYLES = `
.dashboard-widget-skeleton {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  box-sizing: border-box;
}

.dashboard-widget-skeleton-chart {
  height: 100%;
  min-height: 100px;
}

.dashboard-widget-skeleton-table {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-table-header,
.skeleton-table-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 0.5rem;
}

.skeleton-table-header {
  border-bottom: 1px solid var(--background-modifier-border);
  padding-bottom: 0.75rem;
}

.dashboard-widget-skeleton-calendar {
  height: 100%;
}

.skeleton-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .dashboard-widget-skeleton {
    min-height: 100px;
  }

  .skeleton-calendar-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
  }
}
`;


const referenceCount = 0;

export function injectDashboardWidgetSkeletonStyles(): void {
  return;
}

export function removeDashboardWidgetSkeletonStyles(): void {
  return;
}
