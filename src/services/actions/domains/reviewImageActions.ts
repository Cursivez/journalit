import { normalizePath, TFile, type App } from 'obsidian';
import { tPlural, t } from '../../../lang/helpers';
import {
  findImagesWidgets,
  isReviewWidgetUpload,
  normalizeReviewImagesByWidget,
  reviewImageFilename,
  reviewMediaFolder,
  widgetImages,
  type ImagesWidgetBlock,
  type ReviewImageNoteType,
} from '../../reviews/reviewImages';
import type { ReviewFrontmatterGuard } from '../../reviews/ReviewWriteTypes';
import { agentMediaId } from '../../agent/media/agentMediaIdentity';
import {
  listAgentOwnerMedia,
  resolveAgentMedia,
} from '../../agent/media/agentOwnerMedia';
import type { AgentReviewPeriod } from '../../agent/reviews/AgentReviewRevision';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import type {
  ActionDefinition,
  ActionDefinitions,
  ActionInput,
  ActionPlanContext,
} from '../ActionTypes';
import { throwIfAborted } from './tradeActionSupport';
import { MAX_WIDGET_IMAGES } from '../../agent/handlers/getReview';

type ReviewImageActionId = 'review.add_images' | 'review.remove_images';
type ReviewIdentity = ActionInput<'review.add_images'>['review'];


const IMAGE_EXTENSION = /\.(?:png|jpe?g|gif|webp)$/i;

interface ReviewImageActionDependencies {
  app: Pick<App, 'vault' | 'fileManager'>;
  
  resolveReview(
    review: ReviewIdentity,
    signal: AbortSignal
  ): Promise<TFile | null>;
  readFrontmatter(file: TFile): Promise<Record<string, unknown>>;
  
  ensureImageWidgetIds(filePath: string): Promise<boolean>;
  updateFrontmatterGuarded(
    period: AgentReviewPeriod,
    filePath: string,
    updates: Record<string, unknown>,
    guard: ReviewFrontmatterGuard
  ): Promise<void>;
  
  tradeMedia(
    tradeId: string,
    signal: AbortSignal
  ): Promise<{ file: TFile; sources: readonly string[] } | null>;
  resolveMediaFile(source: string, sourcePath: string): TFile | null;
  now?: () => number;
}


class ImagesChangedError extends Error {}

function displayTarget(review: ReviewIdentity): string {
  return t(`actions.review.target.${review.period}`, {
    date: review.period_start,
  });
}

function noteType(
  frontmatter: Record<string, unknown>
): ReviewImageNoteType | null {
  switch (frontmatter.type) {
    case 'drc':
    case 'weekly-review':
    case 'monthly-review':
    case 'quarterly-review':
    case 'yearly-review':
      return frontmatter.type;
    default:
      return null;
  }
}


function resolveWidget(
  blocks: readonly ImagesWidgetBlock[],
  key: string
): ImagesWidgetBlock | undefined {
  return (
    blocks.find((block) => block.id === key) ??
    blocks.find((block) => block.id === undefined && block.key === key)
  );
}


