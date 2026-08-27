

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { t } from '../../../../lang/helpers';
import { useEventBus } from '../../../../hooks/useEventBus';
import { FastDateTimeInput } from '../../../../components/core/FastDateTimeInput';
import { cssVars } from '../../../../styles/inlineStylePolicy';
import {
  createDateWithoutTime,
  getQuarter,
  getWeekStartDate,
  getWeekStartDaySetting,
  type WeekStartDaySetting,
} from '../../../../utils/dateUtils';
import { mergeClassNames } from '../../../../utils/classNames';

interface DateRangeFilterProps {
  dateRange: [Date | null, Date | null];
  onChange: (dateRange: [Date | null, Date | null]) => void;
}

type PresetType =
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'thisMonth'
  | 'thisQuarter'
  | 'thisYear'
  | 'allTime'
  | 'custom';

interface PresetButtonConfig {
  id: PresetType;
  label: string;
}

interface DatePresetButtonsProps {
  presetButtons: PresetButtonConfig[];
  displayedPreset: PresetType | null;
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
  onStartDateChange: (date: Date | string | undefined) => void;
  onEndDateChange: (date: Date | string | undefined) => void;
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
  onPresetClick,
  customDateAnchorRef,
}) => {
  const getButtonClickHandler = useCallback(
    (btnId: PresetType) => () => onPresetClick(btnId),
    [onPresetClick]
  );

  return (
    <div className="journalit-dashboard-date-range-presets">
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
            {btn.label}
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

const CustomDateDropdown: React.FC<CustomDateDropdownProps> = ({
  dropdownRef,
  dropdownPosition,
  dateRange,
  onStartDateChange,
  onEndDateChange,
}) => (
  <div
    ref={dropdownRef}
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
    <div className="journalit-dashboard-date-range-start">
      <FastDateTimeInput
        label={t('dashboard.filter.date.from')}
        value={dateRange[0] || undefined}
        onChange={onStartDateChange}
        commitValidSegmentChangesImmediately
        className="journalit-date-picker-input"
      />
    </div>

    <div className="journalit-dashboard-date-range-end">
      <FastDateTimeInput
        label={t('dashboard.filter.date.to')}
        value={dateRange[1] || undefined}
        onChange={onEndDateChange}
        commitValidSegmentChangesImmediately
        className="journalit-date-picker-input"
        minDate={dateRange[0] || undefined}
      />
    </div>
  </div>
);

const getDateRangeForPresetValue = (
  preset: PresetType,
  weekStartDay: WeekStartDaySetting,
  referenceDate = new Date()
): [Date | null, Date | null] => {
  const today = referenceDate;

  switch (preset) {
    case 'today':
      return [
        createDateWithoutTime(today, true),
        createDateWithoutTime(today, false),
      ];
    case 'yesterday': {
      const yesterdayLocal = new Date(today);
      yesterdayLocal.setDate(today.getDate() - 1);
      return [
        createDateWithoutTime(yesterdayLocal, true),
        createDateWithoutTime(yesterdayLocal, false),
      ];
    }
    case 'thisWeek': {
      const firstDayOfWeek = getWeekStartDate(today, weekStartDay);
      return [
        createDateWithoutTime(firstDayOfWeek, true),
        createDateWithoutTime(today, false),
      ];
    }
    case 'thisMonth': {
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      return [
        createDateWithoutTime(firstDayOfMonth, true),
        createDateWithoutTime(today, false),
      ];
    }
    case 'thisQuarter': {
      const currentQuarter = getQuarter(today);
      const quarterStartMonth = (currentQuarter - 1) * 3;
      const firstDayOfQuarter = new Date(
        today.getFullYear(),
        quarterStartMonth,
        1
      );
      return [
        createDateWithoutTime(firstDayOfQuarter, true),
        createDateWithoutTime(today, false),
      ];
    }
    case 'thisYear': {
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
      return [
        createDateWithoutTime(firstDayOfYear, true),
        createDateWithoutTime(today, false),
      ];
    }
    case 'allTime':
    case 'custom':
    default:
      return [null, null];
  }
};

const areSameLocalDay = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const determinePresetFromDateValues = (
  startDate: Date | null,
  endDate: Date | null,
  weekStartDay: WeekStartDaySetting
): PresetType | null => {
  if (!startDate && !endDate) return 'allTime';

  const normalizedStartDate = startDate
    ? createDateWithoutTime(startDate)
    : null;
  const normalizedEndDate = endDate
    ? createDateWithoutTime(endDate, false)
    : null;
  const today = new Date();
  const normalizedToday = createDateWithoutTime(today);

  if (
    normalizedStartDate &&
    normalizedEndDate &&
    areSameLocalDay(normalizedStartDate, normalizedToday) &&
    areSameLocalDay(normalizedEndDate, normalizedToday)
  ) {
    return 'today';
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const normalizedYesterday = createDateWithoutTime(yesterday);
  const thisWeekStart = getWeekStartDate(today, weekStartDay);
  const normalizedWeekStart = createDateWithoutTime(thisWeekStart);

  if (
    normalizedStartDate &&
    normalizedEndDate &&
    areSameLocalDay(normalizedStartDate, normalizedYesterday) &&
    areSameLocalDay(normalizedEndDate, normalizedYesterday)
  ) {
    return 'yesterday';
  }

  if (
    normalizedStartDate &&
    areSameLocalDay(normalizedStartDate, normalizedWeekStart)
  ) {
    return 'thisWeek';
  }

  const normalizedMonthStart = createDateWithoutTime(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  if (
    normalizedStartDate &&
    areSameLocalDay(normalizedStartDate, normalizedMonthStart)
  ) {
    return 'thisMonth';
  }

  const currentQuarter = getQuarter(today);
  const thisQuarterStartMonth = (currentQuarter - 1) * 3;
  const normalizedQuarterStart = createDateWithoutTime(
    new Date(today.getFullYear(), thisQuarterStartMonth, 1)
  );
  if (
    normalizedStartDate &&
    areSameLocalDay(normalizedStartDate, normalizedQuarterStart)
  ) {
    return 'thisQuarter';
  }

  const normalizedYearStart = createDateWithoutTime(
    new Date(today.getFullYear(), 0, 1)
  );
  if (
    normalizedStartDate &&
    areSameLocalDay(normalizedStartDate, normalizedYearStart)
  ) {
    return 'thisYear';
  }

  return startDate || endDate ? 'custom' : null;
};

const doesDateRangeMatchPresetValue = (
  preset: PresetType,
  startDate: Date | null,
  endDate: Date | null,
  weekStartDay: WeekStartDaySetting
): boolean => {
  if (preset === 'custom') return false;

  const [presetStart, presetEnd] = getDateRangeForPresetValue(
    preset,
    weekStartDay
  );
  const normalizedStart = startDate
    ? createDateWithoutTime(startDate, true).getTime()
    : null;
  const normalizedEnd = endDate
    ? createDateWithoutTime(endDate, false).getTime()
    : null;
  const normalizedPresetStart = presetStart
    ? createDateWithoutTime(presetStart, true).getTime()
    : null;
  const normalizedPresetEnd = presetEnd
    ? createDateWithoutTime(presetEnd, false).getTime()
    : null;

  return (
    normalizedStart === normalizedPresetStart &&
    normalizedEnd === normalizedPresetEnd
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


export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onChange,
}) => {
  
  const [isCustomDropdownOpen, setIsCustomDropdownOpen] = useState(false);
  const [presetOverride, setPresetOverride] = useState<PresetType | null>(null);
  
  const dateRangeContainerRef = useRef<HTMLDivElement>(null);
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

  const getDateRangeForPreset = useCallback(
    (preset: PresetType, referenceDate = new Date()) =>
      getDateRangeForPresetValue(preset, weekStartDay, referenceDate),
    [weekStartDay]
  );

  const determinePresetFromDates = useCallback(
    (startDate: Date | null, endDate: Date | null): PresetType | null =>
      determinePresetFromDateValues(startDate, endDate, weekStartDay),
    [weekStartDay]
  );

  const doesDateRangeMatchPreset = useCallback(
    (
      preset: PresetType,
      startDate: Date | null,
      endDate: Date | null
    ): boolean =>
      doesDateRangeMatchPresetValue(preset, startDate, endDate, weekStartDay),
    [weekStartDay]
  );

  
  const activePreset = useMemo(() => {
    return determinePresetFromDates(dateRange[0], dateRange[1]);
  }, [dateRange, determinePresetFromDates]);

  const validPresetOverride =
    presetOverride &&
    doesDateRangeMatchPreset(presetOverride, dateRange[0], dateRange[1])
      ? presetOverride
      : null;
  const displayedPreset = validPresetOverride || activePreset;

  
  useEffect(() => {
    const ownerDocument = getOwnerDocument(customDateAnchorRef.current);
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      
      if (
        dateRangeContainerRef.current?.contains(target) ||
        customDateDropdownRef.current?.contains(target)
      ) {
        return;
      }

      
      
      if (target.instanceOf(Element) && target.closest('.flatpickr-calendar')) {
        return;
      }

      
      if (isCustomDropdownOpen) {
        setIsCustomDropdownOpen(false);
      }
    };

    
    if (isCustomDropdownOpen) {
      ownerDocument.addEventListener('mousedown', handleClickOutside);
    }

    
    return () => {
      ownerDocument.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCustomDropdownOpen]);

  const updateDropdownPosition = useCallback(() => {
    const anchor = customDateAnchorRef.current;
    if (!anchor) return;

    const ownerDocument = getOwnerDocument(anchor);
    const win = ownerDocument.defaultView;
    if (!win) return;

    const nextPosition = calculateDropdownPosition(
      anchor.getBoundingClientRect(),
      customDateDropdownRef.current?.getBoundingClientRect() ?? null,
      win
    );

    setDropdownPosition((previous) =>
      areDropdownPositionsEqual(previous, nextPosition)
        ? previous
        : nextPosition
    );
  }, []);

  
  
  
  useLayoutEffect(() => {
    if (!isCustomDropdownOpen) {
      setDropdownPosition(null);
      return undefined;
    }

    updateDropdownPosition();

    const anchor = customDateAnchorRef.current;
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
  }, [isCustomDropdownOpen, updateDropdownPosition]);

  
  const handleStartDateChange = useCallback(
    (date: Date | string | undefined) => {
      setPresetOverride(null);

      
      if (date && date instanceof Date) {
        
        const normalizedDate = createDateWithoutTime(date, true); 
        onChange([normalizedDate, dateRange[1]]);
      } else {
        onChange([null, dateRange[1]]);
      }

      
    },
    [dateRange, onChange]
  );

  
  const handleEndDateChange = useCallback(
    (date: Date | string | undefined) => {
      setPresetOverride(null);

      
      if (date && date instanceof Date) {
        
        const normalizedDate = createDateWithoutTime(date, false); 
        onChange([dateRange[0], normalizedDate]);
      } else {
        onChange([dateRange[0], null]);
      }

      
    },
    [dateRange, onChange]
  );

  
  const handlePresetClick = useCallback(
    (preset: PresetType) => {
      
      if (preset === 'custom') {
        setPresetOverride(null);

        
        if (activePreset === 'custom') {
          setIsCustomDropdownOpen(!isCustomDropdownOpen);
          return;
        } else {
          
          setIsCustomDropdownOpen(true);
          
          return;
        }
      }

      
      setIsCustomDropdownOpen(false);
      setPresetOverride(preset);

      const [startDate, endDate] = getDateRangeForPreset(preset);

      
      onChange([startDate, endDate]);
    },
    [
      activePreset,
      isCustomDropdownOpen,
      onChange,
      getDateRangeForPreset,
      setPresetOverride,
    ]
  );

  
  const presetButtons = useMemo(createPresetButtons, []);

  return (
    <>
      <div
        className="journalit-dashboard-date-range-filter"
        ref={dateRangeContainerRef}
      >
        <DatePresetButtons
          presetButtons={presetButtons}
          displayedPreset={displayedPreset}
          onPresetClick={handlePresetClick}
          customDateAnchorRef={customDateAnchorRef}
        />
      </div>
      {isCustomDropdownOpen
        ? createPortal(
            <CustomDateDropdown
              dropdownRef={customDateDropdownRef}
              dropdownPosition={dropdownPosition}
              dateRange={dateRange}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />,
            getOwnerDocument(customDateAnchorRef.current).body
          )
        : null}
    </>
  );
};
