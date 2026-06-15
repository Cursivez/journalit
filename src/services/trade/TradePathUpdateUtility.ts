

import { App, TFile } from 'obsidian';
import { TradeService } from './TradeService';
import { getQuarterForMonth, getQuarterString } from '../../utils/dateUtils';
import {
  ensureTradeIdentityFrontmatter,
  isTradeIdentityEligibleNote,
} from '../../utils/tradeIdentity';

interface UpdateStats {
  success: number;
  failed: number;
  updated: number;
  errors: string[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  isRecord(value) ? value : undefined;

const asRecordArray = (value: unknown): Array<Record<string, unknown>> =>
  Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> =>
        Boolean(asRecord(item))
      )
    : [];

export class TradePathUpdateUtility {
  constructor(
    private app: App,
    private tradeService: TradeService
  ) {}

  
  public getImageBasePaths(file: TFile, targetPath: string): Set<string> {
    const basePaths = new Set<string>();
    const cache = this.app.metadataCache.getFileCache(file);
    const frontmatter = asRecord(cache?.frontmatter);

    if (!frontmatter) {
      return basePaths;
    }

    
    const normalizedTargetPath = targetPath.replace(/\/$/, '') + '/';

    
    const extractBasePath = (imagePath: string): string | null => {
      if (typeof imagePath !== 'string') return null;

      
      
      const match = imagePath.match(
        /^(.+?)\/\d{4}\/(?:\d{2}\/)?(?:W\d+\/)?media\//
      );
      return match ? match[1] : null;
    };

    
    const checkSection = (section: Record<string, unknown>): void => {
      if (section?.images && Array.isArray(section.images)) {
        for (const img of section.images) {
          if (typeof img === 'string') {
            const basePath = extractBasePath(img);
            if (basePath) {
              basePaths.add(basePath);
            }
          }
        }
      }
    };

    
    if (frontmatter.images && Array.isArray(frontmatter.images)) {
      for (const img of frontmatter.images) {
        if (typeof img === 'string') {
          const basePath = extractBasePath(img);
          if (basePath) {
            basePaths.add(basePath);
          }
        }
      }
    }

    
    const imagesByWidget = asRecord(frontmatter.imagesByWidget);
    if (imagesByWidget) {
      const widgetImages = Object.values(imagesByWidget);
      for (const images of widgetImages) {
        if (!Array.isArray(images)) continue;
        for (const img of images) {
          if (typeof img !== 'string') continue;
          const basePath = extractBasePath(img);
          if (basePath) {
            basePaths.add(basePath);
          }
        }
      }
    }

    
    if (frontmatter.type === 'drc') {
      
      const forecast = asRecord(frontmatter.forecast);
      if (forecast) {
        for (const key of Object.keys(forecast)) {
          if (key === 'bias' || key === 'levels' || key === 'keyLevels') {
            continue;
          }

          const section = forecast[key];

          const sectionRecord = asRecord(section);
          if (key === 'customTimeframes' && sectionRecord) {
            Object.values(sectionRecord).forEach((value) => {
              const record = asRecord(value);
              if (record) checkSection(record);
            });
          } else if (sectionRecord) {
            checkSection(sectionRecord);
          }
        }
      }

      
      const endOfDayReview = asRecord(frontmatter.endOfDayReview);
      if (endOfDayReview) {
        checkSection(endOfDayReview);
      }

      
      asRecordArray(frontmatter.missedTrades).forEach(checkSection);
    }

    
    if (frontmatter.type === 'weekly-review') {
      const forecast = asRecord(frontmatter.forecast);
      if (forecast) {
        for (const key of Object.keys(forecast)) {
          const section = forecast[key];

          const sectionRecord = asRecord(section);
          if (key === 'customTimeframes' && sectionRecord) {
            Object.values(sectionRecord).forEach((value) => {
              const record = asRecord(value);
              if (record) checkSection(record);
            });
          } else if (sectionRecord) {
            checkSection(sectionRecord);
          }
        }
      }
    }

    
    if (normalizedTargetPath) {
      const filteredPaths = new Set<string>();
      for (const path of basePaths) {
        
        if (path !== normalizedTargetPath.replace(/\/$/, '')) {
          filteredPaths.add(path);
        }
      }
      return filteredPaths;
    }

    return basePaths;
  }

  
  private updateImagesArray(
    images: unknown[] | undefined,
    oldPath: string,
    newPath: string
  ): { updated: string[]; hasChanges: boolean } {
    if (!images || !Array.isArray(images)) {
      return { updated: [], hasChanges: false };
    }

    const validImages = images.filter(
      (img): img is string => typeof img === 'string'
    );
    let hasChanges = false;

    const updated = validImages.map((imagePath: string) => {
      if (imagePath.startsWith(oldPath)) {
        hasChanges = true;
        return imagePath.replace(oldPath, newPath);
      }
      return imagePath;
    });

    return { updated, hasChanges };
  }

  
  private updateForecastSection(
    section: Record<string, unknown>,
    oldPath: string,
    newPath: string
  ): boolean {
    if (!section || typeof section !== 'object') {
      return false;
    }

    let hasChanges = false;

    const images = section.images;
    if (Array.isArray(images)) {
      const result = this.updateImagesArray(images, oldPath, newPath);
      if (result.hasChanges) {
        section.images = result.updated;
        hasChanges = true;
      }
    }

    return hasChanges;
  }

