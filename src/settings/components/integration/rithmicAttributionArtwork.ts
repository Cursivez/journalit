

import {
  poweredByOmneArtworkPack,
  tradingPlatformByRithmicArtworkPack,
} from '../../../data/compressedData.generated';
import { decodeCompressedBytes } from '../../../utils/compressedData';

function toPngDataUri(packed: string): string {
  const bytes = decodeCompressedBytes(packed);
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(offset, offset + chunkSize)
    );
  }
  return `data:image/png;base64,${btoa(binary)}`;
}

let tradingPlatformMark: string | null = null;
let omneMark: string | null = null;


export function getTradingPlatformByRithmicMark(): string {
  tradingPlatformMark ??= toPngDataUri(tradingPlatformByRithmicArtworkPack);
  return tradingPlatformMark;
}


export function getPoweredByOmneMark(): string {
  omneMark ??= toPngDataUri(poweredByOmneArtworkPack);
  return omneMark;
}
