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


export function tradeImportClassificationDetail(item: {
  classification: TradeImportPreviewClassification;
  otherAccount?: TradeImportOtherAccountMatch;
}): string | undefined {
  if (item.classification === 'exists_in_other_account') {
    return item.otherAccount
      ? t('trade-import.status.other-account.detail', {
          account: item.otherAccount.accountDisplayName,
        })
      : undefined;
  }
  return undefined;
}
