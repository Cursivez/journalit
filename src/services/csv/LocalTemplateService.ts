

import type { LocalCSVTemplate } from './types';
import type JournalitPlugin from '../../main';
import type { SettingsManager } from '../../settings/SettingsManager';
import { generateUUID } from '../../utils/uuid';
import { encodeTemplate, decodeTemplate } from './templateShareCode';
import { normalizeTemplate } from './templateMappingUtils';


export class LocalTemplateService {
  private templatesNormalized = false;

  constructor(
    private plugin: JournalitPlugin,
    private settingsManager: SettingsManager
  ) {}

  private ensureTemplatesNormalized(): void {
    if (this.templatesNormalized) {
      return;
    }

    const existing = this.plugin.settings.csvTemplates || [];
    let hasChanges = false;

    const normalizedTemplates = existing.map((template) => {
      const normalizedResult = normalizeTemplate(template);
      if (normalizedResult.changed) {
        hasChanges = true;
      }
      return normalizedResult.template;
    });

    if (hasChanges) {
      this.plugin.settings.csvTemplates = normalizedTemplates;
      void this.settingsManager
        .saveSettings(this.plugin.settings)
        .catch((err) => {
          console.error('[CSV] Failed to persist normalized templates:', err);
        });
    }

    this.templatesNormalized = true;
  }

  private normalizeTemplateForStorage(
    template: LocalCSVTemplate
  ): LocalCSVTemplate {
    return normalizeTemplate(template).template;
  }

  
  getTemplates(): LocalCSVTemplate[] {
    this.ensureTemplatesNormalized();
    return this.plugin.settings.csvTemplates || [];
  }

  
  getTemplatesByUsage(): LocalCSVTemplate[] {
    return [...this.getTemplates()].sort((a, b) => {
      
      if (a.last_used && b.last_used) {
        return (
          new Date(b.last_used).getTime() - new Date(a.last_used).getTime()
        );
      }
      if (a.last_used) return -1;
      if (b.last_used) return 1;

      
      return b.usage_count - a.usage_count;
    });
  }

  
  getTemplate(id: string): LocalCSVTemplate | undefined {
    return this.getTemplates().find((t) => t.id === id);
  }

  
  async createTemplate(
    template: Omit<LocalCSVTemplate, 'id' | 'created_at' | 'usage_count'>
  ): Promise<LocalCSVTemplate> {
    const newTemplate: LocalCSVTemplate = this.normalizeTemplateForStorage({
      ...template,
      id: generateUUID(),
      created_at: new Date().toISOString(),
      usage_count: 0,
    });

    const templates = this.getTemplates();
    templates.push(newTemplate);

    this.plugin.settings.csvTemplates = templates;
    await this.settingsManager.saveSettings(this.plugin.settings);

    return newTemplate;
  }

  
  async updateTemplate(
    id: string,
    updates: Partial<LocalCSVTemplate>
  ): Promise<LocalCSVTemplate> {
    const templates = this.getTemplates();
    const index = templates.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error(`Template not found: ${id}`);
    }

    
    const updated = this.normalizeTemplateForStorage({
      ...templates[index],
      ...updates,
      id: templates[index].id, 
      created_at: templates[index].created_at, 
    });

    templates[index] = updated;
    this.plugin.settings.csvTemplates = templates;
    await this.settingsManager.saveSettings(this.plugin.settings);

    return updated;
  }

  
  async deleteTemplate(id: string): Promise<void> {
    const templates = this.getTemplates();
    const filtered = templates.filter((t) => t.id !== id);

    if (filtered.length === templates.length) {
      throw new Error(`Template not found: ${id}`);
    }

    this.plugin.settings.csvTemplates = filtered;
    await this.settingsManager.saveSettings(this.plugin.settings);
  }

  
  async markTemplateAsUsed(id: string): Promise<void> {
    const template = this.getTemplate(id);
    if (!template) return;

    await this.updateTemplate(id, {
      last_used: new Date().toISOString(),
      usage_count: template.usage_count + 1,
    });
  }

  
  templateNameExists(name: string, excludeId?: string): boolean {
    const lowerName = name.toLowerCase();
    return this.getTemplates().some(
      (t) => t.name.toLowerCase() === lowerName && t.id !== excludeId
    );
  }

  
  async importTemplate(shareCode: string): Promise<LocalCSVTemplate> {
    const template = this.normalizeTemplateForStorage(
      decodeTemplate(shareCode)
    );

    
    if (this.templateNameExists(template.name)) {
      
      template.name = `${template.name} (Imported)`;
    }

    const templates = this.getTemplates();
    templates.push(template);

    this.plugin.settings.csvTemplates = templates;
    await this.settingsManager.saveSettings(this.plugin.settings);

    return template;
  }

  
  exportTemplate(id: string): string {
    const template = this.getTemplate(id);
    if (!template) {
      throw new Error(`Template not found: ${id}`);
    }

    return encodeTemplate(template);
  }
}
