import { TFile, type App } from 'obsidian';
import type { TradeFormData } from '../../components/forms/trade/types';
import { hasTradeIdentityChanged } from '../../utils/tradeTypeRouting';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import { isStrictTradeId } from '../../utils/tradeIdentity';
import { MISSED_TRADE_AGENT_ID_KEY } from '../agent/identity/missedTradeIdentityStore';
import type { BacktestTradeService } from '../backtestTrade/BacktestTradeService';
import { eventBus } from '../events/EventBus';
import type { MissedTradeService } from '../missedTrade/MissedTradeService';
import type {
  TradeCommitEventBatch,
  TradeUpdateGuard,
  TradeUpdateOptions,
} from './core/TradeCommandService';
import type { TradeData, TradeService } from './TradeService';


export type TradeNoteType = 'regular' | 'missed' | 'backtest';


interface ExpectedTradeRevision {
  readonly tradeRevision: number;
  
  readonly contentRevision?: string;
}


export class TradeNoteConflictError extends Error {
  constructor() {
    super('The trade note changed since it was read.');
    this.name = 'TradeNoteConflictError';
  }
}

interface TradeNoteWriterDependencies {
  app: App;
  tradeService: Pick<
    TradeService,
    | 'createTrade'
    | 'updateTradeWithReceipt'
    | 'getCurrentTradeMutationRevision'
    | 'runSerializedNoteWrite'
    | 'generateNewTradePath'
    | 'sanitizeTickerForFilename'
  >;
  getMissedTradeService(): Promise<
    Pick<
      MissedTradeService,
      'createMissedTrade' | 'updateMissedTrade' | 'generateMissedTradePath'
    >
  >;
  getBacktestTradeService(): Promise<
    Pick<
      BacktestTradeService,
      | 'createBacktestTrade'
      | 'updateBacktestTrade'
      | 'generateBacktestTradePath'
    >
  >;
  
  plugin?: unknown;
}

interface TradeNoteCreateOptions {
  
  open?: boolean;
  commitEventBatch?: TradeCommitEventBatch;
}

interface TradeNoteUpdateRequest {
  
  path: string;
  
  previous: Readonly<Record<string, unknown>>;
  
  next: TradeData;
  
  sourceType: TradeNoteType;
  
  type: TradeNoteType;
  
  expected?: ExpectedTradeRevision;
  source?: string;
  commitEventBatch?: TradeCommitEventBatch;
}

interface TradeNoteUpdateReceipt {
  readonly path: string;
  
  readonly revision: number;
}


function tradeTypeFlags(type: TradeNoteType): {
  isMissedTrade: boolean;
  isBacktestTrade: boolean;
} {
  return {
    isMissedTrade: type === 'missed',
    isBacktestTrade: type === 'backtest',
  };
}


function asFormData(data: TradeData): TradeFormData {
  return data as unknown as TradeFormData;
}


export class TradeNoteWriter {
  constructor(private readonly deps: TradeNoteWriterDependencies) {}

  
  async create(
    type: TradeNoteType,
    data: TradeData,
    options: TradeNoteCreateOptions = {}
  ): Promise<string> {
    const typed = { ...data, ...tradeTypeFlags(type) };
    if (type === 'missed') {
      const missed = await this.deps.getMissedTradeService();
      return missed.createMissedTrade(
        { ...asFormData(typed), isMissedTrade: true },
        { suppressAutoOpen: options.open !== true, deferPostCreateTasks: true }
      );
    }
    if (type === 'backtest') {
      const backtest = await this.deps.getBacktestTradeService();
      const file = await backtest.createBacktestTrade(
        {
          ...asFormData(typed),
          isBacktestTrade: true,
        },
        {
          openFile: options.open === true,
          images: data.images,
          customFields: data.customFields,
          deferPostCreateTasks: true,
        }
      );
      if (!file) throw new Error('Backtest trade was not created.');
      return file.path;
    }
    return this.deps.tradeService.createTrade(
      { ...data, isMissedTrade: false, isBacktestTrade: false },
      {
        suppressAutoOpen: options.open !== true,
        deferPostCreateTasks: true,
        commitEventBatch: options.commitEventBatch,
      }
    );
  }

  
  async update(
    request: TradeNoteUpdateRequest
  ): Promise<TradeNoteUpdateReceipt> {
    const { previous, expected } = request;
    const targetType = request.type;
    const next = { ...request.next, ...tradeTypeFlags(targetType) };
    const { sourceType } = request;

    let receipt: TradeNoteUpdateReceipt;
    if (targetType === 'regular') {
      
      
      
      
      const options: TradeUpdateOptions = {};
      if (expected) {
        options.expectedTradeRevision = expected.tradeRevision;
        if (expected.contentRevision !== undefined) {
          options.expectedTradeContentRevision = expected.contentRevision;
        }
      }
      if (sourceType === 'missed') {
        options.beforeWrite = () =>
          this.carryForRegular(request.path, previous, expected);
      }
      if (request.commitEventBatch) {
        options.commitEventBatch = request.commitEventBatch;
      }
      const committed = await this.deps.tradeService.updateTradeWithReceipt(
        next,
        request.path,
        request.source,
        options
      );
      receipt = { path: committed.path, revision: committed.revision };
    } else {
      
      
      
      receipt = await this.deps.tradeService.runSerializedNoteWrite(
        request.path,
        async () => {
          if (expected) await this.assertRevision(request.path, expected);
          const path = await this.relocate(
            request.path,
            previous,
            next,
            sourceType,
            targetType
          );
          await this.carryIdentity(path, previous, sourceType, targetType);
          return this.writeTyped(targetType, next, path);
        }
      );
    }
    if (sourceType !== targetType) {
      publishTypeRemoval(sourceType, request.path);
    }
    return receipt;
  }

  
  async delete(
    path: string,
    type: TradeNoteType,
    expected?: ExpectedTradeRevision
  ): Promise<void> {
    await this.deps.tradeService.runSerializedNoteWrite(path, async () => {
      if (expected) await this.assertRevision(path, expected);
      const file = this.deps.app.vault.getAbstractFileByPath(path);
      if (!(file instanceof TFile)) throw new Error('Trade note not found.');
      await this.deps.app.fileManager.trashFile(file);
    });
    publishTypeRemoval(type, path);
  }

  
  private async carryForRegular(
    path: string,
    previous: Readonly<Record<string, unknown>>,
    expected: ExpectedTradeRevision | undefined
  ): Promise<TradeUpdateGuard | undefined> {
    if (expected) await this.assertRevision(path, expected);
    await this.carryIdentity(path, previous, 'missed', 'regular');
    if (!expected) return undefined;
    const carried =
      await this.deps.tradeService.getCurrentTradeMutationRevision(path);
    return {
      expectedTradeRevision: carried.tradeRevision,
      expectedTradeContentRevision: carried.contentRevision,
    };
  }

  
  private async writeTyped(
    type: Exclude<TradeNoteType, 'regular'>,
    next: TradeData,
    path: string
  ): Promise<TradeNoteUpdateReceipt> {
    if (type === 'missed') {
      const missed = await this.deps.getMissedTradeService();
      const written = await missed.updateMissedTrade(
        { ...asFormData(next), isMissedTrade: true },
        path
      );
      return { path: written, revision: await this.revisionOf(written) };
    }
    const backtest = await this.deps.getBacktestTradeService();
    const written = await backtest.updateBacktestTrade(
      { ...asFormData(next), isBacktestTrade: true },
      path
    );
    if (!written) throw new Error('Backtest trade was not updated.');
    return { path, revision: await this.revisionOf(path) };
  }

