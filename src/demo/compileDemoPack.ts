import type { MissedTradeFormData } from '../components/missedTrade/types';
import type { BacktestTradeFormData } from '../services/backtestTrade/BacktestTradeService';
import type { TradeData } from '../services/trade/TradeService';
import { CurrencyCode } from '../utils/currencyConfig';
import { calculateDirectionalPriceDiff } from '../utils/pnlCalculation';
import {
  DEMO_DEFAULT_ROOT,
  DEMO_PACK_VERSION,
  type DemoGenerationInputs,
} from './DemoManifest';
import {
  ACCOUNTS,
  DEMO_TRADE_FIELD_IDS,
  INSTRUMENTS,
  MISTAKES,
  SETUP_NAMES,
  createSampleAccountTimeline,
  createSeededRandom,
  distributeDates,
  eligibleSessionsBetween,
  getGeneratedInstrument,
  getInstrumentProfile,
  latestCompletedEligibleSession,
  addCalendarDays,
  atSessionTime,
  roundTo,
  type CompiledDemoEntity,
  type CompiledDemoPack,
  type DemoAccountName,
  type DemoTradeData,
  type SeededRandom,
} from './demoPackCore';
import { createSampleSettings } from './demoPackSettings';
import {
  SAMPLE_CHALLENGE_SCRIPTS,
  createFailedChallenge,
  createPayoutReadyChallenge,
  createReadyToAdvanceChallenge,
} from './demoPackPropChallenges';
import {
  createMedia,
  createReviews,
  createSetups,
  createSupportNotes,
} from './demoPackContent';

export {
  DEMO_CUSTOM_FIELDS_NAMESPACE,
  DEMO_OPTIONS_NAMESPACE,
  type CompiledDemoPack,
  type DemoMediaRecipe,
  type DemoReviewRecipe,
} from './demoPackCore';

function makeReviewSections(note: string): TradeData['tradeReview'] {
  return {
    sections: {
      'decision-quality': {
        textAreas: { reflection: note },
      },
    },
  };
}

