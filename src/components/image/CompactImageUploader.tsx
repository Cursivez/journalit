

import React, { useState, useRef, useCallback } from 'react';
import { FolderOpen, ClipboardPaste } from '../shared/icons/ObsidianIcon';
import { t } from '../../lang/helpers';
import { imageService } from '../../services/image/ImageService';
import { PasteManager } from '../../utils/PasteManager';
import { getApp } from '../../utils/obsidian';
import { resolveImageInput } from '../../utils/imageMediaUtils';

interface CompactImageUploaderProps {
  
  onImageAdded: (imagePath: string) => void;
  
  onMultipleImagesAdded?: (imagePaths: string[]) => void;
  
  onError?: (error: Error) => void;
  
  saveImageFunction?: (file: File) => Promise<string>;
  
  multiple?: boolean;
  
  className?: string;
  
  placeholder?: string;
  
  disabled?: boolean;
  
  sourcePath?: string;
}

function useCompactImageUploaderModel({
  onImageAdded,
  onMultipleImagesAdded,
  onError,
  saveImageFunction,
  multiple,
  sourcePath = '',
}: Pick<
  CompactImageUploaderProps,
  | 'onImageAdded'
  | 'onMultipleImagesAdded'
  | 'onError'
  | 'saveImageFunction'
  | 'multiple'
  | 'sourcePath'
>) {
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);

  
  const handleUrlSubmit = useCallback(async () => {
    const url = urlInput.trim();
    if (!url) return;

    setIsProcessing(true);
    try {
      const finalUrl = resolveImageInput(getApp(), url, sourcePath);

      onImageAdded(finalUrl);
      setUrlInput('');
    } catch (error) {
      console.error('[CompactImageUploader] URL error:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [urlInput, onImageAdded, onError, sourcePath]);

  
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && urlInput.trim()) {
        e.preventDefault();
        handleUrlSubmit();
      }
    },
    [urlInput, handleUrlSubmit]
  );

  
  const handleFilePickerClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setIsProcessing(true);
      try {
        const imagePaths: string[] = [];
        const filesToProcess = multiple ? Array.from(files) : [files[0]];

        for (const file of filesToProcess) {
          try {
            if (saveImageFunction) {
              const path = await saveImageFunction(file);
              imagePaths.push(path);
            } else {
              console.warn(
                '[CompactImageUploader] No saveImageFunction provided'
              );
            }
          } catch (error) {
            console.error(
              `[CompactImageUploader] Failed to save ${file.name}:`,
              error
            );
            if (onError && error instanceof Error) onError(error);
          }
        }

        if (imagePaths.length > 1 && onMultipleImagesAdded) {
          onMultipleImagesAdded(imagePaths);
        } else if (imagePaths.length > 0) {
          onImageAdded(imagePaths[0]);
        }
      } finally {
        setIsProcessing(false);
        
        if (e.target) e.target.value = '';
      }
    },
    [saveImageFunction, multiple, onImageAdded, onMultipleImagesAdded, onError]
  );

  
  const handleClipboardPaste = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await PasteManager.extractClipboardImages();

      if (!result.success || result.files.length === 0) {
        
        try {
          const text = await navigator.clipboard.readText();
          if (text?.trim()) {
            setUrlInput(text);
            setIsProcessing(false);
            return;
          }
        } catch {
          // intentional
        }

        if (result.error && !result.error.includes('No images found')) {
          throw new Error(result.error);
        }
        return;
      }

      
      const imagePaths: string[] = [];
      const filesToProcess = multiple ? result.files : [result.files[0]];

      for (const file of filesToProcess) {
        try {
          if (saveImageFunction) {
            const path = await saveImageFunction(file);
            imagePaths.push(path);
          }
        } catch (error) {
          console.error(
            `[CompactImageUploader] Failed to save pasted image:`,
            error
          );
          if (onError && error instanceof Error) onError(error);
        }
      }

      if (imagePaths.length > 1 && onMultipleImagesAdded) {
        onMultipleImagesAdded(imagePaths);
      } else if (imagePaths.length > 0) {
        onImageAdded(imagePaths[0]);
      }
    } catch (error) {
      console.error('[CompactImageUploader] Paste error:', error);
      if (onError && error instanceof Error) onError(error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing,
    saveImageFunction,
    multiple,
    onImageAdded,
    onMultipleImagesAdded,
    onError,
  ]);

  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);

      if (!e.dataTransfer.files?.length) return;

      setIsProcessing(true);
      try {
        const imageFiles = imageService.getImagesFromDataTransfer(
          e.dataTransfer
        );
        if (imageFiles.length === 0) return;

        const imagePaths: string[] = [];
        const filesToProcess = multiple ? imageFiles : [imageFiles[0]];

        for (const file of filesToProcess) {
          try {
            if (saveImageFunction) {
              const path = await saveImageFunction(file);
              imagePaths.push(path);
            }
          } catch (error) {
            console.error(
              `[CompactImageUploader] Failed to save dropped image:`,
              error
            );
            if (onError && error instanceof Error) onError(error);
          }
        }

        if (imagePaths.length > 1 && onMultipleImagesAdded) {
          onMultipleImagesAdded(imagePaths);
        } else if (imagePaths.length > 0) {
          onImageAdded(imagePaths[0]);
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [saveImageFunction, multiple, onImageAdded, onMultipleImagesAdded, onError]
  );

  return {
    urlInput,
    isDragging,
    isProcessing,
    fileInputRef,
    containerRef,
    setUrlInput,
    handleKeyDown,
    handleFilePickerClick,
    handleFileSelect,
    handleClipboardPaste,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}

type CompactImageUploaderModel = ReturnType<
  typeof useCompactImageUploaderModel
>;

function CompactImageUploaderControls({
  model,
  className,
  placeholder,
  disabled,
  multiple,
}: {
  model: CompactImageUploaderModel;
  className: string;
  placeholder: string;
  disabled: boolean;
  multiple: boolean;
}) {
  const {
    urlInput,
    isDragging,
    isProcessing,
    fileInputRef,
    containerRef,
    setUrlInput,
    handleKeyDown,
    handleFilePickerClick,
    handleFileSelect,
    handleClipboardPaste,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = model;

  return (
    <div
      ref={containerRef}
      className={`journalit-compact-uploader journalit-compact-uploader-container ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''} ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="text"
        className="journalit-compact-uploader-url-input"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isProcessing}
        aria-label={t('image.uploader.url-input-aria')}
      />

      <button
        type="button"
        className="journalit-compact-uploader-btn clickable-icon"
        onClick={handleFilePickerClick}
        disabled={disabled || isProcessing}
        aria-label={t('image.uploader.file-upload-aria')}
      >
        <FolderOpen size={16} />
      </button>

      <button
        type="button"
        className="journalit-compact-uploader-btn clickable-icon"
        onClick={handleClipboardPaste}
        disabled={disabled || isProcessing}
        aria-label={t('image.uploader.paste-clipboard-aria')}
      >
        <ClipboardPaste size={16} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="journalit-compact-uploader-file-input"
        aria-hidden="true"
      />
    </div>
  );
}

const CompactImageUploaderComponent: React.FC<CompactImageUploaderProps> = ({
  onImageAdded,
  onMultipleImagesAdded,
  onError,
  saveImageFunction,
  multiple = true,
  className = '',
  placeholder = t('image.uploader.url-placeholder'),
  disabled = false,
  sourcePath = '',
}) => {
  const model = useCompactImageUploaderModel({
    onImageAdded,
    onMultipleImagesAdded,
    onError,
    saveImageFunction,
    multiple,
    sourcePath,
  });

  return (
    <div className="journalit-compact-uploader-wrapper">
      <CompactImageUploaderControls
        model={model}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        multiple={multiple}
      />
    </div>
  );
};

export const CompactImageUploader = React.memo(CompactImageUploaderComponent);

CompactImageUploader.displayName = 'CompactImageUploader';
