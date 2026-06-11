

import type { EventRef } from 'obsidian';
import type { CustomFieldDefinition } from './customFields';

export type JournalitCustomFieldsChangedPayload = {
  fields: CustomFieldDefinition[];
};

declare module 'obsidian' {
  interface Workspace {
    
    on(
      name: 'journalit-custom-fields-changed',
      callback: (payload: JournalitCustomFieldsChangedPayload) => void,
      ctx?: unknown
    ): EventRef;

    
    on(
      name: string,
      callback: (...data: unknown[]) => unknown,
      ctx?: unknown
    ): EventRef;

    
    off(
      name: 'journalit-custom-fields-changed',
      callback: (payload: JournalitCustomFieldsChangedPayload) => void
    ): void;

    
    off(name: string, callback: (...data: unknown[]) => unknown): void;
  }
}
