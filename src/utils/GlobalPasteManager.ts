

import { PasteManager, PasteContext } from './PasteManager';
import { PasteEventData } from '../types/image';
import { ErrorHandler, ErrorContext } from './errorHandler';


interface PasteHandler {
  
  id: string;

  
  element: HTMLElement;

  
  context: PasteContext;

  
  handlePaste: (files: File[]) => Promise<void>;

  
  acceptsMultiple: boolean;
}


export class GlobalPasteManager {
  private static instance: GlobalPasteManager | null = null;

  
  private handlers: PasteHandler[] = [];

  
  private enabled: boolean = false;

  
  private globalPasteListener: ((e: ClipboardEvent) => void) | null = null;

  
  private lastMousePosition: { x: number; y: number } = { x: 0, y: 0 };

  
  private mouseMoveListener: ((e: MouseEvent) => void) | null = null;

  
  public static getInstance(): GlobalPasteManager {
    if (!this.instance) {
      this.instance = new GlobalPasteManager();
    }
    return this.instance;
  }

  
  public initialize(): void {
    if (this.enabled) return;

    this.enabled = true;

    
    this.globalPasteListener = (e: ClipboardEvent) => {
      this.handleGlobalPaste(e);
    };

    
    this.mouseMoveListener = (e: MouseEvent) => {
      this.lastMousePosition = { x: e.clientX, y: e.clientY };
    };

    
    document.addEventListener('paste', this.globalPasteListener, true);
    document.addEventListener('mousemove', this.mouseMoveListener, true);
  }

  
  public cleanup(): void {
    if (!this.enabled) return;

    this.enabled = false;

    
    if (this.globalPasteListener) {
      document.removeEventListener('paste', this.globalPasteListener, true);
      this.globalPasteListener = null;
    }

    if (this.mouseMoveListener) {
      document.removeEventListener('mousemove', this.mouseMoveListener, true);
      this.mouseMoveListener = null;
    }

    
    this.handlers = [];
  }

  
  public registerHandler(handler: PasteHandler): void {
    
    this.handlers = this.handlers.filter((h) => h.id !== handler.id);

    
    this.handlers.push(handler);
  }

  
  public unregisterHandler(id: string): void {
    this.handlers = this.handlers.filter((h) => h.id !== id);
  }

  
  private async handleGlobalPaste(e: ClipboardEvent): Promise<void> {
    
    if (!PasteManager.isClipboardSupported()) {
      return;
    }

    
    const activeElement = document.activeElement;

    
    if (
      this.isTextInput(activeElement) &&
      !this.isImageUploadArea(activeElement)
    ) {
      return;
    }

    
    const handler = this.findHandlerForContext(activeElement);

    if (!handler) {
      
      try {
        const result = await PasteManager.extractClipboardImages();
        if (result.success && result.files.length > 0) {
          
          const hasVisibleUploadAreas = this.handlers.some((h) => {
            const rect = h.element.getBoundingClientRect();
            return (
              rect.width > 0 &&
              rect.height > 0 &&
              window.getComputedStyle(h.element).visibility !== 'hidden' &&
              window.getComputedStyle(h.element).display !== 'none'
            );
          });

          if (!hasVisibleUploadAreas) {
            const context: ErrorContext = {
              operation: 'paste target detection',
            };
            const noTargetError = new Error('No image upload area available');
            ErrorHandler.showError(noTargetError, context);
          }
        }
      } catch (_error) {
        // intentional
      }
      return;
    }

    
    e.preventDefault();
    e.stopPropagation();

    try {
      
      const result = await PasteManager.extractClipboardImages();

      if (!result.success) {
        if (result.error && !result.error.includes('No images found')) {
          PasteManager.showPasteResult(result);
        }
        return;
      }

      
      const contextualFiles = PasteManager.createContextualFiles(
        result.files,
        handler.context
      );

      
      const filesToProcess = handler.acceptsMultiple
        ? contextualFiles
        : [contextualFiles[0]];

      
      await handler.handlePaste(filesToProcess);

      
      PasteManager.showPasteResult(result, filesToProcess.length);

      
      this.dispatchPasteEvent({
        files: filesToProcess,
        context: {
          element: handler.element,
          contextType: handler.context.contextType,
          contextData: handler.context.contextData,
        },
        success: true,
      });
    } catch (error) {
      console.error('Global paste handler error:', error);

      
      this.dispatchPasteEvent({
        files: [],
        context: {
          element: handler.element,
          contextType: handler.context.contextType,
          contextData: handler.context.contextData,
        },
        success: false,
        error: error.message,
      });

      const context: ErrorContext = {
        operation: 'global paste handling',
        originalError: error,
      };
      ErrorHandler.showError(error, context);
    }
  }

  
  private findHandlerForContext(
    activeElement: Element | null
  ): PasteHandler | null {
    
    if (activeElement) {
      for (const handler of this.handlers) {
        if (
          handler.element.contains(activeElement) ||
          handler.element === activeElement
        ) {
          return handler;
        }
      }

      
      const uploadArea = this.findNearbyImageUploadArea(activeElement);
      if (uploadArea) {
        return (
          this.handlers.find(
            (h) => h.element === uploadArea || h.element.contains(uploadArea)
          ) || null
        );
      }
    }

    
    const handlerUnderMouse = this.findHandlerUnderMouse();
    if (handlerUnderMouse) {
      return handlerUnderMouse;
    }

    
    const visibleHandlers = this.handlers.filter((handler) => {
      const element = handler.element;
      const rect = element.getBoundingClientRect();
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        window.getComputedStyle(element).visibility !== 'hidden' &&
        window.getComputedStyle(element).display !== 'none'
      );
    });

    
    if (visibleHandlers.length === 1) {
      return visibleHandlers[0];
    }

    
    const hoveredHandler = this.findHoveredHandler();
    if (hoveredHandler) {
      return hoveredHandler;
    }

