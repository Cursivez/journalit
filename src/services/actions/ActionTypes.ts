import type { AgentActionContracts } from '../agent/protocol/generated/actions.generated';
import type { AgentActionId } from '../agent/protocol/generated/manifest.generated';

export type ActionId = AgentActionId;
export type ActionInput<Id extends ActionId> =
  AgentActionContracts[Id]['input'];
export type ActionSummary<Id extends ActionId> =
  AgentActionContracts[Id]['summary'];
export type ActionResult<Id extends ActionId> =
  AgentActionContracts[Id]['result'];


export interface ActionDisplay {
  
  readonly target: string;
  
  readonly changes: readonly string[];
}


export interface ActionPlan<Id extends ActionId> {
  
  readonly target: string;
  
  readonly writes?: readonly string[];
  
  readonly dependsOn?: readonly string[];
  
  readonly creates?: readonly string[];
  readonly summary: ActionSummary<Id>;
  
  readonly affectedNotes: number;
  readonly display: ActionDisplay;
  
  readonly baseContent?: TradeNoteContent;
  
  readonly baseEntry?: string;
  
  readonly discardsUserSettings?: boolean;
  execute(signal: AbortSignal): Promise<ActionExecuted<Id>>;
}


export interface TradeNoteContent {
  readonly path: string;
  readonly editRevision: string;
}


export type UndoCapturingActionId =
  | 'trade.create'
  | 'setup.create'
  | 'trade.update'
  | 'account.update'
  | 'session_log_tag.update'
  | 'setup.update'
  | 'custom_field.update'
  | 'review.update'
  | 'review.update_session_log_entry'
  | 'review.update_key_event'
  | 'trade.set_image_annotations'
  | 'review.set_image_annotations'
  | Extract<ActionId, `settings.${string}`>;


type RestoreInput<Id extends UndoCapturingActionId> =
  | ActionInput<Id>
  | 'unchanged'
  | null;


export class ActionExecution<Id extends UndoCapturingActionId> {
  constructor(
    readonly result: ActionResult<Id>,
    readonly undo: {
      
      readonly restoreInput?: RestoreInput<Id>;
      
      readonly tradeContent?: TradeNoteContent;
      
      readonly entrySnapshot?: string;
      
      readonly noteContent?: TradeNoteContent;
    }
  ) {}
}


export type ActionExecuted<Id extends ActionId> =
  | ActionResult<Id>
  | ActionExecution<Extract<Id, UndoCapturingActionId>>;


export type ActionOrigin = 'agent' | 'ui';

export interface ActionPlanContext {
  readonly origin: ActionOrigin;
  
  readonly installationId?: string;
  
  readonly createdEarlier?: ReadonlySet<string>;
  readonly signal: AbortSignal;
}

export interface ActionDefinition<Id extends ActionId> {
  plan(
    input: ActionInput<Id>,
    context: ActionPlanContext
  ): Promise<ActionPlan<Id>>;
}


export type ActionDefinitions = {
  readonly [Id in ActionId]: ActionDefinition<Id>;
};


export type AnyActionPlan = ActionPlan<ActionId>;
