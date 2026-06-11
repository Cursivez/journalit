

import type { Layout } from '../../shared/gridLayout/reactGridLayoutCompat';
import JournalitPlugin from '../../../main';
import {
  DEFAULT_DASHBOARD_LAYOUT,
  DEFAULT_SETTINGS,
  type DashboardSettings,
} from '../../../settings/types';
import { AVAILABLE_METRICS } from '../components/TopSection/types';
import { eventBus } from '../../../services/events';


let saveLayoutTimer: ReturnType<typeof setTimeout> | null = null;


export interface DashboardLayout {
  topSection: string[];
  bottomSection: {
    lg: Layout[];
    md: Layout[];
    sm: Layout[];
    xs: Layout[];
    xxs: Layout[];
  };
}


interface DashboardLayoutSettings {
  layouts: Record<string, DashboardLayout>;
  activeLayout: string;
}


const DEFAULT_LAYOUT: DashboardLayout =
  DEFAULT_DASHBOARD_LAYOUT as DashboardLayout;


const DEFAULT_LAYOUT_SETTINGS: DashboardLayoutSettings = {
  layouts: {
    Default: DEFAULT_LAYOUT,
  },
  activeLayout: 'Default',
};


const getLayoutSettings = (
  plugin: JournalitPlugin
): DashboardLayoutSettings => {
  
  if (!plugin.settings.dashboard) {
    return DEFAULT_LAYOUT_SETTINGS;
  }

  
  const migrateLegacyLayouts = () => {
    const dashboardSettings = plugin.settings.dashboard;
    if (!dashboardSettings) return DEFAULT_LAYOUT_SETTINGS.layouts;

    const layouts: DashboardSettings['layouts'] =
      dashboardSettings.layouts ?? {};
    const migratedLayouts: Record<string, DashboardLayout> = {};

    
    (
      Object.entries(layouts) as Array<
        [string, DashboardSettings['layouts'][string]]
      >
    ).forEach(([name, layout]) => {
      
      if (!layout?.bottomSection) {
        migratedLayouts[name] = JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
        return;
      }

      const sm = layout.bottomSection.sm ?? [];

      
      const xs =
        layout.bottomSection.xs ??
        sm.map((item) => ({
          ...item,
          w: Math.min(item.w, 2), 
        }));

      const xxs =
        layout.bottomSection.xxs ??
        sm.map((item) => ({
          ...item,
          w: 1, 
        }));

      migratedLayouts[name] = {
        topSection: layout.topSection || [],
        bottomSection: {
          lg: layout.bottomSection.lg ?? [],
          md: layout.bottomSection.md ?? [],
          sm,
          xs,
          xxs,
        },
      };
    });

    return migratedLayouts;
  };

  return {
    layouts: migrateLegacyLayouts(),
    activeLayout:
      plugin.settings.dashboard.activeLayout ||
      DEFAULT_LAYOUT_SETTINGS.activeLayout,
  };
};



function safeLayoutSettingsCopy(
  layoutSettings: DashboardLayoutSettings
): DashboardLayoutSettings {
  const layoutsCopy: Record<string, DashboardLayout> = {};

  
  Object.entries(layoutSettings.layouts).forEach(([layoutName, layout]) => {
    layoutsCopy[layoutName] = {
      topSection: [...layout.topSection],
      bottomSection: {
        lg: normalizeLayoutForSave(layout.bottomSection.lg),
        md: normalizeLayoutForSave(layout.bottomSection.md),
        sm: normalizeLayoutForSave(layout.bottomSection.sm),
        xs: normalizeLayoutForSave(layout.bottomSection.xs || []),
        xxs: normalizeLayoutForSave(layout.bottomSection.xxs || []),
      },
    };
  });

  return {
    layouts: layoutsCopy,
    activeLayout: layoutSettings.activeLayout,
  };
}

