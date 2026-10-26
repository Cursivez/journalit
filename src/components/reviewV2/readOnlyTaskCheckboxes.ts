import type React from 'react';



const isNativeTaskCheckbox = (event: UIEvent): boolean => {
  const node = event.targetNode;
  return (
    node !== null &&
    node.instanceOf(HTMLInputElement) &&
    node.classList.contains('task-list-item-checkbox')
  );
};

export const preventMutation = (event: React.SyntheticEvent): void => {
  event.preventDefault();
  event.stopPropagation();
};


export const readOnlyTaskCheckboxProps = {
  onClickCapture: (event: React.MouseEvent) => {
    if (isNativeTaskCheckbox(event.nativeEvent)) preventMutation(event);
  },
  onKeyDownCapture: (event: React.KeyboardEvent) => {
    if (
      (event.key === ' ' || event.key === 'Enter') &&
      isNativeTaskCheckbox(event.nativeEvent)
    )
      preventMutation(event);
  },
};
