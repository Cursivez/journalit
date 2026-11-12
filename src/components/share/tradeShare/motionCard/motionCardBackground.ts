
import type { Lang } from '../../../../lang/locale/en';


const MAX_ANIMATED_FRAMES = 900;
const MAX_ANIMATED_FRAME_EDGE = 1280;
const MAX_ANIMATED_BYTES = 512 * 1024 * 1024;
const RGBA_BYTES = 4;

const MIN_FRAME_SECONDS = 0.02;
const DEFAULT_FRAME_SECONDS = 0.1;

const MAX_SOUND_BYTES = 300 * 1024 * 1024;
const MAX_SOUND_SECONDS = 600;
export const MOTION_CARD_SAMPLE_RATE = 48_000;

export class MotionBackgroundError extends Error {
  constructor(readonly messageKey: keyof Lang) {
    super(messageKey);
  }
}

export interface MotionBackground {
  readonly name: string;
  readonly width: number;
  readonly height: number;
  
  readonly seconds: number | null;
  readonly audio: AudioBuffer | null;
  
  frameNow(time: number): CanvasImageSource;
  
  frameAt(time: number): Promise<CanvasImageSource>;
  startPreview(): void;
  restartPreview(): void;
  stopPreview(): void;
  dispose(): void;
}

const IDLE_PREVIEW = {
  startPreview: () => undefined,
  restartPreview: () => undefined,
  stopPreview: () => undefined,
};

async function loadStill(blob: Blob, name: string): Promise<MotionBackground> {
  
  
  const url = URL.createObjectURL(blob);
  const image = createEl('img');
  image.src = url;
  try {
    await image.decode();
  } catch {
    URL.revokeObjectURL(url);
    throw new MotionBackgroundError('share.motion.error-unsupported');
  }
  if (image.naturalWidth === 0 || image.naturalHeight === 0) {
    URL.revokeObjectURL(url);
    throw new MotionBackgroundError('share.motion.error-unsupported');
  }
  return {
    ...IDLE_PREVIEW,
    name,
    width: image.naturalWidth,
    height: image.naturalHeight,
    seconds: null,
    audio: null,
    frameNow: () => image,
    frameAt: () => Promise.resolve(image),
    dispose: () => URL.revokeObjectURL(url),
  };
}

interface DecodedFrame {
  bitmap: ImageBitmap;
  endsAt: number;
}

function animatedFrameScale(width: number, height: number, frames: number) {
  return Math.min(
    1,
    MAX_ANIMATED_FRAME_EDGE / Math.max(width, height),
    Math.sqrt(MAX_ANIMATED_BYTES / (frames * width * height * RGBA_BYTES))
  );
}

function throwIfCancelled(signal: AbortSignal): void {
  if (signal.aborted) throw new Error('Background load cancelled');
}

async function decodeAnimatedFrames(
  blob: Blob,
  signal: AbortSignal
): Promise<DecodedFrame[]> {
  const decoder = new ImageDecoder({
    data: await blob.arrayBuffer(),
    type: blob.type,
  });
  const frames: DecodedFrame[] = [];
  try {
    await decoder.tracks.ready;
    await decoder.completed;
    const count = decoder.tracks.selectedTrack?.frameCount ?? 0;
    if (count < 2) return frames;
    const total = Math.min(count, MAX_ANIMATED_FRAMES);
    let endsAt = 0;
    
    
    for (let index = 0; index < total; index++) {
      throwIfCancelled(signal);
      const { image } = await decoder.decode({ frameIndex: index });
      try {
        const scale = animatedFrameScale(
          image.displayWidth,
          image.displayHeight,
          total
        );
        const bitmap = await createImageBitmap(image, {
          resizeWidth: Math.round(image.displayWidth * scale),
          resizeHeight: Math.round(image.displayHeight * scale),
        });
        const seconds = (image.duration ?? 0) / 1_000_000;
        endsAt +=
          seconds >= MIN_FRAME_SECONDS ? seconds : DEFAULT_FRAME_SECONDS;
        frames.push({ bitmap, endsAt });
      } finally {
        image.close();
      }
    }
    return frames;
  } catch (error) {
    frames.forEach(({ bitmap }) => bitmap.close());
    throw error;
  } finally {
    decoder.close();
  }
}

