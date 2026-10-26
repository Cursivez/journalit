import { App, TFile, parseYaml } from 'obsidian';
import { getTradeIdValue } from '../../../utils/tradeIdentity';
import { MANAGED_PROPERTIES } from '../../graph/graphTypes';
import type {
  TradeIdentitySnapshot,
  TradeMutationRevisionSnapshot,
} from './tradeCoreTypes';

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value)
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}


function editableContent(content: string): string {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return content;
  let frontmatter: unknown;
  try {
    frontmatter = parseYaml(match[1]);
  } catch {
    return content;
  }
  if (
    frontmatter === null ||
    typeof frontmatter !== 'object' ||
    Array.isArray(frontmatter)
  ) {
    return content;
  }
  const managed = new Set<string>(MANAGED_PROPERTIES);
  const kept = Object.entries(frontmatter).filter(([key]) => !managed.has(key));
  return `${JSON.stringify(kept)}\n${content.slice(match[0].length)}`;
}

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

  public async readMutationRevision(
    filePath: string
  ): Promise<TradeMutationRevisionSnapshot | null> {
    const content = await this.readNote(filePath);
    if (content === null) return null;
    return {
      identity: this.extractIdentity(this.parseFrontmatter(content)),
      contentRevision: await sha256Hex(content),
    };
  }

  
  public async readEditRevision(
    filePath: string
  ): Promise<{ contentRevision: string; editRevision: string } | null> {
    const content = await this.readNote(filePath);
    if (content === null) return null;
    return {
      contentRevision: await sha256Hex(content),
      editRevision: await sha256Hex(editableContent(content)),
    };
  }

  
  private async readNote(filePath: string): Promise<string | null> {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) return null;
    return this.app.vault.read(file);
  }

  public async readAssignedTags(filePath: string): Promise<string[]> {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) return [];

    const content = await this.app.vault.read(file);
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return [];

    const parsed: unknown = parseYaml(match[1]);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error(`Invalid trade frontmatter in ${filePath}`);
    }
    return this.extractAssignedTags(Object.fromEntries(Object.entries(parsed)));
  }

  private extractAssignedTags(frontmatter: Record<string, unknown>): string[] {
    const values = Array.isArray(frontmatter.tags)
      ? frontmatter.tags.filter(
          (entry): entry is string => typeof entry === 'string'
        )
      : [];
    return Array.from(
      new Map(
        values.flatMap((value) => {
          const tag = value.trim();
          return tag ? [[tag.toLowerCase(), tag] as const] : [];
        })
      ).values()
    );
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
