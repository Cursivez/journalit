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

type TradeReviewQuestionType = 'text' | 'choice';

export interface TradeReviewChoiceOption {
  id: string;
  label: string;
}

interface TradeReviewQuestionCondition {
  questionId: string;
  optionId: string;
}

export interface TradeReviewQuestionConfig {
  id: string;
  label: string;
  placeholder?: string;
  
  type?: TradeReviewQuestionType;
  
  options?: TradeReviewChoiceOption[];
  
  visibleWhen?: TradeReviewQuestionCondition;
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

function hasWellFormedUnicode(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      if (index + 1 >= value.length) return false;
      const nextCodeUnit = value.charCodeAt(index + 1);
      if (nextCodeUnit < 0xdc00 || nextCodeUnit > 0xdfff) return false;
      index += 1;
    } else if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      return false;
    }
  }
  return true;
}

function isTradeReviewChoiceOption(
  value: unknown
): value is TradeReviewChoiceOption {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'label' in value &&
    typeof value.label === 'string'
  );
}

function isTradeReviewQuestionCondition(
  value: unknown
): value is TradeReviewQuestionCondition {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  return (
    'questionId' in value &&
    typeof value.questionId === 'string' &&
    'optionId' in value &&
    typeof value.optionId === 'string'
  );
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
      typeof value.placeholder === 'string') &&
    (!('type' in value) ||
      value.type === undefined ||
      value.type === 'text' ||
      value.type === 'choice') &&
    (!('options' in value) ||
      value.options === undefined ||
      (Array.isArray(value.options) &&
        value.options.every(isTradeReviewChoiceOption))) &&
    (!('visibleWhen' in value) ||
      value.visibleWhen === undefined ||
      isTradeReviewQuestionCondition(value.visibleWhen))
  );
}

function hasUnambiguousChoiceOptions(
  question: TradeReviewQuestionConfig
): boolean {
  if (question.type !== 'choice') return true;
  if (!question.options || question.options.length === 0) return false;
  const optionIds = question.options.map((option) =>
    normalizeQuestionPart(option.id)
  );
  const optionLabels = question.options.map((option) =>
    normalizeQuestionPart(option.label)
  );
  return (
    optionIds.every(Boolean) &&
    optionIds.every(hasWellFormedUnicode) &&
    optionLabels.every(Boolean) &&
    new Set(optionIds).size === optionIds.length &&
    new Set(optionLabels).size === optionLabels.length
  );
}

function isChoiceTradeReviewQuestion(
  question: TradeReviewQuestionConfig
): boolean {
  return (
    question.type === 'choice' &&
    (question.options?.some((option) => option.label.trim() !== '') ?? false)
  );
}

function hasConditionalCycle(
  question: TradeReviewQuestionConfig,
  questionsById: Map<string, TradeReviewQuestionConfig>
): boolean {
  const visited = new Set<string>([question.id]);
  let current = question;
  while (current.visibleWhen) {
    const parent = questionsById.get(current.visibleWhen.questionId);
    if (!parent) return false;
    if (visited.has(parent.id)) return true;
    visited.add(parent.id);
    current = parent;
  }
  return false;
}

export function wouldCreateTradeReviewQuestionCycle(
  questions: TradeReviewQuestionConfig[],
  questionId: string,
  candidateParentId: string
): boolean {
  const questionsById = new Map(
    questions.map((question) => [question.id, question])
  );
  const visited = new Set<string>();
  let current = questionsById.get(candidateParentId);
  while (current) {
    if (current.id === questionId) return true;
    if (visited.has(current.id)) return false;
    visited.add(current.id);
    current = current.visibleWhen
      ? questionsById.get(current.visibleWhen.questionId)
      : undefined;
  }
  return false;
}


