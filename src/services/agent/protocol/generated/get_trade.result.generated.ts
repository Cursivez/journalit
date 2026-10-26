

export type GetTradeResult = (Success | Error)

export interface Success {
status: "ok"
meta: ResultMeta
trade_id: string
trade_revision: number
sections: {
summary?: {
symbol?: string
trade_type?: ("regular" | "missed" | "backtest")
asset_type?: ("stock" | "futures" | "forex" | "crypto" | "options" | "cfd")
direction?: ("long" | "short")
status?: ("open" | "partially_closed" | "closed" | "cancelled")
entry_time?: string
exit_time?: (string | null)
pnl?: number

missed_reason?: string
}
execution?: {
volume?: number
entry_price?: number
exit_price?: number
commission?: number
fees?: number
swap?: number

direct_pnl?: number

entries?: ExecutionLeg[]

exits?: ExecutionLeg[]

executions_locked?: boolean
}
classification?: {
account_id?: string
setup_id?: string

tags?: string[]

mistakes?: string[]
}
risk?: {
stop_loss?: number
take_profit?: number
risk_amount?: number
r_multiple?: number

stop_losses?: StoredTarget[]

take_profits?: StoredTarget[]
}
journal?: {
thesis: (string | null)

thesis_truncated: boolean
reviewed: boolean
}
notes?: string

media?: MediaMetadata[]

custom_fields?: {
field_id: string

value: (string | number | string[])
}[]
}

notes_truncated?: boolean
}
export interface ResultMeta {
contract_version: "1.0.0"
contract_digest: string
cached: boolean
row_count?: number
}
export interface ExecutionLeg {
time: string
price: number
size: number
}

export interface StoredTarget {
price: number
close_percent?: number
size?: number
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
