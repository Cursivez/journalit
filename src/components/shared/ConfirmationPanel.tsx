import React, { ReactNode, useEffect, useRef } from 'react';
import type { ConfirmationAction } from './ConfirmationModal';
import { getConfirmationActionClass } from './ConfirmationModal';

export interface ConfirmationPanelAction<
  TResult,
> extends ConfirmationAction<TResult> {
  id: string;
}

interface ConfirmationPanelProps<TResult> {
  title?: string;
  children: ReactNode;
  actions: readonly ConfirmationPanelAction<TResult>[];
  onAction: (result: TResult) => void;
  destructive?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ConfirmationPanel<TResult>({
  title,
  children,
  actions,
  onAction,
  destructive = false,
  disabled = false,
  className,
}: ConfirmationPanelProps<TResult>): React.ReactElement {
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    initialFocusRef.current?.focus();
  }, []);

  const rootClassName = [
    'journalit-confirmation-panel',
    destructive ? 'journalit-confirmation-panel--destructive' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      {title ? (
        <h3 className="journalit-confirmation-panel__title">{title}</h3>
      ) : null}
      <div className="journalit-confirmation-panel__content">{children}</div>
      <div className="journalit-confirmation-panel__actions journalit-modal-actions">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={`journalit-confirmation-panel__action ${getConfirmationActionClass(action.variant ?? 'secondary')}`}
            onClick={() => onAction(action.value)}
            disabled={disabled || action.disabled === true}
            ref={action.initialFocus ? initialFocusRef : undefined}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
