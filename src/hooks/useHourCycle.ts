import { useSyncExternalStore } from 'react';
import { eventBus } from '../services/events/EventBus';
import { getUserHourCycle } from '../utils/timeFormat';

const subscribe = (onChange: () => void) =>
  eventBus.subscribe('settings:changed', onChange);


export function useHourCycle(): ReturnType<typeof getUserHourCycle> {
  return useSyncExternalStore(subscribe, getUserHourCycle, getUserHourCycle);
}
