import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  closestCenter,
  type CollisionDetection,
  type DragEndEvent,
} from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';

import type JournalitPlugin from '../../main';
import {
  createDefaultNavigationSettings,
  type SidebarNavItem,
} from '../../settings/types';

type Section = SidebarNavItem['section'];
const SECTIONS: Section[] = ['overview', 'reviews', 'tools'];
const LEGACY_SETUPS_NAVIGATION_ICON = 'notebook-tabs';

export interface NavigationDragBounds {
  top: number;
  bottom: number;
}

export function restrictNavigationDragTransform(
  transform: Transform,
  activeRect: Pick<DOMRect, 'top' | 'bottom'>,
  bounds: NavigationDragBounds
): Transform {
  const minimumY = bounds.top - activeRect.top;
  const maximumY = bounds.bottom - activeRect.bottom;

  return {
    ...transform,
    x: 0,
    y: Math.min(maximumY, Math.max(minimumY, transform.y)),
  };
}

export function mergeNavigationItemsWithDefaults(
  currentItems: SidebarNavItem[]
): {
  items: SidebarNavItem[];
  changed: boolean;
} {
  const defaultItems = createDefaultNavigationSettings().items;
  const currentById = new Map(currentItems.map((item) => [item.id, item]));
  const currentIndexById = new Map(
    currentItems.map((item, index) => [item.id, index])
  );
  const merged = [...currentItems];
  let changed = false;

  for (const defaultItem of defaultItems) {
    const existingItem = currentById.get(defaultItem.id);
    if (existingItem) {
      if (
        (existingItem.id === 'nav-setups' ||
          existingItem.action === 'openSetups') &&
        existingItem.icon === LEGACY_SETUPS_NAVIGATION_ICON
      ) {
        const index = currentIndexById.get(existingItem.id);
        if (index === undefined) continue;
        merged[index] = { ...existingItem, icon: defaultItem.icon };
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

export function createNavigationCollisionDetection(
  items: SidebarNavItem[]
): CollisionDetection {
  const visibleItemIdsBySection = new Map<Section, Set<string>>();
  const sectionItemIdsByVisibleItemId = new Map<string, Set<string>>();

  for (const item of items) {
    if (!item.visible) continue;
    let sectionItemIds = visibleItemIdsBySection.get(item.section);
    if (!sectionItemIds) {
      sectionItemIds = new Set<string>();
      visibleItemIdsBySection.set(item.section, sectionItemIds);
    }
    sectionItemIds.add(item.id);
    sectionItemIdsByVisibleItemId.set(item.id, sectionItemIds);
  }

  return (args) => {
    const sectionItemIds = sectionItemIdsByVisibleItemId.get(
      args.active.id.toString()
    );
    if (!sectionItemIds) return closestCenter(args);

    const sectionArgs = {
      ...args,
      droppableContainers: args.droppableContainers.filter((container) =>
        sectionItemIds.has(container.id.toString())
      ),
    };
    const initialRect = args.active.rect.current.initial;
    const hasNestedShortcuts =
      args.active.data.current?.hasNestedShortcuts === true;
    if (
      !hasNestedShortcuts ||
      !initialRect ||
      args.collisionRect.top === initialRect.top
    ) {
      return closestCenter(sectionArgs);
    }

    
    
    
    const movingDown = args.collisionRect.top > initialRect.top;
    const edgeY = movingDown
      ? args.collisionRect.bottom
      : args.collisionRect.top;
    let crossedContainer:
      | (typeof sectionArgs.droppableContainers)[number]
      | undefined;
    let crossedMidpoint = movingDown
      ? Number.NEGATIVE_INFINITY
      : Number.POSITIVE_INFINITY;

    for (const container of sectionArgs.droppableContainers) {
      if (container.id === args.active.id) continue;
      const rect = args.droppableRects.get(container.id);
      if (!rect) continue;
      const midpoint = rect.top + rect.height / 2;

      if (movingDown) {
        if (
          midpoint >= initialRect.bottom &&
          midpoint <= edgeY &&
          midpoint > crossedMidpoint
        ) {
          crossedContainer = container;
          crossedMidpoint = midpoint;
        }
      } else if (
        midpoint <= initialRect.top &&
        midpoint >= edgeY &&
        midpoint < crossedMidpoint
      ) {
        crossedContainer = container;
        crossedMidpoint = midpoint;
      }
    }

    const activeContainer = sectionArgs.droppableContainers.find(
      (container) => container.id === args.active.id
    );
    const targetContainer = crossedContainer ?? activeContainer;
    return targetContainer
      ? closestCenter({
          ...sectionArgs,
          droppableContainers: [targetContainer],
        })
      : closestCenter(sectionArgs);
  };
}

export function useNavigationItems(plugin: JournalitPlugin) {
  const [items, setItems] = useState<SidebarNavItem[]>([]);

  useEffect(() => {
    const settingsItems = plugin.settings.navigation?.items;
    if (settingsItems && settingsItems.length > 0) {
      const merged = mergeNavigationItemsWithDefaults(settingsItems);
      setItems(merged.items);
      if (merged.changed) {
        plugin.settings.navigation = {
          ...plugin.settings.navigation!,
          items: merged.items,
        };
        void plugin.saveSettings();
      }
      return;
    }

    const defaultItems = createDefaultNavigationSettings().items;
    setItems(defaultItems);
    if (!plugin.settings.navigation) {
      plugin.settings.navigation = createDefaultNavigationSettings();
    } else {
      plugin.settings.navigation.items = defaultItems;
    }
    void plugin.saveSettings();
  }, [plugin]);

  const visibleBySection = useMemo(() => {
    const result: Record<Section, SidebarNavItem[]> = {
      overview: [],
      reviews: [],
      tools: [],
    };
    for (const item of items) {
      if (item.visible) result[item.section].push(item);
    }
    for (const section of SECTIONS) {
      result[section].sort((a, b) => a.order - b.order);
    }
    return result;
  }, [items]);

  const hiddenItems = useMemo(
    () => items.filter((item) => !item.visible),
    [items]
  );

  const persist = useCallback(
    (nextItems: SidebarNavItem[]) => {
      setItems(nextItems);
      plugin.settings.navigation = {
        ...plugin.settings.navigation!,
        items: nextItems,
      };
      void plugin.saveSettings();
    },
    [plugin]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activeId = active.id.toString();
      const overId = over.id.toString();
      const activeItem = items.find((item) => item.id === activeId);
      const overItem = items.find((item) => item.id === overId);
      if (!activeItem || !overItem || activeItem.section !== overItem.section) {
        return;
      }

      const sectionItems = visibleBySection[activeItem.section];
      const oldIndex = sectionItems.findIndex((item) => item.id === activeId);
      const newIndex = sectionItems.findIndex((item) => item.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...sectionItems];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);
      const orderById = new Map(
        reordered.map((item, index) => [item.id, index])
      );
      persist(
        items.map((item) => {
          const order = orderById.get(item.id);
          return order === undefined ? item : { ...item, order };
        })
      );
    },
    [items, persist, visibleBySection]
  );

  const hideItem = useCallback(
    (itemId: string) => {
      persist(
        items.map((item) =>
          item.id === itemId ? { ...item, visible: false } : item
        )
      );
    },
    [items, persist]
  );

  const restoreItem = useCallback(
    (itemId: string) => {
      const item = items.find((candidate) => candidate.id === itemId);
      if (!item) return;
      const sectionItems = items.filter(
        (candidate) => candidate.section === item.section && candidate.visible
      );
      const maxOrder = sectionItems.reduce(
        (max, candidate) => Math.max(max, candidate.order),
        -1
      );
      persist(
        items.map((candidate) =>
          candidate.id === itemId
            ? { ...candidate, visible: true, order: maxOrder + 1 }
            : candidate
        )
      );
    },
    [items, persist]
  );

  return {
    items,
    visibleBySection,
    hiddenItems,
    handleDragEnd,
    hideItem,
    restoreItem,
  };
}
