

export interface InspectConfigurationRequest {

domains: ("session_mode" | "review_templates" | "dashboard_layouts" | "home_layouts" | "option_catalogs" | "settings" | "setups" | "custom_fields" | "session_log_tags" | "accounts" | "prop_challenges")[]

setup_ids?: string[]

playbook_max_chars?: number
}
