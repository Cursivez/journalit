import type { MetricDefinition } from '../../../components/dashboard/components/TopSection/types';
import { defineOwnEntry } from '../../../utils/defineOwnEntry';
import type { WidgetDefinition } from '../../../components/dashboard/components/BottomSection/types';
import type { HomeWidgetDefinition } from '../../../components/home/homeTypes';
import type {
  DashboardLayoutArtifact,
  HomeLayoutArtifact,
  LayoutChange,
  LayoutChangeSummary,
  LayoutSurface,
} from './configurationChangeTypes';
import {
  throwIfAborted,
  type PlannedConfigurationChange,
} from './configurationPlan';
import {
  projectDashboardLayoutConfiguration,
  projectHomeLayoutConfiguration,
  isStrictName,
  type RawHomeLayoutSettings,
} from './layoutConfiguration';
import {
  canonicalizeConfigurationValue,
  configurationRevision,
  isRecord,
} from './configurationPrimitives';

type Domain = LayoutSurface;
type DashboardArtifact = DashboardLayoutArtifact;
type HomeArtifact = HomeLayoutArtifact;

type LayoutMutationErrorCode =
  | 'invalid_request'
  | 'not_found'
  | 'conflict'
  | 'limit_exceeded';
export class LayoutConfigurationError extends Error {
  constructor(readonly code: LayoutMutationErrorCode) {
    super('Layout mutation failed.');
    this.name = 'LayoutConfigurationError';
  }
}

interface LayoutSettingsSnapshot {
  layouts: unknown;
  activeLayout: unknown;
  embeddedNotes?: unknown;
  goals?: unknown;
  topBreakdowns?: unknown;
  streaks?: unknown;
}

type AnySummary = LayoutChangeSummary;
type AnyArtifact = DashboardArtifact | HomeArtifact;

interface Materialized {
  state: LayoutRevisionState;
  command: LayoutWriteCommand;
  summary: AnySummary;
  artifact?: AnyArtifact;
}

interface LayoutRevisionState {
  layouts: Record<string, unknown>;
  activeLayout: unknown;
}

interface LayoutWriteCommand {
  layouts: Record<string, unknown>;
  activeLayout?: string;
  homeRemovals: HomeConfigurationReference[];
}

export interface LayoutPlanSummary {
  base_revision: string;
  resulting_revision: string;
  change: AnySummary;
  layout?: AnyArtifact;
}

interface Dependencies {
  getSettings(): LayoutSettingsSnapshot;
  saveSettings(command: LayoutWriteCommand): Promise<void>;
  metrics?: readonly MetricDefinition[];
  dashboardWidgets?: readonly WidgetDefinition[];
  homeWidgets?: readonly HomeWidgetDefinition[];
}

function clone<T>(value: T): T {
  return structuredClone(value);
}
const BREAKPOINTS = ['lg', 'md', 'sm', 'xs', 'xxs'] as const;

interface WirePlacement {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
}

interface PersistedPlacement {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
}

type WireBreakpoints = Record<(typeof BREAKPOINTS)[number], WirePlacement[]>;
type PersistedBreakpoints = Record<
  (typeof BREAKPOINTS)[number],
  PersistedPlacement[]
>;
interface OmissionCounts {
  lg: number;
  md: number;
  sm: number;
  xs: number;
  xxs: number;
}

function revision(
  settings: Pick<LayoutSettingsSnapshot, 'layouts' | 'activeLayout'>
) {
  return configurationRevision({
    layouts: settings.layouts,
    activeLayout: settings.activeLayout,
  });
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isWirePlacement(value: unknown): value is WirePlacement {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    isFiniteNumber(value.x) &&
    isFiniteNumber(value.y) &&
    isFiniteNumber(value.w) &&
    isFiniteNumber(value.h) &&
    (value.static === undefined || typeof value.static === 'boolean')
  );
}

function isPersistedPlacement(value: unknown): value is PersistedPlacement {
  return (
    isRecord(value) &&
    typeof value.i === 'string' &&
    isFiniteNumber(value.x) &&
    isFiniteNumber(value.y) &&
    isFiniteNumber(value.w) &&
    isFiniteNumber(value.h) &&
    (value.static === undefined || typeof value.static === 'boolean')
  );
}

