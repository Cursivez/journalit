import type { CustomOptionsService } from '../options/CustomOptionsService';
import type { TradeData } from '../trade/TradeService';


export function applyInstrumentCostRulesToProjection(
  tradeData: TradeData,
  optionsService: Pick<CustomOptionsService, 'calculateInstrumentCommission'>
): TradeData {
  if (tradeData.commission !== undefined && tradeData.commission !== 0) {
    return tradeData;
  }
  if (
    !tradeData.instrument ||
    tradeData.tradeStatus === 'CANCELLED' ||
    tradeData.positionSize <= 0
  ) {
    return tradeData;
  }

  const exitedFromRows = (tradeData.exits ?? []).reduce(
    (total, exit) => (exit.size > 0 ? total + exit.size : total),
    0
  );
  const exitedPositionSize =
    exitedFromRows > 0
      ? exitedFromRows
      : typeof tradeData.closedQuantity === 'number' &&
          tradeData.closedQuantity > 0
        ? tradeData.closedQuantity
        : undefined;
  const hasExit =
    tradeData.tradeStatus === 'CLOSED' ||
    tradeData.tradeStatus === 'PARTIALLY_CLOSED' ||
    exitedPositionSize !== undefined;

  const commission = optionsService.calculateInstrumentCommission({
    instrument: tradeData.instrument,
    assetType: tradeData.assetType,
    account: tradeData.account,
    positionSize: tradeData.positionSize,
    exitedPositionSize,
    hasExit,
  });
  if (commission === undefined) return tradeData;

  const adjusted: TradeData = {
    ...tradeData,
    commission,
    hasExplicitCommission: false,
  };
  if (
    typeof tradeData.authoritativePnl === 'number' &&
    Number.isFinite(tradeData.authoritativePnl)
  ) {
    adjusted.authoritativePnl = tradeData.authoritativePnl - commission;
  }
  return adjusted;
}
