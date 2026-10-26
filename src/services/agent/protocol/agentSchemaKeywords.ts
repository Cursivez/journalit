
import ucs2length from 'ajv/dist/runtime/ucs2length';
import {
  NUMBER_LIMITS,
  STRING_FORMATS,
  VALID,
  alwaysValid,
  equal,
  escapePointer,
  isRecord,
  isType,
  mergeEvaluated,
  planned,
  schemaTypes,
  type AgentSchemaViolation,
  type ApplicatorKeyword,
  type ArrayKeyword,
  type Evaluated,
  type JsonRecord,
  type Location,
  type NumberKeyword,
  type ObjectKeyword,
  type Outcome,
  type Plan,
  type Schema,
  type SchemaObject,
  type StringKeyword,
} from './agentSchemaModel';


export interface KeywordContext {
  
  sub(
    at: Location,
    schema: Schema,
    schemaPath: string,
    composite?: boolean,
    data?: unknown,
    instancePath?: string
  ): Outcome;
  
  report(
    at: Location,
    keyword: string,
    message: string,
    append?: boolean
  ): false;
  
  truncate(at: Location, length: number): void;
  typeError(schema: SchemaObject, at: Location): void;
  plan(schema: SchemaObject): Plan;
  
  ref(
    schema: SchemaObject,
    at: Location
  ): { errors: AgentSchemaViolation[]; evaluated: Evaluated };
  pattern(source: string): RegExp;
}


export function runGroups(
  ctx: KeywordContext,
  schema: SchemaObject,
  plan: Plan,
  at: Location,
  state: { evaluated: Evaluated },
  start: number
): void {
  for (const keyword of plan.applicator) {
    if (!applicatorKeyword(ctx, schema, keyword, at, state)) break;
  }
  if (at.frame.errors.length !== start) return;
  const data = at.data;
  if (plan.number !== undefined) {
    if (typeof data === 'number' && isFinite(data)) {
      for (const keyword of plan.number.keywords) {
        if (!numberKeyword(ctx, schema, keyword, data, at)) break;
      }
    } else if (plan.number.typeError) {
      ctx.typeError(schema, at);
    }
    if (at.frame.errors.length !== start) return;
  }
  if (plan.string !== undefined) {
    if (typeof data === 'string') {
      for (const keyword of plan.string.keywords) {
        if (!stringKeyword(ctx, schema, keyword, data, at)) break;
      }
    } else if (plan.string.typeError) {
      ctx.typeError(schema, at);
    }
    if (at.frame.errors.length !== start) return;
  }
  if (plan.array !== undefined) {
    if (Array.isArray(data)) {
      for (const keyword of plan.array.keywords) {
        if (!arrayKeyword(ctx, schema, keyword, data, at)) break;
      }
    } else if (plan.array.typeError) {
      ctx.typeError(schema, at);
    }
    if (at.frame.errors.length !== start) return;
  }
  if (plan.object !== undefined) {
    if (isRecord(data)) {
      for (const keyword of plan.object.keywords) {
        if (!objectKeyword(ctx, schema, keyword, data, at, state)) break;
      }
    } else if (plan.object.typeError) {
      ctx.typeError(schema, at);
    }
  }
}


