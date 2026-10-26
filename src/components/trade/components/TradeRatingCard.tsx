
import React from 'react';
import type { PartialTradeFrontmatter } from '../../../types/TradeFrontmatter';
import { t } from '../../../lang/helpers';
import { usePlugin } from '../../../hooks/usePlugin';
import { StarRating } from '../../shared/StarRating';
import { tradeShareSectionProps } from '../../share/tradeShare/tradeShareModel';

interface TradeRatingCardProps {
  data: PartialTradeFrontmatter;
  filePath: string;
  
  readOnly?: boolean;
}

export const TradeRatingCard: React.FC<TradeRatingCardProps> = ({
  data,
  filePath,
  readOnly = false,
}) => {
  const plugin = usePlugin();
  const storedRating = data.tradeRating ?? null;
  
  
  const [pending, setPending] = React.useState<{
    stored: number | null;
    value: number | null;
  } | null>(null);
  const rating =
    pending && pending.stored === storedRating ? pending.value : storedRating;

  const handleChange = (next: number | null) => {
    if (!plugin || filePath === 'unknown') return;
    setPending({ stored: storedRating, value: next });
    void plugin.tradeService
      .updateTradeRating(filePath, next)
      .catch((error: unknown) => {
        console.error('[TradeRatingCard] Failed to save rating:', error);
        setPending(null);
      });
  };

  const label = t('trade.rating.label');
  return (
    <div
      className="metric-card trade-rating-card"
      
      {...(storedRating === null ? {} : tradeShareSectionProps('rating'))}
    >
      <div className="metric-label">{label}</div>
      <div className="metric-value trade-rating-card__stars">
        <StarRating
          value={rating}
          label={label}
          hint={readOnly ? undefined : t('trade.rating.hint')}
          size="md"
          clearable
          onChange={readOnly ? undefined : handleChange}
        />
      </div>
    </div>
  );
};
