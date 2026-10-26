import type { AgentRelayMessage, AgentToolName } from './protocol';
import { agentActionCatalog } from './protocol/generated/manifest.generated';

export type AgentScope = Extract<
  AgentRelayMessage,
  { type: 'tool.invoke' }
>['scopes'][number];

export const AGENT_SCOPES = [
  'trades:read',
  'trades:write',
  'analytics:read',
  'reviews:read',
  'reviews:write',
  'integrations:read',
  'integrations:run',
  'navigation:control',
  'configuration:read',
  'configuration:write',
] as const satisfies readonly AgentScope[];

type AgentToolRequest<Tool extends AgentToolName> = Extract<
  Extract<AgentRelayMessage, { type: 'tool.invoke' }>,
  { tool: Tool }
>['arguments'];

function requiredIntegrationScope(
  request: AgentToolRequest<'run_integration'>
): AgentScope {
  switch (request.action) {
    case 'inspect_capabilities':
    case 'inspect_status':
    case 'operation_status':
      return 'integrations:read';
    case 'start_sync':
    case 'open_import_workflow':
    case 'import_economic_calendar':
      
      return 'integrations:run';
    default: {
      const exhaustiveAction: never = request;
      return exhaustiveAction;
    }
  }
}


const actionScopes: ReadonlyMap<string, AgentScope> = new Map(
  agentActionCatalog.map((entry) => [entry.id, entry.scope])
);


function hasApplyChangesPermission(
  request: AgentToolRequest<'apply_changes'>,
  scopes: readonly AgentScope[]
): boolean {
  if (request.mode === 'commit') return true;
  const granted = new Set(scopes);
  return request.actions.every((call) => {
    const scope = actionScopes.get(call.action);
    return scope !== undefined && granted.has(scope);
  });
}

export function hasAgentToolPermission<Tool extends AgentToolName>(
  tool: Tool,
  request: AgentToolRequest<Tool>,
  scopes: readonly AgentScope[]
): boolean {
  let requiredScope: AgentScope | undefined;
  switch (tool) {
    case 'inspect_journal':
      requiredScope = undefined;
      break;
    case 'query_trades':
    case 'get_trade':
      requiredScope = 'trades:read';
      break;
    case 'evaluate_trades':
    case 'analyze_behavior':
      requiredScope = 'analytics:read';
      break;
    case 'get_premarket_brief':
      
      return (
        scopes.includes('analytics:read') && scopes.includes('reviews:read')
      );
    case 'get_review':
      requiredScope = 'reviews:read';
      break;
    case 'view_image':
      
      requiredScope = 'trade_id' in request ? 'trades:read' : 'reviews:read';
      break;
    case 'inspect_configuration':
      requiredScope = 'configuration:read';
      break;
    case 'navigate_journalit':
      requiredScope = 'navigation:control';
      break;
    case 'apply_changes':
      return hasApplyChangesPermission(
        request as AgentToolRequest<'apply_changes'>,
        scopes
      );
    case 'run_integration':
      requiredScope = requiredIntegrationScope(
        request as AgentToolRequest<'run_integration'>
      );
      break;
    default: {
      const exhaustiveTool: never = tool;
      return exhaustiveTool;
    }
  }
  return requiredScope === undefined || scopes.includes(requiredScope);
}
