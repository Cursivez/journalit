import React, { useCallback, useRef, useState } from 'react';
import { t } from '../../../lang/helpers';

interface HomeGreetingTitleProps {
  prefix: string;
  suffix: string;
  displayName: string;
  onSaveDisplayName: (displayName: string) => Promise<void>;
}

export const HomeGreetingTitle: React.FC<HomeGreetingTitleProps> = ({
  prefix,
  suffix,
  displayName,
  onSaveDisplayName,
}) => {
  const [draft, setDraft] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const saveInFlightRef = useRef(false);
  const visibleDisplayName = displayName || t('home.greeting.name-placeholder');
  const editDisplayNameLabel = t('home.greeting.edit-name-aria', {
    name: visibleDisplayName,
  });
  const sizingDisplayName = isEditing
    ? draft || t('home.greeting.name-placeholder')
    : visibleDisplayName;

  const startEditing = useCallback(() => {
    setDraft(displayName);
    setIsEditing(true);
  }, [displayName]);

  const saveDraft = useCallback(async () => {
    if (saveInFlightRef.current) {
      return;
    }

    const normalizedDisplayName = draft.trim();
    if (normalizedDisplayName === displayName) {
      setIsEditing(false);
      return;
    }

    saveInFlightRef.current = true;
    try {
      await onSaveDisplayName(normalizedDisplayName);
      setIsEditing(false);
    } catch {
      // intentional
      
    } finally {
      saveInFlightRef.current = false;
    }
  }, [displayName, draft, onSaveDisplayName]);

  return (
    <h1 className="journalit-home-greeting-title">
      <span className="journalit-home-greeting-normal">{prefix}</span>
      <span className="journalit-home-greeting-name-editor">
        <span aria-hidden="true" className="journalit-home-greeting-name-sizer">
          {sizingDisplayName}
        </span>
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => void saveDraft()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                event.preventDefault();
                void saveDraft();
              } else if (event.key === 'Escape') {
                event.preventDefault();
                setIsEditing(false);
              }
            }}
            placeholder={t('home.greeting.name-placeholder')}
            aria-label={t('settings.general.display-name-aria')}
            className="journalit-home-greeting-name-input"
          />
        ) : (
          <button
            type="button"
            onClick={startEditing}
            aria-label={editDisplayNameLabel}
            className={`journalit-home-greeting-name${displayName ? '' : ' is-placeholder'}`}
          >
            {visibleDisplayName}
          </button>
        )}
      </span>
      <span className="journalit-home-greeting-normal">{suffix}</span>
    </h1>
  );
};
