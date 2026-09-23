import { TFile, TFolder, normalizePath } from 'obsidian';
import type JournalitPlugin from '../main';
import { parseFrontmatterFromContentOrThrow } from '../utils/dataRefresh';
import {
  hashDemoMediaContent,
  type DemoManifest,
  type DemoOwnedEntity,
} from './DemoManifest';
import { getSampleInstanceId } from './DemoOwnership';

interface OwnedFolderTrashPlan {
  path: string;
  entityPaths: string[];
  entryCount: number;
}

interface OwnedFolderInspection {
  allCandidates: boolean;
  entityPaths: string[];
  nestedPlans: OwnedFolderTrashPlan[];
  entryCount: number;
}

interface EmptyOwnedFolderInspection {
  fullyEmpty: boolean;
  nestedPaths: string[];
  entryCount: number;
}



const MAX_COMPACTED_TRASH_ENTRIES = 50;

export function isPathWithinRoot(path: string, root: string): boolean {
  const normalizedPath = normalizePath(path);
  const normalizedRoot = normalizePath(root);
  return (
    normalizedPath === normalizedRoot ||
    normalizedPath.startsWith(`${normalizedRoot}/`)
  );
}

export async function trashFileOrConfirmMissing(
  plugin: JournalitPlugin,
  file: TFile | TFolder
): Promise<void> {
  try {
    await plugin.app.fileManager.trashFile(file);
  } catch (error) {
    if (!(await plugin.app.vault.adapter.exists(file.path))) return;
    throw error;
  }
}

export async function isOwnedEntityFileOnDisk(
  plugin: JournalitPlugin,
  file: TFile,
  entity: DemoOwnedEntity,
  manifest: DemoManifest
): Promise<boolean> {
  if (entity.kind === 'media') {
    if (entity.contentHash) {
      return (
        hashDemoMediaContent(await plugin.app.vault.readBinary(file)) ===
        entity.contentHash
      );
    }
    const content = await plugin.app.vault.read(file);
    return content.includes(
      `journalit-sample-instance:${manifest.instanceId} journalit-sample-entity:${entity.entityId}`
    );
  }

  const content = await plugin.app.vault.read(file);
  try {
    const frontmatter = parseFrontmatterFromContentOrThrow(content);
    return (
      getSampleInstanceId(frontmatter) === manifest.instanceId &&
      frontmatter.journalitSampleEntityId === entity.entityId
    );
  } catch {
    return false;
  }
}

export class DemoCleanupPlanner {
  constructor(private readonly plugin: JournalitPlugin) {}

  async removeCompactableOwnedFolders(
    manifest: DemoManifest,
    owned: Iterable<DemoOwnedEntity>,
    planningCandidates: Map<string, DemoOwnedEntity>
  ): Promise<Set<string>> {
    const ownedFolderPaths = this.collectOwnedFolderPaths(manifest.root, owned);
    const compactableFolders = (
      await this.findCompactableOwnedFolders(
        manifest.root,
        ownedFolderPaths,
        planningCandidates
      )
    ).filter((plan) => plan.entityPaths.length > 0);
    const removedPaths = new Set<string>();

    for (const plan of compactableFolders) {
      if (
        !(await this.confirmOwnedFolderTrashPlan(
          plan,
          ownedFolderPaths,
          planningCandidates,
          manifest
        ))
      ) {
        continue;
      }
      const folder = this.plugin.app.vault.getAbstractFileByPath(plan.path);
      if (!(folder instanceof TFolder)) continue;
      await trashFileOrConfirmMissing(this.plugin, folder);
      for (const path of plan.entityPaths) removedPaths.add(path);
    }

    return removedPaths;
  }

