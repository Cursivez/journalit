import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ImageAnnotation,
  ImageAnnotations,
} from '../../../../types/imageAnnotations';
import {
  hasVisibleImageAnnotation,
  normalizeImageAnnotation,
} from '../../../../utils/imageAnnotations';

interface UseTradeAttachmentAnnotationsOptions {
  images: readonly string[];
  imageAnnotations: ImageAnnotations | undefined;
  onChange: (annotations: ImageAnnotations) => void;
}

function applyAnnotationDraft(
  annotations: ImageAnnotations,
  imagePath: string,
  draft: ImageAnnotation
): ImageAnnotations {
  const normalized = normalizeImageAnnotation(draft);
  
  
  const hadExistingEntry = imagePath in annotations;
  const nextAnnotations = { ...annotations };
  if (hasVisibleImageAnnotation(normalized) || hadExistingEntry) {
    nextAnnotations[imagePath] = normalized;
  } else {
    delete nextAnnotations[imagePath];
  }
  return nextAnnotations;
}

export function useTradeAttachmentAnnotations({
  images,
  imageAnnotations,
  onChange,
}: UseTradeAttachmentAnnotationsOptions) {
  const annotations = imageAnnotations ?? {};
  const annotationsRef = useRef<ImageAnnotations>({ ...annotations });
  const sessionBaselineRef = useRef<ImageAnnotations | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [editingImagePath, setEditingImagePath] = useState<string | null>(null);
  const [annotationDraft, setAnnotationDraft] = useState<ImageAnnotation>({
    tags: [],
  });
  const activeEditingImagePath =
    editingImagePath && images.includes(editingImagePath)
      ? editingImagePath
      : null;

  useEffect(() => {
    annotationsRef.current = imageAnnotations ? { ...imageAnnotations } : {};
  }, [imageAnnotations]);

  const updateAnnotations = useCallback(
    (nextAnnotations: ImageAnnotations) => {
      annotationsRef.current = nextAnnotations;
      onChange(nextAnnotations);
    },
    [onChange]
  );

  const revealEditor = useCallback(() => {
    window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      editorRef.current?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    });
  }, []);

  const openEditor = useCallback(
    (imagePath: string) => {
      const existingAnnotation = annotationsRef.current[imagePath];
      setAnnotationDraft(
        existingAnnotation
          ? {
              tags: [...existingAnnotation.tags],
              notes: existingAnnotation.notes,
            }
          : { tags: [] }
      );
      setEditingImagePath(imagePath);
      revealEditor();
    },
    [revealEditor]
  );

  const applyDraft = useCallback(
    (imagePath: string, draft: ImageAnnotation) => {
      updateAnnotations(
        applyAnnotationDraft(annotationsRef.current, imagePath, draft)
      );
    },
    [updateAnnotations]
  );

  const getAnnotation = useCallback((imagePath: string): ImageAnnotation => {
    const annotation = annotationsRef.current[imagePath];
    return annotation
      ? { tags: [...annotation.tags], notes: annotation.notes }
      : { tags: [] };
  }, []);

  const saveFullscreenAnnotation = useCallback(
    (imagePath: string, annotation: ImageAnnotation) => {
      applyDraft(imagePath, annotation);
      
      
      if (
        editingImagePath &&
        editingImagePath !== imagePath &&
        sessionBaselineRef.current
      ) {
        sessionBaselineRef.current = applyAnnotationDraft(
          sessionBaselineRef.current,
          imagePath,
          annotation
        );
      }
      if (editingImagePath !== imagePath) return;
      setEditingImagePath(null);
      setAnnotationDraft({ tags: [] });
      sessionBaselineRef.current = null;
    },
    [applyDraft, editingImagePath]
  );

  const handleAnnotateImage = useCallback(
    (_index: number, imagePath: string) => {
      if (activeEditingImagePath === imagePath) {
        revealEditor();
        return;
      }

      if (!activeEditingImagePath) {
        sessionBaselineRef.current = { ...annotationsRef.current };
      }
      openEditor(imagePath);
    },
    [activeEditingImagePath, openEditor, revealEditor]
  );

  const handleDraftChange = useCallback(
    (nextDraft: ImageAnnotation) => {
      setAnnotationDraft(nextDraft);
      if (activeEditingImagePath) {
        applyDraft(activeEditingImagePath, nextDraft);
      }
    },
    [activeEditingImagePath, applyDraft]
  );

  const handleSelectedImageChange = useCallback(
    (_index: number, imagePath: string) => {
      if (!activeEditingImagePath || activeEditingImagePath === imagePath)
        return;

      applyDraft(activeEditingImagePath, annotationDraft);
      openEditor(imagePath);
    },
    [activeEditingImagePath, annotationDraft, applyDraft, openEditor]
  );

  const handleDone = useCallback(() => {
    if (!activeEditingImagePath) return;

    applyDraft(activeEditingImagePath, annotationDraft);
    sessionBaselineRef.current = null;
    setEditingImagePath(null);
  }, [activeEditingImagePath, annotationDraft, applyDraft]);

  const handleCancel = useCallback(() => {
    if (sessionBaselineRef.current) {
      updateAnnotations(sessionBaselineRef.current);
    }
    sessionBaselineRef.current = null;
    setEditingImagePath(null);
  }, [updateAnnotations]);

  const removeAnnotation = useCallback(
    (imagePath: string, replacementImagePath?: string) => {
      if (imagePath in annotationsRef.current) {
        const nextAnnotations = { ...annotationsRef.current };
        delete nextAnnotations[imagePath];
        updateAnnotations(nextAnnotations);
      }

      if (sessionBaselineRef.current) {
        const nextBaseline = { ...sessionBaselineRef.current };
        delete nextBaseline[imagePath];
        sessionBaselineRef.current = nextBaseline;
      }

      if (editingImagePath === imagePath) {
        if (replacementImagePath) {
          openEditor(replacementImagePath);
        } else {
          sessionBaselineRef.current = null;
          setEditingImagePath(null);
        }
      }
    },
    [editingImagePath, openEditor, updateAnnotations]
  );

  return {
    annotations,
    editorRef,
    editingImagePath: activeEditingImagePath,
    annotationDraft,
    handleDraftChange,
    getAnnotation,
    saveAnnotation: saveFullscreenAnnotation,
    handleAnnotateImage,
    handleSelectedImageChange,
    handleDone,
    handleCancel,
    removeAnnotation,
  };
}
