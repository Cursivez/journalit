

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
import { ensureAccountPageModalStyles } from '../../../styles/accountPage/accountPageModalStyles';

interface EventData {
  type: TransactionType;
  amount: string;
  date: string;
  description: string;
}

interface AddEventModalProps {
  app: App;
  plugin: JournalitPlugin;
  accountName: string;
  onClose: () => void;
  onSave: () => void;
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
> = ({ plugin, accountName, onSave, onModalClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { currency: globalCurrency } = useCurrency();

  
  const accountCurrency =
    plugin.settings?.account?.accountMetadata?.[accountName]?.currency;
  const currency = accountCurrency || globalCurrency;

  
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
    });
  };

  
  
  const getCurrentLocalDateForInput = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  
  const [eventData, setEventData] = useState({
    type: TransactionType.DEPOSIT,
    amount: '',
    date: getCurrentLocalDateForInput(),
    description: '',
  });

  const handleSave = async () => {
    try {
      setIsLoading(true);

      
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

      const eventDate = new Date(eventData.date);

      
      const today = new Date();
      today.setHours(23, 59, 59, 999); 
      if (eventDate > today) {
        new Notice(t('account.add-event.error.future-date'));
        return;
      }

      
      const shouldProceed = await showConfirmationModal(eventData, amount);
      if (!shouldProceed) {
        return; 
      }

      
      if (eventData.type === TransactionType.DEPOSIT) {
        await plugin.accountPageService?.addManualDeposit(
          accountName,
          amount,
          eventDate,
          eventData.description || undefined
        );
      } else {
        await plugin.accountPageService?.addManualWithdrawal(
          accountName,
          amount,
          eventDate,
          eventData.description || undefined
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
        t('account.add-event.error.failed', { error: (error as Error).message })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showConfirmationModal = (
    eventData: EventData,
    amount: number
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const modal = new ConfirmationModal(
        plugin.app,
        plugin,
        eventData,
        amount,
        accountName,
        currency,
        resolve
      );
      modal.open();
    });
  };

  return (
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
              value={eventData.type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setEventData((currentData) => ({
                  ...currentData,
                  type: e.target.value as TransactionType,
                  description: '', 
                }))
              }
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      
      <div className="setting-item two-column">
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
              value={
                eventData.date
                  ? new Date(eventData.date + 'T00:00:00')
                  : undefined
              }
              onChange={(value) => {
                if (value instanceof Date) {
                  const year = value.getFullYear();
                  const month = String(value.getMonth() + 1).padStart(2, '0');
                  const day = String(value.getDate()).padStart(2, '0');
                  setEventData((currentData) => ({
                    ...currentData,
                    date: `${year}-${month}-${day}`,
                  }));
                } else {
                  setEventData((currentData) => ({ ...currentData, date: '' }));
                }
              }}
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      
      <div className="add-event-buttons">
        <div className="button-group-left">
          
        </div>
        <div className="button-group-right">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isLoading}
            className="add-event-button accent-button"
          >
            {isLoading
              ? t('account.add-event.button.adding')
              : t('account.add-event.button.add')}
          </Button>
          <Button
            variant="secondary"
            onClick={onModalClose}
            disabled={isLoading}
            className="cancel-button"
          >
            {t('button.cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
};


class ConfirmationModal extends Modal {
  constructor(
    app: App,
    private plugin: JournalitPlugin,
    private eventData: EventData,
    private amount: number,
    private accountName: string,
    private accountCurrency: string,
    private onConfirm: (proceed: boolean) => void
  ) {
    super(app);
    this.titleEl.setText(t('account.add-event.confirm.title'));
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

    const typeText =
      this.eventData.type === TransactionType.DEPOSIT
        ? t('account.add-event.type.deposit').toLowerCase()
        : t('account.add-event.type.withdrawal').toLowerCase();
    const eventDate = formatDateDisplay(
      new Date(this.eventData.date),
      getUserDateFormat()
    );

    
    const infoBox = container.createDiv({
      cls: 'journalit-account-modal__info',
    });

    infoBox.createEl('p', {
      text: t('account.add-event.confirm.message', {
        type: typeText,
        amount: formatCurrency(this.amount),
        account: this.accountName,
        date: eventDate,
      }),
      cls: 'journalit-account-modal__text',
    });

    if (this.eventData.description) {
      infoBox.createEl('p', {
        text: t('account.add-event.confirm.description', {
          description: this.eventData.description,
        }),
        cls: 'journalit-account-modal__text journalit-account-modal__text--muted journalit-account-modal__text--spaced',
      });
    }

    
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
      text: t('account.add-event.button.add'),
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


export function openAddEventModal(
  app: App,
  plugin: JournalitPlugin,
  accountName: string,
  onSave: () => void
): void {
  const modal = new AddEventModal({
    app,
    plugin,
    accountName,
    onClose: () => {}, 
    onSave,
  });
  modal.open();
}
