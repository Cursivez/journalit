const PREVIEW_UNAVAILABLE_SUFFIX =
  'preview is unavailable and may have expired, already been committed, or belong to another installation.';

export function previewUnavailableMessage(subject: string): string {
  return `${subject} ${PREVIEW_UNAVAILABLE_SUFFIX}`;
}
