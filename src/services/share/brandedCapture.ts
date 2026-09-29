

import { toCanvas } from 'html-to-image';
import { LOGO_DATA_URI } from '../../assets/logoData';
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

const SHARE_CAPTURE_STAGE_CLASS = 'journalit-share-capture-stage';
const BRAND_URL_LABEL = 'journalit.co';


const FRAME_PADDING = 32;
const FOOTER_GAP = 12;
const FOOTER_BOTTOM_PADDING = 20;
const BRAND_MARK_SIZE = 32;
const BRAND_MARK_GAP = 12;
const BRAND_URL_FONT_SIZE = 26;
const MIN_PIXEL_RATIO = 2;





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



const LOGO_MARK_SOURCE = { x: 34, y: 17, size: 138 } as const;

interface ShareTheme {
  background: string;
  text: string;
  fontFamily: string;
}

function readShareTheme(source: HTMLElement): ShareTheme {
  const style = source.win.getComputedStyle(source);
  return {
    background: style.getPropertyValue('--background-primary').trim(),
    text: style.getPropertyValue('--text-normal').trim(),
    fontFamily: style.fontFamily,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load Journalit logo'));
    image.src = src;
  });
}

function get2dContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to prepare share image canvas');
  }
  return context;
}


async function renderTintedMark(
  color: string,
  size: number
): Promise<HTMLCanvasElement> {
  const logo = await loadImage(LOGO_DATA_URI);
  const canvas = createEl('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = get2dContext(canvas);
  context.drawImage(
    logo,
    LOGO_MARK_SOURCE.x,
    LOGO_MARK_SOURCE.y,
    LOGO_MARK_SOURCE.size,
    LOGO_MARK_SOURCE.size,
    0,
    0,
    size,
    size
  );
  context.globalCompositeOperation = 'source-in';
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

async function rasterizeWithoutExcludedParts(
  source: HTMLElement,
  stageHost: HTMLElement,
  pixelRatio: number,
  backgroundColor: string,
  hideDollarAmounts = false
): Promise<HTMLCanvasElement> {
  const clone = source.cloneNode(true);
  if (!clone.instanceOf(HTMLElement)) {
    throw new Error('Unable to clone the element for capture');
  }
  await inlineCloneMedia(source, clone, pixelRatio);
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
  source: HTMLElement,
  stageHost: HTMLElement,
  pixelRatio: number
): Promise<Blob> {
  const theme = readShareTheme(source);
  return canvasToPng(
    await rasterizeWithoutExcludedParts(
      source,
      stageHost,
      boundedPixelRatio(source.offsetWidth, source.offsetHeight, pixelRatio),
      theme.background
    )
  );
}

export async function captureBrandedPng(
  source: HTMLElement,
  stageHost: HTMLElement,
  options: { hideDollarAmounts: boolean }
): Promise<Blob> {
  const theme = readShareTheme(source);
  
  const pixelRatio = boundedPixelRatio(
    source.offsetWidth + FRAME_PADDING * 2,
    source.offsetHeight +
      FRAME_PADDING +
      FOOTER_GAP +
      BRAND_MARK_SIZE +
      FOOTER_BOTTOM_PADDING,
    Math.max(MIN_PIXEL_RATIO, source.win.devicePixelRatio)
  );
  const px = (cssPixels: number) => Math.round(cssPixels * pixelRatio);

  const [content, mark] = await Promise.all([
    rasterizeWithoutExcludedParts(
      source,
      stageHost,
      pixelRatio,
      theme.background,
      options.hideDollarAmounts
    ),
    renderTintedMark(theme.text, px(BRAND_MARK_SIZE)),
  ]);

  const padding = px(FRAME_PADDING);
  const footerTop = padding + content.height + px(FOOTER_GAP);
  const output = createEl('canvas');
  output.width = content.width + padding * 2;
  output.height = footerTop + mark.height + px(FOOTER_BOTTOM_PADDING);

  const context = get2dContext(output);
  context.fillStyle = theme.background;
  context.fillRect(0, 0, output.width, output.height);
  context.drawImage(content, padding, padding);

  
  context.font = `600 ${px(BRAND_URL_FONT_SIZE)}px ${theme.fontFamily}`;
  const urlWidth = context.measureText(BRAND_URL_LABEL).width;
  const markGap = px(BRAND_MARK_GAP);
  const footerLeft = (output.width - (mark.width + markGap + urlWidth)) / 2;
  context.drawImage(mark, footerLeft, footerTop);

  context.fillStyle = theme.text;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(
    BRAND_URL_LABEL,
    footerLeft + mark.width + markGap,
    footerTop + mark.height / 2
  );

  return canvasToPng(output);
}
