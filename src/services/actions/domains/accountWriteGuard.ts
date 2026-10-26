import type { AccountMetadata } from '../../../settings/types';
import type { AccountMetadataExpectation } from '../../accountPage/AccountPageService';
import { accountContentKey } from '../../agent/configuration/accountConfiguration';
import { ActionExecutionError } from '../ActionErrors';


class AccountChangedError extends Error {}


export function expectAccountUnchanged(
  name: string,
  planned: Readonly<AccountMetadata> | undefined
): AccountMetadataExpectation {
  const key = accountContentKey(name, planned);
  return (current) => {
    if (accountContentKey(name, current) !== key) {
      throw new AccountChangedError();
    }
  };
}


export const expectNoAccount: AccountMetadataExpectation = (current) => {
  if (current !== undefined) throw new AccountChangedError();
};


export function accountWriteError(error: unknown): never {
  if (error instanceof ActionExecutionError) throw error;
  if (error instanceof AccountChangedError) {
    throw new ActionExecutionError('conflict', false);
  }
  throw new ActionExecutionError('write_failed', true);
}
