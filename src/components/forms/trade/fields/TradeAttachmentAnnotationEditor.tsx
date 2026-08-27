import React from 'react';
import type JournalitPlugin from '../../../../main';
import { t } from '../../../../lang/helpers';
import type { ImageAnnotation } from '../../../../types/imageAnnotations';
import { ImageAnnotationFields } from '../../../shared/imageAnnotation/ImageAnnotationFields';
import { Button } from '../../../ui/Button';
import { getMediaDisplayName } from '../../../../utils/imageMediaUtils';

interface TradeAttachmentAnnotationEditorProps {
  plugin: JournalitPlugin;
  imagePath: string;
  value: ImageAnnotation;
  onChange: (annotation: ImageAnnotation) => void;
  onCancel: () => void;
  onDone: () => void;
}

export const TradeAttachmentAnnotationEditor: React.FC<
  TradeAttachmentAnnotationEditorProps
> = ({ plugin, imagePath, value, onChange, onCancel, onDone }) => {
  const fileName = getMediaDisplayName(imagePath);

  return (
    <section className="journalit-trade-attachment-annotation">
      <header className="journalit-trade-attachment-annotation__header">
        <h3>
          {t('imageGallery.annotation.editor-title-with-file', { fileName })}
        </h3>
      </header>
      <ImageAnnotationFields
        plugin={plugin}
        value={value}
        onChange={onChange}
      />
      <footer className="journalit-trade-attachment-annotation__actions">
        <Button
          type="button"
          onClick={onCancel}
          size="medium"
          variant="secondary"
        >
          {t('button.cancel')}
        </Button>
        <Button type="button" onClick={onDone} size="medium" variant="primary">
          {t('button.done')}
        </Button>
      </footer>
    </section>
  );
};

TradeAttachmentAnnotationEditor.displayName = 'TradeAttachmentAnnotationEditor';
