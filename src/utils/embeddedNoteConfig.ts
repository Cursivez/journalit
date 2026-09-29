


export const getEmbeddedNoteFileTitle = (filePath: string): string =>
  (filePath.split('/').pop() ?? filePath).replace(/\.md$/, '');
