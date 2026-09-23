import React from 'react';
import { Lock } from '../shared/icons/ObsidianIcon';
import { t, tPlural } from '../../lang/helpers';

interface TradeImportProGateProps {
  busy: boolean;
  importableCount: number;
  isCheckingEntitlement: boolean;
  isRefreshingStatus: boolean;
  onRefreshStatus: () => void;
  onUpgrade: () => void;
}


export const TradeImportProGate: React.FC<TradeImportProGateProps> = ({
  busy,
  importableCount,
  isCheckingEntitlement,
  isRefreshingStatus,
  onRefreshStatus,
  onUpgrade,
}) => {
  const headingId = React.useId();
  const actionsDisabled = busy || isCheckingEntitlement || isRefreshingStatus;

  return (
    <section
      className="journalit-trade-import-pro-banner"
      aria-labelledby={headingId}
    >
      <Lock size={20} className="journalit-trade-import-pro-banner__icon" />
      <div className="journalit-trade-import-pro-banner__copy">
        <h3 id={headingId} className="journalit-trade-import-pro-banner__title">
          {tPlural('trade-import.pro-gate.title', importableCount)}
        </h3>
        <p className="journalit-trade-import-pro-banner__subtitle">
          {t('trade-import.pro-gate.subtitle')}
        </p>
      </div>
      <div className="journalit-trade-import-pro-banner__actions">
        <button
          type="button"
          className="journalit-trade-import-gate-primary journalit-trade-import-pro-banner__primary"
          disabled={actionsDisabled}
          onClick={onUpgrade}
        >
          {t('trade-import.pro-gate.cta')}
        </button>
        <button
          type="button"
          className="journalit-trade-import-pro-banner__secondary"
          disabled={actionsDisabled}
          aria-busy={isRefreshingStatus}
          onClick={onRefreshStatus}
        >
          {t('premium.gate.cta.refresh')}
        </button>
      </div>
    </section>
  );
};
