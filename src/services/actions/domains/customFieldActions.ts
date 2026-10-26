import {
  CustomFieldType,
  validateFieldLabel,
  type CustomFieldDefinition,
  type DropdownOption,
} from '../../../types/customFields';
import { t, tPlural } from '../../../lang/helpers';
import {
  normalizeCustomFieldLabel,
  type CustomFieldsService,
} from '../../CustomFieldsService';
import {
  customFieldOrderRevision,
  customFieldRevision,
  projectCustomFieldConfiguration,
  wireCustomFieldValidation,
  type WireCustomFieldValidation,
} from '../../agent/configuration/customFieldConfiguration';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionDefinitions,
  type ActionInput,
  type ActionPlanContext,
  type ActionSummary,
} from '../ActionTypes';
import { throwIfAborted } from './tradeActionSupport';
import { restoringFieldUpdate } from './customFieldRestore';

type CustomFieldActionId =
  | 'custom_field.create'
  | 'custom_field.update'
  | 'custom_field.delete'
  | 'custom_field.reorder';
type FieldChanges = ActionInput<'custom_field.update'>['fields'];
type ChangedField =
  ActionSummary<'custom_field.update'>['changed_fields'][number];

const CHANGED_FIELD_ORDER: readonly ChangedField[] = [
  'label',
  'options',
  'validation',
  'placeholder',
  'helper_text',
  'allow_create_options',
];

interface CustomFieldActionDependencies {
  service: Pick<
    CustomFieldsService,
    | 'getFields'
    | 'getField'
    | 'getFieldOptions'
    | 'addField'
    | 'updateField'
    | 'removeField'
    | 'reorderFields'
    | 'validateRegexPattern'
  >;
  
  countTradesWithValue(fieldId: string, signal: AbortSignal): Promise<number>;
}

function isChoice(type: CustomFieldType): boolean {
  return (
    type === CustomFieldType.DROPDOWN || type === CustomFieldType.MULTISELECT
  );
}


function storedValidation(
  validation: WireCustomFieldValidation
): NonNullable<CustomFieldDefinition['validation']> {
  return {
    ...(validation.required === undefined
      ? {}
      : { required: validation.required }),
    ...(validation.min === undefined ? {} : { min: validation.min }),
    ...(validation.max === undefined ? {} : { max: validation.max }),
    ...(validation.min_length === undefined
      ? {}
      : { minLength: validation.min_length }),
    ...(validation.max_length === undefined
      ? {}
      : { maxLength: validation.max_length }),
    ...(validation.pattern === undefined
      ? {}
      : { pattern: validation.pattern }),
  };
}


function validateSettings(
  type: CustomFieldType,
  settings: {
    options?: readonly DropdownOption[];
    validation?: WireCustomFieldValidation;
    allow_create_options?: boolean;
  },
  prefix: string,
  isSafePattern: (pattern: string) => boolean
): void {
  if (!isChoice(type)) {
    if (settings.options !== undefined)
      throw new ActionPlanError('invalid_request', `${prefix}options`);
    if (settings.allow_create_options !== undefined)
      throw new ActionPlanError(
        'invalid_request',
        `${prefix}allow_create_options`
      );
  }
  const values = new Set<string>();
  for (const option of settings.options ?? []) {
    const value = option.value.trim().toLowerCase();
    if (
      value === '' ||
      option.label.trim() === '' ||
      option.value !== option.value.trim() ||
      option.label !== option.label.trim() ||
      values.has(value)
    ) {
      throw new ActionPlanError('invalid_request', `${prefix}options`);
    }
    values.add(value);
  }
  const validation = settings.validation;
  if (!validation) return;
  const field = `${prefix}validation`;
  const hasRange = validation.min !== undefined || validation.max !== undefined;
  const hasText =
    validation.min_length !== undefined ||
    validation.max_length !== undefined ||
    validation.pattern !== undefined;
  if (
    (hasRange && type !== CustomFieldType.NUMBER) ||
    (hasText && type !== CustomFieldType.TEXT) ||
    (validation.min !== undefined &&
      validation.max !== undefined &&
      validation.min > validation.max) ||
    (validation.min_length !== undefined &&
      validation.max_length !== undefined &&
      validation.min_length > validation.max_length)
  ) {
    throw new ActionPlanError('invalid_request', field);
  }
  if (validation.pattern !== undefined) {
    let compiles = true;
    try {
      new RegExp(validation.pattern);
    } catch {
      compiles = false;
    }
    if (!compiles || !isSafePattern(validation.pattern)) {
      throw new ActionPlanError('invalid_request', `${field}.pattern`);
    }
  }
}

