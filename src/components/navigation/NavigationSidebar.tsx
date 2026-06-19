import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { SlidersHorizontal } from '../shared/icons/ObsidianIcon';
import { LOGO_DATA_URI } from '../../assets/logoData';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  Modifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import JournalitPlugin from '../../main';
import {
  SidebarNavItem,
  QuickLinkAction,
  DEFAULT_SETTINGS,
} from '../../settings/types';
import { QuickLinkActionResolver } from '../../utils/QuickLinkActionResolver';
import { resolveIcon } from '../../utils/iconResolver';
import { hasTranslation, t, TranslationKey } from '../../lang/helpers';
import { SidebarNavItemComponent } from './SidebarNavItem';
import { SidebarSearch } from './SidebarSearch';

const SECTIONS = ['overview', 'reviews', 'tools'] as const;
type Section = (typeof SECTIONS)[number];

const SECTION_LABEL_KEYS: Record<Section, TranslationKey> = {
  overview: 'navigation.section.overview',
  reviews: 'navigation.section.reviews',
  tools: 'navigation.section.tools',
};

const restrictToVerticalAxis: Modifier = ({ transform }) => ({
  ...transform,
  x: 0,
});

const restrictToActiveNavigationSection: Modifier = ({
  active,
  activeNodeRect,
  transform,
}) => {
  if (!active || !activeNodeRect) return transform;

  const activeElement = window.activeDocument.querySelector<HTMLElement>(
    `[data-nav-item-id="${active.id.toString()}"]`
  );
  const sectionElement = activeElement?.closest<HTMLElement>(
    '.journalit-nav-section'
  );
  if (!sectionElement) return transform;

  const sectionRect = sectionElement.getBoundingClientRect();
  const minY = sectionRect.top - activeNodeRect.top;
  const maxY = sectionRect.bottom - activeNodeRect.bottom;

  return {
    ...transform,
    x: 0,
    y: Math.min(Math.max(transform.y, minY), maxY),
  };
};

const VIEW_ACTION_MAP: Record<string, string> = {
  openHome: 'journalit-home-view',
  openTradingDashboard: 'journalit-dashboard-view',
  openTradeLog: 'journalit-trade-log-view',
  openAccountDashboard: 'account-dashboard',
  openCSVImport: 'journalit-csv-import-view',
  openLayoutBuilder: 'journalit-template-builder-view',
};

const QUICK_LINK_ACTIONS: ReadonlySet<string> = new Set([
  'addTrade',
  'openTradeLog',
  'openTradingDashboard',
  'openAccountDashboard',
  'openTodaysDRC',
  'openWeeklyReview',
  'openMonthlyReview',
  'openCSVImport',
  'openQuickTradeImport',
  'openLayoutBuilder',
  'openHome',
  'openQuarterlyReview',
  'openYearlyReview',
  'openPositionSizeCalculator',
]);

const isQuickLinkAction = (action: string): action is QuickLinkAction =>
  QUICK_LINK_ACTIONS.has(action);

const REVIEW_ACTIONS = new Set<QuickLinkAction>([
  'openTodaysDRC',
  'openWeeklyReview',
  'openMonthlyReview',
  'openQuarterlyReview',
  'openYearlyReview',
]);

function mergeNavigationItemsWithDefaults(currentItems: SidebarNavItem[]): {
  items: SidebarNavItem[];
  changed: boolean;
} {
  const defaultItems = DEFAULT_SETTINGS.navigation?.items || [];

  const currentById = new Map(
    currentItems.map((item, index) => [item.id, { item, index }])
  );
  const merged = [...currentItems];
  let changed = false;

  for (const defaultItem of defaultItems) {
    const current = currentById.get(defaultItem.id);
    if (current) {
      const updatedItem = {
        ...current.item,
        label: defaultItem.label,
        icon: defaultItem.icon,
        action: defaultItem.action,
        section: defaultItem.section,
      };

      if (
        updatedItem.label !== current.item.label ||
        updatedItem.icon !== current.item.icon ||
        updatedItem.action !== current.item.action ||
        updatedItem.section !== current.item.section
      ) {
        merged[current.index] = updatedItem;
        changed = true;
      }
      continue;
    }

    const maxSectionOrder = merged
      .filter((item) => item.section === defaultItem.section)
      .reduce((max, item) => Math.max(max, item.order), -1);

    merged.push({
      ...defaultItem,
      order: maxSectionOrder + 1,
      visible: true,
    });
    changed = true;
  }

  return { items: merged, changed };
}

interface NavigationSidebarProps {
  plugin: JournalitPlugin;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  plugin,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [localNavItems, setLocalNavItems] = useState<SidebarNavItem[]>([]);

  useEffect(() => {
    const settingsItems = plugin.settings.navigation?.items;
    if (settingsItems && settingsItems.length > 0) {
      const { items, changed } =
        mergeNavigationItemsWithDefaults(settingsItems);
      setLocalNavItems(items);

      if (changed) {
        plugin.settings.navigation = {
          ...plugin.settings.navigation!,
          items,
        };
        void plugin.saveSettings();
      }
      return;
    }

    const defaultItems = DEFAULT_SETTINGS.navigation?.items || [];
    if (defaultItems.length > 0) {
      setLocalNavItems(defaultItems);
      if (!plugin.settings.navigation) {
        plugin.settings.navigation = {
          ...DEFAULT_SETTINGS.navigation!,
        };
      } else {
        plugin.settings.navigation.items = defaultItems;
      }
      void plugin.saveSettings();
    }
  }, [plugin]);

  const actionResolver = useMemo(
    () => new QuickLinkActionResolver(plugin),
    [plugin]
  );

