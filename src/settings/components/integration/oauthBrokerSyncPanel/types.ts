

import type { TranslationKey } from '../../../../lang/locale/en';
import type { BrokerSyncAccountBinding } from '../../../../services/tradeSync/BrokerSyncProvider';
import type {
  BrokerClientOperationContext,
  BrokerSyncAllResult,
  BrokerSyncJob,
  TradeProjectionAccountInventoryItem,
  TradeProjectionRequestOptions,
  TradeProjectionSyncResult,
  CTraderConnectionAccount,
  TradovateConnection,
} from '../../../../services/tradeSync/types';
import type { BrokerStatusState, LocalAccountOption } from '../brokerSyncKit';
import type {
  AccountDraft,
  AccountDrafts,
  OAuthBrokerAccountSelection,
} from './drafts';


export type OAuthBrokerConnectionAccount = CTraderConnectionAccount;
export type OAuthBrokerConnection = TradovateConnection;

export interface OAuthBrokerConnectionList {
  connections: OAuthBrokerConnection[];
}

export interface OAuthBrokerAccountConfiguration {
  job: BrokerSyncJob | null;
  created: boolean;
}

export interface OAuthBrokerSyncCopy {
  sourceTitle: TranslationKey;
  pluginSyncDescription: TranslationKey;
  pendingAcks: TranslationKey;
  setupGuide: TranslationKey;
  connect: TranslationKey;
  connectAnother: TranslationKey;
  syncAll: TranslationKey;
  never: TranslationKey;
  lastSync: TranslationKey;
  syncAccount: TranslationKey;
  claimedByConnection: TranslationKey;
  historyLabel: TranslationKey;
  historyAll: TranslationKey;
  historyRecent: TranslationKey;
  historyCustom: TranslationKey;
  historyNew: TranslationKey;
  startDate: TranslationKey;
  recoveryCount: TranslationKey;
  recoverySelectAccount: TranslationKey;
  websiteConnectionDescription: TranslationKey;
  pausedWebsiteDescription?: TranslationKey;
  discoveryDescription: TranslationKey;
  manageConnection: TranslationKey;
  discovering: TranslationKey;
  discoverAccounts: TranslationKey;
  setupAndSync: TranslationKey;
  syncToVault: TranslationKey;
  reconciliationIssues: TranslationKey;
  statusFailed: TranslationKey;
  noConnections: TranslationKey;
  statusConnecting: TranslationKey;
  statusSetupRequired: TranslationKey;
  statusPaused: TranslationKey;
  statusReauthorizationRequired: TranslationKey;
  statusDeleting: TranslationKey;
  statusError: TranslationKey;
  discoveryFailed: TranslationKey;
  recoveryTitle: TranslationKey;
  recoveryConfirm: TranslationKey;
  customDateRequired: TranslationKey;
  mappingRequired: TranslationKey;
  claimConflict: TranslationKey;
  syncPartialConnection: TranslationKey;
  syncCompleteConnection: TranslationKey;
  syncAllPartial: TranslationKey;
  syncAllComplete: TranslationKey;
  docsUrl: string;
  integrationsUrl: string;
  localAccountFieldPrefix: string;
}

export interface OAuthBrokerClientOperations {
  getConnections: (
    options?: TradeProjectionRequestOptions
  ) => Promise<OAuthBrokerConnectionList>;
  configureAccounts: (
    connectionId: string,
    accounts: OAuthBrokerAccountSelection[],
    operation: BrokerClientOperationContext
  ) => Promise<OAuthBrokerAccountConfiguration>;
  startSync: (
    connectionId: string,
    intent: 'sync' | 'discovery',
    operation: BrokerClientOperationContext
  ) => Promise<BrokerSyncJob>;
}

