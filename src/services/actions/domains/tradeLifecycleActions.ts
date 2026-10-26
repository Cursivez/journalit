import type { AgentEntityIdentityService } from '../../agent/identity/AgentEntityIdentityService';
import type {
  AgentTradeIdentityRecord,
  AgentTradeIdentityService,
} from '../../agent/identity/AgentTradeIdentityService';
import { isTradeExecutionOwnedBySync } from '../../agent/trades/tradeExecutionOwnership';
import { TradeRevisionConflictError } from '../../trade/core/TradeCommandService';
import {
  TradeNoteConflictError,
  type TradeNoteWriter,
} from '../../trade/TradeNoteWriter';
import type { TradeData, TradeService } from '../../trade/TradeService';
import { t } from '../../../lang/helpers';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import type {
  ActionDefinition,
  ActionInput,
  ActionPlan,
  ActionPlanContext,
  ActionResult,
} from '../ActionTypes';
import {
  normalizeExtractedTradeData,
  normalizedTradeForWrite,
  throwIfAborted,
  tradeEditState,
} from './tradeActionSupport';
import { tradeTypeLabel } from './tradeTypeLabels';

interface TradeRevision {
  readonly tradeRevision: number;
  readonly contentRevision: string;
}

interface TradeLifecycleDependencies {
  tradeIdentityService: Pick<
    AgentTradeIdentityService,
    'listTradeIdentitiesStrict'
  >;
  entityIdentityService: Pick<AgentEntityIdentityService, 'resolveAccountId'>;
  tradeService: Pick<
    TradeService,
    | 'getCurrentTradeMutationRevision'
    | 'getTradeEditRevision'
    | 'extractTradeDataFromDisk'
  >;
  writer: Pick<TradeNoteWriter, 'update' | 'delete'>;
}


class TradeLookup {
  constructor(private readonly deps: TradeLifecycleDependencies) {}

  async record(
    tradeId: string,
    signal: AbortSignal
  ): Promise<AgentTradeIdentityRecord | undefined> {
    const catalog =
      await this.deps.tradeIdentityService.listTradeIdentitiesStrict();
    throwIfAborted(signal);
    return catalog.find((record) => record.tradeId === tradeId);
  }

  async data(
    record: AgentTradeIdentityRecord,
    signal: AbortSignal
  ): Promise<TradeData | null> {
    const data = normalizeExtractedTradeData(
      await this.deps.tradeService.extractTradeDataFromDisk(record.file)
    );
    throwIfAborted(signal);
    return data;
  }

  revision(record: AgentTradeIdentityRecord): Promise<TradeRevision> {
    return this.deps.tradeService.getCurrentTradeMutationRevision(
      record.file.path
    );
  }

  
  async current(
    planned: AgentTradeIdentityRecord,
    revision: TradeRevision,
    signal: AbortSignal
  ): Promise<{ record: AgentTradeIdentityRecord; data: TradeData }> {
    throwIfAborted(signal);
    const record = await this.record(planned.tradeId, signal);
    if (!record) throw new ActionExecutionError('not_found', false);
    if (
      record.file.path !== planned.file.path ||
      record.tradeType !== planned.tradeType
    ) {
      throw new ActionExecutionError('conflict', false);
    }
    const now = await this.revision(record);
    if (
      now.tradeRevision !== revision.tradeRevision ||
      now.contentRevision !== revision.contentRevision
    ) {
      throw new ActionExecutionError('conflict', false);
    }
    const data = await this.data(record, signal);
    if (!data) throw new ActionExecutionError('not_found', false);
    return { record, data };
  }
}


class TradeSetTypeAction implements ActionDefinition<'trade.set_type'> {
  private readonly lookup: TradeLookup;

  constructor(private readonly deps: TradeLifecycleDependencies) {
    this.lookup = new TradeLookup(deps);
  }

  async plan(
    input: ActionInput<'trade.set_type'>,
    context: ActionPlanContext
  ): Promise<ActionPlan<'trade.set_type'>> {
    const { signal } = context;
    throwIfAborted(signal);
    const record = await this.lookup.record(input.trade_id, signal);
    if (!record) throw new ActionPlanError('not_found', 'trade_id');
    if (record.tradeType === input.trade_type) {
      throw new ActionPlanError('invalid_request', 'trade_type');
    }
    const [revision, current] = await Promise.all([
      this.lookup.revision(record),
      this.lookup.data(record, signal),
    ]);
    if (!current) throw new ActionPlanError('not_found', 'trade_id');
    if (isTradeExecutionOwnedBySync(current)) {
      
      throw new ActionPlanError('unsupported_capability', 'trade_id');
    }
    const account = await this.resolveAccount(input, signal, (code) => {
      throw new ActionPlanError(code, 'account_id');
    });
    if (
      !normalizedTradeForWrite(
        convertedTrade(current, account),
        input.trade_type,
        { requireAccount: true }
      )
    ) {
      
      
      throw new ActionPlanError(
        'invalid_request',
        input.trade_type === 'regular' &&
          account === undefined &&
          (current.account ?? []).length === 0
          ? 'account_id'
          : 'trade_type'
      );
    }
    return {
      target: `trade:${record.tradeId}`,
      summary: {
        trade_id: record.tradeId,
        base_revision: revision.tradeRevision,
        source_type: record.tradeType,
        target_type: input.trade_type,
        ...(input.account_id === undefined
          ? {}
          : { account_id: input.account_id }),
      },
      affectedNotes: 1,
      display: {
        target: record.file.basename,
        changes: [
          t('actions.trade.set-type', {
            source: tradeTypeLabel(record.tradeType),
            target: tradeTypeLabel(input.trade_type),
          }),
          ...(account === undefined
            ? []
            : [t('actions.trade.set.account_id', { value: account })]),
        ],
      },
      execute: (executionSignal) =>
        this.execute(input, {
          planned: record,
          revision,
          account,
          origin: context.origin,
          signal: executionSignal,
        }),
    };
  }

