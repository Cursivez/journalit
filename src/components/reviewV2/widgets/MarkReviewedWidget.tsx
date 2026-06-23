

import React, { useState, useEffect, useRef } from 'react';
import { TFile } from 'obsidian';
import { CheckCircle2, Circle } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { InvalidContextMessage } from './InvalidContextMessage';
import { MarkReviewedPreviewData } from '../../../types/reviewV2';
import { formatDateDisplay, getUserDateFormat } from '../../../utils/dateUtils';
import { eventBus } from '../../../services/events/EventBus';
import { SkeletonBox, SkeletonCircle } from '../../shared';
import { t } from '../../../lang/helpers';

interface MarkReviewedWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  preview?: boolean;
  previewData?: MarkReviewedPreviewData;
}


type SupportedReviewType =
  | 'drc'
  | 'weekly-review'
  | 'monthly-review'
  | 'quarterly-review'
  | 'yearly-review';


const MAX_FRONTMATTER_RETRIES = 5;
const FRONTMATTER_RETRY_DELAY_MS = 150;

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

function getSupportedReviewType(value: unknown): SupportedReviewType | null {
  switch (value) {
    case 'drc':
    case 'weekly-review':
    case 'monthly-review':
    case 'quarterly-review':
    case 'yearly-review':
      return value;
    default:
      return null;
  }
}

function getBooleanValue(
  record: Record<string, unknown> | undefined,
  key: string
): boolean {
  const value = record?.[key];
  return typeof value === 'boolean' ? value : false;
}

function getStringValue(
  record: Record<string, unknown> | undefined,
  key: string
): string | null {
  const value = record?.[key];
  return typeof value === 'string' ? value : null;
}

