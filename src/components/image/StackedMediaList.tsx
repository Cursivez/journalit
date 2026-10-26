

import React, { useState } from 'react';
import type { App } from 'obsidian';
import { t } from '../../lang/helpers';
import { FullscreenPortal } from './FullscreenPortal';
import { FullscreenImageViewer } from './FullscreenImageViewer';
import { ExcalidrawMediaEmbed } from './ExcalidrawMediaEmbed';
import { MediaPreview } from './MediaPreview';
import {
  isExcalidrawMediaPath,
  resolveMediaDisplayPath,
} from '../../utils/imageMediaUtils';
import { shareCaptureExcludeProps } from '../../services/share/brandedCapture';

interface StackedMediaListProps {
  app: App;
  images: string[];
  sourcePath: string;
  altPrefix: string;
  
  annotationsEnabled: boolean;
  
  onDelete?: (index: number, imagePath: string) => void;
}

export const StackedMediaList: React.FC<StackedMediaListProps> = ({
  app,
  images,
  sourcePath,
  altPrefix,
  annotationsEnabled,
  onDelete,
}) => {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const openOnKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFullscreenIndex(index);
    }
  };

  return (
    <>
      <div className="journalit-stacked-media">
        {images.map((imagePath, index) => {
          const indexLabel = String(index + 1);
          return (
            <div key={imagePath} className="journalit-stacked-media__item">
              {isExcalidrawMediaPath(app, imagePath, sourcePath) ? (
                <button
                  type="button"
                  className="journalit-native-button journalit-native-button--unstyled journalit-stacked-media__excalidraw"
                  onClick={() => setFullscreenIndex(index)}
                  aria-label={t('widget.images.open-fullscreen', {
                    index: indexLabel,
                  })}
                  onKeyDown={(e) => openOnKey(e, index)}
                >
                  <ExcalidrawMediaEmbed
                    path={imagePath}
                    sourcePath={sourcePath}
                  />
                </button>
              ) : (
                <MediaPreview
                  app={app}
                  path={imagePath}
                  sourcePath={sourcePath}
                  displayPath={resolveMediaDisplayPath(
                    app,
                    imagePath,
                    sourcePath
                  )}
                  alt={t('image.carousel.image-alt', {
                    prefix: altPrefix,
                    index: indexLabel,
                  })}
                  imageClassName="journalit-stacked-media__img"
                  videoClassName="journalit-stacked-media__img"
                  onClick={() => setFullscreenIndex(index)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => openOnKey(e, index)}
                />
              )}
              {onDelete && (
                <button
                  type="button"
                  className="journalit-stacked-media__delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index, imagePath);
                  }}
                  aria-label={t('widget.images.delete')}
                  {...shareCaptureExcludeProps}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      <FullscreenPortal
        isOpen={fullscreenIndex !== null}
        onClose={() => setFullscreenIndex(null)}
      >
        {fullscreenIndex !== null && (
          <FullscreenImageViewer
            annotationOptions={{ enabled: annotationsEnabled }}
            imagePath={images[fullscreenIndex]}
            onClose={() => setFullscreenIndex(null)}
            useResolveMediaPath={true}
            sourcePath={sourcePath}
            navigationContext={
              images.length > 1
                ? {
                    images,
                    currentIndex: fullscreenIndex,
                    onNavigate: setFullscreenIndex,
                    altPrefix,
                    useResolveMediaPath: true,
                    sourcePath,
                  }
                : undefined
            }
          />
        )}
      </FullscreenPortal>
    </>
  );
};
