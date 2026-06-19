import { logger } from '../../utils/logger';


import {
  Notice,
  TFile,
  FileSystemAdapter,
  Platform,
  parseYaml,
} from 'obsidian';
import { t } from '../../lang/helpers';
import {
  BackendIntegrationSettings,
  AccountInfo,
  DEFAULT_SETTINGS,
} from '../../settings/types';
import JournalitPlugin from '../../main';
import { AccountType } from '../account/types';
import { OptionType } from '../options/CustomOptionsService';
import { AccountLinkModalWrapper } from '../../components/account/AccountLinkModal';
import { ApiClient } from './ApiClient';
import { SubscriptionTierService } from './SubscriptionTierService';
import { TradeSyncService } from './TradeSyncService';
import { AccountManagementService } from './AccountManagementService';
import { FTPManagementService } from './FTPManagementService';
import { BackendSecretStorage } from './BackendSecretStorage';
import { FileWatcherService } from './FileWatcherService';
import {
  SyncResponse,
  SyncStatus,
  VaultRegistrationData,
  Trade,
  FTPCredentials,
  TradeSyncMapping,
} from './types';
import { debounceAsync } from '../../utils/debounce';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import { replaceFileContent } from '../../utils/fileMutation';
import {
  ensureTradeIdentityFrontmatter,
  isTradeIdentityEligibleNote,
} from '../../utils/tradeIdentity';
import { FolderPathService } from '../core/FolderPathService';
import { ErrorHandler } from '../../utils/errorHandler';
import { safeParseDateValue } from '../../utils/dateUtils';
import { isTradeOpenWithContext } from '../../utils/tradeStatusUtils';
import { Mutex } from '../../utils/mutex';
import { eventBus } from '../events/EventBus';
import { TradeData } from '../trade/TradeService';
import { formatTradeDateForFilename } from '../trade/core/TradePathPolicy';
import {
  createTradeNotesDocument,
  extractUserOwnedTradeContent,
  mergeGeneratedTradeDocumentWithUserContent,
} from '../trade/core/TradeNoteDocumentCodec';
import { normalizeAccountLookupKey } from '../trade/core/TradeAccountIdentity';
import { deduplicateOptions } from '../../utils/stringNormalization';
import { inferStoredTradeType } from '../../utils/tradeTypeRouting';
import { formatTagForYAML } from '../../utils/tagSchema';


const AUTO_CHECK_INTERVAL_MINUTES = 60;
const ACCOUNT_DISPLAY_NAME_PREFIX_PATTERN = /Account-/;

interface VaultRegistrationResponse {
  vault_id?: string;
  success?: boolean;
  error?: string;
}

interface SimpleApiResult {
  success?: boolean;
  error?: string;
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const asUnknownArray = (value: unknown): unknown[] | null =>
  Array.isArray(value) ? value : null;

const hasOwnRecordKey = (record: object, key: string): boolean =>
  Object.keys(record).includes(key);

function findYamlSeparator(line: string): number {
  return line.search(/:/);
}

interface RelinkRewriteContext {
  newAccountName: string;
  targetLookupKeys: Set<string>;
  tagsToReplace: Set<string>;
  nextAccountTag: string;
}

interface RelinkRollbackSnapshot {
  fileRef: TFile;
  originalPath: string;
  updatedPath: string;
  originalContent: string;
  originalTradeData?: TradeData;
}


export class BackendIntegrationService {
  private plugin: JournalitPlugin;
  private syncIntervalId: number | null = null;
  private authExpiredNoticeShown = false;
  private readonly handleSubscriptionChanged = () => {
    this.reconcileAutoSyncState();
  };
  private readonly handleAuthFailed = () => {
    void this.expireAuthentication();
  };

  
  private get settings(): BackendIntegrationSettings {
    if (!this.plugin.settings.backendIntegration) {
      console.error(
        'BackendIntegrationService: backendIntegration is undefined, using defaults'
      );
      
      this.plugin.settings.backendIntegration = {
        ...DEFAULT_SETTINGS.backendIntegration!,
      };
    }
    return this.plugin.settings.backendIntegration;
  }

  private hasAuthenticatedSyncAccess(): boolean {
    return BackendSecretStorage.hasAuthToken(this.plugin);
  }

  private canRunAutoSync(): boolean {
    return this.settings.syncEnabled && this.hasAuthenticatedSyncAccess();
  }

  private async expireAuthentication(): Promise<void> {
    const hadAuthToken = BackendSecretStorage.hasAuthToken(this.plugin);

    BackendSecretStorage.clearAuthToken(this.plugin);
    this.settings.userEmail = undefined;
    this.settings.subscriptionTier = undefined;
    this.settings.userId = '';

    this.stopAutoSync();

    if (this.syncMutex.isLocked()) {
      this.syncMutex.unlock();
    }
    this.syncCancelled = true;
    this.totalTradesToSync = 0;
    this.tradesProcessedSoFar = 0;
    if (this.autoContinueTimeoutId !== null) {
      window.clearTimeout(this.autoContinueTimeoutId);
      this.autoContinueTimeoutId = null;
    }

    if (hadAuthToken) {
      await this.plugin.saveSettings();
      window.dispatchEvent(new CustomEvent('journalit:subscription-changed'));
    }

    if (!this.authExpiredNoticeShown) {
      this.authExpiredNoticeShown = true;
      new Notice(t('error.session-expired'));
    }
  }

  private reconcileAutoSyncState(): void {
    if (this.canRunAutoSync()) {
      if (!this.syncIntervalId && AUTO_CHECK_INTERVAL_MINUTES > 0) {
        this.startAutoSync();
      }
      return;
    }

    this.stopAutoSync();
  }

  
  private syncMutex: Mutex = new Mutex();
  private syncCancelled: boolean = false;
  private syncedAccountDisplayNameCache: Map<string, string> = new Map();
  private syncedAccountDisplayNameCacheTime: number = 0;
  private readonly SYNC_ACCOUNT_CACHE_TTL = 5 * 60 * 1000;

  
  public getIsSyncing(): boolean {
    return this.syncMutex.isLocked();
  }
  private totalTradesToSync: number = 0;
  private tradesProcessedSoFar: number = 0;
  private autoContinueTimeoutId: number | null = null;

  
  private tradeSyncService: TradeSyncService;
  private accountManagementService: AccountManagementService;
  private ftpManagementService: FTPManagementService;
  private fileWatcherService: FileWatcherService;
  private folderPathService: FolderPathService;

  
  private debouncedForceSync: ((
    isAutoContinue?: boolean,
    isAutomaticCheck?: boolean
  ) => Promise<SyncResponse | null | undefined>) & {
    cancel: () => void;
    flush: () => Promise<SyncResponse | null | undefined>;
  };
  private debouncedCheckForNewTrades: (() => Promise<void | undefined>) & {
    cancel: () => void;
    flush: () => Promise<void | undefined>;
  };

  constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
    
    

    
    
    const authToken = BackendSecretStorage.getAuthToken(plugin);
    if (authToken) {
      ApiClient.setAuthToken(authToken);
    }

    
    this.folderPathService =
      plugin.serviceManager?.getFolderPathService() ||
      new FolderPathService(plugin.app, plugin);
    this.tradeSyncService = new TradeSyncService(
      plugin,
      this.settings,
      this.folderPathService
    );
    this.accountManagementService = new AccountManagementService(
      plugin,
      this.settings
    );
    this.ftpManagementService = new FTPManagementService(plugin, this.settings);
    this.fileWatcherService = new FileWatcherService(
      plugin,
      this.settings,
      this.tradeSyncService
    );

    
    void this.tradeSyncService.loadSyncMapping();

    
    this.fileWatcherService.setupFileWatcher();

    
    
    this.debouncedForceSync = debounceAsync(
      (isAutoContinue?: boolean, isAutomaticCheck?: boolean) =>
        this.forceSync(isAutoContinue, isAutomaticCheck),
      5000 
    );

    
    this.debouncedCheckForNewTrades = debounceAsync(
      () => this.checkForNewTrades(),
      30000 
    );

    window.addEventListener(
      'journalit:subscription-changed',
      this.handleSubscriptionChanged
    );
    window.addEventListener('journalit:auth-failed', this.handleAuthFailed);

    this.reconcileAutoSyncState();
  }

  
  private getUserId(): string {
    try {
      
      const vaultName = this.plugin.app.vault.getName();
      if (vaultName && vaultName !== 'Obsidian Vault') {
        return vaultName.toLowerCase().replace(/[^a-z0-9]/g, '');
      }

      
      const adapter = this.plugin.app.vault.adapter;
      let vaultPath = '';
      if (Platform.isDesktopApp && adapter instanceof FileSystemAdapter) {
        vaultPath = adapter.getBasePath();
      }

      if (!vaultPath) {
        
        return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      }
      const folderName = vaultPath.split(/[/\\]/).pop() || 'unknown';
      return folderName.toLowerCase().replace(/[^a-z0-9]/g, '');
    } catch {
      
      const uniqueUserId = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      return this.settings.userId || uniqueUserId;
    }
  }

  
  private async getVaultIdentifier(): Promise<string> {
    try {
      
      const existingVaultId =
        this.plugin.settings.backendIntegration?.vaultIdentifier;
      if (existingVaultId) {
        return existingVaultId;
      }

      
      const vaultName = this.plugin.app.vault.getName() || 'Unknown';
      const deviceInfo = Platform.isDesktopApp
        ? 'desktop'
        : Platform.isIosApp
          ? 'ios'
          : Platform.isAndroidApp
            ? 'android'
            : Platform.isMobileApp
              ? 'mobile'
              : 'unknown';

      
      const identifier = vaultName + ':' + deviceInfo;
      const hash = await this.hashIdentifier(identifier);
      const vaultId = `vault_${hash.substring(0, 16)}`;

      
      this.settings.vaultIdentifier = vaultId;
      
      
      await this.plugin.saveSettings();

      return vaultId;
    } catch (error) {
      console.warn('Could not generate vault identifier:', error);

      return `vault_${Math.random().toString(36).substring(2, 18)}`;
    }
  }

