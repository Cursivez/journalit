

import type {
  ReviewTemplate,
  TradeTemplate,
  WidgetPlacement,
} from '../../types/reviewV2';
import type { ReviewTemplateService } from './ReviewTemplateService';
import type { TradeTemplateService } from './TradeTemplateService';


interface ReviewTemplateExportPayload {
  name: string;
  type: 'drc' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  widgets: WidgetPlacement[];
}


interface TradeTemplateExportPayload {
  name: string;
  type: 'trade';
  sections: TradeTemplate['sections'];
  display: TradeTemplate['display'];
}


type TemplateExportPayload =
  | ReviewTemplateExportPayload
  | TradeTemplateExportPayload;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isReviewTemplateType(
  value: unknown
): value is ReviewTemplateExportPayload['type'] {
  return (
    value === 'drc' ||
    value === 'weekly' ||
    value === 'monthly' ||
    value === 'quarterly' ||
    value === 'yearly'
  );
}

function parseWidgetPlacements(value: unknown): WidgetPlacement[] | null {
  if (!Array.isArray(value)) return null;
  const widgets: WidgetPlacement[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.type !== 'string') return null;
    widgets.push({
      type: item.type,
      id: typeof item.id === 'string' ? item.id : undefined,
      locked: typeof item.locked === 'boolean' ? item.locked : undefined,
      config: isRecord(item.config) ? item.config : undefined,
    });
  }
  return widgets;
}

function isTradeTemplateSections(
  value: unknown
): value is TradeTemplateExportPayload['sections'] {
  return isRecord(value);
}

function isTradeTemplateDisplay(
  value: unknown
): value is TradeTemplateExportPayload['display'] {
  return isRecord(value);
}

function parseTemplateExportPayload(
  value: unknown
): TemplateExportPayload | null {
  if (!isRecord(value) || typeof value.name !== 'string') {
    return null;
  }

  if (value.type === 'trade') {
    if (
      !isTradeTemplateSections(value.sections) ||
      !isTradeTemplateDisplay(value.display)
    ) {
      return null;
    }

    return {
      name: value.name,
      type: 'trade',
      sections: value.sections,
      display: value.display,
    };
  }

  const widgets = parseWidgetPlacements(value.widgets);
  if (isReviewTemplateType(value.type) && widgets) {
    return {
      name: value.name,
      type: value.type,
      widgets,
    };
  }

  return null;
}


interface ImportValidationResult {
  valid: boolean;
  error?: string;
  payload?: TemplateExportPayload;
  templateName?: string;
  templateType?: string;
}


