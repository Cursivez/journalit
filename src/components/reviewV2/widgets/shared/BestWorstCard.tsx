

import React from 'react';
import { t } from '../../../../lang/helpers';
import {
  CurrencyConversionInfo,
  type ReviewCurrencyConversionMetadata,
  type CurrencyConversionTrade,
} from '../../../shared/display/CurrencyConversionInfo';


const MAX_CHIPS = 3;
const EMPTY_CHIPS: { text: string; type: 'tag' | 'mistake' }[] = [];

interface BestWorstCardProps {
  title: string;
  isPositive: boolean;
  pnl: string;
  primaryText: string;
  secondaryText?: string;
  metaItems: string[];
  chips?: { text: string; type: 'tag' | 'mistake' }[];
  onClick?: () => void;
  emptyMessage?: string;
  isEmpty?: boolean;
  isMasked?: boolean;
  currencyConversion?: ReviewCurrencyConversionMetadata | null;
  conversionTrades?: CurrencyConversionTrade[];
}

export const BestWorstCard: React.FC<BestWorstCardProps> = ({
  title,
  isPositive,
  pnl,
  primaryText,
  secondaryText,
  metaItems,
  chips = EMPTY_CHIPS,
  onClick,
  emptyMessage,
  isEmpty = false,
  isMasked = false,
  currencyConversion,
  conversionTrades,
}) => {
  if (isEmpty) {
    return (
      <div>
        <div className="journalit-reviewv2-bestworst-label">
          {title}
          <CurrencyConversionInfo
            metadata={currencyConversion}
            trades={conversionTrades}
          />
        </div>
        <div className="journalit-reviewv2-bestworst-empty-card">
          {emptyMessage || t('widget.empty.no-data')}
        </div>
      </div>
    );
  }

  
  const visibleChips = chips.slice(0, MAX_CHIPS);
  const overflowCount = chips.length - MAX_CHIPS;
  const isInteractive = Boolean(onClick);
  const cardClassName = [
    'journalit-reviewv2-bestworst-card',
    isMasked
      ? ''
      : isPositive
        ? 'journalit-reviewv2-bestworst-card--positive'
        : 'journalit-reviewv2-bestworst-card--negative',
    isInteractive
      ? 'journalit-reviewv2-bestworst-card--interactive'
      : 'journalit-reviewv2-bestworst-card--preview',
  ]
    .filter(Boolean)
    .join(' ');

  const cardContent = (
    <>
      
      <div className="journalit-reviewv2-bestworst-pnl-col">
        <div
          className={[
            'journalit-reviewv2-bestworst-pnl',
            isMasked
              ? ''
              : isPositive
                ? 'journalit-reviewv2-bestworst-pnl--positive'
                : 'journalit-reviewv2-bestworst-pnl--negative',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {pnl}
        </div>
      </div>

      
      <div className="journalit-reviewv2-bestworst-details">
        
        <div className="journalit-reviewv2-bestworst-primary-row">
          <span className="journalit-reviewv2-bestworst-primary">
            {primaryText}
          </span>
          {secondaryText && (
            <span className="journalit-reviewv2-bestworst-secondary">
              {secondaryText}
            </span>
          )}
        </div>

        
        {metaItems.length > 0 && (
          <div className="journalit-reviewv2-bestworst-meta-row">
            {metaItems.map((item, idx) => (
              <span
                key={`${item}-${idx > 0 ? metaItems[idx - 1] : 'first'}`}
                className="journalit-reviewv2-bestworst-meta-item"
              >
                {idx > 0 && (
                  <span className="journalit-reviewv2-text-faint">·</span>
                )}
                {item}
              </span>
            ))}
          </div>
        )}

        
        {visibleChips.length > 0 && (
          <div className="journalit-reviewv2-bestworst-chips">
            {visibleChips.map((chip) => (
              <span
                key={`${chip.type}-${chip.text}`}
                className={[
                  'journalit-reviewv2-bestworst-chip',
                  chip.type === 'mistake'
                    ? 'journalit-reviewv2-bestworst-chip--mistake'
                    : 'journalit-reviewv2-bestworst-chip--tag',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {chip.text}
              </span>
            ))}
            {overflowCount > 0 && (
              <span className="journalit-reviewv2-bestworst-chip journalit-reviewv2-bestworst-chip--overflow">
                +{overflowCount}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div>
      <div className="journalit-reviewv2-bestworst-label">
        {title}
        <CurrencyConversionInfo
          metadata={currencyConversion}
          trades={conversionTrades}
        />
      </div>
      {onClick ? (
        <div
          className={cardClassName}
          onClick={onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            onClick();
          }}
        >
          {cardContent}
        </div>
      ) : (
        <div className={cardClassName}>{cardContent}</div>
      )}
    </div>
  );
};

export {};
