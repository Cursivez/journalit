import React, { useEffect, useMemo, useState } from 'react';
import { formatDateDisplay } from '../../../utils/dateUtils';
import { usePlugin } from '../../../hooks/usePlugin';
import { t } from '../../../lang/helpers';
import { Tooltip } from '../../shared/Tooltip';
import {
  CustomFieldDefinition,
  CustomFieldType,
} from '../../../types/customFields';
import { parseStoredDateLikeValue } from '../../../utils/customFieldPersistence';
import {
  getCustomFieldDisplayValues,
  getCustomFieldRawValue,
} from '../../tradelog/customFieldDisplay';
import { PartialTradeFrontmatter } from '../../../types/TradeFrontmatter';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';

interface TradeCustomFieldsSectionProps {
  data: PartialTradeFrontmatter;
}

type DisplayEntry = {
  field: CustomFieldDefinition;
  layout: 'half' | 'full';
  kind: 'text' | 'value' | 'pills';
  value?: string;
  values?: string[];
  tooltipValues?: string[];
};

interface TooltipValueEntry {
  key: string;
  value: string;
}

function formatCompactMultiselectValue(values: string[]): string {
  if (values.length <= 2) {
    return values.join(', ');
  }

  return `${values.slice(0, 2).join(', ')} +${values.length - 2}`;
}

type DisplayRow =
  | { type: 'pair'; left: DisplayEntry; right?: DisplayEntry }
  | { type: 'full'; entry: DisplayEntry };

function formatCustomTimeValue(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatCustomNumberValue(value: unknown): string | null {
  const numericValue = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return numericValue.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function isEmptyCustomFieldValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) {
    return value.every((entry) => isEmptyCustomFieldValue(entry));
  }
  return false;
}

function getDisplayEntry(
  field: CustomFieldDefinition,
  rawValue: unknown,
  dateFormat?: string
): DisplayEntry | null {
  const rawTextValue = typeof rawValue === 'string' ? rawValue.trim() : '';

  if (isEmptyCustomFieldValue(rawValue)) {
    return null;
  }

  switch (field.type) {
    case CustomFieldType.MULTISELECT: {
      const values = getCustomFieldDisplayValues(field, rawValue);
      if (values.length === 0) {
        return null;
      }

      if (values.length <= 2) {
        return {
          field,
          layout: 'half',
          kind: 'pills',
          values,
        };
      }

      return {
        field,
        layout: 'half',
        kind: 'value',
        value: formatCompactMultiselectValue(values),
        tooltipValues: values,
      };
    }

    case CustomFieldType.DROPDOWN: {
      const value = getCustomFieldDisplayValues(field, rawValue)[0] || '';
      return value
        ? {
            field,
            layout: 'half',
            kind: 'pills',
            values: [value],
          }
        : null;
    }

    case CustomFieldType.DATE: {
      const parsedDate = parseStoredDateLikeValue(rawValue);
      const value = parsedDate
        ? formatDateDisplay(parsedDate, dateFormat)
        : String(rawValue);
      return value ? { field, layout: 'half', kind: 'value', value } : null;
    }

    case CustomFieldType.DATETIME: {
      const parsedDateTime = parseStoredDateLikeValue(rawValue, {
        includeTime: true,
      });
      const value = parsedDateTime
        ? `${formatDateDisplay(parsedDateTime, dateFormat)} ${formatCustomTimeValue(parsedDateTime)}`
        : String(rawValue);
      return value ? { field, layout: 'half', kind: 'value', value } : null;
    }

    case CustomFieldType.TIME: {
      const parsedTime = parseStoredDateLikeValue(rawValue, { timeOnly: true });
      const value = parsedTime
        ? formatCustomTimeValue(parsedTime)
        : String(rawValue);
      return value ? { field, layout: 'half', kind: 'value', value } : null;
    }

    case CustomFieldType.NUMBER: {
      const value =
        formatCustomNumberValue(rawValue) || String(rawValue).trim();
      return value ? { field, layout: 'half', kind: 'value', value } : null;
    }

    case CustomFieldType.TEXT:
    default: {
      const value = rawTextValue;
      if (!value) {
        return null;
      }

      const shouldSpanFullWidth =
        value.includes('\n') ||
        value.length > 80 ||
        value.split(' ').length > 10;

      return {
        field,
        layout: shouldSpanFullWidth ? 'full' : 'half',
        kind: 'text',
        value,
      };
    }
  }
}

function buildDisplayRows(entries: DisplayEntry[]): DisplayRow[] {
  const rows: DisplayRow[] = [];
  let pendingHalf: DisplayEntry | null = null;

  entries.forEach((entry) => {
    if (entry.layout === 'full') {
      if (pendingHalf) {
        rows.push({ type: 'pair', left: pendingHalf });
        pendingHalf = null;
      }

      rows.push({ type: 'full', entry });
      return;
    }

    if (!pendingHalf) {
      pendingHalf = entry;
      return;
    }

    rows.push({ type: 'pair', left: pendingHalf, right: entry });
    pendingHalf = null;
  });

  if (pendingHalf) {
    rows.push({ type: 'pair', left: pendingHalf });
  }

  return rows;
}

