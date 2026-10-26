import {
  buildTradeIdentityFields,
  getTradeIdValue,
} from '../../../utils/tradeIdentity';
import type { TradeData } from '../TradeService';
import type { PreviousTagAssignments } from '../../options/CustomOptionsService';
import { ObsidianTradeNoteStore } from './ObsidianTradeNoteStore';
import { TradeEventBridge } from './TradeEventBridge';
import { TradeReadModel } from './TradeReadModel';
import type {
  TradeChange,
  TradeCommitReceipt,
  TradeCommittedPayload,
  TradeIdentitySnapshot,
} from './tradeCoreTypes';
import type { TradeNoteKind } from './types';

export class TradeCommitEventBatch {
  private readonly payloads: TradeCommittedPayload[] = [];
  private flushed = false;

  constructor(private readonly eventBridge: TradeEventBridge) {}

  public enqueue(payload: TradeCommittedPayload): void {
    if (this.flushed) {
      this.eventBridge.publishCommittedChange(payload);
      return;
    }
    this.payloads.push(payload);
  }

  public flush(): void {
    if (this.flushed) return;
    this.flushed = true;
    this.eventBridge.publishCommittedBatch([...this.payloads]);
    this.payloads.length = 0;
  }

  public retainPaths(filePaths: ReadonlySet<string>): void {
    if (this.flushed) return;
    for (let index = this.payloads.length - 1; index >= 0; index--) {
      if (!filePaths.has(this.payloads[index].receipt.path)) {
        this.payloads.splice(index, 1);
      }
    }
  }
}

export interface TradeCreateOptions {
  
  noteKind?: TradeNoteKind;
  suppressAutoOpen?: boolean;
  deferPostCreateTasks?: boolean;
  suppressPostCreateTasks?: boolean;
  commitEventBatch?: TradeCommitEventBatch;
  creationBatch?: TradeCreationBatch;
  
  applyLayoutNoteSections?: boolean;
}

export class TradeCreationBatchFinalizationError extends Error {
  constructor(public readonly cause: unknown) {
    super(
      cause instanceof Error
        ? cause.message
        : 'Trade creation batch finalization failed'
    );
    this.name = 'TradeCreationBatchFinalizationError';
  }
}

export interface TradeCreationBatch {
  registerCreatedFile(filePath: string): Promise<void>;
  registerPostCreateTask(
    filePath: string,
    task: () => Promise<void>
  ): Promise<void>;
  requestCacheInvalidation(): Promise<void>;
  retainPaths(filePaths: ReadonlySet<string>): void;
  abandon(): void;
  flush(beforePostCreateTasks?: () => void | Promise<void>): Promise<void>;
}

interface TradeServiceMutator {
  legacyCreateTrade(
    data: TradeData,
    options?: TradeCreateOptions
  ): Promise<string>;
  legacyUpdateTrade(
    data: TradeData,
    filePath: string,
    source?: string,
    noteKind?: TradeNoteKind
  ): Promise<string>;
  getTradeSchemaVersion(): number;
}

type TagAssignmentRunner = <T>(
  tags: readonly string[],
  operation: () => Promise<T>,
  previousTags?: PreviousTagAssignments
) => Promise<T>;

export interface TradeUpdateOptions {
  
  noteKind?: TradeNoteKind;
  suppressLegacyTradeChanged?: boolean;
  expectedTradeRevision?: number;
  expectedTradeContentRevision?: string;
  commitEventBatch?: TradeCommitEventBatch;
  
  beforeWrite?: () => Promise<TradeUpdateGuard | undefined>;
}


export type TradeUpdateGuard = Pick<
  TradeUpdateOptions,
  'expectedTradeRevision' | 'expectedTradeContentRevision'
>;

export class TradeRevisionConflictError extends Error {
  constructor(
    public readonly currentRevision: number,
    public readonly expectedRevision: number
  ) {
    super('Trade revision conflict');
    this.name = 'TradeRevisionConflictError';
  }
}

export class TradeCommandService {
  private readonly updateWorkByPath = new Map<string, Promise<void>>();
  private tagAssignmentRunner?: TagAssignmentRunner;

  constructor(
    private readonly tradeService: TradeServiceMutator,
    private readonly noteStore: ObsidianTradeNoteStore,
    private readonly readModel: TradeReadModel,
    private readonly eventBridge: TradeEventBridge
  ) {}

