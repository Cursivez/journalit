

import React, { useId, useMemo, useState, useSyncExternalStore } from 'react';
import { Notice, TFile } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { CustomFieldRenderer } from '../../forms/trade/fields/CustomFieldRenderer';
import { CommonFields } from '../../forms/trade/fields/CommonFields';
import { DropdownSelect } from '../../shared/DropdownSelect';
import { Button } from '../../ui/Button';
import { IconButton } from '../../ui/IconButton';
import { Plus, Pencil, X } from '../../shared/icons/ObsidianIcon';
import { InvalidContextMessage } from './InvalidContextMessage';
import {
  DateDraftGateContext,
  useDateDraftGate,
} from '../../core/DateDraftGate';
import { useEventBus } from '../../../hooks/useEventBus';
import { useReviewReadOnly } from '../ReviewReadOnlyContext';
import { DisplayPolicyProvider } from '../../../contexts/DisplayPolicyContext';
import { shareCaptureExcludeProps } from '../../../services/share/brandedCapture';
import { t, tPlural } from '../../../lang/helpers';
import {
  CustomFieldType,
  type CustomFieldDefinition,
} from '../../../types/customFields';
import { isEditableJournalField } from '../../../services/trade/core/TradeJournalFields';
import {
  DAY_TRADE_FIELDS_KEY,
  customFieldRef,
  isDayTradeFieldRef,
  normalizeDayTradeFieldValue,
  diffDayTradeFieldRules,
  readDayTradeFieldRules,
  resolveDayTradeField,
  type DayTradeFieldRef,
  type DayTradeFieldRule,
  type ResolvedDayTradeField,
} from '../../../services/drc/dayTradeFields';
import type { DayTradeFieldChange } from '../../../services/drc/DayTradeFieldsService';

interface DayTradeFieldsPreviewRow {
  kind: FieldKind;
  label: string;
  values: string[];
}

interface DayTradeFieldsWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  preview?: boolean;
  previewData?: { rows: DayTradeFieldsPreviewRow[] };
}

function fieldLabel(field: ResolvedDayTradeField): string {
  if (field.kind === 'custom') return field.definition.label;
  if (field.field === 'setup') return t('form.field.setup');
  if (field.field === 'mistake') return t('widget.day-trade-fields.mistakes');
  return t('widget.day-trade-fields.tags');
}

function displayValues(field: ResolvedDayTradeField, value: unknown): string[] {
  const normalized = normalizeDayTradeFieldValue(field, value);
  if (normalized === undefined) return [];
  if (Array.isArray(normalized)) return normalized;
  if (
    field.kind === 'custom' &&
    field.definition.type === CustomFieldType.DROPDOWN
  ) {
    const option = field.definition.options?.find(
      (entry) => entry.value === normalized
    );
    if (option) return [option.label];
  }
  return [String(normalized)];
}


function useNoteFrontmatter(
  plugin: JournalitPlugin,
  filePath: string
): Record<string, unknown> | null {
  const subscribe = useMemo(
    () => (notify: () => void) => {
      const ref = plugin.app.metadataCache.on('changed', (file) => {
        if (file.path === filePath) notify();
      });
      return () => plugin.app.metadataCache.offref(ref);
    },
    [plugin, filePath]
  );
  return useSyncExternalStore(subscribe, () => {
    const file = plugin.app.vault.getAbstractFileByPath(filePath);
    return file instanceof TFile
      ? (plugin.app.metadataCache.getFileCache(file)?.frontmatter ?? null)
      : null;
  });
}

const ValueChips: React.FC<{ values: string[] }> = ({ values }) => (
  <div className="journalit-day-trade-fields-values">
    {values.length ? (
      values.map((value) => (
        <span key={value} className="journalit-day-trade-fields-chip">
          {value}
        </span>
      ))
    ) : (
      <span className="journalit-day-trade-fields-empty-value">
        {t('widget.day-trade-fields.not-set')}
      </span>
    )}
  </div>
);

