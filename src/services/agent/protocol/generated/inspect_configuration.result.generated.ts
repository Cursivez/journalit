

export type InspectConfigurationResult = (Success | Error)

export type BoundedJSONArray = ((string | number | boolean | null) | BoundedJSONArray | BoundedJSONObject)[]

export type WidgetPlacements = WidgetPlacement[]

export type LabelList = string[]

export type SetupPreferences = string[]

export type CustomFieldOptions = CustomFieldOption[]

export interface Success {
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
export interface ResultMeta {
contract_version: "1.0.0"
contract_digest: string
cached: boolean
row_count?: number
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
export interface LayoutPlacement {
id: string
x: number
y: number
w: number
h: number
static?: boolean
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
export interface OptionTag {

value: string
color?: string
}
export interface OptionMalformedSummary {
identity?: string

issues: ("invalid_identity" | "invalid_content" | "duplicate_identity" | "reserved_identity")[]
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
export interface ReviewIdentity {
period: ("day" | "week" | "month" | "quarter" | "year")
period_start: string
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
