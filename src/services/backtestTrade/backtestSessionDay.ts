

let rememberedDay: Date | undefined;

export function rememberBacktestSessionDay(date: Date): void {
  rememberedDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getBacktestSessionDay(): Date | undefined {
  return rememberedDay ? new Date(rememberedDay) : undefined;
}

export function clearBacktestSessionDay(): void {
  rememberedDay = undefined;
}
