

import type {
  ReviewTemplate,
  TradeNoteBodySection,
  TradeNoteSectionId,
  TradeTemplate,
  TradeTemplateAssetType,
  WidgetPlacement,
} from '../../types/reviewV2';
import {
  isValidTradeReviewQuestionGraph,
  TRADE_REVIEW_QUESTION_CONFIG_KEY_LIST,
} from '../../components/reviewV2/widgets/tradeReviewConfig';
import type { ReviewTemplateService } from './ReviewTemplateService';
import type { TradeTemplateService } from './TradeTemplateService';
import { encodeBase64Utf8 } from '../../utils/base64';


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
  sectionOrder?: TradeTemplate['sectionOrder'];
  assetDefaults?: TradeTemplate['assetDefaults'];
  assetOverrides?: TradeTemplate['assetOverrides'];
  noteSections?: TradeTemplate['noteSections'];
}

type TradeAssetLayouts = NonNullable<TradeTemplate['assetOverrides']>;


type TemplateExportPayload =
  | ReviewTemplateExportPayload
  | TradeTemplateExportPayload;

type ShareCodeVersion = 'v1' | 'v2';

const SUPPORTED_SHARE_CODE_VERSIONS: readonly ShareCodeVersion[] = ['v1', 'v2'];

function isSupportedShareCodeVersion(value: string): value is ShareCodeVersion {
  return SUPPORTED_SHARE_CODE_VERSIONS.some((version) => version === value);
}

function decodeBase64Utf8(encoded: string): string {
  const binaryString = atob(encoded);
  const bytes = new Uint8Array(binaryString.length);

  for (let index = 0; index < binaryString.length; index++) {
    bytes[index] = binaryString.charCodeAt(index);
  }

  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

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

function hasValidTradeReviewQuestionGraphs(
  widgets: WidgetPlacement[]
): boolean {
  return widgets.every((widget) => {
    if (widget.type !== 'trade-review' || !widget.config) return true;
    return TRADE_REVIEW_QUESTION_CONFIG_KEY_LIST.every((key) => {
      if (!Object.prototype.hasOwnProperty.call(widget.config, key)) {
        return true;
      }
      return isValidTradeReviewQuestionGraph(widget.config?.[key]);
    });
  });
}


function hasValidTradeReviewNotesSections(widgets: WidgetPlacement[]): boolean {
  return widgets.every((widget) => {
    const value = widget.config?.notesSections;
    if (widget.type !== 'trade-review' || value === undefined) return true;
    return (
      Array.isArray(value) && value.every((item) => typeof item === 'string')
    );
  });
}

function isTradeTemplateSections(
  value: unknown
): value is TradeTemplateExportPayload['sections'] {
  return isRecord(value);
}


const TRADE_NOTE_SECTION_IDS: Record<TradeNoteSectionId, true> = {
  navigation: true,
  images: true,
  metrics: true,
  thesis: true,
  missedReason: true,
  metadata: true,
  reviewButton: true,
};

const TRADE_TEMPLATE_ASSET_TYPES: Record<TradeTemplateAssetType, true> = {
  stock: true,
  options: true,
  futures: true,
  forex: true,
  crypto: true,
  cfd: true,
};

const TRADE_NOTE_SECTION_ID_SET: ReadonlySet<string> = new Set(
  Object.keys(TRADE_NOTE_SECTION_IDS)
);
const TRADE_TEMPLATE_ASSET_TYPE_SET: ReadonlySet<string> = new Set(
  Object.keys(TRADE_TEMPLATE_ASSET_TYPES)
);

function isTradeNoteSectionId(value: unknown): value is TradeNoteSectionId {
  return typeof value === 'string' && TRADE_NOTE_SECTION_ID_SET.has(value);
}

function isTradeTemplateAssetType(
  value: string
): value is TradeTemplateAssetType {
  return TRADE_TEMPLATE_ASSET_TYPE_SET.has(value);
}


function parseSectionOrder(value: unknown): TradeNoteSectionId[] | null {
  if (!Array.isArray(value) || !value.every(isTradeNoteSectionId)) return null;
  return new Set(value).size === value.length ? value : null;
}

function isPartialTradeTemplateSections(
  value: unknown
): value is Partial<TradeTemplate['sections']> {
  return isRecord(value);
}

function parseAssetLayouts(value: unknown): TradeAssetLayouts | null {
  if (!isRecord(value)) return null;
  const layouts: TradeAssetLayouts = {};
  for (const [assetType, layout] of Object.entries(value)) {
    if (!isTradeTemplateAssetType(assetType) || !isRecord(layout)) return null;
    const sectionOrder =
      layout.sectionOrder === undefined
        ? undefined
        : parseSectionOrder(layout.sectionOrder);
    if (sectionOrder === null) return null;
    const { sections } = layout;
    if (sections !== undefined && !isPartialTradeTemplateSections(sections)) {
      return null;
    }
    layouts[assetType] = { sectionOrder, sections };
  }
  return layouts;
}

function parseNoteSections(value: unknown): TradeNoteBodySection[] | null {
  if (!Array.isArray(value)) return null;
  const sections: TradeNoteBodySection[] = [];
  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      typeof item.text !== 'string'
    ) {
      return null;
    }
    if (item.type === 'zone') {
      sections.push({ id: item.id, type: 'zone', text: item.text });
    } else if (
      item.type === 'header' &&
      typeof item.level === 'number' &&
      Number.isInteger(item.level) &&
      item.level >= 1 &&
      item.level <= 6
    ) {
      sections.push({
        id: item.id,
        type: 'header',
        level: item.level,
        text: item.text,
      });
    } else {
      return null;
    }
  }
  return sections;
}


