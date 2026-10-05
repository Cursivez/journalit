import type { CustomLocale } from 'flatpickr/dist/types/locale';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { German } from 'flatpickr/dist/l10n/de';
import { French } from 'flatpickr/dist/l10n/fr';
import { Vietnamese } from 'flatpickr/dist/l10n/vn';
import { Hindi } from 'flatpickr/dist/l10n/hi';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import { Mandarin } from 'flatpickr/dist/l10n/zh';
import { MandarinTraditional } from 'flatpickr/dist/l10n/zh-tw';
import { Japanese } from 'flatpickr/dist/l10n/ja';
import { Korean } from 'flatpickr/dist/l10n/ko';
import { Russian } from 'flatpickr/dist/l10n/ru';
import { Italian } from 'flatpickr/dist/l10n/it';
import { Arabic } from 'flatpickr/dist/l10n/ar';
import { getCurrentLanguage } from '../../lang/helpers';
import {
  getWeekStartDayIndex,
  getWeekStartDaySetting,
} from '../../utils/dateUtils';

const Tamil: CustomLocale = {
  weekdays: {
    shorthand: ['ஞாயி', 'திங்', 'செவ்', 'புத', 'வியா', 'வெள்', 'சனி'],
    longhand: [
      'ஞாயிறு',
      'திங்கள்',
      'செவ்வாய்',
      'புதன்',
      'வியாழன்',
      'வெள்ளி',
      'சனி',
    ],
  },
  months: {
    shorthand: [
      'ஜன',
      'பிப்',
      'மார்',
      'ஏப்',
      'மே',
      'ஜூன்',
      'ஜூலை',
      'ஆக',
      'செப்',
      'அக்',
      'நவ',
      'டிச',
    ],
    longhand: [
      'ஜனவரி',
      'பிப்ரவரி',
      'மார்ச்',
      'ஏப்ரல்',
      'மே',
      'ஜூன்',
      'ஜூலை',
      'ஆகஸ்ட்',
      'செப்டம்பர்',
      'அக்டோபர்',
      'நவம்பர்',
      'டிசம்பர்',
    ],
  },
  firstDayOfWeek: 0,
  rangeSeparator: ' முதல் ',
  weekAbbreviation: 'வா',
  scrollTitle: 'மாற்ற உருட்டவும்',
  toggleTitle: 'மாற்ற கிளிக் செய்யவும்',
  time_24hr: false,
};


const flatpickrLocales: Record<string, CustomLocale> = {
  es: Spanish,
  de: German,
  fr: French,
  vi: Vietnamese,
  hi: Hindi,
  'pt-BR': Portuguese,
  zh: Mandarin,
  'zh-TW': MandarinTraditional,
  ja: Japanese,
  ko: Korean,
  ru: Russian,
  it: Italian,
  ta: Tamil,
  ar: Arabic,
};

export function getDatePickerLocale(): CustomLocale {
  const lang = getCurrentLanguage();
  const firstDayOfWeek = getWeekStartDayIndex(getWeekStartDaySetting());
  return { ...flatpickrLocales[lang], firstDayOfWeek };
}
