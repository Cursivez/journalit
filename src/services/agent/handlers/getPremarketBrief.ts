import type { AgentToolHandler } from '../AgentToolRegistry';
import { setupReadErrorResult } from './setupReadError';
import {
  agentContractManifest,
  parseAgentToolResult,
} from '../protocol/AgentContractRegistry';
import type { GetPremarketBriefResult } from '../protocol/generated/get_premarket_brief.result.generated';
import { AgentTradeReadError } from '../trades';
import type { AgentAnalyticsReadService } from '../analytics';
import type { BehaviorSelectionTrade } from '../analytics';
import { AnalyticsEvaluationError } from '../../analytics/types';
import { AnalyticsProjectionError } from '../analytics/metricProjection';
import { projectAnalyticsCalculationContext } from '../analytics/calculationContextProjection';
import {
  computeTiltSignal,
  groupByEntryHour,
  groupBySetup,
  pickEdge,
  topRecentMistakes,
} from '../analytics/behaviorAnalysis';
import type { ActiveChallengeProgress } from '../analytics/premarketChallenges';
import type { AgentReviewReadService } from '../reviews';
import { readAgentReviewContent } from '../reviews/AgentReviewContent';
import type { AgentEntityIdentityService } from '../identity';
import { isAccountAgentId } from '../identity/accountIdentityStore';
import { isSetupAgentId } from '../identity/setupIdentityStore';
import { normalizeAccountLookupKey } from '../../trade/core/TradeAccountIdentity';
import {
  createTradingDayFromString,
  getTradingDayString,
} from '../../../utils/tradingDayUtils';
import { getPreviousBusinessDay } from '../../../utils/dateUtils';
import { capText } from './insightText';

type Success = Extract<GetPremarketBriefResult, { status: 'ok' }>;

const PREMARKET_RECENT_MISTAKE_TRADING_DAYS = 14;
const PREMARKET_STATS_WINDOW_DAYS = 90;
const PREMARKET_TILT_AFTER_LOSSES = 2;
const PREMARKET_EDGE_MINIMUM_SAMPLE_SIZE = 5;
const LAST_REVIEW_LOOKBACK_DAYS = 30;
const MAX_ANSWERS = 10;
const MAX_GOALS = 20;
const MAX_RECENT_MISTAKES = 5;
const MAX_PROP_CHALLENGES = 20;

interface GetPremarketBriefDependencies {
  getAnalyticsReadService(): Promise<
    Pick<AgentAnalyticsReadService, 'readBehaviorTrades'>
  >;
  getReviewReadService(): Promise<
    Pick<AgentReviewReadService, 'readDayFrontmatterBetween'>
  >;
  getIdentityService(): Promise<
    Pick<
      AgentEntityIdentityService,
      'resolveAccountId' | 'getOrCreateAccountId' | 'getOrCreateSetupIds'
    >
  >;
  readChallengeProgress(
    signal: AbortSignal
  ): Promise<ActiveChallengeProgress[]>;
  getSettings(): {
    trade?: { tradingDayCutoffTime?: string };
    general?: { currency?: string };
  };
  
  skipsWeekends(): boolean;
  now(): Date;
}

const INVALID_REQUEST: GetPremarketBriefResult = {
  status: 'error',
  code: 'invalid_request',
  message: 'Premarket brief request is invalid.',
  retryable: false,
};

const LIMIT_EXCEEDED: GetPremarketBriefResult = {
  status: 'error',
  code: 'limit_exceeded',
  message: 'Premarket brief exceeds supported limits.',
  retryable: false,
};

const INTERNAL_ERROR: GetPremarketBriefResult = {
  status: 'error',
  code: 'internal_error',
  message: 'Premarket brief is temporarily unavailable.',
  retryable: true,
};

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

function formatLocalDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function errorResult(error: unknown): GetPremarketBriefResult {
  if (error instanceof AnalyticsProjectionError) {
    return error.kind === 'limit' ? LIMIT_EXCEEDED : INTERNAL_ERROR;
  }
  if (
    error instanceof AnalyticsEvaluationError ||
    error instanceof AgentTradeReadError
  ) {
    return error.code === 'invalid_request' ? INVALID_REQUEST : LIMIT_EXCEEDED;
  }
  return setupReadErrorResult(error) ?? INTERNAL_ERROR;
}

