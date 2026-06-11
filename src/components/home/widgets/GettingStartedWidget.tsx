

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle,
  ChevronRight,
  Circle,
} from '../../shared/icons/ObsidianIcon';
import { Notice } from 'obsidian';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { DeviceFlowSignInModal } from '../../auth/DeviceFlowSignInModal';
import { useEventBus } from '../../../hooks/useEventBus';
import { useBackendProEntitlement } from '../../../hooks/useBackendProEntitlement';
import { ensureHomeWidgetStyles } from '../../../styles/homeWidgetStyles';
import { TRADE_LOG_VIEW_TYPE } from '../../../views/TradeLogView';
import { TEMPLATE_BUILDER_VIEW_TYPE } from '../../../views/TemplateBuilderView';

interface GettingStartedWidgetProps {
  plugin: JournalitPlugin;
  tradeCount: number | null;
}

export const GettingStartedWidget = memo<GettingStartedWidgetProps>(
  ({ plugin, tradeCount }) => {
    const [openedTradeLog, setOpenedTradeLog] = useState(
      () =>
        plugin.uiStateManager.getState().gettingStartedOpenedTradeLog ?? false
    );
    const [openedLayoutBuilder, setOpenedLayoutBuilder] = useState(
      () =>
        plugin.uiStateManager.getState().gettingStartedOpenedLayoutBuilder ??
        false
    );

    useEffect(() => {}, []);

    const { isAuthenticated, isPro } = useBackendProEntitlement(
      plugin,
      'getting started pro checklist'
    );
    const hasTrade = tradeCount !== null && tradeCount > 0;
    const isProComplete = isPro;

    const markOpenedTradeLog = useCallback(() => {
      setOpenedTradeLog(true);
      void plugin.uiStateManager.updateState({
        gettingStartedOpenedTradeLog: true,
      });
    }, [plugin]);

    const markOpenedLayoutBuilder = useCallback(() => {
      setOpenedLayoutBuilder(true);
      void plugin.uiStateManager.updateState({
        gettingStartedOpenedLayoutBuilder: true,
      });
    }, [plugin]);

    const handleAddTrade = useCallback(async () => {
      try {
        await plugin.viewManager.openTradeFormView();
      } catch (error) {
        console.error('[GettingStarted] Failed to open trade form:', error);
        new Notice(t('notice.error.open-journalit'));
      }
    }, [plugin]);

    const handleOpenTradeLog = useCallback(async () => {
      try {
        await plugin.viewManager.openTradeLogView();
        markOpenedTradeLog();
      } catch (error) {
        console.error('[GettingStarted] Failed to open trade log:', error);
        new Notice(
          t('notice.error.open-trade-log', {
            error: error instanceof Error ? error.message : String(error),
          })
        );
      }
    }, [plugin, markOpenedTradeLog]);

    const handleOpenLayoutBuilder = useCallback(async () => {
      try {
        await plugin.viewManager.openTemplateBuilderView();
        markOpenedLayoutBuilder();
      } catch (error) {
        console.error('[GettingStarted] Failed to open layout builder:', error);
        new Notice(
          t('notice.error.open-layout-builder', {
            error: error instanceof Error ? error.message : String(error),
          })
        );
      }
    }, [plugin, markOpenedLayoutBuilder]);

    const handleActivatePro = useCallback(() => {
      if (!isAuthenticated) {
        const modal = new DeviceFlowSignInModal(
          plugin.app,
          plugin,
          () => {
            new Notice(t('notice.login-success'));
          },
          () => {
            // intentional
          }
        );

        modal.open();
        return;
      }

      if (!isPro) {
        
        import('../../modals/UpgradeModal')
          .then(({ openUpgradeModal }) => {
            openUpgradeModal(
              plugin.app,
              plugin,
              t('home.widget.getting-started.item.pro.title')
            );
          })
          .catch((error) => {
            console.error(
              '[GettingStarted] Failed to load UpgradeModal:',
              error
            );
            new Notice(t('notice.error.open-upgrade-modal'));
          });
      }
    }, [plugin, isAuthenticated, isPro]);

    
    const handleRecentItemsChanged = useCallback(() => {
      const recentItems = plugin.uiStateManager.getState().recentItems || [];
      const mostRecent = recentItems[0];

      if (mostRecent?.type !== 'view') {
        return;
      }

      if (mostRecent.viewType === TRADE_LOG_VIEW_TYPE && !openedTradeLog) {
        markOpenedTradeLog();
      }

      if (
        mostRecent.viewType === TEMPLATE_BUILDER_VIEW_TYPE &&
        !openedLayoutBuilder
      ) {
        markOpenedLayoutBuilder();
      }
    }, [
      plugin,
      openedTradeLog,
      openedLayoutBuilder,
      markOpenedTradeLog,
      markOpenedLayoutBuilder,
    ]);

    useEventBus('recent-items:changed', handleRecentItemsChanged);

    useEffect(() => {
      
      handleRecentItemsChanged();
    }, [handleRecentItemsChanged]);

    const checklistItems = useMemo(
      () => [
        {
          id: 'create-trade',
          title: t('home.widget.getting-started.item.create.title'),
          description: t('home.widget.getting-started.item.create.description'),
          time: t('home.widget.getting-started.item.create.time'),
          cta: t('home.widget.getting-started.item.create.cta'),
          onClick: handleAddTrade,
          completed: hasTrade,
        },
        {
          id: 'open-tradelog',
          title: t('home.widget.getting-started.item.tradelog.title'),
          description: t(
            'home.widget.getting-started.item.tradelog.description'
          ),
          time: t('home.widget.getting-started.item.tradelog.time'),
          cta: t('home.widget.getting-started.item.tradelog.cta'),
          onClick: handleOpenTradeLog,
          completed: openedTradeLog,
        },
        {
          id: 'open-layout-builder',
          title: t('home.widget.getting-started.item.layouts.title'),
          description: t(
            'home.widget.getting-started.item.layouts.description'
          ),
          time: t('home.widget.getting-started.item.layouts.time'),
          cta: t('home.widget.getting-started.item.layouts.cta'),
          onClick: handleOpenLayoutBuilder,
          completed: openedLayoutBuilder,
        },
        {
          id: 'activate-pro',
          title: t('home.widget.getting-started.item.pro.title'),
          description: t('home.widget.getting-started.item.pro.description'),
          time: t('home.widget.getting-started.item.pro.time'),
          cta: t('home.widget.getting-started.item.pro.cta'),
          onClick: handleActivatePro,
          completed: isProComplete,
        },
      ],
      [
        handleAddTrade,
        handleOpenTradeLog,
        handleOpenLayoutBuilder,
        handleActivatePro,
        hasTrade,
        openedTradeLog,
        openedLayoutBuilder,
        isProComplete,
      ]
    );

    const completedCount = checklistItems.filter(
      (item) => item.completed
    ).length;
    const progressLabel =
      tradeCount === null
        ? t('home.widget.getting-started.progress.loading')
        : t('home.widget.getting-started.progress', {
            completed: String(completedCount),
            total: String(checklistItems.length),
          });

    return (
      <div className="journalit-home-getting-started">
        <div className="journalit-home-getting-started__header">
          <span className="journalit-home-getting-started__title">
            {t('home.widget.getting-started.name')}
          </span>
          <span className="journalit-home-getting-started__progress">
            {progressLabel}
          </span>
        </div>

        <div className="journalit-home-getting-started__list">
          {checklistItems.map((item) => {
            const isClickable = !item.completed;
            const itemClassName = [
              'journalit-home-getting-started__item',
              isClickable
                ? 'journalit-home-getting-started__item--clickable jl-widget-hover'
                : 'journalit-home-getting-started__item--static',
            ].join(' ');
            const itemContent = (
              <>
                <div className="journalit-home-getting-started__item-icon">
                  {item.completed ? (
                    <CheckCircle
                      size={16}
                      className="journalit-home-getting-started__item-icon--complete"
                    />
                  ) : (
                    <Circle
                      size={16}
                      className="journalit-home-getting-started__item-icon--pending"
                    />
                  )}
                </div>

                <div className="journalit-home-getting-started__item-body">
                  <div className="journalit-home-getting-started__item-header">
                    <span className="journalit-home-getting-started__item-title">
                      {item.title}
                    </span>
                    <span className="journalit-home-getting-started__item-time">
                      {item.time}
                    </span>
                  </div>

                  <div className="journalit-home-getting-started__item-description">
                    {item.description}
                  </div>
                </div>

                {isClickable && (
                  <div className="journalit-home-getting-started__item-chevron">
                    <ChevronRight
                      size={14}
                      className="journalit-home-getting-started__item-chevron-icon"
                    />
                  </div>
                )}
              </>
            );

            if (!isClickable) {
              return (
                <div key={item.id} className={itemClassName}>
                  {itemContent}
                </div>
              );
            }

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={item.onClick}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  item.onClick();
                }}
                className={itemClassName}
                aria-label={item.title}
              >
                {itemContent}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

GettingStartedWidget.displayName = 'GettingStartedWidget';
