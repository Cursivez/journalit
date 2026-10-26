

export type AnalyzeBehaviorResult = ((MistakeCostSuccess | TiltSuccess | OvertradingSuccess) | Error)

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