function getTooltipValueEntries(values: string[]): TooltipValueEntry[] {
  const seenCounts = new Map<string, number>();

  return values.map((value) => {
    const seenCount = seenCounts.get(value) || 0;
    seenCounts.set(value, seenCount + 1);

    return {
      key: seenCount === 0 ? value : `${value}-${seenCount}`,
      value,
    };
  });
}

function MultiselectTooltipContent({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  const valueEntries = getTooltipValueEntries(values);

  return (
    <div className="custom-tags-tooltip">
      <div className="tooltip-title">{label}</div>
      {valueEntries.map((entry) => (
        <div key={entry.key} className="tooltip-item">
          • {entry.value}
        </div>
      ))}
    </div>
  );
}

function TradeCustomFieldEntryValue({
  entry,
  maskedValue,
}: {
  entry: DisplayEntry;
  maskedValue: string | null;
}) {
  if (maskedValue) {
    return <div className="trade-custom-field-value">{maskedValue}</div>;
  }

  if (entry.kind === 'text' && entry.value) {
    return <div className="trade-custom-field-text">{entry.value}</div>;
  }

  if (entry.kind === 'value' && entry.value) {
    const content = (
      <div className="trade-custom-field-value">{entry.value}</div>
    );

    if (entry.tooltipValues && entry.tooltipValues.length > 0) {
      return (
        <div className="trade-custom-field-tooltip-anchor">
          <Tooltip
            content={
              <MultiselectTooltipContent
                label={entry.field.label}
                values={entry.tooltipValues}
              />
            }
            delay={0}
            preferredPosition="top"
          >
            {content}
          </Tooltip>
        </div>
      );
    }

    return content;
  }

  if (entry.kind === 'pills' && entry.values) {
    return (
      <div className="trade-custom-field-pills">
        {entry.values.map((value) => (
          <span
            key={`${entry.field.id}-${value}`}
            className="tag trade-custom-field-pill"
          >
            {value}
          </span>
        ))}
      </div>
    );
  }

  return null;
}

function TradeCustomFieldEntry({
  entry,
  maskedValue,
}: {
  entry: DisplayEntry;
  maskedValue: string | null;
}) {
  const isInline = entry.layout === 'half';

  return (
    <div
      className={`trade-custom-field-item${isInline ? ' trade-custom-field-item--inline' : ''}`}
    >
      <div className="trade-custom-field-label">{entry.field.label}</div>
      <TradeCustomFieldEntryValue entry={entry} maskedValue={maskedValue} />
    </div>
  );
}

function getDisplayRowKey(row: DisplayRow): string {
  return row.type === 'full'
    ? `full-${row.entry.field.id}`
    : `pair-${row.left.field.id}-${row.right?.field.id || 'empty'}`;
}

export const TradeCustomFieldsSection: React.FC<TradeCustomFieldsSectionProps> =
  React.memo(({ data }) => {
    const plugin = usePlugin();
    const { formatValue, shouldMask } = useDisplayFormatter();
    const maskedCustomFieldValue = shouldMask('metric')
      ? formatValue({ kind: 'metric', value: 0, precision: 0 })
      : null;
    const [fields, setFields] = useState<CustomFieldDefinition[]>(
      () => plugin?.customFieldsService?.getFields() || []
    );

    useEffect(() => {
      if (!plugin) return;

      const updateFields = () => {
        setFields(plugin.customFieldsService?.getFields() || []);
      };

      updateFields();
      plugin.app.workspace.on('journalit-custom-fields-changed', updateFields);

      return () => {
        plugin.app.workspace.off(
          'journalit-custom-fields-changed',
          updateFields
        );
      };
    }, [plugin]);

    const rows = useMemo(() => {
      const dateFormat = plugin?.settings.trade.dateFormat;

      const entries = fields
        .map((field) => {
          const rawValue = getCustomFieldRawValue(
            data as Record<string, unknown>,
            field
          );
          return getDisplayEntry(field, rawValue, dateFormat);
        })
        .filter((entry): entry is DisplayEntry => Boolean(entry));

      return buildDisplayRows(entries);
    }, [data, fields, plugin?.settings.trade.dateFormat]);

    if (rows.length === 0) {
      return null;
    }

    return (
      <div className="trade-custom-fields-section">
        <div className="details-card trade-custom-fields-card">
          <div className="details-header">
            <h4>{t('form.section.custom-fields')}</h4>
          </div>

          <div className="trade-custom-fields-rows">
            {rows.map((row) => {
              if (row.type === 'full') {
                return (
                  <div
                    key={getDisplayRowKey(row)}
                    className="trade-custom-fields-row trade-custom-fields-row--full"
                  >
                    <TradeCustomFieldEntry
                      entry={row.entry}
                      maskedValue={maskedCustomFieldValue}
                    />
                  </div>
                );
              }

              return (
                <div
                  key={getDisplayRowKey(row)}
                  className="trade-custom-fields-row"
                >
                  <TradeCustomFieldEntry
                    entry={row.left}
                    maskedValue={maskedCustomFieldValue}
                  />
                  {row.right ? (
                    <TradeCustomFieldEntry
                      entry={row.right}
                      maskedValue={maskedCustomFieldValue}
                    />
                  ) : (
                    <div className="trade-custom-field-item trade-custom-field-item--empty" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  });

TradeCustomFieldsSection.displayName = 'TradeCustomFieldsSection';
