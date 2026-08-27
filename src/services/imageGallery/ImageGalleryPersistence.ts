import type { ImageGalleryItem } from '../../components/imageGallery/types';
import {
  getOptionalNumber,
  getString,
  getStringArray,
  IMAGE_GALLERY_INDEX_VERSION,
  isImageGalleryOutcome,
  isImageGallerySourceType,
  isRecord,
  type AnnotationNoteSignature,
  type PersistedImageGalleryIndex,
} from './ImageGalleryInternal';
import { normalizeStringArrayRecord } from './ImageGalleryFilters';
import { reviewSourceLabel } from './ImageGalleryProjection';

export function isMissingFileError(error: unknown): boolean {
  return (
    isRecord(error) &&
    (error.code === 'ENOENT' ||
      (typeof error.message === 'string' && error.message.includes('ENOENT')))
  );
}

function normalizeImageGalleryItem(value: unknown): ImageGalleryItem | null {
  if (!isRecord(value)) return null;
  const imagePath = getString(value.imagePath);
  const sourcePath = getString(value.sourcePath);
  const sourceType = value.sourceType;
  const outcome = value.outcome;
  const folderPath = getString(value.folderPath);

  if (
    !imagePath ||
    !sourcePath ||
    !isImageGallerySourceType(sourceType) ||
    !isImageGalleryOutcome(outcome) ||
    (sourceType === 'folder' && !folderPath)
  ) {
    return null;
  }

  return {
    id: getString(value.id) || `${sourcePath}:${imagePath}`,
    imagePath,
    sourcePath,
    sourceType,
    sourceLabel: getString(value.sourceLabel) || reviewSourceLabel(sourceType),
    folderPath,
    date: getString(value.date) || '',
    mediaMtime: getOptionalNumber(value.mediaMtime),
    symbol: getString(value.symbol),
    account: getString(value.account),
    accounts: getStringArray(value.accounts),
    direction: getString(value.direction),
    tradeType:
      value.tradeType === 'missed' || value.tradeType === 'backtest'
        ? value.tradeType
        : sourceType === 'trade'
          ? 'regular'
          : undefined,
    isCopiedTrade: value.isCopiedTrade === true,
    includeInAllAccounts: value.includeInAllAccounts === true,
    setupIds: getStringArray(value.setupIds),
    sourceTags: getStringArray(value.sourceTags),
    mistakes: getStringArray(value.mistakes),
    tags: getStringArray(value.tags),
    notes: getString(value.notes),
    hasOwnAnnotation:
      typeof value.hasOwnAnnotation === 'boolean'
        ? value.hasOwnAnnotation
        : undefined,
    sourceCustomFields: normalizeStringArrayRecord(value.sourceCustomFields),
    outcome,
    tradeStatus:
      value.tradeStatus === 'open' ||
      value.tradeStatus === 'closed' ||
      value.tradeStatus === 'win' ||
      value.tradeStatus === 'loss' ||
      value.tradeStatus === 'breakeven' ||
      value.tradeStatus === 'cancelled'
        ? value.tradeStatus
        : undefined,
    pnl: getOptionalNumber(value.pnl),
    rMultiple: getOptionalNumber(value.rMultiple),
    reviewed: typeof value.reviewed === 'boolean' ? value.reviewed : undefined,
  };
}

export function normalizePersistedImageGalleryIndex(
  value: unknown
): PersistedImageGalleryIndex | null {
  if (!isRecord(value)) return null;
  if (value.version !== IMAGE_GALLERY_INDEX_VERSION) return null;
  if (typeof value.timestamp !== 'number') return null;
  if (typeof value.settingsFingerprint !== 'string') return null;
  if (!isRecord(value.annotationNoteSignature)) return null;
  const signature = value.annotationNoteSignature;
  const annotationNoteSignature: AnnotationNoteSignature | null =
    signature.exists === false &&
    signature.mtime === null &&
    signature.size === null
      ? { exists: false, mtime: null, size: null }
      : signature.exists === true &&
          typeof signature.mtime === 'number' &&
          Number.isFinite(signature.mtime) &&
          typeof signature.size === 'number' &&
          Number.isFinite(signature.size)
        ? {
            exists: true,
            mtime: signature.mtime,
            size: signature.size,
          }
        : null;
  if (!annotationNoteSignature) return null;
  if (!Array.isArray(value.items)) return null;

  return {
    version: IMAGE_GALLERY_INDEX_VERSION,
    timestamp: value.timestamp,
    settingsFingerprint: value.settingsFingerprint,
    annotationNoteSignature,
    items: value.items.flatMap((item) => {
      const normalizedItem = normalizeImageGalleryItem(item);
      return normalizedItem ? [normalizedItem] : [];
    }),
  };
}
