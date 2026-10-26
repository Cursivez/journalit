import type { WidgetDefinition } from '../../../data/widgetRegistry';
import type {
  ReviewTemplate,
  ReviewTemplateType,
} from '../../../types/reviewV2';
import { generateUUID } from '../../../utils/uuid';
import { Mutex } from '../../../utils/mutex';
import type {
  ReviewTemplateChange,
  ReviewTemplateChangeSummary,
  UserReviewTemplate,
} from './configurationChangeTypes';
import {
  throwIfAborted,
  type PlannedConfigurationChange,
} from './configurationPlan';
import { boundedText, isOpaqueId, isRecord } from './configurationPrimitives';
import {
  buildValidatedReviewTemplateDomain,
  hasReviewTemplateNameConflict,
  isReviewTemplateTimestamp,
  isReviewTemplateType,
  reviewTemplateConfigurationRevision,
  type ReviewTemplateConfigurationSettings,
} from './reviewTemplateConfiguration';

type ChangeSummary = ReviewTemplateChangeSummary;

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
const REVIEW_TYPES = [
  'drc',
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
] as const satisfies readonly ReviewTemplateType[];

type UpsertKind = 'create' | 'duplicate' | 'update';

type MaterializedReviewTemplateChange =
  | { kind: 'create'; template: UserReviewTemplate }
  | { kind: 'duplicate'; template: UserReviewTemplate }
  | { kind: 'update'; template: UserReviewTemplate }
  | {
      kind: 'delete';
      templateId: string;
      clearedDefaults: ReviewTemplateType[];
    }
  | {
      kind: 'set_default';
      reviewType: ReviewTemplateType;
      templateId: string | null;
    };

export interface ReviewTemplatePlanSummary {
  base_revision: string;
  resulting_revision: string;
  change: ChangeSummary;
  template?: UserReviewTemplate;
}

type ReviewTemplateConfigurationErrorCode =
  | 'invalid_request'
  | 'not_found'
  | 'conflict';

export class ReviewTemplateConfigurationError extends Error {
  constructor(readonly code: ReviewTemplateConfigurationErrorCode) {
    super('Review template configuration request failed.');
    this.name = 'ReviewTemplateConfigurationError';
  }
}

interface MutationOptions {
  now?: () => number;
  templateIdFactory?: () => string;
}