  private normalizeBasePath(path: string): string {
    return path.replace(/\/$/, '') + '/';
  }

  private updateImagesArrayForBasePaths(
    images: unknown[] | undefined,
    oldPaths: string[],
    newPath: string
  ): { updated: string[]; hasChanges: boolean } {
    if (!images || !Array.isArray(images)) {
      return { updated: [], hasChanges: false };
    }

    const validImages = images.filter(
      (img): img is string => typeof img === 'string'
    );
    let hasChanges = false;

    const updated = validImages.map((imagePath: string) => {
      const oldPath = oldPaths.find((candidate) =>
        imagePath.startsWith(candidate)
      );
      if (!oldPath) {
        return imagePath;
      }

      hasChanges = true;
      return imagePath.replace(oldPath, newPath);
    });

    return { updated, hasChanges };
  }

  private updateForecastSectionForBasePaths(
    section: Record<string, unknown>,
    oldPaths: string[],
    newPath: string
  ): boolean {
    if (!section || typeof section !== 'object') {
      return false;
    }

    const images = section.images;
    const result = this.updateImagesArrayForBasePaths(
      Array.isArray(images) ? images : undefined,
      oldPaths,
      newPath
    );
    if (!result.hasChanges) {
      return false;
    }

    section.images = result.updated;
    return true;
  }

