import type { TFile } from 'obsidian';
import { t, tPlural } from '../../../lang/helpers';
import type { ImageAnnotation } from '../../../types/imageAnnotations';
import {
  normalizeImageAnnotation,
  serializeImageAnnotation,
} from '../../../utils/imageAnnotations';
import {
  listAgentOwnerMedia,
  type AgentMediaOwner,
} from '../../agent/media/agentOwnerMedia';
import {
  hasAnnotationEntry,
  isRecord,
  normalizeAnnotation,
  normalizeImagePath,
} from '../../imageGallery/ImageGalleryInternal';
import type { ImageAnnotationChange } from '../../imageGallery/ImageGalleryService';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionDefinitions,
  type ActionInput,
  type ActionPlanContext,
  type ActionSummary,
} from '../ActionTypes';
import {
  catalogTagsIn,
  tagCatalog,
  throwIfAborted,
} from './tradeActionSupport';

type ImageAnnotationActionId =
  | 'trade.set_image_annotations'
  | 'review.set_image_annotations';
type ImageRequest =
  ActionInput<'trade.set_image_annotations'>['images'][number];
type ImageChange =
  ActionSummary<'trade.set_image_annotations'>['images'][number];
type ReviewIdentity = ActionInput<'review.set_image_annotations'>['review'];

interface ImageAnnotationActionDependencies {
  
  tradeMedia(
    tradeId: string,
    signal: AbortSignal
  ): Promise<AgentMediaOwner | null>;
  
  reviewMedia(
    review: ReviewIdentity,
    signal: AbortSignal
  ): Promise<AgentMediaOwner | null>;
  resolveMediaFile(source: string, sourcePath: string): TFile | null;
  tradeRevision(
    path: string
  ): Promise<{ tradeRevision: number; contentRevision: string }>;
  
  runSerializedTradeWrite<T>(path: string, write: () => Promise<T>): Promise<T>;
  getAvailableTags(): readonly string[];
  
  readOwnAnnotations(file: TFile): Promise<unknown>;
  
  centralAnnotation(sourcePath: string, source: string): ImageAnnotation;
  
  writeAnnotations(
    sourcePath: string,
    changes: readonly ImageAnnotationChange[],
    guard: (annotations: Readonly<Record<string, unknown>>) => void
  ): Promise<Readonly<Record<string, unknown>>>;
}


type RestoringImageRequest = ImageRequest & {
  readonly restore_entry: Readonly<Record<string, unknown>> | null;
};

function restoreEntryOf(
  request: ImageRequest
): Readonly<Record<string, unknown>> | null | undefined {
  if (!('restore_entry' in request)) return undefined;
  const entry: unknown = request.restore_entry;
  if (entry === null || isRecord(entry)) return entry;
  throw new ActionPlanError('invalid_request', 'images');
}


interface PlannedImage {
  readonly mediaId: string;
  readonly source: string;
  
  readonly key: string;
  readonly before: ImageAnnotation;
  readonly after: ImageAnnotation;
  
  readonly inherited: ImageAnnotation | null;
  
  readonly storedEntry: Readonly<Record<string, unknown>> | null | undefined;
  
  readonly write: ImageAnnotationChange;
  
  readonly changes: boolean;
  readonly change: ImageChange;
}


interface CheckedRequest {
  readonly removeTags: readonly string[];
  readonly addTags: readonly string[];
  
  readonly notes: string | null | undefined;
}


class AnnotationsChangedError extends Error {}

function tagKey(tag: string): string {
  return tag.trim().toLowerCase();
}

function sameAnnotation(
  left: ImageAnnotation,
  right: ImageAnnotation
): boolean {
  return (
    JSON.stringify(serializeImageAnnotation(left)) ===
    JSON.stringify(serializeImageAnnotation(right))
  );
}

function ownEntries(value: unknown): Readonly<Record<string, unknown>> {
  return isRecord(value) ? value : {};
}


function entriesSnapshot(
  annotations: Readonly<Record<string, unknown>>,
  keys: readonly string[]
): string {
  return JSON.stringify(
    keys.map((key) => [
      key,
      hasAnnotationEntry(annotations, key) ? annotations[key] : null,
    ])
  );
}


function applyChange(
  before: ImageAnnotation,
  request: CheckedRequest
): ImageAnnotation {
  const removed = new Set(request.removeTags.map(tagKey));
  const tags = before.tags.filter((tag) => !removed.has(tagKey(tag)));
  for (const tag of request.addTags) {
    if (!tags.some((existing) => tagKey(existing) === tagKey(tag))) {
      tags.push(tag);
    }
  }
  const notes =
    request.notes === undefined ? before.notes : (request.notes ?? undefined);
  return normalizeImageAnnotation({ tags, ...(notes ? { notes } : {}) });
}