interface MutationDependencies {
  getSettings(): ReviewTemplateConfigurationSettings;
  getBuiltIns(): readonly ReviewTemplate[];
  getCatalog(): readonly WidgetDefinition[];
  saveSettings(settings: ReviewTemplateConfigurationSettings): Promise<void>;
  options?: MutationOptions;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function persistedTemplate(template: UserReviewTemplate): ReviewTemplate {
  return {
    id: template.id,
    name: template.name,
    type: template.type,
    version: template.version,
    createdAt: template.created_at,
    updatedAt: template.updated_at,
    isBuiltIn: false,
    widgets: clone(template.widgets),
  };
}

function uniqueRawIndex(raw: readonly unknown[], id: string): number {
  let found = -1;
  for (let index = 0; index < raw.length; index += 1) {
    const value = raw[index];
    if (!isRecord(value) || value.id !== id) continue;
    if (found !== -1) throw new ReviewTemplateConfigurationError('conflict');
    found = index;
  }
  return found;
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function ensureNameAvailable(input: {
  raw: readonly unknown[];
  builtIns: readonly ReviewTemplate[];
  name: string;
  type: ReviewTemplateType;
  excludeId?: string;
}): void {
  if (
    hasReviewTemplateNameConflict(
      input.raw,
      input.builtIns,
      input.name,
      input.type,
      input.excludeId
    )
  )
    throw new ReviewTemplateConfigurationError('conflict');
}

function ensureGeneratedId(
  id: string,
  raw: readonly unknown[],
  builtIns: readonly ReviewTemplate[]
): void {
  if (
    !isOpaqueId(id) ||
    builtIns.some((template) => template.id === id) ||
    raw.some((value) => isRecord(value) && value.id === id)
  )
    throw new ReviewTemplateConfigurationError('conflict');
}

function upsertSummary(
  action: UpsertKind,
  template: UserReviewTemplate
): ChangeSummary {
  return {
    action,
    template_id: template.id,
    template_name: template.name,
    review_type: template.type,
    widget_count: template.widgets.length,
    message: `${action === 'create' ? 'Create' : action === 'duplicate' ? 'Duplicate' : 'Update'} review template “${template.name}”.`,
  };
}

function deleteSummary(value: unknown, templateId: string): ChangeSummary {
  const boundedName = isRecord(value)
    ? boundedText(value.name, 120)
    : undefined;
  const name = boundedName === '' ? undefined : boundedName;
  const type =
    isRecord(value) && isReviewTemplateType(value.type)
      ? value.type
      : undefined;
  const widgetCount =
    isRecord(value) &&
    Array.isArray(value.widgets) &&
    value.widgets.length <= 300
      ? value.widgets.length
      : undefined;
  return {
    action: 'delete',
    template_id: templateId,
    ...(name === undefined ? {} : { template_name: name }),
    ...(type === undefined ? {} : { review_type: type }),
    ...(widgetCount === undefined ? {} : { widget_count: widgetCount }),
    message: `Delete review template “${name ?? templateId}”.`,
  };
}

function applyMaterializedReviewTemplateChange(
  settings: ReviewTemplateConfigurationSettings,
  change: MaterializedReviewTemplateChange
): ReviewTemplateConfigurationSettings {
  const next = clone(settings);
  if (change.kind === 'set_default') {
    next[DEFAULT_KEYS[change.reviewType]] = change.templateId ?? '';
    return next;
  }
  const raw = isUnknownArray(next.templates) ? [...next.templates] : undefined;
  if (!raw) {
    if (change.kind === 'delete')
      throw new ReviewTemplateConfigurationError('not_found');
    throw new ReviewTemplateConfigurationError('conflict');
  }
  if (change.kind === 'create' || change.kind === 'duplicate') {
    raw.push(persistedTemplate(change.template));
  } else {
    const targetId =
      change.kind === 'update' ? change.template.id : change.templateId;
    const index = uniqueRawIndex(raw, targetId);
    if (index < 0) throw new ReviewTemplateConfigurationError('not_found');
    if (change.kind === 'update')
      raw[index] = persistedTemplate(change.template);
    else raw.splice(index, 1);
  }
  next.templates = raw;
  if (change.kind === 'delete') {
    for (const type of change.clearedDefaults) next[DEFAULT_KEYS[type]] = '';
  }
  return next;
}

async function materialize(input: {
  settings: ReviewTemplateConfigurationSettings;
  builtIns: readonly ReviewTemplate[];
  catalog: readonly WidgetDefinition[];
  change: ReviewTemplateChange;
  templateIdFactory: () => string;
  now: () => number;
}): Promise<{
  change: MaterializedReviewTemplateChange;
  summary: ChangeSummary;
}> {
  const domain = buildValidatedReviewTemplateDomain(
    input.settings,
    input.builtIns,
    input.catalog
  );
  const submitted = input.change;
  const raw = isUnknownArray(input.settings.templates)
    ? input.settings.templates
    : undefined;
  const strict = [...domain.strictTemplates, ...domain.builtInTemplates];

  if (submitted.kind === 'set_default') {
    if (submitted.template_id !== null) {
      const target = strict.find(
        (template) =>
          template.id === submitted.template_id &&
          template.type === submitted.review_type
      );
      if (!target) throw new ReviewTemplateConfigurationError('not_found');
    }
    return {
      change: {
        kind: 'set_default',
        reviewType: submitted.review_type,
        templateId: submitted.template_id,
      },
      summary: {
        action: 'set_default',
        review_type: submitted.review_type,
        template_id: submitted.template_id,
        message:
          submitted.template_id === null
            ? `Reset the default ${submitted.review_type} review template.`
            : `Set the default ${submitted.review_type} review template.`,
      },
    };
  }

  if (!raw) {
    if (submitted.kind === 'delete')
      throw new ReviewTemplateConfigurationError('not_found');
    throw new ReviewTemplateConfigurationError('conflict');
  }
  const reservedIds = new Set(input.builtIns.map((template) => template.id));

  if (submitted.kind === 'delete') {
    if (reservedIds.has(submitted.template_id))
      throw new ReviewTemplateConfigurationError('conflict');
    const index = uniqueRawIndex(raw, submitted.template_id);
    if (index < 0) throw new ReviewTemplateConfigurationError('not_found');
    const clearedDefaults = REVIEW_TYPES.filter(
      (type) => input.settings[DEFAULT_KEYS[type]] === submitted.template_id
    );
    return {
      change: {
        kind: 'delete',
        templateId: submitted.template_id,
        clearedDefaults,
      },
      summary: deleteSummary(raw[index], submitted.template_id),
    };
  }

  const timestamp = new Date(input.now()).toISOString();
  if (submitted.kind === 'create') {
    ensureNameAvailable({
      raw,
      builtIns: input.builtIns,
      name: submitted.template.name,
      type: submitted.template.type,
    });
    const id = input.templateIdFactory();
    ensureGeneratedId(id, raw, input.builtIns);
    const widgets = domain.validateWidgets(
      submitted.template.widgets,
      submitted.template.type
    );
    if (!widgets) throw new ReviewTemplateConfigurationError('invalid_request');
    const template: UserReviewTemplate = {
      id,
      name: submitted.template.name,
      type: submitted.template.type,
      version: 1,
      created_at: timestamp,
      updated_at: timestamp,
      widgets: clone(widgets),
    };
    return {
      change: {
        kind: 'create',
        template,
      },
      summary: upsertSummary('create', template),
    };
  }

  if (submitted.kind === 'duplicate') {
    const source = strict.find(
      (template) => template.id === submitted.source_template_id
    );
    if (!source) throw new ReviewTemplateConfigurationError('not_found');
    ensureNameAvailable({
      raw,
      builtIns: input.builtIns,
      name: submitted.name,
      type: source.type,
    });
    const id = input.templateIdFactory();
    ensureGeneratedId(id, raw, input.builtIns);
    const template: UserReviewTemplate = {
      id,
      name: submitted.name,
      type: source.type,
      version: 1,
      created_at: timestamp,
      updated_at: timestamp,
      widgets: clone(source.widgets),
    };
    return {
      change: {
        kind: 'duplicate',
        template,
      },
      summary: upsertSummary('duplicate', template),
    };
  }

  if (reservedIds.has(submitted.template_id))
    throw new ReviewTemplateConfigurationError('conflict');
  const index = uniqueRawIndex(raw, submitted.template_id);
  if (index < 0) throw new ReviewTemplateConfigurationError('not_found');
  const target = raw[index];
  if (!isRecord(target) || !isReviewTemplateType(target.type))
    throw new ReviewTemplateConfigurationError('conflict');
  ensureNameAvailable({
    raw,
    builtIns: input.builtIns,
    name: submitted.template.name,
    type: target.type,
    excludeId: submitted.template_id,
  });
  const widgets = domain.validateWidgets(
    submitted.template.widgets,
    target.type
  );
  if (!widgets) throw new ReviewTemplateConfigurationError('invalid_request');
  const storedVersion = target.version;
  let version = 1;
  if (
    typeof storedVersion === 'number' &&
    Number.isInteger(storedVersion) &&
    storedVersion >= 1 &&
    storedVersion <= 2_147_483_647
  ) {
    if (storedVersion === 2_147_483_647)
      throw new ReviewTemplateConfigurationError('conflict');
    version = storedVersion + 1;
  }
  const storedCreatedAt = target.createdAt;
  let createdAt = timestamp;
  if (isReviewTemplateTimestamp(storedCreatedAt)) {
    if (Date.parse(storedCreatedAt) > Date.parse(timestamp))
      throw new ReviewTemplateConfigurationError('conflict');
    createdAt = storedCreatedAt;
  }
  const template: UserReviewTemplate = {
    id: submitted.template_id,
    name: submitted.template.name,
    type: target.type,
    version,
    created_at: createdAt,
    updated_at: timestamp,
    widgets: clone(widgets),
  };
  return {
    change: { kind: 'update', template },
    summary: upsertSummary('update', template),
  };
}


export class ReviewTemplatePlanner {
  private readonly writeMutex = new Mutex();
  private readonly templateIdFactory: () => string;
  private readonly now: () => number;

  constructor(private readonly dependencies: MutationDependencies) {
    this.templateIdFactory =
      dependencies.options?.templateIdFactory ?? generateUUID;
    this.now = dependencies.options?.now ?? Date.now;
  }

  async plan(
    change: ReviewTemplateChange,
    signal: AbortSignal
  ): Promise<PlannedConfigurationChange<ReviewTemplatePlanSummary>> {
    throwIfAborted(signal);
    const current = this.dependencies.getSettings();
    
    const [baseRevision, materialized] = await Promise.all([
      reviewTemplateConfigurationRevision(current),
      materialize({
        settings: current,
        builtIns: this.dependencies.getBuiltIns(),
        catalog: this.dependencies.getCatalog(),
        change,
        templateIdFactory: this.templateIdFactory,
        now: this.now,
      }),
    ]);
    const next = applyMaterializedReviewTemplateChange(
      current,
      materialized.change
    );
    const resultingRevision = await reviewTemplateConfigurationRevision(next);
    throwIfAborted(signal);
    const materializedChange = materialized.change;
    const summary: ReviewTemplatePlanSummary = {
      base_revision: baseRevision,
      resulting_revision: resultingRevision,
      change: materialized.summary,
      ...('template' in materializedChange
        ? { template: clone(materializedChange.template) }
        : {}),
    };
    return {
      summary,
      execute: (executionSignal) =>
        this.execute(materializedChange, summary, executionSignal),
    };
  }

  private async execute(
    change: MaterializedReviewTemplateChange,
    planned: ReviewTemplatePlanSummary,
    signal: AbortSignal
  ): Promise<void> {
    await this.writeMutex.withLock(async () => {
      throwIfAborted(signal);
      const current = this.dependencies.getSettings();
      if (
        (await reviewTemplateConfigurationRevision(current)) !==
        planned.base_revision
      )
        throw new ReviewTemplateConfigurationError('conflict');
      const next = applyMaterializedReviewTemplateChange(current, change);
      if (
        (await reviewTemplateConfigurationRevision(next)) !==
        planned.resulting_revision
      )
        throw new ReviewTemplateConfigurationError('conflict');
      throwIfAborted(signal);
      await this.dependencies.saveSettings(next);
    });
  }
}
