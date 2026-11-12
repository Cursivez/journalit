
import { LOGO_DATA_URI } from '../../../../assets/logoData';
import {
  MOTION_CARD_SEAL_DELAY_SECONDS,
  MOTION_CARD_SIZES,
  motionCardHeadlineAlpha,
  motionCardOutcomeAt,
  motionCardTimeline,
  type MotionCardAspect,
  type MotionCardContent,
  type MotionCardOutcomeSlot,
  type MotionCardTone,
} from './motionCardModel';
import type { MotionCardSource } from './motionCardSource';


export interface MotionCardPalette {
  positive: string;
  negative: string;
}

export const MOTION_CARD_PLAIN_PALETTE: MotionCardPalette = {
  positive: '#ffffff',
  negative: '#ffffff',
};

export function readMotionCardPalette(element: Element): MotionCardPalette {
  const style = element.win.getComputedStyle(element);
  return {
    positive: style.getPropertyValue('--journalit-pnl-positive').trim(),
    negative: style.getPropertyValue('--journalit-pnl-negative').trim(),
  };
}

export interface MotionCardScene {
  aspect: MotionCardAspect;
  content: MotionCardContent;
  source: MotionCardSource;
  palette: MotionCardPalette;
  
  dim: number;
  seconds: number;
  fontFamily: string;
  mark: CanvasImageSource | null;
  backgroundSize: { width: number; height: number } | null;
}

const TEXT_COLOR = '#ffffff';
const MUTED_ALPHA = 0.72;
const DIGITS = '0123456789';

const SMALL_DIGIT_SCALE = 0.66;

const ENTER_DISTANCE = 14;
const ROWS_DELAY = 0.2;
const ROW_STAGGER = 0.05;
const BRAND_DELAY = 0.3;

const NOTE_GAP = 58;
const BLOCK_TITLE_SIZE = 48;
const BLOCK_ACCOUNT_SIZE = 30;
const BLOCK_SEAL_RADIUS = 46;

const BLOCK_TEXT_X = 112;
const BLOCK_CLEARANCE = 48;
const BLOCK_MAX_WIDTH: Record<MotionCardAspect, number> = {
  landscape: 560,
  square: 420,
  portrait: Number.POSITIVE_INFINITY,
};
const SEAL_LOBES = 12;
const SEAL_STEPS = 240;

interface Layout {
  margin: number;
  contentWidth: number;
  headerY: number;
  outcomeY: number;
  outcomeSize: number;
  rowsY: number;
  rowStep: number;
  rowSize: number;
  rowsPerLine: number;
  brandY: number;
}

function layoutOf(aspect: MotionCardAspect, width: number): Layout {
  const margin = aspect === 'portrait' ? 96 : 104;
  const y = {
    landscape: { headerY: 720, outcomeY: 900, outcomeSize: 150, brandY: 110 },
    square: { headerY: 640, outcomeY: 810, outcomeSize: 140, brandY: 110 },
    portrait: { headerY: 1180, outcomeY: 1360, outcomeSize: 150, brandY: 260 },
  }[aspect];
  const landscape = aspect === 'landscape';
  return {
    ...y,
    margin,
    contentWidth: width - margin * 2,
    rowsY: y.outcomeY + 76,
    rowStep: 52,
    rowSize: landscape ? 30 : 28,
    rowsPerLine: landscape ? 4 : 2,
  };
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  scene: MotionCardScene,
  frame: CanvasImageSource | null,
  width: number,
  height: number
): void {
  const base = ctx.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, '#15181d');
  base.addColorStop(1, '#07080a');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);
  if (!frame || !scene.backgroundSize) return;

  const source = scene.backgroundSize;
  const scale = Math.max(width / source.width, height / source.height);
  const drawnWidth = source.width * scale;
  const drawnHeight = source.height * scale;
  ctx.drawImage(
    frame,
    (width - drawnWidth) / 2,
    (height - drawnHeight) / 2,
    drawnWidth,
    drawnHeight
  );
  ctx.fillStyle = `rgba(0, 0, 0, ${scene.dim})`;
  ctx.fillRect(0, 0, width, height);
  
  const scrim = ctx.createLinearGradient(0, height, 0, height * 0.35);
  scrim.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  scrim.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = scrim;
  ctx.fillRect(0, 0, width, height);
}

