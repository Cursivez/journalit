import type JournalitPlugin from '../../main';
import { parseLocalDateSafe } from '../../utils/dateUtils';
import { classifyPnLWithBreakEvenSettings } from '../../utils/breakEvenRange';
import { calculateEffectiveRMultiple } from '../../utils/formatting';
import {
  getEffectivePnL,
  hasRealizedStoredPnL,
  isPnlContributingTrade,
  isTradeOpenWithContext,
} from '../../utils/tradeStatusUtils';
import {
  getCopyTradingPeriodForEntryDate,
  isCopyTradingBaseEligible,
} from '../../utils/accountCopyTrading';
import { calculateCopiedTradePnL } from '../../utils/copyTradePnL';
import {
  normalizeAccountLookupKey,
  normalizeTradeAccountIdentity,
} from '../trade/core/TradeAccountIdentity';
import {
  getBreakEvenAccountBalanceFields,
  resolveBreakEvenAccountBalances,
  type BreakEvenAccountBalanceLookup,
} from '../trade/core/BreakEvenAccountBalance';
import type { TradeStatus } from '../tradelog/types';
import type { ImageGalleryOutcome } from '../../components/imageGallery/types';
import {
  getDateString,
  getOptionalNumber,
  getString,
  getTradeDateValue,
  getTradeExecutions,
  isRecord,
  type ImageGallerySourceType,
  type TradeRecord,
} from './ImageGalleryInternal';

export function classifyOutcome(
  pnl: number,
  plugin: JournalitPlugin,
  breakEvenBalance?: number
): ImageGalleryOutcome {
  const outcome = classifyPnLWithBreakEvenSettings(
    pnl,
    plugin.settings.trade,
    breakEvenBalance
  );
  if (outcome === 'win') return 'winner';
  if (outcome === 'loss') return 'loser';
  if (outcome === 'breakeven') return 'breakeven';
  return 'unknown';
}

export function getTradeStatus(
  trade: TradeRecord,
  pnl: number,
  plugin: JournalitPlugin,
  breakEvenBalance?: number
): TradeStatus {
  if (
    isTradeOpenWithContext({
      tradeStatus: getString(trade.tradeStatus),
      exitTime: getDateString(trade.exitTime) ?? null,
      exitPrice: getOptionalNumber(trade.exitPrice) ?? null,
      entries: getTradeExecutions(trade.entries),
      exits: getTradeExecutions(trade.exits),
      pnl,
      useDirectPnLInput: trade.useDirectPnLInput === true,
    })
  ) {
    return 'open';
  }

  const outcome = classifyPnLWithBreakEvenSettings(
    pnl,
    plugin.settings.trade,
    breakEvenBalance
  );
  if (outcome === 'win') return 'win';
  if (outcome === 'loss') return 'loss';
  return 'breakeven';
}

export function getBreakEvenBalance(
  trade: TradeRecord,
  accountBalanceLookup?: BreakEvenAccountBalanceLookup | null,
  accounts?: string[]
): number | undefined {
  if (accountBalanceLookup) {
    const resolvedFields = getBreakEvenAccountBalanceFields(
      resolveBreakEvenAccountBalances(
        {
          ...trade,
          account: accounts && accounts.length > 0 ? accounts : trade.account,
        },
        accountBalanceLookup
      )
    );

    const resolvedBalance =
      resolvedFields.breakEvenAccountCurrentBalanceTotal ??
      resolvedFields.breakEvenAccountCurrentBalance;
    if (resolvedBalance !== undefined) {
      return resolvedBalance;
    }
  }

  return (
    getOptionalNumber(trade.breakEvenAccountCurrentBalanceTotal) ??
    getOptionalNumber(trade.breakEvenAccountCurrentBalance)
  );
}

function getDividendAdjustments(
  value: unknown
): Array<{ amount?: number | null }> | undefined {
  if (!Array.isArray(value)) return undefined;

  const dividends = value.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const amount = getOptionalNumber(entry.amount);
    return amount === undefined ? [] : [{ amount }];
  });

  return dividends.length > 0 ? dividends : undefined;
}

interface TradeAccountVariant {
  account: string | undefined;
  accounts: string[];
  idSuffix: string;
  isCopiedTrade?: boolean;
  includeInAllAccounts?: boolean;
  pnl: number;
  rMultiple?: number;
}

export function getCustomFieldRawValue(
  trade: TradeRecord,
  field: { id: string; fieldKey: string }
): unknown {
  const rootLevelValue = trade[field.fieldKey];
  if (rootLevelValue !== undefined) return rootLevelValue;

  const customFields = isRecord(trade.customFields)
    ? trade.customFields
    : undefined;
  return customFields?.[field.id];
}

