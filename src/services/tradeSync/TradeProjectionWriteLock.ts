import type JournalitPlugin from '../../main';

interface TradeProjectionLockedWorkResult<T> {
  value: T;
  settlement?: Promise<void>;
}

const projectionWriteWork = new WeakMap<JournalitPlugin, Promise<void>>();
const pendingDeletionIntents = new WeakMap<
  JournalitPlugin,
  Map<string, number>
>();

export function registerTradeProjectionDeletionIntent(
  plugin: JournalitPlugin,
  tradeId: string
): () => void {
  const intents =
    pendingDeletionIntents.get(plugin) ?? new Map<string, number>();
  intents.set(tradeId, (intents.get(tradeId) ?? 0) + 1);
  pendingDeletionIntents.set(plugin, intents);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    const remaining = (intents.get(tradeId) ?? 1) - 1;
    if (remaining > 0) {
      intents.set(tradeId, remaining);
      return;
    }
    intents.delete(tradeId);
    if (intents.size === 0) pendingDeletionIntents.delete(plugin);
  };
}

export function hasPendingTradeProjectionDeletionIntent(
  plugin: JournalitPlugin,
  tradeId: string
): boolean {
  return (pendingDeletionIntents.get(plugin)?.get(tradeId) ?? 0) > 0;
}

const serverDeletedTrades = new WeakMap<JournalitPlugin, Set<string>>();


export function markServerDeletedTradeProjections(
  plugin: JournalitPlugin,
  tradeIds: Iterable<string>
): void {
  const deleted = serverDeletedTrades.get(plugin) ?? new Set<string>();
  for (const tradeId of tradeIds) deleted.add(tradeId);
  serverDeletedTrades.set(plugin, deleted);
}

export function isServerDeletedTradeProjection(
  plugin: JournalitPlugin,
  tradeId: string
): boolean {
  return serverDeletedTrades.get(plugin)?.has(tradeId) === true;
}

export async function runWithTradeProjectionWriteLock<T>(
  plugin: JournalitPlugin,
  work: () => Promise<TradeProjectionLockedWorkResult<T>>
): Promise<T> {
  const previousSettlement = projectionWriteWork.get(plugin);
  const execution = (
    previousSettlement
      ? previousSettlement.catch(() => undefined)
      : Promise.resolve()
  ).then(work);
  const settlement = execution
    .then((completed) => completed.settlement)
    .then(
      (pendingSettlement) => pendingSettlement,
      () => undefined
    )
    .then(
      () => undefined,
      () => undefined
    );
  projectionWriteWork.set(plugin, settlement);
  void settlement.finally(() => {
    if (projectionWriteWork.get(plugin) === settlement) {
      projectionWriteWork.delete(plugin);
    }
  });
  return (await execution).value;
}
