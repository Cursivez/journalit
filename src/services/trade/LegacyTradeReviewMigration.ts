import {
  isTradeReviewQuestionConfig,
  parseTradeReviewQuestions,
  serializeTradeReviewQuestions,
  TRADE_REVIEW_QUESTION_CONFIG_KEY_LIST,
  type TradeReviewQuestionConfig,
  type TradeReviewWidgetConfig,
} from '../../components/reviewV2/widgets/tradeReviewConfig';

import type { ReviewTemplate } from '../../types/reviewV2';
import {
  getCanonicalTradeReviewQuestionId,
  getTradeReviewQuestionIdCandidates,
  getTradeReviewQuestionLabel,
} from './core/TradeReviewMarkdownCodec';

export const TRADE_REVIEW_LAYOUT_MIGRATION_VERSION =
  '2026-07-trade-review-layout-v2';
export const MIGRATED_TRADE_REVIEW_DRC_TEMPLATE_ID =
  'journalit-migrated-trade-review-drc-v1';

const LEGACY_QUESTION_CONFIG_KEYS = [
  'winQuestions',
  'lossQuestions',
  'breakevenQuestions',
] as const;
const LEGACY_QUESTION_CONFIG_KEY_SET = new Set<string>(
  TRADE_REVIEW_QUESTION_CONFIG_KEY_LIST
);

type LegacyQuestionConfigKey = (typeof LEGACY_QUESTION_CONFIG_KEYS)[number];
type LegacyWidgetConfig = Partial<
  Pick<TradeReviewWidgetConfig, LegacyQuestionConfigKey>
>;

interface LegacyReviewSection {
  id: string;
  title: string;
  type: 'header' | 'checkbox' | 'textarea' | 'checkboxList';
  content?: string;
  items?: string[];
  placeholder?: string;
}

interface LegacyQuestionSource {
  sections: LegacyReviewSection[];
}

interface LegacyTradeReviewMigrationPlan {
  widgetConfig: LegacyWidgetConfig;
  labelsByQuestionId: Map<string, string>;
  labelsByTemplateId: Map<string, Map<string, string>>;
}

interface HistoricalDrcWidgetMigrationResult {
  content: string;
  status: 'inserted' | 'updated' | 'unchanged' | 'conflict';
}

type DefaultDrcTemplateMigrationResult =
  | { status: 'updated'; template: ReviewTemplate }
  | { status: 'unchanged' | 'conflict' };

const RELEASED_BUILT_IN_TRADE_TEMPLATE = {
  id: 'builtin-trade-standard',
  sections: {
    review: {
      show: 'always',
      sections: [
        {
          id: 'what-went-well',
          title: '**What went well?**',
          type: 'textarea',
          placeholder: 'What did you do right in this trade?',
        },
        {
          id: 'what-to-improve',
          title: '**What could be improved?**',
          type: 'textarea',
          placeholder: 'What would you do differently next time?',
        },
        {
          id: 'key-lesson',
          title: '**Key Lesson**',
          type: 'textarea',
          placeholder: 'What is the main takeaway from this trade?',
        },
      ],
      winSections: [
        {
          id: 'win-what-worked',
          title: '**What worked?**',
          type: 'textarea',
          placeholder:
            'What aspects of your strategy or execution led to this win?',
        },
        {
          id: 'win-repeatable',
          title: '**Is this repeatable?**',
          type: 'textarea',
          placeholder:
            'Can you consistently replicate what made this trade successful?',
        },
      ],
      lossSections: [
        {
          id: 'loss-what-happened',
          title: '**What went wrong?**',
          type: 'textarea',
          placeholder:
            'What caused this loss? Was it execution, analysis, or market conditions?',
        },
        {
          id: 'loss-avoid-next-time',
          title: '**How to avoid next time?**',
          type: 'textarea',
          placeholder:
            'What specific changes will you make to prevent this type of loss?',
        },
        {
          id: 'loss-key-lesson',
          title: '**Key Lesson**',
          type: 'textarea',
          placeholder: 'What is the main takeaway from this loss?',
        },
      ],
    },
  },
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getRecord(
  value: unknown,
  key: string
): Record<string, unknown> | null {
  const candidate = isRecord(value) ? value[key] : undefined;
  return isRecord(candidate) ? candidate : null;
}

function getUnknownArray(value: unknown): unknown[] {
  return Array.isArray(value) ? (value as unknown[]) : [];
}

function getLegacyReviewSection(value: unknown): LegacyReviewSection | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== 'string' || typeof value.type !== 'string') {
    return null;
  }
  if (
    value.type !== 'header' &&
    value.type !== 'checkbox' &&
    value.type !== 'textarea' &&
    value.type !== 'checkboxList'
  ) {
    return null;
  }

  const items = Array.isArray(value.items)
    ? value.items.filter((item): item is string => typeof item === 'string')
    : undefined;

  return {
    id: value.id,
    title: typeof value.title === 'string' ? value.title : '',
    type: value.type,
    content: typeof value.content === 'string' ? value.content : undefined,
    items,
    placeholder:
      typeof value.placeholder === 'string' ? value.placeholder : undefined,
  };
}