type Grade = 'A' | 'B' | 'C' | null;

const letterGrade = (value: unknown): Grade =>
  value === 'A' || value === 'B' || value === 'C' ? value : null;


function projectLastReview(
  reviewsByDate: ReadonlyMap<string, Readonly<Record<string, unknown>>>,
  beforeDay: string
): Success['last_review'] {
  const dates = [...reviewsByDate.keys()]
    .filter((date) => date < beforeDay)
    .sort()
    .reverse();
  for (const date of dates) {
    let content: ReturnType<typeof readAgentReviewContent>;
    try {
      content = readAgentReviewContent(reviewsByDate.get(date)!, 'day');
    } catch {
      continue;
    }
    const answers: Array<{ question: string; answer: string }> = [];
    for (const [question, answer] of content.questionEntries) {
      const trimmedQuestion = question.trim();
      const trimmedAnswer = answer.trim();
      if (!trimmedQuestion || !trimmedAnswer) continue;
      answers.push({
        question: capText(trimmedQuestion, 500),
        answer: capText(trimmedAnswer, 1000),
      });
      if (answers.length >= MAX_ANSWERS) break;
    }
    const mental = letterGrade(content.grades.mental);
    const technical = letterGrade(content.grades.technical);
    if (mental === null && technical === null && answers.length === 0) {
      continue;
    }
    return { date, mental_grade: mental, technical_grade: technical, answers };
  }
  return null;
}


function projectGoals(
  frontmatter: Readonly<Record<string, unknown>> | undefined
): Success['goals'] {
  const source = frontmatter?.dailyGoals;
  if (!Array.isArray(source)) return [];
  const statusSource: unknown = frontmatter?.dailyGoalStatus;
  const statusOf = (index: number): unknown =>
    statusSource !== null &&
    typeof statusSource === 'object' &&
    !Array.isArray(statusSource)
      ? Object.getOwnPropertyDescriptor(statusSource, `goal_${index}`)?.value
      : undefined;
  const goals: Success['goals'] = [];
  source.forEach((goal: unknown, index) => {
    if (typeof goal !== 'string' || goals.length >= MAX_GOALS) return;
    const text = goal.trim();
    if (!text) return;
    const status = statusOf(index);
    goals.push({
      text: capText(text, 300),
      done: typeof status === 'boolean' ? status : null,
    });
  });
  return goals;
}

