

import {
  deleteTradeImportAccountsFromServer,
  findServerImportAccountsForLocalAccount,
  type ServerImportAccount,
} from '../../../services/tradeImport/tradeImportServerDeletion';
import { App, Notice } from 'obsidian';
import {
  AccountFormModal,
  type AccountFormCloseProps,
} from './AccountFormModal';
import React, {
  useState,
  useEffect,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
} from 'react';
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
import { DraftInput } from '../../ui/DraftInput';
import Checkbox from '../../ui/Checkbox';
import { FastDateTimeInput } from '../../core/FastDateTimeInput';
import {
  DateDraftGateContext,
  useDateDraftGate,
} from '../../core/DateDraftGate';
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
import {
  showActionConfirmationModal,
  showConfirmationModal,
} from '../../shared/ConfirmationModal';
import { openAccountMergeModal } from './accountMerge/AccountMergeModal';
import {
  parseLiveBalanceInput,
  toLiveBalanceAdjustment,
} from '../../../services/account/liveBalanceAdjustment';
import type { CopyTradingPeriod } from '../../../settings/types';
import type { PropChallengeConfig } from '../../../services/propChallenge/types';
import { resolveStageAccountType } from '../../../services/propChallenge/stageAccountTypes';
import {
  getAvailableAccountTypes,
  resolveAvailableAccountType,
} from './propChallenge/propChallengeLifecycleActions';
import {
  getCurrentPropChallengePhase,
  validatePhaseTimeline,
} from '../../../services/propChallenge/PropChallengeConfig';
import { rewriteAccountReferenceNotes } from '../../../services/account/accountRename';
import {
  accountDefinitionIssue,
  type AccountDefinitionIssue,
  profitTargetNeedsBalance,
} from '../../../services/account/accountDefinitionRules';
import { DisplayPolicyProvider } from '../../../contexts/DisplayPolicyContext';
import { SegmentedControl } from '../../shared/SegmentedControl';
import { ModalEscapeProvider } from '../../shared/disclosureEscape';
import { PropChallengeSettingsSection } from './propChallenge/PropChallengeSettingsSection';
import { DropdownSelect } from '../../shared/DropdownSelect';
import { Tooltip } from '../../shared/Tooltip';
import { Info } from '../../shared/icons/ObsidianIcon';
import { PropChallengeToggleField } from './PropChallengeToggleField';
import { AccountFormField } from './AccountFormField';
import { ProfitTargetTypeControl } from './ProfitTargetTypeControl';
import { AccountPageDataProvider } from '../context/AccountPageDataContext';
import { useAccountPageService } from '../../../hooks/useService';
import {
  isValidCopyTradingMultiplier,
  hasActiveCopyTradingPeriod,
  isAccountUsedAsActiveCopyBase,
  nextCopyTradingPeriods,
} from '../../../utils/accountCopyTrading';
import { formatAccountTypeLabel } from '../../../utils/accountTypeLabel';
import { suspendViewGuidesWhileOpen } from '../../../guides/suspendViewGuides';
import type { AccountTradeData } from '../../../services/accountPage/types';
import {
  evaluatePropChallengePhase,
  InactivePropChallengeBalanceError,
} from '../../../services/propChallenge/PropChallengeRuleEngine';
import {
  applyLiveBalanceToCurrentPhase,
  getAccountLiveBalanceInput,
} from '../../../services/propChallenge/PropChallengeBalance';
import { AccountMetadataConflictError } from '../../../services/accountPage/AccountPageService';

