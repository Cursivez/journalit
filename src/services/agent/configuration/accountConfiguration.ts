import type { AccountMetadata } from '../../../settings/types';
import {
  DrawdownType,
  ProfitTargetType,
  TransactionType,
} from '../../account/types';
import { normalizeLiveBalanceAdjustment } from '../../account/liveBalanceAdjustment';
import {
  formatLocalDateString,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import type { AgentToolContracts } from '../protocol';
import {
  configurationRevision,
  isBoundedString,
  isOpaqueId,
  isRecord,
} from './configurationPrimitives';
import { defineOwnEntry } from '../../../utils/defineOwnEntry';
import { isTimedAccountEvent } from '../../../components/accountPage/components/accountEventDate';

type Configuration = Extract<
  AgentToolContracts['inspect_configuration']['result'],
  { status: 'ok' }
>['configuration'];
type AccountsProjection = NonNullable<Configuration['accounts']>;
type WireAccount = AccountsProjection['accounts'][number];
type WireDrawdown = NonNullable<WireAccount['drawdown']>;
type WireTransaction = NonNullable<WireAccount['manual_transactions']>[number];
type WireCopyPeriod = NonNullable<WireAccount['copy_trading']>[number];

const MAX_ACCOUNTS = 200;
const MAX_TRANSACTIONS = 500;
const MAX_SNAPSHOTS = 500;
const MAX_COPY_PERIODS = 50;
const MAX_AMOUNT = 1_000_000_000_000;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;


export interface AccountConfigurationSource {
  readonly accountId: string;
  readonly name: string;
  
  readonly metadata: Readonly<AccountMetadata> | undefined;
  readonly archived: boolean;
  readonly brokerLinked: boolean;
  readonly tradeCount: number;
}


export function accountContentKey(
  name: string,
  metadata: Readonly<AccountMetadata> | undefined
): string {
  
  
  
  return JSON.stringify(
    {
      name,
      stored:
        metadata === undefined ? null : { ...metadata, lastUpdated: undefined },
    },
    (_key, value: unknown) => (isRecord(value) ? sortedKeys(value) : value)
  );
}

function sortedKeys(value: Record<string, unknown>): Record<string, unknown> {
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(value).sort()) {
    if (value[key] !== undefined) defineOwnEntry(sorted, key, value[key]);
  }
  return sorted;
}

export function accountRevision(
  name: string,
  metadata: Readonly<AccountMetadata> | undefined
): Promise<string> {
  return configurationRevision(JSON.parse(accountContentKey(name, metadata)));
}

function localDate(value: unknown): string | undefined {
  const date =
    value instanceof Date || typeof value === 'string'
      ? parseLocalDateSafe(value)
      : null;
  return date ? formatLocalDateString(date) : undefined;
}


