

import type JournalitPlugin from '../../main';
import { eventBus } from '../events/EventBus';
import type { Unsubscribe } from '../events/types';
import { resolveSessionModePhaseForPlugin } from '../../utils/sessionModePhaseInputs';
import type { ResolvedUnplannedSessionWindow } from '../../types/sessionMode';
import {
  getUnplannedSessionsFromFile,
  selectRelevantUnplannedSession,
} from '../../components/sessionMode/unplannedSessionUtils';
import { getTradingDay } from '../../utils/tradingDayUtils';
import { formatLocalDateString } from '../../utils/dateUtils';


export type SessionIndicatorPhase = 'live' | 'preparation' | null;


const MAX_RECHECK_DELAY_MS = 60_000;
const MIN_RECHECK_DELAY_MS = 1_000;

const clampRecheckDelay = (delayMs: number | undefined): number => {
  
  if (delayMs === undefined) {
    return MAX_RECHECK_DELAY_MS;
  }
  return Math.min(
    MAX_RECHECK_DELAY_MS,
    Math.max(MIN_RECHECK_DELAY_MS, Math.ceil(delayMs))
  );
};

interface SessionPhaseEvaluation {
  phase: SessionIndicatorPhase;
  
  recheckDelayMs: number | null;
}

function evaluateSessionPhase(
  plugin: JournalitPlugin,
  unplannedSession: ResolvedUnplannedSessionWindow | undefined
): SessionPhaseEvaluation {
  const { sessionWindows, preparationLeadTimeMinutes } =
    plugin.settings.sessionMode;

  if (sessionWindows.length === 0 && !unplannedSession) {
    
    
    
    return { phase: null, recheckDelayMs: null };
  }

  const phaseState = resolveSessionModePhaseForPlugin(
    plugin,
    new Date(),
    undefined,
    unplannedSession
  );

  if (phaseState.phase === 'live') {
    return {
      phase: 'live',
      recheckDelayMs: clampRecheckDelay(phaseState.timeUntilEndMs),
    };
  }

  if (phaseState.phase === 'preparation') {
    return {
      phase: 'preparation',
      recheckDelayMs: clampRecheckDelay(phaseState.timeUntilStartMs),
    };
  }

  
  
  const leadTimeMs = preparationLeadTimeMinutes * 60 * 1000;
  const timeUntilStartMs = phaseState.timeUntilStartMs;
  const timeUntilPreparationMs =
    timeUntilStartMs === undefined
      ? undefined
      : Math.max(timeUntilStartMs - leadTimeMs, 0);

  return {
    phase: null,
    recheckDelayMs: clampRecheckDelay(timeUntilPreparationMs),
  };
}


export class SessionPhaseWatcher {
  private snapshot: SessionIndicatorPhase = null;
  private readonly listeners = new Set<() => void>();
  private timeoutId: number | undefined;
  private readonly unsubscribeSettings: Unsubscribe;
  private readonly unsubscribeReview: Unsubscribe;
  private destroyed = false;
  
  private unplannedSession: ResolvedUnplannedSessionWindow | undefined;
  private unplannedDrcPath: string | null = null;
  private unplannedTradingDayKey: string | null = null;
  private refreshInFlight = false;

  constructor(private readonly plugin: JournalitPlugin) {
    this.unsubscribeSettings = eventBus.subscribe('settings:changed', () => {
      
      this.unplannedDrcPath = null;
      this.clearTimer();
      this.tick();
    });
    this.unsubscribeReview = eventBus.subscribe('review:changed', (payload) => {
      if (payload.type !== 'drc') return;
      if (payload.action === 'created') this.unplannedDrcPath = null;
      this.clearTimer();
      this.tick();
    });
    this.tick();
  }

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  readonly getSnapshot = (): SessionIndicatorPhase => this.snapshot;

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.clearTimer();
    this.unsubscribeSettings();
    this.unsubscribeReview();
    this.listeners.clear();
  }

  private tick = (): void => {
    if (this.destroyed) return;

    const evaluation = evaluateSessionPhase(this.plugin, this.unplannedSession);
    if (evaluation.phase !== this.snapshot) {
      this.snapshot = evaluation.phase;
      for (const listener of this.listeners) listener();
    }

    this.timeoutId =
      evaluation.recheckDelayMs === null
        ? undefined
        : window.setTimeout(this.tick, evaluation.recheckDelayMs);

    void this.refreshUnplannedSession();
  };

  
  private refreshUnplannedSession = async (): Promise<void> => {
    const drcService = this.plugin.drcService;
    if (!drcService || this.destroyed || this.refreshInFlight) return;

    const tradingDay = getTradingDay(new Date(), this.plugin);
    const tradingDayKey = formatLocalDateString(tradingDay);
    if (
      this.unplannedDrcPath === null ||
      this.unplannedTradingDayKey !== tradingDayKey
    ) {
      this.refreshInFlight = true;
      try {
        this.unplannedDrcPath = await drcService.resolveDRCNotePath(tradingDay);
        this.unplannedTradingDayKey = tradingDayKey;
      } catch (error) {
        console.error(
          'Session indicator could not resolve the daily review path:',
          error
        );
        return;
      } finally {
        this.refreshInFlight = false;
      }
    }
    if (this.destroyed || this.unplannedDrcPath === null) return;

    const next = selectRelevantUnplannedSession(
      getUnplannedSessionsFromFile(this.plugin, this.unplannedDrcPath),
      new Date(),
      this.plugin
    );
    const changed =
      next?.id !== this.unplannedSession?.id ||
      next?.isRunning !== this.unplannedSession?.isRunning;
    this.unplannedSession = next;
    if (changed) {
      this.clearTimer();
      this.tick();
    }
  };

  private clearTimer(): void {
    if (this.timeoutId !== undefined) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}
