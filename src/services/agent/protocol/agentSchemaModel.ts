
import ajvEqual from 'ajv/dist/runtime/equal';
import type { Format, FormatDefinition } from 'ajv';
import { fullFormats } from 'ajv-formats/dist/formats';



export const equal = ajvEqual as unknown as (a: unknown, b: unknown) => boolean;

export interface AgentSchemaViolation {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  message: string;
}

export type JsonType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'null'
  | 'object'
  | 'array';

export type Schema = boolean | SchemaObject;


export interface SchemaObject {
  readonly $id?: string;
  readonly $defs?: Readonly<Record<string, Schema>>;
  readonly $ref?: string;
  readonly type?: JsonType | readonly JsonType[];
  readonly const?: unknown;
  readonly enum?: readonly unknown[];
  readonly not?: Schema;
  readonly anyOf?: readonly Schema[];
  readonly oneOf?: readonly Schema[];
  readonly allOf?: readonly Schema[];
  readonly if?: Schema;
  readonly then?: Schema;
  readonly else?: Schema;
  readonly maximum?: number;
  readonly minimum?: number;
  readonly exclusiveMaximum?: number;
  readonly exclusiveMinimum?: number;
  readonly maxLength?: number;
  readonly minLength?: number;
  readonly pattern?: string;
  readonly format?: string;
  readonly maxItems?: number;
  readonly minItems?: number;
  readonly prefixItems?: readonly Schema[];
  readonly items?: Schema;
  readonly contains?: Schema;
  readonly minContains?: number;
  readonly uniqueItems?: boolean;
  readonly maxProperties?: number;
  readonly minProperties?: number;
  readonly required?: readonly string[];
  readonly propertyNames?: Schema;
  readonly additionalProperties?: Schema;
  readonly properties?: Readonly<Record<string, Schema>>;
  readonly dependentRequired?: Readonly<Record<string, readonly string[]>>;
  readonly unevaluatedProperties?: false;
}


const APPLICATOR_KEYWORDS = [
  '$ref',
  'type',
  'const',
  'enum',
  'not',
  'anyOf',
  'oneOf',
  'allOf',
  'if',
  'then',
  'else',
] as const;
const NUMBER_KEYWORDS = [
  'maximum',
  'minimum',
  'exclusiveMaximum',
  'exclusiveMinimum',
  'format',
] as const;
const STRING_KEYWORDS = [
  'maxLength',
  'minLength',
  'pattern',
  'format',
] as const;
const ARRAY_KEYWORDS = [
  'maxItems',
  'minItems',
  'prefixItems',
  'items',
  'contains',
  'minContains',
  'uniqueItems',
] as const;
const OBJECT_KEYWORDS = [
  'maxProperties',
  'minProperties',
  'required',
  'propertyNames',
  'additionalProperties',
  'properties',
  'dependentRequired',
  'unevaluatedProperties',
] as const;

export type ApplicatorKeyword = (typeof APPLICATOR_KEYWORDS)[number];
export type NumberKeyword = (typeof NUMBER_KEYWORDS)[number];
export type StringKeyword = (typeof STRING_KEYWORDS)[number];
export type ArrayKeyword = (typeof ARRAY_KEYWORDS)[number];
export type ObjectKeyword = (typeof OBJECT_KEYWORDS)[number];
type Keyword =
  | ApplicatorKeyword
  | NumberKeyword
  | StringKeyword
  | ArrayKeyword
  | ObjectKeyword;
type GroupType = 'number' | 'string' | 'array' | 'object';

const GROUP_KEYWORDS: Readonly<Record<GroupType, readonly Keyword[]>> = {
  number: NUMBER_KEYWORDS,
  string: STRING_KEYWORDS,
  array: ARRAY_KEYWORDS,
  object: OBJECT_KEYWORDS,
};


export interface AgentSchemaPack {
  readonly schemas: readonly SchemaObject[];
}

export type JsonRecord = Readonly<Record<string, unknown>>;


export type Evaluated = true | ReadonlySet<string> | undefined;

export interface Frame {
  readonly errors: AgentSchemaViolation[];
  
  exitErrors?: AgentSchemaViolation[];
}

export interface Location {
  readonly data: unknown;
  readonly instancePath: string;
  readonly schemaPath: string;
  readonly base: string;
  readonly frame: Frame;
  readonly composite: boolean;
}

export interface Outcome {
  readonly valid: boolean;
  readonly evaluated: Evaluated;
}

interface GroupStep<K extends Keyword> {
  readonly keywords: readonly K[];
  
  readonly typeError: boolean;
}

export interface Plan {
  
  readonly properties: ReadonlySet<string>;
  
  readonly typesFirst?: readonly JsonType[];
  
  readonly applicator: readonly ApplicatorKeyword[];
  readonly number?: GroupStep<NumberKeyword>;
  readonly string?: GroupStep<StringKeyword>;
  readonly array?: GroupStep<ArrayKeyword>;
  readonly object?: GroupStep<ObjectKeyword>;
}




