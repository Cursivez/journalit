export const TRADE_OPERATION_RESULT_NOTICE_EVENT =
  'journalit:trade-operation-result-notice';

interface TradeOperationResultNoticeDetail {
  operationId: string;
}

export function requestTradeOperationResultNotice(operationId: string): void {
  window.dispatchEvent(
    new CustomEvent<TradeOperationResultNoticeDetail>(
      TRADE_OPERATION_RESULT_NOTICE_EVENT,
      { detail: { operationId } }
    )
  );
}

export function readTradeOperationResultNotice(
  event: Event
): TradeOperationResultNoticeDetail | null {
  if (!(event instanceof CustomEvent)) return null;
  const detail: unknown = event.detail;
  if (!detail || typeof detail !== 'object') return null;
  const operationId: unknown = Reflect.get(detail, 'operationId');
  return typeof operationId === 'string' ? { operationId } : null;
}
