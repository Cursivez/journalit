import type {
  DemonTrackerCountMode,
  DemonTrackerSourceMode,
  DemonTrackerWidgetConfig,
} from '../../../../types/reviewV2';

const COUNT_MODES = new Set<string>(['per-trade', 'per-trading-day']);
const SOURCE_MODES = new Set<string>(['trades', 'session', 'combined']);

function isDemonTrackerCountMode(
  value: string
): value is DemonTrackerCountMode {
  return COUNT_MODES.has(value);
}

function isDemonTrackerSourceMode(
  value: string
): value is DemonTrackerSourceMode {
  return SOURCE_MODES.has(value);
}


export function parseDemonTrackerWidgetConfig(
  source: string
): DemonTrackerWidgetConfig {
  const config: DemonTrackerWidgetConfig = {};

  if (!source.trim()) {
    return config;
  }

  const lines = source.trim().split('\n');
  for (const line of lines) {
    const colonIndex = line.search(/:/);
    if (colonIndex <= 0) {
      continue;
    }

    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();

    if (key === 'countMode' && isDemonTrackerCountMode(value)) {
      config.countMode = value;
    }

    if (key === 'sourceMode' && isDemonTrackerSourceMode(value)) {
      config.sourceMode = value;
    }
  }

  return config;
}
