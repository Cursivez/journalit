

import { Plugin } from 'obsidian';
import {
  DEFAULT_SCALPER_DEFAULTS,
  type JournalitSettings,
} from '../../settings/types';
import { TradeTemplate, TradeReviewSection } from '../../types/reviewV2';
import { generateUUID } from '../../utils/uuid';
import { eventBus } from '../events';


const DEFAULT_REVIEW_SECTIONS: TradeReviewSection[] = [
  {
    id: 'what-went-well',
    title: '**What went well?**',
    type: 'textarea',
    placeholder: 'What did you do right in this trade?',
  },
  {
    id: 'what-to-improve',
    title: '**What could be improved?**',
    type: 'textarea',
    placeholder: 'What would you do differently next time?',
  },
  {
    id: 'key-lesson',
    title: '**Key Lesson**',
    type: 'textarea',
    placeholder: 'What is the main takeaway from this trade?',
  },
];


const DEFAULT_WIN_SECTIONS: TradeReviewSection[] = [
  {
    id: 'win-what-worked',
    title: '**What worked?**',
    type: 'textarea',
    placeholder: 'What aspects of your strategy or execution led to this win?',
  },
  {
    id: 'win-repeatable',
    title: '**Is this repeatable?**',
    type: 'textarea',
    placeholder:
      'Can you consistently replicate what made this trade successful?',
  },
];


const DEFAULT_LOSS_SECTIONS: TradeReviewSection[] = [
  {
    id: 'loss-what-happened',
    title: '**What went wrong?**',
    type: 'textarea',
    placeholder:
      'What caused this loss? Was it execution, analysis, or market conditions?',
  },
  {
    id: 'loss-avoid-next-time',
    title: '**How to avoid next time?**',
    type: 'textarea',
    placeholder:
      'What specific changes will you make to prevent this type of loss?',
  },
  {
    id: 'loss-key-lesson',
    title: '**Key Lesson**',
    type: 'textarea',
    placeholder: 'What is the main takeaway from this loss?',
  },
];


interface JournalitPluginInstance extends Plugin {
  settings: JournalitSettings;
  saveSettings(): Promise<void>;
}


