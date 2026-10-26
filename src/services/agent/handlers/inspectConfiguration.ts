import type { SessionModeSettings } from '../../../types/sessionMode';
import type { ReviewTemplate } from '../../../types/reviewV2';
import type { WidgetDefinition } from '../../../data/widgetRegistry';
import type { MetricDefinition } from '../../../components/dashboard/components/TopSection/types';
import type { WidgetDefinition as DashboardWidgetDefinition } from '../../../components/dashboard/components/BottomSection/types';
import type { HomeWidgetDefinition } from '../../../components/home/homeTypes';
import type { AccountCatalogEntry } from '../../accountPage/types';
import type { Setup } from '../../setup/types';
import type { AgentToolHandler } from '../AgentToolRegistry';
import { setupReadErrorResult } from './setupReadError';
import type { CustomFieldDefinition } from '../../../types/customFields';
import type { SessionLogTagDefinition } from '../../../types/sessionLog';
import { projectCustomFieldConfiguration } from '../configuration/customFieldConfiguration';
import { projectSessionLogTagConfiguration } from '../configuration/sessionLogTagConfiguration';
import { projectAccountConfiguration } from '../configuration/accountConfiguration';
import type { AccountSources } from '../configuration/accountConfigurationSources';
import {
  projectPropChallengeConfiguration,
  type PropChallengeSource,
} from '../configuration/propChallengeConfiguration';
import {
  projectSetupDefinitions,
  SetupDefinitionProjectionError,
  type SetupDefinitionExtras,
} from '../configuration/setupDefinitionConfiguration';
import {
  assertOptionCatalogProjectionLimits,
  isSetupIdentityCandidate,
  OptionCatalogProjectionLimitError,
  projectDashboardLayoutConfiguration,
  projectHomeLayoutConfiguration,
  projectOptionCatalogConfiguration,
  projectReviewTemplateConfiguration,
  projectSessionModeConfiguration,
  projectSettingsConfiguration,
  type RawOwnedSettings,
  type RawHomeLayoutSettings,
  type RawLayoutSettings,
  type ReviewTemplateConfigurationSettings,
} from '../configuration';
import {
  agentContractManifest,
  parseAgentToolRequest,
  parseAgentToolResult,
  type AgentToolContracts,
} from '../protocol';

type Result = AgentToolContracts['inspect_configuration']['result'];

const INVALID_REQUEST: Result = {
  status: 'error',
  code: 'invalid_request',
  message: 'Configuration inspection request is invalid.',
  retryable: false,
};
const INTERNAL_ERROR: Result = {
  status: 'error',
  code: 'internal_error',
  message: 'Configuration inspection is temporarily unavailable.',
  retryable: true,
};
const LIMIT_EXCEEDED: Result = {
  status: 'error',
  code: 'limit_exceeded',
  message: 'A configuration catalog exceeds the supported inspection limit.',
  retryable: false,
};

interface InspectConfigurationDependencies {
  getSessionModeSettings(): SessionModeSettings;
  getReviewTemplateSettings(): ReviewTemplateConfigurationSettings;
  getBuiltInReviewTemplates(): readonly ReviewTemplate[];
  getReviewWidgetCatalog(): readonly WidgetDefinition[];
  getDashboardLayoutSettings(): RawLayoutSettings;
  getDashboardMetricCatalog(): readonly MetricDefinition[];
  getDashboardWidgetCatalog(): readonly DashboardWidgetDefinition[];
  getHomeLayoutSettings(): RawHomeLayoutSettings;
  getHomeWidgetCatalog(): readonly HomeWidgetDefinition[];
  getRawOptionSettings(): unknown;
  getRawAccountSettings(): unknown;
  listSetups(): Promise<Setup[]>;
  readSetupDefinitions(): Promise<Setup[]>;
  describeSetup(
    setup: Setup,
    signal: AbortSignal
  ): Promise<SetupDefinitionExtras>;
  ensureSetupIds(
    names: readonly string[]
  ): Promise<ReadonlyMap<string, string | null>>;
  getAccountCatalog(): Promise<AccountCatalogEntry[]>;
  getSettingsConfiguration(): RawOwnedSettings;
  getCustomFields(): readonly CustomFieldDefinition[];
  getCustomFieldCreatedOptions(fieldId: string): readonly string[];
  getSessionLogTags(): readonly SessionLogTagDefinition[];
  getSessionLogAlertRuleTagId(): string | undefined;
  readAccountSources(signal: AbortSignal): Promise<AccountSources>;
  readPropChallengeSources(
    signal: AbortSignal
  ): Promise<readonly PropChallengeSource[]>;
}

