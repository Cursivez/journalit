
export function getSetupHistoryDateRange(): {
  startDate: Date;
  endDate: Date;
} {
  return {
    startDate: new Date(0),
    endDate: new Date('9999-12-30T00:00:00.000Z'),
  };
}
