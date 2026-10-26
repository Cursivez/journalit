

import { importedKeyEventIdentityKey } from '../economicCalendar/EconomicCalendarService';
import type { NewsEvent } from './types';


export const MAX_AGENT_KEY_EVENTS = 500;


export function keyEventSnapshot(event: NewsEvent): string {
  return JSON.stringify([
    event.event,
    event.notes,
    event.color ?? null,
    event.day ?? null,
    event.time ?? null,
    event.currency ?? null,
    event.eventType ?? null,
    event.impact ?? null,
    event.forecast ?? null,
    event.previous ?? null,
    event.actual ?? null,
    event.source ?? null,
    event.seriesId ?? null,
  ]);
}


function hash(value: string): string {
  let high = 0xcbf29ce4;
  let low = 0x84222325;
  for (let index = 0; index < value.length; index++) {
    low ^= value.charCodeAt(index);
    
    const lowProduct = Math.imul(low, 0x1b3) >>> 0;
    const carry = Math.floor(((low >>> 0) * 0x1b3) / 0x100000000);
    high = (Math.imul(high, 0x1b3) + Math.imul(low, 0x100) + carry) >>> 0;
    low = lowProduct;
  }
  return (
    (high >>> 0).toString(16).padStart(8, '0') +
    (low >>> 0).toString(16).padStart(8, '0')
  );
}

function identityOf(event: NewsEvent): string | undefined {
  return importedKeyEventIdentityKey(event);
}


export function isImportedKeyEvent(event: NewsEvent): boolean {
  return identityOf(event) !== undefined;
}


export function keyEventKeys(events: readonly NewsEvent[]): string[] {
  const identities = events.map(identityOf);
  const identityCounts = new Map<string, number>();
  for (const identity of identities) {
    if (identity) {
      identityCounts.set(identity, (identityCounts.get(identity) ?? 0) + 1);
    }
  }
  const occurrences = new Map<string, number>();
  return events.map((event, index) => {
    const identity = identities[index];
    if (identity && identityCounts.get(identity) === 1) {
      return `ke_i_${hash(identity)}`;
    }
    const content = hash(keyEventSnapshot(event));
    const occurrence = occurrences.get(content) ?? 0;
    occurrences.set(content, occurrence + 1);
    return `ke_m_${content}_${occurrence}`;
  });
}

const CONTENT_KEY = /^ke_c_([0-9a-f]{16})$/;
const MANUAL_KEY = /^ke_m_([0-9a-f]{16})_\d+$/;


export function isKeyEventKey(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    (/^ke_i_[0-9a-f]{16}$/.test(value) || MANUAL_KEY.test(value))
  );
}


export function isKeyEventContentKey(value: unknown): value is string {
  return typeof value === 'string' && CONTENT_KEY.test(value);
}


export function locateKeyEvent(
  events: readonly NewsEvent[],
  key: string
): number | 'missing' {
  const index = keyEventKeys(events).indexOf(key);
  return index >= 0 ? index : 'missing';
}


export function locateKeyEventByContent(
  events: readonly NewsEvent[],
  key: string
): number | 'missing' {
  const content = CONTENT_KEY.exec(key);
  if (!content) return 'missing';
  for (let index = events.length - 1; index >= 0; index--) {
    if (hash(keyEventSnapshot(events[index])) === content[1]) return index;
  }
  return 'missing';
}


export function manualKeyEventOccurrence(
  key: string
): { hash: string; occurrence: number } | null {
  const manual = /^ke_m_([0-9a-f]{16})_(\d+)$/.exec(key);
  return manual ? { hash: manual[1], occurrence: Number(manual[2]) } : null;
}
