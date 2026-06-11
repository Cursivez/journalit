type TradePositionSide = 'long' | 'short';
type TradeDirectionDisplayKind = 'long' | 'short' | 'call' | 'put' | 'unknown';

export interface TradeDirectionInput {
  direction?: unknown;
  assetType?: unknown;
  optionType?: unknown;
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function normalizeTradeDirectionSide(
  input: TradeDirectionInput
): TradePositionSide | null {
  const direction = normalizeText(input.direction);

  if (direction === 'short' || direction === 'sell') {
    return 'short';
  }

  if (
    direction === 'long' ||
    direction === 'buy' ||
    direction === 'call' ||
    direction === 'put'
  ) {
    return 'long';
  }

  const optionType = normalizeText(input.optionType);
  if (optionType === 'call' || optionType === 'put') {
    return 'long';
  }

  const assetType = normalizeText(input.assetType);
  if (assetType === 'options') {
    return 'long';
  }

  return null;
}

export function getTradeDirectionDisplayKind(
  input: TradeDirectionInput
): TradeDirectionDisplayKind {
  const optionType = normalizeText(input.optionType);
  if (optionType === 'call' || optionType === 'put') {
    return optionType;
  }

  const direction = normalizeText(input.direction);
  if (direction === 'call' || direction === 'put') {
    return direction;
  }

  return normalizeTradeDirectionSide(input) ?? 'unknown';
}

export function calculateTradeDirectionPriceDiff(
  input: TradeDirectionInput,
  entryPrice: number | null,
  exitPrice: number | null
): number | null {
  if (
    entryPrice === null ||
    exitPrice === null ||
    entryPrice <= 0 ||
    exitPrice < 0
  ) {
    return null;
  }

  const side = normalizeTradeDirectionSide(input);
  if (side === null) {
    return null;
  }

  return side === 'short' ? entryPrice - exitPrice : exitPrice - entryPrice;
}
