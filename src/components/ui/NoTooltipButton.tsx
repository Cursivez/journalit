

import React from 'react';

interface NoTooltipButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick'
> {
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void | Promise<void>;
  label: string;
  className?: string;
  children: React.ReactNode;
}


export const NoTooltipButton: React.FC<NoTooltipButtonProps> = ({
  label,
  className = '',
  children,
  onClick,
  ...props
}) => {
  
  const baseClass = 'journalit-no-tooltip-button';

  
  const buttonClasses = [baseClass, className].filter(Boolean).join(' ');

  
  
  return (
    <button
      className={buttonClasses}
      data-label={label} 
      aria-label={label} 
      type="button"
      {...props}
      onClick={onClick ? (event) => void onClick(event) : undefined}
    >
      {children}
    </button>
  );
};
