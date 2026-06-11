

import { FilterState } from '../../DashboardView';


export interface AccountFilterProps {
  
  accounts: string[];

  
  selectedAccounts: string[];

  
  onChange: (accounts: string[]) => void;

  
  useOnlyProvidedAccounts?: boolean;
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
}
