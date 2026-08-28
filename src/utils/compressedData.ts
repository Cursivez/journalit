

import { inflateSync, strFromU8 } from 'fflate';






const Z85_ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&;>()[]{}@%$#';
const Z85_VALUES = new Map(
  Array.from(Z85_ALPHABET, (char, index) => [char, index])
);


export function z85ToBytes(packed: string): Uint8Array {
  const separatorIndex = packed.indexOf(':');
  if (separatorIndex <= 0) {
    throw new Error('Invalid Z85 payload length prefix');
  }

  const byteLengthText = packed.slice(0, separatorIndex);
  if (!/^\d+$/.test(byteLengthText)) {
    throw new Error('Invalid Z85 payload length');
  }

  const byteLength = Number(byteLengthText);
  const encoded = packed.slice(separatorIndex + 1);
  if (
    !Number.isSafeInteger(byteLength) ||
    byteLength < 0 ||
    encoded.length % 5 !== 0
  ) {
    throw new Error('Invalid Z85 payload');
  }

  const paddedByteLength = (encoded.length / 5) * 4;
  if (byteLength > paddedByteLength) {
    throw new Error('Invalid Z85 payload byte length');
  }

  const output = new Uint8Array(paddedByteLength);
  for (
    let encodedOffset = 0;
    encodedOffset < encoded.length;
    encodedOffset += 5
  ) {
    let value = 0;
    for (let index = 0; index < 5; index += 1) {
      const digit = Z85_VALUES.get(encoded[encodedOffset + index]);
      if (digit === undefined) {
        throw new Error('Invalid Z85 payload character');
      }
      value = value * 85 + digit;
    }

    if (value > 0xffffffff) {
      throw new Error('Invalid Z85 payload group');
    }

    const outputOffset = (encodedOffset / 5) * 4;
    output[outputOffset] = (value >>> 24) & 0xff;
    output[outputOffset + 1] = (value >>> 16) & 0xff;
    output[outputOffset + 2] = (value >>> 8) & 0xff;
    output[outputOffset + 3] = value & 0xff;
  }

  return output.slice(0, byteLength);
}


export function decodeCompressedBytes(packed: string): Uint8Array {
  const inflateBytes: (data: Uint8Array) => Uint8Array = inflateSync;
  return inflateBytes(z85ToBytes(packed));
}


export function decodeCompressedJson(packed: string): unknown {
  const bytes = z85ToBytes(packed);
  const inflateBytes: (data: Uint8Array) => Uint8Array = inflateSync;
  const decodeText: (data: Uint8Array) => string = strFromU8;
  const json = decodeText(inflateBytes(bytes));
  const parsed: unknown = JSON.parse(json);
  return parsed;
}
