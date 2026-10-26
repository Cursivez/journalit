import { TFile, type App } from 'obsidian';
import {
  normalizeSessionLogEntries,
  type SessionLogEntry,
} from '../../types/sessionLog';
import { enqueueFileMutation } from '../../utils/fileMutationQueue';
import { generateUUID } from '../../utils/uuid';


export interface SessionLogStore {
  app: Pick<App, 'vault' | 'metadataCache'>;
  
  updateSessionLog(
    filePath: string,
    compute: (frontmatter: Readonly<Record<string, unknown>>) => {
      sessionLog: SessionLogEntry[];
    },
    source: string
  ): Promise<void>;
}


export class SessionLogEntryConflictError extends Error {
  constructor() {
    super('The session log entry changed since it was read.');
    this.name = 'SessionLogEntryConflictError';
  }
}

type EntryUpdates = Partial<
  Pick<
    SessionLogEntry,
    'tagId' | 'text' | 'timestamp' | 'resolved' | 'promoted'
  >
>;

const enqueue = (filePath: string, task: () => Promise<void>): Promise<void> =>
  enqueueFileMutation('session-log', filePath, task);

export function readSessionLogEntries(
  store: Pick<SessionLogStore, 'app'>,
  filePath: string
): SessionLogEntry[] {
  const file = store.app.vault.getAbstractFileByPath(filePath);
  if (!(file instanceof TFile)) return [];
  const frontmatter = store.app.metadataCache.getFileCache(file)?.frontmatter;
  return normalizeSessionLogEntries(frontmatter?.sessionLog);
}


export function sessionLogEntrySnapshot(entry: SessionLogEntry): string {
  return JSON.stringify([
    entry.id,
    entry.timestamp,
    entry.tagId,
    entry.text,
    entry.resolved === true,
    entry.promoted === true,
  ]);
}

function sameEntry(left: SessionLogEntry, right: SessionLogEntry): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}


function checkedEntries(
  frontmatter: Readonly<Record<string, unknown>>,
  entryId: string,
  expected: SessionLogEntry | undefined
): SessionLogEntry[] {
  const entries = normalizeSessionLogEntries(frontmatter.sessionLog);
  const current = entries.find((entry) => entry.id === entryId);
  if (expected && (!current || !sameEntry(current, expected))) {
    throw new SessionLogEntryConflictError();
  }
  return entries;
}


export async function addSessionLogEntries(
  store: SessionLogStore,
  filePath: string,
  entries: readonly { tagId: string; text: string; timestamp?: Date }[],
  source: string
): Promise<SessionLogEntry[]> {
  const added = entries.map((entry): SessionLogEntry => ({
    id: generateUUID(),
    timestamp: (entry.timestamp ?? new Date()).toISOString(),
    tagId: entry.tagId,
    text: entry.text.trim(),
    resolved: false,
    promoted: false,
  }));
  await enqueue(filePath, async () => {
    await store.updateSessionLog(
      filePath,
      (frontmatter) => ({
        sessionLog: [
          ...normalizeSessionLogEntries(frontmatter.sessionLog),
          ...added,
        ],
      }),
      source
    );
  });
  return added;
}


export async function updateSessionLogEntry(
  store: SessionLogStore,
  filePath: string,
  entryId: string,
  updates: EntryUpdates,
  source: string,
  expected?: SessionLogEntry
): Promise<void> {
  await enqueue(filePath, async () => {
    await store.updateSessionLog(
      filePath,
      (frontmatter) => {
        const entries = checkedEntries(frontmatter, entryId, expected);
        return {
          sessionLog: entries.map((entry) =>
            entry.id === entryId ? { ...entry, ...updates } : entry
          ),
        };
      },
      source
    );
  });
}


export async function deleteSessionLogEntry(
  store: SessionLogStore,
  filePath: string,
  entryId: string,
  source: string,
  expected?: SessionLogEntry
): Promise<void> {
  await enqueue(filePath, async () => {
    await store.updateSessionLog(
      filePath,
      (frontmatter) => ({
        sessionLog: checkedEntries(frontmatter, entryId, expected).filter(
          (entry) => entry.id !== entryId
        ),
      }),
      source
    );
  });
}
