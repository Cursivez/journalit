

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ImageCarouselProps, ImageNavigationContext } from '../../types/image';
import { FullscreenPortal } from './FullscreenPortal';
import { FullscreenImageViewer } from './FullscreenImageViewer';
import { LeftArrow, RightArrow, Tag, X } from '../shared/icons/ObsidianIcon';
import { t } from '../../lang/helpers';
import { getApp } from '../../utils/obsidian';
import {
  getMediaKind,
  isExcalidrawMediaPath,
  resolveMediaDisplayPath,
} from '../../utils/imageMediaUtils';
import { ExcalidrawMediaEmbed } from './ExcalidrawMediaEmbed';
import { isInPdfExportRender } from '../../utils/pdfExportRender';
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
        <X size={16} aria-hidden="true" />
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

interface CarouselSelection {
  imagePath: string | null;
  
  fallbackPath: string | null;
}

const selectionAt = (
  images: readonly string[],
  index: number,
  fallbackPath: string | undefined
): CarouselSelection => ({
  imagePath: images[index] ?? null,
  fallbackPath: fallbackPath ?? null,
});

const indexOfPath = (images: readonly string[], path: string | null) =>
  path ? images.indexOf(path) : -1;


const currentCarouselIndex = (
  images: readonly string[],
  selection: CarouselSelection
): number => {
  const selectedPathIndex = indexOfPath(images, selection.imagePath);
  if (selectedPathIndex >= 0) return selectedPathIndex;
  return Math.max(indexOfPath(images, selection.fallbackPath), 0);
};

const resolveCarouselOptions = ({
  displayOptions,
  deleteOptions,
  annotationOptions,
}: Pick<
  ImageCarouselProps,
  'displayOptions' | 'deleteOptions' | 'annotationOptions'
>) => ({
  showThumbnails: displayOptions?.showThumbnails ?? true,
  showCounter: displayOptions?.showCounter ?? true,
  enableFullscreen: displayOptions?.enableFullscreen ?? true,
  enableDelete: deleteOptions?.enabled ?? false,
  onDeleteImage: deleteOptions?.onDeleteImage,
  enableAnnotations: annotationOptions?.enabled ?? false,
  onAnnotateImage: annotationOptions?.onAnnotateImage,
  isAnnotated: annotationOptions?.isAnnotated,
});

const CarouselCurrentMedia: React.FC<{
  path: string;
  sourcePath: string;
  alt: string;
  useResolveMediaPath: boolean;
  enableFullscreen: boolean;
  onOpen: (event: React.SyntheticEvent) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
}> = ({
  path,
  sourcePath,
  alt,
  useResolveMediaPath,
  enableFullscreen,
  onOpen,
  onKeyDown,
}) => {
  const app = getApp();
  const clickable = enableFullscreen ? ' is-clickable' : '';
  return (
    <MediaPreview
      app={app}
      path={path}
      sourcePath={sourcePath}
      displayPath={resolveMediaDisplayPath(app, path, sourcePath)}
      alt={alt}
      useResolveMediaPath={useResolveMediaPath}
      onClick={onOpen}
      onKeyDown={onKeyDown}
      role={enableFullscreen ? 'button' : undefined}
      tabIndex={enableFullscreen ? 0 : undefined}
      imageClassName={`journalit-carousel-image${clickable}`}
      videoClassName={`journalit-carousel-image journalit-carousel-video${clickable}`}
      videoPreload="metadata"
      excalidrawClassName={`journalit-carousel-excalidraw${clickable}`}
    />
  );
};


