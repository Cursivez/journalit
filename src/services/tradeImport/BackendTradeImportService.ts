import { requestUrl } from 'obsidian';
import { ApiClient } from '../backend/ApiClient';
import { BackendSecretStorage } from '../backend/BackendSecretStorage';
import { ApiError } from '../../types/errors';
import { getPluginInstance } from '../../utils/pluginContext';
import type {
  TradeImportAnalyseRequest,
  TradeImportAnalyseResponse,
  TradeImportCapabilities,
  TradeImportDiagnostic,
  TradeImportFileType,
  TradeImportManualMode,
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

const previewTradesArray = (value: unknown): TradeImportPreviewTrade[] =>
  unknownArray(value).flatMap((item) => {
    const record = asRecord(item);
    if (
      !record ||
      typeof record.csvImportId !== 'string' ||
      typeof record.symbol !== 'string' ||
      typeof record.entryTime !== 'string'
    ) {
      return [];
    }
    return [
      {
        csvImportId: record.csvImportId,
        legacyCsvImportIds: stringArray(record.legacyCsvImportIds),
        sourceRows: unknownArray(record.sourceRows).filter(
          (row): row is number => typeof row === 'number'
        ),
        symbol: record.symbol,
        direction: record.direction === 'short' ? 'short' : 'long',
        entryTime: record.entryTime,
        entryPrice: numberValue(record.entryPrice),
        quantity: numberValue(record.quantity),
        exitTime: typeof record.exitTime === 'string' ? record.exitTime : null,
        exitPrice:
          typeof record.exitPrice === 'number' ? record.exitPrice : null,
        status: record.status === 'OPEN' ? 'OPEN' : 'CLOSED',
        closeOnly: record.closeOnly === true,
        useDirectPnLInput: record.useDirectPnLInput === true,
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
        setupIds: stringArray(record.setupIds),
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
    trades: previewTradesArray(record.trades),
    diagnostics: diagnosticsArray(record.diagnostics),
  };
};

function authHeaders(): Record<string, string> {
  const token = ApiClient.getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handleTradeImportHttpError(status: number): void {
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
      const backend = plugin?.settings.backendIntegration;
      if (!plugin || !backend) return;

      BackendSecretStorage.clearAuthToken(plugin);
      backend.userEmail = undefined;
      backend.subscriptionTier = undefined;
      backend.userId = '';
      void plugin.saveSettings();
      window.dispatchEvent(new CustomEvent('journalit:subscription-changed'));
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
    const xhr = new XMLHttpRequest();
    xhr.open('POST', ApiClient.buildUrl(path));
    for (const [key, value] of Object.entries(authHeaders()))
      xhr.setRequestHeader(key, value);
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        handleTradeImportHttpError(xhr.status);
        reject(
          new ApiError(
            `Trade Import request failed (${xhr.status})`,
            xhr.status
          )
        );
        return;
      }
      try {
        resolve(JSON.parse(xhr.responseText) as unknown);
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    };
    xhr.onerror = () =>
      reject(new Error('Trade Import network request failed'));
    xhr.send(form);
  });
}

export class BackendTradeImportService {
  async getCapabilities(): Promise<TradeImportCapabilities> {
    const response = await requestUrl({
      url: ApiClient.buildUrl('/api/v1/trade-import/capabilities'),
      method: 'GET',
      headers: authHeaders(),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeImportHttpError(response.status);
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
}
