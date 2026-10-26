
import React from 'react';
import { SkeletonBox } from '../../../shared/SkeletonBox';
import type {
  CurrencyConversionTrade,
  ReviewCurrencyConversionMetadata,
} from '../../../shared/display/CurrencyConversionInfo';
import { BestWorstCard } from './BestWorstCard';

interface BestWorstVisibility {
  showBest?: boolean;
  showWorst?: boolean;
}

function bestWorstGridClassName(config: {
  showBest?: boolean;
  showWorst?: boolean;
}): string {
  return [
    'journalit-reviewv2-bestworst-grid',
    config.showBest && config.showWorst
      ? 'journalit-reviewv2-bestworst-grid--both'
      : 'journalit-reviewv2-bestworst-grid--single',
  ].join(' ');
}

const SkeletonCard: React.FC<{
  isPositive: boolean;
  title: string;
  primaryWidth: number;
}> = ({ isPositive, title, primaryWidth }) => (
  <div>
    <div className="journalit-reviewv2-bestworst-label">{title}</div>
    <div
      className={[
        'journalit-reviewv2-bestworst-card',
        isPositive
          ? 'journalit-reviewv2-bestworst-card--positive'
          : 'journalit-reviewv2-bestworst-card--negative',
        'journalit-reviewv2-bestworst-card--preview',
      ].join(' ')}
    >
      <div className="journalit-reviewv2-bestworst-pnl-col">
        <SkeletonBox width={70} height={20} borderRadius="4px" />
      </div>
      <div className="journalit-reviewv2-bestworst-details">
        <SkeletonBox width={primaryWidth} height={16} borderRadius="4px" />
        <div className="journalit-u-flex journalit-u-gap-8 journalit-u-mt-4">
          <SkeletonBox width={50} height={12} borderRadius="4px" />
          <SkeletonBox width={70} height={12} borderRadius="4px" />
        </div>
      </div>
    </div>
  </div>
);

export const BestWorstSkeletonGrid: React.FC<{
  config: BestWorstVisibility;
  bestTitle: string;
  worstTitle: string;
  
  primaryWidth: number;
}> = ({ config, bestTitle, worstTitle, primaryWidth }) => (
  <div className={bestWorstGridClassName(config)}>
    {config.showBest && (
      <SkeletonCard isPositive title={bestTitle} primaryWidth={primaryWidth} />
    )}
    {config.showWorst && (
      <SkeletonCard
        isPositive={false}
        title={worstTitle}
        primaryWidth={primaryWidth}
      />
    )}
  </div>
);

interface BestWorstPeriodSlot<P> {
  title: string;
  emptyMessage: string;
  period: P | null;
}

interface BestWorstPeriodRenderers<P> {
  formatPnl: (period: P) => string;
  formatName: (period: P) => string;
  buildMetaItems: (period: P) => string[];
  onOpen: (period: P) => void;
}

interface PeriodCardProps<
  P extends { trades: CurrencyConversionTrade[] },
> extends BestWorstPeriodRenderers<P> {
  slot: BestWorstPeriodSlot<P>;
  isPositive: boolean;
  isPnlMasked: boolean;
  currencyConversion?: ReviewCurrencyConversionMetadata | null;
}

function PeriodCard<P extends { trades: CurrencyConversionTrade[] }>({
  slot: { title, emptyMessage, period },
  isPositive,
  isPnlMasked,
  currencyConversion,
  formatPnl,
  formatName,
  buildMetaItems,
  onOpen,
}: PeriodCardProps<P>) {
  return (
    <BestWorstCard
      title={title}
      isPositive={isPositive}
      isMasked={isPnlMasked}
      isEmpty={!period}
      emptyMessage={emptyMessage}
      pnl={period ? formatPnl(period) : ''}
      primaryText={period ? formatName(period) : ''}
      metaItems={period ? buildMetaItems(period) : []}
      onClick={period ? () => onOpen(period) : undefined}
      currencyConversion={currencyConversion}
      conversionTrades={period?.trades}
    />
  );
}

interface BestWorstPeriodGridProps<
  P extends { trades: CurrencyConversionTrade[] },
> extends BestWorstPeriodRenderers<P> {
  config: BestWorstVisibility;
  best: BestWorstPeriodSlot<P>;
  worst: BestWorstPeriodSlot<P>;
  isPnlMasked: boolean;
  currencyConversion?: ReviewCurrencyConversionMetadata | null;
}

export function BestWorstPeriodGrid<
  P extends { trades: CurrencyConversionTrade[] },
>({ config, best, worst, ...cardProps }: BestWorstPeriodGridProps<P>) {
  return (
    <div className={bestWorstGridClassName(config)}>
      {config.showBest && <PeriodCard slot={best} isPositive {...cardProps} />}
      {config.showWorst && (
        <PeriodCard slot={worst} isPositive={false} {...cardProps} />
      )}
    </div>
  );
}
