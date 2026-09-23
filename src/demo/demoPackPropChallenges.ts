

import type {
  PropChallengeConfig,
  PropChallengePhase,
} from '../services/propChallenge/types';
import type { DemoAccountName } from './demoPackCore';


interface SampleChallengeDay {
  netPnl: number;
}

interface SampleChallengePayout {
  id: string;
  
  afterDayIndex: number;
  amount: number;
  description: string;
}

interface SampleChallengeScript {
  account: DemoAccountName;
  
  contracts: number;
  
  days: SampleChallengeDay[];
  
  firstPhaseDays: number;
  
  payouts?: SampleChallengePayout[];
}

const pnl = (...values: number[]): SampleChallengeDay[] =>
  values.map((netPnl) => ({ netPnl }));


const READY_TO_ADVANCE_SCRIPT: SampleChallengeScript = {
  account: 'Example Evaluation',
  contracts: 3,
  firstPhaseDays: 0,
  days: pnl(340, -160, 480, 260, -120, 520, 380, -90, 560, 300, 450, -140, 530),
};


const PAYOUT_READY_SCRIPT: SampleChallengeScript = {
  account: 'Example Funded',
  contracts: 4,
  firstPhaseDays: 7,
  days: pnl(
    
    380,
    520,
    450,
    610,
    480,
    390,
    420,
    
    600,
    620,
    580,
    640,
    560,
    610,
    590,
    570,
    630,
    500
  ),
  payouts: [
    {
      id: 'sample-funded-payout-1',
      afterDayIndex: 8,
      amount: 1200,
      description: 'Illustrative payout',
    },
    {
      id: 'sample-funded-payout-2',
      afterDayIndex: 11,
      amount: 900,
      description: 'Illustrative payout',
    },
  ],
};


const FAILED_SCRIPT: SampleChallengeScript = {
  account: 'Example Failed Challenge',
  contracts: 5,
  firstPhaseDays: 0,
  days: pnl(380, 420, 510, 340, -900, -900, -900),
};

export const SAMPLE_CHALLENGE_SCRIPTS = [
  READY_TO_ADVANCE_SCRIPT,
  PAYOUT_READY_SCRIPT,
  FAILED_SCRIPT,
];

interface PhaseWindow {
  startedAt: Date;
  completedAt?: Date;
}


export function createReadyToAdvanceChallenge(
  evaluation: PhaseWindow
): PropChallengeConfig {
  const phases: PropChallengePhase[] = [
    {
      id: 'sample-mffu-evaluation',
      name: 'Evaluation',
      stage: 'evaluation',
      status: 'active',
      startingBalance: 50000,
      startedAt: evaluation.startedAt.toISOString(),
      rules: [
        {
          id: 'sample-mffu-eval-target',
          enabled: true,
          kind: 'profit_target',
          amount: 3000,
          targetType: 'absolute',
        },
        {
          id: 'sample-mffu-eval-drawdown',
          enabled: true,
          kind: 'drawdown',
          mode: 'eod_trailing',
          amount: 2000,
        },
        {
          id: 'sample-mffu-eval-days',
          enabled: true,
          kind: 'minimum_trading_days',
          days: 2,
        },
        {
          id: 'sample-mffu-eval-consistency',
          enabled: true,
          kind: 'consistency',
          maxBestDayPercent: 50,
        },
        {
          id: 'sample-mffu-eval-size',
          enabled: true,
          kind: 'max_position_size',
          maxContracts: 3,
        },
      ],
    },
    {
      id: 'sample-mffu-sim-funded',
      name: 'Sim Funded',
      stage: 'sim_funded',
      status: 'pending',
      startingBalance: 50000,
      rules: [
        {
          id: 'sample-mffu-funded-drawdown',
          enabled: true,
          kind: 'drawdown',
          mode: 'eod_trailing',
          amount: 2000,
        },
        {
          id: 'sample-mffu-funded-size',
          enabled: true,
          kind: 'max_position_size',
          maxContracts: 5,
        },
      ],
      payoutPolicy: {
        version: 1,
        
        
        
        source: 'manual',
        cycle: { kind: 'calendar_days', days: 14, anchor: 'first_trade' },
        availability: {
          kind: 'profit_above_balance_floor',
          balanceFloor: 52100,
          requestPercent: 100,
        },
        minimumRequest: 1000,
        maximumRequest: { kind: 'fixed', amount: 100000 },
        profitSplit: { kind: 'fixed', percent: 80 },
        maximumPayouts: 3,
        afterPayout: {
          balanceAction: 'deduct_request',
          drawdownAction: 'lock_at_balance',
          drawdownFloor: 50100,
          resetCycle: true,
          maximumPayoutOutcome: 'eligible_for_live_review',
        },
      },
    },
  ];

  return {
    challengeName: 'Pro 50K',
    firmName: 'MyFundedFutures',
    status: 'active',
    currentPhaseId: 'sample-mffu-evaluation',
    phases,
  };
}


