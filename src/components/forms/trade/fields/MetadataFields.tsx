

import React, { useState, useMemo, useCallback } from 'react';
import { FormSection } from '../FormSection';
import { TradeFormData, TradeFormValue } from '../types';
import { ImageUploader, ImageCarousel } from '../../../image';
import { PasteContext } from '../../../../utils/PasteManager';
import { resolveImageInput } from '../../../../utils/imageMediaUtils';
import { getApp } from '../../../../utils/obsidian';
import { t } from '../../../../lang/helpers';

interface MetadataFieldsProps {
  
  data: Partial<TradeFormData>;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  
  availableTags: string[];
  
  onAddImage?: (file: File) => Promise<string>;
  
  onDeleteImage?: (imagePath: string) => Promise<void>;
  
  sourcePath?: string;
}


const MetadataFieldsComponent: React.FC<MetadataFieldsProps> = ({
  data,
  onChange,
  availableTags: _availableTags,
  onAddImage,
  onDeleteImage,
  sourcePath = '',
}) => {
  
  const tradeContext = useMemo((): PasteContext => {
    return {
      contextType: 'trade',
      contextData: {
        ticker: data.instrument || 'unknown',
        
        
      },
      multiple: true,
    };
  }, [data.instrument]);

  
  const handleImageUploaded = useCallback(
    async (imagePath: string) => {
      try {
        
        const currentImages = Array.isArray(data.images)
          ? [...data.images]
          : [];

        
        if (!currentImages.includes(imagePath)) {
          
          const updatedImages = [...currentImages, imagePath];

          
          onChange('images', updatedImages);
        }
      } catch (_error) {
        console.error('Failed to process uploaded image:', _error);
      }
    },
    [data.images, onChange]
  );

  
  const handleMultipleImagesUploaded = async (imagePaths: string[]) => {
    try {
      
      const currentImages = Array.isArray(data.images) ? [...data.images] : [];

      
      const newImagePaths = imagePaths.filter(
        (path) => !currentImages.includes(path)
      );

      if (newImagePaths.length > 0) {
        
        const updatedImages = [...currentImages, ...newImagePaths];

        
        onChange('images', updatedImages);
      }
    } catch (_error) {
      console.error('Failed to process multiple uploaded images:', _error);
    }
  };

  
  const handleDeleteImage = async (index: number, imagePath: string) => {
    
    const currentImages = [...(data.images || [])];
    const updatedImages = currentImages.filter((image) => image !== imagePath);
    onChange('images', updatedImages);

    
    if (onDeleteImage) {
      try {
        await onDeleteImage(imagePath);
      } catch (error) {
        console.error(`Failed to delete image ${imagePath}:`, error);
      }
    }
  };

  
  const saveImage = async (file: File): Promise<string> => {
    if (!onAddImage) {
      throw new Error(t('form.error.image-upload-unavailable'));
    }
    return await onAddImage(file);
  };

  
  const [imageUrl, setImageUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  
  const handleAddImageUrl = useCallback(() => {
    const url = imageUrl.trim();
    if (!url) return;

    let finalUrl: string;
    try {
      finalUrl = resolveImageInput(getApp(), url, sourcePath);
    } catch {
      setUrlError(t('image.uploader.error-invalid-url'));
      return;
    }

    
    const currentImages = Array.isArray(data.images) ? data.images : [];
    if (currentImages.includes(finalUrl)) {
      setUrlError(t('form.field.image-duplicate-error'));
      return;
    }

    
    void handleImageUploaded(finalUrl);
    setImageUrl('');
    setUrlError(null);
  }, [imageUrl, data.images, handleImageUploaded, sourcePath]);

  
  const handleUrlKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddImageUrl();
      }
    },
    [handleAddImageUrl]
  );

  return (
    <FormSection title={t('form.section.attachments')}>
      
      {onAddImage && (
        <div className="field">
          <label className="label">{t('form.section.attachments')}</label>

          
          <ImageUploader
            onImageUploaded={handleImageUploaded}
            onMultipleImagesUploaded={handleMultipleImagesUploaded}
            label={t('button.upload-image')}
            enableDragDrop={true}
            saveImageFunction={saveImage}
            enablePaste={true}
            pasteContext={tradeContext}
          />

          
          <div className="journalit-image-url-container">
            <input
              type="text"
              className={`journalit-image-url-input${urlError ? ' has-error' : ''}`}
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setUrlError(null);
              }}
              onKeyDown={handleUrlKeyDown}
              placeholder={t('form.field.image-url-placeholder')}
              aria-label={t('image.uploader.url-input-aria')}
            />
            <button
              type="button"
              className={`journalit-image-url-button${imageUrl.trim() ? ' is-active' : ''}`}
              onClick={() => void handleAddImageUrl()}
              disabled={!imageUrl.trim()}
            >
              {t('button.add')}
            </button>
          </div>
          {urlError && (
            <div className="journalit-image-url-error">{urlError}</div>
          )}

          
          {data.images && data.images.length > 0 && (
            <div className="trade-form-attachments">
              <ImageCarousel
                images={data.images}
                altPrefix={t('form.field.trade-image-alt')}
                showThumbnails={true}
                showCounter={true}
                enableDelete={true}
                onDeleteImage={handleDeleteImage}
                enableFullscreen={true}
                useResolveMediaPath={true}
                sourcePath={sourcePath}
              />
            </div>
          )}
        </div>
      )}
    </FormSection>
  );
};

export const MetadataFields = React.memo(MetadataFieldsComponent);
