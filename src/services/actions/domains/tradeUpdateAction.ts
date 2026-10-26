import type { AgentEntityIdentityService } from '../../agent/identity/AgentEntityIdentityService';
import type {
  AgentTradeIdentityRecord,
  AgentTradeIdentityService,
} from '../../agent/identity/AgentTradeIdentityService';
import type { TradeData, TradeService } from '../../trade/TradeService';
import { TradeRevisionConflictError } from '../../trade/core/TradeCommandService';
import {
  TradeNoteConflictError,
  type TradeNoteWriter,
} from '../../trade/TradeNoteWriter';
import { isTradeExecutionOwnedBySync } from '../../agent/trades/tradeExecutionOwnership';
import type { InstrumentCommissionCalculator } from '../../trade/autoCommission';
import { normalizeOptionKey } from '../../../utils/stringNormalization';
import { t, tPlural } from '../../../lang/helpers';
import {
  resolveCustomFieldChanges,
  type CustomFieldCatalog,
  type CustomFieldChange,
} from './tradeCustomFieldValues';
import {
  catalogMistakes,
  catalogTags,
  executionsKey,
  normalizeExtractedTradeData,
  throwIfAborted,
  tradeEditState,
} from './tradeActionSupport';
import {
  applyChanges,
  currentTags,
  fieldValue,
  FIELD_ORDER,
  MAX_TEXT,
  normalizeInput,
  prepareWrite,
  requireResolved,
  textLength,
  thesisValue,
  userNotes,
  type EntityLookup,
  type FieldChanges,
  type FieldName,
  type ResolvedEntities,
  type TradeChanges,
  type TradeUpdateInput,
} from './tradeUpdateChanges';
import { captureRestore } from './tradeUpdateRestore';
import { targetListKey, validateTargetTotals } from './tradePlannedTargets';
import {
  normalizeUserOwnedTradeNotes,
  replaceUserOwnedTradeNotes,
} from '../../trade/core/TradeNoteDocumentCodec';
import {
  TradeJournalPartialWriteError,
  type TradeJournalEntryEdit,
} from '../../trade/TradeService';
import { formatActionMoney } from './actionDisplayFormat';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionPlan,
  type ActionPlanContext,
  type ActionSummary,
} from '../ActionTypes';

type TradeUpdateSummary = ActionSummary<'trade.update'>;

const MANUAL_ONLY_FIELDS: readonly FieldName[] = [
  'direct_pnl',
  'commission',
  'fees',
  'swap',
];

interface TradeUpdateActionDependencies {
  tradeIdentityService: Pick<
    AgentTradeIdentityService,
    'listTradeIdentitiesStrict'
  >;
  entityIdentityService: Pick<
    AgentEntityIdentityService,
    | 'resolveAccountId'
    | 'resolveSetupId'
    | 'getOrCreateAccountId'
    | 'getOrCreateSetupIds'
  >;
  tradeService: Pick<
    TradeService,
    | 'getTradeData'
    | 'getCurrentTradeMutationRevision'
    | 'getTradeEditRevision'
    | 'extractTradeDataFromDisk'
    | 'createTradeCommitEventBatch'
    | 'readTradeContent'
    | 'updateTradeJournalEntry'
  >;
  writer: Pick<TradeNoteWriter, 'update'>;
  getAvailableTags: () => readonly string[];
  getAvailableMistakes: () => readonly string[];
  
  customFields: CustomFieldCatalog & {
    addFieldOption(fieldId: string, option: string): Promise<boolean>;
  };
  
  calculateCommission?: InstrumentCommissionCalculator;
}


function effectiveJournalEdit(
  changes: TradeChanges,
  current: TradeData,
  currentNotes: string | undefined,
  reviewedAt: string
): TradeJournalEntryEdit {
  const { thesis, reviewed, notes } = changes.journal;
  const edit: TradeJournalEntryEdit = {};
  if (thesis !== undefined && thesis !== thesisValue(current)) {
    
    edit.thesis = thesis ?? '';
  }
  if (reviewed !== undefined && reviewed !== (current.reviewed === true)) {
    edit.reviewed = { reviewed, reviewedAt };
  }
  if (
    notes !== undefined &&
    normalizeUserOwnedTradeNotes(notes) !== currentNotes
  ) {
    edit.notes = notes;
  }
  return edit;
}