export function createReviewImageActions(
  deps: ReviewImageActionDependencies
): Pick<ActionDefinitions, ReviewImageActionId> {
  const now = deps.now ?? (() => Date.now());

  const requireReview = async (
    review: ReviewIdentity,
    signal: AbortSignal
  ): Promise<TFile> => {
    const file = await deps.resolveReview(review, signal);
    throwIfAborted(signal);
    if (!file) throw new ActionPlanError('not_found', 'review');
    return file;
  };

  
  const readWidget = async (
    file: TFile,
    key: string
  ): Promise<{
    block: ImagesWidgetBlock;
    images: string[];
    frontmatter: Record<string, unknown>;
  } | null> => {
    const blocks = findImagesWidgets(await deps.app.vault.read(file));
    const block = resolveWidget(blocks, key);
    if (!block) return null;
    const frontmatter = await deps.readFrontmatter(file);
    return { block, images: widgetImages(frontmatter, block), frontmatter };
  };

  
  const identifiedWidget = async (
    file: TFile,
    planned: ImagesWidgetBlock
  ): Promise<ImagesWidgetBlock & { id: string }> => {
    if (planned.id !== undefined) return { ...planned, id: planned.id };
    await deps.ensureImageWidgetIds(file.path);
    const block = findImagesWidgets(await deps.app.vault.read(file)).find(
      (candidate) => candidate.position === planned.position
    );
    if (!block?.id) throw new ActionExecutionError('conflict', false);
    return { ...block, id: block.id };
  };

  
  const writeImages = async (
    period: AgentReviewPeriod,
    file: TFile,
    block: ImagesWidgetBlock & { id: string },
    planned: ImagesWidgetBlock,
    expected: readonly string[],
    images: readonly string[]
  ): Promise<void> => {
    const frontmatter = await deps.readFrontmatter(file);
    const updates: Record<string, unknown> = {
      imagesByWidget: {
        ...normalizeReviewImagesByWidget(frontmatter.imagesByWidget),
        [block.id]: [...images],
      },
    };
    
    
    const ownedLegacy =
      block.position === 1 &&
      normalizeReviewImagesByWidget(frontmatter.imagesByWidget)[block.id] ===
        undefined;
    if (ownedLegacy) updates.images = undefined;
    const guard: ReviewFrontmatterGuard = (current) => {
      const now = widgetImages(current, { ...planned, id: block.id });
      if (JSON.stringify(now) !== JSON.stringify(expected)) {
        throw new ImagesChangedError();
      }
    };
    try {
      await deps.updateFrontmatterGuarded(period, file.path, updates, guard);
    } catch (error) {
      if (error instanceof ImagesChangedError) {
        throw new ActionExecutionError('conflict', false);
      }
      throw new ActionExecutionError('write_failed', true);
    }
  };

  const add: ActionDefinition<'review.add_images'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal, installationId } = context;
      throwIfAborted(signal);
      if (installationId === undefined) {
        throw new ActionPlanError('unsupported_capability', 'sources');
      }
      const file = await requireReview(input.review, signal);
      const widget = await readWidget(file, input.widget);
      if (!widget) throw new ActionPlanError('not_found', 'widget');
      
      
      if (widget.images.length + input.sources.length > MAX_WIDGET_IMAGES) {
        throw new ActionPlanError('limit_exceeded', 'sources');
      }
      
      const sources = await Promise.all(
        input.sources.map(async (source): Promise<TFile> => {
          const media = await deps.tradeMedia(source.trade_id, signal);
          if (!media) throw new ActionPlanError('not_found', 'sources');
          const match = (
            await listAgentOwnerMedia({
              owner: media,
              installationId,
              resolveMediaFile: (path, sourcePath) =>
                deps.resolveMediaFile(path, sourcePath),
            })
          ).find((candidate) => candidate.mediaId === source.media_id);
          if (!match) throw new ActionPlanError('not_found', 'sources');
          return match.file;
        })
      );
      throwIfAborted(signal);
      const type = noteType(widget.frontmatter);
      const date =
        typeof widget.frontmatter.date === 'string'
          ? widget.frontmatter.date
          : undefined;
      return {
        target: `review:${input.review.period}:${input.review.period_start}:images:${input.widget}`,
        summary: {
          review: structuredClone(input.review),
          widget: input.widget,
          image_count: sources.length,
        },
        affectedNotes: 1,
        display: {
          target: displayTarget(input.review),
          changes: [tPlural('actions.review.images.add', sources.length)],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          const block = await identifiedWidget(file, widget.block);
          const folder = reviewMediaFolder(file.path);
          const copies: string[] = [];
          
          
          try {
            await deps.app.vault.adapter.mkdir(normalizePath(folder));
            const stamp = now();
            for (const [index, source] of sources.entries()) {
              const path = normalizePath(
                `${folder}/${reviewImageFilename(type, date, `.${source.extension}`, stamp + index)}`
              );
              await deps.app.vault.createBinary(
                path,
                await deps.app.vault.readBinary(source)
              );
              copies.push(path);
            }
            await writeImages(
              input.review.period,
              file,
              block,
              widget.block,
              widget.images,
              [...widget.images, ...copies]
            );
          } catch (error) {
            
            for (const path of copies) {
              const copy = deps.app.vault.getAbstractFileByPath(path);
              if (copy instanceof TFile) {
                await deps.app.fileManager
                  .trashFile(copy)
                  .catch((cleanupError: unknown) =>
                    console.warn(
                      '[Journalit] Could not remove an unused review image copy:',
                      cleanupError
                    )
                  );
              }
            }
            if (error instanceof ActionExecutionError) throw error;
            throw new ActionExecutionError('write_failed', true);
          }
          return {
            review: structuredClone(input.review),
            widget: block.id,
            media_ids: await Promise.all(
              copies.map((path) => agentMediaId(installationId, path))
            ),
          };
        },
      };
    },
  };

  const remove: ActionDefinition<'review.remove_images'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal, installationId } = context;
      throwIfAborted(signal);
      if (installationId === undefined) {
        throw new ActionPlanError('unsupported_capability', 'media_ids');
      }
      const file = await requireReview(input.review, signal);
      const widget = await readWidget(file, input.widget);
      if (!widget) throw new ActionPlanError('not_found', 'widget');
      
      const resolvedEntries = widget.images.flatMap((entry) => {
        const resolved = resolveAgentMedia(entry, file.path, (path, source) =>
          deps.resolveMediaFile(path, source)
        );
        return resolved ? [{ entry, file: resolved.file }] : [];
      });
      const entryIds = await Promise.all(
        resolvedEntries.map(({ file: resolved }) =>
          agentMediaId(installationId, resolved.path)
        )
      );
      const entryById = new Map(
        resolvedEntries.map((resolved, index) => [entryIds[index], resolved])
      );
      const removed = input.media_ids.map((mediaId) => {
        const found = entryById.get(mediaId);
        if (!found) throw new ActionPlanError('not_found', 'media_ids');
        return found;
      });
      const removedEntries = new Set(removed.map(({ entry }) => entry));
      return {
        target: `review:${input.review.period}:${input.review.period_start}:images:${input.widget}`,
        summary: {
          review: structuredClone(input.review),
          widget: input.widget,
          image_count: removed.length,
        },
        affectedNotes: 1,
        display: {
          target: displayTarget(input.review),
          changes: [tPlural('actions.review.images.remove', removed.length)],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          const block = await identifiedWidget(file, widget.block);
          await writeImages(
            input.review.period,
            file,
            block,
            widget.block,
            widget.images,
            widget.images.filter((entry) => !removedEntries.has(entry))
          );
          
          
          for (const { file: image } of removed) {
            if (isReviewWidgetUpload(image.path, file.path, IMAGE_EXTENSION)) {
              
              
              await deps.app.fileManager
                .trashFile(image)
                .catch((trashError: unknown) =>
                  console.warn(
                    '[Journalit] Could not move a removed review image to the trash:',
                    trashError
                  )
                );
            }
          }
          return {
            review: structuredClone(input.review),
            widget: block.id,
          };
        },
      };
    },
  };

  return { 'review.add_images': add, 'review.remove_images': remove };
}
