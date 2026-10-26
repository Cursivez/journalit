

export type NavigateJournalitResult = (Success | Error)

export type IdValues = string[]

export type StringValues = string[]

export interface Success {
status: "ok"
meta: ResultMeta
target: ({
kind: "home"
} | {
kind: "dashboard"
} | {
kind: "trade_log"
filters?: TradeFilters
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
export interface ResultMeta {
contract_version: "1.0.0"
contract_digest: string
cached: boolean
row_count?: number
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
export interface ReviewIdentity {
period: ("day" | "week" | "month" | "quarter" | "year")
period_start: string
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
