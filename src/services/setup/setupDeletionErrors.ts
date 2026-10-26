
export class SetupChangedError extends Error {
  constructor() {
    super('Setup changed before deletion. Refresh it before retrying.');
    this.name = 'SetupChangedError';
  }
}


export class SetupInUseError extends Error {
  constructor() {
    super('A note references this setup. Review it before deleting.');
    this.name = 'SetupInUseError';
  }
}


export class SetupDeletionOutcomeError extends AggregateError {
  readonly outcome: 'deleted' | 'unknown';

  constructor(outcome: 'deleted' | 'unknown', errors: readonly unknown[]) {
    super(
      errors,
      outcome === 'deleted'
        ? 'The setup was deleted, but Journalit could not finish refreshing. Refresh Journalit before continuing.'
        : 'Setup deletion could not be confirmed and linked references may already have changed. Review the setup and affected trades before retrying.'
    );
    this.name = 'SetupDeletionOutcomeError';
    this.outcome = outcome;
  }
}
