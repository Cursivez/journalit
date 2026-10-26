

import type JournalitPlugin from '../../main';
import type { CustomFieldDefinition } from '../../types/customFields';
import { isSampleOwnedFrontmatter } from '../../demo/DemoOwnership';
import {
  canConvertFieldToRating,
  isPlannedNoteUnchanged,
  readSourceValueKey,
  type PlannedRatingNote,
  type RatingConversionNote,
} from './ratingConversion';

interface ConversionFailure {
  path: string;
  message: string;
}

export interface ConversionRunResult {
  
  written: string[];
  
  changed: string[];
  failed: ConversionFailure[];
  
  fieldChanged: boolean;
}


export type FieldRemoval = 'removed' | 'kept' | 'delete-failed';

export type ConversionProgress = (done: number, total: number) => void;

export class CustomFieldConversionService {
  constructor(private readonly plugin: JournalitPlugin) {}

  
  collectNotes(field: CustomFieldDefinition): RatingConversionNote[] {
    const { app, tradeService } = this.plugin;
    const notes: RatingConversionNote[] = [];
    for (const file of app.vault.getMarkdownFiles()) {
      const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
      if (
        !frontmatter ||
        
        !(
          tradeService.feedsTradeData(file.path, frontmatter) ||
          tradeService.feedsMissedTradeData(file.path, frontmatter)
        ) ||
        isSampleOwnedFrontmatter(frontmatter) ||
        !Object.prototype.hasOwnProperty.call(frontmatter, field.fieldKey)
      ) {
        continue;
      }
      notes.push({
        path: file.path,
        value: frontmatter[field.fieldKey],
        tradeRating: frontmatter.tradeRating,
        readOnly: frontmatter.isCopiedTrade === true,
      });
    }
    notes.sort((a, b) => a.path.localeCompare(b.path));
    return notes;
  }

  
  convert(
    field: CustomFieldDefinition,
    plan: readonly PlannedRatingNote[],
    overwriteConflicts: boolean,
    onProgress?: ConversionProgress
  ): Promise<ConversionRunResult> {
    const targets = plan.filter(
      (note) =>
        note.status === 'convert' ||
        (overwriteConflicts && note.status === 'conflict')
    );
    return this.run(field, targets, onProgress, (note) => ({
      tradeRating: note.rating,
    }));
  }

  
  async removeConvertedField(
    field: CustomFieldDefinition,
    plan: readonly PlannedRatingNote[],
    onProgress?: ConversionProgress
  ): Promise<ConversionRunResult & { field: FieldRemoval }> {
    const result = await this.run(
      field,
      plan.filter((note) => note.status === 'converted'),
      onProgress,
      () => ({ removeCustomFieldValues: [field.id] })
    );
    if (
      result.fieldChanged ||
      result.failed.length > 0 ||
      result.changed.length > 0
    ) {
      return { ...result, field: 'kept' };
    }
    
    
    const planned = new Set(plan.map((note) => note.path));
    const unplanned = this.collectNotes(field).flatMap((note) =>
      !planned.has(note.path) && readSourceValueKey(note.value) !== null
        ? [note.path]
        : []
    );
    if (unplanned.length > 0) {
      return {
        ...result,
        changed: [...result.changed, ...unplanned],
        field: 'kept',
      };
    }
    if (!this.isFieldCurrent(field)) {
      return { ...result, fieldChanged: true, field: 'kept' };
    }
    const { customFieldsService } = this.plugin;
    try {
      await customFieldsService.removeField(field.id);
    } catch (error) {
      console.error(
        '[Journalit] Failed to delete converted custom field',
        error
      );
      
      
      if (customFieldsService.getField(field.id) !== undefined) {
        return { ...result, field: 'delete-failed' };
      }
    }
    return { ...result, field: 'removed' };
  }

  
  private isFieldCurrent(field: CustomFieldDefinition): boolean {
    const current = this.plugin.customFieldsService.getField(field.id);
    return (
      current !== undefined &&
      current.fieldKey === field.fieldKey &&
      current.type === field.type &&
      canConvertFieldToRating(current)
    );
  }

  private async run(
    field: CustomFieldDefinition,
    notes: readonly PlannedRatingNote[],
    onProgress: ConversionProgress | undefined,
    buildPatch: (note: PlannedRatingNote) => {
      tradeRating?: number;
      removeCustomFieldValues?: string[];
    }
  ): Promise<ConversionRunResult> {
    const result: ConversionRunResult = {
      written: [],
      changed: [],
      failed: [],
      fieldChanged: false,
    };
    onProgress?.(0, notes.length);
    
    
    for (const [index, note] of notes.entries()) {
      if (result.fieldChanged || !this.isFieldCurrent(field)) {
        result.fieldChanged = true;
        break;
      }
      try {
        const written =
          await this.plugin.tradeService.updateTradeJournalFieldsFromCurrent(
            note.path,
            (current) => {
              
              if (!this.isFieldCurrent(field)) {
                result.fieldChanged = true;
                return {};
              }
              return isPlannedNoteUnchanged(current, field.id, note)
                ? buildPatch(note)
                : {};
            }
          );
        if (written) result.written.push(note.path);
        else if (!result.fieldChanged) result.changed.push(note.path);
      } catch (error) {
        result.failed.push({
          path: note.path,
          message: error instanceof Error ? error.message : String(error),
        });
      }
      onProgress?.(index + 1, notes.length);
    }
    return result;
  }
}