const CarouselThumbnails: React.FC<{
  thumbnailsRef: React.RefObject<HTMLDivElement | null>;
  images: string[];
  currentIndex: number;
  altPrefix: string;
  useResolveMediaPath: boolean;
  sourcePath: string;
  isAnnotated: ((imagePath: string) => boolean) | undefined;
  thumbnailActions: React.ReactNode;
  onSelect: (index: number, e: React.MouseEvent) => void;
}> = ({
  thumbnailsRef,
  images,
  currentIndex,
  altPrefix,
  useResolveMediaPath,
  sourcePath,
  isAnnotated,
  thumbnailActions,
  onSelect,
}) => {
  const hasMultipleImages = images.length > 1;
  if (!hasMultipleImages && !thumbnailActions) return null;
  return (
    <div
      className="journalit-carousel-thumbnails"
      ref={thumbnailsRef}
      {...(hasMultipleImages ? {} : shareCaptureExcludeProps)}
    >
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
          onClick={(e) => onSelect(idx, e)}
        />
      ))}
      {thumbnailActions && (
        <div
          className="journalit-carousel-thumbnail-actions"
          {...shareCaptureExcludeProps}
        >
          {thumbnailActions}
        </div>
      )}
    </div>
  );
};

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  thumbnailActions,
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
  const {
    showThumbnails,
    showCounter,
    enableFullscreen,
    enableDelete,
    onDeleteImage,
    enableAnnotations,
    onAnnotateImage,
    isAnnotated,
  } = resolveCarouselOptions({
    displayOptions,
    deleteOptions,
    annotationOptions,
  });
  const [selection, setSelection] = useState<CarouselSelection>(() =>
    selectionAt(images, 0, images[1])
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollThumbnailRef = useRef(false);

  const currentIndex = currentCarouselIndex(images, selection);

  const selectUserNavigatedIndex = (index: number) => {
    shouldScrollThumbnailRef.current = true;
    setSelection(
      selectionAt(images, index, images[index + 1] ?? images[index - 1])
    );
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
  const hasMultipleImages = images.length > 1;
  const currentAlt = t('image.carousel.image-alt', {
    prefix: altPrefix,
    index: (currentIndex + 1).toString(),
  });

  return (
    <div className={containerClassName}>
      <div className="journalit-carousel-main">
        <div className="journalit-carousel-image-container">
          <CarouselCurrentMedia
            path={currentImage}
            sourcePath={sourcePath}
            alt={currentAlt}
            useResolveMediaPath={useResolveMediaPath}
            enableFullscreen={enableFullscreen}
            onOpen={handleFullscreenOpen}
            onKeyDown={handleImageKeyDown}
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
            onPrevious={hasMultipleImages ? goToPrevious : undefined}
            onNext={hasMultipleImages ? goToNext : undefined}
          />
        </div>
      </div>

      {showCounter && hasMultipleImages && (
        <div className="journalit-carousel-counter">
          {currentIndex + 1}/{images.length}
        </div>
      )}

      {showThumbnails && (
        <CarouselThumbnails
          thumbnailsRef={thumbnailsRef}
          images={images}
          currentIndex={currentIndex}
          altPrefix={altPrefix}
          useResolveMediaPath={useResolveMediaPath}
          sourcePath={sourcePath}
          isAnnotated={isAnnotated}
          thumbnailActions={thumbnailActions}
          onSelect={selectImage}
        />
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
    
    
    const [isPdfExport, setIsPdfExport] = useState(false);
    const [isImageSettled, setIsImageSettled] = useState(false);
    const app = getApp();
    const isExcalidraw = isExcalidrawMediaPath(app, imagePath, sourcePath);
    const displayPath = resolveMediaDisplayPath(app, imagePath, sourcePath);
    const awaitsImage =
      isPdfExport &&
      !isImageSettled &&
      getMediaKind(app, imagePath, sourcePath) === 'image';

    useLayoutEffect(() => {
      const element = thumbnailRef.current;
      if (element && isInPdfExportRender(element)) setIsPdfExport(true);
    }, []);

    useEffect(() => {
      if (isVisible || isPdfExport) return;
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
    }, [isPdfExport, isVisible]);

    const shouldRenderPreview = isVisible || isActive || isPdfExport;

    return (
      <button
        ref={thumbnailRef}
        type="button"
        className={`journalit-carousel-thumbnail${isActive ? ' active' : ''}`}
        data-active-thumbnail={isActive ? 'true' : undefined}
        onClick={onClick}
        {...(awaitsImage ? shareLoadingProps : {})}
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
            loading={isPdfExport ? 'eager' : 'lazy'}
            onImageSettled={() => setIsImageSettled(true)}
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
