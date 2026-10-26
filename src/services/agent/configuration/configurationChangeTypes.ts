import type {
  ActionId,
  ActionInput,
  ActionSummary,
} from '../../actions/ActionTypes';


type ChangeInput<Id extends ActionId> = Omit<
  ActionInput<Id>,
  'expected_revision'
>;
type ChangeSummaryOf<Id extends ActionId> =
  ActionSummary<Id> extends { change: infer Change } ? Change : never;


type SettingsActionId = Extract<ActionId, `settings.${string}`>;
type SettingsKindOf<Id> = Id extends `settings.${infer Kind}` ? Kind : never;
export type SettingsKind = SettingsKindOf<SettingsActionId>;
export type SettingsChange = {
  [Kind in SettingsKind]: { kind: Kind } & ChangeInput<`settings.${Kind}`>;
}[SettingsKind];

export type SettingsChangeSummary =
  ChangeSummaryOf<'settings.set_analytics_calculation'>;
export type SettingsProjection =
  ActionSummary<'settings.set_analytics_calculation'>['settings'];

export type SessionWorkflowChange =
  | ({ kind: 'create' } & ChangeInput<'session_workflow.create'>)
  | ({ kind: 'update' } & ChangeInput<'session_workflow.update'>)
  | ({ kind: 'delete' } & ChangeInput<'session_workflow.delete'>)
  | ({
      kind: 'delete_question';
    } & ChangeInput<'session_workflow.delete_question'>);

export type SessionWorkflowChangeSummary =
  | ChangeSummaryOf<'session_workflow.create'>
  | ChangeSummaryOf<'session_workflow.delete'>
  | ChangeSummaryOf<'session_workflow.delete_question'>;
export type WireTradeGateWorkflow =
  ActionInput<'session_workflow.create'>['workflow'];
export type WireTradeGateQuestion =
  ActionInput<'session_workflow.create'>['questions'][number];

export type ReviewTemplateChange =
  | ({ kind: 'create' } & ChangeInput<'review_template.create'>)
  | ({ kind: 'duplicate' } & ChangeInput<'review_template.duplicate'>)
  | ({ kind: 'update' } & ChangeInput<'review_template.update'>)
  | ({ kind: 'delete' } & ChangeInput<'review_template.delete'>)
  | ({ kind: 'set_default' } & ChangeInput<'review_template.set_default'>);

export type ReviewTemplateChangeSummary =
  | ChangeSummaryOf<'review_template.create'>
  | ChangeSummaryOf<'review_template.delete'>
  | ChangeSummaryOf<'review_template.set_default'>;
export type UserReviewTemplate =
  ActionSummary<'review_template.create'>['template'];

export type LayoutSurface = 'dashboard' | 'home';
type LayoutKind =
  | 'create'
  | 'duplicate'
  | 'update'
  | 'rename'
  | 'delete'
  | 'set_active';
type LayoutActionId<Surface extends LayoutSurface> =
  `${Surface}_layout.${LayoutKind}`;

type LayoutChangeOf<Surface extends LayoutSurface> = {
  [Kind in LayoutKind]: { kind: Kind } & ChangeInput<
    Extract<`${Surface}_layout.${Kind}`, ActionId>
  >;
}[LayoutKind];
export type LayoutChange<Surface extends LayoutSurface = LayoutSurface> =
  Surface extends LayoutSurface ? LayoutChangeOf<Surface> : never;
export type LayoutChangeSummary<Surface extends LayoutSurface = LayoutSurface> =
  Surface extends LayoutSurface
    ? ChangeSummaryOf<Extract<LayoutActionId<Surface>, ActionId>>
    : never;
export type DashboardLayoutArtifact =
  ActionSummary<'dashboard_layout.create'>['layout'];
export type HomeLayoutArtifact = ActionSummary<'home_layout.create'>['layout'];
