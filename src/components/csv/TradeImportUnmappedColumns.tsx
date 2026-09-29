

import React, { useId } from 'react';
import { t } from '../../lang/helpers';
import { Button } from '../ui/Button';
import { columnSampleValues } from './customFieldFromColumn';

export const TradeImportUnmappedColumns: React.FC<{
  headers: readonly string[];
  sampleRows: readonly string[][];
  
  assignments: Readonly<Record<string, string>>;
  busy: boolean;
  onKeep: (header: string, sampleValues: string[]) => void;
}> = ({ headers, sampleRows, assignments, busy, onKeep }) => {
  const titleId = useId();
  const unmapped = headers.filter((header) => !assignments[header]);
  if (unmapped.length === 0) return null;

  return (
    <section
      className="journalit-trade-import-unmapped"
      aria-labelledby={titleId}
    >
      <div className="journalit-trade-import-unmapped__header">
        <strong id={titleId}>
          {t('trade-import.unmapped.title', {
            count: String(unmapped.length),
          })}
        </strong>
        <p>{t('trade-import.unmapped.body')}</p>
      </div>
      <ul className="journalit-trade-import-unmapped__list">
        {unmapped.map((header) => {
          const samples = columnSampleValues(header, headers, sampleRows);
          return (
            <li key={header}>
              <span className="journalit-trade-import-unmapped__name">
                {header}
              </span>
              <span className="journalit-trade-import-unmapped__example">
                {samples[0] ?? ''}
              </span>
              <Button
                size="small"
                disabled={busy}
                aria-label={t('trade-import.unmapped.keep-aria', { header })}
                onClick={() => onKeep(header, samples)}
              >
                {t('trade-import.unmapped.keep')}
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
