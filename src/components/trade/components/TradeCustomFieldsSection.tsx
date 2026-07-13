import React, { useEffect, useMemo, useState } from 'react';
import { formatDateDisplay } from '../../../utils/dateUtils';
import { usePlugin } from '../../../hooks/usePlugin';
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

type TradeCustomFieldDisplayEntry = {
  field: CustomFieldDefinition;
  layout: 'half' | 'full';
  kind: 'text' | 'value';
  value?: string;
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
): TradeCustomFieldDisplayEntry | null {
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
          kind: 'value',
          value: values.join(', '),
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
            kind: 'value',
            value,
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

function getTradeCustomFieldDisplayEntries(
  data: PartialTradeFrontmatter,
  fields: CustomFieldDefinition[],
  dateFormat?: string
): TradeCustomFieldDisplayEntry[] {
  return fields.reduce<TradeCustomFieldDisplayEntry[]>((acc, field) => {
    const rawValue = getCustomFieldRawValue(
      data as Record<string, unknown>,
      field
    );
    const entry = getDisplayEntry(field, rawValue, dateFormat);
    if (entry) {
      acc.push(entry);
    }
    return acc;
  }, []);
}

export function hasTradeCustomFieldDisplayEntries(
  data: PartialTradeFrontmatter,
  fields: CustomFieldDefinition[],
  dateFormat?: string
): boolean {
  return getTradeCustomFieldDisplayEntries(data, fields, dateFormat).length > 0;
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
  entry: TradeCustomFieldDisplayEntry;
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

  return null;
}

function TradeCustomFieldEntry({
  entry,
  maskedValue,
}: {
  entry: TradeCustomFieldDisplayEntry;
  maskedValue: string | null;
}) {
  return (
    <div className="trade-custom-field-item">
      <div className="trade-custom-field-label">{entry.field.label}</div>
      <TradeCustomFieldEntryValue entry={entry} maskedValue={maskedValue} />
    </div>
  );
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

    const entries = useMemo(() => {
      const dateFormat = plugin?.settings.trade.dateFormat;
      return getTradeCustomFieldDisplayEntries(data, fields, dateFormat);
    }, [data, fields, plugin?.settings.trade.dateFormat]);

    if (entries.length === 0) {
      return null;
    }

    return (
      <div className="trade-custom-fields-subsection">
        <div className="trade-custom-fields-rows">
          {entries.map((entry) => (
            <TradeCustomFieldEntry
              key={entry.field.id}
              entry={entry}
              maskedValue={maskedCustomFieldValue}
            />
          ))}
        </div>
      </div>
    );
  });

TradeCustomFieldsSection.displayName = 'TradeCustomFieldsSection';
