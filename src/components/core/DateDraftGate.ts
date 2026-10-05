import { createContext, useMemo, useRef } from 'react';

export interface DateDraftCheck {
  check: () => 'valid' | 'invalid' | 'committed';
  focus: () => void;
}

interface DateDraftGate {
  register: (id: string, field: DateDraftCheck) => () => void;
  confirm: () => boolean;
}

export const DateDraftGateContext = createContext<DateDraftGate | null>(null);


export function useDateDraftGate(): DateDraftGate {
  const fields = useRef(new Map<string, DateDraftCheck>());
  return useMemo(
    () => ({
      register: (id, field) => {
        fields.current.set(id, field);
        return () => {
          fields.current.delete(id);
        };
      },
      confirm: () => {
        let firstInvalid: DateDraftCheck | undefined;
        let committed = false;
        for (const field of fields.current.values()) {
          const result = field.check();
          if (result === 'invalid') firstInvalid ??= field;
          if (result === 'committed') committed = true;
        }
        firstInvalid?.focus();
        
        
        return !firstInvalid && !committed;
      },
    }),
    []
  );
}
