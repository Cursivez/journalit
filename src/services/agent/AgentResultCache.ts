import { generateUUID } from '../../utils/uuid';
import type { AgentToolName } from './protocol';

const DEFAULT_TTL_MS = 15 * 60 * 1000;
const DEFAULT_MAX_ENTRIES = 64;
const DEFAULT_MAX_SNAPSHOT_BYTES = 16 * 1024 * 1024;
const DEFAULT_MAX_CURSORS = 256;

const RESULT_ID_PATTERN =
  /^result_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CURSOR_ID_PATTERN =
  /^cursor_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type AgentResultCacheErrorCode =
  | 'invalid_request'
  | 'cursor_expired'
  | 'limit_exceeded';

const ERROR_MESSAGES: Record<AgentResultCacheErrorCode, string> = {
  invalid_request: 'Cache request is invalid.',
  cursor_expired: 'Result cursor has expired.',
  limit_exceeded: 'Cache storage limit exceeded.',
};

export class AgentResultCacheError extends Error {
  readonly code: AgentResultCacheErrorCode;

  constructor(code: AgentResultCacheErrorCode) {
    super(ERROR_MESSAGES[code]);
    this.name = 'AgentResultCacheError';
    this.code = code;
  }
}

interface AgentResultCacheOptions {
  ttlMs?: number;
  maxEntries?: number;
  maxSnapshotBytes?: number;
  maxCursors?: number;
  now?: () => number;
  idFactory?: () => string;
  hash?: (canonicalJson: string) => Promise<string>;
}

interface AgentResultCacheContext {
  tool: AgentToolName;
  installationId: string;
  arguments: unknown;
}

interface AgentResultCacheStoreInput extends AgentResultCacheContext {
  snapshot: unknown;
}

interface AgentPriorResult {
  resultId: string;
  snapshot: unknown;
  createdAt: number;
  expiresAt: number;
}

interface AgentResolvedCursor {
  resultId: string;
  snapshot: unknown;
  offset: number;
}

interface ResultEntry {
  resultId: string;
  tool: AgentToolName;
  installationId: string;
  argumentsHash: string;
  snapshotJson: string;
  snapshotBytes: number;
  createdAt: number;
  expiresAt: number;
  accessSequence: number;
}

interface CursorEntry {
  cursor: string;
  resultId: string;
  offset: number;
  accessSequence: number;
}

function requirePositiveInteger(value: number): number {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new AgentResultCacheError('invalid_request');
  }
  return value;
}

function canonicalJson(value: unknown): string {
  const activeObjects = new Set<object>();

  const serialize = (current: unknown): string => {
    if (current === null) return 'null';

    switch (typeof current) {
      case 'string':
      case 'boolean':
        return JSON.stringify(current);
      case 'number':
        if (!Number.isFinite(current)) {
          throw new AgentResultCacheError('invalid_request');
        }
        return JSON.stringify(current);
      case 'object':
        break;
      default:
        throw new AgentResultCacheError('invalid_request');
    }

    if (activeObjects.has(current)) {
      throw new AgentResultCacheError('invalid_request');
    }
    activeObjects.add(current);

    try {
      if (Array.isArray(current)) {
        const items: string[] = [];
        for (let index = 0; index < current.length; index += 1) {
          items.push(serialize(current[index]));
        }
        return `[${items.join(',')}]`;
      }

      const prototype = Object.getPrototypeOf(current) as unknown;
      if (
        (prototype !== Object.prototype && prototype !== null) ||
        Object.getOwnPropertySymbols(current).length > 0
      ) {
        throw new AgentResultCacheError('invalid_request');
      }

      const fields: string[] = [];
      const record = current as Record<string, unknown>;
      for (const key of Object.keys(current).sort()) {
        fields.push(`${JSON.stringify(key)}:${serialize(record[key])}`);
      }
      return `{${fields.join(',')}}`;
    } finally {
      activeObjects.delete(current);
    }
  };

  try {
    return serialize(value);
  } catch (error) {
    if (error instanceof AgentResultCacheError) throw error;
    throw new AgentResultCacheError('invalid_request');
  }
}

async function sha256(canonicalValue: string): Promise<string> {
  try {
    const bytes = new TextEncoder().encode(canonicalValue);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, '0')
    ).join('');
  } catch {
    throw new AgentResultCacheError('invalid_request');
  }
}

function parseSnapshot(snapshotJson: string): unknown {
  return JSON.parse(snapshotJson) as unknown;
}

export class AgentResultCache {
  private readonly ttlMs: number;
  private readonly maxEntries: number;
  private readonly maxSnapshotBytes: number;
  private readonly maxCursors: number;
  private readonly now: () => number;
  private readonly idFactory: () => string;
  private readonly hash: (canonicalJson: string) => Promise<string>;
  private readonly entries = new Map<string, ResultEntry>();
  private readonly cursors = new Map<string, CursorEntry>();
  private totalSnapshotBytes = 0;
  private accessSequence = 0;

