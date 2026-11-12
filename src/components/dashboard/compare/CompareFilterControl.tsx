

import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import {
  Funnel,
  GitCompare,
  Plus,
  Save,
  Trash2,
  X,
} from '../../shared/icons/ObsidianIcon';
import type { FilterMenuHandle } from '../../shared/filters/menu/CascadingFilterMenu';
import {
  FilterMenuButton,
  type LoadedFilterMenuOptions,
  type TradeFilterMenuTour,
} from '../../shared/filters/menu/FilterMenu';
import type { FilterMenuEntry } from '../../shared/filters/menu/menuModel';
import type { UnifiedFilters } from '../../shared/filters/types';
import type { FilterState } from '../dashboardTypes';
import type { DashboardCompareControlsValue } from './DashboardCompareControls';
import { toComparisonFilters } from './dashboardComparison';
import {
  describeComparisonFilters,
  selectsAllTrades,
  suggestComparisonName,
} from './describeComparisonFilters';
import { SaveComparisonForm } from './SaveComparisonForm';
import { SegmentedControl } from '../../shared/SegmentedControl';
import { useSavedComparisons } from './useSavedComparisons';

type CompareSide = 'a' | 'b';

const SIDE_LETTER: Record<CompareSide, string> = { a: 'A', b: 'B' };

const SIDES: readonly CompareSide[] = ['a', 'b'];


const SideSwitch: React.FC<{
  side: CompareSide;
  onSwitch: (side: CompareSide) => void;
}> = ({ side, onSwitch }) => {
  const options = useMemo(
    () =>
      SIDES.map((option) => ({
        value: option,
        label: t('dashboard.compare.filter-side', {
          side: SIDE_LETTER[option],
        }),
        icon: (
          <Funnel
            size={14}
            className={`journalit-compare-tone--${option}`}
            aria-hidden="true"
          />
        ),
      })),
    []
  );
  return (
    <SegmentedControl
      options={options}
      value={side}
      onChange={onSwitch}
      size="small"
      groupRole="radiogroup"
      ariaLabel={t('dashboard.compare.control-label')}
      className="journalit-compare-menu-switch"
    />
  );
};

interface CompareFilterControlProps {
  plugin: JournalitPlugin;
  
  filters: FilterState;
  onFilterMenuChange: (filters: UnifiedFilters) => void;
  
  compareFilters: FilterState | null;
  onCompareFilterMenuChange: (filters: UnifiedFilters) => void;
  compare: DashboardCompareControlsValue | null;
  loadOptions: () => Promise<LoadedFilterMenuOptions>;
  onOpenChange?: (isOpen: boolean) => void;
  guideTour?: TradeFilterMenuTour | null;
}

