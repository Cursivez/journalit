import type { AgentEntityIdentityService } from '../../agent/identity/AgentEntityIdentityService';
import type {
  AgentTradeIdentityRecord,
  AgentTradeIdentityService,
} from '../../agent/identity/AgentTradeIdentityService';
import {
  applyAutoCommission,
  type InstrumentCommissionCalculator,
} from '../../trade/autoCommission';
import { calculateTradeMutationFinancials } from '../../trade/core/TradeRules';
import type { InstrumentContractFields } from '../../trade/instrumentContractDefaults';
import type {
  TradeNoteType,
  TradeNoteWriter,
} from '../../trade/TradeNoteWriter';
import type { TradeData, TradeService } from '../../trade/TradeService';
import { t, tPlural } from '../../../lang/helpers';
import { parseLocalDateSafe } from '../../../utils/dateUtils';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionInput,
  type ActionPlan,
  type ActionPlanContext,
  type ActionSummary,
  type TradeNoteContent,
} from '../ActionTypes';
import {
  applyExecutions,
  catalogMistakes,
  catalogTags,
  firstEntryTime,
  normalizedTradeForWrite,
  parseExecutions,
  throwIfAborted,
} from './tradeActionSupport';
import { tradeTypeLabel } from './tradeTypeLabels';
import { parseTargetList, validateTargetTotals } from './tradePlannedTargets';
import {
  normalizeUserOwnedTradeNotes,
  replaceUserOwnedTradeNotes,
  USER_OWNED_TRADE_CONTENT_MARKER,
} from '../../trade/core/TradeNoteDocumentCodec';
import { MAX_TEXT, textLength } from './tradeUpdateChanges';
import { TradeRevisionConflictError } from '../../trade/core/TradeCommandService';
import {
  customFieldValuesAfter,
  resolveCustomFieldChanges,
  type CustomFieldCatalog,
  type CustomFieldChange,
} from './tradeCustomFieldValues';
import type { CustomFieldDefinition } from '../../../types/customFields';

type TradeCreateInput = ActionInput<'trade.create'>;
type TradeCreateSummary = ActionSummary<'trade.create'>;


interface InstrumentCatalog {
  
  has(instrument: string, assetType: string): boolean;
  add(instrument: string, assetType: string): Promise<void>;
  contractDefaults(
    instrument: string,
    assetType: string
  ): InstrumentContractFields;
}

interface TradeCreateActionDependencies {
  tradeIdentityService: Pick<
    AgentTradeIdentityService,
    'listTradeIdentitiesStrict'
  >;
  entityIdentityService: Pick<
    AgentEntityIdentityService,
    'resolveAccountId' | 'resolveSetupId'
  >;
  writer: Pick<TradeNoteWriter, 'create'>;
  tradeService: Pick<
    TradeService,
    | 'getTradeEditRevision'
    | 'getCurrentTradeMutationRevision'
    | 'updateTradeJournalEntry'
  >;
  instruments: InstrumentCatalog;
  getAvailableTags: () => readonly string[];
  getAvailableMistakes: () => readonly string[];
  
  customFields: CustomFieldCatalog & {
    getFields(): readonly CustomFieldDefinition[];
    addFieldOption(fieldId: string, option: string): Promise<boolean>;
  };
  calculateCommission?: InstrumentCommissionCalculator;
}

const MAX_VALUE = 1_000_000_000;
const MAX_AMOUNT = 1_000_000_000_000;
const INSTRUMENT_PATTERN = /^[A-Z0-9.]{1,40}$/;

function finite(
  value: number | undefined,
  field: string,
  valid: (value: number) => boolean
): void {
  if (value !== undefined && (!Number.isFinite(value) || !valid(value))) {
    throw new ActionPlanError('invalid_request', field);
  }
}



function optionExpirationDate(value: string): Date {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? parseLocalDateSafe(value)
    : null;
  if (!date) throw new ActionPlanError('invalid_request', 'option.expiration');
  return date;
}