function checkRequest(
  request: ImageRequest,
  catalog: ReadonlyMap<string, string> | null
): CheckedRequest {
  const removeTags = request.remove_tags ?? [];
  const notes =
    request.notes === undefined || request.notes === null
      ? request.notes
      : request.notes.trim();
  if (catalog === null) {
    return { removeTags, addTags: request.add_tags ?? [], notes };
  }
  const addTags =
    request.add_tags === undefined
      ? []
      : catalogTagsIn(request.add_tags, catalog, 'images.add_tags');
  const removing = new Set(removeTags.map(tagKey));
  if (addTags.some((tag) => removing.has(tagKey(tag))) || notes === '') {
    throw new ActionPlanError('invalid_request', 'images');
  }
  return { removeTags, addTags, notes };
}


function describeChange(
  mediaId: string,
  before: ImageAnnotation,
  after: ImageAnnotation
): ImageChange {
  const beforeKeys = new Set(before.tags.map(tagKey));
  const afterKeys = new Set(after.tags.map(tagKey));
  const added = after.tags.filter((tag) => !beforeKeys.has(tagKey(tag)));
  const removed = before.tags.filter((tag) => !afterKeys.has(tagKey(tag)));
  return {
    media_id: mediaId,
    effective: true,
    ...(added.length > 0 ? { add_tags: added } : {}),
    ...(removed.length > 0 ? { remove_tags: removed } : {}),
    
    ...(before.notes !== after.notes ? { notes: after.notes ?? null } : {}),
  };
}


function restoringImages(
  images: readonly PlannedImage[]
): RestoringImageRequest[] | null {
  const restoring: RestoringImageRequest[] = [];
  for (const image of images) {
    if (image.storedEntry === undefined) return null;
    restoring.push({
      media_id: image.mediaId,
      restore_entry: image.storedEntry,
    });
  }
  return restoring;
}


