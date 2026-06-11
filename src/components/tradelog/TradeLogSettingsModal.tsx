

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
  ColumnCategory,
  getColumnCategoryLabel,
  getColumnLabel,
  resolveTradeLogSettings,
} from './columnConfig';
import { TradeLogColumnId } from '../../settings/types';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { dndKitStyle } from '../../styles/inlineStylePolicy';
import {
  GripVertical,
  Plus,
  ChevronDown,
  ChevronRight,
} from '../shared/icons/ObsidianIcon';
import {
  ensureTradeLogSettingsModalStyles,
  removeTradeLogSettingsModalStyles,
} from '../../styles/tradelog/tradeLogSettingsModalStyles';
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
      this.showUnsavedChangesConfirmation()
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
      visible: (columnVisibility[col.id as TradeLogColumnId] ??
        col.defaultVisible) as boolean,
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

    const remaining = columnsWithVisibility.filter(
      (col) => !orderedIds.has(col.id as TradeLogColumnId)
    );

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
  const [expandedCategories, setExpandedCategories] = useState<
    Set<ColumnCategory>
  >(new Set(COLUMN_CATEGORIES.map((c) => c.id)));
  const lastActiveTabRef = useRef<PanelTab>('active');
  const [isLoading, setIsLoading] = useState(false);
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
        const columnVisibility = Object.fromEntries(
          prevColumns.map((column) => [column.id, column.visible])
        ) as Partial<Record<TradeLogColumnId, boolean>>;
        const columnOrder = prevColumns.map(
          (column) => column.id as TradeLogColumnId
        );

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

  
  const availableByCategory = useMemo(() => {
    const grouped: Record<ColumnCategory, ColumnWithVisibility[]> = {
      basic: [],
      timing: [],
      prices: [],
      risk: [],
      position: [],
      review: [],
      custom: [],
    };
    availableColumns.forEach((col) => {
      grouped[col.category].push(col);
    });
    return grouped;
  }, [availableColumns]);

  
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setColumns((prevColumns) => {
      const visibleColumns = prevColumns.filter((col) => col.visible);
      const hiddenColumns = prevColumns.filter((col) => !col.visible);

      const oldIndex = visibleColumns.findIndex((col) => col.id === active.id);
      const newIndex = visibleColumns.findIndex((col) => col.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return prevColumns;
      }

      
      const newVisibleColumns = [...visibleColumns];
      const [movedItem] = newVisibleColumns.splice(oldIndex, 1);
      newVisibleColumns.splice(newIndex, 0, movedItem);

      
      return [...newVisibleColumns, ...hiddenColumns];
    });
  }, []);

  
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

  
  const toggleCategory = useCallback((category: ColumnCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  
  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);

      
      const columnVisibility: Partial<Record<TradeLogColumnId, boolean>> = {};
      const columnOrder: TradeLogColumnId[] = [];

      columns.forEach((col) => {
        columnVisibility[col.id as TradeLogColumnId] = col.visible;
        columnOrder.push(col.id as TradeLogColumnId);
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
        t('notice.error.save-settings', { error: (error as Error).message })
      );
    } finally {
      setIsLoading(false);
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
    expandedCategories,
    isLoading,
    expandedMode,
    setExpandedMode,
    activeColumns,
    availableColumns,
    availableByCategory,
    handleDragEnd,
    handleAddColumn,
    handleRemoveColumn,
    toggleCategory,
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
    expandedCategories,
    isLoading,
    expandedMode,
    setExpandedMode,
    activeColumns,
    availableColumns,
    availableByCategory,
    handleDragEnd,
    handleAddColumn,
    handleRemoveColumn,
    toggleCategory,
    handleSave,
    handleCancel,
    handleReset,
  } = useTradeLogSettingsModalModel({ plugin, onSave, modalInstance });

  return (
    <div className="tradelog-settings-modal-container">
      
      <nav className="journalit-tab-nav">
        <div className="journalit-tab-wrapper">
          <button
            type="button"
            className={`journalit-tab-button ${activeTab === 'active' ? 'journalit-tab-active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            {t('tradelog.settings.active-columns')}
            <span className="journalit-tab-count">{activeColumns.length}</span>
          </button>
          <button
            type="button"
            className={`journalit-tab-button ${activeTab === 'available' ? 'journalit-tab-active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            {t('tradelog.settings.available-columns')}
            <span className="journalit-tab-count">
              {availableColumns.length}
            </span>
          </button>
        </div>
      </nav>

      
      <div className="tradelog-settings-modal-content">
        {activeTab === 'active' ? (
          <div className="tradelog-settings-panel">
            <div className="panel-description">
              {t('tradelog.settings.active-desc')}
            </div>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={activeColumns.map((col) => col.id)}
                strategy={verticalListSortingStrategy}
              >
                {activeColumns.map((col) => (
                  <SortableActiveColumnItem
                    key={col.id}
                    column={col}
                    onRemove={handleRemoveColumn}
                    canRemove={activeColumns.length > 1}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {activeColumns.length === 0 && (
              <div className="empty-panel-message">
                {t('tradelog.settings.no-active')}
              </div>
            )}
          </div>
        ) : (
          <div className="tradelog-settings-panel available-panel">
            <div className="panel-description">
              {t('tradelog.settings.available-desc')}
            </div>
            {COLUMN_CATEGORIES.map((category) => {
              const categoryColumns = availableByCategory[category.id];
              if (categoryColumns.length === 0) return null;

              const isExpanded = expandedCategories.has(category.id);

              const label = getColumnCategoryLabel(category.id);

              return (
                <div key={category.id} className="column-category">
                  <button
                    className="category-header"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    <span className="category-label">{label}</span>
                    <span className="category-count">
                      {categoryColumns.length}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="category-columns">
                      {categoryColumns.map((col) => (
                        <AvailableColumnItem
                          key={col.id}
                          column={col}
                          onAdd={handleAddColumn}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {availableColumns.length === 0 && (
              <div className="empty-panel-message">
                {t('tradelog.settings.all-active')}
              </div>
            )}
          </div>
        )}
      </div>

      
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

      
      <div className="tradelog-settings-modal-buttons">
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="reset-button"
        >
          {t('tradelog.settings.reset')}
        </button>
        <button onClick={handleCancel} disabled={isLoading}>
          {t('button.cancel')}
        </button>
        <button onClick={handleSave} disabled={isLoading} className="primary">
          {isLoading ? t('tradelog.settings.saving') : t('button.save')}
        </button>
      </div>
    </div>
  );
};


interface SortableActiveColumnItemProps {
  column: ColumnWithVisibility;
  onRemove: (columnId: string) => void;
  canRemove: boolean;
}

const SortableActiveColumnItem: React.FC<SortableActiveColumnItemProps> =
  React.memo(({ column, onRemove, canRemove }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: column.id });

    const label = getColumnLabel(column);

    return (
      <div
        ref={setNodeRef}
        style={dndKitStyle(
          CSS.Transform.toString(transform),
          isDragging ? transition : undefined
        )}
        className={`active-column-item ${isDragging ? 'dragging' : ''}`}
      >
        <div className="column-drag-handle" {...attributes} {...listeners}>
          <GripVertical size={16} />
        </div>

        <div className="column-label">{label}</div>

        <button
          className="column-remove-btn"
          onClick={() => onRemove(column.id)}
          disabled={!canRemove}
        >
          ×
        </button>
      </div>
    );
  });

SortableActiveColumnItem.displayName = 'SortableActiveColumnItem';


interface AvailableColumnItemProps {
  column: ColumnWithVisibility;
  onAdd: (columnId: string) => void;
}

const AvailableColumnItem: React.FC<AvailableColumnItemProps> = React.memo(
  ({ column, onAdd }) => {
    const label = getColumnLabel(column);

    return (
      <div className="available-column-item">
        <div className="column-label">{label}</div>
        <button
          className="column-add-btn"
          onClick={() => onAdd(column.id)}
          type="button"
          aria-label={`Add ${label} column`}
        >
          <Plus size={14} className="column-add-btn-icon" aria-hidden="true" />
        </button>
      </div>
    );
  }
);

AvailableColumnItem.displayName = 'AvailableColumnItem';


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
