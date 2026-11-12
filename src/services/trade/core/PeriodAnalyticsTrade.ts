import type { Trade } from '../../../components/dashboard/utils/dataUtils';
import { getEffectivePnL } from '../../../utils/tradeStatusUtils';
import { parseTradeFinancialFields } from '../../../utils/tradeUtils';
import { extractCanonicalProjectionPnlFields } from './CanonicalProjectionFields';
import type { normalizeTradeExecutionForPeriodAnalytics } from './TradeExecutionAnalytics';

const stringValue = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

function booleanValue(value: unknown): boolean | undefined {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return typeof value === 'boolean' ? value : undefined;
}

const stringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];


export function buildPeriodAnalyticsTrade(
  frontmatter: Record<string, unknown>,
  execution: NonNullable<
    ReturnType<typeof normalizeTradeExecutionForPeriodAnalytics>
  >,
  path: string
): Trade {
  const originalPnlWasNull =
    frontmatter.pnl === undefined || frontmatter.pnl === null;
  const financial = parseTradeFinancialFields(frontmatter);
  const useDirectPnLInput = booleanValue(frontmatter.useDirectPnLInput);

  return {
    instrument:
      stringValue(frontmatter.instrument) ??
      stringValue(frontmatter.ticker) ??
      '',
    direction:
      stringValue(frontmatter.direction) ?? stringValue(frontmatter.side) ?? '',
    ...execution,
    
    
    pnl: originalPnlWasNull
      ? getEffectivePnL({ directPnL: financial.directPnL, useDirectPnLInput })
      : typeof frontmatter.pnl === 'number'
        ? frontmatter.pnl
        : 0,
    setup: stringArray(frontmatter.setup),
    tags: stringArray(frontmatter.tags),
    mistake: stringArray(frontmatter.mistake),
    account:
      typeof frontmatter.account === 'string'
        ? [frontmatter.account]
        : stringArray(frontmatter.account),
    path,
    ...extractCanonicalProjectionPnlFields(frontmatter),
    tradeStatus: stringValue(frontmatter.tradeStatus),
    useDirectPnLInput,
    _originalPnlWasNull: originalPnlWasNull,
    ...financial,
  };
}
