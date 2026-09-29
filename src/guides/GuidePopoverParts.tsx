

import React, { useLayoutEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { t } from '../lang/helpers';
import { cssVars } from '../styles/inlineStylePolicy';

interface GuideStepProgressProps {
  
  stepNumber: number;
  stepCount: number;
}


export const GuideStepProgressBar: React.FC<GuideStepProgressProps> = ({
  stepNumber,
  stepCount,
}) => {
  
  
  const position = t('guide.step-position', {
    current: String(stepNumber),
    total: String(stepCount),
  });

  return (
    <div className="journalit-view-guide-progress-group">
      {stepNumber === 1 && stepCount > 1 && (
        <span className="journalit-view-guide-step-count" aria-hidden="true">
          {t('guide.step-count', { count: String(stepCount) })}
        </span>
      )}
      <div
        className="journalit-view-guide-progress"
        role="progressbar"
        aria-label={position}
        aria-valuemin={1}
        aria-valuemax={stepCount}
        aria-valuenow={stepNumber}
        aria-valuetext={position}
      >
        <div
          className="journalit-view-guide-progress-fill"
          style={cssVars({
            '--journalit-guide-progress': `${(stepNumber / stepCount) * 100}%`,
          })}
        />
      </div>
    </div>
  );
};


const POPOVER_HEIGHT_ESTIMATE = 170;


export const useMeasuredPopoverHeight = (): [
  (element: HTMLElement | null) => void,
  number,
] => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState(POPOVER_HEIGHT_ESTIMATE);

  useLayoutEffect(() => {
    if (!element) return undefined;

    setHeight(element.offsetHeight);
    
    
    
    
    const ElementResizeObserver = (element.ownerDocument.defaultView ?? window)
      .ResizeObserver;
    const observer = new ElementResizeObserver(() => {
      flushSync(() => {
        setHeight(element.offsetHeight);
      });
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element]);

  return [setElement, height];
};
