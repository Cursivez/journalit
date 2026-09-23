import React, { useMemo, useState } from 'react';
import type JournalitPlugin from '../../main';
import type { HomeViewMode } from '../../settings/types';
import { readHomeWidgetOpacities } from '../../settings/homeWidgetOpacity';
import { useEventBus } from '../../hooks/useEventBus';
import { cssVars } from '../../styles/inlineStylePolicy';
import {
  getHomeBackgroundResourcePath,
  shouldShowHomeBackground,
} from './homeBackgroundUtils';


export function HomeBackgroundSurface({
  plugin,
  mode,
  children,
}: {
  plugin: JournalitPlugin;
  mode: HomeViewMode;
  children: React.ReactNode;
}) {
  const [opacities, setOpacities] = useState(() =>
    readHomeWidgetOpacities(plugin.settings)
  );
  const [homeBackgroundPath, setHomeBackgroundPath] = useState(
    plugin.settings.home?.backgroundImagePath || ''
  );
  const [showInDashboard, setShowInDashboard] = useState(
    plugin.settings.home?.showBackgroundInDashboard ?? false
  );
  const [homeBackgroundRevision, setHomeBackgroundRevision] = useState(() =>
    Date.now()
  );
  const refreshHomeVisuals = (refreshImage: boolean) => {
    setOpacities(readHomeWidgetOpacities(plugin.settings));
    setHomeBackgroundPath(plugin.settings.home?.backgroundImagePath || '');
    setShowInDashboard(
      plugin.settings.home?.showBackgroundInDashboard ?? false
    );
    if (refreshImage) setHomeBackgroundRevision(Date.now());
  };

  useEventBus('home:widget-opacity-changed', () => refreshHomeVisuals(false));
  useEventBus('settings:changed', (payload) => {
    if (
      payload.section === 'all' ||
      (payload.section === 'home' &&
        (payload.source === 'background-image' ||
          payload.source === 'background-dashboard-visibility'))
    ) {
      refreshHomeVisuals(
        payload.section === 'all' || payload.source === 'background-image'
      );
    }
  });

  const resourcePath = useMemo(() => {
    const path = getHomeBackgroundResourcePath(plugin.app, homeBackgroundPath);
    if (!path) return null;
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}journalit-home=${homeBackgroundRevision}`;
  }, [homeBackgroundPath, homeBackgroundRevision, plugin]);
  const showBackground = shouldShowHomeBackground(
    resourcePath,
    mode,
    showInDashboard
  );

  return (
    <div
      className={
        showBackground
          ? 'journalit-home-page journalit-home-page--custom-background'
          : 'journalit-home-page'
      }
      data-mode={mode}
      style={cssVars({
        '--journalit-home-widget-opacity-light': `${opacities.widgetOpacityLight}%`,
        '--journalit-home-widget-opacity-dark': `${opacities.widgetOpacityDark}%`,
        '--journalit-home-background-image': showBackground
          ? `url(${JSON.stringify(resourcePath)})`
          : null,
      })}
    >
      {children}
    </div>
  );
}
