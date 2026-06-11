import {
  getTradeDirectionDisplayKind,
  TradeDirectionInput,
} from '../services/trade/core/TradeDirection';
import { t } from '../lang/helpers';

export function getTradeDirectionDisplayLabel(
  input: TradeDirectionInput,
  fallback = '-'
): string {
  const directionKind = getTradeDirectionDisplayKind(input);

  if (directionKind === 'call') return t('form.field.option-type.call');
  if (directionKind === 'put') return t('form.field.option-type.put');
  if (directionKind === 'long') return t('form.field.direction.long');
  if (directionKind === 'short') return t('form.field.direction.short');

  return fallback;
}
