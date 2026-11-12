import { t } from '../../lang/helpers';
import { formatLocalizedDateTime } from '../../utils/localizedDateTime';
import type { PaymentRecoveryBanner } from '../../services/backend/paymentRecoveryBanner';


export function paymentRecoveryMessage(banner: PaymentRecoveryBanner): string {
  switch (banner.kind) {
    case 'grace':
      
      return t('payment-recovery.grace', {
        date: formatLocalizedDateTime(banner.deadline),
      });
    case 'noAccess':
      return t('payment-recovery.no-access');
    case 'paused':
      return t('payment-recovery.paused');
  }
}