function validateLabel(
  label: string,
  fields: readonly CustomFieldDefinition[],
  except: string | undefined,
  field: string
): void {
  if (label.trim() !== label || label === '' || validateFieldLabel(label)) {
    throw new ActionPlanError('invalid_request', field);
  }
  const normalized = normalizeCustomFieldLabel(label);
  if (
    fields.some(
      (candidate) =>
        candidate.id !== except &&
        normalizeCustomFieldLabel(candidate.label) === normalized
    )
  ) {
    throw new ActionPlanError('conflict', field);
  }
}

function sameOptions(
  current: readonly DropdownOption[] | undefined,
  next: readonly DropdownOption[]
): boolean {
  const left = (current ?? []).map((option) => [option.value, option.label]);
  return (
    JSON.stringify(left) ===
    JSON.stringify(next.map((option) => [option.value, option.label]))
  );
}


function changedFields(
  field: CustomFieldDefinition,
  changes: FieldChanges
): ChangedField[] {
  const changed = new Set<ChangedField>();
  if (changes.label !== undefined && changes.label !== field.label)
    changed.add('label');
  if (
    changes.options !== undefined &&
    !sameOptions(field.options, changes.options)
  )
    changed.add('options');
  if (
    changes.validation !== undefined &&
    JSON.stringify(wireCustomFieldValidation(field)) !==
      JSON.stringify(
        wireCustomFieldValidation({
          ...field,
          validation: storedValidation(changes.validation),
        })
      )
  )
    changed.add('validation');
  if (
    changes.placeholder !== undefined &&
    (changes.placeholder ?? undefined) !== (field.placeholder || undefined)
  )
    changed.add('placeholder');
  if (
    changes.helper_text !== undefined &&
    (changes.helper_text ?? undefined) !== (field.helperText || undefined)
  )
    changed.add('helper_text');
  if (
    changes.allow_create_options !== undefined &&
    changes.allow_create_options !== (field.allowCreateOptions === true)
  )
    changed.add('allow_create_options');
  return CHANGED_FIELD_ORDER.filter((name) => changed.has(name));
}


function definitionPatch(
  changes: FieldChanges,
  changed: readonly ChangedField[]
): Partial<CustomFieldDefinition> {
  const patch: Partial<CustomFieldDefinition> = {};
  for (const name of changed) {
    switch (name) {
      case 'label':
        patch.label = changes.label;
        break;
      case 'options':
        patch.options = (changes.options ?? []).map((option) => ({
          value: option.value,
          label: option.label,
        }));
        break;
      case 'validation':
        patch.validation = storedValidation(changes.validation ?? {});
        break;
      case 'placeholder':
        patch.placeholder = changes.placeholder ?? undefined;
        break;
      case 'helper_text':
        patch.helperText = changes.helper_text ?? undefined;
        break;
      case 'allow_create_options':
        patch.allowCreateOptions = changes.allow_create_options;
        break;
    }
  }
  return patch;
}

function fieldLabel(name: ChangedField): string {
  return t(`actions.custom-field.field.${name}`);
}