export function resolveVisibleTradeReviewQuestions(
  questions: TradeReviewQuestionConfig[],
  getAnswer: (question: TradeReviewQuestionConfig) => string,
  getSelectedOptionId?: (
    question: TradeReviewQuestionConfig
  ) => string | undefined
): TradeReviewQuestionConfig[] {
  const questionsById = new Map(
    questions.map((question) => [question.id, question])
  );
  const visibility = new Map<string, boolean>();
  const resolveVisibility = (question: TradeReviewQuestionConfig): boolean => {
    const cached = visibility.get(question.id);
    if (cached !== undefined) return cached;
    if (hasConditionalCycle(question, questionsById)) return true;
    const condition = question.visibleWhen;
    if (!condition || condition.questionId === question.id) {
      visibility.set(question.id, true);
      return true;
    }
    const parent = questionsById.get(condition.questionId);
    if (!parent || !isChoiceTradeReviewQuestion(parent)) {
      visibility.set(question.id, true);
      return true;
    }
    const option = parent.options?.find(
      (candidate) => candidate.id === condition.optionId
    );
    if (!option) {
      visibility.set(question.id, true);
      return true;
    }
    const isVisible =
      resolveVisibility(parent) &&
      (getSelectedOptionId?.(parent) === condition.optionId ||
        (!getSelectedOptionId?.(parent) &&
          getAnswer(parent).trim() === option.label.trim()));
    visibility.set(question.id, isVisible);
    return isVisible;
  };
  return questions.filter(resolveVisibility);
}


export function resolveTradeReviewQuestionDepths(
  questions: TradeReviewQuestionConfig[]
): Map<string, number> {
  const questionsById = new Map(
    questions.map((question) => [question.id, question])
  );
  const depths = new Map<string, number>();

  questions.forEach((question) => {
    if (hasConditionalCycle(question, questionsById)) {
      depths.set(question.id, 0);
      return;
    }
    let depth = 0;
    let current = question;
    while (current.visibleWhen) {
      const parent = questionsById.get(current.visibleWhen.questionId);
      const hasReferencedOption = parent?.options?.some(
        (option) => option.id === current.visibleWhen?.optionId
      );
      if (
        !parent ||
        !isChoiceTradeReviewQuestion(parent) ||
        !hasReferencedOption
      ) {
        depth = 0;
        break;
      }
      depth += 1;
      current = parent;
    }
    depths.set(question.id, depth);
  });
  return depths;
}

export function orderTradeReviewQuestionsByHierarchy(
  questions: TradeReviewQuestionConfig[]
): TradeReviewQuestionConfig[] {
  const depths = resolveTradeReviewQuestionDepths(questions);
  const childrenByParentId = new Map<string, TradeReviewQuestionConfig[]>();
  const roots: TradeReviewQuestionConfig[] = [];
  for (const question of questions) {
    const parentId = question.visibleWhen?.questionId;
    if ((depths.get(question.id) ?? 0) === 0 || !parentId) {
      roots.push(question);
      continue;
    }
    const children = childrenByParentId.get(parentId) ?? [];
    children.push(question);
    childrenByParentId.set(parentId, children);
  }

  const ordered: TradeReviewQuestionConfig[] = [];
  const appendQuestion = (question: TradeReviewQuestionConfig): void => {
    ordered.push(question);
    (childrenByParentId.get(question.id) ?? []).forEach(appendQuestion);
  };
  roots.forEach(appendQuestion);
  return ordered;
}

function normalizeTradeReviewQuestionForSerialization(
  question: TradeReviewQuestionConfig
): TradeReviewQuestionConfig | undefined {
  const id = normalizeQuestionPart(question.id);
  const label = normalizeQuestionPart(question.label);
  if (!id || !label) return undefined;
  const normalized: TradeReviewQuestionConfig = { id, label };
  const placeholder = question.placeholder
    ? normalizeQuestionPart(question.placeholder)
    : '';
  if (placeholder) normalized.placeholder = placeholder;
  if (question.type === 'choice') {
    normalized.type = 'choice';
    normalized.options = (question.options ?? []).flatMap((option) => {
      const optionId = normalizeQuestionPart(option.id);
      const optionLabel = normalizeQuestionPart(option.label);
      return optionId && optionLabel
        ? [{ id: optionId, label: optionLabel }]
        : [];
    });
  }
  if (question.visibleWhen) {
    const questionId = normalizeQuestionPart(question.visibleWhen.questionId);
    const optionId = normalizeQuestionPart(question.visibleWhen.optionId);
    if (questionId && optionId && questionId !== id) {
      normalized.visibleWhen = { questionId, optionId };
    }
  }
  return normalized;
}

