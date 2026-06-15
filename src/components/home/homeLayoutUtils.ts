

import type { Layout } from '../shared/gridLayout/reactGridLayoutCompat';
import JournalitPlugin from '../../main';
import {
  normalizeLayoutForSave as sharedNormalizeLayout,
  LAYOUT_BOTTOM_POSITION,
} from '../shared/gridLayout/gridLayoutUtils';
import { eventBus } from '../../services/events';


let saveLayoutTimer: number | null = null;

const HOME_LAYOUT_BREAKPOINTS = ['lg', 'md', 'sm', 'xs', 'xxs'] as const;

type HomeLayoutBreakpoint = (typeof HOME_LAYOUT_BREAKPOINTS)[number];


export interface HomeLayout {
  lg: Layout[];
  md: Layout[];
  sm: Layout[];
  xs: Layout[];
  xxs: Layout[];
}



const cloneHomeLayout = (layout: HomeLayout): HomeLayout => ({
  lg: layout.lg.map((item) => ({ ...item })),
  md: layout.md.map((item) => ({ ...item })),
  sm: layout.sm.map((item) => ({ ...item })),
  xs: layout.xs.map((item) => ({ ...item })),
  xxs: layout.xxs.map((item) => ({ ...item })),
});

interface HomeLayoutSettings {
  layouts: Record<string, HomeLayout>;
  activeLayout: string;
}


export { LAYOUT_BOTTOM_POSITION } from '../shared/gridLayout/gridLayoutUtils';


const DEFAULT_LAYOUT: HomeLayout = {
  lg: [
    { i: 'weeklySummary', x: 2, y: 4, w: 4, h: 4 },
    { i: 'gettingStarted', x: 6, y: 2, w: 3, h: 6 },
    { i: 'unreviewedTrades', x: 6, y: 0, w: 3, h: 2 },
    { i: 'recentItems', x: 0, y: 4, w: 2, h: 4 },
    { i: 'positionSize', x: 9, y: 0, w: 3, h: 8 },
    { i: 'yearHeatmap', x: 0, y: 0, w: 6, h: 4 },
  ],
  md: [
    { i: 'weeklySummary', x: 3, y: 1, w: 3, h: 5 },
    { i: 'gettingStarted', x: 0, y: 0, w: 3, h: 6 },
    { i: 'unreviewedTrades', x: 3, y: 0, w: 3, h: 1 },
    { i: 'recentItems', x: 3, y: 11, w: 3, h: 8 },
    { i: 'positionSize', x: 0, y: 11, w: 3, h: 8 },
    { i: 'yearHeatmap', x: 0, y: 6, w: 6, h: 5 },
  ],
  sm: [
    { i: 'weeklySummary', x: 0, y: 1, w: 2, h: 5 },
    { i: 'gettingStarted', x: 2, y: 0, w: 2, h: 6 },
    { i: 'unreviewedTrades', x: 0, y: 0, w: 2, h: 1 },
    { i: 'recentItems', x: 0, y: 11, w: 2, h: 7 },
    { i: 'positionSize', x: 2, y: 11, w: 2, h: 7 },
    { i: 'yearHeatmap', x: 0, y: 6, w: 4, h: 5 },
  ],
  xs: [
    { i: 'weeklySummary', x: 0, y: 6, w: 2, h: 4 },
    { i: 'gettingStarted', x: 0, y: 0, w: 1, h: 6 },
    { i: 'unreviewedTrades', x: 0, y: 10, w: 2, h: 2 },
    { i: 'recentItems', x: 1, y: 0, w: 1, h: 6 },
    { i: 'positionSize', x: 0, y: 17, w: 2, h: 7 },
    { i: 'yearHeatmap', x: 0, y: 12, w: 2, h: 5 },
  ],
  xxs: [
    { i: 'weeklySummary', x: 0, y: 6, w: 1, h: 4 },
    { i: 'gettingStarted', x: 0, y: 0, w: 1, h: 6 },
    { i: 'unreviewedTrades', x: 0, y: 10, w: 1, h: 2 },
    { i: 'recentItems', x: 0, y: 12, w: 1, h: 5 },
    { i: 'positionSize', x: 0, y: 22, w: 1, h: 7 },
    { i: 'yearHeatmap', x: 0, y: 17, w: 1, h: 5 },
  ],
};


