import type { ActionId } from '../ActionTypes';
import { agentActionCatalog } from '../../agent/protocol/generated/manifest.generated';
import type { ActionCall } from '../ActionBatchService';
import { createdItemsGuarded, readCreatedItems } from './createdItemInverses';
import {
  inverseCall,
  inverseGuarded,
  readEntryContentGuard,
  readTradeContentGuard,
  type ActionInverse,
  type InverseItemGuard,
} from './actionInverses';


interface AgentChangeAction {
  readonly action: ActionId;
  readonly title: string;
  readonly target: string;
  readonly changes: readonly string[];
  readonly outcome: 'applied' | 'failed' | 'not_attempted';
  readonly inverse: ActionInverse | null;
}

export interface AgentChangeUndo {
  readonly at: number;
  readonly outcome: 'undone' | 'failed';
  
  readonly undoneActions: readonly number[];
  
  readonly reason?: 'in_use';
}


export interface AgentChangeBatch {
  readonly id: string;
  readonly committedAt: number;
  
  readonly installationId: string;
  readonly actions: readonly AgentChangeAction[];
  readonly undo?: AgentChangeUndo;
}

interface HistoryStorage {
  load(): Promise<unknown>;
  save(batches: readonly AgentChangeBatch[]): Promise<void>;
}

const MAX_BATCHES = 50;
const OUTCOMES: ReadonlySet<unknown> = new Set<AgentChangeAction['outcome']>([
  'applied',
  'failed',
  'not_attempted',
]);
const ACTION_IDS: ReadonlySet<unknown> = new Set<ActionId>(
  agentActionCatalog.map((entry) => entry.id)
);

function isOutcome(value: unknown): value is AgentChangeAction['outcome'] {
  return OUTCOMES.has(value);
}

function isActionId(value: unknown): value is ActionId {
  return ACTION_IDS.has(value);
}

function isActionIndex(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}


function readInverse(value: unknown): ActionInverse | null {
  if (!isRecord(value) || !Array.isArray(value.calls)) return null;
  const calls: ActionCall[] = [];
  for (const candidate of value.calls) {
    const checked = isRecord(candidate)
      ? inverseCall(candidate.action, candidate.input)
      : null;
    if (!checked) return null;
    calls.push(checked);
  }
  const itemGuard = readItemGuard(value.itemGuard);
  if (itemGuard === null) return null;
  const tradeContent =
    value.tradeContent === undefined
      ? undefined
      : readTradeContentGuard(value.tradeContent);
  const entryContent =
    value.entryContent === undefined
      ? undefined
      : readEntryContentGuard(value.entryContent);
  const createdItems = readCreatedItems(value.createdItems);
  if (tradeContent === null || entryContent === null || createdItems === null)
    return null;
  return inverseGuarded(calls, tradeContent, entryContent) &&
    createdItemsGuarded(calls, createdItems)
    ? {
        calls,
        ...(itemGuard ? { itemGuard } : {}),
        ...(createdItems ? { createdItems } : {}),
        ...(tradeContent ? { tradeContent } : {}),
        ...(entryContent ? { entryContent } : {}),
      }
    : null;
}


function readItemGuard(value: unknown): InverseItemGuard | undefined | null {
  if (value === undefined) return undefined;
  if (!isRecord(value)) return null;
  const { kind, accountId, itemId, snapshot } = value;
  return (kind === 'account_transaction' || kind === 'prop_challenge_cost') &&
    isString(accountId) &&
    isString(itemId) &&
    isString(snapshot)
    ? { kind, accountId, itemId, snapshot }
    : null;
}


function readBatches(value: unknown): AgentChangeBatch[] {
  if (!isRecord(value) || !Array.isArray(value.batches)) return [];
  return value.batches.flatMap((candidate): AgentChangeBatch[] => {
    if (
      !isRecord(candidate) ||
      !isString(candidate.id) ||
      typeof candidate.committedAt !== 'number' ||
      !isString(candidate.installationId) ||
      !Array.isArray(candidate.actions)
    ) {
      return [];
    }
    const actions: AgentChangeAction[] = [];
    for (const action of candidate.actions) {
      if (
        !isRecord(action) ||
        !isString(action.action) ||
        !isString(action.title) ||
        !isString(action.target) ||
        !Array.isArray(action.changes) ||
        !isActionId(action.action) ||
        !isOutcome(action.outcome)
      ) {
        return [];
      }
      const changes = action.changes.filter(isString);
      if (changes.length !== action.changes.length) return [];
      actions.push({
        action: action.action,
        title: action.title,
        target: action.target,
        changes,
        outcome: action.outcome,
        inverse: action.inverse === null ? null : readInverse(action.inverse),
      });
    }
    const undo = candidate.undo;
    return [
      {
        id: candidate.id,
        committedAt: candidate.committedAt,
        installationId: candidate.installationId,
        actions,
        ...(isRecord(undo) &&
        typeof undo.at === 'number' &&
        (undo.outcome === 'undone' || undo.outcome === 'failed') &&
        Array.isArray(undo.undoneActions) &&
        undo.undoneActions.every(isActionIndex)
          ? {
              undo: {
                at: undo.at,
                outcome: undo.outcome,
                undoneActions: undo.undoneActions.filter(isActionIndex),
                ...(undo.outcome === 'failed' && undo.reason === 'in_use'
                  ? { reason: 'in_use' as const }
                  : {}),
              },
            }
          : {}),
      },
    ];
  });
}


export class AgentChangeHistory {
  private batches: AgentChangeBatch[] = [];
  private loaded: Promise<void> | null = null;
  private readonly listeners = new Set<() => void>();

  constructor(private readonly storage: HistoryStorage) {}

  
  load(): Promise<void> {
    this.loaded ??= this.storage.load().then(
      (value) => {
        
        this.batches = [...this.batches, ...readBatches(value)].slice(
          0,
          MAX_BATCHES
        );
        this.notify();
      },
      (error: unknown) => {
        console.warn(
          '[Journalit] Could not read the agent change history:',
          error
        );
      }
    );
    return this.loaded;
  }

  list(): readonly AgentChangeBatch[] {
    return this.batches;
  }

  get(id: string): AgentChangeBatch | undefined {
    return this.batches.find((batch) => batch.id === id);
  }

  async record(batch: AgentChangeBatch): Promise<void> {
    this.batches = [batch, ...this.batches].slice(0, MAX_BATCHES);
    this.notify();
    await this.persist();
  }

  async markUndone(id: string, undo: AgentChangeUndo): Promise<void> {
    this.batches = this.batches.map((batch) =>
      batch.id === id ? { ...batch, undo } : batch
    );
    this.notify();
    await this.persist();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private async persist(): Promise<void> {
    await this.load();
    try {
      await this.storage.save(this.batches);
    } catch (error) {
      
      console.warn(
        '[Journalit] Could not save the agent change history:',
        error
      );
    }
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }
}