function setFont(
  ctx: CanvasRenderingContext2D,
  weight: number,
  size: number,
  family: string
): void {
  ctx.font = `${weight} ${size}px ${family}`;
}

function widestDigit(ctx: CanvasRenderingContext2D): number {
  return Math.max(...[...DIGITS].map((digit) => ctx.measureText(digit).width));
}


function slotWidths(
  ctx: CanvasRenderingContext2D,
  slots: readonly MotionCardOutcomeSlot[],
  size: number,
  family: string
): number[] {
  const measureAt = (fontSize: number) => {
    setFont(ctx, 700, fontSize, family);
    const digit = widestDigit(ctx);
    return (slot: MotionCardOutcomeSlot) =>
      slot.digitIndex === null ? ctx.measureText(slot.char).width : digit;
  };
  const large = measureAt(size);
  const largeWidths = slots.map((slot) => (slot.small ? 0 : large(slot)));
  const small = measureAt(size * SMALL_DIGIT_SCALE);
  return slots.map((slot, index) =>
    slot.small ? small(slot) : largeWidths[index]
  );
}

function toneColor(tone: MotionCardTone, palette: MotionCardPalette): string {
  return tone === 'plain' ? TEXT_COLOR : palette[tone];
}

interface HeadlineGeometry {
  size: number;
  baseline: number;
  left: number;
}

function headlineGeometry(
  ctx: CanvasRenderingContext2D,
  content: MotionCardContent,
  layout: Layout,
  family: string
): HeadlineGeometry {
  const measured = slotWidths(ctx, content.outcome, layout.outcomeSize, family);
  const total = measured.reduce((sum, width) => sum + width, 0);
  const shrink = Math.min(1, layout.contentWidth / total);
  return {
    size: layout.outcomeSize * shrink,
    baseline: layout.outcomeY,
    left: layout.margin,
  };
}

function drawHeadline(
  ctx: CanvasRenderingContext2D,
  content: MotionCardContent,
  palette: MotionCardPalette,
  layout: Layout,
  family: string,
  numberTime: number
): void {
  const { baseline, left, size } = headlineGeometry(
    ctx,
    content,
    layout,
    family
  );
  const slots = motionCardOutcomeAt(content.outcome, numberTime);
  const widths = slotWidths(ctx, slots, size, family);
  ctx.fillStyle = toneColor(content.tone, palette);
  ctx.globalAlpha = motionCardHeadlineAlpha(numberTime);
  let x = left;
  slots.forEach((slot, index) => {
    setFont(ctx, 700, slot.small ? size * SMALL_DIGIT_SCALE : size, family);
    const width = widths[index];
    const drawnWidth = ctx.measureText(slot.char).width;
    ctx.fillText(
      slot.char,
      slot.digitIndex === null ? x : x + (width - drawnWidth) / 2,
      baseline
    );
    x += width;
  });
}

interface TextPart {
  text: string;
  weight: number;
  size: number;
  alpha: number;
  
  gap: number;
  spacing?: number;
}


function drawLine(
  ctx: CanvasRenderingContext2D,
  parts: readonly TextPart[],
  y: number,
  layout: Layout,
  family: string,
  appear: number
): void {
  const widths = parts.map(({ text, weight, size, spacing }) => {
    setFont(ctx, weight, size, family);
    ctx.letterSpacing = `${spacing ?? 0}px`;
    return ctx.measureText(text).width;
  });
  const total = widths.reduce(
    (sum, width, index) => sum + width + parts[index].gap,
    0
  );
  const fit = Math.min(1, layout.contentWidth / total);
  let x = layout.margin;
  parts.forEach(({ text, weight, size, gap, spacing, alpha }, index) => {
    x += gap * fit;
    setFont(ctx, weight, size * fit, family);
    ctx.letterSpacing = `${(spacing ?? 0) * fit}px`;
    ctx.globalAlpha = appear * alpha;
    ctx.fillText(text, x, y + (1 - appear) * ENTER_DISTANCE);
    x += widths[index] * fit;
  });
  ctx.letterSpacing = '0px';
}

