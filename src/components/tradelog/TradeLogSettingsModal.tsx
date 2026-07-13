

import { App, Modal, Notice } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import {
  registerExternalGuideTarget,
  useGuideAction,
} from '../../guides/GuideRuntimeLayer';
import {
  TRADE_LOG_AVAILABLE_COLUMNS_OPENED_ACTION_ID,
  TRADE_LOG_COLUMN_SETTINGS_MODAL_TARGET_ID,
} from '../../guides/tradeLogGuideIds';
import {
  buildTradeLogColumnDefinitions,
  COLUMN_CATEGORIES,
  ColumnDefinition,
  getColumnCategoryLabel,
  getColumnLabel,
  resolveTradeLogSettings,
} from './columnConfig';
import { CustomTradeLogColumnId, TradeLogColumnId } from '../../settings/types';
import {
  VisibilityEditor,
  VisibilityEditorCategory,
  VisibilityEditorItem,
} from '../shared/visibilityEditor';
import { eventBus } from '../../services/events';
import ToggleSwitch from '../ui/ToggleSwitch';

interface TradeLogSettingsModalProps {
  app: App;
  plugin: JournalitPlugin;
  onSave: () => void;
  onClose: () => void;
}


class UnsavedChangesConfirmationModal extends Modal {
  private resolved = false;

  constructor(
    app: App,
    private onConfirm: (shouldClose: boolean) => void
  ) {
    super(app);
    this.titleEl.setText(t('form.modal.unsaved-changes.title'));
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('p', {
      text: t('tradelog.settings.modal.unsaved-changes.body1'),
    });
    contentEl.createEl('p', {
      text: t('tradelog.settings.modal.unsaved-changes.body2'),
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    
    buttonContainer
      .createEl('button', {
        type: 'button',
        text: t('form.modal.unsaved-changes.continue'),
        cls: 'mod-cta',
      })
      .addEventListener('click', () => {
        if (!this.resolved) {
          this.resolved = true;
          this.onConfirm(false); 
        }
        this.close();
      });

    
    buttonContainer
      .createEl('button', {
        type: 'button',
        text: t('form.modal.unsaved-changes.discard'),
        cls: 'mod-warning',
      })
      .addEventListener('click', () => {
        if (!this.resolved) {
          this.resolved = true;
          this.onConfirm(true); 
        }
        this.close();
      });
  }

  close(): void {
    super.close();
    if (!this.resolved) {
      this.resolved = true;
      this.onConfirm(false);
    }
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}


export class TradeLogSettingsModal extends Modal {
  private props: TradeLogSettingsModalProps;
  private container!: HTMLDivElement;
  private root: Root | null = null;
  private checkForUnsavedChanges: (() => boolean) | null = null;
  private isConfirming = false;
  private confirmationModal: UnsavedChangesConfirmationModal | null = null;
  private shouldBypassUnsavedCheck = false;

  constructor(props: TradeLogSettingsModalProps) {
    super(props.app);
    this.props = props;
  }

  
  setUnsavedChangesChecker(checker: () => boolean) {
    this.checkForUnsavedChanges = checker;
  }

  
  closeAfterSave() {
    this.closeWithoutUnsavedChangesCheck();
  }

  closeWithoutUnsavedChangesCheck() {
    this.shouldBypassUnsavedCheck = true;
    this.close();
  }

  
  close(): void {
    
    if (this.isConfirming) return;

    
    if (this.shouldBypassUnsavedCheck) {
      this.shouldBypassUnsavedCheck = false;
      super.close();
      return;
    }

    
    if (this.checkForUnsavedChanges && this.checkForUnsavedChanges()) {
      this.isConfirming = true;
      void this.showUnsavedChangesConfirmation()
        .then((shouldClose) => {
          if (shouldClose) super.close();
        })
        .finally(() => {
          this.isConfirming = false;
          this.confirmationModal = null;
        });
    } else {
      super.close();
    }
  }

  private showUnsavedChangesConfirmation(): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationModal = new UnsavedChangesConfirmationModal(
        this.app,
        (shouldClose) => resolve(shouldClose)
      );
      this.confirmationModal.open();
    });
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    
    contentEl.addClass('tradelog-settings-modal');

    
    registerExternalGuideTarget(
      TRADE_LOG_COLUMN_SETTINGS_MODAL_TARGET_ID,
      this.modalEl
    );

    
    this.container = contentEl.createDiv();

    
    this.renderComponent();
  }