export function createGetPremarketBriefHandler(
  dependencies: GetPremarketBriefDependencies
): AgentToolHandler<'get_premarket_brief'> {
  return async (request, context) => {
    const signal = context.signal;
    try {
      throwIfAborted(signal);
      const settings = dependencies.getSettings();
      const tradingDay =
        request.trading_day ??
        getTradingDayString(dependencies.now(), { settings });
      const day = createTradingDayFromString(tradingDay);
      if (
        !Number.isFinite(day.getTime()) ||
        formatLocalDate(day) !== tradingDay
      ) {
        return { result: INVALID_REQUEST };
      }
      const previousDay = formatLocalDate(addDays(day, -1));
      const statsWindowStart = formatLocalDate(
        addDays(day, -PREMARKET_STATS_WINDOW_DAYS)
      );
      let recentStartDate = day;
      for (
        let index = 0;
        index < PREMARKET_RECENT_MISTAKE_TRADING_DAYS;
        index += 1
      ) {
        recentStartDate = getPreviousBusinessDay(
          recentStartDate,
          dependencies.skipsWeekends()
        );
      }
      const recentWindowStart = formatLocalDate(recentStartDate);
      const earliestStart =
        recentWindowStart < statsWindowStart
          ? recentWindowStart
          : statsWindowStart;

      const analytics = await dependencies.getAnalyticsReadService();
      throwIfAborted(signal);
      
      
      const selection = await analytics.readBehaviorTrades(
        {
          trade_types: ['regular'],
          ...(request.account_ids ? { account_ids: request.account_ids } : {}),
          date: {
            from: addDays(
              createTradingDayFromString(earliestStart),
              -1
            ).toISOString(),
            to: addDays(day, 1).toISOString(),
          },
        },
        signal
      );
      throwIfAborted(signal);
      const inWindow = (trade: BehaviorSelectionTrade, from: string): boolean =>
        trade.tradingDay >= from && trade.tradingDay <= previousDay;
      const statsTrades = selection.trades.filter((trade) =>
        inWindow(trade, statsWindowStart)
      );
      const recentTrades = selection.trades.filter((trade) =>
        inWindow(trade, recentWindowStart)
      );
      const covered = new Set([...statsTrades, ...recentTrades]);
      const calculation = projectAnalyticsCalculationContext(
        selection.calculationFor([...covered].map((trade) => trade.path))
      );
      
      
      
      const statsAvailable =
        !calculation.input.contains_unconverted_foreign_currencies &&
        ![...covered].some((trade) => trade.conversionIssue);

      const recent_mistakes: Success['recent_mistakes'] = {
        window_trading_days: PREMARKET_RECENT_MISTAKE_TRADING_DAYS,
        items: statsAvailable
          ? topRecentMistakes(recentTrades, MAX_RECENT_MISTAKES).map(
              (item) => ({
                ...item,
                mistake: capText(item.mistake, 100),
              })
            )
          : [],
      };
      const tiltSignal = statsAvailable
        ? computeTiltSignal(statsTrades, PREMARKET_TILT_AFTER_LOSSES)
        : null;
      const edge = statsAvailable
        ? await projectEdge(statsTrades, dependencies, signal)
        : {
            window_days: PREMARKET_STATS_WINDOW_DAYS,
            minimum_sample_size: PREMARKET_EDGE_MINIMUM_SAMPLE_SIZE,
            best_setup: null,
            worst_setup: null,
            best_entry_hour: null,
            worst_entry_hour: null,
          };

      const reviews = await dependencies.getReviewReadService();
      throwIfAborted(signal);
      const reviewsByDate = await reviews.readDayFrontmatterBetween(
        formatLocalDate(addDays(day, -LAST_REVIEW_LOOKBACK_DAYS)),
        tradingDay,
        signal
      );
      throwIfAborted(signal);

      const candidate = {
        status: 'ok' as const,
        meta: {
          contract_version: agentContractManifest.version,
          contract_digest: agentContractManifest.digest,
          cached: false,
        },
        trading_day: tradingDay,
        calculation_context: calculation,
        last_review: projectLastReview(reviewsByDate, tradingDay),
        goals: projectGoals(reviewsByDate.get(tradingDay)),
        recent_mistakes,
        tilt_signal:
          tiltSignal === null
            ? null
            : { window_days: PREMARKET_STATS_WINDOW_DAYS, ...tiltSignal },
        edge,
        prop_challenges: await projectPropChallenges(
          request.account_ids,
          settings.general?.currency,
          dependencies,
          signal
        ),
      };
      try {
        return {
          result: parseAgentToolResult('get_premarket_brief', candidate),
        };
      } catch {
        return { result: INTERNAL_ERROR };
      }
    } catch (error) {
      if (signal.aborted) throw signal.reason;
      return { result: errorResult(error) };
    }
  };
}

