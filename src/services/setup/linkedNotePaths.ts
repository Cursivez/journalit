export function normalizeSetupLinkedNotePath(path: string): string {
  return path.trim().replace(/\\/g, '/').replace(/\.md$/i, '');
}

export function hasSetupLinkedNotePath(
  linkedNotes: string[],
  candidatePath: string
): boolean {
  const candidateKey = normalizeSetupLinkedNotePath(candidatePath);
  return linkedNotes.some(
    (path) => normalizeSetupLinkedNotePath(path) === candidateKey
  );
}

export function dedupeSetupLinkedNotePaths(paths: string[]): string[] {
  const seen = new Set<string>();
  return paths.filter((path) => {
    const key = normalizeSetupLinkedNotePath(path);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function replaceSetupLinkedNotePath(
  paths: string[],
  oldPath: string,
  newPath: string
): string[] {
  const oldKey = normalizeSetupLinkedNotePath(oldPath);
  return dedupeSetupLinkedNotePaths(
    paths.map((path) =>
      normalizeSetupLinkedNotePath(path) === oldKey ? newPath : path
    )
  );
}
