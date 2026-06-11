

import React, { memo, useEffect } from 'react';
import { Tooltip } from '../Tooltip';
import { injectBadgeStyles } from './badgeStyles';

interface SetupsBadgeProps {
  items: string | string[] | undefined | null;
}

const TooltipContent = memo<{ setups: string[] }>(({ setups }) => (
  <div className="badge-tooltip setups-tooltip">
    <div className="tooltip-title">Setups:</div>
    {setups.map((setup) => (
      <div key={setup} className="tooltip-item">
        • {setup}
      </div>
    ))}
  </div>
));
TooltipContent.displayName = 'SetupsTooltipContent';

export const SetupsBadge = memo<SetupsBadgeProps>(({ items }) => {
  useEffect(() => {}, []);

  
  const itemsArray = (() => {
    if (!items) return [];
    return Array.isArray(items) ? items : [items];
  })();

  if (itemsArray.length === 0) {
    return <span className="trade-no-data">-</span>;
  }

  return (
    <Tooltip
      content={<TooltipContent setups={itemsArray} />}
      delay={0}
      preferredPosition="top"
    >
      <span className="journalit-count-badge journalit-count-badge--setups">
        {itemsArray.length}
      </span>
    </Tooltip>
  );
});
SetupsBadge.displayName = 'SetupsBadge';
