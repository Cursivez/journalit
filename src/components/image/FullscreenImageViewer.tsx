

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FullscreenImageViewerProps, ImageZoomState } from '../../types/image';
import { imageService } from '../../services/image/ImageService';
import { t } from '../../lang/helpers';
import { dndKitStyle } from '../../styles/inlineStylePolicy';
import { getApp } from '../../utils/obsidian';
import {
  isExcalidrawMediaPath,
  resolveMediaDisplayPath,
} from '../../utils/imageMediaUtils';
import { ExcalidrawMediaEmbed } from './ExcalidrawMediaEmbed';

const PAN_CLICK_SUPPRESSION_THRESHOLD = 2;

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

  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  
  const suppressNextClickRef = useRef(false);
  const didPanDuringGestureRef = useRef(false);

  
  const resolvedSourcePath = navigationContext?.sourcePath ?? sourcePath;
  const isExcalidraw = isExcalidrawMediaPath(
    getApp(),
    imagePath,
    resolvedSourcePath
  );
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
    setZoomState(createInitialZoomState());
  }, [imagePath]);

  
  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      
      if (suppressNextClickRef.current) {
        suppressNextClickRef.current = false;
        return;
      }

      
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
    },
    [zoomState.isPanning]
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

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigate]);

  
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

      document.addEventListener('mousemove', handleCurrentGlobalMouseMove);
      document.addEventListener('mouseup', handleCurrentGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleCurrentGlobalMouseMove);
        document.removeEventListener('mouseup', handleCurrentGlobalMouseUp);
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
    isExcalidraw,
    sourcePath: resolvedSourcePath,
    imagePath,
    imageTransform,
    isPinching,
    handleImageClick,
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
            ‹
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
            ›
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
    sourcePath,
    imagePath,
    imageTransform,
    isPinching,
    handleImageClick,
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

    if (zoomState.isPanning) {
      return;
    }

    handleImageClick(e as unknown as React.MouseEvent);
  };

  if (isExcalidraw) {
    return (
      <div className="journalit-fullscreen-image-wrapper">
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
    <div className="journalit-fullscreen-image-wrapper">
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
  const { containerRef } = model;

  return (
    <div className="journalit-fullscreen-viewer" ref={containerRef}>
      <FullscreenNavigationButtons
        navigationContext={navigationContext}
        onNavigate={model.handleNavigate}
      />

      <FullscreenImageElement model={model} alt={alt} />

      <FullscreenZoomIndicator zoomState={model.zoomState} />

      <FullscreenNavigationIndicator navigationContext={navigationContext} />
    </div>
  );
};
