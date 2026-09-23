

import { App, Modal, Notice } from 'obsidian';
import React, { useState, useEffect, useCallback, useId, useRef } from 'react';
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
import Checkbox from '../../ui/Checkbox';
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
import { useEventBus } from '../../../hooks/useEventBus';
import { eventBus } from '../../../services/events/EventBus';
import { t } from '../../../lang/helpers';
import { showActionConfirmationModal } from '../../shared/ConfirmationModal';
import {
  hasLiveBalanceAdjustment,
  parseLiveBalanceInput,
  toLiveBalanceAdjustment,
} from '../../../services/account/liveBalanceAdjustment';
import type { CopyTradingPeriod } from '../../../settings/types';
import type { PropChallengeConfig } from '../../../services/propChallenge/types';
import { resolveStageAccountType } from '../../../services/propChallenge/stageAccountTypes';
import { getAvailableAccountTypes } from './propChallenge/propChallengeLifecycleActions';
import {
  createPropChallengeFromExistingAccount,
  getCurrentPropChallengePhase,
  isPropChallengeRuleComplete,
  validatePhaseTimeline,
} from '../../../services/propChallenge/PropChallengeConfig';
import { DisplayPolicyProvider } from '../../../contexts/DisplayPolicyContext';
import { SegmentedControl } from '../../shared/SegmentedControl';
import { PropChallengeSettingsSection } from './propChallenge/PropChallengeSettingsSection';
import { DropdownSelect } from '../../shared/DropdownSelect';
import { Tooltip } from '../../shared/Tooltip';
import { Info } from '../../shared/icons/ObsidianIcon';
import { PropChallengeToggleField } from './PropChallengeToggleField';
import { AccountPageDataProvider } from '../context/AccountPageDataContext';
import { useAccountPageService } from '../../../hooks/useService';
import {
  isValidCopyTradingMultiplier,
  hasActiveCopyTradingPeriod,
  isAccountUsedAsActiveCopyBase,
} from '../../../utils/accountCopyTrading';
import { formatAccountTypeLabel } from '../../../utils/accountTypeLabel';

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
  
  initialPropChallenge?: boolean;
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
  propChallenge?: PropChallengeConfig;
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
    this.modalEl.addClass('journalit-edit-account-modal');

    
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
        <EditAccountModalTree
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
      </div>
      <div className="setting-item-control">
        <DropdownSelect
          value={editAccount.accountType}
          onChange={(accountType) => {
            setEditAccount((currentAccount) => ({
              ...currentAccount,
              accountType,
            }));
          }}
          ariaLabel={t('account.edit.field.type')}
          disabled={isSaving}
          options={
            customAccountTypes.length > 0
              ? customAccountTypes.map((type) => ({
                  value: type,
                  label: formatAccountTypeLabel(type),
                }))
              : [
                  {
                    value: AccountType.DEMO,
                    label: t('account.edit.type.demo'),
                  },
                  {
                    value: AccountType.EVALUATION,
                    label: t('account.edit.type.evaluation'),
                  },
                  {
                    value: AccountType.FUNDED,
                    label: t('account.edit.type.funded'),
                  },
                ]
          }
        />
      </div>
    </div>
  </div>
);

interface AccountBalanceFieldsProps {
  account: AccountData;
  editAccount: EditAccountFormState;
  setEditAccount: EditAccountSetter;
  isSaving: boolean;
  isPropChallenge: boolean;
}