  public setTagAssignmentRunner(runner: TagAssignmentRunner): void {
    this.tagAssignmentRunner = runner;
  }

  public async getCurrentTradeRevision(filePath: string): Promise<number> {
    const identity = await this.noteStore.readIdentity(filePath);
    return this.getCurrentTradeRevisionFromIdentity(filePath, identity);
  }

  public async getCurrentTradeMutationRevision(filePath: string): Promise<{
    tradeRevision: number;
    contentRevision: string;
  }> {
    const snapshot = await this.noteStore.readMutationRevision(filePath);
    if (snapshot === null) throw new Error('Trade note is unavailable.');
    return {
      tradeRevision: this.getCurrentTradeRevisionFromIdentity(
        filePath,
        snapshot.identity
      ),
      contentRevision: snapshot.contentRevision,
    };
  }

  
  public async getTradeEditRevision(
    filePath: string
  ): Promise<{ contentRevision: string; editRevision: string }> {
    const snapshot = await this.noteStore.readEditRevision(filePath);
    if (snapshot === null) throw new Error('Trade note is unavailable.');
    return snapshot;
  }

  private runWithTagAssignments<T>(
    data: TradeData,
    operation: () => Promise<T>,
    previousTags: PreviousTagAssignments = []
  ): Promise<T> {
    if (!this.tagAssignmentRunner) return operation();
    const tags = data.tags ?? [];
    return this.tagAssignmentRunner(tags, operation, previousTags);
  }

  public async createTrade(
    data: TradeData,
    options?: TradeCreateOptions
  ): Promise<string> {
    const tradeId = this.getTradeId(data);
    const revision = 1;
    const schemaVersion = this.tradeService.getTradeSchemaVersion();
    const committedData: TradeData = {
      ...data,
      tradeId,
      schemaVersion,
      tradeRevision: revision,
    };

    const path = await this.runWithTagAssignments(committedData, () =>
      this.tradeService.legacyCreateTrade(committedData, options)
    );

    const change: TradeChange = {
      action: 'created',
      tradeId,
      path,
    };
    const receipt: TradeCommitReceipt = {
      tradeId,
      path,
      revision,
      schemaVersion,
      committedAt: Date.now(),
      ...this.getTradeProjectionIdentity(committedData),
    };
    this.recordCommit(change, receipt, options?.commitEventBatch);

    return path;
  }

  public async updateTrade(
    data: TradeData,
    filePath: string,
    source?: string,
    options?: TradeUpdateOptions
  ): Promise<string> {
    const receipt = await this.updateTradeWithReceipt(
      data,
      filePath,
      source,
      options
    );
    return receipt.path;
  }

  public async updateTradeWithReceipt(
    data: TradeData,
    filePath: string,
    source?: string,
    options?: TradeUpdateOptions
  ): Promise<Readonly<TradeCommitReceipt>> {
    const receipt = await this.runSerializedUpdate(filePath, async () => {
      const guard = await options?.beforeWrite?.();
      return this.updateTradeUnlocked(
        data,
        filePath,
        source,
        guard ? { ...options, ...guard } : options
      );
    });
    return { ...receipt };
  }

  
  public async runSerializedUpdate<T>(
    filePath: string,
    write: () => Promise<T>
  ): Promise<T> {
    const previousWork =
      this.updateWorkByPath.get(filePath) ?? Promise.resolve();
    const execution = previousWork.catch(() => undefined).then(write);
    const settlement = execution.then(
      () => undefined,
      () => undefined
    );
    this.updateWorkByPath.set(filePath, settlement);
    void settlement.finally(() => {
      if (this.updateWorkByPath.get(filePath) === settlement) {
        this.updateWorkByPath.delete(filePath);
      }
    });
    return execution;
  }