  async updateImagePathsForBasePaths(
    oldBasePaths: string[],
    newBasePath: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<UpdateStats> {
    const stats: UpdateStats = {
      success: 0,
      failed: 0,
      updated: 0,
      errors: [],
    };

    const normalizedOldPaths = Array.from(
      new Set(oldBasePaths.map((path) => this.normalizeBasePath(path)))
    );
    const normalizedNewPath = this.normalizeBasePath(newBasePath);

    const filesWithImages = this.app.vault.getMarkdownFiles().filter((file) => {
      const oldPaths = this.getImageBasePaths(file, normalizedNewPath);
      return Array.from(oldPaths).some((oldPath) =>
        normalizedOldPaths.includes(this.normalizeBasePath(oldPath))
      );
    });

    const total = filesWithImages.length;
    let current = 0;
    const BATCH_SIZE = 10;
    const BATCH_DELAY = 5;

    for (let i = 0; i < filesWithImages.length; i += BATCH_SIZE) {
      const batch = filesWithImages.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (file) => {
          try {
            let pathsUpdated = false;
            await this.app.fileManager.processFrontMatter(file, (fm) => {
              const fmRecord = asRecord(fm);
              if (!fmRecord) return;
              const isLegacyTradePath =
                file.path.startsWith(
                  `${this.tradeService.JOURNALIT_FOLDER}/`
                ) && isTradeIdentityEligibleNote(fmRecord, file.path);

              if (isLegacyTradePath) {
                ensureTradeIdentityFrontmatter(fmRecord);
              }

              if (Array.isArray(fmRecord.images)) {
                const result = this.updateImagesArrayForBasePaths(
                  fmRecord.images,
                  normalizedOldPaths,
                  normalizedNewPath
                );
                if (result.hasChanges) {
                  fmRecord.images = result.updated;
                  pathsUpdated = true;
                }
              }

              const imagesByWidget = asRecord(fmRecord.imagesByWidget);
              if (imagesByWidget) {
                for (const [widgetId, images] of Object.entries(
                  imagesByWidget
                )) {
                  if (!Array.isArray(images)) continue;
                  const result = this.updateImagesArrayForBasePaths(
                    images,
                    normalizedOldPaths,
                    normalizedNewPath
                  );
                  if (result.hasChanges) {
                    imagesByWidget[widgetId] = result.updated;
                    pathsUpdated = true;
                  }
                }
              }

              if (fmRecord.type === 'drc') {
                const forecast = asRecord(fmRecord.forecast);
                if (forecast) {
                  for (const key of Object.keys(forecast)) {
                    if (
                      key === 'bias' ||
                      key === 'levels' ||
                      key === 'keyLevels'
                    ) {
                      continue;
                    }

                    const section = forecast[key];
                    const sectionRecord = asRecord(section);
                    if (key === 'customTimeframes' && sectionRecord) {
                      for (const customKey of Object.keys(sectionRecord)) {
                        const customRecord = asRecord(sectionRecord[customKey]);
                        if (!customRecord) continue;
                        pathsUpdated =
                          this.updateForecastSectionForBasePaths(
                            customRecord,
                            normalizedOldPaths,
                            normalizedNewPath
                          ) || pathsUpdated;
                      }
                    } else if (sectionRecord) {
                      pathsUpdated =
                        this.updateForecastSectionForBasePaths(
                          sectionRecord,
                          normalizedOldPaths,
                          normalizedNewPath
                        ) || pathsUpdated;
                    }
                  }
                }

                const endOfDayReview = asRecord(fmRecord.endOfDayReview);
                if (endOfDayReview) {
                  pathsUpdated =
                    this.updateForecastSectionForBasePaths(
                      endOfDayReview,
                      normalizedOldPaths,
                      normalizedNewPath
                    ) || pathsUpdated;
                }

                for (const trade of asRecordArray(fmRecord.missedTrades)) {
                  pathsUpdated =
                    this.updateForecastSectionForBasePaths(
                      trade,
                      normalizedOldPaths,
                      normalizedNewPath
                    ) || pathsUpdated;
                }
              }

              if (fmRecord.type === 'weekly-review') {
                const forecast = asRecord(fmRecord.forecast);
                if (forecast) {
                  for (const key of Object.keys(forecast)) {
                    const section = forecast[key];
                    const sectionRecord = asRecord(section);
                    if (key === 'customTimeframes' && sectionRecord) {
                      for (const customKey of Object.keys(sectionRecord)) {
                        const customRecord = asRecord(sectionRecord[customKey]);
                        if (!customRecord) continue;
                        pathsUpdated =
                          this.updateForecastSectionForBasePaths(
                            customRecord,
                            normalizedOldPaths,
                            normalizedNewPath
                          ) || pathsUpdated;
                      }
                    } else if (sectionRecord) {
                      pathsUpdated =
                        this.updateForecastSectionForBasePaths(
                          sectionRecord,
                          normalizedOldPaths,
                          normalizedNewPath
                        ) || pathsUpdated;
                    }
                  }
                }
              }
            });

            if (pathsUpdated) {
              stats.updated++;
            }
            stats.success++;
          } catch (error) {
            stats.failed++;
            const errorMsg =
              error instanceof Error ? error.message : String(error);
            stats.errors.push(`${file.path}: ${errorMsg}`);
          } finally {
            current++;
            onProgress?.(current, total);
          }
        })
      );

      if (i + BATCH_SIZE < filesWithImages.length) {
        await new Promise((resolve) => window.setTimeout(resolve, BATCH_DELAY));
      }
    }

