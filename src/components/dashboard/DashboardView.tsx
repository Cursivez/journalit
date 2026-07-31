
import { ItemView } from 'obsidian';
import { t } from '../../lang/helpers';

export const DASHBOARD_VIEW_TYPE = 'journalit-dashboard-view';


export class LegacyDashboardRedirectView extends ItemView {
  getViewType(): string {
    return DASHBOARD_VIEW_TYPE;
  }

  getDisplayText(): string {
    return t('dashboard.title');
  }

  getIcon(): string {
    return 'grip';
  }
}

export type { FilterState } from './dashboardTypes';
export { DashboardPage } from './DashboardPage';
