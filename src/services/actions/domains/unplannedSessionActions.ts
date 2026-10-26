import {
  canStartUnplannedSession,
  getRunningUnplannedSession,
} from '../../../components/sessionMode/unplannedSessionUtils';
import { t } from '../../../lang/helpers';
import type {
  ResolvedUnplannedSessionWindow,
  SessionModePhaseState,
  UnplannedSession,
} from '../../../types/sessionMode';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import type {
  ActionDefinition,
  ActionDefinitions,
  ActionPlanContext,
} from '../ActionTypes';
import { throwIfAborted } from './tradeActionSupport';

type UnplannedSessionActionId =
  | 'session.start_unplanned'
  | 'session.stop_unplanned';


interface UnplannedSessionActionDependencies {
  now(): Date;
  resolvePhase(now: Date): Promise<SessionModePhaseState>;
  
  tradingDay(now: Date): string;
  start(
    reason: string
  ): Promise<
    | { status: 'started'; session: UnplannedSession }
    | { status: 'blocked-live' }
  >;
  
  stop(
    session: Pick<ResolvedUnplannedSessionWindow, 'id' | 'start'>
  ): Promise<string | null>;
}

const TARGET = 'session_mode:unplanned';

export function createUnplannedSessionActions(
  deps: UnplannedSessionActionDependencies
): Pick<ActionDefinitions, UnplannedSessionActionId> {
  const start: ActionDefinition<'session.start_unplanned'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      const reason = input.reason.trim();
      if (reason === '') throw new ActionPlanError('invalid_request', 'reason');
      const now = deps.now();
      const state = await deps.resolvePhase(now);
      throwIfAborted(context.signal);
      if (!canStartUnplannedSession(state)) {
        throw new ActionPlanError('conflict');
      }
      const tradingDay = deps.tradingDay(now);
      return {
        target: TARGET,
        summary: { trading_day: tradingDay },
        affectedNotes: 1,
        display: {
          target: t('actions.review.target.day', { date: tradingDay }),
          changes: [t('actions.session.unplanned.start', { reason })],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          let started: Awaited<ReturnType<typeof deps.start>>;
          try {
            started = await deps.start(reason);
          } catch {
            throw new ActionExecutionError('write_failed', true);
          }
          
          if (started.status !== 'started') {
            throw new ActionExecutionError('conflict', false);
          }
          return {
            session_id: started.session.id,
            trading_day: deps.tradingDay(new Date(started.session.startedAt)),
            started_at: started.session.startedAt,
          };
        },
      };
    },
  };

  const stop: ActionDefinition<'session.stop_unplanned'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      const now = deps.now();
      const state = await deps.resolvePhase(now);
      throwIfAborted(context.signal);
      const running = getRunningUnplannedSession(state);
      if (!running || running.id !== input.session_id) {
        throw new ActionPlanError('not_found', 'session_id');
      }
      const startedAt = running.start.toISOString();
      return {
        target: TARGET,
        summary: { session_id: running.id, started_at: startedAt },
        affectedNotes: 1,
        display: {
          target: t('actions.review.target.day', {
            date: deps.tradingDay(running.start),
          }),
          changes: [t('actions.session.unplanned.stop')],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          let stoppedAt: string | null;
          try {
            stoppedAt = await deps.stop({
              id: running.id,
              start: running.start,
            });
          } catch {
            throw new ActionExecutionError('write_failed', true);
          }
          
          if (stoppedAt === null) {
            throw new ActionExecutionError('not_found', false);
          }
          return { session_id: running.id, stopped_at: stoppedAt };
        },
      };
    },
  };

  return {
    'session.start_unplanned': start,
    'session.stop_unplanned': stop,
  };
}