function hasJournalEdit(edit: TradeJournalEntryEdit): boolean {
  return (
    edit.thesis !== undefined ||
    edit.reviewed !== undefined ||
    edit.notes !== undefined
  );
}


function effectiveSummary(
  tradeId: string,
  baseRevision: number,
  changes: TradeChanges,
  input: TradeUpdateInput,
  current: TradeData,
  next: TradeData,
  journal: TradeJournalEntryEdit
): TradeUpdateSummary {
  const executions = input.executions;
  const set: FieldChanges = {};
  if (journal.thesis !== undefined) {
    set.thesis = journal.thesis === '' ? null : journal.thesis;
  }
  if (journal.reviewed !== undefined) set.reviewed = journal.reviewed.reviewed;
  if (journal.notes !== undefined) set.notes = journal.notes;
  for (const field of FIELD_ORDER) {
    const value = changes.set[field];
    if (value === undefined) continue;
    if (
      JSON.stringify(fieldValue(current, field)) !==
      JSON.stringify(fieldValue(next, field))
    ) {
      Object.assign(set, { [field]: value });
    }
  }
  const before = new Set(currentTags(current).map((tag) => tag.toLowerCase()));
  const after = new Set(currentTags(next).map((tag) => tag.toLowerCase()));
  const addTags = changes.addTags.filter(
    (tag) => !before.has(tag.toLowerCase()) && after.has(tag.toLowerCase())
  );
  const removeTags = changes.removeTags.filter(
    (tag) => before.has(tag.toLowerCase()) && !after.has(tag.toLowerCase())
  );
  const mistakesBefore = new Set(
    (current.mistake ?? []).map(normalizeOptionKey)
  );
  const mistakesAfter = new Set((next.mistake ?? []).map(normalizeOptionKey));
  const addMistakes = changes.addMistakes.filter(
    (label) =>
      !mistakesBefore.has(normalizeOptionKey(label)) &&
      mistakesAfter.has(normalizeOptionKey(label))
  );
  const removeMistakes = changes.removeMistakes.filter(
    (label) =>
      mistakesBefore.has(normalizeOptionKey(label)) &&
      !mistakesAfter.has(normalizeOptionKey(label))
  );
  const summary: TradeUpdateSummary = {
    trade_id: tradeId,
    base_revision: baseRevision,
    effective: false,
  };
  if (Object.keys(set).length > 0) summary.set = set;
  if (
    input.stop_losses !== undefined &&
    targetListKey(current.stopLosses) !== targetListKey(next.stopLosses)
  ) {
    summary.stop_losses = structuredClone(input.stop_losses);
  }
  if (
    input.take_profits !== undefined &&
    targetListKey(current.takeProfits) !== targetListKey(next.takeProfits)
  ) {
    summary.take_profits = structuredClone(input.take_profits);
  }
  if (
    executions !== undefined &&
    executionsKey(current.entries, current.exits) !==
      executionsKey(next.entries, next.exits)
  ) {
    summary.executions = structuredClone(executions);
  }
  
  const customFields = (input.custom_fields ?? []).filter((change, index) => {
    const id = changes.customFields[index].field.id;
    return (
      JSON.stringify(current.customFields?.[id] ?? null) !==
      JSON.stringify(next.customFields?.[id] ?? null)
    );
  });
  if (customFields.length > 0) summary.custom_fields = customFields;
  if (addTags.length > 0) summary.add_tags = addTags;
  if (removeTags.length > 0) summary.remove_tags = removeTags;
  if (addMistakes.length > 0) summary.add_mistakes = addMistakes;
  if (removeMistakes.length > 0) summary.remove_mistakes = removeMistakes;
  summary.effective =
    summary.set !== undefined ||
    summary.stop_losses !== undefined ||
    summary.take_profits !== undefined ||
    summary.executions !== undefined ||
    summary.custom_fields !== undefined ||
    summary.add_tags !== undefined ||
    summary.remove_tags !== undefined ||
    summary.add_mistakes !== undefined ||
    summary.remove_mistakes !== undefined;
  return summary;
}


const MONEY_FIELDS = new Set<string>([
  'risk_amount',
  'direct_pnl',
  'commission',
  'fees',
  'swap',
]);

