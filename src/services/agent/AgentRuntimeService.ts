import {
  AgentContractViolationError,
  agentContractManifest,
  classifyAgentRelayMessage,
  parseAgentRelayMessage,
  parseAgentToolResult,
  type AgentContractViolation,
  type AgentRelayMessage,
} from './protocol';
import { hasAgentToolPermission } from './AgentPermissions';
import {
  AgentToolRegistry,
  type AgentToolHandlerResult,
} from './AgentToolRegistry';

type AgentInvoke = Extract<AgentRelayMessage, { type: 'tool.invoke' }>;
type AgentCancel = Extract<AgentRelayMessage, { type: 'tool.cancel' }>;
type AgentErrorCode = Extract<
  AgentRelayMessage,
  { type: 'tool.error' }
>['error']['code'];
type AgentErrorDetails = NonNullable<
  Extract<AgentRelayMessage, { type: 'tool.error' }>['error']['details']
>;
type AgentSink = (message: AgentRelayMessage) => void | Promise<void>;
type TimerHandle = number;
type HandlerResult = AgentToolHandlerResult<
  Extract<AgentInvoke, { tool: AgentInvoke['tool'] }>['tool']
>;

interface AgentRuntimeOptions {
  now?: () => number;
  setTimer?: (callback: () => void, delayMs: number) => TimerHandle;
  clearTimer?: (handle: TimerHandle) => void;
}

type OperationCompletion =
  | { kind: 'handler_result'; value: HandlerResult }
  | { kind: 'handler_error' }
  | { kind: 'timeout' }
  | { kind: 'cancelled' };

interface ActiveOperation {
  controller: AbortController;
  completion: Promise<OperationCompletion>;
  settle: (completion: OperationCompletion) => boolean;
  done: Promise<void>;
  markDone: () => void;
}

const ERROR_MESSAGES: Record<AgentErrorCode, string> = {
  invalid_request: 'Tool request failed validation.',
  permission_denied: 'Required permission is missing.',
  not_found: 'Requested resource was not found.',
  conflict: 'Operation is already active.',
  cursor_expired: 'Result cursor has expired.',
  preview_expired: 'Preview has expired.',
  offline: 'Agent runtime is offline.',
  timeout: 'Operation deadline exceeded.',
  cancelled: 'Operation was cancelled.',
  limit_exceeded: 'Result exceeds the requested size limit.',
  unsupported_capability: 'Tool capability is not available.',
  plugin_update_required: 'Plugin contract update is required.',
  integration_unavailable: 'Integration is unavailable.',
  internal_error: 'Tool execution failed.',
};

export class AgentRuntimeService {
  private readonly activeOperations = new Map<string, ActiveOperation>();
  private readonly now: () => number;
  private readonly setTimer: (
    callback: () => void,
    delayMs: number
  ) => TimerHandle;
  private readonly clearTimer: (handle: TimerHandle) => void;
  private sink: AgentSink | undefined;
  private shuttingDown = false;

  constructor(
    private readonly registry: AgentToolRegistry,
    options: AgentRuntimeOptions = {}
  ) {
    this.now = options.now ?? Date.now;
    this.setTimer =
      options.setTimer ??
      ((callback, delayMs) => window.setTimeout(callback, delayMs));
    this.clearTimer =
      options.clearTimer ?? ((handle) => window.clearTimeout(handle));
  }

  attachSink(sink: AgentSink): () => void {
    if (this.sink !== undefined) {
      throw new Error('An agent runtime sink is already attached.');
    }
    this.sink = sink;
    return () => {
      if (this.sink === sink) this.sink = undefined;
    };
  }

  detachSink(): void {
    this.sink = undefined;
  }

