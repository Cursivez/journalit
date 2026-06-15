

import { App, TFile, TAbstractFile } from 'obsidian';
import { scheduleIdle } from '../../utils/deferredExecution';
import type JournalitPlugin from '../../main';
import { eventBus, type Unsubscribe } from '../events';
import { safeString } from '../../utils/safeString';

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

interface SerializedIndexEntry {
  path: string;
  values: Record<string, unknown>;
}

interface SerializedIndex {
  name: string;
  entries: SerializedIndexEntry[];
}

function parseSerializedIndex(value: unknown): SerializedIndex | null {
  const record = asRecord(value);
  if (
    !record ||
    typeof record.name !== 'string' ||
    !Array.isArray(record.entries)
  ) {
    return null;
  }

  const entries = record.entries
    .map((entry) => {
      const entryRecord = asRecord(entry);
      if (!entryRecord || typeof entryRecord.path !== 'string') {
        return null;
      }
      return {
        path: entryRecord.path,
        values: asRecord(entryRecord.values) ?? {},
      };
    })
    .filter((entry): entry is SerializedIndexEntry => entry !== null);

  return { name: record.name, entries };
}


export interface IndexConfig {
  
  name: string;
  
  fields: string[];
  
  includeNested?: boolean;
  
  valueExtractor?: (data: unknown, field: string) => unknown;
  
  fileFilter?: (file: TFile) => boolean;
}


export interface IndexEntry {
  
  data: unknown;
  
  file: TFile;
  
  values: Record<string, unknown>;
}


export class IndexManager {
  
  private indexes: Map<string, IndexEntry[]> = new Map();
  
  private indexConfigs: Map<string, IndexConfig> = new Map();
  
  private filePathMap: Map<string, Map<string, number>> = new Map();
  
  private buildingIndexes: Set<string> = new Set();
  
  private readyIndexes: Set<string> = new Set();
  
  private processedFiles: Set<string> = new Set();
  
  private boundHandleFileChange: (file: TAbstractFile) => void;
  
  private app: App;
  
  private isDirty: boolean = false;
  
  private persistIndexes: boolean = true;
  
  private isInitialized: boolean = false;
  
  private pendingFileChanges: TAbstractFile[] = [];
  
  private saveIntervalId: number | null = null;
  
  private dataExtractor: (file: TFile) => Promise<unknown>;
  
  private readonly BASE_FOLDER = '.journalit';
  
  private readonly INDEX_FOLDER = 'indexes';
  
  private plugin: JournalitPlugin | null = null;
  
  private dirtyIndexes: Set<string> = new Set();
  
  private pendingRebuildIndexes: Set<string> = new Set();
  
  private eventUnsubscribers: Unsubscribe[] = [];

  
  constructor(
    app: App,
    dataExtractor: (file: TFile) => Promise<unknown>,
    options: { persistIndexes?: boolean } = {}
  ) {
    this.app = app;
    this.dataExtractor = dataExtractor;
    this.persistIndexes = options.persistIndexes ?? true;
    this.boundHandleFileChange = (file: TAbstractFile) => {
      this.handleFileChange(file);
    };

    
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

    
    
    this.eventUnsubscribers.push(
      eventBus.subscribe('trade:changed', () => {
        this.markAllIndexesDirty();
      })
    );
    this.eventUnsubscribers.push(
      eventBus.subscribe('missed-trade:changed', () => {
        this.markAllIndexesDirty();
      })
    );
    this.eventUnsubscribers.push(
      eventBus.subscribe('backtest-trade:changed', () => {
        this.markAllIndexesDirty();
      })
    );

    
    
    if (this.isInitialized && this.persistIndexes && !this.saveIntervalId) {
      this.saveIntervalId = this.plugin.registerInterval(
        window.setInterval(() => void this.saveIndexes(), 5 * 60 * 1000)
      );
    }
  }

  
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      
      const indexDir = `${this.BASE_FOLDER}/${this.INDEX_FOLDER}`;
      if (!(await this.app.vault.adapter.exists(indexDir))) {
        await this.app.vault.adapter.mkdir(indexDir);
      }

      
      if (this.persistIndexes) {
        await this.loadIndexes();
      }

