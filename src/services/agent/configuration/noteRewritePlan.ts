import { App } from 'obsidian';
import { storedTagValuesMatch } from '../../../utils/tradeTagNormalization';
import { normalizedEquals } from '../../../utils/stringNormalization';
import type { OptionCatalogChange } from './optionChangeTypes';
import {
  assertRewriteCountLimit,
  assertUniqueOwnedYamlKeys,
  boundedRewriteCounts,
  cloneRewriteValue,
  collectNoteRewriteMutations,
  collectOwnedSourceNotes,
  deepFreezeRewriteValue,
  failNoteRewrite,
  hashNoteRewriteContent,
  isUnknownArray,
  rethrowPrivacySafeNoteRewrite,
  type ParsedNote,
} from './noteRewriteCore';
import { isRecord } from './configurationPrimitives';
import {
  EVENT_REWRITE_OWNED_KEYS,
  eventIdentitiesMatch,
  inspectEventKeyEvents,
  isWeeklyReviewNote,
  rewriteEventNote,
  type EventRewriteNoteCategory,
} from './eventNoteRewrite';
import { DAY_TRADE_FIELD_REWRITE_OWNED_KEYS } from './dayTradeFieldNoteRewrite';
import {
  MISTAKE_REWRITE_OWNED_KEYS,
  rewriteMistakeNote,
  type MistakeRewriteNoteCategory,
} from './mistakeNoteRewrite';
import { resolveJournalFolderPath } from '../../../utils/tagOptionNoteEligibility';
import {
  galleryAnnotationNotePath as galleryAnnotationNotePathFor,
  resolveGalleryAnnotationNotePath,
} from '../../imageGallery/ImageGalleryAnnotationStore';
import {
  IMAGE_ANNOTATIONS_KEY,
  isAnnotationOnlyTagCategory,
  TAG_REWRITE_OWNED_KEYS,
  rewriteTagNote,
  type TagRewriteNoteCategory,
} from './tagNoteRewrite';

type PreviewChange = OptionCatalogChange;

export type TagRewriteChange = Extract<
  PreviewChange,
  { kind: 'rename_tag' | 'merge_tags' | 'delete_tag' }
>;

export type MistakeRewriteChange = Extract<
  PreviewChange,
  { kind: 'rename_mistake' | 'merge_mistakes' | 'delete_mistake' }
>;

export type EventRewriteChange = Extract<
  PreviewChange,
  { kind: 'rename_event' | 'merge_events' | 'delete_event' }
>;

export type NoteRewriteChange =
  | TagRewriteChange
  | MistakeRewriteChange
  | EventRewriteChange;

type NoteRewriteNoteCategory =
  | TagRewriteNoteCategory
  | MistakeRewriteNoteCategory
  | EventRewriteNoteCategory;

export interface NoteRewriteNoteMutation<
  Category extends NoteRewriteNoteCategory = NoteRewriteNoteCategory,
> {
  readonly path: string;
  readonly category: Category;
  readonly originalContent: string;
  readonly originalContentHash: string;
  readonly resultingContent: string;
}

export interface TagRewritePlan {
  readonly change: TagRewriteChange;
  readonly mutations: readonly NoteRewriteNoteMutation<TagRewriteNoteCategory>[];
  readonly affectedTradeCount: number;
  readonly affectedSetupCount: number;
  
  readonly affectedReviewCount: number;
  
  readonly affectedOtherNoteCount: number;
  readonly affectedNoteCount: number;
}

export interface MistakeRewritePlan {
  readonly change: MistakeRewriteChange;
  readonly mutations: readonly NoteRewriteNoteMutation<MistakeRewriteNoteCategory>[];
  readonly affectedTradeCount: number;
  readonly affectedReviewCount: number;
  readonly affectedNoteCount: number;
}

interface EventRewriteReference {
  readonly path: string;
  readonly originalContent: string;
  readonly originalContentHash: string;
}

export interface EventRewritePlan {
  readonly change: EventRewriteChange;
  readonly mutations: readonly NoteRewriteNoteMutation<EventRewriteNoteCategory>[];
  readonly references: readonly EventRewriteReference[];
  readonly affectedReviewCount: number;
  readonly preservedReviewCount: number;
  readonly affectedNoteCount: number;
}

export type NoteRewritePlan =
  | TagRewritePlan
  | MistakeRewritePlan
  | EventRewritePlan;

interface TagRewriteSummary {
  readonly affected_trade_count: number;
  readonly affected_setup_count: number;
  readonly affected_review_count: number;
  readonly affected_other_note_count: number;
  readonly affected_note_count: number;
}

