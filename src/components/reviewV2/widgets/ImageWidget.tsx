

import {
  isReviewWidgetUpload,
  normalizeReviewImages,
  normalizeReviewImagesByWidget,
  reviewImageFilename,
  reviewMediaFolder,
} from '../../../services/reviews/reviewImages';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReviewReadOnly } from '../ReviewReadOnlyContext';
import { TFile, normalizePath } from 'obsidian';
import JournalitPlugin from '../../../main';
import { InvalidContextMessage } from './InvalidContextMessage';
import { ImageCarousel } from '../../image/ImageCarousel';
import { CompactImageUploader } from '../../image/CompactImageUploader';
import { StackedMediaList } from '../../image/StackedMediaList';
import { eventBus } from '../../../services/events/EventBus';
import { reviewChangeAffectsPath } from '../../../services/events/reviewChangedPaths';
import { SkeletonBox } from '../../shared/SkeletonBox';

import { t } from '../../../lang/helpers';
import { generateUUID } from '../../../utils/uuid';
import { forceMetadataCacheRefresh } from '../../../utils/dataRefresh';
import { replaceFileContent } from '../../../utils/fileMutation';
import {
  isMarkdownView,
  isViewWithTFile,
} from '../../../types/obsidian-extensions';
import { resolveMediaDisplayPath } from '../../../utils/imageMediaUtils';


const MAX_FRONTMATTER_RETRIES = 5;
const FRONTMATTER_RETRY_DELAY_MS = 150;
const SUPPORTED_UPLOAD_MEDIA_EXTENSION_PATTERN =
  /\.(?:jpe?g|png|gif|bmp|webp|svg|mp4|webm|mov|m4v|ogv|ogg|3gp|mkv)$/i;


type SupportedImageNoteType =
  | 'drc'
  | 'weekly-review'
  | 'monthly-review'
  | 'quarterly-review'
  | 'yearly-review';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  isRecord(value) ? value : undefined;

const getSupportedImageNoteType = (
  value: unknown
): SupportedImageNoteType | null => {
  switch (value) {
    case 'drc':
    case 'weekly-review':
    case 'monthly-review':
    case 'quarterly-review':
    case 'yearly-review':
      return value;
    default:
      return null;
  }
};

const getStringField = (
  record: Record<string, unknown>,
  key: string
): string => (typeof record[key] === 'string' ? record[key] : '');

export interface ImageWidgetConfig {
  id?: string;
  maxImages?: number;
  showUploader?: boolean;
  layout?: 'carousel' | 'stacked';
}

export interface ImageWidgetCodeblockContext {
  lineStart?: number;
  lineEnd?: number;
  index?: number;
  isLegacyOwner?: boolean;
  id?: string;
}

interface ImageWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: ImageWidgetConfig;
  preview?: boolean;
  previewData?: { images: string[] };
  codeblockContext?: ImageWidgetCodeblockContext;
}

interface NoteContext {
  type: SupportedImageNoteType;
  date: string;
}

function readImageWidgetOptions(
  config: ImageWidgetProps['config'],
  codeblockContext: ImageWidgetCodeblockContext | undefined,
  embeddedReadOnly: boolean
) {
  return {
    configId: config?.id?.trim() || null,
    contextId: codeblockContext?.id?.trim() || null,
    isLegacyOwner: codeblockContext?.isLegacyOwner ?? false,
    showUploader: !embeddedReadOnly && config?.showUploader !== false,
    maxImages: config?.maxImages, 
    layout: config?.layout || 'carousel',
  };
}

const ImageWidgetSkeleton: React.FC = () => (
  <div className="journalit-images-widget journalit-media-carousel-surface">
    
    <div className="journalit-reviewv2-images-skeleton-main">
      <SkeletonBox width="90%" height="180px" borderRadius="var(--radius-s)" />
    </div>
    
    <div className="journalit-reviewv2-images-skeleton-thumbs">
      {['first', 'second', 'third'].map((key) => (
        <SkeletonBox key={key} width={50} height={40} borderRadius="4px" />
      ))}
    </div>
  </div>
);

