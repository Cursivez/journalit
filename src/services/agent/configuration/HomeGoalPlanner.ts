import type { HomeWidgetDefinition } from '../../../components/home/homeTypes';
import { isValidGoalTarget } from '../../../components/home/widgets/goalDefinitions';
import type { GoalConfig } from '../../../settings/types';
import type { ActionInput, ActionSummary } from '../../actions/ActionTypes';
import {
  throwIfAborted,
  type PlannedConfigurationChange,
} from './configurationPlan';
import {
  canonicalizeConfigurationValue,
  configurationRevision,
  isRecord,
} from './configurationPrimitives';
import { goalConfigFromHomeGoal, goalTypeOf } from './homeGoalConfiguration';
import { LayoutConfigurationError } from './LayoutPlanner';
import { isStrictName } from './layoutConfiguration';

type HomeGoalSetInput = ActionInput<'home_goal.set'>;
export type HomeGoalPlanSummary = ActionSummary<'home_goal.set'>;

const GOALS_WIDGET = 'goalsProgress';

interface HomeGoalSettings {
  layouts: unknown;
  activeLayout: unknown;
  goals?: unknown;
}

interface Dependencies {
  getSettings(): HomeGoalSettings;
  homeWidgets: readonly HomeWidgetDefinition[];
  
  resolveAccountName(accountId: string): Promise<string | null>;
  
  saveGoal(widgetId: string, goal: GoalConfig): Promise<void>;
  now(): Date;
}

const sameValue = (left: unknown, right: unknown): boolean =>
  JSON.stringify(canonicalizeConfigurationValue(left)) ===
  JSON.stringify(canonicalizeConfigurationValue(right));


export class HomeGoalPlanner {
  constructor(private readonly dependencies: Dependencies) {}

  async plan(
    input: HomeGoalSetInput,
    signal: AbortSignal
  ): Promise<PlannedConfigurationChange<HomeGoalPlanSummary>> {
    throwIfAborted(signal);
    const { widget_id: widgetId, goal } = input;
    this.checkWidgetId(widgetId);
    const type = goalTypeOf(goal.metric);
    
    if (!goal.account_targets && !isValidGoalTarget(type, goal.target))
      throw new LayoutConfigurationError('invalid_request');

    const accountTargets = goal.account_targets ?? [];
    const accountIds = new Set<string>();
    for (const { account_id: accountId, target } of accountTargets) {
      if (accountIds.has(accountId) || !isValidGoalTarget(type, target))
        throw new LayoutConfigurationError('invalid_request');
      accountIds.add(accountId);
    }
    
    await this.resolveAccountNames(accountTargets, signal);

    const settings = this.dependencies.getSettings();
    const goals = isRecord(settings.goals) ? settings.goals : {};
    const current = Object.prototype.hasOwnProperty.call(goals, widgetId)
      ? goals[widgetId]
      : undefined;
    const previous = structuredClone(current);
    const createdAt =
      isRecord(current) && typeof current.createdAt === 'string'
        ? current.createdAt
        : this.dependencies.now().toISOString();
    const revision = await configurationRevision({
      layouts: settings.layouts,
      activeLayout: settings.activeLayout,
    });
    throwIfAborted(signal);
    const action = current === undefined ? 'create' : 'update';
    const summary: HomeGoalPlanSummary = {
      base_revision: revision,
      resulting_revision: revision,
      change: {
        action,
        widget_id: widgetId,
        message:
          action === 'create'
            ? `Set the goal of new Goals widget ${widgetId}.`
            : `Replaced the goal of Goals widget ${widgetId}.`,
      },
      goal: structuredClone(goal),
    };
    return {
      summary,
      execute: async (executionSignal) => {
        throwIfAborted(executionSignal);
        const latest = this.dependencies.getSettings();
        const latestGoals = isRecord(latest.goals) ? latest.goals : {};
        const latestGoal = Object.prototype.hasOwnProperty.call(
          latestGoals,
          widgetId
        )
          ? latestGoals[widgetId]
          : undefined;
        if (!sameValue(latestGoal, previous))
          throw new LayoutConfigurationError('conflict');
        
        
        
        const accountNames = await this.resolveAccountNames(
          accountTargets,
          executionSignal
        );
        await this.dependencies.saveGoal(
          widgetId,
          goalConfigFromHomeGoal(structuredClone(goal), accountNames, createdAt)
        );
      },
    };
  }

  
  private async resolveAccountNames(
    accountTargets: readonly { account_id: string }[],
    signal: AbortSignal
  ): Promise<string[]> {
    const names = await Promise.all(
      accountTargets.map(({ account_id: accountId }) =>
        this.dependencies.resolveAccountName(accountId)
      )
    );
    throwIfAborted(signal);
    return names.map((name) => {
      if (name === null) throw new LayoutConfigurationError('not_found');
      return name;
    });
  }

  
  private checkWidgetId(widgetId: string): void {
    const prefix = `${GOALS_WIDGET}-`;
    const suffix = widgetId.startsWith(prefix)
      ? widgetId.slice(prefix.length)
      : '';
    if (
      !isStrictName(widgetId) ||
      suffix.length === 0 ||
      this.dependencies.homeWidgets.some(
        (definition) =>
          definition.configurable === true &&
          suffix.startsWith(`${definition.id}-`)
      )
    )
      throw new LayoutConfigurationError('invalid_request');
  }
}
