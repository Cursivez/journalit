import type { App } from 'obsidian';
import { parseFrontmatterFromContentOrThrow } from '../utils/dataRefresh';
import { isPathWithinRoot } from './DemoCleanupPlanner';
import type { DemoOwnedEntity } from './DemoManifest';
import { getDemoOwnedEntityKind, getSampleInstanceId } from './DemoOwnership';


export type DiscoveredOwnedEntities = Map<string, DemoOwnedEntity[]>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);


export async function discoverOwnedMarkdownFiles(
  app: App,
  instanceId: string,
  root?: string
): Promise<DiscoveredOwnedEntities> {
  const discovered: DiscoveredOwnedEntities = new Map();
  for (const file of app.vault.getMarkdownFiles()) {
    if (root && !isPathWithinRoot(file.path, root)) continue;
    const cache = app.metadataCache.getFileCache(file);
    let rawFrontmatter: unknown;
    if (cache) {
      rawFrontmatter = cache.frontmatter;
      if (!isRecord(rawFrontmatter)) continue;
    } else {
      const content = await app.vault.read(file);
      try {
        rawFrontmatter = parseFrontmatterFromContentOrThrow(content);
      } catch {
        continue;
      }
    }
    if (
      !isRecord(rawFrontmatter) ||
      getSampleInstanceId(rawFrontmatter) !== instanceId
    ) {
      continue;
    }
    const entityId = rawFrontmatter.journalitSampleEntityId;
    if (typeof entityId !== 'string' || !entityId.trim()) continue;
    const entity: DemoOwnedEntity = {
      entityId,
      kind: getDemoOwnedEntityKind(rawFrontmatter, file.path),
      path: file.path,
    };
    discovered.set(entityId, [...(discovered.get(entityId) ?? []), entity]);
  }
  return discovered;
}


export async function discoverOwnedMediaFiles(
  app: App,
  instanceId: string
): Promise<DiscoveredOwnedEntities> {
  const discovered: DiscoveredOwnedEntities = new Map();
  for (const file of app.vault.getFiles()) {
    if (file.extension.toLowerCase() !== 'svg') continue;
    const content = await app.vault.read(file);
    const marker = content.match(
      /journalit-sample-instance:([^\s]+) journalit-sample-entity:([^\s]+)/
    );
    if (marker?.[1] !== instanceId || !marker[2]) continue;
    const entity: DemoOwnedEntity = {
      entityId: marker[2],
      kind: 'media',
      path: file.path,
    };
    discovered.set(marker[2], [...(discovered.get(marker[2]) ?? []), entity]);
  }
  return discovered;
}