type FieldKind = 'setup' | 'mistake' | 'tags' | 'custom';

function fieldKind(field: ResolvedDayTradeField): FieldKind {
  return field.kind === 'selection' ? field.field : 'custom';
}

const FieldLabel: React.FC<{ label: string }> = ({ label }) => (
  <div className="journalit-day-trade-fields-label">{label}</div>
);

export const DayTradeFieldsWidget: React.FC<DayTradeFieldsWidgetProps> =
  React.memo(({ filePath, plugin, preview, previewData }) => {
    if (preview) {
      return <DayTradeFieldsPreview rows={previewData?.rows ?? []} />;
    }
    return <DayTradeFieldsBody filePath={filePath} plugin={plugin} />;
  });

DayTradeFieldsWidget.displayName = 'DayTradeFieldsWidget';

const DayTradeFieldsPreview: React.FC<{ rows: DayTradeFieldsPreviewRow[] }> = ({
  rows,
}) => (
  <div className="journalit-reviewv2-card-wrapper">
    <div className="journalit-reviewv2-card journalit-day-trade-fields-card">
      <div className="journalit-reviewv2-card-header journalit-day-trade-fields-header">
        <div className="journalit-reviewv2-card-title journalit-reviewv2-card-title--uppercase">
          {t('widget.day-trade-fields.title')}
        </div>
      </div>
      <div className="journalit-day-trade-fields-rows">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`journalit-day-trade-fields-row journalit-day-trade-fields-row--${row.kind}`}
          >
            <div className="journalit-day-trade-fields-label">{row.label}</div>
            <ValueChips values={row.values} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface DayTradeFieldsDraft {
  
  base: DayTradeFieldRule[];
  rules: DayTradeFieldRule[];
}


interface FailedApply {
  savedRules: string;
  changes: DayTradeFieldChange[];
  paths: string[];
}

class DayTradeFieldsConflictError extends Error {}


function initialRuleValue(
  ref: DayTradeFieldRef,
  fields: CustomFieldDefinition[]
): unknown {
  const field = resolveDayTradeField(ref, fields);
  return field?.kind === 'custom' &&
    field.definition.type === CustomFieldType.NUMBER
    ? 0
    : undefined;
}

const DayTradeFieldEditor: React.FC<{
  rule: DayTradeFieldRule;
  field: ResolvedDayTradeField;
  disabled: boolean;
  onChange: (value: unknown) => void;
}> = ({ rule, field, disabled, onChange }) => (
  <div className="journalit-day-trade-fields-editor">
    <fieldset
      disabled={disabled}
      className="journalit-day-trade-fields-editor-control"
    >
      {field.kind === 'selection' ? (
        <CommonFields
          data={{
            [field.field]: Array.isArray(rule.value)
              ? rule.value.filter(
                  (entry): entry is string => typeof entry === 'string'
                )
              : [],
          }}
          errors={{}}
          fieldOrder={[field.field]}
          onChange={(_key, value) => onChange(value)}
        />
      ) : (
        <CustomFieldRenderer
          field={field.definition}
          multilineText
          value={rule.value}
          onChange={onChange}
        />
      )}
    </fieldset>
  </div>
);

const AddFieldMenu: React.FC<{
  id: string;
  options: Array<{ value: string; label: string }>;
  disabled: boolean;
  onAdd: (ref: DayTradeFieldRef) => void;
}> = ({ id, options, disabled, onAdd }) => (
  <span
    className="journalit-day-trade-fields-add-wrapper"
    {...shareCaptureExcludeProps}
  >
    <DropdownSelect
      value=""
      options={options}
      id={id}
      
      ariaLabel={t('widget.day-trade-fields.add-field')}
      ariaLabelledBy={id}
      placeholder={t('widget.day-trade-fields.add-field')}
      disabled={disabled}
      className="journalit-day-trade-fields-add"
      menuWidth="content"
      showOptionTooltips={false}
      showSelectionIndicator={false}
      leadingContent={<Plus size={14} aria-hidden="true" />}
      onChange={(value) => {
        if (isDayTradeFieldRef(value)) onAdd(value);
      }}
    />
  </span>
);

