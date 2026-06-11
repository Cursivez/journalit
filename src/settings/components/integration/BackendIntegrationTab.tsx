

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  CheckCircle2,
  Info,
  AlertTriangle,
} from '../../../components/shared/icons/ObsidianIcon';
import { Notice, FileSystemAdapter, Platform, Modal, App } from 'obsidian';
import JournalitPlugin from '../../../main';
import { ToggleSwitch } from '../../../components/ui';
import { Button } from '../../../components/ui';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { Accordion } from '../../../components/shared/Accordion';
import { StatusCards } from './StatusCards';
import { t } from '../../../lang/helpers';
import {
  BackendIntegrationService,
  SyncResponse,
  SyncStatus,
} from '../../../services/backend';
import { ApiClient } from '../../../services/backend/ApiClient';
import { BackendSecretStorage } from '../../../services/backend/BackendSecretStorage';
import { DEFAULT_SETTINGS, AccountInfo } from '../../../settings/types';
import { FTPCredentialsSection } from './FTPCredentialsSection';
import { AccountLinkingManager } from './AccountLinkingManager';
import { ErrorHandler } from '../../../utils/errorHandler';
import {
  buildSupportReport,
  formatSupportErrorDetails,
  SupportErrorDetails,
  SupportReportSection,
} from '../../../utils/supportReport';
import { SupportActions } from '../../../components/shared/SupportActions';
import { backgroundIssuesStore } from '../../../services/diagnostics/BackgroundIssuesStore';

interface BackendIntegrationTabProps {
  plugin: JournalitPlugin;
}

