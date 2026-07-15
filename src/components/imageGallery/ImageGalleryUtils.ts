import { formatDateDisplay, parseLocalDateSafe } from '../../utils/dateUtils';
import { t } from '../../lang/helpers';
import type {
  ImageGalleryGroup,
  ImageGalleryItem,
  ImageGallerySize,
  ImageGallerySort,
  ImageGallerySourceType,
  ImageGalleryViewMode,
} from './types';

const IMAGE_GALLERY_VIRTUALIZATION_THRESHOLD = 80;
const IMAGE_GALLERY_GRID_GAP = 12;
const IMAGE_GALLERY_MIN_CARD_WIDTH: Record<ImageGallerySize, number> = {
  small: 238,
  medium: 340,
  large: 460,
};
const IMAGE_GALLERY_CARD_EXTRA_HEIGHT: Record<ImageGallerySize, number> = {
  small: 50,
  medium: 50,
  large: 50,
};
const IMAGE_GALLERY_SCROLL_UPDATE_ROW_GRANULARITY = 2;

export function getImageGalleryVirtualWindow(
  itemCount: number,
  size: ImageGallerySize,
  viewport: { width: number; height: number; scrollTop: number }
): {
  startIndex: number;
  endIndex: number;
  topSpacerHeight: number;
  bottomSpacerHeight: number;
} {
  if (
    itemCount <= IMAGE_GALLERY_VIRTUALIZATION_THRESHOLD ||
    viewport.width <= 0 ||
    viewport.height <= 0
  ) {
    return {
      startIndex: 0,
      endIndex: itemCount,
      topSpacerHeight: 0,
      bottomSpacerHeight: 0,
    };
  }

  const { columnCount, rowHeight } = getImageGalleryVirtualGridMetrics(
    size,
    viewport.width
  );
  const totalRows = Math.ceil(itemCount / columnCount);
  const overscanRows = 2;
  const maxFirstVisibleRow = Math.max(0, totalRows - 1);
  const firstVisibleRow = Math.min(
    maxFirstVisibleRow,
    Math.max(0, Math.floor(viewport.scrollTop / rowHeight) - overscanRows)
  );
  const lastVisibleRow = Math.min(
    totalRows,
    Math.ceil((viewport.scrollTop + viewport.height) / rowHeight) + overscanRows
  );

  return {
    startIndex: firstVisibleRow * columnCount,
    endIndex: Math.min(itemCount, lastVisibleRow * columnCount),
    topSpacerHeight: firstVisibleRow * rowHeight,
    bottomSpacerHeight: Math.max(0, (totalRows - lastVisibleRow) * rowHeight),
  };
}

export function shouldUpdateImageGalleryViewport(
  previousViewport: { width: number; height: number; scrollTop: number },
  nextViewport: { width: number; height: number; scrollTop: number },
  size: ImageGallerySize
): boolean {
  if (
    previousViewport.width !== nextViewport.width ||
    previousViewport.height !== nextViewport.height
  ) {
    return true;
  }

  if (nextViewport.width <= 0) return false;

  const { rowHeight } = getImageGalleryVirtualGridMetrics(
    size,
    nextViewport.width
  );
  if (rowHeight <= 0)
    return previousViewport.scrollTop !== nextViewport.scrollTop;

  return (
    Math.floor(
      previousViewport.scrollTop /
        (rowHeight * IMAGE_GALLERY_SCROLL_UPDATE_ROW_GRANULARITY)
    ) !==
    Math.floor(
      nextViewport.scrollTop /
        (rowHeight * IMAGE_GALLERY_SCROLL_UPDATE_ROW_GRANULARITY)
    )
  );
}

function getImageGalleryVirtualGridMetrics(
  size: ImageGallerySize,
  viewportWidth: number
): { columnCount: number; rowHeight: number } {
  const minCardWidth = IMAGE_GALLERY_MIN_CARD_WIDTH[size];
  const columnCount = Math.max(
    1,
    Math.floor(
      (viewportWidth + IMAGE_GALLERY_GRID_GAP) /
        (minCardWidth + IMAGE_GALLERY_GRID_GAP)
    )
  );
  const cardWidth =
    (viewportWidth - IMAGE_GALLERY_GRID_GAP * (columnCount - 1)) / columnCount;

  return {
    columnCount,
    rowHeight:
      (cardWidth * 9) / 16 +
      IMAGE_GALLERY_CARD_EXTRA_HEIGHT[size] +
      IMAGE_GALLERY_GRID_GAP,
  };
}

