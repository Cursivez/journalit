import React, { useId, useRef, useState } from 'react';
import { CalendarIcon } from '../shared/icons/ObsidianIcon';
import { dateInputError } from './dateInputError';
import { t } from '../../lang/helpers';
import {
  createDateWithoutTime,
  getUserDateFormat,
} from '../../utils/dateUtils';
import { useDateTimePicker, type DatePickerSurface } from './useDateTimePicker';
import {
  DATE_SEGMENT_LENGTHS,
  dateSegmentOrder,
  dateToDraft,
  normalizeDateDigits,
  parseDatePaste,
  padDateDraft,
  resolveDateDraft,
  type DateDraft,
  type DateDraftResult,
  type DateSegment,
} from './dateInputDraft';

const DATE_PLACEHOLDER_KEYS = {
  day: 'datepicker.placeholder.day',
  month: 'datepicker.placeholder.month',
  year: 'datepicker.placeholder.year',
} satisfies Record<DateSegment, Parameters<typeof t>[0]>;


export function DateInput({
  label,
  initialValue,
  onDraftChange,
  minDate,
  required = false,
  onPickerOpen,
  onPickerClose,
}: {
  label: string;
  initialValue: Date | null;
  onDraftChange: (result: DateDraftResult) => void;
  minDate?: Date;
  required?: boolean;
  onPickerOpen?: (surface: DatePickerSurface) => void;
  onPickerClose?: () => void;
}) {
  const [draft, setDraft] = useState(() => dateToDraft(initialValue));
  const [showIncomplete, setShowIncomplete] = useState(false);
  const lastValid = useRef(initialValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const segmentRefs = useRef<
    Partial<Record<DateSegment, HTMLInputElement | null>>
  >({});
  const labelId = useId();
  const errorId = useId();
  const format = getUserDateFormat();
  const order = dateSegmentOrder(format);
  const result = resolveDateDraft(draft);
  const error = dateInputError(result, showIncomplete, required);

  const update = (next: DateDraft, deferShortYear = false) => {
    setDraft(next);
    const parsed = resolveDateDraft(next);
    const resolved: DateDraftResult =
      deferShortYear && parsed.kind === 'valid'
        ? { kind: 'incomplete' }
        : parsed;
    if (resolved.kind === 'valid') lastValid.current = resolved.date;
    onDraftChange(resolved);
    return resolved;
  };
  const finishSegments = () => {
    setShowIncomplete(true);
    update(padDateDraft(draft));
  };
  const selectDate = (date: Date | undefined) => {
    setShowIncomplete(true);
    const normalized = date ? createDateWithoutTime(date, true) : undefined;
    update(dateToDraft(normalized ?? null));
    return normalized;
  };
  const openPicker = useDateTimePicker({
    containerRef,
    triggerRef,
    value: lastValid.current ?? undefined,
    minDate,
    onChange: selectDate,
    onSelectDay: selectDate,
    onToday: selectDate,
    onOpen: onPickerOpen,
    onClose: onPickerClose,
  });

  return (
    <div className="journalit-fast-datetime journalit-date-input journalit-date-picker-input">
      <div id={labelId} className="journalit-fast-datetime__label">
        {label}
      </div>
      <div
        ref={containerRef}
        className="journalit-fast-datetime__container"
        data-date-only="true"
        dir="ltr"
        role="group"
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            finishSegments();
        }}
      >
        <div className="journalit-fast-datetime__date-group">
          {order.map((field, index) => {
            const placeholder = t(DATE_PLACEHOLDER_KEYS[field]);
            return (
              <React.Fragment key={field}>
                {index > 0 && (
                  <span
                    className="journalit-fast-datetime__separator"
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
                <input
                  ref={(element) => {
                    segmentRefs.current[field] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  spellCheck={false}
                  className="segment-input journalit-fast-datetime__segment"
                  data-segment={field}
                  data-year-extended={
                    field === 'year' && draft.year.length > 2
                      ? 'true'
                      : undefined
                  }
                  value={draft[field]}
                  placeholder={placeholder}
                  aria-label={`${label} (${placeholder})`}
                  aria-invalid={Boolean(
                    error &&
                    (result.kind !== 'invalid' || result.field === field)
                  )}
                  aria-describedby={error ? errorId : undefined}
                  onChange={(event) => {
                    const value = normalizeDateDigits(event.target.value);
                    const next = update(
                      { ...draft, [field]: value },
                      field === 'year' && value.length === 2
                    );
                    
                    if (
                      value.length === DATE_SEGMENT_LENGTHS[field] &&
                      /^\d+$/.test(value) &&
                      !(next.kind === 'invalid' && next.field === field)
                    ) {
                      const following = order[index + 1];
                      if (following) {
                        segmentRefs.current[following]?.focus();
                        segmentRefs.current[following]?.select();
                      }
                    }
                  }}
                  onPaste={(event) => {
                    const parsed = parseDatePaste(
                      event.clipboardData.getData('text'),
                      format
                    );
                    if (parsed) {
                      event.preventDefault();
                      setShowIncomplete(true);
                      update(parsed);
                    }
                  }}
                  onBlur={(event) => {
                    if (
                      field === 'year' &&
                      draft.year.length === 2 &&
                      containerRef.current?.contains(event.relatedTarget)
                    )
                      update(draft);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      finishSegments();
                    }
                  }}
                />
              </React.Fragment>
            );
          })}
        </div>
        <button
          ref={triggerRef}
          type="button"
          className="clickable-icon journalit-fast-datetime__calendar-button"
          aria-label={t('datetime.aria.open-picker')}
          onClick={(event) => {
            event.preventDefault();
            openPicker();
          }}
        >
          <CalendarIcon size={18} />
        </button>
      </div>
      {error && (
        <span
          id={errorId}
          role="alert"
          className="journalit-fast-datetime__error"
        >
          {error}
        </span>
      )}
    </div>
  );
}
