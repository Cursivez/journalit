

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Component, MarkdownRenderer, TFile } from 'obsidian';
import JournalitPlugin from '../../../main';
import { parseLocalDateSafe } from '../../../utils/dateUtils';
import { ImageCarousel } from '../../image/ImageCarousel';
import { createSvgPlaceholderDataUri } from '../../../utils/placeholderImage';
import type { PreviousTradingDayContextResult } from '../../../services/drc/DRCService';
import { t } from '../../../lang/helpers';
import { forceMetadataCacheRefresh } from '../../../utils/dataRefresh';

interface PreviousTradingDayContextConfig {
  headings?: string;
  headingsJson?: string;
  fallbackMode?: 'expected-only' | 'nearest-earlier';
}

const previousDRCDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

interface PreviousTradingDayContextWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: PreviousTradingDayContextConfig;
  preview?: boolean;
}

const PREVIEW_HEADING = 'Forecast';
const IMAGE_WIDGET_BLOCK_PATTERN =
  /^[\t ]*```journalit-images[^\r\n]*\r?\n[\s\S]*?^[\t ]*```[\t ]*$/gm;
const IMAGE_WIDGET_BLOCK_WITH_ID_PATTERN =
  /^[\t ]*```journalit-images[^\r\n]*\r?\n([\s\S]*?)^[\t ]*```[\t ]*$/gm;

function parseHeadings(
  config: PreviousTradingDayContextConfig | undefined
): string[] {
  if (config?.headingsJson) {
    try {
      const parsed: unknown = JSON.parse(config.headingsJson);
      if (Array.isArray(parsed)) {
        return parsed
          .map((heading) => (typeof heading === 'string' ? heading.trim() : ''))
          .filter(Boolean);
      }
    } catch {
      // intentional
    }
  }

  if (!config?.headings) return [];
  return config.headings
    .split(/[|\n]/)
    .map((heading) => heading.trim())
    .filter(Boolean);
}

function stripImageWidgetBlocks(markdown: string): string {
  return trimMarkdownBlockBoundaries(
    markdown.replace(IMAGE_WIDGET_BLOCK_PATTERN, '')
  );
}

function trimMarkdownBlockBoundaries(markdown: string): string {
  return markdown
    .replace(/^(?:[\t ]*\r?\n)+/, '')
    .replace(/(?:\r?\n[\t ]*)+$/, '');
}

type PreviousDRCContentBlock =
  | { type: 'markdown'; markdown: string }
  | { type: 'images'; widgetId: string; images: string[] };

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
  imageWidgets: Array<{ id: string; images: string[] }> | undefined,
  fallbackImages: string[]
): PreviousDRCContentBlock[] {
  const imagesByWidget = new Map(
    (imageWidgets ?? []).map((widget) => [widget.id, widget.images])
  );
  const blocks: PreviousDRCContentBlock[] = [];
  let lastIndex = 0;

  for (const match of markdown.matchAll(IMAGE_WIDGET_BLOCK_WITH_ID_PATTERN)) {
    const matchIndex = match.index ?? 0;
    const precedingMarkdown = trimMarkdownBlockBoundaries(
      markdown.slice(lastIndex, matchIndex)
    );
    if (precedingMarkdown) {
      blocks.push({ type: 'markdown', markdown: precedingMarkdown });
    }

    const widgetId = extractImageWidgetId(match[1]);
    const images = widgetId ? imagesByWidget.get(widgetId) || [] : [];
    if (widgetId && images.length > 0) {
      blocks.push({ type: 'images', widgetId, images });
    }

    lastIndex = matchIndex + match[0].length;
  }

  const trailingMarkdown = trimMarkdownBlockBoundaries(
    markdown.slice(lastIndex)
  );
  if (trailingMarkdown) {
    blocks.push({ type: 'markdown', markdown: trailingMarkdown });
  }

  if (blocks.length === 0) {
    const strippedMarkdown = stripImageWidgetBlocks(markdown);
    if (strippedMarkdown) {
      blocks.push({ type: 'markdown', markdown: strippedMarkdown });
    }
  }

  const hasRenderedImages = blocks.some((block) => block.type === 'images');
  if (!hasRenderedImages && fallbackImages.length > 0) {
    blocks.push({
      type: 'images',
      widgetId: 'legacy-image-widget-images',
      images: fallbackImages,
    });
  }

  return blocks;
}

