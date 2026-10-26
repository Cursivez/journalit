


interface AutoCommissionData {
  instrument?: string;
  assetType?: string;
  account?: string | string[];
  positionSize?: number;
  exits?: readonly { price?: number | null; size?: number | null }[];
  exitPrice?: number | null;
  hasExplicitExitPrice?: boolean;
  useDirectPnLInput?: boolean;
  tradeStatus?: string;
  commission?: number;
  commissionType?: 'fixed' | 'percentage';
  hasExplicitCommission?: boolean;
  isMissedTrade?: boolean;
  isBacktestTrade?: boolean;
}


export type InstrumentCommissionCalculator = (input: {
  instrument: string;
  assetType?: string;
  account?: string | string[];
  positionSize: number;
  exitedPositionSize?: number;
  hasExit?: boolean;
}) => number | undefined;

const hasTradeLegValues = (leg: {
  price?: number | null;
  size?: number | null;
}): boolean =>
  (leg.price !== undefined && leg.price !== null && leg.price !== 0) ||
  (leg.size !== undefined && leg.size !== null && leg.size !== 0);

const hasExitData = (data: AutoCommissionData): boolean => {
  const meaningfulExits = (data.exits ?? []).filter(hasTradeLegValues);
  const hasScalarExitPrice =
    data.exitPrice !== undefined &&
    data.exitPrice !== null &&
    (data.exitPrice > 0 ||
      (data.hasExplicitExitPrice === true && meaningfulExits.length === 0));
  const hasClosedDirectPnL =
    data.useDirectPnLInput === true &&
    data.tradeStatus !== 'OPEN' &&
    data.tradeStatus !== 'PARTIALLY_CLOSED' &&
    data.tradeStatus !== 'CANCELLED';

  return (
    hasClosedDirectPnL ||
    (data.tradeStatus === 'CLOSED' && hasScalarExitPrice) ||
    meaningfulExits.length > 0
  );
};

const getExitedPositionSize = (
  data: AutoCommissionData
): number | undefined => {
  const exitedSize = (data.exits ?? []).reduce(
    (total, exit) =>
      exit.size !== undefined && exit.size !== null && exit.size > 0
        ? total + exit.size
        : total,
    0
  );
  return exitedSize > 0 ? exitedSize : undefined;
};

export function applyAutoCommission<T extends AutoCommissionData>(
  data: T,
  calculateCommission?: InstrumentCommissionCalculator,
  previousData?: AutoCommissionData
): T {
  if (data.hasExplicitCommission === true) {
    return data;
  }

  const instrument = typeof data.instrument === 'string' ? data.instrument : '';
  const positionSize =
    typeof data.positionSize === 'number' ? data.positionSize : 0;
  if (
    data.commissionType === 'percentage' &&
    (typeof data.commission !== 'number' || data.commission === 0)
  ) {
    return data;
  }

  if (
    (data.isMissedTrade === true || data.isBacktestTrade === true) &&
    data.hasExplicitCommission !== false &&
    typeof data.commission === 'number' &&
    data.commission !== 0
  ) {
    return data;
  }

  const canInferPreviousAutoCommission = Boolean(
    previousData &&
    (previousData.isMissedTrade !== true ||
      previousData.hasExplicitCommission === false) &&
    (previousData.isBacktestTrade !== true ||
      previousData.hasExplicitCommission === false)
  );
  const previousAutoCommission =
    previousData && canInferPreviousAutoCommission
      ? calculateCommission?.({
          instrument:
            typeof previousData.instrument === 'string'
              ? previousData.instrument
              : '',
          assetType: previousData.assetType,
          account: previousData.account,
          positionSize:
            typeof previousData.positionSize === 'number'
              ? previousData.positionSize
              : 0,
          exitedPositionSize: getExitedPositionSize(previousData),
          hasExit: hasExitData(previousData),
        })
      : undefined;
  const hadAutoCommission =
    previousAutoCommission !== undefined &&
    typeof data.commission === 'number' &&
    Math.abs(data.commission - previousAutoCommission) < 0.000001;

  if (data.commissionType === 'percentage') {
    const changedFromFixedAutoCommission =
      previousData?.commissionType !== 'percentage' && hadAutoCommission;
    return changedFromFixedAutoCommission
      ? { ...data, commission: undefined, hasExplicitCommission: false }
      : data;
  }

  if (!instrument || positionSize <= 0) {
    return hadAutoCommission
      ? { ...data, commission: undefined, hasExplicitCommission: false }
      : data;
  }

  const hasExit = hasExitData(data);
  const commission = calculateCommission?.({
    instrument,
    assetType: data.assetType,
    account: data.account,
    positionSize,
    exitedPositionSize: getExitedPositionSize(data),
    hasExit,
  });

  if (hadAutoCommission) {
    return commission === undefined
      ? { ...data, commission: undefined, hasExplicitCommission: false }
      : {
          ...data,
          commission,
          commissionType: 'fixed',
          hasExplicitCommission: false,
        };
  }

  if (data.commission && data.commission !== 0) {
    if (commission === undefined) {
      return data;
    }

    if (hasExit === false) {
      return data;
    }

    const entryOnlyCommission = calculateCommission?.({
      instrument,
      assetType: data.assetType,
      account: data.account,
      positionSize,
      exitedPositionSize: getExitedPositionSize(data),
      hasExit: false,
    });

    if (entryOnlyCommission === undefined) {
      return data;
    }

    const isStoredEntryOnlyCommission =
      Math.abs(data.commission - entryOnlyCommission) < 0.000001;
    if (!isStoredEntryOnlyCommission) {
      return data;
    }
  }

  if (commission === undefined) {
    return data;
  }

  return {
    ...data,
    commission,
    commissionType: 'fixed',
    hasExplicitCommission: false,
  };
}
