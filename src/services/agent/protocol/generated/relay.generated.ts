

export type AgentRelayMessage = (Hello | Ready | Rejected | Heartbeat | Invoke | Cancel | Result | ToolError | RuntimeStatus)
export type Invoke = ({
type: "tool.invoke"
protocol_version: 1
contract_digest: string
operation_id: string
request_id: string
traceparent?: string
deadline: string
vault_id: string
installation_id: string

scopes: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]
prior_result_hint?: string
max_result_bytes?: number
tool: "analyze_behavior"
arguments: Request
} | {
type: "tool.invoke"
protocol_version: 1
contract_digest: string
operation_id: string
request_id: string
traceparent?: string
deadline: string
vault_id: string
installation_id: string

scopes: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]
prior_result_hint?: string
max_result_bytes?: number
tool: "apply_changes"
arguments: ({

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
action: "prop_challenge.advance"
input: PropChallengeAdvanceInput
} | {
action: "prop_challenge.configure"
input: PropChallengeConfigureInput
} | {
action: "prop_challenge.delete_cost"
input: PropChallengeDeleteCostInput
} | {
action: "prop_challenge.fail"
input: PropChallengeFailInput
} | {
action: "prop_challenge.reopen"
input: PropChallengeReopenInput
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
action: "trade.create"
input: TradeCreateInput
} | {
action: "trade.delete"
input: TradeDeleteInput
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
} | {
type: "tool.invoke"
protocol_version: 1
contract_digest: string
operation_id: string
request_id: string
traceparent?: string
deadline: string
vault_id: string
installation_id: string

scopes: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]
prior_result_hint?: string
max_result_bytes?: number
tool: "evaluate_trades"
arguments: Request1
} | {
type: "tool.invoke"
protocol_version: 1
contract_digest: string
operation_id: string
request_id: string
traceparent?: string
deadline: string
vault_id: string
installation_id: string

scopes: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]
prior_result_hint?: string
max_result_bytes?: number
tool: "get_premarket_brief"
arguments: Request2
} | {
type: "tool.invoke"
protocol_version: 1
contract_digest: string
operation_id: string
request_id: string
traceparent?: string
deadline: string
vault_id: string
installation_id: string

scopes: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]
prior_result_hint?: string
max_result_bytes?: number
tool: "get_review"
arguments: Request3
} | {
type: "tool.invoke"
protocol_version: 1
contract_digest: string
operation_id: string
request_id: string
traceparent?: string
deadline: string
vault_id: string
installation_id: string

scopes: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]
prior_result_hint?: string
max_result_bytes?: number
tool: "get_trade"
arguments: Request4
} | {
type: "tool.invoke"
protocol_version: 1
contract_digest: string
operation_id: string
request_id: string
traceparent?: string
deadline: string
vault_id: string
installation_id: string

scopes: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]
prior_result_hint?: string
max_result_bytes?: number
tool: "inspect_configuration"
arguments: Request5
} | {
type: "tool.invoke"
protocol_version: 1
contract_digest: string
operation_id: string
request_id: string
traceparent?: string
deadline: string
vault_id: string
installation_id: string

scopes: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]
prior_result_hint?: string
max_result_bytes?: number
tool: "inspect_journal"
arguments: Request6
} | {
type: "tool.invoke"
protocol_version: 1
contract_digest: string
operation_id: string
request_id: string
traceparent?: string
deadline: string
vault_id: string
installation_id: string

scopes: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]
prior_result_hint?: string
max_result_bytes?: number
tool: "navigate_journalit"
arguments: Request7
} | {
type: "tool.invoke"
protocol_version: 1
contract_digest: string
operation_id: string
request_id: string
traceparent?: string
deadline: string
vault_id: string
installation_id: string

scopes: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]
prior_result_hint?: string
max_result_bytes?: number
tool: "query_trades"
arguments: Request8
} | {
type: "tool.invoke"
protocol_version: 1
contract_digest: string
operation_id: string
request_id: string
traceparent?: string
deadline: string
vault_id: string
installation_id: string

scopes: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]
prior_result_hint?: string
max_result_bytes?: number
tool: "run_integration"
arguments: ({
action: "inspect_capabilities"
} | {
action: "inspect_status"
integration: ("metatrader" | "tradovate" | "trade_import")
} | {
action: "start_sync"
integration: "tradovate"
connection_id: string
idempotency_key: string
} | {
action: "open_import_workflow"
} | {
action: "operation_status"
operation_id: string
} | {
action: "import_economic_calendar"

week: string
})
} | {
type: "tool.invoke"
protocol_version: 1
contract_digest: string
operation_id: string
request_id: string
traceparent?: string
deadline: string
vault_id: string
installation_id: string

scopes: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]
prior_result_hint?: string
max_result_bytes?: number
tool: "view_image"

arguments: ({

media_id: string

trade_id: string
} | {

media_id: string
review: ReviewIdentity1
})
})

export type IdValues = string[]

export type StringValues = string[]

export type CustomFieldOptions = CustomFieldOption[]

export type CustomFieldOptions1 = CustomFieldOption[]

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

export type LabelList = string[]

export type PreferenceList = string[]

export type StopLossList = PlannedTarget[]

export type TakeProfitList = PlannedTarget[]

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

