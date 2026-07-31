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
} from './tradeCoreTypes';

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
}

export interface TradeCreateOptions {
  suppressAutoOpen?: boolean;
  deferPostCreateTasks?: boolean;
  suppressPostCreateTasks?: boolean;
  commitEventBatch?: TradeCommitEventBatch;
  creationBatch?: TradeCreationBatch;
}

export interface TradeCreationBatch {
  registerCreatedFile(filePath: string): Promise<void>;
  requestCacheInvalidation(): Promise<void>;
  flush(): Promise<void>;
}

interface TradeServiceMutator {
  legacyCreateTrade(
    data: TradeData,
    options?: TradeCreateOptions,
    suppressTradeChangedEvent?: boolean
  ): Promise<string>;
  legacyUpdateTrade(
    data: TradeData,
    filePath: string,
    source?: string,
    suppressTradeChangedEvent?: boolean
  ): Promise<string>;
  getTradeSchemaVersion(): number;
}

type TagAssignmentRunner = <T>(
  tags: readonly string[],
  operation: () => Promise<T>,
  previousTags?: PreviousTagAssignments
) => Promise<T>;

export interface TradeUpdateOptions {
  suppressLegacyTradeChanged?: boolean;
  expectedTradeRevision?: number;
  commitEventBatch?: TradeCommitEventBatch;
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

  private runWithTagAssignments<T>(
    data: TradeData,
    operation: () => Promise<T>,
    previousTags: PreviousTagAssignments = []
  ): Promise<T> {
    if (!this.tagAssignmentRunner) return operation();
    const tags = [...(data.tags ?? []), ...(data.customTags ?? [])];
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
      this.tradeService.legacyCreateTrade(committedData, options, true)
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
    const previousWork =
      this.updateWorkByPath.get(filePath) ?? Promise.resolve();
    const execution = previousWork
      .catch(() => undefined)
      .then(() => this.updateTradeUnlocked(data, filePath, source, options));
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
  ): Promise<string> {
    const identitySnapshot = await this.noteStore.readIdentity(filePath);
    const identity = identitySnapshot ?? undefined;
    const tradeId =
      identity?.tradeId ??
      this.readModel.getTradeIdForPath(filePath) ??
      buildTradeIdentityFields(data).tradeId;
    const currentRevision = Math.max(
      identity?.tradeRevision ?? 0,
      this.readModel.getEntryForPath(filePath)?.revision ?? 0
    );
    if (
      options?.expectedTradeRevision !== undefined &&
      currentRevision !== options.expectedTradeRevision
    ) {
      throw new Error('Trade changed before projection update');
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
          true
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

    return path;
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