  private async hashIdentifier(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = new Uint8Array(hashBuffer);
    return Array.from(hashArray)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  
  async registerVault(
    options: { suppressPremiumPrompt?: boolean } = {}
  ): Promise<boolean> {
    
    const preAuthToken = BackendSecretStorage.getAuthToken(this.plugin);
    if (!preAuthToken) {
      
      
      
      

      return false;
    }

    const authToken = preAuthToken;
    
    const userId = this.settings.ftpUsername || this.getUserId();
    const vaultIdentifier = await this.getVaultIdentifier();

    const registrationData: VaultRegistrationData = {
      vault_path: vaultIdentifier,
      user_id: userId,
      settings: {
        date_format: this.plugin.settings.trade.dateFormat,
        enabled: this.settings.syncEnabled,
      },
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const url = ApiClient.buildUrl('/api/v1/obsidian/register-vault');

    const result = await ApiClient.makeRequest<VaultRegistrationResponse>(
      url,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(registrationData),
      },
      'vault registration',
      0,
      {
        suppressPremiumRequiredEvent: options.suppressPremiumPrompt,
      }
    );

    if (result) {
      
      this.settings.userId = userId;
      this.settings.vaultPath = vaultIdentifier;
      await this.plugin.saveSettings();

      if (this.settings.showSyncNotifications) {
        new Notice(t('backend.notice.vault-registered'));
      }
      return true;
    }

    return false;
  }

  
  cancelSync(): void {
    
    if (this.syncMutex.isLocked() && !this.syncCancelled) {
      this.syncCancelled = true;

      
      if (this.autoContinueTimeoutId !== null) {
        window.clearTimeout(this.autoContinueTimeoutId);
        this.autoContinueTimeoutId = null;
      }

      if (this.settings.showSyncNotifications) {
        new Notice(t('backend.notice.sync-cancelled'));
      }
    }
  }

  
  async forceSync(
    isAutoContinue: boolean = false,
    isAutomaticCheck: boolean = false
  ): Promise<SyncResponse | null> {
    if (!this.hasAuthenticatedSyncAccess()) {
      console.warn('Sync skipped: User not authenticated');

      if (isAutoContinue) {
        if (this.syncMutex.isLocked()) {
          this.syncMutex.unlock();
        }
        this.totalTradesToSync = 0;
        this.tradesProcessedSoFar = 0;
        if (this.autoContinueTimeoutId !== null) {
          window.clearTimeout(this.autoContinueTimeoutId);
          this.autoContinueTimeoutId = null;
        }
      } else {
        ErrorHandler.showError(
          new Error('Authentication required'),
          ErrorHandler.createContext('sync', undefined, 401)
        );
      }

      return null;
    }

    const tierRefresh = await new SubscriptionTierService(
      this.plugin
    ).refreshTier(isAutoContinue ? 'trade sync auto-continue' : 'trade sync');

    if (tierRefresh.entitlements?.features.metatraderSync.enabled !== true) {
      if (isAutoContinue) {
        if (this.syncMutex.isLocked()) {
          this.syncMutex.unlock();
        }
        this.totalTradesToSync = 0;
        this.tradesProcessedSoFar = 0;
        if (this.autoContinueTimeoutId !== null) {
          window.clearTimeout(this.autoContinueTimeoutId);
          this.autoContinueTimeoutId = null;
        }
      } else if (isAutomaticCheck) {
        this.stopAutoSync();
      } else if (tierRefresh.status === 'unverified') {
        new Notice(t('premium.gate.offline'));
      } else {
        new Notice(t('trade-sync.gate.pro.description'));
      }

      return null;
    }

    
    if (!isAutoContinue) {
      
      if (!this.syncMutex.tryLock()) {
        new Notice(t('backend.notice.sync-in-progress'));
        return null;
      }

      
      this.totalTradesToSync = 0;
      this.tradesProcessedSoFar = 0;
      this.syncCancelled = false;
    }

    try {
      
      if (!isAutoContinue) {
        try {
          const authToken = BackendSecretStorage.getAuthToken(this.plugin);
          const ftpHeaders: Record<string, string> = {};
          if (authToken) {
            ftpHeaders['Authorization'] = `Bearer ${authToken}`;
          }
          const ftpSyncUrl = ApiClient.buildUrl('/api/v1/sync/ftp');

          const ftpSyncResult = await ApiClient.makeRequest<SimpleApiResult>(
            ftpSyncUrl,
            {
              method: 'POST',
              headers: ftpHeaders,
            },
            'FTP sync trigger'
          );

          if (ftpSyncResult?.success) {
            // intentional
          } else {
            console.warn('FTP sync failed:', ftpSyncResult?.error);
            
          }
        } catch (ftpError) {
          console.warn('Failed to trigger FTP sync:', ftpError);

          
        }
      } 

      
      const accountId = await this.getFTPUserAccountId();
      if (!accountId) {
        new Notice(t('backend.notice.account-info-failed'));

        
        if (!isAutoContinue) {
          this.syncMutex.unlock();
        }

        return null;
      }

      
      const fetchedTrades =
        await this.tradeSyncService.fetchAllTrades(accountId);
      const ignoredAccountIds = new Set(
        (
          await this.accountManagementService.fetchUserAccounts({
            status: 'ignored',
          })
        )
          .map((account) => account.accountId)
          .filter((accountId) => accountId.trim().length > 0)
      );
      const allTrades =
        ignoredAccountIds.size === 0
          ? fetchedTrades
          : fetchedTrades.filter(
              (trade) =>
                !trade.mt_account_number ||
                !ignoredAccountIds.has(trade.mt_account_number)
            );

      
      
      const newTrades: Trade[] = [];
      const BATCH_SIZE = 100; 

      for (let i = 0; i < allTrades.length; i += BATCH_SIZE) {
        const batch = allTrades.slice(i, i + BATCH_SIZE);

        
        const batchResults = [];
        for (const trade of batch) {
          const existingPath =
            this.tradeSyncService.getValidatedFilePathForTrade(trade.id);
          if (existingPath) {
            const file =
              this.plugin.app.vault.getAbstractFileByPath(existingPath);
            if (!file) {
              batchResults.push(trade); 
              continue;
            }

            if (!(file instanceof TFile)) {
              
              batchResults.push(trade);
              continue;
            }

            
            try {
              const frontmatter =
                this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;

              if (frontmatter) {
                const wasOpen = isTradeOpenWithContext({
                  tradeStatus:
                    typeof frontmatter.tradeStatus === 'string'
                      ? frontmatter.tradeStatus
                      : undefined,
                  exitTime:
                    typeof frontmatter.exitTime === 'string'
                      ? frontmatter.exitTime
                      : undefined,
                  exitPrice:
                    typeof frontmatter.exitPrice === 'number'
                      ? frontmatter.exitPrice
                      : undefined,
                  useDirectPnLInput:
                    frontmatter.useDirectPnLInput === true ||
                    frontmatter.useDirectPnLInput === 'true',
                  exits: normalizeExecutionEntries(frontmatter.exits),
                  entries: normalizeExecutionEntries(frontmatter.entries),
                });
                const isNowClosed =
                  trade.status === 'CLOSED' &&
                  (trade.exit_time || trade.useDirectPnLInput === true);

                if (wasOpen && isNowClosed) {
                  batchResults.push(trade); 
                  continue;
                }

                const storedStopLoss = Number(frontmatter.stopLoss);
                const hasBackendStopLoss = trade.stop_loss !== undefined;
                const backendStopLoss = this.normalizeMetaTraderRiskTarget(
                  trade.stop_loss
                );
                if (
                  hasBackendStopLoss &&
                  (backendStopLoss === undefined
                    ? Number.isFinite(storedStopLoss)
                    : !Number.isFinite(storedStopLoss) ||
                      storedStopLoss !== backendStopLoss)
                ) {
                  batchResults.push(trade);
                  continue;
                }

                const hasStoredTakeProfits = hasOwnRecordKey(
                  frontmatter,
                  'takeProfits'
                );
                const takeProfitsValue = asUnknownArray(
                  frontmatter.takeProfits
                );
                const storedTakeProfit = takeProfitsValue
                  ? (() => {
                      const firstTakeProfit = takeProfitsValue[0];
                      return isRecord(firstTakeProfit)
                        ? Number(firstTakeProfit.price)
                        : Number.NaN;
                    })()
                  : Number.NaN;
                const hasBackendTakeProfit = trade.take_profit !== undefined;
                const backendTakeProfit = this.normalizeMetaTraderRiskTarget(
                  trade.take_profit
                );
                if (
                  hasBackendTakeProfit &&
                  (backendTakeProfit === undefined
                    ? hasStoredTakeProfits
                    : !Number.isFinite(storedTakeProfit) ||
                      storedTakeProfit !== backendTakeProfit)
                ) {
                  batchResults.push(trade);
                  continue;
                }

                if (
                  backendStopLoss !== undefined &&
                  this.resolveAssetTypeForSync(trade) === 'forex' &&
                  !Number.isFinite(Number(frontmatter.lotSize))
                ) {
                  batchResults.push(trade);
                  continue;
                }
              }
            } catch (error) {
              console.warn(
                `Error checking trade ${trade.id} for updates:`,
                error
              );
            }

            
            continue;
          }

          batchResults.push(trade); 
        }

        newTrades.push(...batchResults);

        
        if (i + BATCH_SIZE < allTrades.length) {
          await new Promise((resolve) => window.setTimeout(resolve, 0));
        }
      }

      
      if (this.totalTradesToSync === 0) {
        this.totalTradesToSync = newTrades.length;
      }

      
      const MAX_TRADES_PER_SYNC = 500; 
      const trades =
        newTrades.length > MAX_TRADES_PER_SYNC
          ? newTrades.slice(0, MAX_TRADES_PER_SYNC)
          : newTrades;

      const hasMoreToSync = newTrades.length > MAX_TRADES_PER_SYNC;

      if (hasMoreToSync) {
        const remainingCount = newTrades.length - MAX_TRADES_PER_SYNC;
        if (this.settings.showSyncNotifications) {
          const progressPct = Math.round(
            (this.tradesProcessedSoFar / this.totalTradesToSync) * 100
          );
          new Notice(
            t('backend.notice.sync-batch-progress', {
              count: String(MAX_TRADES_PER_SYNC),
              progress: String(progressPct),
              remaining: String(remainingCount),
            })
          );
        }
      } else if (newTrades.length === 0 && allTrades.length > 0) {
        if (this.settings.showSyncNotifications) {
          new Notice(
            t('backend.notice.all-trades-synced', {
              count: String(allTrades.length),
            })
          );
        }
      }

      
      await this.tradeSyncService.buildTradeFileCache();

      
      const errors: string[] = [];

      
      if (this.syncCancelled) {
        if (!isAutoContinue) {
          this.syncMutex.unlock();
        }
        return null;
      }

      
      const detectedAccounts = new Set<string>();
      for (const trade of trades) {
        
        if (
          trade.mt_account_number &&
          typeof trade.mt_account_number === 'string'
        ) {
          detectedAccounts.add(trade.mt_account_number);
        }
      }

      
      const newAccounts =
        this.accountManagementService.checkForNewAccounts(detectedAccounts);

      
      if (newAccounts.length > 0) {
        const tradeSampleByAccountId = new Map<string, Trade>();
        for (const trade of trades) {
          if (
            trade.mt_account_number &&
            typeof trade.mt_account_number === 'string' &&
            !tradeSampleByAccountId.has(trade.mt_account_number)
          ) {
            tradeSampleByAccountId.set(trade.mt_account_number, trade);
          }
        }

        for (const newAccountId of newAccounts) {
          
          const tradeSample = tradeSampleByAccountId.get(newAccountId);
          const defaultDisplayName =
            tradeSample?.mt_account_display_name || `Account-${newAccountId}`;

          const accountInfo: AccountInfo = {
            accountId: newAccountId,
            displayName: defaultDisplayName,
            brokerName: 'MetaTrader', 
            firstSeen: tradeSample?.entry_time || new Date().toISOString(),
          };

          
          const userDecision = await new Promise<{
            action: 'create' | 'link' | 'default' | 'cancel';
            displayName?: string;
            linkToPath?: string;
            accountType?: string;
          }>((resolve) => {
            const modal = new AccountLinkModalWrapper(
              this.plugin.app,
              accountInfo,
              async (
                accountId: string,
                displayName: string,
                linkToExisting?: string,
                accountType?: string
              ) => {
                if (linkToExisting) {
                  resolve({ action: 'link', linkToPath: linkToExisting });
                } else if (displayName && displayName !== defaultDisplayName) {
                  resolve({ action: 'create', displayName, accountType });
                } else {
                  resolve({ action: 'default', accountType });
                }
              },
              () => {
                
                resolve({ action: 'cancel' });
              }
            );
            modal.open();
          });

          
          if (userDecision.action === 'cancel') {
            
            continue;
          }

          let finalDisplayName = defaultDisplayName;

          if (userDecision.action === 'link' && userDecision.linkToPath) {
            
            
            await this.accountManagementService.createAccountMapping(
              newAccountId,
              userDecision.linkToPath
            );
            continue; 
          } else if (
            userDecision.action === 'create' &&
            userDecision.displayName
          ) {
            finalDisplayName = userDecision.displayName;
          }

          
          await this.accountManagementService.createAccountMapping(
            newAccountId,
            finalDisplayName
          );

          
          if (this.plugin.accountPageService) {
            try {
              accountInfo.displayName = finalDisplayName;
              
              const availableAccountTypes =
                this.plugin.optionsService?.getOptions(
                  OptionType.ACCOUNT_TYPE
                ) || [];
              const defaultAccountType =
                availableAccountTypes.length > 0
                  ? availableAccountTypes[0]
                  : AccountType.DEMO;

              await this.plugin.accountPageService.updateAccountMetadata(
                finalDisplayName,
                {
                  name: finalDisplayName,
                  accountType: userDecision.accountType || defaultAccountType,
                  createdDate: new Date(),
                  initialBalance: 0, 
                }
              );

              if (this.settings.showSyncNotifications) {
                new Notice(
                  t('backend.notice.account-created', {
                    name: finalDisplayName,
                  })
                );
              }
            } catch (error) {
              console.error(
                `Failed to create Account metadata for ${newAccountId}:`,
                error
              );
              errors.push(
                `Failed to create account ${finalDisplayName}: ${getErrorMessage(error)}`
              );
            }
          }
        }
      }

      
      let newFiles = 0;
      let updatedFiles = 0;

      for (let i = 0; i < trades.length; i++) {
        const trade = trades[i];
        try {
          const tradeStartTime = Date.now();
          const result = await this.createTradeFile(trade);
          const tradeTime = Date.now() - tradeStartTime;

          if (result === 'created') {
            newFiles++;
          } else if (result === 'updated') {
            updatedFiles++;
          } else if (result === 'skipped') {
            // intentional
          }

          
          if (tradeTime > 1000) {
            console.warn(
              `Slow trade processing: ${trade.symbol} ${trade.id} took ${tradeTime}ms (result: ${result})`
            );
          }
        } catch (error) {
          errors.push(
            `Failed to create file for trade ${trade.id}: ${getErrorMessage(error)}`
          );
          console.error(`Failed to create file for trade ${trade.id}:`, error);
        }
      }

      
      this.settings.lastSyncTime = new Date().toISOString();
      this.settings.syncCount = (this.settings.syncCount || 0) + 1;
      await this.plugin.saveSettings();

      
      if (this.plugin.accountPageService && trades.length > 0) {
        try {
          const accountRefreshStartTime = Date.now();

          
          this.tradeSyncService.clearTradeFileCache();

          
          const accountNames = new Set<string>();
          for (const trade of trades) {
            if (trade.mt_account_number) {
              const accountName =
                trade.mt_account_display_name ||
                this.accountManagementService.getAccountDisplayName(
                  trade.mt_account_number
                ) ||
                `Account-${trade.mt_account_number}`;
              accountNames.add(accountName);
            } else {
              
              console.warn(
                `Trade ${trade.id} missing mt_account_number - using fallback account name`
              );
              accountNames.add('Unknown Account');
            }
          }

          logger.debug(
            `Batch refreshing ${accountNames.size} accounts after sync of ${trades.length} trades`
          );

          
          await this.plugin.accountPageService.refreshAccountData();

          const accountRefreshTime = Date.now() - accountRefreshStartTime;
          logger.debug(
            `Account refresh completed in ${accountRefreshTime}ms for ${accountNames.size} accounts`
          );

          
          eventBus.publish('account:changed', {
            action: 'batch-updated',
            accountNames: Array.from(accountNames),
          });
        } catch (error) {
          console.error(
            'Error recalculating account metrics after sync:',
            error
          );
          errors.push(
            `Failed to recalculate metrics: ${getErrorMessage(error)}`
          );
        }
      }

      
      this.tradesProcessedSoFar += trades.length;

      const syncResponse: SyncResponse = {
        status: 'success',
        synced_trades: trades.length,
        new_files: newFiles,
        updated_files: updatedFiles,
        errors: errors,
      };

      
      if (hasMoreToSync && !this.syncCancelled) {
        
        if (this.settings.showSyncNotifications) {
          const progressPct = Math.round(
            (this.tradesProcessedSoFar / this.totalTradesToSync) * 100
          );
          new Notice(
            t('backend.notice.batch-complete', {
              processed: String(this.tradesProcessedSoFar),
              total: String(this.totalTradesToSync),
              progress: String(progressPct),
            })
          );
        }

        
        this.autoContinueTimeoutId = window.setTimeout(() => {
          
          const timeoutId = this.autoContinueTimeoutId;
          this.autoContinueTimeoutId = null;

          
          if (!this.syncCancelled && timeoutId !== null) {
            logger.debug('Auto-continuing sync with next batch...');
            this.forceSync(true).catch((error) => {
              console.error('Auto-continue sync failed:', error);
              
              this.syncMutex.unlock();
              this.totalTradesToSync = 0;
              this.tradesProcessedSoFar = 0;
            });
          }
        }, 1000);

        return syncResponse;
      }

      
      if (this.settings.showSyncNotifications) {
        if (trades.length > 0 || this.tradesProcessedSoFar > 0) {
          const totalProcessed =
            this.tradesProcessedSoFar > 0
              ? this.tradesProcessedSoFar
              : trades.length;
          const accountCount = new Set(
            trades.map((tr) => tr.mt_account_number).filter((id) => id != null)
          ).size;
          new Notice(
            t('backend.notice.sync-complete', {
              total: String(totalProcessed),
              newFiles: String(newFiles),
              updated: String(updatedFiles),
              accounts: String(accountCount),
            })
          );
        } else {
          new Notice(t('backend.notice.sync-complete-no-trades'));
        }
      }

      
      this.totalTradesToSync = 0;
      this.tradesProcessedSoFar = 0;
      this.syncMutex.unlock();

      return syncResponse;
    } catch (error) {
      console.error('Force sync failed:', error);
      new Notice(
        t('backend.notice.sync-failed', { error: getErrorMessage(error) })
      );

      
      
      if (this.syncMutex.isLocked()) {
        this.syncMutex.unlock();
      }
      this.totalTradesToSync = 0;
      this.tradesProcessedSoFar = 0;
      if (this.autoContinueTimeoutId !== null) {
        window.clearTimeout(this.autoContinueTimeoutId);
        this.autoContinueTimeoutId = null;
      }

      return null;
    }
  }

  
  async getSyncStatus(): Promise<SyncStatus | null> {
    
    const url = ApiClient.buildUrl('/api/v1/obsidian/status');
    const result = await ApiClient.makeRequest<SyncStatus>(
      url,
      {
        method: 'GET',
        headers: {
          'x-endpoint': '/api/v1/obsidian/status', 
        },
      },
      'sync status'
    );

    if (result) {
      return result;
    }

    return null;
  }

  
  async checkForNewTrades(): Promise<void> {
    if (!this.settings.syncEnabled) {
      return;
    }

    if (!this.canRunAutoSync()) {
      this.reconcileAutoSyncState();
      return;
    }

    try {
      
      
      await this.forceSync(false, true);
    } catch (error) {
      console.error('Check for new trades failed:', error);

      
      throw error;
    }
  }

  
  private startAutoSync(): void {
    if (this.syncIntervalId) {
      window.clearInterval(this.syncIntervalId);
    }

    const intervalMs = AUTO_CHECK_INTERVAL_MINUTES * 60 * 1000;
    this.syncIntervalId = this.plugin.registerInterval(
      window.setInterval(() => {
        
        void this.debouncedCheckForNewTrades();
      }, intervalMs)
    );
  }

  
  private stopAutoSync(): void {
    if (this.syncIntervalId) {
      window.clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }

    
    this.debouncedForceSync.cancel();
    this.debouncedCheckForNewTrades.cancel();
  }

  
  async updateSettings(
    newSettings: Partial<BackendIntegrationSettings>
  ): Promise<void> {
    const oldSettings = { ...this.settings };
    Object.assign(this.settings, newSettings);

    
    
    await this.plugin.saveSettings();

    if (oldSettings.syncEnabled !== this.settings.syncEnabled) {
      this.stopAutoSync();
    }

    this.reconcileAutoSyncState();
  }

  
  private async getFTPUserAccountId(): Promise<number | null> {
    
    if (this.settings.ftpUserId) {
      return this.settings.ftpUserId;
    }

    
    const ftpUsername = this.settings.ftpUsername;
    if (ftpUsername) {
      const credentials =
        await this.ftpManagementService.getFTPCredentials(ftpUsername);
      if (credentials && credentials.user_id) {
        
        this.settings.ftpUserId = credentials.user_id;
        await this.updateSettings({ ftpUserId: credentials.user_id });
        return credentials.user_id;
      }
    }

    console.error(
      'Could not determine FTP user account ID. FTP username:',
      ftpUsername
    );

    return null;
  }

  private async backfillSyncedTradeIdentity(
    abstractFile: TFile,
    backendTradeId: number
  ): Promise<void> {
    const currentContent = await this.plugin.app.vault.read(abstractFile);
    const currentTrade = this.tradeSyncService.parseTradeFromMarkdown(
      currentContent,
      abstractFile.path
    );

    if (
      !currentTrade ||
      (currentTrade.backendTradeId &&
        currentTrade.tradeId &&
        currentTrade.schemaVersion)
    ) {
      return;
    }

    let frontmatterUpdated = false;

    await this.plugin.app.fileManager.processFrontMatter(
      abstractFile,
      (frontmatter) => {
        if (!isRecord(frontmatter)) return;
        const frontmatterRecord = frontmatter;
        if (isTradeIdentityEligibleNote(frontmatterRecord, abstractFile.path)) {
          const identityResult =
            ensureTradeIdentityFrontmatter(frontmatterRecord);
          frontmatterUpdated = frontmatterUpdated || identityResult.changed;
        }
        if (
          isTradeIdentityEligibleNote(frontmatterRecord, abstractFile.path) &&
          !frontmatterRecord.backendTradeId
        ) {
          frontmatterRecord.backendTradeId = backendTradeId;
          frontmatterUpdated = true;
        }
      }
    );

    if (frontmatterUpdated) {
      await forceMetadataCacheRefresh(this.plugin.app, abstractFile);
      eventBus.publish('trade:changed', {
        action: 'updated',
        filePaths: [abstractFile.path],
      });
    }
  }

  private parseFrontmatterForRelink(
    content: string
  ): Record<string, unknown> | undefined {
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) {
      return undefined;
    }

    if (typeof parseYaml === 'function') {
      try {
        const parsed: unknown = parseYaml(frontmatterMatch[1]);
        if (isRecord(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.warn(
          'Failed to parse trade frontmatter during relink/update',
          error
        );
      }
    }

    const frontmatter: Record<string, unknown> = {};
    const lines = frontmatterMatch[1].split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const colonIndex = findYamlSeparator(line);
      if (colonIndex === -1) {
        continue;
      }

      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      if (!key || !value) {
        continue;
      }

      if (/^[>|][-+]?$/u.test(value)) {
        const blockLines: string[] = [];
        let nextIndex = index + 1;

        while (nextIndex < lines.length) {
          const blockLine = lines[nextIndex];

          if (/^\s/.test(blockLine)) {
            blockLines.push(blockLine.replace(/^\s{1,2}/u, ''));
            nextIndex += 1;
            continue;
          }

          if (blockLine === '') {
            blockLines.push('');
            nextIndex += 1;
            continue;
          }

          break;
        }

        frontmatter[key] = blockLines.join('\n').trim();
        index = nextIndex - 1;
        continue;
      }

      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.substring(1, value.length - 1).trim();
        frontmatter[key] = arrayContent
          ? arrayContent.split(',').map((item) => item.trim())
          : [];
      } else {
        frontmatter[key] = value;
      }
    }

    return frontmatter;
  }

