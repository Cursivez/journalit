import { getCurrencyConfig } from '../../../utils/currencyConfig';
import {
  createDisplayPolicy,
  formatDisplayValue,
} from '../../display/DisplayPolicy';


const CHANGE_LINE_POLICY = createDisplayPolicy({
  display: { privacyMode: false },
});


export function formatActionMoney(value: number, currencyCode: string): string {
  return formatDisplayValue(
    {
      kind: 'money',
      value,
      currencyCode,
      precision: getCurrencyConfig(currencyCode).decimalPlaces,
    },
    CHANGE_LINE_POLICY
  );
}
