

import React, { memo, useEffect } from 'react';
import { Tooltip } from '../Tooltip';

interface MistakesBadgeProps {
  items: string | string[] | undefined | null;
}

const TooltipContent = memo<{ mistakes: string[] }>(({ mistakes }) => (
  <div className="badge-tooltip mistakes-tooltip">
    <div className="tooltip-title">Mistakes:</div>
    {mistakes.map((mistake) => (
      <div key={mistake} className="tooltip-item">
        • {mistake}
      </div>
    ))}
  </div>
));
TooltipContent.displayName = 'MistakesTooltipContent';

export const MistakesBadge = memo<MistakesBadgeProps>(({ items }) => {
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
      content={<TooltipContent mistakes={itemsArray} />}
      delay={0}
      preferredPosition="top"
    >
      <span className="journalit-count-badge journalit-count-badge--mistakes">
        {itemsArray.length}
      </span>
    </Tooltip>
  );
});
MistakesBadge.displayName = 'MistakesBadge';