  onClose() {
    registerExternalGuideTarget(
      TRADE_LOG_COLUMN_SETTINGS_MODAL_TARGET_ID,
      null
    );

    
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }

    

    this.props.onClose();
  }

  private renderComponent() {
    this.root = createRoot(this.container);
    this.root.render(
      <TradeLogSettingsModalContent
        {...this.props}
        modalInstance={this}
        onModalClose={() => this.close()}
      />
    );
  }
}


interface ColumnWithVisibility extends ColumnDefinition {
  visible: boolean;
}

type PanelTab = 'active' | 'available';


interface InitialState {
  columns: ColumnWithVisibility[];
  expandedMode: boolean;
}

function parseTradeLogColumnId(value: string): TradeLogColumnId | null {
  if (value.startsWith('cf:')) {
    const customId: CustomTradeLogColumnId = `cf:${value.slice(3)}`;
    return customId;
  }

  switch (value) {
    case 'select':
    case 'image':
    case 'account':
    case 'ticker':
    case 'exchange':
    case 'status':
    case 'direction':
    case 'date':
    case 'entryTime':
    case 'exitDate':
    case 'exitTime':
    case 'duration':
    case 'expirationDate':
    case 'daysToExpiry':
    case 'entryPrice':
    case 'exitPrice':
    case 'priceMove':
    case 'stopLoss':
    case 'slDistanceDollar':
    case 'slDistancePercent':
    case 'riskAmount':
    case 'rMultiple':
    case 'maxR':
    case 'positionSize':
    case 'positionValue':
    case 'fees':
    case 'dividends':
    case 'pnl':
    case 'returnPercent':
    case 'setups':
    case 'mistakes':
    case 'tags':
    case 'reviewed':
    case 'thesis':
    case 'mtComment':
      return value;
    default:
      return null;
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function buildColumnsWithVisibility(
  plugin: JournalitPlugin,
  tradeLogState?: {
    columnVisibility?: Partial<Record<TradeLogColumnId, boolean>>;
    columnOrder?: TradeLogColumnId[];
    columnWidths?: Partial<Record<TradeLogColumnId, number>>;
    expandedMode?: boolean;
  }
): ColumnWithVisibility[] {
  const customFields = plugin.customFieldsService?.getFields() || [];
  const resolvedTradeLogState = resolveTradeLogSettings(
    tradeLogState,
    customFields
  );
  const columnVisibility = resolvedTradeLogState.columnVisibility;
  const columnOrder = resolvedTradeLogState.columnOrder;
  const allColumns = buildTradeLogColumnDefinitions(customFields);

  const columnsWithVisibility: ColumnWithVisibility[] = [];
  for (const col of allColumns) {
    if (col.id === 'select') {
      continue;
    }

    columnsWithVisibility.push({
      ...col,
      visible: (() => {
        const columnId = parseTradeLogColumnId(col.id);
        return columnId
          ? (columnVisibility[columnId] ?? col.defaultVisible)
          : col.defaultVisible;
      })(),
    });
  }

  if (columnOrder.length > 0) {
    const ordered: ColumnWithVisibility[] = [];
    const columnsById = new Map(
      columnsWithVisibility.map((column) => [column.id, column])
    );
    for (const id of columnOrder) {
      const column = columnsById.get(id);
      if (column) {
        ordered.push(column);
      }
    }
    const orderedIds = new Set(columnOrder);

    const remaining = columnsWithVisibility.filter((col) => {
      const columnId = parseTradeLogColumnId(col.id);
      return !columnId || !orderedIds.has(columnId);
    });

    return [...ordered, ...remaining];
  }

  return columnsWithVisibility;
}


function useTradeLogSettingsModalModel({
  plugin,
  onSave,
  modalInstance,
}: {
  plugin: JournalitPlugin;
  onSave: () => void;
  modalInstance: TradeLogSettingsModal;
}) {
  const emitGuideAction = useGuideAction();
  const [columns, setColumns] = useState<ColumnWithVisibility[]>(() => {
    return buildColumnsWithVisibility(
      plugin,
      plugin.uiStateManager.getState().tradeLog
    );
  });

  const [activeTab, setActiveTab] = useState<PanelTab>('active');
  const lastActiveTabRef = useRef<PanelTab>('active');
  const [isSaving, setIsSaving] = useState(false);
  const [guideVersion, setGuideVersion] = useState(0);
  const [expandedMode, setExpandedMode] = useState<boolean>(() => {
    return (
      resolveTradeLogSettings(
        plugin.uiStateManager.getState().tradeLog,
        plugin.customFieldsService?.getFields() || []
      ).expandedMode ?? false
    );
  });

  
  const initialStateRef = useRef<InitialState>({
    columns: columns.map((col) => ({ ...col })),
    expandedMode,
  });

  useEffect(() => {
    const handleCustomFieldsChanged = () => {
      const persistedTradeLogSettings = resolveTradeLogSettings(
        plugin.uiStateManager.getState().tradeLog,
        plugin.customFieldsService?.getFields() || []
      );

      initialStateRef.current = {
        columns: buildColumnsWithVisibility(plugin, persistedTradeLogSettings),
        expandedMode: persistedTradeLogSettings.expandedMode ?? false,
      };

      setColumns((prevColumns) => {
        const columnVisibility: Partial<Record<TradeLogColumnId, boolean>> = {};
        const columnOrder: TradeLogColumnId[] = [];
        for (const column of prevColumns) {
          const columnId = parseTradeLogColumnId(column.id);
          if (!columnId) continue;
          columnVisibility[columnId] = column.visible;
          columnOrder.push(columnId);
        }

        return buildColumnsWithVisibility(plugin, {
          columnVisibility,
          columnOrder,
          expandedMode,
        });
      });
    };

    plugin.app.workspace.on(
      'journalit-custom-fields-changed',
      handleCustomFieldsChanged
    );

    return () => {
      plugin.app.workspace.off(
        'journalit-custom-fields-changed',
        handleCustomFieldsChanged
      );
    };
  }, [expandedMode, plugin]);

  useEffect(() => {
    if (lastActiveTabRef.current !== 'available' && activeTab === 'available') {
      emitGuideAction(TRADE_LOG_AVAILABLE_COLUMNS_OPENED_ACTION_ID);
    }
    lastActiveTabRef.current = activeTab;
  }, [activeTab, emitGuideAction]);

  useEffect(() => {
    const guideService = plugin.viewGuideService;
    if (!guideService) {
      return;
    }

    return guideService.subscribe(() => {
      setGuideVersion((prev) => prev + 1);
    });
  }, [plugin]);

  useEffect(() => {
    void guideVersion;

    const guideService = plugin.viewGuideService;
    if (!guideService) {
      return;
    }

    const activeLeaf = guideService.getActiveLeaf();
    if (!activeLeaf) {
      return;
    }

    const session = guideService.getSessionForLeaf(
      activeLeaf,
      'journalit-trade-log-view'
    );
    if (!session || session.guideId !== 'tradelog.main') {
      return;
    }

    if (session.currentStepId === 'active-columns' && activeTab !== 'active') {
      setActiveTab('active');
      return;
    }

    if (
      session.currentStepId === 'available-columns' &&
      activeTab !== 'available'
    ) {
      setActiveTab('available');
      return;
    }

    if (session.currentStepId === 'open-trades') {
      modalInstance.close();
    }
  }, [activeTab, guideVersion, modalInstance, plugin]);

  
  
  
  const isDirty = useCallback((): boolean => {
    const initial = initialStateRef.current;

    
    if (expandedMode !== initial.expandedMode) return true;

    
    const currentVisible = columns.filter((c) => c.visible);
    const initialVisible = initial.columns.filter((c) => c.visible);

    if (currentVisible.length !== initialVisible.length) return true;

    for (let i = 0; i < currentVisible.length; i++) {
      if (currentVisible[i].id !== initialVisible[i].id) return true;
    }

    return false;
  }, [columns, expandedMode]);

  
  useEffect(() => {
    modalInstance.setUnsavedChangesChecker(isDirty);
  }, [modalInstance, isDirty]);

  
  const activeColumns = useMemo(
    () => columns.filter((col) => col.visible),
    [columns]
  );
  const availableColumns = useMemo(
    () => columns.filter((col) => !col.visible),
    [columns]
  );

  
  const handleReorderColumn = useCallback(
    (activeId: string, overId: string) => {
      if (activeId === overId) {
        return;
      }

      setColumns((prevColumns) => {
        const visibleColumns = prevColumns.filter((col) => col.visible);
        const hiddenColumns = prevColumns.filter((col) => !col.visible);

        const oldIndex = visibleColumns.findIndex((col) => col.id === activeId);
        const newIndex = visibleColumns.findIndex((col) => col.id === overId);

        if (oldIndex === -1 || newIndex === -1) {
          return prevColumns;
        }

        
        const newVisibleColumns = [...visibleColumns];
        const [movedItem] = newVisibleColumns.splice(oldIndex, 1);
        newVisibleColumns.splice(newIndex, 0, movedItem);

        
        return [...newVisibleColumns, ...hiddenColumns];
      });
    },
    []
  );

  
  const handleAddColumn = useCallback((columnId: string) => {
    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((col) =>
        col.id === columnId ? { ...col, visible: true } : col
      );
      
      const visible = updatedColumns.filter((col) => col.visible);
      const hidden = updatedColumns.filter((col) => !col.visible);
      const addedCol = visible.find((col) => col.id === columnId);
      const restVisible = visible.filter((col) => col.id !== columnId);
      return addedCol ? [...restVisible, addedCol, ...hidden] : updatedColumns;
    });
  }, []);

  
  const handleRemoveColumn = useCallback((columnId: string) => {
    setColumns((prevColumns) => {
      const visibleCount = prevColumns.filter((col) => col.visible).length;
      if (visibleCount <= 1) {
        new Notice(t('notice.error.column-required'));
        return prevColumns;
      }
      return prevColumns.map((col) =>
        col.id === columnId ? { ...col, visible: false } : col
      );
    });
  }, []);

  
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);

      
      const columnVisibility: Partial<Record<TradeLogColumnId, boolean>> = {};
      const columnOrder: TradeLogColumnId[] = [];

      columns.forEach((col) => {
        const columnId = parseTradeLogColumnId(col.id);
        if (!columnId) return;
        columnVisibility[columnId] = col.visible;
        columnOrder.push(columnId);
      });

      
      
      const currentTradeLog = plugin.uiStateManager.getState().tradeLog;
      plugin.uiStateManager
        .updateState({
          tradeLog: {
            columnVisibility,
            columnOrder,
            columnWidths: currentTradeLog?.columnWidths || {},
            expandedMode,
          },
        })
        .catch((error) => {
          console.error('Failed to persist UI state:', error);
        });

      
      eventBus.publish('settings:changed', {
        component: 'tradeLog',
        settings: plugin.settings.tradeLog,
      });

      new Notice(t('notice.tradelog-saved'));

      
      onSave();

      
      modalInstance.closeAfterSave();
    } catch (error) {
      console.error('Error saving TradeLog settings:', error);
      new Notice(
        t('notice.error.save-settings', { error: getErrorMessage(error) })
      );
    } finally {
      setIsSaving(false);
    }
  }, [columns, expandedMode, plugin, onSave, modalInstance]);

  
  const handleCancel = useCallback(() => {
    modalInstance.close();
  }, [modalInstance]);

  
  const handleReset = useCallback(() => {
    const defaultTradeLogSettings = resolveTradeLogSettings(
      undefined,
      plugin.customFieldsService?.getFields() || []
    );

    setColumns(buildColumnsWithVisibility(plugin, defaultTradeLogSettings));
    setExpandedMode(defaultTradeLogSettings.expandedMode ?? false);
  }, [plugin]);

  return {
    activeTab,
    setActiveTab,
    isSaving,
    expandedMode,
    setExpandedMode,
    activeColumns,
    availableColumns,
    handleReorderColumn,
    handleAddColumn,
    handleRemoveColumn,
    handleSave,
    handleCancel,
    handleReset,
  };
}

