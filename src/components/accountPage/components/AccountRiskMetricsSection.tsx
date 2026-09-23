

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
import { parseCuratedCurrencyCode } from '../../../utils/currencyConfig';
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

function HorizontalProgressBar({
  value,
  className,
}: {
  value: number;
  className: string;
}) {
  return (
    <div className="journalit-account-risk-bar">
      <div className="journalit-account-risk-bar-track">
        <div
          className={`journalit-account-risk-bar-fill ${className}`}
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
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="journalit-account-risk-detail-row">
      <span className="journalit-account-risk-detail-label">{label}</span>
      {children}
    </div>
  );
}

interface DrawdownMetricBoxProps {
  account: AccountData;
  currency: string;
  defaultRiskAmount: number;
  drawdownUsed: number;
  status: DrawdownStatus | null;
  isRiskProgressMasked: boolean;
  formatValue: FormatDisplayValue;
}

function DrawdownMetricBox({
  account,
  currency,
  defaultRiskAmount,
  drawdownUsed,
  status,
  isRiskProgressMasked,
  formatValue,
}: DrawdownMetricBoxProps) {
  const amounts = calculateDrawdownAmounts(account);

  return (
    <div className="journalit-account-risk-metric">
      <div className="journalit-account-risk-metric-header">
        <div className="journalit-account-risk-metric-title-row">
          <h4 className="journalit-account-risk-metric-title">
            {t('account.risk-metrics.drawdown-used')}
          </h4>
          {status && (
            <span
              className={`journalit-account-risk-badge ${status === 'BREACHED' ? 'is-breached' : 'is-in-progress'}`}
            >
              {status === 'BREACHED'
                ? t('account.risk-metrics.status.breached')
                : t('account.risk-metrics.status.in-progress')}
            </span>
          )}
        </div>
        <div className="journalit-account-risk-metric-value">
          {formatValue({
            kind: 'percentage',
            value: drawdownUsed,
            precision: 1,
          })}
        </div>
      </div>

      {!isRiskProgressMasked && (
        <HorizontalProgressBar
          value={drawdownUsed}
          className={
            drawdownUsed >= 75
              ? 'is-critical'
              : drawdownUsed >= 50
                ? 'is-warning'
                : 'is-safe'
          }
        />
      )}

      <div className="journalit-account-risk-details">
        <DetailRow label={t('account.risk-metrics.label.used')}>
          <span className="journalit-account-risk-detail-value">
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
          <span className="journalit-account-risk-detail-value">
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
          <span className="journalit-account-risk-detail-value">
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
  status,
  isRiskProgressMasked,
  formatValue,
}: ProfitTargetMetricBoxProps) {
  return (
    <div className="journalit-account-risk-metric">
      <div className="journalit-account-risk-metric-header">
        <div className="journalit-account-risk-metric-title-row">
          <h4 className="journalit-account-risk-metric-title">
            {t('account.risk-metrics.profit-target')}
          </h4>
          {status && (
            <span
              className={`journalit-account-risk-badge ${status === 'ACHIEVED' ? 'is-achieved' : 'is-in-progress'}`}
            >
              {status === 'ACHIEVED'
                ? t('account.risk-metrics.status.achieved')
                : t('account.risk-metrics.status.in-progress')}
            </span>
          )}
        </div>
        <div className="journalit-account-risk-metric-value">
          {formatValue({
            kind: 'returnPercent',
            value: profitTargetProgress,
            precision: 1,
            signed: false,
          })}
        </div>
      </div>

      {!isRiskProgressMasked && (
        <HorizontalProgressBar
          value={profitTargetProgress}
          className={
            profitTargetProgress >= 100 ? 'is-complete' : 'is-progress'
          }
        />
      )}

      <div className="journalit-account-risk-details">
        <DetailRow label={t('account.risk-metrics.label.progress')}>
          <span className="journalit-account-risk-detail-value">
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
          <span className="journalit-account-risk-detail-value">
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
          <span className="journalit-account-risk-detail-value">
            {formatValue({
              kind: 'pnl',
              value: profitTargetAmount - progressAmount,
              currencyCode: currency,
              rMultiple:
                defaultRiskAmount > 0
                  ? (profitTargetAmount - progressAmount) / defaultRiskAmount
                  : undefined,
            })}
          </span>
        </DetailRow>
        {account.profitTargetDate && (
          <DetailRow label={t('account.risk-metrics.label.target-date')}>
            <span className="journalit-account-risk-detail-value">
              {formatDateDisplay(new Date(account.profitTargetDate))}
            </span>
          </DetailRow>
        )}
      </div>
    </div>
  );
}


export const AccountRiskMetricsSection: React.FC = () => {
  const { accountPageData } = useAccountPageData();
  const registerRiskSectionTarget = useGuideTarget(
    ACCOUNT_PAGE_RISK_SECTION_TARGET_ID
  );
  const { currency: globalCurrency } = useCurrency();
  const plugin = usePlugin();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isRiskProgressMasked = shouldMask('percentage');

  if (!accountPageData) {
    return null;
  }

  const { account } = accountPageData;

  const hasDrawdownSet =
    account.drawdownType !== DrawdownType.NONE &&
    Boolean(
      account.drawdownAmount > 0 ||
      (account.drawdownType === DrawdownType.MANUAL &&
        account.currentDrawdownSnapshot)
    );
  const hasProfitTargetSet =
    account.hasProfitTarget && account.profitTarget > 0;

  if (!hasDrawdownSet && !hasProfitTargetSet) {
    return null;
  }

  
  
  const currency =
    accountPageData.metrics.isMultiCurrency &&
    accountPageData.metrics.conversionBaseCurrency
      ? parseCuratedCurrencyCode(accountPageData.metrics.conversionBaseCurrency)
      : account.currency || globalCurrency;

  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount ?? 0;

  const drawdownUsed = calculateDrawdownUsed(account);
  const profitTargetProgress = calculateProfitTargetProgress(account);
  const progressAmount = calculateAccountGrowthAmount(account);
  const profitTargetAmount =
    account.profitTargetType === ProfitTargetType.PERCENTAGE
      ? (account.initialBalance * account.profitTarget) / 100
      : account.profitTarget;

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
    <section className="journalit-account-risk" ref={registerRiskSectionTarget}>
      <div className="journalit-account-section-header-centered">
        <span
          className="journalit-account-section-header-centered-line"
          aria-hidden="true"
        />
        <h3 className="journalit-account-section-header-centered-title">
          {t('account.risk-metrics.title')}
        </h3>
        <span
          className="journalit-account-section-header-centered-line"
          aria-hidden="true"
        />
      </div>

      <div className="journalit-account-risk-grid">
        {hasDrawdownSet && (
          <DrawdownMetricBox
            account={account}
            currency={currency}
            defaultRiskAmount={defaultRiskAmount}
            drawdownUsed={drawdownUsed}
            status={drawdownStatus}
            isRiskProgressMasked={isRiskProgressMasked}
            formatValue={formatValue}
          />
        )}

        {hasProfitTargetSet && (
          <ProfitTargetMetricBox
            account={account}
            currency={currency}
            defaultRiskAmount={defaultRiskAmount}
            profitTargetProgress={profitTargetProgress}
            progressAmount={progressAmount}
            profitTargetAmount={profitTargetAmount}
            status={profitTargetStatus}
            isRiskProgressMasked={isRiskProgressMasked}
            formatValue={formatValue}
          />
        )}
      </div>
    </section>
  );
};
