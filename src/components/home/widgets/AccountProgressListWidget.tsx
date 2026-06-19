import React from 'react';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import type { DisplayValueKind } from '../../../services/display/DisplayPolicy';

const TOTAL_SEGMENTS = 20;

export interface AccountProgressListItem<TStatus extends string = string> {
  name: string;
  accountName: string;
  percent: number;
  remaining: number;
  status: TStatus;
  currencyCode?: string;
}

interface AccountProgressListWidgetProps<TStatus extends string> {
  title: string;
  items: AccountProgressListItem<TStatus>[];
  remainingLabel: string;
  remainingKind: Extract<DisplayValueKind, 'money' | 'drawdown'>;
  maskKinds: DisplayValueKind[];
  getStatusColor: (status: TStatus) => string;
  getCompleteLabel?: (item: AccountProgressListItem<TStatus>) => string;
  completePercentageClassName?: string;
  onAccountClick: (accountName: string) => void;
}

interface AccountProgressLoadingProps {
  titleWidth?: number;
}

export const AccountProgressLoading: React.FC<AccountProgressLoadingProps> = ({
  titleWidth = 80,
}) => (
  <div className="journalit-home-account-progress journalit-home-account-progress--loading">
    <SkeletonText width={titleWidth} height="11px" />
    <div className="journalit-home-account-progress__loading-list">
      {['first', 'second', 'third'].map((key) => (
        <div key={key} className="journalit-home-account-progress__loading-row">
          <div className="journalit-home-account-progress__row-header">
            <SkeletonText width="80px" height="12px" />
            <SkeletonText width="35px" height="15px" />
          </div>
          <SkeletonBox width="100%" height={8} borderRadius="0px" />
          <SkeletonText width="100px" height="11px" />
        </div>
      ))}
    </div>
  </div>
);

interface AccountProgressStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export const AccountProgressState: React.FC<AccountProgressStateProps> = ({
  title,
  message,
  icon,
}) => (
  <div className="journalit-home-account-progress__state">
    {icon}
    <span className="journalit-home-account-progress__state-title">
      {title}
    </span>
    <span className="journalit-home-account-progress__state-message">
      {message}
    </span>
  </div>
);

export function AccountProgressListWidget<TStatus extends string>({
  title,
  items,
  remainingLabel,
  remainingKind,
  maskKinds,
  getStatusColor,
  getCompleteLabel,
  completePercentageClassName,
  onAccountClick,
}: AccountProgressListWidgetProps<TStatus>): React.ReactElement {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isMasked = maskKinds.some((kind) => shouldMask(kind));

  return (
    <div className="journalit-home-account-progress">
      <div className="journalit-home-widget__eyebrow journalit-home-account-progress__header">
        {title}
      </div>

      <div className="journalit-home-account-progress__list">
        {items.map((item) => {
          const barColor = isMasked
            ? 'var(--text-muted)'
            : getStatusColor(item.status);
          const percentDisplay =
            item.percent >= 100
              ? Math.ceil(item.percent)
              : Math.floor(item.percent);
          const filledCount = Math.min(
            TOTAL_SEGMENTS,
            Math.floor((item.percent / 100) * TOTAL_SEGMENTS)
          );
          const completeLabel = getCompleteLabel?.(item);
          const percentageClassName =
            completeLabel && !isMasked && completePercentageClassName
              ? `journalit-home-account-progress__percentage ${completePercentageClassName}`
              : 'journalit-home-account-progress__percentage';

          return (
            <div
              key={item.name}
              role="button"
              tabIndex={0}
              onClick={() => onAccountClick(item.accountName)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                e.preventDefault();
                onAccountClick(item.accountName);
              }}
              className="journalit-account-progress-row journalit-home-account-progress__row"
              style={cssVars({
                '--journalit-home-account-progress-color': barColor,
              })}
            >
              <div className="journalit-home-account-progress__row-header">
                <span className="journalit-account-progress-name">
                  {item.name}
                </span>
                <span className={percentageClassName}>
                  {completeLabel && !isMasked
                    ? completeLabel
                    : formatValue({
                        kind: 'percentage',
                        value: percentDisplay,
                        signed: false,
                        precision: 0,
                      })}
                </span>
              </div>

              <svg
                width="100%"
                height="8"
                viewBox={`0 0 ${TOTAL_SEGMENTS * 10} 8`}
                preserveAspectRatio="none"
                className="journalit-home-account-progress__bar"
              >
                {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
                  <rect
                    key={i}
                    x={i * 10}
                    y={0}
                    width={8}
                    height={8}
                    fill={
                      !isMasked && i < filledCount
                        ? barColor
                        : 'var(--text-faint)'
                    }
                    opacity={!isMasked && i < filledCount ? 0.85 : 0.2}
                  />
                ))}
              </svg>

              <div className="journalit-home-account-progress__remaining">
                {formatValue({
                  kind: remainingKind,
                  value: item.remaining,
                  currencyCode: item.currencyCode,
                })}{' '}
                {remainingLabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
