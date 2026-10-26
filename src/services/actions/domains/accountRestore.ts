import type { AccountMetadata } from '../../../settings/types';
import { formatLocalDateString } from '../../../utils/dateUtils';
import { DrawdownType, ProfitTargetType } from '../../account/types';
import { ActionPlanError } from '../ActionErrors';
import type { ActionInput, ActionSummary } from '../ActionTypes';



export type UpdateFields = ActionInput<'account.update'>['fields'];
export type ChangedField =
  ActionSummary<'account.update'>['changed_fields'][number];
type WireDrawdown = NonNullable<UpdateFields['drawdown']>;


export function sameStored(left: unknown, right: unknown): boolean {
  const normal = (value: unknown) =>
    value === undefined || (Array.isArray(value) && value.length === 0)
      ? null
      : value;
  return JSON.stringify(normal(left)) === JSON.stringify(normal(right));
}

function wireDate(value: unknown): string | undefined {
  const date =
    value instanceof Date
      ? value
      : typeof value === 'string'
        ? new Date(value)
        : undefined;
  return date && Number.isFinite(date.getTime())
    ? formatLocalDateString(date)
    : undefined;
}

function finiteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}


function wireDrawdown(before: AccountMetadata): WireDrawdown | undefined {
  if (before.drawdownType === DrawdownType.NONE) return { type: 'none' };
  const amount = finiteNumber(before.drawdownAmount);
  if (amount === undefined || amount <= 0) return undefined;
  if (before.drawdownType === DrawdownType.FIXED) {
    return { type: 'fixed', amount };
  }
  if (before.drawdownType === DrawdownType.EOD_TRAILING) {
    return { type: 'eod_trailing', amount };
  }
  if (before.drawdownType !== DrawdownType.MANUAL) return undefined;
  const snapshots: Extract<WireDrawdown, { type: 'manual' }>['snapshots'] = [];
  for (const snapshot of before.manualDrawdownSnapshots ?? []) {
    const date = wireDate(snapshot.date);
    const limit = finiteNumber(snapshot.drawdownLimit);
    if (date === undefined || limit === undefined) return undefined;
    snapshots.push({
      date,
      limit,
      ...(snapshot.note ? { note: snapshot.note } : {}),
    });
  }
  return { type: 'manual', amount, snapshots };
}


function previousFields(
  changed: readonly ChangedField[],
  before: AccountMetadata
): UpdateFields | null {
  const fields: UpdateFields = {};
  for (const field of changed) {
    switch (field) {
      case 'live_balance':
      case 'copy_trading':
        return null;
      case 'account_type':
        if (typeof before.accountType !== 'string') return null;
        fields.account_type = before.accountType;
        break;
      case 'currency':
        if (typeof before.currency !== 'string') return null;
        fields.currency = before.currency;
        break;
      case 'created_date': {
        const date = wireDate(before.createdDate);
        if (date === undefined) return null;
        fields.created_date = date;
        break;
      }
      case 'initial_balance': {
        const balance = finiteNumber(before.initialBalance);
        if (balance === undefined) return null;
        fields.initial_balance = balance;
        break;
      }
      case 'drawdown': {
        const drawdown = wireDrawdown(before);
        if (!drawdown) return null;
        fields.drawdown = drawdown;
        break;
      }
      case 'profit_target': {
        if (!before.hasProfitTarget) {
          fields.profit_target = null;
          break;
        }
        const amount = finiteNumber(before.profitTarget);
        if (amount === undefined) return null;
        const targetDate =
          before.profitTargetDate === undefined
            ? undefined
            : wireDate(before.profitTargetDate);
        if (before.profitTargetDate !== undefined && targetDate === undefined)
          return null;
        fields.profit_target = {
          type:
            before.profitTargetType === ProfitTargetType.PERCENTAGE
              ? 'percentage'
              : 'absolute',
          amount,
          ...(targetDate === undefined ? {} : { target_date: targetDate }),
        };
        break;
      }
      case 'monthly_cost': {
        const cost = finiteNumber(before.monthlyCost);
        if (cost === undefined) return null;
        fields.monthly_cost = cost;
        break;
      }
    }
  }
  return Object.keys(fields).length > 0 ? fields : null;
}


export function restoringUpdate(
  written: {
    readonly accountId: string;
    readonly revision: string;
    readonly changed: readonly ChangedField[];
  },
  before: AccountMetadata | undefined,
  after: AccountMetadata | undefined,
  
  fieldUpdates: (
    fields: UpdateFields,
    account: AccountMetadata
  ) => Partial<AccountMetadata>
): ActionInput<'account.update'> | null {
  if (!before || !after || written.changed.length === 0) return null;
  try {
    const fields = previousFields(written.changed, before);
    if (!fields) return null;
    const restored = fieldUpdates(fields, after);
    const previous = new Map<string, unknown>(Object.entries(before));
    return Object.entries(restored).every(([key, value]) =>
      sameStored(value, previous.get(key))
    )
      ? {
          account_id: written.accountId,
          expected_revision: written.revision,
          fields,
        }
      : null;
  } catch (error) {
    if (!(error instanceof ActionPlanError)) {
      console.warn('[Journalit] Could not capture an account change:', error);
    }
    return null;
  }
}
