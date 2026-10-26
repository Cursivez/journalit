import type { ActionCall } from '../ActionBatchService';
import type { ActionPlan, ActionId } from '../ActionTypes';
import {
  ActionInUseError,
  ActionPlanError,
  isInUseError,
} from '../ActionErrors';
import {
  isRemovalInverse,
  type ActionInverse,
  type EditableItem,
} from './actionInverses';
import {
  checkCreatedItem,
  isCreatedItemRemoval,
  type CreatedItemPlan,
} from './createdItemInverses';
import type {
  AgentChangeBatch,
  AgentChangeHistory,
} from './AgentChangeHistory';


type BasePlan = Pick<ActionPlan<ActionId>, 'baseContent' | 'baseEntry'> &
  CreatedItemPlan;

interface UndoDependencies {
  history: Pick<AgentChangeHistory, 'get' | 'markUndone'>;
  
  runLocal(
    call: ActionCall,
    installationId: string,
    signal: AbortSignal,
    precondition?: (plan: BasePlan) => boolean
  ): Promise<unknown>;
  
  checkLocal(
    call: ActionCall,
    installationId: string,
    signal: AbortSignal,
    precondition?: (plan: BasePlan) => boolean
  ): Promise<void>;
  
  itemSnapshot(item: EditableItem): Promise<string | undefined>;
  now?: () => number;
}


function preconditionFor(
  inverse: ActionInverse,
  index: number
): ((plan: BasePlan) => boolean) | undefined {
  const guard = inverse.tradeContent;
  const entryGuard = inverse.entryContent;
  const call = inverse.calls[index];
  const created = isCreatedItemRemoval(call.action)
    ? inverse.createdItems?.[index]
    : undefined;
  if (!guard && !entryGuard && created === undefined) return undefined;
  return (plan) => {
    if (
      guard &&
      (plan.baseContent?.path !== guard.path ||
        plan.baseContent.editRevision !== guard.editRevision)
    )
      return false;
    if (entryGuard && plan.baseEntry !== entryGuard.snapshot) return false;
    if (created === undefined) return true;
    const check = checkCreatedItem(call.action, plan, created);
    if (check === 'in_use') throw new ActionInUseError();
    return check === 'ok';
  };
}


function alreadyRemoved(call: ActionCall, error: unknown): boolean {
  return (
    isRemovalInverse(call.action) &&
    error instanceof ActionPlanError &&
    error.code === 'not_found'
  );
}


export function isUndoable(batch: AgentChangeBatch): boolean {
  const applied = batch.actions.filter(
    (action) => action.outcome === 'applied'
  );
  return (
    batch.undo?.outcome !== 'undone' &&
    applied.every((action) => action.inverse !== null) &&
    
    applied.some((action) => (action.inverse?.calls.length ?? 0) > 0)
  );
}


export async function undoAgentChange(
  deps: UndoDependencies,
  batchId: string,
  signal: AbortSignal
): Promise<'undone' | 'failed'> {
  const batch = deps.history.get(batchId);
  if (!batch || !isUndoable(batch)) return 'failed';
  const now = deps.now ?? Date.now;
  const undone = new Set(batch.undo?.undoneActions ?? []);
  let outcome: 'undone' | 'failed' = 'undone';
  
  let reason: 'in_use' | undefined;
  const order = batch.actions
    .flatMap((action, index) =>
      action.outcome === 'applied' ? [{ action, index }] : []
    )
    .reverse();
  
  
  for (const { action, index } of order) {
    if (undone.has(index) || !action.inverse) continue;
    try {
      const inverse = action.inverse;
      const itemGuard = inverse.itemGuard;
      if (itemGuard) {
        const current = await deps.itemSnapshot(itemGuard);
        if (current === undefined) {
          
          undone.add(index);
          continue;
        }
        if (current !== itemGuard.snapshot) {
          
          outcome = 'failed';
          break;
        }
      }
      
      
      
      
      if (inverse.calls.length > 1) {
        for (const [callIndex, call] of inverse.calls.entries()) {
          try {
            await deps.checkLocal(
              call,
              batch.installationId,
              signal,
              preconditionFor(inverse, callIndex)
            );
          } catch (error) {
            if (!alreadyRemoved(call, error)) throw error;
          }
        }
      }
      for (const [callIndex, call] of inverse.calls.entries()) {
        try {
          await deps.runLocal(
            call,
            batch.installationId,
            signal,
            preconditionFor(inverse, callIndex)
          );
        } catch (error) {
          
          
          if (!alreadyRemoved(call, error)) throw error;
        }
      }
      undone.add(index);
    } catch (error) {
      if (signal.aborted) throw error;
      if (isInUseError(error)) reason = 'in_use';
      outcome = 'failed';
      break;
    }
  }
  await deps.history.markUndone(batchId, {
    at: now(),
    outcome,
    undoneActions: [...undone].sort((left, right) => left - right),
    ...(outcome === 'failed' && reason ? { reason } : {}),
  });
  return outcome;
}
