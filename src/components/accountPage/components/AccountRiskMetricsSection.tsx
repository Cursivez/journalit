

import React from 'react';
import { useAccountPageData } from '../context/AccountPageDataContext';
import {
  calculateAccountGrowthAmount,
  calculateDrawdownUsed,
  calculateProfitTargetProgress,
} from '../../account/dashboard/utils';
import {
  AccountData,
  DrawdownType,
  ProfitTargetType,
} from '../../../services/account/types';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { formatDateDisplay } from '../../../utils/dateUtils';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { usePlugin } from '../../../hooks/usePlugin';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { ACCOUNT_PAGE_RISK_SECTION_TARGET_ID } from '../../../guides/accountPageGuideIds';

interface DrawdownAmounts {
  usedAmount: number;
  remainingAmount: number;
  displayLimit: number;
}

type FormatDisplayValue = ReturnType<typeof useDisplayFormatter>['formatValue'];
type RiskProgressStatus = 'IN PROGRESS';
type DrawdownStatus = 'BREACHED' | RiskProgressStatus;
type ProfitTargetStatus = 'ACHIEVED' | RiskProgressStatus;

function calculateDrawdownAmounts(account: AccountData): DrawdownAmounts {
  let usedAmount: number;
  let remainingAmount: number;
  let displayLimit: number;

  if (
    account.drawdownType === DrawdownType.MANUAL &&
    account.currentDrawdownSnapshot
  ) {
    displayLimit = account.drawdownAmount;
    remainingAmount =
      account.currentBalance - account.currentDrawdownSnapshot.drawdownLimit;
    usedAmount = account.drawdownAmount - remainingAmount;
  } else {
    displayLimit = account.drawdownAmount;
    usedAmount = account.initialBalance - account.currentBalance;
    remainingAmount = displayLimit - usedAmount;
  }

  return {
    usedAmount: Math.max(0, Math.min(displayLimit, usedAmount)),
    remainingAmount: Math.max(0, Math.min(displayLimit, remainingAmount)),
    displayLimit,
  };
}

function SectionHeader() {
  return (
    <div className="section-header-centered">
      <span className="section-header-line"></span>
      <h3 className="section-header-title">
        {t('account.risk-metrics.title')}
      </h3>
      <span className="section-header-line"></span>
    </div>
  );
}

function HorizontalProgressBar({
  value,
  className,
}: {
  value: number;
  className: string;
}) {
  return (
    <div className="horizontal-bar-container">
      <div className="horizontal-bar-track">
        <div
          className={`horizontal-bar-fill ${className}`}
          style={cssVars({
            '--journalit-horizontal-bar-fill-width': `${Math.min(100, value)}%`,
          })}
        />
      </div>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="detail-row">
      {label && <span className="detail-label">{label}</span>}
      {children}
    </div>
  );
}

interface DrawdownMetricBoxProps {
  account: AccountData;
  currency: string;
  defaultRiskAmount: number;
  drawdownUsed: number;
  hasDrawdownSet: boolean;
  status: DrawdownStatus | null;
  isRiskProgressMasked: boolean;
  formatValue: FormatDisplayValue;
}