function validateInput(input: TradeCreateInput): void {
  if (!INSTRUMENT_PATTERN.test(input.instrument)) {
    throw new ActionPlanError('invalid_request', 'instrument');
  }
  if ((input.asset_type === 'options') !== (input.option !== undefined)) {
    throw new ActionPlanError('invalid_request', 'option');
  }
  if (input.missed_reason !== undefined) {
    if (input.trade_type !== 'missed') {
      throw new ActionPlanError('invalid_request', 'missed_reason');
    }
    if (input.missed_reason.trim() === '') {
      throw new ActionPlanError('invalid_request', 'missed_reason');
    }
  }
  if (input.trade_type === 'regular' && input.account_id === undefined) {
    throw new ActionPlanError('invalid_request', 'account_id');
  }
  if (input.trade_type !== 'regular' && input.take_profit !== undefined) {
    
    throw new ActionPlanError('unsupported_capability', 'take_profit');
  }
  if (input.trade_type !== 'regular' && input.take_profits !== undefined) {
    throw new ActionPlanError('unsupported_capability', 'take_profits');
  }
  if (input.stop_losses !== undefined && input.stop_loss !== undefined) {
    throw new ActionPlanError('invalid_request', 'stop_losses');
  }
  if (input.take_profits !== undefined && input.take_profit !== undefined) {
    throw new ActionPlanError('invalid_request', 'take_profits');
  }
  
  if (
    input.thesis !== undefined &&
    (input.thesis === '' || textLength(input.thesis) > MAX_TEXT)
  ) {
    throw new ActionPlanError('invalid_request', 'thesis');
  }
  
  if (
    input.notes !== undefined &&
    (textLength(input.notes) > MAX_TEXT ||
      replaceUserOwnedTradeNotes(
        USER_OWNED_TRADE_CONTENT_MARKER,
        input.notes
      ) === null)
  ) {
    throw new ActionPlanError('invalid_request', 'notes');
  }
  const price = (value: number) => Math.abs(value) <= MAX_VALUE;
  const amount = (value: number) => Math.abs(value) <= MAX_AMOUNT;
  const cost = (value: number) => value >= 0 && value <= MAX_VALUE;
  finite(input.stop_loss, 'stop_loss', price);
  finite(input.take_profit, 'take_profit', price);
  finite(input.risk_amount, 'risk_amount', (v) => v > 0 && v <= MAX_VALUE);
  finite(input.direct_pnl, 'direct_pnl', amount);
  finite(input.commission, 'commission', cost);
  finite(input.fees, 'fees', cost);
  finite(input.swap, 'swap', amount);
  if (input.option) {
    finite(input.option.strike, 'option.strike', (v) => v > 0);
    finite(input.option.contract_size, 'option.contract_size', (v) => v > 0);
    optionExpirationDate(input.option.expiration);
  }
}


function compactIso(time: Date): string {
  return time.toISOString().replace(/\.?0+Z$/, 'Z');
}


interface ResolvedNames {
  readonly account?: string;
  readonly setup?: string;
}


interface PlannedTrade {
  readonly type: TradeNoteType;
  readonly instrument: string;
  readonly assetType: string;
  readonly data: TradeData;
  readonly names: ResolvedNames;
  readonly tags: readonly string[];
  readonly addsInstrument: boolean;
  readonly customFields: readonly CustomFieldChange[];
  
  readonly notes?: string;
}


export class TradeCreateAction implements ActionDefinition<'trade.create'> {
  constructor(private readonly deps: TradeCreateActionDependencies) {}

