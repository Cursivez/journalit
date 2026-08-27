

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TFile } from 'obsidian';
import JournalitPlugin from '../../../main';
import { Button } from '../../../components/ui/Button';
import { NoTooltipButton } from '../../../components/ui/NoTooltipButton';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import { Tooltip } from '../../../components/shared/Tooltip';
import { TradeGateSection } from './tradeGate/TradeGateSection';
import {
  ChevronDown,
  ChevronRight,
  Check,
  Edit,
  Info,
  Plus,
  Radio,
  RotateCcw,
  Search,
  Trash2,
  X,
} from '../../../components/shared/icons/ObsidianIcon';
import { eventBus } from '../../../services/events/EventBus';
import { t } from '../../../lang/helpers';
import { generateUUID } from '../../../utils/uuid';
import { DEFAULT_SETTINGS } from '../../types';
import {
  DEFAULT_SESSION_LOG_TAGS,
  SessionLogTagDefinition,
} from '../../../types/sessionLog';
import type {
  SessionModeLinkedResource,
  SessionModePhaseLayouts,
  SessionModeSettings,
  SessionModeConfigurablePhase,
  SessionModeLayoutModuleId,
  SessionModeWindow,
  TradeGateQuestion,
  TradeGateWorkflow,
} from '../../../types/sessionMode';
import {
  getDefaultSessionModePhaseLayouts,
  getSessionModeModulesForPhase,
  normalizeSessionModePhaseLayouts,
  SESSION_MODE_CONFIGURABLE_PHASES,
} from '../../../utils/sessionModeLayout';

interface SessionModeTabProps {
  plugin: JournalitPlugin;
}

interface SessionModeWindowNameInputProps {
  sessionWindow: SessionModeWindow;
  stageWindowUpdate: (id: string, updates: Partial<SessionModeWindow>) => void;
  persistWindowUpdate: (
    id: string,
    updates: Partial<SessionModeWindow>
  ) => Promise<void>;
}

function SessionModeWindowNameInput({
  sessionWindow,
  stageWindowUpdate,
  persistWindowUpdate,
}: SessionModeWindowNameInputProps) {
  const pendingNameRef = useRef<string | null>(null);
  const persistTimerRef = useRef<number | null>(null);
  const persistWindowUpdateRef = useRef(persistWindowUpdate);

  useEffect(() => {
    persistWindowUpdateRef.current = persistWindowUpdate;
  }, [persistWindowUpdate]);

  useEffect(
    () => () => {
      if (persistTimerRef.current !== null) {
        window.clearTimeout(persistTimerRef.current);
      }
      if (pendingNameRef.current !== null) {
        void persistWindowUpdateRef.current(sessionWindow.id, {
          name: pendingNameRef.current,
        });
      }
    },
    [sessionWindow.id]
  );

  const updateName = (name: string) => {
    stageWindowUpdate(sessionWindow.id, { name });
    pendingNameRef.current = name;

    if (persistTimerRef.current !== null) {
      window.clearTimeout(persistTimerRef.current);
    }

    persistTimerRef.current = window.setTimeout(() => {
      pendingNameRef.current = null;
      persistTimerRef.current = null;
      void persistWindowUpdateRef.current(sessionWindow.id, { name });
    }, 350);
  };

  return (
    <input
      id={`session-mode-window-name-${sessionWindow.id}`}
      type="text"
      defaultValue={sessionWindow.name}
      placeholder={t('settings.session-mode.window-name-placeholder')}
      onChange={(event) => updateName(event.target.value)}
      className="setting-input journalit-settings-input"
      aria-label={t('settings.session-mode.window-name')}
    />
  );
}

const SESSION_LOG_TAG_COLORS = [
  'blue',
  'indigo',
  'purple',
  'green',
  'pink',
  'amber',
  'red',
  'orange',
] as const;

const NEW_SESSION_LOG_TAG_PREFIX = 'new-session-log-tag';

type SessionLogTagDraft = Omit<SessionLogTagDefinition, 'id'>;

const createEmptyTagDraft = (): SessionLogTagDraft => ({
  label: '',
  shortLabel: '',
  color: 'blue',
  requiresResolution: false,
  lessonTag: false,
});

const normalizeTagDraft = (draft: SessionLogTagDraft): SessionLogTagDraft => ({
  label: draft.label.trim(),
  shortLabel: draft.shortLabel.trim().toUpperCase(),
  color: draft.color,
  requiresResolution: draft.requiresResolution,
  lessonTag: draft.lessonTag,
});

function ensureSessionModeSettings(plugin: JournalitPlugin): void {
  if (!plugin.settings.sessionMode) {
    plugin.settings.sessionMode = {
      ...DEFAULT_SETTINGS.sessionMode,
      sessionWindows: [...DEFAULT_SETTINGS.sessionMode.sessionWindows],
      linkedResources: [...DEFAULT_SETTINGS.sessionMode.linkedResources],
      tradeGateQuestions: [...DEFAULT_SETTINGS.sessionMode.tradeGateQuestions],
      tradeGateWorkflows: [...DEFAULT_SETTINGS.sessionMode.tradeGateWorkflows],
      phaseLayouts: getDefaultSessionModePhaseLayouts(),
    };
  }
}