function DrawdownMetricBox({
  account,
  currency,
  defaultRiskAmount,
  drawdownUsed,
  hasDrawdownSet,
  status,
  isRiskProgressMasked,
  formatValue,
}: DrawdownMetricBoxProps) {
  const amounts = hasDrawdownSet ? calculateDrawdownAmounts(account) : null;

  return (
    <div className={`risk-metric-box ${!hasDrawdownSet ? 'not-set' : ''}`}>
      <div className="risk-metric-header">
        <div className="header-left">
          <div className="title-with-badge">
            <h4 className="risk-metric-title">
              {t('account.risk-metrics.drawdown-used')}
            </h4>
            {status && (
              <span
                className={`risk-status-badge ${status === 'BREACHED' ? 'breached' : 'in-progress'}`}
              >
                {status === 'BREACHED'
                  ? t('account.risk-metrics.status.breached')
                  : t('account.risk-metrics.status.in-progress')}
              </span>
            )}
          </div>
        </div>
        <div
          className={`risk-metric-percentage ${!hasDrawdownSet ? 'not-set' : ''}`}
        >
          {hasDrawdownSet
            ? formatValue({
                kind: 'percentage',
                value: drawdownUsed,
                precision: 1,
              })
            : t('account.risk-metrics.not-set')}
        </div>
      </div>

      {hasDrawdownSet && !isRiskProgressMasked && (
        <HorizontalProgressBar
          value={drawdownUsed}
          className={
            drawdownUsed >= 75
              ? 'critical'
              : drawdownUsed >= 50
                ? 'warning'
                : 'safe'
          }
        />
      )}

      <div className="risk-metric-details">
        {amounts ? (
          <>
            <DetailRow label={t('account.risk-metrics.label.used')}>
              <span className="detail-value">
                {formatValue({
                  kind: 'drawdown',
                  value: amounts.usedAmount,
                  currencyCode: currency,
                  rMultiple:
                    defaultRiskAmount > 0
                      ? amounts.usedAmount / defaultRiskAmount
                      : undefined,
                })}
              </span>
            </DetailRow>
            <DetailRow label={t('account.risk-metrics.label.limit')}>
              <span className="detail-value">
                {formatValue({
                  kind: 'drawdown',
                  value: amounts.displayLimit,
                  currencyCode: currency,
                  rMultiple:
                    defaultRiskAmount > 0
                      ? amounts.displayLimit / defaultRiskAmount
                      : undefined,
                })}
              </span>
            </DetailRow>
            <DetailRow label={t('account.risk-metrics.label.remaining')}>
              <span className="detail-value">
                {formatValue({
                  kind: 'drawdown',
                  value: amounts.remainingAmount,
                  currencyCode: currency,
                  rMultiple:
                    defaultRiskAmount > 0
                      ? amounts.remainingAmount / defaultRiskAmount
                      : undefined,
                })}
              </span>
            </DetailRow>
          </>
        ) : (
          <DetailRow>
            <span className="detail-value no-limit">
              {t('account.risk-metrics.no-drawdown')}
            </span>
          </DetailRow>
        )}
      </div>
    </div>
  );
}

interface ProfitTargetMetricBoxProps {
  account: AccountData;
  currency: string;
  defaultRiskAmount: number;
  profitTargetProgress: number;
  progressAmount: number;
  profitTargetAmount: number;
  hasProfitTargetSet: boolean;
  status: ProfitTargetStatus | null;
  isRiskProgressMasked: boolean;
  formatValue: FormatDisplayValue;
}

function ProfitTargetMetricBox({
  account,
  currency,
  defaultRiskAmount,
  profitTargetProgress,
  progressAmount,
  profitTargetAmount,
  hasProfitTargetSet,
  status,
  isRiskProgressMasked,
  formatValue,
}: ProfitTargetMetricBoxProps) {
  return (
    <div className={`risk-metric-box ${!hasProfitTargetSet ? 'not-set' : ''}`}>
      <div className="risk-metric-header">
        <div className="header-left">
          <div className="title-with-badge">
            <h4 className="risk-metric-title">
              {t('account.risk-metrics.profit-target')}
            </h4>
            {status && (
              <span
                className={`risk-status-badge ${status === 'ACHIEVED' ? 'achieved' : 'in-progress'}`}
              >
                {status === 'ACHIEVED'
                  ? t('account.risk-metrics.status.achieved')
                  : t('account.risk-metrics.status.in-progress')}
              </span>
            )}
          </div>
        </div>
        <div
          className={`risk-metric-percentage ${!hasProfitTargetSet ? 'not-set' : ''}`}
        >
          {hasProfitTargetSet
            ? formatValue({
                kind: 'returnPercent',
                value: profitTargetProgress,
                precision: 1,
                signed: false,
              })
            : t('account.risk-metrics.not-set')}
        </div>
      </div>

      {hasProfitTargetSet && !isRiskProgressMasked && (
        <HorizontalProgressBar
          value={profitTargetProgress}
          className={profitTargetProgress >= 100 ? 'complete' : 'progress'}
        />
      )}

      <div className="risk-metric-details">
        {hasProfitTargetSet ? (
          <>
            <DetailRow label={t('account.risk-metrics.label.progress')}>
              <span className="detail-value">
                {formatValue({
                  kind: 'pnl',
                  value: progressAmount,
                  currencyCode: currency,
                  rMultiple:
                    defaultRiskAmount > 0
                      ? progressAmount / defaultRiskAmount
                      : undefined,
                })}
              </span>
            </DetailRow>
            <DetailRow label={t('account.risk-metrics.label.target')}>
              <span className="detail-value">
                {formatValue({
                  kind: 'pnl',
                  value: profitTargetAmount,
                  currencyCode: currency,
                  rMultiple:
                    defaultRiskAmount > 0
                      ? profitTargetAmount / defaultRiskAmount
                      : undefined,
                })}
              </span>
            </DetailRow>
            <DetailRow label={t('account.risk-metrics.label.remaining')}>
              <span className="detail-value">
                {formatValue({
                  kind: 'pnl',
                  value: profitTargetAmount - progressAmount,
                  currencyCode: currency,
                  rMultiple:
                    defaultRiskAmount > 0
                      ? (profitTargetAmount - progressAmount) /
                        defaultRiskAmount
                      : undefined,
                })}
              </span>
            </DetailRow>
            {account.profitTargetDate && (
              <DetailRow label={t('account.risk-metrics.label.target-date')}>
                <span className="detail-value">
                  {formatDateDisplay(new Date(account.profitTargetDate))}
                </span>
              </DetailRow>
            )}
          </>
        ) : (
          <DetailRow>
            <span className="detail-value no-target">
              {t('account.risk-metrics.no-profit-target')}
            </span>
          </DetailRow>
        )}
      </div>
    </div>
  );
}