function drawRows(
  ctx: CanvasRenderingContext2D,
  rows: MotionCardContent['rows'],
  layout: Layout,
  family: string,
  enter: (delay: number) => number
): void {
  const { rowSize: size, rowStep, rowsPerLine, rowsY } = layout;
  ctx.fillStyle = TEXT_COLOR;
  for (let start = 0; start < rows.length; start += rowsPerLine) {
    const parts = rows
      .slice(start, start + rowsPerLine)
      .flatMap(({ label, value }, index): TextPart[] => [
        {
          text: label,
          weight: 500,
          size,
          alpha: MUTED_ALPHA,
          gap: index === 0 ? 0 : size * 1.4,
        },
        { text: value, weight: 600, size, alpha: 1, gap: size * 0.5 },
      ]);
    const line = start / rowsPerLine;
    drawLine(
      ctx,
      parts,
      rowsY + rowStep * line,
      layout,
      family,
      enter(ROWS_DELAY + line * ROW_STAGGER)
    );
  }
}

function drawBrand(
  ctx: CanvasRenderingContext2D,
  mark: CanvasImageSource | null,
  { brandY, margin }: Layout,
  width: number,
  family: string,
  appear: number
): void {
  const markSize = 56;
  ctx.fillStyle = TEXT_COLOR;
  ctx.globalAlpha = appear;
  if (mark) {
    ctx.drawImage(mark, margin, brandY - markSize + 12, markSize, markSize);
  }
  setFont(ctx, 700, 34, family);
  ctx.fillText(
    'Journalit', 
    margin + (mark ? markSize + 18 : 0),
    brandY
  );
  setFont(ctx, 500, 30, family);
  ctx.globalAlpha = appear * MUTED_ALPHA;
  ctx.textAlign = 'right';
  ctx.fillText('journalit.co', width - margin, brandY);
  ctx.textAlign = 'left';
}

interface VerifiedBlock {
  left: number;
  middle: number;
  width: number;
  scale: number;
}

function statsEndY(rowCount: number, layout: Layout): number {
  const lines = Math.ceil(rowCount / layout.rowsPerLine);
  return layout.rowsY + layout.rowStep * (lines - 1);
}


function verifiedBlockOf(
  ctx: CanvasRenderingContext2D,
  { account, label }: Extract<MotionCardSource, { kind: 'verified' }>,
  aspect: MotionCardAspect,
  layout: Layout,
  rowCount: number,
  family: string
): VerifiedBlock {
  setFont(ctx, 700, BLOCK_TITLE_SIZE, family);
  const title = ctx.measureText(label).width;
  setFont(ctx, 500, BLOCK_ACCOUNT_SIZE, family);
  const natural =
    BLOCK_TEXT_X + Math.max(title, ctx.measureText(account).width);
  const scale = Math.min(
    1,
    Math.min(BLOCK_MAX_WIDTH[aspect], layout.contentWidth) / natural
  );
  const width = natural * scale;
  const right = layout.margin + layout.contentWidth - width;
  if (aspect === 'landscape') {
    return { left: right, middle: layout.outcomeY - 54, width, scale };
  }
  return aspect === 'square'
    ? { left: right, middle: layout.outcomeY + 90, width, scale }
    : {
        left: layout.margin,
        middle: statsEndY(rowCount, layout) + NOTE_GAP + 24,
        width,
        scale,
      };
}

function drawSeal(ctx: CanvasRenderingContext2D, scale: number): void {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.beginPath();
  for (let step = 0; step <= SEAL_STEPS; step++) {
    const angle = (step / SEAL_STEPS) * Math.PI * 2;
    const reach =
      BLOCK_SEAL_RADIUS * (0.98 + 0.08 * Math.cos(SEAL_LOBES * angle));
    ctx.lineTo(Math.cos(angle) * reach, Math.sin(angle) * reach);
  }
  ctx.closePath();
  ctx.fillStyle = TEXT_COLOR;
  ctx.fill();
  ctx.lineWidth = BLOCK_SEAL_RADIUS * 0.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#07080a';
  ctx.beginPath();
  ctx.moveTo(-BLOCK_SEAL_RADIUS * 0.4, BLOCK_SEAL_RADIUS * 0.02);
  ctx.lineTo(-BLOCK_SEAL_RADIUS * 0.1, BLOCK_SEAL_RADIUS * 0.32);
  ctx.lineTo(BLOCK_SEAL_RADIUS * 0.44, -BLOCK_SEAL_RADIUS * 0.3);
  ctx.stroke();
  ctx.restore();
}

