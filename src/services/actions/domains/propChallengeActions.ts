import { t, tPlural } from '../../../lang/helpers';
import type { AccountMetadata } from '../../../settings/types';
import { generateUUID } from '../../../utils/uuid';
import type { AccountPageService } from '../../accountPage/AccountPageService';
import {
  addPropChallengeCost,
  advancePhase,
  getCurrentPropChallengePhase,
  isPropChallengeRuleComplete,
  markChallengeFailed,
  removePropChallengeCost,
  reopenChallenge,
  setPropChallengePhaseStart,
  validatePhaseTimeline,
} from '../../propChallenge/PropChallengeConfig';
import { normalizePropChallengeConfig } from '../../propChallenge/normalization';
import { isExecutableRule } from '../../propChallenge/PropChallengeRuleReview';
import { ruleFromWire } from '../../agent/configuration/propChallengeRuleWire';
import { canonicalizeConfigurationValue } from '../../agent/configuration/configurationPrimitives';
import type { AccountSources } from '../../agent/configuration/accountConfigurationSources';
import { accountDefinitionIssue } from '../../account/accountDefinitionRules';
import { parseLocalDateSafe } from '../../../utils/dateUtils';
import { resolveStageAccountType } from '../../propChallenge/stageAccountTypes';
import type {
  PropChallengeConfig,
  PropChallengePhase,
  PropChallengeRule,
  PropChallengeStage,
} from '../../propChallenge/types';
import { accountRevision } from '../../agent/configuration/accountConfiguration';
import type { PropChallengeSource } from '../../agent/configuration/propChallengeConfiguration';
import { normalizeAccountLookupKey } from '../../trade/core/TradeAccountIdentity';
import { eventBus } from '../../events/EventBus';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import type {
  ActionDefinition,
  ActionDefinitions,
  ActionInput,
  ActionPlanContext,
} from '../ActionTypes';
import { throwIfAborted } from './tradeActionSupport';
import { accountWriteError, expectAccountUnchanged } from './accountWriteGuard';
import { formatActionMoney } from './actionDisplayFormat';

type PropChallengeActionId =
  | 'prop_challenge.advance'
  | 'prop_challenge.fail'
  | 'prop_challenge.reopen'
  | 'prop_challenge.add_cost'
  | 'prop_challenge.delete_cost'
  | 'prop_challenge.configure';

interface PropChallengeActionDependencies {
  readChallenges(signal: AbortSignal): Promise<readonly PropChallengeSource[]>;
  readAccounts(signal: AbortSignal): Promise<AccountSources>;
  getStoredMetadata(): Readonly<Record<string, AccountMetadata>> | undefined;
  getStageAccountTypes():
    | Partial<Record<PropChallengeStage, string>>
    | undefined;
  getAvailableAccountTypes(): readonly string[];
  getDefaultCurrency(): string;
  accounts: Pick<AccountPageService, 'updateAccountMetadata'>;
  now?: () => Date;
}


