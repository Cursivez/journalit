

import { Notice, type App } from 'obsidian';
import type JournalitPlugin from '../../../../main';
import { t } from '../../../../lang/helpers';
import {
  advancePhase,
  getCurrentPropChallengePhase,
  markChallengeFailed,
  reopenChallenge,
} from '../../../../services/propChallenge/PropChallengeConfig';
import { assignBrokerIdentityToPhase } from '../../../../services/propChallenge/PropChallengeIdentityLearning';
import { savePropChallengeConfig } from '../../../../services/propChallenge/PropChallengePersistence';
import { resolveStageAccountType } from '../../../../services/propChallenge/stageAccountTypes';
import type { PropChallengeConfig } from '../../../../services/propChallenge/types';
import type { evaluatePropChallengePhase } from '../../../../services/propChallenge/PropChallengeRuleEngine';
import type { AccountTradeData } from '../../../../services/accountPage/types';
import { AccountType } from '../../../../services/account/types';
import { OptionType } from '../../../../services/options/CustomOptionsService';
import { AccountMetadataConflictError } from '../../../../services/accountPage/AccountPageService';
import { showConfirmationModal } from '../../../shared/ConfirmationModal';
import type { PropChallengeManualAction } from './PropChallengeActionsMenu';
import { openPropChallengeTransitionModal } from './PropChallengeTransitionModal';

export function getAvailableAccountTypes(
  plugin: JournalitPlugin | null | undefined
): readonly string[] {
  const customAccountTypes =
    plugin?.optionsService?.getOptions(OptionType.ACCOUNT_TYPE) ?? [];
  return customAccountTypes.length > 0
    ? customAccountTypes
    : Object.values(AccountType);
}

export interface LifecycleActionContext {
  plugin: JournalitPlugin;
  app: App;
  accountName: string;
  accountId?: string;
  challenge: PropChallengeConfig;
  evaluation?: ReturnType<typeof evaluatePropChallengePhase>;
  trades?: readonly AccountTradeData[];
}

function resolveLifecycleActionLabel(
  challenge: PropChallengeConfig,
  action: PropChallengeManualAction
): string {
  const currentPhase = getCurrentPropChallengePhase(challenge);
  const currentIndex = challenge.phases.findIndex(
    (phase) => phase.id === currentPhase?.id
  );
  const nextPhase = challenge.phases[currentIndex + 1];
  switch (action) {
    case 'advance':
      return nextPhase
        ? t('account.prop-challenge.actions.progress-to', {
            phase: nextPhase.name,
          })
        : t('account.prop-challenge.actions.mark-passed');
    case 'fail':
      return t('account.prop-challenge.actions.mark-failed');
    case 'archive':
      return t('account.prop-challenge.actions.archive');
    case 'reopen':
      return t('account.prop-challenge.actions.reopen');
  }
}

export async function promptPropChallengeAdvanceTime(
  context: LifecycleActionContext,
  options: { defaultAt?: Date } = {}
): Promise<Date | null> {
  const { app, challenge, evaluation, plugin } = context;
  const currentPhase = getCurrentPropChallengePhase(challenge);
  const currentIndex = challenge.phases.findIndex(
    (phase) => phase.id === currentPhase?.id
  );
  const nextPhase = challenge.phases[currentIndex + 1];
  const applicablePromotion = nextPhase
    ? resolveStageAccountType(
        plugin.settings.account?.challengeStageAccountTypes,
        nextPhase.stage,
        getAvailableAccountTypes(plugin)
      )
    : undefined;
  
  
  const route = nextPhase
    ? t('account.prop-challenge.transition.route', {
        account: context.accountName,
        from: currentPhase?.name ?? '',
        to: nextPhase.name,
      })
    : t('account.prop-challenge.transition.route-passed', {
        account: context.accountName,
        from: currentPhase?.name ?? '',
      });
  return openPropChallengeTransitionModal(app, {
    title: resolveLifecycleActionLabel(challenge, 'advance'),
    context: route,
    targetReachedAt: evaluation?.targetReachedAt,
    startedAt: currentPhase?.startedAt
      ? new Date(currentPhase.startedAt)
      : undefined,
    defaultAt: options.defaultAt,
    promotionAccountType: applicablePromotion,
  });
}


export async function runPropChallengeAdvance(
  context: LifecycleActionContext
): Promise<boolean> {
  const at = await promptPropChallengeAdvanceTime(context);
  if (!at) return false;
  return applyPropChallengeLifecycleAction(context, 'advance', {
    confirm: false,
    at,
  });
}

