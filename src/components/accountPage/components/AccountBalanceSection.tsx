

import React, { useCallback, useId, useRef } from 'react';
import { useAccountPageData } from '../context/AccountPageDataContext';
import { AccountBalanceChart } from '../../account/charts/AccountBalanceChart';
import { t } from '../../../lang/helpers';
import { useElementBreakpoint } from '../../../hooks/useResizeObserver';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { ACCOUNT_PAGE_BALANCE_SECTION_TARGET_ID } from '../../../guides/accountPageGuideIds';


const CHART_WIDTH_THRESHOLDS = [1100, 900, 700, 520] as const;
const CHART_HEIGHTS = [360, 320, 280, 240, 200] as const;


export const AccountBalanceSection: React.FC = () => {
  const { accountPageData, isLoading, selectedPhaseId } = useAccountPageData();
  const sectionRef = useRef<HTMLDivElement>(null);
  const widthStep = useElementBreakpoint(sectionRef, CHART_WIDTH_THRESHOLDS);
  const registerBalanceSectionTarget = useGuideTarget(
    ACCOUNT_PAGE_BALANCE_SECTION_TARGET_ID
  );
  const headingId = useId();

  const setSectionRef = useCallback(
    (element: HTMLDivElement | null) => {
      sectionRef.current = element;
      registerBalanceSectionTarget(element);
    },
    [registerBalanceSectionTarget]
  );

  if (isLoading || !accountPageData) {
    return (
      <div
        className="account-balance-section"
        ref={setSectionRef}
        role="region"
        aria-labelledby={headingId}
      >
        <h3 id={headingId} className="journalit-account-page-sr-only">
          {t('view.account-page.balance-chart-title')}
        </h3>
        <div className="balance-chart-loading">
          <p>{t('view.account-page.balance-chart-loading')}</p>
        </div>
      </div>
    );
  }

  
  const currencyOverride = accountPageData.metrics.isMultiCurrency
    ? accountPageData.metrics.conversionBaseCurrency
    : undefined;

  return (
    <div
      className="account-balance-section"
      ref={setSectionRef}
      role="region"
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="journalit-account-page-sr-only">
        {t('view.account-page.balance-chart-title')}
      </h3>
      <div className="balance-chart-container">
        <AccountBalanceChart
          account={accountPageData.account}
          height={CHART_HEIGHTS[widthStep]}
          currencyOverride={currencyOverride}
          selectedPhaseId={selectedPhaseId}
        />
      </div>
    </div>
  );
};