export function createPropChallengeActions(
  deps: PropChallengeActionDependencies
): Pick<ActionDefinitions, PropChallengeActionId> {
  const now = deps.now ?? (() => new Date());

  const storedMetadata = (name: string): AccountMetadata | undefined => {
    const key = normalizeAccountLookupKey(name);
    return Object.entries(deps.getStoredMetadata() ?? {}).find(
      ([entry]) => normalizeAccountLookupKey(entry) === key
    )?.[1];
  };

  const accountCurrency = (source: PropChallengeSource): string =>
    source.account.metadata?.currency ?? deps.getDefaultCurrency();

  const requireChallenge = async (
    accountId: string,
    signal: AbortSignal
  ): Promise<PropChallengeSource> => {
    const source = (await deps.readChallenges(signal)).find(
      (candidate) => candidate.account.accountId === accountId
    );
    throwIfAborted(signal);
    if (!source) throw new ActionPlanError('not_found', 'account_id');
    return source;
  };

  const requireRevision = async (
    source: PropChallengeSource,
    expected: string
  ): Promise<string> => {
    const revision = await accountRevision(
      source.account.name,
      source.account.metadata
    );
    if (revision !== expected) {
      throw new ActionPlanError('conflict', 'expected_revision');
    }
    return revision;
  };

  const stageAccountType = (
    stage: PropChallengeStage | undefined
  ): string | undefined =>
    resolveStageAccountType(
      deps.getStageAccountTypes(),
      stage,
      deps.getAvailableAccountTypes()
    );

  
  const writePlanned = async (
    source: PropChallengeSource,
    next: PropChallengeConfig,
    accountType: string | undefined
  ): Promise<string> => {
    const { name, metadata } = source.account;
    try {
      await deps.accounts.updateAccountMetadata(
        name,
        { propChallenge: next, ...(accountType ? { accountType } : {}) },
        undefined,
        expectAccountUnchanged(name, metadata)
      );
    } catch (error) {
      return accountWriteError(error);
    }
    eventBus.publish('account:changed', {
      action: 'updated',
      accountId: name,
      accountName: name,
    });
    return accountRevision(name, storedMetadata(name));
  };

  
  const writeCosts = async (
    source: PropChallengeSource,
    change: (config: PropChallengeConfig) => PropChallengeConfig
  ): Promise<void> => {
    const { name } = source.account;
    const current = storedMetadata(name);
    if (!current?.propChallenge) {
      throw new ActionExecutionError('not_found', false);
    }
    try {
      await deps.accounts.updateAccountMetadata(
        name,
        { propChallenge: change(current.propChallenge) },
        undefined,
        expectAccountUnchanged(name, current)
      );
    } catch (error) {
      accountWriteError(error);
    }
    eventBus.publish('account:changed', {
      action: 'updated',
      accountId: name,
      accountName: name,
    });
  };

  const advance: ActionDefinition<'prop_challenge.advance'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const source = await requireChallenge(input.account_id, signal);
      const baseRevision = await requireRevision(
        source,
        input.expected_revision
      );
      const { config } = source;
      const current = getCurrentPropChallengePhase(config);
      if (config.status !== 'active' || !current) {
        throw new ActionPlanError('conflict', 'account_id');
      }
      const at = new Date(input.at);
      const startedAt = current.startedAt
        ? Date.parse(current.startedAt)
        : Number.NaN;
      if (
        Number.isNaN(at.getTime()) ||
        at.getTime() > now().getTime() ||
        (!Number.isNaN(startedAt) && at.getTime() < startedAt)
      ) {
        throw new ActionPlanError('invalid_request', 'at');
      }
      const next = advancePhase(config, at);
      if (next === config) throw new ActionPlanError('conflict', 'account_id');
      const currentIndex = config.phases.findIndex(
        (phase) => phase.id === current.id
      );
      const nextPhase = config.phases[currentIndex + 1];
      const accountType = nextPhase
        ? stageAccountType(nextPhase.stage)
        : undefined;
      return {
        target: `account:${source.account.accountId}`,
        summary: {
          account_id: source.account.accountId,
          base_revision: baseRevision,
          from_phase_id: current.id,
          ...(nextPhase ? { to_phase_id: nextPhase.id } : {}),
          at: input.at,
          ...(accountType ? { account_type: accountType } : {}),
        },
        affectedNotes: 0,
        display: {
          target: source.account.name,
          changes: [
            nextPhase
              ? t('actions.prop-challenge.advance', {
                  from: current.name,
                  to: nextPhase.name,
                })
              : t('actions.prop-challenge.conclude', { phase: current.name }),
            ...(accountType
              ? [
                  t('actions.prop-challenge.account-type', {
                    type: accountType,
                  }),
                ]
              : []),
          ],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          return {
            account_id: source.account.accountId,
            revision: await writePlanned(source, next, accountType),
          };
        },
      };
    },
  };

  const fail: ActionDefinition<'prop_challenge.fail'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const source = await requireChallenge(input.account_id, signal);
      const baseRevision = await requireRevision(
        source,
        input.expected_revision
      );
      const current = getCurrentPropChallengePhase(source.config);
      if (source.config.status !== 'active' || !current) {
        throw new ActionPlanError('conflict', 'account_id');
      }
      return {
        target: `account:${source.account.accountId}`,
        summary: {
          account_id: source.account.accountId,
          base_revision: baseRevision,
          phase_id: current.id,
        },
        affectedNotes: 0,
        display: {
          target: source.account.name,
          changes: [t('actions.prop-challenge.fail', { phase: current.name })],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          return {
            account_id: source.account.accountId,
            revision: await writePlanned(
              source,
              markChallengeFailed(source.config, now()),
              undefined
            ),
          };
        },
      };
    },
  };

  const reopen: ActionDefinition<'prop_challenge.reopen'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const source = await requireChallenge(input.account_id, signal);
      const baseRevision = await requireRevision(
        source,
        input.expected_revision
      );
      const next = reopenChallenge(source.config);
      const phase = next.phases.find(
        (candidate) => candidate.id === next.currentPhaseId
      );
      if (next === source.config || !phase) {
        throw new ActionPlanError('conflict', 'account_id');
      }
      
      
      const accountType = stageAccountType(
        getCurrentPropChallengePhase(source.config)?.stage
      );
      return {
        target: `account:${source.account.accountId}`,
        summary: {
          account_id: source.account.accountId,
          base_revision: baseRevision,
          phase_id: phase.id,
          ...(accountType ? { account_type: accountType } : {}),
        },
        affectedNotes: 0,
        display: {
          target: source.account.name,
          changes: [t('actions.prop-challenge.reopen', { phase: phase.name })],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          return {
            account_id: source.account.accountId,
            revision: await writePlanned(source, next, accountType),
          };
        },
      };
    },
  };

  const addCost: ActionDefinition<'prop_challenge.add_cost'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const source = await requireChallenge(input.account_id, signal);
      const cost = {
        id: generateUUID(),
        kind: input.kind,
        date: input.date,
        amount: input.amount,
        ...(input.note ? { note: input.note } : {}),
      };
      return {
        target: `prop_challenge_cost:new:${source.account.accountId}:${input.date}:${input.kind}:${input.amount}`,
        dependsOn: [`account:${source.account.accountId}`],
        summary: {
          account_id: source.account.accountId,
          kind: input.kind,
          amount: input.amount,
          date: input.date,
        },
        affectedNotes: 0,
        display: {
          target: source.account.name,
          changes: [
            t(`actions.prop-challenge.cost.${input.kind}`, {
              amount: formatActionMoney(input.amount, accountCurrency(source)),
              date: input.date,
            }),
          ],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          await writeCosts(source, (config) =>
            addPropChallengeCost(config, cost)
          );
          return { account_id: source.account.accountId, cost_id: cost.id };
        },
      };
    },
  };

  const deleteCost: ActionDefinition<'prop_challenge.delete_cost'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const source = await requireChallenge(input.account_id, signal);
      const cost = source.config.oneTimeCosts?.find(
        (candidate) => candidate.id === input.cost_id
      );
      if (!cost) throw new ActionPlanError('not_found', 'cost_id');
      return {
        target: `prop_challenge_cost:${cost.id}`,
        dependsOn: [`account:${source.account.accountId}`],
        summary: {
          account_id: source.account.accountId,
          cost_id: cost.id,
          kind: cost.kind,
          amount: cost.amount,
          date: cost.date,
        },
        affectedNotes: 0,
        display: {
          target: source.account.name,
          changes: [
            t('actions.prop-challenge.cost.delete', {
              amount: formatActionMoney(cost.amount, accountCurrency(source)),
              date: cost.date,
            }),
          ],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          await writeCosts(source, (config) => {
            if (!config.oneTimeCosts?.some((item) => item.id === cost.id)) {
              throw new ActionExecutionError('not_found', false);
            }
            return removePropChallengeCost(config, cost.id);
          });
          return { account_id: source.account.accountId, cost_id: cost.id };
        },
      };
    },
  };

  const configure: ActionDefinition<'prop_challenge.configure'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const accounts = await deps.readAccounts(signal);
      throwIfAborted(signal);
      const account = accounts.byId(input.account_id);
      if (!account) throw new ActionPlanError('not_found', 'account_id');
      const metadata = account.metadata;
      
      if (!metadata) throw new ActionPlanError('invalid_request', 'account_id');
      const baseRevision = await accountRevision(account.name, metadata);
      if (baseRevision !== input.expected_revision) {
        throw new ActionPlanError('conflict', 'expected_revision');
      }
      const existing = metadata.propChallenge;
      const config = configuredChallenge(
        existing,
        input.challenge,
        metadata.createdDate
      );
      const removed = (existing?.phases ?? []).filter(
        (phase) => !config.phases.some((kept) => kept.id === phase.id)
      );
      const initialBalance = config.phases[0].startingBalance;
      const issue = accountDefinitionIssue(
        {
          initialBalance,
          drawdownType: metadata.drawdownType,
          drawdownAmount: metadata.drawdownAmount,
          hasProfitTarget: metadata.hasProfitTarget,
          profitTarget: metadata.profitTarget,
          profitTargetType: metadata.profitTargetType,
          monthlyCost: metadata.monthlyCost,
          createdDate: parseLocalDateSafe(
            metadata.createdDate instanceof Date
              ? metadata.createdDate
              : String(metadata.createdDate)
          ),
          propChallenge: config,
        },
        now()
      );
      if (issue !== null) {
        throw new ActionPlanError('invalid_request', 'challenge.phases');
      }
      
      
      const current = getCurrentPropChallengePhase(config);
      const before = existing
        ? getCurrentPropChallengePhase(existing)
        : undefined;
      const stageType =
        existing === undefined || before?.stage !== current?.stage
          ? stageAccountType(current?.stage)
          : undefined;
      const accountType =
        stageType !== undefined && stageType !== metadata.accountType
          ? stageType
          : undefined;
      const ruleCount = config.phases.reduce(
        (total, phase) => total + phase.rules.length,
        0
      );
      return {
        target: `account:${account.accountId}`,
        summary: {
          account_id: account.accountId,
          base_revision: baseRevision,
          created: existing === undefined,
          phase_count: config.phases.length,
          rule_count: ruleCount,
          ...(removed.length > 0
            ? { removed_phase_ids: removed.map((phase) => phase.id) }
            : {}),
          ...(accountType ? { account_type: accountType } : {}),
        },
        affectedNotes: 0,
        display: {
          target: account.name,
          changes: [
            tPlural(
              existing === undefined
                ? 'actions.prop-challenge.configure.create'
                : 'actions.prop-challenge.configure.update',
              config.phases.length,
              { name: config.challengeName || account.name }
            ),
            ...removed.map((phase) =>
              t('actions.prop-challenge.configure.remove-phase', {
                phase: phase.name,
              })
            ),
            ...(accountType
              ? [
                  t('actions.prop-challenge.account-type', {
                    type: accountType,
                  }),
                ]
              : []),
          ],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          try {
            await deps.accounts.updateAccountMetadata(
              account.name,
              {
                propChallenge: config,
                initialBalance,
                ...(accountType ? { accountType } : {}),
              },
              undefined,
              expectAccountUnchanged(account.name, metadata)
            );
          } catch (error) {
            return accountWriteError(error);
          }
          eventBus.publish('account:changed', {
            action: 'updated',
            accountId: account.name,
            accountName: account.name,
          });
          return {
            account_id: account.accountId,
            revision: await accountRevision(
              account.name,
              storedMetadata(account.name)
            ),
          };
        },
      };
    },
  };

  return {
    'prop_challenge.configure': configure,
    'prop_challenge.advance': advance,
    'prop_challenge.fail': fail,
    'prop_challenge.reopen': reopen,
    'prop_challenge.add_cost': addCost,
    'prop_challenge.delete_cost': deleteCost,
  };
}

