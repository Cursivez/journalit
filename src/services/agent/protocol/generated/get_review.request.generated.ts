

export interface GetReviewRequest {
review: ReviewIdentity

sections: ("summary" | "performance" | "answers" | "goals" | "checklist" | "key_levels" | "grades" | "reviewed" | "session_log" | "images" | "key_events" | "day_trade_fields")[]
}
export interface ReviewIdentity {
period: ("day" | "week" | "month" | "quarter" | "year")
period_start: string
}
