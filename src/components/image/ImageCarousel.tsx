

import React, { useState } from 'react';
import { ImageCarouselProps, ImageNavigationContext } from '../../types/image';
import { imageService } from '../../services/image/ImageService';
import { LazyImage } from '../shared/LazyImage';
import { FullscreenPortal } from './FullscreenPortal';
import { FullscreenImageViewer } from './FullscreenImageViewer';
import { t } from '../../lang/helpers';
import { getApp } from '../../utils/obsidian';
import {
  isExcalidrawMediaPath,
  resolveMediaDisplayPath,
} from '../../utils/imageMediaUtils';
import { ExcalidrawMediaEmbed } from './ExcalidrawMediaEmbed';



export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  altPrefix = t('image.viewer.alt-default'),
  displayOptions,
  deleteOptions,
  className = '',
  useResolveMediaPath = false,
  sourcePath = '',
}) => {
  const showThumbnails = displayOptions?.showThumbnails ?? true;
  const showCounter = displayOptions?.showCounter ?? true;
  const enableFullscreen = displayOptions?.enableFullscreen ?? true;
  const enableDelete = deleteOptions?.enabled ?? false;
  const onDeleteImage = deleteOptions?.onDeleteImage;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length <= 1) return;
    setSelectedIndex((prev) =>
      Math.min(prev, images.length - 1) === images.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length <= 1) return;
    setSelectedIndex((prev) =>
      Math.min(prev, images.length - 1) === 0 ? images.length - 1 : prev - 1
    );
  };

  const selectImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (index >= 0 && index < images.length) {
      setSelectedIndex(index);
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

  const handleFullscreenOpen = () => {
    if (!enableFullscreen) return;
    setIsFullscreen(true);
  };

  const handleImageKeyDown = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') {
      return;
    }

    e.preventDefault();
    handleFullscreenOpen();
  };

  const handleFullscreenClose = () => {
    setIsFullscreen(false);
  };

  const handleFullscreenNavigate = (index: number) => {
    if (index >= 0 && index < images.length) {
      setSelectedIndex(index);
    }
  };

  const currentIndex = Math.min(selectedIndex, Math.max(0, images.length - 1));

  const navigationContext: ImageNavigationContext = {
    images,
    currentIndex,
    onNavigate: handleFullscreenNavigate,
    altPrefix,
    useResolveMediaPath,
    sourcePath,
  };

  const containerClassName = ['journalit-image-carousel', className]
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
  const isCurrentExcalidraw = isExcalidrawMediaPath(
    getApp(),
    currentImage,
    sourcePath
  );
  const currentAlt = t('image.carousel.image-alt', {
    prefix: altPrefix,
    index: (currentIndex + 1).toString(),
  });
  const currentImageUrl = isCurrentExcalidraw
    ? ''
    : useResolveMediaPath
      ? imageService.resolveMediaPath(currentDisplayPath)
      : imageService.getResourceUrl(currentDisplayPath);

  return (
    <div className={containerClassName}>
      <div className="journalit-carousel-main">
        <div className="journalit-carousel-image-container">
          {isCurrentExcalidraw ? (
            <div
              className={`journalit-carousel-excalidraw${
                enableFullscreen ? ' is-clickable' : ''
              }`}
              onClick={handleFullscreenOpen}
              role="button"
              tabIndex={enableFullscreen ? 0 : -1}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                handleFullscreenOpen();
              }}
            >
              <ExcalidrawMediaEmbed
                path={currentImage}
                sourcePath={sourcePath}
              />
            </div>
          ) : (
            <img
              src={currentImageUrl}
              alt={currentAlt}
              onClick={handleFullscreenOpen}
              onKeyDown={handleImageKeyDown}
              role={enableFullscreen ? 'button' : undefined}
              tabIndex={enableFullscreen ? 0 : undefined}
              className={`journalit-carousel-image${
                enableFullscreen ? ' is-clickable' : ''
              }`}
            />
          )}

          {enableDelete && (
            <button
              onClick={(e) => handleDelete(currentIndex, e)}
              type="button"
              className="journalit-carousel-delete"
              aria-label={t('image.viewer.delete-button')}
            >
              ×
            </button>
          )}

          {images.length > 1 && (
            <button
              onClick={goToPrevious}
              aria-label={t('image.carousel.prev')}
              type="button"
              className="journalit-carousel-overlay-button journalit-carousel-overlay-button--prev"
            >
              ‹
            </button>
          )}

          {images.length > 1 && (
            <button
              onClick={goToNext}
              aria-label={t('image.carousel.next')}
              type="button"
              className="journalit-carousel-overlay-button journalit-carousel-overlay-button--next"
            >
              ›
            </button>
          )}
        </div>
      </div>

      {showCounter && images.length > 1 && (
        <div className="journalit-carousel-counter">
          {currentIndex + 1}/{images.length}
        </div>
      )}

      {showThumbnails && images.length > 1 && (
        <div className="journalit-carousel-thumbnails">
          {images.map((img, idx) => (
            <LazyThumbnail
              key={img}
              imagePath={img}
              index={idx}
              isActive={idx === currentIndex}
              altPrefix={altPrefix}
              useResolveMediaPath={useResolveMediaPath}
              sourcePath={sourcePath}
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
          key={currentImage}
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
    onClick,
  }) => {
    const isExcalidraw = isExcalidrawMediaPath(getApp(), imagePath, sourcePath);
    const displayPath = resolveMediaDisplayPath(
      getApp(),
      imagePath,
      sourcePath
    );

    return (
      <button
        type="button"
        className={`journalit-carousel-thumbnail${isActive ? ' active' : ''}`}
        onClick={onClick}
        aria-label={t('image.carousel.image-alt', {
          prefix: altPrefix,
          index: (index + 1).toString(),
        })}
      >
        {isExcalidraw ? (
          <div className="journalit-carousel-thumbnail-excalidraw">
            <ExcalidrawMediaEmbed path={imagePath} sourcePath={sourcePath} />
          </div>
        ) : (
          <LazyImage
            src={displayPath}
            alt={t('image.carousel.thumbnail-alt', {
              index: (index + 1).toString(),
            })}
            useResolveMediaPath={useResolveMediaPath}
            rootMargin="100px"
            threshold={0.1}
          />
        )}
      </button>
    );
  }
);

LazyThumbnail.displayName = 'LazyThumbnail';
