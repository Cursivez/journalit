import type { JournalitSettings } from '../../settings/types';
import type { SessionLogTagDefinition } from '../../types/sessionLog';
import { eventBus } from '../events/EventBus';


export const SESSION_LOG_TAG_COLORS = [
  'blue',
  'indigo',
  'purple',
  'green',
  'pink',
  'amber',
  'red',
  'orange',
] as const;


export const SESSION_LOG_TAG_SHORT_LABEL_MAX_LENGTH = 6;

export type SessionLogTagDraft = Omit<SessionLogTagDefinition, 'id'>;


export function normalizeSessionLogTagDraft(
  draft: SessionLogTagDraft
): SessionLogTagDraft {
  return {
    label: draft.label.trim(),
    shortLabel: draft.shortLabel.trim().toUpperCase(),
    color: draft.color,
    requiresResolution: draft.requiresResolution,
    lessonTag: draft.lessonTag,
  };
}


export function isSessionLogTagDraftComplete(
  draft: SessionLogTagDraft
): boolean {
  return (
    draft.label !== '' &&
    draft.shortLabel !== '' &&
    draft.shortLabel.length <= SESSION_LOG_TAG_SHORT_LABEL_MAX_LENGTH &&
    (SESSION_LOG_TAG_COLORS as readonly string[]).includes(draft.color)
  );
}


export async function persistSessionLogTags(
  plugin: { settings: JournalitSettings; saveSettings(): Promise<void> },
  tags: SessionLogTagDefinition[],
  source: string
): Promise<void> {
  plugin.settings.drc = { ...plugin.settings.drc, sessionLogTags: tags };
  await plugin.saveSettings();
  eventBus.publish('settings:changed', { section: 'drc', source });
}