function createDefaultSessionModeWindow(): SessionModeWindow {
  return {
    id: generateUUID(),
    name: '',
    startTime: '09:30',
    endTime: '12:30',
  };
}

function getAvailableResourceFiles(
  plugin: JournalitPlugin,
  linkedResources: SessionModeLinkedResource[],
  resourceSearchQuery: string
): TFile[] {
  const normalizedQuery = resourceSearchQuery.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return plugin.app.vault
    .getFiles()
    .filter(
      (file) =>
        !linkedResources.some((resource) => resource.path === file.path) &&
        (file.path.toLowerCase().includes(normalizedQuery) ||
          file.basename.toLowerCase().includes(normalizedQuery))
    )
    .sort((a, b) => a.path.localeCompare(b.path))
    .slice(0, 50);
}

async function saveSessionLogTags(
  plugin: JournalitPlugin,
  tags: SessionLogTagDefinition[]
): Promise<void> {
  plugin.settings.drc = { ...plugin.settings.drc, sessionLogTags: tags };
  await plugin.saveSettings();
  eventBus.publish('settings:changed', {
    section: 'drc',
    source: 'session-log-tag-settings',
  });
}

async function saveSessionModeSettings(
  plugin: JournalitPlugin,
  nextSettings: SessionModeSettings
): Promise<void> {
  plugin.settings.sessionMode = nextSettings;
  await plugin.saveSettings();
  eventBus.publish('settings:changed', {
    section: 'sessionMode',
    source: 'session-mode-settings',
  });
}

type SessionModeSettingsUpdates = Partial<
  Pick<
    SessionModeSettings,
    | 'sessionWindows'
    | 'preparationLeadTimeMinutes'
    | 'linkedResources'
    | 'tradeGateQuestions'
    | 'tradeGateWorkflows'
    | 'phaseLayouts'
  >
>;

function buildSessionModeSettings(
  latestSettings: SessionModeSettings,
  updates: SessionModeSettingsUpdates
): SessionModeSettings {
  const merged = { ...latestSettings, ...updates };
  return {
    ...merged,
    phaseLayouts: normalizeSessionModePhaseLayouts(merged.phaseLayouts),
  };
}

function SessionModeWindowRow({
  window,
  stageWindowUpdate,
  updateWindow,
  removeWindow,
}: {
  window: SessionModeWindow;
  stageWindowUpdate: (id: string, updates: Partial<SessionModeWindow>) => void;
  updateWindow: (
    id: string,
    updates: Partial<SessionModeWindow>
  ) => Promise<void>;
  removeWindow: (id: string) => Promise<void>;
}) {
  return (
    <div className="journalit-session-mode-window-row">
      <div className="journalit-session-mode-window-field journalit-session-mode-window-name-field">
        <label
          className="setting-item-description"
          htmlFor={`session-mode-window-name-${window.id}`}
        >
          {t('settings.session-mode.window-name')}
        </label>
        <SessionModeWindowNameInput
          sessionWindow={window}
          stageWindowUpdate={stageWindowUpdate}
          persistWindowUpdate={updateWindow}
        />
      </div>
      <div className="journalit-session-mode-window-field">
        <label
          className="setting-item-description"
          htmlFor={`session-mode-window-start-${window.id}`}
        >
          {t('settings.session-mode.start-time')}
        </label>
        <input
          id={`session-mode-window-start-${window.id}`}
          type="time"
          value={window.startTime}
          onChange={(event) =>
            void updateWindow(window.id, {
              startTime: event.target.value,
            })
          }
          className="setting-input time-input journalit-settings-input journalit-settings-input--time"
          aria-label={t('settings.session-mode.start-time')}
        />
      </div>
      <div className="journalit-session-mode-window-field">
        <label
          className="setting-item-description"
          htmlFor={`session-mode-window-end-${window.id}`}
        >
          {t('settings.session-mode.end-time')}
        </label>
        <input
          id={`session-mode-window-end-${window.id}`}
          type="time"
          value={window.endTime}
          onChange={(event) =>
            void updateWindow(window.id, {
              endTime: event.target.value,
            })
          }
          className="setting-input time-input journalit-settings-input journalit-settings-input--time"
          aria-label={t('settings.session-mode.end-time')}
        />
      </div>
      <div className="journalit-session-mode-window-delete-field">
        <NoTooltipButton
          label={t('button.delete')}
          className="journalit-session-mode-delete-window-button"
          onClick={() => void removeWindow(window.id)}
        >
          <Trash2 size={24} aria-hidden="true" />
        </NoTooltipButton>
      </div>
    </div>
  );
}

