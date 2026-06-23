

import React, { useEffect, useRef, useCallback, useReducer } from 'react';
import { TFile } from 'obsidian';
import JournalitPlugin from '../../../main';
import { InvalidContextMessage } from './InvalidContextMessage';
import { ReviewPreviewData } from '../../../types/reviewV2';
import { eventBus } from '../../../services/events/EventBus';
import { SkeletonBox } from '../../shared';
import { t } from '../../../lang/helpers';

interface ReviewWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: {
    gradeScale?: 'letter' | 'numeric';
  };
  preview?: boolean;
  previewData?: ReviewPreviewData;
}

type LetterGrade = 'A' | 'B' | 'C';
type NumericGrade = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;
const NUMERIC_GRADES: NumericGrade[] = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5,
];
const STAR_GRADES: NumericGrade[] = [1, 2, 3, 4, 5];


type SupportedReviewWidgetType =
  | 'drc'
  | 'weekly-review'
  | 'monthly-review'
  | 'quarterly-review'
  | 'yearly-review';


const MAX_FRONTMATTER_RETRIES = 5;
const FRONTMATTER_RETRY_DELAY_MS = 150;
const SCROLL_RESTORE_DELAYS_MS = [0, 50, 150, 300, 600];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  isRecord(value) ? value : undefined;

const getSupportedReviewWidgetType = (
  value: unknown
): SupportedReviewWidgetType | null => {
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
};

const isLetterGrade = (value: unknown): value is LetterGrade =>
  value === 'A' || value === 'B' || value === 'C';

const isNumericGrade = (value: unknown): value is NumericGrade =>
  typeof value === 'number' && NUMERIC_GRADES.some((grade) => grade === value);

