

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useEventBus } from '../../hooks/useEventBus';
import { t } from '../../lang/helpers';
import type JournalitPlugin from '../../main';
import { OptionType } from '../../services/options/CustomOptionsService';
import {
  DEFAULT_KEY_LEVELS_GROUPS,
  KEY_LEVELS_GROUPS_CONFIG_KEY,
  KEY_LEVELS_SHOW_INHERITED_CONFIG_KEY,
  isDefaultKeyLevelsGroups,
  normalizeKeyLevelsGroupList,
  resolveKeyLevelsGroups,
  type KeyLevelsGroupKey,
} from '../../services/reviews/keyLevelGroups';
import type { ReviewTemplateService } from '../../services/templates/ReviewTemplateService';
import type { ReviewTemplateType, WidgetPlacement } from '../../types/reviewV2';
import { ComboBox } from '../core/ComboBox';
import { ReorderControls } from '../shared/ReorderControls';
import { SegmentedControl } from '../shared/SegmentedControl';
import { Plus, X } from '../shared/icons/ObsidianIcon';
import { Button } from '../ui/Button';


export interface KeyLevelsParentGroups {
  weekly: KeyLevelsGroupKey[] | null | undefined;
  monthly: KeyLevelsGroupKey[] | null | undefined;
}


export function useKeyLevelsParentGroups(
  templateService: ReviewTemplateService,
  templateType: ReviewTemplateType
): KeyLevelsParentGroups {
  const [reviewLayoutVersion, setReviewLayoutVersion] = useState(0);
  const bumpVersion = () => setReviewLayoutVersion((version) => version + 1);
  useEventBus('review-template:changed', bumpVersion);
  useEventBus('default-template:changed', ({ type }) => {
    if (type === 'weekly' || type === 'monthly') bumpVersion();
  });

  return useMemo(() => {
    void reviewLayoutVersion; 
    const groupsOf = (type: 'weekly' | 'monthly') => {
      const widget = templateService
        .getDefaultTemplate(type)
        .widgets.find((placement) => placement.type === 'key-levels');
      return widget ? resolveKeyLevelsGroups(widget.config) : null;
    };
    return {
      weekly: templateType === 'drc' ? groupsOf('weekly') : undefined,
      monthly:
        templateType === 'drc' || templateType === 'weekly'
          ? groupsOf('monthly')
          : undefined,
    };
  }, [reviewLayoutVersion, templateService, templateType]);
}

interface KeyLevelsConfigEditorProps {
  index: number;
  widget: WidgetPlacement;
  plugin: JournalitPlugin;
  keyLevelsParentGroups: KeyLevelsParentGroups;
  onConfigChange: (index: number, config: Record<string, unknown>) => void;
}


function formatGroups(parentGroups: KeyLevelsGroupKey[] | null): string {
  return parentGroups
    ? parentGroups
        .map((group) => group ?? t('widget.key-levels.no-group'))
        .join(', ')
    : t('templateEditor.widget.key-levels.no-widget');
}

