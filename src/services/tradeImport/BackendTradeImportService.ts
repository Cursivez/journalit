import { requestUrl } from 'obsidian';
import { ApiClient } from '../backend/ApiClient';
import { clearPersistedBackendAuthSession } from '../backend/BackendAuthFailure';
import { ApiError } from '../../types/errors';
import { getPluginInstance } from '../../utils/pluginContext';
import type {
  TradeImportAnalyseRequest,
  TradeImportAnalyseResponse,
  TradeImportAccountInventoryItem,
  TradeImportAccountInventoryResponse,
  TradeImportAccountVaultMapping,
  TradeImportAccountVaultMappingRequest,
  TradeImportCapabilities,
  TradeImportCommitRequest,
  TradeImportCommitResponse,
  TradeImportDiagnostic,
  TradeImportDefaultAction,
  TradeImportFileType,
  TradeImportPreviewClassification,
  TradeImportPreviewItem,
  TradeImportManualMode,
  TradeImportProjectionAckRequest,
  TradeImportRestorableProjection,
  TradeImportRestorableProjectionRequest,
  TradeImportRestorableProjectionResponse,
  TradeImportPreviewRequest,
  TradeImportPreviewResponse,
  TradeImportPreviewTrade,
} from './types';

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;

const stringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

const executionArray = (value: unknown): TradeImportPreviewTrade['entries'] =>
  unknownArray(value).flatMap((item) => {
    const record = asRecord(item);
    if (
      !record ||
      typeof record.time !== 'string' ||
      typeof record.price !== 'number' ||
      typeof record.size !== 'number'
    ) {
      return [];
    }
    return [
      {
        time: record.time,
        price: record.price,
        size: record.size,
      },
    ];
  });

const numberValue = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const optionalString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value : null;

const unknownArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const stringMatrix = (value: unknown): string[][] =>
  unknownArray(value).filter(
    (row): row is string[] =>
      Array.isArray(row) && row.every((item) => typeof item === 'string')
  );

const diagnosticsArray = (value: unknown): TradeImportDiagnostic[] =>
  unknownArray(value).flatMap((item) => {
    const record = asRecord(item);
    if (
      !record ||
      typeof record.code !== 'string' ||
      typeof record.message !== 'string'
    ) {
      return [];
    }
    return [
      {
        severity:
          record.severity === 'info' ||
          record.severity === 'warning' ||
          record.severity === 'error'
            ? record.severity
            : undefined,
        kind: typeof record.kind === 'string' ? record.kind : undefined,
        code: record.code,
        message: record.message,
        row: typeof record.row === 'number' ? record.row : undefined,
        field: typeof record.field === 'string' ? record.field : undefined,
        count: typeof record.count === 'number' ? record.count : undefined,
      },
    ];
  });

const previewTradeStatus = (
  value: unknown
): TradeImportPreviewTrade['status'] | null => {
  switch (value) {
    case 'OPEN':
    case 'PARTIALLY_CLOSED':
      return 'OPEN';
    case 'CLOSED':
    case 'CANCELLED':
      return 'CLOSED';
    default:
      return null;
  }
};

