import React from 'react';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import { usePaymentRecoveryBanner } from '../../hooks/usePaymentRecoveryBanner';
import { formatLocalizedMonthDay } from '../../utils/localizedDateTime';
import { AlertTriangle } from '../shared/icons/ObsidianIcon';
import { paymentRecoveryMessage } from '../shared/paymentRecoveryMessage';

interface HomeGreetingSubtitleProps {
  plugin: JournalitPlugin;
  subtitle: string;
}


export const HomeGreetingSubtitle: React.FC<HomeGreetingSubtitleProps> = ({
  plugin,
  subtitle,
}) => {
  const paymentRecovery = usePaymentRecoveryBanner(plugin);
  if (paymentRecovery?.banner.kind !== 'grace') {
    return <p className="journalit-home-greeting-subtitle">{subtitle}</p>;
  }
  return (
    <p
      className="journalit-home-greeting-subtitle journalit-home-payment-notice"
      data-banner-kind="grace"
    >
      <AlertTriangle
        size={14}
        className="journalit-home-payment-notice__icon"
        aria-hidden="true"
      />
      <span>
        {t('payment-recovery.home-notice', {
          date: formatLocalizedMonthDay(paymentRecovery.banner.deadline),
        })}
      </span>
      <button
        type="button"
        className="journalit-home-payment-notice__action"
        aria-label={`${t('payment-recovery.home-notice-action')}. ${paymentRecoveryMessage(paymentRecovery.banner)}`}
        onClick={paymentRecovery.updatePaymentMethod}
      >
        {t('payment-recovery.home-notice-action')}
      </button>
    </p>
  );
};