function applicatorKeyword(
  ctx: KeywordContext,
  schema: SchemaObject,
  keyword: ApplicatorKeyword,
  at: Location,
  state: { evaluated: Evaluated }
): boolean {
  const path = `${at.schemaPath}/${keyword}`;
  const start = at.frame.errors.length;
  const data = at.data;
  switch (keyword) {
    case '$ref': {
      const { errors, evaluated } = ctx.ref(schema, at);
      if (errors.length === 0) {
        state.evaluated = mergeEvaluated(state.evaluated, evaluated);
        return true;
      }
      at.frame.errors.push(...errors);
      return false;
    }
    case 'const': {
      const expected = schema.const;
      const matches =
        typeof expected === 'object' && expected !== null
          ? equal(data, expected)
          : expected === data;
      return matches || ctx.report(at, keyword, 'must be equal to constant');
    }
    case 'enum': {
      const values = planned(schema.enum);
      const matches = values.some((value) =>
        values.length >= 200 || (typeof value === 'object' && value !== null)
          ? equal(data, value)
          : data === value
      );
      return (
        matches ||
        ctx.report(at, keyword, 'must be equal to one of the allowed values')
      );
    }
    case 'not': {
      const negated = planned(schema.not);
      if (alwaysValid(negated)) {
        return ctx.report(at, keyword, 'must NOT be valid');
      }
      if (ctx.sub(at, negated, path, true).valid) {
        return ctx.report(at, keyword, 'must NOT be valid');
      }
      ctx.truncate(at, start);
      return true;
    }
    case 'anyOf': {
      let valid = false;
      planned(schema.anyOf).forEach((branch, index) => {
        const outcome = ctx.sub(at, branch, `${path}/${index}`, true);
        if (outcome.valid) {
          valid = true;
          state.evaluated = mergeEvaluated(state.evaluated, outcome.evaluated);
        }
      });
      if (valid) {
        ctx.truncate(at, start);
        return true;
      }
      return ctx.report(at, keyword, 'must match a schema in anyOf', true);
    }
    case 'oneOf': {
      let valid = false;
      const branches = planned(schema.oneOf);
      for (let index = 0; index < branches.length; index += 1) {
        const branch = branches[index];
        const outcome = alwaysValid(branch)
          ? VALID
          : ctx.sub(at, branch, `${path}/${index}`, true);
        if (!outcome.valid) continue;
        if (valid) {
          valid = false;
          break;
        }
        valid = true;
        state.evaluated = mergeEvaluated(state.evaluated, outcome.evaluated);
      }
      if (valid) {
        ctx.truncate(at, start);
        return true;
      }
      return ctx.report(
        at,
        keyword,
        'must match exactly one schema in oneOf',
        true
      );
    }
    case 'allOf': {
      const branches = planned(schema.allOf);
      for (let index = 0; index < branches.length; index += 1) {
        const branch = branches[index];
        if (alwaysValid(branch)) continue;
        const outcome = ctx.sub(at, branch, `${path}/${index}`);
        if (!outcome.valid) return false;
        state.evaluated = mergeEvaluated(state.evaluated, outcome.evaluated);
      }
      return true;
    }
    case 'if': {
      const hasThen = schema.then !== undefined && !alwaysValid(schema.then);
      const hasElse = schema.else !== undefined && !alwaysValid(schema.else);
      if (!hasThen && !hasElse) return true;
      const condition = ctx.sub(at, planned(schema.if), path, true);
      
      state.evaluated = mergeEvaluated(state.evaluated, condition.evaluated);
      ctx.truncate(at, start);
      const clause = condition.valid ? 'then' : 'else';
      const clauseSchema = condition.valid ? schema.then : schema.else;
      if (clauseSchema === undefined || alwaysValid(clauseSchema)) {
        return true;
      }
      const outcome = ctx.sub(at, clauseSchema, `${at.schemaPath}/${clause}`);
      if (outcome.valid) {
        state.evaluated = mergeEvaluated(state.evaluated, outcome.evaluated);
        return true;
      }
      return ctx.report(at, keyword, `must match "${clause}" schema`, true);
    }
    
    case 'type':
    case 'then':
    case 'else':
      return true;
  }
}

function numberKeyword(
  ctx: KeywordContext,
  schema: SchemaObject,
  keyword: NumberKeyword,
  data: number,
  at: Location
): boolean {
  
  if (keyword === 'format') return true;
  const limit = planned(schema[keyword]);
  const { ok, fails } = NUMBER_LIMITS[keyword];
  return fails(data, limit) || isNaN(data)
    ? ctx.report(at, keyword, `must be ${ok} ${limit}`)
    : true;
}

