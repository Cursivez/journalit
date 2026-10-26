import { generateUUID } from '../../utils/uuid';
import type { AgentScope } from '../agent/AgentPermissions';
import {
  agentActionCatalog,
  type AgentActionId,
} from '../agent/protocol/generated/manifest.generated';
import type { AgentToolContracts } from '../agent/protocol';
import {
  ActionExecutionError,
  ActionPlanError,
  type ActionPlanErrorCode,
} from './ActionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionDefinitions,
  type ActionDisplay,
  type ActionId,
  type ActionInput,
  type ActionPlan,
  type ActionPlanContext,
  type AnyActionPlan,
  type UndoCapturingActionId,
} from './ActionTypes';

type ApplyChangesRequest = AgentToolContracts['apply_changes']['request'];
type ApplyChangesResult = AgentToolContracts['apply_changes']['result'];
type PreviewRequest = Extract<ApplyChangesRequest, { mode: 'preview' }>;
export type ActionCall = PreviewRequest['actions'][number];
type PreviewResult = Omit<
  Extract<ApplyChangesResult, { variant: 'preview' }>,
  'meta'
>;
type CommittedResult = Omit<
  Extract<ApplyChangesResult, { variant: 'committed' }>,
  'meta'
>;
type ApprovalPendingResult = Omit<
  Extract<ApplyChangesResult, { variant: 'approval_pending' }>,
  'meta'
>;
type ApprovalDeniedResult = Omit<
  Extract<ApplyChangesResult, { variant: 'approval_denied' }>,
  'meta'
>;
type ActionSummaryEntry = PreviewResult['actions'][number];
type ActionOutcomeEntry = CommittedResult['actions'][number];
export type ApprovalReason = PreviewResult['approval']['reasons'][number];

type ActionCommitResult =
  | CommittedResult
  | ApprovalPendingResult
  | ApprovalDeniedResult;

interface ActionCommitOutcome {
  readonly result: ActionCommitResult;
  readonly cached: boolean;
}


export type ActionBatchErrorCode =
  | ActionPlanErrorCode
  | 'permission_denied'
  | 'preview_expired';

export class ActionBatchError extends Error {
  readonly code: ActionBatchErrorCode;
  
  readonly field: string | undefined;

  constructor(code: ActionBatchErrorCode, field?: string) {
    super(`Action batch failed: ${code}`);
    this.name = 'ActionBatchError';
    this.code = code;
    this.field = field;
  }
}

type ApprovalState = 'pending' | 'approved' | 'denied';


export interface PendingApproval {
  readonly previewId: string;
  readonly createdAt: number;
  readonly expiresAt: number;
  readonly reasons: readonly ApprovalReason[];
  readonly actions: readonly {
    readonly action: ActionId;
    readonly title: string;
    readonly display: ActionDisplay;
  }[];
}


interface CommittedActionBatch {
  readonly previewId: string;
  readonly installationId: string;
  readonly committedAt: number;
  readonly actions: readonly {
    readonly action: ActionId;
    readonly title: string;
    readonly input: unknown;
    readonly summary: unknown;
    readonly display: ActionDisplay;
    readonly outcome: 'applied' | 'failed' | 'not_attempted';
    readonly result?: unknown;
    
    readonly undo?: UndoCapture;
  }[];
}

type UndoCapture = ActionExecution<UndoCapturingActionId>['undo'];

interface ActionBatchServiceOptions {
  definitions: ActionDefinitions;
  
  onCommitted?: (batch: CommittedActionBatch) => void;
  
  
  approvalsDisabled: () => boolean;
  now?: () => number;
  idFactory?: () => string;
  ttlMs?: number;
  maxPreviews?: number;
  maxLedgerEntries?: number;
  bulkNoteThreshold?: number;
}


function plansOverlap(left: AnyActionPlan, right: AnyActionPlan): boolean {
  const matches = (overlap: string, key: string): boolean =>
    overlap.endsWith(':') ? key.startsWith(overlap) : key === overlap;
  const keysMatch = (leftKey: string, rightKey: string): boolean =>
    matches(leftKey, rightKey) || matches(rightKey, leftKey);
  const leftWrites = [left.target, ...(left.writes ?? [])];
  const rightWrites = [right.target, ...(right.writes ?? [])];
  const leftReadsOrWrites = [...leftWrites, ...(left.dependsOn ?? [])];
  const rightReadsOrWrites = [...rightWrites, ...(right.dependsOn ?? [])];
  const conflicts = (
    writingKeys: readonly string[],
    otherKeys: readonly string[]
  ): boolean =>
    writingKeys.some((write) => otherKeys.some((key) => keysMatch(write, key)));
  return (
    conflicts(leftWrites, rightReadsOrWrites) ||
    conflicts(rightWrites, leftReadsOrWrites)
  );
}

