import {
  isValidTradeReviewQuestionGraph,
  TRADE_REVIEW_QUESTION_CONFIG_KEY_LIST,
} from '../../../components/reviewV2/widgets/tradeReviewConfig';
import {
  widgetMatchesPlacement,
  type WidgetDefinition,
} from '../../../data/widgetRegistry';
import { t } from '../../../lang/helpers';
import type {
  ReviewTemplate,
  ReviewTemplateType,
} from '../../../types/reviewV2';
import type {
  BoundedJSONArray,
  BoundedJSONObject,
  InspectConfigurationResult,
} from '../protocol/generated/inspect_configuration.result.generated';
import {
  boundedText,
  configurationRevision,
  isBoundedString,
  isOpaqueId,
  isRecord,
} from './configurationPrimitives';

type Success = Extract<InspectConfigurationResult, { status: 'ok' }>;
type Projection = NonNullable<Success['configuration']['review_templates']>;
type WireTemplate = Projection['templates'][number];
type WireWidget = WireTemplate['widgets'][number];
type Issue = Projection['invalid_templates'][number]['issues'][number];
type WidgetCatalogIndex = ReadonlyMap<string, readonly WidgetDefinition[]>;

export interface ReviewTemplateConfigurationSettings {
  templates: unknown;
  defaultDrc: unknown;
  defaultWeekly: unknown;
  defaultMonthly: unknown;
  defaultQuarterly: unknown;
  defaultYearly: unknown;
}

const REVIEW_TYPES = [
  'drc',
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
] as const satisfies readonly ReviewTemplateType[];
const DEFAULT_KEYS = {
  drc: 'defaultDrc',
  weekly: 'defaultWeekly',
  monthly: 'defaultMonthly',
  quarterly: 'defaultQuarterly',
  yearly: 'defaultYearly',
} as const satisfies Record<
  ReviewTemplateType,
  Exclude<keyof ReviewTemplateConfigurationSettings, 'templates'>
>;
const RFC3339 =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,6})?(?:Z|([+-])(\d{2}):(\d{2}))$/;
const MAX_JSON_DEPTH = 8;
const MAX_TEMPLATES = 100;
const MAX_PROJECTED_BYTES = 2 * 1024 * 1024;

const STRING_CONFIG_KEYS = new Set([
  'fieldIds',
  'groupId',
  'headings',
  'headingsJson',
  'fallbackMode',
  'dayScope',
  'selectionMode',
  'period',
  'text',
  'trackingMethod',
]);
const BOOLEAN_CONFIG_KEYS = new Set([
  'defaultExpanded',
  'hideEmpty',
  'showInherited',
  'showLocal',
  'showOpenTrades',
]);
const NUMBER_CONFIG_KEYS = new Set(['level', 'stopThreshold']);

function hasValidWidgetConfigTypes(config: BoundedJSONObject): boolean {
  return Object.entries(config).every(([key, value]) => {
    if (STRING_CONFIG_KEYS.has(key)) return typeof value === 'string';
    if (BOOLEAN_CONFIG_KEYS.has(key)) return typeof value === 'boolean';
    if (NUMBER_CONFIG_KEYS.has(key)) return typeof value === 'number';
    return true;
  });
}

export function isReviewTemplateType(
  value: unknown
): value is ReviewTemplateType {
  return REVIEW_TYPES.some((type) => type === value);
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  keys: readonly string[]
): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

export function isReviewTemplateTimestamp(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = RFC3339.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const offsetHour = match[8] === undefined ? 0 : Number(match[8]);
  const offsetMinute = match[9] === undefined ? 0 : Number(match[9]);
  const maximumDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return (
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= maximumDay &&
    hour <= 23 &&
    minute <= 59 &&
    second <= 59 &&
    offsetHour <= 23 &&
    offsetMinute <= 59 &&
    Number.isFinite(Date.parse(value))
  );
}

