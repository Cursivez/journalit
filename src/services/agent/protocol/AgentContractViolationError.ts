import type { AgentToolName } from './generated/manifest.generated';

type AgentContractBoundary = 'request' | 'result' | 'relay';

export interface AgentContractViolation {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  message?: string;
}

interface AgentContractViolationErrorOptions {
  boundary: AgentContractBoundary;
  tool?: AgentToolName;
  violations: AgentContractViolation[];
}

export class AgentContractViolationError extends Error {
  readonly boundary: AgentContractBoundary;
  readonly tool?: AgentToolName;
  readonly violations: AgentContractViolation[];

  constructor({
    boundary,
    tool,
    violations,
  }: AgentContractViolationErrorOptions) {
    const location = tool === undefined ? boundary : `${tool} ${boundary}`;
    super(`Agent contract violation at ${location} boundary`);
    this.name = 'AgentContractViolationError';
    this.boundary = boundary;
    this.tool = tool;
    this.violations = violations;
  }
}
