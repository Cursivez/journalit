

import type * as React from 'react';
import { FilterState } from '../../DashboardView';

export interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isEditing?: boolean;
  onToggleEditMode?: () => void;
  onOpenAddWidget?: () => void;
  modeToggle?: React.ReactNode;
}
