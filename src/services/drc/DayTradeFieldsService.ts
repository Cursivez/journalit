

import { TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import { eventBus } from '../events/EventBus';
import type { Unsubscribe } from '../events/types';
import type { DRCService } from './DRCService';
import { getReviewMigrationTradingDays } from '../trade/TradeService';
import { createTradingDayFromString } from '../../utils/tradingDayUtils';
import { logger } from '../../utils/logger';
import {
  DAY_TRADE_FIELD_SOURCES_KEY,
  hasTradeJournalChanges,
  readTradeJournalValues,
  type TradeJournalPatch,
} from '../trade/core/TradeJournalFields';
import {
  planDayTradeFieldUpdate,
  readDayTradeFieldRules,
  reconcileDayFieldSources,
  resolveDayTradeField,
  type DayTradeFieldChange,
  type DayTradeFieldRef,
  type DayTradeFieldUpdate,
  type ResolvedDayTradeField,
} from './dayTradeFields';

const CREATED_TRADE_SETTLE_MS = 1500;

export type { DayTradeFieldChange } from './dayTradeFields';

interface CreatedDay {
  day: string;
  drcFile: TFile;
  
  paths: string[];
}

interface DayTradeFieldApplyResult {
  changed: number;
  
  failedPaths: string[];
}


function changesJournalValues(patch: TradeJournalPatch): boolean {
  return hasTradeJournalChanges({ ...patch, dayFieldSources: undefined });
}


function tagsToAssign(
  values: ReadonlyArray<{ ref: DayTradeFieldRef; value: unknown }>
): string[] {
  const tags: string[] = [];
  for (const { ref, value } of values) {
    if (ref !== 'tags' || !Array.isArray(value)) continue;
    for (const tag of value) if (typeof tag === 'string') tags.push(tag);
  }
  return tags;
}

export class DayTradeFieldsService {
  private readonly unsubscribes: Unsubscribe[] = [];
  private readonly pendingCreated = new Set<string>();
  private flushTimer: number | null = null;

  constructor(private readonly plugin: JournalitPlugin) {}

  public initialize(): void {
    this.unsubscribes.push(
      eventBus.subscribe('trade:committed', (payload) => {
        if (payload.change.action !== 'created') return;
        if (this.plugin.settingsManager?.isSampleContextActive()) return;
        this.pendingCreated.add(payload.change.path);
        this.scheduleFlush();
      })
    );
    const { metadataCache } = this.plugin.app;
    const ref = metadataCache.on('changed', (file, _data, cache) => {
      const frontmatter = cache.frontmatter;
      if (
        frontmatter?.type !== 'trade' ||
        frontmatter[DAY_TRADE_FIELD_SOURCES_KEY] === undefined
      )
        return;
      void this.reconcileSources(file.path, frontmatter);
    });
    this.unsubscribes.push(() => metadataCache.offref(ref));
  }

  
  private async reconcileSources(
    path: string,
    frontmatter: Record<string, unknown>
  ): Promise<void> {
    const fields = this.plugin.serviceManager
      .getCustomFieldsService()
      .getFields();
    const stale = reconcileDayFieldSources(
      readTradeJournalValues(frontmatter, fields)
    );
    if (stale.dayFieldSources === undefined) return;
    try {
      
      await this.plugin.tradeService.updateTradeJournalFieldsFromCurrent(
        path,
        reconcileDayFieldSources
      );
    } catch (error) {
      console.error(
        `[DayTradeFields] Failed to reconcile day field sources on ${path}:`,
        error
      );
    }
  }

  public destroy(): void {
    for (const unsubscribe of this.unsubscribes.splice(0)) unsubscribe();
    if (this.flushTimer !== null) window.clearTimeout(this.flushTimer);
    this.flushTimer = null;
    this.pendingCreated.clear();
  }

  
  public getDayTradePaths(day: string): string[] {
    const { app, serviceManager } = this.plugin;
    const folderPathService = serviceManager.getFolderPathService();
    const paths: string[] = [];
    for (const file of app.vault.getMarkdownFiles()) {
      if (!folderPathService.isJournalPath(file.path)) continue;
      const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
      if (!this.isLiveTrade(frontmatter)) continue;
      if (
        getReviewMigrationTradingDays(frontmatter, this.plugin).some(
          (tradingDay) => tradingDay === day
        )
      )
        paths.push(file.path);
    }
    return paths;
  }

  private isLiveTrade(
    frontmatter: Record<string, unknown> | undefined
  ): frontmatter is Record<string, unknown> {
    return frontmatter?.type === 'trade' && frontmatter.isMissedTrade !== true;
  }

  private resolveField(ref: DayTradeFieldRef): ResolvedDayTradeField | null {
    return resolveDayTradeField(
      ref,
      this.plugin.serviceManager.getCustomFieldsService().getFields()
    );
  }

  
  public async applyRuleChanges(
    day: string,
    tradePaths: string[],
    changes: DayTradeFieldChange[]
  ): Promise<DayTradeFieldApplyResult> {
    const resolved = changes.flatMap((change) => {
      const field = this.resolveField(change.ref);
      return field ? [{ ...change, field }] : [];
    });
    const result: DayTradeFieldApplyResult = { changed: 0, failedPaths: [] };
    if (!resolved.length) return result;
    const assignTags = tagsToAssign(
      resolved.map((change) => ({ ref: change.ref, value: change.next }))
    );
    
    
    const outcomes = await Promise.allSettled(
      tradePaths.map(async (path) => {
        let visible = false;
        await this.plugin.tradeService.updateTradeJournalFieldsFromCurrent(
          path,
          (current) => {
            const patch = planDayTradeFieldUpdate(day, resolved, current);
            visible = changesJournalValues(patch);
            return patch;
          },
          { assignTags }
        );
        return visible;
      })
    );
    outcomes.forEach((outcome, index) => {
      if (outcome.status === 'fulfilled') {
        if (outcome.value) result.changed++;
        return;
      }
      result.failedPaths.push(tradePaths[index]);
      console.error(
        `[DayTradeFields] Failed to apply day fields to ${tradePaths[index]}:`,
        outcome.reason
      );
    });
    return result;
  }

  private scheduleFlush(): void {
    if (this.flushTimer !== null) window.clearTimeout(this.flushTimer);
    this.flushTimer = window.setTimeout(() => {
      this.flushTimer = null;
      void this.flushCreated();
    }, CREATED_TRADE_SETTLE_MS);
  }

  private async flushCreated(): Promise<void> {
    const paths = [...this.pendingCreated];
    this.pendingCreated.clear();
    if (!paths.length) return;

    
    const pathsByDay = new Map<string, string[]>();
    for (const path of paths) {
      const file = this.plugin.app.vault.getAbstractFileByPath(path);
      if (!(file instanceof TFile)) continue;
      const frontmatter =
        this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!this.isLiveTrade(frontmatter)) continue;
      for (const day of getReviewMigrationTradingDays(
        frontmatter,
        this.plugin
      )) {
        const list = pathsByDay.get(day) ?? [];
        list.push(path);
        pathsByDay.set(day, list);
      }
    }

    const drcService = await this.plugin.serviceManager.getDRCService();
    const days = await Promise.all(
      [...pathsByDay].map(([day, dayPaths]) =>
        this.resolveCreatedDay(drcService, day, dayPaths)
      )
    );
    
    
    
    
    
    
    const writes: Promise<void>[] = [];
    for (const created of days
      .filter((entry): entry is CreatedDay => entry !== null)
      .sort((a, b) => a.day.localeCompare(b.day))) {
      const rules = readDayTradeFieldRules(
        this.plugin.app.metadataCache.getFileCache(created.drcFile)?.frontmatter
      );
      if (!rules.length) continue;
      const resolved: DayTradeFieldUpdate[] = rules.flatMap((rule) => {
        const field = this.resolveField(rule.field);
        return field ? [{ field, previous: undefined, next: rule.value }] : [];
      });
      const assignTags = tagsToAssign(
        rules.map((rule) => ({ ref: rule.field, value: rule.value }))
      );
      for (const path of created.paths) {
        writes.push(this.applyCreated(created, path, resolved, assignTags));
      }
    }
    await Promise.all(writes);
  }

  
  private async resolveCreatedDay(
    drcService: DRCService,
    day: string,
    dayPaths: string[]
  ): Promise<CreatedDay | null> {
    try {
      const drcPath = await drcService.resolveDRCNotePath(
        createTradingDayFromString(day)
      );
      const drcFile = this.plugin.app.vault.getAbstractFileByPath(drcPath);
      if (!(drcFile instanceof TFile)) return null;
      return { day, drcFile, paths: dayPaths };
    } catch (error) {
      console.error(
        `[DayTradeFields] Failed to resolve the DRC for ${day}:`,
        error
      );
      return null;
    }
  }

  private async applyCreated(
    created: CreatedDay,
    path: string,
    resolved: DayTradeFieldUpdate[],
    assignTags: string[]
  ): Promise<void> {
    try {
      const changed =
        await this.plugin.tradeService.updateTradeJournalFieldsFromCurrent(
          path,
          (current) => planDayTradeFieldUpdate(created.day, resolved, current),
          { assignTags }
        );
      if (changed) {
        logger.debug(
          `[DayTradeFields] Applied ${created.drcFile.path} day fields to ${path}`
        );
      }
    } catch (error) {
      console.error(
        `[DayTradeFields] Failed to apply day fields to ${path}:`,
        error
      );
    }
  }
}
