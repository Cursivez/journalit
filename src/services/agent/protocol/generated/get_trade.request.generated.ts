

export interface GetTradeRequest {
trade_id: string

sections: ("summary" | "execution" | "classification" | "risk" | "journal" | "notes" | "media" | "custom_fields" | "media_links")[]
notes_max_chars?: number
}
