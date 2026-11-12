

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import {
  ESCAPE_DELEGATE_ATTRIBUTE,
  hasDelegatedEscapeSurface,
} from '../../../../views/escapeKeySuppression';
import { t, tPlural } from '../../../../lang/helpers';
import { useEventBus } from '../../../../hooks/useEventBus';
import { DateRangeEditor } from '../../../shared/filters/DateRangeEditor';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { SegmentedControl } from '../../../shared/SegmentedControl';
import {
  RECENT_PERIOD_MAX_COUNT,
  RECENT_PERIOD_UNITS,
  type RecentPeriod,
  type RecentPeriodUnit,
} from '../../../shared/filters/recentPeriod';
import { cssVars } from '../../../../styles/inlineStylePolicy';
import { useSlidingThumb } from '../../../../hooks/useSlidingThumb';
import {
  createDateWithoutTime,
  getWeekStartDaySetting,
} from '../../../../utils/dateUtils';
import {
  type DatePresetSelection,
  type RollingDatePreset,
  activeDatePreset,
  selectDatePreset,
} from '../../../../utils/datePresets';
import { mergeClassNames } from '../../../../utils/classNames';
import { DropdownMenu } from '../../../shared/DropdownMenu';
import { ChevronDown } from '../../../shared/icons/ObsidianIcon';
import { useMenuDisclosure } from '../../../../hooks/useMenuDisclosure';
import {
  anchoredMenuPortalRoot,
  useAnchoredMenuPosition,
} from '../../../shared/menus/useAnchoredMenuPosition';


export interface DateRangeFilterValue {
  dateRange: [Date | null, Date | null];
  datePreset?: DatePresetSelection;
  recentPeriod?: RecentPeriod;
}

interface DateRangeFilterProps extends DateRangeFilterValue {
  
  onChange: (value: DateRangeFilterValue) => void;
  
  shareRow?: boolean;
}

const DEFAULT_RECENT_PERIOD: RecentPeriod = { unit: 'sessions', count: 20 };
const RECENT_UNIT_LABELS: Record<RecentPeriodUnit, () => string> = {
  sessions: () => t('dashboard.filter.date.recent.unit.sessions'),
  trades: () => t('dashboard.filter.date.recent.unit.trades'),
  days: () => t('dashboard.filter.date.recent.unit.days'),
};

const RECENT_UNIT_HINTS: Record<RecentPeriodUnit, () => string> = {
  sessions: () => t('dashboard.filter.date.recent.hint.sessions'),
  trades: () => t('dashboard.filter.date.recent.hint.trades'),
  days: () => t('dashboard.filter.date.recent.hint.days'),
};


const RECENT_UNIT_LEADS: Record<RecentPeriodUnit, () => string> = {
  sessions: () => t('dashboard.filter.date.recent.last.sessions'),
  trades: () => t('dashboard.filter.date.recent.last.trades'),
  days: () => t('dashboard.filter.date.recent.last.days'),
};

const RECENT_PERIOD_LABELS: Record<
  RecentPeriodUnit,
  (count: number) => string
> = {
  sessions: (count) =>
    tPlural('dashboard.filter.date.recent.label.sessions', count),
  trades: (count) =>
    tPlural('dashboard.filter.date.recent.label.trades', count),
  days: (count) => tPlural('dashboard.filter.date.recent.label.days', count),
};


const formatRecentPeriodLabel = (period: RecentPeriod): string =>
  RECENT_PERIOD_LABELS[period.unit](period.count);

type CustomPeriodTab = 'dates' | 'recent';

type PresetType = RollingDatePreset | 'allTime' | 'custom';

interface PresetButtonConfig {
  id: PresetType;
  label: string;
}

interface DatePresetButtonsProps {
  presetButtons: PresetButtonConfig[];
  displayedPreset: PresetType | null;
  customLabel: string;
  onPresetClick: (preset: PresetType) => void;
  customDateAnchorRef: React.RefObject<HTMLDivElement | null>;
}