async function persistPropChallengeLifecycleConfig(
  context: LifecycleActionContext,
  nextConfig: PropChallengeConfig,
  accountType: string | undefined,
  notifyTypeChange: boolean
): Promise<boolean> {
  const accountPageService = context.plugin.accountPageService;
  if (!accountPageService) return false;
  try {
    await savePropChallengeConfig({
      accountPageService,
      accountName: context.accountName,
      accountId: context.accountId,
      config: nextConfig,
      accountType,
      
      
      
      expectedConfig: context.challenge,
    });
  } catch (error) {
    if (error instanceof AccountMetadataConflictError) {
      new Notice(t('account.prop-challenge.actions.stale'));
      return false;
    }
    throw error;
  }
  if (notifyTypeChange && accountType)
    new Notice(
      t('account.prop-challenge.notice.type-changed', { accountType })
    );
  return true;
}


export async function applyPropChallengeAdvanceWithIdentity(
  context: LifecycleActionContext,
  options: { identity: string; at: Date }
): Promise<boolean> {
  const { plugin, challenge } = context;
  if (!plugin.accountPageService) return false;
  const identity = options.identity.trim();
  if (!identity) return false;
  const currentPhase = getCurrentPropChallengePhase(challenge);
  const currentIndex = challenge.phases.findIndex(
    (phase) => phase.id === currentPhase?.id
  );
  const nextPhase = challenge.phases[currentIndex + 1];
  if (!nextPhase) return false;
  const withIdentity = assignBrokerIdentityToPhase(
    challenge,
    nextPhase.id,
    identity
  );
  const nextConfig = advancePhase(withIdentity, options.at);
  if (nextConfig === withIdentity) {
    const startedAt = currentPhase?.startedAt
      ? Date.parse(currentPhase.startedAt)
      : Number.NaN;
    if (!Number.isNaN(startedAt) && options.at.getTime() < startedAt) {
      new Notice(t('account.prop-challenge.transition.too-early'));
    }
    return false;
  }
  const applicablePromotion = resolveStageAccountType(
    plugin.settings.account?.challengeStageAccountTypes,
    nextPhase.stage,
    getAvailableAccountTypes(plugin)
  );
  return persistPropChallengeLifecycleConfig(
    context,
    nextConfig,
    applicablePromotion,
    true
  );
}


export async function applyPropChallengeLifecycleAction(
  context: LifecycleActionContext,
  action: PropChallengeManualAction,
  options: { confirm?: boolean; at?: Date } = {}
): Promise<boolean> {
  const { plugin, app, challenge } = context;
  if (!plugin.accountPageService) return false;
  const availableTypes = getAvailableAccountTypes(plugin);
  const currentPhase = getCurrentPropChallengePhase(challenge);
  const currentIndex = challenge.phases.findIndex(
    (phase) => phase.id === currentPhase?.id
  );
  const nextPhase = challenge.phases[currentIndex + 1];
  const stageAccountTypes = plugin.settings.account?.challengeStageAccountTypes;
  const applicablePromotion = nextPhase
    ? resolveStageAccountType(
        stageAccountTypes,
        nextPhase.stage,
        availableTypes
      )
    : undefined;
  const reopenedAccountType = resolveStageAccountType(
    stageAccountTypes,
    currentPhase?.stage,
    availableTypes
  );
  const label = resolveLifecycleActionLabel(challenge, action);

  const confirmed =
    action === 'advance' ||
    options.confirm === false ||
    (await showConfirmationModal(app, {
      title: label,
      
      
      message: t(
        action === 'archive'
          ? challenge.status === 'passed'
            ? 'account.prop-challenge.confirm.archive-passed'
            : 'account.prop-challenge.confirm.archive-failed'
          : `account.prop-challenge.confirm.${action}`,
        {
          account: context.accountName,
          challenge: challenge.challengeName,
          phase: currentPhase?.name ?? '',
        }
      ),
      confirmLabel: label,
      cancelLabel: t('button.cancel'),
      destructive: action === 'fail' || action === 'archive',
    }));
  if (!confirmed) return false;

  const now = new Date();
  if (action === 'advance') {
    const at = options.at ?? now;
    const nextConfig = advancePhase(challenge, at);
    if (nextConfig === challenge) {
      const startedAt = currentPhase?.startedAt
        ? Date.parse(currentPhase.startedAt)
        : Number.NaN;
      if (!Number.isNaN(startedAt) && at.getTime() < startedAt) {
        new Notice(t('account.prop-challenge.transition.too-early'));
        return false;
      }
    }
    return persistPropChallengeLifecycleConfig(
      context,
      nextConfig,
      applicablePromotion,
      options.confirm === false
    );
  }

  const nextConfig =
    action === 'fail'
      ? markChallengeFailed(challenge, now)
      : action === 'reopen'
        ? reopenChallenge(challenge)
        : challenge;
  const nextAccountType =
    action === 'archive'
      ? 'archived'
      : action === 'reopen'
        ? reopenedAccountType
        : undefined;
  return persistPropChallengeLifecycleConfig(
    context,
    nextConfig,
    nextAccountType,
    options.confirm === false
  );
}