function drawVerifiedBlock(
  ctx: CanvasRenderingContext2D,
  { account, label }: Extract<MotionCardSource, { kind: 'verified' }>,
  { left, middle, scale }: VerifiedBlock,
  family: string,
  appear: number,
  sealScale: number
): void {
  ctx.save();
  ctx.translate(left, middle);
  ctx.scale(scale, scale);
  ctx.fillStyle = TEXT_COLOR;
  ctx.globalAlpha = appear;
  setFont(ctx, 700, BLOCK_TITLE_SIZE, family);
  ctx.fillText(label, BLOCK_TEXT_X, 4);
  setFont(ctx, 500, BLOCK_ACCOUNT_SIZE, family);
  ctx.globalAlpha = appear * MUTED_ALPHA;
  ctx.fillText(account, BLOCK_TEXT_X, 46);
  ctx.globalAlpha = 1;
  if (sealScale > 0) {
    ctx.translate(BLOCK_SEAL_RADIUS, 2);
    drawSeal(ctx, sealScale);
  }
  ctx.restore();
}

export function drawMotionCard(
  ctx: CanvasRenderingContext2D,
  scene: MotionCardScene,
  frame: CanvasImageSource | null,
  time: number
): void {
  const { aspect, content, fontFamily, seconds, source } = scene;
  const { width, height } = MOTION_CARD_SIZES[aspect];
  const pixelScale = ctx.canvas.width / width;
  const layout = layoutOf(aspect, width);
  const { numberTime, enter, sealScale } = motionCardTimeline(time, seconds);

  ctx.save();
  ctx.setTransform(pixelScale, 0, 0, pixelScale, 0, 0);
  drawBackground(ctx, scene, frame, width, height);

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = TEXT_COLOR;
  
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 10 * pixelScale;

  drawLine(
    ctx,
    [
      { text: content.instrument, weight: 700, size: 56, alpha: 1, gap: 0 },
      {
        text: content.subtitle,
        weight: 500,
        size: 30,
        alpha: MUTED_ALPHA,
        gap: 30,
        spacing: 3,
      },
    ],
    layout.headerY,
    layout,
    fontFamily,
    enter(0)
  );

  const block =
    source?.kind === 'verified'
      ? verifiedBlockOf(
          ctx,
          source,
          aspect,
          layout,
          content.rows.length,
          fontFamily
        )
      : null;
  const besideBlock = block
    ? {
        ...layout,
        contentWidth: layout.contentWidth - block.width - BLOCK_CLEARANCE,
      }
    : layout;
  drawHeadline(
    ctx,
    content,
    scene.palette,
    aspect === 'landscape' ? besideBlock : layout,
    fontFamily,
    numberTime
  );
  drawRows(
    ctx,
    content.rows,
    aspect === 'square' ? besideBlock : layout,
    fontFamily,
    enter
  );
  if (source?.kind === 'verified' && block) {
    drawVerifiedBlock(
      ctx,
      source,
      block,
      fontFamily,
      enter(MOTION_CARD_SEAL_DELAY_SECONDS),
      sealScale()
    );
  } else if (source?.kind === 'note') {
    ctx.fillStyle = TEXT_COLOR;
    drawLine(
      ctx,
      [
        {
          text: source.text,
          weight: 500,
          size: layout.rowSize,
          alpha: MUTED_ALPHA,
          gap: 0,
        },
      ],
      statsEndY(content.rows.length, layout) + NOTE_GAP,
      layout,
      fontFamily,
      enter(ROWS_DELAY)
    );
  }
  drawBrand(ctx, scene.mark, layout, width, fontFamily, enter(BRAND_DELAY));
  ctx.restore();
}


export async function loadMotionCardMark(): Promise<HTMLCanvasElement> {
  const image = createEl('img');
  image.src = LOGO_DATA_URI;
  await image.decode();
  const size = 112;
  const canvas = createEl('canvas', { attr: { width: size, height: size } });
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D is not available');
  
  const scale = image.naturalWidth / 747;
  ctx.drawImage(
    image,
    34 * scale,
    17 * scale,
    138 * scale,
    138 * scale,
    0,
    0,
    size,
    size
  );
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  return canvas;
}
