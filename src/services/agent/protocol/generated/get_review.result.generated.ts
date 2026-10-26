

export type GetReviewResult = (Success | Error)

export type DayTradeFieldList = string[]

export interface Success {
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
key_levels?: KeyLevels
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
mistakes?: DayTradeFieldList
tags?: DayTradeFieldList

custom_fields?: {
field_id: string

value: (string | number | string[])
}[]
}
}
}
export interface ResultMeta {
contract_version: "1.0.0"
contract_digest: string
cached: boolean
row_count?: number
}
export interface ReviewIdentity {
period: ("day" | "week" | "month" | "quarter" | "year")
period_start: string
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
