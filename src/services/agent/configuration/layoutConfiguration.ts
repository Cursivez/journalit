import type { MetricDefinition } from '../../../components/dashboard/components/TopSection/types';
import {
  DIRECTIONAL_DRAWDOWN_REPLACEMENT_WIDGET_IDS,
  LEGACY_DIRECTIONAL_DRAWDOWN_WIDGET_ID,
  type WidgetDefinition,
} from '../../../components/dashboard/components/BottomSection/types';
import {
  DIRECT_CONFIGURABLE_HOME_WIDGET_IDS,
  type HomeWidgetDefinition,
} from '../../../components/home/homeTypes';
import {
  fitLayoutItemToBreakpoint,
  type BreakpointKey,
  GRID_COLS,
  GRID_ROW_HEIGHT,
} from '../../../components/shared/gridLayout/gridLayoutUtils';
import type { InspectConfigurationResult } from '../protocol/generated/inspect_configuration.result.generated';
import {
  boundedText,
  compareCodePoints,
  configurationRevision,
  isBoundedString,
  isRecord,
} from './configurationPrimitives';

type Success = Extract<InspectConfigurationResult, { status: 'ok' }>;
type DashboardProjection = NonNullable<
  Success['configuration']['dashboard_layouts']
>;
type HomeProjection = NonNullable<Success['configuration']['home_layouts']>;
type DashboardArtifact = DashboardProjection['layouts'][number];
type HomeArtifact = HomeProjection['layouts'][number];
type InvalidSummary = DashboardProjection['invalid_layouts'][number];
type Issue = InvalidSummary['issues'][number];
type WirePlacement = DashboardArtifact['breakpoints']['lg'][number];
type WireBreakpoints = DashboardArtifact['breakpoints'];
type WireOmissions = DashboardArtifact['omitted_placement_counts'];

const BREAKPOINTS = ['lg', 'md', 'sm', 'xs', 'xxs'] as const;
const REQUIRED_BREAKPOINTS = ['lg', 'md', 'sm'] as const;
const GRID = {
  row_height: GRID_ROW_HEIGHT,
  columns: GRID_COLS,
} satisfies DashboardProjection['grid'];
const MAX_LAYOUTS = 20;
const MAX_INVALID_LAYOUTS = 20;
const MAX_PLACEMENTS = 100;
const MAX_METRICS = 50;

export interface RawLayoutSettings {
  layouts: unknown;
  activeLayout: unknown;
}

export interface RawHomeLayoutSettings extends RawLayoutSettings {
  embeddedNotes: unknown;
  goals: unknown;
  topBreakdowns: unknown;
  streaks?: unknown;
}

interface CatalogDefinition {
  id: string;
  maxSize?: { w: number; h: number };
  configurable: boolean;
}

interface ValidatedCatalog<Wire> {
  wire: Wire[];
  definitions: ReadonlyMap<string, CatalogDefinition>;
}

interface ValidCandidate<Artifact> {
  kind: 'valid';
  rawName: string;
  strictName: string;
  artifact: Artifact;
  issues: Issue[];
}

interface ActionableInvalidCandidate {
  kind: 'actionable_invalid';
  rawName: string;
  strictName: string;
  issues: Issue[];
}

interface NonActionableInvalidCandidate {
  kind: 'non_actionable_invalid';
  rawName: string;
  issues: Issue[];
}

type Candidate<Artifact> =
  | ValidCandidate<Artifact>
  | ActionableInvalidCandidate
  | NonActionableInvalidCandidate;

interface ValidatedLayoutDomain<Artifact> {
  rawLayoutCount: number;
  candidates: Candidate<Artifact>[];
  selectedActiveLayout: string | null;
  effectiveActiveLayout: string | null;
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]) {
  return Object.keys(value).every((key) => keys.includes(key));
}

export function isStrictName(value: unknown): value is string {
  return (
    isBoundedString(value, 120) && value.trim() === value && value.length > 0
  );
}

