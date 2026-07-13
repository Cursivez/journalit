

import React from 'react';
import { t } from '../../../lang/helpers';
import { ImageCarousel } from '../../image';
import { Image } from '../../shared/icons/ObsidianIcon';

interface TradeImageSectionProps {
  images: string[] | undefined;
  onEditClick?: () => void;
  sourcePath?: string;
}

export const TradeImageSection: React.FC<TradeImageSectionProps> = React.memo(
  ({ images, onEditClick, sourcePath }) => {
    if (!images || images.length === 0) {
      return (
        <div className="trade-empty-images">
          <div className="trade-empty-images-icon" aria-hidden="true">
            <Image size={28} strokeWidth={1.75} />
          </div>
          <div className="trade-empty-images-copy">
            <div className="trade-empty-images-title">
              {t('trade.image.no-images')}
            </div>
            {onEditClick && (
              <button
                type="button"
                className="journalit-button trade-empty-images-action"
                onClick={onEditClick}
              >
                <span>{t('trade.image.click-edit')}</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        className="trade-images-section journalit-media-carousel-surface"
        data-image-count={images.length}
      >
        <ImageCarousel
          images={images}
          altPrefix={t('trade.image.alt-prefix')}
          displayOptions={{
            showThumbnails: images.length > 1,
            showCounter: images.length > 1,
            enableFullscreen: true,
          }}
          deleteOptions={{ enabled: false }}
          useResolveMediaPath={true}
          sourcePath={sourcePath}
          className={images.length === 1 ? 'single-image-carousel' : ''}
          data-single-image={images.length === 1 ? 'true' : 'false'}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    
    return (
      JSON.stringify(prevProps.images) === JSON.stringify(nextProps.images) &&
      prevProps.onEditClick === nextProps.onEditClick &&
      prevProps.sourcePath === nextProps.sourcePath
    );
  }
);

TradeImageSection.displayName = 'TradeImageSection';