  private getExistingTradeFrontmatter(
    currentContent: string,
    file: TFile
  ): Record<string, unknown> | null {
    const existingFrontmatterFromContent =
      this.parseFrontmatterForRelink(currentContent) ?? null;

    if (existingFrontmatterFromContent) {
      return existingFrontmatterFromContent;
    }

    const metadataCache = this.plugin.app.metadataCache;
    const existingFrontmatterCache =
      typeof metadataCache?.getFileCache === 'function'
        ? metadataCache.getFileCache(file)?.frontmatter
        : undefined;

    if (
      existingFrontmatterCache &&
      typeof existingFrontmatterCache === 'object'
    ) {
      return {
        ...existingFrontmatterCache,
      } as Record<string, unknown>;
    }

    return null;
  }

  private normalizeBackendMTComment(comment: unknown): string | undefined {
    if (typeof comment !== 'string') {
      return undefined;
    }

    const trimmed = comment.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private normalizeMetaTraderRiskTarget(
    value: number | null | undefined
  ): number | undefined {
    return value !== undefined && value !== null && value !== 0
      ? value
      : undefined;
  }

  private normalizeStoredMTComment(comment: unknown): string | undefined {
    const trimmed = this.normalizeBackendMTComment(comment);
    if (!trimmed) {
      return undefined;
    }

    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (typeof parsed === 'string') {
          return this.normalizeBackendMTComment(parsed);
        }
      } catch {
        // intentional
      }
    }

