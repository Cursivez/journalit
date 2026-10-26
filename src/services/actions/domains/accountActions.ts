import { t, tPlural } from '../../../lang/helpers';
import type {
  AccountMetadata,
  CopyTradingPeriod,
} from '../../../settings/types';
import { parseCuratedCurrencyCode } from '../../../utils/currencyConfig';
import { formatActionMoney } from './actionDisplayFormat';
import { parseLocalDateSafe } from '../../../utils/dateUtils';
import {
  hasActiveCopyTradingPeriod,
  isAccountUsedAsActiveCopyBase,
  nextCopyTradingPeriods,
} from '../../../utils/accountCopyTrading';
import {
  DrawdownType,
  ProfitTargetType,
  TransactionType,
  type ManualDrawdownSnapshot,
} from '../../account/types';
import {
  accountDefinitionIssue,
  type AccountDefinitionIssue,
} from '../../account/accountDefinitionRules';
import { toLiveBalanceAdjustment } from '../../account/liveBalanceAdjustment';
import type { AccountPageService } from '../../accountPage/AccountPageService';
import {
  accountRevision,
  transactionCalendarDate,
} from '../../agent/configuration/accountConfiguration';
import type { AccountSources } from '../../agent/configuration/accountConfigurationSources';
import type { AccountConfigurationSource } from '../../agent/configuration/accountConfiguration';
import { normalizeAccountLookupKey } from '../../trade/core/TradeAccountIdentity';
import { eventBus } from '../../events/EventBus';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionDefinitions,
  type ActionInput,
  type ActionPlanContext,
} from '../ActionTypes';
import { throwIfAborted } from './tradeActionSupport';
import {
  restoringUpdate,
  sameStored,
  type ChangedField,
  type UpdateFields,
} from './accountRestore';
import {
  accountWriteError,
  expectAccountUnchanged,
  expectNoAccount,
} from './accountWriteGuard';

type AccountActionId =
  | 'account.create'
  | 'account.update'
  | 'account.rename'
  | 'account.delete'
  | 'account.add_transaction'
  | 'account.delete_transaction';
type CreateInput = ActionInput<'account.create'>;
type WireDrawdown = NonNullable<CreateInput['drawdown']>;
type WireProfitTarget = NonNullable<CreateInput['profit_target']>;
type WireCopyTrading = NonNullable<CreateInput['copy_trading']>;

const CHANGED_FIELD_ORDER: readonly ChangedField[] = [
  'account_type',
  'currency',
  'created_date',
  'initial_balance',
  'live_balance',
  'drawdown',
  'profit_target',
  'monthly_cost',
  'copy_trading',
];


const FIELD_KEYS: Record<
  Exclude<ChangedField, 'live_balance'>,
  readonly (keyof AccountMetadata)[]
> = {
  account_type: ['accountType'],
  currency: ['currency'],
  created_date: ['createdDate'],
  initial_balance: ['initialBalance', 'propChallenge'],
  drawdown: ['drawdownType', 'drawdownAmount', 'manualDrawdownSnapshots'],
  profit_target: [
    'hasProfitTarget',
    'profitTarget',
    'profitTargetType',
    'profitTargetDate',
  ],
  monthly_cost: ['monthlyCost'],
  copy_trading: ['copyTradingPeriods'],
};


const ISSUE_FIELDS: Record<AccountDefinitionIssue, string> = {
  'balance-negative': 'initial_balance',
  'rule-incomplete': 'account_id',
  'drawdown-required': 'drawdown',
  'profit-target-required': 'profit_target',
  'profit-target-needs-balance': 'profit_target',
  'phase-profit-target-needs-balance': 'account_id',
  'invalid-date': 'created_date',
  'future-date': 'created_date',
  'cost-negative': 'monthly_cost',
};

interface AccountActionDependencies {
  readSources(signal: AbortSignal): Promise<AccountSources>;
  
  getAccountTypes(): readonly string[];
  getDefaultCurrency(): string;
  getStoredMetadata(): Readonly<Record<string, AccountMetadata>> | undefined;
  accounts: Pick<
    AccountPageService,
    | 'updateAccountMetadata'
    | 'renameAccountMetadata'
    | 'deleteAccount'
    | 'addManualDeposit'
    | 'addManualWithdrawal'
    | 'deleteManualTransaction'
    | 'getAccountPageData'
  >;
  getOrCreateAccountId(name: string): Promise<string | null>;
  
