import { eventBus } from '../events';
import type { ImageGalleryAnnotation } from '../../components/imageGallery/types';
import { dedupeStrings } from './ImageGalleryInternal';

export function normalizeAnnotationForPersistence(
  annotation: ImageGalleryAnnotation
): Record<string, unknown> {
  const persisted: Record<string, unknown> = {};
  const tags = dedupeStrings(annotation.tags);
  const notes = annotation.notes?.trim();

  if (tags.length > 0) persisted.tags = tags;
  if (notes) persisted.notes = notes;

  return persisted;
}

export function isEmptyPersistedAnnotation(
  annotation: Record<string, unknown>
): boolean {
  return Object.keys(annotation).length === 0;
}

export function publishTradeAnnotationChanged(
  sourcePath: string,
  tradeType: 'regular' | 'missed' | 'backtest'
): void {
  const timestamp = Date.now();
  if (tradeType === 'missed') {
    eventBus.publish('missed-trade:changed', {
      action: 'updated',
      filePath: sourcePath,
      timestamp,
    });
    return;
  }
  if (tradeType === 'backtest') {
    eventBus.publish('backtest-trade:changed', {
      action: 'updated',
      filePath: sourcePath,
      timestamp,
    });
    return;
  }
  eventBus.publish('trade:changed', {
    action: 'updated',
    filePath: sourcePath,
    filePaths: [sourcePath],
    timestamp,
  });
}
