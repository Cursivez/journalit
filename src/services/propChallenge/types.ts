interface PropChallengeRuleBase {
  id: string;
  enabled: boolean;
}

export type PropChallengeRule =
  | (PropChallengeRuleBase & {
      kind: 'profit_target';
      amount: number;
      targetType: 'absolute' | 'percentage';
      
      creditWithdrawals?: boolean;
    })
  | (PropChallengeRuleBase & {
      kind: 'drawdown';
      mode: 'static' | 'eod_trailing' | 'intraday_trailing';
      amount: number;
      lockAtBalance?: number;
    })
  | (PropChallengeRuleBase & {
      kind: 'daily_loss_limit';
      amount: number;
      
      breachAction?: 'fail' | 'suspend_until_next_session';
      
      profitThresholdPercent?: number;
      amountAfterThreshold?: number;
      
      scaleAtBalance?: number;
      scaledAmountPercentOfPeakEodProfit?: number;
      
      lossTiers?: Array<{ profit: number; amount: number }>;
      profitBasis?: 'cumulative_trade_profit' | 'current_account_profit';
    })
  | (PropChallengeRuleBase & {
      
      kind: 'daily_profit_cap';
      amount: number;
    })
  | (PropChallengeRuleBase & {
      
      kind: 'live_review_daily_profit';
      amount: number;
    })
  | (PropChallengeRuleBase & {
      kind: 'minimum_trading_days';
      days: number;
    })
  | (PropChallengeRuleBase & {
      kind: 'minimum_profitable_days';
      days: number;
      minimumDailyProfit: number;
    })
  | (PropChallengeRuleBase & {
      kind: 'consistency';
      maxBestDayPercent: number;
      
      consistencyCushionPercent?: number;
    })
  | (PropChallengeRuleBase &
      PositionSizeCounting &
      (
        | {
            kind: 'max_position_size';
            maxContracts: number;
          }
        | {
            kind: 'max_position_size';
            initialContracts: number;
            profitPerAdditionalContract: number;
            maximumContracts?: number;
            profitBasis?: 'cumulative_trade_profit' | 'current_account_profit';
          }
        | {
            kind: 'max_position_size';
            initialContracts: number;
            profitTiers: Array<{
              profit: number;
              maxContracts: number;
            }>;
            profitBasis?: 'cumulative_trade_profit' | 'current_account_profit';
          }
      ));

interface PositionSizeCounting {
  
  microsPerContract?: 10;
}

export type PropChallengeStage = 'evaluation' | 'sim_funded' | 'live_funded';

export type PropChallengePayoutCycle =
  | { kind: 'none' }
  | { kind: 'trading_days'; days: number }
  | {
      kind: 'qualifying_days';
      days: number;
      minimumDailyProfit: number;
    }
  | {
      kind: 'calendar_days';
      days: number;
      anchor: 'phase_start' | 'first_trade';
    };

export type PropChallengePayoutAvailability =
  | {
      kind: 'profit_above_starting_balance';
      requestPercent: number;
    }
  | {
      kind: 'profit_above_balance_floor';
      balanceFloor: number;
      requestPercent: number;
    };

export type PropChallengePayoutMaximum =
  | { kind: 'none' }
  | { kind: 'fixed'; amount: number }
  | { kind: 'first_fixed_then_none'; amount: number }
  | { kind: 'cycle_profit_percent'; percent: number }
  | { kind: 'schedule'; amounts: number[]; repeatLast?: boolean };

export interface PropChallengePayoutLifetimeQualifyingDaysUnlock {
  days: number;
  availability: PropChallengePayoutAvailability;
  maximumRequest: PropChallengePayoutMaximum;
}

export type PropChallengeProfitSplit =
  | { kind: 'fixed'; percent: number }
  | {
      kind: 'cumulative_payout_threshold';
      initialPercent: number;
      thresholdAmount: number;
      thereafterPercent: number;
    }
  | {
      kind: 'account_profit_threshold';
      belowPercent: number;
      thresholdProfit: number;
      atOrAbovePercent: number;
    };

export type PropChallengeWeekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface PropChallengePayoutRequestWindow {
  kind: 'weekdays';
  weekdays: PropChallengeWeekday[];
  timeZone: string;
}

export type PropChallengeMaximumPayoutOutcome =
  | 'conclude_account'
  | 'promote_to_next_phase'
  | 'eligible_for_live_review';

