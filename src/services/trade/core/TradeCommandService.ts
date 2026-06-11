import {
  buildTradeIdentityFields,
  getTradeIdValue,
} from '../../../utils/tradeIdentity';
import type { TradeData } from '../TradeService';
import { ObsidianTradeNoteStore } from './ObsidianTradeNoteStore';
import { TradeEventBridge } from './TradeEventBridge';
import { TradeReadModel } from './TradeReadModel';
import type { TradeChange, TradeCommitReceipt } from './tradeCoreTypes';

interface TradeServiceMutator {
  legacyCreateTrade(
    data: TradeData,
    options?: {
      suppressAutoOpen?: boolean;
      deferPostCreateTasks?: boolean;
      suppressPostCreateTasks?: boolean;
    },
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

export class TradeCommandService {
  constructor(
    private readonly tradeService: TradeServiceMutator,
    private readonly noteStore: ObsidianTradeNoteStore,
    private readonly readModel: TradeReadModel,
    private readonly eventBridge: TradeEventBridge
  ) {}

  public async createTrade(
    data: TradeData,
    options?: {
      suppressAutoOpen?: boolean;
      deferPostCreateTasks?: boolean;
      suppressPostCreateTasks?: boolean;
    }
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

    const path = await this.tradeService.legacyCreateTrade(
      committedData,
      options,
      true
    );

    this.recordAndPublish(
      {
        action: 'created',
        tradeId,
        path,
      },
      {
        tradeId,
        path,
        revision,
        schemaVersion,
        committedAt: Date.now(),
      }
    );

    return path;
  }

  public async updateTrade(
    data: TradeData,
    filePath: string,
    source?: string,
    options?: { suppressLegacyTradeChanged?: boolean }
  ): Promise<string> {
    const identity = (await this.noteStore.readIdentity(filePath)) ?? undefined;
    const tradeId =
      identity?.tradeId ??
      this.readModel.getTradeIdForPath(filePath) ??
      buildTradeIdentityFields(data).tradeId;
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

    const path = await this.tradeService.legacyUpdateTrade(
      committedData,
      filePath,
      source,
      true
    );

    this.recordAndPublish(
      {
        action: path === filePath ? 'updated' : 'relocated',
        tradeId,
        path,
        previousPath: path === filePath ? undefined : filePath,
        source,
      },
      {
        tradeId,
        path,
        previousPath: path === filePath ? undefined : filePath,
        revision,
        schemaVersion,
        committedAt: Date.now(),
      },
      {
        suppressLegacyTradeChanged:
          options?.suppressLegacyTradeChanged ?? source === 'user-input',
      }
    );

    return path;
  }

  private getTradeId(data: TradeData): string {
    return (
      getTradeIdValue(data.tradeId) ?? buildTradeIdentityFields(data).tradeId
    );
  }

  private recordAndPublish(
    change: TradeChange,
    receipt: TradeCommitReceipt,
    options?: { suppressLegacyTradeChanged?: boolean }
  ): void {
    this.readModel.recordCommit(receipt);
    this.eventBridge.publishCommittedChange({ change, receipt }, options);
  }
}