      this.isInitialized = true;

      
      for (const file of this.pendingFileChanges) {
        this.handleFileChange(file);
      }
      this.pendingFileChanges = [];

      
      if (this.persistIndexes && this.plugin) {
        this.saveIntervalId = this.plugin.registerInterval(
          window.setInterval(() => void this.saveIndexes(), 5 * 60 * 1000)
        );
      }
    } catch (error) {
      console.error('Failed to initialize index manager:', error);
    }
  }

  
  public registerIndex(config: IndexConfig): void {
    this.indexConfigs.set(config.name, config);
    if (!this.indexes.has(config.name)) {
      this.indexes.set(config.name, []);
    }

    this.readyIndexes.delete(config.name);

    
    if (!this.buildingIndexes.has(config.name)) {
      void this.buildIndex(config.name);
    }
  }

  
  public getIndex(indexName: string): IndexEntry[] {
    if (
      !this.isInitialized ||
      this.buildingIndexes.has(indexName) ||
      !this.readyIndexes.has(indexName)
    ) {
      return [];
    }

    
    if (this.dirtyIndexes.has(indexName)) {
      if (!this.buildingIndexes.has(indexName)) {
        void this.rebuildDirtyIndex(indexName);
      }
      return [];
    }
    return this.indexes.get(indexName) || [];
  }

  
  public isIndexBuilding(indexName: string): boolean {
    return this.buildingIndexes.has(indexName);
  }

  
  public isIndexReady(indexName: string): boolean {
    if (!this.isInitialized) return false;
    if (!this.indexConfigs.has(indexName)) return false;

    return (
      this.readyIndexes.has(indexName) &&
      !this.buildingIndexes.has(indexName) &&
      !this.dirtyIndexes.has(indexName)
    );
  }

  
  public queryIndex(
    indexName: string,
    filters: Record<string, unknown> = {},
    options: {
      sort?: { field: string; direction: 'asc' | 'desc' };
      limit?: number;
      offset?: number;
    } = {}
  ): IndexEntry[] {
    if (
      !this.isInitialized ||
      this.buildingIndexes.has(indexName) ||
      !this.readyIndexes.has(indexName)
    ) {
      return [];
    }

    
    
    
    if (this.dirtyIndexes.has(indexName)) {
      
      if (!this.buildingIndexes.has(indexName)) {
        void this.rebuildDirtyIndex(indexName);
      }
      return [];
    }

    const index = this.indexes.get(indexName);
    if (!index) return [];

    
    let results = index.filter((entry) => {
      return Object.entries(filters).every(([field, value]) => {
        const fieldValue = entry.values[field];
        if (Array.isArray(fieldValue)) {
          return Array.isArray(value)
            ? value.some((v) => fieldValue.includes(v))
            : fieldValue.includes(value);
        }
        return fieldValue === value;
      });
    });

    
    if (options.sort) {
      const { field, direction } = options.sort;

      const compareIndexValues = (left: unknown, right: unknown): number => {
        if (left === right) return 0;

        
        if (left === undefined) return -1;
        if (right === undefined) return 1;
        if (left === null) return -1;
        if (right === null) return 1;

        if (typeof left === 'number' && typeof right === 'number') {
          return left < right ? -1 : 1;
        }

        if (typeof left === 'string' && typeof right === 'string') {
          return left.localeCompare(right);
        }

        if (typeof left === 'boolean' && typeof right === 'boolean') {
          return left === right ? 0 : left ? 1 : -1;
        }

        if (left instanceof Date && right instanceof Date) {
          const lt = left.getTime();
          const rt = right.getTime();
          return lt === rt ? 0 : lt < rt ? -1 : 1;
        }

        
        const ls = safeString(left);
        const rs = safeString(right);
        return ls === rs ? 0 : ls < rs ? -1 : 1;
      };

      results.sort((a, b) => {
        const aValue = a.values[field];
        const bValue = b.values[field];

        const comparison = compareIndexValues(aValue, bValue);
        return direction === 'asc' ? comparison : -comparison;
      });
    }

    
    if (options.offset !== undefined && options.offset > 0) {
      results = results.slice(options.offset);
    }

    if (options.limit !== undefined && options.limit > 0) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  
  public getUniqueValues(indexName: string, field: string): unknown[] {
    if (
      !this.isInitialized ||
      this.buildingIndexes.has(indexName) ||
      !this.readyIndexes.has(indexName)
    ) {
      return [];
    }

    if (this.dirtyIndexes.has(indexName)) {
      if (!this.buildingIndexes.has(indexName)) {
        void this.rebuildDirtyIndex(indexName);
      }
      return [];
    }

    const index = this.indexes.get(indexName);
    if (!index) return [];

    const uniqueValuesSet = new Set<unknown>();

    for (const entry of index) {
      const value = entry.values[field];

      if (Array.isArray(value)) {
        
        value.forEach((v) => uniqueValuesSet.add(v));
      } else if (value !== undefined && value !== null) {
        
        uniqueValuesSet.add(value);
      }
    }

    return Array.from(uniqueValuesSet);
  }

  
  public markDirty(indexName: string): void {
    if (!this.indexConfigs.has(indexName)) {
      return;
    }

    this.dirtyIndexes.add(indexName);

    if (this.buildingIndexes.has(indexName)) {
      this.pendingRebuildIndexes.add(indexName);
    }
  }

  
  public markAllIndexesDirty(): void {
    for (const indexName of this.indexConfigs.keys()) {
      this.markDirty(indexName);
    }
  }

  
  public isDirtyIndex(indexName: string): boolean {
    return this.dirtyIndexes.has(indexName);
  }

  
  private clearDirty(indexName: string): void {
    this.dirtyIndexes.delete(indexName);
  }

  
  private async rebuildDirtyIndex(indexName: string): Promise<void> {
    const config = this.indexConfigs.get(indexName);
    if (!config) return;

    let shouldRebuild = true;

    while (shouldRebuild) {
      
      this.buildingIndexes.add(indexName);
      this.readyIndexes.delete(indexName);

      try {
        
        this.indexes.set(indexName, []);

        
        for (const [filePath, indexMap] of this.filePathMap.entries()) {
          indexMap.delete(indexName);
          if (indexMap.size === 0) {
            this.filePathMap.delete(filePath);
          }
        }

        
        const allFiles = this.app.vault.getFiles();
        const filesToIndex = config.fileFilter
          ? allFiles.filter(config.fileFilter)
          : allFiles.filter((file) => file.extension === 'md');

        
        for (const file of filesToIndex) {
          try {
            await this.indexFile(file, indexName);
          } catch (error) {
            console.error(`Error re-indexing file ${file.path}:`, error);
          }
        }

        
        this.isDirty = true;
      } finally {
        
        this.buildingIndexes.delete(indexName);
      }

      if (this.pendingRebuildIndexes.has(indexName)) {
        this.pendingRebuildIndexes.delete(indexName);
        this.dirtyIndexes.add(indexName);
        shouldRebuild = true;
        continue;
      }

      shouldRebuild = false;

      
      this.clearDirty(indexName);

      this.readyIndexes.add(indexName);
      eventBus.publish('index:ready', { indexName });
    }
  }

  
  private async buildIndex(indexName: string): Promise<void> {
    
    if (this.buildingIndexes.has(indexName)) return;

    this.buildingIndexes.add(indexName);
    this.readyIndexes.delete(indexName);

    try {
      const config = this.indexConfigs.get(indexName);
      if (!config) {
        console.error(`No config found for index: ${indexName}`);
        this.buildingIndexes.delete(indexName);
        return;
      }

      
      const allFiles = this.app.vault.getFiles();

      
      const filesToIndex = config.fileFilter
        ? allFiles.filter(config.fileFilter)
        : allFiles.filter((file) => file.extension === 'md');

      
      const batchSize = 20;
      const batches = [];

      for (let i = 0; i < filesToIndex.length; i += batchSize) {
        const batch = filesToIndex.slice(i, i + batchSize);
        batches.push(batch);
      }

      const existingIndex = this.indexes.get(indexName);
      const hasExistingEntries = !!existingIndex && existingIndex.length > 0;

      
      if (!hasExistingEntries) {
        this.indexes.set(indexName, []);
      }

      const allFilePaths = new Set(allFiles.map((file) => file.path));
      const indexFilePaths = new Set(filesToIndex.map((file) => file.path));

      for (const filePath of Array.from(this.filePathMap.keys())) {
        if (!allFilePaths.has(filePath)) {
          this.removeFileFromIndexes(filePath);
          continue;
        }

        if (!indexFilePaths.has(filePath)) {
          this.removeFileFromIndex(filePath, indexName);
        }
      }

      
      for (const batch of batches) {
        
        const tasks = batch.map((file) => {
          return async () => {
            try {
              await this.indexFile(file, indexName);
            } catch (error) {
              console.error(`Error indexing file ${file.path}:`, error);
            }
          };
        });

        
        for (let i = 0; i < tasks.length; i++) {
          await tasks[i]();

          
          if (i % 5 === 0 && i > 0) {
            await new Promise((resolve) => window.setTimeout(resolve, 10));
          }
        }
      }

      this.isDirty = true;

      if (this.pendingRebuildIndexes.has(indexName)) {
        this.pendingRebuildIndexes.delete(indexName);
        await this.rebuildDirtyIndex(indexName);
        return;
      }

      
      this.clearDirty(indexName);

      this.readyIndexes.add(indexName);
      eventBus.publish('index:ready', { indexName });
    } catch (error) {
      console.error(`Error building index ${indexName}:`, error);
      this.dirtyIndexes.add(indexName);
      this.pendingRebuildIndexes.delete(indexName);
      this.readyIndexes.add(indexName);
      eventBus.publish('index:ready', { indexName });
    } finally {
      this.buildingIndexes.delete(indexName);

      
      if (this.persistIndexes) {
        void this.saveIndexes();
      }
    }
  }

  
  private async indexFile(file: TFile, indexName: string): Promise<void> {
    const config = this.indexConfigs.get(indexName);
    if (!config) return;

    
    if (config.fileFilter && !config.fileFilter(file)) return;

    try {
      
      const data = await this.dataExtractor(file);
      if (!data) return;

      
      const values: Record<string, unknown> = {};
      const dataRecord = asRecord(data);

      for (const field of config.fields) {
        if (config.valueExtractor) {
          
          values[field] = config.valueExtractor(data, field);
        } else if (config.includeNested) {
          
          values[field] = this.getNestedValue(dataRecord ?? {}, field);
        } else {
          
          values[field] = dataRecord?.[field];
        }
      }

      
      const entry: IndexEntry = {
        data,
        file,
        values,
      };

      
      const index = this.indexes.get(indexName) || [];

      
      let existingIndex = -1;
      if (!this.filePathMap.has(file.path)) {
        this.filePathMap.set(file.path, new Map());
      }

      const fileIndices = this.filePathMap.get(file.path)!;
      if (fileIndices.has(indexName)) {
        existingIndex = fileIndices.get(indexName)!;
      }

      if (existingIndex >= 0 && existingIndex < index.length) {
        
        index[existingIndex] = entry;
      } else {
        
        const newIndex = index.length;
        index.push(entry);
        fileIndices.set(indexName, newIndex);
      }

      this.indexes.set(indexName, index);
      this.isDirty = true;
    } catch (error) {
      console.error(
        `Error indexing file ${file.path} for index ${indexName}:`,
        error
      );
    }
  }

  
  private removeFileFromIndex(filePath: string, indexName: string): void {
    const fileIndices = this.filePathMap.get(filePath);
    if (!fileIndices) return;

    const fileIndex = fileIndices.get(indexName);
    if (fileIndex === undefined) return;

    const index = this.indexes.get(indexName);
    if (!index) return;

    if (fileIndex >= 0 && fileIndex < index.length) {
      const lastIndex = index.length - 1;

      if (fileIndex !== lastIndex) {
        const lastItem = index[lastIndex];
        index[fileIndex] = lastItem;

        const lastItemPath = lastItem.file.path;
        const lastItemIndices = this.filePathMap.get(lastItemPath);
        if (lastItemIndices?.has(indexName)) {
          lastItemIndices.set(indexName, fileIndex);
        }
      }

      index.pop();
      this.isDirty = true;
    }

    fileIndices.delete(indexName);
    if (fileIndices.size === 0) {
      this.filePathMap.delete(filePath);
      this.processedFiles.delete(filePath);
    }
  }

  
  private removeFileFromIndexes(filePath: string): void {
    
    if (!this.filePathMap.has(filePath)) return;

    const fileIndices = this.filePathMap.get(filePath)!;

    
    for (const [indexName, fileIndex] of fileIndices.entries()) {
      const index = this.indexes.get(indexName);
      if (!index) continue;

      
      if (fileIndex >= 0 && fileIndex < index.length) {
        
        const lastIndex = index.length - 1;

        if (fileIndex !== lastIndex) {
          
          const lastItem = index[lastIndex];
          index[fileIndex] = lastItem;

          
          const lastItemPath = lastItem.file.path;
          if (this.filePathMap.has(lastItemPath)) {
            const lastItemIndices = this.filePathMap.get(lastItemPath)!;
            if (lastItemIndices.has(indexName)) {
              lastItemIndices.set(indexName, fileIndex);
            }
          }
        }

        
        index.pop();
        this.isDirty = true;
      }
    }

    
    this.filePathMap.delete(filePath);
    this.processedFiles.delete(filePath);
  }

  
  private handleFileChange(file: TAbstractFile): void {
    
    if (
      !('path' in file) ||
      file.path.includes(`${this.BASE_FOLDER}/${this.INDEX_FOLDER}`)
    )
      return;

    
    if (!this.isInitialized) {
      this.pendingFileChanges.push(file);
      return;
    }

    scheduleIdle(async () => {
      try {
        if (file instanceof TFile) {
          if (file.extension !== 'md') return;

          
          for (const indexName of this.indexConfigs.keys()) {
            
            
            
            if (this.buildingIndexes.has(indexName)) {
              this.markDirty(indexName);
              continue;
            }

            
            await this.indexFile(file, indexName);
          }
        } else {
          
          this.removeFileFromIndexes(file.path);
        }

        
        if (this.isDirty && this.persistIndexes) {
          window.setTimeout(() => void this.saveIndexes(), 2000);
        }
      } catch (error) {
        console.error(`Error handling file change for ${file.path}:`, error);
      }
    });
  }

  
  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((value, key) => {
      return value && value[key] !== undefined ? value[key] : undefined;
    }, obj);
  }

  
  private async saveIndexes(): Promise<void> {
    if (!this.isDirty || !this.persistIndexes) return;

    try {
      const indexDir = `${this.BASE_FOLDER}/${this.INDEX_FOLDER}`;

      
      if (!(await this.app.vault.adapter.exists(indexDir))) {
        await this.app.vault.adapter.mkdir(indexDir);
      }

      
      for (const [indexName, entries] of this.indexes.entries()) {
        const serialized = {
          name: indexName,
          entries: entries.map((entry) => ({
            path: entry.file.path,
            values: entry.values,
          })),
        };

        const indexPath = `${indexDir}/${indexName}.json`;
        await this.app.vault.adapter.write(
          indexPath,
          JSON.stringify(serialized)
        );
      }

      this.isDirty = false;
    } catch (error) {
      console.error('Failed to save indexes:', error);
    }
  }

  
  private async loadIndexes(): Promise<void> {
    try {
      const indexDir = `${this.BASE_FOLDER}/${this.INDEX_FOLDER}`;

      
      if (!(await this.app.vault.adapter.exists(indexDir))) {
        return;
      }

      
      const { files } = await this.app.vault.adapter.list(indexDir);

      
      for (const filePath of files) {
        try {
          const content = await this.app.vault.adapter.read(filePath);
          const serialized = parseSerializedIndex(
            JSON.parse(content) as unknown
          );

          if (!serialized) {
            console.warn(`Invalid index file format: ${filePath}`);
            continue;
          }

          
          const indexName = serialized.name;
          this.indexes.set(indexName, []);

          
          for (let i = 0; i < serialized.entries.length; i++) {
            const serializedEntry = serialized.entries[i];
            const filePath = serializedEntry.path;
            const file = this.app.vault.getAbstractFileByPath(filePath);

            
            if (!file || !(file instanceof TFile)) continue;

            
            const entry: IndexEntry = {
              data: null, 
              file: file,
              values: serializedEntry.values,
            };

            
            const index = this.indexes.get(indexName)!;
            index.push(entry);

            
            if (!this.filePathMap.has(filePath)) {
              this.filePathMap.set(filePath, new Map());
            }

            this.filePathMap.get(filePath)!.set(indexName, index.length - 1);
            this.processedFiles.add(filePath);
          }
        } catch (error) {
          console.error(`Failed to load index file ${filePath}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to load indexes:', error);
    }
  }

  
  public unload(): void {
    
    this.saveIntervalId = null;

    

    
    for (const unsubscribe of this.eventUnsubscribers) {
      unsubscribe();
    }
    this.eventUnsubscribers = [];

    
    if (this.persistIndexes && this.isDirty) {
      void this.saveIndexes();
    }

    
    this.indexes.clear();
    this.dirtyIndexes.clear();
    this.indexConfigs.clear();
    this.filePathMap.clear();
    this.processedFiles.clear();
    this.pendingFileChanges = [];
  }
}
