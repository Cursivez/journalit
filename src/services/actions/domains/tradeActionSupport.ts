import type { TradeData, TradeService } from '../../trade/TradeService';
import { getFirstEntryTime } from '../../../utils/tradeStatusUtils';
import { validateAndNormalizeTradeMutationInput } from '../../trade/core/TradeRules';
import { normalizeTradeTagList } from '../../../utils/tradeTagNormalization';
import {
  normalizeOptionKey,
  normalizeOptionString,
} from '../../../utils/stringNormalization';
import { ActionPlanError } from '../ActionErrors';
import type { ActionInput, TradeNoteContent } from '../ActionTypes';


type WireExecutions = NonNullable<ActionInput<'trade.update'>['executions']>;


interface ExecutionLeg {
  readonly time: Date;
  readonly price: number;
  readonly size: number;
}

export interface Executions {
  readonly entries: readonly ExecutionLeg[];
  readonly exits: readonly ExecutionLeg[];
}

const EXECUTION_SIZE_TOLERANCE = 1e-9;


export async function tradeEditState(
  tradeService: Pick<TradeService, 'getTradeEditRevision'>,
  path: string,
  contentRevision: string
): Promise<TradeNoteContent | undefined> {
  const edit = await tradeService.getTradeEditRevision(path);
  return edit.contentRevision === contentRevision
    ? { path, editRevision: edit.editRevision }
    : undefined;
}

export function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}


export function normalizeExtractedTradeData(
  value: Record<string, unknown> | null
): TradeData | null {
  if (
    value === null ||
    !(value.entryTime instanceof Date) ||
    typeof value.entryPrice !== 'number' ||
    typeof value.positionSize !== 'number' ||
    typeof value.direction !== 'string'
  ) {
    return null;
  }
  return {
    ...value,
    entryTime: value.entryTime,
    entryPrice: value.entryPrice,
    positionSize: value.positionSize,
    direction: value.direction,
  };
}


export function parseExecutions(wire: WireExecutions): Executions {
  const legs = (values: WireExecutions['entries']): ExecutionLeg[] =>
    values.map((leg) => {
      const time = new Date(leg.time);
      if (
        Number.isNaN(time.getTime()) ||
        !Number.isFinite(leg.price) ||
        !(leg.size > 0)
      )
        throw new ActionPlanError('invalid_request', 'executions');
      return { time, price: leg.price, size: leg.size };
    });
  const entries = legs(wire.entries);
  const exits = legs(wire.exits);
  if (entries.length === 0)
    throw new ActionPlanError('invalid_request', 'executions');
  const entered = entries.reduce((sum, leg) => sum + leg.size, 0);
  const exited = exits.reduce((sum, leg) => sum + leg.size, 0);
  const opened = firstEntryTime({ entries, exits }).getTime();
  if (
    exited - entered > EXECUTION_SIZE_TOLERANCE ||
    exits.some((leg) => leg.time.getTime() < opened)
  )
    throw new ActionPlanError('invalid_request', 'executions');
  return { entries, exits };
}


export function firstEntryTime(executions: Executions): Date {
  const first = getFirstEntryTime({ entries: [...executions.entries] });
  if (first === null)
    throw new ActionPlanError('invalid_request', 'executions');
  return first;
}


export function applyExecutions(next: TradeData, executions: Executions): void {
  const { entries, exits } = executions;
  next.entries = entries.map((leg) => ({ ...leg }));
  next.exits = exits.map((leg) => ({ ...leg, hasExplicitPrice: true }));
  next.hasExplicitExitPrice = exits.length > 0 ? true : undefined;
  next.positionSize = entries.reduce((sum, leg) => sum + leg.size, 0);
  next.entryPrice = entries[0].price;
  next.entryTime = firstEntryTime(executions);
  delete next.exitTime;
  delete next.exitPrice;
  delete next.tradeStatus;
}


export function executionsKey(entries: unknown, exits: unknown): string {
  const legs = (values: unknown) =>
    (Array.isArray(values) ? values : []).map((leg: Partial<ExecutionLeg>) => [
      leg.time instanceof Date ? leg.time.getTime() : null,
      leg.price ?? null,
      leg.size ?? null,
    ]);
  return JSON.stringify([legs(entries), legs(exits)]);
}


export function tagCatalog(
  available: readonly string[]
): ReadonlyMap<string, string> {
  const catalog = new Map<string, string>();
  for (const tag of normalizeTradeTagList(available)) {
    const key = normalizeOptionKey(tag);
    if (!catalog.has(key)) catalog.set(key, tag);
  }
  return catalog;
}


export function catalogTags(
  labels: readonly string[],
  available: readonly string[],
  field: string
): string[] {
  return catalogTagsIn(labels, tagCatalog(available), field);
}


export function catalogTagsIn(
  labels: readonly string[],
  catalog: ReadonlyMap<string, string>,
  field: string
): string[] {
  const tags = normalizeTradeTagList(labels);
  if (tags.length === 0) throw new ActionPlanError('invalid_request', field);
  return tags.map((tag) => {
    const known = catalog.get(normalizeOptionKey(tag));
    if (known === undefined) throw new ActionPlanError('not_found', field);
    return known;
  });
}


export function catalogMistakes(
  labels: readonly string[],
  available: readonly string[],
  field: string
): string[] {
  const catalog = new Map<string, string>();
  for (const mistake of available) {
    const display = normalizeOptionString(mistake);
    const key = display.toLowerCase();
    if (key === '' || catalog.has(key)) continue;
    catalog.set(key, display);
  }
  const result: string[] = [];
  const seen = new Set<string>();
  for (const label of labels) {
    const key = normalizeOptionKey(label);
    if (key === '') continue;
    const authoritative = catalog.get(key);
    if (authoritative === undefined) {
      throw new ActionPlanError('not_found', field);
    }
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(authoritative);
  }
  if (result.length === 0) throw new ActionPlanError('invalid_request', field);
  return result;
}


export function normalizedTradeForWrite(
  data: TradeData,
  type: 'regular' | 'missed' | 'backtest',
  options: { requireAccount: boolean }
): { data: TradeData; isOpen: boolean } | null {
  if (
    type === 'missed' &&
    data.useDirectPnLInput !== true &&
    !(data.exits ?? []).some((exit) => exit.size > 0)
  ) {
    return null;
  }
  try {
    const { normalizedData, isOpen } = validateAndNormalizeTradeMutationInput(
      data,
      {
        allowClosedTradeWithoutExitTimeInDirectPnlMode: true,
        allowEmptyAccount: type !== 'regular' || !options.requireAccount,
      }
    );
    return { data: normalizedData, isOpen };
  } catch {
    return null;
  }
}