const AccountBalanceFields: React.FC<AccountBalanceFieldsProps> = ({
  account,
  editAccount,
  setEditAccount,
  isSaving,
  isPropChallenge,
}) => (
  <>
    <div
      className={`setting-item two-column${isPropChallenge ? ' journalit-account-created-date-only' : ''}`}
    >
      {!isPropChallenge && (
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
                editAccount.initialBalance === 0
                  ? ''
                  : editAccount.initialBalance
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
              aria-label={t('account.edit.field.initial-balance')}
              disabled={isSaving}
            />
          </div>
        </div>
      )}
      <div
        className={`column${isPropChallenge ? ' journalit-account-created-date-column' : ''}`}
      >
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
            aria-label={t('account.edit.field.live-balance')}
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
          <DropdownSelect
            value={editAccount.currency}
            onChange={(currencyValue) => {
              const currency = parseCuratedCurrencyCode(currencyValue);
              setEditAccount((currentAccount) => ({
                ...currentAccount,
                currency,
              }));
            }}
            ariaLabel={t('account.edit.field.currency')}
            disabled={isSaving}
            options={Object.values(CURRENCY_CONFIGS).map((config) => ({
              value: config.code,
              label: `${config.symbol} ${config.code} - ${config.name}`,
            }))}
          />
        </div>
      </div>
    </div>
  </>
);

const PropChallengeAccountBasics: React.FC<
  Omit<AccountBalanceFieldsProps, 'isPropChallenge'>
