interface CoalescedWriterOptions {
  delayMs: number;
  maxDelayMs: number;
  writeSnapshot: () => Promise<void>;
  onScheduledWriteError: (error: unknown) => void;
}


export class CoalescedWriter {
  private generation = 0;
  private persistedGeneration = 0;
  private timerId: number | null = null;
  private writeInFlight: Promise<void> | null = null;
  private disposed = false;
  private autoRetriedGeneration = -1;
  private dirtySinceMs: number | null = null;

  constructor(private readonly options: CoalescedWriterOptions) {}

  public get isDirty(): boolean {
    return this.persistedGeneration < this.generation;
  }

  public markDirty(options: { defer?: boolean } = {}): void {
    if (this.disposed) return;
    this.generation += 1;
    if (!options.defer) this.schedule(true);
  }

  public scheduleIfDirty(): void {
    this.schedule(false);
  }

  public async flush(): Promise<void> {
    this.cancelTimer();
    await this.flushPendingWrites();
  }

  public async dispose(): Promise<void> {
    this.disposed = true;
    this.cancelTimer();
    await this.flushPendingWrites();
  }

  private schedule(restartTimer: boolean): void {
    if (this.disposed || !this.isDirty) return;
    if (!restartTimer && this.timerId !== null) return;

    this.cancelTimer();
    this.dirtySinceMs ??= Date.now();
    const elapsedMs = Math.max(0, Date.now() - this.dirtySinceMs);
    const delayMs = Math.max(
      0,
      Math.min(this.options.delayMs, this.options.maxDelayMs - elapsedMs)
    );

    this.timerId = window.setTimeout(() => {
      this.timerId = null;
      void this.writeCurrentGeneration()
        .then(() => {
          if (this.isDirty) this.schedule(false);
        })
        .catch((error: unknown) => {
          this.options.onScheduledWriteError(error);
          if (this.isDirty && this.autoRetriedGeneration !== this.generation) {
            this.autoRetriedGeneration = this.generation;
            this.dirtySinceMs = null;
            this.schedule(true);
          }
        });
    }, delayMs);
  }

  private cancelTimer(): void {
    if (this.timerId === null) return;
    window.clearTimeout(this.timerId);
    this.timerId = null;
  }

  private async writeCurrentGeneration(): Promise<void> {
    if (!this.isDirty) return;

    if (this.writeInFlight) {
      await this.writeInFlight;
      return;
    }

    const generation = this.generation;
    this.dirtySinceMs = null;
    const writePromise = this.options.writeSnapshot();
    this.writeInFlight = writePromise;
    try {
      await writePromise;
      this.persistedGeneration = generation;
    } finally {
      if (this.writeInFlight === writePromise) {
        this.writeInFlight = null;
      }
    }
  }

  private async flushPendingWrites(): Promise<void> {
    if (this.writeInFlight) {
      await this.writeInFlight;
      return this.flushPendingWrites();
    }

    if (this.isDirty) {
      await this.writeCurrentGeneration();
      return this.flushPendingWrites();
    }
  }
}
