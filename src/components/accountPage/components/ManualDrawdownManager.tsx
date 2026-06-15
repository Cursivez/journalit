

import React, { useState } from 'react';
import { App, Modal, Notice } from 'obsidian';
import { ManualDrawdownSnapshot } from '../../../services/account/types';
import { Button } from '../../ui/Button';
import {
  formatDateDisplay,
  getUserDateFormat,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import { formatPnL } from '../../../utils/formatting';
import { FastDateTimeInput } from '../../core';
import { t } from '../../../lang/helpers';

export const MANUAL_DRAWDOWN_MANAGER_STYLES = `
        .edit-account-form .manual-drawdown-manager .save-accent {
          background-color: var(--interactive-accent) !important;
          color: var(--text-on-accent) !important;
          border-color: var(--interactive-accent) !important;
        }

        .edit-account-form .manual-drawdown-manager {
          padding: 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .edit-account-form .manual-drawdown-manager .section-header {
          margin: 0 0 1rem 0;
          font-size: 1.1em;
          font-weight: 600;
          color: var(--text-normal);
        }

        .edit-account-form .manual-drawdown-manager .snapshots-list-section {
          margin-bottom: 1rem;
        }

        .edit-account-form .manual-drawdown-manager .empty-state {
          padding: 2rem;
          text-align: center;
          background: var(--background-secondary);
          border-radius: 8px;
          border: 1px dashed var(--background-modifier-border);
        }

        .edit-account-form .manual-drawdown-manager .empty-state p {
          margin: 0.5rem 0;
          color: var(--text-muted);
        }

        .edit-account-form .manual-drawdown-manager .empty-state p:first-child {
          font-weight: 500;
          color: var(--text-normal);
        }

        .edit-account-form .manual-drawdown-manager .snapshots-table {
          overflow-x: auto;
          border: 1px solid var(--background-modifier-border);
          border-radius: 8px;
        }

        .edit-account-form .manual-drawdown-manager .snapshots-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .edit-account-form .manual-drawdown-manager .snapshots-table th {
          background: var(--background-secondary);
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: var(--text-normal);
          border-bottom: 2px solid var(--background-modifier-border);
        }

        .edit-account-form .manual-drawdown-manager .snapshots-table td {
          padding: 0.75rem;
          border-bottom: 1px solid var(--background-modifier-border);
          color: var(--text-normal);
        }

        .edit-account-form .manual-drawdown-manager .snapshots-table tbody tr:last-child td {
          border-bottom: none;
        }

        .edit-account-form .manual-drawdown-manager .snapshots-table tbody tr:hover {
          background: var(--background-secondary-alt);
        }

        .edit-account-form .manual-drawdown-manager .snapshots-table tbody tr.editing {
          background: var(--background-modifier-hover);
          outline: 2px solid var(--interactive-accent);
          outline-offset: -2px;
        }

        .edit-account-form .manual-drawdown-manager .note-cell {
          color: var(--text-muted);
          font-style: italic;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .edit-account-form .manual-drawdown-manager .actions-cell {
          display: flex;
          gap: 0.5rem;
        }

        .edit-account-form .manual-drawdown-manager .snapshot-form-section {
          background: var(--background-secondary);
          padding: 1.5rem;
          border-radius: 8px;
        }

        .edit-account-form .manual-drawdown-manager .validation-error {
          padding: 0.75rem;
          margin-bottom: 1rem;
          background: var(--background-modifier-error);
          border: 1px solid var(--text-error);
          border-radius: 6px;
          color: var(--text-error);
          font-weight: 500;
        }

        .edit-account-form .manual-drawdown-manager .setting-item {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          white-space: normal;
          word-wrap: break-word;
        }

        .edit-account-form .manual-drawdown-manager .setting-item.two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .edit-account-form .manual-drawdown-manager .setting-item.two-column .column {
          display: flex;
          flex-direction: column;
        }

        .edit-account-form .manual-drawdown-manager .setting-item.two-column .setting-item-info {
          margin-bottom: 0.5rem;
        }

        .edit-account-form .manual-drawdown-manager .setting-item .setting-item-info {
          flex-shrink: 0;
          width: 180px;
          margin-bottom: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .edit-account-form .manual-drawdown-manager .setting-item .setting-item-control {
          flex: 1;
        }

        
        .edit-account-form .manual-drawdown-manager .setting-item {
          display: flex !important;
          flex-direction: row !important;
          gap: 1rem !important;
        }

        .edit-account-form .manual-drawdown-manager .setting-item-control {
          flex: 1;
          min-width: 100px;
        }

        .edit-account-form .manual-drawdown-manager .setting-item-info {
          max-width: 180px;
          flex-shrink: 1;
          min-width: 120px;
        }

        .edit-account-form .manual-drawdown-manager .setting-item-name {
          font-weight: 600;
          color: var(--text-normal);
          margin-bottom: 0;
          white-space: nowrap;
        }

        .edit-account-form .manual-drawdown-manager .setting-item-description {
          font-size: 0.9em;
          color: var(--text-muted);
          display: inline;
        }

        .edit-account-form .manual-drawdown-manager .setting-item-control input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--background-modifier-border);
          border-radius: 4px;
          background: var(--background-primary);
          color: var(--text-normal);
        }

        .edit-account-form .manual-drawdown-manager .setting-item-control input:focus {
          outline: 2px solid var(--interactive-accent);
          outline-offset: -1px;
        }

        .edit-account-form .manual-drawdown-manager .form-buttons {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
`;

interface ManualDrawdownManagerProps {
  app: App;
  snapshots: ManualDrawdownSnapshot[];
  onSave: (snapshots: ManualDrawdownSnapshot[]) => void;
}

interface DrawdownSnapshotsTableProps {
  snapshots: ManualDrawdownSnapshot[];
  editingIndex: number | null;
  userDateFormat: string;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const getSnapshotDateKey = (date: ManualDrawdownSnapshot['date']): string => {
  const parsedDate = date instanceof Date ? date : new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? `invalid-date-${String(date)}`
    : parsedDate.toISOString();
};

const DrawdownSnapshotsTable: React.FC<DrawdownSnapshotsTableProps> = ({
  snapshots,
  editingIndex,
  userDateFormat,
  onEdit,
  onDelete,
}) => {
  if (snapshots.length === 0) {
    return null;
  }

  return (
    <div className="snapshots-list-section">
      <h3 className="section-header">
        {t('manual-drawdown.section.recorded')}
      </h3>

      <div className="snapshots-table">
        <table>
          <thead>
            <tr>
              <th>{t('manual-drawdown.table.date')}</th>
              <th>{t('manual-drawdown.table.limit')}</th>
              <th>{t('manual-drawdown.table.note')}</th>
              <th>{t('manual-drawdown.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((snapshot, index) => {
              const date =
                snapshot.date instanceof Date
                  ? snapshot.date
                  : new Date(snapshot.date);
              const dateKey = getSnapshotDateKey(snapshot.date);
              const isEditing = editingIndex === index;

              return (
                <tr
                  key={`${dateKey}-${snapshot.drawdownLimit}-${snapshot.note ?? ''}`}
                  className={isEditing ? 'editing' : ''}
                >
                  <td>{formatDateDisplay(date, userDateFormat)}</td>
                  <td>${snapshot.drawdownLimit.toLocaleString()}</td>
                  <td className="note-cell">{snapshot.note || '—'}</td>
                  <td className="actions-cell">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => onEdit(index)}
                    >
                      {isEditing
                        ? t('manual-drawdown.button.editing')
                        : t('manual-drawdown.button.edit')}
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => onDelete(index)}
                    >
                      {t('manual-drawdown.button.delete')}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface DrawdownSnapshotFormProps {
  editingIndex: number | null;
  validationError: string;
  formDate: string;
  formDrawdownLimit: string;
  formNote: string;
  userDateFormat: string;
  onDateChange: (value: string) => void;
  onDrawdownLimitChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onClearValidationError: () => void;
  onSubmit: () => void;
  onCancelEdit: () => void;
}

const DrawdownSnapshotForm: React.FC<DrawdownSnapshotFormProps> = ({
  editingIndex,
  validationError,
  formDate,
  formDrawdownLimit,
  formNote,
  userDateFormat,
  onDateChange,
  onDrawdownLimitChange,
  onNoteChange,
  onClearValidationError,
  onSubmit,
  onCancelEdit,
}) => (
  <div className="snapshot-form-section">
    <h3 className="section-header">
      {editingIndex !== null
        ? t('manual-drawdown.header.edit')
        : t('manual-drawdown.header.add')}
    </h3>

    {validationError && (
      <div className="journalit-manual-drawdown-validation-error">
        {validationError}
      </div>
    )}

    <div className="setting-item two-column">
      <div className="column">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('manual-drawdown.field.date')}
          </div>
          <div className="setting-item-description">
            {t('manual-drawdown.field.date-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <div className="journalit-manual-drawdown-date-input-wrapper">
            <FastDateTimeInput
              label=""
              value={formDate ? new Date(formDate) : undefined}
              onChange={(value) => {
                if (value instanceof Date) {
                  const year = value.getFullYear();
                  const month = String(value.getMonth() + 1).padStart(2, '0');
                  const day = String(value.getDate()).padStart(2, '0');
                  onDateChange(`${year}-${month}-${day}`);
                } else if (typeof value === 'string') {
                  onDateChange(value.split('T')[0]);
                } else {
                  onDateChange('');
                }
                onClearValidationError();
              }}
              includeTime={false}
              required={true}
              placeholder={userDateFormat}
            />
          </div>
        </div>
      </div>

      <div className="column">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('manual-drawdown.field.limit')}
          </div>
          <div className="setting-item-description">
            {t('manual-drawdown.field.limit-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <input
            type="number"
            value={formDrawdownLimit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onDrawdownLimitChange(e.target.value);
              onClearValidationError();
            }}
            placeholder="0"
            min="0"
            step="0.01"
            className="journalit-manual-drawdown-limit-input"
          />
        </div>
      </div>
    </div>

    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('manual-drawdown.field.note')}
        </div>
        <div className="setting-item-description">
          {t('manual-drawdown.field.note-desc')}
        </div>
      </div>
      <div className="setting-item-control">
        <input
          type="text"
          value={formNote}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onNoteChange(e.target.value);
          }}
          placeholder={t('manual-drawdown.placeholder.note')}
        />
      </div>
    </div>

    <div className="form-buttons">
      <Button variant="primary" onClick={onSubmit}>
        {editingIndex !== null
          ? t('manual-drawdown.button.update')
          : t('manual-drawdown.button.add')}
      </Button>
      {editingIndex !== null && (
        <Button variant="secondary" onClick={onCancelEdit}>
          {t('manual-drawdown.button.cancel-edit')}
        </Button>
      )}
    </div>
  </div>
);


export const ManualDrawdownManager = function ManualDrawdownManager({
  app,
  snapshots,
  onSave,
}: ManualDrawdownManagerProps) {
  const [localSnapshots, setLocalSnapshots] = useState<
    ManualDrawdownSnapshot[]
  >(() =>
    [...snapshots]
      .filter((s) => s && s.date) 
      .sort((a, b) => {
        
        const dateA = parseLocalDateSafe(a.date);
        const dateB = parseLocalDateSafe(b.date);
        return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
      })
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  
  const [formDate, setFormDate] = useState<string>('');
  const [formDrawdownLimit, setFormDrawdownLimit] = useState<string>('');
  const [formNote, setFormNote] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  
  const resetForm = () => {
    setFormDate('');
    setFormDrawdownLimit('');
    setFormNote('');
    setEditingIndex(null);
    setValidationError('');
  };

  
  const handleEdit = (index: number) => {
    const snapshot = localSnapshots[index];
    const date =
      snapshot.date instanceof Date ? snapshot.date : new Date(snapshot.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setFormDate(`${year}-${month}-${day}`);
    setFormDrawdownLimit(snapshot.drawdownLimit.toString());
    setFormNote(snapshot.note || '');
    setEditingIndex(index);
    setValidationError('');
  };

  
  const handleDelete = (index: number) => {
    const snapshot = localSnapshots[index];
    const date =
      snapshot.date instanceof Date ? snapshot.date : new Date(snapshot.date);
    const userDateFormat = getUserDateFormat();
    const formattedDate = formatDateDisplay(date, userDateFormat);

    
    new DeleteSnapshotConfirmationModal(
      app,
      formattedDate,
      snapshot.drawdownLimit,
      () => {
        const newSnapshots = localSnapshots.filter((_, i) => i !== index);
        setLocalSnapshots(newSnapshots);
        onSave(newSnapshots); 
        if (editingIndex === index) resetForm();
        new Notice(t('manual-drawdown.notice.deleted'));
      }
    ).open();
  };

  
  const validateForm = (): boolean => {
    setValidationError('');

    
    if (!formDate) {
      setValidationError(t('manual-drawdown.validation.date-required'));
      return false;
    }

    
    const parts = formDate.split('-').map((p) => parseInt(p, 10));
    if (parts.length !== 3 || parts.some((p) => isNaN(p))) {
      setValidationError(t('manual-drawdown.validation.invalid-date'));
      return false;
    }

    
    const date = new Date(parts[0], parts[1] - 1, parts[2]);

    
    if (
      date.getFullYear() !== parts[0] ||
      date.getMonth() !== parts[1] - 1 ||
      date.getDate() !== parts[2]
    ) {
      setValidationError(t('manual-drawdown.validation.invalid-date'));
      return false;
    }

    
    const today = new Date();
    today.setHours(23, 59, 59, 999); 
    if (date > today) {
      setValidationError(t('manual-drawdown.validation.future-date'));
      return false;
    }

    
    if (!formDrawdownLimit || formDrawdownLimit.trim() === '') {
      setValidationError(t('manual-drawdown.validation.limit-required'));
      return false;
    }

    const drawdownLimit = parseFloat(formDrawdownLimit);
    if (isNaN(drawdownLimit) || drawdownLimit <= 0) {
      setValidationError(t('manual-drawdown.validation.limit-positive'));
      return false;
    }

    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    const duplicateIndex = localSnapshots.findIndex((snapshot, index) => {
      if (editingIndex !== null && index === editingIndex) {
        return false; 
      }
      const snapshotDate =
        snapshot.date instanceof Date ? snapshot.date : new Date(snapshot.date);
      const year = snapshotDate.getFullYear();
      const month = String(snapshotDate.getMonth() + 1).padStart(2, '0');
      const day = String(snapshotDate.getDate()).padStart(2, '0');
      const snapshotDateString = `${year}-${month}-${day}`;
      return snapshotDateString === dateString;
    });

    if (duplicateIndex !== -1) {
      setValidationError(t('manual-drawdown.validation.duplicate-date'));
      return false;
    }

    return true;
  };

  
  const handleAddOrUpdate = () => {
    if (!validateForm()) {
      return;
    }

    
    const date = parseLocalDateSafe(formDate);
    if (!date) {
      setValidationError(t('manual-drawdown.validation.invalid-date'));
      return;
    }
    date.setHours(0, 0, 0, 0);

    const newSnapshot: ManualDrawdownSnapshot = {
      date,
      drawdownLimit: parseFloat(formDrawdownLimit),
      note: formNote.trim() || undefined,
    };

    let newSnapshots: ManualDrawdownSnapshot[];

    if (editingIndex !== null) {
      
      newSnapshots = [...localSnapshots];
      newSnapshots[editingIndex] = newSnapshot;
      new Notice(t('manual-drawdown.notice.updated'));
    } else {
      
      newSnapshots = [...localSnapshots, newSnapshot];
      new Notice(t('manual-drawdown.notice.added'));
    }

    
    newSnapshots.sort((a, b) => {
      
      const dateA = parseLocalDateSafe(a.date);
      const dateB = parseLocalDateSafe(b.date);
      return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
    });

    setLocalSnapshots(newSnapshots);
    onSave(newSnapshots); 
    resetForm();
  };

  const userDateFormat = getUserDateFormat();

  return (
    <div className="manual-drawdown-manager">
      <DrawdownSnapshotsTable
        snapshots={localSnapshots}
        editingIndex={editingIndex}
        userDateFormat={userDateFormat}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DrawdownSnapshotForm
        editingIndex={editingIndex}
        validationError={validationError}
        formDate={formDate}
        formDrawdownLimit={formDrawdownLimit}
        formNote={formNote}
        userDateFormat={userDateFormat}
        onDateChange={setFormDate}
        onDrawdownLimitChange={setFormDrawdownLimit}
        onNoteChange={setFormNote}
        onClearValidationError={() => setValidationError('')}
        onSubmit={handleAddOrUpdate}
        onCancelEdit={resetForm}
      />
    </div>
  );
};


class DeleteSnapshotConfirmationModal extends Modal {
  constructor(
    app: App,
    private snapshotDate: string,
    private drawdownLimit: number,
    private onConfirm: () => void
  ) {
    super(app);
    this.titleEl.setText(t('manual-drawdown.modal.delete-title'));
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    const container = contentEl.createDiv({
      cls: 'journalit-account-modal',
    });

    
    const infoBox = container.createDiv({
      cls: 'journalit-account-modal__info',
    });

    infoBox.createEl('p', {
      text: t('manual-drawdown.modal.delete-confirm', {
        date: this.snapshotDate,
      }),
      cls: 'journalit-account-modal__text journalit-account-modal__text--spaced',
    });
    infoBox.createEl('p', {
      text: t('manual-drawdown.modal.delete-limit', {
        limit: formatPnL(this.drawdownLimit),
      }),
      cls: 'journalit-account-modal__text journalit-account-modal__text--muted',
    });

    
    const warningBox = container.createDiv({
      cls: 'journalit-account-modal__warning journalit-account-modal__warning--danger journalit-account-modal__warning--spaced',
    });
    warningBox.createEl('p', {
      text: t('manual-drawdown.modal.delete-warning'),
      cls: 'journalit-account-modal__text journalit-account-modal__text--small',
    });

    
    const buttons = container.createDiv({
      cls: 'journalit-account-modal__actions',
    });

    const cancelBtn = buttons.createEl('button', {
      text: t('button.cancel'),
      cls: 'journalit-account-modal__button journalit-account-modal__button--secondary',
    });
    cancelBtn.addEventListener('click', () => this.close());

    const deleteBtn = buttons.createEl('button', {
      text: t('manual-drawdown.button.delete'),
      cls: 'journalit-account-modal__button journalit-account-modal__button--danger',
    });
    deleteBtn.addEventListener('click', () => {
      this.close();
      this.onConfirm();
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
