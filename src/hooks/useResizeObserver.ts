

import type React from 'react';
import { useState, useEffect } from 'react';
import { usePlugin } from './usePlugin';


export function useViewportThreshold(threshold: number = 768): boolean {
  const [isCompact, setIsCompact] = useState(
    () => window.innerWidth < threshold
  );
  const plugin = usePlugin();

  useEffect(() => {
    const checkThreshold = () => {
      const shouldBeCompact = window.innerWidth < threshold;
      setIsCompact((current) => {
        
        return current !== shouldBeCompact ? shouldBeCompact : current;
      });
    };

    
    let timeoutId: number;
    const debouncedResize = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(checkThreshold, 100);
    };

    window.addEventListener('resize', debouncedResize);

    
    const workspaceResizeRef = plugin?.app.workspace.on(
      'resize',
      debouncedResize
    );

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
      if (workspaceResizeRef && plugin) {
        plugin.app.workspace.offref(workspaceResizeRef);
      }
    };
  }, [threshold, plugin]);

  return isCompact;
}

function resolveBreakpointIndex(
  width: number,
  thresholds: readonly number[]
): number {
  for (let index = 0; index < thresholds.length; index += 1) {
    if (width >= thresholds[index]) {
      return index;
    }
  }
  return thresholds.length;
}


export function useElementBreakpoint<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  thresholds: readonly number[]
): number {
  const thresholdsKey = thresholds.join(',');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const parsedThresholds = thresholdsKey.split(',').map(Number);
    const update = (width: number) => {
      
      
      if (width <= 0) return;
      setIndex((current) => {
        const next = resolveBreakpointIndex(width, parsedThresholds);
        return next === current ? current : next;
      });
    };

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        update(entry.contentRect.width);
      }
    });

    observer.observe(element);
    update(element.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, [ref, thresholdsKey]);

  return index;
}
