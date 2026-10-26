import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { App } from 'obsidian';
import type JournalitPlugin from '../../main';
import type { TradeLogFilters } from '../../services/tradelog/types';
import { cssVars } from '../../styles/inlineStylePolicy';
import { t } from '../../lang/helpers';
import { FullscreenImageViewer } from '../image/FullscreenImageViewer';
import { MediaPreview } from '../image/MediaPreview';
import { FullscreenPortal } from '../image/FullscreenPortal';
import { PnLValue, RMultipleValue } from '../shared/display/DisplayValue';
import { SkeletonBox } from '../shared/SkeletonBox';
import { ImageAnnotationPanel } from '../shared/imageAnnotation/ImageAnnotationPanel';

import { Button } from '../ui/Button';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Image,
  Tag,
} from '../shared/icons/ObsidianIcon';
import type {
  ImageGalleryAnnotation,
  ImageGalleryGroup,
  ImageGalleryItem,
  ImageGallerySize,
  ImageGallerySourceType,
  ImageGalleryViewMode,
} from './types';
import {
  estimateImageGalleryGridMetrics,
  formatHoverTags,
  getImageGalleryCardDateLabel,
  getImageGalleryCardSourceLabel,
  getImageGalleryFullscreenTitle,
  getImageGalleryVirtualWindow,
  type ImageGalleryGridMetrics,
} from './ImageGalleryUtils';
import { hasFilterExclusions } from '../shared/filters/filterExclusions';

const IMAGE_GALLERY_SKELETON_KEYS = [
  'image-gallery-skeleton-1',
  'image-gallery-skeleton-2',
  'image-gallery-skeleton-3',
  'image-gallery-skeleton-4',
  'image-gallery-skeleton-5',
  'image-gallery-skeleton-6',
  'image-gallery-skeleton-7',
  'image-gallery-skeleton-8',
  'image-gallery-skeleton-9',
  'image-gallery-skeleton-10',
  'image-gallery-skeleton-11',
  'image-gallery-skeleton-12',
  'image-gallery-skeleton-13',
  'image-gallery-skeleton-14',
  'image-gallery-skeleton-15',
];

type ImageGalleryEmptyStateKind = 'no-images' | 'no-results' | 'no-source';

