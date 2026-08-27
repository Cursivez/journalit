import React, { useCallback, useState } from 'react';
import { t } from '../../../../lang/helpers';
import { resolveImageInput } from '../../../../utils/imageMediaUtils';
import { getApp } from '../../../../utils/obsidian';

interface TradeAttachmentUrlInputProps {
  sourcePath: string;
  hasImage: (imagePath: string) => boolean;
  onAddImagePath: (imagePath: string) => void | Promise<void>;
}

export const TradeAttachmentUrlInput: React.FC<
  TradeAttachmentUrlInputProps
> = ({ sourcePath, hasImage, onAddImagePath }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleAdd = useCallback(() => {
    const url = imageUrl.trim();
    if (!url) return;

    let resolvedPath: string;
    try {
      resolvedPath = resolveImageInput(getApp(), url, sourcePath);
    } catch {
      setUrlError(t('image.uploader.error-invalid-url'));
      return;
    }

    if (hasImage(resolvedPath)) {
      setUrlError(t('form.field.image-duplicate-error'));
      return;
    }

    void onAddImagePath(resolvedPath);
    setImageUrl('');
    setUrlError(null);
  }, [hasImage, imageUrl, onAddImagePath, sourcePath]);

  return (
    <>
      <div className="journalit-image-url-container">
        <input
          type="text"
          className={`journalit-image-url-input${urlError ? ' has-error' : ''}`}
          value={imageUrl}
          onChange={(event) => {
            setImageUrl(event.target.value);
            setUrlError(null);
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            handleAdd();
          }}
          placeholder={t('form.field.image-url-placeholder')}
          aria-label={t('image.uploader.url-input-aria')}
        />
        <button
          type="button"
          className={`journalit-image-url-button${imageUrl.trim() ? ' is-active' : ''}`}
          onClick={handleAdd}
          disabled={!imageUrl.trim()}
        >
          {t('button.add')}
        </button>
      </div>
      {urlError ? (
        <div className="journalit-image-url-error">{urlError}</div>
      ) : null}
    </>
  );
};

TradeAttachmentUrlInput.displayName = 'TradeAttachmentUrlInput';
