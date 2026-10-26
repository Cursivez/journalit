import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import type JournalitPlugin from '../../main';
import { ImageGalleryService } from '../../services/imageGallery/ImageGalleryService';
import { matchesImageGalleryTradeLogFilters } from '../../services/imageGallery/ImageGalleryFilters';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { useEventBus, useEventBusMultiple } from '../../hooks/useEventBus';
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
  reconcileImageGalleryIndex,
  reconcileImageGalleryItem,
  shouldReloadImageGalleryForSettingsChange,
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
  'folder',
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
  'trade-data:changed',
  'missed-trade-data:changed',
  'backtest-trade:changed',
  'review:changed',
  'options:changed',
  'account:changed',
  'folder-path:changed',
  'image-gallery:changed',
];


const IMAGE_GALLERY_RELOAD_BATCH_MS = 150;

interface ImageGalleryState {
  items: ImageGalleryItem[];
  totalItemCount: number;
  
  hasLoaded: boolean;
  loadError: string | null;
  viewport: { width: number; height: number; scrollTop: number };
}

type ImageGalleryAction =
  | { type: 'load-start' }
  | {
      type: 'load-success';
      items: ImageGalleryItem[];
      totalItemCount: number;
    }
  | { type: 'load-error'; error: string }
  | { type: 'viewport'; viewport: ImageGalleryState['viewport'] };

const INITIAL_IMAGE_GALLERY_STATE: ImageGalleryState = {
  items: [],
  totalItemCount: 0,
  hasLoaded: false,
  loadError: null,
  viewport: { width: 0, height: 0, scrollTop: 0 },
};

interface VisibleImageGalleryInput {
  items: ImageGalleryItem[];
  sort: ImageGallerySort;
  sourceType: ImageGallerySourceType;
  tradeLogFilters: TradeLogFilters;
  viewMode: ImageGalleryViewMode;
}

function projectVisibleImageGallery(input: VisibleImageGalleryInput) {
  const visibleItems = sortImageGalleryItems(
    filterImageGalleryItemsBySource(
      input.items.filter((item) =>
        matchesImageGalleryTradeLogFilters(item, input.tradeLogFilters)
      ),
      input.sourceType
    ),
    input.sort
  );
  const groups = groupImageGalleryItems(visibleItems, input.viewMode);
  const fullscreenItems = groups.flatMap((group) => group.items);

  return { visibleItems, groups, fullscreenItems };
}

function useVisibleImageGallery(input: VisibleImageGalleryInput) {
  const { items, sort, sourceType, tradeLogFilters, viewMode } = input;
  return useMemo(
    () =>
      projectVisibleImageGallery({
        items,
        sort,
        sourceType,
        tradeLogFilters,
        viewMode,
      }),
    [items, sort, sourceType, tradeLogFilters, viewMode]
  );
}