function isSize(value: unknown): value is { w: number; h: number } {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, ['w', 'h']) &&
    Number.isInteger(value.w) &&
    Number.isInteger(value.h) &&
    typeof value.w === 'number' &&
    typeof value.h === 'number' &&
    value.w >= 1 &&
    value.w <= 12 &&
    value.h >= 1 &&
    value.h <= 10_000
  );
}

function sizeOrdered(
  minimum: { w: number; h: number },
  value: { w: number; h: number }
): boolean {
  return minimum.w <= value.w && minimum.h <= value.h;
}

function validateCatalogEntry(
  value: unknown,
  categories: ReadonlySet<string>,
  configurable: boolean
): CatalogDefinition {
  if (
    !isRecord(value) ||
    !isStrictName(value.id) ||
    !isBoundedString(value.name, 120) ||
    !isBoundedString(value.description, 1000) ||
    typeof value.category !== 'string' ||
    !categories.has(value.category) ||
    !isSize(value.minSize) ||
    !isSize(value.defaultSize) ||
    !sizeOrdered(value.minSize, value.defaultSize) ||
    (value.maxSize !== undefined &&
      (!isSize(value.maxSize) ||
        !sizeOrdered(value.defaultSize, value.maxSize)))
  ) {
    throw new Error('Invalid layout catalog entry.');
  }
  return {
    id: value.id,
    configurable,
    ...(value.maxSize === undefined ? {} : { maxSize: value.maxSize }),
  };
}

function validateDashboardCatalog(
  metrics: readonly MetricDefinition[],
  widgets: readonly WidgetDefinition[]
): {
  metrics: DashboardProjection['metric_catalog'];
  widgets: ValidatedCatalog<DashboardProjection['widget_catalog'][number]>;
} {
  if (metrics.length > 200 || widgets.length > 200)
    throw new Error('Layout catalog exceeds contract bounds.');
  const metricIds = new Set<string>();
  const metricWire: DashboardProjection['metric_catalog'] = [];
  for (const value of metrics) {
    if (
      !isRecord(value) ||
      !isStrictName(value.id) ||
      !isBoundedString(value.name, 120) ||
      !isBoundedString(value.description, 1000) ||
      metricIds.has(value.id)
    )
      throw new Error('Invalid dashboard metric catalog.');
    metricIds.add(value.id);
    metricWire.push({
      id: value.id,
      name: value.name,
      description: value.description,
    });
  }
  const definitions = new Map<string, CatalogDefinition>();
  const wire: DashboardProjection['widget_catalog'] = [];
  const categories = new Set<WidgetDefinition['category']>([
    'performance',
    'breakdowns',
    'risk',
  ]);
  for (const value of widgets) {
    const definition = validateCatalogEntry(value, categories, false);
    if (definitions.has(definition.id))
      throw new Error('Duplicate dashboard widget catalog identity.');
    definitions.set(definition.id, definition);
    wire.push({
      id: value.id,
      name: value.name,
      description: value.description,
      category: value.category,
      min_size: { ...value.minSize },
      default_size: { ...value.defaultSize },
      ...(value.maxSize === undefined
        ? {}
        : { max_size: { ...value.maxSize } }),
      configurable: false,
    });
  }
  return { metrics: metricWire, widgets: { wire, definitions } };
}

function validateHomeCatalog(
  widgets: readonly HomeWidgetDefinition[]
): ValidatedCatalog<HomeProjection['widget_catalog'][number]> {
  if (widgets.length > 200)
    throw new Error('Home widget catalog exceeds bounds.');
  const definitions = new Map<string, CatalogDefinition>();
  const wire: HomeProjection['widget_catalog'] = [];
  const categories = new Set<HomeWidgetDefinition['category']>([
    'performance',
    'accounts',
    'workflow',
  ]);
  for (const value of widgets) {
    if (
      value.configurable !== undefined &&
      typeof value.configurable !== 'boolean'
    )
      throw new Error('Invalid Home widget configurable flag.');
    const configurable = value.configurable === true;
    const definition = validateCatalogEntry(value, categories, configurable);
    if (definitions.has(definition.id))
      throw new Error('Duplicate Home widget catalog identity.');
    definitions.set(definition.id, definition);
    wire.push({
      id: value.id,
      name: value.name,
      description: value.description,
      category: value.category,
      min_size: { ...value.minSize },
      default_size: { ...value.defaultSize },
      ...(value.maxSize === undefined
        ? {}
        : { max_size: { ...value.maxSize } }),
      configurable,
    });
  }
  for (const definition of definitions.values()) {
    if (!definition.configurable) continue;
    if (/-/.test(definition.id))
      throw new Error('Ambiguous configurable Home widget base identity.');
    const prefix = `${definition.id}-`;
    if (
      [...definitions.keys()].some(
        (id) => id !== definition.id && id.startsWith(prefix)
      )
    )
      throw new Error('Ambiguous configurable Home widget base identity.');
  }
  return { wire, definitions };
}

