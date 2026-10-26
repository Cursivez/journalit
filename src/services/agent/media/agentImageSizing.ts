


const AGENT_IMAGE_MAX_EDGE = 2000;

export const AGENT_IMAGE_MAX_BASE64_CHARS = 1_500_000;

const AGENT_IMAGE_JPEG_QUALITY = 0.8;

const AGENT_IMAGE_JPEG_RETRY_QUALITIES = [0.85, 0.7, 0.55, 0.4];

const AGENT_IMAGE_SHRINK_FACTOR = 0.75;

export type AgentImageOutputType = 'image/png' | 'image/jpeg';
export type AgentImagePassthroughType = AgentImageOutputType | 'image/webp';

const PASSTHROUGH_TYPES: ReadonlySet<string> =
  new Set<AgentImagePassthroughType>(['image/png', 'image/jpeg', 'image/webp']);


function base64Length(byteLength: number): number {
  return Math.ceil(byteLength / 3) * 4;
}


export function canPassThrough(input: {
  mediaType: string;
  width: number;
  height: number;
  byteLength: number;
  maxBase64Chars: number;
}): boolean {
  return (
    PASSTHROUGH_TYPES.has(input.mediaType) &&
    input.width <= AGENT_IMAGE_MAX_EDGE &&
    input.height <= AGENT_IMAGE_MAX_EDGE &&
    base64Length(input.byteLength) <= input.maxBase64Chars
  );
}


function fitWithin(
  width: number,
  height: number,
  maxEdge: number = AGENT_IMAGE_MAX_EDGE
): { width: number; height: number } {
  const scale = Math.min(1, maxEdge / width, maxEdge / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export interface EncodedImage {
  readonly mediaType: AgentImageOutputType;
  readonly width: number;
  readonly height: number;
  readonly bytes: ArrayBuffer;
}


export type AgentImageEncoder = (
  width: number,
  height: number,
  mediaType: AgentImageOutputType,
  quality?: number
) => Promise<EncodedImage>;

function fits(image: EncodedImage, maxBase64Chars: number): boolean {
  return base64Length(image.bytes.byteLength) <= maxBase64Chars;
}


export async function resizeForAgent(input: {
  sourceWidth: number;
  sourceHeight: number;
  maxBase64Chars: number;
  encode: AgentImageEncoder;
  signal?: AbortSignal;
}): Promise<EncodedImage | null> {
  const { maxBase64Chars, encode, signal } = input;
  let { width, height } = fitWithin(input.sourceWidth, input.sourceHeight);
  for (;;) {
    if (signal?.aborted) throw signal.reason;
    const candidates = [
      await encode(width, height, 'image/png'),
      await encode(width, height, 'image/jpeg', AGENT_IMAGE_JPEG_QUALITY),
    ]
      .filter((candidate) => fits(candidate, maxBase64Chars))
      .sort((left, right) => left.bytes.byteLength - right.bytes.byteLength);
    if (candidates.length > 0) return candidates[0];
    for (const quality of AGENT_IMAGE_JPEG_RETRY_QUALITIES) {
      if (signal?.aborted) throw signal.reason;
      const retry = await encode(width, height, 'image/jpeg', quality);
      if (fits(retry, maxBase64Chars)) return retry;
    }
    if (width === 1 && height === 1) return null;
    width = Math.max(1, Math.floor(width * AGENT_IMAGE_SHRINK_FACTOR));
    height = Math.max(1, Math.floor(height * AGENT_IMAGE_SHRINK_FACTOR));
  }
}
