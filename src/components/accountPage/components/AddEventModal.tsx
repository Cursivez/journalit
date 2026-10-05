

import { App, Modal, Notice } from 'obsidian';
import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import JournalitPlugin from '../../../main';
import { TransactionType } from '../../../services/account/types';
import { Button } from '../../ui/Button';
import {
  formatDateDisplay,
  getUserDateFormat,
  isValidDate,
} from '../../../utils/dateUtils';
import {
  CurrencyProvider,
  useCurrency,
} from '../../../contexts/CurrencyContext';
import { t } from '../../../lang/helpers';
import { FastDateTimeInput } from '../../core/FastDateTimeInput';
import {
  DateDraftGateContext,
  useDateDraftGate,
} from '../../core/DateDraftGate';
import { showActionConfirmationModal } from '../../shared/ConfirmationModal';
import {
  formatTimeOfDay,
  getUse24HourTimeSetting,
} from '../../../utils/timeFormat';
import {
  accountEventDateForSave,
  isFutureAccountEvent,
} from './accountEventDate';

function isTransactionType(value: string): value is TransactionType {
  return value === 'deposit' || value === 'withdrawal';
}

function transactionTypeFromSelect(value: string): TransactionType {
  return isTransactionType(value) ? value : TransactionType.DEPOSIT;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

interface EventData {
  type: TransactionType;
  amount: string;
  date: Date | null;
  description: string;
}

interface AddEventInitialValues {
  type: TransactionType;
  amount?: number;
  description?: string;
}

interface AddEventModalProps {
  app: App;
  plugin: JournalitPlugin;
  accountName: string;
  onClose: () => void;
  onSave: () => void;
  initial?: AddEventInitialValues;
}

interface AddEventConfirmationOptions {
  app: App;
  eventData: EventData;
  amount: number;
  accountName: string;
  currency: string;
  eventDate: Date;
  includeTime: boolean;
  use24HourTime: boolean;
}

function showAddEventConfirmation({
  app,
  eventData,
  amount,
  accountName,
  currency,
  eventDate: date,
  includeTime,
  use24HourTime,
}: AddEventConfirmationOptions): Promise<boolean> {
  const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    });
  const typeText =
    eventData.type === TransactionType.DEPOSIT
      ? t('account.add-event.type.deposit').toLowerCase()
      : t('account.add-event.type.withdrawal').toLowerCase();
  const eventDate = `${formatDateDisplay(date, getUserDateFormat())}${includeTime ? ` ${formatTimeOfDay(date, use24HourTime, true)}` : ''}`;

  return showActionConfirmationModal(app, {
    title: t('account.add-event.confirm.title'),
    cancelValue: false,
    renderContent: (contentEl) => {
      const container = contentEl.createDiv({
        cls: 'journalit-confirmation-content',
      });
      const infoBox = container.createDiv({
        cls: 'journalit-confirmation-content__info',
      });
      infoBox.createEl('p', {
        text: t('account.add-event.confirm.message', {
          type: typeText,
          amount: formatCurrency(amount),
          account: accountName,
          date: eventDate,
        }),
        cls: 'journalit-confirmation-modal__message',
      });

      if (eventData.description) {
        infoBox.createEl('p', {
          text: t('account.add-event.confirm.description', {
            description: eventData.description,
          }),
          cls: 'journalit-confirmation-modal__message',
        });
      }
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
        label: t('account.add-event.button.add'),
        variant: 'primary',
      },
    ],
  });
}


class AddEventModal extends Modal {
  private props: AddEventModalProps;
  private container: HTMLDivElement;
  private root: Root;

  constructor(props: AddEventModalProps) {
    super(props.app);
    this.titleEl.setText(t('account.add-event.title'));
    this.props = props;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass('journalit-modal');

    
    this.container = contentEl.createDiv({ cls: 'add-event-modal-container' });

    
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
      <CurrencyProvider>
        <AddEventModalContent
          {...this.props}
          onModalClose={() => this.close()}
        />
      </CurrencyProvider>
    );
  }
}


const AddEventModalContent: React.FC<
  AddEventModalProps & { onModalClose: () => void }