function configuredInstances(
  settings: RawHomeLayoutSettings,
  catalog: ReadonlyMap<string, CatalogDefinition>
): {
  wire: HomeProjection['configured_widget_instances'];
  ids: ReadonlyMap<string, string>;
  directConfiguredBaseIds: ReadonlySet<string>;
} {
  const sources = [
    ['embeddedNote', settings.embeddedNotes],
    ['goalsProgress', settings.goals],
    ['setupLeaderboard', settings.topBreakdowns],
    ['currentStreak', settings.streaks],
  ] as const;
  const candidates = new Map<string, string>();
  const directConfiguredBaseIds = new Set<string>(
    DIRECT_CONFIGURABLE_HOME_WIDGET_IDS
  );
  const configurablePrefixes: string[] = [];
  for (const definition of catalog.values()) {
    if (definition.configurable) configurablePrefixes.push(`${definition.id}-`);
  }
  for (const [type, source] of sources) {
    const definition = catalog.get(type);
    if (!definition?.configurable)
      throw new Error('Invalid Home configuration registry mapping.');
    if (!isRecord(source)) continue;
    for (const [id, value] of Object.entries(source)) {
      if (!isRecord(value)) continue;
      if (id === type && directConfiguredBaseIds.has(type)) continue;
      const prefix = `${type}-`;
      const suffix = id.startsWith(prefix) ? id.slice(prefix.length) : '';
      if (
        !isStrictName(id) ||
        suffix.length === 0 ||
        configurablePrefixes.some((nestedPrefix) =>
          suffix.startsWith(nestedPrefix)
        ) ||
        candidates.has(id)
      )
        continue;
      candidates.set(id, type);
    }
  }
  const retained = [...candidates]
    .sort(([left], [right]) => compareCodePoints(left, right))
    .slice(0, 1000);
  const ids = new Map(retained);
  const wire = retained.map(([id, type]) => ({ id, type }));
  return { wire, ids, directConfiguredBaseIds };
}

function projectPlacement(
  value: unknown,
  breakpoint: BreakpointKey,
  definition: CatalogDefinition
): WirePlacement | undefined {
  if (
    !isRecord(value) ||
    !isStrictName(value.i) ||
    typeof value.x !== 'number' ||
    typeof value.y !== 'number' ||
    typeof value.w !== 'number' ||
    typeof value.h !== 'number' ||
    !Number.isFinite(value.x) ||
    !Number.isFinite(value.y) ||
    !Number.isFinite(value.w) ||
    !Number.isFinite(value.h) ||
    !Number.isInteger(value.x) ||
    !Number.isInteger(value.y) ||
    !Number.isInteger(value.w) ||
    !Number.isInteger(value.h) ||
    value.x < 0 ||
    value.y < 0 ||
    value.y > 9999 ||
    value.w < 1 ||
    value.h < 1 ||
    value.h > 10_000 ||
    (value.static !== undefined && typeof value.static !== 'boolean')
  )
    return undefined;
  
  
  const fitted = fitLayoutItemToBreakpoint(
    {
      i: value.i,
      x: value.x,
      y: value.y,
      w: value.w,
      h: value.h,
      ...(value.static === undefined ? {} : { static: value.static }),
    },
    breakpoint
  );
  const effective =
    definition.maxSize === undefined
      ? fitted
      : {
          ...fitted,
          w: Math.min(fitted.w, definition.maxSize.w),
          h: Math.min(fitted.h, definition.maxSize.h),
        };
  return {
    id: effective.i,
    x: effective.x,
    y: effective.y,
    w: effective.w,
    h: effective.h,
    ...(effective.static === undefined ? {} : { static: effective.static }),
  };
}

