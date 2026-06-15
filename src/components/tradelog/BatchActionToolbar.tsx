

import React, {
  useState,
  useCallback,
  memo,
  useLayoutEffect,
  useEffect,
} from 'react';
import { Notice, Modal, App } from 'obsidian';
import {
  CheckCircle2,
  Tag,
  FlaskConical,
  AlertTriangle,
  Trash2,
  CheckSquare,
  X,
} from '../shared/icons/ObsidianIcon';
import { ComboBox } from '../core/ComboBox';
import { createRoot, Root } from 'react-dom/client';
import JournalitPlugin from '../../main';
import { OptionType } from '../../services/options';
import { useEventBus } from '../../hooks/useEventBus';
import { t, tPlural } from '../../lang/helpers';

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

interface BatchActionToolbarProps {
  selectedCount: number;
  onMarkAsReviewed: () => Promise<void>;
  onAddSetups: (setupIds: string[]) => Promise<void>;
  onAddTags: (tags: string[]) => Promise<void>;
  onAddMistakes: (mistakes: string[]) => Promise<void>;
  onDelete: () => Promise<void>;
  onSelectAll: () => void;
  onClearSelection: () => void;
  setupOptions: string[];
  tagOptions: string[];
  mistakeOptions: string[];
  app: App;
  plugin: JournalitPlugin;
}


class DeleteConfirmationModal extends Modal {
  private onConfirm: () => void | Promise<void>;
  private onCancel: () => void;
  private count: number;

