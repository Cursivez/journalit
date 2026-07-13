

import React, { useState, useEffect, useRef } from 'react';
import { NumberInputProps } from './types';
import { Input } from './Input';

const expandExponentialNumber = (value: number): string => {
  const stringValue = value.toString();
  if (!/[eE]/.test(stringValue)) {
    return stringValue;
  }

  const [coefficient, exponentPart] = stringValue.split(/[eE]/);
  const exponent = Number(exponentPart);
  if (!Number.isInteger(exponent)) {
    return stringValue;
  }

  const sign = coefficient.startsWith('-') ? '-' : '';
  const unsignedCoefficient = sign ? coefficient.slice(1) : coefficient;
  const [integerPart, decimalPart = ''] = unsignedCoefficient.split('.');
  const digits = `${integerPart}${decimalPart}`;
  const decimalIndex = integerPart.length + exponent;

  if (decimalIndex <= 0) {
    return `${sign}0.${'0'.repeat(Math.abs(decimalIndex))}${digits}`;
  }

  if (decimalIndex >= digits.length) {
    return `${sign}${digits}${'0'.repeat(decimalIndex - digits.length)}`;
  }

  return `${sign}${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;
};

const countDecimalPlaces = (value: string): number => {
  const decimalIndex = value.indexOf('.');
  return decimalIndex === -1 ? 0 : value.length - decimalIndex - 1;
};

const trimTrailingDecimalZeros = (value: string): string =>
  value.includes('.')
    ? value.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
    : value;

const isRoundedPrecisionEquivalent = (
  value: number,
  roundedValue: string
): boolean => {
  const parsedRoundedValue = Number(roundedValue);
  return (
    Number.isFinite(parsedRoundedValue) &&
    Math.abs(value - parsedRoundedValue) <=
      Number.EPSILON * Math.max(1, Math.abs(value)) * 10
  );
};

export const formatNumberInputValue = (
  value: number,
  precision: number,
  allowDecimal: boolean
): string => {
  if (!allowDecimal || precision <= 0) {
    return value.toString();
  }

  const expandedValue = expandExponentialNumber(value);
  const decimalPlaces = countDecimalPlaces(expandedValue);
  const roundedValue = value.toFixed(precision);

  if (decimalPlaces > precision) {
    if (isRoundedPrecisionEquivalent(value, roundedValue)) {
      return roundedValue;
    }

    return trimTrailingDecimalZeros(expandedValue);
  }

  return roundedValue;
};


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

  
  const isEditingRef = useRef(false);

  
  useEffect(() => {
    
    
    if (!isEditingRef.current && value !== undefined && value !== null) {
      
      
      const formattedValue = formatNumberInputValue(
        value,
        precision,
        allowDecimal
      );

      setInputValue(formattedValue);
    } else if (
      !isEditingRef.current &&
      (value === undefined || value === null)
    ) {
      setInputValue('');
    }
  }, [value, allowDecimal, precision]);

  
  const beginNumberEditing = (e: React.FocusEvent<HTMLInputElement>) => {
    
    isEditingRef.current = true;

    
    const numValue = parseFloat(inputValue);
    if (numValue === 0 || inputValue === '0' || /^0\.0+$/.test(inputValue)) {
      e.target.select();
    }

    
    rest.onFocus?.(e);
  };

  
  const handleInputChange = (newValue: string) => {
    
    isEditingRef.current = true;

    
    if (!newValue) {
      setInputValue('');
      void onChange?.(undefined);
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

      void onChange?.(constrainedValue);
    } else {
      // intentional
      
    }
  };

  
  const commitNumberEditing = (e: React.FocusEvent<HTMLInputElement>) => {
    
    isEditingRef.current = false;

    if (inputValue && !isNaN(parseFloat(inputValue))) {
      const numValue = parseFloat(inputValue);
      let constrainedValue = numValue;

      if (min !== undefined && numValue < min) {
        constrainedValue = min;
      }

      if (max !== undefined && numValue > max) {
        constrainedValue = max;
      }

      setInputValue(
        formatNumberInputValue(constrainedValue, precision, allowDecimal)
      );

      if (constrainedValue !== numValue) {
        void onChange?.(constrainedValue);
      }
    } else if (inputValue === '-' || inputValue === '.') {
      
      setInputValue('');
      void onChange?.(undefined);
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

        
        const formattedValue = formatNumberInputValue(
          constrainedValue,
          precision,
          allowDecimal
        );

        setInputValue(formattedValue);
        void onChange?.(constrainedValue);
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