export const KeyLevelsConfigEditor: React.FC<KeyLevelsConfigEditorProps> = ({
  index,
  widget,
  plugin,
  keyLevelsParentGroups,
  onConfigChange,
}) => {
  const groups = resolveKeyLevelsGroups(widget.config);
  
  const instruments = plugin.optionsService.getOptions(OptionType.INSTRUMENT);
  
  
  const [rows, setRows] = useState<KeyLevelsGroupKey[]>(groups);
  const [syncedConfig, setSyncedConfig] = useState(widget.config);
  if (widget.config !== syncedConfig) {
    setSyncedConfig(widget.config);
    const draftGroups = normalizeKeyLevelsGroupList(rows) ?? [null];
    if (JSON.stringify(draftGroups) !== JSON.stringify(groups)) setRows(groups);
  }
  
  const rowsRef = useRef<HTMLDivElement>(null);
  const focusAddedRowRef = useRef(false);
  useEffect(() => {
    if (!focusAddedRowRef.current) return;
    focusAddedRowRef.current = false;
    const inputs =
      rowsRef.current?.querySelectorAll<HTMLInputElement>('.combobox-input');
    inputs?.[inputs.length - 1]?.focus();
  });
  const showInherited =
    widget.config?.[KEY_LEVELS_SHOW_INHERITED_CONFIG_KEY] !== false;

  const writeConfig = (
    nextRows: KeyLevelsGroupKey[],
    nextShowInherited: boolean
  ) => {
    const {
      [KEY_LEVELS_GROUPS_CONFIG_KEY]: _groups,
      [KEY_LEVELS_SHOW_INHERITED_CONFIG_KEY]: _showInherited,
      ...rest
    } = widget.config ?? {};
    const nextGroups = normalizeKeyLevelsGroupList(nextRows);
    onConfigChange(index, {
      ...rest,
      ...(nextGroups && !isDefaultKeyLevelsGroups(nextGroups)
        ? { [KEY_LEVELS_GROUPS_CONFIG_KEY]: nextGroups }
        : {}),
      ...(nextShowInherited
        ? {}
        : { [KEY_LEVELS_SHOW_INHERITED_CONFIG_KEY]: false }),
    });
  };

  const updateRows = (nextRows: KeyLevelsGroupKey[]) => {
    setRows(nextRows);
    writeConfig(nextRows, showInherited);
  };

  const moveRow = (from: number, to: number) => {
    const nextRows = [...rows];
    const [row] = nextRows.splice(from, 1);
    nextRows.splice(to, 0, row);
    updateRows(nextRows);
  };

  const inheritsFrom = [
    keyLevelsParentGroups.weekly === undefined
      ? null
      : t('templateEditor.widget.key-levels.inherits-weekly', {
          groups: formatGroups(keyLevelsParentGroups.weekly),
        }),
    keyLevelsParentGroups.monthly === undefined
      ? null
      : t('templateEditor.widget.key-levels.inherits-monthly', {
          groups: formatGroups(keyLevelsParentGroups.monthly),
        }),
  ].filter((part): part is string => part !== null);

  
  
  
  const settleRows = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    
    
    if (
      event.relatedTarget === null &&
      event.target.getAttribute('aria-expanded') === 'true'
    ) {
      return;
    }
    const settled = normalizeKeyLevelsGroupList(rows) ?? [
      ...DEFAULT_KEY_LEVELS_GROUPS,
    ];
    if (JSON.stringify(settled) !== JSON.stringify(rows)) setRows(settled);
  };

  return (
    <div
      className="template-review-context-config template-key-levels-config"
      onBlur={settleRows}
    >
      <div className="template-widget-config-row--previous-context template-weekly-drc-config">
        <div ref={rowsRef} className="template-previous-context-sections">
          <div className="template-weekly-drc-sections-header">
            <div className="template-weekly-drc-sections-title">
              {t('templateEditor.widget.key-levels.groups')}
            </div>
            <div className="template-key-levels-add-actions">
              {!rows.includes(null) && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => updateRows([null, ...rows])}
                >
                  <Plus size={14} aria-hidden="true" />
                  {t('widget.key-levels.no-group')}
                </Button>
              )}
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  focusAddedRowRef.current = true;
                  setRows([...rows, '']);
                }}
              >
                <Plus size={14} aria-hidden="true" />
                {t('templateEditor.widget.key-levels.add-group')}
              </Button>
            </div>
          </div>
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="template-previous-context-section-row"
            >
              <div className="template-previous-context-select-wrapper">
                {row === null ? (
                  <input
                    type="text"
                    value={t('widget.key-levels.no-group')}
                    disabled
                    aria-label={t(
                      'templateEditor.widget.key-levels.group-name'
                    )}
                    className="template-key-levels-group-input"
                  />
                ) : (
                  <ComboBox
                    allowCreate
                    
                    options={instruments}
                    value={row}
                    placeholder={t(
                      'templateEditor.widget.key-levels.group-placeholder'
                    )}
                    onChange={(value) =>
                      updateRows(
                        rows.map((current, i) =>
                          i === rowIndex ? value : current
                        )
                      )
                    }
                  />
                )}
              </div>
              {rows.length > 1 && (
                <ReorderControls
                  label={row ?? t('widget.key-levels.no-group')}
                  canMoveUp={rowIndex > 0}
                  canMoveDown={rowIndex < rows.length - 1}
                  onMoveUp={() => moveRow(rowIndex, rowIndex - 1)}
                  onMoveDown={() => moveRow(rowIndex, rowIndex + 1)}
                />
              )}
              <button
                type="button"
                className="template-previous-context-remove template-previous-context-remove--icon journalit-icon-button"
                disabled={rows.length === 1}
                onClick={() =>
                  updateRows(rows.filter((_, i) => i !== rowIndex))
                }
                aria-label={t('templateEditor.widget.key-levels.remove-group')}
              >
                <X size={12} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="template-review-context-config-row">
        <div className="template-review-context-config-label">
          {t('templateEditor.widget.key-levels.inherited')}
        </div>
        <div className="template-review-context-config-control">
          <SegmentedControl
            size="small"
            ariaLabel={t('templateEditor.widget.key-levels.inherited')}
            options={[
              {
                value: 'show',
                label: t('templateEditor.widget.key-levels.inherited-show'),
              },
              {
                value: 'hide',
                label: t('templateEditor.widget.key-levels.inherited-hide'),
              },
            ]}
            value={showInherited ? 'show' : 'hide'}
            onChange={(value) => writeConfig(rows, value === 'show')}
          />
        </div>
      </div>
      {showInherited && inheritsFrom.length > 0 && (
        <div className="template-review-context-config-row">
          <div className="template-review-context-config-label">
            {t('templateEditor.widget.key-levels.inherits-from')}
          </div>
          <div className="template-widget-config-help">
            {inheritsFrom.join(' · ')}
          </div>
        </div>
      )}
    </div>
  );
};
