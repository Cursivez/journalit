import { arrayBufferToBase64, type TFile } from 'obsidian';
import type { AgentToolHandler } from '../AgentToolRegistry';
import {
  agentContractManifest,
  parseAgentToolRequest,
  parseAgentToolResult,
} from '../protocol/AgentContractRegistry';
import type { ViewImageRequest } from '../protocol/generated/view_image.request.generated';
import type { ViewImageResult } from '../protocol/generated/view_image.result.generated';
import { AgentReviewReadError } from '../reviews/AgentReviewReadService';
import { AgentTradeReadError } from '../trades/AgentTradeReadService';
import {
  listAgentOwnerMedia,
  type AgentMediaOwner,
} from '../media/agentOwnerMedia';
import {
  AGENT_IMAGE_MAX_BASE64_CHARS,
  canPassThrough,
  resizeForAgent,
  type AgentImagePassthroughType,
} from '../media/agentImageSizing';
import {
  AgentImageDecodeError,
  createCanvasEncoder,
  decodeAgentImage,
  type DecodedAgentImage,
  type DisposableAgentImageEncoder,
} from '../media/agentImageCanvas';
import { readAgentImageHeader } from '../media/agentImageHeader';

type ReviewIdentity = Extract<ViewImageRequest, { review: unknown }>['review'];

interface ViewImageDependencies {
  
  tradeMedia(
    tradeId: string,
    signal: AbortSignal
  ): Promise<AgentMediaOwner | null>;
  
  reviewMedia(
    review: ReviewIdentity,
    signal: AbortSignal
  ): Promise<AgentMediaOwner | null>;
  resolveMediaFile(source: string, sourcePath: string): TFile | null;
  readBinary(file: TFile): Promise<ArrayBuffer>;
  decodeImage?: (
    bytes: ArrayBuffer,
    mediaType: string
  ) => Promise<DecodedAgentImage>;
  createEncoder?: (image: DecodedAgentImage) => DisposableAgentImageEncoder;
}


const RESULT_OVERHEAD_BYTES = 1_024;

const MAX_SOURCE_PIXELS = 100_000_000;

const MAX_SOURCE_EDGE = 32_767;

const INVALID_REQUEST: ViewImageResult = {
  status: 'error',
  code: 'invalid_request',
  message: 'Image request is invalid.',
  retryable: false,
};
const NOT_FOUND: ViewImageResult = {
  status: 'error',
  code: 'not_found',
  message: 'Image was not found on that trade or review.',
  retryable: false,
};
const LIMIT_EXCEEDED: ViewImageResult = {
  status: 'error',
  code: 'limit_exceeded',
  message: 'Image exceeds supported limits.',
  retryable: false,
};
const UNDECODABLE: ViewImageResult = {
  status: 'error',
  code: 'unsupported_capability',
  message: 'The image could not be decoded.',
  retryable: false,
};
const INTERNAL_ERROR: ViewImageResult = {
  status: 'error',
  code: 'internal_error',
  message: 'Image is temporarily unavailable.',
  retryable: true,
};

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

function validatedRequest(value: unknown): ViewImageRequest | undefined {
  try {
    return parseAgentToolRequest('view_image', value);
  } catch {
    return undefined;
  }
}

function errorResult(error: unknown): ViewImageResult {
  if (error instanceof AgentImageDecodeError) return UNDECODABLE;
  if (
    error instanceof AgentTradeReadError ||
    error instanceof AgentReviewReadError
  ) {
    return error.code === 'limit_exceeded' ? LIMIT_EXCEEDED : INVALID_REQUEST;
  }
  return INTERNAL_ERROR;
}


export function createViewImageHandler(
  dependencies: ViewImageDependencies
): AgentToolHandler<'view_image'> {
  const decodeImage = dependencies.decodeImage ?? decodeAgentImage;
  const createEncoder = dependencies.createEncoder ?? createCanvasEncoder;
  return async (untrustedRequest, context) => {
    const { signal } = context;
    try {
      throwIfAborted(signal);
      const request = validatedRequest(untrustedRequest);
      if (request === undefined) return { result: INVALID_REQUEST };
      const owner =
        'trade_id' in request
          ? await dependencies.tradeMedia(request.trade_id, signal)
          : await dependencies.reviewMedia(request.review, signal);
      throwIfAborted(signal);
      if (owner === null) return { result: NOT_FOUND };
      const media = (
        await listAgentOwnerMedia({
          owner,
          installationId: context.installationId,
          resolveMediaFile: (source, sourcePath) =>
            dependencies.resolveMediaFile(source, sourcePath),
        })
      ).find((candidate) => candidate.mediaId === request.media_id);
      throwIfAborted(signal);
      if (media === undefined) return { result: NOT_FOUND };

      const maxBase64Chars = Math.min(
        AGENT_IMAGE_MAX_BASE64_CHARS,
        (context.maxResultBytes ?? Number.POSITIVE_INFINITY) -
          RESULT_OVERHEAD_BYTES
      );
      if (maxBase64Chars <= 0) return { result: LIMIT_EXCEEDED };
      let bytes: ArrayBuffer | null = await dependencies.readBinary(media.file);
      throwIfAborted(signal);
      
      const header = readAgentImageHeader(bytes);
      if (header === null) return { result: UNDECODABLE };
      if (
        header.width > MAX_SOURCE_EDGE ||
        header.height > MAX_SOURCE_EDGE ||
        header.width * header.height > MAX_SOURCE_PIXELS
      ) {
        return { result: LIMIT_EXCEEDED };
      }
      let output: {
        mediaType: AgentImagePassthroughType;
        width: number;
        height: number;
        data: string;
      };
      if (
        
        header.mediaType !== 'image/gif' &&
        canPassThrough({
          mediaType: header.mediaType,
          width: header.width,
          height: header.height,
          byteLength: bytes.byteLength,
          maxBase64Chars,
        })
      ) {
        output = {
          mediaType: header.mediaType,
          width: header.width,
          height: header.height,
          data: arrayBufferToBase64(bytes),
        };
      } else {
        const image = await decodeImage(bytes, header.mediaType);
        
        bytes = null;
        const encoder = createEncoder(image);
        try {
          throwIfAborted(signal);
          const resized = await resizeForAgent({
            sourceWidth: image.width,
            sourceHeight: image.height,
            maxBase64Chars,
            encode: encoder.encode,
            signal,
          });
          if (resized === null) return { result: LIMIT_EXCEEDED };
          output = {
            mediaType: resized.mediaType,
            width: resized.width,
            height: resized.height,
            data: arrayBufferToBase64(resized.bytes),
          };
        } finally {
          encoder.dispose();
          image.close();
        }
      }
      throwIfAborted(signal);
      const result = parseAgentToolResult('view_image', {
        status: 'ok',
        meta: {
          contract_version: agentContractManifest.version,
          contract_digest: agentContractManifest.digest,
          cached: false,
          row_count: 1,
        },
        media_id: media.mediaId,
        media_type: output.mediaType,
        width: output.width,
        height: output.height,
        source_width: header.width,
        source_height: header.height,
        data: output.data,
      });
      return { result };
    } catch (error) {
      if (signal.aborted) throw signal.reason;
      return { result: errorResult(error) };
    }
  };
}
