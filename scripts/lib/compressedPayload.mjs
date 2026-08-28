import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';
import { deflateAsync } from '@gfx/zopfli';





const Z85_ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&;>()[]{}@%$#';

function encodeZ85(bytes) {
  const paddedLength = Math.ceil(bytes.length / 4) * 4;
  const paddedBytes = Buffer.alloc(paddedLength);
  paddedBytes.set(bytes);

  let encoded = '';
  for (let offset = 0; offset < paddedLength; offset += 4) {
    let value = paddedBytes.readUInt32BE(offset);
    let group = '';

    for (let index = 0; index < 5; index += 1) {
      group = Z85_ALPHABET[value % 85] + group;
      value = Math.floor(value / 85);
    }

    encoded += group;
  }

  return `${bytes.length}:${encoded}`;
}

export async function compressJson(value) {
  return compressBytes(Buffer.from(JSON.stringify(value), 'utf8'));
}

export async function compressBytes(source) {
  const bytes = await deflateAsync(source, { numiterations: 15 });
  const packed = encodeZ85(bytes);
  const inflated = inflateRawSync(decodeZ85(packed));
  if (!inflated.equals(source)) {
    throw new Error('Compressed payload failed the roundtrip check');
  }
  return packed;
}

function decodeZ85(packed) {
  const separatorIndex = packed.indexOf(':');
  const byteLength = Number(packed.slice(0, separatorIndex));
  const encoded = packed.slice(separatorIndex + 1);
  const paddedByteLength = (encoded.length / 5) * 4;
  const output = new Uint8Array(paddedByteLength);
  for (
    let encodedOffset = 0;
    encodedOffset < encoded.length;
    encodedOffset += 5
  ) {
    let value = 0;
    for (let index = 0; index < 5; index += 1) {
      const digit = Z85_ALPHABET.indexOf(encoded[encodedOffset + index]);
      value = value * 85 + digit;
    }

    const outputOffset = (encodedOffset / 5) * 4;
    output[outputOffset] = (value >>> 24) & 0xff;
    output[outputOffset + 1] = (value >>> 16) & 0xff;
    output[outputOffset + 2] = (value >>> 8) & 0xff;
    output[outputOffset + 3] = value & 0xff;
  }

  return output.slice(0, byteLength);
}

export function sourceHashHeader(sourceHash) {
  return ` * Source hash: ${sourceHash}`;
}

export function hashSourceFiles(paths) {
  const hash = createHash('sha256');
  for (const path of paths) {
    hash.update(path);
    hash.update('\0');
    hash.update(fs.readFileSync(path));
    hash.update('\0');
  }
  return hash.digest('hex').slice(0, 16);
}

export function assertGeneratedFresh(outputPath, sourceHash, regenerateCommand) {
  const existingOutput = fs.existsSync(outputPath)
    ? fs.readFileSync(outputPath, 'utf8')
    : '';

  if (!existingOutput.includes(sourceHashHeader(sourceHash))) {
    console.error(`${outputPath} is stale. Run ${regenerateCommand}.`);
    process.exit(1);
  }
}
