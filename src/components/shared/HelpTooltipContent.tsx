

import React from 'react';

interface HelpTooltipContentProps {
  title: string;
  description: string;
  example?: string;
}

export const HelpTooltipContent: React.FC<HelpTooltipContentProps> = ({
  title,
  description,
  example,
}) => (
  <div className="journalit-help-tooltip">
    <strong>{title}</strong>
    <p>{description}</p>
    {example ? (
      <p className="journalit-help-tooltip__example">{example}</p>
    ) : null}
  </div>
);
