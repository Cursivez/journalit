

import { requestUrl } from 'obsidian';
import { DemoSyncGate } from '../../demo/DemoSyncGate';
import { logger } from '../../utils/logger';

const TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const REMOTE_URL_PATTERN = /^https?:/i;

function drawToCanvas(
  source: CanvasImageSource,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = createEl('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to prepare media canvas');
  }
  context.drawImage(source, 0, 0, width, height);
  return canvas;
}


function canvasToPngDataUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    
    
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Unable to encode media frame'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Unable to read encoded media frame'));
        }
      };
      reader.onerror = () => reject(new Error('Unable to read encoded media'));
      reader.readAsDataURL(blob);
    }, 'image/png');
  });
}

function loadDetachedImage(url: string): Promise<HTMLImageElement> {
  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image ${url}`));
    image.src = url;
  });
}


async function withCanvasReadableUrl<T>(
  url: string,
  kind: 'image' | 'video',
  draw: (readableUrl: string) => Promise<T>
): Promise<T> {
  if (!REMOTE_URL_PATTERN.test(url)) return draw(url);
  DemoSyncGate.assertNetworkAllowed();
  const response = await requestUrl({ url });
  const contentType = Object.entries(response.headers)
    .find(([name]) => name.toLowerCase() === 'content-type')?.[1]
    ?.split(';')[0]
    .trim();
  const blob = contentType?.startsWith(`${kind}/`)
    ? new Blob([response.arrayBuffer], { type: contentType })
    : new Blob([response.arrayBuffer]);
  const objectUrl = URL.createObjectURL(blob);
  try {
    return await draw(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

interface PixelSize {
  width: number;
  height: number;
}


function renderedBound(
  element: HTMLElement,
  pixelRatio: number
): PixelSize | null {
  if (element.clientWidth === 0 || element.clientHeight === 0) return null;
  return {
    width: element.clientWidth * pixelRatio,
    height: element.clientHeight * pixelRatio,
  };
}


function mergeBound(
  previous: PixelSize | null | undefined,
  shown: PixelSize | null
): PixelSize | null {
  if (previous === undefined) return shown;
  if (!previous || !shown) return null;
  return {
    width: Math.max(previous.width, shown.width),
    height: Math.max(previous.height, shown.height),
  };
}


function fitWithin(natural: PixelSize, bound: PixelSize | null): PixelSize {
  if (!bound) return natural;
  const scale = Math.min(
    1,
    Math.max(bound.width / natural.width, bound.height / natural.height)
  );
  return {
    width: Math.max(1, Math.round(natural.width * scale)),
    height: Math.max(1, Math.round(natural.height * scale)),
  };
}

async function imageUrlToDataUrl(
  url: string,
  bound: PixelSize | null
): Promise<string> {
  
  
  return withCanvasReadableUrl(url, 'image', async (readableUrl) => {
    const image = await loadDetachedImage(readableUrl);
    const size = fitWithin(
      { width: image.naturalWidth, height: image.naturalHeight },
      bound
    );
    return canvasToPngDataUrl(drawToCanvas(image, size.width, size.height));
  });
}


async function showSettledDataUrl(
  image: HTMLImageElement,
  dataUrl: string
): Promise<void> {
  image.srcset = '';
  image.loading = 'eager';
  image.src = dataUrl;
  try {
    await image.decode();
  } catch (error) {
    logger.debug('[Journalit] Share capture could not decode media', error);
    image.src = TRANSPARENT_PIXEL;
  }
}

async function resolveImageDataUrl(
  url: string,
  bound: PixelSize | null
): Promise<string> {
  try {
    return await imageUrlToDataUrl(url, bound);
  } catch (error) {
    logger.debug('[Journalit] Share capture could not inline image', error);
    return TRANSPARENT_PIXEL;
  }
}

function imageSource(image: HTMLImageElement): string | null {
  const url = image.currentSrc || image.src;
  return url && !url.startsWith('data:') ? url : null;
}


function inlineImages(
  liveImages: HTMLImageElement[],
  clonedImages: HTMLImageElement[],
  pixelRatio: number
): Promise<void[]> {
  const bounds = new Map<string, PixelSize | null>();
  clonedImages.forEach((cloned, index) => {
    const url = imageSource(cloned);
    if (!url) return;
    bounds.set(
      url,
      mergeBound(bounds.get(url), renderedBound(liveImages[index], pixelRatio))
    );
  });

  const dataUrls = new Map<string, Promise<string>>();
  bounds.forEach((bound, url) => {
    dataUrls.set(url, resolveImageDataUrl(url, bound));
  });

  return Promise.all(
    clonedImages.map(async (cloned) => {
      const url = imageSource(cloned);
      const dataUrl = url ? dataUrls.get(url) : undefined;
      if (!dataUrl) return;
      await showSettledDataUrl(cloned, await dataUrl);
    })
  );
}

function waitForVideoFrame(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    video.addEventListener('loadeddata', () => resolve(), { once: true });
    video.addEventListener(
      'error',
      () => reject(new Error('Unable to load video frame')),
      { once: true }
    );
  });
}

function encodeVideoFrame(
  video: HTMLVideoElement,
  bound: PixelSize | null
): Promise<string> {
  const size = fitWithin(
    { width: video.videoWidth, height: video.videoHeight },
    bound
  );
  return canvasToPngDataUrl(drawToCanvas(video, size.width, size.height));
}

async function encodeDetachedVideoFrame(
  url: string,
  bound: PixelSize | null
): Promise<string> {
  const video = createEl('video', { attr: { preload: 'auto' } });
  video.muted = true;
  const frameReady = waitForVideoFrame(video);
  video.src = url;
  try {
    await frameReady;
    return await encodeVideoFrame(video, bound);
  } finally {
    video.removeAttribute('src');
    video.load();
  }
}

async function captureVideoFrame(
  live: HTMLVideoElement,
  bound: PixelSize | null
): Promise<string> {
  
  
  
  
  return withCanvasReadableUrl(live.currentSrc || live.src, 'video', (url) =>
    encodeDetachedVideoFrame(url, bound)
  );
}

async function replaceVideoWithFrame(
  live: HTMLVideoElement,
  cloned: HTMLVideoElement,
  bound: PixelSize | null
): Promise<void> {
  let dataUrl = TRANSPARENT_PIXEL;
  try {
    dataUrl = await captureVideoFrame(live, bound);
  } catch (error) {
    logger.debug('[Journalit] Share capture could not read video frame', error);
  }
  const frame = createEl('img', { cls: cloned.className });
  await showSettledDataUrl(frame, dataUrl);
  cloned.replaceWith(frame);
}


export async function inlineCloneMedia(
  source: HTMLElement,
  clone: HTMLElement,
  pixelRatio: number
): Promise<void> {
  const liveVideos = Array.from(source.querySelectorAll('video'));
  const clonedVideos = Array.from(clone.querySelectorAll('video'));
  await Promise.all([
    ...clonedVideos.map((cloned, index) =>
      replaceVideoWithFrame(
        liveVideos[index],
        cloned,
        renderedBound(liveVideos[index], pixelRatio)
      )
    ),
    inlineImages(
      Array.from(source.querySelectorAll('img')),
      Array.from(clone.querySelectorAll('img')),
      pixelRatio
    ),
  ]);
}
