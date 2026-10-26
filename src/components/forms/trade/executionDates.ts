

import { createContext } from 'react';
import type { EntryTransaction, ExitTransaction } from './types';

type ExecutionRow = EntryTransaction | ExitTransaction;

export interface ExecutionRows {
  entries: EntryTransaction[];
  exits: ExitTransaction[];
}

function startOfCalendarDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function resolveExecutionDay(
  row: ExecutionRow | undefined,
  defaultDay: Date
): Date {
  return row?.time ?? row?.blankTimeDate ?? defaultDay;
}


export function blankTimeDateFor(
  day: Date,
  defaultDay: Date
): Date | undefined {
  return isSameCalendarDay(day, defaultDay)
    ? undefined
    : startOfCalendarDay(day);
}


export function blankTimeDateForNewRow(
  previousRow: ExecutionRow | undefined,
  defaultDay: Date
): Date | undefined {
  return previousRow
    ? blankTimeDateFor(resolveExecutionDay(previousRow, defaultDay), defaultDay)
    : undefined;
}

function moveRowToDay<T extends ExecutionRow>(
  row: T,
  toDay: Date,
  defaultDay: Date
): T {
  if (row.time) {
    const time = new Date(row.time);
    time.setFullYear(toDay.getFullYear(), toDay.getMonth(), toDay.getDate());
    return { ...row, time };
  }
  return { ...row, blankTimeDate: blankTimeDateFor(toDay, defaultDay) };
}

function moveRowsOnDay<T extends ExecutionRow>(
  rows: T[],
  fromDay: Date,
  toDay: Date,
  defaultDay: Date,
  skipIndex: number | undefined
): T[] {
  let moved = false;
  const next = rows.map((row, index) => {
    if (
      index === skipIndex ||
      !isSameCalendarDay(resolveExecutionDay(row, defaultDay), fromDay)
    ) {
      return row;
    }
    moved = true;
    return moveRowToDay(row, toDay, defaultDay);
  });
  return moved ? next : rows;
}


export function moveExecutionsOnDay(
  rows: ExecutionRows,
  fromDay: Date,
  toDay: Date,
  defaultDay: Date,
  skip?: { list: keyof ExecutionRows; index: number }
): ExecutionRows {
  if (isSameCalendarDay(fromDay, toDay)) return rows;
  return {
    entries: moveRowsOnDay(
      rows.entries,
      fromDay,
      toDay,
      defaultDay,
      skip?.list === 'entries' ? skip.index : undefined
    ),
    exits: moveRowsOnDay(
      rows.exits,
      fromDay,
      toDay,
      defaultDay,
      skip?.list === 'exits' ? skip.index : undefined
    ),
  };
}

function addCalendarDays(date: Date, days: number): Date {
  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + days);
  return shifted;
}

function calendarDaysBetween(from: Date, to: Date): number {
  
  return Math.round(
    (startOfCalendarDay(to).getTime() - startOfCalendarDay(from).getTime()) /
      86_400_000
  );
}

function shiftRowsByDays<T extends ExecutionRow>(
  rows: T[],
  days: number,
  defaultDay: Date,
  skipIndex: number | undefined
): T[] {
  return rows.map((row, index) => {
    if (index === skipIndex) return row;
    if (row.time) return { ...row, time: addCalendarDays(row.time, days) };
    return {
      ...row,
      blankTimeDate: blankTimeDateFor(
        addCalendarDays(resolveExecutionDay(row, defaultDay), days),
        defaultDay
      ),
    };
  });
}


export function applyExecutionDayEdit(
  edited: ExecutionRows,
  list: keyof ExecutionRows,
  index: number,
  previousDay: Date,
  newDay: Date,
  defaultDay: Date
): ExecutionRows {
  const days = calendarDaysBetween(previousDay, newDay);
  if (list !== 'entries' || index !== 0 || days === 0) return edited;
  return {
    entries: shiftRowsByDays(edited.entries, days, defaultDay, 0),
    exits: shiftRowsByDays(edited.exits, days, defaultDay, undefined),
  };
}


export const BacktestSessionDayContext = createContext<Date | undefined>(
  undefined
);
