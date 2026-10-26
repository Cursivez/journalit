


export type IdValues = string[]

export type StringValues = string[]

export interface QueryTradesRequest {

fields: ("trade_id" | "symbol" | "direction" | "status" | "entry_time" | "exit_time" | "account_id" | "setup_id" | "volume" | "entry_price" | "exit_price" | "pnl" | "commission" | "r_multiple" | "tags" | "mistakes" | "trade_revision")[]
filters?: TradeFilters

sort?: {
field: ("entry_time" | "exit_time" | "symbol" | "pnl" | "r_multiple")
direction: ("asc" | "desc")
}[]
page: Page
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
export interface Page {
limit: number
cursor?: string
}