const formatTimestamp = (timestamp: string): string => {
  const dateFormat = getUserDateFormat();
  const date = new Date(timestamp);
  const dateStr = formatDateDisplay(date, dateFormat);
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${dateStr} ${timeStr}`;
};

export const MarkReviewedWidget: React.FC<MarkReviewedWidgetProps> = ({
  filePath,
  plugin,
  preview,
  previewData,
}) => {
  const [reviewState, setReviewState] = useState<{
    reviewed: boolean;
    reviewedAt: string | null;
    loading: boolean;
    isValidContext: boolean;
    noteType: SupportedReviewType | null;
  }>({
    reviewed: false,
    reviewedAt: null,
    loading: true,
    isValidContext: true,
    noteType: null,
  });
  const { reviewed, reviewedAt, loading, isValidContext, noteType } =
    reviewState;
  const retryCountRef = useRef(0);

  useEffect(() => {
    
    if (preview && previewData) {
      setReviewState({
        reviewed: previewData.reviewed,
        reviewedAt: previewData.reviewedAt ?? null,
        loading: false,
        isValidContext: true,
        noteType: null,
      });
      return;
    }

    retryCountRef.current = 0;
    void loadReviewStatus();

    
    const handleMetadataChange = (file: TFile) => {
      if (file.path === filePath) {
        void loadReviewStatus();
      }
    };

    plugin.app.metadataCache.on('changed', handleMetadataChange);

    return () => {
      plugin.app.metadataCache.off('changed', handleMetadataChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- status load is tied to file identity and avoids retry-loop dependency churn
  }, [filePath, preview, previewData]);

  const loadReviewStatus = async () => {
    const file = plugin.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) {
      setReviewState((current) => ({
        ...current,
        isValidContext: false,
        loading: false,
      }));
      return;
    }

    const cache = plugin.app.metadataCache.getFileCache(file);
    const frontmatter = asRecord(cache?.frontmatter);

    if (!frontmatter) {
      
      if (retryCountRef.current < MAX_FRONTMATTER_RETRIES) {
        retryCountRef.current++;
        window.setTimeout(
          () => void loadReviewStatus(),
          FRONTMATTER_RETRY_DELAY_MS
        );
        return;
      }
      setReviewState((current) => ({
        ...current,
        isValidContext: false,
        loading: false,
      }));
      return;
    }

    
    const type = getSupportedReviewType(frontmatter.type);
    if (!type) {
      setReviewState((current) => ({
        ...current,
        isValidContext: false,
        loading: false,
      }));
      return;
    }

    
    
    
    if (type === 'drc') {
      const eodReview = asRecord(frontmatter.endOfDayReview);
      setReviewState({
        reviewed: getBooleanValue(eodReview, 'reviewed'),
        reviewedAt: getStringValue(eodReview, 'reviewedAt'),
        loading: false,
        isValidContext: true,
        noteType: type,
      });
    } else {
      setReviewState({
        reviewed: getBooleanValue(frontmatter, 'reviewed'),
        reviewedAt: getStringValue(frontmatter, 'reviewedAt'),
        loading: false,
        isValidContext: true,
        noteType: type,
      });
    }
  };

  const toggleReviewStatus = async () => {
    if (preview) return;

    const file = plugin.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) return;

    const newReviewed = !reviewed;
    const newReviewedAt = newReviewed ? new Date().toISOString() : null;

    
    setReviewState((current) => ({
      ...current,
      reviewed: newReviewed,
      reviewedAt: newReviewedAt,
    }));

    try {
      if (noteType === 'drc') {
        
        
        const cache = plugin.app.metadataCache.getFileCache(file);
        const currentEodReview =
          asRecord(cache?.frontmatter?.endOfDayReview) ?? {};
        await plugin.drcService.updateDRCFrontmatter(
          filePath,
          {
            endOfDayReview: {
              ...currentEodReview,
              reviewed: newReviewed,
              reviewedAt: newReviewedAt,
            },
          },
          'user-input'
        );
      } else if (noteType === 'weekly-review') {
        
        await plugin.weeklyReviewService.updateWeeklyReviewFrontmatter(
          filePath,
          {
            reviewed: newReviewed,
            reviewedAt: newReviewedAt,
          }
        );
      } else if (noteType === 'monthly-review') {
        
        await plugin.monthlyReviewService.updateMonthlyReviewFrontmatter(
          filePath,
          {
            reviewed: newReviewed,
            reviewedAt: newReviewedAt,
          }
        );
      } else if (noteType === 'quarterly-review') {
        
        const quarterlyService =
          await plugin.serviceManager.getQuarterlyReviewService();
        await quarterlyService.updateQuarterlyReviewFrontmatter(filePath, {
          reviewed: newReviewed,
          reviewedAt: newReviewedAt,
        });
      } else if (noteType === 'yearly-review') {
        
        const yearlyService =
          await plugin.serviceManager.getYearlyReviewService();
        await yearlyService.updateYearlyReviewFrontmatter(filePath, {
          reviewed: newReviewed,
          reviewedAt: newReviewedAt,
        });
      }

      
      const typeMap: Record<
        string,
        'drc' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
      > = {
        drc: 'drc',
        'weekly-review': 'weekly',
        'monthly-review': 'monthly',
        'quarterly-review': 'quarterly',
        'yearly-review': 'yearly',
      };
      const normalizedType = typeMap[noteType ?? 'drc'] ?? 'drc';
      eventBus.publish('review:changed', {
        action: 'updated',
        type: normalizedType,
        filePath,
      });
    } catch (error) {
      console.error(
        '[MarkReviewedWidget] Failed to update review status:',
        error
      );
      
      setReviewState((current) => ({
        ...current,
        reviewed: !newReviewed,
        reviewedAt: newReviewed ? null : reviewedAt,
      }));
    }
  };

  if (loading) {
    
    return (
      <div className="journalit-reviewv2-mark-reviewed-banner">
        <div className="journalit-u-flex journalit-u-items-center journalit-u-gap-8">
          <SkeletonCircle size={18} />
          <SkeletonBox width={100} height={14} borderRadius="4px" />
        </div>
        <SkeletonBox width={110} height={32} borderRadius="var(--radius-s)" />
      </div>
    );
  }

  if (!isValidContext) {
    return (
      <InvalidContextMessage
        widgetType="Mark as Reviewed"
        reason={t('widget.invalid-context.review-note')}
      />
    );
  }

  const buttonClassName = [
    'journalit-reviewv2-mark-reviewed-button',
    reviewed
      ? 'journalit-reviewv2-mark-reviewed-button--reviewed'
      : 'journalit-reviewv2-mark-reviewed-button--pending',
    preview ? 'journalit-reviewv2-mark-reviewed-button--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="journalit-reviewv2-mark-reviewed-banner">
      <div className="journalit-reviewv2-mark-reviewed-status-row">
        {reviewed ? (
          <CheckCircle2
            size={18}
            className="journalit-reviewv2-mark-reviewed-icon journalit-reviewv2-mark-reviewed-icon--reviewed"
          />
        ) : (
          <Circle
            size={18}
            className="journalit-reviewv2-mark-reviewed-icon journalit-reviewv2-mark-reviewed-icon--pending"
          />
        )}
        <span className="journalit-reviewv2-mark-reviewed-status-text">
          {reviewed
            ? t('widget.mark-reviewed.status.reviewed')
            : t('widget.mark-reviewed.status.pending')}
        </span>
        {reviewed && reviewedAt && (
          <span className="journalit-reviewv2-mark-reviewed-timestamp">
            {formatTimestamp(reviewedAt)}
          </span>
        )}
      </div>

      <button
        onClick={() => void toggleReviewStatus()}
        disabled={preview}
        className={buttonClassName}
      >
        {reviewed
          ? t('widget.mark-reviewed.button.undo')
          : t('widget.mark-reviewed.button.mark')}
      </button>
    </div>
  );
};
