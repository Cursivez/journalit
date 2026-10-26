
import type { AnalyzeBehaviorRequest } from './analyze_behavior.request.generated';
import type { AnalyzeBehaviorResult } from './analyze_behavior.result.generated';
import type { ApplyChangesRequest } from './apply_changes.request.generated';
import type { ApplyChangesResult } from './apply_changes.result.generated';
import type { EvaluateTradesRequest } from './evaluate_trades.request.generated';
import type { EvaluateTradesResult } from './evaluate_trades.result.generated';
import type { GetPremarketBriefRequest } from './get_premarket_brief.request.generated';
import type { GetPremarketBriefResult } from './get_premarket_brief.result.generated';
import type { GetReviewRequest } from './get_review.request.generated';
import type { GetReviewResult } from './get_review.result.generated';
import type { GetTradeRequest } from './get_trade.request.generated';
import type { GetTradeResult } from './get_trade.result.generated';
import type { InspectConfigurationRequest } from './inspect_configuration.request.generated';
import type { InspectConfigurationResult } from './inspect_configuration.result.generated';
import type { InspectJournalRequest } from './inspect_journal.request.generated';
import type { InspectJournalResult } from './inspect_journal.result.generated';
import type { NavigateJournalitRequest } from './navigate_journalit.request.generated';
import type { NavigateJournalitResult } from './navigate_journalit.result.generated';
import type { QueryTradesRequest } from './query_trades.request.generated';
import type { QueryTradesResult } from './query_trades.result.generated';
import type { RunIntegrationRequest } from './run_integration.request.generated';
import type { RunIntegrationResult } from './run_integration.result.generated';
import type { ViewImageRequest } from './view_image.request.generated';
import type { ViewImageResult } from './view_image.result.generated';

export const agentContractManifest = {
  "version": "1.0.0",
  "protocol_major": 1,
  "digest": "sha256:2eeb8fdd27aa163cae31004ad4a782fd6d54cefb9292bd1f2dba0e066df0b9dc",
  "schemas": [
    "actions_accounts",
    "actions_custom_fields",
    "actions_layouts",
    "actions_options",
    "actions_prop_challenges",
    "actions_review_templates",
    "actions_reviews",
    "actions_session_log_tags",
    "actions_session_workflows",
    "actions_settings",
    "actions_setups",
    "actions_trades",
    "analytics",
    "analyze_behavior",
    "apply_changes",
    "common",
    "configuration",
    "describe_actions",
    "evaluate_trades",
    "filters",
    "get_premarket_brief",
    "get_review",
    "get_trade",
    "inspect_configuration",
    "inspect_journal",
    "navigate_journalit",
    "query_trades",
    "relay",
    "run_integration",
    "view_image"
  ],
  "tools": [
    "analyze_behavior",
    "apply_changes",
    "evaluate_trades",
    "get_premarket_brief",
    "get_review",
    "get_trade",
    "inspect_configuration",
    "inspect_journal",
    "navigate_journalit",
    "query_trades",
    "run_integration",
    "view_image"
  ],
  "backend_tools": [
    "describe_actions"
  ],
  "actions": [
    "account.add_transaction",
    "account.create",
    "account.delete",
    "account.delete_transaction",
    "account.rename",
    "account.update",
    "account_type.create",
    "account_type.delete",
    "account_type.move",
    "account_type.rename",
    "custom_field.create",
    "custom_field.delete",
    "custom_field.reorder",
    "custom_field.update",
    "dashboard_layout.create",
    "dashboard_layout.delete",
    "dashboard_layout.duplicate",
    "dashboard_layout.rename",
    "dashboard_layout.set_active",
    "dashboard_layout.update",
    "event.create",
    "event.delete",
    "event.merge",
    "event.rename",
    "event.update_style",
    "home_layout.create",
    "home_layout.delete",
    "home_layout.duplicate",
    "home_layout.rename",
    "home_layout.set_active",
    "home_layout.update",
    "mistake.create",
    "mistake.delete",
    "mistake.merge",
    "mistake.rename",
    "prop_challenge.add_cost",
    "prop_challenge.advance",
    "prop_challenge.configure",
    "prop_challenge.delete_cost",
    "prop_challenge.fail",
    "prop_challenge.reopen",
    "review.add_images",
    "review.add_key_events",
    "review.add_session_log_entries",
    "review.create",
    "review.delete_key_event",
    "review.delete_session_log_entry",
    "review.remove_images",
    "review.set_day_trade_fields",
    "review.set_image_annotations",
    "review.update",
    "review.update_key_event",
    "review.update_session_log_entry",
    "review_template.create",
    "review_template.delete",
    "review_template.duplicate",
    "review_template.set_default",
    "review_template.update",
    "session.start_unplanned",
    "session.stop_unplanned",
    "session_log_tag.create",
    "session_log_tag.delete",
    "session_log_tag.update",
    "session_workflow.create",
    "session_workflow.delete",
    "session_workflow.delete_question",
    "session_workflow.update",
    "settings.set_analytics_calculation",
    "settings.set_break_even",
    "settings.set_date_time_display",
    "settings.set_display_preferences",
    "settings.set_economic_calendar",
    "settings.set_review_automation",
    "settings.set_risk_display",
    "settings.set_session_schedule",
    "settings.set_trade_entry",
    "settings.set_trading_day",
    "setup.create",
    "setup.delete",
    "setup.rename",
    "setup.update",
    "tag.clear_color",
    "tag.create",
    "tag.delete",
    "tag.merge",
    "tag.rename",
    "tag.set_color",
    "trade.create",
    "trade.delete",
    "trade.set_image_annotations",
    "trade.set_type",
    "trade.update"
  ]
} as const;