const previewTradesArray = (value: unknown): TradeImportPreviewTrade[] =>
  unknownArray(value).flatMap((item) => {
    const record = asRecord(item);
    const status = previewTradeStatus(record?.status);
    if (
      !record ||
      typeof record.symbol !== 'string' ||
      record.symbol.trim() === '' ||
      (record.direction !== 'long' && record.direction !== 'short') ||
      typeof record.entryTime !== 'string' ||
      record.entryTime.trim() === '' ||
      typeof record.entryPrice !== 'number' ||
      !Number.isFinite(record.entryPrice) ||
      typeof record.quantity !== 'number' ||
      !Number.isFinite(record.quantity) ||
      !status ||
      typeof record.closeOnly !== 'boolean' ||
      typeof record.useDirectPnLInput !== 'boolean'
    ) {
      throw new Error('Invalid Trade Import preview trade response');
    }
    return [
      {
        sourceRows: unknownArray(record.sourceRows).filter(
          (row): row is number => typeof row === 'number'
        ),
        symbol: record.symbol,
        direction: record.direction,
        entryTime: record.entryTime,
        entryPrice: record.entryPrice,
        quantity: record.quantity,
        exitTime: typeof record.exitTime === 'string' ? record.exitTime : null,
        exitPrice:
          typeof record.exitPrice === 'number' ? record.exitPrice : null,
        status,
        closeOnly: record.closeOnly,
        useDirectPnLInput: record.useDirectPnLInput,
        directPnL:
          typeof record.directPnL === 'number' ? record.directPnL : null,
        profitLoss:
          typeof record.profitLoss === 'number' ? record.profitLoss : null,
        commission:
          typeof record.commission === 'number' ? record.commission : null,
        fees: typeof record.fees === 'number' ? record.fees : null,
        swap: typeof record.swap === 'number' ? record.swap : null,
        assetType:
          typeof record.assetType === 'string' ? record.assetType : null,
        orderId: typeof record.orderId === 'string' ? record.orderId : null,
        accountId:
          typeof record.accountId === 'string' ? record.accountId : null,
        currency: typeof record.currency === 'string' ? record.currency : null,
        brokerBaseCurrencyPnl:
          typeof record.brokerBaseCurrencyPnl === 'number'
            ? record.brokerBaseCurrencyPnl
            : null,
        brokerBaseCurrency:
          typeof record.brokerBaseCurrency === 'string'
            ? record.brokerBaseCurrency
            : null,
        brokerBaseCurrencyPnlSource:
          typeof record.brokerBaseCurrencyPnlSource === 'string'
            ? record.brokerBaseCurrencyPnlSource
            : null,
        notes: typeof record.notes === 'string' ? record.notes : null,
        thesis: typeof record.thesis === 'string' ? record.thesis : null,
        entries: executionArray(record.entries),
        exits: executionArray(record.exits),
        executionLedgerVersion:
          typeof record.executionLedgerVersion === 'number'
            ? record.executionLedgerVersion
            : null,
        executionIds: stringArray(record.executionIds),
        tags: stringArray(record.tags),
        images: stringArray(record.images),
        setup: stringArray(record.setup),
        mistake: stringArray(record.mistake),
        customFields: asRecord(record.customFields) ?? {},
        strikePrice:
          typeof record.strikePrice === 'number' ? record.strikePrice : null,
        expirationDate:
          typeof record.expirationDate === 'string'
            ? record.expirationDate
            : null,
        optionType:
          typeof record.optionType === 'string' ? record.optionType : null,
        contractSize:
          typeof record.contractSize === 'number' ? record.contractSize : null,
        dollarPerPoint:
          typeof record.dollarPerPoint === 'number'
            ? record.dollarPerPoint
            : null,
        tickSize: typeof record.tickSize === 'number' ? record.tickSize : null,
        tickValue:
          typeof record.tickValue === 'number' ? record.tickValue : null,
        lotSize: typeof record.lotSize === 'number' ? record.lotSize : null,
        pipValue: typeof record.pipValue === 'number' ? record.pipValue : null,
        pipSize: typeof record.pipSize === 'number' ? record.pipSize : null,
      },
    ];
  });

const classificationValue = (
  value: unknown
): TradeImportPreviewClassification => {
  switch (value) {
    case 'new':
    case 'exact_duplicate':
    case 'already_applied':
    case 'update_existing':
    case 'partial_update_existing':
    case 'likely_duplicate':
    case 'conflict':
    case 'failed_invalid_trade':
    case 'failed_no_open_match':
    case 'failed_multiple_open_matches':
    case 'failed_quantity_mismatch':
    case 'duplicate_in_import':
      return value;
    default:
      return 'failed_invalid_trade';
  }
};

const defaultActionValue = (value: unknown): TradeImportDefaultAction => {
  switch (value) {
    case 'create':
    case 'update':
    case 'skip':
    case 'manual_review':
    case 'blocked':
      return value;
    default:
      return 'blocked';
  }
};

const commitResultValue = (
  value: unknown
): TradeImportCommitResponse['itemResults'][number]['result'] | null => {
  switch (value) {
    case 'created':
    case 'updated':
    case 'skipped':
    case 'skipped_user':
    case 'skipped_duplicate':
    case 'blocked':
    case 'conflict':
      return value;
    default:
      return null;
  }
};