function stringKeyword(
  ctx: KeywordContext,
  schema: SchemaObject,
  keyword: StringKeyword,
  data: string,
  at: Location
): boolean {
  switch (keyword) {
    case 'maxLength':
    case 'minLength': {
      const limit = planned(schema[keyword]);
      const length = ucs2length(data);
      const fails = keyword === 'maxLength' ? length > limit : length < limit;
      return fails
        ? ctx.report(
            at,
            keyword,
            `must NOT have ${keyword === 'maxLength' ? 'more' : 'fewer'} than ${limit} characters`
          )
        : true;
    }
    case 'pattern': {
      const source = planned(schema.pattern);
      return (
        ctx.pattern(source).test(data) ||
        ctx.report(at, keyword, `must match pattern "${source}"`)
      );
    }
    case 'format': {
      const name = planned(schema.format);
      const check = STRING_FORMATS.get(name);
      if (check === undefined) {
        throw new Error(`Unsupported agent schema format ${name}`);
      }
      return (
        check(data) || ctx.report(at, keyword, `must match format "${name}"`)
      );
    }
  }
}

function arrayKeyword(
  ctx: KeywordContext,
  schema: SchemaObject,
  keyword: ArrayKeyword,
  items: readonly unknown[],
  at: Location
): boolean {
  const path = `${at.schemaPath}/${keyword}`;
  const start = at.frame.errors.length;
  switch (keyword) {
    case 'maxItems':
    case 'minItems': {
      const limit = planned(schema[keyword]);
      const length = items.length;
      const fails = keyword === 'maxItems' ? length > limit : length < limit;
      return fails
        ? ctx.report(
            at,
            keyword,
            `must NOT have ${keyword === 'maxItems' ? 'more' : 'fewer'} than ${limit} items`
          )
        : true;
    }
    case 'prefixItems': {
      const prefix = planned(schema.prefixItems);
      for (let index = 0; index < prefix.length; index += 1) {
        if (alwaysValid(prefix[index]) || items.length <= index) continue;
        const outcome = ctx.sub(
          at,
          prefix[index],
          `${path}/${index}`,
          at.composite,
          items[index],
          `${at.instancePath}/${index}`
        );
        if (!outcome.valid) return false;
      }
      return true;
    }
    case 'items': {
      const itemSchema = planned(schema.items);
      const first = schema.prefixItems?.length ?? 0;
      if (itemSchema === false && schema.prefixItems !== undefined) {
        return items.length <= first
          ? true
          : ctx.report(at, keyword, `must NOT have more than ${first} items`);
      }
      if (alwaysValid(itemSchema)) return true;
      for (let index = first; index < items.length; index += 1) {
        const outcome = ctx.sub(
          at,
          itemSchema,
          path,
          at.composite,
          items[index],
          `${at.instancePath}/${index}`
        );
        if (!outcome.valid) return false;
      }
      return true;
    }
    case 'contains': {
      const minimum = schema.minContains ?? 1;
      const message = `must contain at least ${minimum} valid item(s)`;
      if (minimum === 0) return true;
      const containsSchema = planned(schema.contains);
      if (alwaysValid(containsSchema)) {
        return items.length >= minimum || ctx.report(at, keyword, message);
      }
      let count = 0;
      for (let index = 0; index < items.length; index += 1) {
        const outcome = ctx.sub(
          at,
          containsSchema,
          path,
          true,
          items[index],
          `${at.instancePath}/${index}`
        );
        if (outcome.valid && ++count >= minimum) break;
      }
      if (count < minimum) return ctx.report(at, keyword, message);
      ctx.truncate(at, start);
      return true;
    }
    case 'uniqueItems':
      return schema.uniqueItems === true
        ? uniqueItems(ctx, schema, items, at)
        : true;
    
    case 'minContains':
      return true;
  }
}

