import type { ActionId } from '../ActionTypes';
import type { ActionCall } from '../ActionBatchService';
import { isRecord } from '../../agent/configuration/configurationPrimitives';
import type { SettingsKind } from '../../agent/configuration/configurationChangeTypes';
import {
  SETTINGS_KINDS,
  isValidSettingsValue,
  settingsFieldPaths,
} from '../../agent/configuration/settingsConfiguration';




const SETTINGS_RESTORE_ACTIONS: ReadonlyMap<ActionId, SettingsKind> = new Map(
  SETTINGS_KINDS.map((kind) => [`settings.${kind}`, kind])
);


function isSettingsRestoreValues(kind: SettingsKind, value: unknown): boolean {
  if (!isRecord(value)) return false;
  const fields = settingsFieldPaths(kind);
  const keys = Object.keys(value);
  return (
    keys.length > 0 &&
    keys.every(
      (field) =>
        fields.has(field) && isValidSettingsValue(kind, field, value[field])
    )
  );
}


function settingsRestoreInput(
  result: Readonly<Record<string, unknown>>,
  restoreInput: unknown
): Readonly<Record<string, unknown>> | 'unchanged' | null {
  if (restoreInput === 'unchanged') return 'unchanged';
  if (!isRecord(restoreInput)) return null;
  const revision = result.resulting_revision;
  return typeof revision === 'string' &&
    revision.length > 0 &&
    restoreInput.expected_revision === revision
    ? restoreInput
    : null;
}


interface SettingsRestoreShape {
  readonly required: Readonly<Record<string, (value: unknown) => boolean>>;
}

const SETTINGS_RESTORE_SHAPES = new Map<unknown, SettingsRestoreShape>(
  [...SETTINGS_RESTORE_ACTIONS].map(([action, kind]) => [
    action,
    {
      required: {
        expected_revision: (value) =>
          typeof value === 'string' && value.length > 0,
        values: (value) => isSettingsRestoreValues(kind, value),
      },
    },
  ])
);


export function settingsRestoreShape(
  action: unknown
): SettingsRestoreShape | undefined {
  return SETTINGS_RESTORE_SHAPES.get(action);
}


export function settingsInverse(
  action: ActionId,
  result: Readonly<Record<string, unknown>>,
  restoreInput: unknown,
  call: (
    action: ActionId,
    input: Readonly<Record<string, unknown>>
  ) => ActionCall
): { calls: ActionCall[] } | null {
  if (!SETTINGS_RESTORE_ACTIONS.has(action)) return null;
  const restore = settingsRestoreInput(result, restoreInput);
  if (restore === null) return null;
  return { calls: restore === 'unchanged' ? [] : [call(action, restore)] };
}
