

import { App, Modal, Notice } from 'obsidian';
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot, Root } from 'react-dom/client';
import JournalitPlugin from '../../../main';
import {
  AccountData,
  AccountType,
  DrawdownType,
  ProfitTargetType,
  ManualDrawdownSnapshot,
} from '../../../services/account/types';
import { OptionType } from '../../../services/options/CustomOptionsService';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';
import { Button } from '../../ui/Button';
import { Checkbox } from '../../ui';
import { FastDateTimeInput } from '../../core/FastDateTimeInput';
import {
  formatDateDisplay,
  getUserDateFormat,
  safeParseDateValue,
} from '../../../utils/dateUtils';
import { CurrencyProvider } from '../../../contexts/CurrencyContext';
import {
  CurrencyCode,
  CURRENCY_CONFIGS,
  parseCuratedCurrencyCode,
} from '../../../utils/currencyConfig';
import { ManualDrawdownManager } from './ManualDrawdownManager';
import { useEventBus } from '../../../hooks';
import { eventBus } from '../../../services/events';
import { t } from '../../../lang/helpers';
import {
  hasLiveBalanceAdjustment,
  parseLiveBalanceInput,
  toLiveBalanceAdjustment,
} from '../../../services/account/liveBalanceAdjustment';
import type { CopyTradingPeriod } from '../../../settings/types';
import {
  isValidCopyTradingMultiplier,
  hasActiveCopyTradingPeriod,
  isAccountUsedAsActiveCopyBase,
} from '../../../utils/accountCopyTrading';

export const EDIT_ACCOUNT_MODAL_STYLES = `
        .edit-account-form .manage-snapshots-button {
          padding: 8px 16px;
          background-color: var(--interactive-accent);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          white-space: normal;
          word-wrap: break-word;
          width: auto;
          max-width: 100%;
          display: inline-block;
          min-width: 250px !important;
        }

        .edit-account-form .modal-save-accent {
          background-color: var(--interactive-accent) !important;
          color: var(--text-on-accent) !important;
          border-color: var(--interactive-accent) !important;
        }

        .edit-account-form .delete-account-danger {
          background-color: #dc3545 !important;
          color: white !important;
          border-color: #dc3545 !important;
        }
      
`;

const DRAWDOWN_TYPE_OPTIONS: Array<{
  value: DrawdownType;
  labelKey:
    | 'account.drawdown.none'
    | 'account.drawdown.fixed'
    | 'account.drawdown.eod-trailing'
    | 'account.drawdown.manual';
}> = [
  { value: DrawdownType.NONE, labelKey: 'account.drawdown.none' },
  { value: DrawdownType.FIXED, labelKey: 'account.drawdown.fixed' },
  {
    value: DrawdownType.EOD_TRAILING,
    labelKey: 'account.drawdown.eod-trailing',
  },
  { value: DrawdownType.MANUAL, labelKey: 'account.drawdown.manual' },
];

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const profitTargetTypeFromSelect = (value: string): ProfitTargetType =>
  value === 'percentage'
    ? ProfitTargetType.PERCENTAGE
    : ProfitTargetType.ABSOLUTE;

interface EditAccountModalProps {
  app: App;
  plugin: JournalitPlugin;
  account: AccountData;
  onClose: () => void;
  onSave: () => void;
}

type NameChangeAction = 'update-notes' | 'keep-old-name' | 'cancel';

interface EditAccountFormState {
  name: string;
  accountType: AccountData['accountType'];
  initialBalance: number;
  liveBalance: string;
  currency: CurrencyCode;
  drawdownType: DrawdownType;
  drawdownAmount: number;
  hasProfitTarget: boolean;
  profitTarget: number;
  profitTargetType: ProfitTargetType;
  profitTargetDate: Date | null;
  monthlyCost: number;
  createdDate: Date | null;
  copyTradingEnabled: boolean;
  copyTradingBaseAccount: string;
  copyTradingMultiplier: number;
  copyTradingStartMode: 'all' | 'date';
  copyTradingStartDate: Date | null;
  copyTradingPeriods: CopyTradingPeriod[];
}


class EditAccountModal extends Modal {
  private props: EditAccountModalProps;
  private container: HTMLDivElement;
  private root: Root | null = null;

  constructor(props: EditAccountModalProps) {
    super(props.app);
    this.titleEl.setText(t('account.edit.title'));
    this.props = props;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    
    this.container = contentEl.createDiv({
      cls: 'edit-account-modal-container',
    });

    
    this.renderComponent();
  }

  onClose() {
    
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.props.onClose();
  }

  private renderComponent() {
    this.root = createRoot(this.container);
    this.root.render(
      <CurrencyProvider>
        <EditAccountModalContent
          {...this.props}
          onModalClose={() => this.close()}
        />
      </CurrencyProvider>
    );
  }
}

type EditAccountSetter = React.Dispatch<
  React.SetStateAction<EditAccountFormState>
>;

const formatAccountType = (type: string): string => {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

interface AccountIdentityFieldsProps {
  editAccount: EditAccountFormState;
  setEditAccount: EditAccountSetter;
  customAccountTypes: string[];
  isSaving: boolean;
}

const AccountIdentityFields: React.FC<AccountIdentityFieldsProps> = ({
  editAccount,
  setEditAccount,
  customAccountTypes,
  isSaving,
}) => (
  <div className="setting-item two-column">
    <div className="column">
      <div className="setting-item-info">
        <div className="setting-item-name">{t('account.edit.field.name')}</div>
        <div className="setting-item-description">
          {t('account.edit.field.name-desc')}
        </div>
      </div>
      <div className="setting-item-control">
        <input
          type="text"
          value={editAccount.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const name = e.target.value;
            setEditAccount((currentAccount) => ({ ...currentAccount, name }));
          }}
          placeholder={t('account.edit.placeholder.name')}
          disabled={isSaving}
        />
      </div>
    </div>
    <div className="column">
      <div className="setting-item-info">
        <div className="setting-item-name">{t('account.edit.field.type')}</div>
        <div className="setting-item-description">
          {t('account.edit.field.type-desc')}
        </div>
      </div>
      <div className="setting-item-control">
        <select
          value={editAccount.accountType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const accountType = e.target.value;
            setEditAccount((currentAccount) => ({
              ...currentAccount,
              accountType,
            }));
          }}
          disabled={isSaving}
        >
          {customAccountTypes.length > 0 ? (
            customAccountTypes.map((type) => (
              <option key={type} value={type}>
                {formatAccountType(type)}
              </option>
            ))
          ) : (
            <>
              <option value={AccountType.DEMO}>
                {t('account.edit.type.demo')}
              </option>
              <option value={AccountType.EVALUATION}>
                {t('account.edit.type.evaluation')}
              </option>
              <option value={AccountType.FUNDED}>
                {t('account.edit.type.funded')}
              </option>
            </>
          )}
        </select>
      </div>
    </div>
  </div>
);

