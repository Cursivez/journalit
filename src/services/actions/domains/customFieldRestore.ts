import type { CustomFieldDefinition } from '../../../types/customFields';
import {
  customFieldRevision,
  wireCustomFieldValidation,
} from '../../agent/configuration/customFieldConfiguration';
import { ActionPlanError } from '../ActionErrors';
import type { ActionInput, ActionSummary } from '../ActionTypes';

type FieldUpdateInput = ActionInput<'custom_field.update'>;
type FieldChanges = FieldUpdateInput['fields'];
type ChangedField =
  ActionSummary<'custom_field.update'>['changed_fields'][number];


export async function restoringFieldUpdate(
  previous: CustomFieldDefinition,
  updated: CustomFieldDefinition,
  revision: string,
  changed: readonly ChangedField[],
  apply: (
    field: CustomFieldDefinition,
    fields: FieldChanges
  ) => CustomFieldDefinition,
  validate: (fields: FieldChanges) => void
): Promise<FieldUpdateInput | null> {
  try {
    const fields: FieldChanges = {};
    for (const name of changed) {
      switch (name) {
        case 'label':
          fields.label = previous.label;
          break;
        case 'options':
          fields.options = (previous.options ?? []).map((option) => ({
            value: option.value,
            label: option.label,
          }));
          break;
        case 'validation': {
          const validation = wireCustomFieldValidation(previous);
          if (!validation) return null;
          fields.validation = validation;
          break;
        }
        
        case 'placeholder':
          fields.placeholder = previous.placeholder ?? null;
          break;
        case 'helper_text':
          fields.helper_text = previous.helperText ?? null;
          break;
        case 'allow_create_options':
          fields.allow_create_options = previous.allowCreateOptions === true;
          break;
      }
    }
    if (Object.keys(fields).length === 0) return null;
    validate(fields);
    const [restored, expected] = await Promise.all([
      customFieldRevision(apply(updated, fields)),
      customFieldRevision(previous),
    ]);
    return restored === expected
      ? { field_id: previous.id, expected_revision: revision, fields }
      : null;
  } catch (error) {
    
    
    if (error instanceof ActionPlanError) return null;
    console.warn('[Journalit] Could not capture a custom field change:', error);
    return null;
  }
}
