

import { App, TFile, normalizePath } from 'obsidian';
import {
  CustomDataService,
  CustomDataServiceConfig,
} from '../base/CustomDataService';
import { Setup, SetupData, SetupFilter, SetupMetrics } from './types';
import { validateSetupData, validateSetupId } from './validation';
import { SetupMetricsCalculator } from './metrics';
import { TradeService } from '../trade/TradeService';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import {
  readFileContentForMutation,
  replaceFileContent,
} from '../../utils/fileMutation';


export class SetupService extends CustomDataService {
  private readonly SETUPS_FOLDER = 'setups';
  private metricsCalculator: SetupMetricsCalculator;

  constructor(
    app: App,
    private tradeService: TradeService,
    config: CustomDataServiceConfig = {}
  ) {
    super(app, {
      folder: 'setups',
      extension: '.md',
      cacheTTL: 5 * 60 * 1000, 
      persistCache: true,
      namespace: config.namespace || 'setup',
    });
    this.metricsCalculator = new SetupMetricsCalculator(tradeService);
  }

  
  public async getSetupMetrics(id: string): Promise<SetupMetrics> {
    validateSetupId(id);

    return this.query(
      async () => this.metricsCalculator.calculateMetrics(id),
      `metrics:${id}`,
      { offlineCapable: true }
    );
  }

  
  public async getAllSetupMetrics(
    filter?: SetupFilter
  ): Promise<Map<string, SetupMetrics>> {
    const cacheKey = `metrics:all${filter ? `:${JSON.stringify(filter)}` : ''}`;

    return this.query(
      async () => {
        const files = await this.getSetupFiles();
        const filtered = await this.filterSetupFiles(files, filter);
        const metricEntries = await Promise.all(
          filtered.map(async (file) => {
            try {
              const content = await this.app.vault.read(file);
              const setup = await this.parseSetupContent(content);
              const setupMetrics =
                await this.metricsCalculator.calculateMetrics(setup.id);
              return [setup.id, setupMetrics] as const;
            } catch (_error) {
              console.warn(
                `Failed to calculate metrics for setup: ${file.path}`
              );
              return null;
            }
          })
        );

        const metrics = new Map<string, SetupMetrics>();
        metricEntries.forEach((entry) => {
          if (entry) {
            metrics.set(entry[0], entry[1]);
          }
        });

        return metrics;
      },
      cacheKey,
      { offlineCapable: true }
    );
  }

  
  public async createSetup(data: SetupData): Promise<string> {
    const errors = validateSetupData(data);
    if (errors.length) {
      throw new Error(
        `Invalid setup data: ${errors.map((e) => e.message).join(', ')}`
      );
    }

    const setupId = this.generateSetupId(data.name);
    const filePath = this.getSetupFilePath(setupId);
    const content = this.generateSetupContent({
      ...data,
      id: setupId,
      status: 'active',
      version: 1,
      createdAt: this.formatDateTimeForDisplay(new Date()),
      updatedAt: this.formatDateTimeForDisplay(new Date()),
      color: data.color || '#808080',
      icon: data.icon || 'trading_setup',
      order: data.order || 0,
    });

    await this.app.vault.create(filePath, content);
    return filePath;
  }

  
  public async updateSetup(
    id: string,
    data: Partial<SetupData>
  ): Promise<void> {
    validateSetupId(id);

    
    
    if (Object.keys(data).length > 0) {
      
      const fieldsToValidate: string[] = [];

      if ('name' in data) fieldsToValidate.push('name');
      if ('description' in data) fieldsToValidate.push('description');
      if ('color' in data) fieldsToValidate.push('color');
      if ('order' in data) fieldsToValidate.push('order');

      const errors = validateSetupData(data as SetupData).filter((error) =>
        fieldsToValidate.includes(error.field)
      );

      if (errors.length) {
        throw new Error(
          `Invalid setup data: ${errors.map((e) => e.message).join(', ')}`
        );
      }
    }

    const filePath = this.getSetupFilePath(id);
    const file = this.app.vault.getAbstractFileByPath(filePath);

    if (!(file instanceof TFile)) {
      throw new Error(`Setup not found: ${id}`);
    }

    const currentContent = await readFileContentForMutation(this.app, file);
    const setup = await this.parseSetupContent(currentContent);

    const updatedSetup: Setup = {
      ...setup,
      ...data,
      version: setup.version + 1,
      updatedAt: this.formatDateTimeForDisplay(new Date()),
    };

    const content = this.generateSetupContent(updatedSetup);
    await replaceFileContent(this.app, file, content);

    await Promise.all([
      forceMetadataCacheRefresh(this.app, file),
      this.clearCache(),
    ]);
  }

  
  public async archiveSetup(id: string): Promise<void> {
    await this.updateSetup(id, { status: 'archived' });
  }

  
  public async getSetups(filter?: SetupFilter): Promise<TFile[]> {
    const cacheKey = `setups:${JSON.stringify(filter || {})}`;

    return this.query(
      async () => {
        const files = await this.getSetupFiles();
        return this.filterSetupFiles(files, filter);
      },
      cacheKey,
      { offlineCapable: true }
    );
  }

  
  private async getSetupFiles(): Promise<TFile[]> {
    return this.getFiles();
  }

  
  private getSetupFilePath(id: string): string {
    return normalizePath(`${this.SETUPS_FOLDER}/${id}.md`);
  }

  
  private generateSetupId(name: string): string {
    return `setup-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  }

  
  private formatDateTimeForDisplay(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  
  private generateSetupContent(setup: Setup): string {
    return [
      '---',
      'type: setup',
      `id: ${setup.id}`,
      `name: ${setup.name}`,
      `description: ${setup.description}`,
      `status: ${setup.status}`,
      `color: ${setup.color}`,
      `icon: ${setup.icon}`,
      `version: ${setup.version}`,
      `createdAt: ${setup.createdAt}`,
      `updatedAt: ${setup.updatedAt}`,
      `order: ${setup.order}`,
      '---',
      '',
      '## Trading Rules',
      '',
      setup.rules || 'No rules defined.',
    ].join('\n');
  }

  
  private async parseSetupContent(content: string): Promise<Setup> {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) throw new Error('Invalid setup file format');

    const frontmatter = match[1].split('\n').reduce(
      (acc, line) => {
        const [key, ...values] = line.split(':').map((s) => s.trim());
        if (key && values.length) acc[key] = values.join(':');
        return acc;
      },
      {} as Record<string, string>
    );

    return {
      id: frontmatter.id,
      name: frontmatter.name,
      description: frontmatter.description,
      rules: content.split('## Trading Rules')[1]?.trim() || '',
      status: frontmatter.status as 'active' | 'archived',
      color: frontmatter.color,
      icon: frontmatter.icon,
      version: parseInt(frontmatter.version, 10),
      createdAt: frontmatter.createdAt,
      updatedAt: frontmatter.updatedAt,
      order: parseInt(frontmatter.order, 10),
    };
  }

  
  private async filterSetupFiles(
    files: TFile[],
    filter?: SetupFilter
  ): Promise<TFile[]> {
    if (!filter) return files;

    const filtered = await Promise.all(
      files.map(async (file) => {
        try {
          const content = await this.app.vault.read(file);
          const setup = await this.parseSetupContent(content);

          if (filter.status && setup.status !== filter.status) return null;
          if (filter.search && !this.matchesSearch(setup, filter.search))
            return null;

          return file;
        } catch (_error) {
          console.warn(`Invalid setup file: ${file.path}`);
          return null;
        }
      })
    );

    return filtered.filter((file): file is TFile => file !== null);
  }

  
  private matchesSearch(setup: Setup, search: string): boolean {
    const searchLower = search.toLowerCase();
    return (
      setup.name.toLowerCase().includes(searchLower) ||
      setup.description.toLowerCase().includes(searchLower) ||
      setup.rules.toLowerCase().includes(searchLower)
    );
  }
}
