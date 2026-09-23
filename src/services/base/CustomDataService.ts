

import { App, TFile, TAbstractFile, TFolder } from 'obsidian';
import { IndexManager, IndexConfig, IndexEntry } from './IndexManager';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import type JournalitPlugin from '../../main';
import {
  getJournalitCachePath,
  isPathWithinDirectory,
} from './pluginStoragePaths';
import { CoalescedWriter } from './CoalescedWriter';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function ensureRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function materializeIndexEntryData(data: unknown, entry: IndexEntry): unknown {
  if (!isRecord(data)) {
    return data;
  }

  return {
    ...data,
    path: entry.file.path,
  };
}


export interface CustomDataServiceConfig {
  
  folder?: string;
  
  extension?: string;
  
  cacheTTL?: number;
  
  persistCache?: boolean;
  
  namespace?: string;
  
  enableIndexing?: boolean;
  
  indexes?: IndexConfig[];
}


interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function isCacheEntry(value: unknown): value is CacheEntry<unknown> {
  return (
    isRecord(value) && 'data' in value && typeof value.timestamp === 'number'
  );
}

function getErrorCode(error: unknown): string | undefined {
  return isRecord(error) && typeof error.code === 'string'
    ? error.code
    : undefined;
}


interface QueryOptions {
  useCache?: boolean;
  cacheTTL?: number;
  offlineCapable?: boolean;
  
  useIndexes?: boolean;
}


export class CustomDataService {
  
  private static readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000; 
  private static readonly PERSISTENT_CACHE_SAVE_DELAY_MS = 1000;
  private static readonly PERSISTENT_CACHE_MAX_SAVE_DELAY_MS = 30_000;

  
  private cache: Map<string, CacheEntry<unknown>>;
  private isCacheInvalidated: boolean;
  
