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
import { DateDraftGateContext, useDateDraftGate } from '../core/DateDraftGate';
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
import { shareCaptureExcludeProps } from '../../services/share/brandedCapture';
import { cssVars } from '../../styles/inlineStylePolicy';
import { eventBus } from '../../services/events/EventBus';
import { SectionErrorBoundary } from '../shared/SectionErrorBoundary';

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
  readOnly?: boolean;
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

const defaultSessionLogTagId = (tags: SessionLogTagDefinition[]): string =>
  tags[0]?.id ?? 'analysis';

const usesTwentyFourHourTime = (plugin: SessionLogPanelProps['plugin']) =>
  plugin.settings.trade.use24HourTime ?? false;

const resolveSessionLogTagLabels = ({
  tags,
  tagById,
  selectedTagId,
  filterTagId,
}: {
  tags: SessionLogTagDefinition[];
  tagById: Map<string, SessionLogTagDefinition>;
  selectedTagId: string;
  filterTagId: string;
}) => {
  const activeFilterTag =
    filterTagId === 'all' ? null : tagById.get(filterTagId);
  return {
    selectedTag: tagById.get(selectedTagId) ?? tags[0],
    filterLabel: activeFilterTag?.label ?? t('session-log.filter.all'),
  };
};


const isFilteredEmptyLog = ({
  showFilters,
  filterTagId,
  totalCount,
  displayedCount,
}: {
  showFilters: boolean;
  filterTagId: string;
  totalCount: number;
  displayedCount: number;
}): boolean =>
  showFilters &&
  filterTagId !== 'all' &&
  totalCount > 0 &&
  displayedCount === 0;

const SessionLogPanelHeader: React.FC<{ compact: boolean }> = ({ compact }) => {
  if (compact) return null;
  return (
    <div className="journalit-session-log-panel__header">
      <div>
        <h3>{t('session-log.title')}</h3>
        <p>{t('session-log.description')}</p>
      </div>
    </div>
  );
};

const SessionLogAlert: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="journalit-session-log-alert">
      <AlertTriangle size={16} />
      <span>{message}</span>
    </div>
  );
};

const withSessionLogPanelDefaults = (props: SessionLogPanelProps) => ({
  ...props,
  compact: props.compact ?? false,
  showFilters: props.showFilters ?? true,
  newestFirst: props.newestFirst ?? false,
  composerInitiallyVisible: props.composerInitiallyVisible ?? true,
  showComposerToggle: props.showComposerToggle ?? false,
  readOnly: props.readOnly ?? false,
});


const showsAddNoteButton = ({
  readOnly,
  showComposerToggle,
  isComposerVisible,
}: {
  readOnly: boolean;
  showComposerToggle: boolean;
  isComposerVisible: boolean;
}): boolean => !readOnly && showComposerToggle && !isComposerVisible;


const timelineEdgeLabels = (newestFirst: boolean) =>
  newestFirst
    ? {
        top: t('session-log.timeline.most-recent'),
        bottom: t('session-log.timeline.start'),
      }
    : {
        top: t('session-log.timeline.start'),
        bottom: t('session-log.timeline.most-recent'),
      };

interface MenuPosition {
  left: number;
  top: number;
}

const SessionLogTagOption: React.FC<{
  isActive: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}> = ({ isActive, onSelect, children }) => (
  <button
    type="button"
    className={
      isActive
        ? 'journalit-session-log-composer-tag-option is-active'
        : 'journalit-session-log-composer-tag-option'
    }
    onClick={onSelect}
    aria-pressed={isActive}
  >
    <span
      className={
        isActive
          ? 'journalit-session-log-composer-tag-checkbox is-checked'
          : 'journalit-session-log-composer-tag-checkbox'
      }
      aria-hidden="true"
    >
      {isActive ? '✓' : ''}
    </span>
    <span className="journalit-session-log-composer-tag-option-label">
      {children}
    </span>
  </button>
);