type BreakpointResult =
  | { kind: 'valid'; projected: WireBreakpoints; omitted: WireOmissions }
  | { kind: 'invalid'; issues: Issue[] };

function validateBreakpoints({
  value,
  definitions,
  instances,
  directConfiguredBaseIds = new Set(),
  dashboard = false,
}: {
  value: unknown;
  definitions: ReadonlyMap<string, CatalogDefinition>;
  instances?: ReadonlyMap<string, string>;
  directConfiguredBaseIds?: ReadonlySet<string>;
  dashboard?: boolean;
}): BreakpointResult {
  if (!isRecord(value) || !hasOnlyKeys(value, BREAKPOINTS))
    return { kind: 'invalid', issues: ['invalid_content'] };
  if (REQUIRED_BREAKPOINTS.some((key) => !Array.isArray(value[key])))
    return { kind: 'invalid', issues: ['invalid_content'] };
  const all = new Map<BreakpointKey, WirePlacement[]>();
  const unknownCounts = new Map<BreakpointKey, number>();
  const issues = new Set<Issue>();
  for (const breakpoint of BREAKPOINTS) {
    const raw = value[breakpoint];
    if (raw === undefined) continue;
    if (!Array.isArray(raw)) {
      issues.add('invalid_content');
      continue;
    }
    let unknownCount = 0;
    const placements: WirePlacement[] = [];
    const rawIds = new Set<string>();
    for (const item of raw) {
      if (!isRecord(item) || !isStrictName(item.i)) {
        issues.add('invalid_item');
        continue;
      }
      if (rawIds.has(item.i)) issues.add('duplicate_item');
      rawIds.add(item.i);
      const resolvedIds =
        dashboard && item.i === LEGACY_DIRECTIONAL_DRAWDOWN_WIDGET_ID
          ? DIRECTIONAL_DRAWDOWN_REPLACEMENT_WIDGET_IDS
          : [item.i];
      for (const id of resolvedIds) {
        const definition = definitions.get(id);
        const instanceType = instances?.get(id);
        const resolvedDefinition =
          definition ??
          (instanceType === undefined
            ? undefined
            : definitions.get(instanceType));
        if (
          !resolvedDefinition ||
          (definition?.configurable === true &&
            instanceType === undefined &&
            !directConfiguredBaseIds.has(id))
        ) {
          unknownCount += 1;
          continue;
        }
        const placement = projectPlacement(
          { ...item, i: id },
          breakpoint,
          resolvedDefinition
        );
        if (!placement) issues.add('invalid_item');
        else placements.push(placement);
      }
    }
    if (
      new Set(placements.map((placement) => placement.id)).size !==
      placements.length
    )
      issues.add('duplicate_item');
    all.set(breakpoint, placements);
    unknownCounts.set(breakpoint, unknownCount);
  }
  if (
    issues.has('invalid_content') ||
    issues.has('invalid_item') ||
    issues.has('duplicate_item')
  )
    return { kind: 'invalid', issues: [...issues] };
  const membership = [...all.values()].map(
    (placements) => new Set(placements.map((placement) => placement.id))
  );
  const baseline = membership[0] ?? new Set<string>();
  if (
    membership.some(
      (set) =>
        set.size !== baseline.size || [...baseline].some((id) => !set.has(id))
    )
  )
    return { kind: 'invalid', issues: ['membership_mismatch'] };
  const unknownSourceCounts = [...unknownCounts.values()];
  if (
    unknownSourceCounts.some(
      (count) => count !== (unknownSourceCounts[0] ?? count)
    )
  )
    return { kind: 'invalid', issues: ['membership_mismatch'] };

  const lg = all.get('lg') ?? [];
  const retained = new Set(
    lg.slice(0, MAX_PLACEMENTS).map((placement) => placement.id)
  );
  const projectedByBreakpoint = new Map<BreakpointKey, WirePlacement[]>();
  const omittedByBreakpoint = new Map<BreakpointKey, number>();
  for (const breakpoint of BREAKPOINTS) {
    const placements = all.get(breakpoint);
    if (!placements) continue;
    const projectedPlacements = placements.filter((placement) =>
      retained.has(placement.id)
    );
    projectedByBreakpoint.set(breakpoint, projectedPlacements);
    omittedByBreakpoint.set(
      breakpoint,
      (unknownCounts.get(breakpoint) ?? 0) +
        placements.length -
        projectedPlacements.length
    );
  }
  const projected: WireBreakpoints = {
    lg: projectedByBreakpoint.get('lg') ?? [],
    md: projectedByBreakpoint.get('md') ?? [],
    sm: projectedByBreakpoint.get('sm') ?? [],
    ...(projectedByBreakpoint.has('xs')
      ? { xs: projectedByBreakpoint.get('xs') ?? [] }
      : {}),
    ...(projectedByBreakpoint.has('xxs')
      ? { xxs: projectedByBreakpoint.get('xxs') ?? [] }
      : {}),
  };
  const omitted: WireOmissions = {
    lg: omittedByBreakpoint.get('lg') ?? 0,
    md: omittedByBreakpoint.get('md') ?? 0,
    sm: omittedByBreakpoint.get('sm') ?? 0,
    ...(omittedByBreakpoint.has('xs')
      ? { xs: omittedByBreakpoint.get('xs') ?? 0 }
      : {}),
    ...(omittedByBreakpoint.has('xxs')
      ? { xxs: omittedByBreakpoint.get('xxs') ?? 0 }
      : {}),
  };
  return { kind: 'valid', projected, omitted };
}

