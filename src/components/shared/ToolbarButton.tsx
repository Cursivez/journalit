import React from 'react';

type ToolbarButtonVariant = 'text' | 'icon';

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: ToolbarButtonVariant;
}

export function ToolbarButton({
  active = false,
  className = '',
  variant = 'text',
  ...props
}: ToolbarButtonProps) {
  const classNames = [
    'journalit-toolbar-button',
    variant === 'icon' ? 'journalit-toolbar-button--icon' : null,
    active ? 'journalit-toolbar-button--active' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button className={classNames} {...props} />;
}

ToolbarButton.displayName = 'ToolbarButton';