  private cacheGeneration: number = 0;
  private persistentCacheWriter: CoalescedWriter;
  private config: Required<
    CustomDataServiceConfig & {
      enableIndexing: boolean;
      indexes: IndexConfig[];
    }
  >;

  
  private pendingQueries: Map<string, Promise<unknown>> = new Map();

  
  private boundHandleFileChange: (
    file: TAbstractFile,
    oldPath?: string
  ) => Promise<void>;

  
  protected indexManager: IndexManager | null = null;

  
  private static sharedIndexManager: IndexManager | null = null;

  
  protected plugin: JournalitPlugin | null = null;

  
  public static async unloadSharedIndexManager(): Promise<void> {
    if (CustomDataService.sharedIndexManager) {
      await CustomDataService.sharedIndexManager.unload();
      CustomDataService.sharedIndexManager = null;
    }
  }

  
  constructor(
    protected app: App,
    config: CustomDataServiceConfig = {}
  ) {
    
    this.config = {
      folder: config.folder || '',
      extension: config.extension || '.md',
      cacheTTL: config.cacheTTL || CustomDataService.DEFAULT_CACHE_TTL,
      persistCache:
        config.persistCache !== undefined ? config.persistCache : true,
      namespace: config.namespace || 'default',
      enableIndexing:
        config.enableIndexing !== undefined ? config.enableIndexing : true,
      indexes: config.indexes || [],
    };

    this.cache = new Map();
    this.isCacheInvalidated = false;
    this.persistentCacheWriter = new CoalescedWriter({
      delayMs: CustomDataService.PERSISTENT_CACHE_SAVE_DELAY_MS,
      maxDelayMs: CustomDataService.PERSISTENT_CACHE_MAX_SAVE_DELAY_MS,
      writeSnapshot: () => this.writePersistentCacheSnapshot(),
      onScheduledWriteError: (error) => {
        console.warn(
          `Failed to save persistent cache for namespace ${this.config.namespace}:`,
          error instanceof Error ? error.message : 'Unknown error'
        );
      },
    });

    
    this.boundHandleFileChange = (file: TAbstractFile, oldPath?: string) =>
      this.handleFileChange(file, oldPath);

    
    if (this.config.enableIndexing) {
      this.setupIndexing();
    }

    
    void this.initializeService();
  }

  
  public setPlugin(plugin: JournalitPlugin): void {
    this.plugin = plugin;

    
    this.plugin.registerEvent(
      this.app.vault.on('create', this.boundHandleFileChange)
    );
    this.plugin.registerEvent(
      this.app.vault.on('modify', this.boundHandleFileChange)
    );
    this.plugin.registerEvent(
      this.app.vault.on('delete', this.boundHandleFileChange)
    );
    this.plugin.registerEvent(
      this.app.vault.on('rename', this.boundHandleFileChange)
    );

    
    if (this.indexManager) {
      this.indexManager.setPlugin(plugin);
    }
  }

  
  private setupIndexing(): void {
    
    if (CustomDataService.sharedIndexManager) {
      this.indexManager = CustomDataService.sharedIndexManager;
    } else {
      
      this.indexManager = new IndexManager(this.app, async (file: TFile) => {
        try {
          return await this.readFrontmatter(file);
        } catch (error) {
          console.error(`Error extracting data from ${file.path}:`, error);
          return null;
        }
      });

      
      if (this.plugin) {
        this.indexManager.setPlugin(this.plugin);
      }

      
      CustomDataService.sharedIndexManager = this.indexManager;

      
      void this.indexManager.initialize();
    }

    
    if (this.config.indexes.length > 0) {
      for (const indexConfig of this.config.indexes) {
        this.indexManager.registerIndex(indexConfig);
      }
    }
  }

  
  private async initializeService(): Promise<void> {
    
    await this.loadPersistentCache();

    
  }

  
  private getNamespacedKey(key: string): string {
    return `${this.config.namespace}:${key}`;
  }

  
  protected setMonitoredFolder(folder: string): void {
    this.config.folder = folder;
  }

  
  protected isPathInMonitoredFolder(path: string): boolean {
    return (
      !this.config.folder || isPathWithinDirectory(path, this.config.folder)
    );
  }

  
  protected async query<T>(
    queryFn: () => Promise<T>,
    cacheKey: string,
    options: QueryOptions = {},
    indexQueryOptions?: {
      indexName: string;
      filters?: Record<string, unknown>;
      sort?: { field: string; direction: 'asc' | 'desc' };
      limit?: number;
      offset?: number;
    }
  ): Promise<T> {
    const {
      useCache = true,
      cacheTTL = this.config.cacheTTL,
      offlineCapable = true,
      useIndexes = true,
    } = options;

    
    const namespacedKey = this.getNamespacedKey(cacheKey);

    try {
      
      if (useCache && !this.isCacheInvalidated) {
        const cached = this.getCached<T>(namespacedKey, cacheTTL);
        if (cached !== null) {
          return cached;
        }
      }

      
      
      const pendingQuery = this.pendingQueries.get(namespacedKey);
      if (pendingQuery) {
        
        
        
        return pendingQuery as Promise<T>;
      }

      const queryGeneration = this.cacheGeneration;

      
      const executeQuery = async (): Promise<T> => {
        
        if (useIndexes && this.indexManager && indexQueryOptions) {
          try {
            const indexedResults = this.indexManager.queryIndex(
              indexQueryOptions.indexName,
              indexQueryOptions.filters || {},
              {
                sort: indexQueryOptions.sort,
                limit: indexQueryOptions.limit,
                offset: indexQueryOptions.offset,
              }
            );

            if (indexedResults.length > 0) {
              
              
              const entriesWithData = indexedResults.filter(
                (entry) => entry.data !== null && entry.data !== undefined
              );

              

              let result: unknown;
              if (entriesWithData.length === indexedResults.length) {
                
                result = indexedResults.flatMap((entry) =>
                  entry.data
                    ? [materializeIndexEntryData(entry.data, entry)]
                    : []
                );
              } else {
                
                const loadedData = await Promise.all(
                  indexedResults.map(async (entry) => {
                    try {
                      
                      
                      const fileExists = this.app.vault.getAbstractFileByPath(
                        entry.file.path
                      );
                      if (!fileExists) {
                        return null; 
                      }
                      const frontmatter = await this.readFrontmatter(
                        entry.file
                      );
                      return materializeIndexEntryData(frontmatter, entry);
                    } catch (error) {
                      
                      if (
                        !(error instanceof Error) ||
                        !error.message.includes('ENOENT')
                      ) {
                        console.error(
                          `Error loading data from file ${entry.file.path}:`,
                          error
                        );
                      }
                      return null;
                    }
                  })
                );
                result = loadedData.filter(Boolean);
              }

              
              if (useCache && queryGeneration === this.cacheGeneration) {
                this.setCache(namespacedKey, result);
                this.isCacheInvalidated = false;
              }

              
              
              
              return result as T;
            }
          } catch (indexError) {
            console.warn(
              `Error using index for query ${cacheKey}:`,
              indexError
            );
            
          }
        }

        
        const result = await queryFn();

        
        if (useCache && queryGeneration === this.cacheGeneration) {
          this.setCache(namespacedKey, result);
          
          this.isCacheInvalidated = false;
        }

        return result;
      };

      
      const queryPromise = executeQuery();
      this.pendingQueries.set(namespacedKey, queryPromise);

      try {
        return await queryPromise;
      } finally {
        if (this.pendingQueries.get(namespacedKey) === queryPromise) {
          this.pendingQueries.delete(namespacedKey);
        }
      }
    } catch (error) {
      
      if (offlineCapable && useCache) {
        const offlineCache = this.getCached<T>(namespacedKey, Infinity); 
        if (offlineCache !== null) {
          return offlineCache;
        }
      }

      throw this.handleError(error);
    }
  }

  
  private getCached<T>(key: string, ttl: number): T | null {
    const cached = this.cache.get(key);
    if (!isCacheEntry(cached)) return null;

    const { data, timestamp } = cached;
    const now = Date.now();

    
    if (now - timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }

    
    
    return data as T;
  }

  
  private setCache<T>(key: string, data: T): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };

    this.cache.set(key, entry);

    
    if (this.config.persistCache) {
      this.persistentCacheWriter.markDirty();
    }
  }

  
  private getCacheFilePath(): string {
    return `${getJournalitCachePath(this.app)}/${this.config.namespace}-cache.json`;
  }

  
  private async loadPersistentCache(): Promise<void> {
    try {
      const cachePath = this.getCacheFilePath();
      const exists = await this.app.vault.adapter.exists(cachePath);

      if (exists) {
        const content = await this.app.vault.adapter.read(cachePath);
        try {
          const cached: unknown = JSON.parse(content);
          if (!isRecord(cached)) return;
          Object.entries(cached).forEach(([key, value]) => {
            if (isCacheEntry(value)) {
              this.cache.set(key, value);
            }
          });
        } catch (parseError) {
          console.warn(
            `Failed to parse cache data for namespace ${this.config.namespace}:`,
            parseError instanceof Error ? parseError.message : 'Invalid JSON'
          );
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.warn(
        `Failed to load persistent cache for namespace ${this.config.namespace}:`,
        errorMessage
      );
    }
  }

  private serializePersistentCache(): string {
    const namespacedEntries = Array.from(this.cache.entries()).filter(([key]) =>
      key.startsWith(`${this.config.namespace}:`)
    );
    return JSON.stringify(Object.fromEntries(namespacedEntries));
  }

  private async writePersistentCacheSnapshot(): Promise<void> {
    const cachePath = this.getCacheFilePath();
    const serializedCache = this.serializePersistentCache();
    await this.app.vault.adapter.mkdir(getJournalitCachePath(this.app));
    await this.app.vault.adapter.write(cachePath, serializedCache);
  }

  
  public async flushPersistentCache(): Promise<void> {
    if (!this.config.persistCache) return;
    await this.persistentCacheWriter.flush();
  }

  
  private async handleFileChange(
    file: TAbstractFile,
    oldPath?: string
  ): Promise<void> {
    
    if (!('path' in file)) return;

    
    const relevantPaths = [file.path, oldPath].filter((path): path is string =>
      Boolean(path)
    );
    if (
      relevantPaths.every((path) =>
        isPathWithinDirectory(path, getJournalitCachePath(this.app))
      )
    )
      return;

    
    const isFolder = file instanceof TFolder;
    if (
      this.config.folder &&
      !relevantPaths.some(
        (path) =>
          isPathWithinDirectory(path, this.config.folder) ||
          (isFolder && isPathWithinDirectory(this.config.folder, path))
      )
    )
      return;
    if (
      !isFolder &&
      this.config.extension &&
      !relevantPaths.some((path) => path.endsWith(this.config.extension))
    )
      return;

    
    if (isFolder && this.config.folder) {
      await this.clearCache();
      return;
    }

    const cachePrefixes = new Set<string>();
    for (const path of relevantPaths) {
      if (/(?:^|\/)trades(?:\/|$)/.test(path)) {
        cachePrefixes.add('trade:');
      }
      if (/(?:^|\/)Accounts(?:\/|$)/.test(path)) {
        cachePrefixes.add('account:');
      }
      if (/(?:^|\/)DRC(?:\/|$)/.test(path)) {
        cachePrefixes.add('drc:');
      }
      if (/(?:^|\/)Weekly(?:\/|$)/.test(path)) {
        cachePrefixes.add('weekly:');
      }
      if (/(?:^|\/)Setups(?:\/|$)/.test(path)) {
        cachePrefixes.add('setup:');
      }
    }

    const namespace = this.config.namespace;
    await Promise.all(
      Array.from(cachePrefixes, async (cachePrefix) => {
        if (cachePrefix === 'setup:') {
          if (namespace === 'setup') {
            await this.clearCache();
          }
          return;
        }

        
        const isAccountPageWatchingTrades =
          namespace === 'accountPage' && cachePrefix === 'trade:';

        
        if (
          namespace === 'default' ||
          cachePrefix.startsWith(namespace) ||
          namespace === cachePrefix.replace(':', '') ||
          isAccountPageWatchingTrades
        ) {
          await this.clearCacheWithPrefix(cachePrefix);

          
          if (isAccountPageWatchingTrades) {
            await Promise.all([
              this.clearCacheByPattern('accountPage:', false),
              this.clearCacheByPattern('accountTrades:', false),
              this.clearCacheByPattern('allEnhancedAccounts', false),
            ]);
          }
        }
      })
    );

    if (cachePrefixes.size === 0) {
      
      
      if (
        namespace === 'default' ||
        (oldPath !== undefined && Boolean(this.config.folder))
      ) {
        await this.clearCache();
      }
    }
  }

  
  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('An unknown error occurred');
  }

  
  public async clearCache(): Promise<void> {
    
    this.cacheGeneration += 1;
    this.isCacheInvalidated = true;

    
    const namespacedPrefix = `${this.config.namespace}:`;
    for (const key of this.pendingQueries.keys()) {
      if (key.startsWith(namespacedPrefix)) {
        this.pendingQueries.delete(key);
      }
    }

    
    for (const key of this.cache.keys()) {
      if (key.startsWith(namespacedPrefix)) {
        this.cache.delete(key);
      }
    }

    
    if (this.config.persistCache) {
      this.persistentCacheWriter.markDirty();
    }
  }

  
  public async clearCacheKey(key: string): Promise<void> {
    
    const namespacedKey = this.getNamespacedKey(key);
    this.cacheGeneration += 1;
    this.pendingQueries.delete(namespacedKey);

    
    const deleted = this.cache.delete(namespacedKey);

    if (deleted) {
      
      if (this.config.persistCache) {
        this.persistentCacheWriter.markDirty();
      }
    }
  }

  
  public async clearCacheWithPrefix(prefix: string): Promise<void> {
    
    const namespacedPrefix = this.getNamespacedKey(prefix);
    this.cacheGeneration += 1;

    for (const key of this.pendingQueries.keys()) {
      if (key.startsWith(namespacedPrefix)) {
        this.pendingQueries.delete(key);
      }
    }

    let keysDeleted = false;

    
    for (const key of this.cache.keys()) {
      if (key.startsWith(namespacedPrefix)) {
        this.cache.delete(key);
        keysDeleted = true;
      }
    }

    if (keysDeleted) {
      
      if (this.config.persistCache) {
        this.persistentCacheWriter.markDirty();
      }
    }
  }

  
  public async clearCacheByPattern(
    pattern: string,
    useNamespacing: boolean = true
  ): Promise<void> {
    
    const searchPattern = useNamespacing
      ? this.getNamespacedKey(pattern)
      : pattern;
    this.cacheGeneration += 1;

    for (const key of this.pendingQueries.keys()) {
      if (key.startsWith(searchPattern)) {
        this.pendingQueries.delete(key);
      }
    }

    let keysDeleted = false;

    
    for (const key of this.cache.keys()) {
      if (key.startsWith(searchPattern)) {
        this.cache.delete(key);
        keysDeleted = true;
      }
    }

    if (keysDeleted) {
      
      if (this.config.persistCache) {
        this.persistentCacheWriter.markDirty();
      }
    }
  }

  
  public invalidateCache(): void {
    this.cacheGeneration += 1;
    this.isCacheInvalidated = true;
  }

  
  protected getFiles(): TFile[] {
    const files = this.app.vault.getFiles();
    return files.filter((file) => {
      if (this.config.folder && !file.path.startsWith(this.config.folder))
        return false;
      if (this.config.extension && !file.path.endsWith(this.config.extension))
        return false;
      return true;
    });
  }

  
  public registerIndex(config: IndexConfig): void {
    if (!this.indexManager) {
      console.warn(
        'Index manager not initialized. Enable indexing in service config.'
      );
      return;
    }

    this.indexManager.registerIndex(config);
  }

  
  protected queryIndex(
    indexName: string,
    filters: Record<string, unknown> = {},
    options: {
      sort?: { field: string; direction: 'asc' | 'desc' };
      limit?: number;
      offset?: number;
    } = {}
  ): IndexEntry[] {
    if (!this.indexManager) {
      return [];
    }

    return this.indexManager.queryIndex(indexName, filters, options);
  }

  
  protected getUniqueIndexValues(indexName: string, field: string): unknown[] {
    if (!this.indexManager) {
      return [];
    }

    return this.indexManager.getUniqueValues(indexName, field);
  }

  
  public isIndexingEnabled(): boolean {
    return this.config.enableIndexing && this.indexManager !== null;
  }

  public get cacheNamespace(): string {
    return this.config.namespace;
  }

  
  public async cleanup(): Promise<void> {
    

    
    
    this.cacheGeneration += 1;
    this.pendingQueries.clear();

    try {
      await this.persistentCacheWriter.dispose();
    } catch (error) {
      console.warn(
        `Failed to flush persistent cache for namespace ${this.config.namespace} during cleanup:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }

    
    if (this.indexManager) {
      await this.indexManager.unload();
      this.indexManager = null;
    }
  }

  
  protected async readFrontmatter(
    file: TFile
  ): Promise<Record<string, unknown>> {
    try {
      
      
      const cache = this.app.metadataCache.getFileCache(file);

      if (cache?.frontmatter) {
        
        const cloned: unknown = structuredClone(cache.frontmatter);
        return isRecord(cloned) ? cloned : {};
      }

      
      const content = await this.app.vault.read(file);
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

      if (!frontmatterMatch) return {};

      try {
        
        return this.parseYamlFrontmatter(frontmatterMatch[1]);
      } catch (parseError) {
        console.warn(
          `Failed to parse frontmatter with advanced parser for ${file.path}:`,
          parseError
        );
        
        return this.simpleYamlParse(frontmatterMatch[1]);
      }
    } catch (error) {
      const isMissingFileError =
        (error instanceof Error && error.message.includes('ENOENT')) ||
        getErrorCode(error) === 'ENOENT';

      if (!isMissingFileError) {
        console.error(`Failed to parse frontmatter for ${file.path}:`, error);
      }
      return {};
    }
  }

  
  private parseYamlFrontmatter(yamlString: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    let currentKey: string | null = null;
    let inSequence = false;
    let sequenceItems: unknown[] = [];
    let currentSequenceItem: Record<string, unknown> | null = null;
    let indentLevel = 0;

    
    const lines = yamlString.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue; 

      const lineIndent = line.search(/\S|$/);

      
      if (lineIndent === 0 && this.hasYamlSeparator(line)) {
        
        if (inSequence && currentKey) {
          result[currentKey] = sequenceItems;
          inSequence = false;
          sequenceItems = [];
        }

        const [key, value] = this.parseKeyValue(line);
        currentKey = key;

        
        if (value === '') {
          
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            const nextLineIndent = nextLine.search(/\S|$/);

            
            if (
              nextLineIndent > lineIndent ||
              nextLine.trim().startsWith('-')
            ) {
              
              inSequence = false;
            } else {
              
              result[key] = '';
              currentKey = null;
            }
          } else {
            
            result[key] = '';
            currentKey = null;
          }
        } else if (value === '|' || value === '|-') {
          
          let multilineValue = '';
          let baseIndent = -1;

          
          for (let j = i + 1; j < lines.length; j++) {
            const nextLine = lines[j];
            const nextIndent = nextLine.search(/\S|$/);

            
            if (nextIndent === 0 && nextLine.trim() !== '') {
              break;
            }

            
            if (baseIndent === -1 && nextLine.trim() !== '') {
              baseIndent = nextIndent;
            }

            
            if (nextLine.trim() !== '' || multilineValue !== '') {
              if (multilineValue !== '') multilineValue += '\n';
              
              multilineValue += nextLine.substring(baseIndent);
            }

            i = j; 
          }

          result[key] = multilineValue.trimEnd();
          currentKey = null;
        } else if (value.startsWith('[') && value.endsWith(']')) {
          
          result[key] = value
            .slice(1, -1)
            .split(',')
            .flatMap((v) => {
              const trimmed = v.trim();
              return trimmed ? [trimmed] : [];
            });
          currentKey = null;
        } else {
          
          
          if (value === '""' || value === "''") {
            result[key] = '';
          } else {
            result[key] = value;
          }
          currentKey = null;
        }
      }
      
      else if (line.trim().startsWith('-') && currentKey) {
        const dashIndex = line.search(/-/);
        inSequence = true;
        indentLevel = dashIndex;

        
        const afterDash = line.substring(dashIndex + 1).trim();

        if (!afterDash) {
          
          currentSequenceItem = {};
          sequenceItems.push(currentSequenceItem);
        } else if (this.hasYamlSeparator(afterDash)) {
          
          currentSequenceItem = {};
          sequenceItems.push(currentSequenceItem);

          
          const [subKey, subValue] = this.parseKeyValue(afterDash);
          if (currentSequenceItem) {
            currentSequenceItem[subKey] = subValue;
          }
        } else {
          
          sequenceItems.push(afterDash);
          currentSequenceItem = null;
        }
      }
      
      else if (
        currentSequenceItem &&
        this.hasYamlSeparator(line.trim()) &&
        line.search(/\S|$/) > indentLevel
      ) {
        const [subKey, subValue] = this.parseKeyValue(line);
        currentSequenceItem[subKey.trim()] = subValue;
      }
      
      else if (this.hasYamlSeparator(line) && currentKey) {
        
        const [subKey, subValue] = this.parseKeyValue(line);

        
        if (
          typeof result[currentKey] !== 'object' ||
          result[currentKey] === null
        ) {
          result[currentKey] = {};
        }

        
        ensureRecord(result[currentKey])[subKey.trim()] = subValue;
      }
    }

    
    if (inSequence && currentKey) {
      result[currentKey] = sequenceItems;
    }

    return result;
  }

  private findYamlSeparator(line: string): number {
    return line.search(/:/);
  }

  private hasYamlSeparator(line: string): boolean {
    return this.findYamlSeparator(line) !== -1;
  }

  
  private parseKeyValue(line: string): [string, string] {
    const colonIndex = this.findYamlSeparator(line);
    if (colonIndex === -1) return [line.trim(), ''];

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    return [key, value];
  }

  
  private simpleYamlParse(yamlString: string): Record<string, unknown> {
    const parsed: Record<string, unknown> = {};

    yamlString.split('\n').forEach((line) => {
      
      if (!line.trim()) return;

      
      const colonIndex = this.findYamlSeparator(line);
      if (colonIndex === -1) return;

      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      
      if (value.startsWith('[') && value.endsWith(']')) {
        parsed[key] = value
          .slice(1, -1)
          .split(',')
          .flatMap((v) => {
            const trimmed = v.trim();
            return trimmed ? [trimmed] : [];
          });
      }
      
      else if (line.startsWith('  ') && key.startsWith('  ')) {
        
        
        const parentKey = Object.keys(parsed).pop();
        if (parentKey && !Array.isArray(parsed[parentKey])) {
          if (typeof parsed[parentKey] !== 'object') {
            parsed[parentKey] = {};
          }
          ensureRecord(parsed[parentKey])[key.trim()] = value;
        }
      } else {
        parsed[key] = value;
      }
    });

    return parsed;
  }

  
  protected async updateFrontmatter(
    file: TFile,
    data: Record<string, unknown>,
    mutate?: (frontmatter: Record<string, unknown>) => void,
    onCommitted?: () => void
  ): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      const record = ensureRecord(frontmatter);
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined) {
          delete record[key];
          return;
        }

        record[key] = value;
      });
      mutate?.(record);
    });
    onCommitted?.();
    
    await forceMetadataCacheRefresh(this.app, file);
  }
}
