

import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  useContextualGuideResolution,
  useGuideBackHandler,
  useGuideCurrentStepId,
} from '../../guides/GuideRuntimeLayer';
import {
  LAYOUT_BUILDER_MAIN_GUIDE_ID,
  LAYOUT_BUILDER_WHATS_NEW_INSERT_WIDGET_GUIDE_ID,
} from '../../guides/layoutBuilderGuideIds';
import { isLayoutBuilderInsertWidgetWhatsNewEligible } from '../../guides/layoutBuilderWhatsNewInsertWidgetGuide';
import { useCanHover } from './WidgetInsertSlot';
import { WorkspaceLeaf, ItemView } from 'obsidian';
import { usePlugin } from '../../hooks/usePlugin';
import { BuilderSidebar, Selection } from './BuilderSidebar';
import { TemplateEditor } from './TemplateEditor';
import { TradeTemplateEditor } from './TradeTemplateEditor';
import { LibraryTab } from './tabs/LibraryTab';
import { ReviewTemplateService } from '../../services/templates/ReviewTemplateService';
import { TradeTemplateService } from '../../services/templates/TradeTemplateService';
import { t } from '../../lang/helpers';
import { showUnsavedChangesModal } from './UnsavedChangesModal';

interface TemplateBuilderProps {
  leaf: WorkspaceLeaf;
  view: ItemView;
}