  rewriteAccountNotes(oldName: string, newName: string): Promise<void>;
  
  renameAccountViews(oldName: string, newName: string): Promise<void>;
  
  countServerImportAccounts(account: {
    id: string;
    name: string;
  }): Promise<number>;
  now?: () => Date;
}

function lookupKey(name: string): string {
  return normalizeAccountLookupKey(name);
}

function storedMetadata(
  deps: AccountActionDependencies,
  name: string
): AccountMetadata | undefined {
  const key = lookupKey(name);
  return Object.entries(deps.getStoredMetadata() ?? {}).find(
    ([entry]) => lookupKey(entry) === key
  )?.[1];
}

function parseDate(value: string, field: string): Date {
  const date = parseLocalDateSafe(value);
  if (!date) throw new ActionPlanError('invalid_request', field);
  date.setHours(0, 0, 0, 0);
  return date;
}

function drawdownMetadata(
  drawdown: WireDrawdown
): Pick<
  AccountMetadata,
  'drawdownType' | 'drawdownAmount' | 'manualDrawdownSnapshots'
> {
  switch (drawdown.type) {
    case 'none':
      return {
        drawdownType: DrawdownType.NONE,
        drawdownAmount: 0,
        manualDrawdownSnapshots: [],
      };
    case 'fixed':
    case 'eod_trailing':
      return {
        drawdownType:
          drawdown.type === 'fixed'
            ? DrawdownType.FIXED
            : DrawdownType.EOD_TRAILING,
        drawdownAmount: drawdown.amount,
        manualDrawdownSnapshots: [],
      };
    case 'manual':
      return {
        drawdownType: DrawdownType.MANUAL,
        drawdownAmount: drawdown.amount,
        manualDrawdownSnapshots: drawdown.snapshots.map(
          (snapshot): ManualDrawdownSnapshot => ({
            date: parseDate(snapshot.date, 'drawdown.snapshots'),
            drawdownLimit: snapshot.limit,
            ...(snapshot.note ? { note: snapshot.note } : {}),
          })
        ),
      };
  }
}

function profitTargetMetadata(
  target: WireProfitTarget | null
): Pick<
  AccountMetadata,
  'hasProfitTarget' | 'profitTarget' | 'profitTargetType' | 'profitTargetDate'
> {
  if (target === null) {
    return {
      hasProfitTarget: false,
      profitTarget: 0,
      profitTargetType: ProfitTargetType.ABSOLUTE,
      profitTargetDate: undefined,
    };
  }
  return {
    hasProfitTarget: true,
    profitTarget: target.amount,
    profitTargetType:
      target.type === 'percentage'
        ? ProfitTargetType.PERCENTAGE
        : ProfitTargetType.ABSOLUTE,
    profitTargetDate:
      target.target_date === undefined
        ? undefined
        : parseDate(target.target_date, 'profit_target'),
  };
}


