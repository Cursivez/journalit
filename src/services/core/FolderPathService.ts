

import { App, normalizePath } from 'obsidian';
import JournalitPlugin from '../../main';
import { eventBus } from '../events/EventBus';
import { Unsubscribe } from '../events/types';
import { getQuarterForMonth, getQuarterString } from '../../utils/dateUtils';
import type { JournalSettingsContext } from '../../demo/DemoSettingsScope';


const MAX_JOURNAL_PATH_RESULTS = 100_000;

export class FolderPathService {
  private app: App;
  private plugin: JournalitPlugin;
  private _currentPath: string;
  
  private journalPathResults: { root: string; byPath: Map<string, boolean> } = {
    root: '',
    byPath: new Map(),
  };
  private _callbacks: Set<(newPath: string) => void> = new Set();
  private unsubscribeSettings?: Unsubscribe;
  private activeContext: JournalSettingsContext = 'real';

  constructor(app: App, plugin: JournalitPlugin) {
    this.app = app;
    this.plugin = plugin;
    this._currentPath = this.getConfiguredPath();

    
    this.unsubscribeSettings = eventBus.subscribe(
      'settings:changed',
      (payload) => {
        void this.onSettingsUpdated(payload);
      }
    );
  }

  
  public get journalFolderPath(): string {
    return this._currentPath;
  }

  public get context(): JournalSettingsContext {
    return this.activeContext;
  }