function isWireBreakpoints(value: unknown): value is WireBreakpoints {
  return (
    isRecord(value) &&
    BREAKPOINTS.every(
      (breakpoint) =>
        Array.isArray(value[breakpoint]) &&
        value[breakpoint].every(isWirePlacement)
    )
  );
}

function isPersistedBreakpoints(value: unknown): value is PersistedBreakpoints {
  return (
    isRecord(value) &&
    BREAKPOINTS.every(
      (breakpoint) =>
        Array.isArray(value[breakpoint]) &&
        value[breakpoint].every(isPersistedPlacement)
    )
  );
}

function isOmissionCounts(value: unknown): value is OmissionCounts {
  return (
    isRecord(value) &&
    isFiniteNumber(value.lg) &&
    isFiniteNumber(value.md) &&
    isFiniteNumber(value.sm) &&
    isFiniteNumber(value.xs) &&
    isFiniteNumber(value.xxs)
  );
}

function toPersistedBreakpoints(
  breakpoints: WireBreakpoints
): PersistedBreakpoints {
  const convert = (placement: WirePlacement): PersistedPlacement => ({
    i: placement.id,
    x: placement.x,
    y: placement.y,
    w: placement.w,
    h: placement.h,
    ...(placement.static === undefined ? {} : { static: placement.static }),
  });
  return {
    lg: breakpoints.lg.map(convert),
    md: breakpoints.md.map(convert),
    sm: breakpoints.sm.map(convert),
    xs: breakpoints.xs.map(convert),
    xxs: breakpoints.xxs.map(convert),
  };
}

function toWireBreakpoints(breakpoints: PersistedBreakpoints): WireBreakpoints {
  const convert = (placement: PersistedPlacement): WirePlacement => ({
    id: placement.i,
    x: placement.x,
    y: placement.y,
    w: placement.w,
    h: placement.h,
    ...(placement.static === undefined ? {} : { static: placement.static }),
  });
  return {
    lg: breakpoints.lg.map(convert),
    md: breakpoints.md.map(convert),
    sm: breakpoints.sm.map(convert),
    xs: breakpoints.xs.map(convert),
    xxs: breakpoints.xxs.map(convert),
  };
}

function parseMutationArtifact(
  domain: Domain,
  value: unknown
): AnyArtifact | undefined {
  if (
    !isRecord(value) ||
    typeof value.name !== 'string' ||
    !isWireBreakpoints(value.breakpoints) ||
    !isOmissionCounts(value.omitted_placement_counts)
  )
    return undefined;
  const omitted = value.omitted_placement_counts;
  const omittedPlacementCounts = {
    lg: omitted.lg,
    md: omitted.md,
    sm: omitted.sm,
    xs: omitted.xs,
    xxs: omitted.xxs,
  };
  if (domain === 'dashboard') {
    if (
      !Array.isArray(value.top_section) ||
      !value.top_section.every((metric) => typeof metric === 'string') ||
      !isFiniteNumber(value.omitted_metric_count)
    )
      return undefined;
    return {
      name: value.name,
      top_section: value.top_section,
      breakpoints: value.breakpoints,
      omitted_placement_counts: omittedPlacementCounts,
      omitted_metric_count: value.omitted_metric_count,
    };
  }
  return {
    name: value.name,
    breakpoints: value.breakpoints,
    omitted_placement_counts: omittedPlacementCounts,
  };
}

function persistedContent<D extends Domain>(
  domain: D,
  layout: unknown
): unknown {
  if (domain === 'dashboard') {
    if (
      !isRecord(layout) ||
      !Array.isArray(layout.top_section) ||
      !layout.top_section.every((metric) => typeof metric === 'string') ||
      !isWireBreakpoints(layout.breakpoints)
    )
      throw new LayoutConfigurationError('invalid_request');
    return {
      topSection: clone(layout.top_section),
      bottomSection: toPersistedBreakpoints(layout.breakpoints),
    };
  }
  if (!isRecord(layout) || !isWireBreakpoints(layout.breakpoints))
    throw new LayoutConfigurationError('invalid_request');
  return toPersistedBreakpoints(layout.breakpoints);
}

function contractBreakpoints(content: unknown, domain: Domain) {
  if (!isRecord(content)) throw new LayoutConfigurationError('invalid_request');
  const persisted = domain === 'dashboard' ? content.bottomSection : content;
  if (!isPersistedBreakpoints(persisted))
    throw new LayoutConfigurationError('invalid_request');
  return toWireBreakpoints(persisted);
}

