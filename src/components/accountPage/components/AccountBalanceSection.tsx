

import React from 'react';
import { useAccountPageData } from '../context/AccountPageDataContext';
import { AccountBalanceChart } from '../../account/charts/AccountBalanceChart';
import { t } from '../../../lang/helpers';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { ACCOUNT_PAGE_BALANCE_SECTION_TARGET_ID } from '../../../guides/accountPageGuideIds';


export const AccountBalanceSection: React.FC = () => {
  const { accountPageData, isLoading } = useAccountPageData();
  const registerBalanceSectionTarget = useGuideTarget(
    ACCOUNT_PAGE_BALANCE_SECTION_TARGET_ID
  );

  if (isLoading || !accountPageData) {
    return (
      <div
        className="account-balance-section"
        ref={registerBalanceSectionTarget}
      >
        <h3>{t('view.account-page.balance-chart-title')}</h3>
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
    <div className="account-balance-section" ref={registerBalanceSectionTarget}>
      <div className="balance-chart-container">
        <AccountBalanceChart
          account={accountPageData.account}
          height={400}
          currencyOverride={currencyOverride}
        />
      </div>
    </div>
  );
};
