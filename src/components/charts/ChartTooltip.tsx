

import React from 'react';
import { TooltipProps } from 'recharts';
import {
  TOOLTIP_CLASS_NAMES,
  formatTooltipValue,
} from '../../utils/chartUtils';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import type { DisplayValueKind } from '../../services/display/DisplayPolicy';

interface TooltipItem {
  label: string;
  value: number | string;
  type?: 'pnl' | 'drawdown' | 'rMultiple' | 'percentage' | 'number' | 'text';
  isPrimary?: boolean;
  isPositive?: boolean;
  isNegative?: boolean;
  rMultiple?: number;
}

interface TooltipFormatterResult {
  title: string;
  primaryValue: TooltipItem;
  items?: TooltipItem[];
}


interface ChartTooltipCustomProps<
  TPayload extends object = Record<string, unknown>,
> {
  dateKey?: string;
  valueKey?: string;
  valueType?: 'pnl' | 'drawdown' | 'number';
  additionalItems?: (payload: TPayload) => TooltipItem[];
  formatter?: (payload: TPayload) => TooltipFormatterResult;
  displayRMultiples?: boolean;
  currencyOverride?: string;
}


type ChartTooltipProps<TPayload extends object = Record<string, unknown>> =
  Omit<Partial<TooltipProps<number, string>>, 'formatter'> &
    ChartTooltipCustomProps<TPayload> & {
      payload?: Array<{ payload: TPayload }>;
    };


const getTooltipDisplayKind = (
  type: TooltipItem['type']
): DisplayValueKind | null => {
  if (type === 'pnl') return 'pnl';
  if (type === 'drawdown') return 'drawdown';
  if (type === 'rMultiple') return 'rMultiple';
  if (type === 'percentage') return 'drawdown';
  return null;
};

const getTooltipItemToneClass = (
  item: TooltipItem,
  shouldMask: ReturnType<typeof useDisplayFormatter>['shouldMask']
): string => {
  const kind = getTooltipDisplayKind(item.type);
  if (kind && shouldMask(kind)) {
    return '';
  }

  if (item.isPositive) {
    return 'journalit-chart-tooltip-info--positive';
  }

  if (item.isNegative) {
    return 'journalit-chart-tooltip-info--negative';
  }

  return '';
};

const formatTooltipItemValue = (
  item: TooltipItem,
  currency: string,
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'],
  shouldMask: ReturnType<typeof useDisplayFormatter>['shouldMask'],
  displayRMultiples?: boolean
): string => {
  
  if (item.type === 'text' || typeof item.value === 'string') {
    return item.value.toString();
  }

  
  if (typeof item.value === 'number') {
    const displayKind = getTooltipDisplayKind(item.type);
    const rMultiple = displayRMultiples === false ? undefined : item.rMultiple;

    if (displayKind && shouldMask(displayKind)) {
      return formatValue({
        kind: displayKind,
        value: item.value,
        currencyCode: currency,
        rMultiple,
      });
    }
    if (item.type === 'pnl') {
      return formatValue({
        kind: 'pnl',
        value: item.value,
        currencyCode: currency,
        rMultiple,
      });
    }
    if (item.type === 'rMultiple') {
      return formatValue({ kind: 'rMultiple', value: item.value });
    }
    if (item.type === 'drawdown') {
      return formatTooltipValue(
        item.value,
        'drawdown',
        currency,
        displayRMultiples,
        item.rMultiple
      );
    }
    if (item.type === 'percentage') {
      return formatValue({
        kind: 'percentage',
        value: item.value,
        signed: true,
        precision: 1,
      });
    }
    return formatTooltipValue(item.value, 'number', currency);
  }

  
  return String(item.value);
};

const getPayloadValue = (payload: object, key: string): unknown =>
  Object.prototype.hasOwnProperty.call(payload, key)
    ? Reflect.get(payload, key)
    : undefined;

type DisplayFormatter = ReturnType<typeof useDisplayFormatter>;


const valueToneClass = (
  masked: boolean,
  positive: boolean | undefined,
  negative: boolean | undefined
): string => {
  if (masked) return '';
  if (positive) return TOOLTIP_CLASS_NAMES.positive;
  return negative ? TOOLTIP_CLASS_NAMES.negative : '';
};

interface TooltipHeadline {
  title: string | undefined;
  text: string;
  className: string;
}


