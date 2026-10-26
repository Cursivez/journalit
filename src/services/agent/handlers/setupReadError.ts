import { SetupCatalogInvalidError } from '../../setup/setupReadErrors';


export function setupReadErrorResult(error: unknown) {
  if (!(error instanceof SetupCatalogInvalidError)) return undefined;
  return {
    status: 'error' as const,
    code: 'conflict' as const,
    message: error.message,
    retryable: false as const,
  };
}