    return null; 
  }

  
  private isTextInput(element: Element | null): boolean {
    if (!element) return false;

    const tagName = element.tagName.toLowerCase();
    const inputType = (element as HTMLInputElement).type?.toLowerCase();

    return (
      (tagName === 'input' &&
        ['text', 'email', 'password', 'search', 'url'].includes(inputType)) ||
      tagName === 'textarea' ||
      element.hasAttribute('contenteditable') ||
      element.classList.contains('cm-editor') 
    );
  }

  
  private isImageUploadArea(element: Element | null): boolean {
    if (!element) return false;

    return !!(
      element.closest('.journalit-image-upload') ||
      element.closest('.shared-forecast-image') ||
      element.closest('.trade-form-metadata') ||
      element.closest('[data-image-upload]')
    );
  }

  
  private findHandlerUnderMouse(): PasteHandler | null {
    const elementsAtPoint = document.elementsFromPoint(
      this.lastMousePosition.x,
      this.lastMousePosition.y
    );

    
    for (const element of elementsAtPoint) {
      for (const handler of this.handlers) {
        if (handler.element === element || handler.element.contains(element)) {
          return handler;
        }
      }
    }

    return null;
  }

  
  private findHoveredHandler(): PasteHandler | null {
    
    for (const handler of this.handlers) {
      const element = handler.element;
      const rect = element.getBoundingClientRect();

      
      if (rect.width > 0 && rect.height > 0) {
        const isUnderMouse =
          this.lastMousePosition.x >= rect.left &&
          this.lastMousePosition.x <= rect.right &&
          this.lastMousePosition.y >= rect.top &&
          this.lastMousePosition.y <= rect.bottom;

        if (isUnderMouse) {
          return handler;
        }
      }
    }

    return null;
  }

  
  private findNearbyImageUploadArea(
    element: Element | null
  ): HTMLElement | null {
    if (!element) return null;

    
    const container = element.closest(
      '.trade-form, .drc-note, .weekly-review, .account-note, .modal-content, .workspace-leaf-content'
    );
    if (container) {
      const uploadArea = container.querySelector(
        '.journalit-image-upload, .shared-forecast-image, .trade-form-metadata'
      );
      return uploadArea as HTMLElement;
    }

    return null; 
  }

  
  private dispatchPasteEvent(eventData: PasteEventData): void {
    const event = new CustomEvent('journalit:paste', {
      detail: eventData,
      bubbles: true,
      cancelable: false,
    });

    document.dispatchEvent(event);
  }

  
  public static createImageUploaderHandler(
    element: HTMLElement,
    context: PasteContext,
    handlePaste: (files: File[]) => Promise<void>,
    acceptsMultiple: boolean = true
  ): PasteHandler {
    return {
      id: `image-uploader-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      element,
      context,
      handlePaste,
      acceptsMultiple,
    };
  }

  
  public static isPasteSupported(): boolean {
    return PasteManager.isClipboardSupported();
  }

  
  public getDebugInfo(): object {
    return {
      enabled: this.enabled,
      handlerCount: this.handlers.length,
      handlers: this.handlers.map((h) => ({
        id: h.id,
        contextType: h.context.contextType,
        acceptsMultiple: h.acceptsMultiple,
      })),
    };
  }
}
