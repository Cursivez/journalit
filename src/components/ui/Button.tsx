

import React from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'plain'
  | 'outline'
  | 'text';
type ButtonSize = 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  className = '',
  children,
  ...props
}) => {
  
  const baseClass = 'journalit-button';

  
  const normalizedSize =
    size === 'sm'
      ? 'small'
      : size === 'md'
        ? 'medium'
        : size === 'lg'
          ? 'large'
          : size;

  
  const normalizedVariant =
    variant === 'outline'
      ? 'secondary'
      : variant === 'text'
        ? 'plain'
        : variant;

  
  const buttonClasses = [
    baseClass,
    `${baseClass}--${normalizedVariant}`,
    `${baseClass}--${normalizedSize}`,
    fullWidth ? `${baseClass}--full-width` : '',
    loading ? `${baseClass}--loading` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      type={props.type || 'button'}
      disabled={loading || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export {};
