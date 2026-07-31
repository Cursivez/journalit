import { App, parseYaml, TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import type { GeneratedGraphWriteCoordinator } from './GeneratedGraphWriteCoordinator';
import { errorMessage, isRecord, normalizeFrontmatter } from './graphTypes';

export class GraphFrontmatterReader {
  private readonly app: App;

  constructor(
    plugin: JournalitPlugin,
    private readonly generatedWrites: GeneratedGraphWriteCoordinator
  ) {
    this.app = plugin.app;
  }

  public async read(file: TFile): Promise<Record<string, unknown> | undefined> {
    const generated = this.generatedWrites.getProjectedFrontmatter(file.path);
    if (generated) return generated;

    const cached = this.app.metadataCache.getFileCache(file)?.frontmatter;
    if (isRecord(cached)) return normalizeFrontmatter(cached);

    const content = await this.app.vault.cachedRead(file);
    return this.parse(file, content);
  }

  public async readFromDisk(
    file: TFile
  ): Promise<Record<string, unknown> | undefined> {
    const content = await this.app.vault.read(file);
    return this.parse(file, content);
  }

  private parse(
    file: TFile,
    content: string
  ): Record<string, unknown> | undefined {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return undefined;
    try {
      const parsed: unknown = parseYaml(match[1]);
      return isRecord(parsed) ? normalizeFrontmatter(parsed) : undefined;
    } catch (error) {
      console.warn(
        `[GraphLinkService] Skipping malformed frontmatter in ${file.path}:`,
        error
      );
      throw new Error(`Malformed frontmatter: ${errorMessage(error)}`);
    }
  }
}
