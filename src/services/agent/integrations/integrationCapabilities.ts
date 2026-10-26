import type { InspectJournalResult } from '../protocol/generated/inspect_journal.result.generated';
import type { RunIntegrationResult } from '../protocol/generated/run_integration.result.generated';

type JournalIntegrations = NonNullable<
  Extract<InspectJournalResult, { status: 'ok' }>['journal']['integrations']
>;
type RunIntegrationCapabilities = Extract<
  RunIntegrationResult,
  { variant: 'capabilities' }
>['capabilities'];

function freezeCapabilities() {
  const tradovate = Object.freeze({
    integration: 'tradovate' as const,
    actions: Object.freeze([
      'inspect_status',
      'start_sync',
      'operation_status',
    ] as const),
  });
  const tradeImport = Object.freeze({
    integration: 'trade_import' as const,
    actions: Object.freeze(['open_import_workflow'] as const),
  });
  const economicCalendar = Object.freeze({
    integration: 'economic_calendar' as const,
    actions: Object.freeze(['import_economic_calendar'] as const),
  });
  return Object.freeze([tradovate, tradeImport, economicCalendar] as const);
}

const AGENT_INTEGRATION_CAPABILITIES = freezeCapabilities();

export function projectAgentIntegrationCapabilities(): JournalIntegrations &
  RunIntegrationCapabilities {
  return AGENT_INTEGRATION_CAPABILITIES.map((entry) => {
    switch (entry.integration) {
      case 'tradovate':
        return {
          integration: 'tradovate' as const,
          actions: [...entry.actions],
        };
      case 'trade_import':
        return {
          integration: 'trade_import' as const,
          actions: [...entry.actions],
        };
      case 'economic_calendar':
        return {
          integration: 'economic_calendar' as const,
          actions: [...entry.actions],
        };
      default: {
        const exhaustive: never = entry;
        return exhaustive;
      }
    }
  });
}
