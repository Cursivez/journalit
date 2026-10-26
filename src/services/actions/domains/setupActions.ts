import { t } from '../../../lang/helpers';
import { describeOptionDelete, describeOptionRename } from './optionActions';
import { isLabelColor } from '../../../types/labelColor';
import type { SetupService } from '../../setup/SetupService';
import type {
  Setup,
  SetupData,
  SetupRule,
  SetupRuleGroup,
} from '../../setup/types';
import {
  SetupLinkError,
  setupRevision,
  type SetupLinkCodec,
  type SetupLinkedNote,
} from '../../agent/setups/setupLinks';
import {
  ActionExecutionError,
  ActionInUseError,
  ActionPlanError,
} from '../ActionErrors';
import {
  SetupChangedError,
  SetupInUseError,
} from '../../setup/setupDeletionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionDefinitions,
  type ActionInput,
  type ActionPlanContext,
  type ActionSummary,
  type TradeNoteContent,
} from '../ActionTypes';
import { restoringSetupUpdate } from './setupRestore';

type SetupActionId =
  | 'setup.create'
  | 'setup.update'
  | 'setup.rename'
  | 'setup.delete';
type SetupFields = NonNullable<ActionInput<'setup.create'>['fields']>;
type ChangedField = ActionSummary<'setup.update'>['changed_fields'][number];
type UpdateFields = ActionInput<'setup.update'>['fields'];


const CHANGED_FIELD_ORDER: readonly ChangedField[] = [
  'status',
  'direction',
  'color',
  'tags',
  'preferred_sessions',
  'preferred_timeframes',
  'preferred_tickers',
  'playbook',
  'rules',
  'linked_notes',
];

interface SetupActionDependencies {
  
  readSetups(): Promise<readonly Setup[]>;
  setupService: Pick<
    SetupService,
    | 'createSetup'
    | 'updateSetup'
    | 'deleteSetup'
    | 'ensureAgentEntityId'
    | 'getSetupsFolderPath'
    | 'getSetupNoteRevision'
  >;
  links: Pick<SetupLinkCodec, 'resolve' | 'describe'>;
  getTagCatalog(): readonly string[];
  
