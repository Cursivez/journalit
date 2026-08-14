import { normalizePath } from 'obsidian';
import { sanitizeTradeSymbolForFilename } from './TradePathPolicy';

interface ManagedTradeMediaParams {
  mediaPath: string;
  tradeFilePath?: string;
  instrument?: string;
}

interface ManagedMediaOwner {
  fileNamePrefix: string;
}

interface TradeMediaOwner extends ManagedMediaOwner {
  directory: string;
}

export function isExternalMediaTarget(mediaPath: string): boolean {
  const target = mediaPath.trim();
  return /^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('//');
}

export function splitTradeMediaTargetSuffix(mediaTarget: string): {
  path: string;
  suffix: string;
} {
  let suffixIndex = -1;
  for (let index = 0; index < mediaTarget.length; index++) {
    if (mediaTarget[index] !== '?' && mediaTarget[index] !== '#') continue;
    let backslashCount = 0;
    for (
      let backslashIndex = index - 1;
      backslashIndex >= 0 && mediaTarget[backslashIndex] === '\\';
      backslashIndex--
    ) {
      backslashCount++;
    }
    if (backslashCount % 2 === 0) {
      suffixIndex = index;
      break;
    }
  }
  return suffixIndex === -1
    ? { path: mediaTarget, suffix: '' }
    : {
        path: mediaTarget.slice(0, suffixIndex),
        suffix: mediaTarget.slice(suffixIndex),
      };
}

export function getTradeMediaOwner(
  tradeFilePath?: string,
  instrument?: string
): TradeMediaOwner | null {
  if (!tradeFilePath || !instrument) {
    return null;
  }

  const normalizedTradePath = normalizePath(tradeFilePath);
  const tradePathParts = normalizedTradePath.split('/').filter(Boolean);
  const tradeFileName = tradePathParts.pop() ?? '';
  const tradeNumberMatch = tradeFileName.match(/-([TMB]\d+)\.md$/i);
  if (!tradeNumberMatch) {
    return null;
  }

  tradePathParts.pop();
  const tradeFileStem = tradeFileName.replace(/\.md$/i, '');
  return {
    directory: normalizePath(
      [...tradePathParts, 'media', tradeFileStem].join('/')
    ),
    fileNamePrefix: `${sanitizeTradeSymbolForFilename(instrument)}-${tradeNumberMatch[1]}-`,
  };
}

function isMediaOwnedBy(owner: TradeMediaOwner, mediaPath: string): boolean {
  const normalizedPath = normalizePath(mediaPath);
  const mediaDirectory = normalizedPath.slice(
    0,
    normalizedPath.lastIndexOf('/')
  );
  const mediaFileName = normalizedPath.split('/').pop() ?? '';
  return (
    mediaDirectory === owner.directory &&
    mediaFileName.startsWith(owner.fileNamePrefix)
  );
}

function normalizeVaultPathSegments(path: string): string {
  const segments: string[] = [];
  for (const segment of normalizePath(path).split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..') {
      segments.pop();
      continue;
    }
    segments.push(segment);
  }
  return segments.join('/');
}

interface ManagedTradeMediaReferenceParams {
  mediaTarget: string;
  tradeFilePath?: string;
  instrument?: string;
  pathExists?: (path: string) => boolean;
}


export function resolveManagedTradeMediaReferencePath({
  mediaTarget,
  tradeFilePath,
  instrument,
  pathExists,
}: ManagedTradeMediaReferenceParams): string | null {
  if (isExternalMediaTarget(mediaTarget)) return null;
  const owner = getTradeMediaOwner(tradeFilePath, instrument);
  if (!owner || !tradeFilePath) return null;

  const { path: mediaPath } = splitTradeMediaTargetSuffix(mediaTarget);
  const normalizedTarget = normalizeVaultPathSegments(mediaPath);
  if (isMediaOwnedBy(owner, normalizedTarget)) {
    return normalizedTarget;
  }

  const sourceDirectory = normalizePath(tradeFilePath).slice(
    0,
    normalizePath(tradeFilePath).lastIndexOf('/')
  );
  const sourceRelativePath = normalizeVaultPathSegments(
    `${sourceDirectory}/${mediaPath}`
  );
  if (isMediaOwnedBy(owner, sourceRelativePath)) {
    return sourceRelativePath;
  }

  if (!normalizedTarget.includes('/')) {
    const ownerRelativePath = normalizePath(
      `${owner.directory}/${normalizedTarget}`
    );
    if (
      isMediaOwnedBy(owner, ownerRelativePath) &&
      pathExists?.(ownerRelativePath) === true
    ) {
      return ownerRelativePath;
    }
  }

  return null;
}

function getManagedMediaOwner({
  mediaPath,
  tradeFilePath,
  instrument,
}: ManagedTradeMediaParams): ManagedMediaOwner | null {
  if (isExternalMediaTarget(mediaPath)) {
    return null;
  }

  const currentOwner = getTradeMediaOwner(tradeFilePath, instrument);
  const physicalMediaPath = splitTradeMediaTargetSuffix(mediaPath).path;
  if (currentOwner && isMediaOwnedBy(currentOwner, physicalMediaPath)) {
    return currentOwner;
  }
  return null;
}


export function isManagedTradeMediaPath({
  mediaPath,
  tradeFilePath,
  instrument,
}: ManagedTradeMediaParams): boolean {
  return Boolean(
    getManagedMediaOwner({
      mediaPath,
      tradeFilePath,
      instrument,
    })
  );
}

interface RelocatedManagedTradeMediaParams extends ManagedTradeMediaParams {
  destinationTradeFilePath: string;
  destinationInstrument: string;
}


export function getRelocatedManagedTradeMediaPath({
  mediaPath,
  tradeFilePath,
  instrument,
  destinationTradeFilePath,
  destinationInstrument,
}: RelocatedManagedTradeMediaParams): string | null {
  const sourceOwner = getManagedMediaOwner({
    mediaPath,
    tradeFilePath,
    instrument,
  });
  const destinationOwner = getTradeMediaOwner(
    destinationTradeFilePath,
    destinationInstrument
  );
  if (!sourceOwner || !destinationOwner) {
    return null;
  }

  const physicalMediaPath = splitTradeMediaTargetSuffix(mediaPath).path;
  const mediaFileName = normalizePath(physicalMediaPath).split('/').pop() ?? '';
  const suffix = mediaFileName.slice(sourceOwner.fileNamePrefix.length);
  return normalizePath(
    `${destinationOwner.directory}/${destinationOwner.fileNamePrefix}${suffix}`
  );
}
