export type GalleryFolderMutation = {
  kind: 'add' | 'remove';
  path: string;
  getCurrentPath?: () => string;
};

export function applyGalleryFolderMutation(
  currentFolders: readonly string[],
  mutation: GalleryFolderMutation
): string[] {
  const path = mutation.getCurrentPath?.() ?? mutation.path;
  return mutation.kind === 'add'
    ? currentFolders.includes(path)
      ? [...currentFolders]
      : [...currentFolders, path]
    : currentFolders.filter((folderPath) => folderPath !== path);
}

export function galleryFoldersMatch(
  first: readonly string[],
  second: readonly string[]
): boolean {
  return (
    first.length === second.length &&
    first.every((folder, index) => folder === second[index])
  );
}

type PersistGalleryFolderMutationOptions = {
  currentFolders: readonly string[];
  mutation: GalleryFolderMutation;
  setCanonicalFolders: (folders: string[]) => void;
  getCanonicalFolders: () => readonly string[];
  saveSettings: () => Promise<void>;
  onTargetApplied?: (folders: string[]) => void;
};

type GalleryFolderPersistenceResult =
  | { success: true; folders: string[] }
  | {
      success: false;
      folders: string[];
      targetFolders: string[];
      error: unknown;
    };

export async function persistGalleryFolderMutation({
  currentFolders,
  mutation,
  setCanonicalFolders,
  getCanonicalFolders,
  saveSettings,
  onTargetApplied,
}: PersistGalleryFolderMutationOptions): Promise<GalleryFolderPersistenceResult> {
  const targetFolders = applyGalleryFolderMutation(currentFolders, mutation);
  setCanonicalFolders(targetFolders);
  onTargetApplied?.(targetFolders);
  try {
    await saveSettings();
    return { success: true, folders: targetFolders };
  } catch (error) {
    const currentCanonical = getCanonicalFolders();
    
    
    
    
    if (!galleryFoldersMatch(currentCanonical, targetFolders)) {
      return {
        success: false,
        folders: [...currentCanonical],
        targetFolders,
        error,
      };
    }
    const rollbackFolders = [...currentFolders];
    setCanonicalFolders(rollbackFolders);
    return {
      success: false,
      folders: rollbackFolders,
      targetFolders,
      error,
    };
  }
}
