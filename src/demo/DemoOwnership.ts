import { parseYaml } from 'obsidian';
import type { ReviewCreationBatch } from '../services/review/ReviewCreationBatch';
import type { DemoOwnedEntityKind } from './DemoManifest';

export const SAMPLE_INSTANCE_FRONTMATTER_KEY = 'journalitSampleInstance';
export const SAMPLE_ENTITY_ID_FRONTMATTER_KEY = 'journalitSampleEntityId';

export interface SampleOwnershipMarker {
  instanceId: string;
  entityId: string;
}

export interface SampleReviewAuthoring extends SampleOwnershipMarker {
  frontmatter: Record<string, unknown>;
  appendBody: string;
}

export interface SampleReviewMaterialization extends SampleReviewAuthoring {
  creationBatch: ReviewCreationBatch;
}

export function addSampleOwnershipToMarkdown(
  content: string,
  ownership: SampleOwnershipMarker
): string {
  const opening = content.match(/^---(\r?\n)/);
  if (!opening) {
    throw new Error(
      'Cannot add sample ownership to Markdown without frontmatter'
    );
  }
  const lineEnding = opening[1];
  return [
    '---',
    `${SAMPLE_INSTANCE_FRONTMATTER_KEY}: ${JSON.stringify(ownership.instanceId)}`,
    `${SAMPLE_ENTITY_ID_FRONTMATTER_KEY}: ${JSON.stringify(ownership.entityId)}`,
    content.slice(opening[0].length),
  ].join(lineEnding);
}

export function materializeSampleReviewFrontmatter(
  initial: Record<string, unknown>,
  materialization: SampleReviewAuthoring
): Record<string, unknown> {
  const frontmatter: Record<string, unknown> = {
    ...initial,
    ...materialization.frontmatter,
    [SAMPLE_INSTANCE_FRONTMATTER_KEY]: materialization.instanceId,
    [SAMPLE_ENTITY_ID_FRONTMATTER_KEY]: materialization.entityId,
  };
  for (const key of [
    'reviewQuestions',
    'reviewCustomFields',
    'endOfDayReview',
  ]) {
    const initialValue = initial[key];
    const authored = materialization.frontmatter[key];
    if (isRecord(initialValue) && isRecord(authored)) {
      frontmatter[key] = { ...initialValue, ...authored };
    }
  }
  return frontmatter;
}

export function appendSampleReviewBody(content: string, body: string): string {
  return [content.trimEnd(), '', body.trim(), ''].join('\n');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function getSampleInstanceId(
  frontmatter: Record<string, unknown> | null | undefined
): string | null {
  const value = frontmatter?.[SAMPLE_INSTANCE_FRONTMATTER_KEY];
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null;
}

export function getSampleEntityId(
  frontmatter: Record<string, unknown> | null | undefined
): string | null {
  const value = frontmatter?.[SAMPLE_ENTITY_ID_FRONTMATTER_KEY];
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null;
}

export function isSampleOwnedFrontmatter(
  frontmatter: Record<string, unknown> | null | undefined
): boolean {
  return getSampleInstanceId(frontmatter) !== null;
}

export function getDemoOwnedEntityKind(
  frontmatter: Record<string, unknown>,
  path: string
): DemoOwnedEntityKind {
  if (frontmatter.isMissedTrade === true || /-M\d+\.md$/i.test(path)) {
    return 'missed-trade';
  }
  if (frontmatter.isBacktestTrade === true || /-B\d+\.md$/i.test(path)) {
    return 'backtest-trade';
  }
  if (frontmatter.type === 'trade' || /-T\d+\.md$/i.test(path)) {
    return 'trade';
  }
  if (frontmatter.type === 'setup') return 'setup';
  if (frontmatter.type === 'journalit-sample-support') return 'support-note';
  return 'review';
}

export function hasSampleMarkerInMarkdown(content: string): boolean {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontmatter) return false;
  try {
    const parsed: unknown = parseYaml(frontmatter);
    return isRecord(parsed) && isSampleOwnedFrontmatter(parsed);
  } catch {
    return false;
  }
}
