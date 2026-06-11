

import { TFile, Notice } from 'obsidian';
import JournalitPlugin from '../../main';
import {
  BackendIntegrationSettings,
  DEFAULT_SETTINGS,
} from '../../settings/types';
import { TradeSyncService } from './TradeSyncService';
import { t } from '../../lang/helpers';
import { isPnlContributingTrade } from '../../utils/tradeStatusUtils';
import { backgroundIssuesStore } from '../diagnostics/BackgroundIssuesStore';

export class FileWatcherService {
  private plugin: JournalitPlugin;
  private tradeSyncService: TradeSyncService;

  
  private get settings(): BackendIntegrationSettings {
    if (!this.plugin.settings.backendIntegration) {
      console.error(
        'FileWatcherService: backendIntegration is undefined, using defaults'
      );
      this.plugin.settings.backendIntegration = {
        ...DEFAULT_SETTINGS.backendIntegration!,
      };
    }
    return this.plugin.settings.backendIntegration;
  }
  private lastProcessedFiles = new Set<string>();

  
  private readonly MAX_TRACKED_FILES = 1000;
  
  private readonly MAX_FILE_AGE_MS = 24 * 60 * 60 * 1000;
  
  private fileProcessTimestamps = new Map<string, number>();

  
  public batchModifiedFiles = new Set<string>();