export class TradeTemplateService {
  private plugin: JournalitPluginInstance;
  private templates: TradeTemplate[] = [];

  
  constructor(plugin: JournalitPluginInstance) {
    this.plugin = plugin;
    this.loadTemplates();
  }

  
  private loadTemplates(): void {
    try {
      
      if (!this.plugin.settings.reviewV2) {
        this.plugin.settings.reviewV2 = {
          customWidgetTypes: [],
          templates: [],
          tradeTemplates: [],
          scalperDefaults: { ...DEFAULT_SCALPER_DEFAULTS },
        };
      }

      
      if (!this.plugin.settings.reviewV2.tradeTemplates) {
        this.plugin.settings.reviewV2.tradeTemplates = [];
      }

      
      const builtInTemplates = this.getBuiltInTemplates();

      
      const savedTemplates = this.plugin.settings.reviewV2.tradeTemplates || [];

      
      const builtInIds = new Set(builtInTemplates.map((t) => t.id));
      const userTemplates = savedTemplates.filter((t) => !builtInIds.has(t.id));

      this.templates = [...builtInTemplates, ...userTemplates];
    } catch (error) {
      console.error('Error loading trade templates:', error);
      this.templates = this.getBuiltInTemplates();
    }
  }

  
  private async saveTemplates(): Promise<void> {
    try {
      
      if (!this.plugin.settings.reviewV2) {
        this.plugin.settings.reviewV2 = {
          customWidgetTypes: [],
          templates: [],
          tradeTemplates: [],
          scalperDefaults: { ...DEFAULT_SCALPER_DEFAULTS },
        };
      }

      
      const userTemplates = this.templates.filter((t) => !t.isBuiltIn);

      
      this.plugin.settings.reviewV2.tradeTemplates = userTemplates;
      await this.plugin.saveSettings();

      
      eventBus.publish('trade-template:changed');
    } catch (error) {
      console.error('Error saving trade templates:', error);
      throw error;
    }
  }

  
  private getBuiltInTemplates(): TradeTemplate[] {
    const now = new Date().toISOString();

    return [
      
      {
        id: 'builtin-trade-standard',
        name: 'Standard Trade',
        type: 'trade',
        version: 1,
        createdAt: now,
        updatedAt: now,
        isBuiltIn: true,
        sections: {
          header: { show: true },
          navigation: { show: true },
          images: { show: true, position: 'top' },
          metadata: {
            show: true,
            showAccounts: true,
            showSetups: true,
            showMistakes: true,
            showTags: true,
          },
          details: {
            show: true,
            showThesis: true,
            metrics: ['entry', 'exit', 'size', 'duration', 'pnl', 'rMultiple'],
          },
          review: {
            show: 'always',
            showForMissed: false,
            showForBacktest: false,
            sections: DEFAULT_REVIEW_SECTIONS,
            winSections: DEFAULT_WIN_SECTIONS,
            lossSections: DEFAULT_LOSS_SECTIONS,
          },
          reviewButton: { show: true },
        },
        display: {
          pnlFormat: 'currency',
          showOpenBadge: true,
          showMissedBadge: true,
          showBacktestBadge: true,
        },
      },
    ];
  }

  
  public getTemplates(): TradeTemplate[] {
    return this.templates;
  }

  
  public getTemplate(id: string): TradeTemplate | undefined {
    return this.templates.find((t) => t.id === id);
  }

  
  public getDefaultTemplate(): TradeTemplate {
    
    const defaultTemplate = this.templates.find((t) => t.isBuiltIn);

    if (!defaultTemplate) {
      
      const now = new Date().toISOString();
      return {
        id: 'builtin-trade-standard',
        name: 'Standard Trade',
        type: 'trade',
        version: 1,
        createdAt: now,
        updatedAt: now,
        isBuiltIn: true,
        sections: {
          header: { show: true },
          navigation: { show: true },
          images: { show: true, position: 'top' },
          metadata: {
            show: true,
            showAccounts: true,
            showSetups: true,
            showMistakes: true,
            showTags: true,
          },
          details: {
            show: true,
            showThesis: true,
            metrics: ['entry', 'exit', 'size', 'duration', 'pnl', 'rMultiple'],
          },
          review: {
            show: 'always',
            showForMissed: false,
            showForBacktest: false,
            sections: DEFAULT_REVIEW_SECTIONS,
            winSections: DEFAULT_WIN_SECTIONS,
            lossSections: DEFAULT_LOSS_SECTIONS,
          },
          reviewButton: { show: true },
        },
        display: {
          pnlFormat: 'currency',
          showOpenBadge: true,
          showMissedBadge: true,
          showBacktestBadge: true,
        },
      };
    }

    return defaultTemplate;
  }

  
  public async hasLegacyNotes(): Promise<boolean> {
    const files = this.plugin.app.vault.getMarkdownFiles();

    for (const file of files) {
      const cache = this.plugin.app.metadataCache.getFileCache(file);
      const fm = cache?.frontmatter;

      if (!fm?.type || fm.templateId) continue;

      if (
        fm.type === 'trade' ||
        fm.type === 'backtest-trade' ||
        fm.type === 'missed-trade'
      ) {
        return true;
      }
    }

    return false;
  }

  
  public async createTemplate(
    template: Omit<TradeTemplate, 'id' | 'createdAt' | 'updatedAt' | 'version'>
  ): Promise<TradeTemplate> {
    const now = new Date().toISOString();
    const uniqueName = this.generateUniqueName(template.name);

    const newTemplate: TradeTemplate = {
      ...template,
      name: uniqueName,
      id: generateUUID(),
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.templates.push(newTemplate);
    await this.saveTemplates();

    return newTemplate;
  }

  
  public async updateTemplate(
    id: string,
    updates: Partial<TradeTemplate>
  ): Promise<TradeTemplate> {
    const templateIndex = this.templates.findIndex((t) => t.id === id);

    if (templateIndex === -1) {
      throw new Error(`Template not found: ${id}`);
    }

    const template = this.templates[templateIndex];

    if (template.isBuiltIn) {
      throw new Error(
        'Cannot modify built-in templates. Duplicate the template first.'
      );
    }

    
    const finalName = updates.name
      ? this.generateUniqueName(updates.name, id)
      : template.name;

    
    const updatedTemplate: TradeTemplate = {
      ...template,
      ...updates,
      name: finalName,
      id: template.id, 
      isBuiltIn: template.isBuiltIn, 
      createdAt: template.createdAt, 
      updatedAt: new Date().toISOString(),
      version: template.version + 1,
    };

    this.templates[templateIndex] = updatedTemplate;
    await this.saveTemplates();

    return updatedTemplate;
  }

  
  public async deleteTemplate(id: string): Promise<void> {
    const templateIndex = this.templates.findIndex((t) => t.id === id);

    if (templateIndex === -1) {
      throw new Error(`Template not found: ${id}`);
    }

    const template = this.templates[templateIndex];

    if (template.isBuiltIn) {
      throw new Error('Cannot delete built-in templates');
    }

    
    if (this.plugin.settings.templates?.defaultTrade === id) {
      
      this.plugin.settings.templates.defaultTrade = '';
      
      eventBus.publish('default-template:changed', {
        type: 'trade',
        value: null,
      });
    }

    this.templates.splice(templateIndex, 1);
    await this.saveTemplates();
  }

  
  public async duplicateTemplate(
    id: string,
    newName: string
  ): Promise<TradeTemplate> {
    const template = this.getTemplate(id);

    if (!template) {
      throw new Error(`Template not found: ${id}`);
    }

    const now = new Date().toISOString();
    const uniqueName = this.generateUniqueName(newName);

    const duplicatedTemplate: TradeTemplate = {
      ...template,
      id: generateUUID(),
      name: uniqueName,
      isBuiltIn: false, 
      version: 1, 
      createdAt: now,
      updatedAt: now,
      
      sections: structuredClone(template.sections),
      
      display: structuredClone(template.display),
    };

    this.templates.push(duplicatedTemplate);
    await this.saveTemplates();

    return duplicatedTemplate;
  }

  
  public getAllTemplates(): TradeTemplate[] {
    return [...this.templates];
  }

  
  public reload(): void {
    this.loadTemplates();
  }

  
  public generateUniqueName(baseName: string, excludeId?: string): string {
    const existingNames = this.templates.flatMap((template) =>
      template.id !== excludeId ? [template.name] : []
    );
    const existingNameSet = new Set(existingNames);

    if (!existingNameSet.has(baseName)) {
      return baseName;
    }

    let counter = 1;
    let uniqueName = `${baseName} (${counter})`;

    while (existingNameSet.has(uniqueName)) {
      counter++;
      uniqueName = `${baseName} (${counter})`;
    }

    return uniqueName;
  }
}
