

import { InputHTMLAttributes, Ref, SelectHTMLAttributes } from 'react';


interface BaseComponentProps {
  
  className?: string;
  
  id?: string;
  
  disabled?: boolean;
}


export interface InputProps
  extends
    BaseComponentProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'className' | 'disabled' | 'size' | 'onChange'
    > {
  
  label?: string;
  
  error?: string;
  
  helperText?: string;
  
  loading?: boolean;
  
  size?: 'sm' | 'md' | 'lg';
  
  variant?: 'default' | 'filled' | 'outlined';
  
  onChange?: (value: string) => void;
  
  multiline?: boolean;
  
  rows?: number;
  
  required?: boolean;
  
  ref?: Ref<HTMLInputElement>;
}


export interface SelectProps
  extends
    BaseComponentProps,
    Omit<
      SelectHTMLAttributes<HTMLSelectElement>,
      'className' | 'disabled' | 'size' | 'onChange'
    > {
  
  label?: string;
  
  options: Array<{
    value: string;
    label: string;
  }>;
  
  error?: string;
  
  helperText?: string;
  
  size?: 'sm' | 'md' | 'lg';
  
  placeholder?: string;
  
  onChange?: (value: string) => void;
  
  ref?: Ref<HTMLSelectElement>;
}


export interface NumberInputProps extends Omit<
  InputProps,
  'value' | 'onChange'
> {
  
  value?: number;
  
  onChange?: (value: number | undefined) => void;
  
  min?: number;
  
  max?: number;
  
  step?: number;
  
  precision?: number;
  
  allowDecimal?: boolean;
}
