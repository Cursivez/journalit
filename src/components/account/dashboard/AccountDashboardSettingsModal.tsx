

import { App, Modal, Notice } from 'obsidian';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Plus } from '../../shared/icons/ObsidianIcon';
import { t } from '../../../lang/helpers';
import JournalitPlugin from '../../../main';
import { OptionType } from '../../../services/options/CustomOptionsService';
import { Button } from '../../ui/Button';
import { AccountType, DrawdownType } from '../../../services/account/types';
import { eventBus } from '../../../services/events';
import type { AccountCatalogEntry } from '../../../services/accountPage/types';
import { useEventBus } from '../../../hooks/useEventBus';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

type AccountTypeChangedDetails = Record<string, unknown>;

interface AccountDashboardGuideBindings {
  onClose?: () => void;
  registerTypesTarget?: (element: HTMLElement | null) => void;
  registerInclusionTarget?: (element: HTMLElement | null) => void;
  registerOrderTarget?: (element: HTMLElement | null) => void;
}

interface AccountDashboardSettingsModalProps {
  app: App;
  plugin: JournalitPlugin;
  onClose: () => void;
  onSave: () => void;
  guideBindings?: AccountDashboardGuideBindings;
}


export class AccountDashboardSettingsModal extends Modal {
  private props: AccountDashboardSettingsModalProps;
  private container: HTMLDivElement;
  private root: Root | null = null;

  constructor(props: AccountDashboardSettingsModalProps) {
    super(props.app);
    this.titleEl.setText(t('account.settings.modal.title'));
    this.props = props;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    

    
    this.container = contentEl.createDiv({
      cls: 'account-dashboard-settings-modal-container',
    });

    
    this.renderComponent();
  }

  onClose() {
    
    if (this.root) {
      this.root.unmount();
    }
    this.props.onClose();
  }

  private renderComponent() {
    this.root = createRoot(this.container);
    this.root.render(
      <AccountDashboardSettingsModalContent
        {...this.props}
        onModalClose={() => this.close()}
      />
    );
  }
}

