

import {
  isReviewWidgetUpload,
  normalizeReviewImages,
  normalizeReviewImagesByWidget,
  reviewImageFilename,
  reviewMediaFolder,
} from '../../../services/reviews/reviewImages';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReviewReadOnly } from '../ReviewReadOnlyContext';
import { Notice, TFile, normalizePath } from 'obsidian';
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
import {
  getSourceEditor,
  transformFileContent,
} from '../../../utils/fileMutation';
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

const IMAGES_FENCE_PREFIX = '```journalit-images';


const CODEBLOCK_SEARCH_WINDOW = 10;


const SETTLED_SAVE_QUEUE: Promise<void> = Promise.resolve();


function locateImagesCodeblock(
  lines: string[],
  target: { lineStart: number; index?: number }
): { start: number; id: string | null; idLine: number | null } | null {
  if (lines.length === 0) return null;

  const isImagesFence = (line: number): boolean =>
    line >= 0 &&
    line < lines.length &&
    lines[line].trim().startsWith(IMAGES_FENCE_PREFIX);

  const findByIndex = (targetIndex: number): number | null => {
    let count = 0;
    for (let i = 0; i < lines.length; i++) {
      if (!isImagesFence(i)) continue;
      if (count === targetIndex) return i;
      count += 1;
    }
    return null;
  };

  const findNearby = (): number | null => {
    const from = Math.min(Math.max(target.lineStart, 0), lines.length - 1);
    for (let i = from; i >= 0 && i >= from - CODEBLOCK_SEARCH_WINDOW; i--) {
      if (isImagesFence(i)) return i;
    }
    for (
      let i = from;
      i < lines.length && i <= from + CODEBLOCK_SEARCH_WINDOW;
      i++
    ) {
      if (isImagesFence(i)) return i;
    }
    return null;
  };

  let start: number | null = target.lineStart;
  if (!isImagesFence(start) && typeof target.index === 'number') {
    start = findByIndex(target.index);
  }
  if (start === null || !isImagesFence(start)) {
    start = findNearby();
  }
  if (start === null) return null;

  for (let i = start + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '```') break;
    if (trimmed.startsWith('id:')) {
      return {
        start,
        id: trimmed.slice('id:'.length).trim() || null,
        idLine: i,
      };
    }
  }
  return { start, id: null, idLine: null };
}


function withImagesCodeblockId(
  lines: string[],
  block: { start: number; idLine: number | null },
  id: string
): string[] {
  const next = [...lines];
  if (block.idLine === null) {
    next.splice(block.start + 1, 0, `id: ${id}`);
  } else {
    next[block.idLine] = `id: ${id}`;
  }
  return next;
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
  remainingImages?: number;
  filePath: string;
  onImageAdded: React.ComponentProps<
    typeof CompactImageUploader
  >['onImageAdded'];
  onMultipleImagesAdded: React.ComponentProps<
    typeof CompactImageUploader
  >['onMultipleImagesAdded'];
  saveImage: React.ComponentProps<
    typeof CompactImageUploader
  >['saveImageFunction'];
}> = ({
  preview,
  hasImages,
  remainingImages,
  filePath,
  onImageAdded,
  onMultipleImagesAdded,
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
      saveImageFunction={saveImage}
      multiple={true}
      maxFiles={remainingImages}
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
    const imagesRef = useRef<string[]>([]);
    
    
    
    
    const saveQueueRef = useRef<Promise<void>>(SETTLED_SAVE_QUEUE);
    const pendingSavesRef = useRef(0);
    const lastSavedImagesRef = useRef<string[] | null>(null);
    const showImages = useCallback((next: string[]) => {
      imagesRef.current = next;
      setImages(next);
    }, []);
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

    const loadImages = async () => {
      
      if (preview && previewData) {
        showImages(previewData.images || []);
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

      showImages(imageArray);
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
        const target = { lineStart, index: codeblockContext?.index };

        const editorContext = getSourceEditor(plugin.app, filePath);
        if (editorContext) {
          const block = locateImagesCodeblock(editorContext.lines, target);
          if (!block) return null;
          if (block.id) return block.id;
          const { editor } = editorContext;
          if (block.idLine === null) {
            editor.replaceRange(`id: ${newId}\n`, {
              line: block.start + 1,
              ch: 0,
            });
          } else {
            editor.replaceRange(
              `id: ${newId}`,
              { line: block.idLine, ch: 0 },
              { line: block.idLine, ch: editor.getLine(block.idLine).length }
            );
          }
          return newId;
        }

        const file = plugin.app.vault.getAbstractFileByPath(filePath);
        if (!(file instanceof TFile)) {
          return null;
        }
        
        
        let resolvedId: string | null = null;
        await transformFileContent(plugin.app, file, (content) => {
          const lines = content.split('\n');
          const block = locateImagesCodeblock(lines, target);
          resolvedId = block ? (block.id ?? newId) : null;
          if (!block || block.id) return content;
          return withImagesCodeblockId(lines, block, newId).join('\n');
        });
        return resolvedId;
      },
      [codeblockContext, filePath, plugin]
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

    const saveImagesChange = useCallback(
      (change: (current: string[]) => string[]): Promise<void> => {
        pendingSavesRef.current += 1;
        const run = saveQueueRef.current
          .then(async () => {
            const previous = lastSavedImagesRef.current ?? imagesRef.current;
            const next = change(previous);
            showImages(next);
            try {
              await updateFrontmatterImages(next);
              lastSavedImagesRef.current = next;
            } catch (error) {
              showImages(previous);
              throw error;
            }
          })
          .finally(() => {
            pendingSavesRef.current -= 1;
            if (pendingSavesRef.current === 0) {
              lastSavedImagesRef.current = null;
            }
          });
        saveQueueRef.current = run.catch(() => undefined);
        return run;
      },
      [showImages, updateFrontmatterImages]
    );

    
    const handleImageUploaded = useCallback(
      async (imagePath: string) => {
        try {
          await saveImagesChange((current) => [...current, imagePath]);
        } catch (error) {
          console.error('[ImageWidget] Failed to save image:', error);
          throw error;
        }
      },
      [saveImagesChange]
    );

    
    const handleMultipleImagesUploaded = useCallback(
      async (imagePaths: string[]) => {
        try {
          await saveImagesChange((current) => [...current, ...imagePaths]);
        } catch (error) {
          console.error('[ImageWidget] Failed to save images:', error);
          throw error;
        }
      },
      [saveImagesChange]
    );

    
    const handleDeleteImage = useCallback(
      async (index: number, imagePath: string) => {
        if (readOnly) return;

        try {
          await saveImagesChange((current) => {
            
            
            const at =
              current[index] === imagePath ? index : current.indexOf(imagePath);
            return at === -1 ? current : current.filter((_, i) => i !== at);
          });
        } catch (error) {
          console.error(
            '[ImageWidget] Failed to remove image from frontmatter:',
            error
          );
          new Notice(t('widget.images.notice-remove-failed'));
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
      [filePath, isWidgetOwnedUpload, plugin, readOnly, saveImagesChange]
    );

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
            remainingImages={
              maxImages === undefined ? undefined : maxImages - images.length
            }
            filePath={filePath}
            onImageAdded={handleImageUploaded}
            onMultipleImagesAdded={handleMultipleImagesUploaded}
            saveImage={saveImage}
          />
        )}
      </div>
    );
  }
);

ImageWidget.displayName = 'ImageWidget';
