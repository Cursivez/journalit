import type { TradeImportDefaultAction } from './types';

export function isTradeImportCommitEligible(
  action: TradeImportDefaultAction
): boolean {
  return action === 'create' || action === 'update';
}

export function isTradeImportSkipped(
  action: TradeImportDefaultAction
): boolean {
  return action === 'skip';
}

export function isTradeImportBlocked(
  action: TradeImportDefaultAction
): boolean {
  return action === 'blocked' || action === 'manual_review';
}
