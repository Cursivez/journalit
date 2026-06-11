

import JournalitPlugin from '../../../main';
import { FilterState } from '../DashboardView';


export const saveLastUsedFilters = async (
  plugin: JournalitPlugin,
  filters: FilterState
): Promise<void> => {
  
  await plugin.uiStateManager.updateState({
    lastUsedFilters: filters,
  });
};
