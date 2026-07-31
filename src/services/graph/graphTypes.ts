import type { TFile } from 'obsidian';

export const JOURNALIT_DRC_PROPERTY = 'journalitDrc';
export const JOURNALIT_SETUPS_PROPERTY = 'journalitSetups';
export const JOURNALIT_PARENT_REVIEW_PROPERTY = 'journalitParentReview';

export type ReviewType =
  | 'drc'
  | 'weekly-review'
  | 'monthly-review'
  | 'quarterly-review'
  | 'yearly-review';

export interface GraphTarget {
  file: TFile;
  displayText: string;
}

export interface GraphIndex {
  frontmatterByPath: Map<string, Record<string, unknown>>;
  readErrors: Array<{ filePath: string; message: string }>;
  reviewTargetSignaturesByPath: Map<string, string>;
  setupTargetPaths: Set<string>;
  drcsByDate: Map<string, GraphTarget[]>;
  weekliesByPeriod: Map<string, GraphTarget[]>;
  monthliesByPeriod: Map<string, GraphTarget[]>;
  quarterliesByPeriod: Map<string, GraphTarget[]>;
  yearliesByPeriod: Map<string, GraphTarget[]>;
  setupsByKey: Map<string, GraphTarget[]>;
}

export interface GraphProjection {
  journalitDrc?: string;
  journalitSetups?: string[];
  journalitParentReview?: string;
  warnings: string[];
}

export interface ResolvedTarget {
  target?: GraphTarget;
  ambiguous: boolean;
}

export interface GraphLinkRebuildResult {
  scanned: number;
  updated: number;
  unchanged: number;
  skipped: number;
  conflicted: number;
  failed: number;
  cancelled: boolean;
  filePaths: string[];
  errors: Array<{ filePath: string; message: string }>;
  conflicts: Array<{ filePath: string; message: string }>;
}

export const MANAGED_PROPERTIES = [
  JOURNALIT_DRC_PROPERTY,
  JOURNALIT_SETUPS_PROPERTY,
  JOURNALIT_PARENT_REVIEW_PROPERTY,
] as const;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}


export function normalizeFrontmatter(
  frontmatter: Record<string, unknown>
): Record<string, unknown> {
  const yamlFrontmatter = { ...frontmatter };
  delete yamlFrontmatter.position;
  return yamlFrontmatter;
}

export function frontmatterSignature(
  frontmatter: Record<string, unknown>
): string {
  return JSON.stringify(normalizeFrontmatter(frontmatter));
}

export function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      typeof item === 'string' && item.trim() ? [item.trim()] : []
    );
  }
  return typeof value === 'string' && value.trim() ? [value.trim()] : [];
}

export function dateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function periodKey(...parts: Array<string | number>): string {
  return parts.map(String).join(':');
}

export function addTarget(
  map: Map<string, GraphTarget[]>,
  key: string,
  target: GraphTarget
): void {
  const targets = map.get(key) ?? [];
  if (!targets.some((candidate) => candidate.file.path === target.file.path)) {
    targets.push(target);
    map.set(key, targets);
  }
}

export function formatGraphWikilink(
  target: GraphTarget,
  linkPath: string
): string {
  const displayText =
    target.displayText
      .replace(/[|[\]]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || target.file.basename;
  return `[[${linkPath}|${displayText}]]`;
}

export function getReviewType(
  frontmatter: Record<string, unknown>
): ReviewType | undefined {
  switch (frontmatter.type) {
    case 'drc':
    case 'weekly-review':
    case 'monthly-review':
    case 'quarterly-review':
    case 'yearly-review':
      return frontmatter.type;
    default:
      return undefined;
  }
}

export function valuesEqual(left: unknown, right: unknown): boolean {
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    return (
      left.length === right.length &&
      left.every((value, index) => value === right[index])
    );
  }
  return left === right;
}

export function hasManagedProperties(
  frontmatter: Record<string, unknown>
): boolean {
  return MANAGED_PROPERTIES.some((property) => property in frontmatter);
}

export function isBlockingProjectionWarning(message: string): boolean {
  return message.startsWith('Ambiguous ') || message.startsWith('Unlinkable ');
}

export function createEmptyResult(): GraphLinkRebuildResult {
  return {
    scanned: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    conflicted: 0,
    failed: 0,
    cancelled: false,
    filePaths: [],
    errors: [],
    conflicts: [],
  };
}
