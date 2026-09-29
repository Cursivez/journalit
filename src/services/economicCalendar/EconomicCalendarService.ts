

import type JournalitPlugin from '../../main';
import { DemoSyncGate } from '../../demo/DemoSyncGate';
import { ECONOMIC_CALENDAR_IMPACTS } from '../../settings/types';
import { logger } from '../../utils/logger';
import { ApiClient } from '../backend/ApiClient';
import { BackendSecretStorage } from '../backend/BackendSecretStorage';
import { ApiError } from '../../types/errors';
import {
  formatLocalDateString,
  formatWeekdayLong,
  getWeekStartDate,
  getWeekStartDaySetting,
} from '../../utils/dateUtils';
import { KEY_EVENT_DAYS } from '../../utils/keyEvents';
import {
  isEventInSyncScope,
  resolveEconomicCalendarSyncScope,
  type EconomicCalendarSyncScope,
} from './economicCalendarScope';
import { parseNewsEventImpact } from '../weekly/parseNewsEvents';
import type { NewsEvent, NewsEventImpact } from '../weekly/types';
import type { WeeklyReviewService } from '../weekly/WeeklyReviewService';
import { eventBus } from '../events/EventBus';
import { reviewChangeAffectsPath } from '../events/reviewChangedPaths';
import type { Unsubscribe } from '../events/types';
import type {
  EconomicCalendarEvent,
  EconomicCalendarEventType,
  EconomicCalendarFetchOptions,
  EconomicCalendarFetchResult,
  EconomicCalendarImportOptions,
  EconomicCalendarImportResult,
  EconomicCalendarRestoreCheckResult,
  EconomicCalendarRestoreResult,
} from './types';

const ECONOMIC_EVENTS_ENDPOINT = '/api/v1/economic-events';

const NOT_ENTITLED_STATUS_CODES: ReadonlySet<number | undefined> = new Set([
  402, 403,
]);
const AUTO_IMPORT_THROTTLE_MS = 6 * 60 * 60 * 1000;
const AUTO_IMPORT_CHECK_INTERVAL_MS = 30 * 60 * 1000;

interface ImportedEventIdentity {
  source?: string;
  time?: string;
  seriesId?: number;
  event?: string;
  currency?: string;
}

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


function parseEconomicCalendarEventType(
  value: unknown
): EconomicCalendarEventType {
  return value === 'holiday' ? 'holiday' : 'release';
}

function parseEconomicCalendarEvent(
  value: unknown
): EconomicCalendarEvent | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== 'number' || !Number.isFinite(value.id)) return null;
  if (typeof value.source !== 'string' || value.source.length === 0) {
    return null;
  }
  if (typeof value.name !== 'string' || value.name.length === 0) return null;
  if (typeof value.currency !== 'string' || value.currency.length === 0) {
    return null;
  }

  const impact = parseNewsEventImpact(value.impact);
  if (impact === undefined) return null;
  if (typeof value.scheduledAt !== 'string' || value.scheduledAt.length === 0) {
    return null;
  }
  if (Number.isNaN(new Date(value.scheduledAt).getTime())) return null;

  const eventType = parseEconomicCalendarEventType(value.eventType);
  const parsed: EconomicCalendarEvent = {
    id: value.id,
    source: value.source,
    name: value.name,
    currency: value.currency,
    impact,
    eventType,
    scheduledAt: value.scheduledAt,
  };

  const seriesId = parseOptionalFiniteNumber(value.externalSeriesId);
  if (seriesId !== undefined) {
    parsed.seriesId = seriesId;
  }

  const category = parseOptionalString(value.category);
  if (category !== undefined) {
    parsed.category = category;
  }

  const lastUpdatedAt = parseOptionalString(value.lastUpdatedAt);
  if (lastUpdatedAt !== undefined) {
    parsed.lastUpdatedAt = lastUpdatedAt;
  }

  if (eventType !== 'holiday') {
    const actual = parseOptionalFiniteNumber(value.actual);
    if (actual !== undefined) parsed.actual = actual;

    const forecast = parseOptionalFiniteNumber(value.forecast);
    if (forecast !== undefined) parsed.forecast = forecast;

    const previous = parseOptionalFiniteNumber(value.previous);
    if (previous !== undefined) parsed.previous = previous;
  }

  return parsed;
}

