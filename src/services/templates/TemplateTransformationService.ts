

import { App, TFile, Notice } from 'obsidian';
import { t } from '../../lang/helpers';
import type { ReviewTemplate } from '../../types/reviewV2';
import { showTemplateSwitchWarning } from '../../components/modals/TemplateSwitchWarningModal';
import { ReviewTemplateService } from './ReviewTemplateService';
import { generateUUID } from '../../utils/uuid';
import {
  readFileContentForMutation,
  replaceFileContent,
} from '../../utils/fileMutation';

interface JournalitPluginInstance {
  app: App;

  settings: any;
  saveSettings?: () => Promise<void>;
}

interface ParsedWidget {
  type: 'codeblock' | 'markdown' | 'markdown-header';
  widgetType?: string; 
  widgetId?: string; 
  isMarkdownZoneContent?: boolean;
  markdownHeaderContentKey?: string;
  content: string;
}

interface MappedContentEntry {
  content: string;
  relatedKeys: string[];
}

interface MappedContent {
  [widgetId: string]: MappedContentEntry; 
}

const MARKDOWN_ZONE_CONTENT_KEY_PREFIX = 'markdown-zone-content-';

interface TemplateParseCursor {
  widgets: ReviewTemplate['widgets'];
  index: number;
}

function getSequentialMarkdownZoneContentKey(index: number): string {
  return `${MARKDOWN_ZONE_CONTENT_KEY_PREFIX}${index}`;
}

function getMarkdownHeaderContentKey(level: number, text: string): string {
  return `markdown-header-content-${level}-${text.trim().toLowerCase()}`;
}

function getMarkdownHeaderContentKeyFromLine(line: string): string | undefined {
  const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
  if (!headerMatch) {
    return undefined;
  }

  return getMarkdownHeaderContentKey(headerMatch[1].length, headerMatch[2]);
}

function getMarkdownHeaderContentKeyFromWidget(
  widget: ReviewTemplate['widgets'][number]
): string | undefined {
  if (widget.type !== 'markdown-header') {
    return undefined;
  }

  const config = widget.config as { level?: number; text?: string } | undefined;
  return getMarkdownHeaderContentKey(
    config?.level ?? 2,
    config?.text ?? t('common.header')
  );
}

function getMarkdownZoneText(
  config: Record<string, unknown> | undefined
): string {
  return typeof config?.text === 'string' ? config.text : '';
}

function appendMarkdownZoneLines(widgetLines: string[], text: string): void {
  if (text.trim().length > 0) {
    widgetLines.push(text);
    widgetLines.push('');
    return;
  }

  widgetLines.push('');
  widgetLines.push('');
  widgetLines.push('');
}

function resolveMarkdownZoneContent(
  widget: ReviewTemplate['widgets'][number],
  mappedContent: MappedContent,
  markdownZoneIndex: number,
  usedKeys: Set<string>,
  markdownHeaderContentKey: string | undefined
): { content: string; usedKeys: string[] } {
  const zoneId = widget.id || 'notes';
  const candidateKeys = [
    zoneId,
    `${zoneId}-notes`,
    ...(markdownHeaderContentKey ? [markdownHeaderContentKey] : []),
    ...(!markdownHeaderContentKey
      ? [getSequentialMarkdownZoneContentKey(markdownZoneIndex)]
      : []),
  ];

  for (const key of candidateKeys) {
    if (Object.prototype.hasOwnProperty.call(mappedContent, key)) {
      const entry = mappedContent[key];
      if (entry.relatedKeys.some((relatedKey) => usedKeys.has(relatedKey))) {
        continue;
      }
      return { content: entry.content, usedKeys: entry.relatedKeys };
    }
  }

  return { content: getMarkdownZoneText(widget.config), usedKeys: [] };
}

export class TemplateTransformationService {
  private plugin: JournalitPluginInstance;