function invalidSummary(candidate: Candidate<unknown>): InvalidSummary {
  const safeName =
    candidate.rawName.length === 0
      ? undefined
      : boundedText(candidate.rawName, 256);
  if (candidate.kind === 'actionable_invalid') {
    return {
      name: candidate.strictName,
      issues: candidate.issues,
      can_replace_or_delete: true,
    };
  }
  return {
    ...(safeName === undefined ? {} : { name: safeName }),
    issues: candidate.issues,
    can_replace_or_delete: false,
  };
}

function buildCandidate<Content extends object>(
  rawName: string,
  issues: ReadonlySet<Issue>,
  content: Content | undefined
): Candidate<{ name: string } & Content> {
  const candidateIssues: Issue[] = [...issues];
  if (content === undefined && candidateIssues.length === 0)
    candidateIssues.push('invalid_content');
  if (!isStrictName(rawName)) {
    return {
      kind: 'non_actionable_invalid',
      rawName,
      issues: candidateIssues,
    };
  }
  if (issues.size > 0 || content === undefined) {
    return {
      kind: 'actionable_invalid',
      rawName,
      strictName: rawName,
      issues: candidateIssues,
    };
  }
  return {
    kind: 'valid',
    rawName,
    strictName: rawName,
    artifact: { name: rawName, ...content },
    issues: [],
  };
}

function finalizeDomain<Artifact extends { name: string }>(
  candidates: Candidate<Artifact>[],
  activeLayout: unknown
): ValidatedLayoutDomain<Artifact> {
  const selected = isStrictName(activeLayout) ? activeLayout : null;
  const strict = candidates.filter(
    (candidate): candidate is ValidCandidate<Artifact> =>
      candidate.kind === 'valid'
  );
  const selectedCandidate =
    selected === null
      ? undefined
      : strict.find((candidate) => candidate.strictName === selected);
  const defaultCandidate = strict.find(
    (candidate) => candidate.strictName === 'Default'
  );
  const lexical = strict.reduce<ValidCandidate<Artifact> | undefined>(
    (first, candidate) =>
      first === undefined ||
      compareCodePoints(candidate.strictName, first.strictName) < 0
        ? candidate
        : first,
    undefined
  );
  const effective = selectedCandidate ?? defaultCandidate ?? lexical;
  if (selected !== null && selectedCandidate === undefined) {
    const rawSelected = candidates.find(
      (candidate) => candidate.rawName === selected
    );
    if (
      rawSelected?.kind !== 'valid' &&
      rawSelected &&
      !rawSelected.issues.includes('invalid_active_layout')
    )
      rawSelected.issues.push('invalid_active_layout');
  }
  return {
    rawLayoutCount: candidates.length,
    candidates,
    selectedActiveLayout: selected,
    effectiveActiveLayout: effective?.strictName ?? null,
  };
}

