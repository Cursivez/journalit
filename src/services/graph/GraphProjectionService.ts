import type JournalitPlugin from '../../main';
import { safeParseDateValue } from '../../utils/dateUtils';
import { getTradingDay } from '../../utils/tradingDayUtils';
import { normalizeSetupKey } from '../setup/setupIdentity';
import { normalizeTradeExecution } from '../trade/core/TradeExecutionNormalization';
import {
  readMonthlyPeriod,
  readQuarterlyPeriod,
  readWeeklyPeriod,
  readWeeklyPeriodFromPath,
  readYearFromPath,
} from './graphPeriods';
import {
  dateKey,
  formatGraphWikilink,
  normalizeStringList,
  periodKey,
  type GraphIndex,
  type GraphProjection,
  type GraphTarget,
  type ResolvedTarget,
  type ReviewType,
} from './graphTypes';

export class GraphProjectionService {
  constructor(private readonly plugin: JournalitPlugin) {}

  public async projectTrade(
    frontmatter: Record<string, unknown>,
    index: GraphIndex,
    sourcePath: string
  ): Promise<GraphProjection> {
    const warnings: string[] = [];
    const execution = normalizeTradeExecution(frontmatter, {
      deriveMissingExplicitness: true,
    });
    let journalitDrc: string | undefined;
    let journalitParentReview: string | undefined;

    if (execution.firstEntryTime) {
      const tradingDate = getTradingDay(execution.firstEntryTime, this.plugin);
      const drcService = await this.plugin.serviceManager.getDRCService();
      const expectedPath = drcService.getDRCNotePath(tradingDate);
      const resolved = this.resolveTarget(
        index.drcsByDate.get(dateKey(tradingDate)) ?? [],
        expectedPath
      );
      if (resolved.target) {
        journalitDrc = this.formatTargetLink(
          resolved.target,
          sourcePath,
          warnings,
          'DRC'
        );
      }
      if (resolved.ambiguous) warnings.push('Ambiguous DRC target');
      if (!resolved.target && !resolved.ambiguous) {
        const parentReview = await this.resolveClosestTradeReview(
          tradingDate,
          index,
          warnings
        );
        if (parentReview) {
          journalitParentReview = this.formatTargetLink(
            parentReview,
            sourcePath,
            warnings,
            'parent review'
          );
        }
      }
    } else {
      warnings.push('Trade has no valid entry time');
    }

    const setupLinks: string[] = [];
    const setupPaths = new Set<string>();
    const setupLabels = normalizeStringList(frontmatter.setup);
    for (const label of setupLabels) {
      const targets = index.setupsByKey.get(normalizeSetupKey(label)) ?? [];
      const resolved = this.resolveTarget(targets);
      if (resolved.ambiguous) {
        warnings.push(`Ambiguous setup target: ${label}`);
        continue;
      }
      if (!resolved.target || setupPaths.has(resolved.target.file.path)) {
        continue;
      }
      setupPaths.add(resolved.target.file.path);
      const setupLink = this.formatTargetLink(
        resolved.target,
        sourcePath,
        warnings,
        'setup'
      );
      if (setupLink) setupLinks.push(setupLink);
    }

    return {
      journalitDrc,
      journalitSetups: setupLinks.length > 0 ? setupLinks : undefined,
      journalitParentReview,
      warnings,
    };
  }

  public async projectReview(
    reviewType: ReviewType,
    frontmatter: Record<string, unknown>,
    index: GraphIndex,
    filePath: string
  ): Promise<GraphProjection> {
    const warnings: string[] = [];
    let resolved: ResolvedTarget = { ambiguous: false };

    if (reviewType === 'drc') {
      const date = safeParseDateValue(frontmatter.date);
      if (!date) return { warnings: ['DRC has no valid date'] };
      const weeklyService =
        await this.plugin.serviceManager.getWeeklyReviewService();
      const expectedPath = weeklyService.getWeeklyReviewPath(date);
      const expectedPeriod = readWeeklyPeriodFromPath(expectedPath);
      const candidates = expectedPeriod
        ? (index.weekliesByPeriod.get(expectedPeriod) ?? [])
        : [];
      resolved = this.resolveTarget(candidates, expectedPath);
    } else if (reviewType === 'weekly-review') {
      const period = readWeeklyPeriod(frontmatter, filePath);
      if (!period) {
        return { warnings: ['Weekly review has no valid month or year'] };
      }
      const { year, month } = period;
      const monthlyService =
        await this.plugin.serviceManager.getMonthlyReviewService();
      const expectedPath = monthlyService.getMonthlyReviewPath(
        new Date(year, month - 1, 1)
      );
      resolved = this.resolveTarget(
        index.monthliesByPeriod.get(periodKey(year, month)) ?? [],
        expectedPath
      );
    } else if (reviewType === 'monthly-review') {
      const period = readMonthlyPeriod(frontmatter, filePath);
      if (!period) {
        return { warnings: ['Monthly review has no valid month or year'] };
      }
      const { year, month } = period;
      const quarter = Math.ceil(month / 3);
      const quarterlyService =
        await this.plugin.serviceManager.getQuarterlyReviewService();
      const expectedPath = await quarterlyService.getQuarterlyReviewPath(
        new Date(year, month - 1, 1)
      );
      resolved = this.resolveTarget(
        index.quarterliesByPeriod.get(periodKey(year, quarter)) ?? [],
        expectedPath
      );
    } else if (reviewType === 'quarterly-review') {
      const period = readQuarterlyPeriod(frontmatter, filePath);
      if (!period) return { warnings: ['Quarterly review has no valid year'] };
      const yearlyService =
        await this.plugin.serviceManager.getYearlyReviewService();
      const expectedPath = await yearlyService.getYearlyReviewPath(
        new Date(period.year, 0, 1)
      );
      resolved = this.resolveTarget(
        index.yearliesByPeriod.get(periodKey(period.year)) ?? [],
        expectedPath
      );
    }

    if (resolved.ambiguous) warnings.push('Ambiguous parent review target');
    return {
      journalitParentReview: resolved.target
        ? this.formatTargetLink(
            resolved.target,
            filePath,
            warnings,
            'parent review'
          )
        : undefined,
      warnings,
    };
  }

