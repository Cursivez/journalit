export class SampleJournalNetworkBlockedError extends Error {
  constructor() {
    super('Network activity is disabled while the sample journal is active');
    this.name = 'SampleJournalNetworkBlockedError';
  }
}

export class DemoSyncGate {
  private static sampleContextActive = false;

  static activate(): void {
    this.sampleContextActive = true;
  }

  static deactivate(): void {
    this.sampleContextActive = false;
  }

  static isActive(): boolean {
    return this.sampleContextActive;
  }

  static assertNetworkAllowed(): void {
    if (this.sampleContextActive) {
      throw new SampleJournalNetworkBlockedError();
    }
  }
}
