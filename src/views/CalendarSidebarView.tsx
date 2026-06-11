import React, { useCallback, useEffect, useState } from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import JournalitPlugin from '../main';
import { PerformanceCalendar } from '../components/charts/PerformanceCalendar';
import { DashboardWidgetSkeleton } from '../components/dashboard/components/DashboardWidgets/DashboardWidgetSkeleton';
import {
  fetchDashboardData,
  Trade,
} from '../components/dashboard/utils/dataUtils';
import { createDashboardFilters } from '../settings/viewFiltersDefaults';
import { eventBus } from '../services/events';
import {
  ensureDashboardStyles,
  injectDashboardStyles,
} from '../styles/dashboardStyles';
import { t } from '../lang/helpers';

export const CALENDAR_SIDEBAR_VIEW_TYPE = 'journalit-calendar-sidebar-view';

const CalendarSidebar: React.FC<{ plugin: JournalitPlugin }> = ({ plugin }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrades = useCallback(async () => {
    setIsLoading(true);
    const tradeService = plugin.serviceManager.getTradeService();
    await tradeService.waitForTradeDataReady();
    const data = await fetchDashboardData(
      plugin.app,
      tradeService,
      createDashboardFilters(),
      plugin.settings.trade?.defaultRiskAmount,
      plugin,
      { freshTradeQuery: true }
    );
    setTrades(data.trades);
    setIsLoading(false);
  }, [plugin]);

  useEffect(() => {
    void loadTrades();
    const unsubscribe = eventBus.subscribe('trade:changed', () => {
      void loadTrades();
    });
    return unsubscribe;
  }, [loadTrades]);

  return (
    <div className="journalit-calendar-sidebar">
      {isLoading ? (
        <DashboardWidgetSkeleton type="calendar" />
      ) : (
        <PerformanceCalendar
          trades={trades}
          compactWidthThreshold={300}
          compactHeightThreshold={275}
        />
      )}
    </div>
  );
};

export class CalendarSidebarView extends ReactView {
  private plugin: JournalitPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: JournalitPlugin) {
    super(leaf, {
      containerClass: 'journalit-calendar-sidebar-view-container',
      rootId: 'journalit-calendar-sidebar-view',
    });
    this.plugin = plugin;
  }

  getViewType(): string {
    return CALENDAR_SIDEBAR_VIEW_TYPE;
  }

  getDisplayText(): string {
    return t('calendar.sidebar.title');
  }

  getIcon(): string {
    return 'calendar-search';
  }

  async onOpen(): Promise<void> {
    this.containerEl.addClass('journalit-calendar-sidebar-view-container');
    await super.onOpen();
  }

  protected getRenderFunction(): RenderFunction {
    const CalendarSidebarRenderer = () => (
      <CalendarSidebar plugin={this.plugin} />
    );
    CalendarSidebarRenderer.displayName = 'CalendarSidebarRenderer';
    return CalendarSidebarRenderer;
  }
}
