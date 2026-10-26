

export type InspectJournalResult = (Success | Error)

export interface Success {
status: "ok"
meta: ResultMeta
journal: {
coverage?: {
first_trade_at?: string
last_trade_at?: string
trade_count?: number
}
entities?: {

accounts?: Entity[]

setups?: Entity[]

tags?: string[]

mistakes?: string[]
}

metrics?: ("net_pnl" | "win_rate" | "profit_factor" | "expectancy" | "trade_count" | "win_count" | "loss_count" | "average_win" | "average_loss" | "payoff_ratio" | "sharpe_ratio" | "net_r" | "expectancy_r" | "average_win_r" | "average_loss_r" | "max_drawdown" | "best_day" | "largest_win" | "largest_loss")[]
calculation_settings?: {
currency?: string
date_basis?: ("entry" | "exit")
timezone?: string
trading_day_cutoff_time?: string
break_even_threshold_mode?: ("fixed" | "percentage_current_balance")
break_even_range?: {
min: number
max: number
}
break_even_threshold_percent?: number
}
runtime?: {
plugin_version: string

capabilities: string[]
}

scopes?: ("trades:read" | "trades:write" | "analytics:read" | "reviews:read" | "reviews:write" | "integrations:read" | "integrations:run" | "navigation:control" | "configuration:read" | "configuration:write")[]

integrations?: ({
integration: "metatrader"

actions: ("inspect_status")[]
} | {
integration: "trade_import"

actions: ("inspect_status" | "open_import_workflow" | "operation_status")[]
} | {
integration: "tradovate"

actions: ("inspect_status" | "start_sync" | "operation_status")[]
} | {
integration: "economic_calendar"

actions: ("import_economic_calendar")[]
})[]

session_mode?: {

time_zone: string
phase: ("unconfigured" | "waiting" | "preparation" | "live" | "break" | "ended")
can_start_unplanned: boolean

unplanned_session?: {
session_id: string
started_at: string
}
}
connection?: {
state: ("online" | "degraded")
}
}
}
export interface ResultMeta {
contract_version: "1.0.0"
contract_digest: string
cached: boolean
row_count?: number
}
export interface Entity {
id: string
label: string
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
