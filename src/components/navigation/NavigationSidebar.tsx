import React, { useMemo, useCallback, useRef, useState } from 'react';
import { Notice } from 'obsidian';
import { Plus, SlidersHorizontal, X } from '../shared/icons/ObsidianIcon';
import { LOGO_DATA_URI } from '../../assets/logoData';
import {
  DndContext,
  getClientRect,
  type DragEndEvent,
  type DragStartEvent,
  type Modifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import JournalitPlugin from '../../main';
import {
  QuickLinkAction,
  QUICK_LINK_ACTIONS,
  type EntityShortcut,
  type EntityShortcutTarget,
  type SidebarNavItem,
} from '../../settings/types';
import { QuickLinkActionResolver } from '../../utils/QuickLinkActionResolver';
import { resolveIcon } from '../../utils/iconResolver';
import { hasTranslation, t, TranslationKey } from '../../lang/helpers';
import { SidebarNavItemComponent } from './SidebarNavItem';
import { SidebarSearch } from './SidebarSearch';
import { resolveSidebarTabNavigation } from '../../navigation/sidebarTabBehavior';
import { EntityShortcutPicker } from '../shared/navigation/EntityShortcutPicker';
import { useEntityShortcuts } from '../../hooks/useEntityShortcuts';
import { getDisplayedEntityShortcuts } from '../../hooks/entityShortcutDisplay';
import { useTradeSyncNowState } from '../../hooks/useTradeSyncNowState';
import { useSessionIndicatorPhase } from '../../hooks/useSessionIndicatorPhase';
import type { SessionIndicatorPhase } from '../../services/sessionMode/SessionPhaseWatcher';
import {
  createNavigationCollisionDetection,
  type NavigationDragBounds,
  restrictNavigationDragTransform,
  useNavigationItems,
} from './useNavigationItems';

type Section = 'overview' | 'reviews' | 'tools';
type EntityShortcutKind = EntityShortcutTarget['kind'];
const SECTIONS: Section[] = ['overview', 'reviews', 'tools'];

const SECTION_LABEL_KEYS: Record<Section, TranslationKey> = {
  overview: 'navigation.section.overview',
  reviews: 'navigation.section.reviews',
  tools: 'navigation.section.tools',
};

const VIEW_ACTION_MAP: Record<string, string> = {
  openHome: 'journalit-home-view',
  openTradingDashboard: 'journalit-dashboard-view',
  openTradeLog: 'journalit-trade-log-view',
  openAccountDashboard: 'account-dashboard',
  openCSVImport: 'journalit-csv-import-view',
  openLayoutBuilder: 'journalit-template-builder-view',
  openEconomicCalendar: 'journalit-economic-calendar-view',
};

const QUICK_LINK_ACTION_SET: ReadonlySet<string> = new Set(QUICK_LINK_ACTIONS);

const isQuickLinkAction = (action: string): action is QuickLinkAction =>
  QUICK_LINK_ACTION_SET.has(action);

const getEntityShortcutKind = (
  action: QuickLinkAction
): EntityShortcutKind | null => {
  if (action === 'openAccountDashboard') return 'account';
  if (action === 'openSetups') return 'setup';
  return null;
};
const REVIEW_ACTIONS = new Set<QuickLinkAction>([
  'openTodaysDRC',
  'openWeeklyReview',
  'openMonthlyReview',
  'openQuarterlyReview',
  'openYearlyReview',
]);

interface NavigationSidebarProps {
  plugin: JournalitPlugin;
}

const SidebarEntityShortcutComponent: React.FC<{
  shortcut: EntityShortcut;
  target: EntityShortcutTarget;
  label: string;
  icon: string;
  unavailable?: boolean;
  isEditing: boolean;
  onClick: (target: EntityShortcutTarget) => void | Promise<void>;
  onRemove: (id: string) => void;
}> = ({
  shortcut,
  target,
  label,
  icon,
  unavailable = false,
  isEditing,
  onClick,
  onRemove,
}) => {
  const IconComponent = resolveIcon(icon);
  const activateShortcut = () => {
    if (!isEditing && !unavailable) void onClick(target);
  };

  return (
    <div
      className="journalit-nav-item journalit-nav-entity-item"
      data-editing={isEditing ? 'true' : 'false'}
      role={!isEditing ? 'button' : undefined}
      tabIndex={!isEditing ? 0 : undefined}
      onClick={activateShortcut}
      onKeyDown={(event) => {
        if (isEditing || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        activateShortcut();
      }}
    >
      <span className="journalit-nav-item-icon">
        <IconComponent size={16} aria-hidden="true" />
      </span>
      <span className="journalit-nav-item-label">
        {label}
        {unavailable ? ` (${t('navigation.shortcuts.unavailable')})` : ''}
      </span>
      {isEditing && (
        <button
          type="button"
          className="journalit-nav-item-remove"
          aria-label={t('navigation.shortcuts.remove')}
          onClick={() => onRemove(shortcut.id)}
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
};

const SidebarEntityShortcut = React.memo(SidebarEntityShortcutComponent);

type DisplayedEntityShortcut = ReturnType<
  typeof getDisplayedEntityShortcuts
>[number];

interface NavigationSectionsProps {
  visibleBySection: Record<Section, SidebarNavItem[]>;
  displayedEntityShortcuts: DisplayedEntityShortcut[];
  isEditing: boolean;
  tradeSyncRunning: boolean;
  sessionPhase: SessionIndicatorPhase;
  onRemoveItem: (itemId: string) => void;
  onItemClick: (action: QuickLinkAction) => Promise<void>;
  onRemoveEntityShortcut: (id: string) => void;
  onEntityShortcutClick: (target: EntityShortcutTarget) => Promise<void>;
}

const NavigationSections: React.FC<NavigationSectionsProps> = ({
  visibleBySection,
  displayedEntityShortcuts,
  isEditing,
  tradeSyncRunning,
  sessionPhase,
  onRemoveItem,
  onItemClick,
  onRemoveEntityShortcut,
  onEntityShortcutClick,
}) =>
  SECTIONS.map((section) => {
    const items = visibleBySection[section];
    if (items.length === 0 && !isEditing) return null;

    const renderedItems = items.map((item) => {
      const shortcutKind = getEntityShortcutKind(item.action);
      const childShortcuts = shortcutKind
        ? displayedEntityShortcuts.filter(
            ({ target }) => target.kind === shortcutKind
          )
        : [];
      const shortcutChildren =
        childShortcuts.length > 0 ? (
          <div className="journalit-nav-entity-children">
            {childShortcuts.map(
              ({ shortcut, target, label, icon, unavailable }) => (
                <SidebarEntityShortcut
                  key={shortcut.id}
                  shortcut={shortcut}
                  target={target}
                  label={label}
                  icon={icon}
                  unavailable={unavailable}
                  isEditing={isEditing}
                  onRemove={onRemoveEntityShortcut}
                  onClick={onEntityShortcutClick}
                />
              )
            )}
          </div>
        ) : null;

      return (
        <SidebarNavItemComponent
          key={item.id}
          item={item}
          isEditing={isEditing}
          isBusy={item.action === 'syncTradesNow' && tradeSyncRunning}
          sessionPhase={item.action === 'openSessionMode' ? sessionPhase : null}
          onRemove={onRemoveItem}
          onClick={onItemClick}
        >
          {shortcutChildren}
        </SidebarNavItemComponent>
      );
    });

    return (
      <div key={section} className="journalit-nav-section">
        <div className="journalit-nav-section-header">
          {t(SECTION_LABEL_KEYS[section])}
        </div>
        {isEditing ? (
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {renderedItems}
          </SortableContext>
        ) : (
          renderedItems
        )}
      </div>
    );
  });

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  plugin,
}) => {
  const tradeSyncState = useTradeSyncNowState(plugin);
  const sessionPhase = useSessionIndicatorPhase(plugin);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dragBoundsRef = useRef<NavigationDragBounds | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showShortcutPicker, setShowShortcutPicker] = useState(false);
  const {
    items: navigationItems,
    visibleBySection,
    hiddenItems,
    handleDragEnd,
    hideItem,
    restoreItem: handleRestoreItem,
  } = useNavigationItems(plugin);
  const {
    shortcuts: entityShortcuts,
    shortcutEntries,
    catalogItems,
    catalogLoading,
    catalogError,
    catalogErrors,
    addShortcut,
    removeShortcut: handleRemoveEntityShortcut,
  } = useEntityShortcuts(plugin, 'navigation', showShortcutPicker);
  const displayedEntityShortcuts = useMemo(
    () =>
      getDisplayedEntityShortcuts(shortcutEntries, {
        editing: isEditing,
        loading: catalogLoading,
        errors: catalogErrors,
      }),
    [catalogErrors, catalogLoading, isEditing, shortcutEntries]
  );

  const actionResolver = useMemo(
    () => new QuickLinkActionResolver(plugin),
    [plugin]
  );

  const handleEntityShortcutClick = useCallback(
    async (target: EntityShortcutTarget) => {
      const { createNewLeaf, source } = resolveSidebarTabNavigation(plugin);
      await actionResolver.executeEntityShortcut(target, {
        createNewLeaf,
        focusLeaf: false,
        source,
      });
    },
    [actionResolver, plugin]
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      const item = navigationItems.find((candidate) => candidate.id === itemId);
      const shortcutKind = item ? getEntityShortcutKind(item.action) : null;
      if (
        shortcutKind &&
        entityShortcuts.some(
          (shortcut) => shortcut.target.kind === shortcutKind
        )
      ) {
        new Notice(t('navigation.shortcuts.parent-required'));
        return;
      }
      hideItem(itemId);
    },
    [entityShortcuts, hideItem, navigationItems]
  );

  const detectNavigationCollision = useMemo(
    () => createNavigationCollisionDetection(navigationItems),
    [navigationItems]
  );

  const handleNavigationDragStart = useCallback((event: DragStartEvent) => {
    const root = sidebarRef.current;
    if (!root) return;

    const activeId = event.active.id.toString();
    const activeRow = Array.from(
      root.querySelectorAll<HTMLElement>('[data-nav-item-id]')
    ).find((row) => row.dataset.navItemId === activeId);
    const section = activeRow?.closest('.journalit-nav-section');
    if (!section) return;

    const groupRects = Array.from(
      section.querySelectorAll<HTMLElement>('.journalit-nav-sortable-group')
    ).map((group) => getClientRect(group, { ignoreTransform: true }));
    if (groupRects.length === 0) return;

    dragBoundsRef.current = {
      top: Math.min(...groupRects.map((rect) => rect.top)),
      bottom: Math.max(...groupRects.map((rect) => rect.bottom)),
    };
  }, []);

  const handleNavigationDragEnd = useCallback(
    (event: DragEndEvent) => {
      dragBoundsRef.current = null;
      handleDragEnd(event);
    },
    [handleDragEnd]
  );

  const handleNavigationDragCancel = useCallback(() => {
    dragBoundsRef.current = null;
  }, []);

  const restrictToNavigationSection = useCallback<Modifier>(
    ({ activeNodeRect, transform }) => {
      const bounds = dragBoundsRef.current;
      if (!bounds || !activeNodeRect) return { ...transform, x: 0 };
      return restrictNavigationDragTransform(transform, activeNodeRect, bounds);
    },
    []
  );

  const handleAddEntityShortcut = useCallback(
    async (target: EntityShortcutTarget) => {
      const parentAction =
        target.kind === 'account' ? 'openAccountDashboard' : 'openSetups';
      const parentItem = navigationItems.find(
        (item) => item.action === parentAction
      );
      if (parentItem && !parentItem.visible) {
        handleRestoreItem(parentItem.id);
      }
      await addShortcut(target);
    },
    [addShortcut, handleRestoreItem, navigationItems]
  );

  const handleItemClick = useCallback(
    async (action: string) => {
      const { createNewLeaf, source } = resolveSidebarTabNavigation(plugin);
      const focusLeaf = false;

      if (action === 'openSetups') {
        await plugin.viewManager.openSetupsView(
          { page: 'overview' },
          { newTab: createNewLeaf, focusLeaf }
        );
        return;
      }

      
      
      const viewType = VIEW_ACTION_MAP[action];
      if (viewType) {
        await plugin.viewManager.navigateToView(
          viewType,
          undefined,
          createNewLeaf,
          focusLeaf
        );
        return;
      }

      
      if (isQuickLinkAction(action) && REVIEW_ACTIONS.has(action)) {
        await actionResolver.executeAction(action, {
          createNewLeaf,
          focusLeaf,
          source,
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

  const navigationSections = (
    <NavigationSections
      visibleBySection={visibleBySection}
      displayedEntityShortcuts={displayedEntityShortcuts}
      isEditing={isEditing}
      tradeSyncRunning={tradeSyncState.status === 'running'}
      sessionPhase={sessionPhase}
      onRemoveItem={handleRemoveItem}
      onItemClick={handleItemClick}
      onRemoveEntityShortcut={handleRemoveEntityShortcut}
      onEntityShortcutClick={handleEntityShortcutClick}
    />
  );

  return (
    <div ref={sidebarRef} className="journalit-nav-sidebar">
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
          {isEditing ? (
            <DndContext
              collisionDetection={detectNavigationCollision}
              onDragStart={handleNavigationDragStart}
              onDragCancel={handleNavigationDragCancel}
              onDragEnd={handleNavigationDragEnd}
              modifiers={[restrictToNavigationSection]}
            >
              {navigationSections}
            </DndContext>
          ) : (
            navigationSections
          )}

          {isEditing && (
            <button
              type="button"
              className="journalit-nav-add-shortcut"
              onClick={() => setShowShortcutPicker(true)}
            >
              <Plus size={14} aria-hidden="true" />
              <span>{t('navigation.shortcuts.add')}</span>
            </button>
          )}

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
      {showShortcutPicker && (
        <EntityShortcutPicker
          shortcuts={entityShortcuts}
          items={catalogItems}
          loading={catalogLoading}
          error={catalogError}
          onAdd={handleAddEntityShortcut}
          onClose={() => setShowShortcutPicker(false)}
        />
      )}
    </div>
  );
};