const saveLayoutSettings = async (
  plugin: JournalitPlugin,
  layoutSettings: DashboardLayoutSettings
): Promise<void> => {
  try {
    
    if (!plugin.settings.dashboard) {
      plugin.settings.dashboard = DEFAULT_SETTINGS.dashboard!;
    }

    
    const safeCopy = safeLayoutSettingsCopy(layoutSettings);

    
    plugin.settings.dashboard.layouts = safeCopy.layouts;
    plugin.settings.dashboard.activeLayout = safeCopy.activeLayout;

    
    await plugin.saveSettings();

    
    eventBus.publish('layout:changed', {
      view: 'dashboard',
      layoutName: layoutSettings.activeLayout,
    });
  } catch (error) {
    console.error('Error saving layout settings:', error);
    throw error; 
  }
};



export const LAYOUT_BOTTOM_POSITION = 9999;


function validateLayoutItems(layoutItems: Layout[]): Layout[] {
  if (!Array.isArray(layoutItems)) {
    return [];
  }

  const seenIds = new Set<string>();
  const normalized: Layout[] = [];

  for (const rawItem of Array.from(layoutItems)) {
    if (!rawItem || typeof rawItem !== 'object') {
      continue;
    }

    const item = rawItem as Layout;

    
    const normalizedItem: Layout = {
      ...item,
      
      i: typeof item.i === 'string' && item.i.length > 0 ? item.i : 'unknown',
      
      x: typeof item.x === 'number' && isFinite(item.x) ? item.x : 0,
      
      y:
        typeof item.y === 'number' && isFinite(item.y)
          ? item.y === 10000000 || item.y === 10000 || item.y === Infinity
            ? LAYOUT_BOTTOM_POSITION
            : item.y
          : item.y === Infinity
            ? LAYOUT_BOTTOM_POSITION
            : 0,
      
      w:
        typeof item.w === 'number' && isFinite(item.w) && item.w > 0
          ? item.w
          : 1,
      
      h:
        typeof item.h === 'number' && isFinite(item.h) && item.h > 0
          ? item.h
          : 1,
    };

    
    if (seenIds.has(normalizedItem.i)) {
      continue;
    }

    seenIds.add(normalizedItem.i);
    normalized.push(normalizedItem);
  }

  return normalized;
}


function validateMetricIds(metricIds: string[]): string[] {
  const validIds = new Set(AVAILABLE_METRICS.map((m) => m.id));

  const validatedIds = metricIds.filter((id) => {
    if (!validIds.has(id)) {
      console.warn(`Invalid metric ID removed from layout: "${id}"`);
      return false;
    }
    return true;
  });

  return validatedIds;
}

export const getActiveLayout = (plugin: JournalitPlugin): DashboardLayout => {
  try {
    const settings = getLayoutSettings(plugin);
    const activeLayoutName = settings.activeLayout;
    const activeLayout = settings.layouts[activeLayoutName];

    if (!activeLayout) {
      console.warn(
        `Active layout '${activeLayoutName}' not found, using default layout`
      );
      return DEFAULT_LAYOUT;
    }

    
    if (!activeLayout.topSection || !activeLayout.bottomSection) {
      console.warn(
        `Active layout '${activeLayoutName}' is malformed, using default layout`
      );
      return DEFAULT_LAYOUT;
    }

    
    if (
      !activeLayout.bottomSection.lg ||
      !activeLayout.bottomSection.md ||
      !activeLayout.bottomSection.sm ||
      !activeLayout.bottomSection.xs ||
      !activeLayout.bottomSection.xxs
    ) {
      console.warn(
        `Active layout '${activeLayoutName}' is missing breakpoint layouts, fixing...`
      );

      
      const fixedLayout: DashboardLayout = {
        topSection: validateMetricIds(activeLayout.topSection || []),
        bottomSection: {
          lg: validateLayoutItems(activeLayout.bottomSection.lg || []),
          md: validateLayoutItems(activeLayout.bottomSection.md || []),
          sm: validateLayoutItems(activeLayout.bottomSection.sm || []),
          xs: validateLayoutItems(activeLayout.bottomSection.xs || []),
          xxs: validateLayoutItems(activeLayout.bottomSection.xxs || []),
        },
      };

      
      (async () => {
        try {
          await saveLayout(plugin, activeLayoutName, fixedLayout);
        } catch (error) {
          console.error(`Failed to save fixed layout: ${error}`);
        }
      })();

      return fixedLayout;
    }

    
    const normalizedLayout = {
      topSection: validateMetricIds(activeLayout.topSection || []),
      bottomSection: {
        lg: validateLayoutItems(activeLayout.bottomSection.lg || []),
        md: validateLayoutItems(activeLayout.bottomSection.md || []),
        sm: validateLayoutItems(activeLayout.bottomSection.sm || []),
        xs: validateLayoutItems(activeLayout.bottomSection.xs || []),
        xxs: validateLayoutItems(activeLayout.bottomSection.xxs || []),
      },
    };

    return normalizedLayout;
  } catch (error) {
    console.error('Error retrieving active layout:', error);
    return DEFAULT_LAYOUT;
  }
};



