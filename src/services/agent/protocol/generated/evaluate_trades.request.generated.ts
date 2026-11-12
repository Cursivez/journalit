


export type IdValues = string[]

export type StringValues = string[]

export type DirectionValues = ("long" | "short")[]

export type StatusValues = ("open" | "partially_closed" | "closed" | "win" | "loss" | "breakeven" | "cancelled")[]

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

export interface EvaluateTradesRequest {

metrics: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss" | "commission_and_fees" | "average_trades_per_day")[]
filters?: TradeFilters
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
metric_id?: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss" | "commission_and_fees" | "average_trades_per_day")
}
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
export interface DateRange {
from?: string
to?: string
}

export interface RecentPeriod {
unit: ("sessions" | "trades" | "days")
count: number
}
export interface NumberRange {
min?: number
max?: number
}
export interface Grouping {
dimension: ("account" | "setup" | "ticker" | "direction" | "weekday" | "month" | "tag" | "mistake" | "rating" | "market_bias")
limit?: number
}
