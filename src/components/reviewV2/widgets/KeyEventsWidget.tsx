

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { TFile } from 'obsidian';
import type JournalitPlugin from '../../../main';
import type { NewsEvent } from '../../../services/weekly/types';
import type { ReviewChangedPayload } from '../../../services/events/types';
import {
  Edit,
  Ghost,
  Info,
  Plus,
  Trash,
} from '../../shared/icons/ObsidianIcon';
import { Tooltip } from '../../shared/Tooltip';
import { ComboBox } from '../../core/ComboBox';
import { SkeletonBox } from '../../shared';
import { InvalidContextMessage } from './InvalidContextMessage';
import { OptionType } from '../../../services/options/CustomOptionsService';
import { useEventBus } from '../../../hooks/useEventBus';
import { parseLocalDateSafe } from '../../../utils/dateUtils';
import { t, type TranslationKey } from '../../../lang/helpers';


interface KeyEventsPreviewData {
  events: NewsEvent[];
  reviewMode?: 'weekly-review' | 'drc';
}

interface KeyEventsWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  
  preview?: boolean;
  
  previewData?: KeyEventsPreviewData;
}

type ReviewMode = 'weekly-review' | 'drc';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  isRecord(value) ? value : undefined;

const getReviewMode = (value: unknown): ReviewMode | null => {
  switch (value) {
    case 'weekly-review':
    case 'drc':
      return value;
    default:
      return null;
  }
};

const asNewsEvents = (value: unknown): NewsEvent[] =>
  Array.isArray(value)
    ? value.filter((item): item is NewsEvent => {
        const record = asRecord(item);
        return Boolean(record && typeof record.event === 'string');
      })
    : [];

const parseFrontmatterDate = (value: unknown): Date | null =>
  typeof value === 'string' ||
  typeof value === 'number' ||
  value instanceof Date
    ? parseLocalDateSafe(value)
    : null;

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const EVENT_COLORS = ['gray', 'red', 'orange', 'yellow'] as const;
type EventColor = (typeof EVENT_COLORS)[number];

const getEventColor = (value: unknown): EventColor => {
  switch (value) {
    case 'red':
    case 'orange':
    case 'yellow':
      return value;
    default:
      return 'gray';
  }
};

const MAX_FRONTMATTER_RETRIES = 3;
const FRONTMATTER_RETRY_DELAY_MS = 100;

const DAY_TO_KEY: Partial<Record<string, TranslationKey>> = {
  Monday: 'common.day.monday',
  Tuesday: 'common.day.tuesday',
  Wednesday: 'common.day.wednesday',
  Thursday: 'common.day.thursday',
  Friday: 'common.day.friday',
  Saturday: 'common.day.saturday',
  Sunday: 'common.day.sunday',
};

