

import { useEffect, useRef } from 'react';
import { eventBus } from '../services/events';
import type { EventName, EventMap, EventCallback } from '../services/events';


export function useEventBus<K extends EventName>(
  event: K,
  handler: EventCallback<K>,
  enabled: boolean = true
): void {
  
  const savedHandler = useRef<EventCallback<K>>(handler);

  
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    
    const eventHandler = ((payload: EventMap[K]) => {
      if (payload !== undefined) {
        (savedHandler.current as (p: EventMap[K]) => void)(payload);
      } else {
        (savedHandler.current as () => void)();
      }
    }) as EventCallback<K>;

    
    const unsubscribe = eventBus.subscribe(event, eventHandler);

    
    return unsubscribe;
  }, [event, enabled]);
}


export function useEventBusMultiple<K extends EventName>(
  events: K[],
  handler: () => void,
  enabled: boolean = true
): void {
  const savedHandler = useRef<() => void>(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const unsubscribes: Array<() => void> = [];

    for (const event of events) {
      const eventHandler = (() => {
        savedHandler.current();
      }) as EventCallback<K>;

      unsubscribes.push(eventBus.subscribe(event, eventHandler));
    }

    
    return () => {
      for (const unsubscribe of unsubscribes) {
        unsubscribe();
      }
    };
  }, [events, enabled]);
}
