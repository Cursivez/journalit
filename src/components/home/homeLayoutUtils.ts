

import type { Layout } from '../shared/gridLayout/reactGridLayoutCompat';
import {
  createDefaultHomeLayout,
  HOME_LAYOUT_BREAKPOINTS,
  type HomeLayout,
} from './defaultHomeLayout';
import JournalitPlugin from '../../main';
import {
  normalizeLayoutForSave,
  LAYOUT_BOTTOM_POSITION,
} from '../shared/gridLayout/gridLayoutUtils';
import { eventBus } from '../../services/events/EventBus';


let saveLayoutTimer: number | null = null;
let pendingSaveWaiters: Array<{
  resolve: () => void;
  reject: (reason: Error) => void;
}> = [];

export type { HomeLayout };



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


const DEFAULT_LAYOUT: HomeLayout = createDefaultHomeLayout();


const DEFAULT_LAYOUT_SETTINGS: HomeLayoutSettings = {
  layouts: {
    Default: DEFAULT_LAYOUT,
  },
  activeLayout: 'Default',
};


export const getSavedHomeLgLayouts = (plugin: JournalitPlugin): Layout[][] =>
  Object.values(plugin.settings.home?.layouts ?? {}).map(
    (layout) => layout?.lg ?? []
  );


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


const applyLayoutSettings = (
  plugin: JournalitPlugin,
  layoutSettings: HomeLayoutSettings
): void => {
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
};


const persistLayoutSettings = async (
  plugin: JournalitPlugin
): Promise<void> => {
  if (!plugin.app.workspace.layoutReady) {
    await new Promise<void>((resolve) =>
      plugin.app.workspace.onLayoutReady(resolve)
    );
  }

  await plugin.saveSettings();

  eventBus.publish('layout:changed', {
    view: 'home',
    layoutName: getLayoutSettings(plugin).activeLayout,
  });
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
        lg: normalizeLayoutForSave(activeLayout.lg || []),
        md: normalizeLayoutForSave(activeLayout.md || []),
        sm: normalizeLayoutForSave(activeLayout.sm || []),
        xs: normalizeLayoutForSave(activeLayout.xs || []),
        xxs: normalizeLayoutForSave(activeLayout.xxs || []),
      };

      void (async () => {
        try {
          await saveLayout(plugin, fixedLayout);
        } catch (error) {
          console.error(`Failed to save fixed home layout: ${error}`);
        }
      })();

      return fixedLayout;
    }

    const normalizedLayout = {
      lg: normalizeLayoutForSave(activeLayout.lg || []),
      md: normalizeLayoutForSave(activeLayout.md || []),
      sm: normalizeLayoutForSave(activeLayout.sm || []),
      xs: normalizeLayoutForSave(activeLayout.xs || []),
      xxs: normalizeLayoutForSave(activeLayout.xxs || []),
    };

    return normalizedLayout;
  } catch (error) {
    console.error('Error retrieving active home layout:', error);
    return DEFAULT_LAYOUT;
  }
};


export const saveLayout = (
  plugin: JournalitPlugin,
  layout: HomeLayout
): Promise<void> => {
  try {
    applyLayout(plugin, layout);
  } catch (error) {
    console.error('Error saving home layout:', error);
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }

  return new Promise((resolve, reject) => {
    if (saveLayoutTimer) {
      window.clearTimeout(saveLayoutTimer);
    }
    pendingSaveWaiters.push({ resolve, reject });

    saveLayoutTimer = window.setTimeout(() => {
      saveLayoutTimer = null;
      const waiters = pendingSaveWaiters;
      pendingSaveWaiters = [];
      void (async () => {
        try {
          await persistLayoutSettings(plugin);
          waiters.forEach((waiter) => waiter.resolve());
        } catch (error) {
          console.error('Error saving home layout settings:', error);
          const reason =
            error instanceof Error ? error : new Error(String(error));
          waiters.forEach((waiter) => waiter.reject(reason));
        }
      })();
    }, 300);
  });
};


const applyLayout = (plugin: JournalitPlugin, layout: HomeLayout): void => {
  
  const layoutCopy: HomeLayout = {
    lg: normalizeLayoutForSave(layout.lg || []),
    md: normalizeLayoutForSave(layout.md || []),
    sm: normalizeLayoutForSave(layout.sm || []),
    xs: normalizeLayoutForSave(layout.xs || []),
    xxs: normalizeLayoutForSave(layout.xxs || []),
  };

  
  const allWidgetIds = new Set<string>();
  for (const breakpoint of HOME_LAYOUT_BREAKPOINTS) {
    layoutCopy[breakpoint].forEach((item: Layout) => allWidgetIds.add(item.i));
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

  HOME_LAYOUT_BREAKPOINTS.forEach((bp) => {
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
  settings.layouts[settings.activeLayout] = layoutCopy;
  applyLayoutSettings(plugin, settings);
};

export {};
