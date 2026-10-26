import React, {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { DisplayPolicyProvider } from '../../../contexts/DisplayPolicyContext';
import { CommonFields } from '../../forms/trade/fields/CommonFields';
import { CustomFieldRenderer } from '../../forms/trade/fields/CustomFieldRenderer';
import { Input } from '../../core/Input';
import {
  DateDraftGateContext,
  useDateDraftGate,
} from '../../core/DateDraftGate';
import { ImageUploader } from '../../image/ImageUploader';
import { Edit } from '../../shared/icons/ObsidianIcon';
import { imageService } from '../../../services/image/ImageService';
import {
  shareCaptureExcludeProps,
  shareCaptureUnwrapProps,
} from '../../../services/share/brandedCapture';
import {
  buildTradeJournalPatch,
  hasTradeJournalChanges,
  journalStringList,
  type TradeJournalValues,
} from '../../../services/trade/core/TradeJournalFields';
import {
  CustomFieldType,
  validateCustomFieldValue,
  type CustomFieldDefinition,
} from '../../../types/customFields';

export interface TradeReviewJournalSaveHandle {
  flushPendingSaves: () => Promise<void>;
}

type JournalField =
  | { kind: 'selection'; id: 'setup' | 'mistake' | 'tags'; label: string }
  | { kind: 'text'; id: 'thesis'; label: string }
  | {
      kind: 'custom';
      id: string;
      label: string;
      definition: CustomFieldDefinition;
    };

interface EditSession {
  field: JournalField;
  initial: TradeJournalValues;
  draft: TradeJournalValues;
}

const fieldKey = (field: JournalField): string => `${field.kind}:${field.id}`;


export function isEditingTradeReviewField(
  editing: JournalEditing,
  field: JournalField
): boolean {
  return (
    editing.session !== null &&
    fieldKey(editing.session.field) === fieldKey(field)
  );
}

export function useTradeReviewJournalEditing(
  plugin: JournalitPlugin,
  tradePath: string | undefined,
  enabled: boolean,
  ref: React.Ref<TradeReviewJournalSaveHandle>
) {
  const [session, setSession] = useState<EditSession | null>(null);
  const sessionRef = useRef<EditSession | null>(null);
  const [loadingField, setLoadingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{
    fieldId: string;
    message: string;
  } | null>(null);
  const inFlight = useRef<Promise<void> | null>(null);
  const opening = useRef(false);
  const dateDraftGate = useDateDraftGate();
  
  
  const pendingUploads = useRef(new Set<Promise<unknown>>());

  const updateSession = (next: EditSession | null) => {
    sessionRef.current = next;
    setSession(next);
  };

  const save = (): Promise<void> => {
    if (inFlight.current) return inFlight.current;
    const active = sessionRef.current;
    if (!active || !tradePath) return Promise.resolve();
    
    
    
    
    if (!dateDraftGate.confirm() && !dateDraftGate.confirm())
      return Promise.reject(new Error(t('date-input.error.invalid')));
    const current = sessionRef.current ?? active;
    const patch = buildTradeJournalPatch(current.initial, current.draft);
    if (!hasTradeJournalChanges(patch)) {
      updateSession(null);
      setError(null);
      return Promise.resolve();
    }
    if (current.field.kind === 'custom') {
      const validation = validateCustomFieldValue(
        current.draft.customFields[current.field.id],
        current.field.definition,
        plugin.serviceManager
          .getCustomFieldsService()
          .getFieldOptions(current.field.id)
      );
      if (validation) {
        setError({ fieldId: fieldKey(current.field), message: validation });
        return Promise.reject(new Error(validation));
      }
    }
    setSaving(true);
    setError(null);
    const work = (async () => {
      try {
        await plugin.tradeService.updateTradeJournalFields(tradePath, patch);
        updateSession(null);
      } catch (cause) {
        setError({
          fieldId: fieldKey(current.field),
          message: cause instanceof Error ? cause.message : String(cause),
        });
        throw cause;
      } finally {
        setSaving(false);
        inFlight.current = null;
      }
    })();
    inFlight.current = work;
    return work;
  };

  const trackUpload = <T,>(upload: Promise<T>): Promise<T> => {
    pendingUploads.current.add(upload);
    void upload
      .catch(() => undefined)
      .finally(() => pendingUploads.current.delete(upload));
    return upload;
  };

  const flushPendingSaves = async () => {
    await save();
    const failure = (
      await Promise.allSettled([...pendingUploads.current])
    ).find((result) => result.status === 'rejected');
    
    if (failure) throw failure.reason;
  };

  useImperativeHandle(ref, () => ({ flushPendingSaves }));
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  });
  useEffect(() => {
    const pending = saveRef;
    return () => {
      void pending
        .current()
        .catch(
          (cause: unknown) =>
            new Notice(cause instanceof Error ? cause.message : String(cause))
        );
    };
  }, []);

  const begin = async (field: JournalField) => {
    if (!enabled || !tradePath || opening.current || saving) return;
    opening.current = true;
    try {
      await save();
      setLoadingField(fieldKey(field));
      setError(null);
      const initial =
        await plugin.tradeService.readTradeJournalFields(tradePath);
      updateSession({ field, initial, draft: initial });
    } catch (cause) {
      
      if (!sessionRef.current)
        setError({
          fieldId: fieldKey(field),
          message: cause instanceof Error ? cause.message : String(cause),
        });
    } finally {
      setLoadingField(null);
      opening.current = false;
    }
  };

  return {
    enabled,
    session,
    loadingField,
    saving,
    error,
    dateDraftGate,
    trackUpload,
    begin,
    save,
    cancel: () => {
      if (!saving) {
        updateSession(null);
        setError(null);
      }
    },
    change: (value: unknown) => {
      const current = sessionRef.current;
      if (!current || saving) return;
      if (current.field.kind === 'text') {
        if (typeof value === 'string') {
          updateSession({
            ...current,
            draft: { ...current.draft, thesis: value },
          });
        }
        return;
      }
      const draft =
        current.field.kind === 'selection'
          ? { ...current.draft, [current.field.id]: journalStringList(value) }
          : {
              ...current.draft,
              customFields: {
                ...current.draft.customFields,
                [current.field.id]: value,
              },
            };
      updateSession({ ...current, draft });
    },
  };
}