export function createPayoutReadyChallenge(
  firstPhase: PhaseWindow,
  fundedPhase: PhaseWindow
): PropChallengeConfig {
  const trailingDrawdown = (id: string) => ({
    id,
    enabled: true,
    kind: 'drawdown' as const,
    mode: 'eod_trailing' as const,
    amount: 2000,
  });
  const dailyLoss = (id: string) => ({
    id,
    enabled: true,
    kind: 'daily_loss_limit' as const,
    amount: 1000,
    breachAction: 'suspend_until_next_session' as const,
  });

  return {
    challengeName: '50K EOD',
    firmName: 'Apex Trader Funding',
    status: 'active',
    currentPhaseId: 'sample-apex-funded',
    phases: [
      {
        id: 'sample-apex-evaluation',
        name: 'Evaluation',
        stage: 'evaluation',
        status: 'passed',
        startingBalance: 50000,
        startedAt: firstPhase.startedAt.toISOString(),
        completedAt: firstPhase.completedAt?.toISOString(),
        rules: [
          {
            id: 'sample-apex-eval-target',
            enabled: true,
            kind: 'profit_target',
            amount: 3000,
            targetType: 'absolute',
          },
          trailingDrawdown('sample-apex-eval-drawdown'),
          dailyLoss('sample-apex-eval-daily'),
          {
            id: 'sample-apex-eval-size',
            enabled: true,
            kind: 'max_position_size',
            maxContracts: 6,
          },
        ],
      },
      {
        id: 'sample-apex-funded',
        name: 'Performance Account',
        stage: 'sim_funded',
        status: 'active',
        startingBalance: 50000,
        startedAt: fundedPhase.startedAt.toISOString(),
        rules: [
          trailingDrawdown('sample-apex-funded-drawdown'),
          dailyLoss('sample-apex-funded-daily'),
        ],
        payoutPolicy: {
          version: 1,
          source: 'manual',
          cycle: {
            kind: 'qualifying_days',
            days: 5,
            minimumDailyProfit: 250,
          },
          availability: {
            kind: 'profit_above_balance_floor',
            balanceFloor: 52100,
            requestPercent: 100,
          },
          minimumRequest: 500,
          maximumRequest: { kind: 'none' },
          profitSplit: { kind: 'fixed', percent: 100 },
          afterPayout: {
            balanceAction: 'deduct_request',
            drawdownAction: 'unchanged',
            resetCycle: true,
          },
        },
      },
    ],
  };
}


export function createFailedChallenge(
  combine: PhaseWindow,
  breachedAt: Date
): PropChallengeConfig {
  return {
    challengeName: '50K Trading Combine · DLL On',
    firmName: 'Topstep',
    status: 'failed',
    evaluationOutcome: 'failed',
    currentPhaseId: 'sample-topstep-combine',
    phases: [
      {
        id: 'sample-topstep-combine',
        name: 'Trading Combine',
        stage: 'evaluation',
        status: 'failed',
        startingBalance: 50000,
        startedAt: combine.startedAt.toISOString(),
        rules: [
          {
            id: 'sample-topstep-target',
            enabled: true,
            kind: 'profit_target',
            amount: 3000,
            targetType: 'absolute',
          },
          {
            id: 'sample-topstep-drawdown',
            enabled: true,
            kind: 'drawdown',
            mode: 'eod_trailing',
            amount: 2000,
            lockAtBalance: 50000,
          },
          {
            id: 'sample-topstep-days',
            enabled: true,
            kind: 'minimum_trading_days',
            days: 2,
          },
          {
            id: 'sample-topstep-consistency',
            enabled: true,
            kind: 'consistency',
            maxBestDayPercent: 55,
          },
          {
            id: 'sample-topstep-size',
            enabled: true,
            kind: 'max_position_size',
            maxContracts: 5,
          },
          {
            id: 'sample-topstep-daily',
            enabled: true,
            kind: 'daily_loss_limit',
            amount: 1000,
            breachAction: 'suspend_until_next_session',
          },
        ],
        
        
        
        
        completedAt: breachedAt.toISOString(),
        failure: {
          ruleId: 'sample-topstep-drawdown',
          ruleKind: 'drawdown',
          breachedAt: breachedAt.toISOString(),
        },
      },
    ],
  };
}