export function transactionCalendarDate(transaction: {
  readonly date: unknown;
  readonly datePrecision?: 'day' | 'instant';
}): string | undefined {
  const raw = transaction.date;
  const date =
    raw instanceof Date || typeof raw === 'string'
      ? parseLocalDateSafe(raw)
      : null;
  if (!date) return undefined;
  if (isTimedAccountEvent({ date, datePrecision: transaction.datePrecision })) {
    return formatLocalDateString(date);
  }
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

function amount(value: unknown, positive: boolean): number | undefined {
  return typeof value === 'number' &&
    Number.isFinite(value) &&
    (positive ? value > 0 : value >= 0) &&
    value <= MAX_AMOUNT
    ? value
    : undefined;
}

function optionalText(value: unknown, maximum: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return isBoundedString(trimmed, maximum) ? trimmed : undefined;
}

function projectDrawdown(
  metadata: Readonly<AccountMetadata>
): WireDrawdown | undefined {
  switch (metadata.drawdownType) {
    case DrawdownType.NONE:
      return { type: 'none' };
    case DrawdownType.FIXED:
    case DrawdownType.EOD_TRAILING: {
      const value = amount(metadata.drawdownAmount, true);
      return value === undefined
        ? undefined
        : { type: metadata.drawdownType, amount: value };
    }
    case DrawdownType.MANUAL: {
      const value = amount(metadata.drawdownAmount, true);
      if (value === undefined) return undefined;
      const snapshots = (metadata.manualDrawdownSnapshots ?? []).flatMap(
        (snapshot) => {
          const date = localDate(snapshot.date);
          const limit = amount(snapshot.drawdownLimit, true);
          if (date === undefined || limit === undefined) return [];
          const note = optionalText(snapshot.note, 500);
          return [{ date, limit, ...(note ? { note } : {}) }];
        }
      );
      const dates = new Set(snapshots.map((snapshot) => snapshot.date));
      if (dates.size !== snapshots.length || snapshots.length > MAX_SNAPSHOTS)
        return undefined;
      return { type: 'manual', amount: value, snapshots };
    }
    default:
      return undefined;
  }
}

function projectTransactions(
  metadata: Readonly<AccountMetadata>
): WireTransaction[] | null {
  const transactions = metadata.manualTransactions ?? [];
  if (!Array.isArray(transactions) || transactions.length > MAX_TRANSACTIONS)
    return null;
  const projected: WireTransaction[] = [];
  for (const transaction of transactions) {
    const type =
      transaction.type === TransactionType.DEPOSIT
        ? 'deposit'
        : transaction.type === TransactionType.WITHDRAWAL
          ? 'withdrawal'
          : null;
    const date = transactionCalendarDate(transaction);
    const value = amount(Math.abs(transaction.amount), true);
    if (
      !isOpaqueId(transaction.id) ||
      type === null ||
      date === undefined ||
      value === undefined
    ) {
      return null;
    }
    const description = optionalText(transaction.description, 500);
    projected.push({
      transaction_id: transaction.id,
      date,
      type,
      amount: value,
      ...(description ? { description } : {}),
    });
  }
  return projected;
}

function projectCopyTrading(
  metadata: Readonly<AccountMetadata>,
  accountIdFor: (name: string) => string | undefined
): WireCopyPeriod[] {
  return (metadata.copyTradingPeriods ?? [])
    .flatMap((period) => {
      const baseAccountId = accountIdFor(period.baseAccount);
      const startDate = localDate(period.startDate);
      const endDate =
        period.endDate === undefined ? undefined : localDate(period.endDate);
      if (
        baseAccountId === undefined ||
        startDate === undefined ||
        (period.endDate !== undefined && endDate === undefined) ||
        !(period.multiplier >= 0.1 && period.multiplier <= 100)
      ) {
        
        return [];
      }
      return [
        {
          base_account_id: baseAccountId,
          multiplier: period.multiplier,
          start_date: startDate,
          ...(endDate ? { end_date: endDate } : {}),
        },
      ];
    })
    .slice(0, MAX_COPY_PERIODS);
}


async function wireAccount(
  source: AccountConfigurationSource,
  accountIdFor: (name: string) => string | undefined
): Promise<WireAccount | null> {
  if (!isOpaqueId(source.accountId) || !isBoundedString(source.name, 120)) {
    return null;
  }
  const base = {
    account_id: source.accountId,
    name: source.name,
    archived: source.archived,
    broker_linked: source.brokerLinked,
    prop_challenge: source.metadata?.propChallenge !== undefined,
    trade_count: source.tradeCount,
    revision: await accountRevision(source.name, source.metadata),
  };
  const metadata = source.metadata;
  if (metadata === undefined) return { ...base, has_settings: false };

  const initialBalance = amount(metadata.initialBalance, false);
  const monthlyCost = amount(metadata.monthlyCost ?? 0, false);
  const createdDate = localDate(metadata.createdDate);
  const transactions = projectTransactions(metadata);
  if (
    initialBalance === undefined ||
    monthlyCost === undefined ||
    createdDate === undefined ||
    transactions === null
  ) {
    return null;
  }
  const accountType =
    typeof metadata.accountType === 'string' &&
    isBoundedString(metadata.accountType, 120)
      ? metadata.accountType
      : undefined;
  const adjustment = normalizeLiveBalanceAdjustment(
    metadata.liveBalanceAdjustment
  );
  
  
  const plain = metadata.propChallenge === undefined;
  const drawdown = plain ? projectDrawdown(metadata) : undefined;
  const profitTarget =
    plain && metadata.hasProfitTarget
      ? amount(metadata.profitTarget, true)
      : undefined;
  const targetDate =
    profitTarget === undefined
      ? undefined
      : localDate(metadata.profitTargetDate);
  return {
    ...base,
    has_settings: true,
    ...(accountType ? { account_type: accountType } : {}),
    ...(typeof metadata.currency === 'string' &&
    CURRENCY_PATTERN.test(metadata.currency)
      ? { currency: metadata.currency }
      : {}),
    created_date: createdDate,
    initial_balance: initialBalance,
    ...(adjustment !== undefined && Math.abs(adjustment) <= MAX_AMOUNT
      ? { live_balance_adjustment: adjustment }
      : {}),
    ...(drawdown ? { drawdown } : {}),
    ...(profitTarget !== undefined
      ? {
          profit_target: {
            type:
              metadata.profitTargetType === ProfitTargetType.PERCENTAGE
                ? 'percentage'
                : 'absolute',
            amount: profitTarget,
            ...(targetDate ? { target_date: targetDate } : {}),
          },
        }
      : {}),
    monthly_cost: monthlyCost,
    copy_trading: projectCopyTrading(metadata, accountIdFor),
    manual_transactions: transactions,
  };
}


export async function projectAccountConfiguration(
  sources: readonly AccountConfigurationSource[],
  accountIdFor: (name: string) => string | undefined
): Promise<AccountsProjection> {
  const accounts: WireAccount[] = [];
  let omitted = 0;
  for (const source of sources) {
    const wire =
      accounts.length < MAX_ACCOUNTS
        ? await wireAccount(source, accountIdFor)
        : null;
    if (wire === null) {
      omitted += 1;
      continue;
    }
    accounts.push(wire);
  }
  return {
    accounts,
    total_count: sources.length,
    omitted_count: omitted,
  };
}