const commitItemResultsArray = (
  value: unknown
): TradeImportCommitResponse['itemResults'] => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error('Invalid Trade Import commit item results response');
  }
  return value.map((item) => {
    const itemRecord = asRecord(item);
    const result = commitResultValue(itemRecord?.result);
    if (
      !itemRecord ||
      typeof itemRecord.itemId !== 'string' ||
      itemRecord.itemId.trim() === '' ||
      !result
    ) {
      throw new Error('Invalid Trade Import commit item result response');
    }
    return {
      itemId: itemRecord.itemId,
      result,
      tradeId:
        typeof itemRecord.tradeId === 'string' ? itemRecord.tradeId : undefined,
      tradeVersion:
        typeof itemRecord.tradeVersion === 'number'
          ? itemRecord.tradeVersion
          : undefined,
      errorCode:
        typeof itemRecord.errorCode === 'string'
          ? itemRecord.errorCode
          : undefined,
      errorMessage:
        typeof itemRecord.errorMessage === 'string'
          ? itemRecord.errorMessage
          : undefined,
    };
  });
};

const previewItemsArray = (value: unknown): TradeImportPreviewItem[] => {
  if (!Array.isArray(value)) {
    throw new Error('Invalid Trade Import preview items response');
  }
  return value.map((item) => {
    const record = asRecord(item);
    if (
      !record ||
      typeof record.itemId !== 'string' ||
      record.itemId.trim() === ''
    ) {
      throw new Error('Invalid Trade Import preview item response');
    }
    const [previewTrade] = previewTradesArray([record.previewTrade]);
    return {
      itemId: record.itemId,
      itemIndex:
        typeof record.itemIndex === 'number' ? record.itemIndex : undefined,
      classification: classificationValue(record.classification),
      defaultAction: defaultActionValue(record.defaultAction),
      matchedTradeId:
        typeof record.matchedTradeId === 'string'
          ? record.matchedTradeId
          : null,
      decisionReasons: unknownArray(record.decisionReasons).flatMap(
        (reason) => {
          const reasonRecord = asRecord(reason);
          if (!reasonRecord || typeof reasonRecord.code !== 'string') return [];
          return [
            {
              code: reasonRecord.code,
              message:
                typeof reasonRecord.message === 'string'
                  ? reasonRecord.message
                  : undefined,
            },
          ];
        }
      ),
      identityCandidates: unknownArray(record.identityCandidates).flatMap(
        (candidate) => {
          const candidateRecord = asRecord(candidate);
          if (!candidateRecord || typeof candidateRecord.idType !== 'string')
            return [];
          return [
            {
              entityType:
                typeof candidateRecord.entityType === 'string'
                  ? candidateRecord.entityType
                  : undefined,
              idType: candidateRecord.idType,
              value:
                typeof candidateRecord.value === 'string'
                  ? candidateRecord.value
                  : undefined,
              hash:
                typeof candidateRecord.hash === 'string'
                  ? candidateRecord.hash
                  : undefined,
              strength:
                typeof candidateRecord.strength === 'string'
                  ? candidateRecord.strength
                  : undefined,
              cardinality:
                typeof candidateRecord.cardinality === 'string'
                  ? candidateRecord.cardinality
                  : undefined,
              scope:
                typeof candidateRecord.scope === 'string'
                  ? candidateRecord.scope
                  : undefined,
              source:
                typeof candidateRecord.source === 'string'
                  ? candidateRecord.source
                  : undefined,
            },
          ];
        }
      ),
      previewTrade,
    };
  });
};

const parseFileType = (value: unknown): TradeImportFileType =>
  value === 'xlsx' || value === 'xls' || value === 'html' ? value : 'csv';

const parseManualMode = (value: unknown): TradeImportManualMode | null =>
  value === 'price_based' || value === 'direct_pnl' ? value : null;

const columnAssignments = (
  value: unknown
):
  | Record<
      string,
      { tradeField: string; confidence: number; reasoning: string }
    >
  | undefined => {
  const record = asRecord(value);
  if (!record) return undefined;
  return Object.fromEntries(
    Object.entries(record).flatMap(([key, rawAssignment]) => {
      const assignment = asRecord(rawAssignment);
      if (!assignment || typeof assignment.tradeField !== 'string') return [];
      return [
        [
          key,
          {
            tradeField: assignment.tradeField,
            confidence: numberValue(assignment.confidence),
            reasoning:
              typeof assignment.reasoning === 'string'
                ? assignment.reasoning
                : '',
          },
        ],
      ];
    })
  );
};

