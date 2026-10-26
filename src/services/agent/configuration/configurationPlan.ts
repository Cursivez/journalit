
export interface PlannedConfigurationChange<Summary, Outcome = void> {
  readonly summary: Summary;
  
  execute(signal: AbortSignal): Promise<Outcome>;
}

export function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}