interface AccountBalanceFieldsProps {
  account: AccountData;
  editAccount: EditAccountFormState;
  setEditAccount: EditAccountSetter;
  isSaving: boolean;
}

const AccountBalanceFields: React.FC<AccountBalanceFieldsProps> = ({
  account,
  editAccount,
  setEditAccount,
  isSaving,
}) => (
  <>
    <div className="setting-item two-column">
      <div className="column">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('account.edit.field.initial-balance')}
          </div>
          <div className="setting-item-description">
            {t('account.edit.field.initial-balance-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <input
            type="number"
            value={
              editAccount.initialBalance === 0 ? '' : editAccount.initialBalance
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const initialBalance =
                e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
              setEditAccount((currentAccount) => ({
                ...currentAccount,
                initialBalance,
              }));
            }}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
              if (editAccount.initialBalance === 0) e.target.value = '';
            }}
            min="0"
            step="100"
            placeholder="0"
            disabled={isSaving}
          />
        </div>
      </div>
      <div className="column">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('account.edit.field.creation-date')}
          </div>
          <div className="setting-item-description">
            {t('account.edit.field.creation-date-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <FastDateTimeInput
            className="journalit-account-date-input"
            value={editAccount.createdDate ?? undefined}
            onChange={(value) => {
              if (value instanceof Date) {
                const date = new Date(value);
                date.setHours(0, 0, 0, 0);
                setEditAccount((currentAccount) => ({
                  ...currentAccount,
                  createdDate: date,
                }));
              } else {
                setEditAccount((currentAccount) => ({
                  ...currentAccount,
                  createdDate: null,
                }));
              }
            }}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
    <div className="setting-item two-column journalit-setting-item--balance-row">
      <div className="column">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('account.edit.field.live-balance')}{' '}
            <span className="setting-item-name-optional">
              {t('form.field.optional')}
            </span>
          </div>
          <div className="setting-item-description">
            {t('account.edit.field.live-balance-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <input
            type="number"
            value={editAccount.liveBalance}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const liveBalance = e.target.value;
              setEditAccount((currentAccount) => ({
                ...currentAccount,
                liveBalance,
              }));
            }}
            step="100"
            placeholder={String(account.currentBalance || 0)}
            disabled={isSaving}
          />
        </div>
      </div>
      <div className="column">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('account.edit.field.currency')}
          </div>
          <div className="setting-item-description">
            {t('account.edit.field.currency-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <select
            value={editAccount.currency}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const currency = parseCuratedCurrencyCode(e.target.value);
              setEditAccount((currentAccount) => ({
                ...currentAccount,
                currency,
              }));
            }}
            disabled={isSaving}
          >
            {Object.values(CURRENCY_CONFIGS).map((config) => (
              <option key={config.code} value={config.code}>
                {config.symbol} {config.code} - {config.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </>
);

interface DrawdownSectionProps {
  app: App;
  account: AccountData;
  editAccount: EditAccountFormState;
  setEditAccount: EditAccountSetter;
  manualSnapshots: ManualDrawdownSnapshot[];
  setManualSnapshots: React.Dispatch<
    React.SetStateAction<ManualDrawdownSnapshot[]>
  >;
  showSnapshotManager: boolean;
  setShowSnapshotManager: React.Dispatch<React.SetStateAction<boolean>>;
  isSaving: boolean;
}

const DrawdownSection: React.FC<DrawdownSectionProps> = ({
  app,
  account,
  editAccount,
  setEditAccount,
  manualSnapshots,
  setManualSnapshots,
  showSnapshotManager,
  setShowSnapshotManager,
  isSaving,
}) => (
  <>
    <div className="setting-item journalit-setting-item--full-width">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('account.edit.field.drawdown-type')}
        </div>
      </div>
      <div className="journalit-drawdown-radio-group" role="radiogroup">
        {DRAWDOWN_TYPE_OPTIONS.map((option) => {
          const selected = editAccount.drawdownType === option.value;
          return (
            <button
              key={option.value}
              type="button"
              className={`journalit-drawdown-radio-option${selected ? ' is-selected' : ''}`}
              aria-pressed={selected}
              onClick={() => {
                setEditAccount((currentAccount) => {
                  const newAmount =
                    option.value !== DrawdownType.NONE &&
                    currentAccount.drawdownType === DrawdownType.NONE
                      ? Math.round(account.initialBalance * 0.1)
                      : currentAccount.drawdownAmount;

                  return {
                    ...currentAccount,
                    drawdownType: option.value,
                    drawdownAmount:
                      option.value === DrawdownType.NONE ? 0 : newAmount,
                  };
                });
              }}
              disabled={isSaving}
            >
              {t(option.labelKey)}
            </button>
          );
        })}
      </div>
    </div>

    {editAccount.drawdownType !== DrawdownType.NONE && (
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('account.edit.field.drawdown-amount')}
          </div>
          <div className="setting-item-description">
            {t('account.edit.field.drawdown-amount-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <input
            type="number"
            value={
              editAccount.drawdownAmount === 0 ? '' : editAccount.drawdownAmount
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const drawdownAmount =
                e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
              setEditAccount((currentAccount) => ({
                ...currentAccount,
                drawdownAmount,
              }));
            }}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
              if (editAccount.drawdownAmount === 0) e.target.value = '';
            }}
            min="0"
            step="100"
            placeholder="0"
            disabled={isSaving}
          />
        </div>
      </div>
    )}

    {editAccount.drawdownType === DrawdownType.MANUAL && (
      <div className="setting-item journalit-setting-item--full-width">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('account.edit.field.manual-snapshots')}
          </div>
          <div className="setting-item-description">
            {t('account.edit.field.manual-snapshots-desc')}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowSnapshotManager(!showSnapshotManager)}
          className="manage-snapshots-button"
        >
          {showSnapshotManager
            ? t('account.edit.button.hide-snapshots', {
                count: String(manualSnapshots.length),
              })
            : t('account.edit.button.show-snapshots', {
                count: String(manualSnapshots.length),
              })}
        </button>
        {showSnapshotManager && (
          <ManualDrawdownManager
            app={app}
            snapshots={manualSnapshots}
            onSave={(updatedSnapshots: ManualDrawdownSnapshot[]) =>
              setManualSnapshots(updatedSnapshots)
            }
          />
        )}
      </div>
    )}
  </>
);

interface ProfitTargetSectionProps {
  editAccount: EditAccountFormState;
  setEditAccount: EditAccountSetter;
  isSaving: boolean;
}