const ImageWidgetGallery: React.FC<{
  images: string[];
  layout: NonNullable<NonNullable<ImageWidgetProps['config']>['layout']>;
  readOnly: boolean;
  filePath: string;
  app: JournalitPlugin['app'];
  onDeleteImage: (index: number, imagePath: string) => Promise<void>;
}> = ({ images, layout, readOnly, filePath, app, onDeleteImage }) => {
  return (
    <>
      
      {layout === 'carousel' && (
        <ImageCarousel
          images={images}
          altPrefix={t('widget.images.alt-prefix')}
          displayOptions={{
            showThumbnails: images.length > 1,
            showCounter: images.length > 1,
            enableFullscreen: true,
          }}
          deleteOptions={{
            enabled: !readOnly,
            onDeleteImage: onDeleteImage,
          }}
          fullscreenAnnotationOptions={{ enabled: !readOnly }}
          useResolveMediaPath={true}
          sourcePath={filePath}
          className={images.length === 1 ? 'single-image-carousel' : ''}
        />
      )}

      
      {layout === 'stacked' && (
        <StackedMediaList
          app={app}
          images={images}
          sourcePath={filePath}
          altPrefix={t('widget.images.alt-prefix')}
          annotationsEnabled={!readOnly}
          onDelete={
            readOnly
              ? undefined
              : (index, imagePath) => void onDeleteImage(index, imagePath)
          }
        />
      )}
    </>
  );
};


const ImageWidgetUploader: React.FC<{
  preview: boolean;
  hasImages: boolean;
  filePath: string;
  onImageAdded: React.ComponentProps<
    typeof CompactImageUploader
  >['onImageAdded'];
  onMultipleImagesAdded: React.ComponentProps<
    typeof CompactImageUploader
  >['onMultipleImagesAdded'];
  onError: React.ComponentProps<typeof CompactImageUploader>['onError'];
  saveImage: React.ComponentProps<
    typeof CompactImageUploader
  >['saveImageFunction'];
}> = ({
  preview,
  hasImages,
  filePath,
  onImageAdded,
  onMultipleImagesAdded,
  onError,
  saveImage,
}) =>
  preview ? (
    <CompactImageUploader
      onImageAdded={() => {}}
      placeholder={t('widget.images.placeholder')}
      disabled={true}
      sourcePath={filePath}
      className="journalit-images-uploader"
    />
  ) : (
    <CompactImageUploader
      onImageAdded={onImageAdded}
      onMultipleImagesAdded={onMultipleImagesAdded}
      onError={onError}
      saveImageFunction={saveImage}
      multiple={true}
      sourcePath={filePath}
      placeholder={
        hasImages
          ? t('widget.images.placeholder-add-more')
          : t('widget.images.placeholder')
      }
      className="journalit-images-uploader"
    />
  );

