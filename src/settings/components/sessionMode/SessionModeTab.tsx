

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TFile } from 'obsidian';
import type { App } from 'obsidian';
import JournalitPlugin from '../../../main';
import { Button } from '../../../components/ui/Button';
import { NoTooltipButton } from '../../../components/ui/NoTooltipButton';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import { Tooltip } from '../../../components/shared/Tooltip';
import { showConfirmationModal } from '../../../components/shared/ConfirmationModal';
import {
  StickyHeaderPortal,
  useStickyHeader,
} from '../../../components/shared/StickyHeader';
import {
  addConnectedTradeGateQuestion,
  getReachableTradeGateNodeIds,
} from '../../../components/sessionMode/tradeGateUtils';
import {
  ChevronDown,
  ChevronRight,
  Check,
  ClockAlert,
  Edit,
  Info,
  Minus,
  Plus,
  Radio,
  RotateCcw,
  Search,
  Trash2,
  X,
} from '../../../components/shared/icons/ObsidianIcon';
import { eventBus } from '../../../services/events';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { openExternalUrl } from '../../../utils/externalLinks';
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
  TradeGateNode,
  TradeGateOption,
  TradeGateOutcomeNode,
  TradeGateOutcomeType,
  TradeGateQuestionNode,
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

function createDefaultTradeGateWorkflow(): TradeGateWorkflow {
  const marketRegimeId = generateUUID();
  const biasId = generateUUID();
  const riskId = generateUUID();
  const greenLightId = generateUUID();
  const noTradeId = generateUUID();
  const waitId = generateUUID();
  return {
    id: generateUUID(),
    name: t('settings.session-mode.trade-gate.default-name'),
    startNodeId: marketRegimeId,
    nodes: [
      {
        id: marketRegimeId,
        type: 'question',
        title: t('settings.session-mode.trade-gate.default.market-regime'),
        prompt: t(
          'settings.session-mode.trade-gate.default.market-regime-prompt'
        ),
        options: [
          { id: generateUUID(), label: t('common.yes'), targetNodeId: biasId },
          { id: generateUUID(), label: t('common.no'), targetNodeId: waitId },
        ],
      },
      {
        id: biasId,
        type: 'question',
        title: t('settings.session-mode.trade-gate.default.bias'),
        prompt: t('settings.session-mode.trade-gate.default.bias-prompt'),
        options: [
          { id: generateUUID(), label: t('common.yes'), targetNodeId: riskId },
          {
            id: generateUUID(),
            label: t('common.no'),
            targetNodeId: noTradeId,
          },
        ],
      },
      {
        id: riskId,
        type: 'question',
        title: t('settings.session-mode.trade-gate.default.risk'),
        prompt: t('settings.session-mode.trade-gate.default.risk-prompt'),
        options: [
          {
            id: generateUUID(),
            label: t('common.yes'),
            targetNodeId: greenLightId,
          },
          {
            id: generateUUID(),
            label: t('common.no'),
            targetNodeId: noTradeId,
          },
        ],
      },
      {
        id: greenLightId,
        type: 'outcome',
        outcome: 'green-light',
        title: t('trade-gate.outcome.green-light'),
        description: t('trade-gate.outcome.green-light-description'),
      },
      {
        id: noTradeId,
        type: 'outcome',
        outcome: 'no-trade',
        title: t('trade-gate.outcome.no-trade'),
        description: t('trade-gate.outcome.no-trade-description'),
      },
      {
        id: waitId,
        type: 'outcome',
        outcome: 'wait',
        title: t('trade-gate.outcome.wait'),
        description: t('trade-gate.outcome.wait-description'),
      },
    ],
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

async function saveSessionModeSettings(params: {
  plugin: JournalitPlugin;
  latestSettings: SessionModeSettings;
  nextWindows: SessionModeWindow[];
  nextLeadTimeMinutes?: number;
  nextLinkedResources?: SessionModeLinkedResource[];
  nextTradeGateWorkflows?: TradeGateWorkflow[];
  nextPhaseLayouts?: SessionModePhaseLayouts;
}): Promise<SessionModeSettings> {
  const nextSettings = {
    ...params.latestSettings,
    sessionWindows: params.nextWindows,
    preparationLeadTimeMinutes:
      params.nextLeadTimeMinutes ??
      params.latestSettings.preparationLeadTimeMinutes,
    linkedResources:
      params.nextLinkedResources ?? params.latestSettings.linkedResources,
    tradeGateWorkflows:
      params.nextTradeGateWorkflows ?? params.latestSettings.tradeGateWorkflows,
    phaseLayouts: normalizeSessionModePhaseLayouts(
      params.nextPhaseLayouts ?? params.latestSettings.phaseLayouts
    ),
  };
  params.plugin.settings.sessionMode = nextSettings;
  await params.plugin.saveSettings();
  eventBus.publish('settings:changed', {
    section: 'sessionMode',
    source: 'session-mode-settings',
  });
  return nextSettings;
}

function buildSessionModeSettings(params: {
  latestSettings: SessionModeSettings;
  nextWindows: SessionModeWindow[];
  nextLeadTimeMinutes?: number;
  nextLinkedResources?: SessionModeLinkedResource[];
  nextTradeGateWorkflows?: TradeGateWorkflow[];
  nextPhaseLayouts?: SessionModePhaseLayouts;
}): SessionModeSettings {
  return {
    ...params.latestSettings,
    sessionWindows: params.nextWindows,
    preparationLeadTimeMinutes:
      params.nextLeadTimeMinutes ??
      params.latestSettings.preparationLeadTimeMinutes,
    linkedResources:
      params.nextLinkedResources ?? params.latestSettings.linkedResources,
    tradeGateWorkflows:
      params.nextTradeGateWorkflows ?? params.latestSettings.tradeGateWorkflows,
    phaseLayouts: normalizeSessionModePhaseLayouts(
      params.nextPhaseLayouts ?? params.latestSettings.phaseLayouts
    ),
  };
}

function SessionModeSettingsSection({ plugin }: SessionModeTabProps) {
  const [, setSettingsVersion] = useState(0);
  const sessionModeSettings = plugin.settings.sessionMode;
  const sessionWindows = sessionModeSettings.sessionWindows;
  const linkedResources = sessionModeSettings.linkedResources;
  const tradeGateWorkflows = sessionModeSettings.tradeGateWorkflows;
  const phaseLayouts = normalizeSessionModePhaseLayouts(
    sessionModeSettings.phaseLayouts
  );
  const sessionLogTags = plugin.settings.drc.sessionLogTags;
  const [resourceSearchQuery, setResourceSearchQuery] = useState('');
  const sessionModeSettingsRef = useRef(sessionModeSettings);
  sessionModeSettingsRef.current = sessionModeSettings;

  const availableResourceFiles = useMemo(
    () =>
      getAvailableResourceFiles(plugin, linkedResources, resourceSearchQuery),
    [linkedResources, plugin, resourceSearchQuery]
  );

  const persistSessionModeSettings = async (
    nextWindows: SessionModeWindow[],
    nextLeadTimeMinutes?: number,
    nextLinkedResources?: SessionModeLinkedResource[],
    nextTradeGateWorkflows?: TradeGateWorkflow[],
    nextPhaseLayouts?: SessionModePhaseLayouts
  ) => {
    const latestSettings = sessionModeSettingsRef.current;
    const optimisticSettings = buildSessionModeSettings({
      latestSettings,
      nextWindows,
      nextLeadTimeMinutes,
      nextLinkedResources,
      nextTradeGateWorkflows,
      nextPhaseLayouts,
    });
    sessionModeSettingsRef.current = optimisticSettings;
    await saveSessionModeSettings({
      plugin,
      latestSettings: optimisticSettings,
      nextWindows: optimisticSettings.sessionWindows,
      nextLeadTimeMinutes: optimisticSettings.preparationLeadTimeMinutes,
      nextLinkedResources: optimisticSettings.linkedResources,
      nextTradeGateWorkflows: optimisticSettings.tradeGateWorkflows,
      nextPhaseLayouts: optimisticSettings.phaseLayouts,
    });
    setSettingsVersion((previous) => previous + 1);
  };

  const updateWindow = async (
    id: string,
    updates: Partial<SessionModeWindow>
  ) => {
    const latestWindows = sessionModeSettingsRef.current.sessionWindows;
    await persistSessionModeSettings(
      latestWindows.map((window) =>
        window.id === id ? { ...window, ...updates } : window
      )
    );
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
    await persistSessionModeSettings([
      ...latestWindows,
      createDefaultSessionModeWindow(),
    ]);
  };

  const removeWindow = async (id: string) => {
    await persistSessionModeSettings(
      sessionModeSettingsRef.current.sessionWindows.filter(
        (window) => window.id !== id
      )
    );
  };

  const updateLeadTime = async (value: string) => {
    const parsed = Number(value);
    const normalized = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    await persistSessionModeSettings(
      sessionModeSettingsRef.current.sessionWindows,
      normalized
    );
  };

  const addLinkedResource = async (file: TFile) => {
    const latestSettings = sessionModeSettingsRef.current;
    await persistSessionModeSettings(
      latestSettings.sessionWindows,
      latestSettings.preparationLeadTimeMinutes,
      [...latestSettings.linkedResources, { path: file.path }]
    );
    setResourceSearchQuery('');
  };

  const removeLinkedResource = async (path: string) => {
    const latestSettings = sessionModeSettingsRef.current;
    await persistSessionModeSettings(
      latestSettings.sessionWindows,
      latestSettings.preparationLeadTimeMinutes,
      latestSettings.linkedResources.filter(
        (resource) => resource.path !== path
      )
    );
  };

  const persistTradeGateWorkflows = async (workflows: TradeGateWorkflow[]) => {
    const latestSettings = sessionModeSettingsRef.current;
    await persistSessionModeSettings(
      latestSettings.sessionWindows,
      latestSettings.preparationLeadTimeMinutes,
      latestSettings.linkedResources,
      workflows
    );
  };

  const persistPhaseLayouts = async (layouts: SessionModePhaseLayouts) => {
    const latestSettings = sessionModeSettingsRef.current;
    await persistSessionModeSettings(
      latestSettings.sessionWindows,
      latestSettings.preparationLeadTimeMinutes,
      latestSettings.linkedResources,
      latestSettings.tradeGateWorkflows,
      layouts
    );
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
            <div className="journalit-session-mode-window-row" key={window.id}>
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

      <TradeGateWorkflowSettings
        app={plugin.app}
        workflows={tradeGateWorkflows}
        persistWorkflows={persistTradeGateWorkflows}
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

interface TradeGateWorkflowSettingsProps {
  app: App;
  workflows: TradeGateWorkflow[];
  persistWorkflows: (workflows: TradeGateWorkflow[]) => Promise<void>;
}

function TradeGateWorkflowSettings({
  app,
  workflows,
  persistWorkflows,
}: TradeGateWorkflowSettingsProps) {
  const [expandedWorkflowId, setExpandedWorkflowId] = useState<string | null>(
    null
  );
  const [pendingNewQuestion, setPendingNewQuestion] = useState<{
    workflowId: string;
    nodeId: string;
  } | null>(null);
  const deletedWorkflowIdsRef = useRef(new Set<string>());
  const workflowDraftsRef = useRef(new Map<string, TradeGateWorkflow>());
  const workflowsRef = useRef(workflows);

  useEffect(() => {
    workflowsRef.current = workflows;
    const workflowIds = new Set(workflows.map((workflow) => workflow.id));
    for (const workflowId of workflowDraftsRef.current.keys()) {
      if (!workflowIds.has(workflowId)) {
        workflowDraftsRef.current.delete(workflowId);
      }
    }
  }, [workflows]);

  const getDraftMergedWorkflows = (): TradeGateWorkflow[] => {
    const draftWorkflows = workflowDraftsRef.current;
    const nextWorkflows: TradeGateWorkflow[] = [];
    const nextWorkflowIds = new Set<string>();
    for (const workflow of workflowsRef.current) {
      if (deletedWorkflowIdsRef.current.has(workflow.id)) continue;
      const nextWorkflow = draftWorkflows.get(workflow.id) ?? workflow;
      nextWorkflows.push(nextWorkflow);
      nextWorkflowIds.add(nextWorkflow.id);
    }
    for (const draftWorkflow of draftWorkflows.values()) {
      if (deletedWorkflowIdsRef.current.has(draftWorkflow.id)) continue;
      if (!nextWorkflowIds.has(draftWorkflow.id)) {
        nextWorkflows.push(draftWorkflow);
        nextWorkflowIds.add(draftWorkflow.id);
      }
    }
    return nextWorkflows;
  };

  const stageWorkflowDraft = (updatedWorkflow: TradeGateWorkflow) => {
    if (deletedWorkflowIdsRef.current.has(updatedWorkflow.id)) return;
    workflowDraftsRef.current.set(updatedWorkflow.id, updatedWorkflow);
  };

  const persistWorkflow = async (updatedWorkflow: TradeGateWorkflow) => {
    if (deletedWorkflowIdsRef.current.has(updatedWorkflow.id)) return;
    stageWorkflowDraft(updatedWorkflow);
    await persistWorkflows(getDraftMergedWorkflows());
  };

  const addWorkflow = async () => {
    const workflow = createDefaultTradeGateWorkflow();
    deletedWorkflowIdsRef.current.delete(workflow.id);
    workflowDraftsRef.current.set(workflow.id, workflow);
    setExpandedWorkflowId(workflow.id);
    await persistWorkflows(getDraftMergedWorkflows());
  };

  const removeWorkflow = async (id: string): Promise<boolean> => {
    const workflow =
      workflowDraftsRef.current.get(id) ??
      workflowsRef.current.find((item) => item.id === id);
    if (!workflow) return false;

    const confirmed = await showConfirmationModal(app, {
      title: t('settings.session-mode.trade-gate.delete-workflow.title'),
      message: t('settings.session-mode.trade-gate.delete-workflow.message', {
        name: workflow.name || t('settings.session-mode.trade-gate.untitled'),
      }),
      confirmLabel: t(
        'settings.session-mode.trade-gate.delete-workflow.confirm'
      ),
      cancelLabel: t('button.cancel'),
      destructive: true,
    });
    if (!confirmed) return false;

    deletedWorkflowIdsRef.current.add(id);
    workflowDraftsRef.current.delete(id);
    setPendingNewQuestion((current) =>
      current?.workflowId === id ? null : current
    );
    if (expandedWorkflowId === id) setExpandedWorkflowId(null);
    await persistWorkflows(getDraftMergedWorkflows());
    return true;
  };

  return (
    <>
      <div className="setting-item setting-item-heading journalit-session-mode-trade-gate-heading">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.session-mode.trade-gate.title')}
          </div>
          <div className="setting-item-description">
            {t('settings.session-mode.trade-gate.desc')}{' '}
            <button
              type="button"
              className="journalit-session-mode-trade-gate-learn-more"
              onClick={() =>
                openExternalUrl('https://journalit.co/docs/session-mode')
              }
            >
              {t('button.learn-more')}
            </button>
          </div>
        </div>
        <div className="setting-item-control">
          <Button size="sm" onClick={() => void addWorkflow()}>
            <Plus size={15} aria-hidden="true" />
            {t('button.add')}
          </Button>
        </div>
      </div>

      {workflows.length > 0 && (
        <div className="journalit-session-mode-trade-gate-list">
          {workflows.map((workflow) => {
            const isExpanded = expandedWorkflowId === workflow.id;
            const editorWorkflow =
              workflowDraftsRef.current.get(workflow.id) ?? workflow;
            return (
              <TradeGateWorkflowEditor
                key={`${workflow.id}:${isExpanded ? 'expanded' : 'collapsed'}`}
                workflow={editorWorkflow}
                isExpanded={isExpanded}
                setExpanded={() =>
                  setExpandedWorkflowId(isExpanded ? null : workflow.id)
                }
                persistWorkflow={persistWorkflow}
                stageWorkflowDraft={stageWorkflowDraft}
                removeWorkflow={removeWorkflow}
                hasPendingNewQuestion={Boolean(pendingNewQuestion)}
                pendingNewQuestionId={
                  pendingNewQuestion?.workflowId === workflow.id
                    ? pendingNewQuestion.nodeId
                    : null
                }
                setPendingNewQuestionId={(nodeId) =>
                  setPendingNewQuestion((current) =>
                    nodeId
                      ? { workflowId: workflow.id, nodeId }
                      : current?.workflowId === workflow.id
                        ? null
                        : current
                  )
                }
              />
            );
          })}
        </div>
      )}
    </>
  );
}

interface TradeGateWorkflowEditorProps {
  workflow: TradeGateWorkflow;
  isExpanded: boolean;
  setExpanded: () => void;
  persistWorkflow: (workflow: TradeGateWorkflow) => Promise<void>;
  stageWorkflowDraft: (workflow: TradeGateWorkflow) => void;
  removeWorkflow: (id: string) => Promise<boolean>;
  hasPendingNewQuestion: boolean;
  pendingNewQuestionId: string | null;
  setPendingNewQuestionId: (nodeId: string | null) => void;
}

function getTradeGateAddQuestionState({
  hasPendingNewQuestion,
  questionCount,
  reachableNodeIds,
  selectedQuestion,
}: {
  hasPendingNewQuestion: boolean;
  questionCount: number;
  reachableNodeIds: Set<string>;
  selectedQuestion: TradeGateQuestionNode | null;
}): { canAddQuestion: boolean; tooltip: string } {
  if (hasPendingNewQuestion) {
    return {
      canAddQuestion: false,
      tooltip: t('settings.session-mode.trade-gate.edit-before-branching'),
    };
  }
  if (questionCount === 0) {
    return {
      canAddQuestion: true,
      tooltip: t('settings.session-mode.trade-gate.add-first-question'),
    };
  }

  if (!selectedQuestion) {
    return {
      canAddQuestion: false,
      tooltip: t('settings.session-mode.trade-gate.select-question-to-add'),
    };
  }

  if (!reachableNodeIds.has(selectedQuestion.id)) {
    return {
      canAddQuestion: false,
      tooltip: t('settings.session-mode.trade-gate.connect-before-branching'),
    };
  }
  return {
    canAddQuestion: true,
    tooltip: t('settings.session-mode.trade-gate.add-branch-from', {
      question:
        selectedQuestion.title ||
        t('settings.session-mode.trade-gate.question'),
    }),
  };
}

function scrollTradeGateEditorIntoView({
  editor,
  header,
}: {
  editor: HTMLDivElement;
  header: HTMLDivElement | null;
}): void {
  const scrollContainer = editor.closest(
    '.vertical-tab-content.journalit-settings'
  );
  if (!(scrollContainer instanceof HTMLElement)) {
    editor.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return;
  }

  const containerRect = scrollContainer.getBoundingClientRect();
  const editorRect = editor.getBoundingClientRect();
  const headerHeight = header?.getBoundingClientRect().height ?? 48;
  const visibleTop = containerRect.top + headerHeight + 12;
  const visibleBottom = containerRect.bottom - 12;
  const availableHeight = visibleBottom - visibleTop;
  const visibleEditorHeight = Math.max(
    0,
    Math.min(editorRect.bottom, visibleBottom) -
      Math.max(editorRect.top, visibleTop)
  );
  let scrollDelta = 0;

  if (editorRect.height <= availableHeight) {
    if (editorRect.bottom > visibleBottom) {
      scrollDelta = editorRect.bottom - visibleBottom;
    } else if (editorRect.top < visibleTop) {
      scrollDelta = editorRect.top - visibleTop;
    }
  } else if (visibleEditorHeight < Math.min(120, availableHeight * 0.3)) {
    scrollDelta = editorRect.top - visibleTop;
  }

  if (Math.abs(scrollDelta) >= 1) {
    scrollContainer.scrollTo({
      top: scrollContainer.scrollTop + scrollDelta,
      behavior: 'smooth',
    });
  }
}

function TradeGateWorkflowEditor({
  workflow,
  isExpanded,
  setExpanded,
  persistWorkflow,
  stageWorkflowDraft,
  removeWorkflow,
  hasPendingNewQuestion,
  pendingNewQuestionId,
  setPendingNewQuestionId,
}: TradeGateWorkflowEditorProps) {
  const [draftWorkflow, setDraftWorkflow] = useState(() =>
    normalizeTradeGateWorkflowOutcomes(workflow)
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const workflowRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const selectedEditorRef = useRef<HTMLDivElement | null>(null);
  const selectedTitleInputRef = useRef<HTMLInputElement | null>(null);
  const isAddingQuestionRef = useRef(false);
  const pendingPersistRef = useRef<TradeGateWorkflow | null>(null);
  const persistTimerRef = useRef<number | null>(null);
  const persistWorkflowRef = useRef(persistWorkflow);

  useEffect(() => {
    persistWorkflowRef.current = persistWorkflow;
  }, [persistWorkflow]);

  useEffect(
    () => () => {
      if (persistTimerRef.current) {
        window.clearTimeout(persistTimerRef.current);
      }
      if (pendingPersistRef.current) {
        void persistWorkflowRef.current(pendingPersistRef.current);
      }
    },
    []
  );

  const questionNodes = draftWorkflow.nodes.filter(
    (node): node is TradeGateQuestionNode => node.type === 'question'
  );
  const selectedNode =
    draftWorkflow.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const selectedQuestion =
    selectedNode?.type === 'question' ? selectedNode : null;
  const reachableNodeIds = getReachableTradeGateNodeIds(draftWorkflow);
  const unconnectedQuestions = questionNodes.filter(
    (node) => !reachableNodeIds.has(node.id)
  );
  const { canAddQuestion, tooltip: addQuestionTooltip } =
    getTradeGateAddQuestionState({
      hasPendingNewQuestion,
      questionCount: questionNodes.length,
      reachableNodeIds,
      selectedQuestion,
    });
  const stickyHeader = useStickyHeader({
    containerRef: workflowRef,
    enabled: isExpanded,
    headerRef,
  });

  const revealSelectedEditor = () => {
    window.requestAnimationFrame(() => {
      const editor = selectedEditorRef.current;
      if (editor) {
        scrollTradeGateEditorIntoView({
          editor,
          header: headerRef.current,
        });
      }
      window.requestAnimationFrame(() => {
        selectedTitleInputRef.current?.focus({ preventScroll: true });
      });
    });
  };

  const selectNodeForEditing = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    revealSelectedEditor();
  };

  const updateWorkflow = async (updates: Partial<TradeGateWorkflow>) => {
    const nextWorkflow = normalizeTradeGateWorkflowOutcomes({
      ...draftWorkflow,
      ...updates,
    });
    setDraftWorkflow(nextWorkflow);
    stageWorkflowDraft(nextWorkflow);
    pendingPersistRef.current = nextWorkflow;

    if (persistTimerRef.current) {
      window.clearTimeout(persistTimerRef.current);
    }

    persistTimerRef.current = window.setTimeout(() => {
      pendingPersistRef.current = null;
      persistTimerRef.current = null;
      void persistWorkflowRef.current(nextWorkflow);
    }, 350);
  };

  const discardPendingPersist = () => {
    if (persistTimerRef.current) {
      window.clearTimeout(persistTimerRef.current);
      persistTimerRef.current = null;
    }
    pendingPersistRef.current = null;
  };

  const updateNode = async (updatedNode: TradeGateNode) => {
    if (updatedNode.id === pendingNewQuestionId) {
      setPendingNewQuestionId(null);
    }
    await updateWorkflow({
      nodes: draftWorkflow.nodes.map((node) =>
        node.id === updatedNode.id ? updatedNode : node
      ),
    });
  };

  const addQuestionNode = async () => {
    if (!canAddQuestion || isAddingQuestionRef.current) return;

    isAddingQuestionRef.current = true;
    setIsAddingQuestion(true);
    try {
      const node: TradeGateQuestionNode = {
        id: generateUUID(),
        type: 'question',
        title: t('settings.session-mode.trade-gate.new-question-title'),
        prompt: '',
        options: [],
      };
      const nextWorkflow = selectedQuestion
        ? addConnectedTradeGateQuestion({
            workflow: draftWorkflow,
            parentQuestionId: selectedQuestion.id,
            question: node,
            option: {
              id: generateUUID(),
              label: t('settings.session-mode.trade-gate.new-option'),
            },
          })
        : addConnectedTradeGateQuestion({
            workflow: draftWorkflow,
            parentQuestionId: null,
            question: node,
          });

      setPendingNewQuestionId(node.id);
      selectNodeForEditing(node.id);
      await updateWorkflow({
        nodes: nextWorkflow.nodes,
        startNodeId: nextWorkflow.startNodeId,
      });
    } finally {
      window.requestAnimationFrame(() => {
        isAddingQuestionRef.current = false;
        setIsAddingQuestion(false);
      });
    }
  };

  const addOptionToQuestion = async (questionId: string) => {
    const question = draftWorkflow.nodes.find(
      (node): node is TradeGateQuestionNode =>
        node.id === questionId && node.type === 'question'
    );
    if (!question) return;
    if (question.id === pendingNewQuestionId) {
      setPendingNewQuestionId(null);
    }

    const normalizedWorkflow =
      normalizeTradeGateWorkflowOutcomes(draftWorkflow);
    const targetNodes = normalizedWorkflow.nodes.filter(
      (target) => target.id !== question.id
    );
    const waitOutcome = targetNodes.find(
      (target): target is TradeGateOutcomeNode =>
        target.type === 'outcome' && target.outcome === 'wait'
    );
    const targetNodeId = waitOutcome?.id ?? targetNodes[0]?.id ?? '';
    const updatedQuestion: TradeGateQuestionNode = {
      ...question,
      options: [
        ...question.options,
        {
          id: generateUUID(),
          label: t('settings.session-mode.trade-gate.new-option'),
          targetNodeId,
        },
      ],
    };
    const nextNodes = normalizedWorkflow.nodes.map((node) =>
      node.id === question.id ? updatedQuestion : node
    );

    setSelectedNodeId(question.id);
    await updateWorkflow({ nodes: nextNodes });
  };

  const removeNode = async (nodeId: string) => {
    const remainingNodes = draftWorkflow.nodes.filter(
      (node) => node.id !== nodeId
    );
    const remainingQuestions = remainingNodes.filter(
      (node): node is TradeGateQuestionNode => node.type === 'question'
    );
    const nextStartNodeId =
      draftWorkflow.startNodeId === nodeId
        ? (remainingQuestions[0]?.id ?? '')
        : draftWorkflow.startNodeId;
    const nextNodes = remainingNodes.map((node) => {
      if (node.type !== 'question') return node;
      return {
        ...node,
        options: node.options.filter(
          (option) => option.targetNodeId !== nodeId
        ),
      };
    });
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    if (pendingNewQuestionId === nodeId) {
      setPendingNewQuestionId(null);
    }
    await updateWorkflow({ nodes: nextNodes, startNodeId: nextStartNodeId });
  };

  return (
    <div
      ref={workflowRef}
      className={`journalit-session-mode-trade-gate-workflow${isExpanded ? ' is-expanded' : ''}`}
    >
      <TradeGateWorkflowHeader
        addQuestionTooltip={addQuestionTooltip}
        addQuestionNode={addQuestionNode}
        canAddQuestion={canAddQuestion}
        discardPendingPersist={discardPendingPersist}
        draftWorkflow={draftWorkflow}
        headerRef={headerRef}
        isAddingQuestion={isAddingQuestion}
        isExpanded={isExpanded}
        removeWorkflow={removeWorkflow}
        setExpanded={setExpanded}
      />

      <StickyHeaderPortal
        className="journalit-settings journalit-session-mode-trade-gate-header--sticky-clone"
        metrics={stickyHeader}
      >
        <TradeGateWorkflowHeader
          addQuestionTooltip={addQuestionTooltip}
          addQuestionNode={addQuestionNode}
          canAddQuestion={canAddQuestion}
          discardPendingPersist={discardPendingPersist}
          draftWorkflow={draftWorkflow}
          isAddingQuestion={isAddingQuestion}
          isExpanded={isExpanded}
          removeWorkflow={removeWorkflow}
          setExpanded={setExpanded}
        />
      </StickyHeaderPortal>

      {isExpanded && (
        <div className="journalit-session-mode-trade-gate-editor">
          <TradeGateWorkflowFields
            questionNodes={questionNodes}
            updateWorkflow={updateWorkflow}
            workflow={draftWorkflow}
          />

          <TradeGateFlowMap
            workflow={draftWorkflow}
            selectedNodeId={selectedNodeId}
            selectNode={selectNodeForEditing}
            unconnectedQuestions={unconnectedQuestions}
          />

          <TradeGateSelectedNodeEditor
            addOptionToQuestion={addOptionToQuestion}
            editorRef={selectedEditorRef}
            removeNode={removeNode}
            selectedNode={selectedNode}
            titleInputRef={selectedTitleInputRef}
            updateNode={updateNode}
            workflow={draftWorkflow}
          />
        </div>
      )}
    </div>
  );
}

function TradeGateWorkflowFields({
  questionNodes,
  updateWorkflow,
  workflow,
}: {
  questionNodes: TradeGateQuestionNode[];
  updateWorkflow: (updates: Partial<TradeGateWorkflow>) => Promise<void>;
  workflow: TradeGateWorkflow;
}) {
  return (
    <div className="journalit-session-mode-trade-gate-editor-grid">
      <label className="journalit-session-mode-trade-gate-field">
        <span className="setting-item-description">
          {t('settings.session-mode.trade-gate.name')}
        </span>
        <input
          type="text"
          value={workflow.name}
          placeholder={t('settings.session-mode.trade-gate.name')}
          onChange={(event) =>
            void updateWorkflow({ name: event.target.value })
          }
          className="setting-input journalit-settings-input journalit-session-mode-trade-gate-workflow-name-input"
        />
      </label>
      <label className="journalit-session-mode-trade-gate-field">
        <span className="setting-item-description">
          {t('settings.session-mode.trade-gate.start-node')}
        </span>
        <select
          value={workflow.startNodeId}
          onChange={(event) =>
            void updateWorkflow({ startNodeId: event.target.value })
          }
          className="dropdown journalit-settings-input"
        >
          {questionNodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.title || t('settings.session-mode.trade-gate.question')}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function TradeGateSelectedNodeEditor({
  addOptionToQuestion,
  editorRef,
  removeNode,
  selectedNode,
  titleInputRef,
  updateNode,
  workflow,
}: {
  addOptionToQuestion: (questionId: string) => Promise<void>;
  editorRef: React.RefObject<HTMLDivElement | null>;
  removeNode: (nodeId: string) => Promise<void>;
  selectedNode: TradeGateNode | null;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
  updateNode: (node: TradeGateNode) => Promise<void>;
  workflow: TradeGateWorkflow;
}) {
  if (!selectedNode) return null;

  return (
    <div
      ref={editorRef}
      className="journalit-session-mode-trade-gate-selected-editor"
    >
      {selectedNode.type === 'question' ? (
        <TradeGateQuestionEditor
          titleInputRef={titleInputRef}
          node={selectedNode}
          workflow={workflow}
          updateNode={updateNode}
          addOptionToQuestion={addOptionToQuestion}
          removeNode={removeNode}
        />
      ) : (
        <TradeGateOutcomeEditor
          node={selectedNode}
          updateNode={updateNode}
          removeNode={removeNode}
        />
      )}
    </div>
  );
}

function TradeGateWorkflowHeader({
  addQuestionTooltip,
  addQuestionNode,
  canAddQuestion,
  discardPendingPersist,
  draftWorkflow,
  headerRef,
  isAddingQuestion,
  isExpanded,
  removeWorkflow,
  setExpanded,
}: {
  addQuestionTooltip: string;
  addQuestionNode: () => Promise<void>;
  canAddQuestion: boolean;
  discardPendingPersist: () => void;
  draftWorkflow: TradeGateWorkflow;
  headerRef?: React.RefObject<HTMLDivElement | null>;
  isAddingQuestion: boolean;
  isExpanded: boolean;
  removeWorkflow: (id: string) => Promise<boolean>;
  setExpanded: () => void;
}) {
  const addQuestionLabel = draftWorkflow.nodes.some(
    (node) => node.type === 'question'
  )
    ? t('settings.session-mode.trade-gate.add-branch-question')
    : t('settings.session-mode.trade-gate.add-question');
  const isAddQuestionUnavailable = !canAddQuestion || isAddingQuestion;

  return (
    <div ref={headerRef} className="journalit-session-mode-trade-gate-row">
      <button
        type="button"
        className="journalit-session-mode-trade-gate-expand"
        onClick={setExpanded}
        aria-expanded={isExpanded}
      >
        <span className="journalit-session-mode-trade-gate-expand__icon">
          {isExpanded ? (
            <ChevronDown size={16} aria-hidden="true" />
          ) : (
            <ChevronRight size={16} aria-hidden="true" />
          )}
        </span>
        <span className="journalit-session-mode-trade-gate-expand__name">
          {draftWorkflow.name || t('settings.session-mode.trade-gate.untitled')}
        </span>
        <span className="setting-item-description journalit-session-mode-trade-gate-summary">
          {t('settings.session-mode.trade-gate.summary', {
            count: String(draftWorkflow.nodes.length),
          })}
        </span>
      </button>
      {isExpanded && (
        <Tooltip content={addQuestionTooltip} preferredPosition="bottom">
          <Button
            size="sm"
            className={isAddQuestionUnavailable ? 'is-disabled' : ''}
            disabled={isAddingQuestion}
            aria-disabled={isAddQuestionUnavailable}
            aria-label={`${addQuestionLabel}. ${addQuestionTooltip}`}
            onClick={() => void addQuestionNode()}
          >
            <Plus size={15} aria-hidden="true" />
            {addQuestionLabel}
          </Button>
        </Tooltip>
      )}
      <NoTooltipButton
        label={t('button.delete')}
        className="journalit-session-mode-delete-window-button"
        onClick={async () => {
          const removed = await removeWorkflow(draftWorkflow.id);
          if (removed) discardPendingPersist();
        }}
      >
        <Trash2 size={24} aria-hidden="true" />
      </NoTooltipButton>
    </div>
  );
}

interface TradeGateFlowMapProps {
  workflow: TradeGateWorkflow;
  selectedNodeId: string | null;
  selectNode: (nodeId: string) => void;
  unconnectedQuestions: TradeGateQuestionNode[];
}

interface TradeGateFlowLayoutNode {
  occurrenceId: string;
  node: TradeGateNode;
  x: number;
  y: number;
}

interface TradeGateFlowLayoutEdge {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  labelX: number;
  labelY: number;
  label: string;
  sourceNodeId: string;
}

interface TradeGateFlowLayout {
  nodes: TradeGateFlowLayoutNode[];
  edges: TradeGateFlowLayoutEdge[];
  width: number;
  height: number;
}

const TRADE_GATE_FLOW_NODE_WIDTH = 132;
const TRADE_GATE_FLOW_NODE_HEIGHT = 84;
const TRADE_GATE_FLOW_HORIZONTAL_GAP = 48;
const TRADE_GATE_FLOW_VERTICAL_GAP = 72;
const TRADE_GATE_FLOW_PADDING = 60;
const TRADE_GATE_FLOW_MIN_SCALE = 0.45;
const TRADE_GATE_FLOW_MAX_SCALE = 1.4;
const TRADE_GATE_FLOW_ZOOM_STEP = 0.15;
const TRADE_GATE_FLOW_VIEWPORT_PADDING = 24;

interface TradeGateFlowPanState {
  x: number;
  y: number;
}

interface TradeGateFlowDragState {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startPan: TradeGateFlowPanState;
}

interface TradeGateFlowViewState {
  scale: number;
  pan: TradeGateFlowPanState;
}

function TradeGateFlowMap({
  workflow,
  selectedNodeId,
  selectNode,
  unconnectedQuestions,
}: TradeGateFlowMapProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<TradeGateFlowDragState | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [viewState, setViewState] = useState<TradeGateFlowViewState>({
    scale: 1,
    pan: { x: 0, y: 0 },
  });
  const [isPanning, setIsPanning] = useState(false);
  const { scale, pan } = viewState;
  const startNode = workflow.nodes.find(
    (node) => node.id === workflow.startNodeId
  );
  const layout = startNode
    ? buildTradeGateFlowLayout(workflow, startNode)
    : null;
  const layoutWidth = layout?.width ?? 0;
  const layoutHeight = layout?.height ?? 0;

  const fitFlowToView = useCallback(() => {
    if (!layoutWidth || !layoutHeight || !viewportSize.width) return;

    const availableWidth = Math.max(
      viewportSize.width - TRADE_GATE_FLOW_VIEWPORT_PADDING * 2,
      1
    );
    const availableHeight = Math.max(
      viewportSize.height - TRADE_GATE_FLOW_VIEWPORT_PADDING * 2,
      1
    );
    const nextScale = Math.min(
      TRADE_GATE_FLOW_MAX_SCALE,
      Math.max(
        TRADE_GATE_FLOW_MIN_SCALE,
        Math.min(
          availableWidth / layoutWidth,
          availableHeight / layoutHeight,
          1
        )
      )
    );

    setViewState({
      scale: nextScale,
      pan: {
        x: Math.max(
          TRADE_GATE_FLOW_VIEWPORT_PADDING / 2,
          (viewportSize.width - layoutWidth * nextScale) / 2
        ),
        y: Math.max(
          TRADE_GATE_FLOW_VIEWPORT_PADDING / 2,
          (viewportSize.height - layoutHeight * nextScale) / 2
        ),
      },
    });
  }, [layoutHeight, layoutWidth, viewportSize.height, viewportSize.width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateViewportSize = () => {
      setViewportSize({
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      });
    };
    updateViewportSize();

    const resizeObserver = new ResizeObserver(updateViewportSize);
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    fitFlowToView();
  }, [fitFlowToView]);

  const zoomFlow = (direction: 'in' | 'out') => {
    const delta =
      direction === 'in'
        ? TRADE_GATE_FLOW_ZOOM_STEP
        : -TRADE_GATE_FLOW_ZOOM_STEP;
    const centerX = viewportSize.width / 2;
    const centerY = viewportSize.height / 2;

    setViewState((currentViewState) => {
      const nextScale = Math.min(
        TRADE_GATE_FLOW_MAX_SCALE,
        Math.max(TRADE_GATE_FLOW_MIN_SCALE, currentViewState.scale + delta)
      );
      if (nextScale === currentViewState.scale) return currentViewState;

      const ratio = nextScale / currentViewState.scale;
      return {
        scale: nextScale,
        pan: {
          x: centerX - (centerX - currentViewState.pan.x) * ratio,
          y: centerY - (centerY - currentViewState.pan.y) * ratio,
        },
      };
    });
  };

  const handleCanvasPointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (event.button !== 0) return;
    if (event.target instanceof HTMLElement && event.target.closest('button')) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPan: pan,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPanning(true);
  };

  const handleCanvasPointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    setViewState((currentViewState) => ({
      ...currentViewState,
      pan: {
        x: dragState.startPan.x + event.clientX - dragState.startClientX,
        y: dragState.startPan.y + event.clientY - dragState.startClientY,
      },
    }));
  };

  const finishCanvasPan = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    dragStateRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsPanning(false);
  };

  return (
    <div className="journalit-session-mode-trade-gate-flow-map">
      <div className="journalit-session-mode-trade-gate-flow-map__toolbar">
        <div className="journalit-session-mode-trade-gate-flow-canvas__controls">
          <Button size="sm" onClick={fitFlowToView}>
            {t('settings.session-mode.trade-gate.flow-fit')}
          </Button>
          <Button size="sm" onClick={() => zoomFlow('out')}>
            <Minus size={15} aria-hidden="true" />
          </Button>
          <span className="journalit-session-mode-trade-gate-flow-canvas__zoom">
            {Math.round(scale * 100)}%
          </span>
          <Button size="sm" onClick={() => zoomFlow('in')}>
            <Plus size={15} aria-hidden="true" />
          </Button>
        </div>
      </div>
      {!startNode ? (
        <div className="setting-item-description">
          {workflow.nodes.some((node) => node.type === 'question')
            ? t('settings.session-mode.trade-gate.no-paths')
            : t('settings.session-mode.trade-gate.no-questions')}
        </div>
      ) : (
        <div
          ref={canvasRef}
          className={`journalit-session-mode-trade-gate-flow-canvas${isPanning ? ' is-panning' : ''}`}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={finishCanvasPan}
          onPointerCancel={finishCanvasPan}
        >
          {layout && (
            <div
              key={workflow.startNodeId}
              className="journalit-session-mode-trade-gate-flow-stage"
              style={cssVars({
                '--trade-gate-flow-width': `${layout.width}px`,
                '--trade-gate-flow-height': `${layout.height}px`,
                '--trade-gate-flow-scale': scale,
                '--trade-gate-flow-pan-x': `${pan.x}px`,
                '--trade-gate-flow-pan-y': `${pan.y}px`,
              })}
            >
              <svg
                className="journalit-session-mode-trade-gate-flow-svg"
                width={layout.width}
                height={layout.height}
                viewBox={`0 0 ${layout.width} ${layout.height}`}
                role="img"
                aria-label={t('settings.session-mode.trade-gate.flow-map')}
              >
                {layout.edges.map((edge) => (
                  <TradeGateFlowEdge key={edge.id} edge={edge} />
                ))}
              </svg>
              {layout.edges.map((edge) => (
                <button
                  key={`${edge.id}-label`}
                  type="button"
                  className="journalit-session-mode-trade-gate-flow-edge-label-button"
                  onClick={() => selectNode(edge.sourceNodeId)}
                  style={cssVars({
                    '--trade-gate-flow-edge-label-left': `${edge.labelX}px`,
                    '--trade-gate-flow-edge-label-top': `${edge.labelY}px`,
                  })}
                >
                  {truncateFlowLabel(edge.label, 18)}
                </button>
              ))}
              {layout.nodes.map((layoutNode) => (
                <TradeGateFlowNodeButton
                  key={layoutNode.occurrenceId}
                  layoutNode={layoutNode}
                  isSelected={layoutNode.node.id === selectedNodeId}
                  selectNode={selectNode}
                />
              ))}
            </div>
          )}
          <div className="journalit-session-mode-trade-gate-flow-canvas__hint">
            {t('settings.session-mode.trade-gate.flow-click-hint')}
          </div>
        </div>
      )}
      {unconnectedQuestions.length > 0 && (
        <div className="journalit-session-mode-trade-gate-unconnected">
          <div className="journalit-session-mode-trade-gate-unconnected__header">
            <span className="journalit-session-mode-trade-gate-unconnected__title">
              {t('settings.session-mode.trade-gate.unconnected-title')}
            </span>
            <span className="journalit-session-mode-trade-gate-unconnected__count">
              {String(unconnectedQuestions.length)}
            </span>
          </div>
          <div className="setting-item-description">
            {t('settings.session-mode.trade-gate.unconnected-desc')}
          </div>
          <div className="journalit-session-mode-trade-gate-unconnected__list">
            {unconnectedQuestions.map((question, index) => (
              <button
                key={question.id}
                type="button"
                className={`journalit-session-mode-trade-gate-unconnected__item${question.id === selectedNodeId ? ' is-selected' : ''}`}
                onClick={() => selectNode(question.id)}
                aria-label={`${question.title || t('settings.session-mode.trade-gate.question')} ${index + 1}`}
              >
                <span className="journalit-session-mode-trade-gate-unconnected__item-title">
                  {question.title ||
                    t('settings.session-mode.trade-gate.question')}
                </span>
                <span className="journalit-session-mode-trade-gate-unconnected__item-index">
                  #{index + 1}
                </span>
                <Edit size={14} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TradeGateFlowEdge({ edge }: { edge: TradeGateFlowLayoutEdge }) {
  const midY = edge.sourceY + (edge.targetY - edge.sourceY) * 0.52;
  const path = `M ${edge.sourceX} ${edge.sourceY} C ${edge.sourceX} ${midY}, ${edge.targetX} ${midY}, ${edge.targetX} ${edge.targetY}`;

  return (
    <g className="journalit-session-mode-trade-gate-flow-edge">
      <path d={path} />
    </g>
  );
}

function TradeGateFlowNodeButton({
  layoutNode,
  isSelected,
  selectNode,
}: {
  layoutNode: TradeGateFlowLayoutNode;
  isSelected: boolean;
  selectNode: (nodeId: string) => void;
}) {
  const { node, x, y } = layoutNode;
  const label = getFlowNodeTitle(node);
  const detail = node.type === 'question' ? node.prompt : '';

  return (
    <button
      type="button"
      className={`journalit-session-mode-trade-gate-flow-svg-node journalit-session-mode-trade-gate-flow-button is-${node.type === 'outcome' ? node.outcome : 'question'}${isSelected ? ' is-selected' : ''}`}
      onClick={() => selectNode(node.id)}
      style={cssVars({
        '--trade-gate-flow-node-left': `${x}px`,
        '--trade-gate-flow-node-top': `${y}px`,
      })}
    >
      <span className="journalit-session-mode-trade-gate-flow-svg-node__icon">
        {getFlowNodeIcon(node)}
      </span>
      <span className="journalit-session-mode-trade-gate-flow-svg-node__content">
        <span className="journalit-session-mode-trade-gate-flow-svg-node__title">
          {truncateFlowLabel(label, 18)}
        </span>
        {detail && (
          <span className="journalit-session-mode-trade-gate-flow-svg-node__detail">
            {detail}
          </span>
        )}
      </span>
    </button>
  );
}

export function buildTradeGateFlowLayout(
  workflow: TradeGateWorkflow,
  startNode: TradeGateNode
): TradeGateFlowLayout {
  const nodesById = new Map(workflow.nodes.map((node) => [node.id, node]));
  const layoutNodes: TradeGateFlowLayoutNode[] = [];
  const edges: TradeGateFlowLayoutEdge[] = [];
  let leafCursor = 0;
  let maxDepth = 0;

  const place = (
    node: TradeGateNode,
    depth: number,
    ancestorNodeIds: string[],
    optionPath: string[]
  ): { center: number; x: number; y: number } => {
    maxDepth = Math.max(maxDepth, depth);
    const occurrenceId = `${node.id}-${optionPath.join('-') || 'root'}`;
    const isRepeated = ancestorNodeIds.includes(node.id);
    const targets: Array<{ option: TradeGateOption; target: TradeGateNode }> =
      [];
    if (node.type === 'question' && !isRepeated) {
      for (const option of node.options) {
        const target = nodesById.get(option.targetNodeId);
        if (target) targets.push({ option, target });
      }
    }

    const childPlacements = targets.map(({ option, target }) =>
      place(
        target,
        depth + 1,
        [...ancestorNodeIds, node.id],
        [...optionPath, option.id]
      )
    );
    const childCenters = childPlacements.map((placement) => placement.center);
    const center =
      childCenters.length > 0
        ? (childCenters[0] + childCenters[childCenters.length - 1]) / 2
        : leafCursor++;
    const x =
      TRADE_GATE_FLOW_PADDING +
      center * (TRADE_GATE_FLOW_NODE_WIDTH + TRADE_GATE_FLOW_HORIZONTAL_GAP);
    const y =
      TRADE_GATE_FLOW_PADDING +
      depth * (TRADE_GATE_FLOW_NODE_HEIGHT + TRADE_GATE_FLOW_VERTICAL_GAP);

    layoutNodes.push({ occurrenceId, node, x, y });

    targets.forEach(({ option }, index) => {
      const targetLayout = childPlacements[index];
      const sourceX = x + TRADE_GATE_FLOW_NODE_WIDTH / 2;
      const sourceY = y + TRADE_GATE_FLOW_NODE_HEIGHT;
      const targetX = targetLayout.x + TRADE_GATE_FLOW_NODE_WIDTH / 2;
      const targetY = targetLayout.y;
      const labelPosition = getTradeGateFlowEdgeLabelPosition({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
      edges.push({
        id: `${occurrenceId}-${option.id}`,
        sourceX,
        sourceY,
        targetX,
        targetY,
        labelX: labelPosition.x,
        labelY: labelPosition.y,
        label: option.label || t('settings.session-mode.trade-gate.option'),
        sourceNodeId: node.id,
      });
    });

    return { center, x, y };
  };

  place(startNode, 0, [], []);

  const usedLeaves = Math.max(leafCursor, 1);
  return {
    nodes: layoutNodes,
    edges,
    width:
      TRADE_GATE_FLOW_PADDING * 2 +
      usedLeaves * TRADE_GATE_FLOW_NODE_WIDTH +
      Math.max(0, usedLeaves - 1) * TRADE_GATE_FLOW_HORIZONTAL_GAP,
    height:
      TRADE_GATE_FLOW_PADDING * 2 +
      (maxDepth + 1) * TRADE_GATE_FLOW_NODE_HEIGHT +
      maxDepth * TRADE_GATE_FLOW_VERTICAL_GAP,
  };
}

function getTradeGateFlowEdgeLabelPosition({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: Pick<
  TradeGateFlowLayoutEdge,
  'sourceX' | 'sourceY' | 'targetX' | 'targetY'
>): { x: number; y: number } {
  const t = 0.5;
  const inverseT = 1 - t;
  const controlY = sourceY + (targetY - sourceY) * 0.52;
  const x =
    inverseT ** 3 * sourceX +
    3 * inverseT ** 2 * t * sourceX +
    3 * inverseT * t ** 2 * targetX +
    t ** 3 * targetX;
  const y =
    inverseT ** 3 * sourceY +
    3 * inverseT ** 2 * t * controlY +
    3 * inverseT * t ** 2 * controlY +
    t ** 3 * targetY;

  return { x, y: y - 11 };
}

function truncateFlowLabel(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function TradeGateQuestionEditor({
  titleInputRef,
  node,
  workflow,
  updateNode,
  addOptionToQuestion,
  removeNode,
}: {
  titleInputRef: React.RefObject<HTMLInputElement | null>;
  node: TradeGateQuestionNode;
  workflow: TradeGateWorkflow;
  updateNode: (node: TradeGateNode) => Promise<void>;
  addOptionToQuestion: (questionId: string) => Promise<void>;
  removeNode: (nodeId: string) => Promise<void>;
}) {
  const targetNodes = workflow.nodes.filter((target) => target.id !== node.id);
  const reachableNodeIds = getReachableTradeGateNodeIds(workflow);

  const updateOption = async (
    optionId: string,
    updates: Partial<TradeGateOption>
  ) => {
    await updateNode({
      ...node,
      options: node.options.map((option) =>
        option.id === optionId ? { ...option, ...updates } : option
      ),
    });
  };

  const removeOption = async (optionId: string) => {
    await updateNode({
      ...node,
      options: node.options.filter((option) => option.id !== optionId),
    });
  };

  return (
    <div className="journalit-session-mode-trade-gate-node is-question">
      <div className="journalit-session-mode-trade-gate-node__header">
        <span>{t('settings.session-mode.trade-gate.question')}</span>
        <NoTooltipButton
          label={t('button.delete')}
          className="journalit-session-mode-delete-window-button"
          onClick={() => void removeNode(node.id)}
        >
          <Trash2 size={22} aria-hidden="true" />
        </NoTooltipButton>
      </div>
      <div className="journalit-session-mode-trade-gate-editor-grid">
        <label className="journalit-session-mode-trade-gate-field">
          <span className="setting-item-description">
            {t('settings.session-mode.trade-gate.question-title')}
          </span>
          <input
            ref={titleInputRef}
            value={node.title}
            onChange={(event) =>
              void updateNode({ ...node, title: event.target.value })
            }
            className="setting-input journalit-settings-input"
          />
        </label>
        <label className="journalit-session-mode-trade-gate-field journalit-session-mode-trade-gate-field--wide">
          <span className="setting-item-description">
            {t('settings.session-mode.trade-gate.prompt')}
          </span>
          <textarea
            value={node.prompt}
            onChange={(event) =>
              void updateNode({ ...node, prompt: event.target.value })
            }
            className="setting-input journalit-settings-input journalit-session-mode-trade-gate-textarea"
            rows={2}
          />
        </label>
      </div>

      <div className="journalit-session-mode-trade-gate-options-editor">
        <div className="journalit-session-mode-trade-gate-options-editor__header">
          <span>{t('settings.session-mode.trade-gate.options')}</span>
          <Button size="sm" onClick={() => void addOptionToQuestion(node.id)}>
            <Plus size={15} aria-hidden="true" />
            {t('button.add')}
          </Button>
        </div>
        {node.options.map((option) => (
          <div
            key={option.id}
            className="journalit-session-mode-trade-gate-option-row"
          >
            <input
              value={option.label}
              onChange={(event) =>
                void updateOption(option.id, { label: event.target.value })
              }
              className="setting-input journalit-settings-input"
              aria-label={t('settings.session-mode.trade-gate.option-label')}
            />
            <select
              value={option.targetNodeId}
              onChange={(event) =>
                void updateOption(option.id, {
                  targetNodeId: event.target.value,
                })
              }
              className="dropdown journalit-settings-input"
              aria-label={t('settings.session-mode.trade-gate.option-target')}
            >
              {targetNodes.map((target) => (
                <option key={target.id} value={target.id}>
                  {getNodeDisplayLabel(target)}
                  {target.type === 'question' &&
                  !reachableNodeIds.has(target.id)
                    ? ` · ${t('settings.session-mode.trade-gate.unconnected-label')}`
                    : ''}
                </option>
              ))}
            </select>
            <NoTooltipButton
              label={t('button.delete')}
              className="journalit-session-mode-delete-window-button"
              onClick={() => void removeOption(option.id)}
            >
              <Trash2 size={20} aria-hidden="true" />
            </NoTooltipButton>
          </div>
        ))}
      </div>
    </div>
  );
}

function TradeGateOutcomeEditor({
  node,
  updateNode,
  removeNode,
}: {
  node: TradeGateOutcomeNode;
  updateNode: (node: TradeGateNode) => Promise<void>;
  removeNode: (nodeId: string) => Promise<void>;
}) {
  return (
    <div
      className={`journalit-session-mode-trade-gate-node is-${node.outcome}`}
    >
      <div className="journalit-session-mode-trade-gate-node__header">
        <span>{t('settings.session-mode.trade-gate.outcome')}</span>
        <NoTooltipButton
          label={t('button.delete')}
          className="journalit-session-mode-delete-window-button"
          onClick={() => void removeNode(node.id)}
        >
          <Trash2 size={22} aria-hidden="true" />
        </NoTooltipButton>
      </div>
      <div className="journalit-session-mode-trade-gate-editor-grid">
        <label className="journalit-session-mode-trade-gate-field">
          <span className="setting-item-description">
            {t('settings.session-mode.trade-gate.outcome-type')}
          </span>
          <select
            value={node.outcome}
            onChange={(event) => {
              const outcome = getOutcomeFromValue(event.target.value);
              void updateNode({
                ...node,
                outcome,
              });
            }}
            className="dropdown journalit-settings-input"
          >
            <option value="green-light">
              {t('trade-gate.outcome.green-light')}
            </option>
            <option value="no-trade">{t('trade-gate.outcome.no-trade')}</option>
            <option value="wait">{t('trade-gate.outcome.wait')}</option>
          </select>
        </label>
        <label className="journalit-session-mode-trade-gate-field">
          <span className="setting-item-description">
            {t('settings.session-mode.trade-gate.result-title')}
          </span>
          <input
            value={node.title}
            onChange={(event) =>
              void updateNode({ ...node, title: event.target.value })
            }
            className="setting-input journalit-settings-input journalit-session-mode-trade-gate-result-title-input"
          />
        </label>
        <label className="journalit-session-mode-trade-gate-field journalit-session-mode-trade-gate-field--wide">
          <span className="setting-item-description">
            {t('settings.session-mode.trade-gate.description')}
          </span>
          <textarea
            value={node.description ?? ''}
            onChange={(event) =>
              void updateNode({ ...node, description: event.target.value })
            }
            className="setting-input journalit-settings-input journalit-session-mode-trade-gate-textarea"
            rows={2}
          />
        </label>
      </div>
    </div>
  );
}

function getNodeDisplayLabel(node: TradeGateNode): string {
  if (node.type === 'question') {
    return node.title || t('settings.session-mode.trade-gate.question');
  }
  const outcomeLabel = getOutcomeLabel(node.outcome);
  if (!node.title || node.title === outcomeLabel) {
    return outcomeLabel;
  }
  return `${node.title} · ${outcomeLabel}`;
}

function getFlowNodeTitle(node: TradeGateNode): string {
  if (node.type === 'question') {
    return node.title || t('settings.session-mode.trade-gate.question');
  }
  return node.title || getOutcomeLabel(node.outcome);
}

function getFlowNodeIcon(node: TradeGateNode): React.ReactNode {
  if (node.type === 'question') return '?';
  switch (node.outcome) {
    case 'green-light':
      return '✓';
    case 'no-trade':
      return '×';
    case 'wait':
      return <ClockAlert size={18} aria-hidden="true" />;
  }
}

function normalizeTradeGateWorkflowOutcomes(
  workflow: TradeGateWorkflow
): TradeGateWorkflow {
  const canonicalOutcomeIds = new Map<TradeGateOutcomeType, string>();
  const duplicateOutcomeIds = new Map<string, string>();
  const duplicateOutcomeTypes = new Map<string, TradeGateOutcomeType>();
  const normalizedNodes: TradeGateNode[] = [];

  for (const node of workflow.nodes) {
    if (node.type === 'question') {
      normalizedNodes.push(node);
      continue;
    }

    const existingCanonicalOutcomeId = canonicalOutcomeIds.get(node.outcome);
    if (!existingCanonicalOutcomeId) {
      canonicalOutcomeIds.set(node.outcome, node.id);
    }

    if (isDefaultOutcomeNode(node)) {
      if (existingCanonicalOutcomeId) {
        duplicateOutcomeIds.set(node.id, existingCanonicalOutcomeId);
        duplicateOutcomeTypes.set(node.id, node.outcome);
        continue;
      }

      normalizedNodes.push(node);
      continue;
    }

    if (isDuplicateDefaultLikeOutcome(node, canonicalOutcomeIds)) {
      const canonicalId = canonicalOutcomeIds.get(node.outcome);
      if (canonicalId) {
        duplicateOutcomeIds.set(node.id, canonicalId);
        duplicateOutcomeTypes.set(node.id, node.outcome);
        continue;
      }
    }

    normalizedNodes.push(node);
  }

  const ensureOutcome = (outcome: TradeGateOutcomeType) => {
    if (canonicalOutcomeIds.has(outcome)) return;
    const node: TradeGateOutcomeNode = {
      id: generateUUID(),
      type: 'outcome',
      outcome,
      title: getDefaultOutcomeTitle(outcome),
      description: getDefaultOutcomeDescription(outcome),
    };
    canonicalOutcomeIds.set(outcome, node.id);
    normalizedNodes.push(node);
  };

  ensureOutcome('green-light');
  ensureOutcome('no-trade');
  ensureOutcome('wait');

  return {
    ...workflow,
    nodes: normalizedNodes.map((node) => {
      if (node.type !== 'question') return node;
      return {
        ...node,
        options: node.options.map((option) => ({
          ...option,
          targetNodeId: getNormalizedTargetNodeId(
            option,
            duplicateOutcomeIds,
            duplicateOutcomeTypes,
            canonicalOutcomeIds
          ),
        })),
      };
    }),
  };
}

function isDefaultOutcomeNode(node: TradeGateOutcomeNode): boolean {
  return node.title === getDefaultOutcomeTitle(node.outcome);
}

function isDuplicateDefaultLikeOutcome(
  node: TradeGateOutcomeNode,
  canonicalOutcomeIds: Map<TradeGateOutcomeType, string>
): boolean {
  return (
    canonicalOutcomeIds.has(node.outcome) &&
    node.title === getDefaultOutcomeTitle(node.outcome)
  );
}

function getNormalizedTargetNodeId(
  option: TradeGateOption,
  duplicateOutcomeIds: Map<string, string>,
  duplicateOutcomeTypes: Map<string, TradeGateOutcomeType>,
  canonicalOutcomeIds: Map<TradeGateOutcomeType, string>
): string {
  const duplicateOutcomeType = duplicateOutcomeTypes.get(option.targetNodeId);
  if (!duplicateOutcomeType) {
    return duplicateOutcomeIds.get(option.targetNodeId) ?? option.targetNodeId;
  }

  const label = option.label.trim().toLowerCase();
  if (duplicateOutcomeType === 'green-light' && label === 'no') {
    return canonicalOutcomeIds.get('no-trade') ?? option.targetNodeId;
  }
  if (duplicateOutcomeType === 'green-light' && label === 'wait') {
    return canonicalOutcomeIds.get('wait') ?? option.targetNodeId;
  }

  return duplicateOutcomeIds.get(option.targetNodeId) ?? option.targetNodeId;
}

function getOutcomeLabel(outcome: TradeGateOutcomeType): string {
  switch (outcome) {
    case 'green-light':
      return t('trade-gate.outcome.green-light');
    case 'no-trade':
      return t('trade-gate.outcome.no-trade');
    case 'wait':
      return t('trade-gate.outcome.wait');
  }
}

function getOutcomeFromValue(value: string): TradeGateOutcomeType {
  switch (value) {
    case 'green-light':
    case 'no-trade':
    case 'wait':
      return value;
    default:
      return 'wait';
  }
}

function getDefaultOutcomeTitle(outcome: TradeGateOutcomeType): string {
  return getOutcomeLabel(outcome);
}

function getDefaultOutcomeDescription(outcome: TradeGateOutcomeType): string {
  switch (outcome) {
    case 'green-light':
      return t('trade-gate.outcome.green-light-description');
    case 'no-trade':
      return t('trade-gate.outcome.no-trade-description');
    case 'wait':
      return t('trade-gate.outcome.wait-description');
  }
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
