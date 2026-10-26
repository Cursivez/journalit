

import { toCanvas } from 'html-to-image';
import type { App } from 'obsidian';
import { withVaultCaptureMedia } from './vaultCaptureMedia';
import { inlineCloneMedia } from './inlineCloneMedia';
import { inlineSvgPresentation } from './inlineSvgPresentation';

const SHARE_CAPTURE_EXCLUDE_ATTRIBUTE = 'data-journalit-share-exclude';


export const shareCaptureExcludeProps = {
  [SHARE_CAPTURE_EXCLUDE_ATTRIBUTE]: 'true',
} as const;

const SHARE_CAPTURE_UNWRAP_ATTRIBUTE = 'data-journalit-share-unwrap';


export const shareCaptureUnwrapProps = {
  [SHARE_CAPTURE_UNWRAP_ATTRIBUTE]: 'true',
} as const;

const SHARE_EAGER_MEDIA_ATTRIBUTE = 'data-journalit-share-eager-media';


export const shareEagerMediaProps = {
  [SHARE_EAGER_MEDIA_ATTRIBUTE]: 'true',
} as const;


export function isInShareEagerMediaArea(element: Element): boolean {
  return element.closest(`[${SHARE_EAGER_MEDIA_ATTRIBUTE}]`) !== null;
}

const SHARE_HIDE_DOLLARS_ATTRIBUTE = 'data-journalit-share-hide-dollars';


export const shareHideDollarAmountsProps = {
  [SHARE_HIDE_DOLLARS_ATTRIBUTE]: 'true',
} as const;

export function isInShareHideDollarAmountsArea(element: Element): boolean {
  return element.closest(`[${SHARE_HIDE_DOLLARS_ATTRIBUTE}]`) !== null;
}

const SHARE_DOLLAR_AMOUNT_ATTRIBUTE = 'data-journalit-share-dollar-amount';


export const shareDollarAmountProps = {
  [SHARE_DOLLAR_AMOUNT_ATTRIBUTE]: 'true',
} as const;

const SHARE_LOADING_ATTRIBUTE = 'data-journalit-share-loading';


export const shareLoadingProps = {
  [SHARE_LOADING_ATTRIBUTE]: 'true',
} as const;


export function markShareLoadingUntil(
  el: HTMLElement,
  rendering: Promise<unknown>
): void {
  el.setAttribute(SHARE_LOADING_ATTRIBUTE, 'true');
  void rendering
    .catch(() => undefined)
    .then(() => {
      el.win.requestAnimationFrame(() =>
        el.removeAttribute(SHARE_LOADING_ATTRIBUTE)
      );
    });
}

export function hasShareLoadingContent(root: Element): boolean {
  return root.querySelector(`[${SHARE_LOADING_ATTRIBUTE}]`) !== null;
}


export function observeShareLoadingContent(
  root: Element,
  onChange: (loading: boolean) => void
): () => void {
  const report = () => onChange(hasShareLoadingContent(root));
  const observer = new MutationObserver(report);
  observer.observe(root, {
    subtree: true,
    childList: true,
    attributeFilter: [SHARE_LOADING_ATTRIBUTE],
  });
  report();
  return () => observer.disconnect();
}


export function whenShareLoadingSettles(
  root: Element,
  timeoutMs: number
): Promise<void> {
  return new Promise((resolve) => {
    const isSettled = () =>
      root.childElementCount > 0 && !hasShareLoadingContent(root);
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      observer.disconnect();
      window.clearTimeout(timeout);
      resolve();
    };
    const observer = new MutationObserver(() => {
      if (isSettled()) finish();
    });
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributeFilter: [SHARE_LOADING_ATTRIBUTE],
    });
    const timeout = window.setTimeout(finish, timeoutMs);
    if (isSettled()) finish();
  });
}

const SHARE_CAPTURE_STAGE_CLASS = 'journalit-share-capture-stage';





const MAX_CANVAS_AREA = 16_777_216 * 0.99;
const MAX_CANVAS_SIDE = 16_384 * 0.99;


function boundedPixelRatio(
  width: number,
  height: number,
  desired: number
): number {
  return Math.min(
    desired,
    Math.sqrt(MAX_CANVAS_AREA / (width * height)),
    MAX_CANVAS_SIDE / width,
    MAX_CANVAS_SIDE / height
  );
}

interface ShareTheme {
  background: string;
}

function readShareTheme(source: HTMLElement): ShareTheme {
  const style = source.win.getComputedStyle(source);
  return {
    background: style.getPropertyValue('--background-primary').trim(),
  };
}

async function rasterizeWithoutExcludedParts(
  app: App,
  source: HTMLElement,
  stageHost: HTMLElement,
  pixelRatio: number,
  backgroundColor: string,
  hideDollarAmounts = isInShareHideDollarAmountsArea(source)
): Promise<HTMLCanvasElement> {
  const clone = source.cloneNode(true);
  if (!clone.instanceOf(HTMLElement)) {
    throw new Error('Unable to clone the element for capture');
  }
  await withVaultCaptureMedia(app, source, clone, () =>
    inlineCloneMedia(source, clone, pixelRatio)
  );
  clone
    .querySelectorAll(
      hideDollarAmounts
        ? `[${SHARE_CAPTURE_EXCLUDE_ATTRIBUTE}], [${SHARE_DOLLAR_AMOUNT_ATTRIBUTE}]`
        : `[${SHARE_CAPTURE_EXCLUDE_ATTRIBUTE}]`
    )
    .forEach((excluded) => excluded.remove());
  clone
    .querySelectorAll(`[${SHARE_CAPTURE_UNWRAP_ATTRIBUTE}]`)
    .forEach((wrapper) =>
      wrapper.replaceWith(...Array.from(wrapper.childNodes))
    );

  const stage = stageHost.createDiv({
    cls: SHARE_CAPTURE_STAGE_CLASS,
    attr: { 'aria-hidden': 'true', inert: '' },
  });
  try {
    stage.appendChild(clone);
    inlineSvgPresentation(clone);
    return await toCanvas(clone, { pixelRatio, backgroundColor });
  } finally {
    stage.remove();
  }
}

function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Unable to encode share image'));
      }
    }, 'image/png');
  });
}


export async function captureElementPng(
  app: App,
  source: HTMLElement,
  stageHost: HTMLElement,
  pixelRatio: number
): Promise<Blob> {
  const theme = readShareTheme(source);
  return canvasToPng(
    await rasterizeWithoutExcludedParts(
      app,
      source,
      stageHost,
      boundedPixelRatio(source.offsetWidth, source.offsetHeight, pixelRatio),
      theme.background
    )
  );
}
