

import { App, TFile, parseYaml } from 'obsidian';
import { isMetadataCacheCurrent } from '../services/base/metadataCacheReadiness';

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
    throw new Error('Note frontmatter is missing');
  }

  const parsed: unknown = parseYaml(frontmatterMatch[1]);
  const record = asRecord(parsed);
  if (!record) {
    throw new Error('Note frontmatter must be a YAML mapping');
  }
  return record;
}


export function waitForMetadataReparse(
  appInstance: App,
  file: TFile,
  timeoutMs: number = 100,
  write?: Promise<unknown>
): Promise<void> {
  const { metadataCache } = appInstance;
  return new Promise((resolve) => {
    let settled = false;
    let timer: number | undefined;
    const onChanged = (changedFile: TFile) => {
      if (changedFile.path === file.path) finish();
    };
    metadataCache.on('changed', onChanged);
    const startTimeout = () => {
      if (!settled) timer = window.setTimeout(finish, Math.max(0, timeoutMs));
    };
    
    if (write) void write.then(startTimeout, startTimeout);
    else startTimeout();
    function finish(): void {
      settled = true;
      window.clearTimeout(timer);
      metadataCache.off('changed', onChanged);
      resolve();
    }
  });
}


export async function forceMetadataCacheRefresh(
  appInstance: App,
  file: TFile,
  delay: number = 100
): Promise<void> {
  const reparsed = waitForMetadataReparse(appInstance, file, delay);

  
  
  
  await appInstance.vault.cachedRead(file);
  await reparsed;
}


export async function waitForFileIndexed(
  appInstance: App,
  file: TFile,
  timeoutMs: number = 100
): Promise<void> {
  if (appInstance.metadataCache.getFileCache(file)) return;
  await waitForMetadataReparse(appInstance, file, timeoutMs);
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


export async function readCurrentFrontmatter(
  appInstance: App,
  file: TFile
): Promise<Readonly<Record<string, unknown>>> {
  const cache = appInstance.metadataCache.getFileCache(file);
  if (cache && isMetadataCacheCurrent(appInstance, file)) {
    return cache.frontmatter ?? {};
  }
  return readFrontmatterFromDisk(appInstance, file);
}


export async function readFrontmatterFromDisk(
  appInstance: App,
  file: TFile
): Promise<Record<string, unknown>> {
  const content = await readFileContentFromDisk(appInstance, file);

  return cloneFrontmatter(parseFrontmatterFromContent(content));
}
