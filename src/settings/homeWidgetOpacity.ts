import type { JournalitSettings } from './types';

export const DEFAULT_HOME_WIDGET_OPACITY = 50;

export function readHomeWidgetOpacities(
  settings: Pick<JournalitSettings, 'home'>
) {
  return {
    widgetOpacityLight:
      settings.home?.widgetOpacityLight ?? DEFAULT_HOME_WIDGET_OPACITY,
    widgetOpacityDark:
      settings.home?.widgetOpacityDark ?? DEFAULT_HOME_WIDGET_OPACITY,
  };
}


export function normalizeHomeWidgetOpacity(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_HOME_WIDGET_OPACITY;
  }
  return Math.round(Math.min(100, Math.max(0, value)));
}