interface PlannedAction {
  readonly action: ActionId;
  readonly input: unknown;
  readonly plan: AnyActionPlan;
}

interface PreviewEntry {
  readonly previewId: string;
  readonly installationId: string;
  readonly requiredScopes: readonly AgentScope[];
  readonly planned: readonly PlannedAction[];
  reasons: readonly ApprovalReason[];
  readonly createdAt: number;
  readonly expiresAt: number;
  
  approval: ApprovalState | 'required' | 'not_required';
  reservationKey: string | null;
}

type LedgerEntry =
  | {
      readonly state: 'pending';
      readonly previewId: string;
      readonly promise: Promise<ActionCommitResult>;
    }
  | {
      readonly state: 'completed';
      readonly previewId: string;
      readonly result: ActionCommitResult;
      readonly expiresAt: number;
    };

const DEFAULT_TTL_MS = 15 * 60 * 1000;
const DEFAULT_MAX_PREVIEWS = 32;
const DEFAULT_MAX_LEDGER_ENTRIES = 64;

const DEFAULT_BULK_NOTE_THRESHOLD = 25;

interface CatalogEntry {
  readonly scope: AgentScope;
  readonly approval: 'standard' | 'always';
  readonly title: string;
}

const catalogById = new Map<AgentActionId, CatalogEntry>(
  agentActionCatalog.map((entry) => [entry.id, entry])
);

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}


function awaitWithSignal<T>(
  promise: Promise<T>,
  signal: AbortSignal
): Promise<T> {
  const throwReason = async (): Promise<never> => {
    throw signal.reason;
  };
  if (signal.aborted) return throwReason();
  let onAbort: () => void = () => undefined;
  const aborted = new Promise<void>((resolve) => {
    onAbort = resolve;
    signal.addEventListener('abort', onAbort, { once: true });
  });
  return Promise.race([promise, aborted.then(throwReason)]).finally(() => {
    signal.removeEventListener('abort', onAbort);
  });
}

type ActionCallFor = {
  [Id in ActionId]: { readonly action: Id; readonly input: ActionInput<Id> };
};


function planCall<Id extends ActionId>(
  definitions: ActionDefinitions,
  call: ActionCallFor[Id],
  context: ActionPlanContext
): Promise<ActionPlan<Id>> {
  const definition: ActionDefinition<Id> = definitions[call.action];
  return definition.plan(call.input, context);
}

function catalogEntry(action: ActionId): CatalogEntry {
  const entry = catalogById.get(action);
  if (!entry) throw new Error(`Action ${action} is not in the catalog.`);
  return entry;
}


export class ActionBatchService {
  private readonly definitions: ActionDefinitions;
  private readonly onCommitted:
    | ((batch: CommittedActionBatch) => void)
    | undefined;
  private readonly approvalsDisabled: () => boolean;
  private readonly now: () => number;
  private readonly idFactory: () => string;
  private readonly ttlMs: number;
  private readonly maxPreviews: number;
  private readonly maxLedgerEntries: number;
  private readonly bulkNoteThreshold: number;
  private readonly previews = new Map<string, PreviewEntry>();
  private readonly ledger = new Map<string, LedgerEntry>();
  private readonly listeners = new Set<() => void>();
  private closed = false;

  constructor(options: ActionBatchServiceOptions) {
    this.definitions = options.definitions;
    this.onCommitted = options.onCommitted;
    this.approvalsDisabled = options.approvalsDisabled;
    this.now = options.now ?? Date.now;
    this.idFactory = options.idFactory ?? generateUUID;
    this.ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
    this.maxPreviews = options.maxPreviews ?? DEFAULT_MAX_PREVIEWS;
    this.maxLedgerEntries =
      options.maxLedgerEntries ?? DEFAULT_MAX_LEDGER_ENTRIES;
    this.bulkNoteThreshold =
      options.bulkNoteThreshold ?? DEFAULT_BULK_NOTE_THRESHOLD;
  }

