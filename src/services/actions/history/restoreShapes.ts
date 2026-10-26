import { isRecord } from '../../agent/configuration/configurationPrimitives';
import { KEY_EVENT_COLORS, KEY_EVENT_DAYS } from '../../../utils/keyEvents';
import { KEY_EVENT_CURRENCIES } from '../../../components/reviewV2/widgets/keyEventFields';
import { MAX_TEXT, textLength } from '../domains/tradeUpdateChanges';
import { MAX_PRICE, MAX_TARGETS } from '../domains/tradePlannedTargets';



function record(value: unknown): Readonly<Record<string, unknown>> {
  return isRecord(value) ? value : {};
}

type FieldCheck = (value: unknown) => boolean;


export interface InputShape {
  readonly required: Readonly<Record<string, FieldCheck>>;
  readonly optional?: Readonly<Record<string, FieldCheck>>;
  
  readonly needsOptional?: boolean;
}

export function isText(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

export function isTexts(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= 50 &&
    value.every(isText)
  );
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isBoolean(value: unknown): boolean {
  return typeof value === 'boolean';
}

function oneOf(...values: readonly unknown[]): FieldCheck {
  return (value) => values.includes(value);
}


function listOf(check: FieldCheck, max: number): FieldCheck {
  return (value) =>
    Array.isArray(value) && value.length <= max && value.every(check);
}

function isNumber(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value);
}

function orNull(check: FieldCheck): FieldCheck {
  return (value) => value === null || check(value);
}

