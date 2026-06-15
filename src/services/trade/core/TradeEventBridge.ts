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
