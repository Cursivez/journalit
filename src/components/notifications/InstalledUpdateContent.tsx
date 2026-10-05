import React, { lazy, Suspense, useRef, useState } from 'react';
import type { ReleaseMetadata } from '../../data/releasesData';
import { t } from '../../lang/helpers';
import { logger } from '../../utils/logger';
import { FullscreenPortal } from '../image/FullscreenPortal';

export const INSTALLED_UPDATE_PREVIEW_PORTAL_ID =
  'journalit-update-image-preview';

const FullscreenImageViewer = lazy(async () => {
  const module = await import('../image/FullscreenImageViewer');
  return { default: module.FullscreenImageViewer };
});

export function InstalledUpdateContent({
  version,
  release,
}: {
  version: string;
  release: ReleaseMetadata[string];
}) {
  const [imageState, setImageState] = useState<'loading' | 'ready' | 'failed'>(
    'loading'
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const imageButton = useRef<HTMLButtonElement>(null);
  const imageUrl = release.imageUrl;
  const showMedia = imageUrl && imageState !== 'failed';
  const closePreview = () => {
    setPreviewOpen(false);
    imageButton.current?.focus({ preventScroll: true });
  };
  const image = showMedia ? (
    <button
      ref={imageButton}
      type="button"
      className="journalit-update-popup__media"
      hidden={imageState !== 'ready'}
      aria-label={`${t('image.viewer.title-fullscreen')}: ${release.title}`}
      onClick={() => setPreviewOpen(true)}
    >
      <img
        src={imageUrl}
        alt={release.title}
        onLoad={() => setImageState('ready')}
        onError={() => {
          logger.debug(
            '[UpdateNotification] Release image unavailable',
            imageUrl
          );
          setImageState('failed');
        }}
      />
    </button>
  ) : null;

  return (
    <>
      {image}
      <div className="journalit-update-popup__content">
        <div className="journalit-update-popup__eyebrow">
          {t('update.installed.title')} · Journalit {version}
        </div>
        <h3
          id="journalit-update-popup-title"
          className="journalit-update-popup__title"
        >
          {release.title}
        </h3>
        <p
          id="journalit-update-popup-description"
          className="journalit-update-popup__description"
        >
          {release.description}
        </p>
      </div>
      {imageUrl && (
        <FullscreenPortal
          isOpen={previewOpen}
          portalId={INSTALLED_UPDATE_PREVIEW_PORTAL_ID}
          onClose={closePreview}
          title={release.title}
        >
          <Suspense fallback={<span>{t('common.loading')}</span>}>
            <FullscreenImageViewer
              imagePath={imageUrl}
              alt={release.title}
              annotationOptions={{ enabled: false }}
              onClose={closePreview}
            />
          </Suspense>
        </FullscreenPortal>
      )}
    </>
  );
}
