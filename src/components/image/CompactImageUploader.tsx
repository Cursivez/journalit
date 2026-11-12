

import React, { useState, useRef, useCallback, useId } from 'react';
import { Notice } from 'obsidian';
import { FolderOpen, ClipboardPaste } from '../shared/icons/ObsidianIcon';
import { t } from '../../lang/helpers';
import { PasteManager } from '../../utils/PasteManager';
import { getApp } from '../../utils/obsidian';
import { resolveImageInput } from '../../utils/imageMediaUtils';
import { readClipboardText } from '../../utils/clipboard';
import { shareCaptureExcludeProps } from '../../services/share/brandedCapture';

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
  
  saveImageFunction?: (file: File) => Promise<string>;
  
  multiple?: boolean;
  
  maxFiles?: number;
  
  className?: string;
  
  placeholder?: string;
  
  disabled?: boolean;
  
  sourcePath?: string;
}

function useCompactImageUploaderModel({
  onImageAdded,
  onMultipleImagesAdded,
  saveImageFunction,
  multiple,
  maxFiles,
  sourcePath = '',
}: Pick<
  CompactImageUploaderProps,
  | 'onImageAdded'
  | 'onMultipleImagesAdded'
  | 'saveImageFunction'
  | 'multiple'
  | 'maxFiles'
  | 'sourcePath'
>) {
  const [urlInput, setUrlInput] = useState('');
  
  
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);

  
  const addMediaPaths = useCallback(
    async (paths: string[]): Promise<boolean> => {
      if (paths.length === 0) return false;
      try {
        if (paths.length > 1 && onMultipleImagesAdded) {
          await onMultipleImagesAdded(paths);
        } else {
          await onImageAdded(paths[0]);
        }
        return true;
      } catch {
        setError(t('image.uploader.error-add-failed'));
        return false;
      }
    },
    [onImageAdded, onMultipleImagesAdded]
  );

  
  const handleUrlSubmit = useCallback(async () => {
    const url = urlInput.trim();
    if (!url) return;

    let finalUrl: string;
    try {
      finalUrl = resolveImageInput(getApp(), url, sourcePath);
    } catch {
      
      
      setError(t('image.uploader.error-invalid-url'));
      return;
    }

    
    
    setError(null);
    setUrlInput('');
    if (!(await addMediaPaths([finalUrl]))) {
      setUrlInput((current) => current || url);
    }
  }, [urlInput, addMediaPaths, sourcePath]);

  const changeUrlInput = useCallback((value: string) => {
    setUrlInput(value);
    setError(null);
  }, []);

  
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

  const takeSupportedFiles = useCallback(
    (files: File[]): File[] => {
      const unsupported = files.find(
        (file) => !isSupportedCompactMediaFile(file)
      );
      if (unsupported) {
        setError(
          t('image.uploader.error-unsupported-file', { name: unsupported.name })
        );
      }
      const supported = files.filter(isSupportedCompactMediaFile);
      return multiple ? supported : supported.slice(0, 1);
    },
    [multiple]
  );

  const saveImageFiles = useCallback(
    async (filesToProcess: File[], failureContext: string) => {
      if (maxFiles !== undefined && filesToProcess.length > maxFiles) {
        new Notice(
          t('image.uploader.too-many-files', { count: String(maxFiles) })
        );
        return [];
      }
      
      
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
          setError(t('image.uploader.error-save-failed', { name: file.name }));
          return [...paths, null];
        }
      }, Promise.resolve([]));

      return savedPaths.filter((path): path is string => path !== null);
    },
    [maxFiles, saveImageFunction]
  );

  
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setError(null);
      setIsProcessing(true);
      try {
        const filesToProcess = takeSupportedFiles(Array.from(files));
        await addMediaPaths(
          await saveImageFiles(filesToProcess, 'selected image')
        );
      } finally {
        setIsProcessing(false);
        
        if (e.target) e.target.value = '';
      }
    },
    [addMediaPaths, saveImageFiles, takeSupportedFiles]
  );

  
  const handleClipboardPaste = useCallback(async () => {
    if (isProcessing) return;

    setError(null);
    setIsProcessing(true);
    try {
      const result = await PasteManager.extractClipboardImages();

      if (!result.success || result.files.length === 0) {
        
        try {
          const text = await readClipboardText();
          if (text?.trim()) {
            changeUrlInput(text);
            return;
          }
        } catch {
          // intentional
        }

        setError(result.error ?? t('paste.error.no-images-found'));
        return;
      }

      
      const filesToProcess = multiple ? result.files : [result.files[0]];
      await addMediaPaths(await saveImageFiles(filesToProcess, 'pasted image'));
    } catch (error) {
      console.error('[CompactImageUploader] Paste error:', error);
      setError(t('error.clipboard.paste-failed'));
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, multiple, addMediaPaths, saveImageFiles, changeUrlInput]);

  
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

      setError(null);
      setIsProcessing(true);
      try {
        const filesToProcess = takeSupportedFiles(
          Array.from(e.dataTransfer.files)
        );
        await addMediaPaths(
          await saveImageFiles(filesToProcess, 'dropped image')
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [addMediaPaths, saveImageFiles, takeSupportedFiles]
  );

  return {
    urlInput,
    error,
    isDragging,
    isProcessing,
    fileInputRef,
    containerRef,
    changeUrlInput,
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
  errorId,
}: {
  model: CompactImageUploaderModel;
  className: string;
  placeholder: string;
  disabled: boolean;
  multiple: boolean;
  errorId: string;
}) {
  const {
    urlInput,
    error,
    isDragging,
    isProcessing,
    fileInputRef,
    containerRef,
    changeUrlInput,
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
      
      {...shareCaptureExcludeProps}
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
        onChange={(e) => changeUrlInput(e.target.value)}
        onKeyDown={(event) => void handleKeyDown(event)}
        placeholder={placeholder}
        disabled={disabled || isProcessing}
        aria-label={t('image.uploader.url-input-aria')}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
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
        tabIndex={-1}
      />
    </div>
  );
}

const CompactImageUploaderComponent: React.FC<CompactImageUploaderProps> = ({
  onImageAdded,
  onMultipleImagesAdded,
  saveImageFunction,
  multiple = true,
  maxFiles,
  className = '',
  placeholder = t('image.uploader.url-placeholder'),
  disabled = false,
  sourcePath = '',
}) => {
  const model = useCompactImageUploaderModel({
    onImageAdded,
    onMultipleImagesAdded,
    saveImageFunction,
    multiple,
    maxFiles,
    sourcePath,
  });
  const errorId = useId();

  return (
    <div className="journalit-compact-uploader-wrapper">
      <CompactImageUploaderControls
        model={model}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        multiple={multiple}
        errorId={errorId}
      />
      {model.error ? (
        <div
          id={errorId}
          
          {...shareCaptureExcludeProps}
          className="journalit-compact-uploader-error"
          role="alert"
        >
          {model.error}
        </div>
      ) : null}
    </div>
  );
};

export const CompactImageUploader = React.memo(CompactImageUploaderComponent);

CompactImageUploader.displayName = 'CompactImageUploader';