function getEventDayForDrc(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function getNewsEventKeyBase(event: NewsEvent): string {
  return [
    event.day ?? 'all-week',
    event.color ?? 'gray',
    event.event,
    event.notes,
  ].join('|');
}

export const KeyEventsWidget: React.FC<KeyEventsWidgetProps> = React.memo(
  ({ filePath, plugin, preview, previewData }) => {
    
    const [events, setEvents] = useState<NewsEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isValidContext, setIsValidContext] = useState(true);
    const [reviewMode, setReviewMode] = useState<ReviewMode | null>(null);
    const [drcDate, setDrcDate] = useState<Date | null>(null);
    const [isSavingEvent, setIsSavingEvent] = useState(false);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);

    
    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedColor, setSelectedColor] = useState<EventColor>('gray');
    const [selectedDay, setSelectedDay] = useState('');
    const [eventNotes, setEventNotes] = useState('');
    const [eventOptions, setEventOptions] = useState<string[]>([]);
    const [editingEventIndex, setEditingEventIndex] = useState<number | null>(
      null
    );
    const [editEventName, setEditEventName] = useState('');
    const [editEventColor, setEditEventColor] = useState<EventColor>('gray');
    const [editEventDay, setEditEventDay] = useState('');
    const [editEventNotes, setEditEventNotes] = useState('');

    const retryCountRef = useRef(0);
    const retryTimeoutRef = useRef<number | null>(null);

    
    useEffect(() => {}, []);

    
    useEffect(() => {
      return () => {
        if (retryTimeoutRef.current) {
          window.clearTimeout(retryTimeoutRef.current);
        }
      };
    }, []);

    
    const isWeeklyEditable = reviewMode === 'weekly-review' && !preview;
    const canAddFromDrc = reviewMode === 'drc' && !preview && drcDate !== null;
    const isDrcEditable = canAddFromDrc;
    const canAddEvent = isWeeklyEditable || canAddFromDrc;
    const shouldShowAddForm =
      canAddEvent && (events.length === 0 || isAddFormOpen);
    const shouldShowCompactAdd =
      canAddEvent && events.length > 0 && !isAddFormOpen;

    
    useEffect(() => {
      if (!plugin.optionsService) return;

      const options = plugin.optionsService.getOptions(OptionType.EVENT);
      setEventOptions(options);
    }, [plugin.optionsService]);

    
    useEventBus('options:changed', () => {
      if (plugin.optionsService) {
        const options = plugin.optionsService.getOptions(OptionType.EVENT);
        setEventOptions(options);
      }
    });

    
    const loadEvents = useCallback(async () => {
      
      if (preview && previewData) {
        setEvents(previewData.events);
        setReviewMode(previewData.reviewMode || 'drc');
        setLoading(false);
        setIsValidContext(true);
        return;
      }

      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      const cache = plugin.app.metadataCache.getFileCache(file);
      const frontmatter = asRecord(cache?.frontmatter);

      if (!frontmatter) {
        
        if (retryCountRef.current < MAX_FRONTMATTER_RETRIES) {
          retryCountRef.current++;
          retryTimeoutRef.current = window.setTimeout(
            () => void loadEvents(),
            FRONTMATTER_RETRY_DELAY_MS
          );
          return;
        }
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      const type = getReviewMode(frontmatter.type);
      if (!type) {
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      setReviewMode(type);

      if (type === 'weekly-review') {
        
        const keyEvents = asNewsEvents(frontmatter.keyEvents);
        setEvents(keyEvents);
        setIsValidContext(true);
        setLoading(false);
      } else if (type === 'drc') {
        
        
        const date = parseFrontmatterDate(frontmatter.date);

        if (!date) {
          setDrcDate(null);
          setEvents([]);
          setIsValidContext(false);
          setLoading(false);
          return;
        }

        setDrcDate(date);

        try {
          
          const drcService = plugin.serviceManager
            ? await plugin.serviceManager.getDRCService()
            : plugin.drcService;

          if (!drcService) {
            console.warn('[KeyEventsWidget] DRCService not available yet');
            setEvents([]);
            setIsValidContext(true);
            setLoading(false);
            return;
          }

          const weeklyEvents = await drcService.getWeeklyEventsForDate(date);
          setEvents(weeklyEvents);
        } catch (error) {
          console.error('[KeyEventsWidget] Error loading events:', error);
          setEvents([]);
        }
        setIsValidContext(true);
        setLoading(false);
      }
    }, [filePath, plugin, preview, previewData]);

    
    useEffect(() => {
      retryCountRef.current = 0;
      setLoading(true);
      void loadEvents();

      if (preview) {
        return;
      }

      const handleMetadataChange = (file: TFile) => {
        if (file.path === filePath) {
          void loadEvents();
        }
      };

      plugin.app.metadataCache.on('changed', handleMetadataChange);

      return () => {
        plugin.app.metadataCache.off('changed', handleMetadataChange);
      };
    }, [filePath, loadEvents, plugin.app.metadataCache, preview]);

    
    const handleReviewChanged = useCallback(
      (payload: ReviewChangedPayload) => {
        
        if (
          reviewMode === 'drc' &&
          payload.type === 'weekly' &&
          payload.action === 'updated'
        ) {
          
          void loadEvents();
        }
      },
      [reviewMode, loadEvents]
    );

    useEventBus('review:changed', handleReviewChanged, !preview);

    
    
    const sortedEvents = useMemo(() => {
      const seenEventKeys = new Map<string, number>();
      return events
        .map((event, originalIndex) => {
          const keyBase = getNewsEventKeyBase(event);
          const occurrence = (seenEventKeys.get(keyBase) ?? 0) + 1;
          seenEventKeys.set(keyBase, occurrence);
          return { event, originalIndex, key: `${keyBase}|${occurrence}` };
        })
        .sort((a, b) => {
          
          if (!a.event.day && b.event.day) return -1;
          if (a.event.day && !b.event.day) return 1;
          if (!a.event.day && !b.event.day) return 0;
          
          return (
            DAYS_OF_WEEK.indexOf(a.event.day!) -
            DAYS_OF_WEEK.indexOf(b.event.day!)
          );
        });
    }, [events]);

    
    const getWeeklyReviewService = async () => {
      return plugin.serviceManager
        ? await plugin.serviceManager.getWeeklyReviewService()
        : plugin.weeklyReviewService;
    };

    const updateFrontmatter = async (updatedEvents: NewsEvent[]) => {
      if (reviewMode !== 'weekly-review') return;

      try {
        
        
        const weeklyReviewService = await getWeeklyReviewService();
        await weeklyReviewService.updateWeeklyReviewFrontmatter(filePath, {
          keyEvents: updatedEvents,
        });
      } catch (error) {
        console.error('[KeyEventsWidget] Failed to update frontmatter:', error);
      }
    };

    const addDrcEventToWeeklyReview = async (
      newEvent: NewsEvent,
      date: Date
    ) => {
      const weeklyReviewService = await getWeeklyReviewService();
      await weeklyReviewService.appendKeyEventToWeeklyReview(date, newEvent);
    };

    const updateDrcEventInWeeklyReview = async (
      index: number,
      event: NewsEvent,
      date: Date
    ) => {
      const weeklyReviewService = await getWeeklyReviewService();
      await weeklyReviewService.updateKeyEventForDate(date, index, event);
    };

    const removeDrcEventFromWeeklyReview = async (
      index: number,
      date: Date
    ) => {
      const weeklyReviewService = await getWeeklyReviewService();
      await weeklyReviewService.removeKeyEventForDate(date, index);
    };

    
    const handleAddEvent = async () => {
      const eventName = selectedEvent.trim();
      if (!eventName || !canAddEvent || isSavingEvent) return;

      setIsSavingEvent(true);

      try {
        
        if (plugin.optionsService) {
          void plugin.optionsService.addOrUpdateEventOption(
            eventName,
            selectedColor
          );
        }

        const newEvent: NewsEvent = {
          event: eventName,
          notes: eventNotes,
          color: selectedColor,
          day: canAddFromDrc
            ? getEventDayForDrc(drcDate)
            : selectedDay || undefined,
        };

        if (canAddFromDrc) {
          await addDrcEventToWeeklyReview(newEvent, drcDate);
          setEvents((currentEvents) => [...currentEvents, newEvent]);
        } else {
          const updatedEvents = [...events, newEvent];
          setEvents(updatedEvents);
          await updateFrontmatter(updatedEvents);
        }

        const hadExistingEvents = events.length > 0;

        
        setSelectedEvent('');
        setEventNotes('');
        setSelectedColor('gray');
        setSelectedDay('');
        if (hadExistingEvents) {
          setIsAddFormOpen(false);
        }
      } catch (error) {
        console.error('[KeyEventsWidget] Failed to add event:', error);
      } finally {
        setIsSavingEvent(false);
      }
    };

    const handleCancelAddEvent = () => {
      setSelectedEvent('');
      setEventNotes('');
      setSelectedColor('gray');
      setSelectedDay('');
      setIsAddFormOpen(false);
    };

    const handleStartEditEvent = (event: NewsEvent, index: number) => {
      setEditingEventIndex(index);
      setEditEventName(event.event);
      setEditEventColor(getEventColor(event.color));
      setEditEventDay(event.day || '');
      setEditEventNotes(event.notes || '');
    };

    const handleCancelEditEvent = () => {
      setEditingEventIndex(null);
      setEditEventName('');
      setEditEventColor('gray');
      setEditEventDay('');
      setEditEventNotes('');
    };

    const handleSaveEditEvent = async () => {
      if (editingEventIndex === null || !editEventName.trim()) return;

      if (plugin.optionsService) {
        void plugin.optionsService.addOrUpdateEventOption(
          editEventName,
          editEventColor
        );
      }

      const updatedEvent: NewsEvent = {
        ...events[editingEventIndex],
        event: editEventName.trim(),
        notes: editEventNotes,
        color: editEventColor,
        day: isDrcEditable
          ? events[editingEventIndex].day
          : editEventDay || undefined,
      };

      const updatedEvents = events.map((event, index) =>
        index === editingEventIndex ? updatedEvent : event
      );

      setEvents(updatedEvents);
      if (isDrcEditable) {
        await updateDrcEventInWeeklyReview(
          editingEventIndex,
          updatedEvent,
          drcDate
        );
      } else {
        await updateFrontmatter(updatedEvents);
      }
      handleCancelEditEvent();
    };

    
    const handleRemoveEvent = async (index: number) => {
      if (!isWeeklyEditable && !isDrcEditable) return;

      const updatedEvents = events.filter((_, i) => i !== index);
      if (editingEventIndex === index) {
        handleCancelEditEvent();
      } else if (editingEventIndex !== null && index < editingEventIndex) {
        setEditingEventIndex((currentIndex) =>
          currentIndex === null ? null : currentIndex - 1
        );
      }
      setEvents(updatedEvents);
      if (isDrcEditable) {
        await removeDrcEventFromWeeklyReview(index, drcDate);
      } else {
        await updateFrontmatter(updatedEvents);
      }
    };

    
    const handleEventSelect = (value: string | string[]) => {
      const eventName = Array.isArray(value) ? value[0] : value;
      setSelectedEvent(eventName);

      
      if (plugin.optionsService && eventName) {
        const savedOption =
          plugin.optionsService.getEventOptionByName(eventName);
        if (savedOption?.color) {
          setSelectedColor(getEventColor(savedOption.color));
        }
        setEventNotes(savedOption?.notes || '');
      }
    };

    
    const handleSaveEventOption = (option: string) => {
      if (plugin.optionsService) {
        void plugin.optionsService.addOrUpdateEventOption(
          option,
          selectedColor
        );
      }
    };

    const handleSaveEditEventOption = (option: string) => {
      if (plugin.optionsService) {
        void plugin.optionsService.addOrUpdateEventOption(
          option,
          editEventColor
        );
      }
    };

    
    if (loading) {
      return (
        <div className="key-events-wrapper">
          <div className="key-events-widget key-events-widget--loading">
            
            <div className="key-events-header key-events-header--skeleton">
              <SkeletonBox width={100} height={14} borderRadius="4px" />
            </div>
            
            <div className="key-events-skeleton-list">
              {['first', 'second', 'third'].map((key) => (
                <div key={key} className="key-events-skeleton-item">
                  <div className="key-events-skeleton-item-header">
                    <SkeletonBox width={120} height={14} borderRadius="4px" />
                    <SkeletonBox width={50} height={12} borderRadius="4px" />
                  </div>
                  <SkeletonBox width="70%" height={10} borderRadius="4px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    
    if (!isValidContext) {
      return <InvalidContextMessage widgetType={t('widget.key-events.name')} />;
    }

    
    const renderEventCard = (event: NewsEvent, index: number, key: string) => {
      const colorClass = event.color
        ? `event-color-${event.color}`
        : 'event-color-gray';

      
      
      const showDayBadge = reviewMode === 'weekly-review' || !event.day;

      const dayKey = event.day ? DAY_TO_KEY[event.day] : undefined;
      const dayLabel = dayKey ? t(dayKey) : event.day || '';

      if (editingEventIndex === index) {
        return (
          <div
            key={key}
            className={`key-events-item ${colorClass} key-events-item--editing`}
          >
            <div className="key-events-edit-form">
              <ComboBox
                label=""
                options={eventOptions}
                value={editEventName}
                onChange={(value) => {
                  const eventName = Array.isArray(value) ? value[0] : value;
                  setEditEventName(eventName);

                  const savedOption =
                    plugin.optionsService?.getEventOptionByName(eventName);
                  if (savedOption?.color) {
                    setEditEventColor(getEventColor(savedOption.color));
                  }
                  setEditEventNotes(savedOption?.notes || '');
                }}
                placeholder={t('widget.key-events.placeholder')}
                allowCreate={true}
                isMulti={false}
                optionType="event"
                onSaveOption={handleSaveEditEventOption}
                error=""
                helperText=""
                required={false}
                portalDropdown={canAddFromDrc}
              />

              <div className="key-events-color-picker">
                <span className="key-events-color-label">
                  {t('widget.key-events.color-label')}
                </span>
                {EVENT_COLORS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    className={`key-events-color-option ${editEventColor === color ? 'selected' : ''}`}
                    onClick={() => setEditEventColor(color)}
                    aria-label={t('widget.key-events.color-aria', {
                      color: color.charAt(0).toUpperCase() + color.slice(1),
                    })}
                    aria-pressed={editEventColor === color}
                  >
                    <span
                      className={`key-events-color-dot key-events-color-dot--${color}`}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>

              {isWeeklyEditable && (
                <div className="key-events-day-selector">
                  <span className="key-events-day-label">
                    {t('widget.key-events.day-label')}
                  </span>
                  <select
                    value={editEventDay}
                    onChange={(e) => setEditEventDay(e.target.value)}
                    className="key-events-day-select"
                  >
                    <option value="">{t('common.day.all-week')}</option>
                    {DAYS_OF_WEEK.map((day) => {
                      const dayKey = DAY_TO_KEY[day];
                      const label = dayKey ? t(dayKey) : day;

                      return (
                        <option key={day} value={day}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <textarea
                value={editEventNotes}
                onChange={(e) => setEditEventNotes(e.target.value)}
                placeholder={t('widget.key-events.notes-placeholder')}
                className="key-events-notes-input"
              />

              <div className="key-events-edit-actions">
                <button
                  className="key-events-secondary-button"
                  onClick={() => void handleCancelEditEvent()}
                >
                  {t('button.cancel')}
                </button>
                <button
                  className="key-events-save-button"
                  onClick={() => void handleSaveEditEvent()}
                  disabled={!editEventName.trim()}
                >
                  {t('button.save')}
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div key={key} className={`key-events-item ${colorClass}`}>
          <div className="key-events-item-header">
            <div className="key-events-item-title">
              <h4>{event.event}</h4>
              {showDayBadge &&
                (event.day ? (
                  <span className="key-events-day-badge">{dayLabel}</span>
                ) : (
                  <span className="key-events-day-badge key-events-all-week">
                    {t('common.day.all-week')}
                  </span>
                ))}
            </div>
            {(isWeeklyEditable || isDrcEditable) && (
              <div className="key-events-item-actions">
                <button
                  className="key-events-action-button"
                  onClick={() => void handleStartEditEvent(event, index)}
                  aria-label={t('button.edit')}
                >
                  <Edit size={14} aria-hidden="true" />
                </button>
                <button
                  className="key-events-remove-button"
                  onClick={() => void handleRemoveEvent(index)}
                  aria-label={t('button.remove')}
                >
                  <Trash size={14} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
          {event.notes && (
            <span className="key-events-item-notes">{event.notes}</span>
          )}
        </div>
      );
    };

    return (
      <div className="key-events-wrapper">
        <div className="key-events-widget">
          
          <div className="key-events-header">
            <span className="key-events-title">
              {t('widget.key-events.title')}{' '}
              {events.length > 0 && `(${events.length})`}
            </span>
            {reviewMode === 'drc' && (
              <Tooltip
                content={
                  <div className="key-events-tooltip-content">
                    {t('widget.key-events.tooltip')}
                  </div>
                }
                preferredPosition="top"
              >
                <Info
                  className="key-events-tooltip-icon"
                  size={13}
                  aria-hidden="true"
                />
              </Tooltip>
            )}
            {shouldShowCompactAdd && (
              <button
                className="key-events-header-add-button"
                onClick={() => setIsAddFormOpen(true)}
              >
                <Plus size={12} aria-hidden="true" />
                {t('widget.key-events.add-button')}
              </button>
            )}
          </div>

          
          {shouldShowAddForm && (
            <div
              className={`key-events-form ${canAddFromDrc ? 'key-events-form--drc' : ''}`}
            >
              <div className="key-events-form-row">
                <div className="key-events-event-selector">
                  <ComboBox
                    label=""
                    options={eventOptions}
                    value={selectedEvent}
                    onChange={handleEventSelect}
                    placeholder={t('widget.key-events.placeholder')}
                    allowCreate={true}
                    isMulti={false}
                    optionType="event"
                    onSaveOption={handleSaveEventOption}
                    error=""
                    helperText=""
                    required={false}
                    portalDropdown={canAddFromDrc}
                  />
                </div>
              </div>

              
              <div className="key-events-color-picker">
                <span className="key-events-color-label">
                  {t('widget.key-events.color-label')}
                </span>
                {EVENT_COLORS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    className={`key-events-color-option ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    aria-label={t('widget.key-events.color-aria', {
                      color: color.charAt(0).toUpperCase() + color.slice(1),
                    })}
                    aria-pressed={selectedColor === color}
                  >
                    <span
                      className={`key-events-color-dot key-events-color-dot--${color}`}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>

              {isWeeklyEditable && (
                <div className="key-events-day-selector">
                  <span className="key-events-day-label">
                    {t('widget.key-events.day-label')}
                  </span>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="key-events-day-select"
                  >
                    <option value="">{t('common.day.all-week')}</option>
                    {DAYS_OF_WEEK.map((day) => {
                      const dayKey = DAY_TO_KEY[day];
                      const label = dayKey ? t(dayKey) : day;

                      return (
                        <option key={day} value={day}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              
              <div className="key-events-notes-header">
                <span className="key-events-notes-label">
                  {t('widget.key-events.notes-label')}
                </span>
                <Tooltip
                  content={
                    <div className="key-events-tooltip-content">
                      {t('widget.key-events.default-notes-tooltip')}
                    </div>
                  }
                  preferredPosition="top"
                >
                  <Info
                    className="key-events-tooltip-icon"
                    size={13}
                    aria-hidden="true"
                  />
                </Tooltip>
              </div>
              <textarea
                value={eventNotes}
                onChange={(e) => setEventNotes(e.target.value)}
                placeholder={t('widget.key-events.notes-placeholder')}
                className="key-events-notes-input"
              />

              
              <div className="key-events-form-actions">
                {events.length > 0 && (
                  <button
                    className="key-events-secondary-button"
                    onClick={() => void handleCancelAddEvent()}
                  >
                    {t('button.cancel')}
                  </button>
                )}
                <button
                  className="key-events-add-button"
                  onClick={() => void handleAddEvent()}
                  disabled={!selectedEvent.trim() || isSavingEvent}
                >
                  {t('widget.key-events.add-button')}
                </button>
              </div>
            </div>
          )}

          
          {events.length > 0 ? (
            <div className="key-events-list">
              {sortedEvents.map(({ event, originalIndex, key }) =>
                renderEventCard(event, originalIndex, key)
              )}
            </div>
          ) : reviewMode === 'drc' && !canAddFromDrc ? (
            
            <div className="key-events-empty">
              <Ghost size={32} className="key-events-empty-icon" />
              <div className="key-events-empty-title">
                {t('widget.key-events.empty-state')}
              </div>
              <div className="key-events-empty-subtitle">
                {t('widget.key-events.empty-state-sub')}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);

KeyEventsWidget.displayName = 'KeyEventsWidget';

export {};
