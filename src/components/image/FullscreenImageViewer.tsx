

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Notice } from 'obsidian';
import { FullscreenImageViewerProps, ImageZoomState } from '../../types/image';
import { imageService } from '../../services/image/ImageService';
import { t } from '../../lang/helpers';
import { cssVars, dndKitStyle } from '../../styles/inlineStylePolicy';
import {
  Check,
  Copy,
  LeftArrow,
  RightArrow,
} from '../shared/icons/ObsidianIcon';
import {
  canWriteClipboardItems,
  writeClipboardImage,
} from '../../utils/clipboard';
import { getApp } from '../../utils/obsidian';
import {
  getClipboardReadyImageBlob,
  getClipboardReadyRenderedImageBlob,
  getClipboardReadySvgBlob,
} from '../../utils/imageClipboard';
import {
  getMediaKind,
  isExcalidrawMediaPath,
  resolveMediaDisplayPath,
} from '../../utils/imageMediaUtils';
import { ExcalidrawMediaEmbed } from './ExcalidrawMediaEmbed';
import { FullscreenVideoPlayer } from './FullscreenVideoPlayer';
import { FullscreenYouTubeEmbed } from './FullscreenYouTubeEmbed';

const PAN_CLICK_SUPPRESSION_THRESHOLD = 2;

interface FullscreenContextMenuState {
  x: number;
  y: number;
  status: 'idle' | 'copied';
}

const createInitialZoomState = (): ImageZoomState => ({
  isZoomed: false,
  scale: 1.0,
  panOffset: { x: 0, y: 0 },
  isPanning: false,
  lastMousePos: { x: 0, y: 0 },
  initialPinchDistance: null,
  initialPinchScale: 1.0,
});