type BoundedJsonValue =
  | string
  | number
  | boolean
  | null
  | BoundedJSONArray
  | BoundedJSONObject;

function cloneBoundedJson(
  value: unknown,
  depth: number
): BoundedJsonValue | undefined {
  if (depth > MAX_JSON_DEPTH) return undefined;
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'string')
    return Array.from(value).length <= 10_000 ? value : undefined;
  if (typeof value === 'number')
    return Number.isFinite(value) && Math.abs(value) <= 1_000_000_000_000_000
      ? value
      : undefined;
  if (Array.isArray(value)) {
    if (value.length > 100) return undefined;
    const result: BoundedJSONArray = [];
    for (const item of value) {
      const cloned = cloneBoundedJson(item, depth + 1);
      if (cloned === undefined) return undefined;
      result.push(cloned);
    }
    return result;
  }
  if (!isRecord(value)) return undefined;
  const keys = Object.keys(value);
  if (keys.length > 100 || keys.some((key) => !isBoundedString(key, 120)))
    return undefined;
  const result: BoundedJSONObject = {};
  for (const key of keys) {
    const cloned = cloneBoundedJson(value[key], depth + 1);
    if (cloned === undefined) return undefined;
    result[key] = cloned;
  }
  return result;
}

function projectWidget(
  value: unknown,
  reviewType: ReviewTemplateType,
  catalogIndex: WidgetCatalogIndex
): WireWidget | undefined {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, ['type', 'id', 'locked', 'config']) ||
    !isBoundedString(value.type, 120) ||
    (value.id !== undefined && !isOpaqueId(value.id)) ||
    (value.locked !== undefined && typeof value.locked !== 'boolean') ||
    (value.config !== undefined && !isRecord(value.config))
  )
    return undefined;
  const config =
    value.config === undefined ? undefined : cloneBoundedJson(value.config, 1);
  if (value.config !== undefined && !isRecord(config)) return undefined;
  if (isRecord(config) && !hasValidWidgetConfigTypes(config)) return undefined;
  const widgetType = value.type;
  const typeDefinitions = catalogIndex.get(widgetType) ?? [];
  const availableDefinitions = typeDefinitions.filter((definition) =>
    definition.availableIn.includes(reviewType)
  );
  const available =
    widgetType === 'header' ||
    (typeDefinitions.length === 1 && availableDefinitions.length === 1) ||
    availableDefinitions.some((definition) =>
      widgetMatchesPlacement(
        definition,
        widgetType,
        isRecord(config) ? config : undefined
      )
    );
  if (!available) return undefined;
  if (widgetType === 'trade-review' && isRecord(config)) {
    for (const key of TRADE_REVIEW_QUESTION_CONFIG_KEY_LIST) {
      if (
        Object.prototype.hasOwnProperty.call(config, key) &&
        !isValidTradeReviewQuestionGraph(config[key])
      )
        return undefined;
    }
  }
  return {
    type: widgetType,
    ...(value.id === undefined ? {} : { id: value.id }),
    ...(value.locked === undefined ? {} : { locked: value.locked }),
    ...(isRecord(config) ? { config } : {}),
  };
}

function projectWidgets(
  value: unknown,
  reviewType: ReviewTemplateType,
  catalogIndex: WidgetCatalogIndex
): WireWidget[] | undefined {
  if (!Array.isArray(value) || value.length < 1 || value.length > 300)
    return undefined;
  const result: WireWidget[] = [];
  const identities = new Set<string>();
  for (const [index, rawWidget] of value.entries()) {
    const widget = projectWidget(rawWidget, reviewType, catalogIndex);
    if (
      !widget ||
      (index === 0 && (widget.type !== 'header' || widget.locked !== true)) ||
      (index > 0 && widget.type === 'header')
    )
      return undefined;
    if (widget.id !== undefined) {
      const identity = `${widget.type}\u0000${widget.id}`;
      if (identities.has(identity)) return undefined;
      identities.add(identity);
    }
    result.push(widget);
  }
  return result;
}

