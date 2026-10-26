

import React, { useLayoutEffect, useRef, useState } from 'react';
import { cssVars } from '../../styles/inlineStylePolicy';

interface FitTextProps {
  
  children: string;
  
  minScale?: number;
}

export const FitText: React.FC<FitTextProps> = ({
  children,
  minScale = 0.5,
}) => {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const scaleRef = useRef(1);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const fit = () => {
      
      
      const available = outer.getBoundingClientRect().width;
      
      const naturalWidth =
        inner.getBoundingClientRect().width / scaleRef.current;
      if (available <= 0 || naturalWidth <= 0) return;
      
      const fitScale = Math.floor((available / naturalWidth) * 100) / 100;
      const next = Math.max(minScale, Math.min(1, fitScale));
      if (Math.abs(next - scaleRef.current) < 0.005) return;
      scaleRef.current = next;
      setScale(next);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(outer);
    return () => observer.disconnect();
  }, [children, minScale]);

  return (
    <span
      ref={outerRef}
      className="journalit-fit-text"
      style={cssVars({ '--journalit-fit-text-scale': scale })}
    >
      <span ref={innerRef} className="journalit-fit-text__value">
        {children}
      </span>
    </span>
  );
};
