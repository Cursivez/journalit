

import React from 'react';
import { t } from '../../../lang/helpers';
import { ImageCarousel } from '../../image';
import { EmptyState } from '../../shared/EmptyState';

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
          <EmptyState
            message={t('trade.image.no-images')}
            subMessage={onEditClick ? t('trade.image.click-edit') : undefined}
            iconSize={40}
          />
        </div>
      );
    }

    return (
      <div className="trade-images-section" data-image-count={images.length}>
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
