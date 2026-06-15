

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type KeyboardEvent,
} from 'react';

interface AccordionConfig {
  duration: {
    open: number;
    close: number;
  };
  easing: string;
  stagger: {
    opacity: number;
  };
}

const DEFAULT_CONFIG: AccordionConfig = {
  duration: { open: 150, close: 150 },
  easing: 'ease-in-out',
  stagger: { opacity: 50 },
};


export const useOptimizedAccordion = (
  initialExpanded = false,
  animationConfig: AccordionConfig = DEFAULT_CONFIG
) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const collapseTimeoutRef = useRef<number | null>(null);

  
  useEffect(() => {
    setIsExpanded(initialExpanded);
  }, [initialExpanded]);

  
  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) {
        window.clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTransitionEnd = (e: TransitionEvent) => {
      
      if (
        e.target === container &&
        e.propertyName === 'height' &&
        isCollapsing
      ) {
        setIsCollapsing(false);
        if (collapseTimeoutRef.current) {
          window.clearTimeout(collapseTimeoutRef.current);
          collapseTimeoutRef.current = null;
        }
      }
    };

    container.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      container.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [isCollapsing]);

  
  useEffect(() => {
    if (isExpanded && contentRef.current && !isCollapsing) {
      window.requestAnimationFrame(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      });
    }
  }, [isExpanded, isCollapsing]);

  
  useEffect(() => {
    if (!contentRef.current || !isExpanded || isCollapsing) return;
    if (typeof ResizeObserver === 'undefined') return;

    let debounceTimeout: number;

    const resizeObserver = new ResizeObserver((entries) => {
      if (isCollapsing) return;

      window.clearTimeout(debounceTimeout);
      debounceTimeout = window.setTimeout(() => {
        if (isCollapsing) return;

        for (const entry of entries) {
          if (
            entry.target === contentRef.current &&
            isExpanded &&
            !isCollapsing
          ) {
            const newHeight = contentRef.current.scrollHeight;
            setContentHeight((prevHeight) =>
              prevHeight !== newHeight ? newHeight : prevHeight
            );
          }
        }
      }, 50);
    });

    resizeObserver.observe(contentRef.current);

    return () => {
      window.clearTimeout(debounceTimeout);
      resizeObserver.disconnect();
    };
  }, [isExpanded, isCollapsing]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => {
      if (prev) {
        
        setIsCollapsing(true);

        if (collapseTimeoutRef.current) {
          window.clearTimeout(collapseTimeoutRef.current);
        }

        
        collapseTimeoutRef.current = window.setTimeout(() => {
          setIsCollapsing(false);
          collapseTimeoutRef.current = null;
        }, animationConfig.duration.close + 10);
      } else {
        
        setIsCollapsing(false);
        if (collapseTimeoutRef.current) {
          window.clearTimeout(collapseTimeoutRef.current);
          collapseTimeoutRef.current = null;
        }
      }
      return !prev;
    });
  }, [animationConfig.duration.close]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleExpanded();
      }
    },
    [toggleExpanded]
  );

  const remeasureContent = useCallback(() => {
    if (contentRef.current && isExpanded && !isCollapsing) {
      window.requestAnimationFrame(() => {
        if (contentRef.current && !isCollapsing) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      });
    }
  }, [isExpanded, isCollapsing]);

  return {
    isExpanded,
    isCollapsing,
    contentHeight,
    toggleExpanded,
    handleKeyDown,
    remeasureContent,
    contentRef,
    containerRef,
  };
};
