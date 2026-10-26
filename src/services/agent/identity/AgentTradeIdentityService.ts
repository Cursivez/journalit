import type { App, TFile } from 'obsidian';
import { readCurrentFrontmatter } from '../../../utils/dataRefresh';
import { Mutex } from '../../../utils/mutex';
import {
  ensureTradeIdentityFrontmatter,
  getTradeIdentityNoteType,
  isStrictTradeId,
} from '../../../utils/tradeIdentity';
import type { FolderPathService } from '../../core/FolderPathService';
import { eventBus } from '../../events';
import type { MissedTradeService } from '../../missedTrade/MissedTradeService';
import {
  compareMissedTradeIdentityOrder,
  generateMissedTradeAgentId,
  isMissedTradeAgentId,
  MISSED_TRADE_AGENT_ID_KEY,
} from './missedTradeIdentityStore';

const MISSED_TRADE_IDENTITIES_UNAVAILABLE_ERROR =
  'Missed trade identities are temporarily unavailable';
const TRADE_IDENTITIES_UNAVAILABLE_ERROR =
  'Trade identities are temporarily unavailable';

export interface AgentTradeIdentityRecord {
  file: TFile;
  tradeId: string;
  tradeType: 'regular' | 'missed' | 'backtest';
  tradeRevision?: number;
}

interface CoreTradeCandidate {
  file: TFile;
  frontmatter: Readonly<Record<string, unknown>>;
  tradeType: 'regular' | 'backtest';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getTradeRevision(value: unknown): number | undefined {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value)
        : undefined;

  return parsed !== undefined && Number.isSafeInteger(parsed) && parsed >= 0
    ? parsed
    : undefined;
}

export class AgentTradeIdentityService {
  private readonly catalogMutex = new Mutex();

  constructor(
    private readonly app: App,
    private readonly missedTradeService: MissedTradeService,
    private readonly folderPathService: FolderPathService
  ) {}

  public async listTradeIdentitiesStrict(): Promise<
    readonly AgentTradeIdentityRecord[]
  > {
    return this.runUnifiedCatalogOperation();
  }

  public async resolveTradeId(
    tradeId: string
  ): Promise<AgentTradeIdentityRecord | null> {
    if (!isStrictTradeId(tradeId)) {
      return null;
    }

    const catalog = await this.runUnifiedCatalogOperation();
    return catalog.find((record) => record.tradeId === tradeId) ?? null;
  }

  public async listMissedTradeIdentitiesStrict(): Promise<
    readonly { file: TFile; tradeId: string }[]
  > {
    return this.runMissedCatalogOperation();
  }

  public async resolveMissedTradeId(tradeId: string): Promise<TFile | null> {
    if (!isMissedTradeAgentId(tradeId)) {
      return null;
    }

    const catalog = await this.runMissedCatalogOperation();
    return catalog.find((record) => record.tradeId === tradeId)?.file ?? null;
  }

  private async runUnifiedCatalogOperation(): Promise<
    readonly AgentTradeIdentityRecord[]
  > {
    try {
      return await this.catalogMutex.withLock(() =>
        this.materializeUnifiedCatalog()
      );
    } catch {
      throw new Error(TRADE_IDENTITIES_UNAVAILABLE_ERROR);
    }
  }

  private async runMissedCatalogOperation(): Promise<
    readonly { file: TFile; tradeId: string }[]
  > {
    try {
      return await this.catalogMutex.withLock(async () => {
        const missedFiles = await this.discoverMissedFiles();
        const coreIds = await this.collectValidCoreTradeIds();
        return this.materializeMissedCatalog(missedFiles, coreIds);
      });
    } catch {
      throw new Error(MISSED_TRADE_IDENTITIES_UNAVAILABLE_ERROR);
    }
  }

  private async materializeUnifiedCatalog(): Promise<
    readonly AgentTradeIdentityRecord[]
  > {
    const missedFiles = await this.discoverMissedFiles();
    const coreCandidates = await this.discoverCoreCandidates();
    const { records: coreRecords, assignedIds } =
      await this.materializeCoreCatalog(coreCandidates);
    const missedRecords = await this.materializeMissedCatalog(
      missedFiles,
      assignedIds
    );

    return [
      ...coreRecords,
      ...missedRecords.map(({ file, tradeId }) => ({
        file,
        tradeId,
        tradeType: 'missed' as const,
      })),
    ];
  }

  private async discoverMissedFiles(): Promise<TFile[]> {
    return [
      ...(await this.missedTradeService.listManagedMissedTradeFilesForAgentIdentityStrict()),
    ].sort(compareMissedTradeIdentityOrder);
  }

  private async discoverCoreCandidates(): Promise<CoreTradeCandidate[]> {
    const candidates: CoreTradeCandidate[] = [];

    for (const file of this.app.vault.getMarkdownFiles()) {
      if (!this.folderPathService.isJournalPath(file.path)) {
        continue;
      }

      const frontmatter = await readCurrentFrontmatter(this.app, file);
      const noteType = getTradeIdentityNoteType(frontmatter, file.path);
      if (!frontmatter || !noteType) {
        continue;
      }

      candidates.push({
        file,
        frontmatter,
        tradeType: noteType === 'trade' ? 'regular' : 'backtest',
      });
    }

    return candidates.sort((a, b) =>
      compareMissedTradeIdentityOrder(a.file, b.file)
    );
  }

