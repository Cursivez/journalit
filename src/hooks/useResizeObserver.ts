

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

    
    
    if (plugin) {
      plugin.registerEvent(plugin.app.workspace.on('resize', debouncedResize));
    }

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
      
    };
  }, [threshold, plugin]);

  return isCompact;
}