function structurallyEqual(left: unknown, right: unknown): boolean {
  return (
    JSON.stringify(canonicalizeConfigurationValue(left)) ===
    JSON.stringify(canonicalizeConfigurationValue(right))
  );
}

function zeroOmissions(
  value: Partial<Record<(typeof BREAKPOINTS)[number], number>>
): boolean {
  return BREAKPOINTS.every((breakpoint) => value[breakpoint] === 0);
}

async function projectIsolatedLayout(
  domain: Domain,
  name: string,
  content: unknown,
  dependencies: Dependencies,
  settings: LayoutSettingsSnapshot
) {
  if (domain === 'dashboard') {
    return projectDashboardLayoutConfiguration(
      { layouts: { [name]: content }, activeLayout: name },
      dependencies.metrics ?? [],
      dependencies.dashboardWidgets ?? []
    );
  }
  return projectHomeLayoutConfiguration(
    {
      layouts: { [name]: content },
      activeLayout: name,
      embeddedNotes: settings.embeddedNotes,
      goals: settings.goals,
      topBreakdowns: settings.topBreakdowns,
      streaks: settings.streaks,
    } satisfies RawHomeLayoutSettings,
    dependencies.homeWidgets ?? []
  );
}

async function validateAndProject(
  domain: Domain,
  name: string,
  content: unknown,
  dependencies: Dependencies,
  settings: LayoutSettingsSnapshot
): Promise<AnyArtifact> {
  const projection = await projectIsolatedLayout(
    domain,
    name,
    content,
    dependencies,
    settings
  );
  const artifact = projection.layouts[0];
  if (artifact === undefined || projection.invalid_layouts.length !== 0)
    throw new LayoutConfigurationError('invalid_request');
  const mutationArtifact = parseMutationArtifact(domain, artifact);
  if (mutationArtifact === undefined)
    throw new Error(
      'Projected layout artifact violated the mutation contract.'
    );
  const submittedBreakpoints = contractBreakpoints(content, domain);
  if (
    !zeroOmissions(mutationArtifact.omitted_placement_counts) ||
    !structurallyEqual(mutationArtifact.breakpoints, submittedBreakpoints)
  )
    throw new LayoutConfigurationError('invalid_request');
  if (
    domain === 'home' &&
    BREAKPOINTS.every(
      (breakpoint) => mutationArtifact.breakpoints[breakpoint].length === 0
    )
  )
    throw new LayoutConfigurationError('invalid_request');
  if (domain === 'dashboard') {
    if (!isRecord(content) || !Array.isArray(content.topSection))
      throw new LayoutConfigurationError('invalid_request');
    if (!('top_section' in mutationArtifact))
      throw new Error('Dashboard projection artifact omitted top_section.');
    if (
      !structurallyEqual(mutationArtifact.top_section, content.topSection) ||
      mutationArtifact.omitted_metric_count !== 0
    )
      throw new LayoutConfigurationError('invalid_request');
  }
  return clone(mutationArtifact);
}

function counts(artifact: AnyArtifact) {
  return {
    lg: artifact.breakpoints.lg.length,
    md: artifact.breakpoints.md.length,
    sm: artifact.breakpoints.sm.length,
    xs: artifact.breakpoints.xs.length,
    xxs: artifact.breakpoints.xxs.length,
  };
}

type HomeConfigurationType =
  | 'embeddedNote'
  | 'goalsProgress'
  | 'setupLeaderboard'
  | 'currentStreak';
interface HomeConfigurationReference {
  type: HomeConfigurationType;
  id: string;
}

const HOME_CONFIGURATION_KEYS = {
  embeddedNote: 'embeddedNotes',
  goalsProgress: 'goals',
  setupLeaderboard: 'topBreakdowns',
  currentStreak: 'streaks',
} as const;

function homeConfigurationType(
  id: string,
  widgets: readonly HomeWidgetDefinition[]
): HomeConfigurationType | undefined {
  for (const widget of widgets) {
    if (
      widget.configurable === true &&
      (widget.id === 'embeddedNote' ||
        widget.id === 'goalsProgress' ||
        widget.id === 'setupLeaderboard' ||
        widget.id === 'currentStreak') &&
      id.startsWith(`${widget.id}-`)
    )
      return widget.id;
  }
  return undefined;
}