interface MistakeRewriteSummary {
  readonly affected_trade_count: number;
  readonly affected_review_count: number;
  readonly affected_note_count: number;
}

interface EventRewriteSummary {
  readonly affected_review_count: number;
  readonly preserved_review_count: number;
  readonly affected_note_count: number;
}

export function isTagRewriteChange(
  change: PreviewChange | NoteRewriteChange
): change is TagRewriteChange {
  return (
    change.kind === 'rename_tag' ||
    change.kind === 'merge_tags' ||
    change.kind === 'delete_tag'
  );
}

export function isMistakeRewriteChange(
  change: PreviewChange | NoteRewriteChange
): change is MistakeRewriteChange {
  return (
    change.kind === 'rename_mistake' ||
    change.kind === 'merge_mistakes' ||
    change.kind === 'delete_mistake'
  );
}

export function isNoteRewriteChange(
  change: PreviewChange
): change is NoteRewriteChange {
  return (
    isTagRewriteChange(change) ||
    isMistakeRewriteChange(change) ||
    isEventRewriteChange(change)
  );
}

export function isEventRewriteChange(
  change: PreviewChange | NoteRewriteChange
): change is EventRewriteChange {
  return (
    change.kind === 'rename_event' ||
    change.kind === 'merge_events' ||
    change.kind === 'delete_event'
  );
}

export function isTagRewritePlan(
  plan: NoteRewritePlan
): plan is TagRewritePlan {
  return isTagRewriteChange(plan.change);
}

export function isMistakeRewritePlan(
  plan: NoteRewritePlan
): plan is MistakeRewritePlan {
  return isMistakeRewriteChange(plan.change);
}

export function isEventRewritePlan(
  plan: NoteRewritePlan
): plan is EventRewritePlan {
  return isEventRewriteChange(plan.change);
}

function noteRewriteSourceIdentity(
  change: TagRewriteChange | MistakeRewriteChange
): string {
  switch (change.kind) {
    case 'rename_tag':
    case 'merge_tags':
    case 'rename_mistake':
    case 'merge_mistakes':
      return change.source_value;
    case 'delete_tag':
    case 'delete_mistake':
      return change.value;
    default: {
      const exhaustive: never = change;
      return exhaustive;
    }
  }
}

function noteRewriteTargetIdentity(
  change: TagRewriteChange | MistakeRewriteChange
): string | undefined {
  switch (change.kind) {
    case 'rename_tag':
    case 'merge_tags':
    case 'rename_mistake':
    case 'merge_mistakes':
      return change.target_value;
    case 'delete_tag':
    case 'delete_mistake':
      return undefined;
    default: {
      const exhaustive: never = change;
      return exhaustive;
    }
  }
}

export function tagRewriteAffectedCounts(
  tradeCount: number,
  setupCount: number,
  reviewCount: number,
  otherNoteCount: number
): TagRewriteSummary {
  const notes = boundedRewriteCounts(tradeCount, setupCount);
  const withReviews = boundedRewriteCounts(notes.total, reviewCount);
  const counts = boundedRewriteCounts(withReviews.total, otherNoteCount);
  return {
    affected_trade_count: notes.left,
    affected_setup_count: notes.right,
    affected_review_count: withReviews.right,
    affected_other_note_count: counts.right,
    affected_note_count: counts.total,
  };
}

export function mistakeRewriteAffectedCounts(
  tradeCount: number,
  reviewCount: number
): MistakeRewriteSummary {
  const counts = boundedRewriteCounts(tradeCount, reviewCount);
  return {
    affected_trade_count: counts.left,
    affected_review_count: counts.right,
    affected_note_count: counts.total,
  };
}

function eventRewriteAffectedCounts(reviewCount: number): EventRewriteSummary {
  const counts = boundedRewriteCounts(reviewCount, 0);
  return {
    affected_review_count: counts.left,
    preserved_review_count: 0,
    affected_note_count: counts.total,
  };
}

function eventRewritePreservedCounts(reviewCount: number): EventRewriteSummary {
  const counts = boundedRewriteCounts(reviewCount, 0);
  return {
    affected_review_count: 0,
    preserved_review_count: counts.left,
    affected_note_count: 0,
  };
}

async function scanOwnedRewritePlan<
  Change extends TagRewriteChange | MistakeRewriteChange,
  Category extends NoteRewriteNoteCategory,
  Plan,
