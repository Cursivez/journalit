

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import {
  ReviewTemplate,
  ReviewTemplateType,
  TradeTemplate,
} from '../../types/reviewV2';
import type { ReviewTemplateService } from '../../services/templates/ReviewTemplateService';
import { TradeTemplateService } from '../../services/templates/TradeTemplateService';
import { Tooltip } from '../shared/Tooltip';
import { eventBus, DefaultTemplateChangedPayload } from '../../services/events';
import { t } from '../../lang/helpers';
import { showDeleteTemplateModal } from './UnsavedChangesModal';
import {
  useGuideAction,
  useGuideBackHandler,
  useGuideCurrentStepId,
  useGuideTarget,
} from '../../guides/GuideRuntimeLayer';
import {
  LAYOUT_BUILDER_DEFAULT_TEMPLATE_SET_ACTION_ID,
  LAYOUT_BUILDER_DEFAULT_TEMPLATE_STAR_TARGET_ID,
  LAYOUT_BUILDER_DRC_BUILTIN_TEMPLATE_TARGET_ID,
  LAYOUT_BUILDER_DRC_DUPLICATE_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_SIDEBAR_TARGET_ID,
  LAYOUT_BUILDER_TEMPLATE_DUPLICATED_ACTION_ID,
} from '../../guides/layoutBuilderGuideIds';


export type SelectionType = 'template' | 'snippet' | 'library';
export interface Selection {
  type: SelectionType;
  id: string;
  templateType?: ReviewTemplateType | 'trade';
}

interface BuilderSidebarProps {
  plugin: JournalitPlugin;
  templateService: ReviewTemplateService;
  selection: Selection | null;
  onSelectionChange: (selection: Selection | null) => void;
  onTemplatesChange?: () => void;
  refreshKey?: number;
}

interface SectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  disabledMessage?: string;
}


const Section: React.FC<SectionProps> = ({
  title,
  isExpanded,
  onToggle,
  onAdd,
  children,
  disabled,
  disabledMessage,
}) => (
  <div className="template-builder-section">
    <div
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') {
          return;
        }

        e.preventDefault();
        onToggle();
      }}
      role="button"
      tabIndex={0}
      className="template-builder-section-header"
    >
      <div className="template-builder-section-title">
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`template-builder-section-chevron${
            isExpanded ? ' is-expanded' : ''
          }`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        {title}
      </div>
      {onAdd && !disabled && (
        <Tooltip content={t('builder.sidebar.new-item', { title })}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="template-builder-section-add"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </Tooltip>
      )}
    </div>
    {isExpanded && (
      <div className="template-builder-section-body">
        {disabled ? (
          <div className="template-builder-section-disabled">
            {disabledMessage || t('builder.sidebar.coming-soon')}
          </div>
        ) : (
          children
        )}
      </div>
    )}
  </div>
);


interface TemplateItemProps {
  template: ReviewTemplate;
  isSelected: boolean;
  isDefault: boolean;
  onClick: () => void;
  onSetDefault: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  containerRef?: (element: HTMLDivElement | null) => void;
  defaultStarRef?: (element: HTMLButtonElement | null) => void;
  duplicateButtonRef?: (element: HTMLButtonElement | null) => void;
  forceShowActions?: boolean;
}

