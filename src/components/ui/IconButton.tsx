

import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'toolbar';
}

export const IconButton: React.FC<IconButtonProps> = ({
  ariaLabel,
  className = '',
  children,
  variant = 'default',
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
      aria-label={ariaLabel}
      type="button"
      data-tooltip={ariaLabel} 
      {...props}
    >
      {children}
    </button>
  );
};
