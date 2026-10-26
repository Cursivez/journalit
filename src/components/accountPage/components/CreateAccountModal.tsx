

import { App, Notice } from 'obsidian';
import React, {
  useState,
  useEffect,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
} from 'react';
import { AlertTriangle, Info } from '../../shared/icons/ObsidianIcon';
import { createRoot, Root } from 'react-dom/client';
import JournalitPlugin from '../../../main';
import {
  AccountType,
  DrawdownType,
  ProfitTargetType,
} from '../../../services/account/types';
import {
  CurrencyCode,
  CURRENCY_CONFIGS,
  parseCuratedCurrencyCode,
} from '../../../utils/currencyConfig';
import { OptionType } from '../../../services/options/CustomOptionsService';
import { Button } from '../../ui/Button';
import { DraftInput } from '../../ui/DraftInput';
import Checkbox from '../../ui/Checkbox';
import { FastDateTimeInput } from '../../core/FastDateTimeInput';
import {
  DateDraftGateContext,
  useDateDraftGate,
} from '../../core/DateDraftGate';
import {
  isValidDate,
  parseLocalDateSafe,
  formatLocalDateString,
} from '../../../utils/dateUtils';
import { useEventBus } from '../../../hooks/useEventBus';
import { eventBus } from '../../../services/events/EventBus';
import { t } from '../../../lang/helpers';
import type { CopyTradingPeriod } from '../../../settings/types';
import type { PropChallengeConfig } from '../../../services/propChallenge/types';
import {
  createDefaultPropChallengeConfig,
  validatePhaseTimeline,
} from '../../../services/propChallenge/PropChallengeConfig';
import {
  accountDefinitionIssue,
  profitTargetNeedsBalance,
} from '../../../services/account/accountDefinitionRules';
import { resolveStageAccountType } from '../../../services/propChallenge/stageAccountTypes';
import { DisplayPolicyProvider } from '../../../contexts/DisplayPolicyContext';
import { SegmentedControl } from '../../shared/SegmentedControl';
import { ModalEscapeProvider } from '../../shared/disclosureEscape';
import { PropChallengeSettingsSection } from './propChallenge/PropChallengeSettingsSection';
import { markUntouchedChallengeConfig } from './propChallenge/untouchedChallengeConfigs';
import {
  getAvailableAccountTypes,
  resolveAvailableAccountType,
} from './propChallenge/propChallengeLifecycleActions';
import { DropdownSelect } from '../../shared/DropdownSelect';
import { Tooltip } from '../../shared/Tooltip';
import { PropChallengeToggleField } from './PropChallengeToggleField';
import { AccountFormField } from './AccountFormField';
import { ProfitTargetTypeControl } from './ProfitTargetTypeControl';
import {
  hasActiveCopyTradingPeriod,
  isValidCopyTradingMultiplier,
} from '../../../utils/accountCopyTrading';

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
import {
  parseLiveBalanceInput,
  toLiveBalanceAdjustment,
} from '../../../services/account/liveBalanceAdjustment';
import { formatAccountTypeLabel } from '../../../utils/accountTypeLabel';
import { suspendViewGuidesWhileOpen } from '../../../guides/suspendViewGuides';
import { applyLiveBalanceToCurrentPhase } from '../../../services/propChallenge/PropChallengeBalance';
import { getCurrentPropChallengePhase } from '../../../services/propChallenge/PropChallengeConfig';
import { showConfirmationModal } from '../../shared/ConfirmationModal';
import {
  AccountFormModal,
  type AccountFormCloseProps,
} from './AccountFormModal';

interface CreateAccountModalProps {
  app: App;
  plugin: JournalitPlugin;
  onClose: () => void;
  onSave: () => void;
  navigateOnSave?: boolean;
  
  initialName?: string;
  
  initialPropChallenge?: boolean;
}


class CreateAccountModal extends AccountFormModal {
  private props: CreateAccountModalProps;
  private container: HTMLDivElement;
  private root: Root | null = null;

  constructor(props: CreateAccountModalProps) {
    super(props.app);
    this.titleEl.setText(t('account.create.title'));
    this.props = props;
  }

