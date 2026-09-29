

import { useEffect, useMemo, useState } from 'react';
import type { ClassifiedPreviewTrade } from '../../services/tradeImport/types';
import {
  readWorkbookImages,
  workbookImageMimeType,
} from '../../services/tradeImport/workbookImages';

const NO_URLS: ReadonlyMap<string, string> = new Map();

export function useWorkbookImageUrls(
  file: Blob | null,
  classified: readonly ClassifiedPreviewTrade[]
): ReadonlyMap<string, string> {
  
  const pathsKey = useMemo(() => {
    const paths = new Set<string>();
    for (const item of classified) {
      for (const image of item.preview.embeddedImages ?? []) {
        paths.add(image.path);
      }
    }
    return [...paths].sort().join('\n');
  }, [classified]);
  const [urls, setUrls] = useState<{
    key: string;
    file: Blob | null;
    urls: ReadonlyMap<string, string>;
  }>({ key: '', file: null, urls: NO_URLS });

  useEffect(() => {
    if (!file || !pathsKey) return;
    let cancelled = false;
    const created: string[] = [];
    void readWorkbookImages(file, pathsKey.split('\n'))
      .then((bytesByPath) => {
        if (cancelled) return;
        const next = new Map<string, string>();
        for (const [path, bytes] of bytesByPath) {
          const content = new Uint8Array(bytes.byteLength);
          content.set(bytes);
          const url = URL.createObjectURL(
            new Blob([content], { type: workbookImageMimeType(path) })
          );
          created.push(url);
          next.set(path, url);
        }
        setUrls({ key: pathsKey, file, urls: next });
      })
      .catch((error: unknown) => {
        console.warn('[TradeImport] Could not read workbook images:', error);
      });
    return () => {
      cancelled = true;
      for (const url of created) URL.revokeObjectURL(url);
    };
  }, [file, pathsKey]);

  return urls.key === pathsKey && urls.file === file ? urls.urls : NO_URLS;
}
