


export type StopLossList = PlannedTarget[]

export type TakeProfitList = PlannedTarget[]

export type LabelBatch = string[]

export type MistakeIdentityBatch = string[]

export type CustomFieldAssignments = {
field_id: string

value: (string | number | string[])
}[]

export type CustomFieldChanges = {
field_id: string
value: ((string | number | string[]) | null)
}[]

export type LabelBatch1 = string[]

export type LabelBatch2 = string[]

export type ImageAnnotations = ImageAnnotation[]

export type ImageAnnotationChanges = ImageAnnotationChange[]

export type DayTradeFieldList = string[]

export type DayTradeFieldList1 = string[]

export type CustomFieldChanges1 = {
field_id: string
value: ((string | number | string[]) | null)
}[]

export type BoundedJSONArray = ((string | number | boolean | null) | BoundedJSONArray | BoundedJSONObject)[]

export type WidgetPlacements = WidgetPlacement[]

export type WorkflowQuestions = TradeGateQuestion[]

export type LabelList = string[]

export type PreferenceList = string[]

export type CustomFieldOptions = CustomFieldOption[]

export type CustomFieldOptions1 = CustomFieldOption[]

export interface AgentActionContracts {
"trade.create": {
input: TradeCreateInput
summary: TradeCreateSummary
result: TradeCreateResult
}
"trade.update": {
input: TradeUpdateInput
summary: TradeUpdateSummary
result: TradeUpdateResult
}
"trade.set_type": {
input: TradeSetTypeInput
summary: TradeSetTypeSummary
result: TradeSetTypeResult
}
"trade.delete": {
input: TradeDeleteInput
summary: TradeDeleteSummary
result: TradeDeleteResult
}
"trade.set_image_annotations": {
input: TradeSetImageAnnotationsInput
summary: TradeSetImageAnnotationsSummary
result: TradeSetImageAnnotationsResult
}
"review.create": {
input: ReviewCreateInput
summary: ReviewCreateSummary
result: ReviewCreateResult
}
"review.update": {
input: ReviewUpdateInput
summary: ReviewUpdateSummary
result: ReviewUpdateResult
}
"review.add_session_log_entries": {
input: ReviewAddSessionLogEntriesInput
summary: ReviewAddSessionLogEntriesSummary
result: ReviewAddSessionLogEntriesResult
}
"review.update_session_log_entry": {
input: ReviewUpdateSessionLogEntryInput
summary: ReviewUpdateSessionLogEntrySummary
result: ReviewUpdateSessionLogEntryResult
}
"review.delete_session_log_entry": {
input: ReviewDeleteSessionLogEntryInput
summary: ReviewDeleteSessionLogEntrySummary
result: ReviewDeleteSessionLogEntryResult
}
"review.add_images": {
input: ReviewAddImagesInput
summary: ReviewAddImagesSummary
result: ReviewAddImagesResult
}
"review.remove_images": {
input: ReviewRemoveImagesInput
summary: ReviewRemoveImagesSummary
result: ReviewRemoveImagesResult
}
"review.set_image_annotations": {
input: ReviewSetImageAnnotationsInput
summary: ReviewSetImageAnnotationsSummary
result: ReviewSetImageAnnotationsResult
}
"review.add_key_events": {
input: ReviewAddKeyEventsInput
summary: ReviewAddKeyEventsSummary
result: ReviewAddKeyEventsResult
}
"review.update_key_event": {
input: ReviewUpdateKeyEventInput
summary: ReviewUpdateKeyEventSummary
result: ReviewUpdateKeyEventResult
}
"review.delete_key_event": {
input: ReviewDeleteKeyEventInput
summary: ReviewDeleteKeyEventSummary
result: ReviewDeleteKeyEventResult
}
"review.set_day_trade_fields": {
input: ReviewSetDayTradeFieldsInput
summary: ReviewSetDayTradeFieldsSummary
result: ReviewSetDayTradeFieldsResult
}
"session.start_unplanned": {
input: SessionStartUnplannedInput
summary: SessionStartUnplannedSummary
result: SessionStartUnplannedResult
}
"session.stop_unplanned": {
input: SessionStopUnplannedInput
summary: SessionStopUnplannedSummary
result: SessionStopUnplannedResult
}
"tag.create": {
input: TagCreateInput
summary: TagCreateResult
result: TagCreateResult
}
"tag.set_color": {
input: TagSetColorInput
summary: TagSetColorResult
result: TagSetColorResult
}
"tag.clear_color": {
input: TagClearColorInput
summary: TagClearColorResult
result: TagClearColorResult
}
"tag.rename": {
input: TagRenameInput
summary: TagRenameResult
result: TagRenameResult
}
"tag.merge": {
input: TagMergeInput
summary: TagMergeResult
result: TagMergeResult
}
"tag.delete": {
input: TagDeleteInput
summary: TagDeleteResult
result: TagDeleteResult
}
"mistake.create": {
input: MistakeCreateInput
summary: MistakeCreateResult
result: MistakeCreateResult
}
"mistake.rename": {
input: MistakeRenameInput
summary: MistakeRenameResult
result: MistakeRenameResult
}
"mistake.merge": {
input: MistakeMergeInput
summary: MistakeMergeResult
result: MistakeMergeResult
}
"mistake.delete": {
input: MistakeDeleteInput
summary: MistakeDeleteResult
result: MistakeDeleteResult
}
"account_type.create": {
input: AccountTypeCreateInput
summary: AccountTypeCreateResult
result: AccountTypeCreateResult
}
"account_type.rename": {
input: AccountTypeRenameInput
summary: AccountTypeRenameResult
result: AccountTypeRenameResult
}
"account_type.move": {
input: AccountTypeMoveInput
summary: AccountTypeMoveResult
result: AccountTypeMoveResult
}
"account_type.delete": {
input: AccountTypeDeleteInput
summary: AccountTypeDeleteResult
result: AccountTypeDeleteResult
}
"event.create": {
input: EventCreateInput
summary: EventCreateResult
result: EventCreateResult
}
"event.update_style": {
input: EventUpdateStyleInput
summary: EventUpdateStyleResult
result: EventUpdateStyleResult
}
"event.rename": {
input: EventRenameInput
summary: EventRenameResult
result: EventRenameResult
}
"event.merge": {
input: EventMergeInput
summary: EventMergeResult
result: EventMergeResult
}
"event.delete": {
input: EventDeleteInput
summary: EventDeleteResult
result: EventDeleteResult
}
"settings.set_analytics_calculation": {
input: SettingsSetAnalyticsCalculationInput
summary: SettingsSetAnalyticsCalculationResult
result: SettingsSetAnalyticsCalculationResult
}
"settings.set_date_time_display": {
input: SettingsSetDateTimeDisplayInput
summary: SettingsSetDateTimeDisplayResult
result: SettingsSetDateTimeDisplayResult
}
"settings.set_display_preferences": {
input: SettingsSetDisplayPreferencesInput
summary: SettingsSetDisplayPreferencesResult
result: SettingsSetDisplayPreferencesResult
}
"settings.set_trading_day": {
input: SettingsSetTradingDayInput
summary: SettingsSetTradingDayResult
result: SettingsSetTradingDayResult
}
"settings.set_risk_display": {
input: SettingsSetRiskDisplayInput
summary: SettingsSetRiskDisplayResult
result: SettingsSetRiskDisplayResult
}
"settings.set_break_even": {
input: SettingsSetBreakEvenInput
summary: SettingsSetBreakEvenResult
result: SettingsSetBreakEvenResult
}
"settings.set_trade_entry": {
input: SettingsSetTradeEntryInput
summary: SettingsSetTradeEntryResult
result: SettingsSetTradeEntryResult
}
"settings.set_review_automation": {
input: SettingsSetReviewAutomationInput
summary: SettingsSetReviewAutomationResult
result: SettingsSetReviewAutomationResult
}
"settings.set_economic_calendar": {
input: SettingsSetEconomicCalendarInput
summary: SettingsSetEconomicCalendarResult
result: SettingsSetEconomicCalendarResult
}
"settings.set_session_schedule": {
input: SettingsSetSessionScheduleInput
summary: SettingsSetSessionScheduleResult
result: SettingsSetSessionScheduleResult
}
"dashboard_layout.create": {
input: DashboardLayoutCreateInput
summary: DashboardLayoutCreateResult
result: DashboardLayoutCreateResult
}
"dashboard_layout.duplicate": {
input: DashboardLayoutDuplicateInput
summary: DashboardLayoutDuplicateResult
result: DashboardLayoutDuplicateResult
}
"dashboard_layout.update": {
input: DashboardLayoutUpdateInput
summary: DashboardLayoutUpdateResult
result: DashboardLayoutUpdateResult
}
"dashboard_layout.rename": {
input: DashboardLayoutRenameInput
summary: DashboardLayoutRenameResult
result: DashboardLayoutRenameResult
}
"dashboard_layout.delete": {
input: DashboardLayoutDeleteInput
summary: DashboardLayoutDeleteResult
result: DashboardLayoutDeleteResult
}
"dashboard_layout.set_active": {
input: DashboardLayoutSetActiveInput
summary: DashboardLayoutSetActiveResult
result: DashboardLayoutSetActiveResult
}
"home_layout.create": {
input: HomeLayoutCreateInput
summary: HomeLayoutCreateResult
result: HomeLayoutCreateResult
}
"home_layout.duplicate": {
input: HomeLayoutDuplicateInput
summary: HomeLayoutDuplicateResult
result: HomeLayoutDuplicateResult
}
"home_layout.update": {
input: HomeLayoutUpdateInput
summary: HomeLayoutUpdateResult
result: HomeLayoutUpdateResult
}
"home_layout.rename": {
input: HomeLayoutRenameInput
summary: HomeLayoutRenameResult
result: HomeLayoutRenameResult
}
"home_layout.delete": {
input: HomeLayoutDeleteInput
summary: HomeLayoutDeleteResult
result: HomeLayoutDeleteResult
}
"home_layout.set_active": {
input: HomeLayoutSetActiveInput
summary: HomeLayoutSetActiveResult
result: HomeLayoutSetActiveResult
}
"review_template.create": {
input: ReviewTemplateCreateInput
summary: ReviewTemplateCreateResult
result: ReviewTemplateCreateResult
}
"review_template.duplicate": {
input: ReviewTemplateDuplicateInput
summary: ReviewTemplateDuplicateResult
result: ReviewTemplateDuplicateResult
}
"review_template.update": {
input: ReviewTemplateUpdateInput
summary: ReviewTemplateUpdateResult
result: ReviewTemplateUpdateResult
}
"review_template.delete": {
input: ReviewTemplateDeleteInput
summary: ReviewTemplateDeleteResult
result: ReviewTemplateDeleteResult
}
"review_template.set_default": {
input: ReviewTemplateSetDefaultInput
summary: ReviewTemplateSetDefaultResult
result: ReviewTemplateSetDefaultResult
}
"session_workflow.create": {
input: SessionWorkflowCreateInput
summary: SessionWorkflowCreateResult
result: SessionWorkflowCreateResult
}
"session_workflow.update": {
input: SessionWorkflowUpdateInput
summary: SessionWorkflowUpdateResult
result: SessionWorkflowUpdateResult
}
"session_workflow.delete": {
input: SessionWorkflowDeleteInput
summary: SessionWorkflowDeleteResult
result: SessionWorkflowDeleteResult
}
"session_workflow.delete_question": {
input: SessionWorkflowDeleteQuestionInput
summary: SessionWorkflowDeleteQuestionResult
result: SessionWorkflowDeleteQuestionResult
}
"setup.create": {
input: SetupCreateInput
summary: SetupCreateSummary
result: SetupRenameResult
}
"setup.update": {
input: SetupUpdateInput
summary: SetupUpdateSummary
result: SetupRenameResult
}
"setup.rename": {
input: SetupRenameInput
summary: SetupRenameSummary
result: SetupRenameResult
}
"setup.delete": {
input: SetupDeleteInput
summary: SetupDeleteResult
result: SetupDeleteResult
}
"custom_field.create": {
input: CustomFieldCreateInput
summary: CustomFieldCreateSummary
result: CustomFieldCreateResult
}
"custom_field.update": {
input: CustomFieldUpdateInput
summary: CustomFieldUpdateSummary
result: CustomFieldUpdateResult
}
"custom_field.delete": {
input: CustomFieldDeleteInput
summary: CustomFieldDeleteSummary
result: CustomFieldDeleteResult
}
"custom_field.reorder": {
input: CustomFieldReorderInput
summary: CustomFieldReorderSummary
result: CustomFieldReorderResult
}
"session_log_tag.create": {
input: SessionLogTagCreateInput
summary: SessionLogTagCreateSummary
result: SessionLogTagCreateResult
}
"session_log_tag.update": {
input: SessionLogTagUpdateInput
summary: SessionLogTagUpdateSummary
result: SessionLogTagUpdateResult
}
"session_log_tag.delete": {
input: SessionLogTagDeleteInput
summary: SessionLogTagDeleteSummary
result: SessionLogTagDeleteResult
}
"account.create": {
input: AccountCreateInput
summary: AccountCreateSummary
result: AccountCreateResult
}
"account.update": {
input: AccountUpdateInput
summary: AccountUpdateSummary
result: AccountUpdateResult
}
"account.rename": {
input: AccountRenameInput
summary: AccountRenameSummary
result: AccountRenameResult
}
"account.delete": {
input: AccountDeleteInput
summary: AccountDeleteSummary
result: AccountDeleteResult
}
"account.add_transaction": {
input: AccountAddTransactionInput
summary: AccountAddTransactionSummary
result: AccountAddTransactionResult
}
"account.delete_transaction": {
input: AccountDeleteTransactionInput
summary: AccountDeleteTransactionSummary
result: AccountDeleteTransactionResult
}
"prop_challenge.advance": {
input: PropChallengeAdvanceInput
summary: PropChallengeAdvanceSummary
result: PropChallengeAdvanceResult
}
"prop_challenge.fail": {
input: PropChallengeFailInput
summary: PropChallengeFailSummary
result: PropChallengeFailResult
}
"prop_challenge.reopen": {
input: PropChallengeReopenInput
summary: PropChallengeReopenSummary
result: PropChallengeReopenResult
}
"prop_challenge.add_cost": {
input: PropChallengeAddCostInput
summary: PropChallengeAddCostSummary
result: PropChallengeAddCostResult
}
"prop_challenge.delete_cost": {
input: PropChallengeDeleteCostInput
summary: PropChallengeDeleteCostSummary
result: PropChallengeDeleteCostResult
}
"prop_challenge.configure": {
input: PropChallengeConfigureInput
summary: PropChallengeConfigureSummary
result: PropChallengeConfigureResult
}
}