const RetryFooter: React.FC<{
  count: number;
  disabled: boolean;
  onRetry: () => void;
}> = ({ count, disabled, onRetry }) => (
  <div
    className="journalit-day-trade-fields-footer journalit-day-trade-fields-retry"
    {...shareCaptureExcludeProps}
  >
    <span className="journalit-day-trade-fields-retry-message">
      {tPlural('widget.day-trade-fields.notice-failed', count)}
    </span>
    <Button size="small" disabled={disabled} onClick={onRetry}>
      {t('widget.day-trade-fields.retry')}
    </Button>
  </div>
);

const DayTradeFieldRow: React.FC<{
  rule: DayTradeFieldRule;
  field: ResolvedDayTradeField;
  editing: boolean;
  canEdit: boolean;
  disabled: boolean;
  onChange: (value: unknown) => void;
  onRemove: () => void;
}> = ({ rule, field, editing, canEdit, disabled, onChange, onRemove }) => (
  <div
    className={`journalit-day-trade-fields-row journalit-day-trade-fields-row--${fieldKind(field)}${
      editing ? ' journalit-day-trade-fields-row--editing' : ''
    }`}
  >
    <FieldLabel label={fieldLabel(field)} />
    {editing ? (
      <DayTradeFieldEditor
        rule={rule}
        field={field}
        disabled={disabled}
        onChange={onChange}
      />
    ) : (
      <ValueChips values={displayValues(field, rule.value)} />
    )}
    {canEdit && editing && (
      <span
        className="journalit-day-trade-fields-actions"
        {...shareCaptureExcludeProps}
      >
        <IconButton
          ariaLabel={`${t('button.remove')} ${fieldLabel(field)}`}
          tooltip={false}
          disabled={disabled}
          onClick={onRemove}
        >
          <X size={14} />
        </IconButton>
      </span>
    )}
  </div>
);

const EditFooter: React.FC<{
  disabled: boolean;
  canApply: boolean;
  tradeCount: number;
  onCancel: () => void;
  onApply: () => void;
}> = ({ disabled, canApply, tradeCount, onCancel, onApply }) => (
  <div
    className="journalit-day-trade-fields-footer"
    {...shareCaptureExcludeProps}
  >
    <div className="journalit-day-trade-fields-footer-actions">
      <Button size="small" disabled={disabled} onClick={onCancel}>
        {t('button.cancel')}
      </Button>
      <Button
        variant="primary"
        size="small"
        disabled={disabled || !canApply}
        onClick={onApply}
      >
        
        {tradeCount
          ? tPlural('widget.day-trade-fields.apply', tradeCount)
          : t('button.save')}
      </Button>
    </div>
  </div>
);


function drcDayOf(
  frontmatter: ReturnType<typeof useNoteFrontmatter>
): string | null {
  return typeof frontmatter?.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date)
    ? frontmatter.date
    : null;
}


const DayTradeFieldsHeaderAction: React.FC<{
  showAddMenu: boolean;
  addFieldId: string;
  availableFields: Array<{ value: string; label: string }>;
  disabled: boolean;
  onAdd: (ref: DayTradeFieldRef) => void;
  onEdit: () => void;
}> = ({
  showAddMenu,
  addFieldId,
  availableFields,
  disabled,
  onAdd,
  onEdit,
}) => {
  if (showAddMenu) {
    return availableFields.length > 0 ? (
      <AddFieldMenu
        id={addFieldId}
        options={availableFields}
        disabled={disabled}
        onAdd={onAdd}
      />
    ) : null;
  }
  return (
    <Button
      size="small"
      className="journalit-day-trade-fields-edit-button"
      disabled={disabled}
      onClick={onEdit}
      {...shareCaptureExcludeProps}
    >
      <Pencil size={14} />
      {t('button.edit')}
    </Button>
  );
};