  onOpen() {
    const { contentEl } = this;
    this.modalEl.addClass('journalit-account-form-modal');
    suspendViewGuidesWhileOpen(this.modalEl);
    contentEl.empty();

    

    
    this.container = contentEl.createDiv({
      cls: 'journalit-account-form-container',
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
      <ModalEscapeProvider app={this.app} scope={this.scope}>
        <CreateAccountModalContent
          {...this.props}
          onModalClose={this.closeWithoutConfirm}
          onRequestClose={() => this.close()}
          closeHandle={this.closeHandle}
          initialPropChallenge={this.props.initialPropChallenge}
        />
      </ModalEscapeProvider>
    );
  }
}

type CreateAccountFormState = {
  name: string;
  accountType: string;
  createdDate: string;
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
  copyTradingEnabled: boolean;
  copyTradingBaseAccount: string;
  copyTradingMultiplier: number;
  copyTradingStartMode: 'all' | 'date';
  copyTradingStartDate: Date | null;
  propChallenge?: PropChallengeConfig;
};

interface CreateAccountErrorMessageProps {
  message: string | null;
}

function CreateAccountErrorMessage({
  message,
}: CreateAccountErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="create-account-error">
      <AlertTriangle size={16} />
      <div className="create-account-error-content">
        <div className="create-account-error-title">{t('common.error')}</div>
        <div className="create-account-error-message">{message}</div>
      </div>
    </div>
  );
}

interface AccountIdentityFieldsProps {
  account: CreateAccountFormState;
  customAccountTypes: string[];
  isSaving: boolean;
  onChange: (account: CreateAccountFormState) => void;
}

function AccountIdentityFields({
  account,
  customAccountTypes,
  isSaving,
  onChange,
}: AccountIdentityFieldsProps) {
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  
  
  
  useEffect(() => {
    const input = nameInputRef.current;
    if (!input) return;

    input.focus();
    const caret = input.value.length;
    input.setSelectionRange(caret, caret);
  }, []);

  return (
    <div className="setting-item two-column">
      <AccountFormField label={t('account.form.field.name')} labelFor="input">
        {(controlId) => (
          <input
            id={controlId}
            ref={nameInputRef}
            type="text"
            value={account.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ ...account, name: e.target.value })
            }
            placeholder={t('account.form.placeholder.name')}
            disabled={isSaving}
          />
        )}
      </AccountFormField>
      <AccountFormField label={t('account.form.field.type')}>
        <DropdownSelect
          value={account.accountType}
          onChange={(accountType) =>
            onChange({
              ...account,
              accountType,
            })
          }
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
}

interface InitialBalanceDateFieldsProps {
  account: CreateAccountFormState;
  isSaving: boolean;
  isPropChallenge: boolean;
  onChange: (account: CreateAccountFormState) => void;
}

function InitialBalanceDateFields({
  account,
  isSaving,
  isPropChallenge,
  onChange,
}: InitialBalanceDateFieldsProps) {
  return (
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
            value={account.initialBalance === 0 ? '' : account.initialBalance}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({
                ...account,
                initialBalance:
                  e.target.value === '' ? 0 : parseFloat(e.target.value) || 0,
              })
            }
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
          value={
            account.createdDate
              ? new Date(account.createdDate + 'T00:00:00')
              : undefined
          }
          onChange={(value) => {
            if (value instanceof Date) {
              const year = value.getFullYear();
              const month = String(value.getMonth() + 1).padStart(2, '0');
              const day = String(value.getDate()).padStart(2, '0');
              onChange({
                ...account,
                createdDate: `${year}-${month}-${day}`,
              });
            } else {
              onChange({ ...account, createdDate: '' });
            }
          }}
          disabled={isSaving}
        />
      </AccountFormField>
    </div>
  );
}

interface LiveBalanceCurrencyFieldsProps {
  account: CreateAccountFormState;
  isSaving: boolean;
  onChange: (account: CreateAccountFormState) => void;
}

function LiveBalanceCurrencyFields({
  account,
  isSaving,
  onChange,
}: LiveBalanceCurrencyFieldsProps) {
  return (
    <div className="setting-item two-column journalit-setting-item--balance-row">
      <AccountFormField
        label={t('account.form.field.live-balance')}
        description={t('account.form.field.live-balance-desc')}
        optional
      >
        <input
          aria-label={t('account.form.field.live-balance')}
          type="number"
          value={account.liveBalance}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...account, liveBalance: e.target.value })
          }
          step="100"
          placeholder={String(account.initialBalance || 0)}
          disabled={isSaving}
        />
      </AccountFormField>
      <AccountFormField
        label={t('account.form.field.currency')}
        description={t('account.form.field.currency-desc')}
      >
        <DropdownSelect
          value={account.currency}
          onChange={(currency) =>
            onChange({
              ...account,
              currency: parseCuratedCurrencyCode(currency),
            })
          }
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
}

