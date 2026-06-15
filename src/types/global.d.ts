import type { Hotkey } from 'obsidian';



declare global {
  interface Window {
    
    JOURNALIT_DEBUG_CHARTS?: boolean;

    
    JOURNALIT_DEBUG_I18N?: boolean;

    
    __journalitCalendarResizeObserver?: ResizeObserver;

    
    __obsidianStartTime?: number;

    
    __dropdownClickHandlerAdded?: boolean;

    
    __dropdownClickHandlerDocument?: Document;

    
    __isHandlingComboBoxRemove?: boolean;

    
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => number;

    
    cancelIdleCallback?: (handle: number) => void;

    
    __REACT_ERROR_OVERLAY__?: boolean;

    
    createRoot?: unknown;

    
    [key: string]: unknown; 
  }
}


declare module 'obsidian' {
  interface App {
    
    plugins?: {
      

      plugins: Record<string, unknown>;
      
      enablePlugin(id: string): Promise<void>;
      
      disablePlugin(id: string): Promise<void>;
    };

    
    notices?: {
      
      show(message: string, timeout?: number): void;
    };

    
    commands?: {
      
      executeCommandById(id: string): boolean;
    };

    
    setting?: {
      open(): void;
      openTabById(id: string): void;
    };

    
    hotkeyManager?: {
      getHotkeys?: (commandId: string) => Hotkey[] | undefined;
      setHotkeys?: (commandId: string, hotkeys: Hotkey[]) => void;
      save?: () => void;
      printHotkeyForCommand?: (commandId: string) => string;
    };
  }

  interface DataAdapter {
    
    basePath?: string;
  }
}

export {};
