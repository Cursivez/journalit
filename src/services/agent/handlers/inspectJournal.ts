import { ANALYTICS_METRIC_IDS } from '../../analytics/types';
import { setupReadErrorResult } from './setupReadError';
import { OptionType } from '../../options/CustomOptionsService';
import {
  normalizeBreakEvenRange,
  normalizeBreakEvenThresholdPercent,
} from '../../../utils/breakEvenRange';
import { DEFAULT_TRADING_DAY_CUTOFF_TIME } from '../../../utils/tradingDayUtils';
import { isAccountAgentId } from '../identity/accountIdentityStore';
import { isSetupAgentId } from '../identity/setupIdentityStore';
import { AGENT_SCOPES } from '../AgentPermissions';
import type { AgentToolHandler } from '../AgentToolRegistry';
import type { AgentToolRegistry } from '../AgentToolRegistry';
import { projectAgentIntegrationCapabilities } from '../integrations';
import { agentContractManifest } from '../protocol';
import type { InspectJournalRequest } from '../protocol/generated/inspect_journal.request.generated';
import type { InspectJournalResult } from '../protocol/generated/inspect_journal.result.generated';

type Section = NonNullable<InspectJournalRequest['sections']>[number];
type Journal = Extract<InspectJournalResult, { status: 'ok' }>['journal'];
type Entity = NonNullable<NonNullable<Journal['entities']>['accounts']>[number];

interface InspectJournalCalculationSettings {
  currency?: string;
  analyticsDateBasis?: 'entry' | 'exit';
  breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
  breakEvenThresholdPercent?: number;
  breakEvenRangeMin?: number;
  breakEvenRangeMax?: number;
  tradingDayCutoffTime?: string;
  timezone?: string;
}

interface InspectJournalDependencies {
  registry: AgentToolRegistry;
  pluginVersion(): string;
  calculationSettings(): InspectJournalCalculationSettings;
  getTradeData(): Promise<Array<Record<string, unknown>>>;
  getAccountCatalog(): Promise<readonly { name: string }[]>;
  getOrCreateAccountId(name: string): Promise<string | null>;
  listSetups(): Promise<readonly { name: string; agentEntityId?: string }[]>;
  ensureSetupId(name: string): Promise<string>;
  getOptions(type: OptionType.TAG | OptionType.MISTAKE): readonly string[];
  
  readSessionMode(): Promise<{
    phase: NonNullable<Journal['session_mode']>['phase'];
    canStartUnplanned: boolean;
    runningUnplanned?: { id: string; startedAt: Date };
    
    timeZone: string;
  }>;
}

const COMPACT_SECTIONS: readonly Section[] = [
  'coverage',
  'runtime',
  'scopes',
  'connection',
];
const STANDARD_SECTIONS: readonly Section[] = [
  ...COMPACT_SECTIONS,
  'entities',
  'metrics',
  'calculation_settings',
];
const DETAILED_SECTIONS: readonly Section[] = [
  ...STANDARD_SECTIONS,
  'integrations',
  'session_mode',
];

const MAX_TRADE_COUNT = 1_000_000;
const MAX_ENTITIES = 500;
const MAX_OPTIONS = 1_000;
const MAX_BREAK_EVEN_THRESHOLD = 1_000_000;

const INTERNAL_ERROR: InspectJournalResult = {
  status: 'error',
  code: 'internal_error',
  message: 'Journal inspection is temporarily unavailable.',
  retryable: true,
};

const LIMIT_ERROR: InspectJournalResult = {
  status: 'error',
  code: 'limit_exceeded',
  message: 'Journal inspection exceeds the supported limits.',
  retryable: false,
};

function selectedSections(request: InspectJournalRequest): readonly Section[] {
  if (request.sections !== undefined) return request.sections;
  switch (request.detail) {
    case 'standard':
      return STANDARD_SECTIONS;
    case 'detailed':
      return DETAILED_SECTIONS;
    case 'compact':
    case undefined:
      return COMPACT_SECTIONS;
  }
}