function PropChallengeAccountBasics({
  account,
  isSaving,
  onChange,
}: LiveBalanceCurrencyFieldsProps) {
  return (
    <div className="setting-item two-column journalit-prop-challenge-account-basics">
      <AccountFormField
        label={t('account.form.field.live-balance')}
        description={t('account.form.field.live-balance-desc')}
        optional
      >
        <input
          type="number"
          value={account.liveBalance}
          onChange={(event) =>
            onChange({ ...account, liveBalance: event.target.value })
          }
          step="100"
          placeholder="0"
          aria-label={t('account.form.field.live-balance')}
          disabled={isSaving}
        />
      </AccountFormField>
      <AccountFormField
        label={t('account.form.field.creation-date')}
        description={t('account.form.field.creation-date-desc')}
      >
        <FastDateTimeInput
          className="journalit-account-date-input"
          value={
            account.createdDate
              ? new Date(account.createdDate + 'T00:00:00')
              : undefined
          }
          onChange={(value) => {
            if (value instanceof Date) {
              onChange({
                ...account,
                createdDate: [
                  value.getFullYear(),
                  String(value.getMonth() + 1).padStart(2, '0'),
                  String(value.getDate()).padStart(2, '0'),
                ].join('-'),
              });
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
          value={account.currency}
          onChange={(currency) =>
            onChange({
              ...account,
              currency: parseCuratedCurrencyCode(currency),
            })
          }
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
}

interface DrawdownFieldsProps {
  account: CreateAccountFormState;
  isSaving: boolean;
  onChange: (account: CreateAccountFormState) => void;
}

function DrawdownFields({ account, isSaving, onChange }: DrawdownFieldsProps) {
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
          value={account.drawdownType}
          groupRole="radiogroup"
          ariaLabelledBy={drawdownTypeLabelId}
          fullWidth
          disabled={isSaving}
          onChange={(next) =>
            onChange({
              ...account,
              drawdownType: next,
              drawdownAmount:
                next === DrawdownType.NONE ? 0 : account.drawdownAmount,
            })
          }
        />
      </div>

      {account.drawdownType !== DrawdownType.NONE && (
        <div className="setting-item two-column">
          <AccountFormField
            label={t('account.form.field.drawdown-amount')}
            description={t('account.form.field.drawdown-amount-desc')}
          >
            <DraftInput
              aria-label={t('account.form.field.drawdown-amount')}
              type="number"
              value={account.drawdownAmount === 0 ? '' : account.drawdownAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({
                  ...account,
                  drawdownAmount:
                    e.target.value === '' ? 0 : parseFloat(e.target.value) || 0,
                })
              }
              min="0"
              step="100"
              placeholder="0"
              disabled={isSaving}
            />
          </AccountFormField>
        </div>
      )}
    </>
  );
}

interface AccountFieldProps {
  account: CreateAccountFormState;
  isSaving: boolean;
  onChange: (account: CreateAccountFormState) => void;
}

function MonthlyCostField({ account, isSaving, onChange }: AccountFieldProps) {
  return (
    <div className="setting-item two-column">
      <AccountFormField
        label={t('account.form.field.monthly-cost')}
        description={t('account.form.field.monthly-cost-desc')}
      >
        <DraftInput
          aria-label={t('account.form.field.monthly-cost')}
          type="number"
          value={account.monthlyCost === 0 ? '' : account.monthlyCost}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({
              ...account,
              monthlyCost:
                e.target.value === '' ? 0 : parseFloat(e.target.value) || 0,
            })
          }
          min="0"
          step="1"
          placeholder="0"
          disabled={isSaving}
        />
      </AccountFormField>
    </div>
  );
}

interface ProfitTargetFieldsProps extends AccountFieldProps {
  profitTargetDateError: string | null;
  onProfitTargetDateErrorChange: (error: string | null) => void;
}

function ProfitTargetFields({
  account,
  isSaving,
  profitTargetDateError,
  onProfitTargetDateErrorChange,
  onChange,
}: ProfitTargetFieldsProps) {
  return (
    <div className="setting-item journalit-setting-item--full-width journalit-profit-target-section">
      <div className="journalit-checkbox-setting-row journalit-feature-toggle-row">
        <Checkbox
          checked={account.hasProfitTarget}
          onChange={(checked) => {
            onChange({ ...account, hasProfitTarget: checked });
            if (!checked) {
              onProfitTargetDateErrorChange(null);
            }
          }}
          ariaLabel={t('account.profit-target.title')}
          disabled={isSaving}
        />
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('account.profit-target.title')}
          </div>
        </div>
      </div>

      {account.hasProfitTarget && (
        <div className="journalit-profit-target-fields two-column">
          <AccountFormField
            label={t('account.form.field.target-type')}
            description={t('account.form.field.target-type-desc')}
            labelFor="group"
          >
            {(labelId) => (
              <ProfitTargetTypeControl
                labelId={labelId}
                value={account.profitTargetType}
                disabled={isSaving}
                onChange={(profitTargetType) =>
                  onChange({ ...account, profitTargetType })
                }
              />
            )}
          </AccountFormField>
          <AccountFormField
            label={
              account.profitTargetType === ProfitTargetType.PERCENTAGE
                ? t('account.form.field.target-percent')
                : t('account.form.field.target-dollar')
            }
            description={
              account.profitTargetType === ProfitTargetType.PERCENTAGE
                ? t('account.form.field.target-percent-desc')
                : t('account.form.field.target-dollar-desc')
            }
          >
            <DraftInput
              aria-label={
                account.profitTargetType === ProfitTargetType.PERCENTAGE
                  ? t('account.form.field.target-percent')
                  : t('account.form.field.target-dollar')
              }
              type="number"
              value={account.profitTarget === 0 ? '' : account.profitTarget}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({
                  ...account,
                  profitTarget:
                    e.target.value === '' ? 0 : parseFloat(e.target.value) || 0,
                })
              }
              min="0"
              step={
                account.profitTargetType === ProfitTargetType.PERCENTAGE
                  ? '1'
                  : '100'
              }
              placeholder="0"
              disabled={isSaving}
            />
          </AccountFormField>
          {profitTargetNeedsBalance(account) && (
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
              value={account.profitTargetDate || undefined}
              onChange={(value) => {
                if (value instanceof Date) {
                  onChange({ ...account, profitTargetDate: value });
                } else {
                  onChange({ ...account, profitTargetDate: null });
                }
              }}
              disabled={isSaving}
            />
            {profitTargetDateError && (
              <div className="error-message-inline">
                {profitTargetDateError}
              </div>
            )}
          </AccountFormField>
        </div>
      )}
    </div>
  );
}

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

interface CopyTradingFieldsProps {
  account: CreateAccountFormState;
  plugin: JournalitPlugin;
  isSaving: boolean;
  onChange: (account: CreateAccountFormState) => void;
}

const CopyTradingMultiplierInput: React.FC<{
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}> = ({ value, disabled, onChange }) => {
  const [draft, setDraft] = useState(() => String(value));

  return (
    <input
      aria-label={t('account.copy-trading.multiplier')}
      type="number"
      min="0.1"
      max="100"
      step="0.1"
      value={draft}
      onChange={(event) => {
        const nextDraft = event.currentTarget.value;
        setDraft(nextDraft);
        const multiplier = Number(nextDraft);
        if (nextDraft !== '' && Number.isFinite(multiplier)) {
          onChange(multiplier);
        }
      }}
      onBlur={() => {
        if (draft === '' || !Number.isFinite(Number(draft))) {
          setDraft(String(value));
        }
      }}
      disabled={disabled}
    />
  );
};

function CopyTradingFields({
  account,
  plugin,
  isSaving,
  onChange,
}: CopyTradingFieldsProps) {
  const accountMetadata = plugin.settings.account?.accountMetadata ?? {};
  const baseAccountOptions = Object.values(accountMetadata)
    .flatMap((metadata) =>
      !hasActiveCopyTradingPeriod(metadata) &&
      (metadata.currency || plugin.settings.general?.currency) ===
        account.currency
        ? [metadata.name]
        : []
    )
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="setting-item journalit-setting-item--full-width journalit-copy-trading-section">
      <div className="journalit-checkbox-setting-row journalit-feature-toggle-row">
        <Checkbox
          checked={account.copyTradingEnabled}
          onChange={(checked) =>
            onChange({
              ...account,
              copyTradingEnabled: checked,
              copyTradingBaseAccount:
                checked && !account.copyTradingBaseAccount
                  ? (baseAccountOptions[0] ?? '')
                  : account.copyTradingBaseAccount,
            })
          }
          ariaLabel={t('account.copy-trading.enable')}
          disabled={isSaving}
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

      {account.copyTradingEnabled && (
        <>
          <div className="journalit-copy-trading-fields two-column">
            <AccountFormField
              label={t('account.copy-trading.base-account')}
              description={t('account.copy-trading.base-account-desc')}
            >
              <DropdownSelect
                value={account.copyTradingBaseAccount}
                onChange={(copyTradingBaseAccount) =>
                  onChange({
                    ...account,
                    copyTradingBaseAccount,
                  })
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
              <CopyTradingMultiplierInput
                value={account.copyTradingMultiplier}
                onChange={(multiplier) => {
                  onChange({
                    ...account,
                    copyTradingMultiplier: multiplier,
                  });
                }}
                disabled={isSaving}
              />
            </AccountFormField>
          </div>

          <div className="setting-item two-column journalit-copy-trading-start-row">
            <div className="column">
              <div className="journalit-checkbox-setting-row">
                <Checkbox
                  checked={account.copyTradingStartMode === 'all'}
                  onChange={(checked) =>
                    onChange({
                      ...account,
                      copyTradingStartMode: checked ? 'all' : 'date',
                    })
                  }
                  ariaLabel={t('account.copy-trading.all-history')}
                  disabled={isSaving}
                />
                <div className="setting-item-name journalit-checkbox-setting-label">
                  {t('account.copy-trading.all-history')}
                </div>
              </div>
            </div>
            {account.copyTradingStartMode === 'date' && (
              <AccountFormField label={t('account.copy-trading.start-date')}>
                <FastDateTimeInput
                  className="journalit-account-date-input"
                  ariaLabel={t('account.copy-trading.start-date')}
                  value={account.copyTradingStartDate ?? undefined}
                  onChange={(value) =>
                    onChange({
                      ...account,
                      copyTradingStartDate:
                        value instanceof Date ? startOfDay(value) : null,
                    })
                  }
                  disabled={isSaving}
                />
              </AccountFormField>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface CreateAccountModalModelProps {
  plugin: JournalitPlugin;
  onSave: () => void;
  onModalClose: () => void;
  navigateOnSave?: boolean;
  initialName?: string;
  initialPropChallenge?: boolean;
}


function suggestAccountName(
  takenNames: Iterable<string>,
  challenge: PropChallengeConfig
): string | undefined {
  const base = [challenge.firmName, challenge.challengeName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ');
  if (!base) return undefined;
  const taken = new Set(
    Array.from(takenNames, (name) => name.trim().toLowerCase())
  );
  let candidate = base;
  for (let number = 2; taken.has(candidate.toLowerCase()); number += 1) {
    candidate = `${base} ${number}`;
  }
  return candidate;
}


function defaultPropChallengeState(plugin: JournalitPlugin): {
  propChallenge: PropChallengeConfig;
  accountType?: string;
} {
  
  const propChallenge = markUntouchedChallengeConfig(
    createDefaultPropChallengeConfig({
      phaseNames: [
        t('account.prop-challenge.default-phase-name', { number: '1' }),
        t('account.prop-challenge.default-phase-name', { number: '2' }),
        t('account.form.type.funded'),
      ],
    })
  );
  const accountType = resolveStageAccountType(
    plugin.settings.account?.challengeStageAccountTypes,
    propChallenge.phases[0]?.stage,
    getAvailableAccountTypes(plugin)
  );
  return accountType ? { propChallenge, accountType } : { propChallenge };
}

function useCreateAccountModalModel({
  plugin,
  onSave,
  onModalClose,
  navigateOnSave = true,
  initialName,
  initialPropChallenge,
}: CreateAccountModalModelProps) {
  const dateDraftGate = useDateDraftGate();
  const [isSaving, setIsSaving] = useState(false);
  const [customAccountTypes, setCustomAccountTypes] = useState<string[]>([]);
  const [profitTargetDateError, setProfitTargetDateError] = useState<
    string | null
  >(null);
  const [formError, setFormError] = useState<string | null>(null);

  
  
  const [initialForm] = useState<CreateAccountFormState>(() => {
    const challenge = initialPropChallenge
      ? defaultPropChallengeState(plugin)
      : undefined;
    return {
      name: initialName ?? '',
      accountType: resolveAvailableAccountType(
        challenge?.accountType ?? AccountType.DEMO,
        plugin.optionsService?.getOptions(OptionType.ACCOUNT_TYPE) ?? []
      ),
      createdDate: formatLocalDateString(new Date()), 
      initialBalance: 0,
      liveBalance: '',
      currency: plugin.settings?.general?.currency || CurrencyCode.USD,
      drawdownType: DrawdownType.NONE,
      drawdownAmount: 0,
      hasProfitTarget: false,
      profitTarget: 0,
      profitTargetType: ProfitTargetType.ABSOLUTE,
      profitTargetDate: null,
      monthlyCost: 0,
      copyTradingEnabled: false,
      copyTradingBaseAccount: '',
      copyTradingMultiplier: 1,
      copyTradingStartMode: 'date',
      copyTradingStartDate: null,
      propChallenge: challenge?.propChallenge,
    };
  });
  const [newAccount, setNewAccount] =
    useState<CreateAccountFormState>(initialForm);
  const hasUnsavedChanges = () =>
    JSON.stringify(newAccount) !== JSON.stringify(initialForm);

  
  
  const refreshAccountTypes = useCallback(() => {
    const optionsService = plugin.optionsService;
    if (!optionsService) return;

    const types = optionsService.getOptions(OptionType.ACCOUNT_TYPE);
    setCustomAccountTypes(types);

    if (types.length === 0) return;

    
    setNewAccount((prev) => {
      const accountType = resolveAvailableAccountType(prev.accountType, types);
      return accountType === prev.accountType ? prev : { ...prev, accountType };
    });
  }, [plugin.optionsService]);

  
  useEffect(() => {
    refreshAccountTypes();
  }, [refreshAccountTypes]);

  
  useEventBus('options:changed', refreshAccountTypes);

  
  const checkAccountNameExists = async (
    accountName: string
  ): Promise<boolean> => {
    if (!plugin.accountPageService) {
      return false;
    }

    try {
      const existingAccounts =
        await plugin.accountPageService.getAccountCatalog();

      
      return existingAccounts.some(
        (account) =>
          account.name.toLowerCase().trim() === accountName.toLowerCase().trim()
      );
    } catch (error) {
      console.error('Error checking account name uniqueness:', error);
      return false; 
    }
  };

  const handleCreate = async () => {
    if (!dateDraftGate.confirm()) return;
    try {
      setIsSaving(true);
      setFormError(null);

      
      if (!newAccount.name || !newAccount.name.trim()) {
        setFormError(t('account.create.error.name-required'));
        return;
      }

      const trimmedName = newAccount.name.trim();

      
      const nameExists = await checkAccountNameExists(trimmedName);
      if (nameExists) {
        setFormError(
          t('account.create.error.name-exists', { name: trimmedName })
        );
        return;
      }

      
      const createdDate = parseLocalDateSafe(newAccount.createdDate);
      const definitionIssue = accountDefinitionIssue({
        initialBalance: newAccount.initialBalance,
        drawdownType: newAccount.drawdownType,
        drawdownAmount: newAccount.drawdownAmount,
        hasProfitTarget: newAccount.hasProfitTarget,
        profitTarget: newAccount.profitTarget,
        profitTargetType: newAccount.profitTargetType,
        monthlyCost: newAccount.monthlyCost,
        createdDate,
        propChallenge: newAccount.propChallenge,
      });
      if (definitionIssue || !createdDate) {
        setFormError(
          t(`account.create.error.${definitionIssue ?? 'invalid-date'}`)
        );
        return;
      }

      if (newAccount.propChallenge) {
        const timelineError = validatePhaseTimeline(newAccount.propChallenge);
        if (timelineError) {
          setFormError(timelineError);
          return;
        }
      }

      
      if (!plugin.accountPageService) {
        setFormError(t('account.create.error.service-unavailable'));
        return;
      }

      
      createdDate.setHours(0, 0, 0, 0);

      
      if (newAccount.hasProfitTarget && profitTargetDateError) {
        setFormError(t('account.create.error.fix-target-date'));
        return;
      }

      if (
        newAccount.hasProfitTarget &&
        newAccount.profitTargetDate &&
        !isValidDate(newAccount.profitTargetDate)
      ) {
        setFormError(t('account.create.error.invalid-target-date'));
        return;
      }

      const parsedLiveBalance = parseLiveBalanceInput(newAccount.liveBalance);
      if (parsedLiveBalance === undefined) {
        setFormError(t('account.create.error.invalid-live-balance'));
        return;
      }

      let copyTradingPeriods: CopyTradingPeriod[] | undefined;
      if (newAccount.copyTradingEnabled) {
        if (!newAccount.copyTradingBaseAccount) {
          setFormError(t('account.copy-trading.error.base-required'));
          return;
        }
        if (!isValidCopyTradingMultiplier(newAccount.copyTradingMultiplier)) {
          setFormError(t('account.copy-trading.error.multiplier-range'));
          return;
        }
        const copyTradingStartDate = newAccount.copyTradingStartDate;
        if (
          newAccount.copyTradingStartMode === 'date' &&
          !copyTradingStartDate
        ) {
          setFormError(t('account.copy-trading.error.start-date-required'));
          return;
        }

        let startDate: Date;
        if (newAccount.copyTradingStartMode === 'all') {
          startDate = new Date(1970, 0, 1);
        } else {
          if (!copyTradingStartDate) {
            setFormError(t('account.copy-trading.error.start-date-required'));
            return;
          }
          startDate = startOfDay(copyTradingStartDate);
        }

        copyTradingPeriods = [
          {
            baseAccount: newAccount.copyTradingBaseAccount,
            multiplier: newAccount.copyTradingMultiplier,
            startDate,
          },
        ];
      }

      
      const initialBalance =
        newAccount.propChallenge?.phases[0]?.startingBalance ??
        newAccount.initialBalance;
      let propChallenge = newAccount.propChallenge;
      const currentPhase =
        propChallenge && getCurrentPropChallengePhase(propChallenge);
      if (propChallenge && currentPhase && parsedLiveBalance !== null) {
        const input = {
          trades: [],
          transactions: [],
          now: new Date(currentPhase.startedAt ?? new Date().toISOString()),
          tradingDayCutoffTime: plugin.settings.trade?.tradingDayCutoffTime,
        };
        const reconciled = applyLiveBalanceToCurrentPhase(
          propChallenge,
          input,
          parsedLiveBalance
        );
        if (
          reconciled.introducesFailure &&
          !(await showConfirmationModal(plugin.app, {
            title: t('common.warning'),
            message: t('account.prop-challenge.confirm.fail', {
              account: trimmedName,
              challenge: propChallenge.challengeName,
              phase: currentPhase.name,
            }),
            confirmLabel: t('account.create.button.create'),
            cancelLabel: t('button.cancel'),
          }))
        )
          return;
        propChallenge = reconciled.config;
      }

      
      await plugin.accountPageService.updateAccountMetadata(trimmedName, {
        name: trimmedName,
        accountType: newAccount.accountType,
        createdDate,
        initialBalance,
        liveBalanceAdjustment: propChallenge
          ? undefined
          : toLiveBalanceAdjustment(parsedLiveBalance, initialBalance),
        currency: newAccount.currency,
        drawdownType: newAccount.drawdownType,
        drawdownAmount: newAccount.drawdownAmount,
        hasProfitTarget: newAccount.hasProfitTarget,
        profitTarget: newAccount.profitTarget,
        profitTargetType: newAccount.profitTargetType,
        profitTargetDate: newAccount.hasProfitTarget
          ? newAccount.profitTargetDate || undefined
          : undefined,
        monthlyCost: newAccount.monthlyCost,
        copyTradingPeriods,
        propChallenge,
        lastUpdated: new Date(),
      });

      setFormError(null);
      
      new Notice(t('account.create.success', { name: trimmedName }));

      
      eventBus.publish('account:changed', {
        action: 'created',
        accountId: trimmedName,
      });

      
      if (plugin.accountPageService) {
        await plugin.accountPageService.refreshAllAccountData();
      }

      
      onSave();

      
      onModalClose();

      
      if (navigateOnSave && plugin.viewManager) {
        
        window.setTimeout(() => {
          void plugin.viewManager.openAccountPageView(trimmedName);
        }, 150);
      }
    } catch (error) {
      console.error('Error creating account:', error);
      const message = t('account.create.error.failed', {
        error: error instanceof Error ? error.message : t('error.unexpected'),
      });
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    customAccountTypes,
    profitTargetDateError,
    formError,
    newAccount,
    setNewAccount,
    setProfitTargetDateError,
    handleCreate,
    hasUnsavedChanges,
    dateDraftGate,
  };
}



export const CreateAccountModalContent: React.FC<
  CreateAccountModalProps & AccountFormCloseProps
> = ({
  plugin,
  onSave,
  onModalClose,
  onRequestClose,
  closeHandle,
  navigateOnSave = true,
  initialName,
  initialPropChallenge,
}) => {
  const {
    isSaving,
    customAccountTypes,
    profitTargetDateError,
    formError,
    newAccount,
    setNewAccount,
    setProfitTargetDateError,
    handleCreate,
    hasUnsavedChanges,
    dateDraftGate,
  } = useCreateAccountModalModel({
    plugin,
    onSave,
    onModalClose,
    navigateOnSave,
    initialName,
    initialPropChallenge,
  });

  
  const suggestedNameRef = useRef('');
  
  
  const catalogNamesRef = useRef<string[]>([]);
  
  useImperativeHandle(closeHandle, () => ({
    
    closeState: () =>
      isSaving
        ? 'saving'
        : hasUnsavedChanges() || dateDraftGate.hasPendingDrafts()
          ? 'unsaved'
          : 'clean',
  }));
  useEffect(() => {
    const service = plugin.accountPageService;
    if (!service) return;
    let cancelled = false;
    service
      .getAccountCatalog()
      .then((catalog) => {
        if (!cancelled) {
          catalogNamesRef.current = catalog.map((account) => account.name);
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to load account names for suggestions:', error);
      });
    return () => {
      cancelled = true;
    };
  }, [plugin]);

  const handleChallengeChange = (propChallenge: PropChallengeConfig) => {
    const previousRef = newAccount.propChallenge?.profileRef;
    const nextRef = propChallenge.profileRef;
    const profileChanged =
      nextRef !== undefined &&
      (nextRef.firmId !== previousRef?.firmId ||
        nextRef.challengeId !== previousRef?.challengeId);
    const currentName = newAccount.name.trim();
    const suggestion =
      profileChanged &&
      (currentName === '' || currentName === suggestedNameRef.current)
        ? suggestAccountName(
            [
              ...Object.keys(plugin.settings.account?.accountMetadata ?? {}),
              ...catalogNamesRef.current,
            ],
            propChallenge
          )
        : undefined;
    
    
    const withdrawn =
      previousRef !== undefined &&
      nextRef === undefined &&
      currentName !== '' &&
      currentName === suggestedNameRef.current;
    if (suggestion) suggestedNameRef.current = suggestion;
    const name = suggestion ?? (withdrawn ? '' : undefined);
    setNewAccount((current) => ({
      ...current,
      propChallenge,
      ...(name !== undefined ? { name } : {}),
    }));
  };

  
  const detachedChallengeRef = useRef<PropChallengeConfig | undefined>(
    undefined
  );

  const handlePropChallengeToggle = (enabled: boolean) => {
    
    
    
    
    if (newAccount.propChallenge) {
      detachedChallengeRef.current = newAccount.propChallenge;
    }
    setNewAccount((current) => {
      if (!enabled) {
        return { ...current, propChallenge: undefined };
      }
      const restored = current.propChallenge ?? detachedChallengeRef.current;
      if (restored) {
        return { ...current, propChallenge: restored };
      }
      const challenge = defaultPropChallengeState(plugin);
      return {
        ...current,
        ...(challenge.accountType
          ? { accountType: challenge.accountType }
          : {}),
        propChallenge: challenge.propChallenge,
      };
    });
  };

  return (
    <DateDraftGateContext.Provider value={dateDraftGate}>
      <div className="journalit-account-form">
        <CreateAccountErrorMessage message={formError} />

        <AccountIdentityFields
          account={newAccount}
          customAccountTypes={customAccountTypes}
          isSaving={isSaving}
          onChange={setNewAccount}
        />

        
        <PropChallengeToggleField
          checked={Boolean(newAccount.propChallenge)}
          disabled={isSaving}
          onChange={handlePropChallengeToggle}
        />

        {newAccount.propChallenge ? (
          <PropChallengeAccountBasics
            account={newAccount}
            isSaving={isSaving}
            onChange={setNewAccount}
          />
        ) : (
          <>
            <InitialBalanceDateFields
              account={newAccount}
              isSaving={isSaving}
              isPropChallenge={false}
              onChange={setNewAccount}
            />

            <LiveBalanceCurrencyFields
              account={newAccount}
              isSaving={isSaving}
              onChange={setNewAccount}
            />

            <MonthlyCostField
              account={newAccount}
              isSaving={isSaving}
              onChange={setNewAccount}
            />

            <DrawdownFields
              account={newAccount}
              isSaving={isSaving}
              onChange={setNewAccount}
            />

            <ProfitTargetFields
              account={newAccount}
              isSaving={isSaving}
              profitTargetDateError={profitTargetDateError}
              onProfitTargetDateErrorChange={setProfitTargetDateError}
              onChange={setNewAccount}
            />
          </>
        )}

        {newAccount.propChallenge && (
          <DisplayPolicyProvider privacyModeOverride={false}>
            <PropChallengeSettingsSection
              existingAccount={false}
              value={newAccount.propChallenge}
              currencyCode={newAccount.currency}
              disabled={isSaving}
              accountType={newAccount.accountType}
              onChange={handleChallengeChange}
              onAccountTypeChange={(accountType) =>
                setNewAccount((current) => ({ ...current, accountType }))
              }
              monthlyCostField={
                <MonthlyCostField
                  account={newAccount}
                  isSaving={isSaving}
                  onChange={setNewAccount}
                />
              }
            />
          </DisplayPolicyProvider>
        )}

        
        <CopyTradingFields
          account={newAccount}
          plugin={plugin}
          isSaving={isSaving}
          onChange={setNewAccount}
        />

        
        <div className="journalit-modal-actions journalit-account-form-actions">
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
            onClick={handleCreate}
            disabled={isSaving}
            className="journalit-modal-actions__primary"
          >
            {isSaving
              ? t('account.create.button.creating')
              : t('account.create.button.create')}
          </Button>
        </div>
      </div>
    </DateDraftGateContext.Provider>
  );
};


export function openCreateAccountModal(
  app: App,
  plugin: JournalitPlugin,
  onSave: () => void,
  options?: {
    navigateOnSave?: boolean;
    initialName?: string;
    initialPropChallenge?: boolean;
  }
): void {
  const modal = new CreateAccountModal({
    app,
    plugin,
    onClose: () => {}, 
    onSave,
    navigateOnSave: options?.navigateOnSave,
    initialName: options?.initialName,
    initialPropChallenge: options?.initialPropChallenge,
  });
  modal.open();
}