function useAccountDashboardSettingsModel({
  plugin,
  onSave,
  onModalClose,
}: {
  plugin: JournalitPlugin;
  onSave: () => void;
  onModalClose: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [customAccountTypes, setCustomAccountTypes] = useState<string[]>([]);

  
  const [isAddingNewType, setIsAddingNewType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const newTypeInputRef = useRef<HTMLInputElement>(null);
  const [hoveredTypeIndex, setHoveredTypeIndex] = useState<number | null>(null);

  
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [accountTypeToDelete, setAccountTypeToDelete] = useState<string>('');
  const [deletionImpact, setDeletionImpact] = useState<{
    affectedAccounts: number;
    accountNames: string[];
    settingsImpact: {
      inExcludedTypes: boolean;
      inDisplayOrder: boolean;
      inWithdrawalSettings: boolean;
    };
  } | null>(null);

  
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [migrationTargetType, setMigrationTargetType] = useState<string>('');
  const [migrationOption, setMigrationOption] = useState<
    'reassign' | 'archive' | 'delete'
  >('reassign');

  
  const [dashboardSettings, setDashboardSettings] = useState<{
    excludedAccountTypes: string[];
    includeWithdrawalsFromExcluded: Record<string, boolean>;
    accountTypeOrder: string[];
  }>({
    excludedAccountTypes: [],
    includeWithdrawalsFromExcluded: {},
    accountTypeOrder: [],
  });
  const [guideVersion, setGuideVersion] = useState(0);

  
  const loadData = useCallback(() => {
    if (plugin.optionsService) {
      const types = plugin.optionsService.getOptions(OptionType.ACCOUNT_TYPE);
      setCustomAccountTypes(types);
    }

    
    if (plugin.settings?.account) {
      setDashboardSettings({
        excludedAccountTypes: [
          ...(plugin.settings.account.excludedAccountTypes || []),
        ],
        includeWithdrawalsFromExcluded: {
          ...(plugin.settings.account.includeWithdrawalsFromExcluded || {}),
        },
        accountTypeOrder: [
          ...(plugin.settings.account.accountTypeOrder || [
            'funded',
            'evaluation',
            'demo',
            'archived',
          ]),
        ],
      });
    }
  }, [plugin.optionsService, plugin.settings]);

  
  useEventBus('options:changed', loadData);

  
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const guideService = plugin.viewGuideService;
    if (!guideService) {
      return;
    }

    return guideService.subscribe(() => {
      setGuideVersion((prev) => prev + 1);
    });
  }, [plugin]);

  useEffect(() => {
    void guideVersion;

    const guideService = plugin.viewGuideService;
    if (!guideService) {
      return;
    }

    const activeLeaf = guideService.getActiveLeaf();
    if (!activeLeaf) {
      return;
    }

    const session = guideService.getSessionForLeaf(
      activeLeaf,
      'account-dashboard'
    );
    if (!session || session.guideId !== 'account-dashboard.main') {
      return;
    }

    if (session.currentStepId === 'open-account') {
      onModalClose();
    }
  }, [guideVersion, onModalClose, plugin]);

  const formatAccountType = (type: string): string => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const isArchivedAccountType = (type: string): boolean =>
    type.trim().toLowerCase() === 'archived';

  const moveArchivedToEnd = (types: string[]): string[] => {
    const archivedIndex = types.findIndex((type) =>
      isArchivedAccountType(type)
    );

    if (archivedIndex === -1) {
      return types;
    }

    const archivedType = types[archivedIndex];
    return [
      ...types.filter((_, index) => index !== archivedIndex),
      archivedType,
    ];
  };

  
  const handleAddAccountType = async () => {
    if (!newTypeName.trim()) {
      new Notice(t('account.settings.notice.name-empty'));
      return;
    }

    const trimmedName = newTypeName.trim().toLowerCase().replace(/\s+/g, '_');

    
    if (
      customAccountTypes.some(
        (type) => type.toLowerCase().replace(/\s+/g, '_') === trimmedName
      )
    ) {
      new Notice(
        t('account.settings.notice.type-exists', {
          name: formatAccountType(trimmedName),
        })
      );
      return;
    }

    
    if (isArchivedAccountType(trimmedName)) {
      new Notice(
        t('account.settings.notice.reserved-name', {
          name: formatAccountType(trimmedName),
        })
      );
      return;
    }

    try {
      setIsSaving(true);

      
      await plugin.optionsService.addOption(
        OptionType.ACCOUNT_TYPE,
        trimmedName
      );

      
      setCustomAccountTypes((currentTypes) =>
        currentTypes.includes(trimmedName)
          ? currentTypes
          : [...currentTypes, trimmedName]
      );

      
      const newOrder = moveArchivedToEnd([
        ...dashboardSettings.accountTypeOrder,
        trimmedName,
      ]);

      setDashboardSettings((currentSettings) => ({
        ...currentSettings,
        accountTypeOrder: newOrder,
        
        includeWithdrawalsFromExcluded: {
          ...currentSettings.includeWithdrawalsFromExcluded,
          [trimmedName]: false,
        },
      }));

      
      setNewTypeName('');
      setIsAddingNewType(false);

      
      dispatchAccountTypeChangedEvent('added', trimmedName);

      new Notice(
        t('account.settings.notice.type-added', {
          name: formatAccountType(trimmedName),
        })
      );
    } catch (error) {
      console.error('Error adding account type:', error);
      new Notice(
        t('account.settings.notice.add-error', {
          error: getErrorMessage(error),
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  
  const handleCancelAddAccountType = () => {
    setNewTypeName('');
    setIsAddingNewType(false);
  };

  
  const handleStartAddAccountType = () => {
    setIsAddingNewType(true);
    setNewTypeName('');
    window.requestAnimationFrame(() => newTypeInputRef.current?.focus());
  };

  
  const analyzeAccountTypeDeletionImpact = async (
    accountType: string
  ): Promise<{
    affectedAccounts: number;
    accountNames: string[];
    settingsImpact: {
      inExcludedTypes: boolean;
      inDisplayOrder: boolean;
      inWithdrawalSettings: boolean;
    };
  }> => {
    try {
      
      const allAccounts: AccountCatalogEntry[] =
        (await plugin.accountPageService?.getAccountCatalog()) ?? [];

      
      const affectedAccounts = allAccounts.filter(
        (account) =>
          account.accountType?.toLowerCase() === accountType.toLowerCase()
      );

      
      const settingsImpact = {
        inExcludedTypes: accountType
          ? dashboardSettings.excludedAccountTypes.includes(
              accountType.toLowerCase()
            )
          : false,
        inDisplayOrder: accountType
          ? dashboardSettings.accountTypeOrder.includes(
              accountType.toLowerCase()
            )
          : false,
        inWithdrawalSettings: accountType
          ? accountType.toLowerCase() in
            dashboardSettings.includeWithdrawalsFromExcluded
          : false,
      };

      return {
        affectedAccounts: affectedAccounts.length,
        accountNames: affectedAccounts.map(
          (account) => account.name || t('account.settings.unnamed-account')
        ),
        settingsImpact,
      };
    } catch (error) {
      console.error('Error analyzing account type deletion impact:', error);
      return {
        affectedAccounts: 0,
        accountNames: [],
        settingsImpact: {
          inExcludedTypes: false,
          inDisplayOrder: false,
          inWithdrawalSettings: false,
        },
      };
    }
  };

  
  const cleanupSettingsAfterDeletion = (deletedAccountType: string) => {
    const lowerType = deletedAccountType.toLowerCase();

    
    const newExcludedTypes = dashboardSettings.excludedAccountTypes.filter(
      (type) => type.toLowerCase() !== lowerType
    );

    
    const newDisplayOrder = moveArchivedToEnd(
      dashboardSettings.accountTypeOrder.filter(
        (type) => type.toLowerCase() !== lowerType
      )
    );

    
    const newWithdrawalSettings = {
      ...dashboardSettings.includeWithdrawalsFromExcluded,
    };
    delete newWithdrawalSettings[lowerType];

    
    const newDashboardSettings = {
      ...dashboardSettings,
      excludedAccountTypes: newExcludedTypes,
      accountTypeOrder: newDisplayOrder,
      includeWithdrawalsFromExcluded: newWithdrawalSettings,
    };

    
    setDashboardSettings(newDashboardSettings);

    
    if (!plugin.settings.account) {
      plugin.settings.account = {
        defaultAccountType: AccountType.DEMO,
        defaultDrawdownType: DrawdownType.NONE,
        defaultDrawdownAmount: 0,
        showBalanceInDashboard: true,
        excludedAccountTypes: [],
        includeWithdrawalsFromExcluded: {},
        accountTypeOrder: [],
        accountMetadata: {},
      };
    }

    
    plugin.settings.account.excludedAccountTypes = newExcludedTypes;
    plugin.settings.account.accountTypeOrder = newDisplayOrder;
    plugin.settings.account.includeWithdrawalsFromExcluded =
      newWithdrawalSettings;

    return {
      settings: newDashboardSettings,
      removedFromExcluded:
        dashboardSettings.excludedAccountTypes.length !==
        newExcludedTypes.length,
      removedFromDisplayOrder:
        dashboardSettings.accountTypeOrder.length !== newDisplayOrder.length,
      removedFromWithdrawalSettings:
        Object.keys(dashboardSettings.includeWithdrawalsFromExcluded).length !==
        Object.keys(newWithdrawalSettings).length,
    };
  };

  
  const handleDeleteAccountType = async (accountType: string) => {
    const normalizedType = accountType.toLowerCase();

    
    if (isArchivedAccountType(normalizedType)) {
      new Notice(t('account.settings.notice.cannot-delete-archived'));
      return;
    }

    try {
      setIsSaving(true);

      
      const impact = await analyzeAccountTypeDeletionImpact(accountType);

      
      setAccountTypeToDelete(accountType);
      setDeletionImpact(impact);
      setShowDeleteConfirmation(true);
    } catch (error) {
      console.error('Error analyzing deletion impact:', error);
      new Notice(t('account.settings.notice.analyze-error'));
    } finally {
      setIsSaving(false);
    }
  };

  
  const handleConfirmDeleteAccountType = async () => {
    if (!accountTypeToDelete) return;

    try {
      setIsSaving(true);

      

      if (deletionImpact && deletionImpact.affectedAccounts > 0) {
        new Notice(
          t('account.settings.notice.cannot-delete-has-accounts', {
            name: formatAccountType(accountTypeToDelete),
            count: deletionImpact.affectedAccounts.toString(),
          })
        );
        setShowDeleteConfirmation(false);
        return;
      }

      
      const deletionSuccess = await handleOperationWithRetry(async () => {
        await plugin.optionsService.removeOption(
          OptionType.ACCOUNT_TYPE,
          accountTypeToDelete
        );
      }, t('account.settings.operation.type-deletion'));

      if (!deletionSuccess) {
        return; 
      }

      
      const cleanupResult = cleanupSettingsAfterDeletion(accountTypeToDelete);

      
      if (!plugin.settings.account) {
        plugin.settings.account = {
          defaultAccountType: AccountType.DEMO,
          defaultDrawdownType: DrawdownType.NONE,
          defaultDrawdownAmount: 0,
          showBalanceInDashboard: true,
          excludedAccountTypes: [],
          includeWithdrawalsFromExcluded: {},
          accountTypeOrder: [],
          accountMetadata: {},
        };
      }

      plugin.settings.account.excludedAccountTypes =
        cleanupResult.settings.excludedAccountTypes;
      plugin.settings.account.includeWithdrawalsFromExcluded =
        cleanupResult.settings.includeWithdrawalsFromExcluded;
      plugin.settings.account.accountTypeOrder = moveArchivedToEnd(
        cleanupResult.settings.accountTypeOrder
      );

      await plugin.saveSettings();

      
      setCustomAccountTypes(
        customAccountTypes.filter(
          (type) => type.toLowerCase() !== accountTypeToDelete.toLowerCase()
        )
      );

      
      dispatchAccountTypeChangedEvent('deleted', accountTypeToDelete, {
        cleanupActions: {
          removedFromExcluded: cleanupResult.removedFromExcluded,
          removedFromDisplayOrder: cleanupResult.removedFromDisplayOrder,
          removedFromWithdrawalSettings:
            cleanupResult.removedFromWithdrawalSettings,
        },
      });

      
      setShowDeleteConfirmation(false);
      setAccountTypeToDelete('');
      setDeletionImpact(null);

      
      const cleanupActions = [];
      if (cleanupResult.removedFromExcluded)
        cleanupActions.push(
          t('account.settings.delete.cleanup.excluded').replace('✓ ', '')
        );
      if (cleanupResult.removedFromDisplayOrder)
        cleanupActions.push(
          t('account.settings.delete.cleanup.order').replace('✓ ', '')
        );
      if (cleanupResult.removedFromWithdrawalSettings)
        cleanupActions.push(
          t('account.settings.delete.cleanup.withdrawals').replace('✓ ', '')
        );

      if (cleanupActions.length > 0) {
        new Notice(
          t('account.settings.notice.type-deleted-with-cleanup', {
            name: formatAccountType(accountTypeToDelete),
            actions: cleanupActions.join(', '),
          })
        );
      } else {
        new Notice(
          t('account.settings.notice.type-deleted', {
            name: formatAccountType(accountTypeToDelete),
          })
        );
      }

      
      if (plugin.accountPageService) {
        await plugin.accountPageService.clearCacheWithPrefix(
          'allEnhancedAccounts'
        );
      }

      
      onSave();
    } catch (error) {
      console.error('Error deleting account type:', error);
      new Notice(
        t('account.settings.notice.delete-error', {
          error: getErrorMessage(error),
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  
  const handleCancelDeleteAccountType = () => {
    setShowDeleteConfirmation(false);
    setAccountTypeToDelete('');
    setDeletionImpact(null);
  };

  
  const handleStartMigration = () => {
    
    const availableTypes = customAccountTypes.filter(
      (type) => type.toLowerCase() !== accountTypeToDelete.toLowerCase()
    );

    if (availableTypes.length === 0) {
      new Notice(t('account.settings.notice.migration-no-targets'));
      return;
    }

    
    setMigrationTargetType(availableTypes[0]);
    setMigrationOption('reassign');

    
    setShowDeleteConfirmation(false);
    setShowMigrationModal(true);
  };

  
  const handleConfirmMigration = async () => {
    if (!deletionImpact || !accountTypeToDelete) return;

    try {
      setIsSaving(true);

      if (migrationOption === 'reassign' && !migrationTargetType) {
        new Notice(t('account.settings.notice.migration-target-required'));
        return;
      }

      
      const migrationResult = await migrateAccountsToNewType(
        accountTypeToDelete,
        migrationOption,
        migrationTargetType
      );

      if (!migrationResult.success) {
        new Notice(
          t('account.settings.notice.migration-failed', {
            error: migrationResult.error || t('common.unknown-error'),
          })
        );
        return;
      }

      
      const deletionSuccess = await handleOperationWithRetry(async () => {
        await plugin.optionsService.removeOption(
          OptionType.ACCOUNT_TYPE,
          accountTypeToDelete
        );
      }, t('account.settings.operation.type-deletion'));

      if (!deletionSuccess) {
        return; 
      }

      
      const cleanupResult = cleanupSettingsAfterDeletion(accountTypeToDelete);

      
      setCustomAccountTypes(
        customAccountTypes.filter(
          (type) => type.toLowerCase() !== accountTypeToDelete.toLowerCase()
        )
      );

      
      dispatchAccountTypeChangedEvent('migrated', accountTypeToDelete, {
        migrationOption,
        targetType: migrationTargetType,
        migratedCount: migrationResult.migratedCount,
        cleanupActions: {
          removedFromExcluded: cleanupResult.removedFromExcluded,
          removedFromDisplayOrder: cleanupResult.removedFromDisplayOrder,
          removedFromWithdrawalSettings:
            cleanupResult.removedFromWithdrawalSettings,
        },
      });

      
      setShowMigrationModal(false);
      setShowDeleteConfirmation(false);
      setAccountTypeToDelete('');
      setDeletionImpact(null);
      setMigrationTargetType('');

      
      let actionText = '';
      switch (migrationOption) {
        case 'reassign':
          actionText = t('account.settings.migration.action.reassigned', {
            target: formatAccountType(migrationTargetType),
          });
          break;
        case 'archive':
          actionText = t('account.settings.migration.action.archived');
          break;
        case 'delete':
          actionText = t('account.settings.migration.action.deleted');
          break;
      }

      new Notice(
        t('account.settings.notice.type-deleted-migrated', {
          name: formatAccountType(accountTypeToDelete),
          count: migrationResult.migratedCount.toString(),
          action: actionText,
        }),
        5000
      );

      
      await plugin.saveSettings();

      
      if (plugin.accountPageService) {
        
        await plugin.accountPageService.clearCacheWithPrefix(
          'allEnhancedAccounts'
        );
      }

      
      await new Promise((resolve) => window.setTimeout(resolve, 100));

      
      onSave();
    } catch (error) {
      console.error('Error during migration and deletion:', error);
      new Notice(
        t('account.settings.notice.migration-error', {
          error: getErrorMessage(error),
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  
  const handleCancelMigration = () => {
    setShowMigrationModal(false);
    setMigrationTargetType('');
    setMigrationOption('reassign');
    
    setShowDeleteConfirmation(true);
  };

  
  const migrateAccountsToNewType = async (
    fromType: string,
    migrationOption: 'reassign' | 'archive' | 'delete',
    targetType?: string
  ): Promise<{
    success: boolean;
    migratedCount: number;
    error?: string;
  }> => {
    try {
      
      const allAccounts: AccountCatalogEntry[] =
        (await plugin.accountPageService?.getAccountCatalog()) ?? [];
      const accountsToMigrate = allAccounts.filter(
        (account) =>
          account.accountType?.toLowerCase() === fromType.toLowerCase()
      );

      if (accountsToMigrate.length === 0) {
        return { success: true, migratedCount: 0 };
      }

      
      let finalTargetType: string;
      switch (migrationOption) {
        case 'reassign':
          if (!targetType) {
            return {
              success: false,
              migratedCount: 0,
              error: t('account.settings.migration.error.target-required'),
            };
          }
          finalTargetType = targetType;
          break;
        case 'archive':
          finalTargetType = 'archived';
          break;
        case 'delete':
          
          finalTargetType = 'deleted';
          break;
        default:
          return {
            success: false,
            migratedCount: 0,
            error: t('account.settings.migration.error.invalid-option'),
          };
      }

      
      let migratedCount = 0;
      const accountSettings = plugin.settings?.account;
      if (accountSettings?.accountMetadata) {
        const metadataKeyByAccountName = new Map<string, string>();
        for (const [key, metadata] of Object.entries(
          accountSettings.accountMetadata
        )) {
          if (!metadataKeyByAccountName.has(metadata.name)) {
            metadataKeyByAccountName.set(metadata.name, key);
          }
        }

        for (const account of accountsToMigrate) {
          const metadataKey = metadataKeyByAccountName.get(account.name);

          if (metadataKey) {
            
            accountSettings.accountMetadata[metadataKey].accountType =
              finalTargetType;
            accountSettings.accountMetadata[metadataKey].lastUpdated =
              new Date();
            migratedCount++;
          }
        }

        
        await plugin.saveSettings();
      }

      

      return { success: true, migratedCount };
    } catch (error) {
      console.error('Error migrating accounts:', error);
      return {
        success: false,
        migratedCount: 0,
        error: getErrorMessage(error),
      };
    }
  };

  
  const handleSave = async () => {
    try {
      setIsSaving(true);

      
      if (!plugin.settings.account) {
        plugin.settings.account = {
          defaultAccountType: AccountType.DEMO,
          defaultDrawdownType: DrawdownType.NONE,
          defaultDrawdownAmount: 0,
          showBalanceInDashboard: true,
          excludedAccountTypes: [],
          includeWithdrawalsFromExcluded: {},
          accountTypeOrder: [],
          accountMetadata: {},
        };
      }

      const normalizedOrder = moveArchivedToEnd(
        dashboardSettings.accountTypeOrder.map((type) => type.toLowerCase())
      );

      plugin.settings.account.excludedAccountTypes =
        dashboardSettings.excludedAccountTypes;
      plugin.settings.account.includeWithdrawalsFromExcluded =
        dashboardSettings.includeWithdrawalsFromExcluded;
      plugin.settings.account.accountTypeOrder = normalizedOrder;

      await plugin.saveSettings();

      eventBus.publish('settings:changed', {
        component: 'account-dashboard',
        section: 'accountTypeOrder',
        source: 'account-dashboard-settings-modal',
        settings: {
          excludedAccountTypes: dashboardSettings.excludedAccountTypes,
          includeWithdrawalsFromExcluded:
            dashboardSettings.includeWithdrawalsFromExcluded,
          accountTypeOrder: normalizedOrder,
        },
      });

      new Notice(t('account.settings.notice.saved'));

      
      onSave();

      
      onModalClose();
    } catch (error) {
      console.error('Error saving account dashboard settings:', error);
      new Notice(
        t('account.settings.notice.save-error', {
          error: getErrorMessage(error),
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  
  const dispatchAccountTypeChangedEvent = (
    action: 'added' | 'deleted' | 'migrated',
    accountType: string,

    details?: AccountTypeChangedDetails
  ) => {
    try {
      
      eventBus.publish('account:changed', {
        action: 'type-changed',
        timestamp: Date.now(),
        accountType,
        ...details,
      });
    } catch (error) {
      console.error('Error dispatching account type changed event:', error);
    }
  };

  
  const handleOperationWithRetry = async (
    operation: () => Promise<void>,
    operationName: string,
    maxRetries: number = 2
  ): Promise<boolean> => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await operation();
        return true;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `${operationName} failed (attempt ${attempt}/${maxRetries}):`,
          error
        );

        if (attempt < maxRetries) {
          
          await new Promise((resolve) =>
            window.setTimeout(resolve, attempt * 1000)
          );
        }
      }
    }

    
    new Notice(
      t('account.settings.notice.operation-failed', {
        operation: operationName,
        error: lastError?.message || t('common.unknown-error'),
      })
    );
    return false;
  };

  const availableMigrationTypes = accountTypeToDelete
    ? customAccountTypes.filter(
        (type) => type.toLowerCase() !== accountTypeToDelete.toLowerCase()
      )
    : [];

  const accountMigrationModal =
    showMigrationModal && deletionImpact && accountTypeToDelete ? (
      <div className="account-migration-modal-overlay">
        <div className="account-type-delete-modal account-migration-modal">
          <h3>{t('account.settings.migration.title')}</h3>

          <div className="delete-modal-content">
            <div className="migration-warning">
              <p>
                <strong>
                  {t('account.settings.migration.warning', {
                    name: formatAccountType(accountTypeToDelete),
                    count: deletionImpact.affectedAccounts.toString(),
                  })}
                </strong>
              </p>
              <p>{t('account.settings.migration.instruction')}</p>
              <ul className="affected-accounts-list">
                {deletionImpact.accountNames.slice(0, 3).map((name) => (
                  <li key={name}>{name}</li>
                ))}
                {deletionImpact.accountNames.length > 3 && (
                  <li>
                    {t('account.settings.migration.more-accounts', {
                      count: (
                        deletionImpact.accountNames.length - 3
                      ).toString(),
                    })}
                  </li>
                )}
              </ul>
            </div>

            <div className="migration-options">
              <h4>{t('account.settings.migration.choose-option')}</h4>

              <div className="migration-option-group">
                <label
                  className="migration-option"
                  htmlFor="migration-option-reassign"
                  aria-label={t(
                    'account.settings.migration.option.reassign.title'
                  )}
                >
                  <input
                    id="migration-option-reassign"
                    type="radio"
                    name="migrationOption"
                    value="reassign"
                    checked={migrationOption === 'reassign'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      if (
                        value === 'reassign' ||
                        value === 'archive' ||
                        value === 'delete'
                      ) {
                        setMigrationOption(value);
                      }
                    }}
                  />
                  <span className="migration-option-content">
                    <span className="migration-option-title">
                      {t('account.settings.migration.option.reassign.title')}
                    </span>
                    <span className="migration-option-desc">
                      {t('account.settings.migration.option.reassign.desc')}
                    </span>
                  </span>
                </label>

                {migrationOption === 'reassign' && (
                  <div className="target-type-select">
                    <label htmlFor="account-migration-target-type">
                      {t('account.settings.migration.target-type.label')}
                    </label>
                    <select
                      id="account-migration-target-type"
                      value={migrationTargetType}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setMigrationTargetType(e.target.value)
                      }
                      disabled={isSaving}
                    >
                      {availableMigrationTypes.map((type) => (
                        <option key={type} value={type}>
                          {formatAccountType(type)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <label
                  className="migration-option"
                  htmlFor="migration-option-archive"
                  aria-label={t(
                    'account.settings.migration.option.archive.title'
                  )}
                >
                  <input
                    id="migration-option-archive"
                    type="radio"
                    name="migrationOption"
                    value="archive"
                    checked={migrationOption === 'archive'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      if (
                        value === 'reassign' ||
                        value === 'archive' ||
                        value === 'delete'
                      ) {
                        setMigrationOption(value);
                      }
                    }}
                  />
                  <span className="migration-option-content">
                    <span className="migration-option-title">
                      {t('account.settings.migration.option.archive.title')}
                    </span>
                    <span className="migration-option-desc">
                      {t('account.settings.migration.option.archive.desc')}
                    </span>
                  </span>
                </label>

                <label
                  className="migration-option"
                  htmlFor="migration-option-delete"
                  aria-label={t(
                    'account.settings.migration.option.delete.title'
                  )}
                >
                  <input
                    id="migration-option-delete"
                    type="radio"
                    name="migrationOption"
                    value="delete"
                    checked={migrationOption === 'delete'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      if (
                        value === 'reassign' ||
                        value === 'archive' ||
                        value === 'delete'
                      ) {
                        setMigrationOption(value);
                      }
                    }}
                  />
                  <span className="migration-option-content">
                    <span className="migration-option-title">
                      {t('account.settings.migration.option.delete.title')}
                    </span>
                    <span className="migration-option-desc">
                      {t('account.settings.migration.option.delete.desc')}
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="delete-modal-actions">
            <Button
              variant="plain"
              onClick={() => void handleCancelMigration()}
              disabled={isSaving}
            >
              {t('button.cancel')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => void handleConfirmMigration()}
              disabled={
                isSaving ||
                (migrationOption === 'reassign' && !migrationTargetType)
              }
              className="delete-confirm-button"
            >
              {isSaving
                ? t('account.settings.migration.button.migrating')
                : t('account.settings.migration.button.migrate')}
            </Button>
          </div>
        </div>
      </div>
    ) : null;

  const deleteConfirmationModal =
    showDeleteConfirmation && deletionImpact ? (
      <div className="account-type-delete-modal-overlay">
        <div className="account-type-delete-modal">
          <h3>{t('account.settings.delete.title')}</h3>

          <div className="delete-modal-content">
            <div className="delete-warning">
              <p>
                <strong>
                  {t('account.settings.delete.confirm-question', {
                    name: formatAccountType(accountTypeToDelete),
                  })}
                </strong>
              </p>
            </div>

            
            <div className="impact-analysis">
              <h4>{t('account.settings.delete.impact-analysis')}</h4>

              {deletionImpact.affectedAccounts > 0 ? (
                <div className="affected-accounts">
                  <div className="impact-item impact-critical">
                    <strong>
                      {t('account.settings.delete.affected-accounts', {
                        count: deletionImpact.affectedAccounts.toString(),
                      })}
                    </strong>
                    <ul>
                      {deletionImpact.accountNames.slice(0, 5).map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                      {deletionImpact.accountNames.length > 5 && (
                        <li>
                          {t('account.settings.migration.more-accounts', {
                            count: (
                              deletionImpact.accountNames.length - 5
                            ).toString(),
                          })}
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="migration-notice">
                    <strong>{t('common.info')}:</strong>{' '}
                    {t('account.settings.delete.migration-notice')}
                  </div>
                </div>
              ) : (
                <div className="no-affected-accounts">
                  <div className="impact-item impact-safe">
                    {t('account.settings.delete.no-affected')}
                  </div>
                </div>
              )}

              
              <div className="settings-cleanup">
                <h5>{t('account.settings.delete.cleanup-title')}</h5>
                <ul>
                  {deletionImpact.settingsImpact.inExcludedTypes && (
                    <li>{t('account.settings.delete.cleanup.excluded')}</li>
                  )}
                  {deletionImpact.settingsImpact.inDisplayOrder && (
                    <li>{t('account.settings.delete.cleanup.order')}</li>
                  )}
                  {deletionImpact.settingsImpact.inWithdrawalSettings && (
                    <li>{t('account.settings.delete.cleanup.withdrawals')}</li>
                  )}
                  {!deletionImpact.settingsImpact.inExcludedTypes &&
                    !deletionImpact.settingsImpact.inDisplayOrder &&
                    !deletionImpact.settingsImpact.inWithdrawalSettings && (
                      <li>{t('account.settings.delete.cleanup.none')}</li>
                    )}
                </ul>
              </div>
            </div>
          </div>

          <div className="delete-modal-actions">
            {deletionImpact.affectedAccounts > 0 ? (
              <>
                <Button
                  variant="plain"
                  onClick={() => void handleCancelDeleteAccountType()}
                  disabled={isSaving}
                >
                  {t('button.cancel')}
                </Button>
                <Button
                  variant="primary"
                  onClick={() => void handleStartMigration()}
                  disabled={isSaving}
                >
                  {t('account.settings.delete.button.setup-migration')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="plain"
                  onClick={() => void handleCancelDeleteAccountType()}
                  disabled={isSaving}
                >
                  {t('button.cancel')}
                </Button>
                <Button
                  variant="primary"
                  onClick={() => void handleConfirmDeleteAccountType()}
                  disabled={isSaving}
                  className="delete-confirm-button"
                >
                  {isSaving
                    ? t('account.settings.delete.button.deleting')
                    : t('account.settings.delete.button.delete')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    ) : null;

  return {
    isSaving,
    customAccountTypes,
    isAddingNewType,
    newTypeName,
    hoveredTypeIndex,
    dashboardSettings,
    accountMigrationModal,
    deleteConfirmationModal,
    setNewTypeName,
    setHoveredTypeIndex,
    setDashboardSettings,
    formatAccountType,
    isArchivedAccountType,
    moveArchivedToEnd,
    handleAddAccountType,
    handleCancelAddAccountType,
    handleStartAddAccountType,
    handleDeleteAccountType,
    newTypeInputRef,
    handleSave,
  };
}

type AccountDashboardSettingsModel = ReturnType<
  typeof useAccountDashboardSettingsModel
>;

function AvailableAccountTypesSection({
  model,
  registerTarget,
}: {
  model: AccountDashboardSettingsModel;
  registerTarget?: (element: HTMLElement | null) => void;
}) {
  const {
    isSaving,
    customAccountTypes,
    isAddingNewType,
    newTypeName,
    hoveredTypeIndex,
    setNewTypeName,
    setHoveredTypeIndex,
    formatAccountType,
    isArchivedAccountType,
    handleAddAccountType,
    handleCancelAddAccountType,
    handleStartAddAccountType,
    handleDeleteAccountType,
    newTypeInputRef,
  } = model;

  return (
    <>
      
      <div className="setting-item" ref={registerTarget}>
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('account.settings.section.available-types.title')}
          </div>
          <div className="setting-item-description">
            {t('account.settings.section.available-types.desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <div className="available-account-types">
            {customAccountTypes.length > 0 ? (
              <div className="account-types-container">
                {customAccountTypes.map((type, index) => (
                  <div
                    key={type}
                    className="account-type-badge-container"
                    onMouseEnter={() => setHoveredTypeIndex(index)}
                    onMouseLeave={() => setHoveredTypeIndex(null)}
                  >
                    <div className="account-type-badge">
                      {formatAccountType(type)}
                      
                      {hoveredTypeIndex === index &&
                        !isArchivedAccountType(type) && (
                          <button
                            className="account-type-delete-btn clickable-icon"
                            onClick={() => void handleDeleteAccountType(type)}
                            aria-label={t(
                              'account.settings.section.available-types.delete-aria',
                              {
                                name: formatAccountType(type),
                              }
                            )}
                            disabled={isSaving}
                          >
                            ×
                          </button>
                        )}
                    </div>
                  </div>
                ))}

                
                <div className="add-account-type-section">
                  {isAddingNewType ? (
                    <div className="add-account-type-input">
                      <input
                        ref={newTypeInputRef}
                        type="text"
                        value={newTypeName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewTypeName(e.target.value)
                        }
                        placeholder={t(
                          'account.settings.section.available-types.placeholder'
                        )}
                        onKeyDown={(
                          e: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                          if (e.key === 'Enter') {
                            void handleAddAccountType();
                          } else if (e.key === 'Escape') {
                            handleCancelAddAccountType();
                          }
                        }}
                        disabled={isSaving}
                        className="account-type-name-input"
                      />
                      <div className="add-account-type-buttons">
                        <button
                          onClick={() => void handleAddAccountType()}
                          disabled={isSaving || !newTypeName.trim()}
                          className="add-account-type-confirm-btn"
                          aria-label={t('button.add')}
                        >
                          {t('button.add')}
                        </button>
                        <button
                          onClick={() => void handleCancelAddAccountType()}
                          disabled={isSaving}
                          className="add-account-type-cancel-btn"
                          aria-label={t('button.cancel')}
                        >
                          {t('button.cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => void handleStartAddAccountType()}
                      disabled={isSaving}
                      className="add-account-type-btn clickable-icon"
                      aria-label={t(
                        'account.settings.section.available-types.add-aria'
                      )}
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-account-types-container">
                <div className="no-account-types">
                  {t('account.settings.section.available-types.empty')}
                </div>
                <button
                  onClick={() => void handleStartAddAccountType()}
                  disabled={isSaving}
                  className="add-account-type-btn clickable-icon"
                  aria-label={t(
                    'account.settings.section.available-types.add-aria'
                  )}
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function DashboardInclusionSection({
  model,
  registerTarget,
}: {
  model: AccountDashboardSettingsModel;
  registerTarget?: (element: HTMLElement | null) => void;
}) {
  const {
    customAccountTypes,
    dashboardSettings,
    setDashboardSettings,
    formatAccountType,
    isArchivedAccountType,
    moveArchivedToEnd,
  } = model;

  const currentOrder =
    dashboardSettings.accountTypeOrder.length > 0
      ? dashboardSettings.accountTypeOrder
      : ['funded', 'evaluation', 'demo', 'archived'];
  const normalizedOrder = currentOrder.map((type) => type.toLowerCase());
  const orderWithArchived = normalizedOrder.includes('archived')
    ? normalizedOrder
    : [...normalizedOrder, 'archived'];
  const allTypesLower = new Set([
    ...customAccountTypes.map((type) => type.toLowerCase()),
    ...orderWithArchived,
  ]);
  const labelMap = new Map<string, string>();
  customAccountTypes.forEach((type) => labelMap.set(type.toLowerCase(), type));
  orderWithArchived.forEach((typeKey) => {
    if (!labelMap.has(typeKey)) {
      labelMap.set(typeKey, formatAccountType(typeKey));
    }
  });
  const orderedTypeKeys: string[] = [];
  orderWithArchived.forEach((typeKey) => {
    if (allTypesLower.has(typeKey)) {
      orderedTypeKeys.push(typeKey);
      allTypesLower.delete(typeKey);
    }
  });
  allTypesLower.forEach((typeKey) => orderedTypeKeys.push(typeKey));
  const orderedTypeKeysWithArchivedLast = moveArchivedToEnd(orderedTypeKeys);
  const archivedIndex = orderedTypeKeysWithArchivedLast.findIndex((typeKey) =>
    isArchivedAccountType(typeKey)
  );
  const lastMovableIndex =
    archivedIndex === -1
      ? orderedTypeKeysWithArchivedLast.length - 1
      : archivedIndex - 1;

  const moveType = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedTypeKeysWithArchivedLast];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newOrder.length) return;
    if (
      isArchivedAccountType(newOrder[index]) ||
      isArchivedAccountType(newOrder[newIndex])
    ) {
      return;
    }

    [newOrder[index], newOrder[newIndex]] = [
      newOrder[newIndex],
      newOrder[index],
    ];

    setDashboardSettings((currentSettings) => ({
      ...currentSettings,
      accountTypeOrder: moveArchivedToEnd(newOrder),
    }));
  };

  return (
    <>
      
      <div className="setting-item" ref={registerTarget}>
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('account.settings.section.inclusion.title')}
          </div>
          <div className="setting-item-description">
            {t('account.settings.section.inclusion.desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <div className="account-types-settings-table">
            {orderedTypeKeysWithArchivedLast.length > 0 ? (
              <div className="account-types-list">
                {orderedTypeKeysWithArchivedLast.map((lowerType, index) => {
                  const canMoveUp =
                    !isArchivedAccountType(lowerType) && index > 0;
                  const canMoveDown =
                    !isArchivedAccountType(lowerType) &&
                    index < lastMovableIndex;
                  const isExcluded =
                    dashboardSettings.excludedAccountTypes.includes(lowerType);
                  const includeWithdrawals =
                    dashboardSettings.includeWithdrawalsFromExcluded[
                      lowerType
                    ] || false;

                  return (
                    <div key={lowerType} className="account-type-setting-row">
                      <div className="account-type-name">
                        {formatAccountType(
                          labelMap.get(lowerType) ?? lowerType
                        )}
                      </div>
                      <div className="account-type-controls">
                        <label className="toggle-label">
                          <input
                            type="checkbox"
                            checked={!isExcluded}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const isChecked = e.target.checked;
                              setDashboardSettings((currentSettings) => {
                                const newExcluded = [
                                  ...currentSettings.excludedAccountTypes,
                                ];
                                if (!isChecked) {
                                  
                                  if (!newExcluded.includes(lowerType)) {
                                    newExcluded.push(lowerType);
                                  }
                                } else {
                                  
                                  const excludedIndex =
                                    newExcluded.indexOf(lowerType);
                                  if (excludedIndex !== -1) {
                                    newExcluded.splice(excludedIndex, 1);
                                  }
                                }

                                return {
                                  ...currentSettings,
                                  excludedAccountTypes: newExcluded,
                                };
                              });
                            }}
                          />
                          <span>
                            {t(
                              'account.settings.section.inclusion.include-dashboard'
                            )}
                          </span>
                        </label>
                        <label className="toggle-label">
                          <input
                            type="checkbox"
                            checked={includeWithdrawals}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const isChecked = e.target.checked;
                              setDashboardSettings((currentSettings) => ({
                                ...currentSettings,
                                includeWithdrawalsFromExcluded: {
                                  ...currentSettings.includeWithdrawalsFromExcluded,
                                  [lowerType]: isChecked,
                                },
                              }));
                            }}
                          />
                          <span>
                            {t(
                              'account.settings.section.inclusion.include-withdrawals'
                            )}
                          </span>
                        </label>
                        <div className="order-controls account-type-setting-order-controls">
                          {!isArchivedAccountType(lowerType) && (
                            <>
                              <button
                                type="button"
                                className="order-button clickable-icon"
                                disabled={!canMoveUp}
                                onClick={() => moveType(index, 'up')}
                                aria-label={t(
                                  'account.settings.section.order.move-up'
                                )}
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                className="order-button clickable-icon"
                                disabled={!canMoveDown}
                                onClick={() => moveType(index, 'down')}
                                aria-label={t(
                                  'account.settings.section.order.move-down'
                                )}
                              >
                                ↓
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="journalit-u-text-muted">
                {t('account.settings.section.inclusion.empty')}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function SettingsModalActions({
  model,
  onModalClose,
}: {
  model: AccountDashboardSettingsModel;
  onModalClose: () => void;
}) {
  const { isSaving, handleSave } = model;

  return (
    <>
      
      <div className="settings-modal-buttons">
        <Button
          variant="plain"
          onClick={onModalClose}
          disabled={isSaving}
          className="cancel-button"
        >
          {t('button.cancel')}
        </Button>
        <Button
          variant="primary"
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="save-settings-button"
        >
          {isSaving
            ? t('account.settings.button.saving')
            : t('account.settings.button.save')}
        </Button>
      </div>
    </>
  );
}


const AccountDashboardSettingsModalContent: React.FC<
  AccountDashboardSettingsModalProps & { onModalClose: () => void }
> = ({ app: _app, plugin, onSave, onModalClose, guideBindings }) => {
  const model = useAccountDashboardSettingsModel({
    plugin,
    onSave,
    onModalClose,
  });

  return (
    <div className="account-dashboard-settings-form">
      
      {model.accountMigrationModal}

      
      {model.deleteConfirmationModal}

      <AvailableAccountTypesSection
        model={model}
        registerTarget={guideBindings?.registerTypesTarget}
      />

      <DashboardInclusionSection
        model={model}
        registerTarget={guideBindings?.registerInclusionTarget}
      />

      <SettingsModalActions model={model} onModalClose={onModalClose} />
    </div>
  );
};


export function openAccountDashboardSettingsModal(
  app: App,
  plugin: JournalitPlugin,
  onSave: () => void,
  guideBindings?: AccountDashboardGuideBindings
): AccountDashboardSettingsModal {
  const modal = new AccountDashboardSettingsModal({
    app,
    plugin,
    onClose: () => {
      guideBindings?.onClose?.();
    },
    onSave,
    guideBindings,
  });
  modal.open();
  return modal;
}
