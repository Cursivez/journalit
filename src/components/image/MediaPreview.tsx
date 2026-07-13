import React from 'react';
import { App } from 'obsidian';
import { imageService } from '../../services/image/ImageService';
import {
  getMediaKind,
  getYouTubeThumbnailUrl,
  resolveMediaDisplayPath,
} from '../../utils/imageMediaUtils';
import { ExcalidrawMediaEmbed } from './ExcalidrawMediaEmbed';
import { Play } from '../shared/icons/ObsidianIcon';

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
  onClick?: () => void;
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
      <div
        className={`journalit-media-preview-video journalit-media-preview-youtube ${className}`.trim()}
        aria-label={alt}
        {...interactiveProps}
      >
        <img
          src={getYouTubeThumbnailUrl(path)}
          alt={alt}
          loading={loading}
          decoding={decoding}
          className={imageClassName || videoClassName}
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

  return (
    <img
      src={mediaUrl}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={imageClassName || className}
      {...interactiveProps}
    />
  );
};