    return stats;
  }

  
  async updateImagePathsForAllTrades(
    oldBasePath: string,
    newBasePath: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<UpdateStats> {
    const stats: UpdateStats = {
      success: 0,
      failed: 0,
      updated: 0,
      errors: [],
    };

    
    const normalizedOldPath = oldBasePath.replace(/\/$/, '') + '/';
    const normalizedNewPath = newBasePath.replace(/\/$/, '') + '/';

    
    const allFiles = this.app.vault.getMarkdownFiles();

    
    const filesWithImages: TFile[] = [];
    for (const file of allFiles) {
      const cache = this.app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter as
        | Record<string, unknown>
        | undefined;

      let hasOldPathImages = false;

      
      if (frontmatter?.images && Array.isArray(frontmatter.images)) {
        const validImagePaths = frontmatter.images.filter(
          (img): img is string => typeof img === 'string'
        );
        hasOldPathImages = validImagePaths.some((img: string) =>
          img.startsWith(normalizedOldPath)
        );
      }

      
      if (
        !hasOldPathImages &&
        frontmatter?.imagesByWidget &&
        typeof frontmatter.imagesByWidget === 'object' &&
        !Array.isArray(frontmatter.imagesByWidget)
      ) {
        const widgetImages = Object.values(
          asRecord(frontmatter.imagesByWidget) ?? {}
        );
        hasOldPathImages = widgetImages.some(
          (images) =>
            Array.isArray(images) &&
            images.some(
              (img) =>
                typeof img === 'string' && img.startsWith(normalizedOldPath)
            )
        );
      }

      
      if (!hasOldPathImages && frontmatter?.type === 'drc') {
        const checkSection = (section: Record<string, unknown>): boolean => {
          if (section?.images && Array.isArray(section.images)) {
            return section.images.some(
              (img: unknown) =>
                typeof img === 'string' && img.startsWith(normalizedOldPath)
            );
          }
          return false;
        };

        const forecast = asRecord(frontmatter.forecast);
        if (forecast) {
          
          for (const key of Object.keys(forecast)) {
            
            if (key === 'bias' || key === 'levels' || key === 'keyLevels') {
              continue;
            }

            const section = forecast[key];

            
            const sectionRecord = asRecord(section);
            if (key === 'customTimeframes' && sectionRecord) {
              hasOldPathImages = Object.values(sectionRecord).some((value) => {
                const record = asRecord(value);
                return record ? checkSection(record) : false;
              });
            } else {
              hasOldPathImages = sectionRecord
                ? checkSection(sectionRecord)
                : false;
            }

            if (hasOldPathImages) break;
          }
        }

        const endOfDayReview = asRecord(frontmatter.endOfDayReview);
        if (!hasOldPathImages && endOfDayReview) {
          hasOldPathImages = checkSection(endOfDayReview);
        }

        if (!hasOldPathImages) {
          hasOldPathImages = asRecordArray(frontmatter.missedTrades).some(
            checkSection
          );
        }
      }

      
      if (!hasOldPathImages && frontmatter?.type === 'weekly-review') {
        const checkSection = (section: Record<string, unknown>): boolean => {
          if (section?.images && Array.isArray(section.images)) {
            return section.images.some(
              (img: unknown) =>
                typeof img === 'string' && img.startsWith(normalizedOldPath)
            );
          }
          return false;
        };

        const forecast = asRecord(frontmatter.forecast);
        if (forecast) {
          
          for (const key of Object.keys(forecast)) {
            const section = forecast[key];

            
            const sectionRecord = asRecord(section);
            if (key === 'customTimeframes' && sectionRecord) {
              hasOldPathImages = Object.values(sectionRecord).some((value) => {
                const record = asRecord(value);
                return record ? checkSection(record) : false;
              });
            } else {
              hasOldPathImages = sectionRecord
                ? checkSection(sectionRecord)
                : false;
            }

            if (hasOldPathImages) break;
          }
        }
      }

      if (hasOldPathImages) {
        filesWithImages.push(file);
      }
    }

    const total = filesWithImages.length;
    let current = 0;

    
    const BATCH_SIZE = 10;
    const BATCH_DELAY = 5; 

    for (let i = 0; i < filesWithImages.length; i += BATCH_SIZE) {
      const batch = filesWithImages.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (file) => {
          try {
            const cache = this.app.metadataCache.getFileCache(file);
            const frontmatter = cache?.frontmatter as
              | Record<string, unknown>
              | undefined;

            
            let hasTopLevelImages = false;
            let topLevelUpdatedImages: string[] = [];

            if (frontmatter?.images && Array.isArray(frontmatter.images)) {
              const result = this.updateImagesArray(
                frontmatter.images,
                normalizedOldPath,
                normalizedNewPath
              );
              if (result.hasChanges) {
                hasTopLevelImages = true;
                topLevelUpdatedImages = result.updated;
              }
            }

            const isDRC = frontmatter?.type === 'drc';
            const isWeekly = frontmatter?.type === 'weekly-review';

            
            let pathsUpdated = false;

            await this.app.fileManager.processFrontMatter(file, (fm) => {
              const fmRecord = asRecord(fm);
              if (!fmRecord) return;
              const isLegacyTradePath =
                file.path.startsWith(
                  `${this.tradeService.JOURNALIT_FOLDER}/`
                ) && isTradeIdentityEligibleNote(fmRecord, file.path);

              if (isLegacyTradePath) {
                ensureTradeIdentityFrontmatter(fmRecord);
              }

              
              if (hasTopLevelImages) {
                fmRecord.images = topLevelUpdatedImages;
                pathsUpdated = true;
              }

              const imagesByWidget = asRecord(fmRecord.imagesByWidget);
              if (imagesByWidget) {
                for (const [widgetId, images] of Object.entries(
                  imagesByWidget
                )) {
                  if (!Array.isArray(images)) continue;
                  const result = this.updateImagesArray(
                    images,
                    normalizedOldPath,
                    normalizedNewPath
                  );
                  if (result.hasChanges) {
                    imagesByWidget[widgetId] = result.updated;
                    pathsUpdated = true;
                  }
                }
              }

              
              if (isDRC) {
                let drcUpdated = false;
                const forecast = asRecord(fmRecord.forecast);
                if (forecast) {
                  for (const key of Object.keys(forecast)) {
                    if (
                      key === 'bias' ||
                      key === 'levels' ||
                      key === 'keyLevels'
                    ) {
                      continue;
                    }
                    const sectionRecord = asRecord(forecast[key]);
                    if (key === 'customTimeframes' && sectionRecord) {
                      for (const customKey of Object.keys(sectionRecord)) {
                        const customRecord = asRecord(sectionRecord[customKey]);
                        if (
                          customRecord &&
                          this.updateForecastSection(
                            customRecord,
                            normalizedOldPath,
                            normalizedNewPath
                          )
                        ) {
                          drcUpdated = true;
                        }
                      }
                    } else if (
                      sectionRecord &&
                      this.updateForecastSection(
                        sectionRecord,
                        normalizedOldPath,
                        normalizedNewPath
                      )
                    ) {
                      drcUpdated = true;
                    }
                  }
                }

                const endOfDayReview = asRecord(fmRecord.endOfDayReview);
                if (endOfDayReview) {
                  const result = this.updateImagesArray(
                    Array.isArray(endOfDayReview.images)
                      ? endOfDayReview.images
                      : undefined,
                    normalizedOldPath,
                    normalizedNewPath
                  );
                  if (result.hasChanges) {
                    endOfDayReview.images = result.updated;
                    drcUpdated = true;
                  }
                }

                for (const trade of asRecordArray(fmRecord.missedTrades)) {
                  const result = this.updateImagesArray(
                    Array.isArray(trade.images) ? trade.images : undefined,
                    normalizedOldPath,
                    normalizedNewPath
                  );
                  if (result.hasChanges) {
                    trade.images = result.updated;
                    drcUpdated = true;
                  }
                }

                if (drcUpdated) {
                  pathsUpdated = true;
                }
              }

              
              if (isWeekly) {
                let weeklyUpdated = false;
                const forecast = asRecord(fmRecord.forecast);
                if (forecast) {
                  for (const key of Object.keys(forecast)) {
                    const sectionRecord = asRecord(forecast[key]);
                    if (key === 'customTimeframes' && sectionRecord) {
                      for (const customKey of Object.keys(sectionRecord)) {
                        const customRecord = asRecord(sectionRecord[customKey]);
                        if (
                          customRecord &&
                          this.updateForecastSection(
                            customRecord,
                            normalizedOldPath,
                            normalizedNewPath
                          )
                        ) {
                          weeklyUpdated = true;
                        }
                      }
                    } else if (
                      sectionRecord &&
                      this.updateForecastSection(
                        sectionRecord,
                        normalizedOldPath,
                        normalizedNewPath
                      )
                    ) {
                      weeklyUpdated = true;
                    }
                  }
                }

                if (weeklyUpdated) {
                  pathsUpdated = true;
                }
              }
            });

            if (pathsUpdated) {
              stats.updated++;
            }

            stats.success++;
            current++;

            if (onProgress) {
              onProgress(current, total);
            }
          } catch (error) {
            stats.failed++;
            const errorMsg =
              error instanceof Error ? error.message : String(error);
            stats.errors.push(`${file.path}: ${errorMsg}`);
            current++;

            if (onProgress) {
              onProgress(current, total);
            }
          }
        })
      );

      
      if (i + BATCH_SIZE < filesWithImages.length) {
        await new Promise((resolve) => window.setTimeout(resolve, BATCH_DELAY));
      }
    }

