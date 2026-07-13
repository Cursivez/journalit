

import React, { useState, useRef, useCallback } from 'react';
import { FolderOpen, ClipboardPaste } from '../shared/icons/ObsidianIcon';
import { t } from '../../lang/helpers';
import { imageService } from '../../services/image/ImageService';
import { PasteManager } from '../../utils/PasteManager';
import { getApp } from '../../utils/obsidian';
import { resolveImageInput } from '../../utils/imageMediaUtils';
import { readClipboardText } from '../../utils/clipboard';

const SUPPORTED_MEDIA_FILE_EXTENSION_PATTERN =
  /\.(?:jpe?g|png|gif|bmp|webp|svg|mp4|webm|mov|m4v|ogv|ogg|3gp|mkv)$/i;

function isSupportedCompactMediaFile(file: File): boolean {
  return (
    file.type.startsWith('image/') ||
    SUPPORTED_MEDIA_FILE_EXTENSION_PATTERN.test(file.name)
  );
}

interface CompactImageUploaderProps {
  
  onImageAdded: (imagePath: string) => void | Promise<void>;
  
  onMultipleImagesAdded?: (imagePaths: string[]) => void | Promise<void>;
  
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

      void onImageAdded(finalUrl);
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
        void handleUrlSubmit();
      }
    },
    [urlInput, handleUrlSubmit]
  );

  
  const handleFilePickerClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const saveImageFiles = useCallback(
    async (filesToProcess: File[], failureContext: string) => {
      
      
      const savedPaths = await filesToProcess.reduce<
        Promise<(string | null)[]>
      >(async (previousSavedPaths, file) => {
        const paths = await previousSavedPaths;
        try {
          if (!saveImageFunction) {
            console.warn(
              '[CompactImageUploader] No saveImageFunction provided'
            );
            return [...paths, null];
          }

          return [...paths, await saveImageFunction(file)];
        } catch (error) {
          console.error(
            `[CompactImageUploader] Failed to save ${failureContext}:`,
            error
          );
          if (onError && error instanceof Error) onError(error);
          return [...paths, null];
        }
      }, Promise.resolve([]));

      return savedPaths.filter((path): path is string => path !== null);
    },
    [onError, saveImageFunction]
  );

  
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setIsProcessing(true);
      try {
        const supportedFiles = Array.from(files).filter((file) => {
          if (isSupportedCompactMediaFile(file)) return true;
          if (onError) {
            onError(new Error(`Unsupported media file type: ${file.name}`));
          }
          return false;
        });
        const filesToProcess = multiple
          ? supportedFiles
          : supportedFiles.slice(0, 1);
        if (filesToProcess.length === 0) return;

        const imagePaths = await saveImageFiles(
          filesToProcess,
          'selected image'
        );

        if (imagePaths.length > 1 && onMultipleImagesAdded) {
          void onMultipleImagesAdded(imagePaths);
        } else if (imagePaths.length > 0) {
          void onImageAdded(imagePaths[0]);
        }
      } finally {
        setIsProcessing(false);
        
        if (e.target) e.target.value = '';
      }
    },
    [multiple, onError, onImageAdded, onMultipleImagesAdded, saveImageFiles]
  );

  
  const handleClipboardPaste = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await PasteManager.extractClipboardImages();

      if (!result.success || result.files.length === 0) {
        
        try {
          const text = await readClipboardText();
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

      
      const filesToProcess = multiple ? result.files : [result.files[0]];
      const imagePaths = await saveImageFiles(filesToProcess, 'pasted image');

      if (imagePaths.length > 1 && onMultipleImagesAdded) {
        void onMultipleImagesAdded(imagePaths);
      } else if (imagePaths.length > 0) {
        void onImageAdded(imagePaths[0]);
      }
    } catch (error) {
      console.error('[CompactImageUploader] Paste error:', error);
      if (onError && error instanceof Error) onError(error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing,
    multiple,
    onImageAdded,
    onMultipleImagesAdded,
    onError,
    saveImageFiles,
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
        const imageFiles = imageService.getMediaFromDataTransfer(
          e.dataTransfer
        );
        if (imageFiles.length === 0) return;

        const filesToProcess = multiple ? imageFiles : [imageFiles[0]];
        const imagePaths = await saveImageFiles(
          filesToProcess,
          'dropped image'
        );

        if (imagePaths.length > 1 && onMultipleImagesAdded) {
          void onMultipleImagesAdded(imagePaths);
        } else if (imagePaths.length > 0) {
          void onImageAdded(imagePaths[0]);
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [multiple, onImageAdded, onMultipleImagesAdded, saveImageFiles]
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
      onDrop={(event) => void handleDrop(event)}
    >
      <input
        type="text"
        className="journalit-compact-uploader-url-input"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        onKeyDown={(event) => void handleKeyDown(event)}
        placeholder={placeholder}
        disabled={disabled || isProcessing}
        aria-label={t('image.uploader.url-input-aria')}
      />

      <button
        type="button"
        className="journalit-compact-uploader-btn clickable-icon"
        onClick={() => void handleFilePickerClick()}
        disabled={disabled || isProcessing}
        aria-label={t('image.uploader.file-upload-aria')}
      >
        <FolderOpen size={16} />
      </button>

      <button
        type="button"
        className="journalit-compact-uploader-btn clickable-icon"
        onClick={() => void handleClipboardPaste()}
        disabled={disabled || isProcessing}
        aria-label={t('image.uploader.paste-clipboard-aria')}
      >
        <ClipboardPaste size={16} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.mp4,.webm,.mov,.m4v,.ogv,.ogg,.3gp,.mkv"
        multiple={multiple}
        onChange={(event) => void handleFileSelect(event)}
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
