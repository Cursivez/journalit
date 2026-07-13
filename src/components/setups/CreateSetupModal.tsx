import React, { useMemo, useState } from 'react';
import { App, Modal, Notice, TFile } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';

import type JournalitPlugin from '../../main';
import type { Setup, SetupData, SetupStatus } from '../../services/setup/types';
import {
  dedupeSetupLinkedNotePaths,
  hasSetupLinkedNotePath,
  normalizeSetupLinkedNotePath,
} from '../../services/setup/linkedNotePaths';
import { t } from '../../lang/helpers';

import { AlertTriangle, Trash } from '../shared/icons/ObsidianIcon';
import { NoteFilePicker } from '../shared/NoteFilePicker';
import { Button } from '../ui/Button';
import { LabelColorPicker } from '../shared/LabelColorPicker';
import {
  DEFAULT_SETUP_PICKER_COLOR,
  type LabelColor,
} from '../../types/labelColor';

interface CreateSetupModalProps {
  app: App;
  plugin: JournalitPlugin;
  setup?: Setup;
  onClose: () => void;
  onSave: (setup: Setup) => void;
  onDelete?: (setup: Setup) => void;
}

type CreateSetupFormState = {
  name: string;
  status: SetupStatus;
  direction: '' | 'long' | 'short' | 'both';
  color?: LabelColor | null;
  linkedNotes: string[];
};

type CreateSetupModalState = {
  form: CreateSetupFormState;
  showNotePicker: boolean;
  isSaving: boolean;
  formError: string | null;
  confirmRename: boolean;
};

function parseCreateSetupStatus(value: string): SetupStatus {
  if (value === 'testing' || value === 'active' || value === 'archived') {
    return value;
  }
  return 'active';
}

function parseCreateSetupDirection(
  value: string
): CreateSetupFormState['direction'] {
  if (
    value === '' ||
    value === 'long' ||
    value === 'short' ||
    value === 'both'
  ) {
    return value;
  }
  return '';
}

class CreateSetupModal extends Modal {
  private root: Root | null = null;
  private container: HTMLDivElement;

  constructor(private props: CreateSetupModalProps) {
    super(props.app);
    this.titleEl.setText(
      props.setup ? t('setups.edit.title') : t('setups.create.title')
    );
  }

  onOpen(): void {
    this.contentEl.empty();
    this.modalEl.addClass('journalit-create-setup-modal');
    this.container = this.contentEl.createDiv({
      cls: 'create-setup-modal-container',
    });
    this.root = createRoot(this.container);
    this.root.render(
      <CreateSetupModalContent
        plugin={this.props.plugin}
        setup={this.props.setup}
        onSave={this.props.onSave}
        onDelete={this.props.onDelete}
        onModalClose={() => this.close()}
      />
    );
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    this.contentEl.empty();
    this.props.onClose();
  }
}

function CreateSetupErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="create-setup-error">
      <AlertTriangle size={16} />
      <div className="create-setup-error-content">
        <div className="create-setup-error-title">{t('common.error')}</div>
        <div className="create-setup-error-message">{message}</div>
      </div>
    </div>
  );
}

function CreateSetupWarning({
  title = t('common.warning'),
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="create-setup-warning">
      <AlertTriangle size={16} />
      <div className="create-setup-warning-content">
        <div className="create-setup-warning-title">{title}</div>
        <div className="create-setup-warning-message">{message}</div>
      </div>
    </div>
  );
}

function CreateSetupRenameWarning({ message }: { message: string }) {
  return (
    <CreateSetupWarning
      title={t('setups.edit.rename-warning.title')}
      message={message}
    />
  );
}

interface CreateSetupLinkedNotesFieldProps {
  linkedNotes: string[];
  files: TFile[];
  showNotePicker: boolean;
  isSaving: boolean;
  onShowNotePicker: () => void;
  onHideNotePicker: () => void;
  onAddLinkedNote: (file: TFile) => void;
  onRemoveLinkedNote: (path: string) => void;
}

