

import React, { memo, useState, useEffect, useCallback } from 'react';
import { FileText, File, Clock } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { RecentItem } from '../../../settings/types';
import { HOME_VIEW_TYPE } from '../../../views/HomeView';
import { ONBOARDING_VIEW_TYPE } from '../../../views/OnboardingView';
import { TEMPLATE_BUILDER_VIEW_TYPE } from '../../../views/TemplateBuilderView';
import { safeParseDateValue, safeGetTime } from '../../../utils/dateUtils';
import { resolveIcon } from '../../../utils/iconResolver';
import { useEventBus } from '../../../hooks/useEventBus';
import { ensureHomeWidgetStyles } from '../../../styles/homeWidgetStyles';
import { t } from '../../../lang/helpers';

interface RecentItemsWidgetProps {
  plugin: JournalitPlugin;
}

export const RecentItemsWidget = memo<RecentItemsWidgetProps>(({ plugin }) => {
  const [recentItems, setRecentItems] = useState<RecentItem[]>(
    plugin.uiStateManager.getState().recentItems || []
  );

  useEffect(() => {}, []);

  
  const [_journalPath, setJournalPath] = useState<string>('!Journalit');

  
  const handleRecentItemsChanged = useCallback(() => {
    
    setRecentItems(plugin.uiStateManager.getState().recentItems || []);
  }, [plugin]);

  useEventBus('recent-items:changed', handleRecentItemsChanged);

  
  useEffect(() => {
    const fetchJournalPath = async () => {
      if (plugin.serviceManager?.getFolderPathService) {
        try {
          const service = await plugin.serviceManager.getFolderPathService();
          setJournalPath(service.journalFolderPath);
        } catch (error) {
          console.error('Failed to get journal folder path:', error);
        }
      }
    };

    void fetchJournalPath();
  }, [plugin.serviceManager]);

  
  const filteredItems = recentItems
    .filter((item) => {
      
      if (item.type === 'view' && item.viewType === HOME_VIEW_TYPE)
        return false;

      
      if (
        plugin.settings.home?.filterRecentItemsToJournalit &&
        item.type === 'file'
      ) {
        
        const folderPathService = plugin.serviceManager?.getFolderPathService();

        if (!folderPathService || !item.path) return false;

        
        return folderPathService.isJournalPath(item.path);
      }

      return true;
    })
    .slice(0, 5);

  const getItemIcon = (
    item: RecentItem
  ): React.ComponentType<{ size?: number; className?: string }> => {
    if (item.type === 'view' && item.icon) {
      return resolveIcon(item.icon, File);
    }

    
    if (item.type === 'file' && item.title) {
      const title = item.title.toLowerCase();

      
      if (title.includes('drc') || title.includes('daily report card')) {
        return resolveIcon('calendar', FileText);
      }

      
      if (
        title.includes('weekly review') ||
        title.includes('week review') ||
        /w\d+-review/.test(title)
      ) {
        return resolveIcon('calendar-check', FileText);
      }

      
      if (
        title.includes('monthly review') ||
        title.includes('month review') ||
        /^\d+-review/.test(title)
      ) {
        return resolveIcon('calendar-range', FileText);
      }
    }

    if (item.type === 'file') return resolveIcon('file-text', FileText);

    return resolveIcon('file', File);
  };

  const handleItemClick = async (item: RecentItem) => {
    try {
      if (item.type === 'file' && item.path) {
        await plugin.openFile(item.path, true);
      } else if (item.type === 'view' && item.viewType) {
        switch (item.viewType) {
          case 'journalit-dashboard-view':
            await plugin.viewManager.openDashboardView();
            break;
          case 'account-dashboard':
            await plugin.viewManager.openAccountDashboardView();
            break;
          case 'journalit-trade-log-view':
            await plugin.viewManager.openTradeLogView();
            break;
          case 'journalit-csv-import-view':
            await plugin.viewManager.openCSVImportView();
            break;
          case 'journalit-account-page-view': {
            
            const accountName = item.title.replace(/^Account:\s*/, '');
            await plugin.viewManager.openAccountPageView(accountName);
            break;
          }
          case ONBOARDING_VIEW_TYPE:
            await plugin.viewManager.openOnboardingView();
            break;
          case TEMPLATE_BUILDER_VIEW_TYPE:
            await plugin.viewManager.openTemplateBuilderView();
            break;
          default:
            console.warn('Unknown view type:', item.viewType);
        }
      }
    } catch (error) {
      console.error('Failed to open recent item:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = safeParseDateValue(dateString);
    if (!date) {
      return t('home.widget.recent.unknown');
    }

    const now = new Date();
    const dateTime = safeGetTime(date);
    const nowTime = safeGetTime(now);

    if (!dateTime || !nowTime) {
      return t('home.widget.recent.unknown');
    }

    const diffMs = nowTime - dateTime;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return t('home.widget.recent.just-now');
    if (diffMinutes < 60)
      return t('home.widget.recent.minutes-ago', {
        minutes: String(diffMinutes),
      });
    if (diffHours < 24)
      return t('home.widget.recent.hours-ago', { hours: String(diffHours) });
    if (diffDays < 7)
      return t('home.widget.recent.days-ago', { days: String(diffDays) });

    return date.toLocaleDateString();
  };

  return (
    <div className="journalit-home-recent">
      
      <div className="journalit-home-widget__eyebrow journalit-home-recent__header">
        {t('home.widget.recent.title')}
      </div>

      <div className="journalit-home-recent__content">
        {filteredItems.length === 0 ? (
          <div className="journalit-home-recent__empty">
            <Clock size={32} className="journalit-home-recent__empty-icon" />
            <div className="journalit-home-recent__empty-title">
              {t('home.widget.recent.no-items')}
            </div>
            <div className="journalit-home-recent__empty-hint">
              {t('home.widget.recent.hint')}
            </div>
          </div>
        ) : (
          <div className="journalit-home-recent__list">
            {filteredItems.map((item) => {
              const IconComponent = getItemIcon(item);
              return (
                <div
                  key={`${item.type}-${item.path || item.viewType}-${item.openedAt}`}
                  role="button"
                  tabIndex={0}
                  className="jl-recent-item-hover journalit-home-recent__item"
                  onClick={() => handleItemClick(item)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    e.preventDefault();
                    handleItemClick(item);
                  }}
                >
                  <div className="journalit-home-recent__item-icon">
                    <IconComponent size={14} />
                  </div>

                  <div className="journalit-home-recent__item-body">
                    <div className="journalit-home-recent__item-title">
                      {item.title}
                    </div>
                    <div className="journalit-home-recent__item-date">
                      {formatDate(item.openedAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

RecentItemsWidget.displayName = 'RecentItemsWidget';