export function createImageAnnotationActions(
  deps: ImageAnnotationActionDependencies
): Pick<ActionDefinitions, ImageAnnotationActionId> {
  
  const planImages = async (
    owner: AgentMediaOwner,
    images: readonly ImageRequest[],
    context: ActionPlanContext
  ): Promise<{
    changed: PlannedImage[];
    stored: Readonly<Record<string, unknown>>;
  }> => {
    const { installationId, signal } = context;
    if (installationId === undefined) {
      throw new ActionPlanError('unsupported_capability', 'images');
    }
    if (new Set(images.map((image) => image.media_id)).size !== images.length) {
      throw new ActionPlanError('invalid_request', 'images');
    }
    const media = new Map(
      (
        await listAgentOwnerMedia({
          owner,
          installationId,
          resolveMediaFile: (source, sourcePath) =>
            deps.resolveMediaFile(source, sourcePath),
        })
      ).map((item) => [item.mediaId, item])
    );
    throwIfAborted(signal);
    const stored = ownEntries(await deps.readOwnAnnotations(owner.file));
    throwIfAborted(signal);
    
    const catalog =
      context.origin === 'agent' ? tagCatalog(deps.getAvailableTags()) : null;
    const planned = images.map((request): PlannedImage => {
      const item = media.get(request.media_id);
      if (!item) throw new ActionPlanError('not_found', 'images');
      const key = normalizeImagePath(item.source);
      const central = normalizeImageAnnotation(
        deps.centralAnnotation(owner.file.path, item.source)
      );
      const hasOwn = hasAnnotationEntry(stored, key);
      const raw = stored[key];
      const storedEntry = !hasOwn ? null : isRecord(raw) ? raw : undefined;
      const before = hasOwn ? normalizeAnnotation(raw) : central;
      const restoreEntry =
        context.origin === 'agent' ? undefined : restoreEntryOf(request);
      if (restoreEntry !== undefined) {
        const after =
          restoreEntry === null ? central : normalizeAnnotation(restoreEntry);
        return {
          mediaId: item.mediaId,
          source: item.source,
          key,
          before,
          after,
          inherited: null,
          storedEntry,
          write:
            restoreEntry === null
              ? { imagePath: item.source, annotation: null }
              : { imagePath: item.source, storedEntry: restoreEntry },
          changes:
            JSON.stringify(hasOwn ? raw : null) !==
            JSON.stringify(restoreEntry),
          change: describeChange(item.mediaId, before, after),
        };
      }
      const after = applyChange(before, checkRequest(request, catalog));
      return {
        mediaId: item.mediaId,
        source: item.source,
        key,
        before,
        after,
        inherited: hasOwn ? null : central,
        storedEntry,
        
        
        write: {
          imagePath: item.source,
          annotation: !hasOwn && sameAnnotation(after, central) ? null : after,
        },
        changes: !sameAnnotation(before, after),
        change: describeChange(item.mediaId, before, after),
      };
    });
    const changed = planned.filter((image) => image.changes);
    return { changed, stored };
  };

  
  const writeImages = async (
    file: TFile,
    changed: readonly PlannedImage[],
    stored: Readonly<Record<string, unknown>>
  ): Promise<string> => {
    const keys = changed.map((image) => image.key);
    const expected = entriesSnapshot(stored, keys);
    try {
      const written = await deps.writeAnnotations(
        file.path,
        changed.map((image) => image.write),
        (current) => {
          if (entriesSnapshot(current, keys) !== expected) {
            throw new AnnotationsChangedError();
          }
          for (const image of changed) {
            if (
              image.inherited !== null &&
              !sameAnnotation(
                normalizeImageAnnotation(
                  deps.centralAnnotation(file.path, image.source)
                ),
                image.inherited
              )
            ) {
              throw new AnnotationsChangedError();
            }
          }
        }
      );
      return entriesSnapshot(written, keys);
    } catch (error) {
      if (error instanceof ActionExecutionError) throw error;
      if (error instanceof AnnotationsChangedError) {
        throw new ActionExecutionError('conflict', false);
      }
      throw new ActionExecutionError('write_failed', true);
    }
  };

  const displayChanges = (changed: readonly PlannedImage[]): string[] =>
    changed.length === 0
      ? []
      : [tPlural('actions.images.annotate', changed.length)];

  const trade: ActionDefinition<'trade.set_image_annotations'> = {
    async plan(input, context) {
      const { signal } = context;
      throwIfAborted(signal);
      const owner = await deps.tradeMedia(input.trade_id, signal);
      throwIfAborted(signal);
      if (!owner) throw new ActionPlanError('not_found', 'trade_id');
      
      
      
      const revision = await deps.tradeRevision(owner.file.path);
      const { changed, stored } = await planImages(
        owner,
        input.images,
        context
      );
      const keys = changed.map((image) => image.key);
      return {
        target: `trade:${input.trade_id}:image_annotations`,
        writes: [`note:${owner.file.path}`],
        summary: {
          trade_id: input.trade_id,
          base_revision: revision.tradeRevision,
          effective: changed.length > 0,
          images: changed.map((image) => image.change),
        },
        affectedNotes: changed.length > 0 ? 1 : 0,
        display: {
          target: owner.file.basename,
          changes: displayChanges(changed),
        },
        ...(context.origin === 'ui'
          ? { baseEntry: entriesSnapshot(stored, keys) }
          : {}),
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          const path = owner.file.path;
          
          
          const entrySnapshot = await deps.runSerializedTradeWrite(
            path,
            async () => {
              const current = await deps.tradeRevision(path);
              if (
                current.tradeRevision !== revision.tradeRevision ||
                current.contentRevision !== revision.contentRevision
              ) {
                throw new ActionExecutionError('conflict', false);
              }
              return changed.length === 0
                ? null
                : writeImages(owner.file, changed, stored);
            }
          );
          const result = {
            trade_id: input.trade_id,
            trade_revision: revision.tradeRevision,
            media_ids: changed.map((image) => image.mediaId),
          };
          const images = restoringImages(changed);
          if (entrySnapshot === null) {
            return new ActionExecution(result, { restoreInput: 'unchanged' });
          }
          if (context.origin !== 'agent' || images === null) {
            return new ActionExecution(result, { restoreInput: null });
          }
          return new ActionExecution(result, {
            restoreInput: { trade_id: input.trade_id, images },
            entrySnapshot,
          });
        },
      };
    },
  };

  const review: ActionDefinition<'review.set_image_annotations'> = {
    async plan(input, context) {
      const { signal } = context;
      throwIfAborted(signal);
      const owner = await deps.reviewMedia(input.review, signal);
      throwIfAborted(signal);
      if (!owner) throw new ActionPlanError('not_found', 'review');
      const { changed, stored } = await planImages(
        owner,
        input.images,
        context
      );
      const keys = changed.map((image) => image.key);
      return {
        target: `review:${input.review.period}:${input.review.period_start}:image_annotations`,
        writes: [`note:${owner.file.path}`],
        summary: {
          review: structuredClone(input.review),
          effective: changed.length > 0,
          images: changed.map((image) => image.change),
        },
        affectedNotes: changed.length > 0 ? 1 : 0,
        display: {
          target: t(`actions.review.target.${input.review.period}`, {
            date: input.review.period_start,
          }),
          changes: displayChanges(changed),
        },
        ...(context.origin === 'ui'
          ? { baseEntry: entriesSnapshot(stored, keys) }
          : {}),
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          const result = {
            review: structuredClone(input.review),
            media_ids: changed.map((image) => image.mediaId),
          };
          if (changed.length === 0) {
            return new ActionExecution(result, { restoreInput: 'unchanged' });
          }
          const entrySnapshot = await writeImages(owner.file, changed, stored);
          const images = restoringImages(changed);
          if (context.origin !== 'agent' || images === null) {
            return new ActionExecution(result, { restoreInput: null });
          }
          return new ActionExecution(result, {
            restoreInput: { review: structuredClone(input.review), images },
            entrySnapshot,
          });
        },
      };
    },
  };

  return {
    'trade.set_image_annotations': trade,
    'review.set_image_annotations': review,
  };
}
