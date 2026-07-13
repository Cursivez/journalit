

import { Plugin } from 'obsidian';
import { t } from '../../lang/helpers';
import {
  DEFAULT_SCALPER_DEFAULTS,
  type JournalitSettings,
  type TemplatesSettings,
} from '../../settings/types';
import { ReviewTemplate, ReviewTemplateType } from '../../types/reviewV2';
import { generateUUID } from '../../utils/uuid';
import { eventBus } from '../events';


interface JournalitPluginInstance extends Plugin {
  settings: JournalitSettings;
  saveSettings(): Promise<void>;
}


export class ReviewTemplateService {
  private plugin: JournalitPluginInstance;
  private templates: ReviewTemplate[] = [];

  
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

      
      if (!this.plugin.settings.reviewV2.templates) {
        this.plugin.settings.reviewV2.templates = [];
      }

      
      const builtInTemplates = this.getBuiltInTemplates();

      
      const savedTemplates = this.plugin.settings.reviewV2.templates || [];

      
      const builtInIds = new Set(builtInTemplates.map((t) => t.id));
      const userTemplates = savedTemplates.filter((t) => !builtInIds.has(t.id));

      this.templates = [...builtInTemplates, ...userTemplates];
    } catch (error) {
      console.error('Error loading review templates:', error);
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

      
      this.plugin.settings.reviewV2.templates = userTemplates;
      await this.plugin.saveSettings();

      
      eventBus.publish('review-template:changed');
    } catch (error) {
      console.error('Error saving review templates:', error);
      throw error;
    }
  }

  
  private getBuiltInTemplates(): ReviewTemplate[] {
    const now = new Date().toISOString();

    return [
      
      {
        id: 'builtin-drc-standard',
        name: 'Standard DRC',
        type: 'drc',
        version: 5,
        createdAt: now,
        updatedAt: now,
        isBuiltIn: true,
        widgets: [
          
          { type: 'header', locked: true },
          
          { type: 'goals', config: { style: 'checkbox' } },
          { type: 'checklist' },
          
          {
            type: 'markdown-header',
            config: { level: 2, text: t('template.section.forecast') },
          },
          { type: 'images', id: 'forecast-images' },
          { type: 'markdown-zone', id: 'forecast-notes' },
          
          {
            type: 'markdown-header',
            config: { level: 2, text: t('template.section.performance') },
          },
          { type: 'pnl-chart' },
          { type: 'drawdown-chart' },
          { type: 'stats' },
          { type: 'trades' },
          { type: 'trade-review' },
          { type: 'markdown-zone', id: 'trade-notes' },
          
          {
            type: 'markdown-header',
            config: { level: 2, text: t('template.section.review') },
          },
          { type: 'review' },
          { type: 'missed-trades' },
          
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.drc.q1') },
          },
          { type: 'markdown-zone', id: 'review-q1' },
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.drc.q2') },
          },
          { type: 'markdown-zone', id: 'review-q2' },
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.drc.q3') },
          },
          { type: 'markdown-zone', id: 'review-q3' },
          { type: 'images', id: 'eod-images' },
          { type: 'mark-reviewed' },
        ],
      },

      
      {
        id: 'builtin-weekly-standard',
        name: 'Standard Weekly',
        type: 'weekly',
        version: 5,
        createdAt: now,
        updatedAt: now,
        isBuiltIn: true,
        widgets: [
          
          { type: 'header', locked: true },
          
          { type: 'goals' },
          { type: 'checklist' },
          { type: 'key-events' },
          
          {
            type: 'markdown-header',
            config: { level: 2, text: t('template.section.forecast') },
          },
          { type: 'images', id: 'forecast-images' },
          { type: 'markdown-zone', id: 'forecast-notes' },
          
          {
            type: 'markdown-header',
            config: { level: 2, text: t('template.section.performance') },
          },
          { type: 'pnl-chart' },
          { type: 'drawdown-chart' },
          { type: 'stats' },
          { type: 'setup-performance' },
          { type: 'best-worst', config: { period: 'trades' } },
          { type: 'breakdown', config: { period: 'daily' } },
          { type: 'markdown-zone', id: 'analysis-notes' },
          
          {
            type: 'markdown-header',
            config: { level: 2, text: t('template.section.review') },
          },
          { type: 'review' },
          
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.weekly.q1') },
          },
          { type: 'markdown-zone', id: 'review-q1' },
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.weekly.q2') },
          },
          { type: 'markdown-zone', id: 'review-q2' },
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.weekly.q3') },
          },
          { type: 'markdown-zone', id: 'review-q3' },
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.weekly.q4') },
          },
          { type: 'markdown-zone', id: 'review-q4' },
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.weekly.q5') },
          },
          { type: 'markdown-zone', id: 'review-q5' },
          { type: 'mark-reviewed' },
        ],
      },

      
      {
        id: 'builtin-monthly-standard',
        name: 'Standard Monthly',
        type: 'monthly',
        version: 3,
        createdAt: now,
        updatedAt: now,
        isBuiltIn: true,
        widgets: [
          
          { type: 'header', locked: true },
          
          {
            type: 'markdown-header',
            config: { level: 2, text: t('template.section.performance') },
          },
          { type: 'pnl-chart' },
          { type: 'drawdown-chart' },
          { type: 'stats' },
          { type: 'setup-performance' },
          { type: 'best-worst', config: { period: 'trades' } },
          { type: 'best-worst', config: { period: 'weeks' } },
          { type: 'breakdown', config: { period: 'weekly' } },
          { type: 'markdown-zone', id: 'analysis-notes' },
          
          {
            type: 'markdown-header',
            config: { level: 2, text: t('template.section.review') },
          },
          { type: 'demon-tracker' },
          { type: 'mental-game' },
          { type: 'technical-game' },
          
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.monthly.q1') },
          },
          { type: 'markdown-zone', id: 'review-q1' },
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.monthly.q2') },
          },
          { type: 'markdown-zone', id: 'review-q2' },
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.monthly.q3') },
          },
          { type: 'markdown-zone', id: 'review-q3' },
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.monthly.q4') },
          },
          { type: 'markdown-zone', id: 'review-q4' },
          {
            type: 'markdown-header',
            config: { level: 3, text: t('template.question.monthly.q5') },
          },
          { type: 'markdown-zone', id: 'review-q5' },
          { type: 'mark-reviewed' },
        ],
      },

      
      {
        id: 'builtin-quarterly-standard',
        name: 'Standard Quarterly',
        type: 'quarterly',
        version: 1,
        createdAt: now,
        updatedAt: now,
        isBuiltIn: true,
        widgets: [
          { type: 'header', locked: true },
          { type: 'stats' },
          { type: 'pnl-chart' },
          { type: 'drawdown-chart' },
          { type: 'trades-chart', config: { period: 'monthly' } },
          { type: 'breakdown', config: { period: 'monthly' } },
          { type: 'setup-performance' },
          { type: 'best-worst', config: { period: 'months' } },
          { type: 'markdown-zone', id: 'analysis-notes' },
          { type: 'review' },
        ],
      },

      
      {
        id: 'builtin-yearly-standard',
        name: 'Standard Yearly',
        type: 'yearly',
        version: 1,
        createdAt: now,
        updatedAt: now,
        isBuiltIn: true,
        widgets: [
          { type: 'header', locked: true },
          { type: 'stats' },
          { type: 'pnl-chart' },
          { type: 'drawdown-chart' },
          { type: 'trades-chart', config: { period: 'quarterly' } },
          { type: 'breakdown', config: { period: 'quarterly' } },
          { type: 'setup-performance' },
          { type: 'best-worst', config: { period: 'quarters' } },
          { type: 'markdown-zone', id: 'analysis-notes' },
          { type: 'review' },
        ],
      },

      
      {
        id: 'builtin-yearly-detailed',
        name: 'Detailed Yearly',
        type: 'yearly',
        version: 1,
        createdAt: now,
        updatedAt: now,
        isBuiltIn: true,
        widgets: [
          { type: 'header', locked: true },

          
          { type: 'markdown-header', config: { level: 2, text: 'Overview' } },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: "What are the things you're most proud about?",
            },
          },
          { type: 'markdown-zone', id: 'proud-of' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'What were the three biggest challenges you overcame successfully?',
            },
          },
          { type: 'markdown-zone', id: 'challenges-overcome' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'What tools did you use to overcome these challenges?',
            },
          },
          { type: 'markdown-zone', id: 'tools-used' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'What were the areas in which you failed to show your full potential?',
            },
          },
          { type: 'markdown-zone', id: 'areas-fell-short' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'What practical steps will you take to minimize this gap?',
            },
          },
          { type: 'markdown-zone', id: 'steps-to-improve' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'Three things to reinforce & Three areas of improvement',
            },
          },
          { type: 'markdown-zone', id: 'reinforce-improve' },

          
          { type: 'markdown-header', config: { level: 2, text: 'Goals' } },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'If you had goals for this year, did you achieve them? How challenging were they?',
            },
          },
          { type: 'markdown-zone', id: 'goals-achieved' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'If you failed to meet your goals, explain why.',
            },
          },
          { type: 'markdown-zone', id: 'goals-failed-why' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: "Did this year prove everything I've got, or did I leave potential untapped?",
            },
          },
          { type: 'markdown-zone', id: 'potential-untapped' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: "How can I remove the gap between what I delivered and what I'm capable of delivering next year?",
            },
          },
          { type: 'markdown-zone', id: 'close-gap' },

          
          {
            type: 'markdown-header',
            config: { level: 2, text: 'Profit & Loss' },
          },
          { type: 'stats' },
          { type: 'pnl-chart' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'Did you make a net profit this year? (Net of any expenses)',
            },
          },
          { type: 'markdown-zone', id: 'net-profit' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'If you failed to make a profit, what do you believe is the single biggest reason why?',
            },
          },
          { type: 'markdown-zone', id: 'biggest-reason-loss' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'Is there any way you can reduce costs to improve your bottom line?',
            },
          },
          { type: 'markdown-zone', id: 'reduce-costs' },

          
          {
            type: 'markdown-header',
            config: { level: 2, text: 'Performance' },
          },
          { type: 'drawdown-chart' },
          { type: 'trades-chart', config: { period: 'quarterly' } },
          { type: 'breakdown', config: { period: 'quarterly' } },
          { type: 'best-worst', config: { period: 'quarters' } },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'What was your biggest win streak of the year?',
            },
          },
          { type: 'markdown-zone', id: 'biggest-win-streak' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'Review the trade that broke the win streak. Did you find anything interesting?',
            },
          },
          { type: 'markdown-zone', id: 'win-streak-breaker' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'What was your biggest drawdown of the year?',
            },
          },
          { type: 'markdown-zone', id: 'biggest-drawdown' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'Review the trade that broke the losing streak. Did you find anything interesting?',
            },
          },
          { type: 'markdown-zone', id: 'lose-streak-breaker' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'When you review your trades from this year, did you find any consistently recurring issues?',
            },
          },
          { type: 'markdown-zone', id: 'recurring-issues' },

          
          { type: 'markdown-header', config: { level: 2, text: 'Consider' } },
          { type: 'setup-performance' },
          { type: 'directional-pnl' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: "Was there a type of trade that did/didn't work well?",
            },
          },
          { type: 'markdown-zone', id: 'trade-type-performance' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: "Was there a particular ticker that you did/didn't trade well?",
            },
          },
          { type: 'markdown-zone', id: 'ticker-performance' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: "Was there a particular day/time that you did/didn't trade well?",
            },
          },
          { type: 'markdown-zone', id: 'time-performance' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'Did you enter trades too soon/too late?',
            },
          },
          { type: 'markdown-zone', id: 'entry-timing' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'Did you take profit too soon/too late?',
            },
          },
          { type: 'markdown-zone', id: 'exit-timing' },

          {
            type: 'markdown-header',
            config: { level: 3, text: 'Were your stops too loose/too tight?' },
          },
          { type: 'markdown-zone', id: 'stop-placement' },

          {
            type: 'markdown-header',
            config: { level: 3, text: 'Did you take poor risk/reward trades?' },
          },
          { type: 'markdown-zone', id: 'risk-reward' },

          {
            type: 'markdown-header',
            config: { level: 3, text: 'Did you risk too much/too little?' },
          },
          { type: 'markdown-zone', id: 'position-sizing' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'Did you miss any trades? How did this affect your bottom line?',
            },
          },
          { type: 'markdown-zone', id: 'missed-trades' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'Did you deviate from your plan? If so, why? What was the outcome?',
            },
          },
          { type: 'markdown-zone', id: 'plan-deviation' },

          
          {
            type: 'markdown-header',
            config: { level: 2, text: 'Recurring Problems' },
          },
          { type: 'demon-tracker' },

          { type: 'markdown-header', config: { level: 3, text: 'Problem 1' } },
          {
            type: 'markdown-header',
            config: { level: 4, text: 'What is the problem?' },
          },
          { type: 'markdown-zone', id: 'problem1-what' },
          {
            type: 'markdown-header',
            config: { level: 4, text: 'Why do I have this problem?' },
          },
          { type: 'markdown-zone', id: 'problem1-why' },
          {
            type: 'markdown-header',
            config: { level: 4, text: 'What is the solution?' },
          },
          { type: 'markdown-zone', id: 'problem1-solution' },
          {
            type: 'markdown-header',
            config: { level: 4, text: 'How can I implement it?' },
          },
          { type: 'markdown-zone', id: 'problem1-implement' },

          { type: 'markdown-header', config: { level: 3, text: 'Problem 2' } },
          {
            type: 'markdown-header',
            config: { level: 4, text: 'What is the problem?' },
          },
          { type: 'markdown-zone', id: 'problem2-what' },
          {
            type: 'markdown-header',
            config: { level: 4, text: 'Why do I have this problem?' },
          },
          { type: 'markdown-zone', id: 'problem2-why' },
          {
            type: 'markdown-header',
            config: { level: 4, text: 'What is the solution?' },
          },
          { type: 'markdown-zone', id: 'problem2-solution' },
          {
            type: 'markdown-header',
            config: { level: 4, text: 'How can I implement it?' },
          },
          { type: 'markdown-zone', id: 'problem2-implement' },

          { type: 'markdown-header', config: { level: 3, text: 'Problem 3' } },
          {
            type: 'markdown-header',
            config: { level: 4, text: 'What is the problem?' },
          },
          { type: 'markdown-zone', id: 'problem3-what' },
          {
            type: 'markdown-header',
            config: { level: 4, text: 'Why do I have this problem?' },
          },
          { type: 'markdown-zone', id: 'problem3-why' },
          {
            type: 'markdown-header',
            config: { level: 4, text: 'What is the solution?' },
          },
          { type: 'markdown-zone', id: 'problem3-solution' },
          {
            type: 'markdown-header',
            config: { level: 4, text: 'How can I implement it?' },
          },
          { type: 'markdown-zone', id: 'problem3-implement' },

          
          {
            type: 'markdown-header',
            config: { level: 2, text: 'Recurring Positives' },
          },
          {
            type: 'best-worst',
            config: { period: 'trades', showWorst: false },
          },

          {
            type: 'markdown-header',
            config: { level: 3, text: 'How can I do more of what worked?' },
          },
          { type: 'markdown-zone', id: 'do-more-of' },

          
          {
            type: 'markdown-header',
            config: { level: 2, text: 'Process & Habits' },
          },
          { type: 'mental-game' },
          { type: 'technical-game' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'Have you kept to a routine that keeps you present and focused during key trading hours?',
            },
          },
          { type: 'markdown-zone', id: 'routine-focus' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: "Are there processes you feel would improve your performance, but you aren't actively implementing them?",
            },
          },
          { type: 'markdown-zone', id: 'unimplemented-processes' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'Are there habits you feel are detrimental to your performance, yet you still engage in them anyway?',
            },
          },
          { type: 'markdown-zone', id: 'bad-habits' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'What distractions caused you to miss the most opportunities for trading this year?',
            },
          },
          { type: 'markdown-zone', id: 'distractions' },

          
          {
            type: 'markdown-header',
            config: { level: 2, text: 'Goal Setting & Personal Development' },
          },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: 'If you could rewind this year, what advice would you give yourself knowing what you know now?',
            },
          },
          { type: 'markdown-zone', id: 'advice-to-past-self' },

          {
            type: 'markdown-header',
            config: { level: 3, text: 'What are your goals for next year?' },
          },
          { type: 'markdown-zone', id: 'next-year-goals' },

          {
            type: 'markdown-header',
            config: {
              level: 3,
              text: "What processes will be put in place to ensure you meet next year's goals?",
            },
          },
          { type: 'markdown-zone', id: 'goal-processes' },

          
          {
            type: 'markdown-header',
            config: { level: 2, text: 'Final Notes' },
          },
          { type: 'markdown-zone', id: 'final-notes' },

          { type: 'review' },
          { type: 'mark-reviewed' },
        ],
      },
    ];
  }

  
  public getTemplates(type: ReviewTemplateType): ReviewTemplate[] {
    return this.templates.filter((t) => t.type === type);
  }

  
  public getTemplate(id: string): ReviewTemplate | undefined {
    return this.templates.find((t) => t.id === id);
  }

  
  public getDefaultTemplate(type: ReviewTemplateType): ReviewTemplate {
    
    const settingsKeyByType: Record<
      ReviewTemplateType,
      keyof TemplatesSettings
    > = {
      drc: 'defaultDrc',
      weekly: 'defaultWeekly',
      monthly: 'defaultMonthly',
      quarterly: 'defaultQuarterly',
      yearly: 'defaultYearly',
    };
    const settingsKey = settingsKeyByType[type];

    const userDefaultId = this.plugin.settings.templates?.[settingsKey];

    
    if (userDefaultId) {
      const userDefault = this.templates.find(
        (t) => t.id === userDefaultId && t.type === type
      );
      if (userDefault) {
        return userDefault;
      }
    }

    
    const defaultTemplate = this.templates.find(
      (t) => t.type === type && t.isBuiltIn
    );

    if (!defaultTemplate) {
      
      const now = new Date().toISOString();
      return {
        id: `builtin-${type}-minimal`,
        name: `Minimal ${type.toUpperCase()}`,
        type,
        version: 1,
        createdAt: now,
        updatedAt: now,
        isBuiltIn: true,
        widgets: [{ type: 'header', locked: true }],
      };
    }

    return defaultTemplate;
  }

  
  public async hasLegacyNotes(): Promise<{
    drc: boolean;
    weekly: boolean;
    monthly: boolean;
  }> {
    const result = { drc: false, weekly: false, monthly: false };
    const files = this.plugin.app.vault.getMarkdownFiles();

    for (const file of files) {
      const cache = this.plugin.app.metadataCache.getFileCache(file);
      const fm = cache?.frontmatter;

      if (!fm?.type || fm.templateId) continue;

      if (fm.type === 'drc' && !result.drc) result.drc = true;
      if (fm.type === 'weekly-review' && !result.weekly) result.weekly = true;
      if (fm.type === 'monthly-review' && !result.monthly)
        result.monthly = true;

      
      if (result.drc && result.weekly && result.monthly) break;
    }

    return result;
  }

  
  public async createTemplate(
    template: Omit<ReviewTemplate, 'id' | 'createdAt' | 'updatedAt' | 'version'>
  ): Promise<ReviewTemplate> {
    const now = new Date().toISOString();
    const uniqueName = this.generateUniqueName(template.name, template.type);

    const newTemplate: ReviewTemplate = {
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
    updates: Partial<ReviewTemplate>
  ): Promise<ReviewTemplate> {
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
      ? this.generateUniqueName(updates.name, template.type, id)
      : template.name;

    
    const updatedTemplate: ReviewTemplate = {
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

    
    const settingsKeyMap: Record<
      ReviewTemplateType,
      keyof NonNullable<typeof this.plugin.settings.templates>
    > = {
      drc: 'defaultDrc',
      weekly: 'defaultWeekly',
      monthly: 'defaultMonthly',
      quarterly: 'defaultQuarterly',
      yearly: 'defaultYearly',
    };
    const settingsKey = settingsKeyMap[template.type];
    if (this.plugin.settings.templates?.[settingsKey] === id) {
      
      this.plugin.settings.templates[settingsKey] = '';
      
      eventBus.publish('default-template:changed', {
        type: template.type,
        value: null,
      });
    }

    this.templates.splice(templateIndex, 1);
    await this.saveTemplates();
  }

  
  public async duplicateTemplate(
    id: string,
    newName: string
  ): Promise<ReviewTemplate> {
    const template = this.getTemplate(id);

    if (!template) {
      throw new Error(`Template not found: ${id}`);
    }

    const now = new Date().toISOString();
    const uniqueName = this.generateUniqueName(newName, template.type);

    const duplicatedTemplate: ReviewTemplate = {
      ...template,
      id: generateUUID(),
      name: uniqueName,
      isBuiltIn: false, 
      version: 1, 
      createdAt: now,
      updatedAt: now,
      
      widgets: structuredClone(template.widgets),
    };

    this.templates.push(duplicatedTemplate);
    await this.saveTemplates();

    return duplicatedTemplate;
  }

  
  public getAllTemplates(): ReviewTemplate[] {
    return [...this.templates];
  }

  
  public reload(): void {
    this.loadTemplates();
  }

  
  public generateUniqueName(
    baseName: string,
    type: ReviewTemplateType,
    excludeId?: string
  ): string {
    const existingNames = this.templates.flatMap((template) =>
      template.type === type && template.id !== excludeId ? [template.name] : []
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
