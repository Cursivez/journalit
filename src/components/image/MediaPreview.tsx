import React, { useState } from 'react';
import { App } from 'obsidian';
import { imageService } from '../../services/image/ImageService';
import {
  getMediaKind,
  getYouTubeThumbnailFallbackUrl,
  getYouTubeThumbnailUrl,
  getYouTubeWatchUrl,
  YOUTUBE_WATCH_HOSTNAME,
  resolveMediaDisplayPath,
} from '../../utils/imageMediaUtils';
import { ExcalidrawMediaEmbed } from './ExcalidrawMediaEmbed';
import { ExternalLink, Play, VideoOff } from '../shared/icons/ObsidianIcon';
import { t } from '../../lang/helpers';
import { openExternalUrl } from '../../utils/externalLinks';

interface MediaPreviewProps {
  app: App;
  path: string;
  sourcePath?: string;
  displayPath: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  videoClassName?: string;
  excalidrawClassName?: string;
  useResolveMediaPath?: boolean;
  showVideoBadge?: boolean;
  videoPreload?: 'none' | 'metadata' | 'auto';
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
  
  onImageSettled?: () => void;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  role?: string;
  tabIndex?: number;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  app,
  path,
  sourcePath = '',
  displayPath,
  alt,
  className = '',
  imageClassName = '',
  videoClassName = '',
  excalidrawClassName = '',
  useResolveMediaPath = true,
  showVideoBadge = true,
  videoPreload = 'none',
  loading = 'lazy',
  decoding = 'async',
  onImageSettled,
  onClick,
  onKeyDown,
  role,
  tabIndex,
}) => {
  const mediaKind = getMediaKind(app, path, sourcePath);
  const resolvedDisplayPath = useResolveMediaPath
    ? resolveMediaDisplayPath(app, displayPath, sourcePath)
    : displayPath;
  const mediaUrl = useResolveMediaPath
    ? imageService.resolveMediaPath(resolvedDisplayPath)
    : imageService.getResourceUrl(resolvedDisplayPath);
  const interactiveProps = {
    onClick,
    onKeyDown,
    role,
    tabIndex,
  };

  if (mediaKind === 'excalidraw') {
    return (
      <div className={excalidrawClassName || className} {...interactiveProps}>
        <ExcalidrawMediaEmbed path={path} sourcePath={sourcePath} />
      </div>
    );
  }

  if (mediaKind === 'video') {
    return (
      <div
        className={`journalit-media-preview-video ${className}`.trim()}
        aria-label={alt}
        {...interactiveProps}
      >
        <video
          src={mediaUrl}
          className={videoClassName || imageClassName}
          preload={videoPreload}
          muted
          playsInline
        />
        {showVideoBadge && (
          <span
            className="journalit-media-preview-video__badge"
            aria-hidden="true"
          >
            <Play size={18} strokeWidth={2.25} />
          </span>
        )}
      </div>
    );
  }

  if (mediaKind === 'youtube') {
    return (
      <YouTubeMediaPreview
        url={path}
        alt={alt}
        className={className}
        imageClassName={imageClassName || videoClassName}
        loading={loading}
        decoding={decoding}
        showVideoBadge={showVideoBadge}
        interactiveProps={interactiveProps}
      />
    );
  }

  return (
    <img
      src={mediaUrl}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={imageClassName || className}
      onLoad={onImageSettled}
      onError={onImageSettled}
      {...interactiveProps}
    />
  );
};



const isYouTubePlaceholder = (image: HTMLImageElement) =>
  image.naturalWidth === 120 && image.naturalHeight === 90;

interface YouTubeMediaPreviewProps {
  url: string;
  alt: string;
  className: string;
  imageClassName: string;
  loading: 'lazy' | 'eager';
  decoding: 'async' | 'auto' | 'sync';
  showVideoBadge: boolean;
  interactiveProps: {
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
    role?: string;
    tabIndex?: number;
  };
}

const YouTubeMediaPreview: React.FC<YouTubeMediaPreviewProps> = ({
  url,
  alt,
  className,
  imageClassName,
  loading,
  decoding,
  showVideoBadge,
  interactiveProps,
}) => {
  
  
  const [isUnavailable, setIsUnavailable] = useState(false);
  const thumbnailFallbackUrl = getYouTubeThumbnailFallbackUrl(url);
  const handleMissingThumbnail = (image: HTMLImageElement) => {
    if (thumbnailFallbackUrl && image.src !== thumbnailFallbackUrl) {
      image.src = thumbnailFallbackUrl;
    } else {
      setIsUnavailable(true);
    }
  };

  if (isUnavailable) {
    const tileClassName =
      `journalit-media-preview-video journalit-media-preview-youtube-unavailable ${className}`.trim();
    const tileContent = (
      <>
        <VideoOff size={22} aria-hidden="true" />
        <span className="journalit-media-preview-youtube-unavailable__title">
          {t('image.youtube.unavailable-title')}
        </span>
        <span className="journalit-media-preview-youtube-unavailable__description">
          {t('image.youtube.unavailable-description')}
        </span>
      </>
    );

    
    
    if (!interactiveProps.onClick) {
      return (
        <div className={tileClassName} aria-label={alt}>
          {tileContent}
        </div>
      );
    }

    return (
      <button
        type="button"
        className="journalit-native-button journalit-native-button--unstyled journalit-media-preview-video journalit-media-preview-youtube-unavailable"
        onClick={(event) => {
          event.stopPropagation();
          openExternalUrl(getYouTubeWatchUrl(url), [YOUTUBE_WATCH_HOSTNAME]);
        }}
      >
        {tileContent}
        <span className="journalit-media-preview-youtube-unavailable__action">
          <ExternalLink size={14} aria-hidden="true" />
          {t('image.youtube.open')}
        </span>
      </button>
    );
  }

  return (
    <div
      className={`journalit-media-preview-video journalit-media-preview-youtube ${className}`.trim()}
      aria-label={alt}
      {...interactiveProps}
    >
      <img
        src={getYouTubeThumbnailUrl(url)}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={imageClassName}
        onLoad={(event) => {
          if (isYouTubePlaceholder(event.currentTarget)) {
            handleMissingThumbnail(event.currentTarget);
          }
        }}
        onError={(event) => handleMissingThumbnail(event.currentTarget)}
      />
      {showVideoBadge && (
        <span
          className="journalit-media-preview-video__badge"
          aria-hidden="true"
        >
          <Play size={18} strokeWidth={2.25} />
        </span>
      )}
    </div>
  );
};
