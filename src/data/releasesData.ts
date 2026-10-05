import { releasesDataPack } from './compressedData.generated';
import { decodeCompressedJson } from '../utils/compressedData';

interface ReleaseEntry {
  title: string;
  description: string;
  imageUrl?: string;
  content?: string;
}

export type ReleaseMetadata = Record<string, ReleaseEntry>;

let releasesDataCache: ReleaseMetadata | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isReleaseEntry(value: unknown): value is ReleaseEntry {
  if (!isRecord(value)) {
    return false;
  }

  if (
    typeof value.title !== 'string' ||
    !value.title.trim() ||
    typeof value.description !== 'string' ||
    !value.description.trim()
  ) {
    return false;
  }

  if (
    'imageUrl' in value &&
    (typeof value.imageUrl !== 'string' || !value.imageUrl.trim())
  ) {
    return false;
  }

  if ('content' in value && typeof value.content !== 'string') {
    return false;
  }

  return true;
}

function isReleaseMetadata(value: unknown): value is ReleaseMetadata {
  if (!isRecord(value)) {
    return false;
  }

  for (const entry of Object.values(value)) {
    if (!isReleaseEntry(entry)) {
      return false;
    }
  }

  return true;
}

export function parseReleaseMetadata(value: unknown): ReleaseMetadata {
  if (!isReleaseMetadata(value)) {
    throw new Error('Invalid generated release data payload');
  }
  return value;
}

export function getReleasesData(): ReleaseMetadata {
  if (releasesDataCache) {
    return releasesDataCache;
  }

  releasesDataCache = parseReleaseMetadata(
    decodeCompressedJson(releasesDataPack)
  );
  return releasesDataCache;
}
