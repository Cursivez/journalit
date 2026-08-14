

import { App, EventRef, TFile } from 'obsidian';

interface PathIndexInvalidatorOptions {
  app: App;
  
  matchesPath: (path: string) => boolean;
  
  onInvalidate: () => void;
}


export function registerPathIndexInvalidator({
  app,
  matchesPath,
  onInvalidate,
}: PathIndexInvalidatorOptions): () => void {
  let metadataCacheEventRefs: EventRef[] = [
    app.metadataCache.on('changed', (file) => {
      if (matchesPath(file.path)) {
        onInvalidate();
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
        onInvalidate();
      }
    }),
    app.vault.on('rename', (file, oldPath) => {
      const newPathMatches = file instanceof TFile && matchesPath(file.path);
      if (newPathMatches || matchesPath(oldPath)) {
        onInvalidate();
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