  const visibleBySection = useMemo(() => {
    const result: Record<Section, SidebarNavItem[]> = {
      overview: [],
      reviews: [],
      tools: [],
    };
    for (const item of localNavItems) {
      if (item.visible && result[item.section]) {
        result[item.section].push(item);
      }
    }
    for (const section of SECTIONS) {
      result[section].sort((a, b) => a.order - b.order);
    }
    return result;
  }, [localNavItems]);

  const hiddenItems = useMemo(
    () => localNavItems.filter((item) => !item.visible),
    [localNavItems]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activeId = active.id.toString();
      const overId = over.id.toString();

      const activeItem = localNavItems.find((i) => i.id === activeId);
      const overItem = localNavItems.find((i) => i.id === overId);
      if (!activeItem || !overItem) return;
      if (activeItem.section !== overItem.section) return;

      const section = activeItem.section;
      const sectionItems = visibleBySection[section];
      const oldIndex = sectionItems.findIndex((i) => i.id === activeId);
      const newIndex = sectionItems.findIndex((i) => i.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...sectionItems];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      const updatedItems = localNavItems.map((item) => {
        const idx = reordered.findIndex((r) => r.id === item.id);
        if (idx !== -1) {
          return { ...item, order: idx };
        }
        return item;
      });

      setLocalNavItems(updatedItems);
      plugin.settings.navigation = {
        ...plugin.settings.navigation!,
        items: updatedItems,
      };
      void plugin.saveSettings();
    },
    [localNavItems, visibleBySection, plugin]
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      const updatedItems = localNavItems.map((item) =>
        item.id === itemId ? { ...item, visible: false } : item
      );

      setLocalNavItems(updatedItems);
      plugin.settings.navigation = {
        ...plugin.settings.navigation!,
        items: updatedItems,
      };
      void plugin.saveSettings();
    },
    [localNavItems, plugin]
  );

  const handleRestoreItem = useCallback(
    (itemId: string) => {
      const item = localNavItems.find((i) => i.id === itemId);
      if (!item) return;

      const sectionItems = localNavItems.filter(
        (i) => i.section === item.section && i.visible
      );
      const maxOrder =
        sectionItems.length > 0
          ? Math.max(...sectionItems.map((i) => i.order))
          : -1;

      const updatedItems = localNavItems.map((i) =>
        i.id === itemId ? { ...i, visible: true, order: maxOrder + 1 } : i
      );

      setLocalNavItems(updatedItems);
      plugin.settings.navigation = {
        ...plugin.settings.navigation!,
        items: updatedItems,
      };
      void plugin.saveSettings();
    },
    [localNavItems, plugin]
  );

  const handleItemClick = useCallback(
    async (action: string) => {
      const tabBehavior =
        plugin.settings.navigation?.tabBehavior || 'replaceActiveTab';
      const shouldCreateNewLeaf = tabBehavior !== 'replaceActiveTab';

      
      
      const viewType = VIEW_ACTION_MAP[action];
      if (viewType) {
        await plugin.viewManager.navigateToView(
          viewType,
          undefined,
          shouldCreateNewLeaf,
          false
        );
        return;
      }

      
      if (isQuickLinkAction(action) && REVIEW_ACTIONS.has(action)) {
        await actionResolver.executeAction(action, {
          createNewLeaf: shouldCreateNewLeaf,
          focusLeaf: false,
          source: 'sidebar',
        });
        return;
      }

      if (isQuickLinkAction(action)) {
        await actionResolver.executeAction(action);
      }
    },
    [plugin, actionResolver]
  );

  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  return (
    <div className="journalit-nav-sidebar">
      <div className="journalit-nav-header">
        <img
          className="journalit-nav-logo"
          src={LOGO_DATA_URI}
          alt={t('navigation.title')}
        />
        <button
          className="journalit-nav-edit-toggle"
          onClick={toggleEditing}
          data-active={isEditing ? 'true' : 'false'}
          aria-label={t('navigation.edit-mode.toggle')}
          type="button"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      <SidebarSearch plugin={plugin} onActiveChange={setIsSearchActive} />

      {!isSearchActive && (
        <div className="journalit-nav-content-scroll">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[
              restrictToVerticalAxis,
              restrictToActiveNavigationSection,
            ]}
          >
            {SECTIONS.map((section) => {
              const items = visibleBySection[section];
              if (items.length === 0 && !isEditing) return null;

              return (
                <div key={section} className="journalit-nav-section">
                  <div className="journalit-nav-section-header">
                    {t(SECTION_LABEL_KEYS[section])}
                  </div>
                  <SortableContext
                    items={items.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((item) => (
                      <SidebarNavItemComponent
                        key={item.id}
                        item={item}
                        isEditing={isEditing}
                        onRemove={handleRemoveItem}
                        onClick={(item) => void handleItemClick(item)}
                      />
                    ))}
                  </SortableContext>
                </div>
              );
            })}
          </DndContext>

          {isEditing && hiddenItems.length > 0 && (
            <div className="journalit-nav-restore-section">
              <div className="journalit-nav-restore-header">
                {t('navigation.edit-mode.restore-section')}
              </div>
              {hiddenItems.map((item) => {
                const IconComponent = resolveIcon(item.icon);
                const labelKey = `navigation.items.${item.id}`;
                const label = hasTranslation(labelKey)
                  ? t(labelKey)
                  : item.label;
                return (
                  <div key={item.id} className="journalit-nav-restore-item">
                    <div className="journalit-nav-restore-item-info">
                      <IconComponent size={14} />
                      <span>{label}</span>
                    </div>
                    <button
                      className="journalit-nav-restore-btn"
                      onClick={() => handleRestoreItem(item.id)}
                      type="button"
                    >
                      {t('navigation.edit-mode.restore')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
