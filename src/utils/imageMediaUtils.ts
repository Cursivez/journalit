import { App, TFile, normalizePath } from 'obsidian';
import { t } from '../lang/helpers';
import {
  convertTradingViewUrl,
  isTradingViewUrl,
  isValidImageUrl,
} from './imageUrlUtils';

const IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'bmp',
  'svg',
]);

const VIDEO_EXTENSIONS = new Set([
  'mp4',
  'webm',
  'mov',
  'm4v',
  'ogv',
  'ogg',
  '3gp',
  'mkv',
]);

type JournalitMediaKind =
  | 'image'
  | 'video'
  | 'youtube'
  | 'excalidraw'
  | 'unknown';

function normalizeMediaInput(input: string): string {
  const trimmed = input.trim();
  const wikilinkMatch = trimmed.match(/^!?(?:\[\[)([^\]]+)(?:\]\])$/);
  if (!wikilinkMatch) return trimmed;

  const linkTarget = wikilinkMatch[1].split('|')[0].trim();
  return linkTarget;
}

export function isExcalidrawFile(file: TFile, app: App): boolean {
  if (file.extension === 'excalidraw') return true;
  if (file.extension !== 'md') return false;

  const cache = app.metadataCache.getFileCache(file);
  return Boolean(cache?.frontmatter?.['excalidraw-plugin']);
}

function isImageFile(file: TFile): boolean {
  return IMAGE_EXTENSIONS.has(file.extension.toLowerCase());
}

function isVideoFile(file: TFile): boolean {
  return VIDEO_EXTENSIONS.has(file.extension.toLowerCase());
}

function getUrlExtension(url: string): string {
  try {
    const parsed = new URL(url);
    const fileName = parsed.pathname.split('/').pop() ?? '';
    return fileName.includes('.')
      ? (fileName.split('.').pop()?.toLowerCase() ?? '')
      : '';
  } catch {
    const path = url.split('?')[0].split('#')[0];
    return path.includes('.')
      ? (path.split('.').pop()?.toLowerCase() ?? '')
      : '';
  }
}

function isRemoteVideoMediaUrl(url: string): boolean {
  return (
    /^https?:\/\//i.test(url) && VIDEO_EXTENSIONS.has(getUrlExtension(url))
  );
}

function isInlineVideoMediaUrl(url: string): boolean {
  return /^data:video\//i.test(url);
}

function isValidYouTubeId(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(value);
}

export function parseYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(normalizeMediaInput(url));
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');

    if (hostname === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return isValidYouTubeId(id) ? id : null;
    }

    if (hostname !== 'youtube.com' && hostname !== 'm.youtube.com') {
      return null;
    }

    if (parsed.pathname === '/watch') {
      const id = parsed.searchParams.get('v');
      return isValidYouTubeId(id) ? id : null;
    }

    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'shorts' || pathParts[0] === 'embed') {
      const id = pathParts[1];
      return isValidYouTubeId(id) ? id : null;
    }

    return null;
  } catch {
    return null;
  }
}

function parseYouTubeTimestamp(value: string | null): number | null {
  if (!value) return null;

  const trimmed = value.trim().toLowerCase();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);

  const clockParts = trimmed.split(':');
  if (
    clockParts.length >= 2 &&
    clockParts.length <= 3 &&
    clockParts.every((part) => /^\d+$/.test(part))
  ) {
    return clockParts.reduce((total, part) => total * 60 + Number(part), 0);
  }

  const durationMatch = trimmed.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
  if (!durationMatch) return null;

  const [, hours = '0', minutes = '0', seconds = '0'] = durationMatch;
  const totalSeconds =
    Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  return totalSeconds > 0 ? totalSeconds : null;
}

function getYouTubeStartSeconds(url: string): number {
  try {
    const parsed = new URL(normalizeMediaInput(url));
    const startSeconds =
      parseYouTubeTimestamp(parsed.searchParams.get('start')) ??
      parseYouTubeTimestamp(parsed.searchParams.get('t'));
    return startSeconds ? Math.floor(startSeconds) : 0;
  } catch {
    return 0;
  }
}

function isYouTubeMediaUrl(url: string): boolean {
  return parseYouTubeVideoId(url) !== null;
}

export function getYouTubeThumbnailUrl(url: string): string {
  const videoId = parseYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
}

