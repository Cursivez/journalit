interface ExtractedMarkdownSection {
  heading: string;
  level: number;
  content: string;
}

const FRONTMATTER_PATTERN = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;
const HEADING_PATTERN = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const FENCE_PATTERN = /^\s*(```|~~~)/;

function normalizeHeadingText(text: string): string {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}

function stripMarkdownFrontmatter(content: string): string {
  return content.replace(FRONTMATTER_PATTERN, '');
}

function trimBlankBoundaryLines(content: string): string {
  return content
    .replace(/^(?:[\t ]*\r?\n)+/, '')
    .replace(/(?:\r?\n[\t ]*)+$/, '');
}

export function extractMarkdownSectionsByHeading(
  content: string,
  headings: string[]
): ExtractedMarkdownSection[] {
  const wantedHeadings = new Set(
    headings.flatMap((heading) => {
      const normalized = normalizeHeadingText(heading);
      return normalized ? [normalized] : [];
    })
  );

  if (wantedHeadings.size === 0) {
    return [];
  }

  const lines = stripMarkdownFrontmatter(content).split('\n');
  const sections: ExtractedMarkdownSection[] = [];

  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (FENCE_PATTERN.test(lines[i])) {
      inFence = !inFence;
      continue;
    }

    if (inFence) continue;

    const match = lines[i].match(HEADING_PATTERN);
    if (!match) continue;

    const level = match[1].length;
    const heading = match[2].trim();
    if (!wantedHeadings.has(normalizeHeadingText(heading))) continue;

    const sectionLines: string[] = [];
    let sectionInFence = false;
    for (let j = i + 1; j < lines.length; j++) {
      if (FENCE_PATTERN.test(lines[j])) {
        sectionInFence = !sectionInFence;
        sectionLines.push(lines[j]);
        continue;
      }

      const nextHeading = sectionInFence
        ? null
        : lines[j].match(HEADING_PATTERN);
      if (nextHeading && nextHeading[1].length <= level) {
        break;
      }
      sectionLines.push(lines[j]);
    }

    sections.push({
      heading,
      level,
      content: trimBlankBoundaryLines(sectionLines.join('\n')),
    });
  }

  return sections;
}