export function hasReviewTemplateNameConflict(
  rawTemplates: readonly unknown[],
  builtIns: readonly Pick<ReviewTemplate, 'id' | 'name' | 'type'>[],
  name: string,
  reviewType: ReviewTemplateType,
  excludeId?: string
): boolean {
  if (
    builtIns.some(
      (template) => template.name === name && template.type === reviewType
    )
  )
    return true;
  const reservedIds = new Set(builtIns.map((template) => template.id));
  return rawTemplates.some(
    (value) =>
      isRecord(value) &&
      !(typeof value.id === 'string' && reservedIds.has(value.id)) &&
      value.id !== excludeId &&
      value.name === name &&
      value.type === reviewType &&
      isBoundedString(value.name, 120)
  );
}

interface Candidate {
  raw: Record<string, unknown>;
  wire?: WireTemplate;
  issues: Issue[];
  uniqueIdentity: boolean;
  nameKey?: string;
}

function identityCounts(values: readonly unknown[]): Map<string, number> {
  const result = new Map<string, number>();
  for (const value of values) {
    if (isRecord(value) && typeof value.id === 'string')
      result.set(value.id, (result.get(value.id) ?? 0) + 1);
  }
  return result;
}

function projectCandidate(
  value: unknown,
  counts: ReadonlyMap<string, number>,
  reservedIds: ReadonlySet<string>,
  catalogIndex: WidgetCatalogIndex
): Candidate {
  if (!isRecord(value))
    return { raw: {}, issues: ['invalid_content'], uniqueIdentity: false };
  const issues = new Set<Issue>();
  const uniqueIdentity =
    typeof value.id === 'string' && counts.get(value.id) === 1;
  if (!isOpaqueId(value.id)) issues.add('invalid_identity');
  if (typeof value.id === 'string' && (counts.get(value.id) ?? 0) > 1)
    issues.add('duplicate_identity');
  if (typeof value.id === 'string' && reservedIds.has(value.id))
    issues.add('reserved_identity');
  const reviewType = isReviewTemplateType(value.type) ? value.type : undefined;
  let content: Omit<WireTemplate, 'id' | 'widgets'> | undefined;
  if (
    hasOnlyKeys(value, [
      'id',
      'name',
      'type',
      'version',
      'createdAt',
      'updatedAt',
      'isBuiltIn',
      'widgets',
    ]) &&
    isBoundedString(value.name, 120) &&
    reviewType !== undefined &&
    typeof value.version === 'number' &&
    Number.isInteger(value.version) &&
    value.version >= 1 &&
    value.version <= 2_147_483_647 &&
    value.isBuiltIn === false &&
    isReviewTemplateTimestamp(value.createdAt) &&
    isReviewTemplateTimestamp(value.updatedAt) &&
    Date.parse(value.updatedAt) >= Date.parse(value.createdAt)
  ) {
    content = {
      name: value.name,
      type: reviewType,
      version: value.version,
      created_at: value.createdAt,
      updated_at: value.updatedAt,
    };
  }
  if (!content) issues.add('invalid_content');
  const widgets = reviewType
    ? projectWidgets(value.widgets, reviewType, catalogIndex)
    : undefined;
  if (reviewType && !widgets) issues.add('invalid_widget');
  const wire =
    content && widgets && isOpaqueId(value.id)
      ? { id: value.id, ...content, widgets }
      : undefined;
  const nameKey =
    !(typeof value.id === 'string' && reservedIds.has(value.id)) &&
    isBoundedString(value.name, 120) &&
    reviewType !== undefined
      ? `${reviewType}\u0000${value.name}`
      : undefined;
  return {
    raw: value,
    wire,
    issues: [...issues],
    uniqueIdentity,
    ...(nameKey === undefined ? {} : { nameKey }),
  };
}

interface ValidatedWidgetCatalog {
  index: WidgetCatalogIndex;
  wire: Projection['widget_catalog'];
}