const columnMappings = (
  value: unknown
): Record<string, string[]> | undefined => {
  const record = asRecord(value);
  if (!record) return undefined;
  return Object.fromEntries(
    Object.entries(record).map(([key, rawValues]) => [
      key,
      stringArray(rawValues),
    ])
  );
};

const ensureTradeImportCapabilities = (
  value: unknown
): TradeImportCapabilities => {
  const record = asRecord(value);
  if (
    !record ||
    record.schemaVersion !== 'trade-import-capabilities-v1' ||
    typeof record.apiVersion !== 'string'
  ) {
    throw new Error('Invalid Trade Import capabilities response');
  }
  const fileLimits = asRecord(record.fileLimits);
  const manualMapping = asRecord(record.manualMapping);
  return {
    apiVersion: record.apiVersion,
    schemaVersion: 'trade-import-capabilities-v1',
    fileLimits: {
      maxFileBytes: numberValue(fileLimits?.maxFileBytes),
      maxRows: numberValue(fileLimits?.maxRows),
      maxColumns: numberValue(fileLimits?.maxColumns),
      maxCells: numberValue(fileLimits?.maxCells),
      sampleRowLimit: numberValue(fileLimits?.sampleRowLimit),
    },
    fileTypes: unknownArray(record.fileTypes).flatMap((item) => {
      const fileType = asRecord(item);
      if (!fileType) return [];
      return [
        {
          id: parseFileType(fileType.id),
          extensions: stringArray(fileType.extensions),
          mimeTypes: stringArray(fileType.mimeTypes),
        },
      ];
    }),
    brokers: unknownArray(record.brokers).flatMap((item) => {
      const broker = asRecord(item);
      if (!broker || typeof broker.id !== 'string') return [];
      return [
        {
          id: broker.id,
          label: typeof broker.label === 'string' ? broker.label : broker.id,
          adapterVersion:
            typeof broker.adapterVersion === 'string'
              ? broker.adapterVersion
              : '',
          supportedFileTypes: unknownArray(broker.supportedFileTypes).map(
            parseFileType
          ),
          supportsAnalyse: broker.supportsAnalyse === true,
          supportsManualMapping: broker.supportsManualMapping === true,
          supportsAiMapping: broker.supportsAiMapping === true,
        },
      ];
    }),
    manualMapping: {
      supported: manualMapping?.supported === true,
      mappingVersion: numberValue(manualMapping?.mappingVersion),
      modes: unknownArray(manualMapping?.modes).flatMap((mode) => {
        const parsed = parseManualMode(mode);
        return parsed ? [parsed] : [];
      }),
    },
    diagnosticVersion:
      typeof record.diagnosticVersion === 'string'
        ? record.diagnosticVersion
        : '',
  };
};

const ensureAnalyseResponse = (value: unknown): TradeImportAnalyseResponse => {
  const record = asRecord(value);
  if (
    !record ||
    record.schemaVersion !== 'trade-import-analyse-v1' ||
    typeof record.importId !== 'string'
  ) {
    throw new Error('Invalid Trade Import analyse response');
  }
  return {
    schemaVersion: 'trade-import-analyse-v1',
    importId: record.importId,
    fileType: parseFileType(record.fileType),
    sheets: unknownArray(record.sheets).flatMap((item) => {
      const sheet = asRecord(item);
      if (!sheet || typeof sheet.name !== 'string') return [];
      return [
        {
          name: sheet.name,
          rowCountBucket:
            typeof sheet.rowCountBucket === 'string'
              ? sheet.rowCountBucket
              : '',
          columnCount: numberValue(sheet.columnCount),
          category: typeof sheet.category === 'string' ? sheet.category : '',
        },
      ];
    }),
    selectedSheet:
      typeof record.selectedSheet === 'string'
        ? record.selectedSheet
        : undefined,
    suggestedSheet:
      typeof record.suggestedSheet === 'string'
        ? record.suggestedSheet
        : undefined,
    headers: stringArray(record.headers),
    sampleRows: stringMatrix(record.sampleRows),
    suggestedHeaderRowIndex:
      typeof record.suggestedHeaderRowIndex === 'number'
        ? record.suggestedHeaderRowIndex
        : undefined,
    brokerCandidates: unknownArray(record.brokerCandidates).flatMap((item) => {
      const candidate = asRecord(item);
      if (!candidate || typeof candidate.broker !== 'string') return [];
      return [
        {
          broker: candidate.broker,
          confidence: numberValue(candidate.confidence),
          reasons: stringArray(candidate.reasons),
        },
      ];
    }),
    suggestedColumnAssignments: columnAssignments(
      record.suggestedColumnAssignments
    ),
    suggestedColumnMappings: columnMappings(record.suggestedColumnMappings),
    diagnostics: diagnosticsArray(record.diagnostics),
  };
};