  constructor(options: AgentResultCacheOptions = {}) {
    this.ttlMs = requirePositiveInteger(options.ttlMs ?? DEFAULT_TTL_MS);
    this.maxEntries = requirePositiveInteger(
      options.maxEntries ?? DEFAULT_MAX_ENTRIES
    );
    this.maxSnapshotBytes = requirePositiveInteger(
      options.maxSnapshotBytes ?? DEFAULT_MAX_SNAPSHOT_BYTES
    );
    this.maxCursors = requirePositiveInteger(
      options.maxCursors ?? DEFAULT_MAX_CURSORS
    );
    this.now = options.now ?? Date.now;
    this.idFactory = options.idFactory ?? generateUUID;
    this.hash = options.hash ?? sha256;
  }

  get entryCount(): number {
    this.removeExpiredResults(this.now());
    return this.entries.size;
  }

  get cursorCount(): number {
    this.removeExpiredResults(this.now());
    return this.cursors.size;
  }

  async store(input: AgentResultCacheStoreInput): Promise<string> {
    const argumentsHash = await this.hashCanonical(input.arguments);
    const snapshotJson = canonicalJson(input.snapshot);
    const snapshotBytes = new TextEncoder().encode(snapshotJson).byteLength;
    if (snapshotBytes > this.maxSnapshotBytes) {
      throw new AgentResultCacheError('limit_exceeded');
    }

    const now = this.now();
    this.removeExpiredResults(now);
    const resultId = this.createUniqueId('result');
    const entry: ResultEntry = {
      resultId,
      tool: input.tool,
      installationId: input.installationId,
      argumentsHash,
      snapshotJson,
      snapshotBytes,
      createdAt: now,
      expiresAt: now + this.ttlMs,
      accessSequence: this.nextAccessSequence(),
    };
    this.entries.set(resultId, entry);
    this.totalSnapshotBytes += snapshotBytes;
    this.enforceResultLimits();
    return resultId;
  }

  async findPrior(
    priorResultHint: string | undefined,
    context: AgentResultCacheContext
  ): Promise<AgentPriorResult | null> {
    if (
      typeof priorResultHint !== 'string' ||
      !RESULT_ID_PATTERN.test(priorResultHint)
    ) {
      return null;
    }

    const entry = this.entries.get(priorResultHint);
    if (entry === undefined) return null;
    if (this.isExpired(entry, this.now())) {
      this.removeResult(entry.resultId);
      return null;
    }

    if (
      entry.tool !== context.tool ||
      entry.installationId !== context.installationId
    ) {
      return null;
    }
    const argumentsHash = await this.hashCanonical(context.arguments);
    const currentEntry = this.entries.get(priorResultHint);
    if (currentEntry !== entry) return null;
    if (this.isExpired(currentEntry, this.now())) {
      this.removeResult(currentEntry.resultId);
      return null;
    }
    if (
      currentEntry.tool !== context.tool ||
      currentEntry.installationId !== context.installationId ||
      !this.matchesContext(currentEntry, argumentsHash)
    ) {
      return null;
    }

    currentEntry.accessSequence = this.nextAccessSequence();
    return {
      resultId: currentEntry.resultId,
      snapshot: parseSnapshot(currentEntry.snapshotJson),
      createdAt: currentEntry.createdAt,
      expiresAt: currentEntry.expiresAt,
    };
  }

  createCursor(resultId: string, options: { offset: number }): string {
    if (!Number.isSafeInteger(options.offset) || options.offset < 0) {
      throw new AgentResultCacheError('invalid_request');
    }
    if (typeof resultId !== 'string' || !RESULT_ID_PATTERN.test(resultId)) {
      throw new AgentResultCacheError('cursor_expired');
    }

    const entry = this.entries.get(resultId);
    if (entry === undefined || this.isExpired(entry, this.now())) {
      if (entry !== undefined) this.removeResult(resultId);
      throw new AgentResultCacheError('cursor_expired');
    }

    entry.accessSequence = this.nextAccessSequence();
    const cursor = this.createUniqueId('cursor');
    this.cursors.set(cursor, {
      cursor,
      resultId,
      offset: options.offset,
      accessSequence: this.nextAccessSequence(),
    });
    this.enforceCursorLimit();
    return cursor;
  }