>(input: {
  app: App;
  settings: unknown;
  change: Change;
  ownedKeys: readonly string[];
  
  structuredKeys: readonly string[];
  
  additionalPaths?: readonly string[];
  rawSourceMatches: (token: string) => boolean;
  rewrite: (args: {
    path: string;
    content: string;
    parsed: ParsedNote;
    source: string;
    target: string | undefined;
  }) => { category: Category; resultingContent: string } | undefined;
  onCounted: (category: Category) => void;
  toPlan: (
    change: Change,
    mutations: NoteRewriteNoteMutation<Category>[]
  ) => Plan;
}): Promise<Plan> {
  try {
    const change = cloneRewriteValue(input.change);
    const source = noteRewriteSourceIdentity(change);
    const target = noteRewriteTargetIdentity(change);
    const mutations = await collectNoteRewriteMutations({
      app: input.app,
      settings: input.settings,
      ownedKeys: input.ownedKeys,
      structuredKeys: input.structuredKeys,
      additionalPaths: input.additionalPaths,
      rawSourceMatches: input.rawSourceMatches,
      visit: ({ path, content, parsed }) => {
        const rewritten = input.rewrite({
          path,
          content,
          parsed,
          source,
          target,
        });
        if (rewritten === undefined) return undefined;
        input.onCounted(rewritten.category);
        return rewritten;
      },
    });
    return deepFreezeRewriteValue(input.toPlan(change, mutations));
  } catch (error) {
    rethrowPrivacySafeNoteRewrite(error);
  }
}

export async function scanTagRewritePlan(input: {
  app: App;
  settings: unknown;
  change: TagRewriteChange;
}): Promise<TagRewritePlan> {
  const source = noteRewriteSourceIdentity(input.change);
  const galleryAnnotationNotePath = resolveGalleryAnnotationNotePath(
    input.app.vault,
    galleryAnnotationNotePathFor(resolveJournalFolderPath(input.settings))
  );
  let tradeCount = 0;
  let setupCount = 0;
  let reviewCount = 0;
  let otherNoteCount = 0;
  return scanOwnedRewritePlan({
    app: input.app,
    settings: input.settings,
    change: input.change,
    ownedKeys: TAG_REWRITE_OWNED_KEYS,
    
    
    structuredKeys: [
      ...DAY_TRADE_FIELD_REWRITE_OWNED_KEYS,
      IMAGE_ANNOTATIONS_KEY,
    ],
    rawSourceMatches: (token) => storedTagValuesMatch(token, source),
    
    
    additionalPaths: [galleryAnnotationNotePath],
    rewrite: (args) => rewriteTagNote({ ...args, galleryAnnotationNotePath }),
    onCounted: (category) => {
      
      
      
      if (category === 'note') otherNoteCount += 1;
      else if (category === 'drc' || isAnnotationOnlyTagCategory(category))
        reviewCount += 1;
      else if (category === 'setup') setupCount += 1;
      else tradeCount += 1;
      tagRewriteAffectedCounts(
        tradeCount,
        setupCount,
        reviewCount,
        otherNoteCount
      );
    },
    toPlan: (change, mutations) => {
      const counts = tagRewriteAffectedCounts(
        tradeCount,
        setupCount,
        reviewCount,
        otherNoteCount
      );
      return {
        change,
        mutations,
        affectedTradeCount: counts.affected_trade_count,
        affectedSetupCount: counts.affected_setup_count,
        affectedReviewCount: counts.affected_review_count,
        affectedOtherNoteCount: counts.affected_other_note_count,
        affectedNoteCount: counts.affected_note_count,
      };
    },
  });
}

export async function scanMistakeRewritePlan(input: {
  app: App;
  settings: unknown;
  change: MistakeRewriteChange;
}): Promise<MistakeRewritePlan> {
  const source = noteRewriteSourceIdentity(input.change);
  let tradeCount = 0;
  let reviewCount = 0;
  return scanOwnedRewritePlan({
    app: input.app,
    settings: input.settings,
    change: input.change,
    ownedKeys: MISTAKE_REWRITE_OWNED_KEYS,
    
    structuredKeys: DAY_TRADE_FIELD_REWRITE_OWNED_KEYS,
    rawSourceMatches: (token) => normalizedEquals(token, source),
    rewrite: rewriteMistakeNote,
    onCounted: (category) => {
      if (category === 'drc') reviewCount += 1;
      else tradeCount += 1;
      assertRewriteCountLimit(tradeCount, reviewCount);
    },
    toPlan: (change, mutations) => {
      const counts = mistakeRewriteAffectedCounts(tradeCount, reviewCount);
      return {
        change,
        mutations,
        affectedTradeCount: counts.affected_trade_count,
        affectedReviewCount: counts.affected_review_count,
        affectedNoteCount: counts.affected_note_count,
      };
    },
  });
}

