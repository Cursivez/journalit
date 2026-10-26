import { t } from '../../lang/helpers';
import type {
  TradeImportOtherAccountMatch,
  TradeImportPreviewClassification,
} from './types';


export function tradeImportClassificationLabel(
  classification: TradeImportPreviewClassification
): string {
  switch (classification) {
    case 'new':
      return t('trade-import.status.new');
    case 'exact_duplicate':
    case 'already_applied':
      return t('trade-import.status.already-imported');
    case 'exists_in_other_account':
      return t('trade-import.status.other-account');
    case 'update_existing':
    case 'partial_update_existing':
      return t('trade-import.status.updates-existing');
    case 'likely_duplicate':
      return t('trade-import.status.possible-duplicate');
    case 'conflict':
      return t('trade-import.status.needs-review');
    case 'duplicate_in_import':
      return t('trade-import.status.duplicate-in-file');
    case 'failed_invalid_trade':
      return t('trade-import.status.invalid');
    case 'failed_no_open_match':
      return t('trade-import.status.no-open-trade');
    case 'failed_multiple_open_matches':
      return t('trade-import.status.multiple-open-trades');
    case 'failed_quantity_mismatch':
      return t('trade-import.status.quantity-mismatch');
  }
}


export function tradeImportCommitFailureLabel(
  errorCode: string | undefined
): string | undefined {
  switch (errorCode) {
    case undefined:
      return undefined;
    case 'update_target_conflict':
      return t('trade-import.commit-failure.update-target-changed');
    case 'tradovate_overlap_conflict':
      return t('trade-import.commit-failure.tradovate-overlap');
    case 'failed_invalid_trade':
    case 'failed_no_open_match':
    case 'failed_multiple_open_matches':
    case 'failed_quantity_mismatch':
      return tradeImportClassificationLabel(errorCode);
    default:
      return undefined;
  }
}


export function tradeImportClassificationDetail(item: {
  classification: TradeImportPreviewClassification;
  otherAccount?: TradeImportOtherAccountMatch;
  decisionReasons: ReadonlyArray<{ code: string }>;
}): string | undefined {
  if (item.classification === 'exists_in_other_account') {
    return item.otherAccount
      ? t('trade-import.status.other-account.detail', {
          account: item.otherAccount.accountDisplayName,
        })
      : undefined;
  }
  
  
  if (
    item.classification === 'conflict' &&
    item.decisionReasons.some(
      (reason) => reason.code === 'execution_ids_split_across_trades'
    )
  ) {
    return t('trade-import.status.split-across-trades.detail');
  }
  return undefined;
}