const ProfitTargetSection: React.FC<ProfitTargetSectionProps> = ({
  editAccount,
  setEditAccount,
  isSaving,
}) => (
  <>
    <div className="setting-item two-column">
      <div className="column">
        <div className="journalit-checkbox-setting-row">
          <Checkbox
            checked={editAccount.hasProfitTarget}
            onChange={(checked) =>
              setEditAccount((currentAccount) => ({
                ...currentAccount,
                hasProfitTarget: checked,
              }))
            }
            ariaLabel={t('account.profit-target.enable')}
            disabled={isSaving}
          />
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('account.profit-target.enable')}
            </div>
            <div className="setting-item-description">
              {t('account.edit.field.profit-target-desc')}
            </div>
          </div>
        </div>
      </div>
      <div className="column">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('account.edit.field.monthly-cost')}
          </div>
          <div className="setting-item-description">
            {t('account.edit.field.monthly-cost-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <input
            type="number"
            value={editAccount.monthlyCost === 0 ? '' : editAccount.monthlyCost}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const monthlyCost =
                e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
              setEditAccount((currentAccount) => ({
                ...currentAccount,
                monthlyCost,
              }));
            }}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
              if (editAccount.monthlyCost === 0) e.target.value = '';
            }}
            min="0"
            step="1"
            placeholder="0"
            disabled={isSaving}
          />
        </div>
      </div>
    </div>

    {editAccount.hasProfitTarget && (
      <>
        <div className="setting-item two-column">
          <div className="column">
            <div className="setting-item-info">
              <div className="setting-item-name">
                {t('account.edit.field.target-type')}
              </div>
              <div className="setting-item-description">
                {t('account.edit.field.target-type-desc')}
              </div>
            </div>
            <div className="setting-item-control">
              <select
                value={editAccount.profitTargetType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const profitTargetType = profitTargetTypeFromSelect(
                    e.target.value
                  );
                  setEditAccount((currentAccount) => ({
                    ...currentAccount,
                    profitTargetType,
                  }));
                }}
                disabled={isSaving}
              >
                <option value={ProfitTargetType.ABSOLUTE}>
                  {t('account.profit-target.type.absolute')}
                </option>
                <option value={ProfitTargetType.PERCENTAGE}>
                  {t('account.profit-target.type.percentage')}
                </option>
              </select>
            </div>
          </div>
          <div className="column">
            <div className="setting-item-info">
              <div className="setting-item-name">
                {editAccount.profitTargetType === ProfitTargetType.PERCENTAGE
                  ? t('account.edit.field.target-percent')
                  : t('account.edit.field.target-dollar')}
              </div>
              <div className="setting-item-description">
                {editAccount.profitTargetType === ProfitTargetType.PERCENTAGE
                  ? t('account.edit.field.target-percent-desc')
                  : t('account.edit.field.target-dollar-desc')}
              </div>
            </div>
            <div className="setting-item-control">
              <input
                type="number"
                value={
                  editAccount.profitTarget === 0 ? '' : editAccount.profitTarget
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const profitTarget =
                    e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                  setEditAccount((currentAccount) => ({
                    ...currentAccount,
                    profitTarget,
                  }));
                }}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (editAccount.profitTarget === 0) e.target.value = '';
                }}
                min="0"
                step={
                  editAccount.profitTargetType === ProfitTargetType.PERCENTAGE
                    ? '1'
                    : '100'
                }
                placeholder="0"
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('account.edit.field.target-date')}
            </div>
            <div className="setting-item-description">
              {t('account.edit.field.target-date-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <FastDateTimeInput
              className="journalit-account-date-input"
              value={
                editAccount.profitTargetDate
                  ? new Date(editAccount.profitTargetDate)
                  : undefined
              }
              onChange={(value) => {
                if (value instanceof Date) {
                  setEditAccount((currentAccount) => ({
                    ...currentAccount,
                    profitTargetDate: value,
                  }));
                } else {
                  setEditAccount((currentAccount) => ({
                    ...currentAccount,
                    profitTargetDate: null,
                  }));
                }
              }}
              disabled={isSaving}
            />
          </div>
        </div>
      </>
    )}
  </>
);

interface CopyTradingSectionProps {
  account: AccountData;
  plugin: JournalitPlugin;
  editAccount: EditAccountFormState;
  setEditAccount: EditAccountSetter;
  isSaving: boolean;
}

