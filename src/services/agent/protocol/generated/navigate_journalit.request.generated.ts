


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

export type StatusValues = ("open" | "partially_closed" | "closed" | "win" | "loss" | "breakeven" | "cancelled")[]

export interface NavigateJournalitRequest {
target: ({
kind: "home"
} | {
kind: "dashboard"
filters?: DashboardFilters

date_preset?: ("today" | "yesterday" | "this_week" | "this_month" | "this_quarter" | "this_year")
recent?: RecentPeriod
} | {
kind: "dashboard_comparison"
comparison_id?: string
a?: DashboardComparisonFilters
b?: DashboardComparisonFilters
date?: DateRange

date_preset?: ("today" | "yesterday" | "this_week" | "this_month" | "this_quarter" | "this_year")
recent?: RecentPeriod
} | {
kind: "trade_log"
filters?: TradeFilters

date_preset?: ("today" | "yesterday" | "this_week" | "this_month" | "this_quarter" | "this_year")
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

export interface DashboardFilters {
date?: DateRange
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
export interface DateRange {
from?: string
to?: string
}

export interface RecentPeriod {
unit: ("sessions" | "trades" | "days")
count: number
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
export interface TradeFilters {
date?: DateRange
recent?: RecentPeriod
account_ids?: IdValues
setup_ids?: IdValues
tickers?: StringValues
tags?: StringValues
mistakes?: StringValues
directions?: DirectionValues
status?: StatusValues
pnl?: NumberRange
trade_types?: TradeTypeValues
review_status?: ReviewStatusValues
ratings?: RatingValues
market_bias?: MarketBiasValues
session_log_tags?: StringValues
image_annotation_status?: ImageAnnotationStatusValues
image_tags?: StringValues
custom_fields?: CustomFieldClauses
}
export interface NumberRange {
min?: number
max?: number
}
export interface ReviewIdentity {
period: ("day" | "week" | "month" | "quarter" | "year")
period_start: string
}