export const EDIT_ACCOUNT_MODAL_STYLES = `
        .journalit-account-form .journalit-manage-snapshots-button {
          align-self: flex-start;
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


const EDIT_DEFINITION_ISSUE_MESSAGES: Record<
  AccountDefinitionIssue,
  () => string
> = {
  'balance-negative': () => t('account.edit.error.balance-required'),
  'rule-incomplete': () => t('account.create.error.rule-incomplete'),
  'drawdown-required': () => t('account.edit.error.drawdown-required'),
  'profit-target-required': () =>
    t('account.create.error.profit-target-required'),
  'profit-target-needs-balance': () =>
    t('account.create.error.profit-target-needs-balance'),
  'phase-profit-target-needs-balance': () =>
    t('account.create.error.phase-profit-target-needs-balance'),
  'invalid-date': () => t('account.edit.error.creation-date-required'),
  'future-date': () => t('account.edit.error.future-date'),
  'cost-negative': () => t('account.create.error.cost-negative'),
};

const getErrorMessage = (error: unknown): string =>
  error instanceof InactivePropChallengeBalanceError
    ? t('account.edit.error.inactive-phase')
    : error instanceof AccountMetadataConflictError
      ? t('account.edit.error.phase-changed')
      : error instanceof Error
        ? error.message
        : String(error);

interface EditAccountModalProps {
  app: App;
  plugin: JournalitPlugin;
  account: AccountData;
  trades: readonly AccountTradeData[];
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
  propChallenge?: PropChallengeConfig;
}


class EditAccountModal extends AccountFormModal {
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
    this.modalEl.addClass('journalit-account-form-modal');
    suspendViewGuidesWhileOpen(this.modalEl);

    
    this.container = contentEl.createDiv({
      cls: 'journalit-account-form-container',
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
      <ModalEscapeProvider app={this.app} scope={this.scope}>
        <CurrencyProvider>
          <EditAccountModalTree
            {...this.props}
            onModalClose={this.closeWithoutConfirm}
            onRequestClose={() => this.close()}
            closeHandle={this.closeHandle}
          />
        </CurrencyProvider>
      </ModalEscapeProvider>
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
    <AccountFormField label={t('account.form.field.name')} labelFor="input">
      {(controlId) => (
        <input
          id={controlId}
          type="text"
          value={editAccount.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const name = e.target.value;
            setEditAccount((currentAccount) => ({ ...currentAccount, name }));
          }}
          placeholder={t('account.form.placeholder.name')}
          disabled={isSaving}
        />
      )}
    </AccountFormField>
    <AccountFormField label={t('account.form.field.type')}>
      <DropdownSelect
        value={editAccount.accountType}
        onChange={(accountType) => {
          setEditAccount((currentAccount) => ({
            ...currentAccount,
            accountType,
          }));
        }}
        ariaLabel={t('account.form.field.type')}
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
                  label: t('account.form.type.demo'),
                },
                {
                  value: AccountType.EVALUATION,
                  label: t('account.form.type.evaluation'),
                },
                {
                  value: AccountType.FUNDED,
                  label: t('account.form.type.funded'),
                },
              ]
        }
      />
    </AccountFormField>
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
        <AccountFormField
          label={t('account.form.field.initial-balance')}
          description={t('account.form.field.initial-balance-desc')}
          optional
        >
          <DraftInput
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
            min="0"
            step="100"
            placeholder="0"
            aria-label={t('account.form.field.initial-balance')}
            disabled={isSaving}
          />
        </AccountFormField>
      )}
      <AccountFormField
        label={t('account.form.field.creation-date')}
        description={t('account.form.field.creation-date-desc')}
        className={
          isPropChallenge ? 'journalit-account-created-date-column' : undefined
        }
      >
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
      </AccountFormField>
    </div>
    <div className="setting-item two-column journalit-setting-item--balance-row">
      <AccountFormField
        label={t('account.form.field.live-balance')}
        description={t('account.form.field.live-balance-desc')}
        optional
      >
        <input
          aria-label={t('account.form.field.live-balance')}
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
      </AccountFormField>
      <AccountFormField
        label={t('account.form.field.currency')}
        description={t('account.form.field.currency-desc')}
      >
        <DropdownSelect
          value={editAccount.currency}
          onChange={(currencyValue) => {
            const currency = parseCuratedCurrencyCode(currencyValue);
            setEditAccount((currentAccount) => ({
              ...currentAccount,
              currency,
            }));
          }}
          ariaLabel={t('account.form.field.currency')}
          disabled={isSaving}
          options={Object.values(CURRENCY_CONFIGS).map((config) => ({
            value: config.code,
            label: `${config.symbol} ${config.code} - ${config.name}`,
          }))}
        />
      </AccountFormField>
    </div>
  </>
);

const PropChallengeAccountBasics: React.FC<
  Omit<AccountBalanceFieldsProps, 'isPropChallenge'>
> = ({ account, editAccount, setEditAccount, isSaving }) => (
  <div className="setting-item two-column journalit-prop-challenge-account-basics">
    <AccountFormField
      label={t('account.form.field.live-balance')}
      optional
      description={
        <>
          {t('account.form.field.live-balance-desc')}
          {account.unscopedLiveBalanceAdjustment !== undefined && (
            <p>{t('account.edit.field.unscoped-live-balance-desc')}</p>
          )}
        </>
      }
    >
      <input
        type="number"
        value={editAccount.liveBalance}
        aria-label={t('account.form.field.live-balance')}
        onChange={(event) =>
          setEditAccount((current) => ({
            ...current,
            liveBalance: event.target.value,
          }))
        }
        step="100"
        placeholder={String(editAccount.initialBalance || 0)}
        disabled={
          isSaving ||
          Boolean(
            editAccount.propChallenge &&
            getCurrentPropChallengePhase(editAccount.propChallenge)?.status !==
              'active'
          )
        }
      />
    </AccountFormField>
    <AccountFormField
      label={t('account.form.field.creation-date')}
      description={t('account.form.field.creation-date-desc')}
    >
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
    </AccountFormField>
    <AccountFormField
      label={t('account.form.field.currency')}
      description={t('account.form.field.currency-desc')}
    >
      <DropdownSelect
        value={editAccount.currency}
        onChange={(currencyValue) => {
          const currency = parseCuratedCurrencyCode(currencyValue);
          setEditAccount((current) => ({ ...current, currency }));
        }}
        ariaLabel={t('account.form.field.currency')}
        disabled={isSaving}
        options={Object.values(CURRENCY_CONFIGS).map((config) => ({
          value: config.code,
          label: `${config.symbol} ${config.code} - ${config.name}`,
        }))}
      />
    </AccountFormField>
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
            {t('account.form.field.drawdown-type')}
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
        <div className="setting-item two-column">
          <AccountFormField
            label={t('account.form.field.drawdown-amount')}
            description={t('account.form.field.drawdown-amount-desc')}
          >
            <DraftInput
              aria-label={t('account.form.field.drawdown-amount')}
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
              min="0"
              step="100"
              placeholder="0"
              disabled={isSaving}
            />
          </AccountFormField>
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
          <Button
            onClick={() => setShowSnapshotManager(!showSnapshotManager)}
            className="journalit-manage-snapshots-button"
          >
            {showSnapshotManager
              ? t('account.edit.button.hide-snapshots', {
                  count: String(manualSnapshots.length),
                })
              : t('account.edit.button.show-snapshots', {
                  count: String(manualSnapshots.length),
                })}
          </Button>
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

interface EditAccountFieldProps {
  editAccount: EditAccountFormState;
  setEditAccount: EditAccountSetter;
  isSaving: boolean;
}

const MonthlyCostField: React.FC<EditAccountFieldProps> = ({
  editAccount,
  setEditAccount,
  isSaving,
}) => (
  <div className="setting-item two-column">
    <AccountFormField
      label={t('account.form.field.monthly-cost')}
      description={t('account.form.field.monthly-cost-desc')}
    >
      <DraftInput
        aria-label={t('account.form.field.monthly-cost')}
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
    </AccountFormField>
  </div>
);

const ProfitTargetSection: React.FC<EditAccountFieldProps> = ({
  editAccount,
  setEditAccount,
  isSaving,
}) => (
  <div className="setting-item journalit-setting-item--full-width journalit-profit-target-section">
    <div className="journalit-checkbox-setting-row journalit-feature-toggle-row">
      <Checkbox
        checked={editAccount.hasProfitTarget}
        onChange={(checked) =>
          setEditAccount((currentAccount) => ({
            ...currentAccount,
            hasProfitTarget: checked,
          }))
        }
        ariaLabel={t('account.profit-target.title')}
        disabled={isSaving}
      />
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('account.profit-target.title')}
        </div>
      </div>
    </div>

    {editAccount.hasProfitTarget && (
      <div className="journalit-profit-target-fields two-column">
        <AccountFormField
          label={t('account.form.field.target-type')}
          description={t('account.form.field.target-type-desc')}
          labelFor="group"
        >
          {(labelId) => (
            <ProfitTargetTypeControl
              labelId={labelId}
              value={editAccount.profitTargetType}
              disabled={isSaving}
              onChange={(profitTargetType) =>
                setEditAccount((currentAccount) => ({
                  ...currentAccount,
                  profitTargetType,
                }))
              }
            />
          )}
        </AccountFormField>
        <AccountFormField
          label={
            editAccount.profitTargetType === ProfitTargetType.PERCENTAGE
              ? t('account.form.field.target-percent')
              : t('account.form.field.target-dollar')
          }
          description={
            editAccount.profitTargetType === ProfitTargetType.PERCENTAGE
              ? t('account.form.field.target-percent-desc')
              : t('account.form.field.target-dollar-desc')
          }
        >
          <DraftInput
            type="number"
            value={
              editAccount.profitTarget === 0 ? '' : editAccount.profitTarget
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              
              
              if (e.target.value === '') return;
              const profitTarget = parseFloat(e.target.value) || 0;
              setEditAccount((currentAccount) => ({
                ...currentAccount,
                profitTarget,
              }));
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
                ? t('account.form.field.target-percent')
                : t('account.form.field.target-dollar')
            }
            disabled={isSaving}
          />
        </AccountFormField>
        {profitTargetNeedsBalance(editAccount) && (
          <div className="error-message-inline journalit-profit-target-hint">
            {t('account.create.error.profit-target-needs-balance')}
          </div>
        )}
        <AccountFormField
          label={t('account.form.field.target-date')}
          description={t('account.form.field.target-date-desc')}
          optional
        >
          <FastDateTimeInput
            className="journalit-account-date-input"
            value={
              editAccount.profitTargetDate
                ? new Date(editAccount.profitTargetDate)
                : undefined
            }
            onChange={(value) => {
              const profitTargetDate = value instanceof Date ? value : null;
              setEditAccount((currentAccount) => ({
                ...currentAccount,
                profitTargetDate,
              }));
            }}
            disabled={isSaving}
          />
        </AccountFormField>
      </div>
    )}
  </div>
);

interface CopyTradingSectionProps {
  account: AccountData;
  plugin: JournalitPlugin;
  editAccount: EditAccountFormState;
  setEditAccount: EditAccountSetter;
  isSaving: boolean;
}

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
            <AccountFormField
              label={t('account.copy-trading.base-account')}
              description={t('account.copy-trading.base-account-desc')}
            >
              <DropdownSelect
                value={editAccount.copyTradingBaseAccount}
                onChange={(copyTradingBaseAccount) =>
                  setEditAccount((currentAccount) => ({
                    ...currentAccount,
                    copyTradingBaseAccount,
                  }))
                }
                ariaLabel={t('account.copy-trading.base-account')}
                placeholder={t('account.copy-trading.base-account-placeholder')}
                disabled={isSaving}
                options={baseAccountOptions.map((accountName) => ({
                  value: accountName,
                  label: accountName,
                }))}
              />
            </AccountFormField>
            <AccountFormField
              label={t('account.copy-trading.multiplier')}
              description={t('account.copy-trading.multiplier-desc')}
            >
              <DraftInput
                aria-label={t('account.copy-trading.multiplier')}
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={editAccount.copyTradingMultiplier}
                onChange={(e) => {
                  
                  
                  const multiplier = Number(e.target.value);
                  if (e.target.value === '' || !Number.isFinite(multiplier)) {
                    return;
                  }
                  setEditAccount((currentAccount) => ({
                    ...currentAccount,
                    copyTradingMultiplier: multiplier,
                  }));
                }}
                disabled={isSaving}
              />
            </AccountFormField>
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
                <AccountFormField label={t('account.copy-trading.start-date')}>
                  <FastDateTimeInput
                    className="journalit-account-date-input"
                    ariaLabel={t('account.copy-trading.start-date')}
                    value={editAccount.copyTradingStartDate ?? undefined}
                    onChange={(value) => {
                      const copyTradingStartDate =
                        value instanceof Date ? startOfDay(value) : null;
                      setEditAccount((currentAccount) => ({
                        ...currentAccount,
                        copyTradingStartDate,
                      }));
                    }}
                    disabled={isSaving}
                  />
                </AccountFormField>
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
  trades,
  onSave,
  onModalClose,
}: Omit<EditAccountModalProps, 'onClose'> & { onModalClose: () => void }) => {
  const dateDraftGate = useDateDraftGate();
  const [isSaving, setIsSaving] = useState(false);
  const [customAccountTypes, setCustomAccountTypes] = useState<string[]>([]);
  const [showSnapshotManager, setShowSnapshotManager] = useState(false);
  const initialCopyTradingPeriods = account.copyTradingPeriods ?? [];
  const initialActiveCopyPeriod = initialCopyTradingPeriods.find(
    (period) => !period.endDate
  );

  
  
  const [initialForm] = useState<EditAccountFormState>(() => ({
    name: account.name,
    accountType: resolveAvailableAccountType(
      account.accountType,
      plugin.optionsService?.getOptions(OptionType.ACCOUNT_TYPE) ?? []
    ),
    initialBalance: account.initialBalance,
    liveBalance: getAccountLiveBalanceInput(
      account,
      trades,
      plugin.settings.trade?.tradingDayCutoffTime
    ),
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
    propChallenge: account.propChallenge,
  }));
  const [editAccount, setEditAccount] =
    useState<EditAccountFormState>(initialForm);
  const [manualSnapshots, setManualSnapshots] = useState<
    ManualDrawdownSnapshot[]
  >([]);
  const [snapshotsEdited, setSnapshotsEdited] = useState(false);
  const editManualSnapshots = useCallback(
    (snapshots: ManualDrawdownSnapshot[]) => {
      setManualSnapshots(snapshots);
      setSnapshotsEdited(true);
    },
    []
  );
  const hasUnsavedEdits = () =>
    snapshotsEdited ||
    JSON.stringify(editAccount) !== JSON.stringify(initialForm);

  
  
  const refreshAccountTypes = useCallback(() => {
    const optionsService = plugin.optionsService;
    if (!optionsService) return;

    const types = optionsService.getOptions(OptionType.ACCOUNT_TYPE);
    setCustomAccountTypes(types);

    if (types.length === 0) return;

    
    setEditAccount((prev) => {
      const accountType = resolveAvailableAccountType(prev.accountType, types);
      return accountType === prev.accountType ? prev : { ...prev, accountType };
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

  const buildCopyTradingPeriods = (): CopyTradingPeriod[] =>
    nextCopyTradingPeriods(
      editAccount.copyTradingPeriods,
      editAccount.copyTradingEnabled
        ? {
            enabled: true,
            baseAccount: editAccount.copyTradingBaseAccount,
            multiplier: editAccount.copyTradingMultiplier,
            startDate:
              editAccount.copyTradingStartMode === 'all'
                ? null
                : (editAccount.copyTradingStartDate ?? new Date()),
          }
        : { enabled: false }
    );

  const handleSave = async () => {
    if (!dateDraftGate.confirm()) return;
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
      }

      if (trimmedName !== editAccount.name) {
        setEditAccount((prev) => ({ ...prev, name: trimmedName }));
      }

      const definitionIssue = accountDefinitionIssue({
        initialBalance: editAccount.initialBalance,
        drawdownType: editAccount.drawdownType,
        drawdownAmount: editAccount.drawdownAmount,
        hasProfitTarget: editAccount.hasProfitTarget,
        profitTarget: editAccount.profitTarget,
        profitTargetType: editAccount.profitTargetType,
        monthlyCost: editAccount.monthlyCost,
        createdDate: editAccount.createdDate,
        propChallenge: editAccount.propChallenge,
      });
      const validatedCreatedDate = editAccount.createdDate;
      if (definitionIssue || !validatedCreatedDate) {
        new Notice(
          EDIT_DEFINITION_ISSUE_MESSAGES[definitionIssue ?? 'invalid-date']()
        );
        return;
      }

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
      let effectivePropChallenge =
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
        (account.lifetimeBalance ?? account.currentBalance) -
        (account.liveBalanceAdjustment ?? 0);
      const nextComputedCurrentBalance =
        baseCurrentBalanceWithoutAdjustment +
        (effectiveInitialBalance - account.initialBalance);
      const liveBalanceUntouched =
        parsedLiveBalance === parseLiveBalanceInput(initialForm.liveBalance);
      const liveBalanceAdjustment = effectivePropChallenge
        ? undefined
        : account.propChallenge && liveBalanceUntouched
          ? toLiveBalanceAdjustment(
              account.currentBalance,
              nextComputedCurrentBalance
            )
          : toLiveBalanceAdjustment(
              parsedLiveBalance,
              nextComputedCurrentBalance
            );

      const originalPhase =
        account.propChallenge &&
        getCurrentPropChallengePhase(account.propChallenge);
      const current =
        effectivePropChallenge &&
        getCurrentPropChallengePhase(effectivePropChallenge);
      const baselineChanged =
        parsedLiveBalance !== null &&
        originalPhase &&
        current &&
        originalPhase.id === current.id &&
        originalPhase.startingBalance !== current.startingBalance;
      
      if (
        effectivePropChallenge &&
        (!liveBalanceUntouched || baselineChanged)
      ) {
        const fresh = await plugin.accountPageService.getAccountPageData(
          account.name
        );
        if (!fresh) {
          new Notice(t('account.edit.error.service-unavailable'));
          return;
        }
        if (
          !current ||
          (!liveBalanceUntouched && originalPhase?.id !== current.id)
        )
          throw new AccountMetadataConflictError();
        const input = {
          trades: fresh.trades,
          transactions: fresh.account.transactions,
          now: new Date(),
          tradingDayCutoffTime: plugin.settings.trade?.tradingDayCutoffTime,
        };
        const target =
          liveBalanceUntouched && originalPhase && account.propChallenge
            ? evaluatePropChallengePhase({
                ...input,
                phase: originalPhase,
                config: account.propChallenge,
              }).currentBalance
            : parsedLiveBalance;
        const reconciled = applyLiveBalanceToCurrentPhase(
          effectivePropChallenge,
          input,
          target
        );
        if (
          reconciled.introducesFailure &&
          !(await showConfirmationModal(app, {
            title: t('common.warning'),
            message: t('account.prop-challenge.confirm.fail', {
              account: accountName,
              challenge: effectivePropChallenge.challengeName,
              phase: current.name,
            }),
            confirmLabel: t('account.edit.button.save'),
            cancelLabel: t('button.cancel'),
          }))
        )
          return;
        effectivePropChallenge = reconciled.config;
      }

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
            metadataUpdates,
            account.propChallenge
              ? {
                  expectedPropChallenge: account.propChallenge,
                  reconciledUnscopedBalance:
                    Boolean(effectivePropChallenge) &&
                    !liveBalanceUntouched &&
                    parsedLiveBalance !== null,
                }
              : undefined
          );
        } else {
          await plugin.accountPageService.updateAccountMetadata(
            accountName,
            metadataUpdates,
            account.propChallenge
              ? {
                  expectedPropChallenge: account.propChallenge,
                  reconciledUnscopedBalance:
                    Boolean(effectivePropChallenge) &&
                    !liveBalanceUntouched &&
                    parsedLiveBalance !== null,
                }
              : undefined
          );
        }
      }

      
      if (shouldUpdateNotes && account.name !== accountName) {
        if (plugin.optionsService) {
          await rewriteAccountReferenceNotes(
            plugin.optionsService,
            account.name,
            accountName
          );
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
    accountName: string,
    serverAccountsLookup: Promise<ServerImportAccount[]>
  ): Promise<{
    proceed: boolean;
    deleteAssociatedTrades: boolean;
    serverAccountIds: string[];
  }> => {
    let deleteAssociatedTrades = false;
    let deleteServerTrades = false;
    let serverAccounts: ServerImportAccount[] = [];
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

        
        
        
        
        const serverDeleteSlot = container.createDiv();
        let closed = false;
        void serverAccountsLookup.then((accounts) => {
          if (closed || accounts.length === 0) return;
          serverAccounts = accounts;
          const serverDeleteOption = serverDeleteSlot.createDiv({
            cls: 'journalit-confirmation-content__checkbox',
          });
          const serverDeleteCheckbox = serverDeleteOption.createEl('input', {
            type: 'checkbox',
          });
          serverDeleteCheckbox.addEventListener('change', () => {
            deleteServerTrades = serverDeleteCheckbox.checked;
          });
          serverDeleteOption.createEl('label', {
            text: t('account.edit.modal.delete.delete-server-trades', {
              count: String(
                accounts.reduce(
                  (total, serverAccount) => total + serverAccount.tradeCount,
                  0
                )
              ),
            }),
          });
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
        return () => {
          closed = true;
        };
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
        ? {
            proceed: true,
            deleteAssociatedTrades,
            serverAccountIds: deleteServerTrades
              ? serverAccounts.map((serverAccount) => serverAccount.accountId)
              : [],
          }
        : {
            proceed: false,
            deleteAssociatedTrades: false,
            serverAccountIds: [],
          }
    );
  };

  const handleDeleteAccount = async () => {
    try {
      setIsSaving(true);

      
      const deleteChoice = await showDeleteAccountConfirmation(
        account.name,
        findServerImportAccountsForLocalAccount(plugin, {
          id: account.id || account.name,
          name: account.name,
        })
      );

      if (!deleteChoice.proceed) {
        return; 
      }

      
      
      if (
        deleteChoice.serverAccountIds.length > 0 &&
        !(await deleteTradeImportAccountsFromServer(
          plugin,
          deleteChoice.serverAccountIds
        ))
      ) {
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
    hasUnsavedEdits,
    manualSnapshots,
    setManualSnapshots: editManualSnapshots,
    handleSave,
    handleDeleteAccount,
    dateDraftGate,
  };
};

const EditAccountModalTree: React.FC<
  EditAccountModalProps & AccountFormCloseProps
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

export const EditAccountModalContent: React.FC<
  EditAccountModalProps & AccountFormCloseProps
> = ({
  app,
  plugin,
  account,
  trades,
  onSave,
  onModalClose,
  onRequestClose,
  closeHandle,
}) => {
  const {
    isSaving,
    customAccountTypes,
    showSnapshotManager,
    setShowSnapshotManager,
    editAccount,
    setEditAccount,
    hasUnsavedEdits,
    manualSnapshots,
    setManualSnapshots,
    handleSave,
    handleDeleteAccount,
    dateDraftGate,
  } = useEditAccountModalController({
    app,
    plugin,
    account,
    trades,
    onSave,
    onModalClose,
  });

  
  useImperativeHandle(closeHandle, () => ({
    
    closeState: () =>
      isSaving
        ? 'saving'
        : hasUnsavedEdits() || dateDraftGate.hasPendingDrafts()
          ? 'unsaved'
          : 'clean',
  }));

  
  const discardedChallengeRef = useRef<PropChallengeConfig | undefined>(
    undefined
  );

  
  
  
  
  const openChallengeSetup = async () => {
    if (
      hasUnsavedEdits() &&
      !(await showConfirmationModal(app, {
        title: t('account.edit.convert.discard-title'),
        message: t('account.edit.convert.discard-message'),
        confirmLabel: t('account.edit.convert.discard-confirm'),
        cancelLabel: t('button.cancel'),
        destructive: true,
      }))
    ) {
      return;
    }
    onModalClose();
    const outcome = await openAccountMergeModal(app, plugin, {
      accounts: [account.name],
    });
    if (outcome !== 'cancelled') onSave();
  };

  const handlePropChallengeToggle = (enabled: boolean) => {
    const restorable =
      editAccount.propChallenge ?? discardedChallengeRef.current;
    if (enabled && !restorable) {
      void openChallengeSetup();
      return;
    }
    
    
    
    
    
    
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
        propChallenge: enabled ? restored : undefined,
      };
    });
  };

  return (
    <DateDraftGateContext.Provider value={dateDraftGate}>
      <div className="journalit-account-form">
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

            <MonthlyCostField
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
              monthlyCostField={
                <MonthlyCostField
                  editAccount={editAccount}
                  setEditAccount={setEditAccount}
                  isSaving={isSaving}
                />
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

        <div className="journalit-modal-actions journalit-account-form-actions">
          <Button
            variant="danger"
            onClick={() => void handleDeleteAccount()}
            disabled={isSaving}
            className="journalit-account-form-actions__delete"
          >
            {t('account.edit.button.delete')}
          </Button>
          <Button
            variant="plain"
            onClick={onRequestClose}
            disabled={isSaving}
            className="journalit-modal-actions__cancel"
          >
            {t('button.cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={() => void handleSave()}
            disabled={isSaving}
            className="journalit-modal-actions__primary"
          >
            {isSaving
              ? t('account.edit.button.saving')
              : t('account.edit.button.save')}
          </Button>
        </div>
      </div>
    </DateDraftGateContext.Provider>
  );
};


export function openEditAccountModal(
  app: App,
  plugin: JournalitPlugin,
  account: AccountData,
  trades: readonly AccountTradeData[],
  onSave: () => void
): void {
  const modal = new EditAccountModal({
    app,
    plugin,
    account,
    trades,
    onClose: () => {}, 
    onSave,
  });
  modal.open();
}
