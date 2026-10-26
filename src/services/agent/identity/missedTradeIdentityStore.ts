import type { TFile } from 'obsidian';
import { generateTradeId, isStrictTradeId } from '../../../utils/tradeIdentity';

export const MISSED_TRADE_AGENT_ID_KEY = 'journalit-agent-trade-id';

export function isMissedTradeAgentId(value: unknown): value is string {
  return isStrictTradeId(value);
}

export function generateMissedTradeAgentId(): string {
  return generateTradeId();
}

export function compareMissedTradeIdentityOrder(a: TFile, b: TFile): number {
  const ctimeDifference = a.stat.ctime - b.stat.ctime;
  return ctimeDifference || a.path.localeCompare(b.path);
}