  async resolveCursor(
    cursor: string,
    context: AgentResultCacheContext
  ): Promise<AgentResolvedCursor> {
    if (typeof cursor !== 'string' || !CURSOR_ID_PATTERN.test(cursor)) {
      throw new AgentResultCacheError('cursor_expired');
    }

    const cursorEntry = this.cursors.get(cursor);
    if (cursorEntry === undefined) {
      throw new AgentResultCacheError('cursor_expired');
    }
    const resultEntry = this.entries.get(cursorEntry.resultId);
    if (resultEntry === undefined || this.isExpired(resultEntry, this.now())) {
      if (resultEntry !== undefined) this.removeResult(resultEntry.resultId);
      else this.cursors.delete(cursor);
      throw new AgentResultCacheError('cursor_expired');
    }

    if (
      resultEntry.tool !== context.tool ||
      resultEntry.installationId !== context.installationId
    ) {
      throw new AgentResultCacheError('cursor_expired');
    }
    const argumentsHash = await this.hashCanonical(context.arguments);
    const currentCursorEntry = this.cursors.get(cursor);
    const currentResultEntry = this.entries.get(resultEntry.resultId);
    if (
      currentCursorEntry !== cursorEntry ||
      currentResultEntry !== resultEntry ||
      currentCursorEntry.resultId !== currentResultEntry.resultId
    ) {
      throw new AgentResultCacheError('cursor_expired');
    }
    if (this.isExpired(currentResultEntry, this.now())) {
      this.removeResult(currentResultEntry.resultId);
      throw new AgentResultCacheError('cursor_expired');
    }
    if (
      currentResultEntry.tool !== context.tool ||
      currentResultEntry.installationId !== context.installationId ||
      !this.matchesContext(currentResultEntry, argumentsHash)
    ) {
      throw new AgentResultCacheError('cursor_expired');
    }

    currentResultEntry.accessSequence = this.nextAccessSequence();
    currentCursorEntry.accessSequence = this.nextAccessSequence();
    return {
      resultId: currentResultEntry.resultId,
      snapshot: parseSnapshot(currentResultEntry.snapshotJson),
      offset: currentCursorEntry.offset,
    };
  }

  clear(): void {
    this.entries.clear();
    this.cursors.clear();
    this.totalSnapshotBytes = 0;
    this.accessSequence = 0;
  }

  private async hashCanonical(value: unknown): Promise<string> {
    const serialized = canonicalJson(value);
    try {
      return await this.hash(serialized);
    } catch (error) {
      if (error instanceof AgentResultCacheError) throw error;
      throw new AgentResultCacheError('invalid_request');
    }
  }

  private matchesContext(entry: ResultEntry, argumentsHash: string): boolean {
    return entry.argumentsHash === argumentsHash;
  }

  private createUniqueId(kind: 'result' | 'cursor'): string {
    const records = kind === 'result' ? this.entries : this.cursors;
    const pattern = kind === 'result' ? RESULT_ID_PATTERN : CURSOR_ID_PATTERN;
    while (true) {
      const id = `${kind}_${this.idFactory()}`;
      if (!pattern.test(id)) {
        throw new AgentResultCacheError('invalid_request');
      }
      if (!records.has(id)) return id;
    }
  }

  private enforceResultLimits(): void {
    while (
      this.entries.size > this.maxEntries ||
      this.totalSnapshotBytes > this.maxSnapshotBytes
    ) {
      let leastRecentlyUsed: ResultEntry | undefined;
      for (const entry of this.entries.values()) {
        if (
          leastRecentlyUsed === undefined ||
          entry.accessSequence < leastRecentlyUsed.accessSequence
        ) {
          leastRecentlyUsed = entry;
        }
      }
      if (leastRecentlyUsed === undefined) return;
      this.removeResult(leastRecentlyUsed.resultId);
    }
  }

  private enforceCursorLimit(): void {
    if (this.cursors.size <= this.maxCursors) return;

    let leastRecentlyUsed: CursorEntry | undefined;
    for (const cursor of this.cursors.values()) {
      if (
        leastRecentlyUsed === undefined ||
        cursor.accessSequence < leastRecentlyUsed.accessSequence
      ) {
        leastRecentlyUsed = cursor;
      }
    }
    if (leastRecentlyUsed !== undefined) {
      this.cursors.delete(leastRecentlyUsed.cursor);
    }
  }

  private removeExpiredResults(now: number): void {
    for (const entry of this.entries.values()) {
      if (this.isExpired(entry, now)) this.removeResult(entry.resultId);
    }
  }

  private isExpired(entry: ResultEntry, now: number): boolean {
    return now >= entry.expiresAt;
  }

  private removeResult(resultId: string): void {
    const entry = this.entries.get(resultId);
    if (entry === undefined) return;
    this.entries.delete(resultId);
    this.totalSnapshotBytes -= entry.snapshotBytes;
    for (const cursor of this.cursors.values()) {
      if (cursor.resultId === resultId) this.cursors.delete(cursor.cursor);
    }
  }

  private nextAccessSequence(): number {
    this.accessSequence += 1;
    return this.accessSequence;
  }
}