export type PropChallengePayoutAftermath =
  | {
      balanceAction: 'deduct_request';
      drawdownAction: 'unchanged';
      resetCycle: boolean;
      maximumPayoutOutcome?: PropChallengeMaximumPayoutOutcome;
    }
  | {
      balanceAction: 'deduct_request';
      drawdownAction: 'lock_at_balance';
      drawdownFloor: number;
      resetCycle: boolean;
      maximumPayoutOutcome?: PropChallengeMaximumPayoutOutcome;
    }
  | {
      balanceAction: 'reset_to_starting_balance';
      drawdownAction: 'reset_from_starting_balance';
      resetCycle: boolean;
      maximumPayoutOutcome?: PropChallengeMaximumPayoutOutcome;
    };

export interface PropChallengePayoutPolicy {
  version: number;
  source: string;
  cycle: PropChallengePayoutCycle;
  minimumElapsedHours?: number;
  minimumBalance?: number;
  minimumCycleProfit?: number;
  minimumCycleProfitSchedule?: {
    amounts: number[];
    repeatLast?: boolean;
  };
  requirePositiveCycleProfitAfterFirst?: boolean;
  newProfitPercentOfRequest?: number;
  firstPayoutCycleProfitExempt?: boolean;
  maxBestDayPercent?: number;
  maxBestDayPercentSchedule?: {
    percents: number[];
    repeatLast?: boolean;
  };
  availability: PropChallengePayoutAvailability;
  minimumRequest: number;
  maximumRequest: PropChallengePayoutMaximum;
  lifetimeQualifyingDaysUnlock?: PropChallengePayoutLifetimeQualifyingDaysUnlock;
  profitSplit: PropChallengeProfitSplit;
  requestWindow?: PropChallengePayoutRequestWindow;
  maximumPayouts?: number;
  afterPayout: PropChallengePayoutAftermath;
}

export interface PropChallengePhase {
  profileApplication?: PropChallengePolicyRevision['application'];
  id: string;
  name: string;
  stage?: PropChallengeStage;
  status: 'pending' | 'active' | 'passed' | 'failed';
  startingBalance: number;
  
  brokerAccountIds?: string[];
  
  legacyAccountName?: string;
  rules: PropChallengeRule[];
  startedAt?: string;
  completedAt?: string;
  failure?: PropChallengeFailure;
  
  waivedFailures?: PropChallengeWaivedFailure[];
  payoutPolicy?: PropChallengePayoutPolicy;
  
  policyHistory?: PropChallengePolicyRevision[];
  
  profileSnapshot?: PropFirmProfilePhase;
  profilePhaseIndex?: number;
}

export interface PropChallengePolicyRevision {
  application?: {
    basis: 'published' | 'confirmed';
    reference: string;
    announcementId?: string;
  };
  effectiveAt: string;
  rules: PropChallengeRule[];
  payoutPolicy?: PropChallengePayoutPolicy;
  transition?:
    | { basis: 'preserve' }
    | {
        basis: 'custom';
        
        source: string;
        drawdowns: Array<{
          ruleId: string;
          floor: number;
          peakBalance: number;
          locked: boolean;
        }>;
        
        payoutCycleStartedAt: string;
      };
}

export interface PropChallengeFailure {
  ruleId: string;
  ruleKind: Extract<
    PropChallengeRule['kind'],
    'drawdown' | 'daily_loss_limit' | 'max_position_size'
  >;
  breachedAt: string;
}

type PropChallengeWaivedFailure = Pick<
  PropChallengeFailure,
  'ruleId' | 'breachedAt'
>;

export interface PropChallengeCost {
  id: string;
  date: string;
  amount: number;
  kind: 'purchase' | 'reset' | 'activation' | 'other';
  note?: string;
}

export interface PropChallengePayoutPlan {
  
  notifyMinimumAmount?: number;
  
  withdrawal?:
    | { kind: 'percent'; value: number }
    | { kind: 'amount'; value: number };
}

export type PropChallengeNoticeKind =
  | 'phase_failed'
  | 'unknown_account'
  | 'target_reached'
  | 'evaluation_passed'
  | 'payout_available'
  | 'payout_lost';

export interface PropChallengeActiveNotice {
  fingerprint: string;
  kind: PropChallengeNoticeKind;
  phaseId: string;
  detectedAt: string;
  
