import React, { useId, useState } from 'react';
import { t } from '../../../lang/helpers';
import { Button } from '../../ui/Button';
import { SAVED_COMPARISON_NAME_MAX_LENGTH } from './dashboardComparison';


export const SaveComparisonForm: React.FC<{
  defaultName: string;
  onSave: (name: string) => void;
}> = ({ defaultName, onSave }) => {
  const [name, setName] = useState(defaultName);
  const inputId = useId();
  const canSave = name.trim().length > 0;
  return (
    <form
      className="journalit-compare-save"
      onSubmit={(event) => {
        event.preventDefault();
        if (canSave) onSave(name);
      }}
    >
      <label className="journalit-sr-only" htmlFor={inputId}>
        {t('dashboard.compare.save-name-label')}
      </label>
      <input
        id={inputId}
        className="journalit-compare-save__input"
        type="text"
        value={name}
        maxLength={SAVED_COMPARISON_NAME_MAX_LENGTH}
        placeholder={t('dashboard.compare.save-name-label')}
        onChange={(event) => setName(event.target.value)}
        
        onFocus={(event) => event.currentTarget.select()}
        data-filter-menu-item
      />
      <div className="journalit-compare-save__actions">
        <Button
          type="submit"
          variant="primary"
          size="small"
          disabled={!canSave}
        >
          {t('button.save')}
        </Button>
      </div>
    </form>
  );
};
