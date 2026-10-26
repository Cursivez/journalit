import type { App, TFile } from 'obsidian';


export function isMetadataCacheResolved(app: App): boolean {
  const initialized: unknown = Reflect.get(app.metadataCache, 'initialized');
  const inProgressTaskCount: unknown = Reflect.get(
    app.metadataCache,
    'inProgressTaskCount'
  );
  return (
    initialized === true &&
    (typeof inProgressTaskCount !== 'number' || inProgressTaskCount === 0)
  );
}


export function whenMetadataCacheResolved(
  app: App,
  timeoutMs: number,
  signal: AbortSignal
): Promise<boolean> {
  if (isMetadataCacheResolved(app)) return Promise.resolve(true);

  return new Promise((resolve) => {
    const finish = (resolved: boolean) => {
      window.clearTimeout(timeoutId);
      app.metadataCache.offref(eventRef);
      signal.removeEventListener('abort', onAbort);
      resolve(resolved);
    };
    const onAbort = () => finish(false);
    const eventRef = app.metadataCache.on('resolved', () => finish(true));
    const timeoutId = window.setTimeout(() => finish(false), timeoutMs);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}


export function isMetadataCacheCurrent(app: App, file: TFile): boolean {
  const fileCache: unknown = Reflect.get(app.metadataCache, 'fileCache');
  if (typeof fileCache !== 'object' || fileCache === null) return false;
  const entry: unknown = Reflect.get(fileCache, file.path);
  if (typeof entry !== 'object' || entry === null) return false;
  return (
    Reflect.get(entry, 'mtime') === file.stat.mtime &&
    Reflect.get(entry, 'size') === file.stat.size
  );
}
