

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { TemplateSharingService } from '../../../services/templates/TemplateSharingService';
import { ReviewTemplateService } from '../../../services/templates/ReviewTemplateService';
import { TradeTemplateService } from '../../../services/templates/TradeTemplateService';
import type { ReviewTemplate, TradeTemplate } from '../../../types/reviewV2';
import { eventBus } from '../../../services/events';
import { t } from '../../../lang/helpers';
import { writeClipboardText } from '../../../utils/clipboard';
export const LIBRARY_TAB_STYLES = `
		.library-tab {
			max-width: 800px;
			margin: 0 auto;
		}

		.library-tab .library-section {
			margin-bottom: 32px;
		}

		.library-tab .library-divider {
			margin: 32px 0;
			border: none;
			border-top: 1px solid var(--background-modifier-border);
		}

		.library-tab .library-section-title {
			font-size: 18px;
			font-weight: 600;
			color: var(--text-normal);
			margin: 0 0 8px 0;
		}

		.library-tab .library-code-textarea {
			font-family: 'Courier New', Courier, monospace;
			font-size: 12px;
			resize: vertical;
		}

		.library-tab .library-preview {
			display: flex;
			align-items: flex-start;
			gap: 12px;
			padding: 16px;
			border-radius: 8px;
			margin-top: 16px;
		}

		.library-tab .library-preview-success {
			background: rgba(var(--color-green-rgb, 76, 175, 80), 0.1);
			border: 1px solid rgba(var(--color-green-rgb, 76, 175, 80), 0.4);
		}

		.library-tab .library-preview-error {
			background: rgba(var(--color-red-rgb, 233, 30, 99), 0.1);
			border: 1px solid rgba(var(--color-red-rgb, 233, 30, 99), 0.4);
		}

		.library-tab .library-preview-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 24px;
			height: 24px;
			border-radius: 50%;
			font-weight: bold;
			font-size: 16px;
			flex-shrink: 0;
		}

		.library-tab .library-preview-success .library-preview-icon {
			background: rgba(var(--color-green-rgb, 76, 175, 80), 0.9);
			color: white;
		}

		.library-tab .library-preview-error .library-preview-icon {
			background: rgba(var(--color-red-rgb, 233, 30, 99), 0.9);
			color: white;
		}

		.library-tab .library-preview-content {
			flex: 1;
		}

		.library-tab .library-preview-title {
			font-weight: 600;
			color: var(--text-normal);
			margin-bottom: 4px;
		}

		.library-tab .library-preview-details {
			font-size: 13px;
			color: var(--text-muted);
		}

		.library-tab .library-preview-success .library-preview-title {
			color: rgba(var(--color-green-rgb, 76, 175, 80), 1);
		}

		.library-tab .library-preview-error .library-preview-title {
			color: rgba(var(--color-red-rgb, 233, 30, 99), 1);
		}

		.library-tab .library-preview-success .library-preview-details,
		.library-tab .library-preview-error .library-preview-details {
			color: var(--text-normal);
		}

		.library-tab .template-actions {
			display: flex;
			gap: 12px;
			margin-top: 16px;
		}

		.library-tab .library-export-result {
			margin-top: 24px;
			padding: 20px;
			background: var(--background-secondary);
			border-radius: 8px;
			border: 1px solid var(--background-modifier-border);
		}

		.library-tab .library-empty-state {
			padding: 24px;
			background: var(--background-secondary);
			border-radius: 8px;
			border: 1px dashed var(--background-modifier-border);
			text-align: center;
			margin-top: 16px;
		}

		.library-tab .library-empty-state p {
			margin: 0;
			color: var(--text-muted);
		}

		.library-tab .library-empty-state p:first-child {
			font-weight: 500;
			color: var(--text-normal);
			margin-bottom: 8px;
		}

		.library-tab .library-empty-hint {
			font-size: 13px;
		}
`;

interface LibraryTabProps {
  plugin: JournalitPlugin;
  reviewTemplateService: ReviewTemplateService;
  tradeTemplateService: TradeTemplateService;
}

type ImportStatus = 'idle' | 'validating' | 'valid' | 'invalid';

type LibraryTemplateItem =
  | {
      id: string;
      name: string;
      type: ReviewTemplate['type'];
      template: ReviewTemplate;
    }
  | {
      id: string;
      name: string;
      type: 'trade';
      template: TradeTemplate;
    };

interface ImportPreview {
  type: string;
  name: string;
}

