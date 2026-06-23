

import { Notice } from 'obsidian';
import { t } from '../lang/helpers';
import { ErrorHandler, ErrorContext } from './errorHandler';
import { canReadClipboardItems, readClipboardItems } from './clipboard';


export interface PasteContext {
  
  contextType:
    | 'trade'
    | 'drc'
    | 'weekly'
    | 'monthly'
    | 'quarterly'
    | 'yearly'
    | 'account'
    | 'generic';

  
  contextData?: {
    
    ticker?: string;
    tradeNumber?: number;
    
    sectionName?: string;
    
    weekNumber?: number;
    
    monthNumber?: number;
    
    quarterNumber?: number;
    
    accountId?: string;
    
    date?: string;
  };

  
  basePath?: string;

  
  multiple?: boolean;
}


interface PasteResult {
  
  success: boolean;

  
  files: File[];

  
  error?: string;

  
  permissionDenied?: boolean;
}


export class PasteManager {
  
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024;

  
  private static readonly SUPPORTED_FORMATS = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/bmp',
    'image/webp',
  ];

  
  public static isClipboardSupported(): boolean {
    return typeof navigator !== 'undefined' && canReadClipboardItems();
  }

  
  public static async extractClipboardImages(): Promise<PasteResult> {
    if (!this.isClipboardSupported()) {
      const _context: ErrorContext = {
        operation: 'clipboard access',
        originalError: new Error(t('paste.error.clipboard-not-supported')),
      };
      return {
        success: false,
        files: [],
        error: ErrorHandler.getErrorMessage(
          new Error(t('paste.error.clipboard-not-supported')),
          _context
        ),
      };
    }

    try {
      
      const clipboardItems = await readClipboardItems();

      if (!clipboardItems || clipboardItems.length === 0) {
        return {
          success: false,
          files: [],
          error: t('paste.error.clipboard-empty'),
        };
      }

      const extractionTasks = clipboardItems.reduce<
        Array<Promise<File | null>>
      >((tasks, clipboardItem) => {
        const clipboardTypeSet = new Set(clipboardItem.types);
        for (const format of this.SUPPORTED_FORMATS) {
          if (!clipboardTypeSet.has(format)) continue;

          tasks.push(
            (async () => {
              try {
                const blob = await clipboardItem.getType(format);

                if (blob.size > this.MAX_FILE_SIZE) {
                  const context: ErrorContext = {
                    operation: 'image size validation',
                  };
                  const sizeError = new Error(
                    t('paste.error.file-size-exceeds', {
                      size: (blob.size / 1024 / 1024).toFixed(1),
                    })
                  );
                  ErrorHandler.showError(sizeError, context);
                  return null;
                }

                return new File([blob], this.generateFileName(format), {
                  type: format,
                  lastModified: Date.now(),
                });
              } catch (error: unknown) {
                console.error(
                  `Failed to extract ${format} from clipboard:`,
                  error
                );
                return null;
              }
            })()
          );
        }
        return tasks;
      }, []);
      const extractedFiles = (await Promise.all(extractionTasks)).filter(
        (file): file is File => file !== null
      );

      if (extractedFiles.length === 0) {
        return {
          success: false,
          files: [],
          error: t('paste.error.no-images-found'),
        };
      }

      return {
        success: true,
        files: extractedFiles,
      };
    } catch (error: unknown) {
      console.error('Failed to read clipboard:', error);

      
      if (
        error instanceof Error &&
        (error.name === 'NotAllowedError' ||
          error.message.includes('permission'))
      ) {
        const context: ErrorContext = {
          operation: 'clipboard permission request',
          originalError:
            error instanceof Error ? error : new Error(String(error)),
        };
        return {
          success: false,
          files: [],
          error: ErrorHandler.getErrorMessage(error, context),
          permissionDenied: true,
        };
      }

      const context: ErrorContext = {
        operation: 'clipboard access',
        originalError:
          error instanceof Error ? error : new Error(String(error)),
      };
      return {
        success: false,
        files: [],
        error: ErrorHandler.getErrorMessage(error, context),
      };
    }
  }

  
  public static generateContextualFileName(
    context: PasteContext,
    format: string,
    index: number = 0
  ): string {
    const timestamp = Date.now();
    const extension = this.getExtensionFromFormat(format);

    switch (context.contextType) {
      case 'trade':
        if (context.contextData?.ticker && context.contextData?.tradeNumber) {
          const suffix = index > 0 ? `-${index}` : '';
          return `${context.contextData.ticker}-clipboard-T${context.contextData.tradeNumber}${suffix}-${timestamp}${extension}`;
        }
        break;

      case 'drc':
        if (context.contextData?.sectionName) {
          const suffix = index > 0 ? `-${index}` : '';
          return `drc-${context.contextData.sectionName}-clipboard${suffix}-${timestamp}${extension}`;
        }
        break;

      case 'weekly':
        if (context.contextData?.weekNumber) {
          const suffix = index > 0 ? `-${index}` : '';
          return `weekly-W${context.contextData.weekNumber}-clipboard${suffix}-${timestamp}${extension}`;
        }
        break;

      case 'monthly':
        if (context.contextData?.monthNumber) {
          const suffix = index > 0 ? `-${index}` : '';
          return `monthly-${context.contextData.monthNumber}-clipboard${suffix}-${timestamp}${extension}`;
        }
        break;

      case 'quarterly':
        if (context.contextData?.quarterNumber) {
          const suffix = index > 0 ? `-${index}` : '';
          return `quarterly-Q${context.contextData.quarterNumber}-clipboard${suffix}-${timestamp}${extension}`;
        }
        break;

      case 'yearly':
        if (context.contextData?.date) {
          const year = new Date(context.contextData.date).getFullYear();
          const suffix = index > 0 ? `-${index}` : '';
          return `yearly-${year}-clipboard${suffix}-${timestamp}${extension}`;
        }
        break;

      case 'account':
        if (context.contextData?.accountId) {
          const suffix = index > 0 ? `-${index}` : '';
          return `account-${context.contextData.accountId}-clipboard${suffix}-${timestamp}${extension}`;
        }
        break;

      case 'generic':
      default: {
        const suffix = index > 0 ? `-${index}` : '';
        return `clipboard-image${suffix}-${timestamp}${extension}`;
      }
    }

    
    const suffix = index > 0 ? `-${index}` : '';
    return `clipboard-image${suffix}-${timestamp}${extension}`;
  }

  
  private static generateFileName(format: string): string {
    const timestamp = Date.now();
    const extension = this.getExtensionFromFormat(format);
    return `clipboard-image-${timestamp}${extension}`;
  }

  
  private static getExtensionFromFormat(format: string): string {
    switch (format) {
      case 'image/png':
        return '.png';
      case 'image/jpeg':
        return '.jpg';
      case 'image/gif':
        return '.gif';
      case 'image/bmp':
        return '.bmp';
      case 'image/webp':
        return '.webp';
      default:
        return '.png'; 
    }
  }

  
  public static findImageUploadContext(
    element: Element | null
  ): PasteContext | null {
    if (!element) return null;

    
    const uploadContainer = element.closest(
      '.journalit-image-upload, .shared-forecast-image, .trade-form-metadata'
    );

    if (!uploadContainer) return null;

    
    if (uploadContainer.classList.contains('trade-form-metadata')) {
      return {
        contextType: 'trade',
        multiple: true,
      };
    }

    if (uploadContainer.classList.contains('shared-forecast-image')) {
      
      const section = uploadContainer.closest('[data-section-name]');
      if (section) {
        const sectionName = section.getAttribute('data-section-name');
        return {
          contextType: 'drc', 
          contextData: { sectionName: sectionName || undefined },
          multiple: false,
        };
      }
    }

    
    return {
      contextType: 'generic',
      multiple: true,
    };
  }

  
  public static showPasteResult(
    result: PasteResult,
    filesProcessed: number = 0
  ): void {
    if (result.success && filesProcessed > 0) {
      const message =
        filesProcessed === 1
          ? t('paste.notice.image-pasted')
          : t('paste.notice.images-pasted', { count: String(filesProcessed) });
      new Notice(message);
    } else if (!result.success && result.error) {
      if (result.permissionDenied) {
        const context: ErrorContext = {
          operation: 'clipboard permission request',
        };
        ErrorHandler.showError(
          new Error(t('paste.error.permission-denied')),
          context
        );
      } else {
        const context: ErrorContext = {
          operation: 'paste operation',
        };
        ErrorHandler.showError(new Error(result.error), context);
      }
    }
  }

  
  public static createContextualFiles(
    files: File[],
    context: PasteContext
  ): File[] {
    return files.map((file, index) => {
      const contextualName = this.generateContextualFileName(
        context,
        file.type,
        index
      );

      
      return new File([file], contextualName, {
        type: file.type,
        lastModified: file.lastModified,
      });
    });
  }
}
