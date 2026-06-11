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

export function toObsidianEmbed(pathOrLink: string): string {
  const normalized = normalizeMediaInput(pathOrLink);
  return `![[${normalized}]]`;
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

  if (isValidImageUrl(finalValue)) return finalValue;

  const file = resolveVaultMediaFile(app, normalized, sourcePath);
  if (file && (isImageFile(file) || isExcalidrawFile(file, app))) {
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
  if (isValidImageUrl(normalized)) return normalized;

  const file = resolveVaultMediaFile(app, normalized, sourcePath);
  return file ? file.path : normalized;
}