function getLegacySectionList(
  review: Record<string, unknown>,
  key: string
): LegacyReviewSection[] | undefined {
  if (!Object.prototype.hasOwnProperty.call(review, key)) return undefined;
  const value = review[key];
  if (!Array.isArray(value)) return undefined;

  return value.flatMap((section): LegacyReviewSection[] => {
    const normalized = getLegacyReviewSection(section);
    return normalized ? [normalized] : [];
  });
}

function stripLegacyMarkdown(value: string | undefined): string {
  if (!value) return '';
  return value
    .replace(/[*_~`]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLegacyQuestionId(section: LegacyReviewSection): string {
  if (section.type === 'checkbox' || section.type === 'checkboxList') {
    return getCanonicalTradeReviewQuestionId(`${section.id}-checkboxes`);
  }
  return getCanonicalTradeReviewQuestionId(section.id);
}

function getLegacyQuestionLabel(
  section: LegacyReviewSection,
  questionId: string
): string {
  if (section.type === 'checkbox') {
    const content = stripLegacyMarkdown(section.content);
    if (content) return content;
  }

  const title = stripLegacyMarkdown(section.title);
  if (title) return title;

  if (section.type === 'textarea') {
    const placeholder = stripLegacyMarkdown(section.placeholder);
    if (placeholder) return placeholder;
  }

  return getTradeReviewQuestionLabel(questionId);
}

function convertLegacySections(
  source: LegacyQuestionSource,
  labelsByQuestionId: Map<string, string>
): TradeReviewQuestionConfig[] {
  const questions: TradeReviewQuestionConfig[] = [];
  const seenIds = new Set<string>();

  for (const section of source.sections) {
    if (section.type === 'header') continue;
    const id = getLegacyQuestionId(section);
    if (seenIds.has(id)) continue;
    seenIds.add(id);

    const label = getLegacyQuestionLabel(section, id);
    const placeholder =
      section.type === 'textarea'
        ? stripLegacyMarkdown(section.placeholder)
        : '';
    questions.push({
      id,
      label,
      ...(placeholder ? { placeholder } : {}),
    });

    const sourceIds = [
      section.id,
      ...(section.type === 'checkbox' || section.type === 'checkboxList'
        ? [`${section.id}-checkboxes`]
        : []),
      ...getTradeReviewQuestionIdCandidates(id),
    ];
    for (const sourceId of sourceIds) {
      labelsByQuestionId.set(sourceId, label);
    }
  }

  return questions;
}

function getLegacyTemplateReview(
  template: unknown
): Record<string, unknown> | null {
  return getRecord(getRecord(template, 'sections'), 'review');
}

function getLegacyTemplateSources(
  template: unknown
): Partial<Record<LegacyQuestionConfigKey, LegacyQuestionSource>> {
  const review = getLegacyTemplateReview(template);
  if (!review || review.show === 'never') return {};

  const defaultSections = getLegacySectionList(review, 'sections');
  if (review.show === 'always') {
    const winSections = getLegacySectionList(review, 'winSections');
    const lossSections = getLegacySectionList(review, 'lossSections');
    return {
      ...(winSections !== undefined || defaultSections !== undefined
        ? {
            winQuestions: {
              sections: winSections ?? defaultSections ?? [],
            },
            breakevenQuestions: {
              sections: winSections ?? defaultSections ?? [],
            },
          }
        : {}),
      ...(lossSections !== undefined || defaultSections !== undefined
        ? {
            lossQuestions: {
              sections: lossSections ?? defaultSections ?? [],
            },
          }
        : {}),
    };
  }

  return defaultSections !== undefined
    ? {
        lossQuestions: {
          sections: defaultSections,
        },
      }
    : {};
}

function getLegacyTemplateCatalogSources(
  template: unknown
): LegacyQuestionSource[] {
  const review = getLegacyTemplateReview(template);
  if (!review) return [];

  return ['sections', 'winSections', 'lossSections'].flatMap(
    (key): LegacyQuestionSource[] => {
      const sections = getLegacySectionList(review, key);
      return sections === undefined ? [] : [{ sections }];
    }
  );
}

function getLegacyGlobalLossSource(
  settings: unknown,
  includeDisabled: boolean
): LegacyQuestionSource | undefined {
  const trade = getRecord(settings, 'trade');
  const lossReview = getRecord(trade, 'lossReview');
  if (!lossReview || (!includeDisabled && lossReview.enabled === false)) {
    return undefined;
  }
  const sections = getLegacySectionList(lossReview, 'sections');
  return sections === undefined ? undefined : { sections };
}

export function buildLegacyTradeReviewMigrationPlan(
  settings: unknown
): LegacyTradeReviewMigrationPlan {
  const labelsByQuestionId = new Map<string, string>();
  const labelsByTemplateId = new Map<string, Map<string, string>>();
  const reviewV2 = getRecord(settings, 'reviewV2');
  const savedTemplates = getUnknownArray(reviewV2?.tradeTemplates);
  const availableTemplates = [
    RELEASED_BUILT_IN_TRADE_TEMPLATE,
    ...savedTemplates,
  ];
  const templates = getRecord(settings, 'templates');
  const defaultTradeId =
    typeof templates?.defaultTrade === 'string'
      ? templates.defaultTrade
      : undefined;
  const defaultTemplate = availableTemplates.find(
    (template) => isRecord(template) && template.id === defaultTradeId
  );

  const globalLossCatalogSource = getLegacyGlobalLossSource(settings, true);
  if (globalLossCatalogSource) {
    convertLegacySections(globalLossCatalogSource, labelsByQuestionId);
  }

  for (const template of availableTemplates) {
    for (const source of getLegacyTemplateCatalogSources(template)) {
      convertLegacySections(source, labelsByQuestionId);
    }
    if (isRecord(template) && typeof template.id === 'string') {
      const templateLabels = new Map<string, string>();
      if (globalLossCatalogSource) {
        convertLegacySections(globalLossCatalogSource, templateLabels);
      }
      for (const source of getLegacyTemplateCatalogSources(template)) {
        convertLegacySections(source, templateLabels);
      }
      labelsByTemplateId.set(template.id, templateLabels);
    }
  }

  for (const source of getLegacyTemplateCatalogSources(defaultTemplate)) {
    convertLegacySections(source, labelsByQuestionId);
  }

  const defaultTemplateReview = getLegacyTemplateReview(defaultTemplate);
  const defaultSources = getLegacyTemplateSources(defaultTemplate);
  const widgetConfig: LegacyWidgetConfig = {};

  for (const key of LEGACY_QUESTION_CONFIG_KEYS) {
    const source = defaultSources[key];
    if (source) {
      widgetConfig[key] = convertLegacySections(source, labelsByQuestionId);
    }
  }

  const globalLossSource = getLegacyGlobalLossSource(settings, false);
  if (
    widgetConfig.lossQuestions === undefined &&
    defaultTemplateReview?.show !== 'never' &&
    globalLossSource
  ) {
    widgetConfig.lossQuestions = convertLegacySections(
      globalLossSource,
      labelsByQuestionId
    );
  }

  return { widgetConfig, labelsByQuestionId, labelsByTemplateId };
}

function parseCompleteTradeReviewQuestions(
  value: string
): TradeReviewQuestionConfig[] | undefined {
  const parsed = parseTradeReviewQuestions(value);
  if (parsed === undefined) return undefined;
  if (value.trim() === '[]') return parsed;

  if (value.startsWith('v3:')) {
    let structured: unknown;
    try {
      structured = JSON.parse(decodeURIComponent(value.slice(3)));
    } catch {
      return undefined;
    }
    if (
      !Array.isArray(structured) ||
      structured.length !== parsed.length ||
      !structured.every(isTradeReviewQuestionConfig)
    ) {
      return undefined;
    }
    return parsed;
  }

  const isVersioned = value.startsWith('v2:');
  const serializedQuestions = isVersioned ? value.slice(3) : value;
  const records = serializedQuestions.split(';');
  if (records.length !== parsed.length) return undefined;

  for (const record of records) {
    let fields = record.split('|');
    if (fields.length < 2 || fields.length > 3) return undefined;
    if (isVersioned) {
      try {
        fields = fields.map((field) => decodeURIComponent(field));
      } catch {
        return undefined;
      }
    }
    if (!fields[0]?.trim() || !fields[1]?.trim()) return undefined;
  }

  return parsed;
}

function mergeLegacyQuestionConfig(
  existingConfig: unknown,
  legacyConfig: LegacyWidgetConfig
):
  | { status: 'merged'; config: Record<string, unknown>; changed: boolean }
  | { status: 'conflict' } {
  if (existingConfig !== undefined && !isRecord(existingConfig)) {
    return { status: 'conflict' };
  }
  const config = { ...(existingConfig ?? {}) };
  let changed = false;

  for (const key of TRADE_REVIEW_QUESTION_CONFIG_KEY_LIST) {
    if (!Object.prototype.hasOwnProperty.call(config, key)) continue;
    const serialized = serializeTradeReviewQuestions(config[key]);
    const parsed =
      serialized === undefined
        ? undefined
        : parseCompleteTradeReviewQuestions(serialized);
    if (
      !Array.isArray(config[key]) ||
      parsed === undefined ||
      parsed.length !== config[key].length
    ) {
      return { status: 'conflict' };
    }
  }

  for (const key of LEGACY_QUESTION_CONFIG_KEYS) {
    const legacyQuestions = legacyConfig[key];
    if (legacyQuestions === undefined) {
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      continue;
    }
    config[key] = legacyQuestions;
    changed = true;
  }

  return { status: 'merged', config, changed };
}

export function createMigratedDefaultDrcTemplate({
  sourceTemplate,
  existingMigratedTemplate,
  legacyConfig,
  now,
}: {
  sourceTemplate: ReviewTemplate;
  existingMigratedTemplate?: ReviewTemplate;
  legacyConfig: LegacyWidgetConfig;
  now: string;
}): DefaultDrcTemplateMigrationResult {
  if (Object.keys(legacyConfig).length === 0) {
    return { status: 'unchanged' };
  }

  const baseTemplate = existingMigratedTemplate ?? sourceTemplate;
  const tradeReviewWidgetIndexes = baseTemplate.widgets.flatMap(
    (widget, index) => (widget.type === 'trade-review' ? [index] : [])
  );
  if (tradeReviewWidgetIndexes.length > 1) {
    return { status: 'conflict' };
  }

  const widgets = structuredClone(baseTemplate.widgets);
  if (tradeReviewWidgetIndexes.length === 0) {
    const merged = mergeLegacyQuestionConfig(undefined, legacyConfig);
    if (merged.status === 'conflict') return merged;
    const tradesWidgetIndex = widgets.findIndex(
      (widget) => widget.type === 'trades'
    );
    widgets.splice(tradesWidgetIndex + 1, 0, {
      type: 'trade-review',
      config: merged.config,
    });
  } else {
    const widgetIndex = tradeReviewWidgetIndexes[0];
    const widget = widgets[widgetIndex];
    const merged = mergeLegacyQuestionConfig(widget.config, legacyConfig);
    if (merged.status === 'conflict') return merged;
    if (!merged.changed) return { status: 'unchanged' };
    widgets[widgetIndex] = { ...widget, config: merged.config };
  }

  return {
    status: 'updated',
    template: {
      ...baseTemplate,
      id: MIGRATED_TRADE_REVIEW_DRC_TEMPLATE_ID,
      name:
        existingMigratedTemplate?.name ??
        `${sourceTemplate.name} (Migrated Trade Review)`,
      isBuiltIn: false,
      version: existingMigratedTemplate
        ? existingMigratedTemplate.version + 1
        : 1,
      createdAt: existingMigratedTemplate?.createdAt ?? now,
      updatedAt: now,
      widgets,
    },
  };
}

function getSerializedLegacyConfigLines(config: LegacyWidgetConfig): string[] {
  return LEGACY_QUESTION_CONFIG_KEYS.flatMap((key): string[] => {
    const questions = config[key];
    if (questions === undefined) return [];
    const serialized = serializeTradeReviewQuestions(questions);
    return serialized === undefined ? [] : [`${key}: ${serialized}`];
  });
}

export function upsertHistoricalDrcTradeReviewWidget(
  content: string,
  legacyConfig: LegacyWidgetConfig
): HistoricalDrcWidgetMigrationResult {
  const lines = content.split('\n');
  const tradeReviewStarts = lines.flatMap((line, index) =>
    line.trim() === '```journalit-trade-review' ? [index] : []
  );
  if (tradeReviewStarts.length > 1) {
    return { content, status: 'conflict' };
  }
  if (tradeReviewStarts.length === 1) {
    const start = tradeReviewStarts[0];
    const end = lines.findIndex(
      (line, index) => index > start && line.trim() === '```'
    );
    if (end < 0) return { content, status: 'conflict' };

    const existingKeys = new Set<string>();
    for (const line of lines.slice(start + 1, end)) {
      const separator = line.search(/:/);
      if (separator <= 0) continue;
      const key = line.slice(0, separator).trim();
      if (!LEGACY_QUESTION_CONFIG_KEY_SET.has(key)) continue;
      if (existingKeys.has(key)) return { content, status: 'conflict' };
      const parsed = parseCompleteTradeReviewQuestions(
        line.slice(separator + 1).trim()
      );
      if (parsed === undefined) return { content, status: 'conflict' };
      existingKeys.add(key);
    }
    const missingConfigLines = getSerializedLegacyConfigLines(
      legacyConfig
    ).filter((line) => !existingKeys.has(line.slice(0, line.search(/:/))));
    if (missingConfigLines.length === 0) {
      return { content, status: 'unchanged' };
    }

    lines.splice(end, 0, ...missingConfigLines);
    return { content: lines.join('\n'), status: 'updated' };
  }

  const blockLines = [
    '```journalit-trade-review',
    ...getSerializedLegacyConfigLines(legacyConfig),
    '```',
  ];
  const tradesStart = lines.findIndex(
    (line) => line.trim() === '```journalit-trades'
  );
  if (tradesStart >= 0) {
    const tradesEnd = lines.findIndex(
      (line, index) => index > tradesStart && line.trim() === '```'
    );
    if (tradesEnd >= 0) {
      lines.splice(tradesEnd + 1, 0, '', ...blockLines);
      return { content: lines.join('\n'), status: 'inserted' };
    }
  }

  const separator = content.trim().length > 0 ? '\n\n' : '';
  return {
    content: `${content.trimEnd()}${separator}${blockLines.join('\n')}\n`,
    status: 'inserted',
  };
}
