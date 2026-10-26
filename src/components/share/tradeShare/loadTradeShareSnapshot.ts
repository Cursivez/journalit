import type { TFile } from 'obsidian';
import type JournalitPlugin from '../../../main';
import type { PartialTradeFrontmatter } from '../../../types/TradeFrontmatter';
import { readFrontmatterFromDisk } from '../../../utils/dataRefresh';
import { createDisplayPolicy } from '../../../services/display/DisplayPolicy';
import { normalizeTradeTagColors } from '../../../contexts/TradeLabelColorContext';
import {
  buildBreakEvenAccountBalanceLookup,
  resolveBreakEvenAccountBalances,
} from '../../../services/trade/core/BreakEvenAccountBalance';
import type { TradeNoteRenderer } from '../../trade/TradeNoteRenderer';
import {
  tradeShareAccountBalance,
  type TradeSharePresentation,
} from './tradeShareModel';

interface TradeShareSnapshot {
  data: PartialTradeFrontmatter;
  accountBalance: number | undefined;
  presentation: TradeSharePresentation;
}


export async function loadTradeShareSnapshot(
  plugin: JournalitPlugin,
  file: TFile,
  renderer: Pick<TradeNoteRenderer, 'processTradeData'>
): Promise<TradeShareSnapshot> {
  const frontmatter = await readFrontmatterFromDisk(plugin.app, file);
  if (
    frontmatter.type !== 'trade' &&
    frontmatter.type !== 'backtest-trade' &&
    frontmatter.type !== 'missed-trade' &&
    frontmatter.isMissedTrade !== true
  ) {
    throw new Error('Trade note frontmatter is not available');
  }
  const [accounts, setupColors] = await Promise.all([
    plugin.serviceManager
      .getAccountPageService()
      .then((service) => service.getAllEnhancedAccounts()),
    plugin.serviceManager
      .getSetupService()
      .then((service) => service.getSetupLabelColors()),
  ]);
  const breakEvenBalance = resolveBreakEvenAccountBalances(
    frontmatter,
    buildBreakEvenAccountBalanceLookup(accounts)
  ).singleBalance;
  return {
    data: { ...renderer.processTradeData(frontmatter), filePath: file.path },
    accountBalance: tradeShareAccountBalance(
      frontmatter,
      accounts,
      createDisplayPolicy(plugin.settings).currencyCode
    ),
    presentation: {
      
      
      breakEvenAccountCurrentBalance: breakEvenBalance,
      labelColors: {
        setups: setupColors,
        tags: normalizeTradeTagColors(plugin.optionsService.getTagColors()),
      },
    },
  };
}
