type BackgroundIssueLevel = 'warning' | 'error';

interface BackgroundIssueInput {
  
  key: string;
  source: string;
  level: BackgroundIssueLevel;
  
  message: string;
  
  detail?: string;
}

interface BackgroundIssueRecord extends BackgroundIssueInput {
  count: number;
  firstSeenMs: number;
  lastSeenMs: number;
}

type Listener = () => void;

function truncateDetail(detail: string, maxChars: number = 2000): string {
  if (detail.length <= maxChars) return detail;
  return `${detail.slice(0, maxChars)}\n… (truncated)`;
}

function extractErrorDetail(error: unknown): string | undefined {
  if (error instanceof Error) {
    return truncateDetail(error.stack ?? error.message);
  }

  if (typeof error === 'string') {
    return truncateDetail(error);
  }

  try {
    return truncateDetail(JSON.stringify(error));
  } catch {
    return String(error);
  }
}

export class BackgroundIssuesStore {
  private issues = new Map<string, BackgroundIssueRecord>();
  private listeners = new Set<Listener>();

  constructor(private readonly maxUniqueIssues: number = 50) {}

  capture(input: BackgroundIssueInput): void {
    const now = Date.now();
    const existing = this.issues.get(input.key);

    if (existing) {
      this.issues.set(input.key, {
        ...existing,
        ...input,
        count: existing.count + 1,
        lastSeenMs: now,
      });
      this.emit();
      return;
    }

    this.issues.set(input.key, {
      ...input,
      count: 1,
      firstSeenMs: now,
      lastSeenMs: now,
    });

    
    if (this.issues.size > this.maxUniqueIssues) {
      let oldest: BackgroundIssueRecord | undefined;
      for (const issue of this.issues.values()) {
        if (!oldest || issue.lastSeenMs < oldest.lastSeenMs) {
          oldest = issue;
        }
      }
      if (oldest) {
        this.issues.delete(oldest.key);
      }
    }

    this.emit();
  }

  captureError(
    input: Omit<BackgroundIssueInput, 'detail'>,
    error: unknown
  ): void {
    this.capture({ ...input, detail: extractErrorDetail(error) });
  }

  getIssues(): BackgroundIssueRecord[] {
    return [...this.issues.values()].sort(
      (a, b) => b.lastSeenMs - a.lastSeenMs
    );
  }

  clear(): void {
    if (this.issues.size === 0) return;
    this.issues.clear();
    this.emit();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch {
        // intentional
      }
    }
  }
}

export const backgroundIssuesStore = new BackgroundIssuesStore();
