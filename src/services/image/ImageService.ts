import { logger } from '../../utils/logger';


import { App, TFile, normalizePath } from 'obsidian';
import { getApp } from '../../utils/obsidian';

interface ImagePathComponents {
  year: string;
  month: string;
  weekOfMonth: string;
  formattedDate?: string;
}

const SUPPORTED_MEDIA_FILE_EXTENSION_PATTERN =
  /\.(jpg|jpeg|png|gif|bmp|webp|svg|mp4|webm|mov|m4v|ogv|ogg|3gp|mkv)$/i;

class ImageService {
  private _app: App | null = null;

  constructor(app?: App) {
    if (app) {
      this._app = app;
    }
  }

  public setApp(app: App): void {
    this._app = app;
  }

  private get app(): App {
    if (!this._app) {
      this._app = getApp();
    }
    return this._app;
  }

  
  public async saveImage(
    file: File,
    basePath: string,
    namePrefix: string,
    components?: ImagePathComponents
  ): Promise<string> {
    try {
      if (
        !file.type.startsWith('image/') &&
        !SUPPORTED_MEDIA_FILE_EXTENSION_PATTERN.test(file.name)
      ) {
        throw new Error(`Unsupported media file type: ${file.name}`);
      }

      
      const safeFileName = file?.name
        ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        : 'unnamed_file';
      const fileExt = safeFileName.substring(
        safeFileName.lastIndexOf('.') || safeFileName.length
      );

      
      const timestamp = Date.now();

      
      let fullPath: string;

      if (components) {
        
        const { year, month, weekOfMonth } = components;
        const folder = `${basePath}/${year}/${month}/${weekOfMonth}`;
        const fileName = `${namePrefix}-${timestamp}${fileExt}`;
        fullPath = `${folder}/${fileName}`;

        
        await this.app.vault.adapter.mkdir(normalizePath(folder));
      } else {
        
        const fileName = `${namePrefix}-${timestamp}${fileExt}`;
        fullPath = `${basePath}/${fileName}`;

        
        await this.app.vault.adapter.mkdir(normalizePath(basePath));
      }

      
      const arrayBuffer = await file.arrayBuffer();

      
      await this.app.vault.createBinary(normalizePath(fullPath), arrayBuffer);

      return fullPath;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }

  
  public async deleteImage(
    imagePath: string,
    cleanupEmptyFolders: boolean = true
  ): Promise<void> {
    try {
      if (!imagePath) {
        console.warn('No image path provided for deletion');
        return;
      }

      
      const imageFile = this.app.vault.getAbstractFileByPath(imagePath);

      if (!imageFile) {
        console.warn(`Image file not found: ${imagePath}`);
        return;
      }

      
      await this.app.fileManager.trashFile(imageFile);

      
      if (cleanupEmptyFolders) {
        const folderPath = imagePath.substring(0, imagePath.lastIndexOf('/'));
        await this.deleteEmptyFolder(folderPath);
      }
    } catch (error) {
      
      
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        Reflect.get(error, 'code') === 'ENOENT'
      ) {
        logger.debug(
          `Image file already deleted or doesn't exist: ${imagePath}`
        );
        return; 
      }

      console.error(`Error deleting image ${imagePath}:`, error);
      throw error;
    }
  }

  
  public async deleteEmptyFolder(
    folderPath: string,
    rootFolder: string = '!'
  ): Promise<void> {
    try {
      
      if (
        folderPath.startsWith(rootFolder) &&
        folderPath.split('/').length <= 1
      )
        return;

      
      const exists = await this.app.vault.adapter.exists(folderPath);
      if (!exists) return;

      
      const contents = await this.app.vault.adapter.list(folderPath);

      
      if (contents.files.length === 0 && contents.folders.length === 0) {
        
        const folder = this.app.vault.getAbstractFileByPath(folderPath);
        if (folder) {
          await this.app.fileManager.trashFile(folder);

          
          const parentPath = folderPath.substring(
            0,
            folderPath.lastIndexOf('/')
          );
          if (
            parentPath &&
            parentPath.length > 0 &&
            !parentPath.startsWith(rootFolder)
          ) {
            await this.deleteEmptyFolder(parentPath, rootFolder);
          }
        }
      }
    } catch (error) {
      console.error(`Error deleting empty folder ${folderPath}:`, error);
    }
  }

  
  public resolveMediaPath(imagePath: string): string {
    if (!imagePath) return '';

    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    
    if (imagePath.startsWith('data:')) {
      return imagePath;
    }

    try {
      
      const standardUrl = this.getResourceUrl(imagePath);
      if (
        standardUrl &&
        standardUrl !== imagePath &&
        !standardUrl.includes('app://obsidian.md')
      ) {
        return standardUrl;
      }

      
      let folderPathComponent = '';
      let fileName = '';

      
      const pathParts = imagePath.split('/');
      const mediaIndex = pathParts.findIndex(
        (part) => part === 'media' || part === 'attachments'
      );

      if (mediaIndex >= 0 && mediaIndex < pathParts.length - 1) {
        
        
        if (
          pathParts[mediaIndex] === 'attachments' &&
          pathParts.length > mediaIndex + 5
        ) {
          
          folderPathComponent = pathParts
            .slice(mediaIndex + 1, pathParts.length - 1)
            .join('/');
          fileName = pathParts[pathParts.length - 1];
        } else if (mediaIndex < pathParts.length - 2) {
          
          const folderName = pathParts[mediaIndex + 1];
          folderPathComponent = folderName;
          fileName = pathParts[pathParts.length - 1];
        }
      }

      
      if (folderPathComponent && fileName) {
        
        const possiblePaths = [
          
          imagePath.startsWith('!') ? imagePath.substring(1) : imagePath,

          
          imagePath,

          
          `attachments/${folderPathComponent}/${fileName}`,
          `${this.app.vault.getName()}/attachments/${folderPathComponent}/${fileName}`,

          
          `${this.app.vault.getName()}/${pathParts.slice(1).join('/')}`,
          `Journalit/${pathParts.slice(pathParts.indexOf('Journalit') + 1).join('/')}`,

          
          `${this.app.vault.getName()}/media/${folderPathComponent}/${fileName}`,

          
          `media/${folderPathComponent}/${fileName}`,
        ];

        
        for (const path of possiblePaths) {
          const file = this.app.vault.getAbstractFileByPath(path);
          if (file && file instanceof TFile) {
            const resourcePath = this.app.vault.getResourcePath(file);
            return resourcePath;
          }
        }
      }

      
      return standardUrl;
    } catch (error) {
      console.error('Error resolving media path:', error, imagePath);
      return this.getResourceUrl(imagePath);
    }
  }

  
  public getResourceUrl(imagePath: string | undefined): string {
    if (!imagePath) return '';

    try {
      
      
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }

      
      if (imagePath.startsWith('data:')) {
        return imagePath;
      }

      
      

      
      let file = this.app.vault.getAbstractFileByPath(imagePath);
      if (file && file instanceof TFile) {
        const resourcePath = this.app.vault.getResourcePath(file);
        return resourcePath;
      }

      
      if (imagePath.startsWith('!')) {
        const pathWithoutExclamation = imagePath.substring(1);

        file = this.app.vault.getAbstractFileByPath(pathWithoutExclamation);
        if (file && file instanceof TFile) {
          const resourcePath = this.app.vault.getResourcePath(file);
          return resourcePath;
        }
      }

      
      const mediaFolderPattern = /\/media\/([^/]+)\//;
      const mediaMatch = imagePath.match(mediaFolderPattern);

      if (mediaMatch) {
        
        const mediaFolder = mediaMatch[1];

        
        const yearMonthPattern = /(20\d{2})\/(\d{2})\/(W\d+)\//;
        const dateMatch = imagePath.match(yearMonthPattern);

        if (dateMatch) {
          const year = dateMatch[1];
          const month = dateMatch[2];
          const week = dateMatch[3];

          
          const alternativePaths = [
            `${year}/${month}/${week}/media/${mediaFolder}${imagePath.substring(imagePath.lastIndexOf('/'))}`,
          ];

          for (const altPath of alternativePaths) {
            file = this.app.vault.getAbstractFileByPath(altPath);
            if (file && file instanceof TFile) {
              const resourcePath = this.app.vault.getResourcePath(file);
              return resourcePath;
            }
          }
        }
      }

      
      try {
        const vaultName = this.app.vault.getName();
        if (vaultName) {
          
          const pathsToTry = [
            
            imagePath.startsWith('!')
              ? `${vaultName}/${imagePath.substring(1)}`
              : `${vaultName}/${imagePath}`,
            
            `${vaultName}/${imagePath}`,
          ];

          for (const pathToTry of pathsToTry) {
            file = this.app.vault.getAbstractFileByPath(pathToTry);
            if (file && file instanceof TFile) {
              const resourcePath = this.app.vault.getResourcePath(file);
              return resourcePath;
            }
          }
        }
      } catch {
        // intentional
      }

      
      
      if (imagePath.startsWith('!')) {
        
        const cleanPath = imagePath.substring(1); 
        return `app://obsidian.md/${cleanPath}`;
      }

      return `app://obsidian.md/${imagePath}`;
    } catch (error) {
      console.error('Error getting resource URL:', error);
      return imagePath || '';
    }
  }

  
  public getMediaFromDataTransfer(dataTransfer: DataTransfer): File[] {
    try {
      if (!dataTransfer.files || dataTransfer.files.length === 0) {
        return [];
      }

      
      const files = Array.from(dataTransfer.files);
      const imageFiles = files.filter(
        (file) =>
          file.type.startsWith('image/') ||
          SUPPORTED_MEDIA_FILE_EXTENSION_PATTERN.test(file.name)
      );

      return imageFiles;
    } catch (error) {
      console.error('Error extracting media from drop event:', error);
      return [];
    }
  }

  
  public getImagesFromDataTransfer(dataTransfer: DataTransfer): File[] {
    return this.getMediaFromDataTransfer(dataTransfer);
  }
}


export const imageService = new ImageService();
