import {
  agentContractManifest,
  type AgentRelayMessage,
  type AgentToolContracts,
  type AgentToolName,
} from './protocol';
import type { AgentScope } from './AgentPermissions';

type AgentInvoke = Extract<AgentRelayMessage, { type: 'tool.invoke' }>;

export interface AgentToolContext {
  operationId: string;
  requestId: string;
  vaultId: string;
  installationId: string;
  scopes: readonly AgentScope[];
  deadline: string;
  traceparent?: string;
  priorResultHint?: string;
  
  maxResultBytes?: number;
  signal: AbortSignal;
}

export interface AgentToolHandlerResult<Tool extends AgentToolName> {
  result: AgentToolContracts[Tool]['result'];
  resultId?: string;
}

export type AgentToolHandler<Tool extends AgentToolName> = (
  request: AgentToolContracts[Tool]['request'],
  context: AgentToolContext
) => Promise<AgentToolHandlerResult<Tool>>;

type AgentToolRegistration = {
  [Tool in AgentToolName]: {
    tool: Tool;
    handler: AgentToolHandler<Tool>;
  };
}[AgentToolName];

type HandlerSlots = {
  [Tool in AgentToolName]?: AgentToolHandler<Tool>;
};

export class AgentToolRegistry {
  private readonly handlers: HandlerSlots = {};

  register(registration: AgentToolRegistration): void {
    if (this.has(registration.tool)) {
      throw new Error(`Agent tool is already registered: ${registration.tool}`);
    }

    switch (registration.tool) {
      case 'analyze_behavior':
        this.handlers.analyze_behavior = registration.handler;
        break;
      case 'apply_changes':
        this.handlers.apply_changes = registration.handler;
        break;
      case 'evaluate_trades':
        this.handlers.evaluate_trades = registration.handler;
        break;
      case 'get_premarket_brief':
        this.handlers.get_premarket_brief = registration.handler;
        break;
      case 'get_review':
        this.handlers.get_review = registration.handler;
        break;
      case 'get_trade':
        this.handlers.get_trade = registration.handler;
        break;
      case 'inspect_journal':
        this.handlers.inspect_journal = registration.handler;
        break;
      case 'inspect_configuration':
        this.handlers.inspect_configuration = registration.handler;
        break;
      case 'navigate_journalit':
        this.handlers.navigate_journalit = registration.handler;
        break;
      case 'query_trades':
        this.handlers.query_trades = registration.handler;
        break;
      case 'run_integration':
        this.handlers.run_integration = registration.handler;
        break;
      case 'view_image':
        this.handlers.view_image = registration.handler;
        break;
      default: {
        const exhaustiveRegistration: never = registration;
        return exhaustiveRegistration;
      }
    }
  }

  has(tool: AgentToolName): boolean {
    return this.handlers[tool] !== undefined;
  }

  listCapabilities(): AgentToolName[] {
    return agentContractManifest.tools.filter((tool) => this.has(tool));
  }

  async execute(
    invocation: AgentInvoke,
    context: AgentToolContext
  ): Promise<AgentToolHandlerResult<AgentToolName>> {
    switch (invocation.tool) {
      case 'analyze_behavior':
        return this.requireHandler('analyze_behavior')(
          invocation.arguments,
          context
        );
      case 'apply_changes':
        return this.requireHandler('apply_changes')(
          invocation.arguments,
          context
        );
      case 'evaluate_trades':
        return this.requireHandler('evaluate_trades')(
          invocation.arguments,
          context
        );
      case 'get_premarket_brief':
        return this.requireHandler('get_premarket_brief')(
          invocation.arguments,
          context
        );
      case 'get_review':
        return this.requireHandler('get_review')(invocation.arguments, context);
      case 'get_trade':
        return this.requireHandler('get_trade')(invocation.arguments, context);
      case 'inspect_journal':
        return this.requireHandler('inspect_journal')(
          invocation.arguments,
          context
        );
      case 'inspect_configuration':
        return this.requireHandler('inspect_configuration')(
          invocation.arguments,
          context
        );
      case 'navigate_journalit':
        return this.requireHandler('navigate_journalit')(
          invocation.arguments,
          context
        );
      case 'query_trades':
        return this.requireHandler('query_trades')(
          invocation.arguments,
          context
        );
      case 'run_integration':
        return this.requireHandler('run_integration')(
          invocation.arguments,
          context
        );
      case 'view_image':
        return this.requireHandler('view_image')(invocation.arguments, context);
      default: {
        const exhaustiveInvocation: never = invocation;
        return exhaustiveInvocation;
      }
    }
  }

  private requireHandler<Tool extends AgentToolName>(
    tool: Tool
  ): AgentToolHandler<Tool> {
    const handler = this.handlers[tool];
    if (handler === undefined) {
      throw new Error(`Agent tool is not registered: ${tool}`);
    }
    return handler;
  }
}
