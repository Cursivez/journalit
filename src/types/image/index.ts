


interface ImageBaseProps {
  
  className?: string;
}


export interface ImageUploadProps extends ImageBaseProps {
  
  onImageUploaded: (path: string) => void | Promise<void>;

  
  onMultipleImagesUploaded?: (paths: string[]) => void | Promise<void>;

  
  onError?: (error: Error) => void;

  
  label?: string;

  
  enableDragDrop?: boolean;

  
  draggingOverClass?: string;

  
  inputId?: string;

  
  saveImageFunction?: (file: File) => Promise<string>;

  
  multiple?: boolean;

  
  enablePaste?: boolean;

  
  pasteContext?: {
    
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
      
      year?: number;
      
      accountId?: string;
      
      date?: string;
    };

    
    multiple?: boolean;
  };
}


export interface ImageCarouselProps extends ImageBaseProps {
  
  images: string[];

  
  altPrefix?: string;

  displayOptions?: {
    showThumbnails?: boolean;
    showCounter?: boolean;
    enableFullscreen?: boolean;
  };

  deleteOptions?: {
    enabled: boolean;
    onDeleteImage?: (index: number, path: string) => void | Promise<void>;
  };

  
  useResolveMediaPath?: boolean;

  
  sourcePath?: string;
}


export interface PasteEventData {
  
  files: File[];

  
  context: {
    element: Element;
    contextType: string;
    contextData?: Record<string, unknown>;
  };

  
  success: boolean;

  
  error?: string;
}


export interface ImageNavigationContext {
  
  images: string[];

  
  currentIndex: number;

  
  onNavigate: (index: number) => void;

  
  altPrefix?: string;

  
  useResolveMediaPath?: boolean;

  
  sourcePath?: string;
}


export interface ImageZoomState {
  
  isZoomed: boolean;

  
  scale: number;

  
  panOffset: {
    x: number;
    y: number;
  };

  
  isPanning: boolean;

  
  lastMousePos: {
    x: number;
    y: number;
  };

  
  initialPinchDistance: number | null;

  
  initialPinchScale: number;
}


export interface FullscreenImageViewerProps {
  
  imagePath: string;

  
  alt?: string;

  
  useResolveMediaPath?: boolean;

  
  sourcePath?: string;

  
  navigationContext?: ImageNavigationContext;

  
  onClose: () => void;
}

export {};