const ensurePreviewResponse = (value: unknown): TradeImportPreviewResponse => {
  const record = asRecord(value);
  if (
    !record ||
    record.schemaVersion !== 'trade-import-preview-v1' ||
    typeof record.importId !== 'string'
  ) {
    throw new Error('Invalid Trade Import preview response');
  }
  const summary = asRecord(record.summary);
  return {
    importId: record.importId,
    correlationId:
      typeof record.correlationId === 'string' ? record.correlationId : '',
    previewRevision: numberValue(record.previewRevision),
    previewExpiresAt:
      typeof record.previewExpiresAt === 'string'
        ? record.previewExpiresAt
        : undefined,
    schemaVersion: 'trade-import-preview-v1',
    broker: typeof record.broker === 'string' ? record.broker : '',
    adapterVersion:
      typeof record.adapterVersion === 'string' ? record.adapterVersion : '',
    fileType: parseFileType(record.fileType),
    summary: {
      sourceRowCount: numberValue(summary?.sourceRowCount),
      previewTradeCount: numberValue(summary?.previewTradeCount),
      duplicateInFileCount: numberValue(summary?.duplicateInFileCount),
      failedRowCount: numberValue(summary?.failedRowCount),
      skippedIncompleteCount: numberValue(summary?.skippedIncompleteCount),
    },
    items: previewItemsArray(record.items),
    diagnostics: diagnosticsArray(record.diagnostics),
  };
};

const ensureCommitResponse = (value: unknown): TradeImportCommitResponse => {
  const record = asRecord(value);
  if (!record || typeof record.commitId !== 'string') {
    throw new Error('Invalid Trade Import commit response');
  }
  return {
    commitId: record.commitId,
    importId: typeof record.importId === 'string' ? record.importId : '',
    correlationId:
      typeof record.correlationId === 'string' ? record.correlationId : '',
    status: typeof record.status === 'string' ? record.status : '',
    itemResults: commitItemResultsArray(record.itemResults),
    trades: unknownArray(record.trades).flatMap((trade) => {
      const tradeRecord = asRecord(trade);
      if (
        !tradeRecord ||
        typeof tradeRecord.id !== 'string' ||
        typeof tradeRecord.version !== 'number' ||
        !Number.isFinite(tradeRecord.version) ||
        tradeRecord.version <= 0
      ) {
        throw new Error('Invalid Trade Import commit trade response');
      }
      const [previewTrade] =
        tradeRecord.previewTrade === undefined ||
        tradeRecord.previewTrade === null
          ? []
          : previewTradesArray([tradeRecord.previewTrade]);
      return [
        {
          id: tradeRecord.id,
          version: tradeRecord.version,
          symbol:
            typeof tradeRecord.symbol === 'string' ? tradeRecord.symbol : '',
          direction: tradeRecord.direction === 'short' ? 'short' : 'long',
          status: tradeRecord.status === 'open' ? 'open' : 'closed',
          accountId:
            typeof tradeRecord.accountId === 'string'
              ? tradeRecord.accountId
              : null,
          importId:
            typeof tradeRecord.importId === 'string'
              ? tradeRecord.importId
              : '',
          previewTrade,
        },
      ];
    }),
  };
};

const projectionStatus = (
  value: unknown
): TradeImportRestorableProjectionResponse['projections'][number]['projectionStatus'] => {
  switch (value) {
    case 'missing':
    case 'local_deleted':
    case 'other_vault':
    case 'needs_rewrite':
    case 'synced':
    case 'failed':
    case 'conflict':
    case 'pending':
      return value;
    default:
      return 'missing';
  }
};