function imageGalleryReducer(
  state: ImageGalleryState,
  action: ImageGalleryAction
): ImageGalleryState {
  switch (action.type) {
    case 'load-start':
      return state.hasLoaded ? state : { ...state, loadError: null };
    case 'load-success':
      return {
        ...state,
        items: action.items,
        totalItemCount: action.totalItemCount,
        hasLoaded: true,
        loadError: null,
      };
    case 'load-error':
      return { ...state, loadError: action.error };
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

const galleryTradeSettings = (plugin: ImageGalleryProps['plugin']) => ({
  useRMultiples: plugin.settings.trade?.displayRMultiples ?? false,
  dateFormat: plugin.settings.trade?.dateFormat,
});


const galleryMasking = (
  shouldMask: (kind: string) => boolean,
  useRMultiples: boolean
) => ({
  isPerformanceMasked: shouldMask(useRMultiples ? 'rMultiple' : 'pnl'),
  shouldBlurImages: shouldMask('pnl') || shouldMask('rMultiple'),
});

const itemAtIndex = <T,>(
  items: readonly T[],
  index: number | null
): T | null => (index === null ? null : (items[index] ?? null));

const ImageGalleryContent: React.FC<{
  loading: boolean;
  loadError: string | null;
  totalItemCount: number;
  visibleItemCount: number;
  emptyStateKind: React.ComponentProps<typeof ImageGalleryEmptyState>['kind'];
  registerEmptyStateTarget: React.ComponentProps<
    typeof ImageGalleryEmptyState
  >['registerTarget'];
  onClearFilters: ImageGalleryProps['onClearFilters'];
  onShowAllImages: ImageGalleryProps['onShowAllImages'];
  grid: React.ComponentProps<typeof ImageGalleryGrid>;
}> = ({
  loading,
  loadError,
  totalItemCount,
  visibleItemCount,
  emptyStateKind,
  registerEmptyStateTarget,
  onClearFilters,
  onShowAllImages,
  grid,
}) => {
  if (loading) return <ImageGallerySkeleton size={grid.size} />;
  if (loadError) {
    return (
      <ImageGalleryEmptyState
        description={loadError}
        title={t('imageGallery.empty.error.title')}
      />
    );
  }
  if (totalItemCount === 0) {
    return (
      <ImageGalleryEmptyState
        kind="no-images"
        registerTarget={registerEmptyStateTarget}
      />
    );
  }
  if (visibleItemCount === 0) {
    return (
      <ImageGalleryEmptyState
        kind={emptyStateKind}
        onClearFilters={onClearFilters}
        registerTarget={registerEmptyStateTarget}
        onShowAllImages={onShowAllImages}
      />
    );
  }
  return <ImageGalleryGrid {...grid} />;
};

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
  const [{ items, totalItemCount, hasLoaded, loadError, viewport }, dispatch] =
    useReducer(imageGalleryReducer, INITIAL_IMAGE_GALLERY_STATE);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastFullscreenIndexRef = useRef(0);
  const viewportRef = useRef(INITIAL_IMAGE_GALLERY_STATE.viewport);
  const viewportFrameRef = useRef<number | null>(null);
  const serviceRef = useRef<ImageGalleryService | null>(service);
  const { loadItems, fullscreenItemIdRef } = useImageGalleryLoader({
    serviceRef,
    dispatch,
    setAnnotationEditorItem,
    setFullscreenIndex,
    onItemCountChange,
    sort,
    sourceType,
    tradeLogFilters,
    viewMode,
  });

  const { useRMultiples, dateFormat } = galleryTradeSettings(plugin);
  const { isPerformanceMasked, shouldBlurImages } = galleryMasking(
    shouldMask,
    useRMultiples
  );

  useEffect(() => {
    void loadItems();
  }, [loadItems, tradeLogFilters]);

  const scheduleReload = useBatchedImageGalleryReload(loadItems);
  useImageGalleryInvalidation(
    serviceRef,
    scheduleReload,
    tradeLogFilters.sessionLogTags.length > 0
  );
  useImageGalleryCustomFieldInvalidation(plugin, serviceRef, scheduleReload);

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
  const fullscreenItem = itemAtIndex(fullscreenItems, fullscreenIndex);
  fullscreenItemIdRef.current = fullscreenItem?.id ?? null;
  const emptyStateKind = getImageGalleryEmptyStateKind({
    allItemCount: totalItemCount,
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
        annotation,
        item.sourceType
      );
      setAnnotationEditorItem((currentItem) =>
        currentItem?.id === item.id ? null : currentItem
      );
      await loadItems();
    },
    [loadItems]
  );

  const handleCloseFullscreen = useCallback(() => {
    fullscreenItemIdRef.current = null;
    setFullscreenIndex(null);
    setAnnotationEditorItem(null);
  }, [fullscreenItemIdRef]);

  const handleOpenFullscreen = useCallback(
    (itemId: string) => {
      const index = fullscreenItems.findIndex((item) => item.id === itemId);
      if (index < 0) return;
      lastFullscreenIndexRef.current = index;
      fullscreenItemIdRef.current = itemId;
      setFullscreenIndex(index);
      emitGuideAction(TRADE_LOG_IMAGE_GALLERY_FULLSCREEN_OPENED_ACTION_ID);
    },
    [emitGuideAction, fullscreenItemIdRef, fullscreenItems]
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
      fullscreenItemIdRef.current = fullscreenItems[index]?.id ?? null;
      setFullscreenIndex(index);
      if (annotationEditorItem) {
        setAnnotationEditorItem(fullscreenItems[index] ?? null);
      }
    },
    [annotationEditorItem, fullscreenItemIdRef, fullscreenItems]
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
          fullscreenItemIdRef.current = item.id;
          setFullscreenIndex(itemIndex);
          setAnnotationEditorItem(item);
        }
        return;
      }

      if (toStepId === 'gallery-open-annotation') {
        setAnnotationEditorItem(null);
      }
    },
    [fullscreenItemIdRef, fullscreenItems, handleCloseFullscreen]
  );

  const handleCloseAnnotation = useCallback(() => {
    setAnnotationEditorItem(null);
  }, []);

  useGuideBackHandler(handleGuideBack);

  return (
    <div className="journalit-image-gallery-page" ref={scrollContainerRef}>
      <ImageGalleryContent
        loading={!hasLoaded && loadError === null}
        loadError={loadError}
        totalItemCount={totalItemCount}
        visibleItemCount={visibleItems.length}
        emptyStateKind={emptyStateKind}
        registerEmptyStateTarget={registerEmptyStateTarget}
        onClearFilters={onClearFilters}
        onShowAllImages={onShowAllImages}
        grid={{
          app: plugin.app,
          dateFormat,
          groups: visibleGroups,
          isPerformanceMasked,
          onOpenFullscreen: handleOpenFullscreen,
          onOpenSource: handleOpenSource,
          registerGridTarget,
          shouldBlurImages,
          size,
          useRMultiples,
          viewport,
        }}
      />

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
        onCloseAnnotation={handleCloseAnnotation}
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

function useImageGalleryLoader(input: {
  serviceRef: React.RefObject<ImageGalleryService | null>;
  dispatch: React.Dispatch<ImageGalleryAction>;
  setAnnotationEditorItem: React.Dispatch<
    React.SetStateAction<ImageGalleryItem | null>
  >;
  setFullscreenIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onItemCountChange?: (count: number) => void;
  sort: ImageGallerySort;
  sourceType: ImageGallerySourceType;
  tradeLogFilters: TradeLogFilters;
  viewMode: ImageGalleryViewMode;
}): {
  loadItems: () => Promise<void>;
  fullscreenItemIdRef: React.RefObject<string | null>;
} {
  const {
    serviceRef,
    dispatch,
    setAnnotationEditorItem,
    setFullscreenIndex,
    onItemCountChange,
    sort,
    sourceType,
    tradeLogFilters,
    viewMode,
  } = input;
  const loadGenerationRef = useRef(0);
  const fullscreenItemIdRef = useRef<string | null>(null);
  const presentationRef = useRef({
    sort,
    sourceType,
    tradeLogFilters,
    viewMode,
  });
  useLayoutEffect(() => {
    presentationRef.current = {
      sort,
      sourceType,
      tradeLogFilters,
      viewMode,
    };
  }, [sort, sourceType, tradeLogFilters, viewMode]);

  const loadItems = useCallback(async () => {
    const loadGeneration = loadGenerationRef.current + 1;
    loadGenerationRef.current = loadGeneration;
    dispatch({ type: 'load-start' });
    try {
      const { items: nextItems, totalItemCount } =
        await serviceRef.current!.getItemsWithTotal(
          presentationRef.current.tradeLogFilters
        );
      if (loadGenerationRef.current !== loadGeneration) return;
      dispatch({
        type: 'load-success',
        items: nextItems,
        totalItemCount,
      });
      setAnnotationEditorItem((currentItem) =>
        reconcileImageGalleryItem(currentItem, nextItems)
      );
      const currentFullscreenItemId = fullscreenItemIdRef.current;
      if (currentFullscreenItemId) {
        const nextFullscreenItems = projectVisibleImageGallery({
          items: nextItems,
          ...presentationRef.current,
        }).fullscreenItems;
        const nextFullscreenIndex = reconcileImageGalleryIndex(
          currentFullscreenItemId,
          nextFullscreenItems
        );
        setFullscreenIndex(nextFullscreenIndex);
        if (nextFullscreenIndex === null) {
          fullscreenItemIdRef.current = null;
          setAnnotationEditorItem(null);
        }
      }
      onItemCountChange?.(totalItemCount);
    } catch (error) {
      if (loadGenerationRef.current !== loadGeneration) return;
      console.error('[ImageGallery] Failed to load image gallery:', error);
      dispatch({
        type: 'load-error',
        error: t('imageGallery.error.load-failed'),
      });
    }
  }, [
    dispatch,
    onItemCountChange,
    serviceRef,
    setAnnotationEditorItem,
    setFullscreenIndex,
  ]);

  return { loadItems, fullscreenItemIdRef };
}


function useBatchedImageGalleryReload(
  loadItems: () => Promise<void>
): () => void {
  const timerRef = useRef<number | null>(null);
  const loadItemsRef = useRef(loadItems);
  useLayoutEffect(() => {
    loadItemsRef.current = loadItems;
  }, [loadItems]);
  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    []
  );

  return useCallback(() => {
    if (timerRef.current !== null) return;
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      void loadItemsRef.current();
    }, IMAGE_GALLERY_RELOAD_BATCH_MS);
  }, []);
}

function useImageGalleryInvalidation(
  serviceRef: React.RefObject<ImageGalleryService | null>,
  scheduleReload: () => void,
  sessionLogFilterActive: boolean
): void {
  const invalidateAndReload = useCallback(() => {
    serviceRef.current?.invalidate();
    scheduleReload();
  }, [scheduleReload, serviceRef]);
  useEventBusMultiple(IMAGE_GALLERY_CHANGE_EVENTS, invalidateAndReload);
  useEventBus('drc:session-log-index-invalidated', () => {
    if (!sessionLogFilterActive) return;
    scheduleReload();
  });
  useEventBus('settings:changed', (payload) => {
    
    if (!shouldReloadImageGalleryForSettingsChange(payload)) return;
    invalidateAndReload();
  });
}

function useImageGalleryCustomFieldInvalidation(
  plugin: JournalitPlugin,
  serviceRef: React.RefObject<ImageGalleryService | null>,
  scheduleReload: () => void
): void {
  useEffect(() => {
    const handleCustomFieldsChanged = () => {
      serviceRef.current?.invalidate();
      scheduleReload();
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
  }, [plugin.app.workspace, scheduleReload, serviceRef]);
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
