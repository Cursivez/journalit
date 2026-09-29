

import React, { useEffect, useId, useState } from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../../../main';
import { ArrowRight, Info } from '../../../shared/icons/ObsidianIcon';
import { t, tPlural } from '../../../../lang/helpers';
import { useCachedBackendProEntitlement } from '../../../../hooks/useBackendProEntitlement';
import { evaluateManualTradeNudge } from '../../../../services/upgrade/manualTradeNudge';
import { markUpgradeOrigin } from '../../../../services/upgrade/upgradeOrigin';

type CachedEntitlementStatus = ReturnType<
  typeof useCachedBackendProEntitlement
>['entitlementStatus'];


const isKnownNonPro = (status: CachedEntitlementStatus): boolean =>
  status === 'free' || status === 'signed_out';


function resolveQualifiedManualTradeCount(
  plugin: JournalitPlugin,
  entitlementStatus: CachedEntitlementStatus
): number | null {
  if (!isKnownNonPro(entitlementStatus)) return null;
  if (plugin.settings.trade.manualTradeImportNudgeShown) return null;
  if (plugin.settingsManager.isSampleContextActive()) return null;

  const { eligible, manualTradeCount } = evaluateManualTradeNudge(
    plugin.tradeService.getManualTradeCreationTimes()
  );
  return eligible ? manualTradeCount : null;
}

function markManualTradeImportNudgeShown(plugin: JournalitPlugin): void {
  if (plugin.settings.trade.manualTradeImportNudgeShown) return;
  plugin.settings.trade.manualTradeImportNudgeShown = true;
  void plugin.saveSettings().catch((error: unknown) => {
    console.error('[TradeForm] Failed to persist Trade Import nudge:', error);
  });
}


async function openTradeImportFromNudge(
  plugin: JournalitPlugin,
  closeForm: () => Promise<boolean> | boolean
): Promise<void> {
  if (!(await closeForm())) return;

  try {
    await plugin.viewManager.openCSVImportView();
    markUpgradeOrigin('manualTradeNudge', 'csvImport');
  } catch (error) {
    console.error('[TradeForm] Failed to open Trade Import:', error);
    new Notice(
      t('notice.error.open-csv-import', {
        error: error instanceof Error ? error.message : String(error),
      })
    );
  }
}


interface ManualTradeImportNudgeProps {
  plugin: JournalitPlugin;
  disabled: boolean;
  
  closeForm: () => Promise<boolean> | boolean;
}

export const ManualTradeImportNudge: React.FC<ManualTradeImportNudgeProps> = ({
  plugin,
  disabled,
  closeForm,
}) => {
  const headingId = useId();
  const { entitlementStatus } = useCachedBackendProEntitlement(plugin);
  
  
  const [manualTradeCount] = useState(() =>
    resolveQualifiedManualTradeCount(plugin, entitlementStatus)
  );
  const [isDismissed, setIsDismissed] = useState(false);

  
  
  const isVisible =
    manualTradeCount !== null &&
    !isDismissed &&
    isKnownNonPro(entitlementStatus);

  
  
  useEffect(() => {
    if (isVisible) markManualTradeImportNudgeShown(plugin);
  }, [isVisible, plugin]);

  if (!isVisible) return null;

  return (
    <section
      className="journalit-trade-form-import-nudge"
      aria-labelledby={headingId}
    >
      <Info
        size={16}
        className="journalit-trade-form-import-nudge__icon"
        aria-hidden="true"
      />
      <div className="journalit-trade-form-import-nudge__copy">
        <p id={headingId} className="journalit-trade-form-import-nudge__title">
          {tPlural('form.manual-import-nudge.title', manualTradeCount)}
        </p>
        <p className="journalit-trade-form-import-nudge__body">
          {t('form.manual-import-nudge.body')}
        </p>
        <div className="journalit-trade-form-import-nudge__actions">
          <button
            type="button"
            className="journalit-trade-form-import-nudge__cta"
            onClick={() => void openTradeImportFromNudge(plugin, closeForm)}
            disabled={disabled}
          >
            {t('form.manual-import-nudge.cta')}
            <ArrowRight size={12} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="journalit-trade-form-import-nudge__dismiss"
            onClick={() => setIsDismissed(true)}
          >
            {t('form.manual-import-nudge.dismiss')}
          </button>
        </div>
      </div>
    </section>
  );
};