export type AgentToolName = (typeof agentContractManifest.tools)[number];

export interface AgentToolContracts {
  analyze_behavior: { request: AnalyzeBehaviorRequest; result: AnalyzeBehaviorResult };
  apply_changes: { request: ApplyChangesRequest; result: ApplyChangesResult };
  evaluate_trades: { request: EvaluateTradesRequest; result: EvaluateTradesResult };
  get_premarket_brief: { request: GetPremarketBriefRequest; result: GetPremarketBriefResult };
  get_review: { request: GetReviewRequest; result: GetReviewResult };
  get_trade: { request: GetTradeRequest; result: GetTradeResult };
  inspect_configuration: { request: InspectConfigurationRequest; result: InspectConfigurationResult };
  inspect_journal: { request: InspectJournalRequest; result: InspectJournalResult };
  navigate_journalit: { request: NavigateJournalitRequest; result: NavigateJournalitResult };
  query_trades: { request: QueryTradesRequest; result: QueryTradesResult };
  run_integration: { request: RunIntegrationRequest; result: RunIntegrationResult };
  view_image: { request: ViewImageRequest; result: ViewImageResult };
}

export const agentActionCatalog = [
  {
    "id": "trade.create",
    "domain": "trades",
    "scope": "trades:write",
    "approval": "standard",
    "title": "Create trade"
  },
  {
    "id": "trade.update",
    "domain": "trades",
    "scope": "trades:write",
    "approval": "standard",
    "title": "Update trade"
  },
  {
    "id": "trade.set_type",
    "domain": "trades",
    "scope": "trades:write",
    "approval": "standard",
    "title": "Change trade type"
  },
  {
    "id": "trade.delete",
    "domain": "trades",
    "scope": "trades:write",
    "approval": "always",
    "title": "Delete trade"
  },
  {
    "id": "trade.set_image_annotations",
    "domain": "trades",
    "scope": "trades:write",
    "approval": "standard",
    "title": "Set trade image tags and notes"
  },
  {
    "id": "review.create",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "standard",
    "title": "Create review"
  },
  {
    "id": "review.update",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "standard",
    "title": "Update review"
  },
  {
    "id": "review.add_session_log_entries",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "standard",
    "title": "Add session log entries"
  },
  {
    "id": "review.update_session_log_entry",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "standard",
    "title": "Update session log entry"
  },
  {
    "id": "review.delete_session_log_entry",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "always",
    "title": "Delete session log entry"
  },
  {
    "id": "review.add_images",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "standard",
    "title": "Add review images"
  },
  {
    "id": "review.remove_images",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "always",
    "title": "Remove review images"
  },
  {
    "id": "review.set_image_annotations",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "standard",
    "title": "Set review image tags and notes"
  },
  {
    "id": "review.add_key_events",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "standard",
    "title": "Add key events"
  },
  {
    "id": "review.update_key_event",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "standard",
    "title": "Update key event"
  },
  {
    "id": "review.delete_key_event",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "always",
    "title": "Delete key event"
  },
  {
    "id": "review.set_day_trade_fields",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "standard",
    "title": "Set day trade fields"
  },
  {
    "id": "session.start_unplanned",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "standard",
    "title": "Start unplanned session"
  },
  {
    "id": "session.stop_unplanned",
    "domain": "reviews",
    "scope": "reviews:write",
    "approval": "standard",
    "title": "Stop unplanned session"
  },
  {
    "id": "tag.create",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Create tags"
  },
  {
    "id": "tag.set_color",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set tag color"
  },
  {
    "id": "tag.clear_color",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Clear tag color"
  },
  {
    "id": "tag.rename",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Rename tag"
  },
  {
    "id": "tag.merge",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Merge tags"
  },
  {
    "id": "tag.delete",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete tag"
  },
  {
    "id": "mistake.create",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Create mistakes"
  },
  {
    "id": "mistake.rename",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Rename mistake"
  },
  {
    "id": "mistake.merge",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Merge mistakes"
  },
  {
    "id": "mistake.delete",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete mistake"
  },
  {
    "id": "account_type.create",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Create account types"
  },
  {
    "id": "account_type.rename",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Rename account type"
  },
  {
    "id": "account_type.move",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Move account type"
  },
  {
    "id": "account_type.delete",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete account type"
  },
  {
    "id": "event.create",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Create events"
  },
  {
    "id": "event.update_style",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Update event style"
  },
  {
    "id": "event.rename",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Rename event"
  },
  {
    "id": "event.merge",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Merge events"
  },
  {
    "id": "event.delete",
    "domain": "options",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete event"
  },
  {
    "id": "settings.set_analytics_calculation",
    "domain": "settings",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set analytics calculation"
  },
  {
    "id": "settings.set_date_time_display",
    "domain": "settings",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set date and time display"
  },
  {
    "id": "settings.set_display_preferences",
    "domain": "settings",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set display preferences"
  },
  {
    "id": "settings.set_trading_day",
    "domain": "settings",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set trading day"
  },
  {
    "id": "settings.set_risk_display",
    "domain": "settings",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set risk and display"
  },
  {
    "id": "settings.set_break_even",
    "domain": "settings",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set break-even threshold"
  },
  {
    "id": "settings.set_trade_entry",
    "domain": "settings",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set trade entry preferences"
  },
  {
    "id": "settings.set_review_automation",
    "domain": "settings",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set review automation"
  },
  {
    "id": "settings.set_economic_calendar",
    "domain": "settings",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set economic calendar import"
  },
  {
    "id": "settings.set_session_schedule",
    "domain": "settings",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set session schedule"
  },
  {
    "id": "dashboard_layout.create",
    "domain": "layouts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Create dashboard layout"
  },
  {
    "id": "dashboard_layout.duplicate",
    "domain": "layouts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Duplicate dashboard layout"
  },
  {
    "id": "dashboard_layout.update",
    "domain": "layouts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Replace dashboard layout"
  },
  {
    "id": "dashboard_layout.rename",
    "domain": "layouts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Rename dashboard layout"
  },
  {
    "id": "dashboard_layout.delete",
    "domain": "layouts",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete dashboard layout"
  },
  {
    "id": "dashboard_layout.set_active",
    "domain": "layouts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set active dashboard layout"
  },
  {
    "id": "home_layout.create",
    "domain": "layouts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Create home layout"
  },
  {
    "id": "home_layout.duplicate",
    "domain": "layouts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Duplicate home layout"
  },
  {
    "id": "home_layout.update",
    "domain": "layouts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Replace home layout"
  },
  {
    "id": "home_layout.rename",
    "domain": "layouts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Rename home layout"
  },
  {
    "id": "home_layout.delete",
    "domain": "layouts",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete home layout"
  },
  {
    "id": "home_layout.set_active",
    "domain": "layouts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set active home layout"
  },
  {
    "id": "review_template.create",
    "domain": "review_templates",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Create review template"
  },
  {
    "id": "review_template.duplicate",
    "domain": "review_templates",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Duplicate review template"
  },
  {
    "id": "review_template.update",
    "domain": "review_templates",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Replace review template"
  },
  {
    "id": "review_template.delete",
    "domain": "review_templates",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete review template"
  },
  {
    "id": "review_template.set_default",
    "domain": "review_templates",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set default review template"
  },
  {
    "id": "session_workflow.create",
    "domain": "session_workflows",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Create session workflow"
  },
  {
    "id": "session_workflow.update",
    "domain": "session_workflows",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Replace session workflow"
  },
  {
    "id": "session_workflow.delete",
    "domain": "session_workflows",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete session workflow"
  },
  {
    "id": "session_workflow.delete_question",
    "domain": "session_workflows",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete session question"
  },
  {
    "id": "setup.create",
    "domain": "setups",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Create setup"
  },
  {
    "id": "setup.update",
    "domain": "setups",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Update setup"
  },
  {
    "id": "setup.rename",
    "domain": "setups",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Rename setup"
  },
  {
    "id": "setup.delete",
    "domain": "setups",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete setup"
  },
  {
    "id": "custom_field.create",
    "domain": "custom_fields",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Create custom field"
  },
  {
    "id": "custom_field.update",
    "domain": "custom_fields",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Update custom field"
  },
  {
    "id": "custom_field.delete",
    "domain": "custom_fields",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete custom field"
  },
  {
    "id": "custom_field.reorder",
    "domain": "custom_fields",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Reorder custom fields"
  },
  {
    "id": "session_log_tag.create",
    "domain": "session_log_tags",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Create session log tag"
  },
  {
    "id": "session_log_tag.update",
    "domain": "session_log_tags",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Update session log tag"
  },
  {
    "id": "session_log_tag.delete",
    "domain": "session_log_tags",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete session log tag"
  },
  {
    "id": "account.create",
    "domain": "accounts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Create account"
  },
  {
    "id": "account.update",
    "domain": "accounts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Update account"
  },
  {
    "id": "account.rename",
    "domain": "accounts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Rename account"
  },
  {
    "id": "account.delete",
    "domain": "accounts",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete account"
  },
  {
    "id": "account.add_transaction",
    "domain": "accounts",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Record deposit or withdrawal"
  },
  {
    "id": "account.delete_transaction",
    "domain": "accounts",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete deposit or withdrawal"
  },
  {
    "id": "prop_challenge.advance",
    "domain": "prop_challenges",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Advance challenge phase"
  },
  {
    "id": "prop_challenge.fail",
    "domain": "prop_challenges",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Mark challenge failed"
  },
  {
    "id": "prop_challenge.reopen",
    "domain": "prop_challenges",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Reopen challenge"
  },
  {
    "id": "prop_challenge.add_cost",
    "domain": "prop_challenges",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Record challenge cost"
  },
  {
    "id": "prop_challenge.delete_cost",
    "domain": "prop_challenges",
    "scope": "configuration:write",
    "approval": "always",
    "title": "Delete challenge cost"
  },
  {
    "id": "prop_challenge.configure",
    "domain": "prop_challenges",
    "scope": "configuration:write",
    "approval": "standard",
    "title": "Set up challenge"
  }
] as const;

export type AgentActionId = (typeof agentActionCatalog)[number]['id'];
