


export const formatHoldTime = (milliseconds: number | undefined): string => {
  if (
    milliseconds === undefined ||
    milliseconds === null ||
    isNaN(milliseconds) ||
    milliseconds < 0
  ) {
    return '-';
  }

  
  const MS_PER_MINUTE = 1000 * 60;
  const MS_PER_HOUR = MS_PER_MINUTE * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;
  const MS_PER_MONTH = MS_PER_DAY * 30; 
  const MS_PER_YEAR = MS_PER_DAY * 365; 

  
  const years = Math.floor(milliseconds / MS_PER_YEAR);
  const monthsRemainder = milliseconds % MS_PER_YEAR;
  const months = Math.floor(monthsRemainder / MS_PER_MONTH);

  const daysRemainder = monthsRemainder % MS_PER_MONTH;
  const days = Math.floor(daysRemainder / MS_PER_DAY);

  const hoursRemainder = daysRemainder % MS_PER_DAY;
  const hours = Math.floor(hoursRemainder / MS_PER_HOUR);

  const minutesRemainder = hoursRemainder % MS_PER_HOUR;
  const minutes = Math.floor(minutesRemainder / MS_PER_MINUTE);

  
  const units: Array<{ value: number; label: string }> = [];

  if (years > 0) units.push({ value: years, label: 'y' });
  if (months > 0) units.push({ value: months, label: 'mo' });
  if (days > 0) units.push({ value: days, label: 'd' });
  if (hours > 0) units.push({ value: hours, label: 'h' });
  if (minutes > 0) units.push({ value: minutes, label: 'm' });

  
  if (units.length === 0) {
    return '<1m';
  }

  
  const significantUnits = units.slice(0, 2);

  return significantUnits.map((u) => `${u.value}${u.label}`).join(' ');
};