function parseOptional<T>(
  value: unknown,
  parse: (value: unknown) => T | null
): T | undefined | null {
  return value === undefined ? undefined : parse(value);
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

    const sectionOrder = parseOptional(value.sectionOrder, parseSectionOrder);
    const assetDefaults = parseOptional(value.assetDefaults, parseAssetLayouts);
    const assetOverrides = parseOptional(
      value.assetOverrides,
      parseAssetLayouts
    );
    const noteSections = parseOptional(value.noteSections, parseNoteSections);
    if (
      sectionOrder === null ||
      assetDefaults === null ||
      assetOverrides === null ||
      noteSections === null
    ) {
      return null;
    }

    return {
      name: value.name,
      type: 'trade',
      sections: value.sections,
      display: value.display,
      sectionOrder,
      assetDefaults,
      assetOverrides,
      noteSections,
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

export class LayoutShareCodeTooLargeError extends Error {
  constructor() {
    super('Layout share code exceeds maximum size');
    this.name = 'LayoutShareCodeTooLargeError';
  }
}


export class TemplateSharingService {
  private static readonly SHARE_CODE_PREFIX = 'JRT-';
  private static readonly CURRENT_VERSION: ShareCodeVersion = 'v2';
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
      sectionOrder: template.sectionOrder,
      assetDefaults: template.assetDefaults,
      assetOverrides: template.assetOverrides,
      noteSections: template.noteSections,
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

    
    if (!isSupportedShareCodeVersion(version)) {
      return {
        valid: false,
        error: `Unsupported version: ${version}. Supported versions: ${SUPPORTED_SHARE_CODE_VERSIONS.join(', ')}.`,
      };
    }

    
    if (encodedPayload.length > TemplateSharingService.MAX_PAYLOAD_LENGTH) {
      return {
        valid: false,
        error: 'Share code exceeds maximum length (50KB)',
      };
    }

    
    const payload = this.decodePayload(encodedPayload, version);
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
      if (!hasValidTradeReviewQuestionGraphs(reviewPayload.widgets)) {
        return {
          valid: false,
          error: 'Invalid template: malformed Trade Review question graph',
        };
      }
      if (!hasValidTradeReviewNotesSections(reviewPayload.widgets)) {
        return {
          valid: false,
          error: 'Invalid template: malformed Trade Review notes sections',
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
        sectionOrder: tradePayload.sectionOrder,
        assetDefaults: tradePayload.assetDefaults,
        assetOverrides: tradePayload.assetOverrides,
        noteSections: tradePayload.noteSections,
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
    const base64 = encodeBase64Utf8(jsonString);

    if (base64.length > TemplateSharingService.MAX_PAYLOAD_LENGTH) {
      throw new LayoutShareCodeTooLargeError();
    }

    return `${TemplateSharingService.SHARE_CODE_PREFIX}${TemplateSharingService.CURRENT_VERSION}-${base64}`;
  }

  
  private decodePayload(
    encoded: string,
    version: ShareCodeVersion
  ): TemplateExportPayload | null {
    try {
      const jsonString =
        version === 'v1' ? atob(encoded) : decodeBase64Utf8(encoded);
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
