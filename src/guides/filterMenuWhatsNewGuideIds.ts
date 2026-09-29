import {
  TRADE_LOG_FILTER_BUTTON_TARGET_ID,
  TRADE_LOG_MAIN_GUIDE_ID,
} from './tradeLogGuideIds';
import {
  DASHBOARD_FILTER_BUTTON_TARGET_ID,
  DASHBOARD_MAIN_GUIDE_ID,
} from './dashboardGuideIds';


export const TRADE_LOG_WHATS_NEW_FILTER_MENU_GUIDE_ID =
  'tradelog.whatsNew.filterMenu';
export const DASHBOARD_WHATS_NEW_FILTER_MENU_GUIDE_ID =
  'dashboard.whatsNew.filterMenu';

export const FILTER_MENU_OPEN_STEP_ID = 'filter-menu-open';
export const FILTER_MENU_EXCLUDE_STEP_ID = 'filter-menu-exclude';
export const FILTER_MENU_MATCH_STEP_ID = 'filter-menu-match';
export const FILTER_MENU_PHASES_STEP_ID = 'filter-menu-phases';
export const FILTER_MENU_DONE_STEP_ID = 'filter-menu-done';

export const FILTER_MENU_EXCLUDE_TARGET_ID = 'filter-menu.exclude';
export const FILTER_MENU_MATCH_TARGET_ID = 'filter-menu.match';
export const FILTER_MENU_PHASES_TARGET_ID = 'filter-menu.phases';

export const FILTER_MENU_OPENED_ACTION_ID = 'filter-menu.opened';


export const FILTER_MENU_PHASED_ACCOUNTS_CONTEXT_KEY =
  'filter-menu.has-phased-accounts';

export type FilterMenuWhatsNewGuideId =
  | typeof TRADE_LOG_WHATS_NEW_FILTER_MENU_GUIDE_ID
  | typeof DASHBOARD_WHATS_NEW_FILTER_MENU_GUIDE_ID;

interface FilterMenuWhatsNewView {
  whatsNewGuideId: FilterMenuWhatsNewGuideId;
  mainGuideId: string;
  
  mainGuideTeachesSince: number;
  filterButtonTargetId: string;
}


export const FILTER_MENU_WHATS_NEW_VIEWS: readonly FilterMenuWhatsNewView[] = [
  {
    whatsNewGuideId: TRADE_LOG_WHATS_NEW_FILTER_MENU_GUIDE_ID,
    mainGuideId: TRADE_LOG_MAIN_GUIDE_ID,
    mainGuideTeachesSince: 11,
    filterButtonTargetId: TRADE_LOG_FILTER_BUTTON_TARGET_ID,
  },
  {
    whatsNewGuideId: DASHBOARD_WHATS_NEW_FILTER_MENU_GUIDE_ID,
    mainGuideId: DASHBOARD_MAIN_GUIDE_ID,
    mainGuideTeachesSince: 6,
    filterButtonTargetId: DASHBOARD_FILTER_BUTTON_TARGET_ID,
  },
];
