
export type ActionPlanErrorCode =
  | 'invalid_request'
  | 'not_found'
  | 'conflict'
  | 'limit_exceeded'
  | 'unsupported_capability';

const FIELD_PATTERN = /^[a-z_]{1,40}(\.[a-z_]{1,40}){0,3}$/;

export class ActionPlanError extends Error {
  readonly code: ActionPlanErrorCode;
  readonly field: string | undefined;

  constructor(code: ActionPlanErrorCode, field?: string) {
    super(`Action planning failed: ${code}`);
    this.name = 'ActionPlanError';
    if (field !== undefined && !FIELD_PATTERN.test(field)) {
      throw new Error('Action plan error fields must be structural paths.');
    }
    this.code = code;
    this.field = field;
  }
}


type ActionExecutionErrorCode =
  | 'invalid_request'
  | 'permission_denied'
  | 'not_found'
  | 'conflict'
  | 'unsupported_operation'
  | 'write_failed'
  | 'outcome_unknown'
  | 'internal_error';

const NEVER_RETRYABLE: ReadonlySet<ActionExecutionErrorCode> = new Set([
  'invalid_request',
  'unsupported_operation',
  'outcome_unknown',
]);

export class ActionExecutionError extends Error {
  readonly code: ActionExecutionErrorCode;
  readonly retryable: boolean;

  constructor(code: ActionExecutionErrorCode, retryable: boolean) {
    super(`Action execution failed: ${code}`);
    this.name = 'ActionExecutionError';
    this.code = code;
    this.retryable = NEVER_RETRYABLE.has(code) ? false : retryable;
  }
}


export class ActionInUseError extends ActionExecutionError {
  constructor() {
    super('conflict', false);
    this.name = 'ActionInUseError';
  }
}


export class ActionPlanInUseError extends ActionPlanError {
  constructor() {
    super('conflict');
    this.name = 'ActionPlanInUseError';
  }
}


export function isInUseError(error: unknown): boolean {
  return (
    error instanceof ActionInUseError || error instanceof ActionPlanInUseError
  );
}