function validateWidgetCatalog(
  source: readonly WidgetDefinition[]
): ValidatedWidgetCatalog {
  const header: WidgetDefinition = {
    type: 'header',
    name: t('widget.header.name'),
    description: 'Navigation header with context links',
    category: 'layout',
    availableIn: [...REVIEW_TYPES],
  };
  const definitions: readonly unknown[] = [header, ...source];
  if (definitions.length > 1000)
    throw new Error('Too many review widget definitions.');

  const index = new Map<string, WidgetDefinition[]>();
  const wire: Projection['widget_catalog'] = [];
  for (const value of definitions) {
    if (
      !isRecord(value) ||
      !hasOnlyKeys(value, [
        'type',
        'name',
        'description',
        'category',
        'availableIn',
        'defaultConfig',
      ]) ||
      !isBoundedString(value.type, 120) ||
      !isBoundedString(value.name, 120) ||
      !isBoundedString(value.description, 1000) ||
      (value.category !== 'content' &&
        value.category !== 'charts' &&
        value.category !== 'statistics' &&
        value.category !== 'tables' &&
        value.category !== 'layout') ||
      !Array.isArray(value.availableIn) ||
      (value.defaultConfig !== undefined && !isRecord(value.defaultConfig))
    ) {
      throw new Error('Invalid review widget definition.');
    }
    const availabilityCount = value.availableIn.length;
    if (
      availabilityCount < 1 ||
      availabilityCount > 5 ||
      !value.availableIn.every(isReviewTemplateType) ||
      new Set(value.availableIn).size !== availabilityCount
    ) {
      throw new Error('Invalid review widget definition.');
    }
    const defaultConfig =
      value.defaultConfig === undefined
        ? undefined
        : cloneBoundedJson(value.defaultConfig, 1);
    if (value.defaultConfig !== undefined && !isRecord(defaultConfig))
      throw new Error('Invalid review widget default configuration.');

    const definition: WidgetDefinition = {
      type: value.type,
      name: value.name,
      description: value.description,
      category: value.category,
      availableIn: [...value.availableIn],
      ...(isRecord(defaultConfig) ? { defaultConfig } : {}),
    };
    const typeDefinitions = index.get(definition.type) ?? [];
    typeDefinitions.push(definition);
    index.set(definition.type, typeDefinitions);
    wire.push({
      type: definition.type,
      name: definition.name,
      description: definition.description,
      category: definition.category,
      available_in: [...definition.availableIn],
      ...(isRecord(defaultConfig) ? { default_config: defaultConfig } : {}),
    });
  }
  return { index, wire };
}

function projectBuiltIns(
  source: readonly ReviewTemplate[],
  catalogIndex: WidgetCatalogIndex
): Projection['built_in_templates'] {
  if (source.length > 50)
    throw new Error('Too many built-in review templates.');
  const result: Projection['built_in_templates'] = [];
  const ids = new Set<string>();
  const names = new Set<string>();
  const representedTypes = new Set<ReviewTemplateType>();
  for (const value of source) {
    if (
      !isRecord(value) ||
      !hasOnlyKeys(value, [
        'id',
        'name',
        'type',
        'version',
        'createdAt',
        'updatedAt',
        'isBuiltIn',
        'widgets',
      ]) ||
      !isOpaqueId(value.id) ||
      !isBoundedString(value.name, 120) ||
      !isReviewTemplateType(value.type) ||
      typeof value.version !== 'number' ||
      !Number.isInteger(value.version) ||
      value.version < 1 ||
      value.version > 2_147_483_647 ||
      value.isBuiltIn !== true ||
      !isReviewTemplateTimestamp(value.createdAt) ||
      !isReviewTemplateTimestamp(value.updatedAt) ||
      Date.parse(value.updatedAt) < Date.parse(value.createdAt)
    ) {
      throw new Error('Invalid built-in review template.');
    }
    const widgets = projectWidgets(value.widgets, value.type, catalogIndex);
    if (!widgets) throw new Error('Invalid built-in review template widgets.');
    const nameKey = `${value.type}\u0000${value.name}`;
    if (ids.has(value.id)) throw new Error('Duplicate built-in template ID.');
    if (names.has(nameKey))
      throw new Error('Duplicate built-in template name.');
    ids.add(value.id);
    names.add(nameKey);
    representedTypes.add(value.type);
    result.push({
      id: value.id,
      name: value.name,
      type: value.type,
      version: value.version,
      widgets,
    });
  }
  if (REVIEW_TYPES.some((type) => !representedTypes.has(type)))
    throw new Error('Missing built-in review template type.');
  return result;
}