type JournalEditing = ReturnType<typeof useTradeReviewJournalEditing>;

type ActiveJournalSession = NonNullable<JournalEditing['session']>;

function InlineFieldControl({
  editing,
  field,
  session,
}: {
  editing: JournalEditing;
  field: JournalField;
  session: ActiveJournalSession;
}) {
  if (field.kind === 'selection') {
    return (
      <CommonFields
        data={{ ...session.draft }}
        errors={{}}
        fieldOrder={[field.id]}
        onChange={(_field, value) => editing.change(value)}
      />
    );
  }
  if (field.kind === 'text') {
    return (
      <Input
        label={field.label}
        placeholder={t('form.placeholder.thesis')}
        value={session.draft.thesis}
        onChange={editing.change}
        multiline
      />
    );
  }
  return (
    <CustomFieldRenderer
      field={field.definition}
      multilineText
      value={session.draft.customFields[field.id]}
      onChange={editing.change}
    />
  );
}

function InlineEditor({
  editing,
  field,
  session,
  onSave,
}: {
  editing: JournalEditing;
  field: JournalField;
  session: ActiveJournalSession;
  onSave: () => void;
}) {
  const inputRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const control =
      inputRef.current?.querySelector<HTMLElement>(
        'input:not([type="hidden"]), select, textarea'
      ) ?? inputRef.current?.querySelector<HTMLElement>('button');
    control?.focus();
  }, []);

  return (
    <DisplayPolicyProvider privacyModeOverride={false}>
      <DateDraftGateContext.Provider value={editing.dateDraftGate}>
        <div
          ref={inputRef}
          className="journalit-trade-inline-editor"
          data-selection={field.kind === 'selection' ? field.id : undefined}
          {...shareCaptureExcludeProps}
          onKeyDown={(event) => {
            if (
              event.defaultPrevented ||
              event.nativeEvent.isComposing ||
              event.key === 'Process'
            )
              return;
            if (event.key === 'Escape') {
              event.preventDefault();
              event.stopPropagation();
              editing.cancel();
            }
            
            if (
              event.key === 'Enter' &&
              field.kind === 'custom' &&
              field.definition.type === CustomFieldType.NUMBER
            ) {
              event.preventDefault();
              onSave();
            }
          }}
        >
          <fieldset
            disabled={editing.saving}
            className="journalit-trade-inline-control"
          >
            <InlineFieldControl
              editing={editing}
              field={field}
              session={session}
            />
            <div className="journalit-trade-inline-actions">
              <button
                type="button"
                className="journalit-trade-inline-action"
                onClick={onSave}
              >
                {editing.saving
                  ? t('tradelog.settings.saving')
                  : t('button.save')}
              </button>
              <button
                type="button"
                className="journalit-trade-inline-action"
                onClick={editing.cancel}
              >
                {t('button.cancel')}
              </button>
            </div>
          </fieldset>
        </div>
      </DateDraftGateContext.Provider>
    </DisplayPolicyProvider>
  );
}

