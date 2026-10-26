

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
import type {
  BrokerStatusState,
  LocalAccountOption,
} from '../brokerSyncKit/types';
import type {
  AccountDraft,
  AccountDrafts,
  OAuthBrokerAccountSelection,
} from './drafts';


export type OAuthBrokerConnectionAccount = CTraderConnectionAccount;
export type OAuthBrokerConnection = TradovateConnection;

interface OAuthBrokerConnectionList {
  connections: OAuthBrokerConnection[];
}

export interface OAuthBrokerAccountConfiguration {
  job: BrokerSyncJob | null;
  created: boolean;
}


export interface OAuthBrokerSharedCopy {
  sourceTitle: TranslationKey;
  pluginSyncDescription: TranslationKey;
  pendingAcks: TranslationKey;
  setupGuide: TranslationKey;
  connect: TranslationKey;
  connectAnother: TranslationKey;
  syncAll: TranslationKey;
  never: TranslationKey;
  lastSync: TranslationKey;
  claimedByConnection: TranslationKey;
  recoveryCount: TranslationKey;
  recoverySelectAccount: TranslationKey;
  websiteConnectionDescription: TranslationKey;
  pausedWebsiteDescription?: TranslationKey;
  manageConnection: TranslationKey;
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
  recoveryTitle: TranslationKey;
  recoveryConfirm: TranslationKey;
  mappingRequired: TranslationKey;
  syncPartialConnection: TranslationKey;
  syncCompleteConnection: TranslationKey;
  syncAllPartial: TranslationKey;
  
  syncAllProviderPartial: TranslationKey;
  syncAllComplete: TranslationKey;
  docsUrl: string;
  integrationsUrl: string;
  localAccountFieldPrefix: string;
}


export interface OAuthBrokerSyncCopy extends OAuthBrokerSharedCopy {
  syncAccount: TranslationKey;
  historyLabel: TranslationKey;
  historyAll: TranslationKey;
  historyRecent: TranslationKey;
  historyCustom: TranslationKey;
  historyNew: TranslationKey;
  startDate: TranslationKey;
  discoveryDescription: TranslationKey;
  discovering: TranslationKey;
  discoverAccounts: TranslationKey;
  setupAndSync: TranslationKey;
  discoveryFailed: TranslationKey;
  customDateRequired: TranslationKey;
  claimConflict: TranslationKey;
}


export interface OAuthBrokerWebsiteSelectionCopy extends OAuthBrokerSharedCopy {
  
  setupRequiredDescription: TranslationKey;
  accountSelected: TranslationKey;
  accountNotSelected: TranslationKey;
}

interface OAuthBrokerCatalogClientOperations {
  getConnections: (
    options?: TradeProjectionRequestOptions
  ) => Promise<OAuthBrokerConnectionList>;
}

interface OAuthBrokerClientOperations extends OAuthBrokerCatalogClientOperations {
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

interface OAuthBrokerDiagnosticsOperations {
  flush: () => void;
  createConnectionOperation: (
    vaultId: string,
    connectionId: string
  ) => Promise<BrokerClientOperationContext> | BrokerClientOperationContext;
  createProjectionOperation: (
    vaultId: string
  ) => Promise<BrokerClientOperationContext> | BrokerClientOperationContext;
}

interface OAuthBrokerProjectionSyncOperations {
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

export interface OAuthBrokerSyncServiceOperations extends OAuthBrokerProjectionSyncOperations {
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
}

interface OAuthBrokerSyncPanelAdapterBase {
  diagnostics: OAuthBrokerDiagnosticsOperations;
  
  onCatalogLoaded: (hasConnections: boolean) => void;
  logRefreshFailed: string;
  logLocalAccountCreateFailed: string;
  logSyncFailed: string;
  localAccountNameUnavailableError: string;
  createdLocalAccountUnavailableError: string;
}


interface OAuthBrokerPluginSelectionAdapter extends OAuthBrokerSyncPanelAdapterBase {
  accountSelection?: 'plugin';
  copy: OAuthBrokerSyncCopy;
  client: OAuthBrokerClientOperations;
  syncService: OAuthBrokerSyncServiceOperations;
  isClaimConflictError: (error: unknown) => boolean;
  logDiscoveryFailed: string;
}


interface OAuthBrokerWebsiteSelectionAdapter extends OAuthBrokerSyncPanelAdapterBase {
  accountSelection: 'website';
  copy: OAuthBrokerWebsiteSelectionCopy;
  client: OAuthBrokerCatalogClientOperations;
  syncService: OAuthBrokerProjectionSyncOperations;
}

export type OAuthBrokerSyncPanelAdapter =
  | OAuthBrokerPluginSelectionAdapter
  | OAuthBrokerWebsiteSelectionAdapter;


export type OAuthBrokerPanelSelection =
  | {
      mode: 'plugin';
      copy: OAuthBrokerSyncCopy;
      discoverAccounts: (connectionId: string) => Promise<void>;
    }
  | { mode: 'website'; copy: OAuthBrokerWebsiteSelectionCopy };

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
  selection: OAuthBrokerPanelSelection;
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
