

import React from 'react';
import { t } from '../../lang/helpers';
import type { TradeNoteBodySection } from '../../types/reviewV2';
import { generateUUID } from '../../utils/uuid';
import { ReorderControls } from '../shared/ReorderControls';
import { Plus, X } from '../shared/icons/ObsidianIcon';

const HEADER_LEVELS = [1, 2, 3, 4, 5, 6];

interface TradeNoteSectionsPanelProps {
  canEdit: boolean;
  sections: TradeNoteBodySection[];
  onChange: (sections: TradeNoteBodySection[]) => void;
}

function getSectionLabel(section: TradeNoteBodySection): string {
  return section.type === 'header'
    ? section.text.trim() || t('widget.markdown-header.name')
    : t('widget.markdown-zone.name');
}

export const TradeNoteSectionsPanel: React.FC<TradeNoteSectionsPanelProps> = ({
  canEdit,
  sections,
  onChange,
}) => {
  const update = (index: number, next: TradeNoteBodySection) =>
    onChange(sections.map((section, i) => (i === index ? next : section)));

  const move = (index: number, direction: -1 | 1) => {
    const next = [...sections];
    const [item] = next.splice(index, 1);
    next.splice(index + direction, 0, item);
    onChange(next);
  };

  const remove = (index: number) =>
    onChange(sections.filter((_, i) => i !== index));

  const add = (type: TradeNoteBodySection['type']) =>
    onChange([
      ...sections,
      type === 'header'
        ? { id: generateUUID(), type, level: 2, text: '' }
        : { id: generateUUID(), type, text: '' },
    ]);

  return (
    <div className="template-editor-panel">
      <h3 className="template-editor-section-title template-editor-section-title--compact">
        {t('template.editor.note-sections')}
      </h3>
      <div className="template-section-row__description template-trade-note-sections__description">
        {t('template.editor.note-sections-desc')}
      </div>

      {sections.length > 0 && (
        <div className="template-trade-note-sections">
          {sections.map((section, index) => (
            <div key={section.id} className="template-trade-note-section">
              {section.type === 'header' ? (
                <div className="template-trade-note-section__fields">
                  <select
                    aria-label={t('widget.markdown-header.name')}
                    value={section.level}
                    disabled={!canEdit}
                    onChange={(e) =>
                      update(index, {
                        ...section,
                        level: Number(e.target.value),
                      })
                    }
                    className="template-select"
                  >
                    {HEADER_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        H{level}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={section.text}
                    disabled={!canEdit}
                    onChange={(e) =>
                      update(index, { ...section, text: e.target.value })
                    }
                    aria-label={t(
                      'templateEditor.widget.header-text-placeholder'
                    )}
                    placeholder={t(
                      'templateEditor.widget.header-text-placeholder'
                    )}
                    className="template-input template-input--compact template-trade-note-section__input"
                  />
                </div>
              ) : (
                <div className="template-trade-note-section__fields">
                  <textarea
                    value={section.text}
                    disabled={!canEdit}
                    onChange={(e) =>
                      update(index, { ...section, text: e.target.value })
                    }
                    aria-label={t(
                      'templateEditor.widget.markdown-zone-text-label'
                    )}
                    placeholder={t(
                      'template.editor.note-sections-zone-placeholder'
                    )}
                    className="template-input template-widget-config-textarea template-trade-note-section__input"
                    rows={3}
                  />
                </div>
              )}
              <div className="template-trade-note-section__actions">
                <ReorderControls
                  label={getSectionLabel(section)}
                  canMoveUp={canEdit && index > 0}
                  canMoveDown={canEdit && index < sections.length - 1}
                  onMoveUp={() => move(index, -1)}
                  onMoveDown={() => move(index, 1)}
                  buttonClassName="template-section-move-button"
                />
                <button
                  type="button"
                  className="journalit-native-button template-section-action template-section-remove"
                  aria-label={`${t('button.remove')}: ${getSectionLabel(section)}`}
                  disabled={!canEdit}
                  onClick={() => remove(index)}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {canEdit && (
        <div className="template-trade-note-sections__add">
          <button
            type="button"
            className="journalit-native-button template-action-button template-action-button--neutral template-action-button--compact"
            onClick={() => add('header')}
          >
            <Plus size={13} aria-hidden="true" />
            {t('widget.markdown-header.name')}
          </button>
          <button
            type="button"
            className="journalit-native-button template-action-button template-action-button--neutral template-action-button--compact"
            onClick={() => add('zone')}
          >
            <Plus size={13} aria-hidden="true" />
            {t('widget.markdown-zone.name')}
          </button>
        </div>
      )}
    </div>
  );
};
