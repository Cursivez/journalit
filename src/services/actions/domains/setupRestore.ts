import type { Setup } from '../../setup/types';
import {
  setupRevision,
  type SetupLinkedNote,
} from '../../agent/setups/setupLinks';
import { ActionPlanError } from '../ActionErrors';
import type { ActionInput, ActionSummary } from '../ActionTypes';

type SetupUpdateInput = ActionInput<'setup.update'>;
type UpdateFields = SetupUpdateInput['fields'];
type ChangedField = ActionSummary<'setup.update'>['changed_fields'][number];


async function previousFields(
  previous: Setup,
  changed: readonly ChangedField[],
  describeLinks: (setup: Setup) => Promise<SetupLinkedNote[]>
): Promise<UpdateFields> {
  const fields: UpdateFields = {};
  const linkedNotes = changed.includes('linked_notes')
    ? await describeLinks(previous)
    : undefined;
  for (const field of changed) {
    switch (field) {
      case 'status':
        fields.status = previous.status;
        break;
      
      case 'direction':
        fields.direction = previous.direction ?? null;
        break;
      case 'color':
        fields.color = previous.color ?? null;
        break;
      case 'tags':
        fields.tags = [...previous.tags];
        break;
      case 'preferred_sessions':
        fields.preferred_sessions = [...previous.preferredSessions];
        break;
      case 'preferred_timeframes':
        fields.preferred_timeframes = [...previous.preferredTimeframes];
        break;
      case 'preferred_tickers':
        fields.preferred_tickers = [...previous.preferredTickers];
        break;
      case 'playbook':
        fields.playbook = previous.playbookMarkdown;
        break;
      case 'rules':
        
        fields.rule_groups = previous.ruleGroups.map((group) => ({
          id: group.id,
          name: group.name,
        }));
        fields.rules = previous.rules.map((rule) => ({
          label: rule.label,
          ...(rule.description === undefined
            ? {}
            : { description: rule.description }),
          category: rule.category,
          required: rule.required,
          ...(rule.groupId === undefined ? {} : { group_id: rule.groupId }),
        }));
        break;
      case 'linked_notes':
        fields.linked_notes = linkedNotes;
        break;
    }
  }
  return fields;
}


export async function restoringSetupUpdate(
  capture: {
    setupId: string;
    previous: Setup;
    updated: Setup;
    revision: string;
    changed: readonly ChangedField[];
    signal: AbortSignal;
  },
  describeLinks: (setup: Setup) => Promise<SetupLinkedNote[]>,
  apply: (setup: Setup, fields: UpdateFields) => Promise<Setup>
): Promise<SetupUpdateInput | null> {
  const { previous, updated, revision, changed, signal } = capture;
  try {
    const fields = await previousFields(previous, changed, describeLinks);
    if (Object.keys(fields).length === 0) return null;
    const [restored, expected] = await Promise.all([
      apply(updated, fields).then(setupRevision),
      setupRevision(previous),
    ]);
    return restored === expected
      ? {
          setup_id: capture.setupId,
          expected_revision: revision,
          fields,
        }
      : null;
  } catch (error) {
    
    
    if (!(error instanceof ActionPlanError) && !signal.aborted) {
      console.warn('[Journalit] Could not capture a setup change:', error);
    }
    return null;
  }
}