    return stats;
  }

  
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  
  private transformImagePathWithQuarter(
    imagePath: string,
    journalFolderPath: string
  ): string | null {
    if (typeof imagePath !== 'string') return null;

    
    const normalizedBase = journalFolderPath.replace(/\/$/, '');

    
    
    
    const legacyPattern = new RegExp(
      `(.*?)(${this.escapeRegex(normalizedBase)})/(\\d{4})/(0[1-9]|1[0-2])/(.+)$`
    );

    const match = imagePath.match(legacyPattern);
    if (!match) {
      
      return null;
    }

    const [, prefix, basePath, year, month, rest] = match;

    const monthNum = parseInt(month, 10);
    const quarter = getQuarterForMonth(monthNum);
    const quarterStr = getQuarterString(quarter);

    
    return `${prefix}${basePath}/${year}/${quarterStr}/${month}/${rest}`;
  }

  
  private updateImagesArrayWithQuarter(
    images: string[] | undefined,
    journalFolderPath: string
  ): { updated: string[]; hasChanges: boolean } {
    if (!images || !Array.isArray(images)) {
      return { updated: [], hasChanges: false };
    }

    let hasChanges = false;
    const updated = images.map((img) => {
      if (typeof img !== 'string') return img;

      const transformed = this.transformImagePathWithQuarter(
        img,
        journalFolderPath
      );
      if (transformed) {
        hasChanges = true;
        return transformed;
      }
      return img;
    });

    return { updated, hasChanges };
  }

  
  private updateForecastSectionWithQuarter(
    section: unknown,
    journalFolderPath: string
  ): boolean {
    if (!section || typeof section !== 'object' || Array.isArray(section)) {
      return false;
    }
    const sectionRecord = asRecord(section);
    if (!sectionRecord) {
      return false;
    }

    let hasChanges = false;

    const images = Array.isArray(sectionRecord.images)
      ? sectionRecord.images.filter(
          (image): image is string => typeof image === 'string'
        )
      : undefined;
    if (images) {
      const result = this.updateImagesArrayWithQuarter(
        images,
        journalFolderPath
      );
      if (result.hasChanges) {
        sectionRecord.images = result.updated;
        hasChanges = true;
      }
    }

    return hasChanges;
  }

  
  private sectionNeedsQuarterlyUpdate(
    section: unknown,
    journalFolderPath: string
  ): boolean {
    if (!section || typeof section !== 'object' || Array.isArray(section)) {
      return false;
    }
    const sectionRecord = asRecord(section);
    if (!sectionRecord || !Array.isArray(sectionRecord.images)) {
      return false;
    }
    const images = sectionRecord.images;
    if (!Array.isArray(images)) {
      return false;
    }
    return images.some(
      (img: unknown) =>
        typeof img === 'string' &&
        this.transformImagePathWithQuarter(img, journalFolderPath) !== null
    );
  }

  
  async fixQuarterlyImagePaths(
    journalFolderPath: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<UpdateStats> {
    const stats: UpdateStats = {
      success: 0,
      failed: 0,
      updated: 0,
      errors: [],
    };

    
    const allFiles = this.app.vault.getMarkdownFiles();

    
    const filesNeedingUpdate: TFile[] = [];
    for (const file of allFiles) {
      const cache = this.app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter as
        | Record<string, unknown>
        | undefined;
      if (!frontmatter) continue;

      let needsUpdate = false;

      
      if (Array.isArray(frontmatter.images)) {
        needsUpdate = frontmatter.images.some(
          (img: unknown) =>
            typeof img === 'string' &&
            this.transformImagePathWithQuarter(img, journalFolderPath) !== null
        );
      }

      if (
        !needsUpdate &&
        frontmatter.imagesByWidget &&
        typeof frontmatter.imagesByWidget === 'object' &&
        !Array.isArray(frontmatter.imagesByWidget)
      ) {
        needsUpdate = Object.values(
          asRecord(frontmatter.imagesByWidget) ?? {}
        ).some(
          (images) =>
            Array.isArray(images) &&
            images.some(
              (img) =>
                typeof img === 'string' &&
                this.transformImagePathWithQuarter(img, journalFolderPath) !==
                  null
            )
        );
      }

      
      if (!needsUpdate && frontmatter.type === 'drc') {
        
        const forecast = asRecord(frontmatter.forecast);
        if (forecast) {
          for (const key of Object.keys(forecast)) {
            if (key === 'bias' || key === 'levels' || key === 'keyLevels')
              continue;

            const section = forecast[key];

            const sectionRecord = asRecord(section);
            if (key === 'customTimeframes' && sectionRecord) {
              needsUpdate = Object.values(sectionRecord).some((value) =>
                this.sectionNeedsQuarterlyUpdate(value, journalFolderPath)
              );
            } else {
              needsUpdate = this.sectionNeedsQuarterlyUpdate(
                sectionRecord,
                journalFolderPath
              );
            }

            if (needsUpdate) break;
          }
        }

        const endOfDayReview = asRecord(frontmatter.endOfDayReview);
        if (!needsUpdate && endOfDayReview) {
          needsUpdate = this.sectionNeedsQuarterlyUpdate(
            endOfDayReview,
            journalFolderPath
          );
        }

        if (!needsUpdate) {
          needsUpdate = asRecordArray(frontmatter.missedTrades).some((trade) =>
            this.sectionNeedsQuarterlyUpdate(trade, journalFolderPath)
          );
        }
      }

      
      if (!needsUpdate && frontmatter.type === 'weekly-review') {
        const forecast = asRecord(frontmatter.forecast);
        if (forecast) {
          for (const key of Object.keys(forecast)) {
            const section = forecast[key];

            const sectionRecord = asRecord(section);
            if (key === 'customTimeframes' && sectionRecord) {
              needsUpdate = Object.values(sectionRecord).some((value) =>
                this.sectionNeedsQuarterlyUpdate(value, journalFolderPath)
              );
            } else {
              needsUpdate = this.sectionNeedsQuarterlyUpdate(
                sectionRecord,
                journalFolderPath
              );
            }

            if (needsUpdate) break;
          }
        }
      }

      if (needsUpdate) {
        filesNeedingUpdate.push(file);
      }
    }

    const total = filesNeedingUpdate.length;
    let current = 0;

    
    const BATCH_SIZE = 10;
    const BATCH_DELAY = 5; 

    for (let i = 0; i < filesNeedingUpdate.length; i += BATCH_SIZE) {
      const batch = filesNeedingUpdate.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (file) => {
          try {
            let pathsUpdated = false;

            await this.app.fileManager.processFrontMatter(file, (fm) => {
              const fmRecord = asRecord(fm);
              if (!fmRecord) return;
              const isLegacyTradePath =
                file.path.startsWith(
                  `${this.tradeService.JOURNALIT_FOLDER}/`
                ) && isTradeIdentityEligibleNote(fmRecord, file.path);

              if (isLegacyTradePath) {
                ensureTradeIdentityFrontmatter(fmRecord);
              }

              if (Array.isArray(fmRecord.images)) {
                const result = this.updateImagesArrayWithQuarter(
                  fmRecord.images,
                  journalFolderPath
                );
                if (result.hasChanges) {
                  fmRecord.images = result.updated;
                  pathsUpdated = true;
                }
              }

              const imagesByWidget = asRecord(fmRecord.imagesByWidget);
              if (imagesByWidget) {
                for (const [widgetId, images] of Object.entries(
                  imagesByWidget
                )) {
                  if (!Array.isArray(images)) continue;
                  const result = this.updateImagesArrayWithQuarter(
                    images,
                    journalFolderPath
                  );
                  if (result.hasChanges) {
                    imagesByWidget[widgetId] = result.updated;
                    pathsUpdated = true;
                  }
                }
              }

              if (fmRecord.type === 'drc') {
                const forecast = asRecord(fmRecord.forecast);
                if (forecast) {
                  for (const key of Object.keys(forecast)) {
                    if (
                      key === 'bias' ||
                      key === 'levels' ||
                      key === 'keyLevels'
                    )
                      continue;
                    const sectionRecord = asRecord(forecast[key]);
                    if (key === 'customTimeframes' && sectionRecord) {
                      for (const customKey of Object.keys(sectionRecord)) {
                        const customRecord = asRecord(sectionRecord[customKey]);
                        if (
                          customRecord &&
                          this.updateForecastSectionWithQuarter(
                            customRecord,
                            journalFolderPath
                          )
                        ) {
                          pathsUpdated = true;
                        }
                      }
                    } else if (
                      sectionRecord &&
                      this.updateForecastSectionWithQuarter(
                        sectionRecord,
                        journalFolderPath
                      )
                    ) {
                      pathsUpdated = true;
                    }
                  }
                }

                const endOfDayReview = asRecord(fmRecord.endOfDayReview);
                if (endOfDayReview) {
                  const result = this.updateImagesArrayWithQuarter(
                    Array.isArray(endOfDayReview.images)
                      ? endOfDayReview.images
                      : undefined,
                    journalFolderPath
                  );
                  if (result.hasChanges) {
                    endOfDayReview.images = result.updated;
                    pathsUpdated = true;
                  }
                }

                for (const trade of asRecordArray(fmRecord.missedTrades)) {
                  const result = this.updateImagesArrayWithQuarter(
                    Array.isArray(trade.images) ? trade.images : undefined,
                    journalFolderPath
                  );
                  if (result.hasChanges) {
                    trade.images = result.updated;
                    pathsUpdated = true;
                  }
                }
              }

              if (fmRecord.type === 'weekly-review') {
                const forecast = asRecord(fmRecord.forecast);
                if (forecast) {
                  for (const key of Object.keys(forecast)) {
                    const sectionRecord = asRecord(forecast[key]);
                    if (key === 'customTimeframes' && sectionRecord) {
                      for (const customKey of Object.keys(sectionRecord)) {
                        const customRecord = asRecord(sectionRecord[customKey]);
                        if (
                          customRecord &&
                          this.updateForecastSectionWithQuarter(
                            customRecord,
                            journalFolderPath
                          )
                        ) {
                          pathsUpdated = true;
                        }
                      }
                    } else if (
                      sectionRecord &&
                      this.updateForecastSectionWithQuarter(
                        sectionRecord,
                        journalFolderPath
                      )
                    ) {
                      pathsUpdated = true;
                    }
                  }
                }
              }
            });

            if (pathsUpdated) {
              stats.updated++;
            }

            stats.success++;
            current++;

            if (onProgress) {
              onProgress(current, total);
            }
          } catch (error) {
            stats.failed++;
            const errorMsg =
              error instanceof Error ? error.message : String(error);
            stats.errors.push(`${file.path}: ${errorMsg}`);
            current++;

            if (onProgress) {
              onProgress(current, total);
            }
          }
        })
      );

      
      if (i + BATCH_SIZE < filesNeedingUpdate.length) {
        await new Promise((resolve) => window.setTimeout(resolve, BATCH_DELAY));
      }
    }

    return stats;
  }
}
