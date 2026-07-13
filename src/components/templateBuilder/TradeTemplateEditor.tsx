

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import {
  TradeMetricType,
  TradeNoteSectionId,
  TradeTemplate,
  TradeTemplateAssetType,
} from '../../types/reviewV2';
import { TradeTemplateService } from '../../services/templates/TradeTemplateService';
import { t } from '../../lang/helpers';
import { CustomFieldDefinition } from '../../types/customFields';
import { ReorderControls } from '../shared/ReorderControls';
import { FloatingUnsavedChangesBanner } from './FloatingUnsavedChangesBanner';

interface TradeTemplateEditorProps {
  plugin: JournalitPlugin;
  tradeTemplateService: TradeTemplateService;
  templateId: string;
  onTemplateChange?: () => void;
  onDirtyStateChange?: (isDirty: boolean) => void;
}

const SECTION_ORDER: TradeNoteSectionId[] = [
  'images',
  'metrics',
  'thesis',
  'missedReason',
  'metadata',
  'reviewButton',
];

const METRIC_OPTIONS: TradeMetricType[] = [
  'entry',
  'exit',
  'duration',
  'stopLoss',
  'takeProfit',
  'executionSummary',
  'pnl',
  'rMultiple',
  'costs',
  'size',
];

const ASSET_TYPES: TradeTemplateAssetType[] = [
  'stock',
  'options',
  'futures',
  'forex',
  'crypto',
  'cfd',
];

type TradeTemplateLayoutScope = 'default' | TradeTemplateAssetType;

interface TradeTemplateEditorUiState {
  isEditingNameField: boolean;
  selectedScope: TradeTemplateLayoutScope;
  isAddingAssetScope: boolean;
}

type TradeTemplateEditorUiAction =
  | { type: 'setEditingName'; value: boolean }
  | { type: 'setSelectedScope'; value: TradeTemplateLayoutScope }
  | { type: 'setAddingAssetScope'; value: boolean };

const TRADE_TEMPLATE_EDITOR_INITIAL_UI_STATE: TradeTemplateEditorUiState = {
  isEditingNameField: false,
  selectedScope: 'default',
  isAddingAssetScope: false,
};

function tradeTemplateEditorUiReducer(
  state: TradeTemplateEditorUiState,
  action: TradeTemplateEditorUiAction
): TradeTemplateEditorUiState {
  switch (action.type) {
    case 'setEditingName':
      return { ...state, isEditingNameField: action.value };
    case 'setSelectedScope':
      return {
        ...state,
        selectedScope: action.value,
        isAddingAssetScope: false,
      };
    case 'setAddingAssetScope':
      return { ...state, isAddingAssetScope: action.value };
  }
}

const DEFAULT_SECTIONS: TradeTemplate['sections'] = {
  header: { show: true },
  navigation: { show: true },
  images: { show: true, position: 'top' },
  metadata: {
    show: true,
    showAccounts: true,
    showSetups: true,
    showMistakes: true,
    showTags: true,
    showCustomFields: true,
  },
  details: {
    show: true,
    showThesis: true,
    metrics: [
      'entry',
      'exit',
      'duration',
      'stopLoss',
      'takeProfit',
      'executionSummary',
    ],
  },
  reviewButton: { show: true },
  missedReason: { show: true },
};

function normalizeSectionOrder(
  order: TradeNoteSectionId[] | undefined
): TradeNoteSectionId[] {
  const configured = Array.isArray(order) ? order : [];
  const valid = configured.filter(
    (sectionId): sectionId is TradeNoteSectionId =>
      SECTION_ORDER.includes(sectionId)
  );
  const missing = SECTION_ORDER.filter(
    (sectionId) => !valid.includes(sectionId)
  );
  return [...valid, ...missing];
}