interface DropdownPosition {
  left: number;
  top: number;
}

const getOwnerDocument = (anchor: HTMLElement | null): Document =>
  anchor?.ownerDocument ?? window.activeDocument;

interface CustomDateDropdownProps {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  dropdownPosition: DropdownPosition | null;
  dateRange: [Date | null, Date | null];
  recentPeriod: RecentPeriod | undefined;
  onRangeChange: (range: [Date | null, Date | null]) => void;
  onRecentPeriodChange: (period: RecentPeriod) => void;
}

const createPresetButtons = (): PresetButtonConfig[] => [
  { id: 'today', label: t('dashboard.filter.date.today') },
  { id: 'yesterday', label: t('dashboard.filter.date.yesterday') },
  { id: 'thisWeek', label: t('dashboard.filter.date.this-week') },
  { id: 'thisMonth', label: t('dashboard.filter.date.this-month') },
  { id: 'thisQuarter', label: t('dashboard.filter.date.this-quarter') },
  { id: 'thisYear', label: t('dashboard.filter.date.this-year') },
  { id: 'allTime', label: t('dashboard.filter.date.all-time') },
  { id: 'custom', label: t('dashboard.filter.date.custom') },
];

const DatePresetButtons: React.FC<DatePresetButtonsProps> = ({
  presetButtons,
  displayedPreset,
  customLabel,
  onPresetClick,
  customDateAnchorRef,
}) => {
  const getButtonClickHandler = useCallback(
    (btnId: PresetType) => () => onPresetClick(btnId),
    [onPresetClick]
  );

  const { containerRef, thumb } = useSlidingThumb('button.active', [
    displayedPreset,
    presetButtons,
  ]);

  return (
    <div className="journalit-dashboard-date-range-presets" ref={containerRef}>
      {thumb && (
        <span
          className="journalit-dashboard-date-range-thumb"
          aria-hidden="true"
          style={cssVars({
            '--journalit-seg-thumb-left': `${thumb.left}px`,
            '--journalit-seg-thumb-width': `${thumb.width}px`,
          })}
        />
      )}
      {presetButtons.map((btn) => {
        const button = (
          <button
            key={btn.id}
            onClick={getButtonClickHandler(btn.id)}
            className={mergeClassNames(
              'journalit-native-button journalit-native-button--unstyled',
              displayedPreset === btn.id ? 'active' : ''
            )}
          >
            <span className="journalit-button__label">
              {btn.id === 'custom' ? customLabel : btn.label}
            </span>
          </button>
        );

        if (btn.id !== 'custom') {
          return button;
        }

        return (
          <div
            key={btn.id}
            ref={customDateAnchorRef}
            className="journalit-dashboard-custom-date-anchor"
          >
            {button}
          </div>
        );
      })}
    </div>
  );
};


const RecentPeriodEditor: React.FC<{
  period: RecentPeriod;
  onChange: (period: RecentPeriod) => void;
}> = ({ period, onChange }) => {
  
  const [countDraft, setCountDraft] = useState<string | null>(null);
  const unitOptions = useMemo(
    () =>
      RECENT_PERIOD_UNITS.map((unit) => ({
        value: unit,
        label: RECENT_UNIT_LABELS[unit](),
        description: RECENT_UNIT_HINTS[unit](),
      })),
    []
  );
  return (
    <div className="journalit-dashboard-recent-period">
      <span className="journalit-dashboard-recent-period__label">
        {RECENT_UNIT_LEADS[period.unit]()}
      </span>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={RECENT_PERIOD_MAX_COUNT}
        step={1}
        className="journalit-dashboard-recent-period__count"
        aria-label={t('dashboard.filter.date.recent.count')}
        value={countDraft ?? String(period.count)}
        onChange={(event) => {
          const text = event.target.value;
          const count = Number(text);
          if (
            Number.isInteger(count) &&
            count >= 1 &&
            count <= RECENT_PERIOD_MAX_COUNT
          ) {
            setCountDraft(null);
            if (count !== period.count) onChange({ ...period, count });
          } else {
            setCountDraft(text);
          }
        }}
        onBlur={() => setCountDraft(null)}
      />
      <DropdownSelect
        className="journalit-dashboard-recent-period__unit"
        value={period.unit}
        options={unitOptions}
        onChange={(unit) => {
          const next = RECENT_PERIOD_UNITS.find((value) => value === unit);
          if (next && next !== period.unit) onChange({ ...period, unit: next });
        }}
        ariaLabel={t('dashboard.filter.date.recent.unit')}
        menuWidth="content"
        showOptionTooltips={false}
      />
    </div>
  );
};

