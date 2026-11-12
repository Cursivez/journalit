import { keyLevelGroupMatchKey } from '../../reviews/keyLevelGroups';
import type { MarketBiasEntry } from '../../reviews/marketBias';
import type {
  AgentReviewChecklistItem,
  AgentReviewGoal,
  AgentReviewGrades,
  AgentReviewKeyLevelGroup,
  AgentReviewKeyLevels,
} from './AgentReviewContent';

export type AgentReviewPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface AgentReviewAnswer {
  readonly question_id: string;
  readonly answer: string;
}


export interface AgentReviewRevisionContent {
  readonly summary: string;
  readonly answers: readonly AgentReviewAnswer[];
  readonly goals: readonly AgentReviewGoal[];
  readonly checklist: readonly AgentReviewChecklistItem[];
  readonly keyLevels: AgentReviewKeyLevels;
  readonly keyLevelGroups: readonly AgentReviewKeyLevelGroup[];
  readonly marketBias: readonly MarketBiasEntry[];
  readonly grades: AgentReviewGrades;
  readonly reviewed: boolean;
}

export type AgentReviewHash = (
  value: Uint8Array<ArrayBuffer>
) => Promise<string>;

const HEX_DIGEST_PATTERN = /^[0-9a-f]{64}$/;

export const webCryptoSha256: AgentReviewHash = async (value) => {
  const digest = await crypto.subtle.digest('SHA-256', value);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
};

async function hashText(value: string, hash: AgentReviewHash): Promise<string> {
  const digest = (await hash(new TextEncoder().encode(value))).toLowerCase();
  if (!HEX_DIGEST_PATTERN.test(digest)) {
    throw new Error('Review hash implementation returned an invalid digest.');
  }
  return digest;
}

export async function createAgentReviewQuestionId(
  period: AgentReviewPeriod,
  questionLabel: string,
  hash: AgentReviewHash = webCryptoSha256
): Promise<string> {
  const encodedIdentity = JSON.stringify([period, questionLabel]);
  return `question_${await hashText(encodedIdentity, hash)}`;
}


export function keyLevelsKey(levels: AgentReviewKeyLevels): unknown {
  return [levels.support, levels.resistance].map((side) =>
    side.map((level) => [level.price, level.importance])
  );
}


export function keyLevelGroupsKey(
  groups: readonly AgentReviewKeyLevelGroup[]
): unknown {
  return groups
    .map((group) => ({ key: keyLevelGroupMatchKey(group.name), group }))
    .sort((left, right) =>
      left.key < right.key ? -1 : left.key > right.key ? 1 : 0
    )
    .map(({ group }) => [group.name, keyLevelsKey(group)]);
}

export async function createAgentReviewRevision(
  content: AgentReviewRevisionContent,
  hash: AgentReviewHash = webCryptoSha256
): Promise<string> {
  const answers = [...content.answers].sort((left, right) =>
    left.question_id < right.question_id
      ? -1
      : left.question_id > right.question_id
        ? 1
        : 0
  );
  const canonicalJson = JSON.stringify({
    summary: content.summary,
    answers,
    goals: content.goals.map((goal) => [goal.text, goal.done]),
    checklist: content.checklist.map((item) => [item.text, item.done]),
    keyLevels: keyLevelsKey(content.keyLevels),
    
    ...(content.keyLevelGroups.length > 0
      ? { keyLevelGroups: keyLevelGroupsKey(content.keyLevelGroups) }
      : {}),
    grades: [content.grades.mental, content.grades.technical],
    reviewed: content.reviewed,
    
    
    ...(content.marketBias.length > 0
      ? {
          marketBias: content.marketBias.map((entry) => [
            entry.ticker ?? null,
            entry.bias,
          ]),
        }
      : {}),
  });
  return `sha256:${await hashText(canonicalJson, hash)}`;
}
