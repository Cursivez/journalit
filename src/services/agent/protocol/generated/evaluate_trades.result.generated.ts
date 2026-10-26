

export type EvaluateTradesResult = (Success | Error)

export interface Success {
status: "ok"
meta: ResultMeta

series: {
interval_start?: string

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

comparison?: ComparisonMetric[]
group_key?: ({
kind: ("account" | "setup")
id: string
label: string
} | {
kind: ("ticker" | "tag" | "mistake")
value: string
} | {
kind: "weekday"
value: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")
} | {
kind: "month"
value: string
} | {
kind: "direction"
value: ("long" | "short")
})
}[]
calculation_context: CalculationContext
}
export interface ResultMeta {
contract_version: "1.0.0"
contract_digest: string
cached: boolean
row_count?: number
}
export interface ComparisonMetric {
metric_id: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")

current: ({
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
})

baseline: ({
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
})

absolute_delta: (number | null)

percent_delta: (number | null)
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
