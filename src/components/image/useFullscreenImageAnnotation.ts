import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { Notice, TFile } from 'obsidian';
import { t } from '../../lang/helpers';
import { ImageGalleryService } from '../../services/imageGallery/ImageGalleryService';
import type { FullscreenImageViewerProps } from '../../types/image';
import type { ImageAnnotation } from '../../types/imageAnnotations';
import { usePlugin } from '../../hooks/usePlugin';
import { resolveVaultMediaFile } from '../../utils/imageMediaUtils';

interface FullscreenAnnotationTarget {
  imagePath: string;
  sourcePath: string;
  annotation: ImageAnnotation;
  persistence: 'note' | 'folder';
}

interface FullscreenAnnotationState {
  isAnnotating: boolean;
  isLoading: boolean;
  target: FullscreenAnnotationTarget | null;
}

type FullscreenAnnotationAction =
  | { type: 'open' }
  | { type: 'loading' }
  | { type: 'loaded'; target: FullscreenAnnotationTarget }
  | { type: 'close' }
  | {
      type: 'close-target';
      imagePath: string;
      sourcePath: string;
    };

const CLOSED_ANNOTATION_STATE: FullscreenAnnotationState = {
  isAnnotating: false,
  isLoading: false,
  target: null,
};

function fullscreenAnnotationReducer(
  state: FullscreenAnnotationState,
  action: FullscreenAnnotationAction
): FullscreenAnnotationState {
  switch (action.type) {
    case 'open':
      return { isAnnotating: true, isLoading: true, target: null };
    case 'loading':
      return { isAnnotating: true, isLoading: true, target: null };
    case 'loaded':
      return { isAnnotating: true, isLoading: false, target: action.target };
    case 'close':
      return CLOSED_ANNOTATION_STATE;
    case 'close-target':
      return state.target?.imagePath === action.imagePath &&
        state.target.sourcePath === action.sourcePath
        ? CLOSED_ANNOTATION_STATE
        : state;
  }
}

interface UseFullscreenImageAnnotationOptions {
  annotationOptions: FullscreenImageViewerProps['annotationOptions'];
  imagePath: string;
  sourcePath: string;
}

export function useFullscreenImageAnnotation({
  annotationOptions,
  imagePath,
  sourcePath,
}: UseFullscreenImageAnnotationOptions) {
  const plugin = usePlugin();
  const annotationService = useMemo(
    () => (plugin ? new ImageGalleryService(plugin) : null),
    [plugin]
  );
  const [state, dispatch] = useReducer(
    fullscreenAnnotationReducer,
    CLOSED_ANNOTATION_STATE
  );
  const customLoadAnnotation = annotationOptions?.loadAnnotation;
  const customSaveAnnotation = annotationOptions?.saveAnnotation;
  const customLoadAnnotationRef = useRef(customLoadAnnotation);
  const customSaveAnnotationRef = useRef(customSaveAnnotation);
  const hasCustomAdapter = Boolean(
    customLoadAnnotation && customSaveAnnotation
  );
  const sourceFile =
    plugin && sourcePath
      ? plugin.app.vault.getAbstractFileByPath(sourcePath)
      : null;
  const hasNoteAdapter =
    sourceFile instanceof TFile && sourceFile.extension === 'md';
  const resolvedMediaFile =
    plugin && sourceFile instanceof TFile && sourceFile.extension !== 'md'
      ? resolveVaultMediaFile(plugin.app, imagePath, sourcePath)
      : null;
  const hasMediaAdapter =
    sourceFile instanceof TFile &&
    sourceFile.extension !== 'md' &&
    resolvedMediaFile?.path === sourceFile.path;

  const canAnnotate =
    annotationOptions?.enabled !== false &&
    Boolean(plugin) &&
    (hasCustomAdapter || hasNoteAdapter || hasMediaAdapter);

  useEffect(() => {
    customLoadAnnotationRef.current = customLoadAnnotation;
    customSaveAnnotationRef.current = customSaveAnnotation;
  }, [customLoadAnnotation, customSaveAnnotation]);

  useEffect(() => {
    if (!state.isAnnotating) return;
    if (!canAnnotate) {
      dispatch({ type: 'close' });
      return;
    }

    let cancelled = false;
    dispatch({ type: 'loading' });

    const loadCurrentAnnotation = async () => {
      try {
        const customLoader = customLoadAnnotationRef.current;
        let annotation: ImageAnnotation;
        if (customLoader) {
          annotation = await customLoader(imagePath);
        } else {
          if (!annotationService) {
            throw new Error('Image annotation service unavailable');
          }
          annotation = await annotationService.getEffectiveImageAnnotation(
            sourcePath,
            imagePath
          );
        }
        if (cancelled) return;
        dispatch({
          type: 'loaded',
          target: {
            imagePath,
            sourcePath,
            annotation,
            persistence: hasMediaAdapter ? 'folder' : 'note',
          },
        });
      } catch (error) {
        if (cancelled) return;
        console.error('Failed to load image annotation:', error);
        dispatch({ type: 'close' });
        new Notice(t('imageGallery.annotation.error.load-failed'));
      }
    };

    void loadCurrentAnnotation();
    return () => {
      cancelled = true;
    };
  }, [
    annotationService,
    canAnnotate,
    hasMediaAdapter,
    imagePath,
    sourcePath,
    state.isAnnotating,
  ]);

  const open = useCallback(() => {
    dispatch({ type: 'open' });
  }, []);

  const close = useCallback(() => {
    dispatch({ type: 'close' });
  }, []);

  const save = useCallback(
    async (annotation: ImageAnnotation) => {
      if (!state.target) return;
      const savedTarget = state.target;
      const customSaver = customSaveAnnotationRef.current;
      if (customSaver) {
        await customSaver(savedTarget.imagePath, annotation);
      } else {
        if (!annotationService) {
          throw new Error('Image annotation service unavailable');
        }
        await annotationService.updateImageAnnotation(
          savedTarget.sourcePath,
          savedTarget.imagePath,
          annotation,
          savedTarget.persistence === 'folder' ? 'folder' : undefined
        );
      }
      dispatch({
        type: 'close-target',
        imagePath: savedTarget.imagePath,
        sourcePath: savedTarget.sourcePath,
      });
    },
    [annotationService, state.target]
  );

  const activeTarget =
    state.target?.imagePath === imagePath &&
    state.target.sourcePath === sourcePath
      ? state.target
      : null;

  return {
    plugin,
    canAnnotate,
    isAnnotating: state.isAnnotating,
    isLoading: state.isLoading,
    target: activeTarget,
    open,
    close,
    save,
  };
}
