import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import type { TradeData } from '../trade/TradeService';
import { mapPreviewTradeToTradeData } from './canonicalTradeMapper';
import type { ClassifiedPreviewTrade, TradeImportPreviewTrade } from './types';

interface ExistingTrade {
  filePath?: string;
  path?: string;
  csvImportId?: string;
  legacyCsvImportIds?: string[];
  executionLedgerVersion?: number;
  executionIds?: string[];
  instrument?: string;
  entryTime?: Date;
  entryPrice?: number;
  positionSize?: number;
  entries?: Array<{ size: number }>;
  exits?: Array<{ size: number }>;
  direction?: string;
  tradeStatus?: 'OPEN' | 'CLOSED';
  account?: string[];
  assetType?: string;
  strikePrice?: number;
  expirationDate?: Date;
  optionType?: string;
  contractSize?: number;
}

const filePathOf = (trade: ExistingTrade): string | undefined =>
  trade.filePath ?? trade.path;
const FUZZY_TIME_TOLERANCE_MS = 60_000;
const FUZZY_PRICE_TOLERANCE = 0.00001;
const FUZZY_QUANTITY_TOLERANCE = 0.001;

function sameAccount(existing: ExistingTrade, accountName: string): boolean {
  return existing.account?.includes(accountName) ?? false;
}

function sameExecutionLedger(
  preview: TradeImportPreviewTrade,
  existing: ExistingTrade,
  accountName: string
): boolean {
  if (!preview.executionLedgerVersion || !preview.executionIds.length)
    return false;
  if (
    !sameAccount(existing, accountName) ||
    existing.executionLedgerVersion !== preview.executionLedgerVersion ||
    !existing.executionIds?.length ||
    existing.executionIds.length !== preview.executionIds.length
  )
    return false;
  const existingIds = new Set(existing.executionIds);
  return preview.executionIds.every((id) => existingIds.has(id));
}

function previewExecutionIdsAlreadyApplied(
  preview: TradeImportPreviewTrade,
  existing: ExistingTrade,
  accountName: string
): boolean {
  if (!preview.executionLedgerVersion || !preview.executionIds.length)
    return false;
  if (
    !sameAccount(existing, accountName) ||
    existing.executionLedgerVersion !== preview.executionLedgerVersion ||
    !existing.executionIds?.length
  )
    return false;
  const existingIds = new Set(existing.executionIds);
  return preview.executionIds.every((id) => existingIds.has(id));
}

function extendsExistingExecutionLedger(
  preview: TradeImportPreviewTrade,
  existing: ExistingTrade,
  accountName: string
): boolean {
  if (!preview.executionLedgerVersion || !preview.executionIds.length)
    return false;
  if (
    !sameAccount(existing, accountName) ||
    existing.executionLedgerVersion !== preview.executionLedgerVersion ||
    !existing.executionIds?.length ||
    existing.tradeStatus !== 'OPEN'
  )
    return false;
  const previewIds = new Set(preview.executionIds);
  const existingIds = new Set(existing.executionIds);
  return (
    existing.executionIds.every((id) => previewIds.has(id)) &&
    preview.executionIds.some((id) => !existingIds.has(id))
  );
}

function previewHasNewExecutionForExisting(
  preview: TradeImportPreviewTrade,
  existing: ExistingTrade
): boolean {
  if (!preview.executionIds.length) return false;
  const existingIds = new Set(existing.executionIds ?? []);
  return preview.executionIds.some((id) => !existingIds.has(id));
}

function sameCanonicalCsvImportId(
  preview: TradeImportPreviewTrade,
  existing: ExistingTrade
): boolean {
  if (!preview.csvImportId) return false;
  if (existing.csvImportId === preview.csvImportId) return true;
  return (existing.legacyCsvImportIds ?? []).includes(preview.csvImportId);
}

function sameLegacyCsvImportId(
  preview: TradeImportPreviewTrade,
  existing: ExistingTrade
): boolean {
  const legacyIds = new Set(preview.legacyCsvImportIds);
  if (legacyIds.size === 0) return false;
  if (existing.csvImportId && legacyIds.has(existing.csvImportId)) return true;
  return (existing.legacyCsvImportIds ?? []).some((id) => legacyIds.has(id));
}

