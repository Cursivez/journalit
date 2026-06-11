

import React from 'react';
import {
  useDisplayFormatter,
  useDisplayPolicy,
} from '../../../hooks/useDisplayPolicy';
import {
  shouldMaskValue,
  type DisplayValueKind,
  type DisplayValueOptions,
} from '../../../services/display/DisplayPolicy';
import {
  CurrencyConversionInfo,
  type ReviewCurrencyConversionMetadata,
  type CurrencyConversionTrade,
} from './CurrencyConversionInfo';

type DisplayTone = 'auto' | 'positive' | 'negative' | 'neutral' | 'none';

type DisplayValueComponentProps = DisplayValueOptions & {
  className?: string;
  tone?: DisplayTone;
  currencyConversion?: ReviewCurrencyConversionMetadata | null;
  conversionTrades?: CurrencyConversionTrade[];
};

type FixedKindDisplayValueProps = Omit<DisplayValueComponentProps, 'kind'>;

function getToneClassName(
  value: number | null | undefined,
  tone: DisplayTone,
  isMasked: boolean
): string | null {
  if (isMasked || tone === 'none') {
    return null;
  }

  if (tone !== 'auto') {
    return `journalit-display-value--${tone}`;
  }

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  if (value > 0) {
    return 'journalit-display-value--positive';
  }

  if (value < 0) {
    return 'journalit-display-value--negative';
  }

  return 'journalit-display-value--neutral';
}

function composeClassName(
  kind: DisplayValueKind,
  toneClassName: string | null,
  className: string | undefined,
  isMasked: boolean
): string {
  return [
    'journalit-display-value',
    `journalit-display-value--${kind}`,
    isMasked ? 'journalit-privacy-mask' : null,
    toneClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export const DisplayValue: React.FC<DisplayValueComponentProps> = ({
  className,
  tone = 'auto',
  currencyConversion,
  conversionTrades,
  ...options
}) => {
  const policy = useDisplayPolicy();
  const { formatValue } = useDisplayFormatter();
  const isMasked = shouldMaskValue(options.kind, policy);
  const toneClassName = getToneClassName(options.value, tone, isMasked);

  return (
    <span
      className={composeClassName(
        options.kind,
        toneClassName,
        className,
        isMasked
      )}
    >
      {formatValue(options)}
      <CurrencyConversionInfo
        metadata={currencyConversion}
        trades={conversionTrades}
      />
    </span>
  );
};

export const PnLValue: React.FC<FixedKindDisplayValueProps> = (props) => (
  <DisplayValue kind="pnl" {...props} />
);

export const MoneyValue: React.FC<
  FixedKindDisplayValueProps & {
    kind?: 'money' | 'balance' | 'risk' | 'drawdown' | 'notional' | 'fee';
  }
> = ({ kind = 'money', ...props }) => <DisplayValue kind={kind} {...props} />;

export const PercentValue: React.FC<
  FixedKindDisplayValueProps & { kind?: 'percentage' | 'returnPercent' }
> = ({ kind = 'percentage', ...props }) => (
  <DisplayValue kind={kind} {...props} />
);

export const RMultipleValue: React.FC<FixedKindDisplayValueProps> = (props) => (
  <DisplayValue kind="rMultiple" {...props} />
);

export const PriceValue: React.FC<FixedKindDisplayValueProps> = (props) => (
  <DisplayValue kind="price" {...props} />
);

export const MetricValue: React.FC<
  FixedKindDisplayValueProps & { kind?: 'metric' | 'count' | 'positionSize' }
> = ({ kind = 'metric', ...props }) => <DisplayValue kind={kind} {...props} />;

DisplayValue.displayName = 'DisplayValue';
PnLValue.displayName = 'PnLValue';
MoneyValue.displayName = 'MoneyValue';
PercentValue.displayName = 'PercentValue';
RMultipleValue.displayName = 'RMultipleValue';
PriceValue.displayName = 'PriceValue';
MetricValue.displayName = 'MetricValue';
