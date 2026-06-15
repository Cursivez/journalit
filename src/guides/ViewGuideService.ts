import { EventRef, WorkspaceLeaf } from 'obsidian';
import type JournalitPlugin from '../main';
import {
  ActiveLeafContext,
  PersistedGuideState,
  PersistedViewGuideData,
  StartGuideSessionOptions,
  StartGuideSessionResult,
  VIEW_GUIDE_SCHEMA_VERSION,
  ViewGuideSession,
} from './types';

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

function parsePersistedGuideState(value: unknown): PersistedGuideState | null {
  const record = asRecord(value);
  if (
    !record ||
    typeof record.guideId !== 'string' ||
    typeof record.viewType !== 'string' ||
    typeof record.guideVersion !== 'number' ||
    typeof record.updatedAt !== 'number' ||
    (record.status !== 'in_progress' &&
      record.status !== 'skipped' &&
      record.status !== 'completed')
  ) {
    return null;
  }

  return {
    guideId: record.guideId,
    viewType: record.viewType,
    guideVersion: record.guideVersion,
    status: record.status,
    updatedAt: record.updatedAt,
    currentStepId:
      typeof record.currentStepId === 'string'
        ? record.currentStepId
        : undefined,
  };
}

function parsePersistedViewGuideData(
  value: unknown
): PersistedViewGuideData | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const guidesRecord = asRecord(record.guides) ?? {};
  const guides: Record<string, PersistedGuideState> = {};
  for (const [guideId, guideState] of Object.entries(guidesRecord)) {
    const parsed = parsePersistedGuideState(guideState);
    if (parsed) {
      guides[guideId] = parsed;
    }
  }

  return {
    schemaVersion:
      typeof record.schemaVersion === 'number'
        ? record.schemaVersion
        : VIEW_GUIDE_SCHEMA_VERSION,
    guides,
  };
}

const VIEW_GUIDES_DATA_KEY = 'viewGuides';

const createDefaultViewGuideData = (): PersistedViewGuideData => ({
  schemaVersion: VIEW_GUIDE_SCHEMA_VERSION,
  guides: {},
});

export class ViewGuideService {
  private plugin: JournalitPlugin;
  private data: PersistedViewGuideData = createDefaultViewGuideData();
  private initialized = false;
  private eventRefs: EventRef[] = [];

  private sessions = new Map<string, ViewGuideSession>();
  private guideToSessionId = new Map<string, string>();
  private leafIds = new WeakMap<WorkspaceLeaf, string>();
  private leafIdCounter = 0;
  private sessionCounter = 0;

  private activeLeafContext: ActiveLeafContext = {
    leafId: null,
    viewType: null,
  };
  private activeLeaf: WorkspaceLeaf | null = null;
  private saveQueue: Promise<void> = Promise.resolve();
  private listeners = new Set<() => void>();
  private resolvedGuideByLeafId = new Map<string, string>();

  constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await this.loadData();

    this.eventRefs.push(
      this.plugin.app.workspace.on('active-leaf-change', (leaf) => {
        this.syncActiveLeafContext(leaf);
      })
    );

    this.eventRefs.push(
      this.plugin.app.workspace.on('layout-change', () => {
        this.syncActiveLeafContext();
      })
    );

    this.syncActiveLeafContext();

