import { eventBus } from '../events/EventBus';

export function isEmptyPersistedAnnotation(
  annotation: Record<string, unknown>
): boolean {
  return Object.keys(annotation).length === 0;
}

export function publishTradeAnnotationChanged(
  sourcePath: string,
  tradeType: 'regular' | 'missed' | 'backtest'
): void {
  const timestamp = Date.now();
  if (tradeType === 'missed') {
    eventBus.publish('missed-trade:changed', {
      action: 'updated',
      filePath: sourcePath,
      timestamp,
    });
    return;
  }
  if (tradeType === 'backtest') {
    eventBus.publish('backtest-trade:changed', {
      action: 'updated',
      filePath: sourcePath,
      timestamp,
    });
    return;
  }
  eventBus.publish('trade:changed', {
    action: 'updated',
    filePath: sourcePath,
    filePaths: [sourcePath],
    timestamp,
  });
}
