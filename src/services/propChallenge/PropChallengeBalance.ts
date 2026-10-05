import type { AccountMetadata } from '../../settings/types';
import { safeParseDateValue } from '../../utils/dateUtils';
import {
  hasLiveBalanceAdjustment,
  normalizeLiveBalanceAdjustment,
} from '../account/liveBalanceAdjustment';
import type { AccountData } from '../account/types';
import type { AccountTradeData } from '../accountPage/types';
import type { PropChallengeConfig, PropChallengePhase } from './types';
import { getCurrentPropChallengePhase } from './PropChallengeConfig';
import {
  calibratePropChallengeBalance,
  evaluatePropChallengePhase,
  InactivePropChallengeBalanceError,
} from './PropChallengeRuleEngine';

export function getAccountLiveBalanceInput(
  account: AccountData,
  trades: readonly AccountTradeData[],
  cutoff?: string
): string {
  if (!account.propChallenge)
    return hasLiveBalanceAdjustment(account.liveBalanceAdjustment)
      ? String(account.currentBalance)
      : '';
  const phase = getCurrentPropChallengePhase(account.propChallenge);
  return phase?.balanceAdjustments?.length
    ? String(
        evaluatePropChallengePhase({
          phase,
          config: account.propChallenge,
          trades,
          transactions: account.transactions,
          tradingDayCutoffTime: cutoff,
        }).currentBalance
      )
    : '';
}

export function applyLiveBalanceToCurrentPhase(
  config: PropChallengeConfig,
  input: Omit<
    Parameters<typeof evaluatePropChallengePhase>[0],
    'phase' | 'config'
  >,
  liveBalance: number | null
) {
  const phase = getCurrentPropChallengePhase(config);
  if (!phase) throw new InactivePropChallengeBalanceError();
  const scoped = { ...input, config, phase };
  const calibrated = calibratePropChallengeBalance(scoped, liveBalance);
  return {
    config: {
      ...config,
      phases: config.phases.map((candidate) =>
        candidate.id === calibrated.id ? calibrated : candidate
      ),
    },
    introducesFailure: Boolean(
      evaluatePropChallengePhase({ ...scoped, phase: calibrated }).failure &&
      !evaluatePropChallengePhase(scoped).failure
    ),
  };
}


export function getAccountBalanceAdjustment(
  metadata:
    | Pick<AccountMetadata, 'propChallenge' | 'liveBalanceAdjustment'>
    | undefined
): number | undefined {
  return metadata?.propChallenge
    ? normalizeLiveBalanceAdjustment(
        metadata.propChallenge.phases.reduce(
          (total, phase) =>
            total +
            (phase.balanceAdjustments ?? []).reduce(
              (sum, adjustment) => sum + adjustment.amount,
              0
            ),
          0
        )
      )
    : metadata?.liveBalanceAdjustment;
}


export function liveBalanceAdjustmentAnchor(
  lastUpdated: AccountMetadata['lastUpdated'],
  phase: PropChallengePhase,
  fallbackTime: Date
): string {
  const savedAt = safeParseDateValue(lastUpdated);
  if (!savedAt)
    console.warn(
      'Prop balance reconciliation: invalid lastUpdated; using the supplied operation time'
    );
  const timestamp = Math.min(
    phase.completedAt ? Date.parse(phase.completedAt) : Infinity,
    Math.max(
      phase.startedAt ? Date.parse(phase.startedAt) : -Infinity,
      (savedAt ?? fallbackTime).getTime()
    )
  );
  return new Date(timestamp).toISOString();
}


export function migratePropChallengeLiveBalances(
  accounts: Record<string, AccountMetadata>
): boolean {
  let changed = false;
  for (const metadata of Object.values(accounts)) {
    const config = metadata.propChallenge;
    const first = config?.phases[0];
    if (!config || !first || metadata.liveBalanceAdjustment === undefined)
      continue;
    const amount = normalizeLiveBalanceAdjustment(
      metadata.liveBalanceAdjustment
    );
    if (
      amount !== undefined &&
      (first.balanceAdjustments?.length ||
        config.phases
          .slice(1)
          .some(
            (phase) =>
              phase.startedAt !== undefined || phase.status !== 'pending'
          ))
    )
      continue;
    if (amount !== undefined) {
      
      
      const recordedAt = liveBalanceAdjustmentAnchor(
        metadata.lastUpdated,
        first,
        new Date()
      );
      first.balanceAdjustments = [
        ...(first.balanceAdjustments ?? []),
        { amount, recordedAt },
      ];
    }
    delete metadata.liveBalanceAdjustment;
    changed = true;
  }
  return changed;
}
