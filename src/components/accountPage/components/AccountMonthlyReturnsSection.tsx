import React from 'react';
import { useAccountPageData } from '../context/AccountPageDataContext';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { ACCOUNT_PAGE_MONTHLY_RETURNS_SECTION_TARGET_ID } from '../../../guides/accountPageGuideIds';
import { MonthlyReturnsSection } from '../../account/monthlyReturns/MonthlyReturnsSection';
import { accountDetailTradeTypes } from '../../../services/accountPage/accountDetailScope';


export const AccountMonthlyReturnsSection: React.FC = () => {
  const { accountPageData } = useAccountPageData();
  const registerTarget = useGuideTarget(
    ACCOUNT_PAGE_MONTHLY_RETURNS_SECTION_TARGET_ID
  );
  if (!accountPageData) return null;
  return (
    <MonthlyReturnsSection
      accountNames={[accountPageData.account.name]}
      tradeTypes={accountDetailTradeTypes(accountPageData.account)}
      placement="account-page"
      sectionRef={registerTarget}
    />
  );
};
