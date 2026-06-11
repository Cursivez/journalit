

import type { EventMap, EventName, EventCallback, Unsubscribe } from './types';

import { backgroundIssuesStore } from '../diagnostics/BackgroundIssuesStore';


export class EventBus {
  private static instance: EventBus | null = null;

  
  private listeners: Map<EventName, Set<EventCallback<EventName>>> = new Map();

  private constructor() {
    // intentional
  }

  
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  
  public static resetInstance(): void {
    if (EventBus.instance) {
      EventBus.instance.cleanup();
      EventBus.instance = null;
    }
  }

  
  public subscribe<K extends EventName>(
    event: K,
    callback: EventCallback<K>
  ): Unsubscribe {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const callbacks = this.listeners.get(event)!;
    callbacks.add(callback as EventCallback<EventName>);

    
    return () => {
      callbacks.delete(callback as EventCallback<EventName>);
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  
  public publish<K extends EventName>(
    event: K,
    ...args: EventMap[K] extends void ? [] : [EventMap[K]]
  ): void {
    const payload = args[0];

    
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      for (const callback of callbacks) {
        try {
          if (payload !== undefined) {
            (callback as (p: EventMap[K]) => void)(payload);
          } else {
            (callback as () => void)();
          }
        } catch (error) {
          console.error(`Error in EventBus callback for ${event}:`, error);

          const errorMessage =
            error instanceof Error
              ? error.message
              : typeof error === 'string'
                ? error
                : 'Unknown error';

          backgroundIssuesStore.captureError(
            {
              key: `EventBus:${String(event)}:${errorMessage}`,
              source: 'EventBus',
              level: 'error',
              message: `EventBus callback failed (${String(event)})`,
            },
            error
          );
        }
      }
    }
  }

  
  public getSubscriberCount(event: EventName): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  
  public getRegisteredEvents(): EventName[] {
    return Array.from(this.listeners.keys());
  }

  
  public cleanup(): void {
    this.listeners.clear();
  }
}


export const eventBus = EventBus.getInstance();
