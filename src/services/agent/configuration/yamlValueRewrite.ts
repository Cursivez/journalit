
import { isRecord } from './configurationPrimitives';
import {
  assertUniqueOwnedYamlKeys,
  failNoteRewrite,
  serializeYamlLeaf,
  yamlBlocks,
  yamlMappingKey,
} from './noteRewriteCore';

function hasDefinedKeys(value: Record<string, unknown>): boolean {
  return Object.values(value).some((entry) => entry !== undefined);
}

function serializeYamlMappingBody(
  record: Record<string, unknown>,
  indent: string,
  newline: '\n' | '\r\n'
): string {
  let serialized = '';
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined) continue;
    serialized += serializeYamlBlockEntry(key, value, indent, newline);
  }
  return serialized;
}

function serializeYamlBlockEntry(
  key: string,
  value: unknown,
  indent: string,
  newline: '\n' | '\r\n'
): string {
  const head = `${indent}${yamlMappingKey(key)}:`;
  if (isRecord(value) && hasDefinedKeys(value)) {
    return `${head}${newline}${serializeYamlMappingBody(value, `${indent}  `, newline)}`;
  }
  if (Array.isArray(value) && value.length > 0) {
    let serialized = `${head}${newline}`;
    for (const item of value) {
      if (isRecord(item) && hasDefinedKeys(item)) {
        const body = serializeYamlMappingBody(item, `${indent}    `, newline);
        serialized += `${indent}  - ${body.slice(indent.length + 4)}`;
      } else {
        serialized += `${indent}  - ${serializeYamlLeaf(item)}${newline}`;
      }
    }
    return serialized;
  }
  return `${head} ${serializeYamlLeaf(value)}${newline}`;
}


interface YamlValueWrite {
  readonly key: string;
  readonly value: unknown;
}


export function rewriteFrontmatterValues(input: {
  yaml: string;
  newline: '\n' | '\r\n';
  frontmatter: Record<string, unknown>;
  writes: readonly YamlValueWrite[];
}): string {
  const writeByKey = new Map<string, YamlValueWrite>();
  for (const write of input.writes) writeByKey.set(write.key, write);
  assertUniqueOwnedYamlKeys(input.yaml, input.frontmatter, [
    ...writeByKey.keys(),
  ]);
  let rewritten = '';
  const written = new Set<string>();
  for (const block of yamlBlocks(input.yaml)) {
    const write =
      block.key === undefined ? undefined : writeByKey.get(block.key);
    if (write === undefined) {
      rewritten += block.raw;
      continue;
    }
    written.add(write.key);
    if (write.value === null) continue;
    rewritten += serializeYamlBlockEntry(
      write.key,
      write.value,
      '',
      input.newline
    );
  }
  
  
  for (const write of writeByKey.values()) {
    if (!written.has(write.key)) failNoteRewrite('internal_error');
  }
  return rewritten;
}