export const CompareFilterControl: React.FC<CompareFilterControlProps> = ({
  plugin,
  filters,
  onFilterMenuChange,
  compareFilters,
  onCompareFilterMenuChange,
  compare,
  loadOptions,
  onOpenChange,
  guideTour,
}) => {
  const { saved, saveComparison, deleteComparison } =
    useSavedComparisons(plugin);
  const comparing = Boolean(compareFilters);

  
  
  
  
  
  
  
  
  const slotRef = useRef<HTMLSpanElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const focusAfterSwitchRef = useRef(false);
  const openAfterStartRef = useRef<CompareSide | null>(null);
  const menusRef = useRef<Record<CompareSide, FilterMenuHandle | null>>({
    a: null,
    b: null,
  });
  const menuRefA = useCallback((handle: FilterMenuHandle | null) => {
    menusRef.current.a = handle;
  }, []);
  const menuRefB = useCallback((handle: FilterMenuHandle | null) => {
    menusRef.current.b = handle;
  }, []);
  useLayoutEffect(() => {
    const openSide = openAfterStartRef.current;
    openAfterStartRef.current = null;
    if (openSide) {
      menusRef.current[openSide]?.open();
      return;
    }
    if (!focusAfterSwitchRef.current) return;
    focusAfterSwitchRef.current = false;
    slotRef.current?.querySelector<HTMLElement>('button')?.focus();
  }, [comparing]);
  const handleSideOpenChange = useCallback(
    (side: CompareSide, isOpen: boolean) => {
      onOpenChange?.(isOpen);
      if (isOpen) menusRef.current[side === 'a' ? 'b' : 'a']?.close();
    },
    [onOpenChange]
  );
  const switchSide = useCallback((side: CompareSide) => {
    menusRef.current[side]?.open();
  }, []);
  const startComparison = useMemo(() => {
    const start = compare?.startComparison;
    if (!start) return undefined;
    return (...args: Parameters<typeof start>) => {
      const isNew = args[0] === undefined;
      focusAfterSwitchRef.current = !isNew;
      openAfterStartRef.current = isNew
        ? selectsAllTrades(toComparisonFilters(filters))
          ? 'a'
          : 'b'
        : null;
      start(...args);
    };
  }, [compare?.startComparison, filters]);
  const stopComparison = useMemo(() => {
    const stop = compare?.stopComparison;
    if (!stop) return undefined;
    return () => {
      focusAfterSwitchRef.current = true;
      stop();
    };
  }, [compare?.stopComparison]);

  const startEntries = useMemo<FilterMenuEntry[] | undefined>(() => {
    if (!startComparison) return undefined;
    const savedEntries: FilterMenuEntry[] = saved.map((comparison) => ({
      kind: 'action',
      id: `compare/saved/${comparison.id}`,
      label: comparison.name,
      icon: Funnel,
      iconClassName: 'journalit-compare-tone--a',
      pairIcon: { icon: Funnel, className: 'journalit-compare-tone--b' },
      onSelect: () => startComparison(comparison),
      secondary: {
        label: t('dashboard.compare.delete-saved', { name: comparison.name }),
        icon: Trash2,
        onSelect: () => deleteComparison(comparison.id),
      },
    }));
    return [
      {
        kind: 'branch',
        id: 'compare',
        label: t('dashboard.compare.menu'),
        icon: GitCompare,
        children: [
          {
            kind: 'action',
            id: 'compare/new',
            label: t('dashboard.compare.new'),
            icon: Plus,
            onSelect: () => startComparison(),
          },
          ...(savedEntries.length > 0
            ? [
                { kind: 'divider' as const, id: 'compare/divider' },
                {
                  kind: 'heading' as const,
                  id: 'compare/saved',
                  label: t('dashboard.compare.saved'),
                },
                ...savedEntries,
              ]
            : []),
        ],
      },
    ];
  }, [deleteComparison, saved, startComparison]);

  const comparingEntries = useMemo<FilterMenuEntry[] | undefined>(() => {
    if (!compareFilters || !stopComparison) return undefined;
    const a = toComparisonFilters(filters);
    const b = toComparisonFilters(compareFilters);
    return [
      {
        kind: 'form',
        id: 'compare/save',
        label: t('dashboard.compare.save'),
        icon: Save,
        render: (close) => (
          <SaveComparisonForm
            defaultName={suggestComparisonName(a, b)}
            onSave={(name) => {
              saveComparison(name, a, b);
              close();
            }}
          />
        ),
      },
      {
        kind: 'action',
        id: 'compare/stop',
        label: t('dashboard.compare.stop'),
        icon: X,
        onSelect: stopComparison,
      },
    ];
  }, [compareFilters, filters, saveComparison, stopComparison]);

  if (!compareFilters || !comparingEntries) {
    return (
      <span ref={slotRef} className="journalit-compare-slot">
        <FilterMenuButton
          plugin={plugin}
          context="dashboard"
          filters={filters}
          onChange={onFilterMenuChange}
          loadOptions={loadOptions}
          className="journalit-dashboard-filter-button"
          onOpenChange={onOpenChange}
          guideTour={guideTour}
          extraEntries={startEntries}
        />
      </span>
    );
  }

  return (
    <span ref={slotRef} className="journalit-compare-slot">
      <div
        ref={controlRef}
        className="journalit-compare-control"
        role="group"
        aria-label={t('dashboard.compare.control-label')}
      >
        <CompareSideMenu
          side="a"
          plugin={plugin}
          filters={filters}
          onChange={onFilterMenuChange}
          loadOptions={loadOptions}
          extraEntries={comparingEntries}
          menuRef={menuRefA}
          onSideOpenChange={handleSideOpenChange}
          onSwitch={switchSide}
          anchorRef={controlRef}
        />
        <CompareSideMenu
          side="b"
          plugin={plugin}
          filters={compareFilters}
          onChange={onCompareFilterMenuChange}
          loadOptions={loadOptions}
          extraEntries={comparingEntries}
          menuRef={menuRefB}
          onSideOpenChange={handleSideOpenChange}
          onSwitch={switchSide}
          anchorRef={controlRef}
        />
        <button
          type="button"
          className="journalit-compare-control__stop clickable-icon"
          aria-label={t('dashboard.compare.stop')}
          onClick={stopComparison}
        >
          <X size={13} aria-hidden="true" />
        </button>
      </div>
    </span>
  );
};

const CompareSideMenu: React.FC<{
  side: CompareSide;
  plugin: JournalitPlugin;
  filters: FilterState;
  onChange: (filters: UnifiedFilters) => void;
  loadOptions: () => Promise<LoadedFilterMenuOptions>;
  extraEntries: FilterMenuEntry[];
  menuRef: (handle: FilterMenuHandle | null) => void;
  onSideOpenChange: (side: CompareSide, isOpen: boolean) => void;
  onSwitch: (side: CompareSide) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}> = ({
  side,
  plugin,
  filters,
  onChange,
  loadOptions,
  extraEntries,
  menuRef,
  onSideOpenChange,
  onSwitch,
  anchorRef,
}) => {
  const description = describeComparisonFilters(toComparisonFilters(filters));
  const handleOpenChange = useCallback(
    (isOpen: boolean) => onSideOpenChange(side, isOpen),
    [onSideOpenChange, side]
  );
  const renderTrigger = useCallback(
    ({
      onClick,
      isOpen,
      activeFilterCount,
    }: {
      onClick: () => void;
      isOpen: boolean;
      activeFilterCount: number;
    }) => (
      <button
        type="button"
        className={[
          'journalit-compare-control__part',
          `journalit-compare-control__part--${side}`,
          isOpen ? 'is-open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={onClick}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t('dashboard.compare.side-label', {
          side: SIDE_LETTER[side],
          description,
        })}
      >
        <Funnel size={14} aria-hidden="true" />
        {activeFilterCount > 0 && (
          <span className="journalit-compare-control__count">
            {activeFilterCount}
          </span>
        )}
      </button>
    ),
    [description, side]
  );
  return (
    <FilterMenuButton
      plugin={plugin}
      context="dashboard"
      filters={filters}
      onChange={onChange}
      loadOptions={loadOptions}
      onOpenChange={handleOpenChange}
      renderTrigger={renderTrigger}
      title={<SideSwitch side={side} onSwitch={onSwitch} />}
      extraEntries={extraEntries}
      menuRef={menuRef}
      anchorRef={anchorRef}
    />
  );
};