  constructor(plugin: JournalitPluginInstance) {
    this.plugin = plugin;
  }

  
  public generateNoteFromTemplate(
    template: ReviewTemplate,
    frontmatter: Record<string, any>
  ): string {
    
    
    const fmLines = ['---'];
    for (const [key, value] of Object.entries(frontmatter)) {
      fmLines.push(this.formatFrontmatterValue(key, value));
    }
    fmLines.push('---');
    fmLines.push('');

    
    const widgetLines: string[] = [];
    for (const widget of template.widgets) {
      if (widget.type === 'markdown-zone') {
        
        appendMarkdownZoneLines(
          widgetLines,
          getMarkdownZoneText(widget.config)
        );
      } else if (widget.type === 'markdown-header') {
        
        
        const config = widget.config as
          | { level?: number; text?: string }
          | undefined;
        const level = config?.level ?? 2;
        const text = config?.text ?? t('common.header');
        const hashes = '#'.repeat(Math.max(1, Math.min(6, level)));
        widgetLines.push(`${hashes} ${text}`);
      } else {
        
        widgetLines.push(`\`\`\`journalit-${widget.type}`);
        if (widget.type === 'images') {
          const imageWidgetId = widget.id || `images-${generateUUID()}`;
          widgetLines.push(`id: ${imageWidgetId}`);
        }
        
        if (widget.config && Object.keys(widget.config).length > 0) {
          for (const [key, value] of Object.entries(widget.config)) {
            
            if (value === undefined || value === null) continue;
            if (typeof value === 'object') continue;
            widgetLines.push(`${key}: ${value}`);
          }
        }
        widgetLines.push('```');
      }
    }

    return [...fmLines, ...widgetLines].join('\n');
  }

  
  public async applyTemplate(
    filePath: string,
    template: ReviewTemplate,
    showWarning: boolean = true,
    currentTemplateName?: string
  ): Promise<boolean> {
    const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
    if (!file || !(file instanceof TFile)) {
      new Notice(t('notice.error.file-not-found', { path: filePath }));
      return false;
    }

    
    const content = await readFileContentForMutation(this.plugin.app, file);

    
    const sourceTemplate = this.getSourceTemplate(content);
    const widgets = this.parseNoteWidgets(content, sourceTemplate);

    
    const mappedContent = this.mapContentToWidgets(widgets);

    
    const hasContent = Object.values(mappedContent).some(
      (entry) => entry.content.trim().length > 0
    );

    
    if (showWarning && hasContent) {
      const confirmed = await showTemplateSwitchWarning(
        this.plugin.app,
        currentTemplateName || 'Current Template',
        template.name,
        hasContent
      );
      if (!confirmed) {
        return false;
      }
    }

    
    const newContent = this.buildNoteFromTemplate(
      template,
      mappedContent,
      content
    );

    
    await replaceFileContent(this.plugin.app, file, newContent);

    new Notice(t('notice.template-applied', { name: template.name }));
    return true;
  }

  private getSourceTemplate(content: string): ReviewTemplate | undefined {
    const templateIdMatch = content.match(
      /^---\n[\s\S]*?^templateId:\s*([^\n]+)$/m
    );
    const templateId = templateIdMatch?.[1]?.trim();
    if (!templateId || !this.plugin.saveSettings) {
      return undefined;
    }

    const templateService = new ReviewTemplateService(
      this.plugin as ConstructorParameters<typeof ReviewTemplateService>[0]
    );
    return templateService.getTemplate(templateId);
  }

  private createTemplateParseCursor(
    template: ReviewTemplate | undefined
  ): TemplateParseCursor | undefined {
    if (!template) {
      return undefined;
    }

    return { widgets: template.widgets, index: 0 };
  }

  private advanceCursorPastCodeblock(
    cursor: TemplateParseCursor | undefined,
    codeblockType: string
  ): void {
    if (!cursor) {
      return;
    }

    const index = cursor.widgets.findIndex(
      (widget, widgetIndex) =>
        widgetIndex >= cursor.index && widget.type === codeblockType
    );
    if (index >= 0) {
      cursor.index = index + 1;
    }
  }

