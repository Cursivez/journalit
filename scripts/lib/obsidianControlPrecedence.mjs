

export const CONTROL_BOOST = {
  button: ':is(button)',
  select: ':is(select):not(:disabled):not(.mod-disabled)',
  
  
  input: ':is(input:enabled, input:disabled)',
  textarea: ':is(textarea:enabled, textarea:disabled)',
};

const CONTROL_TAGS = Object.keys(CONTROL_BOOST);

const STRING_LITERAL = /(['"`])((?:(?!\1)[^\\]|\\.)*)\1/g;



export function splitSelectorList(text) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of text) {
    if (char === '(' || char === '[') depth++;
    if (char === ')' || char === ']') depth--;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

export function compareSpecificity(a, b) {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
}

export function specificity(selector) {
  let ids = 0;
  let classes = 0;
  let types = 0;
  let rest = selector.replace(/:where\((?:[^()]|\([^()]*\))*\)/g, '');
  rest = rest.replace(
    /:(?:not|is|has)\(((?:[^()]|\([^()]*\))*)\)/g,
    (_match, inner) => {
      const best = splitSelectorList(inner)
        .map(specificity)
        .sort((a, b) => compareSpecificity(b, a))[0] ?? [0, 0, 0];
      ids += best[0];
      classes += best[1];
      types += best[2];
      return '';
    }
  );
  rest = rest.replace(/\[[^\]]*\]/g, () => (classes++, ''));
  rest = rest.replace(/::[\w-]+/g, () => (types++, ''));
  rest = rest.replace(/#[\w-]+/g, () => (ids++, ''));
  rest = rest.replace(/\.[\w-]+/g, () => (classes++, ''));
  rest = rest.replace(/:[\w-]+/g, () => (classes++, ''));
  types += (rest.match(/(?:^|[\s>+~])[a-zA-Z][\w-]*/g) ?? []).length;
  return [ids, classes, types];
}


function subjectStart(selector) {
  let depth = 0;
  let start = 0;
  for (let i = 0; i < selector.length; i++) {
    const char = selector[i];
    if (char === '(' || char === '[') depth++;
    else if (char === ')' || char === ']') depth--;
    else if (depth === 0 && /[\s>+~]/.test(char)) start = i + 1;
  }
  return start;
}


function pseudoElementStart(subject) {
  let depth = 0;
  for (let i = 0; i < subject.length; i++) {
    const char = subject[i];
    if (char === '(' || char === '[') depth++;
    else if (char === ')' || char === ']') depth--;
    else if (
      depth === 0 &&
      char === ':' &&
      (subject[i + 1] === ':' ||
        /^:(?:before|after|first-line|first-letter)\b/.test(subject.slice(i)))
    )
      return i;
  }
  return subject.length;
}


function subjectControls(selector, controlClasses) {
  const subject = selector.slice(subjectStart(selector));
  const type = subject.match(/^([a-zA-Z][\w-]*)/)?.[1];
  if (type)
    return CONTROL_TAGS.includes(type) ? { type, controls: [type] } : null;
  
  
  
  const searchable = subject
    .replace(/:not\((?:[^()]|\([^()]*\))*\)/g, '')
    .replace(/:(?:is|where)\(((?:[^()]|\([^()]*\))*)\)/g, ' $1 ');
  const controls = new Set(
    [...searchable.matchAll(/\.([\w-]+)/g)].flatMap(([, name]) => [
      ...(controlClasses.get(name) ?? []),
    ])
  );
  if (!controls.size) return null;
  return { type: null, controls: [...controls].sort() };
}

function boostSelector(selector, control) {
  const start = subjectStart(selector);
  const subject = selector.slice(start);
  const at = pseudoElementStart(subject);
  return (
    selector.slice(0, start) +
    subject.slice(0, at) +
    CONTROL_BOOST[control] +
    subject.slice(at)
  );
}


export function boostSelectorList(selectorText, controlClasses) {
  const out = [];
  let changed = false;
  for (const selector of splitSelectorList(selectorText)) {
    const target = subjectControls(selector, controlClasses);
    if (
      !target ||
      Object.values(CONTROL_BOOST).some((boost) => selector.includes(boost))
    ) {
      out.push(selector);
      continue;
    }
    changed = true;
    if (target.type && target.type !== 'select') {
      
      
      out.push(boostSelector(selector, target.type));
    } else {
      
      
      
      out.push(
        selector,
        ...target.controls.map((control) => boostSelector(selector, control))
      );
    }
  }
  return changed ? out.join(', ') : selectorText;
}

const VERBATIM_AT_RULE =
  /^@(?:-[a-z]+-)?(?:keyframes|font-face|page|counter-style|property)\b/i;


export function enforceControlPrecedence(css, controlClasses) {
  const blockEnd = (from) => {
    let depth = 0;
    for (let j = from; j < css.length; j++) {
      const char = css[j];
      if (char === '/' && css[j + 1] === '*') {
        const close = css.indexOf('*/', j + 2);
        if (close < 0) return css.length;
        j = close + 1;
      } else if (char === '"' || char === "'") {
        const close = css.indexOf(char, j + 1);
        if (close < 0) return css.length;
        j = close;
      } else if (char === '{') depth++;
      else if (char === '}' && --depth === 0) return j + 1;
    }
    return css.length;
  };
  let out = '';
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) {
      out += css.slice(i);
      break;
    }
    let prelude = css.slice(i, open);
    
    const statementEnd = prelude.lastIndexOf(';');
    if (statementEnd >= 0) {
      out += prelude.slice(0, statementEnd + 1);
      prelude = prelude.slice(statementEnd + 1);
    }
    const end = blockEnd(open);
    const selectorText = prelude.trim();
    if (selectorText.startsWith('@')) {
      out += VERBATIM_AT_RULE.test(selectorText)
        ? css.slice(i, end)
        : `${prelude}{${enforceControlPrecedence(css.slice(open + 1, end - 1), controlClasses)}}`;
    } else {
      const leading = prelude.slice(0, prelude.indexOf(selectorText));
      out += `${leading}${boostSelectorList(selectorText, controlClasses)}${css.slice(open, end)}`;
    }
    i = end;
  }
  return out;
}



