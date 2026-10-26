import React from 'react';
import { t } from '../../lang/helpers';
import type { CustomFieldDefinition } from '../../types/customFields';
import { MultiSelectDropdownFilter } from '../shared/MultiSelectDropdownFilter';
import {
  canPlaceTradeReviewField,
  expandTradeReviewFieldGroups,
  getTradeReviewBuiltInFieldLabel,
  isTradeReviewCustomFieldRef,
  resolveTradeReviewFieldLayout,
  toTradeReviewCustomFieldRef,
  TRADE_REVIEW_BUILT_IN_FIELDS,
  TRADE_REVIEW_FIELD_PLACEMENTS,
  type TradeReviewFieldGroup,
  type TradeReviewFieldGroups,
  type TradeReviewFieldId,
  type TradeReviewFieldLayout,
  type TradeReviewFieldPlacement,
  type TradeReviewWidgetConfig,
} from '../reviewV2/widgets/tradeReviewConfig';

const getPlacementLabel = (placement: TradeReviewFieldPlacement): string => {
  switch (placement) {
    case 'cards':
      return t('templateEditor.widget.trade-review.placement.cards');
    case 'visible':
      return t('templateEditor.widget.trade-review.placement.visible');
    case 'collapsed':
      return t('templateEditor.widget.trade-review.more-context');
  }
};

interface ListedField {
  field: TradeReviewFieldId;
  label: string;
}


export function applySectionSelection(
  groups: TradeReviewFieldGroups,
  placement: TradeReviewFieldPlacement,
  listed: readonly TradeReviewFieldId[],
  selected: readonly TradeReviewFieldId[]
): TradeReviewFieldGroups {
  const selectedSet = new Set(selected);
  const listedSet = new Set(listed);
  const added = selected.filter((field) => !listedSet.has(field));
  const removed = listed.filter((field) => !selectedSet.has(field));
  const moving = new Set([...added, ...removed]);
  const without = (fields: TradeReviewFieldId[]) =>
    fields.filter((field) => !moving.has(field));
  const next: TradeReviewFieldGroups = {
    cards: without(groups.cards),
    visible: without(groups.visible),
    collapsed: without(groups.collapsed),
    hidden: without(groups.hidden),
  };
  next[placement].push(...added);
  next.hidden.push(...removed);
  return next;
}

interface TradeReviewFieldLayoutEditorProps {
  config: TradeReviewWidgetConfig;
  customFieldDefinitions: CustomFieldDefinition[];
  onChange: (layout: TradeReviewFieldLayout) => void;
}


export const TradeReviewFieldLayoutEditor: React.FC<
  TradeReviewFieldLayoutEditorProps
> = ({ config, customFieldDefinitions, onChange }) => {
  const groups = expandTradeReviewFieldGroups(
    resolveTradeReviewFieldLayout(config),
    customFieldDefinitions.map((definition) => definition.id)
  );
  const customFieldLabels = new Map<TradeReviewFieldId, string>(
    customFieldDefinitions.map((definition) => [
      toTradeReviewCustomFieldRef(definition.id),
      definition.label,
    ])
  );

  
  
  
  const getFieldLabel = (field: TradeReviewFieldId): string | undefined => {
    if (isTradeReviewCustomFieldRef(field)) return customFieldLabels.get(field);
    if (field === 'customFields') {
      return customFieldDefinitions.length > 0
        ? t('templateEditor.widget.trade-review.future-custom-fields')
        : undefined;
    }
    return getTradeReviewBuiltInFieldLabel(field);
  };
  const getListedFields = (group: TradeReviewFieldGroup): ListedField[] =>
    groups[group].flatMap((field) => {
      const label = getFieldLabel(field);
      return label === undefined ? [] : [{ field, label }];
    });
  
  
  
  const placementByField = new Map<TradeReviewFieldId, TradeReviewFieldGroup>(
    (['cards', 'visible', 'collapsed', 'hidden'] as const).flatMap((group) =>
      groups[group].map(
        (field): [TradeReviewFieldId, TradeReviewFieldGroup] => [field, group]
      )
    )
  );
  const allFields: ListedField[] = [
    ...TRADE_REVIEW_BUILT_IN_FIELDS.filter((field) => field !== 'customFields'),
    ...customFieldDefinitions.map((definition) =>
      toTradeReviewCustomFieldRef(definition.id)
    ),
    'customFields' as const,
  ].flatMap((field) => {
    const label = getFieldLabel(field);
    return label === undefined ? [] : [{ field, label }];
  });
  const fieldIdsByValue = new Map<string, TradeReviewFieldId>(
    allFields.map(({ field }): [string, TradeReviewFieldId] => [field, field])
  );

  const commit = (next: TradeReviewFieldGroups): void => {
    onChange({
      cards: next.cards,
      visible: next.visible,
      collapsed: next.collapsed,
      
      
      hidden: next.hidden.filter(isTradeReviewCustomFieldRef),
    });
  };

  return (
    <>
      {TRADE_REVIEW_FIELD_PLACEMENTS.map((placement) => {
        const listed = getListedFields(placement);
        const sectionLabel = getPlacementLabel(placement);
        const summary =
          listed.length > 0
            ? listed.map(({ label }) => label).join(', ')
            : t('templateEditor.widget.trade-review.fields-none');
        return (
          <div
            key={placement}
            className="template-review-context-config-row template-review-context-config-row--fields"
          >
            <div className="template-review-context-config-label">
              {sectionLabel}
            </div>
            <div className="template-review-context-config-control template-review-context-field-list">
              <MultiSelectDropdownFilter
                options={allFields.flatMap(({ field, label }) => {
                  if (!canPlaceTradeReviewField(field, placement)) return [];
                  const group = placementByField.get(field);
                  return [
                    {
                      value: field,
                      label,
                      
                      detail:
                        group && group !== placement && group !== 'hidden'
                          ? getPlacementLabel(group)
                          : undefined,
                    },
                  ];
                })}
                selectedValues={listed.map(({ field }) => field)}
                summary={summary}
                ariaLabel={`${sectionLabel}: ${summary}`}
                emptyMessage={t(
                  'templateEditor.widget.trade-review.fields-none'
                )}
                classNamePrefix="template-review-context-field-filter"
                onChange={(values) =>
                  commit(
                    applySectionSelection(
                      groups,
                      placement,
                      listed.map(({ field }) => field),
                      values.flatMap((value) => {
                        const field = fieldIdsByValue.get(value);
                        return field ? [field] : [];
                      })
                    )
                  )
                }
              />
            </div>
          </div>
        );
      })}
    </>
  );
};
