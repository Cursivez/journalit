import { safeString } from './safeString';


type ParsedTradeDividend<TTime = string | Date | null | undefined> = {
  time: TTime;
  amount?: number | null;
};

const parseOptionalNumber = (value: unknown): number | undefined => {
  if (value == null || value === '') {
    return undefined;
  }

  const parsed = parseFloat(safeString(value));
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseRequiredNumber = (value: unknown): number => {
  if (value == null || value === '') {
    return 0;
  }

  const parsed = parseFloat(safeString(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

export function parseTradeDividendTransactions(
  dividends: unknown
): ParsedTradeDividend<string | Date | undefined>[] | undefined;
export function parseTradeDividendTransactions<TTime>(
  dividends: unknown,
  options: {
    parseTime: (value: unknown) => TTime;
    filter?: (dividend: ParsedTradeDividend<TTime>) => boolean;
  }
): ParsedTradeDividend<TTime>[] | undefined;
export function parseTradeDividendTransactions<TTime>(
  dividends: unknown,
  options?: {
    parseTime?: (value: unknown) => TTime;
    filter?: (dividend: ParsedTradeDividend<TTime>) => boolean;
  }
):
  | ParsedTradeDividend<TTime>[]
  | ParsedTradeDividend<string | Date | undefined>[]
  | undefined {
  if (!Array.isArray(dividends)) {
    return undefined;
  }

  const dividendRecords = dividends.filter(
    (dividend): dividend is Record<string, unknown> =>
      dividend !== null &&
      typeof dividend === 'object' &&
      !Array.isArray(dividend)
  );

  if (options?.parseTime) {
    const parsed = dividendRecords.map((dividend) => ({
      time: options.parseTime!(dividend.time),
      amount: parseOptionalNumber(dividend.amount),
    }));

    return options.filter ? parsed.filter(options.filter) : parsed;
  }

  return dividendRecords.map((dividend) => ({
    time:
      dividend.time instanceof Date || typeof dividend.time === 'string'
        ? dividend.time
        : undefined,
    amount: parseOptionalNumber(dividend.amount),
  }));
}


export function parseTradeFinancialFields(
  frontmatter: Record<string, unknown>
): {
  rMultiple: number | undefined;
  riskAmount: number | undefined;
  stopLoss: number | undefined;
  commission: number;
  swap: number;
  fees: number;
  rebate: number | undefined;
  directPnL: number | undefined;
  dividends: ParsedTradeDividend[] | undefined;
} {
  const dividends = parseTradeDividendTransactions(frontmatter.dividends);

  return {
    
    rMultiple: parseOptionalNumber(frontmatter.rMultiple),
    riskAmount: parseOptionalNumber(frontmatter.riskAmount),
    stopLoss: parseOptionalNumber(frontmatter.stopLoss),
    rebate: parseOptionalNumber(frontmatter.rebate),
    directPnL: parseOptionalNumber(frontmatter.directPnL),
    dividends,

    
    commission: parseRequiredNumber(frontmatter.commission),
    swap: parseRequiredNumber(frontmatter.swap),
    fees: parseRequiredNumber(frontmatter.fees),
  };
}