function useLibraryTabModel({
  reviewTemplateService,
  tradeTemplateService,
}: Omit<LibraryTabProps, 'plugin'>) {
  
  const [importCode, setImportCode] = useState<string>('');
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(
    null
  );

  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [exportedCode, setExportedCode] = useState<string | null>(null);

  
  const [sharingService] = useState(() => new TemplateSharingService());

  
  const [allTemplates, setAllTemplates] = useState<LibraryTemplateItem[]>([]);

  
  useLayoutEffect(() => {}, []);

  
  const loadTemplates = useCallback(() => {
    const templates: LibraryTemplateItem[] = [];

    
    const drcTemplates = reviewTemplateService.getTemplates('drc');
    const weeklyTemplates = reviewTemplateService.getTemplates('weekly');
    const monthlyTemplates = reviewTemplateService.getTemplates('monthly');
    const quarterlyTemplates = reviewTemplateService.getTemplates('quarterly');
    const yearlyTemplates = reviewTemplateService.getTemplates('yearly');

    drcTemplates
      .filter((t: ReviewTemplate) => !t.isBuiltIn)
      .forEach((t: ReviewTemplate) => {
        templates.push({ id: t.id, name: t.name, type: 'drc', template: t });
      });

    weeklyTemplates
      .filter((t: ReviewTemplate) => !t.isBuiltIn)
      .forEach((t: ReviewTemplate) => {
        templates.push({ id: t.id, name: t.name, type: 'weekly', template: t });
      });

    monthlyTemplates
      .filter((t: ReviewTemplate) => !t.isBuiltIn)
      .forEach((t: ReviewTemplate) => {
        templates.push({
          id: t.id,
          name: t.name,
          type: 'monthly',
          template: t,
        });
      });

    quarterlyTemplates
      .filter((t: ReviewTemplate) => !t.isBuiltIn)
      .forEach((t: ReviewTemplate) => {
        templates.push({
          id: t.id,
          name: t.name,
          type: 'quarterly',
          template: t,
        });
      });

    yearlyTemplates
      .filter((t: ReviewTemplate) => !t.isBuiltIn)
      .forEach((t: ReviewTemplate) => {
        templates.push({ id: t.id, name: t.name, type: 'yearly', template: t });
      });

    
    const tradeTemplates = tradeTemplateService.getTemplates();
    tradeTemplates
      .filter((t: TradeTemplate) => !t.isBuiltIn)
      .forEach((t: TradeTemplate) => {
        templates.push({ id: t.id, name: t.name, type: 'trade', template: t });
      });

    setAllTemplates(templates);
  }, [reviewTemplateService, tradeTemplateService]);
  const loadTemplatesRef = useRef(loadTemplates);

  useEffect(() => {
    loadTemplatesRef.current = loadTemplates;
  }, [loadTemplates]);

  
  const getTranslatedType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'drc':
        return t('library.type.drc');
      case 'weekly':
        return t('library.type.weekly');
      case 'monthly':
        return t('library.type.monthly');
      case 'quarterly':
        return t('library.type.quarterly');
      case 'yearly':
        return t('library.type.yearly');
      case 'trade':
        return t('library.type.trade');
      default:
        return type;
    }
  };

  
  useEffect(() => {
    const loadCurrentTemplates = () => {
      loadTemplatesRef.current();
    };

    loadCurrentTemplates();

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

  
  const handleValidate = () => {
    if (!importCode.trim()) {
      setImportStatus('idle');
      setImportError(null);
      setImportPreview(null);
      return;
    }

    setImportStatus('validating');
    setImportError(null);
    setImportPreview(null);

    const validation = sharingService.validateShareCode(importCode.trim());

    if (validation.valid && validation.payload) {
      setImportStatus('valid');
      setImportPreview({
        type: validation.templateType || validation.payload.type,
        name: validation.templateName || validation.payload.name,
      });
    } else {
      setImportStatus('invalid');
      setImportError(validation.error || t('library.error.invalid-share-code'));
    }
  };

  const handleImport = async () => {
    if (importStatus !== 'valid' || !importCode.trim()) {
      return;
    }

    try {
      const imported = await sharingService.importTemplate(
        importCode.trim(),
        reviewTemplateService,
        tradeTemplateService
      );

      new Notice(t('library.notice.import-success', { name: imported.name }));

      
      setImportCode('');
      setImportStatus('idle');
      setImportError(null);
      setImportPreview(null);

      
      loadTemplates();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t('library.error.import-failed');
      setImportError(errorMessage);
      setImportStatus('invalid');
      new Notice(errorMessage, 5000);
    }
  };

  
  const handleExport = () => {
    if (!selectedTemplateId) {
      new Notice(t('library.notice.select-template'));
      return;
    }

    const templateData = allTemplates.find((t) => t.id === selectedTemplateId);
    if (!templateData) {
      new Notice(t('library.notice.template-not-found'));
      return;
    }

    try {
      let code: string;

      if (templateData.type === 'trade') {
        code = sharingService.exportTradeTemplate(templateData.template);
      } else {
        code = sharingService.exportReviewTemplate(templateData.template);
      }

      setExportedCode(code);
      new Notice(t('library.notice.code-generated'));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t('library.error.export-failed');
      new Notice(errorMessage, 5000);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!exportedCode) {
      return;
    }

    try {
      await writeClipboardText(exportedCode);
      new Notice(t('library.notice.copied'));
    } catch {
      new Notice(t('library.error.copy-failed'), 5000);
    }
  };

  return {
    importCode,
    setImportCode,
    importStatus,
    setImportStatus,
    importError,
    setImportError,
    importPreview,
    setImportPreview,
    selectedTemplateId,
    setSelectedTemplateId,
    exportedCode,
    setExportedCode,
    allTemplates,
    getTranslatedType,
    handleValidate,
    handleImport,
    handleExport,
    handleCopyToClipboard,
  };
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  plugin: _plugin,
  reviewTemplateService,
  tradeTemplateService,
}) => {
  const {
    importCode,
    setImportCode,
    importStatus,
    setImportStatus,
    importError,
    setImportError,
    importPreview,
    setImportPreview,
    selectedTemplateId,
    setSelectedTemplateId,
    exportedCode,
    setExportedCode,
    allTemplates,
    getTranslatedType,
    handleValidate,
    handleImport,
    handleExport,
    handleCopyToClipboard,
  } = useLibraryTabModel({ reviewTemplateService, tradeTemplateService });

  return (
    <div className="library-tab">
      
      <div className="library-section library-import">
        <h3 className="library-section-title">{t('library.title.import')}</h3>
        <p className="setting-item-description">{t('library.desc.import')}</p>

        <div className="template-form-field">
          <label className="template-form-label">
            {t('library.label.share-code')}
          </label>
          <textarea
            className="template-form-input library-code-textarea"
            placeholder={t('library.placeholder.import-code')}
            value={importCode}
            onChange={(e) => {
              setImportCode(e.target.value);
              setImportStatus('idle');
              setImportError(null);
              setImportPreview(null);
            }}
            rows={6}
          />
        </div>

        <div className="template-actions">
          <button
            className="template-action-button template-action-button--secondary"
            onClick={() => void handleValidate()}
            disabled={!importCode.trim()}
          >
            {importStatus === 'validating'
              ? t('library.button.validating')
              : t('library.button.validate')}
          </button>

          <button
            className="template-action-button template-action-button--primary"
            onClick={() => void handleImport()}
            disabled={importStatus !== 'valid'}
          >
            {t('library.button.import')}
          </button>
        </div>

        
        {importStatus === 'valid' && importPreview && (
          <div className="library-preview library-preview-success">
            <div className="library-preview-icon">✓</div>
            <div className="library-preview-content">
              <div className="library-preview-title">
                {t('library.preview.valid')}
              </div>
              <div className="library-preview-details">
                <strong>{importPreview.name}</strong> (
                {getTranslatedType(importPreview.type)})
              </div>
            </div>
          </div>
        )}

        {importStatus === 'invalid' && importError && (
          <div className="library-preview library-preview-error">
            <div className="library-preview-icon">✗</div>
            <div className="library-preview-content">
              <div className="library-preview-title">
                {t('library.preview.invalid')}
              </div>
              <div className="library-preview-details">{importError}</div>
            </div>
          </div>
        )}
      </div>

      <hr className="library-divider" />

      
      <div className="library-section library-export">
        <h3 className="library-section-title">{t('library.title.export')}</h3>
        <p className="setting-item-description">{t('library.desc.export')}</p>

        {allTemplates.length === 0 ? (
          <div className="library-empty-state">
            <p>{t('library.empty.title')}</p>
            <p className="library-empty-hint">{t('library.empty.hint')}</p>
          </div>
        ) : (
          <>
            <div className="template-form-field">
              <label className="template-form-label">
                {t('library.label.select-template')}
              </label>
              <select
                className="template-form-input"
                value={selectedTemplateId || ''}
                onChange={(e) => {
                  setSelectedTemplateId(e.target.value || null);
                  setExportedCode(null);
                }}
              >
                <option value="">{t('library.option.select-template')}</option>
                {allTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({getTranslatedType(t.type)})
                  </option>
                ))}
              </select>
            </div>

            <div className="template-actions">
              <button
                className="template-action-button template-action-button--primary"
                onClick={() => void handleExport()}
                disabled={!selectedTemplateId}
              >
                {t('library.button.generate-code')}
              </button>
            </div>
          </>
        )}

        
        {exportedCode && (
          <div className="library-export-result">
            <div className="template-form-field">
              <label className="template-form-label">
                {t('library.label.share-code')}
              </label>
              <textarea
                className="template-form-input library-code-textarea"
                value={exportedCode}
                readOnly
                rows={6}
                onClick={(e) => e.currentTarget.select()}
              />
            </div>

            <div className="template-actions">
              <button
                className="template-action-button template-action-button--secondary template-action-btn"
                onClick={() => void handleCopyToClipboard()}
              >
                {t('library.button.copy-code')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