  async handleFrame(value: unknown): Promise<void> {
    this.requireSink();
    const classification = classifyAgentRelayMessage(value);
    switch (classification.kind) {
      case 'invalid_envelope':
        throw new AgentContractViolationError({
          boundary: 'relay',
          violations: classification.violations,
        });
      case 'invalid_tool_payload':
        if (classification.messageType === 'tool.result') {
          throw new AgentContractViolationError({
            boundary: 'relay',
            tool: classification.tool,
            violations: classification.violations,
          });
        }
        if (classification.contractDigest !== agentContractManifest.digest) {
          await this.sendError(
            classification.operationId,
            'plugin_update_required',
            false
          );
          return;
        }
        await this.sendError(
          classification.operationId,
          'invalid_request',
          false,
          this.safeViolationDetails(classification.violations)
        );
        return;
      case 'message':
        if (classification.message.type === 'tool.cancel') {
          if (
            classification.message.contract_digest !==
            agentContractManifest.digest
          ) {
            await this.sendError(
              classification.message.operation_id,
              'plugin_update_required',
              false
            );
            return;
          }
          this.cancel(classification.message);
        } else if (classification.message.type === 'tool.invoke') {
          await this.invoke(classification.message);
        }
        return;
      default: {
        const exhaustiveClassification: never = classification;
        return exhaustiveClassification;
      }
    }
  }

  async shutdown(): Promise<void> {
    if (!this.shuttingDown) {
      this.shuttingDown = true;
      for (const operation of this.activeOperations.values()) {
        if (operation.settle({ kind: 'cancelled' })) {
          operation.controller.abort();
        }
      }
    }
    await Promise.all(
      [...this.activeOperations.values()].map((operation) => operation.done)
    );
  }

  private async invoke(invocation: AgentInvoke): Promise<void> {
    if (invocation.contract_digest !== agentContractManifest.digest) {
      await this.sendError(
        invocation.operation_id,
        'plugin_update_required',
        false
      );
      return;
    }
    if (this.activeOperations.has(invocation.operation_id)) {
      await this.sendError(invocation.operation_id, 'conflict', false);
      return;
    }
    const deadlineMs = Date.parse(invocation.deadline);
    if (deadlineMs <= this.now()) {
      await this.sendError(invocation.operation_id, 'timeout', true);
      return;
    }
    if (
      !hasAgentToolPermission(
        invocation.tool,
        invocation.arguments,
        invocation.scopes
      )
    ) {
      await this.sendError(invocation.operation_id, 'permission_denied', false);
      return;
    }
    if (!this.registry.has(invocation.tool)) {
      await this.sendError(
        invocation.operation_id,
        'unsupported_capability',
        false
      );
      return;
    }
    if (this.shuttingDown) {
      await this.sendError(invocation.operation_id, 'offline', true);
      return;
    }

    const operation = this.createActiveOperation();
    this.activeOperations.set(invocation.operation_id, operation);
    const timer = this.setTimer(
      () => {
        if (operation.settle({ kind: 'timeout' })) {
          operation.controller.abort();
        }
      },
      Math.max(0, deadlineMs - this.now())
    );

    void this.registry
      .execute(invocation, {
        operationId: invocation.operation_id,
        requestId: invocation.request_id,
        vaultId: invocation.vault_id,
        installationId: invocation.installation_id,
        scopes: invocation.scopes,
        deadline: invocation.deadline,
        ...(invocation.traceparent === undefined
          ? {}
          : { traceparent: invocation.traceparent }),
        ...(invocation.prior_result_hint === undefined
          ? {}
          : { priorResultHint: invocation.prior_result_hint }),
        ...(invocation.max_result_bytes === undefined
          ? {}
          : { maxResultBytes: invocation.max_result_bytes }),
        signal: operation.controller.signal,
      })
      .then(
        (value) => operation.settle({ kind: 'handler_result', value }),
        () => operation.settle({ kind: 'handler_error' })
      );

    try {
      const completion = await operation.completion;
      this.clearTimer(timer);
      await this.sendCompletion(invocation, completion);
    } finally {
      this.activeOperations.delete(invocation.operation_id);
      operation.markDone();
    }
  }

  private cancel(cancel: AgentCancel): void {
    const operation = this.activeOperations.get(cancel.operation_id);
    if (operation !== undefined && operation.settle({ kind: 'cancelled' })) {
      operation.controller.abort();
    }
  }

