import { normalizePath, TFile, type App } from 'obsidian';
import { tPlural } from '../../../lang/helpers';
import {
  agentImageUploadExtension,
  AgentImageUploadNotFoundError,
  type AgentImageUpload,
  type AgentImageUploadMediaType,
} from '../../agent/media/agentImageUploads';
import { agentMediaId, sha256Hex } from '../../agent/media/agentMediaIdentity';
import {
  listAgentOwnerMedia,
  type AgentMediaOwner,
} from '../../agent/media/agentOwnerMedia';
import type {
  AgentTradeIdentityRecord,
  AgentTradeIdentityService,
} from '../../agent/identity/AgentTradeIdentityService';
import { imageService } from '../../image/ImageService';
import { TradeRevisionConflictError } from '../../trade/core/TradeCommandService';
import {
  getTradeMediaOwner,
  isManagedTradeMediaPath,
} from '../../trade/core/TradeMediaOwnership';
import {
  TradeJournalPartialWriteError,
  type TradeData,
  type TradeService,
} from '../../trade/TradeService';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import type { ActionDefinition, ActionDefinitions } from '../ActionTypes';
import {
  normalizeExtractedTradeData,
  throwIfAborted,
} from './tradeActionSupport';

type TradeImageActionId = 'trade.add_images' | 'trade.remove_images';


const MAX_TRADE_IMAGES = 100;

interface TradeImageActionDependencies {
  app: Pick<App, 'fileManager' | 'vault'>;
  tradeIdentityService: Pick<
    AgentTradeIdentityService,
    'listTradeIdentitiesStrict'
  >;
  tradeService: Pick<
    TradeService,
    | 'getCurrentTradeMutationRevision'
    | 'extractTradeDataFromDisk'
    | 'updateTradeJournalEntry'
  >;
  
  tradeMedia(
    tradeId: string,
    signal: AbortSignal
  ): Promise<AgentMediaOwner | null>;
  resolveMediaFile(source: string, sourcePath: string): TFile | null;
  
  resolveImageUrl(url: string, sourcePath: string): string;
  
  downloadImageUpload(uploadId: string): Promise<AgentImageUpload>;
}


interface PlannedUpload {
  readonly uploadId: string;
  readonly mediaType: AgentImageUploadMediaType;
  readonly byteSize: number;
  readonly sha256: string;
}


type PlannedTradeImage =
  
  | { readonly kind: 'url'; readonly entry: string }
  
  | { readonly kind: 'copy'; readonly entry: string; readonly file: TFile }
  
  | { readonly kind: 'upload'; readonly upload: PlannedUpload };

async function uploadDigest(upload: AgentImageUpload): Promise<string> {
  return sha256Hex(new Uint8Array(upload.data));
}

function tradeInstrument(stored: StoredTrade): string | undefined {
  return typeof stored.data.instrument === 'string'
    ? stored.data.instrument
    : undefined;
}


interface StoredTrade {
  readonly record: AgentTradeIdentityRecord;
  readonly data: TradeData;
  readonly images: readonly string[];
  readonly revision: { tradeRevision: number; contentRevision: string };
}