export function createInspectConfigurationHandler(
  dependencies: InspectConfigurationDependencies
): AgentToolHandler<'inspect_configuration'> {
  return async (untrustedRequest, context) => {
    try {
      if (context.signal.aborted) throw context.signal.reason;
      let request: AgentToolContracts['inspect_configuration']['request'];
      try {
        request = parseAgentToolRequest(
          'inspect_configuration',
          untrustedRequest
        );
      } catch {
        return { result: INVALID_REQUEST };
      }
      const configuration: Record<string, unknown> = {};
      const projectDomain = async (
        domain: (typeof request.domains)[number]
      ): Promise<readonly [string, unknown]> => {
        
        
        if (context.signal.aborted) throw context.signal.reason;
        switch (domain) {
          case 'session_mode':
            return [
              domain,
              await projectSessionModeConfiguration(
                dependencies.getSessionModeSettings()
              ),
            ];
          case 'review_templates':
            return [
              domain,
              await projectReviewTemplateConfiguration(
                dependencies.getReviewTemplateSettings(),
                dependencies.getBuiltInReviewTemplates(),
                dependencies.getReviewWidgetCatalog()
              ),
            ];
          case 'dashboard_layouts':
            return [
              domain,
              await projectDashboardLayoutConfiguration(
                dependencies.getDashboardLayoutSettings(),
                dependencies.getDashboardMetricCatalog(),
                dependencies.getDashboardWidgetCatalog()
              ),
            ];
          case 'home_layouts':
            return [
              domain,
              await projectHomeLayoutConfiguration(
                dependencies.getHomeLayoutSettings(),
                dependencies.getHomeWidgetCatalog()
              ),
            ];
          case 'settings':
            return [
              domain,
              await projectSettingsConfiguration(
                dependencies.getSettingsConfiguration()
              ),
            ];
          case 'setups': {
            
            
            if (request.setup_ids === undefined) {
              throw new Error(
                'Setup inspection requires validated identities.'
              );
            }
            const setups = await dependencies.readSetupDefinitions();
            if (context.signal.aborted) throw context.signal.reason;
            const requested = new Set(request.setup_ids);
            const extras = new Map<Setup, SetupDefinitionExtras>();
            for (const setup of setups) {
              if (
                setup.agentEntityId === undefined ||
                !requested.has(setup.agentEntityId)
              )
                continue;
              extras.set(
                setup,
                await dependencies.describeSetup(setup, context.signal)
              );
              if (context.signal.aborted) throw context.signal.reason;
            }
            return [
              domain,
              projectSetupDefinitions(
                setups,
                request.setup_ids,
                request.playbook_max_chars ?? 2000,
                (setup) => {
                  const described = extras.get(setup);
                  if (!described)
                    throw new Error('Setup definition was not described.');
                  return described;
                }
              ),
            ];
          }
          case 'option_catalogs': {
            const rawOptions = dependencies.getRawOptionSettings();
            const rawAccountSettings = dependencies.getRawAccountSettings();
            if (context.signal.aborted) throw context.signal.reason;
            const setups = await dependencies.listSetups();
            if (context.signal.aborted) throw context.signal.reason;
            const accounts = await dependencies.getAccountCatalog();
            if (context.signal.aborted) throw context.signal.reason;
            assertOptionCatalogProjectionLimits({
              rawOptions,
              rawAccountSettings,
              setups,
              accounts,
            });
            const identityNames = setups.flatMap((setup) =>
              setup.agentEntityId === undefined &&
              isSetupIdentityCandidate(setup)
                ? [setup.name]
                : []
            );
            let mintedIdentities: ReadonlyMap<string, string | null> =
              new Map();
            if (identityNames.length > 0) {
              if (context.signal.aborted) throw context.signal.reason;
              mintedIdentities =
                await dependencies.ensureSetupIds(identityNames);
              if (context.signal.aborted) throw context.signal.reason;
            }
            const setupsWithIdentities = setups.map((setup) => ({
              ...setup,
              agentEntityId:
                setup.agentEntityId ??
                mintedIdentities.get(setup.name) ??
                undefined,
            }));
            const projection = await projectOptionCatalogConfiguration({
              rawOptions,
              rawAccountSettings,
              setups: setupsWithIdentities,
              accounts,
            });
            if (context.signal.aborted) throw context.signal.reason;
            return [domain, projection];
          }
          case 'custom_fields':
            return [
              domain,
              await projectCustomFieldConfiguration(
                dependencies.getCustomFields(),
                (fieldId) => dependencies.getCustomFieldCreatedOptions(fieldId)
              ),
            ];
          case 'session_log_tags':
            return [
              domain,
              await projectSessionLogTagConfiguration(
                dependencies.getSessionLogTags(),
                dependencies.getSessionLogAlertRuleTagId()
              ),
            ];
          case 'accounts': {
            const accounts = await dependencies.readAccountSources(
              context.signal
            );
            if (context.signal.aborted) throw context.signal.reason;
            return [
              domain,
              await projectAccountConfiguration(accounts.sources, (name) =>
                accounts.accountIdFor(name)
              ),
            ];
          }
          case 'prop_challenges': {
            const challenges = await dependencies.readPropChallengeSources(
              context.signal
            );
            if (context.signal.aborted) throw context.signal.reason;
            return [
              domain,
              await projectPropChallengeConfiguration(challenges),
            ];
          }
          default: {
            const exhaustiveDomain: never = domain;
            return exhaustiveDomain;
          }
        }
      };
      const projections = await Promise.all(request.domains.map(projectDomain));
      for (const [domain, projection] of projections) {
        configuration[domain] = projection;
      }
      if (context.signal.aborted) throw context.signal.reason;
      const result = parseAgentToolResult('inspect_configuration', {
        status: 'ok',
        meta: {
          contract_version: agentContractManifest.version,
          contract_digest: agentContractManifest.digest,
          cached: false,
        },
        configuration,
      });
      return { result };
    } catch (error) {
      if (context.signal.aborted) throw context.signal.reason;
      if (error instanceof OptionCatalogProjectionLimitError) {
        return { result: LIMIT_EXCEEDED };
      }
      if (error instanceof SetupDefinitionProjectionError) {
        return {
          result: {
            status: 'error',
            code: error.code,
            message: {
              not_found:
                'Setup definition not found. Rediscover setup IDs through inspect_journal or option_catalogs.',
              conflict:
                'Setup identities or rule relationships are ambiguous. Resolve copied setup IDs or invalid rule groups before inspecting again.',
              limit_exceeded:
                'Setup definition exceeds structured-content limits. Reduce oversized rules or preferences before inspecting again.',
            }[error.code],
            retryable: false,
          },
        };
      }
      return { result: setupReadErrorResult(error) ?? INTERNAL_ERROR };
    }
  };
}
