

import { App, TFile, TAbstractFile, TFolder } from 'obsidian';
import { scheduleIdle } from '../../utils/deferredExecution';
import type JournalitPlugin from '../../main';
import { eventBus } from '../events/EventBus';
import type { Unsubscribe } from '../events/types';
import { safeString } from '../../utils/safeString';
import {
  getJournalitIndexesPath,
  isPathWithinDirectory,
} from './pluginStoragePaths';
import { CoalescedWriter } from './CoalescedWriter';

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

  const entries = record.entries.flatMap((entry) => {
    const entryRecord = asRecord(entry);
    if (!entryRecord || typeof entryRecord.path !== 'string') {
      return [];
    }
    return [
      {
        path: entryRecord.path,
        values: asRecord(entryRecord.values) ?? {},
      },
    ];
  });

  return { name: record.name, entries };
}


export interface IndexConfig {
  
  name: string;
  
  fields: string[];
  
  includeNested?: boolean;
  
  valueExtractor?: (data: unknown, field: string) => unknown;
  
  fileFilter?: (file: TFile) => boolean;
  
  dataFilter?: (data: unknown, file: TFile) => boolean;
  
  folderFilter?: (path: string) => boolean;
}


export interface IndexEntry {
  
  data: unknown;
  
  file: TFile;
  
  values: Record<string, unknown>;
}


export class IndexManager {
  private static readonly SAVE_DELAY_MS = 2000;
  private static readonly MAX_SAVE_DELAY_MS = 30_000;
  
  private indexes: Map<string, IndexEntry[]> = new Map();
  
  private indexConfigs: Map<string, IndexConfig> = new Map();
  
  private filePathMap: Map<string, Map<string, number>> = new Map();
  
  private buildingIndexes: Set<string> = new Set();
  
  private readyIndexes: Set<string> = new Set();
  
  private processedFiles: Set<string> = new Set();
  
  private boundHandleFileChange: (
    file: TAbstractFile,
    oldPath?: string
  ) => void;
  
  private app: App;
  private persistenceWriter: CoalescedWriter;
  
  private persistIndexes: boolean = true;
  
  private isInitialized: boolean = false;
  
  private pendingFileChanges: Array<{
    file: TAbstractFile;
    oldPath?: string;
  }> = [];
  
  private saveIntervalId: number | null = null;
  
  private dataExtractor: (file: TFile) => Promise<unknown>;

  
  private plugin: JournalitPlugin | null = null;
  
  private dirtyIndexes: Set<string> = new Set();
  
  private pendingRebuildIndexes: Set<string> = new Set();
  
  private eventUnsubscribers: Unsubscribe[] = [];
  