function missingProjectionStatus(record: Record<string, unknown>) {
  const projectionState = asRecord(record.projectionState);
  if (projectionState?.stale === true) {
    return 'needs_rewrite';
  }
  return projectionStatus(projectionState?.syncStatus);
}

function normalizeMissingProjectionItem(
  record: Record<string, unknown>
): TradeImportRestorableProjection {
  const projectionTrade = asRecord(record.projectionTrade);
  const previewTradeValue = projectionTrade?.previewTrade;
  const [previewTrade] = previewTradesArray([previewTradeValue]);
  const summary = asRecord(record.summary);
  if (
    typeof record.tradeId !== 'string' ||
    typeof record.backendTradeVersion !== 'number'
  ) {
    throw new Error('Invalid Trade Import restorable projection response');
  }
  return {
    id: record.tradeId,
    version: record.backendTradeVersion,
    symbol:
      typeof record.symbol === 'string'
        ? record.symbol
        : typeof summary?.symbol === 'string'
          ? summary.symbol
          : previewTrade.symbol,
    direction: previewTrade.direction === 'short' ? 'short' : 'long',
    status: previewTrade.status === 'OPEN' ? 'open' : 'closed',
    accountName:
      typeof record.accountDisplayName === 'string'
        ? record.accountDisplayName
        : null,
    accountId: typeof record.accountId === 'string' ? record.accountId : null,
    importId: typeof record.importId === 'string' ? record.importId : '',
    correlationId:
      typeof record.correlationId === 'string'
        ? record.correlationId
        : undefined,
    commitId: typeof record.commitId === 'string' ? record.commitId : undefined,
    broker: typeof record.broker === 'string' ? record.broker : null,
    importedAt:
      typeof record.importedAt === 'string' ? record.importedAt : null,
    projectionStatus: missingProjectionStatus(record),
    previewTrade,
  };
}

const ensureRestorableProjectionResponse = (
  value: unknown
): TradeImportRestorableProjectionResponse => {
  const record = asRecord(value);
  if (!record || typeof record.vaultId !== 'string') {
    throw new Error('Invalid Trade Import restorable projections response');
  }
  return {
    schemaVersion: 'trade-import-restorable-projections-v1',
    vaultId: record.vaultId,
    nextCursor: optionalString(record.nextCursor),
    projections: unknownArray(record.projections ?? record.items).map(
      (projection) => {
        const projectionRecord = asRecord(projection);
        if (projectionRecord && 'projectionTrade' in projectionRecord) {
          return normalizeMissingProjectionItem(projectionRecord);
        }
        if (
          !projectionRecord ||
          typeof projectionRecord.id !== 'string' ||
          typeof projectionRecord.version !== 'number'
        ) {
          throw new Error(
            'Invalid Trade Import restorable projection response'
          );
        }
        const [previewTrade] = previewTradesArray([
          projectionRecord.previewTrade,
        ]);
        return {
          id: projectionRecord.id,
          version: projectionRecord.version,
          symbol:
            typeof projectionRecord.symbol === 'string'
              ? projectionRecord.symbol
              : previewTrade.symbol,
          direction: projectionRecord.direction === 'short' ? 'short' : 'long',
          status: projectionRecord.status === 'open' ? 'open' : 'closed',
          accountName:
            typeof projectionRecord.accountName === 'string'
              ? projectionRecord.accountName
              : null,
          accountId:
            typeof projectionRecord.accountId === 'string'
              ? projectionRecord.accountId
              : null,
          importId:
            typeof projectionRecord.importId === 'string'
              ? projectionRecord.importId
              : '',
          correlationId:
            typeof projectionRecord.correlationId === 'string'
              ? projectionRecord.correlationId
              : undefined,
          commitId:
            typeof projectionRecord.commitId === 'string'
              ? projectionRecord.commitId
              : undefined,
          broker:
            typeof projectionRecord.broker === 'string'
              ? projectionRecord.broker
              : null,
          importedAt:
            typeof projectionRecord.importedAt === 'string'
              ? projectionRecord.importedAt
              : null,
          projectionStatus: projectionStatus(projectionRecord.projectionStatus),
          previewTrade,
        };
      }
    ),
  };
};

