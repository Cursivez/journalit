

import React, { Children, Fragment, isValidElement } from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'plain'
  | 'outline'
  | 'text';
type ButtonSize = 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick'
> {
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void | Promise<void>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}


function labelTextRuns(children: React.ReactNode): React.ReactNode[] {
  const labelled: React.ReactNode[] = [];
  let run = '';

  const endRun = () => {
    if (run.trim()) {
      labelled.push(
        <span className="journalit-button__label" key={labelled.length}>
          {run}
        </span>
      );
    }
    run = '';
  };

  for (const child of Children.toArray(children)) {
    if (typeof child === 'string' || typeof child === 'number') {
      run += child;
      continue;
    }

    endRun();
    labelled.push(
      isValidElement<React.PropsWithChildren>(child) &&
        child.type === Fragment ? (
        <Fragment key={child.key}>
          {labelTextRuns(child.props.children)}
        </Fragment>
      ) : (
        child
      )
    );
  }

  endRun();
  return labelled;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  className = '',
  children,
  onClick,
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
      onClick={onClick ? (event) => void onClick(event) : undefined}
    >
      {labelTextRuns(children)}
    </button>
  );
};

export {};
