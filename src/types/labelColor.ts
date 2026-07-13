export type LabelColor = `#${string}`;

const LABEL_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

export const DEFAULT_TAG_PICKER_COLOR: LabelColor = '#808080';
export const DEFAULT_SETUP_PICKER_COLOR: LabelColor = '#2196f3';

export function isLabelColor(value: unknown): value is LabelColor {
  return typeof value === 'string' && LABEL_COLOR_PATTERN.test(value);
}

export function normalizeLabelColor(value: unknown): LabelColor | undefined {
  return isLabelColor(value) ? value : undefined;
}

export function getLabelColorClassName(color?: LabelColor): string {
  return color ? 'journalit-label-color' : '';
}

export function getLabelColorForeground(
  color?: LabelColor
): '#000000' | '#ffffff' | undefined {
  if (!color) return undefined;

  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;
  return luminance >= 128 ? '#000000' : '#ffffff';
}
