import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'styles.css');

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, files);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(path);
  }
  return files;
}

function readTemplateLiteral(source, start) {
  let i = start + 1;
  let out = '';
  while (i < source.length) {
    const ch = source[i];
    if (ch === '\\') {
      out += ch + (source[i + 1] ?? '');
      i += 2;
      continue;
    }
    if (ch === '`') return { value: out, end: i + 1 };
    out += ch;
    i++;
  }
  return null;
}

const FLATPICKR_CALENDAR_CLASS = 'journalit-flatpickr-calendar';
const FLATPICKR_INPUT_CLASS = 'journalit-flatpickr-temp-input';

function scopeFlatpickrSelector(selector) {
  const sel = selector.trim();
  if (!sel) return '';
  if (sel.startsWith('@')) return sel;
  if (sel.includes('.journalit-')) return sel;
  if (sel.includes('.flatpickr-input')) {
    return sel.includes(`.${FLATPICKR_INPUT_CLASS}`)
      ? sel
      : sel.replace(
          /\.flatpickr-input\b/g,
          `.flatpickr-input.${FLATPICKR_INPUT_CLASS}`
        );
  }
  if (sel.includes('.flatpickr-calendar')) {
    return sel.includes(`.${FLATPICKR_CALENDAR_CLASS}`)
      ? sel
      : sel.replace(
          /\.flatpickr-calendar\b/g,
          `.flatpickr-calendar.${FLATPICKR_CALENDAR_CLASS}`
        );
  }
  return `.flatpickr-calendar.${FLATPICKR_CALENDAR_CLASS} ${sel}`;
}

function scopeFlatpickrSelectors(selectors) {
  return selectors
    .split(',')
    .map(scopeFlatpickrSelector)
    .filter(Boolean)
    .join(', ');
}

function scopeFlatpickrCss(css) {
  let out = '';
  let i = 0;
  while (i < css.length) {
    if (css[i] === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      if (end === -1) {
        out += css.slice(i);
        break;
      }
      out += css.slice(i, end + 2);
      i = end + 2;
      continue;
    }
    if (css[i] === '@') {
      const brace = css.indexOf('{', i);
      if (brace === -1) {
        out += css.slice(i);
        break;
      }
      out += css.slice(i, brace + 1);
      i = brace + 1;
      let depth = 1;
      while (i < css.length && depth > 0) {
        const ch = css[i];
        out += ch;
        if (ch === '{') depth += 1;
        else if (ch === '}') depth -= 1;
        i += 1;
      }
      continue;
    }
    if (/\s/.test(css[i])) {
      out += css[i];
      i += 1;
      continue;
    }
    const brace = css.indexOf('{', i);
    if (brace === -1) {
      out += css.slice(i);
      break;
    }
    out += scopeFlatpickrSelectors(css.slice(i, brace)) + '{';
    i = brace + 1;
    let depth = 1;
    while (i < css.length && depth > 0) {
      const ch = css[i];
      out += ch;
      if (ch === '{') depth += 1;
      else if (ch === '}') depth -= 1;
      i += 1;
    }
  }
  return out;
}