  constructor(
    plugin: JournalitPlugin,
    _settings: BackendIntegrationSettings,
    tradeSyncService: TradeSyncService
  ) {
    this.plugin = plugin;
    
    
    this.tradeSyncService = tradeSyncService;
  }

  
  setupFileWatcher(): void {
    
    this.plugin.registerEvent(
      this.plugin.app.vault.on('create', (file) => {
        if (file instanceof TFile && this.tradeSyncService.isTradeFile(file)) {
          this.processNewTradeFile(file);
        }
      })
    );

    
    this.plugin.registerEvent(
      this.plugin.app.vault.on('modify', (file) => {
        if (
          file instanceof TFile &&
          this.tradeSyncService.isTradeFile(file) &&
          !this.lastProcessedFiles.has(file.path) &&
          !this.batchModifiedFiles.has(file.path)
        ) {
          this.processNewTradeFile(file);
        }
      })
    );

    
    this.plugin.registerEvent(
      this.plugin.app.vault.on('delete', (file) => {
        if (file instanceof TFile) {
          this.removeFileFromTracking(file.path);
        }
      })
    );

    
    this.plugin.registerEvent(
      this.plugin.app.vault.on('rename', (file, oldPath) => {
        if (file instanceof TFile) {
          this.removeFileFromTracking(oldPath);
          
          
          
          const wasBatchModifiedRename =
            this.batchModifiedFiles.has(oldPath) ||
            this.batchModifiedFiles.has(file.path);

          if (wasBatchModifiedRename) {
            
            
            this.batchModifiedFiles.add(file.path);
            setTimeout(() => {
              this.batchModifiedFiles.delete(file.path);
            }, 5_000);
            return;
          }

          if (this.tradeSyncService.isTradeFile(file)) {
            this.processNewTradeFile(file);
          }
        }
      })
    );

    
    this.startPeriodicCleanup();
  }

  
  private async processNewTradeFile(file: TFile): Promise<void> {
    try {
      
      
      if (this.plugin.tradeService?.recentlyCreatedFiles?.has(file.path)) {
        return;
      }

      const latestMarkdown = await this.plugin.app.vault.read(file);

      
      
      
      const extractedTrade = this.plugin.tradeService?.extractTradeData
        ? await this.plugin.tradeService.extractTradeData(file)
        : null;
      const parsedTrade = this.tradeSyncService.parseTradeFromMarkdown(
        latestMarkdown,
        file.path
      );

      const normalizedParsedTrade = parsedTrade
        ? (() => {
            const rawParsedTrade = parsedTrade as unknown as Record<
              string,
              unknown
            >;
            return {
              ...parsedTrade,
              pnl:
                rawParsedTrade.pnl !== undefined && rawParsedTrade.pnl !== null
                  ? Number(rawParsedTrade.pnl)
                  : undefined,
              directPnL:
                rawParsedTrade.directPnL !== undefined &&
                rawParsedTrade.directPnL !== null
                  ? Number(rawParsedTrade.directPnL)
                  : undefined,
              commission:
                rawParsedTrade.commission !== undefined &&
                rawParsedTrade.commission !== null
                  ? Number(rawParsedTrade.commission)
                  : undefined,
              fees:
                rawParsedTrade.fees !== undefined &&
                rawParsedTrade.fees !== null
                  ? Number(rawParsedTrade.fees)
                  : undefined,
              swap:
                rawParsedTrade.swap !== undefined &&
                rawParsedTrade.swap !== null
                  ? Number(rawParsedTrade.swap)
                  : undefined,
              rebate:
                rawParsedTrade.rebate !== undefined &&
                rawParsedTrade.rebate !== null
                  ? Number(rawParsedTrade.rebate)
                  : undefined,
              useDirectPnLInput:
                rawParsedTrade.useDirectPnLInput === true ||
                rawParsedTrade.useDirectPnLInput === 'true',
            };
          })()
        : null;

      const extractedTradeContributes = extractedTrade
        ? isPnlContributingTrade(extractedTrade as any)
        : false;
      const parsedTradeContributes = normalizedParsedTrade
        ? isPnlContributingTrade(normalizedParsedTrade as any)
        : false;

      const tradeForRefresh = parsedTradeContributes
        ? normalizedParsedTrade
        : extractedTradeContributes
          ? extractedTrade
          : normalizedParsedTrade || extractedTrade;
      const tradeForNotification = normalizedParsedTrade || extractedTrade;
      const trade = tradeForRefresh || tradeForNotification;

      if (trade) {
        
        this.addFileToTracking(file.path);

        
        
        const isFromSync =
          tradeForRefresh?.backendTradeId !== undefined ||
          tradeForNotification?.backendTradeId !== undefined;

        if (
          tradeForRefresh &&
          !isFromSync &&
          isPnlContributingTrade(tradeForRefresh as any) &&
          tradeForRefresh.account &&
          this.plugin.accountPageService
        ) {
          try {
            let accounts = tradeForRefresh.account;

            
            if (!Array.isArray(accounts)) {
              accounts = accounts ? [accounts] : [];
            }

            
            if (
              accounts.some(
                (accountName: unknown) =>
                  accountName &&
                  typeof accountName === 'string' &&
                  accountName.trim()
              )
            ) {
              await this.plugin.accountPageService.refreshAccountData();
            }
          } catch (error) {
            console.error(
              'Error refreshing account data from manual trade:',
              error
            );

            const errorMessage =
              error instanceof Error
                ? error.message
                : typeof error === 'string'
                  ? error
                  : 'Unknown error';

            backgroundIssuesStore.captureError(
              {
                key: `FileWatcher:refreshAccountData:${file.path}:${errorMessage}`,
                source: 'FileWatcher',
                level: 'warning',
                message: `Account refresh failed after manual trade (${file.path})`,
              },
              error
            );
          }
        }

        
        if (
          this.settings.showNewTradeNotifications &&
          tradeForNotification?.instrument &&
          tradeForNotification?.direction &&
          !isFromSync
        ) {
          new Notice(
            t('notice.new-trade-created', {
              instrument: tradeForNotification.instrument,
              direction: tradeForNotification.direction,
            })
          );
        }

        
        this.plugin.app.workspace.trigger('journalit:trade-file-added', trade);
      }
    } catch (error) {
      console.error('Error processing new trade file:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Unknown error';

      backgroundIssuesStore.captureError(
        {
          key: `FileWatcher:processNewTradeFile:${file.path}:${errorMessage}`,
          source: 'FileWatcher',
          level: 'error',
          message: `Failed to process trade file (${file.path})`,
        },
        error
      );
    }
  }

  
  async checkForNewTradeFiles(): Promise<void> {
    const tradeFiles = this.plugin.app.vault
      .getMarkdownFiles()
      .filter((file) => this.tradeSyncService.isTradeFile(file));

    for (const file of tradeFiles) {
      if (!this.lastProcessedFiles.has(file.path)) {
        await this.processNewTradeFile(file);
      }
    }
  }

  
  private addFileToTracking(filePath: string): void {
    this.lastProcessedFiles.add(filePath);
    this.fileProcessTimestamps.set(filePath, Date.now());

    
    if (this.lastProcessedFiles.size > this.MAX_TRACKED_FILES) {
      this.performCleanup();
    }
  }

  
  private removeFileFromTracking(filePath: string): void {
    this.lastProcessedFiles.delete(filePath);
    this.fileProcessTimestamps.delete(filePath);
  }

  
  private startPeriodicCleanup(): void {
    
    const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; 

    this.plugin.registerInterval(
      globalThis.setInterval(() => {
        this.performCleanup();
      }, CLEANUP_INTERVAL_MS) as unknown as number
    );
  }

  
  private performCleanup(): void {
    const now = Date.now();
    const filesToRemove: string[] = [];

    
    for (const [filePath, timestamp] of this.fileProcessTimestamps) {
      const age = now - timestamp;

      
      if (age > this.MAX_FILE_AGE_MS) {
        filesToRemove.push(filePath);
        continue;
      }

      
      const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
      if (!file) {
        filesToRemove.push(filePath);
      }
    }

    
    for (const filePath of filesToRemove) {
      this.removeFileFromTracking(filePath);
    }

    
    if (this.lastProcessedFiles.size > this.MAX_TRACKED_FILES) {
      const sortedByAge = Array.from(this.fileProcessTimestamps.entries()).sort(
        (a, b) => a[1] - b[1]
      ); 

      const toRemoveCount =
        this.lastProcessedFiles.size - Math.floor(this.MAX_TRACKED_FILES * 0.8); 

      for (let i = 0; i < toRemoveCount && i < sortedByAge.length; i++) {
        this.removeFileFromTracking(sortedByAge[i][0]);
      }
    }

    if (
      filesToRemove.length > 0 ||
      this.lastProcessedFiles.size > this.MAX_TRACKED_FILES
    ) {
      // intentional
    }
  }

  
  clearProcessedFiles(): void {
    this.lastProcessedFiles.clear();
    this.fileProcessTimestamps.clear();
  }
}