function appendMalformedLayoutCollection<Artifact>(
  layouts: unknown,
  candidates: Candidate<Artifact>[]
): void {
  const values = Array.isArray(layouts) ? layouts : [layouts];
  for (const value of values) {
    const rawName =
      isRecord(value) && typeof value.name === 'string' ? value.name : '';
    const issues: Issue[] = ['invalid_content'];
    if (rawName.length > 0 && !isStrictName(rawName))
      issues.push('invalid_name');
    candidates.push({
      kind: 'non_actionable_invalid',
      rawName,
      issues,
    });
  }
}

export function validateDashboardLayoutDomain(
  settings: RawLayoutSettings,
  metrics: readonly MetricDefinition[],
  widgets: readonly WidgetDefinition[]
): {
  domain: ValidatedLayoutDomain<DashboardArtifact>;
  catalog: ReturnType<typeof validateDashboardCatalog>;
} {
  const catalog = validateDashboardCatalog(metrics, widgets);
  const metricIds = new Set(catalog.metrics.map((metric) => metric.id));
  const candidates: Candidate<DashboardArtifact>[] = [];
  if (settings.layouts === undefined)
    return {
      domain: finalizeDomain(candidates, settings.activeLayout),
      catalog,
    };
  if (!isRecord(settings.layouts)) {
    appendMalformedLayoutCollection(settings.layouts, candidates);
    return {
      domain: finalizeDomain(candidates, settings.activeLayout),
      catalog,
    };
  }
  for (const [name, raw] of Object.entries(settings.layouts)) {
    const issues = new Set<Issue>();
    if (!isStrictName(name)) issues.add('invalid_name');
    let content: Omit<DashboardArtifact, 'name'> | undefined;
    if (
      !isRecord(raw) ||
      !hasOnlyKeys(raw, ['topSection', 'bottomSection']) ||
      !Array.isArray(raw.topSection)
    ) {
      issues.add('invalid_content');
    } else {
      const metricsOut: string[] = [];
      const seen = new Set<string>();
      for (const metric of raw.topSection) {
        if (!isStrictName(metric)) issues.add('invalid_item');
        else if (seen.has(metric)) issues.add('duplicate_item');
        else {
          seen.add(metric);
          if (metricIds.has(metric)) metricsOut.push(metric);
        }
      }
      const breakpoints = validateBreakpoints({
        value: raw.bottomSection,
        definitions: catalog.widgets.definitions,
        dashboard: true,
      });
      if (breakpoints.kind === 'invalid') {
        breakpoints.issues.forEach((issue) => issues.add(issue));
      } else {
        content = {
          top_section: metricsOut.slice(0, MAX_METRICS),
          breakpoints: breakpoints.projected,
          omitted_placement_counts: breakpoints.omitted,
          omitted_metric_count:
            raw.topSection.length - Math.min(metricsOut.length, MAX_METRICS),
        };
      }
    }
    candidates.push(buildCandidate(name, issues, content));
  }
  return { domain: finalizeDomain(candidates, settings.activeLayout), catalog };
}