function compareText(left: string, right: string): number {
  const foldedLeft = left.toLocaleLowerCase('en-US');
  const foldedRight = right.toLocaleLowerCase('en-US');
  if (foldedLeft < foldedRight) return -1;
  if (foldedLeft > foldedRight) return 1;
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function capCodePoints(value: string, maximum: number): string {
  return Array.from(value).slice(0, maximum).join('');
}

function validEntryTimestamp(value: unknown): number | null {
  if (!(value instanceof Date) && typeof value !== 'string') return null;
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function projectCalculationSettings(
  settings: InspectJournalCalculationSettings
): NonNullable<Journal['calculation_settings']> {
  const mode = settings.breakEvenThresholdMode ?? 'fixed';
  const timezone =
    settings.timezone?.trim() ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    undefined;
  const tradingDayCutoffTime =
    settings.tradingDayCutoffTime?.trim() || DEFAULT_TRADING_DAY_CUTOFF_TIME;
  if (
    (settings.analyticsDateBasis !== undefined &&
      settings.analyticsDateBasis !== 'entry' &&
      settings.analyticsDateBasis !== 'exit') ||
    (mode !== 'fixed' && mode !== 'percentage_current_balance') ||
    (settings.currency !== undefined &&
      !/^[A-Z]{3}$/.test(settings.currency)) ||
    timezone === undefined ||
    Array.from(timezone).length > 64 ||
    !/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/.test(tradingDayCutoffTime)
  ) {
    throw new Error('Calculation settings cannot be projected');
  }
  const projected: NonNullable<Journal['calculation_settings']> = {
    date_basis: settings.analyticsDateBasis ?? 'entry',
    timezone,
    break_even_threshold_mode: mode,
    trading_day_cutoff_time: tradingDayCutoffTime,
  };
  if (settings.currency !== undefined) projected.currency = settings.currency;

  if (mode === 'percentage_current_balance') {
    const threshold = normalizeBreakEvenThresholdPercent(
      settings.breakEvenThresholdPercent
    );
    if (threshold > MAX_BREAK_EVEN_THRESHOLD) {
      throw new Error('Calculation settings cannot be projected');
    }
    projected.break_even_threshold_percent = threshold;
    return projected;
  }

  const range = normalizeBreakEvenRange(settings);
  if (
    !Number.isFinite(range.min) ||
    !Number.isFinite(range.max) ||
    range.min < -MAX_BREAK_EVEN_THRESHOLD ||
    range.min > MAX_BREAK_EVEN_THRESHOLD ||
    range.max < -MAX_BREAK_EVEN_THRESHOLD ||
    range.max > MAX_BREAK_EVEN_THRESHOLD
  ) {
    throw new Error('Calculation settings cannot be projected');
  }
  projected.break_even_range = range;
  return projected;
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw new Error('Agent operation aborted');
}

export function createInspectJournalHandler(
  dependencies: InspectJournalDependencies
): AgentToolHandler<'inspect_journal'> {
  return async (request, context) => {
    try {
      throwIfAborted(context.signal);
      const sections = selectedSections(request);
      const requested = new Set(sections);
      const journal: Journal = {};

      if (requested.has('coverage')) {
        throwIfAborted(context.signal);
        const trades = await dependencies.getTradeData();
        throwIfAborted(context.signal);
        if (trades.length > MAX_TRADE_COUNT) return { result: LIMIT_ERROR };

        let first: number | null = null;
        let last: number | null = null;
        for (const trade of trades) {
          const timestamp = validEntryTimestamp(trade.entryTime);
          if (timestamp === null) continue;
          if (first === null || timestamp < first) first = timestamp;
          if (last === null || timestamp > last) last = timestamp;
        }
        journal.coverage = { trade_count: trades.length };
        if (first !== null)
          journal.coverage.first_trade_at = new Date(first).toISOString();
        if (last !== null)
          journal.coverage.last_trade_at = new Date(last).toISOString();
      }

      if (requested.has('entities')) {
        throwIfAborted(context.signal);
        const accountCatalog = await dependencies.getAccountCatalog();
        throwIfAborted(context.signal);
        if (accountCatalog.length > MAX_ENTITIES)
          return { result: LIMIT_ERROR };

        const accounts: Entity[] = [];
        const sortedAccounts = [...accountCatalog].sort((left, right) =>
          compareText(left.name, right.name)
        );
        for (const account of sortedAccounts) {
          const label = capCodePoints(account.name.trim(), 120);
          if (label.length === 0) return { result: INTERNAL_ERROR };
          throwIfAborted(context.signal);
          const id = await dependencies.getOrCreateAccountId(account.name);
          throwIfAborted(context.signal);
          if (!isAccountAgentId(id)) return { result: INTERNAL_ERROR };
          accounts.push({ id, label });
        }

        throwIfAborted(context.signal);
        const setupCatalog = await dependencies.listSetups();
        throwIfAborted(context.signal);
        if (setupCatalog.length > MAX_ENTITIES) return { result: LIMIT_ERROR };

        const setups: Entity[] = [];
        const sortedSetups = [...setupCatalog].sort((left, right) =>
          compareText(left.name, right.name)
        );
        for (const setup of sortedSetups) {
          const label = capCodePoints(setup.name.trim(), 120);
          if (label.length === 0) return { result: INTERNAL_ERROR };
          let id = setup.agentEntityId;
          if (id === undefined) {
            throwIfAborted(context.signal);
            id = await dependencies.ensureSetupId(setup.name);
            throwIfAborted(context.signal);
          }
          if (!isSetupAgentId(id)) return { result: INTERNAL_ERROR };
          setups.push({ id, label });
        }

        const tags = dependencies
          .getOptions(OptionType.TAG)
          .map((value) => capCodePoints(value, 100))
          .sort(compareText);
        const mistakes = dependencies
          .getOptions(OptionType.MISTAKE)
          .map((value) => capCodePoints(value, 100))
          .sort(compareText);
        if (tags.length > MAX_OPTIONS || mistakes.length > MAX_OPTIONS) {
          return { result: LIMIT_ERROR };
        }
        journal.entities = { accounts, setups, tags, mistakes };
      }

      if (requested.has('metrics')) journal.metrics = [...ANALYTICS_METRIC_IDS];
      if (requested.has('calculation_settings')) {
        journal.calculation_settings = projectCalculationSettings(
          dependencies.calculationSettings()
        );
      }
      if (requested.has('runtime')) {
        journal.runtime = {
          plugin_version: dependencies.pluginVersion(),
          capabilities: dependencies.registry.listCapabilities(),
        };
      }
      if (requested.has('scopes')) {
        journal.scopes = AGENT_SCOPES.filter((scope) =>
          context.scopes.includes(scope)
        );
      }
      if (requested.has('integrations')) {
        journal.integrations = dependencies.registry.has('run_integration')
          ? projectAgentIntegrationCapabilities()
          : [];
      }
      if (requested.has('connection')) journal.connection = { state: 'online' };
      if (requested.has('session_mode')) {
        throwIfAborted(context.signal);
        const sessionMode = await dependencies.readSessionMode();
        throwIfAborted(context.signal);
        const running = sessionMode.runningUnplanned;
        journal.session_mode = {
          phase: sessionMode.phase,
          can_start_unplanned: sessionMode.canStartUnplanned,
          time_zone: sessionMode.timeZone,
          ...(running
            ? {
                unplanned_session: {
                  session_id: running.id,
                  started_at: running.startedAt.toISOString(),
                },
              }
            : {}),
        };
      }

      throwIfAborted(context.signal);
      return {
        result: {
          status: 'ok',
          meta: {
            contract_version: agentContractManifest.version,
            contract_digest: agentContractManifest.digest,
            cached: false,
          },
          journal,
        },
      };
    } catch (error) {
      if (context.signal.aborted) throw context.signal.reason;
      return { result: setupReadErrorResult(error) ?? INTERNAL_ERROR };
    }
  };
}