function getSectionLabel(sectionId: TradeNoteSectionId): string {
  switch (sectionId) {
    case 'navigation':
      return t('template.editor.nav-bar');
    case 'images':
      return t('template.editor.images');
    case 'metrics':
      return t('template.editor.metrics');
    case 'thesis':
      return t('template.editor.thesis');
    case 'missedReason':
      return t('template.editor.missed-reason');
    case 'metadata':
      return t('template.editor.metadata');
    case 'reviewButton':
      return t('template.editor.review-button');
  }
}

function getMetricLabel(metric: TradeMetricType): string {
  switch (metric) {
    case 'entry':
      return t('trade.details.entry');
    case 'exit':
      return t('trade.details.exit');
    case 'size':
      return t('template.editor.metric.position-size');
    case 'duration':
      return t('trade.details.duration');
    case 'stopLoss':
      return t('form.field.stop-loss');
    case 'takeProfit':
      return t('form.field.take-profit');
    case 'executionSummary':
      return t('template.editor.metric.execution-breakdown');
    case 'pnl':
      return t('template.editor.metric.pnl');
    case 'rMultiple':
      return t('template.editor.metric.r-multiple');
    case 'costs':
      return t('template.editor.metric.costs');
  }
}

function getAssetTypeLabel(assetType: TradeTemplateAssetType): string {
  switch (assetType) {
    case 'stock':
      return 'Stocks';
    case 'options':
      return 'Options';
    case 'futures':
      return 'Futures';
    case 'forex':
      return 'Forex';
    case 'crypto':
      return 'Crypto';
    case 'cfd':
      return 'CFD';
  }
}

function isTradeTemplateAssetType(
  value: string
): value is TradeTemplateAssetType {
  return ASSET_TYPES.some((assetType) => assetType === value);
}

function getLayoutScopeLabel(scope: TradeTemplateLayoutScope): string {
  return scope === 'default'
    ? t('template.editor.other-asset-types')
    : getAssetTypeLabel(scope);
}

function getTradeNoteLayoutTitle(
  scope: TradeTemplateLayoutScope,
  configuredAssetTypes: TradeTemplateAssetType[]
): string {
  if (scope === 'default' && configuredAssetTypes.length === 0) {
    return t('template.editor.trade-note-layout');
  }
  return `${t('template.editor.trade-note-layout')} · ${getLayoutScopeLabel(scope)}`;
}

function mergeSections(
  base: TradeTemplate['sections'],
  overrides: Partial<TradeTemplate['sections']> | undefined
): TradeTemplate['sections'] {
  return {
    header: base.header,
    navigation: { ...base.navigation, ...overrides?.navigation },
    images: { ...base.images, ...overrides?.images },
    metadata: { ...base.metadata, ...overrides?.metadata },
    details: { ...base.details, ...overrides?.details },
    reviewButton: { ...base.reviewButton, ...overrides?.reviewButton },
    missedReason: {
      show: base.missedReason?.show ?? true,
      ...overrides?.missedReason,
    },
  };
}

const Toggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    className={`journalit-button template-toggle${checked ? ' is-checked' : ''}${disabled ? ' is-disabled' : ''}`}
    aria-pressed={checked}
    disabled={disabled}
  >
    <div className="template-toggle__thumb" />
  </button>
);

const SectionRow: React.FC<{
  label: string;
  description?: string;
  children: React.ReactNode;
}> = ({ label, description, children }) => (
  <div className="template-section-row">
    <div className="template-section-row__info">
      <div className="template-section-row__label">{label}</div>
      {description && (
        <div className="template-section-row__description">{description}</div>
      )}
    </div>
    <div className="template-section-row__control">{children}</div>
  </div>
);

const SectionOrderControls: React.FC<{
  order: TradeNoteSectionId[];
  canEdit: boolean;
  onMove: (sectionId: TradeNoteSectionId, direction: -1 | 1) => void;
}> = ({ order, canEdit, onMove }) => (
  <div className="template-editor-section-list">
    {order.map((sectionId, index) => (
      <div key={sectionId} className="template-section-item">
        <div className="template-section-item__summary">
          <span className="template-section-item__title">
            {getSectionLabel(sectionId)}
          </span>
        </div>
        <div className="template-section-item__actions">
          <ReorderControls
            label={getSectionLabel(sectionId)}
            canMoveUp={canEdit && index > 0}
            canMoveDown={canEdit && index < order.length - 1}
            onMoveUp={() => onMove(sectionId, -1)}
            onMoveDown={() => onMove(sectionId, 1)}
            buttonClassName="template-section-move-button"
          />
        </div>
      </div>
    ))}
  </div>
);