function displayValue(
  field: string,
  value: string | number | null,
  currency: string | undefined
): string {
  if (value === null) return t('actions.value.cleared');
  if (typeof value === 'number' && currency && MONEY_FIELDS.has(field))
    return formatActionMoney(value, currency);
  return String(value);
}

function describeChanges(
  summary: TradeUpdateSummary,
  entities: ResolvedEntities,
  customFieldLabels: ReadonlyMap<string, string>,
  currency: string | undefined
): string[] {
  const lines: string[] = [];
  const set = summary.set ?? {};
  if (set.thesis !== undefined) {
    lines.push(
      t(
        set.thesis === null
          ? 'actions.trade.thesis.clear'
          : 'actions.trade.thesis.set'
      )
    );
  }
  if (set.reviewed !== undefined) {
    lines.push(
      t(
        set.reviewed
          ? 'actions.trade.reviewed.mark'
          : 'actions.trade.reviewed.unmark'
      )
    );
  }
  if (set.notes !== undefined) lines.push(t('actions.trade.notes.set'));
  for (const field of FIELD_ORDER) {
    const value = set[field];
    if (value === undefined) continue;
    const shown =
      field === 'account_id' && value !== null
        ? (entities.account ?? value)
        : field === 'setup_id' && value !== null
          ? (entities.setup ?? value)
          : value;
    lines.push(
      t(`actions.trade.set.${field}`, {
        value: displayValue(field, shown, currency),
      })
    );
  }
  const targets = (
    list: TradeUpdateSummary['stop_losses'],
    key: 'actions.trade.stop-losses' | 'actions.trade.take-profits',
    clearKey:
      | 'actions.trade.stop-losses.clear'
      | 'actions.trade.take-profits.clear'
  ) => {
    if (list === undefined) return;
    if (list.length === 0) {
      lines.push(t(clearKey));
      return;
    }
    const value = list
      .map((target) =>
        target.close_percent !== undefined
          ? `${target.price} (${target.close_percent}%)`
          : target.size !== undefined
            ? `${target.price} (${target.size})`
            : String(target.price)
      )
      .join(', ');
    lines.push(t(key, { value }));
  };
  targets(
    summary.stop_losses,
    'actions.trade.stop-losses',
    'actions.trade.stop-losses.clear'
  );
  targets(
    summary.take_profits,
    'actions.trade.take-profits',
    'actions.trade.take-profits.clear'
  );
  if (summary.custom_fields) {
    const labels = summary.custom_fields.map(
      (change) => customFieldLabels.get(change.field_id) ?? change.field_id
    );
    lines.push(t('actions.trade.custom-fields', { labels: labels.join(', ') }));
  }
  if (summary.executions) {
    lines.push(
      t('actions.trade.executions', {
        entries: tPlural(
          'actions.trade.entries',
          summary.executions.entries.length
        ),
        exits: tPlural('actions.trade.exits', summary.executions.exits.length),
      })
    );
  }
  const labels = (values: readonly string[] | undefined): string | undefined =>
    values && values.length > 0 ? values.join(', ') : undefined;
  const addTags = labels(summary.add_tags);
  if (addTags) lines.push(t('actions.trade.add-tags', { labels: addTags }));
  const removeTags = labels(summary.remove_tags);
  if (removeTags) {
    lines.push(t('actions.trade.remove-tags', { labels: removeTags }));
  }
  const addMistakes = labels(summary.add_mistakes);
  if (addMistakes) {
    lines.push(t('actions.trade.add-mistakes', { labels: addMistakes }));
  }
  const removeMistakes = labels(summary.remove_mistakes);
  if (removeMistakes) {
    lines.push(t('actions.trade.remove-mistakes', { labels: removeMistakes }));
  }
  return lines;
}


export class TradeUpdateAction implements ActionDefinition<'trade.update'> {
  constructor(private readonly deps: TradeUpdateActionDependencies) {}

