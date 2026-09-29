

import React, { useEffect, useRef, useState } from 'react';
import { ImageCarouselProps, ImageNavigationContext } from '../../types/image';
import { FullscreenPortal } from './FullscreenPortal';
import { FullscreenImageViewer } from './FullscreenImageViewer';
import { LeftArrow, RightArrow, Tag } from '../shared/icons/ObsidianIcon';
import { t } from '../../lang/helpers';
import { getApp } from '../../utils/obsidian';
import {
  isExcalidrawMediaPath,
  resolveMediaDisplayPath,
} from '../../utils/imageMediaUtils';
import { ExcalidrawMediaEmbed } from './ExcalidrawMediaEmbed';
import { MediaPreview } from './MediaPreview';
import {
  isInShareEagerMediaArea,
  shareCaptureExcludeProps,
  shareLoadingProps,
} from '../../services/share/brandedCapture';



type ClickHandler = (e: React.MouseEvent) => void;


const CarouselOverlayControls: React.FC<{
  onDelete?: ClickHandler;
  onAnnotate?: ClickHandler;
  isAnnotated: boolean;
  onPrevious?: ClickHandler;
  onNext?: ClickHandler;
}> = ({ onDelete, onAnnotate, isAnnotated, onPrevious, onNext }) => (
  <>
    {onDelete && (
      <button
        onClick={onDelete}
        type="button"
        {...shareCaptureExcludeProps}
        className="journalit-carousel-delete"
        aria-label={t('image.viewer.delete-button')}
      >
        ×
      </button>
    )}

    {onAnnotate && (
      <button
        onClick={onAnnotate}
        type="button"
        {...shareCaptureExcludeProps}
        className={`journalit-carousel-annotate${
          isAnnotated ? ' is-annotated' : ''
        }`}
      >
        <Tag size={15} strokeWidth={2.25} />
        <span className="journalit-carousel-annotate__accessible-label">
          {t('imageGallery.annotation.editor-title')}
        </span>
      </button>
    )}

    {onPrevious && (
      <button
        onClick={onPrevious}
        aria-label={t('image.carousel.prev')}
        type="button"
        {...shareCaptureExcludeProps}
        className="journalit-carousel-overlay-button journalit-carousel-overlay-button--prev"
      >
        <LeftArrow size={18} strokeWidth={2.25} />
      </button>
    )}

    {onNext && (
      <button
        onClick={onNext}
        aria-label={t('image.carousel.next')}
        type="button"
        {...shareCaptureExcludeProps}
        className="journalit-carousel-overlay-button journalit-carousel-overlay-button--next"
      >
        <RightArrow size={18} strokeWidth={2.25} />
      </button>
    )}
  </>
);

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  altPrefix = t('image.viewer.alt-default'),
  displayOptions,
  deleteOptions,
  annotationOptions,
  fullscreenAnnotationOptions,
  onSelectedImageChange,
  className = '',
  useResolveMediaPath = false,
  sourcePath = '',
}) => {
  const showThumbnails = displayOptions?.showThumbnails ?? true;
  const showCounter = displayOptions?.showCounter ?? true;
  const enableFullscreen = displayOptions?.enableFullscreen ?? true;
  const enableDelete = deleteOptions?.enabled ?? false;
  const onDeleteImage = deleteOptions?.onDeleteImage;
  const enableAnnotations = annotationOptions?.enabled ?? false;
  const onAnnotateImage = annotationOptions?.onAnnotateImage;
  const isAnnotated = annotationOptions?.isAnnotated;
  const [selection, setSelection] = useState({
    imagePath: images[0] ?? null,
    fallbackPath: images[1] ?? null,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollThumbnailRef = useRef(false);

  const selectedPathIndex = selection.imagePath
    ? images.indexOf(selection.imagePath)
    : -1;
  const fallbackPathIndex = selection.fallbackPath
    ? images.indexOf(selection.fallbackPath)
    : -1;
  const currentIndex =
    selectedPathIndex >= 0
      ? selectedPathIndex
      : fallbackPathIndex >= 0
        ? fallbackPathIndex
        : 0;

  const selectUserNavigatedIndex = (index: number) => {
    shouldScrollThumbnailRef.current = true;
    setSelection({
      imagePath: images[index] ?? null,
      fallbackPath: images[index + 1] ?? images[index - 1] ?? null,
    });
    if (images[index]) {
      onSelectedImageChange?.(index, images[index]);
    }
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length <= 1) return;
    selectUserNavigatedIndex(
      currentIndex === images.length - 1 ? 0 : currentIndex + 1
    );
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length <= 1) return;
    selectUserNavigatedIndex(
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    );
  };

  const selectImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (index >= 0 && index < images.length) {
      selectUserNavigatedIndex(index);
    }
  };

  const handleDelete = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (onDeleteImage && images[index]) {
      void onDeleteImage(index, images[index]);
    }
  };

  const handleAnnotate = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAnnotateImage && images[index]) {
      onAnnotateImage(index, images[index]);
    }
  };

  const handleFullscreenOpen = (event: React.SyntheticEvent) => {
    if (!enableFullscreen) return;
    event.preventDefault();
    event.stopPropagation();
    setIsFullscreen(true);
  };

  const handleImageKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') {
      return;
    }

    handleFullscreenOpen(e);
  };

  const handleFullscreenClose = () => {
    setIsFullscreen(false);
  };

  const handleFullscreenNavigate = (index: number) => {
    if (index >= 0 && index < images.length) {
      selectUserNavigatedIndex(index);
    }
  };

  useEffect(() => {
    if (!showThumbnails || images.length <= 1) return;
    if (!shouldScrollThumbnailRef.current) return;
    shouldScrollThumbnailRef.current = false;

    const activeThumbnail = thumbnailsRef.current?.querySelector<HTMLElement>(
      '[data-active-thumbnail="true"]'
    );

    activeThumbnail?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }, [currentIndex, images.length, showThumbnails]);

  const navigationContext: ImageNavigationContext = {
    images,
    currentIndex,
    onNavigate: handleFullscreenNavigate,
    altPrefix,
    useResolveMediaPath,
    sourcePath,
  };

  const containerClassName = [
    'journalit-image-carousel',
    enableDelete ? 'journalit-image-carousel--delete-enabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!images || images.length === 0) {
    return (
      <div className={containerClassName}>
        <div className="journalit-carousel-main">
          <div className="journalit-carousel-image-container">
            <div className="journalit-carousel-empty">
              {t('image.carousel.no-images')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];
  const currentDisplayPath = resolveMediaDisplayPath(
    getApp(),
    currentImage,
    sourcePath
  );
  const app = getApp();
  const currentAlt = t('image.carousel.image-alt', {
    prefix: altPrefix,
    index: (currentIndex + 1).toString(),
  });

  return (
    <div className={containerClassName}>
      <div className="journalit-carousel-main">
        <div className="journalit-carousel-image-container">
          <MediaPreview
            app={app}
            path={currentImage}
            sourcePath={sourcePath}
            displayPath={currentDisplayPath}
            alt={currentAlt}
            useResolveMediaPath={useResolveMediaPath}
            onClick={handleFullscreenOpen}
            onKeyDown={handleImageKeyDown}
            role={enableFullscreen ? 'button' : undefined}
            tabIndex={enableFullscreen ? 0 : undefined}
            imageClassName={`journalit-carousel-image${
              enableFullscreen ? ' is-clickable' : ''
            }`}
            videoClassName={`journalit-carousel-image journalit-carousel-video${
              enableFullscreen ? ' is-clickable' : ''
            }`}
            videoPreload="metadata"
            excalidrawClassName={`journalit-carousel-excalidraw${
              enableFullscreen ? ' is-clickable' : ''
            }`}
          />

          <CarouselOverlayControls
            onDelete={
              enableDelete ? (e) => handleDelete(currentIndex, e) : undefined
            }
            onAnnotate={
              enableAnnotations
                ? (e) => handleAnnotate(currentIndex, e)
                : undefined
            }
            isAnnotated={isAnnotated?.(currentImage) ?? false}
            onPrevious={images.length > 1 ? goToPrevious : undefined}
            onNext={images.length > 1 ? goToNext : undefined}
          />
        </div>
      </div>

      {showCounter && images.length > 1 && (
        <div className="journalit-carousel-counter">
          {currentIndex + 1}/{images.length}
        </div>
      )}

      {showThumbnails && images.length > 1 && (
        <div className="journalit-carousel-thumbnails" ref={thumbnailsRef}>
          {images.map((img, idx) => (
            <LazyThumbnail
              key={img}
              imagePath={img}
              index={idx}
              isActive={idx === currentIndex}
              altPrefix={altPrefix}
              useResolveMediaPath={useResolveMediaPath}
              sourcePath={sourcePath}
              isAnnotated={isAnnotated?.(img) ?? false}
              onClick={(e) => selectImage(idx, e)}
            />
          ))}
        </div>
      )}

      <FullscreenPortal
        isOpen={isFullscreen}
        onClose={handleFullscreenClose}
        portalId="journalit-carousel-fullscreen-portal"
      >
        <FullscreenImageViewer
          annotationOptions={fullscreenAnnotationOptions}
          imagePath={currentImage}
          alt={currentAlt}
          useResolveMediaPath={useResolveMediaPath}
          sourcePath={sourcePath}
          navigationContext={navigationContext}
          onClose={handleFullscreenClose}
        />
      </FullscreenPortal>
    </div>
  );
};

interface LazyThumbnailProps {
  imagePath: string;
  index: number;
  isActive: boolean;
  altPrefix: string;
  useResolveMediaPath: boolean;
  sourcePath: string;
  isAnnotated: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const LazyThumbnail: React.FC<LazyThumbnailProps> = React.memo(
  ({
    imagePath,
    index,
    isActive,
    altPrefix,
    useResolveMediaPath,
    sourcePath,
    isAnnotated,
    onClick,
  }) => {
    const thumbnailRef = useRef<HTMLButtonElement>(null);
    const [isVisible, setIsVisible] = useState(isActive);
    const app = getApp();
    const isExcalidraw = isExcalidrawMediaPath(app, imagePath, sourcePath);
    const displayPath = resolveMediaDisplayPath(app, imagePath, sourcePath);

    useEffect(() => {
      if (isVisible) return;
      const element = thumbnailRef.current;
      if (!element) return;

      
      if (isInShareEagerMediaArea(element)) {
        setIsVisible(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: '120px' }
      );
      observer.observe(element);
      return () => observer.disconnect();
    }, [isVisible]);

    const shouldRenderPreview = isVisible || isActive;

    return (
      <button
        ref={thumbnailRef}
        type="button"
        className={`journalit-carousel-thumbnail${isActive ? ' active' : ''}`}
        data-active-thumbnail={isActive ? 'true' : undefined}
        onClick={onClick}
        aria-label={t('image.carousel.image-alt', {
          prefix: altPrefix,
          index: (index + 1).toString(),
        })}
      >
        {!shouldRenderPreview ? (
          
          <span
            className="journalit-carousel-thumbnail-media"
            {...shareLoadingProps}
          />
        ) : isExcalidraw ? (
          <div className="journalit-carousel-thumbnail-excalidraw">
            <ExcalidrawMediaEmbed path={imagePath} sourcePath={sourcePath} />
          </div>
        ) : (
          <MediaPreview
            app={app}
            path={imagePath}
            sourcePath={sourcePath}
            displayPath={displayPath}
            alt={t('image.carousel.thumbnail-alt', {
              index: (index + 1).toString(),
            })}
            useResolveMediaPath={useResolveMediaPath}
            imageClassName="journalit-carousel-thumbnail-media"
            videoClassName="journalit-carousel-thumbnail-media"
            videoPreload="metadata"
            showVideoBadge={false}
          />
        )}
        {isAnnotated ? (
          <span
            className="journalit-carousel-thumbnail__annotation-indicator"
            aria-hidden="true"
          />
        ) : null}
      </button>
    );
  }
);

LazyThumbnail.displayName = 'LazyThumbnail';