  private async execute(
    input: ActionInput<'trade.set_type'>,
    frozen: {
      planned: AgentTradeIdentityRecord;
      revision: TradeRevision;
      account: string | undefined;
      origin: ActionPlanContext['origin'];
      signal: AbortSignal;
    }
  ): Promise<ActionResult<'trade.set_type'>> {
    const { planned, revision, account, signal } = frozen;
    const [{ data }, resolved] = await Promise.all([
      this.lookup.current(planned, revision, signal),
      this.resolveAccount(input, signal, () => {
        throw new ActionExecutionError('conflict', false);
      }),
    ]);
    if (resolved !== account) throw new ActionExecutionError('conflict', false);
    const next = normalizedTradeForWrite(
      convertedTrade(data, account),
      input.trade_type,
      { requireAccount: true }
    );
    if (!next) throw new ActionExecutionError('conflict', false);
    let path: string;
    try {
      path = (
        await this.deps.writer.update({
          path: planned.file.path,
          previous: data,
          next: next.data,
          sourceType: planned.tradeType,
          type: input.trade_type,
          expected: revision,
          source: frozen.origin,
        })
      ).path;
    } catch (error) {
      if (
        error instanceof TradeRevisionConflictError ||
        error instanceof TradeNoteConflictError
      ) {
        throw new ActionExecutionError('conflict', false);
      }
      
      throw new ActionExecutionError('outcome_unknown', false);
    }
    const converted = await this.lookup
      .record(planned.tradeId, signal)
      .catch(() => undefined);
    if (!converted || converted.file.path !== path) {
      throw new ActionExecutionError('outcome_unknown', false);
    }
    return {
      trade_id: converted.tradeId,
      trade_revision: converted.tradeRevision ?? 0,
    };
  }

  private async resolveAccount(
    input: ActionInput<'trade.set_type'>,
    signal: AbortSignal,
    fail: (code: 'not_found') => never
  ): Promise<string | undefined> {
    if (input.account_id === undefined) return undefined;
    const name = await this.deps.entityIdentityService.resolveAccountId(
      input.account_id
    );
    throwIfAborted(signal);
    return name ?? fail('not_found');
  }
}


function convertedTrade(current: TradeData, account: string | undefined) {
  const next: TradeData = { ...current };
  if (account !== undefined) {
    next.account = [account];
    delete next.clearAccountAssignment;
  }
  return next;
}


class TradeDeleteAction implements ActionDefinition<'trade.delete'> {
  private readonly lookup: TradeLookup;

  constructor(private readonly deps: TradeLifecycleDependencies) {
    this.lookup = new TradeLookup(deps);
  }

  async plan(
    input: ActionInput<'trade.delete'>,
    context: ActionPlanContext
  ): Promise<ActionPlan<'trade.delete'>> {
    const { signal } = context;
    throwIfAborted(signal);
    const record = await this.lookup.record(input.trade_id, signal);
    if (!record) throw new ActionPlanError('not_found', 'trade_id');
    const [revision, current] = await Promise.all([
      this.lookup.revision(record),
      this.lookup.data(record, signal),
    ]);
    if (!current) throw new ActionPlanError('not_found', 'trade_id');
    if (isTradeExecutionOwnedBySync(current)) {
      throw new ActionPlanError('unsupported_capability', 'trade_id');
    }
    return {
      target: `trade:${record.tradeId}`,
      summary: {
        trade_id: record.tradeId,
        trade_type: record.tradeType,
        base_revision: revision.tradeRevision,
      },
      affectedNotes: 1,
      display: {
        target: record.file.basename,
        changes: [t('actions.trade.delete')],
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
        this.execute(record, revision, executionSignal),
    };
  }

  private async execute(
    planned: AgentTradeIdentityRecord,
    revision: TradeRevision,
    signal: AbortSignal
  ): Promise<ActionResult<'trade.delete'>> {
    const { data } = await this.lookup.current(planned, revision, signal);
    if (isTradeExecutionOwnedBySync(data)) {
      throw new ActionExecutionError('conflict', false);
    }
    try {
      
      
      await this.deps.writer.delete(
        planned.file.path,
        planned.tradeType,
        revision
      );
    } catch (error) {
      if (error instanceof TradeNoteConflictError) {
        throw new ActionExecutionError('conflict', false);
      }
      throw new ActionExecutionError('write_failed', true);
    }
    return { trade_id: planned.tradeId };
  }
}

export function createTradeLifecycleActions(deps: TradeLifecycleDependencies): {
  'trade.set_type': ActionDefinition<'trade.set_type'>;
  'trade.delete': ActionDefinition<'trade.delete'>;
} {
  return {
    'trade.set_type': new TradeSetTypeAction(deps),
    'trade.delete': new TradeDeleteAction(deps),
  };
}
