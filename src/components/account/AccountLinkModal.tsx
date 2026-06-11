

import React, { useRef, useState } from 'react';
import { AlertTriangle } from '../shared/icons/ObsidianIcon';
import { Modal, App } from 'obsidian';
import type { Root } from 'react-dom/client';
import { AccountInfo } from '../../settings/types';
import { AccountType } from '../../services/account/types';
import { OptionType } from '../../services/options';
import { Button } from '../ui/Button';
import { getApp } from '../../utils/obsidian';
import { formatDateDisplay, getUserDateFormat } from '../../utils/dateUtils';
import { hasTranslation, t } from '../../lang/helpers';

const EMPTY_EXISTING_ACCOUNTS: ExistingAccount[] = [];
const EMPTY_AVAILABLE_ACCOUNT_TYPES: string[] = [];

interface ExistingAccount {
  path: string;
  name: string;
}

interface AccountLinkModalProps {
  accountInfo: AccountInfo;
  existingAccounts?: ExistingAccount[]; 
  availableAccountTypes?: string[]; 
  onLink: (
    accountId: string,
    displayName: string,
    linkToExisting?: string,
    accountType?: AccountType
  ) => Promise<void>;
  onCancel: () => void;
}

type AccountLinkOption = 'new' | 'existing' | 'default';

interface AccountInfoSummaryProps {
  accountInfo: AccountInfo;
}

function AccountInfoSummary({ accountInfo }: AccountInfoSummaryProps) {
  return (
    <div className="account-info">
      <p>
        <strong>{t('account.link-modal.account-id')}</strong>{' '}
        {accountInfo.accountId}
      </p>
      {accountInfo.brokerName && (
        <p>
          <strong>{t('account.link-modal.broker')}</strong>{' '}
          {accountInfo.brokerName}
        </p>
      )}
      {accountInfo.firstSeen && (
        <p>
          <strong>{t('account.link-modal.first-seen')}</strong>{' '}
          {formatDateDisplay(
            new Date(accountInfo.firstSeen),
            getUserDateFormat()
          )}
        </p>
      )}
    </div>
  );
}

function getAccountTypeLabel(type: string): string {
  const key = `account.type.${type.toLowerCase()}`;
  return hasTranslation(key) ? t(key) : key;
}

interface AccountTypeSelectProps {
  availableAccountTypes: string[];
  selectedAccountType: AccountType;
  onChange: (accountType: AccountType) => void;
}

function AccountTypeSelect({
  availableAccountTypes,
  selectedAccountType,
  onChange,
}: AccountTypeSelectProps) {
  return (
    <div className="account-type-select">
      <label className="field-label">
        {t('account.link-modal.account-type')}
      </label>
      <select
        value={selectedAccountType}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value as AccountType)
        }
        className="modal-select"
      >
        {availableAccountTypes.map((type) => (
          <option key={type} value={type}>
            {getAccountTypeLabel(type)}
          </option>
        ))}
      </select>
    </div>
  );
}

interface LinkOptionsFormProps {
  accountInfo: AccountInfo;
  existingAccounts: ExistingAccount[];
  availableAccountTypes: string[];
  linkOption: AccountLinkOption;
  customName: string;
  selectedAccount: string;
  selectedAccountType: AccountType;
  onLinkOptionChange: (newOption: AccountLinkOption) => void;
  onCustomNameChange: (customName: string) => void;
  onSelectedAccountChange: (selectedAccount: string) => void;
  onSelectedAccountTypeChange: (selectedAccountType: AccountType) => void;
}

