

import type {
  LocalCSVTemplate,
  ManualImportMode,
  MultiColumnMappings,
} from './types';
import { generateUUID } from '../../utils/uuid';
import { normalizeTemplate } from './templateMappingUtils';


function encodeBase64Utf8(str: string): string {
  
  const utf8Bytes = new TextEncoder().encode(str);
  let binaryString = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binaryString += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binaryString);
}


function decodeBase64Utf8(base64: string): string {
  
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

interface TemplateExportPayloadBase {
  
  name: string;

  
  broker_type: string;

  
  asset_type: 'stock' | 'options' | 'futures' | 'forex' | 'crypto';

  
  date_format?: string;

  
  delimiter?: string;

  
  header_row_index?: number;

  
  has_headers: boolean;

  
  manual_mode?: ManualImportMode;
}


interface TemplateExportPayloadV1 extends TemplateExportPayloadBase {
  column_mappings: Record<string, string>;
}


interface TemplateExportPayloadV2 extends TemplateExportPayloadBase {
  mapping_version: 2;
  column_mappings: MultiColumnMappings;
}


const MAX_SHARE_CODE_LENGTH = 10000; 

const VALID_ASSET_TYPES = ['stock', 'options', 'futures', 'forex', 'crypto'];

function parsePayload(code: string): {
  version: string;
  payload: unknown;
} {
  if (!code.startsWith('JTT-')) {
    throw new Error('Invalid template code: Must start with JTT-');
  }

  if (code.length > MAX_SHARE_CODE_LENGTH) {
    throw new Error('Template code too large (possible corruption)');
  }

  const parts = code.split('-');
  if (parts.length !== 3) {
    throw new Error('Invalid template code: Incorrect format');
  }

  const [_prefix, version, base64] = parts;

  let json: string;
  try {
    json = decodeBase64Utf8(base64);
  } catch {
    throw new Error('Invalid template code: Base64 decoding failed');
  }

  try {
    return {
      version,
      payload: JSON.parse(json),
    };
  } catch {
    throw new Error('Invalid template code: JSON parsing failed');
  }
}

function validateBaseFields(
  payload: Partial<TemplateExportPayloadBase> & { column_mappings?: unknown }
): TemplateExportPayloadBase {
  if (!payload.name || !payload.broker_type || !payload.column_mappings) {
    throw new Error('Invalid template code: Missing required fields');
  }

  if (typeof payload.name !== 'string' || payload.name.trim() === '') {
    throw new Error('Invalid template code: Invalid name field');
  }

  if (typeof payload.broker_type !== 'string') {
    throw new Error('Invalid template code: Invalid broker_type field');
  }

  const assetType =
    payload.asset_type && VALID_ASSET_TYPES.includes(payload.asset_type)
      ? payload.asset_type
      : 'stock';

  if (typeof payload.has_headers !== 'boolean') {
    throw new Error('Invalid template code: Invalid has_headers field');
  }

  const headerRowIndex = payload.header_row_index;
  if (
    headerRowIndex !== undefined &&
    (!Number.isInteger(headerRowIndex) || headerRowIndex < 1)
  ) {
    throw new Error('Invalid template code: Invalid header_row_index field');
  }

  return {
    name: payload.name,
    broker_type: payload.broker_type,
    asset_type: assetType,
    date_format: payload.date_format,
    delimiter: payload.delimiter,
    header_row_index: headerRowIndex,
    has_headers: payload.has_headers,
    manual_mode: payload.manual_mode,
  };
}

function createTemplateFromPayload(
  payload: TemplateExportPayloadV1 | TemplateExportPayloadV2
): LocalCSVTemplate {
  const base = validateBaseFields(payload);

  if (
    !payload.column_mappings ||
    typeof payload.column_mappings !== 'object' ||
    Array.isArray(payload.column_mappings)
  ) {
    throw new Error('Invalid template code: Invalid column_mappings field');
  }

  if (Object.keys(payload.column_mappings).length === 0) {
    throw new Error('Invalid template code: column_mappings cannot be empty');
  }

  const normalized = normalizeTemplate({
    id: generateUUID(),
    name: base.name,
    broker_type: base.broker_type,
    asset_type: base.asset_type,
    column_mappings: payload.column_mappings,
    mapping_version: 'mapping_version' in payload ? payload.mapping_version : 1,
    manual_mode: base.manual_mode,
    date_format: base.date_format,
    delimiter: base.delimiter,
    header_row_index: base.header_row_index,
    has_headers: base.has_headers,
    created_at: new Date().toISOString(),
    last_used: undefined,
    usage_count: 0,
  }).template;

  if (Object.keys(normalized.column_mappings).length === 0) {
    throw new Error('Invalid template code: column_mappings cannot be empty');
  }

  return normalized;
}


export function encodeTemplate(template: LocalCSVTemplate): string {
  const normalizedTemplate = normalizeTemplate(template).template;

  const payload: TemplateExportPayloadV2 = {
    name: normalizedTemplate.name,
    broker_type: normalizedTemplate.broker_type,
    asset_type: normalizedTemplate.asset_type,
    column_mappings: normalizedTemplate.column_mappings as MultiColumnMappings,
    mapping_version: 2,
    manual_mode: normalizedTemplate.manual_mode,
    date_format: normalizedTemplate.date_format,
    delimiter: normalizedTemplate.delimiter,
    header_row_index: normalizedTemplate.header_row_index,
    has_headers: normalizedTemplate.has_headers,
  };

  const json = JSON.stringify(payload);
  const base64 = encodeBase64Utf8(json);

  return `JTT-v2-${base64}`;
}


export function decodeTemplate(code: string): LocalCSVTemplate {
  const { version, payload } = parsePayload(code);

  if (version === 'v1') {
    return createTemplateFromPayload(payload as TemplateExportPayloadV1);
  }

  if (version === 'v2') {
    const v2Payload = payload as TemplateExportPayloadV2;
    if (v2Payload.mapping_version !== 2) {
      throw new Error('Invalid template code: mapping_version must be 2');
    }
    return createTemplateFromPayload(v2Payload);
  }

  throw new Error(
    `Unsupported template version: ${version}. Please update your plugin.`
  );
}
