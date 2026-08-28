

import React from 'react';

interface BrokerActionsRowProps {
  
  className?: string;
  children: React.ReactNode;
}

export const BrokerActionsRow: React.FC<BrokerActionsRowProps> = ({
  className,
  children,
}) => (
  <div
    className={`journalit-broker-actions-row${className ? ` ${className}` : ''}`}
  >
    {children}
  </div>
);

BrokerActionsRow.displayName = 'BrokerActionsRow';

interface BrokerConnectionListProps {
  children: React.ReactNode;
}

export const BrokerConnectionList: React.FC<BrokerConnectionListProps> = ({
  children,
}) => <div className="journalit-broker-connection-list">{children}</div>;

BrokerConnectionList.displayName = 'BrokerConnectionList';

interface BrokerStatusPlaceholderProps {
  message: string;
  
  role?: 'status' | 'alert';
}

export const BrokerStatusPlaceholder: React.FC<
  BrokerStatusPlaceholderProps
> = ({ message, role }) => (
  <div className="journalit-trade-import-sync-placeholder" role={role}>
    <p>{message}</p>
  </div>
);

BrokerStatusPlaceholder.displayName = 'BrokerStatusPlaceholder';
