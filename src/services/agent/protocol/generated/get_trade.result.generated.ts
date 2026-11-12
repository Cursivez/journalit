

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
option?: OptionContract

exchange?: string

dollar_per_point?: number

tick_size?: number

tick_value?: number

lot_size?: number

pip_value?: number

pip_size?: number

contract_size?: number

leverage_ratio?: number

exit_reason?: string
}
execution?: {
volume?: number
entry_price?: number
exit_price?: number
commission?: number

commission_type?: ("fixed" | "percentage")
fees?: number
swap?: number
rebate?: number

dividends?: Dividend[]

currency?: string

fx_rate?: number
fx_rate_base_currency?: string

forex_conversion?: {

rate: number
quote_currency: string
base_currency: string
date?: string
source: ("automatic" | "manual")
}

direct_pnl?: number

ideal_exits?: IdealExit[]

mae?: number

mfe?: number
mae_price?: number
mfe_price?: number
unrealized_price_snapshot?: UnrealizedPriceSnapshot

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

rating?: ((0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5) | null)
}
notes?: string

media?: MediaMetadata[]

custom_fields?: {
field_id: string

value: (string | number | string[])
}[]

media_links?: {
url: string
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

export interface OptionContract {
type: ("call" | "put")
strike: number
expiration: string

contract_size?: number
}

export interface Dividend {
time: string
amount: number
}

export interface IdealExit {
price: number
time?: string
size?: number
}

export interface UnrealizedPriceSnapshot {
price: number

time?: string
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
