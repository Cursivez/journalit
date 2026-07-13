import React from 'react';

export interface DropdownMenuOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownMenuProps<T extends string> {
  options: Array<DropdownMenuOption<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function DropdownMenu<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: DropdownMenuProps<T>) {
  return (
    <div
      className={['journalit-home-period-menu', className]
        .filter(Boolean)
        .join(' ')}
    >
      {options.map((option) => (
        <button
          aria-checked={value === option.value}
          className={
            value === option.value
              ? 'journalit-home-period-option journalit-home-period-option--active'
              : 'journalit-home-period-option'
          }
          key={option.value}
          onClick={() => onChange(option.value)}
          role="menuitemradio"
          type="button"
        >
          <span
            className="journalit-home-period-option__check"
            aria-hidden="true"
          >
            {value === option.value ? '✓' : ''}
          </span>
          <span className="journalit-home-period-option__label">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
