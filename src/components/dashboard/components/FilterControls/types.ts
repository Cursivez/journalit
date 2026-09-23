

import type * as React from 'react';
import { FilterState } from '../../DashboardView';
import type { AccountPhaseOptionGroup } from '../../../shared/filters/accountPhaseScope';
import type { AccountPhaseScope } from '../../../shared/filters/types';


export interface AccountFilterProps {
  
  accounts: string[];

  
  selectedAccounts: string[];

  
  onChange: (accounts: string[]) => void;

  
  phaseOptions?: AccountPhaseOptionGroup[];

  
  selectedPhases?: AccountPhaseScope[];

  
  onPhasesChange?: (phases: AccountPhaseScope[]) => void;

  
  dateFormat?: string;
}


export interface TagFilterProps {
  
  tags: string[];

  
  selectedTags: string[];

  
  onChange: (tags: string[]) => void;
}


export interface MistakeFilterProps {
  
  mistakes: string[];

  
  selectedMistakes: string[];

  
  onChange: (mistakes: string[]) => void;
}

export interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isEditing?: boolean;
  onToggleEditMode?: () => void;
  onOpenAddWidget?: () => void;
  modeToggle?: React.ReactNode;
}