function useFullscreenImageViewerModel({
  imagePath,
  useResolveMediaPath,
  sourcePath = '',
  navigationContext,
}: Pick<
  FullscreenImageViewerProps,
  'imagePath' | 'useResolveMediaPath' | 'sourcePath' | 'navigationContext'
>) {
  
  const [zoomState, setZoomState] = useState<ImageZoomState>(
    createInitialZoomState
  );
  const [contextMenu, setContextMenu] =
    useState<FullscreenContextMenuState | null>(null);

  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextMenuCloseTimeoutRef = useRef<number | null>(null);

  
  const suppressNextClickRef = useRef(false);
  const didPanDuringGestureRef = useRef(false);

  
  const resolvedSourcePath = navigationContext?.sourcePath ?? sourcePath;
  const isExcalidraw = isExcalidrawMediaPath(
    getApp(),
    imagePath,
    resolvedSourcePath
  );
  const mediaKind = getMediaKind(getApp(), imagePath, resolvedSourcePath);
  const displayPath = resolveMediaDisplayPath(
    getApp(),
    imagePath,
    resolvedSourcePath
  );
  const imageUrl = isExcalidraw
    ? ''
    : useResolveMediaPath
      ? imageService.resolveMediaPath(displayPath)
      : imageService.getResourceUrl(displayPath);

  useEffect(() => {
    suppressNextClickRef.current = false;
    didPanDuringGestureRef.current = false;
    if (contextMenuCloseTimeoutRef.current !== null) {
      window.clearTimeout(contextMenuCloseTimeoutRef.current);
      contextMenuCloseTimeoutRef.current = null;
    }
    setContextMenu(null);
    setZoomState(createInitialZoomState());
  }, [imagePath]);

  useEffect(
    () => () => {
      if (contextMenuCloseTimeoutRef.current !== null) {
        window.clearTimeout(contextMenuCloseTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!contextMenu) return;

    const closeContextMenu = (event: MouseEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest('.journalit-fullscreen-copy-menu')
      ) {
        return;
      }

      setContextMenu(null);
    };
    window.activeDocument.addEventListener('click', closeContextMenu);
    window.activeDocument.addEventListener('contextmenu', closeContextMenu);
    return () => {
      window.activeDocument.removeEventListener('click', closeContextMenu);
      window.activeDocument.removeEventListener(
        'contextmenu',
        closeContextMenu
      );
    };
  }, [contextMenu]);

  const toggleZoom = useCallback(() => {
    
    if (zoomState.isPanning) return;

    setZoomState((prev) => {
      const newIsZoomed = !prev.isZoomed;
      return {
        ...prev,
        isZoomed: newIsZoomed,
        scale: newIsZoomed ? 2.0 : 1.0, 
        panOffset: { x: 0, y: 0 }, 
        isPanning: false,
      };
    });
  }, [zoomState.isPanning]);

  
  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      
      if (suppressNextClickRef.current) {
        suppressNextClickRef.current = false;
        return;
      }

      toggleZoom();
    },
    [toggleZoom]
  );

  const copyImageToClipboard = useCallback(async () => {
    if (contextMenuCloseTimeoutRef.current !== null) {
      window.clearTimeout(contextMenuCloseTimeoutRef.current);
      contextMenuCloseTimeoutRef.current = null;
    }

    if (!canWriteClipboardItems()) {
      setContextMenu(null);
      new Notice(t('image.viewer.copy-unsupported'));
      return;
    }

    try {
      const app = getApp();
      const excalidrawSvg = isExcalidraw
        ? containerRef.current?.querySelector<SVGSVGElement>(
            '.journalit-excalidraw-media__embed svg'
          )
        : null;
      const excalidrawImage = isExcalidraw
        ? containerRef.current?.querySelector<HTMLImageElement>(
            '.journalit-excalidraw-media__embed img'
          )
        : null;
      if (isExcalidraw && !excalidrawSvg && !excalidrawImage) {
        throw new Error('Rendered Excalidraw image is unavailable');
      }

      const blob = excalidrawSvg
        ? await getClipboardReadySvgBlob(excalidrawSvg)
        : excalidrawImage
          ? await getClipboardReadyRenderedImageBlob(excalidrawImage)
          : await getClipboardReadyImageBlob({
              app,
              imagePath,
              sourcePath: resolvedSourcePath,
              imageUrl,
            });
      await writeClipboardImage(blob);
      setContextMenu((current) =>
        current ? { ...current, status: 'copied' } : current
      );
      contextMenuCloseTimeoutRef.current = window.setTimeout(() => {
        setContextMenu(null);
        contextMenuCloseTimeoutRef.current = null;
      }, 900);
    } catch (error) {
      setContextMenu(null);
      console.error('Failed to copy image to clipboard:', error);
      new Notice(t('image.viewer.copy-failed'));
    }
  }, [imagePath, imageUrl, isExcalidraw, resolvedSourcePath]);

  const handleImageContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (mediaKind === 'video') return;
      e.preventDefault();
      e.stopPropagation();

      setContextMenu({ x: e.clientX, y: e.clientY, status: 'idle' });
    },
    [mediaKind]
  );

  
  const handlePanStart = useCallback(
    (e: React.MouseEvent) => {
      
      if (zoomState.scale <= 1) return;

      e.preventDefault();
      e.stopPropagation();

      didPanDuringGestureRef.current = false;

      setZoomState((prev) => ({
        ...prev,
        isPanning: true,
        lastMousePos: { x: e.clientX, y: e.clientY },
      }));
    },
    [zoomState.scale]
  );

  
  const handlePanEnd = useCallback(() => {
    if (didPanDuringGestureRef.current) {
      suppressNextClickRef.current = true;
      didPanDuringGestureRef.current = false;
    }

    setZoomState((prev) => ({
      ...prev,
      isPanning: false,
    }));
  }, []);

  
  const handleNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      if (!navigationContext) return;

      const { images, currentIndex, onNavigate } = navigationContext;
      let newIndex = currentIndex;

      if (direction === 'prev') {
        newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      } else {
        newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      }

      onNavigate(newIndex);
    },
    [navigationContext]
  );

  
  useEffect(() => {
    if (mediaKind === 'video') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        handleNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        handleNavigate('next');
      }
    };

    window.activeDocument.addEventListener('keydown', handleKeyDown);
    return () =>
      window.activeDocument.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigate, mediaKind]);

  
  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    setZoomState((prev) => {
      if (!prev.isPanning || prev.scale <= 1) return prev;

      const deltaX = e.clientX - prev.lastMousePos.x;
      const deltaY = e.clientY - prev.lastMousePos.y;

      if (
        Math.abs(deltaX) > PAN_CLICK_SUPPRESSION_THRESHOLD ||
        Math.abs(deltaY) > PAN_CLICK_SUPPRESSION_THRESHOLD
      ) {
        didPanDuringGestureRef.current = true;
      }

      
      const sensitivity = 0.8;
      const smoothDeltaX = deltaX * sensitivity;
      const smoothDeltaY = deltaY * sensitivity;

      return {
        ...prev,
        panOffset: {
          x: prev.panOffset.x + smoothDeltaX,
          y: prev.panOffset.y + smoothDeltaY,
        },
        lastMousePos: { x: e.clientX, y: e.clientY },
      };
    });
  }, []);

  const handleGlobalMouseUp = useCallback(() => {
    if (didPanDuringGestureRef.current) {
      suppressNextClickRef.current = true;
      didPanDuringGestureRef.current = false;
    }

    setZoomState((prev) => ({
      ...prev,
      isPanning: false,
    }));
  }, []);
  const handleGlobalMouseMoveRef = useRef(handleGlobalMouseMove);
  const handleGlobalMouseUpRef = useRef(handleGlobalMouseUp);

  useEffect(() => {
    handleGlobalMouseMoveRef.current = handleGlobalMouseMove;
  }, [handleGlobalMouseMove]);

  useEffect(() => {
    handleGlobalMouseUpRef.current = handleGlobalMouseUp;
  }, [handleGlobalMouseUp]);

  
  useEffect(() => {
    if (zoomState.isPanning) {
      const handleCurrentGlobalMouseMove = (event: MouseEvent) => {
        handleGlobalMouseMoveRef.current(event);
      };
      const handleCurrentGlobalMouseUp = () => {
        handleGlobalMouseUpRef.current();
      };

      window.activeDocument.addEventListener(
        'mousemove',
        handleCurrentGlobalMouseMove
      );
      window.activeDocument.addEventListener(
        'mouseup',
        handleCurrentGlobalMouseUp
      );

      return () => {
        window.activeDocument.removeEventListener(
          'mousemove',
          handleCurrentGlobalMouseMove
        );
        window.activeDocument.removeEventListener(
          'mouseup',
          handleCurrentGlobalMouseUp
        );
      };
    }
  }, [zoomState.isPanning]);

  
  const getTouchDistance = useCallback((touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        
        e.preventDefault();
        didPanDuringGestureRef.current = true;
        const distance = getTouchDistance(e.touches);
        setZoomState((prev) => ({
          ...prev,
          initialPinchDistance: distance,
          initialPinchScale: prev.scale,
          isPanning: false,
        }));
      } else if (e.touches.length === 1 && zoomState.scale > 1) {
        
        e.preventDefault();
        didPanDuringGestureRef.current = false;
        const touch = e.touches[0];
        setZoomState((prev) => ({
          ...prev,
          isPanning: true,
          lastMousePos: { x: touch.clientX, y: touch.clientY },
        }));
      }
    },
    [getTouchDistance, zoomState.scale]
  );

  
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && zoomState.initialPinchDistance !== null) {
        
        e.preventDefault();
        const currentDistance = getTouchDistance(e.touches);
        const scaleFactor = currentDistance / zoomState.initialPinchDistance;
        const newScale = Math.min(
          4.0,
          Math.max(1.0, zoomState.initialPinchScale * scaleFactor)
        );

        setZoomState((prev) => ({
          ...prev,
          scale: newScale,
          isZoomed: newScale > 1.0,
        }));
      } else if (
        e.touches.length === 1 &&
        zoomState.isPanning &&
        zoomState.scale > 1
      ) {
        
        e.preventDefault(); 
        const touch = e.touches[0];
        setZoomState((prev) => {
          if (!prev.isPanning || prev.scale <= 1) return prev;

          const deltaX = touch.clientX - prev.lastMousePos.x;
          const deltaY = touch.clientY - prev.lastMousePos.y;

          if (
            Math.abs(deltaX) > PAN_CLICK_SUPPRESSION_THRESHOLD ||
            Math.abs(deltaY) > PAN_CLICK_SUPPRESSION_THRESHOLD
          ) {
            didPanDuringGestureRef.current = true;
          }

          
          const sensitivity = 0.8;

          return {
            ...prev,
            panOffset: {
              x: prev.panOffset.x + deltaX * sensitivity,
              y: prev.panOffset.y + deltaY * sensitivity,
            },
            lastMousePos: { x: touch.clientX, y: touch.clientY },
          };
        });
      }
    },
    [
      getTouchDistance,
      zoomState.initialPinchDistance,
      zoomState.initialPinchScale,
      zoomState.isPanning,
      zoomState.scale,
    ]
  );

  
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      
      if (didPanDuringGestureRef.current) {
        suppressNextClickRef.current = true;
        didPanDuringGestureRef.current = false;
      }

      
      setZoomState((prev) => {
        
        const finalScale = prev.scale < 1.1 ? 1.0 : prev.scale;
        return {
          ...prev,
          initialPinchDistance: null,
          initialPinchScale: finalScale,
          scale: finalScale,
          isZoomed: finalScale > 1.0,
          isPanning: false,
          
          panOffset: finalScale <= 1.0 ? { x: 0, y: 0 } : prev.panOffset,
        };
      });
    } else if (e.touches.length === 1) {
      
      setZoomState((prev) => {
        const finalScale = prev.scale < 1.1 ? 1.0 : prev.scale;
        const touch = e.touches[0];
        return {
          ...prev,
          initialPinchDistance: null,
          initialPinchScale: finalScale,
          scale: finalScale,
          isZoomed: finalScale > 1.0,
          
          isPanning: finalScale > 1.0,
          lastMousePos: { x: touch.clientX, y: touch.clientY },
          panOffset: finalScale <= 1.0 ? { x: 0, y: 0 } : prev.panOffset,
        };
      });
    }
  }, []);

  
  const zoomScale = zoomState.scale;
  const imageTransform = `scale(${zoomScale}) translate(${zoomState.panOffset.x / zoomScale}px, ${zoomState.panOffset.y / zoomScale}px)`;

  
  const isPinching = zoomState.initialPinchDistance !== null;

  return {
    zoomState,
    imageRef,
    containerRef,
    imageUrl,
    contextMenu,
    isExcalidraw,
    mediaKind,
    sourcePath: resolvedSourcePath,
    imagePath,
    imageTransform,
    isPinching,
    handleImageClick,
    handleImageContextMenu,
    copyImageToClipboard,
    toggleZoom,
    handlePanStart,
    handlePanEnd,
    handleNavigate,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}