function LinkOptionsForm({
  accountInfo,
  existingAccounts,
  availableAccountTypes,
  linkOption,
  customName,
  selectedAccount,
  selectedAccountType,
  onLinkOptionChange,
  onCustomNameChange,
  onSelectedAccountChange,
  onSelectedAccountTypeChange,
}: LinkOptionsFormProps) {
  const hasExistingAccounts = existingAccounts.length > 0;

  return (
    <div className="link-options">
      <div className="modal-field">
        <label className="section-label">
          {t('account.link-modal.question')}
        </label>

        <div className="link-option-group">
          <label className="link-option">
            <input
              type="radio"
              name="linkOption"
              value="new"
              checked={linkOption === 'new'}
              onChange={() => onLinkOptionChange('new')}
            />
            <span>{t('account.link-modal.option.new')}</span>
          </label>

          {linkOption === 'new' && (
            <div className="custom-name-input">
              <input
                type="text"
                value={customName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onCustomNameChange(e.target.value)
                }
                placeholder={t('account.link-modal.placeholder.custom-name')}
                className="modal-input"
              />
              <AccountTypeSelect
                availableAccountTypes={availableAccountTypes}
                selectedAccountType={selectedAccountType}
                onChange={onSelectedAccountTypeChange}
              />
            </div>
          )}

          <label className="link-option">
            <input
              type="radio"
              name="linkOption"
              value="existing"
              checked={linkOption === 'existing'}
              onChange={() => onLinkOptionChange('existing')}
              disabled={!hasExistingAccounts}
            />
            <span>
              {t('account.link-modal.option.existing')}{' '}
              {!hasExistingAccounts
                ? t('account.link-modal.no-accounts-available')
                : ''}
            </span>
          </label>

          {linkOption === 'existing' && hasExistingAccounts && (
            <div className="existing-account-select">
              <select
                value={selectedAccount}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onSelectedAccountChange(e.target.value)
                }
                className="modal-select"
              >
                <option value="">
                  {t('account.link-modal.select-account')}
                </option>
                {existingAccounts.map((account) => (
                  <option key={account.path} value={account.path}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="link-option">
            <input
              type="radio"
              name="linkOption"
              value="default"
              checked={linkOption === 'default'}
              onChange={() => onLinkOptionChange('default')}
            />
            <span>
              {t('account.link-modal.option.default', {
                id: accountInfo.accountId,
              })}
            </span>
          </label>

          {linkOption === 'default' && (
            <AccountTypeSelect
              availableAccountTypes={availableAccountTypes}
              selectedAccountType={selectedAccountType}
              onChange={onSelectedAccountTypeChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const AccountLinkModal: React.FC<AccountLinkModalProps> = ({
  accountInfo,
  existingAccounts = EMPTY_EXISTING_ACCOUNTS, 
  availableAccountTypes = EMPTY_AVAILABLE_ACCOUNT_TYPES, 
  onLink,
  onCancel,
}) => {
  
  const defaultLinkOption = existingAccounts.length > 0 ? 'existing' : 'new';

  const [linkOption, setLinkOption] =
    useState<AccountLinkOption>(defaultLinkOption);
  const userHasSelectedOptionRef = useRef(false);
  const [customName, setCustomName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>(
    availableAccountTypes.length > 0
      ? (availableAccountTypes[0] as AccountType)
      : AccountType.DEMO
  );
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  
  const hasExistingAccounts = existingAccounts.length > 0;

  
  const handleLinkOptionChange = (newOption: AccountLinkOption) => {
    setLinkOption(newOption);
    userHasSelectedOptionRef.current = true;
    if (newOption !== 'existing') {
      setSelectedAccount('');
    }
  };

  
  React.useEffect(() => {
    if (
      availableAccountTypes.length > 0 &&
      !availableAccountTypes.includes(selectedAccountType)
    ) {
      setSelectedAccountType(availableAccountTypes[0] as AccountType);
    }
  }, [availableAccountTypes, selectedAccountType]);

  
  React.useEffect(() => {
    if (!userHasSelectedOptionRef.current) {
      const newDefaultOption = hasExistingAccounts ? 'existing' : 'new';
      setLinkOption(newDefaultOption);
    }
  }, [hasExistingAccounts]);

  const handleConfirm = async () => {
    setIsLoading(true);
    setFormError(null);

    try {
      let displayName = '';
      let linkToExisting: string | undefined;
      let accountType: AccountType | undefined;

      switch (linkOption) {
        case 'new':
          displayName =
            customName ||
            t('account.link-modal.default-name', { id: accountInfo.accountId });
          accountType = selectedAccountType;
          break;
        case 'existing':
          if (!selectedAccount) {
            setFormError(t('account.link-modal.notice.select-existing'));
            setIsLoading(false);
            return;
          }
          linkToExisting = selectedAccount;
          displayName =
            existingAccounts.find((a) => a.path === selectedAccount)?.name ||
            '';
          
          break;
        case 'default':
          displayName = t('account.link-modal.default-name', {
            id: accountInfo.accountId,
          });
          accountType = selectedAccountType;
          break;
      }

      await onLink(
        accountInfo.accountId,
        displayName,
        linkToExisting,
        accountType
      );
    } catch (error) {
      console.error('Failed to link account:', error);
      const message = t('account.link-modal.notice.failed', {
        error: error instanceof Error ? error.message : t('error.unexpected'),
      });
      setFormError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-link-modal">
      <h3>{t('account.link-modal.title')}</h3>

      {formError && (
        <div className="account-link-error">
          <AlertTriangle size={16} />
          <div className="account-link-error-content">
            <div className="account-link-error-title">{t('common.error')}</div>
            <div className="account-link-error-message">{formError}</div>
          </div>
        </div>
      )}

      <AccountInfoSummary accountInfo={accountInfo} />

      <LinkOptionsForm
        accountInfo={accountInfo}
        existingAccounts={existingAccounts}
        availableAccountTypes={availableAccountTypes}
        linkOption={linkOption}
        customName={customName}
        selectedAccount={selectedAccount}
        selectedAccountType={selectedAccountType}
        onLinkOptionChange={handleLinkOptionChange}
        onCustomNameChange={setCustomName}
        onSelectedAccountChange={setSelectedAccount}
        onSelectedAccountTypeChange={setSelectedAccountType}
      />

      <div className="modal-actions">
        <Button onClick={handleConfirm} disabled={isLoading} variant="primary">
          {isLoading
            ? t('account.link-modal.button.linking')
            : t('button.confirm')}
        </Button>
        <Button onClick={onCancel} disabled={isLoading} variant="secondary">
          {t('button.cancel')}
        </Button>
      </div>
    </div>
  );
};


export class AccountLinkModalWrapper extends Modal {
  private accountInfo: AccountInfo;
  private onLink: (
    accountId: string,
    displayName: string,
    linkToExisting?: string,
    accountType?: AccountType
  ) => Promise<void>;
  private onCancel: () => void;
  private existingAccounts: ExistingAccount[] = [];
  private availableAccountTypes: AccountType[] = [];
  private root: Root | null = null;

  constructor(
    app: App,
    accountInfo: AccountInfo,
    onLink: (
      accountId: string,
      displayName: string,
      linkToExisting?: string,
      accountType?: AccountType
    ) => Promise<void>,
    onCancel: () => void
  ) {
    super(app);
    this.accountInfo = accountInfo;
    this.onLink = onLink;
    this.onCancel = onCancel;
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    
    await Promise.all([
      this.loadExistingAccounts(),
      this.loadAvailableAccountTypes(),
    ]);

    
    const { injectAccountLinkModalStyles } =
      await import('../../styles/account/accountLinkModalStyles');

    const rootDiv = contentEl.createDiv();
    const { createRoot } = await import('react-dom/client');
    this.root = createRoot(rootDiv);

    this.root.render(
      <AccountLinkModal
        accountInfo={this.accountInfo}
        existingAccounts={this.existingAccounts}
        availableAccountTypes={this.availableAccountTypes}
        onLink={async (accountId, displayName, linkToExisting, accountType) => {
          await this.onLink(
            accountId,
            displayName,
            linkToExisting,
            accountType
          );
          this.close();
        }}
        onCancel={() => {
          this.onCancel();
          this.close();
        }}
      />
    );
  }

  private async loadExistingAccounts() {
    try {
      
      const plugin = getApp().plugins?.plugins?.['journalit'];
      const accountPageService = plugin?.accountPageService;

      if (!accountPageService) {
        console.warn(
          'AccountPageService not available for loading existing accounts'
        );
        this.existingAccounts = [];
        return;
      }

      const accounts = await accountPageService.getAccountCatalog();

      if (!accounts || !Array.isArray(accounts)) {
        console.warn('Invalid accounts data received:', accounts);
        this.existingAccounts = [];
        return;
      }

      this.existingAccounts = accounts.map((acc) => ({
        path: acc.name,
        name:
          acc.name ||
          t('account.link-modal.default-name', {
            id: acc.id || t('common.unknown'),
          }),
      }));
    } catch (error) {
      console.error('Failed to load existing accounts:', error);
      this.existingAccounts = [];
    }
  }

  private async loadAvailableAccountTypes() {
    try {
      
      const plugin = getApp().plugins?.plugins?.['journalit'];
      const optionsService = plugin?.optionsService;

      if (!optionsService) {
        console.warn(
          'Options service not available - using default account types'
        );
        
        this.availableAccountTypes = [
          AccountType.DEMO,
          AccountType.EVALUATION,
          AccountType.FUNDED,
        ];
        return;
      }

      
      const customAccountTypes = optionsService.getOptions(
        OptionType.ACCOUNT_TYPE
      );

      if (customAccountTypes && customAccountTypes.length > 0) {
        
        this.availableAccountTypes = customAccountTypes as AccountType[];
      } else {
        
        console.warn(
          'No custom account types found. Using default account types.'
        );
        this.availableAccountTypes = [
          AccountType.DEMO,
          AccountType.EVALUATION,
          AccountType.FUNDED,
        ];
      }
    } catch (error) {
      console.error('Failed to load available account types:', error);
      
      this.availableAccountTypes = [
        AccountType.DEMO,
        AccountType.EVALUATION,
        AccountType.FUNDED,
      ];
    }
  }

  onClose() {
    
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }

    const { contentEl } = this;
    contentEl.empty();
  }
}
