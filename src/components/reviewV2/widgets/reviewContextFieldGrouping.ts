import type {
  CustomReviewFieldDefinition,
  CustomReviewFieldGroup,
} from '../../../types/reviewCustomFields';

interface GroupedReviewFields {
  groupKey: string;
  group: string;
  fields: CustomReviewFieldDefinition[];
}

export function groupReviewFieldsByConfiguredOrder(
  fields: readonly CustomReviewFieldDefinition[],
  groups: readonly CustomReviewFieldGroup[],
  defaultGroupLabel: string
): GroupedReviewFields[] {
  const groupMetadata = new Map(groups.map((group) => [group.id, group]));
  const groupedFields = new Map<
    string,
    GroupedReviewFields & { order: number }
  >();

  for (const field of fields) {
    const metadata = field.groupId
      ? groupMetadata.get(field.groupId)
      : undefined;
    const groupKey = metadata?.id ?? 'ungrouped';
    const existing = groupedFields.get(groupKey) ?? {
      groupKey,
      group: metadata?.name ?? defaultGroupLabel,
      order: metadata?.order ?? Number.MAX_SAFE_INTEGER,
      fields: [],
    };
    existing.fields.push(field);
    groupedFields.set(groupKey, existing);
  }

  return Array.from(groupedFields.values())
    .sort((a, b) => a.order - b.order)
    .map(({ groupKey, group, fields: groupFields }) => ({
      groupKey,
      group,
      fields: groupFields.sort(
        (a, b) => (a.display.order ?? a.order) - (b.display.order ?? b.order)
      ),
    }));
}
