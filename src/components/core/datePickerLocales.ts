import { t, type TranslationKey } from '../../lang/helpers';
import {
  getWeekStartDayIndex,
  getWeekStartDaySetting,
} from '../../utils/dateUtils';


const WEEKDAY_SHORT_KEYS = [
  'calendar.day.sun',
  'calendar.day.mon',
  'calendar.day.tue',
  'calendar.day.wed',
  'calendar.day.thu',
  'calendar.day.fri',
  'calendar.day.sat',
] as const satisfies readonly TranslationKey[];

const MONTH_LONG_KEYS = [
  'common.month.january',
  'common.month.february',
  'common.month.march',
  'common.month.april',
  'common.month.may',
  'common.month.june',
  'common.month.july',
  'common.month.august',
  'common.month.september',
  'common.month.october',
  'common.month.november',
  'common.month.december',
] as const satisfies readonly TranslationKey[];

export interface DatePickerLocale {
  
  weekdaysShort: readonly string[];
  
  months: readonly string[];
  
  firstDayOfWeek: number;
  labels: {
    year: string;
    hour: string;
    minute: string;
    second: string;
    previousMonth: string;
    nextMonth: string;
  };
}


export function getDatePickerLocale(): DatePickerLocale {
  return {
    weekdaysShort: WEEKDAY_SHORT_KEYS.map((key) => t(key)),
    months: MONTH_LONG_KEYS.map((key) => t(key)),
    firstDayOfWeek: getWeekStartDayIndex(getWeekStartDaySetting()),
    labels: {
      year: t('common.year'),
      hour: t('datepicker.aria.hour'),
      minute: t('datepicker.aria.minute'),
      second: t('datepicker.aria.second'),
      previousMonth: t('datepicker.aria.previous-month'),
      nextMonth: t('datepicker.aria.next-month'),
    },
  };
}
