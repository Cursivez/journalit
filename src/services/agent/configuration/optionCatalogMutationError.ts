type OptionCatalogMutationErrorCode =
  | 'invalid_request'
  | 'not_found'
  | 'conflict'
  | 'limit_exceeded'
  | 'internal_error';

export class OptionCatalogMutationError extends Error {
  constructor(
    readonly code: OptionCatalogMutationErrorCode,
    
    readonly inUse = false
  ) {
    super('Option catalog mutation failed.');
    this.name = 'OptionCatalogMutationError';
  }
}
