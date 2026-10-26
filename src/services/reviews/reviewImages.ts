import { normalizePath } from 'obsidian';



export type ReviewImageNoteType =
  | 'drc'
  | 'weekly-review'
  | 'monthly-review'
  | 'quarterly-review'
  | 'yearly-review';


export interface ImagesWidgetBlock {
  
  readonly position: number;
  
  readonly id?: string;
  
  readonly key: string;
}

const IMAGES_FENCE = '```journalit-images';
const WIDGET_UPLOAD_NAME =
  /^(?:img|drc|weekly|monthly|quarterly|yearly)(?:-[A-Za-z0-9]+)*-\d{10,}\.[^.]+$/i;


export function findImagesWidgets(content: string): ImagesWidgetBlock[] {
  const lines = content.split('\n');
  const blocks: ImagesWidgetBlock[] = [];
  for (let start = 0; start < lines.length; start++) {
    if (!lines[start].trim().startsWith(IMAGES_FENCE)) continue;
    let id: string | undefined;
    for (let line = start + 1; line < lines.length; line++) {
      const trimmed = lines[line].trim();
      if (trimmed === '```') break;
      if (trimmed.startsWith('id:')) {
        id = trimmed.slice('id:'.length).trim() || undefined;
        break;
      }
    }
    const position = blocks.length + 1;
    blocks.push({ position, id, key: id ?? `images_${position}` });
  }
  return blocks;
}

export function normalizeReviewImages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

export function normalizeReviewImagesByWidget(
  value: unknown
): Record<string, string[]> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {};
  }
  const result: Record<string, string[]> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (Array.isArray(entry)) result[key] = normalizeReviewImages(entry);
  }
  return result;
}


export function widgetImages(
  frontmatter: Readonly<Record<string, unknown>>,
  block: ImagesWidgetBlock
): string[] {
  const own =
    block.id === undefined
      ? undefined
      : normalizeReviewImagesByWidget(frontmatter.imagesByWidget)[block.id];
  if (own !== undefined) return own;
  return block.position === 1 ? normalizeReviewImages(frontmatter.images) : [];
}


export function reviewMediaFolder(notePath: string): string {
  const lastSlash = notePath.lastIndexOf('/');
  const parent = lastSlash > 0 ? notePath.substring(0, lastSlash) : '';
  return parent ? `${parent}/media` : 'media';
}


export function reviewImageFilename(
  noteType: ReviewImageNoteType | null,
  date: string | undefined,
  extension: string,
  timestamp: number
): string {
  const parsed = date ? new Date(date) : null;
  const valid = parsed !== null && !Number.isNaN(parsed.getTime());
  switch (noteType) {
    case 'drc': {
      if (!valid) return `drc-${timestamp}${extension}`;
      const dd = String(parsed.getDate()).padStart(2, '0');
      const mm = String(parsed.getMonth() + 1).padStart(2, '0');
      return `drc-${dd}${mm}${parsed.getFullYear()}-${timestamp}${extension}`;
    }
    case 'weekly-review': {
      const week = date?.match(/W(\d+)/i);
      const weekNumber = week ? week[1].padStart(2, '0') : '00';
      return `weekly-W${weekNumber}-${timestamp}${extension}`;
    }
    case 'monthly-review': {
      if (!valid) return `monthly-${timestamp}${extension}`;
      const mm = String(parsed.getMonth() + 1).padStart(2, '0');
      return `monthly-${mm}${parsed.getFullYear()}-${timestamp}${extension}`;
    }
    case 'quarterly-review': {
      if (!valid) return `quarterly-${timestamp}${extension}`;
      const quarter = Math.ceil((parsed.getMonth() + 1) / 3);
      return `quarterly-Q${quarter}${parsed.getFullYear()}-${timestamp}${extension}`;
    }
    case 'yearly-review':
      return valid
        ? `yearly-${parsed.getFullYear()}-${timestamp}${extension}`
        : `yearly-${timestamp}${extension}`;
    default:
      return `img-${timestamp}${extension}`;
  }
}


export function isReviewWidgetUpload(
  resolvedPath: string,
  notePath: string,
  supportedExtension: RegExp
): boolean {
  const normalizedPath = normalizePath(resolvedPath);
  const folder = normalizePath(reviewMediaFolder(notePath));
  if (!normalizedPath.startsWith(`${folder}/`)) return false;
  if (!supportedExtension.test(normalizedPath)) return false;
  return WIDGET_UPLOAD_NAME.test(normalizedPath.split('/').pop() ?? '');
}