function CreateSetupLinkedNotesField({
  linkedNotes,
  files,
  showNotePicker,
  isSaving,
  onShowNotePicker,
  onHideNotePicker,
  onAddLinkedNote,
  onRemoveLinkedNote,
}: CreateSetupLinkedNotesFieldProps) {
  return (
    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('setups.create.field.linked-notes')}
        </div>
        <div className="setting-item-description">
          {t('setups.create.field.linked-notes-desc')}
        </div>
      </div>
      <div className="create-setup-linked-notes">
        {linkedNotes.length === 0 && !showNotePicker ? (
          <div className="create-setup-linked-notes__empty">
            {t('setups.create.linked-notes.empty')}
          </div>
        ) : (
          <div className="create-setup-linked-notes__list">
            {linkedNotes.map((path) => (
              <div key={path} className="create-setup-linked-notes__item">
                <span className="create-setup-linked-notes__path">{path}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveLinkedNote(path)}
                  disabled={isSaving}
                  aria-label={t('setups.create.linked-notes.remove')}
                  className="custom-fields-option-delete-button"
                >
                  <Trash size={14} aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {!showNotePicker ? (
          <button
            type="button"
            className="journalit-setup-secondary-action-button"
            onClick={onShowNotePicker}
            disabled={isSaving}
          >
            {t('setups.create.linked-notes.add')}
          </button>
        ) : null}
      </div>
      {showNotePicker ? (
        <div className="create-setup-note-picker">
          <NoteFilePicker
            files={files}
            title={t('setups.create.linked-notes.picker-title')}
            searchPlaceholder={t('setups.create.linked-notes.search')}
            emptyMessage={t('setups.create.linked-notes.no-notes')}
            onSelectFile={onAddLinkedNote}
            onCancel={onHideNotePicker}
          />
        </div>
      ) : null}
    </div>
  );
}

class DeleteSetupConfirmationModal extends Modal {
  private settled = false;

  constructor(
    app: App,
    private setupName: string,
    private resolveChoice: (confirmed: boolean) => void
  ) {
    super(app);
    this.titleEl.setText(t('setups.edit.delete.title'));
    this.titleEl.addClass('journalit-modal-title-danger');
  }

  onOpen(): void {
    this.contentEl.empty();
    this.modalEl.addClass('journalit-setup-delete-confirmation-modal');

    this.contentEl.createEl('p', {
      text: t('setups.edit.delete.warning', { name: this.setupName }),
      cls: 'journalit-setup-delete-confirmation-modal__warning',
    });

    const actions = this.contentEl.createDiv({
      cls: 'journalit-setup-delete-confirmation-modal__actions',
    });
    const cancelButton = actions.createEl('button', {
      text: t('button.cancel'),
      cls: 'journalit-setup-delete-confirmation-modal__cancel',
    });
    cancelButton.addEventListener('click', () => {
      this.settled = true;
      this.resolveChoice(false);
      this.close();
    });

    const deleteButton = actions.createEl('button', {
      text: t('setups.edit.delete.confirm'),
      cls: 'mod-warning journalit-setup-delete-confirmation-modal__delete',
    });
    deleteButton.addEventListener('click', () => {
      this.settled = true;
      this.resolveChoice(true);
      this.close();
    });
  }

  onClose(): void {
    if (!this.settled) this.resolveChoice(false);
    this.contentEl.empty();
  }
}

function showDeleteSetupConfirmation(
  app: App,
  setupName: string
): Promise<boolean> {
  return new Promise((resolve) => {
    new DeleteSetupConfirmationModal(app, setupName, resolve).open();
  });
}

const CreateSetupModalContent: React.FC<{
  plugin: JournalitPlugin;
  setup?: Setup;
  onSave: (setup: Setup) => void;
  onDelete?: (setup: Setup) => void;
  onModalClose: () => void;
}> = ({ plugin, setup, onSave, onDelete, onModalClose }) => {
  const isEditMode = Boolean(setup);
  const [modalState, setModalState] = useState<CreateSetupModalState>({
    form: {
      name: setup?.name ?? '',
      status: setup?.status ?? 'active',
      direction: setup?.direction ?? '',
      color: setup ? setup.color : DEFAULT_SETUP_PICKER_COLOR,
      linkedNotes: dedupeSetupLinkedNotePaths(setup?.linkedNotes ?? []),
    },
    showNotePicker: false,
    isSaving: false,
    formError: null,
    confirmRename: false,
  });
  const { form, showNotePicker, isSaving, formError, confirmRename } =
    modalState;

  const markdownFiles = useMemo(() => {
    const linkedNotePaths = new Set(
      form.linkedNotes.map(normalizeSetupLinkedNotePath)
    );
    return plugin.app.vault
      .getMarkdownFiles()
      .filter(
        (file) => !linkedNotePaths.has(normalizeSetupLinkedNotePath(file.path))
      );
  }, [form.linkedNotes, plugin.app.vault]);

  const updateForm = <K extends keyof CreateSetupFormState>(
    key: K,
    value: CreateSetupFormState[K]
  ) =>
    setModalState((current) => ({
      ...current,
      form: { ...current.form, [key]: value },
    }));

  const handleAddLinkedNote = (file: TFile) => {
    setModalState((current) => {
      if (hasSetupLinkedNotePath(current.form.linkedNotes, file.path)) {
        return current;
      }
      return {
        ...current,
        form: {
          ...current.form,
          linkedNotes: [...current.form.linkedNotes, file.path],
        },
        showNotePicker: false,
      };
    });
  };

  const handleRemoveLinkedNote = (path: string) => {
    setModalState((current) => ({
      ...current,
      form: {
        ...current.form,
        linkedNotes: current.form.linkedNotes.filter(
          (notePath) => notePath !== path
        ),
      },
    }));
  };

  const handleCreate = async () => {
    const name = form.name.trim();
    if (!name) {
      setModalState((current) => ({
        ...current,
        formError: t('setups.create.error.name-required'),
      }));
      return;
    }
    if (setup && name !== setup.name && !confirmRename) {
      setModalState((current) => ({ ...current, confirmRename: true }));
      return;
    }

    setModalState((current) => ({
      ...current,
      isSaving: true,
      formError: null,
    }));
    try {
      const setupService = await plugin.serviceManager.getSetupService();
      const input: SetupData = {
        name,
        status: form.status,
        direction: form.direction || undefined,
        color: form.color,
        linkedNotes: form.linkedNotes,
      };
      const savedSetup = setup
        ? await setupService.updateSetup(setup.id, input)
        : await setupService.createSetup(input);
      new Notice(
        t(isEditMode ? 'setups.edit.success' : 'setups.create.success', {
          name: savedSetup.name,
        })
      );
      onSave(savedSetup);
      onModalClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t('setups.create.error.failed');
      setModalState((current) => ({ ...current, formError: message }));
      new Notice(
        t(
          isEditMode ? 'setups.edit.error.failed' : 'setups.create.error.failed'
        )
      );
    } finally {
      setModalState((current) => ({ ...current, isSaving: false }));
    }
  };

  const handleDelete = async () => {
    if (!setup) return;
    const confirmed = await showDeleteSetupConfirmation(plugin.app, setup.name);
    if (!confirmed) return;

    setModalState((current) => ({
      ...current,
      isSaving: true,
      formError: null,
    }));
    try {
      const setupService = await plugin.serviceManager.getSetupService();
      await setupService.deleteSetup(setup.id);
      new Notice(t('setups.edit.delete.success', { name: setup.name }));
      onDelete?.(setup);
      onModalClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('setups.edit.delete.error');
      setModalState((current) => ({ ...current, formError: message }));
      new Notice(t('setups.edit.delete.error'));
    } finally {
      setModalState((current) => ({ ...current, isSaving: false }));
    }
  };

  return (
    <div className="create-setup-form">
      <CreateSetupErrorMessage message={formError} />

      {confirmRename && setup ? (
        <CreateSetupRenameWarning
          message={t('setups.edit.rename-warning.message', {
            oldName: setup.name,
            newName: form.name.trim(),
          })}
        />
      ) : null}

      <CreateSetupFields
        form={form}
        isSaving={isSaving}
        onChange={updateForm}
      />

      <CreateSetupLinkedNotesField
        linkedNotes={form.linkedNotes}
        files={markdownFiles}
        showNotePicker={showNotePicker}
        isSaving={isSaving}
        onShowNotePicker={() =>
          setModalState((current) => ({ ...current, showNotePicker: true }))
        }
        onHideNotePicker={() =>
          setModalState((current) => ({ ...current, showNotePicker: false }))
        }
        onAddLinkedNote={handleAddLinkedNote}
        onRemoveLinkedNote={handleRemoveLinkedNote}
      />

      <CreateSetupModalActions
        confirmRename={confirmRename}
        isEditMode={isEditMode}
        isSaving={isSaving}
        onCancel={onModalClose}
        onDelete={() => void handleDelete()}
        onSave={() => void handleCreate()}
      />
    </div>
  );
};

CreateSetupModalContent.displayName = 'CreateSetupModalContent';

const CreateSetupFields: React.FC<{
  form: CreateSetupFormState;
  isSaving: boolean;
  onChange: <K extends keyof CreateSetupFormState>(
    key: K,
    value: CreateSetupFormState[K]
  ) => void;
}> = ({ form, isSaving, onChange }) => (
  <>
    <div className="setting-item create-setup-name-row">
      <div className="setting-item-info">
        <div className="setting-item-name">{t('setups.create.field.name')}</div>
      </div>
      <div className="setting-item-control">
        <input
          type="text"
          value={form.name}
          onChange={(event) => onChange('name', event.target.value)}
          placeholder={t('setups.create.placeholder.name')}
          disabled={isSaving}
        />
      </div>
    </div>

    <div className="setting-item two-column">
      <CreateSetupStatusField
        form={form}
        isSaving={isSaving}
        onChange={onChange}
      />
      <CreateSetupDirectionField
        form={form}
        isSaving={isSaving}
        onChange={onChange}
      />
    </div>
    <div className="create-setup-color-row">
      <div className="create-setup-color-row__info">
        <div className="create-setup-color-row__label">
          {t('setups.create.field.color')}
        </div>
        <div className="create-setup-color-row__description">
          {t('setups.create.field.color-description')}
        </div>
      </div>
      <LabelColorPicker
        value={form.color}
        onChange={(color) => onChange('color', color)}
        fallbackColor={DEFAULT_SETUP_PICKER_COLOR}
        showLabel={false}
        disabled={isSaving}
      />
    </div>
  </>
);

CreateSetupFields.displayName = 'CreateSetupFields';

const CreateSetupStatusField: React.FC<{
  form: CreateSetupFormState;
  isSaving: boolean;
  onChange: <K extends keyof CreateSetupFormState>(
    key: K,
    value: CreateSetupFormState[K]
  ) => void;
}> = ({ form, isSaving, onChange }) => (
  <div className="column">
    <div className="setting-item-info">
      <div className="setting-item-name">{t('setups.create.field.status')}</div>
    </div>
    <div className="setting-item-control">
      <select
        value={form.status}
        onChange={(event) =>
          onChange('status', parseCreateSetupStatus(event.target.value))
        }
        disabled={isSaving}
      >
        <option value="active">{t('setups.view.status.active')}</option>
        <option value="testing">{t('setups.view.status.testing')}</option>
        <option value="archived">{t('setups.view.status.archived')}</option>
      </select>
    </div>
  </div>
);

const CreateSetupDirectionField: React.FC<{
  form: CreateSetupFormState;
  isSaving: boolean;
  onChange: <K extends keyof CreateSetupFormState>(
    key: K,
    value: CreateSetupFormState[K]
  ) => void;
}> = ({ form, isSaving, onChange }) => (
  <div className="column">
    <div className="setting-item-info">
      <div className="setting-item-name">
        {t('setups.create.field.direction')}
      </div>
    </div>
    <div className="setting-item-control">
      <select
        value={form.direction}
        onChange={(event) =>
          onChange('direction', parseCreateSetupDirection(event.target.value))
        }
        disabled={isSaving}
      >
        <option value="">{t('setups.create.direction.any')}</option>
        <option value="long">{t('setups.create.direction.long')}</option>
        <option value="short">{t('setups.create.direction.short')}</option>
        <option value="both">{t('setups.create.direction.both')}</option>
      </select>
    </div>
  </div>
);

const CreateSetupModalActions: React.FC<{
  confirmRename: boolean;
  isEditMode: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onDelete: () => void;
  onSave: () => void;
}> = ({ confirmRename, isEditMode, isSaving, onCancel, onDelete, onSave }) => (
  <div className="journalit-modal-actions create-setup-buttons">
    {isEditMode ? (
      <Button
        variant="danger"
        onClick={onDelete}
        disabled={isSaving}
        className="journalit-delete-setup-button"
      >
        {t('setups.edit.delete.button')}
      </Button>
    ) : null}
    <Button
      variant="secondary"
      onClick={onCancel}
      disabled={isSaving}
      className="journalit-modal-actions__cancel cancel-button"
    >
      {t('button.cancel')}
    </Button>
    <Button
      variant="primary"
      onClick={onSave}
      disabled={isSaving}
      className="journalit-modal-actions__primary create-setup-button accent-button"
    >
      {isSaving
        ? t(
            isEditMode
              ? 'setups.edit.button.saving'
              : 'setups.create.button.creating'
          )
        : confirmRename
          ? t('setups.edit.button.rename-and-update')
          : t(
              isEditMode
                ? 'setups.edit.button.save'
                : 'setups.create.button.create'
            )}
    </Button>
  </div>
);

export function openCreateSetupModal(
  plugin: JournalitPlugin,
  onSave: (setup: Setup) => void,
  setup?: Setup,
  onDelete?: (setup: Setup) => void
): void {
  new CreateSetupModal({
    app: plugin.app,
    plugin,
    setup,
    onClose: () => {},
    onSave,
    onDelete,
  }).open();
}

export function openEditSetupModal(
  plugin: JournalitPlugin,
  setup: Setup,
  onSave: (setup: Setup) => void,
  onDelete?: (setup: Setup) => void
): void {
  openCreateSetupModal(plugin, onSave, setup, onDelete);
}
