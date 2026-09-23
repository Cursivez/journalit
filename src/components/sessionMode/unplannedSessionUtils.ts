import { TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import type {
  ResolvedUnplannedSessionWindow,
  SessionModePhaseState,
  UnplannedSession,
} from '../../types/sessionMode';
import { normalizeUnplannedSessions } from '../../types/sessionMode';
import { getTradingDay, getTradingDayRange } from '../../utils/tradingDayUtils';
import { generateUUID } from '../../utils/uuid';
import { formatLocalDateString } from '../../utils/dateUtils';
import { enqueueFileMutation } from '../../utils/fileMutationQueue';
import { t } from '../../lang/helpers';
import { resolveSessionModePhase } from '../../utils/sessionModePhase';

const UNPLANNED_SESSIONS_FRONTMATTER_KEY = 'sessionModeUnplannedSessions';
const MUTATION_NAMESPACE = 'unplanned-session';

export function getUnplannedSessionsFromFile(
  plugin: JournalitPlugin,
  filePath: string
): UnplannedSession[] {
  const file = plugin.app.vault.getAbstractFileByPath(filePath);
  if (!(file instanceof TFile)) return [];
  const frontmatter = plugin.app.metadataCache.getFileCache(file)?.frontmatter;
  return normalizeUnplannedSessions(
    frontmatter?.[UNPLANNED_SESSIONS_FRONTMATTER_KEY]
  );
}


export function resolveUnplannedSessionWindow(
  session: UnplannedSession,
  now: Date,
  plugin: Parameters<typeof getTradingDayRange>[1]
): ResolvedUnplannedSessionWindow {
  const start = new Date(session.startedAt);
  const implicitEnd = getTradingDayRange(start, plugin).end;
  const end = session.stoppedAt ? new Date(session.stoppedAt) : implicitEnd;
  return {
    kind: 'unplanned',
    id: session.id,
    name: t('session-mode.unplanned.name'),
    reason: session.reason,
    start,
    end,
    isRunning: !session.stoppedAt && now.getTime() < implicitEnd.getTime(),
  };
}


export function selectRelevantUnplannedSession(
  sessions: UnplannedSession[],
  now: Date,
  plugin: Parameters<typeof getTradingDayRange>[1]
): ResolvedUnplannedSessionWindow | undefined {
  let relevant: ResolvedUnplannedSessionWindow | undefined;
  for (const session of sessions) {
    const window = resolveUnplannedSessionWindow(session, now, plugin);
    if (window.isRunning) return window;
    if (window.end.getTime() > now.getTime()) continue;
    if (!relevant || window.end.getTime() > relevant.end.getTime()) {
      relevant = window;
    }
  }
  return relevant;
}

export function getRunningUnplannedSession(
  phaseState: SessionModePhaseState
): ResolvedUnplannedSessionWindow | null {
  const current = phaseState.currentSession;
  return current?.kind === 'unplanned' && current.isRunning ? current : null;
}


export function canStartUnplannedSession(
  phaseState: SessionModePhaseState
): boolean {
  return phaseState.phase !== 'live';
}

async function getDRCService(plugin: JournalitPlugin) {
  return plugin.drcService
    ? plugin.drcService
    : await plugin.serviceManager.getDRCService();
}


export async function resolveUnplannedSessionDrcPath(
  plugin: JournalitPlugin,
  tradingDay: Date
): Promise<string> {
  const drcService = await getDRCService(plugin);
  return drcService.resolveDRCNotePath(tradingDay);
}

async function resolveCurrentSessionModePhase(
  plugin: JournalitPlugin,
  now: Date = new Date()
): Promise<SessionModePhaseState> {
  const tradingDay = getTradingDay(now, plugin);
  const drcPath = await resolveUnplannedSessionDrcPath(plugin, tradingDay);
  return resolveSessionModePhase(now, plugin.settings.sessionMode, tradingDay, {
    skipWeekends: plugin.settings.trade.skipWeekends ?? true,
    unplannedSession: selectRelevantUnplannedSession(
      getUnplannedSessionsFromFile(plugin, drcPath),
      now,
      plugin
    ),
  });
}

type StartUnplannedSessionResult =
  | { status: 'started'; session: UnplannedSession }
  | { status: 'blocked-live' };


export async function startUnplannedSession(params: {
  plugin: JournalitPlugin;
  reason: string;
  now?: Date;
}): Promise<StartUnplannedSessionResult> {
  const drcService = await getDRCService(params.plugin);
  const queueKey = formatLocalDateString(
    getTradingDay(params.now ?? new Date(), params.plugin)
  );
  let result: StartUnplannedSessionResult = { status: 'blocked-live' };
  await enqueueFileMutation(MUTATION_NAMESPACE, queueKey, async () => {
    
    
    
    const now = params.now ?? new Date();
    const phaseState = await resolveCurrentSessionModePhase(params.plugin, now);
    if (!canStartUnplannedSession(phaseState)) return;
    const filePath = await drcService.createDRC(
      getTradingDay(now, params.plugin)
    );
    const existing = getUnplannedSessionsFromFile(params.plugin, filePath);
    const session: UnplannedSession = {
      id: generateUUID(),
      reason: params.reason.trim(),
      startedAt: now.toISOString(),
    };
    await drcService.updateDRCFrontmatter(
      filePath,
      { [UNPLANNED_SESSIONS_FRONTMATTER_KEY]: [...existing, session] },
      'session-mode'
    );
    result = { status: 'started', session };
  });
  return result;
}


export async function stopUnplannedSession(params: {
  plugin: JournalitPlugin;
  session: Pick<ResolvedUnplannedSessionWindow, 'id' | 'start'>;
  now?: Date;
}): Promise<boolean> {
  const drcService = await getDRCService(params.plugin);
  const sessionTradingDay = getTradingDay(params.session.start, params.plugin);
  const queueKey = formatLocalDateString(sessionTradingDay);
  let stopped = false;
  await enqueueFileMutation(MUTATION_NAMESPACE, queueKey, async () => {
    const now = params.now ?? new Date();
    const filePath = await drcService.resolveDRCNotePath(sessionTradingDay);
    const existing = getUnplannedSessionsFromFile(params.plugin, filePath);
    const target = existing.find(
      (candidate) => candidate.id === params.session.id && !candidate.stoppedAt
    );
    if (!target) return;
    const stoppedAt = new Date(
      Math.max(now.getTime(), new Date(target.startedAt).getTime())
    ).toISOString();
    await drcService.updateDRCFrontmatter(
      filePath,
      {
        [UNPLANNED_SESSIONS_FRONTMATTER_KEY]: existing.map((candidate) =>
          candidate.id === target.id ? { ...candidate, stoppedAt } : candidate
        ),
      },
      'session-mode'
    );
    stopped = true;
  });
  return stopped;
}
