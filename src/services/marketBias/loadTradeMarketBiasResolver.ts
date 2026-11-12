import type JournalitPlugin from '../../main';
import type { DRCService } from '../drc/DRCService';
import type { WeeklyReviewService } from '../weekly/WeeklyReviewService';
import { getTradingDay } from '../../utils/tradingDayUtils';
import {
  createTradeMarketBiasResolver,
  type TradeMarketBiasResolver,
} from './tradeMarketBias';

export interface MarketBiasServices {
  drcService: Pick<DRCService, 'getMarketBiasByDay'>;
  weeklyReviewService: Pick<WeeklyReviewService, 'getMarketBiasForWeek'>;
}


export function createPluginTradeMarketBiasResolver(
  plugin: JournalitPlugin,
  { drcService, weeklyReviewService }: MarketBiasServices
): TradeMarketBiasResolver {
  return createTradeMarketBiasResolver(
    {
      getMarketBiasByDay: () => drcService.getMarketBiasByDay(),
      getMarketBiasForWeek: (day) =>
        weeklyReviewService.getMarketBiasForWeek(day),
    },
    (entryTime) => getTradingDay(entryTime, plugin)
  );
}

export async function loadMarketBiasServices(
  plugin: JournalitPlugin
): Promise<MarketBiasServices> {
  const [drcService, weeklyReviewService] = await Promise.all([
    plugin.serviceManager.getDRCService(),
    plugin.serviceManager.getWeeklyReviewService(),
  ]);
  return { drcService, weeklyReviewService };
}


export async function loadTradeMarketBiasResolver(
  plugin: JournalitPlugin
): Promise<TradeMarketBiasResolver> {
  return createPluginTradeMarketBiasResolver(
    plugin,
    await loadMarketBiasServices(plugin)
  );
}
