


export class Mutex {
  private locked: boolean = false;
  private queue: Array<() => void> = [];

  
  tryLock(): boolean {
    if (this.locked) {
      return false;
    }
    this.locked = true;
    return true;
  }

  
  async lock(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    
    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }

  
  unlock(): void {
    if (!this.locked) {
      console.warn('Mutex.unlock() called but mutex was not locked');
      return;
    }

    const nextInQueue = this.queue.shift();
    if (nextInQueue) {
      
      nextInQueue();
    } else {
      
      this.locked = false;
    }
  }

  
  isLocked(): boolean {
    return this.locked;
  }

  
  async withLock<T>(fn: () => Promise<T>): Promise<T> {
    await this.lock();
    try {
      return await fn();
    } finally {
      this.unlock();
    }
  }
}