async function projectEdge(
  trades: readonly BehaviorSelectionTrade[],
  dependencies: GetPremarketBriefDependencies,
  signal: AbortSignal
): Promise<Success['edge']> {
  const labelByKey = new Map<string, string>();
  for (const trade of trades) {
    for (const setup of trade.setups) {
      const existing = labelByKey.get(setup.key);
      if (existing === undefined || setup.label < existing) {
        labelByKey.set(setup.key, setup.label);
      }
    }
  }
  const compareText = (left: string, right: string): number =>
    left < right ? -1 : left > right ? 1 : 0;
  const setups = pickEdge(
    groupBySetup(trades),
    PREMARKET_EDGE_MINIMUM_SAMPLE_SIZE,
    compareText
  );
  const hours = pickEdge(
    groupByEntryHour(trades),
    PREMARKET_EDGE_MINIMUM_SAMPLE_SIZE,
    (left, right) => left - right
  );
  const pickedLabels = [setups.best, setups.worst].flatMap((pick) => {
    const label = pick ? labelByKey.get(pick.key) : undefined;
    return label === undefined ? [] : [label];
  });
  const ids =
    pickedLabels.length === 0
      ? new Map<string, string>()
      : await (
          await dependencies.getIdentityService()
        ).getOrCreateSetupIds(pickedLabels);
  throwIfAborted(signal);
  const setupStat = (
    pick: (typeof setups)['best']
  ): Success['edge']['best_setup'] => {
    if (!pick) return null;
    const label = labelByKey.get(pick.key);
    const id = label === undefined ? undefined : ids.get(label);
    if (label === undefined || !isSetupAgentId(id)) return null;
    return {
      setup_id: id,
      name: capText(label, 200),
      trade_count: pick.trade_count,
      net_pnl: pick.net_pnl,
      win_rate: pick.win_rate,
    };
  };
  const hourStat = (
    pick: (typeof hours)['best']
  ): Success['edge']['best_entry_hour'] =>
    pick
      ? {
          hour: pick.key,
          trade_count: pick.trade_count,
          net_pnl: pick.net_pnl,
          win_rate: pick.win_rate,
        }
      : null;
  return {
    window_days: PREMARKET_STATS_WINDOW_DAYS,
    minimum_sample_size: PREMARKET_EDGE_MINIMUM_SAMPLE_SIZE,
    best_setup: setupStat(setups.best),
    worst_setup: setupStat(setups.worst),
    best_entry_hour: hourStat(hours.best),
    worst_entry_hour: hourStat(hours.worst),
  };
}

async function projectPropChallenges(
  accountIds: readonly string[] | undefined,
  defaultCurrency: string | undefined,
  dependencies: GetPremarketBriefDependencies,
  signal: AbortSignal
): Promise<Success['prop_challenges']> {
  const identity = await dependencies.getIdentityService();
  throwIfAborted(signal);
  let allowed: Set<string> | null = null;
  if (accountIds !== undefined) {
    const names = await Promise.all(
      accountIds.map((id) => identity.resolveAccountId(id))
    );
    throwIfAborted(signal);
    allowed = new Set(
      names.flatMap((name) => (name ? [normalizeAccountLookupKey(name)] : []))
    );
    if (allowed.size === 0) return [];
  }
  const challenges = await dependencies.readChallengeProgress(signal);
  throwIfAborted(signal);
  const candidates = challenges.flatMap((challenge) => {
    const currency = challenge.currency ?? defaultCurrency ?? 'USD';
    const name = challenge.accountName.trim();
    return (allowed &&
      !allowed.has(normalizeAccountLookupKey(challenge.accountName))) ||
      !/^[A-Z]{3}$/.test(currency) ||
      !name
      ? []
      : [{ challenge, currency, name }];
  });
  
  
  
  const agentIds = await Promise.all(
    candidates.map(({ challenge }) =>
      identity.getOrCreateAccountId(challenge.accountName)
    )
  );
  throwIfAborted(signal);
  const result: Success['prop_challenges'] = [];
  candidates.forEach(({ challenge, currency, name }, index) => {
    const accountId = agentIds[index];
    if (result.length >= MAX_PROP_CHALLENGES || !isAccountAgentId(accountId)) {
      return;
    }
    const { profitTarget, drawdown } = challenge.progress;
    result.push({
      account_id: accountId,
      name: capText(name, 200),
      phase_name:
        challenge.phaseName === null ? null : capText(challenge.phaseName, 200),
      currency,
      profit_target: profitTarget
        ? { percent: profitTarget.percent, remaining: profitTarget.remaining }
        : null,
      drawdown: drawdown
        ? { percent: drawdown.percent, remaining: drawdown.remaining }
        : null,
    });
  });
  return result;
}
