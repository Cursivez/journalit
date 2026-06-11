export interface StatDelta {
  value: string;
  direction: 'up' | 'down' | 'flat';
  tone?: 'green' | 'red';
  suffixKey?: 'widget.stats.vs-prev' | 'dashboard.metrics.past-30d';
}

export function createStatDelta(
  current: number,
  previous: number | undefined,
  options: {
    previousDataAvailable: boolean;
    masked: boolean;
    formatter: (value: number) => string;
    lowerIsBetter?: boolean;
    neutralTone?: boolean;
    zeroThreshold?: number;
    suffixKey?: StatDelta['suffixKey'];
  }
): StatDelta | undefined {
  if (options.masked) return undefined;
  if (!options.previousDataAvailable || previous === undefined) {
    return { value: '—', direction: 'flat', suffixKey: options.suffixKey };
  }
  if (!Number.isFinite(current) || !Number.isFinite(previous)) {
    return undefined;
  }

  const delta = current - previous;
  const zeroThreshold = options.zeroThreshold ?? 0.000001;
  if (Math.abs(delta) < zeroThreshold) {
    return { value: '—', direction: 'flat', suffixKey: options.suffixKey };
  }

  const direction = delta > 0 ? 'up' : 'down';
  const improved = options.lowerIsBetter ? delta < 0 : delta > 0;
  return {
    value: options.formatter(delta),
    direction,
    tone: options.neutralTone ? undefined : improved ? 'green' : 'red',
    suffixKey: options.suffixKey,
  };
}

export function createPeriodValueDelta(
  value: number | undefined,
  options: {
    dataAvailable: boolean;
    masked: boolean;
    formatter: (value: number) => string;
    lowerIsBetter?: boolean;
    neutralTone?: boolean;
    zeroThreshold?: number;
    suffixKey: StatDelta['suffixKey'];
  }
): StatDelta | undefined {
  if (options.masked) return undefined;
  if (
    !options.dataAvailable ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return { value: '—', direction: 'flat', suffixKey: options.suffixKey };
  }

  const zeroThreshold = options.zeroThreshold ?? 0.000001;
  if (Math.abs(value) < zeroThreshold) {
    return { value: '—', direction: 'flat', suffixKey: options.suffixKey };
  }

  const direction = value > 0 ? 'up' : 'down';
  const improved = options.lowerIsBetter ? value < 0 : value > 0;
  return {
    value: options.formatter(value),
    direction,
    tone: options.neutralTone ? undefined : improved ? 'green' : 'red',
    suffixKey: options.suffixKey,
  };
}

export function signedNumber(value: number): string {
  return `${value > 0 ? '+' : ''}${value}`;
}