  constructor(
    app: App,
    count: number,
    onConfirm: () => void | Promise<void>,
    onCancel: () => void
  ) {
    super(app);
    this.titleEl.setText(t('tradelog.batch.delete-confirm.title'));
    this.count = count;
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('p', {
      text: tPlural('tradelog.batch.delete-confirm.message', this.count),
    });
    contentEl.createEl('p', {
      text: t('tradelog.batch.delete-confirm.warning'),
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    const cancelButton = buttonContainer.createEl('button', {
      text: t('button.cancel'),
    });
    cancelButton.onclick = () => {
      this.onCancel();
      this.close();
    };

    const deleteButton = buttonContainer.createEl('button', {
      text: t('button.delete'),
      cls: 'mod-warning',
    });
    deleteButton.onclick = () => {
      void this.onConfirm();
      this.close();
    };
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}


interface SetupsModalContentProps {
  setupOptions: string[];
  onConfirm: (selected: string[]) => Promise<void>;
  onClose: () => void;
  onSaveOption: (option: string) => Promise<void>;
  plugin: JournalitPlugin;
}

const SetupsModalContent: React.FC<SetupsModalContentProps> = ({
  setupOptions: initialSetupOptions,
  onConfirm,
  onClose,
  onSaveOption,
  plugin,
}) => {
  const [selectedSetups, setSelectedSetups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [setupOptions, setSetupOptions] =
    useState<string[]>(initialSetupOptions);

  const loadSetupOptions = useCallback(() => {
    if (plugin.optionsService) {
      const options = plugin.optionsService.getOptions(OptionType.SETUP);
      setSetupOptions(options);
    }
  }, [plugin.optionsService]);

  
  useEffect(() => {
    loadSetupOptions();
  }, [loadSetupOptions]);

  
  useEventBus('options:changed', loadSetupOptions);

  const handleConfirm = async () => {
    if (selectedSetups.length === 0) return;
    setIsLoading(true);
    try {
      await onConfirm(selectedSetups);
      onClose();
    } catch (error) {
      console.error('Error adding setups:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="batch-action-modal-content">
      <div className="batch-action-modal-body">
        <ComboBox
          label={t('form.field.setup')}
          options={setupOptions}
          value={selectedSetups}
          onChange={(value) => setSelectedSetups(asStringArray(value))}
          allowCreate={true}
          isMulti={true}
          placeholder={t('tradelog.batch.setups.placeholder')}
          onSaveOption={onSaveOption}
          optionType={OptionType.SETUP}
        />
      </div>
      <div className="batch-action-modal-buttons">
        <button onClick={onClose} disabled={isLoading}>
          {t('button.cancel')}
        </button>
        <button
          onClick={() => void handleConfirm()}
          disabled={isLoading || selectedSetups.length === 0}
          className="primary"
        >
          {isLoading
            ? t('tradelog.batch.adding')
            : t('tradelog.batch.add-count', {
                count: selectedSetups.length.toString(),
              })}
        </button>
      </div>
    </div>
  );
};


class AddSetupsModal extends Modal {
  private setupOptions: string[];
  private onConfirm: (setups: string[]) => Promise<void>;
  private onModalClose: () => void;
  private onSaveOption: (option: string) => Promise<void>;
  private plugin: JournalitPlugin;
  private container: HTMLDivElement;
  private root: Root | null = null;

  constructor(
    app: App,
    setupOptions: string[],
    onConfirm: (setups: string[]) => Promise<void>,
    onCancel: () => void,
    onSaveOption: (option: string) => Promise<void>,
    plugin: JournalitPlugin
  ) {
    super(app);
    this.titleEl.setText(t('tradelog.batch.setups.title'));
    this.setupOptions = setupOptions;
    this.onConfirm = onConfirm;
    this.onModalClose = onCancel;
    this.onSaveOption = onSaveOption;
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    
    contentEl.addClass('batch-action-modal');

    
    this.container = contentEl.createDiv({
      cls: 'batch-action-modal-container',
    });

    
    this.root = createRoot(this.container);
    this.root.render(
      <SetupsModalContent
        setupOptions={this.setupOptions}
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

interface TagsModalContentProps {
  tagOptions: string[];
  onConfirm: (selected: string[]) => Promise<void>;
  onClose: () => void;
  onSaveOption: (option: string) => Promise<void>;
  plugin: JournalitPlugin;
}

const TagsModalContent: React.FC<TagsModalContentProps> = ({
  tagOptions: initialTagOptions,
  onConfirm,
  onClose,
  onSaveOption,
  plugin,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tagOptions, setTagOptions] = useState<string[]>(initialTagOptions);

  const loadTagOptions = useCallback(() => {
    if (plugin.optionsService) {
      setTagOptions(plugin.optionsService.getOptions(OptionType.TAG));
    }
  }, [plugin.optionsService]);

  useEffect(() => {
    loadTagOptions();
  }, [loadTagOptions]);

  useEventBus('options:changed', loadTagOptions);

  const handleConfirm = async () => {
    if (selectedTags.length === 0) return;
    setIsLoading(true);
    try {
      await onConfirm(selectedTags);
      onClose();
    } catch (error) {
      console.error('Error adding tags:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="batch-action-modal-content">
      <div className="batch-action-modal-body">
        <ComboBox
          label={t('form.field.custom-tags')}
          options={tagOptions}
          value={selectedTags}
          onChange={(value) => setSelectedTags(asStringArray(value))}
          allowCreate={true}
          isMulti={true}
          placeholder={t('tradelog.batch.tags.placeholder')}
          onSaveOption={onSaveOption}
          optionType={OptionType.TAG}
        />
      </div>
      <div className="batch-action-modal-buttons">
        <button onClick={onClose} disabled={isLoading}>
          {t('button.cancel')}
        </button>
        <button
          onClick={() => void handleConfirm()}
          disabled={isLoading || selectedTags.length === 0}
          className="primary"
        >
          {isLoading
            ? t('tradelog.batch.adding')
            : t('tradelog.batch.add-count', {
                count: selectedTags.length.toString(),
              })}
        </button>
      </div>
    </div>
  );
};

class AddTagsModal extends Modal {
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
    contentEl.addClass('batch-action-modal');
    this.container = contentEl.createDiv({
      cls: 'batch-action-modal-container',
    });
    this.root = createRoot(this.container);
    this.root.render(
      <TagsModalContent
        tagOptions={this.tagOptions}
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


interface MistakesModalContentProps {
  mistakeOptions: string[];
  onConfirm: (selected: string[]) => Promise<void>;
  onClose: () => void;
  onSaveOption: (option: string) => Promise<void>;
  plugin: JournalitPlugin;
}

const MistakesModalContent: React.FC<MistakesModalContentProps> = ({
  mistakeOptions: initialMistakeOptions,
  onConfirm,
  onClose,
  onSaveOption,
  plugin,
}) => {
  const [selectedMistakes, setSelectedMistakes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mistakeOptions, setMistakeOptions] = useState<string[]>(
    initialMistakeOptions
  );

  const loadMistakeOptions = useCallback(() => {
    if (plugin.optionsService) {
      const options = plugin.optionsService.getOptions(OptionType.MISTAKE);
      setMistakeOptions(options);
    }
  }, [plugin.optionsService]);

  
  useEffect(() => {
    loadMistakeOptions();
  }, [loadMistakeOptions]);

  
  useEventBus('options:changed', loadMistakeOptions);

  const handleConfirm = async () => {
    if (selectedMistakes.length === 0) return;
    setIsLoading(true);
    try {
      await onConfirm(selectedMistakes);
      onClose();
    } catch (error) {
      console.error('Error adding mistakes:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="batch-action-modal-content">
      <div className="batch-action-modal-body">
        <ComboBox
          label={t('form.field.mistake')}
          options={mistakeOptions}
          value={selectedMistakes}
          onChange={(value) => setSelectedMistakes(asStringArray(value))}
          allowCreate={true}
          isMulti={true}
          placeholder={t('tradelog.batch.mistakes.placeholder')}
          onSaveOption={onSaveOption}
          optionType={OptionType.MISTAKE}
        />
      </div>
      <div className="batch-action-modal-buttons">
        <button onClick={onClose} disabled={isLoading}>
          {t('button.cancel')}
        </button>
        <button
          onClick={() => void handleConfirm()}
          disabled={isLoading || selectedMistakes.length === 0}
          className="primary"
        >
          {isLoading
            ? t('tradelog.batch.adding')
            : t('tradelog.batch.add-count', {
                count: selectedMistakes.length.toString(),
              })}
        </button>
      </div>
    </div>
  );
};


class AddMistakesModal extends Modal {
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

    
    contentEl.addClass('batch-action-modal');

    
    this.container = contentEl.createDiv({
      cls: 'batch-action-modal-container',
    });

    
    this.root = createRoot(this.container);
    this.root.render(
      <MistakesModalContent
        mistakeOptions={this.mistakeOptions}
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
    onDelete,
    onSelectAll,
    onClearSelection,
    setupOptions,
    tagOptions,
    mistakeOptions,
    app,
    plugin,
  }) => {
    useLayoutEffect(() => {
      return () => {};
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    
    const handleSaveSetup = useCallback(
      async (option: string) => {
        try {
          const optionsService = plugin?.optionsService;
          if (optionsService) {
            const added = await optionsService.addOption(
              OptionType.SETUP,
              option
            );
            if (added) {
              optionsService.notifyOptionsChanged();
            }
          }
        } catch (error) {
          console.error('Failed to save setup option:', error);
        }
      },
      [plugin]
    );

    
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
        setIsLoading(true);
        setLoadingAction('reviewed');
        await onMarkAsReviewed();
      } catch (error) {
        console.error('Error marking trades as reviewed:', error);
        new Notice(
          t('notice.error.mark-reviewed', { error: getErrorMessage(error) })
        );
      } finally {
        setIsLoading(false);
        setLoadingAction(null);
      }
    }, [onMarkAsReviewed]);

    
    const handleAddSetups = useCallback(() => {
      const modal = new AddSetupsModal(
        app,
        setupOptions,
        async (setups: string[]) => {
          try {
            setIsLoading(true);
            setLoadingAction('setups');
            await onAddSetups(setups);
          } catch (error) {
            console.error('Error adding setups:', error);
            new Notice(
              t('notice.error.add-setups', { error: getErrorMessage(error) })
            );
          } finally {
            setIsLoading(false);
            setLoadingAction(null);
          }
        },
        () => {
          // intentional
        },
        handleSaveSetup,
        plugin
      );
      modal.open();
    }, [app, setupOptions, onAddSetups, handleSaveSetup, plugin]);

    
    const handleAddMistakes = useCallback(() => {
      const modal = new AddMistakesModal(
        app,
        mistakeOptions,
        async (mistakes: string[]) => {
          try {
            setIsLoading(true);
            setLoadingAction('mistakes');
            await onAddMistakes(mistakes);
          } catch (error) {
            console.error('Error adding mistakes:', error);
            new Notice(
              t('notice.error.add-mistakes', { error: getErrorMessage(error) })
            );
          } finally {
            setIsLoading(false);
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
            setIsLoading(true);
            setLoadingAction('tags');
            await onAddTags(tags);
          } catch (error) {
            console.error('Error adding tags:', error);
            new Notice(
              t('notice.error.add-tags', { error: getErrorMessage(error) })
            );
          } finally {
            setIsLoading(false);
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

    
    const handleDelete = useCallback(() => {
      const modal = new DeleteConfirmationModal(
        app,
        selectedCount,
        async () => {
          try {
            setIsLoading(true);
            setLoadingAction('delete');
            await onDelete();
          } catch (error) {
            console.error('Error deleting trades:', error);
            new Notice(
              t('notice.error.delete-trades', { error: getErrorMessage(error) })
            );
          } finally {
            setIsLoading(false);
            setLoadingAction(null);
          }
        },
        () => {
          // intentional
        }
      );
      modal.open();
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
            disabled={isLoading || selectedCount === 0}
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
            disabled={isLoading || selectedCount === 0}
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
            disabled={isLoading || selectedCount === 0}
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
            disabled={isLoading || selectedCount === 0}
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
            className="batch-action-button batch-action-delete danger"
            onClick={() => void handleDelete()}
            disabled={isLoading || selectedCount === 0}
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
            disabled={isLoading || selectedCount === 0}
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
