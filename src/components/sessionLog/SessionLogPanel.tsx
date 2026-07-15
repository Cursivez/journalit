import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import { FastDateTimeInput } from '../core/FastDateTimeInput';
import type { Trade } from '../dashboard/utils/dataUtils';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import {
  AlertTriangle,
  ChevronDown,
  Check,
  Clock,
  Edit,
  ExternalLink,
  Funnel,
  Lightbulb,
  Send,
  Tag,
  Trash2,
  X,
} from '../shared/icons/ObsidianIcon';
import type { ResolvedSessionModeWindow } from '../../types/sessionMode';
import type {
  SessionLogTagDefinition,
  SessionLogTimelineEntry,
} from '../../types/sessionLog';
import {
  addSessionLogEntry,
  calculateSessionLogAlert,
  deleteSessionLogEntry,
  getSessionLogAlertRule,
  getSessionLogTags,
  sortSessionTimeline,
  updateSessionLogEntry,
} from './sessionLogUtils';
import { t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';
import { eventBus } from '../../services/events';

interface SessionLogPanelProps {
  plugin: JournalitPlugin;
  filePath: string;
  timelineEntries: SessionLogTimelineEntry[];
  trades?: Trade[];
  compact?: boolean;
  showFilters?: boolean;
  newestFirst?: boolean;
  composerInitiallyVisible?: boolean;
  showComposerToggle?: boolean;
  timestampSessionWindow?: ResolvedSessionModeWindow;
  onRefresh?: () => void;
}

const formatTime = (date: Date, use24HourTime: boolean): string => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  if (use24HourTime) return `${String(hours).padStart(2, '0')}:${minutes}`;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes}\u202f${period}`;
};

const inferTimestampForSessionTime = (
  timeValue: string,
  fallbackDate: Date,
  sessionWindow?: ResolvedSessionModeWindow
): Date | null => {
  const match = /^(\d{2}):(\d{2})$/.exec(timeValue);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  const base = sessionWindow ? sessionWindow.start : fallbackDate;
  const timestamp = new Date(base);
  timestamp.setHours(hours, minutes, 0, 0);

  const isOvernightSession =
    sessionWindow &&
    sessionWindow.end.toDateString() !== sessionWindow.start.toDateString();
  if (
    isOvernightSession &&
    timestamp.getTime() < sessionWindow.start.getTime()
  ) {
    const postMidnightTimestamp = new Date(timestamp);
    postMidnightTimestamp.setDate(postMidnightTimestamp.getDate() + 1);
    if (postMidnightTimestamp.getTime() <= sessionWindow.end.getTime()) {
      return postMidnightTimestamp;
    }
  }

  return timestamp;
};

const getDefaultEntryTimestamp = (
  sessionWindow?: ResolvedSessionModeWindow
): Date => {
  const now = new Date();
  if (!sessionWindow) return now;

  const nowMs = now.getTime();
  if (
    nowMs >= sessionWindow.start.getTime() &&
    nowMs < sessionWindow.end.getTime()
  ) {
    return now;
  }

  return new Date(sessionWindow.start);
};

const tagClassName = (tag: SessionLogTagDefinition): string =>
  `journalit-session-log-tag journalit-session-log-tag--${tag.color}`;

interface TagSelectionState {
  selectedTagId: string;
  filterTagId: string;
  editTagId: string;
}

const resolveTagStateAction = (
  action: React.SetStateAction<string>,
  current: string
): string => (typeof action === 'function' ? action(current) : action);

const entryToneClassName = (
  entry: SessionLogTimelineEntry,
  tag?: SessionLogTagDefinition
): string => {
  if (entry.kind === 'trade') {
    return entry.eventType === 'entry'
      ? 'journalit-session-log-entry--green'
      : 'journalit-session-log-entry--red';
  }

  return tag
    ? `journalit-session-log-entry--tag-${tag.color}`
    : `journalit-session-log-entry--${entry.tagId}`;
};

export const SessionLogPanel: React.FC<SessionLogPanelProps> = React.memo(
  ({
    plugin,
    filePath,
    timelineEntries,
    compact = false,
    showFilters = true,
    newestFirst = false,
    composerInitiallyVisible = true,
    showComposerToggle = false,
    timestampSessionWindow,
    onRefresh,
  }) => {
    const [, setSettingsVersion] = useState(0);
    const tags = getSessionLogTags(plugin);
    const tagById = useMemo(
      () => new Map(tags.map((tag) => [tag.id, tag])),
      [tags]
    );
    const defaultTagId = tags[0]?.id ?? 'analysis';
    const [tagSelectionState, setTagSelectionState] =
      useState<TagSelectionState>(() => ({
        selectedTagId: defaultTagId,
        filterTagId: 'all',
        editTagId: defaultTagId,
      }));
    const { selectedTagId, filterTagId, editTagId } = tagSelectionState;
    const setSelectedTagId = (next: React.SetStateAction<string>) => {
      setTagSelectionState((current) => ({
        ...current,
        selectedTagId: resolveTagStateAction(next, current.selectedTagId),
      }));
    };
    const setFilterTagId = (next: React.SetStateAction<string>) => {
      setTagSelectionState((current) => ({
        ...current,
        filterTagId: resolveTagStateAction(next, current.filterTagId),
      }));
    };
    const setEditTagId = (next: React.SetStateAction<string>) => {
      setTagSelectionState((current) => ({
        ...current,
        editTagId: resolveTagStateAction(next, current.editTagId),
      }));
    };
    const [menuOpenState, setMenuOpenState] = useState({
      tag: false,
      filter: false,
      editTag: false,
    });
    const isTagMenuOpen = menuOpenState.tag;
    const isFilterMenuOpen = menuOpenState.filter;
    const isEditTagMenuOpen = menuOpenState.editTag;
    const setIsTagMenuOpen = (
      next: boolean | ((value: boolean) => boolean)
    ) => {
      setMenuOpenState((current) => ({
        ...current,
        tag: typeof next === 'function' ? next(current.tag) : next,
      }));
    };
    const setIsFilterMenuOpen = (
      next: boolean | ((value: boolean) => boolean)
    ) => {
      setMenuOpenState((current) => ({
        ...current,
        filter: typeof next === 'function' ? next(current.filter) : next,
      }));
    };
    const setIsEditTagMenuOpen = (
      next: boolean | ((value: boolean) => boolean)
    ) => {
      setMenuOpenState((current) => ({
        ...current,
        editTag: typeof next === 'function' ? next(current.editTag) : next,
      }));
    };
    const tagMenuRef = useRef<HTMLDivElement>(null);
    const tagButtonRef = useRef<HTMLButtonElement>(null);
    const tagMenuPortalRef = useRef<HTMLDivElement>(null);
    const editTagMenuRef = useRef<HTMLDivElement>(null);
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const filterButtonRef = useRef<HTMLButtonElement>(null);
    const filterMenuPortalRef = useRef<HTMLDivElement>(null);

    const timestampButtonRef = useRef<HTMLButtonElement>(null);
    const [filterMenuPosition, setFilterMenuPosition] = useState({
      left: 0,
      top: 0,
    });
    const [tagMenuPosition, setTagMenuPosition] = useState({
      left: 0,
      top: 0,
    });
    const [text, setText] = useState('');
    const [isSubmittingEntry, setIsSubmittingEntry] = useState(false);
    const isSubmittingEntryRef = useRef(false);
    const [isComposerVisible, setIsComposerVisible] = useState(
      composerInitiallyVisible
    );
    const [manualTimestampEnabled, setManualTimestampEnabled] = useState(false);
    const [manualTimestampPickerSignal, setManualTimestampPickerSignal] =
      useState(0);
    const [manualTimestamp, setManualTimestamp] = useState(() => new Date());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
      const unsubscribe = eventBus.subscribe('settings:changed', (payload) => {
        if (payload.section === 'drc' || payload.section === 'sessionMode') {
          setSettingsVersion((version) => version + 1);
        }
      });
      return unsubscribe;
    }, []);

    useEffect(() => {
      if (tags.length === 0) return;
      setTagSelectionState((current) => ({
        selectedTagId: tagById.has(current.selectedTagId)
          ? current.selectedTagId
          : defaultTagId,
        filterTagId:
          current.filterTagId === 'all' || tagById.has(current.filterTagId)
            ? current.filterTagId
            : 'all',
        editTagId: tagById.has(current.editTagId)
          ? current.editTagId
          : defaultTagId,
      }));
    }, [defaultTagId, tagById, tags.length]);

    const { formatValue } = useDisplayFormatter();
    const selectedTag = tagById.get(selectedTagId) ?? tags[0];
    const use24HourTime = plugin.settings.trade.use24HourTime ?? false;
    const activeFilterTag =
      filterTagId === 'all' ? null : tagById.get(filterTagId);
    const filterLabel = activeFilterTag?.label ?? t('session-log.filter.all');

    const hideComposer = useCallback(() => {
      setManualTimestampEnabled(false);
      setIsTagMenuOpen(false);
      setIsComposerVisible(false);
    }, []);

    const updateFilterMenuPosition = useCallback(() => {
      const trigger = filterButtonRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const viewportWidth = window.activeDocument.defaultView?.innerWidth ?? 0;
      const menuWidth = 220;
      const margin = 8;
      setFilterMenuPosition({
        left: Math.max(
          margin,
          Math.min(rect.right - menuWidth, viewportWidth - menuWidth - margin)
        ),
        top: rect.bottom + 6,
      });
    }, []);

    const toggleFilterMenu = useCallback(() => {
      setIsFilterMenuOpen((value) => {
        if (!value) updateFilterMenuPosition();
        return !value;
      });
    }, [updateFilterMenuPosition]);

    const updateTagMenuPosition = useCallback(() => {
      const trigger = tagButtonRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const activeWindow = trigger.ownerDocument.defaultView;
      const viewportWidth = activeWindow?.innerWidth ?? 0;
      const viewportHeight = activeWindow?.innerHeight ?? 0;
      const menuWidth = tagMenuPortalRef.current?.offsetWidth ?? 220;
      const menuHeight =
        tagMenuPortalRef.current?.offsetHeight ??
        Math.min(tags.length * 30 + 2, 300, viewportHeight / 2);
      const margin = 8;
      const gap = 6;
      const belowTop = rect.bottom + gap;
      const top =
        belowTop + menuHeight <= viewportHeight - margin
          ? belowTop
          : Math.max(margin, rect.top - gap - menuHeight);

      setTagMenuPosition({
        left: Math.max(
          margin,
          Math.min(rect.left, viewportWidth - menuWidth - margin)
        ),
        top,
      });
    }, [tags.length]);

    const toggleTagMenu = useCallback(() => {
      if (!isTagMenuOpen) updateTagMenuPosition();
      setIsTagMenuOpen(!isTagMenuOpen);
    }, [isTagMenuOpen, updateTagMenuPosition]);

    useEffect(() => {
      const ownerDocument =
        tagMenuRef.current?.ownerDocument ?? window.activeDocument;
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target;
        const ActiveDocumentNode = ownerDocument.defaultView?.Node;
        if (!ActiveDocumentNode || !(target instanceof ActiveDocumentNode)) {
          setMenuOpenState((current) => ({
            ...current,
            tag: false,
            filter: false,
          }));
          return;
        }

        setMenuOpenState((current) => ({
          tag:
            tagMenuRef.current &&
            !tagMenuRef.current.contains(target) &&
            (!tagMenuPortalRef.current ||
              !tagMenuPortalRef.current.contains(target))
              ? false
              : current.tag,
          editTag:
            editTagMenuRef.current && !editTagMenuRef.current.contains(target)
              ? false
              : current.editTag,
          filter:
            filterMenuRef.current &&
            !filterMenuRef.current.contains(target) &&
            (!filterMenuPortalRef.current ||
              !filterMenuPortalRef.current.contains(target))
              ? false
              : current.filter,
        }));
      };

      ownerDocument.addEventListener('mousedown', handleClickOutside);
      return () => {
        ownerDocument.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    useLayoutEffect(() => {
      if (!isTagMenuOpen) return undefined;
      updateTagMenuPosition();
      const activeWindow = tagButtonRef.current?.ownerDocument.defaultView;
      const handleReposition = () => updateTagMenuPosition();
      activeWindow?.addEventListener('resize', handleReposition);
      activeWindow?.addEventListener('scroll', handleReposition, true);
      return () => {
        activeWindow?.removeEventListener('resize', handleReposition);
        activeWindow?.removeEventListener('scroll', handleReposition, true);
      };
    }, [isTagMenuOpen, updateTagMenuPosition]);

    useEffect(() => {
      if (!isFilterMenuOpen) return undefined;
      updateFilterMenuPosition();
      const activeWindow = window.activeDocument.defaultView;
      const handleReposition = () => updateFilterMenuPosition();
      activeWindow?.addEventListener('resize', handleReposition);
      activeWindow?.addEventListener('scroll', handleReposition, true);
      return () => {
        activeWindow?.removeEventListener('resize', handleReposition);
        activeWindow?.removeEventListener('scroll', handleReposition, true);
      };
    }, [isFilterMenuOpen, updateFilterMenuPosition]);

    const sortedEntries = useMemo(() => {
      const entries = sortSessionTimeline(timelineEntries);
      return newestFirst ? entries.reverse() : entries;
    }, [newestFirst, timelineEntries]);
    const displayedEntries = useMemo(
      () =>
        showFilters && filterTagId !== 'all'
          ? sortedEntries.filter(
              (entry) => entry.kind === 'manual' && entry.tagId === filterTagId
            )
          : sortedEntries,
      [filterTagId, showFilters, sortedEntries]
    );
    const isFilteredEmpty =
      showFilters &&
      filterTagId !== 'all' &&
      sortedEntries.length > 0 &&
      displayedEntries.length === 0;
    const alertMessage = useMemo(() => {
      const rule = getSessionLogAlertRule(plugin);
      return calculateSessionLogAlert(
        sortedEntries,
        rule,
        tagById.get(rule.tagId)
      );
    }, [plugin, sortedEntries, tagById]);

    const submitEntry = useCallback(async () => {
      if (isSubmittingEntryRef.current) return;
      const trimmed = text.trim();
      if (!trimmed) return;
      const timestamp = manualTimestampEnabled
        ? manualTimestamp
        : getDefaultEntryTimestamp(timestampSessionWindow);
      if (Number.isNaN(timestamp.getTime())) {
        new Notice(t('session-log.notice.invalid-timestamp'));
        return;
      }
      isSubmittingEntryRef.current = true;
      setIsSubmittingEntry(true);
      try {
        await addSessionLogEntry({
          plugin,
          filePath,
          tagId: selectedTagId,
          text: trimmed,
          timestamp,
        });
        setText('');
        setManualTimestampEnabled(false);
        setManualTimestamp(getDefaultEntryTimestamp(timestampSessionWindow));
        if (showComposerToggle) setIsComposerVisible(false);
        onRefresh?.();
      } finally {
        isSubmittingEntryRef.current = false;
        setIsSubmittingEntry(false);
      }
    }, [
      filePath,
      manualTimestamp,
      manualTimestampEnabled,
      onRefresh,
      plugin,
      selectedTagId,
      showComposerToggle,
      timestampSessionWindow,
      text,
    ]);

    const beginEdit = useCallback((entry: SessionLogTimelineEntry) => {
      if (entry.kind !== 'manual') return;
      setEditingId(entry.id);
      setEditText(entry.text);
      setEditTagId(entry.tagId);
      setIsEditTagMenuOpen(false);
    }, []);

    const beginClassify = useCallback((entry: SessionLogTimelineEntry) => {
      if (entry.kind !== 'manual') return;
      setEditingId(entry.id);
      setEditText(entry.text);
      setEditTagId(entry.tagId);
      setIsEditTagMenuOpen(true);
    }, []);

    const saveEdit = useCallback(async () => {
      if (!editingId) return;
      const trimmed = editText.trim();
      if (!trimmed) return;
      await updateSessionLogEntry({
        plugin,
        filePath,
        entryId: editingId,
        updates: {
          text: trimmed,
          tagId: editTagId,
          resolved: tagById.get(editTagId)?.requiresResolution ? false : true,
        },
      });
      setEditingId(null);
      setIsEditTagMenuOpen(false);
      onRefresh?.();
    }, [editTagId, editText, editingId, filePath, onRefresh, plugin, tagById]);

    const openTrade = useCallback(
      async (path: string) => {
        await plugin.openFile(path, false, true, 'sidebar');
      },
      [plugin]
    );

    const submitEntryFromKeyboard = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        if (event.nativeEvent.isComposing) return;
        event.preventDefault();
        void submitEntry();
      },
      [submitEntry]
    );

    const filterControl = showFilters ? (
      <div className="journalit-session-log-filter" ref={filterMenuRef}>
        <button
          ref={filterButtonRef}
          type="button"
          className="journalit-header-icon-button journalit-session-log-filter-trigger"
          onClick={toggleFilterMenu}
          aria-label={t('session-log.filter.label')}
          aria-expanded={isFilterMenuOpen}
        >
          <Funnel size={16} aria-hidden="true" />
          {filterTagId !== 'all' && (
            <span
              className="journalit-header-filter-badge journalit-session-log-filter-badge"
              aria-label={filterLabel}
            >
              1
            </span>
          )}
        </button>
        {isFilterMenuOpen &&
          createPortal(
            <div
              ref={filterMenuPortalRef}
              className="journalit-session-log-composer-tag-menu journalit-session-log-filter-menu journalit-session-log-filter-menu--portal"
              style={cssVars({
                '--journalit-session-log-filter-menu-left': `${filterMenuPosition.left}px`,
                '--journalit-session-log-filter-menu-top': `${filterMenuPosition.top}px`,
              })}
            >
              <button
                type="button"
                className={
                  filterTagId === 'all'
                    ? 'journalit-session-log-composer-tag-option is-active'
                    : 'journalit-session-log-composer-tag-option'
                }
                onClick={() => {
                  setFilterTagId('all');
                  setIsFilterMenuOpen(false);
                }}
                aria-pressed={filterTagId === 'all'}
              >
                <span
                  className={
                    filterTagId === 'all'
                      ? 'journalit-session-log-composer-tag-checkbox is-checked'
                      : 'journalit-session-log-composer-tag-checkbox'
                  }
                  aria-hidden="true"
                >
                  {filterTagId === 'all' ? '✓' : ''}
                </span>
                <span className="journalit-session-log-composer-tag-option-label">
                  {t('session-log.filter.all')}
                </span>
              </button>
              {tags.map((tag) => (
                <button
                  type="button"
                  key={tag.id}
                  className={
                    filterTagId === tag.id
                      ? 'journalit-session-log-composer-tag-option is-active'
                      : 'journalit-session-log-composer-tag-option'
                  }
                  onClick={() => {
                    setFilterTagId(tag.id);
                    setIsFilterMenuOpen(false);
                  }}
                  aria-pressed={filterTagId === tag.id}
                >
                  <span
                    className={
                      filterTagId === tag.id
                        ? 'journalit-session-log-composer-tag-checkbox is-checked'
                        : 'journalit-session-log-composer-tag-checkbox'
                    }
                    aria-hidden="true"
                  >
                    {filterTagId === tag.id ? '✓' : ''}
                  </span>
                  <span className="journalit-session-log-composer-tag-option-label">
                    {tag.lessonTag && <Lightbulb size={13} />}
                    {tag.label}
                  </span>
                </button>
              ))}
            </div>,
            window.activeDocument.body
          )}
      </div>
    ) : undefined;

    return (
      <div className="journalit-session-log-panel">
        {!compact && (
          <div className="journalit-session-log-panel__header">
            <div>
              <h3>{t('session-log.title')}</h3>
              <p>{t('session-log.description')}</p>
            </div>
          </div>
        )}

        {alertMessage && (
          <div className="journalit-session-log-alert">
            <AlertTriangle size={16} />
            <span>{alertMessage}</span>
          </div>
        )}

        {isComposerVisible && (
          <div className="journalit-session-log-composer">
            <div className="journalit-session-log-composer-bar">
              <div
                className="journalit-session-log-composer-tag-control"
                ref={tagMenuRef}
              >
                <button
                  ref={tagButtonRef}
                  type="button"
                  className="journalit-session-log-composer-tag-trigger"
                  onClick={toggleTagMenu}
                  aria-label={t('session-log.composer.tag-label')}
                  aria-expanded={isTagMenuOpen}
                >
                  <Tag size={15} />
                  <span>{selectedTag?.shortLabel ?? 'AN'}</span>
                  <ChevronDown
                    size={12}
                    className={
                      isTagMenuOpen
                        ? 'journalit-session-log-composer-tag-chevron is-open'
                        : 'journalit-session-log-composer-tag-chevron'
                    }
                  />
                </button>
                {isTagMenuOpen &&
                  createPortal(
                    <div
                      ref={tagMenuPortalRef}
                      className="journalit-session-log-composer-tag-menu journalit-session-log-composer-tag-menu--portal"
                      style={cssVars({
                        '--journalit-session-log-tag-menu-left': `${tagMenuPosition.left}px`,
                        '--journalit-session-log-tag-menu-top': `${tagMenuPosition.top}px`,
                      })}
                    >
                      {tags.map((tag) => (
                        <button
                          type="button"
                          key={tag.id}
                          className={
                            tag.id === selectedTagId
                              ? 'journalit-session-log-composer-tag-option is-active'
                              : 'journalit-session-log-composer-tag-option'
                          }
                          onClick={() => {
                            setSelectedTagId(tag.id);
                            setIsTagMenuOpen(false);
                          }}
                          aria-pressed={tag.id === selectedTagId}
                        >
                          <span
                            className={
                              tag.id === selectedTagId
                                ? 'journalit-session-log-composer-tag-checkbox is-checked'
                                : 'journalit-session-log-composer-tag-checkbox'
                            }
                            aria-hidden="true"
                          >
                            {tag.id === selectedTagId ? '✓' : ''}
                          </span>
                          <span className="journalit-session-log-composer-tag-option-label">
                            {tag.label}
                          </span>
                        </button>
                      ))}
                    </div>,
                    tagButtonRef.current?.ownerDocument.body ??
                      window.activeDocument.body
                  )}
              </div>
              <input
                type="text"
                value={text}
                placeholder={t('session-log.placeholder.entry-short')}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={submitEntryFromKeyboard}
              />
              <button
                ref={timestampButtonRef}
                type="button"
                className={
                  manualTimestampEnabled
                    ? 'journalit-session-log-icon-button is-active'
                    : 'journalit-session-log-icon-button'
                }
                onClick={() => {
                  setManualTimestampEnabled((value) => {
                    if (!value) {
                      setManualTimestamp(
                        getDefaultEntryTimestamp(timestampSessionWindow)
                      );
                      setManualTimestampPickerSignal((signal) => signal + 1);
                    }
                    return !value;
                  });
                }}
                aria-label={
                  manualTimestampEnabled
                    ? t('session-log.action.auto-time')
                    : t('session-log.action.set-time')
                }
              >
                <Clock size={16} />
              </button>
              <button
                type="button"
                className="journalit-session-log-icon-button journalit-session-log-send-button"
                onClick={() => void submitEntry()}
                disabled={!text.trim() || isSubmittingEntry}
                aria-label={t('session-log.action.add-entry')}
              >
                <Send size={16} />
              </button>
              {showComposerToggle && (
                <button
                  type="button"
                  className="journalit-session-log-icon-button"
                  onClick={hideComposer}
                  aria-label={t('session-log.action.hide-composer')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {manualTimestampEnabled && (
              <FastDateTimeInput
                className="journalit-session-log-timestamp-input"
                value={manualTimestamp}
                includeTime={!compact}
                timeOnly={compact}
                hidePickerButton={compact}
                openPickerSignal={manualTimestampPickerSignal}
                pickerPositionElement={timestampButtonRef.current}
                controllerOnly={compact}
                closePickerOnQuickAction={!compact}
                onChange={(value) => {
                  if (value instanceof Date) {
                    setManualTimestamp(value);
                    return;
                  }
                  if (typeof value === 'string') {
                    const timestamp = inferTimestampForSessionTime(
                      value,
                      manualTimestamp,
                      timestampSessionWindow
                    );
                    if (timestamp) setManualTimestamp(timestamp);
                  }
                }}
              />
            )}
          </div>
        )}

        <div className="journalit-session-log-timeline">
          {displayedEntries.length === 0 ? (
            <>
              {isFilteredEmpty && (
                <TimelineSeparator
                  label={
                    newestFirst
                      ? t('session-log.timeline.most-recent')
                      : t('session-log.timeline.start')
                  }
                  action={filterControl}
                />
              )}
              <div
                className={
                  isFilteredEmpty || (showComposerToggle && !isComposerVisible)
                    ? 'journalit-session-log-empty'
                    : 'journalit-session-log-empty journalit-session-log-empty--centered'
                }
              >
                <span>
                  {isFilteredEmpty
                    ? t('session-log.empty-filtered')
                    : t('session-log.empty')}
                </span>
                <div className="journalit-session-log-empty__actions">
                  {isFilteredEmpty && (
                    <button
                      type="button"
                      className="journalit-button journalit-button--plain journalit-button--small take-profit-add-button journalit-session-log-clear-filter-button"
                      onClick={() => setFilterTagId('all')}
                    >
                      {t('session-log.filter.clear')}
                    </button>
                  )}
                  {showComposerToggle && !isComposerVisible && (
                    <button
                      type="button"
                      className="journalit-button journalit-button--plain journalit-button--small take-profit-add-button journalit-session-log-add-button"
                      onClick={() => setIsComposerVisible(true)}
                      aria-label={t('session-log.action.add-entry')}
                    >
                      + {t('session-log.action.add-note')}
                    </button>
                  )}
                </div>
              </div>
              {isFilteredEmpty && (
                <TimelineSeparator
                  label={
                    newestFirst
                      ? t('session-log.timeline.start')
                      : t('session-log.timeline.most-recent')
                  }
                />
              )}
            </>
          ) : (
            <>
              <TimelineSeparator
                label={
                  newestFirst
                    ? t('session-log.timeline.most-recent')
                    : t('session-log.timeline.start')
                }
                action={
                  newestFirst && showComposerToggle && !isComposerVisible ? (
                    <button
                      type="button"
                      className="journalit-button journalit-button--plain journalit-button--small take-profit-add-button journalit-session-log-add-button"
                      onClick={() => setIsComposerVisible(true)}
                      aria-label={t('session-log.action.add-entry')}
                    >
                      + {t('session-log.action.add-note')}
                    </button>
                  ) : (
                    !newestFirst && filterControl
                  )
                }
              />
              {displayedEntries.map((entry) => {
                if (entry.kind === 'trade') {
                  const price = formatValue({
                    kind: 'price',
                    value: entry.price,
                  });
                  const size = formatValue({
                    kind: 'positionSize',
                    value: entry.positionSize,
                    precision: 2,
                  });
                  return (
                    <div
                      key={entry.id}
                      className={`journalit-session-log-entry journalit-session-log-entry--trade ${entryToneClassName(entry)}`}
                    >
                      <div className="journalit-session-log-entry__body">
                        <div className="journalit-session-log-entry__header">
                          <div className="journalit-session-log-entry__meta">
                            <span
                              className={`journalit-session-log-tag ${
                                entry.eventType === 'entry'
                                  ? 'journalit-session-log-tag--green'
                                  : 'journalit-session-log-tag--red'
                              }`}
                            >
                              {entry.eventType === 'entry' ? 'ENTRY' : 'EXIT'}
                            </span>
                            <span className="journalit-session-log-entry__time">
                              {formatTime(entry.timestamp, use24HourTime)}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="journalit-session-log-icon-button"
                            onClick={() => void openTrade(entry.tradePath)}
                            aria-label={t('session-log.action.open-trade')}
                          >
                            <ExternalLink size={14} />
                          </button>
                        </div>
                        <div className="journalit-session-log-entry__text">
                          {entry.eventType === 'entry'
                            ? t('session-log.trade.entered')
                            : t('session-log.trade.exited')}{' '}
                          {entry.direction} {entry.instrument} @ {price} ·{' '}
                          {t('session-log.trade.size')} {size}
                        </div>
                      </div>
                    </div>
                  );
                }

                const tag = tagById.get(entry.tagId) ?? tags[0];
                return (
                  <div
                    key={entry.id}
                    className={`journalit-session-log-entry journalit-session-log-entry--manual ${entryToneClassName(entry, tag)}`}
                  >
                    <div className="journalit-session-log-entry__body">
                      {editingId === entry.id ? (
                        <div className="journalit-session-log-edit-form">
                          <div
                            className="journalit-session-log-edit-tag-control"
                            ref={editTagMenuRef}
                          >
                            <button
                              type="button"
                              className="journalit-session-log-composer-tag-trigger journalit-session-log-edit-tag-trigger"
                              onClick={() =>
                                setIsEditTagMenuOpen((value) => !value)
                              }
                              aria-label={t('session-log.composer.tag-label')}
                              aria-expanded={isEditTagMenuOpen}
                            >
                              <Tag size={15} />
                              <span>
                                {tagById.get(editTagId)?.shortLabel ?? 'AN'}
                              </span>
                              <ChevronDown
                                size={12}
                                className={
                                  isEditTagMenuOpen
                                    ? 'journalit-session-log-composer-tag-chevron is-open'
                                    : 'journalit-session-log-composer-tag-chevron'
                                }
                              />
                            </button>
                            {isEditTagMenuOpen && (
                              <div className="journalit-session-log-composer-tag-menu journalit-session-log-edit-tag-menu">
                                {tags.map((tagOption) => (
                                  <button
                                    type="button"
                                    key={tagOption.id}
                                    className={
                                      tagOption.id === editTagId
                                        ? 'journalit-session-log-composer-tag-option is-active'
                                        : 'journalit-session-log-composer-tag-option'
                                    }
                                    onClick={() => {
                                      setEditTagId(tagOption.id);
                                      setIsEditTagMenuOpen(false);
                                    }}
                                    aria-pressed={tagOption.id === editTagId}
                                  >
                                    <span
                                      className={
                                        tagOption.id === editTagId
                                          ? 'journalit-session-log-composer-tag-checkbox is-checked'
                                          : 'journalit-session-log-composer-tag-checkbox'
                                      }
                                      aria-hidden="true"
                                    >
                                      {tagOption.id === editTagId ? '✓' : ''}
                                    </span>
                                    <span className="journalit-session-log-composer-tag-option-label">
                                      {tagOption.label}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <textarea
                            value={editText}
                            rows={1}
                            onChange={(event) =>
                              setEditText(event.target.value)
                            }
                          />
                          <div className="journalit-session-log-edit-actions">
                            <button
                              type="button"
                              className="custom-options-compact-icon-button journalit-session-log-edit-icon-button"
                              onClick={() => void saveEdit()}
                              aria-label={t('session-log.action.save')}
                            >
                              <Check size={16} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              className="custom-options-compact-icon-button journalit-session-log-edit-icon-button"
                              onClick={() => {
                                setEditingId(null);
                                setIsEditTagMenuOpen(false);
                              }}
                              aria-label={t('session-log.action.cancel')}
                            >
                              <X size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="journalit-session-log-entry__header">
                            <div className="journalit-session-log-entry__meta">
                              {tag && (
                                <span className={tagClassName(tag)}>
                                  {tag.shortLabel}
                                </span>
                              )}
                              <span className="journalit-session-log-entry__time">
                                {formatTime(entry.timestamp, use24HourTime)}
                              </span>
                              {tag?.requiresResolution && !entry.resolved && (
                                <span className="journalit-session-log-unresolved">
                                  {t('session-log.status.unclassified')}
                                </span>
                              )}
                            </div>
                            <div className="journalit-session-log-entry__actions">
                              {tag?.requiresResolution && !entry.resolved && (
                                <button
                                  type="button"
                                  className="journalit-session-log-action-button journalit-session-log-action-button--text"
                                  onClick={() => beginClassify(entry)}
                                >
                                  <Check size={14} />{' '}
                                  {t('session-log.action.classify')}
                                </button>
                              )}
                              <button
                                type="button"
                                className="journalit-session-log-action-button journalit-session-log-action-button--icon"
                                onClick={() => beginEdit(entry)}
                                aria-label={t('session-log.action.edit')}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                className="journalit-session-log-action-button journalit-session-log-action-button--icon"
                                onClick={() =>
                                  void deleteSessionLogEntry({
                                    plugin,
                                    filePath,
                                    entryId: entry.id,
                                  }).then(onRefresh)
                                }
                                aria-label={t('session-log.action.delete')}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="journalit-session-log-entry__text">
                            {entry.text}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <TimelineSeparator
                label={
                  newestFirst
                    ? t('session-log.timeline.start')
                    : t('session-log.timeline.most-recent')
                }
                action={
                  !newestFirst && showComposerToggle && !isComposerVisible ? (
                    <button
                      type="button"
                      className="journalit-button journalit-button--plain journalit-button--small take-profit-add-button journalit-session-log-add-button"
                      onClick={() => setIsComposerVisible(true)}
                      aria-label={t('session-log.action.add-entry')}
                    >
                      + {t('session-log.action.add-note')}
                    </button>
                  ) : (
                    newestFirst && filterControl
                  )
                }
              />
            </>
          )}
        </div>
      </div>
    );
  }
);

SessionLogPanel.displayName = 'SessionLogPanel';

const TimelineSeparator: React.FC<{
  label: string;
  action?: React.ReactNode;
}> = ({ label, action }) => (
  <div className="journalit-session-log-separator">
    <span>{label}</span>
    {action}
  </div>
);
