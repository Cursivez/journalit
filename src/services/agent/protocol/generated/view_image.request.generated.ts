


export type ViewImageRequest = ({

media_id: string

trade_id: string
} | {

media_id: string
review: ReviewIdentity
})


export interface ReviewIdentity {
period: ("day" | "week" | "month" | "quarter" | "year")
period_start: string
}