function sameFuzzyTrade(
  preview: TradeImportPreviewTrade,
  existing: ExistingTrade,
  accountName: string
): boolean {
  if (!existing.entryTime) return false;
  if (existing.entryPrice === undefined || existing.positionSize === undefined)
    return false;
  return (
    sameAccount(existing, accountName) &&
    existing.instrument === preview.symbol &&
    sameImportedDirection(preview, existing) &&
    sameAssetContractIdentity(preview, existing) &&
    Math.abs(
      existing.entryTime.getTime() - new Date(preview.entryTime).getTime()
    ) < FUZZY_TIME_TOLERANCE_MS &&
    Math.abs(existing.entryPrice - preview.entryPrice) <
      FUZZY_PRICE_TOLERANCE &&
    Math.abs(existing.positionSize - preview.quantity) <
      FUZZY_QUANTITY_TOLERANCE
  );
}

function sameImportedDirection(
  preview: TradeImportPreviewTrade,
  existing: ExistingTrade
): boolean {
  if (preview.assetType === 'options' || existing.assetType === 'options') {
    return true;
  }

  return existing.direction === preview.direction;
}

function sameAssetContractIdentity(
  preview: TradeImportPreviewTrade,
  existing: ExistingTrade
): boolean {
  if (preview.assetType && existing.assetType !== preview.assetType) {
    return false;
  }

  if (preview.assetType !== 'options') return true;

  return (
    existing.strikePrice === preview.strikePrice &&
    normalizeOptionType(existing.optionType) ===
      normalizeOptionType(preview.optionType) &&
    existing.contractSize === preview.contractSize &&
    existing.expirationDate?.toISOString().slice(0, 10) ===
      (preview.expirationDate ? preview.expirationDate.slice(0, 10) : undefined)
  );
}

function normalizeOptionType(value?: string | null): string | undefined {
  return value?.trim().toLowerCase() || undefined;
}

function remainingOpenQuantity(existing: ExistingTrade): number | undefined {
  const entrySize = (existing.entries ?? []).reduce(
    (sum, entry) => sum + Math.abs(entry.size),
    0
  );
  if (entrySize === 0) return existing.positionSize;
  const exitSize = (existing.exits ?? []).reduce(
    (sum, exit) => sum + Math.abs(exit.size),
    0
  );
  const remaining = entrySize - exitSize;
  return remaining > 0 ? remaining : existing.positionSize;
}

function closeSize(preview: TradeImportPreviewTrade): number {
  return (preview.exits ?? []).reduce(
    (sum, exit) => sum + Math.abs(exit.size),
    0
  );
}

function overClosesExisting(
  preview: TradeImportPreviewTrade,
  existing: ExistingTrade | undefined
): boolean {
  if (!existing) return false;
  const remaining = remainingOpenQuantity(existing);
  if (remaining === undefined) return false;
  const closing = closeSize(preview) || preview.quantity;
  return closing > remaining;
}

function sameOpenPositionIdentity(
  preview: TradeImportPreviewTrade,
  existing: ExistingTrade,
  accountName: string
): boolean {
  const sameBaseIdentity =
    existing.tradeStatus === 'OPEN' &&
    existing.instrument === preview.symbol &&
    sameAccount(existing, accountName) &&
    sameImportedDirection(preview, existing);
  if (!sameBaseIdentity) return false;

  return sameAssetContractIdentity(preview, existing);
}

function batchIdentityKeys(preview: TradeImportPreviewTrade): string[] {
  if (preview.executionLedgerVersion && preview.executionIds.length) {
    return [
      `exec:${preview.executionLedgerVersion}:${[...preview.executionIds].sort().join('|')}`,
    ];
  }
  const csvIdentityKeys = [
    ...(preview.csvImportId ? [`csv:${preview.csvImportId}`] : []),
    ...preview.legacyCsvImportIds.map((legacyId) => `csv:${legacyId}`),
  ];
  if (csvIdentityKeys.length) return csvIdentityKeys;
  const assetIdentity = [
    preview.assetType,
    preview.strikePrice,
    preview.expirationDate?.slice(0, 10),
    preview.optionType,
    preview.contractSize,
  ]
    .map((value) => value ?? '')
    .join(':');
  return [
    `fuzzy:${preview.symbol}:${preview.direction}:${preview.entryTime}:${preview.entryPrice}:${preview.quantity}:${assetIdentity}`,
  ];
}

