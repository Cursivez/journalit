import { useSyncExternalStore } from 'react';
import { eventBus } from '../services/events/EventBus';
import { getUserDateFormat } from '../utils/dateUtils';

const subscribe = (onChange: () => void) =>
  eventBus.subscribe('settings:changed', onChange);


export function useDateFormat(): string {
  return useSyncExternalStore(subscribe, getUserDateFormat, getUserDateFormat);
}