export function getYouTubeEmbedUrl(url: string): string {
  const videoId = parseYouTubeVideoId(url);
  const startSeconds = getYouTubeStartSeconds(url);
  return videoId
    ? `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&autoplay=0&enablejsapi=1&origin=app%3A%2F%2Fobsidian.md`
    : '';
}

export function isVideoMediaPath(
  app: App,
  pathOrLink: string,
  sourcePath = ''
): boolean {
  const normalized = normalizeMediaInput(pathOrLink);
  if (isInlineVideoMediaUrl(normalized)) return true;
  if (/^https?:\/\//i.test(normalized))
    return isRemoteVideoMediaUrl(normalized);

  const file = resolveVaultMediaFile(app, normalized, sourcePath);
  return file
    ? isVideoFile(file)
    : VIDEO_EXTENSIONS.has(getUrlExtension(normalized));
}

export function getMediaKind(
  app: App,
  pathOrLink: string,
  sourcePath = ''
): JournalitMediaKind {
  const normalized = normalizeMediaInput(pathOrLink);
  if (isYouTubeMediaUrl(normalized)) return 'youtube';
  if (isVideoMediaPath(app, normalized, sourcePath)) return 'video';
  if (isValidImageUrl(normalized) || /^data:image\//i.test(normalized)) {
    return 'image';
  }

  const file = resolveVaultMediaFile(app, normalized, sourcePath);
  if (!file) return 'unknown';
  if (isExcalidrawFile(file, app)) return 'excalidraw';
  if (isImageFile(file)) return 'image';
  if (isVideoFile(file)) return 'video';
  return 'unknown';
}

export function resolveVaultMediaFile(
  app: App,
  pathOrLink: string,
  sourcePath = ''
): TFile | null {
  const normalized = normalizeMediaInput(pathOrLink);
  const linkTarget = normalized.split('#')[0];

  if (sourcePath && linkTarget.includes('/')) {
    const sourceFolder = sourcePath.split('/').slice(0, -1).join('/');
    const sourceRelativePath = normalizePath(
      sourceFolder ? `${sourceFolder}/${linkTarget}` : linkTarget
    );
    const sourceRelativeFile =
      app.vault.getAbstractFileByPath(sourceRelativePath);
    if (sourceRelativeFile instanceof TFile) return sourceRelativeFile;
  }

  const linkFile = app.metadataCache.getFirstLinkpathDest(
    linkTarget,
    sourcePath
  );
  if (linkFile instanceof TFile) return linkFile;

  const directPath = normalizePath(normalized);
  const directFile = app.vault.getAbstractFileByPath(directPath);
  return directFile instanceof TFile ? directFile : null;
}

export function isExcalidrawMediaPath(
  app: App,
  pathOrLink: string,
  sourcePath = ''
): boolean {
  const file = resolveVaultMediaFile(app, pathOrLink, sourcePath);
  return file ? isExcalidrawFile(file, app) : false;
}

export function toObsidianEmbed(
  pathOrLink: string,
  displayText?: string | number
): string {
  const normalized = normalizeMediaInput(pathOrLink);
  return displayText
    ? `![[${normalized}|${displayText}]]`
    : `![[${normalized}]]`;
}

export function resolveImageInput(
  app: App,
  input: string,
  sourcePath = ''
): string {
  const normalized = normalizeMediaInput(input);
  let finalValue = normalized;

  if (isTradingViewUrl(normalized)) {
    const converted = convertTradingViewUrl(normalized);
    if (converted) finalValue = converted;
  }

  if (
    isValidImageUrl(finalValue) ||
    isYouTubeMediaUrl(finalValue) ||
    isInlineVideoMediaUrl(finalValue) ||
    isRemoteVideoMediaUrl(finalValue)
  )
    return finalValue;

  const file = resolveVaultMediaFile(app, normalized, sourcePath);
  if (
    file &&
    (isImageFile(file) || isVideoFile(file) || isExcalidrawFile(file, app))
  ) {
    return file.path;
  }

  throw new Error(t('image.uploader.error-invalid-url'));
}

export function resolveMediaDisplayPath(
  app: App,
  pathOrLink: string,
  sourcePath = ''
): string {
  const normalized = normalizeMediaInput(pathOrLink);
  if (
    isValidImageUrl(normalized) ||
    isYouTubeMediaUrl(normalized) ||
    isInlineVideoMediaUrl(normalized) ||
    isRemoteVideoMediaUrl(normalized)
  )
    return normalized;

  const file = resolveVaultMediaFile(app, normalized, sourcePath);
  return file ? file.path : normalized;
}
