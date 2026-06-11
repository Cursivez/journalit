import type { TradeCommitReceipt, TradeId, TradeRef } from './tradeCoreTypes';

interface TradeReadModelEntry extends TradeRef {
  revision: number;
  schemaVersion: number;
  committedAt: number;
}

export class TradeReadModel {
  private readonly entries = new Map<TradeId, TradeReadModelEntry>();
  private readonly tradeIdByPath = new Map<string, TradeId>();
  private forceFreshUntil = 0;

  public getNextRevision(
    tradeId: TradeId,
    fallbackRevision: number = 0
  ): number {
    const knownRevision = this.entries.get(tradeId)?.revision ?? 0;
    return Math.max(knownRevision, fallbackRevision) + 1;
  }

  public recordCommit(receipt: TradeCommitReceipt): void {
    const previousEntry = this.entries.get(receipt.tradeId);
    const aliases = new Set(previousEntry?.aliases ?? []);

    aliases.add(receipt.path);
    if (receipt.previousPath) {
      aliases.add(receipt.previousPath);
      this.tradeIdByPath.delete(receipt.previousPath);
    }

    this.entries.set(receipt.tradeId, {
      tradeId: receipt.tradeId,
      path: receipt.path,
      aliases: Array.from(aliases),
      revision: receipt.revision,
      schemaVersion: receipt.schemaVersion,
      committedAt: receipt.committedAt,
    });

    this.tradeIdByPath.set(receipt.path, receipt.tradeId);

    this.forceFreshUntil = Math.max(
      this.forceFreshUntil,
      receipt.committedAt + 5000
    );
  }

  public forgetPath(path: string): void {
    const tradeId = this.tradeIdByPath.get(path);
    if (!tradeId) {
      return;
    }

    const entry = this.entries.get(tradeId);
    if (!entry) {
      this.tradeIdByPath.delete(path);
      return;
    }

    entry.aliases = entry.aliases.filter((alias) => alias !== path);
    this.tradeIdByPath.delete(path);

    if (entry.path === path) {
      this.entries.delete(tradeId);
    }
  }

  public getTradeIdForPath(path: string): TradeId | null {
    return this.tradeIdByPath.get(path) ?? null;
  }

  public getKnownPaths(): string[] {
    return Array.from(this.entries.values(), (entry) => entry.path).filter(
      (path) => path.length > 0
    );
  }

  public getEntryForPath(path: string): {
    tradeId: TradeId;
    revision: number;
    schemaVersion: number;
  } | null {
    const tradeId = this.tradeIdByPath.get(path);
    if (!tradeId) {
      return null;
    }

    const entry = this.entries.get(tradeId);
    if (!entry) {
      return null;
    }

    return {
      tradeId: entry.tradeId,
      revision: entry.revision,
      schemaVersion: entry.schemaVersion,
    };
  }

  public shouldBypassIndexes(): boolean {
    return Date.now() < this.forceFreshUntil;
  }
}