export interface OAuthBrokerDiagnosticsOperations {
  flush: () => void;
  createConnectionOperation: (
    vaultId: string,
    connectionId: string
  ) => Promise<BrokerClientOperationContext> | BrokerClientOperationContext;
  createProjectionOperation: (
    vaultId: string
  ) => Promise<BrokerClientOperationContext> | BrokerClientOperationContext;
}

export interface OAuthBrokerSyncServiceOperations {
  waitForCloudSync: (
    connectionId: string,
    jobId: string,
    operation: BrokerClientOperationContext
  ) => Promise<unknown>;
  projectAfterJob: (
    connectionId: string,
    jobId: string,
    operation: BrokerClientOperationContext
  ) => Promise<TradeProjectionSyncResult>;
  waitForCloudSyncTerminal: (
    connectionId: string,
    jobId: string,
    operation: BrokerClientOperationContext
  ) => Promise<unknown>;
  syncConnection: (
    connectionId: string,
    operation: BrokerClientOperationContext
  ) => Promise<TradeProjectionSyncResult>;
  syncRemappedAccountProjections: (
    accountBindings: BrokerSyncAccountBinding[],
    operation: BrokerClientOperationContext
  ) => Promise<TradeProjectionSyncResult>;
  syncAllConnections: (connectionIds: string[]) => Promise<BrokerSyncAllResult>;
}

export interface OAuthBrokerSyncPanelAdapter {
  copy: OAuthBrokerSyncCopy;
  client: OAuthBrokerClientOperations;
  diagnostics: OAuthBrokerDiagnosticsOperations;
  syncService: OAuthBrokerSyncServiceOperations;
  
  onCatalogLoaded: (hasConnections: boolean) => void;
  isClaimConflictError: (error: unknown) => boolean;
  logRefreshFailed: string;
  logDiscoveryFailed: string;
  logLocalAccountCreateFailed: string;
  logSyncFailed: string;
  localAccountNameUnavailableError: string;
  createdLocalAccountUnavailableError: string;
}

export interface ConnectionUiState {
  canSync: boolean;
  requiresWebsite: boolean;
  setupRequired: boolean;
  discoveryRetryAvailable: boolean;
  hasRunningJob: boolean;
}

export type OAuthBrokerStatusState = BrokerStatusState<{
  connections: OAuthBrokerConnection[];
}>;

export interface OAuthBrokerSyncPanelContentProps {
  copy: OAuthBrokerSyncCopy;
  canCreateConnections: boolean;
  statusState: OAuthBrokerStatusState;
  drafts: AccountDrafts;
  localAccounts: LocalAccountOption[];
  inventoryAccounts: TradeProjectionAccountInventoryItem[];
  busyConnections: Record<string, true>;
  refreshing: boolean;
  syncAllBusy: boolean;
  syncAllAvailable: boolean;
  
  syncAllBlockedMessage?: string;
  
  mappingDirty: Record<string, true>;
  restoringAccountIds: Record<string, true>;
  mappingRetryAtByAccountId: Record<string, number>;
  restoreRetryAtByAccountId: Record<string, number>;
  connectionStates: Record<string, ConnectionUiState>;
  pendingAckCount: number;
  refresh: (options?: { background?: boolean }) => Promise<boolean | void>;
  syncConnection: (connectionId: string) => Promise<void>;
  syncAll: () => Promise<void>;
  discoverAccounts: (connectionId: string) => Promise<void>;
  createLocalAccount: (
    connectionId: string,
    account: OAuthBrokerConnectionAccount
  ) => Promise<void>;
  restoreAccount: (
    connectionId: string,
    account: OAuthBrokerConnectionAccount,
    inventoryAccount: TradeProjectionAccountInventoryItem
  ) => Promise<void>;
  updateDraft: (
    connectionId: string,
    accountId: string,
    patch: Partial<AccountDraft>,
    mapping?: boolean
  ) => void;
}

export type OAuthBrokerSyncPanelModel = Omit<
  OAuthBrokerSyncPanelContentProps,
  'canCreateConnections'
>;