  async plan(
    input: TradeUpdateInput,
    context: ActionPlanContext
  ): Promise<ActionPlan<'trade.update'>> {
    const { signal } = context;
    throwIfAborted(signal);
    const changes = this.resolveChanges(input);

    const record = await this.resolveTrade(input.trade_id, signal);
    if (!record) throw new ActionPlanError('not_found', 'trade_id');
    if (
      changes.set.missed_reason !== undefined &&
      record.tradeType !== 'missed'
    ) {
      throw new ActionPlanError('unsupported_capability', 'set.missed_reason');
    }
    if (
      changes.set.take_profit !== undefined &&
      record.tradeType !== 'regular'
    ) {
      
      throw new ActionPlanError('unsupported_capability', 'set.take_profit');
    }
    if (changes.takeProfits !== undefined && record.tradeType !== 'regular') {
      throw new ActionPlanError('unsupported_capability', 'take_profits');
    }
    const lookup = await this.resolveEntities(changes, signal);
    if (lookup.account === null) {
      throw new ActionPlanError('not_found', 'set.account_id');
    }
    if (lookup.setup === null) {
      throw new ActionPlanError('not_found', 'set.setup_id');
    }
    const entities: ResolvedEntities = {
      account: lookup.account,
      setup: lookup.setup,
    };
    if (changes.set.take_profit !== undefined) {
      await this.validateSingleTakeProfit(record, signal);
    }

    const revision =
      await this.deps.tradeService.getCurrentTradeMutationRevision(
        record.file.path
      );
    throwIfAborted(signal);
    const current = await this.readTrade(record, signal);
    if (!current) throw new ActionPlanError('not_found', 'trade_id');
    if (
      changes.set.stop_loss !== undefined &&
      (current.stopLosses?.length ?? 0) > 1
    ) {
      throw new ActionPlanError('unsupported_capability', 'set.stop_loss');
    }
    if (isTradeExecutionOwnedBySync(current)) {
      if (changes.executions)
        throw new ActionPlanError('unsupported_capability', 'executions');
      const owned = MANUAL_ONLY_FIELDS.find(
        (field) => changes.set[field] !== undefined
      );
      if (owned)
        throw new ActionPlanError('unsupported_capability', `set.${owned}`);
    }
    const applied = applyChanges(
      current,
      changes,
      entities,
      this.deps.calculateCommission
    );
    if (!applied)
      throw new ActionPlanError('unsupported_capability', 'set.take_profit');
    const next = prepareWrite(applied, changes, record.tradeType, current);
    if (!next) {
      throw new ActionPlanError(
        'invalid_request',
        changes.executions ? 'executions' : 'set.direct_pnl'
      );
    }
    const brokenTotal = validateTargetTotals(next, {
      stopLosses: changes.stopLosses !== undefined,
      takeProfits: changes.takeProfits !== undefined,
    });
    if (brokenTotal) throw new ActionPlanError('invalid_request', brokenTotal);
    const currentNotes = await this.readNotesForEdit(
      record,
      changes.journal.notes,
      signal
    );
    const fieldsSummary = effectiveSummary(
      record.tradeId,
      revision.tradeRevision,
      changes,
      input,
      current,
      next,
      {}
    );
    const summary = effectiveSummary(
      record.tradeId,
      revision.tradeRevision,
      changes,
      input,
      current,
      next,
      effectiveJournalEdit(changes, current, currentNotes, '')
    );

    return {
      target: `trade:${record.tradeId}`,
      writes: [`note:${record.file.path}`],
      dependsOn: changes.customFields.map(
        (change) => `custom_field:${change.field.id}`
      ),
      summary,
      affectedNotes: summary.effective ? 1 : 0,
      display: {
        target: record.file.basename,
        changes: describeChanges(
          summary,
          entities,
          new Map(
            changes.customFields.map((change) => [
              change.field.id,
              change.field.label,
            ])
          ),
          next.currency
        ),
      },
      baseContent:
        context.origin === 'ui'
          ? await tradeEditState(
              this.deps.tradeService,
              record.file.path,
              revision.contentRevision
            )
          : undefined,
      execute: (executionSignal) =>
        this.execute({
          record,
          changes,
          wireCustomFields: input.custom_fields ?? [],
          revision,
          effective: summary.effective,
          fieldsEffective: fieldsSummary.effective,
          origin: context.origin,
          signal: executionSignal,
        }),
    };
  }

  private resolveChanges(input: TradeUpdateInput): TradeChanges {
    return {
      ...this.canonicalizeAddedTags(
        this.canonicalizeAddedMistakes(normalizeInput(input))
      ),
      customFields: resolveCustomFieldChanges(
        input.custom_fields ?? [],
        this.deps.customFields,
        'custom_fields'
      ),
    };
  }

