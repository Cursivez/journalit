import type { Setup } from '../../setup/types';
import type { AgentToolContracts } from '../protocol';
import type { SetupLinkedNote } from '../setups/setupLinks';
import { isBoundedString } from './configurationPrimitives';

type Result = Extract<
  AgentToolContracts['inspect_configuration']['result'],
  { status: 'ok' }
>;
type Projection = NonNullable<Result['configuration']['setups']>;
type Definition = Projection['definitions'][number];

export class SetupDefinitionProjectionError extends Error {
  constructor(readonly code: 'not_found' | 'conflict' | 'limit_exceeded') {
    super('Setup definitions cannot be safely inspected.');
    this.name = 'SetupDefinitionProjectionError';
  }
}


export interface SetupDefinitionExtras {
  readonly revision: string;
  readonly linkedNotes: readonly SetupLinkedNote[];
}


export function projectSetupDefinitions(
  setups: readonly Setup[],
  setupIds: readonly string[],
  playbookMaxChars: number,
  extrasFor: (setup: Setup) => SetupDefinitionExtras
): Projection {
  const selected = new Set(setupIds);
  const byId = new Map<string, Setup>();
  for (const setup of setups) {
    const id = setup.agentEntityId;
    if (id === undefined || !selected.has(id)) continue;
    if (byId.has(id)) throw new SetupDefinitionProjectionError('conflict');
    byId.set(id, setup);
  }
  const definitions = setupIds.map((id): Definition => {
    const setup = byId.get(id);
    if (setup === undefined)
      throw new SetupDefinitionProjectionError('not_found');
    if (setup.rules.length > 50 || setup.ruleGroups.length > 50) {
      throw new SetupDefinitionProjectionError('limit_exceeded');
    }
    if (
      !isBoundedString(setup.name, 120) ||
      setup.ruleGroups.some((group) => !isBoundedString(group.name, 200)) ||
      setup.rules.some(
        (rule) =>
          !isBoundedString(rule.label, 200) ||
          (rule.description !== undefined &&
            !isBoundedString(rule.description, 1000, true))
      ) ||
      setup.tags.length > 50 ||
      setup.tags.some((tag) => !isBoundedString(tag, 100)) ||
      setup.linkedNotes.length > 100 ||
      [
        setup.preferredSessions,
        setup.preferredTimeframes,
        setup.preferredTickers,
      ].some(
        (values) =>
          values.length > 50 ||
          values.some((value) => !isBoundedString(value, 120))
      )
    )
      throw new SetupDefinitionProjectionError('limit_exceeded');
    
    
    const groupIds = new Set(setup.ruleGroups.map((group) => group.id));
    for (const rule of setup.rules) {
      if (
        (groupIds.size > 0 || rule.groupId !== undefined) &&
        !groupIds.has(rule.groupId ?? '')
      )
        throw new SetupDefinitionProjectionError('conflict');
    }
    const playbook = Array.from(setup.playbookMarkdown);
    const extras = extrasFor(setup);
    return {
      id,
      revision: extras.revision,
      name: setup.name,
      status: setup.status,
      ...(setup.color === undefined ? {} : { color: setup.color }),
      tags: [...setup.tags],
      rule_groups: setup.ruleGroups.map((group) => ({
        id: group.id,
        name: group.name,
        order: group.order,
      })),
      rules: setup.rules.map((rule) => ({
        id: rule.id,
        label: rule.label,
        category: rule.category,
        required: rule.required,
        order: rule.order,
        ...(rule.description === undefined
          ? {}
          : { description: rule.description }),
        ...(rule.groupId === undefined ? {} : { group_id: rule.groupId }),
      })),
      ...(setup.direction === undefined ? {} : { direction: setup.direction }),
      preferred_sessions: [...setup.preferredSessions],
      preferred_timeframes: [...setup.preferredTimeframes],
      preferred_tickers: [...setup.preferredTickers],
      playbook: playbook.slice(0, playbookMaxChars).join(''),
      playbook_truncated: playbook.length > playbookMaxChars,
      linked_notes: extras.linkedNotes.map((link) => structuredClone(link)),
    };
  });
  return { definitions };
}