  async removeEmptyOwnedFolders(
    manifest: DemoManifest,
    owned: Iterable<DemoOwnedEntity>
  ): Promise<void> {
    const ownedFolderPaths = this.collectOwnedFolderPaths(manifest.root, owned);
    const folderPaths = await this.findEmptyOwnedFolders(
      manifest.root,
      ownedFolderPaths
    );

    for (const folderPath of folderPaths) {
      const confirmation = await this.inspectEmptyOwnedFolder(
        folderPath,
        ownedFolderPaths
      );
      if (
        !confirmation.fullyEmpty ||
        confirmation.entryCount > MAX_COMPACTED_TRASH_ENTRIES
      ) {
        continue;
      }
      const folder = this.plugin.app.vault.getAbstractFileByPath(folderPath);
      if (folder instanceof TFolder) {
        await trashFileOrConfirmMissing(this.plugin, folder);
      }
    }
  }

  private collectOwnedFolderPaths(
    root: string,
    owned: Iterable<DemoOwnedEntity>
  ): Set<string> {
    const normalizedRoot = normalizePath(root);
    const folderPaths = new Set<string>();
    for (const entity of owned) {
      if (!isPathWithinRoot(entity.path, normalizedRoot)) continue;
      const segments = normalizePath(entity.path).split('/').slice(0, -1);
      while (segments.length > 0) {
        const path = segments.join('/');
        if (!isPathWithinRoot(path, normalizedRoot)) break;
        if (path === normalizedRoot) break;
        folderPaths.add(path);
        segments.pop();
      }
    }
    return folderPaths;
  }

  private async findCompactableOwnedFolders(
    root: string,
    ownedFolderPaths: Set<string>,
    planningCandidates: Map<string, DemoOwnedEntity>
  ): Promise<OwnedFolderTrashPlan[]> {
    const normalizedRoot = normalizePath(root);
    const rootFolder =
      this.plugin.app.vault.getAbstractFileByPath(normalizedRoot);
    if (!(rootFolder instanceof TFolder)) return [];

    const listed = await this.plugin.app.vault.adapter.list(normalizedRoot);
    const plans: OwnedFolderTrashPlan[] = [];
    for (const folderPath of listed.folders.map(normalizePath)) {
      if (!ownedFolderPaths.has(folderPath)) continue;
      const inspection = await this.inspectCandidateFolder(
        folderPath,
        ownedFolderPaths,
        planningCandidates
      );
      plans.push(...this.selectOwnedFolderTrashPlans(folderPath, inspection));
    }
    return plans;
  }

  private async inspectCandidateFolder(
    folderPath: string,
    ownedFolderPaths: Set<string>,
    planningCandidates: Map<string, DemoOwnedEntity>
  ): Promise<OwnedFolderInspection> {
    const normalizedPath = normalizePath(folderPath);
    const folder = this.plugin.app.vault.getAbstractFileByPath(normalizedPath);
    if (!ownedFolderPaths.has(normalizedPath) || !(folder instanceof TFolder)) {
      return {
        allCandidates: false,
        entityPaths: [],
        nestedPlans: [],
        entryCount: 0,
      };
    }

    const listed = await this.plugin.app.vault.adapter.list(normalizedPath);
    const entityPaths: string[] = [];
    const nestedPlans: OwnedFolderTrashPlan[] = [];
    let entryCount = 1 + listed.files.length;
    let allCandidates = true;

    for (const filePath of listed.files.map(normalizePath)) {
      if (planningCandidates.has(filePath)) {
        entityPaths.push(filePath);
      } else {
        allCandidates = false;
      }
    }

    for (const childPath of listed.folders.map(normalizePath)) {
      if (!ownedFolderPaths.has(childPath)) {
        allCandidates = false;
        continue;
      }
      const child = await this.inspectCandidateFolder(
        childPath,
        ownedFolderPaths,
        planningCandidates
      );
      entryCount += child.entryCount;
      if (child.allCandidates) {
        entityPaths.push(...child.entityPaths);
        nestedPlans.push(...this.selectOwnedFolderTrashPlans(childPath, child));
      } else {
        allCandidates = false;
        nestedPlans.push(...child.nestedPlans);
      }
    }

    return allCandidates
      ? { allCandidates: true, entityPaths, nestedPlans, entryCount }
      : { allCandidates: false, entityPaths: [], nestedPlans, entryCount };
  }

