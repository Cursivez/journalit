

import { App, TFile, parseYaml } from 'obsidian';

function cloneFrontmatter(
  frontmatter?: Record<string, unknown> | null
): Record<string, unknown> {
  return frontmatter ? JSON.parse(JSON.stringify(frontmatter)) : {};
}

function parseFrontmatterFromContent(content: string): Record<string, unknown> {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    return {};
  }

  try {
    const parsed = parseYaml(frontmatterMatch[1]);
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
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

      await new Promise((resolve) => setTimeout(resolve, 25));
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


export async function readFrontmatterFromDisk(
  appInstance: App,
  file: TFile
): Promise<Record<string, unknown>> {
  const vault = appInstance.vault as typeof appInstance.vault & {
    read?: (targetFile: TFile) => Promise<string>;
  };

  const content =
    typeof vault.read === 'function'
      ? await vault.read(file)
      : await appInstance.vault.cachedRead(file);

  return cloneFrontmatter(parseFrontmatterFromContent(content));
}
