

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ClipboardPaste } from '../shared/icons/ObsidianIcon';
import { t } from '../../lang/helpers';
import { ImageUploadProps } from '../../types/image';
import { imageService } from '../../services/image/ImageService';
import { PasteManager, PasteContext } from '../../utils/PasteManager';
import { GlobalPasteManager } from '../../utils/GlobalPasteManager';




function useImageUploaderModel({
  onImageUploaded,
  onMultipleImagesUploaded,
  onError,
  enableDragDrop,
  inputId,
  saveImageFunction,
  multiple,
  enablePaste,
  pasteContext,
}: Pick<
  ImageUploadProps,
  | 'onImageUploaded'
  | 'onMultipleImagesUploaded'
  | 'onError'
  | 'enableDragDrop'
  | 'inputId'
  | 'saveImageFunction'
  | 'multiple'
  | 'enablePaste'
  | 'pasteContext'
>) {
  
  const generatedInputId = useRef(
    `image-upload-${Math.random().toString(36).substring(2, 11)}`
  );
  const actualInputId = inputId || generatedInputId.current;

  
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);
  const container = useRef<HTMLDivElement>(null);

  
  const [isPasting, setIsPasting] = useState(false);
  const [pasteSupported, setPasteSupported] = useState(false);

  
  const objectURLsRef = useRef<Set<string>>(new Set());

  
  const saveImageFunctionRef = useRef(saveImageFunction);
  const onImageUploadedRef = useRef(onImageUploaded);
  const onMultipleImagesUploadedRef = useRef(onMultipleImagesUploaded);
  const onErrorRef = useRef(onError);
  const handleClipboardPasteRef = useRef<(() => Promise<void>) | undefined>(
    undefined
  );

  
  useEffect(() => {
    saveImageFunctionRef.current = saveImageFunction;
    onImageUploadedRef.current = onImageUploaded;
    onMultipleImagesUploadedRef.current = onMultipleImagesUploaded;
    onErrorRef.current = onError;
  }, [saveImageFunction, onImageUploaded, onMultipleImagesUploaded, onError]);

  

  
  useEffect(() => {
    const urls = objectURLsRef.current;
    return () => {
      
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      urls.clear();
    };
  }, []);

  
  const handleClipboardPaste = useCallback(async () => {
    if (!enablePaste || isPasting) return;

    setIsPasting(true);

    try {
      
      const result = await PasteManager.extractClipboardImages();

      if (!result.success) {
        if (result.error && !result.error.includes('No images found')) {
          PasteManager.showPasteResult(result);
        }
        return;
      }

      
      const context: PasteContext = pasteContext || {
        contextType: 'generic',
        multiple: multiple,
      };

      
      const contextualFiles = PasteManager.createContextualFiles(
        result.files,
        context
      );

      
      const imagePaths: string[] = [];

      
      const filesToProcess = multiple ? contextualFiles : [contextualFiles[0]];

      
      for (const file of filesToProcess) {
        try {
          let imagePath: string;

          
          if (saveImageFunctionRef.current) {
            imagePath = await saveImageFunctionRef.current(file);
            imagePaths.push(imagePath);
          } else {
            
            console.warn(
              'No saveImageFunction provided, using placeholder implementation'
            );
            imagePath = createTrackedObjectURL(file);
            imagePaths.push(imagePath);
          }
        } catch (error) {
          console.error(`Failed to process pasted image ${file.name}:`, error);
          if (onErrorRef.current && error instanceof Error)
            onErrorRef.current(error);
        }
      }

      
      if (
        multiple &&
        imagePaths.length > 1 &&
        onMultipleImagesUploadedRef.current
      ) {
        onMultipleImagesUploadedRef.current(imagePaths);
      } else if (imagePaths.length > 0 && onImageUploadedRef.current) {
        onImageUploadedRef.current(imagePaths[0]);
      }

      
      PasteManager.showPasteResult(result, imagePaths.length);
    } catch (error) {
      console.error('Failed to handle paste:', error);
      if (onErrorRef.current && error instanceof Error)
        onErrorRef.current(error);
    } finally {
      setIsPasting(false);
    }
  }, [enablePaste, isPasting, pasteContext, multiple]); 

  
  useEffect(() => {
    handleClipboardPasteRef.current = handleClipboardPaste;
  }, [handleClipboardPaste]);

  
  useEffect(() => {
    if (
      !enablePaste ||
      !container.current ||
      !PasteManager.isClipboardSupported()
    ) {
      return;
    }

    setPasteSupported(true);

    
    const isTradeForm = pasteContext?.contextType === 'trade';

    if (isTradeForm) {
      const context: PasteContext = pasteContext || {
        contextType: 'generic',
        multiple: multiple,
      };

      const handler = GlobalPasteManager.createImageUploaderHandler(
        container.current,
        context,
        async (files: File[]) => {
          
          const imagePaths: string[] = [];

          for (const file of files) {
            try {
              let imagePath: string;

              
              if (saveImageFunctionRef.current) {
                imagePath = await saveImageFunctionRef.current(file);
                imagePaths.push(imagePath);
              } else {
                
                console.warn(
                  'No saveImageFunction provided, using placeholder implementation'
                );
                imagePath = createTrackedObjectURL(file);
                imagePaths.push(imagePath);
              }
            } catch (error) {
              console.error(
                `Failed to process pasted image ${file.name}:`,
                error
              );
              if (onErrorRef.current && error instanceof Error)
                onErrorRef.current(error);
            }
          }

          
          if (
            multiple &&
            imagePaths.length > 1 &&
            onMultipleImagesUploadedRef.current
          ) {
            onMultipleImagesUploadedRef.current(imagePaths);
          } else if (imagePaths.length > 0 && onImageUploadedRef.current) {
            onImageUploadedRef.current(imagePaths[0]);
          }
        },
        multiple
      );

      GlobalPasteManager.getInstance().registerHandler(handler);

      
      
      return () => {
        
        GlobalPasteManager.getInstance().unregisterHandler(handler.id);
      };
    } else {
      
      const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleClipboardPasteRef.current?.();
      };

      
      
      const el = container.current;
      el.addEventListener('paste', handlePaste);

      return () => {
        el.removeEventListener('paste', handlePaste);
      };
    }
  }, [enablePaste, pasteContext, multiple]); 

  
  const createTrackedObjectURL = (file: File): string => {
    const url = URL.createObjectURL(file);
    objectURLsRef.current.add(url);
    return url;
  };

  
  

  
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      
      const imagePaths: string[] = [];

      
      const filesToProcess = multiple ? files : [files[0]];

      
      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        let imagePath: string;

        
        if (saveImageFunction) {
          try {
            imagePath = await saveImageFunction(file);
            
            imagePaths.push(imagePath);
          } catch (fileError) {
            console.error(`Failed to process image ${file.name}:`, fileError);
            if (onError && fileError instanceof Error) onError(fileError);
          }
        } else {
          
          
          console.warn(
            'No saveImageFunction provided, using placeholder implementation'
          );
          imagePath = createTrackedObjectURL(file);
          imagePaths.push(imagePath);
        }
      }

      
      if (multiple && imagePaths.length > 1 && onMultipleImagesUploaded) {
        onMultipleImagesUploaded(imagePaths);
      } else if (imagePaths.length > 0) {
        
        onImageUploaded(imagePaths[0]);
      }

      
      event.target.value = '';
    } catch (error) {
      console.error('Failed to process images:', error);
      if (onError && error instanceof Error) onError(error);
    }
  };

  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;

    e.preventDefault();
    e.stopPropagation();

    dragCounter.current++;

    
    if (e.dataTransfer.types.includes('Files')) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;

    e.preventDefault();
    e.stopPropagation();

    dragCounter.current--;

    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDraggingOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;

    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;

    e.preventDefault();
    e.stopPropagation();

    
    dragCounter.current = 0;
    setIsDraggingOver(false);

    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imageFiles = imageService.getImagesFromDataTransfer(e.dataTransfer);

      if (imageFiles.length > 0) {
        
        const imagePaths: string[] = [];

        
        const filesToProcess = multiple ? imageFiles : [imageFiles[0]];

        
        for (const imageFile of filesToProcess) {
          try {
            let imagePath: string;

            
            if (saveImageFunction) {
              imagePath = await saveImageFunction(imageFile);
              imagePaths.push(imagePath);
            } else {
              
              console.warn(
                'No saveImageFunction provided, using placeholder implementation'
              );
              imagePath = createTrackedObjectURL(imageFile);
              imagePaths.push(imagePath);
            }
          } catch (error) {
            console.error(
              `Failed to process dropped image ${imageFile.name}:`,
              error
            );
            if (onError && error instanceof Error) onError(error);
          }
        }

        
        if (multiple && imagePaths.length > 1 && onMultipleImagesUploaded) {
          onMultipleImagesUploaded(imagePaths);
        } else if (imagePaths.length > 0) {
          
          onImageUploaded(imagePaths[0]);
        }
      }
    }
  };

  
  const handleUploadAreaClick = () => {
    const fileInput = document.getElementById(
      actualInputId
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return {
    actualInputId,
    isDraggingOver,
    container,
    isPasting,
    pasteSupported,
    handleClipboardPaste,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleUploadAreaClick,
  };
}

type ImageUploaderModel = ReturnType<typeof useImageUploaderModel>;

function ImageUploadControls({
  model,
  label,
  enablePaste,
  draggingOverClass,
}: {
  model: ImageUploaderModel;
  label: string;
  enablePaste: boolean;
  draggingOverClass: string;
}) {
  const {
    isDraggingOver,
    isPasting,
    pasteSupported,
    handleClipboardPaste,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleUploadAreaClick,
  } = model;

  const handleUploadAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') {
      return;
    }

    e.preventDefault();
    handleUploadAreaClick();
  };

  return (
    <div className="journalit-image-upload-layout">
      
      <div
        className={`journalit-image-upload-file-area ${isDraggingOver ? draggingOverClass : ''} ${!enablePaste || !pasteSupported ? 'full-width' : ''}`}
        onClick={handleUploadAreaClick}
        onKeyDown={handleUploadAreaKeyDown}
        role="button"
        tabIndex={0}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <label className="journalit-image-upload-label">{label}</label>
      </div>

      
      {enablePaste && pasteSupported && (
        <button
          type="button"
          className={`journalit-image-upload-paste-area ${isPasting ? 'pasting' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClipboardPaste();
          }}
          disabled={isPasting}
          aria-label={t('image.uploader.paste-title')}
        >
          {isPasting ? (
            <>
              <span className="journalit-spinner"></span>
              <span className="paste-text">{t('image.uploader.pasting')}</span>
            </>
          ) : (
            <>
              <ClipboardPaste className="paste-icon" size={18} />
              <span className="paste-text">{t('image.uploader.paste')}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

export const ImageUploader: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  onMultipleImagesUploaded,
  onError,
  label = t('button.upload-image'),
  enableDragDrop = true,
  draggingOverClass = 'dragging-over',
  inputId,
  saveImageFunction,
  multiple = true, 
  enablePaste = false,
  pasteContext,
  className = '',
}) => {
  const model = useImageUploaderModel({
    onImageUploaded,
    onMultipleImagesUploaded,
    onError,
    enableDragDrop,
    inputId,
    saveImageFunction,
    multiple,
    enablePaste,
    pasteContext,
  });
  const { actualInputId, container, handleFileSelect } = model;

  return (
    <div
      ref={container}
      className={`journalit-image-upload-wrapper ${className}`}
      tabIndex={enablePaste ? 0 : -1} 
    >
      <ImageUploadControls
        model={model}
        label={label}
        enablePaste={enablePaste}
        draggingOverClass={draggingOverClass}
      />

      <input
        id={actualInputId}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="journalit-image-upload-input"
      />
    </div>
  );
};
