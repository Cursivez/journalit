import { App, TFile, normalizePath } from 'obsidian';
import {
  getRelocatedManagedTradeMediaPath,
  splitTradeMediaTargetSuffix,
} from './TradeMediaOwnership';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export interface RelocatedManagedTradeMedia {
  sourcePath: string;
  destinationPath: string;
}

interface RelocateManagedTradeMediaParams {
  app: App;
  images: string[];
  additionalMediaPaths?: readonly string[];
  sourceTradeFilePath: string;
  sourceInstrument?: string;
  destinationTradeFilePath: string;
  destinationInstrument: string;
  ensureDirectory: (path: string) => Promise<void>;
}

interface TradeMediaRelocationResult {
  images: string[];
  relocated: RelocatedManagedTradeMedia[];
}

export async function relocateManagedTradeMedia({
  app,
  images,
  additionalMediaPaths = [],
  sourceTradeFilePath,
  sourceInstrument,
  destinationTradeFilePath,
  destinationInstrument,
  ensureDirectory,
}: RelocateManagedTradeMediaParams): Promise<TradeMediaRelocationResult> {
  if (
    !sourceInstrument ||
    (images.length === 0 && additionalMediaPaths.length === 0)
  ) {
    return { images, relocated: [] };
  }

  const plannedPaths = new Map<string, string>();
  for (const mediaPath of [...images, ...additionalMediaPaths]) {
    const physicalSourcePath = splitTradeMediaTargetSuffix(mediaPath).path;
    const destinationPath = getRelocatedManagedTradeMediaPath({
      mediaPath: physicalSourcePath,
      tradeFilePath: sourceTradeFilePath,
      instrument: sourceInstrument,
      destinationTradeFilePath,
      destinationInstrument,
    });
    if (
      destinationPath &&
      destinationPath !== physicalSourcePath &&
      app.vault.getAbstractFileByPath(physicalSourcePath) instanceof TFile
    ) {
      plannedPaths.set(physicalSourcePath, destinationPath);
    }
  }

  const relocated: RelocatedManagedTradeMedia[] = [];
  
  
  
  
  
  
  for (const [sourcePath, destinationPath] of plannedPaths) {
    try {
      if (await app.vault.adapter.exists(destinationPath)) {
        throw new Error(
          `Cannot relocate managed trade media because the destination exists: ${destinationPath}`
        );
      }

      const mediaFile = app.vault.getAbstractFileByPath(sourcePath);
      if (!(mediaFile instanceof TFile)) {
        throw new Error(`Managed trade media file not found: ${sourcePath}`);
      }

      const destinationDirectory = destinationPath.slice(
        0,
        destinationPath.lastIndexOf('/')
      );
      await ensureDirectory(destinationDirectory);
      await app.vault.rename(mediaFile, destinationPath);
      relocated.push({ sourcePath, destinationPath });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      try {
        await rollbackRelocatedManagedTradeMedia(
          app,
          relocated,
          ensureDirectory
        );
      } catch (rollbackError) {
        const rollbackDetail =
          rollbackError instanceof Error
            ? rollbackError.message
            : String(rollbackError);
        throw new Error(
          `Failed to relocate managed trade media ${sourcePath}: ${detail}. ${rollbackDetail}`
        );
      }
      throw new Error(
        `Failed to relocate managed trade media ${sourcePath}: ${detail}`
      );
    }
  }

  if (relocated.length === 0) {
    return { images, relocated };
  }

  const relocatedPathBySource = new Map(
    relocated.map(({ sourcePath, destinationPath }) => [
      sourcePath,
      destinationPath,
    ])
  );
  const relocatedImages = images.map((mediaPath) => {
    const { path, suffix } = splitTradeMediaTargetSuffix(mediaPath);
    const destinationPath = relocatedPathBySource.get(path);
    return destinationPath ? `${destinationPath}${suffix}` : mediaPath;
  });

  return {
    images: relocatedImages,
    relocated,
  };
}

export function rekeyRelocatedManagedTradeMediaAnnotations(
  frontmatter: Record<string, unknown>,
  relocatedMedia: RelocatedManagedTradeMedia[]
): void {
  const currentAnnotations = frontmatter.imageAnnotations;
  if (!isRecord(currentAnnotations)) {
    return;
  }

  const relocatedPathBySource = new Map(
    relocatedMedia.map(({ sourcePath, destinationPath }) => [
      sourcePath,
      destinationPath,
    ])
  );
  const annotations: Record<string, unknown> = {};
  let changed = false;
  for (const [mediaPath, annotation] of Object.entries(currentAnnotations)) {
    const { path, suffix } = splitTradeMediaTargetSuffix(mediaPath);
    const destinationPath = relocatedPathBySource.get(path);
    const annotationPath = destinationPath
      ? `${destinationPath}${suffix}`
      : mediaPath;
    annotations[annotationPath] = annotation;
    changed ||= annotationPath !== mediaPath;
  }

  if (changed) {
    frontmatter.imageAnnotations = annotations;
  }
}

export async function rollbackRelocatedManagedTradeMedia(
  app: App,
  relocatedMedia: RelocatedManagedTradeMedia[],
  ensureDirectory: (path: string) => Promise<void>
): Promise<void> {
  const failures: string[] = [];
  
  
  for (const { sourcePath, destinationPath } of [...relocatedMedia].reverse()) {
    try {
      const mediaFile = app.vault.getAbstractFileByPath(destinationPath);
      if (!(mediaFile instanceof TFile)) {
        failures.push(`destination is missing: ${destinationPath}`);
        continue;
      }

      const sourceDirectory = sourcePath.slice(0, sourcePath.lastIndexOf('/'));
      await ensureDirectory(sourceDirectory);
      await app.vault.rename(mediaFile, sourcePath);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      failures.push(`${destinationPath}: ${detail}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `Managed trade media rollback incomplete: ${failures.join('; ')}`
    );
  }
}

export async function cleanupRelocatedManagedTradeMediaDirectories(
  app: App,
  relocatedMedia: RelocatedManagedTradeMedia[]
): Promise<void> {
  const sourceDirectories = new Set(
    relocatedMedia.map(({ sourcePath }) =>
      normalizePath(sourcePath.slice(0, sourcePath.lastIndexOf('/')))
    )
  );

  await Promise.all(
    Array.from(sourceDirectories).map(async (directoryPath) => {
      try {
        const contents = await app.vault.adapter.list(directoryPath);
        if (contents.files.length > 0 || contents.folders.length > 0) {
          return;
        }

        const directory = app.vault.getAbstractFileByPath(directoryPath);
        if (directory) {
          await app.fileManager.trashFile(directory);
        }
      } catch (error) {
        console.warn(
          `Failed to clean up relocated trade media directory ${directoryPath}:`,
          error
        );
      }
    })
  );
}
