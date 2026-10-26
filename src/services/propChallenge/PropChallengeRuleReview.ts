import type { PropChallengeRule, PropFirmProfileRule } from './types';

type Rule = PropChallengeRule | PropFirmProfileRule;
type ReviewableRule = Extract<Rule, { kind: 'drawdown' | 'max_position_size' }>;

function isExcludedRule(rule: Rule): boolean {
  return (
    isDisputedRule(rule) ||
    (rule.kind === 'manual_review' && rule.amount === undefined)
  );
}


export function isExecutableRule<T extends Rule>(
  rule: T
): rule is Exclude<T, { kind: 'max_position_size' }> {
  return rule.kind !== 'max_position_size';
}


export function isEditableRule<T extends Rule>(
  rule: T
): rule is Exclude<T, { kind: 'max_position_size' }> {
  return isExecutableRule(rule) && !isExcludedRule(rule);
}


export function isAuthoritativeDrawdown<T extends Rule>(
  rule: T
): rule is Extract<T, { kind: 'drawdown' }> {
  return rule.kind === 'drawdown' && !isDisputedRule(rule);
}


export function isDisputedRule(
  rule: Rule
): rule is ReviewableRule & { reviewRequired: string } {
  return (
    (rule.kind === 'drawdown' || rule.kind === 'max_position_size') &&
    rule.reviewRequired !== undefined
  );
}
