

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Component, MarkdownRenderer, TFile } from 'obsidian';
import JournalitPlugin from '../../../main';
import {
  getWeekStartDate,
  getWeekStartDaySetting,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import { forceMetadataCacheRefresh } from '../../../utils/dataRefresh';
import {
  extractJournalitImageWidgetIds,
  extractMarkdownSectionsByHeading,
  stripPreviousTradingDayContextWidgetBlocks,
} from '../../../utils/markdownSectionExtractor';
import { ImageCarousel } from '../../image/ImageCarousel';
import { t } from '../../../lang/helpers';
import { eventBus } from '../../../services/events';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { InvalidContextMessage } from './InvalidContextMessage';

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
}

type WeeklyDRCContentBlock =
  | { type: 'markdown'; markdown: string }
  | { type: 'images'; widgetId: string; images: string[] };

interface WeeklyDRCDayContext {
  date: Date;
  dateKey: string;
  sourcePath?: string;
  reviewed: boolean;
  sections: Array<{
    heading: string;
    blocks: WeeklyDRCContentBlock[];
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

const IMAGE_WIDGET_BLOCK_WITH_ID_PATTERN =
  /^[\t ]*```journalit-images[^\r\n]*\r?\n([\s\S]*?)^[\t ]*```[\t ]*$/gm;

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

function normalizeHeadingText(heading: string): string {
  return heading.trim().replace(/\s+/g, ' ').toLowerCase();
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

function getImagesForWidget(
  imagesByWidget: unknown,
  widgetId: string
): string[] {
  const imageRecord = asRecord(imagesByWidget);
  if (!imageRecord) return [];
  const images = imageRecord[widgetId];
  if (!Array.isArray(images)) return [];
  return images.filter((image): image is string => typeof image === 'string');
}

function trimMarkdownBlockBoundaries(markdown: string): string {
  return markdown
    .replace(/^(?:[\t ]*\r?\n)+/, '')
    .replace(/(?:\r?\n[\t ]*)+$/, '');
}

function extractImageWidgetId(blockConfig: string): string | null {
  const idLine = blockConfig
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('id:'));
  if (!idLine) return null;
  const id = idLine.slice('id:'.length).trim();
  return id.length > 0 ? id : null;
}

function buildContentBlocks(
  markdown: string,
  imageWidgets: Array<{ id: string; images: string[] }>
): WeeklyDRCContentBlock[] {
  const imagesByWidget = new Map(
    imageWidgets.map((widget) => [widget.id, widget.images])
  );
  const blocks: WeeklyDRCContentBlock[] = [];
  let lastIndex = 0;

  for (const match of markdown.matchAll(IMAGE_WIDGET_BLOCK_WITH_ID_PATTERN)) {
    const matchIndex = match.index ?? 0;
    const precedingMarkdown = trimMarkdownBlockBoundaries(
      markdown.slice(lastIndex, matchIndex)
    );
    if (precedingMarkdown)
      blocks.push({ type: 'markdown', markdown: precedingMarkdown });

    const widgetId = extractImageWidgetId(match[1]);
    const images = widgetId ? imagesByWidget.get(widgetId) || [] : [];
    if (widgetId && images.length > 0)
      blocks.push({ type: 'images', widgetId, images });

    lastIndex = matchIndex + match[0].length;
  }

  const trailingMarkdown = trimMarkdownBlockBoundaries(
    markdown.slice(lastIndex)
  );
  if (trailingMarkdown)
    blocks.push({ type: 'markdown', markdown: trailingMarkdown });

  if (blocks.length === 0 && markdown.trim()) {
    blocks.push({ type: 'markdown', markdown: markdown.trim() });
  }

  return blocks;
}

const MarkdownBlock: React.FC<{
  markdown: string;
  plugin: JournalitPlugin;
  sourcePath: string;
}> = ({ markdown, plugin, sourcePath }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.empty();
    const component = new Component();
    component.load();
    let active = true;
    const disableInteractiveElements = () => {
      if (!active) return;
      el.querySelectorAll<HTMLElement>(
        'input, button, select, textarea, a, [contenteditable="true"], [role="button"], [role="checkbox"], [role="link"]'
      ).forEach((interactiveElement) => {
        interactiveElement.setAttribute('aria-disabled', 'true');
        interactiveElement.tabIndex = -1;
        if (
          interactiveElement.instanceOf(HTMLInputElement) ||
          interactiveElement.instanceOf(HTMLButtonElement) ||
          interactiveElement.instanceOf(HTMLSelectElement) ||
          interactiveElement.instanceOf(HTMLTextAreaElement)
        ) {
          interactiveElement.disabled = true;
        }
      });
    };
    void Promise.resolve(
      MarkdownRenderer.render(plugin.app, markdown, el, sourcePath, component)
    ).then(disableInteractiveElements);
    return () => {
      active = false;
      component.unload();
    };
  }, [markdown, plugin, sourcePath]);

