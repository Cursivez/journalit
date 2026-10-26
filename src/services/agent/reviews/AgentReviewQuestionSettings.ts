import type { JournalitSettings } from '../../../settings/types';
import type { AgentReviewPeriod } from './AgentReviewRevision';

const UNAVAILABLE_MESSAGE = 'Review question settings are unavailable.';

export function getAgentReviewQuestionLabels(
  settings: JournalitSettings,
  period: AgentReviewPeriod
): string[] {
  let labels: readonly string[] | undefined;
  switch (period) {
    case 'day':
      labels = settings.drc.reviewQuestions;
      break;
    case 'week':
      labels = settings.weekly.reviewQuestions;
      break;
    case 'month':
      labels = settings.monthly?.reviewQuestions;
      break;
    case 'quarter':
      labels = settings.quarterly?.reviewQuestions;
      break;
    case 'year':
      labels = settings.yearly?.reviewQuestions;
      break;
  }
  if (!labels) throw new Error(UNAVAILABLE_MESSAGE);
  return [...labels];
}
