import React from 'react';
import type JournalitPlugin from '../../main';
import { PaymentRecoveryBanner } from '../shared/PaymentRecoveryBanner';
import { usePaymentRecoveryBanner } from '../../hooks/usePaymentRecoveryBanner';


export const AccountPaymentRecoveryBanner: React.FC<{
  plugin: JournalitPlugin;
}> = ({ plugin }) => {
  const paymentRecovery = usePaymentRecoveryBanner(plugin);
  if (!paymentRecovery) return null;
  return (
    <PaymentRecoveryBanner
      banner={paymentRecovery.banner}
      onUpdatePaymentMethod={paymentRecovery.updatePaymentMethod}
    />
  );
};
