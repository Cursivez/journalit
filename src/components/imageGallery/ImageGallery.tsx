import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import type JournalitPlugin from '../../main';
import {
  ImageGalleryService,
  matchesImageGalleryTradeLogFilters,
} from '../../services/imageGallery';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { useEventBusMultiple } from '../../hooks/useEventBus';
import { t } from '../../lang/helpers';
import {
  useGuideAction,
  useGuideBackHandler,
  useGuideCurrentStepId,
  useGuideTarget,
} from '../../guides/GuideRuntimeLayer';
import {
  TRADE_LOG_IMAGE_GALLERY_ANNOTATION_OPENED_ACTION_ID,
  TRADE_LOG_IMAGE_GALLERY_ANNOTATION_PANEL_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_EMPTY_STATE_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_FULLSCREEN_ACTIONS_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_FULLSCREEN_OPENED_ACTION_ID,
  TRADE_LOG_IMAGE_GALLERY_GRID_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_TAG_BUTTON_TARGET_ID,
} from '../../guides/tradeLogGuideIds';
import type { EventName } from '../../services/events';
import type { TradeLogFilters } from '../../services/tradelog/types';
import {
  ImageGalleryEmptyState,
  ImageGalleryFullscreen,
  ImageGalleryGrid,
  ImageGallerySkeleton,
  getImageGalleryEmptyStateKind,
} from './ImageGalleryDisplay';
import {
  filterImageGalleryItemsBySource,
  groupImageGalleryItems,
  shouldUpdateImageGalleryViewport,
  sortImageGalleryItems,
} from './ImageGalleryUtils';
import type {
  ImageGalleryAnnotation,
  ImageGalleryItem,
  ImageGallerySize,
  ImageGallerySort,
  ImageGallerySourceType,
  ImageGalleryViewMode,
} from './types';

export interface ImageGalleryControls {
  sourceType: ImageGallerySourceType;
  size: ImageGallerySize;
  sort: ImageGallerySort;
  viewMode: ImageGalleryViewMode;
}

interface ImageGalleryProps extends ImageGalleryControls {
  plugin: JournalitPlugin;
  service: ImageGalleryService;
  tradeLogFilters: TradeLogFilters;
  onClearFilters: () => void;
  onShowAllImages: () => void;
  onItemCountChange?: (count: number) => void;
}

export const IMAGE_GALLERY_SOURCE_TYPES: ImageGallerySourceType[] = [
  'all',
  'trade',
  'reviews',
  'drc',
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
];
export const IMAGE_GALLERY_SIZES: ImageGallerySize[] = [
  'small',
  'medium',
  'large',
];
const IMAGE_GALLERY_CHANGE_EVENTS: EventName[] = [
  'trade:committed',
  'trade:changed',
  'missed-trade:changed',
  'backtest-trade:changed',
  'review:changed',
  'settings:changed',
  'options:changed',
  'account:changed',
  'folder-path:changed',
];

interface ImageGalleryState {
  items: ImageGalleryItem[];
  loading: boolean;
  loadError: string | null;
  viewport: { width: number; height: number; scrollTop: number };
}

type ImageGalleryAction =
  | { type: 'load-start' }
  | { type: 'load-success'; items: ImageGalleryItem[] }
  | { type: 'load-error'; error: string }
  | { type: 'viewport'; viewport: ImageGalleryState['viewport'] };

const INITIAL_IMAGE_GALLERY_STATE: ImageGalleryState = {
  items: [],
  loading: true,
  loadError: null,
  viewport: { width: 0, height: 0, scrollTop: 0 },
};

function useVisibleImageGallery(input: {
  items: ImageGalleryItem[];
  sort: ImageGallerySort;
  sourceType: ImageGallerySourceType;
  tradeLogFilters: TradeLogFilters;
  viewMode: ImageGalleryViewMode;
}) {
  const visibleItems = useMemo(
    () =>
      sortImageGalleryItems(
        filterImageGalleryItemsBySource(
          input.items.filter((item) =>
            matchesImageGalleryTradeLogFilters(item, input.tradeLogFilters)
          ),
          input.sourceType
        ),
        input.sort
      ),
    [input.items, input.sort, input.sourceType, input.tradeLogFilters]
  );
  const groups = useMemo(
    () => groupImageGalleryItems(visibleItems, input.viewMode),
    [input.viewMode, visibleItems]
  );
  const fullscreenItems = useMemo(
    () => groups.flatMap((group) => group.items),
    [groups]
  );

  return { visibleItems, groups, fullscreenItems };
}

