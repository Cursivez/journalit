import React from 'react';
import { useAccountPageData } from '../context/AccountPageDataContext';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { ACCOUNT_PAGE_MONTHLY_RETURNS_SECTION_TARGET_ID } from '../../../guides/accountPageGuideIds';
import { MonthlyReturnsSection } from '../../account/monthlyReturns/MonthlyReturnsSection';
import type { TradeType } from '../../../services/tradelog/types';


const ACCOUNT_PAGE_TRADE_TYPES: readonly TradeType[] = ['regular'];


export const AccountMonthlyReturnsSection: React.FC = () => {
  const { accountPageData } = useAccountPageData();
  const registerTarget = useGuideTarget(
    ACCOUNT_PAGE_MONTHLY_RETURNS_SECTION_TARGET_ID
  );
  if (!accountPageData) return null;
  return (
    <MonthlyReturnsSection
      accountNames={[accountPageData.account.name]}
      tradeTypes={ACCOUNT_PAGE_TRADE_TYPES}
      placement="account-page"
      sectionRef={registerTarget}
    />
  );
};