export type IdValues1 = string[]
export type Result = ({
type: "tool.result"
protocol_version: 1
contract_digest: string
operation_id: string
cached: boolean
result_id?: string
tool: "analyze_behavior"
result: ((MistakeCostSuccess | TiltSuccess | OvertradingSuccess) | Error)
} | {
type: "tool.result"
protocol_version: 1
contract_digest: string
operation_id: string
cached: boolean
result_id?: string
tool: "apply_changes"
result: (Preview | Committed | ApprovalPending | ApprovalDenied | Error)
} | {
type: "tool.result"
protocol_version: 1
contract_digest: string
operation_id: string
cached: boolean
result_id?: string
tool: "evaluate_trades"
result: (Success | Error)
} | {
type: "tool.result"
protocol_version: 1
contract_digest: string
operation_id: string
cached: boolean
result_id?: string
tool: "get_premarket_brief"
result: (Success1 | Error)
} | {
type: "tool.result"
protocol_version: 1
contract_digest: string
operation_id: string
cached: boolean
result_id?: string
tool: "get_review"
result: (Success2 | Error)
} | {
type: "tool.result"
protocol_version: 1
contract_digest: string
operation_id: string
cached: boolean
result_id?: string
tool: "get_trade"
result: (Success3 | Error)
} | {
type: "tool.result"
protocol_version: 1
contract_digest: string
operation_id: string
cached: boolean
result_id?: string
tool: "inspect_configuration"
result: (Success4 | Error)
} | {
type: "tool.result"
protocol_version: 1
contract_digest: string
operation_id: string
cached: boolean
result_id?: string
tool: "inspect_journal"
result: (Success5 | Error)
} | {
type: "tool.result"
protocol_version: 1
contract_digest: string
operation_id: string
cached: boolean
result_id?: string
tool: "navigate_journalit"
result: (Success6 | Error)
} | {
type: "tool.result"
protocol_version: 1
contract_digest: string
operation_id: string
cached: boolean
result_id?: string
tool: "query_trades"
result: (Success7 | Error)
} | {
type: "tool.result"
protocol_version: 1
contract_digest: string
operation_id: string
cached: boolean
result_id?: string
tool: "run_integration"
result: (({
status: "ok"
meta: ResultMeta
variant: "capabilities"

capabilities: ({
integration: "metatrader"

actions: ("inspect_status")[]
} | {
integration: "tradovate"

actions: ("inspect_status" | "start_sync" | "operation_status")[]
} | {
integration: "trade_import"

actions: ("inspect_status" | "open_import_workflow" | "operation_status")[]
} | {
integration: "economic_calendar"

actions: ("import_economic_calendar")[]
})[]
} | {
status: "ok"
meta: ResultMeta
variant: "status"
integration: ("metatrader" | "tradovate" | "trade_import")
state: ("idle" | "running" | "succeeded" | "failed" | "requires_attention")
operation_id?: string

connections?: ConnectionStatus[]

pending_imports?: PendingImport[]
} | {
status: "ok"
meta: ResultMeta
variant: "accepted"
operation_id: string
state: "accepted"
} | {
status: "ok"
meta: ResultMeta
variant: "workflow_opened"
navigation_id: string
} | {
status: "ok"
meta: ResultMeta
variant: "calendar_imported"
week: ReviewIdentity
added: number
updated: number

skipped: number
}) | Error)
} | {
type: "tool.result"
protocol_version: 1
contract_digest: string
operation_id: string
cached: boolean
result_id?: string
tool: "view_image"
result: (Success8 | Error)
})

export type ImageAnnotationChanges = ImageAnnotationChange[]

export type DayTradeFieldList2 = string[]

export type SetupPreferences = string[]

export interface Hello {
type: "relay.hello"
protocol_version: 1
contract_digest: string
ticket: string
installation_id: string

capabilities: string[]
}
export interface Ready {
type: "relay.ready"
protocol_version: 1
contract_digest: string
heartbeat_seconds: number
}
export interface Rejected {
type: "relay.rejected"
protocol_version: 1
contract_digest: string
reason: ("invalid_ticket" | "expired_ticket" | "consumed_ticket" | "revoked_installation" | "unsupported_protocol" | "contract_mismatch")
message: string
}
export interface Heartbeat {
type: "relay.heartbeat"
protocol_version: 1
contract_digest: string
sent_at: string
}
export interface Request {

analysis: ("mistake_cost" | "tilt" | "overtrading")
filters?: TradeFilters
}

