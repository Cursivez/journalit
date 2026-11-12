

export type ApplyChangesRequest = ({

actions: ({
action: "account.add_transaction"
input: AccountAddTransactionInput
} | {
action: "account.create"
input: AccountCreateInput
} | {
action: "account.delete"
input: AccountDeleteInput
} | {
action: "account.delete_transaction"
input: AccountDeleteTransactionInput
} | {
action: "account.rename"
input: AccountRenameInput
} | {
action: "account.update"
input: AccountUpdateInput
} | {
action: "account_type.create"
input: AccountTypeCreateInput
} | {
action: "account_type.delete"
input: AccountTypeDeleteInput
} | {
action: "account_type.move"
input: AccountTypeMoveInput
} | {
action: "account_type.rename"
input: AccountTypeRenameInput
} | {
action: "custom_field.create"
input: CustomFieldCreateInput
} | {
action: "custom_field.delete"
input: CustomFieldDeleteInput
} | {
action: "custom_field.reorder"
input: CustomFieldReorderInput
} | {
action: "custom_field.update"
input: CustomFieldUpdateInput
} | {
action: "dashboard_comparison.create"
input: DashboardComparisonCreateInput
} | {
action: "dashboard_comparison.delete"
input: DashboardComparisonDeleteInput
} | {
action: "dashboard_comparison.update"
input: DashboardComparisonUpdateInput
} | {
action: "dashboard_layout.create"
input: DashboardLayoutCreateInput
} | {
action: "dashboard_layout.delete"
input: DashboardLayoutDeleteInput
} | {
action: "dashboard_layout.duplicate"
input: DashboardLayoutDuplicateInput
} | {
action: "dashboard_layout.rename"
input: DashboardLayoutRenameInput
} | {
action: "dashboard_layout.set_active"
input: DashboardLayoutSetActiveInput
} | {
action: "dashboard_layout.update"
input: DashboardLayoutUpdateInput
} | {
action: "event.create"
input: EventCreateInput
} | {
action: "event.delete"
input: EventDeleteInput
} | {
action: "event.merge"
input: EventMergeInput
} | {
action: "event.rename"
input: EventRenameInput
} | {
action: "event.update_style"
input: EventUpdateStyleInput
} | {
action: "home_goal.set"
input: HomeGoalSetInput
} | {
action: "home_layout.create"
input: HomeLayoutCreateInput
} | {
action: "home_layout.delete"
input: HomeLayoutDeleteInput
} | {
action: "home_layout.duplicate"
input: HomeLayoutDuplicateInput
} | {
action: "home_layout.rename"
input: HomeLayoutRenameInput
} | {
action: "home_layout.set_active"
input: HomeLayoutSetActiveInput
} | {
action: "home_layout.update"
input: HomeLayoutUpdateInput
} | {
action: "mistake.create"
input: MistakeCreateInput
} | {
action: "mistake.delete"
input: MistakeDeleteInput
} | {
action: "mistake.merge"
input: MistakeMergeInput
} | {
action: "mistake.rename"
input: MistakeRenameInput
} | {
action: "prop_challenge.add_cost"
input: PropChallengeAddCostInput
} | {
action: "prop_challenge.add_prior_payout"
input: PropChallengeAddPriorPayoutInput
} | {
action: "prop_challenge.advance"
input: PropChallengeAdvanceInput
} | {
action: "prop_challenge.configure"
input: PropChallengeConfigureInput
} | {
action: "prop_challenge.delete_cost"
input: PropChallengeDeleteCostInput
} | {
action: "prop_challenge.delete_prior_payout"
input: PropChallengeDeletePriorPayoutInput
} | {
action: "prop_challenge.fail"
input: PropChallengeFailInput
} | {
action: "prop_challenge.remove_drawdown_floor"
input: PropChallengeRemoveDrawdownFloorInput
} | {
action: "prop_challenge.reopen"
input: PropChallengeReopenInput
} | {
action: "prop_challenge.set_drawdown_floor"
input: PropChallengeSetDrawdownFloorInput
} | {
action: "review.add_images"
input: ReviewAddImagesInput
} | {
action: "review.add_key_events"
input: ReviewAddKeyEventsInput
} | {
action: "review.add_session_log_entries"
input: ReviewAddSessionLogEntriesInput
} | {
action: "review.create"
input: ReviewCreateInput
} | {
action: "review.delete_key_event"
input: ReviewDeleteKeyEventInput
} | {
action: "review.delete_session_log_entry"
input: ReviewDeleteSessionLogEntryInput
} | {
action: "review.remove_images"
input: ReviewRemoveImagesInput
} | {
action: "review.set_day_trade_fields"
input: ReviewSetDayTradeFieldsInput
} | {
action: "review.set_image_annotations"
input: ReviewSetImageAnnotationsInput
} | {
action: "review.update"
input: ReviewUpdateInput
} | {
action: "review.update_key_event"
input: ReviewUpdateKeyEventInput
} | {
action: "review.update_session_log_entry"
input: ReviewUpdateSessionLogEntryInput
} | {
action: "review_template.create"
input: ReviewTemplateCreateInput
} | {
action: "review_template.delete"
input: ReviewTemplateDeleteInput
} | {
action: "review_template.duplicate"
input: ReviewTemplateDuplicateInput
} | {
action: "review_template.set_default"
input: ReviewTemplateSetDefaultInput
} | {
action: "review_template.update"
input: ReviewTemplateUpdateInput
} | {
action: "session.start_unplanned"
input: SessionStartUnplannedInput
} | {
action: "session.stop_unplanned"
input: SessionStopUnplannedInput
} | {
action: "session_log_tag.create"
input: SessionLogTagCreateInput
} | {
action: "session_log_tag.delete"
input: SessionLogTagDeleteInput
} | {
action: "session_log_tag.update"
input: SessionLogTagUpdateInput
} | {
action: "session_workflow.create"
input: SessionWorkflowCreateInput
} | {
action: "session_workflow.delete"
input: SessionWorkflowDeleteInput
} | {
action: "session_workflow.delete_question"
input: SessionWorkflowDeleteQuestionInput
} | {
action: "session_workflow.update"
input: SessionWorkflowUpdateInput
} | {
action: "settings.set_analytics_calculation"
input: SettingsSetAnalyticsCalculationInput
} | {
action: "settings.set_break_even"
input: SettingsSetBreakEvenInput
} | {
action: "settings.set_date_time_display"
input: SettingsSetDateTimeDisplayInput
} | {
action: "settings.set_display_preferences"
input: SettingsSetDisplayPreferencesInput
} | {
action: "settings.set_economic_calendar"
input: SettingsSetEconomicCalendarInput
} | {
action: "settings.set_review_automation"
input: SettingsSetReviewAutomationInput
} | {
action: "settings.set_risk_display"
input: SettingsSetRiskDisplayInput
} | {
action: "settings.set_session_schedule"
input: SettingsSetSessionScheduleInput
} | {
action: "settings.set_trade_entry"
input: SettingsSetTradeEntryInput
} | {
action: "settings.set_trading_day"
input: SettingsSetTradingDayInput
} | {
action: "setup.create"
input: SetupCreateInput
} | {
action: "setup.delete"
input: SetupDeleteInput
} | {
action: "setup.rename"
input: SetupRenameInput
} | {
action: "setup.update"
input: SetupUpdateInput
} | {
action: "tag.clear_color"
input: TagClearColorInput
} | {
action: "tag.create"
input: TagCreateInput
} | {
action: "tag.delete"
input: TagDeleteInput
} | {
action: "tag.merge"
input: TagMergeInput
} | {
action: "tag.rename"
input: TagRenameInput
} | {
action: "tag.set_color"
input: TagSetColorInput
} | {
action: "trade.add_images"
input: TradeAddImagesInput
} | {
action: "trade.create"
input: TradeCreateInput
} | {
action: "trade.delete"
input: TradeDeleteInput
} | {
action: "trade.remove_images"
input: TradeRemoveImagesInput
} | {
action: "trade.set_image_annotations"
input: TradeSetImageAnnotationsInput
} | {
action: "trade.set_type"
input: TradeSetTypeInput
} | {
action: "trade.update"
input: TradeUpdateInput
})[]
mode: "preview"
} | {
idempotency_key: string
mode: "commit"
preview_id: string
})