const toDateInputValue = (date: Date | null): string => {
  if (!date || Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateInputValue = (value: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const CopyTradingSection: React.FC<CopyTradingSectionProps> = ({
  account,
  plugin,
  editAccount,
  setEditAccount,
  isSaving,
}) => {
  const accountMetadata = plugin.settings.account?.accountMetadata ?? {};
  const accountCurrency = editAccount.currency;
  const activeCopyPeriod = editAccount.copyTradingPeriods.find(
    (period) => !period.endDate
  );
  const isActiveCopyBase = isAccountUsedAsActiveCopyBase(
    account.name,
    accountMetadata
  );
  const baseAccountOptions = Object.values(accountMetadata)
    .flatMap((metadata) =>
      metadata.name !== account.name &&
      !hasActiveCopyTradingPeriod(metadata) &&
      (metadata.currency || plugin.settings.general?.currency) ===
        accountCurrency
        ? [metadata.name]
        : []
    )
    .sort((a, b) => a.localeCompare(b));
  const inactivePeriods = editAccount.copyTradingPeriods.filter(
    (period) => period.endDate
  );

  return (
    <div className="setting-item journalit-setting-item--full-width journalit-copy-trading-section">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('account.copy-trading.title')}
        </div>
        <div className="setting-item-description">
          {t('account.copy-trading.description')}
        </div>
      </div>

      <div className="journalit-checkbox-setting-row journalit-copy-trading-toggle-row">
        <Checkbox
          checked={editAccount.copyTradingEnabled && !isActiveCopyBase}
          onChange={(checked) => {
            if (checked && isActiveCopyBase) {
              new Notice(
                t('account.copy-trading.error.base-account-is-copied')
              );
              return;
            }
            if (checked && account.metrics.totalTrades > 0) {
              new Notice(t('account.copy-trading.existing-trades-warning'));
            }
            setEditAccount((currentAccount) => ({
              ...currentAccount,
              copyTradingEnabled: checked,
              copyTradingBaseAccount:
                checked && !currentAccount.copyTradingBaseAccount
                  ? (baseAccountOptions[0] ?? '')
                  : currentAccount.copyTradingBaseAccount,
            }));
          }}
          ariaLabel={t('account.copy-trading.enable')}
          disabled={isSaving || isActiveCopyBase}
        />
        <div className="setting-item-name journalit-checkbox-setting-label">
          {t('account.copy-trading.enable')}
        </div>
      </div>

      {isActiveCopyBase && (
        <div className="setting-item-description journalit-copy-trading-base-warning">
          <div>
            {t('account.copy-trading.base-account-is-copied-desc-primary')}
          </div>
          <div>
            {t('account.copy-trading.base-account-is-copied-desc-secondary')}
          </div>
        </div>
      )}

      {editAccount.copyTradingEnabled && !isActiveCopyBase && (
        <>
          <div className="journalit-copy-trading-fields two-column">
            <div className="column">
              <div className="setting-item-info">
                <div className="setting-item-name">
                  {t('account.copy-trading.base-account')}
                </div>
                <div className="setting-item-description">
                  {t('account.copy-trading.base-account-desc')}
                </div>
              </div>
              <div className="setting-item-control">
                <select
                  value={editAccount.copyTradingBaseAccount}
                  onChange={(e) =>
                    setEditAccount((currentAccount) => ({
                      ...currentAccount,
                      copyTradingBaseAccount: e.target.value,
                    }))
                  }
                  disabled={isSaving}
                >
                  <option value="">
                    {t('account.copy-trading.base-account-placeholder')}
                  </option>
                  {baseAccountOptions.map((accountName) => (
                    <option key={accountName} value={accountName}>
                      {accountName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="column">
              <div className="setting-item-info">
                <div className="setting-item-name">
                  {t('account.copy-trading.multiplier')}
                </div>
                <div className="setting-item-description">
                  {t('account.copy-trading.multiplier-desc')}
                </div>
              </div>
              <div className="setting-item-control">
                <input
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={editAccount.copyTradingMultiplier}
                  onChange={(e) =>
                    setEditAccount((currentAccount) => ({
                      ...currentAccount,
                      copyTradingMultiplier: Number(e.target.value),
                    }))
                  }
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          {!activeCopyPeriod && (
            <div className="setting-item two-column journalit-copy-trading-start-row">
              <div className="column">
                <div className="journalit-checkbox-setting-row">
                  <Checkbox
                    checked={editAccount.copyTradingStartMode === 'all'}
                    onChange={(checked) =>
                      setEditAccount((currentAccount) => ({
                        ...currentAccount,
                        copyTradingStartMode: checked ? 'all' : 'date',
                      }))
                    }
                    ariaLabel={t('account.copy-trading.all-history')}
                    disabled={isSaving}
                  />
                  <div className="setting-item-name journalit-checkbox-setting-label">
                    {t('account.copy-trading.all-history')}
                  </div>
                </div>
              </div>
              {editAccount.copyTradingStartMode === 'date' && (
                <div className="column">
                  <div className="setting-item-info">
                    <div className="setting-item-name">
                      {t('account.copy-trading.start-date')}
                    </div>
                  </div>
                  <div className="setting-item-control">
                    <input
                      type="date"
                      value={toDateInputValue(editAccount.copyTradingStartDate)}
                      onChange={(e) =>
                        setEditAccount((currentAccount) => ({
                          ...currentAccount,
                          copyTradingStartDate: parseDateInputValue(
                            e.target.value
                          ),
                        }))
                      }
                      disabled={isSaving}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {inactivePeriods.length > 0 && (
        <div className="setting-item-description">
          <strong>{t('account.copy-trading.history')}</strong>
          {inactivePeriods.map((period) => (
            <div
              key={`${period.baseAccount}-${period.multiplier}-${String(
                period.startDate
              )}-${String(period.endDate)}`}
            >
              {period.baseAccount} · {period.multiplier}x ·{' '}
              {formatDateDisplay(period.startDate)} –{' '}
              {period.endDate ? formatDateDisplay(period.endDate) : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



const useEditAccountModalController = ({
  app,
  plugin,
  account,
  onSave,
  onModalClose,
}: Omit<EditAccountModalProps, 'onClose'> & { onModalClose: () => void }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [customAccountTypes, setCustomAccountTypes] = useState<string[]>([]);
  const [showSnapshotManager, setShowSnapshotManager] = useState(false);
  const initialCopyTradingPeriods = account.copyTradingPeriods ?? [];
  const initialActiveCopyPeriod = initialCopyTradingPeriods.find(
    (period) => !period.endDate
  );

  
  const [editAccount, setEditAccount] = useState<EditAccountFormState>({
    name: account.name,
    accountType: account.accountType,
    initialBalance: account.initialBalance,
    liveBalance: hasLiveBalanceAdjustment(account.liveBalanceAdjustment)
      ? String(account.currentBalance)
      : '',
    currency:
      account.currency ||
      plugin.settings?.general?.currency ||
      CurrencyCode.USD,
    drawdownType: account.drawdownType,
    drawdownAmount: account.drawdownAmount,
    hasProfitTarget: account.hasProfitTarget,
    profitTarget: account.profitTarget,
    profitTargetType: account.profitTargetType || ProfitTargetType.ABSOLUTE,
    profitTargetDate: account.profitTargetDate || null,
    monthlyCost: account.monthlyCost || 0,
    createdDate: safeParseDateValue(account.createdDate),
    copyTradingEnabled: Boolean(initialActiveCopyPeriod),
    copyTradingBaseAccount: initialActiveCopyPeriod?.baseAccount ?? '',
    copyTradingMultiplier: initialActiveCopyPeriod?.multiplier ?? 1,
    copyTradingStartMode: 'date',
    copyTradingStartDate: null,
    copyTradingPeriods: initialCopyTradingPeriods,
  });
  const [manualSnapshots, setManualSnapshots] = useState<
    ManualDrawdownSnapshot[]
  >([]);

  
  
  const refreshAccountTypes = useCallback(() => {
    const optionsService = plugin.optionsService;
    if (!optionsService) return;

    const types = optionsService.getOptions(OptionType.ACCOUNT_TYPE);
    setCustomAccountTypes(types);

    if (types.length === 0) return;

    
    setEditAccount((prev) => {
      const currentType = String(prev.accountType ?? '');
      const currentTypeExists = types.some(
        (type) => type.toLowerCase() === currentType.toLowerCase()
      );
      
      return currentTypeExists ? prev : { ...prev, accountType: types[0] };
    });
  }, [plugin.optionsService]);

  
  useEffect(() => {
    refreshAccountTypes();
  }, [refreshAccountTypes]);

  
  useEventBus('options:changed', refreshAccountTypes);

  
  useEffect(() => {
    try {
      const metadata = plugin.settings.account?.accountMetadata?.[account.name];
      if (
        metadata?.manualDrawdownSnapshots &&
        Array.isArray(metadata.manualDrawdownSnapshots)
      ) {
        
        const validSnapshots = metadata.manualDrawdownSnapshots.flatMap(
          (snapshot) => {
            if (snapshot === null || snapshot === undefined) return [];

            const parsedDate =
              snapshot.date instanceof Date
                ? snapshot.date
                : safeParseDateValue(snapshot.date);

            if (!parsedDate || isNaN(parsedDate.getTime())) {
              console.warn(
                'EditAccountModal: Skipping snapshot with invalid date:',
                snapshot
              );
              return [];
            }

            return [
              {
                ...snapshot,
                date: parsedDate,
              },
            ];
          }
        );

        setManualSnapshots(validSnapshots);

        
        const skippedCount =
          metadata.manualDrawdownSnapshots.length - validSnapshots.length;
        if (skippedCount > 0) {
          console.warn(
            `EditAccountModal: Filtered out ${skippedCount} corrupted snapshot(s)`
          );
        }
      }
    } catch (error) {
      console.error(
        'EditAccountModal: Error loading manual drawdown snapshots:',
        error
      );
      setManualSnapshots([]);
    }
  }, [account.name, plugin.settings.account?.accountMetadata]);

  const checkAccountNameExists = useCallback(
    async (accountName: string): Promise<boolean> => {
      if (!plugin.accountPageService) {
        return false;
      }

      try {
        const existingAccounts =
          await plugin.accountPageService.getAccountCatalog();
        const normalizedName = accountName.trim().toLowerCase();
        const normalizedCurrent = account.name.trim().toLowerCase();

        return existingAccounts.some((existingAccount) => {
          const existingName = existingAccount.name.trim().toLowerCase();
          return (
            existingName === normalizedName &&
            existingName !== normalizedCurrent
          );
        });
      } catch (error) {
        console.error('Error checking account name uniqueness:', error);
        return false;
      }
    },
    [account.name, plugin.accountPageService]
  );

  const buildAccountChangeAliases = (
    primaryName: string,
    secondaryName?: string
  ): {
    aliases: string[];
    mappedAccountIds: string[];
  } => {
    const aliases = new Set<string>([
      primaryName,
      ...(secondaryName ? [secondaryName] : []),
    ]);
    const mappedAccountIds = new Set<string>();

    const targetLookupKeys = new Set(
      [primaryName, secondaryName].flatMap((value) =>
        value ? [normalizeAccountLookupKey(value)] : []
      )
    );

    const accountMapping = plugin.settings.backendIntegration?.accountMapping;
    if (accountMapping) {
      for (const [accountId, displayName] of Object.entries(accountMapping)) {
        const displayLookupKey = normalizeAccountLookupKey(String(displayName));
        if (!targetLookupKeys.has(displayLookupKey)) {
          continue;
        }

        aliases.add(String(displayName));
        aliases.add(accountId);
        mappedAccountIds.add(accountId);
      }
    }

    return {
      aliases: Array.from(aliases),
      mappedAccountIds: Array.from(mappedAccountIds),
    };
  };

  const buildCopyTradingPeriods = (): CopyTradingPeriod[] => {
    const periods = editAccount.copyTradingPeriods.map((period) => ({
      ...period,
    }));
    const activePeriodIndex = periods.findIndex((period) => !period.endDate);

    if (!editAccount.copyTradingEnabled) {
      if (activePeriodIndex >= 0) {
        const disabledEndDate = new Date();
        disabledEndDate.setDate(disabledEndDate.getDate() - 1);
        const activeStartDate = new Date(periods[activePeriodIndex].startDate);

        if (activeStartDate >= startOfDay(new Date())) {
          periods.splice(activePeriodIndex, 1);
          return periods;
        }

        periods[activePeriodIndex] = {
          ...periods[activePeriodIndex],
          endDate: disabledEndDate,
        };
      }
      return periods;
    }

    let startDate =
      editAccount.copyTradingStartMode === 'all'
        ? new Date(1970, 0, 1)
        : (editAccount.copyTradingStartDate ?? new Date());

    const latestHistoricalEndTime = periods.reduce((latestEndTime, period) => {
      if (!period.endDate) {
        return latestEndTime;
      }

      const endTime = startOfDay(new Date(period.endDate)).getTime();
      return Number.isNaN(endTime)
        ? latestEndTime
        : Math.max(latestEndTime, endTime);
    }, Number.NEGATIVE_INFINITY);

    if (latestHistoricalEndTime !== Number.NEGATIVE_INFINITY) {
      const earliestNextStartDate = new Date(latestHistoricalEndTime);
      earliestNextStartDate.setDate(earliestNextStartDate.getDate() + 1);
      if (startOfDay(startDate) < earliestNextStartDate) {
        startDate = earliestNextStartDate;
      }
    }

    if (activePeriodIndex === -1) {
      return [
        ...periods,
        {
          baseAccount: editAccount.copyTradingBaseAccount,
          multiplier: editAccount.copyTradingMultiplier,
          startDate,
        },
      ];
    }

    const activePeriod = periods[activePeriodIndex];
    if (
      activePeriod.baseAccount === editAccount.copyTradingBaseAccount &&
      activePeriod.multiplier === editAccount.copyTradingMultiplier
    ) {
      return periods;
    }

    const newStartDate = new Date();
    const priorEndDate = new Date(newStartDate);
    priorEndDate.setDate(priorEndDate.getDate() - 1);
    periods[activePeriodIndex] = {
      ...activePeriod,
      endDate: priorEndDate,
    };
    periods.push({
      baseAccount: editAccount.copyTradingBaseAccount,
      multiplier: editAccount.copyTradingMultiplier,
      startDate: newStartDate,
    });
    return periods;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const trimmedName = editAccount.name.trim();

      
      if (!trimmedName) {
        new Notice(t('account.edit.error.name-required'));
        return;
      }

      if (trimmedName !== editAccount.name) {
        setEditAccount((prev) => ({ ...prev, name: trimmedName }));
      }

      
      if (editAccount.initialBalance < 0) {
        new Notice(t('account.edit.error.balance-required'));
        return;
      }

      
      if (
        editAccount.drawdownType !== DrawdownType.NONE &&
        editAccount.drawdownAmount <= 0
      ) {
        new Notice(t('account.edit.error.drawdown-required'));
        return;
      }

      
      if (
        !editAccount.createdDate ||
        isNaN(editAccount.createdDate.getTime())
      ) {
        new Notice(t('account.edit.error.creation-date-required'));
        return;
      }

      
      if (editAccount.createdDate.getTime() > Date.now()) {
        new Notice(t('account.edit.error.future-date'));
        return;
      }

      const validatedCreatedDate = editAccount.createdDate;

      if (editAccount.copyTradingEnabled) {
        if (
          isAccountUsedAsActiveCopyBase(
            account.name,
            plugin.settings.account?.accountMetadata
          )
        ) {
          new Notice(t('account.copy-trading.error.base-account-is-copied'));
          return;
        }
        if (!editAccount.copyTradingBaseAccount) {
          new Notice(t('account.copy-trading.error.base-required'));
          return;
        }
        if (!isValidCopyTradingMultiplier(editAccount.copyTradingMultiplier)) {
          new Notice(t('account.copy-trading.error.multiplier-range'));
          return;
        }
        if (
          editAccount.copyTradingStartMode === 'date' &&
          !editAccount.copyTradingStartDate &&
          !editAccount.copyTradingPeriods.some((period) => !period.endDate)
        ) {
          new Notice(t('account.copy-trading.error.start-date-required'));
          return;
        }
      }

      
      const nameChanged = account.name !== trimmedName;
      let renameConfirmed = false;
      let effectiveAccountName = trimmedName;

      if (nameChanged) {
        const nameExists = await checkAccountNameExists(trimmedName);
        if (nameExists) {
          new Notice(
            t('account.edit.error.name-exists', { name: trimmedName })
          );
          return;
        }

        const nameChangeAction = await showNameChangeConfirmation(
          account.name,
          trimmedName
        );

        if (nameChangeAction === 'cancel') {
          return; 
        }

        if (nameChangeAction === 'keep-old-name') {
          effectiveAccountName = account.name;
          setEditAccount((prev) => ({ ...prev, name: account.name }));
        } else {
          renameConfirmed = true;
        }
      }

      const effectiveNameChanged = account.name !== effectiveAccountName;

      
      const initialBalanceChanged =
        account.initialBalance !== editAccount.initialBalance;

      if (effectiveNameChanged && initialBalanceChanged) {
        
        const shouldProceedWithBalance =
          await showInitialBalanceChangeConfirmation(
            account.initialBalance,
            editAccount.initialBalance
          );
        if (shouldProceedWithBalance) {
          await performUpdate(
            renameConfirmed,
            effectiveAccountName,
            validatedCreatedDate
          );
        } else {
          
          setEditAccount((prev) => ({
            ...prev,
            initialBalance: account.initialBalance,
          }));
          await performUpdateWithAccountName(
            renameConfirmed,
            effectiveAccountName,
            validatedCreatedDate
          );
        }
      } else if (effectiveNameChanged) {
        
        await performUpdate(
          renameConfirmed,
          effectiveAccountName,
          validatedCreatedDate
        );
      } else if (initialBalanceChanged) {
        
        const shouldProceedWithBalance =
          await showInitialBalanceChangeConfirmation(
            account.initialBalance,
            editAccount.initialBalance
          );
        if (shouldProceedWithBalance) {
          await performUpdate(
            false,
            effectiveAccountName,
            validatedCreatedDate
          );
        } else {
          
          return;
        }
      } else {
        
        await performUpdate(false, effectiveAccountName, validatedCreatedDate);
      }
    } catch (error) {
      console.error('Error updating account:', error);
      new Notice(
        t('account.edit.error.update-failed', {
          error: error instanceof Error ? error.message : String(error),
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  const performUpdate = async (
    shouldUpdateNotes: boolean,
    accountName: string,
    createdDate: Date
  ) => {
    await performUpdateWithAccountName(
      shouldUpdateNotes,
      accountName,
      createdDate
    );
  };

  const performUpdateWithAccountName = async (
    shouldUpdateNotes: boolean,
    accountName: string,
    createdDate: Date
  ) => {
    try {
      
      const oldCreatedDate = new Date(account.createdDate);
      const newCreatedDate = new Date(createdDate);

      
      oldCreatedDate.setHours(0, 0, 0, 0);
      newCreatedDate.setHours(0, 0, 0, 0);

      const creationDateChanged =
        oldCreatedDate.getTime() !== newCreatedDate.getTime();

      if (creationDateChanged) {
        
        const shouldProceed = await showCreationDateChangeConfirmation(
          account.name,
          oldCreatedDate,
          newCreatedDate
        );

        if (!shouldProceed) {
          
          setEditAccount((prev) => ({
            ...prev,
            createdDate: account.createdDate,
          }));
        }
      }

      await updateAccountDataWithAccountName(
        shouldUpdateNotes,
        accountName,
        createdDate
      );
    } catch (error) {
      console.error('Error in performUpdate:', error);
      new Notice(
        t('account.edit.error.update-failed', {
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
  };

  const updateAccountDataWithAccountName = async (
    shouldUpdateNotes: boolean,
    accountName: string,
    createdDate: Date
  ) => {
    try {
      const parsedLiveBalance = parseLiveBalanceInput(editAccount.liveBalance);
      if (parsedLiveBalance === undefined) {
        new Notice(t('account.edit.error.invalid-live-balance'));
        return;
      }

      
      const baseCurrentBalanceWithoutAdjustment =
        account.currentBalance - (account.liveBalanceAdjustment ?? 0);
      const nextComputedCurrentBalance =
        baseCurrentBalanceWithoutAdjustment +
        (editAccount.initialBalance - account.initialBalance);
      const liveBalanceAdjustment = toLiveBalanceAdjustment(
        parsedLiveBalance,
        nextComputedCurrentBalance
      );

      const updateData: Partial<AccountData> = {
        name: accountName,
        accountType: editAccount.accountType,
        initialBalance: editAccount.initialBalance,
        liveBalanceAdjustment,
        currency: editAccount.currency,
        drawdownType: editAccount.drawdownType,
        drawdownAmount: editAccount.drawdownAmount,
        hasProfitTarget: editAccount.hasProfitTarget,
        profitTarget: editAccount.profitTarget,
        profitTargetType: editAccount.profitTargetType,
        profitTargetDate: editAccount.profitTargetDate || undefined,
        monthlyCost: editAccount.monthlyCost,
        createdDate,
      };

      
      if (plugin.accountPageService) {
        const metadataUpdates = {
          accountType: updateData.accountType,
          initialBalance: updateData.initialBalance,
          liveBalanceAdjustment: updateData.liveBalanceAdjustment,
          currency: updateData.currency,
          drawdownType: updateData.drawdownType,
          drawdownAmount: updateData.drawdownAmount,
          hasProfitTarget: updateData.hasProfitTarget,
          profitTarget: updateData.profitTarget,
          profitTargetType: updateData.profitTargetType,
          profitTargetDate: updateData.profitTargetDate,
          monthlyCost: updateData.monthlyCost,
          createdDate: updateData.createdDate,
          copyTradingPeriods: buildCopyTradingPeriods(),

          manualDrawdownSnapshots:
            editAccount.drawdownType === DrawdownType.MANUAL
              ? manualSnapshots.filter((s) => {
                  const isValid =
                    s && s.date instanceof Date && !isNaN(s.date.getTime());
                  if (!isValid) {
                    console.warn(
                      'EditAccountModal: Filtering out invalid snapshot before save:',
                      s
                    );
                  }
                  return isValid;
                })
              : [],
        };

        if (account.name !== accountName) {
          await plugin.accountPageService.renameAccountMetadata(
            account.name,
            accountName,
            metadataUpdates
          );
        } else {
          await plugin.accountPageService.updateAccountMetadata(
            accountName,
            metadataUpdates
          );
        }
      }

      
      if (shouldUpdateNotes && account.name !== accountName) {
        if (plugin.optionsService) {
          const result = await plugin.optionsService.updateOption(
            OptionType.ACCOUNT,
            account.name, 
            accountName, 
            true 
          );

          if (!result.success) {
            await plugin.optionsService.updateNotesForOptionValue(
              OptionType.ACCOUNT,
              account.name,
              accountName
            );
          }
        }
      }

      
      onSave();

      
      if (shouldUpdateNotes && account.name !== accountName) {
        new Notice(
          t('account.edit.success.updated-with-references', {
            oldName: account.name,
            newName: accountName,
          })
        );
      } else {
        new Notice(t('account.edit.success.updated', { name: accountName }));
      }

      
      const { aliases: accountAliases, mappedAccountIds } =
        buildAccountChangeAliases(accountName, account.name);
      const changedAccountNames = new Set(accountAliases);
      if (account.name !== accountName) {
        const renamedAccountLookupKey = normalizeAccountLookupKey(accountName);
        for (const metadata of Object.values(
          plugin.settings.account?.accountMetadata ?? {}
        )) {
          if (
            metadata.copyTradingPeriods?.some(
              (period) =>
                normalizeAccountLookupKey(period.baseAccount) ===
                renamedAccountLookupKey
            )
          ) {
            changedAccountNames.add(metadata.name);
          }
        }
      }
      eventBus.publish('account:changed', {
        action: 'updated',
        accountId:
          mappedAccountIds[0] ?? account.accountId ?? account.id ?? accountName,
        accountName,
        accountNames: Array.from(changedAccountNames),
      });

      if (account.name !== accountName && plugin.viewManager) {
        await plugin.viewManager.renameAccountPageViews(
          account.name,
          accountName
        );
      }

      onModalClose(); 
    } catch (error) {
      console.error('Error updating account:', error);
      new Notice(
        t('account.edit.error.update-failed', { error: getErrorMessage(error) })
      );
    }
  };

  const showNameChangeConfirmation = (
    oldName: string,
    newName: string
  ): Promise<NameChangeAction> => {
    return new Promise((resolve) => {
      const message = t('account.edit.modal.update-notes.message', {
        oldName,
        newName,
      });

      const modal = new NameChangeConfirmationModal(app, message, resolve);
      modal.open();
    });
  };

  const showCreationDateChangeConfirmation = (
    accountName: string,
    oldDate: Date,
    newDate: Date
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const modal = new CreationDateChangeConfirmationModal(
        app,
        accountName,
        oldDate,
        newDate,
        resolve
      );
      modal.open();
    });
  };

  const showInitialBalanceChangeConfirmation = (
    oldBalance: number,
    newBalance: number
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const modal = new InitialBalanceChangeConfirmationModal(
        app,
        plugin,
        oldBalance,
        newBalance,
        editAccount.currency,
        resolve
      );
      modal.open();
    });
  };

  const showDeleteAccountConfirmation = (
    accountName: string
  ): Promise<{ proceed: boolean; deleteAssociatedTrades: boolean }> => {
    return new Promise((resolve) => {
      const modal = new DeleteAccountConfirmationModal(
        app,
        accountName,
        resolve
      );
      modal.open();
    });
  };

  const handleDeleteAccount = async () => {
    try {
      setIsSaving(true);

      
      const deleteChoice = await showDeleteAccountConfirmation(account.name);

      if (!deleteChoice.proceed) {
        return; 
      }

      
      if (plugin.accountPageService) {
        await plugin.accountPageService.deleteAccount(account.name, {
          deleteAssociatedTrades: deleteChoice.deleteAssociatedTrades,
        });

        new Notice(t('account.edit.success.deleted', { name: account.name }));

        
        
        if (plugin.viewManager) {
          await plugin.viewManager.closeAccountPageViews(account.name);

          
          window.setTimeout(() => {
            void plugin.viewManager.navigateToAccountDashboard();
          }, 200); 
        }

        

        
        onSave();

        
        onModalClose();
      } else {
        new Notice(t('account.edit.error.service-unavailable'));
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      new Notice(
        t('account.edit.error.delete-failed', { error: getErrorMessage(error) })
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    customAccountTypes,
    showSnapshotManager,
    setShowSnapshotManager,
    editAccount,
    setEditAccount,
    manualSnapshots,
    setManualSnapshots,
    handleSave,
    handleDeleteAccount,
  };
};

const EditAccountModalContent: React.FC<
  EditAccountModalProps & { onModalClose: () => void }
> = ({ app, plugin, account, onSave, onModalClose }) => {
  const {
    isSaving,
    customAccountTypes,
    showSnapshotManager,
    setShowSnapshotManager,
    editAccount,
    setEditAccount,
    manualSnapshots,
    setManualSnapshots,
    handleSave,
    handleDeleteAccount,
  } = useEditAccountModalController({
    app,
    plugin,
    account,
    onSave,
    onModalClose,
  });

  return (
    <div className="edit-account-form">
      <div className="edit-account-form-body">
        <AccountIdentityFields
          editAccount={editAccount}
          setEditAccount={setEditAccount}
          customAccountTypes={customAccountTypes}
          isSaving={isSaving}
        />

        <AccountBalanceFields
          account={account}
          editAccount={editAccount}
          setEditAccount={setEditAccount}
          isSaving={isSaving}
        />

        <DrawdownSection
          app={app}
          account={account}
          editAccount={editAccount}
          setEditAccount={setEditAccount}
          manualSnapshots={manualSnapshots}
          setManualSnapshots={setManualSnapshots}
          showSnapshotManager={showSnapshotManager}
          setShowSnapshotManager={setShowSnapshotManager}
          isSaving={isSaving}
        />

        <ProfitTargetSection
          editAccount={editAccount}
          setEditAccount={setEditAccount}
          isSaving={isSaving}
        />

        <CopyTradingSection
          account={account}
          plugin={plugin}
          editAccount={editAccount}
          setEditAccount={setEditAccount}
          isSaving={isSaving}
        />
      </div>

      
      <div className="edit-account-buttons">
        <Button
          variant="secondary"
          onClick={() => void handleDeleteAccount()}
          disabled={isSaving}
          className="delete-account-button delete-account-danger"
        >
          {t('account.edit.button.delete')}
        </Button>
        <div className="button-group-right">
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
            className="save-account-button accent-button modal-save-accent"
          >
            {isSaving
              ? t('account.edit.button.saving')
              : t('account.edit.button.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};


class NameChangeConfirmationModal extends Modal {
  constructor(
    app: App,
    private message: string,
    private onConfirm: (action: NameChangeAction) => void
  ) {
    super(app);
    this.titleEl.setText(t('account.edit.modal.update-notes.title'));
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('p', { text: this.message });
    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    
    buttonContainer
      .createEl('button', {
        type: 'button',
        text: t('account.edit.modal.update-notes.yes'),
        cls: 'mod-cta',
      })
      .addEventListener('click', () => {
        this.close();
        this.onConfirm('update-notes');
      });

    
    buttonContainer
      .createEl('button', {
        type: 'button',
        text: t('account.edit.modal.update-notes.no'),
      })
      .addEventListener('click', () => {
        this.close();
        this.onConfirm('keep-old-name');
      });

    
    buttonContainer
      .createEl('button', {
        type: 'button',
        text: t('account.edit.modal.update-notes.cancel'),
      })
      .addEventListener('click', () => {
        this.close();
        this.onConfirm('cancel');
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}


class CreationDateChangeConfirmationModal extends Modal {
  constructor(
    app: App,
    private accountName: string,
    private oldDate: Date,
    private newDate: Date,
    private onConfirm: (proceed: boolean) => void
  ) {
    super(app);
    this.titleEl.setText(t('account.edit.modal.change-date.title'));
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    const container = contentEl.createDiv({
      cls: 'journalit-account-modal',
    });

    const userDateFormat = getUserDateFormat();

    
    const infoBox = container.createDiv({
      cls: 'journalit-account-modal__info',
    });
    infoBox.createEl('p', {
      text: t('account.edit.modal.change-date.message', {
        account: this.accountName,
        oldDate: formatDateDisplay(this.oldDate, userDateFormat),
        newDate: formatDateDisplay(this.newDate, userDateFormat),
      }),
      cls: 'journalit-account-modal__text',
    });

    
    const warningBox = container.createDiv({
      cls: 'journalit-account-modal__warning journalit-account-modal__warning--warning journalit-account-modal__warning--spaced',
    });
    warningBox.createEl('p', {
      text: t('account.edit.modal.change-date.warning'),
      cls: 'journalit-account-modal__text journalit-account-modal__text--small',
    });

    
    const buttons = container.createDiv({
      cls: 'journalit-account-modal__actions',
    });

    const cancelBtn = buttons.createEl('button', {
      text: t('button.cancel'),
      cls: 'journalit-account-modal__button journalit-account-modal__button--secondary',
    });
    cancelBtn.addEventListener('click', () => {
      this.close();
      this.onConfirm(false);
    });

    const confirmBtn = buttons.createEl('button', {
      text: t('account.edit.modal.change-date.confirm'),
      cls: 'journalit-account-modal__button journalit-account-modal__button--primary',
    });
    confirmBtn.addEventListener('click', () => {
      this.close();
      this.onConfirm(true);
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}


class InitialBalanceChangeConfirmationModal extends Modal {
  constructor(
    app: App,
    private plugin: JournalitPlugin,
    private oldBalance: number,
    private newBalance: number,
    private accountCurrency: string | undefined,
    private onConfirm: (proceed: boolean) => void
  ) {
    super(app);
    this.titleEl.setText(t('account.edit.modal.change-balance.title'));
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    const container = contentEl.createDiv({
      cls: 'journalit-account-modal',
    });

    const formatCurrency = (amount: number) => {
      
      const currency =
        this.accountCurrency ||
        this.plugin?.settings?.general?.currency ||
        'USD';
      return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
      });
    };

    
    const infoBox = container.createDiv({
      cls: 'journalit-account-modal__info',
    });
    infoBox.createEl('p', {
      text: t('account.edit.modal.change-balance.message', {
        oldBalance: formatCurrency(this.oldBalance),
        newBalance: formatCurrency(this.newBalance),
      }),
      cls: 'journalit-account-modal__text',
    });

    
    const warningBox = container.createDiv({
      cls: 'journalit-account-modal__warning journalit-account-modal__warning--warning',
    });
    warningBox.createEl('p', {
      text: t('account.edit.modal.change-balance.info'),
      cls: 'journalit-account-modal__text journalit-account-modal__text--small journalit-account-modal__text--spaced',
    });
    warningBox.createEl('p', {
      text: t('account.edit.modal.change-balance.info2'),
      cls: 'journalit-account-modal__text journalit-account-modal__text--muted',
    });

    
    container.createEl('p', {
      text: t('account.edit.modal.change-balance.info3'),
      cls: 'journalit-account-modal__danger-note',
    });

    
    const buttons = container.createDiv({
      cls: 'journalit-account-modal__actions',
    });

    const cancelBtn = buttons.createEl('button', {
      text: t('button.cancel'),
      cls: 'journalit-account-modal__button journalit-account-modal__button--secondary',
    });
    cancelBtn.addEventListener('click', () => {
      this.close();
      this.onConfirm(false);
    });

    const confirmBtn = buttons.createEl('button', {
      text: t('account.edit.modal.change-balance.confirm'),
      cls: 'journalit-account-modal__button journalit-account-modal__button--primary',
    });
    confirmBtn.addEventListener('click', () => {
      this.close();
      this.onConfirm(true);
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}


class DeleteAccountConfirmationModal extends Modal {
  private deleteAssociatedTrades = false;

  constructor(
    app: App,
    private accountName: string,
    private onConfirm: (choice: {
      proceed: boolean;
      deleteAssociatedTrades: boolean;
    }) => void
  ) {
    super(app);
    this.titleEl.setText(t('account.edit.modal.delete.title'));
    this.titleEl.addClass('journalit-modal-title-danger');
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    const container = contentEl.createDiv({
      cls: 'journalit-account-modal',
    });

    
    container.createEl('p', {
      text: t('account.edit.modal.delete.question', {
        name: this.accountName,
      }),
      cls: 'journalit-account-modal__question',
    });

    
    const warningBox = container.createDiv({
      cls: 'journalit-account-modal__warning journalit-account-modal__warning--danger',
    });

    warningBox.createEl('p', {
      text: t('account.edit.modal.delete.will'),
      cls: 'journalit-account-modal__text journalit-account-modal__text--small journalit-account-modal__text--emphasis journalit-account-modal__text--spaced',
    });

    const list = warningBox.createEl('ul', {
      cls: 'journalit-account-modal__list',
    });
    list.createEl('li', { text: t('account.edit.modal.delete.item1') });
    list.createEl('li', { text: t('account.edit.modal.delete.item2') });
    list.createEl('li', { text: t('account.edit.modal.delete.item3') });

    const tradeDeleteOption = container.createDiv({
      cls: 'journalit-account-modal__checkbox-row',
    });
    const tradeDeleteCheckbox = tradeDeleteOption.createEl('input', {
      type: 'checkbox',
    });
    tradeDeleteCheckbox.addEventListener('change', () => {
      this.deleteAssociatedTrades = tradeDeleteCheckbox.checked;
    });
    tradeDeleteOption.createEl('label', {
      text: t('account.edit.modal.delete.delete-associated-trades'),
    });

    
    const dangerWarning = container.createEl('p', {
      cls: 'journalit-account-modal__danger-warning',
    });

    dangerWarning.createEl('strong', {
      text: `⚠️ ${t('common.warning').toUpperCase()}:`,
    });
    dangerWarning.createSpan({
      text: ` ${t('account.edit.delete-warning')}`,
    });

    
    const buttons = container.createDiv({
      cls: 'journalit-account-modal__actions',
    });

    const cancelBtn = buttons.createEl('button', {
      text: t('button.cancel'),
      cls: 'journalit-account-modal__button journalit-account-modal__button--primary',
    });
    cancelBtn.addEventListener('click', () => {
      this.close();
      this.onConfirm({ proceed: false, deleteAssociatedTrades: false });
    });

    const deleteBtn = buttons.createEl('button', {
      text: t('account.edit.button.delete-name', {
        name: this.accountName,
      }),
      cls: 'journalit-account-modal__button journalit-account-modal__button--danger',
    });
    deleteBtn.addEventListener('click', () => {
      this.close();
      this.onConfirm({
        proceed: true,
        deleteAssociatedTrades: this.deleteAssociatedTrades,
      });
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}


export function openEditAccountModal(
  app: App,
  plugin: JournalitPlugin,
  account: AccountData,
  onSave: () => void
): void {
  const modal = new EditAccountModal({
    app,
    plugin,
    account,
    onClose: () => {}, 
    onSave,
  });
  modal.open();
}
