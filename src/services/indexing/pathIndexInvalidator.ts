

import { App, EventRef, TFile } from 'obsidian';

interface PathIndexInvalidatorOptions {
  app: App;
  
  matchesPath: (path: string) => boolean;
  
  onInvalidate: (changedPaths?: readonly string[]) => void;
}


export function registerPathIndexInvalidator({
  app,
  matchesPath,
  onInvalidate,
}: PathIndexInvalidatorOptions): () => void {
  let metadataCacheEventRefs: EventRef[] = [
    app.metadataCache.on('changed', (file) => {
      if (matchesPath(file.path)) {
        onInvalidate([file.path]);
      }
    }),
  ];

  
  
  let initialResolvedEventRef: EventRef | null = null;
  initialResolvedEventRef = app.metadataCache.on('resolved', () => {
    if (!initialResolvedEventRef) return;
    const eventRef = initialResolvedEventRef;
    initialResolvedEventRef = null;
    app.metadataCache.offref(eventRef);
    metadataCacheEventRefs = metadataCacheEventRefs.filter(
      (registeredRef) => registeredRef !== eventRef
    );
    onInvalidate();
  });
  metadataCacheEventRefs.push(initialResolvedEventRef);

  let vaultEventRefs: EventRef[] = [
    app.vault.on('delete', (file) => {
      if (file instanceof TFile && matchesPath(file.path)) {
        onInvalidate([file.path]);
      }
    }),
    app.vault.on('rename', (file, oldPath) => {
      const newPathMatches = file instanceof TFile && matchesPath(file.path);
      if (newPathMatches || matchesPath(oldPath)) {
        onInvalidate([oldPath, file.path]);
      }
    }),
  ];

  return () => {
    for (const eventRef of metadataCacheEventRefs) {
      app.metadataCache.offref(eventRef);
    }
    metadataCacheEventRefs = [];
    initialResolvedEventRef = null;
    for (const eventRef of vaultEventRefs) {
      app.vault.offref(eventRef);
    }
    vaultEventRefs = [];
  };
}
