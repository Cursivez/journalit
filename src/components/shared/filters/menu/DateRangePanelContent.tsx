import React, { useEffect, useState } from 'react';
import { DateRangeEditor } from '../DateRangeEditor';
import type { DatePickerSurface } from '../../../core/useDateTimePicker';
import type { FilterMenuDateRangeNode } from './menuModel';

export interface DateRangePickerLifecycle {
  onPickerOpen: (surface: DatePickerSurface) => void;
  onPickerClose: () => void;
}

export function DateRangePanelContent({
  node,
  onPickerOpen,
  onPickerClose,
}: {
  node: FilterMenuDateRangeNode;
} & DateRangePickerLifecycle) {
  const [initialRange] = useState(node.getInitialRange);
  useEffect(() => () => onPickerClose(), [onPickerClose]);
  return (
    <div className="journalit-filter-menu-date-range">
      <DateRangeEditor
        initialRange={initialRange}
        policy="bounded"
        onChange={node.onApply}
        onPickerOpen={onPickerOpen}
        onPickerClose={onPickerClose}
      />
    </div>
  );
}
