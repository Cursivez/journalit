import type {
  SessionModeConfigurablePhase,
  SessionModeLayoutModuleId,
  SessionModePhaseLayouts,
} from '../types/sessionMode';
import { DEFAULT_SESSION_MODE_SETTINGS } from '../types/sessionMode';
import type { TranslationKey } from '../lang/locale/en';

interface SessionModeLayoutModuleDefinition {
  id: SessionModeLayoutModuleId;
  phases: readonly SessionModeConfigurablePhase[];
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
}

export const SESSION_MODE_CONFIGURABLE_PHASES: readonly SessionModeConfigurablePhase[] =
  ['preparation', 'live', 'ended'];

const SESSION_MODE_LAYOUT_MODULES: readonly SessionModeLayoutModuleDefinition[] =
  [
    {
      id: 'preparationResources',
      phases: ['preparation'],
      labelKey: 'settings.session-mode.layout.module.preparation-resources',
      descriptionKey:
        'settings.session-mode.layout.module.preparation-resources-desc',
    },
    {
      id: 'preparationGoals',
      phases: ['preparation'],
      labelKey: 'settings.session-mode.layout.module.preparation-goals',
      descriptionKey:
        'settings.session-mode.layout.module.preparation-goals-desc',
    },
    {
      id: 'preparationChecklist',
      phases: ['preparation'],
      labelKey: 'settings.session-mode.layout.module.preparation-checklist',
      descriptionKey:
        'settings.session-mode.layout.module.preparation-checklist-desc',
    },
    {
      id: 'tradeGate',
      phases: ['live'],
      labelKey: 'settings.session-mode.layout.module.trade-gate',
      descriptionKey: 'settings.session-mode.layout.module.trade-gate-desc',
    },
    {
      id: 'timeline',
      phases: ['live'],
      labelKey: 'settings.session-mode.layout.module.timeline',
      descriptionKey: 'settings.session-mode.layout.module.timeline-desc',
    },
    {
      id: 'endedActions',
      phases: ['ended'],
      labelKey: 'settings.session-mode.layout.module.ended-actions',
      descriptionKey: 'settings.session-mode.layout.module.ended-actions-desc',
    },
    {
      id: 'endedStats',
      phases: ['ended'],
      labelKey: 'settings.session-mode.layout.module.ended-stats',
      descriptionKey: 'settings.session-mode.layout.module.ended-stats-desc',
    },
  ];

export const getSessionModeModulesForPhase = (
  phase: SessionModeConfigurablePhase
): readonly SessionModeLayoutModuleDefinition[] =>
  SESSION_MODE_LAYOUT_MODULES.filter((module) => module.phases.includes(phase));

export const getDefaultSessionModePhaseLayouts = (): SessionModePhaseLayouts =>
  structuredClone(DEFAULT_SESSION_MODE_SETTINGS.phaseLayouts);

export const normalizeSessionModePhaseLayouts = (
  layouts: Partial<SessionModePhaseLayouts> | undefined
): SessionModePhaseLayouts => {
  const defaults = getDefaultSessionModePhaseLayouts();

  for (const phase of SESSION_MODE_CONFIGURABLE_PHASES) {
    const supportedModuleIds = new Set(
      getSessionModeModulesForPhase(phase).map((module) => module.id)
    );
    const configuredModuleIds = Array.isArray(layouts?.[phase])
      ? layouts[phase]
      : defaults[phase];

    defaults[phase] = configuredModuleIds.filter(
      (moduleId): moduleId is SessionModeLayoutModuleId =>
        supportedModuleIds.has(moduleId)
    );
  }

  return defaults;
};