function formattedHeadline(
  { title, primaryValue }: TooltipFormatterResult,
  currency: string,
  { formatValue, shouldMask }: DisplayFormatter,
  displayRMultiples: boolean | undefined
): TooltipHeadline {
  const primaryKind = getTooltipDisplayKind(primaryValue.type);
  const isPrimaryMasked = primaryKind ? shouldMask(primaryKind) : false;
  return {
    title,
    text: formatTooltipItemValue(
      primaryValue,
      currency,
      formatValue,
      shouldMask,
      displayRMultiples
    ),
    className: valueToneClass(
      isPrimaryMasked,
      primaryValue.isPositive,
      primaryValue.isNegative
    ),
  };
}

const numberOrUndefined = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined;


function standardHeadline(
  data: object,
  {
    dateKey,
    valueKey,
    valueType,
  }: {
    dateKey: string;
    valueKey: string;
    valueType: 'pnl' | 'drawdown' | 'number';
  },
  currency: string,
  { formatValue, shouldMask }: DisplayFormatter,
  displayRMultiples: boolean | undefined
): TooltipHeadline {
  const dateValue = getPayloadValue(data, dateKey);
  const value = numberOrUndefined(getPayloadValue(data, valueKey)) ?? 0;
  const rMultiple = numberOrUndefined(
    getPayloadValue(data, 'cumulativeR') ??
      getPayloadValue(data, 'tradeR') ??
      getPayloadValue(data, 'rMultiple')
  );
  const isProfitable = valueType === 'pnl' ? value >= 0 : false;
  const isNegative = valueType === 'drawdown' ? true : value < 0;

  const valueKind =
    valueType === 'pnl' || valueType === 'drawdown' ? valueType : null;
  const isValueMasked = valueKind ? shouldMask(valueKind) : false;
  const displayRMultiple = displayRMultiples === false ? undefined : rMultiple;
  const maskedKind = isValueMasked ? valueKind : null;
  const formatKind = valueType === 'pnl' ? 'pnl' : maskedKind;
  return {
    title: typeof dateValue === 'string' ? dateValue : undefined,
    text: formatKind
      ? formatValue({
          kind: formatKind,
          value,
          currencyCode: currency,
          rMultiple: displayRMultiple,
        })
      : formatTooltipValue(
          value,
          valueType,
          currency,
          displayRMultiples,
          rMultiple
        ),
    className: valueToneClass(isValueMasked, isProfitable, isNegative),
  };
}

function TooltipInfoRow({
  item,
  currency,
  displayRMultiples,
}: {
  item: TooltipItem;
  currency: string;
  displayRMultiples: boolean | undefined;
}) {
  const { formatValue, shouldMask } = useDisplayFormatter();
  return (
    <div
      className={`${TOOLTIP_CLASS_NAMES.info} ${getTooltipItemToneClass(
        item,
        shouldMask
      )}`.trim()}
    >
      {item.label ? `${item.label}: ` : ''}
      {formatTooltipItemValue(
        item,
        currency,
        formatValue,
        shouldMask,
        displayRMultiples
      )}
    </div>
  );
}


function ChartTooltipComponent<
  TPayload extends object = Record<string, unknown>,
>({
  active,
  payload,
  dateKey = 'date',
  valueKey = 'pnl',
  valueType = 'pnl',
  additionalItems,
  formatter,
  displayRMultiples,
  currencyOverride,
}: ChartTooltipProps<TPayload>) {
  const { currency: globalCurrency } = useCurrency();
  const displayFormatter = useDisplayFormatter();
  const currency = currencyOverride || globalCurrency;

  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  
  
  const formatted = formatter?.(data);
  const headline = formatted
    ? formattedHeadline(
        formatted,
        currency,
        displayFormatter,
        displayRMultiples
      )
    : standardHeadline(
        data,
        { dateKey, valueKey, valueType },
        currency,
        displayFormatter,
        displayRMultiples
      );
  const items = formatted ? formatted.items : additionalItems?.(data);

  return (
    <div className={TOOLTIP_CLASS_NAMES.container}>
      <div className={TOOLTIP_CLASS_NAMES.date}>{headline.title}</div>
      <div className={`${TOOLTIP_CLASS_NAMES.value} ${headline.className}`}>
        {headline.text}
      </div>
      {items?.map((item) => (
        <TooltipInfoRow
          key={`${item.label}-${item.value}-${item.rMultiple ?? 'no-r'}`}
          item={item}
          currency={currency}
          displayRMultiples={displayRMultiples}
        />
      ))}
    </div>
  );
}

export const ChartTooltip = ChartTooltipComponent;
