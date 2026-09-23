import type { FC } from 'react';

import {
  MISSING_COLUMN_DIAGNOSTIC_CODE,
  UNSUPPORTED_METATRADER_STATEMENT_DIAGNOSTIC_CODE,
  UNSUPPORTED_TRADOVATE_PERFORMANCE_REPORT_DIAGNOSTIC_CODE,
  type TradeImportAnalyseResponse,
  type TradeImportPreviewResponse,
} from '../../services/tradeImport/types';
import type { BrokerImportRecoveryPresentationProps } from './BrokerImportRecoveryNotice';
import { DeepChartsSourceNotice } from './DeepChartsSourceNotice';
import { MetaTraderStatementNotice } from './MetaTraderStatementNotice';
import { MotiveWaveSourceNotice } from './MotiveWaveSourceNotice';
import { TradovatePerformanceReportNotice } from './TradovatePerformanceReportNotice';
import { TradingViewExportNotice } from './TradingViewExportNotice';

interface BrokerImportRecovery {
  diagnosticCodesToSuppress: ReadonlySet<string>;
  matches: (preview: TradeImportPreviewResponse) => boolean;
  Notice: FC<BrokerImportRecoveryPresentationProps>;
  showQuickImportAnotherFileAction?: boolean;
}

interface BrokerImportAnalyseRecovery {
  Notice: FC<BrokerImportRecoveryPresentationProps>;
  recommendedSource: 'DEEPCHARTS' | 'MOTIVEWAVE';
}

const HIGH_CONFIDENCE_SOURCE_THRESHOLD = 0.95;

const ANALYSE_SOURCE_RECOVERIES: Record<
  BrokerImportAnalyseRecovery['recommendedSource'],
  FC<BrokerImportRecoveryPresentationProps>
> = {
  DEEPCHARTS: DeepChartsSourceNotice,
  MOTIVEWAVE: MotiveWaveSourceNotice,
};

function diagnosticCodeRecovery(
  diagnosticCode: string,
  Notice: FC<BrokerImportRecoveryPresentationProps>
): BrokerImportRecovery {
  return {
    diagnosticCodesToSuppress: new Set([diagnosticCode]),
    matches: (preview) =>
      preview.diagnostics.some(
        (diagnostic) => diagnostic.code === diagnosticCode
      ),
    Notice,
  };
}

const BROKER_IMPORT_RECOVERIES: BrokerImportRecovery[] = [
  diagnosticCodeRecovery(
    UNSUPPORTED_TRADOVATE_PERFORMANCE_REPORT_DIAGNOSTIC_CODE,
    TradovatePerformanceReportNotice
  ),
  diagnosticCodeRecovery(
    UNSUPPORTED_METATRADER_STATEMENT_DIAGNOSTIC_CODE,
    MetaTraderStatementNotice
  ),
  {
    diagnosticCodesToSuppress: new Set(),
    matches: (preview) =>
      preview.broker === 'TRADINGVIEW' &&
      preview.summary.previewTradeCount === 0 &&
      preview.items.length === 0 &&
      preview.diagnostics.some(
        (diagnostic) => diagnostic.code === MISSING_COLUMN_DIAGNOSTIC_CODE
      ),
    Notice: TradingViewExportNotice,
    
    showQuickImportAnotherFileAction: true,
  },
];

export function resolveBrokerImportRecovery(
  preview: TradeImportPreviewResponse
): BrokerImportRecovery | null {
  if (preview.outcome !== 'failed') {
    return null;
  }
  for (const recovery of BROKER_IMPORT_RECOVERIES) {
    if (recovery.matches(preview)) {
      return recovery;
    }
  }
  return null;
}

export function resolveBrokerImportAnalyseRecovery(
  analyse: TradeImportAnalyseResponse,
  selectedSource: string
): BrokerImportAnalyseRecovery | null {
  const highConfidenceCandidates = analyse.brokerCandidates.filter(
    (candidate) => candidate.confidence >= HIGH_CONFIDENCE_SOURCE_THRESHOLD
  );
  if (highConfidenceCandidates.length !== 1) return null;

  const recommendedSource = highConfidenceCandidates[0]?.broker;
  if (
    recommendedSource !== 'DEEPCHARTS' &&
    recommendedSource !== 'MOTIVEWAVE'
  ) {
    return null;
  }
  if (recommendedSource === selectedSource) return null;

  return {
    Notice: ANALYSE_SOURCE_RECOVERIES[recommendedSource],
    recommendedSource,
  };
}