const RULE_KEYWORDS: ReadonlySet<string> = new Set<string>([
  ...APPLICATOR_KEYWORDS,
  ...NUMBER_KEYWORDS,
  ...STRING_KEYWORDS,
  ...ARRAY_KEYWORDS,
  ...OBJECT_KEYWORDS,
]);


export const STRING_FORMATS: ReadonlyMap<string, (data: string) => boolean> =
  new Map(
    (['date', 'date-time', 'uuid'] as const).map((name) => [
      name,
      stringFormat(fullFormats[name]),
    ])
  );

function isStringFormatDefinition(
  format: Format
): format is FormatDefinition<string> {
  return (
    typeof format === 'object' &&
    !(format instanceof RegExp) &&
    format.type !== 'number' &&
    format.async !== true
  );
}

function stringFormat(format: Format): (data: string) => boolean {
  if (format instanceof RegExp) return (data) => format.test(data);
  if (isStringFormatDefinition(format)) {
    const check = format.validate;
    if (typeof check === 'function') return check;
    if (check instanceof RegExp) return (data) => check.test(data);
  }
  throw new Error('Unsupported agent schema format');
}

export const NUMBER_LIMITS = {
  maximum: { ok: '<=', fails: (data: number, limit: number) => data > limit },
  minimum: { ok: '>=', fails: (data: number, limit: number) => data < limit },
  exclusiveMaximum: {
    ok: '<',
    fails: (data: number, limit: number) => data >= limit,
  },
  exclusiveMinimum: {
    ok: '>',
    fails: (data: number, limit: number) => data <= limit,
  },
} as const;

export const VALID: Outcome = { valid: true, evaluated: undefined };

export function hasRules(schema: SchemaObject): boolean {
  for (const key in schema) if (RULE_KEYWORDS.has(key)) return true;
  return false;
}

export function alwaysValid(schema: Schema): boolean {
  return typeof schema === 'boolean' ? schema : !hasRules(schema);
}

function hasRulesButRef(schema: SchemaObject): boolean {
  for (const key in schema) {
    if (key !== '$ref' && RULE_KEYWORDS.has(key)) return true;
  }
  return false;
}

export function schemaTypes(schema: Schema): readonly JsonType[] {
  if (typeof schema === 'boolean' || schema.type === undefined) return [];
  return typeof schema.type === 'string' ? [schema.type] : schema.type;
}


export function planned<T>(value: T | undefined): T {
  if (value === undefined)
    throw new Error('Planned agent schema keyword is missing');
  return value;
}

export function isRecord(data: unknown): data is JsonRecord {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
}

export function isSchema(value: unknown): value is Schema {
  return typeof value === 'boolean' || isRecord(value);
}

export function isSchemaObject(value: unknown): value is SchemaObject {
  return isRecord(value) && typeof value.$id === 'string';
}

export function isType(type: JsonType, data: unknown): boolean {
  switch (type) {
    case 'null':
      return data === null;
    case 'array':
      return Array.isArray(data);
    case 'object':
      return isRecord(data);
    case 'integer':
      return (
        typeof data === 'number' && Number.isInteger(data) && isFinite(data)
      );
    case 'number':
      return typeof data === 'number' && isFinite(data);
    default:
      return typeof data === type;
  }
}

export function escapePointer(segment: string): string {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}


export function mergeEvaluated(into: Evaluated, from: Evaluated): Evaluated {
  if (into === true || from === undefined) return into;
  if (from === true || into === undefined) return from;
  const merged = new Set(into);
  for (const key of from) merged.add(key);
  return merged;
}

export function buildPlan(schema: SchemaObject): Plan {
  if (schema.$ref !== undefined && !hasRulesButRef(schema)) {
    return { properties: new Set(), applicator: ['$ref'] };
  }
  const types = schemaTypes(schema);
  const present = <K extends Keyword>(keywords: readonly K[]): K[] =>
    keywords.filter((keyword) => schema[keyword] !== undefined);
  const single = types.length === 1 ? types[0] : undefined;
  const singleKeywords =
    single === 'number' ||
    single === 'string' ||
    single === 'array' ||
    single === 'object'
      ? GROUP_KEYWORDS[single]
      : [];
  const typesFirst = types.length > 0 && present(singleKeywords).length === 0;
  const step = <K extends Keyword>(
    type: GroupType,
    keywords: readonly K[]
  ): GroupStep<K> | undefined => {
    const found = present(keywords);
    return found.length === 0
      ? undefined
      : { keywords: found, typeError: !typesFirst && single === type };
  };
  return {
    properties: new Set(Object.keys(schema.properties ?? {})),
    typesFirst: typesFirst ? types : undefined,
    applicator: present(APPLICATOR_KEYWORDS),
    number: step('number', NUMBER_KEYWORDS),
    string: step('string', STRING_KEYWORDS),
    array: step('array', ARRAY_KEYWORDS),
    object: step('object', OBJECT_KEYWORDS),
  };
}
