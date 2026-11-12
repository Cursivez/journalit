
import { t } from '../../../../lang/helpers';
import type { TradeVerification } from '../../../../services/tradeSync/tradeVerification';
import type { TradeSharePnlMode } from '../tradeShareModel';
import type { Lang } from '../../../../lang/locale/en';

export type MotionCardSource =
  | { kind: 'verified'; label: string; account: string }
  | { kind: 'note'; text: string }
  | null;

const BROKER_LABELS: Record<string, keyof Lang> = {
  TRADOVATE: 'trade-sync.source.tradovate',
  CTRADER: 'trade-sync.source.ctrader',
  RITHMIC: 'trade-sync.source.rithmic',
  HYPERLIQUID: 'trade-sync.source.hyperliquid',
  METATRADER: 'trade-sync.source.metatrader',
};


function accountLine(
  broker: string,
  environment: 'demo' | 'live' | null
): string {
  const labelKey = BROKER_LABELS[broker.toUpperCase()];
  const name = labelKey ? t(labelKey) : broker;
  if (environment === null) return name;
  return `${name} · ${t(
    environment === 'demo' ? 'share.motion.demo' : 'share.motion.live'
  )}`;
}

export function buildMotionCardSource({
  verification,
  pnlMode,
  isClosed,
  masked,
}: {
  verification: TradeVerification | null;
  pnlMode: TradeSharePnlMode;
  isClosed: boolean;
  masked: boolean;
}): MotionCardSource {
  if (masked || verification === null) return null;
  switch (verification.state) {
    case 'unavailable':
      return null;
    case 'manual':
    case 'edited':
      return { kind: 'note', text: t('share.motion.self-reported') };
    case 'imported':
      return { kind: 'note', text: t('share.motion.imported') };
    case 'verified': {
      const account = accountLine(
        verification.broker,
        verification.environment
      );
      
      
      return pnlMode === 'currency' && isClosed
        ? { kind: 'verified', label: t('share.motion.verified'), account }
        : { kind: 'note', text: account };
    }
  }
}
