import { App, requestUrl } from 'obsidian';
import { resolveVaultMediaFile } from './imageMediaUtils';

function getMimeTypeFromPath(path: string): string | null {
  const normalizedPath = path.split(/[?#]/)[0].toLowerCase();

  if (normalizedPath.endsWith('.jpg') || normalizedPath.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (normalizedPath.endsWith('.png')) return 'image/png';
  if (normalizedPath.endsWith('.gif')) return 'image/gif';
  if (normalizedPath.endsWith('.webp')) return 'image/webp';
  if (normalizedPath.endsWith('.avif')) return 'image/avif';
  if (normalizedPath.endsWith('.svg')) return 'image/svg+xml';
  if (normalizedPath.endsWith('.bmp')) return 'image/bmp';

  return null;
}

function getResponseMimeType(headers: Record<string, string>): string | null {
  const contentTypeEntry = Object.entries(headers).find(
    ([headerName]) => headerName.toLowerCase() === 'content-type'
  );
  return contentTypeEntry?.[1].split(';')[0].trim().toLowerCase() || null;
}

function arrayBufferToBlob(
  arrayBuffer: ArrayBuffer,
  mimeType: string | null
): Blob {
  return new Blob([arrayBuffer], { type: mimeType ?? '' });
}

function percentEncodedDataToBytes(data: string): Uint8Array {
  const bytes: number[] = [];
  const textEncoder = new TextEncoder();

  for (let index = 0; index < data.length; index += 1) {
    if (data[index] === '%' && index + 2 < data.length) {
      const hex = data.slice(index + 1, index + 3);
      if (/^[\da-fA-F]{2}$/u.test(hex)) {
        bytes.push(parseInt(hex, 16));
        index += 2;
        continue;
      }
    }

    bytes.push(...textEncoder.encode(data[index]));
  }

  return new Uint8Array(bytes);
}

function dataUrlToBlob(dataUrl: string): Blob {
  const separatorIndex = dataUrl.indexOf(',');
  const metadata = separatorIndex >= 0 ? dataUrl.slice(0, separatorIndex) : '';
  const data = separatorIndex >= 0 ? dataUrl.slice(separatorIndex + 1) : '';
  const mimeType = metadata.match(/^data:([^;]+)/)?.[1] || 'image/png';

  if (metadata.toLowerCase().includes(';base64')) {
    const decodedData = data.includes('%') ? decodeURIComponent(data) : data;
    const binary = atob(decodedData);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return new Blob([bytes], { type: mimeType });
  }

  const bytes = percentEncodedDataToBytes(data);
  const arrayBuffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(arrayBuffer).set(bytes);
  return new Blob([arrayBuffer], { type: mimeType });
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Unable to convert image to PNG'));
      }
    }, 'image/png');
  });
}

function getSvgLengthValue(value: SVGAnimatedLength | undefined): number {
  return value?.baseVal?.value || 0;
}

function getSvgViewBoxDimensions(svgElement: SVGSVGElement): {
  width: number;
  height: number;
} {
  const viewBox = svgElement.getAttribute('viewBox');
  if (!viewBox) return { width: 0, height: 0 };

  const [, , width, height] = viewBox
    .trim()
    .split(/[\s,]+/u)
    .map((part) => Number(part));

  return {
    width: Number.isFinite(width) ? width : 0,
    height: Number.isFinite(height) ? height : 0,
  };
}

interface SvgClipboardClone extends Node {
  setAttribute(name: string, value: string): void;
  hasAttribute(name: string): boolean;
}

function isSvgClipboardClone(node: Node): node is SvgClipboardClone {
  return (
    node.nodeName.toLowerCase() === 'svg' &&
    'setAttribute' in node &&
    typeof node.setAttribute === 'function' &&
    'hasAttribute' in node &&
    typeof node.hasAttribute === 'function'
  );
}

function drawImageToPngBlob(
  image: CanvasImageSource,
  width: number,
  height: number
): Promise<Blob> {
  const canvas = window.activeDocument.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to prepare image canvas');
  }

  context.drawImage(image, 0, 0, width, height);
  return canvasToPngBlob(canvas);
}

function loadStandaloneImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load image'));
    image.src = src;
  });
}

async function convertImageBlobToPng(blob: Blob): Promise<Blob> {
  const objectUrl = URL.createObjectURL(blob);

  try {
    const image = await loadStandaloneImage(objectUrl);

    return drawImageToPngBlob(image, image.naturalWidth, image.naturalHeight);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function getClipboardReadyRenderedImageBlob(
  imageElement: HTMLImageElement
): Promise<Blob> {
  const src = imageElement.currentSrc || imageElement.src;
  if (!src) {
    throw new Error('Rendered image source is unavailable');
  }

  const image =
    imageElement.complete && imageElement.naturalWidth > 0
      ? imageElement
      : await loadStandaloneImage(src);

  const bounds = imageElement.getBoundingClientRect();
  const width = image.naturalWidth || bounds.width;
  const height = image.naturalHeight || bounds.height;

  if (width <= 0 || height <= 0) {
    throw new Error('Rendered image dimensions are unavailable');
  }

  return drawImageToPngBlob(image, width, height);
}

async function normalizeClipboardImageBlob(blob: Blob): Promise<Blob> {
  if (blob.type === 'image/png') return blob;

  if (
    blob.type &&
    blob.type.startsWith('image/') &&
    typeof ClipboardItem.supports === 'function' &&
    ClipboardItem.supports(blob.type)
  ) {
    return blob;
  }

  return convertImageBlobToPng(blob);
}

export async function getClipboardReadySvgBlob(
  svgElement: SVGSVGElement
): Promise<Blob> {
  const svgClone = svgElement.cloneNode(true);
  if (!isSvgClipboardClone(svgClone)) {
    throw new Error('Unable to prepare SVG image for clipboard');
  }

  svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const bounds = svgElement.getBoundingClientRect();
  const viewBoxDimensions = getSvgViewBoxDimensions(svgElement);
  const width =
    getSvgLengthValue(svgElement.width) ||
    bounds.width ||
    viewBoxDimensions.width;
  const height =
    getSvgLengthValue(svgElement.height) ||
    bounds.height ||
    viewBoxDimensions.height;

  if (width > 0 && !svgClone.hasAttribute('width')) {
    svgClone.setAttribute('width', width.toString());
  }
  if (height > 0 && !svgClone.hasAttribute('height')) {
    svgClone.setAttribute('height', height.toString());
  }
  if (width > 0 && height > 0 && !svgClone.hasAttribute('viewBox')) {
    svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  const serializedSvg = new XMLSerializer().serializeToString(svgClone);
  const svgBlob = new Blob([serializedSvg], { type: 'image/svg+xml' });
  return convertImageBlobToPng(svgBlob);
}

export async function getClipboardReadyImageBlob({
  app,
  imagePath,
  sourcePath,
  imageUrl,
}: {
  app: App;
  imagePath: string;
  sourcePath: string;
  imageUrl: string;
}): Promise<Blob> {
  const vaultFile = resolveVaultMediaFile(app, imagePath, sourcePath);

  if (vaultFile) {
    const arrayBuffer = await app.vault.readBinary(vaultFile);
    return normalizeClipboardImageBlob(
      arrayBufferToBlob(arrayBuffer, getMimeTypeFromPath(vaultFile.path))
    );
  }

  if (imageUrl.startsWith('data:')) {
    return normalizeClipboardImageBlob(dataUrlToBlob(imageUrl));
  }

  const response = await requestUrl({ url: imageUrl });
  const responseMimeType = getResponseMimeType(response.headers);
  const mimeType = responseMimeType?.startsWith('image/')
    ? responseMimeType
    : !responseMimeType
      ? getMimeTypeFromPath(imageUrl)
      : null;
  return normalizeClipboardImageBlob(
    arrayBufferToBlob(response.arrayBuffer, mimeType)
  );
}