const TemplateBuilderRenderer: React.FC<TemplateBuilderProps> = (
  _props: TemplateBuilderProps
) => {
  
  const plugin = usePlugin();
  const [selection, setSelection] = useState<Selection | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  
  
  
  const [isLayoutEditable, setIsLayoutEditable] = useState(false);
  const canHover = useCanHover();
  const isInsertWidgetWhatsNewEligible =
    isLayoutBuilderInsertWidgetWhatsNewEligible(
      plugin?.viewGuideService?.getPersistedGuideState(
        LAYOUT_BUILDER_MAIN_GUIDE_ID
      ) ?? null
    );
  const contextualGuides = useMemo(
    () => [
      {
        guideId: LAYOUT_BUILDER_WHATS_NEW_INSERT_WIDGET_GUIDE_ID,
        active: isLayoutEditable && canHover && isInsertWidgetWhatsNewEligible,
      },
    ],
    [canHover, isInsertWidgetWhatsNewEligible, isLayoutEditable]
  );
  useContextualGuideResolution({
    baseGuideId: LAYOUT_BUILDER_MAIN_GUIDE_ID,
    contextualGuides,
  });
  
  const templateService = useMemo(() => {
    if (!plugin) return null;
    return new ReviewTemplateService(plugin);
  }, [plugin]);

  
  const tradeTemplateService = useMemo(() => {
    if (!plugin) return null;
    return new TradeTemplateService(plugin);
  }, [plugin]);

  
  const isDirtyRef = useRef(false);

  
  const handleDirtyStateChange = useCallback((isDirty: boolean) => {
    isDirtyRef.current = isDirty;
  }, []);

  
  const pendingSelectionRef = useRef<Selection | null>(null);

  
  const isSameSelection = useCallback(
    (a: Selection | null, b: Selection | null): boolean => {
      if (a === null && b === null) return true;
      if (a === null || b === null) return false;
      return (
        a.type === b.type && a.id === b.id && a.templateType === b.templateType
      );
    },
    []
  );

  
  
  
  const handleSelectionChange = useCallback(
    async (newSelection: Selection | null): Promise<boolean> => {
      
      if (isSameSelection(selection, newSelection)) {
        return true;
      }

      
      if (selection && isDirtyRef.current && plugin) {
        pendingSelectionRef.current = newSelection;
        const shouldDiscard = await showUnsavedChangesModal(plugin.app);
        if (shouldDiscard) {
          isDirtyRef.current = false;
          setSelection(pendingSelectionRef.current);
        }
        pendingSelectionRef.current = null;
        return shouldDiscard;
      }

      setSelection(newSelection);
      return true;
    },
    [selection, plugin, isSameSelection]
  );

  
  const handleTemplatesChange = useCallback(() => {
    if (templateService) {
      templateService.reload();
    }
    if (tradeTemplateService) {
      tradeTemplateService.reload();
    }
    
    setRefreshKey((k) => k + 1);
  }, [templateService, tradeTemplateService]);

  
  
  
  
  const currentGuideStepId = useGuideCurrentStepId();
  const guideCreatedLayoutRef = useRef<{
    created: Selection;
    source: Selection | null;
  } | null>(null);
  const handleLayoutCreated = useCallback(
    (created: Selection, source: Selection | null) => {
      guideCreatedLayoutRef.current =
        currentGuideStepId === 'create-own-layout' ? { created, source } : null;
    },
    [currentGuideStepId]
  );
  const handleGuideBack = useCallback(
    async ({ toStepId }: { toStepId: string }) => {
      const made = guideCreatedLayoutRef.current;
      if (toStepId !== 'create-own-layout' || !made || !templateService) {
        return;
      }
      guideCreatedLayoutRef.current = null;
      const layoutType = made.created.templateType;
      if (!layoutType || layoutType === 'trade') return;

      const layout = templateService
        .getTemplates(layoutType)
        .find((template) => template.id === made.created.id);
      if (
        layout &&
        !layout.isBuiltIn &&
        layout.version === 1 &&
        !isDirtyRef.current
      ) {
        await templateService.deleteTemplate(layout.id);
        handleTemplatesChange();
        setSelection(made.source);
        return;
      }
      
      
      await handleSelectionChange(made.source);
    },
    [handleSelectionChange, handleTemplatesChange, templateService]
  );
  useGuideBackHandler(handleGuideBack);

  
  if (!plugin || !templateService || !tradeTemplateService) {
    return (
      <div className="template-builder-loading">
        {t('template.builder.loading')}
      </div>
    );
  }

  
  const getContent = () => {
    if (!selection) {
      return (
        <div className="template-builder-empty">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="template-builder-empty-icon"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <div className="template-builder-empty-title">
            {t('template.builder.select-template')}
          </div>
          <div className="template-builder-empty-subtitle">
            {t('template.builder.create-from-sidebar')}
          </div>
        </div>
      );
    }

    if (selection.type === 'template' && selection.templateType === 'trade') {
      return (
        <TradeTemplateEditor
          plugin={plugin}
          tradeTemplateService={tradeTemplateService}
          templateId={selection.id}
          onTemplateChange={handleTemplatesChange}
          onDirtyStateChange={handleDirtyStateChange}
        />
      );
    }

    if (
      selection.type === 'template' &&
      selection.templateType &&
      selection.templateType !== 'trade'
    ) {
      return (
        <TemplateEditor
          plugin={plugin}
          templateService={templateService}
          templateId={selection.id}
          templateType={selection.templateType}
          onTemplateChange={handleTemplatesChange}
          onDirtyStateChange={handleDirtyStateChange}
          onCanEditChange={setIsLayoutEditable}
          openInEditor={selection.openInEditor === true}
        />
      );
    }

    if (selection.type === 'library') {
      return (
        <div className="template-builder-library-container">
          <LibraryTab
            plugin={plugin}
            reviewTemplateService={templateService}
            tradeTemplateService={tradeTemplateService}
          />
        </div>
      );
    }

    if (selection.type === 'snippet') {
      return (
        <div className="template-builder-placeholder">
          {t('template.builder.snippet-coming-soon')}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="template-builder-shell">
      
      <BuilderSidebar
        plugin={plugin}
        templateService={templateService}
        tradeTemplateService={tradeTemplateService}
        selection={selection}
        onSelectionChange={handleSelectionChange}
        onTemplatesChange={() => void handleTemplatesChange()}
        refreshKey={refreshKey}
        onLayoutCreated={handleLayoutCreated}
      />

      
      <div className="template-builder-main">
        
        <div className="template-builder-main-content">{getContent()}</div>
      </div>
    </div>
  );
};


export default React.memo(TemplateBuilderRenderer);