function eventRewriteSourceIdentity(change: EventRewriteChange): string {
  return change.kind === 'delete_event' ? change.name : change.source_name;
}

function storedEventTargetName(
  settings: unknown,
  change: EventRewriteChange
): string | undefined {
  if (change.kind === 'delete_event') return undefined;
  if (change.kind === 'rename_event') return change.target_name;
  if (!isRecord(settings) || !isRecord(settings.customOptions_options)) {
    failNoteRewrite('conflict');
  }
  const events = settings.customOptions_options.event;
  if (!isUnknownArray(events)) failNoteRewrite('conflict');
  const key = change.target_name.toLowerCase();
  let found: string | undefined;
  for (let index = 0; index < events.length; index += 1) {
    const entry = events[index];
    if (!isRecord(entry) || typeof entry.name !== 'string') continue;
    if (entry.name.trim().toLowerCase() !== key) continue;
    if (found !== undefined) failNoteRewrite('conflict');
    found = entry.name;
  }
  if (found === undefined) failNoteRewrite('conflict');
  return found;
}

async function scanEventRewritePlan(input: {
  app: App;
  settings: unknown;
  change: EventRewriteChange;
}): Promise<EventRewritePlan> {
  try {
    const change = cloneRewriteValue(input.change);
    const source = eventRewriteSourceIdentity(change);
    const target = storedEventTargetName(input.settings, change);
    let reviewCount = 0;
    const collected = await collectOwnedSourceNotes({
      app: input.app,
      settings: input.settings,
      ownedKeys: EVENT_REWRITE_OWNED_KEYS,
      rawSourceMatches: (token) => eventIdentitiesMatch(token, source),
      visit: ({ parsed, content }) => {
        assertUniqueOwnedYamlKeys(
          parsed.yaml,
          parsed.frontmatter,
          EVENT_REWRITE_OWNED_KEYS
        );
        const inspected = inspectEventKeyEvents({
          frontmatter: parsed.frontmatter,
          source,
          target,
        });
        if (inspected === undefined) return undefined;
        if (!isWeeklyReviewNote(parsed.frontmatter)) {
          failNoteRewrite('conflict');
        }
        reviewCount += 1;
        assertRewriteCountLimit(reviewCount, 0);
        if (change.kind === 'delete_event') {
          return { kind: 'preserve' as const };
        }
        return {
          kind: 'rewrite' as const,
          resultingContent: rewriteEventNote({
            content,
            parsed,
            items: inspected.items,
          }),
        };
      },
    });
    const hashedEntries = await Promise.all(
      collected.map(async (entry) => ({
        entry,
        originalContentHash: await hashNoteRewriteContent(entry.content),
      }))
    );
    const references: EventRewriteReference[] = [];
    const mutations: NoteRewriteNoteMutation<EventRewriteNoteCategory>[] = [];
    for (const { entry, originalContentHash } of hashedEntries) {
      references.push({
        path: entry.path,
        originalContent: entry.content,
        originalContentHash,
      });
      if (entry.result.kind !== 'rewrite') continue;
      mutations.push({
        path: entry.path,
        category: 'weekly',
        originalContent: entry.content,
        originalContentHash,
        resultingContent: entry.result.resultingContent,
      });
    }
    const counts =
      change.kind === 'delete_event'
        ? eventRewritePreservedCounts(reviewCount)
        : eventRewriteAffectedCounts(reviewCount);
    return deepFreezeRewriteValue({
      change,
      mutations,
      references,
      affectedReviewCount: counts.affected_review_count,
      preservedReviewCount: counts.preserved_review_count,
      affectedNoteCount: counts.affected_note_count,
    });
  } catch (error) {
    rethrowPrivacySafeNoteRewrite(error);
  }
}

export async function scanNoteRewritePlan(input: {
  app: App;
  settings: unknown;
  change: NoteRewriteChange;
}): Promise<NoteRewritePlan> {
  if (isTagRewriteChange(input.change)) {
    return scanTagRewritePlan({
      app: input.app,
      settings: input.settings,
      change: input.change,
    });
  }
  if (isMistakeRewriteChange(input.change)) {
    return scanMistakeRewritePlan({
      app: input.app,
      settings: input.settings,
      change: input.change,
    });
  }
  return scanEventRewritePlan({
    app: input.app,
    settings: input.settings,
    change: input.change,
  });
}