export const AccountRiskMetricsSection: React.FC = () => {
  const { accountPageData, isLoading } = useAccountPageData();
  const registerRiskSectionTarget = useGuideTarget(
    ACCOUNT_PAGE_RISK_SECTION_TARGET_ID
  );
  const { currency: globalCurrency } = useCurrency();
  const plugin = usePlugin();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isRiskProgressMasked = shouldMask('percentage');

  
  const currency =
    accountPageData?.metrics.isMultiCurrency &&
    accountPageData?.metrics.conversionBaseCurrency
      ? (accountPageData.metrics
          .conversionBaseCurrency as typeof globalCurrency)
      : accountPageData?.account.currency || globalCurrency;

  if (isLoading || !accountPageData) {
    return (
      <div
        className="account-risk-metrics-section"
        ref={registerRiskSectionTarget}
      >
        <div className="risk-metrics-loading">
          <p>{t('account.risk-metrics.loading')}</p>
        </div>
      </div>
    );
  }

  const { account } = accountPageData;

  
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount ?? 0;

  
  const drawdownUsed = calculateDrawdownUsed(account);
  const profitTargetProgress = calculateProfitTargetProgress(account);
  const progressAmount = calculateAccountGrowthAmount(account);
  const profitTargetAmount =
    account.profitTargetType === ProfitTargetType.PERCENTAGE
      ? (account.initialBalance * account.profitTarget) / 100
      : account.profitTarget;

  
  const hasDrawdownSet =
    account.drawdownType !== DrawdownType.NONE &&
    Boolean(
      account.drawdownAmount > 0 ||
      (account.drawdownType === DrawdownType.MANUAL &&
        account.currentDrawdownSnapshot)
    );

  
  const hasProfitTargetSet =
    account.hasProfitTarget && account.profitTarget > 0;

  
  const drawdownStatus =
    !isRiskProgressMasked && hasDrawdownSet
      ? drawdownUsed >= 100
        ? 'BREACHED'
        : 'IN PROGRESS'
      : null;
  const profitTargetStatus =
    !isRiskProgressMasked && hasProfitTargetSet
      ? profitTargetProgress >= 100
        ? 'ACHIEVED'
        : 'IN PROGRESS'
      : null;

  return (
    <div
      className="account-risk-metrics-section"
      ref={registerRiskSectionTarget}
    >
      <SectionHeader />

      <div className="risk-metrics-container">
        <DrawdownMetricBox
          account={account}
          currency={currency}
          defaultRiskAmount={defaultRiskAmount}
          drawdownUsed={drawdownUsed}
          hasDrawdownSet={hasDrawdownSet}
          status={drawdownStatus}
          isRiskProgressMasked={isRiskProgressMasked}
          formatValue={formatValue}
        />

        <ProfitTargetMetricBox
          account={account}
          currency={currency}
          defaultRiskAmount={defaultRiskAmount}
          profitTargetProgress={profitTargetProgress}
          progressAmount={progressAmount}
          profitTargetAmount={profitTargetAmount}
          hasProfitTargetSet={hasProfitTargetSet}
          status={profitTargetStatus}
          isRiskProgressMasked={isRiskProgressMasked}
          formatValue={formatValue}
        />
      </div>
    </div>
  );
};
