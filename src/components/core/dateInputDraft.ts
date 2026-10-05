import { createDateWithoutTime } from '../../utils/dateUtils';

export type DateSegment = 'day' | 'month' | 'year';
export type DateDraft = Record<DateSegment, string>;
export type DateDraftResult =
  | { kind: 'empty' }
  | { kind: 'incomplete' }
  | {
      kind: 'invalid';
      field: DateSegment;
      reason: 'digits' | 'day' | 'month' | 'year';
    }
  | { kind: 'invalid'; field: 'day'; reason: 'monthDays'; maxDays: number }
  | { kind: 'valid'; date: Date };

export const DATE_SEGMENT_LENGTHS: Record<DateSegment, number> = {
  day: 2,
  month: 2,
  year: 4,
};


export function normalizeDateDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹०-९௦-௯０-９]/gu, (digit) => {
    const point = digit.codePointAt(0)!;
    const zero = [0x660, 0x6f0, 0x966, 0xbe6, 0xff10].find(
      (start) => point >= start && point <= start + 9
    )!;
    return String(point - zero);
  });
}

export function dateToDraft(date: Date | null): DateDraft {
  if (!date) return { day: '', month: '', year: '' };
  const year = date.getFullYear();
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    year:
      year >= 2000 && year <= 2099
        ? String(year - 2000).padStart(2, '0')
        : String(year).padStart(4, '0'),
  };
}


export function padDateDraft(draft: DateDraft): DateDraft {
  return {
    ...draft,
    day:
      /^\d$/.test(draft.day) && draft.day !== '0'
        ? draft.day.padStart(2, '0')
        : draft.day,
    month:
      /^\d$/.test(draft.month) && draft.month !== '0'
        ? draft.month.padStart(2, '0')
        : draft.month,
  };
}

export function dateSegmentOrder(format: string): DateSegment[] {
  if (format === 'MMDDYY') return ['month', 'day', 'year'];
  if (format === 'YYMMDD') return ['year', 'month', 'day'];
  return ['day', 'month', 'year'];
}

export function resolveDateDraft(draft: DateDraft): DateDraftResult {
  if (!draft.day && !draft.month && !draft.year) return { kind: 'empty' };
  for (const field of ['day', 'month', 'year'] satisfies DateSegment[]) {
    const value = draft[field];
    if (value && !/^\d+$/.test(value))
      return { kind: 'invalid', field, reason: 'digits' };
    if (value.length > DATE_SEGMENT_LENGTHS[field])
      return { kind: 'invalid', field, reason: field };
  }
  const day = Number(draft.day),
    month = Number(draft.month),
    year =
      draft.year.length === 2 ? 2000 + Number(draft.year) : Number(draft.year);
  if (day > 31 || (draft.day.length === 2 && day === 0))
    return { kind: 'invalid', field: 'day', reason: 'day' };
  if (month > 12 || (draft.month.length === 2 && month === 0))
    return { kind: 'invalid', field: 'month', reason: 'month' };
  if (draft.year.length === 4 && year < 1000)
    return { kind: 'invalid', field: 'year', reason: 'year' };
  if (
    draft.day.length < 2 ||
    draft.month.length < 2 ||
    (draft.year.length !== 2 && draft.year.length !== 4)
  )
    return { kind: 'incomplete' };
  const maxDays = new Date(year, month, 0).getDate();
  if (day > maxDays)
    return { kind: 'invalid', field: 'day', reason: 'monthDays', maxDays };
  return {
    kind: 'valid',
    date: createDateWithoutTime(new Date(year, month - 1, day), true),
  };
}


export function parseDatePaste(text: string, format: string): DateDraft | null {
  const value = normalizeDateDigits(text.trim());
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (iso) return { year: iso[1], month: iso[2], day: iso[3] };
  const local = /^(\d{1,4})([/.-])(\d{1,2})\2(\d{1,4})$/.exec(value);
  if (!local) return null;
  const order = dateSegmentOrder(format);
  const pieces = [local[1], local[3], local[4]];
  const result: DateDraft = { day: '', month: '', year: '' };
  for (let i = 0; i < order.length; i++) {
    const field = order[i];
    if (
      field === 'year'
        ? pieces[i].length !== 2 && pieces[i].length !== 4
        : pieces[i].length > 2
    )
      return null;
    result[field] = field === 'year' ? pieces[i] : pieces[i].padStart(2, '0');
  }
  return result;
}