export function getTradeAccountVariants(
  trade: TradeRecord,
  plugin: JournalitPlugin,
  pnl: number,
  includeCopiedVariants: boolean
): TradeAccountVariant[] {
  const baseAccounts = new Map<string, string>();
  const addBaseAccount = (accountName: string) => {
    const lookupKey = normalizeAccountLookupKey(accountName);
    if (lookupKey) baseAccounts.set(lookupKey, accountName);
  };

  for (const accountName of normalizeTradeAccountIdentity(trade).accountNames) {
    addBaseAccount(accountName);
  }

  const baseAccountsList = Array.from(baseAccounts.values());
  const variants: TradeAccountVariant[] = [
    {
      account: getString(trade.account) || baseAccountsList[0],
      accounts: baseAccountsList,
      idSuffix: 'base',
      pnl,
      rMultiple: calculateEffectiveRMultiple(
        pnl,
        getOptionalNumber(trade.rMultiple),
        getOptionalNumber(trade.riskAmount),
        plugin.settings.trade?.defaultRiskAmount
      ),
    },
  ];

  const entryDateValue = getTradeDateValue(trade);
  const entryDate = parseLocalDateSafe(entryDateValue);
  if (
    !includeCopiedVariants ||
    !entryDate ||
    Number.isNaN(entryDate.getTime())
  ) {
    return variants;
  }

  const accountMetadata = plugin.settings.account?.accountMetadata ?? {};
  const baseAccountLookupKeys = new Set(baseAccounts.keys());
  for (const [metadataKey, copyMetadata] of Object.entries(accountMetadata)) {
    const copyPeriod = getCopyTradingPeriodForEntryDate(
      copyMetadata,
      entryDate
    );
    if (!copyPeriod) continue;

    const baseLookupKey = normalizeAccountLookupKey(copyPeriod.baseAccount);
    if (!baseAccountLookupKeys.has(baseLookupKey)) continue;

    if (
      !isCopyTradingBaseEligible(
        accountMetadata,
        copyMetadata,
        copyPeriod.baseAccount,
        entryDate,
        plugin.settings.general?.currency
      )
    ) {
      continue;
    }

    const copyAccountName = copyMetadata.name || metadataKey;
    const copyAccountLookupKey = normalizeAccountLookupKey(copyAccountName);
    if (!copyAccountLookupKey) continue;

    const { pnl: copiedPnl } = calculateCopiedTradePnL({
      plugin,
      baseTrade: trade,
      copyAccountName,
      copyAccountLookupKey,
      multiplier: copyPeriod.multiplier,
    });
    const baseRiskAmount = getOptionalNumber(trade.riskAmount);
    const copiedRiskAmount =
      baseRiskAmount === undefined
        ? undefined
        : baseRiskAmount * copyPeriod.multiplier;

    variants.push({
      account: copyAccountName,
      accounts: [copyAccountName],
      idSuffix: `copy:${copyAccountLookupKey}`,
      isCopiedTrade: true,
      includeInAllAccounts:
        plugin.settings.trade.includeCopyAccountsInAllAccountsAnalytics ===
        true,
      pnl: copiedPnl,
      rMultiple: calculateEffectiveRMultiple(
        copiedPnl,
        undefined,
        copiedRiskAmount,
        plugin.settings.trade?.defaultRiskAmount
      ),
    });
  }

  return variants;
}

export function toTradePnl(trade: TradeRecord): number {
  const input = getTradePnlContext(trade);

  return isPnlContributingTrade(input) ? getEffectivePnL(input) : 0;
}

function getTradePnlContext(trade: TradeRecord) {
  const storedPnl = getOptionalNumber(trade.pnl);
  const directPnl = getOptionalNumber(trade.directPnL);
  return {
    tradeStatus: getString(trade.tradeStatus),
    exitTime: getDateString(trade.exitTime) ?? null,
    exitPrice: getOptionalNumber(trade.exitPrice) ?? null,
    pnl: storedPnl ?? null,
    _originalPnlWasNull: trade._originalPnlWasNull === true,
    useDirectPnLInput: trade.useDirectPnLInput === true,
    directPnL: directPnl ?? null,
    dividends: getDividendAdjustments(trade.dividends),
    commission: getOptionalNumber(trade.commission) ?? null,
    swap: getOptionalNumber(trade.swap) ?? null,
    fees: getOptionalNumber(trade.fees) ?? null,
    rebate: getOptionalNumber(trade.rebate) ?? null,
    entries: getTradeExecutions(trade.entries),
    exits: getTradeExecutions(trade.exits),
  };
}

export function shouldShowTradePnl(
  trade: TradeRecord,
  tradeStatus: TradeStatus | undefined
): boolean {
  return (
    tradeStatus !== undefined &&
    (tradeStatus !== 'open' || hasRealizedStoredPnL(getTradePnlContext(trade)))
  );
}

export function reviewSourceLabel(sourceType: ImageGallerySourceType): string {
  switch (sourceType) {
    case 'trade':
      return 'Trade';
    case 'drc':
      return 'Daily review';
    case 'weekly':
      return 'Weekly review';
    case 'monthly':
      return 'Monthly review';
    case 'quarterly':
      return 'Quarterly review';
    case 'yearly':
      return 'Yearly review';
  }
}

export function getTradeRecordType(
  trade: TradeRecord
): 'regular' | 'missed' | 'backtest' {
  if (trade.tradeType === 'backtest' || trade.type === 'backtest-trade') {
    return 'backtest';
  }
  if (
    trade.tradeType === 'missed' ||
    trade.type === 'missed-trade' ||
    trade.isMissedTrade === true
  ) {
    return 'missed';
  }
  return 'regular';
}