const SessionLogFilterControl: React.FC<{
  menuRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  portalRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  position: MenuPosition;
  onToggle: () => void;
  filterTagId: string;
  filterLabel: string;
  tags: SessionLogTagDefinition[];
  onSelect: (tagId: string) => void;
}> = ({
  menuRef,
  buttonRef,
  portalRef,
  isOpen,
  position,
  onToggle,
  filterTagId,
  filterLabel,
  tags,
  onSelect,
}) => (
  <div
    className="journalit-session-log-filter"
    ref={menuRef}
    {...shareCaptureExcludeProps}
  >
    <button
      ref={buttonRef}
      type="button"
      className="journalit-header-icon-button journalit-session-log-filter-trigger"
      onClick={onToggle}
      aria-label={t('session-log.filter.label')}
      aria-expanded={isOpen}
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
    {isOpen &&
      createPortal(
        <div
          ref={portalRef}
          className="journalit-session-log-composer-tag-menu journalit-session-log-filter-menu journalit-session-log-filter-menu--portal"
          style={cssVars({
            '--journalit-session-log-filter-menu-left': `${position.left}px`,
            '--journalit-session-log-filter-menu-top': `${position.top}px`,
          })}
        >
          <SessionLogTagOption
            isActive={filterTagId === 'all'}
            onSelect={() => onSelect('all')}
          >
            {t('session-log.filter.all')}
          </SessionLogTagOption>
          {tags.map((tag) => (
            <SessionLogTagOption
              key={tag.id}
              isActive={filterTagId === tag.id}
              onSelect={() => onSelect(tag.id)}
            >
              {tag.lessonTag && <Lightbulb size={13} />}
              {tag.label}
            </SessionLogTagOption>
          ))}
        </div>,
        window.activeDocument.body
      )}
  </div>
);

interface SessionLogComposerProps {
  compact: boolean;
  tagMenu: {
    controlRef: React.RefObject<HTMLDivElement | null>;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    portalRef: React.RefObject<HTMLDivElement | null>;
    isOpen: boolean;
    position: MenuPosition;
    onToggle: () => void;
    tags: SessionLogTagDefinition[];
    selectedTagId: string;
    selectedTag: SessionLogTagDefinition | undefined;
    onSelect: (tagId: string) => void;
  };
  input: {
    ref: React.RefObject<HTMLInputElement | null>;
    text: string;
    onTextChange: (text: string) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    submitDisabled: boolean;
    
    onHide: (() => void) | undefined;
  };
  timestamp: {
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    enabled: boolean;
    value: Date;
    pickerSignal: number;
    onToggle: () => void;
    onChange: (value: unknown) => void;
  };
}

const SessionLogComposerTagMenu: React.FC<
  SessionLogComposerProps['tagMenu']
> = ({
  controlRef,
  buttonRef,
  portalRef,
  isOpen,
  position,
  onToggle,
  tags,
  selectedTagId,
  selectedTag,
  onSelect,
}) => (
  <div className="journalit-session-log-composer-tag-control" ref={controlRef}>
    <button
      ref={buttonRef}
      type="button"
      className="journalit-session-log-composer-tag-trigger"
      onClick={onToggle}
      aria-label={t('session-log.composer.tag-label')}
      aria-expanded={isOpen}
    >
      <Tag size={15} />
      <span>{selectedTag?.shortLabel ?? 'AN'}</span>
      <ChevronDown
        size={12}
        className={
          isOpen
            ? 'journalit-session-log-composer-tag-chevron is-open'
            : 'journalit-session-log-composer-tag-chevron'
        }
      />
    </button>
    {isOpen &&
      createPortal(
        <div
          ref={portalRef}
          className="journalit-session-log-composer-tag-menu journalit-session-log-composer-tag-menu--portal"
          style={cssVars({
            '--journalit-session-log-tag-menu-left': `${position.left}px`,
            '--journalit-session-log-tag-menu-top': `${position.top}px`,
          })}
        >
          {tags.map((tag) => (
            <SessionLogTagOption
              key={tag.id}
              isActive={tag.id === selectedTagId}
              onSelect={() => onSelect(tag.id)}
            >
              {tag.label}
            </SessionLogTagOption>
          ))}
        </div>,
        buttonRef.current?.ownerDocument.body ?? window.activeDocument.body
      )}
  </div>
);

