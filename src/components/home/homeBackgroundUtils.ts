import { TFile, normalizePath } from 'obsidian';
import type { App, Vault } from 'obsidian';
import type { HomeViewMode } from '../../settings/types';

type HomeBackgroundVault = Pick<
  Vault,
  | 'getAbstractFileByPath'
  | 'getResourcePath'
  | 'createFolder'
  | 'modifyBinary'
  | 'createBinary'
  | 'adapter'
>;

type HomeBackgroundApp = Pick<App, 'vault'> & { vault: HomeBackgroundVault };

const HOME_BACKGROUND_DIRECTORY = '.journalit';
const HOME_BACKGROUND_FILENAME = 'home-background';
const SUPPORTED_HOME_BACKGROUND_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'bmp',
  'webp',
  'svg',
]);

function isSupportedExtension(extension: string): boolean {
  return SUPPORTED_HOME_BACKGROUND_EXTENSIONS.has(extension.toLowerCase());
}

export function normalizeHomeBackgroundImagePath(
  value: unknown,
  fallback?: string
): string | undefined {
  if (typeof value !== 'string') return fallback;

  const trimmedPath = value.trim();
  if (!trimmedPath) return undefined;

  const normalizedPath = normalizePath(trimmedPath);
  const extension = normalizedPath.split('.').pop() ?? '';
  return isSupportedExtension(extension) ? normalizedPath : fallback;
}

export function isSupportedHomeBackgroundFile(file: File): boolean {
  const extension = file.name.split('.').pop() ?? '';
  return isSupportedExtension(extension);
}

export function getHomeBackgroundResourcePath(
  app: HomeBackgroundApp,
  backgroundImagePath: string | undefined
): string | null {
  const normalizedPath = normalizeHomeBackgroundImagePath(backgroundImagePath);
  if (!normalizedPath) return null;

  return app.vault.adapter.getResourcePath(normalizedPath);
}

export function shouldShowHomeBackground(
  resourcePath: string | null,
  mode: HomeViewMode,
  showInDashboard: boolean
): boolean {
  return resourcePath !== null && (mode === 'overview' || showInDashboard);
}

export async function saveHomeBackgroundFile(
  app: HomeBackgroundApp,
  file: File
): Promise<string> {
  if (!isSupportedHomeBackgroundFile(file)) {
    throw new Error(`Unsupported home background image type: ${file.name}`);
  }

  const extension = (file.name.split('.').pop() ?? 'png').toLowerCase();
  const targetDirectory = normalizePath(HOME_BACKGROUND_DIRECTORY);
  const targetPath = normalizePath(
    `${targetDirectory}/${HOME_BACKGROUND_FILENAME}.${extension}`
  );

  if (!(await app.vault.adapter.exists(targetDirectory))) {
    await app.vault.createFolder(targetDirectory);
  }

  const arrayBuffer = await file.arrayBuffer();
  const existingFile = app.vault.getAbstractFileByPath(targetPath);
  if (existingFile instanceof TFile) {
    await app.vault.modifyBinary(existingFile, arrayBuffer);
  } else if (await app.vault.adapter.exists(targetPath)) {
    await app.vault.adapter.writeBinary(targetPath, arrayBuffer);
  } else {
    await app.vault.createBinary(targetPath, arrayBuffer);
  }

  return targetPath;
}
