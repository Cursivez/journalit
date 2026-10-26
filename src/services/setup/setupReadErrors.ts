
export class SetupNoteFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SetupNoteFormatError';
  }
}


export class SetupCatalogInvalidError extends Error {
  constructor() {
    super(
      'Setup notes contain invalid frontmatter or tags. Repair them in Journalit before retrying.'
    );
    this.name = 'SetupCatalogInvalidError';
  }
}

export const SETUP_IDENTITY_UNAVAILABLE_ERROR =
  'Setup identities are temporarily unavailable';

export function normalizeSetupReadError(error: unknown): Error {
  if (error instanceof SetupCatalogInvalidError) return error;
  if (error instanceof SetupNoteFormatError)
    return new SetupCatalogInvalidError();
  return new Error(SETUP_IDENTITY_UNAVAILABLE_ERROR);
}

export function assertCompleteSetupDiscovery(discovery: {
  errors: readonly unknown[];
  hasInvalidNotes: boolean;
}): void {
  if (discovery.hasInvalidNotes) throw new SetupCatalogInvalidError();
  if (discovery.errors.length > 0)
    throw new Error(SETUP_IDENTITY_UNAVAILABLE_ERROR);
}