export function validateHomeLayoutDomain(
  settings: RawHomeLayoutSettings,
  widgets: readonly HomeWidgetDefinition[]
): {
  domain: ValidatedLayoutDomain<HomeArtifact>;
  catalog: ValidatedCatalog<HomeProjection['widget_catalog'][number]>;
  instances: ReturnType<typeof configuredInstances>;
} {
  const catalog = validateHomeCatalog(widgets);
  const instances = configuredInstances(settings, catalog.definitions);
  const candidates: Candidate<HomeArtifact>[] = [];
  if (settings.layouts === undefined)
    return {
      domain: finalizeDomain(candidates, settings.activeLayout),
      catalog,
      instances,
    };
  if (!isRecord(settings.layouts)) {
    appendMalformedLayoutCollection(settings.layouts, candidates);
  } else {
    for (const [name, raw] of Object.entries(settings.layouts)) {
      const issues = new Set<Issue>();
      if (!isStrictName(name)) issues.add('invalid_name');
      let content: Omit<HomeArtifact, 'name'> | undefined;
      const breakpoints = validateBreakpoints({
        value: raw,
        definitions: catalog.definitions,
        instances: instances.ids,
        directConfiguredBaseIds: instances.directConfiguredBaseIds,
      });
      if (breakpoints.kind === 'invalid') {
        breakpoints.issues.forEach((issue) => issues.add(issue));
      } else {
        content = {
          breakpoints: breakpoints.projected,
          omitted_placement_counts: breakpoints.omitted,
        };
      }
      candidates.push(buildCandidate(name, issues, content));
    }
  }
  return {
    domain: finalizeDomain(candidates, settings.activeLayout),
    catalog,
    instances,
  };
}

function boundedProjection<Artifact extends { name: string }>(
  domain: ValidatedLayoutDomain<Artifact>
) {
  const valid = domain.candidates.filter(
    (candidate): candidate is ValidCandidate<Artifact> =>
      candidate.kind === 'valid'
  );
  const ordered = [...valid].sort((left, right) =>
    compareCodePoints(left.artifact.name, right.artifact.name)
  );
  if (domain.effectiveActiveLayout !== null) {
    const index = ordered.findIndex(
      (candidate) => candidate.artifact.name === domain.effectiveActiveLayout
    );
    if (index > 0) ordered.unshift(...ordered.splice(index, 1));
  }
  const layouts = ordered
    .slice(0, MAX_LAYOUTS)
    .map((candidate) => candidate.artifact);
  const invalid = domain.candidates
    .filter((candidate) => candidate.kind !== 'valid')
    .sort((left, right) => compareCodePoints(left.rawName, right.rawName))
    .slice(0, MAX_INVALID_LAYOUTS)
    .map(invalidSummary);
  return {
    layouts,
    invalid,
    omitted: domain.rawLayoutCount - layouts.length - invalid.length,
  };
}

export async function projectDashboardLayoutConfiguration(
  settings: RawLayoutSettings,
  metrics: readonly MetricDefinition[],
  widgets: readonly WidgetDefinition[]
): Promise<DashboardProjection> {
  const { domain, catalog } = validateDashboardLayoutDomain(
    settings,
    metrics,
    widgets
  );
  const bounded = boundedProjection(domain);
  return {
    revision: await configurationRevision({
      layouts: settings.layouts,
      activeLayout: settings.activeLayout,
    }),
    selected_active_layout: domain.selectedActiveLayout,
    effective_active_layout: domain.effectiveActiveLayout,
    layouts: bounded.layouts,
    invalid_layouts: bounded.invalid,
    layout_count: domain.rawLayoutCount,
    omitted_layout_count: bounded.omitted,
    grid: GRID,
    metric_catalog: catalog.metrics,
    widget_catalog: catalog.widgets.wire,
  };
}

export async function projectHomeLayoutConfiguration(
  settings: RawHomeLayoutSettings,
  widgets: readonly HomeWidgetDefinition[]
): Promise<HomeProjection> {
  const { domain, catalog, instances } = validateHomeLayoutDomain(
    settings,
    widgets
  );
  const bounded = boundedProjection(domain);
  return {
    revision: await configurationRevision({
      layouts: settings.layouts,
      activeLayout: settings.activeLayout,
    }),
    selected_active_layout: domain.selectedActiveLayout,
    effective_active_layout: domain.effectiveActiveLayout,
    layouts: bounded.layouts,
    invalid_layouts: bounded.invalid,
    layout_count: domain.rawLayoutCount,
    omitted_layout_count: bounded.omitted,
    grid: GRID,
    widget_catalog: catalog.wire,
    configured_widget_instances: instances.wire,
  };
}
