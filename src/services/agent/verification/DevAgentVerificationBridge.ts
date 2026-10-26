

import { AGENT_SCOPES, type AgentScope } from '../AgentPermissions';
import { AgentRuntimeService } from '../AgentRuntimeService';
import type { AgentToolRegistry } from '../AgentToolRegistry';
import {
  agentContractManifest,
  type AgentRelayMessage,
  type AgentToolName,
} from '../protocol';
import { generateUUID, isCanonicalNonNilUuid } from '../../../utils/uuid';

const PROPERTY_NAME = '__journalitVerify';
const MIN_TIMEOUT_MS = 1_000;
const MAX_TIMEOUT_MS = 120_000;
const DEFAULT_TIMEOUT_MS = 30_000;

interface DevAgentVerificationHost {
  serviceManager: {
    getAgentToolRegistry(): AgentToolRegistry;
  };
}

type DevAgentVerificationInvokeResult =
  | { ok: true; frame: AgentRelayMessage }
  | { ok: false; error: string };

type AgentTerminalFrame = Extract<
  AgentRelayMessage,
  { type: 'tool.result' | 'tool.error' }
>;

interface ValidatedInvokeAgentToolInput {
  tool: AgentToolName;
  arguments: Record<string, unknown>;
  scopes: AgentScope[];
  timeoutMs: number;
  operationId: string;
  requestId: string;
  vaultId: string;
  installationId: string;
}

class DevAgentVerificationSession {
  private disposed = false;
  private readonly runtime: AgentRuntimeService;
  private readonly detachRuntimeSink: () => void;
  private readonly pending = new Map<
    string,
    (frame: AgentTerminalFrame) => void
  >();
  private readonly activeOperationIds = new Set<string>();
  private readonly defaultVaultId = generateUUID();
  private readonly defaultInstallationId = generateUUID();

  constructor(private readonly host: DevAgentVerificationHost) {
    this.runtime = new AgentRuntimeService(
      this.host.serviceManager.getAgentToolRegistry()
    );
    this.detachRuntimeSink = this.runtime.attachSink((message) => {
      if (message.type !== 'tool.result' && message.type !== 'tool.error')
        return;
      this.pending.get(message.operation_id)?.(message);
    });
  }

  async invokeAgentTool(
    input: unknown
  ): Promise<DevAgentVerificationInvokeResult> {
    try {
      return { ok: true, frame: await this.invokeCanonical(input) };
    } catch (error: unknown) {
      return { ok: false, error: toBridgeError(error) };
    }
  }