> = ({ editAccount, setEditAccount, isSaving }) => (
  <div className="setting-item two-column journalit-prop-challenge-account-basics">
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
              setEditAccount((current) => ({ ...current, createdDate: date }));
            }
          }}
          disabled={isSaving}
        />
      </div>
    </div>
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
          onChange={(event) =>
            setEditAccount((current) => ({
              ...current,
              liveBalance: event.target.value,
            }))
          }
          step="100"
          placeholder={String(editAccount.initialBalance || 0)}
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
        <DropdownSelect
          value={editAccount.currency}
          onChange={(currencyValue) => {
            const currency = parseCuratedCurrencyCode(currencyValue);
            setEditAccount((current) => ({ ...current, currency }));
          }}
          ariaLabel={t('account.edit.field.currency')}
          disabled={isSaving}
          options={Object.values(CURRENCY_CONFIGS).map((config) => ({
            value: config.code,
            label: `${config.symbol} ${config.code} - ${config.name}`,
          }))}
        />
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
          onChange={(event) => {
            const monthlyCost =
              event.target.value === ''
                ? 0
                : parseFloat(event.target.value) || 0;
            setEditAccount((current) => ({ ...current, monthlyCost }));
          }}
          min="0"
          step="1"
          placeholder="0"
          aria-label={t('account.edit.field.monthly-cost')}
          disabled={isSaving}
        />
      </div>
    </div>
  </div>
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
}) => {
  const drawdownTypeLabelId = useId();
  return (
    <>
      <div className="setting-item journalit-setting-item--full-width">
        <div className="setting-item-info">
          <div className="setting-item-name" id={drawdownTypeLabelId}>
            {t('account.edit.field.drawdown-type')}
          </div>
        </div>
        <SegmentedControl<DrawdownType>
          className="journalit-drawdown-type-control"
          options={DRAWDOWN_TYPE_OPTIONS.map((option) => ({
            value: option.value,
            label: t(option.labelKey),
          }))}
          value={editAccount.drawdownType}
          groupRole="radiogroup"
          ariaLabelledBy={drawdownTypeLabelId}
          fullWidth
          disabled={isSaving}
          onChange={(next) => {
            setEditAccount((currentAccount) => {
              const newAmount =
                next !== DrawdownType.NONE &&
                currentAccount.drawdownType === DrawdownType.NONE
                  ? Math.round(account.initialBalance * 0.1)
                  : currentAccount.drawdownAmount;

              return {
                ...currentAccount,
                drawdownType: next,
                drawdownAmount: next === DrawdownType.NONE ? 0 : newAmount,
              };
            });
          }}
        />
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
              aria-label={t('account.edit.field.drawdown-amount')}
              type="number"
              value={
                editAccount.drawdownAmount === 0
                  ? ''
                  : editAccount.drawdownAmount
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
};

interface ProfitTargetSectionProps {
  editAccount: EditAccountFormState;
  setEditAccount: EditAccountSetter;
  isSaving: boolean;
  isPropChallenge: boolean;
}

const ProfitTargetSection: React.FC<ProfitTargetSectionProps> = ({
  editAccount,
  setEditAccount,
  isSaving,
  isPropChallenge,
}) => {
  if (isPropChallenge) {
    return (
      <div className="setting-item">
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
            aria-label={t('account.edit.field.monthly-cost')}
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
            min="0"
            step="1"
            placeholder="0"
            disabled={isSaving}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="setting-item two-column">
        <div className="column">
          <div className="journalit-checkbox-setting-row journalit-feature-toggle-row">
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
              value={
                editAccount.monthlyCost === 0 ? '' : editAccount.monthlyCost
              }
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
              aria-label={t('account.edit.field.monthly-cost')}
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
                <DropdownSelect
                  value={editAccount.profitTargetType}
                  onChange={(targetType) => {
                    const profitTargetType =
                      profitTargetTypeFromSelect(targetType);
                    setEditAccount((currentAccount) => ({
                      ...currentAccount,
                      profitTargetType,
                    }));
                  }}
                  ariaLabel={t('account.edit.field.target-type')}
                  disabled={isSaving}
                  options={[
                    {
                      value: ProfitTargetType.ABSOLUTE,
                      label: t('account.profit-target.type.absolute'),
                    },
                    {
                      value: ProfitTargetType.PERCENTAGE,
                      label: t('account.profit-target.type.percentage'),
                    },
                  ]}
                />
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
                    editAccount.profitTarget === 0
                      ? ''
                      : editAccount.profitTarget
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const profitTarget =
                      e.target.value === ''
                        ? 0
                        : parseFloat(e.target.value) || 0;
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
                  aria-label={
                    editAccount.profitTargetType === ProfitTargetType.PERCENTAGE
                      ? t('account.edit.field.target-percent')
                      : t('account.edit.field.target-dollar')
                  }
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
};

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
    <div
      className={`setting-item journalit-setting-item--full-width journalit-copy-trading-section${!editAccount.propChallenge && !editAccount.copyTradingEnabled ? ' journalit-copy-trading-section--compact' : ''}`}
    >
      <div className="journalit-checkbox-setting-row journalit-feature-toggle-row">
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
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('account.copy-trading.title')}
            <Tooltip
              content={t('account.copy-trading.description')}
              preferredPosition="top"
              triggerClassName="journalit-copy-trading-info-trigger"
            >
              <span className="journalit-copy-trading-info-icon">
                <Info size={14} aria-hidden="true" />
              </span>
            </Tooltip>
          </div>
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
                <DropdownSelect
                  value={editAccount.copyTradingBaseAccount}
                  onChange={(copyTradingBaseAccount) =>
                    setEditAccount((currentAccount) => ({
                      ...currentAccount,
                      copyTradingBaseAccount,
                    }))
                  }
                  ariaLabel={t('account.copy-trading.base-account')}
                  placeholder={t(
                    'account.copy-trading.base-account-placeholder'
                  )}
                  disabled={isSaving}
                  options={baseAccountOptions.map((accountName) => ({
                    value: accountName,
                    label: accountName,
                  }))}
                />
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
                  aria-label={t('account.copy-trading.multiplier')}
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
                      aria-label={t('account.copy-trading.start-date')}
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
  initialPropChallenge,
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
    propChallenge:
      account.propChallenge ??
      (initialPropChallenge
        ? createPropChallengeFromExistingAccount({
            initialBalance: account.initialBalance,
            drawdownType: account.drawdownType,
            drawdownAmount: account.drawdownAmount,
            hasProfitTarget: account.hasProfitTarget,
            profitTarget: account.profitTarget,
            profitTargetType: account.profitTargetType,
            phaseName: t('account.prop-challenge.default-phase-name', {
              number: '1',
            }),
          })
        : undefined),
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

      if (editAccount.propChallenge) {
        const timelineError = validatePhaseTimeline(editAccount.propChallenge);
        if (timelineError) {
          new Notice(timelineError);
          return;
        }
        
        
        
        const invalidPhase = editAccount.propChallenge.phases.find(
          (phase) =>
            !Number.isFinite(phase.startingBalance) || phase.startingBalance < 0
        );
        if (invalidPhase) {
          new Notice(t('account.edit.error.balance-required'));
          return;
        }
        
        
        const invalidRule = editAccount.propChallenge.phases
          .flatMap((phase) => phase.rules)
          .find((rule) => !isPropChallengeRuleComplete(rule));
        if (invalidRule) {
          new Notice(t('account.create.error.rule-incomplete'));
          return;
        }
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

      
      const effectiveInitialBalance =
        editAccount.propChallenge?.phases[0]?.startingBalance ??
        editAccount.initialBalance;
      const initialBalanceChanged =
        account.initialBalance !== effectiveInitialBalance;

      if (effectiveNameChanged && initialBalanceChanged) {
        
        const shouldProceedWithBalance =
          await showInitialBalanceChangeConfirmation(
            account.initialBalance,
            effectiveInitialBalance
          );
        if (shouldProceedWithBalance) {
          await performUpdate(
            renameConfirmed,
            effectiveAccountName,
            validatedCreatedDate,
            effectiveInitialBalance
          );
        } else {
          
          setEditAccount((prev) => ({
            ...prev,
            initialBalance: account.initialBalance,
          }));
          await performUpdateWithAccountName(
            renameConfirmed,
            effectiveAccountName,
            validatedCreatedDate,
            account.initialBalance
          );
        }
      } else if (effectiveNameChanged) {
        
        await performUpdate(
          renameConfirmed,
          effectiveAccountName,
          validatedCreatedDate,
          effectiveInitialBalance
        );
      } else if (initialBalanceChanged) {
        
        const shouldProceedWithBalance =
          await showInitialBalanceChangeConfirmation(
            account.initialBalance,
            effectiveInitialBalance
          );
        if (shouldProceedWithBalance) {
          await performUpdate(
            false,
            effectiveAccountName,
            validatedCreatedDate,
            effectiveInitialBalance
          );
        } else {
          
          return;
        }
      } else {
        
        await performUpdate(
          false,
          effectiveAccountName,
          validatedCreatedDate,
          effectiveInitialBalance
        );
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
    createdDate: Date,
    initialBalance: number
  ) => {
    await performUpdateWithAccountName(
      shouldUpdateNotes,
      accountName,
      createdDate,
      initialBalance
    );
  };

  const performUpdateWithAccountName = async (
    shouldUpdateNotes: boolean,
    accountName: string,
    createdDate: Date,
    initialBalance: number
  ) => {
    try {
      
      const oldCreatedDate = new Date(account.createdDate);
      const newCreatedDate = new Date(createdDate);

      
      oldCreatedDate.setHours(0, 0, 0, 0);
      newCreatedDate.setHours(0, 0, 0, 0);

      const creationDateChanged =
        oldCreatedDate.getTime() !== newCreatedDate.getTime();

      let effectiveCreatedDate = createdDate;
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
          effectiveCreatedDate = oldCreatedDate;
        }
      }

      await updateAccountDataWithAccountName(
        shouldUpdateNotes,
        accountName,
        effectiveCreatedDate,
        initialBalance
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
    createdDate: Date,
    initialBalance: number
  ) => {
    try {
      const parsedLiveBalance = parseLiveBalanceInput(editAccount.liveBalance);
      if (parsedLiveBalance === undefined) {
        new Notice(t('account.edit.error.invalid-live-balance'));
        return;
      }

      
      
      
      
      
      const effectiveInitialBalance = initialBalance;
      const firstPhase = editAccount.propChallenge?.phases[0];
      const effectivePropChallenge =
        editAccount.propChallenge && firstPhase
          ? {
              ...editAccount.propChallenge,
              phases: editAccount.propChallenge.phases.map((phase, index) =>
                index === 0
                  ? { ...phase, startingBalance: effectiveInitialBalance }
                  : phase
              ),
            }
          : editAccount.propChallenge;

      
      const baseCurrentBalanceWithoutAdjustment =
        account.currentBalance - (account.liveBalanceAdjustment ?? 0);
      const nextComputedCurrentBalance =
        baseCurrentBalanceWithoutAdjustment +
        (effectiveInitialBalance - account.initialBalance);
      const liveBalanceAdjustment = toLiveBalanceAdjustment(
        parsedLiveBalance,
        nextComputedCurrentBalance
      );

      const updateData: Partial<AccountData> = {
        name: accountName,
        accountType: editAccount.accountType,
        initialBalance: effectiveInitialBalance,
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
          propChallenge: effectivePropChallenge,

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
    return showActionConfirmationModal<NameChangeAction>(app, {
      title: t('account.edit.modal.update-notes.title'),
      message: t('account.edit.modal.update-notes.message', {
        oldName,
        newName,
      }),
      cancelValue: 'cancel',
      actions: [
        {
          value: 'update-notes',
          label: t('account.edit.modal.update-notes.yes'),
          variant: 'primary',
        },
        {
          value: 'keep-old-name',
          label: t('account.edit.modal.update-notes.no'),
          variant: 'secondary',
        },
        {
          value: 'cancel',
          label: t('account.edit.modal.update-notes.cancel'),
          variant: 'secondary',
        },
      ],
    });
  };

  const showCreationDateChangeConfirmation = (
    accountName: string,
    oldDate: Date,
    newDate: Date
  ): Promise<boolean> => {
    return showActionConfirmationModal<boolean>(app, {
      title: t('account.edit.modal.change-date.title'),
      cancelValue: false,
      renderContent: (contentEl) => {
        const container = contentEl.createDiv({
          cls: 'journalit-confirmation-content',
        });
        const infoBox = container.createDiv({
          cls: 'journalit-confirmation-content__info',
        });
        infoBox.createEl('p', {
          text: t('account.edit.modal.change-date.message', {
            account: accountName,
            oldDate: formatDateDisplay(oldDate, getUserDateFormat()),
            newDate: formatDateDisplay(newDate, getUserDateFormat()),
          }),
          cls: 'journalit-confirmation-modal__message',
        });
        const warningBox = container.createDiv({
          cls: 'journalit-confirmation-content__info',
        });
        warningBox.createEl('p', {
          text: t('account.edit.modal.change-date.warning'),
          cls: 'journalit-confirmation-modal__message',
        });
      },
      actions: [
        {
          value: false,
          label: t('button.cancel'),
          variant: 'secondary',
          initialFocus: true,
        },
        {
          value: true,
          label: t('account.edit.modal.change-date.confirm'),
          variant: 'primary',
        },
      ],
    });
  };

  const showInitialBalanceChangeConfirmation = (
    oldBalance: number,
    newBalance: number
  ): Promise<boolean> => {
    const formatCurrency = (amount: number) =>
      amount.toLocaleString('en-US', {
        style: 'currency',
        currency:
          editAccount.currency || plugin.settings?.general?.currency || 'USD',
        minimumFractionDigits: 2,
      });

    return showActionConfirmationModal<boolean>(app, {
      title: t('account.edit.modal.change-balance.title'),
      cancelValue: false,
      renderContent: (contentEl) => {
        const container = contentEl.createDiv({
          cls: 'journalit-confirmation-content',
        });
        const infoBox = container.createDiv({
          cls: 'journalit-confirmation-content__info',
        });
        infoBox.createEl('p', {
          text: t('account.edit.modal.change-balance.message', {
            oldBalance: formatCurrency(oldBalance),
            newBalance: formatCurrency(newBalance),
          }),
          cls: 'journalit-confirmation-modal__message',
        });
        const warningBox = container.createDiv({
          cls: 'journalit-confirmation-content__info',
        });
        warningBox.createEl('p', {
          text: t('account.edit.modal.change-balance.info'),
          cls: 'journalit-confirmation-modal__message',
        });
        warningBox.createEl('p', {
          text: t('account.edit.modal.change-balance.info2'),
          cls: 'journalit-confirmation-modal__message',
        });
        container.createEl('p', {
          text: t('account.edit.modal.change-balance.info3'),
          cls: 'journalit-confirmation-modal__message journalit-confirmation-modal__message--destructive',
        });
      },
      actions: [
        {
          value: false,
          label: t('button.cancel'),
          variant: 'secondary',
          initialFocus: true,
        },
        {
          value: true,
          label: t('account.edit.modal.change-balance.confirm'),
          variant: 'primary',
        },
      ],
    });
  };

  const showDeleteAccountConfirmation = (
    accountName: string
  ): Promise<{ proceed: boolean; deleteAssociatedTrades: boolean }> => {
    let deleteAssociatedTrades = false;
    return showActionConfirmationModal<'cancel' | 'delete'>(app, {
      title: t('account.edit.modal.delete.title'),
      destructive: true,
      cancelValue: 'cancel',
      renderContent: (contentEl) => {
        const container = contentEl.createDiv({
          cls: 'journalit-confirmation-content',
        });
        container.createEl('p', {
          text: t('account.edit.modal.delete.question', {
            name: accountName,
          }),
          cls: 'journalit-confirmation-modal__message',
        });

        const warningBox = container.createDiv({
          cls: 'journalit-confirmation-content__alert journalit-confirmation-content__alert--destructive',
        });
        warningBox.createEl('p', {
          text: t('account.edit.modal.delete.will'),
          cls: 'journalit-confirmation-modal__message',
        });
        const list = warningBox.createEl('ul', {
          cls: 'journalit-confirmation-content__list',
        });
        list.createEl('li', { text: t('account.edit.modal.delete.item1') });
        list.createEl('li', { text: t('account.edit.modal.delete.item2') });
        list.createEl('li', { text: t('account.edit.modal.delete.item3') });

        const tradeDeleteOption = container.createDiv({
          cls: 'journalit-confirmation-content__checkbox',
        });
        const tradeDeleteCheckbox = tradeDeleteOption.createEl('input', {
          type: 'checkbox',
        });
        tradeDeleteCheckbox.addEventListener('change', () => {
          deleteAssociatedTrades = tradeDeleteCheckbox.checked;
        });
        tradeDeleteOption.createEl('label', {
          text: t('account.edit.modal.delete.delete-associated-trades'),
        });

        const dangerWarning = container.createEl('p', {
          cls: 'journalit-confirmation-modal__message journalit-confirmation-modal__message--destructive',
        });
        dangerWarning.createEl('strong', {
          text: `⚠️ ${t('common.warning').toUpperCase()}:`,
        });
        dangerWarning.createSpan({
          text: ` ${t('account.edit.delete-warning')}`,
        });
      },
      actions: [
        {
          value: 'cancel',
          label: t('button.cancel'),
          variant: 'secondary',
          initialFocus: true,
        },
        {
          value: 'delete',
          label: t('account.edit.button.delete-name', { name: accountName }),
          variant: 'destructive',
        },
      ],
    }).then((action) =>
      action === 'delete'
        ? { proceed: true, deleteAssociatedTrades }
        : { proceed: false, deleteAssociatedTrades: false }
    );
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

const EditAccountModalTree: React.FC<
  EditAccountModalProps & { onModalClose: () => void }
> = (props) => {
  const { service } = useAccountPageService();
  if (!service) {
    return <EditAccountModalContent {...props} />;
  }
  return (
    <AccountPageDataProvider
      app={props.app}
      accountPageService={service}
      accountName={props.account.name}
      plugin={props.plugin}
    >
      <EditAccountModalContent {...props} />
    </AccountPageDataProvider>
  );
};

const EditAccountModalContent: React.FC<
  EditAccountModalProps & { onModalClose: () => void }
> = ({ app, plugin, account, onSave, onModalClose, initialPropChallenge }) => {
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
    initialPropChallenge,
  });

  
  const discardedChallengeRef = useRef<PropChallengeConfig | undefined>(
    undefined
  );

  const handlePropChallengeToggle = (enabled: boolean) => {
    
    
    
    
    
    
    if (editAccount.propChallenge) {
      discardedChallengeRef.current = editAccount.propChallenge;
    }
    setEditAccount((current) => {
      const restored = enabled
        ? (current.propChallenge ?? discardedChallengeRef.current)
        : undefined;
      
      
      
      
      const restoredStage = restored
        ? getCurrentPropChallengePhase(restored)?.stage
        : undefined;
      const restoredType = restoredStage
        ? resolveStageAccountType(
            plugin?.settings.account?.challengeStageAccountTypes,
            restoredStage,
            getAvailableAccountTypes(plugin)
          )
        : undefined;
      return {
        ...current,
        ...(enabled
          ? {
              accountType:
                restoredType ?? (restored ? current.accountType : 'evaluation'),
            }
          : {}),
        propChallenge: enabled
          ? (restored ??
            createPropChallengeFromExistingAccount({
              initialBalance: current.initialBalance,
              drawdownType: current.drawdownType,
              drawdownAmount: current.drawdownAmount,
              hasProfitTarget: current.hasProfitTarget,
              profitTarget: current.profitTarget,
              profitTargetType: current.profitTargetType,
              phaseName: t('account.prop-challenge.default-phase-name', {
                number: '1',
              }),
            }))
          : undefined,
      };
    });
  };

  return (
    <div className="edit-account-form">
      <div className="edit-account-form-body">
        <AccountIdentityFields
          editAccount={editAccount}
          setEditAccount={setEditAccount}
          customAccountTypes={customAccountTypes}
          isSaving={isSaving}
        />

        
        <PropChallengeToggleField
          checked={Boolean(editAccount.propChallenge)}
          disabled={isSaving}
          onChange={handlePropChallengeToggle}
        />

        {editAccount.propChallenge ? (
          <PropChallengeAccountBasics
            account={account}
            editAccount={editAccount}
            setEditAccount={setEditAccount}
            isSaving={isSaving}
          />
        ) : (
          <>
            <AccountBalanceFields
              account={account}
              editAccount={editAccount}
              setEditAccount={setEditAccount}
              isSaving={isSaving}
              isPropChallenge={false}
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
              isPropChallenge={false}
            />
          </>
        )}

        {editAccount.propChallenge && (
          <DisplayPolicyProvider privacyModeOverride={false}>
            <PropChallengeSettingsSection
              existingAccount
              value={editAccount.propChallenge}
              currencyCode={editAccount.currency}
              disabled={isSaving}
              accountType={editAccount.accountType}
              onChange={(propChallenge) =>
                setEditAccount((current) => ({ ...current, propChallenge }))
              }
              onAccountTypeChange={(accountType) =>
                setEditAccount((current) => ({ ...current, accountType }))
              }
            />
          </DisplayPolicyProvider>
        )}

        
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


export function openEditAccountModal(
  app: App,
  plugin: JournalitPlugin,
  account: AccountData,
  onSave: () => void,
  initialPropChallenge?: boolean
): void {
  const modal = new EditAccountModal({
    app,
    plugin,
    account,
    onClose: () => {}, 
    onSave,
    initialPropChallenge,
  });
  modal.open();
}
