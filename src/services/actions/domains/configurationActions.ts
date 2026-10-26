import { t, tPlural } from '../../../lang/helpers';
import type {
  LayoutChange,
  LayoutChangeSummary,
  ReviewTemplateChange,
  ReviewTemplateChangeSummary,
  SessionWorkflowChange,
  SessionWorkflowChangeSummary,
  SettingsChange,
} from '../../agent/configuration/configurationChangeTypes';
import type { PlannedConfigurationChange } from '../../agent/configuration/configurationPlan';
import { LayoutConfigurationError } from '../../agent/configuration/LayoutPlanner';
import type {
  DashboardLayoutPlanner,
  HomeLayoutPlanner,
  LayoutPlanSummary,
} from '../../agent/configuration/LayoutPlanner';
import {
  ReviewTemplateConfigurationError,
  type ReviewTemplatePlanner,
  type ReviewTemplatePlanSummary,
} from '../../agent/configuration/ReviewTemplatePlanner';
import { SessionModeConfigurationError } from '../../agent/configuration/sessionModeConfiguration';
import type {
  SessionWorkflowPlanner,
  SessionWorkflowPlanSummary,
} from '../../agent/configuration/SessionWorkflowPlanner';
import { SettingsConfigurationError } from '../../agent/configuration/settingsConfiguration';
import type {
  PlannedSettingsChange,
  SettingsChangePlanSummary,
  SettingsExecution,
  SettingsPlanner,
} from '../../agent/configuration/SettingsPlanner';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionDefinitions,
  type ActionExecuted,
  type ActionId,
  type ActionInput,
  type ActionOrigin,
  type ActionPlan,
  type ActionResult,
  type ActionSummary,
} from '../ActionTypes';

type Collection =
  | 'settings'
  | 'dashboard_layouts'
  | 'home_layouts'
  | 'review_templates'
  | 'session_workflows';

type ConfigurationErrorCode =
  | 'invalid_request'
  | 'not_found'
  | 'conflict'
  | 'limit_exceeded';


function configurationErrorCode(error: unknown): ConfigurationErrorCode | null {
  if (
    error instanceof LayoutConfigurationError ||
    error instanceof ReviewTemplateConfigurationError ||
    error instanceof SessionModeConfigurationError ||
    error instanceof SettingsConfigurationError
  ) {
    return error.code;
  }
  return null;
}

function planError(error: unknown): never {
  const code = configurationErrorCode(error);
  if (code !== null) throw new ActionPlanError(code);
  throw error;
}

function executionError(error: unknown): never {
  switch (configurationErrorCode(error)) {
    case 'conflict':
      throw new ActionExecutionError('conflict', false);
    case 'not_found':
      throw new ActionExecutionError('not_found', false);
    case 'invalid_request':
    case 'limit_exceeded':
      throw new ActionExecutionError('invalid_request', false);
    case null:
      throw error;
  }
}

interface ConfigurationActionSpec<
  Id extends ActionId,
  Summary,
  Planned extends PlannedConfigurationChange<Summary, Outcome>,
  Outcome = void,
> {
  collection: Collection;
  
  part?: string;
  plan(input: ActionInput<Id>, signal: AbortSignal): Promise<Planned>;
  describe(summary: Summary): readonly string[];
  
  executed?(
    result: ActionResult<Id>,
    planned: Planned,
    origin: ActionOrigin,
    
    outcome: Outcome
  ): ActionExecuted<Id>;
}


function configurationAction<
  Id extends ActionId,
  Summary extends { base_revision: string },
  Outcome = void,
  Planned extends PlannedConfigurationChange<Summary, Outcome> =
    PlannedConfigurationChange<Summary, Outcome>,
>(
  spec: ConfigurationActionSpec<Id, Summary, Planned, Outcome>
): ActionDefinition<Id> {
  return {
    async plan(input, context): Promise<ActionPlan<Id>> {
      let planned: Planned;
      try {
        planned = await spec.plan(input, context.signal);
      } catch (error) {
        if (context.signal.aborted) throw context.signal.reason;
        return planError(error);
      }
      if (
        'expected_revision' in input &&
        input.expected_revision !== planned.summary.base_revision
      ) {
        throw new ActionPlanError('conflict', 'expected_revision');
      }
      
      
      const summary = structuredClone(
        planned.summary
      ) as unknown as ActionSummary<Id>;
      
      const result = summary as unknown as ActionResult<Id>;
      return {
        target:
          spec.part === undefined
            ? `configuration:${spec.collection}`
            : `configuration:${spec.collection}.${spec.part}`,
        summary,
        affectedNotes: 0,
        display: {
          target: t(`actions.configuration.target.${spec.collection}`),
          changes: spec.describe(planned.summary),
        },
        execute: async (signal) => {
          let outcome: Outcome;
          try {
            outcome = await planned.execute(signal);
          } catch (error) {
            if (signal.aborted) throw signal.reason;
            return executionError(error);
          }
          return spec.executed
            ? spec.executed(result, planned, context.origin, outcome)
            : result;
        },
      };
    },
  };
}