  private selectOwnedFolderTrashPlans(
    path: string,
    inspection: OwnedFolderInspection
  ): OwnedFolderTrashPlan[] {
    return inspection.allCandidates &&
      inspection.entryCount <= MAX_COMPACTED_TRASH_ENTRIES
      ? [
          {
            path,
            entityPaths: inspection.entityPaths,
            entryCount: inspection.entryCount,
          },
        ]
      : inspection.nestedPlans;
  }

  private async confirmOwnedFolderTrashPlan(
    plan: OwnedFolderTrashPlan,
    ownedFolderPaths: Set<string>,
    planningCandidates: Map<string, DemoOwnedEntity>,
    manifest: DemoManifest
  ): Promise<boolean> {
    for (const path of plan.entityPaths) {
      const entity = planningCandidates.get(path);
      const file = this.plugin.app.vault.getAbstractFileByPath(path);
      if (
        !entity ||
        !(file instanceof TFile) ||
        !(await isOwnedEntityFileOnDisk(this.plugin, file, entity, manifest))
      ) {
        return false;
      }
    }

    const after = await this.inspectCandidateFolder(
      plan.path,
      ownedFolderPaths,
      planningCandidates
    );
    return (
      after.allCandidates &&
      after.entryCount === plan.entryCount &&
      after.entryCount <= MAX_COMPACTED_TRASH_ENTRIES &&
      this.haveSamePaths(after.entityPaths, plan.entityPaths)
    );
  }

  private haveSamePaths(left: string[], right: string[]): boolean {
    if (left.length !== right.length) return false;
    const rightPaths = new Set(right);
    return left.every((path) => rightPaths.has(path));
  }

  private async findEmptyOwnedFolders(
    root: string,
    ownedFolderPaths: Set<string>
  ): Promise<string[]> {
    const normalizedRoot = normalizePath(root);
    const rootFolder =
      this.plugin.app.vault.getAbstractFileByPath(normalizedRoot);
    if (!(rootFolder instanceof TFolder)) return [];

    const listed = await this.plugin.app.vault.adapter.list(normalizedRoot);
    const plans: string[] = [];
    for (const folderPath of listed.folders.map(normalizePath)) {
      if (!ownedFolderPaths.has(folderPath)) continue;
      const inspection = await this.inspectEmptyOwnedFolder(
        folderPath,
        ownedFolderPaths
      );
      plans.push(...this.selectEmptyFolderTrashPaths(folderPath, inspection));
    }
    return plans;
  }

  private async inspectEmptyOwnedFolder(
    folderPath: string,
    ownedFolderPaths: Set<string>
  ): Promise<EmptyOwnedFolderInspection> {
    const normalizedPath = normalizePath(folderPath);
    const folder = this.plugin.app.vault.getAbstractFileByPath(normalizedPath);
    if (!ownedFolderPaths.has(normalizedPath) || !(folder instanceof TFolder)) {
      return { fullyEmpty: false, nestedPaths: [], entryCount: 0 };
    }

    const listed = await this.plugin.app.vault.adapter.list(normalizedPath);
    const nestedPaths: string[] = [];
    let entryCount = 1 + listed.files.length;
    let fullyEmpty = listed.files.length === 0;
    for (const childPath of listed.folders.map(normalizePath)) {
      if (!ownedFolderPaths.has(childPath)) {
        fullyEmpty = false;
        continue;
      }
      const child = await this.inspectEmptyOwnedFolder(
        childPath,
        ownedFolderPaths
      );
      entryCount += child.entryCount;
      nestedPaths.push(...this.selectEmptyFolderTrashPaths(childPath, child));
      if (!child.fullyEmpty) fullyEmpty = false;
    }

    return fullyEmpty
      ? { fullyEmpty: true, nestedPaths, entryCount }
      : { fullyEmpty: false, nestedPaths, entryCount };
  }

  private selectEmptyFolderTrashPaths(
    path: string,
    inspection: EmptyOwnedFolderInspection
  ): string[] {
    if (!inspection.fullyEmpty) return inspection.nestedPaths;
    return inspection.entryCount <= MAX_COMPACTED_TRASH_ENTRIES
      ? [path]
      : [...inspection.nestedPaths, path];
  }
}
