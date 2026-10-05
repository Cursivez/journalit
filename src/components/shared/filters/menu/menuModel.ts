

import type { ObsidianIconComponent } from '../../icons/ObsidianIcon';
import type { FilterMatchMode } from '../filterMatchModes';


export type FilterSelectionMode = 'include' | 'exclude';

export interface FilterMenuOption {
  value: string;
  label: string;
  description?: string;
}

export interface FilterMenuValuesNode<R = void> {
  kind: 'values';
  id: string;
  label: string;
  icon?: ObsidianIconComponent;
  options: FilterMenuOption[];
  included: ReadonlySet<string>;
  
  excluded: ReadonlySet<string> | null;
  
  partial?: ReadonlySet<string>;
  
  optionChildren?: ReadonlyMap<string, FilterMenuNode<R>>;
  emptyLabel?: string;
  
  appliedCount?: number;
  
  matchMode: FilterMatchMode | null;
  
  noValueOption?: string;
  
  matchChild?: FilterMenuValuesNode<R>;
  
  singleChoice?: boolean;
  onToggle: (value: string, mode: FilterSelectionMode) => R;
  onClear: () => R;
}

export interface FilterMenuBranchNode<R = void> {
  kind: 'branch';
  id: string;
  label: string;
  icon?: ObsidianIconComponent;
  children: FilterMenuEntry<R>[];
}


export interface FilterMenuDateRangeNode<R = void> {
  kind: 'date-range';
  id: string;
  label: string;
  icon?: ObsidianIconComponent;
  getInitialRange: () => [Date | null, Date | null];
  
  onActivate?: () => R;
  onApply: (range: [Date, Date]) => R;
}

export type FilterMenuNode<R = void> =
  | FilterMenuValuesNode<R>
  | FilterMenuBranchNode<R>
  | FilterMenuDateRangeNode<R>;
export type FilterMenuEntry<R = void> =
  | FilterMenuNode<R>
  | { kind: 'divider'; id: string };


export interface FilterMenuGuideTour {
  
  path: string[] | null;
  
  target: 'panel' | 'option';
  registerTarget: (element: HTMLElement | null) => void;
}

function bindValues<R>(
  node: FilterMenuValuesNode<R>,
  apply: (result: R) => void
): FilterMenuValuesNode {
  let optionChildren: Map<string, FilterMenuNode> | undefined;
  if (node.optionChildren) {
    optionChildren = new Map();
    for (const [value, child] of node.optionChildren) {
      optionChildren.set(value, bindNode(child, apply));
    }
  }
  return {
    ...node,
    optionChildren,
    matchChild: node.matchChild
      ? bindValues(node.matchChild, apply)
      : undefined,
    onToggle: (value, mode) => apply(node.onToggle(value, mode)),
    onClear: () => apply(node.onClear()),
  };
}

function bindNode<R>(
  node: FilterMenuNode<R>,
  apply: (result: R) => void
): FilterMenuNode {
  if (node.kind === 'date-range') {
    const activate = node.onActivate;
    return {
      ...node,
      onActivate: activate ? () => apply(activate()) : undefined,
      onApply: (range) => apply(node.onApply(range)),
    };
  }
  return node.kind === 'branch'
    ? { ...node, children: bindEntries(node.children, apply) }
    : bindValues(node, apply);
}


export function bindEntries<R>(
  entries: FilterMenuEntry<R>[],
  apply: (result: R) => void
): FilterMenuEntry[] {
  return entries.map((entry) =>
    entry.kind === 'divider' ? entry : bindNode(entry, apply)
  );
}


export function checklistNode(config: {
  id: string;
  label: string;
  icon?: ObsidianIconComponent;
  options: FilterMenuOption[];
  selected: Iterable<string>;
  singleChoice?: boolean;
  appliedCount?: number;
  emptyLabel?: string;
  optionChildren?: ReadonlyMap<string, FilterMenuNode>;
  onToggle: (value: string) => void;
  onClear: () => void;
}): FilterMenuValuesNode {
  return {
    kind: 'values',
    id: config.id,
    label: config.label,
    icon: config.icon,
    options: config.options,
    included: new Set(config.selected),
    excluded: null,
    matchMode: null,
    singleChoice: config.singleChoice,
    appliedCount: config.appliedCount,
    emptyLabel: config.emptyLabel,
    optionChildren: config.optionChildren,
    onToggle: (value) => config.onToggle(value),
    onClear: config.onClear,
  };
}

export function countNode<R>(node: FilterMenuNode<R>): {
  included: number;
  excluded: number;
} {
  if (node.kind === 'date-range') return { included: 0, excluded: 0 };
  if (node.kind === 'values') {
    let included = node.appliedCount ?? node.included.size;
    if (node.optionChildren) {
      for (const child of node.optionChildren.values()) {
        included += countNode(child).included;
      }
    }
    return { included, excluded: node.excluded?.size ?? 0 };
  }

  let included = 0;
  let excluded = 0;
  for (const child of node.children) {
    if (child.kind === 'divider') continue;
    const counts = countNode(child);
    included += counts.included;
    excluded += counts.excluded;
  }
  return { included, excluded };
}

function isValuesNodeApplied(node: FilterMenuNode): boolean {
  const { included, excluded } = countNode(node);
  return included > 0 || excluded > 0;
}


export function countAppliedFilters(entries: FilterMenuEntry[]): number {
  let count = 0;
  for (const entry of entries) {
    if (entry.kind === 'divider') continue;
    if (entry.kind === 'branch') {
      count += countAppliedFilters(entry.children);
    } else if (isValuesNodeApplied(entry)) {
      count += 1;
    }
  }
  return count;
}


export function hasAppliedEntries(entries: FilterMenuEntry[]): boolean {
  return entries.some((entry) => {
    if (entry.kind === 'divider') return false;
    if (entry.kind === 'date-range') return false;
    if (entry.kind === 'branch') return hasAppliedEntries(entry.children);
    return (
      isValuesNodeApplied(entry) ||
      (entry.matchMode !== null && entry.matchMode !== 'any')
    );
  });
}


export function findChildNode(
  parent: FilterMenuNode | FilterMenuEntry[],
  id: string
): FilterMenuNode | undefined {
  if (Array.isArray(parent)) {
    for (const entry of parent) {
      if (entry.kind !== 'divider' && entry.id === id) return entry;
    }
    return undefined;
  }
  if (parent.kind === 'branch') return findChildNode(parent.children, id);
  if (parent.kind === 'date-range') return undefined;
  if (parent.matchChild?.id === id) return parent.matchChild;
  if (!parent.optionChildren) return undefined;
  for (const child of parent.optionChildren.values()) {
    if (child.id === id) return child;
  }
  return undefined;
}
