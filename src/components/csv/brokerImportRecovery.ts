import type { FC } from 'react';

import {
  MISSING_COLUMN_DIAGNOSTIC_CODE,
  UNSUPPORTED_METATRADER_STATEMENT_DIAGNOSTIC_CODE,
  UNSUPPORTED_TRADOVATE_PERFORMANCE_REPORT_DIAGNOSTIC_CODE,
  type TradeImportAnalyseResponse,
  type TradeImportPreviewResponse,
} from '../../services/tradeImport/types';
import type { BrokerImportRecoveryPresentationProps } from './BrokerImportRecoveryNotice';
import { MetaTraderStatementNotice } from './MetaTraderStatementNotice';
import { TradovatePerformanceReportNotice } from './TradovatePerformanceReportNotice';
import { TradingViewExportNotice } from './TradingViewExportNotice';

interface BrokerImportRecovery {
  diagnosticCodesToSuppress: ReadonlySet<string>;
  matches: (preview: TradeImportPreviewResponse) => boolean;
  Notice: FC<BrokerImportRecoveryPresentationProps>;
  showQuickImportAnotherFileAction?: boolean;
}


export interface BrokerImportAnalyseRecovery {
  
  recommendedSource: string;
  
  recommendedSourceLabel: string;
}


export interface BrokerImportSourceOption {
  id: string;
  label: string;
}


const HIGH_CONFIDENCE_SOURCE_THRESHOLD = 0.95;
const MANUAL_SOURCE = 'MANUAL';

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
  selectedSource: string,
  sources: readonly BrokerImportSourceOption[]
): BrokerImportAnalyseRecovery | null {
  const highConfidenceCandidates = analyse.brokerCandidates.filter(
    (candidate) =>
      candidate.broker !== MANUAL_SOURCE &&
      candidate.confidence >= HIGH_CONFIDENCE_SOURCE_THRESHOLD
  );
  if (highConfidenceCandidates.length !== 1) return null;

  const recommendedSource = highConfidenceCandidates[0].broker;
  if (recommendedSource === selectedSource) return null;

  const recommended = sources.find((source) => source.id === recommendedSource);
  if (!recommended) return null;

  return {
    recommendedSource: recommended.id,
    recommendedSourceLabel: recommended.label,
  };
}


export function shouldRouteQuickImportToSourceRecovery(
  analyse: TradeImportAnalyseResponse,
  setup: { broker: string; source: string },
  sources: readonly BrokerImportSourceOption[]
): boolean {
  if (setup.source === 'favorite-template') return false;
  return (
    resolveBrokerImportAnalyseRecovery(analyse, setup.broker, sources) !== null
  );
}
