

import { t } from '../lang/helpers';
import type {
  TopBreakdownConfig,
  TopBreakdownDimension,
} from '../settings/types';

export const DEFAULT_TOP_BREAKDOWN_CONFIG: TopBreakdownConfig = {
  dimension: 'setups',
  valueMode: 'currency',
  createdAt: '',
};

export const getTopBreakdownDimensionLabel = (
  dimension: TopBreakdownDimension
): string => {
  switch (dimension) {
    case 'setups':
      return t('tradelog.column.setups');
    case 'assetTypes':
      return t('form.field.asset-type');
    case 'tags':
      return t('tradelog.column.tags');
    case 'tickers':
      return t('tradelog.column.ticker');
    default:
      return t('tradelog.column.setups');
  }
};
