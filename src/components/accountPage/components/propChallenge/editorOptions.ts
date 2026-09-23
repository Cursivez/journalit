import type { PropChallengeRuleKind } from '../../../../services/propChallenge/PropChallengeConfig';

export const RULE_KINDS: PropChallengeRuleKind[] = [
  'profit_target',
  'drawdown',
  'daily_loss_limit',
  'daily_profit_cap',
  'live_review_daily_profit',
  'minimum_trading_days',
  'minimum_profitable_days',
  'consistency',
  'max_position_size',
];

export const numberValue = (value: string): number =>
  value === '' ? 0 : Number(value) || 0;

export function parseRuleKind(value: string): PropChallengeRuleKind {
  return RULE_KINDS.find((kind) => kind === value) ?? 'profit_target';
}