  private async execute(frozen: {
    record: AgentTradeIdentityRecord;
    changes: TradeChanges;
    wireCustomFields: NonNullable<TradeUpdateInput['custom_fields']>;
    revision: { tradeRevision: number; contentRevision: string };
    effective: boolean;
    
    fieldsEffective: boolean;
    origin: ActionPlanContext['origin'];
    signal: AbortSignal;
  }): Promise<ActionExecution<'trade.update'>> {
    const { record, changes, revision, signal } = frozen;
    throwIfAborted(signal);
    const resolved = await this.resolveTrade(record.tradeId, signal);
    if (!resolved || resolved.file.path !== record.file.path) {
      throw new ActionExecutionError('not_found', false);
    }
    if (resolved.tradeType !== record.tradeType) {
      throw new ActionExecutionError('conflict', false);
    }
    if (!frozen.effective) {
      
      const current =
        await this.deps.tradeService.getCurrentTradeMutationRevision(
          record.file.path
        );
      if (
        current.tradeRevision !== revision.tradeRevision ||
        current.contentRevision !== revision.contentRevision
      ) {
        throw new ActionExecutionError('conflict', false);
      }
      return new ActionExecution(
        { trade_id: record.tradeId, trade_revision: revision.tradeRevision },
        { restoreInput: 'unchanged' }
      );
    }
    const entities = requireResolved(
      await this.resolveEntities(changes, signal)
    );
    if (!entities) throw new ActionExecutionError('not_found', false);
    let current: TradeData | null;
    try {
      current = await this.readTrade(record, signal);
    } catch {
      throwIfAborted(signal);
      throw new ActionExecutionError('internal_error', true);
    }
    if (!current) throw new ActionExecutionError('not_found', false);
    const applied = applyChanges(
      current,
      changes,
      entities,
      this.deps.calculateCommission
    );
    if (!applied)
      throw new ActionExecutionError('unsupported_operation', false);
    
    const next = prepareWrite(applied, changes, record.tradeType, current);
    if (!next) throw new ActionExecutionError('conflict', false);
    let previousContent: string | undefined;
    if (changes.journal.notes !== undefined) {
      try {
        previousContent = await this.deps.tradeService.readTradeContent(
          record.file
        );
      } catch {
        throwIfAborted(signal);
        throw new ActionExecutionError('internal_error', true);
      }
      throwIfAborted(signal);
    }
    const journal = effectiveJournalEdit(
      changes,
      current,
      previousContent === undefined ? undefined : userNotes(previousContent),
      new Date().toISOString()
    );
    
    
    
    const latest = await this.deps.tradeService.getCurrentTradeMutationRevision(
      record.file.path
    );
    throwIfAborted(signal);
    if (
      latest.tradeRevision !== revision.tradeRevision ||
      latest.contentRevision !== revision.contentRevision
    ) {
      throw new ActionExecutionError('conflict', false);
    }
    if (!frozen.fieldsEffective && !hasJournalEdit(journal)) {
      
      throw new ActionExecutionError('conflict', false);
    }
    await this.addCreatedOptions(frozen.wireCustomFields, changes);
    throwIfAborted(signal);

    let receipt: { path: string; revision: number } = {
      path: record.file.path,
      revision: revision.tradeRevision,
    };
    const journaled = hasJournalEdit(journal);
    
    
    
    let fieldsBase = { previous: current, next, expected: revision };
    if (journaled) {
      const written = await this.writeJournal(record, journal, revision);
      receipt = { path: record.file.path, revision: written.tradeRevision };
      if (frozen.fieldsEffective) {
        fieldsBase = await this.afterJournal(
          record,
          changes,
          entities,
          written,
          signal
        );
      }
    }
    if (frozen.fieldsEffective) {
      receipt = await this.writeTradeFields(
        record,
        fieldsBase,
        frozen.origin,
        journaled
      );
    }
    const result = {
      trade_id: record.tradeId,
      trade_revision: receipt.revision,
    };
    
    if (frozen.origin !== 'agent') {
      return new ActionExecution(result, { restoreInput: null });
    }
    return new ActionExecution(
      result,
      await this.captureUndo(
        record,
        receipt,
        { trade: current, content: previousContent },
        changes,
        signal
      )
    );
  }

  
  private async afterJournal(
    record: AgentTradeIdentityRecord,
    changes: TradeChanges,
    entities: ResolvedEntities,
    expected: { tradeRevision: number; contentRevision: string },
    signal: AbortSignal
  ): Promise<{
    previous: TradeData;
    next: TradeData;
    expected: { tradeRevision: number; contentRevision: string };
  }> {
    let previous: TradeData | null;
    try {
      previous = await this.readTrade(record, signal);
    } catch {
      throwIfAborted(signal);
      previous = null;
    }
    const applied =
      previous &&
      applyChanges(previous, changes, entities, this.deps.calculateCommission);
    const next =
      previous &&
      applied &&
      prepareWrite(applied, changes, record.tradeType, previous);
    if (!previous || !next) {
      throw new ActionExecutionError('outcome_unknown', false);
    }
    return { previous, next, expected };
  }

  
  private async writeTradeFields(
    record: AgentTradeIdentityRecord,
    base: {
      previous: TradeData;
      next: TradeData;
      expected: { tradeRevision: number; contentRevision: string };
    },
    origin: ActionPlanContext['origin'],
    afterJournalWrite: boolean
  ): Promise<{ path: string; revision: number }> {
    const commitEventBatch =
      this.deps.tradeService.createTradeCommitEventBatch();
    try {
      return await this.deps.writer.update({
        path: record.file.path,
        previous: base.previous,
        next: base.next,
        sourceType: record.tradeType,
        type: record.tradeType,
        expected: base.expected,
        source: origin,
        commitEventBatch,
      });
    } catch (error) {
      if (afterJournalWrite) {
        throw new ActionExecutionError('outcome_unknown', false);
      }
      if (
        error instanceof TradeRevisionConflictError ||
        error instanceof TradeNoteConflictError
      ) {
        throw new ActionExecutionError('conflict', false);
      }
      throw new ActionExecutionError('write_failed', true);
    } finally {
      commitEventBatch.flush();
    }
  }

  
  private async writeJournal(
    record: AgentTradeIdentityRecord,
    journal: TradeJournalEntryEdit,
    expected: { tradeRevision: number; contentRevision: string }
  ): Promise<{ tradeRevision: number; contentRevision: string }> {
    try {
      return await this.deps.tradeService.updateTradeJournalEntry(
        record.file.path,
        journal,
        expected
      );
    } catch (error) {
      if (error instanceof TradeJournalPartialWriteError) {
        throw new ActionExecutionError('outcome_unknown', false);
      }
      if (error instanceof TradeRevisionConflictError) {
        throw new ActionExecutionError('conflict', false);
      }
      throw new ActionExecutionError('write_failed', true);
    }
  }

  
  private async readNotesForEdit(
    record: AgentTradeIdentityRecord,
    notes: string | undefined,
    signal: AbortSignal
  ): Promise<string | undefined> {
    if (notes === undefined) return undefined;
    const content = await this.deps.tradeService.readTradeContent(record.file);
    throwIfAborted(signal);
    
    
    if (textLength(userNotes(content)) > MAX_TEXT) {
      throw new ActionPlanError('unsupported_capability', 'set.notes');
    }
    if (replaceUserOwnedTradeNotes(content, notes) === null) {
      throw new ActionPlanError(
        replaceUserOwnedTradeNotes(content, '') === null
          ? 'unsupported_capability'
          : 'invalid_request',
        'set.notes'
      );
    }
    return userNotes(content);
  }

  
  private async captureUndo(
    record: AgentTradeIdentityRecord,
    receipt: { path: string; revision: number },
    previous: { trade: TradeData; content?: string },
    requested: TradeChanges,
    signal: AbortSignal
  ): Promise<ActionExecution<'trade.update'>['undo']> {
    const { tradeService } = this.deps;
    try {
      
      
      
      const edit = await tradeService.getTradeEditRevision(receipt.path);
      const after = await tradeService.getCurrentTradeMutationRevision(
        receipt.path
      );
      if (after.tradeRevision !== receipt.revision) {
        return { restoreInput: null };
      }
      const tradeContent = {
        path: receipt.path,
        editRevision: edit.editRevision,
      };
      if (receipt.path !== record.file.path) {
        return { restoreInput: null, tradeContent };
      }
      const written = await this.readTrade(record, signal);
      const writtenContent =
        previous.content === undefined
          ? undefined
          : await tradeService.readTradeContent(record.file);
      const reread = await tradeService.getTradeEditRevision(receipt.path);
      if (!written || reread.editRevision !== edit.editRevision) {
        return { restoreInput: null };
      }
      const restoreInput = await captureRestore(
        {
          entityIdentityService: this.deps.entityIdentityService,
          resolveChanges: (input) => this.resolveChanges(input),
          resolveEntities: (changes, entitySignal) =>
            this.resolveEntities(changes, entitySignal),
          calculateCommission: this.deps.calculateCommission,
        },
        {
          tradeId: record.tradeId,
          requested,
          previous: previous.trade,
          written,
          notes:
            previous.content === undefined || writtenContent === undefined
              ? undefined
              : { previous: previous.content, written: writtenContent },
          signal,
        }
      );
      return { restoreInput, tradeContent };
    } catch (error) {
      if (!signal.aborted) {
        console.warn('[Journalit] Could not capture a trade change:', error);
      }
      return { restoreInput: null };
    }
  }