const SessionLogComposer: React.FC<SessionLogComposerProps> = ({
  compact,
  tagMenu,
  input,
  timestamp,
}) => (
  <div className="journalit-session-log-composer" {...shareCaptureExcludeProps}>
    <div className="journalit-session-log-composer-bar">
      <SessionLogComposerTagMenu {...tagMenu} />
      <input
        ref={input.ref}
        type="text"
        value={input.text}
        placeholder={t('session-log.placeholder.entry-short')}
        onChange={(event) => input.onTextChange(event.target.value)}
        onKeyDown={input.onKeyDown}
      />
      <button
        ref={timestamp.buttonRef}
        type="button"
        className={
          timestamp.enabled
            ? 'journalit-session-log-icon-button is-active'
            : 'journalit-session-log-icon-button'
        }
        onClick={timestamp.onToggle}
        aria-label={
          timestamp.enabled
            ? t('session-log.action.auto-time')
            : t('session-log.action.set-time')
        }
      >
        <Clock size={16} />
      </button>
      <button
        type="button"
        className="journalit-session-log-icon-button journalit-session-log-send-button"
        onClick={input.onSubmit}
        disabled={input.submitDisabled}
        aria-label={t('session-log.action.add-entry')}
      >
        <Send size={16} />
      </button>
      {input.onHide && (
        <button
          type="button"
          className="journalit-session-log-icon-button"
          onClick={input.onHide}
          aria-label={t('session-log.action.hide-composer')}
        >
          <X size={16} />
        </button>
      )}
    </div>
    {timestamp.enabled && (
      <FastDateTimeInput
        className="journalit-session-log-timestamp-input"
        value={timestamp.value}
        includeTime={!compact}
        timeOnly={compact}
        hidePickerButton={compact}
        openPickerSignal={timestamp.pickerSignal}
        pickerPositionElement={timestamp.buttonRef.current}
        controllerOnly={compact}
        closePickerOnQuickAction={!compact}
        onChange={timestamp.onChange}
      />
    )}
  </div>
);


function renderEmptyTimeline({
  isFilteredEmpty,
  newestFirst,
  isComposerCollapsed,
  filterControl,
  addNoteButton,
  composer,
  onClearFilter,
}: {
  isFilteredEmpty: boolean;
  newestFirst: boolean;
  
  isComposerCollapsed: boolean;
  filterControl: React.ReactNode;
  addNoteButton: React.ReactNode;
  composer: React.ReactNode;
  onClearFilter: () => void;
}): React.ReactElement {
  const labels = timelineEdgeLabels(newestFirst);
  return (
    <>
      {isFilteredEmpty && (
        <TimelineSeparator label={labels.top} action={filterControl} />
      )}
      <div
        className={
          isFilteredEmpty || isComposerCollapsed
            ? 'journalit-session-log-empty'
            : 'journalit-session-log-empty journalit-session-log-empty--centered'
        }
      >
        <span>
          {isFilteredEmpty
            ? t('session-log.empty-filtered')
            : t('session-log.empty')}
        </span>
        <div
          className="journalit-session-log-empty__actions"
          {...shareCaptureExcludeProps}
        >
          {isFilteredEmpty && (
            <button
              type="button"
              className="journalit-button journalit-button--plain journalit-button--small take-profit-add-button journalit-session-log-clear-filter-button"
              onClick={onClearFilter}
            >
              {t('session-log.filter.clear')}
            </button>
          )}
          {addNoteButton}
        </div>
      </div>
      {!newestFirst && composer}
      {isFilteredEmpty && <TimelineSeparator label={labels.bottom} />}
    </>
  );
}