function normalizeLayoutForSave(layoutItems: Layout[]): Layout[] {
  return validateLayoutItems(layoutItems).map((item) => ({
    ...item,
    
    x: typeof item.x === 'number' && isFinite(item.x) ? item.x : 0,
    y:
      typeof item.y === 'number' && isFinite(item.y)
        ? item.y === Infinity
          ? LAYOUT_BOTTOM_POSITION
          : item.y
        : item.y === Infinity
          ? LAYOUT_BOTTOM_POSITION
          : 0,
    w:
      typeof item.w === 'number' && isFinite(item.w) && item.w > 0 ? item.w : 1,
    h:
      typeof item.h === 'number' && isFinite(item.h) && item.h > 0 ? item.h : 1,
  }));
}

export const saveLayout = async (
  plugin: JournalitPlugin,
  name: string,
  layout: DashboardLayout
): Promise<void> => {
  
  return new Promise((resolve, reject) => {
    if (saveLayoutTimer) {
      clearTimeout(saveLayoutTimer);
    }

    saveLayoutTimer = setTimeout(async () => {
      try {
        await saveLayoutInternal(plugin, name, layout);
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};


const saveLayoutInternal = async (
  plugin: JournalitPlugin,
  name: string,
  layout: DashboardLayout
): Promise<void> => {
  try {
    const settings = getLayoutSettings(plugin);

    
    const layoutCopy: DashboardLayout = {
      topSection: [...layout.topSection],
      bottomSection: {
        lg: normalizeLayoutForSave(layout.bottomSection.lg),
        md: normalizeLayoutForSave(layout.bottomSection.md),
        sm: normalizeLayoutForSave(layout.bottomSection.sm),
        xs: normalizeLayoutForSave(layout.bottomSection.xs || []),
        xxs: normalizeLayoutForSave(layout.bottomSection.xxs || []),
      },
    };

    
    const allWidgetIds = new Set<string>();

    
    Object.values(layoutCopy.bottomSection).forEach((bpLayout) => {
      bpLayout.forEach((item: Layout) => allWidgetIds.add(item.i));
    });

    
    const cols: Record<string, number> = {
      lg: 12,
      md: 6,
      sm: 4,
      xs: 2,
      xxs: 1,
    };

    const sourceItemsByWidgetId = new Map<string, Layout>();
    for (const sourceBp of ['lg', 'md', 'sm', 'xs', 'xxs'] as const) {
      for (const item of layoutCopy.bottomSection[sourceBp] || []) {
        if (!sourceItemsByWidgetId.has(item.i)) {
          sourceItemsByWidgetId.set(item.i, item);
        }
      }
    }

    
    (Object.entries(layoutCopy.bottomSection) as [string, Layout[]][]).forEach(
      ([bp, bpLayout]) => {
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
      }
    );

    
    settings.layouts[name] = layoutCopy;

    
    await saveLayoutSettings(plugin, settings);
  } catch (error) {
    console.error(`Error saving layout '${name}':`, error);
    throw error; 
  }
};
