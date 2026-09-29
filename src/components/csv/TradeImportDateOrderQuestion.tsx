

import React, { useId } from 'react';
import { t } from '../../lang/helpers';
import { getDateFormatOptions } from '../../services/csv/types';
import type { TradeImportDiagnostic } from '../../services/tradeImport/types';
import { Button } from '../ui/Button';
import { describeDateReading } from './dateOrderQuestion';

export const TradeImportDateOrderQuestion: React.FC<{
  diagnostic: TradeImportDiagnostic;
  busy: boolean;
  onChoose: (format: string) => void;
}> = ({ diagnostic, busy, onChoose }) => {
  const titleId = useId();
  const example = diagnostic.example ?? '';
  
  const candidates = new Set(diagnostic.candidateFormats);
  const options = getDateFormatOptions().filter((option) =>
    candidates.has(option.value)
  );
  if (options.length === 0) return null;
  const ambiguous = diagnostic.code === 'ambiguous_date_format';
  
  
  const readings = options.map((option) =>
    ambiguous ? describeDateReading(example, option.value) : null
  );
  const useReadings =
    readings.every((reading) => reading !== null) &&
    new Set(readings).size === readings.length;

  return (
    <section
      className="journalit-trade-import-date-question"
      aria-labelledby={titleId}
    >
      <strong id={titleId}>
        {ambiguous
          ? t('trade-import.date-question.ambiguous', { example })
          : t('trade-import.date-question.mixed', { example })}
      </strong>
      {!ambiguous && <p>{t('trade-import.date-question.mixed-note')}</p>}
      <div className="journalit-trade-import-date-question__options">
        {options.map((option, index) => (
          <Button
            key={option.value}
            size="small"
            disabled={busy}
            onClick={() => onChoose(option.value)}
          >
            {useReadings ? readings[index] : option.label}
          </Button>
        ))}
      </div>
    </section>
  );
};