function SessionModeSettingsSection({ plugin }: SessionModeTabProps) {
  const [, setSettingsVersion] = useState(0);
  const sessionModeSettings = plugin.settings.sessionMode;
  const sessionWindows = sessionModeSettings.sessionWindows;
  const linkedResources = sessionModeSettings.linkedResources;
  const tradeGateQuestions = sessionModeSettings.tradeGateQuestions;
  const tradeGateWorkflows = sessionModeSettings.tradeGateWorkflows;
  const phaseLayouts = normalizeSessionModePhaseLayouts(
    sessionModeSettings.phaseLayouts
  );
  const sessionLogTags = plugin.settings.drc.sessionLogTags;
  const [resourceSearchQuery, setResourceSearchQuery] = useState('');
  const sessionModeSettingsRef = useRef(sessionModeSettings);
  useLayoutEffect(() => {
    sessionModeSettingsRef.current = sessionModeSettings;
  }, [sessionModeSettings]);

  const availableResourceFiles = useMemo(
    () =>
      getAvailableResourceFiles(plugin, linkedResources, resourceSearchQuery),
    [linkedResources, plugin, resourceSearchQuery]
  );

  const persistSessionModeSettings = async (
    updates: SessionModeSettingsUpdates
  ) => {
    const optimisticSettings = buildSessionModeSettings(
      sessionModeSettingsRef.current,
      updates
    );
    sessionModeSettingsRef.current = optimisticSettings;
    await saveSessionModeSettings(plugin, optimisticSettings);
    setSettingsVersion((previous) => previous + 1);
  };

  const updateWindow = async (
    id: string,
    updates: Partial<SessionModeWindow>
  ) => {
    const latestWindows = sessionModeSettingsRef.current.sessionWindows;
    await persistSessionModeSettings({
      sessionWindows: latestWindows.map((window) =>
        window.id === id ? { ...window, ...updates } : window
      ),
    });
  };

  const stageWindowUpdate = (
    id: string,
    updates: Partial<SessionModeWindow>
  ) => {
    const latestSettings = sessionModeSettingsRef.current;
    const optimisticSettings: SessionModeSettings = {
      ...latestSettings,
      sessionWindows: latestSettings.sessionWindows.map((window) =>
        window.id === id ? { ...window, ...updates } : window
      ),
    };
    sessionModeSettingsRef.current = optimisticSettings;
    plugin.settings.sessionMode = optimisticSettings;
  };

  const addWindow = async () => {
    const latestWindows = sessionModeSettingsRef.current.sessionWindows;
    await persistSessionModeSettings({
      sessionWindows: [...latestWindows, createDefaultSessionModeWindow()],
    });
  };

  const removeWindow = async (id: string) => {
    await persistSessionModeSettings({
      sessionWindows: sessionModeSettingsRef.current.sessionWindows.filter(
        (window) => window.id !== id
      ),
    });
  };

  const updateLeadTime = async (value: string) => {
    const parsed = Number(value);
    const normalized = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    await persistSessionModeSettings({
      preparationLeadTimeMinutes: normalized,
    });
  };

  const addLinkedResource = async (file: TFile) => {
    const latestSettings = sessionModeSettingsRef.current;
    await persistSessionModeSettings({
      linkedResources: [...latestSettings.linkedResources, { path: file.path }],
    });
    setResourceSearchQuery('');
  };

  const removeLinkedResource = async (path: string) => {
    const latestSettings = sessionModeSettingsRef.current;
    await persistSessionModeSettings({
      linkedResources: latestSettings.linkedResources.filter(
        (resource) => resource.path !== path
      ),
    });
  };

  const persistTradeGate = async (
    nextTradeGateQuestions: TradeGateQuestion[],
    nextTradeGateWorkflows: TradeGateWorkflow[]
  ) => {
    await persistSessionModeSettings({
      tradeGateQuestions: nextTradeGateQuestions,
      tradeGateWorkflows: nextTradeGateWorkflows,
    });
  };

  const persistPhaseLayouts = async (layouts: SessionModePhaseLayouts) => {
    await persistSessionModeSettings({ phaseLayouts: layouts });
  };

  const persistSessionLogTags = async (tags: SessionLogTagDefinition[]) => {
    await saveSessionLogTags(plugin, tags);
    setSettingsVersion((previous) => previous + 1);
  };

  const applySessionModeSettings = (settings: SessionModeSettings) => {
    sessionModeSettingsRef.current = settings;
    plugin.settings.sessionMode = settings;
    setSettingsVersion((previous) => previous + 1);
  };

  return (
    <div className="journalit-session-mode-settings">
      <SessionModeLeadTimeSetting
        value={sessionModeSettings.preparationLeadTimeMinutes}
        updateLeadTime={updateLeadTime}
      />

      <div className="setting-item setting-item-heading journalit-session-mode-windows-heading">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.session-mode.windows')}
          </div>
        </div>
        <div className="setting-item-control">
          <Button
            size="sm"
            className="journalit-session-mode-add-window-button"
            onClick={() => void addWindow()}
          >
            <Plus size={15} aria-hidden="true" />
            {t('settings.session-mode.add-window-short')}
          </Button>
        </div>
      </div>

      {sessionWindows.length === 0 ? (
        <div className="setting-item journalit-session-mode-empty-window-setting">
          <div className="setting-item-info">
            <div className="setting-item-description">
              {t('settings.session-mode.no-windows')}
            </div>
          </div>
        </div>
      ) : (
        <div className="journalit-session-mode-window-list">
          {sessionWindows.map((window) => (
            <SessionModeWindowRow
              key={window.id}
              window={window}
              stageWindowUpdate={stageWindowUpdate}
              updateWindow={updateWindow}
              removeWindow={removeWindow}
            />
          ))}
        </div>
      )}

      <SessionModeLinkedResourcesSettings
        plugin={plugin}
        linkedResources={linkedResources}
        resourceSearchQuery={resourceSearchQuery}
        setResourceSearchQuery={setResourceSearchQuery}
        availableResourceFiles={availableResourceFiles}
        addLinkedResource={addLinkedResource}
        removeLinkedResource={removeLinkedResource}
      />

      <SessionModeLayoutSettings
        phaseLayouts={phaseLayouts}
        getLatestPhaseLayouts={() =>
          normalizeSessionModePhaseLayouts(
            sessionModeSettingsRef.current.phaseLayouts
          )
        }
        persistPhaseLayouts={persistPhaseLayouts}
      />

      <TradeGateSection
        app={plugin.app}
        questions={tradeGateQuestions}
        workflows={tradeGateWorkflows}
        getLatestTradeGate={() => ({
          questions: sessionModeSettingsRef.current.tradeGateQuestions,
          workflows: sessionModeSettingsRef.current.tradeGateWorkflows,
        })}
        persistTradeGate={persistTradeGate}
      />

      <SessionLogDisplaySettings
        plugin={plugin}
        applySettings={applySessionModeSettings}
      />

      <SessionLogTagsSettings
        tags={sessionLogTags}
        persistTags={persistSessionLogTags}
      />
    </div>
  );
}