function normalizeAccountVaultMapping(
  value: unknown
): TradeImportAccountVaultMapping | null {
  const record = asRecord(value);
  if (!record || typeof record.vaultId !== 'string') return null;
  return {
    vaultId: record.vaultId,
    localAccountId: optionalString(record.localAccountId),
    localAccountName: optionalString(record.localAccountName),
    mappingStatus: 'mapped',
    lastSyncedAt: optionalString(record.lastSyncedAt),
    updatedAt: optionalString(record.updatedAt),
  };
}

function normalizeAccountInventoryItem(
  value: unknown
): TradeImportAccountInventoryItem {
  const record = asRecord(value);
  if (
    !record ||
    typeof record.accountId !== 'string' ||
    typeof record.broker !== 'string'
  ) {
    throw new Error('Invalid Trade Import account inventory response');
  }
  return {
    accountId: record.accountId,
    broker: record.broker,
    displayName: optionalString(record.displayName) ?? record.broker,
    tradeCount: numberValue(record.tradeCount),
    missingCount: numberValue(record.missingCount),
    localDeletedCount: numberValue(record.localDeletedCount),
    failedCount: numberValue(record.failedCount),
    needsRewriteCount: numberValue(record.needsRewriteCount),
    staleCount: numberValue(record.staleCount),
    conflictCount: numberValue(record.conflictCount),
    pendingCount: numberValue(record.pendingCount),
    syncedCount: numberValue(record.syncedCount),
    restorableCount: numberValue(record.restorableCount),
    lastImportedAt: optionalString(record.lastImportedAt),
    mapping: normalizeAccountVaultMapping(record.mapping),
  };
}

const ensureAccountInventoryResponse = (
  value: unknown
): TradeImportAccountInventoryResponse => {
  const record = asRecord(value);
  if (!record || typeof record.vaultId !== 'string') {
    throw new Error('Invalid Trade Import account inventory response');
  }
  return {
    schemaVersion: 'trade-import-accounts-v1',
    vaultId: record.vaultId,
    accounts: unknownArray(record.accounts).map(normalizeAccountInventoryItem),
  };
};

function restorableProjectionQuery(
  request: TradeImportRestorableProjectionRequest
): string {
  const params = new URLSearchParams();
  params.set('vaultId', request.vaultId);
  for (const [key, value] of Object.entries(request)) {
    if (key === 'vaultId' || value === undefined || value === null) continue;
    params.set(key, String(value));
  }
  return params.toString();
}

function accountInventoryQuery(vaultId: string): string {
  const params = new URLSearchParams();
  params.set('vaultId', vaultId);
  return params.toString();
}

function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handleTradeImportHttpError(
  status: number,
  requestAuthToken: string | null
): void {
  if (status === 402) {
    window.dispatchEvent(
      new CustomEvent('journalit:premium-required', {
        detail: { operation: 'Trade Import' },
      })
    );
    return;
  }

  if (status === 401) {
    try {
      const plugin = getPluginInstance();
      if (
        !plugin?.settings.backendIntegration ||
        !requestAuthToken ||
        requestAuthToken !== ApiClient.getAuthToken()
      ) {
        return;
      }

      ApiClient.handleAuthenticationFailure({
        operation: 'Trade Import',
        statusCode: status,
      });
      void clearPersistedBackendAuthSession(plugin, requestAuthToken).catch(
        () => undefined
      );
    } catch {
      // intentional
    }
  }
}

async function postMultipart(
  path: string,
  file: File,
  request: unknown
): Promise<unknown> {
  const form = new FormData();
  form.append('file', file);
  form.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' })
  );

  return new Promise<unknown>((resolve, reject) => {
    const requestAuthToken = ApiClient.getAuthToken();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', ApiClient.buildUrl(path));
    for (const [key, value] of Object.entries(authHeaders(requestAuthToken)))
      xhr.setRequestHeader(key, value);
    xhr.onload = () => {
      let responseBody: unknown = null;
      try {
        responseBody = xhr.responseText
          ? (JSON.parse(xhr.responseText) as unknown)
          : null;
      } catch {
        responseBody = xhr.responseText || null;
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        handleTradeImportHttpError(xhr.status, requestAuthToken);
        reject(
          new ApiError(
            `Trade Import request failed (${xhr.status})`,
            xhr.status,
            {
              operation: `Trade Import ${path}`,
              endpoint: path,
              statusCode: xhr.status,
              responseBody,
            }
          )
        );
        return;
      }
      resolve(responseBody);
    };
    xhr.onerror = () =>
      reject(new Error('Trade Import network request failed'));
    xhr.send(form);
  });
}