const CustomDateDropdown: React.FC<CustomDateDropdownProps> = ({
  dropdownRef,
  dropdownPosition,
  dateRange,
  recentPeriod,
  onRangeChange,
  onRecentPeriodChange,
}) => {
  const [tab, setTab] = useState<CustomPeriodTab>(
    recentPeriod ? 'recent' : 'dates'
  );
  return (
    <div
      ref={dropdownRef}
      
      {...{ [ESCAPE_DELEGATE_ATTRIBUTE]: 'true' }}
      className={`journalit-dashboard-custom-date-dropdown date-dropdown-visible ${dropdownPosition ? '' : 'journalit-dashboard-custom-date-dropdown--measuring'}`}
      style={cssVars({
        '--journalit-dashboard-date-dropdown-left': dropdownPosition
          ? `${dropdownPosition.left}px`
          : '0px',
        '--journalit-dashboard-date-dropdown-top': dropdownPosition
          ? `${dropdownPosition.top}px`
          : '0px',
      })}
    >
      <SegmentedControl<CustomPeriodTab>
        className="journalit-dashboard-custom-date-tabs"
        options={[
          { value: 'dates', label: t('dashboard.filter.date.tab.dates') },
          { value: 'recent', label: t('dashboard.filter.date.tab.recent') },
        ]}
        value={tab}
        onChange={(next) => {
          setTab(next);
          
          if (next === 'recent' && !recentPeriod) {
            onRecentPeriodChange(DEFAULT_RECENT_PERIOD);
          }
        }}
        size="small"
        fullWidth
        groupRole="radiogroup"
        ariaLabel={t('dashboard.filter.date.tab.label')}
      />
      {tab === 'dates' ? (
        <DateRangeEditor
          initialRange={dateRange}
          policy="open-ended"
          onChange={onRangeChange}
        />
      ) : (
        <RecentPeriodEditor
          period={recentPeriod ?? DEFAULT_RECENT_PERIOD}
          onChange={onRecentPeriodChange}
        />
      )}
    </div>
  );
};

const DATE_DROPDOWN_FALLBACK_WIDTH = 300;
const DATE_DROPDOWN_FALLBACK_HEIGHT = 160;
const DATE_DROPDOWN_VIEWPORT_MARGIN = 20;
const DATE_DROPDOWN_GAP = 8;

interface ViewportRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const clamp = (value: number, min: number, max: number): number => {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
};

const getViewportRect = (win: Window): ViewportRect => {
  const visualViewport = win.visualViewport;
  const left = visualViewport?.offsetLeft ?? 0;
  const top = visualViewport?.offsetTop ?? 0;
  const width = visualViewport?.width ?? win.innerWidth;
  const height = visualViewport?.height ?? win.innerHeight;

  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
  };
};

