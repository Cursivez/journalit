import type { PropChallengeRule } from '../../propChallenge/types';
import { normalizePropChallengeRule } from '../../propChallenge/normalization';
import { isRecord } from './configurationPrimitives';



const toSnake = (key: string): string =>
  key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const toCamel = (key: string): string =>
  key.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase());

function convertValue(
  value: unknown,
  convert: (key: string) => string
): unknown {
  if (Array.isArray(value)) {
    return value.map((item: unknown) => convertValue(item, convert));
  }
  return isRecord(value) ? convertRecord(value, convert) : value;
}

function convertRecord(
  value: Readonly<Record<string, unknown>>,
  convert: (key: string) => string
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, item]) =>
      item === undefined ? [] : [[convert(key), convertValue(item, convert)]]
    )
  );
}


export function ruleToWire(rule: PropChallengeRule): Record<string, unknown> {
  const { id, ...settings } = rule;
  return { rule_id: id, ...convertRecord(settings, toSnake) };
}


export function ruleFromWire(
  wire: Readonly<Record<string, unknown>>,
  id: string
): PropChallengeRule | null {
  
  const settings = convertRecord(wire, toCamel);
  delete settings.ruleId;
  return normalizePropChallengeRule({ ...settings, id });
}
