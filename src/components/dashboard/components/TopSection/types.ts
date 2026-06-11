

import { t } from '../../../../lang/helpers';

export interface MetricDefinition {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'volume' | 'average';
}


export const AVAILABLE_METRICS: MetricDefinition[] = [
  {
    id: 'netPnL',
    name: t('metric.netPnL.name'),
    description: t('metric.netPnL.description'),
    category: 'performance',
  },
  {
    id: 'winRate',
    name: t('metric.winRate.name'),
    description: t('metric.winRate.description'),
    category: 'performance',
  },
  {
    id: 'profitFactor',
    name: t('metric.profitFactor.name'),
    description: t('metric.profitFactor.description'),
    category: 'performance',
  },
  {
    id: 'expectancy',
    name: t('metric.expectancy.name'),
    description: t('metric.expectancy.description'),
    category: 'performance',
  },
  {
    id: 'maxDrawdown',
    name: t('metric.maxDrawdown.name'),
    description: t('metric.maxDrawdown.description'),
    category: 'performance',
  },
  {
    id: 'bestDay',
    name: t('metric.bestDay.name'),
    description: t('metric.bestDay.description'),
    category: 'performance',
  },
  {
    id: 'largestWin',
    name: t('metric.largestWin.name'),
    description: t('metric.largestWin.description'),
    category: 'performance',
  },
  {
    id: 'largestLoss',
    name: t('metric.largestLoss.name'),
    description: t('metric.largestLoss.description'),
    category: 'performance',
  },
  {
    id: 'longestWinStreak',
    name: t('metric.longestWinStreak.name'),
    description: t('metric.longestWinStreak.description'),
    category: 'performance',
  },
  {
    id: 'longestLossStreak',
    name: t('metric.longestLossStreak.name'),
    description: t('metric.longestLossStreak.description'),
    category: 'performance',
  },
  {
    id: 'numTrades',
    name: t('metric.numTrades.name'),
    description: t('metric.numTrades.description'),
    category: 'volume',
  },
  {
    id: 'numWinTrades',
    name: t('metric.numWinTrades.name'),
    description: t('metric.numWinTrades.description'),
    category: 'volume',
  },
  {
    id: 'numLossTrades',
    name: t('metric.numLossTrades.name'),
    description: t('metric.numLossTrades.description'),
    category: 'volume',
  },
  {
    id: 'avgWin',
    name: t('metric.avgWin.name'),
    description: t('metric.avgWin.description'),
    category: 'average',
  },
  {
    id: 'avgLoss',
    name: t('metric.avgLoss.name'),
    description: t('metric.avgLoss.description'),
    category: 'average',
  },
  {
    id: 'avgRR',
    name: t('metric.avgRR.name'),
    description: t('metric.avgRR.description'),
    category: 'average',
  },
  {
    id: 'avgRRRiskBased',
    name: t('metric.avgRRRiskBased.name'),
    description: t('metric.avgRRRiskBased.description'),
    category: 'average',
  },
  {
    id: 'avgHoldTime',
    name: t('metric.avgHoldTime.name'),
    description: t('metric.avgHoldTime.description'),
    category: 'average',
  },
  {
    id: 'timeInDrawdown',
    name: t('metric.timeInDrawdown.name'),
    description: t('metric.timeInDrawdown.description'),
    category: 'performance',
  },
  {
    id: 'avgRecoveryTime',
    name: t('metric.avgRecoveryTime.name'),
    description: t('metric.avgRecoveryTime.description'),
    category: 'average',
  },
  {
    id: 'longestDrawdown',
    name: t('metric.longestDrawdown.name'),
    description: t('metric.longestDrawdown.description'),
    category: 'performance',
  },
  {
    id: 'drawdownEpisodes',
    name: t('metric.drawdownEpisodes.name'),
    description: t('metric.drawdownEpisodes.description'),
    category: 'performance',
  },
  {
    id: 'avgWinHoldTime',
    name: t('metric.avgWinHoldTime.name'),
    description: t('metric.avgWinHoldTime.description'),
    category: 'average',
  },
  {
    id: 'avgLossHoldTime',
    name: t('metric.avgLossHoldTime.name'),
    description: t('metric.avgLossHoldTime.description'),
    category: 'average',
  },
  {
    id: 'avgWinnerHeat',
    name: t('metric.avgWinnerHeat.name'),
    description: t('metric.avgWinnerHeat.description'),
    category: 'average',
  },
  {
    id: 'winnerMaeP90',
    name: t('metric.winnerMaeP90.name'),
    description: t('metric.winnerMaeP90.description'),
    category: 'average',
  },
  {
    id: 'winnerMaeMedian',
    name: t('metric.winnerMaeMedian.name'),
    description: t('metric.winnerMaeMedian.description'),
    category: 'average',
  },
  {
    id: 'avgLossHeat',
    name: t('metric.avgLossHeat.name'),
    description: t('metric.avgLossHeat.description'),
    category: 'average',
  },
  {
    id: 'winnerAvgMfe',
    name: t('metric.winnerAvgMfe.name'),
    description: t('metric.winnerAvgMfe.description'),
    category: 'average',
  },
  {
    id: 'loserAvgMfe',
    name: t('metric.loserAvgMfe.name'),
    description: t('metric.loserAvgMfe.description'),
    category: 'average',
  },
  {
    id: 'winnerMfeP90',
    name: t('metric.winnerMfeP90.name'),
    description: t('metric.winnerMfeP90.description'),
    category: 'average',
  },
  {
    id: 'loserMfeP90',
    name: t('metric.loserMfeP90.name'),
    description: t('metric.loserMfeP90.description'),
    category: 'average',
  },
];
