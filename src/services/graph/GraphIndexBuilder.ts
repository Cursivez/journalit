import { App, TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import { safeParseDateValue } from '../../utils/dateUtils';
import { getTradeIdentityNoteType } from '../../utils/tradeIdentity';
import { normalizeSetupKey } from '../setup/setupIdentity';
import {
  getReviewTargetSignature,
  readMonthlyPeriod,
  readPositiveInteger,
  readQuarterlyPeriod,
  readWeeklyPeriod,
  readYearFromPath,
} from './graphPeriods';
import {
  addTarget,
  dateKey,
  errorMessage,
  getReviewType,
  hasManagedProperties,
  periodKey,
  type GraphIndex,
} from './graphTypes';

type FrontmatterReader = (
  file: TFile
) => Promise<Record<string, unknown> | undefined>;

export class GraphIndexBuilder {
  private readonly app: App;

  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly readFrontmatter: FrontmatterReader
  ) {
    this.app = plugin.app;
  }

  public async build(): Promise<GraphIndex> {
    const folderPathService = this.plugin.serviceManager.getFolderPathService();
    const index: GraphIndex = {
      frontmatterByPath: new Map(),
      readErrors: [],
      reviewTargetSignaturesByPath: new Map(),
      setupTargetPaths: new Set(),
      drcsByDate: new Map(),
      weekliesByPeriod: new Map(),
      monthliesByPeriod: new Map(),
      quarterliesByPeriod: new Map(),
      yearliesByPeriod: new Map(),
      setupsByKey: new Map(),
    };
    const setupService = await this.plugin.serviceManager.getSetupService();
    const setupDiscovery = await setupService.listExistingSetupsWithErrors();
    const setups = setupDiscovery.setups;
    index.readErrors.push(...setupDiscovery.errors);
    const files = this.app.vault
      .getMarkdownFiles()
      .filter((file) => folderPathService.isJournalPath(file.path));

    const frontmatterEntries = await Promise.all(
      files.map(async (file) => {
        try {
          return {
            file,
            frontmatter: await this.readFrontmatter(file),
            error: undefined,
          };
        } catch (error: unknown) {
          return { file, frontmatter: undefined, error };
        }
      })
    );

    for (const { file, frontmatter, error } of frontmatterEntries) {
      if (error !== undefined) {
        index.readErrors.push({
          filePath: file.path,
          message: errorMessage(error),
        });
        continue;
      }
      if (!frontmatter) continue;

      const tradeType = getTradeIdentityNoteType(frontmatter, file.path);
      const reviewType = getReviewType(frontmatter);
      if (
        tradeType !== 'trade' &&
        !reviewType &&
        !hasManagedProperties(frontmatter)
      ) {
        continue;
      }
      index.frontmatterByPath.set(file.path, frontmatter);

      const target = { file, displayText: file.basename };
      if (reviewType) {
        index.reviewTargetSignaturesByPath.set(
          file.path,
          getReviewTargetSignature(reviewType, frontmatter, file.path)
        );
      }
      if (reviewType === 'drc') {
        const date = safeParseDateValue(frontmatter.date);
        if (date) addTarget(index.drcsByDate, dateKey(date), target);
      } else if (reviewType === 'weekly-review') {
        const period = readWeeklyPeriod(frontmatter, file.path);
        if (period) {
          addTarget(
            index.weekliesByPeriod,
            periodKey(period.year, period.month, period.week),
            target
          );
        }
      } else if (reviewType === 'monthly-review') {
        const period = readMonthlyPeriod(frontmatter, file.path);
        if (period) {
          addTarget(
            index.monthliesByPeriod,
            periodKey(period.year, period.month),
            target
          );
        }
      } else if (reviewType === 'quarterly-review') {
        const period = readQuarterlyPeriod(frontmatter, file.path);
        if (period) {
          addTarget(
            index.quarterliesByPeriod,
            periodKey(period.year, period.quarter),
            target
          );
        }
      } else if (reviewType === 'yearly-review') {
        const year = readYearFromPath(file.path);
        const frontmatterYear = readPositiveInteger(frontmatter.year);
        const targetYear = frontmatterYear ?? year;
        if (targetYear) {
          addTarget(index.yearliesByPeriod, periodKey(targetYear), target);
        }
      }
    }

    for (const setup of setups) {
      if (!setup.filePath) continue;
      const file = this.app.vault.getAbstractFileByPath(setup.filePath);
      if (!(file instanceof TFile)) continue;
      index.setupTargetPaths.add(file.path);
      const target = { file, displayText: setup.name };
      for (const value of [setup.id, setup.name, ...setup.aliases]) {
        const key = normalizeSetupKey(value);
        if (key) addTarget(index.setupsByKey, key, target);
      }
    }

    return index;
  }
}
