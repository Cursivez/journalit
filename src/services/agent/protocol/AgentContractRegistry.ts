import {
  agentContractManifest,
  type AgentToolContracts,
  type AgentToolName,
} from './generated/manifest.generated';
import type { AgentRelayMessage } from './generated/relay.generated';
import {
  agentContractSchemaPack,
  agentRelayEnvelopeSchemaRef,
  agentToolSchemaRefs,
} from './generated/validators.generated';
import { decodeCompressedJson } from '../../../utils/compressedData';
import {
  AgentSchemaValidator,
  type AgentSchemaViolation,
} from './AgentSchemaValidator';
import {
  AgentContractViolationError,
  type AgentContractViolation,
} from './AgentContractViolationError';

const MAX_SAFE_VIOLATIONS = 8;

type AgentRelayValidatedEnvelope =
  | (Omit<Extract<AgentRelayMessage, { type: 'tool.invoke' }>, 'arguments'> & {
      arguments: unknown;
    })
  | (Omit<Extract<AgentRelayMessage, { type: 'tool.result' }>, 'result'> & {
      result: unknown;
    })
  | Exclude<AgentRelayMessage, { type: 'tool.invoke' | 'tool.result' }>;

export type AgentRelayMessageClassification =
  | { kind: 'message'; message: AgentRelayMessage }
  | { kind: 'invalid_envelope'; violations: AgentContractViolation[] }
  | {
      kind: 'invalid_tool_payload';
      messageType: 'tool.invoke' | 'tool.result';
      tool: AgentToolName;
      operationId: string;
      contractDigest: string;
      violations: AgentContractViolation[];
    };

let schemaValidator: AgentSchemaValidator | undefined;


function validateContract(
  ref: string,
  value: unknown
): readonly AgentSchemaViolation[] | null {
  schemaValidator ??= new AgentSchemaValidator(
    
    decodeCompressedJson(agentContractSchemaPack)
  );
  return schemaValidator.validate(ref, value);
}

function safeViolations(
  errors: readonly AgentSchemaViolation[],
  instancePathPrefix = ''
): AgentContractViolation[] {
  const violations: AgentContractViolation[] = [];
  const seen = new Set<string>();
  for (const { instancePath: path, schemaPath, keyword, message } of errors) {
    const instancePath = `${instancePathPrefix}${path}`;
    const identity = JSON.stringify([instancePath, keyword, message]);
    if (seen.has(identity)) continue;
    seen.add(identity);
    violations.push({ instancePath, schemaPath, keyword, message });
    if (violations.length === MAX_SAFE_VIOLATIONS) break;
  }
  return violations;
}

export function parseAgentToolRequest<Tool extends AgentToolName>(
  tool: Tool,
  value: unknown
): AgentToolContracts[Tool]['request'] {
  const errors = validateContract(agentToolSchemaRefs[tool].request, value);
  if (errors !== null) {
    throw new AgentContractViolationError({
      boundary: 'request',
      tool,
      violations: safeViolations(errors),
    });
  }
  
  return value as AgentToolContracts[Tool]['request'];
}

export function parseAgentToolResult<Tool extends AgentToolName>(
  tool: Tool,
  value: unknown
): AgentToolContracts[Tool]['result'] {
  const errors = validateContract(agentToolSchemaRefs[tool].result, value);
  if (errors !== null) {
    throw new AgentContractViolationError({
      boundary: 'result',
      tool,
      violations: safeViolations(errors),
    });
  }
  
  return value as AgentToolContracts[Tool]['result'];
}

export function classifyAgentRelayMessage(
  value: unknown
): AgentRelayMessageClassification {
  const envelopeErrors = validateContract(agentRelayEnvelopeSchemaRef, value);
  if (envelopeErrors !== null) {
    return {
      kind: 'invalid_envelope',
      violations: safeViolations(envelopeErrors),
    };
  }

  
  
  const envelope = value as AgentRelayValidatedEnvelope;
  if (envelope.type === 'tool.invoke' || envelope.type === 'tool.result') {
    const isInvoke = envelope.type === 'tool.invoke';
    const refs = agentToolSchemaRefs[envelope.tool];
    const errors = isInvoke
      ? validateContract(refs.request, envelope.arguments)
      : validateContract(refs.result, envelope.result);
    if (errors !== null) {
      return {
        kind: 'invalid_tool_payload',
        messageType: envelope.type,
        tool: envelope.tool,
        operationId: envelope.operation_id,
        contractDigest: envelope.contract_digest,
        violations: safeViolations(errors, isInvoke ? '/arguments' : '/result'),
      };
    }
  }
  
  return { kind: 'message', message: value as AgentRelayMessage };
}

export function parseAgentRelayMessage(value: unknown): AgentRelayMessage {
  const classification = classifyAgentRelayMessage(value);
  if (classification.kind === 'message') return classification.message;
  if (classification.kind === 'invalid_envelope') {
    throw new AgentContractViolationError({
      boundary: 'relay',
      violations: classification.violations,
    });
  }
  throw new AgentContractViolationError({
    boundary: 'relay',
    tool: classification.tool,
    violations: classification.violations,
  });
}

export { agentContractManifest };
export type { AgentRelayMessage, AgentToolContracts, AgentToolName };
