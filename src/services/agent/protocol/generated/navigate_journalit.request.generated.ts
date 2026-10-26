


export type IdValues = string[]

export type StringValues = string[]

export interface NavigateJournalitRequest {
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
