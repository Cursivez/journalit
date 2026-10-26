import type { SessionLogTagDefinition } from '../../../types/sessionLog';
import {
  SESSION_LOG_TAG_COLORS,
  SESSION_LOG_TAG_SHORT_LABEL_MAX_LENGTH,
} from '../../sessionLog/sessionLogTagCatalog';
import type { AgentToolContracts } from '../protocol';
import { configurationRevision } from './configurationPrimitives';

type Configuration = Extract<
  AgentToolContracts['inspect_configuration']['result'],
  { status: 'ok' }
>['configuration'];
type SessionLogTagsProjection = NonNullable<Configuration['session_log_tags']>;
type WireSessionLogTag = SessionLogTagsProjection['tags'][number];

const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const MAX_TAGS = 100;


export function sessionLogTagRevision(
  tag: SessionLogTagDefinition
): Promise<string> {
  return configurationRevision({
    label: tag.label,
    short_label: tag.shortLabel,
    color: tag.color,
    requires_resolution: tag.requiresResolution === true,
    lesson: tag.lessonTag === true,
  });
}


async function wireSessionLogTag(
  tag: SessionLogTagDefinition
): Promise<WireSessionLogTag | null> {
  const color = SESSION_LOG_TAG_COLORS.find((value) => value === tag.color);
  if (
    !ID_PATTERN.test(tag.id) ||
    tag.label.length < 1 ||
    tag.label.length > 60 ||
    tag.shortLabel.length < 1 ||
    tag.shortLabel.length > SESSION_LOG_TAG_SHORT_LABEL_MAX_LENGTH ||
    tag.shortLabel !== tag.shortLabel.toUpperCase() ||
    color === undefined
  ) {
    return null;
  }
  return {
    tag_id: tag.id,
    label: tag.label,
    short_label: tag.shortLabel,
    color,
    requires_resolution: tag.requiresResolution === true,
    lesson: tag.lessonTag === true,
    revision: await sessionLogTagRevision(tag),
  };
}


export async function projectSessionLogTagConfiguration(
  tags: readonly SessionLogTagDefinition[],
  alertRuleTagId: string | undefined
): Promise<SessionLogTagsProjection> {
  const projected: WireSessionLogTag[] = [];
  const ids = new Set<string>();
  let omitted = 0;
  const wires = await Promise.all(tags.map(wireSessionLogTag));
  for (const original of wires) {
    const wire = projected.length < MAX_TAGS ? original : null;
    if (!wire || ids.has(wire.tag_id)) {
      omitted += 1;
      continue;
    }
    ids.add(wire.tag_id);
    projected.push(wire);
  }
  return {
    tags: projected,
    ...(alertRuleTagId !== undefined && ID_PATTERN.test(alertRuleTagId)
      ? { alert_rule_tag_id: alertRuleTagId }
      : {}),
    omitted_count: omitted,
  };
}
