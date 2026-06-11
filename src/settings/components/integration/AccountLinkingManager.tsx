

import React, { useState, useEffect } from 'react';
import { Notice } from 'obsidian';
import JournalitPlugin from '../../../main';
import { Button } from '../../../components/ui';
import { Select } from '../../../components/core';
import { AccountInfo } from '../../../settings/types';
import { t } from '../../../lang/helpers';
import { ErrorHandler } from '../../../utils/errorHandler';
import { SupportErrorDetails } from '../../../utils/supportReport';
import { eventBus } from '../../../services/events';

interface AccountLinkingManagerProps {
  plugin: JournalitPlugin;
  accounts: AccountInfo[];
  onAccountsUpdated: () => void;
  onErrorChange?: (details: SupportErrorDetails | null) => void;
}

export const AccountLinkingManager: React.FC<AccountLinkingManagerProps> = ({
  plugin,
  accounts,
  onAccountsUpdated,
  onErrorChange,
}) => {
  const [selectedSourceAccount, setSelectedSourceAccount] =
    useState<string>('');
  const [selectedTargetAccount, setSelectedTargetAccount] =
    useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [obsidianAccounts, setObsidianAccounts] = useState<
    Array<{ id: string; name: string }>
  >([]);

  
  useEffect(() => {
    const loadObsidianAccounts = async () => {
      if (!plugin.accountPageService) return;

      try {
        const accounts = await plugin.accountPageService.getAccountCatalog();
        const accountOptions = accounts.map((acc) => ({
          id: acc.id,
          name: acc.name,
        }));
        setObsidianAccounts(accountOptions);
      } catch (error) {
        console.error('Failed to load Obsidian accounts:', error);
      }
    };

    loadObsidianAccounts();
  }, [plugin]);

  const handleRelinkAccount = async () => {
    if (!selectedSourceAccount || !selectedTargetAccount) {
      new Notice(t('settings.account-linking.error.select-both'));
      return;
    }

    setIsProcessing(true);
    onErrorChange?.(null);

    try {
      
      const sourceAccount = accounts.find(
        (acc) => acc.accountId === selectedSourceAccount
      );
      if (!sourceAccount) {
        throw new Error(t('settings.account-linking.error.source-not-found'));
      }

      
      const targetObsidianAccount = obsidianAccounts.find(
        (acc) => acc.id === selectedTargetAccount
      );
      if (!targetObsidianAccount) {
        throw new Error(t('settings.account-linking.error.target-not-found'));
      }

      
      const currentMapping =
        plugin.settings.backendIntegration?.accountMapping || {};
      const currentAccountName =
        currentMapping[selectedSourceAccount] ||
        sourceAccount.displayName ||
        `Account-${selectedSourceAccount}`;

      if (currentAccountName === targetObsidianAccount.name) {
        new Notice(t('settings.account-linking.error.already-linked'));
        setIsProcessing(false);
        return;
      }

      
      const serviceManager = plugin.serviceManager;
      if (!serviceManager) {
        throw new Error(t('settings.account-linking.error.service-manager'));
      }

      const backendService =
        await serviceManager.getBackendIntegrationService();
      if (!backendService) {
        throw new Error(t('settings.account-linking.error.backend-service'));
      }

      
      
      
      const result = await backendService.relinkAccountTrades(
        selectedSourceAccount,
        currentAccountName,
        targetObsidianAccount.name,
        sourceAccount.displayName || `Account-${selectedSourceAccount}`,
        {
          suppressPostRelinkEvents: true,
        }
      );

      try {
        await backendService.updateAccountMapping(
          selectedSourceAccount,
          targetObsidianAccount.name,
          {
            previousDisplayName: currentAccountName,
          }
        );
      } catch (mappingError) {
        try {
          await backendService.relinkAccountTrades(
            selectedSourceAccount,
            targetObsidianAccount.name,
            currentAccountName,
            targetObsidianAccount.name,
            {
              suppressPostRelinkEvents: true,
              restrictToFilePaths: result.updatedFilePaths,
            }
          );
        } catch (rollbackError) {
          throw new Error(
            `Failed to persist account mapping after relink and failed rollback: ${
              mappingError instanceof Error
                ? mappingError.message
                : String(mappingError)
            }. Rollback error: ${
              rollbackError instanceof Error
                ? rollbackError.message
                : String(rollbackError)
            }`
          );
        }

        throw mappingError;
      }

      if (result.updatedFilePaths.length > 0) {
        eventBus.publish('trade:changed', {
          action: 'updated',
          filePaths: result.updatedFilePaths,
        });
      }

      new Notice(
        t('settings.account-linking.success.relinked', {
          count: String(result.updatedCount),
          source: sourceAccount.displayName || '',
          target: targetObsidianAccount.name,
        })
      );

      onErrorChange?.(null);

      
      setSelectedSourceAccount('');
      setSelectedTargetAccount('');

      
      onAccountsUpdated();
    } catch (error) {
      console.error('Failed to relink account:', error);
      const errorMessage =
        error instanceof Error ? error.message : t('error.unexpected');
      const errorContext = ErrorHandler.createContext(
        'relink account trades',
        undefined,
        ErrorHandler.extractStatusCode(error)
      );
      onErrorChange?.({
        message: errorMessage,
        operation: errorContext.operation,
        endpoint: errorContext.endpoint,
        statusCode: errorContext.statusCode,
        timestamp: new Date().toISOString(),
      });
      ErrorHandler.logError(error, errorContext);
      new Notice(
        t('settings.account-linking.error.relink-failed', {
          error: errorMessage,
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="account-linking-manager">
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.account-linking.title')}
          </div>
          <div className="setting-item-description">
            {t('settings.account-linking.description')}
          </div>
        </div>
      </div>

      <div className="account-linking-controls">
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.account-linking.source.title')}
            </div>
            <div className="setting-item-description">
              {t('settings.account-linking.source.description')}
            </div>
          </div>
          <div className="setting-item-control">
            <Select
              value={selectedSourceAccount}
              onChange={(value) => setSelectedSourceAccount(value)}
              options={accounts.map((acc) => {
                const currentMapping =
                  plugin.settings.backendIntegration?.accountMapping || {};
                const currentAccountName =
                  currentMapping[acc.accountId] ||
                  acc.displayName ||
                  `Account-${acc.accountId}`;
                return {
                  value: acc.accountId,
                  label: `${acc.displayName || `Account-${acc.accountId}`} (${acc.accountId}) → ${currentAccountName}`,
                };
              })}
              placeholder={t('settings.account-linking.source.placeholder')}
              className="account-linking-source-select"
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.account-linking.target.title')}
            </div>
            <div className="setting-item-description">
              {t('settings.account-linking.target.description')}
            </div>
          </div>
          <div className="setting-item-control">
            <Select
              value={selectedTargetAccount}
              onChange={(value) => setSelectedTargetAccount(value)}
              options={obsidianAccounts.map((acc) => ({
                value: acc.id,
                label: acc.name,
              }))}
              placeholder={t('settings.account-linking.target.placeholder')}
              className="account-linking-target-select"
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-control">
            <Button
              variant="primary"
              onClick={handleRelinkAccount}
              disabled={
                isProcessing || !selectedSourceAccount || !selectedTargetAccount
              }
            >
              {isProcessing
                ? t('settings.account-linking.button.processing')
                : t('settings.account-linking.button.relink')}
            </Button>
          </div>
        </div>

        {selectedSourceAccount && selectedTargetAccount && (
          <div className="account-linking-warning">
            {t('settings.account-linking.warning')}
          </div>
        )}
      </div>
    </div>
  );
};
