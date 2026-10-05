import React, { useMemo } from 'react';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { OptionType } from '../../../services/options/CustomOptionsService';
import type { ImageAnnotation } from '../../../types/imageAnnotations';
import { ComboBox } from '../../core/ComboBox';

interface ImageAnnotationFieldsProps {
  plugin: JournalitPlugin;
  value: ImageAnnotation;
  onChange: (annotation: ImageAnnotation) => void;
}

export const ImageAnnotationFields: React.FC<ImageAnnotationFieldsProps> = ({
  plugin,
  value,
  onChange,
}) => {
  const tagOptions = useMemo(() => {
    try {
      return plugin.optionsService?.getOptions(OptionType.TAG) || [];
    } catch (error) {
      console.error('Failed to load custom tag options:', error);
      return [];
    }
  }, [plugin.optionsService]);

  const handleSaveTag = async (option: string) => {
    try {
      const optionsService = plugin.optionsService;
      if (!optionsService) return;
      const added = await optionsService.addOption(OptionType.TAG, option);
      if (added) optionsService.notifyOptionsChanged();
    } catch (error) {
      console.error('Failed to save custom tag option:', error);
    }
  };

  return (
    <div className="journalit-image-annotation-fields">
      <div className="journalit-image-annotation-editor__field">
        <ComboBox
          label={t('imageGallery.annotation.tags')}
          options={tagOptions}
          value={value.tags}
          onChange={(tags) =>
            onChange({
              ...value,
              tags,
            })
          }
          isMulti
          allowCreate
          placeholder={t('imageGallery.annotation.tags-placeholder')}
          onSaveOption={handleSaveTag}
        />
      </div>

      <label className="journalit-image-annotation-editor__field">
        <span>{t('imageGallery.annotation.notes')}</span>
        <textarea
          value={value.notes ?? ''}
          onChange={(event) =>
            onChange({
              ...value,
              notes: event.target.value,
            })
          }
          placeholder={t('imageGallery.annotation.notes-placeholder')}
          rows={5}
        />
      </label>
    </div>
  );
};

ImageAnnotationFields.displayName = 'ImageAnnotationFields';