function InlineEditTrigger({
  editing,
  field,
  empty,
  children,
}: {
  editing: JournalEditing;
  field: JournalField;
  empty: boolean;
  children: React.ReactNode;
}) {
  const valueId = useId();
  return (
    <button
      type="button"
      className="journalit-trade-inline-trigger"
      aria-label={`${t('button.edit')} ${field.label}`}
      aria-describedby={valueId}
      disabled={editing.loadingField !== null || editing.saving}
      onClick={() => void editing.begin(field)}
      {...shareCaptureUnwrapProps}
    >
      <span id={valueId} className="journalit-trade-inline-display">
        {editing.loadingField === fieldKey(field) ? (
          t('common.loading')
        ) : empty ? (
          <span
            className="journalit-trade-review-context-empty"
            {...shareCaptureExcludeProps}
          >
            {t('button.add')}
          </span>
        ) : (
          children
        )}
      </span>
      <span
        className="journalit-trade-inline-hint"
        aria-hidden="true"
        {...shareCaptureExcludeProps}
      >
        <Edit size={13} />
      </span>
    </button>
  );
}


export function TradeReviewEditableValue({
  editing,
  field,
  children,
  empty = false,
}: {
  editing: JournalEditing;
  field: JournalField;
  children: React.ReactNode;
  empty?: boolean;
}) {
  if (!editing.enabled) return <>{children}</>;
  const key = fieldKey(field);
  const session =
    editing.session !== null && fieldKey(editing.session.field) === key
      ? editing.session
      : null;
  const fieldError =
    editing.error?.fieldId === key ? editing.error.message : undefined;
  const saveFromControl = () => {
    void editing.save().catch(() => {
      // intentional
    });
  };

  return (
    <div className="journalit-trade-inline-value">
      {session ? (
        <InlineEditor
          editing={editing}
          field={field}
          session={session}
          onSave={saveFromControl}
        />
      ) : (
        <InlineEditTrigger editing={editing} field={field} empty={empty}>
          {children}
        </InlineEditTrigger>
      )}
      {fieldError && (
        <div
          className="journalit-trade-inline-error"
          role="alert"
          {...shareCaptureExcludeProps}
        >
          {fieldError}
        </div>
      )}
    </div>
  );
}

const PASTE_CONTEXT = { contextType: 'generic', multiple: true } as const;


export function TradeReviewEditableMedia({
  plugin,
  tradePath,
  editing,
  children,
  empty,
}: {
  plugin: JournalitPlugin;
  tradePath: string;
  editing: Pick<JournalEditing, 'trackUpload'>;
  children: (thumbnailActions: React.ReactNode) => React.ReactNode;
  empty: boolean;
}) {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(0);
  const [dragging, setDragging] = useState(false);
  const saveImage = async (file: File) => {
    setPending((count) => count + 1);
    try {
      return await editing.trackUpload(
        plugin.tradeService.addTradeJournalImage(tradePath, file)
      );
    } finally {
      setPending((count) => count - 1);
    }
  };
  
  
  const uploadDroppedFiles = async (files: File[]) => {
    const results = await Promise.allSettled(files.map(saveImage));
    setError(
      results
        .flatMap((result) =>
          result.status === 'rejected'
            ? [
                result.reason instanceof Error
                  ? result.reason.message
                  : String(result.reason),
              ]
            : []
        )
        .join('; ')
    );
  };
  const uploader = (
    <div className="journalit-trade-inline-media-controls">
      <ImageUploader
        variant={empty ? 'dropzone' : 'thumbnail'}
        label={t('button.upload-image')}
        multiple
        enableDragDrop
        enablePaste
        pasteContext={PASTE_CONTEXT}
        saveImageFunction={saveImage}
        onUploadStart={() => setError('')}
        onImageUploaded={() => undefined}
        onError={(cause) =>
          setError((previous) =>
            previous ? `${previous}; ${cause.message}` : cause.message
          )
        }
      />
    </div>
  );
  return (
    <div
      className={`journalit-trade-inline-media${dragging ? ' is-dragging' : ''}`}
      {...(empty ? shareCaptureExcludeProps : {})}
      onDropCapture={() => {
        setDragging(false);
        setError('');
      }}
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes('Files')) {
          event.preventDefault();
          setDragging(true);
        }
      }}
      onDragLeaveCapture={(event) => {
        const NodeType = event.currentTarget.ownerDocument.defaultView?.Node;
        if (
          !NodeType ||
          !(event.relatedTarget instanceof NodeType) ||
          !event.currentTarget.contains(event.relatedTarget)
        )
          setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
        const files = imageService.getMediaFromDataTransfer(event.dataTransfer);
        void uploadDroppedFiles(files);
      }}
    >
      {empty ? uploader : children(uploader)}
      {pending > 0 && (
        <div role="status" {...shareCaptureExcludeProps}>
          {t('tradelog.settings.saving')}
        </div>
      )}
      {error && (
        <div
          className="journalit-trade-inline-error"
          role="alert"
          {...shareCaptureExcludeProps}
        >
          {error}
        </div>
      )}
    </div>
  );
}