type FullscreenImageViewerModel = ReturnType<
  typeof useFullscreenImageViewerModel
>;

function FullscreenNavigationButtons({
  navigationContext,
  onNavigate,
}: {
  navigationContext: FullscreenImageViewerProps['navigationContext'];
  onNavigate: (direction: 'prev' | 'next') => void;
}) {
  return (
    <>
      
      {navigationContext && navigationContext.images.length > 1 && (
        <>
          <button
            className="journalit-fullscreen-nav-btn journalit-fullscreen-nav-prev"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('prev');
            }}
            aria-label={t('image.viewer.nav-prev')}
            type="button"
          >
            <LeftArrow size={20} strokeWidth={2.25} />
          </button>
          <button
            className="journalit-fullscreen-nav-btn journalit-fullscreen-nav-next"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('next');
            }}
            aria-label={t('image.viewer.nav-next')}
            type="button"
          >
            <RightArrow size={20} strokeWidth={2.25} />
          </button>
        </>
      )}
    </>
  );
}

function FullscreenImageElement({
  model,
  alt,
}: {
  model: FullscreenImageViewerModel;
  alt: string;
}) {
  const {
    zoomState,
    imageRef,
    imageUrl,
    isExcalidraw,
    mediaKind,
    sourcePath,
    imagePath,
    imageTransform,
    isPinching,
    handleImageClick,
    handleImageContextMenu,
    toggleZoom,
    handlePanStart,
    handlePanEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = model;

  const zoomableClassName = [
    'journalit-fullscreen-zoomable-media',
    zoomState.scale > 1 ? 'journalit-fullscreen-zoomable-media--zoomed' : '',
    zoomState.isPanning ? 'journalit-fullscreen-zoomable-media--panning' : '',
    zoomState.isPanning || isPinching
      ? 'journalit-fullscreen-zoomable-media--transform-active'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  const zoomTransition =
    zoomState.isPanning || isPinching
      ? 'none'
      : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  const handleMediaKeyDown = (
    e: React.KeyboardEvent<HTMLElement | HTMLImageElement>
  ) => {
    if (e.key !== 'Enter' && e.key !== ' ') {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    toggleZoom();
  };

  if (mediaKind === 'video') {
    return <FullscreenVideoPlayer src={imageUrl} />;
  }

  if (mediaKind === 'youtube') {
    return <FullscreenYouTubeEmbed url={imagePath} title={alt} />;
  }

  if (isExcalidraw) {
    return (
      <div
        className="journalit-fullscreen-image-wrapper"
        onContextMenu={handleImageContextMenu}
      >
        <div
          className={zoomableClassName}
          onClick={handleImageClick}
          onKeyDown={handleMediaKeyDown}
          role="button"
          tabIndex={0}
          onMouseDown={handlePanStart}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={dndKitStyle(imageTransform, zoomTransition)}
        >
          <ExcalidrawMediaEmbed
            path={imagePath}
            sourcePath={sourcePath}
            fullscreen={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="journalit-fullscreen-image-wrapper"
      onContextMenu={handleImageContextMenu}
    >
      <img
        ref={imageRef}
        src={imageUrl}
        alt={alt}
        className={[
          'journalit-fullscreen-zoomable-image',
          zoomState.scale > 1
            ? 'journalit-fullscreen-zoomable-image--zoomed'
            : '',
          zoomState.isPanning
            ? 'journalit-fullscreen-zoomable-image--panning'
            : '',
          zoomState.isPanning || isPinching
            ? 'journalit-fullscreen-zoomable-image--transform-active'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={handleImageClick}
        onKeyDown={handleMediaKeyDown}
        role="button"
        tabIndex={0}
        onMouseDown={handlePanStart}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={dndKitStyle(imageTransform, zoomTransition)}
      />
    </div>
  );
}

function FullscreenZoomIndicator({ zoomState }: { zoomState: ImageZoomState }) {
  return (
    <div className="journalit-fullscreen-zoom-indicator">
      {zoomState.scale > 1
        ? t('image.viewer.zoom-out-hint', {
            scale: zoomState.scale.toFixed(1),
          })
        : t('image.viewer.zoom-in-hint')}
    </div>
  );
}

function FullscreenNavigationIndicator({
  navigationContext,
}: {
  navigationContext: FullscreenImageViewerProps['navigationContext'];
}) {
  return navigationContext && navigationContext.images.length > 1 ? (
    <div className="journalit-fullscreen-nav-indicator">
      {navigationContext.currentIndex + 1} / {navigationContext.images.length}
    </div>
  ) : null;
}

function FullscreenCopyImageMenu({
  model,
}: {
  model: FullscreenImageViewerModel;
}) {
  const { contextMenu, copyImageToClipboard } = model;
  if (!contextMenu) return null;
  const isCopied = contextMenu.status === 'copied';

  const handleCopyMenuAction = () => {
    void copyImageToClipboard();
  };

  return (
    <div
      className="journalit-fullscreen-copy-menu"
      role="menuitem"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        if (isCopied) return;

        handleCopyMenuAction();
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key !== 'Enter' && e.key !== ' ') return;

        e.preventDefault();
        if (!isCopied) handleCopyMenuAction();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      style={cssVars({
        '--journalit-image-copy-menu-x': `${contextMenu.x}px`,
        '--journalit-image-copy-menu-y': `${contextMenu.y}px`,
      })}
    >
      {isCopied ? (
        <Check
          className="journalit-fullscreen-copy-menu__icon journalit-fullscreen-copy-menu__icon--success"
          size={16}
          aria-hidden="true"
        />
      ) : (
        <Copy
          className="journalit-fullscreen-copy-menu__icon"
          size={16}
          aria-hidden="true"
        />
      )}
      <span>
        {isCopied ? t('image.viewer.copied') : t('image.viewer.copy-image')}
      </span>
    </div>
  );
}

export const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({
  imagePath,
  alt = t('image.viewer.alt-default'),
  useResolveMediaPath = false,
  sourcePath = '',
  navigationContext,
}) => {
  const resolvedNavigationContext = navigationContext
    ? {
        ...navigationContext,
        sourcePath: navigationContext.sourcePath ?? sourcePath,
      }
    : undefined;
  const model = useFullscreenImageViewerModel({
    imagePath,
    useResolveMediaPath,
    sourcePath,
    navigationContext: resolvedNavigationContext,
  });
  const { containerRef, mediaKind } = model;

  return (
    <div className="journalit-fullscreen-viewer" ref={containerRef}>
      <FullscreenNavigationButtons
        navigationContext={navigationContext}
        onNavigate={model.handleNavigate}
      />

      <FullscreenImageElement model={model} alt={alt} />

      {mediaKind !== 'video' && mediaKind !== 'youtube' && (
        <FullscreenZoomIndicator zoomState={model.zoomState} />
      )}

      <FullscreenNavigationIndicator navigationContext={navigationContext} />

      {mediaKind !== 'video' && mediaKind !== 'youtube' && (
        <FullscreenCopyImageMenu model={model} />
      )}
    </div>
  );
};
