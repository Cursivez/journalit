

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

export class TradePathUpdateUtility {
  constructor(
    private app: App,
    private tradeService: TradeService
  ) {}

  
  public getImageBasePaths(file: TFile, targetPath: string): Set<string> {
    const basePaths = new Set<string>();
    const cache = this.app.metadataCache.getFileCache(file);
    const frontmatter = cache?.frontmatter;

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

    
    if (
      frontmatter.imagesByWidget &&
      typeof frontmatter.imagesByWidget === 'object' &&
      !Array.isArray(frontmatter.imagesByWidget)
    ) {
      const widgetImages = Object.values(
        frontmatter.imagesByWidget as Record<string, unknown>
      );
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
      
      if (frontmatter.forecast && typeof frontmatter.forecast === 'object') {
        for (const key of Object.keys(frontmatter.forecast)) {
          if (key === 'bias' || key === 'levels' || key === 'keyLevels') {
            continue;
          }

          const section = frontmatter.forecast[key];

          if (key === 'customTimeframes' && typeof section === 'object') {
            Object.values(section).forEach(checkSection);
          } else {
            checkSection(section);
          }
        }
      }

      
      if (frontmatter.endOfDayReview) {
        checkSection(frontmatter.endOfDayReview);
      }

      
      if (frontmatter.missedTrades && Array.isArray(frontmatter.missedTrades)) {
        frontmatter.missedTrades.forEach(checkSection);
      }
    }

    
    if (frontmatter.type === 'weekly-review') {
      if (frontmatter.forecast && typeof frontmatter.forecast === 'object') {
        for (const key of Object.keys(frontmatter.forecast)) {
          const section = frontmatter.forecast[key];

          if (key === 'customTimeframes' && typeof section === 'object') {
            Object.values(section).forEach(checkSection);
          } else {
            checkSection(section);
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
              const isLegacyTradePath =
                file.path.startsWith(
                  `${this.tradeService.JOURNALIT_FOLDER}/`
                ) && isTradeIdentityEligibleNote(fm, file.path);

              if (isLegacyTradePath) {
                ensureTradeIdentityFrontmatter(fm);
              }

              if (Array.isArray(fm.images)) {
                const result = this.updateImagesArrayForBasePaths(
                  fm.images,
                  normalizedOldPaths,
                  normalizedNewPath
                );
                if (result.hasChanges) {
                  fm.images = result.updated;
                  pathsUpdated = true;
                }
              }

              if (
                fm.imagesByWidget &&
                typeof fm.imagesByWidget === 'object' &&
                !Array.isArray(fm.imagesByWidget)
              ) {
                for (const [widgetId, images] of Object.entries(
                  fm.imagesByWidget as Record<string, unknown>
                )) {
                  if (!Array.isArray(images)) continue;
                  const result = this.updateImagesArrayForBasePaths(
                    images,
                    normalizedOldPaths,
                    normalizedNewPath
                  );
                  if (result.hasChanges) {
                    fm.imagesByWidget[widgetId] = result.updated;
                    pathsUpdated = true;
                  }
                }
              }

              if (fm.type === 'drc') {
                if (fm.forecast && typeof fm.forecast === 'object') {
                  for (const key of Object.keys(fm.forecast)) {
                    if (
                      key === 'bias' ||
                      key === 'levels' ||
                      key === 'keyLevels'
                    ) {
                      continue;
                    }

                    const section = fm.forecast[key];
                    if (
                      key === 'customTimeframes' &&
                      typeof section === 'object'
                    ) {
                      for (const customKey of Object.keys(section)) {
                        pathsUpdated =
                          this.updateForecastSectionForBasePaths(
                            section[customKey],
                            normalizedOldPaths,
                            normalizedNewPath
                          ) || pathsUpdated;
                      }
                    } else {
                      pathsUpdated =
                        this.updateForecastSectionForBasePaths(
                          section,
                          normalizedOldPaths,
                          normalizedNewPath
                        ) || pathsUpdated;
                    }
                  }
                }

                if (fm.endOfDayReview) {
                  pathsUpdated =
                    this.updateForecastSectionForBasePaths(
                      fm.endOfDayReview,
                      normalizedOldPaths,
                      normalizedNewPath
                    ) || pathsUpdated;
                }

                if (Array.isArray(fm.missedTrades)) {
                  for (const trade of fm.missedTrades) {
                    if (trade && typeof trade === 'object') {
                      pathsUpdated =
                        this.updateForecastSectionForBasePaths(
                          trade,
                          normalizedOldPaths,
                          normalizedNewPath
                        ) || pathsUpdated;
                    }
                  }
                }
              }

              if (
                fm.type === 'weekly-review' &&
                fm.forecast &&
                typeof fm.forecast === 'object'
              ) {
                for (const key of Object.keys(fm.forecast)) {
                  const section = fm.forecast[key];
                  if (
                    key === 'customTimeframes' &&
                    typeof section === 'object'
                  ) {
                    for (const customKey of Object.keys(section)) {
                      pathsUpdated =
                        this.updateForecastSectionForBasePaths(
                          section[customKey],
                          normalizedOldPaths,
                          normalizedNewPath
                        ) || pathsUpdated;
                    }
                  } else {
                    pathsUpdated =
                      this.updateForecastSectionForBasePaths(
                        section,
                        normalizedOldPaths,
                        normalizedNewPath
                      ) || pathsUpdated;
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
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
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
      const frontmatter = cache?.frontmatter;

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
          frontmatter.imagesByWidget as Record<string, unknown>
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

        if (frontmatter.forecast && typeof frontmatter.forecast === 'object') {
          
          for (const key of Object.keys(frontmatter.forecast)) {
            
            if (key === 'bias' || key === 'levels' || key === 'keyLevels') {
              continue;
            }

            const section = frontmatter.forecast[key];

            
            if (key === 'customTimeframes' && typeof section === 'object') {
              hasOldPathImages = Object.values(section).some(checkSection);
            } else {
              hasOldPathImages = checkSection(section);
            }

            if (hasOldPathImages) break;
          }
        }

        if (!hasOldPathImages && frontmatter.endOfDayReview) {
          hasOldPathImages = checkSection(frontmatter.endOfDayReview);
        }

        if (
          !hasOldPathImages &&
          frontmatter.missedTrades &&
          Array.isArray(frontmatter.missedTrades)
        ) {
          hasOldPathImages = frontmatter.missedTrades.some((trade: any) =>
            checkSection(trade)
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

        if (frontmatter.forecast && typeof frontmatter.forecast === 'object') {
          
          for (const key of Object.keys(frontmatter.forecast)) {
            const section = frontmatter.forecast[key];

            
            if (key === 'customTimeframes' && typeof section === 'object') {
              hasOldPathImages = Object.values(section).some(checkSection);
            } else {
              hasOldPathImages = checkSection(section);
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
            const frontmatter = cache?.frontmatter;

            
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
              const isLegacyTradePath =
                file.path.startsWith(
                  `${this.tradeService.JOURNALIT_FOLDER}/`
                ) && isTradeIdentityEligibleNote(fm, file.path);

              if (isLegacyTradePath) {
                ensureTradeIdentityFrontmatter(fm);
              }

              
              if (hasTopLevelImages) {
                fm.images = topLevelUpdatedImages;
                pathsUpdated = true;
              }

              if (
                fm.imagesByWidget &&
                typeof fm.imagesByWidget === 'object' &&
                !Array.isArray(fm.imagesByWidget)
              ) {
                for (const [widgetId, images] of Object.entries(
                  fm.imagesByWidget as Record<string, unknown>
                )) {
                  if (!Array.isArray(images)) continue;
                  const result = this.updateImagesArray(
                    images,
                    normalizedOldPath,
                    normalizedNewPath
                  );
                  if (result.hasChanges) {
                    fm.imagesByWidget[widgetId] = result.updated;
                    pathsUpdated = true;
                  }
                }
              }

              
              if (isDRC) {
                let drcUpdated = false;

                
                if (fm.forecast && typeof fm.forecast === 'object') {
                  for (const key of Object.keys(fm.forecast)) {
                    
                    if (
                      key === 'bias' ||
                      key === 'levels' ||
                      key === 'keyLevels'
                    ) {
                      continue;
                    }

                    const section = fm.forecast[key];

                    
                    if (
                      key === 'customTimeframes' &&
                      typeof section === 'object'
                    ) {
                      for (const customKey of Object.keys(section)) {
                        if (
                          this.updateForecastSection(
                            section[customKey],
                            normalizedOldPath,
                            normalizedNewPath
                          )
                        ) {
                          drcUpdated = true;
                        }
                      }
                    } else {
                      if (
                        this.updateForecastSection(
                          section,
                          normalizedOldPath,
                          normalizedNewPath
                        )
                      ) {
                        drcUpdated = true;
                      }
                    }
                  }
                }

                
                const endOfDayReview = fm.endOfDayReview;
                const endOfDayReviewImages = endOfDayReview?.images;
                if (endOfDayReviewImages) {
                  const result = this.updateImagesArray(
                    endOfDayReviewImages,
                    normalizedOldPath,
                    normalizedNewPath
                  );
                  if (result.hasChanges && endOfDayReview) {
                    endOfDayReview.images = result.updated;
                    drcUpdated = true;
                  }
                }

                
                if (fm.missedTrades && Array.isArray(fm.missedTrades)) {
                  for (const trade of fm.missedTrades) {
                    if (trade && typeof trade === 'object' && trade.images) {
                      const result = this.updateImagesArray(
                        trade.images,
                        normalizedOldPath,
                        normalizedNewPath
                      );
                      if (result.hasChanges) {
                        trade.images = result.updated;
                        drcUpdated = true;
                      }
                    }
                  }
                }

                if (drcUpdated) {
                  pathsUpdated = true;
                }
              }

              
              if (isWeekly) {
                let weeklyUpdated = false;

                
                if (fm.forecast && typeof fm.forecast === 'object') {
                  for (const key of Object.keys(fm.forecast)) {
                    const section = fm.forecast[key];

                    
                    if (
                      key === 'customTimeframes' &&
                      typeof section === 'object'
                    ) {
                      for (const customKey of Object.keys(section)) {
                        if (
                          this.updateForecastSection(
                            section[customKey],
                            normalizedOldPath,
                            normalizedNewPath
                          )
                        ) {
                          weeklyUpdated = true;
                        }
                      }
                    } else {
                      if (
                        this.updateForecastSection(
                          section,
                          normalizedOldPath,
                          normalizedNewPath
                        )
                      ) {
                        weeklyUpdated = true;
                      }
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
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
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
    section: any,
    journalFolderPath: string
  ): boolean {
    if (!section || typeof section !== 'object') {
      return false;
    }

    let hasChanges = false;

    if (section.images) {
      const result = this.updateImagesArrayWithQuarter(
        section.images,
        journalFolderPath
      );
      if (result.hasChanges) {
        section.images = result.updated;
        hasChanges = true;
      }
    }

    return hasChanges;
  }

  
  private sectionNeedsQuarterlyUpdate(
    section: any,
    journalFolderPath: string
  ): boolean {
    if (!section?.images || !Array.isArray(section.images)) {
      return false;
    }
    return section.images.some(
      (img: any) =>
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
      const frontmatter = cache?.frontmatter;
      if (!frontmatter) continue;

      let needsUpdate = false;

      
      if (frontmatter.images && Array.isArray(frontmatter.images)) {
        needsUpdate = frontmatter.images.some(
          (img: any) =>
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
          frontmatter.imagesByWidget as Record<string, unknown>
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
        
        if (frontmatter.forecast && typeof frontmatter.forecast === 'object') {
          for (const key of Object.keys(frontmatter.forecast)) {
            if (key === 'bias' || key === 'levels' || key === 'keyLevels')
              continue;

            const section = frontmatter.forecast[key];

            if (key === 'customTimeframes' && typeof section === 'object') {
              needsUpdate = Object.values(section).some((s) =>
                this.sectionNeedsQuarterlyUpdate(s, journalFolderPath)
              );
            } else {
              needsUpdate = this.sectionNeedsQuarterlyUpdate(
                section,
                journalFolderPath
              );
            }

            if (needsUpdate) break;
          }
        }

        if (!needsUpdate && frontmatter.endOfDayReview) {
          needsUpdate = this.sectionNeedsQuarterlyUpdate(
            frontmatter.endOfDayReview,
            journalFolderPath
          );
        }

        if (
          !needsUpdate &&
          frontmatter.missedTrades &&
          Array.isArray(frontmatter.missedTrades)
        ) {
          needsUpdate = frontmatter.missedTrades.some((trade: any) =>
            this.sectionNeedsQuarterlyUpdate(trade, journalFolderPath)
          );
        }
      }

      
      if (!needsUpdate && frontmatter.type === 'weekly-review') {
        if (frontmatter.forecast && typeof frontmatter.forecast === 'object') {
          for (const key of Object.keys(frontmatter.forecast)) {
            const section = frontmatter.forecast[key];

            if (key === 'customTimeframes' && typeof section === 'object') {
              needsUpdate = Object.values(section).some((s) =>
                this.sectionNeedsQuarterlyUpdate(s, journalFolderPath)
              );
            } else {
              needsUpdate = this.sectionNeedsQuarterlyUpdate(
                section,
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
              const isLegacyTradePath =
                file.path.startsWith(
                  `${this.tradeService.JOURNALIT_FOLDER}/`
                ) && isTradeIdentityEligibleNote(fm, file.path);

              if (isLegacyTradePath) {
                ensureTradeIdentityFrontmatter(fm);
              }

              
              if (fm.images && Array.isArray(fm.images)) {
                const result = this.updateImagesArrayWithQuarter(
                  fm.images,
                  journalFolderPath
                );
                if (result.hasChanges) {
                  fm.images = result.updated;
                  pathsUpdated = true;
                }
              }

              if (
                fm.imagesByWidget &&
                typeof fm.imagesByWidget === 'object' &&
                !Array.isArray(fm.imagesByWidget)
              ) {
                for (const [widgetId, images] of Object.entries(
                  fm.imagesByWidget as Record<string, unknown>
                )) {
                  if (!Array.isArray(images)) continue;
                  const result = this.updateImagesArrayWithQuarter(
                    images,
                    journalFolderPath
                  );
                  if (result.hasChanges) {
                    fm.imagesByWidget[widgetId] = result.updated;
                    pathsUpdated = true;
                  }
                }
              }

              
              if (fm.type === 'drc') {
                
                if (fm.forecast && typeof fm.forecast === 'object') {
                  for (const key of Object.keys(fm.forecast)) {
                    if (
                      key === 'bias' ||
                      key === 'levels' ||
                      key === 'keyLevels'
                    )
                      continue;

                    const section = fm.forecast[key];

                    if (
                      key === 'customTimeframes' &&
                      typeof section === 'object'
                    ) {
                      for (const customKey of Object.keys(section)) {
                        if (
                          this.updateForecastSectionWithQuarter(
                            section[customKey],
                            journalFolderPath
                          )
                        ) {
                          pathsUpdated = true;
                        }
                      }
                    } else {
                      if (
                        this.updateForecastSectionWithQuarter(
                          section,
                          journalFolderPath
                        )
                      ) {
                        pathsUpdated = true;
                      }
                    }
                  }
                }

                
                const endOfDayReview = fm.endOfDayReview;
                const endOfDayReviewImages = endOfDayReview?.images;
                if (endOfDayReviewImages) {
                  const result = this.updateImagesArrayWithQuarter(
                    endOfDayReviewImages,
                    journalFolderPath
                  );
                  if (result.hasChanges && endOfDayReview) {
                    endOfDayReview.images = result.updated;
                    pathsUpdated = true;
                  }
                }

                
                if (fm.missedTrades && Array.isArray(fm.missedTrades)) {
                  for (const trade of fm.missedTrades) {
                    if (trade?.images) {
                      const result = this.updateImagesArrayWithQuarter(
                        trade.images,
                        journalFolderPath
                      );
                      if (result.hasChanges) {
                        trade.images = result.updated;
                        pathsUpdated = true;
                      }
                    }
                  }
                }
              }

              
              if (fm.type === 'weekly-review') {
                if (fm.forecast && typeof fm.forecast === 'object') {
                  for (const key of Object.keys(fm.forecast)) {
                    const section = fm.forecast[key];

                    if (
                      key === 'customTimeframes' &&
                      typeof section === 'object'
                    ) {
                      for (const customKey of Object.keys(section)) {
                        if (
                          this.updateForecastSectionWithQuarter(
                            section[customKey],
                            journalFolderPath
                          )
                        ) {
                          pathsUpdated = true;
                        }
                      }
                    } else {
                      if (
                        this.updateForecastSectionWithQuarter(
                          section,
                          journalFolderPath
                        )
                      ) {
                        pathsUpdated = true;
                      }
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
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
      }
    }

    return stats;
  }
}