const DEFAULT_LAYOUT_SETTINGS: HomeLayoutSettings = {
  layouts: {
    Default: DEFAULT_LAYOUT,
  },
  activeLayout: 'Default',
};


function normalizeLayoutForSave(layoutItems: Layout[]): Layout[] {
  return sharedNormalizeLayout(layoutItems);
}


function validateLayoutItems(layoutItems: Layout[]): Layout[] {
  return sharedNormalizeLayout(layoutItems);
}


function safeLayoutSettingsCopy(
  layoutSettings: HomeLayoutSettings
): HomeLayoutSettings {
  const layoutsCopy: Record<string, HomeLayout> = {};

  Object.entries(layoutSettings.layouts).forEach(([layoutName, layout]) => {
    layoutsCopy[layoutName] = {
      lg: normalizeLayoutForSave(layout.lg || []),
      md: normalizeLayoutForSave(layout.md || []),
      sm: normalizeLayoutForSave(layout.sm || []),
      xs: normalizeLayoutForSave(layout.xs || []),
      xxs: normalizeLayoutForSave(layout.xxs || []),
    };
  });

  return {
    layouts: layoutsCopy,
    activeLayout: layoutSettings.activeLayout,
  };
}


const getLayoutSettings = (plugin: JournalitPlugin): HomeLayoutSettings => {
  if (!plugin.settings.home) {
    return DEFAULT_LAYOUT_SETTINGS;
  }

  const homeSettings = plugin.settings.home;
  const layouts = homeSettings.layouts || {};
  const migratedLayouts: Record<string, HomeLayout> = {};

  Object.entries(layouts).forEach(([name, layout]) => {
    if (!layout) {
      migratedLayouts[name] = cloneHomeLayout(DEFAULT_LAYOUT);
      return;
    }

    const xs =
      layout.xs ||
      layout.sm?.map((item: Layout) => ({
        ...item,
        w: Math.min(item.w, 2),
      })) ||
      [];

    const xxs =
      layout.xxs ||
      layout.sm?.map((item: Layout) => ({
        ...item,
        w: 1,
      })) ||
      [];

    migratedLayouts[name] = {
      lg: layout.lg || [],
      md: layout.md || [],
      sm: layout.sm || [],
      xs,
      xxs,
    };
  });

  return {
    layouts: migratedLayouts,
    activeLayout:
      homeSettings.activeLayout || DEFAULT_LAYOUT_SETTINGS.activeLayout,
  };
};


const saveLayoutSettings = async (
  plugin: JournalitPlugin,
  layoutSettings: HomeLayoutSettings
): Promise<void> => {
  try {
    
    if (!plugin.app.workspace.layoutReady) {
      plugin.app.workspace.onLayoutReady(() => {
        void saveLayoutSettings(plugin, layoutSettings);
      });
      return;
    }

    if (!plugin.settings.home) {
      plugin.settings.home = {
        layouts: {},
        activeLayout: 'Default',
        recentItems: [],
      };
    }

    const safeCopy = safeLayoutSettingsCopy(layoutSettings);

    plugin.settings.home.layouts = safeCopy.layouts;
    plugin.settings.home.activeLayout = safeCopy.activeLayout;

    await plugin.saveSettings();

    
    eventBus.publish('layout:changed', {
      view: 'home',
      layoutName: layoutSettings.activeLayout,
    });
  } catch (error) {
    console.error('Error saving home layout settings:', error);
    throw error;
  }
};


