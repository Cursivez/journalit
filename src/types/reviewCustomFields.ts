import type { CustomFieldDefinition } from './customFields';
import type { ReviewTemplate } from './reviewV2';

export type ReviewFieldReviewType = ReviewTemplate['type'];

export type ReviewFieldInheritanceMode =
  | 'inherit-only'
  | 'local-only'
  | 'inherit-and-local';

export const REVIEW_FIELD_REVIEW_TYPES: ReviewFieldReviewType[] = [
  'drc',
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
];

export interface CustomReviewFieldScope {
  reviewTypes: ReviewFieldReviewType[];
  editableOn: ReviewFieldReviewType[];
  inheritTo: ReviewFieldReviewType[];
}

export interface CustomReviewFieldInheritance {
  enabled: boolean;
  sources: ReviewFieldReviewType[];
  mode: ReviewFieldInheritanceMode;
  showSourceLabels: boolean;
  hideWhenEmpty: boolean;
}

export interface CustomReviewFieldDisplay {
  order: number;
  compact?: boolean;
}

export interface CustomReviewFieldGroup {
  id: string;
  name: string;
  description?: string;
  order: number;
  collapsedByDefault?: boolean;
}

export interface CustomReviewFieldDefinition extends Omit<
  CustomFieldDefinition,
  'options' | 'tradeLog'
> {
  description?: string;
  groupId?: string;
  options?: string[];
  scope: CustomReviewFieldScope;
  inheritance: CustomReviewFieldInheritance;
  display: CustomReviewFieldDisplay;
}

export interface CustomReviewFieldsData {
  groups: CustomReviewFieldGroup[];
  fields: CustomReviewFieldDefinition[];
}

export const DEFAULT_REVIEW_FIELD_REVIEW_TYPES: ReviewFieldReviewType[] = [
  'monthly',
  'weekly',
  'drc',
];

export const DEFAULT_REVIEW_FIELD_INHERIT_TO: ReviewFieldReviewType[] = [
  'weekly',
  'drc',
];

export const DEFAULT_REVIEW_FIELD_INHERITANCE_SOURCES: ReviewFieldReviewType[] =
  ['monthly', 'weekly'];

export const REVIEW_FIELD_INHERITANCE_MODES: ReviewFieldInheritanceMode[] = [
  'inherit-only',
  'local-only',
  'inherit-and-local',
];

export const DEFAULT_CUSTOM_REVIEW_FIELDS_DATA: CustomReviewFieldsData = {
  groups: [],
  fields: [],
};
