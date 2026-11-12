


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

export interface QueryTradesRequest {

fields: ("trade_id" | "symbol" | "direction" | "status" | "entry_time" | "exit_time" | "account_id" | "setup_id" | "volume" | "entry_price" | "exit_price" | "pnl" | "commission" | "r_multiple" | "tags" | "mistakes" | "rating" | "market_bias" | "trade_revision")[]
filters?: TradeFilters

sort?: {

field: ("entry_time" | "exit_time" | "symbol" | "pnl" | "r_multiple" | "rating")
direction: ("asc" | "desc")
}[]
page: Page
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
export interface Page {
limit: number
cursor?: string
}