export const ImageWidget: React.FC<ImageWidgetProps> = React.memo(
  ({ filePath, plugin, config, preview, previewData, codeblockContext }) => {
    const embeddedReadOnly = useReviewReadOnly();
    const readOnly = preview || embeddedReadOnly;
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isValidContext, setIsValidContext] = useState(true);
    const [noteContext, setNoteContext] = useState<NoteContext | null>(null);
    const {
      configId,
      contextId,
      isLegacyOwner,
      showUploader,
      maxImages,
      layout,
    } = readImageWidgetOptions(config, codeblockContext, embeddedReadOnly);
    const widgetIdRef = useRef<string | null>(configId || contextId);
    const retryCountRef = useRef(0);
    const retryTimeoutRef = useRef<number | null>(null);
    const isValidContextRef = useRef(isValidContext);
    const sessionUploadedImagesRef = useRef(new Set<string>());
    const hasReachedMaxImages =
      maxImages !== undefined && images.length >= maxImages;

    
    useEffect(() => {
      isValidContextRef.current = isValidContext;
    }, [isValidContext]);

    useEffect(() => {
      if (contextId && contextId !== widgetIdRef.current) {
        widgetIdRef.current = contextId;
        return;
      }

      if (configId && configId !== widgetIdRef.current) {
        widgetIdRef.current = configId;
      }
    }, [configId, contextId]);

    useEffect(() => {
      retryCountRef.current = 0;
      void loadImages();

      
      const handleMetadataChange = (file: TFile) => {
        if (file.path === filePath) {
          void loadImages();
        }
      };

      plugin.app.metadataCache.on('changed', handleMetadataChange);

      return () => {
        plugin.app.metadataCache.off('changed', handleMetadataChange);
        if (retryTimeoutRef.current) {
          window.clearTimeout(retryTimeoutRef.current);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- retry loader is intentionally stable for the selected widget image state
    }, [filePath, preview, previewData]);

    useEffect(() => {
      if (preview) return;

      const unsubscribe = eventBus.subscribe('review:changed', (payload) => {
        if (reviewChangeAffectsPath(payload, filePath)) {
          void loadImages();
        }
      });

      return () => {
        unsubscribe();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- image refresh is driven by explicit widget identity changes
    }, [filePath, preview]);

    const normalizeImagesArray = normalizeReviewImages;
    const normalizeImagesByWidget = normalizeReviewImagesByWidget;

    const getCurrentImagesByWidget = useCallback((): Record<
      string,
      string[]
    > => {
      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) return {};
      const cache = plugin.app.metadataCache.getFileCache(file);
      const frontmatter = asRecord(cache?.frontmatter);
      return normalizeImagesByWidget(frontmatter?.imagesByWidget);
    }, [filePath, plugin, normalizeImagesByWidget]);

    const getLegacyImages = useCallback((): string[] => {
      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) return [];
      const cache = plugin.app.metadataCache.getFileCache(file);
      const frontmatter = asRecord(cache?.frontmatter);
      return normalizeImagesArray(frontmatter?.images);
    }, [filePath, plugin, normalizeImagesArray]);

    const clearLegacyImages = useCallback(async (): Promise<void> => {
      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) return;

      await plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
        const record = asRecord(frontmatter) ?? {};
        if (record.images !== undefined) {
          delete record.images;
        }
      });

      await forceMetadataCacheRefresh(plugin.app, file);
    }, [filePath, plugin]);

    const getEditorContext = useCallback(() => {
      const leaves = plugin.app.workspace.getLeavesOfType('markdown');
      for (const leaf of leaves) {
        const view = leaf.view;
        if (!isMarkdownView(view) || !isViewWithTFile(view)) {
          continue;
        }

        if (view.file.path !== filePath) {
          continue;
        }

        const content = view.editor?.getValue();
        if (content === undefined) {
          continue;
        }

        return { lines: content.split('\n'), editor: view.editor };
      }

      return null;
    }, [filePath, plugin]);

    const loadImages = async () => {
      
      if (preview && previewData) {
        setImages(previewData.images || []);
        setLoading(false);
        setIsValidContext(true);
        return;
      }

      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      const cache = plugin.app.metadataCache.getFileCache(file);
      const frontmatter = asRecord(cache?.frontmatter);

      const noteType = frontmatter
        ? getSupportedImageNoteType(frontmatter.type)
        : null;
      if (!frontmatter || !noteType) {
        
        if (retryCountRef.current < MAX_FRONTMATTER_RETRIES) {
          retryCountRef.current++;
          retryTimeoutRef.current = window.setTimeout(
            () => void loadImages(),
            FRONTMATTER_RETRY_DELAY_MS
          );
          return;
        }
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      
      setNoteContext({
        type: noteType,
        date: getStringField(frontmatter, 'date'),
      });

      const imagesByWidget = normalizeImagesByWidget(
        frontmatter.imagesByWidget
      );
      const legacyImages = normalizeImagesArray(frontmatter.images);
      const resolvedWidgetId = widgetIdRef.current;
      const widgetImages = resolvedWidgetId
        ? imagesByWidget[resolvedWidgetId]
        : undefined;
      const useLegacyImages = isLegacyOwner && widgetImages === undefined;
      const imageArray = widgetImages ?? (useLegacyImages ? legacyImages : []);

      setImages(imageArray);
      setIsValidContext(true);
      setLoading(false);
    };

    
    const getMediaFolderPath = useCallback(
      (): string => reviewMediaFolder(filePath),
      [filePath]
    );

    
    const generateImageFilename = useCallback(
      (file: File): string => {
        const ext = file.name.includes('.')
          ? file.name.substring(file.name.lastIndexOf('.'))
          : '.png';
        return reviewImageFilename(
          noteContext?.type ?? null,
          noteContext?.date,
          ext,
          Date.now()
        );
      },
      [noteContext]
    );

    
    const saveImage = useCallback(
      async (file: File): Promise<string> => {
        if (
          !file.type.startsWith('image/') &&
          !SUPPORTED_UPLOAD_MEDIA_EXTENSION_PATTERN.test(file.name)
        ) {
          throw new Error(`Unsupported media file type: ${file.name}`);
        }

        const folderPath = getMediaFolderPath();
        const fileName = generateImageFilename(file);
        const fullPath = `${folderPath}/${fileName}`;

        try {
          const [, arrayBuffer] = await Promise.all([
            plugin.app.vault.adapter.mkdir(normalizePath(folderPath)),
            file.arrayBuffer(),
          ]);
          await plugin.app.vault.createBinary(
            normalizePath(fullPath),
            arrayBuffer
          );
          sessionUploadedImagesRef.current.add(fullPath);

          return fullPath;
        } catch (error) {
          console.error('[ImageWidget] Failed to save image file:', error);
          throw error;
        }
      },
      [plugin, getMediaFolderPath, generateImageFilename]
    );

    const isWidgetOwnedUpload = useCallback(
      (imagePath: string): boolean =>
        isReviewWidgetUpload(
          resolveMediaDisplayPath(plugin.app, imagePath, filePath),
          filePath,
          SUPPORTED_UPLOAD_MEDIA_EXTENSION_PATTERN
        ),
      [filePath, plugin.app]
    );

    const insertWidgetIdIntoCodeblock = useCallback(
      async (newId: string): Promise<string | null> => {
        const lineStart = codeblockContext?.lineStart;
        if (lineStart === undefined || lineStart === null) {
          return null;
        }

        const editorContext = getEditorContext();
        const lines = editorContext?.lines ?? null;

        let file: TFile | null = null;
        let fileLines = lines;
        if (!fileLines) {
          const abstractFile = plugin.app.vault.getAbstractFileByPath(filePath);
          if (!(abstractFile instanceof TFile)) {
            return null;
          }
          file = abstractFile;
          const content = await plugin.app.vault.read(file);
          fileLines = content.split('\n');
        }

        if (!fileLines || fileLines.length === 0) {
          return null;
        }

        const resolveStartByIndex = (
          lines: string[],
          targetIndex: number
        ): number | null => {
          let count = 0;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i]?.trim().startsWith('```journalit-images')) {
              if (count === targetIndex) {
                return i;
              }
              count += 1;
            }
          }
          return null;
        };

        const isImagesFence = (line: number | null): boolean => {
          return (
            line !== null &&
            line >= 0 &&
            line < fileLines.length &&
            fileLines[line]?.trim().startsWith('```journalit-images')
          );
        };

        const clampedLineStart = Math.min(
          Math.max(lineStart, 0),
          fileLines.length - 1
        );

        let startLine = lineStart;
        if (!isImagesFence(startLine)) {
          const resolvedByIndex =
            typeof codeblockContext?.index === 'number'
              ? resolveStartByIndex(fileLines, codeblockContext.index)
              : null;
          if (resolvedByIndex !== null) {
            startLine = resolvedByIndex;
          }
        }

        if (!isImagesFence(startLine)) {
          const searchWindow = 10;
          let resolved: number | null = null;
          for (
            let i = clampedLineStart;
            i >= 0 && i >= clampedLineStart - searchWindow;
            i--
          ) {
            if (isImagesFence(i)) {
              resolved = i;
              break;
            }
          }

          if (resolved === null) {
            for (
              let i = clampedLineStart;
              i < fileLines.length && i <= clampedLineStart + searchWindow;
              i++
            ) {
              if (isImagesFence(i)) {
                resolved = i;
                break;
              }
            }
          }

          if (resolved !== null) {
            startLine = resolved;
          }
        }

        if (!isImagesFence(startLine)) {
          return null;
        }

        let endLine = fileLines.length - 1;
        for (let i = startLine + 1; i < fileLines.length; i++) {
          if (fileLines[i]?.trim() === '```') {
            endLine = i;
            break;
          }
        }

        for (let i = startLine + 1; i <= endLine; i++) {
          const trimmed = fileLines[i].trim();
          if (trimmed === '```') {
            break;
          }
          if (trimmed.startsWith('id:')) {
            return trimmed.slice('id:'.length).trim();
          }
        }

        const insertion = `id: ${newId}\n`;
        if (editorContext?.editor) {
          editorContext.editor.replaceRange(insertion, {
            line: startLine + 1,
            ch: 0,
          });
        } else if (file) {
          fileLines.splice(startLine + 1, 0, `id: ${newId}`);
          await replaceFileContent(plugin.app, file, fileLines.join('\n'));
        } else {
          return null;
        }

        return newId;
      },
      [codeblockContext, filePath, plugin, getEditorContext]
    );

    const ensureWidgetId = useCallback(async (): Promise<string | null> => {
      if (preview) return null;

      if (widgetIdRef.current) {
        return widgetIdRef.current;
      }

      if (contextId) {
        widgetIdRef.current = contextId;
        return contextId;
      }

      const generatedId = `images-${generateUUID()}`;
      const persistedId = await insertWidgetIdIntoCodeblock(generatedId);
      if (!persistedId) {
        console.warn('[ImageWidget] Unable to persist widget id', {
          filePath,
        });
        return null;
      }

      widgetIdRef.current = persistedId;
      return persistedId;
    }, [preview, insertWidgetIdIntoCodeblock, filePath, contextId]);

    
    const updateFrontmatterImages = useCallback(
      async (newImages: string[]) => {
        if (readOnly || !noteContext) return;

        try {
          let updates: Record<string, unknown> | null = null;
          let resolvedWidgetId = widgetIdRef.current;
          const legacyImages = getLegacyImages();

          if (!resolvedWidgetId) {
            resolvedWidgetId = await ensureWidgetId();
          }

          if (resolvedWidgetId) {
            const existingImagesByWidget = getCurrentImagesByWidget();
            updates = {
              imagesByWidget: {
                ...existingImagesByWidget,
                [resolvedWidgetId]: newImages,
              },
            };
          } else if (isLegacyOwner) {
            updates = { images: newImages };
          }

          if (!updates) {
            throw new Error('Unable to save images: widget ID missing');
          }

          if (noteContext.type === 'drc') {
            await plugin.drcService.updateDRCFrontmatter(
              filePath,
              updates,
              'user-input'
            );
          } else if (noteContext.type === 'weekly-review') {
            await plugin.weeklyReviewService.updateWeeklyReviewFrontmatter(
              filePath,
              updates
            );
          } else if (noteContext.type === 'monthly-review') {
            const monthlyService =
              await plugin.serviceManager.getMonthlyReviewService();
            await monthlyService.updateMonthlyReviewFrontmatter(
              filePath,
              updates
            );
          } else if (noteContext.type === 'quarterly-review') {
            const quarterlyService =
              await plugin.serviceManager.getQuarterlyReviewService();
            await quarterlyService.updateQuarterlyReviewFrontmatter(
              filePath,
              updates
            );
          } else if (noteContext.type === 'yearly-review') {
            const yearlyService =
              await plugin.serviceManager.getYearlyReviewService();
            await yearlyService.updateYearlyReviewFrontmatter(
              filePath,
              updates
            );
          }

          if (resolvedWidgetId && isLegacyOwner && legacyImages.length > 0) {
            await clearLegacyImages();
          }

          
          const typeMap: Record<
            string,
            'drc' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
          > = {
            drc: 'drc',
            'weekly-review': 'weekly',
            'monthly-review': 'monthly',
            'quarterly-review': 'quarterly',
            'yearly-review': 'yearly',
          };
          const normalizedType = typeMap[noteContext.type] ?? 'drc';
          eventBus.publish('review:changed', {
            action: 'updated',
            type: normalizedType,
            filePath,
          });
        } catch (error) {
          console.error('[ImageWidget] Failed to update frontmatter:', error);
          throw error;
        }
      },
      [
        plugin,
        filePath,
        noteContext,
        readOnly,
        ensureWidgetId,
        getCurrentImagesByWidget,
        getLegacyImages,
        clearLegacyImages,
        isLegacyOwner,
      ]
    );

    
    const handleImageUploaded = useCallback(
      async (imagePath: string) => {
        const newImages = [...images, imagePath];
        setImages(newImages);
        try {
          await updateFrontmatterImages(newImages);
        } catch (error) {
          console.error('[ImageWidget] Failed to save image:', error);
          
          setImages(images);
        }
      },
      [images, updateFrontmatterImages]
    );

    
    const handleMultipleImagesUploaded = useCallback(
      async (imagePaths: string[]) => {
        const newImages = [...images, ...imagePaths];
        setImages(newImages);
        try {
          await updateFrontmatterImages(newImages);
        } catch (error) {
          console.error('[ImageWidget] Failed to save images:', error);
          
          setImages(images);
        }
      },
      [images, updateFrontmatterImages]
    );

    
    const handleDeleteImage = useCallback(
      async (index: number, imagePath: string) => {
        if (readOnly) return;

        const previousImages = images;
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);

        try {
          await updateFrontmatterImages(newImages);
        } catch (error) {
          console.error(
            '[ImageWidget] Failed to remove image from frontmatter:',
            error
          );
          setImages(previousImages);
          return;
        }

        
        try {
          if (
            !sessionUploadedImagesRef.current.has(imagePath) &&
            !isWidgetOwnedUpload(imagePath)
          ) {
            return;
          }

          const file = plugin.app.vault.getAbstractFileByPath(
            resolveMediaDisplayPath(plugin.app, imagePath, filePath)
          );
          if (file) {
            await plugin.app.fileManager.trashFile(file);
            sessionUploadedImagesRef.current.delete(imagePath);
          }
        } catch (error) {
          console.warn('[ImageWidget] Could not delete image file:', error);
          
        }
      },
      [
        filePath,
        images,
        isWidgetOwnedUpload,
        plugin,
        readOnly,
        updateFrontmatterImages,
      ]
    );

    
    const handleUploadError = useCallback((error: Error) => {
      console.error('[ImageWidget] Upload error:', error.message);
    }, []);

    if (loading) {
      return <ImageWidgetSkeleton />;
    }

    if (!isValidContext) {
      return (
        <InvalidContextMessage
          widgetType={t('widget.images.name')}
          reason={t('widget.images.invalid-context')}
        />
      );
    }

    return (
      <div className="journalit-images-widget journalit-media-carousel-surface">
        {images.length > 0 && (
          <ImageWidgetGallery
            images={images}
            layout={layout}
            readOnly={readOnly}
            filePath={filePath}
            app={plugin.app}
            onDeleteImage={handleDeleteImage}
          />
        )}

        
        {images.length === 0 && !showUploader && (
          <div className="journalit-images-empty">
            {t('widget.images.empty')}
          </div>
        )}

        {showUploader && !hasReachedMaxImages && (
          <ImageWidgetUploader
            preview={Boolean(preview)}
            hasImages={images.length > 0}
            filePath={filePath}
            onImageAdded={handleImageUploaded}
            onMultipleImagesAdded={handleMultipleImagesUploaded}
            onError={handleUploadError}
            saveImage={saveImage}
          />
        )}
      </div>
    );
  }
);

ImageWidget.displayName = 'ImageWidget';
