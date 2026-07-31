import { eventBus } from '../../events';
import type { TradeChange, TradeCommittedPayload } from './tradeCoreTypes';

export class TradeEventBridge {
  public publishCommittedChange(
    payload: TradeCommittedPayload,
    options?: { suppressLegacyTradeChanged?: boolean }
  ): void {
    const shouldEmitLegacyTradeChanged = !options?.suppressLegacyTradeChanged;
    const committedPayload: TradeCommittedPayload = {
      ...payload,
      legacyTradeChangedExpected: shouldEmitLegacyTradeChanged,
    };

    eventBus.publish('trade:committed', committedPayload);
    if (shouldEmitLegacyTradeChanged) {
      const delay = this.getLegacyDelay(payload.change.action);
      window.setTimeout(() => {
        eventBus.publish('trade:changed', this.toLegacyPayload(payload.change));
      }, delay);
    }
  }

  public publishCommittedBatch(payloads: TradeCommittedPayload[]): void {
    if (payloads.length === 0) return;
    for (const payload of payloads) {
      this.publishCommittedChange(payload, {
        suppressLegacyTradeChanged: true,
      });
    }
    const firstAction = payloads[0].change.action;
    const batchAction = payloads.every(
      (payload) => payload.change.action === firstAction
    )
      ? firstAction
      : 'updated';
    eventBus.publish('trade:changed', {
      action: batchAction,
      filePaths: payloads.map((payload) => payload.change.path),
      timestamp: Date.now(),
    });
  }

  private getLegacyDelay(action: TradeChange['action']): number {
    switch (action) {
      case 'created':
      case 'deleted':
        return 500;
      case 'updated':
      case 'relocated':
      default:
        return 100;
    }
  }

  private toLegacyPayload(change: TradeChange) {
    return {
      action: change.action,
      filePaths: [change.path],
      oldFilePath: change.previousPath,
      timestamp: Date.now(),
    };
  }
}