export function createTradeImageActions(
  deps: TradeImageActionDependencies
): Pick<ActionDefinitions, TradeImageActionId> {
  const readTrade = async (
    tradeId: string,
    signal: AbortSignal
  ): Promise<StoredTrade> => {
    const record = (
      await deps.tradeIdentityService.listTradeIdentitiesStrict()
    ).find((candidate) => candidate.tradeId === tradeId);
    throwIfAborted(signal);
    if (!record) throw new ActionPlanError('not_found', 'trade_id');
    const revision = await deps.tradeService.getCurrentTradeMutationRevision(
      record.file.path
    );
    const data = normalizeExtractedTradeData(
      await deps.tradeService.extractTradeDataFromDisk(record.file)
    );
    throwIfAborted(signal);
    if (!data) throw new ActionPlanError('not_found', 'trade_id');
    return { record, data, images: data.images ?? [], revision };
  };

  
  const ownMedia = async (
    stored: StoredTrade,
    installationId: string
  ): Promise<Map<string, { source: string; file: TFile }>> =>
    new Map(
      (
        await listAgentOwnerMedia({
          owner: { file: stored.record.file, sources: stored.images },
          installationId,
          resolveMediaFile: (path, sourcePath) =>
            deps.resolveMediaFile(path, sourcePath),
        })
      ).map((media) => [
        media.mediaId,
        { source: media.source, file: media.file },
      ])
    );

  
  const writeImages = async (
    stored: StoredTrade,
    images: { add?: string[]; remove?: string[] }
  ): Promise<number> => {
    try {
      const revision = await deps.tradeService.updateTradeJournalEntry(
        stored.record.file.path,
        { images },
        stored.revision
      );
      return revision.tradeRevision;
    } catch (error) {
      if (error instanceof TradeJournalPartialWriteError) {
        throw new ActionExecutionError('outcome_unknown', false);
      }
      if (error instanceof TradeRevisionConflictError) {
        throw new ActionExecutionError('conflict', false);
      }
      throw new ActionExecutionError('write_failed', true);
    }
  };

  
  const saveIntoTrade = async (
    stored: StoredTrade,
    data: ArrayBuffer,
    fileName: string
  ): Promise<string> => {
    const owner = getTradeMediaOwner(
      stored.record.file.path,
      tradeInstrument(stored)
    );
    if (!owner) throw new Error('The trade has no media folder');
    return normalizePath(
      await imageService.saveImage(
        new File([data], fileName),
        owner.directory,
        owner.fileNamePrefix.slice(0, -1)
      )
    );
  };

  const saveImage = async (
    stored: StoredTrade,
    image: PlannedTradeImage
  ): Promise<string> => {
    switch (image.kind) {
      case 'url':
        return image.entry;
      case 'copy':
        return saveIntoTrade(
          stored,
          await deps.app.vault.readBinary(image.file),
          image.file.name
        );
      case 'upload': {
        const planned = image.upload;
        let upload: AgentImageUpload;
        try {
          upload = await deps.downloadImageUpload(planned.uploadId);
        } catch (error) {
          
          if (error instanceof AgentImageUploadNotFoundError) {
            throw new ActionExecutionError('not_found', false);
          }
          throw error;
        }
        if (
          upload.mediaType !== planned.mediaType ||
          upload.data.byteLength !== planned.byteSize ||
          (await uploadDigest(upload)) !== planned.sha256
        ) {
          throw new ActionExecutionError('conflict', false);
        }
        return saveIntoTrade(
          stored,
          upload.data,
          `image.${agentImageUploadExtension(upload.mediaType)}`
        );
      }
    }
  };

  const trashFiles = async (files: TFile[], purpose: string): Promise<void> => {
    await Promise.all(
      files.map((file) =>
        deps.app.fileManager
          .trashFile(file)
          .catch((error: unknown) =>
            console.warn(`[Journalit] Could not ${purpose}:`, error)
          )
      )
    );
  };

  const add: ActionDefinition<'trade.add_images'> = {
    async plan(input, context) {
      const { signal, installationId } = context;
      throwIfAborted(signal);
      if (installationId === undefined) {
        throw new ActionPlanError('unsupported_capability', 'sources');
      }
      const stored = await readTrade(input.trade_id, signal);
      const sourcePath = stored.record.file.path;
      
      
      
      const uploadIds = input.sources.flatMap((source) =>
        'upload_id' in source ? [source.upload_id] : []
      );
      if (new Set(uploadIds).size !== uploadIds.length) {
        throw new ActionPlanError('invalid_request', 'sources');
      }
      if (stored.images.length + input.sources.length > MAX_TRADE_IMAGES) {
        throw new ActionPlanError('limit_exceeded', 'sources');
      }
      if (
        input.sources.some((source) => !('url' in source)) &&
        !getTradeMediaOwner(sourcePath, tradeInstrument(stored))
      ) {
        throw new ActionPlanError('invalid_request', 'sources');
      }
      
      
      
      
      const added: PlannedTradeImage[] = [];
      for (const source of input.sources) {
        throwIfAborted(signal);
        if ('url' in source) {
          try {
            added.push({
              kind: 'url',
              entry: deps.resolveImageUrl(source.url, sourcePath),
            });
          } catch {
            throw new ActionPlanError('invalid_request', 'sources');
          }
          continue;
        }
        if ('upload_id' in source) {
          let upload: AgentImageUpload;
          try {
            upload = await deps.downloadImageUpload(source.upload_id);
          } catch (error) {
            if (error instanceof AgentImageUploadNotFoundError) {
              throw new ActionPlanError('not_found', 'sources');
            }
            throw error;
          }
          added.push({
            kind: 'upload',
            upload: {
              uploadId: upload.uploadId,
              mediaType: upload.mediaType,
              byteSize: upload.data.byteLength,
              sha256: await uploadDigest(upload),
            },
          });
          continue;
        }
        const owner = await deps.tradeMedia(source.trade_id, signal);
        if (!owner) throw new ActionPlanError('not_found', 'sources');
        const match = (
          await listAgentOwnerMedia({
            owner,
            installationId,
            resolveMediaFile: (path, ownerPath) =>
              deps.resolveMediaFile(path, ownerPath),
          })
        ).find((media) => media.mediaId === source.media_id);
        if (!match) throw new ActionPlanError('not_found', 'sources');
        added.push({ kind: 'copy', entry: match.file.path, file: match.file });
      }
      throwIfAborted(signal);
      
      
      
      const shown = new Set(stored.images);
      for (const media of (await ownMedia(stored, installationId)).values()) {
        shown.add(media.file.path);
      }
      const entries = added.flatMap((image) =>
        image.kind === 'upload' ? [] : [image.entry]
      );
      if (
        entries.some((entry) => shown.has(entry)) ||
        new Set(entries).size !== entries.length
      ) {
        throw new ActionPlanError('invalid_request', 'sources');
      }
      const uploads = added.flatMap((image) =>
        image.kind === 'upload'
          ? [
              {
                upload_id: image.upload.uploadId,
                media_type: image.upload.mediaType,
                byte_size: image.upload.byteSize,
              },
            ]
          : []
      );
      return {
        target: `trade:${stored.record.tradeId}:images`,
        writes: [`note:${sourcePath}`],
        summary: {
          trade_id: input.trade_id,
          base_revision: stored.revision.tradeRevision,
          image_count: added.length,
          ...(uploads.length > 0 ? { uploads } : {}),
        },
        affectedNotes: 1,
        display: {
          target: stored.record.file.basename,
          changes: [tPlural('actions.review.images.add', added.length)],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          
          const written: string[] = [];
          const copies: string[] = [];
          
          const discardCopies = () =>
            trashFiles(
              copies.flatMap((path) => {
                const copy = deps.app.vault.getAbstractFileByPath(path);
                return copy instanceof TFile ? [copy] : [];
              }),
              'remove an unused trade image copy'
            );
          for (const image of added) {
            let path: string;
            try {
              path = await saveImage(stored, image);
            } catch (error) {
              await discardCopies();
              if (error instanceof ActionExecutionError) throw error;
              throw new ActionExecutionError('write_failed', true);
            }
            written.push(path);
            if (image.kind !== 'url') copies.push(path);
          }
          let revision: number;
          try {
            revision = await writeImages(stored, { add: written });
          } catch (error) {
            if (
              !(error instanceof ActionExecutionError) ||
              error.code !== 'outcome_unknown'
            ) {
              await discardCopies();
            }
            throw error;
          }
          const urls = added.flatMap((image) =>
            image.kind === 'url' ? [image.entry] : []
          );
          return {
            trade_id: input.trade_id,
            trade_revision: revision,
            media_ids: await Promise.all(
              copies.map((path) => agentMediaId(installationId, path))
            ),
            ...(urls.length > 0 ? { urls } : {}),
          };
        },
      };
    },
  };

  const remove: ActionDefinition<'trade.remove_images'> = {
    async plan(input, context) {
      const { signal, installationId } = context;
      throwIfAborted(signal);
      if (installationId === undefined) {
        throw new ActionPlanError('unsupported_capability', 'media_ids');
      }
      const stored = await readTrade(input.trade_id, signal);
      const media = await ownMedia(stored, installationId);
      const removed = new Set<string>();
      const uploads: TFile[] = [];
      for (const mediaId of input.media_ids ?? []) {
        const found = media.get(mediaId);
        if (!found) throw new ActionPlanError('not_found', 'media_ids');
        removed.add(found.source);
        
        
        if (
          isManagedTradeMediaPath({
            mediaPath: found.file.path,
            tradeFilePath: stored.record.file.path,
            instrument: tradeInstrument(stored),
          })
        ) {
          uploads.push(found.file);
        }
      }
      const storedImages = new Set(stored.images);
      for (const url of input.urls ?? []) {
        if (!storedImages.has(url)) {
          throw new ActionPlanError('not_found', 'urls');
        }
        removed.add(url);
      }
      const count = (input.media_ids?.length ?? 0) + (input.urls?.length ?? 0);
      return {
        target: `trade:${stored.record.tradeId}:images`,
        writes: [`note:${stored.record.file.path}`],
        summary: {
          trade_id: input.trade_id,
          base_revision: stored.revision.tradeRevision,
          image_count: count,
        },
        affectedNotes: 1,
        display: {
          target: stored.record.file.basename,
          changes: [tPlural('actions.review.images.remove', count)],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          const revision = await writeImages(stored, { remove: [...removed] });
          
          
          await trashFiles(uploads, 'move a removed trade image to the trash');
          return { trade_id: input.trade_id, trade_revision: revision };
        },
      };
    },
  };

  return { 'trade.add_images': add, 'trade.remove_images': remove };
}
