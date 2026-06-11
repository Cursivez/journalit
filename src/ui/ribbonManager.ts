

import { Notice } from 'obsidian';
import type JournalitPlugin from '../main';
import { t } from '../lang/helpers';


export class RibbonManager {
  private plugin: JournalitPlugin;

  constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
  }

  
  public registerRibbonIcons(): void {
    this.registerHomeRibbon();
  }

  
  private registerHomeRibbon(): void {
    
    this.plugin.addRibbonIcon(
      'circle-dot-dashed', 
      t('ribbon.open-journalit'),
      async () => {
        try {
          
          await this.plugin.viewManager.openHomeView();
        } catch (error) {
          console.error(
            '[Journalit] Failed to open home view from ribbon:',
            error
          );
          
          new Notice(t('notice.error.open-journalit'));
        }
      }
    );
  }
}
