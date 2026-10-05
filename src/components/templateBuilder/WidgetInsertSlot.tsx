

import React, { useSyncExternalStore } from 'react';
import { Plus } from '../shared/icons/ObsidianIcon';
import type { WidgetPlacement } from '../../types/reviewV2';
import { t } from '../../lang/helpers';
import { mergeClassNames } from '../../utils/classNames';


export const getFirstInsertableIndex = (widgets: WidgetPlacement[]): number => {
  const firstUnlockedIndex = widgets.findIndex((widget) => !widget.locked);
  return firstUnlockedIndex === -1 ? widgets.length : firstUnlockedIndex;
};

const HOVER_MEDIA_QUERY = '(hover: hover)';

const subscribeToHoverCapability = (onChange: () => void): (() => void) => {
  const query = window.matchMedia(HOVER_MEDIA_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

const getHoverCapability = (): boolean =>
  window.matchMedia(HOVER_MEDIA_QUERY).matches;


export const useCanHover = (): boolean =>
  useSyncExternalStore(
    subscribeToHoverCapability,
    getHoverCapability,
    () => false
  );

interface WidgetInsertSlotProps {
  index: number;
  
  trailing?: boolean;
  
  revealed?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  onInsert: (index: number) => void;
}

export const WidgetInsertSlot: React.FC<WidgetInsertSlotProps> = ({
  index,
  trailing = false,
  revealed = false,
  ref,
  onInsert,
}) => (
  <button
    ref={ref}
    type="button"
    className={mergeClassNames(
      'journalit-native-button journalit-native-button--unstyled',
      'template-insert-slot',
      trailing && 'template-insert-slot--trailing',
      revealed && 'is-revealed'
    )}
    aria-label={t('templateEditor.button.insert-widget-here')}
    onClick={(event) => {
      event.stopPropagation();
      onInsert(index);
    }}
  >
    <span className="template-insert-slot-line" />
    <span className="template-insert-slot-pill">
      <Plus size={12} aria-hidden="true" />
    </span>
    <span className="template-insert-slot-line" />
  </button>
);
