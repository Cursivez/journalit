

import { useEffect, useRef } from 'react';
import { eventBus } from '../services/events';
import type { EventName, EventMap, EventCallback } from '../services/events';

type EventBusHandler<K extends EventName> = EventMap[K] extends void
  ? EventCallback<K>
  : EventCallback<K>;


export function useEventBus<K extends EventName>(
  event: K,
  handler: EventBusHandler<K>,
  enabled: boolean = true
): void {
  
  const savedHandler = useRef<EventBusHandler<K>>(handler);

  
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    
    const eventHandler: EventCallback<K> = (payload) => {
      void savedHandler.current(payload);
    };

    
    const unsubscribe = eventBus.subscribe(event, eventHandler);

    
    return unsubscribe;
  }, [event, enabled]);
}


export function useEventBusMultiple<K extends EventName>(
  events: K[],
  handler: () => void | Promise<void>,
  enabled: boolean = true
): void {
  const savedHandler = useRef<() => void | Promise<void>>(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const unsubscribes: Array<() => void> = [];
    const eventHandler = (): void => {
      void savedHandler.current();
    };

    for (const event of events) {
      unsubscribes.push(eventBus.subscribe(event, eventHandler));
    }

    
    return () => {
      for (const unsubscribe of unsubscribes) {
        unsubscribe();
      }
    };
  }, [events, enabled]);
}