  private async sendCompletion(
    invocation: AgentInvoke,
    completion: OperationCompletion
  ): Promise<void> {
    switch (completion.kind) {
      case 'timeout':
        await this.sendError(invocation.operation_id, 'timeout', true);
        return;
      case 'cancelled':
        await this.sendError(invocation.operation_id, 'cancelled', false);
        return;
      case 'handler_error':
        await this.sendError(invocation.operation_id, 'internal_error', false);
        return;
      case 'handler_result':
        await this.sendHandlerResult(invocation, completion.value);
        return;
      default: {
        const exhaustiveCompletion: never = completion;
        return exhaustiveCompletion;
      }
    }
  }

  private async sendHandlerResult(
    invocation: AgentInvoke,
    handlerResult: HandlerResult
  ): Promise<void> {
    let result: ReturnType<typeof parseAgentToolResult>;
    try {
      result = parseAgentToolResult(invocation.tool, handlerResult.result);
    } catch {
      await this.sendError(invocation.operation_id, 'internal_error', false);
      return;
    }

    if (
      result.status === 'ok' &&
      result.meta.contract_digest !== agentContractManifest.digest
    ) {
      await this.sendError(invocation.operation_id, 'internal_error', false);
      return;
    }

    const resultBytes = new TextEncoder().encode(
      JSON.stringify(result)
    ).byteLength;
    if (
      invocation.max_result_bytes !== undefined &&
      resultBytes > invocation.max_result_bytes
    ) {
      await this.sendError(invocation.operation_id, 'limit_exceeded', false, [
        {
          field: '/result',
          reason: 'result_too_large',
        },
      ]);
      return;
    }

    if (result.status === 'error') {
      await this.send({
        type: 'tool.result',
        protocol_version: agentContractManifest.protocol_major,
        contract_digest: agentContractManifest.digest,
        operation_id: invocation.operation_id,
        tool: invocation.tool,
        cached: false,
        result,
      });
      return;
    }
    const frame = {
      type: 'tool.result',
      protocol_version: agentContractManifest.protocol_major,
      contract_digest: agentContractManifest.digest,
      operation_id: invocation.operation_id,
      tool: invocation.tool,
      cached: result.meta.cached,
      ...(handlerResult.resultId === undefined
        ? {}
        : { result_id: handlerResult.resultId }),
      result,
    };
    let message: AgentRelayMessage;
    try {
      message = parseAgentRelayMessage(frame);
    } catch {
      await this.sendError(invocation.operation_id, 'internal_error', false);
      return;
    }
    await this.requireSink()(message);
  }

  private async sendError(
    operationId: string,
    code: AgentErrorCode,
    retryable: boolean,
    details?: AgentErrorDetails
  ): Promise<void> {
    await this.send({
      type: 'tool.error',
      protocol_version: agentContractManifest.protocol_major,
      contract_digest: agentContractManifest.digest,
      operation_id: operationId,
      error: {
        status: 'error',
        code,
        message: ERROR_MESSAGES[code],
        retryable,
        ...(details === undefined ? {} : { details }),
      },
    });
  }

  private async send(value: unknown): Promise<void> {
    const message = parseAgentRelayMessage(value);
    await this.requireSink()(message);
  }

  private requireSink(): AgentSink {
    if (this.sink === undefined) {
      throw new Error('Agent runtime sink is not attached.');
    }
    return this.sink;
  }

  private safeViolationDetails(
    violations: readonly AgentContractViolation[]
  ): AgentErrorDetails {
    
    
    const fields = new Set(
      violations.map((violation) => violation.instancePath)
    );
    return [...fields].map((field) => ({
      field,
      reason: 'request_contract_violation' as const,
    }));
  }

  private createActiveOperation(): ActiveOperation {
    const controller = new AbortController();
    let terminal = false;
    let resolveCompletion: (completion: OperationCompletion) => void = () =>
      undefined;
    const completion = new Promise<OperationCompletion>((resolve) => {
      resolveCompletion = resolve;
    });
    let markDone: () => void = () => undefined;
    const done = new Promise<void>((resolve) => {
      markDone = resolve;
    });
    return {
      controller,
      completion,
      settle: (value) => {
        if (terminal) return false;
        terminal = true;
        resolveCompletion(value);
        return true;
      },
      done,
      markDone,
    };
  }
}
