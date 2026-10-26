import type {
  AgentReviewChecklistItem,
  AgentReviewGoal,
  AgentReviewGrades,
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
    keyLevels: [content.keyLevels.support, content.keyLevels.resistance].map(
      (levels) => levels.map((level) => [level.price, level.importance])
    ),
    grades: [content.grades.mental, content.grades.technical],
    reviewed: content.reviewed,
  });
  return `sha256:${await hashText(canonicalJson, hash)}`;
}