const TradeLogSettingsModalContent: React.FC<
  TradeLogSettingsModalProps & {
    modalInstance: TradeLogSettingsModal;
    onModalClose: () => void;
  }
> = ({
  app: _app,
  plugin,
  onSave,
  modalInstance,
  onModalClose: _onModalClose,
}) => {
  const {
    activeTab,
    setActiveTab,
    isSaving,
    expandedMode,
    setExpandedMode,
    activeColumns,
    availableColumns,
    handleReorderColumn,
    handleAddColumn,
    handleRemoveColumn,
    handleSave,
    handleCancel,
    handleReset,
  } = useTradeLogSettingsModalModel({ plugin, onSave, modalInstance });

  const editorCategories: VisibilityEditorCategory[] = COLUMN_CATEGORIES.map(
    (category) => ({
      id: category.id,
      label: getColumnCategoryLabel(category.id),
    })
  );
  const toEditorItem = (
    column: ColumnWithVisibility
  ): VisibilityEditorItem => ({
    id: column.id,
    label: getColumnLabel(column),
    category: column.category,
  });

  return (
    <div className="tradelog-settings-modal-container">
      <div className="tradelog-settings-modal-body">
        <VisibilityEditor
          activeItems={activeColumns.map(toEditorItem)}
          availableItems={availableColumns.map(toEditorItem)}
          categories={editorCategories}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          activeTabLabel={t('tradelog.settings.active-columns')}
          availableTabLabel={t('tradelog.settings.available-columns')}
          activeDescription={t('tradelog.settings.active-desc')}
          availableDescription={t('tradelog.settings.available-desc')}
          emptyActiveText={t('tradelog.settings.no-active')}
          emptyAvailableText={t('tradelog.settings.all-active')}
          getAddAriaLabel={(label) => `Add ${label} column`}
          getRemoveAriaLabel={(label) => `Remove ${label} column`}
          onReorder={handleReorderColumn}
          onAdd={handleAddColumn}
          onRemove={handleRemoveColumn}
          canRemoveItem={() => activeColumns.length > 1}
        />

        
        <div className="tradelog-settings-display-mode">
          <div className="display-mode-label">
            <span className="display-mode-title">
              {t('tradelog.settings.expanded-view')}
            </span>
            <span className="display-mode-description">
              {t('tradelog.settings.expanded-view-desc')}
            </span>
          </div>
          <ToggleSwitch
            checked={expandedMode}
            onChange={setExpandedMode}
            ariaLabel={t('tradelog.settings.expanded-view-aria')}
          />
        </div>
      </div>

      
      <div className="tradelog-settings-modal-buttons">
        <button
          onClick={() => void handleReset()}
          disabled={isSaving}
          className="reset-button"
        >
          {t('tradelog.settings.reset')}
        </button>
        <button
          onClick={() => void handleCancel()}
          disabled={isSaving}
          className="journalit-tradelog-settings-cancel-button cancel-button"
        >
          {t('button.cancel')}
        </button>
        <button
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="primary"
        >
          {isSaving ? t('tradelog.settings.saving') : t('button.save')}
        </button>
      </div>
    </div>
  );
};


export function openTradeLogSettingsModal(props: {
  app: App;
  plugin: JournalitPlugin;
  onSave: () => void;
  onClose: () => void;
}): TradeLogSettingsModal {
  const modal = new TradeLogSettingsModal(props);
  modal.open();
  return modal;
}