    this.initialized = true;
  }

  async destroy(): Promise<void> {
    for (const eventRef of this.eventRefs) {
      this.plugin.app.workspace.offref(eventRef);
    }
    this.eventRefs = [];

    await this.saveData();

    for (const session of this.sessions.values()) {
      session.status = 'ended';
    }

    this.sessions.clear();
    this.guideToSessionId.clear();
    this.resolvedGuideByLeafId.clear();
    this.activeLeaf = null;
    this.activeLeafContext = {
      leafId: null,
      viewType: null,
    };
    this.initialized = false;
    this.emitChange();
    this.listeners.clear();
  }

  getActiveLeafContext(): ActiveLeafContext {
    return this.activeLeafContext;
  }

  getActiveLeaf(): WorkspaceLeaf | null {
    return this.activeLeaf;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  syncWorkspaceContext(leaf?: WorkspaceLeaf | null): void {
    this.syncActiveLeafContext(leaf);
  }

  setResolvedGuideForLeaf(leaf: WorkspaceLeaf, guideId: string | null): void {
    const leafId = this.getLeafId(leaf);
    const current = this.resolvedGuideByLeafId.get(leafId) ?? null;

    if (!guideId) {
      if (current !== null) {
        this.resolvedGuideByLeafId.delete(leafId);
        this.emitChange();
      }
      return;
    }

    if (current === guideId) {
      return;
    }

    this.resolvedGuideByLeafId.set(leafId, guideId);
    this.emitChange();
  }

  getResolvedGuideForLeaf(leaf: WorkspaceLeaf): string | null {
    const leafId = this.getLeafId(leaf);
    return this.resolvedGuideByLeafId.get(leafId) ?? null;
  }

  getSessionForLeaf(
    leaf: WorkspaceLeaf,
    viewType?: string
  ): ViewGuideSession | null {
    const leafId = this.getLeafId(leaf);

    for (const session of this.sessions.values()) {
      if (session.status === 'ended') {
        continue;
      }

      if (session.leafId !== leafId) {
        continue;
      }

      if (viewType && session.viewType !== viewType) {
        continue;
      }

      return session;
    }

    return null;
  }

  shouldAutoShowGuide(guideId: string, guideVersion: number): boolean {
    const persisted = this.data.guides[guideId];

    if (!persisted) {
      return true;
    }

    if (persisted.status === 'completed' || persisted.status === 'skipped') {
      return false;
    }

    if (persisted.guideVersion !== guideVersion) {
      return true;
    }

    return true;
  }

  getPersistedGuideState(guideId: string): PersistedGuideState | null {
    return this.data.guides[guideId] ?? null;
  }

  getSession(sessionId: string): ViewGuideSession | null {
    return this.sessions.get(sessionId) ?? null;
  }

  getSessionForGuide(guideId: string): ViewGuideSession | null {
    const sessionId = this.guideToSessionId.get(guideId);
    if (!sessionId) {
      return null;
    }

    return this.sessions.get(sessionId) ?? null;
  }

  getSessionForGuideAndLeaf(
    guideId: string,
    leaf: WorkspaceLeaf
  ): ViewGuideSession | null {
    const session = this.getSessionForGuide(guideId);
    if (!session) {
      return null;
    }

    const leafId = this.getLeafId(leaf);
    if (session.leafId !== leafId) {
      return null;
    }

    return session;
  }

  async startOrResumeSession(
    options: StartGuideSessionOptions
  ): Promise<StartGuideSessionResult> {
    const {
      guideId,
      guideVersion,
      initialStepId,
      forceRestart = false,
    } = options;

    if (!initialStepId || initialStepId.trim() === '') {
      return { session: null, reason: 'invalid-initial-step' };
    }

    const leafId = this.getLeafId(options.leaf);
    const existing = this.getSessionForGuide(guideId);

    if (!this.activeLeaf) {
      this.activeLeaf = options.leaf;
      this.activeLeafContext = this.resolveLeafContext(options.leaf);
    }

    if (existing && existing.status !== 'ended') {
      if (forceRestart) {
        this.sessions.delete(existing.sessionId);
        this.guideToSessionId.delete(existing.guideId);
      } else if (
        existing.leafId !== leafId &&
        !this.isLeafIdStillOpen(existing.leafId, existing.viewType)
      ) {
        this.sessions.delete(existing.sessionId);
        this.guideToSessionId.delete(existing.guideId);
      } else if (existing.leafId !== leafId) {
        return {
          session: existing,
          reason: 'already-running-in-other-leaf',
        };
      } else if (existing.status === 'paused') {
        existing.status = 'active';
        existing.updatedAt = Date.now();
        await this.persistInProgress(existing);
        this.emitChange();
        return { session: existing, reason: 'resumed' };
      } else {
        return { session: existing, reason: 'already-running' };
      }
    }

    if (!forceRestart && !this.shouldAutoShowGuide(guideId, guideVersion)) {
      return { session: null, reason: 'suppressed' };
    }

    const persisted = this.data.guides[guideId];
    const shouldResumePersisted =
      !forceRestart &&
      persisted?.guideVersion === guideVersion &&
      persisted.status === 'in_progress' &&
      persisted.currentStepId;

    const now = Date.now();
    const sessionId = this.nextSessionId(guideId);
    const session: ViewGuideSession = {
      sessionId,
      guideId,
      viewType: options.leaf.view.getViewType(),
      guideVersion,
      leafId,
      currentStepId: shouldResumePersisted
        ? persisted.currentStepId!
        : initialStepId,
      status: 'active',
      startedAt: now,
      updatedAt: now,
    };

    this.sessions.set(sessionId, session);
    this.guideToSessionId.set(guideId, sessionId);

    await this.persistInProgress(session);
    this.emitChange();

    return {
      session,
      reason: shouldResumePersisted ? 'resumed' : 'started',
    };
  }

  async updateSessionStep(sessionId: string, stepId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status === 'ended') {
      return false;
    }

    if (!stepId || stepId.trim() === '') {
      return false;
    }

    session.currentStepId = stepId;
    session.updatedAt = Date.now();

    await this.persistInProgress(session);
    this.emitChange();
    return true;
  }

  async pauseSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'active') {
      return false;
    }

    session.status = 'paused';
    session.updatedAt = Date.now();

    await this.persistInProgress(session);
    this.emitChange();
    return true;
  }

  async resumeSession(
    sessionId: string,
    leaf: WorkspaceLeaf
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status === 'ended') {
      return false;
    }

    const leafId = this.getLeafId(leaf);
    if (session.leafId !== leafId) {
      return false;
    }

    session.status = 'active';
    session.updatedAt = Date.now();

    await this.persistInProgress(session);
    this.emitChange();
    return true;
  }

  async completeSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status === 'ended') {
      return false;
    }

    session.status = 'ended';
    session.updatedAt = Date.now();

    await this.persistTerminalState(session, 'completed');
    this.sessions.delete(sessionId);
    this.guideToSessionId.delete(session.guideId);
    this.emitChange();
    return true;
  }

  async skipSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status === 'ended') {
      return false;
    }

    session.status = 'ended';
    session.updatedAt = Date.now();

    await this.persistTerminalState(session, 'skipped');
    this.sessions.delete(sessionId);
    this.guideToSessionId.delete(session.guideId);
    this.emitChange();
    return true;
  }

  async clearGuideState(guideId: string): Promise<void> {
    delete this.data.guides[guideId];

    const runningSessionId = this.guideToSessionId.get(guideId);
    if (runningSessionId) {
      this.sessions.delete(runningSessionId);
      this.guideToSessionId.delete(guideId);
    }

    await this.saveData();
    this.emitChange();
  }

  isSessionVisible(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'active') {
      return false;
    }

    return (
      session.leafId === this.activeLeafContext.leafId &&
      session.viewType === this.activeLeafContext.viewType
    );
  }

  private nextSessionId(guideId: string): string {
    this.sessionCounter += 1;
    return `${guideId}:${Date.now()}:${this.sessionCounter}`;
  }

  private getLeafId(leaf: WorkspaceLeaf): string {
    const existing = this.leafIds.get(leaf);
    if (existing) {
      return existing;
    }

    const withId = leaf as WorkspaceLeaf & {
      id?: string | number;
    };

    const derivedId = withId.id
      ? `obsidian-leaf-${String(withId.id)}`
      : `journalit-leaf-${++this.leafIdCounter}`;

    this.leafIds.set(leaf, derivedId);
    return derivedId;
  }

  private getCurrentActiveLeaf(): WorkspaceLeaf | null {
    return this.plugin.app.workspace.getMostRecentLeaf();
  }

  private syncActiveLeafContext(leaf?: WorkspaceLeaf | null): void {
    const nextActiveLeaf = leaf ?? this.getCurrentActiveLeaf();
    const nextActiveLeafContext = this.resolveLeafContext(nextActiveLeaf);

    this.activeLeaf = nextActiveLeaf;
    this.activeLeafContext = nextActiveLeafContext;

    if (!nextActiveLeafContext.leafId || !nextActiveLeafContext.viewType) {
      this.pauseAllActiveSessions();
      this.emitChange();
      return;
    }

    this.pauseSessionsOutsideActiveContext(nextActiveLeafContext);
    this.resumeSessionsInsideActiveContext(nextActiveLeafContext);
    this.emitChange();
  }

  private isLeafIdStillOpen(leafId: string, viewType: string): boolean {
    const openLeaves = this.plugin.app.workspace.getLeavesOfType(viewType);

    return openLeaves.some((leaf) => this.getLeafId(leaf) === leafId);
  }

  private resolveLeafContext(leaf: WorkspaceLeaf | null): ActiveLeafContext {
    if (!leaf?.view) {
      return {
        leafId: null,
        viewType: null,
      };
    }

    return {
      leafId: this.getLeafId(leaf),
      viewType: leaf.view.getViewType(),
    };
  }

  private pauseAllActiveSessions(): void {
    for (const session of this.sessions.values()) {
      if (session.status === 'active') {
        session.status = 'paused';
        session.updatedAt = Date.now();
      }
    }
  }

  private pauseSessionsOutsideActiveContext(
    activeContext: ActiveLeafContext
  ): void {
    for (const session of this.sessions.values()) {
      const isOutsideContext =
        session.leafId !== activeContext.leafId ||
        session.viewType !== activeContext.viewType;

      if (session.status === 'active' && isOutsideContext) {
        session.status = 'paused';
        session.updatedAt = Date.now();
      }
    }
  }

  private resumeSessionsInsideActiveContext(
    activeContext: ActiveLeafContext
  ): void {
    for (const session of this.sessions.values()) {
      const isInsideContext =
        session.leafId === activeContext.leafId &&
        session.viewType === activeContext.viewType;

      if (session.status === 'paused' && isInsideContext) {
        session.status = 'active';
        session.updatedAt = Date.now();
      }
    }
  }

  private emitChange(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (error) {
        console.error('[ViewGuideService] Listener callback failed:', error);
      }
    }
  }

  private async persistInProgress(session: ViewGuideSession): Promise<void> {
    this.data.guides[session.guideId] = {
      guideId: session.guideId,
      viewType: session.viewType,
      guideVersion: session.guideVersion,
      status: 'in_progress',
      currentStepId: session.currentStepId,
      updatedAt: Date.now(),
    };

    await this.saveData();
  }

  private async persistTerminalState(
    session: ViewGuideSession,
    status: 'completed' | 'skipped'
  ): Promise<void> {
    this.data.guides[session.guideId] = {
      guideId: session.guideId,
      viewType: session.viewType,
      guideVersion: session.guideVersion,
      status,
      updatedAt: Date.now(),
    };

    await this.saveData();
  }

  private async loadData(): Promise<void> {
    try {
      const pluginData = asRecord(await this.plugin.loadData()) ?? {};
      const localMeta = asRecord(pluginData.localMeta);
      const persisted = parsePersistedViewGuideData(
        localMeta?.[VIEW_GUIDES_DATA_KEY]
      );

      this.data = persisted ?? createDefaultViewGuideData();
    } catch (error) {
      console.error('[ViewGuideService] Failed to load guide data:', error);
      this.data = createDefaultViewGuideData();
    }
  }

  private async saveData(): Promise<void> {
    this.saveQueue = this.saveQueue
      .catch(() => {
        // intentional
      })
      .then(() => this.saveDataInternal());

    await this.saveQueue;
  }

  private async saveDataInternal(): Promise<void> {
    try {
      if (this.plugin.settingsManager?.updateLocalMetaSection) {
        await this.plugin.settingsManager.updateLocalMetaSection(
          VIEW_GUIDES_DATA_KEY,
          this.data
        );
        return;
      }

      const pluginData = asRecord(await this.plugin.loadData()) ?? {};
      const localMeta = asRecord(pluginData.localMeta) ?? {};

      localMeta[VIEW_GUIDES_DATA_KEY] = this.data;

      await this.plugin.saveData({
        ...pluginData,
        localMeta,
      });
    } catch (error) {
      console.error('[ViewGuideService] Failed to save guide data:', error);
    }
  }
}
