import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import type { FilterState } from '../components/dashboard/DashboardView';
import { eventBus } from '../services/events/EventBus';
import { t } from '../lang/helpers';

export const CALENDAR_SIDEBAR_VIEW_TYPE = 'journalit-calendar-sidebar-view';



const SIDEBAR_CALENDAR_FILTERS: FilterState = {
  ...createDashboardFilters(),
  tradeTypes: ['regular', 'missed'],
};

function useCalendarTrades(plugin: JournalitPlugin): {
  trades: Trade[];
  isLoading: boolean;
} {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = useRef(false);
  const loadGenerationRef = useRef(0);
  
  
  const authoritativeLoadDoneRef = useRef(false);

  const loadTrades = useCallback(
    async (showSkeleton: boolean) => {
      const generation = ++loadGenerationRef.current;
      if (showSkeleton && !hasLoadedRef.current) {
        setIsLoading(true);
      }
      const tradeService = plugin.serviceManager.getTradeService();
      await tradeService.waitForTradeDataReady();
      if (generation !== loadGenerationRef.current) {
        return;
      }
      return fetchDashboardData(
        plugin.app,
        tradeService,
        SIDEBAR_CALENDAR_FILTERS,
        plugin.settings.trade?.defaultRiskAmount,
        plugin,
        { freshTradeQuery: !authoritativeLoadDoneRef.current }
      ).then((data) => {
        authoritativeLoadDoneRef.current = true;
        if (generation !== loadGenerationRef.current) {
          return;
        }
        setTrades(data.trades);
        hasLoadedRef.current = true;
        setIsLoading(false);
      });
    },
    [plugin]
  );

  useEffect(() => {
    void loadTrades(true);
    const unsubscribeTrades = eventBus.subscribe('trade-data:changed', () => {
      void loadTrades(false);
    });
    const unsubscribeMissedTrades = eventBus.subscribe(
      'missed-trade-data:changed',
      () => void loadTrades(false)
    );
    return () => {
      loadGenerationRef.current += 1;
      unsubscribeTrades();
      unsubscribeMissedTrades();
    };
  }, [loadTrades]);

  return { trades, isLoading };
}

const CalendarSidebar: React.FC<{ plugin: JournalitPlugin }> = ({ plugin }) => {
  const { trades, isLoading } = useCalendarTrades(plugin);

  return (
    <div className="journalit-calendar-sidebar">
      {isLoading ? (
        <DashboardWidgetSkeleton type="calendar" />
      ) : (
        <PerformanceCalendar
          trades={trades}
          compactWidthThreshold={300}
          compactHeightThreshold={275}
          navigationSource="sidebar"
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
