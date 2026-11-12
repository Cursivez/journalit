import React from 'react';
import { t } from '../../lang/helpers';
import type { PaymentRecoveryBanner as PaymentRecoveryBannerState } from '../../services/backend/paymentRecoveryBanner';
import { Button } from '../ui/Button';
import { AlertTriangle } from './icons/ObsidianIcon';
import { paymentRecoveryMessage } from './paymentRecoveryMessage';


export const PaymentRecoveryBanner: React.FC<{
  banner: PaymentRecoveryBannerState;
  onUpdatePaymentMethod: () => void;
}> = ({ banner, onUpdatePaymentMethod }) => (
  <div
    className={`journalit-payment-recovery-banner journalit-payment-recovery-banner--${banner.kind === 'grace' ? 'warning' : 'error'}`}
    role="status"
    data-banner-kind={banner.kind}
  >
    <AlertTriangle className="journalit-payment-recovery-banner__icon" />
    <p className="journalit-payment-recovery-banner__message">
      {paymentRecoveryMessage(banner)}
    </p>
    <div className="journalit-payment-recovery-banner__actions">
      <Button variant="primary" size="small" onClick={onUpdatePaymentMethod}>
        {t('payment-recovery.action')}
      </Button>
    </div>
  </div>
);
