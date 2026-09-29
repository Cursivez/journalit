

import React, { useState } from 'react';

type DraftInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue'
> & {
  
  value: string | number;
};


export function DraftInput({
  value,
  onChange,
  onBlur,
  ...rest
}: DraftInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input
      {...rest}
      value={draft ?? value}
      onChange={(event) => {
        setDraft(event.target.value);
        onChange?.(event);
      }}
      onBlur={(event) => {
        setDraft(null);
        onBlur?.(event);
      }}
    />
  );
}
