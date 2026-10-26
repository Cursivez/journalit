import type {
  AgentImageEncoder,
  AgentImageOutputType,
} from './agentImageSizing';


export interface DecodedAgentImage {
  readonly width: number;
  readonly height: number;
  readonly source: CanvasImageSource;
  
  close(): void;
}


export class AgentImageDecodeError extends Error {
  constructor() {
    super('The image could not be decoded.');
    this.name = 'AgentImageDecodeError';
  }
}

async function loadImageElement(blob: Blob): Promise<DecodedAgentImage> {
  const url = URL.createObjectURL(blob);
  const image = new Image();
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new AgentImageDecodeError());
      image.src = url;
    });
  } catch (error) {
    image.removeAttribute('src');
    throw error;
  } finally {
    
    URL.revokeObjectURL(url);
  }
  return {
    width: image.naturalWidth,
    height: image.naturalHeight,
    source: image,
    close: () => image.removeAttribute('src'),
  };
}


export async function decodeAgentImage(
  bytes: ArrayBuffer,
  mediaType: string
): Promise<DecodedAgentImage> {
  const blob = new Blob([bytes], { type: mediaType });
  let decoded: DecodedAgentImage;
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob);
      decoded = {
        width: bitmap.width,
        height: bitmap.height,
        source: bitmap,
        close: () => bitmap.close(),
      };
    } catch {
      decoded = await loadImageElement(blob);
    }
  } else {
    decoded = await loadImageElement(blob);
  }
  if (!(decoded.width > 0 && decoded.height > 0)) {
    decoded.close();
    throw new AgentImageDecodeError();
  }
  return decoded;
}

function canvasBlob(
  canvas: HTMLCanvasElement,
  mediaType: AgentImageOutputType,
  quality: number | undefined
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        
        if (blob && blob.type === mediaType) resolve(blob);
        else reject(new AgentImageDecodeError());
      },
      mediaType,
      quality
    );
  });
}


export interface DisposableAgentImageEncoder {
  readonly encode: AgentImageEncoder;
  
  dispose(): void;
}


export function createCanvasEncoder(
  image: DecodedAgentImage
): DisposableAgentImageEncoder {
  const canvas = createEl('canvas');
  let drawn: { width: number; height: number; opaque: boolean } | null = null;
  return {
    encode: async (width, height, mediaType, quality) => {
      const opaque = mediaType === 'image/jpeg';
      if (
        drawn?.width !== width ||
        drawn.height !== height ||
        drawn.opaque !== opaque
      ) {
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Unable to prepare image canvas');
        context.imageSmoothingQuality = 'high';
        context.clearRect(0, 0, width, height);
        if (opaque) {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, width, height);
        }
        context.drawImage(image.source, 0, 0, width, height);
        drawn = { width, height, opaque };
      }
      const blob = await canvasBlob(canvas, mediaType, quality);
      return {
        mediaType,
        width,
        height,
        bytes: await blob.arrayBuffer(),
      };
    },
    dispose: () => {
      canvas.width = 0;
      canvas.height = 0;
      drawn = null;
    },
  };
}
