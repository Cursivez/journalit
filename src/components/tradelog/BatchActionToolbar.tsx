

import React, { useState, useCallback, memo, useLayoutEffect } from 'react';
import { Notice, App } from 'obsidian';
import {
  CheckCircle2,
  Tag,
  FlaskConical,
  AlertTriangle,
  Copy,
  Trash2,
  CheckSquare,
  X,
} from '../shared/icons/ObsidianIcon';
import { ComboBox } from '../core/ComboBox';
import { createRoot, Root } from 'react-dom/client';
import JournalitPlugin from '../../main';
import { OptionType, type StoredOptionType } from '../../services/options';
import { useEventBus } from '../../hooks/useEventBus';
import { useSetupPicker } from '../../hooks/useSetupNotes';
import { t, tPlural } from '../../lang/helpers';
import { showConfirmationModal } from '../shared/ConfirmationModal';
import { JournalitModal } from '../modals/JournalitModal';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const readOptions = (
  plugin: JournalitPlugin,
  optionType: StoredOptionType,
  fallback: string[]
): string[] => plugin.optionsService?.getOptions(optionType) ?? fallback;

interface BatchActionToolbarProps {
  selectedCount: number;
  onMarkAsReviewed: () => Promise<void>;
  onAddSetups: (setupIds: string[]) => Promise<void>;
  onAddTags: (tags: string[]) => Promise<void>;
  onAddMistakes: (mistakes: string[]) => Promise<void>;
  onDuplicate: () => Promise<void>;
  onDelete: () => Promise<void>;
  onSelectAll: () => void;
  onClearSelection: () => void;
  tagOptions: string[];
  mistakeOptions: string[];
  app: App;
  plugin: JournalitPlugin;
}


interface SetupsModalContentProps {
  onConfirm: (selected: string[]) => Promise<void>;
  onClose: () => void;
  plugin: JournalitPlugin;
}