  private listenersRegistered: boolean = false;

  
  constructor(
    app: App,
    dataExtractor: (file: TFile) => Promise<unknown>,
    options: { persistIndexes?: boolean } = {}
  ) {
    this.app = app;
    this.dataExtractor = dataExtractor;
    this.persistIndexes = options.persistIndexes ?? true;
    this.persistenceWriter = new CoalescedWriter({
      delayMs: IndexManager.SAVE_DELAY_MS,
      maxDelayMs: IndexManager.MAX_SAVE_DELAY_MS,
      writeSnapshot: () => this.writeIndexSnapshot(),
      onScheduledWriteError: (error) => {
        console.error('Failed to save indexes:', error);
      },
    });
    this.boundHandleFileChange = (file: TAbstractFile, oldPath?: string) => {
      this.handleFileChange(file, oldPath);
    };

    
  }

  
  public setPlugin(plugin: JournalitPlugin): void {
    this.plugin = plugin;

    if (!this.listenersRegistered) {
      
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
        eventBus.subscribe('trade:changed', (payload) => {
          if (payload.action === 'relocated') return;
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
      this.listenersRegistered = true;
    }

    
    
    if (this.isInitialized && this.persistIndexes && !this.saveIntervalId) {
      this.saveIntervalId = this.plugin.registerInterval(
        window.setInterval(() => void this.flushIndexes(), 5 * 60 * 1000)
      );
    }
  }

  
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      
      const indexDir = getJournalitIndexesPath(this.app);
      if (!(await this.app.vault.adapter.exists(indexDir))) {
        await this.app.vault.adapter.mkdir(indexDir);
      }

      
      if (this.persistIndexes) {
        await this.loadIndexes();
      }

      this.isInitialized = true;

      
      for (const { file, oldPath } of this.pendingFileChanges) {
        this.handleFileChange(file, oldPath);
      }
      this.pendingFileChanges = [];

      for (const indexName of this.indexConfigs.keys()) {
        if (!this.buildingIndexes.has(indexName)) {
          void this.buildIndex(indexName);
        }
      }

      
      if (this.persistIndexes && this.plugin) {
        this.saveIntervalId = this.plugin.registerInterval(
          window.setInterval(() => void this.flushIndexes(), 5 * 60 * 1000)
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

    
    if (this.isInitialized && !this.buildingIndexes.has(config.name)) {
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
          if (!Array.isArray(value)) return fieldValue.includes(value);
          const fieldValueSet = new Set(fieldValue);
          return value.some((v) => fieldValueSet.has(v));
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

        
        this.markPersistenceDirty();
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

    if (this.persistIndexes && this.buildingIndexes.size === 0) {
      this.persistenceWriter.scheduleIfDirty();
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

      this.markPersistenceDirty();

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

      if (this.persistIndexes && this.buildingIndexes.size === 0) {
        this.persistenceWriter.scheduleIfDirty();
      }
    }
  }

  
  private async indexFile(file: TFile, indexName: string): Promise<void> {
    const config = this.indexConfigs.get(indexName);
    if (!config) return;

    
    if (config.fileFilter && !config.fileFilter(file)) {
      this.removeFileFromIndex(file.path, indexName);
      return;
    }

    try {
      
      const data = await this.dataExtractor(file);
      if (!data) return;
      if (config.dataFilter && !config.dataFilter(data, file)) {
        this.removeFileFromIndex(file.path, indexName);
        return;
      }

      
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
      this.markPersistenceDirty();
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
      this.markPersistenceDirty();
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
        this.markPersistenceDirty();
      }
    }

    
    this.filePathMap.delete(filePath);
    this.processedFiles.delete(filePath);
  }

  private getIndexesForPathAndDescendants(path: string): Set<string> {
    const indexNames = new Set<string>();
    for (const [indexedPath, indexedByName] of this.filePathMap.entries()) {
      if (isPathWithinDirectory(indexedPath, path)) {
        for (const indexName of indexedByName.keys()) {
          indexNames.add(indexName);
        }
      }
    }
    return indexNames;
  }

  private getIndexesAffectedByFolderChange(
    folder: TFolder,
    oldPath?: string
  ): Set<string> {
    const indexNames = this.getIndexesForPathAndDescendants(folder.path);
    if (oldPath) {
      for (const indexName of this.getIndexesForPathAndDescendants(oldPath)) {
        indexNames.add(indexName);
      }
    }
    for (const [indexName, config] of this.indexConfigs.entries()) {
      if (config.folderFilter?.(folder.path)) {
        indexNames.add(indexName);
      }
    }
    return indexNames;
  }

  private handleFileRenameImmediately(file: TFile, oldPath: string): void {
    const oldIndexNames = new Set(this.filePathMap.get(oldPath)?.keys() ?? []);
    const retainedMappings = new Map<string, number>();

    for (const indexName of oldIndexNames) {
      const config = this.indexConfigs.get(indexName);
      const remainsEligible =
        file.extension === 'md' &&
        (!config?.fileFilter || config.fileFilter(file));

      if (remainsEligible) {
        const fileIndex = this.filePathMap.get(oldPath)?.get(indexName);
        if (fileIndex !== undefined) {
          retainedMappings.set(indexName, fileIndex);
        }
      } else {
        this.removeFileFromIndex(oldPath, indexName);
      }
    }

    const oldMappings = this.filePathMap.get(oldPath);
    const newMappings =
      this.filePathMap.get(file.path) ?? new Map<string, number>();
    for (const [indexName, fileIndex] of retainedMappings) {
      oldMappings?.delete(indexName);
      newMappings.set(indexName, fileIndex);
    }
    if (retainedMappings.size > 0) {
      this.filePathMap.set(file.path, newMappings);
      this.processedFiles.add(file.path);
      this.markPersistenceDirty();
    }
    if (oldMappings?.size === 0) {
      this.filePathMap.delete(oldPath);
      this.processedFiles.delete(oldPath);
    }

    for (const [indexName, config] of this.indexConfigs.entries()) {
      if (oldIndexNames.has(indexName)) continue;
      const becomesEligible =
        file.extension === 'md' &&
        (!config.fileFilter || config.fileFilter(file));
      if (becomesEligible) {
        this.markDirty(indexName);
      }
    }
  }

  
  private handleFileChange(file: TAbstractFile, oldPath?: string): void {
    
    if (
      !('path' in file) ||
      isPathWithinDirectory(file.path, getJournalitIndexesPath(this.app))
    )
      return;

    
    if (!this.isInitialized) {
      this.pendingFileChanges.push({ file, oldPath });
      return;
    }

    const isFolder = file instanceof TFolder;
    if (isFolder) {
      for (const indexName of this.getIndexesAffectedByFolderChange(
        file,
        oldPath
      )) {
        this.markDirty(indexName);
      }
    } else if (file instanceof TFile && oldPath && oldPath !== file.path) {
      this.handleFileRenameImmediately(file, oldPath);
    }

    scheduleIdle(async () => {
      try {
        if (isFolder) {
          
          
          this.removeFileFromIndexes(file.path);
        } else if (file instanceof TFile) {
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

  
  private markPersistenceDirty(): void {
    if (!this.persistIndexes) return;
    this.persistenceWriter.markDirty({ defer: this.buildingIndexes.size > 0 });
  }

  private async writeIndexSnapshot(): Promise<void> {
    const indexDir = getJournalitIndexesPath(this.app);
    const serializedIndexes = Array.from(this.indexes.entries()).map(
      ([indexName, entries]) => ({
        path: `${indexDir}/${indexName}.json`,
        content: JSON.stringify({
          name: indexName,
          entries: entries.map((entry) => ({
            path: entry.file.path,
            values: entry.values,
          })),
        }),
      })
    );

    if (!(await this.app.vault.adapter.exists(indexDir))) {
      await this.app.vault.adapter.mkdir(indexDir);
    }

    for (const index of serializedIndexes) {
      await this.app.vault.adapter.write(index.path, index.content);
    }
  }

  
  public async flushIndexes(): Promise<void> {
    if (!this.persistIndexes) return;

    try {
      await this.persistenceWriter.flush();
    } catch (error) {
      console.error('Failed to save indexes:', error);
    }
  }

  
  private async loadIndexes(): Promise<void> {
    try {
      const indexDir = getJournalitIndexesPath(this.app);

      
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
          const config = this.indexConfigs.get(indexName);
          if (!config) continue;
          this.indexes.set(indexName, []);

          const serializedEntriesByPath = new Map<
            string,
            SerializedIndexEntry
          >();
          for (const serializedEntry of serialized.entries) {
            serializedEntriesByPath.set(serializedEntry.path, serializedEntry);
          }

          
          for (const serializedEntry of serializedEntriesByPath.values()) {
            const filePath = serializedEntry.path;
            const file = this.app.vault.getAbstractFileByPath(filePath);

            
            if (!file || !(file instanceof TFile)) continue;
            if (config.fileFilter && !config.fileFilter(file)) continue;

            
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

  
  public async unload(): Promise<void> {
    
    this.saveIntervalId = null;

    

    
    for (const unsubscribe of this.eventUnsubscribers) {
      unsubscribe();
    }
    this.eventUnsubscribers = [];

    try {
      await this.persistenceWriter.dispose();
    } catch (error) {
      console.error('Failed to save indexes:', error);
    }

    
    this.indexes.clear();
    this.dirtyIndexes.clear();
    this.indexConfigs.clear();
    this.filePathMap.clear();
    this.processedFiles.clear();
    this.pendingFileChanges = [];
  }
}