export interface TradeFilters {
date?: DateRange
account_ids?: IdValues
setup_ids?: IdValues
tickers?: StringValues
tags?: StringValues
mistakes?: StringValues

directions?: ("long" | "short")[]

status?: ("open" | "partially_closed" | "closed" | "win" | "loss" | "breakeven" | "cancelled")[]
pnl?: NumberRange

trade_types?: ("regular" | "missed" | "backtest")[]

review_status?: ("reviewed" | "unreviewed")[]
session_log_tags?: StringValues

image_annotation_status?: ("tagged" | "untagged" | "has_notes" | "no_notes")[]
image_tags?: StringValues

custom_fields?: {
field_id: string
operator: ("equals" | "not_equals" | "contains" | "greater_than" | "greater_than_or_equal" | "less_than" | "less_than_or_equal")
value: (string | number | boolean | string[])
}[]
}
export interface DateRange {
from?: string
to?: string
}
export interface NumberRange {
min?: number
max?: number
}

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
export interface DashboardLayoutCreateInput {
name: string
layout: DashboardLayoutContent
}
export interface DashboardLayoutContent {

top_section: string[]
breakpoints: CompleteLayoutBreakpointPlacements
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
export interface HomeLayoutCreateInput {
name: string
layout: HomeLayoutContent
}
export interface HomeLayoutContent {
breakpoints: CompleteLayoutBreakpointPlacements
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

export interface PropChallengeFailInput {
account_id: string
expected_revision: string
}

export interface PropChallengeReopenInput {
account_id: string
expected_revision: string
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

export interface TradeCreateInput {
trade_type: ("regular" | "missed" | "backtest")

instrument: string
asset_type: ("stock" | "futures" | "forex" | "crypto" | "options" | "cfd")
direction: ("long" | "short")
executions: Executions
option?: OptionContract
setup_id?: string
account_id?: string
stop_loss?: number
stop_losses?: StopLossList
take_profit?: number
take_profits?: TakeProfitList
risk_amount?: number

direct_pnl?: number

commission?: number
fees?: number
swap?: number
tags?: LabelBatch2
mistakes?: MistakeIdentityBatch

missed_reason?: string
custom_fields?: CustomFieldAssignments

thesis?: string

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
export interface TradeDeleteInput {
trade_id: string
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
custom_fields?: CustomFieldChanges1
}
export interface FieldChanges1 {
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
export interface Request1 {

metrics: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")[]
filters?: TradeFilters1
group_by?: Grouping
comparison?: ({
mode: "custom"
from: string
to: string
} | {
mode: ("previous_period" | "previous_year")
})
interval?: ("day" | "week" | "month" | "quarter" | "year")
minimum_sample_size?: number
sort?: {
by: ("group" | "value" | "sample_count")
direction: ("asc" | "desc")
metric_id?: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")
}
}
export interface TradeFilters1 {
date?: DateRange
account_ids?: IdValues
setup_ids?: IdValues
tickers?: StringValues
tags?: StringValues
mistakes?: StringValues

directions?: ("long" | "short")[]

status?: ("open" | "partially_closed" | "closed" | "win" | "loss" | "breakeven" | "cancelled")[]
pnl?: NumberRange

trade_types?: ("regular" | "missed" | "backtest")[]

review_status?: ("reviewed" | "unreviewed")[]
session_log_tags?: StringValues

image_annotation_status?: ("tagged" | "untagged" | "has_notes" | "no_notes")[]
image_tags?: StringValues

custom_fields?: {
field_id: string
operator: ("equals" | "not_equals" | "contains" | "greater_than" | "greater_than_or_equal" | "less_than" | "less_than_or_equal")
value: (string | number | boolean | string[])
}[]
}
export interface Grouping {
dimension: ("account" | "setup" | "ticker" | "direction" | "weekday" | "month" | "tag" | "mistake")
limit?: number
}
export interface Request2 {

trading_day?: string
account_ids?: IdValues1
}
export interface Request3 {
review: ReviewIdentity

sections: ("summary" | "performance" | "answers" | "goals" | "checklist" | "key_levels" | "grades" | "reviewed" | "session_log" | "images" | "key_events" | "day_trade_fields")[]
}
export interface Request4 {
trade_id: string

sections: ("summary" | "execution" | "classification" | "risk" | "journal" | "notes" | "media" | "custom_fields")[]
notes_max_chars?: number
}
export interface Request5 {

domains: ("session_mode" | "review_templates" | "dashboard_layouts" | "home_layouts" | "option_catalogs" | "settings" | "setups" | "custom_fields" | "session_log_tags" | "accounts" | "prop_challenges")[]

setup_ids?: string[]

playbook_max_chars?: number
}
export interface Request6 {

sections?: ("coverage" | "entities" | "metrics" | "calculation_settings" | "runtime" | "scopes" | "integrations" | "connection" | "session_mode")[]

detail?: ("compact" | "standard" | "detailed")
}
export interface Request7 {
target: ({
kind: "home"
} | {
kind: "dashboard"
} | {
kind: "trade_log"
filters?: TradeFilters1
} | {
kind: "trade"
trade_id: string
} | {
kind: "setup"
setup_id: string
} | {
kind: "account"
account_id: string
} | {
kind: "period_review"
review: ReviewIdentity
} | {
kind: "importer"
} | {
kind: "integration"
integration: ("metatrader" | "tradovate" | "trade_import")
} | {
kind: "session_mode"
} | {
kind: "template_builder"
template_id?: string
} | {
kind: "account_dashboard"
} | {
kind: "setups"
} | {
kind: "economic_calendar"
} | {
kind: "review_for_date"
period: ("day" | "week" | "month" | "quarter" | "year")
date: string
} | {
kind: "agent_activity"
} | {
kind: "calendar_sidebar"
} | {
kind: "navigation_sidebar"
} | {
kind: "position_size_calculator"
} | {
kind: "release_notes"
} | {
kind: "settings"
section: ("custom_options" | "accounts" | "session_mode" | "analytics_calculation" | "date_time_display" | "display_preferences" | "trading_day" | "risk_display" | "break_even" | "trade_entry" | "review_automation" | "economic_calendar" | "session_schedule")
})
}
export interface Request8 {

fields: ("trade_id" | "symbol" | "direction" | "status" | "entry_time" | "exit_time" | "account_id" | "setup_id" | "volume" | "entry_price" | "exit_price" | "pnl" | "commission" | "r_multiple" | "tags" | "mistakes" | "trade_revision")[]
filters?: TradeFilters1

sort?: {
field: ("entry_time" | "exit_time" | "symbol" | "pnl" | "r_multiple")
direction: ("asc" | "desc")
}[]
page: Page
}
export interface Page {
limit: number
cursor?: string
}

export interface ReviewIdentity1 {
period: ("day" | "week" | "month" | "quarter" | "year")
period_start: string
}
export interface Cancel {
type: "tool.cancel"
protocol_version: 1
contract_digest: string
operation_id: string
reason: ("client_cancelled" | "deadline_exceeded" | "grant_revoked" | "server_shutdown")
}
export interface MistakeCostSuccess {
status: "ok"
meta: ResultMeta
analysis: "mistake_cost"
sample: {
trade_count: number
trading_day_count: number
excluded_open_trade_count: number
}
period?: {
first_trading_day: string
last_trading_day: string
}
calculation_context: CalculationContext
mistake_cost: {
clean: Outcome
clean_unreviewed_count: number
with_mistakes: Outcome

mistakes: MistakeRow[]
}
}
export interface ResultMeta {
contract_version: "1.0.0"
contract_digest: string
cached: boolean
row_count?: number
}
export interface CalculationContext {
currency: string
analytics_date_basis: ("entry" | "exit")
timezone?: string
trading_day_cutoff_time?: string
break_even_threshold_mode: ("fixed" | "percentage_current_balance")
break_even_range?: {
min: number
max: number
}
break_even_threshold_percent?: number
minimum_sample_size: number
input: {
kind: "analytics_ready"
prepared_currency: string
prepared_analytics_date_basis: ("entry" | "exit")
contains_unconverted_foreign_currencies: boolean
}
}
export interface Outcome {
trade_count: number
win_count: number
loss_count: number
breakeven_count: number
net_pnl: number
average_pnl: (number | null)
win_rate: (number | null)
}
export interface MistakeRow {
mistake: string
trade_count: number
win_count: number
loss_count: number
breakeven_count: number
net_pnl: number
average_pnl: (number | null)
win_rate: (number | null)
}
export interface TiltSuccess {
status: "ok"
meta: ResultMeta
analysis: "tilt"
sample: {
trade_count: number
trading_day_count: number
excluded_open_trade_count: number
}
period?: {
first_trading_day: string
last_trading_day: string
}
calculation_context: CalculationContext
tilt: {

buckets: TiltRow[]
}
}
export interface TiltRow {
preceding_losses: number
median_size_ratio: (number | null)
median_minutes_since_previous_exit: (number | null)
trade_count: number
win_count: number
loss_count: number
breakeven_count: number
net_pnl: number
average_pnl: (number | null)
win_rate: (number | null)
}
export interface OvertradingSuccess {
status: "ok"
meta: ResultMeta
analysis: "overtrading"
sample: {
trade_count: number
trading_day_count: number
excluded_open_trade_count: number
}
period?: {
first_trading_day: string
last_trading_day: string
}
calculation_context: CalculationContext
overtrading: {

buckets: OvertradingRow[]
}
}
export interface OvertradingRow {
trade_number: number
trade_count: number
win_count: number
loss_count: number
breakeven_count: number
net_pnl: number
average_pnl: (number | null)
win_rate: (number | null)
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
add_tags?: LabelBatch2
remove_tags?: LabelBatch2

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
set?: FieldChanges1
stop_losses?: StopLossList
take_profits?: TakeProfitList
add_tags?: LabelBatch2
remove_tags?: LabelBatch2
add_mistakes?: MistakeIdentityBatch
remove_mistakes?: MistakeIdentityBatch
executions?: Executions
custom_fields?: CustomFieldChanges1
}
export interface Approval {

reasons: ("action_policy" | "bulk")[]
required: boolean
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
export interface Success {
status: "ok"
meta: ResultMeta

series: {
interval_start?: string

metrics: ({
metric_id: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")
sample_count: number
status: "available"
value: number
unit: ("currency" | "fraction" | "ratio" | "count" | "r_multiple")
} | {
metric_id: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")
sample_count: number
status: "unavailable"
value: null
unit: ("currency" | "fraction" | "ratio" | "count" | "r_multiple")
unavailable_reason: ("insufficient_sample" | "not_calculable" | "currency_conversion_required")
})[]

comparison?: ComparisonMetric[]
group_key?: ({
kind: ("account" | "setup")
id: string
label: string
} | {
kind: ("ticker" | "tag" | "mistake")
value: string
} | {
kind: "weekday"
value: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")
} | {
kind: "month"
value: string
} | {
kind: "direction"
value: ("long" | "short")
})
}[]
calculation_context: CalculationContext
}
export interface ComparisonMetric {
metric_id: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")

current: ({
metric_id: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")
sample_count: number
status: "available"
value: number
unit: ("currency" | "fraction" | "ratio" | "count" | "r_multiple")
} | {
metric_id: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")
sample_count: number
status: "unavailable"
value: null
unit: ("currency" | "fraction" | "ratio" | "count" | "r_multiple")
unavailable_reason: ("insufficient_sample" | "not_calculable" | "currency_conversion_required")
})

baseline: ({
metric_id: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")
sample_count: number
status: "available"
value: number
unit: ("currency" | "fraction" | "ratio" | "count" | "r_multiple")
} | {
metric_id: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")
sample_count: number
status: "unavailable"
value: null
unit: ("currency" | "fraction" | "ratio" | "count" | "r_multiple")
unavailable_reason: ("insufficient_sample" | "not_calculable" | "currency_conversion_required")
})

absolute_delta: (number | null)

percent_delta: (number | null)
}
export interface Success1 {
status: "ok"
meta: ResultMeta
trading_day: string
calculation_context: CalculationContext
last_review: (null | LastReview)

goals: Goal1[]
recent_mistakes: {
window_trading_days: number

items: {
mistake: string
trade_count: number
net_pnl: number
}[]
}
tilt_signal: (null | {
window_days: number
after_losses: number
trade_count: number
net_pnl: number
win_rate: (number | null)
baseline_win_rate: (number | null)
})
edge: {
window_days: number
minimum_sample_size: number
best_setup: (null | SetupStat)
worst_setup: (null | SetupStat)
best_entry_hour: (null | HourStat)
worst_entry_hour: (null | HourStat)
}

prop_challenges: {
account_id: string
name: string
phase_name: (string | null)
currency: string
profit_target: (null | Progress)
drawdown: (null | Progress)
}[]
}
export interface LastReview {
date: string
mental_grade: ("A" | "B" | "C" | null)
technical_grade: ("A" | "B" | "C" | null)

answers: {
question: string
answer: string
}[]
}
export interface Goal1 {
text: string
done: (boolean | null)
}
export interface SetupStat {
setup_id: string
name: string
trade_count: number
net_pnl: number
win_rate: (number | null)
}
export interface HourStat {
hour: number
trade_count: number
net_pnl: number
win_rate: (number | null)
}
export interface Progress {
percent: number
remaining: number
}
export interface Success2 {
status: "ok"
meta: ResultMeta
review: ReviewIdentity
revision: string
sections: {
summary?: string
performance?: {
calculation_context: CalculationContext

metrics: ({
metric_id: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")
sample_count: number
status: "available"
value: number
unit: ("currency" | "fraction" | "ratio" | "count" | "r_multiple")
} | {
metric_id: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")
sample_count: number
status: "unavailable"
value: null
unit: ("currency" | "fraction" | "ratio" | "count" | "r_multiple")
unavailable_reason: ("insufficient_sample" | "not_calculable" | "currency_conversion_required")
})[]
}

answers?: {
question_id: string
answer: string
}[]

goals?: Goal[]

checklist?: ChecklistItem[]
key_levels?: KeyLevels1
grades?: {
mental: ((("A" | "B" | "C") | (0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5)) | null)
technical: ((("A" | "B" | "C") | (0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5)) | null)
}
reviewed?: boolean

session_log?: {
entry_id: string
time: string
tag_id: string
text: string
resolved: boolean
promoted: boolean
}[]

images?: {

widget: string

images: MediaMetadata[]
}[]

key_events?: {

key: string
event: string
notes: string
day?: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")

color?: ("gray" | "red" | "orange" | "yellow")
time?: string

all_day?: boolean
currency?: string
impact?: ("none" | "low" | "medium" | "high")
forecast?: number
previous?: number
actual?: number
source?: string

imported: boolean
}[]

day_trade_fields?: {

setup_ids?: string[]

unmatched_setup_count?: number
mistakes?: DayTradeFieldList2
tags?: DayTradeFieldList2

custom_fields?: {
field_id: string

value: (string | number | string[])
}[]
}
}
}
export interface KeyLevels1 {

support: KeyLevel[]

resistance: KeyLevel[]
}
export interface MediaMetadata {
media_id: string
media_type: ("image/png" | "image/jpeg" | "image/webp" | "image/gif")
size_bytes: number
width?: number
height?: number
alt_text?: string

tags?: string[]

notes?: string

path?: string
}
export interface Success3 {
status: "ok"
meta: ResultMeta
trade_id: string
trade_revision: number
sections: {
summary?: {
symbol?: string
trade_type?: ("regular" | "missed" | "backtest")
asset_type?: ("stock" | "futures" | "forex" | "crypto" | "options" | "cfd")
direction?: ("long" | "short")
status?: ("open" | "partially_closed" | "closed" | "cancelled")
entry_time?: string
exit_time?: (string | null)
pnl?: number

missed_reason?: string
}
execution?: {
volume?: number
entry_price?: number
exit_price?: number
commission?: number
fees?: number
swap?: number

direct_pnl?: number

entries?: ExecutionLeg[]

exits?: ExecutionLeg[]

executions_locked?: boolean
}
classification?: {
account_id?: string
setup_id?: string

tags?: string[]

mistakes?: string[]
}
risk?: {
stop_loss?: number
take_profit?: number
risk_amount?: number
r_multiple?: number

stop_losses?: StoredTarget[]

take_profits?: StoredTarget[]
}
journal?: {
thesis: (string | null)

thesis_truncated: boolean
reviewed: boolean
}
notes?: string

media?: MediaMetadata[]

custom_fields?: {
field_id: string

value: (string | number | string[])
}[]
}

notes_truncated?: boolean
}

export interface StoredTarget {
price: number
close_percent?: number
size?: number
}
export interface Success4 {
status: "ok"
meta: ResultMeta
configuration: {
session_mode?: SessionMode
review_templates?: ReviewTemplates
dashboard_layouts?: DashboardLayouts
home_layouts?: HomeLayouts
option_catalogs?: OptionCatalogs
settings?: SettingsProjection
setups?: SetupDefinitions
custom_fields?: CustomFieldsProjection
session_log_tags?: SessionLogTagsProjection
accounts?: AccountsProjection
prop_challenges?: PropChallengesProjection
}
}
export interface SessionMode {
revision: string
workflow_schema_version: 1

trade_gate_questions: TradeGateQuestion[]

trade_gate_workflows: TradeGateWorkflow[]
phase_layouts: PhaseLayouts

invalid_questions: ({
title?: string

issues: ("invalid_identity" | "invalid_content" | "duplicate_identity")[]
question_id: string
can_replace: true
} | {
title?: string

issues: ("invalid_identity" | "invalid_content" | "duplicate_identity")[]
question_id?: string
can_replace: false
})[]

invalid_workflows: ({
name?: string

issues: ("invalid_identity" | "invalid_content" | "invalid_start" | "invalid_node" | "invalid_reference" | "duplicate_identity" | "missing_question" | "unknown_option" | "missing_route" | "dangling_route" | "duplicate_route" | "cycle" | "unreachable_node" | "no_outcome")[]
workflow_id: string
can_replace_or_delete: true
} | {
name?: string

issues: ("invalid_identity" | "invalid_content" | "invalid_start" | "invalid_node" | "invalid_reference" | "duplicate_identity" | "missing_question" | "unknown_option" | "missing_route" | "dangling_route" | "duplicate_route" | "cycle" | "unreachable_node" | "no_outcome")[]
workflow_id?: string
can_replace_or_delete: false
})[]
question_count: number
omitted_question_count: number
workflow_count: number
omitted_workflow_count: number
}
export interface PhaseLayouts {

preparation: ("preparationResources" | "preparationGoals" | "preparationChecklist")[]

live: ("tradeGate" | "timeline")[]

ended: ("endedActions" | "endedStats")[]
}
export interface ReviewTemplates {
revision: string

templates: UserReviewTemplate[]

built_in_templates: BuiltInReviewTemplate[]
defaults: ReviewTemplateDefaults

widget_catalog: WidgetPreset[]

invalid_templates: ({
template_id: string
name?: string
type?: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")

issues: ("invalid_identity" | "invalid_content" | "duplicate_identity" | "reserved_identity" | "invalid_widget" | "duplicate_name")[]
can_replace_or_delete: true
} | {
template_id?: string
name?: string
type?: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")

issues: ("invalid_identity" | "invalid_content" | "duplicate_identity" | "reserved_identity" | "invalid_widget" | "duplicate_name")[]
can_replace_or_delete: false
})[]
template_count: number
omitted_template_count: number
}
export interface BuiltInReviewTemplate {
id: string
name: string
type: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
version: number
widgets: WidgetPlacements
}
export interface ReviewTemplateDefaults {
drc: ReviewTemplateDefault
weekly: ReviewTemplateDefault
monthly: ReviewTemplateDefault
quarterly: ReviewTemplateDefault
yearly: ReviewTemplateDefault
}
export interface ReviewTemplateDefault {
selected_template_id: (string | null)
effective_template_id: string
}
export interface WidgetPreset {
type: string
name: string
description: string
category: ("content" | "charts" | "statistics" | "tables" | "layout")

available_in: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")[]
default_config?: BoundedJSONObject
}
export interface DashboardLayouts {
revision: string
selected_active_layout: (string | null)
effective_active_layout: (string | null)

layouts: DashboardLayoutArtifact[]

invalid_layouts: ({
name: string

issues: ("invalid_name" | "invalid_content" | "invalid_item" | "duplicate_item" | "unknown_widget" | "unknown_metric" | "membership_mismatch" | "invalid_active_layout")[]
can_replace_or_delete: true
} | {
name?: string

issues: ("invalid_name" | "invalid_content" | "invalid_item" | "duplicate_item" | "unknown_widget" | "unknown_metric" | "membership_mismatch" | "invalid_active_layout")[]
can_replace_or_delete: false
})[]
layout_count: number
omitted_layout_count: number
grid: LayoutGridMetadata

metric_catalog: DashboardMetricCatalogEntry[]

widget_catalog: DashboardWidgetCatalogEntry[]
}
export interface DashboardLayoutArtifact {
name: string

top_section: string[]
breakpoints: LayoutBreakpointPlacements
omitted_placement_counts: LayoutOmittedPlacementCounts
omitted_metric_count: number
}
export interface LayoutBreakpointPlacements {

lg: LayoutPlacement[]

md: LayoutPlacement[]

sm: LayoutPlacement[]

xs?: LayoutPlacement[]

xxs?: LayoutPlacement[]
}
export interface LayoutOmittedPlacementCounts {
lg: number
md: number
sm: number
xs?: number
xxs?: number
}
export interface LayoutGridMetadata {
row_height: 50
columns: {
lg: 12
md: 6
sm: 4
xs: 2
xxs: 1
}
}
export interface DashboardMetricCatalogEntry {
id: string
name: string
description: string
}
export interface DashboardWidgetCatalogEntry {
id: string
name: string
description: string
category: ("performance" | "breakdowns" | "risk")
min_size: LayoutSize
default_size: LayoutSize
max_size?: LayoutSize
configurable: boolean
}
export interface LayoutSize {
w: number
h: number
}
export interface HomeLayouts {
revision: string
selected_active_layout: (string | null)
effective_active_layout: (string | null)

layouts: HomeLayoutArtifact[]

invalid_layouts: ({
name: string

issues: ("invalid_name" | "invalid_content" | "invalid_item" | "duplicate_item" | "unknown_widget" | "unknown_metric" | "membership_mismatch" | "invalid_active_layout")[]
can_replace_or_delete: true
} | {
name?: string

issues: ("invalid_name" | "invalid_content" | "invalid_item" | "duplicate_item" | "unknown_widget" | "unknown_metric" | "membership_mismatch" | "invalid_active_layout")[]
can_replace_or_delete: false
})[]
layout_count: number
omitted_layout_count: number
grid: LayoutGridMetadata

widget_catalog: HomeWidgetCatalogEntry[]

configured_widget_instances: ConfiguredWidgetInstance[]
}
export interface HomeLayoutArtifact {
name: string
breakpoints: LayoutBreakpointPlacements
omitted_placement_counts: LayoutOmittedPlacementCounts
}
export interface HomeWidgetCatalogEntry {
id: string
name: string
description: string
category: ("performance" | "accounts" | "workflow")
min_size: LayoutSize
default_size: LayoutSize
max_size?: LayoutSize
configurable: boolean
}
export interface ConfiguredWidgetInstance {
id: string
type: string
}
export interface OptionCatalogs {
tags: {
revision: string

entries: OptionTag[]

malformed_entries: OptionMalformedSummary[]
total_count: number
omitted_count: number
}
mistakes: {
revision: string

entries: OptionMistake[]

malformed_entries: OptionMalformedSummary[]
total_count: number
omitted_count: number
}
account_types: {
revision: string

entries: OptionAccountType[]

malformed_entries: OptionMalformedSummary[]
total_count: number
omitted_count: number
}
events: {
revision: string

entries: OptionEvent[]

malformed_entries: OptionMalformedSummary[]
total_count: number
omitted_count: number
}
instruments: {

entries: OptionInstrument[]

malformed_entries: OptionMalformedSummary[]
total_count: number
omitted_count: number
}
setups: {

entries: OptionSetup[]

malformed_entries: OptionMalformedSummary[]
total_count: number
omitted_count: number
}
accounts: {

entries: OptionAccount[]

malformed_entries: OptionMalformedSummary[]
total_count: number
omitted_count: number
}
}
export interface OptionMalformedSummary {
identity?: string

issues: ("invalid_identity" | "invalid_content" | "duplicate_identity" | "reserved_identity")[]
}
export interface OptionInstrument {
name: string
asset_type: string
currency?: string
has_custom_spec: boolean
}
export interface OptionSetup {
id: string
name: string
status: ("testing" | "active" | "archived")
}
export interface OptionAccount {
name: string
account_type?: string
currency?: string
archived: boolean
}
export interface SetupDefinitions {

definitions: SetupDefinition[]
}
export interface SetupDefinition {
id: string

revision: string
name: string
status: ("testing" | "active" | "archived")
color?: string
tags: LabelList

rule_groups: SetupRuleGroup[]

rules: SetupRule[]
direction?: ("long" | "short" | "both")
preferred_sessions: SetupPreferences
preferred_timeframes: SetupPreferences
preferred_tickers: SetupPreferences

playbook: string
playbook_truncated: boolean

linked_notes: ({
trade_id: string
} | {
review: ReviewIdentity
} | {
setup_id: string
} | {
key: string
})[]
}
export interface SetupRuleGroup {

id: string
name: string
order: number
}
export interface SetupRule {

id: string
label: string
description?: string
category: ("context" | "entry" | "exit" | "risk" | "management" | "invalidation" | "psychology")

group_id?: string
required: boolean
order: number
}
export interface CustomFieldsProjection {

revision: string

fields: CustomFieldDefinition[]

omitted_count: number
}
export interface CustomFieldDefinition {
field_id: string
label: string

key: string
type: ("text" | "number" | "dropdown" | "multiselect" | "date" | "datetime" | "time")
options: CustomFieldOptions

created_options: string[]
validation: CustomFieldValidation
placeholder?: string
helper_text?: string
allow_create_options: boolean
revision: string
}
export interface SessionLogTagsProjection {

tags: SessionLogTag[]

alert_rule_tag_id?: string

omitted_count: number
}
export interface SessionLogTag {
tag_id: string
label: string

short_label: string
color: ("blue" | "indigo" | "purple" | "green" | "pink" | "amber" | "red" | "orange")

requires_resolution: boolean

lesson: boolean
revision: string
}
export interface AccountsProjection {

accounts: AccountDefinition[]
total_count: number

omitted_count: number
}
export interface AccountDefinition {
account_id: string
name: string

has_settings: boolean
account_type?: string
currency?: string
created_date?: string
initial_balance?: number

live_balance_adjustment?: number

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
profit_target?: AccountProfitTarget
monthly_cost?: number

copy_trading?: AccountCopyTradingPeriod[]

manual_transactions?: AccountTransaction[]
archived: boolean

broker_linked: boolean

prop_challenge: boolean

trade_count: number
revision: string
}

export interface AccountCopyTradingPeriod {
base_account_id: string
multiplier: number
start_date: string
end_date?: string
}
export interface AccountTransaction {
transaction_id: string
date: string
type: ("deposit" | "withdrawal")
amount: number
description?: string
}
export interface PropChallengesProjection {

challenges: PropChallenge[]
omitted_count: number
}
export interface PropChallenge {
account_id: string
challenge_name: string
firm_name?: string
status: ("active" | "passed" | "failed")
evaluation_outcome?: ("passed" | "failed")
current_phase_id?: string
purchase_date?: string
profile?: {
firm_id: string
challenge_id: string
}

phases: PropChallengePhase[]

costs: PropChallengeCost[]
progress?: PropChallengeProgress

revision: string
}
export interface PropChallengePhase {
phase_id: string
name: string
stage?: ("evaluation" | "sim_funded" | "live_funded")
status: ("pending" | "active" | "passed" | "failed")
starting_balance: number
started_at?: string
completed_at?: string
failure?: {
rule_id: string
rule_kind: ("drawdown" | "daily_loss_limit" | "max_position_size")
breached_at: string
}

rules: ({
rule_id: string
kind: "profit_target"
enabled: boolean
amount: number
target_type: ("absolute" | "percentage")

credit_withdrawals?: boolean
} | {
rule_id: string
kind: "drawdown"
enabled: boolean
mode: ("static" | "eod_trailing" | "intraday_trailing")
amount: number

lock_at_balance?: number
} | {
rule_id: string
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
rule_id: string
kind: "daily_profit_cap"
enabled: boolean
amount: number
} | {
rule_id: string
kind: "live_review_daily_profit"
enabled: boolean
amount: number
} | {
rule_id: string
kind: "minimum_trading_days"
enabled: boolean
days: number
} | {
rule_id: string
kind: "minimum_profitable_days"
enabled: boolean
days: number
minimum_daily_profit: number
} | {
rule_id: string
kind: "consistency"
enabled: boolean
max_best_day_percent: number
consistency_cushion_percent?: number
} | {
rule_id: string
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
has_payout_policy: boolean
}
export interface PropChallengeCost {
cost_id: string
date: string
amount: number
kind: ("purchase" | "reset" | "activation" | "other")
note?: string
}

export interface PropChallengeProgress {
phase_id: string
status: ("active" | "passed" | "failed" | "warning")
current_balance: number
target_reached: boolean

requirements_outstanding: ("profit_target" | "minimum_trading_days" | "minimum_profitable_days" | "consistency")[]

rules: PropChallengeRuleProgress[]
}
export interface PropChallengeRuleProgress {
rule_id: string
current: number
target: number
remaining: number
satisfied: boolean
breached: boolean
}
export interface Success5 {
status: "ok"
meta: ResultMeta
journal: {
coverage?: {
first_trade_at?: string
last_trade_at?: string
trade_count?: number
}
entities?: {

accounts?: Entity[]

setups?: Entity[]

tags?: string[]

mistakes?: string[]
}

metrics?: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")[]
calculation_settings?: {
currency?: string
date_basis?: ("entry" | "exit")
timezone?: string
trading_day_cutoff_time?: string
break_even_threshold_mode?: ("fixed" | "percentage_current_balance")
break_even_range?: {
min: number
max: number
}
break_even_threshold_percent?: number
}
runtime?: {
plugin_version: string

capabilities: string[]
}

scopes?: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]

integrations?: ({
integration: "metatrader"

actions: ("inspect_status")[]
} | {
integration: "trade_import"

actions: ("inspect_status" | "open_import_workflow" | "operation_status")[]
} | {
integration: "tradovate"

actions: ("inspect_status" | "start_sync" | "operation_status")[]
} | {
integration: "economic_calendar"

actions: ("import_economic_calendar")[]
})[]

session_mode?: {

time_zone: string
phase: ("unconfigured" | "waiting" | "preparation" | "live" | "break" | "ended")
can_start_unplanned: boolean

unplanned_session?: {
session_id: string
started_at: string
}
}
connection?: {
state: ("online" | "degraded")
}
}
}
export interface Entity {
id: string
label: string
}
export interface Success6 {
status: "ok"
meta: ResultMeta
target: ({
kind: "home"
} | {
kind: "dashboard"
} | {
kind: "trade_log"
filters?: TradeFilters1
} | {
kind: "trade"
trade_id: string
} | {
kind: "setup"
setup_id: string
} | {
kind: "account"
account_id: string
} | {
kind: "period_review"
review: ReviewIdentity
} | {
kind: "importer"
} | {
kind: "integration"
integration: ("metatrader" | "tradovate" | "trade_import")
} | {
kind: "session_mode"
} | {
kind: "template_builder"
template_id?: string
} | {
kind: "account_dashboard"
} | {
kind: "setups"
} | {
kind: "economic_calendar"
} | {
kind: "review_for_date"
period: ("day" | "week" | "month" | "quarter" | "year")
date: string
} | {
kind: "agent_activity"
} | {
kind: "calendar_sidebar"
} | {
kind: "navigation_sidebar"
} | {
kind: "position_size_calculator"
} | {
kind: "release_notes"
} | {
kind: "settings"
section: ("custom_options" | "accounts" | "session_mode" | "analytics_calculation" | "date_time_display" | "display_preferences" | "trading_day" | "risk_display" | "break_even" | "trade_entry" | "review_automation" | "economic_calendar" | "session_schedule")
})
navigation_id: string
}
export interface Success7 {
status: "ok"
meta: ResultMeta

fields: ("trade_id" | "symbol" | "direction" | "status" | "entry_time" | "exit_time" | "account_id" | "setup_id" | "volume" | "entry_price" | "exit_price" | "pnl" | "commission" | "r_multiple" | "tags" | "mistakes" | "trade_revision")[]

trades: Trade[]
page: PageInfo
}
export interface Trade {
trade_id: string
symbol?: (string | null)
direction?: (("long" | "short") | null)
status?: ("open" | "partially_closed" | "closed" | "cancelled")
entry_time?: (string | null)
exit_time?: (string | null)
account_id?: (string | null)
setup_id?: (string | null)
volume?: (number | null)
entry_price?: (number | null)
exit_price?: (number | null)
pnl?: (number | null)
commission?: (number | null)
r_multiple?: (number | null)

tags?: string[]

mistakes?: string[]
trade_revision?: number
}
export interface PageInfo {
has_more: boolean
next_cursor?: string
}
export interface ConnectionStatus {
connection_id: string
label?: string
state: ("idle" | "running" | "requires_attention")
operation_id?: string
}
export interface PendingImport {
import_id: string
preview_revision: number
broker: string
trade_count: number
}

export interface Success8 {
status: "ok"
meta: ResultMeta
media_id: string

media_type: ("image/png" | "image/jpeg" | "image/webp")

width: number

height: number

source_width: number

source_height: number

data: string
}
export interface ToolError {
type: "tool.error"
protocol_version: 1
contract_digest: string
operation_id: string
error: Error
}
export interface RuntimeStatus {
type: "runtime.status"
protocol_version: 1
contract_digest: string
state: ("ready" | "busy" | "suspended" | "shutting_down")
active_operations?: number
}