const styleConstants = new Map();
const styleEntries = [];
for (const file of walk(SRC).sort()) {
  const source = readFileSync(file, 'utf8');
  const regex =
    /(?:export\s+)?const\s+([A-Za-z0-9_]*(?:STYLES|Styles|styles|CSS|Css))\s*=\s*`/g;
  let match;
  while ((match = regex.exec(source))) {
    const literal = readTemplateLiteral(source, regex.lastIndex - 1);
    if (!literal) continue;
    let css = literal.value.trim();
    if (
      relative(ROOT, file) === 'src/styles/flatpickrStyles.ts' &&
      (match[1] === 'FLATPICKR_BASE_CSS' || match[1] === 'FLATPICKR_STYLES')
    ) {
      css = scopeFlatpickrCss(css);
    }
    if (css) {
      styleConstants.set(match[1], css);
      styleEntries.push({ file: relative(ROOT, file), name: match[1], css });
    }
    regex.lastIndex = literal.end;
  }
}

function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').trim();
}
function resolveInterpolations(css, seen = new Set()) {
  return css.replace(/\$\{([A-Z0-9_]+)\}/g, (match, name) => {
    if (seen.has(name)) return '';
    const value = styleConstants.get(name);
    if (value === undefined) {
      throw new Error(`Unresolved style constant interpolation: ${match}`);
    }
    return resolveInterpolations(value, new Set([...seen, name]));
  });
}

function removeRulesContaining(css, pattern) {
  let output = css;
  let match;
  while ((match = pattern.exec(output))) {
    const braceIndex = output.indexOf('{', match.index);
    if (braceIndex === -1) break;

    let start = match.index;
    const previousRuleEnd = output.lastIndexOf('}', start);
    const previousAtRuleStart = output.lastIndexOf('@', start);
    if (previousAtRuleStart > previousRuleEnd) {
      start = previousAtRuleStart;
    }

    let depth = 0;
    let end = braceIndex;
    for (; end < output.length; end += 1) {
      if (output[end] === '{') depth += 1;
      else if (output[end] === '}') {
        depth -= 1;
        if (depth === 0) {
          end += 1;
          break;
        }
      }
    }

    output = `${output.slice(0, start)}${output.slice(end)}`;
    pattern.lastIndex = 0;
  }
  return output;
}

function sanitizeForObsidianReview(css) {
  const sanitized = removeRulesContaining(css, /[^{}]*:has\([^{}]*\)[^{]*/g)
    .replace(/\s*!important\b/g, '')
    .replace(/^\s*clip-path\s*:[^;]+;\n?/gm, '')
    .replace(/^\s*text-decoration(?:-[\w-]+)?\s*:[^;]+;\n?/gm, '')
    .replace(/^\s*text-indent\s*:[^;]+;\n?/gm, '')
    .replace(
      /^\s*(?:columns|column-count|column-width|column-gap)\s*:[^;]+;\n?/gm,
      ''
    )
    .replace(/^\s*all\s*:[^;]+;\n?/gm, '')
    .replace(/;\s*clip-path\s*:[^;]+/g, '')
    .replace(/;\s*text-decoration(?:-[\w-]+)?\s*:[^;]+/g, '')
    .replace(/;\s*text-indent\s*:[^;]+/g, '')
    .replace(
      /;\s*(?:columns|column-count|column-width|column-gap)\s*:[^;]+/g,
      ''
    )
    .replace(/;\s*all\s*:[^;]+/g, '')
    .replace(/transition\s*:\s*all\b/g, 'transition: color')
    .replace(/,?\s*text-decoration-color\s+[^,;}]+/g, '')
    .replace(/;width:7ch\\0/g, '')
    .replace(/;width:7ch\0/g, '')
    .replace(/;width:7ch\\\\0/g, '')
    .replace(/width:\s*7ch\\0;?/g, '')
    .replace(/width:\s*7ch\0;?/g, '')
    .replace(/width:\s*7ch\\\\0;?/g, '');
  return sanitized.replace(/\{([^{}]*)\}/g, (_match, body) => {
    const declarations = String(body)
      .split(';')
      .map((declaration) => declaration.trim())
      .filter(Boolean);
    if (!declarations.some((declaration) => declaration.includes(':'))) {
      return `{${body}}`;
    }

    const order = [];
    const byProperty = new Map();
    for (const declaration of declarations) {
      const separator = declaration.indexOf(':');
      if (separator <= 0) continue;
      const property = declaration.slice(0, separator).trim().toLowerCase();
      if (!byProperty.has(property)) order.push(property);
      byProperty.set(property, declaration);
    }

    return `{${order.map((property) => byProperty.get(property)).join(';')}}`;
  });
}

const chunks = styleEntries.map(({ file, name, css }) =>
  stripCssComments(resolveInterpolations(css))
);
const nextCss = `${sanitizeForObsidianReview(chunks.filter(Boolean).join('\n\n'))}\n`;

if (existsSync(OUT) && readFileSync(OUT, 'utf8') === nextCss) {
  console.log(`${relative(ROOT, OUT)} unchanged from ${chunks.length} style constants.`);
} else {
  writeFileSync(OUT, nextCss);
  console.log(`Wrote ${relative(ROOT, OUT)} from ${chunks.length} style constants.`);
}