  private async resolveTrade(
    tradeId: string,
    signal: AbortSignal
  ): Promise<AgentTradeIdentityRecord | undefined> {
    const catalog =
      await this.deps.tradeIdentityService.listTradeIdentitiesStrict();
    throwIfAborted(signal);
    return catalog.find((record) => record.tradeId === tradeId);
  }

  private async readTrade(
    record: AgentTradeIdentityRecord,
    signal: AbortSignal
  ): Promise<TradeData | null> {
    const data = normalizeExtractedTradeData(
      await this.deps.tradeService.extractTradeDataFromDisk(record.file)
    );
    throwIfAborted(signal);
    return data;
  }

  
  private async resolveEntities(
    changes: TradeChanges,
    signal: AbortSignal
  ): Promise<EntityLookup> {
    const accountId = changes.set.account_id;
    const setupId = changes.set.setup_id;
    let account: string | null | undefined;
    let setup: string | null | undefined;
    if (accountId !== undefined && accountId !== null) {
      account =
        await this.deps.entityIdentityService.resolveAccountId(accountId);
      throwIfAborted(signal);
    }
    if (setupId !== undefined && setupId !== null) {
      setup = await this.deps.entityIdentityService.resolveSetupId(setupId);
      throwIfAborted(signal);
    }
    return { account, setup };
  }