function parseEconomicCalendarResponse(
  value: unknown
): EconomicCalendarEvent[] | null {
  if (!isRecord(value) || !Array.isArray(value.events)) {
    return null;
  }

  const events: EconomicCalendarEvent[] = [];
  for (const item of value.events) {
    const parsed = parseEconomicCalendarEvent(item);
    if (parsed) {
      events.push(parsed);
    }
  }
  return events;
}

function isOfflineError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.name === 'TypeError') return true;

  const message = error.message.toLowerCase();
  return (
    message.includes('fetch') ||
    message.includes('network') ||
    message.includes('offline') ||
    message.includes('net::')
  );
}

function colorFromImpact(impact: NewsEventImpact): string {
  switch (impact) {
    case 'high':
      return 'red';
    case 'medium':
      return 'orange';
    case 'low':
      return 'yellow';
    case 'none':
      return 'gray';
  }
}

function weekdayFromScheduledAt(
  scheduledAt: string,
  timeZone?: string
): string | undefined {
  const scheduledDate = new Date(scheduledAt);
  if (Number.isNaN(scheduledDate.getTime())) return undefined;

  const weekday = formatWeekdayLong(scheduledDate, timeZone);

  for (const day of KEY_EVENT_DAYS) {
    if (day === weekday) return day;
  }
  return undefined;
}


function keyEventWeekday(
  event: Pick<EconomicCalendarEvent, 'scheduledAt' | 'eventType'>,
  timeZone?: string
): string | undefined {
  return weekdayFromScheduledAt(
    event.scheduledAt,
    event.eventType === 'holiday' ? 'UTC' : timeZone
  );
}