const TemplateItem: React.FC<TemplateItemProps> = ({
  template,
  isSelected,
  isDefault,
  onClick,
  onSetDefault,
  onDuplicate,
  onDelete,
  containerRef,
  defaultStarRef,
  duplicateButtonRef,
  forceShowActions,
}) => (
  <div
    ref={containerRef}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key !== 'Enter' && e.key !== ' ') {
        return;
      }

      e.preventDefault();
      onClick();
    }}
    role="button"
    tabIndex={0}
    className={`sidebar-template-item ${isSelected ? 'sidebar-template-item--selected' : ''}${forceShowActions ? ' sidebar-template-item--show-actions' : ''}`}
  >
    <div className="sidebar-template-item-content">
      
      <Tooltip
        content={
          isDefault
            ? t('builder.sidebar.default-template')
            : t('builder.sidebar.set-as-default')
        }
      >
        <button
          ref={defaultStarRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!isDefault) onSetDefault();
          }}
          className={`sidebar-template-item-star${isDefault ? ' is-default' : ''}`}
          disabled={isDefault}
          aria-label={
            isDefault
              ? t('builder.sidebar.default-template')
              : t('builder.sidebar.set-as-default')
          }
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={isDefault ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </Tooltip>
      <span className="sidebar-template-item-name">{template.name}</span>
      {template.isBuiltIn && (
        <span className="sidebar-template-item-badge">
          {t('builder.sidebar.built-in')}
        </span>
      )}
    </div>

    
    <div className="template-item-actions">
      <Tooltip content={t('builder.sidebar.duplicate')}>
        <button
          ref={duplicateButtonRef}
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="template-item-action-button"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </Tooltip>
      {!template.isBuiltIn && (
        <Tooltip content={t('builder.sidebar.delete')}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="template-item-action-button template-item-action-button--danger"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </Tooltip>
      )}
    </div>
  </div>
);

