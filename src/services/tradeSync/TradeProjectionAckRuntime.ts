import type JournalitPlugin from '../../main';
import { BackendSecretStorage } from '../backend/BackendSecretStorage';
import { TradeProjectionClient } from './TradeProjectionClient';
import {
  hasPendingTradeProjectionAckForCurrentOwner,
  persistedProjectionAckBlockReason,
  persistedProjectionAckNextAttemptAt,
  savePendingProjectionAckQueue,
} from './TradeProjectionAckPersistence';
import { tradeImportEntitlementFromEvent } from './TradeProjectionAckRetry';
import { getTradeProjectionOwnerId } from './TradeProjectionOwnership';
import type {
  TradeProjectionAckClient,
  TradeProjectionAckRequest,
  TradeProjectionRequestOptions,
} from './types';

type ProjectionAckBackgroundStep = (
  plugin: JournalitPlugin,
  backendService: TradeProjectionAckClient,
  options?: TradeProjectionRequestOptions
) => Promise<void>;

interface AckQueueRuntime {
  disposed: boolean;
  initialized: boolean;
  pendingResume?: ProjectionAckResumeEvidence;
  resumeGeneration: number;
  started: boolean;
  timer?: ProjectionAckRetryTimer;
}

interface ProjectionAckRetryTimer {
  id: number;
  ownerUserId: string;
}

interface ProjectionAckResumeEvidence {
  blockedBy: 'authentication' | 'entitlement';
  entitlementEnabled: boolean | undefined;
  generation: number;
  ownerUserId: string;
}

const MAX_TIMER_DELAY_MS = 2_147_483_647;
const SUBSCRIPTION_CHANGED_EVENT = 'journalit:subscription-changed';
const ENTITLEMENTS_REFRESHED_EVENT = 'journalit:entitlements-refreshed';
const ackWorkByPlugin = new WeakMap<JournalitPlugin, Promise<void>>();
const runtimeByPlugin = new WeakMap<JournalitPlugin, AckQueueRuntime>();

export interface ProjectionAckDrainStep {
  continueDrain: boolean;
  madeProgress: boolean;
}

interface ProjectionAckDrainPlan {
  initialBatchCount: number;
  initialResultKeys: Set<string>;
  ownerUserId: string;
}

