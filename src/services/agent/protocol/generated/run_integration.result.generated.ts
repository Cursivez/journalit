

export type RunIntegrationResult = (({
status: "ok"
meta: ResultMeta
variant: "capabilities"

capabilities: ({
integration: "metatrader"

actions: ("inspect_status")[]
} | {
integration: "tradovate"

actions: ("inspect_status" | "start_sync" | "operation_status")[]
} | {
integration: "trade_import"

actions: ("inspect_status" | "open_import_workflow" | "operation_status")[]
} | {
integration: "economic_calendar"

actions: ("import_economic_calendar")[]
})[]
} | {
status: "ok"
meta: ResultMeta
variant: "status"
integration: ("metatrader" | "tradovate" | "trade_import")
state: ("idle" | "running" | "succeeded" | "failed" | "requires_attention")
operation_id?: string

connections?: ConnectionStatus[]

pending_imports?: PendingImport[]
} | {
status: "ok"
meta: ResultMeta
variant: "accepted"
operation_id: string
state: "accepted"
} | {
status: "ok"
meta: ResultMeta
variant: "workflow_opened"
navigation_id: string
} | {
status: "ok"
meta: ResultMeta
variant: "calendar_imported"
week: ReviewIdentity
added: number
updated: number

skipped: number
}) | Error)

export interface ResultMeta {
contract_version: "1.0.0"
contract_digest: string
cached: boolean
row_count?: number
}
export interface ConnectionStatus {
connection_id: string
label?: string
state: ("idle" | "running" | "requires_attention")
operation_id?: string
}
export interface PendingImport {
import_id: string
preview_revision: number
broker: string
trade_count: number
}
export interface ReviewIdentity {
period: ("day" | "week" | "month" | "quarter" | "year")
period_start: string
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