  private async validateSingleTakeProfit(
    record: AgentTradeIdentityRecord,
    signal: AbortSignal
  ): Promise<void> {
    const rows = await this.deps.tradeService.getTradeData({ fresh: true });
    throwIfAborted(signal);
    const row = rows.find((candidate) => candidate.path === record.file.path);
    if (!row) throw new ActionPlanError('not_found', 'trade_id');
    if (Array.isArray(row.takeProfits) && row.takeProfits.length > 1) {
      throw new ActionPlanError('unsupported_capability', 'set.take_profit');
    }
  }

  
  private async addCreatedOptions(
    wire: NonNullable<TradeUpdateInput['custom_fields']>,
    changes: TradeChanges
  ): Promise<void> {
    if (wire.length === 0) return;
    let current: CustomFieldChange[];
    try {
      current = resolveCustomFieldChanges(
        wire,
        this.deps.customFields,
        'custom_fields'
      );
    } catch {
      throw new ActionExecutionError('conflict', false);
    }
    if (
      JSON.stringify(current.map((change) => change.value)) !==
      JSON.stringify(changes.customFields.map((change) => change.value))
    ) {
      throw new ActionExecutionError('conflict', false);
    }
    try {
      
      
      for (const change of current) {
        for (const option of change.createdOptions) {
          await this.deps.customFields.addFieldOption(change.field.id, option);
        }
      }
    } catch {
      throw new ActionExecutionError('write_failed', true);
    }
  }

  
  private canonicalizeAddedTags(changes: TradeChanges): TradeChanges {
    if (changes.addTags.length === 0) return changes;
    return {
      ...changes,
      addTags: catalogTags(
        changes.addTags,
        this.deps.getAvailableTags(),
        'add_tags'
      ),
    };
  }

  
  private canonicalizeAddedMistakes(changes: TradeChanges): TradeChanges {
    if (changes.addMistakes.length === 0) return changes;
    return {
      ...changes,
      addMistakes: catalogMistakes(
        changes.addMistakes,
        this.deps.getAvailableMistakes(),
        'add_mistakes'
      ),
    };
  }
}