export function filterImageGalleryItemsBySource(
  items: ImageGalleryItem[],
  sourceType: ImageGallerySourceType
): ImageGalleryItem[] {
  if (sourceType === 'all') return items;
  if (sourceType === 'reviews') {
    return items.filter((item) => item.sourceType !== 'trade');
  }
  return items.filter((item) => item.sourceType === sourceType);
}

export function sortImageGalleryItems(
  items: ImageGalleryItem[],
  sort: ImageGallerySort
): ImageGalleryItem[] {
  return Array.from(items).sort((a, b) => {
    switch (sort) {
      case 'oldest':
        return getImageGalleryTimestamp(a) - getImageGalleryTimestamp(b);
      case 'best':
        return (b.pnl ?? 0) - (a.pnl ?? 0);
      case 'worst':
        return (a.pnl ?? 0) - (b.pnl ?? 0);
      case 'newest':
        return getImageGalleryTimestamp(b) - getImageGalleryTimestamp(a);
    }
  });
}

export function groupImageGalleryItems(
  items: ImageGalleryItem[],
  viewMode: ImageGalleryViewMode
): ImageGalleryGroup[] {
  if (viewMode === 'individual') {
    return items.map((item) => ({ id: item.id, items: [item] }));
  }

  const groups = new Map<string, ImageGalleryGroup>();
  for (const item of items) {
    const groupId = getImageGalleryGroupId(item);
    const group = groups.get(groupId);
    if (group) {
      group.items.push(item);
    } else {
      groups.set(groupId, { id: groupId, items: [item] });
    }
  }

  return Array.from(groups.values());
}

function getImageGalleryGroupId(item: ImageGalleryItem): string {
  if (item.sourceType !== 'trade' || !item.isCopiedTrade) {
    return item.sourcePath;
  }

  return JSON.stringify([item.sourcePath, item.account ?? '']);
}

