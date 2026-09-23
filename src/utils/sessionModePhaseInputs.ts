

import type JournalitPlugin from '../main';
import type {
  ResolvedUnplannedSessionWindow,
  SessionModePhaseState,
} from '../types/sessionMode';
import { resolveSessionModePhase } from './sessionModePhase';
import { getTradingDay } from './tradingDayUtils';


export function resolveSessionModePhaseForPlugin(
  plugin: JournalitPlugin,
  now: Date,
  tradingDay: Date = getTradingDay(now, plugin),
  unplannedSession?: ResolvedUnplannedSessionWindow
): SessionModePhaseState {
  return resolveSessionModePhase(now, plugin.settings.sessionMode, tradingDay, {
    skipWeekends: plugin.settings.trade.skipWeekends,
    unplannedSession,
  });
}
