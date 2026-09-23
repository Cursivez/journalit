import { DEFAULT_SETTINGS, type JournalitSettings } from './types';

export function ensureHomeSettings(settings: JournalitSettings) {
  settings.home ??= {
    ...DEFAULT_SETTINGS.home!,
    layouts: {},
    activeLayout: 'Default',
  };
  return settings.home;
}