export function createAccountActions(
  deps: AccountActionDependencies
): Pick<ActionDefinitions, AccountActionId> {
  const now = deps.now ?? (() => new Date());

  const requireAccount = (
    sources: AccountSources,
    accountId: string
  ): AccountConfigurationSource => {
    const source = sources.byId(accountId);
    if (!source) throw new ActionPlanError('not_found', 'account_id');
    return source;
  };

  const requireRevision = async (
    source: AccountConfigurationSource,
    expected: string
  ): Promise<string> => {
    const revision = await accountRevision(source.name, source.metadata);
    if (revision !== expected) {
      throw new ActionPlanError('conflict', 'expected_revision');
    }
    return revision;
  };

  const resolveAccountType = (value: string, field: string): string => {
    const match = deps
      .getAccountTypes()
      .find((type) => type.toLowerCase() === value.toLowerCase());
    if (match === undefined) throw new ActionPlanError('not_found', field);
    return match;
  };

  const assertDefinition = (
    metadata: Omit<AccountMetadata, 'name' | 'lastUpdated'>,
    prefix: string
  ): void => {
    const issue = accountDefinitionIssue(
      {
        initialBalance: metadata.initialBalance,
        drawdownType: metadata.drawdownType,
        drawdownAmount: metadata.drawdownAmount,
        hasProfitTarget: metadata.hasProfitTarget,
        profitTarget: metadata.profitTarget,
        profitTargetType: metadata.profitTargetType,
        monthlyCost: metadata.monthlyCost,
        createdDate:
          metadata.createdDate instanceof Date
            ? metadata.createdDate
            : parseLocalDateSafe(metadata.createdDate),
        propChallenge: metadata.propChallenge,
      },
      now()
    );
    if (issue !== null) {
      throw new ActionPlanError(
        'invalid_request',
        
        ISSUE_FIELDS[issue] === 'account_id'
          ? 'account_id'
          : prefix + ISSUE_FIELDS[issue]
      );
    }
  };

  
  const copyRequest = (
    sources: AccountSources,
    copy: WireCopyTrading,
    account: { name: string | undefined; currency: string },
    field: string
  ) => {
    const base = sources.byId(copy.base_account_id);
    if (!base?.metadata) throw new ActionPlanError('not_found', field);
    const metadata = deps.getStoredMetadata();
    if (
      (account.name !== undefined &&
        lookupKey(base.name) === lookupKey(account.name)) ||
      hasActiveCopyTradingPeriod(base.metadata, now()) ||
      (base.metadata.currency ?? deps.getDefaultCurrency()) !==
        account.currency ||
      (account.name !== undefined &&
        isAccountUsedAsActiveCopyBase(account.name, metadata, now()))
    ) {
      throw new ActionPlanError('invalid_request', field);
    }
    return {
      enabled: true as const,
      baseAccount: base.name,
      multiplier: copy.multiplier,
      startDate:
        copy.start_date === undefined
          ? null
          : parseDate(copy.start_date, field),
    };
  };

  const create: ActionDefinition<'account.create'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const sources = await deps.readSources(signal);
      const name = input.name;
      if (
        sources.sources.some(
          (source) => lookupKey(source.name) === lookupKey(name)
        ) ||
        storedMetadata(deps, name) !== undefined
      ) {
        throw new ActionPlanError('conflict', 'name');
      }
      const accountType = resolveAccountType(
        input.account_type,
        'account_type'
      );
      
      const currency = parseCuratedCurrencyCode(
        input.currency ?? deps.getDefaultCurrency()
      );
      const createdDate = parseDate(input.created_date, 'created_date');
      const copy =
        input.copy_trading === undefined
          ? undefined
          : copyRequest(
              sources,
              input.copy_trading,
              { name: undefined, currency },
              'copy_trading'
            );
      const copyTradingPeriods: CopyTradingPeriod[] | undefined = copy
        ? nextCopyTradingPeriods([], copy, now())
        : undefined;
      const metadata: Omit<AccountMetadata, 'name' | 'lastUpdated'> = {
        accountType,
        createdDate,
        initialBalance: input.initial_balance,
        currency,
        ...drawdownMetadata(input.drawdown ?? { type: 'none' }),
        ...profitTargetMetadata(input.profit_target ?? null),
        monthlyCost: input.monthly_cost ?? 0,
        liveBalanceAdjustment: toLiveBalanceAdjustment(
          input.live_balance ?? null,
          input.initial_balance
        ),
        ...(copyTradingPeriods ? { copyTradingPeriods } : {}),
      };
      assertDefinition(metadata, '');
      return {
        target: `account:new:${name.toLowerCase()}`,
        summary: {
          name,
          account_type: accountType,
          currency: `${currency}`,
          initial_balance: input.initial_balance,
        },
        affectedNotes: 0,
        display: {
          target: name,
          changes: [
            t('actions.account.create', {
              type: accountType,
              currency,
              balance: formatActionMoney(input.initial_balance, currency),
            }),
          ],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          try {
            await deps.accounts.updateAccountMetadata(
              name,
              structuredClone(metadata),
              undefined,
              expectNoAccount
            );
          } catch (error) {
            return accountWriteError(error);
          }
          const accountId = await deps.getOrCreateAccountId(name);
          if (accountId === null) {
            throw new ActionExecutionError('outcome_unknown', false);
          }
          eventBus.publish('account:changed', {
            action: 'created',
            accountId: name,
          });
          return {
            account_id: accountId,
            revision: await accountRevision(name, storedMetadata(deps, name)),
          };
        },
      };
    },
  };

  
  const fieldUpdates = (
    fields: UpdateFields,
    before: AccountMetadata | undefined
  ): Partial<AccountMetadata> => {
    const updates: Partial<AccountMetadata> = {};
    if (fields.account_type !== undefined) {
      updates.accountType = resolveAccountType(
        fields.account_type,
        'fields.account_type'
      );
    }
    if (fields.currency !== undefined) {
      updates.currency = parseCuratedCurrencyCode(fields.currency);
    }
    if (fields.created_date !== undefined) {
      updates.createdDate = parseDate(
        fields.created_date,
        'fields.created_date'
      );
    }
    if (fields.initial_balance !== undefined) {
      updates.initialBalance = fields.initial_balance;
      
      if (
        before?.propChallenge !== undefined &&
        before.propChallenge.phases.length > 0
      ) {
        updates.propChallenge = {
          ...before.propChallenge,
          phases: before.propChallenge.phases.map((phase, index) =>
            index === 0
              ? { ...phase, startingBalance: fields.initial_balance ?? 0 }
              : phase
          ),
        };
      }
    }
    if (fields.drawdown !== undefined) {
      Object.assign(updates, drawdownMetadata(fields.drawdown));
    }
    if (fields.profit_target !== undefined) {
      Object.assign(updates, profitTargetMetadata(fields.profit_target));
    }
    if (fields.monthly_cost !== undefined) {
      updates.monthlyCost = fields.monthly_cost;
    }
    return updates;
  };

  const update: ActionDefinition<'account.update'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const sources = await deps.readSources(signal);
      const source = requireAccount(sources, input.account_id);
      const baseRevision = await requireRevision(
        source,
        input.expected_revision
      );
      const fields: UpdateFields = input.fields;
      const before = source.metadata;
      const challenge = before?.propChallenge;
      if (
        challenge !== undefined &&
        (fields.drawdown !== undefined || fields.profit_target !== undefined)
      ) {
        
        throw new ActionPlanError(
          'unsupported_capability',
          fields.drawdown !== undefined
            ? 'fields.drawdown'
            : 'fields.profit_target'
        );
      }
      const currency =
        fields.currency ?? before?.currency ?? deps.getDefaultCurrency();
      const updates = fieldUpdates(fields, before);
      if (fields.copy_trading !== undefined) {
        const request =
          fields.copy_trading === null
            ? ({ enabled: false } as const)
            : copyRequest(
                sources,
                fields.copy_trading,
                { name: source.name, currency },
                'fields.copy_trading'
              );
        updates.copyTradingPeriods = nextCopyTradingPeriods(
          before?.copyTradingPeriods ?? [],
          request,
          now()
        );
      }
      const after = {
        accountType: 'demo',
        createdDate: now(),
        initialBalance: 0,
        drawdownType: DrawdownType.NONE,
        drawdownAmount: 0,
        hasProfitTarget: false,
        profitTarget: 0,
        profitTargetType: ProfitTargetType.ABSOLUTE,
        monthlyCost: 0,
        ...before,
        ...updates,
      };
      assertDefinition(after, 'fields.');

      const changed = CHANGED_FIELD_ORDER.filter((field) => {
        if (fields[field] === undefined) return false;
        
        if (field === 'live_balance' || before === undefined) return true;
        return FIELD_KEYS[field].some(
          (key) => key in updates && !sameStored(updates[key], before[key])
        );
      });
      const liveBalance = fields.live_balance;
      return {
        target: `account:${source.accountId}`,
        summary: {
          account_id: source.accountId,
          base_revision: baseRevision,
          changed_fields: changed,
        },
        affectedNotes: 0,
        display: {
          target: source.name,
          changes:
            changed.length === 0
              ? []
              : [
                  t('actions.setup.update', {
                    fields: changed
                      .map((field) => t(`actions.account.field.${field}`))
                      .join(', '),
                  }),
                ],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          if (changed.length === 0) {
            return new ActionExecution(
              { account_id: source.accountId, revision: baseRevision },
              { restoreInput: 'unchanged' }
            );
          }
          const finalUpdates: Partial<AccountMetadata> = { ...updates };
          if (liveBalance !== undefined) {
            
            
            const page = await deps.accounts.getAccountPageData(source.name);
            const computed =
              (page?.account.currentBalance ?? before?.initialBalance ?? 0) -
              (page?.account.liveBalanceAdjustment ?? 0) +
              ((updates.initialBalance ?? before?.initialBalance ?? 0) -
                (before?.initialBalance ?? 0));
            finalUpdates.liveBalanceAdjustment = toLiveBalanceAdjustment(
              liveBalance,
              computed
            );
          }
          try {
            await deps.accounts.updateAccountMetadata(
              source.name,
              finalUpdates,
              undefined,
              expectAccountUnchanged(source.name, before)
            );
          } catch (error) {
            return accountWriteError(error);
          }
          eventBus.publish('account:changed', {
            action: 'updated',
            accountId: source.name,
            accountName: source.name,
            accountNames: [source.name],
          });
          const written = storedMetadata(deps, source.name);
          const revision = await accountRevision(source.name, written);
          return new ActionExecution(
            { account_id: source.accountId, revision },
            {
              restoreInput:
                context.origin === 'agent'
                  ? restoringUpdate(
                      { accountId: source.accountId, revision, changed },
                      before,
                      written,
                      fieldUpdates
                    )
                  : null,
            }
          );
        },
      };
    },
  };

  const rename: ActionDefinition<'account.rename'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const sources = await deps.readSources(signal);
      const source = requireAccount(sources, input.account_id);
      const baseRevision = await requireRevision(
        source,
        input.expected_revision
      );
      if (input.name === source.name) {
        throw new ActionPlanError('invalid_request', 'name');
      }
      if (
        sources.sources.some(
          (other) =>
            other.accountId !== source.accountId &&
            lookupKey(other.name) === lookupKey(input.name)
        )
      ) {
        throw new ActionPlanError('conflict', 'name');
      }
      const previousName = source.name;
      return {
        target: `account:${source.accountId}`,
        writes: sources
          .tradePathsFor(source.accountId)
          .map((path) => `note:${path}`),
        summary: {
          account_id: source.accountId,
          base_revision: baseRevision,
          previous_name: previousName,
          name: input.name,
          trade_count: source.tradeCount,
        },
        affectedNotes: source.tradeCount,
        display: {
          target: previousName,
          changes: [
            t('actions.account.rename', { name: input.name }),
            ...(source.tradeCount > 0
              ? [tPlural('actions.account.rename-trades', source.tradeCount)]
              : []),
          ],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          try {
            await deps.accounts.renameAccountMetadata(
              previousName,
              input.name,
              {},
              undefined,
              expectAccountUnchanged(previousName, source.metadata)
            );
          } catch (error) {
            return accountWriteError(error);
          }
          try {
            await deps.rewriteAccountNotes(previousName, input.name);
          } catch {
            
            
            throw new ActionExecutionError('outcome_unknown', false);
          }
          eventBus.publish('account:changed', {
            action: 'updated',
            accountId: input.name,
            accountName: input.name,
            accountNames: [previousName, input.name],
          });
          await deps
            .renameAccountViews(previousName, input.name)
            .catch((error: unknown) =>
              console.warn(
                '[Journalit] Could not retitle renamed account pages:',
                error
              )
            );
          return {
            account_id: source.accountId,
            revision: await accountRevision(
              input.name,
              storedMetadata(deps, input.name)
            ),
          };
        },
      };
    },
  };

  const deletable = async (
    account: AccountConfigurationSource,
    signal: AbortSignal
  ): Promise<boolean> => {
    if (account.tradeCount > 0 || account.brokerLinked) return false;
    const copiedBy = Object.values(deps.getStoredMetadata() ?? {}).some(
      (metadata) =>
        (metadata.copyTradingPeriods ?? []).some(
          (period) => lookupKey(period.baseAccount) === lookupKey(account.name)
        )
    );
    if (copiedBy) return false;
    const serverAccounts = await deps.countServerImportAccounts({
      id: account.accountId,
      name: account.name,
    });
    throwIfAborted(signal);
    return serverAccounts === 0;
  };

  const remove: ActionDefinition<'account.delete'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const sources = await deps.readSources(signal);
      const source = requireAccount(sources, input.account_id);
      const baseRevision = await requireRevision(
        source,
        input.expected_revision
      );
      
      
      if (!(await deletable(source, signal))) {
        throw new ActionPlanError('conflict', 'account_id');
      }
      return {
        target: `account:${source.accountId}`,
        summary: {
          account_id: source.accountId,
          base_revision: baseRevision,
          name: source.name,
        },
        affectedNotes: 0,
        display: {
          target: source.name,
          changes: [t('actions.account.delete')],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          const current = await deps.readSources(executionSignal);
          const latest = current.byId(source.accountId);
          if (!latest) throw new ActionExecutionError('not_found', false);
          
          
          if (!(await deletable(latest, executionSignal))) {
            throw new ActionExecutionError('conflict', false);
          }
          try {
            await deps.accounts.deleteAccount(
              source.name,
              { deleteAssociatedTrades: false },
              expectAccountUnchanged(source.name, source.metadata)
            );
          } catch (error) {
            return accountWriteError(error);
          }
          return { account_id: source.accountId };
        },
      };
    },
  };

  const addTransaction: ActionDefinition<'account.add_transaction'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const sources = await deps.readSources(signal);
      const source = requireAccount(sources, input.account_id);
      
      
      if (source.metadata === undefined) {
        throw new ActionPlanError('invalid_request', 'account_id');
      }
      const localDate = parseDate(input.date, 'date');
      
      
      const date = new Date(
        Date.UTC(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate()
        )
      );
      const description = input.description;
      return {
        target: `account_transaction:new:${source.accountId}:${input.date}:${input.type}:${input.amount}`,
        dependsOn: [`account:${source.accountId}`],
        summary: {
          account_id: source.accountId,
          type: input.type,
          amount: input.amount,
          date: input.date,
        },
        affectedNotes: 0,
        display: {
          target: source.name,
          changes: [
            t(`actions.account.transaction.${input.type}`, {
              amount: formatActionMoney(
                input.amount,
                source.metadata.currency ?? deps.getDefaultCurrency()
              ),
              date: input.date,
            }),
          ],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          let transactionId: string;
          try {
            transactionId =
              input.type === 'deposit'
                ? await deps.accounts.addManualDeposit(
                    source.name,
                    input.amount,
                    date,
                    description,
                    'day'
                  )
                : await deps.accounts.addManualWithdrawal(
                    source.name,
                    input.amount,
                    date,
                    description,
                    'day'
                  );
          } catch (error) {
            return accountWriteError(error);
          }
          return {
            account_id: source.accountId,
            transaction_id: transactionId,
          };
        },
      };
    },
  };

  const deleteTransaction: ActionDefinition<'account.delete_transaction'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const sources = await deps.readSources(signal);
      const source = requireAccount(sources, input.account_id);
      const transaction = source.metadata?.manualTransactions?.find(
        (candidate) => candidate.id === input.transaction_id
      );
      const localDate =
        transaction === undefined
          ? undefined
          : transactionCalendarDate(transaction);
      if (
        !transaction ||
        localDate === undefined ||
        (transaction.type !== TransactionType.DEPOSIT &&
          transaction.type !== TransactionType.WITHDRAWAL)
      ) {
        throw new ActionPlanError('not_found', 'transaction_id');
      }
      const type =
        transaction.type === TransactionType.DEPOSIT ? 'deposit' : 'withdrawal';
      const amount = Math.abs(transaction.amount);
      return {
        target: `account_transaction:${transaction.id}`,
        dependsOn: [`account:${source.accountId}`],
        summary: {
          account_id: source.accountId,
          transaction_id: transaction.id,
          type,
          amount,
          date: localDate,
        },
        affectedNotes: 0,
        display: {
          target: source.name,
          changes: [
            t(`actions.account.transaction.delete-${type}`, {
              amount: formatActionMoney(
                amount,
                source.metadata?.currency ?? deps.getDefaultCurrency()
              ),
              date: localDate,
            }),
          ],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          const stillThere = storedMetadata(
            deps,
            source.name
          )?.manualTransactions?.some(
            (candidate) => candidate.id === transaction.id
          );
          if (!stillThere) throw new ActionExecutionError('not_found', false);
          try {
            await deps.accounts.deleteManualTransaction(
              source.name,
              transaction.id
            );
          } catch (error) {
            return accountWriteError(error);
          }
          return {
            account_id: source.accountId,
            transaction_id: transaction.id,
          };
        },
      };
    },
  };

  return {
    'account.create': create,
    'account.update': update,
    'account.rename': rename,
    'account.delete': remove,
    'account.add_transaction': addTransaction,
    'account.delete_transaction': deleteTransaction,
  };
}
