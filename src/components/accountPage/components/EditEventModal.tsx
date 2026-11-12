

import { App, Notice } from 'obsidian';
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
  formatLocalDateString,
  getUserDateFormat,
  isValidDate,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import type { PropChallengePriorPayout } from '../../../services/propChallenge/types';
import {
  CurrencyProvider,
  useCurrency,
} from '../../../contexts/CurrencyContext';
import { t } from '../../../lang/helpers';
import {
  AccountEventDescriptionField,
  PRIOR_PAYOUT_EVENT,
  type AccountEventType,
} from './AccountEventDescriptionField';
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
import { JournalitModal } from '../../modals/JournalitModal';
import { DropdownSelect } from '../../shared/DropdownSelect';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);


type EditableAccountEvent =
  | { kind: 'transaction'; transaction: AccountTransaction }
  | { kind: 'prior-payout'; payout: PropChallengePriorPayout };

interface EditEventModalProps {
  app: App;
  plugin: JournalitPlugin;
  accountName: string;
  event: EditableAccountEvent;
  onClose: () => void;
  onSave: () => void;
}

function eventType(event: EditableAccountEvent): AccountEventType {
  return event.kind === 'transaction'
    ? event.transaction.type
    : PRIOR_PAYOUT_EVENT;
}


function eventTypeText(event: EditableAccountEvent): string {
  if (event.kind === 'prior-payout')
    return t('account.edit-event.type.prior-payout');
  return event.transaction.type === TransactionType.DEPOSIT
    ? t('account.add-event.type.deposit')
    : t('account.add-event.type.withdrawal');
}


class EditEventModal extends JournalitModal {
  private props: EditEventModalProps;
  private container: HTMLDivElement;
  private root: Root | null = null;

  constructor(props: EditEventModalProps) {
    super(props.app);
    this.props = props;
    this.titleEl.setText(
      t('account.edit-event.title', { type: eventTypeText(props.event) })
    );
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
  type: AccountEventType;
  amount: string;
  date: Date | null;
  dateEdited: boolean;
  description: string;
};

interface EditEventModalModelProps {
  plugin: JournalitPlugin;
  accountName: string;
  event: EditableAccountEvent;
  onSave: () => void;
  onModalClose: () => void;
}


function editedEventValues(
  event: EditableAccountEvent,
  includeTime: boolean
): { amount: number; date: Date; description: string } {
  if (event.kind === 'prior-payout') {
    return {
      amount: event.payout.amount,
      date: parseLocalDateSafe(event.payout.date) ?? new Date(),
      description: event.payout.note ?? '',
    };
  }
  return {
    amount: Math.abs(event.transaction.amount),
    date: accountEventDateForEditing({
      date: event.transaction.date,
      includeTime,
    }),
    description: event.transaction.description || '',
  };
}

function useEditEventModalModel({
  plugin,
  accountName,
  event,
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
    event.kind === 'transaction' &&
    isTimedAccountEvent(event.transaction) &&
    Boolean(
      plugin.settings.account?.accountMetadata?.[accountName]?.propChallenge
    );
  const use24HourTime = getUse24HourTimeSetting(plugin);
  const original = editedEventValues(event, includeTime);

  
  const [eventData, setEventData] = useState<EditEventFormState>(() => ({
    type: eventType(event),
    amount: original.amount.toString(),
    date: original.date,
    dateEdited: false,
    description: original.description,
  }));

  const formatCurrency = (value: number): string => {
    return Math.abs(value).toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    });
  };

  const typeText = eventTypeText(event);

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

      if (event.kind === 'prior-payout') {
        await plugin.accountPageService?.updatePriorPayout(accountName, {
          id: event.payout.id,
          date: eventData.dateEdited
            ? formatLocalDateString(eventData.date)
            : event.payout.date,
          amount,
          ...(eventData.description ? { note: eventData.description } : {}),
        });
      } else {
        const { transaction } = event;
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
      }

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

      if (event.kind === 'prior-payout') {
        await plugin.accountPageService?.deletePriorPayout(
          accountName,
          event.payout.id
        );
      } else {
        await plugin.accountPageService?.deleteManualTransaction(
          accountName,
          event.transaction.id
        );
      }

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
    original,
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
  event,
}: {
  model: EditEventModalModel;
  event: EditableAccountEvent;
}) {
  const {
    isDeleting,
    typeText,
    setShowDeleteConfirm,
    formatCurrency,
    handleDelete,
  } = model;
  const { includeTime, use24HourTime, original } = model;
  const time =
    includeTime && event.kind === 'transaction'
      ? ` ${formatTimeOfDay(event.transaction.date, use24HourTime, true)}`
      : '';

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
            amount: formatCurrency(original.amount),
            date: `${formatDateDisplay(original.date, getUserDateFormat())}${time}`,
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
              
              <DropdownSelect
                ariaLabel={t('account.edit-event.field.type')}
                value={eventData.type}
                disabled
                options={[
                  {
                    value: eventData.type,
                    label:
                      eventData.type === PRIOR_PAYOUT_EVENT
                        ? t('account.add-event.type.prior-payout')
                        : typeText,
                  },
                ]}
                onChange={() => undefined}
              />
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

        
        <div className="setting-item">
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
        <AccountEventDescriptionField
          label={t('account.edit-event.field.description')}
          hint={t('account.edit-event.field.description-desc')}
          value={eventData.description}
          eventType={eventData.type}
          disabled={isSaving}
          onChange={(description) =>
            setEventData((currentData) => ({ ...currentData, description }))
          }
        />

        
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
                ? t('account.edit-event.button.saving')
                : t('account.edit-event.button.save')}
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
  event,
  onSave,
  onModalClose,
  onModalTitleChange,
}) => {
  const model = useEditEventModalModel({
    plugin,
    accountName,
    event,
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
    return <EditEventDeleteConfirm model={model} event={event} />;
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
  new EditEventModal({
    app,
    plugin,
    accountName,
    event: { kind: 'transaction', transaction },
    onClose: () => {}, 
    onSave,
  }).open();
}


export function openEditPriorPayoutModal(
  app: App,
  plugin: JournalitPlugin,
  accountName: string,
  payout: PropChallengePriorPayout,
  onSave: () => void
): void {
  new EditEventModal({
    app,
    plugin,
    accountName,
    event: { kind: 'prior-payout', payout },
    onClose: () => {},
    onSave,
  }).open();
}
