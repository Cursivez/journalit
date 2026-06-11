import { TFile } from 'obsidian';
import type JournalitPlugin from '../main';
import type {
  CustomReviewFieldDefinition,
  ReviewFieldReviewType,
} from '../types/reviewCustomFields';
import { readReviewCustomFieldValuesByIdFromFrontmatter } from '../utils/reviewCustomFieldPersistence';

const REVIEW_TYPE_LABELS: Record<ReviewFieldReviewType, string> = {
  yearly: 'Yearly Context',
  quarterly: 'Quarterly Context',
  monthly: 'Monthly Context',
  weekly: 'Weekly Context',
  drc: 'Daily Context',
};

const SOURCE_ORDER: Exclude<ReviewFieldReviewType, 'drc'>[] = [
  'yearly',
  'quarterly',
  'monthly',
  'weekly',
];

const REVIEW_TYPE_TO_FRONTMATTER_TYPE: Record<
  Exclude<ReviewFieldReviewType, 'drc'>,
  string
> = {
  yearly: 'yearly-review',
  quarterly: 'quarterly-review',
  monthly: 'monthly-review',
  weekly: 'weekly-review',
};

const PARENT_SOURCE_TYPES: Record<
  ReviewFieldReviewType,
  ReviewFieldReviewType[]
> = {
  drc: ['yearly', 'quarterly', 'monthly', 'weekly'],
  weekly: ['yearly', 'quarterly', 'monthly'],
  monthly: ['yearly', 'quarterly'],
  quarterly: ['yearly'],
  yearly: [],
};

export interface ReviewContextFieldValue {
  fieldId: string;
  fieldKey: string;
  label: string;
  value: unknown;
  formattedValue: string;
  sourceType: ReviewFieldReviewType;
  sourcePath: string;
  overridden?: boolean;
  field: CustomReviewFieldDefinition;
}

export interface ReviewContextSource {
  type: ReviewFieldReviewType;
  path: string;
  exists: boolean;
  valid: boolean;
  label: string;
  fields: ReviewContextFieldValue[];
}

export interface InheritedReviewContext {
  targetType: ReviewFieldReviewType;
  targetDate: Date;
  sources: ReviewContextSource[];
}

interface GetInheritedContextParams {
  targetType: ReviewFieldReviewType;
  targetDate: Date;
  includeSources?: ReviewFieldReviewType[];
}

function hasValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function formatReviewContextValue(value: unknown): string {
  if (!hasValue(value)) return '';
  if (Array.isArray(value)) return value.map(String).join(', ');
  return String(value);
}

export class ReviewContextInheritanceService {
  constructor(private readonly plugin: JournalitPlugin) {}

  public getEditableFieldsForReview(
    type: ReviewFieldReviewType
  ): CustomReviewFieldDefinition[] {
    return this.plugin.customReviewFieldsService.getEditableFieldsForReview(
      type
    );
  }

  public getInheritedFieldsForReview(
    type: ReviewFieldReviewType
  ): CustomReviewFieldDefinition[] {
    return this.plugin.customReviewFieldsService.getInheritedFieldsForReview(
      type
    );
  }

  public async getInheritedContext({
    targetType,
    targetDate,
    includeSources,
  }: GetInheritedContextParams): Promise<InheritedReviewContext> {
    const sourceTypes = this.getSourceTypes(targetType, includeSources);
    const inheritedFields = this.getInheritedFieldsForReview(targetType);
    const sources = await Promise.all(
      sourceTypes.map(async (sourceType) => {
        const path = await this.resolveReviewPath(sourceType, targetDate);
        const sourceFields = inheritedFields.filter((field) =>
          this.fieldCanInheritFromSource(field, sourceType)
        );

        return this.buildSource(sourceType, path, sourceFields);
      })
    );

    return {
      targetType,
      targetDate,
      sources,
    };
  }

  private getSourceTypes(
    targetType: ReviewFieldReviewType,
    includeSources?: ReviewFieldReviewType[]
  ): ReviewFieldReviewType[] {
    const parentTypes = PARENT_SOURCE_TYPES[targetType];
    const requestedSources = includeSources
      ? new Set(includeSources)
      : new Set(parentTypes);

    return SOURCE_ORDER.filter(
      (sourceType) =>
        parentTypes.includes(sourceType) && requestedSources.has(sourceType)
    );
  }

  private fieldCanInheritFromSource(
    field: CustomReviewFieldDefinition,
    sourceType: ReviewFieldReviewType
  ): boolean {
    return (
      field.inheritance.sources.includes(sourceType) &&
      field.scope.reviewTypes.includes(sourceType)
    );
  }

  private async buildSource(
    sourceType: ReviewFieldReviewType,
    path: string,
    fields: CustomReviewFieldDefinition[]
  ): Promise<ReviewContextSource> {
    const file = this.plugin.app.vault.getAbstractFileByPath(path);

    if (!(file instanceof TFile)) {
      return {
        type: sourceType,
        path,
        exists: false,
        valid: false,
        label: REVIEW_TYPE_LABELS[sourceType],
        fields: [],
      };
    }

    const frontmatter =
      this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;

    if (!this.isExpectedReviewSource(sourceType, frontmatter)) {
      return {
        type: sourceType,
        path,
        exists: true,
        valid: false,
        label: REVIEW_TYPE_LABELS[sourceType],
        fields: [],
      };
    }

    const values = readReviewCustomFieldValuesByIdFromFrontmatter(
      frontmatter,
      fields
    );

    return {
      type: sourceType,
      path,
      exists: true,
      valid: true,
      label: REVIEW_TYPE_LABELS[sourceType],
      fields: fields
        .filter(
          (field) =>
            !field.inheritance.hideWhenEmpty || hasValue(values[field.id])
        )
        .map((field) => ({
          fieldId: field.id,
          fieldKey: field.fieldKey,
          label: field.label,
          value: values[field.id],
          formattedValue: formatReviewContextValue(values[field.id]),
          sourceType,
          sourcePath: path,
          field,
        })),
    };
  }

  private isExpectedReviewSource(
    sourceType: ReviewFieldReviewType,
    frontmatter: unknown
  ): boolean {
    if (
      sourceType === 'drc' ||
      !frontmatter ||
      typeof frontmatter !== 'object' ||
      Array.isArray(frontmatter)
    ) {
      return false;
    }

    return (
      (frontmatter as Record<string, unknown>).type ===
      REVIEW_TYPE_TO_FRONTMATTER_TYPE[sourceType]
    );
  }

  private async resolveReviewPath(
    sourceType: ReviewFieldReviewType,
    date: Date
  ): Promise<string> {
    switch (sourceType) {
      case 'weekly': {
        const weeklyService =
          await this.plugin.serviceManager.getWeeklyReviewService();
        return weeklyService.getWeeklyReviewPath(date);
      }
      case 'monthly': {
        const monthlyService =
          await this.plugin.serviceManager.getMonthlyReviewService();
        return monthlyService.getMonthlyReviewPath(date);
      }
      case 'quarterly': {
        const quarterlyService =
          await this.plugin.serviceManager.getQuarterlyReviewService();
        return quarterlyService.getQuarterlyReviewPath(date);
      }
      case 'yearly': {
        const yearlyService =
          await this.plugin.serviceManager.getYearlyReviewService();
        return yearlyService.getYearlyReviewPath(date);
      }
      case 'drc':
        throw new Error('DRC is not a parent review context source');
      default: {
        const exhaustive: never = sourceType;
        throw new Error(`Unsupported review context source: ${exhaustive}`);
      }
    }
  }
}
