

export interface InspectJournalRequest {

sections?: ("coverage" | "entities" | "metrics" | "calculation_settings" | "runtime" | "scopes" | "integrations" | "connection" | "session_mode")[]

detail?: ("compact" | "standard" | "detailed")
}
