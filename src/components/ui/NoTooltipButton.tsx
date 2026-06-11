

import React from 'react';

interface NoTooltipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  className?: string;
  children: React.ReactNode;
}


export const NoTooltipButton: React.FC<NoTooltipButtonProps> = ({
  label,
  className = '',
  children,
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
    >
      {children}
    </button>
  );
};