  private async invokeCanonical(input: unknown): Promise<AgentTerminalFrame> {
    if (this.disposed) {
      throw new Error('Agent verification bridge is not installed.');
    }

    const request = parseInvokeAgentToolInput(input, {
      vaultId: this.defaultVaultId,
      installationId: this.defaultInstallationId,
    });
    if (this.activeOperationIds.has(request.operationId)) {
      return buildConflictFrame(request.operationId);
    }
    this.activeOperationIds.add(request.operationId);
    let resolveTerminal: (frame: AgentTerminalFrame) => void = () => undefined;
    const terminal = new Promise<AgentTerminalFrame>((resolve) => {
      resolveTerminal = resolve;
    });
    this.pending.set(request.operationId, resolveTerminal);

    try {
      await this.runtime.handleFrame(buildInvokeFrame(request));
      return await terminal;
    } finally {
      this.pending.delete(request.operationId);
      this.activeOperationIds.delete(request.operationId);
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    void this.runtime.shutdown().finally(() => this.detachRuntimeSink());
  }
}

export function installDevAgentVerificationBridge(
  plugin: DevAgentVerificationHost
): () => void {
  const session = new DevAgentVerificationSession(plugin);
  Object.defineProperty(plugin, PROPERTY_NAME, {
    configurable: true,
    enumerable: false,
    writable: false,
    value: Object.freeze({
      invokeAgentTool: (input: unknown) => session.invokeAgentTool(input),
    }),
  });

  let installed = true;
  return () => {
    if (!installed) {
      return;
    }
    installed = false;
    Reflect.deleteProperty(plugin, PROPERTY_NAME);
    session.dispose();
  };
}

function parseInvokeAgentToolInput(
  value: unknown,
  identityDefaults: Pick<
    ValidatedInvokeAgentToolInput,
    'vaultId' | 'installationId'
  >
): ValidatedInvokeAgentToolInput {
  if (!isRecord(value)) {
    return invalidInvocation();
  }

  const toolValue = value.tool;
  if (!isAgentToolName(toolValue)) {
    return invalidInvocation();
  }

  const argumentsValue = value.arguments;
  if (!isRecord(argumentsValue)) {
    return invalidInvocation();
  }

  return {
    tool: toolValue,
    arguments: argumentsValue,
    scopes: parseScopes(value.scopes),
    timeoutMs: parseTimeoutMs(value.timeoutMs),
    operationId: parseOptionalUuid(value.operationId),
    requestId: parseOptionalUuid(value.requestId),
    vaultId: parseOptionalUuid(value.vaultId, identityDefaults.vaultId),
    installationId: parseOptionalUuid(
      value.installationId,
      identityDefaults.installationId
    ),
  };
}

function parseScopes(value: unknown): AgentScope[] {
  if (!isUnknownArray(value)) {
    return invalidInvocation();
  }

  const scopes: AgentScope[] = [];
  for (const item of value) {
    if (!isAgentScope(item) || scopes.includes(item)) {
      return invalidInvocation();
    }
    scopes.push(item);
  }
  if (scopes.length === 0) {
    return invalidInvocation();
  }
  return scopes;
}

function parseTimeoutMs(value: unknown): number {
  if (value === undefined) {
    return DEFAULT_TIMEOUT_MS;
  }
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < MIN_TIMEOUT_MS ||
    value > MAX_TIMEOUT_MS
  ) {
    return invalidInvocation();
  }
  return value;
}

function parseOptionalUuid(value: unknown, fallback?: string): string {
  if (value === undefined) {
    return fallback ?? generateUUID();
  }
  if (!isCanonicalNonNilUuid(value)) {
    return invalidInvocation();
  }
  return value;
}

function buildInvokeFrame(input: ValidatedInvokeAgentToolInput): unknown {
  return {
    type: 'tool.invoke',
    protocol_version: agentContractManifest.protocol_major,
    contract_digest: agentContractManifest.digest,
    operation_id: input.operationId,
    request_id: input.requestId,
    deadline: new Date(Date.now() + input.timeoutMs).toISOString(),
    vault_id: input.vaultId,
    installation_id: input.installationId,
    scopes: input.scopes,
    tool: input.tool,
    arguments: input.arguments,
  };
}

function buildConflictFrame(operationId: string): AgentTerminalFrame {
  return {
    type: 'tool.error',
    protocol_version: agentContractManifest.protocol_major,
    contract_digest: agentContractManifest.digest,
    operation_id: operationId,
    error: {
      status: 'error',
      code: 'conflict',
      message: 'Operation is already active.',
      retryable: false,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isAgentToolName(value: unknown): value is AgentToolName {
  if (typeof value !== 'string') {
    return false;
  }
  for (const tool of agentContractManifest.tools) {
    if (tool === value) {
      return true;
    }
  }
  return false;
}

function isAgentScope(value: unknown): value is AgentScope {
  if (typeof value !== 'string') {
    return false;
  }
  for (const scope of AGENT_SCOPES) {
    if (scope === value) {
      return true;
    }
  }
  return false;
}

function invalidInvocation(): never {
  throw new Error('Invalid agent tool invocation.');
}

function toBridgeError(error: unknown): string {
  if (error instanceof Error && error.message !== '') {
    return error.message;
  }
  return 'Agent tool invocation failed.';
}
