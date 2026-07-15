import { getTranslationsAcrossLocales, t } from '../../../lang/helpers';
import type { TranslationKey } from '../../../lang/locale/en';

export type TradeReviewCardField =
  | 'entry'
  | 'exit'
  | 'duration'
  | 'risk'
  | 'positionSize'
  | 'stopLoss'
  | 'takeProfit'
  | 'fees'
  | 'commission'
  | 'mae'
  | 'mfe'
  | 'account'
  | 'setup'
  | 'mistakes'
  | 'tags'
  | 'thesis'
  | 'notes'
  | 'customFields';

export interface TradeReviewQuestionConfig {
  id: string;
  label: string;
  placeholder?: string;
}

export interface TradeReviewWidgetConfig {
  defaultExpanded?: boolean;
  showReviewedTrades?: boolean;
  showOpenTrades?: boolean;
  fields?: TradeReviewCardField[];
  primaryMetrics?: TradeReviewCardField[];
  classificationFields?: TradeReviewCardField[];
  moreContextFields?: TradeReviewCardField[];
  showImages?: boolean;
  winQuestions?: TradeReviewQuestionConfig[];
  lossQuestions?: TradeReviewQuestionConfig[];
  breakevenQuestions?: TradeReviewQuestionConfig[];
  openQuestions?: TradeReviewQuestionConfig[];
}

export type TradeReviewOutcome = 'win' | 'loss' | 'breakeven' | 'open';

export const TRADE_REVIEW_QUESTION_CONFIG_KEY_LIST = [
  'winQuestions',
  'lossQuestions',
  'breakevenQuestions',
  'openQuestions',
] as const;

export type TradeReviewQuestionConfigKey =
  (typeof TRADE_REVIEW_QUESTION_CONFIG_KEY_LIST)[number];

export const TRADE_REVIEW_QUESTION_CONFIG_KEYS: Record<
  TradeReviewOutcome,
  TradeReviewQuestionConfigKey
> = {
  win: 'winQuestions',
  loss: 'lossQuestions',
  breakeven: 'breakevenQuestions',
  open: 'openQuestions',
};

const DEFAULT_WIN_QUESTIONS: TradeReviewQuestionConfig[] = [
  {
    id: 'win-what-worked',
    label: t('widget.trade-review.question.win-what-worked'),
    placeholder: t('widget.trade-review.placeholder.win-what-worked'),
  },
  {
    id: 'win-repeatable',
    label: t('widget.trade-review.question.win-repeatable'),
    placeholder: t('widget.trade-review.placeholder.win-repeatable'),
  },
  {
    id: 'win-key-lesson',
    label: t('widget.trade-review.question.key-lesson'),
    placeholder: t('widget.trade-review.placeholder.key-lesson'),
  },
];

const DEFAULT_LOSS_QUESTIONS: TradeReviewQuestionConfig[] = [
  {
    id: 'loss-what-went-wrong',
    label: t('widget.trade-review.question.loss-what-went-wrong'),
    placeholder: t('widget.trade-review.placeholder.loss-what-went-wrong'),
  },
  {
    id: 'loss-valid-or-mistake',
    label: t('widget.trade-review.question.loss-valid-or-mistake'),
    placeholder: t('widget.trade-review.placeholder.loss-valid-or-mistake'),
  },
  {
    id: 'loss-avoid-next-time',
    label: t('widget.trade-review.question.loss-avoid-next-time'),
    placeholder: t('widget.trade-review.placeholder.loss-avoid-next-time'),
  },
];

const DEFAULT_BREAKEVEN_QUESTIONS: TradeReviewQuestionConfig[] = [
  {
    id: 'be-managed-correctly',
    label: t('widget.trade-review.question.be-managed-correctly'),
    placeholder: t('widget.trade-review.placeholder.be-managed-correctly'),
  },
  {
    id: 'be-key-lesson',
    label: t('widget.trade-review.question.key-lesson'),
    placeholder: t('widget.trade-review.placeholder.key-lesson'),
  },
];

const DEFAULT_OPEN_QUESTIONS: TradeReviewQuestionConfig[] = [];
const DEFAULT_TRADE_REVIEW_QUESTION_LABEL_KEY_BY_ID = new Map<
  string,
  TranslationKey
