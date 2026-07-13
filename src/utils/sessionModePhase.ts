import type {
  SessionModePhaseState,
  SessionModeSettings,
  SessionModeWindow,
  ResolvedSessionModeWindow,
} from '../types/sessionMode';
import { getNextBusinessDay, isWeekend } from './dateUtils';

const TIME_PATTERN = /^(\d{2}):(\d{2})$/;
const POST_CUTOFF_ENDED_SESSION_GRACE_MS = 60 * 60 * 1000;

function parseTimeToMinutes(value: string): number | null {
  const match = TIME_PATTERN.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function createDateAtMinutes(baseDate: Date, minutes: number): Date {
  const result = new Date(baseDate);
  result.setHours(0, minutes, 0, 0);
  return result;
}

function isAfterLocalDate(date: Date, comparison: Date): boolean {
  if (date.getFullYear() !== comparison.getFullYear()) {
    return date.getFullYear() > comparison.getFullYear();
  }
  if (date.getMonth() !== comparison.getMonth()) {
    return date.getMonth() > comparison.getMonth();
  }
  return date.getDate() > comparison.getDate();
}

function resolveWindowForDate(
  window: SessionModeWindow,
  date: Date
): ResolvedSessionModeWindow | null {
  const startMinutes = parseTimeToMinutes(window.startTime);
  const endMinutes = parseTimeToMinutes(window.endTime);
  if (startMinutes === null || endMinutes === null) return null;
  if (startMinutes === endMinutes) return null;

  const start = createDateAtMinutes(date, startMinutes);
  const end = createDateAtMinutes(date, endMinutes);
  if (endMinutes < startMinutes) {
    end.setDate(end.getDate() + 1);
  }

  return { ...window, start, end };
}

export function resolveSessionModeWindowsForDate(
  date: Date,
  windows: SessionModeWindow[]
): ResolvedSessionModeWindow[] {
  const resolved: ResolvedSessionModeWindow[] = [];
  for (const window of windows) {
    const resolvedWindow = resolveWindowForDate(window, date);
    if (resolvedWindow) resolved.push(resolvedWindow);
  }
  return resolved.sort((a, b) => a.start.getTime() - b.start.getTime());
}

function resolveWindowsAroundNow(
  now: Date,
  windows: SessionModeWindow[],
  phaseDate: Date = now,
  preparationLeadTimeMs = 0
): ResolvedSessionModeWindow[] {
  const currentDate = new Date(phaseDate);
  const previousDate = new Date(phaseDate);
  previousDate.setDate(previousDate.getDate() - 1);

  const resolved: ResolvedSessionModeWindow[] = [];
  for (const window of windows) {
    const currentWindow = resolveWindowForDate(window, currentDate);
    if (currentWindow) resolved.push(currentWindow);

    const previousWindow = resolveWindowForDate(window, previousDate);
    if (previousWindow) {
      const previousStartMs = previousWindow.start.getTime();
      const previousEndMs = previousWindow.end.getTime();
      const nowMs = now.getTime();
      const isPreviousOvernightWindow =
        previousEndMs > previousStartMs &&
        previousWindow.end.getDate() !== previousWindow.start.getDate();
      const isPreviousDateFutureSessionAfterCutoff =
        previousStartMs > nowMs && isAfterLocalDate(phaseDate, now);
      const isPreviousDateRecentlyEndedSessionAfterCutoff =
        previousEndMs <= nowMs &&
        isAfterLocalDate(phaseDate, now) &&
        nowMs - previousEndMs <= POST_CUTOFF_ENDED_SESSION_GRACE_MS;
      if (
        (previousStartMs <= nowMs && previousEndMs > nowMs) ||
        isPreviousOvernightWindow ||
        isPreviousDateRecentlyEndedSessionAfterCutoff ||
        (previousStartMs > nowMs &&
          (previousStartMs - nowMs <= preparationLeadTimeMs ||
            isPreviousDateFutureSessionAfterCutoff))
      ) {
        resolved.push(previousWindow);
      }
    }
  }

  return resolved.sort((a, b) => a.start.getTime() - b.start.getTime());
}

function getNextWeekdaySession(
  fromDate: Date,
  windows: SessionModeWindow[]
): ResolvedSessionModeWindow | null {
  let nextDate = new Date(fromDate);
  nextDate.setHours(0, 0, 0, 0);
  while (isWeekend(nextDate)) {
    nextDate = getNextBusinessDay(nextDate, true);
    nextDate.setHours(0, 0, 0, 0);
  }
  const nextWindows = resolveSessionModeWindowsForDate(nextDate, windows);
  return nextWindows[0] ?? null;
}

export function resolveSessionModePhase(
  now: Date,
  settings: SessionModeSettings,
  phaseDate: Date = now,
  options: { skipWeekends?: boolean } = {}
): SessionModePhaseState {
  const leadTimeMs = Math.max(
    0,
    settings.preparationLeadTimeMinutes * 60 * 1000
  );
  const windows = resolveWindowsAroundNow(
    now,
    settings.sessionWindows,
    phaseDate,
    leadTimeMs
  );
  const nowMs = now.getTime();
  const currentSession = windows.find(
    (window) => nowMs >= window.start.getTime() && nowMs < window.end.getTime()
  );
  if (
    currentSession &&
    !(
      options.skipWeekends &&
      isWeekend(phaseDate) &&
      isWeekend(currentSession.start)
    )
  ) {
    return {
      phase: 'live',
      now,
      currentSession,
      timeUntilEndMs: currentSession.end.getTime() - nowMs,
    };
  }

  const nextSession = windows.find((window) => window.start.getTime() > nowMs);
  const previousSession = [...windows]
    .reverse()
    .find((window) => window.end.getTime() <= nowMs);
  const previousSessionStartedOnWeekday =
    previousSession && !isWeekend(previousSession.start);
  const previousSessionIsOvernight =
    previousSession &&
    (previousSession.start.getFullYear() !==
      previousSession.end.getFullYear() ||
      previousSession.start.getMonth() !== previousSession.end.getMonth() ||
      previousSession.start.getDate() !== previousSession.end.getDate());

  if (
    options.skipWeekends &&
    isWeekend(phaseDate) &&
    previousSessionStartedOnWeekday &&
    previousSessionIsOvernight &&
    nowMs - previousSession.end.getTime() <= POST_CUTOFF_ENDED_SESSION_GRACE_MS
  ) {
    return {
      phase: 'ended',
      now,
      previousSession,
      timeSinceEndMs: nowMs - previousSession.end.getTime(),
    };
  }

  if (options.skipWeekends && isWeekend(phaseDate)) {
    if (nextSession && !isWeekend(nextSession.start)) {
      const timeUntilStartMs = nextSession.start.getTime() - nowMs;
      return {
        phase: timeUntilStartMs <= leadTimeMs ? 'preparation' : 'waiting',
        now,
        nextSession,
        timeUntilStartMs,
      };
    }

    const nextSearchDate = isWeekend(phaseDate)
      ? getNextBusinessDay(phaseDate, true)
      : phaseDate;
    const nextWeekdaySession = getNextWeekdaySession(
      nextSearchDate,
      settings.sessionWindows
    );
    return nextWeekdaySession
      ? {
          phase: 'waiting',
          now,
          nextSession: nextWeekdaySession,
          timeUntilStartMs: nextWeekdaySession.start.getTime() - now.getTime(),
        }
      : { phase: 'unconfigured', now };
  }

  if (windows.length === 0) {
    return { phase: 'unconfigured', now };
  }

  if (!previousSession && nextSession) {
    const timeUntilStartMs = nextSession.start.getTime() - nowMs;
    return {
      phase: timeUntilStartMs <= leadTimeMs ? 'preparation' : 'waiting',
      now,
      nextSession,
      timeUntilStartMs,
    };
  }

  if (previousSession && nextSession) {
    const timeUntilStartMs = nextSession.start.getTime() - nowMs;
    const timeSinceEndMs = nowMs - previousSession.end.getTime();
    const isNextRecurrenceOfPreviousSession =
      previousSession.id === nextSession.id;
    if (!isNextRecurrenceOfPreviousSession && timeUntilStartMs > leadTimeMs) {
      return {
        phase: 'break',
        now,
        previousSession,
        nextSession,
        timeUntilStartMs,
        timeSinceEndMs,
      };
    }

    if (
      isNextRecurrenceOfPreviousSession &&
      timeUntilStartMs > leadTimeMs &&
      timeUntilStartMs < timeSinceEndMs
    ) {
      return {
        phase: 'waiting',
        now,
        previousSession,
        nextSession,
        timeUntilStartMs,
        timeSinceEndMs,
      };
    }

    return {
      phase: timeUntilStartMs <= leadTimeMs ? 'preparation' : 'ended',
      now,
      previousSession,
      nextSession: timeUntilStartMs <= leadTimeMs ? nextSession : undefined,
      timeUntilStartMs,
      timeSinceEndMs,
    };
  }

  return {
    phase: 'ended',
    now,
    previousSession,
    timeSinceEndMs: previousSession
      ? nowMs - previousSession.end.getTime()
      : undefined,
  };
}
