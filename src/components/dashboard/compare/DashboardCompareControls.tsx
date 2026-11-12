

import React, { createContext, use } from 'react';
import type { FilterState } from '../dashboardTypes';
import type { DashboardComparisonFilters } from './dashboardComparison';

export interface DashboardCompareControlsValue {
  
  compareFilters: FilterState | null;
  onCompareFilterChange: (filters: FilterState) => void;
  startComparison: (comparison?: {
    a: DashboardComparisonFilters;
    b: DashboardComparisonFilters;
  }) => void;
  stopComparison: () => void;
}

const DashboardCompareControlsContext =
  createContext<DashboardCompareControlsValue | null>(null);

export const DashboardCompareControlsProvider: React.FC<{
  value: DashboardCompareControlsValue;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <DashboardCompareControlsContext.Provider value={value}>
    {children}
  </DashboardCompareControlsContext.Provider>
);


export const useDashboardCompareControls =
  (): DashboardCompareControlsValue | null =>
    use(DashboardCompareControlsContext);
