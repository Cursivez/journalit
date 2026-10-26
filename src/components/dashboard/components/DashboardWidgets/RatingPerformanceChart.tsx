
import React from 'react';
import { t } from '../../../../lang/helpers';
import {
  getTradeRatingBucket,
  getTradeRatingBucketLabel,
  TRADE_RATING_BUCKETS,
} from '../../../../utils/tradeRating';
import type { Trade } from '../../utils/dataUtils';
import type { BaseWidgetProps } from './BaseWidget';
import { PerformanceBreakdownChart } from './PerformanceBreakdownChart';


const RATING_ROW_ORDER = TRADE_RATING_BUCKETS.map(getTradeRatingBucketLabel);


const getTradeRatingGroups = (trade: Trade): readonly string[] =>
  trade.tradeRating === undefined
    ? []
    : [getTradeRatingBucketLabel(getTradeRatingBucket(trade.tradeRating))];

export const RatingPerformanceChart = React.memo<BaseWidgetProps>((props) => (
  <PerformanceBreakdownChart
    {...props}
    kind="rating"
    title={t('dashboard.widgets.rating-performance.title')}
    emptyMessage={t('dashboard.widgets.rating-performance.empty')}
    maskedLabel={t('dashboard.widgets.rating-performance.masked-label')}
    getGroups={getTradeRatingGroups}
    fixedRowOrder={RATING_ROW_ORDER}
  />
));

RatingPerformanceChart.displayName = 'RatingPerformanceChart';