function objectKeyword(
  ctx: KeywordContext,
  schema: SchemaObject,
  keyword: ObjectKeyword,
  record: JsonRecord,
  at: Location,
  state: { evaluated: Evaluated }
): boolean {
  const path = `${at.schemaPath}/${keyword}`;
  switch (keyword) {
    case 'maxProperties':
    case 'minProperties': {
      const limit = planned(schema[keyword]);
      const count = Object.keys(record).length;
      const fails = keyword === 'maxProperties' ? count > limit : count < limit;
      return fails
        ? ctx.report(
            at,
            keyword,
            `must NOT have ${keyword === 'maxProperties' ? 'more' : 'fewer'} than ${limit} properties`
          )
        : true;
    }
    case 'required': {
      for (const property of planned(schema.required)) {
        if (record[property] === undefined) {
          return ctx.report(
            at,
            keyword,
            `must have required property '${property}'`
          );
        }
      }
      return true;
    }
    case 'dependentRequired': {
      const dependencies = planned(schema.dependentRequired);
      for (const property in dependencies) {
        const required = dependencies[property];
        if (required.length === 0 || record[property] === undefined) continue;
        if (required.some((name) => record[name] === undefined)) {
          return ctx.report(
            at,
            keyword,
            `must have ${required.length === 1 ? 'property' : 'properties'} ${required.join(', ')} when property ${property} is present`
          );
        }
      }
      return true;
    }
    case 'propertyNames': {
      const nameSchema = planned(schema.propertyNames);
      if (alwaysValid(nameSchema)) return true;
      for (const key in record) {
        if (!ctx.sub(at, nameSchema, path, true, key).valid) {
          return ctx.report(at, keyword, 'property name must be valid', true);
        }
      }
      return true;
    }
    case 'additionalProperties': {
      state.evaluated = true;
      const additional = planned(schema.additionalProperties);
      if (alwaysValid(additional)) return true;
      const defined = ctx.plan(schema).properties;
      for (const key in record) {
        if (defined.has(key)) continue;
        if (additional === false) {
          return ctx.report(at, keyword, 'must NOT have additional properties');
        }
        const outcome = ctx.sub(
          at,
          additional,
          path,
          at.composite,
          record[key],
          `${at.instancePath}/${escapePointer(key)}`
        );
        if (!outcome.valid) return false;
      }
      return true;
    }
    case 'properties': {
      const properties = planned(schema.properties);
      const keys = ctx.plan(schema).properties;
      state.evaluated = mergeEvaluated(state.evaluated, keys);
      for (const key of keys) {
        const propertySchema = properties[key];
        if (alwaysValid(propertySchema) || record[key] === undefined) {
          continue;
        }
        const outcome = ctx.sub(
          at,
          propertySchema,
          `${path}/${escapePointer(key)}`,
          at.composite,
          record[key],
          `${at.instancePath}/${escapePointer(key)}`
        );
        if (!outcome.valid) return false;
      }
      return true;
    }
    case 'unevaluatedProperties': {
      const evaluated = state.evaluated;
      state.evaluated = true;
      if (evaluated === true) return true;
      for (const key in record) {
        if (evaluated === undefined || !evaluated.has(key)) {
          return ctx.report(
            at,
            keyword,
            'must NOT have unevaluated properties'
          );
        }
      }
      return true;
    }
  }
}


function uniqueItems(
  ctx: KeywordContext,
  schema: SchemaObject,
  items: readonly unknown[],
  at: Location
): boolean {
  const itemTypes = schema.items === undefined ? [] : schemaTypes(schema.items);
  const duplicate = (later: number, earlier: number) =>
    ctx.report(
      at,
      'uniqueItems',
      `must NOT have duplicate items (items ## ${later} and ${earlier} are identical)`
    );
  if (
    itemTypes.length > 0 &&
    !itemTypes.some((type) => type === 'object' || type === 'array')
  ) {
    const indices: Record<string, unknown> = {};
    for (let index = items.length; index--;) {
      const item = items[index];
      if (!itemTypes.some((type) => isType(type, item))) continue;
      
      
      const key =
        itemTypes.length > 1 && typeof item === 'string'
          ? `${item}_`
          : String(item);
      const seen = indices[key];
      if (typeof seen === 'number') return duplicate(seen, index);
      indices[key] = index;
    }
    return true;
  }
  for (let index = items.length; index--;) {
    for (let other = index; other--;) {
      if (equal(items[index], items[other])) return duplicate(other, index);
    }
  }
  return true;
}