export async function reviewTemplateConfigurationRevision(
  settings: ReviewTemplateConfigurationSettings
): Promise<string> {
  return configurationRevision({
    templates: settings.templates,
    defaultDrc: settings.defaultDrc,
    defaultWeekly: settings.defaultWeekly,
    defaultMonthly: settings.defaultMonthly,
    defaultQuarterly: settings.defaultQuarterly,
    defaultYearly: settings.defaultYearly,
  });
}

function selectedId(value: unknown): string | null {
  return isBoundedString(value, 256) ? value : null;
}

interface ValidatedReviewTemplateDomain {
  strictTemplates: Projection['templates'];
  builtInTemplates: Projection['built_in_templates'];
  invalidTemplates: Projection['invalid_templates'];
  widgetCatalog: Projection['widget_catalog'];
  templateCount: number;
  validateWidgets(
    value: unknown,
    reviewType: ReviewTemplateType
  ): WireWidget[] | undefined;
}

export function buildValidatedReviewTemplateDomain(
  settings: ReviewTemplateConfigurationSettings,
  builtInSource: readonly ReviewTemplate[],
  catalogSource: readonly WidgetDefinition[]
): ValidatedReviewTemplateDomain {
  const stored = Array.isArray(settings.templates) ? settings.templates : [];
  const catalog = validateWidgetCatalog(catalogSource);
  const builtIns = projectBuiltIns(builtInSource, catalog.index);
  const reservedIds = new Set(builtIns.map((template) => template.id));
  const counts = identityCounts(stored);
  const candidates = stored.map((value) =>
    projectCandidate(value, counts, reservedIds, catalog.index)
  );
  const nameCounts = new Map<string, number>();
  for (const template of builtIns) {
    const key = `${template.type}\u0000${template.name}`;
    nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1);
  }
  for (const candidate of candidates) {
    if (candidate.nameKey)
      nameCounts.set(
        candidate.nameKey,
        (nameCounts.get(candidate.nameKey) ?? 0) + 1
      );
  }

  const strictTemplates: Projection['templates'] = [];
  const invalidTemplates: Projection['invalid_templates'] = [];
  for (const candidate of candidates) {
    const issues = new Set(candidate.issues);
    if (candidate.nameKey && (nameCounts.get(candidate.nameKey) ?? 0) > 1)
      issues.add('duplicate_name');
    if (issues.size === 0 && candidate.wire) {
      strictTemplates.push(candidate.wire);
      continue;
    }
    const id = candidate.raw.id;
    const name = boundedText(candidate.raw.name, 120);
    const type = isReviewTemplateType(candidate.raw.type)
      ? candidate.raw.type
      : undefined;
    const actionable =
      candidate.uniqueIdentity && isOpaqueId(id) && !reservedIds.has(id);
    const [firstIssue, ...remainingIssues] = issues;
    if (firstIssue === undefined)
      throw new Error('Invalid review template has no issue classification.');
    const projectedIssues: [Issue, ...Issue[]] = [
      firstIssue,
      ...remainingIssues,
    ];
    invalidTemplates.push(
      actionable
        ? {
            template_id: id,
            ...(name === undefined ? {} : { name }),
            ...(type === undefined ? {} : { type }),
            issues: projectedIssues,
            can_replace_or_delete: true,
          }
        : {
            ...(typeof id === 'string'
              ? { template_id: Array.from(id).slice(0, 256).join('') }
              : {}),
            ...(name === undefined ? {} : { name }),
            ...(type === undefined ? {} : { type }),
            issues: projectedIssues,
            can_replace_or_delete: false,
          }
    );
  }
  return {
    strictTemplates,
    builtInTemplates: builtIns,
    invalidTemplates,
    widgetCatalog: catalog.wire,
    templateCount: stored.length,
    validateWidgets: (value, reviewType) =>
      projectWidgets(value, reviewType, catalog.index),
  };
}

