import { releasesDataPack } from './compressedData.generated';
import { decodeCompressedJson } from '../utils/compressedData';

interface ReleaseEntry {
  title: string;
  description: string;
  imageUrl?: string;
  features: string[];
  content?: string;
}

export type ReleaseMetadata = Record<string, ReleaseEntry>;

let releasesDataCache: ReleaseMetadata | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  if (!Array.isArray(value)) {
    return false;
  }

  for (const item of value) {
    if (typeof item !== 'string') {
      return false;
    }
  }

  return true;
}

function isReleaseEntry(value: unknown): value is ReleaseEntry {
  if (!isRecord(value)) {
    return false;
  }

  if (
    typeof value.title !== 'string' ||
    typeof value.description !== 'string' ||
    !isStringArray(value.features)
  ) {
    return false;
  }

  if ('imageUrl' in value && typeof value.imageUrl !== 'string') {
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

export function getReleasesData(): ReleaseMetadata {
  if (releasesDataCache) {
    return releasesDataCache;
  }

  const parsed = decodeCompressedJson(releasesDataPack);
  if (!isReleaseMetadata(parsed)) {
    throw new Error('Invalid generated release data payload');
  }

  releasesDataCache = parsed;
  return releasesDataCache;
}
