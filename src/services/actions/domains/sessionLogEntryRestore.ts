import type { SessionLogEntry } from '../../../types/sessionLog';
import { sessionLogEntrySnapshot } from '../../sessionLog/sessionLogEntries';
import { ActionPlanError } from '../ActionErrors';
import type { ActionInput, ActionSummary } from '../ActionTypes';

type EntryUpdateInput = ActionInput<'review.update_session_log_entry'>;
type EntryFields = EntryUpdateInput['fields'];
type ChangedField =
  ActionSummary<'review.update_session_log_entry'>['changed_fields'][number];


export function restoringEntryUpdate(
  review: EntryUpdateInput['review'],
  previous: SessionLogEntry,
  written: SessionLogEntry,
  changed: readonly ChangedField[],
  apply: (entry: SessionLogEntry, fields: EntryFields) => SessionLogEntry
): EntryUpdateInput | null {
  try {
    const fields: EntryFields = {};
    for (const field of changed) {
      switch (field) {
        case 'time':
          fields.time = previous.timestamp;
          break;
        case 'tag_id':
          fields.tag_id = previous.tagId;
          break;
        case 'text':
          
          if (previous.text.trim() !== previous.text || previous.text === '') {
            return null;
          }
          fields.text = previous.text;
          break;
        case 'resolved':
          fields.resolved = previous.resolved === true;
          break;
      }
    }
    if (Object.keys(fields).length === 0) return null;
    return sessionLogEntrySnapshot(apply(written, fields)) ===
      sessionLogEntrySnapshot(previous)
      ? {
          review: { period: review.period, period_start: review.period_start },
          entry_id: previous.id,
          fields,
        }
      : null;
  } catch (error) {
    
    
    if (error instanceof ActionPlanError) return null;
    console.warn('[Journalit] Could not capture a session log change:', error);
    return null;
  }
}