export async function runProjectionAckWork<T>(
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

function runtime(plugin: JournalitPlugin): AckQueueRuntime {
  const existing = runtimeByPlugin.get(plugin);
  if (existing) return existing;
  const created: AckQueueRuntime = {
    disposed: false,
    initialized: false,
    resumeGeneration: 0,
    started: false,
  };
  runtimeByPlugin.set(plugin, created);
  return created;
}

export function isProjectionAckRuntimeDisposed(
  plugin: JournalitPlugin
): boolean {
  return runtime(plugin).disposed;
}

function clearRuntimeRetryTimer(current: AckQueueRuntime): void {
  if (!current.timer) return;
  window.clearTimeout(current.timer.id);
  current.timer = undefined;
}

export function clearProjectionAckRetryTimer(
  plugin: JournalitPlugin,
  ownerUserId = getTradeProjectionOwnerId(plugin)
): void {
  const current = runtimeByPlugin.get(plugin);
  if (!current?.timer || current.timer.ownerUserId !== ownerUserId) return;
  clearRuntimeRetryTimer(current);
}

export function scheduleProjectionAckRetry(
  plugin: JournalitPlugin,
  backendService: TradeProjectionAckClient,
  nextAttemptAt: number,
  backgroundStep: ProjectionAckBackgroundStep,
  ownerUserId = getTradeProjectionOwnerId(plugin)
): void {
  const current = runtime(plugin);
  if (
    current.disposed ||
    !ownerUserId ||
    getTradeProjectionOwnerId(plugin) !== ownerUserId
  ) {
    return;
  }
  clearRuntimeRetryTimer(current);
  const delay = Math.min(
    MAX_TIMER_DELAY_MS,
    Math.max(0, nextAttemptAt - Date.now())
  );
  const timer: ProjectionAckRetryTimer = {
    id: 0,
    ownerUserId,
  };
  timer.id = window.setTimeout(() => {
    if (current.timer !== timer) return;
    current.timer = undefined;
    if (
      current.disposed ||
      getTradeProjectionOwnerId(plugin) !== timer.ownerUserId
    ) {
      return;
    }
    void backgroundStep(plugin, backendService, {
      interactiveEntitlement: false,
    });
  }, delay);
  current.timer = timer;
}

function resumeEvidenceIsCurrent(
  plugin: JournalitPlugin,
  current: AckQueueRuntime,
  evidence: ProjectionAckResumeEvidence
): boolean {
  return (
    !current.disposed &&
    current.resumeGeneration === evidence.generation &&
    getTradeProjectionOwnerId(plugin) === evidence.ownerUserId &&
    hasPendingTradeProjectionAckForCurrentOwner(plugin) &&
    BackendSecretStorage.hasAuthToken(plugin) &&
    (evidence.blockedBy !== 'entitlement' ||
      evidence.entitlementEnabled === true)
  );
}

function resumePendingQueue(
  plugin: JournalitPlugin,
  current: AckQueueRuntime,
  backgroundStep: ProjectionAckBackgroundStep,
  evidence: ProjectionAckResumeEvidence
): void {
  void runProjectionAckWork(plugin, async () => {
    if (
      !resumeEvidenceIsCurrent(plugin, current, evidence) ||
      persistedProjectionAckBlockReason(plugin) !== evidence.blockedBy
    ) {
      return;
    }
    try {
      await savePendingProjectionAckQueue(
        plugin,
        plugin.settings.backendIntegration?.pendingTradeImportProjectionAcks ??
          [],
        { kind: 'clear' }
      );
    } catch (error) {
      console.error(
        '[Journalit] Failed to persist projection acknowledgement resume state:',
        error
      );
    } finally {
      if (resumeEvidenceIsCurrent(plugin, current, evidence)) {
        scheduleProjectionAckRetry(
          plugin,
          new TradeProjectionClient(),
          Date.now(),
          backgroundStep
        );
      }
    }
  });
}

export function initializeProjectionAckRuntime(
  plugin: JournalitPlugin,
  backgroundStep: ProjectionAckBackgroundStep
): void {
  const current = runtime(plugin);
  if (current.initialized || !plugin.register) return;
  current.initialized = true;
  const resumeOnSubscriptionChange = (event: Event) => {
    current.resumeGeneration += 1;
    current.pendingResume = undefined;
    const ownerUserId = getTradeProjectionOwnerId(plugin);
    const blockedBy = persistedProjectionAckBlockReason(plugin);
    if (
      current.disposed ||
      !hasPendingTradeProjectionAckForCurrentOwner(plugin)
    ) {
      clearRuntimeRetryTimer(current);
      return;
    }
    if (!BackendSecretStorage.hasAuthToken(plugin)) {
      clearRuntimeRetryTimer(current);
      return;
    }
    const tradeImportEnabled = tradeImportEntitlementFromEvent(event);
    if (tradeImportEnabled === false) {
      if (current.timer?.ownerUserId !== ownerUserId) {
        clearRuntimeRetryTimer(current);
      }
      return;
    }
    clearRuntimeRetryTimer(current);
    if (blockedBy === 'entitlement' && tradeImportEnabled !== true) {
      return;
    }
    if (!blockedBy) {
      if (current.started) {
        scheduleProjectionAckRetry(
          plugin,
          new TradeProjectionClient(),
          persistedProjectionAckNextAttemptAt(plugin) ?? Date.now(),
          backgroundStep
        );
      }
      return;
    }
    const evidence: ProjectionAckResumeEvidence = {
      blockedBy,
      entitlementEnabled: tradeImportEnabled,
      generation: current.resumeGeneration,
      ownerUserId,
    };
    if (!current.started) {
      current.pendingResume = evidence;
      return;
    }
    resumePendingQueue(plugin, current, backgroundStep, evidence);
  };
  window.addEventListener(
    SUBSCRIPTION_CHANGED_EVENT,
    resumeOnSubscriptionChange
  );
  window.addEventListener(
    ENTITLEMENTS_REFRESHED_EVENT,
    resumeOnSubscriptionChange
  );
  plugin.register(() => {
    current.disposed = true;
    window.removeEventListener(
      SUBSCRIPTION_CHANGED_EVENT,
      resumeOnSubscriptionChange
    );
    window.removeEventListener(
      ENTITLEMENTS_REFRESHED_EVENT,
      resumeOnSubscriptionChange
    );
    clearRuntimeRetryTimer(current);
  });
}

export async function drainInitialProjectionAckBatches(
  plugin: JournalitPlugin,
  drainOne: () => Promise<ProjectionAckDrainStep>
): Promise<void> {
  const plan = await runProjectionAckWork(plugin, async () => {
    const ownerUserId = getTradeProjectionOwnerId(plugin);
    if (!ownerUserId) return null;
    const initialBatches = (
      plugin.settings.backendIntegration?.pendingTradeImportProjectionAcks ?? []
    ).filter((request) => request.ownerUserId === ownerUserId);
    if (initialBatches.length === 0) return null;
    return {
      initialBatchCount: initialBatches.length,
      initialResultKeys: new Set(
        initialBatches.flatMap((request) =>
          request.results.map((result) =>
            projectionAckDrainResultKey(request, result)
          )
        )
      ),
      ownerUserId,
    } satisfies ProjectionAckDrainPlan;
  });
  if (!plan) return;
  await drainProjectionAckPlanWhenEligible(plugin, plan, drainOne);
}

async function drainProjectionAckPlanWhenEligible(
  plugin: JournalitPlugin,
  plan: ProjectionAckDrainPlan,
  drainOne: () => Promise<ProjectionAckDrainStep>,
  batchIndex = 0
): Promise<void> {
  const nextStep = await runProjectionAckWork(plugin, async () => {
    if (
      getTradeProjectionOwnerId(plugin) !== plan.ownerUserId ||
      batchIndex >= plan.initialBatchCount ||
      !firstOwnerBatchContainsInitialResult(plugin, plan)
    ) {
      return null;
    }
    const nextAttemptAt = persistedProjectionAckNextAttemptAt(plugin);
    if (
      !persistedProjectionAckBlockReason(plugin) &&
      nextAttemptAt !== undefined &&
      nextAttemptAt > Date.now()
    ) {
      clearProjectionAckRetryTimer(plugin, plan.ownerUserId);
      return { batchIndex, waitUntil: nextAttemptAt };
    }
    const outcome = await drainOne();
    const nextBatchIndex = batchIndex + 1;
    if (
      !outcome.madeProgress ||
      !outcome.continueDrain ||
      nextBatchIndex >= plan.initialBatchCount
    ) {
      return null;
    }
    const pacedAttemptAt = persistedProjectionAckNextAttemptAt(plugin);
    if (pacedAttemptAt !== undefined) {
      clearProjectionAckRetryTimer(plugin, plan.ownerUserId);
    }
    return { batchIndex: nextBatchIndex, waitUntil: pacedAttemptAt };
  });
  if (!nextStep) return;
  if (nextStep.waitUntil !== undefined) {
    await waitForProjectionAckDeadline(nextStep.waitUntil);
  }
  return drainProjectionAckPlanWhenEligible(
    plugin,
    plan,
    drainOne,
    nextStep.batchIndex
  );
}

function firstOwnerBatchContainsInitialResult(
  plugin: JournalitPlugin,
  plan: ProjectionAckDrainPlan
): boolean {
  const firstOwnerBatch = (
    plugin.settings.backendIntegration?.pendingTradeImportProjectionAcks ?? []
  ).find((request) => request.ownerUserId === plan.ownerUserId);
  return Boolean(
    firstOwnerBatch?.results.some((result) =>
      plan.initialResultKeys.has(
        projectionAckDrainResultKey(firstOwnerBatch, result)
      )
    )
  );
}

function projectionAckDrainResultKey(
  request: TradeProjectionAckRequest & { ownerUserId?: string },
  result: TradeProjectionAckRequest['results'][number]
): string {
  return JSON.stringify([
    request.ownerUserId ?? null,
    request.vaultId,
    result.tradeId,
    result.backendTradeVersion,
  ]);
}

function waitForProjectionAckDeadline(deadline: number): Promise<void> {
  const remaining = deadline - Date.now();
  if (remaining <= 0) return Promise.resolve();
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, Math.min(MAX_TIMER_DELAY_MS, remaining));
  }).then(() => waitForProjectionAckDeadline(deadline));
}

export function startProjectionAckRuntime(
  plugin: JournalitPlugin,
  backgroundStep: ProjectionAckBackgroundStep
): void {
  const current = runtime(plugin);
  if (current.disposed) return;
  current.started = true;
  if (!hasPendingTradeProjectionAckForCurrentOwner(plugin)) return;
  const pendingResume = current.pendingResume;
  current.pendingResume = undefined;
  if (pendingResume) {
    resumePendingQueue(plugin, current, backgroundStep, pendingResume);
    return;
  }
  if (persistedProjectionAckBlockReason(plugin)) return;
  scheduleProjectionAckRetry(
    plugin,
    new TradeProjectionClient(),
    persistedProjectionAckNextAttemptAt(plugin) ?? Date.now(),
    backgroundStep
  );
}
