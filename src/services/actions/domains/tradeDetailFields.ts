import type {
  DividendTransaction,
  IdealExitTransaction,
} from '../../../components/forms/trade/types';
import { shouldShowTradeDividends } from '../../../components/forms/trade/types';
import { parseLocalDateSafe } from '../../../utils/dateUtils';
import {
  DEFAULT_OPTION_CONTRACT_SIZE,
  type InstrumentContractFields,
} from '../../trade/instrumentContractDefaults';
import type { TradeNoteType } from '../../trade/TradeNoteWriter';
import type { TradeData } from '../../trade/TradeService';
import { ActionPlanError } from '../ActionErrors';
import type { ActionInput } from '../ActionTypes';



type WireSet = NonNullable<ActionInput<'trade.update'>['set']>;
type WireOption = NonNullable<ActionInput<'trade.create'>['option']>;
type WireIdealExits = NonNullable<ActionInput<'trade.update'>['ideal_exits']>;
type WireDividends = NonNullable<ActionInput<'trade.update'>['dividends']>;


export type DetailFields = Pick<
  WireSet,
  | 'exchange'
  | SpecField
  | 'commission_type'
  | 'rebate'
  | 'currency'
  | 'fx_rate'
  | 'forex_conversion_rate'
  | 'mae'
  | 'mfe'
  | 'mae_price'
  | 'mfe_price'
  | 'unrealized_price_snapshot'
>;


const SPEC_FIELDS = {
  dollar_per_point: { key: 'dollarPerPoint', assetType: 'futures' },
  tick_size: { key: 'tickSize', assetType: 'futures' },
  tick_value: { key: 'tickValue', assetType: 'futures' },
  lot_size: { key: 'lotSize', assetType: 'forex' },
  pip_value: { key: 'pipValue', assetType: 'forex' },
  pip_size: { key: 'pipSize', assetType: 'forex' },
  contract_size: { key: 'contractSize', assetType: 'cfd' },
  leverage_ratio: { key: 'leverageRatio', assetType: 'cfd' },
} as const;

export type SpecField = keyof typeof SPEC_FIELDS;
type SpecKey = (typeof SPEC_FIELDS)[SpecField]['key'];
export const SPEC_FIELD_NAMES: readonly SpecField[] = [
  'dollar_per_point',
  'tick_size',
  'tick_value',
  'lot_size',
  'pip_value',
  'pip_size',
  'contract_size',
  'leverage_ratio',
];


const NUMBER_FIELDS = [
  ['rebate', 'rebate'],
  ['mae', 'mae'],
  ['mfe', 'mfe'],
  ['mae_price', 'maePrice'],
  ['mfe_price', 'mfePrice'],
] as const;


const ASSET_TYPE_FIELDS: Readonly<Record<string, readonly string[]>> = {
  stock: ['exchange', 'dividends'],
  crypto: ['cryptoExchange'],
  options: [
    'optionType',
    'strikePrice',
    'expirationDate',
    'contractSize',
    'rebate',
  ],
  futures: ['dollarPerPoint', 'tickSize', 'tickValue'],
  forex: ['lotSize', 'pipValue', 'pipSize'],
  cfd: ['contractSize', 'leverageRatio', 'dividends'],
};

const FOREX_CONVERSION_KEYS = [
  'forexQuoteCurrency',
  'forexPnlConversionRate',
  'forexPnlConversionBaseCurrency',
  'forexPnlConversionRateDate',
  'forexPnlConversionRateSource',
] as const;


export function clearTradeFields(next: TradeData, ...keys: string[]): void {
  for (const key of keys) delete next[key];
  next.clearUnsetFields = [
    ...new Set([...(next.clearUnsetFields ?? []), ...keys]),
  ];
}


export function exchangeKey(assetType: string | undefined): string {
  return assetType === 'crypto' ? 'cryptoExchange' : 'exchange';
}


function optionExpirationDate(value: string, field: string): Date {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? parseLocalDateSafe(value)
    : null;
  if (!date) throw new ActionPlanError('invalid_request', field);
  return date;
}


export function applyOption(
  next: TradeData,
  option: WireOption,
  field: string,
  currentContractSize?: number
): void {
  next.optionType = option.type;
  next.strikePrice = option.strike;
  next.expirationDate = optionExpirationDate(
    option.expiration,
    `${field}.expiration`
  );
  next.contractSize =
    option.contract_size ?? currentContractSize ?? DEFAULT_OPTION_CONTRACT_SIZE;
}