  async preview(input: {
    installationId: string;
    scopes: readonly AgentScope[];
    actions: readonly ActionCall[];
    signal: AbortSignal;
  }): Promise<PreviewResult> {
    this.assertOpen();
    const requiredScopes = this.requiredScopes(input.actions);
    const granted = new Set(input.scopes);
    if (!requiredScopes.every((scope) => granted.has(scope))) {
      throw new ActionBatchError('permission_denied');
    }

    const planned: PlannedAction[] = [];
    
    
    const created = new Set<string>();
    
    
    for (const [index, call] of input.actions.entries()) {
      throwIfAborted(input.signal);
      const plan = await this.planOne(
        call,
        index,
        input.installationId,
        created,
        input.signal
      );
      throwIfAborted(input.signal);
      if (planned.some((earlier) => plansOverlap(earlier.plan, plan))) {
        throw new ActionBatchError('invalid_request', `actions[${index}]`);
      }
      planned.push({
        action: call.action,
        input: structuredClone(call.input),
        plan,
      });
      for (const identity of plan.creates ?? []) created.add(identity);
    }

    const reasons = this.approvalReasons(planned);
    const createdAt = this.now();
    this.removeExpired(createdAt);
    if (this.previews.size >= this.maxPreviews) this.evictOldestPreview();
    const previewId = `preview_${this.idFactory()}`;
    if (this.previews.has(previewId)) {
      throw new Error('Preview identity collision detected.');
    }
    const entry: PreviewEntry = {
      previewId,
      installationId: input.installationId,
      requiredScopes,
      planned,
      reasons,
      createdAt,
      expiresAt: createdAt + this.ttlMs,
      
      
      approval: reasons.length > 0 ? 'required' : 'not_required',
      reservationKey: null,
    };
    this.previews.set(previewId, entry);

    return {
      status: 'ok',
      variant: 'preview',
      preview_id: previewId,
      expires_at: new Date(entry.expiresAt).toISOString(),
      approval: { required: reasons.length > 0, reasons: [...reasons] },
      
      
      
      actions: planned.map(
        ({ action, plan }, index) =>
          ({
            index,
            action,
            summary: structuredClone(plan.summary),
          }) as ActionSummaryEntry
      ),
    };
  }

  async commit(input: {
    installationId: string;
    scopes: readonly AgentScope[];
    previewId: string;
    idempotencyKey: string;
    signal: AbortSignal;
  }): Promise<ActionCommitOutcome> {
    this.assertOpen();
    throwIfAborted(input.signal);
    const now = this.now();
    this.removeExpired(now);
    const ledgerKey = `${input.installationId}\0${input.idempotencyKey}`;
    const recorded = this.ledger.get(ledgerKey);
    if (recorded) {
      if (recorded.previewId !== input.previewId) {
        throw new ActionBatchError('invalid_request', 'idempotency_key');
      }
      if (recorded.state === 'completed') {
        return { result: structuredClone(recorded.result), cached: true };
      }
      const result = await awaitWithSignal(recorded.promise, input.signal);
      return { result: structuredClone(result), cached: true };
    }

    const entry = this.previews.get(input.previewId);
    if (
      !entry ||
      entry.installationId !== input.installationId ||
      entry.reservationKey !== null
    ) {
      throw new ActionBatchError('preview_expired');
    }
    const granted = new Set(input.scopes);
    if (!entry.requiredScopes.every((scope) => granted.has(scope))) {
      throw new ActionBatchError('permission_denied');
    }
    if (entry.approval === 'required' || entry.approval === 'not_required') {
      
      
      
      const reasons = this.approvalReasons(entry.planned);
      entry.reasons = reasons;
      if (reasons.length > 0) {
        entry.approval = 'pending';
        this.notify();
      } else {
        entry.approval = 'not_required';
      }
    }
    if (entry.approval === 'pending') {
      return {
        result: {
          status: 'ok',
          variant: 'approval_pending',
          preview_id: entry.previewId,
          expires_at: new Date(entry.expiresAt).toISOString(),
        },
        cached: false,
      };
    }
    if (entry.approval === 'denied') {
      const result: ApprovalDeniedResult = {
        status: 'ok',
        variant: 'approval_denied',
        preview_id: entry.previewId,
      };
      this.previews.delete(entry.previewId);
      this.record(ledgerKey, entry.previewId, result, now);
      return { result: structuredClone(result), cached: false };
    }

    this.reserveLedgerCapacity();
    entry.reservationKey = ledgerKey;
    const execution = this.execute(entry, input.signal);
    this.ledger.set(ledgerKey, {
      state: 'pending',
      previewId: entry.previewId,
      promise: execution.then((outcome) => outcome.result),
    });
    let outcome: Awaited<typeof execution>;
    try {
      outcome = await execution;
    } catch (error) {
      
      this.ledger.delete(ledgerKey);
      entry.reservationKey = null;
      throw error;
    }
    this.previews.delete(entry.previewId);
    this.record(ledgerKey, entry.previewId, outcome.result, this.now());
    this.reportCommitted(entry, outcome.result, outcome.undo);
    
    
    if (outcome.aborted) throw input.signal.reason;
    return { result: structuredClone(outcome.result), cached: false };
  }

  
  async runLocal(
    call: ActionCall,
    installationId: string,
    signal: AbortSignal,
    
    precondition: (plan: AnyActionPlan) => boolean = () => true
  ): Promise<unknown> {
    const plan = await this.planLocal(
      call,
      installationId,
      signal,
      precondition
    );
    const executed = await plan.execute(signal);
    return executed instanceof ActionExecution ? executed.result : executed;
  }

  
  async checkLocal(
    call: ActionCall,
    installationId: string,
    signal: AbortSignal,
    precondition: (plan: AnyActionPlan) => boolean = () => true
  ): Promise<void> {
    await this.planLocal(call, installationId, signal, precondition);
  }

