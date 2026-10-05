import type { AccountTransaction } from '../../../services/account/types';


export function isTimedAccountEvent({
  date,
  datePrecision,
}: Pick<AccountTransaction, 'date' | 'datePrecision'>): boolean {
  if (datePrecision !== undefined) return datePrecision === 'instant';
  return (
    date.getUTCHours() !== 0 ||
    date.getUTCMinutes() !== 0 ||
    date.getUTCSeconds() !== 0 ||
    date.getUTCMilliseconds() !== 0
  );
}


export function accountEventDateForSave({
  date,
  includeTime,
}: {
  date: Date;
  includeTime: boolean;
}): Date {
  return includeTime
    ? new Date(date)
    : new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}


export function accountEventDateForEditing({
  date,
  includeTime,
}: {
  date: Date;
  includeTime: boolean;
}): Date {
  return includeTime
    ? new Date(date)
    : new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function isFutureAccountEvent({
  date,
  includeTime,
  now,
}: {
  date: Date;
  includeTime: boolean;
  now: Date;
}): boolean {
  return includeTime
    ? date.getTime() > now.getTime()
    : Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) >
        Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}