  amount?: number;
  
  identity?: string;
  
  identityLabel?: string;
}


export interface PropChallengeNoticeState {
  dismissed?: Record<string, string>;
  payoutObserved?: {
    phaseId: string;
    payoutCount: number;
    status: 'eligible' | 'not_eligible';
    at: string;
  };
  payoutLost?: {
    phaseId: string;
    payoutCount: number;
    at: string;
    requirements: string[];
  };
  active?: PropChallengeActiveNotice[];
}

export interface PropChallengeConfig {
  correctionHistory?: PropChallengeCorrectionAudit[];
  payoutPlan?: PropChallengePayoutPlan;
  notices?: PropChallengeNoticeState;
  
  purchaseDate?: string;
  challengeName: string;
  firmName?: string;
  status: 'active' | 'passed' | 'failed';
  evaluationOutcome?: 'passed' | 'failed';
  profileRef?: PropChallengeProfileRef;
  
  profileUpdateDismissals?: Record<string, string>;
  currentPhaseId?: string;
  phases: PropChallengePhase[];
  oneTimeCosts?: PropChallengeCost[];
}

export interface PropChallengeProfileRef {
  firmId: string;
  challengeId: string;
  catalogVersion: number;
  verifiedAt: string;
  source?: 'catalog' | 'personal';
}

export type PropFirmProfileRule = PropChallengeRule extends infer Rule
  ? Rule extends PropChallengeRule
    ? Omit<Rule, 'id' | 'enabled'>
    : never
  : never;

export interface PropFirmProfilePhase {
  catalogCorrections?: PropFirmCatalogCorrection[];
  purchaseEligibility?: {
    afterDate: string;
    sourceUrl: string;
    verifiedAt: string;
  };
  policyChanges?: PropFirmPolicyChange[];
  name: string;
  stage: PropChallengeStage;
  startingBalance: number;
  rules: PropFirmProfileRule[];
  payoutPolicy?: PropChallengePayoutPolicy;
}

export interface PropFirmCatalogCorrection {
  id: string;
  reason: string;
  sourceUrl: string;
  verifiedAt: string;
  fromPolicyHashes: string[];
  
  affectedFrom?: string;
  affectedUntil?: string;
  replacement: {
    rules: PropFirmProfileRule[];
    payoutPolicy?: PropChallengePayoutPolicy;
  };
}

export interface PropChallengeCorrectionAudit {
  currencyCode: string;
  id: string;
  appliedAt: string;
  correction: PropFirmCatalogCorrection;
  source: PropChallengeProfileRef;
  before: PropChallengePhase;
  after: PropChallengePhase;
  beforeStatus: PropChallengeConfig['status'];
  afterStatus: PropChallengeConfig['status'];
  evaluationStatus: string;
}

export type PropFirmPolicyChange = {
  id: string;
  fromPolicyHashes: string[];
  toPolicyHash: string;
  sourceUrl: string;
  verifiedAt: string;
} & (
  | { kind: 'existing_accounts'; effectiveAt: string }
  | { kind: 'new_purchases'; purchaseAfterDate: string }
);

export interface PropFirmProfileChallenge {
  id: string;
  name: string;
  accountSize: number;
  currency: string;
  notes?: string;
  phases: PropFirmProfilePhase[];
}

export interface PropFirmProfileFirm {
  id: string;
  name: string;
  verifiedAt: string;
  sources: string[];
  challenges: PropFirmProfileChallenge[];
}

export interface PropFirmProfileCatalog {
  version: number;
  updatedAt: string;
  firms: PropFirmProfileFirm[];
}

export interface PropFirmProfileSelection {
  firmId: string;
  firmName: string;
  verifiedAt: string;
  catalogVersion: number;
  challenge: PropFirmProfileChallenge;
  source?: 'catalog' | 'personal';
}

export interface PropFirmProfileCatalogCache {
  catalog: PropFirmProfileCatalog;
  etag?: string;
  fetchedAt: string;
}


export interface PropFirmSummary {
  id: string;
  name: string;
  challenges: number;
}

export interface PropFirmIndex {
  version: number;
  firms: PropFirmSummary[];
}

export interface PropFirmIndexCache {
  index: PropFirmIndex;
  etag?: string;
  fetchedAt: string;
}