  const preventEmbeddedMutation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      ref={ref}
      className="journalit-previous-drc-rendered-markdown"
      onInputCapture={preventEmbeddedMutation}
      onChangeCapture={preventEmbeddedMutation}
      onSubmitCapture={preventEmbeddedMutation}
      onClickCapture={preventEmbeddedMutation}
      onPointerDownCapture={preventEmbeddedMutation}
      onMouseDownCapture={preventEmbeddedMutation}
    />
  );
};

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
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stickyHeader: { left: number; top: number; width: number } | null;
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
  setIsOpen,
  stickyHeader,
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
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={() => setIsOpen((current) => !current)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        setIsOpen((current) => !current);
      }}
      style={cssVars({
        '--journalit-weekly-drc-sticky-left':
          isStickyClone && stickyHeader ? `${stickyHeader.left}px` : null,
        '--journalit-weekly-drc-sticky-width':
          isStickyClone && stickyHeader ? `${stickyHeader.width}px` : null,
        '--journalit-weekly-drc-sticky-top':
          isStickyClone && stickyHeader ? `${stickyHeader.top}px` : null,
      })}
    >
      <span
        className="journalit-weekly-drc-accordion-indicator"
        aria-hidden="true"
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
      </span>
      <span className="journalit-previous-drc-reference-title-group">
        <span
          className="journalit-previous-drc-reference-date journalit-weekly-drc-reference-date-link"
          role="link"
          tabIndex={preview ? -1 : 0}
          onClick={(event) => void openSourceDRC(event)}
          onKeyDown={(event) => void handleOpenSourceKeyDown(event)}
        >
          {title}
        </span>
      </span>
      <span className="journalit-weekly-drc-header-spacer" />
      {!preview && (
        <span className="journalit-weekly-drc-header-actions">
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
  filePath: string;
  defaultExpanded: boolean;
  preview?: boolean;
}> = ({ day, plugin, filePath, defaultExpanded, preview }) => {
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
    Boolean(day.sourcePath) || plugin.settings.drc.autoCreateDRCOnNavigation;
  const [stickyHeader, setStickyHeader] = useState<{
    left: number;
    width: number;
    top: number;
  } | null>(null);
  const dayRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const setIsOpen: React.Dispatch<React.SetStateAction<boolean>> = (update) => {
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
        isOpen: typeof update === 'function' ? update(currentIsOpen) : update,
      };
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setStickyHeader(null);
      return;
    }

    const updateStickyHeader = () => {
      const dayEl = dayRef.current;
      const headerEl = headerRef.current;
      if (!dayEl || !headerEl) return;

      const dayRect = dayEl.getBoundingClientRect();
      const headerRect = headerEl.getBoundingClientRect();
      const scrollContainer = headerEl.closest(
        '.cm-scroller, .markdown-preview-view, .markdown-reading-view'
      );
      const top = scrollContainer?.getBoundingClientRect().top ?? 0;
      const shouldStick =
        dayRect.top < top && dayRect.bottom > top + headerRect.height;

      setStickyHeader(
        shouldStick ? { left: dayRect.left, width: dayRect.width, top } : null
      );
    };

    updateStickyHeader();
    window.addEventListener('scroll', updateStickyHeader, true);
    window.addEventListener('resize', updateStickyHeader);
    return () => {
      window.removeEventListener('scroll', updateStickyHeader, true);
      window.removeEventListener('resize', updateStickyHeader);
    };
  }, [isOpen]);

  const openDRCForDay = useCallback(async () => {
    if (day.sourcePath) {
      await plugin.app.workspace.openLinkText(day.sourcePath, filePath);
      return;
    }

    const drcService = plugin.serviceManager
      ? await plugin.serviceManager.getDRCService()
      : plugin.drcService;
    const expectedPath = drcService.getDRCNotePath(day.date);
    const existingFile = plugin.app.vault.getAbstractFileByPath(expectedPath);
    if (existingFile instanceof TFile) {
      await plugin.app.workspace.openLinkText(expectedPath, filePath);
      return;
    }

    if (plugin.settings.drc.autoCreateDRCOnNavigation) {
      const createdPath = await drcService.createDRC(day.date);
      await plugin.app.workspace.openLinkText(createdPath, filePath);
    }
  }, [day.date, day.sourcePath, filePath, plugin]);

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
    if (preview) return;

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
            {section.blocks.map((block) => {
              if (block.type === 'markdown') {
                return (
                  <MarkdownBlock
                    key={`markdown-${block.markdown.slice(0, 80)}`}
                    markdown={block.markdown}
                    plugin={plugin}
                    sourcePath={day.sourcePath || day.dateKey}
                  />
                );
              }

              return (
                <div
                  key={`images-${block.widgetId}`}
                  className="journalit-images-widget"
                >
                  <ImageCarousel
                    images={block.images}
                    altPrefix={t('widget.weekly-drc-context.image-alt-prefix')}
                    displayOptions={{
                      showThumbnails: block.images.length > 1,
                      showCounter: block.images.length > 1,
                      enableFullscreen: true,
                    }}
                    deleteOptions={{ enabled: false }}
                    useResolveMediaPath={true}
                    sourcePath={day.sourcePath || day.dateKey}
                  />
                </div>
              );
            })}
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
        setIsOpen={setIsOpen}
        stickyHeader={stickyHeader}
        title={title}
        toggleReviewed={toggleReviewed}
      />
      {stickyHeader &&
        createPortal(
          <WeeklyDRCAccordionHeader
            canToggleReviewed={canToggleReviewed}
            handleOpenSourceKeyDown={handleOpenSourceKeyDown}
            isOpen={isOpen}
            isStickyClone={true}
            openSourceDRC={openSourceDRC}
            preview={preview}
            reviewed={reviewed}
            setIsOpen={setIsOpen}
            stickyHeader={stickyHeader}
            title={title}
            toggleReviewed={toggleReviewed}
          />,
          window.activeDocument.body
        )}
      {isOpen && content}
    </article>
  );
};

