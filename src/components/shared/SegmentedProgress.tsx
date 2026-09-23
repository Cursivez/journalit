

import React from 'react';

interface SegmentedProgressProps {
  completed: number; 
  total: number; 
  tone?: 'neutral' | 'attention' | 'positive' | 'warning' | 'negative';
  className?: string;
}

export const SegmentedProgress: React.FC<SegmentedProgressProps> = ({
  completed,
  total,
  tone = 'neutral',
  className,
}) => {
  const filled = Math.max(0, Math.min(completed, total));
  const classNames = `journalit-segmented-progress is-${tone}${className ? ` ${className}` : ''}`;

  return (
    <span aria-hidden="true" className={classNames}>
      {Array.from({ length: total }, (_, index) => (
        <span
          className={`journalit-segmented-progress__segment${index < filled ? ' is-met' : ''}`}
          key={index}
        />
      ))}
    </span>
  );
};
