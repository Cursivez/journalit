import React, {
  useCallback,
  useId,
  useState,
  useSyncExternalStore,
} from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { useEventBus } from '../../../hooks/useEventBus';
import { eventBus } from '../../../services/events/EventBus';
import { ensureHomeSettings } from '../../homeSettings';
import {
  readHomeWidgetOpacities,
  normalizeHomeWidgetOpacity,
} from '../../homeWidgetOpacity';

export function HomeWidgetOpacityControl({
  plugin,
  ownerDocument = window.activeDocument,
}: {
  plugin: JournalitPlugin;
  ownerDocument?: Document;
}) {
  
  const subscribeToTheme = useCallback(
    (onChange: () => void) => {
      const observer = new MutationObserver(onChange);
      observer.observe(ownerDocument.body, {
        attributes: true,
        attributeFilter: ['class'],
      });
      return () => observer.disconnect();
    },
    [ownerDocument]
  );
  const isLight = useSyncExternalStore(
    subscribeToTheme,
    useCallback(
      () => ownerDocument.body.classList.contains('theme-light'),
      [ownerDocument]
    )
  );
  const key = isLight ? 'widgetOpacityLight' : 'widgetOpacityDark';
  const id = useId();
  const readValues = () => readHomeWidgetOpacities(plugin.settings);
  const [values, setValues] = useState(readValues);
  const value = values[key];
  useEventBus('settings:changed', (payload) => {
    if (payload.section === 'home' || payload.section === 'all') {
      setValues(readValues());
    }
  });

  useEventBus('home:widget-opacity-changed', () => setValues(readValues()));

  const handleChange = async (nextValue: number) => {
    const opacity = normalizeHomeWidgetOpacity(nextValue);
    ensureHomeSettings(plugin.settings)[key] = opacity;
    
    
    eventBus.publish('home:widget-opacity-changed');
    try {
      await plugin.settingsManager.getDebouncedSave()();
    } catch (error) {
      console.error('Failed to save Home widget opacity:', error);
      new Notice(t('settings.general.home-widget-opacity-save-failed'));
    }
  };

  return (
    <div className="journalit-home-widget-opacity-control">
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        aria-label={t('settings.general.home-widget-opacity')}
        aria-valuetext={`${value}%`}
        onChange={(event) =>
          void handleChange(event.currentTarget.valueAsNumber)
        }
      />
      <output htmlFor={id}>{value}%</output>
    </div>
  );
}
