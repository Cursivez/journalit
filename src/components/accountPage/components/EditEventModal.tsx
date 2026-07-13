

import { App, Modal, Notice } from 'obsidian';
import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import JournalitPlugin from '../../../main';
import {
  AccountTransaction,
  TransactionType,
} from '../../../services/account/types';
import { Button } from '../../ui/Button';
import { FastDateTimeInput } from '../../core/FastDateTimeInput';
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

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

interface EditEventModalProps {
  app: App;
  plugin: JournalitPlugin;
  accountName: string;
  transaction: AccountTransaction;
  onClose: () => void;
  onSave: () => void;
}


class EditEventModal extends Modal {
  private props: EditEventModalProps;
  private container: HTMLDivElement;
  private root: Root | null = null;

  constructor(props: EditEventModalProps) {
    super(props.app);
    this.props = props;
    const typeText =
      this.props.transaction.type === TransactionType.DEPOSIT
        ? t('account.add-event.type.deposit')
        : t('account.add-event.type.withdrawal');
    this.titleEl.setText(t('account.edit-event.title', { type: typeText }));
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
        <EditEventModalContent
          {...this.props}
          onModalClose={() => this.close()}
        />
      </CurrencyProvider>
    );
  }
}


type EditEventFormState = {
  type: TransactionType;
  amount: string;
  date: string;
  description: string;
};

interface EditEventModalModelProps {
  plugin: JournalitPlugin;
  accountName: string;
  transaction: AccountTransaction;
  onSave: () => void;
  onModalClose: () => void;
}

function useEditEventModalModel({
  plugin,
  accountName,
  transaction,
  onSave,
  onModalClose,
}: EditEventModalModelProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { currency: globalCurrency } = useCurrency();

  
  const accountCurrency =
    plugin.settings?.account?.accountMetadata?.[accountName]?.currency;
  const currency = accountCurrency || globalCurrency;

  
  const [eventData, setEventData] = useState<EditEventFormState>({
    type: transaction.type,
    amount: Math.abs(transaction.amount).toString(),
    date: new Date(transaction.date).toISOString().split('T')[0],
    description: transaction.description || '',
  });

  const formatCurrency = (value: number): string => {
    return Math.abs(value).toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    });
  };

  const typeText =
    transaction.type === TransactionType.DEPOSIT
      ? t('account.add-event.type.deposit')
      : t('account.add-event.type.withdrawal');

  const handleSave = async () => {
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

      const eventDate = new Date(eventData.date);

      
      const today = new Date();
      today.setHours(23, 59, 59, 999); 
      if (eventDate > today) {
        new Notice(t('account.add-event.error.future-date'));
        return;
      }

      
      await plugin.accountPageService?.updateManualTransaction(
        accountName,
        transaction.id,
        {
          amount: amount,
          date: eventDate,
          description: eventData.description || undefined,
        }
      );

      new Notice(t('account.edit-event.success.update', { type: typeText }));

      
      onSave();

      
      onModalClose();
    } catch (error) {
      console.error('Error updating transaction:', error);
      new Notice(
        t('account.edit-event.error.update', { error: getErrorMessage(error) })
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await plugin.accountPageService?.deleteManualTransaction(
        accountName,
        transaction.id
      );

      new Notice(t('account.edit-event.success.delete', { type: typeText }));

      
      onSave();

      
      onModalClose();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      new Notice(
        t('account.edit-event.error.delete', { error: getErrorMessage(error) })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isSaving,
    isDeleting,
    showDeleteConfirm,
    eventData,
    currency,
    typeText,
    setShowDeleteConfirm,
    setEventData,
    formatCurrency,
    handleSave,
    handleDelete,
  };
}

type EditEventModalModel = ReturnType<typeof useEditEventModalModel>;

function EditEventDeleteConfirm({
  model,
  transaction,
}: {
  model: EditEventModalModel;
  transaction: AccountTransaction;
}) {
  const {
    isDeleting,
    typeText,
    setShowDeleteConfirm,
    formatCurrency,
    handleDelete,
  } = model;

  return (
    <div className="add-event-form">
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name journalit-u-text-error">
            {t('account.edit-event.delete-confirm.title', { type: typeText })}
          </div>
          <div className="setting-item-description">
            {t('account.edit-event.delete-confirm.message', {
              type: typeText.toLowerCase(),
              amount: formatCurrency(transaction.amount),
              date: formatDateDisplay(
                new Date(transaction.date),
                getUserDateFormat()
              ),
            })}
          </div>
          <div className="setting-item-description warning">
            {t('account.edit-event.delete-confirm.warning')}
          </div>
        </div>
      </div>

      <div className="add-event-buttons">
        <div className="button-group-right">
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting}
            className="delete-transaction-button"
          >
            {isDeleting
              ? t('account.edit-event.button.deleting')
              : t('account.edit-event.button.delete', { type: typeText })}
          </Button>
          <Button
            variant="plain"
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isDeleting}
            className="cancel-button"
          >
            {t('button.cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditEventForm({
  model,
  onModalClose,
}: {
  model: EditEventModalModel;
  onModalClose: () => void;
}) {
  const {
    isSaving,
    eventData,
    currency,
    typeText,
    setShowDeleteConfirm,
    setEventData,
    handleSave,
  } = model;

  return (
    <div className="add-event-form">
      
      <div className="setting-item two-column">
        <div className="column">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('account.edit-event.field.type')}
            </div>
            <div className="setting-item-description">
              {t('account.edit-event.field.type-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <select defaultValue={eventData.type} disabled={true}>
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
              {t('account.edit-event.field.amount')}
            </div>
            <div className="setting-item-description">
              {t('account.edit-event.field.amount-desc', { currency })}
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
              disabled={isSaving}
            />
          </div>
        </div>
      </div>

      
      <div className="setting-item two-column">
        <div className="column">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('account.edit-event.field.date')}
            </div>
            <div className="setting-item-description">
              {t('account.edit-event.field.date-desc')}
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
              disabled={isSaving}
            />
          </div>
        </div>
        <div className="column">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('account.edit-event.field.description')}
            </div>
            <div className="setting-item-description">
              {t('account.edit-event.field.description-desc')}
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
          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSaving}
            className="delete-transaction-button"
          >
            {t('account.edit-event.button.delete', { type: typeText })}
          </Button>
        </div>
        <div className="button-group-right">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            className="add-event-button accent-button"
          >
            {isSaving
              ? t('account.edit-event.button.saving')
              : t('account.edit-event.button.save')}
          </Button>
          <Button
            variant="plain"
            onClick={onModalClose}
            disabled={isSaving}
            className="cancel-button"
          >
            {t('button.cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
}

const EditEventModalContent: React.FC<
  EditEventModalProps & { onModalClose: () => void }
> = ({ plugin, accountName, transaction, onSave, onModalClose }) => {
  const model = useEditEventModalModel({
    plugin,
    accountName,
    transaction,
    onSave,
    onModalClose,
  });

  if (model.showDeleteConfirm) {
    return <EditEventDeleteConfirm model={model} transaction={transaction} />;
  }

  return <EditEventForm model={model} onModalClose={onModalClose} />;
};


export function openEditEventModal(
  app: App,
  plugin: JournalitPlugin,
  accountName: string,
  transaction: AccountTransaction,
  onSave: () => void
): void {
  const modal = new EditEventModal({
    app,
    plugin,
    accountName,
    transaction,
    onClose: () => {}, 
    onSave,
  });
  modal.open();
}