  private async updateTradeUnlocked(
    data: TradeData,
    filePath: string,
    source?: string,
    options?: TradeUpdateOptions
  ): Promise<TradeCommitReceipt> {
    const mutationSnapshot =
      options?.expectedTradeContentRevision === undefined
        ? null
        : await this.noteStore.readMutationRevision(filePath);
    const identitySnapshot = mutationSnapshot
      ? mutationSnapshot.identity
      : await this.noteStore.readIdentity(filePath);
    const identity = identitySnapshot ?? undefined;
    const tradeId =
      identity?.tradeId ??
      this.readModel.getTradeIdForPath(filePath) ??
      buildTradeIdentityFields(data).tradeId;
    const currentRevision = this.getCurrentTradeRevisionFromIdentity(
      filePath,
      identitySnapshot
    );
    if (
      options?.expectedTradeRevision !== undefined &&
      currentRevision !== options.expectedTradeRevision
    ) {
      throw new TradeRevisionConflictError(
        currentRevision,
        options.expectedTradeRevision
      );
    }
    if (
      options?.expectedTradeContentRevision !== undefined &&
      mutationSnapshot?.contentRevision !== options.expectedTradeContentRevision
    ) {
      throw new TradeRevisionConflictError(
        currentRevision,
        options.expectedTradeRevision ?? currentRevision
      );
    }
    const revision = this.readModel.getNextRevision(
      tradeId,
      identity?.tradeRevision ?? 0
    );
    const schemaVersion = Math.max(
      identity?.schemaVersion ?? 0,
      this.tradeService.getTradeSchemaVersion()
    );
    const committedData: TradeData = {
      ...data,
      tradeId,
      schemaVersion,
      tradeRevision: revision,
    };

    const path = await this.runWithTagAssignments(
      committedData,
      () =>
        this.tradeService.legacyUpdateTrade(
          committedData,
          filePath,
          source,
          options?.noteKind
        ),
      () => this.noteStore.readAssignedTags(filePath)
    );

    const change: TradeChange = {
      action: path === filePath ? 'updated' : 'relocated',
      tradeId,
      path,
      previousPath: path === filePath ? undefined : filePath,
      source,
    };
    const receipt: TradeCommitReceipt = {
      tradeId,
      path,
      previousPath: path === filePath ? undefined : filePath,
      revision,
      schemaVersion,
      committedAt: Date.now(),
      ...this.getTradeProjectionIdentity(committedData),
    };
    this.recordCommit(change, receipt, options?.commitEventBatch, {
      suppressLegacyTradeChanged:
        options?.suppressLegacyTradeChanged ?? source === 'user-input',
    });

    return receipt;
  }

  private getCurrentTradeRevisionFromIdentity(
    filePath: string,
    identity: TradeIdentitySnapshot | null
  ): number {
    return Math.max(
      identity?.tradeRevision ?? 0,
      this.readModel.getEntryForPath(filePath)?.revision ?? 0
    );
  }

  private recordCommit(
    change: TradeChange,
    receipt: TradeCommitReceipt,
    commitEventBatch?: TradeCommitEventBatch,
    options?: { suppressLegacyTradeChanged?: boolean }
  ): void {
    this.readModel.recordCommit(receipt);
    const payload = { change, receipt };
    if (commitEventBatch) {
      commitEventBatch.enqueue(payload);
      return;
    }
    this.eventBridge.publishCommittedChange(payload, options);
  }

  private getTradeId(data: TradeData): string {
    return (
      getTradeIdValue(data.tradeId) ?? buildTradeIdentityFields(data).tradeId
    );
  }

  private getTradeProjectionIdentity(
    data: TradeData
  ): Pick<
    TradeCommitReceipt,
    | 'canonicalTradeId'
    | 'canonicalTradeVersion'
    | 'canonicalAccountId'
    | 'canonicalBroker'
    | 'canonicalAccountDisplayName'
    | 'canonicalProjectionSchemaVersion'
    | 'tradeImportId'
    | 'tradeImportVersion'
  > {
    const canonicalIdentity =
      typeof data.canonicalTradeId === 'string' &&
      typeof data.canonicalTradeVersion === 'number' &&
      Number.isFinite(data.canonicalTradeVersion)
        ? {
            canonicalTradeId: data.canonicalTradeId,
            canonicalTradeVersion: data.canonicalTradeVersion,
            canonicalProjectionGeneration: data.canonicalProjectionGeneration,
            canonicalAccountId: data.canonicalAccountId,
            canonicalBroker: data.canonicalBroker,
            canonicalAccountDisplayName: data.canonicalAccountDisplayName,
            canonicalProjectionSchemaVersion:
              data.canonicalProjectionSchemaVersion,
          }
        : {};
    const legacyIdentity =
      typeof data.tradeImportId === 'string' &&
      typeof data.tradeImportVersion === 'number' &&
      Number.isFinite(data.tradeImportVersion)
        ? {
            tradeImportId: data.tradeImportId,
            tradeImportVersion: data.tradeImportVersion,
          }
        : {};
    return { ...canonicalIdentity, ...legacyIdentity };
  }
}