export function checkDetailFields(
  fields: DetailFields & Pick<WireSet, 'commission'>,
  prefix: string,
  assetType: string | undefined,
  tradeType: TradeNoteType
): void {
  for (const field of SPEC_FIELD_NAMES) {
    const value = fields[field];
    if (
      value !== undefined &&
      value !== null &&
      assetType !== SPEC_FIELDS[field].assetType
    ) {
      throw new ActionPlanError('invalid_request', `${prefix}${field}`);
    }
  }
  if (
    fields.exchange !== undefined &&
    fields.exchange !== null &&
    assetType !== 'stock' &&
    assetType !== 'crypto'
  ) {
    throw new ActionPlanError('invalid_request', `${prefix}exchange`);
  }
  if (
    fields.rebate !== undefined &&
    fields.rebate !== null &&
    assetType !== 'options'
  ) {
    throw new ActionPlanError('invalid_request', `${prefix}rebate`);
  }
  
  for (const field of [
    'pip_size',
    'forex_conversion_rate',
    'unrealized_price_snapshot',
  ] as const) {
    if (
      fields[field] !== undefined &&
      fields[field] !== null &&
      tradeType !== 'regular'
    ) {
      throw new ActionPlanError('unsupported_capability', `${prefix}${field}`);
    }
  }
  if (
    fields.forex_conversion_rate !== undefined &&
    fields.forex_conversion_rate !== null &&
    assetType !== 'forex'
  ) {
    throw new ActionPlanError(
      'invalid_request',
      `${prefix}forex_conversion_rate`
    );
  }
  if (
    fields.commission_type === 'percentage' &&
    typeof fields.commission === 'number' &&
    fields.commission > 100
  ) {
    throw new ActionPlanError('invalid_request', `${prefix}commission`);
  }
}


function contractDefault(
  defaults: InstrumentContractFields,
  key: SpecKey
): number | undefined {
  const values: Partial<Record<SpecKey, number>> = defaults;
  return values[key];
}


export function applyDetailFields(
  next: TradeData,
  fields: DetailFields,
  context: {
    readonly prefix: string;
    readonly defaults: InstrumentContractFields;
    readonly globalCurrency: string;
    readonly now: Date;
  }
): void {
  const { prefix } = context;
  if (fields.exchange !== undefined) {
    const key = exchangeKey(next.assetType);
    const exchange = fields.exchange?.trim() ?? null;
    if (exchange === '') {
      throw new ActionPlanError('invalid_request', `${prefix}exchange`);
    }
    if (exchange === null) clearTradeFields(next, key);
    else next[key] = exchange;
  }
  for (const field of SPEC_FIELD_NAMES) {
    const value = fields[field];
    if (value === undefined) continue;
    const { key } = SPEC_FIELDS[field];
    const restored =
      value === null ? contractDefault(context.defaults, key) : value;
    if (restored === undefined) clearTradeFields(next, key);
    else next[key] = restored;
  }
  if (fields.commission_type !== undefined) {
    next.commissionType = fields.commission_type;
  }
  for (const [field, key] of NUMBER_FIELDS) {
    const value = fields[field];
    if (value === undefined) continue;
    if (value === null) clearTradeFields(next, key);
    else next[key] = value;
  }
  if (fields.currency !== undefined) {
    const previous = next.currency;
    if (fields.currency === null) clearTradeFields(next, 'currency');
    else next.currency = fields.currency;
    if (next.currency !== previous && fields.fx_rate === undefined) {
      clearTradeFields(next, 'fxRate', 'fxRateBaseCurrency');
    }
  }
  if (fields.fx_rate !== undefined) {
    if (fields.fx_rate === null) {
      clearTradeFields(next, 'fxRate', 'fxRateBaseCurrency');
    } else {
      
      if (!next.currency || next.currency === context.globalCurrency) {
        throw new ActionPlanError('invalid_request', `${prefix}fx_rate`);
      }
      next.fxRate = fields.fx_rate;
      next.fxRateBaseCurrency = context.globalCurrency;
    }
  }
  const snapshot = fields.unrealized_price_snapshot;
  if (snapshot === null) {
    clearTradeFields(
      next,
      'unrealizedPriceSnapshot',
      'unrealizedPriceSnapshotTime'
    );
  } else if (snapshot !== undefined) {
    next.unrealizedPriceSnapshot = snapshot.price;
    next.unrealizedPriceSnapshotTime =
      snapshot.time === undefined ? context.now : new Date(snapshot.time);
  }
}


export function changeAssetType(next: TradeData, assetType: string): void {
  const kept = new Set(ASSET_TYPE_FIELDS[assetType] ?? []);
  const dropped = (ASSET_TYPE_FIELDS[next.assetType ?? ''] ?? []).filter(
    (key) => !kept.has(key)
  );
  if (dropped.length > 0) clearTradeFields(next, ...dropped);
  next.assetType = assetType;
}


export function resetContractSpecs(
  next: TradeData,
  defaults: InstrumentContractFields,
  given: DetailFields
): void {
  for (const field of SPEC_FIELD_NAMES) {
    const { key, assetType } = SPEC_FIELDS[field];
    if (
      assetType !== next.assetType ||
      given[field] !== undefined ||
      field === 'leverage_ratio'
    ) {
      continue;
    }
    const value = contractDefault(defaults, key);
    if (value === undefined) clearTradeFields(next, key);
    else next[key] = value;
  }
}