export function isReview(value: unknown): boolean {
  const review = record(value);
  return (
    Object.keys(review).length === 2 &&
    typeof review.period === 'string' &&
    typeof review.period_start === 'string'
  );
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function isDate(value: unknown): boolean {
  return typeof value === 'string' && DATE.test(value);
}

function hasOwn(target: object, key: string): boolean {
  return Object.keys(target).includes(key);
}


export function matchesShape(shape: InputShape, value: unknown): boolean {
  if (!isRecord(value)) return false;
  const optional = shape.optional ?? {};
  const keys = Object.keys(value);
  const optionalCount = keys.filter((key) => hasOwn(optional, key)).length;
  
  return (
    Object.keys(shape.required).every((key) => hasOwn(value, key)) &&
    keys.every((key) =>
      hasOwn(shape.required, key)
        ? shape.required[key](value[key])
        : hasOwn(optional, key) && optional[key](value[key])
    ) &&
    (!shape.needsOptional || optionalCount > 0)
  );
}

export function shaped(shape: InputShape): FieldCheck {
  return (value) => matchesShape(shape, value);
}


function isBoundedText(value: unknown, minimum: number): boolean {
  if (typeof value !== 'string') return false;
  const length = textLength(value);
  return length >= minimum && length <= MAX_TEXT;
}

function inRange(minimum: number, maximum: number): FieldCheck {
  return (value) =>
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value > minimum &&
    value <= maximum;
}


const plannedTarget: FieldCheck = (value) =>
  shaped({
    required: {
      price: (price) =>
        typeof price === 'number' &&
        Number.isFinite(price) &&
        Math.abs(price) <= MAX_PRICE,
    },
    optional: {
      close_percent: inRange(0, 100),
      size: inRange(0, 1_000_000_000_000),
    },
  })(value) &&
  !(hasOwn(record(value), 'close_percent') && hasOwn(record(value), 'size'));


export const plannedTargets: FieldCheck = (value) =>
  Array.isArray(value) &&
  value.length <= MAX_TARGETS &&
  value.every(plannedTarget);

export const tradeFieldsRestore = shaped({
  required: {},
  optional: {
    setup_id: orNull(isText),
    account_id: orNull(isText),
    direction: (value) => value === 'long' || value === 'short',
    stop_loss: orNull(isNumber),
    take_profit: orNull(isNumber),
    risk_amount: orNull(isNumber),
    commission: orNull(isNumber),
    fees: orNull(isNumber),
    swap: orNull(isNumber),
    missed_reason: orNull(isText),
    thesis: orNull((value) => isBoundedText(value, 1)),
    
    reviewed: (value) => value === false,
    notes: (value) => isBoundedText(value, 0),
  },
  needsOptional: true,
});

export const customFieldRestore = shaped({
  required: {
    field_id: isText,
    value: (value) =>
      value === null || isText(value) || isNumber(value) || isTexts(value),
  },
});

const accountDrawdown: FieldCheck = (value) =>
  shaped({ required: { type: (type) => type === 'none' } })(value) ||
  shaped({
    required: {
      type: (type) => type === 'fixed' || type === 'eod_trailing',
      amount: isNumber,
    },
  })(value) ||
  shaped({
    required: {
      type: (type) => type === 'manual',
      amount: isNumber,
      snapshots: (snapshots) =>
        Array.isArray(snapshots) &&
        snapshots.every(
          shaped({
            required: { date: isDate, limit: isNumber },
            optional: { note: (note) => typeof note === 'string' },
          })
        ),
    },
  })(value);

export const accountFieldsRestore = shaped({
  required: {},
  optional: {
    account_type: isText,
    currency: isText,
    created_date: isDate,
    initial_balance: isNumber,
    drawdown: accountDrawdown,
    profit_target: orNull(
      shaped({
        required: {
          type: (type) => type === 'absolute' || type === 'percentage',
          amount: isNumber,
        },
        optional: { target_date: isDate },
      })
    ),
    monthly_cost: isNumber,
  },
  needsOptional: true,
});


function isLinkedNoteKey(value: unknown): boolean {
  return typeof value === 'string' && /^note_[1-9]\d*$/.test(value);
}

const setupLinkedNote: FieldCheck = (value) =>
  shaped({ required: { trade_id: isText } })(value) ||
  shaped({ required: { review: isReview } })(value) ||
  shaped({ required: { setup_id: isText } })(value) ||
  shaped({ required: { key: isLinkedNoteKey } })(value);

export const setupFieldsRestore = shaped({
  required: {},
  optional: {
    status: oneOf('testing', 'active', 'archived'),
    direction: orNull(oneOf('long', 'short', 'both')),
    color: orNull(isText),
    tags: listOf(isText, 50),
    preferred_sessions: listOf(isText, 50),
    preferred_timeframes: listOf(isText, 50),
    preferred_tickers: listOf(isText, 50),
    playbook: isString,
    rule_groups: listOf(shaped({ required: { id: isText, name: isText } }), 50),
    rules: listOf(
      shaped({
        required: {
          label: isText,
          category: oneOf(
            'context',
            'entry',
            'exit',
            'risk',
            'management',
            'invalidation',
            'psychology'
          ),
          required: isBoolean,
        },
        optional: { description: isString, group_id: isText },
      }),
      50
    ),
    linked_notes: listOf(setupLinkedNote, 100),
  },
  needsOptional: true,
});

export const customFieldSettingsRestore = shaped({
  required: {},
  optional: {
    label: isText,
    options: listOf(
      shaped({ required: { value: isText, label: isText } }),
      200
    ),
    validation: shaped({
      required: {},
      optional: {
        required: isBoolean,
        min: isNumber,
        max: isNumber,
        min_length: isNumber,
        max_length: isNumber,
        pattern: isText,
      },
    }),
    placeholder: orNull(isString),
    helper_text: orNull(isString),
    allow_create_options: isBoolean,
  },
  needsOptional: true,
});


function isKeyEventNotes(value: unknown): boolean {
  return typeof value === 'string' && Array.from(value).length <= 2000;
}

function isTimeOfDay(value: unknown): boolean {
  return (
    typeof value === 'string' && /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/.test(value)
  );
}

export const keyEventFieldsRestore = shaped({
  required: {},
  optional: {
    event: isText,
    day: orNull(oneOf(...KEY_EVENT_DAYS)),
    notes: isKeyEventNotes,
    color: oneOf(...KEY_EVENT_COLORS),
    currency: orNull(oneOf(...KEY_EVENT_CURRENCIES)),
    time: orNull(isTimeOfDay),
  },
  needsOptional: true,
});

const doneItem = shaped({ required: { text: isString, done: isBoolean } });
const keyLevel = shaped({
  required: {
    price: isString,
    importance: orNull(oneOf('High', 'Medium', 'Low')),
  },
});
const grade = orNull(
  oneOf('A', 'B', 'C', 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)
);

export const reviewContentRestore = shaped({
  required: {},
  optional: {
    summary: isString,
    answers: (value) =>
      Array.isArray(value) &&
      value.length > 0 &&
      listOf(
        shaped({ required: { question_id: isText, answer: isString } }),
        100
      )(value),
    goals: listOf(doneItem, 100),
    checklist: listOf(doneItem, 100),
    key_levels: shaped({
      required: {
        support: listOf(keyLevel, 50),
        resistance: listOf(keyLevel, 50),
      },
    }),
    grades: shaped({
      required: {},
      optional: { mental: grade, technical: grade },
      needsOptional: true,
    }),
    reviewed: isBoolean,
  },
  needsOptional: true,
});


const imageAnnotationRestore: FieldCheck = shaped({
  required: { media_id: isText, restore_entry: orNull(isRecord) },
});

export const imageAnnotationsRestore: FieldCheck = (value) =>
  Array.isArray(value) &&
  value.length > 0 &&
  listOf(imageAnnotationRestore, 20)(value);