  private async collectValidCoreTradeIds(): Promise<Set<string>> {
    const coreIds = new Set<string>();

    for (const candidate of await this.discoverCoreCandidates()) {
      const tradeId = candidate.frontmatter.tradeId;
      if (isStrictTradeId(tradeId)) {
        coreIds.add(tradeId);
      }
    }

    return coreIds;
  }

  private async materializeCoreCatalog(
    candidates: readonly CoreTradeCandidate[]
  ): Promise<{
    records: AgentTradeIdentityRecord[];
    assignedIds: Set<string>;
  }> {
    const keepers = new Map<TFile, string>();
    const assignedIds = new Set<string>();

    for (const { file, frontmatter } of candidates) {
      const tradeId = frontmatter.tradeId;
      if (isStrictTradeId(tradeId) && !assignedIds.has(tradeId)) {
        keepers.set(file, tradeId);
        assignedIds.add(tradeId);
      }
    }

    const records: AgentTradeIdentityRecord[] = [];
    for (const candidate of candidates) {
      const keeperId = keepers.get(candidate.file);
      const persisted = keeperId
        ? {
            tradeId: keeperId,
            tradeRevision: getTradeRevision(
              candidate.frontmatter.tradeRevision
            ),
          }
        : await this.persistFreshCoreId(candidate, assignedIds);

      assignedIds.add(persisted.tradeId);
      records.push({
        file: candidate.file,
        tradeId: persisted.tradeId,
        tradeType: candidate.tradeType,
        ...(persisted.tradeRevision === undefined
          ? {}
          : { tradeRevision: persisted.tradeRevision }),
      });
    }

    return { records, assignedIds };
  }

  private async materializeMissedCatalog(
    missedFiles: readonly TFile[],
    reservedIds: ReadonlySet<string>
  ): Promise<readonly { file: TFile; tradeId: string }[]> {
    const storedIdentities = await Promise.all(
      missedFiles.map(async (file) => ({
        file,
        storedId: (await readCurrentFrontmatter(this.app, file))[
          MISSED_TRADE_AGENT_ID_KEY
        ],
      }))
    );
    const keepers = new Map<TFile, string>();
    const assignedIds = new Set(reservedIds);

    for (const { file, storedId } of storedIdentities) {
      if (isMissedTradeAgentId(storedId) && !assignedIds.has(storedId)) {
        keepers.set(file, storedId);
        assignedIds.add(storedId);
      }
    }

    const records: Array<{ file: TFile; tradeId: string }> = [];
    for (const file of missedFiles) {
      const tradeId =
        keepers.get(file) ??
        (await this.persistFreshMissedId(file, assignedIds));

      assignedIds.add(tradeId);
      records.push({ file, tradeId });
    }

    return records;
  }

  private async persistFreshCoreId(
    candidate: CoreTradeCandidate,
    assignedIds: ReadonlySet<string>
  ): Promise<{ tradeId: string; tradeRevision?: number }> {
    const { file, tradeType } = candidate;
    let persistedId = '';
    let tradeRevision: number | undefined;
    let identityChanged = false;

    await this.app.fileManager.processFrontMatter(
      file,
      (frontmatter: unknown) => {
        if (!isRecord(frontmatter)) {
          throw new Error(TRADE_IDENTITIES_UNAVAILABLE_ERROR);
        }

        const currentId = frontmatter.tradeId;
        if (isStrictTradeId(currentId) && !assignedIds.has(currentId)) {
          const identity = ensureTradeIdentityFrontmatter(frontmatter);
          persistedId = identity.tradeId;
          identityChanged = identity.changed;
        } else {
          do {
            persistedId = ensureTradeIdentityFrontmatter(frontmatter, {
              forceNewTradeId: true,
            }).tradeId;
          } while (assignedIds.has(persistedId));
          identityChanged = true;
        }
        tradeRevision = getTradeRevision(frontmatter.tradeRevision);
      }
    );
    if (identityChanged && tradeType === 'backtest') {
      eventBus.publish('backtest-trade:changed', {
        action: 'updated',
        filePath: file.path,
        timestamp: Date.now(),
      });
    } else if (identityChanged) {
      eventBus.publish('trade:changed', {
        action: 'updated',
        filePath: file.path,
        timestamp: Date.now(),
      });
    }

    return tradeRevision === undefined
      ? { tradeId: persistedId }
      : { tradeId: persistedId, tradeRevision };
  }

  private async persistFreshMissedId(
    file: TFile,
    assignedIds: ReadonlySet<string>
  ): Promise<string> {
    let tradeId = generateMissedTradeAgentId();
    while (assignedIds.has(tradeId)) {
      tradeId = generateMissedTradeAgentId();
    }
    let persistedId = tradeId;
    let identityChanged = false;

    await this.app.fileManager.processFrontMatter(
      file,
      (frontmatter: unknown) => {
        if (!isRecord(frontmatter)) {
          throw new Error(MISSED_TRADE_IDENTITIES_UNAVAILABLE_ERROR);
        }
        const currentId = frontmatter[MISSED_TRADE_AGENT_ID_KEY];
        if (isMissedTradeAgentId(currentId) && !assignedIds.has(currentId)) {
          persistedId = currentId;
          return;
        }
        frontmatter[MISSED_TRADE_AGENT_ID_KEY] = tradeId;
        identityChanged = true;
      }
    );
    if (identityChanged) {
      eventBus.publish('missed-trade:changed', {
        action: 'updated',
        filePath: file.path,
        timestamp: Date.now(),
      });
    }
    return persistedId;
  }
}