export type CustomFieldOptions = CustomFieldOption[]

export type CustomFieldOptions1 = CustomFieldOption[]

export type IdValues = string[]

export type StringValues = string[]

export type DirectionValues = ("long" | "short")[]

export type DashboardStatusValues = ("open" | "win" | "loss" | "breakeven" | "cancelled")[]

export type TradeTypeValues = ("regular" | "missed" | "backtest")[]

export type ReviewStatusValues = ("reviewed" | "unreviewed")[]

export type RatingValues = ("5" | "4" | "3" | "2" | "1" | "unrated")[]

export type MarketBiasValues = ("with" | "against" | "neutral" | "none")[]

export type ImageAnnotationStatusValues = ("tagged" | "untagged" | "has_notes" | "no_notes")[]

export type CustomFieldClauses = {
field_id: string
operator: ("equals" | "not_equals" | "contains" | "greater_than" | "greater_than_or_equal" | "less_than" | "less_than_or_equal")
value: (string | number | boolean | string[])
}[]

export type MarketBias = MarketBiasEntry[]

export type DayTradeFieldList = string[]

export type DayTradeFieldList1 = string[]

export type CustomFieldChanges = {
field_id: string
value: ((string | number | string[]) | null)
}[]

export type LabelBatch = string[]

export type LabelBatch1 = string[]

