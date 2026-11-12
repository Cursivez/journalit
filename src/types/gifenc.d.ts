
declare module 'gifenc' {
  type GifPixelFormat = 'rgb565' | 'rgb444' | 'rgba4444';
  export type GifPalette = number[][];

  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    options?: { format?: GifPixelFormat }
  ): GifPalette;

  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: GifPalette,
    format?: GifPixelFormat
  ): Uint8Array;

  interface GifStream {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      options?: { palette?: GifPalette; delay?: number; repeat?: number }
    ): void;
    finish(): void;
    bytes(): Uint8Array<ArrayBuffer>;
  }

  export function GIFEncoder(options?: { initialCapacity?: number }): GifStream;
}
