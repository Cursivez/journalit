
import { ArrayBufferTarget, Muxer } from 'mp4-muxer';
import { GIFEncoder, applyPalette, quantize } from 'gifenc';
import {
  MOTION_CARD_SAMPLE_RATE,
  type MotionBackground,
} from './motionCardBackground';
import { drawMotionCard, type MotionCardScene } from './drawMotionCard';
import {
  MOTION_CARD_FPS,
  MOTION_CARD_SIZES,
  motionCardFrameCount,
  motionCardFrameTime,
  type MotionCardAspect,
} from './motionCardModel';


const H264_CODECS = ['avc1.640028', 'avc1.4d0028', 'avc1.420028'];
const VIDEO_BITRATE = 10_000_000;
const AUDIO_BITRATE = 192_000;
const KEYFRAME_INTERVAL = MOTION_CARD_FPS * 2;
const MAX_QUEUED_FRAMES = 6;
const AUDIO_CHUNK_FRAMES = 4_800;

type MotionAudioCodec = 'aac' | 'opus';

export interface MotionExportSupport {
  videoCodec: string;
  audioCodec: MotionAudioCodec | null;
}


export async function probeMotionExportSupport(): Promise<MotionExportSupport | null> {
  if (typeof VideoEncoder === 'undefined') return null;
  let videoCodec: string | null = null;
  for (const codec of H264_CODECS) {
    const { supported } = await VideoEncoder.isConfigSupported({
      codec,
      width: 1920,
      height: 1080,
      bitrate: VIDEO_BITRATE,
      framerate: MOTION_CARD_FPS,
    });
    if (supported) {
      videoCodec = codec;
      break;
    }
  }
  if (!videoCodec) return null;
  if (typeof AudioEncoder === 'undefined') {
    return { videoCodec, audioCodec: null };
  }
  const canEncode = async (codec: string) =>
    (
      await AudioEncoder.isConfigSupported({
        codec,
        sampleRate: MOTION_CARD_SAMPLE_RATE,
        numberOfChannels: 2,
        bitrate: AUDIO_BITRATE,
      })
    ).supported === true;
  
  const audioCodec = (await canEncode('mp4a.40.2'))
    ? 'aac'
    : (await canEncode('opus'))
      ? 'opus'
      : null;
  return { videoCodec, audioCodec };
}

function throwIfCancelled(signal: AbortSignal): void {
  if (signal.aborted) throw new Error('Export cancelled');
}


interface EncoderFailure {
  error: Error | null;
}

function recordFailure(failure: EncoderFailure) {
  return (error: DOMException) => {
    failure.error = new Error(`Encoder failed: ${error.message}`);
  };
}

function throwIfFailed(failure: EncoderFailure): void {
  if (failure.error) throw failure.error;
}


function untilCancelled<T>(work: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const cancel = () => reject(new Error('Export cancelled'));
    signal.addEventListener('abort', cancel, { once: true });
    work
      .then(resolve, reject)
      .finally(() => signal.removeEventListener('abort', cancel));
  });
}

function nextDequeue(encoder: VideoEncoder): Promise<void> {
  return new Promise((resolve) => {
    encoder.addEventListener('dequeue', () => resolve(), { once: true });
  });
}

async function encodeAudio(
  muxer: Muxer<ArrayBufferTarget>,
  sound: AudioBuffer,
  codec: MotionAudioCodec,
  seconds: number,
  signal: AbortSignal
): Promise<void> {
  const failure: EncoderFailure = { error: null };
  const encoder = new AudioEncoder({
    output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
    error: recordFailure(failure),
  });
  try {
    encoder.configure({
      codec: codec === 'aac' ? 'mp4a.40.2' : 'opus',
      sampleRate: MOTION_CARD_SAMPLE_RATE,
      numberOfChannels: 2,
      bitrate: AUDIO_BITRATE,
    });
    const left = sound.getChannelData(0);
    const right = sound.numberOfChannels > 1 ? sound.getChannelData(1) : left;
    const total = Math.round(seconds * MOTION_CARD_SAMPLE_RATE);
    for (let start = 0; start < total; start += AUDIO_CHUNK_FRAMES) {
      throwIfCancelled(signal);
      throwIfFailed(failure);
      const frames = Math.min(AUDIO_CHUNK_FRAMES, total - start);
      const samples = new Float32Array(frames * 2);
      for (let index = 0; index < frames; index++) {
        
        const position = (start + index) % sound.length;
        samples[index] = left[position];
        samples[frames + index] = right[position];
      }
      const data = new AudioData({
        format: 'f32-planar',
        sampleRate: MOTION_CARD_SAMPLE_RATE,
        numberOfFrames: frames,
        numberOfChannels: 2,
        timestamp: Math.round((start / MOTION_CARD_SAMPLE_RATE) * 1_000_000),
        data: samples,
      });
      try {
        encoder.encode(data);
      } finally {
        data.close();
      }
    }
    await untilCancelled(encoder.flush(), signal);
    throwIfFailed(failure);
  } finally {
    if (encoder.state !== 'closed') encoder.close();
  }
}

export interface MotionExportRequest {
  scene: MotionCardScene;
  background: MotionBackground | null;
  support: MotionExportSupport;
  includeSound: boolean;
  signal: AbortSignal;
  onProgress: (fraction: number) => void;
}

function cardCanvas(scene: MotionCardScene) {
  const { width, height } = MOTION_CARD_SIZES[scene.aspect];
  const canvas = createEl('canvas', { attr: { width, height } });
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas 2D is not available');
  return { canvas, ctx, width, height };
}