const SetupsModalContent: React.FC<SetupsModalContentProps> = ({
  onConfirm,
  onClose,
  plugin,
}) => {
  const [selectedSetups, setSelectedSetups] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setupPicker = useSetupPicker(plugin);

  const handleConfirm = async () => {
    if (selectedSetups.length === 0) return;
    setIsSubmitting(true);
    try {
      await onConfirm(selectedSetups);
      onClose();
    } catch (error) {
      console.error('Error adding setups:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="batch-action-modal-content">
      <div className="batch-action-modal-body">
        <ComboBox
          label={t('form.field.setup')}
          options={setupPicker.options}
          value={selectedSetups}
          onChange={(value) =>
            setSelectedSetups(
              setupPicker.filterSelection(selectedSetups, value)
            )
          }
          allowCreate={setupPicker.loaded}
          isMulti={true}
          placeholder={t('tradelog.batch.setups.placeholder')}
          onSaveOption={setupPicker.saveSetup}
        />
      </div>
      <div className="batch-action-modal-buttons">
        <button onClick={onClose} disabled={isSubmitting}>
          {t('button.cancel')}
        </button>
        <button
          onClick={() => void handleConfirm()}
          disabled={isSubmitting || selectedSetups.length === 0}
          className="primary"
        >
          {isSubmitting
            ? t('tradelog.batch.adding')
            : t('tradelog.batch.add-count', {
                count: selectedSetups.length.toString(),
              })}
        </button>
      </div>
    </div>
  );
};


class AddSetupsModal extends JournalitModal {
  private onConfirm: (setups: string[]) => Promise<void>;
  private onModalClose: () => void;
  private plugin: JournalitPlugin;
  private container: HTMLDivElement;
  private root: Root | null = null;

  constructor(
    app: App,
    onConfirm: (setups: string[]) => Promise<void>,
    onCancel: () => void,
    plugin: JournalitPlugin
  ) {
    super(app);
    this.titleEl.setText(t('tradelog.batch.setups.title'));
    this.onConfirm = onConfirm;
    this.onModalClose = onCancel;
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass('journalit-modal');

    
    contentEl.addClass('batch-action-modal');

    
    this.container = contentEl.createDiv({
      cls: 'batch-action-modal-container',
    });

    
    this.root = createRoot(this.container);
    this.root.render(
      <SetupsModalContent
        onConfirm={this.onConfirm}
        onClose={() => this.close()}
        plugin={this.plugin}
      />
    );
  }

  onClose() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.onModalClose();
  }
}

interface OptionsBatchModalContentProps {
  optionType: typeof OptionType.TAG | typeof OptionType.MISTAKE;
  initialOptions: string[];
  label: string;
  placeholder: string;
  
  errorLabel: string;
  onConfirm: (selected: string[]) => Promise<void>;
  onClose: () => void;
  onSaveOption: (option: string) => Promise<void>;
  plugin: JournalitPlugin;
}


const OptionsBatchModalContent: React.FC<OptionsBatchModalContentProps> = ({
  optionType,
  initialOptions,
  label,
  placeholder,
  errorLabel,
  onConfirm,
  onClose,
  onSaveOption,
  plugin,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState(() =>
    readOptions(plugin, optionType, initialOptions)
  );

  const loadOptions = useCallback(() => {
    setOptions(readOptions(plugin, optionType, initialOptions));
  }, [initialOptions, optionType, plugin]);

  useEventBus('options:changed', loadOptions);

  const handleConfirm = async () => {
    if (selected.length === 0) return;
    setIsSubmitting(true);
    try {
      await onConfirm(selected);
      onClose();
    } catch (error) {
      console.error(errorLabel, error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="batch-action-modal-content">
      <div className="batch-action-modal-body">
        <ComboBox
          label={label}
          options={options}
          value={selected}
          onChange={setSelected}
          allowCreate={true}
          isMulti={true}
          placeholder={placeholder}
          onSaveOption={onSaveOption}
        />
      </div>
      <div className="batch-action-modal-buttons">
        <button onClick={onClose} disabled={isSubmitting}>
          {t('button.cancel')}
        </button>
        <button
          onClick={() => void handleConfirm()}
          disabled={isSubmitting || selected.length === 0}
          className="primary"
        >
          {isSubmitting
            ? t('tradelog.batch.adding')
            : t('tradelog.batch.add-count', {
                count: selected.length.toString(),
              })}
        </button>
      </div>
    </div>
  );
};

class AddTagsModal extends JournalitModal {
  private tagOptions: string[];
  private onConfirm: (tags: string[]) => Promise<void>;
  private onModalClose: () => void;
  private onSaveOption: (option: string) => Promise<void>;
  private plugin: JournalitPlugin;
  private container: HTMLDivElement;
  private root: Root | null = null;

  constructor(
    app: App,
    tagOptions: string[],
    onConfirm: (tags: string[]) => Promise<void>,
    onCancel: () => void,
    onSaveOption: (option: string) => Promise<void>,
    plugin: JournalitPlugin
  ) {
    super(app);
    this.titleEl.setText(t('tradelog.batch.tags.title'));
    this.tagOptions = tagOptions;
    this.onConfirm = onConfirm;
    this.onModalClose = onCancel;
    this.onSaveOption = onSaveOption;
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass('journalit-modal');
    contentEl.addClass('batch-action-modal');
    this.container = contentEl.createDiv({
      cls: 'batch-action-modal-container',
    });
    this.root = createRoot(this.container);
    this.root.render(
      <OptionsBatchModalContent
        optionType={OptionType.TAG}
        initialOptions={this.tagOptions}
        label={t('form.field.tags')}
        placeholder={t('tradelog.batch.tags.placeholder')}
        errorLabel="Error adding tags:"
        onConfirm={this.onConfirm}
        onClose={() => this.close()}
        onSaveOption={this.onSaveOption}
        plugin={this.plugin}
      />
    );
  }

  onClose() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.onModalClose();
  }
}


class AddMistakesModal extends JournalitModal {
  private mistakeOptions: string[];
  private onConfirm: (mistakes: string[]) => Promise<void>;
  private onModalClose: () => void;
  private onSaveOption: (option: string) => Promise<void>;
  private plugin: JournalitPlugin;
  private container: HTMLDivElement;
  private root: Root | null = null;

  constructor(
    app: App,
    mistakeOptions: string[],
    onConfirm: (mistakes: string[]) => Promise<void>,
    onCancel: () => void,
    onSaveOption: (option: string) => Promise<void>,
    plugin: JournalitPlugin
  ) {
    super(app);
    this.titleEl.setText(t('tradelog.batch.mistakes.title'));
    this.mistakeOptions = mistakeOptions;
    this.onConfirm = onConfirm;
    this.onModalClose = onCancel;
    this.onSaveOption = onSaveOption;
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass('journalit-modal');

    
    contentEl.addClass('batch-action-modal');

    
    this.container = contentEl.createDiv({
      cls: 'batch-action-modal-container',
    });

    
    this.root = createRoot(this.container);
    this.root.render(
      <OptionsBatchModalContent
        optionType={OptionType.MISTAKE}
        initialOptions={this.mistakeOptions}
        label={t('form.field.mistake')}
        placeholder={t('tradelog.batch.mistakes.placeholder')}
        errorLabel="Error adding mistakes:"
        onConfirm={this.onConfirm}
        onClose={() => this.close()}
        onSaveOption={this.onSaveOption}
        plugin={this.plugin}
      />
    );
  }

  onClose() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.onModalClose();
  }
}


export const BatchActionToolbar = memo<BatchActionToolbarProps>(
  ({
    selectedCount,
    onMarkAsReviewed,
    onAddSetups,
    onAddTags,
    onAddMistakes,
    onDuplicate,
    onDelete,
    onSelectAll,
    onClearSelection,
    tagOptions,
    mistakeOptions,
    app,
    plugin,
  }) => {
    useLayoutEffect(() => {
      return () => {};
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    
    const handleSaveMistake = useCallback(
      async (option: string) => {
        try {
          const optionsService = plugin?.optionsService;
          if (optionsService) {
            const added = await optionsService.addOption(
              OptionType.MISTAKE,
              option
            );
            if (added) {
              optionsService.notifyOptionsChanged();
            }
          }
        } catch (error) {
          console.error('Failed to save mistake option:', error);
        }
      },
      [plugin]
    );

    const handleSaveTag = useCallback(
      async (option: string) => {
        try {
          const optionsService = plugin?.optionsService;
          if (optionsService) {
            const added = await optionsService.addOption(
              OptionType.TAG,
              option
            );
            if (added) {
              optionsService.notifyOptionsChanged();
            }
          }
        } catch (error) {
          console.error('Failed to save tag option:', error);
        }
      },
      [plugin]
    );

    
    const handleMarkAsReviewed = useCallback(async () => {
      try {
        setIsSubmitting(true);
        setLoadingAction('reviewed');
        await onMarkAsReviewed();
      } catch (error) {
        console.error('Error marking trades as reviewed:', error);
        new Notice(
          t('notice.error.mark-reviewed', { error: getErrorMessage(error) })
        );
      } finally {
        setIsSubmitting(false);
        setLoadingAction(null);
      }
    }, [onMarkAsReviewed]);

    
    const handleAddSetups = useCallback(() => {
      const modal = new AddSetupsModal(
        app,
        async (setups: string[]) => {
          try {
            setIsSubmitting(true);
            setLoadingAction('setups');
            await onAddSetups(setups);
          } catch (error) {
            console.error('Error adding setups:', error);
            new Notice(
              t('notice.error.add-setups', { error: getErrorMessage(error) })
            );
          } finally {
            setIsSubmitting(false);
            setLoadingAction(null);
          }
        },
        () => {
          // intentional
        },
        plugin
      );
      modal.open();
    }, [app, onAddSetups, plugin]);

    
    const handleAddMistakes = useCallback(() => {
      const modal = new AddMistakesModal(
        app,
        mistakeOptions,
        async (mistakes: string[]) => {
          try {
            setIsSubmitting(true);
            setLoadingAction('mistakes');
            await onAddMistakes(mistakes);
          } catch (error) {
            console.error('Error adding mistakes:', error);
            new Notice(
              t('notice.error.add-mistakes', { error: getErrorMessage(error) })
            );
          } finally {
            setIsSubmitting(false);
            setLoadingAction(null);
          }
        },
        () => {
          // intentional
        },
        handleSaveMistake,
        plugin
      );
      modal.open();
    }, [app, mistakeOptions, onAddMistakes, handleSaveMistake, plugin]);

    const handleAddTags = useCallback(() => {
      const modal = new AddTagsModal(
        app,
        tagOptions,
        async (tags: string[]) => {
          try {
            setIsSubmitting(true);
            setLoadingAction('tags');
            await onAddTags(tags);
          } catch (error) {
            console.error('Error adding tags:', error);
            new Notice(
              t('notice.error.add-tags', { error: getErrorMessage(error) })
            );
          } finally {
            setIsSubmitting(false);
            setLoadingAction(null);
          }
        },
        () => {
          // intentional
        },
        handleSaveTag,
        plugin
      );
      modal.open();
    }, [app, tagOptions, onAddTags, handleSaveTag, plugin]);

    
    const handleDuplicate = useCallback(async () => {
      try {
        setIsSubmitting(true);
        setLoadingAction('duplicate');
        await onDuplicate();
      } catch (error) {
        console.error('Error duplicating trades:', error);
        new Notice(
          t('notice.error.duplicate-trades', { error: getErrorMessage(error) })
        );
      } finally {
        setIsSubmitting(false);
        setLoadingAction(null);
      }
    }, [onDuplicate]);

    
    const handleDelete = useCallback(async () => {
      const confirmed = await showConfirmationModal(app, {
        title: t('tradelog.batch.delete-confirm.title'),
        message: [
          {
            text: tPlural(
              'tradelog.batch.delete-confirm.message',
              selectedCount
            ),
          },
          {
            text: t('tradelog.batch.delete-confirm.warning'),
            destructive: true,
          },
        ],
        confirmLabel: t('button.delete'),
        cancelLabel: t('button.cancel'),
        destructive: true,
      });
      if (!confirmed) return;

      try {
        setIsSubmitting(true);
        setLoadingAction('delete');
        await onDelete();
      } catch (error) {
        console.error('Error deleting trades:', error);
        new Notice(
          t('notice.error.delete-trades', { error: getErrorMessage(error) })
        );
      } finally {
        setIsSubmitting(false);
        setLoadingAction(null);
      }
    }, [app, selectedCount, onDelete]);

    return (
      <div className="batch-action-toolbar">
        <div className="batch-action-toolbar-left">
          <span className="batch-selection-count">
            {selectedCount === 0
              ? t('tradelog.batch.none-selected')
              : t('tradelog.batch.selected-count', {
                  count: selectedCount.toString(),
                })}
          </span>
          <button
            className="batch-action-select-all-btn"
            onClick={onSelectAll}
            disabled={loadingAction !== null}
            aria-label={t('tradelog.batch.select-all.title')}
          >
            <CheckSquare size={14} />
            <span className="select-all-label">
              {t('tradelog.batch.select-all.label')}
            </span>
          </button>
        </div>

        <div className="batch-action-toolbar-actions">
          <button
            className="batch-action-button"
            onClick={() => void handleMarkAsReviewed()}
            disabled={isSubmitting || selectedCount === 0}
            aria-label={t('button.mark-reviewed')}
          >
            <CheckCircle2 size={18} />
            {loadingAction === 'reviewed' ? (
              <span className="btn-label">
                {t('tradelog.batch.marking-reviewed')}
              </span>
            ) : (
              <span className="btn-label">{t('button.mark-reviewed')}</span>
            )}
          </button>

          <button
            className="batch-action-button"
            onClick={() => void handleAddTags()}
            disabled={isSubmitting || selectedCount === 0}
            aria-label={t('tradelog.batch.add-tags.aria')}
          >
            <Tag size={18} />
            {loadingAction === 'tags' ? (
              <span className="btn-label">{t('tradelog.batch.adding')}</span>
            ) : (
              <span className="btn-label">
                {t('tradelog.batch.add-tags.label')}
              </span>
            )}
          </button>

          <button
            className="batch-action-button"
            onClick={() => void handleAddSetups()}
            disabled={isSubmitting || selectedCount === 0}
            aria-label={t('tradelog.batch.add-setups.aria')}
          >
            <FlaskConical size={18} />
            {loadingAction === 'setups' ? (
              <span className="btn-label">{t('tradelog.batch.adding')}</span>
            ) : (
              <span className="btn-label">
                {t('tradelog.batch.add-setups.label')}
              </span>
            )}
          </button>

          <button
            className="batch-action-button"
            onClick={() => void handleAddMistakes()}
            disabled={isSubmitting || selectedCount === 0}
            aria-label={t('tradelog.batch.add-mistakes.aria')}
          >
            <AlertTriangle size={18} />
            {loadingAction === 'mistakes' ? (
              <span className="btn-label">{t('tradelog.batch.adding')}</span>
            ) : (
              <span className="btn-label">
                {t('tradelog.batch.add-mistakes.label')}
              </span>
            )}
          </button>

          <button
            className="batch-action-button journalit-batch-action-button"
            onClick={() => void handleDuplicate()}
            disabled={isSubmitting || selectedCount === 0}
            aria-label={t('tradelog.batch.duplicate.aria')}
          >
            <Copy size={18} />
            {loadingAction === 'duplicate' ? (
              <span className="btn-label">
                {t('tradelog.batch.duplicating')}
              </span>
            ) : (
              <span className="btn-label">
                {t('tradelog.batch.duplicate.label')}
              </span>
            )}
          </button>

          <button
            className="batch-action-button batch-action-delete danger"
            onClick={() => void handleDelete()}
            disabled={isSubmitting || selectedCount === 0}
            aria-label={t('tradelog.batch.delete.aria')}
          >
            <Trash2 size={18} />
            {loadingAction === 'delete' ? (
              <span className="btn-label">{t('tradelog.batch.deleting')}</span>
            ) : (
              <span className="btn-label">{t('button.delete')}</span>
            )}
          </button>

          <button
            className="batch-action-button batch-action-clear"
            onClick={onClearSelection}
            disabled={isSubmitting || selectedCount === 0}
            aria-label={t('tradelog.batch.clear.aria')}
          >
            <X size={18} />
            <span className="btn-label">{t('tradelog.batch.clear.label')}</span>
          </button>
        </div>
      </div>
    );
  }
);

BatchActionToolbar.displayName = 'BatchActionToolbar';
