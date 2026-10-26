

import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'toolbar';
  
  tooltip?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  ariaLabel,
  className = '',
  children,
  variant = 'default',
  tooltip = true,
  ...props
}) => {
  
  const baseClass = 'journalit-icon-button';

  
  const buttonClasses = [
    baseClass,
    variant === 'toolbar' ? 'journalit-toolbar-icon-button' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      
      aria-label={tooltip ? ariaLabel : undefined}
      type="button"
      data-tooltip={tooltip ? ariaLabel : undefined} 
      {...props}
    >
      {children}
      {!tooltip && <span className="journalit-sr-only">{ariaLabel}</span>}
    </button>
  );
};
