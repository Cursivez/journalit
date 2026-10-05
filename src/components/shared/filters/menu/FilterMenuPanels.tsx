

import React, { useId, useState } from 'react';
import { t, type TranslationKey } from '../../../../lang/helpers';
import { cssVars } from '../../../../styles/inlineStylePolicy';
import {
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  RotateCcw,
  Search,
} from '../../icons/ObsidianIcon';
import type { FilterMatchMode } from '../filterMatchModes';
import { matchModeLabel } from './filterMenuNodes';
import {
  type FilterMenuEntry,
  type FilterMenuNode,
  type FilterMenuValuesNode,
  type FilterMenuDateRangeNode,
  countNode,
} from './menuModel';
import {
  type FilterMenuLayout,
  type PanelPosition,
  SUBMENU_GAP,
} from './filterMenuPosition';
import {
  DateRangePanelContent,
  type DateRangePickerLifecycle,
} from './DateRangePanelContent';


export const MENU_ITEM_SELECTOR = '[data-filter-menu-item]:not([disabled])';
const SEARCH_THRESHOLD = 8;

const NodeCounts: React.FC<{ node: FilterMenuNode }> = ({ node }) => {
  const { included, excluded } = countNode(node);
  if (included === 0 && excluded === 0) return null;
  const matchMode =
    node.kind === 'values' && included > 0 && node.matchMode !== 'any'
      ? node.matchMode
      : null;
  return (
    <span className="journalit-filter-menu__counts">
      {matchMode && (
        <span className="journalit-filter-menu__match-badge">
          {t(MATCH_MODE_BADGE_KEYS[matchMode])}
        </span>
      )}
      {included > 0 && (
        <span className="journalit-filter-menu__count">
          <span aria-hidden="true">{included}</span>
          <span className="journalit-sr-only">
            {t('filter.menu.included-count', { count: String(included) })}
          </span>
        </span>
      )}
      {excluded > 0 && (
        <span className="journalit-filter-menu__count journalit-filter-menu__count--excluded">
          <Ban size={10} aria-hidden="true" />
          <span aria-hidden="true">{excluded}</span>
          <span className="journalit-sr-only">
            {t('filter.menu.excluded-count', { count: String(excluded) })}
          </span>
        </span>
      )}
    </span>
  );
};

export interface PanelFrameProps {
  depth: number;
  layout: FilterMenuLayout;
  position: PanelPosition | null;
  panelRef: (element: HTMLDivElement | null) => void;
  onBack?: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onPointerEnter: () => void;
  onFocusCapture?: React.FocusEventHandler<HTMLDivElement>;
}

interface PanelChromeProps extends PanelFrameProps {
  title: string;
  isForm?: boolean;
  headerAction?: React.ReactNode;
  
  toolbar?: React.ReactNode;
  
  notice?: React.ReactNode;
  children: React.ReactNode;
}