export interface TradeCreateInput {
trade_type: ("regular" | "missed" | "backtest")

instrument: string
asset_type: ("stock" | "futures" | "forex" | "crypto" | "options" | "cfd")
direction: ("long" | "short")
executions: Executions
option?: OptionContract
setup_id?: string
account_id?: string
stop_loss?: number
stop_losses?: StopLossList
take_profit?: number
take_profits?: TakeProfitList
risk_amount?: number

direct_pnl?: number

commission?: number
fees?: number
swap?: number
tags?: LabelBatch
mistakes?: MistakeIdentityBatch

missed_reason?: string
custom_fields?: CustomFieldAssignments

thesis?: string

notes?: string
}

export interface Executions {

entries: ExecutionLeg[]

exits: ExecutionLeg[]
}
export interface ExecutionLeg {
time: string
price: number
size: number
}
export interface OptionContract {
type: ("call" | "put")
strike: number
expiration: string

contract_size?: number
}

export interface PlannedTarget {
price: number

close_percent?: number

size?: number
}

export interface TradeCreateSummary {
trade_type: ("regular" | "missed" | "backtest")

instrument: string
asset_type: ("stock" | "futures" | "forex" | "crypto" | "options" | "cfd")
direction: ("long" | "short")
executions: Executions
status: ("open" | "partially_closed" | "closed")
pnl: (number | null)
}
export interface TradeCreateResult {
trade_id: string
trade_revision: number
}