  private async revisionOf(path: string): Promise<number> {
    return (await this.deps.tradeService.getCurrentTradeMutationRevision(path))
      .tradeRevision;
  }

  private async assertRevision(
    path: string,
    expected: ExpectedTradeRevision
  ): Promise<void> {
    const current =
      await this.deps.tradeService.getCurrentTradeMutationRevision(path);
    if (
      current.tradeRevision !== expected.tradeRevision ||
      (expected.contentRevision !== undefined &&
        current.contentRevision !== expected.contentRevision)
    ) {
      throw new TradeNoteConflictError();
    }
  }

  
  private async relocate(
    path: string,
    previous: Readonly<Record<string, unknown>>,
    next: TradeData,
    sourceType: TradeNoteType,
    targetType: TradeNoteType
  ): Promise<string> {
    if (targetType === 'regular') return path;
    if (
      !hasTradeIdentityChanged(
        { ...previous, ...tradeTypeFlags(sourceType), filePath: path },
        next,
        this.deps.plugin,
        (ticker) => this.deps.tradeService.sanitizeTickerForFilename(ticker)
      ) &&
      sourceType === targetType
    ) {
      return path;
    }
    const naming = {
      instrument: next.instrument ?? '',
      entryTime: next.entryTime,
    };
    const nextPath =
      targetType === 'missed'
        ? await (
            await this.deps.getMissedTradeService()
          ).generateMissedTradePath(naming)
        : await (
            await this.deps.getBacktestTradeService()
          ).generateBacktestTradePath(naming);
    if (!nextPath || nextPath === path) return path;
    const file = this.deps.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) throw new Error('Trade note not found.');
    const folder = nextPath.slice(0, nextPath.lastIndexOf('/'));
    if (folder && !(await this.deps.app.vault.adapter.exists(folder))) {
      await this.deps.app.vault.adapter.mkdir(folder);
    }
    await this.deps.app.vault.rename(file, nextPath);
    return nextPath;
  }

  
  private async carryIdentity(
    path: string,
    previous: Readonly<Record<string, unknown>>,
    sourceType: TradeNoteType,
    targetType: TradeNoteType
  ): Promise<void> {
    const toMissed = sourceType !== 'missed' && targetType === 'missed';
    const fromMissed = sourceType === 'missed' && targetType !== 'missed';
    if (!toMissed && !fromMissed) return;
    const file = this.deps.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) throw new Error('Trade note not found.');
    await this.deps.app.fileManager.processFrontMatter(
      file,
      (frontmatter: Record<string, unknown>) => {
        if (toMissed) {
          if (isStrictTradeId(previous.tradeId)) {
            frontmatter[MISSED_TRADE_AGENT_ID_KEY] = previous.tradeId;
          }
          return;
        }
        const agentId = frontmatter[MISSED_TRADE_AGENT_ID_KEY];
        if (isStrictTradeId(agentId)) frontmatter.tradeId = agentId;
        delete frontmatter[MISSED_TRADE_AGENT_ID_KEY];
      }
    );
    
    
    await forceMetadataCacheRefresh(this.deps.app, file, 500);
  }
}


function publishTypeRemoval(type: TradeNoteType, path: string): void {
  const timestamp = Date.now();
  if (type === 'missed') {
    eventBus.publish('missed-trade:changed', {
      action: 'deleted',
      filePath: path,
      timestamp,
    });
  } else if (type === 'backtest') {
    eventBus.publish('backtest-trade:changed', {
      action: 'deleted',
      filePath: path,
      timestamp,
    });
  } else {
    eventBus.publish('trade:changed', {
      action: 'deleted',
      filePaths: [path],
    });
  }
}
