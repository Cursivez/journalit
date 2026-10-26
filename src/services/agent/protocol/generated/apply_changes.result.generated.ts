

export type ApplyChangesResult = (Preview | Committed | ApprovalPending | ApprovalDenied | Error)

export type LabelBatch = string[]

export type ImageAnnotationChanges = ImageAnnotationChange[]

export type BoundedJSONArray = ((string | number | boolean | null) | BoundedJSONArray | BoundedJSONObject)[]

export type WidgetPlacements = WidgetPlacement[]

export type WorkflowQuestions = TradeGateQuestion[]

export type StopLossList = PlannedTarget[]

export type TakeProfitList = PlannedTarget[]

export type MistakeIdentityBatch = string[]

export type CustomFieldChanges = {
field_id: string
value: ((string | number | string[]) | null)
}[]

export interface Preview {

actions: ({
action: "account.add_transaction"
index: number
summary: AccountAddTransactionSummary
} | {
action: "account.create"
index: number
summary: AccountCreateSummary
} | {
action: "account.delete"
index: number
summary: AccountDeleteSummary
} | {
action: "account.delete_transaction"
index: number
summary: AccountDeleteTransactionSummary
} | {
action: "account.rename"
index: number
summary: AccountRenameSummary
} | {
action: "account.update"
index: number
summary: AccountUpdateSummary
} | {
action: "account_type.create"
index: number
summary: AccountTypeCreateResult
} | {
action: "account_type.delete"
index: number
summary: AccountTypeDeleteResult
} | {
action: "account_type.move"
index: number
summary: AccountTypeMoveResult
} | {
action: "account_type.rename"
index: number
summary: AccountTypeRenameResult
} | {
action: "custom_field.create"
index: number
summary: CustomFieldCreateSummary
} | {
action: "custom_field.delete"
index: number
summary: CustomFieldDeleteSummary
} | {
action: "custom_field.reorder"
index: number
summary: CustomFieldReorderSummary
} | {
action: "custom_field.update"
index: number
summary: CustomFieldUpdateSummary
} | {
action: "dashboard_layout.create"
index: number
summary: DashboardLayoutCreateResult
} | {
action: "dashboard_layout.delete"
index: number
summary: DashboardLayoutDeleteResult
} | {
action: "dashboard_layout.duplicate"
index: number
summary: DashboardLayoutDuplicateResult
} | {
action: "dashboard_layout.rename"
index: number
summary: DashboardLayoutRenameResult
} | {
action: "dashboard_layout.set_active"
index: number
summary: DashboardLayoutSetActiveResult
} | {
action: "dashboard_layout.update"
index: number
summary: DashboardLayoutUpdateResult
} | {
action: "event.create"
index: number
summary: EventCreateResult
} | {
action: "event.delete"
index: number
summary: EventDeleteResult
} | {
action: "event.merge"
index: number
summary: EventMergeResult
} | {
action: "event.rename"
index: number
summary: EventRenameResult
} | {
action: "event.update_style"
index: number
summary: EventUpdateStyleResult
} | {
action: "home_layout.create"
index: number
summary: HomeLayoutCreateResult
} | {
action: "home_layout.delete"
index: number
summary: HomeLayoutDeleteResult
} | {
action: "home_layout.duplicate"
index: number
summary: HomeLayoutDuplicateResult
} | {
action: "home_layout.rename"
index: number
summary: HomeLayoutRenameResult
} | {
action: "home_layout.set_active"
index: number
summary: HomeLayoutSetActiveResult
} | {
action: "home_layout.update"
index: number
summary: HomeLayoutUpdateResult
} | {
action: "mistake.create"
index: number
summary: MistakeCreateResult
} | {
action: "mistake.delete"
index: number
summary: MistakeDeleteResult
} | {
action: "mistake.merge"
index: number
summary: MistakeMergeResult
} | {
action: "mistake.rename"
index: number
summary: MistakeRenameResult
} | {
action: "prop_challenge.add_cost"
index: number
summary: PropChallengeAddCostSummary
} | {
action: "prop_challenge.advance"
index: number
summary: PropChallengeAdvanceSummary
} | {
action: "prop_challenge.configure"
index: number
summary: PropChallengeConfigureSummary
} | {
action: "prop_challenge.delete_cost"
index: number
summary: PropChallengeDeleteCostSummary
} | {
action: "prop_challenge.fail"
index: number
summary: PropChallengeFailSummary
} | {
action: "prop_challenge.reopen"
index: number
summary: PropChallengeReopenSummary
} | {
action: "review.add_images"
index: number
summary: ReviewAddImagesSummary
} | {
action: "review.add_key_events"
index: number
summary: ReviewAddKeyEventsSummary
} | {
action: "review.add_session_log_entries"
index: number
summary: ReviewAddSessionLogEntriesSummary
} | {
action: "review.create"
index: number
summary: ReviewCreateSummary
} | {
action: "review.delete_key_event"
index: number
summary: ReviewDeleteKeyEventSummary
} | {
action: "review.delete_session_log_entry"
index: number
summary: ReviewDeleteSessionLogEntrySummary
} | {
action: "review.remove_images"
index: number
summary: ReviewRemoveImagesSummary
} | {
action: "review.set_day_trade_fields"
index: number
summary: ReviewSetDayTradeFieldsSummary
} | {
action: "review.set_image_annotations"
index: number
summary: ReviewSetImageAnnotationsSummary
} | {
action: "review.update"
index: number
summary: ReviewUpdateSummary
} | {
action: "review.update_key_event"
index: number
summary: ReviewUpdateKeyEventSummary
} | {
action: "review.update_session_log_entry"
index: number
summary: ReviewUpdateSessionLogEntrySummary
} | {
action: "review_template.create"
index: number
summary: ReviewTemplateCreateResult
} | {
action: "review_template.delete"
index: number
summary: ReviewTemplateDeleteResult
} | {
action: "review_template.duplicate"
index: number
summary: ReviewTemplateDuplicateResult
} | {
action: "review_template.set_default"
index: number
summary: ReviewTemplateSetDefaultResult
} | {
action: "review_template.update"
index: number
summary: ReviewTemplateUpdateResult
} | {
action: "session.start_unplanned"
index: number
summary: SessionStartUnplannedSummary
} | {
action: "session.stop_unplanned"
index: number
summary: SessionStopUnplannedSummary
} | {
action: "session_log_tag.create"
index: number
summary: SessionLogTagCreateSummary
} | {
action: "session_log_tag.delete"
index: number
summary: SessionLogTagDeleteSummary
} | {
action: "session_log_tag.update"
index: number
summary: SessionLogTagUpdateSummary
} | {
action: "session_workflow.create"
index: number
summary: SessionWorkflowCreateResult
} | {
action: "session_workflow.delete"
index: number
summary: SessionWorkflowDeleteResult
} | {
action: "session_workflow.delete_question"
index: number
summary: SessionWorkflowDeleteQuestionResult
} | {
action: "session_workflow.update"
index: number
summary: SessionWorkflowUpdateResult
} | {
action: "settings.set_analytics_calculation"
index: number
summary: SettingsSetAnalyticsCalculationResult
} | {
action: "settings.set_break_even"
index: number
summary: SettingsSetBreakEvenResult
} | {
action: "settings.set_date_time_display"
index: number
summary: SettingsSetDateTimeDisplayResult
} | {
action: "settings.set_display_preferences"
index: number
summary: SettingsSetDisplayPreferencesResult
} | {
action: "settings.set_economic_calendar"
index: number
summary: SettingsSetEconomicCalendarResult
} | {
action: "settings.set_review_automation"
index: number
summary: SettingsSetReviewAutomationResult
} | {
action: "settings.set_risk_display"
index: number
summary: SettingsSetRiskDisplayResult
} | {
action: "settings.set_session_schedule"
index: number
summary: SettingsSetSessionScheduleResult
} | {
action: "settings.set_trade_entry"
index: number
summary: SettingsSetTradeEntryResult
} | {
action: "settings.set_trading_day"
index: number
summary: SettingsSetTradingDayResult
} | {
action: "setup.create"
index: number
summary: SetupCreateSummary
} | {
action: "setup.delete"
index: number
summary: SetupDeleteResult
} | {
action: "setup.rename"
index: number
summary: SetupRenameSummary
} | {
action: "setup.update"
index: number
summary: SetupUpdateSummary
} | {
action: "tag.clear_color"
index: number
summary: TagClearColorResult
} | {
action: "tag.create"
index: number
summary: TagCreateResult
} | {
action: "tag.delete"
index: number
summary: TagDeleteResult
} | {
action: "tag.merge"
index: number
summary: TagMergeResult
} | {
action: "tag.rename"
index: number
summary: TagRenameResult
} | {
action: "tag.set_color"
index: number
summary: TagSetColorResult
} | {
action: "trade.create"
index: number
summary: TradeCreateSummary
} | {
action: "trade.delete"
index: number
summary: TradeDeleteSummary
} | {
action: "trade.set_image_annotations"
index: number
summary: TradeSetImageAnnotationsSummary
} | {
action: "trade.set_type"
index: number
summary: TradeSetTypeSummary
} | {
action: "trade.update"
index: number
summary: TradeUpdateSummary
})[]
approval: Approval
expires_at: string
meta: ResultMeta
preview_id: string
status: "ok"
variant: "preview"
}
export interface AccountAddTransactionSummary {
account_id: string
type: ("deposit" | "withdrawal")
amount: number
date: string
}
export interface AccountCreateSummary {

name: string
account_type: string
currency: ("USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "NZD" | "CHF" | "DKK" | "CNY" | "HKD" | "INR" | "SGD" | "KWD" | "NGN")
initial_balance: number
}
export interface AccountDeleteSummary {
account_id: string
base_revision: string
name: string
}
export interface AccountDeleteTransactionSummary {
account_id: string
transaction_id: string
type: ("deposit" | "withdrawal")
amount: number
date: string
}
export interface AccountRenameSummary {
account_id: string
base_revision: string
previous_name: string

name: string

trade_count: number
}
export interface AccountUpdateSummary {
account_id: string
base_revision: string

changed_fields: ("account_type" | "currency" | "created_date" | "initial_balance" | "live_balance" | "drawdown" | "profit_target" | "monthly_cost" | "copy_trading")[]
}
export interface AccountTypeCreateResult {
base_revision: string
resulting_revision: string

created: CreateAccountTypeEntry[]
}
export interface CreateAccountTypeEntry {
change: CreateAccountTypeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface CreateAccountTypeSummary {
action: "create_account_type"
catalog: "account_types"

value: string
settings_only: true
affected_note_count: 0
message: string
}
export interface OptionTag {

value: string
color?: string
}
export interface OptionMistake {

value: string
}
export interface OptionAccountType {

value: string
reserved?: true
}
export interface OptionEvent {
name: string
color: ("red" | "orange" | "yellow" | "gray")
notes?: string
}
export interface AccountTypeDeleteResult {
base_revision: string
resulting_revision: string
change: DeleteAccountTypeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface DeleteAccountTypeSummary {
action: "delete_account_type"
catalog: "account_types"

value: string
settings_only: true

affected_account_count: 0
affected_note_count: 0
message: string
}
export interface AccountTypeMoveResult {
base_revision: string
resulting_revision: string
change: MoveAccountTypeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface MoveAccountTypeSummary {
action: "move_account_type"
catalog: "account_types"

value: string

before_value?: string
settings_only: true
affected_note_count: 0
message: string
}
export interface AccountTypeRenameResult {
base_revision: string
resulting_revision: string
change: RenameAccountTypeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface RenameAccountTypeSummary {
action: "rename_account_type"
catalog: "account_types"

source_value: string

target_value: string
settings_only: true

affected_account_count: number
affected_note_count: 0
message: string
}
export interface CustomFieldCreateSummary {
label: string
type: ("text" | "number" | "dropdown" | "multiselect" | "date" | "datetime" | "time")
option_count: number
}

export interface CustomFieldDeleteSummary {
field_id: string
label: string
trades_with_values: number
}
export interface CustomFieldReorderSummary {
base_revision: string

field_ids: string[]
}
export interface CustomFieldUpdateSummary {
field_id: string
base_revision: string

changed_fields: ("label" | "options" | "validation" | "placeholder" | "helper_text" | "allow_create_options")[]
}
export interface DashboardLayoutCreateResult {
base_revision: string
resulting_revision: string
change: DashboardLayoutChangeSummary
layout: DashboardLayoutMutationArtifact
}
export interface DashboardLayoutChangeSummary {
action: ("create" | "duplicate" | "update" | "rename")
layout_name: string
placement_counts: DashboardBreakpointPlacementCounts
message: string
metric_count: number
}
export interface DashboardBreakpointPlacementCounts {
lg: number
md: number
sm: number
xs: number
xxs: number
}
export interface DashboardLayoutMutationArtifact {
name: string

top_section: string[]
breakpoints: CompleteLayoutBreakpointPlacements
omitted_placement_counts: CompleteLayoutOmittedPlacementCounts
omitted_metric_count: number
}
export interface CompleteLayoutBreakpointPlacements {

lg: LayoutPlacement[]

md: LayoutPlacement[]

sm: LayoutPlacement[]

xs: LayoutPlacement[]

xxs: LayoutPlacement[]
}
export interface LayoutPlacement {
id: string
x: number
y: number
w: number
h: number
static?: boolean
}
export interface CompleteLayoutOmittedPlacementCounts {
lg: number
md: number
sm: number
xs: number
xxs: number
}
export interface DashboardLayoutDeleteResult {
base_revision: string
resulting_revision: string
change: DashboardDeleteChangeSummary
}
export interface DashboardDeleteChangeSummary {
action: "delete"
layout_name: string
message: string
}
export interface DashboardLayoutDuplicateResult {
base_revision: string
resulting_revision: string
change: DashboardLayoutChangeSummary
layout: DashboardLayoutMutationArtifact
}
export interface DashboardLayoutRenameResult {
base_revision: string
resulting_revision: string
change: DashboardLayoutChangeSummary
layout: DashboardLayoutMutationArtifact
}
export interface DashboardLayoutSetActiveResult {
base_revision: string
resulting_revision: string
change: DashboardSetActiveChangeSummary
}
export interface DashboardSetActiveChangeSummary {
action: "set_active"
layout_name: string
message: string
}
export interface DashboardLayoutUpdateResult {
base_revision: string
resulting_revision: string
change: DashboardLayoutChangeSummary
layout: DashboardLayoutMutationArtifact
}
export interface EventCreateResult {
base_revision: string
resulting_revision: string

created: CreateEventEntry[]
}
export interface CreateEventEntry {
change: CreateEventSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface CreateEventSummary {
action: "create_event"
catalog: "events"
name: string
settings_only: true
affected_note_count: 0
message: string
}
export interface EventDeleteResult {
base_revision: string
resulting_revision: string
change: DeleteEventSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface DeleteEventSummary {
action: "delete_event"
catalog: "events"
name: string
settings_only: true

preserved_review_count: number
affected_note_count: 0
message: string
}
export interface EventMergeResult {
base_revision: string
resulting_revision: string
change: MergeEventsSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface MergeEventsSummary {
action: "merge_events"
catalog: "events"
source_name: string
target_name: string
settings_only: false

affected_review_count: number

affected_note_count: number
message: string
}
export interface EventRenameResult {
base_revision: string
resulting_revision: string
change: RenameEventSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface RenameEventSummary {
action: "rename_event"
catalog: "events"
source_name: string
target_name: string
settings_only: false

affected_review_count: number

affected_note_count: number
message: string
}
export interface EventUpdateStyleResult {
base_revision: string
resulting_revision: string
change: UpdateEventStyleSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface UpdateEventStyleSummary {
action: "update_event_style"
catalog: "events"
name: string
settings_only: true
affected_note_count: 0
message: string
}
export interface HomeLayoutCreateResult {
base_revision: string
resulting_revision: string
change: HomeLayoutChangeSummary
layout: HomeLayoutMutationArtifact
}
export interface HomeLayoutChangeSummary {
action: ("create" | "duplicate" | "update" | "rename")
layout_name: string
placement_counts: HomeBreakpointPlacementCounts
message: string
}
export interface HomeBreakpointPlacementCounts {
lg: number
md: number
sm: number
xs: number
xxs: number
}
export interface HomeLayoutMutationArtifact {
name: string
breakpoints: CompleteLayoutBreakpointPlacements
omitted_placement_counts: CompleteLayoutOmittedPlacementCounts
}
export interface HomeLayoutDeleteResult {
base_revision: string
resulting_revision: string
change: HomeDeleteChangeSummary
}
export interface HomeDeleteChangeSummary {
action: "delete"
layout_name: string
message: string
}
export interface HomeLayoutDuplicateResult {
base_revision: string
resulting_revision: string
change: HomeLayoutChangeSummary
layout: HomeLayoutMutationArtifact
}
export interface HomeLayoutRenameResult {
base_revision: string
resulting_revision: string
change: HomeLayoutChangeSummary
layout: HomeLayoutMutationArtifact
}
export interface HomeLayoutSetActiveResult {
base_revision: string
resulting_revision: string
change: HomeSetActiveChangeSummary
}
export interface HomeSetActiveChangeSummary {
action: "set_active"
layout_name: string
message: string
}
export interface HomeLayoutUpdateResult {
base_revision: string
resulting_revision: string
change: HomeLayoutChangeSummary
layout: HomeLayoutMutationArtifact
}
export interface MistakeCreateResult {
base_revision: string
resulting_revision: string

created: CreateMistakeEntry[]
}
export interface CreateMistakeEntry {
change: CreateMistakeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface CreateMistakeSummary {
action: "create_mistake"
catalog: "mistakes"

value: string
settings_only: true
affected_note_count: 0
message: string
}
export interface MistakeDeleteResult {
base_revision: string
resulting_revision: string
change: DeleteMistakeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface DeleteMistakeSummary {
action: "delete_mistake"
catalog: "mistakes"

value: string
settings_only: false

affected_trade_count: number

affected_review_count: number

affected_note_count: number
message: string
}
export interface MistakeMergeResult {
base_revision: string
resulting_revision: string
change: MergeMistakesSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface MergeMistakesSummary {
action: "merge_mistakes"
catalog: "mistakes"

source_value: string

target_value: string
settings_only: false

affected_trade_count: number

affected_review_count: number

affected_note_count: number
message: string
}
export interface MistakeRenameResult {
base_revision: string
resulting_revision: string
change: RenameMistakeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface RenameMistakeSummary {
action: "rename_mistake"
catalog: "mistakes"

source_value: string

target_value: string
settings_only: false

affected_trade_count: number

affected_review_count: number

affected_note_count: number
message: string
}
export interface PropChallengeAddCostSummary {
account_id: string
kind: ("purchase" | "reset" | "activation" | "other")
amount: number
date: string
}
export interface PropChallengeAdvanceSummary {
account_id: string
base_revision: string
from_phase_id: string

to_phase_id?: string
at: string

account_type?: string
}
export interface PropChallengeConfigureSummary {
account_id: string
base_revision: string
created: boolean
phase_count: number
rule_count: number

removed_phase_ids?: string[]
account_type?: string
}
export interface PropChallengeDeleteCostSummary {
account_id: string
cost_id: string
kind: ("purchase" | "reset" | "activation" | "other")
amount: number
date: string
}
export interface PropChallengeFailSummary {
account_id: string
base_revision: string
phase_id: string
}
export interface PropChallengeReopenSummary {
account_id: string
base_revision: string
phase_id: string
account_type?: string
}
export interface ReviewAddImagesSummary {
review: ReviewIdentity

widget: string
image_count: number
}
export interface ReviewIdentity {
period: ("day" | "week" | "month" | "quarter" | "year")
period_start: string
}
export interface ReviewAddKeyEventsSummary {
review: ReviewIdentity
event_count: number
}
export interface ReviewAddSessionLogEntriesSummary {
review: ReviewIdentity
entry_count: number
}
export interface ReviewCreateSummary {
review: ReviewIdentity
content: Content
}
export interface Content {
summary?: string

answers?: {
question_id: string
answer: string
}[]

goals?: Goal[]

checklist?: ChecklistItem[]
key_levels?: KeyLevels
grades?: Grades

reviewed?: boolean
}
export interface Goal {
text: string
done: boolean
}
export interface ChecklistItem {
text: string
done: boolean
}

export interface KeyLevels {

support: KeyLevel[]

resistance: KeyLevel[]
}
export interface KeyLevel {

price: string
importance: ("High" | "Medium" | "Low" | null)
}

export interface Grades {
mental?: ((("A" | "B" | "C") | (0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5)) | null)
technical?: ((("A" | "B" | "C") | (0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5)) | null)
}
export interface ReviewDeleteKeyEventSummary {
review: ReviewIdentity

key: string
imported: boolean
}
export interface ReviewDeleteSessionLogEntrySummary {
review: ReviewIdentity
entry_id: string
tag_id: string
}
export interface ReviewRemoveImagesSummary {
review: ReviewIdentity

widget: string
image_count: number
}
export interface ReviewSetDayTradeFieldsSummary {
review: ReviewIdentity

changed_fields: ("setup_ids" | "mistakes" | "tags" | "custom_fields")[]

trade_count: number
}

export interface ReviewSetImageAnnotationsSummary {
review: ReviewIdentity
effective: boolean
images: ImageAnnotationChanges
}

export interface ImageAnnotationChange {
media_id: string
effective: true
add_tags?: LabelBatch
remove_tags?: LabelBatch

notes?: (string | null)
}
export interface ReviewUpdateSummary {
review: ReviewIdentity
base_revision: string
content: Content
}
export interface ReviewUpdateKeyEventSummary {
review: ReviewIdentity

key: string

changed_fields: ("event" | "day" | "notes" | "color" | "currency" | "time")[]
}
export interface ReviewUpdateSessionLogEntrySummary {
review: ReviewIdentity
entry_id: string

changed_fields: ("time" | "tag_id" | "text" | "resolved")[]
}
export interface ReviewTemplateCreateResult {
base_revision: string
resulting_revision: string
change: TemplateUpsertChangeSummary
template: UserReviewTemplate
}
export interface TemplateUpsertChangeSummary {
action: ("create" | "duplicate" | "update")
template_id: string
template_name: string
review_type: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
widget_count: number
message: string
}
export interface UserReviewTemplate {
id: string
name: string
type: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
version: number
created_at: string
updated_at: string
widgets: WidgetPlacements
}
export interface WidgetPlacement {
type: string
id?: string
locked?: boolean
config?: BoundedJSONObject
}
export interface BoundedJSONObject {
[k: string]: ((string | number | boolean | null) | BoundedJSONArray | BoundedJSONObject)
}
export interface ReviewTemplateDeleteResult {
base_revision: string
resulting_revision: string
change: TemplateDeleteChangeSummary
}
export interface TemplateDeleteChangeSummary {
action: "delete"
template_id: string
template_name?: string
review_type?: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
widget_count?: number
message: string
}
export interface ReviewTemplateDuplicateResult {
base_revision: string
resulting_revision: string
change: TemplateUpsertChangeSummary
template: UserReviewTemplate
}
export interface ReviewTemplateSetDefaultResult {
base_revision: string
resulting_revision: string
change: TemplateSetDefaultChangeSummary
}
export interface TemplateSetDefaultChangeSummary {
action: "set_default"
review_type: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
template_id: (string | null)
message: string
}
export interface ReviewTemplateUpdateResult {
base_revision: string
resulting_revision: string
change: TemplateUpsertChangeSummary
template: UserReviewTemplate
}
export interface SessionStartUnplannedSummary {
trading_day: string
}
export interface SessionStopUnplannedSummary {
session_id: string
started_at: string
}
export interface SessionLogTagCreateSummary {
label: string

short_label: string
color: ("blue" | "indigo" | "purple" | "green" | "pink" | "amber" | "red" | "orange")
}

export interface SessionLogTagDeleteSummary {
tag_id: string
label: string
tagged_day_count: number
used_by_alert_rule: boolean
}
export interface SessionLogTagUpdateSummary {
tag_id: string
base_revision: string

changed_fields: ("label" | "short_label" | "color" | "requires_resolution" | "lesson")[]
}
export interface SessionWorkflowCreateResult {
base_revision: string
resulting_revision: string
change: WorkflowUpsertChangeSummary
workflow: TradeGateWorkflow
questions: WorkflowQuestions
}
export interface WorkflowUpsertChangeSummary {
action: ("create" | "update")
workflow_id: string
workflow_name: string
question_count: number
node_count: number
message: string
}
export interface TradeGateWorkflow {
id: string
name: string
start_node_id: string

nodes: TradeGateWorkflowNode[]

routes: TradeGateRoute[]
}
export interface TradeGateWorkflowNode {
id: string
question_id: string
}
export interface TradeGateRoute {
node_id: string
option_id: string
target: (TradeGateNodeRouteTarget | TradeGateOutcomeRouteTarget)
}
export interface TradeGateNodeRouteTarget {
kind: "node"
node_id: string
}
export interface TradeGateOutcomeRouteTarget {
kind: "outcome"
outcome: ("green-light" | "no-trade" | "wait")
note?: string
}
export interface TradeGateQuestion {
id: string
title: string
prompt: string

options: TradeGateQuestionOption[]
}
export interface TradeGateQuestionOption {
id: string
label: string
}
export interface SessionWorkflowDeleteResult {
base_revision: string
resulting_revision: string
change: WorkflowDeleteChangeSummary
}
export interface WorkflowDeleteChangeSummary {
action: "delete"
workflow_id: string
workflow_name?: string
node_count?: number
message: string
}
export interface SessionWorkflowDeleteQuestionResult {
base_revision: string
resulting_revision: string
change: QuestionDeleteChangeSummary
}
export interface QuestionDeleteChangeSummary {
action: "delete_question"
question_id: string
question_title?: string

workflow_count: number

placement_count: number
message: string
}
export interface SessionWorkflowUpdateResult {
base_revision: string
resulting_revision: string
change: WorkflowUpsertChangeSummary
workflow: TradeGateWorkflow
questions: WorkflowQuestions
}
export interface SettingsSetAnalyticsCalculationResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetAnalyticsCalculationSummary {
action: "set_analytics_calculation"

changed_fields: ("analytics_date_basis" | "include_unrealized_pnl" | "include_copy_accounts")[]
message: string
}
export interface SettingsSetDateTimeDisplaySummary {
action: "set_date_time_display"

changed_fields: ("date_format" | "use_24_hour_time" | "show_seconds" | "week_start_day")[]
message: string
}
export interface SettingsSetDisplayPreferencesSummary {
action: "set_display_preferences"

changed_fields: ("currency" | "accent_color_source" | "privacy_mode")[]
message: string
}
export interface SettingsSetTradingDaySummary {
action: "set_trading_day"

changed_fields: ("trading_day_cutoff_time" | "skip_weekends")[]
message: string
}
export interface SettingsSetRiskDisplaySummary {
action: "set_risk_display"

changed_fields: ("default_risk_amount" | "display_r_multiples" | "hide_dollar_amounts_in_shares" | "mae_mfe_input_mode" | "mae_mfe_display_unit")[]
message: string
}
export interface SettingsSetBreakEvenSummary {
action: "set_break_even"

changed_fields: ("mode" | "range_min" | "range_max" | "threshold_percent")[]
message: string
}
export interface SettingsSetTradeEntrySummary {
action: "set_trade_entry"

changed_fields: ("auto_open_created_trades" | "use_dollar_value_input" | "take_profit_unit" | "stop_loss_unit")[]
message: string
}
export interface SettingsSetReviewAutomationSummary {
action: "set_review_automation"

changed_fields: ("global_auto_create" | "auto_create_day_on_navigation" | "auto_create_week_on_navigation" | "auto_create_month_on_navigation" | "auto_create_quarter_on_navigation" | "auto_create_year_on_navigation" | "open_note_links_in_new_tab")[]
message: string
}
export interface SettingsSetEconomicCalendarSummary {
action: "set_economic_calendar"

changed_fields: ("auto_import" | "currencies" | "impacts" | "include_holidays")[]
message: string
}
export interface SettingsSetSessionScheduleSummary {
action: "set_session_schedule"

changed_fields: ("session_windows" | "preparation_lead_time_minutes" | "show_trade_executions_in_session_log")[]
message: string
}

export interface SettingsProjection {
revision: string
analytics_calculation: SettingsAnalyticsCalculation
date_time_display: SettingsDateTimeDisplay
display_preferences: SettingsDisplayPreferences
trading_day: SettingsTradingDay
risk_display: SettingsRiskDisplay
break_even: SettingsBreakEven
trade_entry: SettingsTradeEntry
review_automation: SettingsReviewAutomation
economic_calendar: SettingsEconomicCalendar
session_schedule: SettingsSessionSchedule
}

export interface SettingsAnalyticsCalculation {
revision: string
analytics_date_basis: ("entry" | "exit")

include_unrealized_pnl: boolean

include_copy_accounts: boolean
}

export interface SettingsDateTimeDisplay {
revision: string
date_format: ("DDMMYY" | "MMDDYY" | "YYMMDD")

use_24_hour_time: boolean

show_seconds: boolean
week_start_day: ("sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday")
}

export interface SettingsDisplayPreferences {
revision: string
currency: ("USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "NZD" | "CHF" | "DKK" | "CNY" | "HKD" | "INR" | "SGD")
accent_color_source: ("journalit" | "obsidian")

privacy_mode: boolean
}

export interface SettingsTradingDay {
revision: string

trading_day_cutoff_time: string

skip_weekends: boolean
}

export interface SettingsRiskDisplay {
revision: string
default_risk_amount: number

display_r_multiples: boolean

hide_dollar_amounts_in_shares: boolean
mae_mfe_input_mode: ("price" | "dollar")
mae_mfe_display_unit: ("dollar" | "ticks")
}

export interface SettingsBreakEven {
revision: string
mode: ("fixed" | "percentage_current_balance")
range_min: number
range_max: number
threshold_percent: number
}

export interface SettingsTradeEntry {
revision: string

auto_open_created_trades: boolean

use_dollar_value_input: boolean
take_profit_unit: ("percent" | "size")
stop_loss_unit: ("percent" | "size")
}

export interface SettingsReviewAutomation {
revision: string

global_auto_create: boolean

auto_create_day_on_navigation: boolean

auto_create_week_on_navigation: boolean

auto_create_month_on_navigation: boolean

auto_create_quarter_on_navigation: boolean

auto_create_year_on_navigation: boolean

open_note_links_in_new_tab: boolean
}

export interface SettingsEconomicCalendar {
revision: string

auto_import: boolean

currencies: ("AUD" | "CAD" | "CHF" | "EUR" | "GBP" | "JPY" | "NZD" | "USD")[]

impacts: ("none" | "low" | "medium" | "high")[]

include_holidays: boolean
}

export interface SettingsSessionSchedule {
revision: string
session_windows: SettingsSessionWindow[]
preparation_lead_time_minutes: number

show_trade_executions_in_session_log: boolean
}
export interface SettingsSessionWindow {
id: string
name: string

start_time: string

end_time: string
}
export interface SettingsSetBreakEvenResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetDateTimeDisplayResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetDisplayPreferencesResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetEconomicCalendarResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetReviewAutomationResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetRiskDisplayResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetSessionScheduleResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetTradeEntryResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetTradingDayResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SetupCreateSummary {

name: string
status: ("testing" | "active" | "archived")
rule_count: number
linked_note_count: number
}
export interface SetupDeleteResult {
setup_id: string

name: string
affected_note_count: number
}
export interface SetupRenameSummary {
setup_id: string

source_name: string

target_name: string
affected_note_count: number
}
export interface SetupUpdateSummary {
setup_id: string
base_revision: string

changed_fields: ("status" | "direction" | "color" | "tags" | "preferred_sessions" | "preferred_timeframes" | "preferred_tickers" | "playbook" | "rules" | "linked_notes")[]
}
export interface TagClearColorResult {
base_revision: string
resulting_revision: string
change: ClearTagColorSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface ClearTagColorSummary {
action: "clear_tag_color"
catalog: "tags"

value: string
settings_only: true
affected_note_count: 0
message: string
}
export interface TagCreateResult {
base_revision: string
resulting_revision: string

created: CreateTagEntry[]
}
export interface CreateTagEntry {
change: CreateTagSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface CreateTagSummary {
action: "create_tag"
catalog: "tags"

value: string
settings_only: true
affected_note_count: 0
message: string
}
export interface TagDeleteResult {
base_revision: string
resulting_revision: string
change: DeleteTagSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface DeleteTagSummary {
action: "delete_tag"
catalog: "tags"

value: string
settings_only: false

affected_trade_count: number

affected_setup_count: number

affected_review_count: number

affected_other_note_count: number

affected_note_count: number
message: string
}
export interface TagMergeResult {
base_revision: string
resulting_revision: string
change: MergeTagsSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface MergeTagsSummary {
action: "merge_tags"
catalog: "tags"

source_value: string

target_value: string
settings_only: false

affected_trade_count: number

affected_setup_count: number

affected_review_count: number

affected_other_note_count: number

affected_note_count: number
message: string
}
export interface TagRenameResult {
base_revision: string
resulting_revision: string
change: RenameTagSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface RenameTagSummary {
action: "rename_tag"
catalog: "tags"

source_value: string

target_value: string
settings_only: false

affected_trade_count: number

affected_setup_count: number

affected_review_count: number

affected_other_note_count: number

affected_note_count: number
message: string
}
export interface TagSetColorResult {
base_revision: string
resulting_revision: string
change: SetTagColorSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface SetTagColorSummary {
action: "set_tag_color"
catalog: "tags"

value: string
settings_only: true
affected_note_count: 0
message: string
}

export interface TradeCreateSummary {
trade_type: ("regular" | "missed" | "backtest")

instrument: string
asset_type: ("stock" | "futures" | "forex" | "crypto" | "options" | "cfd")
direction: ("long" | "short")
executions: Executions
status: ("open" | "partially_closed" | "closed")
pnl: (number | null)
}

export interface Executions {

entries: ExecutionLeg[]

exits: ExecutionLeg[]
}
export interface ExecutionLeg {
time: string
price: number
size: number
}
export interface TradeDeleteSummary {
trade_id: string
trade_type: ("regular" | "missed" | "backtest")
base_revision: number
}

export interface TradeSetImageAnnotationsSummary {
trade_id: string
base_revision: number
effective: boolean
images: ImageAnnotationChanges
}
export interface TradeSetTypeSummary {
trade_id: string
base_revision: number
source_type: ("regular" | "missed" | "backtest")
target_type: ("regular" | "missed" | "backtest")
account_id?: string
}

export interface TradeUpdateSummary {
trade_id: string
base_revision: number
effective: boolean
set?: FieldChanges
stop_losses?: StopLossList
take_profits?: TakeProfitList
add_tags?: LabelBatch
remove_tags?: LabelBatch
add_mistakes?: MistakeIdentityBatch
remove_mistakes?: MistakeIdentityBatch
executions?: Executions
custom_fields?: CustomFieldChanges
}
export interface FieldChanges {
setup_id?: (string | null)
account_id?: (string | null)
stop_loss?: (number | null)
take_profit?: (number | null)
risk_amount?: (number | null)
direction?: ("long" | "short")

direct_pnl?: (number | null)

commission?: (number | null)
fees?: (number | null)
swap?: (number | null)
missed_reason?: (string | null)

thesis?: (string | null)

reviewed?: boolean

notes?: string
}

export interface PlannedTarget {
price: number

close_percent?: number

size?: number
}
export interface Approval {

reasons: ("action_policy" | "bulk")[]
required: boolean
}
export interface ResultMeta {
contract_version: "1.0.0"
contract_digest: string
cached: boolean
row_count?: number
}
export interface Committed {

actions: (({
action: "account.add_transaction"
index: number
outcome: "applied"
result: AccountAddTransactionResult
} | {
action: "account.create"
index: number
outcome: "applied"
result: AccountCreateResult
} | {
action: "account.delete"
index: number
outcome: "applied"
result: AccountDeleteResult
} | {
action: "account.delete_transaction"
index: number
outcome: "applied"
result: AccountDeleteTransactionResult
} | {
action: "account.rename"
index: number
outcome: "applied"
result: AccountRenameResult
} | {
action: "account.update"
index: number
outcome: "applied"
result: AccountUpdateResult
} | {
action: "account_type.create"
index: number
outcome: "applied"
result: AccountTypeCreateResult
} | {
action: "account_type.delete"
index: number
outcome: "applied"
result: AccountTypeDeleteResult
} | {
action: "account_type.move"
index: number
outcome: "applied"
result: AccountTypeMoveResult
} | {
action: "account_type.rename"
index: number
outcome: "applied"
result: AccountTypeRenameResult
} | {
action: "custom_field.create"
index: number
outcome: "applied"
result: CustomFieldCreateResult
} | {
action: "custom_field.delete"
index: number
outcome: "applied"
result: CustomFieldDeleteResult
} | {
action: "custom_field.reorder"
index: number
outcome: "applied"
result: CustomFieldReorderResult
} | {
action: "custom_field.update"
index: number
outcome: "applied"
result: CustomFieldUpdateResult
} | {
action: "dashboard_layout.create"
index: number
outcome: "applied"
result: DashboardLayoutCreateResult
} | {
action: "dashboard_layout.delete"
index: number
outcome: "applied"
result: DashboardLayoutDeleteResult
} | {
action: "dashboard_layout.duplicate"
index: number
outcome: "applied"
result: DashboardLayoutDuplicateResult
} | {
action: "dashboard_layout.rename"
index: number
outcome: "applied"
result: DashboardLayoutRenameResult
} | {
action: "dashboard_layout.set_active"
index: number
outcome: "applied"
result: DashboardLayoutSetActiveResult
} | {
action: "dashboard_layout.update"
index: number
outcome: "applied"
result: DashboardLayoutUpdateResult
} | {
action: "event.create"
index: number
outcome: "applied"
result: EventCreateResult
} | {
action: "event.delete"
index: number
outcome: "applied"
result: EventDeleteResult
} | {
action: "event.merge"
index: number
outcome: "applied"
result: EventMergeResult
} | {
action: "event.rename"
index: number
outcome: "applied"
result: EventRenameResult
} | {
action: "event.update_style"
index: number
outcome: "applied"
result: EventUpdateStyleResult
} | {
action: "home_layout.create"
index: number
outcome: "applied"
result: HomeLayoutCreateResult
} | {
action: "home_layout.delete"
index: number
outcome: "applied"
result: HomeLayoutDeleteResult
} | {
action: "home_layout.duplicate"
index: number
outcome: "applied"
result: HomeLayoutDuplicateResult
} | {
action: "home_layout.rename"
index: number
outcome: "applied"
result: HomeLayoutRenameResult
} | {
action: "home_layout.set_active"
index: number
outcome: "applied"
result: HomeLayoutSetActiveResult
} | {
action: "home_layout.update"
index: number
outcome: "applied"
result: HomeLayoutUpdateResult
} | {
action: "mistake.create"
index: number
outcome: "applied"
result: MistakeCreateResult
} | {
action: "mistake.delete"
index: number
outcome: "applied"
result: MistakeDeleteResult
} | {
action: "mistake.merge"
index: number
outcome: "applied"
result: MistakeMergeResult
} | {
action: "mistake.rename"
index: number
outcome: "applied"
result: MistakeRenameResult
} | {
action: "prop_challenge.add_cost"
index: number
outcome: "applied"
result: PropChallengeAddCostResult
} | {
action: "prop_challenge.advance"
index: number
outcome: "applied"
result: PropChallengeAdvanceResult
} | {
action: "prop_challenge.configure"
index: number
outcome: "applied"
result: PropChallengeConfigureResult
} | {
action: "prop_challenge.delete_cost"
index: number
outcome: "applied"
result: PropChallengeDeleteCostResult
} | {
action: "prop_challenge.fail"
index: number
outcome: "applied"
result: PropChallengeFailResult
} | {
action: "prop_challenge.reopen"
index: number
outcome: "applied"
result: PropChallengeReopenResult
} | {
action: "review.add_images"
index: number
outcome: "applied"
result: ReviewAddImagesResult
} | {
action: "review.add_key_events"
index: number
outcome: "applied"
result: ReviewAddKeyEventsResult
} | {
action: "review.add_session_log_entries"
index: number
outcome: "applied"
result: ReviewAddSessionLogEntriesResult
} | {
action: "review.create"
index: number
outcome: "applied"
result: ReviewCreateResult
} | {
action: "review.delete_key_event"
index: number
outcome: "applied"
result: ReviewDeleteKeyEventResult
} | {
action: "review.delete_session_log_entry"
index: number
outcome: "applied"
result: ReviewDeleteSessionLogEntryResult
} | {
action: "review.remove_images"
index: number
outcome: "applied"
result: ReviewRemoveImagesResult
} | {
action: "review.set_day_trade_fields"
index: number
outcome: "applied"
result: ReviewSetDayTradeFieldsResult
} | {
action: "review.set_image_annotations"
index: number
outcome: "applied"
result: ReviewSetImageAnnotationsResult
} | {
action: "review.update"
index: number
outcome: "applied"
result: ReviewUpdateResult
} | {
action: "review.update_key_event"
index: number
outcome: "applied"
result: ReviewUpdateKeyEventResult
} | {
action: "review.update_session_log_entry"
index: number
outcome: "applied"
result: ReviewUpdateSessionLogEntryResult
} | {
action: "review_template.create"
index: number
outcome: "applied"
result: ReviewTemplateCreateResult
} | {
action: "review_template.delete"
index: number
outcome: "applied"
result: ReviewTemplateDeleteResult
} | {
action: "review_template.duplicate"
index: number
outcome: "applied"
result: ReviewTemplateDuplicateResult
} | {
action: "review_template.set_default"
index: number
outcome: "applied"
result: ReviewTemplateSetDefaultResult
} | {
action: "review_template.update"
index: number
outcome: "applied"
result: ReviewTemplateUpdateResult
} | {
action: "session.start_unplanned"
index: number
outcome: "applied"
result: SessionStartUnplannedResult
} | {
action: "session.stop_unplanned"
index: number
outcome: "applied"
result: SessionStopUnplannedResult
} | {
action: "session_log_tag.create"
index: number
outcome: "applied"
result: SessionLogTagCreateResult
} | {
action: "session_log_tag.delete"
index: number
outcome: "applied"
result: SessionLogTagDeleteResult
} | {
action: "session_log_tag.update"
index: number
outcome: "applied"
result: SessionLogTagUpdateResult
} | {
action: "session_workflow.create"
index: number
outcome: "applied"
result: SessionWorkflowCreateResult
} | {
action: "session_workflow.delete"
index: number
outcome: "applied"
result: SessionWorkflowDeleteResult
} | {
action: "session_workflow.delete_question"
index: number
outcome: "applied"
result: SessionWorkflowDeleteQuestionResult
} | {
action: "session_workflow.update"
index: number
outcome: "applied"
result: SessionWorkflowUpdateResult
} | {
action: "settings.set_analytics_calculation"
index: number
outcome: "applied"
result: SettingsSetAnalyticsCalculationResult
} | {
action: "settings.set_break_even"
index: number
outcome: "applied"
result: SettingsSetBreakEvenResult
} | {
action: "settings.set_date_time_display"
index: number
outcome: "applied"
result: SettingsSetDateTimeDisplayResult
} | {
action: "settings.set_display_preferences"
index: number
outcome: "applied"
result: SettingsSetDisplayPreferencesResult
} | {
action: "settings.set_economic_calendar"
index: number
outcome: "applied"
result: SettingsSetEconomicCalendarResult
} | {
action: "settings.set_review_automation"
index: number
outcome: "applied"
result: SettingsSetReviewAutomationResult
} | {
action: "settings.set_risk_display"
index: number
outcome: "applied"
result: SettingsSetRiskDisplayResult
} | {
action: "settings.set_session_schedule"
index: number
outcome: "applied"
result: SettingsSetSessionScheduleResult
} | {
action: "settings.set_trade_entry"
index: number
outcome: "applied"
result: SettingsSetTradeEntryResult
} | {
action: "settings.set_trading_day"
index: number
outcome: "applied"
result: SettingsSetTradingDayResult
} | {
action: "setup.create"
index: number
outcome: "applied"
result: SetupUpdateResult
} | {
action: "setup.delete"
index: number
outcome: "applied"
result: SetupDeleteResult
} | {
action: "setup.rename"
index: number
outcome: "applied"
result: SetupUpdateResult
} | {
action: "setup.update"
index: number
outcome: "applied"
result: SetupUpdateResult
} | {
action: "tag.clear_color"
index: number
outcome: "applied"
result: TagClearColorResult
} | {
action: "tag.create"
index: number
outcome: "applied"
result: TagCreateResult
} | {
action: "tag.delete"
index: number
outcome: "applied"
result: TagDeleteResult
} | {
action: "tag.merge"
index: number
outcome: "applied"
result: TagMergeResult
} | {
action: "tag.rename"
index: number
outcome: "applied"
result: TagRenameResult
} | {
action: "tag.set_color"
index: number
outcome: "applied"
result: TagSetColorResult
} | {
action: "trade.create"
index: number
outcome: "applied"
result: TradeCreateResult
} | {
action: "trade.delete"
index: number
outcome: "applied"
result: TradeDeleteResult
} | {
action: "trade.set_image_annotations"
index: number
outcome: "applied"
result: TradeSetImageAnnotationsResult
} | {
action: "trade.set_type"
index: number
outcome: "applied"
result: TradeSetTypeResult
} | {
action: "trade.update"
index: number
outcome: "applied"
result: TradeUpdateResult
}) | ({
action: ("account.add_transaction" | "account.create" | "account.delete" | "account.delete_transaction" | "account.rename" | "account.update" | "account_type.create" | "account_type.delete" | "account_type.move" | "account_type.rename" | "custom_field.create" | "custom_field.delete" | "custom_field.reorder" | "custom_field.update" | "dashboard_layout.create" | "dashboard_layout.delete" | "dashboard_layout.duplicate" | "dashboard_layout.rename" | "dashboard_layout.set_active" | "dashboard_layout.update" | "event.create" | "event.delete" | "event.merge" | "event.rename" | "event.update_style" | "home_layout.create" | "home_layout.delete" | "home_layout.duplicate" | "home_layout.rename" | "home_layout.set_active" | "home_layout.update" | "mistake.create" | "mistake.delete" | "mistake.merge" | "mistake.rename" | "prop_challenge.add_cost" | "prop_challenge.advance" | "prop_challenge.configure" | "prop_challenge.delete_cost" | "prop_challenge.fail" | "prop_challenge.reopen" | "review.add_images" | "review.add_key_events" | "review.add_session_log_entries" | "review.create" | "review.delete_key_event" | "review.delete_session_log_entry" | "review.remove_images" | "review.set_day_trade_fields" | "review.set_image_annotations" | "review.update" | "review.update_key_event" | "review.update_session_log_entry" | "review_template.create" | "review_template.delete" | "review_template.duplicate" | "review_template.set_default" | "review_template.update" | "session.start_unplanned" | "session.stop_unplanned" | "session_log_tag.create" | "session_log_tag.delete" | "session_log_tag.update" | "session_workflow.create" | "session_workflow.delete" | "session_workflow.delete_question" | "session_workflow.update" | "settings.set_analytics_calculation" | "settings.set_break_even" | "settings.set_date_time_display" | "settings.set_display_preferences" | "settings.set_economic_calendar" | "settings.set_review_automation" | "settings.set_risk_display" | "settings.set_session_schedule" | "settings.set_trade_entry" | "settings.set_trading_day" | "setup.create" | "setup.delete" | "setup.rename" | "setup.update" | "tag.clear_color" | "tag.create" | "tag.delete" | "tag.merge" | "tag.rename" | "tag.set_color" | "trade.create" | "trade.delete" | "trade.set_image_annotations" | "trade.set_type" | "trade.update")
failure: ActionFailure
index: number
outcome: "failed"
} | {
action: ("account.add_transaction" | "account.create" | "account.delete" | "account.delete_transaction" | "account.rename" | "account.update" | "account_type.create" | "account_type.delete" | "account_type.move" | "account_type.rename" | "custom_field.create" | "custom_field.delete" | "custom_field.reorder" | "custom_field.update" | "dashboard_layout.create" | "dashboard_layout.delete" | "dashboard_layout.duplicate" | "dashboard_layout.rename" | "dashboard_layout.set_active" | "dashboard_layout.update" | "event.create" | "event.delete" | "event.merge" | "event.rename" | "event.update_style" | "home_layout.create" | "home_layout.delete" | "home_layout.duplicate" | "home_layout.rename" | "home_layout.set_active" | "home_layout.update" | "mistake.create" | "mistake.delete" | "mistake.merge" | "mistake.rename" | "prop_challenge.add_cost" | "prop_challenge.advance" | "prop_challenge.configure" | "prop_challenge.delete_cost" | "prop_challenge.fail" | "prop_challenge.reopen" | "review.add_images" | "review.add_key_events" | "review.add_session_log_entries" | "review.create" | "review.delete_key_event" | "review.delete_session_log_entry" | "review.remove_images" | "review.set_day_trade_fields" | "review.set_image_annotations" | "review.update" | "review.update_key_event" | "review.update_session_log_entry" | "review_template.create" | "review_template.delete" | "review_template.duplicate" | "review_template.set_default" | "review_template.update" | "session.start_unplanned" | "session.stop_unplanned" | "session_log_tag.create" | "session_log_tag.delete" | "session_log_tag.update" | "session_workflow.create" | "session_workflow.delete" | "session_workflow.delete_question" | "session_workflow.update" | "settings.set_analytics_calculation" | "settings.set_break_even" | "settings.set_date_time_display" | "settings.set_display_preferences" | "settings.set_economic_calendar" | "settings.set_review_automation" | "settings.set_risk_display" | "settings.set_session_schedule" | "settings.set_trade_entry" | "settings.set_trading_day" | "setup.create" | "setup.delete" | "setup.rename" | "setup.update" | "tag.clear_color" | "tag.create" | "tag.delete" | "tag.merge" | "tag.rename" | "tag.set_color" | "trade.create" | "trade.delete" | "trade.set_image_annotations" | "trade.set_type" | "trade.update")
index: number
outcome: "not_attempted"
}))[]
meta: ResultMeta
outcome: ("applied" | "partially_applied" | "failed")
status: "ok"
variant: "committed"
}
export interface AccountAddTransactionResult {
account_id: string
transaction_id: string
}
export interface AccountCreateResult {
account_id: string
revision: string
}
export interface AccountDeleteResult {
account_id: string
}
export interface AccountDeleteTransactionResult {
account_id: string
transaction_id: string
}
export interface AccountRenameResult {
account_id: string
revision: string
}
export interface AccountUpdateResult {
account_id: string
revision: string
}
export interface CustomFieldCreateResult {
field_id: string
revision: string
}
export interface CustomFieldDeleteResult {
field_id: string
}
export interface CustomFieldReorderResult {
revision: string
}
export interface CustomFieldUpdateResult {
field_id: string
revision: string
}
export interface PropChallengeAddCostResult {
account_id: string
cost_id: string
}
export interface PropChallengeAdvanceResult {
account_id: string
revision: string
}
export interface PropChallengeConfigureResult {
account_id: string
revision: string
}
export interface PropChallengeDeleteCostResult {
account_id: string
cost_id: string
}
export interface PropChallengeFailResult {
account_id: string
revision: string
}
export interface PropChallengeReopenResult {
account_id: string
revision: string
}
export interface ReviewAddImagesResult {
review: ReviewIdentity

widget: string

media_ids: string[]
}
export interface ReviewAddKeyEventsResult {
review: ReviewIdentity

keys: string[]
}
export interface ReviewAddSessionLogEntriesResult {
review: ReviewIdentity

entry_ids: string[]
}
export interface ReviewCreateResult {
review: ReviewIdentity
revision: string
}
export interface ReviewDeleteKeyEventResult {
review: ReviewIdentity

key: string
}
export interface ReviewDeleteSessionLogEntryResult {
review: ReviewIdentity
entry_id: string
}
export interface ReviewRemoveImagesResult {
review: ReviewIdentity

widget: string
}
export interface ReviewSetDayTradeFieldsResult {
review: ReviewIdentity
updated_trade_count: number

failed_trade_count: number
}
export interface ReviewSetImageAnnotationsResult {
review: ReviewIdentity

media_ids: string[]
}
export interface ReviewUpdateResult {
review: ReviewIdentity
revision: string
}
export interface ReviewUpdateKeyEventResult {
review: ReviewIdentity

key: string
}
export interface ReviewUpdateSessionLogEntryResult {
review: ReviewIdentity
entry_id: string
}
export interface SessionStartUnplannedResult {
session_id: string
trading_day: string
started_at: string
}
export interface SessionStopUnplannedResult {
session_id: string
stopped_at: string
}
export interface SessionLogTagCreateResult {
tag_id: string
revision: string
}
export interface SessionLogTagDeleteResult {
tag_id: string
}
export interface SessionLogTagUpdateResult {
tag_id: string
revision: string
}
export interface SetupUpdateResult {
setup_id: string
revision: string
}
export interface TradeCreateResult {
trade_id: string
trade_revision: number
}
export interface TradeDeleteResult {
trade_id: string
}
export interface TradeSetImageAnnotationsResult {
trade_id: string
trade_revision: number

media_ids: string[]
}
export interface TradeSetTypeResult {
trade_id: string
trade_revision: number
}
export interface TradeUpdateResult {
trade_id: string
trade_revision: number
}
export interface ActionFailure {
code: ("invalid_request" | "permission_denied" | "not_found" | "conflict" | "unsupported_operation" | "write_failed" | "outcome_unknown" | "internal_error")
retryable: boolean
}
export interface ApprovalPending {
expires_at: string
meta: ResultMeta
preview_id: string
status: "ok"
variant: "approval_pending"
}
export interface ApprovalDenied {
meta: ResultMeta
preview_id: string
status: "ok"
variant: "approval_denied"
}
export interface Error {
status: "error"
code: ("invalid_request" | "permission_denied" | "not_found" | "conflict" | "cursor_expired" | "preview_expired" | "offline" | "timeout" | "cancelled" | "limit_exceeded" | "unsupported_capability" | "plugin_update_required" | "integration_unavailable" | "internal_error")
message: string
retryable: boolean

details?: {
field: string

reason: ("connection_not_usable" | "connection_not_found" | "connection_busy" | "connection_needs_reconnect" | "journalit_offline" | "connection_limit_exceeded" | "connection_action_unsupported" | "connection_unavailable" | "missed_trades_unsupported" | "action_invalid" | "action_target_not_found" | "action_conflict" | "action_limit_exceeded" | "action_unsupported" | "action_not_permitted" | "preview_expired" | "changes_unavailable" | "result_too_large" | "request_contract_violation")
}[]
}