export function utcCalendarDate(iso: string | undefined): string | undefined {
  if (typeof iso !== 'string' || iso.length === 0) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

export function importedEventIdentityFromCalendar(
  event: EconomicCalendarEvent
): ImportedEventIdentity {
  return {
    source: event.source,
    time: event.scheduledAt,
    seriesId: event.seriesId,
    event: event.name,
    currency: event.currency,
  };
}


export function importedKeyEventIdentityKey(
  identity: ImportedEventIdentity
): string | undefined {
  if (!identity.source) return undefined;
  const date = utcCalendarDate(identity.time);
  if (!date) return undefined;

  if (identity.seriesId !== undefined) {
    return `${identity.source}|sid:${identity.seriesId}|${date}`;
  }

  if (!identity.event || !identity.currency) return undefined;
  return `${identity.source}|name:${identity.event}|${identity.currency}|${date}`;
}

function mapCalendarEventToNewsEvent(
  event: EconomicCalendarEvent,
  timeZone?: string
): NewsEvent {
  const mapped: NewsEvent = {
    event: event.name,
    notes: '',
    color:
      event.eventType === 'holiday' ? 'gray' : colorFromImpact(event.impact),
    day: keyEventWeekday(event, timeZone),
    
    
    time: event.scheduledAt,
    currency: event.currency,
    impact: event.impact,
    source: event.source,
  };

  
  
  if (event.eventType === 'holiday') {
    mapped.eventType = 'holiday';
  }

  if (event.eventType !== 'holiday') {
    if (event.forecast !== undefined) mapped.forecast = event.forecast;
    if (event.previous !== undefined) mapped.previous = event.previous;
    if (event.actual !== undefined) mapped.actual = event.actual;
  }
  if (event.seriesId !== undefined) {
    mapped.seriesId = event.seriesId;
  }

  return mapped;
}


export function isImportedKeyEventMatch(
  existing: ImportedEventIdentity,
  incoming: ImportedEventIdentity
): boolean {
  if (!existing.source || !incoming.source) return false;
  if (existing.source !== incoming.source) return false;

  const existingDate = utcCalendarDate(existing.time);
  const incomingDate = utcCalendarDate(incoming.time);
  if (!existingDate || !incomingDate || existingDate !== incomingDate) {
    return false;
  }

  if (existing.seriesId !== undefined && incoming.seriesId !== undefined) {
    return existing.seriesId === incoming.seriesId;
  }

  return (
    existing.event === incoming.event && existing.currency === incoming.currency
  );
}

export function countMissingConfiguredEvents(
  events: readonly EconomicCalendarEvent[],
  existing: readonly NewsEvent[],
  scope: EconomicCalendarSyncScope,
  timeZone?: string
): number {
  let missingCount = 0;
  for (const event of events) {
    if (!isEventInSyncScope(event, scope)) continue;
    const mapped = mapCalendarEventToNewsEvent(event, timeZone);
    if (
      !existing.some((candidate) => isImportedKeyEventMatch(candidate, mapped))
    ) {
      missingCount++;
    }
  }
  return missingCount;
}

function applyImportedEventUpdate(
  existing: NewsEvent,
  incoming: NewsEvent
): NewsEvent {
  const updated: NewsEvent = {
    event: existing.event,
    notes: existing.notes,
    color: incoming.color,
    day: incoming.day,
    time: incoming.time,
    currency: incoming.currency,
    impact: incoming.impact,
    source: existing.source,
  };

  if (incoming.eventType !== undefined) {
    updated.eventType = incoming.eventType;
  }

  if (existing.seriesId !== undefined) {
    updated.seriesId = existing.seriesId;
  } else if (incoming.seriesId !== undefined) {
    updated.seriesId = incoming.seriesId;
  }

  if (incoming.eventType === 'holiday') {
    delete updated.forecast;
    delete updated.previous;
    delete updated.actual;
  } else {
    if (incoming.forecast !== undefined) {
      updated.forecast = incoming.forecast;
    } else if (existing.forecast !== undefined) {
      updated.forecast = existing.forecast;
    }

    if (incoming.previous !== undefined) {
      updated.previous = incoming.previous;
    } else if (existing.previous !== undefined) {
      updated.previous = existing.previous;
    }

    if (incoming.actual !== undefined) {
      updated.actual = incoming.actual;
    } else if (existing.actual !== undefined) {
      updated.actual = existing.actual;
    }
  }

  return updated;
}

function areNewsEventsEqual(first: NewsEvent, second: NewsEvent): boolean {
  return (
    first.event === second.event &&
    first.notes === second.notes &&
    first.color === second.color &&
    first.day === second.day &&
    first.time === second.time &&
    first.currency === second.currency &&
    first.impact === second.impact &&
    first.eventType === second.eventType &&
    first.source === second.source &&
    first.seriesId === second.seriesId &&
    first.forecast === second.forecast &&
    first.previous === second.previous &&
    first.actual === second.actual
  );
}

type ImportedEventAction = 'skip' | 'update' | 'log-only' | 'insert';

function classifyImportedEvent(
  existing: NewsEvent | undefined,
  incoming: NewsEvent,
  insertable: boolean,
  respectDeletions: boolean,
  loggedIdentities: ReadonlySet<string>
): ImportedEventAction {
  const identityKey = importedKeyEventIdentityKey(incoming);
  if (existing) {
    if (
      !areNewsEventsEqual(
        existing,
        applyImportedEventUpdate(existing, incoming)
      )
    ) {
      return 'update';
    }
    return identityKey !== undefined && !loggedIdentities.has(identityKey)
      ? 'log-only'
      : 'skip';
  }
  if (!insertable) return 'skip';
  if (
    respectDeletions &&
    identityKey !== undefined &&
    loggedIdentities.has(identityKey)
  ) {
    return 'skip';
  }
  return 'insert';
}

export class EconomicCalendarService {
  private autoImportStarted = false;
  private autoImportInFlight: Promise<void> | null = null;
  private forcedAutoImportQueued = false;
  private activeImportWrites = 0;
  private importWriteWaiters = new Set<() => void>();
  private unsubscribeReviewChanged: Unsubscribe | null = null;

  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly weeklyReviewService: WeeklyReviewService
  ) {}

  public async fetchWeek(
    options: EconomicCalendarFetchOptions = {}
  ): Promise<EconomicCalendarFetchResult> {
    
    
    if (!BackendSecretStorage.hasAuthToken(this.plugin)) {
      return { status: 'signed_out' };
    }

    const weekDate = options.weekDate ?? new Date();
    const weekStartDay = getWeekStartDaySetting(this.plugin);
    const weekStart = getWeekStartDate(weekDate, weekStartDay);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    
    
    
    
    const { currencies, impacts } = options;
    if (impacts && impacts.length === 0) {
      return { status: 'ok', events: [] };
    }

    const params: Record<string, unknown> = {
      from: formatLocalDateString(weekStart),
      to: formatLocalDateString(weekEnd),
    };
    if (currencies && currencies.length > 0) {
      params.currency = currencies.join(',');
    }
    if (impacts) {
      params.impact = ECONOMIC_CALENDAR_IMPACTS.filter((impact) =>
        impacts.includes(impact)
      ).join(',');
    }

    const url = ApiClient.buildUrl(ECONOMIC_EVENTS_ENDPOINT, params);

    try {
      
      
      
      ApiClient.invalidateCache(ECONOMIC_EVENTS_ENDPOINT);

      const payload = await ApiClient.makeRequest<unknown>(
        url,
        {
          method: 'GET',
          headers: {
            'x-endpoint': ECONOMIC_EVENTS_ENDPOINT,
          },
        },
        'economic calendar',
        0,
        {
          suppressPremiumRequiredEvent: true,
          throwOnPremiumRequired: true,
          propagateErrors: true,
        }
      );

      const events = parseEconomicCalendarResponse(payload);
      if (!events) {
        return { status: 'error' };
      }
      return { status: 'ok', events };
    } catch (error) {
      if (
        error instanceof ApiError &&
        NOT_ENTITLED_STATUS_CODES.has(error.statusCode)
      ) {
        return { status: 'not_entitled' };
      }
      
      if (error instanceof ApiError && error.statusCode === 401) {
        return { status: 'signed_out' };
      }
      if (isOfflineError(error)) {
        return { status: 'offline' };
      }
      return { status: 'error' };
    }
  }

  public async importEvents(
    events: EconomicCalendarEvent[],
    options: EconomicCalendarImportOptions = {}
  ): Promise<EconomicCalendarImportResult> {
    const weekDate = options.weekDate ?? new Date();
    const filePath = this.weeklyReviewService.getWeeklyReviewPath(weekDate);
    if (events.length === 0 || DemoSyncGate.isActive()) {
      return {
        filePath,
        importedCount: 0,
        updatedCount: 0,
      };
    }

    const insertScope = options.insertScope;
    const incoming = events.map((event) => ({
      mapped: mapCalendarEventToNewsEvent(event, options.timeZone),
      insertable: insertScope ? isEventInSyncScope(event, insertScope) : true,
    }));
    const respectDeletions = options.respectDeletions === true;
    const cachedState =
      this.weeklyReviewService.getKeyEventsWriteStateForWeek(weekDate);
    const loggedFromCache = new Set(cachedState.keyEventsAutoImported);
    const wouldChange = incoming.some(({ mapped, insertable }) => {
      const existing = cachedState.keyEvents.find((candidate) =>
        isImportedKeyEventMatch(candidate, mapped)
      );
      return (
        classifyImportedEvent(
          existing,
          mapped,
          insertable,
          respectDeletions,
          loggedFromCache
        ) !== 'skip'
      );
    });
    if (!wouldChange) {
      return {
        filePath,
        importedCount: 0,
        updatedCount: 0,
      };
    }

    let importedCount = 0;
    let updatedCount = 0;
    this.activeImportWrites++;
    try {
      const writtenPath = await this.weeklyReviewService.updateKeyEventsForWeek(
        weekDate,
        (current) => {
          const next = [...current.keyEvents];
          const nextLog = [...current.keyEventsAutoImported];
          const logged = new Set(nextLog);

          for (const { mapped: event, insertable } of incoming) {
            let matchedIndex = -1;
            for (let index = 0; index < next.length; index++) {
              if (isImportedKeyEventMatch(next[index], event)) {
                matchedIndex = index;
                break;
              }
            }

            const identityKey = importedKeyEventIdentityKey(event);
            const action = classifyImportedEvent(
              matchedIndex >= 0 ? next[matchedIndex] : undefined,
              event,
              insertable,
              respectDeletions,
              logged
            );

            if (action === 'update' && matchedIndex >= 0) {
              next[matchedIndex] = applyImportedEventUpdate(
                next[matchedIndex],
                event
              );
              updatedCount++;
              if (identityKey && !logged.has(identityKey)) {
                nextLog.push(identityKey);
                logged.add(identityKey);
              }
              continue;
            }

            if (action === 'log-only') {
              if (identityKey) {
                nextLog.push(identityKey);
                logged.add(identityKey);
              }
              continue;
            }

            if (action !== 'insert') continue;

            next.push(event);
            importedCount++;
            if (identityKey && !logged.has(identityKey)) {
              nextLog.push(identityKey);
              logged.add(identityKey);
            }
          }

          return {
            keyEvents: next,
            keyEventsAutoImported: nextLog,
          };
        }
      );

      return { filePath: writtenPath, importedCount, updatedCount };
    } finally {
      this.activeImportWrites--;
      if (this.activeImportWrites === 0) {
        for (const resolve of this.importWriteWaiters) resolve();
        this.importWriteWaiters.clear();
      }
    }
  }

  
  public async restoreConfiguredEventsForWeek(
    weekDate: Date
  ): Promise<EconomicCalendarRestoreResult> {
    const fetched = await this.fetchWeek({ weekDate });
    if (fetched.status !== 'ok') return fetched;

    const imported = await this.importEvents(fetched.events, {
      weekDate,
      insertScope: resolveEconomicCalendarSyncScope(
        this.plugin.settings.economicCalendar
      ),
      respectDeletions: false,
    });
    return { status: 'ok', ...imported };
  }

  
  public async checkConfiguredEventsForWeek(
    weekDate: Date
  ): Promise<EconomicCalendarRestoreCheckResult> {
    const fetched = await this.fetchWeek({ weekDate });
    if (fetched.status !== 'ok') return fetched;

    const scope = resolveEconomicCalendarSyncScope(
      this.plugin.settings.economicCalendar
    );
    const existing = this.weeklyReviewService.getKeyEventsForWeek(weekDate);
    const missingCount = countMissingConfiguredEvents(
      fetched.events,
      existing,
      scope
    );

    return { status: 'ok', missingCount };
  }

  
  public startAutoImport(): void {
    if (this.autoImportStarted) return;
    this.autoImportStarted = true;

    
    
    
    this.unsubscribeReviewChanged = eventBus.subscribe(
      'review:changed',
      (payload) => {
        if (
          payload.type !== 'weekly' ||
          payload.action !== 'created' ||
          this.activeImportWrites > 0 ||
          !reviewChangeAffectsPath(
            payload,
            this.weeklyReviewService.getWeeklyReviewPath(new Date())
          )
        ) {
          return;
        }

        void this.autoImportNow();
      }
    );

    this.plugin.registerInterval(
      window.setInterval(() => {
        void this.autoImportIfDue();
      }, AUTO_IMPORT_CHECK_INTERVAL_MS)
    );

    void this.autoImportIfDue();
  }

  public cleanup(): void {
    this.unsubscribeReviewChanged?.();
    this.unsubscribeReviewChanged = null;
  }

  public async quiesceForSampleContext(): Promise<void> {
    this.forcedAutoImportQueued = false;
    const inFlight = this.autoImportInFlight;
    if (inFlight) {
      await inFlight;
    }
    if (this.activeImportWrites > 0) {
      await new Promise<void>((resolve) => {
        this.importWriteWaiters.add(resolve);
      });
    }
  }

  
  public async autoImportIfDue(): Promise<void> {
    return this.runAutoImport({ force: false });
  }

  
  public async autoImportNow(): Promise<void> {
    return this.runAutoImport({ force: true });
  }

  private async runAutoImport(options: { force: boolean }): Promise<void> {
    if (this.plugin.settings.economicCalendar?.autoImport !== true) {
      logger.debug('EconomicCalendar: auto-import skipped (disabled)');
      return;
    }

    if (!options.force && this.isAutoImportThrottled()) {
      logger.debug('EconomicCalendar: auto-import skipped (throttled)');
      return;
    }

    if (this.autoImportInFlight) {
      if (options.force) this.forcedAutoImportQueued = true;
      return this.autoImportInFlight;
    }

    this.autoImportInFlight = this.executeAutoImport(options).finally(
      async () => {
        this.autoImportInFlight = null;
        if (!this.forcedAutoImportQueued) return;
        this.forcedAutoImportQueued = false;
        await this.runAutoImport({ force: true });
      }
    );
    return this.autoImportInFlight;
  }

  private async executeAutoImport(options: { force: boolean }): Promise<void> {
    try {
      const weekDate = new Date();
      
      
      const result = await this.fetchWeek({ weekDate });

      if (result.status === 'ok') {
        await this.importEvents(result.events, {
          weekDate,
          respectDeletions: true,
          insertScope: resolveEconomicCalendarSyncScope(
            this.plugin.settings.economicCalendar
          ),
        });
        await this.persistLastAutoImport(weekDate);
        return;
      }

      if (result.status === 'not_entitled') {
        logger.debug('EconomicCalendar: auto-import skipped (not_entitled)');
        if (!options.force) {
          await this.persistLastAutoImport(weekDate);
        }
        return;
      }

      logger.debug(`EconomicCalendar: auto-import skipped (${result.status})`);
    } catch (error) {
      logger.debug('EconomicCalendar: auto-import failed', error);
    }
  }

  private currentWeekKey(weekDate: Date = new Date()): string {
    const weekStartDay = getWeekStartDaySetting(this.plugin);
    return formatLocalDateString(getWeekStartDate(weekDate, weekStartDay));
  }

  private isAutoImportThrottled(): boolean {
    const state = this.plugin.uiStateManager.getState().economicCalendar;
    if (!state?.lastAutoImportAt) return false;
    if (state.lastAutoImportWeekKey !== this.currentWeekKey()) return false;
    const last = Date.parse(state.lastAutoImportAt);
    if (Number.isNaN(last)) return false;
    return Date.now() - last < AUTO_IMPORT_THROTTLE_MS;
  }

  private async persistLastAutoImport(weekDate: Date): Promise<void> {
    const current =
      this.plugin.uiStateManager.getState().economicCalendar ?? {};
    await this.plugin.uiStateManager.updateStateImmediate({
      economicCalendar: {
        ...current,
        lastAutoImportAt: new Date().toISOString(),
        lastAutoImportWeekKey: this.currentWeekKey(weekDate),
      },
    });
  }
}
