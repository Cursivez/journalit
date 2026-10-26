

import type { ReactNode } from 'react';
import type { Root } from 'react-dom/client';

import { getPluginInstance } from '../utils/pluginContext';


const PLUGIN_STYLESHEET_MARKER_SELECTOR = '.journalit-stylesheet-marker';


const MISSING_STYLESHEET_GRACE_MS = 3000;


export function isPluginStylesheetRules(rules: CSSRuleList): boolean {
  const firstRule = rules.item(0);
  
  return (
    firstRule !== null &&
    'selectorText' in firstRule &&
    firstRule.selectorText === PLUGIN_STYLESHEET_MARKER_SELECTOR
  );
}


const appliedDocuments = new WeakSet<Document>();

function isPluginStylesheetApplied(doc: Document): boolean {
  if (appliedDocuments.has(doc)) return true;
  for (const sheet of Array.from(doc.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      
      continue;
    }
    if (isPluginStylesheetRules(rules)) {
      appliedDocuments.add(doc);
      return true;
    }
  }
  return false;
}


function waitForPluginStylesheet(
  doc: Document,
  pluginLoaded: Promise<unknown>,
  signal: AbortSignal
): Promise<boolean> {
  if (signal.aborted) return Promise.resolve(false);
  if (isPluginStylesheetApplied(doc)) return Promise.resolve(true);

  const win = doc.defaultView ?? window;
  return new Promise((resolve) => {
    let settled = false;
    let graceTimer: number | null = null;
    const finish = (rendered: boolean): void => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      if (graceTimer !== null) win.clearTimeout(graceTimer);
      signal.removeEventListener('abort', onAbort);
      resolve(rendered);
    };
    const onAbort = (): void => finish(false);
    
    
    const observer = new MutationObserver(() => {
      if (isPluginStylesheetApplied(doc)) finish(true);
    });
    observer.observe(doc.head, { childList: true });
    signal.addEventListener('abort', onAbort, { once: true });

    const startGracePeriod = (): void => {
      if (settled) return;
      graceTimer = win.setTimeout(() => {
        console.warn(
          '[Journalit] The plugin stylesheet (styles.css) was not applied; rendering without it.'
        );
        finish(true);
      }, MISSING_STYLESHEET_GRACE_MS);
    };
    pluginLoaded.then(startGracePeriod, startGracePeriod);
  });
}


const documentWaits = new WeakMap<Document, Promise<boolean>>();
const pluginUnloaded = new AbortController();


export function stopWaitingForPluginStylesheet(): void {
  pluginUnloaded.abort();
}

function whenPluginStylesheetApplied(doc: Document): Promise<boolean> {
  let wait = documentWaits.get(doc);
  if (!wait) {
    wait = waitForPluginStylesheet(
      doc,
      getPluginInstance()?.whenInitialized() ?? Promise.resolve(),
      pluginUnloaded.signal
    );
    documentWaits.set(doc, wait);
  }
  return wait;
}


export function holdRendersUntilPluginStylesheet(
  root: Root,
  doc: Document
): Root {
  if (isPluginStylesheetApplied(doc)) return root;

  let unmounted = false;
  let applied = false;
  let heldRender: { children: ReactNode } | null = null;
  void whenPluginStylesheetApplied(doc).then((ready) => {
    if (!ready || unmounted) return;
    applied = true;
    if (heldRender) root.render(heldRender.children);
    heldRender = null;
  });

  return {
    render(children: ReactNode): void {
      if (applied) root.render(children);
      else heldRender = { children };
    },
    unmount(): void {
      unmounted = true;
      heldRender = null;
      root.unmount();
    },
  };
}
