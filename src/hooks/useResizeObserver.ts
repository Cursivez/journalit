

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