function referencedHomeIds(layouts: Record<string, unknown>): {
  readable: boolean;
  ids: Set<string>;
} {
  const ids = new Set<string>();
  let readable = true;
  for (const layout of Object.values(layouts)) {
    if (!isRecord(layout)) {
      readable = false;
      continue;
    }
    for (const breakpoint of BREAKPOINTS) {
      const placements = layout[breakpoint];
      if (placements !== undefined && !Array.isArray(placements)) {
        readable = false;
        continue;
      }
      if (!Array.isArray(placements)) continue;
      for (const placement of placements) {
        if (isRecord(placement) && typeof placement.i === 'string')
          ids.add(placement.i);
      }
    }
  }
  return { readable, ids };
}

function pruneHomeConfiguration(
  settings: LayoutRevisionState,
  previousLayouts: Record<string, unknown>,
  widgets: readonly HomeWidgetDefinition[]
): HomeConfigurationReference[] {
  const layouts = settings.layouts;
  const referenced = referencedHomeIds(layouts);
  const previouslyReferenced = referencedHomeIds(previousLayouts);
  if (!referenced.readable || !previouslyReferenced.readable) return [];
  const removals: HomeConfigurationReference[] = [];
  for (const id of previouslyReferenced.ids) {
    if (referenced.ids.has(id)) continue;
    const type = homeConfigurationType(id, widgets);
    if (type) removals.push({ type, id });
  }
  return removals;
}

function requiredHomeConfiguration(
  settings: LayoutSettingsSnapshot,
  widgets: readonly HomeWidgetDefinition[]
): HomeConfigurationReference[] {
  if (!isRecord(settings.layouts)) return [];
  const references = referencedHomeIds(settings.layouts);
  const required: HomeConfigurationReference[] = [];
  for (const id of references.ids) {
    const type = homeConfigurationType(id, widgets);
    if (type) required.push({ type, id });
  }
  return required;
}

function hasRequiredHomeConfiguration(
  settings: LayoutSettingsSnapshot,
  required: readonly HomeConfigurationReference[]
): boolean {
  return required.every(({ type, id }) => {
    const source = settings[HOME_CONFIGURATION_KEYS[type]];
    return (
      isRecord(source) &&
      Object.getOwnPropertyDescriptor(source, id) !== undefined &&
      isRecord(source[id])
    );
  });
}

function homeRequirementScope(mutation: Materialized): LayoutSettingsSnapshot {
  if (mutation.summary.action === 'delete') {
    return { layouts: {}, activeLayout: mutation.state.activeLayout };
  }
  if (mutation.summary.action === 'set_active') {
    return {
      layouts: {
        [mutation.summary.layout_name]:
          mutation.state.layouts[mutation.summary.layout_name],
      },
      activeLayout: mutation.summary.layout_name,
    };
  }
  if (mutation.artifact === undefined)
    throw new Error('Home mutation completed without a layout artifact.');
  return {
    layouts: {
      [mutation.summary.layout_name]: persistedContent(
        'home',
        mutation.artifact
      ),
    },
    activeLayout: mutation.summary.layout_name,
  };
}

async function normalizedSource(
  domain: Domain,
  name: string,
  source: unknown,
  settings: LayoutSettingsSnapshot,
  dependencies: Dependencies
): Promise<{ artifact: AnyArtifact; persisted: unknown }> {
  if (!isRecord(source)) throw new LayoutConfigurationError('conflict');
  const breakpoints = domain === 'dashboard' ? source.bottomSection : source;
  if (!isRecord(breakpoints)) throw new LayoutConfigurationError('conflict');
  if (domain === 'dashboard') {
    if (!Array.isArray(source.topSection))
      throw new LayoutConfigurationError('conflict');
    if (source.topSection.length > 50)
      throw new LayoutConfigurationError('limit_exceeded');
  }
  const normalizedBreakpoints = clone(breakpoints);
  if (normalizedBreakpoints.xs === undefined)
    normalizedBreakpoints.xs = clone(normalizedBreakpoints.sm);
  if (normalizedBreakpoints.xxs === undefined)
    normalizedBreakpoints.xxs = clone(normalizedBreakpoints.sm);
  const normalizedSourceValue =
    domain === 'dashboard'
      ? { ...source, bottomSection: normalizedBreakpoints }
      : normalizedBreakpoints;
  for (const breakpoint of BREAKPOINTS) {
    const placements = normalizedBreakpoints[breakpoint];
    if (!Array.isArray(placements))
      throw new LayoutConfigurationError('conflict');
    if (placements.length > 100)
      throw new LayoutConfigurationError('limit_exceeded');
  }
  try {
    const artifact = await validateAndProject(
      domain,
      name,
      normalizedSourceValue,
      dependencies,
      settings
    );
    return { artifact, persisted: persistedContent(domain, artifact) };
  } catch (error) {
    if (
      error instanceof LayoutConfigurationError &&
      error.code === 'limit_exceeded'
    )
      throw error;
    throw new LayoutConfigurationError('conflict');
  }
}