const LayoutScopePanel: React.FC<{
  selectedScope: TradeTemplateLayoutScope;
  setSelectedScope: (scope: TradeTemplateLayoutScope) => void;
  configuredAssetTypes: TradeTemplateAssetType[];
  availableAssetTypes: TradeTemplateAssetType[];
  canEdit: boolean;
  isAddingAssetScope: boolean;
  setIsAddingAssetScope: (isAdding: boolean) => void;
  addAssetScope: (assetType: TradeTemplateAssetType) => void;
  canRemoveSelectedAssetScope: boolean;
  removeSelectedAssetScope: () => void;
}> = ({
  selectedScope,
  setSelectedScope,
  configuredAssetTypes,
  availableAssetTypes,
  canEdit,
  isAddingAssetScope,
  setIsAddingAssetScope,
  addAssetScope,
  canRemoveSelectedAssetScope,
  removeSelectedAssetScope,
}) => (
  <div className="template-editor-panel template-layout-scope-panel">
    <div className="template-layout-scope-header">
      <h3 className="template-editor-section-title">
        {getTradeNoteLayoutTitle(selectedScope, configuredAssetTypes)}
      </h3>
      {(availableAssetTypes.length > 0 || canRemoveSelectedAssetScope) && (
        <div className="template-layout-scope-actions">
          {canRemoveSelectedAssetScope && (
            <button
              type="button"
              className="journalit-button template-action-button template-action-button--neutral template-action-button--compact"
              onClick={removeSelectedAssetScope}
            >
              {t('template.editor.remove-asset-layout')}
            </button>
          )}
          {availableAssetTypes.length > 0 && (
            <div className="template-layout-scope-menu-wrapper">
              <button
                type="button"
                className="journalit-button template-action-button template-action-button--neutral template-action-button--compact"
                onClick={() => setIsAddingAssetScope(!isAddingAssetScope)}
                disabled={!canEdit}
                aria-expanded={isAddingAssetScope}
              >
                <span aria-hidden="true">+</span>
                {t('template.editor.asset-type-add')}
              </button>
              {isAddingAssetScope && (
                <div className="template-layout-scope-menu">
                  {availableAssetTypes.map((assetType) => (
                    <button
                      key={assetType}
                      type="button"
                      className="journalit-button template-layout-scope-menu-item"
                      onClick={() => addAssetScope(assetType)}
                    >
                      {getAssetTypeLabel(assetType)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
    {configuredAssetTypes.length > 0 && (
      <div className="template-layout-scope-bar" role="tablist">
        <div className="template-layout-scope-tabs">
          <button
            type="button"
            role="tab"
            aria-selected={selectedScope === 'default'}
            className={`journalit-button template-layout-scope-tab is-first${selectedScope === 'default' ? ' is-active' : ''}`}
            onClick={() => setSelectedScope('default')}
          >
            {t('template.editor.other-asset-types')}
          </button>
          {configuredAssetTypes.map((assetType, index) => (
            <button
              key={assetType}
              type="button"
              role="tab"
              aria-selected={selectedScope === assetType}
              className={`journalit-button template-layout-scope-tab${index === configuredAssetTypes.length - 1 ? ' is-last' : ''}${selectedScope === assetType ? ' is-active' : ''}`}
              onClick={() => setSelectedScope(assetType)}
            >
              {getAssetTypeLabel(assetType)}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

const SectionVisibilityPanel: React.FC<{
  canEdit: boolean;
  sections: TradeTemplate['sections'];
  updateSection: <K extends keyof TradeTemplate['sections']>(
    sectionKey: K,
    updates: Partial<TradeTemplate['sections'][K]>
  ) => void;
}> = ({ canEdit, sections, updateSection }) => (
  <div className="template-editor-panel">
    <h3 className="template-editor-section-title template-editor-section-title--compact">
      {t('template.editor.section-visibility')}
    </h3>
    <SectionRow
      label={t('template.editor.nav-bar')}
      description={t('template.editor.nav-bar-desc')}
    >
      <Toggle
        checked={sections.navigation.show}
        onChange={(checked) => updateSection('navigation', { show: checked })}
        disabled={!canEdit}
      />
    </SectionRow>
    <SectionRow
      label={t('template.editor.images')}
      description={t('template.editor.images-desc')}
    >
      <Toggle
        checked={sections.images.show}
        onChange={(checked) => updateSection('images', { show: checked })}
        disabled={!canEdit}
      />
    </SectionRow>
    <SectionRow
      label={t('template.editor.metrics')}
      description={t('template.editor.metrics-desc')}
    >
      <Toggle
        checked={sections.details.show}
        onChange={(checked) => updateSection('details', { show: checked })}
        disabled={!canEdit}
      />
    </SectionRow>
    <SectionRow
      label={t('template.editor.thesis')}
      description={t('template.editor.thesis-desc')}
    >
      <Toggle
        checked={sections.details.showThesis !== false}
        onChange={(checked) =>
          updateSection('details', { showThesis: checked })
        }
        disabled={!canEdit}
      />
    </SectionRow>
    <SectionRow
      label={t('template.editor.missed-reason')}
      description={t('template.editor.missed-reason-desc')}
    >
      <Toggle
        checked={sections.missedReason?.show !== false}
        onChange={(checked) => updateSection('missedReason', { show: checked })}
        disabled={!canEdit}
      />
    </SectionRow>
    <SectionRow
      label={t('template.editor.metadata')}
      description={t('template.editor.metadata-desc')}
    >
      <Toggle
        checked={sections.metadata.show}
        onChange={(checked) => updateSection('metadata', { show: checked })}
        disabled={!canEdit}
      />
    </SectionRow>
    <SectionRow
      label={t('template.editor.review-button')}
      description={t('template.editor.review-button-desc')}
    >
      <Toggle
        checked={sections.reviewButton.show}
        onChange={(checked) => updateSection('reviewButton', { show: checked })}
        disabled={!canEdit}
      />
    </SectionRow>
  </div>
);

const MetricCardsPanel: React.FC<{
  canEdit: boolean;
  metrics: TradeMetricType[];
  updateMetrics: (metrics: TradeMetricType[]) => void;
}> = ({ canEdit, metrics, updateMetrics }) => (
  <div className="template-editor-panel">
    <h3 className="template-editor-section-title">
      {t('template.editor.metric-cards')}
    </h3>
    {METRIC_OPTIONS.map((metric) => (
      <SectionRow key={metric} label={getMetricLabel(metric)}>
        <Toggle
          checked={metrics.includes(metric)}
          onChange={(checked) =>
            updateMetrics(updateMetricList(metrics, metric, checked))
          }
          disabled={!canEdit}
        />
      </SectionRow>
    ))}
  </div>
);

const MetadataRowsPanel: React.FC<{
  canEdit: boolean;
  metadata: TradeTemplate['sections']['metadata'];
  customFieldCount: number;
  updateMetadata: (
    updates: Partial<TradeTemplate['sections']['metadata']>
  ) => void;
}> = ({ canEdit, metadata, customFieldCount, updateMetadata }) => (
  <div className="template-editor-panel">
    <h3 className="template-editor-section-title">
      {t('template.editor.metadata-rows')}
    </h3>
    <SectionRow label={t('template.editor.accounts')}>
      <Toggle
        checked={metadata.showAccounts}
        onChange={(checked) => updateMetadata({ showAccounts: checked })}
        disabled={!canEdit}
      />
    </SectionRow>
    <SectionRow label={t('template.editor.setups')}>
      <Toggle
        checked={metadata.showSetups}
        onChange={(checked) => updateMetadata({ showSetups: checked })}
        disabled={!canEdit}
      />
    </SectionRow>
    <SectionRow label={t('template.editor.mistakes')}>
      <Toggle
        checked={metadata.showMistakes}
        onChange={(checked) => updateMetadata({ showMistakes: checked })}
        disabled={!canEdit}
      />
    </SectionRow>
    <SectionRow label={t('template.editor.tags')}>
      <Toggle
        checked={metadata.showTags}
        onChange={(checked) => updateMetadata({ showTags: checked })}
        disabled={!canEdit}
      />
    </SectionRow>
    <SectionRow
      label={t('template.editor.custom-fields')}
      description={t('template.editor.custom-fields-desc', {
        count: String(customFieldCount),
      })}
    >
      <Toggle
        checked={metadata.showCustomFields !== false}
        onChange={(checked) => updateMetadata({ showCustomFields: checked })}
        disabled={!canEdit}
      />
    </SectionRow>
  </div>
);

function cloneTemplate(template: TradeTemplate): TradeTemplate {
  return structuredClone(template);
}

function getSections(template: TradeTemplate): TradeTemplate['sections'] {
  return {
    ...DEFAULT_SECTIONS,
    ...template.sections,
    metadata: { ...DEFAULT_SECTIONS.metadata, ...template.sections.metadata },
    details: { ...DEFAULT_SECTIONS.details, ...template.sections.details },
  };
}

function updateMetricList(
  metrics: TradeMetricType[],
  metric: TradeMetricType,
  enabled: boolean
): TradeMetricType[] {
  if (enabled) {
    return metrics.includes(metric) ? metrics : [...metrics, metric];
  }
  return metrics.filter((item) => item !== metric);
}

export const TradeTemplateEditor: React.FC<TradeTemplateEditorProps> = ({
  plugin,
  tradeTemplateService,
  templateId,
  onTemplateChange,
  onDirtyStateChange,
}) => {
  const [savedTemplate, setSavedTemplate] = useState<TradeTemplate | null>(
    null
  );
  const [editingTemplate, setEditingTemplate] = useState<TradeTemplate | null>(
    null
  );
  const [uiState, dispatchUiState] = useReducer(
    tradeTemplateEditorUiReducer,
    TRADE_TEMPLATE_EDITOR_INITIAL_UI_STATE
  );
  const { isEditingNameField, selectedScope, isAddingAssetScope } = uiState;
  const nameInputRef = useRef<HTMLInputElement>(null);
  const onDirtyStateChangeRef = useRef(onDirtyStateChange);

  const customFields = useMemo<CustomFieldDefinition[]>(
    () => plugin.customFieldsService?.getFields() ?? [],
    [plugin.customFieldsService]
  );

  const loadTemplate = useCallback(() => {
    const loaded = tradeTemplateService.getTemplate(templateId);
    if (!loaded) return;
    const normalized = {
      ...loaded,
      sectionOrder: normalizeSectionOrder(loaded.sectionOrder),
      sections: getSections(loaded),
    };
    setSavedTemplate(normalized);
    setEditingTemplate(cloneTemplate(normalized));
  }, [templateId, tradeTemplateService]);

  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  useEffect(() => {
    if (!editingTemplate || !isTradeTemplateAssetType(selectedScope)) return;
    if (editingTemplate.assetOverrides?.[selectedScope] !== undefined) return;

    dispatchUiState({ type: 'setSelectedScope', value: 'default' });
  }, [editingTemplate, selectedScope]);

  const hasChanges = useMemo(() => {
    if (!savedTemplate || !editingTemplate) return false;
    return JSON.stringify(savedTemplate) !== JSON.stringify(editingTemplate);
  }, [savedTemplate, editingTemplate]);

  useEffect(() => {
    onDirtyStateChangeRef.current = onDirtyStateChange;
  }, [onDirtyStateChange]);

  useEffect(() => {
    onDirtyStateChangeRef.current?.(hasChanges);
  }, [hasChanges]);

  const canEdit = editingTemplate?.isBuiltIn === false;

  const updateTemplate = useCallback(
    (updater: (template: TradeTemplate) => TradeTemplate) => {
      setEditingTemplate((current) => (current ? updater(current) : current));
    },
    []
  );

  const updateBaseSection = useCallback(
    <K extends keyof TradeTemplate['sections']>(
      sectionKey: K,
      updates: Partial<TradeTemplate['sections'][K]>
    ) => {
      updateTemplate((template) => ({
        ...template,
        sections: {
          ...template.sections,
          [sectionKey]: { ...template.sections[sectionKey], ...updates },
        },
      }));
    },
    [updateTemplate]
  );

  const moveBaseSection = useCallback(
    (sectionId: TradeNoteSectionId, direction: -1 | 1) => {
      updateTemplate((template) => {
        const order = normalizeSectionOrder(template.sectionOrder);
        const index = order.indexOf(sectionId);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= order.length)
          return template;
        const nextOrder = [...order];
        const [item] = nextOrder.splice(index, 1);
        nextOrder.splice(nextIndex, 0, item);
        return { ...template, sectionOrder: nextOrder };
      });
    },
    [updateTemplate]
  );

  const updateAssetSection = useCallback(
    <K extends keyof TradeTemplate['sections']>(
      assetType: TradeTemplateAssetType,
      sectionKey: K,
      updates: Partial<TradeTemplate['sections'][K]>
    ) => {
      updateTemplate((template) => {
        const baseSections = getSections(template);
        const defaultSections = mergeSections(
          baseSections,
          template.assetDefaults?.[assetType]?.sections
        );
        const assetOverrides = { ...(template.assetOverrides ?? {}) };
        const currentOverride = assetOverrides[assetType] ?? {
          sectionOrder: normalizeSectionOrder(
            template.assetDefaults?.[assetType]?.sectionOrder ??
              template.sectionOrder
          ),
          sections: defaultSections,
        };
        const currentSections = mergeSections(
          defaultSections,
          currentOverride.sections
        );
        assetOverrides[assetType] = {
          ...currentOverride,
          sections: {
            ...currentSections,
            [sectionKey]: {
              ...currentSections[sectionKey],
              ...updates,
            },
          },
        };
        return { ...template, assetOverrides };
      });
    },
    [updateTemplate]
  );

  const moveAssetSection = useCallback(
    (
      assetType: TradeTemplateAssetType,
      sectionId: TradeNoteSectionId,
      direction: -1 | 1
    ) => {
      updateTemplate((template) => {
        const baseSections = getSections(template);
        const defaultSections = mergeSections(
          baseSections,
          template.assetDefaults?.[assetType]?.sections
        );
        const order = normalizeSectionOrder(
          template.assetOverrides?.[assetType]?.sectionOrder ??
            template.assetDefaults?.[assetType]?.sectionOrder ??
            template.sectionOrder
        );
        const index = order.indexOf(sectionId);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= order.length)
          return template;
        const nextOrder = [...order];
        const [item] = nextOrder.splice(index, 1);
        nextOrder.splice(nextIndex, 0, item);
        return {
          ...template,
          assetOverrides: {
            ...(template.assetOverrides ?? {}),
            [assetType]: {
              sectionOrder: nextOrder,
              sections: mergeSections(
                defaultSections,
                template.assetOverrides?.[assetType]?.sections
              ),
            },
          },
        };
      });
    },
    [updateTemplate]
  );

  const addAssetScope = useCallback(
    (assetType: TradeTemplateAssetType) => {
      updateTemplate((template) => {
        const baseSections = getSections(template);
        const defaultSections = mergeSections(
          baseSections,
          template.assetDefaults?.[assetType]?.sections
        );
        return {
          ...template,
          assetOverrides: {
            ...(template.assetOverrides ?? {}),
            [assetType]: {
              sectionOrder: normalizeSectionOrder(
                template.assetDefaults?.[assetType]?.sectionOrder ??
                  template.sectionOrder
              ),
              sections: defaultSections,
            },
          },
        };
      });
      dispatchUiState({ type: 'setSelectedScope', value: assetType });
    },
    [updateTemplate]
  );

  const removeSelectedAssetScope = useCallback(() => {
    if (!isTradeTemplateAssetType(selectedScope)) return;
    updateTemplate((template) => {
      const assetOverrides = { ...(template.assetOverrides ?? {}) };
      delete assetOverrides[selectedScope];
      return { ...template, assetOverrides };
    });
    dispatchUiState({ type: 'setSelectedScope', value: 'default' });
  }, [selectedScope, updateTemplate]);

  const handleSave = useCallback(async () => {
    if (!editingTemplate || editingTemplate.isBuiltIn) return;
    try {
      await tradeTemplateService.updateTemplate(editingTemplate.id, {
        name: editingTemplate.name,
        sectionOrder: normalizeSectionOrder(editingTemplate.sectionOrder),
        assetDefaults: editingTemplate.assetDefaults,
        sections: getSections(editingTemplate),
        assetOverrides: editingTemplate.assetOverrides,
      });
      loadTemplate();
      onTemplateChange?.();
      new Notice(t('notice.template-saved'));
    } catch (error) {
      console.error('Failed to save trade template:', error);
      new Notice(
        error instanceof Error
          ? error.message
          : t('notice.error.switch-template-generic')
      );
    }
  }, [editingTemplate, tradeTemplateService, loadTemplate, onTemplateChange]);

  const handleDiscard = useCallback(() => {
    if (savedTemplate) setEditingTemplate(cloneTemplate(savedTemplate));
  }, [savedTemplate]);

  if (!editingTemplate) {
    return (
      <div className="template-editor-loading">
        {t('template.editor.loading')}
      </div>
    );
  }

  const sections = getSections(editingTemplate);
  const sectionOrder = normalizeSectionOrder(editingTemplate.sectionOrder);
  const configuredAssetTypes = ASSET_TYPES.filter(
    (assetType) => editingTemplate.assetOverrides?.[assetType] !== undefined
  );
  const availableAssetTypes = ASSET_TYPES.filter(
    (assetType) => !configuredAssetTypes.includes(assetType)
  );
  const selectedAssetOverride = isTradeTemplateAssetType(selectedScope)
    ? editingTemplate.assetOverrides?.[selectedScope]
    : undefined;
  const selectedAssetDefault = isTradeTemplateAssetType(selectedScope)
    ? editingTemplate.assetDefaults?.[selectedScope]
    : undefined;
  const defaultAssetSections = selectedAssetDefault?.sections
    ? mergeSections(sections, selectedAssetDefault.sections)
    : sections;
  const activeSections = isTradeTemplateAssetType(selectedScope)
    ? mergeSections(defaultAssetSections, selectedAssetOverride?.sections)
    : sections;
  const activeSectionOrder = isTradeTemplateAssetType(selectedScope)
    ? normalizeSectionOrder(
        selectedAssetOverride?.sectionOrder ??
          selectedAssetDefault?.sectionOrder ??
          sectionOrder
      )
    : sectionOrder;

  const updateActiveSection = <K extends keyof TradeTemplate['sections']>(
    sectionKey: K,
    updates: Partial<TradeTemplate['sections'][K]>
  ) => {
    if (isTradeTemplateAssetType(selectedScope)) {
      updateAssetSection(selectedScope, sectionKey, updates);
      return;
    }
    updateBaseSection(sectionKey, updates);
  };

  const moveActiveSection = (
    sectionId: TradeNoteSectionId,
    direction: -1 | 1
  ) => {
    if (isTradeTemplateAssetType(selectedScope)) {
      moveAssetSection(selectedScope, sectionId, direction);
      return;
    }
    moveBaseSection(sectionId, direction);
  };

  const showUnsavedBanner = hasChanges && canEdit;

  return (
    <div
      className={`template-editor-root${showUnsavedBanner ? ' template-editor-root--has-floating-unsaved' : ''}`}
    >
      
      <div className="template-editor-topbar">
        <div className="template-editor-topbar-group template-editor-topbar-group--tight">
          {isEditingNameField && canEdit ? (
            <input
              ref={nameInputRef}
              type="text"
              value={editingTemplate.name}
              onChange={(event) =>
                updateTemplate((template) => ({
                  ...template,
                  name: event.target.value,
                }))
              }
              onBlur={() =>
                dispatchUiState({ type: 'setEditingName', value: false })
              }
              className="template-editor-title-input"
            />
          ) : (
            <h2
              role={canEdit ? 'button' : undefined}
              tabIndex={canEdit ? 0 : undefined}
              onClick={() => {
                if (!canEdit) return;
                dispatchUiState({ type: 'setEditingName', value: true });
                window.requestAnimationFrame(() =>
                  nameInputRef.current?.focus()
                );
              }}
              onKeyDown={(event) => {
                if (!canEdit || (event.key !== 'Enter' && event.key !== ' ')) {
                  return;
                }
                event.preventDefault();
                dispatchUiState({ type: 'setEditingName', value: true });
                window.requestAnimationFrame(() =>
                  nameInputRef.current?.focus()
                );
              }}
              className={`template-editor-title-text${canEdit ? ' is-editable' : ''}`}
            >
              {editingTemplate.name}
            </h2>
          )}
          {editingTemplate.isBuiltIn && (
            <span className="template-editor-badge">
              {t('template.editor.built-in')}
            </span>
          )}
        </div>
      </div>

      <div className="template-editor-canvas template-editor-canvas-container">
        <div className="template-editor-content">
          {editingTemplate.isBuiltIn && (
            <div className="template-editor-notice template-editor-notice--warning">
              <span>{t('template.editor.built-in-notice')}</span>
            </div>
          )}

          <div className="template-trade-note-customization-surface">
            <LayoutScopePanel
              selectedScope={selectedScope}
              setSelectedScope={(scope) =>
                dispatchUiState({ type: 'setSelectedScope', value: scope })
              }
              configuredAssetTypes={configuredAssetTypes}
              availableAssetTypes={availableAssetTypes}
              canEdit={canEdit}
              isAddingAssetScope={isAddingAssetScope}
              setIsAddingAssetScope={(isAdding) =>
                dispatchUiState({
                  type: 'setAddingAssetScope',
                  value: isAdding,
                })
              }
              addAssetScope={addAssetScope}
              canRemoveSelectedAssetScope={
                canEdit && isTradeTemplateAssetType(selectedScope)
              }
              removeSelectedAssetScope={removeSelectedAssetScope}
            />

            <div className="template-editor-panel">
              <SectionOrderControls
                order={activeSectionOrder}
                canEdit={canEdit}
                onMove={moveActiveSection}
              />
            </div>

            <SectionVisibilityPanel
              canEdit={canEdit}
              sections={activeSections}
              updateSection={updateActiveSection}
            />

            <MetricCardsPanel
              canEdit={canEdit}
              metrics={activeSections.details.metrics}
              updateMetrics={(metrics) =>
                updateActiveSection('details', { metrics })
              }
            />

            <MetadataRowsPanel
              canEdit={canEdit}
              metadata={activeSections.metadata}
              customFieldCount={customFields.length}
              updateMetadata={(updates) =>
                updateActiveSection('metadata', updates)
              }
            />
          </div>
        </div>
      </div>

      
      {showUnsavedBanner && (
        <FloatingUnsavedChangesBanner
          message={t('template.editor.unsaved-changes')}
          onDiscard={() => void handleDiscard()}
          onSave={() => void handleSave()}
        />
      )}
    </div>
  );
};
