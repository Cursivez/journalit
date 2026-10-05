import type { ComponentProps } from 'react';

import {
  BYBIT_HEADER_MISMATCH_DIAGNOSTIC_CODE,
  MISSING_COLUMN_DIAGNOSTIC_CODE,
  UNSUPPORTED_RITHMIC_ORDER_HISTORY_DIAGNOSTIC_CODE,
  UNSUPPORTED_METATRADER_STATEMENT_DIAGNOSTIC_CODE,
  UNSUPPORTED_TRADOVATE_PERFORMANCE_REPORT_DIAGNOSTIC_CODE,
  type TradeImportAnalyseResponse,
  type TradeImportDiagnostic,
  type TradeImportPreviewResponse,
} from '../../services/tradeImport/types';
import type { TranslationKey } from '../../lang/locale/en';
import { t } from '../../lang/helpers';
import type { BrokerImportRecoveryNotice } from './BrokerImportRecoveryNotice';
import {
  BROKER_GUIDE_URLS,
  METATRADER_BROKER_GUIDE_URL,
  TRADOVATE_BROKER_GUIDE_URL,
  TRADINGVIEW_BROKER_GUIDE_URL,
} from './brokerGuides';

type RecoveryResponse = TradeImportAnalyseResponse | TradeImportPreviewResponse;

export interface BrokerImportRecovery {
  diagnosticCodesToSuppress: ReadonlySet<string>;
  matches: (response: RecoveryResponse) => boolean;
  
  getNoticeProps: (
    diagnostics: readonly TradeImportDiagnostic[]
  ) => Pick<
    ComponentProps<typeof BrokerImportRecoveryNotice>,
    'title' | 'message' | 'actionLabel' | 'guideLabel' | 'guideUrl'
  >;
  showQuickImportAnotherFileAction?: boolean;
  
  supportsAnalyse?: boolean;
  canChangeSource?: boolean;
  canReviewHeader?: boolean;
  anotherFileLabel?: TranslationKey;
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
  getNoticeProps: BrokerImportRecovery['getNoticeProps']
): BrokerImportRecovery {
  return {
    diagnosticCodesToSuppress: new Set([diagnosticCode]),
    matches: (preview) =>
      preview.diagnostics.some(
        (diagnostic) => diagnostic.code === diagnosticCode
      ),
    getNoticeProps,
  };
}

const BROKER_IMPORT_RECOVERIES: BrokerImportRecovery[] = [
  {
    ...diagnosticCodeRecovery(
      BYBIT_HEADER_MISMATCH_DIAGNOSTIC_CODE,
      (diagnostics) => {
        const missingColumns = diagnostics.find(
          (diagnostic) =>
            diagnostic.code === BYBIT_HEADER_MISMATCH_DIAGNOSTIC_CODE
        )?.missingColumns;
        const guidance = t('trade-import.recovery.bybit-header.message', {
          manualSource: t('trade-import.source.manual.tile'),
        });
        return {
          title: t('trade-import.recovery.bybit-header.title'),
          message: missingColumns?.length
            ? `${guidance} ${t('trade-import.recovery.bybit-header.columns', {
                columns: missingColumns.join(', '),
              })}`
            : guidance,
          guideLabel: t('trade-import.source.guide'),
          guideUrl: BROKER_GUIDE_URLS.BYBIT,
        };
      }
    ),
    supportsAnalyse: true,
    canReviewHeader: true,
    showQuickImportAnotherFileAction: true,
  },
  {
    ...diagnosticCodeRecovery(
      UNSUPPORTED_RITHMIC_ORDER_HISTORY_DIAGNOSTIC_CODE,
      () => ({
        title: t('trade-import.recovery.rithmic-order-history.title'),
        message: t('trade-import.recovery.rithmic-order-history.message'),
        actionLabel: t('trade-import.source.change-action'),
      })
    ),
    supportsAnalyse: true,
    canChangeSource: true,
    showQuickImportAnotherFileAction: true,
    anotherFileLabel: 'trade-import.recovery.rithmic-order-history.choose-file',
  },
  diagnosticCodeRecovery(
    UNSUPPORTED_TRADOVATE_PERFORMANCE_REPORT_DIAGNOSTIC_CODE,
    () => ({
      title: t('trade-import.preview.tradovate-performance.title'),
      message: t('trade-import.preview.tradovate-performance.message'),
      guideLabel: t('trade-import.preview.tradovate-performance.guide'),
      guideUrl: TRADOVATE_BROKER_GUIDE_URL,
    })
  ),
  diagnosticCodeRecovery(
    UNSUPPORTED_METATRADER_STATEMENT_DIAGNOSTIC_CODE,
    () => ({
      title: t('trade-import.preview.metatrader-statement.title'),
      message: t('trade-import.preview.metatrader-statement.message'),
      guideLabel: t('trade-import.preview.metatrader-statement.guide'),
      guideUrl: METATRADER_BROKER_GUIDE_URL,
    })
  ),
  {
    diagnosticCodesToSuppress: new Set(),
    matches: (preview) =>
      preview.schemaVersion === 'trade-import-preview-v1' &&
      preview.broker === 'TRADINGVIEW' &&
      preview.summary.previewTradeCount === 0 &&
      preview.items.length === 0 &&
      preview.diagnostics.some(
        (diagnostic) => diagnostic.code === MISSING_COLUMN_DIAGNOSTIC_CODE
      ),
    getNoticeProps: () => ({
      title: t('trade-import.preview.tradingview-export.title'),
      message: t('trade-import.preview.tradingview-export.message'),
      guideLabel: t('trade-import.preview.tradingview-export.guide'),
      guideUrl: TRADINGVIEW_BROKER_GUIDE_URL,
    }),
    
    showQuickImportAnotherFileAction: true,
  },
];

export function resolveBrokerImportRecovery(
  response: RecoveryResponse | null
): BrokerImportRecovery | null {
  if (
    !response ||
    (response.schemaVersion === 'trade-import-preview-v1' &&
      response.outcome !== 'failed')
  ) {
    return null;
  }
  for (const recovery of BROKER_IMPORT_RECOVERIES) {
    if (
      response.schemaVersion === 'trade-import-analyse-v1' &&
      !recovery.supportsAnalyse
    )
      continue;
    if (recovery.matches(response)) {
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
