import { App, MarkdownView, TFile } from 'obsidian';

function getActiveMarkdownViewForFile(
  app: App,
  file: TFile
): MarkdownView | null {
  if (!app.workspace?.getActiveViewOfType) {
    return null;
  }

  const activeView = app.workspace.getActiveViewOfType(MarkdownView);
  if (activeView?.file?.path === file.path) {
    return activeView;
  }

  return null;
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
  const activeView = getActiveMarkdownViewForFile(app, file);
  if (activeView) {
    return activeView.editor.getValue();
  }

  return app.vault.read(file);
}


export async function replaceFileContent(
  app: App,
  file: TFile,
  newContent: string
): Promise<void> {
  const activeView = getActiveMarkdownViewForFile(app, file);

  if (activeView) {
    replaceEditorContent(activeView, newContent);
    await activeView.save(true);
    await writeVaultContent(app, file, newContent);
    await deferToNextTick();

    const currentActiveView = getActiveMarkdownViewForFile(app, file);
    if (currentActiveView) {
      replaceEditorContent(currentActiveView, newContent);
      await currentActiveView.save(true);
    }
    return;
  }

  await writeVaultContent(app, file, newContent);
}