function useBackendIntegrationTabModel(props: BackendIntegrationTabProps) {
  const { plugin } = props;
  const settings =
    plugin.settings.backendIntegration || DEFAULT_SETTINGS.backendIntegration!;
  const hasAuthToken = BackendSecretStorage.hasAuthToken(plugin);

  
  const [connectionState, setConnectionState] = useState({
    status: 'unknown' as 'connected' | 'disconnected' | 'unknown',
    isSyncing: false,
    lastSyncResult: null as SyncResponse | null,
    syncStatus: null as SyncStatus | null,
    lastSyncError: null as SupportErrorDetails | null,
  });

  const [accountState, setAccountState] = useState({
    accounts: [] as AccountInfo[],
    ignoredAccounts: [] as AccountInfo[],
    isLoading: false,
  });

  const lastAttemptedRef = useRef(0);
  const lastErrorNoticeRef = useRef(0);
  const integrationErrorPanelRef = useRef<HTMLDivElement | null>(null);
  const integrationReportCopyTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [ftpState, setFtpState] = useState({
    hasCredentials: false,
    isCreating: false,
  });
  const [ftpErrorDetails, setFtpErrorDetails] =
    useState<SupportErrorDetails | null>(null);
  const [accountLinkErrorDetails, setAccountLinkErrorDetails] =
    useState<SupportErrorDetails | null>(null);

  const [backgroundIssues, setBackgroundIssues] = useState(() =>
    backgroundIssuesStore.getIssues()
  );

  useEffect(() => {
    return backgroundIssuesStore.subscribe(() => {
      setBackgroundIssues(backgroundIssuesStore.getIssues());
    });
  }, []);

  useEffect(() => {
    return () => {
      if (integrationReportCopyTimerRef.current) {
        clearTimeout(integrationReportCopyTimerRef.current);
      }
    };
  }, []);

  const [settingsVersion, setSettingsVersion] = useState(0);
  void settingsVersion;

  
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [integrationReportCopied, setIntegrationReportCopied] = useState(false);

  
  const autoDetectedUserId = useMemo(() => {
    try {
      const vaultName = plugin.app.vault.getName();
      if (vaultName && vaultName !== 'Obsidian Vault') {
        return vaultName.toLowerCase().replace(/[^a-z0-9]/g, '');
      }
      const adapter = plugin.app.vault.adapter;
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
      return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    }
  }, [plugin.app.vault]);

  const [backendService, setBackendService] =
    useState<BackendIntegrationService | null>(null);

  
  useEffect(() => {
    let mounted = true;

    const initializeComponent = async () => {
      try {
        const service =
          await plugin.serviceManager.getBackendIntegrationService();
        if (!mounted) return;

        setBackendService(service);
        await checkConnectionStatus();

        await Promise.allSettled([
          loadSyncStatus(service),
          loadAccounts(service),
          checkFTPCredentials(service),
        ]);
      } catch (error) {
        const errorContext = ErrorHandler.createContext(
          'initialize backend integration',
          undefined,
          ErrorHandler.extractStatusCode(error)
        );
        ErrorHandler.logError(error, errorContext);
      }
    };

    initializeComponent();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plugin.serviceManager]);

  const checkConnectionStatus = useCallback(async () => {
    try {
      const isHealthy = await ApiClient.checkHealth();
      const status = isHealthy ? 'connected' : 'disconnected';
      setConnectionState((prev) => ({ ...prev, status }));
    } catch {
      setConnectionState((prev) => ({ ...prev, status: 'disconnected' }));
    }
  }, []);

  const updateSetting = useCallback(
    async <K extends keyof typeof settings>(
      key: K,
      value: (typeof settings)[K]
    ) => {
      if (key === 'serverUrl') {
        ApiClient.clearCache();
      }

      if (key === 'ftpPassword') {
        const password = typeof value === 'string' ? value : '';
        if (password) {
          BackendSecretStorage.setFTPPassword(plugin, password);
        } else {
          BackendSecretStorage.clearFTPPassword(plugin);
        }
        await plugin.saveSettings();
        return;
      }

      plugin.settings.backendIntegration = {
        ...plugin.settings.backendIntegration,
        [key]: value,
      } as typeof plugin.settings.backendIntegration;
      await plugin.saveSettings();

      if (backendService) {
        await backendService.updateSettings({ [key]: value });
      }
    },
    [plugin, backendService]
  );

  const loadSyncStatus = useCallback(
    async (service?: BackendIntegrationService) => {
      const serviceToUse = service || backendService;
      if (!serviceToUse) return;

      if (!hasAuthToken) {
        setConnectionState((prev) => ({
          ...prev,
          syncStatus: null,
          lastSyncResult: null,
          lastSyncError: null,
        }));
        return;
      }

      try {
        const status = await serviceToUse.getSyncStatus();
        if (!status) {
          setConnectionState((prev) => ({
            ...prev,
            syncStatus: null,
            lastSyncError: {
              message: t('backend.notice.sync-failed', {
                error: t('common.error'),
              }),
              operation: 'load sync status',
              endpoint: '/api/v1/sync/status',
              statusCode: undefined,
              timestamp: new Date().toISOString(),
            },
          }));
          return;
        }

        setConnectionState((prev) => ({
          ...prev,
          syncStatus: status,
          lastSyncError: null,
        }));

        if (status.last_sync_time && status.sync_count !== undefined) {
          const serverSyncTime = new Date(status.last_sync_time).getTime();
          const localSyncTime = settings.lastSyncTime
            ? new Date(settings.lastSyncTime).getTime()
            : 0;

          if (
            serverSyncTime > localSyncTime ||
            status.sync_count > (settings.syncCount || 0)
          ) {
            await updateSetting('lastSyncTime', status.last_sync_time);
            await updateSetting('syncCount', status.sync_count);
          }
        }
      } catch (error) {
        const errorContext = ErrorHandler.createContext(
          'load sync status',
          '/api/v1/sync/status',
          ErrorHandler.extractStatusCode(error)
        );
        const message = ErrorHandler.getErrorMessage(error, errorContext);
        setConnectionState((prev) => ({
          ...prev,
          syncStatus: null,
          lastSyncError: {
            message,
            operation: errorContext.operation,
            endpoint: errorContext.endpoint,
            statusCode: errorContext.statusCode,
            timestamp: new Date().toISOString(),
          },
        }));
        ErrorHandler.logError(error, errorContext);
      }
    },
    [
      backendService,
      hasAuthToken,
      settings.lastSyncTime,
      settings.syncCount,
      updateSetting,
    ]
  );

  const loadAccounts = useCallback(
    async (service?: BackendIntegrationService) => {
      const serviceToUse = service || backendService;
      if (!serviceToUse) return;

      if (!hasAuthToken) {
        setAccountState((prev) => ({
          ...prev,
          accounts: [],
          ignoredAccounts: [],
          isLoading: false,
        }));
        return;
      }

      
      if (connectionState.status === 'disconnected' && !service) {
        return;
      }

      if (accountState.isLoading) {
        return;
      }

      const now = Date.now();
      if (now - lastAttemptedRef.current < 5000) {
        return;
      }

      lastAttemptedRef.current = now;
      setAccountState((prev) => ({ ...prev, isLoading: true }));

      try {
        const [fetchedAccounts, fetchedIgnoredAccounts] = await Promise.all([
          serviceToUse.fetchUserAccounts(),
          serviceToUse.fetchUserAccounts({ status: 'ignored' }),
        ]);
        const currentMapping = settings.accountMapping || {};

        const applyDisplayMapping = (account: AccountInfo): AccountInfo => ({
          ...account,
          displayName:
            currentMapping[account.accountId] ||
            account.displayName ||
            `Account-${account.accountId}`,
        });

        const accountsWithMapping = fetchedAccounts
          .filter((account) => account.status !== 'ignored')
          .map(applyDisplayMapping);
        const ignoredAccountsWithMapping = fetchedIgnoredAccounts
          .filter((account) => account.status === 'ignored')
          .map(applyDisplayMapping);

        setAccountState((prev) => ({
          ...prev,
          accounts: accountsWithMapping,
          ignoredAccounts: ignoredAccountsWithMapping,
          isLoading: false,
        }));

        const hasNewMappings = fetchedAccounts.some(
          (account) => account.displayName && !currentMapping[account.accountId]
        );
        if (hasNewMappings) {
          await serviceToUse.updateAccountMappings(accountsWithMapping);
        }
      } catch (error) {
        if (Date.now() - lastErrorNoticeRef.current > 30000) {
          const errorContext = ErrorHandler.createContext(
            'load MT accounts',
            '/api/v1/mt-accounts',
            ErrorHandler.extractStatusCode(error)
          );
          ErrorHandler.handleError(error, errorContext);
          lastErrorNoticeRef.current = Date.now();
        }

        setAccountState((prev) => ({
          ...prev,
          isLoading: false,
          accounts: [],
          ignoredAccounts: [],
        }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [backendService, connectionState.status]
  );

  useEffect(() => {
    if (
      connectionState.status === 'connected' &&
      backendService &&
      accountState.accounts.length === 0 &&
      !accountState.isLoading &&
      Date.now() - lastAttemptedRef.current > 5000
    ) {
      loadAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState.status, backendService]);

  useEffect(() => {
    if (accountLinkErrorDetails && integrationErrorPanelRef.current) {
      integrationErrorPanelRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [accountLinkErrorDetails]);

  const handleUnlinkMtAccount = useCallback(
    async (account: AccountInfo) => {
      if (!backendService) return;

      const confirmed = await confirmMtAccountUnlink(
        plugin.app,
        account.accountId
      );
      if (!confirmed) return;

      try {
        await backendService.unlinkMtAccount(account.accountId);
        setAccountState((prev) => ({
          ...prev,
          accounts: prev.accounts.filter(
            (item) => item.accountId !== account.accountId
          ),
          ignoredAccounts: [
            {
              ...account,
              status: 'ignored',
              ignoredAt: new Date().toISOString(),
            },
            ...prev.ignoredAccounts.filter(
              (item) => item.accountId !== account.accountId
            ),
          ],
        }));
        new Notice(t('backend.accounts.unlink-success'));
        await loadAccounts(backendService);
      } catch (error) {
        ErrorHandler.handleError(
          error,
          ErrorHandler.createContext(
            'unlink MT account',
            `/api/v1/mt-accounts/${account.accountId}/unlink`,
            ErrorHandler.extractStatusCode(error)
          )
        );
      }
    },
    [backendService, loadAccounts, plugin.app]
  );

  const handleRelinkMtAccount = useCallback(
    async (account: AccountInfo) => {
      if (!backendService) return;

      try {
        await backendService.relinkMtAccount(
          account.accountId,
          account.displayName || `Account-${account.accountId}`
        );
        setAccountState((prev) => ({
          ...prev,
          accounts: [
            { ...account, status: 'active', ignoredAt: undefined },
            ...prev.accounts.filter(
              (item) => item.accountId !== account.accountId
            ),
          ],
          ignoredAccounts: prev.ignoredAccounts.filter(
            (item) => item.accountId !== account.accountId
          ),
        }));
        new Notice(t('backend.accounts.relink-success'));
        await loadAccounts(backendService);
      } catch (error) {
        ErrorHandler.handleError(
          error,
          ErrorHandler.createContext(
            'relink MT account',
            `/api/v1/mt-accounts/${account.accountId}/relink`,
            ErrorHandler.extractStatusCode(error)
          )
        );
      }
    },
    [backendService, loadAccounts]
  );

  const handleSyncEnabledToggle = async (newValue: boolean) => {
    await updateSetting('syncEnabled', newValue);
    setSettingsVersion((prev) => prev + 1);
    new Notice(
      t('notice.auto-sync-toggled', {
        status: newValue
          ? t('notice.auto-sync-enabled')
          : t('notice.auto-sync-disabled'),
      })
    );
  };

  const checkFTPCredentials = useCallback(
    async (service?: BackendIntegrationService) => {
      const serviceToUse = service || backendService;
      if (!serviceToUse) return;

      try {
        if (settings.ftpUsername) {
          const credentials = await serviceToUse.getFTPCredentials(
            settings.ftpUsername
          );
          setFtpState((prev) => ({ ...prev, hasCredentials: !!credentials }));
        } else {
          setFtpState((prev) => ({ ...prev, hasCredentials: false }));
        }
      } catch (error) {
        const errorContext = ErrorHandler.createContext(
          'check FTP credentials',
          '/api/v1/ftp-users',
          ErrorHandler.extractStatusCode(error)
        );
        ErrorHandler.logError(error, errorContext);
        setFtpState((prev) => ({ ...prev, hasCredentials: false }));
      }
    },
    [backendService, settings.ftpUsername]
  );

  const handleCreateFTPCredentials = useCallback(async () => {
    if (!backendService) return;

    setFtpErrorDetails(null);
    setFtpState((prev) => ({ ...prev, isCreating: true }));
    try {
      const credentials = await backendService.createOrGetFTPUser();
      if (credentials) {
        await updateSetting('ftpUsername', credentials.username);
        await updateSetting('ftpPassword', credentials.password || '');
        setFtpState((prev) => ({ ...prev, hasCredentials: true }));
        setFtpErrorDetails(null);
        new Notice(t('notice.ftp-created'));

        const event = new CustomEvent('ftp-credentials-created', {
          detail: { credentials },
        });
        window.dispatchEvent(event);

        await loadAccounts();
      }
    } catch (error) {
      const errorContext = ErrorHandler.createContext(
        'create FTP credentials',
        '/api/v1/ftp-users',
        ErrorHandler.extractStatusCode(error)
      );
      const message = ErrorHandler.getErrorMessage(error, errorContext);
      setFtpErrorDetails({
        message,
        operation: errorContext.operation,
        endpoint: errorContext.endpoint,
        statusCode: errorContext.statusCode,
        timestamp: new Date().toISOString(),
      });
      ErrorHandler.handleError(error, errorContext);
    } finally {
      setFtpState((prev) => ({ ...prev, isCreating: false }));
    }
  }, [backendService, updateSetting, loadAccounts]);

  const handleRegisterVault = useCallback(async () => {
    if (!backendService) return;

    if (!hasAuthToken) {
      new Notice(t('notice.error.sign-in-vault'));
      return;
    }

    setConnectionState((prev) => ({ ...prev, isSyncing: true }));
    try {
      await updateSetting('userId', autoDetectedUserId);

      const success = await backendService.registerVault();
      if (success) {
        setConnectionState((prev) => ({ ...prev, status: 'connected' }));
        await loadSyncStatus();
        await checkFTPCredentials();
      }
    } catch (error) {
      const errorContext = ErrorHandler.createContext(
        'vault registration',
        '/api/v1/register-vault',
        ErrorHandler.extractStatusCode(error)
      );
      ErrorHandler.handleError(error, errorContext);
    } finally {
      setConnectionState((prev) => ({ ...prev, isSyncing: false }));
    }
  }, [
    backendService,
    updateSetting,
    autoDetectedUserId,
    loadSyncStatus,
    checkFTPCredentials,
    hasAuthToken,
  ]);

  const handleForceSync = useCallback(async () => {
    if (!backendService) return;

    if (!hasAuthToken) {
      new Notice(t('notice.error.sign-in-sync'));
      return;
    }

    setConnectionState((prev) => ({
      ...prev,
      isSyncing: true,
      lastSyncError: null,
    }));
    try {
      const result = await backendService.requestForceSync();
      if (!result) {
        const message = t('backend.notice.sync-failed', {
          error: t('common.error'),
        });
        setConnectionState((prev) => ({
          ...prev,
          lastSyncResult: null,
          lastSyncError: {
            message,
            operation: 'force sync',
            endpoint: '/api/v1/sync/force',
            statusCode: undefined,
            timestamp: new Date().toISOString(),
          },
        }));
        return;
      }

      setConnectionState((prev) => ({
        ...prev,
        lastSyncResult: result,
        lastSyncError: null,
      }));
      await loadSyncStatus();
    } catch (error) {
      const errorContext = ErrorHandler.createContext(
        'force sync',
        '/api/v1/sync/force',
        ErrorHandler.extractStatusCode(error)
      );
      const message = ErrorHandler.getErrorMessage(error, errorContext);
      setConnectionState((prev) => ({
        ...prev,
        lastSyncError: {
          message,
          operation: errorContext.operation,
          endpoint: errorContext.endpoint,
          statusCode: errorContext.statusCode,
          timestamp: new Date().toISOString(),
        },
      }));
      ErrorHandler.handleError(error, errorContext);
    } finally {
      setConnectionState((prev) => ({ ...prev, isSyncing: false }));
    }
  }, [backendService, loadSyncStatus, hasAuthToken]);

  const handleManageAccounts = useCallback(() => {
    setExpandedSection('accounts');
  }, []);

  const formatLastSyncTime = (timestamp?: string) => {
    if (!timestamp) return t('backend.sync.never');
    try {
      const date = new Date(timestamp);
      const dateFormat = plugin.settings.trade.dateFormat || 'DDMMYY';

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      let dateStr = '';
      switch (dateFormat) {
        case 'DDMMYY':
          dateStr = `${day}/${month}/${year}`;
          break;
        case 'MMDDYY':
          dateStr = `${month}/${day}/${year}`;
          break;
        case 'YYMMDD':
          dateStr = `${year}/${month}/${day}`;
          break;
        default:
          dateStr = `${day}/${month}/${year}`;
      }

      return `${dateStr} ${hours}:${minutes}`;
    } catch {
      return t('backend.sync.invalid-date');
    }
  };

  const buildIntegrationErrorReport = useCallback(() => {
    const syncErrors = connectionState.lastSyncResult?.errors || [];
    const lastSyncTime =
      settings.lastSyncTime || connectionState.syncStatus?.last_sync_time;
    const syncCount =
      settings.syncCount || connectionState.syncStatus?.sync_count || 0;

    const metaLines = [
      `Timestamp: ${new Date().toISOString()}`,
      `Vault: ${plugin.app.vault.getName()}`,
      `Plugin version: ${plugin.manifest.version}`,
      `Server URL: ${settings.serverUrl || 'https://api.journalit.co'}`,
      `Auth token present: ${hasAuthToken ? 'Yes' : 'No'}`,
      `Connection status: ${connectionState.status}`,
      `Auto-sync enabled: ${settings.syncEnabled ? 'Yes' : 'No'}`,
      `Last sync time: ${lastSyncTime || 'Never'}`,
      `Total syncs: ${syncCount}`,
      `FTP username: ${settings.ftpUsername || 'Unknown'}`,
      `User ID: ${settings.userId || 'Unknown'}`,
      `Background issues: ${backgroundIssues.length}`,
    ];

    const sections: SupportReportSection[] = [];

    if (connectionState.lastSyncResult) {
      sections.push({
        title: 'Last Sync Result',
        lines: [
          `Status: ${connectionState.lastSyncResult.status}`,
          `Synced trades: ${connectionState.lastSyncResult.synced_trades}`,
          `New files: ${connectionState.lastSyncResult.new_files}`,
          `Updated files: ${connectionState.lastSyncResult.updated_files}`,
        ],
      });
    }

    if (syncErrors.length > 0) {
      sections.push({
        title: `Sync Errors (${syncErrors.length})`,
        lines: syncErrors.map((error, index) => `${index + 1}. ${error}`),
      });
    }

    if (connectionState.lastSyncError) {
      sections.push({
        title: 'Sync Request Error',
        lines: formatSupportErrorDetails(connectionState.lastSyncError),
      });
    }

    if (ftpErrorDetails) {
      sections.push({
        title: 'FTP Error',
        lines: formatSupportErrorDetails(ftpErrorDetails),
      });
    }

    if (accountLinkErrorDetails) {
      sections.push({
        title: 'Account Relinking Error',
        lines: formatSupportErrorDetails(accountLinkErrorDetails),
      });
    }

    if (backgroundIssues.length > 0) {
      sections.push({
        title: `Background Issues (${backgroundIssues.length})`,
        lines: backgroundIssues.flatMap((issue, index) => {
          const detailPreview = issue.detail?.split('\n')[0];

          return [
            `${index + 1}. [${issue.source}] ${issue.message}`,
            `   Count: ${issue.count}`,
            `   Last seen: ${new Date(issue.lastSeenMs).toISOString()}`,
            ...(detailPreview ? [`   Detail: ${detailPreview}`] : []),
          ];
        }),
      });
    }

    return buildSupportReport(
      'Journalit Integration Report',
      metaLines,
      sections
    );
  }, [
    accountLinkErrorDetails,
    backgroundIssues,
    connectionState.lastSyncError,
    connectionState.lastSyncResult,
    connectionState.status,
    connectionState.syncStatus?.last_sync_time,
    connectionState.syncStatus?.sync_count,
    ftpErrorDetails,
    plugin.app.vault,
    plugin.manifest.version,
    hasAuthToken,
    settings.ftpUsername,
    settings.lastSyncTime,
    settings.serverUrl,
    settings.syncCount,
    settings.syncEnabled,
    settings.userId,
  ]);

  const handleCopyIntegrationReport = useCallback(async () => {
    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error('Clipboard not supported');
      }

      await navigator.clipboard.writeText(buildIntegrationErrorReport());
      setIntegrationReportCopied(true);

      if (integrationReportCopyTimerRef.current) {
        clearTimeout(integrationReportCopyTimerRef.current);
      }

      integrationReportCopyTimerRef.current = setTimeout(() => {
        setIntegrationReportCopied(false);
      }, 2000);
    } catch (error) {
      const errorContext = ErrorHandler.createContext(
        'copy to clipboard',
        undefined,
        ErrorHandler.extractStatusCode(error)
      );
      ErrorHandler.showError(
        new Error('Failed to copy to clipboard'),
        errorContext
      );
      ErrorHandler.logError(error, errorContext);
    }
  }, [buildIntegrationErrorReport]);

  const syncErrors = connectionState.lastSyncResult?.errors || [];
  const previewSyncErrors = syncErrors.slice(0, 5);
  const hasMoreSyncErrors = syncErrors.length > previewSyncErrors.length;

  const previewBackgroundIssues = backgroundIssues.slice(0, 3);
  const hasMoreBackgroundIssues =
    backgroundIssues.length > previewBackgroundIssues.length;

  const hasIntegrationErrors =
    syncErrors.length > 0 ||
    connectionState.lastSyncError !== null ||
    ftpErrorDetails !== null ||
    accountLinkErrorDetails !== null ||
    backgroundIssues.length > 0;

  const integrationErrorCount =
    syncErrors.length +
    (connectionState.lastSyncError ? 1 : 0) +
    (ftpErrorDetails ? 1 : 0) +
    (accountLinkErrorDetails ? 1 : 0) +
    backgroundIssues.length;

  return {
    accountLinkErrorDetails,
    accountState,
    autoDetectedUserId,
    backendService,
    backgroundIssues,
    checkConnectionStatus,
    connectionState,
    expandedSection,
    formatLastSyncTime,
    ftpErrorDetails,
    ftpState,
    handleCopyIntegrationReport,
    handleCreateFTPCredentials,
    handleForceSync,
    handleManageAccounts,
    handleRegisterVault,
    handleRelinkMtAccount,
    handleSyncEnabledToggle,
    handleUnlinkMtAccount,
    hasIntegrationErrors,
    hasMoreBackgroundIssues,
    hasMoreSyncErrors,
    integrationErrorCount,
    integrationErrorPanelRef,
    integrationReportCopied,
    loadAccounts,
    plugin,
    previewBackgroundIssues,
    previewSyncErrors,
    setAccountLinkErrorDetails,
    setExpandedSection,
    setFtpErrorDetails,
    settings,
    syncErrors,
  };
}

type BackendIntegrationTabModel = ReturnType<
  typeof useBackendIntegrationTabModel
>;

function BackendAccountsSection({
  expandedSection,
  setExpandedSection,
  connectionState,
  loadAccounts,
  accountState,
  backendService,
  formatLastSyncTime,
  handleUnlinkMtAccount,
  handleRelinkMtAccount,
  plugin,
  setAccountLinkErrorDetails,
}: Pick<
  BackendIntegrationTabModel,
  | 'expandedSection'
  | 'setExpandedSection'
  | 'connectionState'
  | 'loadAccounts'
  | 'accountState'
  | 'backendService'
  | 'formatLastSyncTime'
  | 'handleUnlinkMtAccount'
  | 'handleRelinkMtAccount'
  | 'plugin'
  | 'setAccountLinkErrorDetails'
>) {
  return (
    <>
      
      <Accordion
        title={t('backend.section.accounts.title')}
        expanded={expandedSection === 'accounts'}
        onExpandedChange={(expanded) =>
          setExpandedSection(expanded ? 'accounts' : null)
        }
      >
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('backend.accounts.linked')}
            </div>
            <div className="setting-item-description">
              {t('backend.accounts.linked-desc')}
              {connectionState.status === 'disconnected' && (
                <div className="backend-integration__connection-error">
                  <AlertTriangle size={16} />{' '}
                  {t('backend.accounts.server-disconnected')}
                </div>
              )}
            </div>
          </div>
          <div className="setting-item-control">
            <Button
              variant="secondary"
              onClick={() => loadAccounts()}
              disabled={accountState.isLoading || !backendService}
            >
              {t('backend.accounts.refresh')}
            </Button>
          </div>
        </div>

        {accountState.isLoading ? (
          <div className="setting-item">
            <div className="setting-item-info">
              <div className="backend-integration__loading">
                <LoadingSpinner
                  message={t('backend.accounts.loading')}
                  size="small"
                />
              </div>
            </div>
          </div>
        ) : accountState.accounts.length === 0 ? (
          <div className="setting-item">
            <div className="setting-item-info">
              <div className="setting-item-description">
                {t('backend.accounts.no-accounts')}
                {connectionState.status === 'connected'
                  ? t('backend.accounts.sync-to-detect')
                  : t('backend.accounts.connect-to-see')}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-accounts-list">
            {accountState.accounts.map((account) => (
              <div key={account.accountId} className="mt-account-item">
                <div className="mt-account-info">
                  <div className="mt-account-id">
                    {t('backend.accounts.account-id')}: {account.accountId}
                  </div>
                  {account.brokerName && (
                    <div className="mt-account-broker">
                      {t('backend.accounts.broker')}: {account.brokerName}
                    </div>
                  )}
                  <div className="mt-account-dates">
                    {account.firstSeen && (
                      <span>
                        {t('backend.accounts.first-seen')}:{' '}
                        {formatLastSyncTime(account.firstSeen)}
                      </span>
                    )}
                    {account.lastSeen && (
                      <span>
                        {' '}
                        | {t('backend.accounts.last-seen')}:{' '}
                        {formatLastSyncTime(account.lastSeen)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-account-display">
                  <div className="mt-account-name">
                    <span>
                      {account.displayName || `Account-${account.accountId}`}
                    </span>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-account-action-button"
                    onClick={() => handleUnlinkMtAccount(account)}
                  >
                    {t('backend.accounts.unlink')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="backend-integration__ignored-accounts">
          <Accordion
            title={`${t('backend.accounts.ignored.title')} · ${t(
              'backend.accounts.ignored.count',
              {
                count: String(accountState.ignoredAccounts.length),
              }
            )}`}
          >
            <div className="mt-accounts-list mt-accounts-list--ignored">
              {accountState.ignoredAccounts.length === 0 ? (
                <div className="setting-item">
                  <div className="setting-item-info">
                    <div className="setting-item-description">
                      {t('backend.accounts.ignored.empty')}
                    </div>
                  </div>
                </div>
              ) : (
                accountState.ignoredAccounts.map((account) => (
                  <div key={account.accountId} className="mt-account-item">
                    <div className="mt-account-info">
                      <div className="mt-account-id">
                        {t('backend.accounts.account-id')}: {account.accountId}
                      </div>
                      {account.brokerName && (
                        <div className="mt-account-broker">
                          {t('backend.accounts.broker')}: {account.brokerName}
                        </div>
                      )}
                      {account.ignoredAt && (
                        <div className="mt-account-dates">
                          <span>
                            {t('backend.accounts.ignored-at')}:{' '}
                            {formatLastSyncTime(account.ignoredAt)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-account-display">
                      <div className="mt-account-name">
                        <span>
                          {account.displayName ||
                            `Account-${account.accountId}`}
                        </span>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-account-action-button"
                        onClick={() => handleRelinkMtAccount(account)}
                      >
                        {t('backend.accounts.relink')}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Accordion>
        </div>

        
        {accountState.accounts.length > 0 && (
          <div className="backend-integration__account-linking-divider">
            <AccountLinkingManager
              plugin={plugin}
              accounts={accountState.accounts}
              onAccountsUpdated={loadAccounts}
              onErrorChange={setAccountLinkErrorDetails}
            />
          </div>
        )}
      </Accordion>
    </>
  );
}

function BackendIntegrationErrorPanel({
  hasIntegrationErrors,
  integrationErrorPanelRef,
  integrationErrorCount,
  previewSyncErrors,
  hasMoreSyncErrors,
  syncErrors,
  connectionState,
  ftpErrorDetails,
  accountLinkErrorDetails,
  previewBackgroundIssues,
  hasMoreBackgroundIssues,
  backgroundIssues,
  handleCopyIntegrationReport,
  integrationReportCopied,
}: Pick<
  BackendIntegrationTabModel,
  | 'hasIntegrationErrors'
  | 'integrationErrorPanelRef'
  | 'integrationErrorCount'
  | 'previewSyncErrors'
  | 'hasMoreSyncErrors'
  | 'syncErrors'
  | 'connectionState'
  | 'ftpErrorDetails'
  | 'accountLinkErrorDetails'
  | 'previewBackgroundIssues'
  | 'hasMoreBackgroundIssues'
  | 'backgroundIssues'
  | 'handleCopyIntegrationReport'
  | 'integrationReportCopied'
>) {
  return (
    <>
      {hasIntegrationErrors && (
        <div className="setting-item setting-item--full-width">
          <div className="setting-item-info">
            <div
              ref={integrationErrorPanelRef}
              className="backend-integration__sync-error-panel"
            >
              <div className="backend-integration__sync-error-header">
                <AlertTriangle size={16} />
                <span>
                  {t('common.error')} ({integrationErrorCount})
                </span>
              </div>

              {previewSyncErrors.length > 0 && (
                <ul className="backend-integration__sync-error-list">
                  {previewSyncErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              )}

              {hasMoreSyncErrors && (
                <div className="backend-integration__sync-error-more">
                  {t('csv.errors.raw-errors-limit', {
                    shown: String(previewSyncErrors.length),
                    total: String(syncErrors.length),
                  })}
                </div>
              )}

              {connectionState.lastSyncError && (
                <div className="backend-integration__sync-error-request">
                  Sync request: {connectionState.lastSyncError.message}
                </div>
              )}

              {ftpErrorDetails && (
                <div className="backend-integration__sync-error-request">
                  FTP: {ftpErrorDetails.message}
                </div>
              )}

              {accountLinkErrorDetails && (
                <div className="backend-integration__sync-error-request">
                  Account relinking: {accountLinkErrorDetails.message}
                </div>
              )}

              {previewBackgroundIssues.length > 0 && (
                <>
                  <div className="backend-integration__sync-error-request">
                    {t('csv.report.top-issues')}
                  </div>
                  <ul className="backend-integration__sync-error-list">
                    {previewBackgroundIssues.map((issue) => (
                      <li key={issue.key}>
                        [{issue.source}] {issue.message}
                        {issue.count > 1 ? ` (x${issue.count})` : ''}
                      </li>
                    ))}
                  </ul>

                  {hasMoreBackgroundIssues && (
                    <div className="backend-integration__sync-error-more">
                      {t('csv.errors.raw-errors-limit', {
                        shown: String(previewBackgroundIssues.length),
                        total: String(backgroundIssues.length),
                      })}
                    </div>
                  )}
                </>
              )}

              <SupportActions
                onCopy={handleCopyIntegrationReport}
                copied={integrationReportCopied}
                copyLabel={t('csv.errors.copy-report')}
                copiedLabel={t('csv.errors.copied')}
                discordLabel={t('button.discord')}
                note={t('csv.results.discord-note')}
                onDiscord={() =>
                  window.open('https://discord.gg/AkSw3D9h8b', '_blank')
                }
                actionsClassName="backend-integration__sync-error-actions"
                helpClassName="backend-integration__sync-discord-help"
                helpContentClassName="backend-integration__sync-discord-help-content"
                noteIconClassName="backend-integration__sync-discord-help-icon"
                renderButton={({ variant, onClick, content }) => (
                  <Button variant={variant} onClick={onClick}>
                    <div className="backend-integration__button-content">
                      {content}
                    </div>
                  </Button>
                )}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const BackendIntegrationTab: React.FC<BackendIntegrationTabProps> = (
  props
) => {
  const {
    accountLinkErrorDetails,
    accountState,
    autoDetectedUserId,
    backendService,
    backgroundIssues,
    checkConnectionStatus,
    connectionState,
    expandedSection,
    formatLastSyncTime,
    ftpErrorDetails,
    ftpState,
    handleCopyIntegrationReport,
    handleCreateFTPCredentials,
    handleForceSync,
    handleManageAccounts,
    handleRegisterVault,
    handleRelinkMtAccount,
    handleSyncEnabledToggle,
    handleUnlinkMtAccount,
    hasIntegrationErrors,
    hasMoreBackgroundIssues,
    hasMoreSyncErrors,
    integrationErrorCount,
    integrationErrorPanelRef,
    integrationReportCopied,
    loadAccounts,
    plugin,
    previewBackgroundIssues,
    previewSyncErrors,
    setAccountLinkErrorDetails,
    setExpandedSection,
    setFtpErrorDetails,
    settings,
    syncErrors,
  } = useBackendIntegrationTabModel(props);

  return (
    <div className="journalit-settings-tab backend-integration-settings">
      <div className="trade-sync-header">
        <h3>{t('backend.title')}</h3>
        <p className="setting-item-description">{t('backend.description')}</p>
      </div>

      
      <StatusCards
        connectionStatus={connectionState.status}
        onRefreshConnection={checkConnectionStatus}
        lastSyncTime={
          settings.lastSyncTime || connectionState.syncStatus?.last_sync_time
        }
        syncCount={
          settings.syncCount || connectionState.syncStatus?.sync_count || 0
        }
        isSyncing={connectionState.isSyncing}
        onForceSync={handleForceSync}
        accountCount={accountState.accounts.length}
        onManageAccounts={handleManageAccounts}
      />

      <BackendIntegrationErrorPanel
        hasIntegrationErrors={hasIntegrationErrors}
        integrationErrorPanelRef={integrationErrorPanelRef}
        integrationErrorCount={integrationErrorCount}
        previewSyncErrors={previewSyncErrors}
        hasMoreSyncErrors={hasMoreSyncErrors}
        syncErrors={syncErrors}
        connectionState={connectionState}
        ftpErrorDetails={ftpErrorDetails}
        accountLinkErrorDetails={accountLinkErrorDetails}
        previewBackgroundIssues={previewBackgroundIssues}
        hasMoreBackgroundIssues={hasMoreBackgroundIssues}
        backgroundIssues={backgroundIssues}
        handleCopyIntegrationReport={handleCopyIntegrationReport}
        integrationReportCopied={integrationReportCopied}
      />

      
      <Accordion
        title={t('backend.section.setup.title')}
        expanded={expandedSection === 'setup'}
        onExpandedChange={(expanded) =>
          setExpandedSection(expanded ? 'setup' : null)
        }
      >
        
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('backend.register.title')}
            </div>
            <div className="setting-item-description">
              {t('backend.register.description')}
            </div>
          </div>
          <div className="setting-item-control">
            <Button
              variant="primary"
              onClick={handleRegisterVault}
              disabled={connectionState.isSyncing || !backendService}
            >
              <div className="backend-integration__button-content">
                {connectionState.isSyncing && (
                  <LoadingSpinner size="small" message="" />
                )}
                {connectionState.isSyncing
                  ? t('backend.register.registering')
                  : t('backend.register.button')}
              </div>
            </Button>
          </div>
        </div>

        
        {connectionState.status === 'connected' && !ftpState.hasCredentials && (
          <div className="setting-item">
            <div className="setting-item-info">
              <div className="setting-item-name">{t('backend.ftp.title')}</div>
              <div className="setting-item-description">
                {t('backend.ftp.description')}
              </div>
            </div>
            <div className="setting-item-control">
              <Button
                variant="primary"
                onClick={handleCreateFTPCredentials}
                disabled={ftpState.isCreating || !backendService}
              >
                <div className="backend-integration__button-content">
                  {ftpState.isCreating && (
                    <LoadingSpinner size="small" message="" />
                  )}
                  {ftpState.isCreating
                    ? t('backend.ftp.creating')
                    : t('backend.ftp.create-button')}
                </div>
              </Button>
            </div>
          </div>
        )}

        
        {ftpState.hasCredentials && (
          <div className="setting-item setting-item--full-width">
            <FTPCredentialsSection
              userId={settings.ftpUsername || autoDetectedUserId}
              onErrorChange={setFtpErrorDetails}
            />
          </div>
        )}
      </Accordion>

      
      <Accordion
        title={t('backend.section.sync.title')}
        expanded={expandedSection === 'sync'}
        onExpandedChange={(expanded) =>
          setExpandedSection(expanded ? 'sync' : null)
        }
      >
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('backend.sync.auto-sync')}
            </div>
            <div className="setting-item-description">
              {t('backend.sync.auto-sync-desc')}
              <div className="backend-integration__sync-info">
                <Info size={16} /> {t('backend.sync.auto-sync-info')}
              </div>
            </div>
          </div>
          <div className="setting-item-control">
            <ToggleSwitch
              checked={settings.syncEnabled || false}
              onChange={handleSyncEnabledToggle}
              id="sync-enabled-toggle"
              ariaLabel={t('backend.sync.auto-sync-aria')}
            />
          </div>
        </div>

        {connectionState.lastSyncResult && (
          <div className="setting-item">
            <div className="setting-item-info">
              <div className="setting-item-name">
                {t('backend.sync.last-result')}
              </div>
              <div className="setting-item-description">
                {connectionState.lastSyncResult.synced_trades > 0 ? (
                  <>
                    <CheckCircle2 size={16} />{' '}
                    {t('backend.sync.synced-trades', {
                      trades: String(
                        connectionState.lastSyncResult.synced_trades
                      ),
                      files: String(connectionState.lastSyncResult.new_files),
                    })}
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> {t('backend.sync.no-new-trades')}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {(settings.lastSyncTime || connectionState.syncStatus) && (
          <div className="setting-item">
            <div className="setting-item-info">
              <div className="setting-item-name">
                {t('backend.sync.status')}
              </div>
              <div className="setting-item-description">
                {t('backend.sync.last-sync')}:{' '}
                {formatLastSyncTime(
                  settings.lastSyncTime ||
                    connectionState.syncStatus?.last_sync_time
                )}{' '}
                | {t('backend.sync.total-syncs')}:{' '}
                {settings.syncCount ||
                  connectionState.syncStatus?.sync_count ||
                  0}
              </div>
            </div>
          </div>
        )}
      </Accordion>

      <BackendAccountsSection
        expandedSection={expandedSection}
        setExpandedSection={setExpandedSection}
        connectionState={connectionState}
        loadAccounts={loadAccounts}
        accountState={accountState}
        backendService={backendService}
        formatLastSyncTime={formatLastSyncTime}
        handleUnlinkMtAccount={handleUnlinkMtAccount}
        handleRelinkMtAccount={handleRelinkMtAccount}
        plugin={plugin}
        setAccountLinkErrorDetails={setAccountLinkErrorDetails}
      />
    </div>
  );
};

class MtAccountUnlinkConfirmationModal extends Modal {
  constructor(
    app: App,
    private accountId: string,
    private onResult: (confirmed: boolean) => void
  ) {
    super(app);
    this.titleEl.setText(t('backend.accounts.unlink-title'));
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('p', {
      text: t('backend.accounts.unlink-confirm', {
        accountId: this.accountId,
      }),
    });

    const buttons = contentEl.createDiv({ cls: 'modal-button-container' });
    const cancelButton = buttons.createEl('button', {
      text: t('button.cancel'),
    });
    cancelButton.addEventListener('click', () => {
      this.close();
      this.onResult(false);
    });

    const unlinkButton = buttons.createEl('button', {
      text: t('backend.accounts.unlink'),
      cls: 'mod-warning',
    });
    unlinkButton.addEventListener('click', () => {
      this.close();
      this.onResult(true);
    });
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

function confirmMtAccountUnlink(app: App, accountId: string): Promise<boolean> {
  return new Promise((resolve) => {
    new MtAccountUnlinkConfirmationModal(app, accountId, resolve).open();
  });
}

BackendIntegrationTab.displayName = 'BackendIntegrationTab';