export async function classifyPreviewTrades(
  plugin: JournalitPlugin,
  previews: TradeImportPreviewTrade[],
  accountName: string
): Promise<ClassifiedPreviewTrade[]> {
  await plugin.tradeService.waitForTradeDataReady?.();
  const existingTrades =
    (await plugin.tradeService.getTradeData()) as ExistingTrade[];
  const seenPreviewIdentityKeys = new Set<string>();
  return previews.map((preview) => {
    const previewIdentityKeys = batchIdentityKeys(preview);
    const duplicateInBatch = previewIdentityKeys.some((key) =>
      seenPreviewIdentityKeys.has(key)
    );
    previewIdentityKeys.forEach((key) => seenPreviewIdentityKeys.add(key));
    const ledgerMatch = existingTrades.find((trade) =>
      sameExecutionLedger(preview, trade, accountName)
    );
    const appliedLedgerMatch = existingTrades.find((trade) =>
      previewExecutionIdsAlreadyApplied(preview, trade, accountName)
    );
    const extensionLedgerMatch = existingTrades.find((trade) =>
      extendsExistingExecutionLedger(preview, trade, accountName)
    );
    const canonicalCsvMatch = existingTrades.find((trade) =>
      sameCanonicalCsvImportId(preview, trade)
    );
    const legacyCsvMatch = existingTrades.find((trade) =>
      sameLegacyCsvImportId(preview, trade)
    );
    const fuzzyMatch = existingTrades.find((trade) =>
      sameFuzzyTrade(preview, trade, accountName)
    );
    const identityMatch =
      ledgerMatch ?? canonicalCsvMatch ?? legacyCsvMatch ?? fuzzyMatch;
    const seededIdentityOpenUpdate =
      !!identityMatch &&
      identityMatch.tradeStatus === 'OPEN' &&
      previewHasNewExecutionForExisting(preview, identityMatch) &&
      !previewExecutionIdsAlreadyApplied(preview, identityMatch, accountName);
    const fuzzyOpenUpdate =
      !!fuzzyMatch &&
      !ledgerMatch &&
      !canonicalCsvMatch &&
      !legacyCsvMatch &&
      fuzzyMatch.tradeStatus === 'OPEN' &&
      preview.status === 'CLOSED';
    const openPositionIdentityCandidates = existingTrades.filter((trade) =>
      sameOpenPositionIdentity(preview, trade, accountName)
    );
    const closeOnlyCandidates =
      preview.closeOnly && !identityMatch ? openPositionIdentityCandidates : [];
    const closeOnlyMatch =
      closeOnlyCandidates.length === 1 ? closeOnlyCandidates[0] : undefined;
    const seededOpenCandidates =
      !preview.closeOnly && !identityMatch && preview.executionIds.length > 0
        ? openPositionIdentityCandidates
        : [];
    const seededOpenMatch =
      seededOpenCandidates.length === 1 ? seededOpenCandidates[0] : undefined;
    const existing =
      appliedLedgerMatch ??
      extensionLedgerMatch ??
      identityMatch ??
      closeOnlyMatch ??
      seededOpenMatch;
    const tradeData: TradeData = mapPreviewTradeToTradeData(
      preview,
      accountName
    );
    if (duplicateInBatch) {
      return {
        preview,
        tradeData,
        classification: 'duplicate',
        message: t('trade-import.preview.message.duplicate-in-file'),
      };
    }
    if (appliedLedgerMatch) {
      return {
        preview,
        tradeData,
        classification: 'duplicate',
        existingPath: filePathOf(appliedLedgerMatch),
      };
    }
    if (preview.closeOnly && !closeOnlyMatch && !identityMatch) {
      return {
        preview,
        tradeData,
        classification: 'failed',
        message:
          closeOnlyCandidates.length > 1
            ? t('trade-import.preview.message.multiple-open-matches')
            : t('trade-import.preview.message.no-open-match'),
      };
    }
    if (preview.closeOnly && overClosesExisting(preview, existing)) {
      return {
        preview,
        tradeData,
        classification: 'failed',
        existingPath: existing ? filePathOf(existing) : undefined,
        message: t('trade-import.preview.message.quantity-mismatch'),
      };
    }
    if (seededOpenCandidates.length > 1) {
      return {
        preview,
        tradeData,
        classification: 'failed',
        message: t('trade-import.preview.message.multiple-open-matches'),
      };
    }
    return {
      preview,
      tradeData,
      classification: extensionLedgerMatch
        ? 'update_existing'
        : seededIdentityOpenUpdate
          ? 'update_existing'
          : fuzzyOpenUpdate
            ? 'update_existing'
            : identityMatch
              ? 'duplicate'
              : closeOnlyMatch
                ? 'update_existing'
                : seededOpenMatch
                  ? 'update_existing'
                  : 'new',
      existingPath: existing ? filePathOf(existing) : undefined,
    };
  });
}
