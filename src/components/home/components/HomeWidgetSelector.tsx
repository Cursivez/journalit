

import React, { useMemo } from 'react';
import { Plus } from '../../shared/icons/ObsidianIcon';
import { AVAILABLE_HOME_WIDGETS, type HomeWidgetCategory } from '../homeTypes';
import type { HomeSettings, QuickLinkButton } from '../../../settings/types';
import { resolveIcon } from '../../../utils/iconResolver';
import { hasTranslation, t } from '../../../lang/helpers';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { HOME_WIDGET_SELECTOR_TARGET_ID } from '../../../guides/homeGuideIds';
import {
  WidgetPreviewDrawer,
  type WidgetDrawerAction,
  type WidgetDrawerItem,
  type WidgetDrawerTab,
} from '../../shared/widgetDrawer/WidgetPreviewDrawer';
import { HOME_WIDGET_PREVIEWS } from './homeWidgetPreviews';
import { getHomeWidgetInstanceLabel } from './homeWidgetInstanceLabels';
import { getCurrentStreakConfig } from '../../../utils/currentStreakConfig';

interface HomeWidgetSelectorProps {
  activeWidgets: string[];
  
  homeSettings: HomeSettings | undefined;
  hiddenQuickLinks: QuickLinkButton[];
  onAddWidget: (widgetId: string) => void | Promise<void>;
  onRemoveWidget: (widgetId: string) => void | Promise<void>;
  onRestoreQuickLink: (quickLinkId: string) => void | Promise<void>;
  onOpenEntityShortcuts: () => void;
  onClose: () => void;
}

const QUICK_LINKS_TAB_ID = 'quick-links';

const CATEGORY_LABEL_KEYS = {
  performance: 'home.widget-selector.tab.performance',
  accounts: 'home.widget-selector.tab.accounts',
  workflow: 'home.widget-selector.tab.workflow',
} as const satisfies Record<HomeWidgetCategory, string>;


const sortByGridPosition = (
  instanceIds: string[],
  homeSettings: HomeSettings | undefined
): string[] => {
  const layout =
    homeSettings?.layouts[homeSettings.activeLayout || 'Default']?.lg ?? [];
  const position = new Map(layout.map((item) => [item.i, item]));
  return [...instanceIds].sort((a, b) => {
    const itemA = position.get(a);
    const itemB = position.get(b);
    if (!itemA || !itemB) return 0;
    return itemA.y - itemB.y || itemA.x - itemB.x;
  });
};

export const HomeWidgetSelector: React.FC<HomeWidgetSelectorProps> = React.memo(
  ({
    activeWidgets,
    homeSettings,
    hiddenQuickLinks,
    onAddWidget,
    onRemoveWidget,
    onRestoreQuickLink,
    onOpenEntityShortcuts,
    onClose,
  }) => {
    const registerWidgetSelectorTarget = useGuideTarget(
      HOME_WIDGET_SELECTOR_TARGET_ID
    );

    const tabs = useMemo<WidgetDrawerTab[]>(
      () => [
        ...Object.entries(CATEGORY_LABEL_KEYS).map(([id, labelKey]) => ({
          id,
          label: t(labelKey),
        })),
        {
          id: QUICK_LINKS_TAB_ID,
          label: t('home.widget-selector.section.quick-links'),
        },
      ],
      []
    );

    const items = useMemo<WidgetDrawerItem[]>(() => {
      
      
      
      
      const instancesByType: Record<string, string[]> = {};
      for (const widgetId of activeWidgets) {
        const baseType = widgetId.split('-')[0];
        (instancesByType[baseType] ??= []).push(widgetId);
      }

      return AVAILABLE_HOME_WIDGETS.flatMap((widget) => {
        const renderPreview = HOME_WIDGET_PREVIEWS[widget.id];
        const base: WidgetDrawerItem = {
          id: widget.id,
          name: widget.name,
          description: widget.description,
          tabId: widget.category,
          renderPreview: () => renderPreview(),
          inUse: !widget.configurable && activeWidgets.includes(widget.id),
        };
        if (!widget.configurable) return [base];

        const instances = sortByGridPosition(
          instancesByType[widget.id] ?? [],
          homeSettings
        );
        const labels = instances.map(
          (instanceId) =>
            getHomeWidgetInstanceLabel(homeSettings, widget.id, instanceId) ??
            widget.name
        );
        return [
          { ...base, addedCount: instances.length },
          ...instances.map((instanceId, index) => {
            
            const label = labels[index];
            const duplicates = labels.filter((other) => other === label);
            const ordinal =
              duplicates.length > 1
                ? ` ${labels.slice(0, index + 1).filter((other) => other === label).length}`
                : '';
            return {
              id: instanceId,
              name: widget.name,
              detail: `${label}${ordinal}`,
              description: widget.description,
              tabId: widget.category,
              renderPreview: () =>
                renderPreview({
                  label,
                  streakKind:
                    widget.id === 'currentStreak'
                      ? getCurrentStreakConfig(homeSettings, instanceId).kind
                      : undefined,
                }),
              inUse: true,
            };
          }),
        ];
      });
    }, [activeWidgets, homeSettings]);

    const actions = useMemo<WidgetDrawerAction[]>(
      () => [
        {
          id: 'entity-shortcut',
          label: t('home.widget-selector.add-shortcut'),
          icon: Plus,
          emphasis: true,
          onSelect: onOpenEntityShortcuts,
        },
        ...hiddenQuickLinks.map((quickLink) => {
          const labelKey = `home.quick-links.${quickLink.id}`;
          const label = hasTranslation(labelKey) ? t(labelKey) : labelKey;
          return {
            id: `quick-link-${quickLink.id}`,
            label,
            ariaLabel: `${t('home.widget-selector.restore')}: ${label}`,
            icon: resolveIcon(quickLink.icon),
            onSelect: () => onRestoreQuickLink(quickLink.id),
          };
        }),
      ],
      [hiddenQuickLinks, onOpenEntityShortcuts, onRestoreQuickLink]
    );

    return (
      <WidgetPreviewDrawer
        title={t('home.widget-selector.title')}
        subtitle={t('home.widget-selector.subtitle')}
        tabs={tabs}
        items={items}
        actionGroup={{ tabId: QUICK_LINKS_TAB_ID, actions }}
        onAdd={onAddWidget}
        onRemove={onRemoveWidget}
        onClose={onClose}
        panelRef={registerWidgetSelectorTarget}
      />
    );
  }
);

HomeWidgetSelector.displayName = 'HomeWidgetSelector';
