import React from 'react';
import { t } from '../../lang/helpers';
import {
  DEFAULT_TAG_PICKER_COLOR,
  normalizeLabelColor,
  type LabelColor,
} from '../../types/labelColor';

interface LabelColorPickerProps {
  value?: LabelColor | null;
  onChange: (color: LabelColor | null) => void;
  fallbackColor?: LabelColor;
  showLabel?: boolean;
  disabled?: boolean;
}

export const LabelColorPicker: React.FC<LabelColorPickerProps> = ({
  value,
  onChange,
  fallbackColor = DEFAULT_TAG_PICKER_COLOR,
  showLabel = true,
  disabled = false,
}) => {
  const hasColor = value !== null && value !== undefined;

  return (
    <div className="journalit-label-color-picker">
      <label className="journalit-label-color-picker__label">
        {showLabel && <span>{t('common.color.label')}</span>}
        <input
          type="color"
          className="journalit-label-color-picker__input"
          aria-label={t('common.color.label')}
          value={value ?? fallbackColor}
          onClick={() => {
            if (!hasColor) onChange(fallbackColor);
          }}
          onChange={(event) =>
            onChange(normalizeLabelColor(event.target.value) ?? null)
          }
          disabled={disabled}
        />
      </label>
      {hasColor && (
        <button
          type="button"
          className="journalit-label-color-picker__reset"
          onClick={() => onChange(null)}
          disabled={disabled}
        >
          {t('button.reset')}
        </button>
      )}
    </div>
  );
};
