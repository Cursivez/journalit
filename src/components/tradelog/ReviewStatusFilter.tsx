import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { t } from '../../lang/helpers';
import type { ReviewStatusFilter as ReviewStatusFilterValue } from '../../services/tradelog/types';

interface ReviewStatusFilterProps {
  selectedReviewStatus: ReviewStatusFilterValue[];
  onChange: (reviewStatus: ReviewStatusFilterValue[]) => void;
}

const REVIEW_STATUS_OPTIONS: Array<{
  value: ReviewStatusFilterValue;
  labelKey:
    | 'filter.modal.review-status.reviewed'
    | 'filter.modal.review-status.unreviewed';
}> = [
  { value: 'reviewed', labelKey: 'filter.modal.review-status.reviewed' },
  { value: 'unreviewed', labelKey: 'filter.modal.review-status.unreviewed' },
];

export const ReviewStatusFilter: React.FC<ReviewStatusFilterProps> = React.memo(
  ({ selectedReviewStatus, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          event.target instanceof Node &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      window.activeDocument.addEventListener('mousedown', handleClickOutside);
      return () => {
        window.activeDocument.removeEventListener(
          'mousedown',
          handleClickOutside
        );
      };
    }, []);

    const summary = useMemo(() => {
      if (selectedReviewStatus.length !== 1) {
        return t('tradelog.filter.all-review-statuses');
      }

      const selected = REVIEW_STATUS_OPTIONS.find(
        (option) => option.value === selectedReviewStatus[0]
      );
      return selected
        ? t(selected.labelKey)
        : t('tradelog.filter.all-review-statuses');
    }, [selectedReviewStatus]);

    const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

    const handleReviewStatusChange = useCallback(
      (status: ReviewStatusFilterValue | 'all') => {
        if (status === 'all' || selectedReviewStatus.includes(status)) {
          onChange([]);
          return;
        }

        onChange([status]);
      },
      [onChange, selectedReviewStatus]
    );

    const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        action();
      }
    };

    return (
      <div className="journalit-tradelog-status-filter" ref={dropdownRef}>
        <div className="journalit-tradelog-status-dropdown">
          <div
            className="journalit-tradelog-status-summary"
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={toggleDropdown}
            onKeyDown={(event) => handleKeyDown(event, toggleDropdown)}
          >
            {summary}
            <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
          </div>

          {isOpen && (
            <div className="journalit-tradelog-status-options-dropdown">
              <div
                className="journalit-tradelog-status-option-item select-all"
                onClick={() => handleReviewStatusChange('all')}
                role="checkbox"
                tabIndex={0}
                aria-checked={selectedReviewStatus.length === 0}
                onKeyDown={(event) =>
                  handleKeyDown(event, () => handleReviewStatusChange('all'))
                }
              >
                <span
                  className={`journalit-tradelog-checkbox journalit-tradelog-status-checkbox${
                    selectedReviewStatus.length === 0 ? ' checked' : ''
                  }`}
                  aria-hidden="true"
                >
                  {selectedReviewStatus.length === 0 ? '✓' : ''}
                </span>
                <span>{t('common.select-all')}</span>
              </div>

              <div className="journalit-tradelog-status-divider"></div>

              {REVIEW_STATUS_OPTIONS.map((option) => {
                const checked = selectedReviewStatus.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className="journalit-tradelog-status-option-item"
                    onClick={() => handleReviewStatusChange(option.value)}
                    role="checkbox"
                    tabIndex={0}
                    aria-checked={checked}
                    onKeyDown={(event) =>
                      handleKeyDown(event, () =>
                        handleReviewStatusChange(option.value)
                      )
                    }
                  >
                    <span
                      className={`journalit-tradelog-checkbox journalit-tradelog-status-checkbox${
                        checked ? ' checked' : ''
                      }`}
                      aria-hidden="true"
                    >
                      {checked ? '✓' : ''}
                    </span>
                    <span>{t(option.labelKey)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ReviewStatusFilter.displayName = 'ReviewStatusFilter';