export async function projectReviewTemplateConfiguration(
  settings: ReviewTemplateConfigurationSettings,
  builtInSource: readonly ReviewTemplate[],
  catalogSource: readonly WidgetDefinition[]
): Promise<Projection> {
  const domain = buildValidatedReviewTemplateDomain(
    settings,
    builtInSource,
    catalogSource
  );
  const strictById = new Map(
    domain.strictTemplates.map((template) => [template.id, template])
  );
  const builtInById = new Map(
    domain.builtInTemplates.map((template) => [template.id, template])
  );
  const prioritized: Projection['templates'] = [];
  const includedIds = new Set<string>();
  for (const type of REVIEW_TYPES) {
    const selected = selectedId(settings[DEFAULT_KEYS[type]]);
    const target = selected === null ? undefined : strictById.get(selected);
    if (target?.type === type && !includedIds.has(target.id)) {
      prioritized.push(target);
      includedIds.add(target.id);
    }
  }
  for (const template of domain.strictTemplates) {
    if (prioritized.length >= MAX_TEMPLATES) break;
    if (includedIds.has(template.id)) continue;
    prioritized.push(template);
    includedIds.add(template.id);
  }
  const invalidTemplates = domain.invalidTemplates.slice(0, MAX_TEMPLATES);
  const resolveDefault = (type: ReviewTemplateType) => {
    const selected = selectedId(settings[DEFAULT_KEYS[type]]);
    
    
    const selectedTemplate =
      selected === null
        ? undefined
        : (strictById.get(selected) ?? builtInById.get(selected));
    const fallback = domain.builtInTemplates.find(
      (template) => template.type === type
    );
    if (!fallback) throw new Error(`Missing built-in ${type} review template.`);
    return {
      selected_template_id: selected,
      effective_template_id:
        selectedTemplate?.type === type ? selectedTemplate.id : fallback.id,
    };
  };
  const defaults: Projection['defaults'] = {
    drc: resolveDefault('drc'),
    weekly: resolveDefault('weekly'),
    monthly: resolveDefault('monthly'),
    quarterly: resolveDefault('quarterly'),
    yearly: resolveDefault('yearly'),
  };
  const projection: Projection = {
    revision: await reviewTemplateConfigurationRevision(settings),
    templates: prioritized,
    built_in_templates: domain.builtInTemplates,
    defaults,
    widget_catalog: domain.widgetCatalog,
    invalid_templates: invalidTemplates,
    template_count: domain.templateCount,
    omitted_template_count:
      domain.templateCount - prioritized.length - invalidTemplates.length,
  };
  while (
    projection.templates.length > 0 &&
    new TextEncoder().encode(JSON.stringify(projection)).byteLength >
      MAX_PROJECTED_BYTES
  ) {
    projection.templates.pop();
    projection.omitted_template_count += 1;
  }
  while (
    projection.invalid_templates.length > 0 &&
    new TextEncoder().encode(JSON.stringify(projection)).byteLength >
      MAX_PROJECTED_BYTES
  ) {
    projection.invalid_templates.pop();
    projection.omitted_template_count += 1;
  }
  if (
    new TextEncoder().encode(JSON.stringify(projection)).byteLength >
    MAX_PROJECTED_BYTES
  ) {
    throw new Error('Review template configuration exceeds projection limit.');
  }
  return projection;
}
