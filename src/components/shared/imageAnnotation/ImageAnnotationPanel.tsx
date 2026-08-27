import React, { useReducer } from 'react';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import type { ImageAnnotation } from '../../../types/imageAnnotations';
import { Button } from '../../ui/Button';
import { ImageAnnotationFields } from './ImageAnnotationFields';

interface ImageAnnotationEditorState {
  annotation: ImageAnnotation;
  saving: boolean;
  error: string | null;
}

type ImageAnnotationEditorAction =
  | { type: 'setAnnotation'; value: ImageAnnotation }
  | { type: 'saving' }
  | { type: 'saveFailed'; error: string };

function imageAnnotationEditorReducer(
  state: ImageAnnotationEditorState,
  action: ImageAnnotationEditorAction
): ImageAnnotationEditorState {
  switch (action.type) {
    case 'setAnnotation':
      return { ...state, annotation: action.value };
    case 'saving':
      return { ...state, saving: true, error: null };
    case 'saveFailed':
      return { ...state, saving: false, error: action.error };
  }
}

interface ImageAnnotationPanelProps {
  plugin: JournalitPlugin;
  imagePath: string;
  initialAnnotation: ImageAnnotation;
  targetRef?: (element: HTMLElement | null) => void;
  onClose: () => void;
  onSave: (annotation: ImageAnnotation) => Promise<void>;
}

export const ImageAnnotationPanel: React.FC<ImageAnnotationPanelProps> = ({
  plugin,
  imagePath,
  initialAnnotation,
  targetRef,
  onClose,
  onSave,
}) => {
  const [state, dispatch] = useReducer(imageAnnotationEditorReducer, {
    annotation: {
      tags: [...initialAnnotation.tags],
      notes: initialAnnotation.notes,
    },
    saving: false,
    error: null,
  });
  const fileName = imagePath.split('/').pop() || imagePath;

  const handleSave = async () => {
    dispatch({ type: 'saving' });
    try {
      await onSave(state.annotation);
    } catch (saveError) {
      console.error('Failed to save image annotation:', saveError);
      dispatch({
        type: 'saveFailed',
        error: t('imageGallery.annotation.error.save-failed'),
      });
    }
  };

  return (
    <aside
      className="journalit-image-annotation-panel"
      ref={targetRef}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <header className="journalit-image-annotation-editor__header">
        <h2>
          {t('imageGallery.annotation.editor-title-with-file', { fileName })}
        </h2>
      </header>

      <ImageAnnotationFields
        plugin={plugin}
        value={state.annotation}
        onChange={(value) => dispatch({ type: 'setAnnotation', value })}
      />

      {state.error ? (
        <p className="journalit-image-annotation-editor__error">
          {state.error}
        </p>
      ) : null}

      <footer className="journalit-image-annotation-editor__actions journalit-modal-actions">
        <Button
          onClick={onClose}
          size="medium"
          variant="secondary"
          className="journalit-modal-actions__cancel cancel-button"
        >
          {t('button.cancel')}
        </Button>
        <Button
          onClick={() => void handleSave()}
          size="medium"
          variant="primary"
          disabled={state.saving}
          className="journalit-modal-actions__primary accent-button modal-save-accent"
        >
          {state.saving
            ? t('imageGallery.annotation.saving')
            : t('button.save')}
        </Button>
      </footer>
    </aside>
  );
};

ImageAnnotationPanel.displayName = 'ImageAnnotationPanel';
