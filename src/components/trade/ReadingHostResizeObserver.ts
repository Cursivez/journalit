
export class ReadingHostResizeObserver {
  private observers = new Map<Element, ResizeObserver>();
  private heights = new WeakMap<Element, number>();
  private pending = new Set<() => void>();
  private timeout: number | null = null;

  observe(host: HTMLElement, onResize: () => void): void {
    
    
    for (const [target, observer] of this.observers) {
      if (target.isConnected) continue;
      observer.disconnect();
      this.observers.delete(target);
      this.heights.delete(target);
    }
    if (this.observers.has(host)) return;
    const ownerWindow = host.ownerDocument.defaultView;
    if (!ownerWindow) return;
    const observer = new ownerWindow.ResizeObserver((entries) => {
      for (const { target, contentRect } of entries) {
        if (!target.isConnected) {
          observer.disconnect();
          this.observers.delete(target);
          this.heights.delete(target);
          
          
          this.pending.add(onResize);
          continue;
        }
        
        if (contentRect.height === 0) {
          this.heights.delete(target);
          this.pending.delete(onResize);
          continue;
        }
        if (this.heights.get(target) === contentRect.height) continue;
        this.heights.set(target, contentRect.height);
        this.pending.add(onResize);
      }
      if (this.pending.size === 0) return;
      if (this.timeout !== null) window.clearTimeout(this.timeout);
      this.timeout = window.setTimeout(() => {
        this.timeout = null;
        const pending = [...this.pending];
        this.pending.clear();
        for (const remeasure of pending) remeasure();
      }, 100);
    });
    this.observers.set(host, observer);
    observer.observe(host);
  }

  disconnect(): void {
    for (const observer of this.observers.values()) observer.disconnect();
    this.observers.clear();
    if (this.timeout !== null) window.clearTimeout(this.timeout);
    this.timeout = null;
    this.pending.clear();
    this.heights = new WeakMap();
  }
}
