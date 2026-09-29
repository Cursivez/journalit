import { getTranslationsAcrossLocales } from '../lang/helpers';
import { extractMarkdownSectionsByHeading } from './markdownSectionExtractor';

const DRC_QUESTION_KEYS = [
  'template.question.drc.q1',
  'template.question.drc.q2',
  'template.question.drc.q3',
] as const;

function normalizeHeading(heading: string): string {
  return heading.trim().replace(/\s+/g, ' ').toLowerCase();
}

let questionAliases: Map<string, string[]> | undefined;

function getQuestionAliases(): Map<string, string[]> {
  if (!questionAliases) {
    questionAliases = new Map();
    const translations = getTranslationsAcrossLocales(DRC_QUESTION_KEYS);
    for (const key of DRC_QUESTION_KEYS) {
      const aliases = translations.get(key) ?? [];
      for (const alias of aliases) {
        questionAliases.set(normalizeHeading(alias), aliases);
      }
    }
  }
  return questionAliases;
}


export function extractReviewContextSections(
  content: string,
  headings: string[]
): ReturnType<typeof extractMarkdownSectionsByHeading> {
  const aliasesByHeading = getQuestionAliases();
  const groups = headings.map((heading) => [
    heading,
    ...(aliasesByHeading.get(normalizeHeading(heading)) ?? []),
  ]);
  const sections = extractMarkdownSectionsByHeading(content, groups.flat());
  const sectionsByHeading = new Map(
    sections.map((section) => [normalizeHeading(section.heading), section])
  );

  return groups.flatMap((aliases) => {
    for (const alias of aliases) {
      const section = sectionsByHeading.get(normalizeHeading(alias));
      if (section) return [section];
    }
    return [];
  });
}