function createTradeData(options: {
  index: number;
  date: Date;
  timezone: string;
  random: SeededRandom;
  instanceId: string;
  entityId: string;
  instrument?: (typeof INSTRUMENTS)[number];
  setup?: (typeof SETUP_NAMES)[number];
  direction?: 'long' | 'short';
  outcome?: 'win' | 'loss' | 'breakeven';
  account?: (typeof ACCOUNTS)[number];
  mistake?: (typeof MISTAKES)[number];
  planAdherence?: 'Followed' | 'Deviated';
  thesis?: string;
  simple?: boolean;
  partialExit?: boolean;
  open?: boolean;
  images?: string[];
  mfeMultiplier?: number;
  
  netPnl?: number;
  
  positionSizeOverride?: number;
}): DemoTradeData {
  const instrument =
    options.instrument ?? INSTRUMENTS[options.index % INSTRUMENTS.length];
  const profile = getInstrumentProfile(instrument);
  const direction =
    options.direction ?? (options.index % 2 === 0 ? 'long' : 'short');
  const outcome =
    options.outcome ??
    (options.index % 10 < (instrument === 'MNQ' ? 6 : 5)
      ? 'win'
      : options.index % 10 < 9
        ? 'loss'
        : 'breakeven');
  const entryTime = atSessionTime(
    options.date,
    5 + (options.index % 8) * 17,
    options.timezone
  );
  const exitTime = new Date(entryTime);
  exitTime.setUTCMinutes(
    exitTime.getUTCMinutes() + 25 + (options.index % 6) * 13
  );
  const priceNoise = options.random.int(-40, 40) * profile.tickSize;
  const entryPrice = roundTo(profile.basePrice + priceNoise, profile.tickSize);
  const directionSign = direction === 'long' ? 1 : -1;
  const magnitudeTicks =
    outcome === 'win' ? 10 + (options.index % 12) : 6 + (options.index % 7);
  const signedTicks =
    outcome === 'breakeven'
      ? 0
      : directionSign * (outcome === 'win' ? 1 : -1) * magnitudeTicks;
  const positionSize =
    options.positionSizeOverride ??
    (profile.assetType === 'futures'
      ? instrument === 'MNQ'
        ? 4 + (options.index % 5)
        : 1 + (options.index % 3)
      : 10 * (2 + (options.index % 8)));
  
  
  
  const commissionForSize =
    profile.assetType === 'futures' ? positionSize * 1.24 : 0;
  const feesForSize = profile.assetType === 'stock' ? positionSize * 0.004 : 0;
  const exitPrice =
    options.netPnl === undefined
      ? roundTo(entryPrice + signedTicks * profile.tickSize, profile.tickSize)
      : roundTo(
          entryPrice +
            directionSign *
              ((options.netPnl + commissionForSize + feesForSize) /
                (positionSize * profile.dollarPerPoint)),
          profile.tickSize
        );
  const stopDistanceTicks = 8 + (options.index % 4);
  const stopLoss = roundTo(
    entryPrice - directionSign * stopDistanceTicks * profile.tickSize,
    profile.tickSize
  );
  const commission = profile.assetType === 'futures' ? positionSize * 1.24 : 0;
  const fees = profile.assetType === 'stock' ? positionSize * 0.004 : 0;
  const setup =
    options.setup ?? SETUP_NAMES[options.index % SETUP_NAMES.length];
  const reviewed = !options.open && options.index % 7 !== 0;
  const planAdherence = options.planAdherence ?? 'Followed';
  const customFields: Record<string, unknown> = {
    [DEMO_TRADE_FIELD_IDS.planAdherence]: planAdherence,
  };
  if (!options.simple || options.index % 4 !== 0) {
    customFields[DEMO_TRADE_FIELD_IDS.confidence] = 1 + (options.index % 5);
  }
  if (!options.simple && options.index % 3 !== 0) {
    customFields[DEMO_TRADE_FIELD_IDS.confluence] = [
      options.index % 2 === 0 ? 'Prior Level' : 'Opening Range',
      ...(options.index % 5 === 0 ? ['Higher-Timeframe Alignment'] : []),
    ];
  }
  if (!options.simple && options.index % 6 === 0) {
    customFields[DEMO_TRADE_FIELD_IDS.catalystNotes] =
      'Illustrative scheduled-event context; no live market data used.';
  }

  const data: DemoTradeData = {
    entryTime,
    exitTime: options.open ? undefined : exitTime,
    entryPrice,
    exitPrice: options.open ? undefined : exitPrice,
    hasExplicitExitPrice: !options.open,
    positionSize,
    direction,
    instrument,
    assetType: profile.assetType,
    account: [options.account ?? profile.account],
    setup: [setup],
    mistake: options.mistake ? [options.mistake] : [],
    customTags: [
      options.index % 2 === 0 ? 'Trend Day' : 'Range Day',
      options.index % 3 === 0 ? 'High Volatility' : 'Planned Trade',
      ...(options.partialExit ? ['Scale Out'] : []),
    ],
    thesis:
      options.thesis ??
      (options.simple
        ? 'Simple example using only the essential trade fields.'
        : `${setup}: waited for the planned trigger and used the predefined invalidation.`),
    commission,
    commissionType: 'fixed',
    hasExplicitCommission: true,
    fees,
    stopLoss,
    riskAmount:
      Math.abs(entryPrice - stopLoss) * positionSize * profile.dollarPerPoint,
    dollarPerPoint:
      profile.assetType === 'futures' ? profile.dollarPerPoint : undefined,
    tickSize: profile.tickSize,
    tickValue:
      profile.assetType === 'futures'
        ? profile.tickSize * profile.dollarPerPoint
        : undefined,
    currency: CurrencyCode.USD,
    entries: [{ time: entryTime, price: entryPrice, size: positionSize }],
    tradeStatus: options.open ? 'OPEN' : 'CLOSED',
    reviewed,
    reviewedAt: reviewed
      ? new Date(exitTime.getTime() + 90 * 60 * 1000).toISOString()
      : undefined,
    tradeReview: reviewed
      ? makeReviewSections(
          planAdherence === 'Deviated'
            ? 'The result was positive, but the entry did not meet the confirmation rule.'
            : outcome === 'loss'
              ? 'The setup and risk were valid. This was an acceptable planned loss.'
              : 'The trade followed the plan; keep the same entry and risk process.'
        )
      : undefined,
    customFields,
    images: options.images,
    journalitSampleInstance: options.instanceId,
    journalitSampleEntityId: options.entityId,
  };

  if (options.open) {
    data.openQuantity = positionSize;
    data.closedQuantity = 0;
    data.unrealizedPriceSnapshot = roundTo(
      entryPrice + directionSign * 4 * profile.tickSize,
      profile.tickSize
    );
    data.unrealizedPriceSnapshotTime = new Date(
      entryTime.getTime() + 45 * 60 * 1000
    );
  } else if (options.partialExit && positionSize >= 2) {
    const firstSize = Math.max(1, Math.floor(positionSize / 2));
    const secondSize = positionSize - firstSize;
    const firstExitTime = new Date(exitTime.getTime() - 12 * 60 * 1000);
    const firstExitPrice = roundTo(
      entryPrice + signedTicks * profile.tickSize * 0.55,
      profile.tickSize
    );
    data.exits = [
      { time: firstExitTime, price: firstExitPrice, size: firstSize },
      { time: exitTime, price: exitPrice, size: secondSize },
    ];
  } else {
    data.exits = [{ time: exitTime, price: exitPrice, size: positionSize }];
  }

  const directionalMove = calculateDirectionalPriceDiff(
    data,
    entryPrice,
    exitPrice
  );
  if (directionalMove === null) {
    throw new Error('Generated sample trade has invalid price direction data');
  }
  const grossMove =
    Math.abs(directionalMove) * positionSize * profile.dollarPerPoint;
  data.mae = Math.max(
    profile.tickSize * positionSize * profile.dollarPerPoint * 2,
    grossMove * (outcome === 'loss' ? 1.15 : 0.35)
  );
  data.mfe = Math.max(
    profile.tickSize * positionSize * profile.dollarPerPoint * 3,
    grossMove * (options.mfeMultiplier ?? (outcome === 'win' ? 1.2 : 0.7))
  );
  data.maePrice = roundTo(
    entryPrice -
      directionSign * (data.mae / positionSize / profile.dollarPerPoint),
    profile.tickSize
  );
  data.mfePrice = roundTo(
    entryPrice +
      directionSign * (data.mfe / positionSize / profile.dollarPerPoint),
    profile.tickSize
  );

  return data;
}

