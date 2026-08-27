

import { t } from '../../../lang/helpers';
import { BrokerSyncJobFailedError } from '../../../services/tradeSync/BrokerSyncProvider';
import { ApiError } from '../../../types/errors';

export function rithmicSyncErrorMessage(
  errorCode?: string,
  detail?: string
): string {
  switch (errorCode) {
    case 'rithmic_session_conflict':
      return t('trade-sync.rithmic.error.session-conflict');
    case 'rithmic_invalid_credentials':
      return t('trade-sync.rithmic.error.invalid-credentials');
    case 'rithmic_agreements_required':
      return t('trade-sync.rithmic.error.agreements-required');
    case 'rithmic_disabled':
      return t('trade-sync.rithmic.error.disabled');
    default:
      
      
      
      return detail
        ? t('trade-sync.rithmic.error.sync-failed-detail', {
            message: detail,
          })
        : t('trade-sync.rithmic.error.sync-failed');
  }
}

function rithmicHttpErrorBody(
  error: unknown
): { error?: unknown; message?: unknown } | undefined {
  if (!(error instanceof ApiError)) return undefined;
  const body = error.context?.responseBody;
  return body && typeof body === 'object' ? body : undefined;
}

export function rithmicSyncErrorCode(error: unknown): string | undefined {
  if (error instanceof BrokerSyncJobFailedError) return error.errorCode;
  const body = rithmicHttpErrorBody(error);
  return typeof body?.error === 'string' ? body.error : undefined;
}


export function rithmicSyncErrorDetail(error: unknown): string | undefined {
  const body = rithmicHttpErrorBody(error);
  return typeof body?.message === 'string' && body.message.trim() !== ''
    ? body.message
    : undefined;
}


export function isRithmicRetryingErrorCode(errorCode?: string): boolean {
  return errorCode === 'rithmic_session_conflict';
}
