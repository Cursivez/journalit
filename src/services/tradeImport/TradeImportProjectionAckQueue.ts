import { Platform } from 'obsidian';
import type JournalitPlugin from '../../main';
import { generateUUID } from '../../utils/uuid';
import { BackendTradeImportService } from './BackendTradeImportService';
import type { TradeImportProjectionAckRequest } from './types';

const LOCAL_DELETE_IMPORT_ID = 'local-delete';
const LOCAL_DELETE_COMMIT_ID = 'local-delete';

type PendingAck = TradeImportProjectionAckRequest;
type TradeImportProjectionAckSendStatus = 'sent' | 'queued' | 'failed';
const ackWorkByPlugin = new WeakMap<JournalitPlugin, Promise<void>>();

async function hashVaultIdentifier(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
}

async function generateCanonicalVaultId(
  plugin: JournalitPlugin
): Promise<string> {
  const vaultName = plugin.app.vault.getName() || 'Unknown';
  const deviceInfo = Platform.isDesktopApp
    ? 'desktop'
    : Platform.isIosApp
      ? 'ios'
      : Platform.isAndroidApp
        ? 'android'
        : Platform.isMobileApp
          ? 'mobile'
          : 'unknown';
  const hash = await hashVaultIdentifier(`${vaultName}:${deviceInfo}`);
  return `vault_${hash.substring(0, 16)}`;
}

function retryableProjectionAckError(error: unknown): boolean {
  const statusCode =
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
      ? error.statusCode
      : undefined;
  if (statusCode === undefined) return true;
  if (
    statusCode === 401 ||
    statusCode === 402 ||
    statusCode === 403 ||
    statusCode === 408 ||
    statusCode === 429
  ) {
    return true;
  }
  return statusCode >= 500;
}

async function runAckWork<T>(
  plugin: JournalitPlugin,
  work: () => Promise<T>
): Promise<T> {
  const previousWork = ackWorkByPlugin.get(plugin) ?? Promise.resolve();
  const currentWork = previousWork.then(work, work);
  ackWorkByPlugin.set(
    plugin,
    currentWork.then(
      () => undefined,
      () => undefined
    )
  );
  return currentWork;
}

export async function getTradeImportVaultId(
  plugin: JournalitPlugin
): Promise<string> {
  const backendSettings = plugin.settings.backendIntegration;
  const existing = backendSettings?.vaultIdentifier;
  if (existing) return existing;

  const vaultId = await generateCanonicalVaultId(plugin);
  if (backendSettings) {
    backendSettings.vaultIdentifier = vaultId;
    await plugin.saveSettings?.();
  }
  return vaultId;
}

function pendingQueue(plugin: JournalitPlugin): PendingAck[] {
  const backendSettings = plugin.settings.backendIntegration;
  if (!backendSettings) return [];
  return backendSettings.pendingTradeImportProjectionAcks ?? [];
}

async function savePendingQueue(
  plugin: JournalitPlugin,
  queue: PendingAck[]
): Promise<void> {
  const backendSettings = plugin.settings.backendIntegration;
  if (!backendSettings) return;
  backendSettings.pendingTradeImportProjectionAcks = queue;
  await plugin.saveSettings?.();
}

async function enqueueTradeImportProjectionAck(
  plugin: JournalitPlugin,
  request: TradeImportProjectionAckRequest
): Promise<void> {
  await savePendingQueue(plugin, [...pendingQueue(plugin), request]);
}

export async function sendTradeImportProjectionAckWithStatus(
  plugin: JournalitPlugin,
  backendService: BackendTradeImportService,
  request: TradeImportProjectionAckRequest
): Promise<TradeImportProjectionAckSendStatus> {
  return runAckWork(plugin, async () => {
    await flushTradeImportProjectionAcksUnlocked(plugin, backendService);
    if (pendingQueue(plugin).length > 0) {
      await enqueueTradeImportProjectionAck(plugin, request);
      return 'queued';
    }
    try {
      await backendService.projectionAck(request);
      return 'sent';
    } catch (error) {
      if (retryableProjectionAckError(error)) {
        await enqueueTradeImportProjectionAck(plugin, request);
        return 'queued';
      }
      return 'failed';
    }
  });
}

export async function sendTradeImportProjectionAck(
  plugin: JournalitPlugin,
  backendService: BackendTradeImportService,
  request: TradeImportProjectionAckRequest
): Promise<boolean> {
  const status = await sendTradeImportProjectionAckWithStatus(
    plugin,
    backendService,
    request
  );
  return status === 'sent';
}

export async function flushTradeImportProjectionAcks(
  plugin: JournalitPlugin,
  backendService: BackendTradeImportService
): Promise<void> {
  await runAckWork(plugin, () =>
    flushTradeImportProjectionAcksUnlocked(plugin, backendService)
  );
}

async function flushTradeImportProjectionAcksUnlocked(
  plugin: JournalitPlugin,
  backendService: BackendTradeImportService
): Promise<void> {
  const queue = pendingQueue(plugin);
  if (queue.length === 0) return;

  let sentCount = 0;
  let flushChain = Promise.resolve(true);
  for (const request of queue) {
    flushChain = flushChain.then(async (shouldContinue) => {
      if (!shouldContinue) return false;
      try {
        await backendService.projectionAck(request);
        sentCount++;
        return true;
      } catch (error) {
        if (!retryableProjectionAckError(error)) {
          sentCount++;
          return true;
        }
        return false;
      }
    });
  }
  await flushChain;
  const remaining = queue.slice(sentCount);
  if (remaining.length !== queue.length) {
    await savePendingQueue(plugin, remaining);
  }
}

export async function acknowledgeLocalDeletedTradeImportProjection(
  plugin: JournalitPlugin,
  tradeImportId: string,
  tradeImportVersion: number,
  filePath: string
): Promise<void> {
  const vaultId = await getTradeImportVaultId(plugin);
  const request: TradeImportProjectionAckRequest = {
    correlationId: `local-delete-${generateUUID()}`,
    importId: LOCAL_DELETE_IMPORT_ID,
    commitId: LOCAL_DELETE_COMMIT_ID,
    vaultId,
    results: [
      {
        tradeId: tradeImportId,
        backendTradeVersion: tradeImportVersion,
        filePath,
        status: 'local_deleted',
      },
    ],
  };
  await sendTradeImportProjectionAck(
    plugin,
    new BackendTradeImportService(),
    request
  );
}