const DayTradeFieldsBody: React.FC<{
  filePath: string;
  plugin: JournalitPlugin;
}> = ({ filePath, plugin }) => {
  const readOnly = useReviewReadOnly();
  const frontmatter = useNoteFrontmatter(plugin, filePath);
  
  const [draft, setDraft] = useState<DayTradeFieldsDraft | null>(null);
  const [failedApply, setFailedApply] = useState<FailedApply | null>(null);
  const [busy, setBusy] = useState(false);
  
  const [tradeCount, setTradeCount] = useState(0);
  const idPrefix = useId();
  const dateDraftGate = useDateDraftGate();
  const service = plugin.dayTradeFieldsService;
  const editing = draft !== null;

  
  const customFieldsService = plugin.customFieldsService as
    | JournalitPlugin['customFieldsService']
    | undefined;
  const fields = useMemo(
    () => customFieldsService?.getFields() ?? [],
    [customFieldsService]
  );
  const rules = useMemo(
    () => readDayTradeFieldRules(frontmatter ?? undefined),
    [frontmatter]
  );
  
  const drcDay = drcDayOf(frontmatter);
  
  useEventBus(
    'trade:changed',
    () => {
      if (drcDay && service)
        setTradeCount(service.getDayTradePaths(drcDay).length);
    },
    editing
  );

  const shownRules = draft?.rules ?? rules;
  const resolvedRules = shownRules.flatMap((rule) => {
    const field = resolveDayTradeField(rule.field, fields);
    return field ? [{ rule, field }] : [];
  });
  const pending = draft
    ? diffDayTradeFieldRules(draft.base, draft.rules, fields)
    : null;
  const savedRulesKey = JSON.stringify(rules);
  const retry = failedApply?.savedRules === savedRulesKey ? failedApply : null;

  const availableFields = useMemo(() => {
    const used = new Set<string>(shownRules.map((rule) => rule.field));
    const options: Array<{ value: string; label: string }> = [];
    for (const ref of ['setup', 'mistake', 'tags'] as const) {
      const field = resolveDayTradeField(ref, fields);
      if (field && !used.has(ref))
        options.push({ value: ref, label: fieldLabel(field) });
    }
    for (const definition of [...fields].sort((a, b) => a.order - b.order)) {
      const ref = customFieldRef(definition.id);
      if (isEditableJournalField(definition) && !used.has(ref))
        options.push({ value: ref, label: definition.label });
    }
    return options;
  }, [shownRules, fields]);

  if (frontmatter?.type !== 'drc' || !drcDay) {
    return (
      <InvalidContextMessage
        widgetType={t('widget.day-trade-fields.name')}
        reason={t('widget.day-trade-fields.invalid-context')}
      />
    );
  }

  const countTrades = () =>
    setTradeCount(service?.getDayTradePaths(drcDay).length ?? 0);

  const updateDraft = (
    update: (current: DayTradeFieldRule[]) => DayTradeFieldRule[]
  ) => {
    if (!draft) countTrades();
    setDraft((current) => {
      const base = current?.base ?? rules;
      return { base, rules: update(current?.rules ?? base) };
    });
  };

  const cancel = () => setDraft(null);

  
  const applyToTrades = async (
    changes: DayTradeFieldChange[],
    tradePaths: string[],
    savedRules: string
  ) => {
    if (!service) return;
    const result = await service.applyRuleChanges(drcDay, tradePaths, changes);
    if (result.failedPaths.length) {
      setFailedApply({ savedRules, changes, paths: result.failedPaths });
      new Notice(
        tPlural(
          'widget.day-trade-fields.notice-failed',
          result.failedPaths.length
        )
      );
      return;
    }
    setFailedApply(null);
    if (result.changed > 0) {
      new Notice(
        tPlural('widget.day-trade-fields.notice-updated', result.changed)
      );
    }
  };

  const apply = async () => {
    if (!draft || !pending) return;
    
    if (!dateDraftGate.confirm()) return;
    if (!pending.changes.length) {
      cancel();
      return;
    }
    const baseKey = JSON.stringify(draft.base);
    setBusy(true);
    try {
      
      
      await plugin.drcService.updateDRCFrontmatterGuarded(
        filePath,
        { [DAY_TRADE_FIELDS_KEY]: pending.nextRules },
        (current) => {
          if (JSON.stringify(readDayTradeFieldRules(current)) !== baseKey)
            throw new DayTradeFieldsConflictError();
        },
        'day-trade-fields-widget'
      );
      cancel();
      setFailedApply(null);
      await applyToTrades(
        pending.changes,
        service?.getDayTradePaths(drcDay) ?? [],
        JSON.stringify(pending.nextRules)
      );
    } catch (error) {
      if (error instanceof DayTradeFieldsConflictError) {
        cancel();
        new Notice(t('widget.day-trade-fields.notice-conflict'));
        return;
      }
      console.error('[DayTradeFieldsWidget] Failed to save day fields:', error);
      new Notice(t('widget.day-trade-fields.notice-save-failed'));
    } finally {
      setBusy(false);
    }
  };

  const retryFailed = async () => {
    if (!retry) return;
    setBusy(true);
    try {
      await applyToTrades(retry.changes, retry.paths, retry.savedRules);
    } finally {
      setBusy(false);
    }
  };

  const setRuleValue = (ref: DayTradeFieldRef, value: unknown) =>
    updateDraft((current) =>
      current.map((rule) => (rule.field === ref ? { field: ref, value } : rule))
    );

  return (
    <div className="journalit-reviewv2-card-wrapper">
      <div
        className={`journalit-reviewv2-card journalit-day-trade-fields-card${
          editing ? ' journalit-day-trade-fields-card--editing' : ''
        }`}
      >
        <div className="journalit-reviewv2-card-header journalit-day-trade-fields-header">
          <div className="journalit-reviewv2-card-title journalit-reviewv2-card-title--uppercase">
            {t('widget.day-trade-fields.title')}
          </div>
          {!readOnly && (
            <DayTradeFieldsHeaderAction
              showAddMenu={editing || rules.length === 0}
              addFieldId={`${idPrefix}-add-field`}
              availableFields={availableFields}
              disabled={busy}
              onAdd={(ref) =>
                updateDraft((current) => [
                  ...current,
                  { field: ref, value: initialRuleValue(ref, fields) },
                ])
              }
              onEdit={() => {
                countTrades();
                setDraft({ base: rules, rules });
              }}
            />
          )}
        </div>

        <DateDraftGateContext.Provider value={dateDraftGate}>
          <DisplayPolicyProvider privacyModeOverride={false}>
            <div className="journalit-day-trade-fields-rows">
              {resolvedRules.map(({ rule, field }) => (
                <DayTradeFieldRow
                  key={rule.field}
                  rule={rule}
                  field={field}
                  editing={editing}
                  canEdit={!readOnly}
                  disabled={busy}
                  onChange={(value) => setRuleValue(rule.field, value)}
                  onRemove={() =>
                    updateDraft((current) =>
                      current.filter((entry) => entry.field !== rule.field)
                    )
                  }
                />
              ))}

              {resolvedRules.length === 0 && (
                <div className="journalit-reviewv2-empty journalit-day-trade-fields-empty">
                  {t('widget.day-trade-fields.empty')}
                </div>
              )}
            </div>
          </DisplayPolicyProvider>
        </DateDraftGateContext.Provider>

        {!readOnly && !editing && retry && (
          <RetryFooter
            count={retry.paths.length}
            disabled={busy}
            onRetry={() => void retryFailed()}
          />
        )}

        {!readOnly && editing && (
          <EditFooter
            disabled={busy}
            canApply={Boolean(pending?.changes.length)}
            tradeCount={tradeCount}
            onCancel={cancel}
            onApply={() => void apply()}
          />
        )}
      </div>
    </div>
  );
};

export {};
