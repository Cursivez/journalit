

import React from 'react';
import {
  Server,
  RefreshCw,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
} from '../../../components/shared/icons/ObsidianIcon';
import { Button } from '../../../components/ui';
import { t } from '../../../lang/helpers';

interface StatusCardsProps {
  
  connectionStatus: 'connected' | 'disconnected' | 'unknown';
  onRefreshConnection: () => void | Promise<void>;

  
  lastSyncTime?: string;
  syncCount: number;
  isSyncing: boolean;
  onForceSync: () => void | Promise<void>;

  
  accountCount: number;
  onManageAccounts: () => void | Promise<void>;
}

export const StatusCards: React.FC<StatusCardsProps> = ({
  connectionStatus,
  onRefreshConnection,
  lastSyncTime,
  syncCount,
  isSyncing,
  onForceSync,
  accountCount,
  onManageAccounts,
}) => {
  const formatLastSync = (timestamp?: string): string => {
    if (!timestamp) return t('backend.sync.never');

    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return t('backend.sync.just-now');
      if (diffMins < 60)
        return t('backend.sync.minutes-ago', { count: String(diffMins) });
      if (diffHours < 24)
        return t('backend.sync.hours-ago', { count: String(diffHours) });
      if (diffDays < 7)
        return t('backend.sync.days-ago', { count: String(diffDays) });

      return date.toLocaleDateString();
    } catch {
      return t('backend.sync.invalid-date');
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <CheckCircle2
            size={18}
            className="status-icon status-icon--success"
          />
        );
      case 'disconnected':
        return (
          <AlertCircle size={18} className="status-icon status-icon--error" />
        );
      default:
        return <Clock size={18} className="status-icon status-icon--pending" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return t('backend.status.connected');
      case 'disconnected':
        return t('backend.status.disconnected');
      default:
        return t('backend.status.checking');
    }
  };

  return (
    <div className="status-cards">
      
      <div className={`status-card status-card--${connectionStatus}`}>
        <div className="status-card-header">
          <Server size={20} />
          <span>{t('backend.cards.connection.title')}</span>
        </div>
        <div className="status-card-content">
          <div className="status-card-value">
            {getConnectionIcon()}
            <span>{getConnectionText()}</span>
          </div>
        </div>
        <div className="status-card-actions">
          <Button
            variant="secondary"
            onClick={() => void onRefreshConnection()}
          >
            <RefreshCw size={14} />
            {t('backend.cards.connection.refresh')}
          </Button>
        </div>
      </div>

      
      <div className="status-card">
        <div className="status-card-header">
          <RefreshCw size={20} />
          <span>{t('backend.cards.sync.title')}</span>
        </div>
        <div className="status-card-content">
          <div className="status-card-metric">
            <span className="metric-value">{formatLastSync(lastSyncTime)}</span>
            <span className="metric-label">
              {t('backend.cards.sync.last-sync')}
            </span>
          </div>
          <div className="status-card-metric">
            <span className="metric-value">{syncCount}</span>
            <span className="metric-label">
              {t('backend.cards.sync.total')}
            </span>
          </div>
        </div>
        <div className="status-card-actions">
          <Button
            variant="primary"
            onClick={() => void onForceSync()}
            disabled={isSyncing || connectionStatus !== 'connected'}
          >
            {isSyncing ? (
              <>
                <RefreshCw
                  size={14}
                  className="status-card-action-icon spinning"
                />
                {t('backend.sync.syncing')}
              </>
            ) : (
              <>
                <RefreshCw size={14} className="status-card-action-icon" />
                {t('backend.cards.sync.button')}
              </>
            )}
          </Button>
        </div>
      </div>

      
      <div className="status-card">
        <div className="status-card-header">
          <Users size={20} />
          <span>{t('backend.cards.accounts.title')}</span>
        </div>
        <div className="status-card-content">
          <div className="status-card-metric status-card-metric--large">
            <span className="metric-value metric-value--large">
              {accountCount}
            </span>
            <span className="metric-label">
              {t('backend.cards.accounts.linked')}
            </span>
          </div>
        </div>
        <div className="status-card-actions">
          <Button
            variant="secondary"
            onClick={() => void onManageAccounts()}
            disabled={connectionStatus !== 'connected'}
          >
            {t('backend.cards.accounts.manage')}
          </Button>
        </div>
      </div>
    </div>
  );
};

StatusCards.displayName = 'StatusCards';
