import { type App, TFolder, normalizePath } from 'obsidian';

export async function sampleRootHasRemainingContent(
  app: App,
  root: string
): Promise<boolean> {
  const normalizedRoot = normalizePath(root);
  const existing = app.vault.getAbstractFileByPath(normalizedRoot);
  if (!(existing instanceof TFolder)) return existing !== null;
  const listed = await app.vault.adapter.list(normalizedRoot);
  return listed.files.length > 0 || listed.folders.length > 0;
}

export async function countPreservedSampleContent(
  app: App,
  root: string,
  preservedPaths: string[]
): Promise<number> {
  const paths = new Set(preservedPaths.map((path) => normalizePath(path)));
  const normalizedRoot = normalizePath(root);
  const existing = app.vault.getAbstractFileByPath(normalizedRoot);
  if (!(existing instanceof TFolder)) return paths.size;

  const collect = async (folderPath: string): Promise<void> => {
    const listed = await app.vault.adapter.list(folderPath);
    if (
      listed.files.length === 0 &&
      listed.folders.length === 0 &&
      folderPath !== normalizedRoot
    ) {
      paths.add(folderPath);
      return;
    }
    for (const filePath of listed.files) paths.add(normalizePath(filePath));
    await Promise.all(
      listed.folders.map((childPath) => collect(normalizePath(childPath)))
    );
  };
  await collect(normalizedRoot);
  return paths.size;
}

export async function removeEmptySampleRoot(
  app: App,
  root: string
): Promise<void> {
  const normalizedRoot = normalizePath(root);
  if (await sampleRootHasRemainingContent(app, normalizedRoot)) return;
  const existing = app.vault.getAbstractFileByPath(normalizedRoot);
  if (existing instanceof TFolder) {
    await app.fileManager.trashFile(existing);
  }
}