>([
  ['win-what-worked', 'widget.trade-review.question.win-what-worked'],
  ['win-repeatable', 'widget.trade-review.question.win-repeatable'],
  ['win-key-lesson', 'widget.trade-review.question.key-lesson'],
  ['loss-what-went-wrong', 'widget.trade-review.question.loss-what-went-wrong'],
  [
    'loss-valid-or-mistake',
    'widget.trade-review.question.loss-valid-or-mistake',
  ],
  ['loss-avoid-next-time', 'widget.trade-review.question.loss-avoid-next-time'],
  ['be-managed-correctly', 'widget.trade-review.question.be-managed-correctly'],
  ['be-key-lesson', 'widget.trade-review.question.key-lesson'],
]);
let defaultTradeReviewQuestionLabelsById: Map<string, string[]> | null = null;

export function getAllLocalizedDefaultTradeReviewQuestionLabels(
  questionId: string
): string[] {
  if (!defaultTradeReviewQuestionLabelsById) {
    const translationsByKey = getTranslationsAcrossLocales(
      Array.from(
        new Set(DEFAULT_TRADE_REVIEW_QUESTION_LABEL_KEY_BY_ID.values())
      )
    );
    defaultTradeReviewQuestionLabelsById = new Map(
      Array.from(DEFAULT_TRADE_REVIEW_QUESTION_LABEL_KEY_BY_ID, ([id, key]) => [
        id,
        translationsByKey.get(key) ?? [],
      ])
    );
  }
  return defaultTradeReviewQuestionLabelsById.get(questionId) ?? [];
}

function getDefaultTradeReviewQuestions(
  outcome: TradeReviewOutcome
): TradeReviewQuestionConfig[] {
  switch (outcome) {
    case 'win':
      return DEFAULT_WIN_QUESTIONS;
    case 'loss':
      return DEFAULT_LOSS_QUESTIONS;
    case 'breakeven':
      return DEFAULT_BREAKEVEN_QUESTIONS;
    case 'open':
      return DEFAULT_OPEN_QUESTIONS;
  }
}

export function resolveTradeReviewQuestions(
  config: TradeReviewWidgetConfig,
  outcome: TradeReviewOutcome
): TradeReviewQuestionConfig[] {
  return (
    config[TRADE_REVIEW_QUESTION_CONFIG_KEYS[outcome]] ??
    getDefaultTradeReviewQuestions(outcome)
  );
}

function normalizeQuestionPart(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function isTradeReviewQuestionConfig(
  value: unknown
): value is TradeReviewQuestionConfig {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'label' in value &&
    typeof value.label === 'string' &&
    (!('placeholder' in value) ||
      value.placeholder === undefined ||
      typeof value.placeholder === 'string')
  );
}

export function serializeTradeReviewQuestions(
  value: unknown
): string | undefined {
  if (!Array.isArray(value)) return undefined;
  if (value.length === 0) return '[]';

  const questions = value.flatMap((item: unknown): string[][] => {
    if (!isTradeReviewQuestionConfig(item)) return [];
    const id = normalizeQuestionPart(item.id);
    const label = normalizeQuestionPart(item.label);
    const placeholder = item.placeholder
      ? normalizeQuestionPart(item.placeholder)
      : '';
    if (!id || !label) return [];
    return [[id, label, placeholder]];
  });

  if (questions.length === 0) return undefined;
  const requiresVersionedEncoding = questions.some((question) =>
    question.some((part) => /[|;\\]/.test(part))
  );
  const serialized = questions
    .map((question) =>
      question
        .map((part) =>
          requiresVersionedEncoding ? encodeURIComponent(part) : part
        )
        .join('|')
    )
    .join(';');
  return requiresVersionedEncoding ? `v2:${serialized}` : serialized;
}

export function parseTradeReviewQuestions(
  value: string
): TradeReviewQuestionConfig[] | undefined {
  if (value.trim() === '[]') return [];

  const isVersioned = value.startsWith('v2:');
  const serializedQuestions = isVersioned ? value.slice(3) : value;

  const questions = serializedQuestions
    .split(';')
    .flatMap((serializedQuestion): TradeReviewQuestionConfig[] => {
      let fields = serializedQuestion.split('|').map((part) => part.trim());
      if (isVersioned) {
        try {
          fields = fields.map((part) => decodeURIComponent(part));
        } catch {
          return [];
        }
      }
      const [id = '', label = '', placeholder = ''] = fields;
      if (!id || !label) return [];
      return [{ id, label, placeholder: placeholder || undefined }];
    });
  return questions.length > 0 ? questions : undefined;
}
