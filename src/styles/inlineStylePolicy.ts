

import type { CSSProperties } from 'react';

export type CssVarKey = `--${string}`;


export function cssVars(
  vars: Partial<Record<CssVarKey, string | number | null | undefined>>
): CSSProperties {
  const out: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(vars)) {
    if (value === null || value === undefined) continue;
    
    if (!key.startsWith('--')) {
      throw new Error(
        `cssVars() only supports CSS custom properties ("--*"). Invalid key: ${key}`
      );
    }
    out[key] = value;
  }

  return out;
}


export function dndKitStyle(
  transform?: string | null,
  transition?: string | null
): CSSProperties {
  const out: CSSProperties = {};
  if (transform) out.transform = transform;
  if (transition) out.transition = transition;
  return out;
}

const VIRTUAL_ITEM_STYLE_WHITELIST: Array<keyof CSSProperties> = [
  'position',
  'top',
  'left',
  'right',
  'bottom',
  'width',
  'height',
  'transform',
  'zIndex',
  'pointerEvents',
];


export function virtualItemStyle(style?: CSSProperties | null): CSSProperties {
  if (!style) return {};

  const out: Record<string, unknown> = {};
  for (const key of VIRTUAL_ITEM_STYLE_WHITELIST) {
    const value = style[key];
    if (value === null || value === undefined) continue;
    out[key] = value;
  }
  return out;
}
