
import type { PartialTradeFrontmatter } from '../../types/TradeFrontmatter';
import type JournalitPlugin from '../../main';
import {
  areSnapshotKeysClaimedByCustomFields,
  calculateUnrealizedPnL,
} from '../../utils/unrealizedPnl';


export const snapshotUnrealizedPnL = (
  plugin: JournalitPlugin | null | undefined,
  data: PartialTradeFrontmatter
) =>
  areSnapshotKeysClaimedByCustomFields(plugin?.customFieldsService?.getFields())
    ? null
    : calculateUnrealizedPnL(data);


export function getHeaderPnl({
  showsUnrealized,
  unrealizedPnL,
  hasRealizedOpenComponents,
  realizedPnL,
  pnl,
}: {
  showsUnrealized: boolean;
  unrealizedPnL: number | null | undefined;
  hasRealizedOpenComponents: boolean;
  realizedPnL: () => number;
  pnl: number;
}): { openUnrealizedPnL: number | null; headerPnlValue: number } {
  const openUnrealizedPnL =
    showsUnrealized && unrealizedPnL !== null && unrealizedPnL !== undefined
      ? unrealizedPnL
      : null;
  if (openUnrealizedPnL === null) {
    return { openUnrealizedPnL, headerPnlValue: pnl };
  }
  return {
    openUnrealizedPnL,
    headerPnlValue:
      (hasRealizedOpenComponents ? realizedPnL() : 0) + openUnrealizedPnL,
  };
}


export const showsOutcomeValue = ({
  isCancelled,
  isAuthoritativeUnknownOutcome,
  isLiveOpenTrade,
  hasRealizedOpenComponents,
  openUnrealizedPnL,
}: {
  isCancelled: boolean;
  isAuthoritativeUnknownOutcome: boolean;
  isLiveOpenTrade: boolean;
  hasRealizedOpenComponents: boolean;
  openUnrealizedPnL: number | null;
}): boolean =>
  !isCancelled &&
  !isAuthoritativeUnknownOutcome &&
  (!isLiveOpenTrade || hasRealizedOpenComponents || openUnrealizedPnL !== null);


export function splitHeaderOutcomeValue(value: string): {
  main: string;
  decimal: string | null;
  suffix: string | null;
} {
  const match = value.match(/^(.*?)([.,]\d{2})(\s?[^\d.,]*)$/);

  if (!match) {
    return { main: value, decimal: null, suffix: null };
  }

  return {
    main: match[1],
    decimal: match[2],
    suffix: match[3] || null,
  };
}