const calculateDropdownPosition = (
  anchorRect: DOMRect,
  dropdownRect: DOMRect | null,
  win: Window
): DropdownPosition => {
  const dropdownWidth = dropdownRect?.width || DATE_DROPDOWN_FALLBACK_WIDTH;
  const dropdownHeight = dropdownRect?.height || DATE_DROPDOWN_FALLBACK_HEIGHT;
  const viewport = getViewportRect(win);
  const margin = DATE_DROPDOWN_VIEWPORT_MARGIN;

  const wouldOverflowRight =
    anchorRect.left + dropdownWidth > viewport.right - margin;
  const wouldOverflowLeft =
    anchorRect.right - dropdownWidth < viewport.left + margin;
  const shouldPositionLeft = wouldOverflowRight && !wouldOverflowLeft;

  const preferredLeft = shouldPositionLeft
    ? anchorRect.right - dropdownWidth
    : anchorRect.left;
  const anchorIsHorizontallyVisible =
    anchorRect.right > viewport.left && anchorRect.left < viewport.right;
  const left = anchorIsHorizontallyVisible
    ? clamp(
        preferredLeft,
        viewport.left + margin,
        viewport.right - margin - dropdownWidth
      )
    : preferredLeft;

  const preferredTopBelow = anchorRect.bottom + DATE_DROPDOWN_GAP;
  const preferredTopAbove = anchorRect.top - dropdownHeight - DATE_DROPDOWN_GAP;
  const fitsBelow =
    preferredTopBelow + dropdownHeight <= viewport.bottom - margin;
  const fitsAbove = preferredTopAbove >= viewport.top + margin;
  const preferredTop =
    fitsBelow || !fitsAbove ? preferredTopBelow : preferredTopAbove;
  const anchorIsVerticallyVisible =
    anchorRect.bottom > viewport.top && anchorRect.top < viewport.bottom;
  const top = anchorIsVerticallyVisible
    ? clamp(
        preferredTop,
        viewport.top + margin,
        viewport.bottom - margin - dropdownHeight
      )
    : preferredTop;

  return {
    left: Math.round(left),
    top: Math.round(top),
  };
};

const areDropdownPositionsEqual = (
  first: DropdownPosition | null,
  second: DropdownPosition
): boolean => {
  if (!first) return false;
  return first.left === second.left && first.top === second.top;
};

interface CustomDropdownDismissalOptions {
  isOpen: boolean;
  
  setOpen: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}