export function compileDemoPack(options: {
  instanceId: string;
  seed: string;
  anchorInstant: Date;
  timezone: string;
  weekStartDay: 'monday' | 'sunday';
  root?: string;
}): CompiledDemoPack {
  if (Number.isNaN(options.anchorInstant.getTime())) {
    throw new Error('Demo anchor instant must be a valid date');
  }
  const root = options.root ?? DEMO_DEFAULT_ROOT;
  const inputs: DemoGenerationInputs = {
    packVersion: DEMO_PACK_VERSION,
    seed: options.seed,
    anchorInstant: options.anchorInstant.toISOString(),
    timezone: options.timezone,
    weekStartDay: options.weekStartDay,
  };
  const random = createSeededRandom(
    `${options.seed}:${inputs.packVersion}:${inputs.anchorInstant}:${inputs.timezone}:${inputs.weekStartDay}`
  );
  const latestSession = latestCompletedEligibleSession(
    options.anchorInstant,
    options.timezone
  );
  const accountTimeline = createSampleAccountTimeline(latestSession);
  const recentRangeStart = addCalendarDays(latestSession, -30);
  const recentEightWeekStart = addCalendarDays(latestSession, -56);
  const recentSessions = eligibleSessionsBetween(
    recentEightWeekStart,
    latestSession
  );
  const recentMonthSessions = recentSessions.filter(
    (date) => date >= recentRangeStart
  );
  const olderRecentSessions = recentSessions.filter(
    (date) => date < recentRangeStart
  );
  const currentYearStart = new Date(
    Date.UTC(latestSession.getUTCFullYear(), 0, 1)
  );
  const currentYearOlderSessions = eligibleSessionsBetween(
    currentYearStart,
    addCalendarDays(recentEightWeekStart, -1)
  );
  const previousYearSessions = eligibleSessionsBetween(
    new Date(Date.UTC(latestSession.getUTCFullYear() - 1, 0, 1)),
    new Date(Date.UTC(latestSession.getUTCFullYear() - 1, 11, 31))
  );
  const media = createMedia(root);

  const authoredDates = recentSessions.slice(-8);
  if (authoredDates.length < 8) {
    throw new Error('Unable to allocate eight recent eligible sample sessions');
  }
  const authored: Array<CompiledDemoEntity<DemoTradeData>> = [
    {
      entityId: 'scenario-trend-pullback-win',
      data: createTradeData({
        timezone: options.timezone,
        index: 1,
        date: authoredDates[0],
        random,
        instanceId: options.instanceId,
        entityId: 'scenario-trend-pullback-win',
        instrument: 'MES',
        setup: 'Trend Pullback',
        direction: 'long',
        outcome: 'win',
        partialExit: true,
        thesis:
          'Trend Pullback followed the entry, invalidation and two-exit plan.',
        images: [media[0].path, media[1].path],
      }),
    },
    {
      entityId: 'scenario-trend-pullback-loss',
      data: createTradeData({
        timezone: options.timezone,
        index: 2,
        date: authoredDates[1],
        random,
        instanceId: options.instanceId,
        entityId: 'scenario-trend-pullback-loss',
        instrument: 'MNQ',
        setup: 'Trend Pullback',
        direction: 'short',
        outcome: 'loss',
        thesis:
          'A valid planned loss; the review does not invent a process mistake.',
        images: [media[2].path, media[3].path],
      }),
    },
    {
      entityId: 'scenario-profitable-chase',
      data: createTradeData({
        timezone: options.timezone,
        index: 3,
        date: authoredDates[2],
        random,
        instanceId: options.instanceId,
        entityId: 'scenario-profitable-chase',
        instrument: 'AAPL',
        setup: 'Opening Range Breakout',
        direction: 'long',
        outcome: 'win',
        mistake: 'Chased Entry',
        planAdherence: 'Deviated',
        thesis: 'The result was profitable, but entry preceded confirmation.',
        images: [media[4].path, media[5].path],
      }),
    },
    {
      entityId: 'scenario-premature-exit',
      data: createTradeData({
        timezone: options.timezone,
        index: 4,
        date: authoredDates[3],
        random,
        instanceId: options.instanceId,
        entityId: 'scenario-premature-exit',
        instrument: 'MSFT',
        setup: 'Range Reversal',
        direction: 'long',
        outcome: 'win',
        mistake: 'Exited Early',
        thesis:
          'A modest profit despite a substantially larger favourable excursion.',
        images: [media[6].path],
        mfeMultiplier: 3.5,
      }),
    },
    {
      entityId: 'scenario-evaluation-constraint',
      data: createTradeData({
        timezone: options.timezone,
        index: 5,
        date: authoredDates[4],
        random,
        instanceId: options.instanceId,
        entityId: 'scenario-evaluation-constraint',
        instrument: 'MNQ',
        setup: 'Failed Breakout',
        account: 'Example Evaluation',
        
        
        
        positionSizeOverride: 3,
        direction: 'short',
        outcome: 'loss',
        thesis:
          'Synthetic evaluation example using generic target and drawdown constraints.',
        images: [media[7].path],
      }),
    },
    {
      entityId: 'scenario-simple-trade',
      data: createTradeData({
        timezone: options.timezone,
        index: 6,
        date: authoredDates[5],
        random,
        instanceId: options.instanceId,
        entityId: 'scenario-simple-trade',
        instrument: 'MES',
        setup: 'Opening Range Breakout',
        direction: 'long',
        outcome: 'breakeven',
        simple: true,
      }),
    },
    {
      entityId: 'scenario-open-mes',
      data: createTradeData({
        timezone: options.timezone,
        index: 7,
        date: authoredDates[6],
        random,
        instanceId: options.instanceId,
        entityId: 'scenario-open-mes',
        instrument: 'MES',
        setup: 'Trend Pullback',
        direction: 'long',
        open: true,
        thesis:
          'Intentionally open sample position; unrealized P&L is derived from the snapshot.',
      }),
    },
    {
      entityId: 'scenario-open-aapl',
      data: createTradeData({
        timezone: options.timezone,
        index: 8,
        date: authoredDates[7],
        random,
        instanceId: options.instanceId,
        entityId: 'scenario-open-aapl',
        instrument: 'AAPL',
        setup: 'Range Reversal',
        direction: 'short',
        open: true,
        thesis: 'Second intentionally open sample position.',
      }),
    },
  ];

  const generatedDates = [
    ...distributeDates(recentMonthSessions, 50),
    ...distributeDates(olderRecentSessions, 32),
    ...distributeDates(currentYearOlderSessions, 90),
    ...distributeDates(previousYearSessions, 120),
  ];
  while (generatedDates.length < 292) {
    generatedDates.push(
      new Date(
        previousYearSessions[
          generatedDates.length % previousYearSessions.length
        ]
      )
    );
  }
  generatedDates.length = 292;
  generatedDates.sort((left, right) => left.getTime() - right.getTime());
  const generated = generatedDates.map((date, index) => {
    const entityId = `trade-${String(index + 1).padStart(3, '0')}`;
    return {
      entityId,
      data: createTradeData({
        timezone: options.timezone,
        index: index + 20,
        date,
        random,
        instanceId: options.instanceId,
        entityId,
        instrument: getGeneratedInstrument(date, index, accountTimeline),
        partialExit: index % 19 === 0,
        mistake:
          index % 9 === 0 ? MISTAKES[(index / 9) % MISTAKES.length] : undefined,
        planAdherence: index % 11 === 0 ? 'Deviated' : 'Followed',
      }),
    };
  });
  
  
  
  
  const challengeWindows = new Map<
    DemoAccountName,
    { days: Date[]; exits: Date[]; firstPhaseEnd?: Date }
  >();
  const challengeTrades = SAMPLE_CHALLENGE_SCRIPTS.flatMap((script) => {
    const sessions = recentSessions.slice(-script.days.length);
    const entries = script.days.map((day, index) => {
      const date = sessions[index] ?? sessions[sessions.length - 1];
      const entityId = `challenge-${script.account
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}-${String(index + 1).padStart(2, '0')}`;
      return {
        entityId,
        data: createTradeData({
          timezone: options.timezone,
          index: 400 + index,
          date,
          random,
          instanceId: options.instanceId,
          entityId,
          instrument: 'MNQ',
          account: script.account,
          direction: day.netPnl >= 0 ? 'long' : 'short',
          outcome: day.netPnl >= 0 ? 'win' : 'loss',
          netPnl: day.netPnl,
          positionSizeOverride: script.contracts,
        }),
      };
    });
    
    
    
    
    
    
    const exits = entries.flatMap((entry) =>
      entry.data.exitTime ? [entry.data.exitTime] : []
    );
    challengeWindows.set(script.account, {
      days: sessions,
      exits,
      firstPhaseEnd:
        script.firstPhaseDays > 0
          ? exits[script.firstPhaseDays - 1]
          : undefined,
    });
    return entries;
  });

  const trades = [...generated, ...authored, ...challengeTrades].sort(
    (left, right) =>
      left.data.entryTime.getTime() - right.data.entryTime.getTime()
  );

  const missedTrades = distributeDates(recentSessions, 6).map((date, index) => {
    const entityId = `missed-${index + 1}`;
    const instrument = INSTRUMENTS[index % INSTRUMENTS.length];
    const profile = getInstrumentProfile(instrument);
    const entryTime = atSessionTime(date, 25 + index * 9, options.timezone);
    return {
      entityId,
      data: {
        isMissedTrade: true,
        entryTime,
        exitTime: new Date(entryTime.getTime() + 45 * 60 * 1000),
        entryPrice: profile.basePrice,
        exitPrice: profile.basePrice + profile.tickSize * 12,
        positionSize: profile.assetType === 'futures' ? 1 : 25,
        direction: index % 2 === 0 ? 'long' : 'short',
        instrument,
        assetType: profile.assetType,
        account: [profile.account],
        setup: [SETUP_NAMES[index % SETUP_NAMES.length]],
        missedReason:
          index === 0
            ? 'I was preparing another order and did not have the checklist open.'
            : 'The planned alert was not configured for this illustrative session.',
        thesis: 'Missed opportunity retained for process review only.',
        journalitSampleInstance: options.instanceId,
        journalitSampleEntityId: entityId,
      },
    } satisfies CompiledDemoEntity<MissedTradeFormData>;
  });

  const backtestTrades = distributeDates(previousYearSessions, 12).map(
    (date, index) => {
      const entityId = `backtest-${index + 1}`;
      const base = createTradeData({
        timezone: options.timezone,
        index: index + 400,
        date,
        random,
        instanceId: options.instanceId,
        entityId,
        instrument: getGeneratedInstrument(date, index, accountTimeline),
        setup: SETUP_NAMES[index % SETUP_NAMES.length],
      });
      const { optionType, ...compatibleBase } = base;
      void optionType;
      return {
        entityId,
        data: {
          ...compatibleBase,
          isBacktestTrade: true,
          instrument: base.instrument ?? 'MES',
          assetType: base.assetType ?? 'futures',
          exitTime: base.exitTime ?? base.entryTime,
          exitPrice: base.exitPrice ?? base.entryPrice,
        },
      } satisfies CompiledDemoEntity<BacktestTradeFormData>;
    }
  );

  const reviews = createReviews({
    root,
    timezone: options.timezone,
    anchorInstant: options.anchorInstant,
    latestSession,
    recentSessions,
    trades,
    weekStartDay: options.weekStartDay,
  });
  
  
  const windowFor = (account: DemoAccountName) => challengeWindows.get(account);
  const evalWindow = windowFor('Example Evaluation');
  const fundedWindow = windowFor('Example Funded');
  const failedWindow = windowFor('Example Failed Challenge');
  const dayBefore = (date: Date) => addCalendarDays(date, -1);
  const challenges = {
    evaluation: createReadyToAdvanceChallenge({
      startedAt: dayBefore(evalWindow?.days[0] ?? latestSession),
    }),
    funded: createPayoutReadyChallenge(
      {
        startedAt: dayBefore(fundedWindow?.days[0] ?? latestSession),
        completedAt: fundedWindow?.firstPhaseEnd,
      },
      {
        startedAt: fundedWindow?.firstPhaseEnd ?? dayBefore(latestSession),
      }
    ),
    failed: createFailedChallenge(
      { startedAt: dayBefore(failedWindow?.days[0] ?? latestSession) },
      failedWindow?.exits[failedWindow.exits.length - 1] ?? latestSession
    ),
  };

  
  
  
  
  
  const challengePayouts = SAMPLE_CHALLENGE_SCRIPTS.flatMap((script) => {
    const window = challengeWindows.get(script.account);
    if (!window) return [];
    return (script.payouts ?? []).flatMap((payout) => {
      const exit = window.exits[payout.afterDayIndex];
      if (!exit) return [];
      return [
        {
          account: script.account,
          id: payout.id,
          amount: payout.amount,
          description: payout.description,
          
          
          date: new Date(exit.getTime() + 4 * 60 * 60 * 1000),
        },
      ];
    });
  });

  const settings = createSampleSettings({
    root,
    inputs,
    latestSession,
    recentRangeStart,
    accountTimeline,
    challenges,
    challengePayouts,
  });

  return {
    inputs,
    root,
    settings,
    setups: createSetups(options.instanceId, root),
    trades,
    missedTrades,
    backtestTrades,
    reviews,
    media,
    supportNotes: createSupportNotes(root, latestSession),
    latestSession,
    recentRangeStart,
  };
}
