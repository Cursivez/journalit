

export type QueryTradesResult = (Success | Error)

export interface Success {
status: "ok"
meta: ResultMeta

fields: ("trade_id" | "symbol" | "direction" | "status" | "entry_time" | "exit_time" | "account_id" | "setup_id" | "volume" | "entry_price" | "exit_price" | "pnl" | "commission" | "r_multiple" | "tags" | "mistakes" | "trade_revision")[]

trades: Trade[]
page: PageInfo
}
export interface ResultMeta {
contract_version: "1.0.0"
contract_digest: string
cached: boolean
row_count?: number
}
export interface Trade {
trade_id: string
symbol?: (string | null)
direction?: (("long" | "short") | null)
status?: ("open" | "partially_closed" | "closed" | "cancelled")
entry_time?: (string | null)
exit_time?: (string | null)
account_id?: (string | null)
setup_id?: (string | null)
volume?: (number | null)
entry_price?: (number | null)
exit_price?: (number | null)
pnl?: (number | null)
commission?: (number | null)
r_multiple?: (number | null)

tags?: string[]

mistakes?: string[]
trade_revision?: number
}
export interface PageInfo {
has_more: boolean
next_cursor?: string
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