export const getActiveLayout = (plugin: JournalitPlugin): HomeLayout => {
  try {
    const settings = getLayoutSettings(plugin);
    const activeLayoutName = settings.activeLayout;
    const activeLayout = settings.layouts[activeLayoutName];

    if (!activeLayout) {
      console.warn(
        `Active home layout '${activeLayoutName}' not found, using default layout`
      );
      return DEFAULT_LAYOUT;
    }

    if (
      !activeLayout.lg ||
      !activeLayout.md ||
      !activeLayout.sm ||
      !activeLayout.xs ||
      !activeLayout.xxs
    ) {
      console.warn(
        `Active home layout '${activeLayoutName}' is missing breakpoint layouts, fixing...`
      );

      const fixedLayout: HomeLayout = {
        lg: validateLayoutItems(activeLayout.lg || []),
        md: validateLayoutItems(activeLayout.md || []),
        sm: validateLayoutItems(activeLayout.sm || []),
        xs: validateLayoutItems(activeLayout.xs || []),
        xxs: validateLayoutItems(activeLayout.xxs || []),
      };

      void (async () => {
        try {
          await saveLayout(plugin, activeLayoutName, fixedLayout);
        } catch (error) {
          console.error(`Failed to save fixed home layout: ${error}`);
        }
      })();

      return fixedLayout;
    }

    const normalizedLayout = {
      lg: validateLayoutItems(activeLayout.lg || []),
      md: validateLayoutItems(activeLayout.md || []),
      sm: validateLayoutItems(activeLayout.sm || []),
      xs: validateLayoutItems(activeLayout.xs || []),
      xxs: validateLayoutItems(activeLayout.xxs || []),
    };

    return normalizedLayout;
  } catch (error) {
    console.error('Error retrieving active home layout:', error);
    return DEFAULT_LAYOUT;
  }
};


export const saveLayout = async (
  plugin: JournalitPlugin,
  name: string,
  layout: HomeLayout
): Promise<void> => {
  
  return new Promise((resolve, reject) => {
    if (saveLayoutTimer) {
      window.clearTimeout(saveLayoutTimer);
    }

    saveLayoutTimer = window.setTimeout(() => {
      void (async () => {
        try {
          await saveLayoutInternal(plugin, name, layout);
          resolve();
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      })();
    }, 300);
  });
};


const saveLayoutInternal = async (
  plugin: JournalitPlugin,
  name: string,
  layout: HomeLayout
): Promise<void> => {
  try {
    
    const layoutCopy: HomeLayout = {
      lg: normalizeLayoutForSave(layout.lg || []),
      md: normalizeLayoutForSave(layout.md || []),
      sm: normalizeLayoutForSave(layout.sm || []),
      xs: normalizeLayoutForSave(layout.xs || []),
      xxs: normalizeLayoutForSave(layout.xxs || []),
    };

    
    const allWidgetIds = new Set<string>();
    for (const breakpoint of HOME_LAYOUT_BREAKPOINTS) {
      layoutCopy[breakpoint].forEach((item: Layout) =>
        allWidgetIds.add(item.i)
      );
    }

    const cols: Record<string, number> = {
      lg: 12,
      md: 6,
      sm: 4,
      xs: 2,
      xxs: 1,
    };

    const sourceItemsByWidgetId = new Map<string, Layout>();
    for (const sourceBp of HOME_LAYOUT_BREAKPOINTS) {
      for (const item of layoutCopy[sourceBp] || []) {
        if (!sourceItemsByWidgetId.has(item.i)) {
          sourceItemsByWidgetId.set(item.i, item);
        }
      }
    }

    HOME_LAYOUT_BREAKPOINTS.forEach((bp: HomeLayoutBreakpoint) => {
      const bpLayout = layoutCopy[bp];
      const bpWidgetIds = new Set(bpLayout.map((item: Layout) => item.i));

      allWidgetIds.forEach((widgetId) => {
        if (!bpWidgetIds.has(widgetId)) {
          const sourceItem = sourceItemsByWidgetId.get(widgetId);

          if (sourceItem) {
            bpLayout.push({
              i: widgetId,
              x: 0,
              y: LAYOUT_BOTTOM_POSITION,
              w: Math.min(sourceItem.w, cols[bp]),
              h: sourceItem.h,
            });
          }
        }
      });
    });

    
    const settings = getLayoutSettings(plugin);
    settings.layouts[name] = layoutCopy;

    
    await saveLayoutSettings(plugin, settings);
  } catch (error) {
    console.error(`Error saving home layout '${name}':`, error);
    throw error;
  }
};

export {};