  private async planLocal(
    call: ActionCall,
    installationId: string,
    signal: AbortSignal,
    precondition: (plan: AnyActionPlan) => boolean
  ): Promise<AnyActionPlan> {
    this.assertOpen();
    const plan = await planCall(
      this.definitions,
      call as ActionCallFor[ActionId],
      {
        origin: 'ui',
        installationId,
        signal,
      }
    );
    throwIfAborted(signal);
    if (!precondition(plan)) throw new ActionExecutionError('conflict', false);
    return plan;
  }

  private reportCommitted(
    entry: PreviewEntry,
    result: CommittedResult,
    undo: ReadonlyMap<number, UndoCapture>
  ): void {
    if (!this.onCommitted) return;
    const outcomes = new Map(
      result.actions.map((outcome) => [outcome.index, outcome])
    );
    try {
      this.onCommitted({
        previewId: entry.previewId,
        installationId: entry.installationId,
        committedAt: this.now(),
        actions: entry.planned.map(({ action, input, plan }, index) => {
          const outcome = outcomes.get(index);
          return {
            action,
            title: catalogEntry(action).title,
            input: structuredClone(input),
            summary: structuredClone(plan.summary),
            display: plan.display,
            outcome: outcome?.outcome ?? 'not_attempted',
            ...(outcome && 'result' in outcome
              ? { result: structuredClone(outcome.result) }
              : {}),
            ...(undo.has(index) ? { undo: undo.get(index) } : {}),
          };
        }),
      });
    } catch (error) {
      console.warn('[Journalit] Could not record an agent change:', error);
    }
  }

  
  listPendingApprovals(): PendingApproval[] {
    this.removeExpired(this.now());
    return [...this.previews.values()]
      .filter((entry) => entry.approval === 'pending')
      .sort((left, right) => left.createdAt - right.createdAt)
      .map((entry) => ({
        previewId: entry.previewId,
        createdAt: entry.createdAt,
        expiresAt: entry.expiresAt,
        reasons: [...entry.reasons],
        actions: entry.planned.map(({ action, plan }) => ({
          action,
          title: catalogEntry(action).title,
          display: plan.display,
        })),
      }));
  }

  
  decide(previewId: string, decision: 'approved' | 'denied'): boolean {
    this.removeExpired(this.now());
    const entry = this.previews.get(previewId);
    if (!entry || entry.approval !== 'pending') return false;
    entry.approval = decision;
    this.notify();
    return true;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  
  close(): void {
    this.closed = true;
    this.previews.clear();
    this.ledger.clear();
    this.notify();
    this.listeners.clear();
  }

  private async planOne(
    call: ActionCall,
    index: number,
    installationId: string,
    createdEarlier: ReadonlySet<string>,
    signal: AbortSignal
  ): Promise<AnyActionPlan> {
    try {
      return await this.planAction(
        call,
        installationId,
        createdEarlier,
        signal
      );
    } catch (error) {
      throwIfAborted(signal);
      if (error instanceof ActionPlanError) {
        throw new ActionBatchError(
          error.code,
          error.field === undefined
            ? `actions[${index}].input`
            : `actions[${index}].input.${error.field}`
        );
      }
      throw error;
    }
  }

  private planAction(
    call: ActionCall,
    installationId: string,
    createdEarlier: ReadonlySet<string>,
    signal: AbortSignal
  ): Promise<AnyActionPlan> {
    return planCall(this.definitions, call, {
      origin: 'agent',
      installationId,
      
      createdEarlier: new Set(createdEarlier),
      signal,
    });
  }

  private requiredScopes(actions: readonly ActionCall[]): AgentScope[] {
    return [...new Set(actions.map((call) => catalogEntry(call.action).scope))];
  }

  private approvalReasons(planned: readonly PlannedAction[]): ApprovalReason[] {
    
    
    if (this.approvalsDisabled()) return [];
    const reasons: ApprovalReason[] = [];
    if (
      planned.some(({ action }) => catalogEntry(action).approval === 'always')
    ) {
      reasons.push('action_policy');
    }
    const affectedNotes = planned.reduce(
      (total, { plan }) => total + plan.affectedNotes,
      0
    );
    if (affectedNotes > this.bulkNoteThreshold) reasons.push('bulk');
    return reasons;
  }

  private async execute(
    entry: PreviewEntry,
    signal: AbortSignal
  ): Promise<{
    result: CommittedResult;
    aborted: boolean;
    
    undo: Map<number, UndoCapture>;
  }> {
    throwIfAborted(signal);
    const outcomes: ActionOutcomeEntry[] = [];
    const undo = new Map<number, UndoCapture>();
    let applied = 0;
    let stopped = false;
    let aborted = false;
    for (const [index, { action, plan }] of entry.planned.entries()) {
      if (stopped) {
        outcomes.push({ index, action, outcome: 'not_attempted' });
        continue;
      }
      if (signal.aborted) {
        
        if (applied === 0) throw signal.reason;
        aborted = true;
        stopped = true;
        outcomes.push({ index, action, outcome: 'not_attempted' });
        continue;
      }
      try {
        const executed = await plan.execute(signal);
        let result: unknown = executed;
        if (executed instanceof ActionExecution) {
          result = executed.result;
          undo.set(index, structuredClone(executed.undo));
        }
        outcomes.push({
          index,
          action,
          outcome: 'applied',
          result: structuredClone(result),
        } as ActionOutcomeEntry);
        applied += 1;
      } catch (error) {
        stopped = true;
        const failure =
          error instanceof ActionExecutionError
            ? { code: error.code, retryable: error.retryable }
            : 
              { code: 'outcome_unknown' as const, retryable: false };
        outcomes.push({ index, action, outcome: 'failed', failure });
        if (signal.aborted) aborted = true;
      }
    }
    const stoppedEarly = stopped || aborted;
    return {
      result: {
        status: 'ok',
        variant: 'committed',
        outcome: !stoppedEarly
          ? 'applied'
          : applied === 0
            ? 'failed'
            : 'partially_applied',
        actions: outcomes,
      },
      aborted,
      undo,
    };
  }

  private record(
    ledgerKey: string,
    previewId: string,
    result: ActionCommitResult,
    now: number
  ): void {
    
    
    if (!this.ledger.has(ledgerKey)) this.reserveLedgerCapacity();
    this.ledger.set(ledgerKey, {
      state: 'completed',
      previewId,
      result: structuredClone(result),
      expiresAt: now + this.ttlMs,
    });
  }

  private reserveLedgerCapacity(): void {
    while (this.ledger.size >= this.maxLedgerEntries) {
      const oldest = [...this.ledger.entries()].find(
        ([, entry]) => entry.state === 'completed'
      );
      if (!oldest) throw new ActionBatchError('limit_exceeded');
      this.ledger.delete(oldest[0]);
    }
  }

  
  private evictOldestPreview(): void {
    for (const [previewId, entry] of this.previews) {
      if (
        entry.reservationKey === null &&
        (entry.approval === 'not_required' || entry.approval === 'required')
      ) {
        this.previews.delete(previewId);
        return;
      }
    }
    throw new ActionBatchError('limit_exceeded');
  }

  private removeExpired(now: number): void {
    let changed = false;
    for (const [previewId, entry] of this.previews) {
      if (entry.reservationKey === null && now >= entry.expiresAt) {
        this.previews.delete(previewId);
        changed = changed || entry.approval === 'pending';
      }
    }
    for (const [key, entry] of this.ledger) {
      if (entry.state === 'completed' && now >= entry.expiresAt) {
        this.ledger.delete(key);
      }
    }
    if (changed) this.notify();
  }

  private assertOpen(): void {
    if (this.closed) throw new ActionBatchError('preview_expired');
  }

  
  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (error) {
        console.error('Agent request listener failed.', error);
      }
    }
  }
}