function imageGalleryReducer(
  state: ImageGalleryState,
  action: ImageGalleryAction
): ImageGalleryState {
  switch (action.type) {
    case 'load-start':
      return { ...state, loading: true, loadError: null };
    case 'load-success':
      return { ...state, items: action.items, loading: false, loadError: null };
    case 'load-error':
      return { ...state, loading: false, loadError: action.error };
    case 'viewport':
      return { ...state, viewport: action.viewport };
  }
}

function useImageGalleryGuideTargets() {
  return {
    registerGridTarget: useGuideTarget(TRADE_LOG_IMAGE_GALLERY_GRID_TARGET_ID),
    registerEmptyStateTarget: useGuideTarget(
      TRADE_LOG_IMAGE_GALLERY_EMPTY_STATE_TARGET_ID
    ),
    registerFullscreenActionsTarget: useGuideTarget(
      TRADE_LOG_IMAGE_GALLERY_FULLSCREEN_ACTIONS_TARGET_ID
    ),
    registerTagButtonTarget: useGuideTarget(
      TRADE_LOG_IMAGE_GALLERY_TAG_BUTTON_TARGET_ID
    ),
    registerAnnotationPanelTarget: useGuideTarget(
      TRADE_LOG_IMAGE_GALLERY_ANNOTATION_PANEL_TARGET_ID
    ),
  };
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  plugin,
  service,
  tradeLogFilters,
  onClearFilters,
  onShowAllImages,
  onItemCountChange,
  sourceType,
  size,
  sort,
  viewMode,
}) => {
  const { shouldMask } = useDisplayFormatter();
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [annotationEditorItem, setAnnotationEditorItem] =
    useState<ImageGalleryItem | null>(null);
  const currentGuideStepId = useGuideCurrentStepId();
  const emitGuideAction = useGuideAction();
  const {
    registerGridTarget,
    registerEmptyStateTarget,
    registerFullscreenActionsTarget,
    registerTagButtonTarget,
    registerAnnotationPanelTarget,
  } = useImageGalleryGuideTargets();
  const [{ items, loading, loadError, viewport }, dispatch] = useReducer(
    imageGalleryReducer,
    INITIAL_IMAGE_GALLERY_STATE
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastFullscreenIndexRef = useRef(0);
  const viewportRef = useRef(INITIAL_IMAGE_GALLERY_STATE.viewport);
  const viewportFrameRef = useRef<number | null>(null);
  const serviceRef = useRef<ImageGalleryService | null>(service);
  const loadGenerationRef = useRef(0);

  const useRMultiples = plugin.settings.trade?.displayRMultiples ?? false;
  const dateFormat = plugin.settings.trade?.dateFormat;
  const isPerformanceMasked = shouldMask(useRMultiples ? 'rMultiple' : 'pnl');
  const shouldBlurImages = shouldMask('pnl') || shouldMask('rMultiple');

  const loadItems = useCallback(async () => {
    const loadGeneration = loadGenerationRef.current + 1;
    loadGenerationRef.current = loadGeneration;
    dispatch({ type: 'load-start' });
    try {
      const nextItems = await serviceRef.current!.getAllGalleryItems();
      if (loadGenerationRef.current !== loadGeneration) return;
      dispatch({ type: 'load-success', items: nextItems });
      onItemCountChange?.(nextItems.length);
    } catch (error) {
      if (loadGenerationRef.current !== loadGeneration) return;
      console.error('[ImageGallery] Failed to load image gallery:', error);
      dispatch({
        type: 'load-error',
        error: t('imageGallery.error.load-failed'),
      });
    }
  }, [onItemCountChange]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  useEventBusMultiple(IMAGE_GALLERY_CHANGE_EVENTS, () => {
    serviceRef.current?.invalidate();
    void loadItems();
  });
  useImageGalleryCustomFieldInvalidation(plugin, serviceRef, loadItems);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateViewport = () => {
      const style = window.getComputedStyle(container);
      const horizontalPadding =
        Number.parseFloat(style.paddingLeft) +
        Number.parseFloat(style.paddingRight);
      const nextViewport = {
        width: Math.max(0, container.clientWidth - horizontalPadding),
        height: container.clientHeight,
        scrollTop: container.scrollTop,
      };
      const previousViewport = viewportRef.current;
      if (
        !shouldUpdateImageGalleryViewport(previousViewport, nextViewport, size)
      ) {
        return;
      }

      viewportRef.current = nextViewport;
      dispatch({ type: 'viewport', viewport: nextViewport });
    };

    const scheduleViewportUpdate = () => {
      if (viewportFrameRef.current !== null) return;
      viewportFrameRef.current = window.requestAnimationFrame(() => {
        viewportFrameRef.current = null;
        updateViewport();
      });
    };

    updateViewport();
    const resizeObserver = new ResizeObserver(updateViewport);
    resizeObserver.observe(container);
    container.addEventListener('scroll', scheduleViewportUpdate, {
      passive: true,
    });

    return () => {
      if (viewportFrameRef.current !== null) {
        window.cancelAnimationFrame(viewportFrameRef.current);
        viewportFrameRef.current = null;
      }
      resizeObserver.disconnect();
      container.removeEventListener('scroll', scheduleViewportUpdate);
    };
  }, [size]);

  const {
    visibleItems,
    groups: visibleGroups,
    fullscreenItems,
  } = useVisibleImageGallery({
    items,
    sort,
    sourceType,
    tradeLogFilters,
    viewMode,
  });
  const fullscreenItem =
    fullscreenIndex === null
      ? null
      : (fullscreenItems[fullscreenIndex] ?? null);
  const emptyStateKind = getImageGalleryEmptyStateKind({
    allItemCount: items.length,
    visibleItemCount: visibleItems.length,
    sourceType,
    tradeLogFilters,
  });

  const handleOpenSource = useCallback(
    (sourcePath: string) => {
      setFullscreenIndex(null);
      setAnnotationEditorItem(null);
      void plugin.openFile(sourcePath, true);
    },
    [plugin]
  );

  const handleSaveAnnotation = useCallback(
    async (item: ImageGalleryItem, annotation: ImageGalleryAnnotation) => {
      await serviceRef.current!.updateImageAnnotation(
        item.sourcePath,
        item.imagePath,
        annotation
      );
      setAnnotationEditorItem(null);
      await loadItems();
    },
    [loadItems]
  );

  const handleCloseFullscreen = useCallback(() => {
    setFullscreenIndex(null);
    setAnnotationEditorItem(null);
  }, []);

  const handleOpenFullscreen = useCallback(
    (itemId: string) => {
      const index = fullscreenItems.findIndex((item) => item.id === itemId);
      if (index < 0) return;
      lastFullscreenIndexRef.current = index;
      setFullscreenIndex(index);
      emitGuideAction(TRADE_LOG_IMAGE_GALLERY_FULLSCREEN_OPENED_ACTION_ID);
    },
    [emitGuideAction, fullscreenItems]
  );

  const handleEditAnnotation = useCallback(
    (item: ImageGalleryItem) => {
      setAnnotationEditorItem(item);
      emitGuideAction(TRADE_LOG_IMAGE_GALLERY_ANNOTATION_OPENED_ACTION_ID);
    },
    [emitGuideAction]
  );

  const handleNavigateFullscreen = useCallback(
    (index: number) => {
      lastFullscreenIndexRef.current = index;
      setFullscreenIndex(index);
      if (annotationEditorItem) {
        setAnnotationEditorItem(fullscreenItems[index] ?? null);
      }
    },
    [annotationEditorItem, fullscreenItems]
  );

  useEffect(() => {
    if (currentGuideStepId === 'gallery-finish') {
      handleCloseFullscreen();
    }
  }, [currentGuideStepId, handleCloseFullscreen]);

  const handleGuideBack = useCallback(
    ({ toStepId }: { toStepId: string }) => {
      if (toStepId === 'gallery-grid') {
        handleCloseFullscreen();
        return;
      }

      if (toStepId === 'gallery-annotation-panel') {
        const itemIndex = Math.min(
          lastFullscreenIndexRef.current,
          Math.max(fullscreenItems.length - 1, 0)
        );
        const item = fullscreenItems[itemIndex] ?? null;
        if (item) {
          setFullscreenIndex(itemIndex);
          setAnnotationEditorItem(item);
        }
        return;
      }

      if (toStepId === 'gallery-open-annotation') {
        setAnnotationEditorItem(null);
      }
    },
    [fullscreenItems, handleCloseFullscreen]
  );

  useGuideBackHandler(handleGuideBack);

  return (
    <div className="journalit-image-gallery-page" ref={scrollContainerRef}>
      {loading ? (
        <ImageGallerySkeleton size={size} />
      ) : loadError ? (
        <ImageGalleryEmptyState
          description={loadError}
          title={t('imageGallery.empty.error.title')}
        />
      ) : items.length === 0 ? (
        <ImageGalleryEmptyState
          kind="no-images"
          registerTarget={registerEmptyStateTarget}
        />
      ) : visibleItems.length === 0 ? (
        <ImageGalleryEmptyState
          kind={emptyStateKind}
          onClearFilters={onClearFilters}
          registerTarget={registerEmptyStateTarget}
          onShowAllImages={onShowAllImages}
        />
      ) : (
        <ImageGalleryGrid
          app={plugin.app}
          dateFormat={dateFormat}
          groups={visibleGroups}
          isPerformanceMasked={isPerformanceMasked}
          onOpenFullscreen={handleOpenFullscreen}
          onOpenSource={handleOpenSource}
          registerGridTarget={registerGridTarget}
          shouldBlurImages={shouldBlurImages}
          size={size}
          useRMultiples={useRMultiples}
          viewport={viewport}
        />
      )}

      <ImageGalleryFullscreen
        currentIndex={fullscreenIndex ?? 0}
        dateFormat={dateFormat}
        groups={visibleGroups}
        item={fullscreenItem}
        items={fullscreenItems}
        annotationEditorItem={annotationEditorItem}
        plugin={plugin}
        onClose={handleCloseFullscreen}
        onNavigate={handleNavigateFullscreen}
        onEditAnnotation={handleEditAnnotation}
        onCloseAnnotation={() => setAnnotationEditorItem(null)}
        onSaveAnnotation={handleSaveAnnotation}
        onOpenSource={handleOpenSource}
        registerActionsTarget={registerFullscreenActionsTarget}
        registerTagButtonTarget={registerTagButtonTarget}
        registerAnnotationPanelTarget={registerAnnotationPanelTarget}
        shouldBlurImages={shouldBlurImages}
        viewMode={viewMode}
      />
    </div>
  );
};

ImageGallery.displayName = 'ImageGallery';

function useImageGalleryCustomFieldInvalidation(
  plugin: JournalitPlugin,
  serviceRef: React.RefObject<ImageGalleryService | null>,
  loadItems: () => Promise<void>
): void {
  useEffect(() => {
    const handleCustomFieldsChanged = () => {
      serviceRef.current?.invalidate();
      void loadItems();
    };

    plugin.app.workspace.on(
      'journalit-custom-fields-changed',
      handleCustomFieldsChanged
    );

    return () => {
      plugin.app.workspace.off(
        'journalit-custom-fields-changed',
        handleCustomFieldsChanged
      );
    };
  }, [loadItems, plugin.app.workspace, serviceRef]);
}

export {
  getImageGallerySizeLabel,
  getImageGallerySortLabel,
  getImageGallerySourceTypeLabel,
  normalizeImageGallerySize,
  normalizeImageGallerySort,
  normalizeImageGallerySourceType,
  normalizeImageGalleryViewMode,
} from './ImageGalleryUtils';
