import {
  requestUrl,
  type RequestUrlParam,
  type RequestUrlResponse,
} from 'obsidian';
import {
  ApiClient,
  AuthenticationRefreshUnavailableError,
} from '../backend/ApiClient';
import { clearPersistedBackendAuthSession } from '../backend/BackendAuthFailure';
import { ApiError } from '../../types/errors';
import { DemoSyncGate } from '../../demo/DemoSyncGate';
import { getPluginInstance } from '../../utils/pluginContext';
import type {
  TradeImportAnalyseRequest,
  TradeImportAnalyseResponse,
  TradeImportCapabilities,
  TradeImportCommitRequest,
  TradeImportCommitResponse,
  TradeImportDiagnostic,
  TradeImportDefaultAction,
  TradeImportFileType,
  TradeImportPreviewClassification,
  TradeImportPreviewItem,
  TradeImportPreviewOutcome,
  TradeImportManualMode,
  TradeImportPreviewRequest,
  TradeImportPreviewResponse,
  TradeImportPreviewTrade,
} from './types';

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;

const commitAccountIdentity = (value: unknown): 'broker' | 'name' => {
  if (value === undefined || value === null) return 'name';
  if (value === 'broker' || value === 'name') return value;
  throw new Error('Invalid Trade Import commit trade response');
};

const stringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

const nullableString = (value: unknown, field: string): string | null => {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') {
    throw new Error(`Invalid Trade Import preview ${field} response`);
  }
  return value;
};

const nullableTimestamp = (value: unknown, field: string): string | null => {
  const timestamp = nullableString(value, field);
  if (timestamp !== null && !Number.isFinite(Date.parse(timestamp))) {
    throw new Error(`Invalid Trade Import preview ${field} response`);
  }
  return timestamp;
};

