

export interface GetTradeRequest {
trade_id: string

sections: ("summary" | "execution" | "classification" | "risk" | "journal" | "notes" | "media" | "custom_fields")[]
notes_max_chars?: number
}