function animatedBackground(
  frames: DecodedFrame[],
  name: string
): MotionBackground {
  const seconds = frames[frames.length - 1].endsAt;
  const frameNow = (time: number) => {
    const looped = time % seconds;
    let low = 0;
    let high = frames.length - 1;
    while (low < high) {
      const middle = (low + high) >> 1;
      if (frames[middle].endsAt > looped) high = middle;
      else low = middle + 1;
    }
    return frames[low].bitmap;
  };
  return {
    ...IDLE_PREVIEW,
    name,
    width: frames[0].bitmap.width,
    height: frames[0].bitmap.height,
    seconds,
    audio: null,
    frameNow,
    frameAt: (time) => Promise.resolve(frameNow(time)),
    dispose: () => frames.forEach(({ bitmap }) => bitmap.close()),
  };
}

async function decodeSound(blob: Blob, seconds: number) {
  if (blob.size > MAX_SOUND_BYTES || seconds > MAX_SOUND_SECONDS) return null;
  try {
    const context = new OfflineAudioContext(2, 1, MOTION_CARD_SAMPLE_RATE);
    return await context.decodeAudioData(await blob.arrayBuffer());
  } catch {
    
    return null;
  }
}

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const settle = (done: () => void) => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      done();
    };
    const onSeeked = () => settle(resolve);
    const onError = () =>
      settle(() => reject(new Error('Video could not seek')));
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    video.currentTime = time;
  });
}

async function loadVideo(
  blob: Blob,
  name: string,
  signal: AbortSignal
): Promise<MotionBackground> {
  
  
  const url = URL.createObjectURL(blob);
  const video = createEl('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'auto';
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    video.pause();
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(url);
  };
  
  signal.addEventListener('abort', release, { once: true });
  try {
    await new Promise<void>((resolve, reject) => {
      video.addEventListener('loadeddata', () => resolve(), { once: true });
      video.addEventListener(
        'error',
        () => reject(new Error('Video could not load')),
        { once: true }
      );
      signal.addEventListener(
        'abort',
        () => reject(new Error('Background load cancelled')),
        { once: true }
      );
      video.src = url;
    });
    if (video.videoWidth === 0 || !Number.isFinite(video.duration)) {
      throw new Error('Video has no picture');
    }
  } catch {
    release();
    throwIfCancelled(signal);
    throw new MotionBackgroundError('share.motion.error-unsupported');
  }
  const seconds = video.duration;
  const audio = await decodeSound(blob, seconds);
  throwIfCancelled(signal);
  signal.removeEventListener('abort', release);
  const play = () => {
    video.play().catch((error: unknown) => {
      
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('[Journalit] Card background did not play:', error);
    });
  };
  return {
    name,
    width: video.videoWidth,
    height: video.videoHeight,
    seconds,
    audio,
    frameNow: () => video,
    frameAt: async (time) => {
      await seekVideo(video, time % seconds);
      return video;
    },
    startPreview: play,
    restartPreview: () => {
      video.currentTime = 0;
      play();
    },
    stopPreview: () => video.pause(),
    dispose: release,
  };
}

const VIDEO_NAME = /\.(mp4|m4v|webm|mov|ogv|mkv|3gp)$/i;
const ANIMATED_TYPES = /^image\/(gif|webp|apng|avif)$/;
export async function loadMotionBackgroundBlob(
  blob: Blob,
  name: string,
  signal: AbortSignal
): Promise<MotionBackground> {
  throwIfCancelled(signal);
  if (blob.type.startsWith('video/') || VIDEO_NAME.test(name)) {
    return loadVideo(blob, name, signal);
  }
  if (
    ANIMATED_TYPES.test(blob.type) &&
    typeof ImageDecoder !== 'undefined' &&
    (await ImageDecoder.isTypeSupported(blob.type))
  ) {
    const frames = await decodeAnimatedFrames(blob, signal).catch(
      (error: unknown) => {
        throwIfCancelled(signal);
        console.error('[Journalit] Failed to decode animation:', error);
        throw new MotionBackgroundError('share.motion.error-unsupported');
      }
    );
    if (frames.length > 0) return animatedBackground(frames, name);
  }
  return loadStill(blob, name);
}