  private isNextGeneratedMarkdownHeader(
    cursor: TemplateParseCursor | undefined,
    line: string
  ): boolean {
    if (!cursor) {
      return false;
    }

    const headerMatch = line.match(/^(#{1,6})\s+.+$/);
    if (!headerMatch) {
      return false;
    }

    while (cursor.index < cursor.widgets.length) {
      const widget = cursor.widgets[cursor.index];
      if (widget.type === 'markdown-zone') {
        cursor.index += 1;
        continue;
      }

      if (widget.type !== 'markdown-header') {
        return false;
      }

      const config = widget.config as { level?: number } | undefined;
      const level = config?.level ?? 2;
      if (headerMatch[1].length !== Math.max(1, Math.min(6, level))) {
        return false;
      }

      cursor.index += 1;
      return true;
    }

    return false;
  }

  private peekNextMarkdownZoneId(
    cursor: TemplateParseCursor | undefined
  ): string | undefined {
    if (!cursor) {
      return undefined;
    }

    for (let index = cursor.index; index < cursor.widgets.length; index++) {
      const widget = cursor.widgets[index];
      if (widget.type === 'markdown-zone') {
        return widget.id;
      }

      if (widget.type === 'markdown-header') {
        return undefined;
      }
    }

    return undefined;
  }

  
  private parseNoteWidgets(
    content: string,
    sourceTemplate: ReviewTemplate | undefined
  ): ParsedWidget[] {
    const widgets: ParsedWidget[] = [];
    const lines = content.split('\n');

    let inFrontmatter = false;
    let frontmatterEnded = false;
    let inCodeblock = false;
    let codeblockType = '';
    let currentMarkdown: string[] = [];
    let lastWidgetId: string | undefined;
    let lastWidgetIsMarkdownZone = false;
    let lastMarkdownHeaderContentKey: string | undefined;
    const templateCursor = this.createTemplateParseCursor(sourceTemplate);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      
      if (i === 0 && line === '---') {
        inFrontmatter = true;
        continue;
      }
      if (inFrontmatter) {
        if (line === '---') {
          inFrontmatter = false;
          frontmatterEnded = true;
        }
        continue;
      }

      
      const codeblockMatch = line.match(/^```journalit-(\w+(?:-\w+)*)/);
      if (codeblockMatch) {
        
        if (currentMarkdown.length > 0) {
          widgets.push({
            type: 'markdown',
            widgetId: lastWidgetId ? `${lastWidgetId}-notes` : undefined,
            isMarkdownZoneContent: lastWidgetIsMarkdownZone,
            markdownHeaderContentKey: lastMarkdownHeaderContentKey,
            content: currentMarkdown.join('\n'),
          });
          currentMarkdown = [];
        }

        inCodeblock = true;
        codeblockType = codeblockMatch[1];
        continue;
      }

      
      if (inCodeblock && line === '```') {
        widgets.push({
          type: 'codeblock',
          widgetType: codeblockType,
          content: '',
        });
        lastWidgetId = codeblockType;
        lastWidgetIsMarkdownZone = false;
        this.advanceCursorPastCodeblock(templateCursor, codeblockType);
        inCodeblock = false;
        codeblockType = '';
        continue;
      }

      
      if (inCodeblock) {
        continue;
      }

      
      
      
      
      const isGeneratedHeader = this.isNextGeneratedMarkdownHeader(
        templateCursor,
        line
      );
      if (isGeneratedHeader && frontmatterEnded) {
        
        if (currentMarkdown.length > 0) {
          widgets.push({
            type: 'markdown',
            widgetId: lastWidgetId ? `${lastWidgetId}-notes` : undefined,
            isMarkdownZoneContent: lastWidgetIsMarkdownZone,
            markdownHeaderContentKey: lastMarkdownHeaderContentKey,
            content: currentMarkdown.join('\n'),
          });
          currentMarkdown = [];
        }
        
        
        
        widgets.push({
          type: 'markdown-header',
          content: line,
        });
        lastWidgetId = this.peekNextMarkdownZoneId(templateCursor);
        lastWidgetIsMarkdownZone = Boolean(lastWidgetId);
        lastMarkdownHeaderContentKey =
          getMarkdownHeaderContentKeyFromLine(line);
        continue;
      }

      
      if (frontmatterEnded) {
        currentMarkdown.push(line);
      }
    }

    
    if (currentMarkdown.length > 0) {
      widgets.push({
        type: 'markdown',
        widgetId: lastWidgetId ? `${lastWidgetId}-notes` : undefined,
        isMarkdownZoneContent: lastWidgetIsMarkdownZone,
        markdownHeaderContentKey: lastMarkdownHeaderContentKey,
        content: currentMarkdown.join('\n'),
      });
    }

    return widgets;
  }

  
  private mapContentToWidgets(widgets: ParsedWidget[]): MappedContent {
    const mapped: MappedContent = {};
    let markdownZoneIndex = 0;

    for (const widget of widgets) {
      if (widget.type === 'markdown') {
        const trimmed = widget.content.trim();
        const preservesBlankMarkdownZone =
          (!widget.widgetId || widget.isMarkdownZoneContent === true) &&
          trimmed.length === 0 &&
          widget.content.length >= 2;

        if (trimmed || preservesBlankMarkdownZone) {
          const keys = widget.widgetId
            ? widget.isMarkdownZoneContent
              ? [
                  widget.widgetId,
                  ...(widget.markdownHeaderContentKey
                    ? [widget.markdownHeaderContentKey]
                    : []),
                  getSequentialMarkdownZoneContentKey(markdownZoneIndex++),
                ]
              : [widget.widgetId]
            : [
                ...(widget.markdownHeaderContentKey
                  ? [widget.markdownHeaderContentKey]
                  : []),
                getSequentialMarkdownZoneContentKey(markdownZoneIndex++),
              ];
          const entry: MappedContentEntry = {
            content: trimmed,
            relatedKeys: keys,
          };

          keys.forEach((key) => {
            mapped[key] = entry;
          });
        }
      }
    }

    return mapped;
  }

  private extractImageWidgetIdsFromContent(content: string): string[] {
    const lines = content.split('\n');
    const ids: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trimStart().startsWith('```journalit-images')) {
        continue;
      }

      let foundId: string | null = null;
      for (let j = i + 1; j < lines.length; j++) {
        const trimmed = lines[j].trim();
        if (trimmed === '```') {
          i = j;
          break;
        }
        if (trimmed.startsWith('id:')) {
          foundId = trimmed.slice('id:'.length).trim();
        }
      }

      if (foundId) {
        ids.push(foundId);
      }
    }