export const SessionLogPanel: React.FC<SessionLogPanelProps> = React.memo(
  (props) => {
    const {
      plugin,
      filePath,
      timelineEntries,
      compact,
      showFilters,
      newestFirst,
      composerInitiallyVisible,
      showComposerToggle,
      readOnly,
      timestampSessionWindow,
      onRefresh,
    } = withSessionLogPanelDefaults(props);
    const dateDraftGate = useDateDraftGate();
    const [, setSettingsVersion] = useState(0);
    const tags = getSessionLogTags(plugin);
    const tagById = useMemo(
      () => new Map(tags.map((tag) => [tag.id, tag])),
      [tags]
    );
    const defaultTagId = defaultSessionLogTagId(tags);
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
    const composerInputRef = useRef<HTMLInputElement>(null);
    const composerFocusRequestedRef = useRef(false);
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const addButtonFocusRequestedRef = useRef(false);
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
    const { selectedTag, filterLabel } = resolveSessionLogTagLabels({
      tags,
      tagById,
      selectedTagId,
      filterTagId,
    });
    const use24HourTime = usesTwentyFourHourTime(plugin);

    const hideComposer = useCallback(() => {
      setManualTimestampEnabled(false);
      setIsTagMenuOpen(false);
      addButtonFocusRequestedRef.current = true;
      setIsComposerVisible(false);
    }, []);

    const showComposer = useCallback(() => {
      composerFocusRequestedRef.current = true;
      setIsComposerVisible(true);
    }, []);

    useLayoutEffect(() => {
      if (isComposerVisible && composerFocusRequestedRef.current) {
        composerFocusRequestedRef.current = false;
        composerInputRef.current?.focus();
        return;
      }
      if (!isComposerVisible && addButtonFocusRequestedRef.current) {
        addButtonFocusRequestedRef.current = false;
        addButtonRef.current?.focus();
      }
    }, [isComposerVisible]);

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
      if (!isFilterMenuOpen) updateFilterMenuPosition();
      setIsFilterMenuOpen(!isFilterMenuOpen);
    }, [isFilterMenuOpen, updateFilterMenuPosition]);

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
    const isFilteredEmpty = isFilteredEmptyLog({
      showFilters,
      filterTagId,
      totalCount: sortedEntries.length,
      displayedCount: displayedEntries.length,
    });
    const alertMessage = useMemo(() => {
      const rule = getSessionLogAlertRule(plugin);
      return calculateSessionLogAlert(
        sortedEntries,
        rule,
        tagById.get(rule.tagId)
      );
    }, [plugin, sortedEntries, tagById]);

    const submitEntry = useCallback(async () => {
      if (!dateDraftGate.confirm()) return;
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
        if (showComposerToggle) {
          addButtonFocusRequestedRef.current = true;
          setIsComposerVisible(false);
        }
        onRefresh?.();
      } finally {
        isSubmittingEntryRef.current = false;
        setIsSubmittingEntry(false);
      }
    }, [
      filePath,
      manualTimestamp,
      manualTimestampEnabled,
      dateDraftGate,
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
      <SessionLogFilterControl
        menuRef={filterMenuRef}
        buttonRef={filterButtonRef}
        portalRef={filterMenuPortalRef}
        isOpen={isFilterMenuOpen}
        position={filterMenuPosition}
        onToggle={toggleFilterMenu}
        filterTagId={filterTagId}
        filterLabel={filterLabel}
        tags={tags}
        onSelect={(tagId) => {
          setFilterTagId(tagId);
          setIsFilterMenuOpen(false);
        }}
      />
    ) : undefined;

    const addNoteButton = showsAddNoteButton({
      readOnly,
      showComposerToggle,
      isComposerVisible,
    }) ? (
      <button
        ref={addButtonRef}
        type="button"
        className="journalit-button journalit-button--plain journalit-button--small take-profit-add-button journalit-session-log-add-button"
        {...shareCaptureExcludeProps}
        onClick={showComposer}
        aria-label={t('session-log.action.add-entry')}
        aria-expanded={false}
      >
        + {t('session-log.action.add-note')}
      </button>
    ) : null;

    const toggleManualTimestamp = () => {
      if (!manualTimestampEnabled) {
        setManualTimestamp(getDefaultEntryTimestamp(timestampSessionWindow));
        setManualTimestampPickerSignal((signal) => signal + 1);
      }
      setManualTimestampEnabled(!manualTimestampEnabled);
    };

    const handleManualTimestampChange = (value: unknown) => {
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
    };

    const composer =
      !readOnly && isComposerVisible ? (
        <SectionErrorBoundary name="Session log composer">
          <SessionLogComposer
            compact={compact}
            tagMenu={{
              controlRef: tagMenuRef,
              buttonRef: tagButtonRef,
              portalRef: tagMenuPortalRef,
              isOpen: isTagMenuOpen,
              position: tagMenuPosition,
              onToggle: toggleTagMenu,
              tags,
              selectedTagId,
              selectedTag,
              onSelect: (tagId) => {
                setSelectedTagId(tagId);
                setIsTagMenuOpen(false);
              },
            }}
            input={{
              ref: composerInputRef,
              text,
              onTextChange: setText,
              onKeyDown: submitEntryFromKeyboard,
              onSubmit: () => void submitEntry(),
              submitDisabled: !text.trim() || isSubmittingEntry,
              onHide: showComposerToggle ? hideComposer : undefined,
            }}
            timestamp={{
              buttonRef: timestampButtonRef,
              enabled: manualTimestampEnabled,
              value: manualTimestamp,
              pickerSignal: manualTimestampPickerSignal,
              onToggle: toggleManualTimestamp,
              onChange: handleManualTimestampChange,
            }}
          />
        </SectionErrorBoundary>
      ) : null;

    return (
      <DateDraftGateContext.Provider value={dateDraftGate}>
        <div className="journalit-session-log-panel">
          <SessionLogPanelHeader compact={compact} />
          <SessionLogAlert message={alertMessage} />

          {newestFirst && composer}

          <div className="journalit-session-log-timeline">
            {displayedEntries.length === 0 ? (
              renderEmptyTimeline({
                isFilteredEmpty,
                newestFirst,
                isComposerCollapsed: showComposerToggle && !isComposerVisible,
                filterControl,
                addNoteButton,
                composer,
                onClearFilter: () => setFilterTagId('all'),
              })
            ) : (
              <>
                <TimelineSeparator
                  label={timelineEdgeLabels(newestFirst).top}
                  action={newestFirst ? addNoteButton : filterControl}
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
                              {...shareCaptureExcludeProps}
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
                              aria-label={t('session-log.action.edit')}
                              value={editText}
                              rows={1}
                              onChange={(event) =>
                                setEditText(event.target.value)
                              }
                            />
                            <div
                              className="journalit-session-log-edit-actions"
                              {...shareCaptureExcludeProps}
                            >
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
                              {!readOnly && (
                                <div
                                  className="journalit-session-log-entry__actions"
                                  {...shareCaptureExcludeProps}
                                >
                                  {tag?.requiresResolution &&
                                    !entry.resolved && (
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
                                      })
                                        .then(onRefresh)
                                        .catch((error) => {
                                          console.error(
                                            'Failed to delete session log entry:',
                                            error
                                          );
                                        })
                                    }
                                    aria-label={t('session-log.action.delete')}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
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
                {!newestFirst && composer}
                <TimelineSeparator
                  label={timelineEdgeLabels(newestFirst).bottom}
                  action={newestFirst ? filterControl : addNoteButton}
                />
              </>
            )}
          </div>
        </div>
      </DateDraftGateContext.Provider>
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
