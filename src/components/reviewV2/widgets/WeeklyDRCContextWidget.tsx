

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { TFile } from 'obsidian';
import { useReviewReadOnly } from '../ReviewReadOnlyContext';
import { EmbeddedReviewMarkdown } from '../EmbeddedReviewMarkdown';
import JournalitPlugin from '../../../main';
import {
  getWeekStartDate,
  getWeekStartDaySetting,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import { forceMetadataCacheRefresh } from '../../../utils/dataRefresh';
import { extractReviewContextSections } from '../../../utils/reviewContextSections';
import { t } from '../../../lang/helpers';
import { eventBus } from '../../../services/events/EventBus';
import { StickyHeaderPortal, useStickyHeader } from '../../shared/StickyHeader';
import { InvalidContextMessage } from './InvalidContextMessage';
import { keepReviewItemHeaderInPlaceOnCollapse } from './shared/reviewScrollUtils';
import { ReviewWidgetSkeleton } from './shared/ReviewWidgetSkeleton';
import { openReviewWidgetFile } from '../reviewWidgetNavigation';
import { shareCaptureExcludeProps } from '../../../services/share/brandedCapture';

type WeeklyDRCDayScope =
  | 'all'
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface WeeklyDRCContextConfig {
  headings?: string;
  headingsJson?: string;
  dayScope?: WeeklyDRCDayScope;
  defaultExpanded?: boolean;
}

interface WeeklyDRCContextWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: WeeklyDRCContextConfig;
  preview?: boolean;
  ancestorSourcePaths?: readonly string[];
}

interface WeeklyDRCDayContext {
  date: Date;
  dateKey: string;
  sourcePath?: string;
  reviewed: boolean;
  sections: Array<{
    heading: string;
    markdown: string;
  }>;
}

const DAY_SCOPES: WeeklyDRCDayScope[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];
const NO_ANCESTOR_SOURCES: readonly string[] = [];

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;

const parseFrontmatterDate = (value: unknown): Date | null =>
  typeof value === 'string' ||
  typeof value === 'number' ||
  value instanceof Date
    ? parseLocalDateSafe(value)
    : null;