> = ({ app, plugin, accountName, onSave, onModalClose, initial }) => {
  const dateDraftGate = useDateDraftGate();
  const [isSaving, setIsSaving] = useState(false);
  const { currency: globalCurrency } = useCurrency();

  
  const accountCurrency =
    plugin.settings?.account?.accountMetadata?.[accountName]?.currency;
  const currency = accountCurrency || globalCurrency;
  const includeTime = Boolean(
    plugin.settings.account?.accountMetadata?.[accountName]?.propChallenge
  );

  
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
    });
  };

  
  const [eventData, setEventData] = useState<EventData>({
    type: initial?.type ?? TransactionType.DEPOSIT,
    amount: initial?.amount !== undefined ? initial.amount.toFixed(2) : '',
    date: new Date(),
    description: initial?.description ?? '',
  });

  const handleSave = async () => {
    if (!dateDraftGate.confirm()) return;
    try {
      setIsSaving(true);

      
      if (!eventData.amount || parseFloat(eventData.amount) <= 0) {
        new Notice(t('account.add-event.error.amount-required'));
        return;
      }

      if (!eventData.date) {
        new Notice(t('account.add-event.error.date-required'));
        return;
      }

      const amount = parseFloat(eventData.amount);

      if (!isValidDate(eventData.date)) {
        new Notice(t('account.add-event.error.invalid-date'));
        return;
      }

      const eventDate = accountEventDateForSave({
        date: eventData.date,
        includeTime,
      });
      if (
        isFutureAccountEvent({
          date: eventData.date,
          includeTime,
          now: new Date(),
        })
      ) {
        new Notice(t('account.add-event.error.future-date'));
        return;
      }

      
      const shouldProceed = await showAddEventConfirmation({
        app,
        eventData,
        amount,
        accountName,
        currency,
        eventDate,
        includeTime,
        use24HourTime: getUse24HourTimeSetting(plugin),
      });
      if (!shouldProceed) {
        return; 
      }

      
      if (eventData.type === TransactionType.DEPOSIT) {
        await plugin.accountPageService?.addManualDeposit(
          accountName,
          amount,
          eventDate,
          eventData.description || undefined,
          includeTime ? 'instant' : 'day'
        );
      } else {
        await plugin.accountPageService?.addManualWithdrawal(
          accountName,
          amount,
          eventDate,
          eventData.description || undefined,
          includeTime ? 'instant' : 'day'
        );
      }

      
      const typeText =
        eventData.type === TransactionType.DEPOSIT
          ? t('account.add-event.type.deposit')
          : t('account.add-event.type.withdrawal');
      new Notice(
        t('account.add-event.success', {
          type: typeText,
          amount: formatCurrency(amount),
        })
      );

      
      onSave();

      
      onModalClose();
    } catch (error: unknown) {
      console.error('Error adding transaction:', error);
      new Notice(
        t('account.add-event.error.failed', { error: errorMessage(error) })
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DateDraftGateContext.Provider value={dateDraftGate}>
      <div className="add-event-form">
        
        <div className="setting-item two-column">
          <div className="column">
            <div className="setting-item-info">
              <div className="setting-item-name">
                {t('account.add-event.field.type')}
              </div>
              <div className="setting-item-description">
                {t('account.add-event.field.type-desc')}
              </div>
            </div>
            <div className="setting-item-control">
              <select
                aria-label={t('account.add-event.field.type')}
                value={eventData.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setEventData((currentData) => ({
                    ...currentData,
                    type: transactionTypeFromSelect(e.target.value),
                    description: '', 
                  }))
                }
                disabled={isSaving}
              >
                <option value={TransactionType.DEPOSIT}>
                  {t('account.add-event.type.deposit')}
                </option>
                <option value={TransactionType.WITHDRAWAL}>
                  {t('account.add-event.type.withdrawal')}
                </option>
              </select>
            </div>
          </div>
          <div className="column">
            <div className="setting-item-info">
              <div className="setting-item-name">
                {t('account.add-event.field.amount')}
              </div>
              <div className="setting-item-description">
                {t('account.add-event.field.amount-desc', { currency })}
              </div>
            </div>
            <div className="setting-item-control">
              <input
                aria-label={t('account.add-event.field.amount')}
                type="number"
                value={eventData.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEventData((currentData) => ({
                    ...currentData,
                    amount: e.target.value,
                  }))
                }
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (eventData.amount === '0' || eventData.amount === '') {
                    e.target.value = '';
                  }
                }}
                min="0.01"
                step="0.01"
                placeholder="0.00"
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        
        <div
          className={`setting-item two-column${includeTime ? ' journalit-event-date-time' : ''}`}
        >
          <div className="column">
            <div className="setting-item-info">
              <div className="setting-item-name">
                {t('account.add-event.field.date')}
              </div>
              <div className="setting-item-description">
                {t('account.add-event.field.date-desc')}
              </div>
            </div>
            <div className="setting-item-control">
              <FastDateTimeInput
                value={eventData.date ?? undefined}
                includeTime={includeTime}
                showSeconds={includeTime}
                use24HourTime={getUse24HourTimeSetting(plugin)}
                onChange={(value) => {
                  setEventData((currentData) => ({
                    ...currentData,
                    date: value instanceof Date ? value : null,
                  }));
                }}
                disabled={isSaving}
              />
            </div>
          </div>
          <div className="column">
            <div className="setting-item-info">
              <div className="setting-item-name">
                {t('account.add-event.field.description')}
              </div>
              <div className="setting-item-description">
                {t('account.add-event.field.description-desc')}
              </div>
            </div>
            <div className="setting-item-control">
              <input
                type="text"
                value={eventData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEventData((currentData) => ({
                    ...currentData,
                    description: e.target.value,
                  }))
                }
                placeholder={
                  eventData.type === TransactionType.DEPOSIT
                    ? t('account.add-event.placeholder.deposit')
                    : t('account.add-event.placeholder.withdrawal')
                }
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        
        <div className="add-event-buttons">
          <div className="button-group-left">
            
          </div>
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
              onClick={handleSave}
              disabled={isSaving}
              className="add-event-button accent-button"
            >
              {isSaving
                ? t('account.add-event.button.adding')
                : t('account.add-event.button.add')}
            </Button>
          </div>
        </div>
      </div>
    </DateDraftGateContext.Provider>
  );
};


export function openAddEventModal(
  app: App,
  plugin: JournalitPlugin,
  accountName: string,
  onSave: () => void,
  initial?: AddEventInitialValues
): void {
  const modal = new AddEventModal({
    app,
    plugin,
    accountName,
    onClose: () => {}, 
    onSave,
    ...(initial ? { initial } : {}),
  });
  modal.open();
}
