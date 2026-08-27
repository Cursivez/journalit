

import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import { FormSection } from '../FormSection';
import { TradeFormData, TradeFormValue } from '../types';
import { ImageUploader } from '../../../image/ImageUploader';
import { ImageCarousel } from '../../../image/ImageCarousel';
import { PasteContext } from '../../../../utils/PasteManager';
import { t } from '../../../../lang/helpers';
import { usePlugin } from '../../../../hooks/usePlugin';
import { hasVisibleImageAnnotation } from '../../../../utils/imageAnnotations';
import { TradeAttachmentAnnotationEditor } from './TradeAttachmentAnnotationEditor';
import { TradeAttachmentUrlInput } from './TradeAttachmentUrlInput';
import { useTradeAttachmentAnnotations } from '../hooks/useTradeAttachmentAnnotations';

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
  const plugin = usePlugin();
  const imagesRef = useRef<string[]>(
    Array.isArray(data.images) ? [...data.images] : []
  );

  useEffect(() => {
    imagesRef.current = Array.isArray(data.images) ? [...data.images] : [];
  }, [data.images]);

  const updateImages = useCallback(
    (nextImages: string[]) => {
      imagesRef.current = nextImages;
      onChange('images', nextImages);
    },
    [onChange]
  );

  const handleAnnotationsChange = useCallback(
    (nextAnnotations: NonNullable<TradeFormData['imageAnnotations']>) =>
      onChange('imageAnnotations', nextAnnotations),
    [onChange]
  );
  const {
    annotations: imageAnnotations,
    editorRef: annotationEditorRef,
    editingImagePath,
    annotationDraft,
    handleDraftChange,
    getAnnotation,
    saveAnnotation,
    handleAnnotateImage,
    handleSelectedImageChange,
    handleDone: handleSaveAnnotation,
    handleCancel: handleCancelAnnotation,
    removeAnnotation,
  } = useTradeAttachmentAnnotations({
    images: data.images ?? [],
    imageAnnotations: data.imageAnnotations,
    onChange: handleAnnotationsChange,
  });

  
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
        const currentImages = [...imagesRef.current];

        
        if (!currentImages.includes(imagePath)) {
          
          const updatedImages = [...currentImages, imagePath];

          
          updateImages(updatedImages);
        }
      } catch (_error) {
        console.error('Failed to process uploaded image:', _error);
      }
    },
    [updateImages]
  );

  
  const handleMultipleImagesUploaded = async (imagePaths: string[]) => {
    try {
      
      const currentImages = [...imagesRef.current];

      
      const currentImagesSet = new Set(currentImages);
      const newImagePaths = imagePaths.filter(
        (path) => !currentImagesSet.has(path)
      );

      if (newImagePaths.length > 0) {
        
        const updatedImages = [...currentImages, ...newImagePaths];

        
        updateImages(updatedImages);
      }
    } catch (_error) {
      console.error('Failed to process multiple uploaded images:', _error);
    }
  };

  
  const handleDeleteImage = async (index: number, imagePath: string) => {
    
    const currentImages = [...imagesRef.current];
    const updatedImages = currentImages.filter((image) => image !== imagePath);
    updateImages(updatedImages);

    const replacementImagePath =
      updatedImages[Math.min(index, updatedImages.length - 1)];
    removeAnnotation(imagePath, replacementImagePath);

    
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

  return (
    <FormSection title={t('form.section.attachments')}>
      
      {onAddImage && (
        <div className="field">
          <div className="label">{t('form.section.attachments')}</div>

          
          <ImageUploader
            onImageUploaded={handleImageUploaded}
            onMultipleImagesUploaded={handleMultipleImagesUploaded}
            label={t('button.upload-image')}
            enableDragDrop={true}
            saveImageFunction={saveImage}
            enablePaste={true}
            pasteContext={tradeContext}
          />

          <TradeAttachmentUrlInput
            sourcePath={sourcePath}
            hasImage={(imagePath) => imagesRef.current.includes(imagePath)}
            onAddImagePath={handleImageUploaded}
          />

          
          {data.images && data.images.length > 0 && (
            <div className="trade-form-attachments">
              <ImageCarousel
                images={data.images}
                altPrefix={t('form.field.trade-image-alt')}
                displayOptions={{
                  showThumbnails: true,
                  showCounter: true,
                  enableFullscreen: true,
                }}
                deleteOptions={{
                  enabled: true,
                  onDeleteImage: handleDeleteImage,
                }}
                annotationOptions={{
                  enabled: plugin !== null,
                  onAnnotateImage: handleAnnotateImage,
                  isAnnotated: (imagePath) =>
                    hasVisibleImageAnnotation(imageAnnotations[imagePath]),
                }}
                fullscreenAnnotationOptions={{
                  loadAnnotation: getAnnotation,
                  saveAnnotation,
                }}
                onSelectedImageChange={handleSelectedImageChange}
                useResolveMediaPath={true}
                sourcePath={sourcePath}
              />
              {plugin && editingImagePath ? (
                <div ref={annotationEditorRef}>
                  <TradeAttachmentAnnotationEditor
                    plugin={plugin}
                    imagePath={editingImagePath}
                    value={annotationDraft}
                    onChange={handleDraftChange}
                    onCancel={handleCancelAnnotation}
                    onDone={handleSaveAnnotation}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </FormSection>
  );
};

export const MetadataFields = React.memo(MetadataFieldsComponent);
