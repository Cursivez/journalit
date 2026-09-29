

import React, {
  useCallback,
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  X,
  type ObsidianIconComponent,
} from '../icons/ObsidianIcon';
import { t } from '../../../lang/helpers';
import { DisplayPolicyProvider } from '../../../contexts/DisplayPolicyContext';
import { ESCAPE_DELEGATE_ATTRIBUTE } from '../../../views/escapeKeySuppression';

const ALL_TAB_ID = 'all';

interface TabOverflow {
  left: boolean;
  right: boolean;
}


const measureTabOverflow = (row: HTMLElement): TabOverflow => {
  const max = row.scrollWidth - row.clientWidth;
  const offset = Math.abs(row.scrollLeft);
  const isRtl =
    row.ownerDocument.defaultView?.getComputedStyle(row).direction === 'rtl';
  const before = offset > 1;
  const after = offset < max - 1;
  return isRtl
    ? { left: after, right: before }
    : { left: before, right: after };
};


const DrawerTabStrip: React.FC<{
  tabs: WidgetDrawerTab[];
  activeTabId: string;
  onSelect: (tabId: string) => void;
}> = ({ tabs, activeTabId, onSelect }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState<TabOverflow>({
    left: false,
    right: false,
  });

  const updateOverflow = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const next = measureTabOverflow(row);
    setOverflow((previous) =>
      previous.left === next.left && previous.right === next.right
        ? previous
        : next
    );
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    updateOverflow();
    const observer = new ResizeObserver(() => updateOverflow());
    observer.observe(row);
    return () => observer.disconnect();
  }, [updateOverflow]);

  const scrollByPage = (side: 'left' | 'right') => {
    const row = rowRef.current;
    if (!row) return;
    const distance = Math.max(row.clientWidth * 0.7, 80);
    row.scrollBy({
      left: side === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  const selectTab = (tabId: string, button: HTMLButtonElement) => {
    onSelect(tabId);
    button.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  return (
    <div className="journalit-wpd-tabs">
      <div
        ref={rowRef}
        className="journalit-wpd-tabs-row"
        role="tablist"
        onScroll={updateOverflow}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTabId === tab.id}
            className={`journalit-wpd-tab-button${activeTabId === tab.id ? ' is-active' : ''}`}
            onClick={(event) => selectTab(tab.id, event.currentTarget)}
            onFocus={(event) =>
              event.currentTarget.scrollIntoView({
                block: 'nearest',
                inline: 'nearest',
              })
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {overflow.left && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="journalit-wpd-tabs-arrow is-left"
          onClick={() => scrollByPage('left')}
        >
          <ChevronLeft size={16} />
        </button>
      )}
      {overflow.right && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="journalit-wpd-tabs-arrow is-right"
          onClick={() => scrollByPage('right')}
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export interface WidgetDrawerTab {
  id: string;
  label: string;
}

export interface WidgetDrawerItem {
  id: string;
  name: string;
  description: string;
  tabId: string;
  renderPreview: () => React.ReactNode;
  
  inUse: boolean;
  
  addedCount?: number;
  
  compact?: boolean;
  
  detail?: string;
}


export interface WidgetDrawerAction {
  id: string;
  label: string;
  icon: ObsidianIconComponent;
  
  ariaLabel?: string;
  
  emphasis?: boolean;
  onSelect: () => void | Promise<void>;
}

interface WidgetPreviewDrawerProps {
  title: string;
  subtitle: string;
  tabs: WidgetDrawerTab[];
  items: WidgetDrawerItem[];
  
  actionGroup?: { tabId: string; actions: WidgetDrawerAction[] };
  onAdd: (itemId: string) => void | Promise<void>;
  
  onRemove?: (itemId: string) => void | Promise<void>;
  onClose: () => void;
  panelRef?: React.Ref<HTMLDivElement>;
}

const NAV_SELECTOR = '[data-journalit-wpd-nav]';
const ESCAPE_OWNED_SURFACE_SELECTOR =
  '.modal-container, .prompt, .menu, .suggestion-container';



const PRIMARY_SELECTOR = '[data-journalit-wpd-primary]';

const getNavElements = (root: HTMLElement | null): HTMLElement[] =>
  root ? Array.from(root.querySelectorAll<HTMLElement>(NAV_SELECTOR)) : [];

function matchesQuery(query: string, ...fields: string[]): boolean {
  if (!query) return true;
  return fields.some((field) => field.toLowerCase().includes(query));
}


function findArrowTarget(
  elements: HTMLElement[],
  current: HTMLElement,
  key: string
): HTMLElement | undefined {
  const index = elements.indexOf(current);
  if (key === 'ArrowRight') return elements[index + 1];
  if (key === 'ArrowLeft') return elements[index - 1];

  const origin = current.getBoundingClientRect();
  const originX = origin.left + origin.width / 2;
  const down = key === 'ArrowDown';
  let best: HTMLElement | undefined;
  let bestRowDistance = Infinity;
  let bestColumnDistance = Infinity;

  for (const element of elements) {
    const rect = element.getBoundingClientRect();
    const rowDistance = down ? rect.top - origin.top : origin.top - rect.top;
    if (rowDistance <= 4) continue;
    const columnDistance = Math.abs(rect.left + rect.width / 2 - originX);
    if (
      rowDistance < bestRowDistance - 4 ||
      (Math.abs(rowDistance - bestRowDistance) <= 4 &&
        columnDistance < bestColumnDistance)
    ) {
      best = element;
      bestRowDistance = rowDistance;
      bestColumnDistance = columnDistance;
    }
  }
  return best;
}

const WidgetCard: React.FC<{
  item: WidgetDrawerItem;
  onAdd: (itemId: string) => void;
  onRemove?: (itemId: string) => void;
}> = ({ item, onAdd, onRemove }) => {
  const labelId = useId();
  const preview = (
    <div
      className={`journalit-wpd-preview${item.compact ? ' journalit-wpd-preview--compact' : ''}`}
      aria-hidden="true"
    >
      {item.renderPreview()}
      {item.addedCount !== undefined && item.addedCount > 0 && (
        <span className="journalit-wpd-card-badge">
          {t('widget-drawer.added-count', {
            count: String(item.addedCount),
          })}
        </span>
      )}
    </div>
  );
  const meta = (
    <span className="journalit-wpd-card-meta">
      <span className="journalit-wpd-card-name">{item.name}</span>
      <span className="journalit-wpd-card-action" aria-hidden="true">
        {item.inUse ? <Check size={14} /> : <Plus size={14} />}
      </span>
    </span>
  );
  const description = item.detail ? (
    <span className="journalit-wpd-card-detail">{item.detail}</span>
  ) : (
    <span className="journalit-wpd-card-description">{item.description}</span>
  );
  const fullName = item.detail ? `${item.name} · ${item.detail}` : item.name;

  if (item.inUse) {
    return (
      <div className="journalit-wpd-card journalit-wpd-card--in-use">
        <div className="journalit-wpd-preview-wrap">
          {onRemove && (
            <button
              type="button"
              className="journalit-wpd-remove"
              data-journalit-wpd-nav=""
              aria-labelledby={labelId}
              onClick={() => onRemove(item.id)}
            >
              <span id={labelId} className="journalit-sr-only">
                {t('widget-drawer.remove-aria', { name: fullName })}
              </span>
              <Trash2 size={14} aria-hidden="true" />
              <span aria-hidden="true">{t('widget-drawer.remove')}</span>
            </button>
          )}
          {preview}
        </div>
        {meta}
        {description}
      </div>
    );
  }

  return (
    <button
      type="button"
      className="journalit-wpd-card"
      data-journalit-wpd-nav=""
      data-journalit-wpd-primary=""
      
      
      aria-labelledby={labelId}
      onClick={() => onAdd(item.id)}
    >
      <span id={labelId} className="journalit-sr-only">
        {t('widget-drawer.add-aria', { name: fullName })}
      </span>
      {preview}
      {meta}
      {description}
    </button>
  );
};

const CardSection: React.FC<{
  title: string;
  items: WidgetDrawerItem[];
  onAdd: (itemId: string) => void;
  onRemove?: (itemId: string) => void;
}> = ({ title, items, onAdd, onRemove }) =>
  items.length === 0 ? null : (
    <section className="journalit-wpd-section">
      <h3 className="journalit-wpd-section-title">{title}</h3>
      <div className="journalit-wpd-grid">
        {items.map((item) => (
          <WidgetCard
            key={item.id}
            item={item}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );


const useDrawerEscape = (
  overlayRef: React.RefObject<HTMLDivElement | null>,
  onEscape: () => void
) => {
  const handleEscape = useEffectEvent((event: KeyboardEvent) => {
    
    if (event.key !== 'Escape' || event.isComposing) return;
    const target = event.target;
    
    
    const ElementCtor =
      overlayRef.current?.ownerDocument.defaultView?.Element ?? Element;
    if (
      target instanceof ElementCtor &&
      !overlayRef.current?.contains(target) &&
      target.closest(ESCAPE_OWNED_SURFACE_SELECTOR)
    ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation(); 
    onEscape();
  });

  useEffect(() => {
    const doc = window.activeDocument;
    doc.addEventListener('keydown', handleEscape, true);
    return () => doc.removeEventListener('keydown', handleEscape, true);
  }, []);
};

const ActionPillSection: React.FC<{
  title: string;
  actions: WidgetDrawerAction[];
}> = ({ title, actions }) => (
  <section className="journalit-wpd-section">
    <h3 className="journalit-wpd-section-title">{title}</h3>
    <div className="journalit-wpd-pills">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            className={`journalit-wpd-pill${action.emphasis ? ' journalit-wpd-pill--add' : ''}`}
            data-journalit-wpd-nav=""
            data-journalit-wpd-primary=""
            aria-label={action.ariaLabel}
            onClick={() => void action.onSelect()}
          >
            <Icon size={14} />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  </section>
);

export const WidgetPreviewDrawer: React.FC<WidgetPreviewDrawerProps> = ({
  title,
  subtitle,
  tabs,
  items,
  actionGroup,
  onAdd,
  onRemove,
  onClose,
  panelRef,
}) => {
  const titleId = useId();
  const [activeTabId, setActiveTabId] = useState(ALL_TAB_ID);
  const [query, setQuery] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const pendingFocusIndexRef = useRef<number | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const inTab = (tabId: string) =>
    activeTabId === ALL_TAB_ID || activeTabId === tabId;
  const visibleItems = items.filter(
    (item) =>
      inTab(item.tabId) &&
      matchesQuery(
        normalizedQuery,
        item.name,
        item.description,
        item.detail ?? ''
      )
  );
  const availableItems = visibleItems.filter((item) => !item.inUse);
  const inUseItems = visibleItems.filter((item) => item.inUse);
  const actionsTab = actionGroup
    ? tabs.find((tab) => tab.id === actionGroup.tabId)
    : undefined;
  const visibleActions =
    actionGroup && actionsTab && inTab(actionsTab.id)
      ? actionGroup.actions.filter((action) =>
          matchesQuery(normalizedQuery, action.label)
        )
      : [];
  const isEmpty =
    availableItems.length === 0 &&
    inUseItems.length === 0 &&
    visibleActions.length === 0;

  
  const availableSections =
    activeTabId === ALL_TAB_ID
      ? tabs.map((tab) => ({
          id: tab.id,
          title: tab.label,
          items: availableItems.filter((item) => item.tabId === tab.id),
        }))
      : [
          {
            id: activeTabId,
            title: t('widget-drawer.section.available'),
            items: availableItems,
          },
        ];

  
  
  
  const rememberFocusPosition = () => {
    const navElements = getNavElements(bodyRef.current);
    const activeElement = window.activeDocument.activeElement;
    
    
    if (!activeElement?.matches(':focus-visible')) {
      pendingFocusIndexRef.current = null;
      return;
    }
    const index = navElements.findIndex((element) => element === activeElement);
    pendingFocusIndexRef.current = index >= 0 ? index : null;
  };

  const handleAdd = (itemId: string) => {
    rememberFocusPosition();
    void onAdd(itemId);
  };

  const handleRemove = onRemove
    ? (itemId: string) => {
        rememberFocusPosition();
        void onRemove(itemId);
      }
    : undefined;

  useEffect(() => {
    const index = pendingFocusIndexRef.current;
    if (index === null) return;
    const activeElement = window.activeDocument.activeElement;
    if (activeElement && bodyRef.current?.contains(activeElement)) {
      pendingFocusIndexRef.current = null;
      return;
    }
    pendingFocusIndexRef.current = null;
    const navElements = getNavElements(bodyRef.current);
    const next = navElements[Math.min(index, navElements.length - 1)];
    (next ?? searchRef.current)?.focus();
  }, [items]);

  
  
  
  useEffect(() => {
    const doc = window.activeDocument;
    const opener = doc.activeElement;
    const overlay = overlayRef.current;
    searchRef.current?.focus();
    return () => {
      const current = doc.activeElement;
      const focusWasLost =
        !current || current === doc.body || overlay?.contains(current);
      const OpenerCtor = doc.defaultView?.HTMLElement ?? HTMLElement;
      if (focusWasLost && opener instanceof OpenerCtor && opener.isConnected) {
        opener.focus();
      }
    };
  }, []);

  useDrawerEscape(overlayRef, () => {
    if (query) {
      setQuery('');
      searchRef.current?.focus();
      return;
    }
    onClose();
  });

  const handleBodyKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight'
    ) {
      return;
    }
    const navElements = getNavElements(bodyRef.current);
    const current = navElements.find((element) => element === event.target);
    if (!current) return;
    event.preventDefault();
    const next = findArrowTarget(navElements, current, event.key);
    if (next) {
      next.focus();
      next.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'ArrowUp') {
      searchRef.current?.focus();
    }
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter') {
      const firstAddable =
        bodyRef.current?.querySelector<HTMLElement>(PRIMARY_SELECTOR);
      if (!firstAddable) return;
      event.preventDefault();
      firstAddable.click();
      return;
    }
    if (event.key !== 'ArrowDown') return;
    const first = getNavElements(bodyRef.current)[0];
    if (!first) return;
    event.preventDefault();
    first.focus();
  };

  
  
  return createPortal(
    <div
      ref={overlayRef}
      className="journalit-wpd-overlay"
      role="presentation"
      {...{ [ESCAPE_DELEGATE_ATTRIBUTE]: 'true' }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="journalit-wpd-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        
        <div className="journalit-wpd-panel-inner">
          <div className="journalit-wpd-header">
            <div className="journalit-wpd-heading">
              <h2 id={titleId} className="journalit-wpd-title">
                {title}
              </h2>
              <p className="journalit-wpd-subtitle">{subtitle}</p>
            </div>
            <button
              type="button"
              className="journalit-wpd-close clickable-icon"
              aria-label={t('widget-drawer.close')}
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>

          <DrawerTabStrip
            tabs={[
              { id: ALL_TAB_ID, label: t('widget-drawer.tab.all') },
              ...tabs,
            ]}
            activeTabId={activeTabId}
            onSelect={setActiveTabId}
          />

          
          <label className="journalit-wpd-search">
            <span className="journalit-sr-only">
              {t('widget-drawer.search.placeholder')}
            </span>
            <Search size={14} />
            <input
              ref={searchRef}
              type="search"
              className="journalit-wpd-search-input"
              placeholder={t('widget-drawer.search.placeholder')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </label>

          
          <DisplayPolicyProvider privacyModeOverride={false}>
            <div
              ref={bodyRef}
              className="journalit-wpd-body"
              onKeyDown={handleBodyKeyDown}
              role="presentation"
            >
              {availableSections.map((section) => (
                <CardSection
                  key={section.id}
                  title={section.title}
                  items={section.items}
                  onAdd={handleAdd}
                />
              ))}

              {actionsTab && visibleActions.length > 0 && (
                <ActionPillSection
                  title={actionsTab.label}
                  actions={visibleActions}
                />
              )}

              <CardSection
                title={t('widget-drawer.section.in-use')}
                items={inUseItems}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />

              {isEmpty && (
                <div className="journalit-wpd-empty">
                  {t('widget-drawer.empty-search')}
                </div>
              )}
            </div>
          </DisplayPolicyProvider>
        </div>
      </div>
    </div>,
    window.activeDocument.body
  );
};
