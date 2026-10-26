

import { useMemo, useState } from 'react';
import type { NewsEvent } from '../../../services/weekly/types';
import {
  buildKeyEventPickerDays,
  getKeyEventColor,
  isKnownKeyEventDay,
  resolveDefaultKeyEventPickerDay,
  type KeyEventColor,
} from '../../../utils/keyEvents';
import type { KeyEventsDayPickerTile } from './KeyEventsDayPicker';

interface PickerGroup {
  day: string | undefined;
  entries: readonly { event: Pick<NewsEvent, 'color'> }[];
}

interface KeyEventDayPickerState<G extends PickerGroup> {
  
  tiles: KeyEventsDayPickerTile[] | null;
  
  selectedDay: string | null;
  visibleGroups: G[];
  showAllDays: boolean;
  
  select: (day: string) => void;
  
  reveal: (day: string) => void;
  toggleShowAllDays: () => void;
}

export function useKeyEventDayPicker<G extends PickerGroup>(
  groups: G[],
  weekStartDate: Date | null,
  currentDateTime: Date
): KeyEventDayPickerState<G> {
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [showAllDays, setShowAllDays] = useState(false);

  const picker = useMemo(() => {
    const colorsByDay = new Map<string, KeyEventColor[]>();
    for (const group of groups) {
      if (!group.day || !isKnownKeyEventDay(group.day)) continue;
      colorsByDay.set(
        group.day,
        group.entries.map(({ event }) => getKeyEventColor(event.color))
      );
    }
    if (colorsByDay.size === 0) return null;

    const days = buildKeyEventPickerDays(
      new Set(colorsByDay.keys()),
      weekStartDate,
      currentDateTime
    );
    return {
      tiles: days.map(({ day, date, isToday, isPast }) => ({
        day,
        date,
        colors: colorsByDay.get(day) ?? [],
        isToday,
        isPast,
      })),
      defaultDay: resolveDefaultKeyEventPickerDay(days),
    };
  }, [currentDateTime, groups, weekStartDate]);

  
  
  const activeDay =
    pickedDay !== null && groups.some((group) => group.day === pickedDay)
      ? pickedDay
      : (picker?.defaultDay ?? null);

  
  const visibleGroups =
    picker === null || showAllDays
      ? groups
      : groups.filter(
          (group) =>
            !group.day ||
            !isKnownKeyEventDay(group.day) ||
            group.day === activeDay
        );

  return {
    tiles: picker?.tiles ?? null,
    selectedDay: showAllDays ? null : activeDay,
    visibleGroups,
    showAllDays,
    select: (day) => {
      setPickedDay(day);
      setShowAllDays(false);
    },
    reveal: (day) => {
      if (isKnownKeyEventDay(day)) setPickedDay(day);
    },
    toggleShowAllDays: () => setShowAllDays((current) => !current),
  };
}
