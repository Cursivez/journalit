

import React, { useId, ChangeEvent } from 'react';
import { InputProps } from './types';

type InputVariant = NonNullable<InputProps['variant']>;


const isDefaultValue = (value: InputProps['value']): boolean =>
  typeof value === 'string' && /^0(\.0+)?$/.test(value);

type InputControlProps = Omit<
  InputProps,
  'id' | 'label' | 'error' | 'helperText' | 'disabled' | 'loading' | 'onChange'
> & {
  inputId: string;
  variant: InputVariant;
  hasError: boolean;
  disabled: boolean;
  describedBy: string | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};


function InputControl({
  inputId,
  className,
  size = 'md',
  variant,
  hasError,
  disabled,
  describedBy,
  type,
  onChange,
  multiline,
  rows,
  ref,
  ...rest
}: InputControlProps) {
  const isModal = variant === 'modal';
  const inputClasses = [
    'input',
    size,
    isModal ? 'journalit-modal-input' : variant,
    isModal && multiline ? 'journalit-modal-input--multiline' : '',
    hasError ? 'error' : '',
    isDefaultValue(rest.value) ? 'default-value' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (multiline) {
    return (
      <textarea
        id={inputId}
        className={inputClasses}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        rows={rows}
        onChange={onChange}
        value={rest.value}
        placeholder={rest.placeholder}
      />
    );
  }
  return (
    <input
      ref={ref}
      type={type}
      id={inputId}
      className={inputClasses}
      disabled={disabled}
      aria-invalid={hasError}
      aria-describedby={describedBy}
      onFocus={rest.onFocus}
      onBlur={rest.onBlur}
      onChange={onChange}
      {...rest}
    />
  );
}

const inputContainerClassName = (variant: InputVariant, loading: boolean) =>
  [
    'inputContainer',
    variant === 'modal' ? 'journalit-modal-field' : '',
    loading ? 'loading' : '',
  ]
    .filter(Boolean)
    .join(' ');


function InputMessage({
  inputId,
  error,
  helperText,
}: {
  inputId: string;
  error: string | undefined;
  helperText: string | undefined;
}) {
  if (error)
    return (
      <div id={`error-${inputId}`} className="errorMessage" role="alert">
        {error}
      </div>
    );
  if (!helperText) return null;
  return (
    <div id={`helper-${inputId}`} className="helperText">
      {helperText}
    </div>
  );
}

const describedById = (
  inputId: string,
  error: string | undefined,
  helperText: string | undefined
): string | undefined => {
  if (error) return `error-${inputId}`;
  return helperText ? `helper-${inputId}` : undefined;
};


export const Input: React.FC<InputProps> = ({
  className,
  id,
  label,
  error,
  helperText,
  disabled,
  size,
  variant = 'default',
  type = variant === 'modal' ? 'text' : undefined,
  loading = false,
  onChange,
  multiline = false,
  rows = 3,
  required,
  ref,
  ...rest
}) => {
  
  const uniqueId = useId();
  const inputId = id || `input-${uniqueId}`;
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (onChange) {
      void onChange(e.target.value);
    }
  };

  return (
    <div className={inputContainerClassName(variant, loading)}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <div className="inputWrapper">
        <InputControl
          {...rest}
          inputId={inputId}
          className={className}
          size={size}
          variant={variant}
          hasError={Boolean(error)}
          disabled={disabled || loading}
          describedBy={describedById(inputId, error, helperText)}
          type={type}
          onChange={handleChange}
          multiline={multiline}
          rows={rows}
          ref={ref}
        />
      </div>

      <InputMessage inputId={inputId} error={error} helperText={helperText} />
    </div>
  );
};


Input.displayName = 'Input';