    if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
      return this.normalizeBackendMTComment(
        trimmed.slice(1, -1).replace(/''/g, "'")
      );
    }

    return trimmed;
  }

  private normalizeStringList(values?: string[]): string[] {
    if (!values?.length) {
      return [];
    }

    return deduplicateOptions(
      values.map((value) => value.trim()).filter(Boolean)
    );
  }

  private normalizeImageList(values?: string[]): string[] {
    if (!values?.length) {
      return [];
    }

    const normalized: string[] = [];
    const seen = new Set<string>();

    for (const rawValue of values) {
      const cleaned = rawValue.trim().replace(/^['"`]+|['"`]+$/g, '');
      if (!cleaned) {
        continue;
      }

      const dedupeKey = cleaned.toLowerCase();
      if (seen.has(dedupeKey)) {
        continue;
      }

      seen.add(dedupeKey);
      normalized.push(cleaned);
    }

    return normalized;
  }

  private resolveAssetTypeForSync(trade: Trade): TradeData['assetType'] {
    if (trade.assetType) {
      return trade.assetType;
    }

    const upperSymbol = trade.symbol.toUpperCase();

    if (
      upperSymbol.includes('/') ||
      (upperSymbol.length === 6 &&
        this.isForexCurrency(upperSymbol.substring(0, 3)) &&
        this.isForexCurrency(upperSymbol.substring(3, 6)))
    ) {
      return 'forex';
    }

    if (
      upperSymbol.endsWith('USDT') ||
      upperSymbol.endsWith('BTC') ||
      upperSymbol.endsWith('ETH') ||
      upperSymbol.includes('CRYPTO')
    ) {
      return 'crypto';
    }

    if (
      /[0-9]/.test(upperSymbol) &&
      (upperSymbol.startsWith('ES') ||
        upperSymbol.startsWith('NQ') ||
        upperSymbol.startsWith('CL') ||
        upperSymbol.startsWith('GC'))
    ) {
      return 'futures';
    }

    return 'stock';
  }

  private isForexCurrency(code: string): boolean {
    return ['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'].includes(
      code
    );
  }

  private async ensureSyncedInstrumentOption(
    symbol: string,
    assetType: NonNullable<TradeData['assetType']>
  ): Promise<void> {
    if (!symbol.trim()) {
      return;
    }

    const optionsService = this.plugin.optionsService;
    if (!optionsService) {
      return;
    }

    const existingInstruments =
      optionsService.getInstrumentsForAssetType(assetType);
    if (
      existingInstruments.some(
        (instrument) => instrument.toLowerCase() === symbol.toLowerCase()
      )
    ) {
      return;
    }

    try {
      await optionsService.addOption(OptionType.INSTRUMENT, symbol, assetType);
    } catch (error) {
      console.error(
        `[BackendIntegrationService] Failed to register synced instrument "${symbol}" (${assetType})`,
        error
      );
    }
  }

  private async refreshSyncedAccountDisplayNameCache(): Promise<void> {
    const now = Date.now();

    if (
      this.syncedAccountDisplayNameCacheTime > 0 &&
      now - this.syncedAccountDisplayNameCacheTime < this.SYNC_ACCOUNT_CACHE_TTL
    ) {
      return;
    }

    this.syncedAccountDisplayNameCache.clear();

    const accountMapping =
      this.plugin.settings.backendIntegration?.accountMapping;
    if (accountMapping) {
      for (const [mtAccountId, displayName] of Object.entries(accountMapping)) {
        this.syncedAccountDisplayNameCache.set(mtAccountId, displayName);
      }
    }

    if (this.plugin.accountPageService) {
      try {
        const allAccounts =
          await this.plugin.accountPageService.getAllEnhancedAccounts();
        for (const account of allAccounts) {
          const displayName = account.accountName || account.name || account.id;
          if (!displayName) {
            continue;
          }

          if (
            account.id &&
            !this.syncedAccountDisplayNameCache.has(account.id)
          ) {
            this.syncedAccountDisplayNameCache.set(account.id, displayName);
          }

          if (ACCOUNT_DISPLAY_NAME_PREFIX_PATTERN.test(displayName)) {
            const mtNumber = displayName.replace('Account-', '');
            if (
              /^\d+$/.test(mtNumber) &&
              !this.syncedAccountDisplayNameCache.has(mtNumber)
            ) {
              this.syncedAccountDisplayNameCache.set(mtNumber, displayName);
            }
          }
        }
      } catch (error) {
        console.warn(
          '[BackendIntegrationService] Failed to refresh synced account cache from AccountPageService:',
          error
        );
      }
    }

    this.syncedAccountDisplayNameCacheTime = now;
  }

  private invalidateSyncedAccountDisplayNameCache(): void {
    this.syncedAccountDisplayNameCache.clear();
    this.syncedAccountDisplayNameCacheTime = 0;
  }

  private async resolveSyncedAccountDisplayName(
    mtAccountNumber: string | undefined,
    fallbackDisplayName?: string
  ): Promise<string> {
    if (!mtAccountNumber) {
      return fallbackDisplayName || 'Unknown Account';
    }

    await this.refreshSyncedAccountDisplayNameCache();

    const cachedDisplayName =
      this.syncedAccountDisplayNameCache.get(mtAccountNumber);
    if (cachedDisplayName) {
      return cachedDisplayName;
    }

    return (
      fallbackDisplayName ||
      this.accountManagementService.getAccountDisplayName(mtAccountNumber) ||
      `Account-${mtAccountNumber}`
    );
  }

  private async mapBackendTradeToTradeData(
    trade: Trade,
    currentTrade?: { tradeId?: unknown; schemaVersion?: unknown }
  ): Promise<TradeData> {
    const entryTime = safeParseDateValue(trade.entry_time);
    if (!entryTime) {
      throw new Error(
        `Invalid entry_time for trade ${trade.id}: ${trade.entry_time}`
      );
    }

    const backendMarkedClosed = trade.status === 'CLOSED';
    const useDirectPnLInput = trade.useDirectPnLInput === true;
    const parsedExitTime = trade.exit_time
      ? safeParseDateValue(trade.exit_time) || undefined
      : undefined;

    if (backendMarkedClosed && !parsedExitTime && !useDirectPnLInput) {
      console.warn(
        `[BackendIntegrationService] Backend marked trade ${trade.id} as CLOSED without a valid exit_time; syncing as OPEN because no direct-PnL close signal is available.`
      );
    }

    const hasExitPrice =
      trade.exit_price !== undefined && trade.exit_price !== null;
    if (
      backendMarkedClosed &&
      !useDirectPnLInput &&
      !!parsedExitTime &&
      !hasExitPrice
    ) {
      console.warn(
        `[BackendIntegrationService] Backend marked trade ${trade.id} as CLOSED with exit_time but missing exit_price; syncing as OPEN to satisfy canonical validation.`
      );
    }

    const tradeStatus: 'OPEN' | 'CLOSED' =
      backendMarkedClosed &&
      (useDirectPnLInput || (!!parsedExitTime && hasExitPrice))
        ? 'CLOSED'
        : 'OPEN';
    const direction =
      trade.direction.toUpperCase() === 'SELL' ? 'short' : 'long';
    const assetType = this.resolveAssetTypeForSync(trade);

    const accountDisplayName = await this.resolveSyncedAccountDisplayName(
      trade.mt_account_number,
      trade.mt_account_display_name
    );
    const fallbackName =
      accountDisplayName ||
      (trade.mt_account_number
        ? `Account-${trade.mt_account_number}`
        : 'Unknown Account');

    const account = [fallbackName];
    const accountId = trade.mt_account_number || undefined;

    const setupNames = this.normalizeStringList(
      trade.setup ?? trade.setupIds ?? []
    );
    const mistakeNames = this.normalizeStringList(
      trade.mistake ?? trade.mistakeIds ?? []
    );
    const tags = this.normalizeStringList(trade.tags);
    const images = this.normalizeImageList(trade.images);

    const entries = (
      trade.entries?.length
        ? trade.entries
        : [
            {
              time: trade.entry_time,
              price: trade.entry_price,
              size: trade.volume,
            },
          ]
    )
      .map((entry) => {
        const parsedTime = safeParseDateValue(entry.time);
        if (!parsedTime) {
          return null;
        }

        return {
          time: parsedTime,
          price: entry.price,
          size: entry.size,
        };
      })
      .filter(
        (entry): entry is { time: Date; price: number; size: number } =>
          entry !== null
      );

    const exits =
      tradeStatus === 'CLOSED' &&
      trade.exit_time &&
      trade.exit_price !== undefined
        ? (trade.exits?.length
            ? trade.exits
            : [
                {
                  time: trade.exit_time,
                  price: trade.exit_price,
                  size: trade.volume,
                },
              ]
          )
            .map((exit) => {
              const parsedTime = safeParseDateValue(exit.time);
              if (!parsedTime) {
                return null;
              }

              return {
                time: parsedTime,
                price: exit.price,
                size: exit.size,
              };
            })
            .filter(
              (exit): exit is { time: Date; price: number; size: number } =>
                exit !== null
            )
        : [];

    const hasBackendStopLoss = trade.stop_loss !== undefined;
    const hasBackendTakeProfit = trade.take_profit !== undefined;
    const stopLoss = this.normalizeMetaTraderRiskTarget(trade.stop_loss);
    const takeProfit = this.normalizeMetaTraderRiskTarget(trade.take_profit);

    const mapped: TradeData = {
      backendTradeId: trade.id,
      executionLedgerVersion: trade.executionLedgerVersion,
      executionIds: trade.executionIds,
      entryTime,
      exitTime: parsedExitTime,
      entryPrice: trade.entry_price,
      exitPrice: trade.exit_price,
      positionSize: trade.volume,
      direction,
      instrument: trade.symbol,
      assetType,
      tradeStatus,
      accountId,
      account,
      setupIds: [],
      setup: [...setupNames],
      mistake: [...mistakeNames],
      tags,
      customTags: [...tags],
      images,
      thesis: trade.thesis?.trim() || '',
      notes: trade.notes?.trim(),
      mtComment: this.normalizeBackendMTComment(trade.mt_comment),
      entries,
      exits,
      commission: trade.commission ?? 0,
      hasExplicitCommission: true,
      commissionType: 'fixed',
      swap: trade.swap ?? 0,
      fees: trade.fees ?? 0,
      ...(hasBackendStopLoss && { stopLoss }),
      ...(hasBackendTakeProfit && {
        takeProfits:
          takeProfit !== undefined
            ? [{ price: takeProfit, closePercent: 100 }]
            : [],
      }),
      currency: trade.currency,
      customFields: trade.customFields,
      useDirectPnLInput,
      directPnL: useDirectPnLInput
        ? (trade.directPnL ?? trade.profit_loss)
        : undefined,
      originalPnl: trade.profit_loss,
      authoritativePnl:
        tradeStatus === 'CLOSED' && trade.profit_loss !== undefined
          ? trade.profit_loss
          : undefined,
      contractSize:
        assetType === 'options'
          ? (trade.contractSize ?? 100)
          : trade.contractSize,
      strikePrice: trade.strikePrice,
      expirationDate: trade.expirationDate
        ? safeParseDateValue(trade.expirationDate) || undefined
        : undefined,
      optionType: trade.optionType,
      dollarPerPoint: trade.dollarPerPoint,
      tickSize: trade.tickSize,
      tickValue: trade.tickValue,
      lotSize:
        assetType === 'forex' ? (trade.lotSize ?? 100000) : trade.lotSize,
      pipValue: trade.pipValue,
    };

    const existingTradeId =
      currentTrade && typeof currentTrade.tradeId === 'string'
        ? currentTrade.tradeId.trim()
        : '';
    const backendTradeId =
      typeof trade.tradeId === 'string' ? trade.tradeId.trim() : '';
    if (existingTradeId) {
      mapped.tradeId = existingTradeId;
    } else if (backendTradeId) {
      mapped.tradeId = backendTradeId;
    }

    if (
      currentTrade &&
      typeof currentTrade.schemaVersion === 'number' &&
      Number.isFinite(currentTrade.schemaVersion)
    ) {
      mapped.schemaVersion = currentTrade.schemaVersion;
    } else {
      const backendSchemaVersion =
        typeof trade.schemaVersion === 'number'
          ? trade.schemaVersion
          : typeof trade.schemaVersion === 'string' &&
              trade.schemaVersion.trim() !== ''
            ? Number(trade.schemaVersion)
            : undefined;

      if (
        typeof backendSchemaVersion === 'number' &&
        Number.isFinite(backendSchemaVersion) &&
        backendSchemaVersion > 0
      ) {
        mapped.schemaVersion = backendSchemaVersion;
      }
    }

    return mapped;
  }

  private async migrateLegacySyncedNoteBody(
    filePath: string,
    backendNotes?: string
  ): Promise<void> {
    const abstractFile = this.plugin.app.vault.getAbstractFileByPath(filePath);
    if (!(abstractFile instanceof TFile)) {
      return;
    }

    const currentContent = await this.plugin.app.vault.read(abstractFile);
    if (currentContent.includes('# Trade Notes')) {
      return;
    }

    const frontmatterMatch = currentContent.match(
      /^---\r?\n([\s\S]*?)\r?\n---/
    );
    if (!frontmatterMatch) {
      return;
    }

    const preservedUserContent = extractUserOwnedTradeContent(currentContent);
    const shouldDiscardLegacyGeneratedNotes =
      !!backendNotes &&
      preservedUserContent.includes('<!-- Legacy Generated Notes -->');

    const canonicalDocument = createTradeNotesDocument(
      frontmatterMatch[0],
      backendNotes?.trim() || undefined
    );
    const mergedDocument = mergeGeneratedTradeDocumentWithUserContent(
      canonicalDocument,
      shouldDiscardLegacyGeneratedNotes ? '' : preservedUserContent
    );

    if (mergedDocument === currentContent) {
      return;
    }

    await replaceFileContent(this.plugin.app, abstractFile, mergedDocument);
    await forceMetadataCacheRefresh(this.plugin.app, abstractFile);
  }

  
  private async createTradeFile(
    trade: Trade
  ): Promise<'created' | 'updated' | 'skipped'> {
    
    const existingPath = this.tradeSyncService.getValidatedFilePathForTrade(
      trade.id
    );

    if (existingPath) {
      const existingFile =
        this.plugin.app.vault.getAbstractFileByPath(existingPath);
      if (existingFile instanceof TFile) {
        await this.backfillSyncedTradeIdentity(existingFile, trade.id);
        return await this.updateExistingTradeFile(existingFile, trade);
      }
    }

    
    const entryTime = safeParseDateValue(trade.entry_time);
    if (!entryTime) {
      console.error(
        `Invalid entry_time for trade ${trade.id}: ${trade.entry_time}`
      );
      return 'skipped';
    }

    const dateStr = formatTradeDateForFilename(
      entryTime,
      this.plugin.settings.trade.dateFormat || 'DDMMYY'
    );

    const possiblePath = await this.tradeSyncService.findExistingTradeFile(
      trade,
      dateStr,
      entryTime
    );
    if (possiblePath) {
      this.tradeSyncService.addMapping(trade.id, possiblePath);
      const saved = await this.tradeSyncService.saveSyncMapping();
      if (!saved) {
        console.warn(`Failed to save mapping for trade ${trade.id}`);
      }

      const abstractFile =
        this.plugin.app.vault.getAbstractFileByPath(possiblePath);
      if (!(abstractFile instanceof TFile)) {
        throw new Error(`Failed to locate trade file at path: ${possiblePath}`);
      }
      await this.backfillSyncedTradeIdentity(abstractFile, trade.id);

      return await this.updateExistingTradeFile(abstractFile, trade);
    }

    const tradeService = this.plugin.tradeService;
    if (!tradeService) {
      throw new Error('TradeService is unavailable during backend sync');
    }

    const tradeData = await this.mapBackendTradeToTradeData(trade);
    if (tradeData.instrument && tradeData.assetType) {
      await this.ensureSyncedInstrumentOption(
        tradeData.instrument,
        tradeData.assetType
      );
    }

    const filePath = await tradeService.createTrade(tradeData, {
      suppressAutoOpen: true,
      deferPostCreateTasks: true,
    });

    this.tradeSyncService.addMapping(trade.id, filePath);
    const saved = await this.tradeSyncService.saveSyncMapping();
    if (!saved) {
      console.warn(`Failed to save mapping for trade ${trade.id}`);
    }

    return 'created';
  }

  
  private async updateExistingTradeFile(
    file: TFile,
    trade: Trade
  ): Promise<'updated' | 'skipped'> {
    const currentContent = await this.plugin.app.vault.read(file);
    const existingFrontmatter = this.getExistingTradeFrontmatter(
      currentContent,
      file
    );
    const currentTrade = this.tradeSyncService.parseTradeFromMarkdown(
      currentContent,
      file.path
    );

    if (!currentTrade) {
      console.warn('Could not parse current trade from markdown');
      return 'skipped';
    }

    const wasOpen = isTradeOpenWithContext({
      tradeStatus: currentTrade.tradeStatus,
      exitTime: currentTrade.exitTime,
      exitPrice: currentTrade.exitPrice
        ? Number(currentTrade.exitPrice)
        : undefined,
      useDirectPnLInput:
        currentTrade.useDirectPnLInput === true ||
        currentTrade.useDirectPnLInput === 'true',
      exits: currentTrade.exits,
      entries: currentTrade.entries,
    });
    const isNowClosed =
      trade.status === 'CLOSED' &&
      (trade.exit_time || trade.useDirectPnLInput === true);
    const currentMTComment = this.normalizeStoredMTComment(
      existingFrontmatter?.mtComment
    );
    const nextMTComment = this.normalizeBackendMTComment(trade.mt_comment);
    const mtCommentChanged = currentMTComment !== nextMTComment;

    if (wasOpen && isNowClosed) {
      const tradeService = this.plugin.tradeService;
      if (!tradeService) {
        throw new Error('TradeService is unavailable during backend sync');
      }

      const tradeData = await this.mapBackendTradeToTradeData(
        trade,
        currentTrade
      );
      if (tradeData.instrument && tradeData.assetType) {
        await this.ensureSyncedInstrumentOption(
          tradeData.instrument,
          tradeData.assetType
        );
      }

      const updatedPath = await tradeService.updateTrade(
        tradeData,
        file.path,
        'backend-sync'
      );

      if (updatedPath !== file.path) {
        this.tradeSyncService.addMapping(trade.id, updatedPath);
        const saved = await this.tradeSyncService.saveSyncMapping();
        if (!saved) {
          console.warn(
            `Failed to save relocated mapping for trade ${trade.id}`
          );
        }
      }

      await this.migrateLegacySyncedNoteBody(updatedPath, trade.notes);

      return 'updated';
    }

    const hasBackendStopLoss = trade.stop_loss !== undefined;
    const hasBackendTakeProfit = trade.take_profit !== undefined;
    const backendStopLoss = this.normalizeMetaTraderRiskTarget(trade.stop_loss);
    const backendTakeProfit = this.normalizeMetaTraderRiskTarget(
      trade.take_profit
    );
    const storedStopLoss = Number(existingFrontmatter?.stopLoss);
    const stopLossChanged =
      hasBackendStopLoss &&
      (backendStopLoss === undefined
        ? Number.isFinite(storedStopLoss)
        : !Number.isFinite(storedStopLoss) ||
          storedStopLoss !== backendStopLoss);
    const hasStoredTakeProfits = hasOwnRecordKey(
      existingFrontmatter ?? {},
      'takeProfits'
    );
    const existingTakeProfits = asUnknownArray(
      existingFrontmatter?.takeProfits
    );
    const storedTakeProfit = existingTakeProfits
      ? (() => {
          const firstTakeProfit = existingTakeProfits[0];
          return isRecord(firstTakeProfit)
            ? Number(firstTakeProfit.price)
            : Number.NaN;
        })()
      : Number.NaN;
    const takeProfitChanged =
      hasBackendTakeProfit &&
      (backendTakeProfit === undefined
        ? hasStoredTakeProfits
        : !Number.isFinite(storedTakeProfit) ||
          storedTakeProfit !== backendTakeProfit);
    const forexLotSizeMissing =
      backendStopLoss !== undefined &&
      this.resolveAssetTypeForSync(trade) === 'forex' &&
      !Number.isFinite(Number(existingFrontmatter?.lotSize));

    if (stopLossChanged || takeProfitChanged || forexLotSizeMissing) {
      const tradeService = this.plugin.tradeService;
      if (!tradeService) {
        throw new Error('TradeService is unavailable during backend sync');
      }

      const existingTradeData = await extractCanonicalTradeData(
        tradeService,
        file
      );
      if (!existingTradeData) {
        console.warn(
          `[BackendIntegrationService] Could not extract canonical trade data for synced risk update: ${file.path}`
        );
        return 'skipped';
      }

      const tradeData: TradeData = {
        ...existingTradeData,
        authoritativePnl:
          trade.status === 'CLOSED'
            ? (trade.profit_loss ?? existingTradeData.originalPnl)
            : undefined,
        ...(hasBackendStopLoss && { stopLoss: backendStopLoss }),
        ...(hasBackendTakeProfit && {
          takeProfits:
            backendTakeProfit !== undefined
              ? [{ price: backendTakeProfit, closePercent: 100 }]
              : [],
        }),
        ...(this.resolveAssetTypeForSync(trade) === 'forex' && {
          lotSize: trade.lotSize ?? existingTradeData.lotSize ?? 100000,
        }),
      };
      if (tradeData.instrument && tradeData.assetType) {
        await this.ensureSyncedInstrumentOption(
          tradeData.instrument,
          tradeData.assetType
        );
      }

      const updatedPath = await tradeService.updateTrade(
        tradeData,
        file.path,
        'backend-sync'
      );

      if (updatedPath !== file.path) {
        this.tradeSyncService.addMapping(trade.id, updatedPath);
        const saved = await this.tradeSyncService.saveSyncMapping();
        if (!saved) {
          console.warn(
            `Failed to save relocated mapping for trade ${trade.id}`
          );
        }
      }

      await this.migrateLegacySyncedNoteBody(updatedPath, trade.notes);

      return 'updated';
    }

    if (!mtCommentChanged) {
      return 'skipped';
    }

    const tradeService = this.plugin.tradeService;
    if (!tradeService) {
      await this.plugin.app.fileManager.processFrontMatter(
        file,
        (frontmatter) => {
          if (!isRecord(frontmatter)) return;
          const frontmatterRecord = frontmatter;
          if (nextMTComment === undefined) {
            delete frontmatterRecord.mtComment;
            return;
          }

          frontmatterRecord.mtComment = nextMTComment;
        }
      );

      await forceMetadataCacheRefresh(this.plugin.app, file);
      eventBus.publish('trade:changed', {
        action: 'updated',
        filePaths: [file.path],
      });

      return 'updated';
    }

    const existingTradeData = await extractCanonicalTradeData(
      tradeService,
      file
    );
    if (!existingTradeData) {
      console.warn(
        `[BackendIntegrationService] Could not extract canonical trade data for mtComment sync: ${file.path}`
      );
      return 'skipped';
    }

    const updatedPath = await tradeService.updateTrade(
      {
        ...existingTradeData,
        mtComment: nextMTComment,
      },
      file.path,
      'backend-sync'
    );

    if (updatedPath !== file.path) {
      this.tradeSyncService.addMapping(trade.id, updatedPath);
      const saved = await this.tradeSyncService.saveSyncMapping();
      if (!saved) {
        console.warn(`Failed to save relocated mapping for trade ${trade.id}`);
      }
    }

    return 'updated';
  }

  
  async getFTPCredentials(username: string): Promise<FTPCredentials | null> {
    return this.ftpManagementService.getFTPCredentials(username);
  }

  
  async autoCreateFTPCredentials(
    username: string
  ): Promise<FTPCredentials | null> {
    return this.ftpManagementService.autoCreateFTPCredentials(username);
  }

  
  async resetFTPPassword(userId: string): Promise<FTPCredentials | null> {
    return this.ftpManagementService.resetFTPPassword(userId);
  }

  
  async fetchUserAccounts(options?: {
    status?: 'active' | 'ignored';
  }): Promise<AccountInfo[]> {
    
    return await this.accountManagementService.fetchUserAccounts(options);
  }

  
  async updateAccountDisplayName(
    accountId: string,
    displayName: string
  ): Promise<boolean> {
    
    const userId =
      this.settings.userId ??
      (this.settings.ftpUserId !== undefined
        ? String(this.settings.ftpUserId)
        : this.getUserId());

    return this.accountManagementService.updateAccountDisplayName(
      accountId,
      displayName,
      userId
    );
  }

  async unlinkMtAccount(accountId: string): Promise<void> {
    await this.accountManagementService.unlinkMtAccount(accountId);
    this.invalidateSyncedAccountDisplayNameCache();
  }

  async relinkMtAccount(accountId: string, displayName: string): Promise<void> {
    await this.accountManagementService.relinkMtAccount(accountId, displayName);
    this.invalidateSyncedAccountDisplayNameCache();
  }

  
  getAccountDisplayName(accountId: string): string {
    return this.accountManagementService.getAccountDisplayName(accountId);
  }

  

  async getAccountTrades(
    accountId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<unknown[]> {
    const userId = this.settings.ftpUsername || this.getUserId();
    return this.accountManagementService.getAccountTrades(
      accountId,
      userId,
      limit,
      offset
    );
  }

  
  async createOrGetFTPUser(): Promise<FTPCredentials | null> {
    return this.ftpManagementService.createOrGetFTPUser();
  }

  
  getTradeSyncMapping(): TradeSyncMapping {
    return this.tradeSyncService.getSyncMapping();
  }

  
  setTradeSyncMapping(tradeId: number, filePath: string): void {
    this.tradeSyncService.addMapping(tradeId, filePath);
  }

  
  async saveSyncMapping(): Promise<boolean> {
    return await this.tradeSyncService.saveSyncMapping();
  }

  private normalizeRelinkAccountScalar(value: unknown): string | undefined {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed || undefined;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }

    return undefined;
  }

  private shouldAvoidCanonicalMetadataUpdate(tradeData: TradeData): boolean {
    const defaultRiskAmount = this.plugin?.settings?.trade?.defaultRiskAmount;
    if (
      typeof defaultRiskAmount !== 'number' ||
      !Number.isFinite(defaultRiskAmount) ||
      defaultRiskAmount <= 0
    ) {
      return false;
    }

    return (
      tradeData.riskAmount === undefined && tradeData.stopLoss === undefined
    );
  }

  private shouldAvoidCanonicalPathNormalization(filePath: string): boolean {
    return !/-T\d+\.md$/i.test(filePath);
  }

  private applyAccountRelinkToMutableRecord(
    mutableRecord: Record<string, unknown>,
    context: RelinkRewriteContext
  ): { didUpdate: boolean } {
    let modified = false;

    const rewriteAccountValue = (value: unknown): unknown => {
      const normalizedValue = this.normalizeRelinkAccountScalar(value);
      if (
        normalizedValue &&
        context.targetLookupKeys.has(normalizeAccountLookupKey(normalizedValue))
      ) {
        return context.newAccountName;
      }

      return value;
    };

    const currentAccount = asUnknownArray(mutableRecord.account);

    if (currentAccount) {
      const nextAccount = currentAccount.map((value: unknown) =>
        rewriteAccountValue(value)
      );

      if (
        nextAccount.length !== currentAccount.length ||
        nextAccount.some(
          (value: unknown, index: number) => value !== currentAccount[index]
        )
      ) {
        mutableRecord.account = nextAccount;
        modified = true;
      }
    } else {
      const nextAccount = rewriteAccountValue(mutableRecord.account);
      if (nextAccount !== mutableRecord.account) {
        mutableRecord.account = nextAccount;
        modified = true;
      }
    }

    const currentTags = asUnknownArray(mutableRecord.tags);

    if (currentTags) {
      const rewrittenTags = currentTags.map((value: unknown) => {
        const normalizedTag =
          typeof value === 'string' ? value.trim() : String(value);
        if (context.tagsToReplace.has(normalizedTag)) {
          return context.nextAccountTag;
        }

        return value;
      });

      const dedupedTags: unknown[] = [];
      const seenTagLookupKeys = new Set<string>();
      for (const value of rewrittenTags) {
        const normalizedTag =
          typeof value === 'string' ? value.trim() : String(value);
        const tagLookupKey = normalizedTag.toLowerCase();
        if (seenTagLookupKeys.has(tagLookupKey)) {
          continue;
        }

        seenTagLookupKeys.add(tagLookupKey);
        dedupedTags.push(value);
      }

      if (
        dedupedTags.length !== currentTags.length ||
        dedupedTags.some(
          (value: unknown, index: number) => value !== currentTags[index]
        )
      ) {
        mutableRecord.tags = dedupedTags;
        modified = true;
      }
    }

    return { didUpdate: modified };
  }

  private buildRelinkTradeUpdate(
    tradeData: TradeData,
    context: RelinkRewriteContext
  ): { didUpdate: boolean; nextTradeData: TradeData } {
    const nextTradeData: TradeData = { ...tradeData };
    const mutationResult = this.applyAccountRelinkToMutableRecord(
      nextTradeData as Record<string, unknown>,
      context
    );

    return {
      didUpdate: mutationResult.didUpdate,
      nextTradeData,
    };
  }

  private async applyRelinkFrontmatterPatch(
    file: TFile,
    context: RelinkRewriteContext
  ): Promise<boolean> {
    let didUpdate = false;

    await this.plugin.app.fileManager.processFrontMatter(
      file,
      (frontmatter) => {
        if (!isRecord(frontmatter)) return;
        const frontmatterRecord = frontmatter;
        if (isTradeIdentityEligibleNote(frontmatterRecord, file.path)) {
          ensureTradeIdentityFrontmatter(frontmatterRecord);
        }

        const mutationResult = this.applyAccountRelinkToMutableRecord(
          frontmatterRecord,
          context
        );
        didUpdate = mutationResult.didUpdate;
      }
    );

    return didUpdate;
  }

  private async rollbackRelinkTradeUpdates(
    snapshots: RelinkRollbackSnapshot[],
    tradeService: JournalitPlugin['tradeService']
  ): Promise<void> {
    for (const snapshot of [...snapshots].reverse()) {
      try {
        const latestKnownPath =
          snapshot.fileRef.path && snapshot.fileRef.path.length > 0
            ? snapshot.fileRef.path
            : snapshot.updatedPath;

        if (snapshot.originalTradeData && tradeService) {
          await tradeService.updateTrade(
            snapshot.originalTradeData,
            latestKnownPath,
            'backend-account-relink-rollback',
            { suppressLegacyTradeChanged: true }
          );
          continue;
        }

        const vault = this.plugin.app.vault;
        let fileToRestore = vault.getAbstractFileByPath(latestKnownPath);

        if (!(fileToRestore instanceof TFile)) {
          fileToRestore = vault.getAbstractFileByPath(snapshot.updatedPath);
        }

        if (!(fileToRestore instanceof TFile)) {
          fileToRestore = vault.getAbstractFileByPath(snapshot.originalPath);
        }

        if (!(fileToRestore instanceof TFile)) {
          console.error(
            `BackendIntegrationService: Could not locate file for relink rollback ${latestKnownPath}`
          );
          continue;
        }

        await replaceFileContent(
          this.plugin.app,
          fileToRestore,
          snapshot.originalContent
        );

        if (
          snapshot.updatedPath !== snapshot.originalPath &&
          fileToRestore.path !== snapshot.originalPath
        ) {
          await this.plugin.app.vault.rename(
            fileToRestore,
            snapshot.originalPath
          );
        }

        const restoredFile = this.plugin.app.vault.getAbstractFileByPath(
          snapshot.originalPath
        );
        if (restoredFile instanceof TFile) {
          await forceMetadataCacheRefresh(this.plugin.app, restoredFile);
        }
      } catch (rollbackError) {
        console.error(
          `BackendIntegrationService: Failed to rollback relinked trade ${snapshot.originalPath}:`,
          rollbackError
        );
      }
    }
  }

  
  async updateAccountMapping(
    mtAccountId: string,
    newDisplayName: string,
    options?: {
      previousDisplayName?: string;
    }
  ): Promise<void> {
    await this.accountManagementService.createAccountMapping(
      mtAccountId,
      newDisplayName,
      {
        previousDisplayName: options?.previousDisplayName,
      }
    );
    this.invalidateSyncedAccountDisplayNameCache();
  }

  
  async updateAccountMappings(accounts: AccountInfo[]): Promise<void> {
    await this.accountManagementService.updateAccountMappings(accounts);
    this.invalidateSyncedAccountDisplayNameCache();
  }

  
  async relinkAccountTrades(
    _mtAccountId: string,
    oldAccountName: string,
    newAccountName: string,
    previousMappedAccountName?: string,
    options?: {
      suppressPostRelinkEvents?: boolean;
      restrictToFilePaths?: string[];
    }
  ): Promise<{
    updatedCount: number;
    errors: string[];
    updatedFilePaths: string[];
  }> {
    const errors: string[] = [];
    const updatedFilePaths: string[] = [];
    let updatedCount = 0;
    const suppressPostRelinkEvents = options?.suppressPostRelinkEvents === true;
    const restrictedFilePaths = options?.restrictToFilePaths
      ? new Set(options.restrictToFilePaths)
      : null;
    const rollbackSnapshots: RelinkRollbackSnapshot[] = [];

    const normalizeAccountName = (value: string | undefined): string =>
      value?.trim().toLowerCase() || '';

    
    if (
      normalizeAccountName(oldAccountName) ===
        normalizeAccountName(newAccountName) &&
      normalizeAccountName(previousMappedAccountName) ===
        normalizeAccountName(newAccountName)
    ) {
      return { updatedCount: 0, errors: [], updatedFilePaths: [] };
    }

    const oldAccountLookupKey = normalizeAccountLookupKey(oldAccountName);
    const mtAccountLookupKey = normalizeAccountLookupKey(_mtAccountId);
    const mappedAccountName =
      this.plugin.settings.backendIntegration?.accountMapping?.[_mtAccountId];

    const targetLookupKeys = new Set<string>([
      oldAccountLookupKey,
      mtAccountLookupKey,
    ]);
    const tagValuesToReplace = new Set<string>([oldAccountName, _mtAccountId]);

    const normalizedPreviousMappedAccountName =
      this.normalizeRelinkAccountScalar(previousMappedAccountName);
    if (normalizedPreviousMappedAccountName) {
      targetLookupKeys.add(
        normalizeAccountLookupKey(normalizedPreviousMappedAccountName)
      );
      tagValuesToReplace.add(normalizedPreviousMappedAccountName);
    }

    const normalizedMappedAccountName =
      this.normalizeRelinkAccountScalar(mappedAccountName);
    if (normalizedMappedAccountName) {
      targetLookupKeys.add(
        normalizeAccountLookupKey(normalizedMappedAccountName)
      );
      tagValuesToReplace.add(normalizedMappedAccountName);
    }

    const relinkContext: RelinkRewriteContext = {
      newAccountName,
      targetLookupKeys,
      tagsToReplace: new Set(
        Array.from(tagValuesToReplace).map(
          (value) => `account/${formatTagForYAML(value)}`
        )
      ),
      nextAccountTag: `account/${formatTagForYAML(newAccountName)}`,
    };

    try {
      
      const tradeFiles = this.plugin.app.vault
        .getMarkdownFiles()
        .filter(
          (file) =>
            this.folderPathService.isJournalPath(file.path) &&
            file.path.includes('/trades/')
        );

      const applyFallbackPatchAndTrack = async (
        file: TFile,
        rollbackSnapshot: RelinkRollbackSnapshot
      ): Promise<boolean> => {
        const didUpdateViaFallback = await this.applyRelinkFrontmatterPatch(
          file,
          relinkContext
        );

        if (!didUpdateViaFallback) {
          rollbackSnapshots.pop();
          return false;
        }

        await forceMetadataCacheRefresh(this.plugin.app, file);
        rollbackSnapshot.updatedPath = file.path;
        updatedCount++;
        updatedFilePaths.push(file.path);
        return true;
      };

      for (const file of tradeFiles) {
        if (restrictedFilePaths && !restrictedFilePaths.has(file.path)) {
          continue;
        }

        try {
          let frontmatter =
            this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;

          if (!frontmatter) {
            const content = await this.plugin.app.vault.read(file);
            frontmatter = this.parseFrontmatterForRelink(content);
          }

          if (!isTradeIdentityEligibleNote(frontmatter, file.path)) {
            continue;
          }

          const accountValues = (
            Array.isArray(frontmatter?.account)
              ? frontmatter.account
              : frontmatter?.account !== undefined
                ? [frontmatter.account]
                : []
          )
            .map((value) => this.normalizeRelinkAccountScalar(value))
            .filter((value): value is string => Boolean(value));

          const frontmatterAccountValues = accountValues;

          const frontmatterAccountId = this.normalizeRelinkAccountScalar(
            frontmatter?.accountId
          );
          const matchesTargetAccountId =
            frontmatterAccountId !== undefined &&
            normalizeAccountLookupKey(frontmatterAccountId) ===
              mtAccountLookupKey;

          const matchesRelinkTarget = (value: unknown): boolean => {
            const normalizedValue = this.normalizeRelinkAccountScalar(value);
            if (!normalizedValue) {
              return false;
            }

            return relinkContext.targetLookupKeys.has(
              normalizeAccountLookupKey(normalizedValue)
            );
          };

          const accountArray = [
            ...frontmatterAccountValues,
            ...(frontmatterAccountId ? [frontmatterAccountId] : []),
          ];

          if (accountArray.length === 0) {
            continue;
          }

          const hasConflictingAccountId =
            frontmatterAccountId !== undefined && !matchesTargetAccountId;
          const hasAuthoritativeTargetIdentity = matchesTargetAccountId;
          const matchingRelinkValues = accountArray.filter((value) =>
            matchesRelinkTarget(value)
          );
          const uniqueAccountLookupKeys = new Set(
            accountArray
              .map((value) => this.normalizeRelinkAccountScalar(value))
              .filter((value): value is string => Boolean(value))
              .map((value) => normalizeAccountLookupKey(value))
          );
          const hasUnambiguousAliasOnlyMatch =
            !hasAuthoritativeTargetIdentity &&
            matchingRelinkValues.length > 0 &&
            uniqueAccountLookupKeys.size <= 1;
          const shouldRelinkTrade =
            !hasConflictingAccountId &&
            (hasAuthoritativeTargetIdentity || hasUnambiguousAliasOnlyMatch) &&
            matchingRelinkValues.length > 0;

          if (!shouldRelinkTrade) {
            continue;
          }

          const originalContent = this.plugin.app.vault.cachedRead
            ? await this.plugin.app.vault.cachedRead(file)
            : await this.plugin.app.vault.read(file);

          const rollbackSnapshot: RelinkRollbackSnapshot = {
            fileRef: file,
            originalPath: file.path,
            updatedPath: file.path,
            originalContent,
          };
          rollbackSnapshots.push(rollbackSnapshot);

          const storedTradeType = inferStoredTradeType({
            filePath: file.path,
            type: frontmatter?.type,
            isMissedTrade: frontmatter?.isMissedTrade,
            isBacktestTrade: frontmatter?.isBacktestTrade,
          });
          const hasNonStringTagValues =
            Array.isArray(frontmatter?.tags) &&
            frontmatter.tags.some((tag) => typeof tag !== 'string');

          const tradeService = this.plugin.tradeService;
          if (
            storedTradeType !== 'regular' ||
            !tradeService ||
            hasNonStringTagValues
          ) {
            const appliedFallback = await applyFallbackPatchAndTrack(
              file,
              rollbackSnapshot
            );
            if (!appliedFallback) {
              continue;
            }
            continue;
          }

          let extractedTradeData = await extractCanonicalTradeData(
            tradeService,
            file
          );

          if (!extractedTradeData) {
            await forceMetadataCacheRefresh(this.plugin.app, file).catch(() => {
              // intentional
            });
            extractedTradeData = await extractCanonicalTradeData(
              tradeService,
              file
            );
          }

          if (!extractedTradeData) {
            logger.warn(
              `BackendIntegrationService: Falling back to direct relink frontmatter patch for ${file.path} because canonical extraction returned null`
            );

            const appliedFallback = await applyFallbackPatchAndTrack(
              file,
              rollbackSnapshot
            );
            if (!appliedFallback) {
              continue;
            }
            continue;
          }

          const canonicalTradeData = extractedTradeData;
          const { didUpdate, nextTradeData } = this.buildRelinkTradeUpdate(
            canonicalTradeData,
            relinkContext
          );

          if (!didUpdate) {
            rollbackSnapshots.pop();
            continue;
          }

          const shouldAvoidCanonicalUpdate =
            this.shouldAvoidCanonicalPathNormalization(file.path) ||
            this.shouldAvoidCanonicalMetadataUpdate(nextTradeData);

          if (shouldAvoidCanonicalUpdate) {
            const appliedFallback = await applyFallbackPatchAndTrack(
              file,
              rollbackSnapshot
            );
            if (!appliedFallback) {
              continue;
            }
            continue;
          }

          rollbackSnapshot.originalTradeData = canonicalTradeData;

          const updatedPath = await tradeService.updateTrade(
            nextTradeData,
            file.path,
            'backend-account-relink',
            { suppressLegacyTradeChanged: true }
          );
          rollbackSnapshot.updatedPath = updatedPath;

          updatedCount++;
          updatedFilePaths.push(updatedPath);
        } catch (error) {
          console.error(`Error processing file ${file.path}:`, error);
          const message =
            error instanceof Error ? error.message : String(error);
          errors.push(`${file.path}: ${message}`);
          await this.rollbackRelinkTradeUpdates(
            rollbackSnapshots,
            this.plugin.tradeService
          );
          throw new Error(`Failed relinking ${file.path}: ${message}`);
        }
      }

      if (updatedFilePaths.length > 0) {
        await this.plugin.tradeService?.clearCacheWithPrefix(
          'trade:all-trades'
        );

        if (!suppressPostRelinkEvents) {
          eventBus.publish('trade:changed', {
            action: 'updated',
            filePaths: updatedFilePaths,
          });
        }
      }

      
      if (this.plugin.accountPageService) {
        try {
          await this.plugin.accountPageService.refreshAccountData();

          if (!suppressPostRelinkEvents) {
            
            eventBus.publish('account:changed', {
              action: 'updated',
              accountName: oldAccountName,
            });

            eventBus.publish('account:changed', {
              action: 'updated',
              accountName: newAccountName,
            });
          }
        } catch (error) {
          console.error(
            'Error refreshing account data after relinking:',
            error
          );
        }
      }
    } catch (error) {
      console.error('Error relinking account trades:', error);

      throw error;
    }

    return { updatedCount, errors, updatedFilePaths };
  }

  
  async requestForceSync(): Promise<SyncResponse | null> {
    return (await this.debouncedForceSync()) ?? null;
  }

  
  async requestCheckForNewTrades(): Promise<void> {
    return this.debouncedCheckForNewTrades();
  }

  
  async forceSyncImmediate(): Promise<SyncResponse | null> {
    if (this.syncMutex.isLocked()) {
      new Notice(t('backend.notice.sync-in-progress'));
      return null;
    }

    this.debouncedForceSync.cancel();
    return await this.forceSync();
  }

  
  public addBatchModifiedFiles(filePaths: string[]): void {
    filePaths.forEach((path) => {
      this.fileWatcherService.batchModifiedFiles.add(path);
    });
  }

  
  public removeBatchModifiedFiles(filePaths: string[]): void {
    filePaths.forEach((path) => {
      this.fileWatcherService.batchModifiedFiles.delete(path);
    });
  }

  
  cleanup(): void {
    window.removeEventListener(
      'journalit:subscription-changed',
      this.handleSubscriptionChanged
    );
    window.removeEventListener('journalit:auth-failed', this.handleAuthFailed);
    this.stopAutoSync();
    this.fileWatcherService.clearProcessedFiles();

    
    this.tradeSyncService.cleanup();

    
    this.debouncedForceSync.cancel();
    this.debouncedCheckForNewTrades.cancel();

    
    if (this.autoContinueTimeoutId !== null) {
      window.clearTimeout(this.autoContinueTimeoutId);
      this.autoContinueTimeoutId = null;
    }

    
    this.syncCancelled = false;
    this.totalTradesToSync = 0;
    this.tradesProcessedSoFar = 0;
  }
}

function isTradeData(value: unknown): value is TradeData {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.entryTime instanceof Date &&
    typeof value.entryPrice === 'number' &&
    typeof value.positionSize === 'number' &&
    typeof value.direction === 'string' &&
    Array.isArray(value.setupIds)
  );
}

async function extractCanonicalTradeData(
  tradeService: {
    extractTradeData(file: TFile): Promise<Record<string, unknown> | null>;
  },
  file: TFile
): Promise<TradeData | null> {
  const extracted = await tradeService.extractTradeData(file);
  return isTradeData(extracted) ? extracted : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeExecutionEntries(
  value: unknown
): Array<{ time?: string; price?: number; size?: number }> | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const entries = value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }

    return [
      {
        time: typeof entry.time === 'string' ? entry.time : undefined,
        price: typeof entry.price === 'number' ? entry.price : undefined,
        size: typeof entry.size === 'number' ? entry.size : undefined,
      },
    ];
  });

  return entries.length > 0 ? entries : undefined;
}
