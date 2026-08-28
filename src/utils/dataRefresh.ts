

import { App, TFile, parseYaml } from 'obsidian';

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;

function cloneFrontmatter(
  frontmatter?: Record<string, unknown> | null
): Record<string, unknown> {
  if (!frontmatter) {
    return {};
  }
  const cloned: unknown = structuredClone(frontmatter);
  return asRecord(cloned) ?? {};
}

function parseFrontmatterFromContent(content: string): Record<string, unknown> {
  try {
    return parseFrontmatterFromContentOrThrow(content);
  } catch {
    return {};
  }
}

export function parseFrontmatterFromContentOrThrow(
  content: string
): Record<string, unknown> {
  const frontmatterMatch = content.match(
    /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
  );
  if (!frontmatterMatch) {
    throw new Error('Trade note frontmatter is missing');
  }

  const parsed: unknown = parseYaml(frontmatterMatch[1]);
  const record = asRecord(parsed);
  if (!record) {
    throw new Error('Trade note frontmatter must be a YAML mapping');
  }
  return record;
}

function snapshotFrontmatter(
  appInstance: App,
  file: TFile
): string | undefined {
  const frontmatter = appInstance.metadataCache.getFileCache(file)?.frontmatter;
  if (!frontmatter) {
    return undefined;
  }

  try {
    return JSON.stringify(frontmatter);
  } catch {
    return undefined;
  }
}


async function waitForMetadataCacheChanged(
  appInstance: App,
  file: TFile,
  timeoutMs: number,
  initialSnapshot?: string
): Promise<void> {
  const metadataCache =
    appInstance.metadataCache as typeof appInstance.metadataCache & {
      on?: (
        eventName: string,
        callback: (...args: unknown[]) => void
      ) => unknown;
      off?: (
        eventName: string,
        callback: (...args: unknown[]) => void
      ) => unknown;
    };

  const deadline = Date.now() + Math.max(0, timeoutMs);
  let observedChangedEvent = false;

  const handleChanged = (changedFile: TFile | null) => {
    if (changedFile?.path === file.path) {
      observedChangedEvent = true;
    }
  };

  if (typeof metadataCache.on === 'function') {
    metadataCache.on('changed', handleChanged);
  }

  try {
    while (Date.now() < deadline) {
      if (observedChangedEvent) {
        return;
      }

      const currentSnapshot = snapshotFrontmatter(appInstance, file);
      if (currentSnapshot !== initialSnapshot) {
        return;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 25));
    }
  } finally {
    if (typeof metadataCache.off === 'function') {
      metadataCache.off('changed', handleChanged);
    }
  }
}


export async function forceMetadataCacheRefresh(
  appInstance: App,
  file: TFile,
  delay: number = 100
): Promise<void> {
  const initialSnapshot = snapshotFrontmatter(appInstance, file);

  
  
  
  await appInstance.vault.cachedRead(file);

  await waitForMetadataCacheChanged(
    appInstance,
    file,
    Math.max(0, delay),
    initialSnapshot
  );
}


export async function readFileContentFromDisk(
  appInstance: App,
  file: TFile
): Promise<string> {
  const vault = appInstance.vault as typeof appInstance.vault & {
    read?: (targetFile: TFile) => Promise<string>;
  };

  return typeof vault.read === 'function'
    ? vault.read(file)
    : appInstance.vault.cachedRead(file);
}


export async function readFrontmatterFromDisk(
  appInstance: App,
  file: TFile
): Promise<Record<string, unknown>> {
  const content = await readFileContentFromDisk(appInstance, file);

  return cloneFrontmatter(parseFrontmatterFromContent(content));
}
