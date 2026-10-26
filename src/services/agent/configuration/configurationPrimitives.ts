import { defineOwnEntry } from '../../../utils/defineOwnEntry';

const OPAQUE_CONFIGURATION_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isBoundedString(
  value: unknown,
  maximum: number,
  allowEmpty = false
): value is string {
  if (typeof value !== 'string') return false;
  const length = Array.from(value).length;
  return (allowEmpty || length > 0) && length <= maximum;
}

export function boundedText(
  value: unknown,
  maximum: number
): string | undefined {
  return typeof value === 'string'
    ? Array.from(value).slice(0, maximum).join('')
    : undefined;
}

export function isOpaqueId(value: unknown): value is string {
  return (
    isBoundedString(value, 128) && OPAQUE_CONFIGURATION_ID_PATTERN.test(value)
  );
}


export function compareCodePoints(left: string, right: string): number {
  const leftPoints = Array.from(left, (value) => value.codePointAt(0) ?? 0);
  const rightPoints = Array.from(right, (value) => value.codePointAt(0) ?? 0);
  const length = Math.min(leftPoints.length, rightPoints.length);
  for (let index = 0; index < length; index += 1) {
    const difference = leftPoints[index] - rightPoints[index];
    if (difference !== 0) return difference;
  }
  return leftPoints.length - rightPoints.length;
}

export function canonicalizeConfigurationValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalizeConfigurationValue);
  if (!isRecord(value)) return value;
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(value).sort()) {
    if (value[key] !== undefined)
      defineOwnEntry(result, key, canonicalizeConfigurationValue(value[key]));
  }
  return result;
}

export async function configurationRevision(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(
    JSON.stringify(canonicalizeConfigurationValue(value))
  );
  
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hex = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
  return `sha256:${hex}`;
}
