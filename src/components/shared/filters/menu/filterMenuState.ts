

import type { AvailableCustomFieldFilter } from '../types';
import type { DropdownOption } from '../../../../types/customFields';
import type { FilterMenuLayout, PanelPosition } from './filterMenuPosition';

export interface FilterMenuAsyncOptions {
  accounts: string[];
  customFields: AvailableCustomFieldFilter[];
  imageTags?: DropdownOption[];
}


export type LoadedFilterMenuOptions = Partial<FilterMenuAsyncOptions>;

interface FilterMenuState {
  layout: FilterMenuLayout;
  
  openPath: string[];
  positions: Array<PanelPosition | null>;
  
  layoutTick: number;
}

type FilterMenuAction =
  | { type: 'setPath'; depth: number; id: string | null }
  | { type: 'setPositions'; positions: Array<PanelPosition | null> }
  | { type: 'reflow'; layout: FilterMenuLayout };

export function createFilterMenuState(
  layout: FilterMenuLayout
): FilterMenuState {
  return { layout, openPath: [], positions: [], layoutTick: 0 };
}

export function filterMenuReducer(
  state: FilterMenuState,
  action: FilterMenuAction
): FilterMenuState {
  switch (action.type) {
    case 'setPath': {
      const openPath = state.openPath.slice(0, action.depth);
      if (action.id) openPath.push(action.id);
      return { ...state, openPath };
    }
    case 'setPositions':
      return { ...state, positions: action.positions };
    case 'reflow':
      return {
        ...state,
        layout: action.layout,
        layoutTick: state.layoutTick + 1,
      };
    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}
