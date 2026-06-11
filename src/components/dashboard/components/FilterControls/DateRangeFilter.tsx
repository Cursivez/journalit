

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { t } from '../../../../lang/helpers';
import { useEventBus } from '../../../../hooks';
import { FastDateTimeInput } from '../../../../components/core/FastDateTimeInput';
import {
  createDateWithoutTime,
  getQuarter,
  getWeekStartDate,
  getWeekStartDaySetting,
  type WeekStartDaySetting,
} from '../../../../utils/dateUtils';

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
  children: React.ReactNode;
}

interface CustomDateDropdownProps {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  shouldPositionLeft: boolean;
  shouldPositionBelow: boolean;
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
  children,
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
            className={displayedPreset === btn.id ? 'active' : ''}
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
            {children}
          </div>
        );
      })}
    </div>
  );
};

const CustomDateDropdown: React.FC<CustomDateDropdownProps> = ({
  dropdownRef,
  shouldPositionLeft,
  shouldPositionBelow,
  dateRange,
  onStartDateChange,
  onEndDateChange,
}) => (
  <div
    ref={dropdownRef}
    className={`journalit-dashboard-date-range-inputs journalit-dashboard-custom-date-dropdown date-dropdown-visible ${shouldPositionLeft ? 'position-left' : ''} ${shouldPositionBelow ? 'position-below' : ''}`}
  >
    <div className="journalit-dashboard-date-range-start">
      <label>{t('dashboard.filter.date.from')}</label>
      <FastDateTimeInput
        value={dateRange[0] || undefined}
        onChange={onStartDateChange}
        className="journalit-date-picker-input"
      />
    </div>

    <div className="journalit-dashboard-date-range-end">
      <label>{t('dashboard.filter.date.to')}</label>
      <FastDateTimeInput
        value={dateRange[1] || undefined}
        onChange={onEndDateChange}
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


export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onChange,
}) => {
  
  const [isCustomDropdownOpen, setIsCustomDropdownOpen] = useState(false);
  const [presetOverride, setPresetOverride] = useState<PresetType | null>(null);
  
  const dateRangeContainerRef = useRef<HTMLDivElement>(null);
  const customDateAnchorRef = useRef<HTMLDivElement>(null);
  const customDateDropdownRef = useRef<HTMLDivElement>(null);
  
  const [shouldPositionLeft, setShouldPositionLeft] = useState(false);
  
  const [shouldPositionBelow, setShouldPositionBelow] = useState(false);

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
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      
      if (dateRangeContainerRef.current?.contains(target)) {
        return;
      }

      
      
      const flatpickrCalendar = (target as Element).closest?.(
        '.flatpickr-calendar'
      );
      if (flatpickrCalendar) {
        return;
      }

      
      if (isCustomDropdownOpen) {
        setIsCustomDropdownOpen(false);
      }
    };

    
    if (isCustomDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCustomDropdownOpen]);

  
  useEffect(() => {
    if (isCustomDropdownOpen && customDateAnchorRef.current) {
      const containerRect = customDateAnchorRef.current.getBoundingClientRect();
      const dropdownWidth =
        customDateDropdownRef.current?.getBoundingClientRect().width ?? 260;
      const dropdownHeight = 160; 
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 20; 

      
      const wouldOverflowRight =
        containerRect.right + dropdownWidth > viewportWidth - padding;

      
      const wouldOverflowLeft = containerRect.left - dropdownWidth < padding;

      
      
      
      

      if (wouldOverflowRight && wouldOverflowLeft) {
        
        const fitsBelow =
          containerRect.bottom + dropdownHeight <= viewportHeight - padding;
        setShouldPositionBelow(fitsBelow);
        setShouldPositionLeft(false);
      } else if (wouldOverflowRight && !wouldOverflowLeft) {
        
        setShouldPositionBelow(false);
        setShouldPositionLeft(true);
      } else {
        
        setShouldPositionBelow(false);
        setShouldPositionLeft(false);
      }
    }
  }, [isCustomDropdownOpen]);

  
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
    <div
      className="journalit-dashboard-date-range-filter"
      ref={dateRangeContainerRef}
    >
      <DatePresetButtons
        presetButtons={presetButtons}
        displayedPreset={displayedPreset}
        onPresetClick={handlePresetClick}
        customDateAnchorRef={customDateAnchorRef}
      >
        {isCustomDropdownOpen && (
          <CustomDateDropdown
            dropdownRef={customDateDropdownRef}
            shouldPositionLeft={shouldPositionLeft}
            shouldPositionBelow={shouldPositionBelow}
            dateRange={dateRange}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        )}
      </DatePresetButtons>
    </div>
  );
};
