import { normalizeAccountLookupKey } from '../../trade/core/TradeAccountIdentity';
import { defineOwnEntry } from '../../../utils/defineOwnEntry';

const ACCOUNT_AGENT_ID_PATTERN =
  /^account_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function isAccountAgentId(value: unknown): value is string {
  return typeof value === 'string' && ACCOUNT_AGENT_ID_PATTERN.test(value);
}

export function sanitizeAccountAgentIds(
  value: unknown
): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const sanitized: Record<string, string> = {};
  const retainedIds = new Set<string>();
  for (const [key, id] of Object.entries(value)) {
    if (
      key.length > 0 &&
      normalizeAccountLookupKey(key) === key &&
      isAccountAgentId(id) &&
      !retainedIds.has(id)
    ) {
      defineOwnEntry(sanitized, key, id);
      retainedIds.add(id);
    }
  }
  return sanitized;
}

interface AccountIdentityRenameRollback {
  rollback(): void;
}

export function applyAccountIdentityRename(
  identities: Record<string, string>,
  oldAccountName: string,
  newAccountName: string
): AccountIdentityRenameRollback {
  const oldKey = normalizeAccountLookupKey(oldAccountName);
  const newKey = normalizeAccountLookupKey(newAccountName);
  if (
    oldKey === newKey ||
    !Object.prototype.hasOwnProperty.call(identities, oldKey)
  ) {
    return { rollback: () => undefined };
  }

  const oldId = identities[oldKey];
  const previousNewId = Object.prototype.hasOwnProperty.call(identities, newKey)
    ? identities[newKey]
    : undefined;
  if (previousNewId === undefined) {
    defineOwnEntry(identities, newKey, oldId);
  }
  delete identities[oldKey];

  return {
    rollback: () => {
      defineOwnEntry(identities, oldKey, oldId);
      if (previousNewId === undefined) {
        delete identities[newKey];
      } else {
        defineOwnEntry(identities, newKey, previousNewId);
      }
    },
  };
}
