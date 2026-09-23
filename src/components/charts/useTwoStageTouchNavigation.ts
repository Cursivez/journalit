import { useCallback, useEffect, useRef } from 'react';

const TOUCH_CLICK_WINDOW_MS = 1000;
const TOUCH_ARM_WINDOW_MS = 5000;

interface StoppableChartEvent {
  stopPropagation(): void;
}

interface KeyboardChartEvent extends StoppableChartEvent {
  key: string;
  preventDefault(): void;
}


export function useTwoStageTouchNavigation<Key>(resetKey?: string) {
  const touchedPointRef = useRef<{ key: Key; at: number } | null>(null);
  const armedTouchPointRef = useRef<{ key: Key; at: number } | null>(null);

  useEffect(() => {
    armedTouchPointRef.current = null;
  }, [resetKey]);

  const recordTouch = useCallback((key: Key) => {
    touchedPointRef.current = { key, at: Date.now() };
  }, []);

  const handleClick = useCallback(
    (key: Key, event: StoppableChartEvent, navigate: () => void) => {
      event.stopPropagation();

      const touchedPoint = touchedPointRef.current;
      const isTouchClick =
        touchedPoint !== null &&
        Object.is(touchedPoint.key, key) &&
        Date.now() - touchedPoint.at < TOUCH_CLICK_WINDOW_MS;
      touchedPointRef.current = null;

      if (
        isTouchClick &&
        (!armedTouchPointRef.current ||
          !Object.is(armedTouchPointRef.current.key, key) ||
          Date.now() - armedTouchPointRef.current.at >= TOUCH_ARM_WINDOW_MS)
      ) {
        armedTouchPointRef.current = { key, at: Date.now() };
        return;
      }

      armedTouchPointRef.current = null;
      window.setTimeout(navigate, 0);
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: KeyboardChartEvent, navigate: () => void) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      event.stopPropagation();
      touchedPointRef.current = null;
      armedTouchPointRef.current = null;
      window.setTimeout(navigate, 0);
    },
    []
  );

  return { handleClick, handleKeyDown, recordTouch };
}
