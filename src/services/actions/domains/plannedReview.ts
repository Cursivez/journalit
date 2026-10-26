import type { TFile } from 'obsidian';
import { ActionPlanError } from '../ActionErrors';
import type { ActionPlanContext } from '../ActionTypes';
import { throwIfAborted } from './tradeActionSupport';

interface ReviewIdentity {
  readonly period: string;
  readonly period_start: string;
}


export function reviewIdentityKey(review: ReviewIdentity): string {
  return `review:${review.period}:${review.period_start}`;
}


export async function resolvePlannedReview<Review extends ReviewIdentity>(
  resolve: (review: Review, signal: AbortSignal) => Promise<TFile | null>,
  review: Review,
  context: ActionPlanContext
): Promise<TFile | null> {
  const file = await resolve(review, context.signal);
  throwIfAborted(context.signal);
  if (file) return file;
  if (context.createdEarlier?.has(reviewIdentityKey(review))) return null;
  throw new ActionPlanError('not_found', 'review');
}