function formatPreviousDRCDate(sourceDate: string): string {
  const parsedDate = parseLocalDateSafe(sourceDate);
  if (!parsedDate) return sourceDate;

  return previousDRCDateFormatter.format(parsedDate);
}

export const PreviousTradingDayContextWidget: React.FC<PreviousTradingDayContextWidgetProps> =
  React.memo(({ filePath, plugin, config, preview }) => {
    const [context, setContext] =
      useState<PreviousTradingDayContextResult | null>(null);
    const [loading, setLoading] = useState(!preview);
    const [error, setError] = useState<string | null>(null);
    const markdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const componentRefs = useRef<Component[]>([]);

    const headings = useMemo(() => parseHeadings(config), [config]);
    const sectionBlocks = useMemo(
      () =>
        context?.sections.map((section) =>
          buildContentBlocks(
            section.markdown,
            section.imageWidgets,
            section.imageWidgetImages
          )
        ) ?? [],
      [context]
    );

    useEffect(() => {
      if (preview) return;

      let isMounted = true;
      const loadContext = async () => {
        setLoading(true);
        setError(null);
        try {
          const file = plugin.app.vault.getAbstractFileByPath(filePath);
          if (!(file instanceof TFile)) {
            if (isMounted) setError('Current DRC not found.');
            return;
          }

          await forceMetadataCacheRefresh(plugin.app, file);
          const frontmatter =
            plugin.app.metadataCache.getFileCache(file)?.frontmatter;
          const currentDate =
            typeof frontmatter?.date === 'string'
              ? parseLocalDateSafe(frontmatter.date)
              : null;
          if (!currentDate) {
            if (isMounted) setError('Current DRC date not found.');
            return;
          }

          const drcService = plugin.serviceManager
            ? await plugin.serviceManager.getDRCService()
            : plugin.drcService;
          const result = await drcService.getPreviousTradingDayContext(
            currentDate,
            headings,
            config?.fallbackMode ?? 'nearest-earlier'
          );
          if (isMounted) setContext(result);
        } catch (err) {
          console.error('Failed to load previous trading day context:', err);
          if (isMounted)
            setError('Failed to load previous trading day context.');
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      void loadContext();
      return () => {
        isMounted = false;
      };
    }, [config?.fallbackMode, filePath, headings, plugin, preview]);

    useEffect(() => {
      componentRefs.current.forEach((component) => component.unload());
      componentRefs.current = [];

      if (!context) return;

      sectionBlocks.forEach((blocks, sectionIndex) => {
        blocks.forEach((block, blockIndex) => {
          if (block.type !== 'markdown') return;
          const refKey = `${sectionIndex}-${blockIndex}`;
          const container = markdownRefs.current.get(refKey);
          if (!container) return;
          container.empty();
          if (!block.markdown) return;

          const component = new Component();
          component.load();
          componentRefs.current.push(component);
          void MarkdownRenderer.render(
            plugin.app,
            block.markdown,
            container,
            context.sourcePath,
            component
          );
        });
      });

      return () => {
        componentRefs.current.forEach((component) => component.unload());
        componentRefs.current = [];
      };
    }, [context, plugin.app, sectionBlocks]);

    const openSourceDRC = useCallback(async () => {
      if (!context) return;
      await plugin.app.workspace.openLinkText(context.sourcePath, filePath);
    }, [context, filePath, plugin.app.workspace]);

    const handleSourceHeaderKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLSpanElement>) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        void openSourceDRC();
      },
      [openSourceDRC]
    );

    const preventPreviousDRCFormMutation = useCallback(
      (event: React.SyntheticEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
      },
      []
    );

    if (preview) {
      const previewHeadings =
        headings.length > 0 ? headings : [PREVIEW_HEADING];

      return (
        <div className="journalit-previous-trading-day-context journalit-previous-drc-reference">
          <div className="journalit-previous-drc-reference-header">
            <div className="journalit-previous-drc-reference-title-group">
              <div className="journalit-previous-drc-reference-kicker">
                {t('widget.previous-trading-day-context.reference-label')}
              </div>
              <div className="journalit-previous-drc-reference-date">
                Friday, May 1, 2026
              </div>
            </div>
            <div className="journalit-previous-drc-reference-link">
              {t('widget.previous-trading-day-context.open-source')}
            </div>
          </div>
          <div className="journalit-previous-drc-reference-body">
            <div className="journalit-widget-empty">
              {t('widget.previous-trading-day-context.preview-source')}
            </div>
            {previewHeadings.map((heading) => (
              <section key={heading}>
                <h4>{heading}</h4>
                <p>{t('widget.previous-trading-day-context.preview-note')}</p>
                <ul>
                  <li>
                    {t(
                      'widget.previous-trading-day-context.preview-bullet-one'
                    )}
                  </li>
                  <li>
                    {t(
                      'widget.previous-trading-day-context.preview-bullet-two'
                    )}
                  </li>
                </ul>
              </section>
            ))}
            <div className="journalit-images-widget">
              <ImageCarousel
                images={[
                  createSvgPlaceholderDataUri(
                    700,
                    320,
                    '#1a1a2e',
                    '#eeeeee',
                    'Previous DRC Chart'
                  ),
                ]}
                altPrefix={t(
                  'widget.previous-trading-day-context.image-alt-prefix'
                )}
                showThumbnails={false}
                showCounter={false}
                enableDelete={false}
                enableFullscreen={false}
                useResolveMediaPath={true}
              />
            </div>
          </div>
        </div>
      );
    }

    if (!headings.length) {
      return (
        <div className="journalit-widget-empty">
          {t('widget.previous-trading-day-context.no-sections-configured')}
        </div>
      );
    }

    if (loading) {
      return (
        <div className="journalit-widget-loading">Loading previous DRC…</div>
      );
    }

    if (error) {
      return <div className="journalit-widget-empty">{error}</div>;
    }

    if (!context) {
      return (
        <div className="journalit-widget-empty">Previous DRC not found.</div>
      );
    }

    if (context.sections.length === 0) {
      return (
        <div className="journalit-widget-empty">
          No matching heading found in {context.sourceDate}.
        </div>
      );
    }

    return (
      <div className="journalit-previous-trading-day-context journalit-previous-drc-reference">
        <div className="journalit-previous-drc-reference-header">
          <div className="journalit-previous-drc-reference-title-group">
            <div className="journalit-previous-drc-reference-kicker">
              {t('widget.previous-trading-day-context.reference-label')}
            </div>
            <div className="journalit-previous-drc-reference-date">
              {formatPreviousDRCDate(context.sourceDate)}
            </div>
          </div>
          <span
            className="journalit-previous-drc-reference-link"
            role="link"
            tabIndex={0}
            onClick={() => void openSourceDRC()}
            onKeyDown={(event) => void handleSourceHeaderKeyDown(event)}
          >
            {t('widget.previous-trading-day-context.open-source')}
          </span>
        </div>
        <div className="journalit-previous-drc-reference-body">
          {context.sections.map((section, index) => {
            const blocks = sectionBlocks[index] || [];
            return (
              <section key={`${section.heading}-${section.level}`}>
                {React.createElement(
                  `h${Math.min(6, section.level + 1)}`,
                  null,
                  section.heading
                )}
                {blocks.map((block, blockIndex) => {
                  if (block.type === 'markdown') {
                    const refKey = `${index}-${blockIndex}`;
                    return (
                      <div
                        key={refKey}
                        className="journalit-previous-drc-rendered-markdown"
                        onInputCapture={preventPreviousDRCFormMutation}
                        onChangeCapture={preventPreviousDRCFormMutation}
                        onSubmitCapture={preventPreviousDRCFormMutation}
                        ref={(element) => {
                          if (element)
                            markdownRefs.current.set(refKey, element);
                          else markdownRefs.current.delete(refKey);
                        }}
                      />
                    );
                  }

                  return (
                    <div
                      key={`${block.widgetId}-${blockIndex}`}
                      className="journalit-images-widget"
                    >
                      <ImageCarousel
                        images={block.images}
                        altPrefix={t(
                          'widget.previous-trading-day-context.image-alt-prefix'
                        )}
                        showThumbnails={block.images.length > 1}
                        showCounter={block.images.length > 1}
                        enableDelete={false}
                        enableFullscreen={true}
                        useResolveMediaPath={true}
                        sourcePath={context.sourcePath}
                      />
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      </div>
    );
  });

PreviousTradingDayContextWidget.displayName = 'PreviousTradingDayContextWidget';
