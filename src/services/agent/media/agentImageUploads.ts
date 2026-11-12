import type { RequestUrlResponse } from 'obsidian';
import { ApiClient } from '../../backend/ApiClient';
import {
  authHeaders,
  requestTradeSyncWithAuthRetry,
} from '../../tradeSync/http';



const IMAGE_UPLOAD_PATH = '/api/v1/agent/image-uploads/';


const AGENT_IMAGE_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;

export type AgentImageUploadMediaType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/webp';

export interface AgentImageUpload {
  readonly uploadId: string;
  readonly mediaType: AgentImageUploadMediaType;
  readonly data: ArrayBuffer;
}


export class AgentImageUploadNotFoundError extends Error {
  constructor() {
    super('Image upload not found.');
    this.name = 'AgentImageUploadNotFoundError';
  }
}


class AgentImageUploadUnavailableError extends Error {
  constructor() {
    super('Image upload could not be downloaded.');
    this.name = 'AgentImageUploadUnavailableError';
  }
}

const EXTENSIONS: Record<AgentImageUploadMediaType, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

export function agentImageUploadExtension(
  mediaType: AgentImageUploadMediaType
): string {
  return EXTENSIONS[mediaType];
}


function detectAgentImageUploadType(
  data: ArrayBuffer
): AgentImageUploadMediaType | null {
  const bytes = new Uint8Array(data, 0, Math.min(data.byteLength, 12));
  const starts = (signature: readonly number[], offset = 0) =>
    bytes.length >= offset + signature.length &&
    signature.every((byte, index) => bytes[offset + index] === byte);
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'image/png';
  }
  if (starts([0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (starts([0x52, 0x49, 0x46, 0x46]) && starts([0x57, 0x45, 0x42, 0x50], 8)) {
    return 'image/webp';
  }
  return null;
}

function header(response: RequestUrlResponse, name: string): string {
  const key = Object.keys(response.headers).find(
    (candidate) => candidate.toLowerCase() === name
  );
  return key ? response.headers[key] : '';
}


export async function downloadAgentImageUpload(
  uploadId: string
): Promise<AgentImageUpload> {
  let response: RequestUrlResponse;
  try {
    ({ response } = await requestTradeSyncWithAuthRetry((token) => ({
      url: ApiClient.buildUrl(
        `${IMAGE_UPLOAD_PATH}${encodeURIComponent(uploadId)}`
      ),
      method: 'GET',
      headers: authHeaders(token),
      throw: false,
    })));
  } catch {
    throw new AgentImageUploadUnavailableError();
  }
  if (response.status === 404) throw new AgentImageUploadNotFoundError();
  if (response.status !== 200) throw new AgentImageUploadUnavailableError();
  const data = response.arrayBuffer;
  const mediaType = detectAgentImageUploadType(data);
  const declared = header(response, 'content-type').split(';')[0].trim();
  if (
    mediaType === null ||
    declared !== mediaType ||
    data.byteLength > AGENT_IMAGE_UPLOAD_MAX_BYTES
  ) {
    throw new AgentImageUploadUnavailableError();
  }
  return { uploadId, mediaType, data };
}
