

export const ONBOARDING_VERSION = 2;

export type OnboardingStatus =
  | 'not-started'
  | 'in-progress'
  | 'completed'
  | 'skipped';


export type OnboardingStepId =
  | 'welcome'
  | 'obsidian-familiarity'
  | 'orientation'
  | 'data-source'
  | 'broker'
  | 'personalise'
  | 'first-trade'
  | 'preparing-sample'
  | 'sample-exploring'
  | 'awaiting-completion';

export type OnboardingObsidianFamiliarity = 'new' | 'experienced';

export type OnboardingDataSource = 'broker' | 'file' | 'fresh' | 'sample';

export type OnboardingTradingStyle =
  | 'scalping'
  | 'intraday'
  | 'swing'
  | 'position';

export type OnboardingAccountKind = 'personal' | 'practice' | 'prop';

export type OnboardingAssetFocus =
  | 'stock'
  | 'futures'
  | 'forex'
  | 'crypto'
  | 'options'
  | 'mixed';


export interface OnboardingAnswers {
  obsidianFamiliarity?: OnboardingObsidianFamiliarity;
  dataSource?: OnboardingDataSource;
  
  brokerId?: string;
  tradingStyle?: OnboardingTradingStyle;
  accountKind?: OnboardingAccountKind;
  assetFocus?: OnboardingAssetFocus;
}


export type OnboardingPendingCompletion =
  | 'first-sync'
  | 'first-import'
  | 'first-trade'
  | 'sample-journal';


export type OnboardingCompletionReason = Exclude<
  OnboardingPendingCompletion,
  'sample-journal'
>;


export interface OnboardingPersonalisationRecord {
  baseline: Record<string, unknown>;
  applied: Record<string, unknown>;
}

export interface OnboardingData {
  version: typeof ONBOARDING_VERSION;
  status: OnboardingStatus;
  step: OnboardingStepId;
  answers: OnboardingAnswers;
  
  pendingCompletion: OnboardingPendingCompletion | null;
  
  sampleExplored: boolean;
  personalisation?: OnboardingPersonalisationRecord;
  startedAt?: number;
  completedAt?: number;
  completedVia?: OnboardingCompletionReason;
  skippedAt?: number;
}

const ONBOARDING_STEP_IDS: ReadonlySet<string> = new Set<OnboardingStepId>([
  'welcome',
  'obsidian-familiarity',
  'orientation',
  'data-source',
  'broker',
  'personalise',
  'first-trade',
  'preparing-sample',
  'sample-exploring',
  'awaiting-completion',
]);

const PENDING_COMPLETIONS: ReadonlySet<string> =
  new Set<OnboardingPendingCompletion>([
    'first-sync',
    'first-import',
    'first-trade',
    'sample-journal',
  ]);

const STATUSES: ReadonlySet<string> = new Set<OnboardingStatus>([
  'not-started',
  'in-progress',
  'completed',
  'skipped',
]);

export function isOnboardingStepId(value: unknown): value is OnboardingStepId {
  return typeof value === 'string' && ONBOARDING_STEP_IDS.has(value);
}

export function isOnboardingPendingCompletion(
  value: unknown
): value is OnboardingPendingCompletion {
  return typeof value === 'string' && PENDING_COMPLETIONS.has(value);
}

export function isOnboardingCompletionReason(
  value: unknown
): value is OnboardingCompletionReason {
  return isOnboardingPendingCompletion(value) && value !== 'sample-journal';
}

export function isOnboardingStatus(value: unknown): value is OnboardingStatus {
  return typeof value === 'string' && STATUSES.has(value);
}

export function createDefaultOnboardingData(): OnboardingData {
  return {
    version: ONBOARDING_VERSION,
    status: 'not-started',
    step: 'welcome',
    answers: {},
    pendingCompletion: null,
    sampleExplored: false,
  };
}