export const ImageGalleryEmptyState: React.FC<{
  kind?: ImageGalleryEmptyStateKind;
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  onShowAllImages?: () => void;
  registerTarget?: (element: HTMLElement | null) => void;
}> = ({
  kind = 'no-results',
  title,
  description,
  onClearFilters,
  onShowAllImages,
  registerTarget,
}) => {
  const resolvedTitle = title || getImageGalleryEmptyTitle(kind);
  const resolvedDescription =
    description || getImageGalleryEmptyDescription(kind);

  return (
    <section
      className="journalit-image-gallery-empty-state"
      ref={registerTarget}
      role="status"
    >
      <div className="journalit-image-gallery-empty-state__card">
        <div
          className="journalit-image-gallery-empty-state__icon"
          aria-hidden="true"
        >
          <Image size={56} />
        </div>
        <div className="journalit-image-gallery-empty-state__copy">
          <h2>{resolvedTitle}</h2>
          <p>{resolvedDescription}</p>
        </div>
        {kind !== 'no-images' && (onClearFilters || onShowAllImages) ? (
          <div className="journalit-image-gallery-empty-state__actions">
            {onClearFilters ? (
              <Button
                className="journalit-image-gallery-empty-state__button"
                onClick={onClearFilters}
                size="medium"
                variant="primary"
              >
                {t('imageGallery.empty.action.clear-filters')}
              </Button>
            ) : null}
            {kind === 'no-source' && onShowAllImages ? (
              <Button
                className="journalit-image-gallery-empty-state__button"
                onClick={onShowAllImages}
                size="medium"
                variant="secondary"
              >
                {t('imageGallery.empty.action.show-all')}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
};

ImageGalleryEmptyState.displayName = 'ImageGalleryEmptyState';

export function getImageGalleryEmptyStateKind(input: {
  allItemCount: number;
  visibleItemCount: number;
  sourceType: ImageGallerySourceType;
  tradeLogFilters: TradeLogFilters;
}): ImageGalleryEmptyStateKind {
  if (input.allItemCount === 0) return 'no-images';
  if (input.visibleItemCount > 0) return 'no-results';
  if (input.sourceType !== 'all') {
    return hasActiveTradeLogFilters(input.tradeLogFilters)
      ? 'no-results'
      : 'no-source';
  }

  return 'no-results';
}

function getImageGalleryCardHoverDetailsClass(
  item: Pick<ImageGalleryItem, 'tags' | 'notes' | 'reviewed'>
): string {
  return item.tags.length > 0 || item.notes || item.reviewed !== undefined
    ? ''
    : ' journalit-image-gallery-card--empty-hover';
}

function hasActiveTradeLogFilters(filters: TradeLogFilters): boolean {
  return (
    filters.accounts.length > 0 ||
    filters.tickers.length > 0 ||
    filters.setups.length > 0 ||
    filters.tags.length > 0 ||
    filters.mistakes.length > 0 ||
    filters.statuses.length > 0 ||
    filters.reviewStatus.length > 0 ||
    filters.directions.length > 0 ||
    filters.sessionLogTags.length > 0 ||
    filters.imageAnnotationStatus.length > 0 ||
    filters.imageTags.length > 0 ||
    filters.dateRange.some(Boolean) ||
    Object.values(filters.customFieldFilters).some(
      (values) => values.length > 0
    ) ||
    hasFilterExclusions(filters.exclusions) ||
    filters.tradeTypes.length < 3
  );
}

function getImageGalleryEmptyTitle(kind: ImageGalleryEmptyStateKind): string {
  switch (kind) {
    case 'no-images':
      return t('imageGallery.empty.no-images.title');
    case 'no-source':
      return t('imageGallery.empty.no-source.title');
    case 'no-results':
      return t('imageGallery.empty.no-results.title');
  }
}

function getImageGalleryEmptyDescription(
  kind: ImageGalleryEmptyStateKind
): string {
  switch (kind) {
    case 'no-images':
      return t('imageGallery.empty.no-images.description');
    case 'no-source':
      return t('imageGallery.empty.no-source.description');
    case 'no-results':
      return t('imageGallery.empty.no-results.description');
  }
}

export const ImageGalleryGrid: React.FC<{
  app: App;
  groups: ImageGalleryGroup[];
  size: ImageGallerySize;
  dateFormat?: string;
  useRMultiples: boolean;
  isPerformanceMasked: boolean;
  shouldBlurImages: boolean;
  viewport: { width: number; height: number; scrollTop: number };
  onOpenFullscreen: (itemId: string) => void;
  onOpenSource: (sourcePath: string) => void;
  registerGridTarget: (element: HTMLElement | null) => void;
}> = ({
  app,
  groups,
  size,
  dateFormat,
  useRMultiples,
  isPerformanceMasked,
  shouldBlurImages,
  viewport,
  onOpenFullscreen,
  onOpenSource,
  registerGridTarget,
}) => {
  const gridRef = useRef<HTMLElement | null>(null);
  const setGridElement = useCallback(
    (element: HTMLElement | null) => {
      gridRef.current = element;
      registerGridTarget(element);
    },
    [registerGridTarget]
  );
  const [measuredMetrics, setMeasuredMetrics] =
    useState<ImageGalleryGridMetrics | null>(null);
  
  
  
  
  useLayoutEffect(() => {
    const grid = gridRef.current!;
    const measure = () => {
      const nextMetrics = measureImageGalleryGrid(grid);
      if (!nextMetrics) return;
      setMeasuredMetrics((currentMetrics) =>
        currentMetrics && isSameGridMetrics(currentMetrics, nextMetrics)
          ? currentMetrics
          : nextMetrics
      );
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(grid);
    return () => resizeObserver.disconnect();
  }, [size]);
  const metrics =
    measuredMetrics ?? estimateImageGalleryGridMetrics(size, viewport.width);
  const virtualWindow = useMemo(
    () => getImageGalleryVirtualWindow(groups.length, metrics, viewport),
    [groups.length, metrics, viewport]
  );
  const renderedGroups = useMemo(
    () => groups.slice(virtualWindow.startIndex, virtualWindow.endIndex),
    [groups, virtualWindow.endIndex, virtualWindow.startIndex]
  );

  return (
    <section
      className={`journalit-image-gallery-grid journalit-image-gallery-grid--${size}`}
      ref={setGridElement}
    >
      {virtualWindow.topSpacerHeight > 0 ? (
        <div
          aria-hidden="true"
          className="journalit-image-gallery-virtual-spacer"
          style={cssVars({
            '--journalit-image-gallery-spacer-height': `${virtualWindow.topSpacerHeight}px`,
          })}
        />
      ) : null}
      {renderedGroups.map((group) => {
        return (
          <ImageGalleryCard
            app={app}
            dateFormat={dateFormat}
            group={group}
            isPerformanceMasked={isPerformanceMasked}
            key={group.id}
            onOpenFullscreen={onOpenFullscreen}
            onOpenSource={onOpenSource}
            shouldBlurImage={shouldBlurImages}
            size={size}
            useRMultiples={useRMultiples}
          />
        );
      })}
      {virtualWindow.bottomSpacerHeight > 0 ? (
        <div
          aria-hidden="true"
          className="journalit-image-gallery-virtual-spacer"
          style={cssVars({
            '--journalit-image-gallery-spacer-height': `${virtualWindow.bottomSpacerHeight}px`,
          })}
        />
      ) : null}
    </section>
  );
};

ImageGalleryGrid.displayName = 'ImageGalleryGrid';

function measureImageGalleryGrid(
  grid: HTMLElement
): ImageGalleryGridMetrics | null {
  const card = grid.querySelector('.journalit-image-gallery-card');
  if (!card) return null;
  const style = window.getComputedStyle(grid);
  
  const columnCount = style.gridTemplateColumns
    .split(' ')
    .filter(Boolean).length;
  const gap = Number.parseFloat(style.rowGap);
  if (columnCount === 0 || !Number.isFinite(gap)) return null;
  return {
    columnCount,
    rowHeight: card.getBoundingClientRect().height + gap,
    gap,
  };
}

function isSameGridMetrics(
  a: ImageGalleryGridMetrics,
  b: ImageGalleryGridMetrics
): boolean {
  return (
    a.columnCount === b.columnCount &&
    a.gap === b.gap &&
    Math.abs(a.rowHeight - b.rowHeight) < 0.01
  );
}

export const ImageGalleryFullscreen: React.FC<{
  item: ImageGalleryItem | null;
  items: ImageGalleryItem[];
  groups: ImageGalleryGroup[];
  annotationEditorItem: ImageGalleryItem | null;
  plugin: JournalitPlugin;
  currentIndex: number;
  dateFormat?: string;
  shouldBlurImages: boolean;
  viewMode: ImageGalleryViewMode;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onEditAnnotation: (item: ImageGalleryItem) => void;
  onCloseAnnotation: () => void;
  onSaveAnnotation: (
    item: ImageGalleryItem,
    annotation: ImageGalleryAnnotation
  ) => Promise<void>;
  onOpenSource: (sourcePath: string) => void;
  registerActionsTarget: (element: HTMLElement | null) => void;
  registerTagButtonTarget: (element: HTMLElement | null) => void;
  registerAnnotationPanelTarget: (element: HTMLElement | null) => void;
}> = ({
  item,
  items,
  groups,
  annotationEditorItem,
  plugin,
  currentIndex,
  dateFormat,
  shouldBlurImages,
  viewMode,
  onClose,
  onNavigate,
  onEditAnnotation,
  onCloseAnnotation,
  onSaveAnnotation,
  onOpenSource,
  registerActionsTarget,
  registerTagButtonTarget,
  registerAnnotationPanelTarget,
}) => (
  <FullscreenPortal
    className={
      shouldBlurImages
        ? 'journalit-image-gallery-fullscreen journalit-image-gallery-fullscreen--privacy'
        : 'journalit-image-gallery-fullscreen'
    }
    isOpen={item !== null}
    onClose={onClose}
    portalId="journalit-image-gallery-fullscreen-portal"
    title={item ? getImageGalleryFullscreenTitle(item, dateFormat) : ''}
  >
    {item ? (
      <div
        className={
          annotationEditorItem
            ? 'journalit-image-gallery-fullscreen-layout journalit-image-gallery-fullscreen-layout--annotating'
            : 'journalit-image-gallery-fullscreen-layout'
        }
        onClick={(event) => {
          event.stopPropagation();
          if (!isFullscreenInteractiveTarget(event.target)) {
            onClose();
          }
        }}
        onKeyDown={(event) => event.stopPropagation()}
        role="presentation"
      >
        <FullscreenImageViewer
          annotationOptions={{ enabled: false }}
          alt={getImageGalleryFullscreenTitle(item, dateFormat)}
          imagePath={item.imagePath}
          navigationContext={{
            images: items.map((galleryItem) => galleryItem.imagePath),
            currentIndex,
            onNavigate,
            altPrefix: item.sourceLabel,
            useResolveMediaPath: true,
            sourcePath: item.sourcePath,
            indicatorLabel:
              viewMode === 'grouped'
                ? getGroupedNavigationLabel(item, groups)
                : undefined,
          }}
          onClose={onClose}
          sourcePath={item.sourcePath}
          useResolveMediaPath
        />
        {annotationEditorItem ? (
          <ImageAnnotationPanel
            key={annotationEditorItem.id}
            plugin={plugin}
            imagePath={annotationEditorItem.imagePath}
            initialAnnotation={{
              tags: annotationEditorItem.tags,
              notes: annotationEditorItem.notes,
            }}
            onClose={onCloseAnnotation}
            onSave={(annotation) =>
              onSaveAnnotation(annotationEditorItem, annotation)
            }
            targetRef={registerAnnotationPanelTarget}
          />
        ) : null}
        <div
          className="journalit-image-gallery-fullscreen-actions"
          ref={registerActionsTarget}
        >
          <span ref={registerTagButtonTarget}>
            <Button
              className="journalit-image-gallery-open-source-button"
              onClick={() => onEditAnnotation(item)}
              variant="secondary"
              size="small"
            >
              <Tag size={14} />
              <span>{t('imageGallery.annotation.tag')}</span>
            </Button>
          </span>
          <Button
            className="journalit-image-gallery-open-source-button"
            onClick={() => onOpenSource(item.sourcePath)}
            variant="secondary"
            size="small"
          >
            <ExternalLink size={14} />
            <span>{t('imageGallery.open-source')}</span>
          </Button>
        </div>
      </div>
    ) : null}
  </FullscreenPortal>
);

ImageGalleryFullscreen.displayName = 'ImageGalleryFullscreen';

function isFullscreenInteractiveTarget(target: EventTarget): boolean {
  if (!(target instanceof Element)) return false;

  return Boolean(
    target.closest(
      [
        'button',
        'a',
        'input',
        'textarea',
        'select',
        '[role="button"]',
        '[role="menu"]',
        '.journalit-fullscreen-zoomable-image',
        '.journalit-fullscreen-zoomable-media',
        '.journalit-fullscreen-video-wrapper',
        '.journalit-fullscreen-youtube-wrapper',
        '.journalit-fullscreen-copy-menu',
        '.journalit-image-annotation-panel',
        '.journalit-image-gallery-fullscreen-actions',
      ].join(', ')
    )
  );
}

function getGroupedNavigationLabel(
  item: ImageGalleryItem,
  groups: ImageGalleryGroup[]
): string {
  const groupIndex = groups.findIndex((group) =>
    group.items.some((groupItem) => groupItem.id === item.id)
  );
  const group = groups[groupIndex];
  const mediaIndex = group.items.findIndex(
    (groupItem) => groupItem.id === item.id
  );

  return t('imageGallery.group.navigation', {
    mediaCurrent: String(mediaIndex + 1),
    mediaTotal: String(group.items.length),
    groupCurrent: String(groupIndex + 1),
    groupTotal: String(groups.length),
  });
}

const ImageGalleryCardHoverPanel: React.FC<{
  tags: string[];
  notes: string | undefined;
  reviewed: boolean | undefined;
}> = ({ tags, notes, reviewed }) => (
  <div className="journalit-image-gallery-card__hover-panel" aria-hidden="true">
    {tags.length > 0 ? (
      <div className="journalit-image-gallery-card__hover-tags">
        <Tag
          className="journalit-image-gallery-card__hover-tags-icon"
          size={13}
          aria-hidden="true"
        />
        <span className="journalit-image-gallery-card__hover-tag">
          {formatHoverTags(tags)}
        </span>
      </div>
    ) : null}
    {notes ? (
      <p className="journalit-image-gallery-card__hover-notes">{notes}</p>
    ) : null}
    {reviewed !== undefined ? (
      <div className="journalit-image-gallery-card__hover-footer">
        <span>
          {reviewed ? (
            <CheckCircle2
              className="journalit-image-gallery-card__reviewed-icon"
              size={15}
              aria-hidden="true"
            />
          ) : (
            <Circle size={15} aria-hidden="true" />
          )}
          {reviewed
            ? t('imageGallery.annotation.reviewed')
            : t('imageGallery.annotation.unreviewed')}
        </span>
      </div>
    ) : null}
  </div>
);

const performanceToneOf = (
  value: number,
  isMasked: boolean
): 'masked' | 'negative' | 'positive' | 'neutral' => {
  if (isMasked) return 'masked';
  if (value < 0) return 'negative';
  return value > 0 ? 'positive' : 'neutral';
};


const ImageGalleryCardValue: React.FC<{
  item: ImageGalleryGroup['items'][number];
  useRMultiples: boolean;
  isPerformanceMasked: boolean;
}> = ({ item, useRMultiples, isPerformanceMasked }) => {
  const performanceValue = useRMultiples ? item.rMultiple : item.pnl;
  if (item.sourceType !== 'trade' || performanceValue === undefined) {
    return (
      <span
        className="journalit-image-gallery-card__meta-spacer"
        aria-hidden="true"
      />
    );
  }
  return (
    <span
      className={`journalit-image-gallery-card__value journalit-image-gallery-card__value--${performanceToneOf(performanceValue, isPerformanceMasked)}`}
    >
      {useRMultiples ? (
        <RMultipleValue value={performanceValue} />
      ) : (
        <PnLValue value={performanceValue} />
      )}
    </span>
  );
};

const ImageGalleryCard = React.memo(function ImageGalleryCard({
  app,
  group,
  size,
  dateFormat,
  useRMultiples,
  isPerformanceMasked,
  shouldBlurImage,
  onOpenFullscreen,
  onOpenSource,
}: {
  app: App;
  group: ImageGalleryGroup;
  size: ImageGallerySize;
  dateFormat?: string;
  useRMultiples: boolean;
  isPerformanceMasked: boolean;
  shouldBlurImage: boolean;
  onOpenFullscreen: (itemId: string) => void;
  onOpenSource: (sourcePath: string) => void;
}) {
  const item = group.items[0];
  const additionalMediaCount = group.items.length - 1;
  const annotatedMediaCount = group.items.filter(
    (groupItem) => groupItem.tags.length > 0 || Boolean(groupItem.notes)
  ).length;
  const groupTags = Array.from(
    new Set(group.items.flatMap((groupItem) => groupItem.tags))
  );
  const annotationSummary = t('imageGallery.group.annotation-summary', {
    annotated: String(annotatedMediaCount),
    total: String(group.items.length),
  });
  const hasAnnotations = annotatedMediaCount > 0;
  
  const hoverNotes =
    group.items.length === 1
      ? item.notes
      : hasAnnotations
        ? annotationSummary
        : undefined;
  const cardDateLabel = getImageGalleryCardDateLabel(item, dateFormat);
  const hoverDetailsClass = getImageGalleryCardHoverDetailsClass({
    tags: groupTags,
    notes: hoverNotes,
    reviewed: item.reviewed,
  });
  const handleOpenFullscreen = useCallback(() => {
    onOpenFullscreen(item.id);
  }, [item.id, onOpenFullscreen]);

  return (
    <article
      className={`journalit-image-gallery-card journalit-image-gallery-card--${size}${hoverDetailsClass}`}
    >
      <button
        className="journalit-image-gallery-card__open"
        onClick={handleOpenFullscreen}
        type="button"
      >
        <div
          className={
            shouldBlurImage
              ? 'journalit-image-gallery-card__image-frame journalit-image-gallery-card__image-frame--blurred'
              : 'journalit-image-gallery-card__image-frame'
          }
        >
          <MediaPreview
            alt={t('imageGallery.image-alt', {
              source: item.sourceLabel,
              date: cardDateLabel,
            })}
            app={app}
            className="journalit-image-gallery-card__image"
            displayPath={item.imagePath}
            excalidrawClassName="journalit-image-gallery-card__image journalit-image-gallery-card__image--excalidraw"
            imageClassName="journalit-image-gallery-card__image"
            path={item.imagePath}
            sourcePath={item.sourcePath}
            videoClassName="journalit-image-gallery-card__image"
            videoPreload="metadata"
          />
          {additionalMediaCount > 0 ? (
            <span
              className="journalit-image-gallery-card__media-count"
              aria-label={t('imageGallery.group.additional-media', {
                count: String(additionalMediaCount),
              })}
            >
              +{additionalMediaCount}
            </span>
          ) : null}
          {hasAnnotations ? (
            <span
              className="journalit-image-gallery-card__annotation-marker"
              aria-label={annotationSummary}
            >
              <Tag size={15} aria-hidden="true" />
            </span>
          ) : null}
          <ImageGalleryCardHoverPanel
            tags={groupTags}
            notes={hoverNotes}
            reviewed={item.reviewed}
          />
          {shouldBlurImage ? (
            <span className="journalit-image-gallery-card__privacy-overlay">
              {t('imageGallery.privacy-blurred')}
            </span>
          ) : null}
        </div>
      </button>
      <div className="journalit-image-gallery-card__footer">
        <span className="journalit-image-gallery-card__ticker">
          {getImageGalleryCardSourceLabel(item)}
        </span>
        <span className="journalit-image-gallery-card__date">
          {cardDateLabel}
        </span>
        <ImageGalleryCardValue
          item={item}
          useRMultiples={useRMultiples}
          isPerformanceMasked={isPerformanceMasked}
        />
      </div>
      <button
        className="journalit-image-gallery-card__source-link"
        onClick={() => onOpenSource(item.sourcePath)}
        type="button"
      >
        <span>{t('imageGallery.open-source')}</span>
        <ExternalLink size={13} aria-hidden="true" />
      </button>
    </article>
  );
});

ImageGalleryCard.displayName = 'ImageGalleryCard';

export const ImageGallerySkeleton: React.FC<{ size: ImageGallerySize }> = ({
  size,
}) => (
  <section
    className={`journalit-image-gallery-grid journalit-image-gallery-grid--${size}`}
  >
    {IMAGE_GALLERY_SKELETON_KEYS.map((key) => (
      <SkeletonBox key={key} width="100%" height={260} borderRadius="14px" />
    ))}
  </section>
);

ImageGallerySkeleton.displayName = 'ImageGallerySkeleton';