type ChallengeInput = ActionInput<'prop_challenge.configure'>['challenge'];
type PhaseInput = ChallengeInput['phases'][number];

function sameJson(left: unknown, right: unknown): boolean {
  return (
    JSON.stringify(canonicalizeConfigurationValue(left)) ===
    JSON.stringify(canonicalizeConfigurationValue(right))
  );
}


function phaseRules(
  input: PhaseInput,
  existing: PropChallengePhase | undefined,
  field: string
): PropChallengeRule[] {
  const ruleIds = input.rules.flatMap((wire) =>
    wire.rule_id === undefined ? [] : [wire.rule_id]
  );
  if (new Set(ruleIds).size !== ruleIds.length) {
    throw new ActionPlanError('invalid_request', field);
  }
  return input.rules.map((wire) => {
    const ruleId = wire.rule_id;
    if (
      ruleId !== undefined &&
      !existing?.rules.some((rule) => rule.id === ruleId)
    ) {
      throw new ActionPlanError('not_found', field);
    }
    const rule = ruleFromWire(wire, ruleId ?? generateUUID());
    
    
    if (!rule || !isPropChallengeRuleComplete(rule)) {
      throw new ActionPlanError('invalid_request', field);
    }
    
    
    
    if (
      !isExecutableRule(rule) &&
      !existing?.rules.some(
        (archived) => archived.id === rule.id && sameJson(archived, rule)
      )
    ) {
      throw new ActionPlanError('unsupported_capability', field);
    }
    return rule;
  });
}

