import { normalizePath } from 'obsidian';

export function normalizeGalleryFolders(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const folders: string[] = [];
  const seen = new Set<string>();
  for (const entry of value) {
    if (typeof entry !== 'string') continue;
    const folder = normalizePath(entry.trim()).replace(/\/+$/, '');
    if (!folder || seen.has(folder)) continue;
    seen.add(folder);
    folders.push(folder);
  }
  return folders;
}