    return ids;
  }

  
  private buildNoteFromTemplate(
    template: ReviewTemplate,
    mappedContent: MappedContent,
    originalContent: string
  ): string {
    
    const usedKeys = new Set<string>();

    
    const fmMatch = originalContent.match(/^---\n([\s\S]*?)\n---/);
    let frontmatterLines: string[] = [];

    if (fmMatch) {
      frontmatterLines = fmMatch[1].split('\n').filter((line) => {
        
        return (
          !line.startsWith('templateId:') &&
          !line.startsWith('templateVersion:')
        );
      });
    }

    
    const newFm = [
      '---',
      ...frontmatterLines,
      `templateId: ${template.id}`,
      `templateVersion: ${template.version}`,
      '---',
      '',
    ];

    
    const widgetLines: string[] = [];
    const existingImageWidgetIds =
      this.extractImageWidgetIdsFromContent(originalContent);
    let imageWidgetIndex = 0;
    let markdownZoneIndex = 0;
    let pendingMarkdownHeaderContentKey: string | undefined;

    for (const widget of template.widgets) {
      if (widget.type === 'markdown-zone') {
        
        const resolved = resolveMarkdownZoneContent(
          widget,
          mappedContent,
          markdownZoneIndex,
          usedKeys,
          pendingMarkdownHeaderContentKey
        );
        markdownZoneIndex += 1;
        pendingMarkdownHeaderContentKey = undefined;

        if (resolved.usedKeys.length > 0) {
          if (resolved.content) {
            widgetLines.push(resolved.content);
          } else {
            appendMarkdownZoneLines(widgetLines, resolved.content);
          }
          resolved.usedKeys.forEach((key) => usedKeys.add(key));
        } else {
          appendMarkdownZoneLines(widgetLines, resolved.content);
        }
      } else if (widget.type === 'markdown-header') {
        
        
        const config = widget.config as
          | { level?: number; text?: string }
          | undefined;
        const level = config?.level ?? 2;
        const text = config?.text ?? t('common.header');
        const hashes = '#'.repeat(Math.max(1, Math.min(6, level)));
        widgetLines.push(`${hashes} ${text}`);
        pendingMarkdownHeaderContentKey =
          getMarkdownHeaderContentKeyFromWidget(widget);
      } else {
        
        widgetLines.push(`\`\`\`journalit-${widget.type}`);
        if (widget.type === 'images') {
          const imageWidgetId =
            existingImageWidgetIds[imageWidgetIndex] ||
            widget.id ||
            `images-${generateUUID()}`;
          widgetLines.push(`id: ${imageWidgetId}`);
          imageWidgetIndex += 1;
        }
        
        if (widget.config && Object.keys(widget.config).length > 0) {
          for (const [key, value] of Object.entries(widget.config)) {
            
            if (value === undefined || value === null) continue;
            if (typeof value === 'object') continue;
            widgetLines.push(`${key}: ${value}`);
          }
        }
        widgetLines.push('```');

        
        const noteKey = `${widget.type}-notes`;
        if (mappedContent[noteKey]) {
          const entry = mappedContent[noteKey];
          widgetLines.push(entry.content);
          entry.relatedKeys.forEach((key) => usedKeys.add(key));
        }
      }
    }

    
    const orphanedContent: string[] = [];
    const seenOrphans = new Set<MappedContentEntry>();
    for (const [key, entry] of Object.entries(mappedContent)) {
      if (
        !usedKeys.has(key) &&
        entry.content.trim() &&
        !seenOrphans.has(entry)
      ) {
        orphanedContent.push(entry.content.trim());
        seenOrphans.add(entry);
      }
    }

    
    if (orphanedContent.length > 0) {
      widgetLines.push('');
      widgetLines.push('---');
      widgetLines.push('');
      widgetLines.push(
        `## ${t('template.transformation.orphaned-content.header')}`
      );
      widgetLines.push('');
      widgetLines.push(t('template.transformation.orphaned-content.desc1'));
      widgetLines.push(t('template.transformation.orphaned-content.desc2'));
      widgetLines.push('');
      for (const content of orphanedContent) {
        widgetLines.push(content);
        widgetLines.push('');
      }
    }

    return [...newFm, ...widgetLines].join('\n');
  }

  
  private formatFrontmatterValue(key: string, value: unknown): string {
    if (value === null || value === undefined) {
      return `${key}: `;
    }
    if (typeof value === 'string') {
      
      if (value.includes(':') || value.includes('#') || value.includes('\n')) {
        return `${key}: "${value.replace(/"/g, '\\"')}"`;
      }
      return `${key}: ${value}`;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return `${key}: ${value}`;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return `${key}: []`;
      return `${key}: ${JSON.stringify(value)}`;
    }
    if (typeof value === 'object') {
      return `${key}: ${JSON.stringify(value)}`;
    }
    return `${key}: ${value}`;
  }
}
