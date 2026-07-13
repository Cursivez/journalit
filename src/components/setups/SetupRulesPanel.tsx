import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Notice } from 'obsidian';
import { createRoot, type Root } from 'react-dom/client';

import type JournalitPlugin from '../../main';
import type {
  Setup,
  SetupRule,
  SetupRuleCategory,
  SetupRuleGroup,
} from '../../services/setup/types';
import { t, type TranslationKey } from '../../lang/helpers';
import { useGuideTarget } from '../../guides/GuideRuntimeLayer';
import { SETUPS_DETAIL_RULES_TARGET_ID } from '../../guides/setupsGuideIds';
import { Tooltip } from '../shared/Tooltip';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Ban,
  BookOpen,
  CheckCircle,
  ClipboardCheck,
  Edit,
  Globe,
  Plus,
  Shield,
  Trash2,
  type ObsidianIconComponent,
} from '../shared/icons/ObsidianIcon';
import { Button } from '../ui/Button';
import type { SetupRuleGroupViewModel } from './setupsViewTypes';
import {
  buildEditableRuleGroups,
  buildSetupRuleGroups,
  getCategoryForRuleGroupId,
  getFallbackRuleGroupId,
  getFallbackSetupRuleGroup,
} from './setupsViewModel';

export const SetupRulesPanel: React.FC<{
  plugin: JournalitPlugin;
  setup: Setup;
}> = ({ plugin, setup }) => {
  const registerDetailRulesTarget = useGuideTarget(
    SETUPS_DETAIL_RULES_TARGET_ID
  );
  const groups = useMemo(() => buildSetupRuleGroups(setup), [setup]);
  const handleEditRules = useCallback(() => {
    openSetupRulesModal(plugin, setup);
  }, [plugin, setup]);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const handleApplyTemplate = useCallback(async () => {
    const template = createDefaultPlaybookRuleTemplate();
    setIsApplyingTemplate(true);
    try {
      const service = await plugin.serviceManager.getSetupService();
      await service.updateSetup(setup.id, template);
    } catch (error) {
      console.error(
        '[Journalit] Failed to apply setup playbook template:',
        error
      );
      new Notice(t('setups.view.detail.rules.template-error'));
    } finally {
      setIsApplyingTemplate(false);
    }
  }, [plugin.serviceManager, setup.id]);

  return (
    <aside
      className="journalit-setups-detail-scaffold__rules journalit-setups-rules-panel"
      ref={registerDetailRulesTarget}
    >
      <header className="journalit-setups-rules-panel__header">
        <div>
          <h2>{t('setups.view.detail.rules')}</h2>
        </div>
        <button
          type="button"
          className="journalit-setups-icon-button journalit-setups-detail-action-icon"
          onClick={handleEditRules}
          aria-label={t('setups.view.detail.rules.edit')}
        >
          <Edit size={15} />
        </button>
      </header>

      {groups.length === 0 ? (
        <div className="journalit-setups-rules-panel__empty">
          <div>
            <h3>{t('setups.view.detail.rules.empty-title')}</h3>
          </div>
          <div className="journalit-setups-rules-panel__template-preview">
            {getDefaultPlaybookRuleGroupPreview().map(({ Icon, label }) => (
              <span key={label}>
                <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
          <div className="journalit-setups-rules-panel__empty-actions">
            <button
              type="button"
              className="journalit-setups-button journalit-setups-button--primary"
              onClick={() => void handleApplyTemplate()}
              disabled={isApplyingTemplate}
            >
              <BookOpen size={15} strokeWidth={1.9} aria-hidden="true" />
              {isApplyingTemplate
                ? t('setups.view.detail.rules.applying-template')
                : t('setups.view.detail.rules.use-template')}
            </button>
            <button
              type="button"
              className="journalit-setups-button journalit-setups-button--ghost"
              onClick={handleEditRules}
            >
              <Plus size={15} strokeWidth={1.9} aria-hidden="true" />
              {t('setups.view.detail.rules.add-custom')}
            </button>
          </div>
        </div>
      ) : (
        <div className="journalit-setups-rules-panel__body">
          <div className="journalit-setups-rules-panel__meta">
            {t('setups.view.detail.rules.summary', {
              count: String(setup.rules.length),
              groups: String(groups.length),
            })}
          </div>
          <div className="journalit-setups-rules-grouped-chips">
            {groups.map((group) => (
              <SetupRulesChipGroup group={group} key={group.id} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

SetupRulesPanel.displayName = 'SetupRulesPanel';

const SetupRulesChipGroup: React.FC<{ group: SetupRuleGroupViewModel }> = ({
  group,
}) => {
  return (
    <section className="journalit-setups-rules-chip-group">
      <h3>{group.label}</h3>
      <ul className="journalit-setups-rules-chip-list">
        {group.rules.map((rule) => (
          <SetupRuleChip key={rule.id} rule={rule} />
        ))}
      </ul>
    </section>
  );
};

SetupRulesChipGroup.displayName = 'SetupRulesChipGroup';

const SetupRuleChip: React.FC<{ rule: SetupRule }> = ({ rule }) => {
  const tooltip = rule.description?.trim();
  const chip = (
    <div className="journalit-setups-rule-chip__content">
      <CheckCircle size={14} strokeWidth={2.1} />
      <span>{rule.label}</span>
    </div>
  );

  return (
    <li className="journalit-setups-rule-chip">
      {tooltip ? (
        <Tooltip
          content={
            <div className="journalit-setups-rule-chip-tooltip">{tooltip}</div>
          }
          delay={80}
          instantHide
          preferredPosition="top"
          triggerClassName="journalit-setups-rule-chip__tooltip-trigger"
        >
          {chip}
        </Tooltip>
      ) : (
        chip
      )}
    </li>
  );
};

SetupRuleChip.displayName = 'SetupRuleChip';

interface EditableSetupRule extends SetupRule {
  draftId: string;
}

export function moveSetupRuleWithinGroup<
  T extends {
    draftId: string;
    groupId?: string;
  },
>(rules: T[], draftId: string, direction: -1 | 1): T[] {
  const index = rules.findIndex((rule) => rule.draftId === draftId);
  if (index < 0) return rules;
  const rule = rules[index];
  const groupRules = rules.filter(
    (candidate) => candidate.groupId === rule.groupId
  );
  const groupIndex = groupRules.findIndex(
    (candidate) => candidate.draftId === draftId
  );
  const adjacentRule = groupRules[groupIndex + direction];
  if (!adjacentRule) return rules;
  const nextIndex = rules.findIndex(
    (candidate) => candidate.draftId === adjacentRule.draftId
  );
  const next = [...rules];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

const SetupRuleGroupsEditor: React.FC<{
  ruleGroups: SetupRuleGroup[];
  onAddGroup: () => void;
  onDeleteGroup: (groupId: string) => void;
  onUpdateGroupName: (groupId: string, name: string) => void;
}> = ({ ruleGroups, onAddGroup, onDeleteGroup, onUpdateGroupName }) => (
  <section className="journalit-setups-rules-editor__groups">
    <div className="journalit-setups-rules-editor__section-header">
      <span>{t('setups.view.detail.rules.groups')}</span>
      <button
        type="button"
        className="journalit-setup-secondary-action-button"
        onClick={onAddGroup}
      >
        <Plus size={14} />
        {t('setups.view.detail.rules.add-group')}
      </button>
    </div>
    {ruleGroups.map((group) => (
      <div className="journalit-setups-rules-editor__group-name" key={group.id}>
        <input
          aria-label={t('setups.view.detail.rules.field.group')}
          type="text"
          value={group.name}
          onChange={(event) => onUpdateGroupName(group.id, event.target.value)}
        />
        <button
          type="button"
          className="journalit-setups-icon-button"
          onClick={() => onDeleteGroup(group.id)}
          aria-label={`${t('button.delete')} ${group.name}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    ))}
  </section>
);

SetupRuleGroupsEditor.displayName = 'SetupRuleGroupsEditor';

const SetupRuleEditorRow: React.FC<{
  index: number;
  isFirst: boolean;
  isLast: boolean;
  rule: EditableSetupRule;
  ruleGroups: SetupRuleGroup[];
  onDelete: (draftId: string) => void;
  onMove: (draftId: string, direction: -1 | 1) => void;
  onUpdate: <K extends keyof EditableSetupRule>(
    draftId: string,
    key: K,
    value: EditableSetupRule[K]
  ) => void;
}> = ({
  index,
  isFirst,
  isLast,
  rule,
  ruleGroups,
  onDelete,
  onMove,
  onUpdate,
}) => (
  <div className="journalit-setups-rules-editor-row">
    <div className="journalit-setups-rules-editor-row__order">{index + 1}</div>
    <div className="journalit-setups-rules-editor-row__fields">
      <label>
        <span>{t('setups.view.detail.rules.field.label')}</span>
        <input
          type="text"
          value={rule.label}
          onChange={(event) =>
            onUpdate(rule.draftId, 'label', event.target.value)
          }
        />
      </label>
      <label>
        <span>{t('setups.view.detail.rules.field.description')}</span>
        <textarea
          rows={2}
          value={rule.description ?? ''}
          onChange={(event) =>
            onUpdate(rule.draftId, 'description', event.target.value)
          }
        />
      </label>
      <div className="journalit-setups-rules-editor-row__meta">
        <label>
          <span>{t('setups.view.detail.rules.field.group')}</span>
          <select
            value={rule.groupId ?? getFallbackRuleGroupId(rule.category)}
            onChange={(event) => {
              const groupId = event.target.value;
              onUpdate(rule.draftId, 'groupId', groupId);
              onUpdate(
                rule.draftId,
                'category',
                getCategoryForRuleGroupId(groupId)
              );
            }}
          >
            {ruleGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>
        <label className="journalit-setups-rules-editor-row__required">
          <input
            type="checkbox"
            checked={rule.required}
            onChange={(event) =>
              onUpdate(rule.draftId, 'required', event.target.checked)
            }
          />
          <span>{t('setups.view.detail.rule.required')}</span>
        </label>
      </div>
    </div>
    <div className="journalit-setups-rules-editor-row__actions">
      <button
        type="button"
        className="journalit-setups-icon-button"
        onClick={() => onMove(rule.draftId, -1)}
        disabled={isFirst}
        aria-label={t('setups.view.detail.rules.move-up')}
      >
        <ArrowUp size={14} />
      </button>
      <button
        type="button"
        className="journalit-setups-icon-button"
        onClick={() => onMove(rule.draftId, 1)}
        disabled={isLast}
        aria-label={t('setups.view.detail.rules.move-down')}
      >
        <ArrowDown size={14} />
      </button>
      <button
        type="button"
        className="journalit-setups-icon-button"
        onClick={() => onDelete(rule.draftId)}
        aria-label={t('setups.view.detail.rules.delete')}
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

SetupRuleEditorRow.displayName = 'SetupRuleEditorRow';

const SetupRulesEditor: React.FC<{
  plugin: JournalitPlugin;
  setup: Setup;
  onClose: () => void;
}> = ({ plugin, setup, onClose }) => {
  const initialRuleGroups = useMemo(
    () => buildEditableRuleGroups(setup),
    [setup]
  );
  const [ruleGroups, setRuleGroups] =
    useState<SetupRuleGroup[]>(initialRuleGroups);
  const [rules, setRules] = useState<EditableSetupRule[]>(() =>
    setup.rules.map((rule) => ({
      ...rule,
      groupId: rule.groupId ?? getFallbackRuleGroupId(rule.category),
      draftId: rule.id,
    }))
  );
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddRule = useCallback(() => {
    const targetGroup = ruleGroups[0] ?? getFallbackSetupRuleGroup('entry');
    if (ruleGroups.length === 0) {
      setRuleGroups([targetGroup]);
    }
    setRules((current) => [
      ...current,
      {
        id: createSetupRuleId(),
        draftId: createSetupRuleId(),
        label: '',
        description: '',
        category: 'entry',
        groupId: targetGroup.id,
        required: true,
        order: current.length,
      },
    ]);
  }, [ruleGroups]);

  const handleUseTemplate = useCallback(() => {
    const template = createDefaultPlaybookRuleTemplate();
    setRuleGroups(template.ruleGroups);
    setRules(
      template.rules.map((rule) => ({
        ...rule,
        draftId: rule.id,
      }))
    );
    setValidationError(null);
  }, []);

  const handleAddGroup = useCallback(() => {
    setRuleGroups((current) => [
      ...current,
      {
        id: createSetupRuleGroupId(),
        name: t('setups.view.detail.rules.new-group'),
        order: current.length,
      },
    ]);
  }, []);

  const handleUpdateGroupName = useCallback((groupId: string, name: string) => {
    setRuleGroups((current) =>
      current.map((group) =>
        group.id === groupId ? { ...group, name } : group
      )
    );
  }, []);

  const handleDeleteGroup = useCallback((groupId: string) => {
    setRuleGroups((current) => current.filter((group) => group.id !== groupId));
    setRules((current) => current.filter((rule) => rule.groupId !== groupId));
  }, []);

  const handleUpdateRule = useCallback(
    <K extends keyof EditableSetupRule>(
      draftId: string,
      key: K,
      value: EditableSetupRule[K]
    ) => {
      setRules((current) =>
        current.map((rule) =>
          rule.draftId === draftId ? { ...rule, [key]: value } : rule
        )
      );
    },
    []
  );

  const handleDeleteRule = useCallback((draftId: string) => {
    setRules((current) => current.filter((rule) => rule.draftId !== draftId));
  }, []);

  const handleMoveRule = useCallback((draftId: string, direction: -1 | 1) => {
    setRules((current) =>
      moveSetupRuleWithinGroup(current, draftId, direction)
    );
  }, []);

  const handleSave = useCallback(async () => {
    const hasBlankRule = rules.some((rule) => rule.label.trim().length === 0);
    if (hasBlankRule) {
      setValidationError(t('setups.view.detail.rules.validation-label'));
      return;
    }
    const hasBlankGroup = ruleGroups.some(
      (group) => group.name.trim().length === 0
    );
    if (hasBlankGroup) {
      setValidationError(t('setups.view.detail.rules.validation-group'));
      return;
    }

    const normalizedRuleGroups = ruleGroups.map(
      (group, index): SetupRuleGroup => ({
        id: group.id,
        name: group.name.trim(),
        order: index,
      })
    );

    const normalizedRules = rules.map(
      (rule, index): SetupRule => ({
        id: rule.id,
        label: rule.label.trim(),
        description: rule.description?.trim() || undefined,
        category: rule.category,
        groupId: rule.groupId,
        required: rule.required,
        order: index,
      })
    );

    setSaving(true);
    try {
      const service = await plugin.serviceManager.getSetupService();
      await service.updateSetup(setup.id, {
        rules: normalizedRules,
        ruleGroups: normalizedRuleGroups,
      });
      onClose();
    } catch (error) {
      console.error('[Journalit] Failed to save setup rules:', error);
      new Notice(t('setups.view.detail.rules.save-error'));
    } finally {
      setSaving(false);
    }
  }, [onClose, plugin.serviceManager, ruleGroups, rules, setup.id]);

  return (
    <div className="journalit-setups-rules-editor">
      <div className="journalit-setups-rules-editor__body">
        {validationError ? (
          <div className="journalit-setups-rules-editor__error">
            {validationError}
          </div>
        ) : null}
        <SetupRuleGroupsEditor
          ruleGroups={ruleGroups}
          onAddGroup={handleAddGroup}
          onDeleteGroup={handleDeleteGroup}
          onUpdateGroupName={handleUpdateGroupName}
        />
        {rules.length === 0 ? (
          <div className="journalit-setups-rules-editor__empty">
            <h3>{t('setups.view.detail.rules.empty-title')}</h3>
            <button
              type="button"
              className="journalit-setups-button journalit-setups-button--primary"
              onClick={handleUseTemplate}
            >
              {t('setups.view.detail.rules.use-template')}
            </button>
          </div>
        ) : (
          rules.map((rule, index) => {
            const groupRules = rules.filter(
              (candidate) => candidate.groupId === rule.groupId
            );
            const groupIndex = groupRules.findIndex(
              (candidate) => candidate.draftId === rule.draftId
            );
            return (
              <SetupRuleEditorRow
                index={index}
                isFirst={groupIndex === 0}
                isLast={groupIndex === groupRules.length - 1}
                key={rule.draftId}
                rule={rule}
                ruleGroups={ruleGroups}
                onDelete={handleDeleteRule}
                onMove={handleMoveRule}
                onUpdate={handleUpdateRule}
              />
            );
          })
        )}
      </div>

      <footer className="journalit-setups-rules-editor__footer">
        <button
          type="button"
          className="journalit-setup-secondary-action-button"
          onClick={handleAddRule}
        >
          <Plus size={14} />
          {t('setups.view.detail.rules.add')}
        </button>
        <div className="journalit-modal-actions">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={saving}
            className="journalit-modal-actions__cancel cancel-button"
          >
            {t('button.cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              void handleSave();
            }}
            disabled={saving}
            className="journalit-modal-actions__primary accent-button"
          >
            {t('button.save')}
          </Button>
        </div>
      </footer>
    </div>
  );
};

SetupRulesEditor.displayName = 'SetupRulesEditor';

class SetupRulesModal extends Modal {
  private root: Root | null = null;

  constructor(
    private plugin: JournalitPlugin,
    private setup: Setup
  ) {
    super(plugin.app);
  }

  onOpen(): void {
    this.contentEl.empty();
    this.titleEl.setText(t('setups.view.detail.rules.edit'));
    this.modalEl.addClass('journalit-setups-rules-modal');
    this.root = createRoot(this.contentEl);
    this.root.render(
      <SetupRulesEditor
        plugin={this.plugin}
        setup={this.setup}
        onClose={() => this.close()}
      />
    );
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    this.contentEl.empty();
  }
}

function openSetupRulesModal(plugin: JournalitPlugin, setup: Setup): void {
  new SetupRulesModal(plugin, setup).open();
}

function createSetupRuleId(): string {
  return `rule_${Math.random().toString(36).slice(2, 10)}`;
}

function createSetupRuleGroupId(): string {
  return `group_${Math.random().toString(36).slice(2, 10)}`;
}

type PlaybookRuleTemplateGroup = {
  id: string;
  labelKey: TranslationKey;
  ruleKey: TranslationKey;
  category: SetupRuleCategory;
  Icon: ObsidianIconComponent;
};

const PLAYBOOK_RULE_TEMPLATE_GROUPS: PlaybookRuleTemplateGroup[] = [
  {
    id: 'group_best_conditions',
    labelKey: 'setups.view.detail.rules.template.best-conditions',
    ruleKey: 'setups.view.detail.rules.template.rule.best-conditions',
    category: 'context',
    Icon: Globe,
  },
  {
    id: 'group_entry_criteria',
    labelKey: 'setups.view.detail.rules.template.entry-criteria',
    ruleKey: 'setups.view.detail.rules.template.rule.entry-criteria',
    category: 'entry',
    Icon: ClipboardCheck,
  },
  {
    id: 'group_invalidation',
    labelKey: 'setups.view.detail.rules.template.invalidation',
    ruleKey: 'setups.view.detail.rules.template.rule.invalidation',
    category: 'invalidation',
    Icon: Shield,
  },
  {
    id: 'group_risk_management',
    labelKey: 'setups.view.detail.rules.template.risk-management',
    ruleKey: 'setups.view.detail.rules.template.rule.risk-management',
    category: 'risk',
    Icon: BookOpen,
  },
  {
    id: 'group_avoid_when',
    labelKey: 'setups.view.detail.rules.template.avoid-when',
    ruleKey: 'setups.view.detail.rules.template.rule.avoid-when',
    category: 'invalidation',
    Icon: Ban,
  },
  {
    id: 'group_common_mistakes',
    labelKey: 'setups.view.detail.rules.template.common-mistakes',
    ruleKey: 'setups.view.detail.rules.template.rule.common-mistakes',
    category: 'psychology',
    Icon: AlertTriangle,
  },
];

function getDefaultPlaybookRuleGroupPreview(): Array<{
  Icon: ObsidianIconComponent;
  label: string;
}> {
  return PLAYBOOK_RULE_TEMPLATE_GROUPS.map((group) => ({
    Icon: group.Icon,
    label: t(group.labelKey),
  }));
}

function createDefaultPlaybookRuleTemplate(): {
  ruleGroups: SetupRuleGroup[];
  rules: SetupRule[];
} {
  return {
    ruleGroups: PLAYBOOK_RULE_TEMPLATE_GROUPS.map((group, index) => ({
      id: group.id,
      name: t(group.labelKey),
      order: index,
    })),
    rules: PLAYBOOK_RULE_TEMPLATE_GROUPS.map((group, index) => ({
      id: createSetupRuleId(),
      label: t(group.ruleKey),
      category: group.category,
      groupId: group.id,
      required: true,
      order: index,
    })),
  };
}