function withoutRevision<Input extends object>(
  input: Input
): Omit<Input, 'expected_revision'> {
  const rest: Partial<Record<'expected_revision', unknown>> = { ...input };
  delete rest.expected_revision;
  return rest as Omit<Input, 'expected_revision'>;
}

function describeSettings(summary: SettingsChangePlanSummary): string[] {
  const count = summary.change.changed_fields.length;
  return count === 0
    ? []
    : [t('actions.configuration.settings', { count: String(count) })];
}

function describeLayout(summary: LayoutPlanSummary): string[] {
  const change: LayoutChangeSummary = summary.change;
  switch (change.action) {
    case 'create':
      return [t('actions.configuration.create', { name: change.layout_name })];
    case 'duplicate':
      return [
        t('actions.configuration.duplicate', { name: change.layout_name }),
      ];
    case 'update':
      return [t('actions.configuration.replace', { name: change.layout_name })];
    case 'rename':
      return [t('actions.configuration.rename', { name: change.layout_name })];
    case 'delete':
      return [t('actions.configuration.delete', { name: change.layout_name })];
    case 'set_active':
      return [
        t('actions.configuration.set-active', { name: change.layout_name }),
      ];
    default: {
      const exhaustive: never = change;
      return exhaustive;
    }
  }
}

function describeReviewTemplate(summary: ReviewTemplatePlanSummary): string[] {
  const change: ReviewTemplateChangeSummary = summary.change;
  switch (change.action) {
    case 'create':
      return [
        t('actions.configuration.create', { name: change.template_name }),
      ];
    case 'duplicate':
      return [
        t('actions.configuration.duplicate', { name: change.template_name }),
      ];
    case 'update':
      return [
        t('actions.configuration.replace', { name: change.template_name }),
      ];
    case 'delete':
      return [
        t('actions.configuration.delete', {
          name: change.template_name ?? change.template_id,
        }),
      ];
    case 'set_default': {
      const type = t(`template.review-type.${change.review_type}`);
      return [
        change.template_id === null
          ? t('actions.configuration.reset-default', { type })
          : t('actions.configuration.set-default', { type }),
      ];
    }
    default: {
      const exhaustive: never = change;
      return exhaustive;
    }
  }
}

function describeWorkflow(summary: SessionWorkflowPlanSummary): string[] {
  const change: SessionWorkflowChangeSummary = summary.change;
  if (change.action === 'delete_question') {
    const name = change.question_title ?? change.question_id;
    if (change.placement_count === 0) {
      return [t('actions.configuration.delete-question-unused', { name })];
    }
    return [
      tPlural('actions.configuration.delete-question', change.placement_count, {
        name,
        workflows: tPlural(
          'actions.configuration.delete-question-workflows',
          change.workflow_count
        ),
      }),
    ];
  }
  const name = change.workflow_name ?? change.workflow_id;
  switch (change.action) {
    case 'create':
      return [t('actions.configuration.create', { name })];
    case 'update':
      return [t('actions.configuration.replace', { name })];
    case 'delete':
      return [t('actions.configuration.delete', { name })];
    default: {
      const exhaustive: never = change;
      return exhaustive;
    }
  }
}

interface ConfigurationPlanners {
  settings(): Pick<SettingsPlanner, 'plan'>;
  dashboardLayouts(): Pick<DashboardLayoutPlanner, 'plan'>;
  homeLayouts(): Pick<HomeLayoutPlanner, 'plan'>;
  reviewTemplates(): Pick<ReviewTemplatePlanner, 'plan'>;
  sessionWorkflows(): Pick<SessionWorkflowPlanner, 'plan'>;
}

type SettingsKind = SettingsChange['kind'];
type SettingsActionId = `settings.${SettingsKind}`;
type LayoutKind = LayoutChange['kind'];
type TemplateKind = ReviewTemplateChange['kind'];
type WorkflowKind = SessionWorkflowChange['kind'];

type ConfigurationActionId =
  | `settings.${SettingsKind}`
  | `dashboard_layout.${LayoutKind}`
  | `home_layout.${LayoutKind}`
  | `review_template.${TemplateKind}`
  | `session_workflow.${WorkflowKind}`;
type ConfigurationActionDefinitions = Pick<
  ActionDefinitions,
  ConfigurationActionId
>;


function settingsRestore(
  planned: PlannedSettingsChange,
  execution: SettingsExecution
): ActionExecution<SettingsActionId>['undo']['restoreInput'] {
  if (planned.summary.change.changed_fields.length === 0) return 'unchanged';
  if (!execution.restorable) return null;
  return {
    expected_revision: planned.summary.resulting_revision,
    values: structuredClone(planned.previous),
  };
}