  async plan(
    input: TradeCreateInput,
    context: ActionPlanContext
  ): Promise<ActionPlan<'trade.create'>> {
    const { signal } = context;
    throwIfAborted(signal);
    validateInput(input);
    const executions = parseExecutions(input.executions);
    const tags =
      input.tags === undefined
        ? []
        : catalogTags(input.tags, this.deps.getAvailableTags(), 'tags');
    const mistakes =
      input.mistakes === undefined
        ? []
        : catalogMistakes(
            input.mistakes,
            this.deps.getAvailableMistakes(),
            'mistakes'
          );
    
    
    const addsInstrument = !this.deps.instruments.has(
      input.instrument,
      input.asset_type
    );
    const names = await this.resolveNames(input, signal);
    const customFields = this.resolveCustomFields(input);

    const data: TradeData = {
      instrument: input.instrument,
      assetType: input.asset_type,
      direction: input.direction,
      entryTime: firstEntryTime(executions),
      entryPrice: executions.entries[0].price,
      positionSize: 0,
      ...this.deps.instruments.contractDefaults(
        input.instrument,
        input.asset_type
      ),
      account: names.account === undefined ? [] : [names.account],
      setup: names.setup === undefined ? [] : [names.setup],
      tags: [...tags],
      mistake: mistakes,
      ...(customFields.length > 0
        ? { customFields: customFieldValuesAfter(undefined, customFields) }
        : {}),
    };
    applyExecutions(data, executions);
    if (input.option) {
      data.optionType = input.option.type;
      data.strikePrice = input.option.strike;
      data.expirationDate = optionExpirationDate(input.option.expiration);
      if (input.option.contract_size !== undefined) {
        data.contractSize = input.option.contract_size;
      }
    }
    if (input.stop_loss !== undefined) {
      data.stopLosses = [{ price: input.stop_loss }];
    }
    if (input.take_profit !== undefined) {
      data.takeProfits = [{ price: input.take_profit }];
    }
    if (input.stop_losses !== undefined) {
      data.stopLosses = parseTargetList(input.stop_losses, 'stop_losses');
    }
    if (input.take_profits !== undefined) {
      data.takeProfits = parseTargetList(input.take_profits, 'take_profits');
    }
    if (input.thesis !== undefined) data.thesis = input.thesis;
    if (input.risk_amount !== undefined) data.riskAmount = input.risk_amount;
    if (input.direct_pnl !== undefined) {
      data.useDirectPnLInput = true;
      data.directPnL = input.direct_pnl;
    }
    if (input.fees !== undefined) data.fees = input.fees;
    if (input.swap !== undefined) data.swap = input.swap;
    if (input.missed_reason !== undefined) {
      data.missedReason = input.missed_reason.trim();
    }
    const withCommission =
      input.commission === undefined
        ? applyAutoCommission(
            { ...data, hasExplicitCommission: false },
            this.deps.calculateCommission
          )
        : {
            ...data,
            commission: input.commission,
            commissionType: 'fixed' as const,
            hasExplicitCommission: true,
          };

    const normalized = normalizedTradeForWrite(
      withCommission,
      input.trade_type,
      { requireAccount: true }
    );
    if (!normalized) throw new ActionPlanError('invalid_request', 'executions');
    const brokenTotal = validateTargetTotals(normalized.data, {
      stopLosses: input.stop_losses !== undefined,
      takeProfits: input.take_profits !== undefined,
    });
    if (brokenTotal) throw new ActionPlanError('invalid_request', brokenTotal);
    const notes =
      input.notes === undefined
        ? ''
        : normalizeUserOwnedTradeNotes(input.notes);
    const { pnl } = calculateTradeMutationFinancials(normalized.data, {
      isOpen: normalized.isOpen,
    });
    const summary: TradeCreateSummary = {
      trade_type: input.trade_type,
      instrument: input.instrument,
      asset_type: input.asset_type,
      direction: input.direction,
      executions: structuredClone(input.executions),
      status: normalized.isOpen
        ? executions.exits.length > 0
          ? 'partially_closed'
          : 'open'
        : 'closed',
      pnl: pnl !== null && Number.isFinite(pnl) ? pnl : null,
    };
    const planned: PlannedTrade = {
      type: input.trade_type,
      instrument: input.instrument,
      assetType: input.asset_type,
      data: normalized.data,
      names,
      tags,
      addsInstrument,
      customFields,
      ...(notes === '' ? {} : { notes }),
    };
    const changes = [
      t('actions.trade.create', {
        type: tradeTypeLabel(input.trade_type),
        direction: input.direction,
        instrument: input.instrument,
        entries: tPlural('actions.trade.entries', executions.entries.length),
        exits: tPlural('actions.trade.exits', executions.exits.length),
      }),
    ];
    if (planned.addsInstrument) {
      changes.push(
        t('actions.trade.create.new-instrument', {
          instrument: input.instrument,
        })
      );
    }
    return {
      target: `trade:new:${input.trade_type}:${input.instrument}:${compactIso(
        data.entryTime
      )}`,
      summary,
      affectedNotes: 1,
      display: { target: input.instrument, changes },
      execute: (executionSignal) =>
        this.execute(input, planned, executionSignal),
    };
  }