function parseHeadings(config: WeeklyDRCContextConfig | undefined): string[] {
  if (config?.headingsJson) {
    try {
      const parsed: unknown = JSON.parse(config.headingsJson);
      if (Array.isArray(parsed)) {
        return parsed.flatMap((heading) => {
          const normalized = typeof heading === 'string' ? heading.trim() : '';
          return normalized ? [normalized] : [];
        });
      }
    } catch {
      // intentional
    }
  }

  if (!config?.headings) return [];
  return config.headings.split(/[|\n]/).flatMap((heading) => {
    const normalized = heading.trim();
    return normalized ? [normalized] : [];
  });
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const dayHeadingFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function formatDayHeading(date: Date): string {
  return dayHeadingFormatter.format(date);
}

interface WeeklyDRCAccordionHeaderProps {
  canToggleReviewed: boolean;
  handleOpenSourceKeyDown: (
    event: React.KeyboardEvent<HTMLElement>
  ) => void | Promise<void>;
  headerRef?: React.Ref<HTMLDivElement>;
  isOpen: boolean;
  isStickyClone?: boolean;
  openSourceDRC: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  preview?: boolean;
  reviewed: boolean;
  onToggleOpen: () => void;
  title: string;
  toggleReviewed: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void | Promise<void>;
}

function WeeklyDRCAccordionHeader({
  canToggleReviewed,
  handleOpenSourceKeyDown,
  headerRef,
  isOpen,
  isStickyClone = false,
  openSourceDRC,
  preview,
  reviewed,
  onToggleOpen,
  title,
  toggleReviewed,
}: WeeklyDRCAccordionHeaderProps) {
  return (
    <div
      ref={isStickyClone ? undefined : headerRef}
      className={[
        'journalit-previous-drc-reference-header',
        'journalit-weekly-drc-summary',
        isStickyClone ? 'journalit-weekly-drc-summary--sticky-clone' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-expanded={isOpen}
    >
      <button
        type="button"
        className="journalit-native-button journalit-native-button--unstyled journalit-weekly-drc-accordion-indicator"
        aria-label={title}
        aria-expanded={isOpen}
        onClick={onToggleOpen}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <span className="journalit-previous-drc-reference-title-group">
        <button
          type="button"
          className="journalit-native-button journalit-native-button--unstyled journalit-previous-drc-reference-date journalit-weekly-drc-reference-date-link"
          onClick={(event) => void openSourceDRC(event)}
          onKeyDown={(event) => void handleOpenSourceKeyDown(event)}
        >
          {title}
        </button>
      </span>
      <span className="journalit-weekly-drc-header-spacer" />
      {!preview && (
        <span
          className="journalit-weekly-drc-header-actions"
          {...shareCaptureExcludeProps}
        >
          <button
            className={`journalit-weekly-drc-mark-reviewed-button ${reviewed ? 'journalit-weekly-drc-mark-reviewed-button--reviewed' : ''}`}
            type="button"
            disabled={!canToggleReviewed}
            onClick={(event) => void toggleReviewed(event)}
            onKeyDown={(event) => event.stopPropagation()}
            aria-pressed={reviewed}
          >
            <span
              className={`journalit-weekly-drc-mark-reviewed-icon ${reviewed ? 'journalit-weekly-drc-mark-reviewed-icon--reviewed' : ''}`}
              aria-hidden="true"
            >
              {reviewed && (
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </span>
            {reviewed
              ? t('trade.review.reviewed')
              : t('widget.mark-reviewed.button.mark')}
          </button>
        </span>
      )}
    </div>
  );
}

const WeeklyDRCDay: React.FC<{
  day: WeeklyDRCDayContext;
  plugin: JournalitPlugin;
  defaultExpanded: boolean;
  preview?: boolean;
  ancestorSourcePaths: readonly string[];
}> = ({ day, plugin, defaultExpanded, preview, ancestorSourcePaths }) => {
  const readOnly = useReviewReadOnly();
  const hasSourceCycle =
    day.sourcePath !== undefined &&
    ancestorSourcePaths.includes(day.sourcePath);
  const hasContent = day.sections.length > 0;
  const title = formatDayHeading(day.date);
  const [dayState, setDayState] = useState<{
    dateKey: string | null;
    sourceReviewed: boolean;
    isOpen: boolean;
    reviewed: boolean;
  }>({ dateKey: null, sourceReviewed: false, isOpen: false, reviewed: false });
  const isCurrentDayState =
    dayState.dateKey === day.dateKey &&
    dayState.sourceReviewed === day.reviewed;
  const isOpen = isCurrentDayState
    ? dayState.isOpen
    : defaultExpanded && !day.reviewed;
  const reviewed = isCurrentDayState ? dayState.reviewed : day.reviewed;
  const canToggleReviewed =
    !readOnly &&
    (Boolean(day.sourcePath) || plugin.settings.drc.autoCreateDRCOnNavigation);
  const dayRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const toggleOpen = () => {
    if (isOpen) {
      keepReviewItemHeaderInPlaceOnCollapse(dayRef.current);
    }
    setDayState((current) => {
      const currentIsOpen =
        current.dateKey === day.dateKey
          ? current.isOpen
          : defaultExpanded && !day.reviewed;
      return {
        dateKey: day.dateKey,
        sourceReviewed: day.reviewed,
        reviewed:
          current.dateKey === day.dateKey &&
          current.sourceReviewed === day.reviewed
            ? current.reviewed
            : day.reviewed,
        isOpen: !currentIsOpen,
      };
    });
  };

  const stickyHeader = useStickyHeader({
    containerRef: dayRef,
    enabled: isOpen,
    headerRef,
  });

  const openDRCForDay = useCallback(async () => {
    if (day.sourcePath) {
      await openReviewWidgetFile(plugin, day.sourcePath);
      return;
    }

    const drcService = plugin.serviceManager
      ? await plugin.serviceManager.getDRCService()
      : plugin.drcService;
    const expectedPath = drcService.getDRCNotePath(day.date);
    const existingFile = plugin.app.vault.getAbstractFileByPath(expectedPath);
    if (existingFile instanceof TFile) {
      await openReviewWidgetFile(plugin, expectedPath);
      return;
    }

    if (plugin.settings.drc.autoCreateDRCOnNavigation) {
      const createdPath = await drcService.createDRC(day.date);
      await openReviewWidgetFile(plugin, createdPath);
    }
  }, [day.date, day.sourcePath, plugin]);

  const openSourceDRC = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (preview) return;
    await openDRCForDay();
  };

  const handleOpenSourceKeyDown = async (
    event: React.KeyboardEvent<HTMLSpanElement>
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    if (preview) return;
    await openDRCForDay();
  };

  const toggleReviewed = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (preview || readOnly) return;

    const drcService = plugin.serviceManager
      ? await plugin.serviceManager.getDRCService()
      : plugin.drcService;
    let sourcePath = day.sourcePath || drcService.getDRCNotePath(day.date);
    let file = plugin.app.vault.getAbstractFileByPath(sourcePath);
    if (!(file instanceof TFile)) {
      if (!plugin.settings.drc.autoCreateDRCOnNavigation) return;
      sourcePath = await drcService.createDRC(day.date);
      file = plugin.app.vault.getAbstractFileByPath(sourcePath);
      if (!(file instanceof TFile)) return;
    }

    const nextReviewed = !reviewed;
    if (nextReviewed && isOpen) {
      keepReviewItemHeaderInPlaceOnCollapse(dayRef.current);
    }
    setDayState({
      dateKey: day.dateKey,
      sourceReviewed: day.reviewed,
      reviewed: nextReviewed,
      isOpen: defaultExpanded && !nextReviewed,
    });
    try {
      const currentEodReview =
        asRecord(
          asRecord(plugin.app.metadataCache.getFileCache(file)?.frontmatter)
            ?.endOfDayReview
        ) ?? {};
      await drcService.updateDRCFrontmatter(
        sourcePath,
        {
          endOfDayReview: {
            ...currentEodReview,
            reviewed: nextReviewed,
            reviewedAt: nextReviewed ? new Date().toISOString() : null,
          },
        },
        'user-input'
      );
      eventBus.publish('review:changed', {
        action: 'updated',
        type: 'drc',
        filePath: sourcePath,
      });
    } catch (error) {
      setDayState((current) => ({ ...current, reviewed }));
      console.error(
        '[WeeklyDRCContextWidget] Failed to update DRC review status:',
        error
      );
    }
  };

  const content = (
    <div className="journalit-previous-drc-reference-body">
      {hasContent ? (
        day.sections.map((section) => (
          <section key={section.heading}>
            <h4>{section.heading}</h4>
            <EmbeddedReviewMarkdown
              markdown={section.markdown}
              plugin={plugin}
              sourcePath={day.sourcePath || day.dateKey}
            />
          </section>
        ))
      ) : (
        <div className="journalit-widget-empty">
          {t('widget.weekly-drc-context.no-activity')}
        </div>
      )}
    </div>
  );

  return (
    <article
      ref={dayRef}
      className="journalit-weekly-drc-day journalit-weekly-drc-day--accordion journalit-previous-drc-reference"
    >
      <WeeklyDRCAccordionHeader
        canToggleReviewed={canToggleReviewed}
        handleOpenSourceKeyDown={handleOpenSourceKeyDown}
        headerRef={headerRef}
        isOpen={isOpen}
        openSourceDRC={openSourceDRC}
        preview={preview}
        reviewed={reviewed}
        onToggleOpen={toggleOpen}
        title={title}
        toggleReviewed={toggleReviewed}
      />
      <StickyHeaderPortal
        className="journalit-weekly-drc-summary--sticky-clone"
        metrics={stickyHeader}
      >
        <WeeklyDRCAccordionHeader
          canToggleReviewed={canToggleReviewed}
          handleOpenSourceKeyDown={handleOpenSourceKeyDown}
          isOpen={isOpen}
          isStickyClone={true}
          openSourceDRC={openSourceDRC}
          preview={preview}
          reviewed={reviewed}
          onToggleOpen={toggleOpen}
          title={title}
          toggleReviewed={toggleReviewed}
        />
      </StickyHeaderPortal>
      {isOpen && !hasSourceCycle && content}
    </article>
  );
};

export const WeeklyDRCContextWidget: React.FC<WeeklyDRCContextWidgetProps> =
  React.memo(
    ({
      filePath,
      plugin,
      config,
      preview,
      ancestorSourcePaths = NO_ANCESTOR_SOURCES,
    }) => {
      const [state, dispatchState] = useReducer(
        (
          current: {
            days: WeeklyDRCDayContext[];
            loading: boolean;
            error: string | null;
            invalidContext: boolean;
          },
          update: Partial<{
            days: WeeklyDRCDayContext[];
            loading: boolean;
            error: string | null;
            invalidContext: boolean;
          }>
        ) => ({ ...current, ...update }),
        { days: [], loading: !preview, error: null, invalidContext: false }
      );
      const { days, loading, error, invalidContext } = state;
      const headings = useMemo(() => parseHeadings(config), [config]);
      
      const defaultExpanded =
        ancestorSourcePaths.length === 0 && config?.defaultExpanded !== false;
      const dayScope = config?.dayScope || 'all';

      useEffect(() => {
        if (preview) {
          const today = new Date(2026, 3, 13);
          dispatchState({
            days: [
              {
                date: today,
                dateKey: formatDateKey(today),
                reviewed: false,
                sections: [
                  {
                    heading: headings[0] || 'What actually happened today',
                    markdown: 'Preview of selected DRC section content.',
                  },
                ],
              },
            ],
          });
          return;
        }

        let isMounted = true;
        const load = async () => {
          dispatchState({
            loading: true,
            error: null,
            invalidContext: false,
            days: [],
          });
          try {
            const file = plugin.app.vault.getAbstractFileByPath(filePath);
            if (!(file instanceof TFile)) {
              if (isMounted)
                dispatchState({
                  error: t('widget.weekly-drc-context.current-week-not-found'),
                });
              return;
            }

            await forceMetadataCacheRefresh(plugin.app, file);
            const frontmatter = asRecord(
              plugin.app.metadataCache.getFileCache(file)?.frontmatter
            );
            if (frontmatter?.type !== 'weekly-review') {
              if (isMounted) dispatchState({ invalidContext: true });
              return;
            }

            const reviewDate = parseFrontmatterDate(frontmatter?.date);
            if (!reviewDate) {
              if (isMounted)
                dispatchState({
                  error: t(
                    'widget.weekly-drc-context.current-week-date-not-found'
                  ),
                });
              return;
            }

            const weekStart = getWeekStartDate(
              reviewDate,
              getWeekStartDaySetting(plugin)
            );
            const allDates = Array.from({ length: 7 }, (_, index) => {
              const date = new Date(weekStart);
              date.setDate(weekStart.getDate() + index);
              return date;
            });
            const skipWeekends = plugin.settings.trade.skipWeekends ?? true;
            const tradingDates = skipWeekends
              ? allDates.filter(
                  (date) => date.getDay() !== 0 && date.getDay() !== 6
                )
              : allDates;
            const selectedDates =
              dayScope === 'all'
                ? tradingDates
                : allDates.filter(
                    (date) => DAY_SCOPES[date.getDay()] === dayScope
                  );

            const weeklyService = plugin.serviceManager
              ? await plugin.serviceManager.getWeeklyReviewService()
              : plugin.weeklyReviewService;
            const drcs = await weeklyService.getDRCsForWeek(reviewDate);
            const drcsByDate = new Map(
              drcs.map((drc) => [drc.data.date, drc.file])
            );

            const nextDays = await Promise.all(
              selectedDates.map(async (date): Promise<WeeklyDRCDayContext> => {
                const dateKey = formatDateKey(date);
                const drcFile = drcsByDate.get(dateKey);
                if (!drcFile) {
                  return { date, dateKey, reviewed: false, sections: [] };
                }

                await forceMetadataCacheRefresh(plugin.app, drcFile);
                const drcFrontmatter = asRecord(
                  plugin.app.metadataCache.getFileCache(drcFile)?.frontmatter
                );
                const content = await plugin.app.vault.read(drcFile);
                const extractedSections = extractReviewContextSections(
                  content,
                  headings
                );
                const sections = extractedSections.map((section) => ({
                  heading: section.heading,
                  markdown: section.content,
                }));
                return {
                  date,
                  dateKey,
                  sourcePath: drcFile.path,
                  reviewed:
                    asRecord(drcFrontmatter?.endOfDayReview)?.reviewed === true,
                  sections,
                };
              })
            );

            if (isMounted) dispatchState({ days: nextDays });
          } catch (err) {
            console.error(
              '[WeeklyDRCContextWidget] Failed to load weekly DRC context:',
              err
            );
            if (isMounted)
              dispatchState({
                error: t('widget.weekly-drc-context.load-error'),
              });
          } finally {
            if (isMounted) dispatchState({ loading: false });
          }
        };

        void load();
        return () => {
          isMounted = false;
        };
      }, [dayScope, filePath, headings, plugin, preview]);

      if (invalidContext) {
        return (
          <InvalidContextMessage
            widgetType={t('widget.weekly-drc-context.name')}
            reason={t('widget.weekly-drc-context.invalid-context')}
          />
        );
      }
      if (loading) return <ReviewWidgetSkeleton variant="weekday-review" />;
      if (error) return <div className="journalit-widget-error">{error}</div>;
      if (headings.length === 0) {
        return (
          <div className="journalit-widget-empty">
            {t('widget.weekly-drc-context.no-sections-configured')}
          </div>
        );
      }

      return (
        <div className="journalit-weekly-drc-context journalit-weekly-drc-context--accordion">
          <div className="journalit-weekly-drc-days">
            {days.map((day, index) => (
              <WeeklyDRCDay
                key={day.dateKey}
                day={day}
                plugin={plugin}
                defaultExpanded={defaultExpanded}
                preview={preview}
                ancestorSourcePaths={ancestorSourcePaths}
              />
            ))}
          </div>
        </div>
      );
    }
  );

WeeklyDRCContextWidget.displayName = 'WeeklyDRCContextWidget';
