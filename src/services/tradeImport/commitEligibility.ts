import type { ClassifiedPreviewTrade, TradeImportDefaultAction } from './types';

export function isTradeImportCommitEligible(
  action: TradeImportDefaultAction
): boolean {
  return action === 'create' || action === 'update';
}

function isTradeImportSkipped(action: TradeImportDefaultAction): boolean {
  return action === 'skip';
}

function isTradeImportBlocked(action: TradeImportDefaultAction): boolean {
  return action === 'blocked' || action === 'manual_review';
}

type ClassifiedItem = Pick<
  ClassifiedPreviewTrade,
  'classification' | 'defaultAction'
>;


export function canImportTradeAnyway(item: ClassifiedItem): boolean {
  return (
    item.classification === 'likely_duplicate' &&
    item.defaultAction === 'manual_review'
  );
}


export function isTradeImportDuplicate(item: ClassifiedItem): boolean {
  return isTradeImportSkipped(item.defaultAction) || canImportTradeAnyway(item);
}


export function needsTradeImportAttention(item: ClassifiedItem): boolean {
  return (
    isTradeImportBlocked(item.defaultAction) && !isTradeImportDuplicate(item)
  );
}
