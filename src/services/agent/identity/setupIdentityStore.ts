import { generateUUID } from '../../../utils/uuid';

export const SETUP_AGENT_ID_FRONTMATTER_KEY = 'journalit-setup-id';

const SETUP_AGENT_ID_PATTERN =
  /^setup_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const SETUP_AGENT_ID_KEY_PATTERN =
  /^(?:journalit-setup-id|'journalit-setup-id'|"journalit-setup-id")\s*:/;
const FRONTMATTER_PATTERN = /^---(\r?\n)([\s\S]*?)(\r?\n)---/;

interface SetupAgentIdFrontmatter {
  yamlWithoutAgentId: string;
  agentEntityId?: string;
}

export function isSetupAgentId(value: unknown): value is string {
  return typeof value === 'string' && SETUP_AGENT_ID_PATTERN.test(value);
}

export function generateSetupAgentId(): string {
  return `setup_${generateUUID()}`;
}

export function compareSetupIdentityOrder(
  left: { createdAt: string; filePath?: string },
  right: { createdAt: string; filePath?: string }
): number {
  return (
    left.createdAt.localeCompare(right.createdAt) ||
    (left.filePath ?? '').localeCompare(right.filePath ?? '')
  );
}

export function separateSetupAgentIdFrontmatter(
  frontmatter: string
): SetupAgentIdFrontmatter {
  const lines = frontmatter.split(/\r?\n/);
  const idLines = lines.filter((line) => SETUP_AGENT_ID_KEY_PATTERN.test(line));
  const yamlWithoutAgentId = lines
    .filter((line) => !SETUP_AGENT_ID_KEY_PATTERN.test(line))
    .join('\n');
  if (idLines.length !== 1) {
    return { yamlWithoutAgentId };
  }

  const value = idLines[0].slice(idLines[0].indexOf(':') + 1).trim();
  const unquotedValue =
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
      ? value.slice(1, -1)
      : value;
  return {
    yamlWithoutAgentId,
    agentEntityId: isSetupAgentId(unquotedValue) ? unquotedValue : undefined,
  };
}

export function upsertSetupAgentId(
  content: string,
  agentEntityId: string
): string {
  if (!isSetupAgentId(agentEntityId)) {
    throw new Error('Invalid setup agent ID');
  }

  const match = content.match(FRONTMATTER_PATTERN);
  if (!match) {
    return [
      '---',
      `${SETUP_AGENT_ID_FRONTMATTER_KEY}: ${agentEntityId}`,
      '---',
      content,
    ].join('\n');
  }

  const lineEnding = match[1];
  const lines = match[2].split(/\r?\n/);
  const keyIndexes = lines.flatMap((line, index) =>
    SETUP_AGENT_ID_KEY_PATTERN.test(line) ? [index] : []
  );
  const replacement = `${SETUP_AGENT_ID_FRONTMATTER_KEY}: ${agentEntityId}`;
  if (keyIndexes.length === 0) {
    lines.push(replacement);
  } else {
    lines[keyIndexes[0]] = replacement;
    for (const index of keyIndexes.slice(1).reverse()) {
      lines.splice(index, 1);
    }
  }

  const frontmatter = `---${lineEnding}${lines.join(lineEnding)}${match[3]}---`;
  return `${frontmatter}${content.slice(match[0].length)}`;
}
