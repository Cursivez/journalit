

import { InputHTMLAttributes, Ref } from 'react';


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
  
  variant?: 'default' | 'filled' | 'outlined' | 'modal';
  
  onChange?: (value: string) => void | Promise<void>;
  
  multiline?: boolean;
  
  rows?: number;
  
  required?: boolean;
  
  ref?: Ref<HTMLInputElement>;
}


export interface SelectProps extends BaseComponentProps {
  
  label?: string;
  
  'aria-label'?: string;
  
  value?: string;
  
  options: Array<{
    value: string;
    label: string;
  }>;
  
  error?: string;
  
  helperText?: string;
  
  placeholder?: string;
  
  onChange?: (value: string) => void | Promise<void>;
}


export interface NumberInputProps extends Omit<
  InputProps,
  'value' | 'onChange'
> {
  
  value?: number;
  
  onChange?: (value: number | undefined) => void | Promise<void>;
  
  min?: number;
  
  max?: number;
  
  step?: number;
  
  precision?: number;
  
  allowDecimal?: boolean;
}