  private async execute(
    input: TradeCreateInput,
    planned: PlannedTrade,
    signal: AbortSignal
  ): Promise<ActionExecution<'trade.create'>> {
    throwIfAborted(signal);
    
    
    const names = await this.resolveNames(input, signal).catch(() => null);
    if (
      !names ||
      names.account !== planned.names.account ||
      names.setup !== planned.names.setup
    ) {
      throw new ActionExecutionError('conflict', false);
    }
    if (planned.tags.length > 0) {
      try {
        catalogTags(planned.tags, this.deps.getAvailableTags(), 'tags');
      } catch {
        throw new ActionExecutionError('conflict', false);
      }
    }
    if (!this.deps.instruments.has(planned.instrument, planned.assetType)) {
      try {
        await this.deps.instruments.add(planned.instrument, planned.assetType);
      } catch {
        throw new ActionExecutionError('write_failed', true);
      }
    }
    await this.addCreatedOptions(input, planned);
    throwIfAborted(signal);

    let path: string;
    try {
      path = await this.deps.writer.create(planned.type, planned.data);
    } catch {
      
      throw new ActionExecutionError('outcome_unknown', false);
    }
    
    
    const catalog: readonly AgentTradeIdentityRecord[] =
      await this.deps.tradeIdentityService
        .listTradeIdentitiesStrict()
        .catch(() => []);
    const created = catalog.find((record) => record.file.path === path);
    if (!created) throw new ActionExecutionError('outcome_unknown', false);
    if (planned.notes !== undefined) {
      await this.writeNotes(path, planned.notes);
    }
    return new ActionExecution(
      {
        trade_id: created.tradeId,
        
        trade_revision: created.tradeRevision ?? 0,
      },
      { tradeContent: await this.createdContent(path) }
    );
  }

  
  private async writeNotes(path: string, notes: string): Promise<void> {
    const { tradeService } = this.deps;
    try {
      const expected = await tradeService.getCurrentTradeMutationRevision(path);
      await tradeService.updateTradeJournalEntry(
        path,
        { notes, appendNotes: true },
        expected
      );
    } catch (error) {
      if (!(error instanceof TradeRevisionConflictError)) {
        console.warn(
          "[Journalit] Could not write a created trade's notes:",
          error
        );
      }
      throw new ActionExecutionError('outcome_unknown', false);
    }
  }

  
  private async createdContent(
    path: string
  ): Promise<TradeNoteContent | undefined> {
    try {
      const { editRevision } =
        await this.deps.tradeService.getTradeEditRevision(path);
      return { path, editRevision };
    } catch (error) {
      console.warn('[Journalit] Could not capture a created trade:', error);
      return undefined;
    }
  }

  
  private resolveCustomFields(input: TradeCreateInput): CustomFieldChange[] {
    const changes = resolveCustomFieldChanges(
      input.custom_fields ?? [],
      this.deps.customFields,
      'custom_fields'
    );
    const given = new Set(changes.map((change) => change.field.id));
    if (
      this.deps.customFields
        .getFields()
        .some((field) => field.validation?.required && !given.has(field.id))
    ) {
      throw new ActionPlanError('invalid_request', 'custom_fields');
    }
    return changes;
  }

  
  private async addCreatedOptions(
    input: TradeCreateInput,
    planned: PlannedTrade
  ): Promise<void> {
    let current: CustomFieldChange[];
    try {
      current = this.resolveCustomFields(input);
    } catch {
      throw new ActionExecutionError('conflict', false);
    }
    if (
      JSON.stringify(current.map((change) => change.value)) !==
      JSON.stringify(planned.customFields.map((change) => change.value))
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

  private async resolveNames(
    input: TradeCreateInput,
    signal: AbortSignal
  ): Promise<ResolvedNames> {
    let account: string | undefined;
    let setup: string | undefined;
    if (input.account_id !== undefined) {
      const name = await this.deps.entityIdentityService.resolveAccountId(
        input.account_id
      );
      throwIfAborted(signal);
      if (name === null) throw new ActionPlanError('not_found', 'account_id');
      account = name;
    }
    if (input.setup_id !== undefined) {
      const name = await this.deps.entityIdentityService.resolveSetupId(
        input.setup_id
      );
      throwIfAborted(signal);
      if (name === null) throw new ActionPlanError('not_found', 'setup_id');
      setup = name;
    }
    return { account, setup };
  }
}
