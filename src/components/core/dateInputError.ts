import { t } from '../../lang/helpers';
import type { DateDraftResult } from './dateInputDraft';

export function dateInputError(
  result: DateDraftResult,
  showIncomplete: boolean,
  required: boolean
): string | undefined {
  if (result.kind === 'invalid') {
    switch (result.reason) {
      case 'day':
        return t('date-input.error.day', { max: '31' });
      case 'monthDays':
        return t('date-input.error.day', { max: String(result.maxDays) });
      case 'month':
        return t('date-input.error.month');
      case 'year':
        return t('date-input.error.year');
      case 'digits':
        return t('date-input.error.invalid');
    }
  }
  if (
    showIncomplete &&
    (result.kind === 'incomplete' || (required && result.kind === 'empty'))
  ) {
    return t('date-input.error.invalid');
  }
  return undefined;
}
