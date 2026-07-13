import { App, TFile } from 'obsidian';
import { getTradeIdValue } from '../../../utils/tradeIdentity';
import type { TradeIdentitySnapshot } from './tradeCoreTypes';

export class ObsidianTradeNoteStore {
  constructor(private readonly app: App) {}

  public async readIdentity(
    filePath: string
  ): Promise<TradeIdentitySnapshot | null> {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) {
      return null;
    }

    const tradeFile = file;
    const cached = this.app.metadataCache.getFileCache(tradeFile)?.frontmatter;
    const cachedIdentity = cached ? this.extractIdentity(cached) : null;

    try {
      const content = await this.app.vault.read(tradeFile);
      const diskIdentity = this.extractIdentity(this.parseFrontmatter(content));

      if (
        diskIdentity.tradeId ||
        diskIdentity.schemaVersion !== undefined ||
        diskIdentity.tradeRevision !== undefined
      ) {
        return diskIdentity;
      }
    } catch {
      // intentional
    }

    return cachedIdentity;
  }

  private extractIdentity(
    frontmatter: Record<string, unknown>
  ): TradeIdentitySnapshot {
    const tradeId = getTradeIdValue(frontmatter.tradeId);
    const schemaVersion = this.toPositiveInteger(frontmatter.schemaVersion);
    const tradeRevision = this.toPositiveInteger(frontmatter.tradeRevision);

    return {
      tradeId,
      schemaVersion: schemaVersion ?? undefined,
      tradeRevision: tradeRevision ?? undefined,
    };
  }

  private parseFrontmatter(content: string): Record<string, unknown> {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) {
      return {};
    }

    const result: Record<string, unknown> = {};
    for (const line of match[1].split(/\r?\n/)) {
      const separatorIndex = line.search(/:/);
      if (separatorIndex <= 0) {
        continue;
      }

      const key = line.slice(0, separatorIndex).trim();
      const rawValue = line.slice(separatorIndex + 1).trim();
      result[key] = this.normalizeYamlScalar(rawValue);
    }

    return result;
  }

  private normalizeYamlScalar(value: string): string {
    const withoutComment = this.stripYamlComment(value).trim();

    if (
      (withoutComment.startsWith('"') && withoutComment.endsWith('"')) ||
      (withoutComment.startsWith("'") && withoutComment.endsWith("'"))
    ) {
      return withoutComment.slice(1, -1);
    }

    return withoutComment;
  }

  private stripYamlComment(value: string): string {
    let inSingleQuote = false;
    let inDoubleQuote = false;

    for (let i = 0; i < value.length; i += 1) {
      const char = value[i];
      if (char === "'" && !inDoubleQuote) {
        inSingleQuote = !inSingleQuote;
        continue;
      }
      if (char === '"' && !inSingleQuote) {
        inDoubleQuote = !inDoubleQuote;
        continue;
      }
      if (char === '#' && !inSingleQuote && !inDoubleQuote) {
        return value.slice(0, i);
      }
    }

    return value;
  }

  private toPositiveInteger(value: unknown): number | null {
    if (typeof value === 'number') {
      return Number.isInteger(value) && value > 0 ? value : null;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
    }

    return null;
  }
}