  public activateContext(
    context: JournalSettingsContext,
    sampleRoot?: string
  ): void {
    const nextPath =
      context === 'sample'
        ? normalizePath(sampleRoot?.trim() ?? '')
        : this.getConfiguredPath();

    if (!this.isValidPath(nextPath) || !nextPath) {
      throw new Error(`Invalid ${context} journal folder path: ${nextPath}`);
    }

    this.activeContext = context;
    if (nextPath === this._currentPath) return;

    this._currentPath = nextPath;
    this.notifyPathChange(nextPath);
    eventBus.publish('folder-path:changed', {
      type: 'changed',
      value: nextPath,
    });
  }

  
  private getConfiguredPath(): string {
    const configuredPath = this.plugin.settings.general?.journalFolderPath;

    
    if (!configuredPath || configuredPath.trim() === '') {
      return '!Journalit';
    }

    
    return normalizePath(configuredPath.trim());
  }

  
  public async updatePath(newPath: string): Promise<void> {
    if (this.activeContext === 'sample') {
      throw new Error(
        'The real journal folder cannot be changed while the sample journal is active'
      );
    }

    const normalizedPath = normalizePath(newPath.trim());

    
    if (!this.isValidPath(normalizedPath)) {
      throw new Error(`Invalid folder path: ${normalizedPath}`);
    }

    
    this.plugin.settings.general!.journalFolderPath = normalizedPath;
    await this.plugin.saveSettings();

    
    this._currentPath = normalizedPath;

    
    this.notifyPathChange(normalizedPath);

    
    eventBus.publish('folder-path:changed', {
      type: 'changed',
      value: normalizedPath,
    });
  }

  
  public getPath(...segments: string[]): string {
    const fullPath = [this._currentPath, ...segments].join('/');
    return normalizePath(fullPath);
  }

  
  public getDatePath(
    year: string,
    month: string,
    week: string,
    ...additionalSegments: string[]
  ): string {
    return this.getPath(year, month, week, ...additionalSegments);
  }

  
  public getDatePathWithQuarter(
    year: string,
    quarter: string,
    month: string,
    week: string,
    ...additionalSegments: string[]
  ): string {
    return this.getPath(year, quarter, month, week, ...additionalSegments);
  }

  
  public async getDatePathForQuarter(
    year: string,
    quarterNum: number,
    month: string,
    week: string,
    ...additionalSegments: string[]
  ): Promise<string> {
    const quarter = getQuarterString(quarterNum);
    return this.getDatePathWithQuarter(
      year,
      quarter,
      month,
      week,
      ...additionalSegments
    );
  }

  
  public getDatePathForQuarterSync(
    year: string,
    quarterNum: number,
    month: string,
    week: string,
    ...additionalSegments: string[]
  ): string {
    const quarter = getQuarterString(quarterNum);
    return this.getDatePathWithQuarter(
      year,
      quarter,
      month,
      week,
      ...additionalSegments
    );
  }

  
  public getQuarterlyReviewPathSync(year: number, quarter: number): string {
    const quarterStr = getQuarterString(quarter);
    const filename = `${quarterStr}-Review.md`;
    return this.getPath(year.toString(), quarterStr, filename);
  }

  
  public getMonthlyReviewPathForQuarterSync(
    year: number,
    month: number
  ): string {
    const quarter = getQuarterForMonth(month);
    const monthStr = month.toString().padStart(2, '0');
    const quarterStr = getQuarterString(quarter);
    const filename = `${monthStr}-Review.md`;
    return this.getPath(year.toString(), quarterStr, monthStr, filename);
  }

  
  public async getQuarterlyReviewPath(
    year: number,
    quarter: number
  ): Promise<string> {
    const quarterStr = getQuarterString(quarter);
    const filename = `${quarterStr}-Review.md`;
    return this.getPath(year.toString(), quarterStr, filename);
  }

  
  public getYearlyReviewPath(year: number): string {
    const filename = `${year}-Review.md`;
    return this.getPath(year.toString(), filename);
  }

  
  public isJournalPath(path: string): boolean {
    const journalPath = this._currentPath;
    
    if (this.journalPathResults.root !== journalPath) {
      this.journalPathResults = { root: journalPath, byPath: new Map() };
    }
    const results = this.journalPathResults.byPath;
    const known = results.get(path);
    if (known !== undefined) return known;

    const normalizedPath = normalizePath(path);
    const isJournal =
      
      !normalizedPath.includes('-backup-') &&
      (normalizedPath.startsWith(journalPath + '/') ||
        normalizedPath === journalPath);
    if (results.size >= MAX_JOURNAL_PATH_RESULTS) results.clear();
    results.set(path, isJournal);
    return isJournal;
  }

  
  public onPathChange(callback: (newPath: string) => void): () => void {
    this._callbacks.add(callback);

    
    return () => {
      this._callbacks.delete(callback);
    };
  }

  
  private isValidPath(path: string): boolean {
    
    if (!path || path.trim() === '') {
      return true; 
    }

    
    if (path.includes('..') || /[<>:"|?*]/.test(path)) {
      return false;
    }

    return true;
  }

  
  private async onSettingsUpdated(payload?: {
    source?: string;
  }): Promise<void> {
    if (this.activeContext === 'sample') {
      return;
    }

    
    if (payload?.source === 'user-input') {
      return;
    }

    const newPath = this.getConfiguredPath();
    if (newPath !== this._currentPath) {
      this._currentPath = newPath;
      this.notifyPathChange(newPath);

      
      eventBus.publish('folder-path:changed', {
        type: 'changed',
        value: newPath,
      });
    }
  }

  
  private notifyPathChange(newPath: string): void {
    this._callbacks.forEach((callback) => {
      try {
        callback(newPath);
      } catch (error) {
        console.error(
          '[FolderPathService] Error in path change callback:',
          error
        );
      }
    });
  }

  
  public async ensureJournalFolderExists(): Promise<void> {
    const folderPath = this._currentPath;
    const folder = this.app.vault.getAbstractFileByPath(folderPath);

    if (!folder) {
      await this.app.vault.createFolder(folderPath);
    }
  }

  
  public getLegacyPath(): string {
    return '!Journalit';
  }

  
  public isLegacyPath(): boolean {
    return this._currentPath === this.getLegacyPath();
  }

  
  public cleanup(): void {
    this.unsubscribeSettings?.();
    this._callbacks.clear();
  }
}
