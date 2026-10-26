import type { DisplayValueOptions } from '../../../services/display/DisplayPolicy';
import type { Lang } from '../../../lang/locale/en';
import type { TradeLabelColors } from '../../../contexts/TradeLabelColorContext';
import type { TradeImageLayout } from '../../../types/reviewV2';
import {
  buildBreakEvenAccountBalanceLookup,
  resolveBreakEvenAccountBalances,
} from '../../../services/trade/core/BreakEvenAccountBalance';

export type TradeShareSection =
  | 'header'
  | 'images'
  | 'metrics'
  | 'thesis'
  | 'missedReason'
  | 'metadata'
  | 'rating';


export function tradeShareAccountBalance(
  trade: Record<string, unknown>,
  accounts: Parameters<typeof buildBreakEvenAccountBalanceLookup>[0],
  globalCurrency: string
): number | undefined {
  const lookup = buildBreakEvenAccountBalanceLookup(
    accounts.map((account) => ({
      name: account.name,
      currentBalance: account.currentBalance,
      currency: account.currency || globalCurrency,
      id: account.id,
      accountId: account.accountId,
    }))
  );
  const resolution = resolveBreakEvenAccountBalances(trade, lookup);
  const currency =
    typeof trade.currency === 'string' && trade.currency
      ? trade.currency
      : globalCurrency;
  return resolution.singleBalanceCurrency === currency
    ? resolution.singleBalance
    : undefined;
}

export function tradeSharePnlLabel(mode: TradeSharePnlMode): keyof Lang {
  switch (mode) {
    case 'currency':
    case 'r':
      return 'template.editor.metric.pnl';
    case 'position-percent':
      return 'share.trade.position-return';
    case 'account-percent':
      return 'share.trade.account-return';
  }
}
export type TradeSharePnlMode =
  | 'currency'
  | 'r'
  | 'position-percent'
  | 'account-percent';

export interface TradeShareOptions {
  sections: ReadonlySet<TradeShareSection>;
  pnlMode: TradeSharePnlMode;
  imageLayout: TradeShareImageLayout;
  
  accountBalance: number | undefined;
  presentation: TradeSharePresentation;
}

export type TradeShareImageLayout = 'current' | TradeImageLayout;

export function resolveTradeShareImageLayout(
  selected: TradeShareImageLayout,
  current: TradeImageLayout
): TradeImageLayout {
  return selected === 'current' ? current : selected;
}


export interface TradeSharePresentation {
  breakEvenAccountCurrentBalance: number | undefined;
  labelColors: TradeLabelColors;
}

export const TRADE_SHARE_SECTION_LABELS = {
  header: 'common.header',
  images: 'template.editor.images',
  metrics: 'template.editor.metrics',
  thesis: 'template.editor.thesis',
  missedReason: 'template.editor.missed-reason',
  metadata: 'template.editor.metadata',
  rating: 'template.editor.rating',
} as const satisfies Record<TradeShareSection, string>;


export function tradeShareSectionProps(section: TradeShareSection) {
  return { 'data-journalit-trade-share-section': section };
}

function isTradeShareSection(value: string | null): value is TradeShareSection {
  return (
    value === 'header' ||
    value === 'images' ||
    value === 'metrics' ||
    value === 'thesis' ||
    value === 'missedReason' ||
    value === 'metadata' ||
    value === 'rating'
  );
}

export function availableTradeShareSections(
  card: HTMLElement
): TradeShareSection[] {
  const result = new Set<TradeShareSection>();
  for (const element of card.querySelectorAll(
    '[data-journalit-trade-share-section]'
  )) {
    const id = element.getAttribute('data-journalit-trade-share-section');
    if (isTradeShareSection(id)) {
      result.add(id);
    }
  }
  return Array.from(result);
}

export function tradeSharePnlValue({
  mode,
  pnl,
  rMultiple,
  positionReturn,
  accountBalance,
  currency,
}: {
  mode: TradeSharePnlMode;
  pnl: number | undefined;
  rMultiple: number | undefined;
  positionReturn: number | undefined;
  accountBalance: number | undefined;
  currency: string;
}): DisplayValueOptions {
  switch (mode) {
    case 'currency':
      return {
        kind: 'pnl',
        value: pnl,
        currencyCode: currency,
      };
    case 'r':
      return { kind: 'rMultiple', value: rMultiple, signed: true };
    case 'position-percent':
      return { kind: 'returnPercent', value: positionReturn, signed: true };
    case 'account-percent':
      return {
        kind: 'returnPercent',
        value:
          pnl !== undefined &&
          accountBalance !== undefined &&
          Number.isFinite(accountBalance) &&
          accountBalance > 0
            ? (pnl / accountBalance) * 100
            : undefined,
        signed: true,
      };
  }
}