  referencePaths(name: string): readonly string[];
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

function sameList(left: readonly string[], right: readonly string[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function sameName(left: string, right: string): boolean {
  return left.toLowerCase() === right.toLowerCase();
}


function toRuleSet(fields: SetupFields): {
  ruleGroups: SetupRuleGroup[];
  rules: SetupRule[];
} {
  return {
    ruleGroups: (fields.rule_groups ?? []).map((group, order) => ({
      id: group.id,
      name: group.name.trim(),
      order,
    })),
    rules: (fields.rules ?? []).map((rule, order) => ({
      id: `rule_${order}`,
      label: rule.label.trim(),
      ...(rule.description === undefined || rule.description.trim() === ''
        ? {}
        : { description: rule.description.trim() }),
      category: rule.category,
      required: rule.required,
      ...(rule.group_id === undefined ? {} : { groupId: rule.group_id }),
      order,
    })),
  };
}


function ruleSetKey(
  groups: readonly SetupRuleGroup[],
  rules: readonly SetupRule[]
): string {
  const groupIndex = new Map(groups.map((group, index) => [group.id, index]));
  return JSON.stringify([
    groups.map((group) => group.name),
    rules.map((rule) => [
      rule.label,
      rule.description ?? '',
      rule.category,
      rule.required,
      rule.groupId === undefined
        ? null
        : (groupIndex.get(rule.groupId) ?? null),
    ]),
  ]);
}

class SetupPlanner {
  constructor(private readonly deps: SetupActionDependencies) {}

  async readAll(signal: AbortSignal): Promise<readonly Setup[]> {
    const setups = await this.deps.readSetups();
    throwIfAborted(signal);
    return setups;
  }

  async find(setupId: string, signal: AbortSignal): Promise<Setup> {
    const setups = await this.readAll(signal);
    const setup = setups.find(
      (candidate) => candidate.agentEntityId === setupId
    );
    if (!setup) throw new ActionPlanError('not_found', 'setup_id');
    return setup;
  }

  
  tags(requested: readonly string[]): string[] {
    const catalog = this.deps.getTagCatalog();
    return requested.map((tag) => {
      const match = catalog.find((candidate) => sameName(candidate, tag));
      if (match === undefined)
        throw new ActionPlanError('not_found', 'fields.tags');
      return match;
    });
  }

  async links(
    links: readonly SetupLinkedNote[],
    current: Setup | null,
    sourcePath: string,
    signal: AbortSignal
  ): Promise<string[]> {
    try {
      return await this.deps.links.resolve(
        links,
        current,
        sourcePath,
        'fields.linked_notes',
        signal
      );
    } catch (error) {
      throwIfAborted(signal);
      if (error instanceof SetupLinkError)
        throw new ActionPlanError(error.code, error.field);
      throw error;
    }
  }

  
  async current(
    setupId: string,
    revision: string,
    signal: AbortSignal
  ): Promise<Setup> {
    throwIfAborted(signal);
    const setup = (await this.deps.readSetups()).find(
      (candidate) => candidate.agentEntityId === setupId
    );
    if (!setup) throw new ActionExecutionError('not_found', false);
    if ((await setupRevision(setup)) !== revision)
      throw new ActionExecutionError('conflict', false);
    throwIfAborted(signal);
    return setup;
  }

  get service() {
    return this.deps.setupService;
  }

  describeLinks(setup: Setup, signal: AbortSignal): Promise<SetupLinkedNote[]> {
    return this.deps.links.describe(setup, signal);
  }

  referencePaths(name: string): readonly string[] {
    return this.deps.referencePaths(name);
  }
}


async function setupPatch(
  planner: SetupPlanner,
  current: Setup,
  fields: UpdateFields,
  signal: AbortSignal
): Promise<{ patch: Partial<SetupData>; changed: ChangedField[] }> {
  const patch: Partial<SetupData> = {};
  const changed = new Set<ChangedField>();
  if (fields.status !== undefined && fields.status !== current.status) {
    patch.status = fields.status;
    changed.add('status');
  }
  if (fields.direction !== undefined) {
    const next = fields.direction ?? undefined;
    if (next !== current.direction) {
      patch.direction = next;
      changed.add('direction');
    }
  }
  if (fields.color !== undefined) {
    if (fields.color !== null && !isLabelColor(fields.color)) {
      throw new ActionPlanError('invalid_request', 'fields.color');
    }
    const next = fields.color;
    if ((next ?? '').toLowerCase() !== (current.color ?? '').toLowerCase()) {
      patch.color = next;
      changed.add('color');
    }
  }
  if (fields.tags !== undefined) {
    const next = planner.tags(fields.tags);
    if (!sameList(next, current.tags)) {
      patch.tags = next;
      changed.add('tags');
    }
  }
  const preferences = [
    ['preferred_sessions', 'preferredSessions'],
    ['preferred_timeframes', 'preferredTimeframes'],
    ['preferred_tickers', 'preferredTickers'],
  ] as const;
  for (const [field, key] of preferences) {
    const next = fields[field];
    if (next !== undefined && !sameList(next, current[key])) {
      patch[key] = [...next];
      changed.add(field);
    }
  }
  if (
    fields.playbook !== undefined &&
    fields.playbook.trim() !== current.playbookMarkdown.trim()
  ) {
    patch.playbookMarkdown = fields.playbook;
    changed.add('playbook');
  }
  if (fields.rules !== undefined) {
    const next = toRuleSet(fields);
    if (
      ruleSetKey(next.ruleGroups, next.rules) !==
      ruleSetKey(current.ruleGroups, current.rules)
    ) {
      patch.ruleGroups = next.ruleGroups;
      patch.rules = next.rules;
      changed.add('rules');
    }
  }
  if (fields.linked_notes !== undefined) {
    const next = await planner.links(
      fields.linked_notes,
      current,
      current.filePath ?? '',
      signal
    );
    if (!sameList(next, current.linkedNotes)) {
      patch.linkedNotes = next;
      changed.add('linked_notes');
    }
  }
  return {
    patch,
    changed: CHANGED_FIELD_ORDER.filter((field) => changed.has(field)),
  };
}


function withPatch(setup: Setup, patch: Partial<SetupData>): Setup {
  const { color, rules, ...rest } = patch;
  return {
    ...setup,
    ...rest,
    ...(color === undefined ? {} : { color: color ?? undefined }),
    ...(rules === undefined || typeof rules === 'string' ? {} : { rules }),
  };
}


async function createdNote(
  planner: SetupPlanner,
  setupId: string
): Promise<TradeNoteContent | undefined> {
  try {
    const note = await planner.service.getSetupNoteRevision(setupId);
    return { path: note.path, editRevision: note.revision };
  } catch (error) {
    console.warn('[Journalit] Could not capture a created setup:', error);
    return undefined;
  }
}

function target(name: string): string {
  return t('actions.setup.target', { name });
}

function createAction(planner: SetupPlanner): ActionDefinition<'setup.create'> {
  return {
    async plan(input, { signal }: ActionPlanContext) {
      throwIfAborted(signal);
      const name = input.name;
      const fields: SetupFields = input.fields ?? {};
      const setups = await planner.readAll(signal);
      if (setups.some((setup) => sameName(setup.name, name)))
        throw new ActionPlanError('conflict', 'name');
      const sourcePath = `${planner.service.getSetupsFolderPath()}/${name}.md`;
      const linkedNotes = await planner.links(
        fields.linked_notes ?? [],
        null,
        sourcePath,
        signal
      );
      const { ruleGroups, rules } = toRuleSet(fields);
      const data: SetupData = {
        name,
        ...(fields.status === undefined ? {} : { status: fields.status }),
        ...(fields.direction == null ? {} : { direction: fields.direction }),
        ...(isLabelColor(fields.color) ? { color: fields.color } : {}),
        tags: planner.tags(fields.tags ?? []),
        preferredSessions: [...(fields.preferred_sessions ?? [])],
        preferredTimeframes: [...(fields.preferred_timeframes ?? [])],
        preferredTickers: [...(fields.preferred_tickers ?? [])],
        playbookMarkdown: fields.playbook ?? '',
        ruleGroups,
        rules,
        linkedNotes,
      };
      const summary: ActionSummary<'setup.create'> = {
        name,
        status: fields.status ?? 'active',
        rule_count: rules.length,
        linked_note_count: linkedNotes.length,
      };
      return {
        target: `setup:new:${name.toLowerCase()}`,
        summary,
        affectedNotes: 0,
        display: {
          target: target(name),
          changes: [t('actions.configuration.create', { name })],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          const created = await planner.service.createSetup(
            structuredClone(data)
          );
          const setupId = await planner.service.ensureAgentEntityId(created.id);
          const result = {
            setup_id: setupId,
            revision: await setupRevision(created),
          };
          const noteContent = await createdNote(planner, created.id);
          return new ActionExecution(
            result,
            noteContent ? { noteContent } : {}
          );
        },
      };
    },
  };
}

function updateAction(planner: SetupPlanner): ActionDefinition<'setup.update'> {
  return {
    async plan(input, { signal, origin }: ActionPlanContext) {
      throwIfAborted(signal);
      const current = await planner.find(input.setup_id, signal);
      const base = await setupRevision(current);
      if (base !== input.expected_revision)
        throw new ActionPlanError('conflict', 'expected_revision');
      const { patch, changed: changedFields } = await setupPatch(
        planner,
        current,
        input.fields,
        signal
      );
      return {
        target: `setup:${input.setup_id}`,
        ...(current.filePath === undefined
          ? {}
          : { writes: [`note:${current.filePath}`] }),
        summary: {
          setup_id: input.setup_id,
          base_revision: base,
          changed_fields: changedFields,
        },
        affectedNotes: changedFields.length === 0 ? 0 : 1,
        display: {
          target: target(current.name),
          changes:
            changedFields.length === 0
              ? []
              : [
                  t('actions.setup.update', {
                    fields: changedFields
                      .map((field) => t(`actions.setup.field.${field}`))
                      .join(', '),
                  }),
                ],
        },
        execute: async (executionSignal) => {
          if (changedFields.length === 0) {
            return new ActionExecution(
              { setup_id: input.setup_id, revision: base },
              { restoreInput: 'unchanged' }
            );
          }
          const latest = await planner.current(
            input.setup_id,
            base,
            executionSignal
          );
          const updated = await planner.service.updateSetup(
            latest.id,
            structuredClone(patch)
          );
          const revision = await setupRevision(updated);
          const result = { setup_id: input.setup_id, revision };
          if (origin !== 'agent') {
            return new ActionExecution(result, { restoreInput: null });
          }
          return new ActionExecution(result, {
            restoreInput: await restoringSetupUpdate(
              {
                setupId: input.setup_id,
                previous: latest,
                updated,
                revision,
                changed: changedFields,
                signal: executionSignal,
              },
              (setup) => planner.describeLinks(setup, executionSignal),
              async (setup, fields) =>
                withPatch(
                  setup,
                  (await setupPatch(planner, setup, fields, executionSignal))
                    .patch
                )
            ),
          });
        },
      };
    },
  };
}

function renameAction(planner: SetupPlanner): ActionDefinition<'setup.rename'> {
  return {
    async plan(input, { signal }: ActionPlanContext) {
      throwIfAborted(signal);
      const setups = await planner.readAll(signal);
      const current = setups.find(
        (setup) => setup.agentEntityId === input.setup_id
      );
      if (!current) throw new ActionPlanError('not_found', 'setup_id');
      if (input.name === current.name)
        throw new ActionPlanError('invalid_request', 'name');
      if (
        setups.some(
          (setup) => setup !== current && sameName(setup.name, input.name)
        )
      )
        throw new ActionPlanError('conflict', 'name');
      const base = await setupRevision(current);
      const referencePaths = planner.referencePaths(current.name);
      const affected = referencePaths.length;
      return {
        target: `setup:${input.setup_id}`,
        writes: referencePaths.map((path) => `note:${path}`),
        summary: {
          setup_id: input.setup_id,
          source_name: current.name,
          target_name: input.name,
          affected_note_count: affected,
        },
        affectedNotes: affected,
        display: {
          target: target(current.name),
          changes: [describeOptionRename(current.name, input.name, affected)],
        },
        execute: async (executionSignal) => {
          const latest = await planner.current(
            input.setup_id,
            base,
            executionSignal
          );
          const updated = await planner.service.updateSetup(latest.id, {
            name: input.name,
          });
          return {
            setup_id: input.setup_id,
            revision: await setupRevision(updated),
          };
        },
      };
    },
  };
}

function deleteAction(planner: SetupPlanner): ActionDefinition<'setup.delete'> {
  return {
    async plan(input, { signal }: ActionPlanContext) {
      throwIfAborted(signal);
      const current = await planner.find(input.setup_id, signal);
      const base = await setupRevision(current);
      const note = await planner.service.getSetupNoteRevision(current.id);
      throwIfAborted(signal);
      const referencePaths = planner.referencePaths(current.name);
      const affected = referencePaths.length;
      const summary: ActionSummary<'setup.delete'> = {
        setup_id: input.setup_id,
        name: current.name,
        affected_note_count: affected,
      };
      return {
        target: `setup:${input.setup_id}`,
        writes: referencePaths.map((path) => `note:${path}`),
        summary,
        affectedNotes: affected,
        baseContent: { path: note.path, editRevision: note.revision },
        display: {
          target: target(current.name),
          changes: [describeOptionDelete(current.name, affected)],
        },
        execute: async (executionSignal) => {
          const latest = await planner.current(
            input.setup_id,
            base,
            executionSignal
          );
          try {
            
            
            await planner.service.deleteSetup(latest.id, {
              revision: note.revision,
              unreferenced: affected === 0,
            });
          } catch (error) {
            if (error instanceof SetupChangedError)
              throw new ActionExecutionError('conflict', false);
            if (error instanceof SetupInUseError) throw new ActionInUseError();
            throw error;
          }
          return summary;
        },
      };
    },
  };
}


export function createSetupActions(
  deps: SetupActionDependencies
): Pick<ActionDefinitions, SetupActionId> {
  const planner = new SetupPlanner(deps);
  return {
    'setup.create': createAction(planner),
    'setup.update': updateAction(planner),
    'setup.rename': renameAction(planner),
    'setup.delete': deleteAction(planner),
  };
}