const nullableNumber = (value: unknown, field: string): number | null => {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid Trade Import preview ${field} response`);
  }
  return value;
};

const nullableMinimumNumber = (
  value: unknown,
  field: string,
  minimum: number
): number | null => {
  const number = nullableNumber(value, field);
  if (number !== null && number < minimum) {
    throw new Error(`Invalid Trade Import preview ${field} response`);
  }
  return number;
};

const nullablePositiveNumber = (
  value: unknown,
  field: string
): number | null => {
  const number = nullableNumber(value, field);
  if (number !== null && number <= 0) {
    throw new Error(`Invalid Trade Import preview ${field} response`);
  }
  return number;
};

const executionArray = (
  value: unknown,
  field: 'entries' | 'exits'
): TradeImportPreviewTrade['entries'] => {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new Error(`Invalid Trade Import preview ${field} response`);
  }
  return value.map((item) => {
    const record = asRecord(item);
    if (
      !record ||
      typeof record.time !== 'string' ||
      !Number.isFinite(Date.parse(record.time)) ||
      typeof record.price !== 'number' ||
      !Number.isFinite(record.price) ||
      typeof record.size !== 'number' ||
      !Number.isFinite(record.size) ||
      record.size <= 0
    ) {
      throw new Error(`Invalid Trade Import preview ${field} response`);
    }
    return {
      time: record.time,
      price: record.price,
      size: record.size,
    };
  });
};

function validateCommittedPreviewTrade(record: Record<string, unknown>): void {
  if (
    typeof record.quantity === 'number' &&
    Number.isFinite(record.quantity) &&
    record.quantity < 0
  ) {
    throw new Error('Invalid Trade Import commit quantity response');
  }
  const optionalNumberFields = [
    'exitPrice',
    'openQuantity',
    'closedQuantity',
    'directPnL',
    'profitLoss',
    'grossProfitLoss',
    'commission',
    'fees',
    'swap',
    'brokerBaseCurrencyPnl',
    'executionLedgerVersion',
    'strikePrice',
    'contractSize',
    'dollarPerPoint',
    'tickSize',
    'tickValue',
    'lotSize',
    'pipValue',
    'pipSize',
    'leverageRatio',
  ];
  for (const field of optionalNumberFields) {
    const value = record[field];
    if (
      value !== undefined &&
      value !== null &&
      (typeof value !== 'number' || !Number.isFinite(value))
    ) {
      throw new Error(`Invalid Trade Import commit ${field} response`);
    }
    if (
      (field === 'openQuantity' ||
        field === 'closedQuantity' ||
        field === 'lotSize') &&
      typeof value === 'number' &&
      value < 0
    ) {
      throw new Error(`Invalid Trade Import commit ${field} response`);
    }
    if (field === 'contractSize' && typeof value === 'number' && value <= 0) {
      throw new Error('Invalid Trade Import commit contractSize response');
    }
    if (field === 'strikePrice' && typeof value === 'number' && value <= 0) {
      throw new Error('Invalid Trade Import commit strikePrice response');
    }
    if (
      field === 'dollarPerPoint' &&
      typeof value === 'number' &&
      value < 0.01
    ) {
      throw new Error('Invalid Trade Import commit dollarPerPoint response');
    }
    if (field === 'leverageRatio' && typeof value === 'number' && value <= 0) {
      throw new Error('Invalid Trade Import commit leverageRatio response');
    }
  }

  const optionalStringFields = [
    'assetType',
    'exchange',
    'underlyingSymbol',
    'brokerContract',
    'orderId',
    'accountId',
    'currency',
    'brokerBaseCurrency',
    'brokerBaseCurrencyPnlSource',
    'brokerComment',
    'notes',
    'thesis',
    'optionType',
    'currencyPair',
    'tradingPair',
    'cryptoExchange',
  ];
  for (const field of optionalStringFields) {
    const value = record[field];
    if (value !== undefined && value !== null && typeof value !== 'string') {
      throw new Error(`Invalid Trade Import commit ${field} response`);
    }
  }

  for (const field of [
    'entryTime',
    'exitTime',
    'expirationDate',
    'lastBrokerSyncAt',
  ]) {
    const value = record[field];
    if (
      value !== undefined &&
      value !== null &&
      (typeof value !== 'string' || !Number.isFinite(Date.parse(value)))
    ) {
      throw new Error(`Invalid Trade Import commit ${field} response`);
    }
  }

  const sourceRows = record.sourceRows;
  if (
    sourceRows !== undefined &&
    sourceRows !== null &&
    (!Array.isArray(sourceRows) ||
      sourceRows.some(
        (row) => typeof row !== 'number' || !Number.isFinite(row)
      ))
  ) {
    throw new Error('Invalid Trade Import commit sourceRows response');
  }

  for (const field of ['executionIds', 'tags', 'images', 'setup', 'mistake']) {
    const value = record[field];
    if (
      value !== undefined &&
      value !== null &&
      (!Array.isArray(value) || value.some((item) => typeof item !== 'string'))
    ) {
      throw new Error(`Invalid Trade Import commit ${field} response`);
    }
  }

  for (const field of ['entries', 'exits']) {
    const value = record[field];
    if (value === undefined || value === null) continue;
    if (!Array.isArray(value)) {
      throw new Error(`Invalid Trade Import commit ${field} response`);
    }
    for (const item of value) {
      const execution = asRecord(item);
      if (
        !execution ||
        typeof execution.time !== 'string' ||
        !Number.isFinite(Date.parse(execution.time)) ||
        typeof execution.price !== 'number' ||
        !Number.isFinite(execution.price) ||
        typeof execution.size !== 'number' ||
        !Number.isFinite(execution.size) ||
        execution.size <= 0
      ) {
        throw new Error(`Invalid Trade Import commit ${field} response`);
      }
    }
  }
}

const numberValue = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const requiredNonNegativeInteger = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error('Invalid Trade Import capabilities response');
  }
  return value;
};

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
      return 'OPEN';
    case 'PARTIALLY_CLOSED':
      return 'PARTIALLY_CLOSED';
    case 'CLOSED':
      return 'CLOSED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return null;
  }
};

const restorableTradeStatus = (
  value: unknown,
  fallback: TradeImportPreviewTrade['status'] = 'CLOSED'
): 'open' | 'partially_closed' | 'closed' | 'cancelled' => {
  switch (value) {
    case 'open':
    case 'OPEN':
      return 'open';
    case 'partially_closed':
    case 'PARTIALLY_CLOSED':
      return 'partially_closed';
    case 'closed':
    case 'CLOSED':
      return 'closed';
    case 'cancelled':
    case 'CANCELLED':
      return 'cancelled';
    default:
      return fallback === 'OPEN'
        ? 'open'
        : fallback === 'PARTIALLY_CLOSED'
          ? 'partially_closed'
          : fallback === 'CANCELLED'
            ? 'cancelled'
            : 'closed';
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
      !Number.isFinite(Date.parse(record.entryTime)) ||
      typeof record.entryPrice !== 'number' ||
      !Number.isFinite(record.entryPrice) ||
      typeof record.quantity !== 'number' ||
      !Number.isFinite(record.quantity) ||
      record.quantity < 0 ||
      (record.openQuantity !== undefined &&
        record.openQuantity !== null &&
        (typeof record.openQuantity !== 'number' ||
          !Number.isFinite(record.openQuantity) ||
          record.openQuantity < 0)) ||
      (record.closedQuantity !== undefined &&
        record.closedQuantity !== null &&
        (typeof record.closedQuantity !== 'number' ||
          !Number.isFinite(record.closedQuantity) ||
          record.closedQuantity < 0)) ||
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
        openQuantity:
          typeof record.openQuantity === 'number' &&
          Number.isFinite(record.openQuantity)
            ? record.openQuantity
            : undefined,
        closedQuantity:
          typeof record.closedQuantity === 'number' &&
          Number.isFinite(record.closedQuantity)
            ? record.closedQuantity
            : undefined,
        exitTime: nullableTimestamp(record.exitTime, 'exitTime'),
        exitPrice:
          typeof record.exitPrice === 'number' ? record.exitPrice : null,
        status,
        closeOnly: record.closeOnly,
        useDirectPnLInput: record.useDirectPnLInput,
        directPnL:
          typeof record.directPnL === 'number' ? record.directPnL : null,
        profitLoss:
          typeof record.profitLoss === 'number' ? record.profitLoss : null,
        grossProfitLoss:
          typeof record.grossProfitLoss === 'number'
            ? record.grossProfitLoss
            : record.useDirectPnLInput === true &&
                typeof record.profitLoss === 'number'
              ? record.profitLoss +
                Math.abs(
                  typeof record.commission === 'number' ? record.commission : 0
                ) +
                Math.abs(typeof record.fees === 'number' ? record.fees : 0) -
                (typeof record.swap === 'number' ? record.swap : 0)
              : null,
        commission:
          typeof record.commission === 'number' ? record.commission : null,
        fees: typeof record.fees === 'number' ? record.fees : null,
        swap: typeof record.swap === 'number' ? record.swap : null,
        assetType:
          typeof record.assetType === 'string' ? record.assetType : null,
        exchange: nullableString(record.exchange, 'exchange'),
        underlyingSymbol: nullableString(
          record.underlyingSymbol,
          'underlyingSymbol'
        ),
        brokerContract: nullableString(record.brokerContract, 'brokerContract'),
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
        brokerComment: nullableString(record.brokerComment, 'brokerComment'),
        notes: typeof record.notes === 'string' ? record.notes : null,
        thesis: typeof record.thesis === 'string' ? record.thesis : null,
        entries: executionArray(record.entries, 'entries'),
        exits: executionArray(record.exits, 'exits'),
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
        strikePrice: nullablePositiveNumber(record.strikePrice, 'strikePrice'),
        expirationDate: nullableTimestamp(
          record.expirationDate,
          'expirationDate'
        ),
        optionType:
          typeof record.optionType === 'string' ? record.optionType : null,
        contractSize: nullablePositiveNumber(
          record.contractSize,
          'contractSize'
        ),
        dollarPerPoint: nullableMinimumNumber(
          record.dollarPerPoint,
          'dollarPerPoint',
          0.01
        ),
        tickSize: typeof record.tickSize === 'number' ? record.tickSize : null,
        tickValue:
          typeof record.tickValue === 'number' ? record.tickValue : null,
        lotSize: nullableMinimumNumber(record.lotSize, 'lotSize', 0),
        pipValue: typeof record.pipValue === 'number' ? record.pipValue : null,
        pipSize: typeof record.pipSize === 'number' ? record.pipSize : null,
        currencyPair: nullableString(record.currencyPair, 'currencyPair'),
        tradingPair: nullableString(record.tradingPair, 'tradingPair'),
        cryptoExchange: nullableString(record.cryptoExchange, 'cryptoExchange'),
        leverageRatio: nullablePositiveNumber(
          record.leverageRatio,
          'leverageRatio'
        ),
        lastBrokerSyncAt: nullableTimestamp(
          record.lastBrokerSyncAt,
          'lastBrokerSyncAt'
        ),
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

const previewItemsArray = (
  value: unknown,
  outcome: TradeImportPreviewOutcome
): TradeImportPreviewItem[] => {
  if ((value === undefined || value === null) && outcome === 'failed') {
    return [];
  }
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
  const freePreviewLimits = asRecord(record.freePreviewLimits);
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
    freePreviewLimits: freePreviewLimits
      ? {
          requestsPerHour: requiredNonNegativeInteger(
            freePreviewLimits.requestsPerHour
          ),
          diagnosticRetentionMinutes: requiredNonNegativeInteger(
            freePreviewLimits.diagnosticRetentionMinutes
          ),
          storedPreviewRetentionHours: requiredNonNegativeInteger(
            freePreviewLimits.storedPreviewRetentionHours
          ),
          maxStoredPreviewItems: requiredNonNegativeInteger(
            freePreviewLimits.maxStoredPreviewItems
          ),
        }
      : undefined,
    diagnosticVersion:
      typeof record.diagnosticVersion === 'string'
        ? record.diagnosticVersion
        : '',
  };
};

export const parseTradeImportAnalyseResponse = (
  value: unknown
): TradeImportAnalyseResponse => {
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
      if (
        typeof candidate.confidence !== 'number' ||
        !Number.isFinite(candidate.confidence) ||
        candidate.confidence < 0 ||
        candidate.confidence > 1
      ) {
        throw new Error('Invalid Trade Import analyse response');
      }
      return [
        {
          broker: candidate.broker,
          confidence: candidate.confidence,
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

const previewOutcome = (value: unknown): TradeImportPreviewOutcome => {
  if (
    value === 'completed' ||
    value === 'partially_completed' ||
    value === 'failed'
  ) {
    return value;
  }
  throw new Error('Invalid Trade Import preview outcome');
};

export const parseTradeImportPreviewResponse = (
  value: unknown
): TradeImportPreviewResponse => {
  const record = asRecord(value);
  if (
    !record ||
    record.schemaVersion !== 'trade-import-preview-v1' ||
    typeof record.importId !== 'string'
  ) {
    throw new Error('Invalid Trade Import preview response');
  }
  const summary = asRecord(record.summary);
  const outcome = previewOutcome(record.outcome);
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
    outcome,
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
    items: previewItemsArray(record.items, outcome),
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
        tradeRecord.id.trim() === '' ||
        tradeRecord.id !== tradeRecord.id.trim() ||
        typeof tradeRecord.version !== 'number' ||
        !Number.isFinite(tradeRecord.version) ||
        !Number.isInteger(tradeRecord.version) ||
        tradeRecord.version <= 0
      ) {
        throw new Error('Invalid Trade Import commit trade response');
      }
      if (
        tradeRecord.previewTrade !== undefined &&
        tradeRecord.previewTrade !== null
      ) {
        const previewRecord = asRecord(tradeRecord.previewTrade);
        if (!previewRecord) {
          throw new Error('Invalid Trade Import commit previewTrade response');
        }
        validateCommittedPreviewTrade(previewRecord);
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
          status: restorableTradeStatus(tradeRecord.status),
          accountId:
            typeof tradeRecord.accountId === 'string'
              ? tradeRecord.accountId
              : null,
          accountIdentity: commitAccountIdentity(tradeRecord.accountIdentity),
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

async function sendWithAuthRetry<T extends { status: number }>(
  send: (accessToken: string | null) => Promise<T>
): Promise<{
  result: T;
  requestAuthToken: string | null;
}> {
  let requestAuthToken = ApiClient.getAuthToken();
  let result = await send(requestAuthToken);
  if (result.status === 401 && requestAuthToken) {
    const refreshOutcome =
      await ApiClient.refreshAuthentication(requestAuthToken);
    if (refreshOutcome === 'refreshed') {
      requestAuthToken = ApiClient.getAuthToken();
      result = await send(requestAuthToken);
    } else if (refreshOutcome === 'unavailable') {
      throw new AuthenticationRefreshUnavailableError();
    }
  }
  return { result, requestAuthToken };
}

async function requestWithAuthRetry(
  buildRequest: (accessToken: string | null) => RequestUrlParam
): Promise<{
  response: RequestUrlResponse;
  requestAuthToken: string | null;
}> {
  const { result, requestAuthToken } = await sendWithAuthRetry(
    (accessToken) => {
      DemoSyncGate.assertNetworkAllowed();
      return requestUrl(buildRequest(accessToken));
    }
  );
  return { response: result, requestAuthToken };
}

function sendMultipart(
  path: string,
  file: File,
  request: unknown,
  requestAuthToken: string | null
): Promise<{ status: number; responseBody: unknown }> {
  DemoSyncGate.assertNetworkAllowed();
  const form = new FormData();
  form.append('file', file);
  form.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' })
  );

  return new Promise((resolve, reject) => {
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
      resolve({ status: xhr.status, responseBody });
    };
    xhr.onerror = () =>
      reject(new Error('Trade Import network request failed'));
    xhr.send(form);
  });
}

async function postMultipart(
  path: string,
  file: File,
  request: unknown
): Promise<unknown> {
  const { result, requestAuthToken } = await sendWithAuthRetry((accessToken) =>
    sendMultipart(path, file, request, accessToken)
  );

  if (result.status < 200 || result.status >= 300) {
    handleTradeImportHttpError(result.status, requestAuthToken);
    throw new ApiError(
      `Trade Import request failed (${result.status})`,
      result.status,
      {
        operation: `Trade Import ${path}`,
        endpoint: path,
        statusCode: result.status,
        responseBody: result.responseBody,
      }
    );
  }
  return result.responseBody;
}

export class BackendTradeImportService {
  async getCapabilities(): Promise<TradeImportCapabilities> {
    const { response, requestAuthToken } = await requestWithAuthRetry(
      (accessToken) => ({
        url: ApiClient.buildUrl('/api/v1/trade-import/capabilities'),
        method: 'GET',
        headers: authHeaders(accessToken),
        throw: false,
      })
    );
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
      parseTradeImportAnalyseResponse
    );
  }

  preview(
    file: File,
    request: TradeImportPreviewRequest
  ): Promise<TradeImportPreviewResponse> {
    return postMultipart('/api/v1/trade-import/preview', file, request).then(
      parseTradeImportPreviewResponse
    );
  }

  async commit(
    importId: string,
    request: TradeImportCommitRequest,
    idempotencyKey: string
  ): Promise<TradeImportCommitResponse> {
    const { response, requestAuthToken } = await requestWithAuthRetry(
      (accessToken) => ({
        url: ApiClient.buildUrl(`/api/v1/trade-import/${importId}/commit`),
        method: 'POST',
        headers: {
          ...authHeaders(accessToken),
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(request),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeImportHttpError(response.status, requestAuthToken);
      throw new ApiError(
        `Trade Import commit failed (${response.status})`,
        response.status
      );
    }
    const commitResponse = ensureCommitResponse(response.json);
    if (
      commitResponse.importId !== importId ||
      commitResponse.correlationId !== request.correlationId
    ) {
      throw new Error('Invalid Trade Import commit response scope');
    }
    return commitResponse;
  }
}
