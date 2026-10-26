import { App, TFile } from 'obsidian';
import {
  readFileContentForMutation,
  replaceFileContentIfUnchanged,
} from '../../utils/fileMutation';
import { OptionCatalogMutationError } from '../agent/configuration/optionCatalogMutation';
import { hashNoteRewriteContent } from '../agent/configuration/noteRewriteCore';
import type { NoteRewritePlan } from '../agent/configuration/noteRewritePlan';

interface InstalledNoteRewriteNote {
  file: TFile;
  originalContent: string;
  resultingContent: string;
}

class IncompleteNoteRewriteRollbackError extends OptionCatalogMutationError {
  constructor() {
    super('internal_error');
    this.name = 'IncompleteNoteRewriteRollbackError';
  }
}

export interface NoteRewriteNoteInstall {
  rollback(): Promise<boolean>;
}

function resolveMarkdownFile(app: App, path: string): TFile | undefined {
  const abstract = app.vault.getAbstractFileByPath(path);
  if (!(abstract instanceof TFile)) return undefined;
  if (abstract.extension !== 'md') return undefined;
  return abstract;
}

async function rollbackNoteRewriteNotes(
  app: App,
  installed: readonly InstalledNoteRewriteNote[]
): Promise<boolean> {
  let incomplete = false;
  
  for (let index = installed.length - 1; index >= 0; index -= 1) {
    const entry = installed[index];
    try {
      const current = await readFileContentForMutation(app, entry.file);
      if (current === entry.originalContent) continue;
      if (current !== entry.resultingContent) {
        incomplete = true;
        continue;
      }
      const replacement = await replaceFileContentIfUnchanged(
        app,
        entry.file,
        entry.resultingContent,
        entry.originalContent
      );
      if (replacement === 'stale') incomplete = true;
    } catch {
      incomplete = true;
    }
  }
  return incomplete;
}

export async function installNoteRewriteNotes(
  app: App,
  plan: Pick<NoteRewritePlan, 'mutations'>
): Promise<NoteRewriteNoteInstall> {
  const installed: InstalledNoteRewriteNote[] = [];
  try {
    
    for (let index = 0; index < plan.mutations.length; index += 1) {
      const mutation = plan.mutations[index];
      const file = resolveMarkdownFile(app, mutation.path);
      if (!file) throw new OptionCatalogMutationError('conflict');
      const current = await readFileContentForMutation(app, file);
      const hash = await hashNoteRewriteContent(current);
      if (
        hash !== mutation.originalContentHash ||
        current !== mutation.originalContent
      ) {
        throw new OptionCatalogMutationError('conflict');
      }
      try {
        const replacement = await replaceFileContentIfUnchanged(
          app,
          file,
          mutation.originalContent,
          mutation.resultingContent
        );
        if (replacement === 'stale') {
          throw new OptionCatalogMutationError('conflict');
        }
        installed.push({
          file,
          originalContent: mutation.originalContent,
          resultingContent: mutation.resultingContent,
        });
      } catch (writeError) {
        if (writeError instanceof OptionCatalogMutationError) throw writeError;
        let afterWrite: string | undefined;
        try {
          afterWrite = await readFileContentForMutation(app, file);
        } catch {
          afterWrite = undefined;
        }
        if (afterWrite === mutation.resultingContent) {
          installed.push({
            file,
            originalContent: mutation.originalContent,
            resultingContent: mutation.resultingContent,
          });
          throw new OptionCatalogMutationError('internal_error');
        }
        if (afterWrite !== mutation.originalContent) {
          throw new IncompleteNoteRewriteRollbackError();
        }
        throw new OptionCatalogMutationError('internal_error');
      }
    }
    return {
      rollback: () => rollbackNoteRewriteNotes(app, installed),
    };
  } catch (error) {
    const rollbackIncomplete = await rollbackNoteRewriteNotes(app, installed);
    if (
      rollbackIncomplete ||
      error instanceof IncompleteNoteRewriteRollbackError
    ) {
      console.error('Agent option settings rollback was incomplete.');
      throw new OptionCatalogMutationError('internal_error');
    }
    if (error instanceof OptionCatalogMutationError) throw error;
    throw new OptionCatalogMutationError('internal_error');
  }
}
