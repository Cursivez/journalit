import type { App, TFile } from 'obsidian';
import { logger } from '../../utils/logger';


function resourceIdentity(resource: string): string {
  const url = new URL(resource);
  url.search = '';
  url.hash = '';
  return url.href;
}


export async function withVaultCaptureMedia<T>(
  app: App,
  source: HTMLElement,
  clone: HTMLElement,
  capture: () => Promise<T>
): Promise<T> {
  
  
  const liveMedia = source.querySelectorAll<
    HTMLImageElement | HTMLVideoElement
  >('img, video');
  clone
    .querySelectorAll<HTMLImageElement | HTMLVideoElement>('img, video')
    .forEach((element, index) => {
      const live = liveMedia[index];
      if (live.currentSrc) element.src = live.currentSrc;
      if (element.instanceOf(HTMLImageElement)) element.srcset = '';
    });
  
  
  clone
    .querySelectorAll('picture source')
    .forEach((element) => element.remove());
  const media = Array.from(
    clone.querySelectorAll<
      HTMLImageElement | HTMLVideoElement | HTMLSourceElement
    >('img, video, video source')
  );
  const local = media.filter(
    (element) => element.src && !/^(https?:|data:|blob:)/i.test(element.src)
  );
  if (local.length === 0) return capture();
  const wanted = new Set(local.map((element) => resourceIdentity(element.src)));
  const files = new Map<string, TFile>();
  for (const file of app.vault.getFiles()) {
    const identity = resourceIdentity(app.vault.getResourcePath(file));
    if (wanted.has(identity)) files.set(identity, file);
  }
  const urls = new Map<string, string>();
  try {
    const loaded = await Promise.allSettled(
      Array.from(files, async ([identity, file]) => ({
        identity,
        file,
        bytes: await app.vault.readBinary(file),
      }))
    );
    for (const result of loaded) {
      if (result.status === 'rejected') {
        
        
        logger.debug(
          '[Journalit] Share capture could not read vault media',
          result.reason
        );
        continue;
      }
      const { identity, file, bytes } = result.value;
      urls.set(
        identity,
        URL.createObjectURL(
          new Blob(
            [bytes],
            file.extension.toLowerCase() === 'svg'
              ? { type: 'image/svg+xml' }
              : {}
          )
        )
      );
    }
    for (const element of local) {
      const identity = resourceIdentity(element.src);
      const url = urls.get(identity);
      if (!url) continue;
      
      
      element.src = url + new URL(element.src).hash;
      if (element.instanceOf(HTMLImageElement)) element.srcset = '';
    }
    return await capture();
  } finally {
    urls.forEach((url) => URL.revokeObjectURL(url));
  }
}