function getImageGalleryTimestamp(item: ImageGalleryItem): number {
  const timestamp = parseLocalDateSafe(item.date)?.getTime() ?? Number.NaN;
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function normalizeImageGallerySort(
  value: string | undefined
): ImageGallerySort {
  return value === 'oldest' || value === 'best' || value === 'worst'
    ? value
    : 'newest';
}

export function normalizeImageGallerySize(
  value: string | undefined
): ImageGallerySize {
  return value === 'small' || value === 'large' ? value : 'medium';
}

export function normalizeImageGalleryViewMode(
  value: string | undefined
): ImageGalleryViewMode {
  return value === 'individual' ? 'individual' : 'grouped';
}

export function normalizeImageGallerySourceType(
  value: string | undefined
): ImageGallerySourceType {
  switch (value) {
    case 'trade':
    case 'reviews':
    case 'drc':
    case 'weekly':
    case 'monthly':
    case 'quarterly':
    case 'yearly':
    case 'all':
      return value;
    default:
      return 'all';
  }
}

export function getImageGallerySortLabel(sort: ImageGallerySort): string {
  switch (sort) {
    case 'oldest':
      return t('imageGallery.sort.oldest');
    case 'best':
      return t('imageGallery.sort.best');
    case 'worst':
      return t('imageGallery.sort.worst');
    case 'newest':
      return t('imageGallery.sort.newest');
  }
}

export function getImageGallerySizeLabel(size: ImageGallerySize): string {
  switch (size) {
    case 'small':
      return t('imageGallery.size.small');
    case 'large':
      return t('imageGallery.size.large');
    case 'medium':
      return t('imageGallery.size.medium');
  }
}

export function getImageGalleryCardSourceLabel(item: ImageGalleryItem): string {
  if (item.sourceType === 'trade') {
    return (
      item.symbol || item.sourceLabel || getImageGallerySourceTypeLabel('trade')
    );
  }

  switch (item.sourceType) {
    case 'drc':
      return 'DRC';
    case 'weekly':
    case 'monthly':
    case 'quarterly':
    case 'yearly':
      return getImageGallerySourceTypeLabel(item.sourceType);
  }
}

export function getImageGalleryCardDateLabel(
  item: ImageGalleryItem,
  dateFormat?: string
): string {
  const date = parseImageGalleryDate(item.date);

  switch (item.sourceType) {
    case 'weekly':
      return (
        getWeekLabelFromPath(item.sourcePath) ??
        (date ? `W${getIsoWeekNumber(date)}` : 'W')
      );
    case 'monthly':
      return (
        getMonthLabelFromPath(item.sourcePath) ??
        (date ? date.toLocaleString(undefined, { month: 'long' }) : 'M')
      );
    case 'quarterly':
      return (
        getQuarterLabelFromPath(item.sourcePath) ??
        (date ? `Q${Math.floor(date.getMonth() / 3) + 1}` : 'Q')
      );
    case 'yearly':
      return (
        getYearLabelFromPath(item.sourcePath) ??
        (date ? String(date.getFullYear()) : 'Y')
      );
    case 'trade':
    case 'drc':
      return formatDateLabel(item.date, dateFormat);
  }
}

function getWeekLabelFromPath(path: string): string | null {
  const match = path.match(/(?:^|\/)W(\d{1,2})(?:\/|[-_]|$)/i);
  return match ? `W${match[1]}` : null;
}

function getMonthLabelFromPath(path: string): string | null {
  const match = path.match(
    /(?:^|\/)\d{4}\/(?:Q[1-4]\/)?(0[1-9]|1[0-2])(?:\/|[-_]|$)/i
  );
  if (!match) return null;

  const monthIndex = Number(match[1]) - 1;
  return new Date(2000, monthIndex, 1).toLocaleString(undefined, {
    month: 'long',
  });
}

function getQuarterLabelFromPath(path: string): string | null {
  const match = path.match(/(?:^|\/)Q([1-4])(?:\/|[-_]|$)/i);
  return match ? `Q${match[1]}` : null;
}

function getYearLabelFromPath(path: string): string | null {
  const match = path.match(/(?:^|\/)(\d{4})(?:\/|[-_]|$)/);
  return match ? match[1] : null;
}

export function formatHoverTags(tags: string[]): string {
  const visibleTags = tags.slice(0, 3);
  return `${visibleTags.join(', ')}${tags.length > visibleTags.length ? ', …' : ''}`;
}

function parseImageGalleryDate(value: string): Date | null {
  if (!value) return null;
  return parseLocalDateSafe(value);
}

function getIsoWeekNumber(date: Date): number {
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
}

export function getImageGallerySourceTypeLabel(
  sourceType: ImageGallerySourceType
): string {
  switch (sourceType) {
    case 'trade':
      return t('imageGallery.source.trade');
    case 'reviews':
      return t('imageGallery.source.reviews');
    case 'drc':
      return t('imageGallery.source.drc');
    case 'weekly':
      return t('imageGallery.source.weekly');
    case 'monthly':
      return t('imageGallery.source.monthly');
    case 'quarterly':
      return t('imageGallery.source.quarterly');
    case 'yearly':
      return t('imageGallery.source.yearly');
    case 'all':
      return t('imageGallery.source.all');
  }
}

export function getImageGalleryFullscreenTitle(
  item: ImageGalleryItem,
  dateFormat?: string
): string {
  return `${item.sourceLabel || getImageGallerySourceTypeLabel(item.sourceType)} · ${formatDateLabel(
    item.date,
    dateFormat
  )}`;
}

function formatDateLabel(value: string, dateFormat?: string): string {
  if (!value) return t('imageGallery.date.unknown');
  const date = parseLocalDateSafe(value);
  if (!date) return value;
  if (dateFormat) return formatDateDisplay(date, dateFormat);
  return date.toLocaleDateString();
}