export class BackendTradeImportService {
  async getCapabilities(): Promise<TradeImportCapabilities> {
    const requestAuthToken = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl('/api/v1/trade-import/capabilities'),
      method: 'GET',
      headers: authHeaders(requestAuthToken),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeImportHttpError(response.status, requestAuthToken);
      throw new ApiError(
        'Trade Import capabilities unavailable',
        response.status
      );
    }
    return ensureTradeImportCapabilities(response.json);
  }

  analyse(
    file: File,
    request: TradeImportAnalyseRequest
  ): Promise<TradeImportAnalyseResponse> {
    return postMultipart('/api/v1/trade-import/analyse', file, request).then(
      ensureAnalyseResponse
    );
  }

  preview(
    file: File,
    request: TradeImportPreviewRequest
  ): Promise<TradeImportPreviewResponse> {
    return postMultipart('/api/v1/trade-import/preview', file, request).then(
      ensurePreviewResponse
    );
  }

  async commit(
    importId: string,
    request: TradeImportCommitRequest,
    idempotencyKey: string
  ): Promise<TradeImportCommitResponse> {
    const requestAuthToken = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(`/api/v1/trade-import/${importId}/commit`),
      method: 'POST',
      headers: {
        ...authHeaders(requestAuthToken),
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(request),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeImportHttpError(response.status, requestAuthToken);
      throw new ApiError(
        `Trade Import commit failed (${response.status})`,
        response.status
      );
    }
    return ensureCommitResponse(response.json);
  }

  async projectionAck(request: TradeImportProjectionAckRequest): Promise<void> {
    const requestAuthToken = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl('/api/v1/trade-import/projection-ack'),
      method: 'POST',
      headers: {
        ...authHeaders(requestAuthToken),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeImportHttpError(response.status, requestAuthToken);
      throw new ApiError(
        `Trade Import projection acknowledgement failed (${response.status})`,
        response.status
      );
    }
  }

  async getRestorableProjections(
    request: TradeImportRestorableProjectionRequest
  ): Promise<TradeImportRestorableProjectionResponse> {
    const requestAuthToken = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(
        `/api/v1/trade-import/projections/missing?${restorableProjectionQuery(request)}`
      ),
      method: 'GET',
      headers: authHeaders(requestAuthToken),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeImportHttpError(response.status, requestAuthToken);
      throw new ApiError(
        `Trade Import restorable projections unavailable (${response.status})`,
        response.status
      );
    }
    return ensureRestorableProjectionResponse(response.json);
  }

  async getAccountInventory(
    vaultId: string
  ): Promise<TradeImportAccountInventoryResponse> {
    const requestAuthToken = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(
        `/api/v1/trade-import/accounts?${accountInventoryQuery(vaultId)}`
      ),
      method: 'GET',
      headers: authHeaders(requestAuthToken),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeImportHttpError(response.status, requestAuthToken);
      throw new ApiError(
        `Trade Import accounts unavailable (${response.status})`,
        response.status
      );
    }
    return ensureAccountInventoryResponse(response.json);
  }

  async updateAccountVaultMapping(
    accountId: string,
    request: TradeImportAccountVaultMappingRequest
  ): Promise<TradeImportAccountVaultMapping> {
    const requestAuthToken = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(
        `/api/v1/trade-import/accounts/${encodeURIComponent(accountId)}/vault-mapping`
      ),
      method: 'PUT',
      headers: {
        ...authHeaders(requestAuthToken),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeImportHttpError(response.status, requestAuthToken);
      throw new ApiError(
        `Trade Import account mapping failed (${response.status})`,
        response.status
      );
    }
    const responseRecord = asRecord(response.json);
    return (
      normalizeAccountVaultMapping(
        responseRecord?.mapping ?? response.json
      ) ?? {
        vaultId: request.vaultId,
        localAccountId: request.localAccountId,
        localAccountName: request.localAccountName,
        mappingStatus: 'mapped',
      }
    );
  }
}