async function validateSetActiveTarget<D extends Domain>(
  domain: D,
  name: string,
  source: unknown,
  settings: LayoutSettingsSnapshot,
  dependencies: Dependencies
): Promise<void> {
  const projection = await projectIsolatedLayout(
    domain,
    name,
    source,
    dependencies,
    settings
  );
  const artifact = projection.layouts[0];
  
  
  const hasNoReportedOmissions =
    artifact !== undefined &&
    Object.values(artifact.omitted_placement_counts).every(
      (count) => count === 0
    );
  if (
    artifact === undefined ||
    projection.invalid_layouts.length !== 0 ||
    !hasNoReportedOmissions ||
    (domain === 'dashboard' &&
      (!('omitted_metric_count' in artifact) ||
        artifact.omitted_metric_count !== 0))
  )
    throw new LayoutConfigurationError('conflict');
  if (
    domain === 'home' &&
    BREAKPOINTS.every(
      (breakpoint) => artifact.breakpoints[breakpoint]?.length === 0
    )
  )
    throw new LayoutConfigurationError('conflict');
}

async function materialize(
  domain: Domain,
  settings: LayoutSettingsSnapshot,
  change: LayoutChange,
  dependencies: Dependencies
): Promise<Materialized> {
  if (!isRecord(settings.layouts))
    throw new LayoutConfigurationError('conflict');
  const previousLayouts = settings.layouts;
  const layouts = clone(previousLayouts);
  const action = change;
  if (!isStrictName(action.name))
    throw new LayoutConfigurationError('invalid_request');
  const exists =
    Object.getOwnPropertyDescriptor(layouts, action.name) !== undefined;
  let targetName = action.name;
  let artifact: AnyArtifact | undefined;
  if (action.kind === 'create') {
    if (exists) throw new LayoutConfigurationError('conflict');
    defineOwnEntry(
      layouts,
      action.name,
      persistedContent(domain, action.layout)
    );
    artifact = await validateAndProject(
      domain,
      action.name,
      layouts[action.name],
      dependencies,
      settings
    );
  } else if (action.kind === 'duplicate') {
    if (!isStrictName(action.source_name))
      throw new LayoutConfigurationError('invalid_request');
    const sourceName = action.source_name;
    if (Object.getOwnPropertyDescriptor(layouts, sourceName) === undefined)
      throw new LayoutConfigurationError('not_found');
    if (exists) throw new LayoutConfigurationError('conflict');
    const normalized = await normalizedSource(
      domain,
      sourceName,
      layouts[sourceName],
      settings,
      dependencies
    );
    artifact = { ...normalized.artifact, name: action.name };
    defineOwnEntry(layouts, action.name, normalized.persisted);
  } else if (action.kind === 'update') {
    if (!exists) throw new LayoutConfigurationError('not_found');
    defineOwnEntry(
      layouts,
      action.name,
      persistedContent(domain, action.layout)
    );
    artifact = await validateAndProject(
      domain,
      action.name,
      layouts[action.name],
      dependencies,
      settings
    );
  } else if (action.kind === 'rename') {
    if (!exists) throw new LayoutConfigurationError('not_found');
    if (!isStrictName(action.new_name))
      throw new LayoutConfigurationError('invalid_request');
    if (Object.getOwnPropertyDescriptor(layouts, action.new_name) !== undefined)
      throw new LayoutConfigurationError('conflict');
    targetName = action.new_name;
    const normalized = await normalizedSource(
      domain,
      action.name,
      layouts[action.name],
      settings,
      dependencies
    );
    artifact = { ...normalized.artifact, name: targetName };
    defineOwnEntry(layouts, targetName, normalized.persisted);
    delete layouts[action.name];
  } else if (action.kind === 'delete') {
    if (!exists) throw new LayoutConfigurationError('not_found');
    if (domain === 'dashboard' && action.name === 'Default')
      throw new LayoutConfigurationError('conflict');
    if (settings.activeLayout === action.name)
      throw new LayoutConfigurationError('conflict');
    delete layouts[action.name];
  } else {
    if (!exists) throw new LayoutConfigurationError('not_found');
    await validateSetActiveTarget(
      domain,
      action.name,
      layouts[action.name],
      settings,
      dependencies
    );
  }
  const ownedActiveLayout =
    action.kind === 'set_active'
      ? action.name
      : action.kind === 'rename' && settings.activeLayout === action.name
        ? targetName
        : undefined;
  const state: LayoutRevisionState = {
    layouts,
    activeLayout: ownedActiveLayout ?? settings.activeLayout,
  };
  const homeRemovals =
    domain === 'home'
      ? pruneHomeConfiguration(
          state,
          previousLayouts,
          dependencies.homeWidgets ?? []
        )
      : [];
  const command: LayoutWriteCommand = {
    layouts,
    ...(ownedActiveLayout === undefined
      ? {}
      : { activeLayout: ownedActiveLayout }),
    homeRemovals,
  };
  let summary: AnySummary;
  if (action.kind === 'delete') {
    summary = {
      action: 'delete',
      layout_name: action.name,
      message: `Delete layout “${action.name}”.`,
    };
  } else if (action.kind === 'set_active') {
    summary = {
      action: 'set_active',
      layout_name: action.name,
      message: `Set “${action.name}” as the active layout.`,
    };
  } else {
    if (artifact === undefined)
      throw new Error('Mutation action completed without a layout artifact.');
    const mutationSummary = {
      action: action.kind,
      layout_name: targetName,
      placement_counts: counts(artifact),
      message: `${action.kind === 'create' ? 'Create' : action.kind === 'duplicate' ? 'Duplicate' : action.kind === 'update' ? 'Update' : 'Rename'} layout “${targetName}”.`,
    };
    if (domain === 'dashboard') {
      if (!('top_section' in artifact))
        throw new Error('Dashboard mutation artifact omitted top_section.');
      summary = {
        ...mutationSummary,
        metric_count: artifact.top_section.length,
      };
    } else {
      summary = mutationSummary;
    }
  }
  return {
    state,
    command,
    summary,
    ...(artifact ? { artifact } : {}),
  };
}