function SessionLogDisplaySettings({
  plugin,
  applySettings,
}: SessionModeTabProps & {
  applySettings: (settings: SessionModeSettings) => void;
}) {
  const showTradeExecutions =
    plugin.settings.sessionMode.showTradeExecutionsInSessionLog;

  const persistShowTradeExecutions = async (enabled: boolean) => {
    const nextSettings: SessionModeSettings = {
      ...plugin.settings.sessionMode,
      showTradeExecutionsInSessionLog: enabled,
    };
    applySettings(nextSettings);
    await plugin.saveSettings();
    eventBus.publish('settings:changed', {
      section: 'sessionMode',
      source: 'session-mode-settings',
    });
  };

  return (
    <>
      <div className="setting-item setting-item-heading">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.session-mode.session-log')}
          </div>
          <div className="setting-item-description">
            {t('settings.session-mode.session-log-desc')}
          </div>
        </div>
      </div>
      <div className="setting-item journalit-session-log-trade-events-setting">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.session-mode.show-trade-executions')}
          </div>
          <div className="setting-item-description">
            {t('settings.session-mode.show-trade-executions-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            id="session-log-show-trade-executions"
            checked={showTradeExecutions}
            onChange={persistShowTradeExecutions}
            ariaLabel={t('settings.session-mode.show-trade-executions')}
          />
        </div>
      </div>
    </>
  );
}

function SessionModeLeadTimeSetting({
  value,
  updateLeadTime,
}: {
  value: number;
  updateLeadTime: (value: string) => Promise<void>;
}) {
  return (
    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('settings.session-mode.preparation-lead-time')}
        </div>
        <div className="setting-item-description">
          {t('settings.session-mode.preparation-lead-time-desc')}
        </div>
      </div>
      <div className="setting-item-control">
        <input
          type="number"
          min="0"
          step="5"
          value={value}
          onChange={(event) => void updateLeadTime(event.target.value)}
          className="setting-input journalit-settings-input journalit-settings-input--number journalit-session-mode-lead-time-input"
          aria-label={t('settings.session-mode.preparation-lead-time')}
        />
      </div>
    </div>
  );
}

interface SessionModeLayoutSettingsProps {
  phaseLayouts: SessionModePhaseLayouts;
  getLatestPhaseLayouts: () => SessionModePhaseLayouts;
  persistPhaseLayouts: (layouts: SessionModePhaseLayouts) => Promise<void>;
}

const getSessionModePhaseLabel = (
  phase: SessionModeConfigurablePhase
): string => {
  switch (phase) {
    case 'preparation':
      return t('session-mode.phase.preparation');
    case 'live':
      return t('session-mode.phase.live');
    case 'ended':
      return t('session-mode.phase.ended');
  }
};

const getSessionModePhaseLayoutDescription = (
  phase: SessionModeConfigurablePhase
): string => {
  switch (phase) {
    case 'preparation':
      return t('settings.session-mode.layout.phase-desc.preparation');
    case 'live':
      return t('settings.session-mode.layout.phase-desc.live');
    case 'ended':
      return t('settings.session-mode.layout.phase-desc.ended');
  }
};

function SessionModeLayoutSettings({
  phaseLayouts,
  getLatestPhaseLayouts,
  persistPhaseLayouts,
}: SessionModeLayoutSettingsProps) {
  const [activePhase, setActivePhase] =
    useState<SessionModeConfigurablePhase>('live');

  const setPhaseModuleEnabled = async (
    phase: SessionModeConfigurablePhase,
    moduleId: SessionModeLayoutModuleId,
    enabled: boolean
  ) => {
    const latestPhaseLayouts = getLatestPhaseLayouts();
    const currentModuleIds = latestPhaseLayouts[phase];
    const nextModuleIds = enabled
      ? [...currentModuleIds, moduleId]
      : currentModuleIds.filter(
          (currentModuleId) => currentModuleId !== moduleId
        );
    await persistPhaseLayouts({
      ...latestPhaseLayouts,
      [phase]: nextModuleIds,
    });
  };

  const movePhaseModule = async (
    phase: SessionModeConfigurablePhase,
    moduleId: SessionModeLayoutModuleId,
    direction: -1 | 1
  ) => {
    const latestPhaseLayouts = getLatestPhaseLayouts();
    const currentModuleIds = latestPhaseLayouts[phase];
    const currentIndex = currentModuleIds.indexOf(moduleId);
    const nextIndex = currentIndex + direction;
    if (
      currentIndex === -1 ||
      nextIndex < 0 ||
      nextIndex >= currentModuleIds.length
    ) {
      return;
    }
    const nextModuleIds = [...currentModuleIds];
    [nextModuleIds[currentIndex], nextModuleIds[nextIndex]] = [
      nextModuleIds[nextIndex],
      nextModuleIds[currentIndex],
    ];
    await persistPhaseLayouts({
      ...latestPhaseLayouts,
      [phase]: nextModuleIds,
    });
  };

  const resetPhaseLayout = async (phase: SessionModeConfigurablePhase) => {
    const latestPhaseLayouts = getLatestPhaseLayouts();
    await persistPhaseLayouts({
      ...latestPhaseLayouts,
      [phase]: getDefaultSessionModePhaseLayouts()[phase],
    });
  };

  const enabledModuleIds = phaseLayouts[activePhase];
  const enabledModuleIdSet = new Set(enabledModuleIds);
  const supportedPhaseModules = getSessionModeModulesForPhase(activePhase);
  const phaseModulesById = new Map(
    supportedPhaseModules.map((module) => [module.id, module])
  );
  const phaseModules = [
    ...enabledModuleIds.flatMap((moduleId) => {
      const module = phaseModulesById.get(moduleId);
      return module ? [module] : [];
    }),
    ...supportedPhaseModules.filter(
      (module) => !enabledModuleIdSet.has(module.id)
    ),
  ];

  return (
    <div className="journalit-session-mode-layout-settings">
      <div className="setting-item setting-item-heading journalit-session-mode-layout-heading">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.session-mode.layout.title')}
          </div>
        </div>
      </div>

      <div className="journalit-session-mode-layout-card">
        <div
          className="journalit-session-mode-layout-phase-tabs"
          role="tablist"
          aria-label={t('settings.session-mode.layout.title')}
        >
          {SESSION_MODE_CONFIGURABLE_PHASES.map((phase) => {
            const selected = activePhase === phase;
            return (
              <button
                key={phase}
                type="button"
                role="tab"
                aria-selected={selected}
                className={
                  selected
                    ? 'journalit-session-mode-layout-phase-tab is-active'
                    : 'journalit-session-mode-layout-phase-tab'
                }
                onClick={() => setActivePhase(phase)}
              >
                {getSessionModePhaseLabel(phase)}
              </button>
            );
          })}
        </div>

        <div className="journalit-session-mode-layout-phase__header">
          <div className="journalit-session-mode-layout-phase__description">
            {getSessionModePhaseLayoutDescription(activePhase)}
          </div>
          <button
            type="button"
            className="journalit-session-mode-layout-reset-link"
            onClick={() => void resetPhaseLayout(activePhase)}
          >
            <RotateCcw size={14} aria-hidden="true" />
            {t('settings.session-mode.layout.reset-phase')}
          </button>
        </div>

        <div className="journalit-session-mode-layout-module-list">
          {phaseModules.map((module) => {
            const enabled = enabledModuleIdSet.has(module.id);
            const orderIndex = enabledModuleIds.indexOf(module.id);
            const inputId = `session-mode-layout-${activePhase}-${module.id}`;
            const labelId = `${inputId}-label`;
            return (
              <div
                key={module.id}
                className={
                  enabled
                    ? 'journalit-session-mode-layout-module is-enabled'
                    : 'journalit-session-mode-layout-module'
                }
              >
                <div className="journalit-session-mode-layout-module__toggle">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={enabled}
                    aria-labelledby={labelId}
                    onChange={(event) =>
                      void setPhaseModuleEnabled(
                        activePhase,
                        module.id,
                        event.target.checked
                      )
                    }
                  />
                  <span>
                    <label
                      id={labelId}
                      className="journalit-session-mode-layout-module__label"
                      htmlFor={inputId}
                    >
                      {t(module.labelKey)}
                    </label>
                    <span className="journalit-session-mode-layout-module__description">
                      {t(module.descriptionKey)}
                    </span>
                  </span>
                </div>
                <div className="journalit-session-mode-layout-module__order custom-fields-reorder-controls">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!enabled || orderIndex <= 0}
                    aria-label={`${t('button.move-up')}: ${t(module.labelKey)}`}
                    className="custom-fields-reorder-button journalit-session-mode-layout-reorder-button"
                    onClick={() =>
                      void movePhaseModule(activePhase, module.id, -1)
                    }
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      !enabled || orderIndex >= enabledModuleIds.length - 1
                    }
                    aria-label={`${t('button.move-down')}: ${t(module.labelKey)}`}
                    className="custom-fields-reorder-button journalit-session-mode-layout-reorder-button"
                    onClick={() =>
                      void movePhaseModule(activePhase, module.id, 1)
                    }
                  >
                    ↓
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface SessionModeLinkedResourcesSettingsProps {
  plugin: JournalitPlugin;
  linkedResources: SessionModeLinkedResource[];
  resourceSearchQuery: string;
  setResourceSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  availableResourceFiles: TFile[];
  addLinkedResource: (file: TFile) => Promise<void>;
  removeLinkedResource: (path: string) => Promise<void>;
}

function SessionModeLinkedResourcesSettings({
  plugin,
  linkedResources,
  resourceSearchQuery,
  setResourceSearchQuery,
  availableResourceFiles,
  addLinkedResource,
  removeLinkedResource,
}: SessionModeLinkedResourcesSettingsProps) {
  const [showLinkedResources, setShowLinkedResources] = useState(false);

  return (
    <div className="journalit-session-mode-linked-resources-settings">
      <div className="setting-item setting-item-heading journalit-session-mode-resources-heading">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.session-mode.linked-resources')}
          </div>
          <div className="setting-item-description">
            {t('settings.session-mode.linked-resources-desc')}
          </div>
        </div>
      </div>

      <div className="setting-item journalit-session-mode-resource-setting">
        <div className="setting-item-info">
          <div className="journalit-session-mode-resource-picker">
            <Search
              className="journalit-session-mode-resource-search-icon"
              size={15}
              aria-hidden="true"
            />
            <input
              type="search"
              value={resourceSearchQuery}
              placeholder={t(
                'settings.session-mode.search-resource-placeholder'
              )}
              onChange={(event) => setResourceSearchQuery(event.target.value)}
              className="setting-input journalit-settings-input journalit-session-mode-resource-search"
              aria-label={t(
                'settings.session-mode.search-resource-placeholder'
              )}
            />
            {resourceSearchQuery.trim() !== '' &&
              availableResourceFiles.length > 0 && (
                <div className="journalit-session-mode-resource-results">
                  {availableResourceFiles.map((file) => (
                    <button
                      type="button"
                      key={file.path}
                      className="journalit-session-mode-resource-result"
                      onClick={() => void addLinkedResource(file)}
                    >
                      <span className="journalit-session-mode-resource-result__name">
                        {file.basename}
                      </span>
                      <span className="journalit-session-mode-resource-result__path">
                        {file.path}
                      </span>
                    </button>
                  ))}
                </div>
              )}
          </div>
        </div>
        {linkedResources.length > 0 && (
          <div className="setting-item-control journalit-session-mode-linked-resources-toggle-control">
            <button
              type="button"
              className="journalit-session-mode-linked-resources-toggle"
              onClick={() => setShowLinkedResources((current) => !current)}
            >
              <span>
                {showLinkedResources
                  ? t('settings.session-mode.linked-resources-hide')
                  : t('settings.session-mode.linked-resources-count', {
                      count: String(linkedResources.length),
                    })}
              </span>
              {showLinkedResources ? (
                <ChevronDown size={14} aria-hidden="true" />
              ) : (
                <ChevronRight size={14} aria-hidden="true" />
              )}
            </button>
          </div>
        )}
      </div>

      {linkedResources.length > 0 && showLinkedResources && (
        <div className="setting-item journalit-session-mode-resource-setting">
          <div className="setting-item-info">
            <div className="journalit-session-mode-resource-list">
              {linkedResources.map((resource) => {
                const file = plugin.app.vault.getAbstractFileByPath(
                  resource.path
                );
                const name =
                  file instanceof TFile ? file.basename : resource.path;
                return (
                  <div
                    className="journalit-session-mode-resource-row"
                    key={resource.path}
                  >
                    <div className="journalit-session-mode-resource-row__text">
                      <span className="journalit-session-mode-resource-row__name">
                        {name}
                      </span>
                      <span className="journalit-session-mode-resource-row__path">
                        {resource.path}
                      </span>
                    </div>
                    <NoTooltipButton
                      label={t('button.delete')}
                      className="journalit-session-mode-delete-window-button"
                      onClick={() => void removeLinkedResource(resource.path)}
                    >
                      <Trash2 size={24} aria-hidden="true" />
                    </NoTooltipButton>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SessionLogTagsSettingsProps {
  tags: SessionLogTagDefinition[];
  persistTags: (tags: SessionLogTagDefinition[]) => Promise<void>;
}

function SessionLogTagsSettings({
  tags,
  persistTags,
}: SessionLogTagsSettingsProps) {
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editDraft, setEditDraft] =
    useState<SessionLogTagDraft>(createEmptyTagDraft);
  const [newDraft, setNewDraft] =
    useState<SessionLogTagDraft>(createEmptyTagDraft);

  const startEditing = (tag: SessionLogTagDefinition) => {
    setEditingTagId(tag.id);
    setEditDraft({
      label: tag.label,
      shortLabel: tag.shortLabel,
      color: tag.color,
      requiresResolution: tag.requiresResolution ?? false,
      lessonTag: tag.lessonTag ?? false,
    });
  };

  const cancelEditing = () => {
    setEditingTagId(null);
    setEditDraft(createEmptyTagDraft());
  };

  const saveEditing = async (id: string) => {
    const normalized = normalizeTagDraft(editDraft);
    if (!normalized.label || !normalized.shortLabel) return;
    await persistTags(
      tags.map((tag) =>
        tag.id === id
          ? {
              id,
              ...normalized,
            }
          : tag
      )
    );
    cancelEditing();
  };

  const addTag = async () => {
    const normalized = normalizeTagDraft(newDraft);
    if (!normalized.label || !normalized.shortLabel) return;
    await persistTags([
      ...tags,
      {
        id: generateUUID(),
        ...normalized,
      },
    ]);
    setNewDraft(createEmptyTagDraft());
  };

  const removeTag = async (id: string) => {
    await persistTags(tags.filter((tag) => tag.id !== id));
    if (editingTagId === id) cancelEditing();
  };

  const resetTags = async () => {
    await persistTags(DEFAULT_SESSION_LOG_TAGS.map((tag) => ({ ...tag })));
    cancelEditing();
    setNewDraft(createEmptyTagDraft());
  };

  return (
    <>
      <div className="setting-item setting-item-heading journalit-session-mode-tags-heading">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.session-mode.session-log-tags')}
          </div>
          <div className="setting-item-description">
            {t('settings.session-mode.session-log-tags-desc')}
          </div>
        </div>
      </div>

      <div className="custom-options-container journalit-session-log-tag-settings-list">
        {tags.map((tag) =>
          editingTagId === tag.id ? (
            <div key={tag.id} className="setting-item option-item">
              <div className="setting-item-control journalit-session-log-tag-edit-grid">
                <SessionLogTagDraftFields
                  draft={editDraft}
                  setDraft={setEditDraft}
                  labelPrefix={tag.id}
                />
                <div className="option-actions">
                  <NoTooltipButton
                    label={t(
                      'settings.customization.options.label.save-changes'
                    )}
                    onClick={() => void saveEditing(tag.id)}
                  >
                    <Check size={24} />
                  </NoTooltipButton>
                  <NoTooltipButton
                    label={t(
                      'settings.customization.options.label.cancel-editing'
                    )}
                    onClick={cancelEditing}
                  >
                    <X size={24} />
                  </NoTooltipButton>
                </div>
              </div>
            </div>
          ) : (
            <div key={tag.id} className="setting-item option-item">
              <div className="setting-item-info">
                <div className="setting-item-name custom-options-name-row custom-options-name-row--gap">
                  <span
                    className={`journalit-session-log-tag-preview journalit-session-log-tag-preview--${tag.color}`}
                  >
                    {tag.shortLabel}
                  </span>
                  <span>{tag.label}</span>
                  {tag.requiresResolution && (
                    <span className="journalit-session-log-tag-setting-pill">
                      {t('settings.session-mode.tag-requires-resolution')}
                    </span>
                  )}
                  {tag.lessonTag && (
                    <span className="journalit-session-log-tag-setting-pill">
                      {t('settings.session-mode.tag-lesson')}
                    </span>
                  )}
                </div>
              </div>
              <div className="setting-item-control">
                <div className="option-actions">
                  <NoTooltipButton
                    label={t(
                      'settings.customization.options.label.edit-option',
                      { option: tag.label }
                    )}
                    onClick={() => startEditing(tag)}
                  >
                    <Edit size={24} />
                  </NoTooltipButton>
                  <NoTooltipButton
                    label={t(
                      'settings.customization.options.label.remove-option',
                      { option: tag.label }
                    )}
                    onClick={() => void removeTag(tag.id)}
                  >
                    <Trash2 size={24} />
                  </NoTooltipButton>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <div className="setting-item custom-item-add journalit-session-log-tag-add-row">
        <div className="setting-item-info journalit-u-flex-col journalit-u-items-stretch">
          <SessionLogTagDraftFields
            draft={newDraft}
            setDraft={setNewDraft}
            labelPrefix={NEW_SESSION_LOG_TAG_PREFIX}
          />
        </div>
        <div className="setting-item-control">
          <div className="custom-options-reset-container journalit-session-log-tags-reset-container">
            <button
              type="button"
              onClick={() => void resetTags()}
              className="journalit-session-log-tags-reset-link"
            >
              <RotateCcw size={14} aria-hidden="true" />
              {t('settings.session-mode.reset-session-log-tags')}
            </button>
          </div>
          <Button
            onClick={() => void addTag()}
            disabled={!newDraft.label.trim() || !newDraft.shortLabel.trim()}
            aria-label={t('settings.session-mode.add-session-log-tag')}
          >
            {t('button.add')}
          </Button>
        </div>
      </div>
    </>
  );
}

interface SessionLogTagDraftFieldsProps {
  draft: SessionLogTagDraft;
  setDraft: React.Dispatch<React.SetStateAction<SessionLogTagDraft>>;
  labelPrefix: string;
}

function SessionLogTagDraftFields({
  draft,
  setDraft,
  labelPrefix,
}: SessionLogTagDraftFieldsProps) {
  return (
    <div className="journalit-session-log-tag-draft-fields">
      <label className="journalit-session-log-tag-field">
        <span className="journalit-session-log-tag-field__label">
          {t('settings.session-mode.tag-label-placeholder')}
        </span>
        <input
          id={`${labelPrefix}-label`}
          type="text"
          value={draft.label}
          onChange={(event) =>
            setDraft((current) => ({ ...current, label: event.target.value }))
          }
          placeholder={t('settings.session-mode.tag-label-example')}
          className="setting-input journalit-settings-input"
        />
      </label>
      <label className="journalit-session-log-tag-field">
        <span className="journalit-session-log-tag-field__label">
          {t('settings.session-mode.tag-short-label-placeholder')}
        </span>
        <input
          id={`${labelPrefix}-short-label`}
          type="text"
          value={draft.shortLabel}
          maxLength={6}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              shortLabel: event.target.value.toUpperCase(),
            }))
          }
          placeholder={t('settings.session-mode.tag-short-label-example')}
          className="setting-input journalit-settings-input journalit-session-log-tag-short-input"
        />
      </label>
      <label className="journalit-session-log-tag-field">
        <span className="journalit-session-log-tag-field__label">
          {t('settings.session-mode.tag-color')}
        </span>
        <select
          value={draft.color}
          onChange={(event) =>
            setDraft((current) => ({ ...current, color: event.target.value }))
          }
          className="dropdown journalit-settings-input journalit-session-log-tag-color-select"
        >
          {SESSION_LOG_TAG_COLORS.map((color) => (
            <option key={color} value={color}>
              {t(`settings.session-mode.tag-color.${color}`)}
            </option>
          ))}
        </select>
      </label>
      <label className="journalit-session-log-tag-toggle">
        <input
          type="checkbox"
          checked={draft.requiresResolution ?? false}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              requiresResolution: event.target.checked,
            }))
          }
        />
        <span>{t('settings.session-mode.tag-requires-resolution')}</span>
        <SessionLogTagSettingInfoTooltip
          content={t('settings.session-mode.tag-requires-resolution-tooltip')}
        />
      </label>
      <label className="journalit-session-log-tag-toggle">
        <input
          type="checkbox"
          checked={draft.lessonTag ?? false}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              lessonTag: event.target.checked,
            }))
          }
        />
        <span>{t('settings.session-mode.tag-lesson')}</span>
        <SessionLogTagSettingInfoTooltip
          content={t('settings.session-mode.tag-lesson-tooltip')}
        />
      </label>
    </div>
  );
}

function SessionLogTagSettingInfoTooltip({ content }: { content: string }) {
  return (
    <Tooltip content={content} preferredPosition="top" delay={150}>
      <span
        className="journalit-session-log-tag-setting-info journalit-dashboard-metric-info"
        aria-hidden="true"
      >
        <Info size={10} />
      </span>
    </Tooltip>
  );
}

export const SessionModeTab: React.FC<SessionModeTabProps> = ({ plugin }) => {
  ensureSessionModeSettings(plugin);

  return (
    <div className="journalit-settings-tab session-mode-settings">
      <div className="journalit-session-mode-settings-header">
        <div className="journalit-session-mode-settings-header__copy">
          <h3>{t('settings.session-mode.title')}</h3>
          <p className="setting-item-description">
            {t('settings.session-mode.description')}
          </p>
        </div>
        <Button
          variant="secondary"
          size="small"
          className="journalit-session-mode-open-button"
          onClick={(event) => {
            const closeButton = event.currentTarget
              .closest('.modal')
              ?.querySelector<HTMLButtonElement>('.modal-close-button');
            closeButton?.click();
            void plugin.openSessionMode();
          }}
        >
          <Radio size={15} aria-hidden="true" />
          {t('command.open-session-mode')}
        </Button>
      </div>
      <SessionModeSettingsSection plugin={plugin} />
    </div>
  );
};
