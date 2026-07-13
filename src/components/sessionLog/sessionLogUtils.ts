import { TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import {
  isTradeOpenInDashboard,
  type Trade,
} from '../dashboard/utils/dataUtils';
import { getTradingDay, isSameTradingDay } from '../../utils/tradingDayUtils';
import {
  getTradeAnalyticsTradingDay,
  getTradeRealizedPnlEvents,
} from '../../utils/tradeAnalyticsDate';
import {
  formatLocalDateString,
  parseTradeTimestampValue,
} from '../../utils/dateUtils';
import { generateUUID } from '../../utils/uuid';
import type { ResolvedSessionModeWindow } from '../../types/sessionMode';
import type {
  SessionLogAlertRule,
  SessionLogEntry,
  SessionLogTagDefinition,
  SessionLogTimelineEntry,
} from '../../types/sessionLog';
import {
  DEFAULT_SESSION_LOG_ALERT_RULE,
  DEFAULT_SESSION_LOG_TAGS,
} from '../../types/sessionLog';
import { t } from '../../lang/helpers';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const sessionLogMutationQueues = new Map<string, Promise<void>>();

async function enqueueSessionLogMutation(
  filePath: string,
  task: () => Promise<void>
): Promise<void> {
  const previousTask =
    sessionLogMutationQueues.get(filePath) ?? Promise.resolve();
  const nextTask = previousTask.catch(() => undefined).then(task);
  sessionLogMutationQueues.set(filePath, nextTask);
  try {
    await nextTask;
  } finally {
    if (sessionLogMutationQueues.get(filePath) === nextTask) {
      sessionLogMutationQueues.delete(filePath);
    }
  }
}

function getEntryTimelineEvents(
  trade: TimelineTrade,
  tradingDay: Date,
  plugin: JournalitPlugin
): ExitTimelineEvent[] {
  if (trade.entries && trade.entries.length > 0) {
    const entryEvents: ExitTimelineEvent[] = [];
    for (const entry of trade.entries) {
      const time = parseTradeTimestampValue(entry.time);
      if (!time || !isEntryOnTradingDay(entry.time, tradingDay, plugin)) {
        continue;
      }
      const price = entry.price;
      const positionSize = entry.size;
      entryEvents.push({
        id: `${trade.path}:entry:${time.getTime()}:${entryEvents.length}`,
        timestamp: time,
        price:
          typeof price === 'number' && Number.isFinite(price) ? price : null,
        positionSize:
          typeof positionSize === 'number' && Number.isFinite(positionSize)
            ? positionSize
            : null,
      });
    }
    return entryEvents;
  }

  if (!isSameTradingDay(trade.entryTime, tradingDay, plugin)) return [];
  return [
    {
      id: `${trade.path}:entry`,
      timestamp: trade.entryTime,
      price: Number.isFinite(trade.entryPrice) ? trade.entryPrice : null,
      positionSize: Number.isFinite(trade.positionSize)
        ? trade.positionSize
        : null,
    },
  ];
}

function isEntryOnTradingDay(
  entryTime: Date | string | null | undefined,
  tradingDay: Date,
  plugin: JournalitPlugin
): boolean {
  const entryTradingDay = getTradeAnalyticsTradingDay(
    { entryTime },
    'entry',
    plugin
  );
  if (!entryTradingDay) return false;
  return (
    entryTradingDay.getTime() === getTradingDay(tradingDay, plugin).getTime()
  );
}

interface TimelineTrade {
  path: string;
  entryTime: Date;
  exitTime?: Date | null;
  entryPrice: number;
  exitPrice?: number | null;
  positionSize: number;
  direction?: string;
  instrument?: string;
  pnl?: number | null;
  tradeStatus?: string;
  useDirectPnLInput?: boolean;
  exits?: Trade['exits'];
  entries?: Trade['entries'];
  _originalPnlWasNull?: boolean;
}

interface ExitTimelineEvent {
  id: string;
  timestamp: Date;
  price: number | null;
  positionSize: number | null;
}

export function getSessionLogTags(
  plugin: JournalitPlugin
): SessionLogTagDefinition[] {
  const configured = plugin.settings.drc.sessionLogTags;
  return configured && configured.length > 0
    ? configured
    : DEFAULT_SESSION_LOG_TAGS;
}

export function getSessionLogAlertRule(
  plugin: JournalitPlugin
): SessionLogAlertRule {
  return (
    plugin.settings.drc.sessionLogAlertRule ?? DEFAULT_SESSION_LOG_ALERT_RULE
  );
}

export function normalizeSessionLogEntries(value: unknown): SessionLogEntry[] {
  if (!Array.isArray(value)) return [];

  const entries: SessionLogEntry[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    if (
      typeof item.id !== 'string' ||
      typeof item.timestamp !== 'string' ||
      typeof item.tagId !== 'string' ||
      typeof item.text !== 'string'
    ) {
      continue;
    }

    entries.push({
      id: item.id,
      timestamp: item.timestamp,
      tagId: item.tagId,
      text: item.text,
      resolved: item.resolved === true,
      promoted: item.promoted === true,
    });
  }

  return entries;
}

export function getSessionLogEntriesFromFile(
  plugin: JournalitPlugin,
  filePath: string
): SessionLogEntry[] {
  const file = plugin.app.vault.getAbstractFileByPath(filePath);
  if (!(file instanceof TFile)) return [];
  const frontmatter = plugin.app.metadataCache.getFileCache(file)?.frontmatter;
  return normalizeSessionLogEntries(frontmatter?.sessionLog);
}

export async function addSessionLogEntry(params: {
  plugin: JournalitPlugin;
  filePath: string;
  tagId: string;
  text: string;
  timestamp?: Date;
}): Promise<void> {
  await enqueueSessionLogMutation(params.filePath, async () => {
    const drcService = params.plugin.drcService
      ? params.plugin.drcService
      : await params.plugin.serviceManager.getDRCService();
    const entries = getSessionLogEntriesFromFile(
      params.plugin,
      params.filePath
    );
    const newEntry: SessionLogEntry = {
      id: generateUUID(),
      timestamp: (params.timestamp ?? new Date()).toISOString(),
      tagId: params.tagId,
      text: params.text.trim(),
      resolved: false,
      promoted: false,
    };

    await drcService.updateDRCFrontmatter(
      params.filePath,
      { sessionLog: [...entries, newEntry] },
      'session-log'
    );
  });
}

export async function updateSessionLogEntry(params: {
  plugin: JournalitPlugin;
  filePath: string;
  entryId: string;
  updates: Partial<
    Pick<
      SessionLogEntry,
      'tagId' | 'text' | 'timestamp' | 'resolved' | 'promoted'
    >
  >;
}): Promise<void> {
  await enqueueSessionLogMutation(params.filePath, async () => {
    const drcService = params.plugin.drcService
      ? params.plugin.drcService
      : await params.plugin.serviceManager.getDRCService();
    const entries = getSessionLogEntriesFromFile(
      params.plugin,
      params.filePath
    );
    const nextEntries = entries.map((entry) =>
      entry.id === params.entryId ? { ...entry, ...params.updates } : entry
    );

    await drcService.updateDRCFrontmatter(
      params.filePath,
      { sessionLog: nextEntries },
      'session-log'
    );
  });
}

export async function deleteSessionLogEntry(params: {
  plugin: JournalitPlugin;
  filePath: string;
  entryId: string;
}): Promise<void> {
  await enqueueSessionLogMutation(params.filePath, async () => {
    const drcService = params.plugin.drcService
      ? params.plugin.drcService
      : await params.plugin.serviceManager.getDRCService();
    const entries = getSessionLogEntriesFromFile(
      params.plugin,
      params.filePath
    );
    await drcService.updateDRCFrontmatter(
      params.filePath,
      { sessionLog: entries.filter((entry) => entry.id !== params.entryId) },
      'session-log'
    );
  });
}

export function createManualTimelineEntries(
  entries: SessionLogEntry[]
): SessionLogTimelineEntry[] {
  const timelineEntries: SessionLogTimelineEntry[] = [];
  for (const entry of entries) {
    const timestamp = new Date(entry.timestamp);
    if (Number.isNaN(timestamp.getTime())) continue;
    timelineEntries.push({
      kind: 'manual',
      id: entry.id,
      timestamp,
      tagId: entry.tagId,
      text: entry.text,
      resolved: entry.resolved === true,
      promoted: entry.promoted === true,
    });
  }
  return timelineEntries;
}

export function createTradeTimelineEntries(
  trades: unknown[],
  tradingDay: Date,
  plugin: JournalitPlugin
): SessionLogTimelineEntry[] {
  const timeline: SessionLogTimelineEntry[] = [];
  for (const value of trades) {
    if (!isTrade(value)) continue;
    const trade = value;
    for (const entryEvent of getEntryTimelineEvents(
      trade,
      tradingDay,
      plugin
    )) {
      timeline.push({
        kind: 'trade',
        id: entryEvent.id,
        timestamp: entryEvent.timestamp,
        tradePath: trade.path,
        eventType: 'entry',
        instrument: trade.instrument ?? 'Trade',
        direction: trade.direction ?? '',
        price: entryEvent.price,
        positionSize: entryEvent.positionSize,
      });
    }

    for (const exitEvent of getExitTimelineEvents(trade, tradingDay, plugin)) {
      timeline.push({
        kind: 'trade',
        id: exitEvent.id,
        timestamp: exitEvent.timestamp,
        tradePath: trade.path,
        eventType: 'exit',
        instrument: trade.instrument ?? 'Trade',
        direction: trade.direction ?? '',
        price: exitEvent.price,
        positionSize: exitEvent.positionSize,
      });
    }
  }
  return timeline;
}

export function isTimelineEntryInSessionWindow(
  entry: SessionLogTimelineEntry,
  sessionWindow: ResolvedSessionModeWindow
): boolean {
  const timestampMs = entry.timestamp.getTime();
  return (
    timestampMs >= sessionWindow.start.getTime() &&
    timestampMs < sessionWindow.end.getTime()
  );
}

export function filterTimelineEntriesBySessionWindow(
  entries: SessionLogTimelineEntry[],
  sessionWindow: ResolvedSessionModeWindow
): SessionLogTimelineEntry[] {
  return entries.filter((entry) =>
    isTimelineEntryInSessionWindow(entry, sessionWindow)
  );
}

function isTrade(value: unknown): value is TimelineTrade {
  const record = isRecord(value) ? value : null;
  return Boolean(
    record &&
    typeof record.path === 'string' &&
    record.entryTime instanceof Date &&
    typeof record.entryPrice === 'number' &&
    typeof record.positionSize === 'number'
  );
}

function hasClosedTradeExit(
  trade: TimelineTrade
): trade is TimelineTrade & { exitTime: Date; exitPrice: number } {
  if (!(trade.exitTime instanceof Date)) return false;
  if (typeof trade.exitPrice !== 'number') return false;
  return !isTradeOpenInDashboard({
    path: trade.path,
    entryTime: trade.entryTime,
    exitTime: trade.exitTime,
    entryPrice: trade.entryPrice,
    exitPrice: trade.exitPrice,
    positionSize: trade.positionSize,
    direction: trade.direction ?? '',
    pnl: trade.pnl ?? 0,
    tradeStatus: trade.tradeStatus,
    useDirectPnLInput: trade.useDirectPnLInput,
    exits: trade.exits,
    entries: trade.entries,
    _originalPnlWasNull: trade._originalPnlWasNull ?? trade.pnl == null,
  });
}

function getExitTimelineEvents(
  trade: TimelineTrade,
  tradingDay: Date,
  plugin: JournalitPlugin
): ExitTimelineEvent[] {
  if (trade.exits && trade.exits.length > 0) {
    const exitsByTime = new Map<
      number,
      NonNullable<TimelineTrade['exits']>[number]
    >();
    for (const exit of trade.exits) {
      const time = toDateMs(exit.time);
      if (time !== null && !exitsByTime.has(time)) exitsByTime.set(time, exit);
    }
    const exitEvents: ExitTimelineEvent[] = [];
    for (const event of getTradeRealizedPnlEvents(trade, 'exit', plugin)) {
      if (
        formatLocalDateString(event.tradingDay) !==
        formatLocalDateString(tradingDay)
      ) {
        continue;
      }
      const matchingExit = exitsByTime.get(event.date.getTime());
      const price = matchingExit?.price;
      const positionSize = event.size ?? matchingExit?.size;
      exitEvents.push({
        id: `${trade.path}:exit:${event.date.getTime()}:${exitEvents.length}`,
        timestamp: event.date,
        price:
          typeof price === 'number' && Number.isFinite(price) ? price : null,
        positionSize:
          typeof positionSize === 'number' && Number.isFinite(positionSize)
            ? positionSize
            : null,
      });
    }
    return exitEvents;
  }

  if (!hasClosedTradeExit(trade)) return [];
  if (!isSameTradingDay(trade.exitTime, tradingDay, plugin)) return [];
  return [
    {
      id: `${trade.path}:exit`,
      timestamp: trade.exitTime,
      price: Number.isFinite(trade.exitPrice) ? trade.exitPrice : null,
      positionSize: Number.isFinite(trade.positionSize)
        ? trade.positionSize
        : null,
    },
  ];
}

function toDateMs(value: Date | string | null | undefined): number | null {
  const date = parseTradeTimestampValue(value);
  if (!date) return null;
  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
}

export function sortSessionTimeline(
  entries: SessionLogTimelineEntry[]
): SessionLogTimelineEntry[] {
  const sortedEntries: SessionLogTimelineEntry[] = [];
  for (const entry of entries) sortedEntries.push(entry);
  return sortedEntries.sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
}

export function calculateSessionLogAlert(
  entries: SessionLogTimelineEntry[],
  rule: SessionLogAlertRule,
  tag: SessionLogTagDefinition | undefined
): string | null {
  if (!rule.enabled || !tag) return null;
  const manualEntries = entries.filter((entry) => entry.kind === 'manual');
  if (manualEntries.length === 0) return null;
  const matching = manualEntries.filter((entry) => entry.tagId === rule.tagId);
  const percentage = (matching.length / manualEntries.length) * 100;
  if (
    matching.length >= rule.minimumCount &&
    percentage >= rule.minimumPercentage
  ) {
    return t('session-log.alert.tag-concentration', {
      tag: tag.label,
      percentage: String(Math.round(percentage)),
      count: String(matching.length),
      total: String(manualEntries.length),
    });
  }
  return null;
}
