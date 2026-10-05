

import { App, Modal, Notice } from 'obsidian';
import React, { useEffect, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import JournalitPlugin from '../../../main';
import {
  AccountTransaction,
  TransactionType,
} from '../../../services/account/types';
import { Button } from '../../ui/Button';
import { FastDateTimeInput } from '../../core/FastDateTimeInput';
import {
  DateDraftGateContext,
  useDateDraftGate,
} from '../../core/DateDraftGate';
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
import {
  ConfirmationPanel,
  type ConfirmationPanelAction,
} from '../../shared/ConfirmationPanel';
import {
  formatTimeOfDay,
  getUse24HourTimeSetting,
} from '../../../utils/timeFormat';
import {
  accountEventDateForEditing,
  accountEventDateForSave,
  isTimedAccountEvent,
  isFutureAccountEvent,
} from './accountEventDate';

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
        <EditEventModalContent
          {...this.props}
          onModalClose={() => this.close()}
          onModalTitleChange={(title) => this.titleEl.setText(title)}
        />
      </CurrencyProvider>
    );
  }
}


type EditEventFormState = {
  type: TransactionType;
  amount: string;
  date: Date | null;
  dateEdited: boolean;
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
  const dateDraftGate = useDateDraftGate();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { currency: globalCurrency } = useCurrency();

  
  const accountCurrency =
    plugin.settings?.account?.accountMetadata?.[accountName]?.currency;
  const currency = accountCurrency || globalCurrency;
  const includeTime =
    isTimedAccountEvent(transaction) &&
    Boolean(
      plugin.settings.account?.accountMetadata?.[accountName]?.propChallenge
    );
  const use24HourTime = getUse24HourTimeSetting(plugin);

  
  const [eventData, setEventData] = useState<EditEventFormState>({
    type: transaction.type,
    amount: Math.abs(transaction.amount).toString(),
    date: accountEventDateForEditing({ date: transaction.date, includeTime }),
    dateEdited: false,
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

      
      await plugin.accountPageService?.updateManualTransaction(
        accountName,
        transaction.id,
        {
          amount: amount,
          ...(eventData.dateEdited &&
          eventDate.getTime() !== transaction.date.getTime()
            ? {
                date: eventDate,
                datePrecision: includeTime ? 'instant' : 'day',
              }
            : {}),
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
    includeTime,
    use24HourTime,
    showDeleteConfirm,
    eventData,
    currency,
    typeText,
    setShowDeleteConfirm,
    setEventData,
    formatCurrency,
    handleSave,
    handleDelete,
    dateDraftGate,
  };
}

type EditEventModalModel = ReturnType<typeof useEditEventModalModel>;

type EditEventDeleteAction = 'cancel' | 'delete';

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
  const { includeTime, use24HourTime } = model;

  return (
    <ConfirmationPanel<EditEventDeleteAction>
      destructive
      disabled={isDeleting}
      className="add-event-form"
      actions={
        [
          {
            id: 'cancel',
            value: 'cancel',
            label: t('button.cancel'),
            variant: 'secondary',
            initialFocus: true,
          },
          {
            id: 'delete',
            value: 'delete',
            label: isDeleting
              ? t('account.edit-event.button.deleting')
              : t('account.edit-event.button.delete', { type: typeText }),
            variant: 'destructive',
          },
        ] satisfies readonly ConfirmationPanelAction<EditEventDeleteAction>[]
      }
      onAction={(action) => {
        if (action === 'cancel') {
          setShowDeleteConfirm(false);
          return;
        }
        void handleDelete();
      }}
    >
      <div className="setting-item-info">
        <div className="setting-item-description">
          {t('account.edit-event.delete-confirm.message', {
            type: typeText.toLowerCase(),
            amount: formatCurrency(transaction.amount),
            date: `${formatDateDisplay(accountEventDateForEditing({ date: transaction.date, includeTime }), getUserDateFormat())}${includeTime ? ` ${formatTimeOfDay(transaction.date, use24HourTime, true)}` : ''}`,
          })}
        </div>
        <div className="setting-item-description warning">
          {t('account.edit-event.delete-confirm.warning')}
        </div>
      </div>
    </ConfirmationPanel>
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
    dateDraftGate,
  } = model;
  const { includeTime, use24HourTime } = model;

  return (
    <DateDraftGateContext.Provider value={dateDraftGate}>
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
              <select
                aria-label={t('account.edit-event.field.type')}
                defaultValue={eventData.type}
                disabled={true}
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
                {t('account.edit-event.field.amount')}
              </div>
              <div className="setting-item-description">
                {t('account.edit-event.field.amount-desc', { currency })}
              </div>
            </div>
            <div className="setting-item-control">
              <input
                aria-label="0.00"
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
                {t('account.edit-event.field.date')}
              </div>
              <div className="setting-item-description">
                {t('account.edit-event.field.date-desc')}
              </div>
            </div>
            <div className="setting-item-control">
              <FastDateTimeInput
                value={eventData.date ?? undefined}
                includeTime={includeTime}
                showSeconds={includeTime}
                use24HourTime={use24HourTime}
                onChange={(value) => {
                  setEventData((currentData) => ({
                    ...currentData,
                    date: value instanceof Date ? value : null,
                    dateEdited: true,
                  }));
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
    </DateDraftGateContext.Provider>
  );
}

const EditEventModalContent: React.FC<
  EditEventModalProps & {
    onModalClose: () => void;
    onModalTitleChange: (title: string) => void;
  }
> = ({
  plugin,
  accountName,
  transaction,
  onSave,
  onModalClose,
  onModalTitleChange,
}) => {
  const model = useEditEventModalModel({
    plugin,
    accountName,
    transaction,
    onSave,
    onModalClose,
  });

  useEffect(() => {
    onModalTitleChange(
      model.showDeleteConfirm
        ? t('account.edit-event.delete-confirm.title', {
            type: model.typeText,
          })
        : t('account.edit-event.title', { type: model.typeText })
    );
  }, [model.showDeleteConfirm, model.typeText, onModalTitleChange]);

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