  private async resolveClosestTradeReview(
    tradingDate: Date,
    index: GraphIndex,
    warnings: string[]
  ): Promise<GraphTarget | undefined> {
    const weeklyService =
      await this.plugin.serviceManager.getWeeklyReviewService();
    const weeklyPath = weeklyService.getWeeklyReviewPath(tradingDate);
    const weeklyPeriod = readWeeklyPeriodFromPath(weeklyPath);
    if (weeklyPeriod) {
      const resolved = this.resolveTarget(
        index.weekliesByPeriod.get(weeklyPeriod) ?? [],
        weeklyPath
      );
      if (resolved.target) return resolved.target;
      if (resolved.ambiguous) {
        warnings.push('Ambiguous weekly review target');
        return undefined;
      }
    }

    const monthlyService =
      await this.plugin.serviceManager.getMonthlyReviewService();
    const monthlyPath = monthlyService.getMonthlyReviewPath(tradingDate);
    const monthlyPeriod = readMonthlyPeriod({}, monthlyPath);
    if (monthlyPeriod) {
      const resolved = this.resolveTarget(
        index.monthliesByPeriod.get(
          periodKey(monthlyPeriod.year, monthlyPeriod.month)
        ) ?? [],
        monthlyPath
      );
      if (resolved.target) return resolved.target;
      if (resolved.ambiguous) {
        warnings.push('Ambiguous monthly review target');
        return undefined;
      }
    }

    const quarterlyService =
      await this.plugin.serviceManager.getQuarterlyReviewService();
    const quarterlyPath =
      await quarterlyService.getQuarterlyReviewPath(tradingDate);
    const quarterlyPeriod = readQuarterlyPeriod({}, quarterlyPath);
    if (quarterlyPeriod) {
      const resolved = this.resolveTarget(
        index.quarterliesByPeriod.get(
          periodKey(quarterlyPeriod.year, quarterlyPeriod.quarter)
        ) ?? [],
        quarterlyPath
      );
      if (resolved.target) return resolved.target;
      if (resolved.ambiguous) {
        warnings.push('Ambiguous quarterly review target');
        return undefined;
      }
    }

    const yearlyService =
      await this.plugin.serviceManager.getYearlyReviewService();
    const yearlyPath = await yearlyService.getYearlyReviewPath(tradingDate);
    const year = readYearFromPath(yearlyPath);
    if (!year) return undefined;
    const resolved = this.resolveTarget(
      index.yearliesByPeriod.get(periodKey(year)) ?? [],
      yearlyPath
    );
    if (resolved.ambiguous) warnings.push('Ambiguous yearly review target');
    return resolved.target;
  }

  private resolveTarget(
    candidates: GraphTarget[],
    expectedPath?: string
  ): ResolvedTarget {
    if (expectedPath) {
      const exact = candidates.find(
        (candidate) => candidate.file.path === expectedPath
      );
      if (exact) return { target: exact, ambiguous: false };
    }
    if (candidates.length === 1) {
      return { target: candidates[0], ambiguous: false };
    }
    return { ambiguous: candidates.length > 1 };
  }

  private formatTargetLink(
    target: GraphTarget,
    sourcePath: string,
    warnings: string[],
    relationship: string
  ): string | undefined {
    const linkPath = this.resolveSafeLinkPath(target, sourcePath);
    if (!linkPath) {
      warnings.push(
        `Unlinkable ${relationship} target path: ${target.file.path}`
      );
      return undefined;
    }
    return formatGraphWikilink(target, linkPath);
  }

  private resolveSafeLinkPath(
    target: GraphTarget,
    sourcePath: string
  ): string | undefined {
    const fullPath = target.file.path.replace(/\.md$/i, '');
    const relativePath = this.relativeLinkPath(sourcePath, target.file.path);
    const generatedPath = this.plugin.app.metadataCache.fileToLinktext(
      target.file,
      sourcePath,
      true
    );
    const candidates = [
      fullPath,
      relativePath,
      target.file.basename,
      generatedPath,
    ];

    for (const candidate of new Set(candidates)) {
      if (/[#|\r\n]|\]\]/.test(candidate)) continue;
      const resolved = this.plugin.app.metadataCache.getFirstLinkpathDest(
        candidate,
        sourcePath
      );
      if (resolved?.path === target.file.path) return candidate;
    }
    return undefined;
  }

  private relativeLinkPath(sourcePath: string, targetPath: string): string {
    const sourceParts = sourcePath.split('/');
    sourceParts.pop();
    const targetParts = targetPath.replace(/\.md$/i, '').split('/');
    let sharedLength = 0;
    while (
      sharedLength < sourceParts.length &&
      sharedLength < targetParts.length &&
      sourceParts[sharedLength] === targetParts[sharedLength]
    ) {
      sharedLength += 1;
    }
    const parentSegments = sourceParts.length - sharedLength;
    return [
      ...Array.from({ length: parentSegments }, () => '..'),
      ...targetParts.slice(sharedLength),
    ].join('/');
  }
}