export interface TradeUpdateInput {
trade_id: string
set?: FieldChanges
stop_losses?: StopLossList
take_profits?: TakeProfitList
add_tags?: LabelBatch
remove_tags?: LabelBatch
add_mistakes?: MistakeIdentityBatch
remove_mistakes?: MistakeIdentityBatch
executions?: Executions
custom_fields?: CustomFieldChanges
}
export interface FieldChanges {
setup_id?: (string | null)
account_id?: (string | null)
stop_loss?: (number | null)
take_profit?: (number | null)
risk_amount?: (number | null)
direction?: ("long" | "short")

direct_pnl?: (number | null)

commission?: (number | null)
fees?: (number | null)
swap?: (number | null)
missed_reason?: (string | null)

thesis?: (string | null)

reviewed?: boolean

notes?: string
}

export interface TradeUpdateSummary {
trade_id: string
base_revision: number
effective: boolean
set?: FieldChanges
stop_losses?: StopLossList
take_profits?: TakeProfitList
add_tags?: LabelBatch
remove_tags?: LabelBatch
add_mistakes?: MistakeIdentityBatch
remove_mistakes?: MistakeIdentityBatch
executions?: Executions
custom_fields?: CustomFieldChanges
}
export interface TradeUpdateResult {
trade_id: string
trade_revision: number
}

export interface TradeSetTypeInput {
trade_id: string
trade_type: ("regular" | "missed" | "backtest")
account_id?: string
}
export interface TradeSetTypeSummary {
trade_id: string
base_revision: number
source_type: ("regular" | "missed" | "backtest")
target_type: ("regular" | "missed" | "backtest")
account_id?: string
}
export interface TradeSetTypeResult {
trade_id: string
trade_revision: number
}
export interface TradeDeleteInput {
trade_id: string
}
export interface TradeDeleteSummary {
trade_id: string
trade_type: ("regular" | "missed" | "backtest")
base_revision: number
}
export interface TradeDeleteResult {
trade_id: string
}

export interface TradeSetImageAnnotationsInput {
trade_id: string
images: ImageAnnotations
}

export interface ImageAnnotation {
media_id: string
add_tags?: LabelBatch1
remove_tags?: LabelBatch2

notes?: (string | null)
}

export interface TradeSetImageAnnotationsSummary {
trade_id: string
base_revision: number
effective: boolean
images: ImageAnnotationChanges
}

export interface ImageAnnotationChange {
media_id: string
effective: true
add_tags?: LabelBatch
remove_tags?: LabelBatch

notes?: (string | null)
}
export interface TradeSetImageAnnotationsResult {
trade_id: string
trade_revision: number

media_ids: string[]
}
export interface ReviewCreateInput {
review: ReviewIdentity
content: Content
}
export interface ReviewIdentity {
period: ("day" | "week" | "month" | "quarter" | "year")
period_start: string
}
export interface Content {
summary?: string

answers?: {
question_id: string
answer: string
}[]

goals?: Goal[]

checklist?: ChecklistItem[]
key_levels?: KeyLevels
grades?: Grades

reviewed?: boolean
}
export interface Goal {
text: string
done: boolean
}
export interface ChecklistItem {
text: string
done: boolean
}

export interface KeyLevels {

support: KeyLevel[]

resistance: KeyLevel[]
}
export interface KeyLevel {

price: string
importance: ("High" | "Medium" | "Low" | null)
}

export interface Grades {
mental?: ((("A" | "B" | "C") | (0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5)) | null)
technical?: ((("A" | "B" | "C") | (0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5)) | null)
}
export interface ReviewCreateSummary {
review: ReviewIdentity
content: Content
}
export interface ReviewCreateResult {
review: ReviewIdentity
revision: string
}
export interface ReviewUpdateInput {
review: ReviewIdentity
expected_revision: string
content: Content
}
export interface ReviewUpdateSummary {
review: ReviewIdentity
base_revision: string
content: Content
}
export interface ReviewUpdateResult {
review: ReviewIdentity
revision: string
}

export interface ReviewAddSessionLogEntriesInput {
review: ReviewIdentity

entries: NewSessionLogEntry[]
}
export interface NewSessionLogEntry {
time: string
tag_id: string
text: string
}
export interface ReviewAddSessionLogEntriesSummary {
review: ReviewIdentity
entry_count: number
}
export interface ReviewAddSessionLogEntriesResult {
review: ReviewIdentity

entry_ids: string[]
}
export interface ReviewUpdateSessionLogEntryInput {
review: ReviewIdentity
entry_id: string
fields: {
time?: string
tag_id?: string
text?: string

resolved?: boolean
}
}
export interface ReviewUpdateSessionLogEntrySummary {
review: ReviewIdentity
entry_id: string

changed_fields: ("time" | "tag_id" | "text" | "resolved")[]
}
export interface ReviewUpdateSessionLogEntryResult {
review: ReviewIdentity
entry_id: string
}
export interface ReviewDeleteSessionLogEntryInput {
review: ReviewIdentity
entry_id: string
}
export interface ReviewDeleteSessionLogEntrySummary {
review: ReviewIdentity
entry_id: string
tag_id: string
}
export interface ReviewDeleteSessionLogEntryResult {
review: ReviewIdentity
entry_id: string
}

export interface ReviewAddImagesInput {
review: ReviewIdentity

widget: string

sources: TradeMediaSource[]
}
export interface TradeMediaSource {
trade_id: string

media_id: string
}
export interface ReviewAddImagesSummary {
review: ReviewIdentity

widget: string
image_count: number
}
export interface ReviewAddImagesResult {
review: ReviewIdentity

widget: string

media_ids: string[]
}

export interface ReviewRemoveImagesInput {
review: ReviewIdentity

widget: string

media_ids: string[]
}
export interface ReviewRemoveImagesSummary {
review: ReviewIdentity

widget: string
image_count: number
}
export interface ReviewRemoveImagesResult {
review: ReviewIdentity

widget: string
}

export interface ReviewSetImageAnnotationsInput {
review: ReviewIdentity
images: ImageAnnotations
}

export interface ReviewSetImageAnnotationsSummary {
review: ReviewIdentity
effective: boolean
images: ImageAnnotationChanges
}
export interface ReviewSetImageAnnotationsResult {
review: ReviewIdentity

media_ids: string[]
}

export interface ReviewAddKeyEventsInput {
review: ReviewIdentity

events: NewKeyEvent[]
}

export interface NewKeyEvent {
event: string
day?: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")
notes?: string

color?: ("gray" | "red" | "orange" | "yellow")
currency?: ("AUD" | "CAD" | "CHF" | "EUR" | "GBP" | "JPY" | "NZD" | "USD")

time?: string
}
export interface ReviewAddKeyEventsSummary {
review: ReviewIdentity
event_count: number
}
export interface ReviewAddKeyEventsResult {
review: ReviewIdentity

keys: string[]
}

export interface ReviewUpdateKeyEventInput {
review: ReviewIdentity

key: string
fields: {
event?: string

day?: (("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday") | null)
notes?: string

color?: ("gray" | "red" | "orange" | "yellow")
currency?: (("AUD" | "CAD" | "CHF" | "EUR" | "GBP" | "JPY" | "NZD" | "USD") | null)

time?: (string | null)
}
}
export interface ReviewUpdateKeyEventSummary {
review: ReviewIdentity

key: string

changed_fields: ("event" | "day" | "notes" | "color" | "currency" | "time")[]
}
export interface ReviewUpdateKeyEventResult {
review: ReviewIdentity

key: string
}

export interface ReviewDeleteKeyEventInput {
review: ReviewIdentity

key: string
}
export interface ReviewDeleteKeyEventSummary {
review: ReviewIdentity

key: string
imported: boolean
}
export interface ReviewDeleteKeyEventResult {
review: ReviewIdentity

key: string
}

