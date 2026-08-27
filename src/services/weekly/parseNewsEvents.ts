

import type { NewsEvent, NewsEventImpact } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function parseOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function parseOptionalFiniteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

function parseNewsEventColor(value: unknown): string | undefined {
  switch (value) {
    case 'gray':
    case 'red':
    case 'orange':
    case 'yellow':
      return value;
    default:
      return undefined;
  }
}

export function parseNewsEventImpact(
  value: unknown
): NewsEventImpact | undefined {
  switch (value) {
    case 'none':
    case 'low':
    case 'medium':
    case 'high':
      return value;
    default:
      return undefined;
  }
}

export function parseNewsEvents(value: unknown): NewsEvent[] {
  if (!Array.isArray(value)) return [];

  const events: NewsEvent[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.event !== 'string') continue;

    const parsed: NewsEvent = {
      event: item.event,
      notes: typeof item.notes === 'string' ? item.notes : '',
      color: parseNewsEventColor(item.color),
      day: parseOptionalString(item.day),
    };

    const time = parseOptionalString(item.time);
    if (time !== undefined) {
      parsed.time = time;
    }

    const currency = parseOptionalString(item.currency);
    if (currency !== undefined) {
      parsed.currency = currency;
    }

    
    
    if (item.eventType === 'holiday') {
      parsed.eventType = 'holiday';
    }

    const impact = parseNewsEventImpact(item.impact);
    if (impact !== undefined) {
      parsed.impact = impact;
    }

    const forecast = parseOptionalFiniteNumber(item.forecast);
    if (forecast !== undefined) {
      parsed.forecast = forecast;
    }

    const previous = parseOptionalFiniteNumber(item.previous);
    if (previous !== undefined) {
      parsed.previous = previous;
    }

    const actual = parseOptionalFiniteNumber(item.actual);
    if (actual !== undefined) {
      parsed.actual = actual;
    }

    const source = parseOptionalString(item.source);
    if (source !== undefined) {
      parsed.source = source;
    }

    const seriesId = parseOptionalFiniteNumber(item.seriesId);
    if (seriesId !== undefined) {
      parsed.seriesId = seriesId;
    }

    events.push(parsed);
  }

  return events;
}
