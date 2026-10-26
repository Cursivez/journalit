

export type RunIntegrationRequest = ({
action: "inspect_capabilities"
} | {
action: "inspect_status"
integration: ("metatrader" | "tradovate" | "trade_import")
} | {
action: "start_sync"
integration: "tradovate"
connection_id: string
idempotency_key: string
} | {
action: "open_import_workflow"
} | {
action: "operation_status"
operation_id: string
} | {
action: "import_economic_calendar"

week: string
})
