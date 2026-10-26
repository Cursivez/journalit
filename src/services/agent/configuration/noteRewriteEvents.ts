import { OptionType } from '../../options/CustomOptionsService';
import { eventBus } from '../../events';
import {
  isEventRewritePlan,
  isMistakeRewritePlan,
  isTagRewritePlan,
  type EventRewritePlan,
  type MistakeRewritePlan,
  type NoteRewritePlan,
  type TagRewritePlan,
} from './noteRewritePlan';
import {
  PERIODIC_REVIEW_CATEGORIES,
  type TagRewriteNoteCategory,
} from './tagNoteRewrite';
import {
  REVIEW_TYPE_TO_SOURCE,
  type ReviewSourceType,
} from '../../imageGallery/ImageGalleryInternal';

interface TradeFamilyRewritePaths {
  readonly tradePaths: readonly string[];
  readonly missedPaths: readonly string[];
  readonly backtestPaths: readonly string[];
}

function bucketTradeFamilyRewritePaths(
  mutations: readonly { readonly path: string; readonly category: string }[]
): {
  tradePaths: string[];
  setupPaths: string[];
  missedPaths: string[];
  backtestPaths: string[];
  reviewPaths: string[];
} {
  const tradePaths: string[] = [];
  const setupPaths: string[] = [];
  const missedPaths: string[] = [];
  const backtestPaths: string[] = [];
  const reviewPaths: string[] = [];
  for (let index = 0; index < mutations.length; index += 1) {
    const mutation = mutations[index];
    switch (mutation.category) {
      case 'trade':
        tradePaths.push(mutation.path);
        break;
      case 'setup':
        setupPaths.push(mutation.path);
        break;
      case 'missed_trade':
        missedPaths.push(mutation.path);
        break;
      case 'backtest_trade':
        backtestPaths.push(mutation.path);
        break;
      case 'drc':
        reviewPaths.push(mutation.path);
        break;
      default:
        break;
    }
  }
  return { tradePaths, setupPaths, missedPaths, backtestPaths, reviewPaths };
}

function publishTradeFamilyRewriteEvents(paths: TradeFamilyRewritePaths): void {
  if (paths.tradePaths.length > 0) {
    eventBus.publish('trade:changed', {
      action: 'batch',
      filePaths: [...paths.tradePaths],
    });
  }
  if (paths.missedPaths.length > 0 || paths.backtestPaths.length > 0) {
    const timestamp = Date.now();
    for (let index = 0; index < paths.missedPaths.length; index += 1) {
      eventBus.publish('missed-trade:changed', {
        action: 'updated',
        filePath: paths.missedPaths[index],
        timestamp,
      });
    }
    for (let index = 0; index < paths.backtestPaths.length; index += 1) {
      eventBus.publish('backtest-trade:changed', {
        action: 'updated',
        filePath: paths.backtestPaths[index],
        timestamp,
      });
    }
  }
}

function publishTagRewriteCommitted(
  plan: TagRewritePlan,
  notifyOptionsChanged: (payload: {
    optionType: OptionType;
    action: 'updated' | 'deleted';
  }) => void
): void {
  notifyOptionsChanged({
    optionType: OptionType.TAG,
    action: plan.change.kind === 'delete_tag' ? 'deleted' : 'updated',
  });
  const buckets = bucketTradeFamilyRewritePaths(plan.mutations);
  if (buckets.tradePaths.length > 0) {
    eventBus.publish('trade:changed', {
      action: 'batch',
      filePaths: buckets.tradePaths,
    });
  }
  if (buckets.setupPaths.length > 0) {
    eventBus.publish('setup:changed', {
      action: 'batch',
      filePaths: buckets.setupPaths,
    });
  }
  publishTradeFamilyRewriteEvents({
    tradePaths: [],
    missedPaths: buckets.missedPaths,
    backtestPaths: buckets.backtestPaths,
  });
  publishReviewRewriteEvents(buckets.reviewPaths);
  let annotationNoteChanged = false;
  for (const mutation of plan.mutations) {
    const reviewType = PERIODIC_REVIEW_EVENT_TYPES.get(mutation.category);
    if (reviewType) {
      eventBus.publish('review:changed', {
        type: reviewType,
        action: 'updated',
        filePath: mutation.path,
      });
    } else if (mutation.category === 'note') {
      annotationNoteChanged = true;
    }
  }
  
  
  if (annotationNoteChanged) eventBus.publish('image-gallery:changed');
}

const PERIODIC_REVIEW_EVENT_TYPES = new Map<
  TagRewriteNoteCategory,
  ReviewSourceType
>(
  PERIODIC_REVIEW_CATEGORIES.map(([type, category]) => [
    category,
    REVIEW_TYPE_TO_SOURCE[type],
  ])
);

function publishMistakeRewriteCommitted(
  plan: MistakeRewritePlan,
  notifyOptionsChanged: (payload: {
    optionType: OptionType;
    action: 'updated' | 'deleted';
  }) => void
): void {
  notifyOptionsChanged({
    optionType: OptionType.MISTAKE,
    action: plan.change.kind === 'delete_mistake' ? 'deleted' : 'updated',
  });
  const buckets = bucketTradeFamilyRewritePaths(plan.mutations);
  publishTradeFamilyRewriteEvents({
    tradePaths: buckets.tradePaths,
    missedPaths: buckets.missedPaths,
    backtestPaths: buckets.backtestPaths,
  });
  publishReviewRewriteEvents(buckets.reviewPaths);
}

function publishReviewRewriteEvents(reviewPaths: readonly string[]): void {
  for (let index = 0; index < reviewPaths.length; index += 1) {
    eventBus.publish('review:changed', {
      type: 'drc',
      action: 'updated',
      filePath: reviewPaths[index],
    });
  }
}

function publishEventRewriteCommitted(
  plan: EventRewritePlan,
  notifyOptionsChanged: (payload: {
    optionType: OptionType;
    action: 'updated' | 'deleted';
  }) => void
): void {
  notifyOptionsChanged({
    optionType: OptionType.EVENT,
    action: plan.change.kind === 'delete_event' ? 'deleted' : 'updated',
  });
  if (plan.change.kind === 'delete_event') return;
  for (let index = 0; index < plan.mutations.length; index += 1) {
    eventBus.publish('review:changed', {
      type: 'weekly',
      action: 'updated',
      filePath: plan.mutations[index].path,
    });
  }
}

export function publishNoteRewriteCommitted(
  plan: NoteRewritePlan,
  notifyOptionsChanged: (payload: {
    optionType: OptionType;
    action: 'updated' | 'deleted';
  }) => void
): void {
  if (isTagRewritePlan(plan)) {
    publishTagRewriteCommitted(plan, notifyOptionsChanged);
    return;
  }
  if (isMistakeRewritePlan(plan)) {
    publishMistakeRewriteCommitted(plan, notifyOptionsChanged);
    return;
  }
  if (isEventRewritePlan(plan)) {
    publishEventRewriteCommitted(plan, notifyOptionsChanged);
    return;
  }
  const exhaustive: never = plan;
  return exhaustive;
}
