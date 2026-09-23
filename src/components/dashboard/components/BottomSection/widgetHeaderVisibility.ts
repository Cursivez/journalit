const WIDGETS_WITH_MINIMAL_HEADERS = new Set([
  'pnlChart',
  'longPnLChart',
  'shortPnLChart',
  'drawdownChart',
  'longDrawdownChart',
  'shortDrawdownChart',
]);

interface DashboardWidgetMinimalHeaderVisibilityInput {
  widgetId: string;
  hasDashboardData: boolean;
  hasError: boolean;
}


export const shouldShowDashboardWidgetMinimalHeader = ({
  widgetId,
  hasDashboardData,
  hasError,
}: DashboardWidgetMinimalHeaderVisibilityInput): boolean =>
  WIDGETS_WITH_MINIMAL_HEADERS.has(widgetId) && (hasDashboardData || hasError);