export const WeeklyDRCContextWidget: React.FC<WeeklyDRCContextWidgetProps> =
  React.memo(({ filePath, plugin, config, preview }) => {
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
    const defaultExpanded = config?.defaultExpanded !== false;
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
                  blocks: [
                    {
                      type: 'markdown',
                      markdown: 'Preview of selected DRC section content.',
                    },
                  ],
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
              const extractedSections = extractMarkdownSectionsByHeading(
                content,
                headings
              );
              const sectionsByHeading = new Map(
                extractedSections.map((section) => [
                  normalizeHeadingText(section.heading),
                  section,
                ])
              );
              const sections = headings.flatMap((heading) => {
                const section = sectionsByHeading.get(
                  normalizeHeadingText(heading)
                );
                if (!section) return [];

                const markdown = stripPreviousTradingDayContextWidgetBlocks(
                  section.content
                );
                const imageWidgets = extractJournalitImageWidgetIds(
                  markdown
                ).map((widgetId) => ({
                  id: widgetId,
                  images: getImagesForWidget(
                    drcFrontmatter?.imagesByWidget,
                    widgetId
                  ),
                }));
                return [
                  {
                    heading: section.heading,
                    blocks: buildContentBlocks(markdown, imageWidgets),
                  },
                ];
              });
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
            dispatchState({ error: t('widget.weekly-drc-context.load-error') });
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
    if (loading)
      return (
        <div className="journalit-widget-loading">{t('common.loading')}</div>
      );
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
          {days.map((day) => (
            <WeeklyDRCDay
              key={day.dateKey}
              day={day}
              plugin={plugin}
              filePath={filePath}
              defaultExpanded={defaultExpanded}
              preview={preview}
            />
          ))}
        </div>
      </div>
    );
  });

WeeklyDRCContextWidget.displayName = 'WeeklyDRCContextWidget';
