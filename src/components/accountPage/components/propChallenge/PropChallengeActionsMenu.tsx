

import React, { useId } from 'react';
import { useMenuDisclosure } from '../../../../hooks/useMenuDisclosure';
import { t } from '../../../../lang/helpers';
import {
  Archive,
  ChevronRight,
  LinkIcon,
  MoreVertical,
  RotateCcw,
  X,
  type ObsidianIconComponent,
} from '../../../shared/icons/ObsidianIcon';


export type PropChallengeLifecycleAction =
  | 'advance'
  | 'fail'
  | 'archive'
  | 'reopen';

export type PropChallengeManualAction =
  | PropChallengeLifecycleAction
  | 'link-rules';

export interface PropChallengeMenuAction {
  id: PropChallengeManualAction;
  label: string;
  disabled: boolean;
}

const ACTION_ICONS: Record<PropChallengeManualAction, ObsidianIconComponent> = {
  advance: ChevronRight,
  fail: X,
  archive: Archive,
  reopen: RotateCcw,
  'link-rules': LinkIcon,
};

export const PropChallengeActionsMenu: React.FC<{
  actions: readonly PropChallengeMenuAction[];
  onSelect: (action: PropChallengeManualAction) => void;
}> = ({ actions, onSelect }) => {
  const { isOpen, setIsOpen, close, containerRef, triggerRef, menuProps } =
    useMenuDisclosure();
  const menuId = useId();
  const label = t('account.prop-challenge.actions.manual');

  return (
    <div className="journalit-prop-actions-menu" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? menuId : undefined}
        className="journalit-icon-button journalit-prop-actions-trigger"
        onClick={() => setIsOpen((open) => !open)}
        ref={triggerRef}
        type="button"
      >
        <MoreVertical size={14} aria-hidden="true" />
        <span className="journalit-account-page-sr-only">{label}</span>
      </button>
      {isOpen ? (
        <div
          aria-label={label}
          className="journalit-prop-actions-popover journalit-home-period-menu"
          id={menuId}
          {...menuProps}
        >
          {actions.map((action) => {
            const Icon = ACTION_ICONS[action.id];
            return (
              <button
                className="journalit-prop-actions-item journalit-home-period-option"
                disabled={action.disabled}
                key={action.id}
                onClick={() => {
                  close(true);
                  onSelect(action.id);
                }}
                role="menuitem"
                type="button"
              >
                <Icon size={13} aria-hidden="true" />
                <span className="journalit-home-period-option__label">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