const parseGrade = (value: unknown): LetterGrade | NumericGrade | null => {
  if (isLetterGrade(value) || isNumericGrade(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const numericValue = Number(value);
    return isNumericGrade(numericValue) ? numericValue : null;
  }

  return null;
};

type ReviewWidgetState = {
  mentalGrade: LetterGrade | NumericGrade | null;
  technicalGrade: LetterGrade | NumericGrade | null;
  dataLoading: boolean;
  isValidContext: boolean;
  noteType: string | null;
};

type ReviewWidgetAction =
  | {
      type: 'loadedPreview';
      mentalGrade: LetterGrade | NumericGrade | null;
      technicalGrade: LetterGrade | NumericGrade | null;
    }
  | { type: 'invalidContext' }
  | {
      type: 'loaded';
      noteType: string;
      mentalGrade: LetterGrade | NumericGrade | null;
      technicalGrade: LetterGrade | NumericGrade | null;
    }
  | {
      type: 'optimisticGrade';
      field: 'mentalGrade' | 'technicalGrade';
      value: LetterGrade | NumericGrade;
    };

const initialReviewWidgetState: ReviewWidgetState = {
  mentalGrade: null,
  technicalGrade: null,
  dataLoading: true,
  isValidContext: true,
  noteType: null,
};

const reviewWidgetReducer = (
  state: ReviewWidgetState,
  action: ReviewWidgetAction
): ReviewWidgetState => {
  switch (action.type) {
    case 'loadedPreview':
      return {
        ...state,
        mentalGrade: action.mentalGrade,
        technicalGrade: action.technicalGrade,
        dataLoading: false,
        isValidContext: true,
      };
    case 'invalidContext':
      return { ...state, dataLoading: false, isValidContext: false };
    case 'loaded':
      return {
        mentalGrade: action.mentalGrade,
        technicalGrade: action.technicalGrade,
        noteType: action.noteType,
        dataLoading: false,
        isValidContext: true,
      };
    case 'optimisticGrade':
      return { ...state, [action.field]: action.value };
  }
};

const ReviewWidgetSkeleton: React.FC = () => (
  <div className="journalit-reviewv2-card journalit-reviewv2-grade-colors">
    <div className="journalit-reviewv2-skeleton-header">
      <SkeletonBox width={120} height={12} borderRadius="4px" />
    </div>
    <div className="journalit-reviewv2-skeleton-grid">
      <div className="journalit-reviewv2-skeleton-row">
        <SkeletonBox width={60} height={14} borderRadius="4px" />
        <div className="journalit-reviewv2-skeleton-stars">
          {['one', 'two', 'three', 'four', 'five'].map((key) => (
            <SkeletonBox key={key} width={20} height={20} borderRadius="4px" />
          ))}
        </div>
        <SkeletonBox width={30} height={14} borderRadius="4px" />
      </div>
      <SkeletonBox width={1} height={20} borderRadius="0" />
      <div className="journalit-reviewv2-skeleton-row">
        <SkeletonBox width={70} height={14} borderRadius="4px" />
        <div className="journalit-reviewv2-skeleton-stars">
          {['one', 'two', 'three', 'four', 'five'].map((key) => (
            <SkeletonBox key={key} width={20} height={20} borderRadius="4px" />
          ))}
        </div>
        <SkeletonBox width={30} height={14} borderRadius="4px" />
      </div>
    </div>
  </div>
);

const getLetterGradeClass = (grade: LetterGrade): string => {
  switch (grade) {
    case 'A':
      return 'journalit-reviewv2-grade-button--a';
    case 'B':
      return 'journalit-reviewv2-grade-button--b';
    case 'C':
      return 'journalit-reviewv2-grade-button--c';
    default:
      return '';
  }
};

const getGradeButtonClass = (
  grade: LetterGrade,
  selected: boolean,
  preview?: boolean
): string => {
  return [
    'journalit-reviewv2-grade-button',
    getLetterGradeClass(grade),
    selected ? 'journalit-reviewv2-grade-button--selected' : '',
    preview ? 'journalit-reviewv2-grade-button--preview' : '',
  ]
    .filter(Boolean)
    .join(' ');
};

interface LetterGradeSectionProps {
  label: string;
  selectedGrade: LetterGrade | NumericGrade | null;
  field: 'mentalGrade' | 'technicalGrade';
  preview?: boolean;
  onUpdateGrade: (
    field: 'mentalGrade' | 'technicalGrade',
    value: LetterGrade | NumericGrade
  ) => void | Promise<void>;
}

const LetterGradeSection: React.FC<LetterGradeSectionProps> = ({
  label,
  selectedGrade,
  field,
  preview,
  onUpdateGrade,
}) => (
  <div className="journalit-reviewv2-grade-column">
    <div className="journalit-reviewv2-grade-label">{label}</div>
    <div className="journalit-reviewv2-grade-buttons">
      {(['A', 'B', 'C'] as LetterGrade[]).map((grade) => (
        <button
          key={grade}
          type="button"
          onClick={() => void onUpdateGrade(field, grade)}
          disabled={preview}
          className={getGradeButtonClass(
            grade,
            selectedGrade === grade,
            preview
          )}
        >
          {grade}
        </button>
      ))}
    </div>
  </div>
);

const StarRatingSection: React.FC<LetterGradeSectionProps> = ({
  label,
  selectedGrade,
  field,
  preview,
  onUpdateGrade,
}) => (
  <div className="journalit-reviewv2-grade-column">
    <div className="journalit-reviewv2-grade-label">{label}</div>
    <div
      className="journalit-reviewv2-star-rating"
      aria-label={t('widget.review.star-hint')}
    >
      {STAR_GRADES.map((star) => {
        const grade = typeof selectedGrade === 'number' ? selectedGrade : 0;
        const isFull = grade >= star;
        const isHalf = !isFull && grade >= star - 0.5;
        const starClassName = [
          'journalit-reviewv2-star',
          preview
            ? 'journalit-reviewv2-star--preview'
            : 'journalit-reviewv2-star--interactive',
          isFull
            ? 'journalit-reviewv2-star--full'
            : isHalf
              ? ''
              : 'journalit-reviewv2-star--empty',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            type="button"
            disabled={preview}
            key={`${field}-${star}`}
            onClick={() => !preview && void onUpdateGrade(field, star)}
            onKeyDown={(event) => {
              if (preview || (event.key !== 'Enter' && event.key !== ' ')) {
                return;
              }
              event.preventDefault();
              void onUpdateGrade(field, star);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              const halfGrade = star - 0.5;
              if (!preview && isNumericGrade(halfGrade)) {
                void onUpdateGrade(field, halfGrade);
              }
            }}
            className={starClassName}
          >
            {isHalf ? (
              <span className="journalit-reviewv2-star-half">
                <span className="journalit-reviewv2-star-half-base">★</span>
                <span className="journalit-reviewv2-star-half-muted">★</span>
                <span className="journalit-reviewv2-star-half-fill">★</span>
              </span>
            ) : (
              '★'
            )}
          </button>
        );
      })}
      <span className="journalit-reviewv2-star-score">
        {selectedGrade ?? 0}/5
      </span>
    </div>
  </div>
);

export const ReviewWidget: React.FC<ReviewWidgetProps> = ({
  filePath,
  plugin,
  config,
  preview,
  previewData,
}) => {
  const [reviewState, dispatchReviewState] = useReducer(
    reviewWidgetReducer,
    initialReviewWidgetState
  );
  const { mentalGrade, technicalGrade, dataLoading, isValidContext, noteType } =
    reviewState;
  const retryCountRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  
  
  const getGradeScale = () => {
    if (config?.gradeScale) return config.gradeScale;
    
    if (
      [
        'weekly-review',
        'monthly-review',
        'quarterly-review',
        'yearly-review',
      ].includes(noteType ?? '')
    ) {
      return 'numeric';
    }
    return 'letter';
  };
  const gradeScale = getGradeScale();

  const loadGrades = useCallback(async () => {
    
    if (preview && previewData) {
      dispatchReviewState({
        type: 'loadedPreview',
        mentalGrade: parseGrade(previewData.mentalGrade),
        technicalGrade: parseGrade(previewData.technicalGrade),
      });
      return;
    }

    const file = plugin.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) {
      dispatchReviewState({ type: 'invalidContext' });
      return;
    }

    const cache = plugin.app.metadataCache.getFileCache(file);
    const frontmatter = asRecord(cache?.frontmatter);

    const noteType = frontmatter
      ? getSupportedReviewWidgetType(frontmatter.type)
      : null;

    if (!frontmatter || !noteType) {
      
      if (retryCountRef.current < MAX_FRONTMATTER_RETRIES) {
        retryCountRef.current++;
        window.setTimeout(() => {
          void loadGrades();
        }, FRONTMATTER_RETRY_DELAY_MS);
        return;
      }
      dispatchReviewState({ type: 'invalidContext' });
      return;
    }

    dispatchReviewState({
      type: 'loaded',
      noteType,
      mentalGrade: parseGrade(frontmatter.mentalGrade),
      technicalGrade: parseGrade(frontmatter.technicalGrade),
    });
  }, [
    filePath,
    plugin.app.metadataCache,
    plugin.app.vault,
    preview,
    previewData,
  ]);

  useEffect(() => {
    retryCountRef.current = 0;
    void loadGrades();

    if (preview) {
      return;
    }

    
    
    
    const handleMetadataChange = (file: TFile) => {
      if (file.path === filePath) {
        void loadGrades();
      }
    };

    plugin.app.metadataCache.on('changed', handleMetadataChange);

    return () => {
      plugin.app.metadataCache.off('changed', handleMetadataChange);
    };
  }, [filePath, loadGrades, plugin.app.metadataCache, preview]);

  const updateGrade = async (
    field: 'mentalGrade' | 'technicalGrade',
    value: LetterGrade | NumericGrade
  ) => {
    
    if (preview) return;

    const file = plugin.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) return;

    const scrollContainer = cardRef.current?.closest('.markdown-preview-view');
    const leafContent = scrollContainer?.closest('.workspace-leaf-content');
    const scrollTop = scrollContainer?.scrollTop;
    const restoreScrollPosition = () => {
      if (
        !(scrollContainer instanceof HTMLElement) ||
        !(leafContent instanceof HTMLElement) ||
        scrollTop === undefined
      ) {
        return;
      }

      SCROLL_RESTORE_DELAYS_MS.forEach((delay) => {
        window.setTimeout(() => {
          const currentScrollContainer = leafContent.querySelector(
            '.markdown-preview-view'
          );
          if (currentScrollContainer instanceof HTMLElement) {
            currentScrollContainer.scrollTop = scrollTop;
          }
        }, delay);
      });
    };

    dispatchReviewState({ type: 'optimisticGrade', field, value });

    
    try {
      if (noteType === 'drc') {
        await plugin.drcService.updateDRCFrontmatter(
          filePath,
          {
            [field]: value,
          },
          'user-input'
        );
      } else if (noteType === 'weekly-review') {
        await plugin.weeklyReviewService.updateWeeklyReviewFrontmatter(
          filePath,
          {
            [field]: value,
          }
        );
      } else if (noteType === 'monthly-review') {
        await plugin.monthlyReviewService.updateMonthlyReviewFrontmatter(
          filePath,
          {
            [field]: value,
          }
        );
      } else if (noteType === 'quarterly-review') {
        const quarterlyService =
          await plugin.serviceManager.getQuarterlyReviewService();
        await quarterlyService.updateQuarterlyReviewFrontmatter(filePath, {
          [field]: value,
        });
      } else if (noteType === 'yearly-review') {
        const yearlyService =
          await plugin.serviceManager.getYearlyReviewService();
        await yearlyService.updateYearlyReviewFrontmatter(filePath, {
          [field]: value,
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
        source: 'review-widget:grades',
      });
      restoreScrollPosition();
    } catch (error) {
      console.error('[ReviewWidget] Failed to update grade:', error);
      
      await loadGrades();
      restoreScrollPosition();
    }
  };

  if (dataLoading) {
    return <ReviewWidgetSkeleton />;
  }

  if (!isValidContext) {
    return (
      <InvalidContextMessage
        widgetType={t('widget.review.name')}
        reason={t('widget.review.invalid-context')}
      />
    );
  }

  return (
    <div
      ref={cardRef}
      className="journalit-reviewv2-card journalit-reviewv2-grade-colors"
    >
      <div className="journalit-reviewv2-card-header journalit-reviewv2-card-header--center">
        <div className="journalit-reviewv2-card-title journalit-reviewv2-card-title--uppercase">
          {t('widget.review.title')}
        </div>
      </div>

      {gradeScale === 'letter' ? (
        <div className="journalit-reviewv2-grade-grid">
          <LetterGradeSection
            label={t('widget.review.mental-game')}
            selectedGrade={mentalGrade}
            field="mentalGrade"
            preview={preview}
            onUpdateGrade={updateGrade}
          />
          <LetterGradeSection
            label={t('widget.review.technical-game')}
            selectedGrade={technicalGrade}
            field="technicalGrade"
            preview={preview}
            onUpdateGrade={updateGrade}
          />
        </div>
      ) : (
        <div className="journalit-reviewv2-grade-grid">
          <StarRatingSection
            label={t('widget.review.mental-game')}
            selectedGrade={mentalGrade}
            field="mentalGrade"
            preview={preview}
            onUpdateGrade={updateGrade}
          />
          <StarRatingSection
            label={t('widget.review.technical-game')}
            selectedGrade={technicalGrade}
            field="technicalGrade"
            preview={preview}
            onUpdateGrade={updateGrade}
          />
        </div>
      )}
    </div>
  );
};