export type ImageAnnotations = ImageAnnotation[]

export type BoundedJSONArray = ((string | number | boolean | null) | BoundedJSONArray | BoundedJSONObject)[]

export type WidgetPlacements = WidgetPlacement[]

export type WorkflowQuestions = TradeGateQuestion[]

export type SettingsFavoriteAccounts = string[]

export type LabelList = string[]

export type PreferenceList = string[]

export type StopLossList = PlannedTarget[]

export type TakeProfitList = PlannedTarget[]

export type IdealExitList = IdealExit[]

export type DividendList = Dividend[]

export type LabelBatch2 = string[]

export type MistakeIdentityBatch = string[]

export type CustomFieldAssignments = {
field_id: string

value: (string | number | string[])
}[]

export type CustomFieldChanges1 = {
field_id: string
value: ((string | number | string[]) | null)
}[]


export interface AccountAddTransactionInput {
account_id: string
type: ("deposit" | "withdrawal")
amount: number
date: string
description?: string
}

export interface AccountCreateInput {

name: string
account_type: string
currency?: ("USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "NZD" | "CHF" | "DKK" | "CNY" | "HKD" | "INR" | "SGD" | "KWD" | "NGN")
created_date: string
initial_balance: number

drawdown?: ({
type: "none"
} | {
type: ("fixed" | "eod_trailing")
amount: number
} | {
type: "manual"
amount: number

snapshots: AccountDrawdownSnapshot[]
})
monthly_cost?: number
profit_target?: AccountProfitTarget
copy_trading?: CopyTrading
live_balance?: number
}
export interface AccountDrawdownSnapshot {
date: string
limit: number
note?: string
}
export interface AccountProfitTarget {
type: ("absolute" | "percentage")
amount: number
target_date?: string
}
export interface CopyTrading {
base_account_id: string
multiplier: number

start_date?: string
}

export interface AccountDeleteInput {
account_id: string
expected_revision: string
}
export interface AccountDeleteTransactionInput {
account_id: string
transaction_id: string
}

export interface AccountRenameInput {
account_id: string
expected_revision: string

name: string
}
export interface AccountUpdateInput {
account_id: string
expected_revision: string
fields: {
account_type?: string
currency?: ("USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "NZD" | "CHF" | "DKK" | "CNY" | "HKD" | "INR" | "SGD" | "KWD" | "NGN")
created_date?: string
initial_balance?: number

live_balance?: (number | null)

drawdown?: ({
type: "none"
} | {
type: ("fixed" | "eod_trailing")
amount: number
} | {
type: "manual"
amount: number

snapshots: AccountDrawdownSnapshot[]
})
profit_target?: (AccountProfitTarget | null)
monthly_cost?: number

copy_trading?: (CopyTrading | null)
}
}
export interface AccountTypeCreateInput {

values: CreateAccountTypeValue[]
}
export interface CreateAccountTypeValue {

value: string
}

export interface AccountTypeDeleteInput {

value: string
}

export interface AccountTypeMoveInput {

value: string

before_value?: string
}

export interface AccountTypeRenameInput {

source_value: string

target_value: string
}

export interface CustomFieldCreateInput {
label: string
type: ("text" | "number" | "dropdown" | "multiselect" | "date" | "datetime" | "time")
options?: CustomFieldOptions
validation?: CustomFieldValidation
placeholder?: string
helper_text?: string
allow_create_options?: boolean
}
export interface CustomFieldOption {
value: string
label: string
}

export interface CustomFieldValidation {
required?: boolean
min?: number
max?: number
min_length?: number
max_length?: number

pattern?: string
}
export interface CustomFieldDeleteInput {
field_id: string
}

export interface CustomFieldReorderInput {
expected_revision: string

field_ids: string[]
}

export interface CustomFieldUpdateInput {
field_id: string
expected_revision: string
fields: FieldChanges
}
export interface FieldChanges {
label?: string
options?: CustomFieldOptions1
validation?: CustomFieldValidation1
placeholder?: (string | null)
helper_text?: (string | null)
allow_create_options?: boolean
}

export interface CustomFieldValidation1 {
required?: boolean
min?: number
max?: number
min_length?: number
max_length?: number

pattern?: string
}

export interface DashboardComparisonCreateInput {
name: string
a: DashboardComparisonFilters
b: DashboardComparisonFilters
}

export interface DashboardComparisonFilters {
account_ids?: IdValues
setup_ids?: IdValues
tickers?: StringValues
tags?: StringValues
mistakes?: StringValues
directions?: DirectionValues
status?: DashboardStatusValues
trade_types?: TradeTypeValues
review_status?: ReviewStatusValues
ratings?: RatingValues
market_bias?: MarketBiasValues
image_annotation_status?: ImageAnnotationStatusValues
image_tags?: StringValues
custom_fields?: CustomFieldClauses
}
export interface DashboardComparisonDeleteInput {
comparison_id: string
}
export interface DashboardComparisonUpdateInput {
comparison_id: string
expected_revision: string
fields: {
name?: string
a?: DashboardComparisonFilters
b?: DashboardComparisonFilters
}
}
export interface DashboardLayoutCreateInput {
name: string
layout: DashboardLayoutContent
}
export interface DashboardLayoutContent {

top_section: string[]
breakpoints: CompleteLayoutBreakpointPlacements

grid_columns?: (12 | 24)
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
export interface DashboardLayoutDeleteInput {
name: string
}
export interface DashboardLayoutDuplicateInput {
source_name: string
name: string
}
export interface DashboardLayoutRenameInput {
name: string
new_name: string
}
export interface DashboardLayoutSetActiveInput {
name: string
}
export interface DashboardLayoutUpdateInput {

expected_revision: string
name: string
layout: DashboardLayoutContent
}
export interface EventCreateInput {

values: CreateEventValue[]
}
export interface CreateEventValue {
name: string
color: ("red" | "orange" | "yellow" | "gray")
notes?: string
}

export interface EventDeleteInput {
name: string
}

export interface EventMergeInput {
source_name: string
target_name: string
}

export interface EventRenameInput {
source_name: string
target_name: string
}
export interface EventUpdateStyleInput {
name: string
color: ("red" | "orange" | "yellow" | "gray")

notes?: (string | null)
}
export interface HomeGoalSetInput {
widget_id: string
goal: HomeGoal
}

export interface HomeGoal {
metric: ("net_pnl" | "trade_count" | "win_rate" | "profit_factor" | "expectancy" | "max_drawdown")
direction: ("at_least" | "at_most")
target: number
period: ("day" | "week" | "month" | "sessions" | "all_time")
session_count?: number
r_multiples?: boolean

account_targets?: {
account_id: string
target: number
}[]
}
export interface HomeLayoutCreateInput {
name: string
layout: HomeLayoutContent
}
export interface HomeLayoutContent {
breakpoints: CompleteLayoutBreakpointPlacements

grid_columns?: (12 | 24)
}
export interface HomeLayoutDeleteInput {
name: string
}
export interface HomeLayoutDuplicateInput {
source_name: string
name: string
}
export interface HomeLayoutRenameInput {
name: string
new_name: string
}
export interface HomeLayoutSetActiveInput {
name: string
}
export interface HomeLayoutUpdateInput {

expected_revision: string
name: string
layout: HomeLayoutContent
}
export interface MistakeCreateInput {

values: CreateMistakeValue[]
}
export interface CreateMistakeValue {

value: string
}

export interface MistakeDeleteInput {

value: string
}

export interface MistakeMergeInput {

source_value: string

target_value: string
}

export interface MistakeRenameInput {

source_value: string

target_value: string
}

export interface PropChallengeAddCostInput {
account_id: string
kind: ("purchase" | "reset" | "activation" | "other")
amount: number
date: string
note?: string
}

export interface PropChallengeAddPriorPayoutInput {
account_id: string
amount: number
date: string
note?: string
}
export interface PropChallengeAdvanceInput {
account_id: string
expected_revision: string

at: string
}

export interface PropChallengeConfigureInput {
account_id: string
expected_revision: string
challenge: {
challenge_name: string
firm_name?: (string | null)
purchase_date?: string

phases: ChallengePhase[]
}
}
export interface ChallengePhase {

phase_id?: string
name: string
stage: ("evaluation" | "sim_funded" | "live_funded")
starting_balance: number

started_at?: string

rules: ({
rule_id?: string
kind: "profit_target"
enabled: boolean
amount: number
target_type: ("absolute" | "percentage")

credit_withdrawals?: boolean
} | {
rule_id?: string
kind: "drawdown"
enabled: boolean
mode: ("static" | "eod_trailing" | "intraday_trailing")
amount: number

lock_at_balance?: number
} | {
rule_id?: string
kind: "daily_loss_limit"
enabled: boolean
amount: number

breach_action?: ("fail" | "suspend_until_next_session")
profit_threshold_percent?: number
amount_after_threshold?: number
scale_at_balance?: number
scaled_amount_percent_of_peak_eod_profit?: number

loss_tiers?: {
profit: number
amount: number
}[]
profit_basis?: ("cumulative_trade_profit" | "current_account_profit")
} | {
rule_id?: string
kind: "daily_profit_cap"
enabled: boolean
amount: number
} | {
rule_id?: string
kind: "live_review_daily_profit"
enabled: boolean
amount: number
} | {
rule_id?: string
kind: "minimum_trading_days"
enabled: boolean
days: number
} | {
rule_id?: string
kind: "minimum_profitable_days"
enabled: boolean
days: number
minimum_daily_profit: number
} | {
rule_id?: string
kind: "consistency"
enabled: boolean
max_best_day_percent: number
consistency_cushion_percent?: number
} | {
rule_id?: string
kind: "max_position_size"
enabled: boolean
max_contracts?: number
initial_contracts?: number
profit_per_additional_contract?: number
maximum_contracts?: number

profit_tiers?: {
profit: number
max_contracts: number
}[]
profit_basis?: ("cumulative_trade_profit" | "current_account_profit")

micros_per_contract?: 10
})[]
}
export interface PropChallengeDeleteCostInput {
account_id: string
cost_id: string
}
export interface PropChallengeDeletePriorPayoutInput {
account_id: string
payout_id: string
}

export interface PropChallengeFailInput {
account_id: string
expected_revision: string
}

export interface PropChallengeRemoveDrawdownFloorInput {
account_id: string
expected_revision: string

rule_id?: string
}

export interface PropChallengeReopenInput {
account_id: string
expected_revision: string
}

export interface PropChallengeSetDrawdownFloorInput {
account_id: string
expected_revision: string

rule_id?: string

floor: number
}

export interface ReviewAddImagesInput {
review: ReviewIdentity

widget: string

sources: TradeMediaSource[]
}
export interface ReviewIdentity {
period: ("day" | "week" | "month" | "quarter" | "year")
period_start: string
}
export interface TradeMediaSource {
trade_id: string

media_id: string
}

export interface ReviewAddKeyEventsInput {
review: ReviewIdentity

events: NewKeyEvent[]
}

export interface NewKeyEvent {
event: string
day?: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")
notes?: string

color?: ("gray" | "red" | "orange" | "yellow")
currency?: ("AUD" | "CAD" | "CHF" | "EUR" | "GBP" | "JPY" | "NZD" | "USD")

time?: string
}

export interface ReviewAddSessionLogEntriesInput {
review: ReviewIdentity

entries: NewSessionLogEntry[]
}
export interface NewSessionLogEntry {
time: string
tag_id: string
text: string
}
export interface ReviewCreateInput {
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

key_level_groups?: KeyLevelGroup[]
market_bias?: MarketBias
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
export interface KeyLevelGroup {

name: string

support: KeyLevel[]

resistance: KeyLevel[]
}
export interface MarketBiasEntry {

ticker?: string
bias: ("long" | "neutral" | "short")
}

export interface Grades {
mental?: ((("A" | "B" | "C") | (0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5)) | null)
technical?: ((("A" | "B" | "C") | (0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5)) | null)
}

export interface ReviewDeleteKeyEventInput {
review: ReviewIdentity

key: string
}
export interface ReviewDeleteSessionLogEntryInput {
review: ReviewIdentity
entry_id: string
}

export interface ReviewRemoveImagesInput {
review: ReviewIdentity

widget: string

media_ids: string[]
}

export interface ReviewSetDayTradeFieldsInput {
review: ReviewIdentity
fields: DayTradeFields
}
export interface DayTradeFields {

setup_ids?: string[]
mistakes?: DayTradeFieldList
tags?: DayTradeFieldList1
custom_fields?: CustomFieldChanges
}

export interface ReviewSetImageAnnotationsInput {
review: ReviewIdentity
images: ImageAnnotations
}

export interface ImageAnnotation {
media_id: string
add_tags?: LabelBatch
remove_tags?: LabelBatch1

notes?: (string | null)
}
export interface ReviewUpdateInput {
review: ReviewIdentity
expected_revision: string
content: Content
}

export interface ReviewUpdateKeyEventInput {
review: ReviewIdentity

key: string
fields: {
event?: string

day?: (("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday") | null)
notes?: string

color?: ("gray" | "red" | "orange" | "yellow")
currency?: (("AUD" | "CAD" | "CHF" | "EUR" | "GBP" | "JPY" | "NZD" | "USD") | null)

time?: (string | null)
}
}
export interface ReviewUpdateSessionLogEntryInput {
review: ReviewIdentity
entry_id: string
fields: {
time?: string
tag_id?: string
text?: string

resolved?: boolean
}
}
export interface ReviewTemplateCreateInput {
template: {
name: string
type: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
widgets: WidgetPlacements
}
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
export interface ReviewTemplateDeleteInput {
template_id: string
}
export interface ReviewTemplateDuplicateInput {
source_template_id: string
name: string
}
export interface ReviewTemplateSetDefaultInput {
review_type: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
template_id: (string | null)
}
export interface ReviewTemplateUpdateInput {

expected_revision: string
template_id: string
template: {
name: string
widgets: WidgetPlacements
}
}

export interface SessionStartUnplannedInput {
reason: string
}

export interface SessionStopUnplannedInput {
session_id: string
}

export interface SessionLogTagCreateInput {
label: string

short_label: string
color: ("blue" | "indigo" | "purple" | "green" | "pink" | "amber" | "red" | "orange")
requires_resolution?: boolean
lesson?: boolean
}
export interface SessionLogTagDeleteInput {
tag_id: string
}
export interface SessionLogTagUpdateInput {
tag_id: string
expected_revision: string
fields: {
label?: string

short_label?: string
color?: ("blue" | "indigo" | "purple" | "green" | "pink" | "amber" | "red" | "orange")
requires_resolution?: boolean
lesson?: boolean
}
}
export interface SessionWorkflowCreateInput {
workflow: TradeGateWorkflow
questions: WorkflowQuestions
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
export interface SessionWorkflowDeleteInput {
workflow_id: string
}
export interface SessionWorkflowDeleteQuestionInput {
question_id: string
}
export interface SessionWorkflowUpdateInput {

expected_revision: string
workflow_id: string
workflow: TradeGateWorkflow
questions: WorkflowQuestions
}
export interface SettingsSetAnalyticsCalculationInput {

expected_revision?: string
values: SettingsAnalyticsCalculationValues
}

export interface SettingsAnalyticsCalculationValues {

analytics_date_basis?: ("entry" | "exit")

include_unrealized_pnl?: boolean

include_copy_accounts?: boolean
}
export interface SettingsSetBreakEvenInput {

expected_revision?: string
values: SettingsBreakEvenValues
}

export interface SettingsBreakEvenValues {

mode?: ("fixed" | "percentage_current_balance")

range_min?: number

range_max?: number

threshold_percent?: number
}
export interface SettingsSetDateTimeDisplayInput {

expected_revision?: string
values: SettingsDateTimeDisplayValues
}

export interface SettingsDateTimeDisplayValues {

date_format?: ("DDMMYY" | "MMDDYY" | "YYMMDD")

use_24_hour_time?: boolean

show_seconds?: boolean

week_start_day?: ("sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday")
}
export interface SettingsSetDisplayPreferencesInput {

expected_revision?: string
values: SettingsDisplayPreferencesValues
}

export interface SettingsDisplayPreferencesValues {

currency?: ("USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "NZD" | "CHF" | "DKK" | "CNY" | "HKD" | "INR" | "SGD")

accent_color_source?: ("journalit" | "obsidian")

privacy_mode?: boolean
}
export interface SettingsSetEconomicCalendarInput {

expected_revision?: string
values: SettingsEconomicCalendarValues
}

export interface SettingsEconomicCalendarValues {

auto_import?: boolean

currencies?: ("AUD" | "CAD" | "CHF" | "EUR" | "GBP" | "JPY" | "NZD" | "USD")[]

impacts?: ("none" | "low" | "medium" | "high")[]

include_holidays?: boolean
}
export interface SettingsSetReviewAutomationInput {

expected_revision?: string
values: SettingsReviewAutomationValues
}

export interface SettingsReviewAutomationValues {

global_auto_create?: boolean

auto_create_day_on_navigation?: boolean

auto_create_week_on_navigation?: boolean

auto_create_month_on_navigation?: boolean

auto_create_quarter_on_navigation?: boolean

auto_create_year_on_navigation?: boolean

open_note_links_in_new_tab?: boolean
}
export interface SettingsSetRiskDisplayInput {

expected_revision?: string
values: SettingsRiskDisplayValues
}

export interface SettingsRiskDisplayValues {

default_risk_amount?: number

display_r_multiples?: boolean

hide_dollar_amounts_in_shares?: boolean

hide_dollar_amounts_in_r_mode?: boolean

mae_mfe_input_mode?: ("price" | "dollar")

mae_mfe_display_unit?: ("dollar" | "ticks")
}
export interface SettingsSetSessionScheduleInput {

expected_revision?: string
values: SettingsSessionScheduleValues
}

export interface SettingsSessionScheduleValues {

session_windows?: SettingsSessionWindowInput[]

preparation_lead_time_minutes?: number

show_trade_executions_in_session_log?: boolean
}

export interface SettingsSessionWindowInput {
id?: string
name: string

start_time: string

end_time: string
}
export interface SettingsSetTradeEntryInput {

expected_revision?: string
values: SettingsTradeEntryValues
}

export interface SettingsTradeEntryValues {

auto_open_created_trades?: boolean

use_dollar_value_input?: boolean

take_profit_unit?: ("percent" | "size")

stop_loss_unit?: ("percent" | "size")
favorite_accounts?: SettingsFavoriteAccounts

default_symbol?: string
}
export interface SettingsSetTradingDayInput {

expected_revision?: string
values: SettingsTradingDayValues
}

export interface SettingsTradingDayValues {

trading_day_cutoff_time?: string

skip_weekends?: boolean
}
export interface SetupCreateInput {

name: string
fields?: SetupFields
}

export interface SetupFields {
status?: ("testing" | "active" | "archived")
direction?: (("long" | "short" | "both") | null)
color?: (string | null)
tags?: LabelList
preferred_sessions?: PreferenceList
preferred_timeframes?: PreferenceList
preferred_tickers?: PreferenceList

playbook?: string

rule_groups?: RuleGroup[]

rules?: Rule[]

linked_notes?: ({
trade_id: string
} | {
review: ReviewIdentity
} | {
setup_id: string
} | {
key: string
})[]
}
export interface RuleGroup {
id: string
name: string
}
export interface Rule {
label: string
description?: string
category: ("context" | "entry" | "exit" | "risk" | "management" | "invalidation" | "psychology")
required: boolean
group_id?: string
}
export interface SetupDeleteInput {
setup_id: string
}
export interface SetupRenameInput {
setup_id: string

name: string
}
export interface SetupUpdateInput {
setup_id: string

expected_revision: string
fields: SetupFields1
}

export interface SetupFields1 {
status?: ("testing" | "active" | "archived")
direction?: (("long" | "short" | "both") | null)
color?: (string | null)
tags?: LabelList
preferred_sessions?: PreferenceList
preferred_timeframes?: PreferenceList
preferred_tickers?: PreferenceList

playbook?: string

rule_groups?: RuleGroup[]

rules?: Rule[]

linked_notes?: ({
trade_id: string
} | {
review: ReviewIdentity
} | {
setup_id: string
} | {
key: string
})[]
}
export interface TagClearColorInput {

value: string
}
export interface TagCreateInput {

values: CreateTagValue[]
}
export interface CreateTagValue {

value: string
color?: string
}

export interface TagDeleteInput {

value: string
}

export interface TagMergeInput {

source_value: string

target_value: string
}

export interface TagRenameInput {

source_value: string

target_value: string
}
export interface TagSetColorInput {

value: string
color: string
}

export interface TradeAddImagesInput {
trade_id: string

sources: ({
url: string
} | {
trade_id: string

media_id: string
} | {

upload_id: string
})[]
}

export interface TradeCreateInput {
trade_type: ("regular" | "missed" | "backtest")

instrument: string
asset_type: ("stock" | "futures" | "forex" | "crypto" | "options" | "cfd")
direction: ("long" | "short")
executions?: Executions

entry_time?: string

exit_time?: string
option?: OptionContract

exchange?: string

dollar_per_point?: number

tick_size?: number

tick_value?: number

lot_size?: number

pip_value?: number

pip_size?: number

contract_size?: number

leverage_ratio?: number
setup_id?: string
account_id?: string
stop_loss?: number
stop_losses?: StopLossList
take_profit?: number
take_profits?: TakeProfitList
risk_amount?: number
ideal_exits?: IdealExitList

mae?: number

mfe?: number

mae_price?: number

mfe_price?: number
unrealized_price_snapshot?: UnrealizedPriceSnapshot

direct_pnl?: number

commission?: number

commission_type?: ("fixed" | "percentage")
fees?: number
swap?: number

rebate?: number
dividends?: DividendList

currency?: string

fx_rate?: number

forex_conversion_rate?: number
tags?: LabelBatch2
mistakes?: MistakeIdentityBatch

missed_reason?: string

exit_reason?: string
custom_fields?: CustomFieldAssignments

thesis?: string

rating?: (0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5)

notes?: string
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
export interface OptionContract {
type: ("call" | "put")
strike: number
expiration: string

contract_size?: number
}

export interface PlannedTarget {
price: number

close_percent?: number

size?: number
}

export interface IdealExit {
price: number
time?: string
size?: number
}

export interface UnrealizedPriceSnapshot {
price: number

time?: string
}

export interface Dividend {
time: string
amount: number
}
export interface TradeDeleteInput {
trade_id: string
}

export interface TradeRemoveImagesInput {
trade_id: string

media_ids?: string[]

urls?: string[]
}

export interface TradeSetImageAnnotationsInput {
trade_id: string
images: ImageAnnotations
}

export interface TradeSetTypeInput {
trade_id: string
trade_type: ("regular" | "missed" | "backtest")
account_id?: string
}

export interface TradeUpdateInput {
trade_id: string
set?: FieldChanges1
stop_losses?: StopLossList
take_profits?: TakeProfitList
add_tags?: LabelBatch2
remove_tags?: LabelBatch2
add_mistakes?: MistakeIdentityBatch
remove_mistakes?: MistakeIdentityBatch
executions?: Executions

remove_executions?: true
ideal_exits?: IdealExitList
dividends?: DividendList
custom_fields?: CustomFieldChanges1
}
export interface FieldChanges1 {

instrument?: string

asset_type?: ("stock" | "futures" | "forex" | "crypto" | "options" | "cfd")
option?: OptionContract1

exchange?: (string | null)

dollar_per_point?: (number | null)

tick_size?: (number | null)

tick_value?: (number | null)

lot_size?: (number | null)

pip_value?: (number | null)

pip_size?: (number | null)

contract_size?: (number | null)

leverage_ratio?: (number | null)

entry_time?: string

exit_time?: string
setup_id?: (string | null)
account_id?: (string | null)
stop_loss?: (number | null)
take_profit?: (number | null)
risk_amount?: (number | null)

mae?: (number | null)

mfe?: (number | null)

mae_price?: (number | null)

mfe_price?: (number | null)

unrealized_price_snapshot?: (UnrealizedPriceSnapshot | null)
direction?: ("long" | "short")

direct_pnl?: (number | null)

commission?: (number | null)

commission_type?: ("fixed" | "percentage")
fees?: (number | null)
swap?: (number | null)

rebate?: (number | null)

currency?: (string | null)

fx_rate?: (number | null)

forex_conversion_rate?: (number | null)
missed_reason?: (string | null)

exit_reason?: (string | null)

thesis?: (string | null)

reviewed?: boolean

rating?: ((0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5) | null)

notes?: string
}

export interface OptionContract1 {
type: ("call" | "put")
strike: number
expiration: string

contract_size?: number
}
