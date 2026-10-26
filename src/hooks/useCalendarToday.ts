

import { useEffect, useState } from 'react';

const startOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};


export function useCalendarToday(): Date {
  const [today, setToday] = useState(startOfToday);

  useEffect(() => {
    const nextMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const timeout = window.setTimeout(
      () => setToday(startOfToday()),
      Math.max(0, nextMidnight.getTime() - Date.now())
    );
    return () => window.clearTimeout(timeout);
  }, [today]);

  return today;
}
