

import { unzipSync } from 'fflate';
import { TFile, type App } from 'obsidian';
import { eventBus } from '../events/EventBus';
import { imageService } from '../image/ImageService';
import { getTradeMediaOwner } from '../trade/core/TradeMediaOwnership';
import type { ClassifiedPreviewTrade, TradeImportEmbeddedImage } from './types';

const IMAGE_TYPES: Readonly<Record<string, string>> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
};


export function workbookImageCountForImport(
  classified: readonly ClassifiedPreviewTrade[],
  importAnywayItemIds: ReadonlySet<string>
): number {
  let count = 0;
  for (const item of classified) {
    if (
      item.defaultAction === 'create' ||
      importAnywayItemIds.has(item.itemId)
    ) {
      count += item.preview.embeddedImages?.length ?? 0;
    }
  }
  return count;
}


const MAX_WORKBOOK_IMAGE_BYTES = 20 * 1024 * 1024;

const MAX_WORKBOOK_IMAGES_TOTAL_BYTES = 100 * 1024 * 1024;


function compareColumns(left = '', right = ''): number {
  return left.length - right.length || left.localeCompare(right);
}

function imageExtension(path: string): string {
  return path.slice(path.lastIndexOf('.') + 1).toLowerCase();
}


export function isImportableWorkbookImage(path: string): boolean {
  return /^xl\/media\/[^/]+$/.test(path) && imageExtension(path) in IMAGE_TYPES;
}

export function workbookImageMimeType(path: string): string {
  return IMAGE_TYPES[imageExtension(path)] ?? 'application/octet-stream';
}


export async function readWorkbookImages(
  file: Blob,
  paths: readonly string[]
): Promise<Map<string, Uint8Array>> {
  const wanted = new Set(paths.filter(isImportableWorkbookImage));
  if (wanted.size === 0) return new Map();
  let budget = MAX_WORKBOOK_IMAGES_TOTAL_BYTES;
  const entries = unzipSync(new Uint8Array(await file.arrayBuffer()), {
    filter: (entry) => {
      if (
        !wanted.has(entry.name) ||
        entry.originalSize > MAX_WORKBOOK_IMAGE_BYTES ||
        entry.originalSize > budget
      ) {
        return false;
      }
      budget -= entry.originalSize;
      return true;
    },
  });
  return new Map(Object.entries(entries));
}

async function trashSavedImages(
  app: App,
  paths: readonly string[]
): Promise<void> {
  
  for (const path of paths) {
    const file = app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) continue;
    try {
      await app.fileManager.trashFile(file);
    } catch (error) {
      console.warn('[TradeImport] Failed to remove an unlinked image:', error);
    }
  }
}

export interface WorkbookImageTarget {
  
  filePath: string;
  symbol: string;
  images: readonly TradeImportEmbeddedImage[];
}

export interface WorkbookImageAttachResult {
  attachedCount: number;
  failedCount: number;
}


export async function attachWorkbookImagesToTrades(
  app: App,
  file: Blob,
  targets: readonly WorkbookImageTarget[]
): Promise<WorkbookImageAttachResult> {
  const withImages = targets.filter((target) => target.images.length > 0);
  if (withImages.length === 0) return { attachedCount: 0, failedCount: 0 };

  const bytesByPath = await readWorkbookImages(
    file,
    withImages.flatMap((target) => target.images.map((image) => image.path))
  );
  let attachedCount = 0;
  let failedCount = 0;
  const changedFilePaths: string[] = [];

  for (const target of withImages) {
    const owner = getTradeMediaOwner(target.filePath, target.symbol);
    const note = app.vault.getAbstractFileByPath(target.filePath);
    if (!owner || !(note instanceof TFile)) {
      failedCount += target.images.length;
      continue;
    }
    const savedPaths: string[] = [];
    const ordered = [...target.images].sort(
      (left, right) =>
        left.row - right.row || compareColumns(left.column, right.column)
    );
    
    
    for (const image of ordered) {
      const bytes = bytesByPath.get(image.path);
      if (!bytes) {
        failedCount += 1;
        continue;
      }
      try {
        const name = image.path.slice(image.path.lastIndexOf('/') + 1);
        
        const content = new Uint8Array(bytes.byteLength);
        content.set(bytes);
        savedPaths.push(
          await imageService.saveImage(
            new File([content], name, {
              type: workbookImageMimeType(image.path),
            }),
            owner.directory,
            
            owner.fileNamePrefix.slice(0, -1)
          )
        );
      } catch (error) {
        console.warn('[TradeImport] Failed to save a workbook image:', error);
        failedCount += 1;
      }
    }
    if (savedPaths.length === 0) continue;

    try {
      await app.fileManager.processFrontMatter(
        note,
        (frontmatter: Record<string, unknown>) => {
          const existing = frontmatter.images;
          const current = Array.isArray(existing)
            ? existing.filter(
                (value): value is string => typeof value === 'string'
              )
            : [];
          const linked = new Set(current);
          frontmatter.images = [
            ...current,
            ...savedPaths.filter((path) => !linked.has(path)),
          ];
        }
      );
    } catch (error) {
      
      
      console.warn('[TradeImport] Failed to link workbook images:', error);
      await trashSavedImages(app, savedPaths);
      failedCount += savedPaths.length;
      continue;
    }
    attachedCount += savedPaths.length;
    changedFilePaths.push(target.filePath);
  }

  if (changedFilePaths.length > 0) {
    eventBus.publish('trade:changed', {
      action: 'updated',
      filePaths: changedFilePaths,
    });
  }
  return { attachedCount, failedCount };
}
