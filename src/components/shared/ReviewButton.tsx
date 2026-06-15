

import React from 'react';
import { Button } from '../ui/Button';
import { formatDateDisplay, getUserDateFormat } from '../../utils/dateUtils';
import { t } from '../../lang/helpers';

interface ReviewButtonProps {
  reviewed?: boolean;
  reviewedAt?: string;
  onMarkReviewed: () => void | Promise<void>;
  label?: string;
  className?: string;
}

export const ReviewButton: React.FC<ReviewButtonProps> = ({
  reviewed = false,
  reviewedAt,
  onMarkReviewed,
  label = t('trade.review.mark-as-reviewed'),
  className = '',
}) => {
  const dateFormat = getUserDateFormat();

  return (
    <div className={`review-button-container ${className}`}>
      <Button
        variant="primary"
        onClick={onMarkReviewed}
        disabled={reviewed}
        className="review-button"
      >
        {reviewed ? `✓ ${t('trade.review.reviewed')}` : label}
      </Button>
      {reviewed && reviewedAt && (
        <span className="review-timestamp">
          {t('trade.review.reviewed-on', {
            date: formatDateDisplay(new Date(reviewedAt), dateFormat),
          })}
        </span>
      )}
    </div>
  );
};
