
import { runGroups, type KeywordContext } from './agentSchemaKeywords';
import {
  VALID,
  buildPlan,
  hasRules,
  isRecord,
  isSchema,
  isSchemaObject,
  isType,
  planned,
  type AgentSchemaViolation,
  type Evaluated,
  type Frame,
  type Location,
  type Outcome,
  type Plan,
  type Schema,
  type SchemaObject,
} from './agentSchemaModel';

export type { AgentSchemaPack, AgentSchemaViolation } from './agentSchemaModel';

interface RefTarget {
  readonly schema: Schema;
  readonly base: string;
}


const FRAME_EXIT = new Error('Agent schema validation frame exit');

export class AgentSchemaValidator implements KeywordContext {
  private readonly resources = new Map<string, SchemaObject>();
  private readonly targets = new Map<string, RefTarget>();
  
  private readonly refTargets = new WeakMap<SchemaObject, RefTarget>();
  private readonly patterns = new Map<string, RegExp>();
  private readonly plans = new WeakMap<SchemaObject, Plan>();

  
  constructor(pack: unknown) {
    const schemas: unknown = isRecord(pack) ? pack.schemas : undefined;
    if (!Array.isArray(schemas)) {
      throw new Error('Agent schema pack has no schemas');
    }
    for (const schema of schemas) {
      if (!isSchemaObject(schema)) {
        throw new Error('Agent schema resource is missing its $id');
      }
      this.resources.set(planned(schema.$id), schema);
    }
  }

  
  validate(ref: string, data: unknown): AgentSchemaViolation[] | null {
    const { errors } = this.call(this.resolve(ref, ''), data, '');
    return errors.length === 0 ? null : errors;
  }

  
  private call(
    target: RefTarget,
    data: unknown,
    instancePath: string
  ): { errors: AgentSchemaViolation[]; evaluated: Evaluated } {
    const frame: Frame = { errors: [] };
    try {
      const outcome = this.evaluate(target.schema, {
        data,
        instancePath,
        
        schemaPath: '#',
        base: target.base,
        frame,
        composite: false,
      });
      return { errors: frame.errors, evaluated: outcome.evaluated };
    } catch (exit) {
      if (exit !== FRAME_EXIT || frame.exitErrors === undefined) throw exit;
      return { errors: frame.exitErrors, evaluated: undefined };
    }
  }

  private resolve(ref: string, base: string): RefTarget {
    const key = `${base} ${ref}`;
    const cached = this.targets.get(key);
    if (cached !== undefined) return cached;
    const hashIndex = ref.indexOf('#');
    const resourceRef = hashIndex === -1 ? ref : ref.slice(0, hashIndex);
    const fragment = hashIndex === -1 ? '' : ref.slice(hashIndex + 1);
    const resourceId =
      resourceRef === '' ? base : new URL(resourceRef, base || undefined).href;
    const resource = this.resources.get(resourceId);
    if (resource === undefined) {
      throw new Error(`Unknown agent schema resource ${resourceId}`);
    }
    let schema: Schema = resource;
    if (fragment !== '') {
      for (const segment of fragment.slice(1).split('/')) {
        const name = decodeURIComponent(segment)
          .replace(/~1/g, '/')
          .replace(/~0/g, '~');
        const next: unknown =
          typeof schema === 'object' ? Reflect.get(schema, name) : undefined;
        if (!isSchema(next)) {
          throw new Error(`Unresolvable agent schema reference ${ref}`);
        }
        schema = next;
      }
    }
    const target = { schema, base: resourceId };
    this.targets.set(key, target);
    return target;
  }

  
  report(
    at: Location,
    keyword: string,
    message: string,
    append = false
  ): false {
    const violation = {
      instancePath: at.instancePath,
      schemaPath: `${at.schemaPath}/${keyword}`,
      keyword,
      message,
    };
    if (at.composite) {
      at.frame.errors.push(violation);
      return false;
    }
    at.frame.exitErrors = append
      ? [...at.frame.errors, violation]
      : [violation];
    throw FRAME_EXIT;
  }

  truncate(at: Location, length: number): void {
    at.frame.errors.length = length;
  }

  sub(
    at: Location,
    schema: Schema,
    schemaPath: string,
    composite = at.composite,
    data: unknown = at.data,
    instancePath = at.instancePath
  ): Outcome {
    return this.evaluate(schema, {
      data,
      instancePath,
      schemaPath,
      base: at.base,
      frame: at.frame,
      composite,
    });
  }

  private evaluate(schema: Schema, at: Location): Outcome {
    if (schema === true) return VALID;
    if (schema === false) {
      this.report(at, 'false schema', 'boolean schema is false');
      return { valid: false, evaluated: undefined };
    }
    if (!hasRules(schema)) return VALID;

    const start = at.frame.errors.length;
    const state: { evaluated: Evaluated } = { evaluated: undefined };
    const plan = this.plan(schema);
    if (
      plan.typesFirst !== undefined &&
      !plan.typesFirst.some((type) => isType(type, at.data))
    ) {
      this.typeError(schema, at);
    }
    runGroups(this, schema, plan, at, state, start);
    return {
      valid: at.frame.errors.length === start,
      evaluated: state.evaluated,
    };
  }

  
  plan(schema: SchemaObject): Plan {
    let plan = this.plans.get(schema);
    if (plan === undefined) {
      plan = buildPlan(schema);
      this.plans.set(schema, plan);
    }
    return plan;
  }

  typeError(schema: SchemaObject, at: Location): void {
    this.report(at, 'type', `must be ${String(schema.type)}`);
  }

  ref(
    schema: SchemaObject,
    at: Location
  ): { errors: AgentSchemaViolation[]; evaluated: Evaluated } {
    let target = this.refTargets.get(schema);
    if (target === undefined) {
      target = this.resolve(planned(schema.$ref), at.base);
      this.refTargets.set(schema, target);
    }
    return this.call(target, at.data, at.instancePath);
  }

  pattern(source: string): RegExp {
    let pattern = this.patterns.get(source);
    if (pattern === undefined) {
      pattern = new RegExp(source, 'u');
      this.patterns.set(source, pattern);
    }
    return pattern;
  }
}
