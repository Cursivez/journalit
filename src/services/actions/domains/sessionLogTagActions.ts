import type { SessionLogTagDefinition } from '../../../types/sessionLog';
import { generateUUID } from '../../../utils/uuid';
import { t, tPlural } from '../../../lang/helpers';
import {
  SESSION_LOG_TAG_COLORS,
  isSessionLogTagDraftComplete,
  normalizeSessionLogTagDraft,
  type SessionLogTagDraft,
} from '../../sessionLog/sessionLogTagCatalog';
import { sessionLogTagRevision } from '../../agent/configuration/sessionLogTagConfiguration';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionDefinitions,
  type ActionInput,
  type ActionPlanContext,
  type ActionSummary,
} from '../ActionTypes';
import { throwIfAborted } from './tradeActionSupport';

type SessionLogTagActionId =
  | 'session_log_tag.create'
  | 'session_log_tag.update'
  | 'session_log_tag.delete';
type TagFields = ActionInput<'session_log_tag.update'>['fields'];
type ChangedField =
  ActionSummary<'session_log_tag.update'>['changed_fields'][number];

const CHANGED_FIELD_ORDER: readonly ChangedField[] = [
  'label',
  'short_label',
  'color',
  'requires_resolution',
  'lesson',
];

interface SessionLogTagActionDependencies {
  getTags(): readonly SessionLogTagDefinition[];
  saveTags(tags: SessionLogTagDefinition[]): Promise<void>;
  getAlertRuleTagId(): string | undefined;
  
  countTaggedDays(tagId: string): Promise<number>;
}

function draftOf(tag: SessionLogTagDefinition): SessionLogTagDraft {
  return {
    label: tag.label,
    shortLabel: tag.shortLabel,
    color: tag.color,
    requiresResolution: tag.requiresResolution === true,
    lessonTag: tag.lessonTag === true,
  };
}


function withFields(
  draft: SessionLogTagDraft,
  fields: TagFields
): SessionLogTagDraft {
  return normalizeSessionLogTagDraft({
    label: fields.label ?? draft.label,
    shortLabel: fields.short_label ?? draft.shortLabel,
    color: fields.color ?? draft.color,
    requiresResolution: fields.requires_resolution ?? draft.requiresResolution,
    lessonTag: fields.lesson ?? draft.lessonTag,
  });
}

function changedFields(
  before: SessionLogTagDraft,
  after: SessionLogTagDraft
): ChangedField[] {
  const changed: Record<ChangedField, boolean> = {
    label: before.label !== after.label,
    short_label: before.shortLabel !== after.shortLabel,
    color: before.color !== after.color,
    requires_resolution: before.requiresResolution !== after.requiresResolution,
    lesson: before.lessonTag !== after.lessonTag,
  };
  return CHANGED_FIELD_ORDER.filter((field) => changed[field]);
}


function fieldsOf(
  draft: SessionLogTagDraft,
  changed: readonly ChangedField[]
): TagFields | null {
  const fields: TagFields = {};
  for (const field of changed) {
    switch (field) {
      case 'label':
        fields.label = draft.label;
        break;
      case 'short_label':
        fields.short_label = draft.shortLabel;
        break;
      case 'color': {
        const color = SESSION_LOG_TAG_COLORS.find(
          (value) => value === draft.color
        );
        if (color === undefined) return null;
        fields.color = color;
        break;
      }
      case 'requires_resolution':
        fields.requires_resolution = draft.requiresResolution;
        break;
      case 'lesson':
        fields.lesson = draft.lessonTag;
        break;
    }
  }
  return fields;
}


async function restoringUpdate(
  previous: SessionLogTagDefinition,
  written: SessionLogTagDraft,
  revision: string
): Promise<ActionInput<'session_log_tag.update'> | null> {
  try {
    const fields = fieldsOf(
      draftOf(previous),
      changedFields(written, draftOf(previous))
    );
    if (!fields || Object.keys(fields).length === 0) return null;
    const restored = { id: previous.id, ...withFields(written, fields) };
    return (await sessionLogTagRevision(restored)) ===
      (await sessionLogTagRevision(previous))
      ? { tag_id: previous.id, expected_revision: revision, fields }
      : null;
  } catch (error) {
    console.warn('[Journalit] Could not capture a tag change:', error);
    return null;
  }
}


function assertUniqueLabel(
  tags: readonly SessionLogTagDefinition[],
  label: string,
  except: string | undefined,
  field: string
): void {
  const key = label.toLowerCase();
  if (
    tags.some((tag) => tag.id !== except && tag.label.toLowerCase() === key)
  ) {
    throw new ActionPlanError('conflict', field);
  }
}

function fieldLabel(field: ChangedField): string {
  return t(`actions.session-log-tag.field.${field}`);
}


