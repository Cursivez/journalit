import React, { useRef, useState } from 'react';
import { DateInput } from '../../core/DateInput';
import {
  dateToDraft,
  resolveDateDraft,
  type DateDraftResult,
} from '../../core/dateInputDraft';
import type { DatePickerSurface } from '../../core/useDateTimePicker';
import { createDateWithoutTime } from '../../../utils/dateUtils';
import { t } from '../../../lang/helpers';

type DateRange = [Date | null, Date | null];
type EditorProps = {
  initialRange: DateRange;
  onPickerOpen?: (surface: DatePickerSurface) => void;
  onPickerClose?: () => void;
} & (
  | { policy: 'bounded'; onChange: (range: [Date, Date]) => void }
  | { policy: 'open-ended'; onChange: (range: DateRange) => void }
);


export function DateRangeEditor(props: EditorProps) {
  const [initialRange] = useState(() =>
    props.initialRange.map((date) =>
      date ? createDateWithoutTime(date, true) : null
    )
  );
  const [drafts, setDrafts] = useState(() => ({
    start: resolveDateDraft(dateToDraft(initialRange[0])),
    end: resolveDateDraft(dateToDraft(initialRange[1])),
  }));
  const currentDrafts = useRef(drafts);
  const applied = useRef<DateRange>([initialRange[0], initialRange[1]]);
  const reversed =
    drafts.start.kind === 'valid' &&
    drafts.end.kind === 'valid' &&
    drafts.start.date > drafts.end.date;

  const change = (field: 'start' | 'end', result: DateDraftResult) => {
    const next = { ...currentDrafts.current, [field]: result };
    currentDrafts.current = next;
    setDrafts(next);
    const start = next.start.kind === 'valid' ? next.start.date : null;
    const end = next.end.kind === 'valid' ? next.end.date : null;
    if (
      next.start.kind === 'invalid' ||
      next.start.kind === 'incomplete' ||
      next.end.kind === 'invalid' ||
      next.end.kind === 'incomplete' ||
      (start && end && start > end)
    )
      return;
    if (props.policy === 'bounded' && (!start || !end)) return;
    if (
      start?.getTime() === applied.current[0]?.getTime() &&
      end?.getTime() === applied.current[1]?.getTime()
    )
      return;
    applied.current = [start, end];
    if (props.policy === 'open-ended') props.onChange([start, end]);
    else if (start && end) props.onChange([start, end]);
  };

  return (
    <div className="journalit-date-range-editor">
      <div className="journalit-date-range-editor__row">
        <DateInput
          label={t('dashboard.filter.date.from')}
          initialValue={initialRange[0]}
          onDraftChange={(result) => change('start', result)}
          required={props.policy === 'bounded'}
          onPickerOpen={props.onPickerOpen}
          onPickerClose={props.onPickerClose}
        />
      </div>
      <div className="journalit-date-range-editor__row">
        <DateInput
          label={t('dashboard.filter.date.to')}
          initialValue={initialRange[1]}
          onDraftChange={(result) => change('end', result)}
          required={props.policy === 'bounded'}
          minDate={
            drafts.start.kind === 'valid' ? drafts.start.date : undefined
          }
          onPickerOpen={props.onPickerOpen}
          onPickerClose={props.onPickerClose}
        />
      </div>
      {reversed && (
        <p role="alert" className="journalit-date-range-editor__error">
          {t('home.period.invalid-range')}
        </p>
      )}
    </div>
  );
}
