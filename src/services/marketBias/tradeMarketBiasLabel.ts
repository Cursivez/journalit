import { t } from '../../lang/helpers';
import type { MarketBiasDirection } from '../reviews/marketBias';
import type { TradeBiasAlignment, TradeMarketBias } from './tradeMarketBias';

function marketBiasDirectionLabel(bias: MarketBiasDirection): string {
  switch (bias) {
    case 'long':
      return t('widget.market-bias.long');
    case 'neutral':
      return t('widget.market-bias.neutral');
    case 'short':
      return t('widget.market-bias.short');
  }
}


export function tradeBiasAlignmentLabel(alignment: TradeBiasAlignment): string {
  switch (alignment) {
    case 'with':
      return t('tradelog.bias.filter.with');
    case 'against':
      return t('tradelog.bias.filter.against');
    case 'neutral':
      return t('tradelog.bias.filter.neutral');
    case 'none':
      return t('tradelog.bias.filter.none');
  }
}


export function tradeMarketBiasCellLabel(bias: TradeMarketBias): string | null {
  switch (bias.alignment) {
    case 'none':
      return null;
    case 'neutral':
      return marketBiasDirectionLabel('neutral');
    case 'with':
      return t('tradelog.bias.cell.with');
    case 'against':
      return t('tradelog.bias.cell.against');
  }
}


export function tradeMarketBiasHoverLines(bias: TradeMarketBias): string[] {
  if (bias.bias === null) return [];
  const direction = marketBiasDirectionLabel(bias.bias);
  let first: string;
  switch (bias.alignment) {
    case 'with':
      first = bias.fromWeek
        ? t('tradelog.bias.tooltip.with-weekly', { bias: direction })
        : t('tradelog.bias.tooltip.with-daily', { bias: direction });
      break;
    case 'against':
      first = bias.fromWeek
        ? t('tradelog.bias.tooltip.against-weekly', { bias: direction })
        : t('tradelog.bias.tooltip.against-daily', { bias: direction });
      break;
    default:
      first = bias.fromWeek
        ? t('tradelog.bias.tooltip.weekly', { bias: direction })
        : t('tradelog.bias.tooltip.daily', { bias: direction });
  }
  const { daily, weekly } = bias;
  return daily && weekly && daily !== weekly
    ? [
        first,
        t('tradelog.bias.tooltip.weekly', {
          bias: marketBiasDirectionLabel(weekly),
        }),
      ]
    : [first];
}


export function tradeMarketBiasLabel(bias: TradeMarketBias): string | null {
  switch (bias.alignment) {
    case 'none':
      return null;
    case 'neutral':
      return bias.fromWeek
        ? t('tradelog.bias.neutral-week')
        : t('tradelog.bias.neutral-day');
    case 'with':
    case 'against': {
      const direction = marketBiasDirectionLabel(bias.bias ?? 'neutral');
      const label =
        bias.alignment === 'with'
          ? t('tradelog.bias.with', { bias: direction })
          : t('tradelog.bias.against', { bias: direction });
      return bias.fromWeek ? t('tradelog.bias.from-week', { label }) : label;
    }
  }
}