export function idealExitsFromWire(
  list: WireIdealExits
): IdealExitTransaction[] {
  return list.map((exit) => ({
    ...(exit.time === undefined ? {} : { time: new Date(exit.time) }),
    price: exit.price,
    ...(exit.size === undefined ? {} : { size: exit.size }),
  }));
}


export function checkDividendsAllowed(
  assetType: string | undefined,
  tradeType: TradeNoteType,
  field: string
): void {
  if (
    !shouldShowTradeDividends({
      assetType,
      isMissedTrade: tradeType === 'missed',
      isBacktestTrade: tradeType === 'backtest',
    })
  ) {
    throw new ActionPlanError(
      tradeType === 'regular' ? 'invalid_request' : 'unsupported_capability',
      field
    );
  }
}


export function dividendsFromWire(
  list: WireDividends,
  field: string
): DividendTransaction[] {
  if (list.some((dividend) => dividend.amount === 0)) {
    throw new ActionPlanError('invalid_request', field);
  }
  return list.map((dividend) => ({
    time: new Date(dividend.time),
    amount: dividend.amount,
  }));
}


export type ForexConversion =
  | { readonly kind: 'clear' }
  | { readonly kind: 'keep' }
  | {
      readonly kind: 'set';
      readonly quoteCurrency: string;
      readonly baseCurrency: string;
      readonly rate: number;
      readonly date?: string;
      readonly source: 'automatic' | 'manual';
    };


export interface ForexRateLookup {
  
  quoteCurrency(instrument: string): string | null;
  
  getRates(
    baseCurrency: string
  ): Promise<{ rates: Record<string, number>; rateDate: string } | null>;
}

function positive(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}


export async function resolveForexConversion(input: {
  trade: TradeData;
  type: TradeNoteType;
  requested: number | null | undefined;
  field: string;
  globalCurrency: string;
  lookup: ForexRateLookup;
}): Promise<ForexConversion> {
  const { trade, requested, field } = input;
  const quoteCurrency =
    trade.instrument === undefined
      ? null
      : input.lookup.quoteCurrency(trade.instrument);
  const baseCurrency = trade.currency || input.globalCurrency;
  if (
    input.type !== 'regular' ||
    trade.assetType !== 'forex' ||
    trade.useDirectPnLInput === true ||
    quoteCurrency === null ||
    quoteCurrency === baseCurrency
  ) {
    if (typeof requested === 'number') {
      throw new ActionPlanError('invalid_request', field);
    }
    return { kind: 'clear' };
  }
  if (typeof requested === 'number') {
    return {
      kind: 'set',
      quoteCurrency,
      baseCurrency,
      rate: requested,
      source: 'manual',
    };
  }
  if (
    requested === undefined &&
    trade.forexQuoteCurrency === quoteCurrency &&
    trade.forexPnlConversionBaseCurrency === baseCurrency &&
    positive(trade.forexPnlConversionRate)
  ) {
    return { kind: 'keep' };
  }
  const rates = await input.lookup.getRates(baseCurrency).catch(() => null);
  const quotePerBase = rates?.rates[quoteCurrency];
  if (!rates || !positive(quotePerBase)) {
    
    
    const priced =
      positive(trade.lotSize) ||
      (positive(trade.pipValue) && positive(trade.pipSize));
    if (priced) throw new ActionPlanError('invalid_request', field);
    return { kind: 'clear' };
  }
  return {
    kind: 'set',
    quoteCurrency,
    baseCurrency,
    rate: 1 / quotePerBase,
    date: rates.rateDate,
    source: 'automatic',
  };
}


export function applyForexConversion(
  next: TradeData,
  conversion: ForexConversion
): void {
  switch (conversion.kind) {
    case 'keep':
      return;
    case 'clear':
      clearTradeFields(next, ...FOREX_CONVERSION_KEYS);
      return;
    case 'set':
      next.forexQuoteCurrency = conversion.quoteCurrency;
      next.forexPnlConversionRate = conversion.rate;
      next.forexPnlConversionBaseCurrency = conversion.baseCurrency;
      next.forexPnlConversionRateSource = conversion.source;
      if (conversion.date === undefined) {
        clearTradeFields(next, 'forexPnlConversionRateDate');
      } else {
        next.forexPnlConversionRateDate = conversion.date;
      }
  }
}


export function makeResultOnly(
  next: TradeData,
  entryTime: Date,
  exitTime: Date
): void {
  next.entries = [];
  next.exits = [];
  next.entryTime = entryTime;
  next.exitTime = exitTime;
  next.entryPrice = 0;
  next.exitPrice = 0;
  next.positionSize = 0;
  delete next.hasExplicitExitPrice;
  delete next.tradeStatus;
}