export async function exportMotionCardVideo({
  scene,
  background,
  support,
  includeSound,
  signal,
  onProgress,
}: MotionExportRequest): Promise<Blob> {
  const { canvas, ctx, width, height } = cardCanvas(scene);

  const sound = includeSound ? (background?.audio ?? null) : null;
  const audioCodec = sound ? support.audioCodec : null;
  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    
    fastStart: 'in-memory',
    firstTimestampBehavior: 'offset',
    video: { codec: 'avc', width, height, frameRate: MOTION_CARD_FPS },
    ...(audioCodec
      ? {
          audio: {
            codec: audioCodec,
            numberOfChannels: 2,
            sampleRate: MOTION_CARD_SAMPLE_RATE,
          },
        }
      : {}),
  });
  if (sound && audioCodec) {
    await encodeAudio(muxer, sound, audioCodec, scene.seconds, signal);
  }

  const failure: EncoderFailure = { error: null };
  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: recordFailure(failure),
  });
  const totalFrames = motionCardFrameCount(scene.seconds);
  const frameMicros = 1_000_000 / MOTION_CARD_FPS;
  try {
    encoder.configure({
      codec: support.videoCodec,
      width,
      height,
      bitrate: VIDEO_BITRATE,
      framerate: MOTION_CARD_FPS,
      avc: { format: 'avc' },
    });
    for (let index = 0; index < totalFrames; index++) {
      throwIfCancelled(signal);
      throwIfFailed(failure);
      const time = index / MOTION_CARD_FPS;
      const frame = background
        ? await untilCancelled(background.frameAt(time), signal)
        : null;
      drawMotionCard(
        ctx,
        scene,
        frame,
        motionCardFrameTime(index, totalFrames, scene.seconds)
      );
      const videoFrame = new VideoFrame(canvas, {
        timestamp: Math.round(index * frameMicros),
        duration: Math.round(frameMicros),
      });
      try {
        encoder.encode(videoFrame, {
          keyFrame: index % KEYFRAME_INTERVAL === 0,
        });
      } finally {
        videoFrame.close();
      }
      
      
      while (encoder.encodeQueueSize > MAX_QUEUED_FRAMES) {
        await untilCancelled(nextDequeue(encoder), signal);
      }
      onProgress((index + 1) / totalFrames);
      
      if (index % 8 === 0) {
        await new Promise((resolve) => window.setTimeout(resolve));
      }
    }
    await untilCancelled(encoder.flush(), signal);
    throwIfFailed(failure);
  } finally {
    if (encoder.state !== 'closed') encoder.close();
  }
  throwIfCancelled(signal);
  muxer.finalize();
  return new Blob([target.buffer], { type: 'video/mp4' });
}


const GIF_FPS = 15;
const MOTION_CARD_GIF_MAX_SECONDS = 6;
const GIF_MAX_PIXELS = 640 * 360;

function motionCardGifSize(aspect: MotionCardAspect): {
  width: number;
  height: number;
} {
  const { width, height } = MOTION_CARD_SIZES[aspect];
  const scale = Math.min(1, Math.sqrt(GIF_MAX_PIXELS / (width * height)));
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}


function motionCardGifFrameDelay(index: number): number {
  const centisecondsAt = (frame: number) => Math.round((frame * 100) / GIF_FPS);
  return (centisecondsAt(index + 1) - centisecondsAt(index)) * 10;
}

export async function exportMotionCardGif({
  scene,
  background,
  signal,
  onProgress,
}: Pick<
  MotionExportRequest,
  'scene' | 'background' | 'signal' | 'onProgress'
>): Promise<Blob> {
  
  const gifScene = {
    ...scene,
    seconds: Math.min(scene.seconds, MOTION_CARD_GIF_MAX_SECONDS),
  };
  const { canvas: card, ctx } = cardCanvas(gifScene);
  const { width, height } = motionCardGifSize(scene.aspect);
  const frameCanvas = createEl('canvas', { attr: { width, height } });
  const frameCtx = frameCanvas.getContext('2d', {
    alpha: false,
    willReadFrequently: true,
  });
  if (!frameCtx) throw new Error('Canvas 2D is not available');
  frameCtx.imageSmoothingQuality = 'high';

  const gif = GIFEncoder();
  const totalFrames = Math.max(1, Math.round(gifScene.seconds * GIF_FPS));
  for (let index = 0; index < totalFrames; index++) {
    throwIfCancelled(signal);
    const time = index / GIF_FPS;
    const frame = background
      ? await untilCancelled(background.frameAt(time), signal)
      : null;
    
    drawMotionCard(
      ctx,
      gifScene,
      frame,
      index === totalFrames - 1 ? gifScene.seconds : time
    );
    frameCtx.drawImage(card, 0, 0, width, height);
    const { data } = frameCtx.getImageData(0, 0, width, height);
    
    const palette = quantize(data, 256);
    gif.writeFrame(applyPalette(data, palette), width, height, {
      palette,
      delay: motionCardGifFrameDelay(index),
    });
    onProgress((index + 1) / totalFrames);
    
    await new Promise((resolve) => window.setTimeout(resolve));
  }
  throwIfCancelled(signal);
  gif.finish();
  return new Blob([gif.bytes()], { type: 'image/gif' });
}


export async function renderMotionCardPng(
  scene: MotionCardScene,
  background: MotionBackground | null
): Promise<Blob> {
  const { canvas, ctx } = cardCanvas(scene);
  const time = scene.seconds;
  const frame = background ? await background.frameAt(time) : null;
  drawMotionCard(ctx, scene, frame, time);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('PNG encoding failed')),
      'image/png'
    );
  });
}
