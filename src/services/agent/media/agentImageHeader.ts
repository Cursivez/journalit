import type { AgentMediaType } from './agentMediaIdentity';


export interface AgentImageHeader {
  readonly mediaType: AgentMediaType;
  readonly width: number;
  readonly height: number;
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function startsWith(bytes: Uint8Array, prefix: readonly number[]): boolean {
  return (
    bytes.length >= prefix.length &&
    prefix.every((byte, index) => bytes[index] === byte)
  );
}

function ascii(bytes: Uint8Array, offset: number, text: string): boolean {
  if (offset + text.length > bytes.length) return false;
  for (let index = 0; index < text.length; index += 1) {
    if (bytes[offset + index] !== text.charCodeAt(index)) return false;
  }
  return true;
}

function sized(
  mediaType: AgentMediaType,
  width: number,
  height: number
): AgentImageHeader | null {
  return width > 0 && height > 0 ? { mediaType, width, height } : null;
}

function png(view: DataView, bytes: Uint8Array): AgentImageHeader | null {
  
  if (bytes.length < 24 || !ascii(bytes, 12, 'IHDR')) return null;
  return sized('image/png', view.getUint32(16), view.getUint32(20));
}

function gif(view: DataView, bytes: Uint8Array): AgentImageHeader | null {
  if (bytes.length < 10) return null;
  return sized('image/gif', view.getUint16(6, true), view.getUint16(8, true));
}


function isStartOfFrame(marker: number): boolean {
  return (
    marker >= 0xc0 &&
    marker <= 0xcf &&
    marker !== 0xc4 &&
    marker !== 0xc8 &&
    marker !== 0xcc
  );
}


function isStandalone(marker: number): boolean {
  return marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7);
}

function jpeg(view: DataView, bytes: Uint8Array): AgentImageHeader | null {
  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) return null;
    const marker = bytes[offset];
    offset += 1;
    if (isStandalone(marker)) continue;
    
    if (marker === 0xd9 || marker === 0xda) return null;
    if (offset + 2 > bytes.length) return null;
    const length = view.getUint16(offset);
    if (length < 2) return null;
    if (isStartOfFrame(marker)) {
      if (offset + 7 > bytes.length) return null;
      
      return sized(
        'image/jpeg',
        view.getUint16(offset + 5),
        view.getUint16(offset + 3)
      );
    }
    offset += length;
  }
  return null;
}

function webp(view: DataView, bytes: Uint8Array): AgentImageHeader | null {
  if (bytes.length < 30) return null;
  if (ascii(bytes, 12, 'VP8 ')) {
    
    if (bytes[23] !== 0x9d || bytes[24] !== 0x01 || bytes[25] !== 0x2a) {
      return null;
    }
    return sized(
      'image/webp',
      view.getUint16(26, true) & 0x3fff,
      view.getUint16(28, true) & 0x3fff
    );
  }
  if (ascii(bytes, 12, 'VP8L')) {
    if (bytes[20] !== 0x2f) return null;
    
    const bits = view.getUint32(21, true);
    return sized(
      'image/webp',
      (bits & 0x3fff) + 1,
      ((bits >>> 14) & 0x3fff) + 1
    );
  }
  if (ascii(bytes, 12, 'VP8X')) {
    
    const width = bytes[24] | (bytes[25] << 8) | (bytes[26] << 16);
    const height = bytes[27] | (bytes[28] << 8) | (bytes[29] << 16);
    return sized('image/webp', width + 1, height + 1);
  }
  return null;
}


export function readAgentImageHeader(
  buffer: ArrayBuffer
): AgentImageHeader | null {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  if (startsWith(bytes, PNG_SIGNATURE)) return png(view, bytes);
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return jpeg(view, bytes);
  if (ascii(bytes, 0, 'GIF87a') || ascii(bytes, 0, 'GIF89a')) {
    return gif(view, bytes);
  }
  if (ascii(bytes, 0, 'RIFF') && ascii(bytes, 8, 'WEBP')) {
    return webp(view, bytes);
  }
  return null;
}