export function createSessionLogTagActions(
  deps: SessionLogTagActionDependencies
): Pick<ActionDefinitions, SessionLogTagActionId> {
  const requireTag = (tagId: string): SessionLogTagDefinition => {
    const tag = deps.getTags().find((candidate) => candidate.id === tagId);
    if (!tag) throw new ActionPlanError('not_found', 'tag_id');
    return tag;
  };

  const create: ActionDefinition<'session_log_tag.create'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      const draft = normalizeSessionLogTagDraft({
        label: input.label,
        shortLabel: input.short_label,
        color: input.color,
        requiresResolution: input.requires_resolution === true,
        lessonTag: input.lesson === true,
      });
      if (!isSessionLogTagDraftComplete(draft)) {
        throw new ActionPlanError('invalid_request', 'label');
      }
      assertUniqueLabel(deps.getTags(), draft.label, undefined, 'label');
      return {
        target: `session_log_tag:new:${draft.label.toLowerCase()}`,
        summary: {
          label: draft.label,
          short_label: draft.shortLabel,
          color: input.color,
        },
        affectedNotes: 0,
        display: {
          target: draft.label,
          changes: [
            t('actions.session-log-tag.create', {
              label: draft.label,
              short: draft.shortLabel,
            }),
          ],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          const tags = deps.getTags();
          try {
            assertUniqueLabel(tags, draft.label, undefined, 'label');
          } catch {
            throw new ActionExecutionError('conflict', false);
          }
          const tag: SessionLogTagDefinition = { id: generateUUID(), ...draft };
          try {
            await deps.saveTags([...tags, tag]);
          } catch {
            throw new ActionExecutionError('write_failed', true);
          }
          return { tag_id: tag.id, revision: await sessionLogTagRevision(tag) };
        },
      };
    },
  };

  const update: ActionDefinition<'session_log_tag.update'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      const tag = requireTag(input.tag_id);
      const baseRevision = await sessionLogTagRevision(tag);
      if (baseRevision !== input.expected_revision) {
        throw new ActionPlanError('conflict', 'expected_revision');
      }
      const before = draftOf(tag);
      const after = withFields(before, input.fields);
      if (!isSessionLogTagDraftComplete(after)) {
        throw new ActionPlanError('invalid_request', 'fields');
      }
      if (input.fields.label !== undefined) {
        assertUniqueLabel(deps.getTags(), after.label, tag.id, 'fields.label');
      }
      const changed = changedFields(before, after);
      return {
        target: `session_log_tag:${tag.id}`,
        summary: {
          tag_id: tag.id,
          base_revision: baseRevision,
          changed_fields: changed,
        },
        affectedNotes: 0,
        display: {
          target: tag.label,
          changes:
            changed.length === 0
              ? []
              : [
                  t('actions.setup.update', {
                    fields: changed.map(fieldLabel).join(', '),
                  }),
                ],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          const tags = deps.getTags();
          const current = tags.find((candidate) => candidate.id === tag.id);
          if (!current) throw new ActionExecutionError('not_found', false);
          if ((await sessionLogTagRevision(current)) !== baseRevision) {
            throw new ActionExecutionError('conflict', false);
          }
          if (changed.length === 0) {
            return new ActionExecution(
              { tag_id: tag.id, revision: baseRevision },
              { restoreInput: 'unchanged' }
            );
          }
          const next: SessionLogTagDefinition = { id: tag.id, ...after };
          try {
            await deps.saveTags(
              tags.map((candidate) =>
                candidate.id === tag.id ? next : candidate
              )
            );
          } catch {
            throw new ActionExecutionError('write_failed', true);
          }
          const revision = await sessionLogTagRevision(next);
          return new ActionExecution(
            { tag_id: tag.id, revision },
            {
              restoreInput:
                context.origin === 'agent'
                  ? await restoringUpdate(current, after, revision)
                  : null,
            }
          );
        },
      };
    },
  };

  const remove: ActionDefinition<'session_log_tag.delete'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      const tag = requireTag(input.tag_id);
      
      
      const [baseRevision, taggedDays] = await Promise.all([
        sessionLogTagRevision(tag),
        deps.countTaggedDays(tag.id),
      ]);
      throwIfAborted(context.signal);
      const usedByAlertRule = deps.getAlertRuleTagId() === tag.id;
      return {
        target: `session_log_tag:${tag.id}`,
        summary: {
          tag_id: tag.id,
          label: tag.label,
          tagged_day_count: taggedDays,
          used_by_alert_rule: usedByAlertRule,
        },
        
        affectedNotes: 0,
        display: {
          target: tag.label,
          changes: [
            taggedDays === 0
              ? t('actions.session-log-tag.delete-unused')
              : tPlural('actions.session-log-tag.delete', taggedDays),
            ...(usedByAlertRule
              ? [t('actions.session-log-tag.delete-alert-rule')]
              : []),
          ],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          const tags = deps.getTags();
          const current = tags.find((candidate) => candidate.id === tag.id);
          if (!current) throw new ActionExecutionError('not_found', false);
          if (
            (await sessionLogTagRevision(current)) !== baseRevision ||
            (deps.getAlertRuleTagId() === tag.id) !== usedByAlertRule
          ) {
            throw new ActionExecutionError('conflict', false);
          }
          try {
            await deps.saveTags(
              tags.filter((candidate) => candidate.id !== tag.id)
            );
          } catch {
            throw new ActionExecutionError('write_failed', true);
          }
          return { tag_id: tag.id };
        },
      };
    },
  };

  return {
    'session_log_tag.create': create,
    'session_log_tag.update': update,
    'session_log_tag.delete': remove,
  };
}
