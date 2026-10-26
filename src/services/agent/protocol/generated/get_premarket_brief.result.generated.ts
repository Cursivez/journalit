

export type GetPremarketBriefResult = (Success | Error)

export interface Success {
status: "ok"
meta: ResultMeta
trading_day: string
calculation_context: CalculationContext
last_review: (null | LastReview)

goals: Goal[]
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
export interface LastReview {
date: string
mental_grade: ("A" | "B" | "C" | null)
technical_grade: ("A" | "B" | "C" | null)

answers: {
question: string
answer: string
}[]
}
export interface Goal {
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
