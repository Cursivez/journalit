

import { App, normalizePath } from 'obsidian';
import JournalitPlugin from '../../main';
import { eventBus, Unsubscribe } from '../events';
import { getQuarterForMonth, getQuarterString } from '../../utils/dateUtils';

export class FolderPathService {
  private app: App;
  private plugin: JournalitPlugin;
  private _currentPath: string;
  private _callbacks: Set<(newPath: string) => void> = new Set();
  private unsubscribeSettings?: Unsubscribe;

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

  
  private getConfiguredPath(): string {
    const configuredPath = this.plugin.settings.general?.journalFolderPath;

    
    if (!configuredPath || configuredPath.trim() === '') {
      return '!Journalit';
    }

    
    return normalizePath(configuredPath.trim());
  }

  
  public async updatePath(newPath: string): Promise<void> {
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
    const normalizedPath = normalizePath(path);
    const journalPath = this._currentPath;

    
    if (normalizedPath.includes('-backup-')) {
      return false;
    }

    return (
      normalizedPath.startsWith(journalPath + '/') ||
      normalizedPath === journalPath
    );
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
