import { App, Editor, MarkdownView, TFile } from 'obsidian';

class StaleVaultProcessError extends Error {
  constructor() {
    super('Journalit vault content is stale.');
    this.name = 'StaleVaultProcessError';
  }
}

function hasModeGetter(view: object): view is { getMode: () => string } {
  return 'getMode' in view && typeof view.getMode === 'function';
}


function isMarkdownFileView(
  view: unknown,
  filePath: string
): view is MarkdownView {
  if (view === null || typeof view !== 'object') return false;
  if (!('file' in view) || !('editor' in view) || !hasModeGetter(view)) {
    return false;
  }
  const candidate = view.file;
  if (
    candidate === null ||
    typeof candidate !== 'object' ||
    !('path' in candidate)
  ) {
    return false;
  }
  return (
    candidate.path === filePath &&
    view.editor !== undefined &&
    view.getMode() === 'source'
  );
}

function getActiveMarkdownViewForFile(
  app: App,
  filePath: string
): MarkdownView | null {
  if (!app.workspace?.getActiveViewOfType) {
    return null;
  }

  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  return isMarkdownFileView(activeView, filePath) ? activeView : null;
}

function getMarkdownViewForFile(
  app: App,
  filePath: string
): MarkdownView | null {
  const activeView = getActiveMarkdownViewForFile(app, filePath);
  if (activeView) return activeView;

  if (typeof app.workspace?.getLeavesOfType !== 'function') {
    return null;
  }

  const leaves = app.workspace.getLeavesOfType('markdown');
  if (!Array.isArray(leaves)) return null;
  for (let index = 0; index < leaves.length; index += 1) {
    const view = leaves[index]?.view;
    if (isMarkdownFileView(view, filePath)) return view;
  }
  return null;
}


export function isOpenInEditor(app: App, file: TFile): boolean {
  return getMarkdownViewForFile(app, file.path) !== null;
}


export function getSourceEditor(
  app: App,
  filePath: string
): { lines: string[]; editor: Editor } | null {
  const view = getMarkdownViewForFile(app, filePath);
  return view
    ? { lines: view.editor.getValue().split('\n'), editor: view.editor }
    : null;
}

function deferToNextTick(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

function replaceEditorContent(view: MarkdownView, newContent: string): void {
  if (typeof view.editor.setValue === 'function') {
    view.editor.setValue(newContent);
    return;
  }

  const lastLine = view.editor.lastLine();
  const lastCh = view.editor.getLine(lastLine).length;

  view.editor.replaceRange(
    newContent,
    { line: 0, ch: 0 },
    { line: lastLine, ch: lastCh }
  );
}

async function writeVaultContent(
  app: App,
  file: TFile,
  newContent: string
): Promise<void> {
  if (typeof app.vault.process === 'function') {
    await app.vault.process(file, () => newContent);
    return;
  }

  if (typeof app.vault.modify === 'function') {
    await app.vault.modify(file, newContent);
    return;
  }

  await app.vault.adapter.write(file.path, newContent);
}


export async function readFileContentForMutation(
  app: App,
  file: TFile
): Promise<string> {
  const openView = getMarkdownViewForFile(app, file.path);
  if (openView) {
    return openView.editor.getValue();
  }

  return app.vault.read(file);
}


export async function replaceFileContent(
  app: App,
  file: TFile,
  newContent: string
): Promise<void> {
  const openView = getMarkdownViewForFile(app, file.path);

  if (openView) {
    replaceEditorContent(openView, newContent);
    await openView.save(true);
    await writeVaultContent(app, file, newContent);
    await deferToNextTick();

    const currentOpenView = getMarkdownViewForFile(app, file.path);
    if (currentOpenView) {
      replaceEditorContent(currentOpenView, newContent);
      await currentOpenView.save(true);
    }
    return;
  }

  await writeVaultContent(app, file, newContent);
}


export async function transformFileContent(
  app: App,
  file: TFile,
  transform: (currentContent: string) => string
): Promise<void> {
  const activeView = getActiveMarkdownViewForFile(app, file.path);
  if (activeView) {
    const currentContent = activeView.editor.getValue();
    const nextContent = transform(currentContent);
    if (nextContent !== currentContent) {
      await replaceFileContent(app, file, nextContent);
    }
    return;
  }

  
  const snapshot = await app.vault.read(file);
  if (transform(snapshot) === snapshot) return;

  await app.vault.process(file, transform);
}

type ConditionalFileReplacementStatus = 'replaced' | 'stale';


export async function replaceFileContentIfUnchanged(
  app: App,
  file: TFile,
  expectedContent: string,
  nextContent: string
): Promise<ConditionalFileReplacementStatus> {
  const openView = getMarkdownViewForFile(app, file.path);
  if (openView) {
    if (openView.editor.getValue() !== expectedContent) {
      return 'stale';
    }
    
    
    
    replaceEditorContent(openView, nextContent);
    await openView.save(true);
    return 'replaced';
  }

  if (typeof app.vault.process === 'function') {
    try {
      await app.vault.process(file, (current: string) => {
        if (current !== expectedContent) {
          throw new StaleVaultProcessError();
        }
        return nextContent;
      });
      return 'replaced';
    } catch (error) {
      if (error instanceof StaleVaultProcessError) return 'stale';
      throw error;
    }
  }

  const current =
    typeof app.vault.read === 'function'
      ? await app.vault.read(file)
      : await app.vault.adapter.read(file.path);
  if (current !== expectedContent) {
    return 'stale';
  }
  await writeVaultContent(app, file, nextContent);
  return 'replaced';
}
