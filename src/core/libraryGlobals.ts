

import type { Plugin } from 'obsidian';
import { createContext } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import {
  holdRendersUntilPluginStylesheet,
  stopWaitingForPluginStylesheet,
} from './pluginStylesheet';


const REACT_REDUX_CONTEXT_KEY = Symbol.for('react-redux-context');

interface DocumentListener {
  doc: Document;
  target: Document | HTMLElement;
  type: string;
  listener: EventListenerOrEventListenerObject;
  options: boolean | AddEventListenerOptions | undefined;
}

let documentListeners: DocumentListener[] = [];
const claimedTargets = new WeakSet<EventTarget>();

let claimGeneration = 0;


export function claimLibraryGlobals(plugin: Plugin): void {
  const generation = ++claimGeneration;
  const { workspace } = plugin.app;
  claimWindow(workspace.containerEl.doc);
  workspace.onLayoutReady(() => {
    
    
    if (generation !== claimGeneration) return;
    
    
    
    workspace.iterateAllLeaves((leaf) => {
      claimWindow(leaf.view.containerEl.doc);
    });
    
    
    const settingsContainer = plugin.app.setting?.containerEl;
    if (settingsContainer) claimReactListeners(settingsContainer);
  });
  plugin.registerEvent(
    workspace.on('window-open', (workspaceWindow) => {
      claimWindow(workspaceWindow.doc);
    })
  );
  plugin.registerEvent(
    workspace.on('window-close', (workspaceWindow) => {
      
      documentListeners = documentListeners.filter(
        ({ doc }) => doc !== workspaceWindow.doc
      );
    })
  );
}


export function createWorkspaceRoot(container: HTMLElement): Root {
  claimWindow(container.ownerDocument);
  return holdRendersUntilPluginStylesheet(
    createRoot(container),
    container.ownerDocument
  );
}

function claimWindow(doc: Document): void {
  claimReactListeners(doc.body);
}


function claimReactListeners(portalTarget: HTMLElement): void {
  const doc = portalTarget.ownerDocument;
  const targets = [doc, portalTarget].filter(
    (target) => !claimedTargets.has(target)
  );
  if (targets.length === 0) return;
  for (const target of targets) claimedTargets.add(target);

  const stopObserving = targets.map((target) =>
    observeAddEventListener(doc, target)
  );
  
  const container = doc.body.createDiv();
  try {
    const root = createRoot(container);
    try {
      flushSync(() => {
        root.render(createPortal(null, portalTarget));
      });
    } finally {
      root.unmount();
    }
  } finally {
    container.remove();
    for (const stop of stopObserving) stop();
  }

  if (
    targets.includes(portalTarget) &&
    !documentListeners.some(({ target }) => target === portalTarget)
  ) {
    console.warn(
      'Journalit: React portal listeners were not captured; plugin reloads may leak memory.'
    );
  }
}

function observeAddEventListener(
  doc: Document,
  target: Document | HTMLElement
): () => void {
  const ownAddEventListener = Object.getOwnPropertyDescriptor(
    target,
    'addEventListener'
  );
  target.addEventListener = (
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void => {
    if (listener) {
      documentListeners.push({ doc, target, type, listener, options });
    }
    EventTarget.prototype.addEventListener.call(
      target,
      type,
      listener,
      options
    );
  };
  return () => {
    if (ownAddEventListener) {
      Object.defineProperty(target, 'addEventListener', ownAddEventListener);
    } else {
      Reflect.deleteProperty(target, 'addEventListener');
    }
  };
}

export function releaseLibraryGlobals(): void {
  claimGeneration += 1;
  stopWaitingForPluginStylesheet();

  for (const { target, type, listener, options } of documentListeners) {
    target.removeEventListener(type, listener, options);
  }
  documentListeners = [];

  const reduxContexts: unknown = Reflect.get(window, REACT_REDUX_CONTEXT_KEY);
  if (reduxContexts instanceof Map) {
    reduxContexts.delete(createContext);
  }
}
