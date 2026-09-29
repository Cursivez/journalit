

import type {
  PropChallengePhaseEvaluation,
  PropChallengeRuleEvaluation,
} from './PropChallengeRuleEngine';

type DrawdownRuleEvaluation = Extract<
  PropChallengeRuleEvaluation,
  { kind: 'drawdown' }
>;

export interface ChallengeRuleProgress {
  
  drawdown?: { percent: number; remaining: number };
  
  profitTarget?: { percent: number; remaining: number };
}

const clampPercent = (value: number): number =>
  Math.min(100, Math.max(0, value));


function drawdownUsed(rule: DrawdownRuleEvaluation): number {
  return rule.breached ? rule.maximumUsed : rule.currentUsed;
}

export function summarizeChallengeRuleProgress(
  evaluation: PropChallengePhaseEvaluation
): ChallengeRuleProgress {
  const progress: ChallengeRuleProgress = {};
  for (const rule of evaluation.rules) {
    if (rule.kind === 'drawdown' && rule.limit > 0 && !progress.drawdown) {
      const used = drawdownUsed(rule);
      progress.drawdown = {
        percent: clampPercent((used / rule.limit) * 100),
        remaining: Math.max(0, rule.limit - used),
      };
    } else if (
      rule.kind === 'profit_target' &&
      rule.target > 0 &&
      !progress.profitTarget
    ) {
      progress.profitTarget = {
        percent: clampPercent(rule.progress * 100),
        remaining: Math.max(0, rule.remaining),
      };
    }
  }
  return progress;
}
