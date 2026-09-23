import type { ReviewChangedPayload } from './types';

export function getReviewChangedPaths(
  payload: ReviewChangedPayload
): readonly string[] {
  if (payload.filePaths) return payload.filePaths;
  return payload.filePath ? [payload.filePath] : [];
}

export function reviewChangeAffectsPath(
  payload: ReviewChangedPayload,
  filePath: string
): boolean {
  return getReviewChangedPaths(payload).includes(filePath);
}
