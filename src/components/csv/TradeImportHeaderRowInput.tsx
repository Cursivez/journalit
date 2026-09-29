

import React, { useId, useRef, useState } from 'react';
import { t } from '../../lang/helpers';

export const TradeImportHeaderRowInput: React.FC<{
  
  sheetRow: number;
  disabled: boolean;
  error: string | null;
  onCommit: (sheetRow: number) => void;
  
  onClearError: () => void;
}> = ({ sheetRow, disabled, error, onCommit, onClearError }) => {
  const errorId = useId();
  const [draft, setDraft] = useState(() => String(sheetRow));
  
  
  
  const lastCommitted = useRef(sheetRow);

  const commit = (onBlur: boolean) => {
    const next = Number(draft);
    if (!Number.isInteger(next) || next < 1 || next === sheetRow) {
      setDraft(String(sheetRow));
      lastCommitted.current = sheetRow;
      if (error) onClearError();
      return;
    }
    if (onBlur && next === lastCommitted.current) return;
    lastCommitted.current = next;
    onCommit(next);
  };

  return (
    <>
      <label>
        <span>{t('trade-import.label.header-row')}</span>
        <input
          type="number"
          min={1}
          step={1}
          value={draft}
          disabled={disabled}
          aria-invalid={error !== null}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => commit(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit(false);
          }}
        />
      </label>
      
      {error && (
        <p
          id={errorId}
          role="alert"
          className="journalit-trade-import-header-row-error"
        >
          {error}
        </p>
      )}
    </>
  );
};
