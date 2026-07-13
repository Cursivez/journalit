import type { ImageGalleryItem } from '../../components/imageGallery/types';
import {
  getOptionalNumber,
  getString,
  getStringArray,
  IMAGE_GALLERY_INDEX_VERSION,
  isImageGalleryOutcome,
  isImageGallerySourceType,
  isRecord,
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

  if (
    !imagePath ||
    !sourcePath ||
    !isImageGallerySourceType(sourceType) ||
    !isImageGalleryOutcome(outcome)
  ) {
    return null;
  }

  return {
    id: getString(value.id) || `${sourcePath}:${imagePath}`,
    imagePath,
    sourcePath,
    sourceType,
    sourceLabel: getString(value.sourceLabel) || reviewSourceLabel(sourceType),
    date: getString(value.date) || '',
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
    sourceCustomFields: normalizeStringArrayRecord(value.sourceCustomFields),
    outcome,
    tradeStatus:
      value.tradeStatus === 'open' ||
      value.tradeStatus === 'win' ||
      value.tradeStatus === 'loss' ||
      value.tradeStatus === 'breakeven'
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
  if (!Array.isArray(value.items)) return null;

  return {
    version: IMAGE_GALLERY_INDEX_VERSION,
    timestamp: value.timestamp,
    settingsFingerprint: value.settingsFingerprint,
    items: value.items.flatMap((item) => {
      const normalizedItem = normalizeImageGalleryItem(item);
      return normalizedItem ? [normalizedItem] : [];
    }),
  };
}
