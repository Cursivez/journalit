

type ParsedTradeDividend<TTime = string | Date | null | undefined> = {
  time: TTime;
  amount?: number | null;
};

const parseOptionalNumber = (value: unknown): number | undefined => {
  if (value == null || value === '') {
    return undefined;
  }

  const parsed = parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseRequiredNumber = (value: unknown): number => {
  if (value == null || value === '') {
    return 0;
  }

  const parsed = parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

export function parseTradeDividendTransactions<
  TTime = string | Date | null | undefined,
>(
  dividends: unknown,
  options: {
    parseTime?: (value: unknown) => TTime;
    filter?: (dividend: ParsedTradeDividend<TTime>) => boolean;
  } = {}
): ParsedTradeDividend<TTime>[] | undefined {
  if (!Array.isArray(dividends)) {
    return undefined;
  }

  const parseTime =
    options.parseTime ||
    ((value: unknown) =>
      (value instanceof Date || typeof value === 'string'
        ? value
        : undefined) as TTime);

  const parsed = dividends
    .filter(
      (dividend): dividend is Record<string, unknown> =>
        dividend !== null && typeof dividend === 'object'
    )
    .map((dividend) => ({
      time: parseTime(dividend.time),
      amount: parseOptionalNumber(dividend.amount),
    }));

  return options.filter ? parsed.filter(options.filter) : parsed;
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