const useCustomDropdownDismissal = ({
  isOpen,
  setOpen,
  anchorRef,
  containerRef,
  dropdownRef,
}: CustomDropdownDismissalOptions): (() => void) => {
  const closeCustomDropdown = useCallback(() => {
    const ownerDocument = getOwnerDocument(anchorRef.current);
    const activeElement = ownerDocument.activeElement;
    if (
      activeElement?.instanceOf(HTMLElement) &&
      dropdownRef.current?.contains(activeElement)
    ) {
      
      activeElement.blur();
    }
    setOpen(false);
  }, [anchorRef, dropdownRef, setOpen]);

  
  const isInsideCustomDropdown = useCallback(
    (target: EventTarget | null): boolean => {
      const ownerDocument = getOwnerDocument(anchorRef.current);
      
      if (!(target instanceof (ownerDocument.defaultView?.Node ?? Node))) {
        return false;
      }
      return (
        containerRef.current?.contains(target) === true ||
        dropdownRef.current?.contains(target) === true ||
        (target.instanceOf(Element) &&
          target.closest(
            '.journalit-date-picker-host, .journalit-dropdown-select__menu'
          ) !== null)
      );
    },
    [anchorRef, containerRef, dropdownRef]
  );

  
  useEffect(() => {
    if (!isOpen) return undefined;
    const ownerDocument = getOwnerDocument(anchorRef.current);
    const handleClickOutside = (event: MouseEvent) => {
      if (!isInsideCustomDropdown(event.target)) closeCustomDropdown();
    };
    const handleScroll = (event: Event) => {
      
      if (!isInsideCustomDropdown(event.target)) closeCustomDropdown();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      
      if (
        event.key !== 'Escape' ||
        event.defaultPrevented ||
        hasDelegatedEscapeSurface(
          ownerDocument,
          dropdownRef.current,
          event.composedPath()
        )
      )
        return;
      closeCustomDropdown();
    };
    ownerDocument.addEventListener('mousedown', handleClickOutside);
    ownerDocument.addEventListener('scroll', handleScroll, {
      capture: true,
      passive: true,
    });
    ownerDocument.addEventListener('keydown', handleKeyDown);
    return () => {
      ownerDocument.removeEventListener('mousedown', handleClickOutside);
      ownerDocument.removeEventListener('scroll', handleScroll, {
        capture: true,
      });
      ownerDocument.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isOpen,
    anchorRef,
    dropdownRef,
    isInsideCustomDropdown,
    closeCustomDropdown,
  ]);

  return closeCustomDropdown;
};


function useIsDateRangeCompact(
  dateRangeContainerRef: React.RefObject<HTMLDivElement | null>,
  shareRow: boolean
): boolean {
  const [isCompact, setIsCompact] = useState(false);
  const naturalWidthRef = useRef(0);

  
  
  
  
  
  
  
  
  
  useLayoutEffect(() => {
    const wrapper = dateRangeContainerRef.current;
    if (!wrapper) return undefined;
    let row: HTMLElement | null = null;
    
    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => check());
    const mutationObserver = shareRow
      ? new MutationObserver(() => check())
      : null;

    function findRow(): HTMLElement | null {
      let candidate = wrapper?.parentElement ?? null;
      while (candidate) {
        const style = getComputedStyle(candidate);
        const isFlex =
          style.display === 'flex' || style.display === 'inline-flex';
        if (!isFlex || style.flexWrap === 'wrap') return candidate;
        candidate = candidate.parentElement;
      }
      return null;
    }

    function check() {
      const nextRow = findRow();
      if (nextRow !== row) {
        if (row) resizeObserver?.unobserve(row);
        mutationObserver?.disconnect();
        row = nextRow;
        if (row) {
          resizeObserver?.observe(row);
          mutationObserver?.observe(row, { childList: true });
        }
      }
      if (!row) return;
      
      
      const strip = wrapper?.querySelector<HTMLElement>(
        '.journalit-dashboard-date-range-presets'
      );
      if (strip && strip.scrollWidth > 0) {
        naturalWidthRef.current = strip.scrollWidth;
      }
      if (naturalWidthRef.current === 0 || row.clientWidth === 0) return;
      const style = getComputedStyle(row);
      const available =
        row.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      setIsCompact(
        naturalWidthRef.current + (shareRow ? siblingsWidth(row, style) : 0) >
          available + 1
      );
    }

    function siblingsWidth(
      rowElement: HTMLElement,
      style: CSSStyleDeclaration
    ) {
      const siblings = Array.from(rowElement.children).filter(
        (child): child is HTMLElement =>
          child.instanceOf(HTMLElement) &&
          !child.contains(wrapper) &&
          child.offsetParent !== null
      );
      const gap = parseFloat(style.columnGap) || 0;
      return siblings.reduce((total, sibling) => {
        resizeObserver?.observe(sibling);
        return total + Math.max(sibling.offsetWidth, sibling.scrollWidth) + gap;
      }, 0);
    }

    resizeObserver?.observe(wrapper);
    check();
    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [dateRangeContainerRef, shareRow]);

  return isCompact;
}

interface CompactDatePresetMenuProps {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  presetButtons: PresetButtonConfig[];
  activePreset: PresetType;
  
  customLabel: string;
  onPresetClick: (preset: PresetType) => void;
}


const CompactDatePresetMenu: React.FC<CompactDatePresetMenuProps> = ({
  anchorRef,
  presetButtons,
  activePreset,
  customLabel,
  onPresetClick,
}) => {
  const { isOpen, setIsOpen, close, containerRef, triggerRef, menuProps } =
    useMenuDisclosure({ initialFocus: 'checked' });
  const activeLabel =
    activePreset === 'custom'
      ? customLabel
      : (presetButtons.find((button) => button.id === activePreset)?.label ??
        '');
  const menuPosition = useAnchoredMenuPosition({
    isOpen,
    triggerRef,
    menuRef: menuProps.ref,
    
    minWidth: 160,
    maxHeight: 360,
  });
  
  
  const setAnchor = useCallback(
    (element: HTMLDivElement | null) => {
      anchorRef.current = element;
      containerRef.current = element;
    },
    [anchorRef, containerRef]
  );

  return (
    <div className="journalit-dashboard-date-range-compact" ref={setAnchor}>
      <button
        type="button"
        className="journalit-native-button journalit-native-button--unstyled journalit-dashboard-date-range-compact__trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        ref={triggerRef}
      >
        <span className="journalit-dashboard-date-range-compact__thumb">
          <span className="journalit-button__label">{activeLabel}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </span>
      </button>
      
      {isOpen
        ? createPortal(
            <div
              className="journalit-anchored-menu journalit-dashboard-date-range-menu-host"
              style={cssVars({
                '--journalit-anchored-menu-top': `${menuPosition.top}px`,
                '--journalit-anchored-menu-left': `${menuPosition.left}px`,
                '--journalit-anchored-menu-width': `${menuPosition.width}px`,
                '--journalit-anchored-menu-max-height': `${menuPosition.maxHeight}px`,
              })}
            >
              <DropdownMenu
                className="journalit-dashboard-date-range-menu"
                options={presetButtons.map((button) => ({
                  value: button.id,
                  label: button.label,
                }))}
                value={activePreset}
                menuProps={menuProps}
                onChange={(preset) => {
                  close(true);
                  onPresetClick(preset);
                }}
              />
            </div>,
            anchoredMenuPortalRoot(triggerRef.current)
          )
        : null}
    </div>
  );
};


export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  datePreset,
  recentPeriod,
  onChange,
  shareRow = false,
}) => {
  
  const [isCustomDropdownOpen, setIsCustomDropdownOpen] = useState(false);
  const compactAnchorRef = useRef<HTMLDivElement>(null);
  
  const dateRangeContainerRef = useRef<HTMLDivElement>(null);
  
  const isCompact = useIsDateRangeCompact(dateRangeContainerRef, shareRow);
  const customDateAnchorRef = useRef<HTMLDivElement>(null);
  const customDateDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition | null>(null);

  const weekStartDay = getWeekStartDaySetting();
  const [, setSettingsVersion] = useState(0);

  const handleSettingsChanged = useCallback(
    (payload?: { section?: string; source?: string }) => {
      if (payload?.section === 'trade' || payload?.source === 'week-start') {
        setSettingsVersion((prev) => prev + 1);
      }
    },
    []
  );

  useEventBus('settings:changed', handleSettingsChanged);

  
  
  const activePreset: PresetType = recentPeriod
    ? 'custom'
    : (activeDatePreset({ dateRange, datePreset }, weekStartDay) ??
      (dateRange[0] === null && dateRange[1] === null ? 'allTime' : 'custom'));
  const customLabel = recentPeriod
    ? formatRecentPeriodLabel(recentPeriod)
    : t('dashboard.filter.date.custom');

  const closeCustomDropdown = useCustomDropdownDismissal({
    isOpen: isCustomDropdownOpen,
    setOpen: setIsCustomDropdownOpen,
    anchorRef: customDateAnchorRef,
    containerRef: dateRangeContainerRef,
    dropdownRef: customDateDropdownRef,
  });

  const updateDropdownPosition = useCallback(() => {
    const anchor = (isCompact ? compactAnchorRef : customDateAnchorRef).current;
    if (!anchor) return;

    const ownerDocument = getOwnerDocument(anchor);
    const win = ownerDocument.defaultView;
    if (!win) return;

    
    
    const anchorRect = anchor.getBoundingClientRect();
    if (anchorRect.width === 0 && anchorRect.height === 0) {
      closeCustomDropdown();
      return;
    }

    const nextPosition = calculateDropdownPosition(
      anchorRect,
      customDateDropdownRef.current?.getBoundingClientRect() ?? null,
      win
    );

    setDropdownPosition((previous) =>
      areDropdownPositionsEqual(previous, nextPosition)
        ? previous
        : nextPosition
    );
  }, [isCompact, closeCustomDropdown]);

  
  
  
  useLayoutEffect(() => {
    if (!isCustomDropdownOpen) {
      setDropdownPosition(null);
      return undefined;
    }

    updateDropdownPosition();

    const anchor = (isCompact ? compactAnchorRef : customDateAnchorRef).current;
    if (!anchor) return undefined;

    const ownerDocument = getOwnerDocument(anchor);
    const win = ownerDocument.defaultView;
    if (!win) return undefined;

    const handleViewportChange = () => updateDropdownPosition();
    win.addEventListener('resize', handleViewportChange);
    ownerDocument.addEventListener('scroll', handleViewportChange, {
      capture: true,
      passive: true,
    });
    win.visualViewport?.addEventListener('resize', handleViewportChange);
    win.visualViewport?.addEventListener('scroll', handleViewportChange, {
      passive: true,
    });

    const ResizeObserverConstructor = win.ResizeObserver;
    const resizeObserver = ResizeObserverConstructor
      ? new ResizeObserverConstructor(handleViewportChange)
      : null;
    resizeObserver?.observe(anchor);
    if (customDateDropdownRef.current) {
      resizeObserver?.observe(customDateDropdownRef.current);
    }

    return () => {
      resizeObserver?.disconnect();
      win.removeEventListener('resize', handleViewportChange);
      ownerDocument.removeEventListener('scroll', handleViewportChange, {
        capture: true,
      });
      win.visualViewport?.removeEventListener('resize', handleViewportChange);
      win.visualViewport?.removeEventListener('scroll', handleViewportChange);
    };
  }, [isCompact, isCustomDropdownOpen, updateDropdownPosition]);

  const handleRangeChange = useCallback(
    ([start, end]: [Date | null, Date | null]) => {
      onChange({
        dateRange: [
          start ? createDateWithoutTime(start, true) : null,
          end ? createDateWithoutTime(end, false) : null,
        ],
      });
    },
    [onChange]
  );

  const handleRecentPeriodChange = useCallback(
    (period: RecentPeriod) => {
      onChange({ dateRange: [null, null], recentPeriod: period });
    },
    [onChange]
  );

  
  const handlePresetClick = useCallback(
    (preset: PresetType) => {
      if (preset === 'custom') {
        
        
        setIsCustomDropdownOpen(
          activePreset === 'custom' ? !isCustomDropdownOpen : true
        );
        return;
      }

      setIsCustomDropdownOpen(false);
      onChange(
        preset === 'allTime'
          ? { dateRange: [null, null] }
          : selectDatePreset(preset, weekStartDay, new Date())
      );
    },
    [activePreset, isCustomDropdownOpen, onChange, weekStartDay]
  );

  
  const presetButtons = useMemo(createPresetButtons, []);

  return (
    <>
      <div
        className="journalit-dashboard-date-range-filter"
        ref={dateRangeContainerRef}
      >
        {!isCompact ? (
          <DatePresetButtons
            presetButtons={presetButtons}
            displayedPreset={activePreset}
            customLabel={customLabel}
            onPresetClick={handlePresetClick}
            customDateAnchorRef={customDateAnchorRef}
          />
        ) : (
          <CompactDatePresetMenu
            anchorRef={compactAnchorRef}
            presetButtons={presetButtons}
            activePreset={activePreset}
            customLabel={customLabel}
            onPresetClick={handlePresetClick}
          />
        )}
      </div>
      {isCustomDropdownOpen
        ? createPortal(
            <CustomDateDropdown
              dropdownRef={customDateDropdownRef}
              dropdownPosition={dropdownPosition}
              dateRange={dateRange}
              recentPeriod={recentPeriod}
              onRangeChange={handleRangeChange}
              onRecentPeriodChange={handleRecentPeriodChange}
            />,
            getOwnerDocument(customDateAnchorRef.current).body
          )
        : null}
    </>
  );
};