const PanelChrome: React.FC<PanelChromeProps> = ({
  depth,
  layout,
  position,
  panelRef,
  onBack,
  onKeyDown,
  onPointerEnter,
  onFocusCapture,
  title,
  isForm = false,
  headerAction,
  toolbar,
  notice,
  children,
}) => {
  const titleId = useId();
  return (
    <div
      ref={panelRef}
      className={[
        'journalit-filter-menu__panel',
        depth === 0 ? 'journalit-filter-menu__panel--root' : '',
        isForm ? 'journalit-filter-menu__panel--date-range' : '',
        layout === 'drilldown' ? 'journalit-filter-menu__panel--drilldown' : '',
        position ? '' : 'journalit-filter-menu__panel--measuring',
        
        layout === 'cascade' && position?.bridgesGap
          ? `journalit-filter-menu__panel--from-${position.side === 'right' ? 'left' : 'right'}`
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-depth={depth}
      role={isForm ? 'dialog' : undefined}
      aria-labelledby={isForm ? titleId : undefined}
      onKeyDown={onKeyDown}
      onPointerEnter={onPointerEnter}
      onFocusCapture={onFocusCapture}
      style={cssVars({
        '--journalit-filter-menu-top': `${position?.top ?? 0}px`,
        '--journalit-filter-menu-left': `${position?.left ?? 0}px`,
        '--journalit-filter-menu-max-height': `${position?.maxHeight ?? 320}px`,
        '--journalit-filter-menu-gap': `${SUBMENU_GAP}px`,
      })}
    >
      <div className="journalit-filter-menu__header">
        {onBack && (
          <button
            type="button"
            className="journalit-filter-menu__back clickable-icon"
            onClick={onBack}
            aria-label={t('home.filters.back')}
            data-filter-menu-item
          >
            <ChevronLeft size={15} aria-hidden="true" />
          </button>
        )}
        <span id={titleId} className="journalit-filter-menu__title">
          {title}
        </span>
        {headerAction}
      </div>
      {toolbar}
      {notice}
      <div
        role={isForm ? undefined : 'menu'}
        aria-labelledby={isForm ? undefined : titleId}
        className="journalit-filter-menu__scroll"
      >
        {children}
      </div>
    </div>
  );
};

interface BranchRowsProps {
  entries: FilterMenuEntry[];
  openChildId: string | undefined;
  onOpenChild: (childId: string, focus: boolean) => void;
  onHoverRow: (childId: string | null) => void;
  registerAnchor: (id: string, element: HTMLElement | null) => void;
}

const BranchRows: React.FC<BranchRowsProps> = ({
  entries,
  openChildId,
  onOpenChild,
  onHoverRow,
  registerAnchor,
}) => (
  <>
    {entries.map((entry) => {
      if (entry.kind === 'divider') {
        return <hr key={entry.id} className="journalit-filter-menu__divider" />;
      }
      const Icon = entry.icon;
      const isOpen = openChildId === entry.id;
      return (
        <button
          key={entry.id}
          ref={(el) => registerAnchor(entry.id, el)}
          type="button"
          role="menuitem"
          aria-haspopup={entry.kind === 'date-range' ? 'dialog' : 'menu'}
          aria-expanded={isOpen}
          className={`journalit-filter-menu__row${isOpen ? ' is-open' : ''}`}
          onClick={() => onOpenChild(entry.id, false)}
          onPointerEnter={() => onHoverRow(entry.id)}
          data-filter-menu-item
          data-filter-menu-opens={entry.id}
        >
          {Icon && (
            <Icon
              size={14}
              className="journalit-filter-menu__row-icon"
              aria-hidden="true"
            />
          )}
          <span className="journalit-filter-menu__row-label">
            {entry.label}
          </span>
          <NodeCounts node={entry} />
          <ChevronRight
            size={14}
            className="journalit-filter-menu__row-chevron"
            aria-hidden="true"
          />
        </button>
      );
    })}
  </>
);

interface NavigationProps {
  openChildId: string | undefined;
  onOpenChild: (childId: string, focus: boolean) => void;
  onCloseChild: () => void;
  onHoverRow: (childId: string | null) => void;
  registerAnchor: (id: string, element: HTMLElement | null) => void;
}

export const RootPanel: React.FC<
  PanelFrameProps &
    NavigationProps & {
      title: string;
      entries: FilterMenuEntry[];
      canReset: boolean;
      onReset: () => void;
    }
> = ({ entries, canReset, onReset, ...props }) => (
  <PanelChrome {...props}>
    <BranchRows entries={entries} {...props} />
    <hr className="journalit-filter-menu__divider" />
    <button
      type="button"
      role="menuitem"
      className="journalit-filter-menu__reset"
      disabled={!canReset}
      onClick={onReset}
      onPointerEnter={() => props.onHoverRow(null)}
      data-filter-menu-item
    >
      <RotateCcw size={14} aria-hidden="true" />
      <span>{t('filter.reset')}</span>
    </button>
  </PanelChrome>
);

export const BranchPanel: React.FC<
  PanelFrameProps &
    NavigationProps & { title: string; entries: FilterMenuEntry[] }
> = ({ title, entries, ...props }) => (
  <PanelChrome {...props} title={title}>
    <BranchRows entries={entries} {...props} />
  </PanelChrome>
);

const MATCH_MODE_BADGE_KEYS: Record<
  Exclude<FilterMatchMode, 'any'>,
  TranslationKey
> = {
  all: 'filter.menu.match.badge.all',
  only: 'filter.menu.match.badge.only',
  exact: 'filter.menu.match.badge.exact',
};

export const DateRangePanel: React.FC<
  PanelFrameProps &
    DateRangePickerLifecycle & {
      node: FilterMenuDateRangeNode;
    }
> = ({ node, onPickerOpen, onPickerClose, ...frame }) => (
  <PanelChrome {...frame} title={node.label} isForm>
    <DateRangePanelContent
      node={node}
      onPickerOpen={onPickerOpen}
      onPickerClose={onPickerClose}
    />
  </PanelChrome>
);

export const ValuesPanel: React.FC<
  PanelFrameProps &
    NavigationProps & {
      node: FilterMenuValuesNode;
      onClear: () => void;
    }
> = ({ node, onClear, ...props }) => {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const visibleOptions = normalizedQuery
    ? node.options.filter((option) =>
        option.label.toLowerCase().includes(normalizedQuery)
      )
    : node.options;
  const excluded = node.excluded;
  
  
  const counts = countNode(node);
  const hasSelection = counts.included > 0 || counts.excluded > 0;
  const { openChildId, onOpenChild, onHoverRow, registerAnchor } = props;
  const matchChildId = node.matchChild?.id ?? '';
  
  const guideOptionValue = (
    visibleOptions.find((option) => option.value !== node.noValueOption) ??
    visibleOptions[0]
  )?.value;

  const toolbar = (
    <>
      {node.matchChild && node.matchMode !== null && (
        <div className="journalit-filter-menu__match">
          <button
            ref={(el) => registerAnchor(matchChildId, el)}
            type="button"
            className={`journalit-filter-menu__match-row${openChildId === matchChildId ? ' is-open' : ''}`}
            aria-haspopup="menu"
            aria-expanded={openChildId === matchChildId}
            onClick={() => onOpenChild(matchChildId, false)}
            onPointerEnter={() => onHoverRow(matchChildId)}
            data-filter-menu-item
            data-filter-menu-opens={matchChildId}
          >
            <span className="journalit-filter-menu__match-label">
              {t('filter.menu.match.label')}
            </span>
            <span className="journalit-filter-menu__match-value">
              {matchModeLabel(node.matchMode)}
            </span>
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}
      {node.options.length >= SEARCH_THRESHOLD && (
        <label className="journalit-filter-menu__search">
          <Search size={13} aria-hidden="true" />
          <span className="journalit-sr-only">{t('filter.menu.search')}</span>
          <input
            type="text"
            value={query}
            placeholder={t('filter.menu.search')}
            onChange={(event) => setQuery(event.target.value)}
            data-filter-menu-item
          />
        </label>
      )}
    </>
  );

  return (
    <PanelChrome
      {...props}
      title={node.label}
      headerAction={
        !node.singleChoice &&
        (hasSelection ||
          (node.matchMode !== null && node.matchMode !== 'any')) ? (
          <button
            type="button"
            className="journalit-filter-menu__clear"
            onClick={onClear}
            data-filter-menu-item
          >
            {t('filter.menu.clear')}
          </button>
        ) : null
      }
      toolbar={toolbar}
      notice={
        visibleOptions.length === 0 ? (
          <div className="journalit-filter-menu__empty">
            {normalizedQuery
              ? t('filter.menu.no-matches')
              : (node.emptyLabel ?? t('filter.menu.no-options'))}
          </div>
        ) : null
      }
    >
      {visibleOptions.map((option) => {
        const isIncluded = node.included.has(option.value);
        const isPartial =
          !isIncluded && (node.partial?.has(option.value) ?? false);
        const isExcluded = excluded?.has(option.value) ?? false;
        
        const includeDisabled =
          option.value === node.noValueOption &&
          node.matchMode !== null &&
          node.matchMode !== 'any';
        const child = node.optionChildren?.get(option.value);
        const childCount = child ? countNode(child).included : 0;
        return (
          <div
            key={option.value}
            role="none"
            ref={child ? (el) => registerAnchor(child.id, el) : undefined}
            className={[
              'journalit-filter-menu__option-row',
              child && openChildId === child.id ? 'is-open' : '',
              isExcluded ? 'is-excluded' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onPointerEnter={() => onHoverRow(child ? child.id : null)}
            data-filter-menu-guide-option={
              option.value === guideOptionValue ? '' : undefined
            }
          >
            <button
              type="button"
              role={node.singleChoice ? 'menuitemradio' : 'menuitemcheckbox'}
              aria-checked={isIncluded ? true : isPartial ? 'mixed' : false}
              disabled={includeDisabled}
              className={[
                'journalit-filter-menu__option',
                isIncluded ? 'is-included' : '',
                isPartial ? 'is-partial' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={(event) => {
                if (child?.kind === 'date-range') {
                  onOpenChild(child.id, true);
                  return;
                }
                
                
                
                
                
                const chevron = child
                  ? event.currentTarget.querySelector(
                      '.journalit-filter-menu__option-chevron'
                    )
                  : null;
                if (
                  child &&
                  chevron &&
                  event.nativeEvent
                    .composedPath()
                    .some((node) => node === chevron)
                ) {
                  onOpenChild(child.id, false);
                  return;
                }
                if (node.singleChoice) props.onCloseChild();
                node.onToggle(option.value, 'include');
              }}
              data-filter-menu-item
              data-filter-menu-opens={child?.id}
              aria-haspopup={
                child?.kind === 'date-range'
                  ? 'dialog'
                  : child
                    ? 'menu'
                    : undefined
              }
              aria-expanded={child ? openChildId === child.id : undefined}
            >
              <span className="journalit-filter-menu__check" aria-hidden>
                {isIncluded && <Check size={11} />}
                {isPartial && <Minus size={11} />}
              </span>
              <span className="journalit-filter-menu__option-text">
                <span className="journalit-filter-menu__option-label">
                  {option.label}
                </span>
                {(option.description || includeDisabled) && (
                  <span className="journalit-sr-only">, </span>
                )}
                {(option.description || includeDisabled) && (
                  <span className="journalit-filter-menu__option-description">
                    {includeDisabled
                      ? t('filter.menu.match.no-value-any-only')
                      : option.description}
                  </span>
                )}
              </span>
              {childCount > 0 && (
                <span className="journalit-filter-menu__count">
                  {childCount}
                </span>
              )}
              {child && (
                <span
                  className="journalit-filter-menu__option-chevron"
                  aria-hidden="true"
                >
                  <ChevronRight size={14} />
                </span>
              )}
            </button>
            {excluded && (
              <button
                type="button"
                role="menuitemcheckbox"
                aria-checked={isExcluded}
                className={[
                  'journalit-filter-menu__exclude clickable-icon',
                  isExcluded ? 'is-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label={t('filter.menu.exclude-value', {
                  label: option.label,
                })}
                onClick={() => node.onToggle(option.value, 'exclude')}
                data-filter-menu-item
              >
                <Ban size={13} aria-hidden="true" />
              </button>
            )}
          </div>
        );
      })}
    </PanelChrome>
  );
};
