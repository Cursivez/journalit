

import { startTransition, useEffect, useState } from 'react';

interface Turn {
  start: () => void;
}

const waiting: Turn[] = [];
let active: Turn | null = null;

const startNextTurn = (): void => {
  active = waiting.shift() ?? null;
  active?.start();
};

const requestTurn = (start: () => void): Turn => {
  const turn: Turn = { start };
  waiting.push(turn);
  if (!active) startNextTurn();
  return turn;
};


const releaseTurn = (turn: Turn): void => {
  if (turn === active) {
    startNextTurn();
    return;
  }
  const index = waiting.indexOf(turn);
  if (index !== -1) waiting.splice(index, 1);
};


export function useWidgetDataTurn<T>(latest: T): T {
  const [shown, setShown] = useState(latest);
  useEffect(() => {
    if (Object.is(shown, latest)) return;
    const turn = requestTurn(() =>
      startTransition(() => setShown(() => latest))
    );
    
    
    
    return () => releaseTurn(turn);
  }, [latest, shown]);
  return shown;
}