function requiresStructuredEncoding(
  question: TradeReviewQuestionConfig
): boolean {
  return question.type !== undefined || question.visibleWhen !== undefined;
}

export function serializeTradeReviewQuestions(
  value: unknown
): string | undefined {
  if (!Array.isArray(value)) return undefined;
  if (value.length === 0) return '[]';

  const normalizedQuestions = value.flatMap(
    (item: unknown): TradeReviewQuestionConfig[] => {
      if (!isTradeReviewQuestionConfig(item)) return [];
      const normalized = normalizeTradeReviewQuestionForSerialization(item);
      return normalized ? [normalized] : [];
    }
  );
  if (normalizedQuestions.length === 0) return undefined;

  if (normalizedQuestions.some(requiresStructuredEncoding)) {
    return `v3:${encodeURIComponent(JSON.stringify(normalizedQuestions))}`;
  }

  const questions = normalizedQuestions.map((question) => [
    question.id,
    question.label,
    question.placeholder ?? '',
  ]);
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

function normalizeTradeReviewQuestionGraph(
  value: unknown,
  allowEmpty: boolean
): TradeReviewQuestionConfig[] | undefined {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) {
    return undefined;
  }
  const questions: TradeReviewQuestionConfig[] = [];
  const questionIds = new Set<string>();
  for (const question of value) {
    if (
      !isTradeReviewQuestionConfig(question) ||
      !hasUnambiguousChoiceOptions(question)
    ) {
      return undefined;
    }
    const questionId = normalizeQuestionPart(question.id);
    const questionLabel = normalizeQuestionPart(question.label);
    if (
      !questionId ||
      !hasWellFormedUnicode(questionId) ||
      !questionLabel ||
      questionIds.has(questionId)
    ) {
      return undefined;
    }
    if (question.visibleWhen) {
      const parentId = normalizeQuestionPart(question.visibleWhen.questionId);
      const optionId = normalizeQuestionPart(question.visibleWhen.optionId);
      if (
        !parentId ||
        !hasWellFormedUnicode(parentId) ||
        !optionId ||
        !hasWellFormedUnicode(optionId) ||
        parentId === questionId
      ) {
        return undefined;
      }
    }
    const normalized = normalizeTradeReviewQuestionForSerialization(question);
    if (!normalized) return undefined;
    questionIds.add(questionId);
    questions.push(normalized);
  }

  const questionsById = new Map(
    questions.map((question) => [question.id, question])
  );
  for (const question of questions) {
    const condition = question.visibleWhen;
    if (!condition) continue;
    const parent = questionsById.get(condition.questionId);
    if (!parent || !isChoiceTradeReviewQuestion(parent)) return undefined;
    if (!parent.options?.some((option) => option.id === condition.optionId)) {
      return undefined;
    }
    if (hasConditionalCycle(question, questionsById)) return undefined;
  }
  return questions;
}

export function isValidTradeReviewQuestionGraph(value: unknown): boolean {
  return normalizeTradeReviewQuestionGraph(value, true) !== undefined;
}

function parseStructuredTradeReviewQuestions(
  serialized: string
): TradeReviewQuestionConfig[] | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(decodeURIComponent(serialized));
  } catch {
    return undefined;
  }
  return normalizeTradeReviewQuestionGraph(parsed, false);
}

export function parseTradeReviewQuestions(
  value: string
): TradeReviewQuestionConfig[] | undefined {
  if (value.trim() === '[]') return [];
  if (value.startsWith('v3:')) {
    return parseStructuredTradeReviewQuestions(value.slice(3));
  }

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