function declarationValue(source, identifier) {
  const match = new RegExp(
    `(?:const|let|var)\\s+${identifier}\\s*(?::[^=]+)?=\\s*`
  ).exec(source);
  if (!match) return '';
  let depth = 0;
  for (let i = match.index + match[0].length; i < source.length; i++) {
    const char = source[i];
    if ('([{'.includes(char)) depth++;
    else if (')]}'.includes(char)) depth--;
    if ((char === ';' && depth <= 0) || depth < 0)
      return source.slice(match.index + match[0].length, i);
  }
  return '';
}

function objectPropertyValue(objectText, key) {
  const match = new RegExp(`\\b${key}\\s*:\\s*`).exec(objectText);
  if (!match) return '';
  const rest = objectText.slice(match.index + match[0].length);
  return rest.match(/^(['"`])(?:(?!\1)[^\\]|\\.)*\1/)?.[0] ?? '';
}


function interpolationCode(expression) {
  let out = '';
  let i = 0;
  while (i < expression.length) {
    const char = expression[i];
    if (char === '"' || char === "'") {
      const close = expression.indexOf(char, i + 1);
      i = close < 0 ? expression.length : close + 1;
      out += ' ';
    } else if (char === '`') {
      i++;
      while (i < expression.length && expression[i] !== '`') {
        if (expression[i] === '\\') i += 2;
        else if (expression[i] === '$' && expression[i + 1] === '{') {
          let depth = 1;
          const start = i + 2;
          for (i = start; i < expression.length && depth; i++) {
            if (expression[i] === '{') depth++;
            else if (expression[i] === '}') depth--;
          }
          out += ` ${expression.slice(start, i - 1)} `;
        } else i++;
      }
      i++;
    } else {
      out += char;
      i++;
    }
  }
  return out;
}


function classTokens(source, expression, depth = 3) {
  const tokens = new Set();
  for (const literal of expression.matchAll(STRING_LITERAL)) {
    const text = literal[2]
      .replace(/\$\{\s*([A-Za-z_$][\w$]*)\s*\}/g, (match, identifier) => {
        const value = declarationValue(source, identifier).trim();
        return /^(['"])[\w-]+\1$/.test(value) ? value.slice(1, -1) : match;
      })
      
      .replace(/([\w-]+)\$\{[^}]*\}/g, ' $1 $1* ');
    for (const token of text.replace(/\$\{[^}]*\}/g, ' ').split(/\s+/))
      if (/^[a-zA-Z][\w-]*\*?$/.test(token)) tokens.add(token);
  }
  if (depth === 0) return tokens;
  const code = interpolationCode(expression);
  
  
  if (code.trim() !== expression.trim())
    for (const token of classTokens(source, code, depth - 1)) tokens.add(token);
  for (const [, object, key] of code.matchAll(
    /\b([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\b/g
  )) {
    const value = objectPropertyValue(declarationValue(source, object), key);
    for (const token of classTokens(source, value, depth - 1))
      tokens.add(token);
  }
  for (const [identifier] of code.matchAll(
    /(?<![.\w$])[A-Za-z_$][\w$]*(?![\w$]*\s*[.(:])/g
  )) {
    const value = declarationValue(source, identifier);
    if (!value || value.trimStart().startsWith('{')) continue;
    for (const token of classTokens(source, value, depth - 1))
      tokens.add(token);
  }
  return tokens;
}

function attributeExpression(text, name) {
  const match = new RegExp(`\\b${name}\\s*=\\s*`).exec(text);
  if (!match) return '';
  const start = match.index + match[0].length;
  const open = text[start];
  if (open === '"' || open === "'")
    return text.slice(start, text.indexOf(open, start + 1) + 1);
  if (open !== '{') return '';
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}' && --depth === 0) return text.slice(start, i + 1);
  }
  return '';
}

function openingTags(source, tagName) {
  const tags = [];
  for (const match of source.matchAll(new RegExp(`<${tagName}\\b`, 'g'))) {
    let depth = 0;
    for (let i = match.index + 1; i < source.length; i++) {
      const char = source[i];
      if (char === '{') depth++;
      else if (char === '}') depth--;
      else if (char === '>' && depth === 0) {
        tags.push({
          text: source.slice(match.index, i + 1),
          index: match.index,
        });
        break;
      }
    }
  }
  return tags;
}

function identifierSources(source, expression) {
  const out = [];
  for (const [identifier] of expression
    .replace(STRING_LITERAL, ' ')
    .matchAll(/\b[A-Za-z_$][\w$]*\b/g)) {
    const value = declarationValue(source, identifier);
    if (value && !value.trimStart().startsWith('{')) out.push(value);
  }
  return out;
}


export function collectControlClasses(codeFiles, styleFiles = []) {
  const wrappers = Object.fromEntries(
    CONTROL_TAGS.map((tag) => [tag, new Set()])
  );
  
  
  const forwardsClassName = (text, opening) =>
    
    
    /(?:^|\s)\{\s*\.\.\.[\w$.]+\s*\}/.test(opening.text) ||
    /\bclassName\b/.test(
      interpolationCode(
        [
          attributeExpression(opening.text, 'className'),
          ...identifierSources(
            text,
            attributeExpression(opening.text, 'className')
          ),
        ].join(' ')
      )
    );
  const enclosingComponent = (text, index) => {
    
    
    
    const match = [
      ...text
        .slice(0, index)
        .matchAll(
          /(?:function\s+([A-Z]\w*)|const\s+([A-Z]\w*)\s*(?::[^=]+)?=)/g
        ),
    ].pop();
    return match?.[1] ?? match?.[2];
  };
  for (let changed = true; changed; ) {
    changed = false;
    for (const { text } of codeFiles) {
      for (const tag of CONTROL_TAGS) {
        for (const name of [tag, ...wrappers[tag]]) {
          for (const opening of openingTags(text, name)) {
            if (!forwardsClassName(text, opening)) continue;
            const component = enclosingComponent(text, opening.index);
            if (component && !wrappers[tag].has(component)) {
              wrappers[tag].add(component);
              changed = true;
            }
          }
        }
      }
    }
  }

  const classes = new Map();
  const add = (token, tag) => {
    if (!classes.has(token)) classes.set(token, new Set());
    classes.get(token).add(tag);
  };
  for (const { text } of codeFiles) {
    for (const tag of CONTROL_TAGS) {
      for (const name of [tag, ...wrappers[tag]]) {
        for (const opening of openingTags(text, name))
          for (const token of classTokens(
            text,
            attributeExpression(opening.text, 'className')
          ))
            add(token, tag);
      }
      for (const match of text.matchAll(
        new RegExp(`createEl\\(\\s*['"]${tag}['"]\\s*,\\s*\\{`, 'g')
      )) {
        const cls = text
          .slice(match.index, match.index + 600)
          .match(
            /\bcls\s*:\s*(\[[^\]]*\]|'[^']*'|"[^"]*"|`[^`]*`|[A-Za-z_$][\w$.]*)/
          )?.[1];
        if (!cls) continue;
        const expression = /^[A-Za-z_$]/.test(cls) ? `\`\${${cls}}\`` : cls;
        for (const token of classTokens(text, expression)) add(token, tag);
      }
    }
  }

  const prefixes = [...classes].filter(([token]) => token.endsWith('*'));
  for (const [prefix] of prefixes) classes.delete(prefix);
  if (prefixes.length) {
    const styled = new Set();
    for (const { text } of styleFiles)
      for (const [, name] of text.matchAll(/\.([a-zA-Z][\w-]*)/g))
        styled.add(name);
    for (const name of styled)
      for (const [prefix, tags] of prefixes) {
        const stem = prefix.slice(0, -1);
        if (name.length > stem.length && name.startsWith(stem))
          for (const tag of tags) add(name, tag);
      }
  }
  return classes;
}
