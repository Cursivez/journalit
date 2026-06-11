

import React, { useState, useEffect } from 'react';
import { NumberInputProps } from './types';
import { Input } from './Input';


export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  precision = 2,
  allowDecimal = true,
  ...rest
}) => {
  
  const [inputValue, setInputValue] = useState<string>(
    value !== undefined && value !== null ? value.toString() : ''
  );

  
  const [isEditing, setIsEditing] = useState(false);

  
  useEffect(() => {
    
    
    if (!isEditing && value !== undefined && value !== null) {
      
      
      const formattedValue =
        allowDecimal && precision > 0
          ? value.toFixed(precision)
          : value.toString();

      setInputValue(formattedValue);
    } else if (!isEditing && (value === undefined || value === null)) {
      setInputValue('');
    }
  }, [value, allowDecimal, precision, isEditing]);

  
  const beginNumberEditing = (e: React.FocusEvent<HTMLInputElement>) => {
    
    setIsEditing(true);

    
    const numValue = parseFloat(inputValue);
    if (numValue === 0 || inputValue === '0' || /^0\.0+$/.test(inputValue)) {
      e.target.select();
    }

    
    rest.onFocus?.(e);
  };

  
  const handleInputChange = (newValue: string) => {
    
    setIsEditing(true);

    
    if (!newValue) {
      setInputValue('');
      onChange?.(undefined);
      return;
    }

    
    const typingRegexPattern = allowDecimal
      ? /^-?\d*\.?\d*$/ 
      : /^-?\d*$/;

    
    if (!typingRegexPattern.test(newValue)) {
      return; 
    }

    
    setInputValue(newValue);

    
    
    if (newValue === '-' || newValue === '.' || newValue === '-.') {
      
      
      return;
    }

    
    const numericValue = allowDecimal
      ? parseFloat(newValue)
      : parseInt(newValue, 10);

    
    if (!isNaN(numericValue)) {
      
      let constrainedValue = numericValue;

      if (min !== undefined && numericValue < min) {
        constrainedValue = min;
      }

      if (max !== undefined && numericValue > max) {
        constrainedValue = max;
      }

      onChange?.(constrainedValue);
    } else {
      // intentional
      
    }
  };

  
  const commitNumberEditing = (e: React.FocusEvent<HTMLInputElement>) => {
    
    setIsEditing(false);

    if (inputValue && !isNaN(parseFloat(inputValue))) {
      const numValue = parseFloat(inputValue);

      
      if (allowDecimal && precision > 0) {
        setInputValue(numValue.toFixed(precision));
      }
    } else if (inputValue === '-' || inputValue === '.') {
      
      setInputValue('');
      onChange?.(undefined);
    }

    
    rest.onBlur?.(e);
  };

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();

      const currentValue = inputValue ? parseFloat(inputValue) : 0;

      if (!isNaN(currentValue)) {
        const increment = e.key === 'ArrowUp' ? step : -step;
        const newValue = currentValue + increment;

        
        let constrainedValue = newValue;
        if (min !== undefined && newValue < min) {
          constrainedValue = min;
        }
        if (max !== undefined && newValue > max) {
          constrainedValue = max;
        }

        
        const formattedValue =
          allowDecimal && precision > 0
            ? constrainedValue.toFixed(precision)
            : constrainedValue.toString();

        setInputValue(formattedValue);
        onChange?.(constrainedValue);
      }
    }

    
    rest.onKeyDown?.(e);
  };

  return (
    <Input
      {...rest}
      type="text"
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      value={inputValue}
      onChange={handleInputChange}
      onFocus={beginNumberEditing}
      onBlur={commitNumberEditing}
      onKeyDown={handleKeyDown}
      min={min}
      max={max}
      step={step}
    />
  );
};


NumberInput.displayName = 'NumberInput';