function typeLabel(type: CustomFieldType): string {
  switch (type) {
    case CustomFieldType.DROPDOWN:
      return t('settings.customization.custom-fields.type-dropdown');
    case CustomFieldType.MULTISELECT:
      return t('settings.customization.custom-fields.type-multiselect');
    default:
      return t(`settings.customization.custom-fields.type.${type}`);
  }
}


const FIELD_TYPES: ReadonlySet<string> = new Set(
  Object.values(CustomFieldType)
);

function isCustomFieldType(value: string): value is CustomFieldType {
  return FIELD_TYPES.has(value);
}

export function createCustomFieldActions(
  deps: CustomFieldActionDependencies
): Pick<ActionDefinitions, CustomFieldActionId> {
  const { service } = deps;
  const isSafePattern = (pattern: string) =>
    service.validateRegexPattern(pattern);
  const requireField = (fieldId: string): CustomFieldDefinition => {
    const field = service.getField(fieldId);
    if (!field) throw new ActionPlanError('not_found', 'field_id');
    return field;
  };
  const projectOrder = () =>
    projectCustomFieldConfiguration(service.getFields(), (fieldId) =>
      service.getFieldOptions(fieldId)
    );

  const create: ActionDefinition<'custom_field.create'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      
      if (!isCustomFieldType(input.type)) {
        throw new ActionPlanError('invalid_request', 'type');
      }
      const type = input.type;
      validateLabel(input.label, service.getFields(), undefined, 'label');
      validateSettings(type, input, '', isSafePattern);
      const options = input.options ?? [];
      return {
        target: `custom_field:new:${input.label.toLowerCase()}`,
        summary: {
          label: input.label,
          type: input.type,
          option_count: options.length,
        },
        affectedNotes: 0,
        display: {
          target: input.label,
          changes: [
            t('actions.custom-field.create', {
              label: input.label,
              type: typeLabel(type),
            }),
          ],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          try {
            validateLabel(input.label, service.getFields(), undefined, 'label');
          } catch {
            throw new ActionExecutionError('conflict', false);
          }
          let field: CustomFieldDefinition;
          try {
            field = await service.addField({
              label: input.label,
              type,
              options: options.map((option) => ({
                value: option.value,
                label: option.label,
              })),
              validation: storedValidation(input.validation ?? {}),
              ...(input.placeholder === undefined
                ? {}
                : { placeholder: input.placeholder }),
              ...(input.helper_text === undefined
                ? {}
                : { helperText: input.helper_text }),
              ...(input.allow_create_options === undefined
                ? {}
                : { allowCreateOptions: input.allow_create_options }),
            });
          } catch {
            throw new ActionExecutionError('write_failed', true);
          }
          return {
            field_id: field.id,
            revision: await customFieldRevision(field),
          };
        },
      };
    },
  };

  const update: ActionDefinition<'custom_field.update'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      const field = requireField(input.field_id);
      const baseRevision = await customFieldRevision(field);
      if (baseRevision !== input.expected_revision) {
        throw new ActionPlanError('conflict', 'expected_revision');
      }
      if (input.fields.label !== undefined) {
        validateLabel(
          input.fields.label,
          service.getFields(),
          field.id,
          'fields.label'
        );
      }
      validateSettings(field.type, input.fields, 'fields.', isSafePattern);
      const changed = changedFields(field, input.fields);
      return {
        target: `custom_field:${field.id}`,
        summary: {
          field_id: field.id,
          base_revision: baseRevision,
          changed_fields: changed,
        },
        affectedNotes: 0,
        display: {
          target: field.label,
          changes:
            changed.length === 0
              ? []
              : [
                  t('actions.setup.update', {
                    fields: changed.map(fieldLabel).join(', '),
                  }),
                ],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          const current = service.getField(field.id);
          if (!current) throw new ActionExecutionError('not_found', false);
          if ((await customFieldRevision(current)) !== baseRevision) {
            throw new ActionExecutionError('conflict', false);
          }
          if (changed.length === 0) {
            return new ActionExecution(
              { field_id: field.id, revision: baseRevision },
              { restoreInput: 'unchanged' }
            );
          }
          let updated: CustomFieldDefinition | null;
          try {
            updated = await service.updateField(
              field.id,
              definitionPatch(input.fields, changed)
            );
          } catch {
            throw new ActionExecutionError('write_failed', true);
          }
          if (!updated) throw new ActionExecutionError('not_found', false);
          const revision = await customFieldRevision(updated);
          const result = { field_id: field.id, revision };
          if (context.origin !== 'agent') {
            return new ActionExecution(result, { restoreInput: null });
          }
          return new ActionExecution(result, {
            restoreInput: await restoringFieldUpdate(
              current,
              updated,
              revision,
              changed,
              (stored, fields) => ({
                ...stored,
                ...definitionPatch(fields, changedFields(stored, fields)),
              }),
              
              (fields) => {
                if (fields.label !== undefined) {
                  validateLabel(
                    fields.label,
                    service.getFields(),
                    current.id,
                    'fields.label'
                  );
                }
                validateSettings(
                  current.type,
                  fields,
                  'fields.',
                  isSafePattern
                );
              }
            ),
          });
        },
      };
    },
  };

  const remove: ActionDefinition<'custom_field.delete'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      const field = requireField(input.field_id);
      
      
      const [baseRevision, tradesWithValues] = await Promise.all([
        customFieldRevision(field),
        deps.countTradesWithValue(field.id, context.signal),
      ]);
      throwIfAborted(context.signal);
      return {
        target: `custom_field:${field.id}`,
        summary: {
          field_id: field.id,
          label: field.label,
          trades_with_values: tradesWithValues,
        },
        
        affectedNotes: 0,
        display: {
          target: field.label,
          changes: [
            tradesWithValues === 0
              ? t('actions.custom-field.delete-unused')
              : tPlural('actions.custom-field.delete', tradesWithValues),
          ],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          const current = service.getField(field.id);
          if (!current) throw new ActionExecutionError('not_found', false);
          if ((await customFieldRevision(current)) !== baseRevision) {
            throw new ActionExecutionError('conflict', false);
          }
          try {
            await service.removeField(field.id);
          } catch {
            throw new ActionExecutionError('write_failed', true);
          }
          return { field_id: field.id };
        },
      };
    },
  };

  const reorder: ActionDefinition<'custom_field.reorder'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      const projection = await projectOrder();
      if (projection.revision !== input.expected_revision) {
        throw new ActionPlanError('conflict', 'expected_revision');
      }
      const listed = projection.fields.map((field) => field.field_id);
      const requested = new Set(input.field_ids);
      if (
        input.field_ids.length !== listed.length ||
        !listed.every((id) => requested.has(id))
      ) {
        throw new ActionPlanError('invalid_request', 'field_ids');
      }
      return {
        target: 'custom_fields:order',
        summary: {
          base_revision: projection.revision,
          field_ids: [...input.field_ids],
        },
        affectedNotes: 0,
        display: {
          target: t('actions.custom-field.order-target'),
          changes: [
            t('actions.custom-field.reorder', {
              labels: input.field_ids
                .map((id) => service.getField(id)?.label ?? id)
                .join(', '),
            }),
          ],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          const fields = service.getFields();
          if ((await customFieldOrderRevision(fields)) !== projection.revision)
            throw new ActionExecutionError('conflict', false);
          
          const unlisted = fields.flatMap((field) =>
            requested.has(field.id) ? [] : [field.id]
          );
          try {
            await service.reorderFields([...input.field_ids, ...unlisted]);
          } catch {
            throw new ActionExecutionError('write_failed', true);
          }
          return {
            revision: await customFieldOrderRevision(service.getFields()),
          };
        },
      };
    },
  };

  return {
    'custom_field.create': create,
    'custom_field.update': update,
    'custom_field.delete': remove,
    'custom_field.reorder': reorder,
  };
}
