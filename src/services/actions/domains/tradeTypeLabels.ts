import { t } from '../../../lang/helpers';
import type { TradeNoteType } from '../../trade/TradeNoteWriter';


export function tradeTypeLabel(type: TradeNoteType): string {
  switch (type) {
    case 'missed':
      return t('form.trade-type.missed');
    case 'backtest':
      return t('form.trade-type.backtest');
    case 'regular':
      return t('common.trade');
  }
}
