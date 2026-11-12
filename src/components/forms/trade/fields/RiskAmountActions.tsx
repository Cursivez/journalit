

import React, {
  createContext,
  use,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from 'react';
import { Button } from '../../../ui/Button';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import { SETTINGS_TAB_IDS } from '../../../../settings/types';


export const TRADE_FORM_RISK_AMOUNT_INPUT_ID =
  'journalit-trade-form-risk-amount';

interface TradeFormRiskNavigation {
  
  goToRiskAmount: () => void;
}

export const TradeFormRiskNavigationContext =
  createContext<TradeFormRiskNavigation | null>(null);


export function useTradeFormRiskNavigation(
  formRef: RefObject<HTMLFormElement | null>,
  changeTab: (tab: 'basic') => void
): TradeFormRiskNavigation {
  const changeTabRef = useRef(changeTab);
  useLayoutEffect(() => {
    changeTabRef.current = changeTab;
  });
  return useMemo(
    () => ({
      goToRiskAmount: () => {
        changeTabRef.current('basic');
        const form = formRef.current;
        form?.ownerDocument.defaultView?.requestAnimationFrame(() => {
          const input = form.querySelector<HTMLInputElement>(
            `#${TRADE_FORM_RISK_AMOUNT_INPUT_ID}`
          );
          input?.scrollIntoView({ block: 'center', behavior: 'smooth' });
          input?.focus({ preventScroll: true });
        });
      },
    }),
    [formRef]
  );
}

export function RiskAmountActions() {
  const navigation = use(TradeFormRiskNavigationContext);
  const plugin = usePlugin();

  if (!navigation && !plugin) return null;

  return (
    <div className="journalit-r-entry-actions">
      {navigation && (
        <Button
          variant="secondary"
          size="small"
          onClick={navigation.goToRiskAmount}
        >
          {t('form.r-entry.set-risk-amount')}
        </Button>
      )}
      {plugin && (
        <Button
          variant="plain"
          size="small"
          onClick={() =>
            plugin.openSettingsToTab(SETTINGS_TAB_IDS.CALCULATIONS)
          }
        >
          {t('form.r-entry.set-default-risk')}
        </Button>
      )}
    </div>
  );
}