function useBuilderSidebarModel({
  plugin,
  templateService,
  selection,
  onSelectionChange,
  onTemplatesChange,
  refreshKey,
}: BuilderSidebarProps) {
  const emitGuideAction = useGuideAction();
  const currentGuideStepId = useGuideCurrentStepId();
  const registerSidebarTarget = useGuideTarget(
    LAYOUT_BUILDER_SIDEBAR_TARGET_ID
  );
  const registerDrcBuiltInTemplateTarget = useGuideTarget(
    LAYOUT_BUILDER_DRC_BUILTIN_TEMPLATE_TARGET_ID
  );
  const registerDrcDuplicateButtonTarget = useGuideTarget(
    LAYOUT_BUILDER_DRC_DUPLICATE_BUTTON_TARGET_ID
  );
  const registerDefaultTemplateStarTarget = useGuideTarget(
    LAYOUT_BUILDER_DEFAULT_TEMPLATE_STAR_TARGET_ID
  );
  const guideDuplicatedTemplateIdRef = useRef<string | null>(null);

  
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    trade: true,
    drc: true,
    weekly: true,
    monthly: true,
    quarterly: true,
    yearly: true,
    library: true,
  });

  
  const [tradeTemplates, setTradeTemplates] = useState<TradeTemplate[]>([]);
  const [drcTemplates, setDrcTemplates] = useState<ReviewTemplate[]>([]);
  const [weeklyTemplates, setWeeklyTemplates] = useState<ReviewTemplate[]>([]);
  const [monthlyTemplates, setMonthlyTemplates] = useState<ReviewTemplate[]>(
    []
  );
  const [quarterlyTemplates, setQuarterlyTemplates] = useState<
    ReviewTemplate[]
  >([]);
  const [yearlyTemplates, setYearlyTemplates] = useState<ReviewTemplate[]>([]);

  
  const tradeTemplateService = React.useMemo(() => {
    return new TradeTemplateService(plugin);
  }, [plugin]);

  
  const [defaultIds, setDefaultIds] = useState<Record<string, string | null>>({
    trade: plugin.settings.templates?.defaultTrade || null,
    drc: plugin.settings.templates?.defaultDrc || null,
    weekly: plugin.settings.templates?.defaultWeekly || null,
    monthly: plugin.settings.templates?.defaultMonthly || null,
    quarterly: plugin.settings.templates?.defaultQuarterly || null,
    yearly: plugin.settings.templates?.defaultYearly || null,
  });

  
  const loadAllTemplates = useCallback(() => {
    setTradeTemplates(tradeTemplateService.getTemplates());
    setDrcTemplates(templateService.getTemplates('drc'));
    setWeeklyTemplates(templateService.getTemplates('weekly'));
    setMonthlyTemplates(templateService.getTemplates('monthly'));
    setQuarterlyTemplates(templateService.getTemplates('quarterly'));
    setYearlyTemplates(templateService.getTemplates('yearly'));
  }, [templateService, tradeTemplateService]);
  const loadAllTemplatesRef = useRef(loadAllTemplates);

  useEffect(() => {
    loadAllTemplatesRef.current = loadAllTemplates;
  }, [loadAllTemplates]);

  
  useEffect(() => {
    loadAllTemplates();
  }, [loadAllTemplates, refreshKey]);

  
  useEffect(() => {
    const handleDefaultChange = (payload: DefaultTemplateChangedPayload) => {
      setDefaultIds((prev) => ({ ...prev, [payload.type]: payload.value }));
    };

    return eventBus.subscribe('default-template:changed', handleDefaultChange);
  }, []);

  
  useEffect(() => {
    const loadCurrentTemplates = () => {
      loadAllTemplatesRef.current();
    };

    const unsubReview = eventBus.subscribe(
      'review-template:changed',
      loadCurrentTemplates
    );
    const unsubTrade = eventBus.subscribe(
      'trade-template:changed',
      loadCurrentTemplates
    );

    return () => {
      unsubReview();
      unsubTrade();
    };
  }, []);

  
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  
  const handleCreateTemplate = async (type: ReviewTemplateType) => {
    try {
      const newTemplate = await templateService.createTemplate({
        name: t('builder.sidebar.new-template-name', {
          type: type.toUpperCase(),
        }),
        type,
        isBuiltIn: false,
        widgets: [{ type: 'header', locked: true }],
      });
      loadAllTemplates();
      onSelectionChange({
        type: 'template',
        id: newTemplate.id,
        templateType: type,
      });
      onTemplatesChange?.();
      new Notice(t('notice.template-created'));
    } catch (error) {
      console.error('Failed to create template:', error);
      new Notice(t('notice.error.create-template'));
    }
  };

  
  const handleSetDefault = async (
    templateId: string,
    type: ReviewTemplateType
  ) => {
    const keyMap: Record<string, string> = {
      drc: 'defaultDrc',
      weekly: 'defaultWeekly',
      monthly: 'defaultMonthly',
      quarterly: 'defaultQuarterly',
      yearly: 'defaultYearly',
    };
    const key = keyMap[type];

    if (!plugin.settings.templates) {
      plugin.settings.templates = {
        defaultTrade: 'builtin-trade-standard',
        defaultDrc: 'builtin-drc-standard',
        defaultWeekly: 'builtin-weekly-standard',
        defaultMonthly: 'builtin-monthly-standard',
        defaultQuarterly: 'builtin-quarterly-standard',
        defaultYearly: 'builtin-yearly-standard',
      };
    }

    plugin.settings.templates[key as keyof typeof plugin.settings.templates] =
      templateId;
    await plugin.saveSettings();
    setDefaultIds((prev) => ({ ...prev, [type]: templateId }));

    eventBus.publish('default-template:changed', {
      type: type as 'drc' | 'weekly' | 'monthly' | 'quarterly',
      value: templateId,
    });

    emitGuideAction(LAYOUT_BUILDER_DEFAULT_TEMPLATE_SET_ACTION_ID);
    new Notice(t('notice.default-template-updated'));
  };

  
  const handleSetTradeDefault = async (templateId: string) => {
    if (!plugin.settings.templates) {
      plugin.settings.templates = {
        defaultTrade: 'builtin-trade-standard',
        defaultDrc: 'builtin-drc-standard',
        defaultWeekly: 'builtin-weekly-standard',
        defaultMonthly: 'builtin-monthly-standard',
        defaultQuarterly: 'builtin-quarterly-standard',
        defaultYearly: 'builtin-yearly-standard',
      };
    }

    plugin.settings.templates.defaultTrade = templateId;
    await plugin.saveSettings();
    setDefaultIds((prev) => ({ ...prev, trade: templateId }));

    eventBus.publish('default-template:changed', {
      type: 'trade',
      value: templateId,
    });

    new Notice(t('notice.default-trade-template-updated'));
  };

  useEffect(() => {
    if (
      currentGuideStepId === null ||
      currentGuideStepId === 'intro' ||
      currentGuideStepId === 'sidebar-overview' ||
      currentGuideStepId === 'pick-built-in-template'
    ) {
      guideDuplicatedTemplateIdRef.current = null;
    }
  }, [currentGuideStepId]);

  
  const handleDuplicate = async (id: string, type: ReviewTemplateType) => {
    const templatesByType: Record<ReviewTemplateType, ReviewTemplate[]> = {
      drc: drcTemplates,
      weekly: weeklyTemplates,
      monthly: monthlyTemplates,
      quarterly: quarterlyTemplates,
      yearly: yearlyTemplates,
    };
    const templates = templatesByType[type];
    const template = templates.find((t) => t.id === id);
    if (!template) return;

    try {
      if (currentGuideStepId === 'duplicate-template') {
        guideDuplicatedTemplateIdRef.current = null;
      }

      const duplicated = await templateService.duplicateTemplate(
        id,
        `${template.name} ${t('builder.sidebar.copy-suffix')}`
      );
      loadAllTemplates();
      onSelectionChange({
        type: 'template',
        id: duplicated.id,
        templateType: type,
      });
      onTemplatesChange?.();
      if (currentGuideStepId === 'duplicate-template') {
        guideDuplicatedTemplateIdRef.current = duplicated.id;
      }
      emitGuideAction(LAYOUT_BUILDER_TEMPLATE_DUPLICATED_ACTION_ID);
      new Notice(t('notice.template-duplicated'));
    } catch (error) {
      console.error('Failed to duplicate template:', error);
      new Notice(t('notice.error.duplicate-template'));
    }
  };

  const handleGuideBack = useCallback(
    async ({ toStepId }: { toStepId: string }) => {
      if (
        toStepId === 'sidebar-overview' ||
        toStepId === 'pick-built-in-template' ||
        toStepId === 'duplicate-template'
      ) {
        const duplicatedId = guideDuplicatedTemplateIdRef.current;
        if (duplicatedId) {
          await templateService.deleteTemplate(duplicatedId);
          guideDuplicatedTemplateIdRef.current = null;
          loadAllTemplates();
          onTemplatesChange?.();
        }

        onSelectionChange({
          type: 'template',
          id: 'builtin-drc-standard',
          templateType: 'drc',
        });
      }
    },
    [loadAllTemplates, onSelectionChange, onTemplatesChange, templateService]
  );

  useGuideBackHandler(handleGuideBack);

  
  const handleTradeDuplicate = async (id: string) => {
    const template = tradeTemplates.find((t) => t.id === id);
    if (!template) return;

    try {
      const duplicated = await tradeTemplateService.duplicateTemplate(
        id,
        `${template.name} ${t('builder.sidebar.copy-suffix')}`
      );
      loadAllTemplates();
      onSelectionChange({
        type: 'template',
        id: duplicated.id,
        templateType: 'trade',
      });
      onTemplatesChange?.();
      new Notice(t('notice.trade-template-duplicated'));
    } catch (error) {
      console.error('Failed to duplicate trade template:', error);
      new Notice(t('notice.error.duplicate-template'));
    }
  };

  
  const handleDelete = async (id: string, type: ReviewTemplateType) => {
    const templatesByType: Record<ReviewTemplateType, ReviewTemplate[]> = {
      drc: drcTemplates,
      weekly: weeklyTemplates,
      monthly: monthlyTemplates,
      quarterly: quarterlyTemplates,
      yearly: yearlyTemplates,
    };
    const templates = templatesByType[type];
    const template = templates.find((t) => t.id === id);
    if (!template || template.isBuiltIn) {
      new Notice(t('notice.error.cannot-delete-builtin'));
      return;
    }

    
    const shouldDelete = await showDeleteTemplateModal(
      plugin.app,
      template.name
    );
    if (!shouldDelete) return;

    try {
      await templateService.deleteTemplate(id);
      loadAllTemplates();
      if (selection?.id === id) {
        onSelectionChange(null);
      }
      onTemplatesChange?.();
      new Notice(t('notice.template-deleted'));
    } catch (error) {
      console.error('Failed to delete template:', error);
      new Notice(t('notice.error.delete-template'));
    }
  };

  
  const handleTradeDelete = async (id: string) => {
    const template = tradeTemplates.find((t) => t.id === id);
    if (!template || template.isBuiltIn) {
      new Notice(t('notice.error.cannot-delete-builtin'));
      return;
    }

    
    const shouldDelete = await showDeleteTemplateModal(
      plugin.app,
      template.name
    );
    if (!shouldDelete) return;

    try {
      await tradeTemplateService.deleteTemplate(id);
      loadAllTemplates();
      if (selection?.id === id) {
        onSelectionChange(null);
      }
      onTemplatesChange?.();
      new Notice(t('notice.trade-template-deleted'));
    } catch (error) {
      console.error('Failed to delete trade template:', error);
      new Notice(t('notice.error.delete-template'));
    }
  };

  
  const getTemplateList = (
    templates: ReviewTemplate[],
    type: ReviewTemplateType
  ) => {
    if (templates.length === 0) {
      return (
        <div className="template-builder-sidebar-empty">
          {t('builder.sidebar.no-templates')}
        </div>
      );
    }

    
    const firstBuiltIn = templates.find((t) => t.isBuiltIn);

    return templates.map((template) => {
      
      const isDefault = defaultIds[type]
        ? defaultIds[type] === template.id
        : template.id === firstBuiltIn?.id;

      const isGuideDrcBuiltIn =
        type === 'drc' &&
        template.id === firstBuiltIn?.id &&
        template.isBuiltIn;

      return (
        <TemplateItem
          key={template.id}
          template={template}
          isSelected={
            selection?.type === 'template' && selection.id === template.id
          }
          isDefault={isDefault}
          onClick={() =>
            onSelectionChange({
              type: 'template',
              id: template.id,
              templateType: type,
            })
          }
          onSetDefault={() => handleSetDefault(template.id, type)}
          onDuplicate={() => handleDuplicate(template.id, type)}
          onDelete={() => handleDelete(template.id, type)}
          containerRef={
            isGuideDrcBuiltIn ? registerDrcBuiltInTemplateTarget : undefined
          }
          defaultStarRef={
            !template.isBuiltIn &&
            selection?.type === 'template' &&
            selection.id === template.id &&
            currentGuideStepId === 'set-default-template'
              ? registerDefaultTemplateStarTarget
              : undefined
          }
          duplicateButtonRef={
            isGuideDrcBuiltIn ? registerDrcDuplicateButtonTarget : undefined
          }
          forceShowActions={
            isGuideDrcBuiltIn && currentGuideStepId === 'duplicate-template'
          }
        />
      );
    });
  };

  
  const getTradeTemplateList = () => {
    if (tradeTemplates.length === 0) {
      return (
        <div className="template-builder-sidebar-empty">
          {t('builder.sidebar.no-templates')}
        </div>
      );
    }

    
    const firstBuiltIn = tradeTemplates.find((t) => t.isBuiltIn);

    return tradeTemplates.map((template) => {
      
      const isDefault = defaultIds.trade
        ? defaultIds.trade === template.id
        : template.id === firstBuiltIn?.id;

      return (
        <TemplateItem
          key={template.id}
          template={template as unknown as ReviewTemplate}
          isSelected={
            selection?.type === 'template' && selection.id === template.id
          }
          isDefault={isDefault}
          onClick={() =>
            onSelectionChange({
              type: 'template',
              id: template.id,
              templateType: 'trade',
            })
          }
          onSetDefault={() => handleSetTradeDefault(template.id)}
          onDuplicate={() => handleTradeDuplicate(template.id)}
          onDelete={() => handleTradeDelete(template.id)}
        />
      );
    });
  };

  return {
    selection,
    onSelectionChange,
    expandedSections,
    toggleSection,
    registerSidebarTarget,
    getTradeTemplateList,
    getTemplateList,
    drcTemplates,
    weeklyTemplates,
    monthlyTemplates,
    quarterlyTemplates,
    yearlyTemplates,
    handleCreateTemplate,
  };
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = (props) => {
  const {
    selection,
    onSelectionChange,
    expandedSections,
    toggleSection,
    registerSidebarTarget,
    getTradeTemplateList,
    getTemplateList,
    drcTemplates,
    weeklyTemplates,
    monthlyTemplates,
    quarterlyTemplates,
    yearlyTemplates,
    handleCreateTemplate,
  } = useBuilderSidebarModel(props);

  return (
    <div className="template-builder-sidebar">
      
      <div className="template-builder-sidebar-header">
        <h3 className="template-builder-sidebar-title">
          {t('builder.sidebar.title')}
        </h3>
      </div>

      
      <div
        className="template-builder-sidebar-content"
        ref={registerSidebarTarget}
      >
        
        <Section
          title={t('builder.sidebar.section.trade')}
          isExpanded={expandedSections.trade}
          onToggle={() => toggleSection('trade')}
        >
          {getTradeTemplateList()}
        </Section>

        
        <Section
          title={t('builder.sidebar.section.drc')}
          isExpanded={expandedSections.drc}
          onToggle={() => toggleSection('drc')}
          onAdd={() => handleCreateTemplate('drc')}
        >
          {getTemplateList(drcTemplates, 'drc')}
        </Section>

        
        <Section
          title={t('builder.sidebar.section.weekly')}
          isExpanded={expandedSections.weekly}
          onToggle={() => toggleSection('weekly')}
          onAdd={() => handleCreateTemplate('weekly')}
        >
          {getTemplateList(weeklyTemplates, 'weekly')}
        </Section>

        
        <Section
          title={t('builder.sidebar.section.monthly')}
          isExpanded={expandedSections.monthly}
          onToggle={() => toggleSection('monthly')}
          onAdd={() => handleCreateTemplate('monthly')}
        >
          {getTemplateList(monthlyTemplates, 'monthly')}
        </Section>

        
        <Section
          title={t('builder.sidebar.section.quarterly')}
          isExpanded={expandedSections.quarterly}
          onToggle={() => toggleSection('quarterly')}
          onAdd={() => handleCreateTemplate('quarterly')}
        >
          {getTemplateList(quarterlyTemplates, 'quarterly')}
        </Section>

        
        <Section
          title={t('builder.sidebar.section.yearly')}
          isExpanded={expandedSections.yearly}
          onToggle={() => toggleSection('yearly')}
          onAdd={() => handleCreateTemplate('yearly')}
        >
          {getTemplateList(yearlyTemplates, 'yearly')}
        </Section>

        
        <div className="template-builder-sidebar-divider" />

        
        <Section
          title={t('builder.sidebar.section.library')}
          isExpanded={expandedSections.library}
          onToggle={() => toggleSection('library')}
        >
          <div className="template-builder-library-wrapper">
            <button
              onClick={() =>
                onSelectionChange({ type: 'library', id: 'share' })
              }
              className={`template-builder-library-button${
                selection?.type === 'library' ? ' is-selected' : ''
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              {t('builder.sidebar.share-template')}
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
};