class LayoutPlanner<D extends Domain> {
  constructor(
    private readonly domain: D,
    private readonly dependencies: Dependencies
  ) {}

  async plan(
    change: LayoutChange<D>,
    signal: AbortSignal
  ): Promise<PlannedConfigurationChange<LayoutPlanSummary>> {
    throwIfAborted(signal);
    const current = this.dependencies.getSettings();
    
    const [baseRevision, mutation] = await Promise.all([
      revision(current),
      materialize(this.domain, current, change, this.dependencies),
    ]);
    const resultingRevision = await revision(mutation.state);
    const required =
      this.domain === 'home'
        ? requiredHomeConfiguration(
            homeRequirementScope(mutation),
            this.dependencies.homeWidgets ?? []
          )
        : [];
    throwIfAborted(signal);
    const summary: LayoutPlanSummary = {
      base_revision: baseRevision,
      resulting_revision: resultingRevision,
      change: clone(mutation.summary),
      ...(mutation.artifact ? { layout: clone(mutation.artifact) } : {}),
    };
    const command = clone(mutation.command);
    return {
      summary,
      execute: async (executionSignal) => {
        throwIfAborted(executionSignal);
        const latest = this.dependencies.getSettings();
        if ((await revision(latest)) !== baseRevision)
          throw new LayoutConfigurationError('conflict');
        if (
          this.domain === 'home' &&
          !hasRequiredHomeConfiguration(latest, required)
        )
          throw new LayoutConfigurationError('conflict');
        throwIfAborted(executionSignal);
        await this.dependencies.saveSettings(clone(command));
      },
    };
  }
}

export class DashboardLayoutPlanner extends LayoutPlanner<'dashboard'> {
  constructor(dependencies: Dependencies) {
    super('dashboard', dependencies);
  }
}
export class HomeLayoutPlanner extends LayoutPlanner<'home'> {
  constructor(dependencies: Dependencies) {
    super('home', dependencies);
  }
}