export interface ReviewSetDayTradeFieldsInput {
review: ReviewIdentity
fields: DayTradeFields
}
export interface DayTradeFields {

setup_ids?: string[]
mistakes?: DayTradeFieldList
tags?: DayTradeFieldList1
custom_fields?: CustomFieldChanges1
}
export interface ReviewSetDayTradeFieldsSummary {
review: ReviewIdentity

changed_fields: ("setup_ids" | "mistakes" | "tags" | "custom_fields")[]

trade_count: number
}
export interface ReviewSetDayTradeFieldsResult {
review: ReviewIdentity
updated_trade_count: number

failed_trade_count: number
}

export interface SessionStartUnplannedInput {
reason: string
}
export interface SessionStartUnplannedSummary {
trading_day: string
}
export interface SessionStartUnplannedResult {
session_id: string
trading_day: string
started_at: string
}

export interface SessionStopUnplannedInput {
session_id: string
}
export interface SessionStopUnplannedSummary {
session_id: string
started_at: string
}
export interface SessionStopUnplannedResult {
session_id: string
stopped_at: string
}
export interface TagCreateInput {

values: CreateTagValue[]
}
export interface CreateTagValue {

value: string
color?: string
}
export interface TagCreateResult {
base_revision: string
resulting_revision: string

created: CreateTagEntry[]
}
export interface CreateTagEntry {
change: CreateTagSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface CreateTagSummary {
action: "create_tag"
catalog: "tags"

value: string
settings_only: true
affected_note_count: 0
message: string
}
export interface OptionTag {

value: string
color?: string
}
export interface OptionMistake {

value: string
}
export interface OptionAccountType {

value: string
reserved?: true
}
export interface OptionEvent {
name: string
color: ("red" | "orange" | "yellow" | "gray")
notes?: string
}
export interface TagSetColorInput {

value: string
color: string
}
export interface TagSetColorResult {
base_revision: string
resulting_revision: string
change: SetTagColorSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface SetTagColorSummary {
action: "set_tag_color"
catalog: "tags"

value: string
settings_only: true
affected_note_count: 0
message: string
}
export interface TagClearColorInput {

value: string
}
export interface TagClearColorResult {
base_revision: string
resulting_revision: string
change: ClearTagColorSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface ClearTagColorSummary {
action: "clear_tag_color"
catalog: "tags"

value: string
settings_only: true
affected_note_count: 0
message: string
}

export interface TagRenameInput {

source_value: string

target_value: string
}
export interface TagRenameResult {
base_revision: string
resulting_revision: string
change: RenameTagSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface RenameTagSummary {
action: "rename_tag"
catalog: "tags"

source_value: string

target_value: string
settings_only: false

affected_trade_count: number

affected_setup_count: number

affected_review_count: number

affected_other_note_count: number

affected_note_count: number
message: string
}

export interface TagMergeInput {

source_value: string

target_value: string
}
export interface TagMergeResult {
base_revision: string
resulting_revision: string
change: MergeTagsSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface MergeTagsSummary {
action: "merge_tags"
catalog: "tags"

source_value: string

target_value: string
settings_only: false

affected_trade_count: number

affected_setup_count: number

affected_review_count: number

affected_other_note_count: number

affected_note_count: number
message: string
}

export interface TagDeleteInput {

value: string
}
export interface TagDeleteResult {
base_revision: string
resulting_revision: string
change: DeleteTagSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface DeleteTagSummary {
action: "delete_tag"
catalog: "tags"

value: string
settings_only: false

affected_trade_count: number

affected_setup_count: number

affected_review_count: number

affected_other_note_count: number

affected_note_count: number
message: string
}
export interface MistakeCreateInput {

values: CreateMistakeValue[]
}
export interface CreateMistakeValue {

value: string
}
export interface MistakeCreateResult {
base_revision: string
resulting_revision: string

created: CreateMistakeEntry[]
}
export interface CreateMistakeEntry {
change: CreateMistakeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface CreateMistakeSummary {
action: "create_mistake"
catalog: "mistakes"

value: string
settings_only: true
affected_note_count: 0
message: string
}

export interface MistakeRenameInput {

source_value: string

target_value: string
}
export interface MistakeRenameResult {
base_revision: string
resulting_revision: string
change: RenameMistakeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface RenameMistakeSummary {
action: "rename_mistake"
catalog: "mistakes"

source_value: string

target_value: string
settings_only: false

affected_trade_count: number

affected_review_count: number

affected_note_count: number
message: string
}

export interface MistakeMergeInput {

source_value: string

target_value: string
}
export interface MistakeMergeResult {
base_revision: string
resulting_revision: string
change: MergeMistakesSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface MergeMistakesSummary {
action: "merge_mistakes"
catalog: "mistakes"

source_value: string

target_value: string
settings_only: false

affected_trade_count: number

affected_review_count: number

affected_note_count: number
message: string
}

export interface MistakeDeleteInput {

value: string
}
export interface MistakeDeleteResult {
base_revision: string
resulting_revision: string
change: DeleteMistakeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface DeleteMistakeSummary {
action: "delete_mistake"
catalog: "mistakes"

value: string
settings_only: false

affected_trade_count: number

affected_review_count: number

affected_note_count: number
message: string
}
export interface AccountTypeCreateInput {

values: CreateAccountTypeValue[]
}
export interface CreateAccountTypeValue {

value: string
}
export interface AccountTypeCreateResult {
base_revision: string
resulting_revision: string

created: CreateAccountTypeEntry[]
}
export interface CreateAccountTypeEntry {
change: CreateAccountTypeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface CreateAccountTypeSummary {
action: "create_account_type"
catalog: "account_types"

value: string
settings_only: true
affected_note_count: 0
message: string
}

export interface AccountTypeRenameInput {

source_value: string

target_value: string
}
export interface AccountTypeRenameResult {
base_revision: string
resulting_revision: string
change: RenameAccountTypeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface RenameAccountTypeSummary {
action: "rename_account_type"
catalog: "account_types"

source_value: string

target_value: string
settings_only: true

affected_account_count: number
affected_note_count: 0
message: string
}

export interface AccountTypeMoveInput {

value: string

before_value?: string
}
export interface AccountTypeMoveResult {
base_revision: string
resulting_revision: string
change: MoveAccountTypeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface MoveAccountTypeSummary {
action: "move_account_type"
catalog: "account_types"

value: string

before_value?: string
settings_only: true
affected_note_count: 0
message: string
}

export interface AccountTypeDeleteInput {

value: string
}
export interface AccountTypeDeleteResult {
base_revision: string
resulting_revision: string
change: DeleteAccountTypeSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface DeleteAccountTypeSummary {
action: "delete_account_type"
catalog: "account_types"

value: string
settings_only: true

affected_account_count: 0
affected_note_count: 0
message: string
}
export interface EventCreateInput {

values: CreateEventValue[]
}
export interface CreateEventValue {
name: string
color: ("red" | "orange" | "yellow" | "gray")
notes?: string
}
export interface EventCreateResult {
base_revision: string
resulting_revision: string

created: CreateEventEntry[]
}
export interface CreateEventEntry {
change: CreateEventSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface CreateEventSummary {
action: "create_event"
catalog: "events"
name: string
settings_only: true
affected_note_count: 0
message: string
}
export interface EventUpdateStyleInput {
name: string
color: ("red" | "orange" | "yellow" | "gray")

notes?: (string | null)
}
export interface EventUpdateStyleResult {
base_revision: string
resulting_revision: string
change: UpdateEventStyleSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}
export interface UpdateEventStyleSummary {
action: "update_event_style"
catalog: "events"
name: string
settings_only: true
affected_note_count: 0
message: string
}

export interface EventRenameInput {
source_name: string
target_name: string
}
export interface EventRenameResult {
base_revision: string
resulting_revision: string
change: RenameEventSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface RenameEventSummary {
action: "rename_event"
catalog: "events"
source_name: string
target_name: string
settings_only: false

affected_review_count: number

affected_note_count: number
message: string
}

export interface EventMergeInput {
source_name: string
target_name: string
}
export interface EventMergeResult {
base_revision: string
resulting_revision: string
change: MergeEventsSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface MergeEventsSummary {
action: "merge_events"
catalog: "events"
source_name: string
target_name: string
settings_only: false

affected_review_count: number

affected_note_count: number
message: string
}

export interface EventDeleteInput {
name: string
}
export interface EventDeleteResult {
base_revision: string
resulting_revision: string
change: DeleteEventSummary
affected_entry: (OptionTag | OptionMistake | OptionAccountType | OptionEvent)
}

export interface DeleteEventSummary {
action: "delete_event"
catalog: "events"
name: string
settings_only: true

preserved_review_count: number
affected_note_count: 0
message: string
}
export interface SettingsSetAnalyticsCalculationInput {

expected_revision?: string
values: SettingsAnalyticsCalculationValues
}

export interface SettingsAnalyticsCalculationValues {

analytics_date_basis?: ("entry" | "exit")

include_unrealized_pnl?: boolean

include_copy_accounts?: boolean
}
export interface SettingsSetAnalyticsCalculationResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetAnalyticsCalculationSummary {
action: "set_analytics_calculation"

changed_fields: ("analytics_date_basis" | "include_unrealized_pnl" | "include_copy_accounts")[]
message: string
}
export interface SettingsSetDateTimeDisplaySummary {
action: "set_date_time_display"

changed_fields: ("date_format" | "use_24_hour_time" | "show_seconds" | "week_start_day")[]
message: string
}
export interface SettingsSetDisplayPreferencesSummary {
action: "set_display_preferences"

changed_fields: ("currency" | "accent_color_source" | "privacy_mode")[]
message: string
}
export interface SettingsSetTradingDaySummary {
action: "set_trading_day"

changed_fields: ("trading_day_cutoff_time" | "skip_weekends")[]
message: string
}
export interface SettingsSetRiskDisplaySummary {
action: "set_risk_display"

changed_fields: ("default_risk_amount" | "display_r_multiples" | "hide_dollar_amounts_in_shares" | "mae_mfe_input_mode" | "mae_mfe_display_unit")[]
message: string
}
export interface SettingsSetBreakEvenSummary {
action: "set_break_even"

changed_fields: ("mode" | "range_min" | "range_max" | "threshold_percent")[]
message: string
}
export interface SettingsSetTradeEntrySummary {
action: "set_trade_entry"

changed_fields: ("auto_open_created_trades" | "use_dollar_value_input" | "take_profit_unit" | "stop_loss_unit")[]
message: string
}
export interface SettingsSetReviewAutomationSummary {
action: "set_review_automation"

changed_fields: ("global_auto_create" | "auto_create_day_on_navigation" | "auto_create_week_on_navigation" | "auto_create_month_on_navigation" | "auto_create_quarter_on_navigation" | "auto_create_year_on_navigation" | "open_note_links_in_new_tab")[]
message: string
}
export interface SettingsSetEconomicCalendarSummary {
action: "set_economic_calendar"

changed_fields: ("auto_import" | "currencies" | "impacts" | "include_holidays")[]
message: string
}
export interface SettingsSetSessionScheduleSummary {
action: "set_session_schedule"

changed_fields: ("session_windows" | "preparation_lead_time_minutes" | "show_trade_executions_in_session_log")[]
message: string
}

export interface SettingsProjection {
revision: string
analytics_calculation: SettingsAnalyticsCalculation
date_time_display: SettingsDateTimeDisplay
display_preferences: SettingsDisplayPreferences
trading_day: SettingsTradingDay
risk_display: SettingsRiskDisplay
break_even: SettingsBreakEven
trade_entry: SettingsTradeEntry
review_automation: SettingsReviewAutomation
economic_calendar: SettingsEconomicCalendar
session_schedule: SettingsSessionSchedule
}

export interface SettingsAnalyticsCalculation {
revision: string
analytics_date_basis: ("entry" | "exit")

include_unrealized_pnl: boolean

include_copy_accounts: boolean
}

export interface SettingsDateTimeDisplay {
revision: string
date_format: ("DDMMYY" | "MMDDYY" | "YYMMDD")

use_24_hour_time: boolean

show_seconds: boolean
week_start_day: ("sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday")
}

export interface SettingsDisplayPreferences {
revision: string
currency: ("USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "NZD" | "CHF" | "DKK" | "CNY" | "HKD" | "INR" | "SGD")
accent_color_source: ("journalit" | "obsidian")

privacy_mode: boolean
}

export interface SettingsTradingDay {
revision: string

trading_day_cutoff_time: string

skip_weekends: boolean
}

export interface SettingsRiskDisplay {
revision: string
default_risk_amount: number

display_r_multiples: boolean

hide_dollar_amounts_in_shares: boolean
mae_mfe_input_mode: ("price" | "dollar")
mae_mfe_display_unit: ("dollar" | "ticks")
}

export interface SettingsBreakEven {
revision: string
mode: ("fixed" | "percentage_current_balance")
range_min: number
range_max: number
threshold_percent: number
}

export interface SettingsTradeEntry {
revision: string

auto_open_created_trades: boolean

use_dollar_value_input: boolean
take_profit_unit: ("percent" | "size")
stop_loss_unit: ("percent" | "size")
}

export interface SettingsReviewAutomation {
revision: string

global_auto_create: boolean

auto_create_day_on_navigation: boolean

auto_create_week_on_navigation: boolean

auto_create_month_on_navigation: boolean

auto_create_quarter_on_navigation: boolean

auto_create_year_on_navigation: boolean

open_note_links_in_new_tab: boolean
}

export interface SettingsEconomicCalendar {
revision: string

auto_import: boolean

currencies: ("AUD" | "CAD" | "CHF" | "EUR" | "GBP" | "JPY" | "NZD" | "USD")[]

impacts: ("none" | "low" | "medium" | "high")[]

include_holidays: boolean
}

export interface SettingsSessionSchedule {
revision: string
session_windows: SettingsSessionWindow[]
preparation_lead_time_minutes: number

show_trade_executions_in_session_log: boolean
}
export interface SettingsSessionWindow {
id: string
name: string

start_time: string

end_time: string
}
export interface SettingsSetDateTimeDisplayInput {

expected_revision?: string
values: SettingsDateTimeDisplayValues
}

export interface SettingsDateTimeDisplayValues {

date_format?: ("DDMMYY" | "MMDDYY" | "YYMMDD")

use_24_hour_time?: boolean

show_seconds?: boolean

week_start_day?: ("sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday")
}
export interface SettingsSetDateTimeDisplayResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetDisplayPreferencesInput {

expected_revision?: string
values: SettingsDisplayPreferencesValues
}

export interface SettingsDisplayPreferencesValues {

currency?: ("USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "NZD" | "CHF" | "DKK" | "CNY" | "HKD" | "INR" | "SGD")

accent_color_source?: ("journalit" | "obsidian")

privacy_mode?: boolean
}
export interface SettingsSetDisplayPreferencesResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetTradingDayInput {

expected_revision?: string
values: SettingsTradingDayValues
}

export interface SettingsTradingDayValues {

trading_day_cutoff_time?: string

skip_weekends?: boolean
}
export interface SettingsSetTradingDayResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetRiskDisplayInput {

expected_revision?: string
values: SettingsRiskDisplayValues
}

export interface SettingsRiskDisplayValues {

default_risk_amount?: number

display_r_multiples?: boolean

hide_dollar_amounts_in_shares?: boolean

mae_mfe_input_mode?: ("price" | "dollar")

mae_mfe_display_unit?: ("dollar" | "ticks")
}
export interface SettingsSetRiskDisplayResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetBreakEvenInput {

expected_revision?: string
values: SettingsBreakEvenValues
}

export interface SettingsBreakEvenValues {

mode?: ("fixed" | "percentage_current_balance")

range_min?: number

range_max?: number

threshold_percent?: number
}
export interface SettingsSetBreakEvenResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetTradeEntryInput {

expected_revision?: string
values: SettingsTradeEntryValues
}

export interface SettingsTradeEntryValues {

auto_open_created_trades?: boolean

use_dollar_value_input?: boolean

take_profit_unit?: ("percent" | "size")

stop_loss_unit?: ("percent" | "size")
}
export interface SettingsSetTradeEntryResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetReviewAutomationInput {

expected_revision?: string
values: SettingsReviewAutomationValues
}

export interface SettingsReviewAutomationValues {

global_auto_create?: boolean

auto_create_day_on_navigation?: boolean

auto_create_week_on_navigation?: boolean

auto_create_month_on_navigation?: boolean

auto_create_quarter_on_navigation?: boolean

auto_create_year_on_navigation?: boolean

open_note_links_in_new_tab?: boolean
}
export interface SettingsSetReviewAutomationResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetEconomicCalendarInput {

expected_revision?: string
values: SettingsEconomicCalendarValues
}

export interface SettingsEconomicCalendarValues {

auto_import?: boolean

currencies?: ("AUD" | "CAD" | "CHF" | "EUR" | "GBP" | "JPY" | "NZD" | "USD")[]

impacts?: ("none" | "low" | "medium" | "high")[]

include_holidays?: boolean
}
export interface SettingsSetEconomicCalendarResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface SettingsSetSessionScheduleInput {

expected_revision?: string
values: SettingsSessionScheduleValues
}

export interface SettingsSessionScheduleValues {

session_windows?: SettingsSessionWindowInput[]

preparation_lead_time_minutes?: number

show_trade_executions_in_session_log?: boolean
}

export interface SettingsSessionWindowInput {
id?: string
name: string

start_time: string

end_time: string
}
export interface SettingsSetSessionScheduleResult {

base_revision: string

resulting_revision: string
change: (SettingsSetAnalyticsCalculationSummary | SettingsSetDateTimeDisplaySummary | SettingsSetDisplayPreferencesSummary | SettingsSetTradingDaySummary | SettingsSetRiskDisplaySummary | SettingsSetBreakEvenSummary | SettingsSetTradeEntrySummary | SettingsSetReviewAutomationSummary | SettingsSetEconomicCalendarSummary | SettingsSetSessionScheduleSummary)
settings: SettingsProjection
}
export interface DashboardLayoutCreateInput {
name: string
layout: DashboardLayoutContent
}
export interface DashboardLayoutContent {

top_section: string[]
breakpoints: CompleteLayoutBreakpointPlacements
}
export interface CompleteLayoutBreakpointPlacements {

lg: LayoutPlacement[]

md: LayoutPlacement[]

sm: LayoutPlacement[]

xs: LayoutPlacement[]

xxs: LayoutPlacement[]
}
export interface LayoutPlacement {
id: string
x: number
y: number
w: number
h: number
static?: boolean
}
export interface DashboardLayoutCreateResult {
base_revision: string
resulting_revision: string
change: DashboardLayoutChangeSummary
layout: DashboardLayoutMutationArtifact
}
export interface DashboardLayoutChangeSummary {
action: ("create" | "duplicate" | "update" | "rename")
layout_name: string
placement_counts: DashboardBreakpointPlacementCounts
message: string
metric_count: number
}
export interface DashboardBreakpointPlacementCounts {
lg: number
md: number
sm: number
xs: number
xxs: number
}
export interface DashboardLayoutMutationArtifact {
name: string

top_section: string[]
breakpoints: CompleteLayoutBreakpointPlacements
omitted_placement_counts: CompleteLayoutOmittedPlacementCounts
omitted_metric_count: number
}
export interface CompleteLayoutOmittedPlacementCounts {
lg: number
md: number
sm: number
xs: number
xxs: number
}
export interface DashboardLayoutDuplicateInput {
source_name: string
name: string
}
export interface DashboardLayoutDuplicateResult {
base_revision: string
resulting_revision: string
change: DashboardLayoutChangeSummary
layout: DashboardLayoutMutationArtifact
}
export interface DashboardLayoutUpdateInput {

expected_revision: string
name: string
layout: DashboardLayoutContent
}
export interface DashboardLayoutUpdateResult {
base_revision: string
resulting_revision: string
change: DashboardLayoutChangeSummary
layout: DashboardLayoutMutationArtifact
}
export interface DashboardLayoutRenameInput {
name: string
new_name: string
}
export interface DashboardLayoutRenameResult {
base_revision: string
resulting_revision: string
change: DashboardLayoutChangeSummary
layout: DashboardLayoutMutationArtifact
}
export interface DashboardLayoutDeleteInput {
name: string
}
export interface DashboardLayoutDeleteResult {
base_revision: string
resulting_revision: string
change: DashboardDeleteChangeSummary
}
export interface DashboardDeleteChangeSummary {
action: "delete"
layout_name: string
message: string
}
export interface DashboardLayoutSetActiveInput {
name: string
}
export interface DashboardLayoutSetActiveResult {
base_revision: string
resulting_revision: string
change: DashboardSetActiveChangeSummary
}
export interface DashboardSetActiveChangeSummary {
action: "set_active"
layout_name: string
message: string
}
export interface HomeLayoutCreateInput {
name: string
layout: HomeLayoutContent
}
export interface HomeLayoutContent {
breakpoints: CompleteLayoutBreakpointPlacements
}
export interface HomeLayoutCreateResult {
base_revision: string
resulting_revision: string
change: HomeLayoutChangeSummary
layout: HomeLayoutMutationArtifact
}
export interface HomeLayoutChangeSummary {
action: ("create" | "duplicate" | "update" | "rename")
layout_name: string
placement_counts: HomeBreakpointPlacementCounts
message: string
}
export interface HomeBreakpointPlacementCounts {
lg: number
md: number
sm: number
xs: number
xxs: number
}
export interface HomeLayoutMutationArtifact {
name: string
breakpoints: CompleteLayoutBreakpointPlacements
omitted_placement_counts: CompleteLayoutOmittedPlacementCounts
}
export interface HomeLayoutDuplicateInput {
source_name: string
name: string
}
export interface HomeLayoutDuplicateResult {
base_revision: string
resulting_revision: string
change: HomeLayoutChangeSummary
layout: HomeLayoutMutationArtifact
}
export interface HomeLayoutUpdateInput {

expected_revision: string
name: string
layout: HomeLayoutContent
}
export interface HomeLayoutUpdateResult {
base_revision: string
resulting_revision: string
change: HomeLayoutChangeSummary
layout: HomeLayoutMutationArtifact
}
export interface HomeLayoutRenameInput {
name: string
new_name: string
}
export interface HomeLayoutRenameResult {
base_revision: string
resulting_revision: string
change: HomeLayoutChangeSummary
layout: HomeLayoutMutationArtifact
}
export interface HomeLayoutDeleteInput {
name: string
}
export interface HomeLayoutDeleteResult {
base_revision: string
resulting_revision: string
change: HomeDeleteChangeSummary
}
export interface HomeDeleteChangeSummary {
action: "delete"
layout_name: string
message: string
}
export interface HomeLayoutSetActiveInput {
name: string
}
export interface HomeLayoutSetActiveResult {
base_revision: string
resulting_revision: string
change: HomeSetActiveChangeSummary
}
export interface HomeSetActiveChangeSummary {
action: "set_active"
layout_name: string
message: string
}
export interface ReviewTemplateCreateInput {
template: {
name: string
type: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
widgets: WidgetPlacements
}
}
export interface WidgetPlacement {
type: string
id?: string
locked?: boolean
config?: BoundedJSONObject
}
export interface BoundedJSONObject {
[k: string]: ((string | number | boolean | null) | BoundedJSONArray | BoundedJSONObject)
}
export interface ReviewTemplateCreateResult {
base_revision: string
resulting_revision: string
change: TemplateUpsertChangeSummary
template: UserReviewTemplate
}
export interface TemplateUpsertChangeSummary {
action: ("create" | "duplicate" | "update")
template_id: string
template_name: string
review_type: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
widget_count: number
message: string
}
export interface UserReviewTemplate {
id: string
name: string
type: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
version: number
created_at: string
updated_at: string
widgets: WidgetPlacements
}
export interface ReviewTemplateDuplicateInput {
source_template_id: string
name: string
}
export interface ReviewTemplateDuplicateResult {
base_revision: string
resulting_revision: string
change: TemplateUpsertChangeSummary
template: UserReviewTemplate
}
export interface ReviewTemplateUpdateInput {

expected_revision: string
template_id: string
template: {
name: string
widgets: WidgetPlacements
}
}
export interface ReviewTemplateUpdateResult {
base_revision: string
resulting_revision: string
change: TemplateUpsertChangeSummary
template: UserReviewTemplate
}
export interface ReviewTemplateDeleteInput {
template_id: string
}
export interface ReviewTemplateDeleteResult {
base_revision: string
resulting_revision: string
change: TemplateDeleteChangeSummary
}
export interface TemplateDeleteChangeSummary {
action: "delete"
template_id: string
template_name?: string
review_type?: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
widget_count?: number
message: string
}
export interface ReviewTemplateSetDefaultInput {
review_type: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
template_id: (string | null)
}
export interface ReviewTemplateSetDefaultResult {
base_revision: string
resulting_revision: string
change: TemplateSetDefaultChangeSummary
}
export interface TemplateSetDefaultChangeSummary {
action: "set_default"
review_type: ("drc" | "weekly" | "monthly" | "quarterly" | "yearly")
template_id: (string | null)
message: string
}
export interface SessionWorkflowCreateInput {
workflow: TradeGateWorkflow
questions: WorkflowQuestions
}
export interface TradeGateWorkflow {
id: string
name: string
start_node_id: string

nodes: TradeGateWorkflowNode[]

routes: TradeGateRoute[]
}
export interface TradeGateWorkflowNode {
id: string
question_id: string
}
export interface TradeGateRoute {
node_id: string
option_id: string
target: (TradeGateNodeRouteTarget | TradeGateOutcomeRouteTarget)
}
export interface TradeGateNodeRouteTarget {
kind: "node"
node_id: string
}
export interface TradeGateOutcomeRouteTarget {
kind: "outcome"
outcome: ("green-light" | "no-trade" | "wait")
note?: string
}
export interface TradeGateQuestion {
id: string
title: string
prompt: string

options: TradeGateQuestionOption[]
}
export interface TradeGateQuestionOption {
id: string
label: string
}
export interface SessionWorkflowCreateResult {
base_revision: string
resulting_revision: string
change: WorkflowUpsertChangeSummary
workflow: TradeGateWorkflow
questions: WorkflowQuestions
}
export interface WorkflowUpsertChangeSummary {
action: ("create" | "update")
workflow_id: string
workflow_name: string
question_count: number
node_count: number
message: string
}
export interface SessionWorkflowUpdateInput {

expected_revision: string
workflow_id: string
workflow: TradeGateWorkflow
questions: WorkflowQuestions
}
export interface SessionWorkflowUpdateResult {
base_revision: string
resulting_revision: string
change: WorkflowUpsertChangeSummary
workflow: TradeGateWorkflow
questions: WorkflowQuestions
}
export interface SessionWorkflowDeleteInput {
workflow_id: string
}
export interface SessionWorkflowDeleteResult {
base_revision: string
resulting_revision: string
change: WorkflowDeleteChangeSummary
}
export interface WorkflowDeleteChangeSummary {
action: "delete"
workflow_id: string
workflow_name?: string
node_count?: number
message: string
}
export interface SessionWorkflowDeleteQuestionInput {
question_id: string
}
export interface SessionWorkflowDeleteQuestionResult {
base_revision: string
resulting_revision: string
change: QuestionDeleteChangeSummary
}
export interface QuestionDeleteChangeSummary {
action: "delete_question"
question_id: string
question_title?: string

workflow_count: number

placement_count: number
message: string
}
export interface SetupCreateInput {

name: string
fields?: SetupFields
}

export interface SetupFields {
status?: ("testing" | "active" | "archived")
direction?: (("long" | "short" | "both") | null)
color?: (string | null)
tags?: LabelList
preferred_sessions?: PreferenceList
preferred_timeframes?: PreferenceList
preferred_tickers?: PreferenceList

playbook?: string

rule_groups?: RuleGroup[]

rules?: Rule[]

linked_notes?: ({
trade_id: string
} | {
review: ReviewIdentity
} | {
setup_id: string
} | {
key: string
})[]
}
export interface RuleGroup {
id: string
name: string
}
export interface Rule {
label: string
description?: string
category: ("context" | "entry" | "exit" | "risk" | "management" | "invalidation" | "psychology")
required: boolean
group_id?: string
}
export interface SetupCreateSummary {

name: string
status: ("testing" | "active" | "archived")
rule_count: number
linked_note_count: number
}
export interface SetupRenameResult {
setup_id: string
revision: string
}
export interface SetupUpdateInput {
setup_id: string

expected_revision: string
fields: SetupFields1
}

export interface SetupFields1 {
status?: ("testing" | "active" | "archived")
direction?: (("long" | "short" | "both") | null)
color?: (string | null)
tags?: LabelList
preferred_sessions?: PreferenceList
preferred_timeframes?: PreferenceList
preferred_tickers?: PreferenceList

playbook?: string

rule_groups?: RuleGroup[]

rules?: Rule[]

linked_notes?: ({
trade_id: string
} | {
review: ReviewIdentity
} | {
setup_id: string
} | {
key: string
})[]
}
export interface SetupUpdateSummary {
setup_id: string
base_revision: string

changed_fields: ("status" | "direction" | "color" | "tags" | "preferred_sessions" | "preferred_timeframes" | "preferred_tickers" | "playbook" | "rules" | "linked_notes")[]
}
export interface SetupRenameInput {
setup_id: string

name: string
}
export interface SetupRenameSummary {
setup_id: string

source_name: string

target_name: string
affected_note_count: number
}
export interface SetupDeleteInput {
setup_id: string
}
export interface SetupDeleteResult {
setup_id: string

name: string
affected_note_count: number
}

export interface CustomFieldCreateInput {
label: string
type: ("text" | "number" | "dropdown" | "multiselect" | "date" | "datetime" | "time")
options?: CustomFieldOptions
validation?: CustomFieldValidation
placeholder?: string
helper_text?: string
allow_create_options?: boolean
}
export interface CustomFieldOption {
value: string
label: string
}

export interface CustomFieldValidation {
required?: boolean
min?: number
max?: number
min_length?: number
max_length?: number

pattern?: string
}
export interface CustomFieldCreateSummary {
label: string
type: ("text" | "number" | "dropdown" | "multiselect" | "date" | "datetime" | "time")
option_count: number
}
export interface CustomFieldCreateResult {
field_id: string
revision: string
}

export interface CustomFieldUpdateInput {
field_id: string
expected_revision: string
fields: FieldChanges1
}
export interface FieldChanges1 {
label?: string
options?: CustomFieldOptions1
validation?: CustomFieldValidation1
placeholder?: (string | null)
helper_text?: (string | null)
allow_create_options?: boolean
}

export interface CustomFieldValidation1 {
required?: boolean
min?: number
max?: number
min_length?: number
max_length?: number

pattern?: string
}
export interface CustomFieldUpdateSummary {
field_id: string
base_revision: string

changed_fields: ("label" | "options" | "validation" | "placeholder" | "helper_text" | "allow_create_options")[]
}
export interface CustomFieldUpdateResult {
field_id: string
revision: string
}
export interface CustomFieldDeleteInput {
field_id: string
}

export interface CustomFieldDeleteSummary {
field_id: string
label: string
trades_with_values: number
}
export interface CustomFieldDeleteResult {
field_id: string
}

export interface CustomFieldReorderInput {
expected_revision: string

field_ids: string[]
}
export interface CustomFieldReorderSummary {
base_revision: string

field_ids: string[]
}
export interface CustomFieldReorderResult {
revision: string
}

export interface SessionLogTagCreateInput {
label: string

short_label: string
color: ("blue" | "indigo" | "purple" | "green" | "pink" | "amber" | "red" | "orange")
requires_resolution?: boolean
lesson?: boolean
}
export interface SessionLogTagCreateSummary {
label: string

short_label: string
color: ("blue" | "indigo" | "purple" | "green" | "pink" | "amber" | "red" | "orange")
}
export interface SessionLogTagCreateResult {
tag_id: string
revision: string
}
export interface SessionLogTagUpdateInput {
tag_id: string
expected_revision: string
fields: {
label?: string

short_label?: string
color?: ("blue" | "indigo" | "purple" | "green" | "pink" | "amber" | "red" | "orange")
requires_resolution?: boolean
lesson?: boolean
}
}
export interface SessionLogTagUpdateSummary {
tag_id: string
base_revision: string

changed_fields: ("label" | "short_label" | "color" | "requires_resolution" | "lesson")[]
}
export interface SessionLogTagUpdateResult {
tag_id: string
revision: string
}
export interface SessionLogTagDeleteInput {
tag_id: string
}

export interface SessionLogTagDeleteSummary {
tag_id: string
label: string
tagged_day_count: number
used_by_alert_rule: boolean
}
export interface SessionLogTagDeleteResult {
tag_id: string
}

export interface AccountCreateInput {

name: string
account_type: string
currency?: ("USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "NZD" | "CHF" | "DKK" | "CNY" | "HKD" | "INR" | "SGD" | "KWD" | "NGN")
created_date: string
initial_balance: number

drawdown?: ({
type: "none"
} | {
type: ("fixed" | "eod_trailing")
amount: number
} | {
type: "manual"
amount: number

snapshots: AccountDrawdownSnapshot[]
})
monthly_cost?: number
profit_target?: AccountProfitTarget
copy_trading?: CopyTrading
live_balance?: number
}
export interface AccountDrawdownSnapshot {
date: string
limit: number
note?: string
}
export interface AccountProfitTarget {
type: ("absolute" | "percentage")
amount: number
target_date?: string
}
export interface CopyTrading {
base_account_id: string
multiplier: number

start_date?: string
}
export interface AccountCreateSummary {

name: string
account_type: string
currency: ("USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "NZD" | "CHF" | "DKK" | "CNY" | "HKD" | "INR" | "SGD" | "KWD" | "NGN")
initial_balance: number
}
export interface AccountCreateResult {
account_id: string
revision: string
}
export interface AccountUpdateInput {
account_id: string
expected_revision: string
fields: {
account_type?: string
currency?: ("USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "NZD" | "CHF" | "DKK" | "CNY" | "HKD" | "INR" | "SGD" | "KWD" | "NGN")
created_date?: string
initial_balance?: number

live_balance?: (number | null)

drawdown?: ({
type: "none"
} | {
type: ("fixed" | "eod_trailing")
amount: number
} | {
type: "manual"
amount: number

snapshots: AccountDrawdownSnapshot[]
})
profit_target?: (AccountProfitTarget | null)
monthly_cost?: number

copy_trading?: (CopyTrading | null)
}
}
export interface AccountUpdateSummary {
account_id: string
base_revision: string

changed_fields: ("account_type" | "currency" | "created_date" | "initial_balance" | "live_balance" | "drawdown" | "profit_target" | "monthly_cost" | "copy_trading")[]
}
export interface AccountUpdateResult {
account_id: string
revision: string
}

export interface AccountRenameInput {
account_id: string
expected_revision: string

name: string
}
export interface AccountRenameSummary {
account_id: string
base_revision: string
previous_name: string

name: string

trade_count: number
}
export interface AccountRenameResult {
account_id: string
revision: string
}

export interface AccountDeleteInput {
account_id: string
expected_revision: string
}
export interface AccountDeleteSummary {
account_id: string
base_revision: string
name: string
}
export interface AccountDeleteResult {
account_id: string
}

export interface AccountAddTransactionInput {
account_id: string
type: ("deposit" | "withdrawal")
amount: number
date: string
description?: string
}
export interface AccountAddTransactionSummary {
account_id: string
type: ("deposit" | "withdrawal")
amount: number
date: string
}
export interface AccountAddTransactionResult {
account_id: string
transaction_id: string
}
export interface AccountDeleteTransactionInput {
account_id: string
transaction_id: string
}
export interface AccountDeleteTransactionSummary {
account_id: string
transaction_id: string
type: ("deposit" | "withdrawal")
amount: number
date: string
}
export interface AccountDeleteTransactionResult {
account_id: string
transaction_id: string
}
export interface PropChallengeAdvanceInput {
account_id: string
expected_revision: string

at: string
}
export interface PropChallengeAdvanceSummary {
account_id: string
base_revision: string
from_phase_id: string

to_phase_id?: string
at: string

account_type?: string
}
export interface PropChallengeAdvanceResult {
account_id: string
revision: string
}

export interface PropChallengeFailInput {
account_id: string
expected_revision: string
}
export interface PropChallengeFailSummary {
account_id: string
base_revision: string
phase_id: string
}
export interface PropChallengeFailResult {
account_id: string
revision: string
}

export interface PropChallengeReopenInput {
account_id: string
expected_revision: string
}
export interface PropChallengeReopenSummary {
account_id: string
base_revision: string
phase_id: string
account_type?: string
}
export interface PropChallengeReopenResult {
account_id: string
revision: string
}

export interface PropChallengeAddCostInput {
account_id: string
kind: ("purchase" | "reset" | "activation" | "other")
amount: number
date: string
note?: string
}
export interface PropChallengeAddCostSummary {
account_id: string
kind: ("purchase" | "reset" | "activation" | "other")
amount: number
date: string
}
export interface PropChallengeAddCostResult {
account_id: string
cost_id: string
}
export interface PropChallengeDeleteCostInput {
account_id: string
cost_id: string
}
export interface PropChallengeDeleteCostSummary {
account_id: string
cost_id: string
kind: ("purchase" | "reset" | "activation" | "other")
amount: number
date: string
}
export interface PropChallengeDeleteCostResult {
account_id: string
cost_id: string
}

export interface PropChallengeConfigureInput {
account_id: string
expected_revision: string
challenge: {
challenge_name: string
firm_name?: (string | null)
purchase_date?: string

phases: ChallengePhase[]
}
}
export interface ChallengePhase {

phase_id?: string
name: string
stage: ("evaluation" | "sim_funded" | "live_funded")
starting_balance: number

started_at?: string

rules: ({
rule_id?: string
kind: "profit_target"
enabled: boolean
amount: number
target_type: ("absolute" | "percentage")

credit_withdrawals?: boolean
} | {
rule_id?: string
kind: "drawdown"
enabled: boolean
mode: ("static" | "eod_trailing" | "intraday_trailing")
amount: number

lock_at_balance?: number
} | {
rule_id?: string
kind: "daily_loss_limit"
enabled: boolean
amount: number

breach_action?: ("fail" | "suspend_until_next_session")
profit_threshold_percent?: number
amount_after_threshold?: number
scale_at_balance?: number
scaled_amount_percent_of_peak_eod_profit?: number

loss_tiers?: {
profit: number
amount: number
}[]
profit_basis?: ("cumulative_trade_profit" | "current_account_profit")
} | {
rule_id?: string
kind: "daily_profit_cap"
enabled: boolean
amount: number
} | {
rule_id?: string
kind: "live_review_daily_profit"
enabled: boolean
amount: number
} | {
rule_id?: string
kind: "minimum_trading_days"
enabled: boolean
days: number
} | {
rule_id?: string
kind: "minimum_profitable_days"
enabled: boolean
days: number
minimum_daily_profit: number
} | {
rule_id?: string
kind: "consistency"
enabled: boolean
max_best_day_percent: number
consistency_cushion_percent?: number
} | {
rule_id?: string
kind: "max_position_size"
enabled: boolean
max_contracts?: number
initial_contracts?: number
profit_per_additional_contract?: number
maximum_contracts?: number

profit_tiers?: {
profit: number
max_contracts: number
}[]
profit_basis?: ("cumulative_trade_profit" | "current_account_profit")

micros_per_contract?: 10
})[]
}
export interface PropChallengeConfigureSummary {
account_id: string
base_revision: string
created: boolean
phase_count: number
rule_count: number

removed_phase_ids?: string[]
account_type?: string
}
export interface PropChallengeConfigureResult {
account_id: string
revision: string
}