export class TemplateSharingService {
  private static readonly SHARE_CODE_PREFIX = 'JRT-';
  private static readonly CURRENT_VERSION = 'v1';
  private static readonly MAX_PAYLOAD_LENGTH = 50000; 

  
  exportReviewTemplate(template: ReviewTemplate): string {
    const payload: ReviewTemplateExportPayload = {
      name: template.name,
      type: template.type,
      widgets: template.widgets,
    };

    return this.encodePayload(payload);
  }

  
  exportTradeTemplate(template: TradeTemplate): string {
    const payload: TradeTemplateExportPayload = {
      name: template.name,
      type: 'trade',
      sections: template.sections,
      display: template.display,
    };

    return this.encodePayload(payload);
  }

  
  validateShareCode(code: string): ImportValidationResult {
    
    if (!code.startsWith(TemplateSharingService.SHARE_CODE_PREFIX)) {
      return {
        valid: false,
        error: 'Invalid share code format. Must start with JRT-',
      };
    }

    
    const withoutPrefix = code.substring(
      TemplateSharingService.SHARE_CODE_PREFIX.length
    );
    const parts = withoutPrefix.split('-');

    if (parts.length < 2) {
      return {
        valid: false,
        error: 'Invalid share code format. Expected JRT-{version}-{data}',
      };
    }

    const version = parts[0];
    const encodedPayload = parts.slice(1).join('-');

    
    if (version !== TemplateSharingService.CURRENT_VERSION) {
      return {
        valid: false,
        error: `Unsupported version: ${version}. Only ${TemplateSharingService.CURRENT_VERSION} is supported.`,
      };
    }

    
    if (encodedPayload.length > TemplateSharingService.MAX_PAYLOAD_LENGTH) {
      return {
        valid: false,
        error: 'Share code exceeds maximum length (50KB)',
      };
    }

    
    const payload = this.decodePayload(encodedPayload);
    if (!payload) {
      return {
        valid: false,
        error: 'Failed to decode share code. Data may be corrupted.',
      };
    }

    
    if (!payload.name || typeof payload.name !== 'string') {
      return {
        valid: false,
        error: 'Invalid template: missing or invalid name field',
      };
    }

    if (!payload.type || typeof payload.type !== 'string') {
      return {
        valid: false,
        error: 'Invalid template: missing or invalid type field',
      };
    }

    
    if (payload.type === 'trade') {
      const tradePayload = payload;
      if (!tradePayload.sections || typeof tradePayload.sections !== 'object') {
        return {
          valid: false,
          error: 'Invalid trade template: missing or invalid sections field',
        };
      }
      if (!tradePayload.display || typeof tradePayload.display !== 'object') {
        return {
          valid: false,
          error: 'Invalid trade template: missing or invalid display field',
        };
      }
    } else if (
      ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'].includes(payload.type)
    ) {
      const reviewPayload = payload;
      if (!Array.isArray(reviewPayload.widgets)) {
        return {
          valid: false,
          error: 'Invalid template: missing or invalid widgets field',
        };
      }
    } else {
      return {
        valid: false,
        error: `Invalid template type: ${payload.type}. Must be drc, weekly, monthly, quarterly, yearly, or trade.`,
      };
    }

    return {
      valid: true,
      payload,
      templateName: payload.name,
      templateType: payload.type,
    };
  }

  
  async importTemplate(
    code: string,
    reviewTemplateService: ReviewTemplateService,
    tradeTemplateService: TradeTemplateService
  ): Promise<ReviewTemplate | TradeTemplate> {
    
    const validation = this.validateShareCode(code);
    if (!validation.valid || !validation.payload) {
      throw new Error(validation.error || 'Invalid share code');
    }

    const payload = validation.payload;

    
    let finalName = payload.name;

    if (payload.type === 'trade') {
      const existingTemplates = tradeTemplateService.getTemplates();
      const existingNames = existingTemplates.map((t) => t.name);
      finalName = this.generateUniqueName(payload.name, existingNames);

      
      const tradePayload = payload;
      return await tradeTemplateService.createTemplate({
        name: finalName,
        type: 'trade',
        isBuiltIn: false,
        sections: tradePayload.sections,
        display: tradePayload.display,
      });
    } else {
      const existingTemplates = reviewTemplateService.getTemplates(
        payload.type
      );
      const existingNames = existingTemplates.map((t) => t.name);
      finalName = this.generateUniqueName(payload.name, existingNames);

      
      const reviewPayload = payload;
      return await reviewTemplateService.createTemplate({
        name: finalName,
        type: reviewPayload.type,
        isBuiltIn: false,
        widgets: reviewPayload.widgets,
      });
    }
  }

  
  private encodePayload(payload: TemplateExportPayload): string {
    const jsonString = JSON.stringify(payload);
    const base64 = btoa(jsonString);
    return `${TemplateSharingService.SHARE_CODE_PREFIX}${TemplateSharingService.CURRENT_VERSION}-${base64}`;
  }

  
  private decodePayload(encoded: string): TemplateExportPayload | null {
    try {
      const jsonString = atob(encoded);
      const payload: unknown = JSON.parse(jsonString);
      return parseTemplateExportPayload(payload);
    } catch (error) {
      console.error('Failed to decode payload:', error);
      return null;
    }
  }

  
  private generateUniqueName(
    baseName: string,
    existingNames: string[]
  ): string {
    const existingNameSet = new Set(existingNames);
    let finalName = baseName;
    let counter = 0;

    while (existingNameSet.has(finalName)) {
      counter++;
      if (counter === 1) {
        finalName = `${baseName} (Imported)`;
      } else {
        finalName = `${baseName} (Imported ${counter})`;
      }
    }

    return finalName;
  }
}