function phaseStart(value: string): string {
  const time = Date.parse(value);
  if (Number.isNaN(time)) {
    throw new ActionPlanError('invalid_request', 'challenge.phases');
  }
  return new Date(time).toISOString();
}


function configuredChallenge(
  existing: PropChallengeConfig | undefined,
  input: ChallengeInput,
  createdDate: Date | string
): PropChallengeConfig {
  const field = 'challenge.phases';
  const byId = new Map(existing?.phases.map((phase) => [phase.id, phase]));
  
  
  const phaseIds = input.phases.flatMap((phase) =>
    phase.phase_id === undefined ? [] : [phase.phase_id]
  );
  if (new Set(phaseIds).size !== phaseIds.length) {
    throw new ActionPlanError('invalid_request', field);
  }
  const phases = input.phases.map((phaseInput, index): PropChallengePhase => {
    const old =
      phaseInput.phase_id === undefined
        ? undefined
        : byId.get(phaseInput.phase_id);
    if (phaseInput.phase_id !== undefined && !old) {
      throw new ActionPlanError('not_found', field);
    }
    const rules = phaseRules(phaseInput, old, field);
    if (old) {
      if (
        old.policyHistory?.length &&
        (old.name !== phaseInput.name ||
          old.stage !== phaseInput.stage ||
          old.startingBalance !== phaseInput.starting_balance ||
          !sameJson(old.rules, rules))
      ) {
        
        throw new ActionPlanError('unsupported_capability', field);
      }
      const kept: PropChallengePhase = {
        ...old,
        name: phaseInput.name,
        stage: phaseInput.stage,
        startingBalance: phaseInput.starting_balance,
        rules,
      };
      if (phaseInput.started_at === undefined) return kept;
      if (old.status === 'pending') {
        throw new ActionPlanError('invalid_request', field);
      }
      return setPropChallengePhaseStart(
        kept,
        phaseStart(phaseInput.started_at)
      );
    }
    const first = existing === undefined && index === 0;
    if (phaseInput.started_at !== undefined && !first) {
      throw new ActionPlanError('invalid_request', field);
    }
    const created = parseLocalDateSafe(
      createdDate instanceof Date ? createdDate : String(createdDate)
    );
    return {
      id: generateUUID(),
      name: phaseInput.name,
      stage: phaseInput.stage,
      status: first ? 'active' : 'pending',
      startingBalance: phaseInput.starting_balance,
      rules,
      ...(first
        ? {
            startedAt:
              phaseInput.started_at !== undefined
                ? phaseStart(phaseInput.started_at)
                : (created ?? new Date()).toISOString(),
          }
        : {}),
    };
  });

  for (const phase of existing?.phases ?? []) {
    if (
      !phases.some((kept) => kept.id === phase.id) &&
      (phase.status !== 'pending' || phase.policyHistory?.length)
    ) {
      throw new ActionPlanError('conflict', field);
    }
  }
  
  
  const keptOrder = phases.flatMap((phase) => {
    const index = existing?.phases.findIndex((old) => old.id === phase.id);
    return index === undefined || index < 0 ? [] : [index];
  });
  if (
    keptOrder.some((value, index) => index > 0 && value < keptOrder[index - 1])
  ) {
    throw new ActionPlanError('invalid_request', field);
  }
  const firstPending = phases.findIndex((phase) => phase.status === 'pending');
  if (
    firstPending >= 0 &&
    phases.slice(firstPending).some((phase) => phase.status !== 'pending')
  ) {
    throw new ActionPlanError('invalid_request', field);
  }

  const firmName =
    input.firm_name === undefined
      ? existing?.firmName
      : (input.firm_name ?? undefined);
  const purchaseDate = input.purchase_date ?? existing?.purchaseDate;
  const config: PropChallengeConfig = existing
    ? {
        ...existing,
        challengeName: input.challenge_name,
        firmName,
        purchaseDate,
        phases,
      }
    : {
        challengeName: input.challenge_name,
        ...(firmName ? { firmName } : {}),
        ...(purchaseDate ? { purchaseDate } : {}),
        status: 'active',
        currentPhaseId: phases[0].id,
        phases,
      };
  if (validatePhaseTimeline(config) !== undefined) {
    throw new ActionPlanError('invalid_request', field);
  }
  
  
  const loaded = normalizePropChallengeConfig(structuredClone(config));
  if (!loaded || !sameJson(config, loaded)) {
    throw new ActionPlanError('invalid_request', field);
  }
  return loaded;
}