function settingsAction<Kind extends SettingsKind>(
  planners: ConfigurationPlanners,
  kind: Kind
): ActionDefinition<`settings.${Kind}`> {
  return configurationAction<
    `settings.${Kind}`,
    SettingsChangePlanSummary,
    SettingsExecution,
    PlannedSettingsChange
  >({
    collection: 'settings',
    
    part: kind.slice('set_'.length),
    plan: (input, signal) =>
      planners
        .settings()
        .plan({ kind, ...withoutRevision(input) } as SettingsChange, signal),
    describe: describeSettings,
    
    
    
    executed: (result, planned, origin, execution) =>
      new ActionExecution(result, {
        restoreInput:
          origin === 'agent' ? settingsRestore(planned, execution) : null,
      }),
  });
}

function layoutAction<
  Surface extends 'dashboard' | 'home',
  Kind extends LayoutKind,
>(
  planners: ConfigurationPlanners,
  surface: Surface,
  kind: Kind
): ActionDefinition<`${Surface}_layout.${Kind}`> {
  return configurationAction<`${Surface}_layout.${Kind}`, LayoutPlanSummary>({
    collection: surface === 'dashboard' ? 'dashboard_layouts' : 'home_layouts',
    plan: (input, signal) => {
      
      const change = {
        kind,
        ...withoutRevision(input),
      } as LayoutChange<Surface>;
      return surface === 'dashboard'
        ? planners
            .dashboardLayouts()
            .plan(change as LayoutChange<'dashboard'>, signal)
        : planners.homeLayouts().plan(change, signal);
    },
    describe: describeLayout,
  });
}

function templateAction<Kind extends TemplateKind>(
  planners: ConfigurationPlanners,
  kind: Kind
): ActionDefinition<`review_template.${Kind}`> {
  return configurationAction<
    `review_template.${Kind}`,
    ReviewTemplatePlanSummary
  >({
    collection: 'review_templates',
    plan: (input, signal) =>
      planners
        .reviewTemplates()
        .plan(
          { kind, ...withoutRevision(input) } as ReviewTemplateChange,
          signal
        ),
    describe: describeReviewTemplate,
  });
}

function workflowAction<Kind extends WorkflowKind>(
  planners: ConfigurationPlanners,
  kind: Kind
): ActionDefinition<`session_workflow.${Kind}`> {
  return configurationAction<
    `session_workflow.${Kind}`,
    SessionWorkflowPlanSummary
  >({
    collection: 'session_workflows',
    plan: (input, signal) =>
      planners
        .sessionWorkflows()
        .plan(
          { kind, ...withoutRevision(input) } as SessionWorkflowChange,
          signal
        ),
    describe: describeWorkflow,
  });
}

function layoutActions<Surface extends 'dashboard' | 'home'>(
  planners: ConfigurationPlanners,
  surface: Surface
) {
  return {
    [`${surface}_layout.create`]: layoutAction(planners, surface, 'create'),
    [`${surface}_layout.duplicate`]: layoutAction(
      planners,
      surface,
      'duplicate'
    ),
    [`${surface}_layout.update`]: layoutAction(planners, surface, 'update'),
    [`${surface}_layout.rename`]: layoutAction(planners, surface, 'rename'),
    [`${surface}_layout.delete`]: layoutAction(planners, surface, 'delete'),
    [`${surface}_layout.set_active`]: layoutAction(
      planners,
      surface,
      'set_active'
    ),
  } as Pick<ActionDefinitions, `${Surface}_layout.${LayoutKind}`>;
}


export function createConfigurationActions(
  planners: ConfigurationPlanners
): ConfigurationActionDefinitions {
  return {
    'settings.set_analytics_calculation': settingsAction(
      planners,
      'set_analytics_calculation'
    ),
    'settings.set_date_time_display': settingsAction(
      planners,
      'set_date_time_display'
    ),
    'settings.set_display_preferences': settingsAction(
      planners,
      'set_display_preferences'
    ),
    'settings.set_trading_day': settingsAction(planners, 'set_trading_day'),
    'settings.set_risk_display': settingsAction(planners, 'set_risk_display'),
    'settings.set_break_even': settingsAction(planners, 'set_break_even'),
    'settings.set_trade_entry': settingsAction(planners, 'set_trade_entry'),
    'settings.set_review_automation': settingsAction(
      planners,
      'set_review_automation'
    ),
    'settings.set_economic_calendar': settingsAction(
      planners,
      'set_economic_calendar'
    ),
    'settings.set_session_schedule': settingsAction(
      planners,
      'set_session_schedule'
    ),
    ...layoutActions(planners, 'dashboard'),
    ...layoutActions(planners, 'home'),
    'review_template.create': templateAction(planners, 'create'),
    'review_template.duplicate': templateAction(planners, 'duplicate'),
    'review_template.update': templateAction(planners, 'update'),
    'review_template.delete': templateAction(planners, 'delete'),
    'review_template.set_default': templateAction(planners, 'set_default'),
    'session_workflow.create': workflowAction(planners, 'create'),
    'session_workflow.update': workflowAction(planners, 'update'),
    'session_workflow.delete': workflowAction(planners, 'delete'),
    'session_workflow.delete_question': workflowAction(
      planners,
      'delete_question'
    ),
  };
}
